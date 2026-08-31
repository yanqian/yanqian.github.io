# Coding Run: F028 Mobile present grid rows

Date: 2026-08-31

Mode: manual Coding Agent fallback from the project root. This run does not replace separate evaluator gating or `EVAL_PASS: F028`.

Summary:

- Corrected the remaining mobile Present-mode viewport defect in the standalone Hey Jarvis talk by aligning the Present grid rows with the content-first DOM order.
- Added a source-level regression assertion so the repaired row order is covered alongside the existing mobile Present controls contract.
- Kept `F028` incomplete because this session still has no fresh browser reevaluation evidence for the repaired mobile Present layout.

Repository state:

- Starting commit: `a957763`
- Ending commit: `a957763`
- Working tree remained dirty with the in-progress `F028` bundle and prior harness-state files.

Commands run:

```bash
python3 -m unittest tests/test_hey_jarvis_talk.py
git diff --check
./init.sh
```

Results:

- Targeted talk tests passed.
- `git diff --check` passed.
- `./init.sh` passed, including 67 Hugo site tests, 19 publisher tests, and the production Hugo build.
- Present mode now declares `grid-template-rows: minmax(0, 1fr) auto`, which preserves a flexible active-scene row and an intrinsic controls row at mobile sizes.

Capability gap assessment:

- Gap type: browser reevaluation capability in the current session.
- Durable capability change in this feature: none. The repository already has deterministic source/build coverage; the remaining missing evidence is a fresh desktop/mobile browser pass for the repaired layout.
- Follow-up required: rerun desktop and mobile browser verification for all six scenes, then obtain independent evaluator evidence.

Failure analysis:

- Failure domain: `capability_gap`
- Failure summary: coding verification passed, but the feature still cannot be accepted in this session because the repaired mobile Present layout has not yet been revalidated in a callable browser surface.
- Harness improvement: none. The harness already separates coding completion from browser/evaluator acceptance, and the missing piece is environment capability rather than a workflow defect.
- Follow-up feature: none. Continue `F028` until browser/evaluator gating completes.

Files changed in this run:

- `static/talks/hey-jarvis/talk.css`
- `tests/test_hey_jarvis_talk.py`
- `.agent-harness/progress.md`
- `.agent-harness/feature_list.json`

CODING_PASS: F028
