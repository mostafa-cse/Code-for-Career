"use client";

import Link from "next/link";
import { Terminal, Search, LayoutDashboard, Home } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useSearchModal } from "@/components/providers/search-provider";

export default function NotFound() {
  const { t } = useLanguage();
  const { openSearch } = useSearchModal();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Terminal 404 badge */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-md">
        <Terminal className="h-7 w-7" />
      </div>

      <span className="mt-4 rounded-full border border-border bg-muted px-3 py-1 text-xs font-mono font-bold text-muted-foreground">
        ERROR 404
      </span>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {t("Page Not Found", "পৃষ্ঠাটি খুঁজে পাওয়া যায়নি")}
      </h1>

      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground">
        {t(
          "The curriculum topic or route you requested does not exist or has been moved.",
          "আপনি যে টপিক বা পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই অথবা স্থানান্তরিত হয়েছে।"
        )}
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={openSearch}
          className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs hover:opacity-90"
        >
          <Search className="h-3.5 w-3.5" />
          <span>{t("Search Topics (⌘K)", "টপিক খুঁজুন (⌘K)")}</span>
        </button>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>{t("Dashboard", "ড্যাশবোর্ড")}</span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted"
        >
          <Home className="h-3.5 w-3.5" />
          <span>{t("Home", "হোম")}</span>
        </Link>
      </div>

      <div className="mt-12 text-[11px] font-mono text-muted-foreground/60">
        code-for-career // 404_not_found
      </div>
    </div>
  );
}
