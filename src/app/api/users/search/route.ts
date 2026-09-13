import { NextRequest, NextResponse } from "next/server";
import { searchUserProfiles, COMMUNITY_CANDIDATES } from "@/lib/user-profiles";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();

  try {
    // 1. Get matches from community candidates
    const communityMatches = searchUserProfiles(query);

    // 2. Query Supabase profiles if possible
    let dbMatches: Array<{
      id: string;
      username: string;
      name: string;
      avatarUrl: string | null;
      role: "USER" | "ADMIN";
      targetRole: string;
      targetCompanies: string[];
      readinessLevelEn: string;
      completedLessons: number;
    }> = [];

    try {
      const supabase = await createClient();
      let dbQuery = supabase.from("profiles").select("*").limit(10);
      if (query) {
        const cleanQ = query.replace(/^@/, "");
        dbQuery = dbQuery.or(`name.ilike.%${cleanQ}%,email.ilike.%${cleanQ}%`);
      }

      const { data: dbProfiles } = await dbQuery;

      if (dbProfiles && dbProfiles.length > 0) {
        dbMatches = dbProfiles.map((p) => {
          const derivedUsername =
            (p as { username?: string }).username ||
            p.email?.split("@")[0]?.toLowerCase()?.replace(/[^a-z0-9_]/g, "") ||
            "candidate";

          return {
            id: p.id,
            username: derivedUsername,
            name: p.name || derivedUsername,
            avatarUrl: p.avatar_url,
            role: (p.role as "USER" | "ADMIN") || "USER",
            targetRole: (p as { target_role?: string }).target_role || "Software Engineer",
            targetCompanies: (p as { target_companies?: string[] }).target_companies || [
              "Enosis",
              "Therap",
              "Samsung R&D",
            ],
            readinessLevelEn: "Intermediate",
            completedLessons: 15,
          };
        });
      }
    } catch {
      // Supabase query failed or offline; gracefully fallback to community candidates
    }

    // Merge and deduplicate by username
    const seen = new Set<string>();
    const results: any[] = [];

    for (const c of communityMatches) {
      if (!seen.has(c.username.toLowerCase())) {
        seen.add(c.username.toLowerCase());
        results.push({
          id: c.id,
          username: c.username,
          name: c.name,
          avatarUrl: c.avatarUrl,
          role: c.role,
          bio: c.bio,
          targetRole: c.targetRole,
          targetCompanies: c.targetCompanies,
          location: c.location,
          readinessLevelEn: c.readinessLevelEn,
          readinessLevelBn: c.readinessLevelBn,
          readinessPercentage: c.readinessPercentage,
          completedLessons: c.completedLessons,
          solvedProblems: c.solvedProblems,
          rankTitleEn: c.rankTitleEn,
        });
      }
    }

    for (const d of dbMatches) {
      if (!seen.has(d.username.toLowerCase())) {
        seen.add(d.username.toLowerCase());
        results.push(d);
      }
    }

    return NextResponse.json({
      candidates: results,
      total: results.length,
      query,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search candidates", candidates: COMMUNITY_CANDIDATES.slice(0, 5) },
      { status: 500 }
    );
  }
}
