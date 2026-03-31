import Link from "next/link";
import { Container } from "@/components/Container";

const FEATURES = [
  {
    icon: "✨",
    title: "캐릭터 설정",
    description:
      "이름, 성격, 말투, 아바타를 입력해 AI의 말하는 분위기와 기본 성향을 선명하게 정의합니다."
  },
  {
    icon: "💬",
    title: "즉시 대화",
    description:
      "설정한 정보가 시스템 프롬프트에 반영되어 같은 질문에도 페르소나마다 다른 반응을 만듭니다."
  },
  {
    icon: "🔗",
    title: "링크 공유",
    description:
      "공개 링크를 생성하면 다른 사람도 로그인 없이 바로 페르소나와 대화해볼 수 있습니다."
  }
];

const EXAMPLES = [
  {
    emoji: "🧑‍🏫",
    name: "차분한 선생님",
    tone: "formal",
    description: "개념을 단계적으로 설명하고, 이해 여부를 확인해가며 답하는 스타일입니다."
  },
  {
    emoji: "😼",
    name: "시니컬 코치",
    tone: "sarcastic",
    description: "건조하지만 핵심을 찌르는 피드백을 주고, 실행 중심으로 대화를 이끕니다."
  },
  {
    emoji: "🌙",
    name: "감성 기록가",
    tone: "cute",
    description: "사용자의 감정을 세심하게 읽고, 다정하고 부드러운 어조로 반응합니다."
  },
  {
    emoji: "🧠",
    name: "논리 설계자",
    tone: "formal",
    description: "정보를 구조화해 설명하고, 핵심 개념을 빠르게 정리하는 데 강합니다."
  }
];

