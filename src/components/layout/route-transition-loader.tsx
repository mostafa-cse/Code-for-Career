"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Terminal } from "lucide-react";

function getRouteLabel(path: string): string {
  if (!path || path === "/") return "Home";
  if (path.startsWith("/dashboard")) return "Dashboard";
  if (path.startsWith("/roadmap")) return "Career Roadmap";
  if (path.startsWith("/problems")) return "Practice Problems";
  if (path.startsWith("/subjects")) {
    const parts = path.split("/").filter(Boolean);
    if (parts.length >= 3) return "Lesson Workspace";
    return "Curriculum Subject";
  }
  if (path.startsWith("/profile")) return "Profile";
  if (path.startsWith("/auth/login")) return "Sign In";
  return "Loading Module";
}

export function RouteTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetLabel, setTargetLabel] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Stop & complete loading sequence
  const finishLoading = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    setProgress(100);
    setIsFadingOut(true);

    fadeTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
      setIsFadingOut(false);
      setTargetLabel("");
    }, 300);
  }, []);

  // Start the loading sequence
  const startLoading = useCallback((destinationUrl: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    const label = getRouteLabel(destinationUrl);
    setTargetLabel(label);
    setIsFadingOut(false);
    setIsLoading(true);
    setProgress(18);

    // Progressive loading increment simulation
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 12;
        if (prev < 65) return prev + 6;
        if (prev < 82) return prev + 3;
        if (prev < 93) return prev + 1;
        return prev;
      });
    }, 120);

    // Safety timeout in case navigation is cancelled or aborted
    safetyTimeoutRef.current = setTimeout(() => {
      finishLoading();
    }, 7000);
  }, [finishLoading]);

  // Complete loading when pathname or searchParams change
  useEffect(() => {
    if (isLoading) {
      const raf = requestAnimationFrame(() => {
        finishLoading();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [pathname, searchParams, finishLoading, isLoading]);

  // Global link click and history listener
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore modifiers (ctrl/cmd click to open in new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      try {
        const targetUrl = new URL(href, window.location.href);

        // Ignore external domains
        if (targetUrl.origin !== window.location.origin) return;

        // Ignore hash jumps on the same page
        const isSamePath =
          targetUrl.pathname === window.location.pathname &&
          targetUrl.search === window.location.search;
        if (isSamePath) return;

        // Trigger loading bar
        startLoading(targetUrl.pathname);
      } catch {
        // invalid URL, ignore
      }
    };

    const handlePopState = () => {
      startLoading(window.location.pathname);
    };

    const handleCustomStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ label?: string; path?: string }>;
      startLoading(customEvent.detail?.path || window.location.pathname);
    };

    const handleCustomComplete = () => {
      finishLoading();
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("app:route-start", handleCustomStart);
    window.addEventListener("app:route-complete", handleCustomComplete);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("app:route-start", handleCustomStart);
      window.removeEventListener("app:route-complete", handleCustomComplete);
      if (timerRef.current) clearInterval(timerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [startLoading, finishLoading]);

  if (!isLoading && progress === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-busy={isLoading}
      className={`fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-300 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 1. Sleek Glowing Top Progress Bar */}
      <div className="relative h-[3.5px] w-full bg-transparent overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 via-cyan-400 to-blue-500 transition-all duration-150 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Glowing leading tip with trailing light beam */}
          <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/90 shadow-[0_0_14px_rgba(52,211,153,0.9),0_0_8px_rgba(34,211,238,0.8)]" />
        </div>
      </div>

      {/* 2. Floating High-Tech Navigation Pill HUD */}
      <div className="fixed top-3.5 right-4 sm:top-4 sm:right-6 pointer-events-none z-[99998] transition-all duration-200">
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-card/95 dark:bg-slate-900/95 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-lg shadow-emerald-500/10 backdrop-blur-md">
          {/* Animated pulsing radar dot */}
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>

          <span className="text-[11px] font-mono tracking-tight flex items-center gap-1.5 text-muted-foreground">
            <Terminal className="h-3 w-3 text-emerald-500" />
            <span className="text-foreground font-semibold">
              {targetLabel || "Entering Page"}
            </span>
            <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-mono">
              {progress}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
