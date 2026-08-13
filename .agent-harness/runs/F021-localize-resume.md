# F021 Localize Resume

## Workflow

- Interactive manual implementation requested by the user's page-by-page editorial review workflow.
- No article content under `content/posts/Publish/` is in scope.
- No commit, push, or deployment is authorized before user approval.

## Source Review

- English factual source: `content/resume.md`.
- Existing Chinese Resume page: none.
- Existing convention: paired `.zh.md` files with an explicit shared `translationKey`.
- The public source contains no employer names, position chronology, employment dates, private address, or phone number; those details remain absent.
- The only experience duration is `10+ years`; public contact links are the existing email and LinkedIn profile.

## Verification Status

- Compared every section against `content/resume.md`: the 10+ years statement, professional themes, eight focus areas, six technology groups, five experience bullets, writing topics, and public contacts remain present without invented employers, titles, dates, achievements, or private details.
- Preserved the public email and LinkedIn URLs exactly; the LinkedIn path resolves in a browser to LinkedIn's public-profile/sign-in surface.
- Targeted public-profile and multilingual tests passed: 20 tests.
- Local Hugo preview rendered `/resume/` and `/zh/resume/` with direct paired language switching in both directions.
- Desktop and 390×844 viewport checks passed; the mobile menu exposes all five localized top-level pages plus `English`, exactly one navigation item is current, and the page has no horizontal overflow.
- Final `./init.sh` passed: 52 Python tests, 13 publisher tests, and the production-style bilingual Hugo build.
- The user reviewed the completed page and explicitly authorized publication without requesting factual or editorial changes.

## Evaluator Result

Human editorial approval, automated regression coverage, production build evidence, public-link inspection, and desktop/mobile browser checks satisfy the F021 acceptance criteria under the repository's documented manual fallback.

EVAL_PASS: F021
