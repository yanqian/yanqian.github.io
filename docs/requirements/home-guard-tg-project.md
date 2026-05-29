# Requirement: Add Home Guard TG to Projects

## Problem

The Projects page should include `home-guard-tg` as one of the selected projects on the site.

## In Scope

- Add a public project entry for `home-guard-tg` on `content/projects.md`.
- Keep the copy short and match the existing Projects page style.
- Keep the existing Projects page tone and structure.
- Add a regression test that proves the entry is present.

## Out Of Scope

- No layout rewrite.
- No content changes to existing project entries.
- No changes to the `home-guard-tg` repository itself.

## Affected Files

- `content/projects.md`
- `tests/`
- `test_plan.md`
- `progress.md`

## Acceptance Criteria

- The Projects page includes `home-guard-tg` with a public GitHub link.
- The page explains that it is a trusted-host Telegram Bot for home checking from a Mac.
- The entry stays concise and does not read like a manual.
- Automated tests fail if the project entry is removed.

## Test Plan

- Run `./init.sh`.
- Confirm the Projects page build succeeds.
- Confirm the page contains the `home-guard-tg` project name and GitHub URL.

## Manual Verification

1. Run `hugo server`.
2. Open `http://localhost:1313/projects/`.
3. Confirm the new entry appears in the selected projects section.

## Quality Risks

- The page could become too verbose if the new item does not match the existing listing style.
- The project entry could drift away from the public README if it is not kept concise.
