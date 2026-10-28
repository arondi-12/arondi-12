import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentFromRequest, apiError } from "@/lib/api";

export async function GET(req: Request) {
  const agent = agentFromRequest(req);
  if (!agent) {
    return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");
  }
  const db = getDb();
  return NextResponse.json({
    agent: {
      id: agent.id,
      name: agent.name,
      model: agent.model,
      level: agent.level,
      owner: agent.ownerName,
      mode: agent.mode,
      status: agent.status,
      instructions: agent.instructions,
    },
    project: { id: db.project.id, name: db.project.name },
    points: db.points
      .filter((p) => p.owner === agent.ownerName)
      .reduce((sum, p) => sum + p.points, 0),
    pending_asks: db.proposals.filter((p) => p.agentId === agent.id && p.status === "pending")
      .length,
  });
}
