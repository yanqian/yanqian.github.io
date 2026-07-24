# Now Page Song Sticker Reveal

## Intent

The two songs in the Now page's Listening section are personal and slightly hidden by nature. Present them as a small discovery instead of a permanently visible list: the reader removes one sticker to reveal both links.

## Included

- English and Chinese Now pages.
- The existing song titles and YouTube links.
- A sticker that covers the list only after JavaScript enhancement.
- Pointer and touch peeling from any edge.
- Partial spring return and full departure matching the locked right, left, down, or up drag direction.
- Permanent reveal for the current page view.
- Refresh-based reset with no persisted state.
- Enter/Space activation, focus handoff, live status, and reduced motion.

## Excluded

- Homepage visual changes.
- Embedded media or playback.
- Persisted reveal state.
- Automatic re-covering after reveal.

## Manual Checks

1. Open `/now/` and `/zh/now/` in light and dark modes.
2. Confirm the Listening introduction and following paragraph remain visible while only the songs are covered.
3. Release a partial peel and confirm the sticker returns.
4. Complete a peel from different edges and confirm the sticker departs and stays absent.
5. Confirm both links can be opened and focus moves to the first link after keyboard reveal.
6. Refresh and confirm the sticker is present again.
7. Repeat at 390px width and with reduced motion enabled.
