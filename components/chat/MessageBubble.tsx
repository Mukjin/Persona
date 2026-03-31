function getText(value: any) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value.parts)) {
    return value.parts
      .filter((part: any) => part?.type === "text")
      .map((part: any) => part.text ?? "")
      .join("");
  }
  return value.content ?? "";
}

export function MessageBubble({
  message,
  personaName,
  avatar
}: {
  message: any;
  personaName?: string;
  avatar?: string | null;
}) {
  const role = message?.role === "user" ? "user" : "assistant";
  const text = getText(message);

  if (!text) return null;

  return (
    <div className={["flex w-full", role === "user" ? "justify-end" : "justify-start"].join(" ")}>
      <div className={["max-w-[82%]", role === "user" ? "items-end" : "items-start"].join(" ")}>
        {role === "assistant" ? (
          <div className="mb-2 flex items-center gap-2 px-1 text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/70 bg-white/84 shadow-[0_10px_20px_rgba(15,23,42,0.05)]">
              {avatar || "🙂"}
            </span>
            <span>{personaName || "Persona"}</span>
          </div>
        ) : null}
        <div
          className={[
            "rounded-[24px] px-4 py-3 text-sm leading-8 shadow-[0_18px_28px_rgba(15,23,42,0.06)]",
            role === "user"
              ? "rounded-tr-lg bg-[linear-gradient(135deg,rgba(99,102,241,0.96),rgba(139,92,246,0.92))] text-white"
              : "rounded-tl-lg border border-white/80 bg-white/84 text-[rgb(var(--text))]"
          ].join(" ")}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
