import WebsiteCard from "@/components/directory/WebsiteCard";
import type { Website } from "@/lib/types";

type FeaturedWebsitesProps = {
  websites: Website[];
};

export default function FeaturedWebsites({
  websites,
}: FeaturedWebsitesProps) {
  return (
    <section id="discover" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
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

      {websites.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--white)] p-8 text-center">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            No featured websites yet
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Featured listings will appear here once they are added.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {websites.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              badge={website.category.name}
            />
          ))}
        </div>
      )}
    </section>
  );
}
