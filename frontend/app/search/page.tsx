import type { Metadata } from "next";
import Link from "next/link";

import PaginationNav from "@/components/directory/PaginationNav";
import WebsiteCard from "@/components/directory/WebsiteCard";
import SearchBar from "@/components/home/SearchBar";
import SiteShell from "@/components/layout/SiteShell";
import { ApiError, getSearchResults } from "@/lib/api";
import type { Paginated, Website } from "@/lib/types";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  return {
    title: query ? `Search results for "${query}"` : "Search",
    description: query
      ? `Search results for "${query}" on Jodchha.`
      : "Search useful websites, online services, and tools on Jodchha.",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  let results: Paginated<Website> = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  let searchError = "";

  if (query) {
    try {
      results = await getSearchResults(query, page);
    } catch (error) {
      searchError =
        error instanceof ApiError
          ? error.message
          : "Unable to search right now. Please try again.";
    }
  }

  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-6 py-16">
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

          <SearchBar initialQuery={query} className="mt-6 w-full max-w-2xl" />

          {query && !searchError && (
            <p className="mt-4 text-[var(--muted)]">
              {results.count}{" "}
              {results.count === 1 ? "website" : "websites"} found.
            </p>
          )}
        </div>

        {searchError ? (
          <div
            role="alert"
            className="mt-10 rounded-xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Search unavailable
            </h2>
            <p className="mt-2 text-[var(--muted)]">{searchError}</p>
          </div>
        ) : !query ? (
          <p className="mt-10 text-[var(--muted)]">
            Enter a search term to discover useful websites.
          </p>
        ) : results.results.length === 0 ? (
          <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--white)] p-8 text-center">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              No results found
            </h2>

            <p className="mt-2 text-[var(--muted)]">
              Try a different search term, or{" "}
              <Link
                href="/#categories"
                className="font-semibold text-[var(--primary)]"
              >
                browse categories
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.results.map((website) => (
                <WebsiteCard key={website.id} website={website} />
              ))}
            </div>
            <PaginationNav
              page={page}
              count={results.count}
              hrefForPage={(nextPage) =>
                `/search?q=${encodeURIComponent(query)}&page=${nextPage}`
              }
            />
          </>
        )}
      </main>
    </SiteShell>
  );
}
