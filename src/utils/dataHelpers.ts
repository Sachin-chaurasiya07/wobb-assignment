import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

/**
 * Runtime guard for values coming from outside our own code -- URL query
 * params, in particular. `searchParams.get("platform")` returns whatever
 * string is actually in the address bar, which could be anything (a typo,
 * an old bookmark, or someone deliberately probing with `?platform=xyz`).
 * Blindly casting that to `Platform` would let an invalid value silently
 * flow into `getPlatformLabel`'s exhaustive switch (which has no default
 * case) and render as blank/undefined instead of failing loudly or
 * falling back sensibly.
 */
export function isValidPlatform(value: string | null): value is Platform {
  return value !== null && (PLATFORMS as string[]).includes(value);
}

export function getPlatformLabel(platform: Platform): string {
  switch (platform) {
    case "instagram":
      return "Instagram";
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
  }
}

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => item.account.user_profile);
}

/**
 * Some source records (a handful of YouTube channels) don't have a
 * `username` field, only `handle` and/or `custom_name`. This resolves
 * the best available handle to show in the UI so we never render
 * "@undefined".
 */
export function getDisplayUsername(profile: UserProfileSummary): string {
  return profile.username ?? profile.handle ?? profile.custom_name ?? profile.user_id;
}

/**
 * Stable, collision-safe identity for a profile: combines platform +
 * user_id. Two accounts on different platforms can never collide, and
 * missing `username` fields never cause it to fall back to "undefined".
 */
export function getProfileKey(platform: Platform, profile: UserProfileSummary): string {
  return `${platform}:${profile.user_id}`;
}

/**
 * Routing param used for the profile detail page. Falls back through
 * handle/custom_name/user_id when username is absent, matching
 * getDisplayUsername so links and lookups stay in sync.
 */
export function getRouteParam(profile: UserProfileSummary): string {
  return getDisplayUsername(profile);
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return profiles;

  return profiles.filter((p) => {
    const username = getDisplayUsername(p).toLowerCase();
    const fullname = p.fullname.toLowerCase();
    return username.includes(trimmed) || fullname.includes(trimmed);
  });
}
