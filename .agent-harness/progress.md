# Progress

## Current System Status

The repository has a runnable Hugo site plus a workflow contract for future site changes.

Existing durable state files:

- `AGENTS.md`
- `.agent-harness/SPEC.md`
- `.agent-harness/feature_list.json`
- `.agent-harness/progress.md`
- `.agent-harness/test_plan.md`
- `.agent-harness/runs/`
- `.agent-harness/agent-provider.json` (local and ignored)
- `init.sh`
- `.agent-harness/orchestrator.py`

Implemented behavior:

- Obsidian remains the source of truth for article text.
- Generated article content stays under `content/posts/Publish/`.
- `selected` remains the homepage curation field.
- Article code blocks now use class-based Chroma highlighting with GitHub light/dark colors, a lighter code panel, code typography tuned for readability, no visible `text` language label, and a unified code-block background that matches inline code.
- The bilingual Projects page now replaces Home Guard TG with Hey Jarvis, including its public repository, a language-matched demo, and unsigned internal release with explicit compatibility and trust boundaries.
- The Projects page now marks `Gentle Memories` as community review approved and links to the public Obsidian review page.
- The About and Resume pages now present a resume-informed public professional profile without private contact details, and the About terminal block uses the same background palette as code blocks.
- GitHub Discussions is enabled for `yanqian/yanqian.github.io`, and article pages now render giscus-powered comment sections backed by the repository's `General` discussion category.
- Article comments use site-hosted custom giscus themes so the iframe background matches the site's light and dark palettes.
- Article pages include a lightweight selection-to-comment flow that copies selected article text as a Markdown quote and scrolls readers to giscus comments.
- The site now has a native Hugo English/Chinese shell: English keeps its existing root URLs, Chinese is generated under `/zh/`, interface copy and metadata are localized, and the language switch prefers paired pages with a language-home fallback.
- `./init.sh` runs unit tests, checks `orchestrator.py`, and performs a production-style Hugo build.
- `orchestrator.py` can preview or run bounded coding/evaluator rounds for future feature work.
- AI Agent Harness `0.3.8` is installed in hidden layout, with the prior 25-feature state and run evidence migrated to `.agent-harness/`.
- The local Codex provider uses explicit `gpt-5.4` commands, changes the coding/evaluator working root from `.agent-harness/` to the project root, and passes a real stdin runtime preflight.
- Project-local role prompts define a hidden-layout path contract so provider children working from the project root read and write canonical `.agent-harness/` state rather than legacy root copies.
- Root `./init.sh` verifies the harness before running the Hugo site tests, publisher tests, and production build.
- The canonical Obsidian localization publisher now lives under `tools/obsidian-publisher/`, installs reproducibly into the vault, executes QuickAdd by command ID, records structured status and locks, times out AI calls, and resumes completed long-document chunks.
- Publisher regressions now run through `./init.sh`, covering fenced-code headings, technical names, long-document splitting, protected artifacts, chunk resume, locks, timeouts, launcher behavior, and local install parity.
- `AGENTS.md` now mandates the supported publisher entrypoint; the localization Runbook and July 2026 incident report provide one durable operating and recovery source, while the vault README points back to it.
- Factual-review title and heading corrections now survive protected-artifact restoration instead of being overwritten by the edited draft.
- GitHub Publisher periodic push is disabled, and publisher doctor rejects nonzero sync intervals that would bypass draft approval.
- A versioned terminology contract now enforces `control plane` → `控制面` across rewrite, editing, factual review, deterministic validation, installed vault parity, and the corrected Part 2 draft/cache.
- All six localization prompts are now canonical repository files, installed into Obsidian with per-file manifest hashes and doctor/test parity checks.
- Remote Agent Workflow Part 2 is published in English and Chinese at commit `d8317df`; the prior “awaiting approval” status was stale and has been cleared.
- The About page now has a user-approved Simplified Chinese translation at `/zh/about/`, paired directly with `/about/`; its terminal copy and navigation entry use the existing Hugo i18n system.
- The Now page now has a user-approved Simplified Chinese translation at `/zh/now/`, paired directly with `/now/`; it preserves the page's current-state framing, links, certification, driving-licence milestone, and update date.
- The Projects page has a user-approved Simplified Chinese translation at `/zh/projects/`, paired directly with `/projects/`; the current bilingual content preserves all four project entries, language-scoped external links, project statuses, and safety boundaries.
- The Resume page now has a user-approved Simplified Chinese translation at `/zh/resume/`, paired directly with `/resume/`; it preserves the 10+ years statement, professional themes, technology names, public contacts, and the source's privacy boundary.
- All four repository-owned top-level pages—About, Now, Projects, and Resume—now have reviewed Chinese translations and direct bilingual switching.
- Terminology validation now ignores protected non-`text` code fences while still enforcing preferred terms in prose and localizable `text` fences; the bilingual-pipeline article completes draft generation with its JSON terminology example unchanged.
- Regenerating an existing Obsidian publication now preserves its original date, with English-first and Chinese-fallback lookup; the two publishing articles form the ordered bilingual `Obsidian Publishing Pipeline` series in the reviewed vault projection.
- The approved `Obsidian Publishing Pipeline` series is published in English and Chinese at sync commit `70dc630` and deployed from `e50ad88`; both public series pages and Part 1/2 navigation are verified.

