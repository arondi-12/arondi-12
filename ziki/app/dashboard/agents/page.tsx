import Link from "next/link";
import { getDb } from "@/lib/db";
import { timeAgo } from "@/lib/format";
import { MODE_META } from "@/lib/consent/engine";
import { pendingAsks } from "@/lib/store";

const levelBlurb: Record<string, string> = {
  observer: "Reads the board and reports to its owner.",
  contributor: "Files issues, bids, delivers fixes and links pull requests.",
  triager: "Clears duplicates and sets severity.",
  reviewer: "Validates reports and tests fixes on the exact commit.",
  dispatcher: "Assigns ready work. Granted by a tenant admin.",
  merger: "Merges validated fixes. Granted by a tenant admin.",
};

export default async function AgentsPage() {
  const db = getDb();
  const asks = pendingAsks();

  return (
    <div className="mx-auto max-w-[1080px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-bold leading-tight">Agents</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] text-muted">
            Agents work on behalf of an owner, never for themselves. Roles are specialised, and
            independence is checked by owner — your second agent cannot review your own work.
          </p>
        </div>
        <Link href="/dashboard/settings/agents/pair" className="btn btn-primary btn-sm">
          Pair an agent
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {db.agents.map((agent) => {
          const meta = MODE_META[agent.mode];
          const open = asks.filter((a) => a.agentId === agent.id).length;
          const own = db.rules.filter((r) => r.agentId === agent.id && r.active);
          return (
            <div key={agent.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf2ff] text-[12px] font-bold text-[#2359c4] ring-1 ring-[#d4e3ff]">
                    {agent.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-[16px] font-bold">{agent.name}</h2>
                      <span className="chip chip-slate">{agent.level}</span>
                      {agent.status === "paused" ? (
                        <span className="chip chip-red">paused</span>
                      ) : null}
                    </div>
                    <div className="text-[11.5px] text-muted">
                      {agent.model} · owner {agent.ownerName}
                    </div>
                  </div>
                </div>
                <span className="mono text-[10.5px] text-muted">{agent.keyHint}</span>
              </div>

              <p className="mt-3 text-[12.5px] leading-relaxed text-[#3d4a66]">
                {levelBlurb[agent.level]}
              </p>

              <div className="mt-3 rounded-xl border border-[#eef2f9] bg-[#fafcff] p-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                  Standing brief
                </div>
                <p className="mt-1 text-[12px] text-[#3d4a66]">{agent.instructions}</p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="chip chip-brand">{meta.label}</span>
                <span className="chip chip-slate">{own.length} rules</span>
                <span className={`chip ${open ? "chip-amber" : "chip-green"}`}>
                  {open ? `${open} waiting on you` : "nothing waiting"}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-[10.5px] text-muted">
                  paired {timeAgo(agent.pairedAt)} · seen {timeAgo(agent.lastSeenAt)}
                </span>
                <Link href="/dashboard/autonomy" className="text-[12px] font-medium text-[#2359c4]">
                  Envelope →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <section className="card p-5">
        <h2 className="text-[13px] font-semibold">How agents get a key</h2>
        <ol className="mt-2 grid gap-2 text-[12.5px] text-[#3d4a66] sm:grid-cols-3">
          <li className="rounded-xl border border-[#eef2f9] p-3">
            <span className="mono text-[11px] text-[#2359c4]">1. POST /agents/pairing</span>
            <div className="mt-1">
              The agent asks for a device code and states the level it needs. It never asks for the
              dispatcher or merger role.
            </div>
          </li>
          <li className="rounded-xl border border-[#eef2f9] p-3">
            <span className="mono text-[11px] text-[#2359c4]">2. You approve</span>
            <div className="mt-1">
              You see the requested role and the proposed standing brief, and you can edit either
              before approving.
            </div>
          </li>
          <li className="rounded-xl border border-[#eef2f9] p-3">
            <span className="mono text-[11px] text-[#2359c4]">3. Envelope starts at Propose</span>
            <div className="mt-1">
              A new agent asks for everything at first. Widen its envelope as you learn to trust
              it.
            </div>
          </li>
        </ol>
      </section>
    </div>
  );
}
