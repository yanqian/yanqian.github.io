# Browser Verification: F030

Date: 2026-08-31

## Environment

- Live route: `http://localhost:1313/talks/hey-jarvis/`
- Browser surface: in-app Chromium browser
- Desktop viewport: 1440×900 requested; browser reported a 1440px Reading viewport and a 1512×949 Present viewport after UI resizing.
- Mobile viewport: 390×844

## Reading Mode

- Desktop document width equals viewport width (`1440 == 1440`), with no horizontal overflow.
- The real app image loads from `./assets/hey-jarvis-app-ui.png` at its natural 1634×1206 dimensions.
- The rendered desktop hero keeps the source ratio (`470×347`, ratio 1.355) with no crop or blank lower panel after the final image-sizing correction.
- The 390px mobile hero renders at `322×238`, preserving the same 1.355 ratio, and the document width remains `390 == 390`.
- The body now has no background image or gradient; the flat `--hj-bg` surface matches the main site's background behavior.
- Scene 4 visibly contains the corrected second card: acknowledgement playback and Realtime initialization race, and “I'm here” waits for a two-condition readiness barrier.

## Present Mode

- Desktop: all six active scenes share a bounded x=24…1488, y=24…796 frame; the control shell is y=812…925 and document width equals viewport width (`1512 == 1512`).
- Mobile: all six active scenes are bounded at x=12…378, y=12…650; the control shell is y=666…832 and document width equals viewport width (`390 == 390`).
- No scene or document-level horizontal overflow was observed at either size.
- The real-browser Present control shell computes to site dark surface `rgb(38, 51, 49)` with progress text `rgb(232, 238, 238)`.
- A clicked presentation control receives the visible three-pixel accent focus ring, and Escape restores Reading mode.
- Static dark-mode contracts additionally verify `#202827` background, `#e8eeee` foreground, `#9fb0ad` muted text, `#5eead4` accent, `#34413f` border, and dark accent-button ink `#202827` so the light accent does not carry white text.

## Repository Boundary

- A Vault filename scan found no `hey-jarvis-beyond-the-demo`, `Beyond the Demo`, or `hey-jarvis-app-ui` webpage source or copied asset.
- `./init.sh` passes with 69 Hugo tests, 19 publisher tests, the Harness suite, and the production Hugo build.

Browser verification: PASS. F030 remains gated on a separate Evaluator Agent result.
