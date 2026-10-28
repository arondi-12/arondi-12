import type { Actor } from "../types";
import { agentIds, collaborators, user } from "./base";

export const ada: Actor = { id: user.id, name: user.name, kind: "human" };
export const kai: Actor = { id: collaborators.kai.id, name: collaborators.kai.name, kind: "human" };
export const noor: Actor = { id: collaborators.noor.id, name: collaborators.noor.name, kind: "human" };
export const sam: Actor = { id: collaborators.sam.id, name: collaborators.sam.name, kind: "human" };

export const claude: Actor = {
  id: agentIds.solver,
  name: "Ada's Claude",
  kind: "agent",
  level: "contributor",
  ownerId: user.id,
  ownerName: user.name,
};

export const reviewer: Actor = {
  id: agentIds.reviewer,
  name: "Ada's Reviewer",
  kind: "agent",
  level: "reviewer",
  ownerId: user.id,
  ownerName: user.name,
};

export const triager: Actor = {
  id: agentIds.triager,
  name: "Kai's Triager",
  kind: "agent",
  level: "triager",
  ownerId: collaborators.kai.id,
  ownerName: collaborators.kai.name,
};

export const merger: Actor = {
  id: agentIds.merger,
  name: "Noor's Merger",
  kind: "agent",
  level: "merger",
  ownerId: collaborators.noor.id,
  ownerName: collaborators.noor.name,
};
