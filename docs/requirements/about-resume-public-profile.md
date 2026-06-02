# Requirement: Refresh public About and Resume pages

## Problem

The About page and Resume page should better reflect Armstrong Yan's public professional profile while staying consistent with the site's writing themes around backend systems, platform engineering, reliable operations, AI-assisted workflows, and personal knowledge systems.

The existing terminal identity block also uses a dark background that feels visually heavier than the site's current light code-block treatment.

## In Scope

- Update the About page copy to present a concise, professional public introduction.
- Update the Resume page as a public resume summary, not a full private resume.
- Use the private PDF resume only as reference for broad public themes: backend engineering, platform engineering, distributed systems, reliability, troubleshooting, cloud infrastructure, event-driven systems, and automation.
- Update the terminal identity block to say `我是 Armstrong Yan`.
- Align the terminal identity block's background and foreground colors with the site's code block palette.
- Add automated checks for the highest-risk public content and styling regressions.

## Out Of Scope

- Publishing the private PDF resume.
- Adding phone numbers, private email addresses, exact addresses, or other contact details.
- Adding full employment history dates or private/internal project details.
- Editing generated article content under `content/posts/Publish/`.
- Reworking the site navigation or replacing the existing Hugo/theme structure.

## Affected Files

- `content/about.md`
- `content/resume.md`
- `layouts/_partials/page.html`
- `assets/css/custom.css`
- `tests/test_public_profile_pages.py`
- `feature_list.json`
- `progress.md`
- `test_plan.md`

## Acceptance Criteria

- About presents Armstrong Yan as a backend and platform engineer based in Singapore.
- Resume presents a public professional summary without private contact details.
- Resume includes event-driven systems as the clearer term for asynchronous backend work.
- Terminal background uses the same panel background as code blocks.
- Terminal identity shows `我是 Armstrong Yan`.
- Automated tests cover terminal styling, public profile content, and obvious personal-information leakage.
- A production-style Hugo build succeeds.

## Test Plan

- Run `./init.sh`.
- Run `hugo --gc --minify --baseURL "https://yanqian.github.io/"`.
- Confirm the new public-profile tests pass.

## Manual Verification

1. Run `hugo server`.
2. Open `http://localhost:1313/about/`.
3. Confirm the terminal block no longer appears as a heavy dark panel in the light theme.
4. Confirm About copy matches the site's professional writing themes.
5. Open `http://localhost:1313/resume/`.
6. Confirm Resume reads as a public summary and does not expose private contact details.

## Quality Risks

- Resume-derived text could accidentally expose private contact information; tests should guard obvious email, phone, and private PDF references.
- About and Resume can drift into a full CV; keep them concise and public-facing.
- Terminal style variables exist in multiple color-scheme blocks; update them consistently.
