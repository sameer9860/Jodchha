import Link from "next/link";

import SiteShell from "@/components/layout/SiteShell";

export default function NotFoundPage() {
  return (
    <SiteShell>
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-[var(--muted)]">
          The page you are looking for does not exist or may have moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
          >
            Back to home
          </Link>
          <Link
            href="/tools"
            className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-slate-50"
          >
            Browse tools
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
