import type { Metadata } from "next";
import Link from "next/link";

import SiteShell from "@/components/layout/SiteShell";
import JsonFormatter from "@/components/tools/JsonFormatter";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description:
    "Format, validate, and minify JSON online for free with Jodchha. Check JSON syntax directly in your browser.",
};

export default function JsonFormatterPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
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
            JSON Formatter & Validator
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">
            Format readable JSON, minify it for compact output, and validate
            JSON syntax with clear error messages. No account or upload required.
          </p>
        </div>

        <JsonFormatter />
      </main>
    </SiteShell>
  );
}
