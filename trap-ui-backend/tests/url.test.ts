import { describe, expect, it } from "vitest";
import { isPublicUrl, looksLikeLoginPage } from "../src/utils/url.js";

describe("URL security checks", () => {
  it("rejects non-http protocols", async () => {
    await expect(isPublicUrl("ftp://example.com")).resolves.toBe(false);
  });

  it("flags login pages", () => {
    expect(looksLikeLoginPage("https://example.com/login")).toBe(true);
  });
});
