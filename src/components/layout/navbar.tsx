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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <LogoBrand size="sm" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <SubjectDropdown />
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {t("Dashboard", "ড্যাশবোর্ড")}
            </Link>
            <Link
              href="/problems"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {t("Problems", "প্র্যাকটিস")}
            </Link>
            <Link
              href="/roadmap"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {t("Roadmaps", "রোডম্যাপ")}
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button (Desktop) */}
          <button
            type="button"
            className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-xs hover:bg-muted md:flex"
            onClick={openSearch}
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" />
            <span>{t("Search topics...", "টপিক খুঁজুন...")}</span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Search Button */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            onClick={openSearch}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <LanguageToggle />
          <ThemeToggle />

          <AuthButton />

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
