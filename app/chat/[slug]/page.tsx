import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Container } from "@/components/Container";
import { GuestChatClient } from "@/components/chat/GuestChatClient";
import { PublicBanner } from "@/components/chat/PublicBanner";

export default async function PublicChatPage({ params }: { params: { slug: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    notFound();
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: persona } = await supabase
    .from("personas")
    .select("slug,name,personality,speech_style,avatar_emoji,avatar_color,creator_name")
    .eq("slug", params.slug)
    .eq("is_public", true)
    .single();

  if (!persona) notFound();

  return (
    <Container>
      <div className="hero-glow surface-card-strong rounded-[34px] px-7 py-8 sm:px-10 sm:py-10">
        <div className="soft-pill">Public Persona</div>
        <h1 className="korean-wrap mt-5 text-[2rem] font-semibold tracking-[-0.03em] text-[rgb(var(--text))] sm:text-[2.5rem]">
          {persona.name}와 바로 대화해볼 수 있습니다.
        </h1>
        <p className="korean-wrap mt-4 max-w-2xl text-sm leading-8 text-[rgb(var(--muted))]">
          로그인 없이도 공개 링크로 접속해 페르소나의 성격과 말투를 바로 체험할 수 있습니다.
        </p>
      </div>

      <div className="mt-6">
        <GuestChatClient persona={persona} />
      </div>
      <PublicBanner creatorName={persona.creator_name} />
    </Container>
  );
}
