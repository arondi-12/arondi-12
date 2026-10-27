# HNG15 Individual Task — submission copy

**Name:** David Ariwi
**Task:** Human–agent interaction improvement + whimsical design + Zedu major fix + Zedu marketing fix

## 1. Human–agent interaction improvement: Ziki Flight Plan

I propose **Ziki Flight Plan**, three small artifacts inside Ziki’s existing task loop:

- **Flight plan (before):** the agent drafts a one-screen contract — destination, in/out of scope, evidence, stop conditions, ETA. The human clears it, edits it, or takes over.
- **Tower strip (during):** one status line per task (on track / holding / needs a human), with a one-tap **hold** and a **add constraint** control that steers the work without opening a revision round.
- **Landing report (after):** the delivery leads with what changed, how it was checked, what was assumed, the rollback, and the single decision the human needs to make.

It fits the real Ziki lifecycle (idea → task → bid → offer → delivery → two-verdict review) instead of replacing it. The proposal includes a worked pricing-CTA example, success measures and guardrails, risks, a four-phase rollout, and the field schema.

**Read:** `hng15/proposal/ziki-flight-plan.md`

## 2. Whimsical design: Ziki Flight Deck

**Live:** https://raw.githack.com/arondi-12/arondi-12/gh-pages/index.html

An interactive control-tower prototype of the proposal: clear a flight, add a constraint, land it, read the landing report, approve it. Responsive, keyboard-friendly, reduced-motion aware, no external assets.

## 3. Major fix on Zedu: stored XSS in emoji reactions (#1058)

`AppleEmojiText` sent user-controlled reaction text through `dangerouslySetInnerHTML` whenever it contained an emoji. A reaction like `Hello <img src=x onerror=alert(1)> 🎉` executed script in every viewer’s browser. The fix adds a real tokenizer, escapes legacy image attributes, and renders React text nodes plus emoji `<img>` elements. `dangerouslySetInnerHTML` is gone.

**Before:** `<span>Hello <img src=x onerror="alert(1)"> …</span>` (live HTML)
**After:** `<span>Hello &lt;img src=x onerror=&quot;alert(1)&quot;&gt; …</span>` (escaped; emoji still renders)

**PR:** `<paste PR URL>`
**Patch + evidence:** `hng15/patches/0001-…`, `hng15/evidence/emoji-xss-before-after.md`

## 4. Marketing fix on Zedu: pricing CTA

The “Compare different plans” CTA on `https://zedu.chat/pricing` used a relative href and resolved to `/pricing/client/settings/organisation/billing/all-plans`, which returns **404**. The fix points it at `/pricing#compare-plans` and gives the comparison table a `scroll-mt` anchor.

**PR:** `<paste PR URL>`
**Patch + evidence:** `hng15/patches/0002-…`, `hng15/evidence/pricing-cta.md`

## 5. Verification and honest status

- Both patches apply cleanly to a fresh `central-staging` clone.
- Prettier and ESLint pass for all changed files.
- The XSS payload was server-rendered before and after the fix; the before is live HTML, the after is escaped.
- The live pricing CTA returns 404 today; the fixed local build contains the new href and anchor.
- The two fixes are **not live yet**: they need a maintainer merge into `central-staging`, promotion to `staging`, then `main`, and the production deploy. I will not claim otherwise.

## 6. Links

- Proposal: `hng15/proposal/ziki-flight-plan.md`
- Live design: https://raw.githack.com/arondi-12/arondi-12/gh-pages/index.html
- Zedu issue: https://github.com/zeduchat/zedu-fe/issues/1058
- Submission pack: `hng15/README.md`
