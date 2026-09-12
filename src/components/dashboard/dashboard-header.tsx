"use client";

import Link from "next/link";
import {
  TrendingUp,
  Network,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Target,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useUserProgress } from "@/lib/hooks/use-user-progress";

export function DashboardHeader() {
  const { t } = useLanguage();
  const { overallStats } = useUserProgress();

  const notStarted = Math.max(
    12 - overallStats.completedSubjects - overallStats.inProgressCount,
    0
  );
  const completedPct = (overallStats.completedSubjects / 12) * 100;
  const inProgressPct = (overallStats.inProgressCount / 12) * 100;

  return (
    <div className="w-full bg-[#1d58d8] dark:bg-[#122e6b] text-white border-b border-blue-600/30 dark:border-blue-900/50 relative overflow-hidden">
      {/* Background grid texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Main Banner Content */}
      <div className="relative w-full px-6 sm:px-8 lg:px-10 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Title & Description */}
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-100 backdrop-blur-xs border border-white/20">
                <Sparkles className="h-3 w-3 text-blue-200" />
                {t("Candidate Dashboard", "প্রার্থী ড্যাশবোর্ড")}
              </span>
              <span className="text-xs text-blue-200 font-medium">
                • {t("Full Curriculum Tracker", "সম্পূর্ণ পাঠ্যক্রম ট্র্যাকার")}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {t("Preparation Overview", "প্রস্তুতির সামগ্রিক চিত্র")}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed max-w-2xl">
              {t(
                "Track your comprehensive progress across 12 core software engineering subjects, interview problems, and curriculum lessons. Pinned edge-to-edge for focused study.",
                "১২টি মূল কম্পিউটার সায়েন্স ও সফটওয়্যার ইঞ্জিনিয়ারিং বিষয়ে আপনার সামগ্রিক অগ্রগতি ট্র্যাক করুন।"
              )}
            </p>
          </div>

          {/* Right: Readiness Index + Quick Actions */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Readiness Index Card */}
            <div className="flex items-center gap-3.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3 shadow-lg shadow-blue-950/20">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 border border-white/20">
                <TrendingUp className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                  {t("Readiness Index", "প্রস্তুতি সূচক")}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tight text-white">
                    {overallStats.percentage}
                  </span>
                  <span className="text-base font-bold text-blue-200">%</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                href="/roadmap"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 shadow-xs"
              >
                <Network className="h-4 w-4 text-blue-200" />
                <span>{t("Interactive Roadmap", "ইন্টারেক্টিভ রোডম্যাপ")}</span>
              </Link>

              <Link
                href="/subjects/csharp"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50 shadow-md shadow-blue-900/30"
              >
                <span>{t("Continue Learning", "পড়াশোনা চালিয়ে যান")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs font-semibold text-blue-100">
            <div className="flex items-center gap-4">
              <span>
                {overallStats.completedLessons} / {overallStats.totalLessons}{" "}
                {t("Lessons Completed", "পাঠ সম্পন্ন")}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300">
                {overallStats.completedSubjects} {t("Subjects Done", "বিষয় সম্পন্ন")}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-amber-300">
                {overallStats.inProgressCount} {t("In Progress", "চলমান")}
              </span>
            </div>
            <span className="font-mono text-xs text-blue-200">
              {Math.round((overallStats.completedLessons / Math.max(overallStats.totalLessons, 1)) * 100)}% {t("Overall", "সামগ্রিক")}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-black/25">
            <div className="flex h-full w-full">
              <div
                className="h-full bg-emerald-400 transition-all duration-700"
                style={{ width: `${completedPct}%` }}
              />
              <div
                className="h-full bg-amber-400 transition-all duration-700"
                style={{ width: `${inProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edge-to-Edge Integrated Metrics Strip (Replaces separate floating card grid) */}
      <div className="w-full border-t border-white/10 bg-black/20 backdrop-blur-xs px-6 sm:px-8 lg:px-10 py-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-emerald-300 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                {t("Lessons Done", "সম্পন্ন পাঠ")}
              </p>
              <p className="text-sm font-black text-white leading-tight">
                {overallStats.completedLessons} / {overallStats.totalLessons}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-amber-300 shrink-0">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                {t("Active Modules", "চলমান মডিউল")}
              </p>
              <p className="text-sm font-black text-white leading-tight">
                {overallStats.inProgressCount}{" "}
                <span className="text-xs font-normal text-blue-200">{t("active", "অধ্যয়নরত")}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-blue-300 shrink-0">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                {t("Problems Solved", "সমাধানকৃত সমস্যা")}
              </p>
              <p className="text-sm font-black text-white leading-tight">
                {overallStats.solvedProblems}{" "}
                <span className="text-xs font-normal text-blue-200">{t("solved", "সমাধান")}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-purple-300 shrink-0">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                {t("Total Subjects", "মোট বিষয়")}
              </p>
              <p className="text-sm font-black text-white leading-tight">
                12 {t("Subjects", "বিষয়")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
