import { NextResponse } from "next/server";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserProfile, getPersonaById } from "@/lib/db/personas";
import { addMessage, getConversation, listMessages } from "@/lib/db/chat";
import { getTextFromUIMessage } from "@/lib/ai-ui";

export const runtime = "nodejs";

function styleInstruction(speechStyle: string) {
  switch (speechStyle) {
    case "formal":
      return "말투는 한국어 격식체로, 정중하고 차분하게 답해.";
    case "casual":
      return "말투는 한국어 반말로, 친근하게 답해.";
    case "tsundere":
      return "말투는 한국어 츤데레 스타일로, 처음엔 툴툴대지만 결국 도움을 줘.";
    case "cute":
      return "말투는 한국어로 귀엽고 다정하게, 과한 유아체는 피하고 자연스럽게.";
    case "sarcastic":
      return "말투는 한국어로 시니컬하고 건조하게. 인신공격은 하지 말고 선은 지켜.";
    default:
      return "말투는 한국어로 자연스럽게.";
  }
}

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError)
    return NextResponse.json({ error: userError.message }, { status: 401 });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const conversationId =
    typeof body?.conversationId === "string" ? body.conversationId : "";
  const content =
    typeof body?.content === "string"
      ? body.content.trim()
      : typeof body?.message === "string"
        ? body.message.trim()
        : Array.isArray(body?.messages)
          ? (() => {
              const last = body.messages.at(-1);
              if (last?.role !== "user") return "";
              return getTextFromUIMessage(last);
            })()
          : "";
  if (!conversationId)
    return NextResponse.json(
      { error: "conversationId is required" },
      { status: 400 },
    );
  if (!content)
    return NextResponse.json({ error: "content is required" }, { status: 400 });

  await ensureUserProfile(supabase, user.id);
  const conversation = await getConversation(supabase, conversationId);
  if (!conversation)
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 },
    );

  const persona = await getPersonaById(supabase, conversation.persona_id);
  if (!persona)
    return NextResponse.json({ error: "Persona not found" }, { status: 404 });

  // Persist user message (so the DB is source of truth).
  await addMessage(supabase, { conversationId, role: "user", content });

  // Load recent history and stream an assistant response.
  const history = await listMessages(supabase, conversationId, 50);

  const system = [
    `너는 사용자와 대화하는 AI 페르소나다.`,
    `페르소나 이름: ${persona.name}`,
    `성격: ${persona.personality}`,
    styleInstruction(persona.speech_style),
    `규칙: 모르는 내용은 아는 척하지 말고 질문하거나 한계를 말해.`,
    `규칙: 사용자의 의도를 먼저 파악하고, 필요하면 짧게 확인 질문 후 답해.`,
  ].join("\n");

  const modelName = process.env.GOOGLE_MODEL || "gemini-2.5-flash";
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY is missing" },
      { status: 500 },
    );

  const google = createGoogleGenerativeAI({ apiKey });
  let result;
  try {
    result = streamText({
      model: google(modelName),
      system,
      maxTokens: 800,
      messages: history
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      onFinish: async ({ text }) => {
        const assistantText = (text ?? "").trim() || "(응답이 비어있어.)";
        await addMessage(supabase, {
          conversationId,
          role: "assistant",
          content: assistantText,
          model: modelName,
        });
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error:
          e?.message ??
          "AI 스트리밍 설정 오류가 발생했어. (의존성 버전 호환성 문제일 수 있어.)",
      },
      { status: 500 },
    );
  }

  return result.toUIMessageStreamResponse();
}
