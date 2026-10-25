import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import WebsiteCard from "@/components/directory/WebsiteCard";
import WebsiteLogo from "@/components/directory/WebsiteLogo";
import SiteShell from "@/components/layout/SiteShell";
import {
  ApiError,
  getRelatedWebsites,
  getWebsite,
  getWebsiteRedirectUrl,
} from "@/lib/api";
import type { Website } from "@/lib/types";

const siteUrl = "https://jodchha.com.np";

type WebsitePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: WebsitePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const website = await getWebsite(slug);

    return {
      title: website.name,
      description: website.description,
      alternates: {
        canonical: `/websites/${website.slug}`,
      },
      openGraph: {
        title: `${website.name} | Jodchha`,
        description: website.description,
        url: `/websites/${website.slug}`,
        images: website.logo ? [{ url: website.logo }] : undefined,
      },
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return {
        title: "Website Not Found",
        description: "The requested website could not be found.",
      };
    }

    return {
      title: "Website",
      description: "Discover useful websites on Jodchha.",
    };
  }
}

export default async function WebsitePage({ params }: WebsitePageProps) {
  const { slug } = await params;

  let website: Website | null = null;
  let related: Website[] = [];
  let loadError = "";

  try {
    website = await getWebsite(slug);
    try {
      related = await getRelatedWebsites(website.slug, website.category.slug);
    } catch {
      related = [];
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    loadError =
      error instanceof ApiError
        ? error.message
        : "Unable to load this website right now. Please try again.";
  }

  if (loadError || !website) {
    return (
      <SiteShell>
        <main className="mx-auto max-w-3xl px-6 py-16">
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <h1 className="text-xl font-semibold text-[var(--foreground)]">
              Website unavailable
            </h1>
            <p className="mt-2 text-[var(--muted)]">
              {loadError || "This website could not be loaded."}
            </p>
          </div>
        </main>
      </SiteShell>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: website.name,
        description: website.description,
        url: `${siteUrl}/websites/${website.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Jodchha",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: website.category.name,
            item: `${siteUrl}/categories/${website.category.slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: website.name,
            item: `${siteUrl}/websites/${website.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href={`/categories/${website.category.slug}`}
          className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
        >
          ← {website.category.name}
        </Link>

        <article className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--white)] p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <WebsiteLogo
                name={website.name}
                logo={website.logo}
                fallback={website.category.icon || "🔗"}
                size="lg"
              />

              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                  {website.category.name}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
                  {website.name}
                </h1>
                {website.is_featured && (
                  <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <a
              href={getWebsiteRedirectUrl(website.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] px-6 font-semibold text-white transition hover:bg-[var(--primary-dark)]"
            >
              Visit website
            </a>
          </div>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            {website.description}
          </p>

          {typeof website.click_count === "number" && (
            <p className="mt-6 text-sm text-[var(--muted)]">
              {website.click_count.toLocaleString()} visits tracked on Jodchha
            </p>
          )}
        </article>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              More in {website.category.name}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <WebsiteCard key={item.id} website={item} />
              ))}
            </div>
          </section>
        )}
      </main>
    </SiteShell>
  );
}
