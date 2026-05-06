# Personal Blog Handoff for Codex

## Goal

Build and polish my personal website using Hugo + Coder theme, hosted on GitHub Pages at:

<https://yanqian.github.io/>

The repo is:

```text
yanqian.github.io
```

The site already runs locally and GitHub Actions deployment has succeeded. Hugo build output includes `public/index.html`, so the deployment pipeline is basically working.

## Current Architecture

```text
Obsidian
  ↓ future: public tag / publish metadata
GitHub Publisher / Enveloppe
  ↓ publish to content/posts/
Hugo
  ↓ build static site
GitHub Actions
  ↓ deploy to GitHub Pages
https://yanqian.github.io/
```

## Existing Decisions

- Static site generator: Hugo
- Theme: hugo-coder
- Hosting: GitHub Pages
- Deployment: GitHub Actions
- Future writing source: Obsidian vault
- Future publish mechanism: GitHub Publisher / Enveloppe plugin
- Obsidian should remain my private knowledge system; public posts should be projected into Hugo, not reorganize my vault.

## References

- Hugo GitHub Pages deployment docs: <https://gohugo.io/host-and-deploy/host-on-github-pages/>
- Hugo Coder theme repo: <https://github.com/luizdepra/hugo-coder>
- Enveloppe / Obsidian GitHub Publisher: <https://github.com/Enveloppe/obsidian-enveloppe>

## Current Status

GitHub Actions workflow exists at:

```text
.github/workflows/hugo.yml
```

CI build check showed:

```text
public/index.html exists
Pages = 11
Static files = 7
```

The workflow deploys successfully.

## What I Want Codex To Do Next

### Phase 1: Inspect Current Repo

1. Inspect the repo structure.
2. Read:
   - `hugo.toml` or equivalent Hugo config file
   - `.github/workflows/hugo.yml`
   - `content/`
   - `layouts/`
   - `assets/`
   - `static/`
   - theme setup under `themes/`
3. Do not rewrite the site from scratch unless necessary.

### Phase 2: Make Coder Theme Configuration Clean

Update Hugo config for a clean personal homepage.

Preferred identity:

```text
Name: Yan Qiang
Role: Backend Engineer · Platform Engineering · Systems Thinking
Site style: minimal, clean, typography-focused, similar to cyprien.io
```

Add or verify:

- Site title
- Author
- Description
- Keywords
- Main menu:
  - Blog -> `/posts/`
  - About -> `/about/`
- Social links:
  - GitHub, if already known from repo remote
  - LinkedIn only if configured by me later

Avoid adding fake links.

### Phase 3: Create Basic Content

Create or update:

```text
content/about.md
content/posts/hello-world.md
```

The About page should be concise and professional.

Suggested positioning:

```text
I am a backend/platform engineer focused on reliable systems, operational tooling, and practical engineering workflows.
```

Do not mention sensitive employment details.

### Phase 4: Improve GitHub Actions Robustness

Keep deployment via GitHub Pages Actions.

Ensure workflow:

- Uses Hugo Extended
- Checks out submodules recursively
- Builds with correct `baseURL`
- Uploads `public/`
- Has a sanity check for `public/index.html`

Keep this check:

```yaml
- name: Check public output
  run: |
    ls -la public
    find public -maxdepth 2 -type f | head -50
    test -f public/index.html
```

### Phase 5: Prepare for Obsidian Publishing

The future integration target is:

```text
Obsidian public notes -> content/posts/
```

Create a short document:

```text
docs/obsidian-publishing.md
```

It should specify:

- Obsidian remains the source of truth.
- Public notes should use frontmatter.
- Enveloppe/GitHub Publisher should publish only public notes.
- Output path should be `content/posts/`.
- Do not publish to repo root.
- Avoid leaking private notes.

Recommended public post frontmatter:

```yaml
---
title: "Post Title"
date: 2026-05-05
draft: false
tags: ["backend", "system-design"]
categories: ["engineering"]
public: true
---
```

Mention that Obsidian wikilinks like `[[Kafka]]` may need conversion to standard Markdown links before Hugo build.

### Phase 6: Acceptance Criteria

After changes, these commands should pass:

```bash
hugo --gc --minify
test -f public/index.html
```

Optional local preview:

```bash
hugo server -D
```

The site should remain deployable by GitHub Actions.

## Constraints

- Do not delete existing Git history.
- Do not remove the Hugo theme unless there is a clear reason.
- Do not commit generated `public/` unless the current repo already intentionally tracks it.
- Do not publish private notes.
- Do not introduce heavy frontend frameworks.
- Keep design minimal and clean.
- Prefer small, reviewable commits.

## Suggested Commits

First commit:

```text
Polish Hugo Coder site configuration and add starter content
```

Second commit:

```text
Document Obsidian publishing workflow
```
