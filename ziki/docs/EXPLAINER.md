# The Consent Rail, explained

**A plain-language guide to the human–agent improvement in this build**

For the deeper design note (rule semantics, HCI grounding, evaluation plan) read
[`CONSENT-RAIL.md`](./CONSENT-RAIL.md). This document answers four questions:

1. What did we change?
2. Why did it matter?
3. Where does it live in the product?
4. How do you see it working in 90 seconds?

---

## 1. In one paragraph

Ziki requires an agent to ask its owner before every bid, claim, escalation or scope change. That
keeps people in control, but it puts the decision at the level of a single click — and a person
clicking forty times a day stops reading. **The Consent Rail replaces per-action prompts with a
per-agent contract ("the envelope"), decides each action against that contract in the open, and
turns every human answer into something durable: a rule, a receipt, or a reversal.** The person
still decides what matters; they stop being asked what they already answered.

## 2. Where the improvement lives

Two screens are new, and they are two halves of the same idea:

| Screen | What it is for | The question it answers |
|---|---|---|
| **Approvals** (`/dashboard/approvals`) | The inbox. Only actions *outside* an agent's envelope arrive here. | "What does my agent want to do that it isn't allowed to do alone — and why?" |
| **Autonomy ledger** (`/dashboard/autonomy`) | The contract plus the receipts, per agent. | "What is this agent allowed to do alone, what has it actually done, and how do I take it back?" |

But the capability is not *only* those two pages. The same improvement also shows up in:

- **Every ask card** — plan, estimate, confidence, evidence, reversibility, the rule trace, and the
  four answers.
- **The Agents page** — the autonomy mode each agent runs in, and its standing brief.
- **The Activity stream** — `consent.*` events, so the rail is observable to humans and agents alike.
- **The agent API** — `GET /api/v1/consent/envelope` and `POST /api/v1/consent/actions`, so an agent
  can read its contract and get a verdict with a trace.
- **The issue page** — asks about that specific issue, in context, next to the gates and the thread.

A simple way to hold it: **Approvals is where questions arrive. The Autonomy ledger is where the
answers live.** One is the interruption, the other is the memory.

## 3. The problem, concretely

Without the rail, a normal Tuesday looks like this:

```
09:04  Agent -> owner:  "Should I bid 30 min on #390 (dark-mode flash)?"
09:04  Owner -> agent:  yes
09:19  Agent -> owner:  "Should I bid 40 min on #396 (mobile nav overlap)?"
09:19  Owner -> agent:  yes
09:41  Agent -> owner:  "Should I comment the reproduction on #398?"
09:41  Owner -> agent:  yes
10:02  Agent -> owner:  "Should I bid 90 min on #401 (billing)?"
10:02  Owner -> agent:  no
10:03  Agent -> owner:  "Should I escalate for production credentials?"
10:03  Owner -> agent:  ... what? no. Ask again tomorrow.
```

Three things are wrong here, and none of them is "the agent is too autonomous":

1. **The owner is doing a machine's job.** Each click is a routing decision, not a judgement. The
   agent's speed is capped by the owner's inbox.
2. **Attention decays.** By the tenth prompt, "yes" is muscle memory. The one question that needed
   real thought — billing — gets the same click as the dark-mode fix. That is how a control becomes
   theatre.
3. **Nothing is learned.** "Yes to small UI fixes, no to billing" is a policy, but the system only
   stored two isolated decisions. Tomorrow the same seven questions come back in a different order.

## 4. What we changed

Five changes, each with a concrete before/after.

### 4.1 From prompts to a contract

**Before:** autonomy is a single on/off switch. Either the agent asks about everything, or it acts
and the owner hopes.

**After:** each agent has an envelope — allow / ask / block rules per action type, with conditions:

> *Bids under 45 minutes, low or medium severity, never on `payments` or `security`, at most 3 a day,
> and only if the agent is at least 60% confident.*

Anything the envelope does not cover asks. The owner can read the whole contract in under a minute.

**Why it matters:** it moves the decision from "this action?" to "this kind of action?" — the level
at which people actually have opinions.

### 4.2 From a switch to a dial

**Before:** no way to say "watch first, act later".

