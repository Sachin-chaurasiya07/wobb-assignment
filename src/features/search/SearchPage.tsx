import { useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PlatformTabs } from "@/features/search/PlatformTabs";
import { SearchInput } from "@/features/search/SearchInput";
import { ProfileGrid } from "@/features/search/ProfileGrid";
import { PLATFORMS, extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import type { Platform } from "@/types";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 200);

  // Static per-platform datasets: computed once per platform, not on
  // every render.
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  const filtered = useMemo(
    () => filterProfiles(allProfiles, debouncedQuery),
    [allProfiles, debouncedQuery]
  );

  const counts = useMemo(() => {
    return PLATFORMS.reduce((acc, p) => {
      acc[p] = extractProfiles(p).length;
      return acc;
    }, {} as Record<Platform, number>);
  }, []);

  return (
    <PageShell>
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-2">
          <span className="text-gradient">Find top influencers.</span>
          <br />
          <span className="text-[var(--text-h)]">Build your dream list.</span>
        </h1>
        <p className="text-[var(--text)] text-sm max-w-md mx-auto sm:mx-0">
          Browse top creators across Instagram, YouTube, and TikTok, and shortlist
          the ones that fit your campaign.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <PlatformTabs selected={platform} onChange={setPlatform} counts={counts} />
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>

      <p className="text-xs text-[var(--text)] mb-3" aria-live="polite">
        Showing {filtered.length} of {allProfiles.length} profiles
      </p>

      <ProfileGrid profiles={filtered} platform={platform} />
    </PageShell>
  );
}
