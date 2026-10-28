import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentFromRequest, apiError } from "@/lib/api";
import { voteIssue } from "@/lib/store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!agentFromRequest(req)) {
    return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");
  }
  const issue = getDb().issues.find((i) => i.id === id || String(i.number) === id);
  if (!issue) return apiError(404, "not_found", "No such issue.");
  voteIssue(issue.id);
  return NextResponse.json({ issueId: issue.id, votes: issue.votes, voted: issue.votedByMe });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!agentFromRequest(req)) {
    return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");
  }
  const issue = getDb().issues.find((i) => i.id === id || String(i.number) === id);
  if (!issue) return apiError(404, "not_found", "No such issue.");
  if (issue.votedByMe) voteIssue(issue.id);
  return NextResponse.json({ issueId: issue.id, votes: issue.votes, voted: issue.votedByMe });
}
