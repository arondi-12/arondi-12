# [Bug] Pricing page “Compare different plans” CTA returns 404

## Summary

On `https://zedu.chat/pricing`, the “Compare different plans” link uses a relative href:

```tsx
<Link href={"client/settings/organisation/billing/all-plans"}>
```

From `/pricing`, that resolves to:

```text
https://zedu.chat/pricing/client/settings/organisation/billing/all-plans
```

which returns **404**.

## Steps to reproduce

1. Open `https://zedu.chat/pricing`.
2. Scroll to the bottom of the plan cards.
3. Click **Compare different plans**.

## Expected

The visitor sees the plan comparison table on the pricing page.

## Actual

The browser requests `/pricing/client/settings/organisation/billing/all-plans` and receives 404.

## Why it matters

This is the pricing page’s only path from “I am comparing plans” to the comparison table. It is a dead end for a logged-out visitor and a confusing detour for a logged-in one. The label also promises a comparison, not the billing flow.

## Suggested fix

- Point the CTA at `/pricing#compare-plans`.
- Add `id="compare-plans"` and `scroll-mt-24` to the comparison block so it lands below the sticky header.
- Keep the Pro card’s absolute `/client/settings/...` CTA unchanged.

## Verification

```text
$ curl -s -o /dev/null -w '%{http_code}' https://zedu.chat/pricing/client/settings/organisation/billing/all-plans
404
```

The live pricing HTML contains both the correct absolute Pro CTA and the broken relative comparison CTA.
