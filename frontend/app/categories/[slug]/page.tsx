import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import PaginationNav from "@/components/directory/PaginationNav";
import WebsiteCard from "@/components/directory/WebsiteCard";
import SiteShell from "@/components/layout/SiteShell";
import {
  ApiError,
  getCategories,
  getCategoryWebsites,
} from "@/lib/api";
import type { Category, Paginated, Website } from "@/lib/types";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const categories = await getCategories();
    const category = categories.find((item) => item.slug === slug);

    if (!category) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found.",
      };
    }

    return {
      title: category.name,
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
  } catch {
    return {
      title: "Category",
      description: "Browse websites by category on Jodchha.",
    };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);

  let categories: Category[] = [];
  let websites: Paginated<Website> = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  let loadError = "";

  try {
    [categories, websites] = await Promise.all([
      getCategories(),
      getCategoryWebsites(slug, page),
    ]);
  } catch (error) {
    loadError =
      error instanceof ApiError
        ? error.message
        : "Unable to load this category right now. Please try again.";
  }

  const category = categories.find((item) => item.slug === slug);

  if (!loadError && !category) {
    notFound();
  }

  const breadcrumbData = category
    ? {
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
      }
    : null;

  return (
    <SiteShell>
      {breadcrumbData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData),
          }}
        />
      )}

      <main className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/#categories"
          className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
        >
          ← All categories
        </Link>

        {loadError || !category ? (
          <div
            role="alert"
            className="mt-10 rounded-xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <h1 className="text-xl font-semibold text-[var(--foreground)]">
              Category unavailable
            </h1>
            <p className="mt-2 text-[var(--muted)]">
              {loadError || "This category could not be loaded."}
            </p>
          </div>
        ) : (
          <>
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
                {websites.count}{" "}
                {websites.count === 1 ? "website" : "websites"} available.
              </p>
            </div>

            {websites.results.length === 0 ? (
              <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--white)] p-8 text-center">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  No websites yet
                </h2>

                <p className="mt-2 text-[var(--muted)]">
                  We are adding useful websites to this category.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {websites.results.map((website) => (
                    <WebsiteCard
                      key={website.id}
                      website={website}
                      badge={website.is_featured ? "Featured" : undefined}
                    />
                  ))}
                </div>
                <PaginationNav
                  page={page}
                  count={websites.count}
                  hrefForPage={(nextPage) =>
                    `/categories/${category.slug}?page=${nextPage}`
                  }
                />
              </>
            )}
          </>
        )}
      </main>
    </SiteShell>
  );
}
