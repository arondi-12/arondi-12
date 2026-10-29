# start.ng — landing page

A redesign of the [start.ng](https://start.ng) landing page: the same app, same copy, same
cream / ink / lime design language, rebuilt around **one scroll-driven piece of wordplay** and a
set of animated cards for the weekend drop.

Built with React + TypeScript + Vite. No runtime dependencies beyond React.

## The idea

The old version leaned on a lamp that followed the cursor. That gimmick is gone. In its place:

- **The headline is the interaction.** The hero pins to the viewport and the word
  `vibes.` rolls out of the line while `games.` rolls in, so `Good vibes.` becomes
  `Good games.` as you scroll. The lime highlighter then sweeps under the word, the
  supporting line re-writes itself from "games made by builders" to "188 free games",
  and the second call to action eases in. Scroll position drives four CSS variables
  (`--p`, `--reel`, `--mark`, `--more`) — one `requestAnimationFrame` listener, no
  per-frame React renders.
- **The cards animate on the same logic.** `24 hours` flips to `1 winner` (on hover, and
  once automatically when the card appears), the clock digits re-enter as they change and the
  day-progress rail fills; `Reach 59` counts up, lights 59 of 60 rooftop ticks and drops the
  score into a lime highlighter.
- **Five community games** get hand-built CSS covers with their own motion: a moving skyline,
  a danfo lane, jollof steam, a drifting ludo board, and Hangout's ping.
- **Halloween, quietly.** A thin banner, a pumpkin badge on the daily drop, a warm orange
  glow, and an orange tick on the leaderboard. Nothing scary, nothing loud.

All of it is scroll-, hover- and `IntersectionObserver`-driven, and every animation is switched
off under `prefers-reduced-motion` (the hero falls back to the static two-line headline).

## Content

The page reproduces the live app: nav, hero, games, the full A–Z roster of all 188 games
(extracted from start.ng/games), the four "Put it on start.ng" steps, About, the FAQ and the
footer.

## Scripts

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
```

## Deploying

The repo ships with a `vercel.json` for Vite, so Vercel needs no configuration:

```bash
npx vercel deploy --prod      # once you are logged in
# or, with no login:
npx vercel deploy --temporary
```

## Structure

```
src/
  components/    Nav, Hero, Ticker, Tournament, Games, Roster, Build, About, Footer
  hooks/         useHeroStage (scroll → CSS vars), useCountdown, useCountUp, useInView,
                 useReducedMotion
  data/          games.ts (featured five + ticker + board), roster.ts (all 188)
  styles/        base.css, hero.css, cards.css, sections.css
```
