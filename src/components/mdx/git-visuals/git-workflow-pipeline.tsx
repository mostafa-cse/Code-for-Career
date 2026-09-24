"use client";

import React from "react";
import {
  Laptop,
  Package,
  ShieldCheck,
  Cloud,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface GitWorkflowPipelineProps {
  lang?: "en" | "bn";
}

export function GitWorkflowPipeline({ lang = "en" }: GitWorkflowPipelineProps) {
  const isBn = lang === "bn";

  const stages = [
    {
      step: "01",
      stepNumBn: "০১",
      nameEn: "Working Directory",
      nameBn: "ওয়ার্কিং ডিরেক্টরি",
      metaphorEn: "Your Project Desk",
      metaphorBn: "পড়ার টেবিল / কাজের ডেস্ক",
      icon: Laptop,
      statusEn: "Live Editing Zone",
      statusBn: "সরাসরি কোড এডিটিং জোন",
      borderCls: "border-slate-500/30",
      bgCls: "from-slate-500/[0.06] via-card to-background",
      badgeCls: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25",
      descEn: "Where you actively write, edit, and test code in VS Code. Changes here are live and uncommitted.",
      descBn: "যেখানে আপনি ভিএস কোডে কোড লেখেন ও পরীক্ষা করেন। এখানকার পরিবর্তনগুলো এখনো গিটহিস্ট্রিতে সংরক্ষিত নয়।",
      command: "git add .",
      commandLabelEn: "Stage changes",
      commandLabelBn: "স্টেজে যোগ করুন",
    },
    {
      step: "02",
      stepNumBn: "০২",
      nameEn: "Staging Area (Index)",
      nameBn: "স্টেজিং এরিয়া (ইনডেক্স)",
      metaphorEn: "The Shipping Box",
      metaphorBn: "প্যাকিং / কার্টন বক্স",
      icon: Package,
      statusEn: "Staged for Commit",
      statusBn: "পরবর্তী কমিটের জন্য প্রস্তুত",
      borderCls: "border-amber-500/35",
      bgCls: "from-amber-500/[0.06] via-card to-background",
      badgeCls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
      descEn: "Selective preparation zone. You choose precisely which modified files to include in the next commit snapshot.",
      descBn: "একটি ফিল্টারিং জোন। আপনি ৫টি ফাইলে কাজ করলেও শুধু প্রয়োজনীয় ২টি ফাইল পরবর্তী সেভের জন্য বক্সে সাজিয়ে রাখেন।",
      command: 'git commit -m "msg"',
      commandLabelEn: "Create commit",
      commandLabelBn: "স্থায়ী সিলগালা করুন",
    },
    {
      step: "03",
      stepNumBn: "০৩",
      nameEn: "Local Repository",
      nameBn: "লোকাল রিপোজিটরি",
      metaphorEn: "The Permanent Vault",
      metaphorBn: "সুরক্ষিত সিন্দুক (.git)",
      icon: ShieldCheck,
      statusEn: "Immutable Commit",
      statusBn: "অপরিবর্তনীয় লোকাল হিস্ট্রি",
      borderCls: "border-emerald-500/35",
      bgCls: "from-emerald-500/[0.06] via-card to-background",
      badgeCls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
      descEn: "Permanently sealed on your local disk in the hidden .git directory with a unique cryptographic hash. 100% offline.",
      descBn: "ইউনিক ক্রিপ্টোগ্রাফিক হ্যাশ আইডি সহ লোকাল মেশিনের .git ফোল্ডারে চিরতরে সংরক্ষিত। সম্পূর্ণ অফলাইন নিরাপদ।",
      command: "git push origin main",
      commandLabelEn: "Push to cloud",
      commandLabelBn: "অনলাইনে আপলোড করুন",
    },
    {
      step: "04",
      stepNumBn: "০৪",
      nameEn: "Remote Repository",
      nameBn: "রিমোট রিপোজিটরি",
      metaphorEn: "GitHub Cloud",
      metaphorBn: "গিটহাব ক্লাউড ব্যাকআপ",
      icon: Cloud,
      statusEn: "Team Synchronized",
      statusBn: "টিম শেয়ারিং ও সিঙ্ক",
      borderCls: "border-blue-500/35",
      bgCls: "from-blue-500/[0.06] via-card to-background",
      badgeCls: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25",
      descEn: "Hosted in the cloud for peer code review, Pull Requests, CI/CD automated deployment, and team collaboration.",
      descBn: "অনলাইন ব্যাকআপ ও টিমওয়ার্কের কেন্দ্রবিন্দু। সহকর্মীদের সাথে কোড বিনিময় ও পুল রিকোয়েস্ট পরিচালনা করা হয়।",
      command: "git pull",
      commandLabelEn: "Download latest",
      commandLabelBn: "টিমের কোড নামিয়ে নিন",
    },
  ];

  return (
    <div className="my-8 not-prose rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden">
      {/* ── Top Window Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-border/70 bg-muted/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-semibold text-foreground tracking-tight text-xs sm:text-sm">
            {isBn
              ? "গিটের ৩+১ স্তর বিশিষ্ট আর্কিটেকচারাল পাইপলাইন"
              : "The 3 + 1 Core Architecture Pipeline"}
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
          {isBn
            ? "কোড এডিট → স্টেজ → কমিট → পুশ"
            : "Edit Code → Stage → Commit → Push"}
        </span>
      </div>

      {/* ── Pipeline Cards Grid ── */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.step}
              className={`rounded-2xl border ${stage.borderCls} bg-linear-to-b ${stage.bgCls} p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="space-y-3">
                {/* 1. Step Number on Left, Icon on Right (Zero Collision) */}
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-muted text-foreground border border-border/70">
                    {isBn ? `ধাপ ${stage.stepNumBn}` : `Step ${stage.step}`}
                  </span>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${stage.borderCls} ${stage.badgeCls} shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                {/* 2. Stage Titles */}
                <div>
                  <h5 className="text-sm font-bold text-foreground tracking-tight">
                    {isBn ? stage.nameBn : stage.nameEn}
                  </h5>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {isBn ? stage.metaphorBn : stage.metaphorEn}
                  </p>
                </div>

                {/* 3. Dedicated Status Row (Never wraps or collides with numbers) */}
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border ${stage.badgeCls}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                    <span>{isBn ? stage.statusBn : stage.statusEn}</span>
                  </span>
                </div>

                {/* 4. Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isBn ? stage.descBn : stage.descEn}
                </p>
              </div>

              {/* 5. Bottom Action Command Bar */}
              <div className="pt-3 border-t border-border/50 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                  <span>{isBn ? stage.commandLabelBn : stage.commandLabelEn}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                </div>
                <div className="p-2 rounded-xl bg-background/90 dark:bg-slate-950/80 border border-border/70 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center shadow-2xs select-all">
                  {stage.command}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer Banner ── */}
      <div className="px-5 py-3 bg-muted/30 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <span>
            {isBn
              ? "git pull চালালে ক্লাউড থেকে টিমের সমস্ত নতুন কোড লোকাল ডিরেক্টরিতে নামিয়ে স্বয়ংক্রিয়ভাবে মার্জ করা হয়।"
              : "Running 'git pull' downloads and auto-merges all remote cloud updates into your local directory."}
          </span>
        </div>
        <span className="font-mono text-xs text-foreground/90 font-semibold whitespace-nowrap">
          git pull = fetch + merge
        </span>
      </div>
    </div>
  );
}
