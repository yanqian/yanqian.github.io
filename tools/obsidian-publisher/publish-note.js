// Canonical source: yanqian.github.io/tools/obsidian-publisher/publish-note.js
// Install into the vault with tools/obsidian-publisher/bin/install.
const PIPELINE_VERSION = "localization-v4";
const RUNTIME_VERSION = "publisher-v1";
const DEFAULT_MODEL = "gpt-5.6-sol";
const SUPPORTED_LANGUAGES = new Set(["en", "zh"]);
const PROMPT_DIR = "Scripts/localization/prompts";
const TERMINOLOGY_PATH = "Scripts/localization/terminology.json";
const CACHE_DIR = "Scripts/localization/cache";
const STATUS_DIR = "Scripts/localization/status";
const LOCK_DIR = "Scripts/localization/locks";
const AI_TIMEOUT_MS = 5 * 60 * 1000;
const LOCK_TTL_MS = 30 * 60 * 1000;

module.exports = async (params) => {
  const { app, quickAddApi } = params;
  const activeFile = app.workspace.getActiveFile();

  if (!activeFile) {
    new Notice("No active file.");
    return;
  }

  const content = await app.vault.read(activeFile);
  if (!isPublishableSource(content)) {
    new Notice("Publish Note skipped: source note must have publish: true.");
    return;
  }

  if (!quickAddApi?.ai?.prompt) {
    new Notice("Publish Note failed: QuickAdd AI is unavailable.");
    return;
  }

  const source = buildSourceDocument(activeFile, content);
  const targetLanguage = source.language === "en" ? "zh" : "en";
  const models = resolveModels(content);
  const promptFiles = await loadPromptFiles(app, targetLanguage);
  const sourceHash = hashString(JSON.stringify({
    title: source.title,
    body: source.body,
    language: source.language,
  }));
  const promptHash = hashString(JSON.stringify(promptFiles));
  const cachePath = `${CACHE_DIR}/${source.slug}.json`;
  const statusPath = `${STATUS_DIR}/${source.slug}.json`;
  const lockPath = `${LOCK_DIR}/${source.slug}.json`;
  const runId = `${Date.now()}-${sourceHash}`;
  const run = { runId, slug: source.slug, sourceHash, runtimeVersion: RUNTIME_VERSION };
  if (!await acquireRunLock(app, lockPath, run)) {
    new Notice(`Publish Note skipped: ${source.slug} already has a live localization run.`);
    return;
  }
  const report = async (stage, extra = {}) => {
    const status = { ...run, status: "running", stage, updatedAt: new Date().toISOString(), ...extra };
    await writeRunStatus(app, statusPath, status);
    await writeRunStatus(app, `${STATUS_DIR}/current.json`, status);
    await writeRunLock(app, lockPath, status);
  };
  const cacheKey = {
    pipelineVersion: PIPELINE_VERSION,
    sourceHash,
    promptHash,
    sourceLanguage: source.language,
    targetLanguage,
    models,
  };
  let cache = await readCompatibleCache(app, cachePath, cacheKey);
  cache = invalidateIncompatibleCachedStages(cache, targetLanguage);

  new Notice(
    `Localizing ${languageLabel(source.language)} to ${languageLabel(targetLanguage)}...`,
  );

  let localized;
  try {
    if (!cache.understanding) {
      await report("understand", { chunk: 1, totalChunks: 1 });
      new Notice("Localization 1/4: understanding the article...");
      cache.understanding = await understandArticle({
        quickAddApi,
        model: models.understand,
        prompt: promptFiles.understand,
        source,
      });
      await writeCache(app, cachePath, cache);
    }

    if (!cache.rewrite) {
      await report("rewrite", { chunk: 1, totalChunks: 1 });
      new Notice(`Localization 2/4: rewriting for ${languageLabel(targetLanguage)} readers...`);
      cache.rewrite = restoreProtectedMarkdown(source.body, await rewriteForLocale({
        quickAddApi,
        model: models.rewrite,
        prompt: promptFiles.rewrite,
        source,
        targetLanguage,
        understanding: cache.understanding,
        terminology: promptFiles.terminology,
      }));
      validateTerminology(source, cache.rewrite, targetLanguage, promptFiles.terminology);
      validateMarkdownContract(source.body, cache.rewrite.body, "localized rewrite");
      await writeCache(app, cachePath, cache);
    }

    if (!cache.edited) {
      await report("edit", { chunk: 0, totalChunks: 0 });
      new Notice("Localization 3/4: editing for native readability...");
      cache.edited = restoreLocalizedTitleAndHeadings(
        cache.rewrite,
        restoreProtectedMarkdown(source.body, await editLocalizedDraft({
          quickAddApi,
          model: models.edit,
          prompt: promptFiles.edit,
          targetLanguage,
          understanding: cache.understanding,
          draft: cache.rewrite,
          terminology: promptFiles.terminology,
          completedChunks: cache.editChunks || [],
          onChunk: async (index, total, document) => {
            cache.editChunks = cache.editChunks || [];
            cache.editChunks[index] = document;
            await writeCache(app, cachePath, cache);
            await report("edit", { chunk: index + 1, totalChunks: total });
          },
        })),
      );
      validateLocalizationQuality(targetLanguage, cache.edited);
      validateTerminology(source, cache.edited, targetLanguage, promptFiles.terminology);
      validateMarkdownContract(source.body, cache.edited.body, "edited draft");
      delete cache.editChunks;
      await writeCache(app, cachePath, cache);
    }

    if (!cache.review) {
      await report("review", { chunk: 0, totalChunks: 0 });
      new Notice("Localization 4/4: reviewing factual consistency...");
      cache.review = await reviewConsistency({
        quickAddApi,
        model: models.review,
        prompt: promptFiles.review,
        source,
        targetLanguage,
        candidate: cache.edited,
        terminology: promptFiles.terminology,
        completedChunks: cache.reviewChunks || [],
        onChunk: async (index, total, result) => {
          cache.reviewChunks = cache.reviewChunks || [];
          cache.reviewChunks[index] = result;
          await writeCache(app, cachePath, cache);
          await report("review", { chunk: index + 1, totalChunks: total });
        },
      });
      cache.review.corrected = finalizeReviewedDocument(source.body, cache.review.corrected);
      validateReview(cache.review);
      validateTerminology(source, cache.review.corrected, targetLanguage, promptFiles.terminology);
      validateMarkdownContract(source.body, cache.review.corrected.body, "reviewed article");
      delete cache.reviewChunks;
      await writeCache(app, cachePath, cache);
    }

    localized = cache.review.corrected;
  } catch (error) {
    console.error("Publish Note localization failed", error);
    const failed = { ...run, status: "failed", stage: "localize", error: errorMessage(error), updatedAt: new Date().toISOString() };
    await writeRunStatus(app, statusPath, failed);
    await writeRunStatus(app, `${STATUS_DIR}/current.json`, failed);
    await releaseRunLock(app, lockPath, runId);
    new Notice(`Publish Note failed: ${errorMessage(error)}`);
    return;
  }

  const publishDate = window.moment().format("YYYY-MM-DDTHH:mm:ssZ");
  const sharedMetadata = {
    publishDate,
    slug: source.slug,
    tags: source.tags,
    categories: source.categories,
    series: source.series,
    seriesOrder: source.seriesOrder,
    topics: source.topics,
    selected: source.selected,
    excludeFromLatest: source.excludeFromLatest,
  };
  const documents = {
    [source.language]: { title: source.title, body: source.body },
    [targetLanguage]: localized,
  };
  const targetDir = `Publish/${source.slug}`;

  try {
    await ensureFolder(app, targetDir);
    await copyReferencedAssets(app, activeFile, content, targetDir);
    await upsertFile(
      app,
      `${targetDir}/index.md`,
      buildPublishContent(documents.en, sharedMetadata, "en"),
    );
    await upsertFile(
      app,
      `${targetDir}/index.zh.md`,
      buildPublishContent(documents.zh, sharedMetadata, "zh"),
    );
  } catch (error) {
    console.error("Publish Note write failed", error);
    const failed = { ...run, status: "failed", stage: "write", error: errorMessage(error), updatedAt: new Date().toISOString() };
    await writeRunStatus(app, statusPath, failed);
    await writeRunStatus(app, `${STATUS_DIR}/current.json`, failed);
    await releaseRunLock(app, lockPath, runId);
    new Notice(`Publish Note failed while writing: ${errorMessage(error)}`);
    return;
  }

  const complete = { ...run, status: "complete", stage: "done", updatedAt: new Date().toISOString() };
  await writeRunStatus(app, statusPath, complete);
  await writeRunStatus(app, `${STATUS_DIR}/current.json`, complete);
  await releaseRunLock(app, lockPath, runId);
  new Notice(`Published English and Chinese: ${targetDir}`);
};

