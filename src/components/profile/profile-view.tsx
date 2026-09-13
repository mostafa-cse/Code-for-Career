"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Award,
  RefreshCw,
  LogOut,
  Check,
  Loader2,
  Edit3,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Users,
  Flame,
  Building2,
  Target,
  Trophy,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Share2,
  X,
  Code2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/providers/language-provider";
import { useUserProgress } from "@/lib/hooks/use-user-progress";
import { CURRICULUM_TRACKS } from "@/lib/curriculum-data";
import { CandidateSearchModal } from "@/components/profile/candidate-search-modal";
import { UserAvatar } from "@/components/ui/user-avatar";

interface ProfileViewProps {
  initialUser: {
    id: string;
    email: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    role?: string;
    bio?: string;
    targetRole?: string;
    targetCompanies?: string[];
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    codeforcesHandle?: string | null;
  };
}

export function ProfileView({ initialUser }: ProfileViewProps) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const { overallStats, trackStats, syncWithCloud } = useUserProgress();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [username, setUsername] = useState(initialUser.username || "candidate");
  const [name, setName] = useState(initialUser.name || "");
  const [bio, setBio] = useState(
    initialUser.bio ||
      "Dedicated software engineering candidate preparing for technical interviews at top software companies in Bangladesh."
  );
  const [targetRole, setTargetRole] = useState(
    initialUser.targetRole || "Software Engineer"
  );
  const [targetCompaniesInput, setTargetCompaniesInput] = useState(
    (initialUser.targetCompanies || [
      "Enosis",
      "Therap",
      "Samsung R&D",
      "Brain Station 23",
    ]).join(", ")
  );
  const [githubUrl, setGithubUrl] = useState(initialUser.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialUser.linkedinUrl || "");
  const [codeforcesHandle, setCodeforcesHandle] = useState(
    initialUser.codeforcesHandle || ""
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [suggestions, setSuggestions] = useState<
    Array<{
      id: string;
      title: string;
      content: string;
      status: string;
      admin_feedback: string | null;
      created_at: string;
    }>
  >([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  useEffect(() => {
    fetch("/api/suggestions")
      .then((res) => (res.ok ? res.json() : { suggestions: [] }))
      .then((data) => setSuggestions(data.suggestions || []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoadingSuggestions(false));
  }, []);

  const initials = (name || username || initialUser.email || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const targetCompaniesList = targetCompaniesInput
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      const cleanCompanies = targetCompaniesInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      const supabase = createClient();
      // 1. Update Auth User Metadata
      await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
          username: cleanUsername,
          bio: bio.trim(),
          target_role: targetRole.trim(),
          target_companies: cleanCompanies,
          github_url: githubUrl.trim() || null,
          linkedin_url: linkedinUrl.trim() || null,
          codeforces_handle: codeforcesHandle.trim() || null,
        },
      });

      // 2. Update profiles table row
      try {
        await supabase
          .from("profiles")
          .update({
            name: name.trim(),
            username: cleanUsername,
            bio: bio.trim(),
            target_role: targetRole.trim(),
            target_companies: cleanCompanies,
            github_url: githubUrl.trim() || null,
            linkedin_url: linkedinUrl.trim() || null,
            codeforces_handle: codeforcesHandle.trim() || null,
          } as any)
          .eq("id", initialUser.id);
      } catch {
        // Handled if column does not exist yet
      }

      setUsername(cleanUsername);
      setSavedSuccess(true);
      setIsEditModalOpen(false);
      setTimeout(() => setSavedSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  }

  function handleCopyProfileLink() {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/profile/${username}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    }
  }

  async function handleCloudSync() {
    setSyncing(true);
    setSyncSuccess(false);
    await syncWithCloud();
    setSyncing(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  }

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-8">
      {/* Candidate Search Modal */}
      <CandidateSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* ─────────────────────────────────────────────────────────────
          1. FULL-WIDTH SEARCH HERO BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-emerald-500/30 shadow-md">
        <div className="rounded-[1.45rem] bg-card/95 dark:bg-[#080e1b]/95 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t("Find Other Candidates by Username", "ইউজারনেম দিয়ে অন্য সহকর্মীদের খুঁজুন")}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {t(
                  "Discover fellow candidates preparing for Enosis, Therap, and Samsung",
                  "এনোসিস, থেরাপ ও স্যামসাংয়ের জন্য প্রস্তুতরত সহকর্মীদের প্রোফাইল ও অগ্রগতি দেখুন"
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="group relative flex items-center justify-between gap-3 w-full sm:w-80 rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-xs text-muted-foreground hover:border-blue-500/50 hover:text-foreground transition-all shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="h-3.5 w-3.5 text-blue-500" />
              <span>{t("Search @username, company...", "@ইউজারনেম, কোম্পানি খুঁজুন...")}</span>
            </span>
            <kbd className="hidden sm:inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground border border-border">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. EXPANSIVE MULTI-COLUMN FULL-PAGE GRID (Up to 1760px)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ═════════════════════════════════════════════════════════
            LEFT COLUMN: STICKY PERSONAL IDENTITY CARD (Cols 1-4)
        ═════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 xl:col-span-3.5 space-y-6 lg:sticky lg:top-6">
          <div className="rounded-[2.2rem] p-[1.5px] bg-gradient-to-b from-white/20 via-white/10 to-transparent shadow-xl">
            <div className="relative overflow-hidden rounded-[2.1rem] border border-border/80 bg-card/95 dark:bg-[#070c18]/95 p-6 backdrop-blur-2xl text-center sm:text-left">
              {/* Avatar + Status */}
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-border/70">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-amber-500 via-blue-500 to-emerald-400 opacity-50 blur-xs" />
                  <UserAvatar
                    src={initialUser.avatarUrl}
                    name={name || username}
                    shape="rounded"
                    sizeClassName="relative h-20 w-20 sm:h-22 sm:w-22"
                    className="ring-2 ring-background shadow-lg"
                    textClassName="text-2xl"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-amber-400/40 bg-amber-500 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-xs">
                    PRO
                  </div>
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <h1 className="text-xl font-black text-foreground">
                      {name || t("Engineering Candidate", "প্রকৌশল পরীক্ষার্থী")}
                    </h1>
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-500 dark:text-blue-400 inline-block mt-0.5">
                    @{username}
                  </span>
                  <p className="text-xs font-bold text-muted-foreground mt-1">
                    {targetRole}
                  </p>
                </div>
              </div>

              {/* Bio & Email */}
              <div className="py-4 border-b border-border/70 text-xs text-foreground/80 leading-relaxed">
                <p>{bio}</p>
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-2">
                  <Mail className="h-3 w-3" />
                  <span>{initialUser.email}</span>
                </p>
              </div>

              {/* Targets */}
              <div className="py-4 border-b border-border/70">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {t("Target Companies:", "টার্গেট কোম্পানি:")}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {targetCompaniesList.map((comp) => (
                    <span
                      key={comp}
                      className="rounded bg-muted/80 px-2 py-0.5 text-[10px] font-bold text-foreground border border-border/70 shadow-2xs"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Suite */}
              <div className="pt-4 flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted hover:border-border transition-colors shadow-xs cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{t("Edit", "সম্পাদনা")}</span>
                  </button>

                  <Link
                    href={`/profile/${username}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors shadow-xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{t("Public Page", "পাবলিক পেজ")}</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleCopyProfileLink}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500">{t("Copied!", "কপি হয়েছে!")}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t("Copy Public Profile URL", "প্রোফাইল লিংক কপি")}</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCloudSync}
                    disabled={syncing}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-muted disabled:opacity-60 cursor-pointer"
                  >
                    {syncing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : syncSuccess ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    <span>{syncSuccess ? t("Synced!", "সিঙ্ক!") : t("Cloud Sync", "সিঙ্ক")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:border-rose-200 dark:text-rose-400 dark:hover:bg-rose-950/40 disabled:opacity-60 cursor-pointer"
                  >
                    {signingOut ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <LogOut className="h-3.5 w-3.5" />
                    )}
                    <span>{t("Sign Out", "সাইন আউট")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            RIGHT AREA: HUD, TRACK PROGRESS, EDITORIALS (Cols 5-12)
        ═════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 xl:col-span-8.5 space-y-8">
          {/* ─────────────────────────────────────────────────────────
              3. FOUR-METRIC CANDIDATE HUD MATRIX
          ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Card 1: Readiness */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("Interview Readiness", "ইন্টারভিউ প্রস্তুতি")}
                </span>
                <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground font-mono">
                    {overallStats.percentage}%
                  </span>
                  <span className="text-xs font-bold text-amber-500">
                    {language === "bn"
                      ? overallStats.readinessLevelBn
                      : overallStats.readinessLevelEn}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t("Reach 75% for Interview Ready", "৭৫% এ সাক্ষাৎকার প্রস্তুত")}
                </p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${overallStats.percentage}%` }}
                />
              </div>
            </div>

            {/* Card 2: Lessons */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("Lessons Completed", "পাঠ সম্পন্ন")}
                </span>
                <BookOpen className="h-4 w-4 text-blue-500" />
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground font-mono">
                    {overallStats.completedLessons}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    / {overallStats.totalLessons} {t("topics", "টপিক")}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t("Curriculum syllabus coverage", "কারিকুলাম সিলেবাস কভারেজ")}
                </p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${overallStats.totalLessons > 0 ? (overallStats.completedLessons / overallStats.totalLessons) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Card 3: Solved Problems */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("Problems Solved", "কোডিং সমস্যা")}
                </span>
                <Target className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground font-mono">
                    {overallStats.solvedProblems}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {t("solved", "সমাধান")}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t("Tested against BD interview sets", "বিডি কোম্পানি ইন্টারভিউ সেট")}
                </p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (overallStats.solvedProblems / 40) * 100)}%` }}
                />
              </div>
            </div>

            {/* Card 4: Rank */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("Candidate Rank", "পরীক্ষার্থী র‍্যাংক")}
                </span>
                <Trophy className="h-4 w-4 text-amber-400" />
              </div>
              <div className="my-2">
                <span className="text-lg font-black text-foreground block">
                  {t("Active Contender", "সক্রিয় প্রস্তুতকারী")}
                </span>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  {t("Community Profile Published ✓", "কমিউনিটি প্রোফাইল প্রস্তুত ✓")}
                </p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full w-full" />
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              4. TRACK MASTERY BREAKDOWN
          ───────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-foreground tracking-tight">
              {t("Track Progress Breakdown", "ট্র্যাক অনুযায়ী প্রস্তুতি")}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {CURRICULUM_TRACKS.map((track) => {
                const stat = trackStats[track.id] ?? {
                  completed: 0,
                  total: 0,
                  percentage: 0,
                };

                return (
                  <div
                    key={track.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          {language === "bn" ? track.nameBn : track.nameEn}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {stat.completed} / {stat.total} {t("lessons completed", "পাঠ সম্পন্ন")}
                        </p>
                      </div>
                      <span className="text-sm font-extrabold text-foreground font-mono">
                        {stat.percentage}%
                      </span>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              5. EDITORIAL CONTRIBUTIONS
          ───────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-foreground">
                  {t("My Editorial Contributions", "আমার সম্পাদনার প্রস্তাবসমূহ")}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t(
                    "Track the status of contributions and improvements you proposed.",
                    "কারিকুলাম উন্নয়নে আপনার প্রস্তাবসমূহের স্ট্যাটাস ট্র্যাক করুন।"
                  )}
                </p>
              </div>
              <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {suggestions.length}
              </span>
            </div>

            {loadingSuggestions ? (
              <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-10">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : suggestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card py-10 text-center">
                <Edit3 className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-xs font-semibold text-foreground">
                  {t("No suggestions yet", "এখনও কোনো প্রস্তাব জমা দেওয়া হয়নি")}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground max-w-sm mx-auto">
                  {t(
                    "Notice something missing or incorrect? Click 'Suggest Edit' while reading any lesson to propose improvements.",
                    "কোনো ভুল বা ঘাটতি চোখে পড়েছে? যেকোনো পাঠ পড়ার সময় 'পরামর্শ' বাটনে ক্লিক করে অবদান রাখুন।"
                  )}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {suggestions.map((item) => {
                  const isApproved = item.status === "APPROVED";
                  const isRejected = item.status === "REJECTED";

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border bg-card p-4 shadow-xs"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">
                              {item.title}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.content}
                          </p>
                          {item.admin_feedback && (
                            <div className="mt-2 rounded-lg border border-border bg-muted/60 p-2 text-xs text-foreground">
                              <strong className="text-[11px] text-muted-foreground block mb-0.5">
                                {t("Reviewer Feedback:", "পর্যালোচকের মন্তব্য:")}
                              </strong>
                              {item.admin_feedback}
                            </div>
                          )}
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5 self-start">
                          {isApproved ? (
                            <span className="flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" />
                              {t("Approved", "অনুমোদিত")}
                            </span>
                          ) : isRejected ? (
                            <span className="flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                              <XCircle className="h-3 w-3" />
                              {t("Declined", "বাতিল")}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                              <Clock className="h-3 w-3" />
                              {t("Pending Review", "পর্যালোচনাধীন")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. EDIT PROFILE MODAL
      ───────────────────────────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative z-50 w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-base font-bold text-foreground">
                {t("Edit Candidate Profile", "প্রার্থী প্রোফাইল সম্পাদনা")}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {t("Unique Handle (@username)", "ইউনিক হ্যান্ডেল (@ইউজারনেম)")}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-mono text-sm font-bold text-muted-foreground">
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                    }
                    placeholder="e.g. mostafakamal"
                    className="w-full rounded-xl border border-border bg-background py-2 pl-7 pr-3 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {t(
                    "Your public link: bdsoftwareprep.com/profile/",
                    "আপনার পাবলিক লিংক: bdsoftwareprep.com/profile/"
                  )}
                  {username}
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {t("Display Name", "প্রদর্শিত নাম")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mostafa Kamal"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Target Role */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {t("Target Role / Headline", "টার্গেট পদবী / হেডলাইন")}
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Backend / Full-Stack Engineer"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {t("Candidate Bio / Elevator Pitch", "সংক্ষিপ্ত জীবনবৃত্তান্ত")}
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief intro about your goals and technical passions..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Target Companies */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  {t("Target Companies (comma separated)", "টার্গেট কোম্পানি (কমা দিয়ে লিখুন)")}
                </label>
                <input
                  type="text"
                  value={targetCompaniesInput}
                  onChange={(e) => setTargetCompaniesInput(e.target.value)}
                  placeholder="e.g. Enosis, Therap, Samsung R&D, Brain Station 23"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* GitHub & Codeforces handles */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Codeforces Handle
                  </label>
                  <input
                    type="text"
                    value={codeforcesHandle}
                    onChange={(e) => setCodeforcesHandle(e.target.value)}
                    placeholder="e.g. tourist"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  {t("Cancel", "বাতিল")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 cursor-pointer"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {t("Save Changes", "সংরক্ষণ করুন")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
