"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Code2,
  Flame,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { LocalLesson } from "@/lib/lessons-data";

interface LessonMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LocalLesson;
  subjectSlug: string;
  subjectNameEn: string;
  subjectNameBn: string;
  nextLesson: LocalLesson | null;
  completedCount: number;
  totalCount: number;
  readinessLevelEn?: string;
  readinessLevelBn?: string;
}

// ─────────────────────────────────────────────────────────────
// Lightweight 60fps HTML5 Canvas Confetti Burst
// ─────────────────────────────────────────────────────────────
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;
    const width = (canvas.width = window.innerWidth * dpr);
    const height = (canvas.height = window.innerHeight * dpr);

    const colors = [
      "#10B981", // emerald
      "#3B82F6", // blue
      "#F59E0B", // amber
      "#EC4899", // pink
      "#8B5CF6", // purple
      "#06B6D4", // cyan
      "#F43F5E", // rose
    ];

    const particleCount = 80;
    const particles = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 5;
      return {
        x: width / 2,
        y: height / 2.2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        gravity: 0.28,
        drag: 0.98,
      };
    });

    let startTime = performance.now();

    function render(currentTime: number) {
      if (!ctx || !canvas) return;
      const elapsed = currentTime - startTime;

      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of particles) {
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (elapsed > 1800) {
          p.opacity = Math.max(0, p.opacity - 0.015);
        }

        if (p.opacity > 0 && p.y < height + 50) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      }

      if (alive && elapsed < 4500) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

export function LessonMilestoneModal({
  isOpen,
  onClose,
  lesson,
  subjectSlug,
  subjectNameEn,
  subjectNameBn,
  nextLesson,
  completedCount,
  totalCount,
  readinessLevelEn = "Intermediate",
  readinessLevelBn = "মধ্যবর্তী স্তর",
}: LessonMilestoneModalProps) {
  const { language, t } = useLanguage();
  const isBn = language === "bn";

  // Escape key closes modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const percentage = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 100;
  const hasProblems = lesson.problems && lesson.problems.length > 0;

  function handleScrollToProblems() {
    onClose();
    setTimeout(() => {
      const el = document.getElementById("practice-problems");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Canvas Confetti */}
      <ConfettiCanvas />

      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="milestone-title"
        className="relative z-50 w-full max-w-lg overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300 max-h-[92vh] flex flex-col justify-between"
      >
        {/* Ambient Top Glow */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-56 w-96 -translate-x-1/2 transform-gpu blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.6), rgba(59, 130, 246, 0.4), transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={isBn ? "বন্ধ করুন" : "Close milestone modal"}
        >
          <X className="h-5 w-5" />
        </button>

        <div>
          {/* Glowing Animated Trophy Badge */}
          <div className="mx-auto mb-5 relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-blue-500 opacity-30 blur-lg animate-pulse" />
            <div className="relative flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-xl shadow-amber-500/25 border border-amber-300/40">
              <Trophy className="h-9 w-9 drop-shadow-md text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md border-2 border-card">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          {/* Subtitle Pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("Milestone Achieved", "মাইলস্টোন অর্জিত")}</span>
          </div>

          {/* Main Title */}
          <h2
            id="milestone-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-foreground"
          >
            {t("Congratulations!", "অভিনন্দন!")}
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {t(
              "You completed this curriculum lesson and strengthened your preparation.",
              "আপনি এই পাঠটি সফলভাবে সম্পন্ন করেছেন এবং আপনার প্রস্তুতি এগিয়ে নিয়েছেন।"
            )}
          </p>

          {/* Completed Lesson Highlight Box */}
          <div className="mt-4 rounded-2xl border border-border/70 bg-muted/40 p-3.5 text-left flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block truncate">
                {isBn ? subjectNameBn : subjectNameEn}
              </span>
              <h3 className="text-sm font-bold text-foreground truncate">
                {isBn ? lesson.titleBn : lesson.titleEn}
              </h3>
            </div>
          </div>

          {/* Progress Metrics Panel */}
          <div className="mt-4 rounded-2xl border border-border/70 bg-card p-4 text-left space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">
                {t("Subject Progress", "বিষয় অগ্রগতি")}
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {completedCount} / {totalCount} {isBn ? "পাঠ" : "lessons"} ({percentage}%)
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>
                  {t("Candidate Readiness:", "প্রার্থী প্রস্তুতি সূচক:")}{" "}
                  <strong className="text-foreground font-semibold">
                    {isBn ? readinessLevelBn : readinessLevelEn}
                  </strong>
                </span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {t("+1 Lesson Done", "+১ পাঠ সম্পন্ন")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5 pt-2">
          {/* Primary Action: Next Lesson if available */}
          {nextLesson ? (
            <Link
              href={`/subjects/${subjectSlug}/${nextLesson.slug}`}
              onClick={onClose}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-5 py-3 text-sm sm:text-base font-bold text-white shadow-md hover:from-blue-700 hover:to-emerald-700 transition-all shadow-blue-500/20"
            >
              <span>
                {t("Continue to Next Lesson", "পরবর্তী পাঠে যান")}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              href={`/subjects/${subjectSlug}`}
              onClick={onClose}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-5 py-3 text-sm sm:text-base font-bold text-white shadow-md hover:from-blue-700 hover:to-emerald-700 transition-all"
            >
              <span>{t("Complete Subject & View All", "সম্পূর্ণ সিলেবাস দেখুন")}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <div className="flex items-center gap-2">
            {hasProblems && (
              <button
                type="button"
                onClick={handleScrollToProblems}
                className="flex-1 rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-muted hover:border-border/80 transition-colors"
              >
                {t("Practice Problems", "অনুশীলন সমস্যা")}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border/80 bg-card px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {t("Review Lesson", "এই পাঠে থাকুন")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
