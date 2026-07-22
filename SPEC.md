# yanqian.github.io Development SPEC

## 1. Goal

Maintain the public Hugo site for `yanqian.github.io` with a repeatable engineering workflow.

The repository must support scoped site development: discuss the requirement, record the expected behavior, implement against the existing Hugo/theme structure, verify with automated tests and a production-style Hugo build, then deploy through GitHub Pages.

This repository is not the primary writing workspace. Article source content lives in the Obsidian vault and is projected into `content/posts/Publish/`.

## 2. Scope

### 2.1 Included

The development workflow covers:

- Hugo configuration in `hugo.toml`.
- Local template overrides in `layouts/`.
- Local CSS in `assets/css/custom.css`.
- Local JavaScript in `assets/js/`.
- Top-level public pages in `content/about.md`, `content/now.md`, `content/projects.md`, and `content/resume.md`.
- Workflow state files in `feature_list.json` and `progress.md`.
- Workflow entrypoints in `init.sh` and `orchestrator.py`.
- Documentation under `docs/`.
- Tests under `tests/`.
- GitHub Actions deployment behavior under `.github/`.
- Production-style Hugo builds for verification.

### 2.2 Excluded

The workflow must not use this repository for:

- Drafting or maintaining article source notes.
- Hand-editing generated article content under `content/posts/Publish/`.
- Publishing non-`Publish` vault paths under `content/posts/`.
- Replacing the Hugo stack with a new frontend framework.
- Adding runtime services for the static site unless a requirement explicitly needs them.

## 3. Source Of Truth

Article content follows this path:

```text
Obsidian source notes
  -> vault Publish/ projection
  -> content/posts/Publish/
  -> Hugo build
  -> GitHub Pages
```

Site behavior and presentation are owned by this repository:

- `hugo.toml`
- `layouts/`
- `assets/css/custom.css`
- `assets/js/`
- `feature_list.json`
- `progress.md`
- `init.sh`
- `orchestrator.py`
- `.github/workflows/hugo.yml`
- `docs/`
- `tests/`

## 4. Development Workflow

Every non-trivial site change should follow this sequence:

1. Clarify the requirement and affected user-visible behavior.
2. Identify whether the change belongs in the Obsidian source vault or this Hugo repository.
3. If it belongs here, update the relevant spec, workflow state, documentation, template, style, script, or test.
4. Add or update automated tests for the regression risk.
5. Run the repository verification entry point.
6. Inspect visual output manually when the change affects layout, navigation, typography, or article rendering.
7. Commit and push only after the build and tests pass.

Workflow-driven feature rounds, when used, follow:

```text
progress.md
feature_list.json
git log --oneline -20
./init.sh
orchestrator.py -> coding agent -> evaluator agent
```

## 5. Requirement Notes

For larger changes, create a document under `docs/requirements/` with:

- Problem statement.
- In-scope behavior.
- Out-of-scope behavior.
- Affected files or templates.
- Test plan.
- Manual verification checklist.
- Quality risks and acceptance criteria.

Small changes may be captured directly in the pull request or commit message when the behavior is obvious and tests cover the risk.

## 6. Quality Bar

A change is ready when:

- It preserves the Obsidian-to-Hugo publishing boundary.
- It keeps generated article content untouched unless the user explicitly requests a generated-content repair.
- It passes `./init.sh`.
- It passes a production-style Hugo build with the GitHub Pages base URL.
- It keeps the homepage, post pages, taxonomy pages, and series navigation coherent.
- It avoids introducing layout shifts, text overlap, unreadable typography, or mobile-only regressions.
- It does not add unnecessary frameworks or build steps.

## 7. Verification Entry Point

All automated local verification must run through:

```sh
./init.sh
```

The script must exit non-zero on failure.

## 8. Multilingual Site Foundation

### Goal

Add a bilingual English and Simplified Chinese site shell so readers can explicitly switch languages and future Obsidian publishing work can project paired translations into Hugo without another template redesign.

### Scope Included

- Keep English as the default language at the existing root URLs.
- Add Simplified Chinese under the `/zh/` URL prefix.
- Provide language-specific navigation labels, metadata, and shared interface copy.
- Show a language switch on every page. When the current page has a translation, link to it; otherwise link to the other language's homepage.
- Make homepage, post list, post page, taxonomy, series navigation, table of contents, comments, dates, and empty states language-aware.
- Emit language alternate links for translated pages and language homepages.
- Add automated coverage and production-build assertions for both languages.

