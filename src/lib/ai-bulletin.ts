export interface Bulletin {
  headline: string;
  body: string;
}

export function parseBulletin(input: unknown): Bulletin | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const object = input as Record<string, unknown>;
  if (typeof object.headline !== "string" || typeof object.body !== "string") return null;
  const headline = object.headline.trim();
  const body = object.body.trim();
  if (headline.length < 4 || headline.length > 100 ||
    body.length < 12 || body.length > 450) return null;
  // Never treat remote prose as HTML or executable commands.
  if (/<[^>]+>/.test(headline) || /<[^>]+>/.test(body)) return null;
  return { headline, body };
}

export function validGeminiModel(value: unknown): value is string {
  return typeof value === "string" && value.length <= 80 &&
    /^gemini-[a-z0-9._-]+$/i.test(value);
}