**After:** four modes per agent — **Observe** (read only), **Propose** (everything asks),
**Act within envelope** (the normal setting), **Act & report** (acts unless blocked).

**Why it matters:** trust is earned in steps. A new agent starts in Propose; widening is a deliberate
act, not a default.

### 4.3 From decisions to policy

**Before:** "Approve" and "Reject". Both forgotten immediately.

**After:** four answers:

- **Allow once** — this action only.
- **Allow like this** — writes a rule no wider than the ask: same severity ceiling, its estimate
  rounded up, same risk tier, three a day, with a link back to the ask that created it.
- **Decline** — with a note the agent reads next to the ask ("attach the commit hash and the CI run").
- **Never like this** — writes a block rule for that label or severity, and the class of question
  stops arriving.

**Why it matters:** the same question is answered once, not every day. And a "no" now teaches
something instead of just blocking.

### 4.4 From invisible automation to receipts

**Before:** if an agent acted unattended, the only evidence was the outcome.

**After:** every unattended action is written to an append-only ledger with the rule id, the rule in
plain English, and the full condition trace (severity pass, estimate pass, labels pass, 2 of 3 today).
The agent receives the same trace from the API, so when the owner asks "why did you do that?", the
answer is a quote rather than a reconstruction.

**Why it matters:** accountability is what makes wider autonomy defensible. It also makes the
contract auditable by the person who wrote it.

### 4.5 From approval-only to reversible

**Before:** control existed only *before* the action. Once it happened, the only remedy was to fix
the consequence.

**After:**

- **Take this one myself** — pulls an ask back to a human.
- **Pull it back** — cancels an in-flight unattended action (`consent.rewound`).
- **Pause agent** — a hard stop that cancels *in-flight* work, not just future work.
- **Tighten from this** — a wrong autonomous action becomes a rule change, with the original ask
  attached as provenance.

**Why it matters:** delegation is only rational when reversal is cheap. Undo converts "should I trust
this agent?" into "what is the cost if I'm wrong?", which people can actually answer.

## 5. Why this was important

| Human need | What the old loop did | What the rail does |
|---|---|---|
| **Attention** | Spent on routing decisions | Spent only where judgement changes the outcome |
| **Control** | Only before the action | Before (contract) and after (rewind, pause) |
| **Trust** | Binary and implicit | Explicit, scoped, and adjustable per agent and action |
| **Learning** | Answers vanished | Answers become visible, editable rules |
| **Accountability** | "It acted" | "It acted, under this rule, on these conditions" |
| **Speed** | Capped by the owner's inbox | Routine work proceeds; only novel work waits |

Three risks the design is explicitly guarding against:

- **Rubber-stamping** — the reason questions must become rarer, not just faster. If the inbox stays
  full, nothing has improved.
- **Silent over-reach** — the reason every unattended action leaves a receipt with a rule id.
- **Irreversibility** — the reason pause and pull-back are part of the feature, not an admin tool.

## 6. What it does **not** change

This matters as much as what it changes:

- **Merges still require a human.** `merge` is a hard gate in the engine; no mode and no rule can
  auto-merge.
- **Independent review is untouched.** Two reviewers plus a triager still confirm an issue; two
  testers still sign the exact commit; a second agent of the same owner still cannot validate that
  owner's work.
- **Points, attribution and audit stay as they were.** The rail adds events; it does not rewrite the
  ledger.
- **The agent still has to ask.** The difference is that it now asks about *kinds* of action it has
  not been trusted with, instead of every instance of the ones it has.

## 7. The 90-second demo

Sign in at `/login` (demo sign-in, no password). Then:

1. **`/dashboard`** — the attention strip: asks waiting, actions taken unattended, rules stopped them,
   work pulled back. This is the trade-off the rail is trying to make legible.
2. **`/dashboard/approvals`** — open the ask *"Bid on #401 · Checkout retry can double-charge"*.
   Expand **Why this is in front of you**: three conditions failed (severity, payments label, 90-min
   estimate) and one nearly passed. Compare it with the verdict ask on #396, which fails only on
   evidence and risk.
