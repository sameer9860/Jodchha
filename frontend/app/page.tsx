import { getCategories, getFeaturedWebsites } from "@/lib/api";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedWebsites from "@/components/home/FeaturedWebsites";
import Hero from "@/components/home/Hero";
import ToolGrid from "@/components/home/ToolGrid";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const siteUrl = "https://jodchha.com.np";

export default async function Home() {
  const [categories, websites] = await Promise.all([
    getCategories(),
    getFeaturedWebsites(),
  ]);

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
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Navbar />

      <main>
        <Hero />
        <CategoryGrid categories={categories} />
        <FeaturedWebsites websites={websites} />
        <ToolGrid />
      </main>

      <Footer />
    </div>
  );
}