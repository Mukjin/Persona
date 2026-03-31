import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deletePersona, ensureUserProfile, getPersonaById, updatePersona } from "@/lib/db/personas";

function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError) return NextResponse.json({ error: userError.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = ctx.params.id;
  if (!id) return badRequest("id is required");

  try {
    await ensureUserProfile(supabase, user.id);
    const persona = await getPersonaById(supabase, id);
    if (!persona) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ persona });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to get persona" }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError) return NextResponse.json({ error: userError.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = ctx.params.id;
  if (!id) return badRequest("id is required");

  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON");

  const patch: any = {};
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length < 2) return badRequest("invalid name");
    patch.name = body.name.trim();
  }
  if (body.personality !== undefined) {
    if (typeof body.personality !== "string" || body.personality.trim().length < 10) {
      return badRequest("invalid personality");
    }
    patch.personality = body.personality.trim();
  }
  if (body.speech_style !== undefined) {
    if (typeof body.speech_style !== "string" || !body.speech_style.trim()) {
      return badRequest("invalid speech_style");
    }
    patch.speech_style = body.speech_style.trim();
  }
  if (body.avatar_emoji !== undefined) {
    patch.avatar_emoji = typeof body.avatar_emoji === "string" ? body.avatar_emoji.trim() : null;
  }
  if (body.avatar_color !== undefined) {
    patch.avatar_color = typeof body.avatar_color === "string" ? body.avatar_color.trim() : null;
  }

  try {
    await ensureUserProfile(supabase, user.id);
    const persona = await updatePersona(supabase, id, patch);
    return NextResponse.json({ persona });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to update persona" }, { status: 500 });
  }
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError) return NextResponse.json({ error: userError.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = ctx.params.id;
  if (!id) return badRequest("id is required");

  try {
    await ensureUserProfile(supabase, user.id);
    await deletePersona(supabase, id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to delete persona" }, { status: 500 });
  }
}

