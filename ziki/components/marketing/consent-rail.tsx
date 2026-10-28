import Link from "next/link";

const pillars = [
  {
    tag: "01 · Envelope",
    title: "Permission without prompts",
    body: "Each agent gets a small contract: which actions may proceed unattended, at what severity, estimate, label and daily cap. Anything outside it becomes a question.",
  },
  {
    tag: "02 · Teach",
    title: "Answer once, it learns the rule",
    body: "Every ask offers Allow once, Allow like this, or Never like this. The second and third write a visible rule you can read, edit and delete.",
  },
  {
    tag: "03 · Rewind",
    title: "Cheap reversal, not just approval",
    body: "Every autonomous action lands in a ledger with the rule that allowed it. Pull it back, pause the agent, and tighten the rule in one click.",
  },
];

export function ConsentRail() {
  return (
    <section className="border-b border-[#1d2f52] bg-[#08132d] py-20 text-white">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <span className="chip mb-5 border-[#2b4370] bg-[#13233f] text-[#8fc9ff]">
              New in this build
            </span>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              The Consent Rail: autonomy you can see, teach and take back.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#a3b1ce]">
              Ziki&apos;s rule is &ldquo;agents ask before they act&rdquo;. Asked a hundred times a
              week, that becomes a rubber stamp. The Consent Rail keeps the human decision but
              moves it up a level: you set the envelope once, and the rail decides each action
              against it — in the open, with a receipt.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/docs/consent-rail" className="btn bg-white text-[#0b1733] hover:bg-[#eef2f9]">
                Read the design note
              </Link>
              <Link href="/dashboard/approvals" className="btn border border-[#2b4370] bg-[#13233f] text-white hover:bg-[#1a2c4d]">
                Try the approval inbox
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[
                ["4", "asks waiting"],
                ["6", "acted unattended"],
                ["0", "left the envelope"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-[#1d2f52] bg-[#0c1a35] p-3">
                  <div className="font-display text-2xl font-bold">{value}</div>
                  <div className="text-[11px] text-[#8fa1c4]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {pillars.map((p) => (
              <div
                key={p.tag}
                className="rounded-2xl border border-[#1d2f52] bg-[#0c1a35] p-5"
              >
                <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#8fc9ff]">
                  {p.tag}
                </div>
                <div className="mt-2 font-display text-lg font-bold">{p.title}</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#a3b1ce]">{p.body}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-[#2b4370] bg-[#10203c] p-4">
              <div className="flex items-center justify-between text-[11px] text-[#8fa1c4]">
                <span className="mono text-[#8fc9ff]">consent.auto_approved</span>
                <span>rule: bid_small</span>
              </div>
              <div className="mt-2 text-[13px]">
                bid 30 min on <span className="text-white">#400</span> · severity ✓ · estimate ✓ ·
                labels ✓ · 2 of 3 today
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
