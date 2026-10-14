import type { Metadata } from "next";
import Link from "next/link";

import ShortenerForm from "@/components/tools/ShortenerForm";
import SiteShell from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "URL Shortener",
  description:
    "Create short, shareable URLs with Jodchha's free URL shortener.",
};

export default function ShortenerPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/tools"
          className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
        >
          ← Back to Tools
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
            Jodchha Tool
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[var(--foreground)]">
            URL Shortener
          </h1>

          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
            Turn long URLs into shorter, shareable links.
          </p>
        </div>

        <div className="mt-10">
          <ShortenerForm />
        </div>
      </main>
    </SiteShell>
  );
}
