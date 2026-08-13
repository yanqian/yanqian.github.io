# F020 Localize Projects

## Workflow

- Interactive manual implementation requested by the user's page-by-page editorial review workflow.
- No article content under `content/posts/Publish/` is in scope.
- No commit, push, or deployment is authorized before user approval.

## Source Review

- English factual source: `content/projects.md`.
- Existing Chinese Projects page: none.
- Existing convention: paired `.zh.md` files with an explicit shared `translationKey`.
- Source contains four selected projects, seven external links, three literal Bot commands, and a final areas list.

## Verification Status

- Compared every project and the final areas list against `content/projects.md`: names, order, groupings, statuses, technologies, capabilities, safety boundaries, and Bot commands remain present without new maturity or impact claims.
- Preserved all seven external URLs exactly; live HTTP checks returned 200 for every target.
- Targeted Projects and multilingual tests passed: 16 tests.
- Local Hugo preview rendered `/projects/` and `/zh/projects/` with direct paired language switching in both directions.
- Desktop and 390×844 viewport checks passed; all four project headings and seven external links render, the mobile menu exposes `首页`, `项目`, `关于我`, `近况`, and `English`, exactly one navigation item is current, and the page has no horizontal overflow.
- Final `./init.sh` passed: 50 Python tests, 13 publisher tests, and the production-style bilingual Hugo build.
- The user reviewed the completed page and explicitly authorized publication without requesting factual or editorial changes.

## Evaluator Result

Human editorial approval, automated regression coverage, production build evidence, external-link checks, and desktop/mobile browser checks satisfy the F020 acceptance criteria under the repository's documented manual fallback.

EVAL_PASS: F020
