"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 w-full max-w-2xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search websites, services, or tools..."
            aria-label="Search websites, services, or tools"
            className="h-14 w-full rounded-xl border border-[var(--border)] bg-[var(--white)] px-5 pr-12 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          >
            ⌕
          </span>
        </div>

        <button
          type="submit"
          className="h-14 rounded-xl bg-[var(--primary)] px-7 font-semibold text-white transition hover:bg-[var(--primary-dark)]"
        >
          Search
        </button>
      </div>
    </form>
  );
}