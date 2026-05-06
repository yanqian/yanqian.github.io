# UI Redesign Spec

## Goal

- Redesign the personal website UI with a cleaner writing-first experience.
- Use `https://www.cyprien.io/` as a style reference, but do not copy it directly.
- Preserve the existing Hugo + Hugo Coder + GitHub Pages architecture.
- Keep the Obsidian publishing workflow unchanged.

## Reference Direction

- Use a narrow content column, roughly `48rem` wide.
- Prefer a quiet personal engineering blog feel over a portfolio or landing page.
- Use lightweight navigation, subtle dividers, and restrained spacing.
- Avoid card-heavy layouts, decorative hero sections, and large marketing-style blocks.
- Keep the site focused on writing, projects, current status, and resume content.

## Confirmed Decisions

- Similarity level:
  - Use the reference site for general direction only.
  - Keep the site distinct and aligned with Armstrong Yan's own content.
- Accent color:
  - Use a backend/platform-oriented teal or blue-green accent.
  - Avoid the reference site's magenta accent.
- Homepage role:
  - Make the homepage primarily an article list page.
  - Do not use a large hero on the homepage in the first redesign pass.
  - Show `Armstrong Yan` as a small site identity block.
- Terminal/neofetch block:
  - Move the terminal-style personal identity block from the homepage to the About page.
  - Use it as an About page intro, not as the main homepage experience.
- Language strategy:
  - Keep the site primarily English.
  - Allow Chinese-language articles when appropriate.
- Navigation:
  - Keep the current navigation items: `Home`, `Projects`, `About`, `Now`, `Resume`.
  - Do not add `Uses` in the first redesign pass.
- Theme toggle:
  - Preserve Hugo Coder's light/dark mode toggle.
  - Restyle the toggle so it fits the new visual system.

## Homepage

- Purpose:
  - Act as the writing index and primary entry point for public posts.
- Content:
  - Small identity heading: `Armstrong Yan`.
  - Short descriptor: `Backend Engineer · Platform · Systems Thinking`.
  - Short intro sentence about writing topics.
  - Recent writing list.
- Article list:
  - Show title.
  - Show publish date.
  - Show description when the post has `description` frontmatter.
  - Show tags when the post has `tags` frontmatter.
  - Avoid cards.
  - Use spacing and subtle dividers instead of boxed layouts.
- Empty data behavior:
  - Hide description when missing.
  - Hide tags when missing.
  - Keep list layout stable if only title and date exist.

## About Page

- Purpose:
  - Explain who Armstrong is, separate from the homepage writing index.
- Top section:
  - Include a terminal/neofetch block.
- Proposed terminal content:

```text
$ whoami
armstrong@yanqian
-----------------
OS: Human
Host: Singapore
Kernel: Backend / Platform Engineer
Packages: Go, Python, Distributed Systems, Cloud
Focus: Reliable systems, engineering workflows, personal knowledge systems
$ _
```

- Follow-up content:
  - Add a natural prose introduction below the terminal block.
  - Keep the page concise and readable.

## Projects Page

- Purpose:
  - List project links and summaries.
- Style:
  - Use lightweight grouped lists.
  - Avoid a card grid in the first redesign pass.
  - Include project name, short description, and link when available.

## Now Page

- Purpose:
  - Show current focus and status.
- Style:
  - Keep it journal-like and simple.
  - Use headings and short bullet lists when useful.

## Resume Page

- Purpose:
  - Present practical resume information.
- Style:
  - Optimize for scanning.
  - Keep typography consistent with the rest of the site.

## Visual System

- Layout:
  - Use a max content width around `48rem`.
  - Center the main content column.
  - Keep section spacing moderate.
- Typography:
  - Use system sans-serif for body and headings.
  - Use system monospace for terminal and code.
  - Keep headings modest on non-landing pages.
- Links:
  - Use accent color for important links.
  - Use underline or dashed underline on hover/focus.
- Navigation:
  - Lightweight top navigation.
  - Current page should be visually indicated with accent color and/or thin underline.
  - Keep the color scheme toggle visible.
- Dividers:
  - Use subtle horizontal rules between header, content sections, and footer.

## Proposed Palette

### Light

- Background: `#f5f7f6`
- Foreground: `#252b29`
- Muted text: `#697371`
- Accent: `#0f766e`
- Border: `#dce3e0`
- Subtle surface: `#eef3f1`

### Dark

- Background: `#202827`
- Foreground: `#e8eeee`
- Muted text: `#9fb0ad`
- Accent: `#5eead4`
- Border: `#34413f`
- Subtle surface: `#263331`

## Implementation Boundaries

- Do not change the publishing workflow.
- Do not change GitHub Actions unless a build issue requires it.
- Do not edit the `themes/hugo-coder` submodule directly.
- Prefer local Hugo layout overrides and `assets/css/custom.css`.
- Do not add new pages in the first pass.
- Do not add `Uses` in the first pass.
- Do not commit generated `public/` output unless explicitly requested.

## Open Questions

- Final wording for the homepage intro.
- Final About page prose content.
- Whether article tags should be shown as `#tag` text or quieter metadata.
- Whether the header navigation should be centered or left-aligned.
