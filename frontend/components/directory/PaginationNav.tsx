import Link from "next/link";

type PaginationNavProps = {
  page: number;
  count: number;
  pageSize?: number;
  hrefForPage: (page: number) => string;
};

export default function PaginationNav({
  page,
  count,
  pageSize = 12,
  hrefForPage,
}: PaginationNavProps) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-3"
      aria-label="Pagination"
    >
      {page > 1 ? (
        <Link
          href={hrefForPage(page - 1)}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-slate-50"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-[var(--muted)]">
          Previous
        </span>
      )}

      <p className="text-sm text-[var(--muted)]">
        Page {page} of {totalPages}
      </p>

      {page < totalPages ? (
        <Link
          href={hrefForPage(page + 1)}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-slate-50"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-[var(--muted)]">
          Next
        </span>
      )}
    </nav>
  );
}
