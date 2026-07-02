import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
  className?: string;
}

export function VerifiedBadge({ verified, className }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      className={`inline-flex items-center text-[var(--accent)] ${className ?? ""}`}
      role="img"
      aria-label="Verified account"
      title="Verified account"
    >
      <BadgeCheck className="w-4 h-4" fill="currentColor" stroke="var(--bg)" strokeWidth={2} />
    </span>
  );
}
