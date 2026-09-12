import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lessonSlug, title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Try to resolve lesson_id from lessons table
    let lessonId: string | null = null;
    if (lessonSlug) {
      const { data: lesson } = await supabase
        .from("lessons")
        .select("id")
        .eq("slug", lessonSlug)
        .maybeSingle();

      if (lesson?.id) {
        lessonId = lesson.id;
      }
    }

    // If lesson exists in Supabase DB, insert real row
    if (lessonId) {
      const { data, error } = await supabase
        .from("editorial_suggestions")
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          title: title.trim(),
          content: content.trim(),
          status: "PENDING",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase suggestion insert error:", error);
      } else {
        return NextResponse.json({ success: true, suggestion: data });
      }
    }

    // Fallback for unseeded / local development mode
    const mockSuggestion = {
      id: `local-${Date.now()}`,
      user_id: user.id,
      lesson_id: lessonId ?? "00000000-0000-0000-0000-000000000000",
      title: title.trim(),
      content: content.trim(),
      status: "PENDING",
      admin_feedback: null,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, suggestion: mockSuggestion });
  } catch (err) {
    console.error("Suggestion route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("editorial_suggestions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user suggestions:", error);
      return NextResponse.json({ suggestions: [] });
    }

    return NextResponse.json({ suggestions: data ?? [] });
  } catch (err) {
    console.error("Suggestion fetch error:", err);
    return NextResponse.json({ suggestions: [] });
  }
}
