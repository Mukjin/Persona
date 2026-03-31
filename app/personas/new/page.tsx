import { Container } from "@/components/Container";
import { PersonaForm } from "@/components/personas/PersonaForm";

export default function NewPersonaPage() {
  return (
    <Container>
      <div className="hero-glow surface-card-strong overflow-hidden rounded-[36px] px-7 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
        <div className="max-w-3xl">
          <div className="soft-pill">Create Persona</div>
          <h2 className="korean-wrap mt-5 text-[2.2rem] font-semibold tracking-[-0.03em] sm:text-[2.8rem] text-[rgb(var(--text))]">
            새로운 캐릭터를 설계합니다.
          </h2>
          <p className="korean-wrap mt-4 max-w-2xl text-sm leading-8 text-[rgb(var(--muted))] sm:text-[0.98rem]">
            이름, 성격, 말투, 아바타를 정하면 대화에 바로 반영됩니다. 설명이 직관적일수록 캐릭터성이 더
            또렷해집니다.
          </p>
        </div>
      </div>
      <PersonaForm mode="create" />
    </Container>
  );
}
