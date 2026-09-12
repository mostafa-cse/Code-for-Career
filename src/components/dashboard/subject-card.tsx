"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { SubjectIcon, SUBJECT_COLOR_STYLES } from "@/components/layout/icons";
import type { CurriculumSubject } from "@/lib/curriculum-data";

interface SubjectCardProps {
  subject: CurriculumSubject;
  completedCount: number;
  totalCount: number;
  percentage: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

const DIFFICULTY_STYLES: Record<string, string> = {
  EASY:   "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
  HARD:   "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300",
  INSANE: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300",
};

const STATUS_BAR: Record<string, string> = {
  COMPLETED:   "bg-emerald-500",
  IN_PROGRESS: "bg-blue-500",
  NOT_STARTED: "bg-muted-foreground/30",
};

export function SubjectCard({
  subject,
  completedCount,
  totalCount,
  percentage,
  status,
}: SubjectCardProps) {
  const { language, t } = useLanguage();
  const styles = SUBJECT_COLOR_STYLES[subject.color] ?? SUBJECT_COLOR_STYLES.blue;
  const isCompleted = status === "COMPLETED";

  return (
    /* Table-row style on md+, stacked card on mobile */
    <div className="group flex flex-col gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-xs transition-all hover:border-foreground/20 hover:shadow-sm md:flex-row md:items-center md:gap-6">

      {/* Col 1: Icon + Name + Track */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${styles.border} ${styles.bg} ${styles.text}`}
        >
          <SubjectIcon name={subject.icon} className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">
            {language === "bn" ? subject.nameBn : subject.nameEn}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {language === "bn" ? subject.trackNameBn : subject.trackNameEn}
          </p>
        </div>
      </div>

      {/* Col 2: Difficulty + order */}
      <div className="flex shrink-0 items-center gap-2 md:w-28">
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            DIFFICULTY_STYLES[subject.difficulty] ?? ""
          }`}
        >
          {subject.difficulty}
        </span>
        <span className="font-mono text-[10px] font-semibold text-muted-foreground">
          #{String(subject.order).padStart(2, "0")}
        </span>
      </div>

      {/* Col 3: Progress */}
      <div className="shrink-0 md:w-36">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>~{subject.estimatedHours}h</span>
          </span>
          <span className="font-mono font-semibold text-foreground">
            {percentage}%
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-500 ${STATUS_BAR[status]}`}
            style={{ width: `${Math.max(percentage, isCompleted ? 100 : 0)}%` }}
          />
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {completedCount} / {totalCount} {t("lessons", "পাঠ")}
        </p>
      </div>

      {/* Col 4: Action */}
      <div className="shrink-0">
        <Link
          href={`/subjects/${subject.slug}`}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[11px] font-semibold shadow-xs transition-colors ${
            isCompleted
              ? "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : status === "IN_PROGRESS"
              ? "bg-foreground text-background hover:opacity-90"
              : "border border-border bg-card text-foreground hover:bg-muted"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t("Review", "পুনরালোচনা")}</span>
            </>
          ) : status === "IN_PROGRESS" ? (
            <>
              <span>{t("Continue", "চালিয়ে যান")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>{t("Start", "শুরু করুন")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
