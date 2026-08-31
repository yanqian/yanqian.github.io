# Coding Run: F028 Present-mode layout fix

Date: 2026-08-31

Mode: manual Coding Agent fallback from the project root. This run does not replace separate evaluator gating or `EVAL_PASS: F028`.

Summary:

- Corrected the known desktop Present-mode layout defect in the standalone Hey Jarvis talk.
- Strengthened the static talk contract so the masthead-hiding and viewport-layout behavior is covered by source tests.
- Kept `F028` incomplete because post-fix browser reevaluation could not be completed reliably in this sandbox.

Repository state:

- Starting commit: `a957763`
- Ending commit: `a957763`
- Working tree remained dirty with the in-progress `F028` bundle and harness-state files.

Commands run:

```bash
python3 -m unittest tests/test_hey_jarvis_talk.py
git diff --check
hugo --destination /private/tmp/hjtalk-public --baseURL http://127.0.0.1:4173/
python3 -m http.server 4173 --bind 127.0.0.1 --directory /private/tmp/hjtalk-public
node - <<'NODE'
const { chromium } = require('/Users/armstrong/Library/Python/3.9/lib/python/site-packages/playwright/driver/package');
// Attempted file-based viewport verification with the bundled Chromium runtime.
NODE
./init.sh
```

Results:

- Targeted talk tests passed.
- `git diff --check` passed.
- `./init.sh` passed, including 67 Hugo site tests, 19 publisher tests, and the production Hugo build.
- The updated Present mode now hides the Reading masthead, restores reading scroll position on exit, and constrains the active scene to a dedicated viewport layout with internal overflow protection.

External behavior verification:

- Temporary localhost preview was attempted after building to `/private/tmp/hjtalk-public`, but `python3 -m http.server` failed with `PermissionError: [Errno 1] Operation not permitted` while binding `127.0.0.1:4173`.
- File-based headless verification was then attempted with the Playwright driver bundled inside `/Users/armstrong/Library/Python/3.9/lib/python/site-packages/playwright/driver/package`.
- Bundled Chromium existed under `/Users/armstrong/Library/Caches/ms-playwright/chromium-1234/`, but the headless browser process aborted before viewport inspection, so no reliable post-fix geometry evidence was produced.

Capability gap assessment:

- Gap type: environment-level browser verification in the current sandbox.
- Durable capability change in this feature: none. The repository already has deterministic source and build coverage; the missing evidence is a local runtime constraint, not an undocumented project setup step.
- Follow-up required: rerun evaluator or user-led browser verification for desktop and mobile Present mode.

Failure analysis:

- Failure domain: `environment_gap`
- Failure summary: post-fix browser reevaluation could not complete because the sandbox denied localhost binding and the bundled headless Chromium runtime aborted before rendering evidence was collected.
- Harness improvement: none. The failure is specific to this local execution environment; the existing harness already records external verification separately from feature completion.
- Follow-up feature: none. Continue `F028` with a separate evaluator or manual browser pass.

Files changed in this run:

- `static/talks/hey-jarvis/talk.css`
- `static/talks/hey-jarvis/talk.js`
- `tests/test_hey_jarvis_talk.py`
- `.agent-harness/progress.md`
- `.agent-harness/feature_list.json`

CODING_PASS: F028
