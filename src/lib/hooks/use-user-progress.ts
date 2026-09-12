"use client";

import { useSyncExternalStore, useMemo } from "react";
import { CURRICULUM_SUBJECTS, CURRICULUM_TRACKS } from "@/lib/curriculum-data";
import { createClient } from "@/lib/supabase/client";

export interface ProgressData {
  completedLessons: string[]; // key: `${subjectSlug}:${lessonSlug}`
  inProgressLessons: string[]; // key: `${subjectSlug}:${lessonSlug}`
  skippedLessons?: string[]; // key: `${subjectSlug}:${lessonSlug}`
  completedProblems: string[]; // problemId
  inProgressProblems?: string[]; // problemId
  skippedProblems?: string[]; // problemId
}

const STORAGE_KEY = "bd-software-prep:user-progress";

const DEFAULT_PROGRESS: ProgressData = {
  completedLessons: [],
  inProgressLessons: [],
  skippedLessons: [],
  completedProblems: [],
  inProgressProblems: [],
  skippedProblems: [],
};

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function getSnapshot(): string {
  if (typeof window === "undefined") return JSON.stringify(DEFAULT_PROGRESS);
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return JSON.stringify(DEFAULT_PROGRESS);
  return data;
}

function getServerSnapshot(): string {
  return JSON.stringify(DEFAULT_PROGRESS);
}

