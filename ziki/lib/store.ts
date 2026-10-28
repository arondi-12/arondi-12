import { getDb } from "./db";
import { evaluateProposal, ruleFromAllow, ruleFromBlock, actionLabel } from "./consent/engine";
import type {
  ActionKind,
  Agent,
  AgentLevel,
  AskStatus,
  Decision,
  EnvelopeRule,
  EventRecord,
  Proposal,
  RuleConditions,
  RuleEffect,
} from "./types";

let counter = 0;
function id(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter}`;
}

function now(): string {
  return new Date().toISOString();
}

function usageKey(agentId: string, action: ActionKind) {
  return `${agentId}:${action}`;
}

function logEvent(entry: Omit<EventRecord, "id" | "at">) {
  getDb().events.unshift({ id: id("ev"), at: now(), ...entry });
}

function logLedger(entry: {
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
}) {
  getDb().ledger.unshift({ id: id("led"), at: now(), ...entry });
}

export function agentById(agentId: string): Agent | undefined {
  return getDb().agents.find((a) => a.id === agentId);
}

export function rulesFor(agentId: string): EnvelopeRule[] {
  return getDb().rules.filter((r) => r.agentId === agentId);
}

export function pendingAsks(ownerId?: string): Proposal[] {
  const db = getDb();
  return db.proposals
    .filter((p) => p.status === "pending")
    .filter((p) => {
      if (!ownerId) return true;
      const agent = db.agents.find((a) => a.id === p.agentId);
      return agent?.ownerId === ownerId;
    })
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
}

export function decideAsk(
  askId: string,
  kind: Decision["kind"],
  note?: string,
): { ok: boolean; message: string } {
  const db = getDb();
  const ask = db.proposals.find((p) => p.id === askId);
  if (!ask) return { ok: false, message: "That request no longer exists." };
  if (ask.status !== "pending") return { ok: false, message: "That request was already decided." };

  const agent = agentById(ask.agentId);
  const decidedAt = now();
  let rule: EnvelopeRule | undefined;

  if (kind === "allow_once" || kind === "allow_like_this") {
    if (kind === "allow_like_this") {
      const spec = ruleFromAllow(ask);
      rule = {
        id: id("rule"),
        agentId: ask.agentId,
        action: ask.action,
        effect: "allow",
        conditions: spec.conditions,
        note: spec.note,
        active: true,
        createdAt: decidedAt,
        createdFromAskId: ask.id,
      };
      db.rules.push(rule);
    }
    ask.status = "approved";
  } else if (kind === "decline") {
    ask.status = "declined";
  } else {
    const spec = ruleFromBlock(ask);
    rule = {
      id: id("rule"),
      agentId: ask.agentId,
      action: ask.action,
      effect: "block",
      conditions: spec.conditions,
      note: spec.note,
      active: true,
      createdAt: decidedAt,
      createdFromAskId: ask.id,
    };
    db.rules.push(rule);
    ask.status = "blocked";
  }

  ask.decidedAt = decidedAt;
  ask.decision = { kind, by: db.user.name, at: decidedAt, note, ruleId: rule?.id };

  logLedger({
    agentId: ask.agentId,
    agentName: agent?.name ?? "Agent",
    action: ask.action,
    summary: ask.title,
    outcome:
      kind === "decline" ? "declined" : kind === "block_like_this" ? "blocked" : "approved",
    ruleId: rule?.id ?? ask.evaluation.ruleId,
    ruleNote: rule?.note,
    issueId: ask.issueId,
    issueNumber: ask.issueNumber,
    actor: "human",
  });

  logEvent({
    type: "consent.decided",
    summary:
      kind === "allow_once"
        ? `You allowed ${ask.title.toLowerCase()} once`
        : kind === "allow_like_this"
          ? `You allowed ${actionLabel(ask.action)} like this from now on`
          : kind === "decline"
            ? `You declined ${ask.title.toLowerCase()}`
            : `You blocked ${actionLabel(ask.action)} like this from now on`,
    issueId: ask.issueId,
    issueNumber: ask.issueNumber,
    actor: db.user.name,
    channel: "person",
  });

  return { ok: true, message: "Decision recorded." };
}

export function rewindAsk(
  askId: string,
  reason: string,
  by = getDb().user.name,
): { ok: boolean; message: string } {
  const db = getDb();
  const ask = db.proposals.find((p) => p.id === askId);
  if (!ask) return { ok: false, message: "No such action." };
  if (ask.status === "pending") {
    ask.status = "cancelled";
    ask.decidedAt = now();
    ask.decision = { kind: "decline", by, at: now(), note: reason };
  }
  ask.rewound = { at: now(), by, reason };

  logLedger({
    agentId: ask.agentId,
    agentName: agentById(ask.agentId)?.name ?? "Agent",
    action: ask.action,
    summary: ask.title,
    outcome: "rewound",
    issueId: ask.issueId,
    issueNumber: ask.issueNumber,
    actor: "human",
  });

  logEvent({
    type: "consent.rewound",
    summary: `You pulled back: ${ask.title}`,
    issueId: ask.issueId,
    issueNumber: ask.issueNumber,
    actor: by,
    channel: "person",
  });

  return { ok: true, message: "Action pulled back to you." };
}

export function setAgentMode(agentId: string, mode: Agent["mode"]) {
  const agent = agentById(agentId);
  if (!agent) return;
  agent.mode = mode;
  logEvent({
    type: "consent.mode_changed",
    summary: `${agent.name} is now in ${mode.replace("_", " ")} mode`,
    actor: getDb().user.name,
    channel: "person",
  });
}

export function setAgentStatus(agentId: string, status: Agent["status"]) {
  const agent = agentById(agentId);
  if (!agent) return;
  agent.status = status;
  if (status === "paused") {
    // Pausing is a hard stop: in-flight wins are pulled back, queued asks wait.
    for (const p of [...getDb().proposals]) {
      if (p.agentId === agentId && p.status === "auto_approved" && !p.rewound) {
        rewindAsk(p.id, "Agent paused by its owner.");
      }
    }
  }
  logEvent({
    type: status === "paused" ? "consent.agent_paused" : "consent.agent_resumed",
    summary:
      status === "paused"
        ? `${agent.name} was paused and its in-flight work pulled back`
        : `${agent.name} resumed`,
    actor: getDb().user.name,
    channel: "person",
  });
}

export function setRuleActive(ruleId: string, active: boolean) {
  const rule = getDb().rules.find((r) => r.id === ruleId);
  if (rule) rule.active = active;
}

export function addRule(input: {
  agentId: string;
  action: ActionKind;
  effect: RuleEffect;
  conditions: RuleConditions;
  note: string;
}) {
  getDb().rules.push({
    id: id("rule"),
    ...input,
    active: true,
    createdAt: now(),
  });
  logEvent({
    type: "consent.rule_added",
    summary: `${getDb().user.name} added a rule: ${input.note}`,
    actor: getDb().user.name,
    channel: "person",
  });
}

export function updateInstructions(agentId: string, instructions: string) {
  const agent = agentById(agentId);
  if (agent) agent.instructions = instructions;
}

export function voteIssue(issueId: string) {
  const issue = getDb().issues.find((i) => i.id === issueId);
  if (!issue) return;
  issue.votedByMe = !issue.votedByMe;
  issue.votes += issue.votedByMe ? 1 : -1;
  logEvent({
    type: issue.votedByMe ? "issue.voted" : "issue.unvoted",
    summary: `${getDb().user.name} ${issue.votedByMe ? "upvoted" : "removed a vote from"} #${issue.number}`,
    issueId: issue.id,
    issueNumber: issue.number,
    actor: getDb().user.name,
    channel: "person",
  });
}

