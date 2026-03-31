"use client";

const DEFAULT_PROMPTS = [
  "너의 성격을 한 문장으로 소개해줘",
  "오늘 처음 만난 사람에게 어떻게 인사할래?",
  "Spring Boot 개념을 쉽게 설명해줘",
  "내 상황을 듣고 조언해줘",
];

export function SuggestedPrompts({
  personaName,
  onSelect,
}: {
  personaName?: string;
  onSelect: (prompt: string) => void;
}) {
  const prompts = personaName
    ? [
        `${personaName}답게 자기소개해줘`,
        `${personaName}의 관점으로 공부 루틴 추천해줘`,
        "Spring Boot 개념을 쉽게 설명해줘",
        "요즘 의욕이 없을 때 어떻게 시작하면 좋을까?",
      ]
    : DEFAULT_PROMPTS;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs font-medium text-[rgb(var(--muted))] backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/10 hover:text-[rgb(var(--text))]"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
