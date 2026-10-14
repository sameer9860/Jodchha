import type { Metadata } from "next";
import Link from "next/link";

import SiteShell from "@/components/layout/SiteShell";
import PasswordGenerator from "@/components/tools/PasswordGenerator";

export const metadata: Metadata = {
  title: "Secure Password Generator",
  description:
    "Generate random passwords in your browser with adjustable length and character options using Jodchha's free password generator.",
};

export default function PasswordGeneratorPage() {
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
            Free Security Tool
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            Password Generator
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Generate random passwords with adjustable length and character types.
            Password generation happens locally in your browser.
          </p>
        </div>

        <PasswordGenerator />
      </main>
    </SiteShell>
  );
}
