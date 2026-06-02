# F009 Selection Quote Comments

## Problem

Readers should be able to start a comment from a selected passage, giving the site a lightweight document-annotation feel without building a full inline comment storage system.

## In Scope

- Show a small comment action when a reader selects text inside an article body.
- Convert the selected text into a Markdown block quote.
- Copy the quote to the clipboard.
- Scroll the reader to the existing giscus comment section.
- Provide a small status message so readers know the quote is ready to paste.

## Out Of Scope

- Writing directly into the giscus iframe. The giscus editor is cross-origin, so site JavaScript cannot safely or reliably set its input value.
- Storing inline anchors, sidebars, or per-selection comment metadata.
- Creating a custom GitHub OAuth or discussion-writing backend.
- Editing generated article content under `content/posts/Publish/`.

## Affected Files

- `layouts/_partials/head/extensions.html`
- `assets/js/selection-comment.js`
- `assets/css/custom.css`
- `tests/test_selection_comment.py`
- `feature_list.json`
- `progress.md`
- `test_plan.md`

## Test Plan

- Run `./init.sh`.
- Confirm automated tests verify post-page script loading, article-body scoping, quote formatting, clipboard behavior, comment-section scrolling, and fallback behavior.
- Manually preview a post page, select a sentence in the article body, click the floating comment action, and confirm the page scrolls to comments with a copied Markdown quote.

## Acceptance Criteria

- Selecting article text reveals a compact comment action near the selection.
- Clicking the action copies a quote that starts with Markdown `>` quote lines and includes the current article URL.
- The page scrolls to `.post-comments`.
- The UI does not appear for selections outside `.post-content`.
- The implementation remains static-site friendly and does not add a runtime service.
