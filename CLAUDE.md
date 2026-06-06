# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal blog of Nitesh Balla, built with **Astro** (v5) and deployed as a static site to **GitHub Pages**. Note: the top-level `README.md` is a GitHub *profile* readme, not project documentation — ignore it for architecture.

The `redesign-minimal` branch is a from-scratch minimal redesign that deletes the prior theme-template components. The live architecture is what exists under `src/` now, not the deleted files shown in `git status`.

## Commands

```bash
npm run dev      # local dev server (astro dev)
npm run build    # static build to dist/ (astro build) — also the type/content check
npm run preview  # serve the built dist/
```

There is no test suite, linter, or formatter configured. `npm run build` is the closest thing to a check: it runs Astro's content-collection validation and `astro/tsconfigs/strict` type checking, so a clean build is the bar before committing.

## Architecture

Static site generation only — every route is prerendered. No client framework; the only client-side JS is two small inline/island scripts (theme toggle, pre-paint theme application in `Base.astro`).

- **`src/consts.ts`** — single source of site-wide config (`SITE`, `NAV`, `SOCIALS`). Edit here to change title, nav links, social URLs; consumed by layouts and the RSS endpoint.
- **`src/content.config.ts`** — defines the `posts` content collection via Astro's `glob` loader over `src/content/posts/**/*.md`. The Zod `schema` here is the source of truth for post frontmatter (`title`, `published`, `updated?`, `description?`, `draft`, `tags[]`). Unknown frontmatter keys in existing posts (e.g. `author`, `toc`, `badge`) are silently ignored — don't assume they're used.
- **`src/layouts/`** — `Base.astro` is the HTML shell (head/meta/OG tags, header, footer, theme bootstrap). `Post.astro` wraps `Base` and renders post chrome (title, reading time via `reading-time`, tags, date).
- **`src/pages/`** — file-based routes. Dynamic routes (`posts/[slug]`, `tags/[tag]`) use `getStaticPaths`. `rss.xml.ts` and `tags/index.astro` also derive their data from the collection.
- **`src/styles/global.css`** — all styling. Light/dark theming is driven by toggling the `dark` class on `<html>`; CSS variables switch accordingly. Shiki code highlighting uses paired `github-light`/`github-dark` themes (configured in `astro.config.mjs`) that follow the same `html.dark` class.

### Cross-cutting conventions

- **Draft filtering**: every place that lists posts filters with `(p) => !p.data.draft` — index, `[slug]`, `tags/*`, and RSS. Keep this consistent when adding any new post listing.
- **Post URLs** are `/posts/${post.id}` where `id` is the glob-derived slug (the filename without extension). Tag URLs are `/tags/${encodeURIComponent(tag)}`.
- New blog post = drop a `.md` file in `src/content/posts/` with frontmatter matching the collection schema. No registration needed.

## Deploy

`.github/workflows/astro.yml` builds and deploys to GitHub Pages on push to `main` only (or manual dispatch). The workflow additionally runs `pagefind` to build a search index over `dist/` — this is a build-time step, not a local dependency. Site URL is `https://nitesh.is-a.dev` (`astro.config.mjs`), with `trailingSlash: 'never'`.
