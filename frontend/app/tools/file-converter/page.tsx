import Link from "next/link";

import FileConverterForm from "@/components/tools/FileConverterForm";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Image File Converter",
  description:
    "Convert PNG, JPEG, and WebP images directly in your browser with Jodchha.",
};

export default function FileConverterPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-16">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
