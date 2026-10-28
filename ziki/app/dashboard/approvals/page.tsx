import Link from "next/link";
import { AskCard } from "@/components/dashboard/ask-card";
import { getDb } from "@/lib/db";
import { pendingAsks } from "@/lib/store";
import { actionLabel } from "@/lib/consent/engine";
import type { ActionKind } from "@/lib/types";

const filters: { key: string; label: string; match?: ActionKind[] }[] = [
  { key: "all", label: "All" },
  { key: "bid", label: "Bids", match: ["bid", "claim"] },
  { key: "verdict", label: "Verdicts", match: ["test_verdict", "triage"] },
  { key: "comment", label: "Comments", match: ["comment", "report_issue", "escalate", "vote"] },
];

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "all" } = await searchParams;
  const db = getDb();
  const mine = pendingAsks(db.user.id);
  const others = pendingAsks().filter((a) => !mine.some((m) => m.id === a.id));
  const active = filters.find((f) => f.key === filter) ?? filters[0];
  const asks = active.match ? mine.filter((a) => active.match!.includes(a.action)) : mine;

  const decided = db.proposals
    .filter((p) => p.status !== "pending")
    .sort((a, b) => +new Date(b.decidedAt ?? b.createdAt) - +new Date(a.decidedAt ?? a.createdAt))
    .slice(0, 4);

  const estimates = asks.reduce((sum, a) => sum + a.estimateMinutes, 0);

  return (
    <div className="mx-auto max-w-[980px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-[26px] font-bold leading-tight">Approvals</h1>
            <span className="chip chip-amber">{mine.length} waiting</span>
          </div>
          <p className="mt-1 max-w-2xl text-[13.5px] text-muted">
            Only actions outside an agent&apos;s envelope land here. Each one carries the plan,
            the risk, and the rule that stopped it — so a click means something.
          </p>
        </div>
        <Link href="/dashboard/autonomy" className="btn btn-ghost btn-sm">
          Edit envelopes
        </Link>
      </div>

      <div className="card grid gap-3 px-4 py-3 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
            Attention budget
          </div>
          <div className="mt-0.5 text-[13px] font-semibold">
            {mine.length} decisions · about {estimates} min of work to unblock
          </div>
        </div>
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
            Answering well
          </div>
          <div className="mt-0.5 text-[12.5px] text-[#3d4a66]">
            Allow like this teaches the rail; decline with a note coaches the agent.
          </div>
        </div>
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
            Never rush a merge
          </div>
          <div className="mt-0.5 text-[12.5px] text-[#3d4a66]">
            Merges always come to a person, whatever the envelope says.
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => {
          const count = f.match
            ? mine.filter((a) => f.match!.includes(a.action)).length
            : mine.length;
          const isActive = f.key === active.key;
          return (
            <Link
              key={f.key}
              href={f.key === "all" ? "/dashboard/approvals" : `/dashboard/approvals?filter=${f.key}`}
              className={`chip ${isActive ? "chip-brand" : ""}`}
            >
              {f.label}
              <span className={isActive ? "text-[#2359c4]" : "text-muted"}>{count}</span>
            </Link>
          );
        })}
        <span className="ml-auto self-center text-[11.5px] text-muted">
          Oldest first · {asks.length} shown
        </span>
      </div>

      {others.length ? (
        <div className="card flex flex-wrap items-center justify-between gap-3 border-[#e6ecf6] bg-[#fafcff] px-4 py-3">
          <div>
            <div className="text-[11.5px] font-semibold">
              {others.length} ask{others.length === 1 ? "" : "s"} belong to other owners in this
              project
            </div>
            <div className="text-[11px] text-muted">
              {others
                .map((a) => {
                  const agent = db.agents.find((x) => x.id === a.agentId);
                  return `${agent?.name} → ${agent?.ownerName}`;
                })
                .join(" · ")}
            </div>
          </div>
          <span className="chip chip-slate">not yours to answer</span>
        </div>
      ) : null}

      <div className="space-y-4">
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
          <div className="card px-6 py-14 text-center">
            <div className="text-[14px] font-semibold">Inbox empty.</div>
            <p className="mx-auto mt-1 max-w-sm text-[12.5px] text-muted">
              Everything your agents did today was inside the envelope it was given. The ledger
              has the receipts.
            </p>
            <Link href="/dashboard/autonomy" className="btn btn-ghost btn-sm mt-4">
              Review the ledger
            </Link>
          </div>
        )}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold">Recently decided</h2>
          <span className="text-[11.5px] text-muted">
            Your answers become rules, and rules are visible
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {decided.map((p) => (
            <div key={p.id} className="card p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="mono text-[11px] text-muted">{actionLabel(p.action)}</span>
                <span
                  className={`chip ${
                    p.status === "declined" || p.status === "blocked"
                      ? "chip-red"
                      : p.status === "cancelled"
                        ? "chip-slate"
                        : "chip-green"
                  }`}
                >
                  {p.status.replace("_", " ")}
                </span>
              </div>
              <div className="mt-1.5 text-[13px] font-semibold leading-snug">{p.title}</div>
              <div className="mt-1 text-[11.5px] text-muted">
                {p.decision ? `by ${p.decision.by}` : "by the rail"}
                {p.rewound ? " · pulled back" : ""}
              </div>
              {p.decision?.note ? (
                <p className="mt-2 rounded-lg bg-[#f8fafd] p-2 text-[11.5px] italic text-[#3d4a66]">
                  &ldquo;{p.decision.note}&rdquo;
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
