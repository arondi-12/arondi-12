# fix(marketing): make the “Compare different plans” CTA reach the comparison

## What were you told to do?

Fix the product-marketing CTA on the pricing page. “Compare different plans” used a relative href:

```tsx
href={"client/settings/organisation/billing/all-plans"}
```

From `/pricing`, that resolves to `/pricing/client/settings/organisation/billing/all-plans`, which returns **404**. The label also promises a comparison, but the target was billing.

## What did you do?

- Pointed the CTA at `/pricing#compare-plans`.
- Gave the comparison table block on `/pricing` `id="compare-plans"` and `scroll-mt-24`, so the link lands below the sticky header.
- Left the Pro card’s `/client/settings/...` CTA unchanged; that one is absolute and intentional.

## Why this is a marketing fix

The CTA is the pricing page’s only path from “I am comparing plans” to the actual comparison. Today it is a dead end for a logged-out visitor and a confusing detour for a logged-in one. The fix keeps the visitor on the page, at the evidence they asked for, and preserves the existing sign-up and sales paths.

## Verification

- Live before: `curl -s -o /dev/null -w '%{http_code}' https://zedu.chat/pricing/client/settings/organisation/billing/all-plans` → `404`.
- Built after: `/pricing` HTML contains `href="/pricing#compare-plans"` and `id="compare-plans"`.
- Homepage still links to `/pricing#compare-plans`; there is no comparison table on the homepage, so the navigation is correct.
- `pnpm exec prettier --check` and `pnpm exec eslint` on both changed files — pass.

## Risk and rollback

Very low. Two presentational files, no API or data change. Rollback is a one-commit revert.

## Checklist

- [x] My code follows the code style of this project.
- [x] This PR does not contain plagiarized content.
- [x] The title and description explain the approach.
- [x] I am targeting **`central-staging`** (the base used by current open PRs; the template still says `dev`).
- [x] My commit message follows the repository's conventional format.
- [x] The changed files pass Prettier and ESLint.
- [x] I am only changing the two files needed for this fix.

## Screenshots / recordings

No screenshot needed for a link target; the before/after HTML and curl evidence are in `hng15/evidence/pricing-cta.md`.
