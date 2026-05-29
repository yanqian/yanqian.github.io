# Requirement: Update Gentle Memories project entry

## Problem

The Projects page still marks `Gentle Memories` as under review, but the project has now passed Obsidian community review and should show the public review link.

## In Scope

- Update the `Gentle Memories` entry on `content/projects.md`.
- Replace the outdated review status with the current review status.
- Add the Obsidian community review link.
- Keep the rest of the Projects page unchanged.

## Out Of Scope

- No layout changes.
- No edits to the `Gentle Memories` repository.
- No changes to the other project entries.

## Acceptance Criteria

- The Projects page shows `Gentle Memories` as community review approved.
- The page includes the public community review link.
- The page still matches the existing Projects page style.

## Test Plan

- Run `./init.sh`.
- Confirm the updated entry and link appear in the rendered page.

## Manual Verification

1. Run `hugo server`.
2. Open `http://localhost:1313/projects/`.
3. Confirm the `Gentle Memories` entry shows the new status and link.

