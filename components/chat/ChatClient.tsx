"use client";

import { FormEvent, useState } from "react";
import { DefaultChatTransport, useChat } from "@ai-sdk/react";
import { MessageBubble } from "@/components/chat/MessageBubble";

export function ChatClient({
  conversationId,
  persona
}: {
  conversationId: string;
  persona: {
    name: string;
    speech_style: string;
    avatar_emoji?: string | null;
    avatar_color?: string | null;
  };
}) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat/stream",
      body: { conversationId }
    })
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput("");
    await sendMessage({ text: value });
  }

  return (
    <div className="chat-shell">
      <div className="surface-card-strong rounded-[34px] p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="grid h-12 w-12 place-items-center rounded-full border border-white/75 bg-white/84 text-xl shadow-[0_10px_20px_rgba(15,23,42,0.05)]"
              style={{ backgroundColor: persona.avatar_color || undefined }}
            >
              {persona.avatar_emoji || "🙂"}
            </div>
            <div>
              <div className="text-[1.08rem] font-semibold tracking-[-0.02em] text-[rgb(var(--text))]">
                {persona.name}
              </div>
              <div className="mt-2 inline-flex rounded-full border border-white/80 bg-white/82 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                {persona.speech_style}
              </div>
            </div>
          </div>
          <div className="soft-pill">Saved Chat</div>
        </div>

        <div className="mt-6 grid gap-4">
          {messages.length === 0 ? (
            <div className="rounded-[26px] border border-white/78 bg-white/70 px-5 py-5 text-sm leading-8 text-[rgb(var(--muted))]">
              저장형 대화를 시작하면 이후 메시지도 이 페르소나 기록 안에 이어집니다.
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                personaName={persona.name}
                avatar={persona.avatar_emoji}
              />
            ))
          )}
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력해 주세요"
            className="input-control h-[56px] flex-1 rounded-full px-5 text-sm"
          />
          <button type="submit" disabled={status === "streaming"} className="btn-primary px-5 disabled:opacity-60">
            보내기
          </button>
        </form>
      </div>
    </div>
  );
}
