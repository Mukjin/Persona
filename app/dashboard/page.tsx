import { Container } from "@/components/Container";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserProfile, listPersonas } from "@/lib/db/personas";
import Link from "next/link";
import { DashboardGrid } from "@/components/personas/DashboardGrid";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const personas = user
    ? await (async () => {
        await ensureUserProfile(supabase, user.id);
        return listPersonas(supabase);
      })()
    : [];

  return (
    <Container>
      <div className="hero-glow surface-card-strong overflow-hidden rounded-[32px] px-7 py-9 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="soft-pill">Persona Dashboard</div>
            <h2 className="korean-wrap mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              생성한 AI 캐릭터를 한 곳에서 관리합니다.
            </h2>
            <p className="korean-wrap mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
              새로운 페르소나를 만들고, 공유 링크를 복사하고, 바로 대화를 시작할 수 있습니다.
            </p>
          </div>
          <Link href="/personas/new" className="btn-primary">
            New Persona
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="metric-card hover-lift">
            <div className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
              Total Personas
            </div>
            <div className="mt-3 text-3xl font-semibold text-[rgb(var(--text))]">{personas.length}</div>
          </div>
          <div className="metric-card hover-lift">
            <div className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
              Public Links
            </div>
            <div className="mt-3 text-3xl font-semibold text-[rgb(var(--text))]">
              {personas.filter((persona) => persona.is_public).length}
            </div>
          </div>
          <div className="metric-card hover-lift">
            <div className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
              Styles
            </div>
            <div className="mt-3 text-3xl font-semibold text-[rgb(var(--text))]">
              {new Set(personas.map((persona) => persona.speech_style)).size}
            </div>
          </div>
        </div>
      </div>

      {!user ? (
        <div className="surface-card mt-6 rounded-[28px] p-6">
          <p className="text-sm leading-7 text-[rgb(var(--muted))]">
            아직 로그인하지 않았습니다. Supabase Auth 연결 후 로그인하면 페르소나를 저장하고
            확인할 수 있습니다.
          </p>
        </div>
      ) : personas.length === 0 ? (
        <div className="surface-card mt-6 rounded-[28px] p-8 sm:p-10">
          <div className="soft-pill">Empty Canvas</div>
          <h3 className="korean-wrap mt-5 text-2xl font-semibold tracking-tight">
            첫 번째 페르소나를 만들 차례입니다.
          </h3>
          <p className="korean-wrap mt-4 max-w-xl text-sm leading-7 text-[rgb(var(--muted))]">
            차분한 선생님, 직설적인 코치, 귀여운 도우미처럼 원하는 성격과 말투를 가진 AI를
            하나 만들어보시기 바랍니다.
          </p>
          <div className="mt-6">
            <Link href="/personas/new" className="btn-primary">
              New Persona
            </Link>
          </div>
        </div>
      ) : (
        <DashboardGrid personas={personas} />
      )}
    </Container>
  );
}
