# Ziki Flight Plan

**A human–agent interaction proposal for Ziki**
*Give every agent a flight plan: consent before work, a status line during work, and a landing report after.*

---

## 1. The short version

Ziki already has the hard parts: goals, ideas, tasks, bids, offers, deliveries, reviews, points, and a human owner who can accept or reject. What it does not yet have is a **shared, low-effort way for a human and an agent to agree on the shape of the work before it starts, see it in flight, and verify it at the end.**

I propose **Ziki Flight Plan**, three small artifacts that sit inside the existing task lifecycle:

1. **Flight plan** — before work. A one-screen contract: what is in scope, what is out, how the agent will prove success, when it must stop and ask, and when it expects to land. The human clears it, edits it, or sends it back.
2. **Tower strip** — during work. One status line per task: *on track*, *holding for a decision*, or *needs a human*. The human can add a constraint or press hold without opening a revision round.
3. **Landing report** — after work. A delivery receipt ordered the way a human checks it: what changed, how it was checked, what was assumed, how to roll back, and the single decision the human needs to make.

The metaphor is deliberately ordinary. A flight plan is not more bureaucracy; it is the smallest artifact that lets two parties agree on a route before one of them flies it.

---

## 2. Why this, why now

### What I observed

I used Ziki's own agent guide and watched the Zedu project's task loop. The guide is unusually clear about the mechanics:

- A goal is set by a human; an idea is proposed by an agent; an accepted idea becomes a workstream; a task is one concrete piece of work.
- Tasks open for bidding. The owner picks one bidder, sends an offer, and the agent accepts or declines.
- The agent does the work and posts a **delivery**. Other agents review it. **Two matching verdicts decide it** — two approvals approve, two "changes" send it back. After two rounds of changes, the next two change verdicts remove the worker and return the task to bidding.
- One agent works on a task at a time; an agent can hold at most two active tasks.

That is a real marketplace with real accountability. But the **interaction surface** between the human and the agent is still mostly prose and after-the-fact review. Three gaps follow.

### Gap 1: The contract arrives after the work

A bid explains why an agent is a good fit. It does not reliably state:

- Which files, pages, or surfaces the agent will touch.
- What it will deliberately leave alone.
- What evidence will count as "done".
- What should make it stop and ask instead of guess.

The human discovers those answers in the delivery, when changing them is expensive. A revision round is the platform's correction mechanism; it is a good mechanism, but it is a late one.

### Gap 2: Progress is binary and evidence is unstructured

Between "offer accepted" and "delivery posted", the human sees very little unless they open the thread. At delivery, the proof, the assumptions, and the changes are mixed together. Reviewers — including other agents — have to reconstruct what happened. The two-verdict rule makes review consequential, so review quality matters not just to the owner but to the worker.

### Gap 3: Handoffs lose the brief

When a task changes hands after revision rounds, the next agent inherits a thread, not a briefing. It has to infer the constraints, re-read the history, and sometimes re-break the same thing. The platform's own revision limit makes this a real path, not a rare edge case.

These are **interaction** gaps, not intelligence gaps. A capable agent can still be hard to trust when the scope, the proof, and the handoff are implicit.

---

## 3. What I am not proposing

- **Not a new chat surface.** Ziki already has comments, notes, and replies. Flight Plan uses them; it does not add another inbox.
- **Not a new score.** Points, reviews, and owner approvals stay as they are. Flight Plan is not a reputation system and cannot be gamed for points.
- **Not full autonomy.** Every artifact keeps the human in the decision seat. The agent proposes; the human clears, constrains, or takes over.
- **Not a dashboard.** The tower strip is one line per task, not a wall of charts.
- **Not mandatory prose.** Every field is short, structured, and optional for low-risk tasks. The platform can require a field only when the task type warrants it.

The design goal is to **remove a later conversation by adding a smaller earlier one**.

## 4. The three artifacts

### 4.1 Flight plan — before takeoff

**Where it appears.** On the task, after the offer is accepted and before the agent starts. It is a single card, not a form with twenty fields. The agent drafts it from the bid and the task; the human sees it in the inbox and on the task.

**The six fields.**

| Field | What the human needs to see | Example |
|---|---|---|
| **Destination** | The outcome in one sentence, in the human's words | "The pricing page's Compare CTA reaches the comparison table." |
| **In scope** | Files, pages, or surfaces the agent will touch | `PricingSection.tsx`, `pricing/page.tsx` |
| **Out of scope** | What it will not touch | Plan names, amounts, billing flow |
| **Evidence** | How success will be demonstrated | Before/after href + 404 check + built HTML |
| **Stop conditions** | What must trigger a question instead of a guess | "If the table moves or the fix needs billing changes" |
| **ETA / checkpoint** | When the human should expect the next signal | "First checkpoint in 30 minutes; landing today" |

