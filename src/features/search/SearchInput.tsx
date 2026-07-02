import { useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export function SearchInput({ value, onChange, placeholder, id = "profile-search" }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        Search by username or full name
      </label>

      {/* This used to be a bare decorative icon with no handler, so
          clicking it did nothing -- it's now a real button that focuses
          the field, which is the behavior people expect from a search
          icon at the start of an input. */}
      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        aria-label="Focus search"
        tabIndex={-1}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full text-[var(--text)] hover:text-[var(--text-h)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <Search className="w-4 h-4" aria-hidden="true" />
      </button>

      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search by username or name..."}
        className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] pl-11 pr-10 py-3 text-sm text-[var(--text-h)] placeholder:text-[var(--text)]/70 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent)] transition-shadow"
        autoComplete="off"
        // Belt-and-braces client-side hardening: cap length so a pasted
        // multi-MB string can't be used to hang the filter/render loop.
        maxLength={200}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full text-[var(--text)] hover:bg-[var(--code-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