function buildSourceDocument(activeFile, content) {
  const frontmatterTitle = getFrontmatterTitle(content);
  const title = frontmatterTitle || activeFile.basename;
  const fileTitle = activeFile.basename;
  const slug = (getFrontmatterScalar(content, "slug") || fileTitle)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  const body = content
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(new RegExp(`^#\\s+(${escapeRegExp(title)}|${escapeRegExp(fileTitle)})\\s*\\n+`, "m"), "")
    .replace(/^#public\s*$/gm, "")
    .trim();

  return {
    title,
    slug,
    body,
    language: resolveSourceLanguage(getFrontmatterScalar(content, "lang"), title, body),
    tags: uniqueList([...getFrontmatterList(content, "tags").map(normalizeTag), "public", "note"]),
    categories: getFrontmatterList(content, "categories"),
    topics: getFrontmatterList(content, "topics"),
    series: getFrontmatterScalar(content, "series"),
    seriesOrder: getFrontmatterScalar(content, "seriesOrder"),
    selected: getFrontmatterBoolean(content, "selected"),
    excludeFromLatest: getFrontmatterBoolean(content, "excludeFromLatest"),
  };
}

function resolveModels(content) {
  const fallback =
    getFrontmatterScalar(content, "localizationModel") ||
    getFrontmatterScalar(content, "translationModel") ||
    DEFAULT_MODEL;

  return {
    understand: getFrontmatterScalar(content, "understandModel") || fallback,
    rewrite: getFrontmatterScalar(content, "rewriteModel") || fallback,
    edit: getFrontmatterScalar(content, "editorModel") || fallback,
    review: getFrontmatterScalar(content, "reviewModel") || fallback,
  };
}

async function loadPromptFiles(app, targetLanguage) {
  const terminologyFile = await readRequiredText(app, TERMINOLOGY_PATH);
  const terminologyByLanguage = JSON.parse(terminologyFile);
  const terminology = terminologyByLanguage[targetLanguage];
  if (!Array.isArray(terminology)) {
    throw new Error(`Missing localization terminology for ${targetLanguage}.`);
  }
  return {
    understand: await readRequiredText(app, `${PROMPT_DIR}/understand.md`),
    rewrite: await readRequiredText(app, `${PROMPT_DIR}/rewrite.${targetLanguage}.md`),
    edit: await readRequiredText(app, `${PROMPT_DIR}/editor.${targetLanguage}.md`),
    review: await readRequiredText(app, `${PROMPT_DIR}/consistency-review.md`),
    terminology,
  };
}

async function readRequiredText(app, path) {
  const file = app.vault.getAbstractFileByPath(path);
  if (!file || !("extension" in file)) {
    throw new Error(`Missing localization prompt: ${path}`);
  }
  return app.vault.read(file);
}

async function understandArticle({ quickAddApi, model, prompt, source }) {
  const raw = await callAi({
    quickAddApi,
    model,
    temperature: 0.2,
    maxTokens: 8000,
    systemPrompt: prompt,
    prompt: `Source language: ${languageLabel(source.language)}\n\nSource title:\n${source.title}\n\nSource Markdown:\n${source.body}`,
    variableName: "understanding",
  });
  const result = parseJsonObject(raw, "article understanding");
  const requiredArrays = ["section_intents", "reasoning_chain", "facts", "terms", "voice", "artifacts"];
  if (typeof result.thesis !== "string" || typeof result.audience !== "string") {
    throw new Error("Article understanding is missing thesis or audience.");
  }
  for (const key of requiredArrays) {
    if (!Array.isArray(result[key])) throw new Error(`Article understanding is missing ${key}.`);
  }
  return result;
}

async function rewriteForLocale({ quickAddApi, model, prompt, source, targetLanguage, understanding, terminology }) {
  const protectedSource = maskProtectedCodeBlocks(source.body);
  const raw = await callAi({
    quickAddApi,
    model,
    temperature: 0.7,
    maxTokens: 16000,
    systemPrompt: prompt,
    prompt: `Target language: ${languageLabel(targetLanguage)}\n\n${formatTerminologyInstructions(terminology)}\n\nArticle understanding:\n${JSON.stringify(understanding, null, 2)}\n\nThe source contains protected tokens such as LOCALIZATION_CODE_BLOCK_0001_DO_NOT_EDIT. Copy every protected token exactly once into the corresponding position in the localized body. Never alter or expand a protected token.\n\nCanonical source title:\n${source.title}\n\nCanonical source Markdown:\n${protectedSource.body}`,
    variableName: "localizedRewrite",
  });
  return parseDocumentResponse(raw, "localized rewrite");
}

async function editLocalizedDraft({ quickAddApi, model, prompt, targetLanguage, understanding, draft, terminology, completedChunks = [], onChunk }) {
  const protectedDraft = maskProtectedCodeBlocks(draft.body);
  const chunks = splitMarkdownForLocalization(protectedDraft.body);
  const editContext = selectUnderstandingForEditing(understanding);
  const documents = await processChunks(chunks, completedChunks, async (chunk, index) => {
    const raw = await callAi({
      quickAddApi,
      model,
      reasoningEffort: "low",
      temperature: 0.35,
      maxTokens: 6000,
      systemPrompt: prompt,
      prompt: `Target language: ${languageLabel(targetLanguage)}\n\n${formatTerminologyInstructions(terminology)}\n\nArticle understanding:\n${JSON.stringify(editContext, null, 2)}\n\nThis is chunk ${index + 1} of ${chunks.length}. Edit only this chunk and preserve its boundaries. The draft contains protected tokens such as LOCALIZATION_CODE_BLOCK_0001_DO_NOT_EDIT. Copy every protected token exactly once into the corresponding position. Never alter or expand a protected token.\n\nDraft title:\n${draft.title}\n\nDraft Markdown chunk:\n${chunk}`,
      variableName: `editedDraftChunk${index + 1}`,
    });
    return parseDocumentResponse(raw, `edited draft chunk ${index + 1}`);
  }, onChunk);
  const smellExamples = documents.flatMap((document) =>
    document.qualityAssessment?.translation_smell_examples || [],
  );
  return {
    title: documents[0].title,
    body: documents.map((document) => document.body).join("\n\n"),
    qualityAssessment: {
      pass: documents.every((document) => document.qualityAssessment?.pass === true) && !smellExamples.length,
      translation_smell_examples: smellExamples,
    },
  };
}

async function reviewConsistency({ quickAddApi, model, prompt, source, targetLanguage, candidate, terminology, completedChunks = [], onChunk }) {
  const protectedSource = maskProtectedCodeBlocks(source.body);
  const protectedCandidate = maskProtectedCodeBlocks(candidate.body);
  const chunkPairs = pairMarkdownForLocalization(protectedSource.body, protectedCandidate.body);
  const results = await processChunks(chunkPairs, completedChunks, async (pair, index) => {
    const raw = await callAi({
      quickAddApi,
      model,
      reasoningEffort: "low",
      temperature: 0.1,
      maxTokens: 6000,
      systemPrompt: prompt,
      prompt: `Canonical source language: ${languageLabel(source.language)}\nTarget language: ${languageLabel(targetLanguage)}\n\n${formatTerminologyInstructions(terminology)}\n\nThis is chunk ${index + 1} of ${chunkPairs.length}. Review only this aligned chunk. The localized article contains protected tokens such as LOCALIZATION_CODE_BLOCK_0001_DO_NOT_EDIT. Copy every protected token exactly once into corrected.body. Never alter or expand a protected token.\n\nCanonical source title:\n${source.title}\n\nCanonical source Markdown chunk:\n${pair.source}\n\nLocalized title:\n${candidate.title}\n\nLocalized Markdown chunk:\n${pair.candidate}`,
      variableName: `consistencyReviewChunk${index + 1}`,
    });
    const result = parseJsonObject(raw, `consistency review chunk ${index + 1}`);
    result.corrected = result.corrected || { title: result.title, body: result.body };
    return result;
  }, onChunk);
  const issues = results.flatMap((result) => result.issues || []);
  return {
    status: results.some((result) => result.status === "fail")
      ? "fail"
      : results.some((result) => result.status === "fixed") || issues.length
        ? "fixed"
        : "pass",
    issues,
    corrected: {
      title: results[0].corrected.title,
      body: results.map((result) => result.corrected.body).join("\n\n"),
    },
  };
}

async function processChunks(chunks, completedChunks, worker, onChunk) {
  const results = [];
  for (let index = 0; index < chunks.length; index++) {
    if (completedChunks[index]) {
      results.push(completedChunks[index]);
      continue;
    }
    const result = await worker(chunks[index], index, chunks.length);
    results.push(result);
    if (onChunk) await onChunk(index, chunks.length, result);
  }
  return results;
}

function selectUnderstandingForEditing(understanding) {
  const { thesis, audience, terms, voice } = understanding;
  return { thesis, audience, terms, voice };
}

function splitMarkdownSections(markdown) {
  return markdown.split(/(?=^##\s+)/m).filter((section) => section.trim());
}

function groupMarkdownSections(sections, maxCharacters = 3200) {
  const chunks = [];
  let current = "";
  for (const section of sections) {
    if (current && current.length + section.length + 2 > maxCharacters) {
      chunks.push(current.trim());
      current = "";
    }
    current = current ? `${current.trim()}\n\n${section.trim()}` : section.trim();
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

function splitMarkdownForLocalization(markdown) {
  if (markdown.length <= 5000) return [markdown.trim()];
  return groupMarkdownSections(splitMarkdownSections(markdown));
}

function pairMarkdownForLocalization(source, candidate) {
  const sourceSections = splitMarkdownSections(source);
  const candidateSections = splitMarkdownSections(candidate);
  if (sourceSections.length !== candidateSections.length) {
    throw new Error(`Cannot align localization review sections (${sourceSections.length} -> ${candidateSections.length}).`);
  }
  const pairs = [];
  let currentSource = "";
  let currentCandidate = "";
  for (let index = 0; index < sourceSections.length; index++) {
    const nextSize = currentSource.length + currentCandidate.length +
      sourceSections[index].length + candidateSections[index].length + 4;
    if (currentSource && nextSize > 6000) {
      pairs.push({ source: currentSource.trim(), candidate: currentCandidate.trim() });
      currentSource = "";
      currentCandidate = "";
    }
    currentSource = currentSource
      ? `${currentSource.trim()}\n\n${sourceSections[index].trim()}`
      : sourceSections[index].trim();
    currentCandidate = currentCandidate
      ? `${currentCandidate.trim()}\n\n${candidateSections[index].trim()}`
      : candidateSections[index].trim();
  }
  if (currentSource) pairs.push({ source: currentSource.trim(), candidate: currentCandidate.trim() });
  return pairs;
}

async function callAi({ quickAddApi, model, reasoningEffort = "medium", temperature, maxTokens, systemPrompt, prompt, variableName }) {
  const modelOptions = isGpt5Model(model)
    ? {
        reasoning_effort: reasoningEffort,
        max_completion_tokens: maxTokens,
      }
    : {
        temperature,
        max_tokens: maxTokens,
      };
  const response = await withTimeout(quickAddApi.ai.prompt(prompt, model, {
    variableName,
    shouldAssignVariables: false,
    showAssistantMessages: false,
    systemPrompt,
    modelOptions,
  }), AI_TIMEOUT_MS, `${variableName} AI request`);
  const raw = response?.[variableName] ?? response?.output;
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error(`OpenAI returned an empty ${variableName} response.`);
  }
  return raw;
}

function withTimeout(promise, timeoutMs, label) {
  let timeout;
  const expired = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms.`)), timeoutMs);
  });
  return Promise.race([promise, expired]).finally(() => clearTimeout(timeout));
}

function parseDocumentResponse(raw, label) {
  const result = parseJsonObject(raw, label);
  if (
    typeof result.title !== "string" || !result.title.trim() ||
    typeof result.body !== "string" || !result.body.trim()
  ) {
    throw new Error(`${label} is missing a title or body.`);
  }
  return {
    title: result.title.trim(),
    body: result.body.trim(),
    qualityAssessment: result.quality_assessment || null,
  };
}

function formatTerminologyInstructions(terminology) {
  if (!terminology.length) return "Required terminology: none.";
  const entries = terminology.map((entry) => {
    const avoided = entry.avoid?.length ? `; never use: ${entry.avoid.join(", ")}` : "";
    return `- ${entry.source} => ${entry.target}${avoided}`;
  });
  return ["Required terminology (use the target terms exactly and consistently):", ...entries].join("\n");
}

function validateTerminology(source, candidate, targetLanguage, terminology) {
  const sourceText = `${source.title}\n${source.body}`.toLocaleLowerCase();
  const candidateText = `${candidate.title}\n${candidate.body}`;
  for (const entry of terminology) {
    if (
      typeof entry.source !== "string" || !entry.source ||
      typeof entry.target !== "string" || !entry.target ||
      (entry.avoid !== undefined && !Array.isArray(entry.avoid))
    ) {
      throw new Error(`Invalid localization terminology entry for ${targetLanguage}.`);
    }
    if (!sourceText.includes(entry.source.toLocaleLowerCase())) continue;
    for (const avoided of entry.avoid || []) {
      if (candidateText.includes(avoided)) {
        throw new Error(`Terminology gate failed: use ${entry.target}, not ${avoided}.`);
      }
    }
    if (!candidateText.includes(entry.target)) {
      throw new Error(`Terminology gate failed: ${entry.source} must use ${entry.target}.`);
    }
  }
}

function validateLocalizationQuality(targetLanguage, document) {
  const assessment = document.qualityAssessment;
  if (
    !assessment ||
    assessment.pass !== true ||
    !Array.isArray(assessment.translation_smell_examples) ||
    assessment.translation_smell_examples.length > 0
  ) {
    const examples = Array.isArray(assessment?.translation_smell_examples)
      ? assessment.translation_smell_examples.slice(0, 3).join("; ")
      : "editor did not return a valid quality assessment";
    throw new Error(`Native-language quality gate failed: ${examples}.`);
  }

  if (targetLanguage !== "zh") return;
  const localizedLabels = [document.title, ...extractHeadingLines(document.body)];
  const sourceLanguageLabels = localizedLabels.filter((label) => {
    const headingText = label.replace(/^#{1,6}\s+/, "");
    if (/^[A-Za-z0-9_.+/-]+$/.test(headingText)) return false;
    const hanCount = (label.match(/\p{Script=Han}/gu) || []).length;
    const latinCount = (label.match(/[A-Za-z]/g) || []).length;
    return hanCount < 2 || latinCount > hanCount * 3;
  });
  if (sourceLanguageLabels.length) {
    throw new Error(
      `Native-language quality gate found non-Chinese titles: ${sourceLanguageLabels.join(" | ")}.`,
    );
  }
  const suspiciousPatterns = [
    /这种失败/g,
    /不太可见/g,
    /中的中断/g,
    /保持那样/g,
    /感觉不像/g,
    /改善空隙/g,
    /过于猛烈/g,
    /成为.{0,12}对象/g,
  ];
  const matches = suspiciousPatterns.flatMap((pattern) =>
    document.body.match(pattern) || [],
  );
  if (matches.length) {
    throw new Error(
      `Native-language quality gate found literal Chinese phrasing: ${uniqueList(matches).join(", ")}.`,
    );
  }
}

function invalidateIncompatibleCachedStages(cache, targetLanguage) {
  if (!cache.edited) return cache;
  try {
    validateLocalizationQuality(targetLanguage, cache.edited);
    return cache;
  } catch (error) {
    console.warn("Discarding incompatible localization edit cache", error);
    const repaired = { ...cache };
    delete repaired.edited;
    delete repaired.review;
    return repaired;
  }
}

function isGpt5Model(model) {
  return /^gpt-5(?:\.|-|$)/i.test(model);
}

function parseJsonObject(raw, label) {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error(`OpenAI returned invalid ${label} JSON.`);
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      throw new Error(`OpenAI returned invalid ${label} JSON.`);
    }
  }
}

function validateReview(review) {
  if (!["pass", "fixed", "fail"].includes(review.status)) {
    throw new Error("Consistency review returned an invalid status.");
  }
  if (!Array.isArray(review.issues)) {
    throw new Error("Consistency review returned invalid issues.");
  }
  if (review.status === "fail") {
    const summary = review.issues.slice(0, 3).map((issue) => issue.type || issue.description || "issue").join(", ");
    throw new Error(`Consistency review failed${summary ? `: ${summary}` : "."}`);
  }
  if (!review.corrected || typeof review.corrected.title !== "string" || typeof review.corrected.body !== "string") {
    throw new Error("Consistency review did not return corrected Markdown.");
  }
}

function validateMarkdownContract(source, candidate, label) {
  const sourceContract = extractMarkdownContract(source);
  const candidateContract = extractMarkdownContract(candidate);
  const checks = [
    ["heading hierarchy", sourceContract.headingLevels, candidateContract.headingLevels],
    ["fenced code blocks", sourceContract.codeBlocks, candidateContract.codeBlocks],
    ["image destinations", sourceContract.imageDestinations, candidateContract.imageDestinations],
    ["link destinations", sourceContract.linkDestinations, candidateContract.linkDestinations],
    ["wikilink targets", sourceContract.wikilinkTargets, candidateContract.wikilinkTargets],
    ["Obsidian embeds", sourceContract.embeds, candidateContract.embeds],
    ["footnote identifiers", sourceContract.footnotes, candidateContract.footnotes],
    ["table shapes", sourceContract.tableShapes, candidateContract.tableShapes],
    ["Hugo shortcodes", sourceContract.shortcodes, candidateContract.shortcodes],
  ];

  const failures = checks
    .filter(([, expected, actual]) => JSON.stringify(expected) !== JSON.stringify(actual))
    .map(([name]) => name);
  if (failures.length) {
    throw new Error(`${label} changed protected Markdown: ${failures.join(", ")}.`);
  }
}

function restoreProtectedCodeBlocks(sourceBody, document) {
  const pattern = /(^|\n)(```|~~~)[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
  const sourceBlocks = collectMatches(sourceBody, pattern, (match) =>
    match[0].replace(/^\n/, ""),
  ).filter((block) => !isLocalizableTextBlock(block));
  const tokens = sourceBlocks.map((_, index) => codeBlockToken(index));
  const tokenCounts = tokens.map((token) => document.body.split(token).length - 1);
  const hasAnyTokens = tokenCounts.some((count) => count > 0);

  if (hasAnyTokens) {
    const invalidIndex = tokenCounts.findIndex((count) => count !== 1);
    if (invalidIndex !== -1) {
      throw new Error(
        `Localized article changed protected code token ${invalidIndex + 1}.`,
      );
    }
    let body = document.body;
    for (let i = 0; i < tokens.length; i++) {
      body = body.replace(tokens[i], sourceBlocks[i]);
    }
    return { ...document, body };
  }

  const candidateBlocks = collectMatches(document.body, pattern, (match) =>
    match[0].replace(/^\n/, ""),
  ).filter((block) => !isLocalizableTextBlock(block));

  if (sourceBlocks.length !== candidateBlocks.length) {
    throw new Error(
      `Localized article changed the number of fenced code blocks (${sourceBlocks.length} -> ${candidateBlocks.length}).`,
    );
  }

  let index = 0;
  const body = document.body.replace(pattern, (block, leadingNewline) => {
    if (isLocalizableTextBlock(block)) return block;
    const restored = sourceBlocks[index++];
    return `${leadingNewline}${restored}`;
  });

  return { ...document, body };
}

function restoreProtectedMarkdown(sourceBody, document) {
  let restored = restoreProtectedCodeBlocks(sourceBody, document);
  restored = restoreFootnoteIdentifiers(sourceBody, restored);
  restored = restoreMarkdownDestinations(sourceBody, restored, true);
  restored = restoreMarkdownDestinations(sourceBody, restored, false);
  restored = restoreWikilinkTargets(sourceBody, restored);
  restored = restoreWholeMatches(
    sourceBody,
    restored,
    /!\[\[[^\]]+]]/g,
    "Obsidian embeds",
  );
  restored = restoreWholeMatches(
    sourceBody,
    restored,
    /\{\{[%<][\s\S]*?[>%]\}\}/g,
    "Hugo shortcodes",
  );
  return restored;
}

function restoreLocalizedTitleAndHeadings(localizedBase, document) {
  const baseHeadings = extractHeadingLines(localizedBase.body);
  const candidateHeadings = extractHeadingLines(document.body);
  if (baseHeadings.length !== candidateHeadings.length) {
    throw new Error(
      `Localized editor changed the number of headings (${baseHeadings.length} -> ${candidateHeadings.length}).`,
    );
  }
  let index = 0;
  const body = replaceOutsideFencedCodeBlocks(
    document.body,
    /^(#{1,6})\s+.+$/gm,
    () => baseHeadings[index++],
  );
  return {
    ...document,
    title: localizedBase.title,
    body,
  };
}

function finalizeReviewedDocument(sourceBody, document) {
  return restoreProtectedMarkdown(sourceBody, document);
}

function extractHeadingLines(markdown) {
  const withoutCode = markdown.replace(/(^|\n)(```|~~~)[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g, "\n");
  return collectMatches(withoutCode, /^(#{1,6})\s+.+$/gm, (match) => match[0]);
}

function replaceOutsideFencedCodeBlocks(markdown, pattern, replacer) {
  const fencePattern = /(^|\n)(```|~~~)[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
  let result = "";
  let lastIndex = 0;
  let match;
  while ((match = fencePattern.exec(markdown)) !== null) {
    result += markdown.slice(lastIndex, match.index).replace(pattern, replacer);
    result += match[0];
    lastIndex = match.index + match[0].length;
  }
  return result + markdown.slice(lastIndex).replace(pattern, replacer);
}

function restoreFootnoteIdentifiers(sourceBody, document) {
  const pattern = /\[\^([^\]]+)]/g;
  const sourceIds = collectMatches(sourceBody, pattern, (match) => match[1]);
  const candidateIds = collectMatches(document.body, pattern, (match) => match[1]);
  if (sourceIds.length !== candidateIds.length) {
    throw new Error(
      `Localized article changed the number of footnote identifiers (${sourceIds.length} -> ${candidateIds.length}).`,
    );
  }
  let index = 0;
  return {
    ...document,
    body: document.body.replace(pattern, () => `[^${sourceIds[index++]}]`),
  };
}

function restoreMarkdownDestinations(sourceBody, document, image) {
  const pattern = image
    ? /!\[([^\]]*)]\(([^)]+)\)/g
    : /(?<!!)\[([^\]]*)]\(([^)]+)\)/g;
  const label = image ? "images" : "links";
  const sourceMatches = collectMatches(sourceBody, pattern, (match) => ({
    destination: match[2],
  }));
  const candidateMatches = collectMatches(document.body, pattern, (match) => ({
    label: match[1],
  }));
  if (sourceMatches.length !== candidateMatches.length) {
    throw new Error(
      `Localized article changed the number of Markdown ${label} (${sourceMatches.length} -> ${candidateMatches.length}).`,
    );
  }
  let index = 0;
  const body = document.body.replace(pattern, (full, candidateLabel) => {
    const prefix = image ? "!" : "";
    const destination = sourceMatches[index++].destination;
    return `${prefix}[${candidateLabel}](${destination})`;
  });
  return { ...document, body };
}

function restoreWikilinkTargets(sourceBody, document) {
  const pattern = /(?<!!)\[\[([^\]|]+)(?:\|([^\]]+))?]]/g;
  const sourceMatches = collectMatches(sourceBody, pattern, (match) => ({
    target: match[1],
    hasLabel: match[2] !== undefined,
  }));
  const candidateMatches = collectMatches(document.body, pattern, (match) => ({
    label: match[2],
    hasLabel: match[2] !== undefined,
  }));
  if (sourceMatches.length !== candidateMatches.length) {
    throw new Error(
      `Localized article changed the number of Obsidian wikilinks (${sourceMatches.length} -> ${candidateMatches.length}).`,
    );
  }
  const structureChanged = sourceMatches.some(
    (sourceMatch, index) => sourceMatch.hasLabel !== candidateMatches[index].hasLabel,
  );
  if (structureChanged) {
    throw new Error("Localized article changed Obsidian wikilink label structure.");
  }
  let index = 0;
  const body = document.body.replace(pattern, () => {
    const sourceMatch = sourceMatches[index];
    const candidateMatch = candidateMatches[index++];
    return sourceMatch.hasLabel
      ? `[[${sourceMatch.target}|${candidateMatch.label}]]`
      : `[[${sourceMatch.target}]]`;
  });
  return { ...document, body };
}

