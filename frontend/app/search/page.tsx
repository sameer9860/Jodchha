import Link from "next/link";

import { getSearchResults } from "@/lib/api";
import type { Website } from "@/lib/types";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  let websites: Website[] = [];

  if (query) {
    websites = await getSearchResults(query);
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
        >
          ← Back to Jodchha
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
            Search
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
            {query ? `Results for "${query}"` : "Search Jodchha"}
          </h1>

          {query && (
            <p className="mt-2 text-[var(--muted)]">
              {websites.length}{" "}
              {websites.length === 1 ? "website" : "websites"} found.
            </p>
          )}
        </div>

        {!query ? (
          <p className="mt-10 text-[var(--muted)]">
            Enter a search term to discover useful websites.
          </p>
        ) : websites.length === 0 ? (
          <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--white)] p-8 text-center">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              No results found
            </h2>

            <p className="mt-2 text-[var(--muted)]">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {websites.map((website) => (
              <article
                key={website.id}
                className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--white)] p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl"
                    aria-hidden="true"
                  >
                    {website.category.icon || "🔗"}
                  </span>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                    {website.category.name}
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
                  {website.name}
                </h2>

                <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">
                  {website.description}
                </p>

                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
                >
                  Visit Website
                  <span className="ml-2">→</span>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
