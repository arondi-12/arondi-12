# start.ng — landing page

A redesign of the [start.ng](https://start.ng) landing page: the same app, same copy, same
cream / ink / lime design language, rebuilt around **one scroll-driven piece of wordplay** and a
set of animated cards for the weekend drop.

Built with React + TypeScript + Vite. No runtime dependencies beyond React.

## The idea

The old version leaned on a lamp that followed the cursor, and a headline that only made sense
while scrolling. Both are gone. Now:

- **The headline focuses in.** Each word of `Good vibes. Good games.` arrives from a soft blur
  (15px down to 0) with a 95ms stagger, a barely-there scale pull, then the lime highlighter is
  drawn under the second line. One orchestrated moment on load — nothing tied to scroll position.
- **A deck of live cards sits beside it.** Three cards, loose on a pile at slight angles, each one
  straightening, lifting and throwing a hard lime shadow on hover or keyboard focus. They are not
  decoration: the tournament clock really ticks (with each digit re-entering as it changes), the
  day-progress rail really fills, `24 hours` flips to `1 winner`, and the leaderboard is the
  weekend board.
- **The same focus-in language carries down the page.** Section headings and the closing call to
  action reveal with a small blur, game cards lift with their own animated CSS covers (moving
  skyline, danfo lane, jollof steam, drifting ludo board, Hangout ping), and the roster, steps and
  FAQ behave like normal, fast UI.
- **Halloween, quietly.** A thin banner, a pumpkin badge on the daily drop, a warm orange glow, an
  orange tick on the leaderboard. Nothing scary, nothing loud.

Everything is CSS-first: one `IntersectionObserver` per block, hover/focus states instead of
scroll listeners, and every animation is switched off under `prefers-reduced-motion`.

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

The repo ships with a `vercel.json` for Vite (framework preset, `dist` output, SPA rewrite),
plus `"engines": { "node": "22.x" }`, so Vercel needs no configuration.

### Permanent deploy via the Vercel dashboard (recommended)

1. <https://vercel.com/new> → **Import Git Repository** → `arondi-12/arondi-12`
2. Set **Root Directory** to `startng` (framework auto-detects as Vite)
3. Deploy. The first build may fail if Vercel picks the repo's default branch, which does not
   contain the app yet — that is expected.
4. **Project → Settings → Git → Production Branch** → `cline/1zvq1czq` → **Save**
5. **Deployments → ⋯ → Redeploy** (uncheck "use existing build cache")

From then on every push to `cline/1zvq1czq` deploys to production automatically, and every other
branch gets a preview URL.

### CLI

```bash
npx vercel deploy --prod      # once you are logged in
npx vercel deploy --temporary # no login; link expires in 60 minutes
```


## Structure

```
src/
  components/    Nav, Hero, HeroDeck, Clock, Ticker, Weekend, Games, Roster, Build, About, Footer
  hooks/         useCountdown, useInView, useReducedMotion
  data/          games.ts (featured five + ticker + board), roster.ts (all 188)
  styles/        base.css, hero.css, deck.css, cards.css, sections.css
```
