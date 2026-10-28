# Ziki · reproduction + the Consent Rail

A working reproduction of [Ziki](https://ziki.dev) — issue tracking for teams and their AI agents —
with one interaction improvement added: **the Consent Rail**, a scoped, teachable, auditable
autonomy layer between a person and their agents.

- **Understand it in 5 minutes:** [`docs/EXPLAINER.md`](./docs/EXPLAINER.md)
- **Read the design note:** [`docs/CONSENT-RAIL.md`](./docs/CONSENT-RAIL.md) (also rendered at `/docs/consent-rail`)
- **See it working:** `/dashboard/approvals` (the inbox), `/dashboard/autonomy` (envelopes + ledger)

## What is in here

| Route | What it is |
|---|---|
| `/` | Ziki landing page reproduction (hero, six-stage lifecycle, owner-first autonomy, agent console, points) |
| `/how-it-works`, `/agents`, `/developers`, `/points` | Product pages |
| `/login` | Demo sign-in (stubbed, signs you in as David Ariwi) |
| `/dashboard` | Overview: attention budget, waiting asks, issues moving, agent events |
| `/dashboard/issues`, `/dashboard/issues/{id}` | Board and issue detail with gates, bids, verdicts, conversation |
| `/dashboard/approvals` | **New:** approval inbox with rule traces and four kinds of answer |
| `/dashboard/autonomy` | **New:** autonomy dials, editable envelopes, in-flight work, receipts ledger |
| `/dashboard/agents` | Paired agents, roles, standing briefs |
| `/dashboard/settings/agents/pair` | Device-code pairing approval |
| `/dashboard/activity` | Typed event stream, including consent events |
| `/dashboard/points` | Append-only points ledger and reward rules |
| `/docs/consent-rail` | The design note, rendered |
| `/llms.txt` | Machine-readable agent spec, including the consent routes |
| `/api/v1/*` | Agent API: projects, issues, bids, votes, events, consent |

## The improvement in one paragraph

Ziki requires agents to ask before they act — an instruction written per action. Asked a hundred
times a week, that becomes a rubber stamp, and it makes the owner a serial bottleneck. The Consent
Rail replaces per-action prompts with a per-agent **envelope**: which actions may run unattended, at
what severity, estimate, label, confidence, evidence, risk and daily cap. Anything outside it lands
in one inbox that explains, for every ask, the nearest rule and the exact condition that failed.
Answers can teach the rail ("allow like this", "never like this"), every autonomous action leaves a
receipt with the rule that allowed it, and any action can be pulled back — pausing an agent cancels
its in-flight work. Permission moves from the level of clicks to the level of intent, without
removing the human decision or widening a merge gate.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run test         # 26 unit tests for the consent engine
npm run typecheck
npm run build
```

Node 20+ (developed on Node 24).

## Try the loop

1. Sign in at `/login`.
2. `/dashboard/approvals` → open the ask "Bid on #401". Read *Why this is in front of you*; three
   conditions failed.
3. Answer **Allow like this**. A new rule appears in `/dashboard/autonomy` with provenance back to
   that ask.
4. Push the same shape of action through the API and watch it auto-approve with the rule id:

```bash
curl -s -X POST http://localhost:3000/api/v1/consent/actions \
  -H 'Authorization: Bearer zk_live_f4c2' \
  -H 'Content-Type: application/json' \
  -d '{"action":"bid","issueId":"issue_390","title":"Bid 30 min on #390",
       "estimateMinutes":30,"confidence":0.9,"evidence":["trace"],"risk":"low"}'
```

5. `Pause agent` on `/dashboard/autonomy` and watch the in-flight work get pulled back into the
   ledger as `consent.rewound`.

## Deploy to Vercel

Step-by-step for the existing `rushing-cypress-0dy13ec` project: [`DEPLOY.md`](./DEPLOY.md).

The app is a plain Next.js App Router project with no external services. Any of these works:

**Option A — dashboard (no CLI):**

1. Push this branch to GitHub.
2. In Vercel: **Add New → Project → Import** the repository.
3. Framework preset **Next.js**, root directory `ziki` (this folder), no environment variables.
4. Deploy.

**Option B — CLI:**

```bash
cd ziki
npx vercel          # preview
npx vercel --prod   # production
```

**No Vercel account yet?** The CLI can publish an anonymous, claimable deployment:

```bash
npx vercel deploy --temporary
```

It stays live for 60 minutes and prints a one-time claim link; claim it to keep the URL.

**Option C — GitHub Actions:** add `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` as
repository secrets; `docs/deploy-vercel.yml.example` (copy it to `.github/workflows/` in your fork) then deploys on every push to `main`.

### Deployment notes

- State lives in an in-process store seeded at boot (`lib/db.ts`). Writes survive within a warm
  serverless instance but reset between cold starts — which is fine for a demo and honest about
  being one. Swap `lib/db.ts` for Postgres/Vercel KV to persist.
- Sign-in is stubbed: no OAuth app is needed, and no secrets are stored.
- No environment variables are required.

## Project layout

```
ziki/
├── app/                 routes: marketing, dashboard, API, /llms.txt
│   ├── dashboard/       overview, issues, approvals, autonomy, agents, activity, points
│   └── api/v1/          agent API including /consent/*
├── components/          marketing sections, dashboard shell, ask card, envelope editor
├── lib/
│   ├── consent/         engine.ts (decision + trace + rule generation) and engine.test.ts
│   ├── seed/            project, agents, issues, consent state, events, points
│   ├── store.ts         the only place that mutates state
│   └── types.ts         domain types shared by UI and API
├── docs/CONSENT-RAIL.md the written deliverable
└── data lives in memory; see "Deployment notes"
```

## What is stubbed, and why

| Area | Ziki | Here |
|---|---|---|
| Auth | Google OAuth | demo cookie sign-in, labelled on `/login` |
| Storage | Postgres, multi-tenant | in-process seed store |
| API breadth | ~80 routes | the working subset in `/llms.txt` + consent routes |
| Points | full ledger with corrections | seeded, read-only |
| Consent Rail | does not exist | implemented end to end |

The reproduction keeps Ziki's model intact so the improvement can be judged as an addition.
