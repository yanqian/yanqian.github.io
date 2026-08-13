# F023 Stable Dates And Obsidian Publishing Series

Manual fallback was used because the configured evaluator model remains unavailable in the installed Codex CLI. Verification was performed against the feature acceptance criteria and repository recovery entrypoint.

## Evidence

- `resolvePublishDate` checks the existing English projection first, then the paired Chinese projection, and uses the supplied current-time fallback only when neither has a valid date.
- A publisher regression test covers English-date preservation, Chinese fallback, and genuinely new publication fallback.
- The canonical runtime was installed into Obsidian; `publish-note doctor` reported `Publisher doctor: OK`, and installed runtime parity passed.
- Both source notes use `series: Obsidian Publishing Pipeline`, with `seriesOrder: 1` for the private-to-public article and `seriesOrder: 2` for the human-gated bilingual article.
- Regeneration preserved `2026-07-21T09:11:29+08:00` for Part 1 and `2026-07-22T00:18:29+08:00` for Part 2 in both languages.
- Both bilingual Markdown contracts passed, including protected code, links, images, headings, and tables.
- An isolated Hugo build rendered English and Chinese series pages in 1→2 order, with `Part 1 of 2`, `Part 2 of 2`, `第 1 篇，共 2 篇`, `第 2 篇，共 2 篇`, and correct previous/next links.
- The reviewed Chinese wording `此外，所有模型阶段还会收到同一份术语约定` is present in the final projection and rendered preview.
- `./init.sh` passes 52 Python tests, 15 publisher tests, and the production Hugo build.
- After explicit user approval, `Sync Published Site` produced commit `70dc630` with exactly four modified files: the English and Chinese projections for Parts 1 and 2.
- The sync diff added only `series` and `seriesOrder`; it changed no article body, date, asset, or unrelated article.
- GitHub Pages deployed `e50ad88` successfully in Actions run `29907899762`, and all four public series/post URLs returned HTTP 200 with correct bilingual order and navigation.

EVAL_PASS: F023
