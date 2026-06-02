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
- `./init.sh` runs unit tests, checks `orchestrator.py`, and performs a production-style Hugo build.
- `orchestrator.py` can preview or run bounded coding/evaluator rounds for future feature work.

## Last Completed Feature

`F008` - Add site-hosted custom giscus themes so the comment iframe background matches the site's light and dark palettes.

## Next Feature

Awaiting the next site requirement before starting another workflow round.

## Known Issues

- `hugo --gc` can clean tracked files under `resources/_gen/`; restore them before committing if they are not part of the intended change.
