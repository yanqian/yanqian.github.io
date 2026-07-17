# F010 Multilingual Site Foundation

## Problem

The site currently builds only an English Hugo site. Future Obsidian publishing should be able to provide English and Chinese versions of an article, but the public site first needs stable language URLs, localized interface copy, and a predictable switching contract.

## In Scope

- English remains at the current root URLs.
- Simplified Chinese is generated under `/zh/`.
- Language-specific menus and metadata.
- A visible English/Chinese switch on every page.
- Paired-translation links when available and target-language homepage fallback when unavailable.
- Localized copy in local homepage, list, post, taxonomy, series, comment, and footer templates.
- Alternate-language metadata and bilingual production-build tests.

## Out Of Scope

- Editing or translating generated posts in `content/posts/Publish/`.
- Obsidian QuickAdd, GitHub Publisher, or AI translation changes.
- Browser-language redirects or a client-side preference store.
- Moving English pages to `/en/`.
- Translating the About, Now, Projects, or Resume body copy in this feature.

## Expected Implementation

- Configure Hugo languages and language-owned menus in `hugo.toml`.
- Add project-level `i18n/en.toml` and `i18n/zh.toml` keys for local template copy.
- Replace hard-coded English labels and root-relative taxonomy/list links with `i18n` and language-relative Hugo URLs.
- Make the header switch explicit, accessible, and fallback-safe.
- Add alternate-language links through the local head extension.
- Add localized Chinese taxonomy index frontmatter so Hugo's native title, Open Graph, and Twitter metadata use Chinese names.
- Add contract and rendered-output tests without placing source notes under `content/posts/`.

## Acceptance Criteria

1. Existing English pages keep their current root URLs.
2. `/zh/index.html` is generated and has `lang="zh"` plus Chinese interface text.
3. The language switch selects a page translation when present and otherwise selects the other language homepage.
4. Local templates contain no user-visible hard-coded English for the covered site-shell surfaces.
5. Hugo-generated links are language-relative rather than hard-coded to root English paths.
6. Alternate-language metadata is correct for language homepages and translated pages.
7. `./init.sh` passes and generated article Markdown remains untouched.

## Manual Verification

1. Run `hugo server`.
2. Inspect `/` and `/zh/` at desktop and mobile widths.
3. Confirm the English menu remains unchanged and the Chinese menu is localized.
4. Open an untranslated English article, select `中文`, and confirm the fallback is `/zh/`.
5. Inspect a paired test fixture or future paired page and confirm switching preserves the page.
6. Check homepage, post, series, topic, and taxonomy layouts for missing labels or root-language link leaks.

## Quality Risks

- Accidentally moving or redirecting established English URLs.
- Linking Chinese navigation to untranslated pages that do not exist.
- Cross-language leakage in `.Site.RegularPages` queries.
- Losing existing giscus discussions by changing English pathnames.
- A switch that disappears on untranslated pages, leaving readers trapped in one language.
