"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm({ className = "" }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) throw new Error("이메일을 입력해 주세요.");
      if (password.length < 8) throw new Error("비밀번호는 8자 이상 입력해 주세요.");

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) throw error;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "로그인에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={[
        "surface-card-strong relative flex h-full flex-col overflow-hidden rounded-[36px] p-6 sm:p-8 lg:min-h-[39rem]",
        className
      ]
        .join(" ")
        .trim()}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
            Secure Access
          </div>
          <div className="mt-3 text-[1.9rem] font-semibold tracking-tight text-[rgb(var(--text))] sm:text-[2.2rem]">
            {mode === "signin" ? "로그인" : "회원가입"}
          </div>
          <div className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
            Supabase Auth 이메일/비밀번호 방식으로 안전하게 시작합니다.
          </div>
        </div>
        <div className="flex rounded-full border border-white/8 bg-white/5 p-1 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={[
              "rounded-full px-4 py-2 text-xs font-medium",
              mode === "signin"
                ? "bg-[linear-gradient(135deg,rgba(99,102,241,0.96),rgba(167,139,250,0.92))] text-white shadow-[0_10px_24px_rgba(99,102,241,0.28)]"
                : "text-[rgb(var(--muted))] hover:bg-white/8 hover:text-[rgb(var(--text))]"
            ].join(" ")}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={[
              "rounded-full px-4 py-2 text-xs font-medium",
              mode === "signup"
                ? "bg-[linear-gradient(135deg,rgba(99,102,241,0.96),rgba(167,139,250,0.92))] text-white shadow-[0_10px_24px_rgba(99,102,241,0.28)]"
                : "text-[rgb(var(--muted))] hover:bg-white/8 hover:text-[rgb(var(--text))]"
            ].join(" ")}
          >
            회원가입
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 flex flex-1 flex-col gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-[rgb(var(--text))]">이메일</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input-control h-14 w-full rounded-[24px] px-4 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-[rgb(var(--text))]">비밀번호</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder="8자 이상"
            className="input-control h-14 w-full rounded-[24px] px-4 text-sm"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <button type="submit" disabled={busy} className="btn-primary mt-2 disabled:opacity-60">
          {mode === "signin" ? "로그인" : "회원가입"}
        </button>

        <div className="mt-auto surface-card rounded-[26px] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium tracking-tight text-[rgb(var(--text))]">
              시작하면 바로 할 수 있는 일
            </div>
            <div className="text-xs text-[rgb(var(--muted))]">대시보드, 공유 링크, 저장형 대화</div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="surface-card rounded-[22px] p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">로그인</div>
              <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                이미 만든 페르소나를 관리하고 저장형 대화를 이어서 확인할 수 있습니다.
              </p>
            </div>
            <div className="surface-card rounded-[22px] p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">회원가입</div>
              <p className="mt-2 text-sm leading-7 text-[rgb(var(--muted))]">
                새 계정을 만들면 대시보드와 공개 링크 기능을 바로 사용할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
