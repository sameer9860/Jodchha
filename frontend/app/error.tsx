"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--white)] p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
          Error
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[var(--foreground)]">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          We could not load this page right now. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-slate-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
