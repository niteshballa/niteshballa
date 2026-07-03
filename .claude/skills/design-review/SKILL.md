---
name: design-review
description: Checklist to verify UI changes match the site's soft editorial design system before finishing. Use after any change to .astro or .css files, or when asked to review design/consistency.
---

# Design review checklist

Run every check. Report each as pass/fail with file:line for fails, then fix
fails before finishing.

## Efficiency contract

This is a mechanical checklist, not an investigation. Run the greps as ONE
combined bash call, judge the visual checks from screenshots, and only open a
file if a check failed in it. Do not re-derive the design rules — pass/fail is
defined entirely by this file.

## Automated greps (run all as one bash call)

Color/effect literals are allowed ONLY in: `src/styles/tokens.css`,
`src/styles/global.css` (hub system), `src/utils/og-templates/*`.

```sh
# 1. Hardcoded colors in pages/components (should be empty)
grep -rn "oklch(\|rgb(\|#[0-9a-fA-F]\{6\}\b" src/pages src/components src/layouts --include="*.astro"

# 2. Font families other than the zone tokens (should be empty)
grep -rni "font-family" src/pages src/components src/layouts --include="*.astro" | grep -v "var(--serif)\|var(--sans)\|var(--mono)\|var(--font-app)\|var(--font-mono)\|var(--read-font)"

# 3. Forbidden effects in pages (should be empty — the .spot gradient lives in global.css)
grep -rni "gradient\|blur(\|backdrop-filter\|text-shadow" src/pages src/components --include="*.astro"

# 4. BLOG zone must stay soft: hard shadows / thick borders on blog files (should be empty)
grep -rn "box-shadow\|border: 2px\|border: 2.5px" src/pages/posts src/pages/tags src/pages/archives src/pages/search.astro src/layouts/PostDetails.astro src/layouts/BlogLayout.astro src/components/BlogHeader.astro 2>/dev/null | grep -v "progress\|focus"

# 5. The //posts bug (should be empty)
grep -rn '/${getPath' src

# 6. Slop copy (should be empty)
grep -rniE "seamless|elevate|unleash|empower|cutting-edge|supercharge" src

# 7. Naming drift — the blog is "Dev Notes" in ALL copy (inspect hits;
#    code identifiers like BlogLayout/BlogPosting/blogTitle are fine)
grep -rn "field notes\|Blog →\|the blog\b" src/pages src/layouts src/components --include="*.astro"
```

## Visual checks (dev server + browser)

1. `pnpm build` passes.
2. Screenshot the changed pages at 1440px, 834px, 390px wide.
   - No horizontal scrolling/overflow at any width.
   - Text column ≤ 680px (reading) / grid ≤ 920px (home).
3. Squint test per zone (`docs/DESIGN.md`): hub = bold boxes with hard
   ink/terracotta offset shadows; blog = calm cream paper with serif text.
   A soft card on the hub or a hard shadow on the blog = fail.
4. Hover: hub cards lift −2px with accent shadow; blog links only shift
   color/underline — nothing on the blog moves, scales, or glows.
5. Tab through the page: every interactive element shows the 2px terracotta
   focus outline.
6. Navigate between two pages: no console errors, no duplicated listeners
   (check that scroll progress bar still updates after 3 navigations).

## Zone check

- Blog pages (`/posts`, `/tags`, `/archives`, `/search`) start with
  `<BlogHeader>` and use `BlogLayout`.
- Hub pages (`/`, `/404`) use `Layout` and inherit the site footer.
- No page imports both layouts.
