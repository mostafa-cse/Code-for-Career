export default function RoadmapLoading() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col bg-background text-foreground animate-pulse-subtle">
      {/* 1. Roadmap Top Toolbar / Header Skeleton */}
      <div className="w-full border-b border-border/80 bg-card/60 px-4 py-4 sm:px-6 backdrop-blur-xs">
        <div className="mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-muted/80 animate-shimmer" />
            <div className="space-y-1.5">
              <div className="h-5 w-56 rounded-md bg-muted/80 animate-shimmer" />
              <div className="h-3 w-40 rounded bg-muted/60" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle Skeleton */}
            <div className="h-9 w-32 rounded-lg bg-muted/70 animate-shimmer" />
            <div className="h-9 w-9 rounded-lg bg-muted/60" />
            <div className="h-9 w-9 rounded-lg bg-muted/60" />
          </div>
        </div>
      </div>

      {/* 2. Interactive Graph Workspace Canvas Skeleton */}
      <div className="flex-1 w-full flex overflow-hidden relative">
        {/* Canvas Area with Simulated DAG Nodes */}
        <div className="flex-1 p-8 sm:p-12 overflow-hidden flex flex-col items-center justify-center space-y-12">
          {/* Phase 1: Foundation Nodes */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-56 rounded-xl border border-border/70 bg-card/60 p-4 space-y-3 shadow-md animate-shimmer"
              >
                <div className="flex items-center justify-between">
                  <div className="h-6 w-6 rounded-md bg-muted/80" />
                  <div className="h-4 w-12 rounded-full bg-emerald-500/20" />
                </div>
                <div className="h-4 w-32 rounded bg-muted/80" />
                <div className="h-2 w-full rounded-full bg-muted/60" />
              </div>
            ))}
          </div>

          {/* Connecting Vertical / Diagonal Indicator */}
          <div className="flex items-center gap-16 text-muted-foreground/30">
            <div className="h-8 w-0.5 border-l-2 border-dashed border-border" />
            <div className="h-8 w-0.5 border-l-2 border-dashed border-border" />
            <div className="h-8 w-0.5 border-l-2 border-dashed border-border" />
          </div>

          {/* Phase 2: Core Engineering Nodes */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-56 rounded-xl border border-border/70 bg-card/60 p-4 space-y-3 shadow-md animate-shimmer"
              >
                <div className="flex items-center justify-between">
                  <div className="h-6 w-6 rounded-md bg-muted/80" />
                  <div className="h-4 w-12 rounded-full bg-blue-500/20" />
                </div>
                <div className="h-4 w-36 rounded bg-muted/80" />
                <div className="h-2 w-4/5 rounded-full bg-muted/60" />
              </div>
            ))}
          </div>

          {/* Connecting Line */}
          <div className="h-8 w-0.5 border-l-2 border-dashed border-border" />

          {/* Phase 3: Advanced Specialization Node */}
          <div className="w-64 rounded-xl border border-border/70 bg-card/60 p-4 space-y-3 shadow-md animate-shimmer">
            <div className="flex items-center justify-between">
              <div className="h-6 w-6 rounded-md bg-muted/80" />
              <div className="h-4 w-14 rounded-full bg-purple-500/20" />
            </div>
            <div className="h-4 w-40 rounded bg-muted/80" />
            <div className="h-2 w-full rounded-full bg-muted/60" />
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="hidden lg:flex w-80 shrink-0 border-l border-border/80 bg-card/40 p-5 flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 rounded bg-muted/80" />
            <div className="h-4 w-12 rounded bg-muted/60" />
          </div>
          <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
            <div className="h-full w-1/3 bg-emerald-500/40 rounded-full" />
          </div>
          <div className="space-y-3 pt-4 border-t border-border/50">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 animate-shimmer"
              >
                <div className="h-5 w-5 rounded-full bg-muted/70" />
                <div className="space-y-1 flex-1">
                  <div className="h-3.5 w-32 rounded bg-muted/80" />
                  <div className="h-2.5 w-20 rounded bg-muted/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
