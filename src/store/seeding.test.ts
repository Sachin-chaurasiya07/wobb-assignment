import { describe, expect, it, beforeEach, vi } from "vitest";

beforeEach(() => {
  window.localStorage.clear();
  vi.resetModules();
});

describe("example campaign seeding", () => {
  it("seeds example profiles and a campaign name on a completely fresh (never-used) app", async () => {
    const { useSelectionStore, selectCount } = await import("@/store/useSelectionStore");

    // Wait a tick for the hydrate -> seed chain to finish.
    await new Promise((resolve) => setTimeout(resolve, 0));

    const state = useSelectionStore.getState();
    expect(selectCount(state)).toBeGreaterThan(0);
    expect(state.hasSeededExample).toBe(true);
    expect(state.campaignName).toMatch(/example campaign/i);
  });

  it("does not reseed (or resurrect deleted entries) on a later load, even if the user cleared everything", async () => {
    // First "session": seed happens, then the user clears their list.
    const first = await import("@/store/useSelectionStore");
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(first.selectCount(first.useSelectionStore.getState())).toBeGreaterThan(0);

    first.useSelectionStore.getState().clearAll();
    expect(first.selectCount(first.useSelectionStore.getState())).toBe(0);

    // Simulate a page refresh: fresh module instance, same localStorage.
    vi.resetModules();
    const second = await import("@/store/useSelectionStore");
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Should stay empty -- the seed must not run a second time and
    // silently repopulate a list the user intentionally emptied.
    expect(second.selectCount(second.useSelectionStore.getState())).toBe(0);
  });

  it("does not overwrite a returning user's real (non-empty) list", async () => {
    const first = await import("@/store/useSelectionStore");
    await new Promise((resolve) => setTimeout(resolve, 0));

    first.useSelectionStore.getState().clearAll();
    first.useSelectionStore.getState().addProfile("tiktok", {
      user_id: "999",
      username: "realuser",
      url: "https://example.com",
      picture: "https://example.com/p.jpg",
      fullname: "Real User",
      is_verified: false,
      followers: 42,
    });
    first.useSelectionStore.getState().setCampaignName("My real campaign");

    vi.resetModules();
    const second = await import("@/store/useSelectionStore");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const list = second.selectSavedList(second.useSelectionStore.getState());
    expect(list).toHaveLength(1);
    expect(list[0].username).toBe("realuser");
    expect(second.useSelectionStore.getState().campaignName).toBe("My real campaign");
  });
});
