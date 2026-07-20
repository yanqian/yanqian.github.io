const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const TOOL_DIR = path.resolve(__dirname, "..");
const REPO_DIR = path.resolve(TOOL_DIR, "../..");
const runtimePath = path.join(TOOL_DIR, "publish-note.js");
const runtime = require(runtimePath).__test;

test("fenced shell comments are not Markdown headings", () => {
  const markdown = fs.readFileSync(path.join(TOOL_DIR, "fixtures/long-technical-article.md"), "utf8");
  const headings = runtime.extractHeadingLines(markdown);
  assert(headings.includes("### SSH"));
  assert(headings.includes("### tmux"));
  assert(!headings.includes("# On the Mac"));
});

test("single-token technical headings pass the Chinese quality gate", () => {
  assert.doesNotThrow(() => runtime.validateLocalizationQuality("zh", {
    title: "远程工作流",
    body: "## 工具\n\n### SSH\n\n### Tailscale\n\n### tmux\n",
    qualityAssessment: { pass: true, translation_smell_examples: [] },
  }));
});

test("long Markdown splits only at level-two section boundaries", () => {
  const fixture = fs.readFileSync(path.join(TOOL_DIR, "fixtures/long-technical-article.md"), "utf8");
  const longMarkdown = Array.from({ length: 30 }, (_, index) => fixture.replace(/^## /gm, `## ${index + 1} `)).join("\n\n");
  const chunks = runtime.splitMarkdownForLocalization(longMarkdown);
  assert(chunks.length > 1);
  assert.equal(chunks.join("\n\n").match(/^## /gm).length, longMarkdown.match(/^## /gm).length);
});

test("non-text fences remain protected while text fences remain localizable", () => {
  const fixture = fs.readFileSync(path.join(TOOL_DIR, "fixtures/long-technical-article.md"), "utf8");
  const contract = runtime.extractMarkdownContract(fixture);
  assert(contract.codeBlocks.some((block) => typeof block === "string" && block.includes("tailscale status")));
  assert(contract.codeBlocks.some((block) => block.kind === "localizable-text"));
});

test("completed chunks resume without duplicate worker calls", async () => {
  const calls = [];
  const checkpoints = [];
  const results = await runtime.processChunks(["a", "b", "c"], ["done-a"], async (chunk) => {
    calls.push(chunk);
    return `done-${chunk}`;
  }, async (index) => checkpoints.push(index));
  assert.deepEqual(results, ["done-a", "done-b", "done-c"]);
  assert.deepEqual(calls, ["b", "c"]);
  assert.deepEqual(checkpoints, [1, 2]);
});

test("live locks reject duplicate runs and stale locks do not", () => {
  const now = Date.now();
  assert(runtime.isLiveRunLock({ status: "running", updatedAt: new Date(now - 1000).toISOString() }, now, 2000));
  assert(!runtime.isLiveRunLock({ status: "running", updatedAt: new Date(now - 3000).toISOString() }, now, 2000));
});

test("AI timeout rejects stalled requests", async () => {
  await assert.rejects(runtime.withTimeout(new Promise(() => {}), 5, "test request"), /timed out/);
});

test("launcher uses command IDs, startup proof, and never QuickAdd URLs", () => {
  const launcher = fs.readFileSync(path.join(TOOL_DIR, "bin/publish-note"), "utf8");
  assert.match(launcher, /command id="quickadd:choice:/);
  assert.match(launcher, /did not update status within/);
  assert.match(launcher, /sed 's\/\^=> \/\/'/);
  assert(!launcher.includes("obsidian://quickadd"));
});

test("installed vault artifact matches the canonical runtime when available", { skip: !fs.existsSync(JSON.parse(fs.readFileSync(path.join(TOOL_DIR, "config.json"))).vaultPath) }, () => {
  const config = JSON.parse(fs.readFileSync(path.join(TOOL_DIR, "config.json")));
  const installed = path.join(config.vaultPath, config.runtimeTarget);
  const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  assert.equal(digest(installed), digest(runtimePath));
});

test("agent entrypoint points to the supported launcher and runbook", () => {
  const agents = fs.readFileSync(path.join(REPO_DIR, "AGENTS.md"), "utf8");
  assert.match(agents, /tools\/obsidian-publisher\/bin\/publish-note publish/);
  assert.match(agents, /docs\/publishing\/localization-runbook\.md/);
  assert.match(agents, /Never retrigger while a live lock exists/);
});

test("runbook and incident map recovery rules to durable controls", () => {
  const runbook = fs.readFileSync(path.join(REPO_DIR, "docs/publishing/localization-runbook.md"), "utf8");
  const incident = fs.readFileSync(path.join(REPO_DIR, "docs/publishing/incidents/2026-07-19-long-article-localization.md"), "utf8");
  const installer = fs.readFileSync(path.join(TOOL_DIR, "bin/install"), "utf8");
  assert.match(runbook, /No status transition after launch/);
  assert.match(runbook, /status=running and lock is fresh/);
  assert.match(incident, /Command-ID launcher with a required status transition/);
  assert.match(installer, /vault-README\.md/);
});
