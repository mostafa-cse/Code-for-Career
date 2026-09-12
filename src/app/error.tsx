"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 shadow-xs">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <span className="mt-4 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-mono font-bold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
        RUNTIME_ERROR
      </span>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        Something went wrong
      </h1>

      <p className="mt-2 max-w-md text-xs text-muted-foreground">
        An unexpected error occurred while rendering this view. You can attempt to
        recover by refreshing the component or navigating to home.
      </p>

      {error.digest && (
        <p className="mt-2 text-[10px] font-mono text-muted-foreground/60">
          Digest: {error.digest}
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs hover:opacity-90"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Homepage</span>
        </Link>
      </div>
    </div>
  );
}
