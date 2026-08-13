# F025 Hey Jarvis Projects Entry

## Implementation Mode

Manual fallback. The configured independent evaluator model remains unavailable in the installed Codex CLI; do not mark the feature complete without compatible evaluator evidence and user approval.

## Scope

- Replaced Home Guard TG with Hey Jarvis as the first selected entry on the English and Chinese Projects pages.
- Added the public GitHub repository and `v0.1.0-internal` release to both languages, with only the English demo on English and only the Chinese demo on Chinese; omitted the introductory article link.
- Described local wake-word privacy, continuous bilingual conversation, tool routing, native macOS safeguards, compatibility, BYOK requirements, and unsigned/unnotarized release limits.
- Updated the page summaries and areas lists to cover voice interaction instead of trusted-host home automation.
- Replaced the former Home Guard content tests with bilingual Hey Jarvis presence, link, boundary, and removal regressions.

## Evidence

- Public article, GitHub repository, release, and both demo pages were inspected on 2026-08-13.
- Focused Projects-page tests: 5 pass.
- `./init.sh`: 59 Python tests and 19 publisher tests pass; the production Hugo build succeeds for 277 English and 276 Chinese pages.
- `python3 orchestrator.py --dry-run`: startup protocol and dry-run pass; the orchestrator correctly leaves F025 untouched because the earlier F024 remains the first unfinished feature.
- Rendered `/projects/` and `/zh/projects/` output contains Hey Jarvis, GitHub, the matching-language demo, and the internal release boundary; neither page contains Home Guard TG, the article link, or the other language's demo.
- `git diff --check`: pass.