### Scope Excluded

- Translating generated articles under `content/posts/Publish/`.
- Changing the Obsidian QuickAdd or GitHub Publisher workflow.
- Automatically detecting or redirecting based on browser language.
- Automatically generating or synchronizing translations.
- Moving existing English URLs under an `/en/` prefix.

### Core Flows

1. An English reader continues to use the existing root URLs without redirects or permalink changes.
2. A reader selects `中文` and reaches the Chinese translation when one exists, or `/zh/` when it does not.
3. A reader selects `English` from the Chinese site and reaches the paired English page or the English homepage.
4. A future paired `index.en.md` and `index.zh.md` article is automatically scoped to the correct language and connected by Hugo's translation model.

### Constraints

- Preserve the Obsidian-to-Hugo publishing boundary and do not hand-edit generated posts.
- Use Hugo's native multilingual model and the existing `hugo-coder` template patterns.
- Avoid new frontend frameworks, runtime services, or client-side language redirects.
- Preserve pathname-based giscus discussions for existing English article URLs.

### Ambiguities And Assumptions

- English remains the default because all current content and public URLs are English.
- Simplified Chinese uses the Hugo language key `zh` and the URL prefix `/zh/`.
- Language choice is explicit; the site does not persist a separate preference because the selected language is represented by the URL.
- Article and top-level page translation are separate follow-up work. This feature localizes the site shell and makes untranslated-language homepages valid empty states.

### Required Capabilities

- Installed Hugo extended binary with multilingual support.
- Existing Python unittest and production-build verification entrypoint.
- Rendered HTML inspection for root and `/zh/` output.

### Implementation Paths

- `hugo.toml`
- `i18n/`
- Localized taxonomy index frontmatter under `content/categories/`, `content/tags/`, `content/series/`, and `content/topics/`
- `layouts/`
- `assets/css/custom.css` only if the language control needs styling adjustments
- `tests/`
- `test_plan.md`

### Verification Surface

- Contract tests for language configuration, menus, translated interface keys, and translation-aware template links.
- Production Hugo build proving both `/index.html` and `/zh/index.html` are generated.
- Rendered HTML assertions for document language, language switch targets, localized labels, and preserved English URLs.
- Manual desktop and mobile inspection of navigation and representative page types.

### Decomposition

This requirement is intentionally one feature, `F010`. Configuration, localized interface copy, translation-aware templates, and build checks form one coherent site-shell capability with the same Hugo-rendering verification surface. Article translation and Obsidian automation remain independently valuable follow-up features and are excluded.

## 9. Localized Top-Level Pages

### Goal

Provide natural Simplified Chinese versions of About, Now, Projects, and Resume while preserving the English pages as the factual source and keeping Hugo's existing multilingual routing and pairing behavior.

### Scope Included

- Localize the four repository-owned top-level pages in the approval-gated order About, Now, Projects, and Resume.
- Preserve English root URLs and publish the paired Chinese pages under `/zh/`.
- Give every pair an explicit shared `translationKey` and make the language switch target the corresponding page.
- Localize page-specific shared template copy through the existing Hugo i18n mechanism.
- Preserve facts, dates, names, links, Markdown structure, and privacy boundaries from each English source page.

### Scope Excluded

- Editing generated article content under `content/posts/Publish/`.
- Using the Obsidian Publish Note workflow.
- Correcting or expanding facts in the English pages without user approval.
- Committing, pushing, or deploying before explicit approval.

### Core Flow

For each page: inspect the complete English source and relevant templates, state the Chinese editorial direction, implement one paired translation, verify source fidelity and rendered behavior, and wait for approval before starting the next page.

### Constraints

- Chinese copy should read as original Chinese rather than sentence-aligned translation.
- Product names, company names, project names, technical terms, dates, numbers, and URLs remain accurate.
- The Chinese navigation exposes a top-level page only after its Chinese page exists.
- Each page is an independently reviewable feature and later pages remain untouched until the previous page is approved.

### Verification Surface

- Source-level checks for shared `translationKey` values and preserved URLs.
- Rendered HTML checks for `/zh/` routes, paired language-switch targets, alternate-language metadata, localized template copy, and absence of accidental English interface labels.
- `./init.sh` after each page.

### Decomposition

