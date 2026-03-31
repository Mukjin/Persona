"use client";

import type { SpeechStyle } from "@/lib/types";

const OPTIONS: Array<{ value: SpeechStyle; label: string; helper: string }> = [
  { value: "formal", label: "격식체", helper: "정중하고 차분한 말투" },
  { value: "casual", label: "반말", helper: "친근하고 편한 말투" },
  { value: "tsundere", label: "츤데레", helper: "까칠하지만 가끔 다정" },
  { value: "cute", label: "귀여운 말투", helper: "애교 섞인 톤" },
  { value: "sarcastic", label: "시니컬", helper: "건조하고 직설적인 말투" }
];

export function SpeechStyleSelect({
  value,
  onChange
}: {
  value: SpeechStyle;
  onChange: (next: SpeechStyle) => void;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3 border-l border-[rgba(99,102,241,0.58)] pl-3">
        <label className="text-xs font-medium uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
          말투
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "rounded-full border px-4 py-3 text-left transition-all duration-200",
                active
                  ? "border-[rgba(99,102,241,0.18)] bg-[linear-gradient(135deg,rgba(99,102,241,0.96),rgba(139,92,246,0.92))] text-white shadow-[0_16px_32px_rgba(99,102,241,0.22)]"
                  : "border-white/75 bg-white/68 text-[rgb(var(--muted))] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_10px_24px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-[rgba(99,102,241,0.24)] hover:bg-white/84 hover:text-[rgb(var(--text))] hover:shadow-[0_18px_34px_rgba(15,23,42,0.08)]"
              ].join(" ")}
            >
              <div className="text-sm font-semibold tracking-[-0.02em]">{opt.label}</div>
              <div className={["mt-1 text-[11px] leading-5", active ? "text-white/82" : "text-[rgb(var(--muted))]"].join(" ")}>
                {opt.helper}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
