# Coding Run: F028 Present nested overflow containment

Date: 2026-08-31

## Context

- Feature: `F028`
- Mode: manual Coding Agent fallback from the project root. This run does not replace separate evaluator gating or `EVAL_PASS: F028`.
- Starting state: browser reevaluation had already confirmed that the Present root was bounded, but dense scenes 4-6 still expanded below a 390×844 viewport because the nested content/list/item/scene chain preserved minimum-content expansion instead of letting the active scene shell scroll internally.

## Changes

- Updated `static/talks/hey-jarvis/talk.css` so the Present-mode content chain clamps overflow at each nested level and the active scene shell owns the scrollable viewport.
- Updated `tests/test_hey_jarvis_talk.py` to lock the nested Present containment selectors into the static CSS contract.
- Updated `.agent-harness/progress.md` and the `F028` entry in `.agent-harness/feature_list.json` to record this manual fallback round and the remaining browser/evaluator gate.

## Verification

- `python3 -m unittest tests.test_hey_jarvis_talk`
- `git diff --check`
- `./init.sh`

## Outcome

- Automated verification passed after the nested overflow containment fix.
- `F028` remains `in_progress` because acceptance criterion 4 still requires fresh desktop/mobile browser reevaluation and separate evaluator evidence. This coding run did not produce `EVAL_PASS: F028`.

## Files Changed

- `static/talks/hey-jarvis/talk.css`
- `tests/test_hey_jarvis_talk.py`
- `.agent-harness/progress.md`
- `.agent-harness/feature_list.json`
- `.agent-harness/runs/20260831-F028-present-nested-overflow.md`

## Capability Gaps

- Gap type: browser reevaluation capability in the current session.
- Durable capability change in this feature: none. This run corrected the product CSS containment issue and preserved deterministic source/build coverage, but it did not itself provide fresh desktop/mobile browser evidence.
- Follow-up required: rerun desktop and mobile browser verification for all six scenes, then obtain independent evaluator evidence.

## Failure Analysis

- Failure domain: `capability_gap`
- Failure summary: coding verification passed after the nested Present overflow fix, but `F028` still cannot be accepted until fresh browser reevaluation confirms dense scenes 4-6 scroll internally with no clipping or horizontal overflow.
- Harness improvement: none. The harness already keeps coding completion separate from browser/evaluator acceptance, and the remaining blocker is missing browser-verification evidence in this session.
- Follow-up feature: none. Continue `F028` until browser/evaluator gating completes.

## Example-Boundary Assessment

- `examples/` was not changed.

CODING_PASS: F028
