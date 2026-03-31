export type SpeechStyle = "formal" | "casual" | "tsundere" | "cute" | "sarcastic";

export type Persona = {
  id: string;
  user_id: string;
  name: string;
  personality: string;
  speech_style: string;
  slug: string;
  is_public: boolean;
  creator_name: string;
  avatar_emoji: string | null;
  avatar_color: string | null;
  created_at: string;
  updated_at: string;
};
