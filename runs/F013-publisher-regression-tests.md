# F013 Publisher Regression Tests

Manual Coding Agent fallback was used because the configured evaluator provider remains unavailable.

## Evidence

- Nine Node tests pass under `tools/obsidian-publisher/tests/`.
- The long fixture forces multiple level-two-boundary chunks.
- Resume tests prove completed chunks do not call the worker again.
- Live/stale lock and timeout behavior are exercised with deterministic clocks.
- Launcher source assertions reject `obsidian://quickadd` and require command-ID execution plus startup status proof.
- The local vault artifact SHA-256 matches the canonical runtime after installation.
- `./init.sh` includes the publisher suite alongside existing Python and Hugo verification.

EVAL_PASS: F013
