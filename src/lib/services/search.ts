import { createClient } from "@/lib/supabase/server";

export interface SearchResult {
  id: string;
  subject_slug: string;
  lesson_slug: string;
  title: string;
  snippet: string;
  rank: number;
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_content", {
    search_query: query.trim(),
  });

  if (error) {
    console.error("Search query error:", error);
    return [];
  }
  return (data as SearchResult[]) ?? [];
}
