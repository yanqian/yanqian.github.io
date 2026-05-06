# UI Redesign Implementation Plan

## Phase 1: Documented Design Baseline

- [x] Capture redesign goals and constraints in `spec/ui-redesign.md`.
- [x] Capture implementation steps in this plan.
- [x] Keep the plan scoped to UI and information architecture.
- [x] Leave Obsidian publishing and deployment workflows unchanged.

## Phase 2: Layout Audit

- [ ] Review Hugo Coder's current layout hierarchy.
- [ ] Identify the smallest local override set needed for the redesign.
- [ ] Confirm whether the header can be restyled with CSS alone.
- [ ] Confirm whether footer changes need a local partial override.
- [ ] Confirm how Hugo Coder marks the active navigation item.

## Phase 3: Homepage Redesign

- [ ] Replace the current terminal-style homepage with a writing index.
- [ ] Add a compact identity section:
  - `Armstrong Yan`
  - `Backend Engineer · Platform · Systems Thinking`
  - One short writing-focused intro sentence.
- [ ] Render recent posts from `content/posts/`.
- [ ] Show each post's title and date.
- [ ] Show `description` only when present.
- [ ] Show `tags` only when present.
- [ ] Use list rows and spacing instead of cards.
- [ ] Ensure empty or sparse post metadata does not break layout.

## Phase 4: About Page Redesign

- [ ] Move the terminal/neofetch block to the About page.
- [ ] Keep terminal content focused on identity, location, stack, and interests.
- [ ] Add concise prose below the terminal block.
- [ ] Keep the About page readable without turning it into a landing page.

## Phase 5: Global Styling

- [ ] Update `assets/css/custom.css` with the new visual system.
- [ ] Set light and dark color tokens.
- [ ] Apply narrow content width consistently.
- [ ] Restyle body background, foreground, muted text, links, and borders.
- [ ] Restyle navigation to be lighter and closer to the reference direction.
- [ ] Restyle the color scheme toggle without removing functionality.
- [ ] Restyle footer spacing and dividers.
- [ ] Restyle article list rows, descriptions, dates, and tags.
- [ ] Restyle terminal block for the About page.

## Phase 6: Fixed Pages

- [ ] Review `Projects` page content and layout.
- [ ] Review `Now` page content and layout.
- [ ] Review `Resume` page content and layout.
- [ ] Keep these pages simple and scannable.
- [ ] Avoid adding new pages during this phase.

## Phase 7: Content Metadata

- [ ] Review existing posts for missing title, description, date, and tags.
- [ ] Decide whether placeholder posts should remain published.
- [ ] Add descriptions only where they improve the article list.
- [ ] Keep frontmatter compatible with Hugo and Obsidian publishing.

## Phase 8: Verification

- [ ] Run `hugo server -D` for local visual review.
- [ ] Run `hugo --gc --minify` for production build verification.
- [ ] Confirm `public/index.html` is generated.
- [ ] Check homepage layout in light mode.
- [ ] Check homepage layout in dark mode.
- [ ] Check mobile width behavior.
- [ ] Check desktop width behavior.
- [ ] Verify that the color scheme toggle still works.
- [ ] Verify that navigation links still route correctly.

## Phase 9: Follow-Up Options

- [ ] Consider adding a `Uses` page later.
- [ ] Consider adding search later.
- [ ] Consider adding RSS/social links in the footer later.
- [ ] Consider adding post taxonomies once there are enough articles.
