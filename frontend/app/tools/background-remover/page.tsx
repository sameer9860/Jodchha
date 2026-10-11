import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import BackgroundRemover from "@/components/tools/BackgroundRemover";

export const metadata = {
  title: "Background Remover",
  description:
    "Remove solid backgrounds from product and portrait photos directly in the browser with Jodchha's free online background remover.",
};

export default function BackgroundRemoverPage() {
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
              Free Image Tool
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              Background Remover
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
              Remove a solid background from your image in the browser and
              download the result as a transparent PNG.
            </p>
          </div>

          <div className="mt-8">
            <BackgroundRemover />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
