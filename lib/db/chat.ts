import type { SupabaseClient } from "@supabase/supabase-js";

export type Conversation = {
  id: string;
  user_id: string;
  persona_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: "system" | "user" | "assistant";
  content: string;
  model: string | null;
  created_at: string;
};

export async function createConversation(supabase: SupabaseClient, input: { userId: string; personaId: string; title?: string }) {
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: input.userId,
      persona_id: input.personaId,
      title: input.title ?? null
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Conversation;
}

export async function getConversation(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from("conversations").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data ?? null) as Conversation | null;
}

export async function listMessages(supabase: SupabaseClient, conversationId: string, limit = 50) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function addMessage(
  supabase: SupabaseClient,
  input: { conversationId: string; role: Message["role"]; content: string; model?: string | null }
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: input.conversationId,
      role: input.role,
      content: input.content,
      model: input.model ?? null
    })
    .select("*")
    .single();
  if (error) throw error;

  // Touch conversation updated_at for better sorting.
  await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", input.conversationId);

  return data as Message;
}

