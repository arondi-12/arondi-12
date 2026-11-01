# start.ng — the playground edition

A whimsical recreation of the [start.ng](https://start.ng) landing page, built for the HNG
front-end task. The original site is rebuilt first — same sections, same copy, same palette — and
then dressed up as a sticker-covered playground, with one small game you can actually play without
leaving the page.

Built with React + TypeScript + Vite. No runtime dependencies beyond React.

## 1. The recreation (what came from start.ng)

Everything below is copied from the live site, not invented:

| Live site | Here |
| --- | --- |
| Nav: `Games / Tournament / Creators / Docs` + logo `start.ng` | same, with a sticky paper nav |
| Eyebrow “Big imagination. Played everywhere.” | same |
| `Good vibes. / Good games.` (second line lime-marked) | same, marker drawn by hand |
| Hero lead: games made by builders, each at its own address | same, with one extra clause |
| “Play now” + “See all 188 games →” | same |
| “Games from the community” | same heading, five real games |
| “Every game on start.ng, A to Z (188)” | all 188 entries, from `start.ng/games` |
| “Got a game? Put it on start.ng” + the four steps | same wording, `code` styling kept |
| About start.ng copy + all six Questions | same wording |
| Footer columns: Play / Make games / About, © 2026 | same |

Palette and type are the original's own tokens: `--bg #f6f5ee`, `--card #fffefa`, `--ink #292a23`,
`--muted #6b6c63`, `--line #e4e2d6`, `--lime #d8fd71`, and the hard offset shadow
(`box-shadow: 6px 8px 0 var(--lime)`) that the real site uses on hover.

## 2. The whimsy layer

The rule was: playful enough to notice in two seconds, restrained enough to stay readable.

- **Hand-drawn everything.** Uneven border radii (`26px 30px 24px 28px / 28px 24px 30px 26px`),
  washi tape on the corners, sticker labels at a slight tilt, and a lime marker that is a wobbly
  SVG path rather than a rectangle.
- **Two typefaces with jobs.** `Fredoka` for display (round, friendly), `DM Sans` for reading, and
  `Caveat` only for the margin notes ("one of them is playable right here").
- **Paper, not screen.** A 24px dot grid plus a very faint SVG grain overlay on `body`.
- **Letters that pop in.** The headline is split per character and staggered; the marker sweeps
  under "Good games." after it lands.
- **Cards behave like cards.** The five game covers tilt, straighten and lift on hover; the shelf
  cards and stat stickers sit at odd angles until you pick them up.
- **Doodles with a purpose.** A star, a squiggle and an arrow that points at the playable bit.
- **A mascot.** A danfo bus with googly eyes that follow the pointer, parked bottom-right. Click it
  and it honks (Web Audio, two-tone) and changes its line. There is a persisted sound switch.
- **A real reward.** "Copy the link" throws paper confetti across the page.

## 3. The functional bits

This is not a static poster. Every interactive thing below works:

1. **Danfo Dash** (`#play`) — a complete three-lane dodge game:
   - endless obstacles with a speed ramp, coins in your lane worth two points, collision detection;
   - keyboard (`←`/`→`, `A`/`D`, `Space` to start, `Esc` to pause), on-screen lane buttons, and
     tap-left / tap-right on the road;
   - auto-pause when the tab is hidden, so a background tab never costs you a run;
   - personal best in `localStorage`, shared live with the hero card (`useSyncExternalStore`), so
     the "Your shelf" card fills in the moment you set a record.
2. **Live daily countdown** — the top strip, hero card and tournament clock all tick off the same
   `useCountdown` hook, with a day-progress rail.
3. **Search the roster** — filters all 188 games by name or creator as you type, with a live count
   and a friendly empty state.
4. **Surprise me** — picks a random game, clears the filter, scrolls it into view and flashes it.
5. **Share** — copy link (with confetti + toast), WhatsApp and X intents.
6. **Mascot honk** with a persisted mute switch, plus a mobile nav drawer and sticky nav state.

## 4. Accessibility & performance notes

- Semantic landmarks, one `h1`, a skip link, `aria-label`s on icon-only buttons, and visible
  `:focus-visible` rings.
- The headline's per-letter spans are `aria-hidden`; a single `sr-only` line carries the real text.
- `prefers-reduced-motion` disables the marquee, the letter pops, the marker sweep, the road
  animation and the mascot's eye tracking — the game stays playable.
- All art is CSS/SVG, so there are no images to load or lazy-load.
- Build output: ~43 kB CSS and ~192 kB JS before gzip (60 kB gzipped), no extra dependencies.

## 5. Scripts

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck (tsc --noEmit) + production build to dist/
npm run preview    # serve the production build
npm run typecheck  # types only
```

## 6. Deploying to Vercel

`vercel.json` already sets the framework, the build command, the output directory and the
single-page rewrite, so there is nothing to configure in the dashboard.

**Fastest (CLI):**

```bash
cd startng
npx vercel deploy --prod      # first run asks you to log in, then links the project
```

**No account yet:** `npx vercel deploy --temporary` publishes a claimable deployment that stays up
for an hour; claim it from the printed link to keep the URL.

**GitHub import (dashboard):**

1. Push this repo to GitHub (work is on branch `cline/t2weyn9q`).
2. In Vercel: *Add New → Project → Import* the repo.
3. Set **Root Directory** to `startng`.
4. Framework preset: **Vite**. Build `npm run build`, output `dist`. Node 22 (pinned in
   `package.json`).
5. Deploy. Every later push redeploys.

## 7. Structure

```
startng/
  index.html              fonts, SEO + OG/Twitter meta, JSON-LD
  public/                 favicon.svg, og.png, robots.txt
  src/
    App.tsx               page order
    components/
      TapeStrip, Nav, Hero, StickerBoard, Marquee,
      DanfoDash, GameShelf, RosterShelf, Tournament,
      BuildSteps, AboutFaq, ShareBand, SiteFooter,
      Mascot, Confetti, Doodles, Reveal
    data/                 games.ts (featured five) + roster.ts (all 188)
    hooks/                useCountdown, useInView, useReducedMotion, useBestScore
    styles/               tokens.css, hero.css, game.css, shelf.css, sections.css
```

## 8. Notes and limits

- Game links point at the live `start.ng` addresses; the roster reflects the 188 entries published
  on `start.ng/games` when this was built.
- This is a design concept for the HNG community, not an official start.ng build. The footer says
  so, and the copy makes no claim to be the production site.
- Danfo Dash is an original demo written for this page — it is deliberately *not* presented as one
  of the 188 community games.
- No analytics, no cookies, no tracking. The only stored values are your best score and whether
  the mascot is muted.
