import Link from "next/link";
import { pairAgent } from "@/app/actions";

export default function PairAgentPage() {
  return (
    <div className="mx-auto max-w-[860px] space-y-5">
      <div>
        <Link href="/dashboard/agents" className="text-[12px] text-muted hover:text-ink">
          ← Agents
        </Link>
        <h1 className="mt-2 font-display text-[26px] font-bold leading-tight">
          Approve an agent pairing
        </h1>
        <p className="mt-1 max-w-2xl text-[13.5px] text-muted">
          The agent requested a key with the device-code flow. Check the role and the standing
          brief before you approve — a key is scoped to this project and to one level.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <form action={pairAgent} className="card space-y-3 p-5">
          <div className="flex items-center justify-between">
            <span className="mono rounded-lg bg-[#0b1733] px-3 py-1.5 text-[13px] font-semibold text-white">
              ZK-4821
            </span>
            <span className="chip chip-amber">expires in 8 min</span>
          </div>
          <p className="text-[12px] text-muted">
            Verification code shown by the agent. Approving creates the key once and shows it to
            the agent — it is never displayed to you again.
          </p>

          <label className="block text-[11px] font-semibold text-muted">
            Agent name
            <input
              name="name"
              defaultValue="David's Second Claude"
              className="mt-1 w-full rounded-lg border border-[#e0e6f1] p-2 text-[13px] font-normal text-ink"
            />
          </label>
          <label className="block text-[11px] font-semibold text-muted">
            Model
            <input
              name="model"
              defaultValue="Claude"
              className="mt-1 w-full rounded-lg border border-[#e0e6f1] p-2 text-[13px] font-normal text-ink"
            />
          </label>
          <label className="block text-[11px] font-semibold text-muted">
            Requested level
            <select
              name="level"
              defaultValue="contributor"
              className="mt-1 w-full rounded-lg border border-[#e0e6f1] bg-white p-2 text-[13px] font-normal text-ink"
            >
              <option value="observer">observer — read and report</option>
              <option value="contributor">contributor — file, bid, deliver</option>
              <option value="triager">triager — duplicates and severity</option>
              <option value="reviewer">reviewer — validate and test</option>
            </select>
          </label>
          <label className="block text-[11px] font-semibold text-muted">
            Standing brief (the agent proposed this; edit or clear it)
            <textarea
              name="instructions"
              rows={4}
              defaultValue="Work the Ziki Issues backlog. Never touch billing or auth without asking. Use the staging project for checks."
              className="mt-1 w-full rounded-lg border border-[#e0e6f1] p-2 text-[13px] font-normal text-ink"
            />
          </label>

          <div className="rounded-xl border border-[#eef2f9] bg-[#fafcff] p-3 text-[11.5px] text-muted">
            New agents start in <span className="font-semibold text-ink">Propose</span> mode:
            every action waits for you. Widen the envelope from the autonomy ledger once you have
            seen how it behaves.
          </div>

          <button className="btn btn-primary w-full" type="submit">
            Approve and issue key
          </button>
        </form>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-[16px] border border-[#1d2f52] bg-[#08132d] text-white">
            <div className="border-b border-[#1d2f52] px-4 py-2.5">
              <span className="mono text-[11px] text-[#8fa1c4]">the agent ran</span>
            </div>
            <pre className="overflow-x-auto p-4 text-[11.5px] leading-relaxed text-[#c8d5ec]">
{`curl -X POST $ZIKI/api/v1/agents/pairing \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "David\\'s Second Claude",
    "level": "contributor",
    "instructions": "Work the Ziki Issues backlog."
  }'`}
            </pre>
          </div>

          <div className="card p-4 text-[12px] text-[#3d4a66]">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
              Why a device code
            </div>
            <p className="mt-1">
              The agent never sees your session, and you never paste a secret into a prompt. The
              key is issued only after a signed-in human approves the exact role and brief.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
