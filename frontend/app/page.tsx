import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedWebsites from "@/components/home/FeaturedWebsites";
import Hero from "@/components/home/Hero";
import ToolGrid from "@/components/home/ToolGrid";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main>
        <Hero />

        <CategoryGrid />

        <FeaturedWebsites />

        <ToolGrid />
      </main>

      <Footer />
    </div>
  );
}