export function addComment(issueId: string, body: string) {
  const db = getDb();
  const issue = db.issues.find((i) => i.id === issueId);
  if (!issue || !body.trim()) return;
  issue.comments.push({
    id: id("c"),
    author: { id: db.user.id, name: db.user.name, kind: "human" },
    body: body.trim(),
    kind: "comment",
    at: now(),
  });
  issue.updatedAt = now();
  logEvent({
    type: "issue.commented",
    summary: `${db.user.name} commented on #${issue.number}`,
    issueId: issue.id,
    issueNumber: issue.number,
    actor: db.user.name,
    channel: "person",
  });
}

export interface IncomingAction {
  agentId: string;
  action: ActionKind;
  issueId?: string;
  title: string;
  summary?: string;
  plan?: string[];
  rationale?: string;
  estimateMinutes?: number;
  severity?: Proposal["severity"];
  labels?: string[];
  confidence?: number;
  evidence?: string[];
  risk?: Proposal["risk"];
  reversible?: boolean;
}

/**
 * The rail every agent action goes through. Returns the proposal with the
 * evaluation that decided it: auto-approved, queued as a question, or blocked.
 */
export function submitAction(input: IncomingAction): Proposal {
  const db = getDb();
  const agent = agentById(input.agentId);
  const issue = input.issueId ? db.issues.find((i) => i.id === input.issueId) : undefined;

  const base: Proposal = {
    id: id("ask"),
    agentId: input.agentId,
    action: input.action,
    issueId: issue?.id,
    issueNumber: issue?.number,
    title: input.title,
    summary: input.summary ?? input.title,
    plan: input.plan ?? [],
    rationale: input.rationale ?? "",
    estimateMinutes: input.estimateMinutes ?? 0,
    severity: input.severity ?? issue?.severity ?? "medium",
    labels: input.labels ?? issue?.labels ?? [],
    confidence: input.confidence ?? 0.8,
    evidence: input.evidence ?? [],
    risk: input.risk ?? "low",
    reversible: input.reversible ?? true,
    status: "pending",
    evaluation: { outcome: "ask", headline: "", trace: [] },
    createdAt: now(),
  };

  const mode = !agent || agent.status === "paused" ? "observe" : agent.mode;
  const used = db.usage[usageKey(input.agentId, input.action)] ?? 0;
  const evaluation = evaluateProposal(base, db.rules, mode, used);
  base.evaluation = evaluation;

  if (evaluation.outcome === "allow") {
    base.status = "auto_approved";
    base.decidedAt = base.createdAt;
    db.usage[usageKey(input.agentId, input.action)] = used + 1;
    logLedger({
      agentId: base.agentId,
      agentName: agent?.name ?? "Agent",
      action: base.action,
      summary: base.title,
      outcome: "auto_approved",
      ruleId: evaluation.ruleId,
      ruleNote: db.rules.find((r) => r.id === evaluation.ruleId)?.note,
      issueId: base.issueId,
      issueNumber: base.issueNumber,
      actor: "agent",
    });
    logEvent({
      type: "consent.auto_approved",
      summary: `${agent?.name ?? "Agent"} acted inside the envelope: ${base.title}`,
      issueId: base.issueId,
      issueNumber: base.issueNumber,
      actor: agent?.name ?? "Agent",
      channel: "agent",
    });
  } else if (evaluation.outcome === "block") {
    base.status = "blocked";
    base.decidedAt = base.createdAt;
    logLedger({
      agentId: base.agentId,
      agentName: agent?.name ?? "Agent",
      action: base.action,
      summary: base.title,
      outcome: "blocked",
      ruleId: evaluation.ruleId,
      ruleNote: db.rules.find((r) => r.id === evaluation.ruleId)?.note,
      issueId: base.issueId,
      issueNumber: base.issueNumber,
      actor: "agent",
    });
  } else {
    base.status = "pending";
    logEvent({
      type: "consent.asked",
      summary: `${agent?.name ?? "Agent"} asked: ${base.title}`,
      issueId: base.issueId,
      issueNumber: base.issueNumber,
      actor: agent?.name ?? "Agent",
      channel: "agent",
    });
  }

  db.proposals.push(base);
  return base;
}

