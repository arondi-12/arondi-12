"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ActionKind, RuleConditions } from "@/lib/types";
import {
  decideAsk,
  rewindAsk,
  addComment,
  voteIssue,
  setAgentMode,
  setAgentStatus,
  setRuleActive,
  addAgent,
  addRule,
} from "@/lib/store";

export async function signIn(formData: FormData) {
  const next = String(formData.get("next") || "/dashboard");
  const store = await cookies();
  store.set("ziki_session", "ada", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signOut() {
  const store = await cookies();
  store.delete("ziki_session");
  redirect("/");
}

export async function decide(formData: FormData) {
  const askId = String(formData.get("askId") || "");
  const kind = String(formData.get("kind") || "allow_once") as
    | "allow_once"
    | "allow_like_this"
    | "decline"
    | "block_like_this";
  const note = String(formData.get("note") || "") || undefined;
  decideAsk(askId, kind, note);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/approvals");
  revalidatePath("/dashboard/autonomy");
  revalidatePath("/dashboard/activity");
  revalidatePath(`/dashboard/issues/${String(formData.get("issueId") || "")}`);
}

export async function rewind(formData: FormData) {
  const askId = String(formData.get("askId") || "");
  const reason = String(formData.get("reason") || "Pulled back by its owner.");
  rewindAsk(askId, reason);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/approvals");
  revalidatePath("/dashboard/autonomy");
  revalidatePath("/dashboard/activity");
}

export async function comment(formData: FormData) {
  const issueId = String(formData.get("issueId") || "");
  const body = String(formData.get("body") || "");
  addComment(issueId, body);
  revalidatePath(`/dashboard/issues/${issueId}`);
  revalidatePath("/dashboard");
}

export async function vote(formData: FormData) {
  const issueId = String(formData.get("issueId") || "");
  voteIssue(issueId);
  revalidatePath(`/dashboard/issues/${issueId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/issues");
}

export async function changeMode(formData: FormData) {
  const agentId = String(formData.get("agentId") || "");
  const mode = String(formData.get("mode") || "act_within") as
    | "observe"
    | "propose"
    | "act_within"
    | "act_and_report";
  setAgentMode(agentId, mode);
  revalidatePath("/dashboard/autonomy");
  revalidatePath("/dashboard/agents");
  revalidatePath("/dashboard");
}

export async function togglePause(formData: FormData) {
  const agentId = String(formData.get("agentId") || "");
  const next = String(formData.get("status") || "active") as "active" | "paused";
  setAgentStatus(agentId, next);
  revalidatePath("/dashboard/autonomy");
  revalidatePath("/dashboard/agents");
  revalidatePath("/dashboard/approvals");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/activity");
}

export async function toggleRule(formData: FormData) {
  const ruleId = String(formData.get("ruleId") || "");
  const active = String(formData.get("active") || "false") === "true";
  setRuleActive(ruleId, active);
  revalidatePath("/dashboard/autonomy");
}

export async function pairAgent(formData: FormData) {
  const name = String(formData.get("name") || "New agent");
  const model = String(formData.get("model") || "Claude");
  const level = String(formData.get("level") || "observer") as
    | "observer"
    | "contributor"
    | "triager"
    | "reviewer";
  const instructions = String(formData.get("instructions") || "");
  addAgent({ name, model, level, instructions });
  revalidatePath("/dashboard/agents");
  revalidatePath("/dashboard/autonomy");
  redirect("/dashboard/agents");
}

export async function createRule(formData: FormData) {
  const agentId = String(formData.get("agentId") || "");
  const action = String(formData.get("action") || "bid") as ActionKind;
  const effect = String(formData.get("effect") || "allow") as "allow" | "ask" | "block";
  const note = String(formData.get("note") || "");
  const maxSeverity = String(formData.get("maxSeverity") || "");
  const maxEstimate = Number(formData.get("maxEstimateMinutes") || 0);
  const conditions: RuleConditions = {};
  if (maxSeverity) conditions.maxSeverity = maxSeverity as RuleConditions["maxSeverity"];
  if (maxEstimate > 0) conditions.maxEstimateMinutes = maxEstimate;
  if (effect === "allow") conditions.maxPerDay = 3;
  addRule({
    agentId,
    action,
    effect,
    conditions,
    note: note || `You set a new ${effect} rule for ${action}.`,
  });
  revalidatePath("/dashboard/autonomy");
  revalidatePath("/dashboard/approvals");
}
