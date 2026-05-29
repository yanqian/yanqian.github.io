# Development Workflow

This site can use a lighter version of the workflow used by `agent-remote-tg`.

The goal is not to turn the static site into an orchestrated software product. The goal is to make site changes discussable, testable, and reviewable without blurring the Obsidian publishing boundary.

## When A Request Arrives

Classify the request first:

- Article text, title, tags, series, topics, selected state, or slug: update the Obsidian source note, then run the publishing workflow.
- Hugo rendering, homepage behavior, navigation, taxonomy, series pages, styling, deployment, or build failures: change this repository.
- Ambiguous requests: clarify the desired public behavior before editing generated content.

## Requirement Documents

Use `docs/requirements/` for larger work. A requirement document should include:

- Problem statement.
- User-visible behavior.
- In-scope and out-of-scope items.
- Affected templates, assets, config, or workflows.
- Test plan.
- Manual verification checklist.
- Acceptance criteria.

## Implementation Pattern

Prefer the existing local override structure:

- Templates: `layouts/`
- CSS: `assets/css/custom.css`
- JavaScript: `assets/js/`
- Top-level pages: `content/about.md`, `content/now.md`, `content/projects.md`, `content/resume.md`
- Deployment: `.github/workflows/hugo.yml`

Do not add a new frontend framework for ordinary site changes.

## Verification

Run:

```sh
./init.sh
```

For visual changes, also run:

```sh
hugo server
```

Then inspect:

- Homepage
- A selected post
- A series page
- A topic or taxonomy page
- Mobile viewport

