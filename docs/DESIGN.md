# Design system — two zones, one palette

The site is deliberately TWO visual languages sharing one warm palette
(cream / ink / terracotta). Never mix the languages on one page.

| Zone | Pages | Language |
| --- | --- | --- |
| **Hub** | `/` `/404` | Brutalist bento — loud, boxy, playful |
| **Dev Notes** | `/posts/*` `/tags/*` `/archives` `/search` | Soft editorial — calm, serif, paper |

The shared palette values live in `src/styles/tokens.css` (blog zone) and the
`:root` block of `src/styles/global.css` (hub zone) — same values, keep them
in sync if you ever change one.

## Shared palette

| Token | Use |
| --- | --- |
| `--background` | page cream |
| `--panel` | raised surfaces |
| `--foreground` / `--ink` | text / borders |
| `--muted` | secondary text |
| `--accent` | terracotta, decorative |
| `--accent-ink` | terracotta for text (AA-safe on cream) |
| `--border` | hairlines |

Never write a raw hex/oklch color in a page (only tokens.css, global.css
`:root`, and og-templates hold literals).

## Zone A — Hub (brutalist bento)

- Fonts: `--font-app` (Space Grotesk) display/body, `--font-mono`
  (JetBrains Mono) labels. Loaded in `Layout.astro`.
- Card = `.b-card` (global.css): `--panel` bg, **2px ink border, hard offset
  shadow `4px 4px 0 var(--ink)`**, hover lifts −2px and shadow snaps to
  `6px 6px 0 var(--accent)`. `.spot` adds the terracotta pointer spotlight.
- Headings: Space Grotesk 700, UPPERCASE, tight (`line-height ≈ 0.86`,
  `letter-spacing -0.04em`).
- Labels: mono, uppercase, `0.64rem`, `letter-spacing 0.16em`, `// prefix`.
- Frame: persistent black `topbar`/`bottombar` bars (global.css), film
  `.grain-overlay`, max-width 1040px, 4-col grid → 2-col under 740px.
- Inverted cards: terracotta (`--accent-ink` bg) and black (`--ink` bg) link
  tiles with `--background` text.

## Zone B — Dev Notes (soft editorial)

- Fonts: `--serif` (Newsreader) everything readable, `--mono` (IBM Plex Mono)
  meta/labels/tags. Loaded in `BlogLayout.astro`. Tokens from `tokens.css`.
- NO boxes for lists — hairline `border-top/bottom` rows, `1.8rem 0` padding.
- Page title: serif 600, `clamp(2rem, 5.5vw, 2.8rem)`, `-0.02em`.
- Meta lines: mono `0.74rem`, lowercase, `--muted`; tags `#tag` in
  `--accent-ink`; masthead `~/ Dev Notes`.
- Code blocks: `--panel`, 1px `--border`, radius 6px.
- Column: `--maxw` (680px). Entry animation: `.rise` only.
- Hover: text color → `--accent-ink`, or underline offset 3px. Nothing moves.

## Both zones — never (anti-slop list)

- ❌ gradients (except the sanctioned `.spot` spotlight), glassmorphism, glow
- ❌ new colors, new fonts, dark mode
- ❌ emoji in UI, icon libraries, decorative blobs
- ❌ marketing copy: Elevate, Seamless, Unleash, Empower, ✨
- ❌ brutalist elements on blog pages; soft cards on hub pages
- ❌ removing `prefers-reduced-motion` fallbacks or focus outlines

## Litmus tests

- Hub page squint: black boxes with hard orange/ink shadows on cream, one loud
  uppercase headline. If it looks polite, it's wrong.
- Blog page squint: cream paper, black serif text, tiny mono labels, a few
  terracotta touches. If anything pops, it's wrong.
