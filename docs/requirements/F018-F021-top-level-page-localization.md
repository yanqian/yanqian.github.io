# F018–F021 Top-Level Page Localization

## Problem

The Hugo site has a bilingual shell and paired article translations, but its repository-owned About, Now, Projects, and Resume pages are still available only in English. Chinese readers fall back to the Chinese homepage instead of reaching equivalent top-level pages.

## In Scope

- Localize About, Now, Projects, and Resume in that order.
- Treat each page as a separate approval-gated feature.
- Use natural, concise Chinese while keeping each English page as the factual source.
- Preserve English URLs and add paired Chinese routes under `/zh/`.
- Use the repository's `.zh.md` file convention and explicit shared `translationKey` values.
- Localize page-specific template text through Hugo i18n when needed.

## Out Of Scope

- Editing `content/posts/Publish/`.
- Running Obsidian Publish Note or synchronizing the vault.
- Adding facts, correcting source facts, or restoring private contact details.
- Committing, pushing, or deploying before explicit approval.

## Affected Files

- `content/about.md` and `content/about.zh.md` for F018.
- `content/now.md` and `content/now.zh.md` for F019.
- `content/projects.md` and `content/projects.zh.md` for F020.
- `content/resume.md` and `content/resume.zh.md` for F021.
- `hugo.toml`, `i18n/`, relevant `layouts/`, and `tests/` as each approved page requires.

## Acceptance Criteria

- Each Chinese page reads naturally and preserves all material source facts, dates, names, links, order, and privacy boundaries.
- English pages keep their existing root URLs; Chinese pages render under `/zh/`.
- Each language switch points directly to the paired page.
- Shared templates do not leak avoidable English interface copy into the Chinese page.
- The Chinese navigation adds only pages whose translations exist.
- `./init.sh` passes after each page.

## Test Plan

- Compare every localized page against its complete English source.
- Assert shared `translationKey` values and unchanged links.
- Build both languages and inspect the English and Chinese output routes.
- Check paired language-switch targets, alternate metadata, layout, and page-specific interface text.
- Run `./init.sh` after each page.

## Manual Verification

1. Start `hugo server`.
2. Open the English page and its `/zh/` translation.
3. Switch in both directions and confirm the paired route is retained.
4. Check desktop and narrow viewport layout.
5. Review the Chinese page before starting the next feature.

## Quality Risks

- Literal translation may introduce English syntax or inflated promotional language.
- Shared templates may leave English text even when the Markdown body is localized.
- Adding navigation before content exists can create broken links.
- Resume and project facts can drift if names, dates, statuses, or links are not checked individually.
