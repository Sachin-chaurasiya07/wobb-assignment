import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-[var(--text)] uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className="text-lg font-semibold text-[var(--text-h)]">{value}</div>
    </Card>
  );
}
