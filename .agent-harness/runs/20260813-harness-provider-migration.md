# Run Record: harness provider migration

## Summary

- Date: 2026-08-13
- Agent role: Interactive migration
- Feature: No-feature harness repair
- Result: pass

## Repository State

- Starting commit: `1cfe9f0`
- Working tree status: pre-existing F025 Projects changes preserved; hidden-layout harness files added.

## Commands Run

```bash
python3 ~/.codex/skills/ai-agent-harness/scripts/init_harness.py --root . --mode check
python3 ~/.codex/skills/ai-agent-harness/scripts/init_harness.py --root . --mode adopt --layout hidden --force
env HARNESS_AGENT_PROVIDER_CHECK=1 .agent-harness/scripts/run-coding-agent.sh
env HARNESS_AGENT_PROVIDER_CHECK=1 .agent-harness/scripts/run-evaluator-agent.sh
.agent-harness/scripts/init.sh
./init.sh
```

## Evidence

- Provider: `/opt/homebrew/bin/codex` `0.146.1` documents stdin `-`, `--cd`, and `--ephemeral`.
- Runtime: `gpt-5.4` returned `PROVIDER_CHECK_OK` from a real stdin preflight.
- Coding adapter preflight: pass.
- Evaluator adapter preflight: pass.
- Migrated state: 25 features validate against the `0.3.8` schema.
- Hidden-layout provider path contract: role prompts direct project-root provider children to canonical `.agent-harness/` state, docs, quality rules, and run evidence.
- External behavior verification: real Codex provider execution, not a mock.

## Failure Analysis

- Failure domain: `agent_workflow_gap`
- Failure summary: the legacy root orchestrator hard-coded `codex exec` and an unavailable evaluator model inherited from user configuration; it lacked current provider adapters and evidence gates.
- Harness improvement: installed hidden-layout `0.3.8`, explicit provider configuration, provider runtime checks, current orchestrator adapters, and evaluator-evidence validation.

## Files Changed

- `.agent-harness/`
- `AGENTS.md`
- `init.sh`
- `.gitignore`

## Evaluator Result

```text
No feature evaluator verdict; this is explicit harness repair work.
```

## Follow-Up

- Use `.agent-harness/` as the canonical workflow state.
- Run existing F024 and F025 through a cold-start evaluator before marking either done.
