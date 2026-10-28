import Link from "next/link";
import { changeMode, rewind, togglePause, toggleRule } from "@/app/actions";
import { actionLabel, describeConditions, MODE_META } from "@/lib/consent/engine";
import { minutesLabel, timeAgo } from "@/lib/format";
import type { Agent, EnvelopeRule, LedgerEntry, Proposal } from "@/lib/types";

const MODES: Agent["mode"][] = ["observe", "propose", "act_within", "act_and_report"];

const effectChip = (effect: EnvelopeRule["effect"]) =>
  effect === "allow" ? "chip chip-green" : effect === "block" ? "chip chip-red" : "chip chip-amber";

export function AgentEnvelope({
  agent,
  rules,
  proposals,
  ledger,
}: {
  agent: Agent;
  rules: EnvelopeRule[];
  proposals: Proposal[];
  ledger: LedgerEntry[];
}) {
  const inFlight = proposals.filter(
    (p) => p.agentId === agent.id && p.status === "auto_approved" && !p.rewound,
  );
  const receipts = ledger.filter(
    (l) => l.agentId === agent.id && (l.outcome === "auto_approved" || l.outcome === "rewound"),
  );
  const paused = agent.status === "paused";

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#f1f4fa] px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf2ff] text-[12px] font-bold text-[#2359c4] ring-1 ring-[#d4e3ff]">
            {agent.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-[17px] font-bold">{agent.name}</h2>
              <span className="chip chip-slate">{agent.level}</span>
              {paused ? (
                <span className="chip chip-red">paused</span>
              ) : (
                <span className="chip chip-green">active</span>
              )}
            </div>
            <div className="mt-0.5 text-[11.5px] text-muted">
              {agent.model} · owner {agent.ownerName} · last seen {timeAgo(agent.lastSeenAt)} ·{" "}
              <span className="mono">{agent.keyHint}</span>
            </div>
          </div>
        </div>
        <form action={togglePause} className="flex items-center gap-2">
          <input type="hidden" name="agentId" value={agent.id} />
          <input type="hidden" name="status" value={paused ? "active" : "paused"} />
          <button className={`btn btn-sm ${paused ? "btn-soft" : "btn-ghost"}`} type="submit">
            {paused ? "Resume agent" : "Pause agent"}
          </button>
        </form>
      </div>

      <div className="space-y-5 px-5 py-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted">
              Autonomy dial
            </h3>
            <span className="text-[11px] text-muted">
              Pausing pulls back every in-flight action immediately
            </span>
          </div>
          <form action={changeMode} className="grid gap-1.5 sm:grid-cols-4">
            <input type="hidden" name="agentId" value={agent.id} />
            {MODES.map((mode) => {
              const meta = MODE_META[mode];
              const active = agent.mode === mode && !paused;
              return (
                <button
                  key={mode}
                  type="submit"
                  name="mode"
                  value={mode}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? "border-[#3978f6] bg-[#eaf2ff]"
                      : "border-[#e6ecf6] bg-white hover:border-[#c2cfe6]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[12.5px] font-semibold ${active ? "text-[#2359c4]" : ""}`}
                    >
                      {meta.label}
                    </span>
                    {active ? <span className="text-[11px] text-[#2359c4]">●</span> : null}
                  </div>
                  <div className="mt-0.5 text-[10.5px] leading-snug text-muted">{meta.blurb}</div>
                </button>
              );
            })}
          </form>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted">
              The envelope · {rules.filter((r) => r.active).length} active rules
            </h3>
            <span className="text-[11px] text-muted">Everything not covered here asks you</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-[#eef2f9]">
            {rules.length ? (
              rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex flex-wrap items-center gap-3 border-b border-[#f1f4fa] px-3 py-2.5 last:border-0"
                >
                  <span className="w-[118px] shrink-0 text-[12.5px] font-semibold">
                    {actionLabel(rule.action)}
                  </span>
                  <span className={effectChip(rule.effect)}>{rule.effect}</span>
                  <span className="min-w-0 flex-1 text-[11.5px] text-muted">
                    {describeConditions(rule.conditions)}
                    <span className="block text-[11.5px] text-[#3d4a66]">{rule.note}</span>
                    {rule.createdFromAskId ? (
                      <span className="text-[10.5px] text-[#2359c4]">
                        learned from an ask · {timeAgo(rule.createdAt)}
                      </span>
                    ) : null}
                  </span>
                  <form action={toggleRule}>
                    <input type="hidden" name="ruleId" value={rule.id} />
                    <input type="hidden" name="active" value={String(!rule.active)} />
                    <button
                      type="submit"
                      className={`text-[11px] underline-offset-2 hover:underline ${
                        rule.active ? "text-muted" : "text-[#2359c4]"
                      }`}
                    >
                      {rule.active ? "disable" : "enable"}
                    </button>
                  </form>
                </div>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-[12px] text-muted">
                No rules yet, so every action asks you. Answer one ask with &ldquo;allow like
                this&rdquo; to start the envelope.
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-muted">
              In flight
            </h3>
            {inFlight.length ? (
              <div className="space-y-2">
                {inFlight.map((p) => (
                  <div key={p.id} className="rounded-xl border border-[#f0dcb4] bg-[#fffaf0] p-3">
                    <div className="text-[12.5px] font-semibold">{p.title}</div>
                    <div className="mt-0.5 text-[11px] text-muted">
                      {minutesLabel(p.estimateMinutes)} estimate · started {timeAgo(p.createdAt)}
                    </div>
                    <form action={rewind} className="mt-2 flex gap-2">
                      <input type="hidden" name="askId" value={p.id} />
                      <input
                        type="hidden"
                        name="reason"
                        value="Pulled back from the autonomy ledger."
                      />
                      <button className="btn btn-xs btn-ghost" type="submit">
                        Pull it back
                      </button>
                      <Link href={`/dashboard/issues/${p.issueId}`} className="btn btn-xs btn-soft">
                        Open issue
                      </Link>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-[#e6ecf6] px-3 py-4 text-[11.5px] text-muted">
                Nothing running unattended right now.
              </p>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-muted">
              Latest receipts
            </h3>
            <div className="space-y-1.5">
              {receipts.slice(0, 3).map((entry) => (
                <div key={entry.id} className="rounded-xl border border-[#eef2f9] px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`mono text-[10.5px] ${
                        entry.outcome === "rewound" ? "text-[#b3261e]" : "text-[#147d54]"
                      }`}
                    >
                      {entry.outcome === "rewound" ? "consent.rewound" : "consent.auto_approved"}
                    </span>
                    <span className="text-[10.5px] text-muted">{timeAgo(entry.at)}</span>
                  </div>
                  <div className="text-[12px] leading-snug">{entry.summary}</div>
                  <div className="text-[10.5px] text-muted">
                    {entry.ruleNote ? `rule: ${entry.ruleNote}` : "no rule"}
                  </div>
                </div>
              ))}
              {!receipts.length ? (
                <p className="rounded-xl border border-dashed border-[#e6ecf6] px-3 py-4 text-[11.5px] text-muted">
                  No receipts yet.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
