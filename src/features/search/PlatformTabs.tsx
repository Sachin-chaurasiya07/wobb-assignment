import { Instagram, Youtube } from "lucide-react";
import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { cn } from "@/lib/cn";

const icons: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4" aria-hidden="true" />,
  youtube: <Youtube className="w-4 h-4" aria-hidden="true" />,
  // lucide has no dedicated TikTok glyph; a music-note stands in cleanly.
  tiktok: <TikTokGlyph />,
};

function TikTokGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.6 5.82a4.28 4.28 0 0 1-2.6-2.28h-2.8v11.6a2.3 2.3 0 1 1-1.63-2.2v-2.9a5.2 5.2 0 1 0 4.43 5.15V9.34a6.9 6.9 0 0 0 4.2 1.43V7.9a4.28 4.28 0 0 1-1.6-.35 4.3 4.3 0 0 1 0-1.73Z" />
    </svg>
  );
}

interface PlatformTabsProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  counts: Record<Platform, number>;
}

export function PlatformTabs({ selected, onChange, counts }: PlatformTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter by platform"
      className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
    >
      {PLATFORMS.map((p) => {
        const isActive = selected === p;
        return (
          <button
            key={p}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(p)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
              isActive
                ? "bg-[image:var(--gradient)] text-white border-transparent shadow-[0_0_20px_rgba(192,132,252,0.25)]"
                : "bg-[var(--bg-elevated)] text-[var(--text-h)] border-[var(--border)] hover:border-[var(--accent-border)]"
            )}
          >
            {icons[p]}
            {getPlatformLabel(p)}
            <span
              className={cn(
                "text-xs rounded-full px-1.5 py-0.5",
                isActive ? "bg-white/20" : "bg-[var(--code-bg)] text-[var(--text)]"
              )}
            >
              {counts[p]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
