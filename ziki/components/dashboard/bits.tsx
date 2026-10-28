import Link from "next/link";
import { SeverityChip, StageChip, Avatar } from "@/components/ui";
import { pct, timeAgo } from "@/lib/format";
import type { Agent, EventRecord, Issue, PointEntry } from "@/lib/types";

export function IssueRow({ issue }: { issue: Issue }) {
  return (
    <Link
      href={`/dashboard/issues/${issue.id}`}
      className="flex items-center gap-4 border-b border-[#f1f4fa] px-4 py-3.5 last:border-0 hover:bg-[#fafcff]"
    >
      <div className="hidden w-[52px] shrink-0 text-right sm:block">
        <div className="mono text-[11px] text-muted">#{issue.number}</div>
        <div className="mt-0.5 text-[11px] font-semibold text-[#2359c4]">▲ {issue.votes}</div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-[13.5px] font-semibold">{issue.title}</span>
          <SeverityChip severity={issue.severity} />
          <StageChip stage={issue.stage} />
          {issue.duplicateOf ? <span className="chip chip-slate">duplicate</span> : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted">
          <span className="mono sm:hidden">#{issue.number}</span>
          <span>{issue.labels.map((l) => `#${l}`).join(" ")}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5">
            <Avatar actor={issue.reporter} size={16} /> {issue.reporter.name}
          </span>
          {issue.assignee ? (
            <>
              <span>→</span>
              <span className="inline-flex items-center gap-1.5">
                <Avatar actor={issue.assignee} size={16} /> {issue.assignee.name}
              </span>
            </>
          ) : null}
          <span>·</span>
          <span>updated {timeAgo(issue.updatedAt)}</span>
        </div>
      </div>
      {issue.prChecks ? (
        <div className="hidden shrink-0 text-right text-[11px] text-muted sm:block">
          <div className="font-semibold text-[#147d54]">✓ {issue.prChecks} checks</div>
          <div>PR linked</div>
        </div>
      ) : null}
    </Link>
  );
}

const eventTone: Record<string, string> = {
  "issue.created": "text-[#2359c4]",
  "issue.confirmed": "text-[#2359c4]",
  "issue.pr_linked": "text-[#b8791f]",
  "issue.test_verdict": "text-[#147d54]",
  "issue.accepted": "text-[#147d54]",
  "consent.asked": "text-[#b8791f]",
  "consent.auto_approved": "text-[#147d54]",
  "consent.decided": "text-[#2359c4]",
  "consent.rewound": "text-[#b3261e]",
  "consent.declined": "text-[#b3261e]",
  "consent.agent_paused": "text-[#b3261e]",
};

export function EventFeed({ events, limit }: { events: EventRecord[]; limit?: number }) {
  const shown = limit ? events.slice(0, limit) : events;
  return (
    <ol className="divide-y divide-[#f1f4fa]">
      {shown.map((event) => (
        <li key={event.id} className="flex gap-3 px-4 py-3">
          <span
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
              event.channel === "agent" ? "bg-[#3978f6]" : "bg-[#0b1733]"
            }`}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2">
              <span className={`mono text-[11px] ${eventTone[event.type] ?? "text-[#4a5875]"}`}>
                {event.type}
              </span>
              <span className="text-[10.5px] text-muted">{timeAgo(event.at)}</span>
            </div>
            <div className="text-[12.5px] leading-snug text-[#3d4a66]">
              {event.issueId ? (
                <Link href={`/dashboard/issues/${event.issueId}`} className="hover:text-ink">
                  {event.summary}
                </Link>
              ) : (
                event.summary
              )}
            </div>
            <div className="text-[11px] text-[#95a2bc]">{event.actor}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PointsPanel({ entries, goal }: { entries: PointEntry[]; goal: number }) {
  const total = entries.reduce((sum, e) => sum + e.points, 0);
  const percent = pct(total, goal);
  return (
    <div className="overflow-hidden rounded-[18px] bg-[#0b1733] text-white">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#8fa1c4]">
            Points this week
          </span>
          <span className="chip border-[#2b4370] bg-[#13233f] text-[#8fc9ff]">{percent}%</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold">{total}</span>
          <span className="text-[12px] text-[#8fa1c4]">/ {goal}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1d2f52]">
          <div className="h-full rounded-full bg-[#5991ff]" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-[#8fa1c4]">
          Only validated contributions are paid. Append-only ledger.
        </p>
      </div>
      <div className="divide-y divide-[#1d2f52] border-t border-[#1d2f52]">
        {entries.slice(0, 3).map((entry) => (
          <div key={entry.id} className="flex items-center justify-between px-5 py-2.5">
            <div>
              <div className="text-[12px]">{entry.reason}</div>
              <div className="text-[10.5px] text-[#8fa1c4]">{entry.owner}</div>
            </div>
            <span className="text-[12px] font-semibold text-[#8fc9ff]">+{entry.points}</span>
          </div>
        ))}
      </div>
      <Link
        href="/dashboard/points"
        className="block border-t border-[#1d2f52] px-5 py-3 text-[12px] text-[#a3b1ce] hover:text-white"
      >
        Open the points ledger →
      </Link>
    </div>
  );
}

export function AgentPill({ agent }: { agent: Agent }) {
  const modeCopy: Record<Agent["mode"], string> = {
    observe: "Observe",
    propose: "Propose",
    act_within: "Act within envelope",
    act_and_report: "Act & report",
  };
  return (
    <Link
      href="/dashboard/autonomy"
      className="flex items-center justify-between gap-2 rounded-xl border border-[#eef2f9] px-3 py-2.5 hover:bg-[#fafcff]"
    >
      <div className="min-w-0">
        <div className="truncate text-[12.5px] font-semibold">{agent.name}</div>
        <div className="text-[11px] text-muted">
          {agent.level} · {agent.model}
        </div>
      </div>
      <span
        className={`chip ${
          agent.status === "paused"
            ? "chip-red"
            : agent.mode === "act_and_report"
              ? "chip-green"
              : agent.mode === "act_within"
                ? "chip-amber"
                : "chip-slate"
        }`}
      >
        {agent.status === "paused" ? "paused" : modeCopy[agent.mode]}
      </span>
    </Link>
  );
}

export function CardHeader({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#f1f4fa] px-4 py-3">
      <div>
        <div className="text-[13px] font-semibold">{title}</div>
        {hint ? <div className="text-[11px] text-muted">{hint}</div> : null}
      </div>
      {action}
    </div>
  );
}

export function QuickStat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "amber" | "green" | "red";
}) {
  const toneClass =
    tone === "amber"
      ? "text-[#b8791f]"
      : tone === "green"
        ? "text-[#147d54]"
        : tone === "red"
          ? "text-[#b3261e]"
          : "text-ink";
  return (
    <div className="card px-4 py-3.5">
      <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">{label}</div>
      <div className={`mt-1 font-display text-2xl font-bold ${toneClass}`}>{value}</div>
      {hint ? <div className="text-[11px] text-muted">{hint}</div> : null}
    </div>
  );
}
