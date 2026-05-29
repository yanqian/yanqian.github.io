# yanqian.github.io Development SPEC

## 1. Goal

Maintain the public Hugo site for `yanqian.github.io` with a repeatable engineering workflow.

The repository must support scoped site development: discuss the requirement, record the expected behavior, implement against the existing Hugo/theme structure, verify with automated tests and a production-style Hugo build, then deploy through GitHub Pages.

This repository is not the primary writing workspace. Article source content lives in the Obsidian vault and is projected into `content/posts/Publish/`.

## 2. Scope

### 2.1 Included

The development workflow covers:

- Hugo configuration in `hugo.toml`.
- Local template overrides in `layouts/`.
- Local CSS in `assets/css/custom.css`.
- Local JavaScript in `assets/js/`.
- Top-level public pages in `content/about.md`, `content/now.md`, `content/projects.md`, and `content/resume.md`.
- Workflow state files in `feature_list.json` and `progress.md`.
- Workflow entrypoints in `init.sh` and `orchestrator.py`.
- Documentation under `docs/`.
- Tests under `tests/`.
- GitHub Actions deployment behavior under `.github/`.
- Production-style Hugo builds for verification.

### 2.2 Excluded

The workflow must not use this repository for:

- Drafting or maintaining article source notes.
- Hand-editing generated article content under `content/posts/Publish/`.
- Publishing non-`Publish` vault paths under `content/posts/`.
- Replacing the Hugo stack with a new frontend framework.
- Adding runtime services for the static site unless a requirement explicitly needs them.

## 3. Source Of Truth

Article content follows this path:

```text
Obsidian source notes
  -> vault Publish/ projection
  -> content/posts/Publish/
  -> Hugo build
  -> GitHub Pages
```

Site behavior and presentation are owned by this repository:

- `hugo.toml`
- `layouts/`
- `assets/css/custom.css`
- `assets/js/`
- `feature_list.json`
- `progress.md`
- `init.sh`
- `orchestrator.py`
- `.github/workflows/hugo.yml`
- `docs/`
- `tests/`

## 4. Development Workflow

Every non-trivial site change should follow this sequence:

1. Clarify the requirement and affected user-visible behavior.
2. Identify whether the change belongs in the Obsidian source vault or this Hugo repository.
3. If it belongs here, update the relevant spec, workflow state, documentation, template, style, script, or test.
4. Add or update automated tests for the regression risk.
5. Run the repository verification entry point.
6. Inspect visual output manually when the change affects layout, navigation, typography, or article rendering.
7. Commit and push only after the build and tests pass.

Workflow-driven feature rounds, when used, follow:

```text
progress.md
feature_list.json
git log --oneline -20
./init.sh
orchestrator.py -> coding agent -> evaluator agent
```

## 5. Requirement Notes

For larger changes, create a document under `docs/requirements/` with:

- Problem statement.
- In-scope behavior.
- Out-of-scope behavior.
- Affected files or templates.
- Test plan.
- Manual verification checklist.
- Quality risks and acceptance criteria.

Small changes may be captured directly in the pull request or commit message when the behavior is obvious and tests cover the risk.

## 6. Quality Bar

A change is ready when:

- It preserves the Obsidian-to-Hugo publishing boundary.
- It keeps generated article content untouched unless the user explicitly requests a generated-content repair.
- It passes `./init.sh`.
- It passes a production-style Hugo build with the GitHub Pages base URL.
- It keeps the homepage, post pages, taxonomy pages, and series navigation coherent.
- It avoids introducing layout shifts, text overlap, unreadable typography, or mobile-only regressions.
- It does not add unnecessary frameworks or build steps.

## 7. Verification Entry Point

All automated local verification must run through:

```sh
./init.sh
```

The script must exit non-zero on failure.
