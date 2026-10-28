import { describe, expect, it } from "vitest";
import {
  conditionSteps,
  describeConditions,
  evaluateProposal,
  ruleFromAllow,
  ruleFromBlock,
} from "./engine";
import type { EnvelopeRule, Proposal } from "../types";

function rule(overrides: Partial<EnvelopeRule>): EnvelopeRule {
  return {
    id: "rule_test",
    agentId: "a1",
    action: "bid",
    effect: "allow",
    conditions: {},
    note: "test rule",
    active: true,
    createdAt: "2026-10-01T00:00:00.000Z",
    ...overrides,
  };
}

function proposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: "p1",
    agentId: "a1",
    action: "bid",
    title: "Bid on #401",
    summary: "Carry the idempotency key into the retry path.",
    plan: [],
    rationale: "",
    estimateMinutes: 30,
    severity: "low",
    labels: ["ui"],
    confidence: 0.9,
    evidence: ["trace"],
    risk: "low",
    reversible: true,
    status: "pending",
    evaluation: { outcome: "ask", headline: "", trace: [] },
    createdAt: "2026-10-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("evaluateProposal", () => {
  it("allows an action that matches every condition", () => {
    const result = evaluateProposal(
      proposal(),
      [
        rule({
          conditions: {
            maxSeverity: "medium",
            maxEstimateMinutes: 45,
            excludeLabels: ["payments"],
            maxPerDay: 3,
          },
        }),
      ],
      "act_within",
      2,
    );
    expect(result.outcome).toBe("allow");
    expect(result.ruleId).toBe("rule_test");
    expect(result.trace.every((s) => s.pass)).toBe(true);
  });

  it("asks when a condition fails and explains the nearest rule", () => {
    const result = evaluateProposal(
      proposal({ severity: "high", labels: ["payments"], estimateMinutes: 90 }),
      [
        rule({
          conditions: {
            maxSeverity: "medium",
            maxEstimateMinutes: 45,
            excludeLabels: ["payments"],
          },
        }),
      ],
      "act_within",
      0,
    );
    expect(result.outcome).toBe("ask");
    expect(result.closest?.ruleId).toBe("rule_test");
    expect(result.closest?.why).toContain("high");
    expect(result.closest?.why).toContain("payments");
    expect(result.closest?.why).toContain("90 min");
  });

  it("asks when nothing covers the action", () => {
    const result = evaluateProposal(proposal(), [], "act_within", 0);
    expect(result.outcome).toBe("ask");
    expect(result.closest).toBeUndefined();
    expect(result.headline).toContain("No rule");
  });

  it("lets a block rule win over an allow rule", () => {
    const result = evaluateProposal(
      proposal(),
      [
        rule({ id: "allow", effect: "allow", conditions: {} }),
        rule({ id: "block", effect: "block", conditions: { labels: ["ui"] } }),
      ],
      "act_within",
      0,
    );
    expect(result.outcome).toBe("block");
    expect(result.ruleId).toBe("block");
  });

  it("keeps merges behind a human gate whatever the envelope says", () => {
    const result = evaluateProposal(
      proposal({ action: "merge" }),
      [rule({ action: "merge", effect: "allow", conditions: {} })],
      "act_and_report",
      0,
    );
    expect(result.outcome).toBe("ask");
    expect(result.headline).toContain("Merges");
  });

  it("blocks everything for an agent in Observe mode", () => {
    const result = evaluateProposal(proposal(), [rule({})], "observe", 0);
    expect(result.outcome).toBe("block");
    expect(result.headline).toContain("Observe");
  });

  it("asks for everything in Propose mode, even inside a rule", () => {
    const result = evaluateProposal(proposal(), [rule({})], "propose", 0);
    expect(result.outcome).toBe("ask");
    expect(result.headline).toContain("Propose");
  });

  it("allows in Act & report when no block rule matches", () => {
    const result = evaluateProposal(proposal(), [], "act_and_report", 0);
    expect(result.outcome).toBe("allow");
    expect(result.trace[0].label).toContain("autonomy mode");
  });

  it("respects the daily cap", () => {
    const rules = [rule({ conditions: { maxPerDay: 2 } })];
    expect(evaluateProposal(proposal(), rules, "act_within", 1).outcome).toBe("allow");
    const capped = evaluateProposal(proposal(), rules, "act_within", 2);
    expect(capped.outcome).toBe("ask");
    expect(capped.closest?.why).toContain("2 already auto-approved");
  });

  it("requires evidence when the rule asks for it", () => {
    const rules = [rule({ conditions: { requireEvidence: true } })];
    expect(evaluateProposal(proposal({ evidence: [] }), rules, "act_within", 0).outcome).toBe("ask");
    expect(evaluateProposal(proposal({ evidence: ["ci"] }), rules, "act_within", 0).outcome).toBe(
      "allow",
    );
  });

  it("ignores inactive rules", () => {
    const rules = [rule({ active: false })];
    expect(evaluateProposal(proposal(), rules, "act_within", 0).outcome).toBe("ask");
  });
});

describe("conditionSteps", () => {
  it("reports each condition with a human sentence", () => {
    const steps = conditionSteps(
      proposal({ estimateMinutes: 90 }),
      { maxEstimateMinutes: 45, labels: ["payments"] },
      0,
    );
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({ pass: false, detail: "this issue is labelled ui" });
    expect(steps[1]).toMatchObject({ pass: false, detail: "the agent estimated 90 min" });
  });
});

describe("rule generation", () => {
  it("writes an allow rule no wider than the ask that taught it", () => {
    const { conditions, note } = ruleFromAllow(
      proposal({ severity: "high", estimateMinutes: 47, risk: "medium" }),
    );
    expect(conditions.maxSeverity).toBe("high");
    expect(conditions.maxEstimateMinutes).toBe(60);
    expect(conditions.riskAtMost).toBe("medium");
    expect(conditions.maxPerDay).toBe(3);
    expect(note).toContain("You allowed");
  });

  it("writes a block rule for the ask's labels", () => {
    const { conditions } = ruleFromBlock(proposal({ labels: ["payments", "security"] }));
    expect(conditions.labels).toEqual(["payments", "security"]);
    expect(conditions.maxSeverity).toBe("critical");
  });

  it("falls back to severity when the ask has no labels", () => {
    const { conditions } = ruleFromBlock(proposal({ labels: [], severity: "critical" }));
    expect(conditions.labels).toBeUndefined();
    expect(conditions.maxSeverity).toBe("critical");
  });
});

describe("describeConditions", () => {
  it("renders a readable summary", () => {
    const text = describeConditions({
      maxSeverity: "medium",
      excludeLabels: ["payments"],
      maxEstimateMinutes: 45,
      maxPerDay: 3,
    });
    expect(text).toBe("medium severity or lower · never payments · ≤ 45 min · 3/day");
  });

  it("says anything when unbounded", () => {
    expect(describeConditions({})).toBe("anything");
  });
});
