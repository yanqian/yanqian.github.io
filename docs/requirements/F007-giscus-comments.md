# F007 Giscus Article Comments

## Problem

The public site needs a low-maintenance comment system that works with Hugo and GitHub Pages without adding a database or runtime server.

## In Scope

- Render a comment section at the end of post pages.
- Store comments in GitHub Discussions through giscus.
- Support replies and reactions through the giscus widget.
- Keep per-page comment threads mapped by post pathname.
- Allow individual posts to disable comments with `disableComments: true`.

## Out Of Scope

- Inline selected-text comments.
- Custom OAuth, serverless storage, or a bespoke moderation backend.
- Editing generated article content under `content/posts/Publish/`.

## Affected Files

- `hugo.toml`
- `layouts/_partials/posts/giscus.html`
- `assets/css/custom.css`
- `tests/test_giscus_comments.py`
- `feature_list.json`
- `progress.md`
- `test_plan.md`

## Test Plan

- Run `./init.sh`.
- Confirm tests cover giscus configuration, post-template placement, scoped widget rendering, and comment-section spacing.
- Manually preview at least one post page and confirm the comment section appears after the article body and series navigation.

## Acceptance Criteria

- Post pages load the giscus widget from GitHub Discussions.
- Reactions are enabled.
- Comment discussions are keyed by pathname to avoid title-change drift.
- The implementation uses the existing Hugo template structure and does not add a new frontend framework.
