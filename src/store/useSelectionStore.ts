import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, SavedProfile, UserProfileSummary } from "@/types";
import { getDisplayUsername, getProfileKey } from "@/utils/dataHelpers";

interface SelectionState {
  /** Keyed by `${platform}:${user_id}` for O(1) lookup and de-dupe. */
  entries: Record<string, SavedProfile>;
  campaignName: string;
  /** Internal: true once the one-time example-campaign seed has run. */
  hasSeededExample: boolean;
  addProfile: (platform: Platform, profile: UserProfileSummary) => void;
  removeProfile: (key: string) => void;
  toggleProfile: (platform: Platform, profile: UserProfileSummary) => void;
  isSelected: (platform: Platform, profile: UserProfileSummary) => boolean;
  setCampaignName: (name: string) => void;
  clearAll: () => void;
}

const DEFAULT_CAMPAIGN_NAME = "My campaign";

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      entries: {},
      campaignName: DEFAULT_CAMPAIGN_NAME,
      hasSeededExample: false,

      addProfile: (platform, profile) => {
        const key = getProfileKey(platform, profile);
        // Guard against duplicates explicitly (rather than relying only
        // on object-key overwrite) so callers can tell add vs. no-op if
        // needed later, and so intent is clear in the code.
        if (get().entries[key]) return;

        const entry: SavedProfile = {
          key,
          platform,
          user_id: profile.user_id,
          username: profile.username,
          displayName: getDisplayUsername(profile),
          picture: profile.picture,
          fullname: profile.fullname,
          is_verified: profile.is_verified,
          followers: profile.followers,
          addedAt: Date.now(),
        };

        set((state) => ({
          entries: { ...state.entries, [key]: entry },
        }));
      },

      removeProfile: (key) => {
        set((state) => {
          if (!(key in state.entries)) return state;
          const next = { ...state.entries };
          delete next[key];
          return { entries: next };
        });
      },

      toggleProfile: (platform, profile) => {
        const key = getProfileKey(platform, profile);
        if (get().entries[key]) {
          get().removeProfile(key);
        } else {
          get().addProfile(platform, profile);
        }
      },

      isSelected: (platform, profile) => {
        const key = getProfileKey(platform, profile);
        return key in get().entries;
      },

      setCampaignName: (name) => {
        // Trim and cap length -- this gets rendered directly into the
        // page (React escapes it, so no XSS risk either way) but capping
        // keeps the UI sane against a pasted wall of text.
        const trimmed = name.trim().slice(0, 80);
        set({ campaignName: trimmed || DEFAULT_CAMPAIGN_NAME });
      },

      clearAll: () => set({ entries: {} }),
    }),
    {
      name: "wobb-selected-profiles",
      version: 1,
      // Defensive rehydration: localStorage is plain, user-editable JSON.
      // A hand-edited or corrupted value shouldn't be able to crash the
      // app (e.g. a missing `followers` field breaking formatCount, or a
      // non-object `entries` breaking Object.values downstream). Anything
      // that doesn't look like a valid SavedProfile is dropped rather
      // than trusted as-is.
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SelectionState> | undefined;
        if (!persisted || typeof persisted !== "object") return currentState;

        const rawEntries = persisted.entries;
        const cleanEntries: Record<string, SavedProfile> = {};

        if (rawEntries && typeof rawEntries === "object") {
          for (const [key, value] of Object.entries(rawEntries)) {
            if (isValidSavedProfile(value)) {
              cleanEntries[key] = value;
            }
          }
        }

        return {
          ...currentState,
          entries: cleanEntries,
          campaignName:
            typeof persisted.campaignName === "string" && persisted.campaignName.trim()
              ? persisted.campaignName.slice(0, 80)
              : currentState.campaignName,
          hasSeededExample: persisted.hasSeededExample === true,
        };
      },
    }
  )
);

