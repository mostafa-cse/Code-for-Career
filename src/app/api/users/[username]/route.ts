import { NextRequest, NextResponse } from "next/server";
import {
  getUserProfileByUsername,
  createProfileFromUserData,
} from "@/lib/user-profiles";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");

  // 1. Check if it's in our community candidates
  const communityProfile = getUserProfileByUsername(cleanUsername);
  if (communityProfile) {
    return NextResponse.json({ profile: communityProfile });
  }

  // 2. Query Supabase profiles table
  try {
    const supabase = await createClient();
    const { data: dbProfile } = await supabase
      .from("profiles")
      .select("*")
      .or(`username.eq.${cleanUsername},email.ilike.${cleanUsername}@%`)
      .maybeSingle();

    if (dbProfile) {
      const profile = createProfileFromUserData({
        id: dbProfile.id,
        email: dbProfile.email,
        name: dbProfile.name,
        avatarUrl: dbProfile.avatar_url,
        role: dbProfile.role,
        username: (dbProfile as { username?: string }).username || cleanUsername,
        bio: (dbProfile as { bio?: string }).bio,
        targetRole: (dbProfile as { target_role?: string }).target_role,
        targetCompanies: (dbProfile as { target_companies?: string[] }).target_companies,
        githubUrl: (dbProfile as { github_url?: string }).github_url,
        linkedinUrl: (dbProfile as { linkedin_url?: string }).linkedin_url,
        codeforcesHandle: (dbProfile as { codeforces_handle?: string }).codeforces_handle,
        location: (dbProfile as { location?: string }).location,
      });

      return NextResponse.json({ profile });
    }
  } catch {
    // Supabase query fallback
  }

  return NextResponse.json({ error: "User not found" }, { status: 404 });
}
