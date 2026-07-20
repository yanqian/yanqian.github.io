# F016 Localization Terminology

Manual fallback was used because the configured evaluator model remains unavailable in the installed Codex CLI. Verification was performed against the feature acceptance criteria and repository recovery entrypoint.

## Evidence

- `tools/obsidian-publisher/terminology.json` maps `control plane` to `控制面` and rejects `控制平面`.
- Rewrite, editing, and consistency-review requests receive the same terminology instructions.
- Deterministic validation runs after all three generated stages.
- The installer and doctor enforce repository-vault terminology hash parity.
- The Part 2 draft and resumable cache contain no `控制平面` occurrence.
- The corrected article preserves 8 heading levels, 18 fenced blocks, and 2 image destinations.
- `./init.sh` passes 46 Python tests, 13 Node tests, and the production Hugo build.

EVAL_PASS: F016
