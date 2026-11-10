import { describe, expect, it } from "vitest";
import { cookiesEnabled } from "./cookieSupport";

describe("cookiesEnabled", () => {
  it("returns false when the browser disables cookies", () => {
    Object.defineProperty(navigator, "cookieEnabled", {
      configurable: true,
      value: false,
    });

    expect(cookiesEnabled()).toBe(false);
  });

  it("writes and reads a test cookie when cookies are enabled", () => {
    Object.defineProperty(navigator, "cookieEnabled", {
      configurable: true,
      value: true,
    });

    expect(cookiesEnabled()).toBe(true);
    expect(document.cookie).not.toContain("__cookie_test=1");
  });
});
