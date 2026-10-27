# Before you submit — checklist

The work is done; three things need your account.

## 1. Open the PRs

```bash
gh auth login
cd hng15
./scripts/open-zedu-prs.sh
```

- [ ] PR 1 opened: `fix(security): render Apple emoji without raw HTML injection` → `central-staging`
- [ ] PR 2 opened: `fix(marketing): make the Compare different plans CTA reach the comparison` → `central-staging`
- [ ] (Optional) Open the pricing issue first using `pr-bodies/issue-pricing-cta.md`, then link it in PR 2.
- [ ] Paste both PR URLs into `README.md` (section 1, status column) and into `SUBMISSION.md`.

## 2. Get them merged and deployed

- [ ] Ask a maintainer to review. Use the message in §5 below.
- [ ] Merge into `central-staging`, then promote to `staging`, then `main`.
- [ ] Confirm the production deploy workflow completed (`.github/workflows/deploy-main.yml`).
- [ ] Marketing fix live: `https://zedu.chat/pricing` has `href="/pricing#compare-plans"` and the CTA scrolls to the table.
- [ ] Major fix live: send a reaction with `Hello <img src=x onerror=alert(1)> 🎉` in a test channel. It must render as text and the emoji must still show. Delete the test message.

## 3. Finish the presentation

- [ ] Enable GitHub Pages (optional, cleaner URL): repo **Settings → Pages → Deploy from branch → `gh-pages` / root**.
- [ ] Open the live design on a phone once; check the demo buttons and the constraint editor.
- [ ] Record a 2–3 minute walkthrough: proposal §4–5 → live demo → XSS before/after → pricing 404 → PR diffs.
- [ ] Paste `SUBMISSION.md` into the HNG submission form and replace the two PR placeholders.
- [ ] Do not claim the fixes are live until the production deploy has finished.

## 4. If a maintainer asks for changes

- The patches are ordinary commits; amend them on your fork, not with a force-push to someone else’s branch.
- Keep the base at `central-staging` unless a maintainer says otherwise.
- If the XSS issue is already claimed by another contributor, say so and offer the patch as a reference; do not open a duplicate PR.

## 5. Ready-to-send maintainer message

> Hi — I’ve prepared two small, tested fixes against `central-staging`:
>
> 1. **Security (#1058):** `AppleEmojiText` renders user-controlled reaction text through `dangerouslySetInnerHTML`; the PR removes it, adds an emoji tokenizer, and escapes text. Before/after SSR proof is in the PR.
> 2. **Marketing:** the “Compare different plans” CTA on `/pricing` currently resolves to `/pricing/client/...` and returns 404; the PR points it at `/pricing#compare-plans` and adds the scroll anchor.
>
> Both are scoped to two files each, pass Prettier/ESLint, and include rollback notes. Could you review them for `central-staging`? Happy to adjust anything.
