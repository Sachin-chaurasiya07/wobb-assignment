import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && (
        <div className="mb-4 text-[var(--text)] opacity-60" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-h)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--text)] max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
