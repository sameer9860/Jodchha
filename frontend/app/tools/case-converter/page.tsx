import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CaseConverter from "@/components/tools/CaseConverter";

export const metadata = {
  title: "Text Case Converter",
  description:
    "Convert text to uppercase, lowercase, Title Case, Sentence case, and alternating case with Jodchha's free online tool.",
};

export default function CaseConverterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
          <Link
            href="/tools"
            className="text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            ← All Tools
          </Link>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
              Free Writing Tool
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              Text Case Converter
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
              Quickly change text capitalization for documents, assignments,
              articles, headings, and social media posts.
            </p>
          </div>

          <CaseConverter />
        </div>
      </main>

      <Footer />
    </div>
  );
}
