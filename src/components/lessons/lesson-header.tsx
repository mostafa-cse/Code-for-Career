"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock, Edit3 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useUserProgress } from "@/lib/hooks/use-user-progress";
import { SubjectIcon, SUBJECT_COLOR_STYLES } from "@/components/layout/icons";
import { SuggestionModal } from "@/components/suggestions/suggestion-modal";
import type { LocalLesson } from "@/lib/lessons-data";

const DIFFICULTY_STYLES: Record<string, string> = {
  EASY: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
  HARD: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300",
  INSANE: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300",
};

interface LessonHeaderProps {
  lesson: LocalLesson;
  subjectSlug: string;
  subjectNameEn: string;
  subjectNameBn: string;
  subjectIcon: string;
  subjectColor: string;
  language: "en" | "bn";
  onLanguageToggle: () => void;
}

export function LessonHeader({
  lesson,
  subjectSlug,
  subjectNameEn,
  subjectNameBn,
  subjectIcon,
  subjectColor,
  language,
  onLanguageToggle,
}: LessonHeaderProps) {
  const { t } = useLanguage();
  const { isLessonCompleted, markLesson } = useUserProgress();
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);

  const completed = isLessonCompleted(subjectSlug, lesson.slug);
  const styles = SUBJECT_COLOR_STYLES[subjectColor] ?? SUBJECT_COLOR_STYLES.blue;

  function handleMarkComplete() {
    markLesson(
      subjectSlug,
      lesson.slug,
      completed ? "NOT_STARTED" : "COMPLETED"
    );
  }

  const readTime = Math.ceil(lesson.estimatedMinutes);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          {t("Dashboard", "ড্যাশবোর্ড")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/subjects/${subjectSlug}`}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <div
            className={`flex h-4 w-4 items-center justify-center rounded ${styles.bg} ${styles.text}`}
          >
            <SubjectIcon name={subjectIcon} className="h-2.5 w-2.5" />
          </div>
          <span>{language === "bn" ? subjectNameBn : subjectNameEn}</span>
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate">
          {language === "bn" ? lesson.titleBn : lesson.titleEn}
        </span>
      </nav>

      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  DIFFICULTY_STYLES[lesson.difficulty] ?? ""
                }`}
              >
                {lesson.difficulty}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>~{readTime} min</span>
              </div>
            </div>

            {/* Lesson title */}
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {language === "bn" ? lesson.titleBn : lesson.titleEn}
            </h1>
          </div>

          {/* Right-side controls */}
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
              {/* Suggest an Edit */}
              <button
                type="button"
                onClick={() => setIsSuggestOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title={t("Suggest improvements to this lesson", "এই পাঠে উন্নয়নের পরামর্শ দিন")}
              >
                <Edit3 className="h-3 w-3" />
                <span>{t("Suggest Edit", "পরামর্শ")}</span>
              </button>

              {/* Language toggle */}
              <button
                type="button"
                onClick={onLanguageToggle}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-border"
              >
                <span>{language === "en" ? "বাংলায় পড়ুন" : "Read in English"}</span>
              </button>
            </div>

            {/* Mark Complete */}
            <button
              type="button"
              onClick={handleMarkComplete}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors ${
                completed
                  ? "border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100"
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>
                {completed
                  ? t("Completed ✓", "সম্পন্ন ✓")
                  : t("Mark as Completed", "সম্পন্ন করুন")}
              </span>
            </button>
          </div>
        </div>
      </div>

      <SuggestionModal
        subjectSlug={subjectSlug}
        lessonSlug={lesson.slug}
        lessonTitle={language === "bn" ? lesson.titleBn : lesson.titleEn}
        isOpen={isSuggestOpen}
        onClose={() => setIsSuggestOpen(false)}
      />
    </div>
  );
}
