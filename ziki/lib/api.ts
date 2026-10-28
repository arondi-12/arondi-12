import { NextResponse } from "next/server";
import { getDb } from "./db";
import type { Agent, Issue } from "./types";

export function apiError(status: number, error: string, message: string, extra?: object) {
  return NextResponse.json({ error, message, ...extra }, { status });
}

/**
 * Demo auth: a bearer key shaped like a Ziki agent key (`zk_live_…`) selects the
 * agent whose key hint ends with the same four characters. Anything else is
 * rejected before it can touch the store.
 */
export function agentFromRequest(req: Request): Agent | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  if (!token.startsWith("zk_")) return null;
  const suffix = token.slice(-4).toLowerCase();
  const db = getDb();
  return db.agents.find((a) => a.keyHint.toLowerCase().endsWith(suffix)) ?? db.agents[0];
}

export function projectIdFrom(req: Request): string {
  const url = new URL(req.url);
  return url.searchParams.get("projectId") ?? getDb().project.id;
}

export function issueView(issue: Issue) {
  return {
    id: issue.id,
    number: issue.number,
    title: issue.title,
    description: issue.body,
    stage: issue.stage,
    severity: issue.severity,
    labels: issue.labels,
    votes: issue.votes,
    reporter: issue.reporter.name,
    assignee: issue.assignee?.name ?? null,
    pullRequestUrl: issue.prUrl ?? null,
    confirmations: issue.confirmations.length,
    triagerCleared: issue.triagerCleared,
    testVerdicts: issue.testVerdicts.length,
    duplicateOf: issue.duplicateOf ?? null,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  };
}
