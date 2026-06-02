# Test Plan

## Verification Entry Point

Run all automated checks through:

```sh
./init.sh
```

`init.sh` must exit non-zero when any check fails.

## Automated Checks

The verification entry point runs:

1. Python unittest discovery under `tests/`.
2. A production-style Hugo build:

```sh
hugo --gc --minify --baseURL "https://yanqian.github.io/"
```
3. A Python syntax check for the workflow orchestrator:

```sh
python3 -m py_compile orchestrator.py
```

## Test Coverage Matrix

| Area | Automated Verification |
| --- | --- |
| Repository contract | Tests assert required workflow files exist and generated article content is not treated as the source writing workspace. |
| Workflow state | Tests assert `feature_list.json` is valid JSON with feature entries and `progress.md` is present. |
| Publishing boundary | Tests assert Markdown posts under `content/posts/` live only under `content/posts/Publish/`. |
| Homepage CSS regression | Tests assert Selected summary CSS keeps stable two-line clamping and does not rely on JavaScript clamp detection. |
| Article code block CSS | Tests assert class-based Chroma highlighting is enabled, syntax CSS loads before custom CSS, code-block backgrounds match inline code, `text` labels stay hidden, and language labels do not create a separate header background. |
| Public profile pages | Tests assert About and Resume expose the intended public professional summary, keep terminal styling aligned with code blocks, and avoid obvious private contact details. |
| Projects page content | Tests assert the `home-guard-tg` project entry and GitHub link exist in `content/projects.md`. |
| Article comments | Tests assert giscus is configured for GitHub Discussions, rendered after post content, scoped to its own container, styled with article-page spacing, and wired to site-hosted custom giscus themes. |
| Hugo rendering | `init.sh` runs a production-style Hugo build and requires `public/index.html`. |
| Deployment parity | GitHub Actions runs unittest discovery before the Pages build. |
| Orchestrator contract | `python3 -m py_compile orchestrator.py` must succeed. |

## Manual Verification

Manual verification is required for layout or navigation changes:

1. Run `hugo server`.
2. Open `http://localhost:1313/`.
3. Check the homepage on desktop and mobile widths.
4. Check at least one post page, one series page, and one topic/taxonomy page.
5. Confirm no text overlap, broken navigation, missing CSS, or missing article assets.

For workflow changes, also run:

```sh
python3 orchestrator.py --dry-run
```

## Quality Evaluation

Evaluate implementation quality against:

- Scope: change is limited to the requested behavior.
- Boundary: article source changes happen in Obsidian, not generated Hugo content.
- Regression risk: tests cover the behavior most likely to break.
- Build confidence: production Hugo build succeeds locally.
- Maintainability: implementation follows existing Hugo templates, CSS, and JavaScript patterns.
