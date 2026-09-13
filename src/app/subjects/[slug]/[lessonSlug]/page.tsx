import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SUBJECTS, SITE_NAME } from "@/lib/constants";
import {
  getSubjectLessons,
  getLessonBySlug,
  getSubjectCategories,
} from "@/lib/lessons-data";
import { MdxRenderer } from "@/components/mdx/mdx-renderer";
import { LessonShell } from "@/components/lessons/lesson-shell";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string; lessonSlug: string }[] = [];
  for (const subject of SUBJECTS) {
    const lessons = getSubjectLessons(subject.slug);
    for (const lesson of lessons) {
      params.push({ slug: subject.slug, lessonSlug: lesson.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const subject = SUBJECTS.find((s) => s.slug === slug);
  const lesson = getLessonBySlug(slug, lessonSlug);
  if (!subject || !lesson) return {};
  return {
    title: `${lesson.titleEn} — ${subject.nameEn} | ${SITE_NAME}`,
    description: `${lesson.titleEn}: A structured lesson for software job preparation on ${SITE_NAME} covering ${subject.nameEn}.`,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;

  const subject = SUBJECTS.find((s) => s.slug === slug);
  if (!subject) notFound();

  const lesson = getLessonBySlug(slug, lessonSlug);
  if (!lesson) notFound();

  const allLessons = getSubjectLessons(slug);
  const categories = getSubjectCategories(slug);

  // Render both language MDX variants as React nodes server-side.
  // Both are rendered into the DOM; the client LessonShell controls visibility
  // via hidden/block based on the selected language.
  const contentEn = (
    <div
      data-lang="en"
      className="prose prose-neutral dark:prose-invert max-w-none"
    >
      <MdxRenderer source={lesson.contentEn} />
    </div>
  );

  const contentBn = (
    <div
      data-lang="bn"
      className="prose prose-neutral dark:prose-invert max-w-none"
    >
      <MdxRenderer source={lesson.contentBn} />
    </div>
  );

  return (
    <LessonShell
      lesson={lesson}
      allLessons={allLessons}
      categories={categories}
      subjectSlug={slug}
      subjectNameEn={subject.nameEn}
      subjectNameBn={subject.nameBn}
      subjectIcon={subject.icon}
      subjectColor={subject.color}
      contentEn={contentEn}
      contentBn={contentBn}
    />
  );
}
