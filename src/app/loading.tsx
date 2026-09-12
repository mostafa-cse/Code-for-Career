export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 animate-pulse space-y-8">
      {/* Header skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-muted" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-1/3 rounded-md bg-muted" />
            <div className="h-4 w-1/4 rounded-md bg-muted" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-6 w-20 rounded-full bg-muted" />
          <div className="h-6 w-24 rounded-full bg-muted" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted" />
              <div className="h-4 w-1/2 rounded-md bg-muted" />
            </div>
            <div className="h-3 w-3/4 rounded-md bg-muted" />
            <div className="h-2 w-full rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
