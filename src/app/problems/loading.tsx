export default function ProblemsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse-subtle">
      {/* 1. Header Banner Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-4 backdrop-blur-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded-full bg-emerald-500/20" />
            <div className="h-8 w-64 sm:w-80 rounded-xl bg-muted/80 animate-shimmer" />
            <div className="h-4 w-full sm:w-96 rounded bg-muted/60" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 rounded-xl bg-muted/70 animate-shimmer" />
            <div className="h-10 w-28 rounded-xl bg-muted/70 animate-shimmer" />
          </div>
        </div>

        {/* Quick Company Badges Bar Skeleton */}
        <div className="pt-3 border-t border-border/40 flex flex-wrap items-center gap-2">
          <div className="h-4 w-20 rounded bg-muted/60" />
          {["Enosis", "Therap", "Samsung R&D", "Brain Station 23", "BJIT", "Cefalo"].map((company) => (
            <div
              key={company}
              className="h-7 w-24 rounded-full bg-muted/60 animate-shimmer"
            />
          ))}
        </div>
      </div>

      {/* 2. Filter Toolbar Skeleton */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl border border-border/70 bg-card/40">
        <div className="h-10 flex-1 max-w-lg rounded-lg bg-muted/70 animate-shimmer" />
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="h-9 w-20 rounded-lg bg-muted/60" />
          <div className="h-9 w-20 rounded-lg bg-muted/60" />
          <div className="h-9 w-20 rounded-lg bg-muted/60" />
          <div className="h-9 w-24 rounded-lg bg-muted/60" />
        </div>
      </div>

      {/* 3. Problems List / Grid Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7].map((row) => (
          <div
            key={row}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/70 bg-card/50 hover:bg-card/80 transition-colors animate-shimmer"
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="h-5 w-5 rounded-full bg-muted/80 shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-4 w-48 sm:w-72 rounded bg-muted/80" />
                <div className="flex flex-wrap gap-1.5">
                  <div className="h-4 w-16 rounded bg-muted/60" />
                  <div className="h-4 w-20 rounded bg-muted/60" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="h-6 w-24 rounded-full bg-muted/60" />
              <div className="h-6 w-16 rounded-full bg-muted/70" />
              <div className="h-8 w-20 rounded-lg bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
