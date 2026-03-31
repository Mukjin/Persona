import Link from "next/link";

export function PublicBanner({ creatorName }: { creatorName?: string | null }) {
  return (
    <div className="surface-card mt-6 rounded-[26px] px-5 py-4 text-sm leading-7 text-[rgb(var(--muted))]">
      <span className="font-semibold text-[rgb(var(--text))]">{creatorName || "사용자"}</span>이 만든 페르소나 — {" "}
      <Link href="/personas/new" className="font-semibold text-[rgb(var(--brand))] hover:opacity-80">
        나만의 페르소나 만들기
      </Link>
    </div>
  );
}