function restoreWholeMatches(sourceBody, document, pattern, label) {
  const sourceMatches = collectMatches(sourceBody, pattern, (match) => match[0]);
  const candidateMatches = collectMatches(document.body, pattern, (match) => match[0]);
  if (sourceMatches.length !== candidateMatches.length) {
    throw new Error(
      `Localized article changed the number of ${label} (${sourceMatches.length} -> ${candidateMatches.length}).`,
    );
  }
  let index = 0;
  return {
    ...document,
    body: document.body.replace(pattern, () => sourceMatches[index++]),
  };
}

function maskProtectedCodeBlocks(body) {
  const pattern = /(^|\n)(```|~~~)[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
  const blocks = [];
  const maskedBody = body.replace(pattern, (block, leadingNewline) => {
    if (isLocalizableTextBlock(block)) return block;
    blocks.push(block.replace(/^\n/, ""));
    return `${leadingNewline}${codeBlockToken(blocks.length - 1)}`;
  });
  return { body: maskedBody, blocks };
}

function isLocalizableTextBlock(block) {
  const normalized = block.replace(/^\n/, "");
  const openingLine = normalized.slice(0, normalized.indexOf("\n"));
  const match = openingLine.match(/^(```|~~~)\s*([^\s{]+)?/);
  return (match?.[2] || "").toLowerCase() === "text";
}

