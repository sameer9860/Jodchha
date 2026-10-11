import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const tools = [
  {
    name: "URL Shortener",
    description: "Create a shorter, shareable link from a long URL.",
    icon: "↗",
    status: "Available",
    href: "/tools/shortener",
  },
  {
    name: "QR Code Generator",
    description: "Create a QR code from a website URL or any text.",
    icon: "▦",
    status: "Available",
    href: "/tools/qr-code",
  },
  {
    name: "File Converter",
    description: "Convert PNG, JPEG, and WebP images directly in the browser.",
    icon: "⇄",
    status: "Available",
    href: "/tools/file-converter",
  },
  {
    name: "Word & Character Counter",
    description: "Count words, characters, sentences, and paragraphs instantly.",
    icon: "Aa",
    status: "Available",
    href: "/tools/word-counter",
  },
  {
    name: "JSON Formatter & Validator",
    description: "Format, validate, and minify JSON directly in your browser.",
    icon: "{ }",
    status: "Available",
    href: "/tools/json-formatter",
  },
];

export const metadata = {
  title: "Online Tools",
  description:
    "Useful online tools including URL shortener and QR code generator.",
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
        >
          ← Back to Jodchha
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
            Jodchha Tools
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[var(--foreground)]">
            Useful Online Tools
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Simple, practical tools to help you get things done faster.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const content = (
              <>
                <div className="flex items-start justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl"
                    aria-hidden="true"
                  >
                    {tool.icon}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      tool.href
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-[var(--muted)]"
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[var(--foreground)]">
                  {tool.name}
                </h2>

                <p className="mt-2 leading-7 text-[var(--muted)]">
                  {tool.description}
                </p>

                {tool.href && (
                  <span className="mt-5 inline-flex font-semibold text-[var(--primary)]">
                    Open Tool →
                  </span>
                )}
              </>
            );

            if (tool.href) {
              return (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={tool.name}
                className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6"
              >
                {content}
              </div>
            );
          })}
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
