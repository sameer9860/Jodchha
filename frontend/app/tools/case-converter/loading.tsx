import SiteShell from "@/components/layout/SiteShell";
import { ToolSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <SiteShell>
      <ToolSkeleton />
    </SiteShell>
  );
}
