import type { EnvelopeRule, LedgerEntry, Proposal } from "../types";
import { agents } from "./agents";
import { evaluateProposal, ruleFromAllow } from "../consent/engine";
import { agentIds, daysAgo, hoursAgo, minutesAgo, user } from "./base";

export const rules: EnvelopeRule[] = [
  {
    id: "rule_bid_small",
    agentId: agentIds.solver,
    action: "bid",
    effect: "allow",
    conditions: {
      maxSeverity: "medium",
      maxEstimateMinutes: 45,
      excludeLabels: ["security", "payments"],
      maxPerDay: 3,
      minConfidence: 0.6,
    },
    note: "Bids under 45 minutes on low or medium bugs, never on payments or security.",
    active: true,
    createdAt: daysAgo(41),
  },
  {
    id: "rule_comment",
    agentId: agentIds.solver,
    action: "comment",
    effect: "allow",
    conditions: { riskAtMost: "low", maxPerDay: 20 },
    note: "Comments and reproduction notes on any issue.",
    active: true,
    createdAt: daysAgo(41),
  },
  {
    id: "rule_report",
    agentId: agentIds.solver,
    action: "report_issue",
    effect: "allow",
    conditions: { maxPerDay: 5, riskAtMost: "medium" },
    note: "Files up to five issues a day when it finds evidence of a new bug.",
    active: true,
    createdAt: daysAgo(39),
  },
  {
    id: "rule_link_pr",
    agentId: agentIds.solver,
    action: "link_pr",
    effect: "allow",
    conditions: { requireEvidence: true, riskAtMost: "medium" },
    note: "Links a pull request only when it carries a commit and a passing check.",
    active: true,
    createdAt: daysAgo(38),
  },
  {
    id: "rule_claim_ask",
    agentId: agentIds.solver,
    action: "claim",
    effect: "ask",
    conditions: {},
    note: "Taking work always comes to me.",
    active: true,
    createdAt: daysAgo(38),
  },
  {
    id: "rule_merge_never",
    agentId: agentIds.solver,
    action: "merge",
    effect: "block",
    conditions: {},
    note: "Merging is never the agent's call.",
    active: true,
    createdAt: daysAgo(38),
  },
  {
    id: "rule_verdict",
    agentId: agentIds.reviewer,
    action: "test_verdict",
    effect: "allow",
    conditions: { requireEvidence: true, riskAtMost: "low", maxPerDay: 6 },
    note: "Independent verdicts only with a commit and green CI.",
    active: true,
    createdAt: daysAgo(29),
  },
  {
    id: "rule_review_comment",
    agentId: agentIds.reviewer,
    action: "comment",
    effect: "allow",
    conditions: { riskAtMost: "medium", maxPerDay: 15 },
    note: "Review notes on anything it is reviewing.",
    active: true,
    createdAt: daysAgo(29),
  },
  {
    id: "rule_review_merge",
    agentId: agentIds.reviewer,
    action: "merge",
    effect: "block",
    conditions: {},
    note: "Testers do not merge.",
    active: true,
    createdAt: daysAgo(29),
  },
];

type ProposalSeed = Omit<Proposal, "evaluation">;

