# Agents

This repository is the public Hugo site for `yanqian.github.io`.

Use this repository for publishing, site structure, Hugo templates, styling, build fixes, and GitHub Pages deployment. Do not use this repository as the primary writing workspace.

## Repository Role

The writing source of truth lives in the Obsidian vault:

```text
/Users/armstrong/Library/Mobile Documents/iCloud~md~obsidian/Documents/vault-obs-yan
```

The public article projection is generated from that vault into:

```text
content/posts/Publish/
```

Keep this boundary intact:

```text
Obsidian source notes -> vault Publish/ projection -> this Hugo repo -> GitHub Pages
```

## What To Edit Here

Edit this repository for:

- Hugo configuration in `hugo.toml`.
- Templates in `layouts/`.
- Homepage, taxonomy, series, and post rendering behavior.
- Styling in `assets/css/custom.css`.
- Small frontend behavior in `assets/js/`.
- Top-level site pages in `content/about.md`, `content/now.md`, `content/projects.md`, and `content/resume.md`.
- GitHub Actions and deployment fixes in `.github/`.

When changing UI behavior, prefer the existing Hugo template and CSS patterns over introducing new frameworks.

## What Not To Edit Here

Do not write or maintain article drafts in this repository.

Avoid hand-editing generated article content under:

```text
content/posts/Publish/
```

Those files are generated from Obsidian by the QuickAdd publishing workflow. If article text, title, tags, series, topics, selected state, or slug needs to change, update the source note in the Obsidian vault, run `Publish Note`, then run `Sync Published Site`.

Do not reintroduce non-`Publish` vault paths under `content/posts/`, such as:

```text
content/posts/01-Note/
content/posts/02-Project/
content/posts/04-Reference/
content/posts/System Design/
```

If these appear again, they were accidentally synced from the vault and should be removed from the blog repo. The intended GitHub Publisher configuration is `selectedPaths: ["Publish"]` and `publishTags: []`.

## Public Content Metadata

Hugo uses frontmatter from the generated `Publish/<slug>/index.md` files. Important fields:

```yaml
tags:
  - public
series: "Remote Agent Workflow"
seriesOrder: 3
topics:
  - remote-agent-workflow
selected: true
excludeFromLatest: true
```

Behavior:

- `series` and `seriesOrder` drive series pages and previous/next navigation.
- `topics` drive topic taxonomy pages.
- `selected: true` places a post in the homepage `Selected` section.
- `excludeFromLatest: true` keeps a page out of the homepage `Latest` section.

Do not use `featured`; the current homepage curation field is `selected`.

## Local Verification

Run a production-style build before pushing site/template changes:

```sh
hugo --gc --minify --baseURL "https://yanqian.github.io/"
```

`hugo --gc` may delete tracked files under `resources/_gen/`. If those files are not part of the intended change, restore them before committing.

For local preview:

```sh
hugo server
```

Then open:

```text
http://localhost:1313/
```

## Deployment

Pushing to `main` triggers `.github/workflows/hugo.yml` and deploys GitHub Pages.

After pushing, check the workflow result with GitHub Actions. A successful deploy should build Hugo, upload the artifact, and complete the Pages deploy job.

## Known Publishing Pitfall

The Obsidian GitHub Publisher plugin combines `selectedPaths` and `publishTags` as OR, not AND. If it is configured with both `selectedPaths: ["Publish"]` and `publishTags: ["#public"]`, it will publish all files under `Publish/` plus every Markdown file in the vault tagged `#public`.

That causes private source-note paths to appear under `content/posts/` and can duplicate articles in Hugo series pages. Keep tag filtering in the Obsidian QuickAdd script, not in GitHub Publisher.
