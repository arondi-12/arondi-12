import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/marketing/chrome";

export const metadata = { title: "The Consent Rail · Ziki" };

const moves = [
  {
    tag: "01",
    title: "The envelope",
    body: "A per-agent contract: which actions may run unattended, at what severity, estimate, label, confidence, evidence and daily cap. Anything not covered asks.",
    detail:
      "Four dials set the default posture: Observe, Propose, Act within envelope, Act & report. The envelope is editable, readable by the agent, and never able to widen a Ziki gate.",
  },
  {
    tag: "02",
    title: "Teaching answers",
    body: "Allow once, Allow like this, Decline with a note, Never like this. The second and fourth write a visible rule instead of unblocking a single action.",
    detail:
      "The rule is written no wider than the ask that taught it — same severity ceiling, estimate rounded up to 15 minutes, same risk tier, three a day — and it records which ask created it.",
  },
  {
    tag: "03",
    title: "Receipts",
    body: "Every unattended action lands in the ledger with the rule that authorised it and the conditions that passed.",
    detail:
      "The same trace is available to the agent at POST /api/v1/consent/actions, so it can explain the outcome to its owner without inventing a reason.",
  },
  {
    tag: "04",
    title: "Rewind",
    body: "Pull back an action, or pause the agent. Pausing cancels in-flight work immediately, whatever the rules say.",
    detail:
      "Control is exercised after the fact at low cost, not only before the fact at high cost. A bad autonomous action becomes a one-click rule change.",
  },
];

const beforeAfter = [
  ["One prompt per action, hundreds a week", "One contract per agent, edited rarely"],
  ["Approve / reject, no memory", "Answers teach the rail (allow like this / never like this)"],
  ["The human is a serial bottleneck", "The envelope absorbs routine work and escalates the novel"],
  ["Control only before the action", "Control before and after: receipts plus rewind"],
  ["“Why am I looking at this?”", "Every ask names the nearest rule and the failing condition"],
  ["Autonomy is all-or-nothing", "Autonomy is scoped, capped, and per action type"],
  ["Rubber-stamping is invisible", "Decisions are measured: approval, rewind and rule churn"],
];

const metricRows = [
  ["Ask precision", "share of asks a human would have approved", "falling asks at a constant approval rate means the envelope is learning"],
  ["Interruption load", "asks per human per day", "the headline cost the rail is designed to reduce"],
  ["Rewind rate", "pulled-back actions ÷ unattended actions", "the honesty check: it should be small and non-zero"],
  ["Rule churn", "rules written, edited, disabled", "healthy early, suspicious if it never settles"],
  ["Time to first action", "issue confirmation to a started claim", "the cost of the human bottleneck the rail removes"],
  ["Override regret", "rewinds a human calls “should have asked”", "the failure mode to watch for automation over-trust"],
];

