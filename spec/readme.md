# Personal Website

## Overview

This repository powers my personal website:

<https://yanqian.github.io/>

The site is built with:

- Hugo
- Hugo Coder theme
- GitHub Pages
- GitHub Actions
- Obsidian
- Obsidian GitHub Publisher
- QuickAdd

The goal is:

> Write freely in Obsidian, selectively publish public notes, and automatically deploy them as a personal website.

## UI Direction

The current redesign direction is a writing-first personal engineering site:

- The homepage should primarily act as an article index.
- A compact `Armstrong Yan` identity block can appear above the article list.
- The terminal/neofetch-style identity block belongs on the About page.
- The visual style should be minimal, narrow, and readable.
- The accent color should lean teal or blue-green to fit backend/platform engineering.
- Light and dark modes should remain available.

Detailed UI decisions and implementation tasks live in:

- [`spec/ui-redesign.md`](spec/ui-redesign.md)
- [`spec/implementation-plan.md`](spec/implementation-plan.md)

## Architecture

```text
Obsidian private vault
        ↓
QuickAdd publish script
        ↓
Publish/ folder
        ↓
Obsidian GitHub Publisher
        ↓
content/posts/
        ↓
Hugo build
        ↓
GitHub Actions
        ↓
GitHub Pages
        ↓
https://yanqian.github.io/
```

## Core Design

### 1. Obsidian remains private

The Obsidian vault is the source of truth for personal notes.

Private folders such as `00-Inbox`, `Notes`, `Projects`, or other personal structures should not be exposed directly to GitHub Pages.

### 2. Publish is a projection layer

Published content is copied into:

```text
Publish/
```

The `Publish/` folder is treated as a clean public projection, not the original knowledge structure.

### 3. GitHub Publisher only publishes public-ready content

Obsidian GitHub Publisher should be configured to publish from:

```text
Publish/
```

to:

```text
content/posts/
```

It should not publish directly from the whole vault.

## Website Structure

The Hugo site uses mostly fixed pages plus a dynamic home/blog section.

```text
content/
├── about.md
├── now.md
├── projects.md
├── resume.md
└── posts/
```

Page roles:

- `Home`: public writing and recent posts
- `Projects`: project links and summaries
- `About`: personal profile
- `Now`: current status
- `Resume`: resume information
- `Posts`: public articles generated from Obsidian

## Publishing Workflow

### Step 1: Write in Obsidian

Notes can be written anywhere in the private vault, for example:

```text
00-Inbox/
Notes/
Projects/
```

### Step 2: Prepare a note for publishing

Run the QuickAdd publishing command.

Expected behavior:

```text
Current note
    ↓
Read note content
    ↓
Remove existing frontmatter if needed
    ↓
Add Hugo-compatible frontmatter
    ↓
Copy/update note in Publish/
```

Example generated file:

```text
Publish/my-post.md
```

### Step 3: Sync with GitHub Publisher

GitHub Publisher sends files from:

```text
Publish/
```

to:

```text
content/posts/
```

Recommended GitHub Publisher settings:

```text
Repository: https://github.com/yanqian/yanqian.github.io
Branch: main
Target folder in repo: content/posts
Notes/folders to export: Publish
Publish files with given tags: public
```

### Step 4: Deploy

GitHub Actions builds the Hugo site and deploys it to GitHub Pages.

The production site is:

<https://yanqian.github.io/>

## Published Post Frontmatter

Published posts should use Hugo-compatible frontmatter:

```yaml
---
title: "Post Title"
date: 2026-05-06
draft: false
tags: [public]
categories: []
---
```

## QuickAdd Script

The QuickAdd script should live in a normal vault folder, not inside `.obsidian/`.

Correct:

```text
Scripts/publish-note.js
```

Incorrect:

```text
.obsidian/scripts/publish-note.js
```

Reason: QuickAdd does not scan hidden folders such as `.obsidian`.

## Important Rules

Do not publish directly from the whole Obsidian vault.

Do not expose private folder names such as:

```text
00-Inbox/
Private/
Work/
```

Do not commit generated Hugo output unless intentionally configured:

```text
public/
```

Do not publish private notes, secrets, work-sensitive details, or raw personal drafts.

## Obsidian Link Compatibility

Hugo does not understand Obsidian wikilinks by default.

Avoid this in public posts:

```md
[[Kafka]]
[[Kafka|message queue]]
```

Prefer standard Markdown links:

```md
[Kafka](/posts/kafka/)
```

## Local Development

Run Hugo locally:

```bash
hugo server -D
```

Build production output:

```bash
hugo --gc --minify
```

Sanity check:

```bash
test -f public/index.html
```

## Deployment

Deployment is handled by GitHub Actions.

The workflow should:

- Use Hugo Extended
- Checkout submodules recursively
- Build the site
- Check that `public/index.html` exists
- Upload `public/` to GitHub Pages

## Future Improvements

Potential next steps:

- Automatically generate English slugs
- Add category inference
- Add pre-publish cleanup
- Convert Obsidian wikilinks
- Add publish preview
- Add one-command publish and sync

## Philosophy

This is not just a blog.

It is a personal content pipeline:

```text
Thinking
  ↓
Writing
  ↓
Public projection
  ↓
Static site generation
  ↓
Publishing
```

## Author

Yan Qiang

Backend Engineer · Platform Engineering · Systems Thinking
