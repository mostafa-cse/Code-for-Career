import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/profile/profile-view";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `My Candidate Profile — ${SITE_NAME}`,
  description: `Manage your ${SITE_NAME} profile, username, interview readiness, and search peer candidates.`,
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/profile");
  }

  // Fetch or fallback profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const defaultUsername =
    user.email?.split("@")[0]?.toLowerCase()?.replace(/[^a-z0-9_]/g, "") ||
    "candidate";

  const initialUser = {
    id: user.id,
    email: user.email ?? "",
    username:
      (profile as { username?: string })?.username ??
      (user.user_metadata?.username as string | undefined) ??
      defaultUsername,
    name:
      profile?.name ??
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      null,
    avatarUrl:
      profile?.avatar_url ??
      (user.user_metadata?.avatar_url as string | undefined) ??
      null,
    role: profile?.role ?? "USER",
    bio:
      (profile as { bio?: string })?.bio ??
      (user.user_metadata?.bio as string | undefined) ??
      "Software engineering candidate preparing for top Bangladeshi tech companies.",
    targetRole:
      (profile as { target_role?: string })?.target_role ??
      (user.user_metadata?.target_role as string | undefined) ??
      "Software Engineer",
    targetCompanies:
      (profile as { target_companies?: string[] })?.target_companies ??
      (user.user_metadata?.target_companies as string[] | undefined) ??
      ["Enosis", "Therap", "Samsung R&D", "Brain Station 23"],
    githubUrl:
      (profile as { github_url?: string })?.github_url ??
      (user.user_metadata?.github_url as string | undefined) ??
      null,
    linkedinUrl:
      (profile as { linkedin_url?: string })?.linkedin_url ??
      (user.user_metadata?.linkedin_url as string | undefined) ??
      null,
    codeforcesHandle:
      (profile as { codeforces_handle?: string })?.codeforces_handle ??
      (user.user_metadata?.codeforces_handle as string | undefined) ??
      null,
  };

  return <ProfileView initialUser={initialUser} />;
}
