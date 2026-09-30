import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
              Jodchha
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
              Connect. Discover. Go.
            </h1>

            <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
              Discover useful websites, online services, and tools from one
              simple place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#discover"
                className="rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-dark)]"
              >
                Explore Websites
              </a>

              <a
                href="#tools"
                className="rounded-lg border border-[var(--border)] bg-[var(--white)] px-6 py-3 font-semibold text-[var(--foreground)] transition hover:bg-slate-50"
              >
                Explore Tools
              </a>
            </div>
          </div>
        </section>

        <section
          id="discover"
          className="mx-auto max-w-6xl px-6 py-16"
        >
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Discover
          </h2>

          <p className="mt-2 text-[var(--muted)]">
            Useful websites and online services, organized in one place.
          </p>
        </section>

        <section
          id="tools"
          className="mx-auto max-w-6xl px-6 py-16"
        >
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Tools
          </h2>

          <p className="mt-2 text-[var(--muted)]">
            Simple online tools designed to make everyday tasks easier.
          </p>
        </section>

        <section
          id="categories"
          className="mx-auto max-w-6xl px-6 py-16"
        >
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Categories
          </h2>

          <p className="mt-2 text-[var(--muted)]">
            Browse websites by category.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}