---
author: Nitesh Balla
pubDatetime: 2026-06-12T00:00:00Z
title: "Debounce vs. throttle, and when I reach for each"
draft: false
tags: ["javascript", "perf"]
description: "Two functions that look identical in the docs and behave nothing alike in production."
---

Every few months I confuse these two, write the wrong one, and ship a janky scroll handler. So here is the version of the explanation that finally stuck for me.

## The one-line difference

Debounce waits for quiet. Throttle enforces a rhythm. That's it. If you remember nothing else, remember that a debounced function fires after things stop happening, and a throttled function fires at a steady cadence while things keep happening.

Search-as-you-type wants debounce — you don't care about every keystroke, you care about the pause. A scroll or resize handler wants throttle — you want regular updates, just not 200 of them a second.

```js
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
```

## The mistake I keep making

Reaching for debounce on a scroll handler. The page feels dead until you stop scrolling, then everything snaps into place at once. Throttle would have kept it alive the whole way down.

Rule of thumb: if the user is waiting for you to stop, debounce. If the user is watching something move, throttle.
