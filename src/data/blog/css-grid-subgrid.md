---
author: Nitesh Balla
pubDatetime: 2026-05-28T00:00:00Z
title: "Subgrid finally made my card layouts behave"
draft: false
tags: ["css", "layout"]
description: "I spent years faking aligned card internals with fixed heights. Subgrid deleted all of it."
---

The classic problem: a grid of cards, each with a title, body, and footer. The titles are different lengths, so the bodies start at different heights, so the footers don't line up. It looks sloppy and there was never a clean fix.

The old hacks were all bad — fixed heights that clip, min-heights that guess, JavaScript that measures and sets. Subgrid lets the card's internal rows participate in the parent grid, so every title row, body row, and footer row aligns across all cards automatically.

```css
.cards { display: grid; gap: 1rem; }
.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
```

Browser support is good enough now that I've stopped treating it as experimental. This is one of those rare CSS features that removes code instead of adding it.
