import { UserX } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "@/features/search/ProfileCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getProfileKey } from "@/utils/dataHelpers";

interface ProfileGridProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export function ProfileGrid({ profiles, platform }: ProfileGridProps) {
  if (profiles.length === 0) {
    return (
      <EmptyState
        icon={<UserX className="w-10 h-10" />}
        title="No profiles found"
        description="Try a different search term or switch platforms."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
      {profiles.map((profile) => (
        <div role="listitem" key={getProfileKey(platform, profile)}>
          <ProfileCard profile={profile} platform={platform} />
        </div>
      ))}
    </div>
  );
}
