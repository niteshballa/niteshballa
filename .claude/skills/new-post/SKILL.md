---
name: new-post
description: Scaffold a new Dev Notes blog post with correct frontmatter, filename, and voice. Use whenever the user asks to write, draft, or add a blog post/note/article.
---

# New blog post

Follow these steps exactly. Do not skip step 1.

## Efficiency contract

Everything you need is in this file and `docs/WRITING.md` — do not explore the
repo, do not open other posts "for reference", do not search for the schema
(it's `src/content.config.ts`, and the template below already satisfies it).
Target: ≤ 5 tool calls total — read WRITING.md, grep tags, write the file,
build, done.

## 1. Read the rules

Read `docs/WRITING.md` in full. Every rule there is binding — especially the
banned-words list and the frontmatter template.

## 2. Pick the filename

- Kebab-case slug of the core idea: `src/data/blog/<slug>.md`
- Short: 2–4 words (`git-bisect.md`, `debounce-vs-throttle.md`)
- The slug becomes the URL `/posts/<slug>` — no dates, no stop-words

## 3. Reuse tags

Run: `grep -h "tags:" src/data/blog/*.md | sort -u`
Reuse an existing tag when one fits. 1–3 tags, lowercase.

## 4. Write the file

Use this exact frontmatter shape (all five fields required):

```markdown
---
author: Nitesh Balla
pubDatetime: <today>T00:00:00Z
title: "<specific, lowercase-leaning title>"
draft: false
tags: ["tag1", "tag2"]
description: "<one concrete sentence — this is the dek on the list page>"
---

<300–900 words following docs/WRITING.md>
```

Body constraints:

- Markdown only: paragraphs, `## H2` (sparingly), fenced code blocks with a
  language, occasional bold. No images unless the user provides one, no HTML.
- Code fences must name the language: ```js, ```bash, ```css …

## 5. Verify

1. `pnpm build` — must pass (schema errors fail here).
2. Confirm the post shows at the top of `/posts/` and its page renders.
3. Re-read the post against the banned list in `docs/WRITING.md`; delete any
   sentence a tired engineer wouldn't say out loud.
