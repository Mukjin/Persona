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

function interpreterInstruction() {
  return [
    "역할: 너는 비개발자를 위한 IT 통역사다. 개발 용어가 나오면 일상 비유로 머릿속에 그림이 그려지게 설명해.",
    "규칙: 비유는 하나만 고르고 끝까지 유지해. (예: 식당/택배/은행/학교 중 1개)",
    "규칙: 어려운 단어는 괄호로 바로 번역해. 예: 배포(인터넷에 올려서 사람들이 쓰게 하기)",
    "형식: 아래 마크다운 헤더를 정확히 사용해. 순서도 유지해.",
    "### 💡 [초보자를 위한 IT 용어 번역기]",
    "- 한 줄 정의(아주 쉬운 말)",
    "### 🖼️ 머릿속 그림(비유)",
    "- 일상 비유로 설명",
    "### ✅ 실무에서 이렇게 씁니다(예시)",
    "- 예시 1~2개",
    "### ⚠️ 자주 헷갈리는 포인트",
    "- 헷갈리기 쉬운 포인트 1~2개",
    "### 🧭 다음 행동(비개발자 기준)",
    "- 바로 해볼 수 있는 다음 단계 1~2개",
    "규칙: 각 섹션은 2~5줄로 짧고 선명하게.",
  ].join("\n");
}

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError)
    return NextResponse.json({ error: userError.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const conversationId =
    typeof body?.conversationId === "string" ? body.conversationId : "";
  const interpreterMode = Boolean(body?.interpreterMode);
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
    interpreterMode ? interpreterInstruction() : null,
    `페르소나 이름: ${persona.name}`,
    `성격: ${persona.personality}`,
    styleInstruction(persona.speech_style),
    `규칙: 모르는 내용은 아는 척하지 말고 질문하거나 한계를 말해.`,
    `규칙: 사용자의 의도를 먼저 파악하고, 필요하면 짧게 확인 질문 후 답해.`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

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