function codeBlockToken(index) {
  return `LOCALIZATION_CODE_BLOCK_${String(index + 1).padStart(4, "0")}_DO_NOT_EDIT`;
}

function extractMarkdownContract(markdown) {
  const codeBlocks = collectMatches(markdown, /(^|\n)(```|~~~)[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g, (match) => {
    const block = match[0].replace(/^\n/, "");
    if (!isLocalizableTextBlock(block)) return block;
    return {
      kind: "localizable-text",
      opening: block.slice(0, block.indexOf("\n")),
      fence: match[2],
    };
  });
  const withoutCode = markdown.replace(/(^|\n)(```|~~~)[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g, "\n");
  const headingLevels = collectMatches(withoutCode, /^(#{1,6})\s+.+$/gm, (match) => match[1].length);
  const imageDestinations = collectMatches(withoutCode, /!\[[^\]]*]\(([^)]+)\)/g, (match) => normalizeDestination(match[1]));
  const linkDestinations = collectMatches(withoutCode, /(?<!!)\[[^\]]*]\(([^)]+)\)/g, (match) => normalizeDestination(match[1]));
  const wikilinkTargets = collectMatches(withoutCode, /(?<!!)\[\[([^\]|]+)(?:\|[^\]]+)?]]/g, (match) => match[1]);
  const embeds = collectMatches(withoutCode, /!\[\[[^\]]+]]/g, (match) => match[0]);
  const footnotes = collectMatches(withoutCode, /\[\^([^\]]+)]/g, (match) => match[1]);
  const shortcodes = collectMatches(withoutCode, /\{\{[%<][\s\S]*?[>%]\}\}/g, (match) => match[0]);

  return {
    headingLevels,
    codeBlocks,
    imageDestinations,
    linkDestinations,
    wikilinkTargets,
    embeds,
    footnotes,
    tableShapes: extractTableShapes(withoutCode),
    shortcodes,
  };
}

