# CLAUDE.md

## Project Overview

Personal blog of **Nitesh Balla** — a DevOps engineer and cloud-native specialist. Built with [Astro](https://astro.build/) as a static site, using Markdown/MDX for content. Deployed to **GitHub Pages** via GitHub Actions.

- **Live site**: https://nitesh.is-a.dev
- **License**: MIT (Copyright 2025 Stel Clementine — upstream theme)

## Tech Stack

- **Framework**: Astro v5 (static site generation)
- **Styling**: Tailwind CSS v4 (via Vite plugin) + custom CSS variables
- **Language**: TypeScript (strict mode, `verbatimModuleSyntax`)
- **Syntax Highlighting**: Expressive Code with 53 Shiki themes
- **Search**: Pagefind (built post-Astro build)
- **Comments**: Giscus (GitHub Discussions)
- **Math**: KaTeX via remark-math + rehype-katex
- **Font**: JetBrains Mono Variable

## Quick Start

```bash
npm ci                # Install dependencies (use ci, not install)
npm run dev           # Start dev server (astro dev)
npm run build         # Build for production (astro build + pagefind)
npm run preview       # Preview production build locally
npm run format        # Format all files with Prettier
```

Node 20+ is required (CI uses Node 20; local environment has Node 22).

## Repository Structure

```
├── astro.config.mjs          # Astro config: integrations, remark/rehype plugins
├── package.json               # Dependencies and scripts
├── prettier.config.js         # Prettier config
├── tsconfig.json              # TypeScript config with ~/* path alias → src/*
├── giscus.json                # Giscus CORS origin whitelist
├── dev/                       # Dev-only theme analysis tooling (safe to ignore)
├── public/                    # Static assets (favicon, character images, RSS XSL)
├── .github/workflows/astro.yml  # CI/CD: build & deploy to GitHub Pages
└── src/
    ├── site.config.ts         # Central site configuration (title, nav, themes, socials)
    ├── content.config.ts      # Content collection schemas (Zod)
    ├── types.ts               # TypeScript type definitions
    ├── utils.ts               # Utility functions (posts, themes, collations)
    ├── env.d.ts               # Astro environment types
    ├── styles/global.css      # Global styles, Tailwind imports, theme variables
    ├── components/            # 25 Astro components
    ├── layouts/               # Layout.astro (base) + MarkdownLayout.astro
    ├── pages/                 # Route files (static + dynamic)
    ├── plugins/               # 10 custom remark/rehype plugins
    ├── content/               # Blog content
    │   ├── posts/             # Blog posts (*.md / *.mdx)
    │   ├── home.md            # Homepage banner content
    │   └── addendum.md        # Post footer content
    └── icons/                 # 17 SVG icon components
```

## Key Configuration Files

### `src/site.config.ts`
Central configuration hub. Controls:
- Site URL, title, author, description
- Navigation links (Home, About, Posts)
- Theme mode (`select` — user picks from 53 themes; default: `github-dark`)
- Social links (GitHub, LinkedIn, email, RSS)
- Giscus comments settings
- Character images for dialogue directives (owl, unicorn, duck)
- Page size (6 posts per page)

### `astro.config.mjs`
Defines the Astro build pipeline:
- **Remark plugins** (order matters): description extraction → reading time → directives → GitHub cards → admonitions → character dialogue → unknown directives → math → gemoji
- **Rehype plugins** (order matters): heading IDs → autolink headings → title figures → external links → unwrap images → pixelated images → badge images → KaTeX
- **Integrations**: sitemap, expressive-code (must come before mdx), mdx

### `src/content.config.ts`
Defines three content collections:
- **posts**: Blog posts with frontmatter schema (title, published, draft, description, tags, series, coverImage, badge, toc)
- **home**: Homepage content (avatar, GitHub calendar username)
- **addendum**: Post footer content

## Content Authoring

### Creating a New Post

Add a `.md` or `.mdx` file in `src/content/posts/` with this frontmatter:

```yaml
---
title: "Post Title"          # Required
published: 2025-07-10        # Required - publication date
draft: false                 # Optional - hides from production
description: ""              # Optional - auto-extracted from first paragraph if empty
author: "Nitesh"             # Optional
tags: [tag1, tag2]           # Optional
series: "Series Name"        # Optional - groups related posts
coverImage:                  # Optional
  src: "./image.jpg"
  alt: "Description"
badge: "https://..."         # Optional - badge image URL
badgeAlt: "Badge text"       # Optional
badgeLink: "https://..."     # Optional
toc: true                    # Optional (default: true) - table of contents
---
```

### Markdown Features

- **Admonitions**: `:::tip`, `:::note`, `:::important`, `:::caution`, `:::warning` with optional titles
- **Character dialogue**: `:::owl`, `:::unicorn`, `:::duck` directives
- **GitHub cards**: `:github{repo="owner/repo"}` or `:github{user="username"}`
- **Math**: `$inline$` and `$$block$$` LaTeX via KaTeX
- **Emoji shortcodes**: `:+1:`, `:smile:`, etc. via gemoji
- **Code blocks**: Expressive Code with optional line numbers (`showLineNumbers`)

## Page Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `pages/index.astro` | Homepage with banner, series, tags, latest posts |
| `/about` | `pages/about.md` | About page (Markdown) |
| `/posts` | `pages/posts/[...page].astro` | Paginated post archive |
| `/posts/[slug]` | `pages/posts/[slug].astro` | Individual post page |
| `/tags/[tag]` | `pages/tags/[tag]/[...page].astro` | Posts filtered by tag |
| `/series/[slug]` | `pages/series/[slug].astro` | Posts grouped by series |
| `/rss.xml` | `pages/rss.xml.ts` | RSS feed |
| `/robots.txt` | `pages/robots.txt.ts` | Robots file |
| `/social-cards/[slug].png` | `pages/social-cards/[slug].png.ts` | Dynamic OG images |

## Custom Plugins (src/plugins/)

| Plugin | Type | Purpose |
|--------|------|---------|
| `remark-description.ts` | Remark | Auto-extracts description from first paragraph (max 200 chars) |
| `remark-reading-time.ts` | Remark | Adds "X min read" to frontmatter |
| `remark-admonitions.ts` | Remark | Converts `:::type` directives to styled callouts |
| `remark-github-card.ts` | Remark | Renders GitHub repo/user cards with live API data |
| `remark-character-dialogue.ts` | Remark | Character speech bubbles (owl, unicorn, duck) |
| `remark-gemoji.ts` | Remark | Converts emoji shortcodes to Unicode with ARIA |
| `remark-unknown-directives.ts` | Remark | Graceful handling of unrecognized directives |
| `rehype-title-figure.ts` | Rehype | Wraps titled images in `<figure>` with `<figcaption>` |
| `rehype-pixelated.ts` | Rehype | Adds pixelated rendering to flagged images |
| `rehype-badge-images.ts` | Rehype | Special styling for badge images |

## Styling Conventions

- **Tailwind CSS v4** with custom CSS variables for theming
- Theme colors are dynamically generated from Shiki themes and injected as CSS variables (`--theme-accent`, `--theme-foreground`, `--theme-background`, `--theme-heading1`–`6`, `--theme-link`, etc.)
- Global styles in `src/styles/global.css` (~20KB)
- Heading prefixes: h1 uses `#`, h2 uses `##`, etc. (rendered via CSS `::before`)
- Mobile-first responsive design with Tailwind breakpoints
- Max content width: `max-w-3xl` (48rem)

## Code Style & Formatting

- **Prettier** for formatting: `npm run format`
  - No semicolons
  - Single quotes
  - Trailing commas (all)
  - Print width: 90 characters
  - 2-space indentation (no tabs)
  - Astro files use the `astro` parser
- **TypeScript**: strict mode with path alias `~/*` → `src/*`
- **ES Modules**: `"type": "module"` — use `import`/`export`, not `require`

## CI/CD & Deployment

GitHub Actions workflow (`.github/workflows/astro.yml`):
1. Triggered on push to `main` or manual dispatch
2. Installs dependencies with `npm ci`
3. Builds with `astro build`
4. Generates Pagefind search index (`pagefind --site dist`)
5. Deploys to GitHub Pages

The `main` branch is the deployment branch. The `master` branch exists locally.

## Important Conventions for AI Assistants

- **Do not modify** `src/site.config.ts` theme lists or `src/styles/global.css` theme variables without explicit request — these are carefully tuned
- **Plugin order matters** in `astro.config.mjs` — `remark-directive` must come before admonitions/dialogue/unknown-directives; `expressiveCode()` must come before `mdx()`
- **Draft posts** (`draft: true` in frontmatter) are excluded from production builds but visible in dev
- The `dev/` directory is for development reference only — it is not part of the build
- Path alias `~/*` maps to `src/*` in imports (e.g., `import siteConfig from '~/site.config'`)
- Blog posts are sorted by `published` date, most recent first
- Social cards are generated dynamically using Satori — the OG image endpoint is at `/social-cards/[slug].png`
- The site uses Astro View Transitions for smooth page navigation
- There are no tests configured in this project — validate changes by running `npm run build` successfully
