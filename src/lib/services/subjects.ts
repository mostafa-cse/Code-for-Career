import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type SubjectRow = Database["public"]["Tables"]["subjects"]["Row"];

export async function getAllSubjects(): Promise<SubjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
  return data ?? [];
}

export async function getSubjectBySlug(slug: string): Promise<SubjectRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching subject ${slug}:`, error);
    return null;
  }
  return data;
}
