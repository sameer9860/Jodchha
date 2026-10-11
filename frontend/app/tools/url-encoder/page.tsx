import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import UrlEncoder from "@/components/tools/UrlEncoder";

export const metadata = {
  title: "URL Encoder & Decoder",
  description:
    "Encode and decode URL components and query parameters online for free with Jodchha.",
};

export default function UrlEncoderPage() {
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
