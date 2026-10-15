import SiteShell from "@/components/layout/SiteShell";
import { HomeSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <SiteShell>
      <HomeSkeleton />
    </SiteShell>
  );
}
