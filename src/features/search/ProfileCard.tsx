import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { AddToListButton } from "@/components/ui/AddToListButton";
import { getDisplayUsername, getRouteParam } from "@/utils/dataHelpers";
import { formatCount } from "@/utils/formatters";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

function ProfileCardImpl({ profile, platform }: ProfileCardProps) {
  const navigate = useNavigate();
  const displayUsername = getDisplayUsername(profile);

  const handleActivate = () => {
    navigate(`/profile/${encodeURIComponent(getRouteParam(profile))}?platform=${platform}`);
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      aria-label={`View profile for ${profile.fullname}, @${displayUsername}`}
      className="flex items-center gap-3 p-4 cursor-pointer hover:border-[var(--accent-border)] hover:shadow-[0_0_24px_rgba(192,132,252,0.15)] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <Avatar src={profile.picture} alt={profile.fullname} size={52} />

      <div className="text-left flex-1 min-w-0">
        <div className="flex items-center gap-1 font-semibold text-[var(--text-h)] truncate">
          <span className="truncate">@{displayUsername}</span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-[var(--text)] truncate">{profile.fullname}</div>
        <div className="text-sm text-[var(--text)] mt-0.5">
          {formatCount(profile.followers)} followers
        </div>
      </div>

      <AddToListButton profile={profile} platform={platform} stopPropagation />
    </Card>
  );
}

export const ProfileCard = memo(ProfileCardImpl);
