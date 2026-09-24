"use client";

import React from "react";
import {
  Laptop,
  Cloud,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  WifiOff,
  Wifi,
  Terminal,
  Globe,
  GitFork,
} from "lucide-react";

interface GitVsGitHubCardProps {
  lang?: "en" | "bn";
}

export function GitVsGitHubCard({ lang = "en" }: GitVsGitHubCardProps) {
  const isBn = lang === "bn";

  return (
    <div className="my-8 not-prose rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden">
      {/* ── Top Window Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-border/70 bg-muted/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-semibold text-foreground tracking-tight text-xs sm:text-sm">
            {isBn
              ? "আর্কিটেকচার তুলনা: গিট (লোকাল ইঞ্জিন) বনাম গিটহাব (ক্লাউড সার্ভিস)"
              : "Architecture Blueprint: Git (Local Engine) vs. GitHub (Cloud Platform)"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-medium hidden md:inline">
          {isBn ? "ক্যামেরা বনাম ইনস্টাগ্রামের বাস্তব অ্যানালজি" : "The Camera vs. Instagram Analogy"}
        </span>
      </div>

      {/* ── Main Comparison: Git | Sync Bridge | GitHub ── */}
      <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch gap-6">
        {/* ── LEFT: GIT (LOCAL ENGINE) ── */}
        <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-linear-to-b from-emerald-500/[0.06] via-card to-background p-5 sm:p-6 space-y-4 shadow-sm">
          {/* Card Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0 shadow-xs">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-foreground">Git</h4>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                    <Terminal className="h-3 w-3" />
                    <span>CLI Tool</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isBn ? "আপনার লোকাল কম্পিউটারে ইনস্টল থাকে" : "Runs locally on your laptop"}
                </p>
              </div>
            </div>

            {/* Offline Badge: Fixed width, shrink-0, zero overlap */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shrink-0 whitespace-nowrap">
              <WifiOff className="h-3.5 w-3.5 shrink-0" />
              <span>{isBn ? "১০০% অফলাইন" : "100% Offline"}</span>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-2.5 text-xs sm:text-[13px] text-foreground/90">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {isBn
                  ? "কমান্ড-লাইন সফটওয়্যার যা মেশিনের লোকাল ডিস্কে চলে"
                  : "A command-line software tool installed on your local drive"}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {isBn
                  ? "কোডের সমস্ত পরিবর্তন, ব্রাঞ্চ ও ইতিহাস লোকালি ট্র্যাক করে"
                  : "Tracks every commit, branch, and file change locally"}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {isBn
                  ? "২০০৫ সালে লিনাক্স প্রতিষ্ঠাতা লিনাস টরভাল্ডস কর্তৃক উদ্ভাবিত"
                  : "Created in 2005 by Linux creator Linus Torvalds"}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {isBn
                  ? "সম্পূর্ণ ফ্রি এবং ওপেন সোর্স (কখনো কোনো ইন্টারনেটের প্রয়োজন নেই)"
                  : "Completely free & open-source (works without internet)"}
              </span>
            </div>
          </div>

          {/* Bottom Metaphor Box */}
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <span className="font-bold shrink-0">{isBn ? "উপমা:" : "Analogy:"}</span>
            <span>{isBn ? "ক্যামেরা (ছবি তোলার মূল অফলাইন ডিভাইস)" : "The Camera (tool you use to capture photos)"}</span>
          </div>
        </div>

        {/* ── CENTER: BIDIRECTIONAL SYNC BRIDGE ── */}
        <div className="flex lg:flex-col items-center justify-center gap-3 py-2 px-2">
          {/* Push command pill */}
          <div className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold shadow-xs whitespace-nowrap">
            <span>git push</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </div>

          <div className="flex flex-col items-center text-center px-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
              <GitFork className="h-3.5 w-3.5 text-primary rotate-90 hidden lg:inline-block" />
              <span>{isBn ? "ক্লাউড সিঙ্ক" : "Cloud Sync"}</span>
            </div>
            <span className="text-[10px] text-muted-foreground/70 hidden sm:inline">
              {isBn ? "(ইন্টারনেট সংযোগ)" : "(Over HTTPS / SSH)"}
            </span>
          </div>

          {/* Pull command pill */}
          <div className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-blue-500/35 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold shadow-xs whitespace-nowrap">
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>git pull</span>
          </div>
        </div>

        {/* ── RIGHT: GITHUB (CLOUD PLATFORM) ── */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-500/30 bg-linear-to-b from-blue-500/[0.06] via-card to-background p-5 sm:p-6 space-y-4 shadow-sm">
          {/* Card Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0 shadow-xs">
                <Cloud className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-foreground">GitHub</h4>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25">
                    <Globe className="h-3 w-3" />
                    <span>Cloud Host</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isBn ? "ক্লাউড হোস্টিং ও টিম কোলাবোরেশন" : "Cloud hosting & team collaboration"}
                </p>
              </div>
            </div>

            {/* Online Badge: Fixed width, shrink-0, zero overlap */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 shrink-0 whitespace-nowrap">
              <Wifi className="h-3.5 w-3.5 shrink-0" />
              <span>{isBn ? "ইন্টারনেট প্রয়োজন" : "Needs Internet"}</span>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-2.5 text-xs sm:text-[13px] text-foreground/90">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {isBn
                  ? "ইন্টারনেটে থাকা একটি ক্লাউড প্ল্যাটফর্ম ও ওয়েবসাইট"
                  : "A web platform and cloud hosting service in the cloud"}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {isBn
                  ? "রিমোট ব্যাকআপ এবং দলগত কোড শেয়ার করার সুবিধা দেয়"
                  : "Provides secure remote backups and easy team code sharing"}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {isBn
                  ? "মাইক্রোসফটের (Microsoft) মালিকানাধীন প্ল্যাটফর্ম"
                  : "Owned by Microsoft with millions of global developers"}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {isBn
                  ? "পুল রিকোয়েস্ট (PR), কোড রিভিউ ও GitHub Actions অটোমেশন"
                  : "Provides Pull Requests, Code Reviews, and CI/CD Actions"}
              </span>
            </div>
          </div>

          {/* Bottom Metaphor Box */}
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
            <span className="font-bold shrink-0">{isBn ? "উপমা:" : "Analogy:"}</span>
            <span>{isBn ? "ইনস্টাগ্রাম (যেখানে ব্যাকআপ ও অন্যদের সাথে শেয়ার করা হয়)" : "Instagram (website where you upload photos to share)"}</span>
          </div>
        </div>
      </div>

      {/* ── Footer Bar ── */}
      <div className="px-5 py-3 bg-muted/30 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="text-foreground/80">
          {isBn
            ? "গিটহাব ছাড়াও GitLab, Bitbucket এবং Gitea গিটের ক্লাউড রিমোট হিসেবে কাজ করে।"
            : "Alternatives to GitHub include GitLab, Bitbucket, and self-hosted Gitea."}
        </span>
        <span className="font-semibold text-foreground/90">
          {isBn ? "গিট = লোকাল ইঞ্জিন • গিটহাব = ক্লাউড গ্যারেজ" : "Git = Engine • GitHub = Cloud Garage"}
        </span>
      </div>
    </div>
  );
}
