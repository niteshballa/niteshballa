# Writing rules — Dev Notes

Voice: an engineer writing down what they actually learned, for their future
self. Tagline is the contract: *"things I figured out, written down before I
forget them."*

## Shape

- 300–900 words. One idea per post. If there are two ideas, write two posts.
- Title: lowercase-ish, specific, first person allowed. Good: "git bisect is
  the debugging tool I forget I own". Bad: "Mastering Git Bisect: A
  Comprehensive Guide".
- `description` (the dek): one sentence, concrete, slightly wry. It appears on
  the list page — it must earn the click without hype.
- Open in the middle of the problem ("Every few months I confuse these two…").
  Never open with "In today's fast-paced world of software development".
- H2s only when the post genuinely has parts. Many posts need zero headings.
- End on the takeaway or rule of thumb. No summary section, no "Conclusion".

## Sentences

- First person, past tense of real experience. "I shipped a janky scroll
  handler" beats "one might encounter performance issues".
- Concrete numbers and names: "about ten tests instead of a thousand".
- Short sentences. Cut every adverb you can. Cut "very", "simply", "just".
- Code blocks small and runnable — the minimum that makes the point.

## Banned (instant slop tells)

- delve, dive deep, deep dive, unpack, explore, journey, landscape, realm
- leverage, utilize, robust, seamless, cutting-edge, game-changer, supercharge
- "It's important to note", "It's worth mentioning", "In conclusion",
  "At the end of the day", "Let's face it"
- "Whether you're a beginner or an expert…"
- Rhetorical-question openers ("Have you ever wondered…?")
- Bullet lists of obvious platitudes; numbered listicles as structure
- Emoji, exclamation marks (one per post, max, and earn it)
- Hedging soup: "arguably", "potentially", "essentially" repeated

## Frontmatter template

```yaml
---
author: Nitesh Balla
pubDatetime: 2026-07-03T00:00:00Z   # today, ISO, Z suffix
title: "..."
draft: false
tags: ["one", "two"]                # 1–3 lowercase tags, reuse existing ones
description: "..."                  # the dek — one concrete sentence
---
```

Check existing tags first (`grep -h "^tags:" src/data/blog/*.md`) and reuse
before inventing new ones.
