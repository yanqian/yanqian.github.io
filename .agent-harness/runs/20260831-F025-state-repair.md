# 2026-08-31 F025 State Repair

## Context

- A manual Coding Agent prompt selected `F025` even though commit `a957763` had already implemented the feature and `.agent-harness/runs/F025-hey-jarvis-projects.md` already recorded `EVAL_PASS: F025`.
- The only live drift was the canonical `.agent-harness/feature_list.json` entry, which had `passes: false`, `status: "in_progress"`, and `attempts: 2`.

## Actions

- Re-read the harness state, recent git history, and the existing `F025` run artifact.
- Verified the English and Chinese Projects pages still contain the shipped Hey Jarvis content and no longer contain Home Guard TG.
- Repaired only the selected feature state in `.agent-harness/feature_list.json` by restoring `passes: true` and `status: "done"` while preserving `attempts: 2`.
- Added a `progress.md` note explaining the state-repair-only manual fallback.

## Verification

- `./init.sh`
- `git diff -- .agent-harness/feature_list.json`
- `rg -n '"id": "F025"|Hey Jarvis|Home Guard TG' .agent-harness/feature_list.json .agent-harness/progress.md content/projects.md content/projects.zh.md`

## Result

- No product-source changes were required for `F025`.
- Canonical harness state now matches the already-implemented and already-evaluated feature.

CODING_PASS: F025
