---
author: Nitesh Balla
pubDatetime: 2026-05-09T00:00:00Z
title: "The abstraction I regret writing the most"
draft: false
tags: ["architecture", "opinion"]
description: "A generic wrapper that saved ten lines once and cost a hundred forever."
---

Early in a project I wrote a 'flexible' data layer that could talk to any backend through a config object. It felt clever. It was the kind of thing you put in a talk.

Eighteen months later we had exactly one backend, the config object had twelve special cases, and every new engineer needed an afternoon to understand a layer that wrapped a single fetch call.

## What I'd do now

Write the dumb, direct version. Duplicate it the first time you need a second one. Only abstract on the third, when the shape of the repetition is actually known. The cost of a premature abstraction isn't the code — it's that everyone after you has to learn it before they can change anything.
