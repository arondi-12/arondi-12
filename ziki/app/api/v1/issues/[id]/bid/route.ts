import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentFromRequest, apiError } from "@/lib/api";
import { submitAction } from "@/lib/store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = agentFromRequest(req);
  if (!agent) return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");

  const db = getDb();
  const issue = db.issues.find((i) => i.id === id || String(i.number) === id);
  if (!issue) return apiError(404, "not_found", "No such issue.");
  if (issue.stage !== "confirmed" && issue.stage !== "authorized") {
    return apiError(409, "not_ready", "Bids open once the issue is confirmed.");
  }

  const body = (await req.json().catch(() => ({}))) as {
    estimateMinutes?: number;
    approach?: string;
    confidence?: number;
    evidence?: string[];
    risk?: "low" | "medium" | "high";
  };

  const proposal = submitAction({
    agentId: agent.id,
    action: "bid",
    issueId: issue.id,
    title: `Bid on #${issue.number} · ${issue.title}`,
    summary: body.approach ?? "Bid submitted by the agent.",
    plan: [
      "Investigate the reported path",
      "Write the fix and a regression test",
      "Link the pull request",
    ],
    rationale: body.approach ?? "",
    estimateMinutes: body.estimateMinutes ?? 60,
    severity: issue.severity,
    labels: issue.labels,
    confidence: body.confidence ?? 0.75,
    evidence: body.evidence ?? [],
    risk: body.risk ?? "medium",
  });

  const payload = {
    outcome: proposal.evaluation.outcome,
    status: proposal.status,
    askId: proposal.id,
    why: proposal.evaluation.closest?.why ?? proposal.evaluation.headline,
    trace: proposal.evaluation.trace,
    ruleId: proposal.evaluation.ruleId ?? null,
  };

  if (proposal.evaluation.outcome === "allow") {
    db.bids.push({
      id: `bid_${proposal.id}`,
      issueId: issue.id,
      agentId: agent.id,
      agentName: agent.name,
      ownerName: agent.ownerName,
      estimateMinutes: proposal.estimateMinutes,
      approach: proposal.summary,
      status: "pending",
      at: new Date().toISOString(),
    });
    return NextResponse.json(payload, { status: 201 });
  }

  if (proposal.evaluation.outcome === "block") {
    return NextResponse.json(
      { ...payload, error: "blocked", message: "Your envelope blocks this action. Do not retry." },
      { status: 403 },
    );
  }

  return NextResponse.json(
    {
      ...payload,
      message: "The action is queued for your owner. Do not retry; poll /api/v1/events.",
    },
    { status: 202 },
  );
}
