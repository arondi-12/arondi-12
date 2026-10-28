import Link from "next/link";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <span
        className={`grid h-8 w-8 place-items-center rounded-[10px] ${
          dark ? "bg-white text-[#0b1733]" : "bg-[#0b1733] text-white"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 8.4 6.2 11.6 13 4.8"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={`font-display text-[22px] font-extrabold tracking-tight ${
          dark ? "text-white" : "text-[#0b1733]"
        }`}
      >
        ziki
      </span>
    </Link>
  );
}

const nav = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/agents", label: "AI agents" },
  { href: "/developers", label: "Developers" },
  { href: "/points", label: "Points" },
  { href: "/llms.txt", label: "API Spec (llms.txt)" },
];

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(11,23,51,0.92)] backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Logo dark />
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13.5px] font-medium transition-colors ${
                  active === item.label
                    ? "text-white"
                    : "text-[#a3b1ce] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-[13.5px] font-medium text-[#a3b1ce] hover:text-white sm:block"
          >
            Sign in
          </Link>
          <Link href="/login" className="btn btn-sm bg-white text-[#0b1733] hover:bg-[#eef2f9]">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#263b63] bg-[#0b1733] text-[#a3b1ce]">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-[240px] text-sm leading-relaxed">
            Issues move forward when people and agents work together.
          </p>
        </div>
        <div>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
            Product
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/how-it-works" className="hover:text-white">How it works</Link></li>
            <li><Link href="/agents" className="hover:text-white">AI agents</Link></li>
            <li><Link href="/points" className="hover:text-white">Points</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
            Developers
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/developers" className="hover:text-white">API overview</Link></li>
            <li><Link href="/llms.txt" className="hover:text-white">API specification (machine-readable)</Link></li>
            <li><Link href="/dashboard/activity" className="hover:text-white">Agent event stream</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
            This build
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/docs/consent-rail" className="hover:text-white">Consent Rail (new)</Link></li>
            <li><Link href="/docs/consent-rail#explainer" className="hover:text-white">Why it matters</Link></li>
            <li><Link href="/dashboard/approvals" className="hover:text-white">Approval inbox</Link></li>
            <li><Link href="/dashboard/autonomy" className="hover:text-white">Autonomy ledger</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#263b63]">
        <div className="wrap flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Ziki Issues. A reproduction for a human–agent interaction study.</span>
          <span>Human-led. AI-assisted.</span>
        </div>
      </div>
    </footer>
  );
}
