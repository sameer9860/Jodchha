import { ApiError, getCategories, getFeaturedWebsites } from "@/lib/api";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedWebsites from "@/components/home/FeaturedWebsites";
import Hero from "@/components/home/Hero";
import ToolGrid from "@/components/home/ToolGrid";
import SiteShell from "@/components/layout/SiteShell";
import type { Category, Website } from "@/lib/types";

const siteUrl = "https://jodchha.com.np";

export default async function Home() {
  let categories: Category[] = [];
  let websites: Website[] = [];
  let loadError = false;

  try {
    [categories, websites] = await Promise.all([
      getCategories(),
      getFeaturedWebsites(),
    ]);
  } catch (error) {
    loadError = true;
    if (!(error instanceof ApiError)) {
      console.error(error);
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Jodchha",
        description:
          "Discover useful websites, online services, and free tools in one simple place.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Jodchha",
        url: siteUrl,
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

      <main>
        <Hero />

        {loadError && (
          <div className="mx-auto max-w-6xl px-6">
            <div
              role="alert"
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              Directory data is temporarily unavailable. Tools below still
              work.
            </div>
          </div>
        )}

        <CategoryGrid categories={categories} />
        <FeaturedWebsites websites={websites} />
        <ToolGrid />
      </main>
    </SiteShell>
  );
}
