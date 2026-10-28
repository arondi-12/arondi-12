import type {
  ActionKind,
  AutonomyMode,
  EnvelopeRule,
  Evaluation,
  Proposal,
  Risk,
  RuleConditions,
  Severity,
  TraceStep,
} from "../types";

export const SEVERITY_RANK: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export const RISK_RANK: Record<Risk, number> = { low: 1, medium: 2, high: 3 };

/** Ziki gates that stay human no matter how wide the envelope is. */
export const HUMAN_ONLY_ACTIONS: ActionKind[] = ["merge"];

export const MODE_META: Record<
  AutonomyMode,
  { label: string; blurb: string; tone: "slate" | "blue" | "amber" | "green" }
> = {
  observe: {
    label: "Observe",
    blurb: "Reads and reports to you. Takes no action on the project.",
    tone: "slate",
  },
  propose: {
    label: "Propose",
    blurb: "Every action waits for you. The classic per-action approval loop.",
    tone: "blue",
  },
  act_within: {
    label: "Act within envelope",
    blurb: "Acts alone only where your rules allow it, asks for everything else.",
    tone: "amber",
  },
  act_and_report: {
    label: "Act & report",
    blurb: "Acts freely except where a rule blocks it. Raises the review burden.",
    tone: "green",
  },
};

function severityAtMost(actual: Severity, ceiling: Severity): boolean {
  return SEVERITY_RANK[actual] <= SEVERITY_RANK[ceiling];
}

function hasAny(haystack: string[], needles: string[]): boolean {
  const set = new Set(haystack.map((h) => h.toLowerCase()));
  return needles.some((n) => set.has(n.toLowerCase()));
}

export function conditionSteps(
  proposal: Proposal,
  conditions: RuleConditions,
  usedToday = 0,
): TraceStep[] {
  const steps: TraceStep[] = [];

  if (conditions.maxSeverity) {
    steps.push({
      label: `severity ≤ ${conditions.maxSeverity}`,
      pass: severityAtMost(proposal.severity, conditions.maxSeverity),
      detail: `this issue is ${proposal.severity}`,
    });
  }
  if (conditions.labels && conditions.labels.length > 0) {
    steps.push({
      label: `labelled ${conditions.labels.join(" or ")}`,
      pass: hasAny(proposal.labels, conditions.labels),
      detail: proposal.labels.length
        ? `this issue is labelled ${proposal.labels.join(", ")}`
        : "this issue has no labels",
    });
  }
  if (conditions.excludeLabels && conditions.excludeLabels.length > 0) {
    steps.push({
      label: `not labelled ${conditions.excludeLabels.join(" or ")}`,
      pass: !hasAny(proposal.labels, conditions.excludeLabels),
      detail: hasAny(proposal.labels, conditions.excludeLabels)
        ? `this issue carries ${proposal.labels.filter((l) => hasAny([l], conditions.excludeLabels!)).join(", ")}`
        : "no excluded label present",
    });
  }
  if (typeof conditions.maxEstimateMinutes === "number") {
    steps.push({
      label: `estimate ≤ ${conditions.maxEstimateMinutes} min`,
      pass: proposal.estimateMinutes <= conditions.maxEstimateMinutes,
      detail: `the agent estimated ${proposal.estimateMinutes} min`,
    });
  }
  if (typeof conditions.minConfidence === "number") {
    steps.push({
      label: `confidence ≥ ${Math.round(conditions.minConfidence * 100)}%`,
      pass: proposal.confidence >= conditions.minConfidence,
      detail: `the agent reported ${Math.round(proposal.confidence * 100)}%`,
    });
  }
  if (conditions.requireEvidence) {
    steps.push({
      label: "carries evidence",
      pass: proposal.evidence.length > 0,
      detail: proposal.evidence.length
        ? `${proposal.evidence.length} linked artefact${proposal.evidence.length === 1 ? "" : "s"}`
        : "nothing linked yet",
    });
  }
  if (conditions.riskAtMost) {
    steps.push({
      label: `risk ≤ ${conditions.riskAtMost}`,
      pass: RISK_RANK[proposal.risk] <= RISK_RANK[conditions.riskAtMost],
      detail: `this action is ${proposal.risk} risk`,
    });
  }
  if (typeof conditions.maxPerDay === "number") {
    steps.push({
      label: `≤ ${conditions.maxPerDay} today`,
      pass: usedToday < conditions.maxPerDay,
      detail: `${usedToday} already auto-approved today`,
    });
  }

  return steps;
}

function ruleMatches(proposal: Proposal, rule: EnvelopeRule, usedToday: number) {
  const steps = conditionSteps(proposal, rule.conditions, usedToday);
  return { steps, pass: steps.every((s) => s.pass) };
}

function closeness(steps: TraceStep[]): number {
  return steps.filter((s) => s.pass).length / Math.max(steps.length, 1);
}

/**
 * Decide whether an agent may take an action on its own.
 *
 * Precedence, highest first:
 *  1. Ziki hard gates (merge stays human).
 *  2. The agent's autonomy mode (observe / propose).
 *  3. A matching `block` rule (never do this kind of thing).
 *  4. A matching `allow` rule.
 *  5. Default: ask.
 *
 * Every path returns a trace so the human can see why the rail decided what it did.
 */
