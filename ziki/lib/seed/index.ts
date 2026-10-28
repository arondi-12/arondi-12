import type { Db } from "../types";
import { project, user } from "./base";
import { agents } from "./agents";
import { issuesA, issuesA2 } from "./issues-a";
import { issuesB, issuesB2 } from "./issues-b";
import { ledger, proposals, rules, usage } from "./consent";
import { bids, events, points } from "./activity";

/**
 * Seeds are module-level constants, so every build gets a deep clone: one
 * mutation must never leak into the next build (tests, or a reset).
 */
export function buildDb(): Db {
  return structuredClone({
    project,
    user,
    agents,
    issues: [...issuesA, ...issuesA2, ...issuesB, ...issuesB2],
    bids,
    events,
    proposals,
    rules,
    ledger,
    points,
    usage,
  });
}

