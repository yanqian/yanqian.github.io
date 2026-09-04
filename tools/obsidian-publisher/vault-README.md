# Localization Publisher Runtime

This directory contains installed runtime state, not the canonical implementation.

Canonical source and tests:

```text
/Users/armstrong/Project/yanqian.github.io/tools/obsidian-publisher/
```

Operational runbook:

```text
/Users/armstrong/Project/yanqian.github.io/docs/publishing/localization-runbook.md
```

Do not hand-edit the installed runtime, prompt files, or terminology file. Change their canonical repository copies, then install them together with:

```sh
tools/obsidian-publisher/bin/publish-note install
```

By default, `Publish Note` creates both English and Simplified Chinese pages. A source note can opt into a subset with frontmatter such as:

```yaml
publishLanguages:
  - zh
```
