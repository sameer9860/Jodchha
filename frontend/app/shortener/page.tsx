import ShortenerForm from "@/components/tools/ShortenerForm";

export default function ShortenerPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
          Jodchha Tool
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[var(--foreground)]">
          URL Shortener
        </h1>

        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          Turn long URLs into shorter, shareable links.
        </p>

        <div className="mt-10">
          <ShortenerForm />
        </div>
      </div>
    </main>
  );
}
