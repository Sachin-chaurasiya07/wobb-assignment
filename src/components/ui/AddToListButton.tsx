import { Check, ListPlus, X } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { useSelectionStore } from "@/store/useSelectionStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface AddToListButtonProps {
  platform: Platform;
  profile: UserProfileSummary;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Stop the click from bubbling to a parent (e.g. a clickable card). */
  stopPropagation?: boolean;
}

export function AddToListButton({
  platform,
  profile,
  size = "sm",
  className,
  stopPropagation,
}: AddToListButtonProps) {
  const isSelected = useSelectionStore((state) => state.isSelected(platform, profile));
  const toggleProfile = useSelectionStore((state) => state.toggleProfile);

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    toggleProfile(platform, profile);
  };

  return (
    <Button
      type="button"
      size={size}
      variant={isSelected ? "secondary" : "outline"}
      onClick={handleClick}
      className={cn("shrink-0", className)}
      aria-pressed={isSelected}
      aria-label={isSelected ? "Remove from your list" : "Add to your list"}
    >
      {isSelected ? (
        <>
          <Check className="w-4 h-4" aria-hidden="true" />
          Added
        </>
      ) : (
        <>
          <ListPlus className="w-4 h-4" aria-hidden="true" />
          Add to list
        </>
      )}
    </Button>
  );
}

/** Compact icon-only remove button used inside the saved-list page. */
export function RemoveFromListButton({
  entryKey,
  label,
}: {
  entryKey: string;
  label: string;
}) {
  const removeProfile = useSelectionStore((state) => state.removeProfile);
  return (
    <button
      type="button"
      onClick={() => removeProfile(entryKey)}
      aria-label={`Remove ${label} from your list`}
      className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--text)] hover:bg-red-500/10 hover:text-red-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <X className="w-4 h-4" />
    </button>
  );
}
