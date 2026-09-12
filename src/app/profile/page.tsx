import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/profile/profile-view";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `User Profile — ${SITE_NAME}`,
  description: "View and manage your BD Software Prep learning profile and progress.",
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

  const initialUser = {
    id: user.id,
    email: user.email ?? "",
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
  };

  return <ProfileView initialUser={initialUser} />;
}
