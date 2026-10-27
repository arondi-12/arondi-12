# Evidence: Ziki Flight Deck live design

**Live URL:** https://snappy-reef-7nrq00k.tmp.now
**Claim link (required within 60 minutes):** https://vercel.com/claim-deployment?code=eaa5363d-308c-4b89-acf7-c5ec62bf5ac3
**Single-file URL:** https://snappy-reef-7nrq00k.tmp.now/standalone.html
**Source:** `hng15/design/` (also on the `gh-pages` branch of `arondi-12/arondi-12`)

## Why Vercel instead of githack

`raw.githack.com` now shows a “One more step / rawgit.hack does not review third-party content” interstitial. That is not acceptable for an assessor link. The Vercel deployment serves the same files directly, with no interstitial.

## Serving check (27 Oct 2026)

```text
GET /                → 200 text/html; charset=utf-8 (21,328 bytes)
GET /styles.css      → 200 text/css; charset=utf-8 (27,926 bytes)
GET /app.js          → 200 application/javascript; charset=utf-8 (9,028 bytes)
GET /standalone.html → 200 text/html; charset=utf-8 (58,241 bytes)
```

`GET /` returns the Flight Deck page title directly:

```html
<title>Ziki Flight Deck — give every agent a flight plan</title>
```

## Deployment lifetime

Vercel’s unauthenticated `--temporary` deployments expire after **60 minutes**. The claim link above makes this deployment permanent. If it expires first:

```bash
cd hng15/design
npx -y vercel@latest deploy --temporary --yes
# then open the new claim link printed by the command
```

For a permanent deployment without claiming, import the `gh-pages` branch into Vercel or Netlify — `vercel.json` and `netlify.toml` are already in the branch. See `DEPLOY.md`.

## Interaction test

The page script was loaded into JSDOM with the real `index.html` and exercised end to end:

```text
$ node test.js
DESIGN_UI_OK
```

Covered:

- initial flight ZD-114 and hidden report;
- **Clear for takeoff** → status becomes “In flight”, land button appears;
- **Land & read report** → report opens with the pricing CTA evidence;
- **Approve** → status becomes “Approved”, receipt confirmation appears;
- switching to ZD-088 keeps that flight’s own landed state;
- **Add constraint** → inline editor, save, and constraint text appears;
- **Reset demo** → returns to the initial holding state.

## Manual checks

- HTML parses without errors; every `href="#…"` anchor has a matching `id`.
- JS passes `node --check`.
- Layout is responsive at 1240, 900, 860, 650, 560, and 540px breakpoints (CSS media queries); the demo board and plan grid collapse to one column on phones.
- `prefers-reduced-motion` disables the drifting clouds, bobbing plane, stamp entrance, and pulse.
- Buttons are real `<button>` elements, the status is text as well as colour, and the constraint editor has a label and focus styles.

## Limitation

A pixel-level browser screenshot was not produced in this environment: the headless Chromium download is blocked by missing host libraries and there is no `sudo` to install them. The interaction logic and serving checks above were run directly. Open the live URL on a phone and desktop before submitting if you want a visual confirmation.
