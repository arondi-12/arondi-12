# HNG15 Individual Task — submission pack

**Task:** improve human–agent interaction on Ziki; make a whimsical design live; land one major fix and one product-marketing fix on Zedu.

This folder is deliberately organised as evidence, not as a pile of files. Every claim below is either linked to something you can open, or labelled as still pending.

---

## 1. Requirement → evidence

| # | Requirement | What is here | Status |
|---|---|---|---|
| 1 | Propose an improvement to how Ziki lets humans and agents interact | [`proposal/ziki-flight-plan.md`](./proposal/ziki-flight-plan.md) — a specific three-artifact proposal (flight plan, tower strip, landing report), with a worked example, lifecycle fit, metrics, risks, rollout, and field schema | **Done** |
| 2 | Whimsical design for Ziki, Start.ng, or Zedu, implemented on an online service | **Live:** https://raw.githack.com/arondi-12/arondi-12/gh-pages/index.html — an interactive “Ziki Flight Deck” prototype (responsive, keyboard-friendly, reduced-motion aware). Source: [`design/`](./design/) | **Live** |
| 3 | One major fix into production on Zedu | **Stored XSS in `AppleEmojiText`** (issue [#1058](https://github.com/zeduchat/zedu-fe/issues/1058)): remove `dangerouslySetInnerHTML`, tokenise emoji, escape text. Patch + PR body + before/after proof: [`patches/0001…`](./patches/0001-fix-apple-emoji-stored-xss.patch), [`pr-bodies/…`](./pr-bodies/zedu-major-fix-emoji-xss.md), [`evidence/…`](./evidence/emoji-xss-before-after.md) | **Patch verified; PR + merge pending your GitHub account** |
| 4 | One marketing fix (product related) live on Zedu | **Broken pricing CTA**: “Compare different plans” resolved to `/pricing/client/...` and returned **404**. Fix makes it `/pricing#compare-plans` with a scroll anchor. Patch + PR body + live 404 proof: [`patches/0002…`](./patches/0002-fix-pricing-compare-cta.patch), [`pr-bodies/…`](./pr-bodies/zedu-marketing-pricing-cta.md), [`evidence/…`](./evidence/pricing-cta.md) | **Patch verified; PR + merge pending your GitHub account** |

> **Honest boundary.** This sandbox can read the public `zeduchat/zedu-fe` repo but cannot push to it or merge. The two fixes are implemented, applied to fresh clones of `central-staging`, linted, and behaviour-checked. Shipping them is the one step that needs your fork/maintainer access. Use [`scripts/open-zedu-prs.sh`](./scripts/open-zedu-prs.sh) — it forks, applies both patches, pushes, and opens the two PRs for you.

---

## 2. The live design

**URL:** https://raw.githack.com/arondi-12/arondi-12/gh-pages/index.html

- Works on phone and desktop; no sign-in; no external fonts or images.
- The interactive demo lets you clear a flight, add a constraint, land it, read the report, and approve it.
- The design is a prototype of the proposal, not a mockup of a different product. The three artifacts on the page are the three artifacts in the document.
- `prefers-reduced-motion` is respected; controls are real buttons with visible focus; status is text as well as colour.

**Cleaner URL (one click, optional):** in `arondi-12/arondi-12` → **Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` / root → Save**. GitHub will serve `https://arondi-12.github.io/arondi-12/`. The `gh-pages` branch already contains only the site.

**Why this is whimsical without being decorative-only.** The metaphor does the explaining: a flight plan (consent), a tower strip (legibility), a landing report (proof). The paper-plane/tower illustration, ticket stubs, stamps, and departure board are there to make the interaction model memorable, not to hide it.

---

## 3. The two Zedu fixes

Both branches are cut from **`central-staging`**, the base used by the current open PR (#1056). The repository template still says `dev`, but there is no `dev` branch; `central-staging` is the real integration branch.

### 3.1 Major fix — stored XSS in emoji reactions (#1058)

**Impact.** Any user could send a reaction containing an emoji plus HTML. `AppleEmojiText` rendered the whole string with `dangerouslySetInnerHTML`, so `<img src=x onerror=alert(1)>` executed in every viewer’s browser: a stored XSS in channels, threads, pinned messages, and replies.

**Fix.** Added `tokenizeAppleEmoji`, escaped the `alt`/`src` attributes of the legacy string helper, and rewrote `AppleEmojiText` to render React text nodes plus `<img>` elements. `dangerouslySetInnerHTML` is gone.

**Proof.** Server-rendered before/after HTML, patch-apply check, Prettier/ESLint, and a typecheck note: [`evidence/emoji-xss-before-after.md`](./evidence/emoji-xss-before-after.md).

**Commit:** `6a37b65` on `fix/apple-emoji-stored-xss` (patch `0001`).

### 3.2 Marketing fix — pricing CTA dead end

**Impact.** On `https://zedu.chat/pricing`, “Compare different plans” resolved to `/pricing/client/settings/organisation/billing/all-plans` and returned **404**. The only comparison CTA on the pricing page was a dead end for logged-out visitors and a detour for logged-in ones.

**Fix.** Link to `/pricing#compare-plans`; add `id="compare-plans"` and `scroll-mt-24` to the comparison block so it lands below the sticky header.

**Proof.** Live `curl` 404, built HTML with the new href and anchor, Prettier/ESLint, patch-apply check: [`evidence/pricing-cta.md`](./evidence/pricing-cta.md).

**Commit:** `858cc46` on `fix/pricing-compare-cta` (patch `0002`).

---

## 4. Ship it (5 minutes)

```bash
# 1. Authenticate as the account that will own the PRs
gh auth login

# 2. From this folder, fork + apply both patches + open both PRs
./scripts/open-zedu-prs.sh

# 3. Ask a maintainer to review/merge into central-staging
# 4. After promotion to main, verify the live pages
```

The script prints the two PR URLs. Add them to the “Status” column above, then do the live verification:

```bash
# Marketing fix: old URL must still be 404, new link must exist on /pricing
curl -s -o /dev/null -w '%{http_code}\n' \
  https://zedu.chat/pricing/client/settings/organisation/billing/all-plans
curl -s https://zedu.chat/pricing | grep -o 'href="/pricing#compare-plans"'

# Major fix: after deployment, a reaction containing
#   Hello <img src=x onerror=alert(1)> 🎉
# must show the payload as text, not execute it, and the emoji must still render.
```

**What “production” requires beyond the PR:** a maintainer merge into `central-staging`, promotion to `staging`, then `main`, where `.github/workflows/deploy-main.yml` restarts the production service. The fix is not live until that chain completes. Do not claim it is.


---

## 5. Verification performed here

| Check | Result |
|---|---|
| Patches apply to a fresh `central-staging` clone with `git am` | Pass (both) |
| Prettier on changed files | Pass (both) |
| ESLint on changed files | Pass (both) |
| SSR before/after for the XSS payload | Before: live HTML; after: escaped text + emoji image |
| Local `/pricing` HTML | `href="/pricing#compare-plans"` and `id="compare-plans"` present |
| Live old CTA URL | `404` |
| `pnpm check-types` | 2 pre-existing errors in `agents/[id]/page.tsx`; none in changed files |
| `pnpm build` | Compilation succeeds; page-data collection needs private env vars not present here |
| Design JS syntax / HTML parse | Pass; CSS/JS served with correct content types from the live URL |
| Design interactions (jsdom) | Pass: clear → land → approve → switch flight → add constraint → reset |

Reproduce the local checks:

```bash
# From a fresh clone of central-staging:
git am -3 ../patches/0001-fix-apple-emoji-stored-xss.patch
pnpm install
pnpm exec prettier --check <changed files>
pnpm exec eslint <changed files>
```

---

## 6. Three-minute walkthrough for the assessor

1. **Open the proposal** and read §4 (the three artifacts) and §5 (the pricing example). The proposal is specific to Ziki’s actual bid → offer → delivery → two-verdict review loop; it does not invent a new platform.
2. **Open the live design.** Clear ZD-114, add a constraint, land it, and approve the report. Point out that the same three artifacts appear in the document.
3. **Open the XSS evidence.** Show the before/after HTML: the payload is live HTML before, escaped text after, and the emoji still renders. This is the major fix.
4. **Open the pricing evidence.** Show the live 404 and the new href/anchor. This is the marketing fix.
5. **Open the two PRs** (after running the script) and show the base branch, the diff, and the checklist.

---

## 7. File map

```text
hng15/
├── README.md                              ← this file
├── proposal/
│   └── ziki-flight-plan.md                ← the human–agent interaction proposal
├── design/
│   ├── index.html                         ← live prototype
│   ├── styles.css
│   └── app.js
├── patches/
│   ├── 0001-fix-apple-emoji-stored-xss.patch
│   └── 0002-fix-pricing-compare-cta.patch
├── pr-bodies/
│   ├── zedu-major-fix-emoji-xss.md
│   └── zedu-marketing-pricing-cta.md
├── evidence/
│   ├── emoji-xss-before-after.md
│   └── pricing-cta.md
└── scripts/
    └── open-zedu-prs.sh
```

---

## 8. What is deliberately not claimed

- The fixes are **not yet live on `zedu.chat`**. The PRs are not open yet because this sandbox cannot push to `zeduchat/zedu-fe`. The patch, evidence, and one-command shipping script are complete.
- The pilot metrics in the proposal are **targets/hypotheses**, not results. No user interviews were run; that is Phase 0 of the rollout.
- The design is a **concept prototype**, not an official Ziki product. It does not use Ziki’s private data or imply endorsement.
- The emoji fix addresses the reported `AppleEmojiText` vector. The message renderer’s use of `rehype-raw` is a separate hardening item and is explicitly out of scope in the PR.

