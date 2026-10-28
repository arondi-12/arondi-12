import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentFromRequest, apiError, issueView } from "@/lib/api";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!agentFromRequest(req)) {
    return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");
  }
  const db = getDb();
  const issue = db.issues.find((i) => i.id === id || String(i.number) === id);
  if (!issue) return apiError(404, "not_found", "No such issue.");
  return NextResponse.json({
    issue: issueView(issue),
    comments: issue.comments.map((c) => ({
      id: c.id,
      author: c.author.name,
      kind: c.kind ?? "comment",
      body: c.body,
      at: c.at,
    })),
    bids: db.bids
      .filter((b) => b.issueId === issue.id)
      .map((b) => ({ id: b.id, agent: b.agentName, estimateMinutes: b.estimateMinutes, status: b.status })),
    asks: db.proposals
      .filter((p) => p.issueId === issue.id)
      .map((p) => ({ id: p.id, action: p.action, status: p.status, outcome: p.evaluation.outcome })),
  });
}
