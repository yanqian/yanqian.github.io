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
- The Projects page now includes `home-guard-tg` with a public GitHub link and README reference.
- The Projects page now marks `Gentle Memories` as community review approved and links to the public Obsidian review page.
- `./init.sh` runs unit tests, checks `orchestrator.py`, and performs a production-style Hugo build.
- `orchestrator.py` can preview or run bounded coding/evaluator rounds for future feature work.

## Last Completed Feature

`F004` - Update the Projects page Gentle Memories entry to show community review approval and link to the public Obsidian review page.

## Next Feature

Awaiting the next site requirement before starting another workflow round.

## Known Issues

- `hugo --gc` can clean tracked files under `resources/_gen/`; restore them before committing if they are not part of the intended change.
