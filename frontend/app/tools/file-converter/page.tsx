import type { Metadata } from "next";
import Link from "next/link";

import SiteShell from "@/components/layout/SiteShell";
import FileConverterForm from "@/components/tools/FileConverterForm";

export const metadata: Metadata = {
  title: "Image File Converter",
  description:
    "Convert PNG, JPEG, and WebP images directly in your browser with Jodchha.",
};

export default function FileConverterPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-5xl px-6 py-16">
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
        </div>

        <h1 className="mt-2 text-4xl font-bold text-[var(--foreground)]">
          Image File Converter
        </h1>

        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          Upload an image, convert it between PNG, JPEG, and WebP, and
          download the result without leaving your browser.
        </p>

        <div className="mt-10">
          <FileConverterForm />
        </div>
      </main>
    </SiteShell>
  );
}