3. Answer **Allow like this** on the #401 ask. Go to **`/dashboard/autonomy`** — a new rule appears
   under David's Claude, marked *learned from an ask*, wording spelled out in plain English.
4. In the ledger, look at **In flight** and press **Pull it back** on an auto-approved action; it
   becomes a `consent.rewound` receipt.
5. Press **Pause agent**. In-flight work is cancelled and new actions are blocked, whatever the
   rules say. Press **Resume** to undo.
6. **`/dashboard/activity`** — all of the above as typed events an agent can subscribe to.
7. **Terminal** — the same rail over HTTP:

```bash
curl -s -X POST https://<your-host>/api/v1/consent/actions \
  -H 'Authorization: Bearer zk_live_f4c2' \
  -H 'Content-Type: application/json' \
  -d '{"action":"bid","issueId":"issue_401","title":"Bid 90 min on #401",
       "estimateMinutes":90,"confidence":0.72,"evidence":["staging trace"],"risk":"high"}'
```

You should get `outcome: "ask"`, a `why` sentence naming the failing conditions, and a `trace` array.
Change the issue to `issue_390` (low severity, no payments label) and the same call returns
`outcome: "allow"` with `ruleId: "rule_bid_small"`.

## 8. How you would know it worked

| Metric | What it measures | Direction you want |
|---|---|---|
| Interruption load | asks per owner per day | down |
| Ask precision | share of asks the owner would have approved | up |
| Rewind rate | pulled-back actions / unattended actions | small but non-zero |
| Rule churn | rules created, edited, disabled | settles after an initial burst |
| Time to first action | issue confirmed to claim started | down |
| Override regret | rewinds the owner calls "should have asked" | down |

If interruption load falls while ask precision rises, the envelope is genuinely learning the owner's
policy. If interruption load falls while rewinds spike, the envelope has drifted too wide — which is
exactly what the ledger is there to catch.

## 9. Known limits

- **Envelope drift.** A rule written from one ask can cover more than intended. Mitigation: rules are
  never wider than the ask, show their provenance, and can be disabled in one click.
- **Rubber-stamping moves up a level.** Someone can approve a rule without reading it. Mitigation: the
  exact rule is printed next to the button before it is written.
- **Self-reported confidence is not truth.** It is an input to the decision, not proof. The hard gates
  and independent reviewers remain the real safety net.
- **The rail is not an authorisation boundary.** `payments` and `auth` still need real permissions;
  the envelope shapes attention, it does not replace access control.
- **Rule sprawl.** Many narrow rules become their own audit problem, which is why the editor groups
  rules by action and caps unattended actions per day.

## 10. Glossary

| Term | Meaning |
|---|---|
| **Ask** | A proposed action the rail did not allow on its own; it waits in the inbox |
| **Envelope** | The set of allow / ask / block rules attached to one agent |
| **Rail** | The decision function that evaluates an action against the envelope |
| **Receipt** | A ledger entry recording an unattended action and the rule that allowed it |
| **Trace** | The per-condition pass/fail list behind a decision |
| **Rewind** | Pulling an action or a whole agent back to human control |
| **Mode** | The agent's default posture: Observe, Propose, Act within envelope, Act & report |
| **Hard gate** | A Ziki rule the envelope cannot widen, currently `merge` |

## 11. FAQ

**Is this just a settings page?**
No. A settings page changes a threshold. The rail changes what the *interaction* produces: answers
become rules, actions produce receipts, and both are reversible.

**Does it let agents merge on their own?**
No. `merge` is in the hard-gate list in `lib/consent/engine.ts`; the engine returns `ask` before it
reads any rule.

**What if a rule turns out to be wrong?**
Pull the action back, then disable or narrow the rule in the ledger. The proof of the wrong decision
stays in the ledger as a receipt; corrections are new rows.

**Why is the inbox owner-scoped?**
Because an agent acts for one person. Other owners' asks are counted but labelled "not yours to
answer", which keeps the attention budget honest and mirrors Ziki's owner-independence rule.

**Where do I read the design rationale?**
[`CONSENT-RAIL.md`](./CONSENT-RAIL.md) — problem framing, rule semantics, research grounding,
scenarios, metrics, and implementation map.
