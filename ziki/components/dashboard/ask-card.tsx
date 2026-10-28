import Link from "next/link";
import { decide, rewind } from "@/app/actions";
import { actionLabel, MODE_META, describeConditions } from "@/lib/consent/engine";
import { minutesLabel, timeAgo } from "@/lib/format";
import { statusLabel } from "@/lib/store";
import type { Agent, EnvelopeRule, Proposal } from "@/lib/types";
import { SeverityChip } from "@/components/ui";

function TraceRow({ label, pass, detail }: { label: string; pass: boolean; detail: string }) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span
        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
          pass ? "bg-[#e7f6ee] text-[#147d54]" : "bg-[#fdeceb] text-[#b3261e]"
        }`}
      >
        {pass ? "✓" : "✕"}
      </span>
      <span className="text-[12px] text-[#3d4a66]">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-muted"> — {detail}</span>
      </span>
    </div>
  );
}

export function AskCard({
  proposal,
  agent,
  rules,
  compact = false,
}: {
  proposal: Proposal;
  agent?: Agent;
  rules: EnvelopeRule[];
  compact?: boolean;
}) {
  const ev = proposal.evaluation;
  const closestRule = ev.closest ? rules.find((r) => r.id === ev.closest!.ruleId) : undefined;
  const isPending = proposal.status === "pending";
  const mode = agent ? MODE_META[agent.mode] : undefined;

  return (
    <article
      className={`card overflow-hidden ${
        isPending ? "border-[#f0dcb4] shadow-[0_10px_30px_rgba(184,121,31,0.07)]" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f4fa] bg-[#fcfdff] px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf2ff] text-[11px] font-bold text-[#2359c4] ring-1 ring-[#d4e3ff]">
            {agent?.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("") || "AI"}
          </span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold">{agent?.name ?? "Agent"}</div>
            <div className="text-[11px] text-muted">
              {agent?.level} agent · owner {agent?.ownerName} · asked {timeAgo(proposal.createdAt)}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="chip chip-slate">{actionLabel(proposal.action)}</span>
          <SeverityChip severity={proposal.severity} />
          <span
            className={`chip ${
              proposal.risk === "high"
                ? "chip-red"
                : proposal.risk === "medium"
                  ? "chip-amber"
                  : "chip-green"
            }`}
          >
            {proposal.risk} risk
          </span>
          {!isPending ? (
            <span
              className={`chip ${
                proposal.status === "approved" || proposal.status === "auto_approved"
                  ? "chip-green"
                  : proposal.status === "declined" || proposal.status === "blocked"
                    ? "chip-red"
                    : "chip-slate"
              }`}
            >
              {statusLabel(proposal.status)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="px-5 py-4">
        <h3 className="font-display text-[17px] font-bold leading-snug">{proposal.title}</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#3d4a66]">{proposal.summary}</p>

        {proposal.issueNumber ? (
          <Link
            href={`/dashboard/issues/${proposal.issueId}`}
            className="mono mt-2 inline-block text-[11.5px] text-[#2359c4] hover:underline"
          >
            #{proposal.issueNumber} →
          </Link>
        ) : null}

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {[
            ["Estimate", minutesLabel(proposal.estimateMinutes)],
            ["Confidence", `${Math.round(proposal.confidence * 100)}%`],
            ["Reversible", proposal.reversible ? "yes" : "no — needs a new fix"],
            ["Evidence", `${proposal.evidence.length} linked`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[#eef2f9] bg-[#fafcff] px-2.5 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#95a2bc]">
                {label}
              </div>
              <div className="text-[12.5px] font-medium">{value}</div>
            </div>
          ))}
        </div>

        <details className="group mt-4 rounded-xl border border-[#eef2f9] bg-[#fafcff] px-3.5 py-2.5">
          <summary className="cursor-pointer list-none text-[12.5px] font-semibold text-[#2359c4]">
            ▸ Why this is in front of you
          </summary>
          <div className="mt-2.5 space-y-2">
            <p className="text-[12.5px] text-[#3d4a66]">
              <span className="font-semibold text-ink">{ev.headline}</span>
              {ev.closest ? (
                <>
                  {" "}
                  Nearest rule: <span className="font-medium">“{closestRule?.note ?? "allow rule"}”</span>.
                  It stopped short because {ev.closest.why}.
                </>
              ) : null}
            </p>
            {ev.trace.length ? (
              <div className="rounded-lg border border-[#e8eef8] bg-white px-3 py-2">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#95a2bc]">
                  Rule trace
                </div>
                {ev.trace.map((step) => (
                  <TraceRow key={step.label} {...step} />
                ))}
              </div>
            ) : null}
            {mode ? (
              <p className="text-[11.5px] text-muted">
                Mode: <span className="font-medium text-ink">{mode.label}</span> — {mode.blurb}
              </p>
            ) : null}
          </div>
        </details>

        {proposal.plan.length ? (
          <details className="group mt-2 rounded-xl border border-[#eef2f9] bg-[#fafcff] px-3.5 py-2.5">
            <summary className="cursor-pointer list-none text-[12.5px] font-semibold text-[#2359c4]">
              ▸ What it will do, step by step
            </summary>
            <ol className="mt-2 space-y-1.5">
              {proposal.plan.map((step, i) => (
                <li key={step} className="flex gap-2 text-[12.5px] text-[#3d4a66]">
                  <span className="mono text-[11px] text-[#95a2bc]">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
            {proposal.rationale ? (
              <p className="mt-2 border-l-2 border-[#d4e3ff] pl-2.5 text-[12.5px] italic text-muted">
                “{proposal.rationale}”
              </p>
            ) : null}
          </details>
        ) : null}

        {proposal.evidence.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {proposal.evidence.map((e) => (
              <span key={e} className="chip chip-slate">
                ⌗ {e}
              </span>
            ))}
          </div>
        ) : null}

        {isPending ? (
          <div className="mt-4 border-t border-[#eef2f9] pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <form action={decide}>
                <input type="hidden" name="askId" value={proposal.id} />
                <input type="hidden" name="issueId" value={proposal.issueId ?? ""} />
                <input type="hidden" name="kind" value="allow_once" />
                <button className="btn btn-primary btn-sm" type="submit">
                  Allow once
                </button>
              </form>
              <form action={decide}>
                <input type="hidden" name="askId" value={proposal.id} />
                <input type="hidden" name="issueId" value={proposal.issueId ?? ""} />
                <input type="hidden" name="kind" value="allow_like_this" />
                <button className="btn btn-soft btn-sm" type="submit">
                  Allow like this
                </button>
              </form>
              <details className="w-full">
                <summary className="btn btn-ghost btn-sm inline-flex cursor-pointer">
                  Decline or block…
                </summary>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <form action={decide} className="rounded-xl border border-[#eef2f9] p-3">
                    <input type="hidden" name="askId" value={proposal.id} />
                    <input type="hidden" name="issueId" value={proposal.issueId ?? ""} />
                    <input type="hidden" name="kind" value="decline" />
                    <label className="text-[11px] font-semibold text-muted">
                      Decline this one, and tell it why
                    </label>
                    <textarea
                      name="note"
                      rows={2}
                      placeholder="Use the read replica instead."
                      className="mt-1.5 w-full rounded-lg border border-[#e0e6f1] p-2 text-[12.5px] outline-none focus:border-[#3978f6]"
                    />
                    <button className="btn btn-ghost btn-xs mt-2" type="submit">
                      Decline once
                    </button>
                  </form>
                  <form action={decide} className="rounded-xl border border-[#f6d1ce] bg-[#fffafa] p-3">
                    <input type="hidden" name="askId" value={proposal.id} />
                    <input type="hidden" name="issueId" value={proposal.issueId ?? ""} />
                    <input type="hidden" name="kind" value="block_like_this" />
                    <label className="text-[11px] font-semibold text-[#b3261e]">
                      Never allow this again
                    </label>
                    <p className="mt-1 text-[11.5px] text-muted">
                      Writes a standing block rule for{" "}
                      {proposal.labels.length
                        ? `issues labelled ${proposal.labels.join(", ")}`
                        : "this kind of action"}
                      .
                    </p>
                    <textarea
                      name="note"
                      rows={2}
                      placeholder="Billing changes always need me."
                      className="mt-1.5 w-full rounded-lg border border-[#eddedd] p-2 text-[12.5px] outline-none focus:border-[#b3261e]"
                    />
                    <button
                      className="btn btn-xs mt-2 border-[#f6d1ce] bg-white text-[#b3261e]"
                      type="submit"
                    >
                      Block like this
                    </button>
                  </form>
                </div>
              </details>
              {!compact ? (
                <form action={rewind} className="ml-auto">
                  <input type="hidden" name="askId" value={proposal.id} />
                  <input type="hidden" name="reason" value="Pulled back from the approval inbox." />
                  <button
                    className="text-[12px] text-muted underline-offset-2 hover:text-ink hover:underline"
                    type="submit"
                  >
                    Take this one myself
                  </button>
                </form>
              ) : null}
            </div>
            <p className="mt-2.5 text-[11px] text-muted">
              “Allow like this” widens the envelope to{" "}
              {describeConditions({
                maxSeverity: proposal.severity,
                maxEstimateMinutes: Math.ceil(proposal.estimateMinutes / 15) * 15,
                riskAtMost: proposal.risk,
                maxPerDay: 3,
              })}
              . You can edit or delete the rule afterwards.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-[#eef2f9] bg-[#fafcff] px-3.5 py-3 text-[12.5px] text-[#3d4a66]">
            <div className="font-semibold text-ink">
              {statusLabel(proposal.status)}
              {proposal.decision ? ` by ${proposal.decision.by}` : " by the rail"}
              <span className="font-normal text-muted">
                {" · "}
                {timeAgo(proposal.decidedAt ?? proposal.createdAt)}
              </span>
            </div>
            {proposal.decision?.note ? (
              <p className="mt-1 italic">“{proposal.decision.note}”</p>
            ) : null}
            {proposal.rewound ? (
              <p className="mt-1 text-[#b3261e]">Pulled back: {proposal.rewound.reason}</p>
            ) : null}
            {ev.outcome === "allow" && ev.ruleId ? (
              <p className="mt-1 text-muted">
                Rule that allowed it:{" "}
                <span className="font-medium text-ink">
                  {rules.find((r) => r.id === ev.ruleId)?.note ?? ev.ruleId}
                </span>
              </p>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}
