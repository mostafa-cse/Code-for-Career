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

  // Icons mapper for badges
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
    <div className="min-h-screen bg-background pb-20">
      <CandidateSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* ─────────────────────────────────────────────────────────────
          1. ULTRA-LUXURY COVER BANNER WITH AURORA MESH
      ───────────────────────────────────────────────────────────── */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gradient-to-r from-gray-950 via-slate-900 to-indigo-950">
        {/* Animated Aurora Orbs */}
        <div
          className="pointer-events-none absolute -top-24 left-1/4 h-80 w-[36rem] transform-gpu blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.6), rgba(16, 185, 129, 0.4), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-10 right-1/4 h-64 w-80 transform-gpu blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.5), transparent 70%)",
          }}
        />

        {/* Subtle Geometric Overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top Community Navigation Breadcrumb */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md text-xs text-gray-300">
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-blue-400" />
              <span className="hidden sm:inline">
                {t("Find Other Candidates", "অন্যান্য পরীক্ষার্থী খুঁজুন")}
              </span>
              <span className="sm:hidden">{t("Search", "খুঁজুন")}</span>
            </button>

            {isOwner && (
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md hover:bg-amber-500/30 transition-colors shadow-md"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{t("Edit Profile", "প্রোফাইল সম্পাদনা")}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CANDIDATE CARD & SPOTLIGHT
      ───────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-20">
        <div className="rounded-[2.2rem] p-[1.5px] bg-gradient-to-b from-white/20 via-white/10 to-transparent shadow-2xl">
          <div className="relative overflow-hidden rounded-[2.1rem] border border-border/70 bg-card/95 dark:bg-[#070c18]/95 p-6 sm:p-8 backdrop-blur-2xl">
            {/* Header Flex */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left Column: Avatar & Names */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-6">
                {/* 3D Radiant Avatar Frame */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-amber-500 via-blue-500 to-emerald-400 opacity-60 blur-xs animate-pulse" />
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover ring-2 ring-background shadow-xl"
                    />
                  ) : (
                    <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white font-black text-3xl ring-2 ring-background shadow-xl">
                      {initials}
                    </div>
                  )}

                  {/* Level Pill Badge */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-600 to-yellow-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                    {profile.rankTitleEn}
                  </div>
                </div>

                {/* Candidate Name & Bio */}
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                      {profile.name}
                    </h1>
                    <span className="font-mono text-sm font-bold text-blue-500 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                      @{profile.username}
                    </span>
                    {profile.role === "ADMIN" && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-300">
                        <ShieldCheck className="h-3 w-3" />
                        STAFF
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-muted-foreground">
                    {profile.targetRole}
                  </p>

                  <p className="text-xs sm:text-sm text-foreground/80 max-w-xl leading-relaxed">
                    {profile.bio}
                  </p>

                  {/* Location & Metadata */}
                  <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      {profile.joinedDate}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t("Verified Candidate", "যাচাইকৃত পরীক্ষার্থী")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Target Companies & Action Suite */}
              <div className="flex flex-col items-center sm:items-end gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareProfile}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/60 px-4 py-2 text-xs font-bold text-foreground hover:bg-muted hover:border-border transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-500">{t("Copied!", "কপি হয়েছে!")}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 text-blue-500" />
                        <span>{t("Share Profile", "প্রোফাইল শেয়ার")}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer shadow-blue-500/20"
                  >
                    <Search className="h-4 w-4" />
                    <span>{t("Explore Peers", "সহকর্মী ডিরেক্টরি")}</span>
                  </button>
                </div>

                {/* Target Employers Banner */}
                <div className="rounded-2xl border border-border/70 bg-muted/40 p-3 text-left w-full sm:w-auto max-w-sm">
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
                        className="rounded-lg border border-border/70 bg-card px-2 py-1 text-[11px] font-bold text-foreground shadow-2xs"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social & Coding Handles */}
                <div className="flex items-center gap-2 pt-1">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-border/80 bg-card p-2 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
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
                      className="rounded-lg border border-border/80 bg-card p-2 text-blue-500 hover:text-blue-600 hover:border-blue-500/30 transition-colors"
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
                      className="rounded-lg border border-border/80 bg-card px-2 py-1 text-[11px] font-mono font-bold text-amber-500 hover:border-amber-500/30 transition-colors"
                      title="Codeforces Handle"
                    >
                      CF: {profile.codeforcesHandle}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. LUXURY CANDIDATE READINESS HUD (4-METRIC MATRIX)
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Circular Readiness Gauge */}
          <div className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("Interview Readiness", "ইন্টারভিউ প্রস্তুতি")}
              </span>
              <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
            </div>

            <div className="my-3 flex items-center gap-4">
              {/* Radial Progress Ring SVG */}
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
                  {t("Top Candidate Status", "শীর্ষ প্রার্থী স্ট্যাটাস")}
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

          {/* Card 2: Completed Lessons */}
          <div className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between">
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
                {t("of full curriculum covered", "সম্পূর্ণ সিলেবাস শেষ")}
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
          <div className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("Problems Solved", "কোডিং সমস্যা সমাধান")}
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
                {t("Tested against BD top interview sets", "বিডি কোম্পানি সেট অনুযায়ী")}
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
          <div className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between">
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
                {t("High consistency candidate", "উচ্চ ধারাবাহিকতাসম্পন্ন প্রার্থী")}
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

        {/* ─────────────────────────────────────────────────────────────
            4. CURRICULUM TRACK MASTERY BREAKDOWN
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight">
                {t("Curriculum Track Mastery", "কারিকুলাম ট্র্যাক দক্ষতা")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t(
                  "Track-by-track breakdown of candidate preparation across all 4 pillars",
                  "৪টি প্রধান পিলারে পরীক্ষার্থীর অধ্যায়ভিত্তিক প্রস্তুতি বিশ্লেষণ"
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* ─────────────────────────────────────────────────────────────
            5. 3D ACHIEVEMENT TROPHY CASE
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight">
                {t("Unlocked Achievement Crests", "অর্জিত মাইলস্টোন ও ব্যাজ")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t(
                  "Verified achievements conquered through technical preparation",
                  "প্রস্তুতির মাধ্যমে অর্জিত যাচাইকৃত সম্মাননা ও ব্যাজসমূহ"
                )}
              </p>
            </div>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500">
              {profile.badges.length} {t("Badges", "ব্যাজ")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* ─────────────────────────────────────────────────────────────
            6. RECENT ACTIVITY TIMELINE
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-12 space-y-4">
          <h2 className="text-lg font-black text-foreground tracking-tight">
            {t("Recent Preparation Activity", "সাম্প্রতিক প্রস্তুতি কার্যকলাপ")}
          </h2>

          <div className="rounded-3xl border border-border/80 bg-card/90 divide-y divide-border/60 overflow-hidden shadow-xs">
            {profile.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    {activity.type === "lesson" ? (
                      <BookOpen className="h-4 w-4" />
                    ) : activity.type === "problem" ? (
                      <Target className="h-4 w-4" />
                    ) : (
                      <Award className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                      {isBn ? activity.titleBn : activity.titleEn}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {isBn ? activity.trackNameBn : activity.trackNameEn}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono text-muted-foreground shrink-0">
                  {activity.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            7. FOOTER CALLOUT
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-14 rounded-3xl p-[1.5px] bg-gradient-to-r from-blue-500/30 via-emerald-500/30 to-amber-500/30 shadow-lg">
          <div className="rounded-[1.4rem] bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-base font-black text-foreground">
                {t(
                  "Preparing for software interviews in Bangladesh?",
                  "বাংলাদেশের শীর্ষ প্রতিষ্ঠানে সফটওয়্যার ইন্টারভিউয়ের প্রস্তুতি নিচ্ছেন?"
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-lg">
                {t(
                  "Explore the full 98-lesson curriculum with C# internals, System Design, LeetCode patterns, and SQL optimizations.",
                  "সি# রানটাইম, সিস্টেম ডিজাইন, বিডি কোম্পানি সমস্যা ও ডাটাবেজ অপটিমাইজেশনের ৯৮টি অধ্যায় অনুশীলন করুন।"
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Users className="h-4 w-4" />
                <span>{t("Find Other Candidates", "অন্যান্য পরীক্ষার্থী")}</span>
              </button>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer shadow-emerald-500/20"
              >
                <span>{t("Explore Curriculum", "কারিকুলাম দেখুন")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
