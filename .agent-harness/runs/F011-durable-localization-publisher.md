# F011 Durable Localization Publisher

Manual Coding Agent fallback was used because the repository's configured Codex evaluator provider cannot run `gpt-5.6-sol`.

## Evidence

- `node --check tools/obsidian-publisher/publish-note.js`
- `sh -n` passes for the installer and launcher.
- Pure checks prove live/stale lock classification and explicit timeout rejection.
- The installer wrote `publisher-v1` into the vault and `doctor` verified SHA-256 parity.
- A real CLI smoke test executed the QuickAdd choice by resolved command ID.
- `status/current.json` reached `status: complete`, `stage: done`, and recorded `runtimeVersion` plus `sourceHash`.
- The per-article lock was released after completion.
- The Hugo repository remained unsynchronized, preserving the human approval boundary.

EVAL_PASS: F011
