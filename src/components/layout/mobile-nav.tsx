"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SUBJECTS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";
import { LogoIcon } from "./logo";
import { SubjectIcon, SUBJECT_COLOR_STYLES } from "./icons";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-card-foreground shadow-xs hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-background p-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <LogoIcon size={24} />
                <span className="text-base font-bold bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-clip-text text-transparent">
                  BD Software Prep
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-card-foreground hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-1 py-4 border-b border-border">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                {t("Dashboard", "ড্যাশবোর্ড")}
              </Link>
              <Link
                href="/problems"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                {t("Problems", "প্র্যাকটিস প্রবলেম")}
              </Link>
              <Link
                href="/roadmap"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                {t("Roadmaps", "ইন্টারেক্টিভ রোডম্যাপ")}
              </Link>
            </div>

            {/* Subjects List */}
            <div className="flex-1 py-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("12 Core Modules", "১২টি মূল মডিউল")}
              </p>
              <div className="space-y-1">
                {SUBJECTS.map((subject) => {
                  const styles =
                    SUBJECT_COLOR_STYLES[subject.color] ??
                    SUBJECT_COLOR_STYLES.blue;
                  return (
                    <Link
                      key={subject.slug}
                      href={`/subjects/${subject.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg p-2 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${styles.border} ${styles.bg} ${styles.text}`}
                      >
                        <SubjectIcon name={subject.icon} className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">
                        {language === "bn" ? subject.nameBn : subject.nameEn}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer with Controls */}
            <div className="mt-auto border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {t("Settings", "সেটিংস")}
                </span>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
