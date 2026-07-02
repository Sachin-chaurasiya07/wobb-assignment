import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[var(--code-bg)]", className)}
      aria-hidden="true"
    />
  );
}
