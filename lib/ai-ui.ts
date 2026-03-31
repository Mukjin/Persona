type UIMessagePart = {
  type?: string;
  text?: string;
};

type UIMessageLike = {
  role?: string;
  content?: unknown;
  parts?: UIMessagePart[];
};

export function getTextFromUIMessage(message: UIMessageLike | null | undefined) {
  if (!message) return "";

  if (typeof message.content === "string") {
    return message.content.trim();
  }

  if (!Array.isArray(message.parts)) {
    return "";
  }

  return message.parts
    .filter((part) => part?.type === "text" && typeof part.text === "string")
    .map((part) => part.text?.trim() ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

export function getRenderableTextFromMessage(
  message: UIMessageLike & { role?: string },
) {
  if (typeof message.content === "string" && message.content.trim()) {
    return message.content.trim();
  }

  if (!Array.isArray(message.parts)) {
    return "";
  }

  return message.parts
    .filter((part) => part?.type === "text" && typeof part.text === "string")
    .map((part) => part.text ?? "")
    .join("")
    .trim();
}
