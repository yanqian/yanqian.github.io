# Armstrong Yan

Public Hugo site for [yanqian.github.io](https://yanqian.github.io/), the personal site and blog of Armstrong Yan.

The site is built with [Hugo](https://gohugo.io/) and the `hugo-coder` theme, then deployed to GitHub Pages from this repository.

## Repository Role

This repository is the publishing and site-implementation workspace. Use it for Hugo configuration, templates, styling, top-level pages, and deployment fixes.

Long-form article writing lives in the Obsidian vault, and public posts are projected into this repo under:

```text
content/posts/Publish/
```

Avoid hand-editing generated post content in this repository. Update the source note in Obsidian, run `Publish Note`, then run `Sync Published Site`.

## Local Development

Start the local preview server:

```sh
hugo server
```

Then open:

```text
http://localhost:1313/
```

For the repeatable development workflow, see:

- `SPEC.md`
- `test_plan.md`
- `docs/development-workflow.md`

Run the full local verification entry point before pushing site, template, style, or deployment changes:

```sh
./init.sh
```

## Build

Generate the static site:

```sh
hugo --gc --minify --baseURL "https://yanqian.github.io/"
```

The generated output is written to `public/`.

## Content

- Main pages live in `content/`.
- Published blog posts live in `content/posts/Publish/`.
- Site configuration lives in `hugo.toml`.
- Custom styling lives in `assets/css/custom.css`.
- Templates live in `layouts/`.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/hugo.yml`, which builds the Hugo site and deploys it to GitHub Pages.