function isValidSavedProfile(value: unknown): value is SavedProfile {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.key === "string" &&
    typeof v.platform === "string" &&
    typeof v.user_id === "string" &&
    typeof v.displayName === "string" &&
    typeof v.picture === "string" &&
    typeof v.fullname === "string" &&
    typeof v.is_verified === "boolean" &&
    typeof v.followers === "number" &&
    typeof v.addedAt === "number"
  );
}

/** Convenience selector: selected profiles as an array, newest first. */
export function selectSavedList(state: SelectionState): SavedProfile[] {
  return Object.values(state.entries).sort((a, b) => b.addedAt - a.addedAt);
}

export function selectCount(state: SelectionState): number {
  return Object.keys(state.entries).length;
}

/**
 * A small set of real, recognizable profiles used to seed an example
 * campaign the very first time the app is opened -- so the "My List"
 * feature isn't empty on first look. Runs exactly once (guarded by
 * `hasSeededExample`), after the store finishes rehydrating from
 * localStorage, so it never overwrites a returning user's real list.
 */
const EXAMPLE_SEED: Array<{ platform: Platform; profile: UserProfileSummary }> = [
  {
    platform: "tiktok",
    profile: {
      user_id: "6614519312189947909",
      username: "mrbeast",
      url: "https://www.tiktok.com/share/user/6614519312189947909",
      picture:
        "https://imgp.sptds.icu/v2?9gRRkBbg4nctjMDXek72QSCMaxxBuDuVcQlJY8X8h9vqTqkZLQyMnqcWX9I4IhQ3vrEEWC1D%2B3JhYQZYMx9eVPk8zW1rQW5as7BcFsi4SRvdIbJUVOXdwe%2F5GDuBsLBl",
      fullname: "MrBeast",
      is_verified: true,
      followers: 104_500_000,
    },
  },
  {
    platform: "instagram",
    profile: {
      user_id: "173560420",
      username: "cristiano",
      url: "https://www.instagram.com/cristiano/",
      picture:
        "https://imgp.sptds.icu/v2?mb0KwpL92uYofJiSjDn1%2F6peL1lBwv3s%2BUvShHERlDb05bk9EAgW7oQoJCzCEnmGmUuoxbOW5tBwsZsGrK%2FS7yWdNkP7y%2B1pFCfs%2BJuNwg4LMGQUZTpkh%2BW3cdViohxwWwq5%2BhsabX0Nc9aXCBbcsw%3D%3D",
      fullname: "Cristiano Ronaldo",
      is_verified: true,
      followers: 641_325_352,
    },
  },
  {
    platform: "youtube",
    profile: {
      user_id: "UCX6OQ3DkcsbYNE6H8uQQuVA",
      username: "MrBeast6000",
      handle: "MrBeast",
      custom_name: "MrBeast6000",
      url: "https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA",
      picture:
        "https://yt3.googleusercontent.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s480-c-k-c0x00ffffff-no-rj",
      fullname: "MrBeast",
      is_verified: true,
      followers: 324_000_000,
    },
  },
];

function seedExampleCampaignIfNeeded() {
  const state = useSelectionStore.getState();
  if (state.hasSeededExample) return;

  // Don't clobber a list a returning user already built some other way
  // (e.g. restored from an older persisted version without the flag).
  if (Object.keys(state.entries).length > 0) {
    useSelectionStore.setState({ hasSeededExample: true });
    return;
  }

  for (const { platform, profile } of EXAMPLE_SEED) {
    useSelectionStore.getState().addProfile(platform, profile);
  }

  useSelectionStore.setState({
    campaignName: "Example campaign: Summer product launch",
    hasSeededExample: true,
  });
}

if (useSelectionStore.persist.hasHydrated()) {
  seedExampleCampaignIfNeeded();
} else {
  const unsubscribe = useSelectionStore.persist.onFinishHydration(() => {
    seedExampleCampaignIfNeeded();
    unsubscribe();
  });
}
