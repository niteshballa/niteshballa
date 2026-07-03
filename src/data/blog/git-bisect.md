---
author: Nitesh Balla
pubDatetime: 2026-04-21T00:00:00Z
title: "git bisect is the debugging tool I forget I own"
draft: false
tags: ["git", "debugging"]
description: "A binary search through history that finds the exact commit that broke things."
---

When something worked last week and doesn't today, I used to read diffs and guess. Bisect turns it into a binary search: mark a known-good commit, a known-bad commit, and git walks you to the culprit in log-n steps.

```bash
git bisect start
git bisect bad
git bisect good v1.4.0
# test, then mark each step:
git bisect good   # or: git bisect bad
```

On a repo with a thousand commits between good and bad, that's about ten tests instead of a thousand. The first time it pinpointed a one-line change buried in a merge, I was sold for life.
