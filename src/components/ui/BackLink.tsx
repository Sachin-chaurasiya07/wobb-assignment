import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  className?: string;
  /** Defaults to the search dashboard. */
  to?: string;
  label?: string;
}

export function BackLink({ className, to = "/", label = "Back to search" }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md ${className ?? ""}`}
    >
      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