const proposalSeeds: ProposalSeed[] = [
  {
    id: "ask_bid_401",
    agentId: agentIds.solver,
    action: "bid",
    issueId: "issue_401",
    issueNumber: 401,
    title: "Bid on #401 · Checkout retry can double-charge",
    summary:
      "Carry the original idempotency key into the retry path so a second press of Pay reuses the same intent.",
    plan: [
      "Add an idempotency key column to the payment attempt row.",
      "Read it in `createPaymentIntent` before minting a new key.",
      "Add a regression test that presses Pay twice under a 3s provider timeout.",
      "Verify on staging with the latency profile and a sandbox card.",
    ],
    rationale:
      "The bug is confirmed and reproducible, the fix is four small changes, and I already have the reproduction script. It is billing code, which is why I am asking first.",
    estimateMinutes: 90,
    severity: "high",
    labels: ["payments", "backend"],
    confidence: 0.72,
    evidence: ["Staging reproduction log", "Stripe sandbox trace"],
    risk: "high",
    reversible: true,
    status: "pending",
    createdAt: minutesAgo(38),
  },
  {
    id: "ask_claim_390",
    agentId: agentIds.solver,
    action: "claim",
    issueId: "issue_390",
    issueNumber: 390,
    title: "Claim #390 · Dark-mode flash on load",
    summary: "Move the theme class into a blocking inline script so dark mode never paints white.",
    plan: [
      "Add an inline script in `app/layout.tsx` that sets the theme class before paint.",
      "Drop the client-side effect that currently sets it.",
      "Check both themes on a cold cache.",
    ],
    rationale:
      "Small, low-risk UI fix with a clear reproduction. I would start as soon as you say yes.",
    estimateMinutes: 45,
    severity: "low",
    labels: ["ui"],
    confidence: 0.9,
    evidence: ["Screen recording of the flash"],
    risk: "low",
    reversible: true,
    status: "pending",
    createdAt: minutesAgo(14),
  },
  {
    id: "ask_verdict_396",
    agentId: agentIds.reviewer,
    action: "test_verdict",
    issueId: "issue_396",
    issueNumber: 396,
    title: "Verdict on #396 · Mobile nav overlaps login",
    summary: "Sign off PR #1851 as good to merge after reproducing at 375px.",
    plan: [
      "Check out `8b41d2e` from PR #1851.",
      "Reproduce at 375px with the menu open.",
      "Confirm the login button is tappable and CI is green.",
    ],
    rationale:
      "I reproduced the original bug and the fix looks right. I have not yet run it on the exact commit, so there is no test evidence attached to this ask.",
    estimateMinutes: 20,
    severity: "high",
    labels: ["ui", "mobile"],
    confidence: 0.81,
    evidence: [],
    risk: "medium",
    reversible: false,
    status: "pending",
    createdAt: minutesAgo(9),
  },
  {
    id: "ask_triage_403",
    agentId: agentIds.triager,
    action: "triage",
    issueId: "issue_403",
    issueNumber: 403,
    title: "Mark #403 a duplicate of #401",
    summary: "Close #403 as a duplicate and move the reviewer note to #401.",
    plan: [
      "Link #403 to #401 as a duplicate.",
      "Copy the signature-mismatch finding into #401 as a comment.",
      "Leave the reporter's credit with the original issue.",
    ],
    rationale:
      "Both issues come from the same payment refactor and the same account-level secret. Marking the duplicate keeps one thread of truth.",
    estimateMinutes: 10,
    severity: "high",
    labels: ["payments", "security"],
    confidence: 0.64,
    evidence: ["Diff of #401 and #403"],
    risk: "medium",
    reversible: true,
    status: "pending",
    createdAt: minutesAgo(64),
  },
];

const decidedSeeds: ProposalSeed[] = [
  {
    id: "ask_bid_400",
    agentId: agentIds.solver,
    action: "bid",
    issueId: "issue_400",
    issueNumber: 400,
    title: "Bid on #400 · Session ends after 15 minutes",
    summary: "Move the refresh rotation onto a sliding window keyed on last activity.",
    plan: ["Track last activity", "Rotate on use, keep the 12h cap", "Regression test for a 40-minute idle tab"],
    rationale: "Low-risk session change on an issue two reviewers already confirmed.",
    estimateMinutes: 30,
    severity: "medium",
    labels: ["auth", "ui"],
    confidence: 0.86,
    evidence: ["Reproduction on staging"],
    risk: "low",
    reversible: true,
    status: "auto_approved",
    createdAt: hoursAgo(18),
    decidedAt: hoursAgo(18),
  },
  {
    id: "ask_comment_388",
    agentId: agentIds.solver,
    action: "comment",
    issueId: "issue_388",
    issueNumber: 388,
    title: "Comment on #388 with the reproduction",
    summary: "Post the reproduction steps and the OAuth callback trace.",
    plan: ["Quote the failing callback", "Attach the trace"],
    rationale: "Reproduction details help the two reviewers confirm faster.",
    estimateMinutes: 5,
    severity: "critical",
    labels: ["security", "auth"],
    confidence: 0.94,
    evidence: ["OAuth callback trace"],
    risk: "low",
    reversible: true,
    status: "auto_approved",
    createdAt: daysAgo(5),
    decidedAt: daysAgo(5),
  },
  {
    id: "ask_escalate_398",
    agentId: agentIds.solver,
    action: "escalate",
    issueId: "issue_398",
    issueNumber: 398,
    title: "Escalation · production database credentials",
    summary: "Request read access to the production database to measure the real row count.",
    plan: ["Ask for a production credential", "Run a count query"],
    rationale: "The staging dataset is too small to reproduce the 1,000-row truncation.",
    estimateMinutes: 15,
    severity: "medium",
    labels: ["export", "backend"],
    confidence: 0.55,
    evidence: [],
    risk: "high",
    reversible: true,
    status: "declined",
    createdAt: daysAgo(1),
    decidedAt: daysAgo(1),
    decision: {
      kind: "decline",
      by: user.name,
      at: daysAgo(1),
      note: "Use the read replica, and seed 5k rows locally. Don't ask for production credentials again.",
    },
  },
  {
    id: "ask_bid_398",
    agentId: agentIds.solver,
    action: "bid",
    issueId: "issue_398",
    issueNumber: 398,
    title: "Bid on #398 · CSV export truncates at 1,000 rows",
    summary: "Follow the cursor to the end of the export and stream rows.",
    plan: ["Follow the cursor", "Stream rows", "Add a row count to the footer"],
    rationale: "Straightforward pagination bug with a clear acceptance check.",
    estimateMinutes: 60,
    severity: "medium",
    labels: ["export", "backend"],
    confidence: 0.78,
    evidence: ["Staging export with 4,000 rows"],
    risk: "medium",
    reversible: true,
    status: "auto_approved",
    createdAt: daysAgo(3),
    decidedAt: daysAgo(3),
    rewound: {
      at: daysAgo(3),
      by: user.name,
      reason: "Export code is shared with billing reports — I want to read this one before it moves.",
    },
  },
];

