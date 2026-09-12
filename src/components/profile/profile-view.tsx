"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/providers/language-provider";
import { useUserProgress } from "@/lib/hooks/use-user-progress";
import { CURRICULUM_TRACKS } from "@/lib/curriculum-data";

interface ProfileViewProps {
  initialUser: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    role?: string;
  };
}

export function ProfileView({ initialUser }: ProfileViewProps) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const { overallStats, trackStats, syncWithCloud } = useUserProgress();

  const [name, setName] = useState(initialUser.name ?? "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
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

  const initials = (name || initialUser.email || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingName(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { full_name: name.trim() },
      });
      await supabase
        .from("profiles")
        .update({ name: name.trim() })
        .eq("id", initialUser.id);

      setSavedSuccess(true);
      setIsEditingName(false);
      setTimeout(() => setSavedSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      console.error("Failed to update profile name:", err);
    } finally {
      setSavingName(false);
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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Profile Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {initialUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={initialUser.avatarUrl}
                alt={name || "User Avatar"}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-border shadow-xs"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-foreground text-background text-2xl font-bold ring-2 ring-border shadow-xs">
                {initials}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
                  {name || t("Anonymous Learner", "নামহীন শিক্ষার্থী")}
                </h1>
                <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {initialUser.role ?? "USER"}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>{initialUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCloudSync}
              disabled={syncing}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-muted disabled:opacity-60"
            >
              {syncing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : syncSuccess ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              <span>
                {syncSuccess
                  ? t("Synced!", "সিঙ্ক হয়েছে!")
                  : t("Sync Progress", "অগ্রগতি সিঙ্ক")}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:border-rose-200 dark:text-rose-400 dark:hover:bg-rose-950/40 disabled:opacity-60"
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

        {/* Edit Name Form */}
        <div className="mt-6 border-t border-border pt-4">
          {!isEditingName ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {t("Display Name:", "প্রদর্শিত নাম:")}{" "}
                <strong className="text-foreground">{name || "—"}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="font-semibold text-foreground underline hover:opacity-80"
              >
                {t("Edit", "সম্পাদনা")}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleUpdateName}
              className="flex flex-wrap items-center gap-2"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("Your name", "আপনার নাম")}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <button
                type="submit"
                disabled={savingName}
                className="flex items-center gap-1 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-xs hover:opacity-90 disabled:opacity-60"
              >
                {savingName && <Loader2 className="h-3 w-3 animate-spin" />}
                {t("Save", "সংরক্ষণ")}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                {t("Cancel", "বাতিল")}
              </button>
            </form>
          )}

          {savedSuccess && (
            <p className="mt-2 text-xs font-medium text-emerald-600">
              {t("Name updated successfully!", "নাম সফলভাবে হালনাগাদ হয়েছে!")}
            </p>
          )}
        </div>
      </div>

      {/* Progress Overview Section */}
      <div className="mt-8 space-y-6">
        <h2 className="text-lg font-bold text-foreground">
          {t("Learning Progress", "শেখার অগ্রগতি")}
        </h2>

        {/* Readiness Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Award className="h-4 w-4 text-amber-500" />
                <span>{t("Interview Readiness", "ইন্টারভিউ প্রস্তুতি")}</span>
              </div>
              <p className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl">
                {language === "bn"
                  ? overallStats.readinessLevelBn
                  : overallStats.readinessLevelEn}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(
                  "Reach 75% curriculum completion for Interview Ready status.",
                  "ইন্টারভিউ উপযোগী স্ট্যাটাসের জন্য ৭৫% কারিকুলাম সম্পন্ন করুন।"
                )}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center sm:text-right">
                <span className="text-2xl font-extrabold text-foreground">
                  {overallStats.percentage}%
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {t("Overall Progress", "মোট অগ্রগতি")}
                </p>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-2xl font-extrabold text-foreground">
                  {overallStats.completedLessons}/{overallStats.totalLessons}
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {t("Lessons Completed", "পাঠ সম্পন্ন")}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-500"
              style={{ width: `${overallStats.percentage}%` }}
            />
          </div>
        </div>

        {/* Track Breakdown Grid */}
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
                className="rounded-xl border border-border bg-card p-5 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {language === "bn" ? track.nameBn : track.nameEn}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {stat.completed} / {stat.total} {t("lessons", "পাঠ")}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-foreground">
                    {stat.percentage}%
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editorial Suggestions Section */}
      <div className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {t("My Editorial Suggestions", "আমার সম্পাদনার প্রস্তাবসমূহ")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t(
                "Track the status of contributions and corrections you submitted to lessons.",
                "পাঠসমূহে আপনার প্রস্তাবিত উন্নয়ন ও সংশোধনের স্ট্যাটাস দেখুন।"
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
  );
}
