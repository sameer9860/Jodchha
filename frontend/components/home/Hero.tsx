import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--white)]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
            Jodchha
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
            Connect. Discover. Go.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Find useful websites, online services, and tools from one simple
            place.
          </p>

          <SearchBar />

          <p className="mt-4 text-sm text-[var(--muted)]">
            Try searching for government services, jobs, education, finance,
            or technology.
          </p>
        </div>
      </div>
    </section>
  );
}
