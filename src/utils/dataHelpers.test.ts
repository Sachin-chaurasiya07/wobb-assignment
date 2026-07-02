import { describe, expect, it } from "vitest";
import {
  filterProfiles,
  getDisplayUsername,
  getProfileKey,
  isValidPlatform,
} from "@/utils/dataHelpers";
import type { UserProfileSummary } from "@/types";

function makeProfile(overrides: Partial<UserProfileSummary> = {}): UserProfileSummary {
  return {
    user_id: "1",
    username: "SomeUser",
    url: "https://example.com",
    picture: "https://example.com/pic.jpg",
    fullname: "Some User",
    is_verified: false,
    followers: 1000,
    ...overrides,
  };
}

describe("getDisplayUsername", () => {
  it("uses username when present", () => {
    expect(getDisplayUsername(makeProfile({ username: "mrbeast" }))).toBe("mrbeast");
  });

  it("falls back to handle when username is missing (regression: renders as 'undefined' otherwise)", () => {
    const profile = makeProfile({ username: undefined, handle: "VladandNiki" });
    expect(getDisplayUsername(profile)).toBe("VladandNiki");
  });

  it("falls back to custom_name when username and handle are missing", () => {
    const profile = makeProfile({ username: undefined, handle: undefined, custom_name: "Foo" });
    expect(getDisplayUsername(profile)).toBe("Foo");
  });

  it("falls back to user_id as a last resort", () => {
    const profile = makeProfile({
      username: undefined,
      handle: undefined,
      custom_name: undefined,
      user_id: "abc123",
    });
    expect(getDisplayUsername(profile)).toBe("abc123");
  });
});

describe("getProfileKey", () => {
  it("combines platform and user_id so identical usernames on different platforms never collide", () => {
    const profile = makeProfile({ user_id: "42", username: "mrbeast" });
    expect(getProfileKey("tiktok", profile)).toBe("tiktok:42");
    expect(getProfileKey("youtube", profile)).not.toBe(getProfileKey("tiktok", profile));
  });
});

describe("isValidPlatform", () => {
  it("accepts the three known platforms", () => {
    expect(isValidPlatform("instagram")).toBe(true);
    expect(isValidPlatform("youtube")).toBe(true);
    expect(isValidPlatform("tiktok")).toBe(true);
  });

  it("rejects arbitrary/malicious query param values", () => {
    expect(isValidPlatform("hacker")).toBe(false);
    expect(isValidPlatform("<script>alert(1)</script>")).toBe(false);
    expect(isValidPlatform("")).toBe(false);
    expect(isValidPlatform(null)).toBe(false);
  });
});

describe("filterProfiles", () => {
  const profiles = [
    makeProfile({ user_id: "1", username: "MrBeast", fullname: "MrBeast" }),
    makeProfile({ user_id: "2", username: "cristiano", fullname: "Cristiano Ronaldo" }),
  ];

  it("matches usernames case-insensitively (regression: was case-sensitive)", () => {
    expect(filterProfiles(profiles, "mrbeast")).toHaveLength(1);
    expect(filterProfiles(profiles, "MRBEAST")).toHaveLength(1);
  });

  it("matches full names case-insensitively", () => {
    expect(filterProfiles(profiles, "ronaldo")).toHaveLength(1);
  });

  it("returns all profiles for an empty/whitespace query", () => {
    expect(filterProfiles(profiles, "   ")).toHaveLength(2);
  });

  it("returns no results when nothing matches", () => {
    expect(filterProfiles(profiles, "zzz")).toHaveLength(0);
  });
});
