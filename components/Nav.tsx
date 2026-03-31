import Link from "next/link";
import { Container } from "@/components/Container";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/actions/auth";

export async function Nav() {
  const supabase = createSupabaseServerClient();
  let user = null;
  try {
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("auth timeout")), 1200))
    ]);
    const {
      data: { user: nextUser }
    } = result;
    user = nextUser;
  } catch {
    user = null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/35 bg-white/55 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/46">
      <Container>
        <div className="flex min-h-[86px] flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-[18px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(240,244,255,0.86))] text-sm font-semibold text-[rgb(var(--text))] shadow-[0_16px_40px_rgba(76,81,255,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_22px_50px_rgba(76,81,255,0.2),inset_0_1px_0_rgba(255,255,255,0.98)]">
              <span className="bg-[linear-gradient(135deg,rgb(var(--brand)),rgb(var(--brand-2)))] bg-clip-text text-transparent">
                P.
              </span>
            </span>
            <span className="flex flex-col">
              <span className="text-[1.02rem] font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">Persona</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                AI character studio
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 text-sm">
            <Link href="/dashboard" className="btn-ghost">
              Dashboard
            </Link>
            <Link href="/personas/new" className="btn-ghost">
              Create
            </Link>
            {user ? (
              <form action={signOutAction} className="flex items-center gap-2">
                <span className="hidden rounded-full border border-white/65 bg-white/76 px-3.5 py-2 text-xs font-medium text-[rgb(var(--text))] shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] sm:inline">
                  {user.email}
                </span>
                <button type="submit" className="btn-secondary px-4 py-2 text-xs">
                  Sign out
                </button>
              </form>
            ) : (
              <>
                <Link href="/login" className="btn-secondary px-4 py-2 text-xs">
                  Sign in
                </Link>
                <Link href="/login?mode=signup" className="btn-primary px-4 py-2 text-xs">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