function extractTableShapes(markdown) {
  const lines = markdown.split("\n");
  const shapes = [];
  for (let i = 1; i < lines.length; i++) {
    if (!/^\s*\|?\s*:?-{3,}/.test(lines[i])) continue;
    if (!lines[i - 1].includes("|")) continue;
    let rows = 2;
    const columns = countTableColumns(lines[i - 1]);
    while (i + rows - 1 < lines.length && lines[i + rows - 1].includes("|")) rows++;
    shapes.push({ rows, columns });
    i += rows - 2;
  }
  return shapes;
}

function countTableColumns(line) {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split(/(?<!\\)\|/).length;
}

function collectMatches(text, pattern, mapper) {
  const values = [];
  let match;
  while ((match = pattern.exec(text)) !== null) values.push(mapper(match));
  return values;
}

function normalizeDestination(value) {
  return value.trim().replace(/^<|>$/g, "");
}

async function readCompatibleCache(app, path, key) {
  const file = app.vault.getAbstractFileByPath(path);
  if (file && "extension" in file) {
    try {
      const cached = JSON.parse(await app.vault.read(file));
      const cachedKey = {
        pipelineVersion: cached.pipelineVersion,
        sourceHash: cached.sourceHash,
        promptHash: cached.promptHash,
        sourceLanguage: cached.sourceLanguage,
        targetLanguage: cached.targetLanguage,
        models: cached.models,
      };
      if (JSON.stringify(cachedKey) === JSON.stringify(key)) return cached;
    } catch (error) {
      console.warn("Ignoring invalid localization cache", error);
    }
  }
  return { ...key, updatedAt: new Date().toISOString() };
}

