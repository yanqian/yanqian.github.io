# Agents

This repository is the public Hugo site for `yanqian.github.io`.

This repository uses AI Agent Harness `0.3.8` in hidden layout. Agents must reconstruct context from repository files and git history, not chat history.

## Required Startup Protocol

Before planning, coding, evaluating, or resuming work:

1. Read `.agent-harness/progress.md`.
2. Read `.agent-harness/feature_list.json`.
3. Run `git log --oneline -20`.
4. Run `./init.sh`.

Full harness rules live in `.agent-harness/AGENTS.md`. For orchestrator work, run `make -C .agent-harness work` from the project root. For interactive evaluator-gated work, use `make -C .agent-harness work-fast`.

Use this repository for publishing, site structure, Hugo templates, styling, build fixes, and GitHub Pages deployment. Do not use this repository as the primary writing workspace.

## Repository Role

The writing source of truth lives in the Obsidian vault:

```text
/Users/armstrong/Library/Mobile Documents/iCloud~md~obsidian/Documents/vault-obs-yan
```

The public article projection is generated from that vault into:

```text
content/posts/Publish/
```

Keep this boundary intact:

```text
Obsidian source notes -> vault Publish/ projection -> this Hugo repo -> GitHub Pages
```

## Development Workflow State

This repository also carries agent-workflow state for disciplined site development.

Durable workflow files:

- `.agent-harness/SPEC.md`
- `.agent-harness/feature_list.json`
- `.agent-harness/progress.md`
- `.agent-harness/test_plan.md`
- `.agent-harness/runs/`
- `.agent-harness/agent-provider.json` (local, ignored configuration)
- `init.sh`
- `.agent-harness/orchestrator.py`

The workflow state files describe how requirements are discussed, scoped, verified, and advanced. They are not article source material.

## What To Edit Here

Edit this repository for:

- Hugo configuration in `hugo.toml`.
- Templates in `layouts/`.
- Homepage, taxonomy, series, and post rendering behavior.
- Styling in `assets/css/custom.css`.
- Small frontend behavior in `assets/js/`.
- Top-level site pages in `content/about.md`, `content/now.md`, `content/projects.md`, and `content/resume.md`.
- GitHub Actions and deployment fixes in `.github/`.

When changing UI behavior, prefer the existing Hugo template and CSS patterns over introducing new frameworks.

## What Not To Edit Here

Do not write or maintain article drafts in this repository.

Avoid hand-editing generated article content under:

```text
content/posts/Publish/
```

Those files are generated from Obsidian by the QuickAdd publishing workflow. If article text, title, tags, series, topics, selected state, or slug needs to change, update the source note in the Obsidian vault, run `Publish Note`, then run `Sync Published Site`.

## Obsidian Localization Publisher

The canonical implementation is versioned under `tools/obsidian-publisher/`. The operational source of truth is `docs/publishing/localization-runbook.md`.

Mandatory rules:

- Never trigger `Publish Note` through an `obsidian://quickadd` URL.
- Always run `tools/obsidian-publisher/bin/publish-note publish`; it resolves the QuickAdd command ID and proves startup through structured status.
- Never retrigger while a live lock exists. Inspect `publish-note status`; use `recover` only for a lock older than the configured stale threshold.
- Run `publish-note doctor` before diagnosing model behavior. A missing status transition means the command did not start; it does not mean the API is still running.
- Treat the repository runtime, prompts, and terminology as canonical. Install all changes with `publish-note install`, fully reload QuickAdd, and require hash parity before a smoke test.
- `Publish Note` generates the vault projection only. Do not synchronize to GitHub until the user explicitly approves the draft.
- GitHub Publisher must keep `syncInterval: 0`; `publish-note doctor` must fail if periodic push is enabled.

Do not reintroduce non-`Publish` vault paths under `content/posts/`, such as:

```text
content/posts/01-Note/
content/posts/02-Project/
content/posts/04-Reference/
content/posts/System Design/
```

If these appear again, they were accidentally synced from the vault and should be removed from the blog repo. The intended GitHub Publisher configuration is `selectedPaths: ["Publish"]` and `publishTags: []`.

## Public Content Metadata

Hugo uses frontmatter from the generated `Publish/<slug>/index.md` files. Important fields:

```yaml
tags:
  - public
series: "Remote Agent Workflow"
seriesOrder: 3
topics:
  - remote-agent-workflow
selected: true
excludeFromLatest: true
```

Behavior:

- `series` and `seriesOrder` drive series pages and previous/next navigation.
- `topics` drive topic taxonomy pages.
- `selected: true` places a post in the homepage `Selected` section.
- `excludeFromLatest: true` keeps a page out of the homepage `Latest` section.

Do not use `featured`; the current homepage curation field is `selected`.

## Local Verification

Run a production-style build before pushing site/template changes:

```sh
hugo --gc --minify --baseURL "https://yanqian.github.io/"
```

`hugo --gc` may delete tracked files under `resources/_gen/`. If those files are not part of the intended change, restore them before committing.

For local preview:

```sh
hugo server
```

Then open:

```text
http://localhost:1313/
```

For workflow-driven development rounds, use:

```sh
make -C .agent-harness dry-run
make -C .agent-harness work
cd .agent-harness && python3 orchestrator.py --eval-only all
```

Every coding or evaluator agent round must reconstruct state from:

1. `.agent-harness/progress.md`
2. `.agent-harness/feature_list.json`
3. `git log --oneline -20`
4. `./init.sh`

## Deployment

Pushing to `main` triggers `.github/workflows/hugo.yml` and deploys GitHub Pages.

After pushing, check the workflow result with GitHub Actions. A successful deploy should build Hugo, upload the artifact, and complete the Pages deploy job.

## Known Publishing Pitfall

The Obsidian GitHub Publisher plugin combines `selectedPaths` and `publishTags` as OR, not AND. If it is configured with both `selectedPaths: ["Publish"]` and `publishTags: ["#public"]`, it will publish all files under `Publish/` plus every Markdown file in the vault tagged `#public`.

That causes private source-note paths to appear under `content/posts/` and can duplicate articles in Hugo series pages. Keep tag filtering in the Obsidian QuickAdd script, not in GitHub Publisher.

## Workflow Rules

- Planning changes belong in `.agent-harness/SPEC.md` and, for larger site requirements, `docs/requirements/`.
- `.agent-harness/progress.md` records the current workflow status and next feature.
- `.agent-harness/feature_list.json` records runnable feature state and completion metadata.
- `.agent-harness/orchestrator.py` owns bounded unattended rounds and evaluator-only checks.
- Coding agents may change only the current feature and must not treat chat history as durable state.
- Evaluator agents must verify against `.agent-harness/SPEC.md`, `.agent-harness/test_plan.md`, and the current repository state.
