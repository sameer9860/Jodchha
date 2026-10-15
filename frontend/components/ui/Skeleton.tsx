type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`}
    />
  );
}

export function PageSkeleton({
  title = true,
  cards = 3,
  lines = 4,
}: {
  title?: boolean;
  cards?: number;
  lines?: number;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16" aria-busy="true">
      <span className="sr-only">Loading page content</span>

      {title && (
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
      )}

      {cards > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6"
            >
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="mt-5 h-5 w-3/4" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </div>
          ))}
        </div>
      )}

      {lines > 0 && (
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              className={`h-4 ${index % 2 === 0 ? "w-full" : "w-4/5"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div aria-busy="true">
      <span className="sr-only">Loading homepage</span>
      <section className="border-b border-[var(--border)] bg-[var(--white)]">
        <div className="mx-auto max-w-6xl space-y-6 px-6 py-20 sm:py-24">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-14 w-full max-w-xl" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <Skeleton className="h-14 w-full max-w-2xl rounded-xl" />
        </div>
      </section>
      <PageSkeleton title cards={4} lines={0} />
    </div>
  );
}

export function ToolSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-6 py-16" aria-busy="true">
      <span className="sr-only">Loading tool</span>
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-64 max-w-full" />
      <Skeleton className="h-5 w-full max-w-lg" />
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-6 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100" aria-busy="true">
      <span className="sr-only">Loading admin dashboard</span>
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-slate-950 p-6 lg:block">
          <Skeleton className="h-10 w-40 bg-slate-800" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-11 w-full bg-slate-800" />
            ))}
          </div>
        </aside>

        <div className="flex-1 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-64 max-w-full" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <Skeleton className="h-5 w-48" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-4 h-9 w-20" />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <Skeleton className="mb-6 h-5 w-40" />
              <Skeleton className="h-72 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminLoginSkeleton() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div
        className="w-full max-w-md space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--white)] p-8"
        aria-busy="true"
      >
        <span className="sr-only">Loading admin login</span>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-64 max-w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </main>
  );
}
