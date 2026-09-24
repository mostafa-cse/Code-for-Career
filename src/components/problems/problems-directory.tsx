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
  LayoutGrid,
  List,
  Check,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useAuth } from "@/components/providers/auth-provider";
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
  const { user, openAuthModal } = useAuth();
  const { markProblem } = useUserProgress();

  // Local state for completed and starred problem IDs (hydrated from localStorage)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [isTagsVisible, setIsTagsVisible] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [tagSearch, setTagSearch] = useState("");

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
      const savedView = localStorage.getItem("problems_view_mode");
      if (savedView === "grid" || savedView === "table") {
        setViewMode(savedView);
      }
    } catch {
      // ignore
    }
  }, []);

  function handleSetViewMode(mode: "grid" | "table") {
    setViewMode(mode);
    try {
      localStorage.setItem("problems_view_mode", mode);
    } catch {
      // ignore
    }
  }

  // Sync completion toggle
  function handleToggleCompleted(id: string) {
    if (!user) {
      openAuthModal(
        language === "bn"
          ? "প্রবলেম সমাধান সংরক্ষণ করতে অনুগ্রহ করে সাইন ইন করুন।"
          : "Please sign in to track your solved problems across devices."
      );
      return;
    }

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
    if (!user) {
      openAuthModal(
        language === "bn"
          ? "প্রবলেম ফেভারিট বা বুকমার্ক করতে অনুগ্রহ করে সাইন ইন করুন।"
          : "Please sign in to bookmark and favorite problems."
      );
      return;
    }

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

  const filteredTagCounts = useMemo(() => {
    if (!tagSearch.trim()) return tagCounts;
    const q = tagSearch.toLowerCase();
    return tagCounts.filter(([tag]) => tag.toLowerCase().includes(q));
  }, [tagCounts, tagSearch]);

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
    setTagSearch("");
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

  const totalSolvedCount = completedIds.size;
  const totalSolvedPercentage = Math.round((totalSolvedCount / ALL_PROBLEMS.length) * 100);

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-foreground">
      {/* ── 1. Full-Bleed Edge-to-Edge Hero Banner ── */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 dark:from-[#0d1c44] dark:via-[#132657] dark:to-[#0c183b] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 xl:px-10 text-white border-b border-blue-500/20 shadow-sm">
        {/* Subtle grid texture overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Title & Stats */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {t("Problems", "প্র্যাকটিস প্রবলেমস")}
              </h1>
              <span className="rounded-full bg-white/20 dark:bg-white/10 px-3 py-0.5 text-xs font-semibold backdrop-blur-xs">
                {ALL_PROBLEMS.length} {t("Problems", "সমস্যা")}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed">
              {t(
                "Curated interview questions tagged by Bangladesh tech companies (Enosis, Therap, Samsung R&D, Brain Station 23, BJIT) and core CS algorithmic patterns.",
                "বাংলাদেশের শীর্ষ টেক কোম্পানি এবং কম্পিউটার সায়েন্সের প্রয়োজনীয় সকল ইন্টারভিউ সমস্যা।"
              )}
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-auto">
            {/* Solved Counter */}
            <div className="flex items-center gap-2.5 rounded-xl bg-white/10 dark:bg-white/5 border border-white/15 px-3.5 py-2 backdrop-blur-xs text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="font-bold">{totalSolvedCount}</span>
                <span className="text-blue-200"> / {ALL_PROBLEMS.length} {t("Solved", "সমাধান")}</span>
                <span className="ml-1 text-[11px] text-blue-300">({totalSolvedPercentage}%)</span>
              </div>
            </div>

            {/* Random Pick Button */}
            <button
              type="button"
              onClick={handleRandomUnsolved}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white text-blue-700 dark:bg-blue-500 dark:text-white px-3.5 py-2 text-xs font-bold shadow-md hover:bg-blue-50 transition"
            >
              <Dices className="h-4 w-4" />
              <span>{t("Random Problem", "দৈবচয়ন প্রশ্ন")}</span>
            </button>
          </div>
        </div>

        {/* Prominent Edge-to-Edge Search Bar */}
        <div className="relative w-full mt-6 max-w-4xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(
              "Search problems by title, topic tag, company (Enosis, Therap, Samsung), or module...",
              "নাম, টপিক, কোম্পানি (Enosis, Therap, Samsung) বা মডিউল দিয়ে খুঁজুন..."
            )}
            className="w-full rounded-xl border border-white/20 bg-white/95 dark:bg-[#0c1326] py-3 pl-11 pr-10 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-500 shadow-lg shadow-blue-950/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
      </section>

      {/* ── 2. Full-Bleed Edge-to-Edge Workspace: Left Sidebar + Right Content ── */}
      <div className="flex flex-1 w-full min-h-0 items-stretch">
        {/* ── Left Sidebar: Attached to the Leftmost Edge (left: 0) ── */}
        <aside
          className={`shrink-0 border-r border-border bg-card/40 backdrop-blur-xs flex flex-col sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden transition-all duration-300 z-20 ${
            isTagsVisible ? "w-64 sm:w-72 lg:w-80 block" : "w-0 hidden"
          }`}
        >
          {/* Sidebar Header */}
          <div className="border-b border-border p-4 bg-muted/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-blue-500" />
                {t("Topic Tags", "টপিক ট্যাগসমূহ")} ({tagCounts.length})
              </span>
              {selectedTags.size > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTags(new Set())}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("Clear all", "সব মুছুন")}
                </button>
              )}
            </div>

            {/* Filter tags search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder={t("Filter tags...", "ট্যাগ খুঁজুন...")}
                className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {tagSearch && (
                <button
                  type="button"
                  onClick={() => setTagSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Tags List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
            {filteredTagCounts.map(([tag, count]) => {
              const isSelected = selectedTags.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="truncate pr-2">{tag}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md shrink-0 ${
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
            {filteredTagCounts.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                {t("No matching tags", "কোনো ট্যাগ মিলেনি")}
              </div>
            )}
          </div>
        </aside>

        {/* ── Right Main Area: Spans to the Rightmost Edge (100% width) ── */}
        <main className="flex-1 min-w-0 flex flex-col px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-5">
          {/* Top Control Bar: Hide Tags Toggle + Count + View Mode Switcher + Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Hide/Show tags button */}
              <button
                type="button"
                onClick={handleToggleTagsVisibility}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition shadow-2xs"
              >
                {isTagsVisible ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t("Hide tags", "ট্যাগ লুকান")}</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5 text-blue-500" />
                    <span>{t("Show tags", "ট্যাগ প্রদর্শন")}</span>
                  </>
                )}
              </button>

              <span className="text-xs text-muted-foreground">
                {t("Found", "মোট")}{" "}
                <strong className="text-foreground font-bold">{totalHits}</strong>{" "}
                {t("problems", "টি সমস্যা")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Grid vs Table View Mode */}
              <div className="flex items-center rounded-xl border border-border bg-muted/40 p-0.5">
                <button
                  type="button"
                  onClick={() => handleSetViewMode("grid")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    viewMode === "grid"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Grid Cards View"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t("Grid", "গ্রিড")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetViewMode("table")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    viewMode === "table"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Table Row View"
                >
                  <List className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t("Table", "টেবিল")}</span>
                </button>
              </div>

              {/* Reset all filters */}
              {isAnyFilterActive && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{t("Reset filters", "ফিল্টার রিসেট")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Full-Width Filter Bar: 6 responsive dropdowns spanning 100% width */}
          <div className="w-full rounded-2xl border border-border bg-card/60 backdrop-blur-xs p-4 shadow-2xs space-y-3.5">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5">
              {/* 1. Difficulty */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  {t("Difficulty", "কঠিনতা")}
                </label>
                <div className="relative">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background py-1.5 px-2.5 pr-7 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">{t("All Difficulties", "সকল স্তর")}</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* 2. Modules / Subjects */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  {t("Curriculum Module", "মডিউল")}
                </label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background py-1.5 px-2.5 pr-7 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">{t("All Modules", "সকল মডিউল")}</option>
                    {allSubjects.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* 3. Company */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  {t("Company", "কোম্পানি")}
                </label>
                <div className="relative">
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background py-1.5 px-2.5 pr-7 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">{t("All Companies", "সকল কোম্পানি")}</option>
                    {allCompanies.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* 4. Source */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  {t("Source", "উৎস")}
                </label>
                <div className="relative">
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background py-1.5 px-2.5 pr-7 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">{t("All Sources", "সকল উৎস")}</option>
                    {allSources.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* 5. Status */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  {t("Status", "অবস্থা")}
                </label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background py-1.5 px-2.5 pr-7 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">{t("All Status", "সব অবস্থা")}</option>
                    <option value="SOLVED">{t("Solved", "সমাধানকৃত")}</option>
                    <option value="UNSOLVED">{t("Unsolved", "অসমাধানকৃত")}</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* 6. Starred */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  {t("Bookmarks", "বুকমার্ক")}
                </label>
                <div className="relative">
                  <select
                    value={selectedStarred}
                    onChange={(e) => setSelectedStarred(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background py-1.5 px-2.5 pr-7 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">{t("All Problems", "সকল সমস্যা")}</option>
                    <option value="STARRED">{t("Starred Only ★", "বুকমার্ককৃত ★")}</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Secondary Toolbar: Shuffle, Random & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-border/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted transition"
                >
                  <Shuffle className="h-3.5 w-3.5 text-blue-500" />
                  <span>{t("Shuffle", "এলোমেলো")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRandomUnsolved}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition"
                >
                  <Dices className="h-3.5 w-3.5" />
                  <span>{t("Random", "দৈবচয়ন")}</span>
                </button>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {t("Sort by:", "সাজান:")}
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none rounded-xl border border-border bg-background py-1 pl-2.5 pr-7 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="relevance">{t("Relevance", "প্রাসঙ্গিকতা")}</option>
                    <option value="difficulty-asc">{t("Difficulty: Easy → Hard", "কঠিনতা: সহজ → কঠিন")}</option>
                    <option value="difficulty-desc">{t("Difficulty: Hard → Easy", "কঠিনতা: কঠিন → সহজ")}</option>
                    <option value="name">{t("Title: A → Z", "নাম: A → Z")}</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filter / Tag Chips */}
          {selectedTags.size > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground mr-1">
                {t("Active Tags:", "নির্বাচিত ট্যাগসমূহ:")}
              </span>
              {Array.from(selectedTags).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="hover:opacity-75 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* ── 3. Problems List: Grid View or Table View (Utilizing Full Page Width) ── */}
          {paginatedProblems.length === 0 ? (
            <div className="w-full rounded-2xl border border-dashed border-border bg-card py-20 text-center space-y-3">
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
          ) : viewMode === "grid" ? (
            /* Full-Bleed Card Grid: Expands up to 5 columns on ultra-wide screens */
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
              {paginatedProblems.map((prob) => {
                const isDone = completedIds.has(prob.id);
                const isStar = starredIds.has(prob.id);

                return (
                  <div
                    key={prob.id}
                    className={`group relative flex flex-col justify-between rounded-xl border bg-card p-4 shadow-2xs transition-all hover:shadow-md ${
                      isDone
                        ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                        : "border-border hover:border-blue-500/50"
                    }`}
                  >
                    {/* Header: Source Abbr (Left) & Actions (Right) */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                          {prob.sourceAbbr}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* Star Bookmark */}
                          <button
                            type="button"
                            onClick={() => handleToggleStarred(prob.id)}
                            className={`rounded-lg p-1 transition ${
                              isStar
                                ? "text-amber-400"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            title={isStar ? "Remove Bookmark" : "Bookmark Problem"}
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
                            title={isDone ? "Mark as unsolved" : "Mark as solved"}
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
                        className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition line-clamp-2 leading-snug"
                      >
                        {prob.name}
                      </h3>

                      {/* Action Links */}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setActiveProblemId(prob.id)}
                          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>{t("Solution", "সমাধান")}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </button>

                        {prob.url && (
                          <a
                            href={prob.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline"
                          >
                            <span>{t("Practice", "প্র্যাকটিস")}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>

                      {/* Appears In Module */}
                      {prob.appearsIn && prob.appearsIn.length > 0 && (
                        <div className="mt-2.5 text-[11px] text-muted-foreground space-y-0.5">
                          <span className="font-semibold text-muted-foreground block text-[10px] uppercase tracking-wider">
                            {t("Module:", "মডিউল:")}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            {prob.appearsIn.slice(0, 1).map((item, idx) => (
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

                    {/* Footer: Difficulty Pill & Company */}
                    <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
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
          ) : (
            /* Full-Bleed Table View: Edge-to-Edge structured rows */
            <div className="w-full rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">{t("Status", "অবস্থা")}</th>
                      <th className="py-3 px-4">{t("Problem", "সমস্যা")}</th>
                      <th className="py-3 px-4 hidden md:table-cell">{t("Module", "মডিউল")}</th>
                      <th className="py-3 px-4 hidden lg:table-cell">{t("Company", "কোম্পানি")}</th>
                      <th className="py-3 px-4 hidden xl:table-cell">{t("Tags", "ট্যাগ")}</th>
                      <th className="py-3 px-4 w-28 text-center">{t("Difficulty", "কঠিনতা")}</th>
                      <th className="py-3 px-4 w-28 text-right">{t("Action", "একশন")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedProblems.map((prob) => {
                      const isDone = completedIds.has(prob.id);
                      const isStar = starredIds.has(prob.id);

                      return (
                        <tr
                          key={prob.id}
                          className={`hover:bg-muted/30 transition ${
                            isDone ? "bg-emerald-500/[0.02]" : ""
                          }`}
                        >
                          {/* Status */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleCompleted(prob.id)}
                              className="text-muted-foreground/50 hover:text-emerald-500 transition"
                              title={isDone ? "Mark as unsolved" : "Mark as solved"}
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 fill-emerald-500 text-card mx-auto" />
                              ) : (
                                <Circle className="h-4 w-4 mx-auto" />
                              )}
                            </button>
                          </td>

                          {/* Problem Title & Source */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                {prob.sourceAbbr}
                              </span>
                              <span
                                onClick={() => setActiveProblemId(prob.id)}
                                className="font-bold text-foreground hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                              >
                                {prob.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleToggleStarred(prob.id)}
                                className={`ml-1 p-0.5 rounded transition ${
                                  isStar
                                    ? "text-amber-400"
                                    : "text-muted-foreground/40 hover:text-muted-foreground"
                                }`}
                              >
                                <Star className={`h-3.5 w-3.5 ${isStar ? "fill-amber-400" : ""}`} />
                              </button>
                            </div>
                          </td>

                          {/* Module */}
                          <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                            {prob.appearsIn?.[0] ? (
                              <Link
                                href={prob.appearsIn[0].url}
                                className="text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs"
                              >
                                {prob.appearsIn[0].title}
                              </Link>
                            ) : (
                              prob.subjectName
                            )}
                          </td>

                          {/* Company */}
                          <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">
                            {prob.company ? (
                              <span className="flex items-center gap-1 font-medium text-foreground">
                                <Building2 className="h-3 w-3 text-amber-500 shrink-0" />
                                {prob.company}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </td>

                          {/* Tags */}
                          <td className="py-3 px-4 hidden xl:table-cell">
                            <div className="flex flex-wrap gap-1 max-w-md">
                              {prob.tags.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                                >
                                  {t}
                                </span>
                              ))}
                              {prob.tags.length > 3 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{prob.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Difficulty */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider inline-block ${
                                DIFFICULTY_STYLES[prob.difficulty]
                              }`}
                            >
                              {prob.difficulty}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveProblemId(prob.id)}
                                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {t("Solution", "সমাধান")}
                              </button>
                              {prob.url && (
                                <a
                                  href={prob.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground"
                                  title="Practice Link"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
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
          )}

          {/* ── 4. Full-Bleed Pagination & Hits Per Page ── */}
          {totalPages > 1 && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
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
                    className="appearance-none rounded-xl border border-border bg-card py-1.5 pl-3 pr-7 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={15}>15 hits per page</option>
                    <option value={24}>24 hits per page</option>
                    <option value={40}>40 hits per page</option>
                    <option value={60}>60 hits per page</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── 5. In-Depth Solution & Hint Modal ── */}
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
