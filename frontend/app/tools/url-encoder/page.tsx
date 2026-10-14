import type { Metadata } from "next";
import Link from "next/link";

import SiteShell from "@/components/layout/SiteShell";
import UrlEncoder from "@/components/tools/UrlEncoder";

export const metadata: Metadata = {
  title: "URL Encoder & Decoder",
  description:
    "Encode and decode URL components and query parameters online for free with Jodchha.",
};

export default function UrlEncoderPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <Link
          href="/tools"
          className="text-sm font-semibold text-[var(--primary)] hover:underline"
        >
          ← All Tools
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
            Free Developer Tool
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            URL Encoder & Decoder
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Encode special characters for URL components or decode percent-encoded
            text. Useful for query parameters, API development, and debugging.
          </p>
        </div>

        <UrlEncoder />
      </main>
    </SiteShell>
  );
}
