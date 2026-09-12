import { NextResponse, type NextRequest } from "next/server";
import { SUBJECTS } from "@/lib/constants";
import { CURRICULUM_SUBJECTS } from "@/lib/curriculum-data";
import { LOCAL_CURRICULUM } from "@/lib/lessons-data";
import { createClient } from "@/lib/supabase/server";

export interface SearchItemResult {
  id: string;
  type: "subject" | "lesson" | "problem";
  title: string;
  titleBn?: string;
  subtitle?: string;
  url: string;
  badge?: string;
  company?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const queryLower = q.toLowerCase();
  const results: SearchItemResult[] = [];

  // 1. Search Subjects
  for (const sub of SUBJECTS) {
    const curSub = CURRICULUM_SUBJECTS.find((c) => c.slug === sub.slug);
    const topicsMatch = curSub?.topicsEn.some((t) =>
      t.toLowerCase().includes(queryLower)
    ) || curSub?.topicsBn.some((t) => t.includes(q));

    if (
      sub.nameEn.toLowerCase().includes(queryLower) ||
      sub.nameBn.includes(q) ||
      sub.slug.toLowerCase().includes(queryLower) ||
      topicsMatch
    ) {
      results.push({
        id: `sub-${sub.slug}`,
        type: "subject",
        title: sub.nameEn,
        titleBn: sub.nameBn,
        subtitle: curSub?.topicsEn.slice(0, 3).join(", "),
        url: `/subjects/${sub.slug}`,
        badge: "Subject",
      });
    }
  }

  // 2. Search Local Lessons & Problems
  for (const [subSlug, subjectData] of Object.entries(LOCAL_CURRICULUM)) {
    const subMeta = SUBJECTS.find((s) => s.slug === subSlug);

    for (const lesson of subjectData.lessons) {
      // Check lesson match
      if (
        lesson.titleEn.toLowerCase().includes(queryLower) ||
        lesson.titleBn.includes(q) ||
        lesson.contentEn.toLowerCase().includes(queryLower) ||
        lesson.contentBn.includes(q)
      ) {
        results.push({
          id: `lesson-${subSlug}-${lesson.slug}`,
          type: "lesson",
          title: lesson.titleEn,
          titleBn: lesson.titleBn,
          subtitle: `${subMeta?.nameEn ?? subSlug} • ~${lesson.estimatedMinutes}m`,
          url: `/subjects/${subSlug}/${lesson.slug}`,
          badge: lesson.difficulty,
        });
      }

      // Check problems in lesson
      for (const prob of lesson.problems) {
        const companyMatch = prob.company
          ?.toLowerCase()
          .includes(queryLower);
        const tagsMatch = prob.tags.some((t) =>
          t.toLowerCase().includes(queryLower)
        );
        const nameMatch = prob.name.toLowerCase().includes(queryLower);

        if (companyMatch || tagsMatch || nameMatch) {
          results.push({
            id: `prob-${subSlug}-${lesson.slug}-${prob.name}`,
            type: "problem",
            title: prob.name,
            subtitle: `${lesson.titleEn} (${prob.source})`,
            url: `/subjects/${subSlug}/${lesson.slug}`,
            badge: prob.difficulty,
            company: prob.company ?? undefined,
          });
        }
      }
    }
  }

  // 3. Query Supabase RPC if database is online
  try {
    const supabase = await createClient();
    const { data: dbResults } = await supabase.rpc("search_content", {
      search_query: q,
    });

    if (Array.isArray(dbResults)) {
      for (const row of dbResults as Array<{
        id: string;
        subject_slug: string;
        lesson_slug: string;
        title: string;
        snippet: string;
      }>) {
        const exists = results.some(
          (r) =>
            r.url === `/subjects/${row.subject_slug}/${row.lesson_slug}`
        );
        if (!exists) {
          results.push({
            id: `db-${row.id}`,
            type: "lesson",
            title: row.title,
            subtitle: row.snippet.replace(/<[^>]*>/g, ""),
            url: `/subjects/${row.subject_slug}/${row.lesson_slug}`,
            badge: "Lesson",
          });
        }
      }
    }
  } catch {
    // Supabase RPC search failure handled gracefully
  }

  return NextResponse.json({ results });
}
