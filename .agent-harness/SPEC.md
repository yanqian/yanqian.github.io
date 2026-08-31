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

## 13. Peel-to-Reveal Songs on the Now Page

### Goal

Turn the two-song list on the bilingual Now page into a small, tactile discovery: a sticker initially covers the songs, and peeling it away reveals the list for the rest of the current page view.

### Included Scope

- Keep both existing song titles and YouTube URLs unchanged on the English and Chinese Now pages.
- Cover only the two-song list with a theme-aware sticker; surrounding Listening copy remains visible.
- Let pointer and touch users peel from any edge, showing the song list progressively beneath the sticker.
- A sufficiently deep peel removes the sticker in the actual locked drag direction—right, left, down, or up—and leaves the songs visible.
- Partial peels return to the covered state.
- Enter or Space reveals the songs for keyboard users; reduced-motion users reveal them immediately.
- Refreshing or revisiting the page restores the sticker because reveal state is not persisted.

### Excluded Scope

- Any homepage sticker or personal-brand wordmark treatment.
- Audio playback, embedded YouTube players, autoplay, analytics, or changes to the song links.
- Persisting reveal state in cookies, local storage, session storage, or a backend.
- Automatically covering the songs again during the same page view.

### Core Flow

`Now page opens -> sticker covers the two-song list -> reader partially peels and releases, or peels past the threshold -> sticker departs -> songs remain visible until page refresh`.

### Constraints And Assumptions

- The effect is limited to repository-owned `content/now.md` and `content/now.zh.md`.
- Without JavaScript, the song list remains visible and usable.
- JavaScript adds the cover and temporarily removes the hidden links from keyboard and assistive-technology navigation.
- The visual treatment uses existing site tokens and stays readable in light and dark modes.

### Required Capabilities And Implementation Paths

- A paired Hugo shortcode under `layouts/shortcodes/`.
- Now-page-only script loading through a frontmatter flag and the Hugo asset pipeline.
- Dependency-free pointer, keyboard, accessibility, and reduced-motion behavior in `assets/js/song-reveal.js`.
- Theme-aware presentation in `assets/css/custom.css`.
- Automated rendered-output and interaction-contract tests under `tests/`.

### Verification Surface

- English and Chinese Now pages render the same two links inside the reveal component.
- The homepage and unrelated pages do not render the component or load its script.
- A full peel or keyboard activation removes the sticker without scheduling a return.
- A partial peel springs back, and refreshing restores the initial sticker.
- No persistence API is used.
- Desktop and mobile checks cover light/dark contrast, clipping, departure, link focus, and layout stability.

### Decomposition

This requirement is one feature, `F024`, because the paired content wrapper, shortcode, scoped asset loading, reveal behavior, accessibility, and verification form one cohesive Now-page interaction.

## 14. Replace Home Guard TG with Hey Jarvis on Projects

### Goal

Keep the bilingual Projects page aligned with the current public portfolio by removing Home Guard TG and adding Hey Jarvis with accurate product, privacy, compatibility, and release-status context.

### Included Scope

- Replace the Home Guard TG entry in both English and Chinese, place Hey Jarvis first, and preserve the relative order of the other projects.
- Describe Hey Jarvis as a local-first, BYOK macOS voice assistant with local wake-word detection, continuous bilingual conversation, deterministic or provider-backed tools, and native Mac lifecycle safeguards.
- Link both languages to the public GitHub repository and `v0.1.0-internal` GitHub Release; link the English page only to the English demo and the Chinese page only to the Chinese demo.
- State that the public evaluation build targets Apple Silicon on macOS 14 or later, is unsigned and not notarized, needs the user's OpenAI API key, and is not a general consumer release.
- Update the Projects page summary and areas list so they describe voice interaction instead of trusted-host home automation.

### Excluded Scope

- Editing the generated Hey Jarvis article under `content/posts/Publish/`.
- Linking the introductory article from the Projects entry.
- Showing both language demos on the same Projects page.
- Embedding YouTube players or release downloads in the Projects page.
- Claiming Developer ID signing, notarization, automatic updates, general consumer readiness, or commercial maturity.
- Changing the other project entries or their order.

### Core Flow

`reader opens Projects -> finds Hey Jarvis first -> understands its local-first voice workflow and evaluation-build limits -> chooses source, same-language demo, or release link`.

### Constraints And Assumptions

- English and Chinese carry the same product facts and release boundaries in natural language, while each page exposes only its matching-language demo.
- Public repository, article, demo, and release pages are the factual references.
- The exact Chinese demo URL keeps its supplied `t=9s` parameter.

### Required Capabilities And Implementation Paths

- Repository-owned bilingual pages at `content/projects.md` and `content/projects.zh.md`.
- Existing Projects content tests under `tests/test_projects_page.py`.
- Production Hugo rendering through `./init.sh`.

