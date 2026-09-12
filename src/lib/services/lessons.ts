import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];
export type ResourceRow = Database["public"]["Tables"]["resources"]["Row"];
export type ProblemRow = Database["public"]["Tables"]["problems"]["Row"];

export interface LessonDetail extends LessonRow {
  resources: ResourceRow[];
  problems: ProblemRow[];
}

export async function getLessonsBySubjectId(subjectId: string): Promise<LessonRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("subject_id", subjectId)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
  return data ?? [];
}

export async function getLessonBySlug(
  subjectSlug: string,
  lessonSlug: string
): Promise<LessonDetail | null> {
  const supabase = await createClient();
  const { data: subject } = await supabase
    .from("subjects")
    .select("id")
    .eq("slug", subjectSlug)
    .single();

  if (!subject) return null;

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*, resources(*), problems(*)")
    .eq("subject_id", subject.id)
    .eq("slug", lessonSlug)
    .single();

  if (error || !lesson) {
    console.error(`Error fetching lesson ${lessonSlug}:`, error);
    return null;
  }
  return lesson as LessonDetail;
}
