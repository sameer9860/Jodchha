import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getCategories,
  getCategoryWebsites,
  getWebsiteRedirectUrl,
} from "@/lib/api";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return {
      title: "Category Not Found | Jodchha",
      description: "The requested category could not be found.",
    };
  }

  return {
    title: `${category.name} | Jodchha`,
    description:
      category.description ||
      `Explore ${category.name} websites and useful services on Jodchha.`,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | Jodchha`,
      description:
        category.description ||
        `Browse ${category.name} websites and resources on Jodchha.`,
      url: `/categories/${category.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const [categories, websites] = await Promise.all([
    getCategories(),
    getCategoryWebsites(slug),
  ]);

  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Jodchha",
        item: "https://jodchha.com.np",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `https://jodchha.com.np/categories/${category.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
        >
          ← Back to Jodchha
        </Link>

        <div className="mt-8">
          <span className="text-4xl" aria-hidden="true">
            {category.icon || "🔗"}
          </span>

          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
            Category
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[var(--foreground)]">
            {category.name}
          </h1>

          <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            {category.description}
          </p>

          <p className="mt-3 text-sm text-[var(--muted)]">
            {websites.length}{" "}
            {websites.length === 1 ? "website" : "websites"} available.
          </p>
        </div>

        {websites.length === 0 ? (
          <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--white)] p-8 text-center">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              No websites yet
            </h2>

            <p className="mt-2 text-[var(--muted)]">
              We are adding useful websites to this category.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {websites.map((website) => (
              <a
                key={website.id}
                href={getWebsiteRedirectUrl(website.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--white)] p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl"
                    aria-hidden="true"
                  >
                    {website.category.icon || "🔗"}
                  </span>

                  {website.is_featured && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                      Featured
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
                  {website.name}
                </h2>

                <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">
                  {website.description}
                </p>

                <span className="mt-6 inline-flex items-center font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]">
                  Visit Website
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
