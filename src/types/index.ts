export type Platform = "instagram" | "youtube" | "tiktok";

/**
 * Raw profile summary as it appears in the search JSON payloads.
 *
 * NOTE: some source records (notably several YouTube channels) don't
 * include a `username` field at all -- they only have `handle` and/or
 * `custom_name`. Any code that needs a human-readable handle or a routing
 * key must go through `getDisplayUsername` / `getProfileKey` in
 * `utils/dataHelpers.ts` rather than reading `username` directly.
 */
export interface UserProfileSummary {
  user_id: string;
  username?: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  handle?: string;
  custom_name?: string;
  avg_views?: number;
}

export interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
    audience_source: string;
  };
}

export interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

export interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  gender?: string;
  age_group?: string;
}

export interface ProfileDetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: FullUserProfile;
  };
}

/**
 * An entry saved to the user's selected list. We snapshot the fields we
 * need for display so the list still renders correctly even if the
 * source JSON later changes, and so the list page doesn't need to
 * re-fetch anything.
 */
export interface SavedProfile {
  /** Stable de-dupe key: `${platform}:${user_id}` */
  key: string;
  platform: Platform;
  user_id: string;
  username?: string;
  displayName: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  addedAt: number;
}
