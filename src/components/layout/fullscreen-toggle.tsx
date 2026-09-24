"use client";

import { useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface FullscreenToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export function FullscreenToggle({ className = "", size = "md" }: FullscreenToggleProps) {
  const { t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("mozfullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      document.removeEventListener("mozfullscreenchange", onFullscreenChange);
    };
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      const docEl = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
      };

      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen().catch(() => {});
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      const doc = document as Document & {
        webkitExitFullscreen?: () => Promise<void>;
        mozCancelFullScreen?: () => Promise<void>;
      };

      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen().catch(() => {});
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }

  const title = isFullscreen
    ? t("Exit Fullscreen", "ফুলস্ক্রিন থেকে বের হন")
    : t("Full Page Screen", "সম্পূর্ণ স্ক্রিন মোড");

  const buttonSizeClass = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconSizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      aria-label={title}
      title={title}
      className={`group relative inline-flex ${buttonSizeClass} items-center justify-center rounded-lg border border-border bg-card text-card-foreground shadow-xs transition-all hover:bg-muted hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${className}`}
    >
      {isFullscreen ? (
        <Minimize className={`${iconSizeClass} text-blue-500 transition-transform group-hover:scale-110`} />
      ) : (
        <Maximize className={`${iconSizeClass} text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-foreground`} />
      )}
      <span className="sr-only">{title}</span>
    </button>
  );
}
