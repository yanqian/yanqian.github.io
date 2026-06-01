# Requirement: Refine article code block styling

## Problem

Article code blocks used a heavy dark treatment that competed with the surrounding article text. Later iterations also showed that explicit `text` labels and separate language header backgrounds were too visually prominent for plain preformatted text.

## In Scope

- Use class-based Hugo/Chroma highlighting so syntax colors can be owned by local CSS.
- Load GitHub-style syntax colors for light and dark color schemes.
- Style article code blocks as lighter panels that fit the current article design.
- Tune code font, size, and line height for readability.
- Hide the `text` language label and remove the extra top spacing it required.
- Keep real language labels, such as `bash`, visible without giving them a separate header background.
- Match the code block body background to the inline code background.

## Out Of Scope

- Editing article source text or generated article content.
- Changing fenced code languages in Obsidian notes.
- Replacing Hugo, Chroma, or the existing theme.
- Adding JavaScript for code block rendering.

## Affected Files

- `hugo.toml`
- `assets/css/syntax.css`
- `assets/css/custom.css`
- `tests/test_article_code_blocks_css.py`
- `feature_list.json`
- `progress.md`
- `test_plan.md`

## Acceptance Criteria

- Hugo uses `noClasses = false` for syntax highlighting.
- `css/syntax.css` loads before `css/custom.css`.
- Code block backgrounds match the inline code background variable.
- Chroma's generated `.chroma` background does not override the code block panel background.
- `text` code blocks do not display a visible language label.
- Non-text language labels remain visible without a separate language-bar background or divider.
- A production-style Hugo build succeeds.

## Test Plan

- Run `./init.sh`.
- Run `hugo --gc --minify --baseURL "https://yanqian.github.io/"`.
- Confirm CSS regression tests cover code block configuration and presentation rules.

## Manual Verification

1. Run `hugo server`.
2. Open a post with both `text` and `bash` fenced code blocks.
3. Confirm `text` blocks show only the code panel.
4. Confirm `bash` blocks show the language label on the same background as the code body.
5. Confirm code block typography is readable and does not overpower article text.

## Quality Risks

- Chroma-generated background selectors can override local panel styles unless custom CSS uses sufficient specificity.
- Hugo's asset fingerprinting can leave older generated CSS files in `public/`; verify the page references the current fingerprinted stylesheet when debugging local output.
