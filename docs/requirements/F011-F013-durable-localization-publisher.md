# Durable Localization Publisher

## Problem

The Obsidian localization workflow was operated through an unreliable URL trigger, exposed no durable per-stage progress, allowed repeated execution, and kept its canonical code outside version control. A long article on 2026-07-19 took 47 minutes to diagnose because agents could not distinguish a running API request from a command that never started, and code-fence comments were misclassified as headings.

## Included

- Version the canonical publisher, launcher, installer, configuration, fixtures, and tests in this repository.
- Keep Obsidian as the article source of truth and install only the runtime artifact into the vault.
- Add structured status, a single-run lock, stage/chunk checkpoints, explicit timeouts, and safe recovery.
- Execute QuickAdd by resolved command ID and prove startup through a status transition.
- Add a runbook, incident report, and concise mandatory rules in `AGENTS.md`.
- Add regression coverage for long Markdown, fenced code, technical headings, locking, idempotency, and installation parity.

## Excluded

- Article drafting in this repository.
- Automatic GitHub synchronization without human review.
- Logging API keys, full prompts, or full article bodies in status/error files.

## Constraints

- Generated Hugo article content remains untouched by the tooling implementation.
- The vault runtime must be reproducibly installed from the repository copy.
- Normal operation must not depend on a hard-coded QuickAdd UUID.
- Recovery must reject a second live run and require explicit stale-lock handling.

## Verification

- Node built-in tests exercise pure publisher helpers and shell launcher behavior.
- An installer parity check compares repository and vault artifact hashes.
- `./init.sh` runs publisher tests plus the existing Hugo checks.
- A manual vault smoke test proves command execution, status transitions, cache resume, and draft-only output.
