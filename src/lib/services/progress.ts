import { createClient } from "@/lib/supabase/server";
import type { Database, ProgressStatus } from "@/types/database";

export type UserProgressRow = Database["public"]["Tables"]["user_progress"]["Row"];

export async function getUserLessonProgress(userId: string): Promise<UserProgressRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user progress:", error);
    return [];
  }
  return data ?? [];
}

export async function upsertLessonProgress(
  userId: string,
  lessonId: string,
  status: ProgressStatus
): Promise<boolean> {
  const supabase = await createClient();
  const completedAt = status === "COMPLETED" ? new Date().toISOString() : null;

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      status,
      completed_at: completedAt,
    },
    { onConflict: "user_id,lesson_id" }
  );

  if (error) {
    console.error("Error updating progress:", error);
    return false;
  }
  return true;
}
