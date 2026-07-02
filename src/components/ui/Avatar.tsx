import { useState } from "react";
import { cn } from "@/lib/cn";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

/**
 * Profile pictures come from an external proxy and occasionally fail to
 * load. Rather than showing a broken-image icon, fall back to a neutral
 * initial avatar so the layout never looks broken.
 */
export function Avatar({ src, alt, size = 48, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const initial = alt.trim().charAt(0).toUpperCase() || "?";

  if (failed || !src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-[var(--accent-bg)] text-[var(--accent)] font-semibold shrink-0",
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        role="img"
        aria-label={alt}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("rounded-full object-cover shrink-0 bg-[var(--code-bg)]", className)}
      style={{ width: size, height: size }}
    />
  );
}
