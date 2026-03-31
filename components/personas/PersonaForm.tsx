"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Persona, SpeechStyle } from "@/lib/types";
import { SpeechStyleSelect } from "@/components/personas/SpeechStyleSelect";

type PersonaFormMode = "create" | "edit";

const TONE_LABEL: Record<SpeechStyle, string> = {
  formal: "FORMAL",
  casual: "CASUAL",
  tsundere: "TSUNDERE",
  cute: "CUTE",
  sarcastic: "SARCASTIC"
};

function normalizeColor(value: string) {
  const v = value.trim();
  if (!v) return "";
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) return v;
  return v;
}

function summarize(text: string, max = 120) {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

function FieldLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 border-l border-[rgba(99,102,241,0.58)] pl-3">
      <label className="text-xs font-medium uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
        {children}
      </label>
    </div>
  );
}

export function PersonaForm({
  mode,
  initial
}: {
  mode: PersonaFormMode;
  initial?: Partial<Persona>;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [personality, setPersonality] = useState(initial?.personality ?? "");
  const [speechStyle, setSpeechStyle] = useState<SpeechStyle>(
    (initial?.speech_style as SpeechStyle) ?? "formal"
  );
  const [avatarEmoji, setAvatarEmoji] = useState(initial?.avatar_emoji ?? "");
  const [avatarColor, setAvatarColor] = useState(initial?.avatar_color ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => {
    const color = normalizeColor(avatarColor);
    const emoji = avatarEmoji.trim();
    return {
      title: name.trim() || "Nova Mentor",
      summary: summarize(personality || "차분하게 맥락을 정리하고, 핵심을 단계적으로 설명하는 페르소나입니다."),
      emoji,
      color
    };
  }, [name, personality, avatarEmoji, avatarColor]);

  const hasPreviewContent =
    Boolean(name.trim()) ||
    Boolean(personality.trim()) ||
    Boolean(avatarEmoji.trim()) ||
    Boolean(normalizeColor(avatarColor));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      name: name.trim(),
      personality: personality.trim(),
      speech_style: speechStyle,
      avatar_emoji: avatarEmoji.trim() || null,
      avatar_color: normalizeColor(avatarColor) || null
    };

    if (payload.name.length < 2) return setError("이름은 2자 이상 입력해 주세요.");
    if (payload.personality.length < 10) return setError("성격 설명은 10자 이상 입력해 주세요.");
    if (!payload.avatar_emoji && !payload.avatar_color) {
      return setError("아바타 이모지 또는 색상을 하나 이상 입력해 주세요.");
    }

    setSubmitting(true);
    try {
      const res =
        mode === "create"
          ? await fetch("/api/personas", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload)
            })
          : await fetch(`/api/personas/${initial?.id}`, {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload)
            });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "요청에 실패했습니다.");

      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "알 수 없는 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
      <form onSubmit={onSubmit} className="surface-card-strong min-h-full rounded-[34px] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-7">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/5 pb-6">
            <div>
              <div className="text-[1.2rem] font-semibold tracking-[-0.03em] text-[rgb(var(--text))]">
                {mode === "create" ? "페르소나 설정" : "페르소나 수정"}
              </div>
              <div className="mt-3 max-w-xl text-sm leading-8 text-[rgb(var(--muted))]">
                캐릭터의 분위기와 말투를 구체적으로 정리할수록 응답의 결이 더 선명해집니다.
              </div>
            </div>
            <div className="soft-pill">{mode === "create" ? "Draft" : "Editing"}</div>
          </div>

          <div className="grid gap-3">
            <FieldLabel>페르소나 이름</FieldLabel>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 민지, 철수, Dr. Nova"
              className="input-control h-[52px] w-full rounded-[22px] px-4 text-sm"
            />
          </div>

          <div className="grid gap-3">
            <FieldLabel>성격 설명</FieldLabel>
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="예: 침착하고 논리적이며, 질문을 받으면 먼저 요약하고 단계적으로 설명한다."
              rows={6}
              className="textarea-control min-h-[170px] w-full rounded-[22px] px-4 py-3.5 text-sm leading-8"
            />
          </div>

          <SpeechStyleSelect value={speechStyle} onChange={setSpeechStyle} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-3">
              <FieldLabel>아바타 이모지</FieldLabel>
              <input
                value={avatarEmoji}
                onChange={(e) => setAvatarEmoji(e.target.value)}
                placeholder="예: 🤖"
                className="input-control h-[52px] w-full rounded-[22px] px-4 text-sm"
              />
              <p className="text-xs leading-6 text-[rgb(var(--muted))]">이모지나 짧은 텍스트도 사용할 수 있습니다.</p>
            </div>

            <div className="grid gap-3">
              <FieldLabel>아바타 색상</FieldLabel>
              <input
                value={avatarColor}
                onChange={(e) => setAvatarColor(e.target.value)}
                placeholder="예: #0C4A6E"
                className="input-control h-[52px] w-full rounded-[22px] px-4 text-sm"
              />
              <p className="text-xs leading-6 text-[rgb(var(--muted))]">HEX 형식의 색상을 입력할 수 있습니다.</p>
            </div>
          </div>

          {error ? (
            <div className="rounded-[22px] border border-red-500/15 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
              {mode === "create" ? "생성하기" : "저장하기"}
            </button>
            <button type="button" onClick={() => router.push("/dashboard")} className="btn-secondary">
              취소
            </button>
          </div>
        </div>
      </form>

      <aside
        className={[
          "surface-card-strong rounded-[34px] p-6 sm:p-7 lg:sticky lg:top-28",
          hasPreviewContent
            ? "border border-[rgba(99,102,241,0.18)] shadow-[0_0_0_1px_rgba(99,102,241,0.08),0_34px_90px_rgba(99,102,241,0.12),0_18px_44px_rgba(15,23,42,0.08)]"
            : ""
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[linear-gradient(135deg,rgba(99,102,241,0.95),rgba(167,139,250,0.92))] p-[2px] shadow-[0_0_22px_rgba(99,102,241,0.14)]">
              <div
                className="grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-white text-xl shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
                style={{ backgroundColor: preview.color || undefined }}
                aria-label="avatar preview"
              >
                {preview.emoji ? (
                  <span>{preview.emoji}</span>
                ) : preview.color ? (
                  <span className="text-white">●</span>
                ) : (
                  <span>🧑‍🏫</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-[1.08rem] font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">
                {preview.title}
              </div>
              <div className="mt-2 inline-flex rounded-full border border-white/80 bg-white/82 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[rgb(var(--muted))] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                {TONE_LABEL[speechStyle]}
              </div>
            </div>
          </div>
          <div className="soft-pill">Live Preview</div>
        </div>

        <div className="mt-6 grid gap-5">
          <div className="flex justify-end">
            <div className="max-w-[74%] rounded-[24px] rounded-tr-lg bg-[linear-gradient(135deg,rgba(99,102,241,0.96),rgba(139,92,246,0.92))] px-4 py-3 text-sm leading-7 text-white shadow-[0_18px_36px_rgba(99,102,241,0.22)]">
              {name.trim() ? `${preview.title}님, 어떤 방식으로 답변해주나요?` : "Spring Boot 개념을 쉽게 설명해줘."}
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[86%] rounded-[24px] rounded-tl-lg border border-white/82 bg-white/84 px-4 py-3.5 text-sm leading-8 text-[rgb(var(--text))] shadow-[0_18px_28px_rgba(15,23,42,0.06)]">
              {name.trim()
                ? `안녕하세요. 저는 ${preview.title}입니다. ${preview.summary}`
                : "Spring Boot는 자바 웹 애플리케이션을 더 빠르게 시작하게 도와주는 프레임워크입니다. 복잡한 설정을 줄여서, 개발자가 핵심 기능 구현에 더 집중할 수 있게 해줍니다."}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-white/78 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(246,248,255,0.72))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[rgb(var(--muted))]">Persona DNA</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="soft-pill">
              {speechStyle === "formal"
                ? "논리적"
                : speechStyle === "casual"
                  ? "친근함"
                  : speechStyle === "tsundere"
                    ? "까칠함"
                    : speechStyle === "cute"
                      ? "부드러움"
                      : "직설적"}
            </span>
            <span className="soft-pill">{personality.trim() ? "차별화" : "차분함"}</span>
            <span className="soft-pill">{TONE_LABEL[speechStyle]}</span>
            <span className="soft-pill">설명형</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
