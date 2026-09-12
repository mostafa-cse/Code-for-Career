"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  EyeOff,
  Shuffle,
  Dices,
  RotateCcw,
  CheckCircle2,
  Circle,
  Star,
  ExternalLink,
  ChevronDown,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
  BookOpen,
  Filter,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useUserProgress } from "@/lib/hooks/use-user-progress";
import {
  ALL_PROBLEMS,
  type ComprehensiveProblem,
} from "@/lib/problems-data";
import { ProblemSolutionModal } from "@/components/problems/problem-solution-modal";

const DIFFICULTY_STYLES = {
  EASY: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  MEDIUM: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  HARD: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

export function ProblemsDirectory() {
  const { language, t } = useLanguage();
  const { markProblem, getProblemStatus } = useUserProgress();

  // Local state for completed and starred problem IDs (hydrated from localStorage)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [isTagsVisible, setIsTagsVisible] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [selectedCompany, setSelectedCompany] = useState<string>("ALL");
  const [selectedSource, setSelectedSource] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL"); // ALL, SOLVED, UNSOLVED
  const [selectedStarred, setSelectedStarred] = useState<string>("ALL"); // ALL, STARRED
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"relevance" | "difficulty-asc" | "difficulty-desc" | "name">("relevance");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hitsPerPage, setHitsPerPage] = useState(24);

  // Active solution modal
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);

  // Shuffled order override (when user clicks Shuffle)
  const [shuffleSeed, setShuffleSeed] = useState<number | null>(null);

  // Hydrate user progress from localStorage on mount
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem("roadmap_completed_ids");
      if (savedCompleted) {
        setCompletedIds(new Set(JSON.parse(savedCompleted)));
      }
      const savedStarred = localStorage.getItem("roadmap_starred_ids");
      if (savedStarred) {
        setStarredIds(new Set(JSON.parse(savedStarred)));
      }
      const savedTagsVis = localStorage.getItem("usaco_tags_visible");
      if (savedTagsVis !== null) {
        setIsTagsVisible(savedTagsVis === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync completion toggle
  function handleToggleCompleted(id: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      const isNowDone = !next.has(id);
      if (isNowDone) {
        next.add(id);
        markProblem(id, "COMPLETED");
      } else {
        next.delete(id);
        markProblem(id, "NOT_STARTED");
      }
      try {
        localStorage.setItem("roadmap_completed_ids", JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  }

  // Sync star toggle
  function handleToggleStarred(id: string) {
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem("roadmap_starred_ids", JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function handleToggleTagsVisibility() {
    setIsTagsVisible((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("usaco_tags_visible", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  // Extract metadata lists for filter options
  const allSubjects = useMemo(() => {
    const map = new Map<string, string>();
    ALL_PROBLEMS.forEach((p) => {
      map.set(p.subjectSlug, p.subjectName);
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, []);

  const allCompanies = useMemo(() => {
    const set = new Set<string>();
    ALL_PROBLEMS.forEach((p) => {
      if (p.company) set.add(p.company);
    });
    return Array.from(set).sort();
  }, []);

  const allSources = useMemo(() => {
    const set = new Set<string>();
    ALL_PROBLEMS.forEach((p) => {
      set.add(p.source);
    });
    return Array.from(set).sort();
  }, []);

  // Tag counts calculation
  const tagCounts = useMemo(() => {
    const map: Record<string, number> = {};
    ALL_PROBLEMS.forEach((p) => {
      p.tags.forEach((t) => {
        map[t] = (map[t] || 0) + 1;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, []);

  // Filter logic
  const filteredProblems = useMemo(() => {
    let list = ALL_PROBLEMS.filter((p) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q) || p.nameBn.toLowerCase().includes(q);
        const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
        const matchCompany = p.company?.toLowerCase().includes(q) ?? false;
        const matchSubject = p.subjectName.toLowerCase().includes(q);
        const matchSource = p.source.toLowerCase().includes(q) || p.sourceAbbr.toLowerCase().includes(q);
        if (!matchName && !matchTag && !matchCompany && !matchSubject && !matchSource) {
          return false;
        }
      }

      // Difficulty
      if (selectedDifficulty !== "ALL" && p.difficulty !== selectedDifficulty) {
        return false;
      }

      // Subject
      if (selectedSubject !== "ALL" && p.subjectSlug !== selectedSubject) {
        return false;
      }

      // Company
      if (selectedCompany !== "ALL" && p.company !== selectedCompany) {
        return false;
      }

      // Source
      if (selectedSource !== "ALL" && p.source !== selectedSource) {
        return false;
      }

      // Status
      if (selectedStatus === "SOLVED" && !completedIds.has(p.id)) {
        return false;
      }
      if (selectedStatus === "UNSOLVED" && completedIds.has(p.id)) {
        return false;
      }

      // Starred
      if (selectedStarred === "STARRED" && !starredIds.has(p.id)) {
        return false;
      }

      // Selected Tags
      if (selectedTags.size > 0) {
        const hasAnyTag = Array.from(selectedTags).some((t) => p.tags.includes(t));
        if (!hasAnyTag) return false;
      }

      return true;
    });

    // Apply sorting
    if (sortBy === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "difficulty-asc") {
      const order = { EASY: 1, MEDIUM: 2, HARD: 3 };
      list = [...list].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    } else if (sortBy === "difficulty-desc") {
      const order = { EASY: 1, MEDIUM: 2, HARD: 3 };
      list = [...list].sort((a, b) => order[b.difficulty] - order[a.difficulty]);
    }

    // Apply shuffle if requested
    if (shuffleSeed !== null) {
      list = [...list].sort(() => Math.sin(shuffleSeed) - 0.5);
    }

    return list;
  }, [
    searchQuery,
    selectedDifficulty,
    selectedSubject,
    selectedCompany,
    selectedSource,
    selectedStatus,
    selectedStarred,
    selectedTags,
    sortBy,
    shuffleSeed,
    completedIds,
    starredIds,
  ]);

  // Reset pagination to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedDifficulty,
    selectedSubject,
    selectedCompany,
    selectedSource,
    selectedStatus,
    selectedStarred,
    selectedTags,
    sortBy,
    hitsPerPage,
  ]);

  // Paginated slice
  const totalHits = filteredProblems.length;
  const totalPages = Math.max(1, Math.ceil(totalHits / hitsPerPage));
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * hitsPerPage;
    return filteredProblems.slice(start, start + hitsPerPage);
  }, [filteredProblems, currentPage, hitsPerPage]);

  // Quick Random Problem Picker
  function handleRandomUnsolved() {
    const unsolved = filteredProblems.filter((p) => !completedIds.has(p.id));
    const pool = unsolved.length > 0 ? unsolved : filteredProblems;
    if (pool.length === 0) return;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setActiveProblemId(random.id);
  }

  // Shuffle currently filtered problems
  function handleShuffle() {
    setShuffleSeed(Date.now());
  }

  // Reset all filters
  function handleResetFilters() {
    setSearchQuery("");
    setSelectedDifficulty("ALL");
    setSelectedSubject("ALL");
    setSelectedCompany("ALL");
    setSelectedSource("ALL");
    setSelectedStatus("ALL");
    setSelectedStarred("ALL");
    setSelectedTags(new Set());
    setSortBy("relevance");
    setShuffleSeed(null);
    setCurrentPage(1);
  }

  // Active problem object for modal
  const activeProblem = useMemo(() => {
    if (!activeProblemId) return null;
    return ALL_PROBLEMS.find((p) => p.id === activeProblemId) || null;
  }, [activeProblemId]);

  const activeIndex = useMemo(() => {
    if (!activeProblemId) return -1;
    return filteredProblems.findIndex((p) => p.id === activeProblemId);
  }, [activeProblemId, filteredProblems]);

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < filteredProblems.length - 1;

  function handlePrevModalProblem() {
    if (hasPrev) {
      setActiveProblemId(filteredProblems[activeIndex - 1].id);
    }
  }

  function handleNextModalProblem() {
    if (hasNext) {
      setActiveProblemId(filteredProblems[activeIndex + 1].id);
    }
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  const isAnyFilterActive =
    searchQuery.trim() !== "" ||
    selectedDifficulty !== "ALL" ||
    selectedSubject !== "ALL" ||
    selectedCompany !== "ALL" ||
    selectedSource !== "ALL" ||
    selectedStatus !== "ALL" ||
    selectedStarred !== "ALL" ||
    selectedTags.size > 0 ||
    sortBy !== "relevance" ||
    shuffleSeed !== null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* 1. USACO Vibrant Blue Hero Banner with Centered Search Bar */}
      <section className="relative overflow-hidden bg-[#1d58d8] dark:bg-[#122e6b] py-14 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        {/* Subtle grid texture overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-4xl text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {t("Problems", "প্র্যাকটিস প্রবলেমস")}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-medium max-w-xl mx-auto">
              {t(
                "Curated interview questions tagged by Bangladesh tech companies, core CS topics, and algorithmic paradigms.",
                "বাংলাদেশের শীর্ষ টেক কোম্পানি এবং কম্পিউটার সায়েন্সের প্রয়োজনীয় সকল ইন্টারভিউ সমস্যা।"
              )}
            </p>
          </div>

          {/* Centered USACO Search Input */}
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                "Search problems by title, topic, company, or tag...",
                "নাম, টপিক, কোম্পানি বা ট্যাগ দিয়ে খুঁজুন..."
              )}
              className="w-full rounded-2xl border border-white/20 bg-white/95 dark:bg-[#0f1424] py-3.5 pl-12 pr-10 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-500 shadow-xl shadow-blue-900/30 focus:outline-none focus:ring-4 focus:ring-blue-400/40 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Main Content Container: Left Tags Sidebar + Right Main Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar: Topic Tags */}
          <aside
            className={`w-full lg:w-64 shrink-0 transition-all duration-300 ${
              isTagsVisible ? "block" : "hidden"
            }`}
          >
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-blue-500" />
                  {t("Topic Tags", "টপিক ট্যাগসমূহ")}
                </span>
                {selectedTags.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTags(new Set())}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t("Clear", "ক্লিয়ার")}
                  </button>
                )}
              </div>

              {/* Tags List */}
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {tagCounts.map(([tag, count]) => {
                  const isSelected = selectedTags.has(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className="truncate">{tag}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                          isSelected
                            ? "bg-blue-700 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Main Area: Filters, Controls, Problem Cards, Pagination */}
          <div className="flex-1 min-w-0 space-y-6 w-full">
            {/* Top Toolbar: Hide/Show Tags Toggle + Active Count */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleToggleTagsVisibility}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition shadow-xs"
              >
                {isTagsVisible ? (
                  <>
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    <span>{t("Hide tags", "ট্যাগ লুকান")}</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span>{t("Show tags", "ট্যাগ প্রদর্শন")}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  {t("Found", "মোট")} <strong className="text-foreground">{totalHits}</strong>{" "}
                  {t("problems", "টি সমস্যা")}
                </span>
                {isAnyFilterActive && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>{t("Reset all filters", "সব রিসেট করুন")}</span>
                  </button>
                )}
              </div>
            </div>

            {/* USACO Filter Grid */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
              {/* Row 1: Difficulty, Modules/Subjects, Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Difficulty */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    {t("Difficulty", "কঠিনতার স্তর")}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-background py-2 px-3 pr-8 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="ALL">{t("All Difficulties", "সকল স্তর")}</option>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {/* Modules / Subjects */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    {t("Modules / Subjects", "মডিউল / বিষয়")}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-background py-2 px-3 pr-8 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="ALL">{t("All Modules", "সকল মডিউল")}</option>
                      {allSubjects.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    {t("Company", "কোম্পানি")}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-background py-2 px-3 pr-8 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="ALL">{t("All Companies", "সকল কোম্পানি")}</option>
                      {allCompanies.map((comp) => (
                        <option key={comp} value={comp}>
                          {comp}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Row 2: Source, Status, Starred */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Source */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    {t("Source / Platform", "উৎস")}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-background py-2 px-3 pr-8 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="ALL">{t("All Sources", "সকল উৎস")}</option>
                      {allSources.map((src) => (
                        <option key={src} value={src}>
                          {src}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    {t("Solve Status", "সমাধানের অবস্থা")}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-background py-2 px-3 pr-8 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="ALL">{t("All Status", "সব অবস্থা")}</option>
                      <option value="SOLVED">{t("Solved", "সমাধানকৃত")}</option>
                      <option value="UNSOLVED">{t("Unsolved", "অসমাধানকৃত")}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {/* Starred */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    {t("Bookmarks", "বুকমার্ক")}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedStarred}
                      onChange={(e) => setSelectedStarred(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-background py-2 px-3 pr-8 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="ALL">{t("All Problems", "সকল প্রশ্ন")}</option>
                      <option value="STARRED">{t("Starred Only ★", "কেবল বুকমার্ককৃত ★")}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Row 3: Action Buttons (Shuffle, Random, Sort By) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/70">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                  >
                    <Shuffle className="h-3.5 w-3.5 text-blue-500" />
                    <span>{t("Shuffle", "এলোমেলো")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRandomUnsolved}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition"
                  >
                    <Dices className="h-3.5 w-3.5" />
                    <span>{t("Random", "দৈবচয়ন")}</span>
                  </button>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    {t("Sort by:", "সাজান:")}
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none rounded-xl border border-border bg-background py-1.5 pl-3 pr-8 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="relevance">{t("Relevance", "প্রাসঙ্গিকতা")}</option>
                      <option value="difficulty-asc">{t("Difficulty: Easy → Hard", "কঠিনতা: সহজ → কঠিন")}</option>
                      <option value="difficulty-desc">{t("Difficulty: Hard → Easy", "কঠিনতা: কঠিন → সহজ")}</option>
                      <option value="name">{t("Title: A → Z", "নাম: A → Z")}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Tag Chips */}
            {selectedTags.size > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-medium text-muted-foreground mr-1">
                  {t("Active Tags:", "সক্রিয় ট্যাগসমূহ:")}
                </span>
                {Array.from(selectedTags).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-xs font-medium text-blue-400"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 3. Problem Cards Grid (USACO Guide Style) */}
            {paginatedProblems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {t("No problems found matching your filters", "কোনো সমস্যা পাওয়া যায়নি")}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {t(
                    "Try resetting one or more filters or search terms to broaden your results.",
                    "অনুগ্রহ করে ফিল্টার বা সার্চ টার্ম পরিবর্তন করে পুনরায় চেষ্টা করুন।"
                  )}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t("Reset all filters", "সব ফিল্টার রিসেট")}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedProblems.map((prob) => {
                  const isDone = completedIds.has(prob.id);
                  const isStar = starredIds.has(prob.id);

                  return (
                    <div
                      key={prob.id}
                      className={`group relative flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-xs transition-all hover:shadow-md ${
                        isDone
                          ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                          : "border-border hover:border-blue-500/50"
                      }`}
                    >
                      {/* Card Header: Source Abbr (Left) & Actions (Right) */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                            {prob.sourceAbbr}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Star Bookmark */}
                            <button
                              type="button"
                              onClick={() => handleToggleStarred(prob.id)}
                              className={`rounded-lg p-1 transition ${
                                isStar
                                  ? "text-amber-400"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              title={isStar ? "Remove Star" : "Star"}
                            >
                              <Star className={`h-4 w-4 ${isStar ? "fill-amber-400" : ""}`} />
                            </button>

                            {/* Solved Status Circle */}
                            <button
                              type="button"
                              onClick={() => handleToggleCompleted(prob.id)}
                              className={`rounded-full p-0.5 transition ${
                                isDone
                                  ? "text-emerald-500 hover:text-emerald-600"
                                  : "text-muted-foreground/50 hover:text-emerald-500"
                              }`}
                              title={isDone ? "Completed" : "Mark as completed"}
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-5 w-5 fill-emerald-500 text-card" />
                              ) : (
                                <Circle className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Problem Title */}
                        <h3
                          onClick={() => setActiveProblemId(prob.id)}
                          className="text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition line-clamp-2 leading-snug"
                        >
                          {prob.name}
                        </h3>

                        {/* Action Links */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => setActiveProblemId(prob.id)}
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <span>{t("View Solution", "সমাধান দেখুন")}</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>

                          {prob.url && (
                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline"
                            >
                              <span>{t("Practice Online", "অনলাইনে প্র্যাকটিস")}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        {/* Appears In Module */}
                        {prob.appearsIn && prob.appearsIn.length > 0 && (
                          <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
                            <span className="text-[11px] font-semibold text-muted-foreground block">
                              {t("Appears In:", "সিলেবাসে অন্তর্ভুক্ত:")}
                            </span>
                            <div className="flex flex-col gap-0.5">
                              {prob.appearsIn.slice(0, 2).map((item, idx) => (
                                <Link
                                  key={idx}
                                  href={item.url}
                                  className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                                >
                                  • {item.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Difficulty Pill & Company */}
                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                        <span
                          className={`rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            DIFFICULTY_STYLES[prob.difficulty]
                          }`}
                        >
                          {prob.difficulty}
                        </span>

                        {prob.company && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground truncate">
                            <Building2 className="h-3 w-3 text-amber-500 shrink-0" />
                            <span className="truncate">{prob.company}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. USACO Pagination & Hits Per Page */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                {/* Hits summary */}
                <div className="text-xs text-muted-foreground">
                  {t("Showing", "প্রদর্শন")} <strong>{(currentPage - 1) * hitsPerPage + 1}</strong> –{" "}
                  <strong>{Math.min(currentPage * hitsPerPage, totalHits)}</strong> {t("of", "এর মধ্যে")}{" "}
                  <strong>{totalHits}</strong> {t("problems", "টি সমস্যা")}
                </div>

                {/* Page Buttons */}
                <div className="flex items-center gap-1.5">
                  {/* First */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition"
                    title="First Page"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>

                  {/* Prev */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition"
                    title="Previous Page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    // Only show neighboring pages if totalPages is large
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white shadow-xs"
                              : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                      return (
                        <span key={pageNum} className="px-1 text-xs text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  {/* Next */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition"
                    title="Next Page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Last */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition"
                    title="Last Page"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Hits per page selector */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="relative">
                    <select
                      value={hitsPerPage}
                      onChange={(e) => setHitsPerPage(Number(e.target.value))}
                      className="appearance-none rounded-xl border border-border bg-card py-1.5 pl-3 pr-7 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value={12}>12 hits per page</option>
                      <option value={24}>24 hits per page</option>
                      <option value={48}>48 hits per page</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 5. In-Depth Solution & Hint Modal */}
      <ProblemSolutionModal
        problem={activeProblem}
        isOpen={Boolean(activeProblem)}
        onClose={() => setActiveProblemId(null)}
        isCompleted={activeProblem ? completedIds.has(activeProblem.id) : false}
        isStarred={activeProblem ? starredIds.has(activeProblem.id) : false}
        onToggleCompleted={handleToggleCompleted}
        onToggleStarred={handleToggleStarred}
        onPrevProblem={handlePrevModalProblem}
        onNextProblem={handleNextModalProblem}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
    </div>
  );
}
