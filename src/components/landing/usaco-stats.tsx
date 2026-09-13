"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Code2,
  Boxes,
  Database,
  Cpu,
  Globe,
  Building2,
  CheckCircle2,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface RoadmapStagePreview {
  id: string;
  number: number;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  companies: string[];
  topics: Array<{ nameEn: string; nameBn: string; slug: string }>;
  icon: React.ElementType;
  gradient: string;
  badgeBg: string;
}

const ROADMAP_STAGES: RoadmapStagePreview[] = [
  {
    id: "stage-1",
    number: 1,
    titleEn: "Foundations & Tools",
    titleBn: "প্রোগ্রামিং ও টুলস ভিত্তি",
    subtitleEn: "C# language syntax, CLR memory & Git version control workflows",
    subtitleBn: "সি# সিনট্যাক্স, মেমোরি মডেল ও গিট ব্রাঞ্চিং",
    companies: ["Enosis", "BJIT"],
    topics: [
      { nameEn: "C# & .NET", nameBn: "C# এবং .NET", slug: "csharp" },
      { nameEn: "Git & GitHub", nameBn: "গিট ও গিটহাব", slug: "git" },
    ],
    icon: Code2,
    gradient: "from-blue-500 to-cyan-500",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    id: "stage-2",
    number: 2,
    titleEn: "Core CS & Problem Solving",
    titleBn: "কোর সিএস ও প্রবলেম সলভিং",
    subtitleEn: "Object-oriented design, data structures, algorithms & written contest puzzles",
    subtitleBn: "অবজেক্ট ওরিয়েন্টেড ডিজাইন, ডেটা স্ট্রাকচার ও অ্যালগরিদম",
    companies: ["Samsung R&D", "Therap (BD)"],
    topics: [
      { nameEn: "OOP & Clean Code", nameBn: "OOP ও ক্লিন কোড", slug: "oop" },
      { nameEn: "DSA", nameBn: "ডাটা স্ট্রাকচার", slug: "dsa" },
      { nameEn: "Contest Coding", nameBn: "কনটেস্ট কোডিং", slug: "competitive-programming" },
    ],
    icon: Boxes,
    gradient: "from-purple-500 to-indigo-500",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    id: "stage-3",
    number: 3,
    titleEn: "Web Architecture & Storage",
    titleBn: "ওয়েব আর্কিটেকচার ও ডেটাবেজ",
    subtitleEn: "ASP.NET Core REST APIs, PostgreSQL B-Tree indexing & UML modeling",
    subtitleBn: "এএসপি ডটনেট কোর ওয়েব এপিআই ও রিলেশনাল ডেটাবেজ",
    companies: ["Therap (BD)", "Brain Station 23"],
    topics: [
      { nameEn: "ASP.NET Core", nameBn: "এএসপি ডটনেট কোর", slug: "dotnet" },
      { nameEn: "PostgreSQL & DB", nameBn: "পোস্টগ্রেসকিউএল ও ডিবি", slug: "database" },
      { nameEn: "UML Modeling", nameBn: "ইউএমএল মডেলিং", slug: "uml" },
    ],
    icon: Database,
    gradient: "from-emerald-500 to-teal-500",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: "stage-4",
    number: 4,
    titleEn: "Low-Level Systems & Design",
    titleBn: "লো-লেভেল সিস্টেম ও ডিজাইন",
    subtitleEn: "Gang of Four patterns, OS thread concurrency & networking protocols",
    subtitleBn: "কনকারেন্সি, নেটওয়ার্কিং প্রোটোকল, ওএস ও ডিজাইন প্যাটার্ন",
    companies: ["Enosis", "Samsung R&D"],
    topics: [
      { nameEn: "Design Patterns", nameBn: "ডিজাইন প্যাটার্ন", slug: "design-patterns" },
      { nameEn: "Operating Systems", nameBn: "অপারেটিং সিস্টেম", slug: "os" },
      { nameEn: "Networking", nameBn: "কম্পিউটার নেটওয়ার্ক", slug: "networks" },
    ],
    icon: Cpu,
    gradient: "from-amber-500 to-orange-500",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: "stage-5",
    number: 5,
    titleEn: "High-Scale & Interviews",
    titleBn: "হাই-স্কেল সিস্টেম ও ইন্টারভিউ",
    subtitleEn: "Distributed caching, Kafka messaging, AI/ML basics & STAR method leadership",
    subtitleBn: "ডিস্ট্রিবিউটেড সিস্টেম ডিজাইন, মেশিন লার্নিং ও ভাইভা প্রস্তুতি",
    companies: ["Brain Station 23", "BJIT"],
    topics: [
      { nameEn: "System Design", nameBn: "সিস্টেম ডিজাইন", slug: "system-design" },
      { nameEn: "AI & ML", nameBn: "মেশিন লার্নিং", slug: "ai-ml" },
      { nameEn: "Behavioral & STAR", nameBn: "বিহেভিওরাল ও ভাইভা", slug: "behavioral" },
    ],
    icon: Globe,
    gradient: "from-pink-500 to-rose-500",
    badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  },
];

