import { redirect } from "next/navigation";
import { ChatClient } from "@/components/chat/ChatClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserProfile, getPersonaById } from "@/lib/db/personas";
import { createConversation } from "@/lib/db/chat";

export default async function PrivateChatPage({
  params,
}: {
  params: { personaId: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/chat/p/${params.personaId}`)}`);
  }

  await ensureUserProfile(supabase, user.id);
  const persona = await getPersonaById(supabase, params.personaId);
  if (!persona) {
    redirect("/dashboard");
  }

  const conversation = await createConversation(supabase, {
    userId: user.id,
    personaId: persona.id,
    title: `${persona.name}와 대화`,
  });

  return (
    <ChatClient
      conversationId={conversation.id}
      persona={{
        name: persona.name,
        speech_style: persona.speech_style,
        avatar_emoji: persona.avatar_emoji,
        avatar_color: persona.avatar_color,
      }}
    />
  );
}
