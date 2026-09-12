"use client";

import React, { useState } from "react";
import {
  Code2,
  GitBranch,
  Boxes,
  Binary,
  Zap,
  Layers,
  Database,
  PenTool,
  Puzzle,
  Cpu,
  Globe,
  Server,
  Sparkles,
  Users,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Award,
  Search,
  X,
  Flame,
} from "lucide-react";
import type { RoadmapTrack, RoadmapNode } from "@/lib/roadmap-data";
import { BD_SWE_STAGES } from "@/lib/roadmap-data";
import { useLanguage } from "@/components/providers/language-provider";

interface RoadmapStepsViewProps {
  track: RoadmapTrack;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  nodeProgressMap: Record<string, { completed: number; total: number; isCompleted: boolean }>;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  GitBranch,
  Boxes,
  Binary,
  Zap,
  Layers,
  Database,
  PenTool,
  Puzzle,
  Cpu,
  Globe,
  Server,
  Sparkles,
  Users,
};

export function RoadmapStepsView({
  track,
  selectedNodeId,
  onSelectNode,
  nodeProgressMap,
}: RoadmapStepsViewProps) {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const nodeMap = new Map<string, RoadmapNode>(track.nodes.map((n) => [n.id, n]));

  // Calculate overall career track progress
  const totalCurriculumProblems = track.nodes.reduce(
    (acc, n) => acc + (nodeProgressMap[n.id]?.total ?? n.problems.length),
    0
  );
  const totalCurriculumSolved = track.nodes.reduce(
    (acc, n) => acc + (nodeProgressMap[n.id]?.completed ?? 0),
    0
  );
  const totalCurriculumPct =
    totalCurriculumProblems > 0
      ? Math.round((totalCurriculumSolved / totalCurriculumProblems) * 100)
      : 0;

  function scrollToStage(stageId: string) {
    const el = document.getElementById(`stage-section-${stageId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const query = searchQuery.toLowerCase().trim();

  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto bg-[#0d1017] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <div className="w-full space-y-8">
        {/* ── 1. Full-Bleed Edge-to-Edge Hero Banner ── */}
        <div className="rounded-2xl border border-blue-500/20 bg-linear-to-r from-blue-950/40 via-indigo-950/25 to-slate-900/40 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                <Award className="h-3.5 w-3.5" />
                {t("Structured Career Track", "পরিকল্পিত ক্যারিয়ার ট্র্যাকিং")}
              </div>
              <h2 className="text-xl font-extrabold text-white sm:text-2xl lg:text-3xl">
                {language === "bn"
                  ? "৫টি ধাপে বাংলাদেশ সফটওয়্যার ক্যারিয়ার রোডম্যাপ"
                  : "5-Stage Bangladesh SWE Career Mastery Path"}
              </h2>
              <p className="text-xs text-slate-300 sm:text-sm leading-relaxed">
                {language === "bn"
                  ? "বাংলাদেশের শীর্ষস্থানীয় সফটওয়্যার কোম্পানিতে টেকনিক্যাল ও ভাইভা সাক্ষাৎকারে সফল হওয়ার জন্য ধাপে ধাপে ১৪টি মূল বিষয়ের প্রস্তুতি নির্দেশিকা।"
                  : "Step-by-step roadmap across 14 essential subjects tailored for written tests, problem-solving rounds, and architecture vivas in Bangladesh tech companies."}
              </p>
            </div>

            {/* Quick Metrics & Overall Completion */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
              <div className="rounded-xl border border-border/70 bg-[#141926]/90 px-4 py-3 text-center min-w-24">
                <span className="block text-xl font-black text-blue-400">5</span>
                <span className="text-[11px] font-semibold text-slate-400">{t("Stages", "ধাপ")}</span>
              </div>
              <div className="rounded-xl border border-border/70 bg-[#141926]/90 px-4 py-3 text-center min-w-24">
                <span className="block text-xl font-black text-indigo-400">14</span>
                <span className="text-[11px] font-semibold text-slate-400">{t("Subjects", "বিষয়")}</span>
              </div>
              <div className="rounded-xl border border-border/70 bg-[#141926]/90 px-5 py-3 text-center min-w-32">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xl font-black text-emerald-400">
                    {totalCurriculumSolved}/{totalCurriculumProblems}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">{t("Solved", "সম্পন্ন")} ({totalCurriculumPct}%)</span>
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6 pt-4 border-t border-blue-500/20">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 font-medium">
                {t("Curriculum Mastery Progress", "কারিকুলাম সম্পন্ন করার অগ্রগতি")}
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {totalCurriculumPct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${Math.max(totalCurriculumPct, totalCurriculumPct > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>

          {/* Stage Fast Jump Navigation & Subject Search */}
          <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Stage Quick Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">
                {t("Jump to Stage:", "ধাপে যান:")}
              </span>
              {BD_SWE_STAGES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToStage(s.id)}
                  className="rounded-lg border border-border/70 bg-[#131724] px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-blue-500/50 hover:bg-blue-600/15 hover:text-white transition cursor-pointer"
                >
                  0{s.number}: {language === "bn" ? s.titleBn.split(":")[1]?.trim() || s.titleBn : s.titleEn.split(":")[1]?.trim() || s.titleEn}
                </button>
              ))}
            </div>

            {/* Live Filter Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("Filter 14 subjects...", "১৪টি বিষয়ে খুঁজুন...")}
                className="w-full rounded-xl border border-border/70 bg-[#121624] py-1.5 pl-9 pr-8 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 2. Full-Bleed 5 Stages Curriculum ── */}
        <div className="space-y-12">
          {BD_SWE_STAGES.map((stage) => {
            const allStageNodes = stage.nodeIds
              .map((id) => nodeMap.get(id))
              .filter((n): n is RoadmapNode => Boolean(n));

            const stageNodes = allStageNodes.filter((n) => {
              if (!query) return true;
              return (
                n.labelEn.toLowerCase().includes(query) ||
                n.labelBn.toLowerCase().includes(query) ||
                (n.subtitleEn && n.subtitleEn.toLowerCase().includes(query)) ||
                (n.subtitleBn && n.subtitleBn.toLowerCase().includes(query)) ||
                (n.badge && n.badge.toLowerCase().includes(query))
              );
            });

            if (stageNodes.length === 0 && query) {
              return null;
            }

            const totalProblems = allStageNodes.reduce(
              (acc, n) => acc + (nodeProgressMap[n.id]?.total ?? n.problems.length),
              0
            );
            const solvedProblems = allStageNodes.reduce(
              (acc, n) => acc + (nodeProgressMap[n.id]?.completed ?? 0),
              0
            );
            const isStageDone = totalProblems > 0 && solvedProblems === totalProblems;

            return (
              <section key={stage.id} id={`stage-section-${stage.id}`} className="relative space-y-4 scroll-mt-20">
                {/* Stage Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/20 text-xs font-black text-blue-400 border border-blue-500/30">
                      0{stage.number}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white sm:text-lg">
                        {language === "bn" ? stage.titleBn : stage.titleEn}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {language === "bn" ? stage.subtitleBn : stage.subtitleEn}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] font-mono text-slate-300 border border-slate-700">
                      {solvedProblems}/{totalProblems} {t("Solved", "সম্পন্ন")}
                    </span>
                    {isStageDone && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        {t("Completed", "সম্পন্ন")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid of Subject Cards — Full Width Multi-Column */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {stageNodes.map((node) => {
                    const stats = nodeProgressMap[node.id] ?? {
                      completed: 0,
                      total: node.problems.length,
                      isCompleted: false,
                    };
                    const pct = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                    const IconComponent = (node.icon && ICON_MAP[node.icon]) || BookOpen;
                    const isSelected = selectedNodeId === node.id;

                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode(node.id)}
                        className={`group relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer transition-all duration-200 shadow-md ${
                          isSelected
                            ? "border-blue-500 bg-[#192238] ring-2 ring-blue-500/50 shadow-blue-500/20"
                            : stats.isCompleted
                            ? "border-emerald-500/40 bg-[#12211e] hover:border-emerald-400 hover:bg-[#152a25]"
                            : "border-border/70 bg-[#141824] hover:border-blue-500/50 hover:bg-[#192032]"
                        }`}
                      >
                        {/* Top Row: Icon + Step + Badge */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                                  stats.isCompleted
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                    : "bg-blue-600/15 text-blue-400 border-blue-500/30 group-hover:bg-blue-600/25 transition-colors"
                                }`}
                              >
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  {t("Step", "ধাপ")} {String(node.stepNumber).padStart(2, "0")}
                                </span>
                                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                                  {language === "bn" ? node.labelBn : node.labelEn}
                                </h4>
                              </div>
                            </div>

                            {node.badge && (
                              <span className="shrink-0 rounded-md bg-blue-500/15 px-2 py-0.5 text-[9px] font-bold text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                                {node.badge}
                              </span>
                            )}
                          </div>

                          {/* Subtitle / Focus area */}
                          {(node.subtitleEn || node.subtitleBn) && (
                            <p className="mt-2.5 text-xs text-slate-400 line-clamp-1">
                              {language === "bn" ? node.subtitleBn : node.subtitleEn}
                            </p>
                          )}

                          {/* Prerequisites tag */}
                          {node.prerequisites.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                              <span className="text-slate-400">{t("Prereqs:", "পূর্বশর্ত:")}</span>
                              {node.prerequisites.map((p) => (
                                <span
                                  key={p.id}
                                  className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-300"
                                >
                                  {language === "bn" ? p.titleBn : p.titleEn}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Bottom Row: Progress + Action */}
                        <div className="mt-5 pt-3 border-t border-border/50">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-slate-400 font-medium">
                              {stats.total} {t("Topics & Practice", "টপিক ও প্র্যাকটিস")}
                            </span>
                            <span className="font-mono text-slate-300 font-bold">
                              {stats.completed}/{stats.total}
                            </span>
                          </div>

                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                stats.isCompleted
                                  ? "bg-emerald-400"
                                  : pct > 0
                                  ? "bg-blue-500"
                                  : "bg-slate-700"
                              }`}
                              style={{ width: `${Math.max(pct, pct > 0 ? 8 : 0)}%` }}
                            />
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                            <span
                              className={`flex items-center gap-1.5 text-[11px] ${
                                stats.isCompleted
                                  ? "text-emerald-400"
                                  : pct > 0
                                  ? "text-blue-400"
                                  : "text-slate-400"
                              }`}
                            >
                              {stats.isCompleted ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  {t("Mastered", "সম্পন্ন")}
                                </>
                              ) : pct > 0 ? (
                                <>
                                  <Circle className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
                                  {t("In Progress", "চলমান")}
                                </>
                              ) : (
                                <>
                                  <Circle className="h-3.5 w-3.5 text-slate-500" />
                                  {t("Not Started", "শুরু হয়নি")}
                                </>
                              )}
                            </span>

                            <span className="flex items-center gap-1 text-blue-400 group-hover:translate-x-0.5 transition-transform text-[11px]">
                              {t("View Topics", "টপিক দেখুন")}
                              <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
