import { Container } from "@/components/Container";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <Container>
      <div className="flex min-h-[calc(100vh-8rem)] items-center py-6 sm:py-8 lg:py-10">
        <div className="grid w-full gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
          <section className="hero-glow surface-card-strong overflow-hidden rounded-[36px] px-6 py-8 sm:px-9 sm:py-10 lg:min-h-[39rem]">
            <div className="flex h-full flex-col">
              <div>
                <div className="soft-pill">Account Access</div>
                <h2 className="display-serif korean-wrap mt-5 max-w-[13ch] text-[2.2rem] font-semibold tracking-tight sm:text-[2.9rem] sm:leading-[1.1]">
                  나만의 페르소나
                </h2>
                <p className="korean-wrap mt-4 max-w-xl text-[15px] leading-8 text-[rgb(var(--muted))]">
                  계정을 만들면 대시보드에서 페르소나를 저장하고, 공개 링크를 공유하고, 대화
                  이력까지 이어서 관리할 수 있습니다.
                </p>
              </div>

              <div className="mt-10 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="surface-card hover-lift rounded-[28px] p-6">
                  <div className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                    Workspace
                  </div>
                  <p className="mt-3 text-base leading-8 text-[rgb(var(--text))]">
                    페르소나를 만들고, 수정하고, 대화를 이어가고, 공개 링크까지 한 곳에서 정리할 수
                    있습니다.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="surface-card hover-lift rounded-[24px] p-5">
                    <div className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                      Save
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                      로그인 사용자의 대화는 저장형 채팅으로 관리됩니다.
                    </p>
                  </div>
                  <div className="surface-card hover-lift rounded-[24px] p-5">
                    <div className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                      Share
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                      공개 링크를 생성해 게스트 체험도 제공할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="surface-card rounded-[22px] px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Persona
                    </div>
                    <div className="mt-2 text-sm font-medium text-[rgb(var(--text))]">
                      캐릭터 설정 저장
                    </div>
                  </div>
                  <div className="surface-card rounded-[22px] px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Chat
                    </div>
                    <div className="mt-2 text-sm font-medium text-[rgb(var(--text))]">
                      대화 이력 이어보기
                    </div>
                  </div>
                  <div className="surface-card rounded-[22px] px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      Link
                    </div>
                    <div className="mt-2 text-sm font-medium text-[rgb(var(--text))]">
                      공개 URL 즉시 공유
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="h-full lg:min-h-[39rem]">
            <AuthForm className="h-full" />
          </section>
        </div>
      </div>
    </Container>
  );
}
