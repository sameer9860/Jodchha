import type { Metadata } from "next";
import Link from "next/link";

import SiteShell from "@/components/layout/SiteShell";
import WordCounter from "@/components/tools/WordCounter";

export const metadata: Metadata = {
  title: "Word & Character Counter",
  description:
    "Count words, characters, sentences, and paragraphs instantly with Jodchha's free online word counter.",
};

export default function WordCounterPage() {
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
            Free Online Tool
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            Word & Character Counter
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Count words, characters, sentences, and paragraphs instantly. Useful
            for assignments, essays, articles, and job applications.
          </p>
        </div>

        <WordCounter />
      </main>
    </SiteShell>
  );
}
