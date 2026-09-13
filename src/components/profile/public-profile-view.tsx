"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  Flame,
  Target,
  Sparkles,
  Building2,
  MapPin,
  Calendar,
  Share2,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  BookOpen,
  Code2,
  Users,
  Edit3,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { UserProfile } from "@/lib/user-profiles";
import { CandidateSearchModal } from "@/components/profile/candidate-search-modal";

interface PublicProfileViewProps {
  profile: UserProfile;
  isOwner?: boolean;
}

export function PublicProfileView({ profile, isOwner = false }: PublicProfileViewProps) {
  const { language, t } = useLanguage();
  const isBn = language === "bn";

  const [copied, setCopied] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const initials = (profile.name || profile.username || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleShareProfile() {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/profile/${profile.username}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  }

  function renderBadgeIcon(iconName: string) {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="h-5 w-5" />;
      case "Target":
        return <Target className="h-5 w-5" />;
      case "Flame":
        return <Flame className="h-5 w-5" />;
      case "Trophy":
        return <Trophy className="h-5 w-5" />;
      case "Zap":
        return <Zap className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 w-full">
      <CandidateSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* ─────────────────────────────────────────────────────────────
          1. FULL-WIDTH PANORAMIC COVER BANNER WITH AURORA MESH
      ───────────────────────────────────────────────────────────── */}
      <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-gradient-to-r from-gray-950 via-slate-900 to-indigo-950 border-b border-border/40">
        {/* Animated Aurora Orbs */}
        <div
          className="pointer-events-none absolute -top-28 left-1/4 h-96 w-[48rem] transform-gpu blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.6), rgba(16, 185, 129, 0.35), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 right-1/4 h-80 w-[36rem] transform-gpu blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.45), transparent 70%)",
          }}
        />

        {/* Subtle Tech Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Full-width Top Navigation Bar */}
        <div className="relative z-10 w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md text-xs text-gray-300 shadow-sm">
            <Link
              href="/profile"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Users className="h-3.5 w-3.5 text-blue-400" />
              <span>{t("Community Directory", "কমিউনিটি ডিরেক্টরি")}</span>
            </Link>
            <span className="text-gray-500">/</span>
            <span className="font-mono text-white font-bold">
              @{profile.username}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/15 transition-all shadow-lg cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-blue-400" />
              <span>{t("Find Candidates", "প্রার্থী খুঁজুন")}</span>
              <kbd className="hidden sm:inline-block rounded bg-white/15 px-1.5 py-0.2 text-[9px] font-mono text-gray-200">
                ⌘K
              </kbd>
            </button>

            {isOwner && (
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/20 px-4 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md hover:bg-amber-500/30 transition-colors shadow-md"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{t("Edit Profile", "প্রোফাইল সম্পাদনা")}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. EXPANSIVE FULL-PAGE MULTI-COLUMN GRID (Up to 1760px)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 -mt-16 sm:-mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN: STICKY CANDIDATE IDENTITY CARD (Cols 1-4)
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 xl:col-span-3.5 space-y-6 lg:sticky lg:top-6">
            <div className="rounded-[2.2rem] p-[1.5px] bg-gradient-to-b from-white/20 via-white/10 to-transparent shadow-xl">
              <div className="relative overflow-hidden rounded-[2.1rem] border border-border/80 bg-card/95 dark:bg-[#070c18]/95 p-6 backdrop-blur-2xl text-center sm:text-left">
                {/* 3D Radiant Avatar Frame */}
                <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-border/70">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-amber-500 via-blue-500 to-emerald-400 opacity-60 blur-xs animate-pulse" />
                    {profile.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="relative h-22 w-22 sm:h-24 sm:w-24 rounded-2xl object-cover ring-2 ring-background shadow-xl"
                      />
                    ) : (
                      <div className="relative flex h-22 w-22 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white font-black text-2xl ring-2 ring-background shadow-xl">
                        {initials}
                      </div>
                    )}

                    {/* Rank Pill */}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-600 to-yellow-500 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-md">
                      {profile.rankTitleEn}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                        {profile.name}
                      </h1>
                      {profile.role === "ADMIN" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/15 px-2 py-0.5 text-[9px] font-bold text-purple-600 dark:text-purple-300">
                          <ShieldCheck className="h-2.5 w-2.5" />
                          STAFF
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-500 dark:text-blue-400 inline-block mt-0.5">
                      @{profile.username}
                    </span>
                    <p className="text-xs font-semibold text-muted-foreground mt-1">
                      {profile.targetRole}
                    </p>
                  </div>
                </div>

                {/* Bio & Elevator Pitch */}
                <div className="py-4 border-b border-border/70 text-xs text-foreground/85 leading-relaxed">
                  <p>{profile.bio}</p>
                  <div className="pt-3 flex flex-wrap items-center gap-3 text-muted-foreground text-[11px]">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      {profile.joinedDate}
                    </span>
                  </div>
                </div>

                {/* Target Employers Banner */}
                <div className="py-4 border-b border-border/70">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-blue-500" />
                      {t("Target Employers", "টার্গেট কোম্পানি")}
                    </span>
                    <span className="text-emerald-500 font-bold">
                      {profile.targetCompanies.length} Selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.targetCompanies.map((company) => (
                      <span
                        key={company}
                        className="rounded-lg border border-border/70 bg-muted/70 px-2 py-1 text-[11px] font-bold text-foreground shadow-2xs"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social & External Profiles */}
                <div className="py-4 border-b border-border/70 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t("External Handles:", "সোশ্যাল ও হ্যান্ডেল:")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border/80 bg-muted/60 p-2 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                        title="GitHub Profile"
                      >
                        <Code2 className="h-4 w-4" />
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border/80 bg-muted/60 p-2 text-blue-500 hover:text-blue-600 hover:border-blue-500/30 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {profile.codeforcesHandle && (
                      <a
                        href={`https://codeforces.com/profile/${profile.codeforcesHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border/80 bg-muted/60 px-2 py-1 text-[11px] font-mono font-bold text-amber-500 hover:border-amber-500/30 transition-colors"
                        title="Codeforces Handle"
                      >
                        CF: {profile.codeforcesHandle}
                      </a>
                    )}
                  </div>
                </div>

                {/* Action Suite */}
                <div className="pt-4 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={handleShareProfile}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer shadow-blue-500/20 active:scale-98"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-300" />
                        <span>{t("Profile Link Copied!", "প্রোফাইল লিংক কপি হয়েছে!")}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 text-white" />
                        <span>{t("Share Candidate Profile", "প্রোফাইল লিংক শেয়ার")}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-muted/60 px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted hover:border-border transition-all cursor-pointer"
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span>{t("Find Other Candidates", "অন্যান্য সহকর্মী খুঁজুন")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT AREA: HUD, TRACK MASTERY, TROPHIES & FEED (Cols 5-12)
          ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 xl:col-span-8.5 space-y-8">
            {/* ─────────────────────────────────────────────────────────
                3. FOUR-METRIC LUXURY HUD MATRIX
            ───────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Card 1: Radial Readiness Gauge */}
              <div className="rounded-3xl border border-border/80 bg-card/95 p-5 shadow-xs backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("Interview Readiness", "ইন্টারভিউ প্রস্তুতি")}
                  </span>
                  <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
                </div>

                <div className="my-3 flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-muted/60"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-amber-500"
                        strokeDasharray={`${profile.readinessPercentage}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-sm font-black text-foreground font-mono">
                      {profile.readinessPercentage}%
                    </span>
                  </div>

                  <div>
                    <span className="text-base font-black text-foreground block">
                      {isBn ? profile.readinessLevelBn : profile.readinessLevelEn}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {t("Candidate Benchmark Status", "পরীক্ষার্থী স্ট্যাটাস")}
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                    style={{ width: `${profile.readinessPercentage}%` }}
                  />
                </div>
              </div>

              {/* Card 2: Lessons Completed */}
              <div className="rounded-3xl border border-border/80 bg-card/95 p-5 shadow-xs backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("Lessons Completed", "পাঠ সম্পন্ন")}
                  </span>
                  <BookOpen className="h-4 w-4 text-blue-500" />
                </div>

                <div className="my-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-foreground font-mono">
                      {profile.completedLessons}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      / {profile.totalLessons} {t("topics", "টপিক")}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {Math.round((profile.completedLessons / profile.totalLessons) * 100)}%{" "}
                    {t("curriculum coverage", "সিলেবাস সম্পন্ন")}
                  </p>
                </div>

                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.round((profile.completedLessons / profile.totalLessons) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Card 3: Solved Problems */}
              <div className="rounded-3xl border border-border/80 bg-card/95 p-5 shadow-xs backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("Problems Solved", "কোডিং সমস্যা")}
                  </span>
                  <Target className="h-4 w-4 text-emerald-500" />
                </div>

                <div className="my-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-foreground font-mono">
                      {profile.solvedProblems}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {t("solved", "সমাধান")}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {t("Bangladeshi employer interview sets", "বিডি কোম্পানি সেট")}
                  </p>
                </div>

                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (profile.solvedProblems / 50) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Card 4: Study Streak */}
              <div className="rounded-3xl border border-border/80 bg-card/95 p-5 shadow-xs backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("Preparation Streak", "প্রস্তুতি স্ট্রিক")}
                  </span>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </div>

                <div className="my-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-500 font-mono">
                      {profile.streakDays}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {t("Days Active 🔥", "দিন সক্রিয় 🔥")}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {t("High consistency candidate", "উচ্চ ধারাবাহিকতাসম্পন্ন")}
                  </p>
                </div>

                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                    style={{ width: `${Math.min(100, (profile.streakDays / 14) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                4. CURRICULUM TRACK MASTERY (WIDE GRID)
            ───────────────────────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-foreground tracking-tight">
                    {t("Curriculum Track Mastery", "কারিকুলাম ট্র্যাক দক্ষতা")}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "Preparation breakdown across all 4 pillars of modern software engineering",
                      "সফটওয়্যার ইঞ্জিনিয়ারিংয়ের ৪টি মূল পিলারে প্রস্তুতি অগ্রগতি"
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  {
                    id: "track-lang",
                    nameEn: "Languages & Runtimes",
                    nameBn: "প্রোগ্রামিং ভাষা ও রানটাইম",
                    subtitle: "C#, .NET Core, Memory, GC",
                    color: "from-blue-500 to-indigo-600",
                    stats: profile.trackProgress["track-lang"] || {
                      completed: 20,
                      total: 38,
                      percentage: 52,
                    },
                  },
                  {
                    id: "track-dsa",
                    nameEn: "DSA & Problem Solving",
                    nameBn: "অ্যালগরিদম ও ডেটা স্ট্রাকচার",
                    subtitle: "Sliding Window, Trees, Graphs",
                    color: "from-emerald-500 to-teal-600",
                    stats: profile.trackProgress["track-dsa"] || {
                      completed: 15,
                      total: 28,
                      percentage: 53,
                    },
                  },
                  {
                    id: "track-system",
                    nameEn: "System Design",
                    nameBn: "সিস্টেম ডিজাইন ও আর্কিটেকচার",
                    subtitle: "Caching, Scalability, Sharding",
                    color: "from-purple-500 to-indigo-600",
                    stats: profile.trackProgress["track-system"] || {
                      completed: 6,
                      total: 16,
                      percentage: 38,
                    },
                  },
                  {
                    id: "track-db",
                    nameEn: "Database Engineering",
                    nameBn: "ডাটাবেজ ইঞ্জিনিয়ারিং",
                    subtitle: "PostgreSQL, Indexes, ACID",
                    color: "from-amber-500 to-orange-600",
                    stats: profile.trackProgress["track-db"] || {
                      completed: 4,
                      total: 16,
                      percentage: 25,
                    },
                  },
                ].map((track) => (
                  <div
                    key={track.id}
                    className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs hover:border-border transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          {isBn ? track.nameBn : track.nameEn}
                        </span>
                        <span className="text-xs font-mono font-bold text-muted-foreground">
                          {track.stats.percentage}%
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {track.subtitle}
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono mb-1.5">
                        <span>{track.stats.completed} done</span>
                        <span>{track.stats.total} total</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${track.color} rounded-full`}
                          style={{ width: `${track.stats.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                5. TWO-COLUMN SPLIT: TROPHIES & RECENT ACTIVITY
            ───────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Trophies & Crests (xl:col-span-7) */}
              <div className="xl:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-foreground tracking-tight">
                    {t("Unlocked Achievement Crests", "অর্জিত মাইলস্টোন ও ব্যাজ")}
                  </h2>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500">
                    {profile.badges.length} {t("Badges", "ব্যাজ")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {profile.badges.map((badge) => {
                    const tierColor =
                      badge.tier === "diamond"
                        ? "from-cyan-500/20 to-blue-500/20 border-cyan-400/40 text-cyan-400"
                        : badge.tier === "gold"
                        ? "from-amber-500/20 to-yellow-500/20 border-amber-400/40 text-amber-400"
                        : "from-emerald-500/20 to-teal-500/20 border-emerald-400/40 text-emerald-400";

                    return (
                      <div
                        key={badge.id}
                        className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs flex items-start gap-3.5 hover:border-amber-400/30 transition-all group"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tierColor} border shadow-xs group-hover:scale-105 transition-transform`}
                        >
                          {renderBadgeIcon(badge.icon)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-foreground truncate">
                              {isBn ? badge.nameBn : badge.nameEn}
                            </h4>
                            <span className="text-[9px] font-mono text-muted-foreground uppercase">
                              {badge.tier}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                            {isBn ? badge.descriptionBn : badge.descriptionEn}
                          </p>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1.5">
                            ✓ {badge.unlockedAt}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity Timeline (xl:col-span-5) */}
              <div className="xl:col-span-5 space-y-4">
                <h2 className="text-lg font-black text-foreground tracking-tight">
                  {t("Recent Preparation Activity", "সাম্প্রতিক কার্যকলাপ")}
                </h2>

                <div className="rounded-3xl border border-border/80 bg-card/95 divide-y divide-border/60 overflow-hidden shadow-xs">
                  {profile.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 flex items-center justify-between gap-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {activity.type === "lesson" ? (
                            <BookOpen className="h-4 w-4" />
                          ) : activity.type === "problem" ? (
                            <Target className="h-4 w-4" />
                          ) : (
                            <Award className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {isBn ? activity.titleBn : activity.titleEn}
                          </p>
                          <span className="text-[10px] text-muted-foreground">
                            {isBn ? activity.trackNameBn : activity.trackNameEn}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                        {activity.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                6. FULL-WIDTH FOOTER CALLOUT BANNER
            ───────────────────────────────────────────────────────── */}
            <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-blue-500/30 via-emerald-500/30 to-amber-500/30 shadow-lg">
              <div className="rounded-[1.4rem] bg-card p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div>
                  <h3 className="text-base font-black text-foreground">
                    {t(
                      "Preparing for software engineering interviews in Bangladesh?",
                      "বাংলাদেশের শীর্ষ প্রতিষ্ঠানে সফটওয়্যার ইন্টারভিউয়ের প্রস্তুতি নিচ্ছেন?"
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                    {t(
                      "Explore the full curriculum with C# internals, System Design, LeetCode patterns, and SQL optimizations.",
                      "সি# রানটাইম, সিস্টেম ডিজাইন, বিডি কোম্পানি সমস্যা ও ডাটাবেজ অপটিমাইজেশনের ৯৮টি অধ্যায় অনুশীলন করুন।"
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Users className="h-4 w-4" />
                    <span>{t("Explore Peers", "সহকর্মী খুঁজুন")}</span>
                  </button>
                  <Link
                    href="/roadmap"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer shadow-emerald-500/20"
                  >
                    <span>{t("View Roadmap", "রোডম্যাপ দেখুন")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
