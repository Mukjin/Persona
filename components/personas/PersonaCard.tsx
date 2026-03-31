"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Persona } from "@/lib/types";

function truncate(text: string, max = 90) {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

export function PersonaCard({ persona }: { persona: Persona }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const slugOrId = (persona as any).slug || persona.id;

  async function onCopyLink() {
    const url = `${window.location.origin}/chat/${slugOrId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      prompt("공유 링크를 복사해줘:", url);
    }
  }

  async function onDelete() {
    if (!confirm(`"${persona.name}" 페르소나를 삭제할까?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/personas/${persona.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "삭제에 실패했어.");
      router.refresh();
    } catch (e: any) {
      alert(e?.message ?? "삭제에 실패했어.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="surface-card hover-lift group relative overflow-hidden rounded-[28px] p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_55%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.12),transparent_45%)]" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl shadow-[0_12px_30px_rgba(0,0,0,0.24)]"
            style={{ backgroundColor: persona.avatar_color ?? undefined }}
            aria-label="persona avatar"
          >
            {persona.avatar_emoji ? (
              <span>{persona.avatar_emoji}</span>
            ) : persona.avatar_color ? (
              <span className="text-white">●</span>
            ) : (
              <span>🙂</span>
            )}
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight text-[rgb(var(--text))]">{persona.name}</div>
            <div className="mt-2 inline-flex rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[rgb(var(--muted))]">
              {persona.speech_style}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link href={`/personas/${persona.id}/edit`} className="btn-ghost px-3 py-2 text-xs">
            Edit
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="btn-ghost px-3 py-2 text-xs hover:text-red-400 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="korean-wrap mt-5 min-h-[72px] text-sm leading-7 text-[rgb(var(--muted))]">
        {truncate(persona.personality)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="soft-pill">{persona.is_public ? "Public" : "Private"}</span>
        <span className="soft-pill">Slug: {slugOrId}</span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Link href={`/chat/${slugOrId}`} className="btn-primary px-4 py-2.5">
          대화하기
        </Link>
        <button type="button" onClick={onCopyLink} className="btn-secondary px-4 py-2.5 text-xs">
          {copied ? "Copied" : "공유 링크"}
        </button>
      </div>
    </div>
  );
}
