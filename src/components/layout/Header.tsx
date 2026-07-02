import { Link, useLocation } from "react-router-dom";
import { ListChecks, Search } from "lucide-react";
import { useSelectionStore, selectCount } from "@/store/useSelectionStore";
import { cn } from "@/lib/cn";

export function Header() {
  const count = useSelectionStore(selectCount);
  const location = useLocation();
  const isListPage = location.pathname === "/list";

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-[var(--text-h)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md"
          style={{ fontFamily: "var(--heading)" }}
        >
          <img src="/wobb-logo.png" alt="Wobb" className="w-8 h-8 rounded-full" width={32} height={32} />
          <span>Wobb</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Primary">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
              !isListPage
                ? "bg-[var(--accent-bg)] text-[var(--text-h)]"
                : "text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)]"
            )}
            aria-current={!isListPage ? "page" : undefined}
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </Link>

          <Link
            to="/list"
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
              isListPage
                ? "bg-[var(--accent-bg)] text-[var(--text-h)]"
                : "text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)]"
            )}
            aria-current={isListPage ? "page" : undefined}
          >
            <ListChecks className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">My List</span>
            {count > 0 && (
              <span
                className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-[image:var(--gradient)] text-white text-xs font-semibold"
                aria-label={`${count} profiles saved`}
              >
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
