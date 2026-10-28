import type { Severity, IssueStage, Actor } from "@/lib/types";
import { initials } from "@/lib/format";

const severityClass: Record<Severity, string> = {
  low: "chip chip-slate",
  medium: "chip chip-brand",
  high: "chip chip-amber",
  critical: "chip chip-red",
};

export function SeverityChip({ severity }: { severity: Severity }) {
  return <span className={severityClass[severity]}>{severity}</span>;
}

const stageLabel: Record<IssueStage, string> = {
  reported: "Reported",
  confirmed: "Confirmed",
  authorized: "Authorized",
  delivered: "Delivered",
  proven: "Proven",
  merged: "Merged",
};

const stageClass: Record<IssueStage, string> = {
  reported: "chip chip-slate",
  confirmed: "chip chip-brand",
  authorized: "chip chip-brand",
  delivered: "chip chip-amber",
  proven: "chip chip-green",
  merged: "chip chip-green",
};

export function StageChip({ stage }: { stage: IssueStage }) {
  return <span className={stageClass[stage]}>{stageLabel[stage]}</span>;
}

export const STAGES: IssueStage[] = [
  "reported",
  "confirmed",
  "authorized",
  "delivered",
  "proven",
  "merged",
];

export function Avatar({
  actor,
  size = 28,
}: {
  actor: Actor;
  size?: number;
}) {
  const isAgent = actor.kind === "agent";
  return (
    <span
      title={actor.name}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${
        isAgent
          ? "bg-[#eaf2ff] text-[#2359c4] ring-1 ring-[#d4e3ff]"
          : "bg-[#0b1733] text-white"
      }`}
    >
      {initials(actor.name)}
    </span>
  );
}

export function ActorLine({ actor }: { actor: Actor }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={actor.kind === "agent" ? "text-[#2359c4]" : "text-ink"}>
        {actor.name}
      </span>
      {actor.kind === "agent" && actor.level ? (
        <span className="text-[11px] text-muted">· {actor.level} agent</span>
      ) : null}
    </span>
  );
}

export function Progress({
  value,
  total,
  tone = "brand",
}: {
  value: number;
  total: number;
  tone?: "brand" | "green" | "dark";
}) {
  const width = total ? Math.min(100, Math.round((value / total) * 100)) : 0;
  const bar =
    tone === "green" ? "#2fbf71" : tone === "dark" ? "#0b1733" : "#3978f6";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#e8eefb]">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${width}%`, background: bar }}
      />
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
      {hint ? <div className="text-xs text-muted">{hint}</div> : null}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  blurb,
  dark,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <div
          className={`mb-3 text-[11px] font-bold uppercase tracking-[0.16em] ${
            dark ? "text-[#8fc9ff]" : "text-[#3978f6]"
          }`}
        >
          {eyebrow}
        </div>
      ) : null}
      <h2
        className={`font-display text-3xl font-bold leading-tight sm:text-4xl ${
          dark ? "text-white" : ""
        }`}
      >
        {title}
      </h2>
      {blurb ? (
        <p className={`mt-3 ${dark ? "text-[#a3b1ce]" : "text-muted"}`}>{blurb}</p>
      ) : null}
    </div>
  );
}
