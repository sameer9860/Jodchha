import SiteShell from "@/components/layout/SiteShell";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function WebsiteLoading() {
  return (
    <SiteShell>
      <PageSkeleton cards={3} lines={3} />
    </SiteShell>
  );
}
