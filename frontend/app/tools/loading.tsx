import SiteShell from "@/components/layout/SiteShell";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function ToolsLoading() {
  return (
    <SiteShell>
      <PageSkeleton cards={6} lines={0} />
    </SiteShell>
  );
}
