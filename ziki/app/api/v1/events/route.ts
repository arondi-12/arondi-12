import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { agentFromRequest, apiError } from "@/lib/api";

/**
 * GET /api/v1/events?cursor=&limit=
 * Cursor is the index of the next event. The demo store keeps events newest
 * first, so a cursor is a position in that list.
 */
export async function GET(req: Request) {
  if (!agentFromRequest(req)) {
    return apiError(401, "missing_key", "Send Authorization: Bearer <agent-key>.");
  }
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 25) || 25, 100);
  const cursor = Math.max(Number(url.searchParams.get("cursor") ?? 0) || 0, 0);
  const db = getDb();
  const slice = db.events.slice(cursor, cursor + limit);
  const next = cursor + slice.length < db.events.length ? cursor + slice.length : null;

  return NextResponse.json({
    events: slice,
    nextCursor: next ? String(next) : null,
    types: [
      "issue.created",
      "issue.confirmed",
      "claim.offered",
      "claim.accepted",
      "issue.pr_linked",
      "issue.test_verdict",
      "issue.accepted",
      "consent.asked",
      "consent.auto_approved",
      "consent.decided",
      "consent.rewound",
      "consent.agent_paused",
      "consent.mode_changed",
      "consent.rule_added",
    ],
  });
}