function isLiveRunLock(lock, now = Date.now(), ttlMs = LOCK_TTL_MS) {
  const updated = Date.parse(lock?.updatedAt || lock?.startedAt || "");
  return lock?.status === "running" && Number.isFinite(updated) && now - updated < ttlMs;
}

async function readJsonFile(app, path) {
  const file = app.vault.getAbstractFileByPath(path);
  if (!file || !("extension" in file)) return null;
  try {
    return JSON.parse(await app.vault.read(file));
  } catch (_) {
    return null;
  }
}

async function acquireRunLock(app, path, run) {
  const existing = await readJsonFile(app, path);
  if (isLiveRunLock(existing)) return false;
  await ensureFolder(app, LOCK_DIR);
  await upsertFile(app, path, `${JSON.stringify({ ...run, status: "running", startedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, null, 2)}\n`);
  return true;
}

async function writeRunLock(app, path, run) {
  await ensureFolder(app, LOCK_DIR);
  const existing = await readJsonFile(app, path);
  const startedAt = existing?.runId === run.runId ? existing.startedAt : new Date().toISOString();
  await upsertFile(app, path, `${JSON.stringify({ ...run, status: "running", startedAt, updatedAt: new Date().toISOString() }, null, 2)}\n`);
}

async function releaseRunLock(app, path, runId) {
  const existing = await readJsonFile(app, path);
  if (!existing || existing.runId !== runId) return;
  const file = app.vault.getAbstractFileByPath(path);
  if (file && "extension" in file) await app.vault.delete(file);
}

