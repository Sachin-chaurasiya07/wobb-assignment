import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Eye,
  ExternalLink,
  Heart,
  MessageCircle,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddToListButton } from "@/components/ui/AddToListButton";
import { BackLink } from "@/components/ui/BackLink";
import { StatCard } from "@/features/profile/StatCard";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { formatCount, formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { getDisplayUsername, isValidPlatform } from "@/utils/dataHelpers";

type LoadState = "loading" | "success" | "not-found";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();

  if (!username) {
    return (
      <PageShell>
        <EmptyState
          icon={<ShieldAlert className="w-10 h-10" />}
          title="Invalid profile"
          description="No username was provided in the URL."
          action={<BackLink />}
        />
      </PageShell>
    );
  }

  // Remounting on username change (via `key`) gives each profile page its
  // own fresh "loading" state automatically, instead of resetting state
  // manually inside an effect body (which would mean an unconditional
  // synchronous setState on every effect run).
  return <ProfileDetailContent key={username} username={username} />;
}

function ProfileDetailContent({ username }: { username: string }) {
  const [searchParams] = useSearchParams();
  const rawPlatform = searchParams.get("platform");
  const platform: Platform = isValidPlatform(rawPlatform) ? rawPlatform : "instagram";

  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [status, setStatus] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    loadProfileByUsername(username).then((data) => {
      if (cancelled) return;
      setProfileData(data);
      setStatus(data ? "success" : "not-found");
    });

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (status === "loading") {
    return (
      <PageShell>
        <BackLink className="mb-4" />
        <div className="flex gap-4 items-start">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (status === "not-found" || !profileData) {
    return (
      <PageShell>
        <BackLink className="mb-4" />
        <EmptyState
          icon={<ShieldAlert className="w-10 h-10" />}
          title="Profile details unavailable"
          description={`We don't have detailed data for @${username} yet.`}
          action={<BackLink />}
        />
      </PageShell>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const displayUsername = getDisplayUsername(user);

  return (
    <PageShell>
      <BackLink className="mb-4" />

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Avatar src={user.picture} alt={user.fullname} size={88} />

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-[var(--text-h)] flex items-center gap-1">
                @{displayUsername}
                <VerifiedBadge verified={user.is_verified} />
              </h1>
              <p className="text-[var(--text)]">{user.fullname}</p>
              <p className="text-xs text-[var(--text)] mt-1 capitalize">Platform: {platform}</p>
            </div>

            <AddToListButton profile={user} platform={platform} size="md" />
          </div>

          {user.description && (
            <p className="mt-3 text-sm text-[var(--text)] leading-relaxed">{user.description}</p>
          )}

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              label="Followers"
              value={formatCount(user.followers)}
              icon={<Users className="w-3.5 h-3.5" />}
            />
            <StatCard
              label="Engagement rate"
              value={formatEngagementRate(user.engagement_rate)}
              icon={<TrendingUp className="w-3.5 h-3.5" />}
            />
            {user.posts_count !== undefined && (
              <StatCard label="Posts" value={formatCount(user.posts_count)} />
            )}
            {user.avg_likes !== undefined && (
              <StatCard
                label="Avg likes"
                value={formatCount(user.avg_likes)}
                icon={<Heart className="w-3.5 h-3.5" />}
              />
            )}
            {user.avg_comments !== undefined && (
              <StatCard
                label="Avg comments"
                value={formatCount(user.avg_comments)}
                icon={<MessageCircle className="w-3.5 h-3.5" />}
              />
            )}
            {user.avg_views !== undefined && user.avg_views > 0 && (
              <StatCard
                label="Avg views"
                value={formatCount(user.avg_views)}
                icon={<Eye className="w-3.5 h-3.5" />}
              />
            )}
            {user.engagements !== undefined && (
              <StatCard label="Engagements" value={formatCount(user.engagements)} />
            )}
          </div>

          {user.url && (
            <a
              href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-5 text-[var(--accent)] text-sm font-medium hover:underline"
            >
              View on platform
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </PageShell>
  );
}

