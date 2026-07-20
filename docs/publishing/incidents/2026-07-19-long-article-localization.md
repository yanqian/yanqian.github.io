# Incident: Long Article Localization Took 47 Minutes

Date: 2026-07-19

## Impact

Generating the Chinese draft for `Remote Agent Workflow, Part 1` took approximately 47 minutes. Most elapsed time was diagnosis and repeated waiting, not useful model work.

## What Happened

1. Understanding and rewrite completed and were cached.
2. No later cache transition was visible, so the operator inferred that the editor was still running and waited about fifteen minutes without proving an active request.
3. After QuickAdd reloads, `obsidian://quickadd` only focused Obsidian; it did not reliably execute the choice. Missing progress was again misread as a slow API call.
4. Direct command-ID execution exposed the real validation failure: fenced `bash` comments such as `# On the Mac` were parsed as article headings.
5. The Chinese quality gate also rejected valid single-token technical headings including `SSH`, `Tailscale`, and `tmux`.
6. QuickAdd continued using a cached user-script module after a normal plugin reload. A full disable/enable was required.

## Root Causes

- No supported launcher or startup proof.
- No durable stage/chunk status or live-run lock.
- Stage cache was written only after the whole stage, hiding partial progress.
- No explicit AI timeout.
- Heading parsing was not fence-aware.
- The language gate did not distinguish technical proper names from untranslated prose.
- Publisher code lived only in the vault, outside Git history and CI.

## Contributing Operator Errors

- Waiting without first checking status or network activity.
- Reusing an unproven URL trigger after plugin reload.
- Enabling console capture too late.
- Attributing missing progress to document length before proving command execution.

## Corrective Actions

| Failure | Durable control |
| --- | --- |
| URL may not execute | Command-ID launcher with a required status transition |
| Duplicate retry | Per-article live lock and explicit stale recovery |
| Invisible long stage | Per-chunk status and resumable chunk cache |
| Endless wait | Five-minute logical AI timeout |
| Code comments treated as headings | Fence-aware heading extraction and regression fixture |
| Technical names rejected | Single-token technical heading rule and test |
| Vault/runtime drift | Canonical repository source, installer, manifest, and hash parity |
| Future agent repeats incident | AGENTS mandatory rules plus this Runbook |

## Additional Observation

While integrating the publisher changes on 2026-07-20, a new remote Obsidian publishing commit appeared before the local tool commit was pushed. The exact external trigger was not established. Therefore remote Git state must always be fetched and inspected before integrating or pushing; a local draft-generation smoke test must never be treated as proof that GitHub remained unchanged.

## Verification Evidence

- `runs/F011-durable-localization-publisher.md`
- `runs/F013-publisher-regression-tests.md`
- `tools/obsidian-publisher/tests/publisher.test.js`
