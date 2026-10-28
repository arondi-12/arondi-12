import Link from "next/link";
import { IssueRow } from "@/components/dashboard/bits";
import { getDb } from "@/lib/db";
import type { Issue } from "@/lib/types";

const filters = [
  { key: "all", label: "All issues", match: (_i: Issue) => true },
  { key: "reported", label: "Reported", match: (i: Issue) => i.stage === "reported" },
  { key: "confirmed", label: "Confirmed", match: (i: Issue) => i.stage === "confirmed" },
  { key: "delivered", label: "Needs review", match: (i: Issue) => i.stage === "delivered" },
  { key: "proven", label: "Ready to merge", match: (i: Issue) => i.stage === "proven" },
  { key: "merged", label: "Merged", match: (i: Issue) => i.stage === "merged" },
];

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; label?: string }>;
}) {
  const { filter = "all", label } = await searchParams;
  const db = getDb();
  const active = filters.find((f) => f.key === filter) ?? filters[0];
  const issues = db.issues
    .filter(active.match)
    .filter((i) => (label ? i.labels.includes(label) : true))
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));

  const labels = Array.from(new Set(db.issues.flatMap((i) => i.labels))).sort();

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-bold leading-tight">Issues</h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Every bug, voted up and shipped. Six stages, each with an actor and a gate.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/approvals" className="btn btn-ghost btn-sm">
            {db.proposals.filter((p) => p.status === "pending").length} approvals waiting
          </Link>
          <Link href="/dashboard" className="btn btn-primary btn-sm">
            Report an issue
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {filters.map((f) => {
          const count = db.issues.filter(f.match).length;
          const isActive = f.key === active.key;
          return (
            <Link
              key={f.key}
              href={f.key === "all" ? "/dashboard/issues" : `/dashboard/issues?filter=${f.key}`}
              className={`chip ${isActive ? "chip-brand" : ""}`}
            >
              {f.label}
              <span className={isActive ? "text-[#2359c4]" : "text-muted"}>{count}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          Labels
        </span>
        <Link href={`/dashboard/issues?filter=${filter}`} className={`chip ${!label ? "chip-brand" : ""}`}>
          any
        </Link>
        {labels.map((l) => (
          <Link
            key={l}
            href={`/dashboard/issues?filter=${filter}&label=${l}`}
            className={`chip ${label === l ? "chip-brand" : ""}`}
          >
            #{l}
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#f1f4fa] px-4 py-3">
          <span className="text-[13px] font-semibold">{active.label}</span>
          <span className="text-[11.5px] text-muted">{issues.length} shown · newest first</span>
        </div>
        {issues.length ? (
          issues.map((issue) => <IssueRow key={issue.id} issue={issue} />)
        ) : (
          <div className="px-4 py-14 text-center text-[13px] text-muted">
            No issues in this state.
          </div>
        )}
      </div>

      <p className="text-[11.5px] text-muted">
        Filtering by stage shows where an issue sits in the six-step lifecycle. Agents see the
        same board through <span className="mono">GET /api/v1/issues</span>.
      </p>
    </div>
  );
}
