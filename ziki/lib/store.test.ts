import { beforeEach, describe, expect, it } from "vitest";
import { getDb, resetDb } from "./db";
import {
  decideAsk,
  pendingAsks,
  rewindAsk,
  setAgentMode,
  setAgentStatus,
  submitAction,
} from "./store";

const solver = "a_david_solver";

beforeEach(() => {
  resetDb();
});

describe("the consent loop", () => {
  it("turns 'allow like this' into a rule that decides the next action", () => {
    const ask = pendingAsks().find((a) => a.id === "ask_bid_401");
    expect(ask).toBeDefined();

    const result = decideAsk("ask_bid_401", "allow_like_this");
    expect(result.ok).toBe(true);

    const db = getDb();
    const rule = db.rules.find((r) => r.createdFromAskId === "ask_bid_401");
    expect(rule).toBeDefined();
    expect(rule!.effect).toBe("allow");
    expect(rule!.conditions.maxSeverity).toBe("high");

    const next = submitAction({
      agentId: solver,
      action: "bid",
      issueId: "issue_401",
      title: "Bid again on #401",
      estimateMinutes: 90,
      severity: "high",
      labels: ["payments"],
      confidence: 0.8,
      evidence: ["trace"],
      risk: "high",
    });

    expect(next.evaluation.outcome).toBe("allow");
    expect(next.evaluation.ruleId).toBe(rule!.id);
    expect(next.status).toBe("auto_approved");
  });

  it("turns 'never like this' into a block rule and refuses the next attempt", () => {
    decideAsk("ask_triage_403", "block_like_this", "Payments always needs me.");

    const attempt = submitAction({
      agentId: "a_kai_triager",
      action: "triage",
      issueId: "issue_403",
      title: "Mark #403 duplicate again",
      severity: "high",
      labels: ["payments", "security"],
      risk: "medium",
      evidence: ["diff"],
    });

    expect(attempt.evaluation.outcome).toBe("block");
    expect(attempt.status).toBe("blocked");
  });

  it("records a coaching note when an ask is declined", () => {
    decideAsk("ask_bid_401", "decline", "Use the read replica, not production.");
    const ask = getDb().proposals.find((p) => p.id === "ask_bid_401")!;
    expect(ask.status).toBe("declined");
    expect(ask.decision?.note).toContain("read replica");
    expect(pendingAsks().some((p) => p.id === "ask_bid_401")).toBe(false);
  });

  it("refuses to decide the same ask twice", () => {
    expect(decideAsk("ask_bid_401", "allow_once").ok).toBe(true);
    expect(decideAsk("ask_bid_401", "decline").ok).toBe(false);
  });

  it("pulls a queued ask back to the human", () => {
    const result = rewindAsk("ask_claim_390", "I want this one.");
    expect(result.ok).toBe(true);
    const ask = getDb().proposals.find((p) => p.id === "ask_claim_390")!;
    expect(ask.status).toBe("cancelled");
    expect(ask.rewound?.reason).toBe("I want this one.");
  });

  it("cancels in-flight work when an agent is paused", () => {
    setAgentStatus(solver, "paused");
    const inFlight = getDb().proposals.find((p) => p.id === "ask_bid_400")!;
    expect(inFlight.rewound).toBeDefined();
    expect(getDb().agents.find((a) => a.id === solver)!.status).toBe("paused");

    const attempt = submitAction({
      agentId: solver,
      action: "comment",
      issueId: "issue_401",
      title: "Reply on #401",
      risk: "low",
    });
    expect(attempt.evaluation.outcome).toBe("block");
    expect(attempt.evaluation.headline).toContain("Observe");
  });

  it("blocks side effects for an agent switched to Observe", () => {
    setAgentMode(solver, "observe");
    const attempt = submitAction({
      agentId: solver,
      action: "comment",
      issueId: "issue_401",
      title: "Reply on #401",
    });
    expect(attempt.evaluation.outcome).toBe("block");
  });

  it("queues an uncovered action with a trace and an explanation", () => {
    const attempt = submitAction({
      agentId: "a_david_reviewer",
      action: "test_verdict",
      issueId: "issue_396",
      title: "Verdict on #396",
      severity: "high",
      labels: ["ui", "mobile"],
      risk: "medium",
      evidence: [],
      confidence: 0.81,
    });
    expect(attempt.evaluation.outcome).toBe("ask");
    expect(attempt.evaluation.trace.some((s) => !s.pass)).toBe(true);
    expect(attempt.evaluation.closest?.why).toContain("evidence");
    expect(pendingAsks().some((p) => p.id === attempt.id)).toBe(true);
  });

  it("writes a ledger receipt for every unattended action", () => {
    const before = getDb().ledger.length;
    submitAction({
      agentId: solver,
      action: "comment",
      issueId: "issue_390",
      title: "Comment on #390",
      risk: "low",
      confidence: 0.9,
    });
    const db = getDb();
    expect(db.ledger.length).toBe(before + 1);
    expect(db.ledger[0].outcome).toBe("auto_approved");
    expect(db.ledger[0].ruleId).toBe("rule_comment");
  });
});
