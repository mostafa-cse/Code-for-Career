"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  ExternalLink,
  CheckCircle2,
  Circle,
  Star,
  Copy,
  Check,
  Code2,
  Clock,
  HardDrive,
  Building2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { ComprehensiveProblem } from "@/lib/problems-data";
import { useLanguage } from "@/components/providers/language-provider";

interface ProblemSolutionModalProps {
  problem: ComprehensiveProblem | null;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  isStarred: boolean;
  onToggleCompleted: (id: string) => void;
  onToggleStarred: (id: string) => void;
  onPrevProblem?: () => void;
  onNextProblem?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

const DIFFICULTY_STYLES = {
  EASY: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  MEDIUM: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  HARD: "border-purple-500/30 bg-purple-500/10 text-purple-400",
};

export function ProblemSolutionModal({
  problem,
  isOpen,
  onClose,
  isCompleted,
  isStarred,
  onToggleCompleted,
  onToggleStarred,
  onPrevProblem,
  onNextProblem,
  hasPrev = false,
  hasNext = false,
}: ProblemSolutionModalProps) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev && onPrevProblem) onPrevProblem();
      if (e.key === "ArrowRight" && hasNext && onNextProblem) onNextProblem();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, hasPrev, hasNext, onPrevProblem, onNextProblem]);

  if (!isOpen || !problem) return null;

  const handleCopyCode = async () => {
    if (!problem.solutionCode) return;
    try {
      await navigator.clipboard.writeText(problem.solutionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-[#0f121d] text-slate-100 shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 bg-[#141827]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded-md">
              {problem.sourceAbbr} · {problem.source}
            </span>

            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                DIFFICULTY_STYLES[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </span>

            {problem.company && (
              <span className="flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                <Building2 className="h-3 w-3" />
                {problem.company}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Star Toggle */}
            <button
              type="button"
              onClick={() => onToggleStarred(problem.id)}
              className={`rounded-lg p-1.5 transition ${
                isStarred
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
              title={isStarred ? "Remove Star" : "Star Problem"}
            >
              <Star className={`h-4 w-4 ${isStarred ? "fill-amber-400" : ""}`} />
            </button>

            {/* Solved Toggle */}
            <button
              type="button"
              onClick={() => onToggleCompleted(problem.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                isCompleted
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                  : "border-border bg-slate-800/80 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400"
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-400 text-[#0f121d]" />
                  <span>{t("Solved", "সমাধানকৃত")}</span>
                </>
              ) : (
                <>
                  <Circle className="h-3.5 w-3.5" />
                  <span>{t("Mark Solved", "মার্ক সমাধান")}</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Title & Appears In */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {problem.name}
              </h2>
              {problem.url && (
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline shrink-0"
                >
                  <span>{t("Practice on External Judge", "অনলাইন জাজে সমাধান")}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {language === "bn" && problem.nameBn && (
              <p className="mt-0.5 text-sm font-medium text-slate-400">
                {problem.nameBn}
              </p>
            )}

            {/* Curriculum Lessons connection */}
            {problem.appearsIn && problem.appearsIn.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                  {t("Appears in:", "সিলেবাস পাঠসমূহ:")}
                </span>
                {problem.appearsIn.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.url}
                    onClick={onClose}
                    className="rounded-md border border-border/80 bg-slate-800/60 px-2 py-0.5 text-blue-300 hover:bg-blue-600/20 hover:text-blue-200 transition"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border/60 bg-slate-800/40 px-2 py-0.5 text-[11px] font-mono text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Complexity Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-[#151926] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  {t("Time Complexity", "সময় জটিলতা")}
                </span>
                <span className="font-mono text-xs font-bold text-white">
                  {problem.timeComplexity}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-[#151926] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <HardDrive className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  {t("Space Complexity", "স্পেস জটিলতা")}
                </span>
                <span className="font-mono text-xs font-bold text-white">
                  {problem.spaceComplexity}
                </span>
              </div>
            </div>
          </div>

          {/* Solution & Approach Explanation */}
          <div className="rounded-xl border border-border/70 bg-[#131726] p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {t("Intuition & Algorithm Approach", "সমাধান কৌশল ও মূল ধারণা")}
              </h3>
            </div>

            <p className="text-sm leading-relaxed text-slate-300 font-normal">
              {problem.solutionEn}
            </p>

            {problem.solutionBn && (
              <div className="mt-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs leading-relaxed text-blue-200">
                <strong className="block mb-1 font-semibold text-blue-300">
                  বাংলা ব্যাখ্যা:
                </strong>
                <p>{problem.solutionBn}</p>
              </div>
            )}
          </div>

          {/* Code Implementation Snippet */}
          {problem.solutionCode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t("Solution Implementation", "কোড বাস্তবায়ন")}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{t("Copied!", "কপি হয়েছে!")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{t("Copy Code", "কোড কপি করুন")}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border bg-[#090b13] p-4 font-mono text-xs text-slate-200 leading-relaxed">
                <pre>{problem.solutionCode}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-border/70 px-5 py-3.5 bg-[#141827]">
          <button
            type="button"
            onClick={onPrevProblem}
            disabled={!hasPrev}
            className="flex items-center gap-1 rounded-lg border border-border/70 bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>{t("Previous", "পূর্ববর্তী")}</span>
          </button>

          <span className="text-xs text-slate-400 hidden sm:inline-block">
            {t("Use Left / Right arrow keys to navigate", "কিবোর্ডের তীর চিহ্ন দিয়ে নেভিগেট করুন")}
          </span>

          <button
            type="button"
            onClick={onNextProblem}
            disabled={!hasNext}
            className="flex items-center gap-1 rounded-lg border border-border/70 bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <span>{t("Next", "পরবর্তী")}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
