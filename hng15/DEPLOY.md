# Deploying the Ziki Flight Deck

The site is plain HTML/CSS/JS. There is no build step.

## Current Vercel deployment

**Live URL:** https://snappy-reef-7nrq00k.tmp.now

**Claim it (required to keep it):**
https://vercel.com/claim-deployment?code=eaa5363d-308c-4b89-acf7-c5ec62bf5ac3

Vercel temporary deployments expire **60 minutes** after creation. Claiming is free and keeps this exact URL live. If it expires before you claim it, redeploy with the command below and claim the new link.

```bash
cd hng15/design
npx -y vercel@latest deploy --temporary --yes
```

Do **not** use the `raw.githack.com` URL for submission: it now shows a “One more step / rawgit.hack does not review third-party content” interstitial before the page. The Vercel URL serves the page directly.

## Permanent Vercel deploy (recommended)

### Claim the temporary deployment
Open the claim link above, sign in with GitHub, and claim it. That is the fastest path to a permanent `*.vercel.app` URL.

### Or deploy from the `gh-pages` branch
The branch contains only `index.html`, `styles.css`, `app.js`, `standalone.html`, `vercel.json`, and `netlify.toml`.

1. Go to https://vercel.com/new
2. Import `arondi-12/arondi-12`.
3. Set **Production Branch** to `gh-pages` (Settings → Git after import).
4. Framework preset: **Other**. Root directory: blank. Build command: blank. Output directory: `.`.
5. Deploy.

Or with the CLI:

```bash
git clone -b gh-pages https://github.com/arondi-12/arondi-12.git ziki-flight-deck
cd ziki-flight-deck
npx -y vercel@latest login
npx -y vercel@latest --prod
```

## Netlify deploy

```bash
git clone -b gh-pages https://github.com/arondi-12/arondi-12.git ziki-flight-deck
cd ziki-flight-deck
npx -y netlify-cli@latest login
npx -y netlify-cli@latest deploy --prod --dir=.
```

Or in the Netlify UI: **Add new site → Import an existing project → GitHub → `arondi-12/arondi-12` → branch `gh-pages`**. Build command: `echo 'Static site'`; publish directory: `.`.

`netlify.toml` already sets the publish directory and static build command.

## GitHub Pages (no third-party interstitial)

Repo **Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` / root → Save**. GitHub serves it at `https://arondi-12.github.io/arondi-12/`.

## Verify

```bash
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' https://YOUR-DEPLOYMENT/
curl -s https://YOUR-DEPLOYMENT/ | grep -o '<title>[^<]*</title>'
```

Expected: `200 text/html` and `Ziki Flight Deck — give every agent a flight plan`.
