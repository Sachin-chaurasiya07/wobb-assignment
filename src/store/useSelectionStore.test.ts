import { beforeEach, describe, expect, it } from "vitest";
import { useSelectionStore, selectSavedList, selectCount } from "@/store/useSelectionStore";
import type { UserProfileSummary } from "@/types";

function makeProfile(overrides: Partial<UserProfileSummary> = {}): UserProfileSummary {
  return {
    user_id: "1",
    username: "mrbeast",
    url: "https://example.com",
    picture: "https://example.com/pic.jpg",
    fullname: "MrBeast",
    is_verified: true,
    followers: 92_690_266,
    ...overrides,
  };
}

beforeEach(() => {
  useSelectionStore.setState({ entries: {} });
  window.localStorage.clear();
});

describe("useSelectionStore", () => {
  it("adds a profile to the list", () => {
    useSelectionStore.getState().addProfile("tiktok", makeProfile());
    expect(selectCount(useSelectionStore.getState())).toBe(1);
  });

  it("prevents duplicate entries for the same platform + profile", () => {
    const profile = makeProfile();
    useSelectionStore.getState().addProfile("tiktok", profile);
    useSelectionStore.getState().addProfile("tiktok", profile);
    expect(selectCount(useSelectionStore.getState())).toBe(1);
  });

  it("does not treat the same username on different platforms as a duplicate", () => {
    const profile = makeProfile();
    useSelectionStore.getState().addProfile("tiktok", profile);
    useSelectionStore.getState().addProfile("youtube", { ...profile, user_id: "2" });
    expect(selectCount(useSelectionStore.getState())).toBe(2);
  });

  it("removes a profile by key", () => {
    const profile = makeProfile();
    useSelectionStore.getState().addProfile("tiktok", profile);
    const [entry] = selectSavedList(useSelectionStore.getState());
    useSelectionStore.getState().removeProfile(entry.key);
    expect(selectCount(useSelectionStore.getState())).toBe(0);
  });

  it("toggles a profile on and off", () => {
    const profile = makeProfile();
    useSelectionStore.getState().toggleProfile("tiktok", profile);
    expect(selectCount(useSelectionStore.getState())).toBe(1);
    useSelectionStore.getState().toggleProfile("tiktok", profile);
    expect(selectCount(useSelectionStore.getState())).toBe(0);
  });

  it("reports isSelected correctly", () => {
    const profile = makeProfile();
    expect(useSelectionStore.getState().isSelected("tiktok", profile)).toBe(false);
    useSelectionStore.getState().addProfile("tiktok", profile);
    expect(useSelectionStore.getState().isSelected("tiktok", profile)).toBe(true);
  });

  it("clearAll empties the list", () => {
    useSelectionStore.getState().addProfile("tiktok", makeProfile());
    useSelectionStore.getState().addProfile("youtube", makeProfile({ user_id: "2" }));
    useSelectionStore.getState().clearAll();
    expect(selectCount(useSelectionStore.getState())).toBe(0);
  });

  it("falls back to handle/custom_name for displayName when username is missing", () => {
    useSelectionStore
      .getState()
      .addProfile("youtube", makeProfile({ username: undefined, handle: "VladandNiki" }));
    const [entry] = selectSavedList(useSelectionStore.getState());
    expect(entry.displayName).toBe("VladandNiki");
  });

  describe("setCampaignName", () => {
    it("trims whitespace", () => {
      useSelectionStore.getState().setCampaignName("  Summer Launch  ");
      expect(useSelectionStore.getState().campaignName).toBe("Summer Launch");
    });

    it("caps length at 80 characters", () => {
      useSelectionStore.getState().setCampaignName("x".repeat(200));
      expect(useSelectionStore.getState().campaignName).toHaveLength(80);
    });

    it("falls back to the default name if given only whitespace", () => {
      useSelectionStore.getState().setCampaignName("   ");
      expect(useSelectionStore.getState().campaignName).toBe("My campaign");
    });
  });

  describe("rehydration hardening against tampered/corrupted localStorage", () => {
    it("drops malformed entries instead of crashing (e.g. missing fields, wrong types)", async () => {
      window.localStorage.setItem(
        "wobb-selected-profiles",
        JSON.stringify({
          state: {
            entries: {
              valid: {
                key: "tiktok:1",
                platform: "tiktok",
                user_id: "1",
                displayName: "mrbeast",
                picture: "https://example.com/p.jpg",
                fullname: "MrBeast",
                is_verified: true,
                followers: 100,
                addedAt: 1,
              },
              // missing required fields
              malformed1: { key: "x", platform: "tiktok" },
              // followers is a string instead of a number
              malformed2: {
                key: "y",
                platform: "tiktok",
                user_id: "2",
                displayName: "x",
                picture: "x",
                fullname: "x",
                is_verified: true,
                followers: "not-a-number",
                addedAt: 1,
              },
              // not an object at all
              malformed3: "just a string",
            },
            campaignName: "Tampered name",
            hasSeededExample: true,
          },
          version: 1,
        })
      );

      await useSelectionStore.persist.rehydrate();

      const entries = useSelectionStore.getState().entries;
      expect(Object.keys(entries)).toEqual(["valid"]);
      expect(entries.valid.followers).toBe(100);
    });

    it("ignores a completely non-object persisted value without throwing", async () => {
      window.localStorage.setItem("wobb-selected-profiles", JSON.stringify({ state: null, version: 1 }));
      await expect(useSelectionStore.persist.rehydrate()).resolves.not.toThrow();
    });
  });
});
