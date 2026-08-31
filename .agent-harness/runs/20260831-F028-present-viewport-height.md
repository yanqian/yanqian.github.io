# Coding Run: F028 Present viewport height

Date: 2026-08-31

## Context

- Feature: `F028`
- Mode: manual Coding Agent fallback from the project root. This run does not replace separate evaluator gating or `EVAL_PASS: F028`.
- Starting state: the standalone Hey Jarvis talk already existed, but prior browser evaluation showed that mobile Present scenes 4-6 extended below a 390×844 viewport because the Present root used only `min-height: 100vh`.

## Changes

- Updated `static/talks/hey-jarvis/talk.css` so `.hj-talk--presenting .hj-talk` uses a definite `height: 100vh` plus `min-height: 0`.
- Updated `tests/test_hey_jarvis_talk.py` to lock the Present viewport-height contract in the static CSS assertions.
- Updated `.agent-harness/progress.md` and the `F028` entry in `.agent-harness/feature_list.json` to record the fix and the remaining evaluator/browser gate.

## Verification

- `python3 -m unittest tests.test_hey_jarvis_talk`
- `git diff --check`
- `./init.sh`

## Outcome

- Automated verification passed after the viewport-height fix.
- `F028` remains `in_progress` because acceptance criterion 4 still requires fresh desktop/mobile browser reevaluation and a separate evaluator pass. This coding run did not produce `EVAL_PASS: F028`.

## Files Changed

- `static/talks/hey-jarvis/talk.css`
- `tests/test_hey_jarvis_talk.py`
- `.agent-harness/progress.md`
- `.agent-harness/feature_list.json`
- `.agent-harness/runs/20260831-F028-present-viewport-height.md`

## Capability Gaps

- Gap type: browser reevaluation capability in the current session.
- Durable capability change in this feature: none. This run fixed the product CSS defect and preserved deterministic source/build coverage, but it did not itself provide fresh desktop/mobile browser evidence.
- Follow-up required: rerun desktop and mobile browser verification for all six scenes, then obtain independent evaluator evidence.

## Failure Analysis

- Failure domain: `capability_gap`
- Failure summary: coding verification passed after the Present viewport-height fix, but `F028` still cannot be accepted until fresh desktop/mobile browser reevaluation confirms dense scenes 4-6 scroll internally with no clipping or horizontal overflow.
- Harness improvement: none. The harness already keeps coding completion separate from browser/evaluator acceptance, and the remaining blocker is missing browser-verification evidence in this session.
- Follow-up feature: none. Continue `F028` until browser/evaluator gating completes.

## Example-Boundary Assessment

- `examples/` was not changed.

CODING_PASS: F028