export function UsacoStats() {
  const { language, t } = useLanguage();
  const [activeStageIndex, setActiveStageIndex] = useState(1); // Default to Stage 2 (Core CS)

  const activeStage = ROADMAP_STAGES[activeStageIndex];
  const ActiveIcon = activeStage.icon;

  return (
    <section className="relative overflow-hidden bg-gray-100 dark:bg-black py-20 sm:py-28 transition-colors">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[56rem] -translate-x-1/2 transform-gpu blur-3xl opacity-20 dark:opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.45), rgba(147, 51, 234, 0.35), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, description, stats, and action CTAs */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Compass className="h-3.5 w-3.5" />
              <span>{t("Interactive Career Pathways", "ইন্টারেক্টিভ ক্যারিয়ার রোডম্যাপ")}</span>
            </div>

            {/* Title with USACO Guide glow effect */}
            <div className="group relative">
              <h2 className="relative z-10 text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                {t("Trusted by candidates.", "প্রার্থীদের আস্থার প্ল্যাটফর্ম।")}
              </h2>
              <span
                className="absolute inset-0 -z-10 select-none text-4xl sm:text-5xl font-black text-transparent blur-xl bg-gradient-to-r from-sky-700 to-purple-700 bg-clip-text opacity-60 transition duration-1000 group-hover:opacity-100"
                aria-hidden="true"
              >
                {t("Trusted by candidates.", "প্রার্থীদের আস্থার প্ল্যাটফর্ম।")}
              </span>
            </div>

            <p className="text-base sm:text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-400">
              {t(
                "This platform is crafted with insights from software engineers at top Bangladeshi tech employers, including ",
                "এই প্ল্যাটফর্মটি তৈরি হয়েছে বাংলাদেশের শীর্ষ সফটওয়্যার কোম্পানিগুলোর ইঞ্জিনিয়ারদের অভিজ্ঞতায় — যেমন "
              )}
              <span className="bg-gradient-to-r from-sky-600 to-purple-700 dark:from-sky-400 dark:to-purple-400 bg-clip-text text-transparent font-semibold box-decoration-clone">
                Enosis Solutions, Therap (BD), Samsung R&D, Brain Station 23, and BJIT.
              </span>
            </p>

            {/* Stats Grid */}
            <dl className="grid grid-cols-3 gap-4 sm:gap-6 border-y border-gray-200 dark:border-gray-800/80 py-6">
              <div className="flex flex-col">
                <dd className="order-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                  100+
                </dd>
                <dt className="order-2 mt-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Curated Lessons & Topics", "নির্বাচিত পাঠ ও বিষয়")}
                </dt>
              </div>
              <div className="flex flex-col">
                <dd className="order-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                  50+
                </dd>
                <dt className="order-2 mt-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Company Interview Questions", "কোম্পানি ইন্টারভিউ প্রশ্ন")}
                </dt>
              </div>
              <div className="flex flex-col">
                <dd className="order-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                  12
                </dd>
                <dt className="order-2 mt-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Structured Subject Roadmaps", "স্ট্রাকচার্ড বিষয় রোডম্যাপ")}
                </dt>
              </div>
            </dl>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="group relative inline-block">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 opacity-40 blur transition duration-1000 group-hover:opacity-75 dark:-inset-1.5 dark:opacity-50 dark:group-hover:opacity-90" />
                <Link
                  href="/roadmap"
                  className="relative inline-flex items-center gap-2 rounded-xl bg-white dark:bg-gray-900 px-6 py-3.5 sm:px-7 sm:py-4 text-base sm:text-lg font-bold text-gray-900 dark:text-white shadow-lg transition hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{t("View Roadmap", "রোডম্যাপ দেখুন")}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 px-5 py-3.5 text-base font-semibold text-gray-800 dark:text-gray-200 transition hover:bg-white dark:hover:bg-gray-800 shadow-xs"
              >
                <span>{t("Candidate Dashboard", "প্রার্থী ড্যাশবোর্ড")}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Roadmap Preview Canvas Card */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#0c111c]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-md">
              {/* Top Card Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex space-x-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wide text-gray-600 dark:text-gray-400">
                    BD_SWE_ROADMAP.flow
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <Link
                    href="/roadmap"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>{t("Interactive Canvas", "ইন্টারেক্টিভ ক্যানভাস")}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Stage Navigation Tabs (1 to 5) */}
              <div className="mt-5 flex items-center justify-between gap-1 sm:gap-2">
                {ROADMAP_STAGES.map((stage, idx) => {
                  const isActive = idx === activeStageIndex;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => setActiveStageIndex(idx)}
                      type="button"
                      className={`flex-1 py-2 px-1.5 sm:px-2 rounded-lg text-center transition cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white font-bold shadow-sm dark:bg-blue-600"
                          : "bg-gray-100 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 font-medium"
                      }`}
                    >
                      <span className="block text-xs font-mono">Stage {stage.number}</span>
                      <span className="block text-[10px] truncate max-w-[70px] sm:max-w-none mx-auto opacity-80">
                        {language === "bn" ? stage.titleBn.split(" ")[1] ?? stage.titleBn : stage.titleEn.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Showcase Panel */}
              <div className="mt-5 rounded-xl border border-gray-200 dark:border-gray-800/80 bg-gray-50/70 dark:bg-gray-900/60 p-5 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${activeStage.gradient} text-white shadow-sm`}
                    >
                      <ActiveIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Milestone {activeStage.number}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.2 text-[10px] font-semibold border ${activeStage.badgeBg}`}
                        >
                          Core Track
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        {language === "bn" ? activeStage.titleBn : activeStage.titleEn}
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {language === "bn" ? activeStage.subtitleBn : activeStage.subtitleEn}
                </p>

                {/* Topics in this Stage */}
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                    {t("Included Curriculum Modules:", "অন্তর্ভুক্ত মডিউলসমূহ:")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeStage.topics.map((topic) => (
                      <Link
                        key={topic.slug}
                        href={`/subjects/${topic.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        <span>{language === "bn" ? topic.nameBn : topic.nameEn}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bangladesh Tech Employers testing this stage */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-200/80 dark:border-gray-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Building2 className="h-3.5 w-3.5 text-blue-500" />
                    <span>{t("Frequent in interview rounds:", "যেসব কোম্পানিতে আসে:")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {activeStage.companies.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Interactive Launch Bar */}
              <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t(
                    "NeetCode-style flowchart with pan, zoom & drawer",
                    "জুম ও প্যান সুবিধাসহ সম্পূর্ণ ফ্লোচার্ট ভিউ"
                  )}
                </span>
                <Link
                  href="/roadmap"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition group"
                >
                  <span>{t("Launch Full Roadmap", "সম্পূর্ণ রোডম্যাপ দেখুন")}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