async function writeRunStatus(app, path, status) {
  await ensureFolder(app, STATUS_DIR);
  await upsertFile(app, path, `${JSON.stringify(status, null, 2)}\n`);
}

async function writeCache(app, path, cache) {
  cache.updatedAt = new Date().toISOString();
  await ensureFolder(app, CACHE_DIR);
  await upsertFile(app, path, `${JSON.stringify(cache, null, 2)}\n`);
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function buildPublishContent(document, metadata, language = "en") {
  return `---
title: "${escapeYaml(document.title)}"
date: "${metadata.publishDate}"
draft: false
translationKey: ${formatYamlValue(metadata.slug)}
${formatYamlList("tags", metadata.tags)}
${formatOptionalYamlList("categories", metadata.categories)}
${formatOptionalYamlScalar("series", metadata.series)}
${formatOptionalYamlNumber("seriesOrder", metadata.seriesOrder)}
${formatOptionalYamlList("topics", metadata.topics)}
${formatOptionalYamlBoolean("selected", metadata.selected)}
${formatOptionalYamlBoolean("excludeFromLatest", metadata.excludeFromLatest)}
---

${convertWikilinksToPublicLinks(document.body, language)}
`;
}

function convertWikilinksToPublicLinks(body, language) {
  const fencePattern = /(^|\n)(```|~~~)[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
  const blocks = [];
  const masked = body.replace(fencePattern, (block, leadingNewline) => {
    blocks.push(block.replace(/^\n/, ""));
    return `${leadingNewline}PUBLIC_WIKILINK_CODE_BLOCK_${String(blocks.length).padStart(4, "0")}`;
  });
  const prefix = language === "zh" ? "/zh/posts/publish/" : "/posts/publish/";
  let converted = masked.replace(/(?<!!)\[\[([^\]|]+)(?:\|([^\]]+))?]]/g, (full, rawTarget, rawLabel) => {
    const [rawNote, ...headingParts] = rawTarget.split("#");
    const heading = headingParts.join("#").trim();
    const noteName = rawNote.trim().split("/").pop().replace(/\.md$/i, "");
    const label = rawLabel || heading || noteName;
    const anchor = heading ? `#${slugifyPublicPath(heading)}` : "";
    if (!noteName) return `[${label}](${anchor})`;
    return `[${label}](${prefix}${slugifyPublicPath(noteName)}/${anchor})`;
  });
  blocks.forEach((block, index) => {
    const token = `PUBLIC_WIKILINK_CODE_BLOCK_${String(index + 1).padStart(4, "0")}`;
    converted = converted.replace(token, block);
  });
  return converted;
}

