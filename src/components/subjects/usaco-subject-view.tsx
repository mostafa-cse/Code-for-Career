"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import type { SubjectMeta } from "@/lib/constants";
import { type LocalLesson, type SubjectCategory } from "@/lib/lessons-data";
import { useUserProgress } from "@/lib/hooks/use-user-progress";
import { useLanguage } from "@/components/providers/language-provider";
import { useAuth } from "@/components/providers/auth-provider";
import {
  CheckCircle2,
  Clock,
  Circle,
  MinusCircle,
  BookOpen,
  ChevronRight,
  Code2,
  Building2,
  ArrowRight,
} from "lucide-react";

interface UsacoSubjectViewProps {
  subject: SubjectMeta;
  categories: SubjectCategory[];
  allLessons: LocalLesson[];
}

const DIFFICULTY_CLASSES: Record<string, string> = {
  EASY: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800",
  MEDIUM: "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800",
  HARD: "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800",
};

export function UsacoSubjectView({
  subject,
  categories,
  allLessons,
}: UsacoSubjectViewProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const { user, openAuthModal } = useAuth();

  const {
    getLessonStatus,
    cycleLessonStatus,
    getProblemStatus,
  } = useUserProgress();

  // Calculate all problem IDs in this subject
  const allProblems = useMemo(() => {
    const list: { id: string; name: string; company: string | null }[] = [];
    for (const l of allLessons) {
      for (const p of l.problems) {
        list.push({
          id: `${subject.slug}:${l.slug}:${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          name: p.name,
          company: p.company,
        });
      }
    }
    return list;
  }, [allLessons, subject.slug]);

  // Aggregate module status counts
  const moduleCounts = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let skipped = 0;
    let notStarted = 0;

    for (const l of allLessons) {
      const status = getLessonStatus(subject.slug, l.slug);
      if (status === "COMPLETED") completed++;
      else if (status === "IN_PROGRESS") inProgress++;
      else if (status === "SKIPPED") skipped++;
      else notStarted++;
    }

    const total = allLessons.length;
    const completedPct = total > 0 ? (completed / total) * 100 : 0;
    const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;
    const skippedPct = total > 0 ? (skipped / total) * 100 : 0;

    return {
      completed,
      inProgress,
      skipped,
      notStarted,
      total,
      completedPct,
      inProgressPct,
      skippedPct,
    };
  }, [allLessons, subject.slug, getLessonStatus]);

  // Aggregate problem status counts
  const problemCounts = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let skipped = 0;
    let notStarted = 0;

    for (const p of allProblems) {
      const status = getProblemStatus(p.id);
      if (status === "COMPLETED") completed++;
      else if (status === "IN_PROGRESS") inProgress++;
      else if (status === "SKIPPED") skipped++;
      else notStarted++;
    }

    const total = allProblems.length;
    const completedPct = total > 0 ? (completed / total) * 100 : 0;
    const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;
    const skippedPct = total > 0 ? (skipped / total) * 100 : 0;

    return {
      completed,
      inProgress,
      skipped,
      notStarted,
      total,
      completedPct,
      inProgressPct,
      skippedPct,
    };
  }, [allProblems, getProblemStatus]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Top Banner / Hero Section (Identical to usaco.guide/general) */}
      <section className="bg-blue-700 dark:bg-blue-950 py-12 sm:py-16 text-white transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Main Title */}
          <h1 className="mb-4 text-center text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            {isBn ? subject.nameBn : subject.nameEn}
          </h1>

          {/* Subtitle */}
          <p className="text-center text-blue-200 text-sm sm:text-base font-medium mb-4">
            {isBn
              ? `${subject.nameEn} • বিডি সফটওয়্যার ইঞ্জিনিয়ারিং ইন্টারভিউ প্রস্তুতি`
              : "Structured preparation track for software engineering interviews in Bangladesh"}
          </p>

          {/* Friendly Guidance Text */}
          <p className="text-blue-100/90 mb-8 sm:mb-12 px-4 text-center text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            {isBn
              ? "প্রয়োজন অনুসারে মডিউল স্কিপ করে পরবর্তীতে আবার অনুশীলন করতে পারবেন। প্রতিটি মডিউলে দেশীয় সফটওয়্যার নিয়োগ পরীক্ষার লিখিত ও টেকনিক্যাল প্রশ্ন সংযুক্ত রয়েছে।"
              : "You don't have to complete all the modules in this section before moving on. Feel free to mark some as \"skipped\" and revisit them at a later time!"}
          </p>

          {/* Two Progress Cards Grid */}
          <div className="mx-auto grid max-w-2xl gap-8 lg:max-w-full lg:grid-cols-2">
            {/* Card 1: Modules Progress */}
            <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {isBn ? "মডিউল অগ্রগতি" : "Modules Progress"}
                  </h3>
                </div>

                <div className="mt-6">
                  {/* 4 Status Circles */}
                  <div className="mb-4 grid grid-cols-4 gap-2 text-center">
                    <div>
                      <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/60 text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-200 shadow-xs">
                        {moduleCounts.completed}
                      </span>
                      <span className="mt-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-green-800 dark:text-green-300">
                        {isBn ? "সম্পন্ন" : "Completed"}
                      </span>
                    </div>

                    <div>
                      <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/60 text-2xl sm:text-3xl font-bold text-yellow-800 dark:text-yellow-200 shadow-xs">
                        {moduleCounts.inProgress}
                      </span>
                      <span className="mt-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-yellow-800 dark:text-yellow-300">
                        {isBn ? "চলমান" : "In Progress"}
                      </span>
                    </div>

                    <div>
                      <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/60 text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-200 shadow-xs">
                        {moduleCounts.skipped}
                      </span>
                      <span className="mt-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                        {isBn ? "বাদ দেওয়া" : "Skipped"}
                      </span>
                    </div>

                    <div>
                      <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 shadow-xs">
                        {moduleCounts.notStarted}
                      </span>
                      <span className="mt-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        {isBn ? "শুরু হয়নি" : "Not Started"}
                      </span>
                    </div>
                  </div>

                  {/* Segmented Progress Bar */}
                  <div className="relative mt-4">
                    <div className="flex h-3.5 sm:h-4 overflow-hidden rounded-sm bg-gray-200 dark:bg-gray-700 text-xs">
                      <div
                        style={{ width: `${moduleCounts.completedPct}%` }}
                        className="bg-green-500 dark:bg-green-600 transition-all duration-300"
                        title={`${isBn ? "সম্পন্ন" : "Completed"}: ${moduleCounts.completed}`}
                      />
                      <div
                        style={{ width: `${moduleCounts.inProgressPct}%` }}
                        className="bg-yellow-400 dark:bg-yellow-500 transition-all duration-300"
                        title={`${isBn ? "চলমান" : "In Progress"}: ${moduleCounts.inProgress}`}
                      />
                      <div
                        style={{ width: `${moduleCounts.skippedPct}%` }}
                        className="bg-blue-500 dark:bg-blue-600 transition-all duration-300"
                        title={`${isBn ? "বাদ দেওয়া" : "Skipped"}: ${moduleCounts.skipped}`}
                      />
                    </div>
                    <div className="mt-1.5 text-right">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {isBn ? `মোট ${moduleCounts.total} টি` : `${moduleCounts.total} total`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Problems Progress */}
            <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {isBn ? "সমস্যা সমাধান অগ্রগতি" : "Problems Progress"}
                  </h3>
                </div>

                <div className="mt-6">
                  {/* 4 Status Circles */}
                  <div className="mb-4 grid grid-cols-4 gap-2 text-center">
                    <div>
                      <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/60 text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-200 shadow-xs">
                        {problemCounts.completed}
                      </span>
                      <span className="mt-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-green-800 dark:text-green-300">
                        {isBn ? "সম্পন্ন" : "Solved"}
                      </span>
                    </div>

                    <div>
                      <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/60 text-2xl sm:text-3xl font-bold text-yellow-800 dark:text-yellow-200 shadow-xs">
                        {problemCounts.inProgress}
                      </span>
                      <span className="mt-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-yellow-800 dark:text-yellow-300">
                        {isBn ? "চলমান" : "In Progress"}
                      </span>
                    </div>

                    <div>
                      <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/60 text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-200 shadow-xs">
                        {problemCounts.skipped}
                      </span>
                      <span className="mt-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                        {isBn ? "বাদ দেওয়া" : "Skipped"}
                      </span>
                    </div>

                    <div>
                      <span className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 shadow-xs">
                        {problemCounts.notStarted}
                      </span>
                      <span className="mt-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        {isBn ? "শুরু হয়নি" : "Not Started"}
                      </span>
                    </div>
                  </div>

                  {/* Segmented Progress Bar */}
                  <div className="relative mt-4">
                    <div className="flex h-3.5 sm:h-4 overflow-hidden rounded-sm bg-gray-200 dark:bg-gray-700 text-xs">
                      <div
                        style={{ width: `${problemCounts.completedPct}%` }}
                        className="bg-green-500 dark:bg-green-600 transition-all duration-300"
                        title={`${isBn ? "সম্পন্ন" : "Completed"}: ${problemCounts.completed}`}
                      />
                      <div
                        style={{ width: `${problemCounts.inProgressPct}%` }}
                        className="bg-yellow-400 dark:bg-yellow-500 transition-all duration-300"
                        title={`${isBn ? "চলমান" : "In Progress"}: ${problemCounts.inProgress}`}
                      />
                      <div
                        style={{ width: `${problemCounts.skippedPct}%` }}
                        className="bg-blue-500 dark:bg-blue-600 transition-all duration-300"
                        title={`${isBn ? "বাদ দেওয়া" : "Skipped"}: ${problemCounts.skipped}`}
                      />
                    </div>
                    <div className="mt-1.5 text-right">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {isBn ? `মোট ${problemCounts.total} টি` : `${problemCounts.total} total`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. USACO Guide Dotted Syllabus Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative space-y-16">
          {/* Vertical central dotted guideline for md+ screens */}
          <div
            className="hidden md:block absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-0.5 border-r-2 border-dotted border-gray-300 dark:border-gray-700"
            aria-hidden="true"
          />

          {categories.map((category) => {
            // Category progress metrics
            const catCompleted = category.lessons.filter(
              (l) => getLessonStatus(subject.slug, l.slug) === "COMPLETED"
            ).length;
            const catTotal = category.lessons.length;
            const catPct = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

            return (
              <div
                key={category.id}
                id={category.id}
                className="group/category flex flex-col md:flex-row relative z-10 gap-6 md:gap-0 scroll-mt-24"
              >
                {/* Left Column: Category Meta (Right aligned on desktop) */}
                <div className="flex-1 md:pr-12 md:text-right">
                  {category.priority === "CORE" && (
                    <div className="mb-1 flex justify-start md:justify-end">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        {isBn ? "প্রধান বিষয় (Core)" : "Core Topic"}
                      </span>
                    </div>
                  )}
                  {category.priority === "ESSENTIAL" && (
                    <div className="mb-1 flex justify-start md:justify-end">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                        {isBn ? "অপরিহার্য বিষয় (Essential)" : "Essential Topic"}
                      </span>
                    </div>
                  )}

                  <h2 className="text-2xl leading-7 font-bold text-gray-700 dark:text-gray-200 transition group-hover/category:text-blue-700 dark:group-hover/category:text-blue-400">
                    {isBn ? category.titleBn : category.titleEn}
                  </h2>

                  {/* Category Progress Pill */}
                  <div className="py-2.5 flex items-center justify-start md:justify-end gap-2">
                    <div className="inline-block">
                      <div className="flex h-2 w-24 items-center overflow-hidden rounded-full bg-gray-200 text-xs dark:bg-gray-700">
                        <div
                          style={{ width: `${catPct}%` }}
                          className="h-2 bg-green-500 dark:bg-green-600 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      {catCompleted}/{catTotal}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 md:ml-auto md:max-w-sm leading-relaxed">
                    {isBn ? category.descBn : category.descEn}
                  </p>
                </div>

                {/* Desktop Central Node Dot on Dotted Line */}
                <div
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-3 h-4 w-4 rounded-full border-2 border-blue-600 dark:border-blue-400 bg-background shadow-xs items-center justify-center z-20 transition-transform group-hover/category:scale-125"
                  aria-hidden="true"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                </div>

                {/* Right Column: Module Links */}
                <div className="flex-1 md:pl-12 space-y-4">
                  {category.lessons.map((lesson) => {
                    const status = getLessonStatus(subject.slug, lesson.slug);

                    return (
                      <div
                        key={lesson.slug}
                        className="group/module relative rounded-xl border border-transparent p-3 sm:p-4 transition-all hover:bg-card/70 hover:border-border/80 hover:shadow-xs"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Interactive Status Indicator */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!user) {
                                openAuthModal(
                                  isBn
                                    ? "পাঠের অগ্রগতি পরিবর্তন করতে অনুগ্রহ করে সাইন ইন করুন।"
                                    : "Please sign in to track your learning progress and mark lessons as completed."
                                );
                                return;
                              }
                              cycleLessonStatus(subject.slug, lesson.slug);
                            }}
                            className="mt-0.5 shrink-0 rounded-full focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer p-0.5"
                            title={`Status: ${status}. Click to cycle.`}
                            aria-label={`Toggle completion status for ${isBn ? lesson.titleBn : lesson.titleEn}`}
                          >
                            {status === "COMPLETED" && (
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 fill-green-100 dark:fill-green-950" />
                            )}
                            {status === "IN_PROGRESS" && (
                              <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                            )}
                            {status === "SKIPPED" && (
                              <MinusCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            )}
                            {status === "NOT_STARTED" && (
                              <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                            )}
                          </button>

                          {/* Module Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/subjects/${subject.slug}/${lesson.slug}`}
                              className="block group-hover/module:translate-x-0.5 transition-transform"
                            >
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span
                                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    DIFFICULTY_CLASSES[lesson.difficulty] || ""
                                  }`}
                                >
                                  {lesson.difficulty}
                                </span>
                              </div>

                              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors group-hover/module:text-blue-600 dark:group-hover/module:text-blue-400">
                                {isBn ? lesson.titleBn : lesson.titleEn}
                              </h3>

                              {/* Reading time & problem indicators */}
                              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span>
                                  {isBn
                                    ? `~${lesson.estimatedMinutes} মিনিট পাঠ`
                                    : `~${lesson.estimatedMinutes} mins read`}
                                </span>

                                {lesson.problems.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="font-semibold text-foreground/90">
                                      {isBn
                                        ? `${lesson.problems.length} টি সমস্যা`
                                        : `${lesson.problems.length} Problems`}
                                    </span>
                                  </>
                                )}

                                {lesson.problems.some((p) => p.company) && (
                                  <>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1 font-medium text-foreground/80">
                                      <Building2 className="h-3 w-3" />
                                      {Array.from(
                                        new Set(
                                          lesson.problems
                                            .map((p) => p.company)
                                            .filter(Boolean)
                                        )
                                      ).join(", ")}
                                    </span>
                                  </>
                                )}
                              </div>
                            </Link>
                          </div>

                          {/* Arrow indicator */}
                          <Link
                            href={`/subjects/${subject.slug}/${lesson.slug}`}
                            className="shrink-0 text-muted-foreground/50 group-hover/module:text-blue-600 dark:group-hover/module:text-blue-400 transition-colors pt-1"
                            aria-label={`Open ${isBn ? lesson.titleBn : lesson.titleEn}`}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Link>
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
