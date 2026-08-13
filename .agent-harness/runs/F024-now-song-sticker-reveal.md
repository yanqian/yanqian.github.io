# F024 Now Song Sticker Reveal

## Implementation Mode

Manual fallback. The configured independent evaluator model remains unavailable in the installed Codex CLI; do not mark the feature complete without compatible evaluator evidence and user approval.

## Scope

- Removed the rejected homepage brand-sticker experiment completely.
- Wrapped the existing bilingual two-song lists in one paired shortcode.
- Added progressive enhancement, pointer/touch peeling, partial spring return, permanent in-page reveal, keyboard activation, focus handoff, reduced motion, and Now-page-only script loading.
- Kept reveal state ephemeral: no storage, cookie, URL, or backend persistence is used.

## Evidence

- JavaScript syntax validation: pass.
- Six focused Python tests: pass.
- `./init.sh`: 58 Python tests pass, 15 publisher tests pass, and the production Hugo build succeeds for 243 English and 242 Chinese pages.
- Desktop dark-mode initial cover inspected at 1440×900.
- Keyboard reveal sets the component to revealed, hides the sticker, removes `inert`, and focuses `浜崎あゆみ - MY ALL`.
- A full real pointer drag sets peel progress to `1.000`, removes the sticker, and leaves the songs visible.
- Four-direction real pointer checks pass: right drag uses left peel/right departure, left drag uses right peel/left departure, down drag uses top peel/bottom departure, and up drag uses bottom peel/top departure.
- The gesture direction locks after the first 5px of meaningful movement so small hand jitter does not reverse the departure animation.
- A partial real pointer drag springs back to `0.000` without revealing.
- Navigation/refresh recreates the initial covered state with the song content inert.
- Chinese mobile at 390×844 is 358px wide with no horizontal overflow; light and dark modes both remain readable.
- The sticker uses separate light and dark surface, border, text, sheen, texture, peel-edge, and shadow tokens so dark mode remains subdued without losing its paper-like depth.
- Desktop dark-mode browser inspection resolves the sticker surface to `rgb(41, 65, 61)`, border to `rgb(65, 99, 93)`, primary text to `rgb(230, 241, 239)`, and hint text to `rgb(169, 191, 187)`.
- Chinese dark mode at 390×844 keeps the sticker at 358px inside a 390px viewport with no horizontal overflow.
