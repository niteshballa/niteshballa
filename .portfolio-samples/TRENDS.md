# Modern frontend effects — research reference (June 2026)

Researched for the portfolio redesign. Each effect: what it is, who set the trend, how to build it, perf notes, and whether it fits a minimal identity hub.

---

## 1. Grain / noise texture
**What:** A fine film/print grain over backgrounds and gradients. The #1 "premium, hand-made" signal in 2025–26; a direct reaction against flat, over-automated AI-looking design. Texture for *emotional resonance*, not flair.

**Who:** Anthropic, Vercel, Linear, most AI launch pages.

**How (SVG feTurbulence overlay — cheapest, best):**
```css
.grain{
  position:fixed; inset:0; pointer-events:none; z-index:99;
  opacity:.05;                 /* 0.03–0.08 sweet spot; research says up to .15–.30 for bolder */
  mix-blend-mode:multiply;     /* multiply on light bg, screen/overlay on dark */
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```
**Perf:** Static data-URI = near free. Don't animate it per-frame. **Fits the hub: YES** (already in our warm samples).

---

## 2. Gemini-style "splashy glow" gradient
**What:** Google Gemini's signature look. Gradients with **sharp, almost-opaque leading edges that diffuse into a soft tail** — they read as *directional energy / active thinking*. Warm, spatial, rounded, "in-between fuzzy space." Multi-color ethereal transitions drawn from Google's 4 brand colors (red/yellow/green/blue), plus pulsing/rippling motion and a circle motif. New Gemini UI (2026) leans even harder into colorful-blur + pulsing animations.

**Recognizable by:** the diffusion (opaque head → blurred tail), circular forms, and slow pulse.

**How (CSS — conic/radial blob with blur + drift):**
```css
.glow{
  position:absolute; inset:-20%;
  background:
    radial-gradient(40% 50% at 30% 30%, oklch(0.7 0.2 25 / .9), transparent 60%),
    radial-gradient(35% 45% at 70% 40%, oklch(0.75 0.18 90 / .8), transparent 60%),
    radial-gradient(45% 55% at 50% 75%, oklch(0.65 0.2 250 / .8), transparent 60%);
  filter:blur(60px) saturate(1.4);
  animation:drift 14s ease-in-out infinite alternate;
}
@keyframes drift{ to{ transform:translate3d(4%, -3%, 0) scale(1.1); } }
```
**Animated gradient-position variant (lighter):**
```css
@keyframes gemini{0%{background-position:0% 0%}50%{background-position:100% 100%}100%{background-position:0% 0%}}
```
**Perf:** Big `blur()` is GPU-heavy; render on a fixed layer, keep blob count ≤4, animate `transform` not layout. **Fits the hub:** YES but it's the *most-done* AI look — use restrained or it reads generic. Our H2 (aurora) is this lane.

---

## 3. Interactive card motion
Three distinct techniques, often combined:

### 3a. Pointer-tracked spotlight / glow border (Aceternity "Glowing Effect")
**What:** A glow or conic-gradient border that follows the cursor across a card/grid. The premium dev-tool detail (Linear, Vercel docs).
**How:** track pointer → write CSS vars → paint with a gradient positioned by those vars → mask to the border.
```css
.card{position:relative; --x:50%; --y:50%;}
.card::before{
  content:""; position:absolute; inset:0; border-radius:inherit; padding:1px;
  background:radial-gradient(180px circle at var(--x) var(--y), oklch(0.62 0.19 285), transparent 60%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;       /* border-only */
  opacity:0; transition:opacity .2s;
}
.card:hover::before{opacity:1}
```
```js
card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();
  card.style.setProperty('--x',(e.clientX-r.left)+'px');
  card.style.setProperty('--y',(e.clientY-r.top)+'px');});
```

### 3b. 3D tilt + specular glare (Aceternity "3D Card")
**What:** Card rotates toward the cursor in 3D, optional moving highlight, text on raised `translateZ` planes (parallax).
```js
const r=el.getBoundingClientRect();
const rx=((e.clientY-r.top)/r.height-.5)*-10;   // deg
const ry=((e.clientX-r.left)/r.width -.5)* 10;
el.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
```
Wrap in `transform-style:preserve-3d`; give inner layers `transform:translateZ(40px)`.

### 3c. Magnetic / direction-aware
**What:** Buttons drift toward the cursor; shadow casts opposite to pointer (direction-aware box-shadow).
**Perf for all:** throttle with `requestAnimationFrame`, only animate `transform`/`opacity`, respect `prefers-reduced-motion`. **Fits the hub:** 3a (spotlight) pairs beautifully with a bento/card layout; 3b is flashier, use on ≤1 hero element.

---

## 4. Supporting trends seen across 2026 roundups
- **Kinetic / liquid gradients** — gradients that shift like thermal maps (not static).
- **Bold, saturated color comeback** — neon, high-contrast, after years of muted minimalism.
- **Bento grids** — modular varied-size cells (our G1).
- **Refined brutalism** — hard borders, offset shadows, big type (our G2).
- **Grainy-blur** — grain + heavy blur together = the defining "grainy blur" graphic of 2026.
- **Tactile soft-UI** — soft shadows, raised/inset elements that feel touchable (fintech/productivity).

---

## Recommendation for this portfolio
A minimal identity hub wants **restraint with one or two signature effects**, not all of them:
1. **Grain** — always on, low opacity. (keep)
2. **One glow** — either a static Gemini-style diffuse blob behind the name, OR a pointer-spotlight on the cards. Not both.
3. **Card motion** — spotlight border (3a) on the writing/bento cards is the highest taste-per-effort and reads "engineer who sweats details."
4. Skip 3D tilt unless we want one show-off hero element.

Palette is now open: warm-editorial, Linear-dark-violet, light-Swiss, or Gemini-multicolor. The effects above work in any of them.

---

### Sources
- Gezar — 11 Web Design Trends 2026: https://gezar.dk/en/blog/web-design-trends-2026
- Kittl — Grainy Blur effect 2026: https://www.kittl.com/blogs/grainy-blur-effect-stl/
- Figma — Web Design Trends 2026: https://www.figma.com/resource-library/web-design-trends/
- CSS-Zone — CSS Gradient trends 2026: https://css-zone.com/blog/css-gradient-trends-2026
- Google Design — Gemini AI visual design: https://design.google/library/gemini-ai-visual-design
- Android Headlines — new Gemini UI gradients/pulsing: https://www.androidheadlines.com/2026/05/google-gemini-new-ui-rollout-overlay-gradients-pulsing.html
- CSS-Tricks — Recreating Gmail's Gemini animation: https://css-tricks.com/recreating-gmails-google-gemini-animation/
- Aceternity UI — Glowing Effect: https://ui.aceternity.com/components/glowing-effect
- Aceternity UI — 3D Card Effect: https://ui.aceternity.com/components/3d-card-effect
- Prismic — CSS Hover Effects: https://prismic.io/blog/css-hover-effects