export default function ConsentRailDocPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-[#1d2f52] bg-[#08132d] py-16 text-white">
          <div className="wrap">
            <span className="chip mb-4 border-[#2b4370] bg-[#13233f] text-[#8fc9ff]">
              Design note · human–agent interaction
            </span>
            <h1 className="max-w-3xl font-display text-[38px] font-extrabold leading-tight sm:text-[46px]">
              The Consent Rail: permission at the level of intent, not the level of clicks.
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#a3b1ce]">
              A working improvement to Ziki&apos;s owner-first autonomy, built into this
              reproduction. The feature changes how a person and an agent negotiate what the agent
              may do alone — and how the person can take it back.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard/approvals" className="btn bg-white text-[#0b1733] hover:bg-[#eef2f9]">
                Open the approval inbox
              </Link>
              <Link href="/dashboard/autonomy" className="btn border border-[#2b4370] bg-[#13233f] text-white hover:bg-[#1a2c4d]">
                Open the autonomy ledger
              </Link>
            </div>
          </div>
        </section>
        <section id="explainer" className="border-b border-[#e0e6f1] bg-white py-14">
          <div className="wrap">
            <h2 className="font-display text-2xl font-bold">Start here: what changed, in plain words</h2>
            <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[#3d4a66]">
              Ziki asks an agent to get permission for every bid, claim and escalation. Asked forty
              times a day, that turns the owner into a bottleneck and the click into a reflex. The
              Consent Rail moves the decision up one level: the owner writes a small contract per
              agent, the rail applies it in the open, and every answer becomes a rule, a receipt or a
              reversal.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                {
                  label: "Approvals",
                  href: "/dashboard/approvals",
                  title: "Where questions arrive",
                  body: "Only actions outside the envelope land here. Each card carries the plan, estimate, confidence, evidence, risk, reversibility and the rule trace that stopped it.",
                },
                {
                  label: "Autonomy ledger",
                  href: "/dashboard/autonomy",
                  title: "Where answers live",
                  body: "The contract per agent: the autonomy dial, the editable rules, in-flight work with pull-back, and every unattended action with the rule that allowed it.",
                },
                {
                  label: "Agent API + events",
                  href: "/developers",
                  title: "Where agents see the same rules",
                  body: "Agents read their envelope and propose actions over HTTP; allow, ask and block come back with a trace, and consent.* events appear on the project stream.",
                },
              ].map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="rounded-2xl border border-[#e0e6f1] p-4 transition-colors hover:border-[#c2cfe6] hover:bg-[#fafcff]"
                >
                  <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#3978f6]">
                    {card.label}
                  </div>
                  <div className="mt-1 text-[14px] font-semibold">{card.title}</div>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted">{card.body}</p>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[#eef2f9] bg-[#fafcff] p-4">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
                The 90-second demo
              </div>
              <ol className="mt-2 grid gap-1.5 text-[12.5px] text-[#3d4a66] sm:grid-cols-2">
                {[
                  "Open Approvals and read Why this is in front of you on the #401 bid.",
                  "Answer Allow like this, then find the new rule in the autonomy ledger.",
                  "Pull back an in-flight action and watch the consent.rewound receipt.",
                  "Pause the agent: in-flight work is cancelled, whatever the rules say.",
                  "Post the same action through the API and see allow, ask or block with a trace.",
                  "Check the activity stream for the consent.* events an agent would consume.",
                ].map((step, i) => (
                  <li key={step} className="flex gap-2">
                    <span className="mono text-[10.5px] text-[#3978f6]">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-4 text-[12px] text-muted">
              A longer plain-language guide ships with the code as{" "}
              <span className="mono">docs/EXPLAINER.md</span>; the technical rationale, rule
              semantics and evaluation plan are in <span className="mono">docs/CONSENT-RAIL.md</span>{" "}
              and below on this page.
            </p>
          </div>
        </section>


        <section className="border-b border-[#e0e6f1] bg-white py-14">
          <div className="wrap grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="font-display text-2xl font-bold">The problem with “ask before you act”</h2>
              <div className="prose-ziki mt-3 text-[14px]">
                <p>
                  Ziki&apos;s protocol is explicit: an agent must ask its owner before bidding,
                  claiming, escalating or widening scope. That is the right instinct — people
                  should hold the decision. But the instruction is written at the granularity of
                  the <em>action</em>, and human attention does not scale to that granularity.
                </p>
                <p>
                  Three things follow. First, the human becomes a serial bottleneck: every claim
                  waits for a click. Second, the clicks degrade into rubber stamps — after the
                  twentieth “should I bid on this?” the question stops being read. Third, the
                  answer has no memory: approving a 30-minute dark-mode fix teaches the rail
                  nothing, so the same question returns tomorrow.
                </p>
                <p className="font-medium text-ink">
                  The interaction failure is not that agents ask too much. It is that asking is the
                  only way a person can express a preference.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#e0e6f1] bg-[#f8fafd] p-5">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted">
                What the person is saying, and what the system hears
              </div>
              <div className="mt-3 space-y-2 text-[12.5px]">
                {[
                  ["“Yes, fix that small UI bug.”", "approve(ask_381) — forgotten"],
                  ["“Yes, another small UI bug.”", "approve(ask_402) — forgotten"],
                  ["“No, not billing code.”", "reject(ask_417) — forgotten"],
                  ["“Why am I being asked again?”", "no representation in the system"],
                ].map(([said, heard]) => (
                  <div key={said} className="rounded-xl border border-[#e0e6f1] bg-white p-3">
                    <div className="font-medium text-ink">{said}</div>
                    <div className="mono mt-0.5 text-[11px] text-muted">{heard}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12px] text-muted">
                The preference exists in the person&apos;s head, not in the system. Every ask has
                to re-derive it.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-[#e0e6f1] bg-[#f5f7fc] py-14">
          <div className="wrap">
            <h2 className="font-display text-2xl font-bold">The idea in one line</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#3d4a66]">
              Replace per-action permission prompts with a per-agent{" "}
              <strong>consent envelope</strong> that the rail evaluates in the open, and give every
              answer a way to become a rule, a receipt, or a reversal.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {moves.map((move) => (
                <div key={move.tag} className="card p-5">
                  <div className="font-display text-[12px] font-bold text-[#3978f6]">{move.tag}</div>
                  <h3 className="mt-1.5 font-display text-[16px] font-bold">{move.title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#3d4a66]">{move.body}</p>
                  <p className="mt-2 border-t border-[#f1f4fa] pt-2 text-[11.5px] leading-relaxed text-muted">
                    {move.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="border-b border-[#e0e6f1] bg-white py-14">
          <div className="wrap">
            <h2 className="font-display text-2xl font-bold">
              Why this is an interaction improvement, not just a settings page
            </h2>
            <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-muted">
              Five well-worn findings from human–automation research, applied literally.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                [
                  "Automation is not one thing",
                  "Levels-of-automation work (Sheridan and Verplank; Parasuraman, Sheridan and Wickens) separates information acquisition, analysis, decision and action. Ziki already automates analysis and action while keeping the decision human — but as one on/off switch. The envelope makes the decision level adjustable, per action type.",
                ],
                [
                  "Mixed-initiative, not one-way requests",
                  "Horvitz's mixed-initiative design argues both parties should be able to take and yield initiative. Today the agent initiates and the human disposes. In the rail the human can also initiate — pause, pull back, write a rule — and the agent must reason with that artifact next time.",
                ],
                [
                  "Rubber-stamping is a design outcome",
                  "Approval fatigue is not a user failing. When the same low-information prompt repeats, people approve on autopilot; Parasuraman and Riley call the result misuse and over-trust. Moving the prompt up a level makes each remaining ask novel enough to deserve reading, and each ask says why it is there.",
                ],
                [
                  "Explanations must be contrastive",
                  "People ask “why this rather than that?”. A model card or a confidence score does not answer that. The ask names the nearest allow rule and the exact condition that failed — the contrastive explanation the person actually needs.",
                ],
                [
                  "Undo is a safety mechanism",
                  "Reversibility changes the risk calculus of delegation. The ledger plus rewind makes a wider envelope defensible, because a wrong autonomous action is cheap to reverse and cheap to prevent next time.",
                ],
                [
                  "Calibrated trust beats maximal confirmation",
                  "The goal is not maximum human involvement; it is human involvement where it changes the outcome. The counters — asks waiting, actions unattended, minutes of asking removed — make that trade-off visible instead of implicit.",
                ],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-[#e0e6f1] p-4">
                  <h3 className="text-[13.5px] font-semibold">{title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#3d4a66]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="border-b border-[#e0e6f1] bg-[#f5f7fc] py-14">
          <div className="wrap">
            <h2 className="font-display text-2xl font-bold">Three walks through the demo data</h2>
            <p className="mt-2 max-w-3xl text-[13.5px] text-muted">
              Every scenario below is live in the seeded workspace — open the inbox and the ledger
              to see the same state.
            </p>
            <div className="mt-6 space-y-4">
              {[
                {
                  title: "A bid just outside the envelope",
                  meta: "David's Claude · bid · #401 · 90 min · high · payments",
                  steps: [
                    "The agent proposes a 90-minute fix on a high-severity payments bug.",
                    "The rail checks severity (high > medium), the excluded label (payments), the estimate (90 > 45) and the daily cap (2 of 3). Three conditions fail.",
                    "The ask arrives with the plan, the estimate, 72% confidence, two evidence links, and the sentence “nearest rule stopped short because the issue is high, carries payments, and the estimate is 90 min”.",
                    "You answer Allow once (billing deserves a read), or Never like this on payments, which writes a block rule and suppresses this whole class of asks.",
                  ],
                },
                {
                  title: "A verdict with no evidence",
                  meta: "David's Reviewer · test verdict · #396 · high · no commit attached",
                  steps: [
                    "The reviewer wants to sign PR #1851 as good to merge.",
                    "Its envelope allows verdicts only with evidence at low risk; this ask carries no commit and is medium risk.",
                    "The ask shows “carries evidence: nothing linked yet” next to “risk ≤ low: this action is medium risk”.",
                    "Allow like this would be wrong here — the rail says it would widen to high severity, 15 minutes, medium risk. Instead you decline with “attach the commit hash and the CI run”, which the agent reads next to the ask.",
                  ],
                },
                {
                  title: "A triage the owner never asked for",
                  meta: "Kai's Triager · triage · #403 → duplicate of #401",
                  steps: [
                    "A triager agent owned by Kai proposes closing a payments issue as a duplicate.",
                    "That agent sits in Propose mode, so everything asks — even though the action is reversible.",
                    "The ask includes the diff of the two reports and the sentence “Propose mode: nothing is sent without a human click”.",
                    "One “allow like this” moves that agent to acting within its envelope for triage under high severity, and the ledger records the rule and the ask that created it.",
                  ],
                },
              ].map((scenario) => (
                <div key={scenario.title} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[14px] font-semibold">{scenario.title}</h3>
                    <span className="mono text-[10.5px] text-muted">{scenario.meta}</span>
                  </div>
                  <ol className="mt-3 space-y-2">
                    {scenario.steps.map((step, i) => (
                      <li
                        key={step}
                        className="flex gap-2.5 text-[12.5px] leading-relaxed text-[#3d4a66]"
                      >
                        <span className="mono mt-0.5 text-[10.5px] text-[#3978f6]">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="border-b border-[#e0e6f1] bg-white py-14">
          <div className="wrap grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="font-display text-2xl font-bold">Rule semantics</h2>
              <p className="mt-2 text-[13px] text-muted">
                Conditions are ANDed. Precedence is: Ziki hard gates, then the autonomy mode, then
                a matching block rule, then a matching allow rule, then the default ask.
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-[#e0e6f1]">
                {[
                  ["maxSeverity", "ceiling on the issue severity"],
                  ["maxEstimateMinutes", "ceiling on the agent's own estimate"],
                  ["minConfidence", "floor on the agent's stated confidence"],
                  ["labels", "at least one listed label must be present"],
                  ["excludeLabels", "none of these labels may be present"],
                  ["requireEvidence", "a linked commit, log or trace must exist"],
                  ["riskAtMost", "ceiling on the blast-radius tier"],
                  ["maxPerDay", "cap on unattended actions of that kind per UTC day"],
                ].map(([key, body]) => (
                  <div key={key} className="flex gap-3 border-b border-[#f1f4fa] px-3.5 py-2.5 last:border-0">
                    <span className="mono w-[150px] shrink-0 text-[11px] text-[#2359c4]">{key}</span>
                    <span className="text-[11.5px] text-muted">{body}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">What it changes in Ziki</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-[#e0e6f1]">
                <div className="grid grid-cols-2 border-b border-[#f1f4fa] bg-[#fafcff] px-3.5 py-2 text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted">
                  <span>Before</span>
                  <span>With the rail</span>
                </div>
                {beforeAfter.map(([before, after]) => (
                  <div key={before} className="grid grid-cols-2 gap-3 border-b border-[#f1f4fa] px-3.5 py-2.5 last:border-0">
                    <span className="text-[11.5px] text-muted">{before}</span>
                    <span className="text-[11.5px] font-medium text-[#3d4a66]">{after}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        <section className="border-b border-[#e0e6f1] bg-[#f5f7fc] py-14">
          <div className="wrap grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="font-display text-2xl font-bold">How you would know it worked</h2>
              <p className="mt-2 text-[13px] text-muted">
                A feature that reduces interruptions can also reduce oversight. These are the
                counters that separate the two.
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-[#e0e6f1] bg-white">
                {metricRows.map(([metric, definition, read]) => (
                  <div key={metric} className="border-b border-[#f1f4fa] px-3.5 py-2.5 last:border-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[12px] font-semibold">{metric}</span>
                      <span className="text-[10.5px] text-muted">{definition}</span>
                    </div>
                    <div className="text-[11px] text-[#3d4a66]">{read}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Limits and failure modes</h2>
              <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-[#3d4a66]">
                {[
                  "Envelope drift: a rule written for one ask can over-generalise. Mitigation: rules are written no wider than the ask, carry provenance, and are shown in plain language.",
                  "Rubber-stamping moves up a level. A person can still approve a rule without reading it. Mitigation: the proposed rule is spelled out next to the button, and the ledger shows what it would have allowed.",
                  "Explanations are only as good as the agent's self-report. Confidence and risk are inputs, not truth; that is why hard gates and independent reviewers stay.",
                  "A block rule is not a security boundary. Merge, payments and auth still need real permissions; the envelope shapes attention, it does not replace authorisation.",
                  "Too wide an envelope hides drift until it is expensive. The rewind rate and override-regret metric exist to surface exactly that.",
                ].map((line) => (
                  <li key={line} className="rounded-xl border border-[#e0e6f1] bg-white p-3">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="wrap grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="font-display text-2xl font-bold">Where it lives in this build</h2>
              <div className="mt-3 space-y-2 text-[12px]">
                {[
                  ["lib/consent/engine.ts", "the decision function: conditions, precedence, trace, rule generation"],
                  ["lib/types.ts", "EnvelopeRule, Proposal, Evaluation, LedgerEntry"],
                  ["lib/store.ts", "decide, rewind, pause, submitAction, ledger and event writes"],
                  ["components/dashboard/ask-card.tsx", "the ask: plan, risk, rule trace, four answers"],
                  ["components/dashboard/agent-envelope.tsx", "the dial, the editable rules, in-flight work, receipts"],
                  ["app/api/v1/consent/actions/route.ts", "the HTTP rail an agent calls"],
                  ["app/api/v1/consent/envelope/route.ts", "the agent-readable contract"],
                  ["lib/consent/engine.test.ts", "unit tests for precedence, caps and rule widening"],
                ].map(([path, body]) => (
                  <div key={path} className="rounded-xl border border-[#eef2f9] bg-[#fafcff] p-2.5">
                    <div className="mono text-[11px] text-[#2359c4]">{path}</div>
                    <div className="text-[11.5px] text-muted">{body}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#263b63] bg-[#0b1733] p-6 text-white">
              <h2 className="font-display text-xl font-bold">Try the loop</h2>
              <ol className="mt-3 space-y-2 text-[12.5px] text-[#c8d5ec]">
                <li>1. Open the approval inbox and read the trace on the #401 bid.</li>
                <li>2. Answer “Allow like this” and watch the rule appear in the ledger.</li>
                <li>3. Submit the same action again through the API and see it auto-approve.</li>
                <li>4. Pause the agent and watch its in-flight work get pulled back.</li>
              </ol>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/dashboard/approvals" className="btn bg-white text-[#0b1733] hover:bg-[#eef2f9]">
                  Approvals
                </Link>
                <Link href="/dashboard/autonomy" className="btn border border-[#2b4370] bg-[#13233f] text-white hover:bg-[#1a2c4d]">
                  Ledger
                </Link>
                <Link href="/developers" className="btn border border-[#2b4370] bg-[#13233f] text-white hover:bg-[#1a2c4d]">
                  API
                </Link>
              </div>
            </div>
          </div>
        </section>


      </main>
      <SiteFooter />
    </>
  );
}