export function useUserProgress() {
  const rawData = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const progress: ProgressData = useMemo(() => {
    try {
      const parsed = JSON.parse(rawData) as ProgressData;
      return {
        completedLessons: parsed.completedLessons || [],
        inProgressLessons: parsed.inProgressLessons || [],
        skippedLessons: parsed.skippedLessons || [],
        completedProblems: parsed.completedProblems || [],
        inProgressProblems: parsed.inProgressProblems || [],
        skippedProblems: parsed.skippedProblems || [],
      };
    } catch {
      return DEFAULT_PROGRESS;
    }
  }, [rawData]);

  function saveProgress(updated: ProgressData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }

  function getLessonStatus(
    subjectSlug: string,
    lessonSlug: string
  ): "COMPLETED" | "IN_PROGRESS" | "SKIPPED" | "NOT_STARTED" {
    const key = `${subjectSlug}:${lessonSlug}`;
    if (progress.completedLessons?.includes(key)) return "COMPLETED";
    if (progress.inProgressLessons?.includes(key)) return "IN_PROGRESS";
    if (progress.skippedLessons?.includes(key)) return "SKIPPED";
    return "NOT_STARTED";
  }

  function markLesson(
    subjectSlug: string,
    lessonSlug: string,
    status: "COMPLETED" | "IN_PROGRESS" | "SKIPPED" | "NOT_STARTED"
  ) {
    const key = `${subjectSlug}:${lessonSlug}`;
    const newCompleted = (progress.completedLessons || []).filter((k) => k !== key);
    const newInProgress = (progress.inProgressLessons || []).filter((k) => k !== key);
    const newSkipped = (progress.skippedLessons || []).filter((k) => k !== key);

    if (status === "COMPLETED") {
      newCompleted.push(key);
    } else if (status === "IN_PROGRESS") {
      newInProgress.push(key);
    } else if (status === "SKIPPED") {
      newSkipped.push(key);
    }

    saveProgress({
      ...progress,
      completedLessons: newCompleted,
      inProgressLessons: newInProgress,
      skippedLessons: newSkipped,
    });

    // Attempt non-blocking cloud sync if user is signed in and DB is available
    if (typeof window !== "undefined") {
      void (async () => {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          const { data: lesson } = await supabase
            .from("lessons")
            .select("id")
            .eq("slug", lessonSlug)
            .maybeSingle();

          if (!lesson?.id) return;

          const completedAt =
            status === "COMPLETED" ? new Date().toISOString() : null;

          await supabase.from("user_progress").upsert(
            {
              user_id: user.id,
              lesson_id: lesson.id,
              status,
              completed_at: completedAt,
            },
            { onConflict: "user_id,lesson_id" }
          );
        } catch {
          // Cloud sync is best-effort; localStorage remains local truth
        }
      })();
    }
  }

  function cycleLessonStatus(subjectSlug: string, lessonSlug: string) {
    const current = getLessonStatus(subjectSlug, lessonSlug);
    const nextMap: Record<
      "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED",
      "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED"
    > = {
      NOT_STARTED: "IN_PROGRESS",
      IN_PROGRESS: "COMPLETED",
      COMPLETED: "SKIPPED",
      SKIPPED: "NOT_STARTED",
    };
    markLesson(subjectSlug, lessonSlug, nextMap[current]);
  }

  function getProblemStatus(
    problemId: string
  ): "COMPLETED" | "IN_PROGRESS" | "SKIPPED" | "NOT_STARTED" {
    if (progress.completedProblems?.includes(problemId)) return "COMPLETED";
    if (progress.inProgressProblems?.includes(problemId)) return "IN_PROGRESS";
    if (progress.skippedProblems?.includes(problemId)) return "SKIPPED";
    return "NOT_STARTED";
  }

  function markProblem(
    problemId: string,
    status: "COMPLETED" | "IN_PROGRESS" | "SKIPPED" | "NOT_STARTED"
  ) {
    const newCompleted = (progress.completedProblems || []).filter((k) => k !== problemId);
    const newInProgress = (progress.inProgressProblems || []).filter((k) => k !== problemId);
    const newSkipped = (progress.skippedProblems || []).filter((k) => k !== problemId);

    if (status === "COMPLETED") {
      newCompleted.push(problemId);
    } else if (status === "IN_PROGRESS") {
      newInProgress.push(problemId);
    } else if (status === "SKIPPED") {
      newSkipped.push(problemId);
    }

    saveProgress({
      ...progress,
      completedProblems: newCompleted,
      inProgressProblems: newInProgress,
      skippedProblems: newSkipped,
    });
  }

  function cycleProblemStatus(problemId: string) {
    const current = getProblemStatus(problemId);
    const nextMap: Record<
      "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED",
      "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED"
    > = {
      NOT_STARTED: "IN_PROGRESS",
      IN_PROGRESS: "COMPLETED",
      COMPLETED: "SKIPPED",
      SKIPPED: "NOT_STARTED",
    };
    markProblem(problemId, nextMap[current]);
  }

  async function syncWithCloud() {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cloudProgress } = await supabase
        .from("user_progress")
        .select("status, lessons(slug, subjects(slug))")
        .eq("user_id", user.id);

      if (!cloudProgress || cloudProgress.length === 0) return;

      const current: ProgressData = JSON.parse(getSnapshot());
      const completedSet = new Set(current.completedLessons || []);
      const inProgressSet = new Set(current.inProgressLessons || []);
      const skippedSet = new Set(current.skippedLessons || []);

      for (const item of cloudProgress as Array<{
        status: string;
        lessons?: { slug?: string; subjects?: { slug?: string } | null } | null;
      }>) {
        const subSlug = item.lessons?.subjects?.slug;
        const lesSlug = item.lessons?.slug;
        if (subSlug && lesSlug) {
          const key = `${subSlug}:${lesSlug}`;
          if (item.status === "COMPLETED") {
            completedSet.add(key);
            inProgressSet.delete(key);
            skippedSet.delete(key);
          } else if (item.status === "IN_PROGRESS") {
            inProgressSet.add(key);
            completedSet.delete(key);
            skippedSet.delete(key);
          } else if (item.status === "SKIPPED") {
            skippedSet.add(key);
            completedSet.delete(key);
            inProgressSet.delete(key);
          }
        }
      }

      saveProgress({
        ...current,
        completedLessons: Array.from(completedSet),
        inProgressLessons: Array.from(inProgressSet),
        skippedLessons: Array.from(skippedSet),
      });
    } catch {
      // Cloud sync failure handled gracefully
    }
  }

  function isLessonCompleted(subjectSlug: string, lessonSlug: string): boolean {
    const key = `${subjectSlug}:${lessonSlug}`;
    return (progress.completedLessons || []).includes(key);
  }

  // Calculate subject progress statistics
  const subjectStats = useMemo(() => {
    const stats: Record<
      string,
      {
        completed: number;
        total: number;
        percentage: number;
        status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
      }
    > = {};

    for (const sub of CURRICULUM_SUBJECTS) {
      const completedCount = progress.completedLessons.filter((key) =>
        key.startsWith(`${sub.slug}:`)
      ).length;
      const inProgressCount = progress.inProgressLessons.filter((key) =>
        key.startsWith(`${sub.slug}:`)
      ).length;

      const percentage = sub.estimatedLessons > 0
        ? Math.min(100, Math.round((completedCount / sub.estimatedLessons) * 100))
        : 0;

      let status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" = "NOT_STARTED";
      if (completedCount >= sub.estimatedLessons && sub.estimatedLessons > 0) {
        status = "COMPLETED";
      } else if (completedCount > 0 || inProgressCount > 0) {
        status = "IN_PROGRESS";
      }

      stats[sub.slug] = {
        completed: completedCount,
        total: sub.estimatedLessons,
        percentage,
        status,
      };
    }

    return stats;
  }, [progress]);

  // Calculate track progress statistics
  const trackStats = useMemo(() => {
    const stats: Record<
      string,
      {
        completed: number;
        total: number;
        percentage: number;
      }
    > = {};

    for (const track of CURRICULUM_TRACKS) {
      const trackSubs = CURRICULUM_SUBJECTS.filter((s) => s.trackId === track.id);
      let totalLessons = 0;
      let completedLessons = 0;

      for (const sub of trackSubs) {
        totalLessons += sub.estimatedLessons;
        completedLessons += progress.completedLessons.filter((key) =>
          key.startsWith(`${sub.slug}:`)
        ).length;
      }

      const percentage = totalLessons > 0
        ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
        : 0;

      stats[track.id] = {
        completed: completedLessons,
        total: totalLessons,
        percentage,
      };
    }

    return stats;
  }, [progress]);

  // Overall platform statistics
  const overallStats = useMemo(() => {
    let totalLessons = 0;
    for (const sub of CURRICULUM_SUBJECTS) {
      totalLessons += sub.estimatedLessons;
    }

    const completedCount = progress.completedLessons.length;
    const inProgressCount = progress.inProgressLessons.length;
    const percentage = totalLessons > 0
      ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
      : 0;

    let readinessLevelEn = "Beginner";
    let readinessLevelBn = "সূচনা স্তর";

    if (percentage >= 75) {
      readinessLevelEn = "Interview Ready";
      readinessLevelBn = "সাক্ষাৎকার-প্রস্তুত";
    } else if (percentage >= 40) {
      readinessLevelEn = "Advanced Intermediate";
      readinessLevelBn = "উন্নত মধ্যবর্তী স্তর";
    } else if (percentage >= 15) {
      readinessLevelEn = "Intermediate";
      readinessLevelBn = "মধ্যবর্তী স্তর";
    }

    let completedSubjectsCount = 0;
    let inProgressSubjectsCount = 0;
    for (const sub of CURRICULUM_SUBJECTS) {
      const completedCount = progress.completedLessons.filter((key) =>
        key.startsWith(`${sub.slug}:`)
      ).length;
      const inProgressCount2 = progress.inProgressLessons.filter((key) =>
        key.startsWith(`${sub.slug}:`)
      ).length;
      if (completedCount >= sub.estimatedLessons && sub.estimatedLessons > 0) {
        completedSubjectsCount++;
      } else if (completedCount > 0 || inProgressCount2 > 0) {
        inProgressSubjectsCount++;
      }
    }

    return {
      totalLessons,
      totalSubjects: CURRICULUM_SUBJECTS.length,
      completedSubjects: completedSubjectsCount,
      completedLessons: completedCount,
      inProgressCount: inProgressSubjectsCount,
      percentage,
      solvedProblems: progress.completedProblems.length,
      readinessLevelEn,
      readinessLevelBn,
    };
  }, [progress]);

  return {
    progress,
    markLesson,
    cycleLessonStatus,
    getLessonStatus,
    markProblem,
    cycleProblemStatus,
    getProblemStatus,
    syncWithCloud,
    isLessonCompleted,
    subjectStats,
    trackStats,
    overallStats,
  };
}
