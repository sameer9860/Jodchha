import Link from "next/link";

import QrCodeForm from "@/components/tools/QrCodeForm";

export const metadata = {
  title: "QR Code Generator",
  description:
    "Create and download QR codes for URLs and text with Jodchha.",
};

export default function QrCodePage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
        >
          ← Back to Jodchha
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
          Jodchha Tool
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[var(--foreground)]">
          QR Code Generator
        </h1>

        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          Create a QR code from any URL or text and download it as a PNG image.
        </p>

        <div className="mt-10">
          <QrCodeForm />
        </div>
      </div>
    </main>
  );
}
