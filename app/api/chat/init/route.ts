import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserProfile, getPersonaById, getPersonaBySlug } from "@/lib/db/personas";
import { createConversation, listMessages } from "@/lib/db/chat";

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError) return NextResponse.json({ error: userError.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const personaId = typeof body?.personaId === "string" ? body.personaId : "";
  const personaSlug = typeof body?.personaSlug === "string" ? body.personaSlug : typeof body?.slug === "string" ? body.slug : "";
  if (!personaId && !personaSlug) {
    return NextResponse.json({ error: "personaId or personaSlug is required" }, { status: 400 });
  }

  try {
    await ensureUserProfile(supabase, user.id);
    const persona = personaId ? await getPersonaById(supabase, personaId) : await getPersonaBySlug(supabase, personaSlug);
    if (!persona) return NextResponse.json({ error: "Persona not found" }, { status: 404 });

    const conversation = await createConversation(supabase, {
      userId: user.id,
      personaId: persona.id,
      title: `${persona.name}와 대화`
    });
    const messages = await listMessages(supabase, conversation.id, 50);
    return NextResponse.json({ conversation, persona, messages }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to init chat" }, { status: 500 });
  }
}
