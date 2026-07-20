# F017 Versioned Localization Prompts

Manual fallback was used because the configured evaluator model remains unavailable in the installed Codex CLI. Verification was performed against the feature acceptance criteria and repository recovery entrypoint.

## Evidence

- The six active vault prompts were migrated byte-for-byte into `tools/obsidian-publisher/prompts/`.
- Pre-install SHA-256 comparison confirmed every repository prompt matched its active vault counterpart.
- The installer copies all prompts and records per-file hashes under `promptHashes` in `publisher-install.json`.
- Publisher doctor compares every installed prompt with its canonical repository source.
- Local parity tests compare the runtime, terminology, six prompts, and manifest prompt hashes.
- AGENTS, the Runbook, and the installed vault README identify the repository artifacts as canonical.
- `progress.md` now records Part 2 as published at `d8317df` and no longer awaits approval.
- `./init.sh` passes 46 Python tests, 13 Node tests, and the production Hugo build.

EVAL_PASS: F017
