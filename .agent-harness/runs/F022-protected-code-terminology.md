# F022 Protected-Code Terminology Validation

Manual fallback was used because the configured evaluator model remains unavailable in the installed Codex CLI. Verification was performed against the feature acceptance criteria and repository recovery entrypoint.

## Evidence

- The failed article run reported `Terminology gate failed: use 控制面, not 控制平面` solely because the protected JSON glossary example contained the rejected variant.
- `validateTerminology` now masks protected non-`text` code fences in both the source and candidate before scanning terminology.
- A regression test proves that the same rejected term is ignored in `json` but still rejected in a localizable `text` fence.
- The canonical publisher was installed into Obsidian and `publish-note doctor` reported `Publisher doctor: OK`.
- All 14 publisher tests pass, including installed runtime parity.
- `Publish Note` completed for `building-a-human-gated-bilingual-publishing-pipeline-with-obsidian-and-hugo`; the paired drafts contain matching translation keys, matching structure, and the protected JSON glossary example remains unchanged.

EVAL_PASS: F022
