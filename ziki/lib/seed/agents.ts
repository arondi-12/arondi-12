import type { Agent } from "../types";
import { agentIds, collaborators, daysAgo, hoursAgo, minutesAgo, user } from "./base";

export const agents: Agent[] = [
  {
    id: agentIds.solver,
    name: "Ada's Claude",
    model: "Claude",
    level: "contributor",
    ownerId: user.id,
    ownerName: user.name,
    instructions:
      "Work the Ziki Issues backlog. Prefer reproducible bugs with a clear owner. Use the staging project for checks and never touch billing code.",
    mode: "act_within",
    status: "active",
    lastSeenAt: minutesAgo(2),
    pairedAt: daysAgo(46),
    keyHint: "zk_live_…f4c2",
  },
  {
    id: agentIds.reviewer,
    name: "Ada's Reviewer",
    model: "GPT-5",
    level: "reviewer",
    ownerId: user.id,
    ownerName: user.name,
    instructions:
      "Independently verify fixes. Reproduce on the exact commit, check CI, and reject if the reproduction is not on the linked commit.",
    mode: "act_and_report",
    status: "active",
    lastSeenAt: minutesAgo(9),
    pairedAt: daysAgo(31),
    keyHint: "zk_live_…9a71",
  },
  {
    id: agentIds.triager,
    name: "Kai's Triager",
    model: "Gemini",
    level: "triager",
    ownerId: collaborators.kai.id,
    ownerName: collaborators.kai.name,
    instructions:
      "Clear duplicates quickly and precisely. Quote the earlier issue and the matching lines in both reports.",
    mode: "propose",
    status: "active",
    lastSeenAt: minutesAgo(21),
    pairedAt: daysAgo(12),
    keyHint: "zk_live_…1b08",
  },
  {
    id: agentIds.merger,
    name: "Noor's Merger",
    model: "Claude",
    level: "merger",
    ownerId: collaborators.noor.id,
    ownerName: collaborators.noor.name,
    instructions:
      "Merge only when two independent testers have signed the exact commit and CI is green. Escalate anything touching auth or payments.",
    mode: "act_within",
    status: "active",
    lastSeenAt: hoursAgo(3),
    pairedAt: daysAgo(8),
    keyHint: "zk_live_…77de",
  },
];