### Verification Surface

- Both source pages place Hey Jarvis first and contain GitHub, the matching-language demo, and the internal release link.
- Neither page links the introductory article or the other language's demo.
- Neither source page contains Home Guard TG or its repository URL.
- Automated checks preserve the local-first/BYOK description and unsigned, unnotarized evaluation-build boundary in both languages.
- The production Hugo build renders `/projects/` and `/zh/projects/` successfully.

### Decomposition

This requirement is one feature, `F025`, because the bilingual replacement, factual links, release boundary, and regression checks form one Projects-page content change with one rendered verification surface.

## 15. Standalone Hey Jarvis Meetup Talk

### Goal

Publish the Hey Jarvis meetup share as a repository-owned standalone HTML experience that is straightforward to edit at the DOM level, works as both a readable web page and a keyboard-driven presentation, and is discoverable from the bilingual Projects pages.

### Included Scope

- Add an English standalone page at `/talks/hey-jarvis/` with project-owned HTML, CSS, JavaScript, and authentic Hey Jarvis imagery under `static/talks/hey-jarvis/`.
- Preserve the six-scene narrative: real hands-free problem, wake-to-return demo loop, one-microphone-owner architecture, three real-device failures, evaluator-gated AI workflow, and final human-judgment question.
- Keep a normal scrolling Reading mode plus an explicit Present mode with fullscreen enhancement, scene progress, Arrow/Page/Home/End/Space navigation, and Escape exit.
- Keep the document readable without JavaScript and on mobile, respect reduced motion, and support the site's light/dark visual language without depending on Hugo article markup.
- Reuse the existing Hey Jarvis visual asset and link to the public repository, English demo, `v0.1.0-internal` release, and related public article series with the existing unsigned/BYOK boundaries.
- Add language-appropriate links from both `/projects/` and `/zh/projects/` to the English talk page.

### Excluded Scope

- Reintroducing the rejected Hugo `talk` post layout, Talk shortcode, publisher `layout` metadata, or source-only localization behavior.
- Treating the standalone talk as an Obsidian-generated article or requiring a Chinese translation of the presentation.
- Changing ordinary post rendering, navigation, the existing Projects descriptions, or the other Hey Jarvis links.
- Adding a JavaScript framework, analytics, autoplaying media, presenter-state persistence, or a repository-hosted copy of the full demo video.
- Publishing, committing, or pushing before explicit user approval.

### Core Flows

`reader opens /talks/hey-jarvis/ -> scrolls six semantic scenes -> follows project or article links`.

`presenter opens /talks/hey-jarvis/ -> activates Present -> navigates scenes by keyboard -> exits Present without losing content`.

`visitor opens English or Chinese Projects -> selects the language-appropriate meetup link -> arrives at the standalone English talk`.

### Constraints

- The standalone page is the canonical public implementation and must not depend on Markdown-generated DOM, Hugo content layouts, or the Obsidian publisher.
- No Hey Jarvis meetup webpage source, copied asset, or `Publish/hey-jarvis-beyond-the-demo` projection remains in the Obsidian vault; the blog repository is the sole source of truth for this page.
- The page must use relative or root-relative assets and links that work under the existing GitHub Pages deployment.
- The HTML remains semantic and accessible: one primary heading, labeled controls, ordered scene structure, visible focus, and progressive enhancement.
- Existing site and Projects-page behavior must remain unchanged outside the new link.

### Ambiguities And Assumptions

- The talk remains English-only; the Chinese Projects label explicitly indicates that the linked share is in English.
- The public route is `/talks/hey-jarvis/`, rather than a locale-prefixed or post URL, because the presentation is language-independent site media rather than a translated Hugo article.
- The reviewed six-scene copy and authentic header artwork are migrated into the blog repository as the content baseline; layout can be refined in HTML/CSS without changing the factual story.
- The repository-owned content brief at `.agent-harness/docs/hey-jarvis-meetup-talk.md` is the editorial baseline for F028; the implementation must not read or recreate a source note in the Obsidian vault.
- The previously attempted `F026` and `F027` identifiers stay retired; replacement work starts at `F028` to preserve rejection history and avoid ambiguity.

### Required Capabilities And Implementation Paths

- Standalone source under `static/talks/hey-jarvis/index.html`, `talk.css`, `talk.js`, and `assets/`.
- Editorial source under `.agent-harness/docs/hey-jarvis-meetup-talk.md`, with authentic artwork sourced from `/Users/armstrong/Project/hey-jarvis/artifacts/video/hey-jarvis-header-background.png` and copied only into the blog repository.
- Repository-owned Projects content in `content/projects.md` and `content/projects.zh.md`.
- Static-page and Projects-link regression coverage under `tests/`, with production verification through `./init.sh`.
- Local Hugo preview and explicit desktop/mobile Reading and Present inspection before approval.