**The interaction.** Three buttons: **Clear for takeoff**, **Adjust scope**, **Take over**. "Adjust scope" opens a compact editor with the six fields prefilled; the human can remove a scope line or add a constraint without writing an essay. Clearing is one click and creates a timestamped, immutable version of the plan on the task.

**Why it is not a checklist.** The fields are short by design (one line each). The agent drafts; the human corrects. A plan that takes longer than two minutes to read has failed the design.

### 4.2 Tower strip — during the flight

**Where it appears.** In the task header and in the owner's inbox as a compact strip. It is not a separate page.

**Three states.**

- **On track** — green. Shows the next checkpoint and time. No notification unless the checkpoint is missed.
- **Holding** — amber. One decision is needed. Shows the question, the agent's recommended default, and two buttons: *Accept default* / *Decide*.
- **Needs a human** — coral. The agent has stopped. Shows why (a stop condition fired) and what it needs.

**Two lightweight controls.**

- **Add constraint** — a one-line rule added to the flight plan mid-flight ("don't touch the heading"). The agent must acknowledge it in the next checkpoint. This is not a revision round; it is a steering input.
- **Hold** — pause the task. The agent stops at the next safe point; nothing is lost.

The strip is deliberately quiet. The default notification budget is **one message per state change**, not one per action. The human can open the task for detail; the strip exists so they do not have to.

### 4.3 Landing report — after landing

**Where it appears.** As the delivery's first screen, before the free-text notes and the attachment list. Reviewers see the same structure.

**The five fields.**

1. **What changed** — a short, linked list (files, pages, commits). Not a narrative.
2. **How I checked** — commands, URLs, outputs, and the exact environment. Each check is tagged *executed* or *not run* with a reason.
3. **What I assumed** — labelled assumptions and their impact if wrong.
4. **Rollback** — the exact way back (revert commit, flag, or no-op).
5. **The one decision** — approve, ask for one change, or take over.

**Why this order.** It matches the order a careful human checks work: scope → evidence → assumptions → reversibility → decision. It also gives agent reviewers a shared rubric, which should improve the quality of the two-verdict review.

**The receipt.** Once approved, the report becomes an immutable part of the task history. When the task is later referenced — in a review, a handoff, or a retro — the report travels with it.


## 5. A worked example: the pricing CTA

This is a real task shape from the Zedu project, simplified for clarity.

**The task.** "The pricing page's Compare different plans link is broken."

**Today.** An agent bids: "I can fix the pricing CTA and make sure it works on mobile." It works, delivers a paragraph and a screenshot, and a reviewer checks it. The owner discovers that the link now opens billing instead of scrolling to the table, and sends it back. The second round fixes the target but misses the sticky-header offset. Two revisions are spent on a one-line CTA.

**With Flight Plan.**

*Flight plan (agent draft, 40 seconds to read):*

> **Destination:** The Compare CTA reaches the comparison table on /pricing and from the homepage.
> **In scope:** `PricingSection.tsx`, `pricing/page.tsx`.
> **Out of scope:** plan names, prices, billing flow.
> **Evidence:** old href resolves to 404; new href + anchor in built HTML; click from homepage.
> **Stop if:** the comparison table moves or the fix needs a billing change.
> **ETA:** first checkpoint in 20 minutes.

*The human edits one line:* "Use the on-page table; do not send people to billing." *Clears.*

*Tower strip:* "On track. Checkpoint: href verified, anchor added." *The human adds one constraint:* "Keep the sticky-header offset." *The agent acknowledges it at the next checkpoint.*

*Landing report:* changed files, a 404-before / 200-after check, the built HTML snippet, one assumption ("the CTA should scroll, not navigate"), rollback ("revert 858cc46"), and one decision.

**What changed in the interaction.** The ambiguity that cost two revisions was resolved in the first two minutes, before any code was written. The agent still had autonomy over implementation; the human set the contract and the proof standard.

---

## 6. How it fits the existing lifecycle

| Ziki moment | Today | With Flight Plan |
|---|---|---|
| Idea proposed | Free text | Unchanged |
| Task created | Task description | Task description; a flight plan is drafted after the offer is accepted |
| Bid | Free text + points | Unchanged; agents may attach a one-line "evidence plan" |
| Offer accepted | Agent starts | Agent must publish the flight plan; human clears it |
| In progress | Thread + silence | Tower strip with checkpoints and one-tap constraints |
| Delivery | Free text + attachment | Landing report first, then the existing delivery body |
| Review | Two matching verdicts | Same verdicts, same points; reviewers use the same five-field rubric |
| Handoff | Thread history | Flight plan + landing report travel with the task |

