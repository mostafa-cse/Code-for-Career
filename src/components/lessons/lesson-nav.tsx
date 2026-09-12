"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { LocalLesson } from "@/lib/lessons-data";

interface LessonNavProps {
  subjectSlug: string;
  prevLesson: LocalLesson | null;
  nextLesson: LocalLesson | null;
}

export function LessonNav({
  subjectSlug,
  prevLesson,
  nextLesson,
}: LessonNavProps) {
  const { language, t } = useLanguage();

  if (!prevLesson && !nextLesson) return null;

  return (
    <nav className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
      {/* Previous */}
      <div className="flex-1">
        {prevLesson && (
          <Link
            href={`/subjects/${subjectSlug}/${prevLesson.slug}`}
            className="group flex flex-col items-start gap-0.5 rounded-xl border border-border bg-card px-4 py-3 hover:border-foreground/30 hover:shadow-xs transition-all"
          >
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
              <ChevronLeft className="h-3.5 w-3.5" />
              {t("Previous Lesson", "আগের পাঠ")}
            </span>
            <span className="text-sm font-bold text-foreground line-clamp-2">
              {language === "bn" ? prevLesson.titleBn : prevLesson.titleEn}
            </span>
          </Link>
        )}
      </div>

      {/* Next */}
      <div className="flex-1 flex justify-end">
        {nextLesson && (
          <Link
            href={`/subjects/${subjectSlug}/${nextLesson.slug}`}
            className="group flex flex-col items-end gap-0.5 rounded-xl border border-border bg-card px-4 py-3 hover:border-foreground/30 hover:shadow-xs transition-all text-right"
          >
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
              {t("Next Lesson", "পরের পাঠ")}
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-bold text-foreground line-clamp-2">
              {language === "bn" ? nextLesson.titleBn : nextLesson.titleEn}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
