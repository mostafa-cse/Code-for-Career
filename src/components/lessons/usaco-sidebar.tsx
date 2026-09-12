"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Clock,
  MinusCircle,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useUserProgress } from "@/lib/hooks/use-user-progress";
import type { SubjectCategory } from "@/lib/lessons-data";

const DIFFICULTY_DOT: Record<string, string> = {
  EASY: "bg-emerald-500",
  MEDIUM: "bg-amber-500",
  HARD: "bg-orange-500",
  INSANE: "bg-rose-500",
};

interface UsacoSidebarProps {
  subjectSlug: string;
  subjectNameEn: string;
  subjectNameBn: string;
  categories: SubjectCategory[];
  activeLessonSlug: string;
  onCollapse: () => void;
  displayLang?: "en" | "bn";
}

export function UsacoSidebar({
  subjectSlug,
  subjectNameEn,
  subjectNameBn,
  categories,
  activeLessonSlug,
  onCollapse,
  displayLang,
}: UsacoSidebarProps) {
  const { language: contextLang } = useLanguage();
  const activeLang = displayLang || contextLang;
  const isBn = activeLang === "bn";
  const { getLessonStatus } = useUserProgress();

  // Find which category contains the active lesson
  const activeCatId = categories.find((cat) =>
    cat.lessons.some((l) => l.slug === activeLessonSlug)
  )?.id;

  // Track expanded state of each category; auto-expand active category
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const cat of categories) {
      initial[cat.id] = cat.id === activeCatId;
    }
    return initial;
  });

  useEffect(() => {
    if (activeCatId) {
      setExpandedCategories((prev) => ({
        ...prev,
        [activeCatId]: true,
      }));
    }
  }, [activeCatId]);

  function toggleCategory(catId: string) {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  }

  return (
    <div className="flex h-full flex-col bg-card/60 select-none">
      {/* 1. Sidebar Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/70 px-4 py-3.5">
        <Link
          href={`/subjects/${subjectSlug}`}
          className="flex items-center gap-2 min-w-0 group"
          title={isBn ? "বিষয়ের মূল পাতায় ফিরুন" : "Back to subject overview"}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-2xs group-hover:bg-blue-700 transition-colors">
            C#
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-foreground truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {isBn ? subjectNameBn : subjectNameEn}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {isBn ? `${categories.length} টি সেকশন` : `${categories.length} Sections`}
            </span>
          </div>
        </Link>

        {/* Collapse Button */}
        <button
          type="button"
          onClick={onCollapse}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title={isBn ? "সাইডবার লুকান (Ctrl + Shift + S)" : "Hide sidebar (Ctrl + Shift + S)"}
          aria-label={isBn ? "সাইডবার লুকান" : "Hide sidebar"}
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* 2. Scrollable Curriculum Accordion */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 no-scrollbar">
        {categories.map((cat, catIdx) => {
          const isExpanded = !!expandedCategories[cat.id];
          const completedCount = cat.lessons.filter(
            (l) => getLessonStatus(subjectSlug, l.slug) === "COMPLETED"
          ).length;
          const totalCount = cat.lessons.length;
          const isCatAllCompleted = totalCount > 0 && completedCount === totalCount;
          const hasActiveLesson = cat.lessons.some((l) => l.slug === activeLessonSlug);

          return (
            <div
              key={cat.id}
              className={`rounded-lg transition-colors ${
                hasActiveLesson
                  ? "bg-muted/40"
                  : "hover:bg-muted/20"
              }`}
            >
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-muted-foreground/80 group-hover:text-foreground transition-transform">
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span
                    className={`text-xs font-semibold truncate ${
                      hasActiveLesson
                        ? "text-foreground font-bold"
                        : "text-foreground/80 group-hover:text-foreground"
                    }`}
                  >
                    {isBn ? cat.titleBn : cat.titleEn}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {cat.priority === "CORE" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" title={isBn ? "প্রধান বিষয়" : "Core Topic"} />
                  )}
                  {cat.priority === "ESSENTIAL" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" title={isBn ? "অপরিহার্য বিষয়" : "Essential Topic"} />
                  )}
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isCatAllCompleted
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {completedCount}/{totalCount}
                  </span>
                </div>
              </button>

              {/* Subsections List (when expanded) */}
              {isExpanded && (
                <div className="pl-6 pr-1 pb-1.5 space-y-0.5 animate-in fade-in-50 duration-150">
                  {cat.lessons.map((l) => {
                    const isActive = l.slug === activeLessonSlug;
                    const status = getLessonStatus(subjectSlug, l.slug);

                    return (
                      <Link
                        key={l.slug}
                        href={`/subjects/${subjectSlug}/${l.slug}`}
                        className={`group flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-all ${
                          isActive
                            ? "bg-blue-600 text-white font-semibold shadow-xs"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {/* Completion Status Icon */}
                          <span className="shrink-0">
                            {status === "COMPLETED" && (
                              <CheckCircle2
                                className={`h-3.5 w-3.5 ${
                                  isActive ? "text-white" : "text-emerald-500"
                                }`}
                              />
                            )}
                            {status === "IN_PROGRESS" && (
                              <Clock
                                className={`h-3.5 w-3.5 ${
                                  isActive ? "text-white" : "text-amber-500"
                                }`}
                              />
                            )}
                            {status === "SKIPPED" && (
                              <MinusCircle
                                className={`h-3.5 w-3.5 ${
                                  isActive ? "text-white" : "text-slate-400"
                                }`}
                              />
                            )}
                            {status === "NOT_STARTED" && (
                              <Circle
                                className={`h-3.5 w-3.5 ${
                                  isActive ? "text-white/60" : "text-muted-foreground/50"
                                }`}
                              />
                            )}
                          </span>

                          <span className="truncate leading-tight">
                            {isBn ? l.titleBn : l.titleEn}
                          </span>
                        </div>

                        {/* Difficulty Indicator Dot */}
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ml-1.5 ${
                            isActive
                              ? "bg-white/80"
                              : DIFFICULTY_DOT[l.difficulty] ?? "bg-muted-foreground"
                          }`}
                          title={l.difficulty}
                        />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 3. Sidebar Footer */}
      <div className="shrink-0 border-t border-border/70 p-2.5 flex items-center justify-between text-xs text-muted-foreground">
        <Link
          href={`/subjects/${subjectSlug}`}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isBn ? "সিলেবাস" : "All Topics"}</span>
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>{isBn ? "ড্যাশবোর্ড" : "Dashboard"}</span>
        </Link>
      </div>
    </div>
  );
}
