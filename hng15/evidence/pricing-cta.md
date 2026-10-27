# Evidence: pricing “Compare different plans” CTA (marketing fix)

**Branch:** `fix/pricing-compare-cta`
**Commit:** `858cc46` (`fix(marketing): point compare-plans CTA at the pricing comparison`)
**Base:** `central-staging` at `0f5008`

## The defect (live)

The CTA in `PricingSection` was a relative link:

```tsx
<Link href={"client/settings/organisation/billing/all-plans"}>Compare different plans</Link>
```

On `https://zedu.chat/pricing` that resolves to:

```text
https://zedu.chat/pricing/client/settings/organisation/billing/all-plans
```

Measured on 27 Oct 2026:

```text
$ curl -s -o /dev/null -w '%{http_code}' https://zedu.chat/pricing/client/settings/organisation/billing/all-plans
404
```

The live pricing HTML contains both a correct absolute Pro CTA and the broken relative comparison CTA:

```html
href="/client/settings/organisation/billing/all-plans"   <!-- Pro card, correct -->
href="client/settings/organisation/billing/all-plans"    <!-- Compare CTA, broken -->
```

The label also promises a comparison, while the target was the billing flow.

## The fix

- `PricingSection.tsx`: `href="/pricing#compare-plans"`.
- `pricing/page.tsx`: the comparison block gets `id="compare-plans"` and `scroll-mt-24`.

## Verification (local dev, 27 Oct 2026)

Built `/pricing` HTML:

```html
<a class="group flex items-center gap-2 font-semibold text-primary-500" href="/pricing#compare-plans">Compare different plans …</a>
...
<div id="compare-plans" class="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12 space-y-6 relative scroll-mt-24">
```

The homepage still links to `/pricing#compare-plans`, which is correct because the table lives on `/pricing`.

## Patch apply check

A fresh clone of `central-staging` accepted the patch with `git am`:

```text
PRICING_PATCH_APPLIED
103491a fix(marketing): point compare-plans CTA at the pricing comparison
pricing#compare-plans
id="compare-plans"
```

## Checks

```text
$ pnpm exec prettier --check 'src/app/(homepage)/pricing/page.tsx' 'src/app/(homepage)/_components/home/PricingSection.tsx'
All matched files use Prettier code style!

$ pnpm exec eslint 'src/app/(homepage)/pricing/page.tsx' 'src/app/(homepage)/_components/home/PricingSection.tsx'
(no output; exit 0)
```

## What is not verified

- The change is not live on `zedu.chat` until the PR is merged into `central-staging` and promoted through `staging` to `main`.
- A real click-through in a browser (the local dev HTML proves the href and anchor).
