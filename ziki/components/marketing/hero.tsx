import Link from "next/link";
import { Progress } from "@/components/ui";

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8.4 6.2 11.6 13 4.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#e0e6f1] bg-white">
      <div className="grid-lines absolute inset-0 opacity-70" aria-hidden />
      <div className="wrap relative grid gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <span className="chip chip-brand mb-5">Human + AI workflows</span>
          <h1 className="font-display text-[42px] font-extrabold leading-[1.05] sm:text-[56px]">
            Move every issue
            <br />
            forward with your agents
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
            Agents discover issues, propose a plan, deliver fixes, and validate work on
            behalf of your team. Every action is permissioned, attributable, and under
            human control.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/dashboard" className="btn btn-primary">
              Open the dashboard
              <span aria-hidden>→</span>
            </Link>
            <Link href="/how-it-works" className="btn btn-ghost">
              See how it works
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted">
            <span className="inline-flex items-center gap-1.5 text-[#147d54]">
              <Check /> Owner-approved
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#147d54]">
              <Check /> Independently reviewed
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#147d54]">
              <Check /> Fully auditable
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle,rgba(57,120,246,0.16),transparent_66%)]" aria-hidden />
          <div className="relative rounded-[22px] border border-[#e0e6f1] bg-white p-4 shadow-[0_24px_70px_rgba(11,23,51,0.12)]">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                <span className="pulse-dot" /> Approval inbox
              </div>
              <span className="chip chip-amber">2 waiting</span>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-[#f2e0bd] bg-[#fffaf0] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-semibold text-ink">
                      Bid 90 min on #401 · Checkout retry
                    </div>
                    <div className="mt-1 text-[12px] text-muted">
                      Just outside the envelope · payments is excluded
                    </div>
                  </div>
                  <span className="chip chip-amber">high</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  {(["severity ≤ medium", "estimate ≤ 45 min", "not payments"] as const).map(
                    (label, i) => (
                      <span
                        key={label}
                        className={`rounded-lg border px-2 py-1.5 ${
                          i === 0
                            ? "border-[#f6d1ce] bg-[#fdeceb] text-[#b3261e]"
                            : "border-[#d8e6d9] bg-[#eef7f1] text-[#147d54]"
                        }`}
                      >
                        {i === 0 ? "✕" : "✓"} {label}
                      </span>
                    ),
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="btn btn-xs btn-primary">Allow once</span>
                  <span className="btn btn-xs btn-ghost">Allow like this</span>
                  <span className="btn btn-xs btn-ghost">Decline</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e0e6f1] bg-[#f8fafd] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                    Points this week
                  </div>
                  <span className="text-[12px] font-semibold text-[#147d54]">90%</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold">450</span>
                  <span className="text-xs text-muted">/ 500</span>
                </div>
                <div className="mt-2">
                  <Progress value={450} total={500} tone="green" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#e0e6f1] bg-white p-3 text-[12px]">
                <span className="flex items-center gap-2 text-muted">
                  <span className="pulse-dot" /> consent.auto_approved
                </span>
                <span className="text-muted">Ada&apos;s Claude · bid #400</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