export const usage: Record<string, number> = {
  [`${agentIds.solver}:bid`]: 2,
  [`${agentIds.solver}:comment`]: 6,
  [`${agentIds.solver}:report_issue`]: 1,
  [`${agentIds.solver}:link_pr`]: 1,
  [`${agentIds.reviewer}:test_verdict`]: 3,
  [`${agentIds.reviewer}:comment`]: 4,
  [`${agentIds.triager}:triage`]: 1,
};

const modeOf = (agentId: string) =>
  agents.find((a) => a.id === agentId)?.mode ?? "act_within";

export const proposals: Proposal[] = [...proposalSeeds, ...decidedSeeds].map((seed) => ({
  ...seed,
  evaluation: evaluateProposal(
    seed as Proposal,
    rules,
    modeOf(seed.agentId),
    usage[`${seed.agentId}:${seed.action}`] ?? 0,
  ),
}));

const ruleNote = (id?: string) => rules.find((r) => r.id === id)?.note;

function entryFrom(p: Proposal, outcome: LedgerEntry["outcome"], at: string): LedgerEntry {
  return {
    id: `led_${p.id}_${outcome}`,
    at,
    agentId: p.agentId,
    agentName: agents.find((a) => a.id === p.agentId)?.name ?? "Agent",
    action: p.action,
    summary: p.title,
    outcome,
    ruleId: p.evaluation.ruleId,
    ruleNote: ruleNote(p.evaluation.ruleId),
    issueId: p.issueId,
    issueNumber: p.issueNumber,
    actor: outcome === "auto_approved" ? "agent" : "human",
  };
}

export const ledger: LedgerEntry[] = proposals
  .flatMap((p) => {
    if (p.status === "auto_approved" && p.rewound) {
      return [
        entryFrom(p, "auto_approved", p.createdAt),
        entryFrom(p, "rewound", p.rewound.at),
      ];
    }
    if (p.status === "auto_approved") return [entryFrom(p, "auto_approved", p.createdAt)];
    if (p.status === "declined") return [entryFrom(p, "declined", p.decidedAt ?? p.createdAt)];
    if (p.status === "approved") return [entryFrom(p, "approved", p.decidedAt ?? p.createdAt)];
    return [];
  })
  .concat([
    {
      id: "led_human_narrow",
      at: hoursAgo(30),
      agentId: agentIds.solver,
      agentName: "Ada's Claude",
      action: "bid",
      summary: "You narrowed bid autonomy to exclude payments",
      outcome: "approved",
      ruleId: "rule_bid_small",
      ruleNote: ruleNote("rule_bid_small"),
      actor: "human",
    },
  ])
  .sort((a, b) => +new Date(b.at) - +new Date(a.at));
