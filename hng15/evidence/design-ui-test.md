# Evidence: Ziki Flight Deck live design

**Live URL:** https://raw.githack.com/arondi-12/arondi-12/gh-pages/index.html
**Single-file URL:** https://raw.githack.com/arondi-12/arondi-12/89b6774d01ffd92fb9d04b3a413c2871fa78212d/standalone.html
**Source:** `hng15/design/` (also on the `gh-pages` branch of `arondi-12/arondi-12`)

## Serving check (27 Oct 2026)

```text
GET index.html  → 200 text/html; charset=utf-8 (21,328 bytes)
GET styles.css  → 200 text/css; charset=utf-8
GET app.js      → 200 application/javascript; charset=utf-8
GET standalone  → 200 text/html; charset=utf-8 (58,241 bytes)
```

The live `styles.css` and `app.js` were diffed against the local files: identical.

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
