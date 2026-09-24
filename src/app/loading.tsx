export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse-subtle">
      {/* Center Branded Indicator */}
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-card p-2 shadow-lg shadow-emerald-500/10">
          <span className="absolute -inset-1 rounded-2xl bg-emerald-500/20 blur-sm animate-pulse" />
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <svg
              className="h-4 w-4 animate-spin text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-500 dark:text-emerald-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>LOADING MODULE &bull; কোড ফর ক্যারিয়ার</span>
        </div>
      </div>

      {/* Header Skeleton Card */}
      <div className="animate-shimmer rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-5 backdrop-blur-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-muted/80 animate-shimmer" />
            <div className="space-y-2.5 flex-1 min-w-[200px]">
              <div className="h-6 w-48 sm:w-64 rounded-lg bg-muted/80" />
              <div className="h-4 w-36 sm:w-44 rounded-md bg-muted/60" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 rounded-lg bg-muted/70" />
            <div className="h-9 w-20 rounded-lg bg-muted/70" />
          </div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs">
            <div className="h-3 w-28 rounded bg-muted/70" />
            <div className="h-3 w-12 rounded bg-muted/70" />
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden">
            <div className="h-full w-2/5 rounded-full bg-emerald-500/30 animate-pulse" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
          <div className="h-6 w-20 rounded-full bg-muted/70" />
          <div className="h-6 w-24 rounded-full bg-muted/70" />
          <div className="h-6 w-28 rounded-full bg-muted/70" />
          <div className="h-6 w-16 rounded-full bg-muted/70" />
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="animate-shimmer rounded-xl border border-border/70 bg-card/50 p-5 space-y-4 backdrop-blur-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted/80" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded-md bg-muted/80" />
                  <div className="h-3 w-16 rounded bg-muted/60" />
                </div>
              </div>
              <div className="h-5 w-14 rounded-full bg-muted/60" />
            </div>

            <div className="space-y-2">
              <div className="h-3.5 w-full rounded bg-muted/70" />
              <div className="h-3.5 w-4/5 rounded bg-muted/60" />
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-muted/60" />
              <div className="h-4 w-14 rounded-md bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
