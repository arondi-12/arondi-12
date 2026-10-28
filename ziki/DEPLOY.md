# Deploying this build to Vercel

**Live:** <https://ziki-consent-rail.vercel.app> (team `arondi`, project `ziki-consent-rail`).

Deployment protection (SSO) is off and the clean `<project>.vercel.app` domain is attached, so the URL
is public. To ship a new build, either connect the repo (Path A) or run the CLI commands (Path B).

No environment variables are required, and there is no database or OAuth app to configure.

---

## Path A — connect the Git repo (no secrets, recommended)

Do this once; every later push redeploys automatically.

1. Open <https://vercel.com/arondi/ziki-consent-rail/settings/git>
2. **Connect Git Repository** → GitHub → pick this repository.
3. Set:
   - **Production branch:** `cline/dy690pnj` (or `main` after merging)
   - **Root directory:** `ziki` ← important, the app is not at the repo root
   - **Framework preset:** Next.js (auto-detected)
   - **Install command:** `npm install` · **Build command:** `next build` (defaults are correct)
   - **Node.js version:** 22.x (20 or 24 also fine)
4. **Deploy** (or Deployments → ⋯ → Redeploy).

Result: `https://ziki-consent-rail.vercel.app` goes live and stays live.

## Path B — deploy from the CLI with a token

Only needed if you do not want to connect the repo.

1. Create a token: <https://vercel.com/account/tokens> → *Create* → scope `arondi` → copy it.
2. Run (from the repo root):

```bash
cd ziki
npx vercel link --project ziki-consent-rail --scope arondi --token "$VERCEL_TOKEN"
npx vercel deploy --prod --token "$VERCEL_TOKEN"
```

If `link` asks questions, answer: *link to an existing project* → `ziki-consent-rail`.
Revoke the token at the same page once the deployment is done.

## Path C — a throwaway preview with no account at all

```bash
cd ziki
npx vercel deploy --temporary
```

This publishes an anonymous deployment that expires after 60 minutes and prints a one-time claim
link. Useful for a quick look; not for submission.

---

## Verify a deployment

Replace `$BASE` with the deployment URL.

```bash
# public pages
curl -s -o /dev/null -w '%{http_code} ' $BASE/ $BASE/how-it-works $BASE/agents $BASE/developers $BASE/points $BASE/docs/consent-rail; echo

# the rail over HTTP (solver key)
curl -s -X POST $BASE/api/v1/consent/actions \
  -H 'Authorization: Bearer zk_live_f4c2' \
  -H 'Content-Type: application/json' \
  -d '{"action":"bid","issueId":"issue_401","title":"Bid 90 min on #401",
       "estimateMinutes":90,"confidence":0.72,"evidence":["trace"],"risk":"high"}'
# expect: "outcome":"ask" plus a "why" sentence and a trace array
```

In a browser, sign in at `/login` (demo sign-in), then check:

- `/dashboard` — greets **David Ariwi**
- `/dashboard/approvals` — three asks waiting, each with *Why this is in front of you*
- `/dashboard/autonomy` — the envelope per agent, in-flight work, receipts
- `/docs/consent-rail` — the design note, with the *Start here* section

## Notes

- The store is in-process (`lib/db.ts`). Writes survive a warm instance but reset on a cold start;
  this is intentional for a demo. Swap in Postgres or Vercel KV to persist.
- Sign-in is stubbed: no OAuth credentials, no secrets in the repo.
- Root directory must be `ziki`; the repository also contains unrelated workspace files.