export default function HomePage() {
  return (
    <div className="landing-shell">
      <div className="landing-backdrop" />
      <Container>
        <section className="hero-glow surface-card-strong mt-6 overflow-hidden rounded-[40px] px-7 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
            <div className="max-w-[46rem]">
              <div className="soft-pill">AI Character Studio</div>
              <h1 className="korean-wrap mt-7 max-w-[11ch] text-[2.8rem] font-bold leading-[0.96] tracking-[-0.035em] sm:text-6xl xl:text-[5.2rem]">
                말투와 성격을 가진 AI를
                <span className="landing-gradient-text mt-1 block">직접 만들어보세요.</span>
              </h1>
              <p className="korean-wrap mt-7 max-w-2xl text-[1.02rem] leading-[1.85] text-[rgb(var(--muted))] sm:text-lg">
                Persona는 이름, 성격, 말투, 아바타를 가진 AI 캐릭터를 설계하고, 바로 대화와 공유까지
                이어갈 수 있게 돕는 페르소나 챗봇 플랫폼입니다.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/personas/new" className="btn-primary px-6 py-3.5 text-sm sm:text-base">
                  페르소나 만들기
                </Link>
                <Link href="/dashboard" className="btn-secondary px-6 py-3.5 text-sm sm:text-base">
                  대시보드 보기
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="surface-card rounded-[24px] p-4">
                  <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                    Persona DNA
                  </div>
                  <div className="mt-3 text-sm font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">
                    이름, 성격, 말투, 아바타를 빠르게 조합합니다.
                  </div>
                </div>
                <div className="surface-card rounded-[24px] p-4">
                  <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                    Live
                  </div>
                  <div className="mt-3 text-sm font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">
                    설정 직후 대화 흐름에 바로 반영됩니다.
                  </div>
                </div>
                <div className="surface-card rounded-[24px] p-4">
                  <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                    Share
                  </div>
                  <div className="mt-3 text-sm font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">
                    공개 링크로 게스트 체험까지 자연스럽게 연결됩니다.
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:pl-4">
              <div className="landing-hero-visual p-6 sm:p-7 md:p-8">
                <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-14 w-14 place-items-center rounded-[20px] border border-white/75 bg-white text-[1.65rem] shadow-[0_16px_34px_rgba(99,102,241,0.12)]">
                      🧑‍🏫
                    </div>
                    <div>
                      <div className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">
                        Nova Mentor
                      </div>
                      <div className="mt-2 inline-flex rounded-full border border-white/80 bg-white/82 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                        formal
                      </div>
                    </div>
                  </div>
                  <div className="soft-pill">Live Preview</div>
                </div>

                <div className="mt-7 grid gap-5">
                  <div className="flex justify-end">
                    <div className="max-w-[72%] border-2 border-[#6366f1] bg-white px-[18px] py-[12px] text-[14px] font-semibold leading-[1.5] text-[#4338ca] shadow-[0_2px_12px_rgba(99,102,241,0.15)] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[5px]">
                      Spring Boot 개념을 쉽게 설명해줘.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-[24px] rounded-tl-lg border border-white/80 bg-white/82 px-5 py-4 text-sm leading-8 text-[rgb(var(--text))] shadow-[0_18px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                      Spring Boot는 자바 웹 애플리케이션을 더 빠르게 시작하게 도와주는 프레임워크입니다.
                      복잡한 설정을 줄여서, 개발자가 핵심 기능 구현에 더 집중할 수 있게 해줍니다.
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-[28px] border border-white/78 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(246,248,255,0.72))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
                  <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                    Persona DNA
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="soft-pill">논리적</span>
                    <span className="soft-pill">차분함</span>
                    <span className="soft-pill">격식체</span>
                    <span className="soft-pill">설명형</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 surface-card rounded-[36px] p-7 sm:p-9 lg:p-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="soft-pill">How It Works</div>
              <h2 className="korean-wrap mt-5 max-w-[16ch] text-[2rem] font-semibold tracking-[-0.03em] sm:text-[2.6rem]">
                페르소나를 만드는 흐름은 직관적이고, 결과는 꽤 선명합니다.
              </h2>
            </div>
            <p className="korean-wrap max-w-2xl text-sm leading-8 text-[rgb(var(--muted))] sm:text-[0.97rem]">
              설정, 대화, 공유의 세 단계만으로도 하나의 AI 캐릭터를 실제 서비스처럼 바로 보여줄 수
              있습니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-6 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
            {FEATURES.map((feature, index) => (
              <article
                key={feature.title}
                className={[
                  "landing-feature-card p-7 sm:p-8",
                  index === 0 ? "lg:col-span-3 lg:row-span-2" : "lg:col-span-3"
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-[16px] border border-white/80 bg-white/85 text-2xl shadow-[0_12px_26px_rgba(99,102,241,0.12)]">
                    {feature.icon}
                  </div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
                    0{index + 1}
                  </div>
                </div>
                <div className="mt-6 text-[1.28rem] font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">
                  {feature.title}
                </div>
                <p className="korean-wrap mt-3 max-w-[32rem] text-sm leading-8 text-[rgb(var(--muted))] sm:text-[0.97rem]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 xl:grid-cols-[1.24fr_0.92fr]">
          <div className="surface-card rounded-[36px] p-7 sm:p-9 lg:p-12">
            <div className="soft-pill">페르소나 예시</div>
            <h2 className="korean-wrap mt-5 text-[2rem] font-semibold tracking-[-0.03em] sm:text-[2.6rem]">
              톤이 다른 캐릭터를 나란히 만들고 비교할 수 있습니다.
            </h2>
            <p className="korean-wrap mt-4 max-w-2xl text-sm leading-8 text-[rgb(var(--muted))] sm:text-[0.97rem]">
              같은 질문도 어떤 성격과 말투를 부여하느냐에 따라 완전히 다른 분위기의 답변으로 바뀝니다.
            </p>

            <div className="landing-example-grid mt-8">
              {EXAMPLES.map((persona) => (
                <article key={persona.name} className="landing-example-card p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-[2.6rem] leading-none">{persona.emoji}</div>
                    <div className="inline-flex rounded-full border border-white/80 bg-white/82 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                      {persona.tone}
                    </div>
                  </div>
                  <div className="mt-6 text-[1.18rem] font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">
                    {persona.name}
                  </div>
                  <p className="korean-wrap mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
                    {persona.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-card-strong rounded-[36px] p-7 sm:p-9 lg:p-12">
            <div className="soft-pill">Built For Sharing</div>
            <h2 className="korean-wrap mt-5 max-w-[11ch] text-[2rem] font-semibold tracking-[-0.03em] sm:text-[2.6rem]">
              저장형 대화와 공개 체험을 동시에 운영할 수 있습니다.
            </h2>
            <p className="korean-wrap mt-4 text-sm leading-8 text-[rgb(var(--muted))] sm:text-[0.97rem]">
              로그인 사용자는 자신의 작업 공간에서 저장형 채팅을 쓰고, 외부 사용자는 공개 링크로 부담
              없이 체험할 수 있습니다. 하나는 관리용, 하나는 전시용으로 나뉘는 구조입니다.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="surface-card rounded-[26px] p-6">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  Saved Chat
                </div>
                <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
                  대화 이력이 쌓이면서 페르소나별 작업 맥락을 유지할 수 있습니다.
                </p>
              </div>
              <div className="surface-card rounded-[26px] p-6">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  Public Link
                </div>
                <p className="mt-4 text-sm leading-8 text-[rgb(var(--muted))]">
                  링크 하나만으로 게스트에게도 즉시 체험을 열어줄 수 있습니다.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login?mode=signup" className="btn-primary px-6 py-3.5">
                회원가입하고 시작하기
              </Link>
              <Link href="/dashboard" className="btn-secondary px-6 py-3.5">
                대시보드 둘러보기
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