export function addAgent(input: {
  name: string;
  model: string;
  level: AgentLevel;
  instructions: string;
}): Agent {
  const db = getDb();
  const agent: Agent = {
    id: id("agent"),
    name: input.name,
    model: input.model,
    level: input.level,
    ownerId: db.user.id,
    ownerName: db.user.name,
    instructions: input.instructions,
    mode: "propose",
    status: "active",
    lastSeenAt: now(),
    pairedAt: now(),
    keyHint: `zk_live_…${Math.random().toString(36).slice(2, 6)}`,
  };
  db.agents.push(agent);
  logEvent({
    type: "agent.paired",
    summary: `${db.user.name} paired ${agent.name} as ${agent.level}`,
    actor: db.user.name,
    channel: "person",
  });
  return agent;
}

export function statusLabel(status: AskStatus): string {
  switch (status) {
    case "auto_approved":
      return "Auto-approved";
    case "pending":
      return "Waiting on you";
    case "approved":
      return "Allowed";
    case "declined":
      return "Declined";
    case "blocked":
      return "Blocked";
    case "cancelled":
      return "Pulled back";
  }
}

/** Small helper for routes that record a plain project event. */
export function logRelevant(
  summary: string,
  type = "issue.created",
  actor = "Agent",
): void {
  logEvent({ type, summary, actor, channel: "agent" });
}
