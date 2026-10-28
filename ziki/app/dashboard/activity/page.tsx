import Link from "next/link";
import { EventFeed } from "@/components/dashboard/bits";
import { getDb } from "@/lib/db";
import { clock } from "@/lib/format";

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string }>;
}) {
  const { channel = "all" } = await searchParams;
  const db = getDb();
  const events =
    channel === "all" ? db.events : db.events.filter((e) => e.channel === channel);
  const consentEvents = db.events.filter((e) => e.type.startsWith("consent."));

  return (
    <div className="mx-auto max-w-[1080px] space-y-5">
      <div>
        <h1 className="font-display text-[26px] font-bold leading-tight">Event stream</h1>
        <p className="mt-1 max-w-2xl text-[13.5px] text-muted">
          Agents poll typed events; they never guess by re-reading the board. Person events and
          agent events share one feed so attribution stays obvious.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {[
              ["all", "Everything", db.events.length],
              ["agent", "Agent events", db.events.filter((e) => e.channel === "agent").length],
              ["person", "Person events", db.events.filter((e) => e.channel === "person").length],
            ].map(([key, label, count]) => (
              <Link
                key={String(key)}
                href={key === "all" ? "/dashboard/activity" : `/dashboard/activity?channel=${key}`}
                className={`chip ${channel === key ? "chip-brand" : ""}`}
              >
                {label}
                <span className={channel === key ? "text-[#2359c4]" : "text-muted"}>{count}</span>
              </Link>
            ))}
          </div>

          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#f1f4fa] px-4 py-3">
              <div>
                <div className="text-[13px] font-semibold">Project feed</div>
                <div className="text-[11px] text-muted">Newest first · typed events</div>
              </div>
              <span className="chip chip-slate mono">GET /api/v1/events</span>
            </div>
            <EventFeed events={events} />
          </section>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-[16px] border border-[#1d2f52] bg-[#08132d] text-white">
            <div className="flex items-center justify-between border-b border-[#1d2f52] px-3.5 py-2.5">
              <span className="mono text-[10.5px] text-[#8fa1c4]">stream tail</span>
              <span className="flex items-center gap-1.5 text-[10.5px] text-[#8fc9ff]">
                <span className="pulse-dot" /> live
              </span>
            </div>
            <div className="space-y-1.5 p-3.5">
              {consentEvents.slice(0, 7).map((e) => (
                <div key={e.id} className="mono text-[10.5px] leading-relaxed">
                  <span className="text-[#7d90b4]">{clock(e.at)} </span>
                  <span className="text-[#8fc9ff]">{e.type}</span>
                  <div className="pl-[46px] text-[#c8d5ec]">{e.summary}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#1d2f52] px-3.5 py-2 text-[10.5px] text-[#8fa1c4]">
              cursor: eyJhbGciOiJIUzI1NiIs…
            </div>
          </div>

          <section className="card p-4">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
              New event types in this build
            </div>
            <ul className="mt-2 space-y-1.5 text-[12px] text-[#3d4a66]">
              <li><span className="mono text-[11px] text-[#b8791f]">consent.asked</span> — an action is outside the envelope</li>
              <li><span className="mono text-[11px] text-[#147d54]">consent.auto_approved</span> — the rail allowed it, with a rule id</li>
              <li><span className="mono text-[11px] text-[#2359c4]">consent.decided</span> — a human answered</li>
              <li><span className="mono text-[11px] text-[#b3261e]">consent.rewound</span> — a human pulled work back</li>
              <li><span className="mono text-[11px] text-[#b3261e]">consent.agent_paused</span> — hard stop, in-flight work cancelled</li>
            </ul>
            <Link
              href="/docs/consent-rail"
              className="mt-3 inline-block text-[12px] font-medium text-[#2359c4]"
            >
              Read the event contract →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
