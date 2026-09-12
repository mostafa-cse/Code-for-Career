"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
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

  // Expand / collapse state for subjects (first/in-progress subject expanded by default)
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CURRICULUM_SUBJECTS.forEach((s, idx) => {
      // expand the first subject (csharp) by default, keep others collapsed
      initial[s.slug] = idx === 0;
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
    // ensure the subject is expanded when clicked from the sidebar
    setExpandedSubjects((prev) => ({
      ...prev,
      [slug]: true,
    }));
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

  return (
    <div className="flex gap-0">
      {/* ── Sticky Left Sidebar ── */}
      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-20 rounded-xl border border-border bg-card shadow-xs">
          <div className="border-b border-border px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("Subjects", "বিষয়সমূহ")}
            </p>
          </div>
          <nav className="p-2">
            {CURRICULUM_SUBJECTS.map((subject) => {
              const stats = subjectStats[subject.slug];
              const isActive = activeId === `section-${subject.slug}`;
              const isExpanded = !!expandedSubjects[subject.slug];

              return (
                <a
                  key={subject.slug}
                  href={`#section-${subject.slug}`}
                  onClick={() => handleSidebarClick(subject.slug)}
                  className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                    isActive
                      ? "bg-muted font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] transition-colors ${
                      isActive
                        ? "border-foreground/40 bg-foreground text-background"
                        : "border-border bg-muted/60 text-muted-foreground group-hover:border-foreground/20 group-hover:text-foreground"
                    }`}
                  >
                    <SubjectIcon name={subject.icon} className="h-3 w-3" />
                  </span>
                  <span className="truncate leading-tight">
                    {language === "bn" ? subject.nameBn : subject.nameEn}
                  </span>
                  {stats && stats.percentage === 100 ? (
                    <CheckCircle2 className="ml-auto h-3 w-3 shrink-0 text-emerald-500" />
                  ) : (
                    <span className="ml-auto text-[10px] text-muted-foreground/60 font-mono">
                      {isExpanded ? "▾" : "▸"}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── Main section list ── */}
      <div className="min-w-0 flex-1 space-y-4 xl:pl-6">
        {/* Top Control Bar: Expand/Collapse All */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-foreground/60" />
            <span className="text-xs font-medium text-muted-foreground">
              {t(
                `12 Core Subjects • ${CURRICULUM_SUBJECTS.reduce((acc, s) => acc + (LOCAL_CURRICULUM[s.slug]?.lessons.length ?? 0), 0)} Total Lessons`,
                `১২টি মূল বিষয় • মোট ${CURRICULUM_SUBJECTS.reduce((acc, s) => acc + (LOCAL_CURRICULUM[s.slug]?.lessons.length ?? 0), 0)}টি পাঠ`
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-muted hover:border-foreground/20 cursor-pointer"
          >
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {allExpanded
                ? t("Collapse All", "সবগুলো বন্ধ করুন")
                : t("Expand All", "সবগুলো খুলুন")}
            </span>
          </button>
        </div>

        {CURRICULUM_SUBJECTS.map((subject) => {
          const stats = subjectStats[subject.slug];
          const curriculum = LOCAL_CURRICULUM[subject.slug];
          const lessons = curriculum?.lessons ?? [];
          const diffBadge = DIFFICULTY_BADGE[subject.difficulty] ?? DIFFICULTY_BADGE.EASY;
          const isExpanded = !!expandedSubjects[subject.slug];

          return (
            <section
              key={subject.slug}
              id={`section-${subject.slug}`}
              ref={(el) => {
                sectionRefs.current[subject.slug] = el;
              }}
              className="rounded-xl border border-border bg-card shadow-xs transition-all hover:border-foreground/20"
            >
              {/* Section header (Clickable Accordion Trigger) */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => toggleSubject(subject.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleSubject(subject.slug);
                  }
                }}
                className="group flex cursor-pointer select-none items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30"
              >
                {/* Unified neutral icon container */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 text-foreground transition-colors group-hover:border-foreground/20 group-hover:bg-muted">
                  <SubjectIcon name={subject.icon} className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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

                  {/* Topic tags (subtle pills) */}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {(language === "bn" ? subject.topicsBn : subject.topicsEn).map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-border/50 bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: progress + chevron toggle */}
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
                        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
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

                  {/* Direct link button to full subject */}
                  <Link
                    href={`/subjects/${subject.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hidden rounded-lg border border-border bg-muted/40 p-1.5 text-muted-foreground transition hover:border-foreground/20 hover:bg-muted hover:text-foreground md:inline-flex"
                    title={t("Open subject overview", "বিষয় বিবরণী খুলুন")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  {/* Chevron indicator */}
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:text-foreground"
                    aria-hidden="true"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-foreground" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="border-t border-border">
                  {/* Lesson rows — USACO guide table style */}
                  {lessons.length === 0 ? (
                    <div className="flex items-center gap-2 px-5 py-6 text-xs text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{t("No lessons available yet.", "এখনও কোনো পাঠ যোগ করা হয়নি।")}</span>
                    </div>
                  ) : (
                    <ul className="divide-y divide-border">
                      {lessons
                        .slice()
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map((lesson) => {
                          const lessonStatus = getLessonStatus(subject.slug, lesson.slug);
                          const lessonDiff = DIFFICULTY_BADGE[lesson.difficulty] ?? DIFFICULTY_BADGE.EASY;

                          return (
                            <li key={lesson.slug}>
                              <Link
                                href={`/subjects/${subject.slug}/${lesson.slug}`}
                                className="group/lesson flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40"
                              >
                                {/* Status indicator */}
                                <div className="shrink-0">
                                  {lessonStatus === "COMPLETED" ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  ) : lessonStatus === "IN_PROGRESS" ? (
                                    <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-blue-100 dark:bg-blue-950/40" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground/40" />
                                  )}
                                </div>

                                {/* Lesson title */}
                                <span className="flex-1 text-sm font-medium text-foreground group-hover/lesson:text-blue-600 dark:group-hover/lesson:text-blue-400 transition-colors">
                                  {language === "bn" ? lesson.titleBn : lesson.titleEn}
                                </span>

                                {/* Difficulty */}
                                <span
                                  className={`hidden shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:inline-flex ${lessonDiff.cls}`}
                                >
                                  {lessonDiff.label}
                                </span>

                                {/* Time estimate */}
                                <span className="hidden shrink-0 items-center gap-1 text-[11px] text-muted-foreground sm:flex">
                                  <Clock className="h-3 w-3" />
                                  {lesson.estimatedMinutes} min
                                </span>

                                {/* Order number */}
                                <span className="shrink-0 font-mono text-[11px] text-muted-foreground/60">
                                  #{String(lesson.displayOrder).padStart(2, "0")}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  )}

                  {/* Section footer: Start / Continue button */}
                  <div className="border-t border-border bg-muted/20 px-5 py-3">
                    <Link
                      href={`/subjects/${subject.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {stats?.status === "COMPLETED"
                        ? t("Review all lessons →", "সকল পাঠ পুনর্বার পড়ুন →")
                        : stats?.status === "IN_PROGRESS"
                        ? t("Continue subject →", "এই বিষয়ে পড়া চালিয়ে যান →")
                        : t("Start subject →", "এই বিষয় অধ্যয়ন শুরু করুন →")}
                    </Link>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
