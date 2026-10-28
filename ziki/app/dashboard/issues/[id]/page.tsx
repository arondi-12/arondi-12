import Link from "next/link";
import { notFound } from "next/navigation";
import { comment, vote } from "@/app/actions";
import { AskCard } from "@/components/dashboard/ask-card";
import { Avatar, SeverityChip, STAGES, StageChip } from "@/components/ui";
import { getDb } from "@/lib/db";
import { timeAgo } from "@/lib/format";
import { minutesLabel } from "@/lib/format";

const stageCopy: Record<string, string> = {
  reported: "Reported",
  confirmed: "Confirmed by 2 reviewers + a triager",
  authorized: "Authorized: bid awarded, claim open",
  delivered: "Delivered: pull request linked",
  proven: "Proven: two independent verdicts",
  merged: "Merged after the human gate",
};

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const issue = db.issues.find((i) => i.id === id);
  if (!issue) notFound();

  const asks = db.proposals.filter((p) => p.issueId === issue.id);
  const bids = db.bids.filter((b) => b.issueId === issue.id);
  const stageIndex = STAGES.indexOf(issue.stage);
  const accepted = issue.confirmations.filter((c) => c.verdict === "accept").length;

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <Link href="/dashboard/issues" className="text-[12px] text-muted hover:text-ink">
        ← Issues
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono text-[12px] text-muted">#{issue.number}</span>
            <SeverityChip severity={issue.severity} />
            <StageChip stage={issue.stage} />
            {issue.labels.map((l) => (
              <span key={l} className="chip chip-slate">
                #{l}
              </span>
            ))}
          </div>
          <h1 className="mt-2 font-display text-[26px] font-bold leading-snug">{issue.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Avatar actor={issue.reporter} size={18} /> {issue.reporter.name} filed it{" "}
              {timeAgo(issue.createdAt)}
            </span>
            {issue.assignee ? (
              <span className="inline-flex items-center gap-1.5">
                · <Avatar actor={issue.assignee} size={18} /> {issue.assignee.name} holds the claim
              </span>
            ) : null}
          </div>
        </div>
        <form action={vote}>
          <input type="hidden" name="issueId" value={issue.id} />
          <button
            type="submit"
            className={`btn btn-sm ${issue.votedByMe ? "btn-soft" : "btn-ghost"}`}
          >
            ▲ {issue.votes} {issue.votedByMe ? "voted" : "vote"}
          </button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-[#f1f4fa] bg-[#fcfdff] p-2">
          {STAGES.map((stage, i) => {
            const done = i <= stageIndex;
            return (
              <div
                key={stage}
                className={`flex-1 rounded-lg px-2.5 py-2 ${
                  done ? "bg-[#eaf2ff]" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full text-[9px] font-bold ${
                      done ? "bg-[#3978f6] text-white" : "bg-[#e8eefb] text-[#95a2bc]"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      done ? "text-[#2359c4]" : "text-muted"
                    }`}
                  >
                    {stageCopy[stage]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
              Report
            </div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#3d4a66]">{issue.body}</p>
            {issue.prUrl ? (
              <a
                href={issue.prUrl}
                target="_blank"
                rel="noreferrer"
                className="mono mt-3 inline-flex items-center gap-2 rounded-lg border border-[#e0e6f1] bg-[#fafcff] px-2.5 py-1.5 text-[11.5px] text-[#2359c4] hover:underline"
              >
                {issue.prUrl.replace("https://github.com/", "")}
                <span className="text-[#147d54]">✓ {issue.prChecks} checks</span>
              </a>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Confirmations", `${accepted} / 2 accepts`],
              ["Triager", issue.triagerCleared ? "cleared" : "not cleared"],
              ["Verdicts", `${issue.testVerdicts.filter((v) => v.goodToMerge).length} / 2 good`],
              ["Duplicate", issue.duplicateOf ? `of #${db.issues.find((i) => i.id === issue.duplicateOf)?.number}` : "no"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-[#eef2f9] bg-[#fafcff] px-2.5 py-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#95a2bc]">
                  {label}
                </div>
                <div className="text-[12.5px] font-medium">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-5">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#f1f4fa] px-4 py-3">
              <div>
                <div className="text-[13px] font-semibold">Conversation</div>
                <div className="text-[11px] text-muted">
                  {issue.comments.length} comments · everything attributed
                </div>
              </div>
              <a
                href={`/api/v1/issues/${issue.id}`}
                className="mono text-[10.5px] text-[#2359c4] hover:underline"
              >
                GET /api/v1/issues/{issue.number}
              </a>
            </div>
            <div className="divide-y divide-[#f1f4fa]">
              {issue.comments.map((c) => (
                <div key={c.id} className="flex gap-3 px-4 py-3.5">
                  <Avatar actor={c.author} size={28} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[12.5px] font-semibold">{c.author.name}</span>
                      {c.author.kind === "agent" ? (
                        <span className="chip chip-brand !py-0.5 !text-[10px]">
                          agent · {c.author.level}
                        </span>
                      ) : null}
                      {c.kind === "approval" ? (
                        <span className="chip chip-green !py-0.5 !text-[10px]">owner gate</span>
                      ) : null}
                      <span className="text-[10.5px] text-muted">{timeAgo(c.at)}</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#3d4a66]">{c.body}</p>
                  </div>
                </div>
              ))}
              {!issue.comments.length ? (
                <div className="px-4 py-8 text-center text-[12.5px] text-muted">
                  No comments yet.
                </div>
              ) : null}
            </div>
            <form action={comment} className="border-t border-[#f1f4fa] p-4">
              <input type="hidden" name="issueId" value={issue.id} />
              <textarea
                name="body"
                rows={3}
                required
                placeholder="Add context, a reproduction, or a decision…"
                className="w-full rounded-xl border border-[#e0e6f1] p-3 text-[13px] outline-none focus:border-[#3978f6]"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-muted">
                  Commenting as Ada Lovelace · attributed in the audit trail
                </span>
                <button className="btn btn-primary btn-sm" type="submit">
                  Comment
                </button>
              </div>
            </form>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold">Agent asks on this issue</h2>
              <Link href="/dashboard/approvals" className="text-[12px] font-medium text-[#2359c4]">
                All approvals →
              </Link>
            </div>
            {asks.length ? (
              asks.map((ask) => (
                <AskCard
                  key={ask.id}
                  proposal={ask}
                  agent={db.agents.find((a) => a.id === ask.agentId)}
                  rules={db.rules}
                />
              ))
            ) : (
              <div className="card px-4 py-8 text-center text-[12.5px] text-muted">
                No agent has asked about this issue yet.
              </div>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section className="card overflow-hidden">
            <div className="border-b border-[#f1f4fa] px-4 py-3">
              <div className="text-[13px] font-semibold">Bids</div>
              <div className="text-[11px] text-muted">A person awards; an agent never claims directly</div>
            </div>
            <div className="divide-y divide-[#f1f4fa]">
              {bids.length ? (
                bids.map((bid) => (
                  <div key={bid.id} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12.5px] font-semibold">{bid.agentName}</span>
                      <span
                        className={`chip ${
                          bid.status === "awarded" ? "chip-green" : "chip-amber"
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted">
                      owner {bid.ownerName} · {minutesLabel(bid.estimateMinutes)} estimate
                    </div>
                    <p className="mt-1 text-[12px] text-[#3d4a66]">{bid.approach}</p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-[12px] text-muted">No bids yet.</div>
              )}
            </div>
          </section>

          <section className="card p-4">
            <div className="text-[13px] font-semibold">Gates</div>
            <div className="mt-2 space-y-2 text-[12px]">
              {[
                ["Two independent reviewers", accepted >= 2],
                ["Triager cleared as not a duplicate", issue.triagerCleared],
                ["Claim awarded by a person", Boolean(issue.assignee)],
                ["Pull request linked", Boolean(issue.prUrl)],
                ["Two good-to-merge verdicts", issue.testVerdicts.filter((v) => v.goodToMerge).length >= 2],
                ["Human merge gate", issue.stage === "merged"],
              ].map(([label, pass]) => (
                <div key={String(label)} className="flex items-center gap-2">
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full text-[9px] font-bold ${
                      pass ? "bg-[#e7f6ee] text-[#147d54]" : "bg-[#f1f4fa] text-[#95a2bc]"
                    }`}
                  >
                    {pass ? "✓" : "·"}
                  </span>
                  <span className={pass ? "text-[#3d4a66]" : "text-muted"}>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-4">
            <div className="text-[13px] font-semibold">Test verdicts</div>
            <div className="mt-2 space-y-2">
              {issue.testVerdicts.length ? (
                issue.testVerdicts.map((v) => (
                  <div key={`${v.testerName}-${v.at}`} className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[12px] font-medium">{v.testerName}</div>
                      <div className="mono text-[10.5px] text-muted">commit {v.commit}</div>
                    </div>
                    <span className={`chip ${v.goodToMerge ? "chip-green" : "chip-red"}`}>
                      {v.goodToMerge ? "good to merge" : "changes"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-[12px] text-muted">No verdicts yet.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
