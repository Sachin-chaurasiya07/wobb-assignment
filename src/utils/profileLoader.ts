import type { ProfileDetailResponse } from "@/types";

// Lazily-loaded, code-split JSON modules -- keeps each profile's detail
// payload out of the main bundle until it's actually requested.
const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

/**
 * Loads a single profile's detail JSON by its route param (the same
 * value produced by `getRouteParam` in dataHelpers). Returns `null` if
 * no detail file exists for that profile (most search results don't
 * have one in the sample dataset) or if loading fails for any reason --
 * callers should treat both cases as "no data available" rather than
 * throwing.
 */
export async function loadProfileByUsername(
  routeParam: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${routeParam}.json`;
  const loader = profileModules[path];

  if (!loader) {
    return null;
  }

  try {
    const result = await loader();
    const data = (result as { default?: ProfileDetailResponse }).default ?? result;
    return (data as ProfileDetailResponse) ?? null;
  } catch (error) {
    console.error(`Failed to load profile data for "${routeParam}":`, error);
    return null;
  }
}
