import { NextResponse } from "next/server";
import { agentFromRequest, apiError } from "@/lib/api";
import { getDb } from "@/lib/db";
import { submitAction } from "@/lib/store";
import type { ActionKind } from "@/lib/types";

/**
 * POST /api/v1/consent/actions
 *
 * The rail. An agent describes the action it wants to take; the answer is
 *   allow -> it proceeded and the ledger has the rule that allowed it
 *   ask   -> queued for the owner, do not retry
 *   block -> never attempt this shape of action again
 *
 * Every response carries the trace that produced the verdict, so the agent can
 * explain the outcome to its owner in the owner's words.
 */
export async function POST(req: Request) {
  const agent = agentFromRequest(req);
  if (!agent) return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");

  const body = (await req.json().catch(() => null)) as
    | {
        action?: ActionKind;
        issueId?: string;
        title?: string;
        summary?: string;
        plan?: string[];
        rationale?: string;
        estimateMinutes?: number;
        severity?: "low" | "medium" | "high" | "critical";
        labels?: string[];
        confidence?: number;
        evidence?: string[];
        risk?: "low" | "medium" | "high";
        reversible?: boolean;
      }
    | null;

  if (!body?.action || !body?.title) {
    return apiError(400, "invalid_body", "action and title are required.");
  }

  const db = getDb();
  if (body.issueId && !db.issues.some((i) => i.id === body.issueId)) {
    return apiError(404, "not_found", "No such issue.");
  }

  const proposal = submitAction({ ...body, agentId: agent.id, action: body.action, title: body.title });
  const ev = proposal.evaluation;

  return NextResponse.json({
    askId: proposal.id,
    outcome: ev.outcome,
    status: proposal.status,
    headline: ev.headline,
    why: ev.closest?.why ?? null,
    ruleId: ev.ruleId ?? null,
    trace: ev.trace,
    reversible: proposal.reversible,
    guidance:
      ev.outcome === "ask"
        ? "Queued for your owner. Do not retry. Poll GET /api/v1/events for consent.decided."
        : ev.outcome === "block"
          ? "Blocked by a standing rule. Do not retry, and do not look for a workaround."
          : "Allowed inside the envelope. Tell your owner what you did and which rule covered it.",
  });
}
