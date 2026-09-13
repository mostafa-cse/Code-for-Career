import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Users, Search, ArrowLeft } from "lucide-react";
import {
  getUserProfileByUsername,
  createProfileFromUserData,
  COMMUNITY_CANDIDATES,
} from "@/lib/user-profiles";
import { PublicProfileView } from "@/components/profile/public-profile-view";
import { createClient } from "@/lib/supabase/server";
import { SITE_NAME } from "@/lib/constants";

interface ProfileUsernamePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProfileUsernamePageProps): Promise<Metadata> {
  const { username } = await params;
  const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");

  const profile = getUserProfileByUsername(cleanUsername);

  if (profile) {
    return {
      title: `${profile.name} (@${profile.username}) — Candidate Profile | ${SITE_NAME}`,
      description: `${profile.name} is preparing for software engineering interviews at ${profile.targetCompanies.join(", ")} on ${SITE_NAME}.`,
      openGraph: {
        title: `${profile.name} (@${profile.username}) — ${profile.targetRole}`,
        description: profile.bio,
      },
    };
  }

  return {
    title: `@${cleanUsername} — Candidate Profile | ${SITE_NAME}`,
    description: `View @${cleanUsername}'s interview preparation progress on ${SITE_NAME}.`,
  };
}

export default async function ProfileUsernamePage({
  params,
}: ProfileUsernamePageProps) {
  const { username } = await params;
  const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");

  // 1. Check community candidates directory
  let profile = getUserProfileByUsername(cleanUsername);

  // 2. If not found in community directory, query Supabase
  if (!profile) {
    try {
      const supabase = await createClient();
      const { data: dbProfile } = await supabase
        .from("profiles")
        .select("*")
        .or(`username.eq.${cleanUsername},email.ilike.${cleanUsername}@%`)
        .maybeSingle();

      if (dbProfile) {
        profile = createProfileFromUserData({
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
      }
    } catch {
      // Supabase query error fallback
    }
  }

  // Check if active user is viewing their own profile
  let isOwner = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && profile) {
      if (user.id === profile.id) {
        isOwner = true;
      } else {
        const userEmailPrefix = user.email?.split("@")[0]?.toLowerCase();
        if (userEmailPrefix === cleanUsername) {
          isOwner = true;
        }
      }
    }
  } catch {
    // Auth check fallback
  }

  // If candidate is still not found, render friendly discovery page
  if (!profile) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 max-w-lg shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-foreground">
            Candidate @{cleanUsername} Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
            We couldn't find a candidate with the username @{cleanUsername}.
            They may have changed their username or haven't published their profile yet.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <Search className="h-4 w-4" />
              <span>Search Other Candidates</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PublicProfileView profile={profile} isOwner={isOwner} />;
}
