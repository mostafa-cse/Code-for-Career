"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  Trophy,
  Shuffle,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { RoadmapTrack } from "@/lib/roadmap-data";
import { useLanguage } from "@/components/providers/language-provider";

interface RoadmapSidebarProps {
  currentTrack: RoadmapTrack;
  completedProblemIds: Set<string>;
  onRandomTopic: () => void;
  onResetProgress: () => void;
  onClose?: () => void;
}

export function RoadmapSidebar({
  currentTrack,
  completedProblemIds,
  onRandomTopic,
  onResetProgress,
  onClose,
}: RoadmapSidebarProps) {
  const { language, t } = useLanguage();

  // Calculate difficulty stats
  let easyTotal = 0;
  let easySolved = 0;
  let medTotal = 0;
  let medSolved = 0;
  let hardTotal = 0;
  let hardSolved = 0;

  currentTrack.nodes.forEach((n) => {
    n.problems.forEach((p) => {
      const isDone = completedProblemIds.has(p.id);
      if (p.difficulty === "EASY") {
        easyTotal++;
        if (isDone) easySolved++;
      } else if (p.difficulty === "MEDIUM") {
        medTotal++;
        if (isDone) medSolved++;
      } else {
        hardTotal++;
        if (isDone) hardSolved++;
      }
    });
  });

  const totalProblems = easyTotal + medTotal + hardTotal;
  const totalSolved = easySolved + medSolved + hardSolved;
  const pctSolved = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;

  // Calendar logic for September 2026
  const [currentDate] = useState(new Date(2026, 8, 12)); // Sep 12, 2026
  const [timeLeft, setTimeLeft] = useState("11:45:20");

  useEffect(() => {
    function updateTimer() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, midnight.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    }
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-84 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border/70 bg-[#10141f] p-4 text-white flex">
      {/* ── Sidebar Header with Close Button ── */}
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {t("Roadmap Stats", "রোডম্যাপ পরিসংখ্যান")}
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            title={t("Collapse Sidebar", "সাইডবার লুকান")}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-muted/20 text-slate-400 hover:bg-muted/50 hover:text-white transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Widget 1: Progress Circle & Difficulty Breakdown ── */}
      <div className="rounded-2xl border border-border/60 bg-[#161a27] p-5 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Difficulty counts list */}
          <div className="space-y-2.5 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold w-14">Easy</span>
              <span className="font-mono text-slate-300">
                {easySolved}/{easyTotal}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold w-14">Medium</span>
              <span className="font-mono text-slate-300">
                {medSolved}/{medTotal}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-rose-400 font-bold w-14">Hard</span>
              <span className="font-mono text-slate-300">
                {hardSolved}/{hardTotal}
              </span>
            </div>
          </div>

          {/* Radial meter display */}
          <div className="relative flex h-24 w-24 flex-col items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-700"
                strokeDasharray={`${pctSolved}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black leading-none text-white">
                {totalSolved}
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight">
                /{totalProblems}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-500">
                {t("Solved", "সম্পন্ন")}
              </span>
            </div>
          </div>
        </div>

        {/* Track Title Card */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-border/70 bg-[#1b2234] px-3.5 py-2.5 text-xs font-bold text-white">
          <span className="flex items-center gap-2 truncate">
            <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />
            <span className="truncate">
              {language === "bn" ? currentTrack.titleBn : currentTrack.titleEn}
            </span>
          </span>
          <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
            {currentTrack.nodes.length} {t("Subjects", "বিষয়")}
          </span>
        </div>

        {/* Quick Toolbar */}
        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-border/40">
          <button
            type="button"
            onClick={onRandomTopic}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-[#141926] py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-[#1e2436] hover:text-white transition"
            title="Pick a random next topic"
          >
            <Shuffle className="h-3.5 w-3.5 text-blue-400" />
            <span>{t("Random Next", "পরবর্তী টপিক")}</span>
          </button>
          <button
            type="button"
            onClick={onResetProgress}
            className="flex items-center justify-center rounded-lg border border-border/60 bg-[#141926] px-2.5 py-1.5 text-[11px] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Reset track progress"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Widget 2: Streak & Monthly Activity Calendar ── */}
      <div className="rounded-2xl border border-border/60 bg-[#161a27] p-5 shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-slate-500 hover:text-slate-300 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold text-white tracking-wide">
            September 2026
          </span>
          <button
            type="button"
            className="text-slate-500 hover:text-slate-300 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day Indicator + Countdown */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-b border-border/40 pb-2">
          <span className="font-semibold text-white">Day 12</span>
          <span className="font-mono text-[11px] text-amber-400/90">
            {timeLeft} left
          </span>
        </div>

        {/* Days of Week */}
        <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-bold text-slate-500">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>

        {/* Calendar Days Matrix */}
        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">
          {/* Padding for August trailing days */}
          <span className="text-slate-600/40 p-1">30</span>
          <span className="text-slate-600/40 p-1">31</span>

          {/* Sept 1 to 30 */}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const isToday = day === 12;
            const isDoneDay = day >= 8 && day <= 11;

            return (
              <span
                key={day}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] mx-auto transition ${
                  isToday
                    ? "bg-blue-600 text-white font-bold ring-2 ring-blue-400/40"
                    : isDoneDay
                    ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                {day}
              </span>
            );
          })}
        </div>

        {/* Streak Counters */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 pt-3 border-t border-border/40">
          <div className="rounded-xl border border-border/50 bg-[#121622] p-2.5">
            <p className="text-[10px] uppercase font-bold text-slate-400">
              {t("Current Streak", "বর্তমান ধারাবাহিকতা")}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-black text-amber-400">
              <Flame className="h-4 w-4 shrink-0 fill-amber-400" />
              <span>4 {t("days", "দিন")}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-[#121622] p-2.5">
            <p className="text-[10px] uppercase font-bold text-slate-400">
              {t("Best Streak", "সর্বোচ্চ ধারাবাহিকতা")}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-black text-amber-300">
              <Trophy className="h-4 w-4 shrink-0 text-amber-300" />
              <span>12 {t("days", "দিন")}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
