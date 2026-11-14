import { NextResponse, type NextRequest } from "next/server";
import { parseBulletin, validGeminiModel } from "@/lib/ai-bulletin";

export const runtime = "nodejs";
const LIMIT_BYTES = 3600;
const MAX_CALLS = 6;
const WINDOW_MS = 15 * 60 * 1000;
const calls = new Map<string, { count: number; until: number }>();

function error(status: number, message: string) {
  return NextResponse.json({ error: message }, { status, headers: { "cache-control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return error(403, "Cross-origin requests are not allowed.");
  if ((Number(request.headers.get("content-length")) || 0) > LIMIT_BYTES) return error(413, "Request is too large.");
  const raw = await request.text();
  if (raw.length > LIMIT_BYTES) return error(413, "Request is too large.");

  let body: Record<string, unknown>;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return error(400, "Invalid request.");
    body = value as Record<string, unknown>;
  } catch { return error(400, "Invalid JSON."); }

  const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
  if (!apiKey || apiKey.length > 240) return error(400, "Add your own Gemini API key first.");
  if (!validGeminiModel(body.model)) return error(400, "Unknown model format.");
  const locale = body.locale === "ar" ? "ar" : "en";
  const minute = Number.isInteger(body.worldMinutes)
    ? Math.max(0, Math.min(999999, Number(body.worldMinutes))) : 480;

  // Best-effort per-instance rate cap; no server-side API key is configured.
  const identifier = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const state = calls.get(identifier);
  const current = state && now < state.until ? state : { count: 0, until: now + WINDOW_MS };
  if (current.count >= MAX_CALLS) return error(429, "Take a break before requesting another article.");
  calls.set(identifier, { count: current.count + 1, until: current.until });

  const system = [
    "Write ONE short fictional newspaper notice for a cheerful, funny, cozy town named Maalesh.",
    "Make it believable as small town news about charming, harmless absurdity.",
    "No real-world political news, real people, brands, copyrighted characters,",
    "no hostility to unemployed people, no gloomy corporate exploitation, no game mechanics or quests.",
    "Output JSON ONLY with two string fields: headline (4-100 chars), body (12-450 chars).",
    locale === "ar"
      ? "Write naturally in Egyptian Arabic, not formal Arabic."
      : "Write accessible international English without repetitive AI slogans.",
    "This is optional flavor content, never a source of game state.",
  ].join(" ");

  try {
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" +
      encodeURIComponent(body.model) + ":generateContent";
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      cache: "no-store",
      signal: AbortSignal.timeout(18000),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: "It is game minute " + minute + ". Write one lighthearted local report about ordinary townspeople." }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: { headline: { type: "string" }, body: { type: "string" } },
            required: ["headline", "body"],
          },
          temperature: 0.85,
        },
      }),
    });
    if (!upstream.ok) return error(upstream.status === 429 ? 429 : 502,
      upstream.status === 429 ? "Your provider quota is busy. The offline bulletin still works." : "Gemini request unavailable. Check your key and model.");
    const json: unknown = await upstream.json();
    const candidate = json && typeof json === "object"
      ? (json as { candidates?: { content?: { parts?: { text?: string }[] } }[] }).candidates?.[0]?.content?.parts
      : null;
    const content = candidate?.map(part => part.text ?? "").join("") ?? "";
    const result = parseBulletin(JSON.parse(content));
    if (!result) return error(502, "The generated bulletin did not pass content validation.");
    return NextResponse.json({ ...result, source: "gemini" }, {
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return error(502, "Generation failed. Your built-in town content remains available.");
  }
}
