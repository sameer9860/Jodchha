import SiteShell from "@/components/layout/SiteShell";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function SearchLoading() {
  return (
    <SiteShell>
      <PageSkeleton cards={3} lines={2} />
    </SiteShell>
  );
}
