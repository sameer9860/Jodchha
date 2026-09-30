const tools = [
  {
    name: "QR Code Generator",
    description: "Create a QR code from a website URL or text.",
    icon: "▦",
    status: "Available Soon",
  },
  {
    name: "URL Shortener",
    description: "Create a shorter, shareable link from a long URL.",
    icon: "↗",
    status: "Available Soon",
  },
  {
    name: "File Converter",
    description: "Convert common files between useful formats.",
    icon: "⇄",
    status: "Coming Soon",
  },
];

export default function ToolGrid() {
  return (
    <section id="tools" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
          Tools
        </p>

        <h2 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
          Useful Online Tools
        </h2>

        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Simple tools that help you get everyday tasks done faster.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tools.map((tool) => (
          <article
            key={tool.name}
            className="group rounded-xl border border-[var(--border)] bg-[var(--white)] p-6 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl font-semibold text-[var(--accent)]"
              >
                {tool.icon}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-[var(--muted)]">
                {tool.status}
              </span>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
              {tool.name}
            </h3>

            <p className="mt-2 leading-6 text-[var(--muted)]">
              {tool.description}
            </p>

            <button
              type="button"
              disabled
              className="mt-6 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
            >
              Open Tool
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
