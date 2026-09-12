import { createClient } from "@/lib/supabase/server";
import type { Database, SuggestionStatus } from "@/types/database";

export type SuggestionRow = Database["public"]["Tables"]["editorial_suggestions"]["Row"];

export async function submitEditorialSuggestion(
  userId: string,
  lessonId: string,
  title: string,
  content: string
): Promise<SuggestionRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("editorial_suggestions")
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      title,
      content,
      status: "PENDING",
      admin_feedback: null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting suggestion:", error);
    return null;
  }
  return data;
}

export async function getUserSuggestions(userId: string): Promise<SuggestionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("editorial_suggestions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
  return data ?? [];
}

export async function updateSuggestionStatus(
  suggestionId: string,
  status: SuggestionStatus,
  feedback?: string
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("editorial_suggestions")
    .update({
      status,
      admin_feedback: feedback ?? null,
    })
    .eq("id", suggestionId);

  if (error) {
    console.error("Error reviewing suggestion:", error);
    return false;
  }
  return true;
}
