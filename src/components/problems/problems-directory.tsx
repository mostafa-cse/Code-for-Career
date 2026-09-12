"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Code2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Building2,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { DifficultyLevel } from "@/types/database";

export interface DirectoryProblem {
  id: string;
  name: string;
  source: string;
  url: string | null;
  difficulty: DifficultyLevel;
  company: string | null;
  tags: string[];
  subjectSlug: string;
  subjectName: string;
  lessonSlug: string;
  lessonTitle: string;
  solutionEn: string | null;
  solutionBn: string | null;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  EASY: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
  HARD: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300",
  INSANE: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300",
};

const BD_COMPANIES = [
  "ALL",
  "Enosis Solutions",
  "Therap (BD)",
  "Samsung R&D",
  "Brain Station 23",
  "BJIT Group",
];

const DIFFICULTIES = ["ALL", "EASY", "MEDIUM", "HARD"];

export function ProblemsDirectory({
  initialProblems,
}: {
  initialProblems: DirectoryProblem[];
}) {
  const { language, t } = useLanguage();

  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredProblems = useMemo(() => {
    return initialProblems.filter((p) => {
      // Company filter
      if (selectedCompany !== "ALL") {
        if (!p.company?.toLowerCase().includes(selectedCompany.toLowerCase())) {
          return false;
        }
      }

      // Difficulty filter
      if (selectedDifficulty !== "ALL") {
        if (p.difficulty !== selectedDifficulty) {
          return false;
        }
      }

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCompany = p.company?.toLowerCase().includes(q);
        const matchesTag = p.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSubject = p.subjectName.toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesTag && !matchesSubject) {
          return false;
        }
      }

      return true;
    });
  }, [initialProblems, selectedCompany, selectedDifficulty, searchQuery]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background shadow-xs">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              {t("Practice Problems", "প্র্যাকটিস প্রবলেম")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t(
                "Curated interview questions tagged by Bangladesh tech companies and topics.",
                "বাংলাদেশের প্রযুক্তি প্রতিষ্ঠানসমূহের ইন্টারভিউ প্রশ্ন এবং সমাধান সংকলন।"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-xs">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(
              "Filter problems by name, tag, or topic...",
              "নাম, ট্যাগ বা টপিক দিয়ে খুঁজুন..."
            )}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Company filter pills */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
            {t("Filter by Company", "কোম্পানি অনুযায়ী ফিল্টার")}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {BD_COMPANIES.map((company) => {
              const active = selectedCompany === company;
              return (
                <button
                  key={company}
                  type="button"
                  onClick={() => setSelectedCompany(company)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    active
                      ? "bg-foreground text-background shadow-xs"
                      : "border border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {company === "ALL" ? t("All Companies", "সকল কোম্পানি") : company}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty pills */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
            {t("Filter by Difficulty", "কঠিনতার মাত্রা")}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DIFFICULTIES.map((diff) => {
              const active = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    active
                      ? "bg-foreground text-background shadow-xs"
                      : "border border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {diff === "ALL" ? t("All Levels", "সকল স্তর") : diff}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mt-8 mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {t("Showing", "প্রদর্শন")} <strong>{filteredProblems.length}</strong>{" "}
          {t("problems", "টি সমস্যা")}
        </span>
        {(selectedCompany !== "ALL" || selectedDifficulty !== "ALL" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCompany("ALL");
              setSelectedDifficulty("ALL");
              setSearchQuery("");
            }}
            className="text-foreground underline hover:opacity-80 font-medium"
          >
            {t("Reset filters", "ফিল্টার রিসেট")}
          </button>
        )}
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <Code2 className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold text-foreground">
              {t("No problems found", "কোনো সমস্যা পাওয়া যায়নি")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              {t(
                "Try adjusting your company or difficulty filters.",
                "কোম্পানি বা কাঠিন্যের ফিল্টার পরিবর্তন করে দেখুন।"
              )}
            </p>
          </div>
        ) : (
          filteredProblems.map((prob) => {
            const isExpanded = expandedId === prob.id;
            const solution =
              language === "bn" ? prob.solutionBn : prob.solutionEn;

            return (
              <div
                key={prob.id}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all hover:border-foreground/20"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {prob.url ? (
                          <a
                            href={prob.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-base font-bold text-foreground hover:underline"
                          >
                            <span>{prob.name}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          </a>
                        ) : (
                          <span className="text-base font-bold text-foreground">
                            {prob.name}
                          </span>
                        )}
                        <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {prob.source}
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            DIFFICULTY_STYLES[prob.difficulty] ?? ""
                          }`}
                        >
                          {prob.difficulty}
                        </span>

                        {prob.company && (
                          <span className="flex items-center gap-1 rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300">
                            <Building2 className="h-2.5 w-2.5" />
                            {prob.company}
                          </span>
                        )}

                        <Link
                          href={`/subjects/${prob.subjectSlug}/${prob.lessonSlug}`}
                          className="flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-foreground hover:bg-muted"
                        >
                          <BookOpen className="h-2.5 w-2.5 text-muted-foreground" />
                          <span>{prob.lessonTitle}</span>
                        </Link>

                        {prob.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hint Button */}
                    {solution && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : prob.id)
                        }
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-muted/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        <span>{t("Approach Hint", "সমাধান ইঙ্গিত")}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Hint Section */}
                {isExpanded && solution && (
                  <div className="border-t border-border bg-muted/30 p-4 sm:px-5 text-xs leading-relaxed text-muted-foreground animate-in fade-in duration-150">
                    <strong className="text-foreground block mb-1">
                      {t("Approach & Key Concept:", "সমাধান কৌশল ও মূল ধারণা:")}
                    </strong>
                    <p>{solution}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