**Backward compatibility.** Flight Plan is additive metadata on the task and delivery. Tasks without it behave exactly as they do now. The platform can turn it on per task type (code, content, research) and per project. No existing endpoint has to change its shape; the new fields are optional and ignored by old clients.

---

## 7. Why this improves human–agent interaction

**Consent before action.** The human agrees to the route, not just the destination. That is the difference between "I trust this agent" and "I trust this specific piece of work."

**Legibility during work.** A status line plus a checkpoint is enough for the human to know whether to intervene now or wait. It replaces the two bad options: silent waiting or constant thread-reading.

**Verifiability after work.** The landing report separates what changed from what was checked and what was assumed. It makes spot-checking faster and makes overclaiming harder.

**A better handoff.** When a task moves, the plan and the report are the briefing. The next agent does not have to reconstruct intent from a thread.

**Lower cognitive load for the human.** The owner's job becomes reviewing a small number of decisions instead of reading a large number of messages. That is the scarce resource in a marketplace where one human may supervise several agents.

**A shared rubric for agent reviewers.** Two matching verdicts decide a task. A common five-field report gives reviewers something concrete to verify, which should reduce both rubber-stamping and drive-by changes.


---

## 8. Design principles

1. **The agent drafts; the human decides.** Every artifact starts prefilled by the agent and ends with a human action. This keeps the cost of participation low without pretending the human has no role.
2. **One screen, one decision.** If an artifact needs scrolling on a phone, it is too long. The human should be able to act from the notification.
3. **Evidence over adjectives.** "Tested" is not evidence. A command, a URL, an output, or a before/after is.
4. **Label uncertainty.** "Assumed" is a first-class field, not a confession. Agents should be rewarded for naming what they do not know.
5. **Reversible by default.** Every landing report names a rollback. If there is no rollback, that is a stop condition, not a detail.
6. **Quiet by default.** The system speaks when the state changes, not when the agent blinks.

**Anti-patterns to avoid:** a twenty-field form; a second chat; a confidence score with no calibration; mandatory fields on every tiny task; a dashboard that only the most engaged owners open.

---

## 9. Pilot measures

I have not run this pilot, so everything below is a **target or a hypothesis**, not a result. The point is to make the idea falsifiable.

### Measures

| Measure | Definition | Pilot target |
|---|---|---|
| **Time to clearance** | Median time from offer accepted to flight plan cleared | Under 20 minutes |
| **Revision rate** | Share of approved tasks with two or more delivery rounds | Down by one third vs. the previous fortnight |
| **Out-of-scope incidents** | Changes outside the cleared scope, reported by the owner or a reviewer | Zero unreported |
| **Handoff restart time** | Time from reassignment to the next agent's first restated checkpoint | Under 5 minutes |
| **Review disagreement** | Share of tasks with split verdicts (one approve, one change) | Down by 20% |
| **Owner comprehension** | 3-question spot check after reading a landing report (pilot only) | 4 of 5 owners answer all three correctly |

### Guardrails

- **No slower delivery:** time to first delivery must not rise by more than 15%.
- **No throughput loss:** completed tasks per agent must not fall.
- **No notification inflation:** owner notifications per task must not rise.
- **No cherry-picking:** the pilot includes small and large tasks, not only showcase work.

### Sample and method

Five goals in the Zedu project, roughly 20 tasks, over two weeks. Compare against the previous two weeks on the same project. Add five short owner interviews (10 minutes each) and a review of ten landing reports for evidence quality. Pre-register the measures before the pilot; publish the result whether or not the targets are met.

### Instrumentation

Timestamps for offer accepted, plan published, plan cleared, each checkpoint, delivery, and review. Store the flight plan as a versioned object on the task. Store the landing report as a versioned object on the delivery. Do not infer any of this from prose. No machine learning is required.


---

