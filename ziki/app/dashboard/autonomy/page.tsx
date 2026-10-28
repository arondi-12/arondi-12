import { AgentEnvelope } from "@/components/dashboard/agent-envelope";
import { getDb } from "@/lib/db";
import { timeAgo } from "@/lib/format";
import Link from "next/link";
import { createRule } from "@/app/actions";

export default async function AutonomyPage() {
  const db = getDb();
  const receipts = db.ledger.filter(
    (l) => l.outcome === "auto_approved" || l.outcome === "rewound" || l.outcome === "blocked",
  );

  return (
    <div className="mx-auto max-w-[1080px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-bold leading-tight">Autonomy ledger</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] text-muted">
            The envelope is the contract; the ledger is the receipt. Everything an agent did
            without asking is here, with the rule that allowed it and a one-click way back.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/approvals" className="btn btn-primary btn-sm">
            Approval inbox
          </Link>
          <Link href="/docs/consent-rail" className="btn btn-ghost btn-sm">
            Design note
          </Link>
        </div>
      </div>

      <div className="card grid gap-4 px-5 py-4 sm:grid-cols-3">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
            The three verbs
          </div>
          <div className="mt-1 space-y-1 text-[12px] text-[#3d4a66]">
            <div><span className="font-semibold text-ink">allow</span> — may proceed unattended inside the conditions</div>
            <div><span className="font-semibold text-ink">ask</span> — always lands in your inbox</div>
            <div><span className="font-semibold text-ink">block</span> — never attempted, not even asked</div>
          </div>
        </div>
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
            Conditions are ANDed
          </div>
          <div className="mt-1 text-[12px] text-[#3d4a66]">
            Severity, labels, estimate, confidence, evidence, risk and a daily cap. A rule only
            allows an action when every condition passes.
          </div>
        </div>
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
            Hard gates survive
          </div>
          <div className="mt-1 text-[12px] text-[#3d4a66]">
            Merges always ask a human. Pausing an agent cancels its in-flight work, whatever the
            rules say.
          </div>
        </div>
      </div>

      <details className="card px-5 py-4">
        <summary className="cursor-pointer text-[13px] font-semibold text-[#2359c4]">
          Add a rule by hand
        </summary>
        <form action={createRule} className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="text-[11px] font-semibold text-muted">
            Agent
            <select
              name="agentId"
              className="mt-1 w-full rounded-lg border border-[#e0e6f1] bg-white p-2 text-[12.5px] font-normal text-ink"
            >
              {db.agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.level})
                </option>
              ))}
            </select>
          </label>
          <label className="text-[11px] font-semibold text-muted">
            Action
            <select
              name="action"
              className="mt-1 w-full rounded-lg border border-[#e0e6f1] bg-white p-2 text-[12.5px] font-normal text-ink"
            >
              {["bid", "claim", "comment", "report_issue", "link_pr", "test_verdict", "triage", "escalate", "vote", "merge"].map(
                (a) => (
                  <option key={a} value={a}>
                    {a.replace("_", " ")}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="text-[11px] font-semibold text-muted">
            Effect
            <select
              name="effect"
              className="mt-1 w-full rounded-lg border border-[#e0e6f1] bg-white p-2 text-[12.5px] font-normal text-ink"
            >
              <option value="allow">allow</option>
              <option value="ask">always ask</option>
              <option value="block">never</option>
            </select>
          </label>
          <label className="text-[11px] font-semibold text-muted">
            Severity ceiling
            <select
              name="maxSeverity"
              className="mt-1 w-full rounded-lg border border-[#e0e6f1] bg-white p-2 text-[12.5px] font-normal text-ink"
            >
              <option value="">any</option>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="critical">critical</option>
            </select>
          </label>
          <label className="text-[11px] font-semibold text-muted">
            Estimate cap (minutes)
            <input
              type="number"
              name="maxEstimateMinutes"
              min={0}
              step={15}
              placeholder="45"
              className="mt-1 w-full rounded-lg border border-[#e0e6f1] p-2 text-[12.5px] font-normal text-ink"
            />
          </label>
          <label className="text-[11px] font-semibold text-muted">
            Why (shown to you and the agent)
            <input
              name="note"
              placeholder="Bids under 45 minutes on low or medium bugs."
              className="mt-1 w-full rounded-lg border border-[#e0e6f1] p-2 text-[12.5px] font-normal text-ink"
            />
          </label>
          <button className="btn btn-primary btn-sm sm:col-span-2" type="submit">
            Save rule
          </button>
        </form>
      </details>

      <div className="space-y-4">
        {db.agents.map((agent) => (
          <AgentEnvelope
            key={agent.id}
            agent={agent}
            rules={db.rules.filter((r) => r.agentId === agent.id)}
            proposals={db.proposals}
            ledger={db.ledger}
          />
        ))}
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#f1f4fa] px-4 py-3">
          <div>
            <div className="text-[13px] font-semibold">Ledger</div>
            <div className="text-[11px] text-muted">
              Append-only · corrections are new rows, never edits
            </div>
          </div>
          <span className="chip chip-slate">{receipts.length} entries</span>
        </div>
        <div className="divide-y divide-[#f1f4fa]">
          {receipts.map((entry) => (
            <div key={entry.id} className="flex flex-wrap items-start gap-3 px-4 py-3">
              <span
                className={`mono mt-0.5 w-[150px] shrink-0 text-[11px] ${
                  entry.outcome === "rewound" || entry.outcome === "blocked"
                    ? "text-[#b3261e]"
                    : "text-[#147d54]"
                }`}
              >
                consent.{entry.outcome}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-medium">{entry.summary}</div>
                <div className="text-[11px] text-muted">
                  {entry.agentName}
                  {entry.ruleNote ? ` · allowed by “${entry.ruleNote}”` : " · no rule"}
                  {entry.issueNumber ? ` · #${entry.issueNumber}` : ""}
                </div>
              </div>
              <span className="text-[10.5px] text-muted">{timeAgo(entry.at)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
