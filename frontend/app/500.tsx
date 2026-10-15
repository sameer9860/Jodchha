"use client";

import Link from "next/link";

export default function InternalServerErrorPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
        500
      </p>
      <h1 className="mt-4 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
        Internal server error
      </h1>
      <p className="mt-4 max-w-md text-[var(--muted)]">
        Something went wrong on our side. Please try again in a moment.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-slate-50"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
