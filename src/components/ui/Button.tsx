import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  // Solid pink -> purple gradient fill, the "Get started" treatment.
  primary:
    "bg-[image:var(--gradient)] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(192,132,252,0.35)] disabled:bg-[var(--border)] disabled:bg-none disabled:text-[var(--text)] disabled:shadow-none",
  secondary:
    "bg-[var(--accent-bg)] text-[var(--accent)] hover:bg-[var(--accent-border)]/20 border border-[var(--accent-border)]",
  // Gradient-bordered pill on a transparent/dark fill, the "Ecosystems" /
  // outlined-CTA treatment from the reference.
  outline:
    "bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-h)] hover:border-[var(--accent-border)] hover:text-white",
  ghost: "bg-transparent text-[var(--text-h)] hover:bg-[var(--code-bg)]",
  danger: "bg-transparent text-red-400 hover:bg-red-500/10 border border-red-500/30",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