function slugifyPublicPath(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveSourceLanguage(configuredLanguage, title, body) {
  const normalized = normalizeLanguage(configuredLanguage);
  if (normalized) return normalized;
  const sample = `${title}\n${body}`;
  const hanCount = (sample.match(/\p{Script=Han}/gu) || []).length;
  const latinCount = (sample.match(/[A-Za-z]/g) || []).length;
  return hanCount >= 20 && hanCount >= latinCount * 0.2 ? "zh" : "en";
}

function normalizeLanguage(value) {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/_/g, "-");
  if (normalized === "chinese" || normalized.startsWith("zh")) return "zh";
  if (normalized === "english" || normalized.startsWith("en")) return "en";
  return SUPPORTED_LANGUAGES.has(normalized) ? normalized : null;
}

function languageLabel(language) {
  return language === "zh" ? "Simplified Chinese" : "English";
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

async function upsertFile(app, path, content) {
  const existing = app.vault.getAbstractFileByPath(path);
  if (existing) await app.vault.modify(existing, content);
  else await app.vault.create(path, content);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeYaml(str) {
  return str.replace(/"/g, '\\"');
}

function isPublishableSource(content) {
  return getFrontmatterBoolean(content, "publish");
}

function getFrontmatterTitle(content) {
  return getFrontmatterScalar(content, "title");
}

function getFrontmatterScalar(content, key) {
  const frontmatter = getFrontmatter(content);
  if (!frontmatter) return null;
  const match = frontmatter.match(new RegExp(`^${escapeRegExp(key)}\\s*:\\s*(.*)$`, "m"));
  return match ? cleanYamlScalar(match[1]) || null : null;
}

function getFrontmatterBoolean(content, key) {
  return getFrontmatterScalar(content, key) === "true";
}

function getFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  return match ? match[1] : null;
}

function getFrontmatterList(content, key) {
  const frontmatter = getFrontmatter(content);
  if (!frontmatter) return [];
  const lines = frontmatter.split("\n");
  const keyPattern = new RegExp(`^${escapeRegExp(key)}\\s*:\\s*(.*)$`);
  const startIndex = lines.findIndex((line) => keyPattern.test(line));
  if (startIndex === -1) return [];
  const firstLineValue = lines[startIndex].match(keyPattern)[1].trim();
  if (firstLineValue.startsWith("[") && firstLineValue.endsWith("]")) {
    return firstLineValue.slice(1, -1).split(",").map(cleanYamlScalar).filter(Boolean);
  }
  if (firstLineValue) return [cleanYamlScalar(firstLineValue)].filter(Boolean);
  const values = [];
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (/^\S/.test(lines[i])) break;
    const item = lines[i].match(/^\s*-\s+(.+)$/);
    if (item) values.push(cleanYamlScalar(item[1]));
  }
  return values.filter(Boolean);
}

function cleanYamlScalar(value) {
  return value.trim().replace(/^["']|["']$/g, "").trim();
}

function normalizeTag(value) {
  return value.replace(/^#+/, "").trim();
}

function uniqueList(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function formatYamlValue(value) {
  const escaped = escapeYaml(value);
  return /[:#[\]{}&,*!|>'"%@`]|^\s|\s$/.test(value) ? `"${escaped}"` : escaped;
}

function formatYamlList(key, values) {
  if (!values.length) return `${key}: []`;
  return [`${key}:`, ...values.map((value) => `  - ${formatYamlValue(value)}`)].join("\n");
}

function formatOptionalYamlList(key, values) {
  return values.length ? formatYamlList(key, values) : "";
}

function formatOptionalYamlScalar(key, value) {
  return value ? `${key}: ${formatYamlValue(value)}` : "";
}

function formatOptionalYamlNumber(key, value) {
  if (!value) return "";
  const numeric = Number(value);
  return Number.isInteger(numeric) ? `${key}: ${numeric}` : "";
}

function formatOptionalYamlBoolean(key, value) {
  return value ? `${key}: true` : "";
}

async function ensureFolder(app, folderPath) {
  const parts = folderPath.split("/").filter(Boolean);
  let current = "";
  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
  }
}

async function copyReferencedAssets(app, sourceFile, content, targetDir) {
  const sourceDir = sourceFile.parent?.path || "";
  for (const assetPath of getMarkdownAssetPaths(content)) {
    const sourcePath = normalizeVaultPath(sourceDir ? `${sourceDir}/${assetPath}` : assetPath);
    const targetPath = normalizeVaultPath(`${targetDir}/${assetPath}`);
    const sourceAsset = app.vault.getAbstractFileByPath(sourcePath);
    if (!sourceAsset || !("extension" in sourceAsset)) continue;
    await ensureFolder(app, targetPath.split("/").slice(0, -1).join("/"));
    const binary = await app.vault.readBinary(sourceAsset);
    const existing = app.vault.getAbstractFileByPath(targetPath);
    if (existing && "extension" in existing) await app.vault.modifyBinary(existing, binary);
    else if (!existing) await app.vault.createBinary(targetPath, binary);
  }
}

function getMarkdownAssetPaths(content) {
  const paths = [];
  const patterns = [
    [/!\[[^\]]*]\(([^)]+)\)/g, 1],
    [/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/gi, 2],
    [/\{\{<\s*figure\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>\}\}/gi, 2],
  ];
  for (const [pattern, group] of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) addLocalAssetPath(paths, match[group]);
  }
  return uniqueList(paths);
}

function addLocalAssetPath(paths, rawPath) {
  const path = decodeURIComponent(rawPath.trim()).split(/[?#]/)[0];
  if (!path || path.startsWith("/") || path.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(path)) return;
  paths.push(path);
}

function normalizeVaultPath(path) {
  return path.split("/").filter((part) => part && part !== ".").join("/");
}

module.exports.__test = {
  buildPublishContent,
  convertWikilinksToPublicLinks,
  extractMarkdownContract,
  extractHeadingLines,
  finalizeReviewedDocument,
  formatTerminologyInstructions,
  hashString,
  isLiveRunLock,
  isLocalizableTextBlock,
  maskProtectedCodeBlocks,
  normalizeLanguage,
  parseDocumentResponse,
  parseJsonObject,
  resolveSourceLanguage,
  restoreProtectedCodeBlocks,
  restoreProtectedMarkdown,
  restoreWikilinkTargets,
  restoreLocalizedTitleAndHeadings,
  splitMarkdownForLocalization,
  pairMarkdownForLocalization,
  processChunks,
  withTimeout,
  validateLocalizationQuality,
  validateMarkdownContract,
  validateTerminology,
};
