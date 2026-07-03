---
name: add-page
description: Add or modify a page on the site using the correct layout, zone, and design tokens. Use when asked to create a new page/route or restyle an existing one.
---

# Add or change a page

## Efficiency contract

This file names every path and pattern you need — do not explore the repo
beyond: (1) `docs/DESIGN.md`, (2) the ONE pattern file from the table below,
(3) the file you're changing. Copy the pattern file's structure instead of
inventing your own. Target: ≤ 8 tool calls including build + screenshot.

## 1. Read the rules

Read `docs/DESIGN.md` in full first. It defines the only allowed colors,
fonts, spacing, and the anti-slop list. Also skim `CLAUDE.md` hard rules.

## 2. Pick the zone → layout

| If the page is… | Use | Copy the pattern from |
| --- | --- | --- |
| part of the blog (lists, browsing, reading) | `BlogLayout.astro` | `src/pages/tags/index.astro` |
| personal/portfolio (home-adjacent) | `Layout.astro` | `src/pages/index.astro` |

Never mix: a `BlogLayout` page starts with `<BlogHeader …/>`; a `Layout` page
provides its own masthead and gets the site footer for free.

## 3. Build the page

- Frontmatter: import the layout + `SITE` from `@/config`; pass
  `title={`X | ${SITE.title}`}`.
- Styling: scoped `<style>` in the same file, **tokens only**
  (`var(--foreground)`, `var(--muted)`, `var(--accent-ink)`, `var(--border)`…).
  Zero hex colors, zero new fonts.
- Blog zone: column `max-width: var(--maxw)`; serif text, `.mono` labels;
  lists = hairline rows (copy `/posts/` page). NO boxes, NO hard shadows.
- Hub zone: 1040px column; `.b-card` boxes with 2px ink border + hard offset
  shadow; Space Grotesk uppercase headings; mono uppercase `// labels`.
- Any `<script>` must survive view transitions: bind once behind a
  `window.__myFlag` guard or re-init on `astro:page-load`.
- Links to posts: `href={getPath(post.id, post.filePath)}` — never prefix with
  another `/` (produces `//posts/...` → 404).

## 4. Verify

1. `pnpm build` — must pass.
2. Open the page in dev, screenshot at ~1440px and ~390px wide; nothing may
   overflow horizontally.
3. Run the squint test from `docs/DESIGN.md`: cream, black serif, small mono
   labels, a few terracotta touches — nothing else pops.
