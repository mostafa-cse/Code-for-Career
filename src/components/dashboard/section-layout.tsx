"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
  Search,
  SlidersHorizontal,
  X,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useUserProgress } from "@/lib/hooks/use-user-progress";
import { SubjectIcon } from "@/components/layout/icons";
import { CURRICULUM_SUBJECTS } from "@/lib/curriculum-data";
import { LOCAL_CURRICULUM } from "@/lib/lessons-data";

const DIFFICULTY_BADGE: Record<
  string,
  { label: string; cls: string }
> = {
  EASY:   { label: "Easy",   cls: "border-emerald-200/60 bg-emerald-500/10 text-emerald-700 dark:border-emerald-800/40 dark:text-emerald-400" },
  MEDIUM: { label: "Medium", cls: "border-amber-200/60 bg-amber-500/10 text-amber-700 dark:border-amber-800/40 dark:text-amber-400" },
  HARD:   { label: "Hard",   cls: "border-orange-200/60 bg-orange-500/10 text-orange-700 dark:border-orange-800/40 dark:text-orange-400" },
  INSANE: { label: "Insane", cls: "border-rose-200/60 bg-rose-500/10 text-rose-700 dark:border-rose-800/40 dark:text-rose-400" },
};

export function SectionLayout() {
  const { language, t } = useLanguage();
  const { progress, subjectStats } = useUserProgress();
  const [activeId, setActiveId] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Search & Filter state
  const [lessonSearch, setLessonSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL"); // ALL, COMPLETED, IN_PROGRESS, NOT_STARTED
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Expand / collapse state for subjects (all expanded or specific expanded)
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CURRICULUM_SUBJECTS.forEach((s, idx) => {
      // Expand the first two subjects by default
      initial[s.slug] = idx < 2;
    });
    return initial;
  });

  const allExpanded = CURRICULUM_SUBJECTS.every((s) => expandedSubjects[s.slug]);

  function toggleSubject(slug: string) {
    setExpandedSubjects((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  }

  function toggleAll() {
    const nextState = !allExpanded;
    const updated: Record<string, boolean> = {};
    CURRICULUM_SUBJECTS.forEach((s) => {
      updated[s.slug] = nextState;
    });
    setExpandedSubjects(updated);
  }

  function handleSidebarClick(slug: string) {
    // Ensure the subject is expanded when clicked from the sidebar
    setExpandedSubjects((prev) => ({
      ...prev,
      [slug]: true,
    }));
    const target = sectionRefs.current[slug];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Intersection observer to highlight active sidebar item
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  function getLessonStatus(subjectSlug: string, lessonSlug: string) {
    const key = `${subjectSlug}:${lessonSlug}`;
    if (progress.completedLessons.includes(key)) return "COMPLETED";
    if (progress.inProgressLessons.includes(key)) return "IN_PROGRESS";
    return "NOT_STARTED";
  }

  // Filter subjects for the sidebar search
  const filteredSubjects = useMemo(() => {
    if (!subjectFilter.trim()) return CURRICULUM_SUBJECTS;
    const query = subjectFilter.toLowerCase();
    return CURRICULUM_SUBJECTS.filter(
      (s) =>
        s.nameEn.toLowerCase().includes(query) ||
        s.nameBn.toLowerCase().includes(query) ||
        s.slug.toLowerCase().includes(query)
    );
  }, [subjectFilter]);

  // Total lessons count
  const totalLessonsCount = useMemo(() => {
    return CURRICULUM_SUBJECTS.reduce(
      (acc, s) => acc + (LOCAL_CURRICULUM[s.slug]?.lessons.length ?? 0),
      0
    );
  }, []);

  return (
    <div className="flex flex-1 w-full min-h-0 items-stretch">
      {/* ── 1. LEFT SIDEBAR: Attached to the leftmost side (left: 0, no outer card) ── */}
      <aside
        className={`shrink-0 border-r border-border bg-card/40 backdrop-blur-xs flex flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-hidden transition-all duration-300 z-20 ${
          isSidebarVisible ? "w-64 sm:w-72 lg:w-80 block" : "w-0 hidden"
        }`}
      >
        {/* Sidebar Header */}
        <div className="border-b border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-blue-500" />
              {t("Subjects", "বিষয়সমূহ")} ({CURRICULUM_SUBJECTS.length})
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/80 bg-muted px-1.5 py-0.5 rounded">
              {totalLessonsCount} {t("lessons", "পাঠ")}
            </span>
          </div>

          {/* Quick subject filter */}
          <div className="relative mt-2.5">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              placeholder={t("Filter subjects...", "বিষয় খুঁজুন...")}
              className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {subjectFilter && (
              <button
                type="button"
                onClick={() => setSubjectFilter("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Navigation List attached to the edges */}
        <nav className="flex-1 overflow-y-auto p-2 divide-y divide-border/20">
          {filteredSubjects.map((subject) => {
            const stats = subjectStats[subject.slug];
            const isActive = activeId === `section-${subject.slug}`;
            const isExpanded = !!expandedSubjects[subject.slug];
            const curriculum = LOCAL_CURRICULUM[subject.slug];
            const lessonsCount = curriculum?.lessons.length ?? 0;

            return (
              <a
                key={subject.slug}
                href={`#section-${subject.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSidebarClick(subject.slug);
                }}
                className={`group flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors rounded-lg ${
                  isActive
                    ? "bg-blue-500/10 font-semibold text-blue-600 dark:text-blue-400 border-l-2 border-blue-600"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {/* Subject Icon */}
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] transition-colors ${
                    isActive
                      ? "border-blue-500/40 bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : "border-border bg-muted/50 text-muted-foreground group-hover:border-foreground/20 group-hover:text-foreground"
                  }`}
                >
                  <SubjectIcon name={subject.icon} className="h-3.5 w-3.5" />
                </span>

                {/* Name & lesson count */}
                <div className="min-w-0 flex-1">
                  <p className="truncate leading-tight font-medium text-foreground">
                    {language === "bn" ? subject.nameBn : subject.nameEn}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 truncate">
                    {stats ? `${stats.completed}/${stats.total}` : `0/${lessonsCount}`} {t("done", "সম্পন্ন")}
                  </p>
                </div>

                {/* Status indicator */}
                {stats && stats.percentage === 100 ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : (
                  <span className="text-[10px] text-muted-foreground/50 font-mono">
                    {isExpanded ? "▾" : "▸"}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Sidebar Footer Link */}
        <div className="border-t border-border p-3 bg-muted/10">
          <Link
            href="/problems"
            className="flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1"
          >
            <span>{t("Practice Problems →", "প্র্যাকটিস সমস্যা →")}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* ── 2. RIGHT MAIN AREA: Attached to the rightmost side (flex-1, edge-to-edge) ── */}
      <div className="min-w-0 flex-1 px-6 sm:px-8 lg:px-10 py-6 overflow-y-auto">
        {/* Full-width Top Action Bar: Search, Filters, and Expand/Collapse All */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-6 border-b border-border">
          {/* Left: Instant Lesson Search & Sidebar Toggle */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              type="button"
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition shrink-0"
              title={isSidebarVisible ? t("Hide sidebar", "সাইডবার লুকান") : t("Show sidebar", "সাইডবার দেখান")}
            >
              {isSidebarVisible ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="hidden sm:inline">{t("Hide Rail", "লুকান")}</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-blue-500" />
                  <span className="hidden sm:inline">{t("Show Rail", "দেখান")}</span>
                </>
              )}
            </button>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
                placeholder={t(
                  "Filter lessons across all 12 subjects by title...",
                  "সকল বিষয়ের পাঠের শিরোনাম দিয়ে খুঁজুন..."
                )}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-8 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              {lessonSearch && (
                <button
                  type="button"
                  onClick={() => setLessonSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Difficulty Filter + Expand All */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Difficulty Pills */}
            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-0.5 text-xs font-semibold">
              {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedDifficulty === diff
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {diff === "ALL" ? t("All", "সব") : diff}
                </button>
              ))}
            </div>

            {/* Expand / Collapse All Button */}
            <button
              type="button"
              onClick={toggleAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted hover:border-foreground/20 cursor-pointer"
            >
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                {allExpanded
                  ? t("Collapse All", "সবগুলো বন্ধ করুন")
                  : t("Expand All", "সবগুলো খুলুন")}
              </span>
            </button>
          </div>
        </div>

        {/* ── CURRICULUM SECTIONS: Clean Full-Width Flat Modules (NO CARD VIEW) ── */}
        <div className="space-y-8">
          {CURRICULUM_SUBJECTS.map((subject) => {
            const stats = subjectStats[subject.slug];
            const curriculum = LOCAL_CURRICULUM[subject.slug];
            const allLessons = curriculum?.lessons ?? [];

            // Filter lessons by search query and difficulty
            const filteredLessons = allLessons.filter((lesson) => {
              const matchesSearch =
                !lessonSearch.trim() ||
                lesson.titleEn.toLowerCase().includes(lessonSearch.toLowerCase()) ||
                lesson.titleBn.toLowerCase().includes(lessonSearch.toLowerCase()) ||
                lesson.slug.toLowerCase().includes(lessonSearch.toLowerCase());

              const matchesDiff =
                selectedDifficulty === "ALL" || lesson.difficulty === selectedDifficulty;

              const status = getLessonStatus(subject.slug, lesson.slug);
              const matchesStatus =
                selectedStatus === "ALL" ||
                (selectedStatus === "COMPLETED" && status === "COMPLETED") ||
                (selectedStatus === "IN_PROGRESS" && status === "IN_PROGRESS") ||
                (selectedStatus === "NOT_STARTED" && status === "NOT_STARTED");

              return matchesSearch && matchesDiff && matchesStatus;
            });

            const diffBadge = DIFFICULTY_BADGE[subject.difficulty] ?? DIFFICULTY_BADGE.EASY;
            const isExpanded = !!expandedSubjects[subject.slug];

            // If user searches and subject has matching lessons, automatically expand
            const shouldForceExpand = lessonSearch.trim() !== "" && filteredLessons.length > 0;
            const expanded = isExpanded || shouldForceExpand;

            // If user searched and there are no matching lessons in this subject, skip rendering it
            if (lessonSearch.trim() !== "" && filteredLessons.length === 0) {
              return null;
            }

            return (
              <section
                key={subject.slug}
                id={`section-${subject.slug}`}
                ref={(el) => {
                  sectionRefs.current[subject.slug] = el;
                }}
                className="border-b border-border/80 pb-6"
              >
                {/* Full-width Section Header (Accordion trigger) */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={expanded}
                  onClick={() => toggleSubject(subject.slug)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleSubject(subject.slug);
                    }
                  }}
                  className="group flex cursor-pointer select-none items-center gap-4 py-3 px-2 rounded-lg transition-colors hover:bg-muted/40"
                >
                  {/* Subject Icon container */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground transition-colors group-hover:border-foreground/20 group-hover:bg-muted">
                    <SubjectIcon name={subject.icon} className="h-5 w-5" />
                  </div>

                  {/* Title & metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {language === "bn" ? subject.nameBn : subject.nameEn}
                      </h2>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${diffBadge.cls}`}
                      >
                        {diffBadge.label}
                      </span>
                      <span className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {language === "bn" ? subject.trackNameBn : subject.trackNameEn}
                      </span>
                    </div>

                    {/* Topic Tags */}
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {(language === "bn" ? subject.topicsBn : subject.topicsEn).map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-border/60 bg-muted/20 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Progress bar + Expand Chevron */}
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="hidden flex-col items-end gap-1 sm:flex">
                      {stats && (
                        <>
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {stats.completed} / {stats.total}{" "}
                            <span className="font-sans font-normal text-muted-foreground">
                              {t("lessons", "পাঠ")}
                            </span>
                          </span>
                          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                stats.status === "COMPLETED"
                                  ? "bg-emerald-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${stats.percentage}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* External Link to Subject Overview */}
                    <Link
                      href={`/subjects/${subject.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hidden rounded-lg border border-border bg-muted/40 p-2 text-muted-foreground transition hover:border-foreground/20 hover:bg-muted hover:text-foreground md:inline-flex"
                      title={t("Open subject overview", "বিষয় বিবরণী খুলুন")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>

                    {/* Chevron Indicator */}
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:text-foreground"
                      aria-hidden="true"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          expanded ? "rotate-180 text-foreground" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Collapsible Lesson List: Flat Table/List Layout (USACO Guide Style) */}
                {expanded && (
                  <div className="mt-2 border-t border-border">
                    {filteredLessons.length === 0 ? (
                      <div className="flex items-center gap-2 py-6 px-4 text-xs text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>
                          {lessonSearch
                            ? t("No lessons match the search filter.", "খোঁজা শব্দের সাথে কোনো পাঠ মেলেনি।")
                            : t("No lessons available yet.", "এখনও কোনো পাঠ যোগ করা হয়নি।")}
                        </span>
                      </div>
                    ) : (
                      <ul className="divide-y divide-border/60">
                        {filteredLessons
                          .slice()
                          .sort((a, b) => a.displayOrder - b.displayOrder)
                          .map((lesson) => {
                            const lessonStatus = getLessonStatus(subject.slug, lesson.slug);
                            const lessonDiff = DIFFICULTY_BADGE[lesson.difficulty] ?? DIFFICULTY_BADGE.EASY;

                            return (
                              <li key={lesson.slug}>
                                <Link
                                  href={`/subjects/${subject.slug}/${lesson.slug}`}
                                  className="group/lesson flex items-center gap-4 py-3 px-3 transition-colors hover:bg-muted/40 rounded-md"
                                >
                                  {/* Status Icon */}
                                  <div className="shrink-0">
                                    {lessonStatus === "COMPLETED" ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : lessonStatus === "IN_PROGRESS" ? (
                                      <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-blue-100 dark:bg-blue-950/40" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-muted-foreground/30" />
                                    )}
                                  </div>

                                  {/* Lesson Title & Module */}
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-foreground group-hover/lesson:text-blue-600 dark:group-hover/lesson:text-blue-400 transition-colors">
                                      {language === "bn" ? lesson.titleBn : lesson.titleEn}
                                    </span>
                                  </div>

                                  {/* Difficulty */}
                                  <span
                                    className={`hidden shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:inline-flex ${lessonDiff.cls}`}
                                  >
                                    {lessonDiff.label}
                                  </span>

                                  {/* Estimated Duration */}
                                  <span className="hidden shrink-0 items-center gap-1 text-[11px] text-muted-foreground sm:flex font-mono">
                                    <Clock className="h-3 w-3" />
                                    {lesson.estimatedMinutes} min
                                  </span>

                                  {/* Order Number */}
                                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground/60">
                                    #{String(lesson.displayOrder).padStart(2, "0")}
                                  </span>

                                  {/* Arrow link */}
                                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover/lesson:text-blue-600 group-hover/lesson:translate-x-0.5 transition-all" />
                                </Link>
                              </li>
                            );
                          })}
                      </ul>
                    )}

                    {/* Section Footer: Continue Subject link */}
                    <div className="mt-2 pt-3 flex items-center justify-between text-xs">
                      <Link
                        href={`/subjects/${subject.slug}`}
                        className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {stats?.status === "COMPLETED"
                          ? t("Review all lessons for this subject →", "এই বিষয়ের সকল পাঠ পুনর্বার পড়ুন →")
                          : stats?.status === "IN_PROGRESS"
                          ? t("Continue this subject →", "এই বিষয় অধ্যয়ন চালিয়ে যান →")
                          : t("Start studying this subject →", "এই বিষয় অধ্যয়ন শুরু করুন →")}
                      </Link>

                      <span className="text-muted-foreground font-mono text-[11px]">
                        {filteredLessons.length} {t("lessons", "টি পাঠ")}
                      </span>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
