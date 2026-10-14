import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
