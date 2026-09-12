"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Star,
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  BookOpen,
} from "lucide-react";
import type { RoadmapNode, RoadmapProblem } from "@/lib/roadmap-data";
import { useLanguage } from "@/components/providers/language-provider";

interface RoadmapDrawerProps {
  node: RoadmapNode | null;
  onClose: () => void;
  completedProblemIds: Set<string>;
  starredProblemIds: Set<string>;
  onToggleProblem: (problemId: string) => void;
  onToggleStar: (problemId: string) => void;
}

const DIFFICULTY_STYLE: Record<
  string,
  { label: string; text: string; bg: string }
> = {
  EASY: {
    label: "Easy",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
  },
  MEDIUM: {
    label: "Medium",
    text: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
  },
  HARD: {
    label: "Hard",
    text: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/30",
  },
  INSANE: {
    label: "Insane",
    text: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
  },
};

export function RoadmapDrawer({
  node,
  onClose,
  completedProblemIds,
  starredProblemIds,
  onToggleProblem,
  onToggleStar,
}: RoadmapDrawerProps) {
  const { language, t } = useLanguage();

  if (!node) return null;

  const total = node.problems.length;
  const completedCount = node.problems.filter((p) =>
    completedProblemIds.has(p.id)
  ).length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <>
      {/* Backdrop (for mobile) */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
      />

      {/* Slide-in Drawer Container */}
      <aside
        className="fixed right-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-full max-w-2xl flex-col border-l border-border/80 bg-[#121622] text-white shadow-2xl transition-transform duration-300 sm:max-w-xl md:max-w-2xl"
        aria-label="Roadmap Details Drawer"
      >
        {/* Drawer Header */}
        <div className="relative border-b border-border/50 px-6 py-6 text-center">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="absolute left-6 top-6 flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/20 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Node Category & Title */}
          <span className="inline-block rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
            {node.category}
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {language === "bn" ? node.labelBn : node.labelEn}
          </h2>

          {/* Progress fraction & circular indicator */}
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-400 font-medium">
            <span>
              ( {completedCount} / {total} )
            </span>
            <span className="font-mono text-xs text-blue-400">({pct}%)</span>
          </div>

          {/* Subtle Progress Bar */}
          <div className="mx-auto mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                pct === 100
                  ? "bg-emerald-500"
                  : pct > 0
                  ? "bg-blue-500"
                  : "bg-transparent"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Prerequisites Section */}
          {node.prerequisites.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {t("Prerequisites", "পূর্বশর্তসমূহ")}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {node.prerequisites.map((prereq) => (
                  <Link
                    key={prereq.id}
                    href={prereq.url}
                    className="group flex items-start gap-3 rounded-xl border border-border/60 bg-[#171c2b] p-3 transition-colors hover:border-foreground/30 hover:bg-[#1d2336]"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/20 text-slate-400 group-hover:text-blue-400">
                      <BookOpen className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white group-hover:text-blue-300">
                        {language === "bn" ? prereq.titleBn : prereq.titleEn}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {language === "bn" ? prereq.subtitleBn : prereq.subtitleEn}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Problems / Lessons Table (NeetCode Style) */}
          <div>
            <div className="flex items-center justify-between pb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {t("Topics & Practice Problems", "টপিক ও প্র্যাকটিস সমস্যা")}
              </p>
              <span className="text-[11px] text-slate-400">
                {completedCount}/{total} {t("Done", "সম্পন্ন")}
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/60 bg-[#151926]">
              {/* Table Header */}
              <div className="grid grid-cols-[36px_36px_1fr_90px_50px] items-center border-b border-border/50 bg-[#111420] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className="text-center">{t("Status", "স্ট্যাটাস")}</span>
                <span className="text-center">{t("Star", "স্টার")}</span>
                <span>{t("Problem / Lesson", "সমস্যা / পাঠ")}</span>
                <span className="text-center">{t("Difficulty", "কঠিনতা")}</span>
                <span className="text-center">{t("Guide", "গাইড")}</span>
              </div>

              {/* Table Rows */}
              <ul className="divide-y divide-border/40">
                {node.problems.map((problem: RoadmapProblem) => {
                  const isCompleted = completedProblemIds.has(problem.id);
                  const isStarred = starredProblemIds.has(problem.id);
                  const diff = DIFFICULTY_STYLE[problem.difficulty] ?? DIFFICULTY_STYLE.EASY;

                  return (
                    <li
                      key={problem.id}
                      className={`grid grid-cols-[36px_36px_1fr_90px_50px] items-center px-3 py-3 text-xs transition-colors hover:bg-[#1a2030] ${
                        isCompleted ? "bg-[#142320]/40" : ""
                      }`}
                    >
                      {/* Checkbox Status */}
                      <button
                        type="button"
                        onClick={() => onToggleProblem(problem.id)}
                        className="flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors"
                        title={isCompleted ? "Mark Uncompleted" : "Mark Completed"}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>

                      {/* Star Bookmark */}
                      <button
                        type="button"
                        onClick={() => onToggleStar(problem.id)}
                        className="flex items-center justify-center transition-colors"
                        title={isStarred ? "Unstar" : "Star"}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            isStarred
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-600 hover:text-amber-400"
                          }`}
                        />
                      </button>

                      {/* Problem Link */}
                      <div className="min-w-0 pr-2">
                        <Link
                          href={problem.url}
                          className={`group/link inline-flex items-center gap-1.5 truncate font-medium transition-colors hover:text-blue-400 ${
                            isCompleted
                              ? "line-through text-slate-400"
                              : "text-white"
                          }`}
                        >
                          <span className="truncate">
                            {language === "bn" ? problem.titleBn : problem.titleEn}
                          </span>
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity text-slate-400" />
                        </Link>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="flex justify-center">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${diff.text}`}
                        >
                          {diff.label}
                        </span>
                      </div>

                      {/* Guide / Solution link */}
                      <div className="flex justify-center">
                        <Link
                          href={problem.solutionUrl ?? problem.url}
                          title="Open Solution / Guide"
                          className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-muted/30 hover:text-white transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="border-t border-border/60 bg-[#0e121c] p-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {completedCount === total
              ? t("🎉 Module completed! Awesome job.", "🎉 মডিউল সম্পন্ন হয়েছে! অসাধারণ।")
              : t(
                  `${total - completedCount} items left to master this topic`,
                  `এই টপিক আয়ত্ত করতে আরও ${total - completedCount}টি পাঠ বাকি`
                )}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border/70 bg-[#1b2234] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#232b42] transition-colors"
          >
            {t("Close", "বন্ধ করুন")}
          </button>
        </div>
      </aside>
    </>
  );
}
