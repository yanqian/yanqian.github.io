# F015 Disable Periodic GitHub Push

## Evidence

- Plugin source states that `syncInterval: 0` disables periodic push.
- The vault configuration was changed from `20` to `0` and the plugin was reloaded to clear its existing timer.
- The previous configuration is backed up under `/tmp`.
- Publisher doctor now fails for any nonzero interval.
- AGENTS and the Runbook state that draft generation is not authorization to synchronize GitHub.

EVAL_PASS: F015
