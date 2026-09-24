export default function DashboardLoading() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-foreground animate-pulse-subtle">
      {/* 1. Dashboard Header Banner Skeleton */}
      <div className="w-full border-b border-border/80 bg-linear-to-b from-card/80 via-card/40 to-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              {/* Badge */}
              <div className="h-5 w-48 rounded-full bg-muted/70 animate-shimmer" />
              {/* Title */}
              <div className="h-9 w-72 sm:w-96 rounded-xl bg-muted/80 animate-shimmer" />
              {/* Description */}
              <div className="space-y-1.5 max-w-2xl">
                <div className="h-4 w-full rounded bg-muted/60" />
                <div className="h-4 w-4/5 rounded bg-muted/50" />
              </div>
            </div>

            {/* Readiness Index Card Skeleton */}
            <div className="h-24 w-full sm:w-56 shrink-0 rounded-2xl border border-border/80 bg-card/60 p-4 flex items-center gap-4 animate-shimmer">
              <div className="h-12 w-12 rounded-xl bg-muted/80 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 rounded bg-muted/60" />
                <div className="h-6 w-12 rounded bg-muted/80" />
              </div>
            </div>
          </div>

          {/* Progress bar strip */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <div className="h-3 w-48 rounded bg-muted/60" />
              <div className="h-3 w-16 rounded bg-muted/60" />
            </div>
            <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
              <div className="h-full w-1/4 rounded-full bg-emerald-500/30 animate-pulse" />
            </div>
          </div>

          {/* 4 Metric Cards Strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border/70 bg-card/50 p-4 space-y-2 animate-shimmer"
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-muted/80" />
                  <div className="h-3 w-20 rounded bg-muted/60" />
                </div>
                <div className="h-6 w-14 rounded bg-muted/80" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Full-bleed Edge-to-Edge Workspace Skeleton */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Rail (Subjects 13) */}
        <div className="hidden lg:block lg:col-span-4 space-y-3">
          <div className="h-9 w-full rounded-lg bg-muted/70 animate-shimmer" />
          <div className="space-y-2 rounded-xl border border-border/70 bg-card/40 p-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/40 animate-shimmer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-md bg-muted/80" />
                  <div className="h-4 w-32 rounded bg-muted/70" />
                </div>
                <div className="h-4 w-10 rounded bg-muted/60" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Workspace */}
        <div className="col-span-1 lg:col-span-8 space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="h-10 flex-1 max-w-md rounded-lg bg-muted/70 animate-shimmer" />
            <div className="flex gap-2">
              <div className="h-9 w-16 rounded-lg bg-muted/60" />
              <div className="h-9 w-16 rounded-lg bg-muted/60" />
              <div className="h-9 w-16 rounded-lg bg-muted/60" />
            </div>
          </div>

          {/* Subject Cards */}
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4 animate-shimmer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted/80" />
                  <div className="space-y-1.5">
                    <div className="h-5 w-44 rounded bg-muted/80" />
                    <div className="h-3 w-28 rounded bg-muted/60" />
                  </div>
                </div>
                <div className="h-8 w-20 rounded-lg bg-muted/70" />
              </div>

              {/* Lesson Items */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full bg-muted/70" />
                      <div className="h-4 w-56 sm:w-80 rounded bg-muted/80" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-12 rounded bg-muted/60" />
                      <div className="h-5 w-16 rounded bg-muted/60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
