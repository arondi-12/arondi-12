import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MobileNav, Sidebar } from "@/components/dashboard/nav";
import { signOut } from "@/app/actions";
import { getDb } from "@/lib/db";
import { pendingAsks } from "@/lib/store";

export const metadata = { title: "Dashboard · Ziki" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  if (store.get("ziki_session")?.value !== "ada") {
    redirect("/login?next=/dashboard");
  }

  const db = getDb();
  const pending = pendingAsks(db.user.id).length;

  return (
    <div className="min-h-screen bg-[#f7f9fd]">
      <Sidebar pending={pending} />
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-[#e6ecf6] bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link href="/" className="font-display text-[18px] font-extrabold lg:hidden">
                ziki
              </Link>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-[13px] font-semibold">Ziki Issues</span>
                <span className="text-[#c3cddf]">/</span>
                <span className="text-[13px] text-muted">Public tracker</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/approvals" className="btn btn-soft btn-sm">
                <span className="pulse-dot" />
                {pending} waiting on you
              </Link>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0b1733] text-[11px] font-bold text-white">
                  AL
                </span>
                <div className="leading-tight">
                  <div className="text-[12.5px] font-semibold">{db.user.name}</div>
                  <div className="text-[11px] text-muted">owner</div>
                </div>
              </div>
              <form action={signOut}>
                <button className="text-[12px] text-muted hover:text-ink" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          </div>
          <MobileNav pending={pending} />
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