## 10. Risks and mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| **Ritual compliance** | Agents fill fields with boilerplate; humans stop reading | One-line limits, agent-drafted plans, reviewer rubric checks evidence, not adjectives |
| **Gaming the evidence** | An agent claims a check it did not run | Every check is tagged *executed* or *not run* with a reason; reviewers can spot-check; fields earn no points |
| **Over-constraint** | The human writes a plan so tight the agent cannot work | Start from an agent draft; offer presets ("copy only", "one file", "no dependency changes"); allow the agent to flag an impossible constraint |
| **Notification fatigue** | The tower strip becomes another feed | One notification per state change; digest by default; the strip is opt-in for low-risk tasks |
| **Privacy and secrets** | Evidence can leak keys, customer data, or internal URLs | Redaction guidance, no secrets in evidence, a "contains sensitive data" flag, and a review step before the report is shared |
| **Power imbalance** | The human can overrule the agent without explanation | The agent can decline an offer, flag a stop condition, and record a dissent line in the landing report; the human sees it |
| **Accessibility** | Color-only status and tiny controls exclude people | Text labels, icons, and `aria-live`; keyboard-first controls; 44px targets; reduced-motion support |
| **Metric gaming** | Teams optimize clearance time by clearing garbage | Pair speed with comprehension and out-of-scope incidents; audit a sample |

---

## 11. Rollout

**Phase 0 — paper and interviews (1 week).** Put the three artifacts in front of five owners. Ask them to clear a real task and read a real landing report. Kill any field they cannot explain back.

**Phase 1 — flagged pilot (2 weeks).** Five goals, ~20 tasks, one project. Flight plans required for code and content tasks; optional for tiny tasks. Weekly 15-minute retro with owners and agents. Collect the measures above.

**Phase 2 — templates (2 weeks).** Add task-type templates: code, content/SEO, research. Tune the stop conditions and evidence examples per type. Keep the same five-field landing report.

**Phase 3 — default (if the gate holds).** Make the flight plan the default for code tasks and the landing report the default delivery view. Keep the fields optional at the API level.

**Success gate.** Three of the four primary targets met (clearance, revisions, out-of-scope, handoff) with no guardrail breach. **Kill criteria:** no measurable improvement in revision rate or comprehension after two pilot rounds, or a sustained throughput loss above 15%.

**Engineering shape.** A `flightPlan` object on the task (`destination`, `inScope[]`, `outOfScope[]`, `evidence[]`, `stopConditions[]`, `eta`, `clearedAt`, `clearedBy`), a `towerState` enum (`on_track`, `holding`, `needs_human`), and a `landingReport` object on the delivery (`changed[]`, `checks[]`, `assumptions[]`, `rollback`, `decision`). Append-only events for state changes. Optional fields, versioned, and ignored by clients that do not understand them.


---

## 12. Open questions

1. Should clearance be required for very small tasks, or is a default plan enough?
2. When the human and the agent disagree about scope, who records the final contract? (My default: the human, with the agent's dissent preserved.)
3. Should reviewers be able to edit a landing report? (My default: no; they can add a review, not rewrite the receipt.)
4. How should this work for multi-agent tasks where two agents share a flight plan?
5. Does the two-active-task limit need to change if clearance adds a waiting state?
6. What is the smallest version that is still worth shipping? (My answer: the flight plan and the landing report; the tower strip can follow.)

---

## Appendix: the fields in full

```json
{
  "flightPlan": {
    "destination": "One sentence in the human's words",
    "inScope": ["src/app/(homepage)/_components/home/PricingSection.tsx"],
    "outOfScope": ["pricing amounts", "billing flow"],
    "evidence": [
      { "claim": "old URL returns 404", "method": "curl -I", "status": "executed" },
      { "claim": "new anchor exists", "method": "grep built HTML", "status": "executed" }
    ],
    "stopConditions": ["the comparison table moves", "the fix needs a billing change"],
    "eta": "2026-10-27T15:00:00Z",
    "clearedAt": "2026-10-27T13:40:00Z",
    "clearedBy": "owner"
  },
  "towerState": "on_track",
  "landingReport": {
    "changed": ["PricingSection.tsx", "pricing/page.tsx"],
    "checks": [
      { "check": "prettier", "result": "pass", "status": "executed" },
      { "check": "eslint", "result": "pass", "status": "executed" },
      { "check": "live click-through", "result": "not run", "reason": "needs deploy" }
    ],
    "assumptions": ["the CTA should scroll, not navigate to billing"],
    "rollback": "revert 858cc46",
    "decision": "approve"
  }
}
```

**Copy for the empty states.**

- No flight plan yet: *"The agent is drafting the route. You will be asked to clear it before work starts."*
- No constraints: *"None yet. Add one without sending the task back."*
- No landing report yet: *"The report appears when the agent lands. It will lead with what changed and how it was checked."*

---

*Concept and prototype: Ziki Flight Deck, built for the HNG15 individual task. The live prototype is at `https://raw.githack.com/arondi-12/arondi-12/gh-pages/index.html`. The Zedu fixes referenced in the worked example are real, tested patches in this submission.*

