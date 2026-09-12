"use client";

import { useState, useEffect } from "react";
import {
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Code2,
  CheckCircle2,
  Circle,
  Clock,
  RotateCcw,
  Check,
  Building2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { LocalProblem } from "@/lib/lessons-data";

type ProblemStatus = "NOT_ATTEMPTED" | "SOLVING" | "SOLVED" | "REVIEWING";

const DIFFICULTY_STYLES: Record<string, string> = {
  EASY: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  MEDIUM: "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  HARD: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  INSANE: "border-purple-500/25 bg-purple-500/10 text-purple-700 dark:text-purple-300",
};

interface ProblemListProps {
  problems: LocalProblem[];
  displayLang?: "en" | "bn";
}

export function ProblemList({ problems, displayLang }: ProblemListProps) {
  const { language } = useLanguage();
  const activeLang = displayLang || language;
  const isBn = activeLang === "bn";

  // Per-problem status and tag expansion state
  const [statuses, setStatuses] = useState<Record<string, ProblemStatus>>({});
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  // Load saved statuses from localStorage on mount
  useEffect(() => {
    try {
      const saved: Record<string, ProblemStatus> = {};
      for (const p of problems) {
        const key = `bd-prep:prob-status:${p.name}`;
        const val = localStorage.getItem(key);
        if (val === "SOLVED" || val === "SOLVING" || val === "REVIEWING") {
          saved[p.name] = val;
        } else {
          saved[p.name] = "NOT_ATTEMPTED";
        }
      }
      setStatuses(saved);
    } catch {
      // ignore localStorage errors in private browsing
    }
  }, [problems]);

  // Cycle status on click (USACO Guide behavior)
  const cycleStatus = (problemName: string) => {
    setStatuses((prev) => {
      const current = prev[problemName] || "NOT_ATTEMPTED";
      let next: ProblemStatus = "SOLVED";
      if (current === "NOT_ATTEMPTED") next = "SOLVED";
      else if (current === "SOLVED") next = "SOLVING";
      else if (current === "SOLVING") next = "REVIEWING";
      else next = "NOT_ATTEMPTED";

      try {
        localStorage.setItem(`bd-prep:prob-status:${problemName}`, next);
      } catch {}

      return { ...prev, [problemName]: next };
    });
  };

  const toggleTags = (problemName: string) => {
    setExpandedTags((prev) => ({ ...prev, [problemName]: !prev[problemName] }));
  };

  const toggleSolution = (problemName: string) => {
    setExpandedSolutions((prev) => ({ ...prev, [problemName]: !prev[problemName] }));
  };

  if (problems.length === 0) return null;

  const solvedCount = problems.filter(
    (p) => statuses[p.name] === "SOLVED"
  ).length;
  const progressPercent = Math.round((solvedCount / problems.length) * 100);

  return (
    <section className="mt-12 not-prose" id="recommended-practice-problems">
      {/* ── Section Title & Progress Bar (USACO Style) ── */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>{isBn ? "প্র্যাকটিস প্রবলেম টেবিল" : "Practice Problems"}</span>
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {isBn
              ? "সমস্যা সমাধান করুন এবং স্ট্যাটাস চিহ্নিত করুন — অগ্রগতি সাইডবারে সংরক্ষিত হবে।"
              : "Solve problems and track your completion status — saved automatically."}
          </p>
        </div>

        {/* Solved Counter Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto rounded-lg border border-border bg-card px-3 py-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>
              {isBn ? "সম্পন্ন" : "Solved"}: {solvedCount} / {problems.length}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── USACO Guide Style Table Container ── */}
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Header row */}
            <thead>
              <tr className="border-b border-border/80 bg-muted/60 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-3 w-14 text-center">
                  {isBn ? "স্ট্যাটাস" : "Status"}
                </th>
                <th className="py-3 px-4 w-36">
                  {isBn ? "সোর্স" : "Source"}
                </th>
                <th className="py-3 px-4 min-w-[200px]">
                  {isBn ? "সমস্যার নাম" : "Problem Name"}
                </th>
                <th className="py-3 px-3 w-28 text-center">
                  {isBn ? "কাঠিন্য" : "Difficulty"}
                </th>
                <th className="py-3 px-4 w-48">
                  {isBn ? "ট্যাগ" : "Tags"}
                </th>
                <th className="py-3 px-3 w-28 text-right">
                  {isBn ? "হিন্ট" : "Solution"}
                </th>
              </tr>
            </thead>

            {/* Body rows */}
            <tbody className="divide-y divide-border/60">
              {problems.map((problem, i) => {
                const status = statuses[problem.name] || "NOT_ATTEMPTED";
                const isTagsOpen = !!expandedTags[problem.name];
                const isSolOpen = !!expandedSolutions[problem.name];
                const solutionText = isBn
                  ? problem.solutionBn
                  : problem.solutionEn;

                // Status indicator style
                const statusCircle = (() => {
                  if (status === "SOLVED") {
                    return (
                      <button
                        type="button"
                        onClick={() => cycleStatus(problem.name)}
                        className="group flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs transition-transform hover:scale-110"
                        title={
                          isBn
                            ? "সম্পন্ন (Solved) — ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                            : "Solved — click to cycle status"
                        }
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </button>
                    );
                  }
                  if (status === "SOLVING") {
                    return (
                      <button
                        type="button"
                        onClick={() => cycleStatus(problem.name)}
                        className="group flex h-6 w-6 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-500/10 text-amber-500 transition-transform hover:scale-110"
                        title={
                          isBn
                            ? "সমাধান চলছে (Solving) — ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                            : "Solving — click to cycle status"
                        }
                      >
                        <Clock className="h-3.5 w-3.5" />
                      </button>
                    );
                  }
                  if (status === "REVIEWING") {
                    return (
                      <button
                        type="button"
                        onClick={() => cycleStatus(problem.name)}
                        className="group flex h-6 w-6 items-center justify-center rounded-full border-2 border-purple-500 bg-purple-500/10 text-purple-500 transition-transform hover:scale-110"
                        title={
                          isBn
                            ? "পুনর্বিবেচনা (Reviewing) — ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                            : "Reviewing — click to cycle status"
                        }
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    );
                  }
                  return (
                    <button
                      type="button"
                      onClick={() => cycleStatus(problem.name)}
                      className="group flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-transparent transition-transform hover:scale-110"
                      title={
                        isBn
                          ? "চেষ্টা করা হয়নি (Not Attempted) — ক্লিক করে 'সম্পন্ন' করুন"
                          : "Not Attempted — click to mark Solved"
                      }
                    >
                      <Circle className="h-3.5 w-3.5 text-neutral-400" />
                    </button>
                  );
                })();

                return (
                  <tr
                    key={i}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td colSpan={6} className="p-0">
                      <div className="flex flex-col">
                        {/* Main row data */}
                        <div className="flex items-center py-3.5 px-3">
                          {/* 1. STATUS */}
                          <div className="w-14 flex items-center justify-center shrink-0">
                            {statusCircle}
                          </div>

                          {/* 2. SOURCE */}
                          <div className="w-36 px-2 truncate shrink-0">
                            <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                              {problem.source}
                            </span>
                          </div>

                          {/* 3. PROBLEM NAME */}
                          <div className="flex-1 min-w-[200px] px-2">
                            {problem.url ? (
                              <a
                                href={problem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                              >
                                <span>{problem.name}</span>
                                <ExternalLink className="h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100" />
                              </a>
                            ) : (
                              <span className="font-semibold text-foreground">
                                {problem.name}
                              </span>
                            )}
                          </div>

                          {/* 4. DIFFICULTY */}
                          <div className="w-28 text-center shrink-0">
                            <span
                              className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                                DIFFICULTY_STYLES[problem.difficulty] ??
                                "border-border bg-muted text-foreground"
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>

                          {/* 5. TAGS */}
                          <div className="w-48 px-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => toggleTags(problem.name)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {isTagsOpen ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5" />
                              )}
                              <span>
                                {isTagsOpen
                                  ? isBn
                                    ? "ট্যাগ লুকান"
                                    : "Hide Tags"
                                  : isBn
                                  ? "▶ ট্যাগ দেখুন"
                                  : "▶ Show Tags"}
                              </span>
                            </button>
                          </div>

                          {/* 6. HINT / SOLUTION TOGGLE */}
                          <div className="w-28 flex justify-end shrink-0 pr-2">
                            {solutionText ? (
                              <button
                                type="button"
                                onClick={() => toggleSolution(problem.name)}
                                className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors ${
                                  isSolOpen
                                    ? "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                                title={isBn ? "সমাধানের ইঙ্গিত দেখুন" : "View editorial hint"}
                              >
                                <Code2 className="h-3.5 w-3.5" />
                                <span>{isBn ? "ইঙ্গিত" : "Hint"}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-muted-foreground/40">—</span>
                            )}
                          </div>
                        </div>

                        {/* ── Expanded Tags Drawer ── */}
                        {isTagsOpen && (
                          <div className="bg-muted/40 border-t border-border/40 px-14 py-2 flex flex-wrap items-center gap-1.5 animate-in fade-in-50 duration-150">
                            {problem.company && (
                              <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-300">
                                <Building2 className="h-3 w-3" />
                                <span>{problem.company}</span>
                              </span>
                            )}
                            {problem.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-foreground/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* ── Expanded Solution Drawer ── */}
                        {isSolOpen && solutionText && (
                          <div className="border-t border-border/60 bg-blue-50/40 dark:bg-blue-950/20 px-14 py-3 text-xs leading-relaxed text-foreground animate-in fade-in-50 duration-150">
                            <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 mb-1">
                              <Code2 className="h-4 w-4" />
                              <span>
                                {isBn
                                  ? "সমাধানের পদ্ধতি ও অ্যালগরিদম কৌশল:"
                                  : "Solution Approach & Algorithm:"}
                              </span>
                            </div>
                            <p className="text-foreground/90 leading-relaxed font-sans">
                              {solutionText}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