## Last Completed Feature

`F030` - Refine the Hey Jarvis talk with the real app UI and site palette.

## Next Feature

No additional planned feature remains.

## Known Issues

- `hugo --gc` can clean tracked files under `resources/_gen/`; restore them before committing if they are not part of the intended change.
- Root-level `SPEC.md`, `feature_list.json`, `progress.md`, `test_plan.md`, and `orchestrator.py` remain as legacy pre-migration files; `.agent-harness/` is canonical for all future harness work.
- The packaged `0.3.8` contract suite contained one stray `0.3.9` assertion while its manifest, initializer, and all other version contracts remained `0.3.8`; the installed copy is corrected locally pending an upstream skill package fix.

## Active Work

- The rejected homepage brand-sticker experiment has been fully removed; the homepage is restored to its prior heading and spacing.
- `F024` is re-scoped to the bilingual Now page: a sticker covers only the existing two-song list, a full peel removes it for the current page view, and refresh restores it.
- The implementation uses a paired shortcode, Now-page-only asset loading, no persistence API, and a no-JavaScript fallback that leaves both song links visible.
- The sticker has dedicated light and dark palettes for its surface, border, text, sheen, paper texture, peel edge, and shadow instead of inheriting one generic treatment in both themes.
- Browser verification passes: the exit animation follows the locked real drag direction in all four directions (right/left/down/up), a partial real drag returns to the covered state, a full real drag leaves the sticker hidden and the songs visible, refresh restores the covered state, Enter reveals and focuses the first song, and the 390px Chinese layout has no horizontal overflow in light or dark mode.
- Local verification passes: 58 Python tests, 15 publisher tests, JavaScript syntax validation, `git diff --check`, and the production Hugo build.
- `F025` was implemented through the documented manual fallback before the provider repair and passed the repaired provider's independent cold-start evaluator.
- The English and Chinese Projects pages replace Home Guard TG with Hey Jarvis as the first selected project while preserving the relative order of the other projects.
- Hey Jarvis exposes GitHub and `v0.1.0-internal` release links in both languages, plus only the matching-language demo; the article and cross-language demo links are intentionally omitted.
- On 2026-08-31, a manual Coding Agent prompt targeted `F025` after the feature had already landed; no Projects-page content changed, and the canonical `feature_list.json` entry was repaired from stray `in_progress` drift back to `done` after verification.
- The uncommitted Markdown-driven Hey Jarvis Talk plan and implementation (`F026`/`F027`) were rejected during human review and withdrawn before a replacement requirement was planned.
- The replacement requirement keeps all Talk source and assets under `static/talks/hey-jarvis/`; the temporary Obsidian Talk note, copied asset, and Publish projection were removed so the vault retains no webpage content.
- The first F028 orchestrator run was interrupted before it produced implementation files so this source-of-truth boundary could be corrected; F028 returned to `todo` with its attempt history preserved.
- `F028` owns the standalone six-scene HTML/CSS/JavaScript presentation and its verification; dependent `F029` adds language-appropriate links from the bilingual Projects pages.
- `F028` now has a repository-owned standalone talk bundle under `static/talks/hey-jarvis/` with six semantic scenes, authentic header artwork, normal Reading mode, and dependency-free Present mode controls with fullscreen enhancement and keyboard navigation.
- `F028` Present mode now hides the Reading masthead, restores the reader's scroll position on exit, and constrains the active scene to a dedicated presentation viewport with internal overflow protection.
- `F028` source and build verification pass after the Present-mode layout fix: 67 Python tests, 19 publisher tests, `git diff --check`, and the production Hugo build; the copied talk route and asset remain present in build output.
- Post-fix browser evaluation confirms desktop Present mode now fits all six scenes at 1440×900 with no horizontal overflow; Home, ArrowRight, and Escape behave correctly. Mobile Reading mode at 390×844 also has no horizontal overflow.
- On 2026-08-31, `F028` split the mobile Reading-mode and Present-mode button rules so the Present controls use a compact three-button row at `<=640px`; targeted talk tests, `git diff --check`, and `./init.sh` all pass after the fix.
- `F028` still awaits final desktop/mobile browser reevaluation and independent evaluator pass because this session has no callable local browser driver (`node -p "require.resolve('playwright')"` failed) and no browser-control tool was available for localhost verification.
- Root-agent browser reevaluation found that compact mobile buttons alone are insufficient: the Present DOM places content before controls, but the grid rows are declared `auto minmax(0, 1fr)`. The scene therefore consumes the auto row and compresses the control row; at 390×844 the buttons still sit around y=882…927. F028 must swap the rows to `minmax(0, 1fr) auto` before final verification.
- On 2026-08-31, `F028` swapped the Present root grid rows to `minmax(0, 1fr) auto` so the content-first DOM order keeps the active scene flexible and the mobile control shell intrinsic. Targeted talk tests, `git diff --check`, and `./init.sh` all passed again after the fix.
- `F028` remains in progress until a fresh desktop/mobile browser reevaluation confirms the repaired mobile Present layout and a separate evaluator records `EVAL_PASS: F028`.
- Browser reevaluation after the grid-row swap confirms the control shell and all three buttons now fit inside 390×844, but dense scenes 4–6 still expand past the viewport because the Present root has only `min-height: 100vh`. F028 must use a definite `height: 100vh`/`min-height: 0` so the first grid row is bounded and long scene content scrolls internally.
- On 2026-08-31, `F028` replaced the Present root's indefinite `min-height: 100vh` with a definite `height: 100vh` plus `min-height: 0`, so dense scenes 4–6 stay inside the presentation viewport and scroll within the active scene shell. Targeted talk tests, `git diff --check`, and `./init.sh` all passed again after the fix.
- Root-agent browser verification shows the root height is now bounded but the nested content/list/item/scene chain still expands its minimum content size. Dense scenes 4–6 remain taller than the first grid row and do not scroll internally. F028 must apply `min-height: 0` and hidden overflow along the chain, then give the scene shell `height: 100%; min-height: 0; overflow: auto`.
- On 2026-08-31, `F028` applied the nested Present overflow containment chain in `talk.css`: the content, scene list, scene item, and scene now clamp overflow while the active scene shell owns `height: 100%`, `min-height: 0`, and `overflow: auto`. Targeted talk tests, `git diff --check`, and `./init.sh` all passed again after the fix.
- The scheduler selected lower-attempt F029 ahead of resumed F028; that run was interrupted before implementation. F029 is dependency-blocked until F028 passes, preventing Projects links from pointing at an unaccepted presentation.
- The installed Harness `0.3.8` does not expose the newer documented `--render-prompt plan` option; planning followed the canonical local spec-normalization and feature-decomposition documents directly, and implementation remains orchestrator-first.
- `F028` still awaits fresh desktop/mobile browser reevaluation of the nested-overflow fix and a separate evaluator pass; this coding session did not have a callable local browser driver or browser-control tool for localhost verification.
- Root-agent browser verification now confirms the nested overflow fix: at 390×844 every scene stays at y=12…650, controls remain at y=666…832, document width equals viewport width, and dense scenes scroll internally. Desktop verification also keeps all scenes and controls inside the viewport. One final visual defect remains: progress, help, and Exit inherit dark text on the dark Present shell and need explicit high-contrast colors.
- On 2026-08-31, `F028` assigned explicit Present-mode dark-shell contrast colors for progress, help, and Exit, and added a CSS contract test for those tokens. `python3 -m unittest tests.test_hey_jarvis_talk`, `git diff --check`, and `./init.sh` all pass after the fix.
- The final post-contrast browser reevaluation in `.agent-harness/runs/20260831-F028-browser-eval.md` confirms desktop and mobile Reading/Present behavior, keyboard controls, dark-shell contrast, and no clipping or horizontal overflow across all six scenes.
- On 2026-08-31, an independent Evaluator Agent accepted `F028` and recorded `EVAL_PASS: F028`; dependent `F029` is now unblocked as the next feature.
- On 2026-08-31, a manual Coding Agent fallback implemented `F029` from the project root by adding `/talks/hey-jarvis/` discovery links to both Projects pages, extending Projects-page tests to cover source and rendered output, and rerunning `git diff --check` plus `./init.sh`; `F029` now awaits independent evaluator evidence before it can be marked done.
- On 2026-08-31, an independent Evaluator Agent accepted `F029` after verifying the bilingual Projects links, preserved Hey Jarvis copy, rendered `/projects/` and `/zh/projects/` output, and the standalone `/talks/hey-jarvis/` destination; durable evidence is recorded in `.agent-harness/runs/20260831T153000Z-F029-eval-pass.md`.
- On 2026-08-31, user review requested `F030`: replace the abstract hero with the supplied real app screenshot, correct scene 4's second failure to the acknowledgement/Realtime two-condition readiness barrier, and align the standalone light/dark palette and typography with the main site before another browser evaluation.
- Root-agent browser verification for `F030` now passes: the screenshot preserves its natural ratio without crop or blank panel, the background is the site's flat surface, desktop/mobile Reading have no horizontal overflow, all six Present scenes and controls stay within their viewports, focus/Escape work, and durable evidence is recorded in `.agent-harness/runs/20260831-F030-browser-eval.md`.
- On 2026-08-31, a manual Coding Agent fallback implemented the `F030` talk revision in repository-owned source: the standalone hero now references the supplied real app screenshot, scene 4's second failure now describes the acknowledgement/Realtime two-condition readiness barrier, and the standalone CSS now reuses the site's light/dark palette and system-sans typography. `python3 -m unittest tests.test_hey_jarvis_talk`, `git diff --check`, and `./init.sh` all pass.
- On 2026-08-31, an independent Evaluator Agent accepted `F030` after verifying the normalized one-feature scope, repository-owned screenshot asset, corrected readiness-barrier copy, site-aligned palette/typography tokens, passing static/build tests, durable browser PASS evidence, and the continued absence of copied talk assets in the Vault; durable evidence is recorded in `.agent-harness/runs/20260831T160500Z-F030-eval-pass.md`.

## Recovery Notes

- On 2026-08-13, the legacy visible-style workflow was migrated to hidden-layout harness `0.3.8` after an initializer check found 73 missing current-runtime files.
- Pre-migration copies of `AGENTS.md`, `init.sh`, workflow state, and run evidence are recoverable from `/tmp/yanqian-harness-migrate.WXhZ17` for the duration of the current machine session.
- The configured provider was verified with `/opt/homebrew/bin/codex` `0.146.1`; `gpt-5.4` returned `PROVIDER_CHECK_OK` from stdin.
- The installed contract suite corrects one inconsistent template-version assertion from `0.3.9` to the package's actual `0.3.8` version.
