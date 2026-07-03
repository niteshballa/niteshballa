# nitesh.is-a.dev — personal site + Dev Notes blog

Astro 5 static site. TWO deliberate design zones sharing one warm palette
(cream / ink / terracotta) — see `docs/DESIGN.md` before touching UI:

| Zone | Pages | Look | Layout |
| --- | --- | --- | --- |
| Hub | `/` `/404` | Brutalist bento (Space Grotesk, 2px borders, hard offset shadows, grain) | `src/layouts/Layout.astro` |
| Dev Notes blog | `/posts/*` `/tags/*` `/archives` `/search` | Soft serif editorial (Newsreader, hairlines, no boxes) | `src/layouts/BlogLayout.astro` |

`/blog` redirects to `/posts` (see `astro.config.ts`).

## Naming standard (never drift from this)

- User-facing name of the blog: **Dev Notes** (`SITE.blogTitle`). Never write
  "blog", "posts", or "field notes" in UI copy, page titles, or descriptions.
- Individual items are **notes** in copy ("all notes", "find a note").
- Blog page `<title>` pattern: `X · Dev Notes` (list page:
  `Dev Notes · Nitesh Balla`). Hub pattern: `X | Nitesh Balla`.
- Code internals stay as-is and are NOT copy: route `/posts/`, collection
  `blog`, dir `src/data/blog`, layout `BlogLayout`. Don't rename them.
- Tagline (the only one): "things I figured out, written down before I forget
  them".

## Canonical facts (reference ONLY — never insert into pages unless explicitly asked)

- Nitesh Balla — Forward Deployed Engineer at Manif (payments).
- Maintained production for a **$1B payments stack**; processed **high-risk
  payments** end to end.
- Startup: betterswitch.io. Prior: GreenBanana (Engineering Lead · Germany),
  Juspay (Product Engineer · Hyperswitch), MAQ Software.
- Stack: Rust, TypeScript, Kubernetes, Postgres, Terraform, Grafana.

## Commands

```sh
pnpm dev        # dev server on :4321 (search needs a build first)
pnpm build      # astro check + build + pagefind index — must pass before done
pnpm format     # prettier
pnpm lint       # eslint
```

Always finish a change by running `pnpm build`. It type-checks every page and
renders every route; a red build means the change is not done.

## Where things live

- **Design tokens:** `src/styles/tokens.css` (blog zone) and the `:root` block
  in `src/styles/global.css` (hub zone) — same palette values, keep in sync.
  Never hardcode a color anywhere else. Rules: `docs/DESIGN.md`.
- **Writing rules for posts:** `docs/WRITING.md`.
- **Blog posts:** `src/data/blog/*.md` — schema in `src/content.config.ts`
  (required: `title`, `description`, `pubDatetime`, `tags`).
- **Blog browse header:** `src/components/BlogHeader.astro` (masthead `~/ Dev Notes`).
- **Reading page:** `src/layouts/PostDetails.astro`.
- **URL builder:** `src/utils/getPath.ts` — it already returns a leading
  `/posts/...`; never wrap it as `` `/${getPath(...)}` `` (that makes `//posts`,
  which browsers treat as another host → 404).
- **OG images:** `src/utils/og-templates/{post,site}.js` — colors are sRGB copies
  of the tokens; if tokens change, update these too.

## Hard rules

1. Read `docs/DESIGN.md` before touching any `.astro` or `.css` file.
2. Read `docs/WRITING.md` before writing or editing any blog post.
3. No new fonts, no new colors, no gradients, no heavy shadows, no dark mode.
4. Page-specific CSS goes in the page's own `<style>` block using tokens
   (`var(--accent)` etc.), not in global.css.
5. Don't add npm dependencies for things CSS or 20 lines of JS can do.
6. Scripts must survive Astro view transitions: bind once behind a
   `window.__flag` guard, or re-init on `astro:page-load`. Never add
   document-level listeners inside a per-navigation callback (they stack).

## Efficiency contract (all models, all tasks)

This file + `docs/DESIGN.md` + `docs/WRITING.md` are authoritative — trust
them instead of exploring. Concretely:

- Don't search the repo for things named here (layouts, tokens, schema, utils).
- Don't open more than one existing file as a style reference; copy its shape.
- Batch shell commands; run `pnpm build` once at the end, not between edits.
- Small diffs: match surrounding code, no drive-by refactors, no new deps.
- If a rule here conflicts with what you'd normally do, the rule wins.

## Skills

- `/new-post` — scaffold a blog post correctly (≤5 tool calls)
- `/add-page` — add a page in the right zone with the right layout (≤8 calls)
- `/design-review` — mechanical pass/fail checklist before calling UI done
