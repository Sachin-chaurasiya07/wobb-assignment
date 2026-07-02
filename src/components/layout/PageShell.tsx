import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { AmbientGlow } from "@/components/layout/AmbientGlow";

interface PageShellProps {
  children: ReactNode;
}

/**
 * Top-level page wrapper: sticky header + centered content column.
 * Individual pages own their own heading markup so each can set the
 * right heading level/copy for that screen.
 */
export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] relative">
      <AmbientGlow />
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
