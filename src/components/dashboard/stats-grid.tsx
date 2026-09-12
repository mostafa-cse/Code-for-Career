"use client";

import { BookOpen, CheckCircle2, Code2, Target } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useUserProgress } from "@/lib/hooks/use-user-progress";

export function StatsGrid() {
  const { t } = useLanguage();
  const { overallStats } = useUserProgress();

  const STATS = [
    {
      icon: CheckCircle2,
      labelEn: "Lessons Completed",
      labelBn: "সম্পন্ন পাঠসমূহ",
      value: overallStats.completedLessons,
      subEn: `out of ${overallStats.totalLessons} total`,
      subBn: `মোট ${overallStats.totalLessons}টির মধ্যে`,
    },
    {
      icon: BookOpen,
      labelEn: "Modules In Progress",
      labelBn: "চলমান মডিউল",
      value: overallStats.inProgressCount,
      subEn: "currently active",
      subBn: "বর্তমানে অধ্যয়নরত",
    },
    {
      icon: Code2,
      labelEn: "Problems Solved",
      labelBn: "সমাধানকৃত সমস্যা",
      value: overallStats.solvedProblems,
      subEn: "interview questions",
      subBn: "সাক্ষাৎকার প্রশ্নাবলি",
    },
    {
      icon: Target,
      labelEn: "Total Subjects",
      labelBn: "মোট বিষয়সমূহ",
      value: 12,
      subEn: "curated modules",
      subBn: "সুনির্বাচিত পাঠ্যমডিউল",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-xs transition-all hover:border-foreground/20 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground transition-colors group-hover:bg-muted">
              <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t(stat.labelEn, stat.labelBn)}
              </p>
              <p className="mt-0.5 text-2xl font-black tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {t(stat.subEn, stat.subBn)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
