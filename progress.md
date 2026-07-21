# Progress

## Current System Status

The repository has a runnable Hugo site plus a workflow contract for future site changes.

Existing durable state files:

- `AGENTS.md`
- `SPEC.md`
- `feature_list.json`
- `progress.md`
- `test_plan.md`
- `init.sh`
- `orchestrator.py`

Implemented behavior:

- Obsidian remains the source of truth for article text.
- Generated article content stays under `content/posts/Publish/`.
- `selected` remains the homepage curation field.
- Article code blocks now use class-based Chroma highlighting with GitHub light/dark colors, a lighter code panel, code typography tuned for readability, no visible `text` language label, and a unified code-block background that matches inline code.
- The Projects page now includes `home-guard-tg` with a public GitHub link and README reference.
- The Projects page now marks `Gentle Memories` as community review approved and links to the public Obsidian review page.
- The About and Resume pages now present a resume-informed public professional profile without private contact details, and the About terminal block uses the same background palette as code blocks.
- GitHub Discussions is enabled for `yanqian/yanqian.github.io`, and article pages now render giscus-powered comment sections backed by the repository's `General` discussion category.
- Article comments use site-hosted custom giscus themes so the iframe background matches the site's light and dark palettes.
- Article pages include a lightweight selection-to-comment flow that copies selected article text as a Markdown quote and scrolls readers to giscus comments.
- The site now has a native Hugo English/Chinese shell: English keeps its existing root URLs, Chinese is generated under `/zh/`, interface copy and metadata are localized, and the language switch prefers paired pages with a language-home fallback.
- `./init.sh` runs unit tests, checks `orchestrator.py`, and performs a production-style Hugo build.
- `orchestrator.py` can preview or run bounded coding/evaluator rounds for future feature work.
- The canonical Obsidian localization publisher now lives under `tools/obsidian-publisher/`, installs reproducibly into the vault, executes QuickAdd by command ID, records structured status and locks, times out AI calls, and resumes completed long-document chunks.
- Publisher regressions now run through `./init.sh`, covering fenced-code headings, technical names, long-document splitting, protected artifacts, chunk resume, locks, timeouts, launcher behavior, and local install parity.
- `AGENTS.md` now mandates the supported publisher entrypoint; the localization Runbook and July 2026 incident report provide one durable operating and recovery source, while the vault README points back to it.
- Factual-review title and heading corrections now survive protected-artifact restoration instead of being overwritten by the edited draft.
- GitHub Publisher periodic push is disabled, and publisher doctor rejects nonzero sync intervals that would bypass draft approval.
- A versioned terminology contract now enforces `control plane` → `控制面` across rewrite, editing, factual review, deterministic validation, installed vault parity, and the corrected Part 2 draft/cache.
- All six localization prompts are now canonical repository files, installed into Obsidian with per-file manifest hashes and doctor/test parity checks.
- Remote Agent Workflow Part 2 is published in English and Chinese at commit `d8317df`; the prior “awaiting approval” status was stale and has been cleared.
- The About page now has a user-approved Simplified Chinese translation at `/zh/about/`, paired directly with `/about/`; its terminal copy and navigation entry use the existing Hugo i18n system.

## Last Completed Feature

`F018` - Localize and verify the About page.

## Next Feature

`F019` - Localize and verify the Now page after the published About change is handed off.

Planned follow-up features remain pending in approval order: `F020` Projects and `F021` Resume.

## Known Issues

- `hugo --gc` can clean tracked files under `resources/_gen/`; restore them before committing if they are not part of the intended change.
- The installed Codex CLI cannot currently run the configured `gpt-5.6-sol` evaluator model; `orchestrator.py --eval-only` requires a CLI upgrade or compatible durable provider configuration.
- `F011` used the documented manual fallback because that provider gap prevents a separate orchestrated evaluator; its smoke-test evidence is recorded under `runs/`.
