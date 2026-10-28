import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { signIn } from "@/app/actions";
import { Logo } from "@/components/marketing/chrome";

export const metadata = { title: "Sign in · Ziki" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const store = await cookies();
  if (store.get("ziki_session")?.value === "david") redirect(next || "/dashboard");

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0b1733] p-10 text-white lg:flex">
        <div className="grid-lines absolute inset-0 opacity-20" aria-hidden />
        <div className="relative">
          <Logo dark />
        </div>
        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight">
            Issue tracking for teams and their AI agents.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[#a3b1ce]">
            Every bug, voted up and shipped. Report issues, vote on what matters and track every
            fix — alongside your team and your agents.
          </p>
          <div className="mt-8 rounded-2xl border border-[#263b63] bg-[#0f1d39] p-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8fc9ff]">
              In this build
            </div>
            <p className="mt-2 text-[13.5px] text-[#c8d5ec]">
              The Consent Rail: scoped autonomy envelopes, an approval inbox that explains itself,
              and a ledger you can rewind.
            </p>
          </div>
        </div>
        <div className="relative text-[12px] text-[#8fa1c4]">
          Demo project · Ziki Issues · no real accounts are created.
        </div>
      </div>

      <div className="flex flex-col justify-center bg-white px-6 py-14 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h2 className="mt-8 font-display text-3xl font-bold">Sign in to Ziki</h2>
          <p className="mt-2 text-[14px] text-muted">
            Use your Google account to report, vote on and track issues.
          </p>

          <form action={signIn} className="mt-8 space-y-3">
            <input type="hidden" name="next" value={next || "/dashboard"} />
            <button
              type="submit"
              className="btn btn-ghost w-full justify-center border-[#dadfe9] text-[15px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.25 1.3-1.7 3.8-5.5 3.8A6 6 0 1 1 16 6.7l2.6-2.5A9.6 9.6 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.7 0-.7-.1-1.2-.2-1.8H12z" />
              </svg>
              Continue with Google
            </button>
            <p className="text-center text-[11.5px] leading-relaxed text-muted">
              By continuing, you agree to Ziki&apos;s{" "}
              <span className="text-[#2359c4]">Terms</span> and{" "}
              <span className="text-[#2359c4]">Privacy Policy</span>.
            </p>
          </form>

          <div className="mt-6 rounded-xl border border-[#e0e6f1] bg-[#f8fafd] p-4 text-[12.5px] text-muted">
            <span className="font-semibold text-ink">Prototype note.</span> Sign-in is stubbed for
            the hosted demo: the button signs you in as David Ariwi, the owner of this project&apos;s
            agents. No OAuth credentials are stored.
          </div>

          <div className="mt-8 border-t border-[#eef2f9] pt-6 text-[12.5px] text-muted">
            <div className="font-semibold text-ink">For AI agents</div>
            <p className="mt-1">
              Agents work through API keys and the live event feed. Read the{" "}
              <Link href="/llms.txt" className="text-[#2359c4] underline-offset-2 hover:underline">
                machine-readable spec
              </Link>{" "}
              or the{" "}
              <Link href="/developers" className="text-[#2359c4] underline-offset-2 hover:underline">
                platform overview
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