### Verification Surface

- Static contract tests parse the standalone HTML and assert six semantic scenes, authentic links and asset references, accessible controls, progressive enhancement, and the absence of external framework dependencies or persistence APIs.
- Interaction-contract tests assert fullscreen handling, supported keyboard commands, Escape exit, reduced-motion behavior, and mobile Reading fallback.
- Hugo build tests assert `/talks/hey-jarvis/index.html` is copied to production output and both rendered Projects pages link to it without losing existing Hey Jarvis links.
- Desktop and mobile local previews verify Reading flow, Present scene sizing, first-scene balance, focus, contrast, and absence of clipping or horizontal overflow.

### Decomposition

- `F028` creates and independently verifies the standalone HTML talk and retires all dependency on the rejected Markdown renderer.
- `F029` adds and verifies bilingual Projects discovery links after the destination exists. This is separate because Projects navigation can be accepted or reverted independently from the presentation implementation.

## 16. Refine the Hey Jarvis Talk with the Real App UI

### Goal

Make the standalone talk feel visually continuous with `yanqian.github.io` and more credible as a product story by using the supplied real Hey Jarvis app screenshot and correcting the second failure example.

### Included Scope

- Replace the current abstract hero artwork with the user-supplied Hey Jarvis app screenshot, copied only into the standalone talk's repository-owned assets.
- Update scene 4's second failure from the stale dual-media-owner example to the acknowledgement-readiness race: “I’m here” can play before Realtime is ready, so the acknowledgement becomes a verifiable promise guarded by a two-condition readiness barrier.
- Align the standalone page's light and dark backgrounds, foregrounds, muted text, accent, borders, surfaces, typography, and overall restraint with the existing tokens in `assets/css/custom.css`.
- Preserve the six-scene story, Reading and Present interactions, Projects links, and public product boundaries.

### Excluded Scope

- Rewriting the other five scenes, adding a Chinese talk, or changing Projects-page copy and links.
- Importing the Hugo site shell or making the standalone route depend on generated article markup.
- Adding a new theme switcher, framework, persistence, animation system, or generated illustration.
- Committing, pushing, or publishing before explicit user approval.

### Core Flows

`reader opens the talk -> recognizes the real Hey Jarvis UI -> reads a visual treatment consistent with the main site -> reaches scene 4 and sees the corrected readiness-race failure`.

`presenter enters Present mode -> all six scenes and controls retain their verified keyboard, viewport, contrast, and overflow behavior with the revised theme`.

### Constraints

- The screenshot remains a local static asset with an accurate alt description and no dependency on the temporary clipboard path at runtime.
- Standalone light/dark tokens match the current site palette: `#f5f7f6`/`#252b29` in light mode and `#202827`/`#e8eeee` in dark mode, with corresponding site surface, muted, accent, and border colors.
- The new second failure copy must describe a race between acknowledgement playback and Realtime initialization, and state that both conditions must be ready before “I’m here” is a valid promise.
- Existing responsive and accessible behavior must not regress.

### Ambiguities And Assumptions

- “Match the site” means reuse the established palette and system sans-serif typography while retaining the talk's standalone composition and Present controls.
- The supplied screenshot is approved for public use and replaces, rather than supplements, the current hero image.
- The talk remains English, so the user-supplied Chinese concept is rendered as concise natural English copy.

### Required Capabilities And Implementation Paths

- The supplied PNG at `/var/folders/ww/wrxzkc9n7rs60hbt_g7mgcl40000gn/T/codex-clipboard-e96cb8f2-fb86-4a96-a03c-7a5cab636e95.png` as an input asset, copied to `static/talks/hey-jarvis/assets/`.
- Standalone copy and asset references in `static/talks/hey-jarvis/index.html` and `.agent-harness/docs/hey-jarvis-meetup-talk.md`.
- Theme and responsive refinements in `static/talks/hey-jarvis/talk.css`.
- Regression contracts in `tests/test_hey_jarvis_talk.py` and production verification through `./init.sh`.
- Real-browser desktop and 390px mobile inspection in Reading and Present modes.

### Verification Surface

- Static tests verify the new screenshot asset/reference/alt text, the readiness-barrier copy, and exact correspondence with the site's core palette.
- The production Hugo build copies the revised standalone route and image.
- Browser checks verify the hero crop, six-scene Present layout, readable light/dark contrast, focus, and absence of clipping or horizontal overflow on desktop and mobile.
- Vault checks continue to find no Hey Jarvis meetup webpage source or copied presentation asset.

### Decomposition

This is one feature, `F030`, because the image, corrected failure copy, and palette refinement are one user-reviewed visual/content revision to the same standalone page and share the same static, build, and browser verification surface.
