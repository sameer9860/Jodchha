export default function SearchBar() {
  return (
    <div className="mt-8 w-full max-w-2xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="search"
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
          type="button"
          className="h-14 rounded-xl bg-[var(--primary)] px-7 font-semibold text-white transition hover:bg-[var(--primary-dark)]"
        >
          Search
        </button>
      </div>
    </div>
  );
}
