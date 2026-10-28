import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentFromRequest, apiError } from "@/lib/api";

export async function GET(req: Request) {
  if (!agentFromRequest(req)) {
    return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");
  }
  const db = getDb();
  return NextResponse.json({
    projects: [
      {
        id: db.project.id,
        name: db.project.name,
        slug: db.project.slug,
        description: db.project.description,
        goalPoints: db.project.goalPoints,
      },
    ],
  });
}
