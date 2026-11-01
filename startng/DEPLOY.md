# Deploying the start.ng playground

The app is a plain Vite build with no environment variables, no API keys and no server code, so
Vercel needs nothing beyond the committed `vercel.json`.

## Live right now (temporary, claim it)

```
https://express-oxygen-x1bvbi8.tmp.now
```

That URL was published with `npx vercel deploy --temporary` from this folder. **It expires 60
minutes after the deploy** unless it is claimed. Claim it (one click, no card) here:

```
https://vercel.com/claim-deployment?code=5f865aef-8c02-43cb-933e-0926fd30d62f
```

Claiming turns the temporary deployment into a permanent project on your account; after that the
same URL (or the clean project URL) keeps serving this build.

## Re-deploy it yourself

```bash
cd startng
npm install
npx vercel deploy --prod        # logged in: permanent, custom domain ready
npx vercel deploy --temporary   # logged out: 60-minute, claimable deployment
```

## Import from GitHub (permanent, auto-deploys on push)

1. Push the repo (work is on branch `cline/t2weyn9q`).
2. Vercel → **Add New… → Project → Import** `arondi-12/arondi-12`.
3. **Root Directory:** `startng` (important — the repo root also holds unrelated folders).
4. Framework preset: **Vite** — build `npm run build`, output `dist`. Vercel reads Node 22 from
   `package.json`.
5. Deploy. Every push to the connected branch redeploys.

## What `vercel.json` already does

- `framework: vite`, `buildCommand: npm run build`, `outputDirectory: dist`
- `cleanUrls: true` plus the SPA rewrite to `/index.html`, so `/#play` deep links keep working
- two small security headers (`X-Content-Type-Options`, `Referrer-Policy`)

## Post-deploy checklist

- [ ] `https://<url>/` renders the hero, the danfo mascot and the lime marquee.
- [ ] The countdown in the top strip ticks.
- [ ] `#play` — press **Start the engine**, dodge with `←`/`→`, crash, reload: the hero card and
      the game both show the saved best score.
- [ ] `#roster` — typing filters all 188 games; **Surprise me** scrolls to a random one.
- [ ] `#play` and `#shelf` links point at the live `start.ng` addresses.
- [ ] `/og.png`, `/favicon.svg`, `/robots.txt` all return 200.
