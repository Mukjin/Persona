import { NextResponse } from "next/server";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createSupabasePublicClient } from "@/lib/supabase/public";
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
  const body = await req.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  if (!slug)
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages is required" },
      { status: 400 },
    );
  }

  const last = messages.at(-1);
  if (last?.role !== "user")
    return NextResponse.json(
      { error: "last message must be user" },
      { status: 400 },
    );
  if (!getTextFromUIMessage(last)) {
    return NextResponse.json(
      { error: "last user message must contain text" },
      { status: 400 },
    );
  }

  const supabasePublic = createSupabasePublicClient();
  const { data: persona, error } = await supabasePublic
    .from("personas")
    .select("name,personality,speech_style,is_public")
    .eq("slug", slug)
    .maybeSingle();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!persona || !persona.is_public)
    return NextResponse.json({ error: "Persona not found" }, { status: 404 });

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
      messages: messages
        .filter((m: any) => m?.role === "user" || m?.role === "assistant")
        .map((m: any) => ({
          role: m.role,
          content: getTextFromUIMessage(m),
        }))
        .filter((m: any) => Boolean(m.content)),
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

  // Guest mode: do not persist anything.
  return result.toUIMessageStreamResponse();
}
