import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SUBJECTS, SITE_NAME } from "@/lib/constants";
import { getSubjectLessons, getSubjectCategories } from "@/lib/lessons-data";
import { UsacoSubjectView } from "@/components/subjects/usaco-subject-view";

interface SubjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SUBJECTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const subject = SUBJECTS.find((s) => s.slug === slug);
  if (!subject) return {};
  return {
    title: `${subject.nameEn} — ${SITE_NAME}`,
    description: `Comprehensive syllabus and practice problems for ${subject.nameEn}. Prepared for Bangladeshi software engineering job interviews (Enosis, Brain Station 23, Therap).`,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { slug } = await params;

  const subject = SUBJECTS.find((s) => s.slug === slug);
  if (!subject) notFound();

  const lessons = getSubjectLessons(slug);
  const categories = getSubjectCategories(slug);

  return (
    <UsacoSubjectView
      subject={subject}
      categories={categories}
      allLessons={lessons}
    />
  );
}

