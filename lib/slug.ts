export function slugify(input: string) {
  const raw = input.trim().toLowerCase();
  if (!raw) return "";

  // Keep ASCII alnum, hyphen, underscore, and Hangul. Replace spaces with hyphen.
  const spaced = raw.replace(/\s+/g, "-");
  const cleaned = spaced.replace(/[^a-z0-9\-_가-힣-]/g, "");
  const collapsed = cleaned.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return collapsed;
}

