# F008 Custom Giscus Theme

## Problem

The giscus comment widget currently uses the built-in borderless light and dark themes. The borders are quieter, but the comment cards still use a GitHub-white canvas that stands apart from the site's soft green-gray article background.

## In Scope

- Add site-hosted custom giscus CSS themes for light and dark mode.
- Keep the light theme aligned with the site's `#f5f7f6` background and `#eef3f1` surface palette.
- Keep the dark theme aligned with the site's dark background and surface palette.
- Continue switching the giscus iframe theme when the site color scheme changes.
- Keep comments backed by GitHub Discussions and preserve the existing giscus repository/category configuration.

## Out Of Scope

- Rebuilding giscus UI components.
- Changing the comment storage provider.
- Customizing every GitHub control beyond the background, border, text, accent, and form colors needed for visual integration.
- Editing generated article content under `content/posts/Publish/`.

## Affected Files

- `hugo.toml`
- `layouts/_partials/posts/giscus.html`
- `static/css/giscus-light.css`
- `static/css/giscus-dark.css`
- `tests/test_giscus_comments.py`
- `feature_list.json`
- `progress.md`
- `test_plan.md`

## Test Plan

- Run `./init.sh`.
- Confirm automated tests verify custom theme URLs, static theme files, expected background colors, and theme-change synchronization.
- Manually preview a post page and confirm giscus receives the hosted custom CSS theme URL.

## Acceptance Criteria

- Light-mode giscus comments use a soft background that matches the site's article page instead of pure white.
- Dark-mode giscus comments use the site's dark surface palette.
- Theme switching continues to update the iframe without reloading the page.
- The implementation follows giscus' documented custom-theme URL support.
