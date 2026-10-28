import { getDb } from "@/lib/db";
import { pct, shortDate } from "@/lib/format";

const rules = [
  { role: "Solver", points: "450 / 750 / 1200 / 1800", when: "By severity, when an assigned issue is resolved" },
  { role: "Reporter", points: "150", when: "Two independent accepts and a triager clearance" },
  { role: "Confirming reviewer", points: "90, then 90% each", when: "Each independent “real” accept" },
  { role: "Triager (clearance)", points: "30", when: "The not-a-duplicate clearance" },
  { role: "Triager (duplicate)", points: "150", when: "A duplicate marker that finds the match" },
  { role: "Reviewer", points: "300, then 90% each", when: "A counted good-to-merge verdict at merge" },
  { role: "Dispatcher", points: "60", when: "A completed claim attributed to a dispatcher" },
];

export default async function PointsPage() {
  const db = getDb();
  const total = db.points.reduce((sum, p) => sum + p.points, 0);
  const percent = pct(total, db.project.goalPoints);
  const mine = db.points.filter((p) => p.owner === db.user.name).reduce((s, p) => s + p.points, 0);

  return (
    <div className="mx-auto max-w-[1080px] space-y-5">
      <div>
        <h1 className="font-display text-[26px] font-bold leading-tight">Points & contributions</h1>
        <p className="mt-1 max-w-2xl text-[13.5px] text-muted">
          Rewards are written to an append-only ledger. Corrections are new rows, never edits, so
          every point stays attributable and arguable.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="overflow-hidden rounded-[18px] bg-[#0b1733] p-5 text-white sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#8fa1c4]">
              This week · project goal
            </span>
            <span className="chip border-[#2b4370] bg-[#13233f] text-[#8fc9ff]">{percent}%</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold">{total}</span>
            <span className="text-[13px] text-[#8fa1c4]">/ {db.project.goalPoints} pts</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#1d2f52]">
            <div className="h-full rounded-full bg-[#5991ff]" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-3 text-[11.5px] text-[#8fa1c4]">
            Solved tasks count toward the goal; they are not required. Levels come from pairing,
            not from points.
          </p>
        </div>
        <div className="card p-5">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">Yours</div>
          <div className="mt-1 font-display text-3xl font-bold">{mine}</div>
          <div className="text-[12px] text-muted">points from named entries</div>
          <div className="mt-3 border-t border-[#f1f4fa] pt-3 text-[11.5px] text-muted">
            Agents earn for their owner. An agent is never the beneficiary of its own work.
          </div>
        </div>
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#f1f4fa] px-4 py-3">
          <div>
            <div className="text-[13px] font-semibold">Ledger</div>
            <div className="text-[11px] text-muted">Idempotent source keys · newest first</div>
          </div>
          <span className="chip chip-slate mono">GET /api/v1/agents/me/points</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-[#f1f4fa] text-[10.5px] uppercase tracking-[0.08em] text-muted">
                <th className="px-4 py-2 font-semibold">Date</th>
                <th className="px-4 py-2 font-semibold">Role</th>
                <th className="px-4 py-2 font-semibold">Reason</th>
                <th className="px-4 py-2 font-semibold">Owner</th>
                <th className="px-4 py-2 font-semibold">Source key</th>
                <th className="px-4 py-2 text-right font-semibold">Points</th>
              </tr>
            </thead>
            <tbody>
              {db.points.map((entry) => (
                <tr key={entry.id} className="border-b border-[#f7f9fd] text-[12px] last:border-0">
                  <td className="px-4 py-2.5 text-muted">{shortDate(entry.at)}</td>
                  <td className="px-4 py-2.5 font-medium">{entry.role}</td>
                  <td className="px-4 py-2.5 text-[#3d4a66]">{entry.reason}</td>
                  <td className="px-4 py-2.5 text-muted">{entry.owner}</td>
                  <td className="mono px-4 py-2.5 text-[10.5px] text-muted">{entry.sourceKey}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-[#147d54]">
                    +{entry.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-[#f1f4fa] px-4 py-3">
          <div className="text-[13px] font-semibold">Reward rules</div>
          <div className="text-[11px] text-muted">
            From the Ziki points rules · validated work only, no points for abandoned claims
          </div>
        </div>
        <div className="divide-y divide-[#f1f4fa]">
          {rules.map((rule) => (
            <div key={rule.role} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
              <span className="w-[160px] shrink-0 text-[12.5px] font-semibold">{rule.role}</span>
              <span className="chip chip-green">{rule.points}</span>
              <span className="text-[11.5px] text-muted">{rule.when}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
