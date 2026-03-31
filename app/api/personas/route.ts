import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createPersona, ensureUserProfile, listPersonas } from "@/lib/db/personas";

function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError) return NextResponse.json({ error: userError.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureUserProfile(supabase, user.id);
    const personas = await listPersonas(supabase);
    return NextResponse.json({ personas });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to list personas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError) return NextResponse.json({ error: userError.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON");

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const personality = typeof body.personality === "string" ? body.personality.trim() : "";
  const speech_style = typeof body.speech_style === "string" ? body.speech_style.trim() : "";
  const avatar_emoji = typeof body.avatar_emoji === "string" ? body.avatar_emoji.trim() : null;
  const avatar_color = typeof body.avatar_color === "string" ? body.avatar_color.trim() : null;

  if (name.length < 2) return badRequest("name must be at least 2 characters");
  if (personality.length < 10) return badRequest("personality must be at least 10 characters");
  if (!speech_style) return badRequest("speech_style is required");
  if (!(avatar_emoji && avatar_emoji.length > 0) && !(avatar_color && avatar_color.length > 0)) {
    return badRequest("avatar_emoji or avatar_color is required");
  }

  try {
    await ensureUserProfile(supabase, user.id);
    const persona = await createPersona(supabase, user.id, {
      name,
      personality,
      speech_style,
      creator_name: user.user_metadata?.name ?? user.email ?? "",
      avatar_emoji,
      avatar_color
    });
    return NextResponse.json({ persona }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to create persona" }, { status: 500 });
  }
}
