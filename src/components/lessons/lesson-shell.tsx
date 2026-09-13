"use client";

import React, { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  CheckCircle2,
  Clock,
  Edit3,
  Languages,
  Search,
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useSearchModal } from "@/components/providers/search-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useUserProgress } from "@/lib/hooks/use-user-progress";
import { UsacoSidebar } from "@/components/lessons/usaco-sidebar";
import { TableOfContents } from "@/components/lessons/table-of-contents";
import {
  ModuleProgressSelector,
  type LessonStatus,
} from "@/components/lessons/module-progress-selector";
import { LessonMilestoneModal } from "@/components/lessons/lesson-milestone-modal";

import { ProblemList } from "@/components/lessons/problem-list";
import { SuggestionModal } from "@/components/suggestions/suggestion-modal";
import type { LocalLesson, SubjectCategory } from "@/lib/lessons-data";

const DIFFICULTY_STYLES: Record<string, string> = {
  EASY: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  HARD: "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  INSANE: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

interface LessonShellProps {
  lesson: LocalLesson;
  allLessons: LocalLesson[];
  categories: SubjectCategory[];
  subjectSlug: string;
  subjectNameEn: string;
  subjectNameBn: string;
  subjectIcon: string;
  subjectColor: string;
  contentEn: ReactNode;
  contentBn: ReactNode;
}

const DEFAULT_SIDEBAR_WIDTH = 280;
const MIN_SIDEBAR_WIDTH = 210;
const MAX_SIDEBAR_WIDTH = 520;

export function LessonShell({
  lesson,
  allLessons,
  categories,
  subjectSlug,
  subjectNameEn,
  subjectNameBn,
  contentEn,
  contentBn,
}: LessonShellProps) {
  const { language, setLanguage, t } = useLanguage();
  const { openSearch } = useSearchModal();
  const [displayLang, setDisplayLang] = useState<"en" | "bn">(language);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);

  // User progress tracking & stats
  const { getLessonStatus, markLesson, subjectStats, overallStats } = useUserProgress();
  const currentLessonStatus = getLessonStatus(subjectSlug, lesson.slug);
  const isLessonDone = currentLessonStatus === "COMPLETED";

  const subStat = subjectStats[subjectSlug] || {
    completed: isLessonDone ? 1 : 0,
    total: allLessons.length,
    percentage: 0,
  };

  const handleStatusChange = useCallback((newStatus: LessonStatus, oldStatus: LessonStatus) => {
    if (newStatus === "COMPLETED" && oldStatus !== "COMPLETED") {
      setIsMilestoneOpen(true);
    }
  }, []);

  // Sync display language when global language changes
  useEffect(() => {
    setDisplayLang(language);
  }, [language]);

  // 1. Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState<number>(DEFAULT_SIDEBAR_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Restore saved width and collapse state on mount
  useEffect(() => {
    try {
      const savedWidth = localStorage.getItem("bd-prep:sidebar-width");
      if (savedWidth) {
        const parsed = parseInt(savedWidth, 10);
        if (!isNaN(parsed) && parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
          setSidebarWidth(parsed);
        }
      }
      const savedCollapsed = localStorage.getItem("bd-prep:sidebar-collapsed");
      if (savedCollapsed !== null) {
        setIsCollapsed(savedCollapsed === "true");
      }
    } catch {
      // Ignore localStorage read errors in private browsing
    }
  }, []);

  // Toggle collapse
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("bd-prep:sidebar-collapsed", String(next));
      } catch {}
      return next;
    });
  }, []);

  // Keyboard shortcut Ctrl+Shift+S / Cmd+Shift+S to toggle sidebar (USACO Guide behavior)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleToggleCollapse();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggleCollapse]);

  // Drag resize handlers
  const startResizing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    function handlePointerMove(e: MouseEvent | TouchEvent) {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, clientX));
      setSidebarWidth(newWidth);
    }

    function handlePointerUp() {
      setIsResizing(false);
      try {
        localStorage.setItem("bd-prep:sidebar-width", String(sidebarWidth));
      } catch {}
    }

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove);
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isResizing, sidebarWidth]);

  function handleLanguageToggle() {
    const next: "en" | "bn" = displayLang === "en" ? "bn" : "en";
    setDisplayLang(next);
    setLanguage(next);
  }

  // Prev / Next lesson lookup
  const lessonIndex = allLessons.findIndex((l) => l.slug === lesson.slug);
  const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

  const isBn = displayLang === "bn";

  // Category name lookup for breadcrumb
  const currentCategory = categories.find((cat) =>
    cat.lessons.some((l) => l.slug === lesson.slug)
  );

  return (
    <div className="relative flex min-h-screen w-full bg-background text-foreground">
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP RESIZABLE SIDEBAR (lg and up)
      ───────────────────────────────────────────────────────────── */}
      {!isCollapsed && (
        <aside
          ref={sidebarRef}
          style={{ width: `${sidebarWidth}px` }}
          className="sticky top-0 hidden h-screen shrink-0 lg:flex flex-row border-r border-border/70 bg-card/40 z-20 transition-[width] duration-75 ease-out"
        >
          {/* Inner Sidebar Content */}
          <div className="flex-1 overflow-hidden h-full">
            <UsacoSidebar
              subjectSlug={subjectSlug}
              subjectNameEn={subjectNameEn}
              subjectNameBn={subjectNameBn}
              categories={categories}
              activeLessonSlug={lesson.slug}
              onCollapse={handleToggleCollapse}
              displayLang={displayLang}
            />
          </div>

          {/* Draggable Vertical Splitter / Handle */}
          <div
            onMouseDown={startResizing}
            onTouchStart={startResizing}
            className={`group relative w-2 shrink-0 cursor-col-resize h-full select-none touch-none transition-colors ${
              isResizing ? "bg-blue-600" : "hover:bg-blue-500/40 bg-transparent"
            }`}
            title={isBn ? "সাইডবার সাইজ পরিবর্তন করতে ড্র্যাগ করুন" : "Drag to resize sidebar"}
            aria-label={isBn ? "সাইডবার মাপ পরিবর্তন" : "Resize sidebar handle"}
          >
            {/* Visual handle indicator */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full transition-opacity ${
                isResizing
                  ? "bg-white opacity-100"
                  : "bg-muted-foreground/40 group-hover:bg-blue-600 group-hover:opacity-100 opacity-0"
              }`}
            />
          </div>
        </aside>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE DRAWER SIDEBAR (< lg)
      ───────────────────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card border-r border-border shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="absolute right-2 top-2 z-10">
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={isBn ? "সাইডবার বন্ধ করুন" : "Close sidebar"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <UsacoSidebar
              subjectSlug={subjectSlug}
              subjectNameEn={subjectNameEn}
              subjectNameBn={subjectNameBn}
              categories={categories}
              activeLessonSlug={lesson.slug}
              onCollapse={() => setIsMobileOpen(false)}
              displayLang={displayLang}
            />
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT AREA (Full Width Flex)
      ───────────────────────────────────────────────────────────── */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* ── Top Sticky USACO-style Navigation Bar ── */}
        <header className="sticky top-0 z-30 flex h-12 w-full items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              aria-label={isBn ? "সিলেবাস খুলুন" : "Open syllabus"}
              title={isBn ? "সিলেবাস খুলুন" : "Open syllabus"}
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Desktop Expand Sidebar Button (when collapsed) */}
            {isCollapsed && (
              <button
                type="button"
                onClick={handleToggleCollapse}
                className="hidden lg:inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title={isBn ? "সাইডবার দেখান (Ctrl + Shift + S)" : "Show sidebar (Ctrl + Shift + S)"}
              >
                <PanelLeftOpen className="h-3.5 w-3.5" />
                <span>{isBn ? "সাইডবার" : "Sidebar"}</span>
              </button>
            )}

            {/* Previous Lesson Button */}
            {prevLesson ? (
              <Link
                href={`/subjects/${subjectSlug}/${prevLesson.slug}`}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title={`${isBn ? "পূর্ববর্তী" : "Previous"}: ${isBn ? prevLesson.titleBn : prevLesson.titleEn}`}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isBn ? "আগেরটি" : "Prev"}</span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground/40 cursor-not-allowed">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isBn ? "আগেরটি" : "Prev"}</span>
              </span>
            )}

            {/* USACO Breadcrumb List */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground truncate ml-2">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                {isBn ? "হোম" : "Home"}
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
              <Link
                href={`/subjects/${subjectSlug}`}
                className="hover:text-foreground transition-colors truncate"
              >
                {isBn ? subjectNameBn : subjectNameEn}
              </Link>
              {currentCategory && (
                <>
                  <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                  <span className="truncate text-muted-foreground/90">
                    {isBn ? currentCategory.titleBn : currentCategory.titleEn}
                  </span>
                </>
              )}
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
              <span className="font-semibold text-foreground truncate">
                {isBn ? lesson.titleBn : lesson.titleEn}
              </span>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Search */}
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={isBn ? "অনুসন্ধান (Ctrl + K)" : "Search (Ctrl + K)"}
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-[10px] font-mono opacity-70">⌘K</span>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={handleLanguageToggle}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              title={isBn ? "Read in English" : "বাংলায় পড়ুন"}
            >
              <Languages className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{isBn ? "English" : "বাংলা"}</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Next Lesson Button */}
            {nextLesson ? (
              <Link
                href={`/subjects/${subjectSlug}/${nextLesson.slug}`}
                className="inline-flex items-center gap-1 rounded-md bg-foreground/5 dark:bg-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-foreground/15 transition-colors"
                title={`${isBn ? "পরবর্তী" : "Next"}: ${isBn ? nextLesson.titleBn : nextLesson.titleEn}`}
              >
                <span>{isBn ? "পরেরটি" : "Next"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground/40 cursor-not-allowed">
                <span>{isBn ? "পরেরটি" : "Next"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </header>

        {/* ── Two-Column Layout: Center Article + Right TOC ── */}
        <main className="flex-1 w-full flex justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex w-full max-w-6xl justify-center gap-10">
            {/* Center Main Article Column */}
            <article className="min-w-0 max-w-4xl flex-1">
              {/* ── Module Header (USACO Style) ── */}
              <div className="mb-8 border-b border-border/70 pb-6">
                {/* Section & Category info */}
                {currentCategory && (
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>
                      {isBn ? currentCategory.titleBn : currentCategory.titleEn}
                    </span>
                    {currentCategory.priority === "CORE" && (
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        {isBn ? "প্রধান বিষয়" : "Core Topic"}
                      </span>
                    )}
                    {currentCategory.priority === "ESSENTIAL" && (
                      <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        {isBn ? "অপরিহার্য" : "Essential"}
                      </span>
                    )}
                  </div>
                )}

                {/* Module Title & Top Module Progress Selector */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                      {isBn ? lesson.titleBn : lesson.titleEn}
                    </h1>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          DIFFICULTY_STYLES[lesson.difficulty] ?? ""
                        }`}
                      >
                        {lesson.difficulty}
                      </span>

                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>~{Math.ceil(lesson.estimatedMinutes)} {isBn ? "মিনিট পাঠ" : "mins read"}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsSuggestOpen(true)}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>{isBn ? "সংশোধন প্রস্তাব" : "Suggest Edit"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Top USACO Module Progress Selector Dropdown */}
                  <div className="shrink-0 pt-1">
                    <ModuleProgressSelector
                      subjectSlug={subjectSlug}
                      lessonSlug={lesson.slug}
                      displayLang={displayLang}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                </div>
              </div>

              {/* ── MDX Lesson Content ── */}
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <div className={displayLang === "en" ? "block" : "hidden"}>
                  {contentEn}
                </div>
                <div className={displayLang === "bn" ? "block" : "hidden"}>
                  {contentBn}
                </div>
              </div>



              {/* ── Suggested Practice Problems ── */}
              <div className="mt-10">
                <ProblemList problems={lesson.problems} displayLang={displayLang} />
              </div>

              {/* ── Bottom USACO Module Progress & Luxury Milestone Completion Gate ── */}
              <div
                className={`my-12 p-[1.5px] rounded-3xl transition-all shadow-lg ${
                  isLessonDone
                    ? "bg-gradient-to-r from-amber-400/40 via-emerald-500/40 to-blue-500/40 shadow-emerald-500/10"
                    : "bg-gradient-to-r from-border via-border/80 to-border shadow-xs"
                }`}
              >
                <div
                  className={`rounded-[1.45rem] p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl ${
                    isLessonDone
                      ? "bg-card/95 dark:bg-[#080e1b]/95"
                      : "bg-card/90 dark:bg-card/60"
                  }`}
                >
                  <div className="flex items-center gap-4 text-left w-full md:w-auto">
                    <div
                      className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl font-bold shadow-md transition-all ${
                        isLessonDone
                          ? "bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white shadow-amber-500/30 border border-amber-300/40"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {isLessonDone ? (
                        <Trophy className="h-6 w-6 text-white drop-shadow-md animate-pulse" />
                      ) : (
                        <CheckCircle2 className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-black text-foreground tracking-tight">
                          {isLessonDone
                            ? isBn
                              ? "🎉 অভিনন্দন! পাঠটি সফলভাবে সম্পন্ন হয়েছে"
                              : "🎉 Milestone Achieved! Topic Mastered"
                            : isBn
                            ? "মডিউল সমাপ্তি অবস্থা"
                            : "Module Milestone Progress"}
                        </span>
                        {isLessonDone ? (
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 shadow-xs">
                            {isBn ? "সম্পন্ন ✓" : "Completed ✓"}
                          </span>
                        ) : (
                          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            {subStat.completed} / {subStat.total || allLessons.length} {isBn ? "সম্পন্ন" : "Done"}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 max-w-lg leading-relaxed">
                        {isLessonDone
                          ? isBn
                            ? "আপনি এই অধ্যায়টি সফলভাবে শেষ করেছেন — মাইলস্টোন অ্যানিমেশন দেখতে উদযাপন বাটনে ক্লিক করুন।"
                            : "You've conquered this core topic — click the celebration button to review your milestone stats & confetti."
                          : isBn
                          ? "এই অধ্যায়ের প্রস্তুতি শেষ হলে সম্পন্ন হিসেবে চিহ্নিত করুন — সাইডবার ও ড্যাশবোর্ডে সাথে সাথে যুক্ত হবে।"
                          : "Mark as completed when you finish this lesson — automatically updates your candidate roadmap & readiness index."}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
                    {!isLessonDone ? (
                      <button
                        type="button"
                        onClick={() => {
                          markLesson(subjectSlug, lesson.slug, "COMPLETED");
                          setIsMilestoneOpen(true);
                        }}
                        className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-blue-500 transition-all shadow-emerald-500/25 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{isBn ? "পাঠ সম্পন্ন করুন" : "Mark as Completed"}</span>
                        <Sparkles className="h-3.5 w-3.5 text-amber-300 transition-transform group-hover:rotate-12" />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsMilestoneOpen(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 px-4 py-2.5 text-xs font-black text-white shadow-md hover:from-amber-400 hover:to-yellow-500 transition-all shadow-amber-500/25 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Trophy className="h-4 w-4 text-white" />
                          <span>{isBn ? "মাইলস্টোন উদযাপন" : "View Celebration"}</span>
                        </button>

                        {nextLesson && (
                          <Link
                            href={`/subjects/${subjectSlug}/${nextLesson.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/60 px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted hover:border-border transition-colors cursor-pointer"
                          >
                            <span>{isBn ? "পরবর্তী পাঠ" : "Next Lesson"}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-blue-500" />
                          </Link>
                        )}
                      </>
                    )}

                    <ModuleProgressSelector
                      subjectSlug={subjectSlug}
                      lessonSlug={lesson.slug}
                      displayLang={displayLang}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                </div>
              </div>

              {/* ── Bottom Prev / Next Navigation Cards ── */}
              <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                {prevLesson ? (
                  <Link
                    href={`/subjects/${subjectSlug}/${prevLesson.slug}`}
                    className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-foreground/40 hover:shadow-xs transition-all text-left"
                  >
                    <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                      <ChevronLeft className="h-3.5 w-3.5" />
                      {isBn ? "পূর্ববর্তী মডিউল" : "Previous Module"}
                    </span>
                    <span className="mt-1 text-sm font-bold text-foreground line-clamp-2">
                      {isBn ? prevLesson.titleBn : prevLesson.titleEn}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson && (
                  <Link
                    href={`/subjects/${subjectSlug}/${nextLesson.slug}`}
                    className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-foreground/40 hover:shadow-xs transition-all text-right items-end"
                  >
                    <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                      {isBn ? "পরবর্তী মডিউল" : "Next Module"}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="mt-1 text-sm font-bold text-foreground line-clamp-2">
                      {isBn ? nextLesson.titleBn : nextLesson.titleEn}
                    </span>
                  </Link>
                )}
              </div>
            </article>

            {/* ── Right Column: Table of Contents (xl and up) ── */}
            <aside className="hidden xl:block w-60 shrink-0">
              <div className="sticky top-16">
                <TableOfContents displayLang={displayLang} />
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Suggestion Modal */}
      <SuggestionModal
        isOpen={isSuggestOpen}
        onClose={() => setIsSuggestOpen(false)}
        subjectSlug={subjectSlug}
        lessonSlug={lesson.slug}
        lessonTitle={lesson.titleEn}
      />

      {/* Lesson Milestone Congratulations Modal */}
      <LessonMilestoneModal
        isOpen={isMilestoneOpen}
        onClose={() => setIsMilestoneOpen(false)}
        lesson={lesson}
        subjectSlug={subjectSlug}
        subjectNameEn={subjectNameEn}
        subjectNameBn={subjectNameBn}
        nextLesson={nextLesson}
        completedCount={subStat.completed}
        totalCount={subStat.total || allLessons.length}
        readinessLevelEn={overallStats.readinessLevelEn}
        readinessLevelBn={overallStats.readinessLevelBn}
      />
    </div>
  );
}
