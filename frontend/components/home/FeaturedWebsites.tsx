import type { Website } from "@/lib/types";

type FeaturedWebsitesProps = {
  websites: Website[];
};

export default function FeaturedWebsites({
  websites,
}: FeaturedWebsitesProps) {
  return (
    <section id="discover" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
          Discover
        </p>

        <h2 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
          Featured Websites
        </h2>

        <p className="mt-2 text-[var(--muted)]">
          Explore useful websites and online services from one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {websites.map((website) => (
          <article
            key={website.id}
            className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--white)] p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl"
                aria-hidden="true"
              >
                {website.category.icon || "🔗"}
              </span>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                {website.category.name}
              </span>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
              {website.name}
            </h3>

            <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">
              {website.description}
            </p>

            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center font-semibold text-[var(--primary)] transition hover:text-[var(--primary-dark)]"
            >
              Visit Website
              <span className="ml-2 transition group-hover:translate-x-1">
                →
              </span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}