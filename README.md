# Armstrong Yan

Personal site and blog built with [Hugo](https://gohugo.io/) and the `hugo-coder` theme.

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
- Blog posts live in `content/posts/`.
- Site configuration lives in `hugo.toml`.
- Custom styling lives in `assets/css/custom.css`.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/hugo.yml`, which builds the Hugo site and deploys it to GitHub Pages.