export function evaluateProposal(
  proposal: Proposal,
  rules: EnvelopeRule[],
  mode: AutonomyMode,
  usedToday = 0,
): Evaluation {
  const scoped = rules.filter(
    (r) => r.active && r.agentId === proposal.agentId && r.action === proposal.action,
  );

  if (HUMAN_ONLY_ACTIONS.includes(proposal.action)) {
    return {
      outcome: "ask",
      headline: "Merges always pass a human gate.",
      trace: [
        {
          label: "Ziki merge gate",
          pass: false,
          detail: "an envelope can widen autonomy, never past a merge gate",
        },
      ],
    };
  }

  if (mode === "observe") {
    return {
      outcome: "block",
      headline: "This agent is in Observe mode, so it cannot act.",
      trace: [
        {
          label: "autonomy mode",
          pass: false,
          detail: "Observe: the agent reads and reports, it does not act",
        },
      ],
    };
  }

  const blocks = scoped.filter((r) => r.effect === "block");
  for (const rule of blocks) {
    const { steps, pass } = ruleMatches(proposal, rule, usedToday);
    if (pass) {
      return {
        outcome: "block",
        ruleId: rule.id,
        headline: "You told this agent never to do this.",
        trace: steps,
      };
    }
  }

  if (mode === "propose") {
    return {
      outcome: "ask",
      headline: "This agent is in Propose mode: every action waits for you.",
      trace: [
        {
          label: "autonomy mode",
          pass: false,
          detail: "Propose: nothing is sent without a human click",
        },
      ],
    };
  }

  const allows = scoped.filter((r) => r.effect === "allow");
  const evaluated = allows.map((rule) => ({ rule, ...ruleMatches(proposal, rule, usedToday) }));
  const matching = evaluated.find((e) => e.pass);

  if (matching) {
    return {
      outcome: "allow",
      ruleId: matching.rule.id,
      headline: matching.rule.note || "Within the envelope your owner set.",
      trace: matching.steps,
    };
  }

  if (mode === "act_and_report") {
    return {
      outcome: "allow",
      headline: "Act & report: no rule blocks this, so the agent proceeds and tells you after.",
      trace: [
        {
          label: "autonomy mode",
          pass: true,
          detail: "Act & report: only a block rule stops the agent",
        },
      ],
    };
  }

  // act_within with no matching allow rule: explain the nearest miss.
  const nearest = evaluated
    .map((e) => ({ ...e, score: closeness(e.steps) }))
    .sort((a, b) => b.score - a.score)
    .at(0);

  const failed = nearest?.steps.filter((s) => !s.pass) ?? [];
  const why =
    nearest && failed.length
      ? failed.map((s) => `${s.label}: ${s.detail}`).join("; ")
      : "no standing rule covers this kind of action yet";

  return {
    outcome: "ask",
    headline: nearest
      ? "Just outside your envelope."
      : "No rule covers this action yet, so it comes to you.",
    trace: nearest?.steps ?? [],
    closest: nearest ? { ruleId: nearest.rule.id, why } : undefined,
  };
}

/** The rule a human writes when they answer "allow always, like this". */
export function ruleFromAllow(proposal: Proposal): {
  conditions: RuleConditions;
  note: string;
} {
  const estimate = Math.ceil(proposal.estimateMinutes / 15) * 15;
  const conditions: RuleConditions = {
    maxSeverity: proposal.severity,
    maxEstimateMinutes: estimate,
    riskAtMost: proposal.risk,
    maxPerDay: 3,
  };
  return {
    conditions,
    note: `You allowed ${actionLabel(proposal.action)} at up to ${proposal.severity} severity and ${estimate} min on ${formatDay()}.`,
  };
}

/** The rule a human writes when they answer "never like this". */
export function ruleFromBlock(proposal: Proposal): {
  conditions: RuleConditions;
  note: string;
} {
  const conditions: RuleConditions =
    proposal.labels.length > 0
      ? { labels: proposal.labels, maxSeverity: "critical" }
      : { maxSeverity: proposal.severity };
  return {
    conditions,
    note: proposal.labels.length
      ? `You said never ${actionLabel(proposal.action)} on issues labelled ${proposal.labels.join(", ")}.`
      : `You said never ${actionLabel(proposal.action)} on ${proposal.severity} severity issues.`,
  };
}

const ACTION_LABELS: Record<ActionKind, string> = {
  report_issue: "file an issue",
  vote: "vote on an issue",
  comment: "comment",
  bid: "bid",
  claim: "claim work",
  link_pr: "link a pull request",
  test_verdict: "submit a test verdict",
  triage: "clear duplicates",
  merge: "merge",
  escalate: "escalate",
};

export function actionLabel(action: ActionKind): string {
  return ACTION_LABELS[action];
}

export function describeConditions(conditions: RuleConditions): string {
  const parts: string[] = [];
  if (conditions.maxSeverity) parts.push(`${conditions.maxSeverity} severity or lower`);
  if (conditions.labels?.length) parts.push(`only ${conditions.labels.join("/")}`);
  if (conditions.excludeLabels?.length) parts.push(`never ${conditions.excludeLabels.join("/")}`);
  if (conditions.maxEstimateMinutes) parts.push(`≤ ${conditions.maxEstimateMinutes} min`);
  if (conditions.minConfidence) parts.push(`≥ ${Math.round(conditions.minConfidence * 100)}% sure`);
  if (conditions.requireEvidence) parts.push("with evidence");
  if (conditions.riskAtMost) parts.push(`${conditions.riskAtMost} risk or lower`);
  if (conditions.maxPerDay) parts.push(`${conditions.maxPerDay}/day`);
  return parts.length ? parts.join(" · ") : "anything";
}

function formatDay(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
