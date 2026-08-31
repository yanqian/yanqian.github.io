# Coding Run: F028 Mobile present controls

Date: 2026-08-31

Mode: manual Coding Agent fallback from the project root. This run does not replace separate evaluator gating or `EVAL_PASS: F028`.

Summary:

- Corrected the mobile Present-mode control-bar regression in the standalone Hey Jarvis talk.
- Strengthened the talk source contract so the compact Present-mode action layout is covered by tests.
- Kept `F028` incomplete because this session could not perform the required final browser reevaluation.

Repository state:

- Starting commit: `a957763`
- Ending commit: `a957763`
- Working tree remained dirty with the in-progress `F028` bundle and prior harness-state files.

Commands run:

```bash
node -p "require.resolve('playwright')"
python3 -m unittest tests/test_hey_jarvis_talk.py
git diff --check
./init.sh
```

Results:

- `node -p "require.resolve('playwright')"` failed with `MODULE_NOT_FOUND`, confirming no callable local Playwright driver is installed for browser automation in this session.
- Targeted talk tests passed.
- `git diff --check` passed.
- `./init.sh` passed, including 67 Hugo site tests, 19 publisher tests, and the production Hugo build.
- The mobile `<=640px` styles now reserve the full-width button treatment for the Reading-mode entry button and switch Present-mode actions to a compact three-column control row.

Capability gap assessment:

- Gap type: browser verification capability in the current session.
- Durable capability change in this feature: none. The repository already has deterministic source/build coverage; the missing piece is a callable browser driver or browser-control surface for the final evaluator check.
- Follow-up required: rerun desktop and mobile browser verification for all six scenes, then obtain independent evaluator evidence.

Failure analysis:

- Failure domain: `capability_gap`
- Failure summary: automated verification passed, but the feature still cannot be accepted in this session because the required final browser reevaluation could not be run without an installed browser driver or browser-control tool.
- Harness improvement: none. The harness already separates coding evidence from evaluator/browser acceptance, and this gap is environment-specific rather than a repository contract weakness.
- Follow-up feature: none. Continue `F028` until the browser/evaluator gate completes.

Files changed in this run:

- `static/talks/hey-jarvis/talk.css`
- `tests/test_hey_jarvis_talk.py`
- `.agent-harness/progress.md`
- `.agent-harness/feature_list.json`

CODING_PASS: F028
