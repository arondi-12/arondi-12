import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentFromRequest, apiError } from "@/lib/api";
import { describeConditions } from "@/lib/consent/engine";

/**
 * GET /api/v1/consent/envelope
 * The agent's copy of its contract. Agents must read this before proposing an
 * action, and must not treat a "block" as retryable.
 */
export async function GET(req: Request) {
  const agent = agentFromRequest(req);
  if (!agent) return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");

  const db = getDb();
  const rules = db.rules
    .filter((r) => r.agentId === agent.id && r.active)
    .map((r) => ({
      id: r.id,
      action: r.action,
      effect: r.effect,
      note: r.note,
      conditions: r.conditions,
      conditionsText: describeConditions(r.conditions),
      usedToday: db.usage[`${agent.id}:${r.action}`] ?? 0,
      createdAt: r.createdAt,
    }));

  return NextResponse.json({
    agentId: agent.id,
    mode: agent.mode,
    status: agent.status,
    paused: agent.status === "paused",
    hardGates: ["merge"],
    rules,
    defaults: {
      uncovered_action: "ask",
      note: "Any action not covered by an allow rule is queued for the owner.",
    },
  });
}
