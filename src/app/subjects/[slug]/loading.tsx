export default function SubjectLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse-subtle">
      {/* 1. Subject Header Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-4 backdrop-blur-xs">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-muted/80 animate-shimmer shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-7 w-64 sm:w-80 rounded-xl bg-muted/80 animate-shimmer" />
            <div className="h-4 w-44 rounded bg-muted/60" />
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-border/40">
          <div className="h-6 w-20 rounded-full bg-muted/70" />
          <div className="h-6 w-28 rounded-full bg-muted/70" />
          <div className="h-6 w-24 rounded-full bg-muted/70" />
        </div>
      </div>

      {/* 2. Modules / Categories Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((section) => (
          <div
            key={section}
            className="rounded-xl border border-border/70 bg-card/50 p-5 space-y-3 animate-shimmer"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-48 rounded bg-muted/80" />
              <div className="h-4 w-16 rounded bg-muted/60" />
            </div>
            <div className="space-y-2 pt-2 border-t border-border/40">
              {[1, 2, 3].map((lesson) => (
                <div
                  key={lesson}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                >
                  <div className="h-4 w-60 rounded bg-muted/70" />
                  <div className="h-4 w-20 rounded bg-muted/60" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
