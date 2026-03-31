import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PersonaForm } from "@/components/personas/PersonaForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserProfile, getPersonaById } from "@/lib/db/personas";

export default async function EditPersonaPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Container>
        <div className="surface-card mt-4 rounded-[28px] p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-[rgb(var(--text))]">Edit Persona</h2>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">로그인이 필요합니다.</p>
        </div>
      </Container>
    );
  }

  await ensureUserProfile(supabase, user.id);
  const persona = await getPersonaById(supabase, params.id);
  if (!persona) notFound();

  return (
    <Container>
      <div className="hero-glow surface-card-strong overflow-hidden rounded-[32px] px-7 py-8 sm:px-10 sm:py-10">
        <div>
          <div className="soft-pill">Edit Persona</div>
          <h2 className="korean-wrap mt-5 text-3xl font-semibold tracking-tight sm:text-4xl text-[rgb(var(--text))]">
            {persona.name}의 디테일을 다듬고 있습니다.
          </h2>
          <p className="korean-wrap mt-4 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))]">
            성격 묘사와 말투를 조금만 조정해도 응답 분위기가 크게 달라집니다. 지금 캐릭터의
            개성을 더 선명하게 다듬을 수 있습니다.
          </p>
        </div>
      </div>
      <PersonaForm mode="edit" initial={persona} />
    </Container>
  );
}
