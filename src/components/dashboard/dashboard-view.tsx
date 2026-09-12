"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { DashboardHeader } from "./dashboard-header";
import { StatsGrid } from "./stats-grid";
import { SectionLayout } from "./section-layout";

export function DashboardView() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Overview header + stats */}
      <DashboardHeader />
      <StatsGrid />

      {/* Section divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {t("Curriculum", "পাঠ্যক্রম")}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* USACO-style section layout */}
      <SectionLayout />
    </div>
  );
}
