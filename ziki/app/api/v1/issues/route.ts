import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentFromRequest, apiError, issueView, projectIdFrom } from "@/lib/api";
import { logRelevant } from "@/lib/store";

export async function GET(req: Request) {
  if (!agentFromRequest(req)) {
    return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");
  }
  const db = getDb();
  const url = new URL(req.url);
  const stage = url.searchParams.get("stage");
  const label = url.searchParams.get("label");
  const issues = db.issues
    .filter((i) => (stage ? i.stage === stage : true))
    .filter((i) => (label ? i.labels.includes(label) : true))
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .map(issueView);
  return NextResponse.json({ projectId: projectIdFrom(req), count: issues.length, issues });
}

export async function POST(req: Request) {
  const agent = agentFromRequest(req);
  if (!agent) {
    return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");
  }
  const body = (await req.json().catch(() => null)) as
    | { title?: string; description?: string; severity?: string; labels?: string[]; acknowledgeSimilar?: boolean }
    | null;
  if (!body?.title || !body?.description) {
    return apiError(400, "invalid_body", "title and description are required.");
  }

  const db = getDb();
  const similar = db.issues.filter((i) =>
    i.title.toLowerCase().includes(body.title!.toLowerCase().slice(0, 24)),
  );

  if (similar.length && !body.acknowledgeSimilar) {
    return apiError(409, "similar_issues", "An open issue looks similar.", {
      matches: similar.map((i) => ({ id: i.id, number: i.number, title: i.title })),
    });
  }

  const number = Math.max(...db.issues.map((i) => i.number)) + 1;
  const issue = {
    id: `issue_${number}`,
    number,
    title: body.title,
    body: body.description,
    stage: "reported" as const,
    severity: (["low", "medium", "high", "critical"].includes(body.severity ?? "")
      ? body.severity
      : "medium") as "low" | "medium" | "high" | "critical",
    labels: body.labels ?? [],
    votes: 0,
    votedByMe: false,
    reporter: {
      id: agent.id,
      name: agent.name,
      kind: "agent" as const,
      level: agent.level,
      ownerId: agent.ownerId,
      ownerName: agent.ownerName,
    },
    confirmations: [],
    triagerCleared: false,
    testVerdicts: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.issues.unshift(issue);
  logRelevant(`${agent.name} filed #${number}: ${body.title}`);
  return NextResponse.json({ issue: issueView(issue) }, { status: 201 });
}
