"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useUserProgress } from "@/lib/hooks/use-user-progress";
import type { LocalLesson } from "@/lib/lessons-data";

const DIFFICULTY_DOT: Record<string, string> = {
  EASY: "bg-emerald-500",
  MEDIUM: "bg-amber-500",
  HARD: "bg-orange-500",
  INSANE: "bg-rose-500",
};

interface LessonSidebarProps {
  subjectSlug: string;
  subjectNameEn: string;
  subjectNameBn: string;
  lessons: LocalLesson[];
  activeLessonSlug: string;
}

export function LessonSidebar({
  subjectSlug,
  subjectNameEn,
  subjectNameBn,
  lessons,
  activeLessonSlug,
}: LessonSidebarProps) {
  const { language, t } = useLanguage();
  const { isLessonCompleted } = useUserProgress();

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-20 flex flex-col gap-3">
        {/* Back to subject */}
        <Link
          href={`/subjects/${subjectSlug}`}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>{language === "bn" ? subjectNameBn : subjectNameEn}</span>
        </Link>

        {/* Curriculum list */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("Module Curriculum", "মডিউল কারিকুলাম")}
            </h3>
          </div>
          <nav className="flex flex-col p-1.5 max-h-[70vh] overflow-y-auto">
            {lessons.map((lesson, index) => {
              const isActive = lesson.slug === activeLessonSlug;
              const completed = isLessonCompleted(subjectSlug, lesson.slug);

              return (
                <Link
                  key={lesson.slug}
                  href={`/subjects/${subjectSlug}/${lesson.slug}`}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {/* Completion icon */}
                  <span className="shrink-0">
                    {completed ? (
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          isActive ? "text-background/70" : "text-emerald-500"
                        }`}
                      />
                    ) : (
                      <Circle
                        className={`h-4 w-4 ${
                          isActive
                            ? "text-background/50"
                            : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </span>

                  {/* Lesson title */}
                  <span className="min-w-0 flex-1 text-xs font-medium leading-tight truncate">
                    {index + 1}.{" "}
                    {language === "bn" ? lesson.titleBn : lesson.titleEn}
                  </span>

                  {/* Difficulty dot */}
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      DIFFICULTY_DOT[lesson.difficulty] ?? "bg-muted-foreground"
                    }`}
                    title={lesson.difficulty}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
