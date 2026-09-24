"use client";

import React, { useState } from "react";
import {
  Folder,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  GitBranch,
  History,
  Lock,
  FileQuestion,
  Layers,
  Settings2,
} from "lucide-react";

interface FileChaosComparisonProps {
  lang?: "en" | "bn";
}

export function FileChaosComparison({ lang = "en" }: FileChaosComparisonProps) {
  const [activeTab, setActiveTab] = useState<"both" | "chaos" | "clean">("both");
  const isBn = lang === "bn";

  return (
    <div className="my-8 not-prose rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden transition-all">
      {/* ── Top Window Bar with macOS Dots & View Toggle ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-border/70 bg-muted/40">
        <div className="flex items-center gap-3">
          {/* Traffic light window controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block shadow-2xs" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block shadow-2xs" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block shadow-2xs" />
          </div>

          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
              {isBn
                ? "প্রজেক্ট ডিরেক্টরি তুলনা: ম্যানুয়াল কপি বনাম গিট ভার্সন কন্ট্রোল"
                : "Directory Comparison: Without VCS vs. With Git Version Control"}
            </span>
          </div>
        </div>

        {/* View mode segmented switcher */}
        <div className="flex items-center p-1 rounded-xl border border-border/70 bg-background/80 text-xs font-medium shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("both")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "both"
                ? "bg-muted text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isBn ? "পাশাপাশি তুলনা" : "Side-by-Side"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chaos")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "chaos"
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isBn ? "গিট ছাড়া" : "Without Git"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("clean")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "clean"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isBn ? "গিটের সাথে" : "With Git"}
          </button>
        </div>
      </div>

      {/* ── Main Comparison Container ── */}
      <div
        className={
          activeTab === "both"
            ? "grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/60"
            : "w-full max-w-3xl mx-auto p-2"
        }
      >
        {/* PANEL 1: WITHOUT VCS (CHAOS) */}
        {(activeTab === "both" || activeTab === "chaos") && (
          <div className="p-5 sm:p-7 flex flex-col justify-between space-y-5 bg-linear-to-b from-rose-500/[0.03] to-transparent">
            <div className="space-y-4">
              {/* Header: Title, Subtitle & Risk Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-foreground">
                      {isBn ? "ভার্সন কন্ট্রোল ছাড়া (ম্যানুয়াল কপি)" : "Without Version Control"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isBn
                        ? "ডেস্কটপে বিশৃঙ্খল ফাইল ডুপ্লিকেট"
                        : "Manual chaotic copies on your desktop"}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shrink-0 whitespace-nowrap">
                  {isBn ? "চরম ঝুঁকি" : "High Risk"}
                </span>
              </div>

              {/* Mock Directory Tree */}
              <div className="rounded-xl border border-rose-500/25 bg-background/90 dark:bg-slate-950/70 p-4 font-mono text-xs shadow-inner">
                {/* Folder Root */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50 text-foreground font-semibold">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-amber-500 shrink-0 fill-amber-500/20" />
                    <span>My_Project/</span>
                  </div>
                  <span className="text-[11px] text-rose-500 font-medium">
                    {isBn ? "৫টি বিশৃঙ্খল ডুপ্লিকেট" : "5 messy duplicates"}
                  </span>
                </div>

                {/* Confusing File List */}
                <div className="pl-3 sm:pl-4 border-l-2 border-border/60 space-y-2 text-muted-foreground">
                  <div className="flex items-center justify-between py-0.5 hover:text-foreground transition-colors">
                    <span className="flex items-center gap-2 truncate pr-2">
                      <FileCode className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">app_v1.cs</span>
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground/70 shrink-0">
                      3 days ago
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-0.5 hover:text-foreground transition-colors">
                    <span className="flex items-center gap-2 truncate pr-2">
                      <FileCode className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">app_v2_final.cs</span>
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground/70 shrink-0">
                      2 days ago
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-0.5 hover:text-foreground transition-colors">
                    <span className="flex items-center gap-2 truncate pr-2">
                      <FileCode className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">app_final_edited.cs</span>
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground/70 shrink-0">
                      yesterday
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-0.5 text-amber-600 dark:text-amber-400 font-medium">
                    <span className="flex items-center gap-2 truncate pr-2">
                      <FileCode className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">app_final_REAL_final.cs</span>
                    </span>
                    <span className="text-[11px] font-mono text-amber-600/80 shrink-0">
                      5 hrs ago
                    </span>
                  </div>

                  {/* Conflicting mystery file */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/35 text-rose-600 dark:text-rose-400 font-semibold">
                    <span className="flex items-center gap-2 truncate pr-2">
                      <FileQuestion className="h-4 w-4 shrink-0 text-rose-500" />
                      <span className="truncate">app_final_approved_by_boss_FINAL.cs</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-300 shrink-0">
                      {isBn ? "কোনটি আসল?" : "Which is real?"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Callout Box */}
            <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-3.5 text-xs text-rose-700 dark:text-rose-300 space-y-1.5">
              <div className="font-bold flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  {isBn
                    ? "মারাত্মক কোড ক্ষতি ও ওভাররাইট ঝুঁকি"
                    : "Dangerous File Overwrites & Destruction"}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {isBn
                  ? "দুজন ডেভেলপার একসাথে কাজ করলে শেষ জনের সেভে আগের জনের পুরো কোড চিরতরে মুছে নষ্ট হয়ে যেত!"
                  : "If two developers edit files at the same time, whoever saves last accidentally overwrites and destroys the other's code permanently."}
              </p>
            </div>
          </div>
        )}

        {/* PANEL 2: WITH GIT (ORDER & ACCURACY) */}
        {(activeTab === "both" || activeTab === "clean") && (
          <div className="p-5 sm:p-7 flex flex-col justify-between space-y-5 bg-linear-to-b from-emerald-500/[0.03] to-transparent">
            <div className="space-y-4">
              {/* Header: Title, Subtitle & Success Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-foreground">
                      {isBn ? "গিটের সাথে (আধুনিক VCS সমাধান)" : "With Git Version Control"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isBn
                        ? "১টি মূল ফাইল + সুরক্ষিত ব্যাকগ্রাউন্ড হিস্ট্রি"
                        : "Single production file + background database"}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0 whitespace-nowrap">
                  {isBn ? "নির্ভুল ও নিরাপদ" : "100% Clean"}
                </span>
              </div>

              {/* Clean Directory Tree */}
              <div className="rounded-xl border border-emerald-500/25 bg-background/90 dark:bg-slate-950/70 p-4 font-mono text-xs shadow-inner">
                {/* Folder Root with Branch indicator */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50 text-foreground font-semibold">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-emerald-500 shrink-0 fill-emerald-500/20" />
                    <span>My_Project/</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                    <GitBranch className="h-3 w-3" />
                    <span>main</span>
                  </span>
                </div>

                {/* Clean file items */}
                <div className="pl-3 sm:pl-4 border-l-2 border-emerald-500/30 space-y-2">
                  {/* Hidden .git Directory */}
                  <div className="flex items-center justify-between py-1 px-2 rounded-md bg-muted/40 border border-dashed border-border/70 text-muted-foreground">
                    <span className="flex items-center gap-2 truncate pr-2">
                      <Lock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="font-bold text-foreground">.git/</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                      {isBn ? "সম্পূর্ণ ইতিহাস ডেটাবেজ" : "Full Timeline Database"}
                    </span>
                  </div>

                  {/* Single Clean Code File */}
                  <div className="flex items-center justify-between py-1 px-2 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-foreground font-semibold">
                    <span className="flex items-center gap-2 truncate pr-2">
                      <FileCode className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span>app.cs</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded shrink-0">
                      {isBn ? "একমাত্র সক্রিয় কোড" : "Active Production"}
                    </span>
                  </div>

                  {/* Gitignore */}
                  <div className="flex items-center justify-between py-0.5 px-2 text-muted-foreground">
                    <span className="flex items-center gap-2 truncate pr-2">
                      <Settings2 className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                      <span>.gitignore</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0">
                      config
                    </span>
                  </div>
                </div>

                {/* Micro Commit Timeline */}
                <div className="mt-3 pt-2.5 border-t border-border/50 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <History className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="text-foreground font-semibold text-[11px]">
                      {isBn ? "কমিট টাইমলাইন (স্ন্যাপশট লগ):" : "Commit Timeline (Snapshots):"}
                    </span>
                  </div>
                  <div className="pl-4 space-y-1 text-[11px] font-mono">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-bold">7a1b4c9</span>
                      <span className="text-foreground/80 truncate">feat: approved by boss</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 shrink-0" />
                      <span className="font-semibold">3e8f1a2</span>
                      <span className="truncate">fix: calculation bug</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Callout Box */}
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5 text-xs text-emerald-700 dark:text-emerald-300 space-y-1.5">
              <div className="font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  {isBn
                    ? "১টি কমান্ডেই যেকোনো পূর্বাবস্থায় ফেরা যায়"
                    : "Zero Confusion: Instant 1-Command Time Travel"}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {isBn
                  ? "ডেস্কটপে কোনো বিশৃঙ্খল কপি থাকে না। প্রতিটি পরিবর্তনের ইতিহাস ক্রিপ্টোগ্রাফিক হ্যাশসহ .git ফোল্ডারে সম্পূর্ণ সুরক্ষিত থাকে।"
                  : "No duplicate files on your desktop. Git securely manages every snapshot, author, and branch silently in the background."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer Bar ── */}
      <div className="px-5 py-3 bg-muted/30 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>
            {isBn
              ? "ভার্সন কন্ট্রোল সিস্টেম (VCS) প্রতিটি লাইনের দায়বদ্ধতা, ইতিহাস এবং দলগত কোলাবোরেশন নিশ্চিত করে।"
              : "A Version Control System gives you accountability, branching, and atomic rollbacks."}
          </span>
        </span>
        <span className="hidden sm:inline font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          git log --oneline
        </span>
      </div>
    </div>
  );
}
