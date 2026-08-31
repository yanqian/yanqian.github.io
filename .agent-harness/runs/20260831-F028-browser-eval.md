# F028 Browser Evaluation

Date: 2026-08-31

## Surface

- Local URL: `http://127.0.0.1:1313/talks/hey-jarvis/`
- Desktop viewport: 1440×900
- Browser: Codex in-app browser

## Reading mode

- Document width and scroll width both equal 1440px.
- Each scene is 1120px wide from x=160 to x=1280.
- Scene `scrollWidth` equals `clientWidth`; no horizontal clipping was found.
- The masthead title, artwork, reading control, and first-scene transition are visually balanced.

## Present mode failure

- Present state activates and reports `Scene 1 of 6`.
- The full masthead remains visible above the active scene.
- Scene 1 bounding box starts around y=695.7 and ends around y=1291.7 in a 900px-high viewport.
- The page hides overflow during Present mode, so the active scene is materially clipped rather than merely below a normal scroll position.

## Required correction

- Present mode must prioritize the presentation controls and one active scene; the reading masthead must not consume most of the viewport.
- Recheck all six scenes for clipping and overflow at desktop and mobile sizes after correction.
- Recheck keyboard navigation and Escape return to Reading mode.

## Failure Analysis

- Failure domain: implementation_gap
- Failure summary: Present mode retains the Reading masthead and places the active scene below the visible presentation viewport.
- Harness improvement: No harness change is required; browser evaluation found a product CSS/layout defect and the existing evaluator gate correctly kept F028 incomplete.
- Follow-up feature: None; correct and reevaluate F028.

EVAL_FAIL: F028: implementation_gap - desktop Present mode retains the reading masthead and clips the active scene below a 1440×900 viewport; no harness improvement is required.

## Post-fix reevaluation

- Desktop Present mode at 1440×900 now hides the masthead and keeps all six scenes inside the viewport. Scene bottoms range from y=420 to y=808, with `scrollHeight == clientHeight` for every active scene and document width equal to viewport width.
- Home moves to scene 1, ArrowRight moves to scene 2, and Escape returns to Reading mode with the masthead visible.
- Mobile Reading mode at 390×844 has `scrollWidth == innerWidth == 390`; visible content remains inside x=0…380.4.
- Mobile Present mode exposes a second implementation gap: the action buttons inherit full width and stack vertically. Previous fits at y=774…822, but Next occupies y=834…882 and Exit y=894…943, outside the 844px viewport.

## Mobile Failure Analysis

- Failure domain: implementation_gap
- Failure summary: mobile Present controls overflow below the viewport because presentation action buttons inherit the Reading-mode full-width mobile rule.
- Harness improvement: No harness change is required; real browser evaluation again caught a product CSS defect and F028 remains incomplete.
- Follow-up feature: None; continue F028 with compact mobile Present actions and reevaluate.

EVAL_FAIL: F028: implementation_gap - mobile Present actions stack below a 390×844 viewport; compact the control group and rerun six-scene mobile verification.

## Compact-controls reevaluation

- The three actions now render horizontally in equal columns, so the full-width inheritance defect is fixed.
- The Present root grid still declares `grid-template-rows: auto minmax(0, 1fr)` even though the DOM order is content first and control shell second.
- At 390×844 the scene consumes the first auto row; the control shell is compressed to roughly 31px at y=832…863 while its buttons overflow to y=882…927.
- Required correction: declare `grid-template-rows: minmax(0, 1fr) auto`, preserving a flexible scene row and an intrinsic control row.

## Grid Failure Analysis

- Failure domain: implementation_gap
- Failure summary: Present grid row order is reversed relative to DOM order, so the mobile control shell is compressed below the viewport.
- Harness improvement: No harness change is required; browser geometry gives a deterministic product CSS correction.
- Follow-up feature: None; continue F028.

EVAL_FAIL: F028: implementation_gap - swap the Present grid rows to match content-then-controls DOM order and rerun mobile verification.

## Grid-row reevaluation

- At 390×844, the intrinsic control shell now spans y=666…832 and all three buttons fit horizontally at y=716…761.
- Scenes 1–3 fit the flexible row, but dense scenes 4–6 still report bottoms near y=1084, y=927, and y=1055.
- Their scene-shell `clientHeight` equals full content height, proving internal `overflow:auto` has no effective bound.
- Root cause: the Present root declares only `min-height: 100vh`, so the grid container is allowed to grow beyond the viewport. It needs a definite `height: 100vh` plus `min-height: 0` during Present mode.

