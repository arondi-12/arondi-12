import Link from "next/link";
import { AskCard } from "@/components/dashboard/ask-card";
import {
  AgentPill,
  CardHeader,
  EventFeed,
  IssueRow,
  PointsPanel,
  QuickStat,
} from "@/components/dashboard/bits";
import { getDb } from "@/lib/db";
import { pendingAsks } from "@/lib/store";
import { timeAgo } from "@/lib/format";

export default async function DashboardPage() {
  const db = getDb();
  const asks = pendingAsks(db.user.id);

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const todayLedger = db.ledger.filter((l) => new Date(l.at) >= startOfDay);
  const autoToday = todayLedger.filter((l) => l.outcome === "auto_approved");
  const blockedToday = todayLedger.filter((l) => l.outcome === "blocked");
  const rewound = db.ledger.filter((l) => l.outcome === "rewound");
  const minutesSaved = autoToday.reduce((sum, entry) => {
    const ask = db.proposals.find((p) => p.title === entry.summary);
    return sum + (ask?.estimateMinutes ?? 10);
  }, 0);
  const lastReceipt = autoToday[0] ?? db.ledger.find((l) => l.outcome === "auto_approved");

  const moving = [...db.issues]
    .filter((i) => i.stage !== "merged")
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-bold leading-tight">
            Good afternoon, David
          </h1>
          <p className="mt-1 text-[13.5px] text-muted">
            {asks.length} things are waiting on you.{" "}
            {autoToday.length > 0
              ? `${autoToday.length} were handled inside the envelope since midnight.`
              : "Nothing has run unattended today."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/approvals" className="btn btn-primary btn-sm">
            Review approvals
          </Link>
          <Link href="/dashboard/issues" className="btn btn-ghost btn-sm">
            Report an issue
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickStat
          label="Waiting on you"
          value={String(asks.length)}
          hint="One decision each, with the rule trace"
          tone="amber"
        />
        <QuickStat
          label="Acted unattended today"
          value={String(autoToday.length)}
          hint={`≈ ${minutesSaved} min of asking removed`}
          tone="green"
        />
        <QuickStat
          label="Stopped by a rule"
          value={String(blockedToday.length)}
          hint="Never reached you because you said never"
          tone="red"
        />
        <QuickStat
          label="Pulled back"
          value={String(rewound.length)}
          hint="Reversal used instead of asking"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-5">
          <section className="card overflow-hidden">
            <CardHeader
              title="Waiting on you"
              hint="Oldest first · every ask explains why it is here"
              action={
                <Link href="/dashboard/approvals" className="text-[12px] font-medium text-[#2359c4]">
                  Open inbox →
                </Link>
              }
            />
            <div className="space-y-4 bg-[#fbfcfe] p-4">
              {asks.length ? (
                asks
                  .slice(0, 2)
                  .map((ask) => (
                    <AskCard
                      key={ask.id}
                      proposal={ask}
                      agent={db.agents.find((a) => a.id === ask.agentId)}
                      rules={db.rules}
                      compact
                    />
                  ))
              ) : (
                <div className="rounded-xl border border-dashed border-[#dbe4f2] bg-white px-4 py-10 text-center">
                  <div className="text-[13px] font-semibold">Nothing is waiting on you.</div>
                  <p className="mt-1 text-[12px] text-muted">
                    Your agents are inside their envelopes. The ledger has the receipts.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="card overflow-hidden">
            <CardHeader
              title="Issues moving"
              hint="Every stage has a named actor and a gate"
              action={
                <Link href="/dashboard/issues" className="text-[12px] font-medium text-[#2359c4]">
                  All issues →
                </Link>
              }
            />
            <div>
              {moving.map((issue) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </div>
          </section>

          <section className="card overflow-hidden">
            <CardHeader title="Recent agent events" hint="Typed events from the project feed" />
            <EventFeed events={db.events} limit={6} />
          </section>
        </div>

        <div className="space-y-5">
          <PointsPanel entries={db.points} goal={db.project.goalPoints} />

          <section className="card overflow-hidden">
            <CardHeader
              title="Your agents"
              hint="Autonomy is per agent, not global"
              action={
                <Link href="/dashboard/agents" className="text-[12px] font-medium text-[#2359c4]">
                  Manage →
                </Link>
              }
            />
            <div className="space-y-2 p-3">
              {db.agents
                .filter((a) => a.ownerId === db.user.id)
                .map((agent) => (
                  <AgentPill key={agent.id} agent={agent} />
                ))}
              <Link
                href="/dashboard/settings/agents/pair"
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#dbe4f2] px-3 py-2.5 text-[12px] font-medium text-[#2359c4] hover:bg-[#fafcff]"
              >
                + Pair a new agent
              </Link>
            </div>
          </section>

          <section className="card overflow-hidden">
            <CardHeader title="Last receipt" hint="What the rail allowed without you" />
            <div className="p-4">
              {lastReceipt ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[11px] text-[#147d54]">consent.auto_approved</span>
                    <span className="text-[11px] text-muted">{timeAgo(lastReceipt.at)}</span>
                  </div>
                  <div className="text-[13px] font-semibold">{lastReceipt.summary}</div>
                  <div className="rounded-lg border border-[#eef2f9] bg-[#fafcff] p-2.5 text-[11.5px] text-muted">
                    Allowed by:{" "}
                    <span className="font-medium text-ink">
                      {lastReceipt.ruleNote ?? "no rule (Act & report)"}
                    </span>
                  </div>
                  <Link
                    href="/dashboard/autonomy"
                    className="inline-block text-[12px] font-medium text-[#2359c4]"
                  >
                    See the full ledger →
                  </Link>
                </div>
              ) : (
                <p className="text-[12.5px] text-muted">No autonomous actions yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
