"use client";

import React from "react";
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

  const nodeMap = new Map<string, RoadmapNode>(track.nodes.map((n) => [n.id, n]));

  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto bg-[#0d1017] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Intro banner */}
        <div className="rounded-2xl border border-blue-500/20 bg-linear-to-r from-blue-950/40 via-indigo-950/20 to-transparent p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                <Award className="h-3.5 w-3.5" />
                {t("Structured Career Track", "পরিকল্পিত ক্যারিয়ার ট্র্যাকিং")}
              </div>
              <h2 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                {language === "bn"
                  ? "৫টি ধাপে সফটওয়্যার ইঞ্জিনিয়ারিং প্রস্তুতি"
                  : "5-Stage Software Engineering Mastery Path"}
              </h2>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm max-w-2xl">
                {language === "bn"
                  ? "বাংলাদেশের শীর্ষস্থানীয় সফটওয়্যার কোম্পানিতে টেকনিক্যাল ও ভাইভা সাক্ষাৎকারে সফল হওয়ার জন্য ধাপে ধাপে ১৪টি মূল বিষয়ের প্রস্তুতি নির্দেশিকা।"
                  : "Step-by-step roadmap across 14 essential subjects tailored for written tests, problem-solving rounds, and architecture vivas in Bangladesh tech companies."}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
              <div className="rounded-xl border border-border/70 bg-[#141926] px-4 py-2.5 text-center">
                <span className="block text-lg font-bold text-blue-400">5</span>
                <span className="text-[11px] text-slate-400">{t("Stages", "ধাপ")}</span>
              </div>
              <div className="rounded-xl border border-border/70 bg-[#141926] px-4 py-2.5 text-center">
                <span className="block text-lg font-bold text-emerald-400">14</span>
                <span className="text-[11px] text-slate-400">{t("Subjects", "বিষয়")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Stages Curriculum */}
        <div className="space-y-12">
          {BD_SWE_STAGES.map((stage) => {
            const stageNodes = stage.nodeIds
              .map((id) => nodeMap.get(id))
              .filter((n): n is RoadmapNode => Boolean(n));

            const totalProblems = stageNodes.reduce(
              (acc, n) => acc + (nodeProgressMap[n.id]?.total ?? n.problems.length),
              0
            );
            const solvedProblems = stageNodes.reduce(
              (acc, n) => acc + (nodeProgressMap[n.id]?.completed ?? 0),
              0
            );
            const isStageDone = totalProblems > 0 && solvedProblems === totalProblems;

            return (
              <div key={stage.id} className="relative space-y-4">
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

                {/* Grid of Subject Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