## Viewport-height Failure Analysis

- Failure domain: implementation_gap
- Failure summary: dense mobile scenes grow the Present root beyond the viewport because the grid container height is indefinite.
- Harness improvement: No harness change is required; browser geometry identifies a bounded CSS correction.
- Follow-up feature: None; continue F028.

EVAL_FAIL: F028: implementation_gap - give the Present root a definite 100vh height so dense scenes scroll internally instead of extending below the viewport.

## Viewport-height reevaluation

- The control shell remains correctly bounded at y=666…832 and all buttons remain within y=716…761.
- Despite the root's definite 844px height, dense scenes 4–6 still report client heights equal to full content heights (1070, 913, and 1041px) and extend below the first grid row.
- This proves the remaining expansion is inside the nested content/list/item/scene chain, whose default minimum-content and visible-overflow behavior defeats the grid track bound.
- Required correction: apply `min-height: 0` and `overflow: hidden` through the Present content/list/item/scene chain; set scene-shell to `height: 100%; min-height: 0; overflow: auto`.

## Nested-overflow Failure Analysis

- Failure domain: implementation_gap
- Failure summary: nested Present containers still allow minimum-content expansion, so dense scenes escape the bounded root instead of scrolling internally.
- Harness improvement: No harness change is required; the browser measurement identifies the exact CSS containment chain.
- Follow-up feature: None; continue F028.

EVAL_FAIL: F028: implementation_gap - constrain the nested Present scene chain so dense content scrolls inside the active scene shell.

## Nested-overflow reevaluation

- Latest CSS was loaded from a fresh localhost origin after confirming the Hugo server response.
- Desktop Present mode keeps all six scenes inside its viewport; the densest scene uses bounded internal scrolling.
- At 390×844, every active scene is bounded at y=12…650, controls are y=666…832, buttons are y=716…761, and `document.scrollWidth == innerWidth == 390`.
- Scenes 2–6 correctly report `scrollHeight > clientHeight` where their content needs internal scrolling.
- Keyboard Home, ArrowRight, and Escape behavior passed in the prior desktop check; Reading mode remains free of horizontal overflow.
- Final visual defect: Present shell background is `rgba(34, 27, 22, 0.86)` while progress and Exit text are `rgb(32, 24, 22)` and help is `rgb(103, 88, 84)`, producing visibly insufficient contrast.

## Contrast Failure Analysis

- Failure domain: implementation_gap
- Failure summary: Present progress/help/Exit controls inherit dark text tokens on a dark translucent shell.
- Harness improvement: No harness change is required; browser computed styles and screenshot identify a local CSS contrast correction.
- Follow-up feature: None; continue F028.

EVAL_FAIL: F028: implementation_gap - assign explicit light text and border colors to the dark Present control shell before final acceptance.

## Final post-contrast browser verification

- Verified the live Hugo route `http://localhost:1313/talks/hey-jarvis/` after the contrast patch in the in-app Chromium browser.
- Desktop Reading mode at 1440×900 has `document.scrollWidth == innerWidth == 1440`; the masthead renders at x=160…1280 and the six-scene document scrolls normally.
- Desktop Present mode bounds every scene at x=24…1416 and y=24…747, keeps the control shell at y=763…876, and has no document-level horizontal overflow.
- Mobile Present mode at 390×844 bounds every scene at x=12…378 and y=12…650, keeps the complete control shell at y=666…832, and has `document.scrollWidth == innerWidth == 390` on all six scenes.
- The dark control shell now computes to `rgba(34, 27, 22, 0.86)` with progress and Exit text `rgb(255, 250, 244)`, help text `rgb(230, 216, 204)`, and Exit border `rgba(255, 250, 244, 0.48)`.
- Keyboard interaction passed: Home returned to scene 1, ArrowRight advanced to scene 2, and Escape restored Reading mode and its Enter Present mode control.
- A repository-wide Vault filename check found no remaining `hey-jarvis-beyond-the-demo` or `Beyond the Demo` source, copied asset, or Publish projection.

Browser verification: PASS. F028 remains gated on an independent Evaluator Agent result.
