// Shared domain types for the Ziki reproduction and the Consent Rail layer.

export type ActorKind = "human" | "agent";

export type AgentLevel =
  | "observer"
  | "contributor"
  | "triager"
  | "reviewer"
  | "dispatcher"
  | "merger";

export type Severity = "low" | "medium" | "high" | "critical";

export type IssueStage =
  | "reported"
  | "confirmed"
  | "authorized"
  | "delivered"
  | "proven"
  | "merged";

export interface Actor {
  id: string;
  name: string;
  kind: ActorKind;
  level?: AgentLevel;
  ownerId?: string;
  ownerName?: string;
}

export interface Confirmation {
  reviewerName: string;
  reviewerOwnerId: string;
  verdict: "accept" | "reject";
  severity: Severity;
  at: string;
}

export interface TestVerdict {
  testerName: string;
  goodToMerge: boolean;
  commit?: string;
  at: string;
}

export interface Issue {
  id: string;
  number: number;
  title: string;
  body: string;
  stage: IssueStage;
  severity: Severity;
  labels: string[];
  votes: number;
  votedByMe: boolean;
  reporter: Actor;
  assignee?: Actor;
  prUrl?: string;
  prChecks?: number;
  confirmations: Confirmation[];
  triagerCleared: boolean;
  duplicateOf?: string;
  testVerdicts: TestVerdict[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  author: Actor;
  body: string;
  kind?: "comment" | "bid" | "approval" | "escalation";
  at: string;
}

export interface Bid {
  id: string;
  issueId: string;
  agentId: string;
  agentName: string;
  ownerName: string;
  estimateMinutes: number;
  approach: string;
  status: "pending" | "awarded" | "withdrawn";
  at: string;
}

export interface Agent {
  id: string;
  name: string;
  model: string;
  level: AgentLevel;
  ownerId: string;
  ownerName: string;
  instructions: string;
  mode: AutonomyMode;
  status: "active" | "paused";
  lastSeenAt: string;
  pairedAt: string;
  keyHint: string;
}


export type ActionKind =
  | "report_issue"
  | "vote"
  | "comment"
  | "bid"
  | "claim"
  | "link_pr"
  | "test_verdict"
  | "triage"
  | "merge"
  | "escalate";

export type AutonomyMode = "observe" | "propose" | "act_within" | "act_and_report";

export type Risk = "low" | "medium" | "high";

export type RuleEffect = "allow" | "ask" | "block";

export interface RuleConditions {
  /** Highest severity this rule will cover. */
  maxSeverity?: Severity;
  /** If set, at least one of these labels must be present. */
  labels?: string[];
  /** If any of these labels is present the condition fails. */
  excludeLabels?: string[];
  /** Longest estimate the human is willing to auto-authorize. */
  maxEstimateMinutes?: number;
  /** Minimum agent-reported confidence (0-1) required. */
  minConfidence?: number;
  /** Cap on auto-approved actions of this kind per UTC day. */
  maxPerDay?: number;
  /** Require at least one linked piece of evidence (PR, log, screenshot). */
  requireEvidence?: boolean;
  /** Highest risk tier the rule will cover. */
  riskAtMost?: Risk;
}

export interface EnvelopeRule {
  id: string;
  agentId: string;
  action: ActionKind;
  effect: RuleEffect;
  conditions: RuleConditions;
  /** Plain-language reason shown to the human, authored when the rule was made. */
  note: string;
  active: boolean;
  createdAt: string;
  /** Provenance: which ask taught this rule, if any. */
  createdFromAskId?: string;
}

export interface TraceStep {
  label: string;
  pass: boolean;
  detail: string;
}

export interface Evaluation {
  outcome: RuleEffect;
  /** The rule that decided the outcome, when one did. */
  ruleId?: string;
  headline: string;
  trace: TraceStep[];
  /** When the answer is "ask", the nearest allow rule and why it stopped short. */
  closest?: { ruleId: string; why: string };
}

export type AskStatus =
  | "auto_approved"
  | "pending"
  | "approved"
  | "declined"
  | "blocked"
  | "cancelled";

export interface Decision {
  kind: "allow_once" | "allow_like_this" | "decline" | "block_like_this";
  by: string;
  at: string;
  note?: string;
  /** Rule written by an allow_like_this / block_like_this decision. */
  ruleId?: string;
}

export interface Proposal {
  id: string;
  agentId: string;
  action: ActionKind;
  issueId?: string;
  issueNumber?: number;
  title: string;
  /** What the agent wants to do, in the human's words. */
  summary: string;
  /** The agent's step-by-step plan. */
  plan: string[];
  rationale: string;
  estimateMinutes: number;
  severity: Severity;
  labels: string[];
  confidence: number;
  evidence: string[];
  risk: Risk;
  reversible: boolean;
  status: AskStatus;
  evaluation: Evaluation;
  createdAt: string;
  decidedAt?: string;
  decision?: Decision;
  /** Set when a human pauses the agent and pulls the work back. */
  rewound?: { at: string; by: string; reason: string };
}

export interface LedgerEntry {
  id: string;
  at: string;
  agentId: string;
  agentName: string;
  action: ActionKind;
  summary: string;
  outcome: "auto_approved" | "approved" | "declined" | "blocked" | "rewound";
  ruleId?: string;
  ruleNote?: string;
  issueId?: string;
  issueNumber?: number;
  actor: "agent" | "human";
}

export interface EventRecord {
  id: string;
  type: string;
  at: string;
  summary: string;
  issueId?: string;
  issueNumber?: number;
  actor: string;
  channel: "person" | "agent";
}

export interface PointEntry {
  id: string;
  at: string;
  role: "Solver" | "Reporter" | "Reviewer" | "Triager" | "Dispatcher";
  reason: string;
  issueNumber: number;
  points: number;
  owner: string;
  sourceKey: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  goalPoints: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  role: "admin" | "member";
}

export interface Db {
  project: Project;
  user: User;
  agents: Agent[];
  issues: Issue[];
  bids: Bid[];
  events: EventRecord[];
  proposals: Proposal[];
  rules: EnvelopeRule[];
  ledger: LedgerEntry[];
  points: PointEntry[];
  /** Per-agent, per-action count of auto-approvals today (UTC). */
  usage: Record<string, number>;
}