This requirement is split into four approval-gated features: `F018` About, `F019` Now, `F020` Projects, and `F021` Resume.

## 10. Durable Obsidian Localization Publisher

### Goal

Make the bilingual Obsidian publishing workflow versioned, observable, recoverable, and difficult for future agents to operate incorrectly.

### Included Scope

- Keep the canonical publisher implementation and tests in this Git repository.
- Install a generated publisher artifact into the Obsidian vault.
- Provide one supported CLI entrypoint that executes the QuickAdd command by ID, verifies startup, and never relies on an `obsidian://quickadd` URL.
- Record structured run status, a single-run lock, stage and chunk progress, timestamps, script version, and source hash without recording secrets or complete prompts.
- Apply explicit request timeouts and resumable per-chunk caching for long articles.
- Document normal operation, recovery, and the 2026-07-19 incident.
- Test fenced-code heading exclusion, technical-name headings, long-document chunking, idempotency, lock behavior, and installed-artifact parity.

### Excluded Scope

- Moving article source notes out of Obsidian.
- Storing API keys, prompts, or full article bodies in operational logs.
- Automatically synchronizing an article to GitHub without human approval.

### Core Flow

`doctor -> install/verify publisher -> run by command ID -> observe status/lock -> review generated draft -> explicit site sync`.

### Decomposition

- `F011`: canonical runtime, installer, launcher, lock, timeout, and resumable status.
- `F012`: runbook, incident report, and agent discovery rules.
- `F013`: regression fixtures, automated tests, and verification-entrypoint integration.

## 11. Localization Terminology Controls

### Goal

Keep established technical terms consistent across Chinese localization stages and reject known literal translations before a draft reaches human review.

### Included Scope

- Maintain a versioned target-language terminology file with preferred and rejected terms.
- Keep every localization stage prompt in the repository and install it deterministically into Obsidian.
- Supply the same terminology constraints to rewrite, edit, and factual-review stages.
- Include terminology in cache compatibility so glossary changes invalidate stale generated stages.
- Fail generation when an applicable preferred term is absent or a rejected variant remains.

### Excluded Scope

- Replacing human editorial review with an exhaustive general-purpose dictionary.
- Translating protected code, identifiers, paths, URLs, or product names.

### Core Flow

`source term -> shared glossary constraint -> rewrite/edit/review -> deterministic terminology gate -> human review`.

### Verification Surface

- Unit coverage for accepted and rejected `control plane` localization.
- Installed runtime, prompt, and glossary parity between this repository and the Obsidian vault.
- Full publisher and Hugo verification through `./init.sh`.

### Decomposition

- `F016`: add the shared terminology contract and correct the current article from `控制平面` to `控制面`.
- `F017`: version and install all localization prompts, enforce prompt parity, and repair stale workflow progress.
- `F022`: exclude protected non-`text` code fences from deterministic terminology scanning while continuing to validate natural-language prose and `text` fences.

## 12. Stable Publication Dates During Regeneration

### Goal

Allow source-metadata changes such as series assignment to regenerate an existing Obsidian publication without making an older article appear newly published.

### Included Scope

- Reuse the existing English projection date when regenerating an article.
- Fall back to the paired Chinese projection date when only that file exists.
- Use the current time only for a genuinely new projection.
- Add `Obsidian Publishing Pipeline` series metadata to the two approved source articles and regenerate both bilingual projections.

### Excluded Scope

- Changing Hugo's chronological sorting rules.
- Automatically synchronizing the regenerated projections to GitHub.
- Replacing the explicit human approval gate.

### Core Flow

`source metadata change -> Publish Note -> preserve existing date -> regenerate bilingual projection -> verify series order -> human approval`.

### Constraints

- Article metadata remains owned by the Obsidian source notes.
- Existing published dates must remain byte-for-byte stable.
- The two language variants must share the same date, series name, and series order.
- The previously approved Chinese wording “此外，所有模型阶段还会收到同一份术语约定” must survive regeneration.

### Verification Surface

- Unit coverage for existing English date, Chinese fallback date, and new-article fallback.
- Installed publisher parity and doctor checks.
- Both regenerated projections contain the intended series metadata and original dates.
- Hugo production build and rendered series-order inspection.

### Decomposition

This requirement is one feature, `F023`, because date preservation and the two-article series migration share one publishing-regeneration acceptance boundary.
