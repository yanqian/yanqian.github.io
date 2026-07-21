# F018 Localize About

## Workflow

- Manual implementation fallback requested by the user's page-by-page editorial review workflow.
- No article content under `content/posts/Publish/` is in scope.
- No commit, push, or deployment is authorized.

## Source Review

- English factual source: `content/about.md`.
- Existing Chinese About page: none.
- Existing convention: paired `.zh.md` files with an explicit shared `translationKey`.
- Shared terminal UI: `layouts/_partials/page.html` with language strings in `i18n/`.

## Verification Status

- Compared every Chinese paragraph against `content/about.md`: profession, location, engineering focus, writing topics, human-judgment theme, personal interests, and public contact remain present without new factual claims.
- Preserved the public email address and its exact `mailto:` target; About contains no other links, images, HTML, shortcodes, code blocks, or CSS classes.
- Targeted About/public-profile and multilingual tests passed: 16 tests.
- Local Hugo preview rendered `/about/` and `/zh/about/` with direct paired language switching in both directions.
- Desktop and 390×844 viewport checks passed; the mobile menu exposes `首页`, `关于我`, and `English`, and the page has no horizontal overflow.
- Final `./init.sh` passed: 47 Python tests, 13 publisher tests, and the production-style bilingual Hugo build.
- The user reviewed the Chinese copy, requested one wording change from `我在意的是` to `我关注的是`, approved the revised page, and explicitly authorized publication.
- Live deployment verification found and corrected the language-home menu being marked active on a localized child page; rendered coverage now requires exactly one current navigation item on `/zh/about/`.

## Evaluator Result

Human editorial approval, automated regression coverage, production build evidence, and desktop/mobile browser checks satisfy the F018 acceptance criteria under the repository's documented manual fallback.

EVAL_PASS: F018
