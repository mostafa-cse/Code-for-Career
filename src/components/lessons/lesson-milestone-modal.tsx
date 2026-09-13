"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Flame,
  BookOpen,
  Share2,
  Check,
  Building2,
  Target,
  Zap,
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
// Luxury Dual-Cannon & Starfield HTML5 Canvas Confetti Engine
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
      "#F59E0B", // Amber Gold
      "#EAB308", // Bright Gold
      "#10B981", // Emerald
      "#3B82F6", // Sapphire Blue
      "#8B5CF6", // Royal Violet
      "#EC4899", // Rose Pink
      "#06B6D4", // Electric Cyan
      "#FFFFFF", // Shimmer Diamond
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      gravity: number;
      drag: number;
      shape: "star" | "rect" | "circle";
      shimmerSpeed: number;
      shimmerPhase: number;
    }

    const particles: Particle[] = [];
    const totalParticles = 130;

    // Helper: draw 5-point star
    function drawStar(
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.fill();
    }

    // Left cannon (blasts upward-right)
    for (let i = 0; i < totalParticles / 2; i++) {
      const angle = -Math.PI / 3 + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 15 + 8;
      const shapes: ("star" | "rect" | "circle")[] = ["star", "rect", "circle"];
      particles.push({
        x: width * 0.1,
        y: height * 0.9,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        opacity: 1,
        gravity: 0.26,
        drag: 0.985,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        shimmerSpeed: Math.random() * 0.1 + 0.05,
        shimmerPhase: Math.random() * Math.PI * 2,
      });
    }

    // Right cannon (blasts upward-left)
    for (let i = 0; i < totalParticles / 2; i++) {
      const angle = (-Math.PI * 2) / 3 + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 15 + 8;
      const shapes: ("star" | "rect" | "circle")[] = ["star", "rect", "circle"];
      particles.push({
        x: width * 0.9,
        y: height * 0.9,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        opacity: 1,
        gravity: 0.26,
        drag: 0.985,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        shimmerSpeed: Math.random() * 0.1 + 0.05,
        shimmerPhase: Math.random() * Math.PI * 2,
      });
    }

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
        p.shimmerPhase += p.shimmerSpeed;

        if (elapsed > 2000) {
          p.opacity = Math.max(0, p.opacity - 0.012);
        }

        if (p.opacity > 0 && p.y < height + 60) {
          alive = true;
          const shimmer = Math.sin(p.shimmerPhase) * 0.25 + 0.75;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * shimmer;

          if (p.shape === "star") {
            drawStar(ctx, 0, 0, 5, p.size, p.size * 0.45);
          } else if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
          }
          ctx.restore();
        }
      }

      if (alive && elapsed < 5000) {
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
  const [copied, setCopied] = useState(false);

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

  const percentage =
    totalCount > 0
      ? Math.min(100, Math.round((completedCount / totalCount) * 100))
      : 100;
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

  function handleShare() {
    const text = `I just completed "${lesson.titleEn}" in ${subjectNameEn} on Code For Career. Progress: ${completedCount}/${totalCount} lessons (${percentage}%) towards top tech interviews.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Luxury Confetti Fireworks */}
      <ConfettiCanvas />

      {/* Dark Ambient Backdrop with High-Grade Frosted Glass */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card Outer Container with Iridescent Radiant Border */}
      <div className="relative z-50 w-full max-w-xl p-[1.5px] rounded-[2.5rem] bg-gradient-to-b from-amber-400/40 via-emerald-500/30 to-blue-500/20 shadow-[0_0_50px_rgba(245,158,11,0.25)] animate-in zoom-in-95 duration-300">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="milestone-title"
          className="relative w-full overflow-hidden rounded-[2.4rem] bg-gray-950/95 dark:bg-[#070c18]/95 p-6 sm:p-9 text-center shadow-2xl backdrop-blur-2xl max-h-[94vh] flex flex-col justify-between"
        >
          {/* Ambient Glow Orbs */}
          <div
            className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-64 w-[32rem] -translate-x-1/2 transform-gpu blur-3xl opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.5), rgba(16, 185, 129, 0.35), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 right-1/4 -z-10 h-44 w-60 transform-gpu blur-3xl opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer z-10"
            aria-label={isBn ? "বন্ধ করুন" : "Close milestone celebration"}
          >
            <X className="h-5 w-5" />
          </button>

          <div>
            {/* ─────────────────────────────────────────────────────────────
                1. 3D HOLOGRAPHIC ACHIEVEMENT CREST
            ───────────────────────────────────────────────────────────── */}
            <div className="mx-auto mb-6 relative flex h-28 w-28 items-center justify-center">
              {/* Outer Dashed Spinning Orbit Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/40 animate-[spin_24s_linear_infinite]" />

              {/* Inner Pulsing Corona */}
              <div className="absolute inset-2 rounded-full border border-amber-300/30 bg-amber-500/10 blur-sm animate-pulse" />

              {/* Multi-layered 3D Medallion */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 shadow-2xl shadow-amber-500/40">
                <div className="flex h-full w-full items-center justify-center rounded-[0.9rem] bg-gradient-to-b from-amber-500 via-amber-600 to-yellow-700">
                  <Trophy className="h-10 w-10 text-yellow-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
                </div>
              </div>

              {/* Floating Sparkle Stars */}
              <div className="absolute -top-1 -right-1 text-amber-300 animate-bounce duration-1000">
                <Sparkles className="h-5 w-5 fill-amber-300" />
              </div>
              <div className="absolute -bottom-1 -left-1 text-emerald-400 animate-pulse">
                <Sparkles className="h-4 w-4 fill-emerald-400" />
              </div>

              {/* Verification Seal Badge */}
              <div className="absolute -bottom-2 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg border-2 border-gray-950">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            {/* Elite Ribbon Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-black tracking-widest text-amber-300 uppercase shadow-inner shadow-amber-500/20 mb-3">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>{t("Milestone Achieved • Topic Mastered", "মাইলস্টোন অর্জিত • বিষয় দক্ষতা সম্পন্ন")}</span>
            </div>

            {/* Main Title with Iridescent Shimmer */}
            <h2
              id="milestone-title"
              className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight"
            >
              {t("Outstanding Work!", "দারুণ সাফল্য!")}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              {t(
                "You've conquered this core topic. Each completed lesson systematically builds your technical readiness for top-tier software engineering interviews.",
                "আপনি এই গুরুত্বপূর্ণ অধ্যায়টি সফলভাবে সম্পন্ন করেছেন। প্রতিটি পাঠ আপনাকে দেশের শীর্ষ সফটওয়্যার প্রতিষ্ঠানে ইন্টারভিউয়ের জন্য এক ধাপ এগিয়ে নিয়ে যায়।"
              )}
            </p>

            {/* ─────────────────────────────────────────────────────────────
                2. COMPLETED LESSON SPOTLIGHT CARD
            ───────────────────────────────────────────────────────────── */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-left flex items-center gap-3.5 backdrop-blur-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 text-blue-400 border border-blue-400/30 font-bold">
                <BookOpen className="h-6 w-6 text-blue-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                    {isBn ? subjectNameBn : subjectNameEn}
                  </span>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                    {lesson.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white truncate mt-0.5">
                  {isBn ? lesson.titleBn : lesson.titleEn}
                </h3>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                3. THREE-METRIC LUXURY HUD PANEL
            ───────────────────────────────────────────────────────────── */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
              {/* Stat 1: Subject Progress */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-gray-400">
                  {t("Subject Progress", "বিষয় অগ্রগতি")}
                </span>
                <div className="mt-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-white font-mono">
                      {percentage}%
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stat 2: Candidate Readiness */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-400">
                    {t("Readiness Level", "প্রস্তুতি স্তর")}
                  </span>
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <div className="mt-2">
                  <div className="text-sm font-bold text-amber-300 truncate">
                    {isBn ? readinessLevelBn : readinessLevelEn}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
                    {t("+1 Lesson Completed", "+১ পাঠ সম্পন্ন")}
                  </span>
                </div>
              </div>

              {/* Stat 3: Tech Employer Target */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-400">
                    {t("Target Employers", "লক্ষ্য কোম্পানি")}
                  </span>
                  <Building2 className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-300 border border-purple-500/30">
                    Enosis
                  </span>
                  <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-300 border border-blue-500/30">
                    Therap
                  </span>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                    Samsung
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. ACTION BUTTONS & NEXT LESSON LAUNCHER
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-6 space-y-2.5 pt-2 border-t border-white/10">
            {/* Primary Action Button: Continue Next Lesson */}
            {nextLesson ? (
              <Link
                href={`/subjects/${subjectSlug}/${nextLesson.slug}`}
                onClick={onClose}
                className="group relative flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 p-4 text-white shadow-xl shadow-indigo-600/30 hover:from-blue-500 hover:to-emerald-500 transition-all cursor-pointer"
              >
                <div className="text-left">
                  <span className="block text-[11px] font-medium text-white/80 uppercase tracking-wider">
                    {t("Up Next in Sequence", "পরবর্তী পাঠ")}
                  </span>
                  <span className="block text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                    {isBn ? nextLesson.titleBn : nextLesson.titleEn}
                  </span>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs transition-transform group-hover:translate-x-1.5">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </Link>
            ) : (
              <Link
                href={`/subjects/${subjectSlug}`}
                onClick={onClose}
                className="group relative flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white shadow-xl shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
              >
                <div className="text-left">
                  <span className="block text-[11px] font-medium text-white/80 uppercase tracking-wider">
                    {t("Subject Mastered!", "সম্পূর্ণ সিলেবাস সম্পন্ন!")}
                  </span>
                  <span className="block text-sm sm:text-base font-bold text-white">
                    {t("Return to Subject Overview", "মূল বিষয় তালিকায় ফিরুন")}
                  </span>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs transition-transform group-hover:translate-x-1.5">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </Link>
            )}

            {/* Secondary Action Grid: Problems, Share & Review */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {hasProblems ? (
                <button
                  type="button"
                  onClick={handleScrollToProblems}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs font-bold text-white hover:bg-white/[0.12] hover:border-white/20 transition-all cursor-pointer"
                >
                  <Target className="h-3.5 w-3.5 text-amber-400" />
                  <span>
                    {t("Solve Practice Problems", "অনুশীলন সমস্যা")}
                  </span>
                </button>
              ) : (
                <Link
                  href="/problems"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs font-bold text-white hover:bg-white/[0.12] hover:border-white/20 transition-all cursor-pointer"
                >
                  <Target className="h-3.5 w-3.5 text-amber-400" />
                  <span>{t("Browse Problems", "কোম্পানি প্রবলেমস")}</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs font-bold text-gray-200 hover:bg-white/[0.12] hover:text-white transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t("Copied!", "কপি হয়েছে!")}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-blue-400" />
                    <span>{t("Share Progress", "অর্জন শেয়ার")}</span>
                  </>
                )}
              </button>
            </div>

            {/* Subtle dismiss button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-xs font-medium text-gray-400 hover:text-gray-200 py-1 transition-colors cursor-pointer"
            >
              {t("Stay on this lesson", "এই পাঠটি পুনরায় দেখুন")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
