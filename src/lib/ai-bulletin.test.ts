import { describe, expect, it } from "vitest";
import { parseBulletin, validGeminiModel } from "./ai-bulletin";

describe("safe optional generated bulletin", () => {
  it("accepts a bounded plain-text bulletin", () => {
    expect(parseBulletin({ headline: "Chickens elect a treasurer", body: "The new treasurer has asked to be paid in corn." }))
      .toEqual({ headline: "Chickens elect a treasurer", body: "The new treasurer has asked to be paid in corn." });
  });
  it("rejects code, oversized and malformed content", () => {
    expect(parseBulletin({ headline: "<script>alert(1)</script>", body: "A story about apples" })).toBeNull();
    expect(parseBulletin({ headline: "Hello", body: "x".repeat(451) })).toBeNull();
    expect(parseBulletin(null)).toBeNull();
  });
  it("does not allow arbitrary model paths", () => {
    expect(validGeminiModel("gemini-3.8-flash")).toBe(true);
    expect(validGeminiModel("../../untrusted")).toBe(false);
    expect(validGeminiModel("https://attacker.example")).toBe(false);
  });
});
