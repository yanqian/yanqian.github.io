# Obsidian Localization Publisher Runbook

This is the operational source of truth for bilingual article generation. Article prose remains in Obsidian; publisher code, tests, and operating rules are versioned in this repository.

## Supported Entry Point

From the repository root:

```sh
tools/obsidian-publisher/bin/publish-note doctor
tools/obsidian-publisher/bin/publish-note publish
tools/obsidian-publisher/bin/publish-note status
```

Do not use `open 'obsidian://quickadd?...'`. The URL may only focus Obsidian and provides no execution proof. The supported launcher resolves the QuickAdd choice name to its command ID, checks the active note and `publish: true`, executes the command, and requires a structured status transition within the configured timeout.

## Normal Flow

1. Read `progress.md`, `feature_list.json`, and recent Git history; run `./init.sh` for repository work.
2. Select the next source note by `series` and `seriesOrder`; never choose randomly within a series.
3. Open the Obsidian source note and confirm `publish: true`.
4. Run `publish-note doctor`. If parity fails, run `publish-note install`, fully disable/enable QuickAdd, then rerun doctor.
5. Run `publish-note publish` exactly once.
6. Follow progress with `publish-note status`. Status contains only operational metadata: run ID, slug, source hash, runtime version, stage, chunk, totals, timestamps, and sanitized error text.
7. Verify the draft in `vault/Publish/<slug>/index.zh.md`: natural language, factual review, Markdown contract, protected code, assets, and series links.
8. Stop for human approval. `Publish Note` is not authorization to synchronize or push.
9. After explicit approval, run the existing `Sync Published Site` workflow, inspect the remote commit scope, integrate it, run `./init.sh`, push, and watch GitHub Pages.

## Status and Recovery

```text
No status transition after launch
  -> command did not prove startup
  -> do not retry blindly
  -> run doctor, inspect the active note, QuickAdd state, and command ID

status=running and lock is fresh
  -> wait; a second run is forbidden

status=failed
  -> read the sanitized error
  -> fix the cause
  -> rerun; completed edit/review chunks resume from cache

lock older than staleLockMinutes
  -> confirm no active request
  -> run publish-note recover
  -> run publish again once
```

Every AI request has a five-minute logical timeout. A timeout is recorded as failure. Do not assume that reloading QuickAdd cancels an underlying HTTP request; confirm network or status state before recovery.

## Runtime Installation

Canonical file:

```text
tools/obsidian-publisher/publish-note.js
```

Installed artifact:

```text
<vault>/Scripts/publish-note.js
```

Install only through:

```sh
tools/obsidian-publisher/bin/publish-note install
```

The installer writes a SHA-256 manifest. `doctor` fails when the vault artifact differs from the canonical source. QuickAdd may cache user-script modules; after an install, disable and re-enable QuickAdd before the first smoke test.

## Invariants

- `text` fences are natural language and must be localized.
- `bash`, `sh`, `js`, `json`, and other non-text fences are byte-protected.
- Markdown heading hierarchy, images, links, footnotes, tables, embeds, and shortcodes must be preserved.
- `#` comments inside fenced code are not Markdown headings.
- Single-token technical headings such as `SSH`, `Tailscale`, and `tmux` are valid.
- Completed chunks must not be called again during resume.
- Logs and status files must never contain API keys, complete prompts, or complete article bodies.
- Generated `content/posts/Publish/` files are never hand-edited.

## Verification

```sh
node --test tools/obsidian-publisher/tests/*.test.js
./init.sh
```

For local parity, the final Node test compares the canonical runtime with the installed vault artifact. CI skips only that machine-specific comparison while running the remaining behavior tests.
