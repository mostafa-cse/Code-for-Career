"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { LessonHeader } from "@/components/lessons/lesson-header";
import { LessonSidebar } from "@/components/lessons/lesson-sidebar";
import { ProblemList } from "@/components/lessons/problem-list";
import { LessonNav } from "@/components/lessons/lesson-nav";
import type { LocalLesson } from "@/lib/lessons-data";

interface LessonReaderProps {
  lesson: LocalLesson;
  allLessons: LocalLesson[];
  subjectSlug: string;
  subjectNameEn: string;
  subjectNameBn: string;
  subjectIcon: string;
  subjectColor: string;
  /** Pre-rendered MDX HTML for each language */
  contentEnHtml: string;
  contentBnHtml: string;
}

export function LessonReader({
  lesson,
  allLessons,
  subjectSlug,
  subjectNameEn,
  subjectNameBn,
  subjectIcon,
  subjectColor,
  contentEnHtml,
  contentBnHtml,
}: LessonReaderProps) {
  const { language, setLanguage } = useLanguage();
  const [displayLang, setDisplayLang] = useState<"en" | "bn">(language);

  function handleToggle() {
    const next: "en" | "bn" = displayLang === "en" ? "bn" : "en";
    setDisplayLang(next);
    setLanguage(next);
  }

  const lessonIndex = allLessons.findIndex((l) => l.slug === lesson.slug);
  const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

  const contentHtml = displayLang === "bn" ? contentBnHtml : contentEnHtml;

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <LessonSidebar
        subjectSlug={subjectSlug}
        subjectNameEn={subjectNameEn}
        subjectNameBn={subjectNameBn}
        lessons={allLessons}
        activeLessonSlug={lesson.slug}
      />

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <LessonHeader
          lesson={lesson}
          subjectSlug={subjectSlug}
          subjectNameEn={subjectNameEn}
          subjectNameBn={subjectNameBn}
          subjectIcon={subjectIcon}
          subjectColor={subjectColor}
          language={displayLang}
          onLanguageToggle={handleToggle}
        />

        {/* MDX body — dangerouslySetInnerHTML is safe here: content is from our own seed/local files */}
        <article
          className="prose prose-neutral dark:prose-invert mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <ProblemList problems={lesson.problems} />
        <LessonNav
          subjectSlug={subjectSlug}
          prevLesson={prevLesson ?? null}
          nextLesson={nextLesson ?? null}
        />
      </main>
    </div>
  );
}
