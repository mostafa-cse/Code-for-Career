"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useSearchModal } from "@/components/providers/search-provider";
import { LogoBrand } from "./logo";
import { SubjectDropdown } from "./subject-dropdown";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { FullscreenToggle } from "./fullscreen-toggle";
import { MobileNav } from "./mobile-nav";
import { AuthButton } from "./auth-button";

export function Navbar() {
  const { t } = useLanguage();
  const { openSearch } = useSearchModal();
  const pathname = usePathname();

  // Hide Navbar completely on subsection pages (/subjects/[slug]/[lessonSlug])
  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
  const isSubsectionPage = segments.length >= 3 && segments[0] === "subjects";
  if (isSubsectionPage) {
    return null;
  }

  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isProblems = pathname === "/problems" || pathname.startsWith("/problems/");
  const isRoadmap = pathname === "/roadmap" || pathname.startsWith("/roadmap/");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      {/* Full-width container utilizing entire screen width with left-right alignment */}
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Left Section: Brand & Primary Navigation */}
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <LogoBrand size="sm" />

          <div className="hidden h-5 w-px bg-border/60 lg:block" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <SubjectDropdown />
            <Link
              href="/dashboard"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isDashboard
                  ? "bg-primary/10 text-primary font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("Dashboard", "ড্যাশবোর্ড")}
            </Link>
            <Link
              href="/problems"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isProblems
                  ? "bg-primary/10 text-primary font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("Problems", "প্র্যাকটিস")}
            </Link>
            <Link
              href="/roadmap"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isRoadmap
                  ? "bg-primary/10 text-primary font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("Roadmaps", "রোডম্যাপ")}
            </Link>
          </nav>
        </div>

        {/* Right Section: Search, Full Page Screen, Tools & User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search Button (Desktop) */}
          <button
            type="button"
            className="hidden items-center gap-2 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground shadow-xs transition-all hover:bg-muted hover:border-border/80 hover:text-foreground md:flex cursor-pointer"
            onClick={openSearch}
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">{t("Search topics, problems...", "টপিক ও সমস্যা খুঁজুন...")}</span>
            <span className="xl:hidden">{t("Search...", "খুঁজুন...")}</span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Search Button */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground md:hidden cursor-pointer"
            onClick={openSearch}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Full Page Screen (Fullscreen Mode Toggle) */}
          <FullscreenToggle />

          {/* Language Toggle */}
          <LanguageToggle />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Auth Button */}
          <AuthButton />

          {/* Mobile Navigation Drawer */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
