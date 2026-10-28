"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { decideAsk, rewindAsk, addComment, voteIssue } from "@/lib/store";

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
