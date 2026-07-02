import { useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, Megaphone, Pencil, Trash2, Users } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { PageShell } from "@/components/layout/PageShell";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { RemoveFromListButton } from "@/components/ui/AddToListButton";
import { useSelectionStore, selectSavedList } from "@/store/useSelectionStore";
import { formatCount } from "@/utils/formatters";
import { getPlatformLabel } from "@/utils/dataHelpers";
import type { Platform } from "@/types";

export function ListPage() {
  // selectSavedList returns a *new* array every call (Object.values +
  // sort). useSyncExternalStore compares snapshots by reference, so
  // without useShallow this would re-render in an infinite loop the
  // moment there's any data to sort. useShallow does an element-wise
  // comparison instead, so the hook only re-renders when the actual
  // list of entries changes.
  const savedList = useSelectionStore(useShallow(selectSavedList));
  const campaignName = useSelectionStore((state) => state.campaignName);
  const clearAll = useSelectionStore((state) => state.clearAll);

  const totalReach = savedList.reduce((sum, entry) => sum + entry.followers, 0);
  const platformCounts = savedList.reduce(
    (acc, entry) => {
      acc[entry.platform] = (acc[entry.platform] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<Platform, number>>
  );

  return (
    <PageShell>
      <BackLink className="mb-4" />

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <CampaignNameHeading campaignName={campaignName} />

        {savedList.length > 0 && (
          <Button variant="danger" size="sm" onClick={clearAll}>
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            Clear all
          </Button>
        )}
      </div>

      {savedList.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="w-10 h-10" />}
          title="Your list is empty"
          description="Browse profiles and tap “Add to list” to shortlist influencers for a campaign."
          action={
            <Link to="/">
              <Button variant="primary" size="sm">
                Browse profiles
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text)] uppercase tracking-wide">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                Profiles
              </div>
              <div className="text-lg font-semibold text-[var(--text-h)]">
                {savedList.length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text)] uppercase tracking-wide">
                <Megaphone className="w-3.5 h-3.5" aria-hidden="true" />
                Est. reach
              </div>
              <div className="text-lg font-semibold text-[var(--text-h)]">
                {formatCount(totalReach)}
              </div>
            </Card>
            {(["instagram", "youtube", "tiktok"] as const)
              .filter((p) => platformCounts[p])
              .slice(0, 2)
              .map((p) => (
                <Card key={p} className="p-4">
                  <div className="text-xs text-[var(--text)] uppercase tracking-wide">
                    {getPlatformLabel(p)}
                  </div>
                  <div className="text-lg font-semibold text-[var(--text-h)]">
                    {platformCounts[p]}
                  </div>
                </Card>
              ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
            {savedList.map((entry) => (
              <Card key={entry.key} role="listitem" className="flex items-center gap-3 p-4">
                <Avatar src={entry.picture} alt={entry.fullname} size={52} />
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-1 font-semibold text-[var(--text-h)] truncate">
                    <span className="truncate">@{entry.username ?? entry.displayName}</span>
                    <VerifiedBadge verified={entry.is_verified} />
                  </div>
                  <div className="text-sm text-[var(--text)] truncate">{entry.fullname}</div>
                  <div className="text-xs text-[var(--text)] mt-0.5 flex items-center gap-2">
                    <span>{formatCount(entry.followers)} followers</span>
                    <span aria-hidden="true">·</span>
                    <span>{getPlatformLabel(entry.platform)}</span>
                  </div>
                </div>
                <RemoveFromListButton
                  entryKey={entry.key}
                  label={entry.username ?? entry.displayName}
                />
              </Card>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}

/** Campaign name shown as a heading, editable inline via a pencil toggle. */
function CampaignNameHeading({ campaignName }: { campaignName: string }) {
  const setCampaignName = useSelectionStore((state) => state.setCampaignName);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(campaignName);

  const commit = () => {
    setCampaignName(draft);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div>
        <label htmlFor="campaign-name" className="sr-only">
          Campaign name
        </label>
        <input
          id="campaign-name"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(campaignName);
              setIsEditing(false);
            }
          }}
          maxLength={80}
          className="text-2xl sm:text-3xl font-semibold text-[var(--text-h)] bg-transparent border-b-2 border-[var(--accent)] outline-none mb-1 w-full max-w-md"
          style={{ fontFamily: "var(--heading)" }}
        />
        <p className="text-[var(--text)] text-sm">Press Enter to save.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="group flex items-center gap-2 mb-1">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-gradient"
          style={{ fontFamily: "var(--heading)" }}
        >
          {campaignName}
        </h1>
        <button
          type="button"
          onClick={() => {
            setDraft(campaignName);
            setIsEditing(true);
          }}
          aria-label={`Edit campaign name, currently "${campaignName}"`}
          className="flex items-center justify-center w-7 h-7 rounded-full text-[var(--text)] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-[var(--code-bg)] hover:text-[var(--text-h)] transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
      <p className="text-[var(--text)] text-sm">
        Build your shortlist for this campaign. Persists across page refreshes.
      </p>
    </div>
  );
}
