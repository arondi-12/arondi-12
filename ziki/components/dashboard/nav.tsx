"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups: { label: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Overview", icon: "◧" },
      { href: "/dashboard/issues", label: "Issues", icon: "▤" },
      { href: "/dashboard/activity", label: "Event stream", icon: "≋" },
      { href: "/dashboard/points", label: "Points", icon: "◈" },
    ],
  },
  {
    label: "Human ↔ agent",
    items: [
      { href: "/dashboard/approvals", label: "Approvals", icon: "◎" },
      { href: "/dashboard/autonomy", label: "Autonomy ledger", icon: "⇄" },
      { href: "/dashboard/agents", label: "Agents", icon: "◇" },
    ],
  },
];

export function Sidebar({ pending }: { pending: number }) {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-[#e6ecf6] bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[248px] lg:flex-col">
      <div className="flex h-16 items-center border-b border-[#eef2f9] px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-[#0b1733] text-white">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 8.4 6.2 11.6 13 4.8"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-display text-[20px] font-extrabold tracking-tight">ziki</span>
        </Link>
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-xl border border-[#e0e6f1] bg-[#f8fafd] p-3">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">
            Project
          </div>
          <div className="mt-0.5 flex items-center justify-between">
            <span className="text-[13.5px] font-semibold">Ziki Issues</span>
            <span className="chip !px-1.5 !py-0.5 text-[10px]">public</span>
          </div>
        </div>
      </div>

      <nav className="mt-5 flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-2 pb-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#95a2bc]">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${
                      active
                        ? "bg-[#eaf2ff] font-semibold text-[#2359c4]"
                        : "text-[#4a5875] hover:bg-[#f5f7fc]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={active ? "text-[#3978f6]" : "text-[#9aa7bf]"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    {item.href === "/dashboard/approvals" && pending > 0 ? (
                      <span className="rounded-full bg-[#0b1733] px-1.5 py-0.5 text-[10.5px] font-bold text-white">
                        {pending}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#eef2f9] p-3">
        <Link
          href="/docs/consent-rail"
          className="block rounded-xl bg-[#0b1733] p-3 text-white transition-colors hover:bg-[#16244a]"
        >
          <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#8fc9ff]">
            New
          </div>
          <div className="mt-0.5 text-[12.5px] font-semibold leading-snug">
            How the Consent Rail works
          </div>
          <div className="mt-1 text-[11px] text-[#a3b1ce]">Read the design note →</div>
        </Link>
      </div>
    </aside>
  );
}

export function MobileNav({ pending }: { pending: number }) {
  const pathname = usePathname();
  const items = groups.flatMap((g) => g.items);
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-[#e6ecf6] bg-white px-3 py-2 lg:hidden">
      {items.map((item) => {
        const active =
          item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] ${
              active ? "bg-[#eaf2ff] font-semibold text-[#2359c4]" : "text-[#4a5875]"
            }`}
          >
            {item.label}
            {item.href === "/dashboard/approvals" && pending > 0 ? (
              <span className="rounded-full bg-[#0b1733] px-1.5 text-[10px] font-bold text-white">
                {pending}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
