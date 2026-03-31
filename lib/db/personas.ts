import type { SupabaseClient } from "@supabase/supabase-js";
import type { Persona } from "@/lib/types";
import { slugify } from "@/lib/slug";

export type PersonaCreateInput = {
  name: string;
  personality: string;
  speech_style: string;
  slug?: string;
  is_public?: boolean;
  creator_name?: string;
  avatar_emoji?: string | null;
  avatar_color?: string | null;
};

export type PersonaUpdateInput = Partial<PersonaCreateInput>;

export async function ensureUserProfile(supabase: SupabaseClient, userId: string) {
  const { error } = await supabase
    .from("users")
    .upsert({ id: userId }, { onConflict: "id", ignoreDuplicates: false });
  if (error) throw error;
}

export async function listPersonas(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("personas")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Persona[];
}

export async function getPersonaById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from("personas").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data ?? null) as Persona | null;
}

export async function getPersonaBySlug(supabase: SupabaseClient, slug: string) {
  const { data, error } = await supabase.from("personas").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data ?? null) as Persona | null;
}

export async function generateUniquePersonaSlug(supabase: SupabaseClient, name: string) {
  const base = slugify(name) || "persona";
  const { data, error } = await supabase
    .from("personas")
    .select("slug")
    .ilike("slug", `${base}%`)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  const existing = new Set((data ?? []).map((r: any) => String(r.slug)));
  if (!existing.has(base)) return base;
  for (let i = 2; i < 2000; i++) {
    const candidate = `${base}-${i}`;
    if (!existing.has(candidate)) return candidate;
  }
  // Extremely unlikely; fallback to timestamp suffix.
  return `${base}-${Date.now()}`;
}

export async function createPersona(supabase: SupabaseClient, userId: string, input: PersonaCreateInput) {
  const slug = input.slug ?? (await generateUniquePersonaSlug(supabase, input.name));
  const { data, error } = await supabase
    .from("personas")
    .insert({
      user_id: userId,
      name: input.name,
      personality: input.personality,
      speech_style: input.speech_style,
      slug,
      is_public: input.is_public ?? true,
      creator_name: input.creator_name ?? "",
      avatar_emoji: input.avatar_emoji ?? null,
      avatar_color: input.avatar_color ?? null
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Persona;
}

export async function updatePersona(supabase: SupabaseClient, id: string, input: PersonaUpdateInput) {
  const { data, error } = await supabase
    .from("personas")
    .update({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.personality !== undefined ? { personality: input.personality } : {}),
      ...(input.speech_style !== undefined ? { speech_style: input.speech_style } : {}),
      ...(input.avatar_emoji !== undefined ? { avatar_emoji: input.avatar_emoji } : {}),
      ...(input.avatar_color !== undefined ? { avatar_color: input.avatar_color } : {})
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Persona;
}

export async function deletePersona(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("personas").delete().eq("id", id);
  if (error) throw error;
}
