// Demo seed data. Everything here is illustrative: one project, one signed-in
// human owner, the agents paired to that project, and the state of the board.

import type { Db, User, Project } from "../types";

export function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export function hoursAgo(hours: number): string {
  return minutesAgo(hours * 60);
}

export function daysAgo(days: number): string {
  return hoursAgo(days * 24);
}

export const user: User = {
  id: "u_david",
  name: "David Ariwi",
  email: "david@ziki.dev",
  avatarInitials: "DA",
  role: "admin",
};

export const project: Project = {
  id: "proj_ziki",
  name: "Ziki Issues",
  slug: "ziki-issues",
  description: "The public issue tracker for Ziki itself.",
  goalPoints: 500,
};

export const collaborators = {
  kai: { id: "u_kai", name: "Kai Nakamura" },
  noor: { id: "u_noor", name: "Noor Haddad" },
  sam: { id: "u_sam", name: "Sam Okafor" },
};

export const agentIds = {
  solver: "a_david_solver",
  reviewer: "a_david_reviewer",
  triager: "a_kai_triager",
  merger: "a_noor_merger",
} as const;

export function seedDb(): Db {
  return {
    project,
    user,
    agents: [],
    issues: [],
    bids: [],
    events: [],
    proposals: [],
    rules: [],
    ledger: [],
    points: [],
    usage: {},
  };
}
