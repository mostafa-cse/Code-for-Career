"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Network } from "lucide-react";
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
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="p-6 sm:p-8">
        {/* Title row */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-md border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("Candidate Dashboard", "প্রার্থী ড্যাশবোর্ড")}
            </span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {t("Preparation Overview", "প্রস্তুতির সামগ্রিক চিত্র")}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t(
                "Track your progress across 12 core subjects. Stay consistent to ace written tests and technical interviews.",
                "১২টি মূল বিষয়ে আপনার অগ্রগতি পর্যবেক্ষণ করুন। নিয়মিত অনুশীলনই লিখিত পরীক্ষা ও প্রযুক্তি সাক্ষাৎকারে সাফল্যের চাবিকাঠি।"
              )}
            </p>
          </div>

          {/* Readiness score chip */}
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-muted/40 px-5 py-4">
            <TrendingUp className="h-5 w-5 shrink-0 text-foreground/70" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t("Readiness Index", "প্রস্তুতি সূচক")}
              </p>
              <p className="mt-0.5 text-3xl font-black leading-none tracking-tight text-foreground">
                {overallStats.percentage}
                <span className="ml-0.5 text-lg font-semibold text-muted-foreground">
                  %
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 3-stat summary row */}
        <div className="mt-6 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border bg-muted/20">
          <div className="px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t("Completed", "সম্পন্ন")}
              </p>
            </div>
            <p className="mt-1 text-2xl font-black text-foreground">
              {overallStats.completedSubjects}
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                / 12
              </span>
            </p>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t("In Progress", "চলমান")}
              </p>
            </div>
            <p className="mt-1 text-2xl font-black text-foreground">
              {overallStats.inProgressCount}
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                / 12
              </span>
            </p>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t("Not Started", "শুরু হয়নি")}
              </p>
            </div>
            <p className="mt-1 text-2xl font-black text-foreground">
              {notStarted}
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                / 12
              </span>
            </p>
          </div>
        </div>

        {/* Segmented progress bar */}
        <div className="mt-5">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${completedPct}%` }}
            />
            <div
              className="h-full bg-amber-400 transition-all duration-700"
              style={{ width: `${inProgressPct}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              {overallStats.completedLessons}{" "}
              {t("of", "টির মধ্যে")}{" "}
              {overallStats.totalLessons}{" "}
              {t("lessons completed", "টি পাঠ সম্পন্ন")}
            </span>
            <div className="flex items-center gap-2.5">
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:border-foreground/20 hover:bg-muted"
              >
                <Network className="h-3.5 w-3.5 text-blue-500" />
                {t("Interactive Roadmap", "ইন্টারেক্টিভ রোডম্যাপ")}
              </Link>
              <Link
                href="/subjects/csharp"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                {t("Continue Learning", "পড়াশোনা চালিয়ে যান")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
