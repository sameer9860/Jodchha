import Link from "next/link";

const tools = [
  {
    name: "QR Code Generator",
    description: "Create a QR code from a website URL or text.",
    icon: "▦",
    status: "Available",
    href: "/tools/qr-code",
  },
  {
    name: "URL Shortener",
    description: "Create a shorter, shareable link from a long URL.",
    icon: "↗",
    status: "Available",
    href: "/shortener",
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
  {
    name: "URL Encoder & Decoder",
    description: "Encode and decode URL components and query parameters.",
    icon: "% ",
    status: "Available",
    href: "/tools/url-encoder",
  },
  {
    name: "Password Generator",
    description: "Generate random passwords with customizable length and character options.",
    icon: "🔐",
    status: "Available",
    href: "/tools/password-generator",
  },
];

export default function ToolGrid() {
  return (
    <section
      id="tools"
      className="border-t border-[var(--border)] bg-[var(--white)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
            Tools
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
            Useful Tools
          </h2>

          <p className="mt-2 text-[var(--muted)]">
            Simple tools to help you get things done faster.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${tool.href
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-[var(--muted)]"
                      }`}
                  >
                    {tool.status}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
                  {tool.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
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
                  className="rounded-xl border border-[var(--border)] bg-[var(--white)] p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={tool.name}
                className="rounded-xl border border-[var(--border)] bg-[var(--white)] p-6"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}