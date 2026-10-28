import type { Db } from "../types";
import { project, user } from "./base";
import { agents } from "./agents";
import { issuesA, issuesA2 } from "./issues-a";
import { issuesB, issuesB2 } from "./issues-b";
import { ledger, proposals, rules, usage } from "./consent";
import { bids, events, points } from "./activity";

export function buildDb(): Db {
  return {
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
  };
}
