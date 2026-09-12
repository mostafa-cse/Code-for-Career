"use client";

import Link from "next/link";
import {
  Layers,
  FileCode,
  Zap,
  MessageSquare,
  Star,
  CheckCircle2,
  Building2,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function UsacoShowcase() {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-900 py-20 sm:py-28 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Yellow Badge */}
        <div className="max-w-4xl">
          <h2 className="text-4xl md:text-5xl 2xl:text-6xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            {t("Learn Software Prep. ", "সফটওয়্যার প্রস্তুতি নিন। ")}
            <span className="rounded-lg px-2 py-0.5 bg-yellow-400 text-black dark:bg-yellow-500 dark:text-black font-bold">
              {t("Efficiently.", "দক্ষতার সাথে।")}
            </span>
          </h2>
          <p className="mt-6 text-lg md:text-xl font-medium leading-relaxed text-gray-700 dark:text-gray-400">
            {t(
              "Stop wasting time searching for random problems and tutorials. BD Software Prep provides a comprehensive, organized roadmap carefully designed and crafted for Bangladeshi software engineering candidates – available to everyone, for free.",
              "বিক্ষিপ্ত টিউটোরিয়াল ও সমস্যা খুঁজে সময় অপচয় করবেন না। BD Software Prep বাংলাদেশের সফটওয়্যার প্রকৌশলী প্রার্থীদের জন্য একটি সুবিন্যস্ত রোডম্যাপ তৈরি করেছে — সম্পূর্ণ বিনামূল্যে।"
            )}
          </p>
        </div>

        {/* Feature 1: Curated Resources (Zig-Zag) */}
        <div className="mt-20 sm:mt-28 flex flex-col md:flex-row md:items-center gap-12 lg:gap-16">
          {/* Table Mockup */}
          <div className="relative w-full md:w-1/2">
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-md">
              <div className="border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-950/40 px-5 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                  {t("Curated Resources", "বাছাইকৃত শিক্ষা উপকরণ")}
                </span>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                <div className="flex items-center px-4 py-3.5 hover:bg-gray-50/80 dark:hover:bg-gray-800 transition">
                  <span className="w-12 font-mono font-bold text-gray-400">C#</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    <span className="font-semibold text-blue-600 dark:text-blue-400 truncate">
                      Memory Management & GC Internals
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-[11px] hidden sm:inline">
                    Stack vs Heap, CLR GC Gen 0,1,2
                  </span>
                </div>

                <div className="flex items-center px-4 py-3.5 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <span className="w-12 font-mono font-bold text-gray-400">DSA</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    <span className="font-semibold text-blue-600 dark:text-blue-400 truncate">
                      Asymptotic Complexity & Big-O
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-[11px] hidden sm:inline">
                    Formulas & Master Theorem
                  </span>
                </div>

                <div className="flex items-center px-4 py-3.5 hover:bg-gray-50/80 dark:hover:bg-gray-800 transition">
                  <span className="w-12 font-mono font-bold text-gray-400">DB</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    <span className="font-semibold text-blue-600 dark:text-blue-400 truncate">
                      B-Tree & Hash Indexes in PostgreSQL
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-[11px] hidden sm:inline">
                    Clustered index & query scans
                  </span>
                </div>

                <div className="flex items-center px-4 py-3.5 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <span className="w-12 font-mono font-bold text-gray-400">OOP</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                    <Star className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 shrink-0" />
                    <span className="font-semibold text-blue-600 dark:text-blue-400 truncate">
                      SOLID Principles in Real World
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-[11px] hidden sm:inline">
                    LSP violation detection & DI
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Description */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 text-white shadow-sm">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t("Curated Resources", "বাছাইকৃত শিক্ষা উপকরণ")}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t(
                "Learn core subjects from a vetted list of high-quality tutorials, articles, and diagrams. If one explanation doesn't click, examine another without wasting hours searching online.",
                "যাচাইকৃত উচ্চমানের উপকরণ থেকে প্রতিটি বিষয় আয়ত্ত করুন। একটি ব্যাখ্যা স্পষ্ট না হলে বিকল্পটি ব্যবহার করুন — অনলাইনে খুঁজে সময় নষ্টের প্রয়োজন নেই।"
              )}
            </p>
          </div>
        </div>

        {/* Feature 2: Extensive Problemsets (Zig-Zag Reversal) */}
        <div className="mt-24 sm:mt-32 flex flex-col md:flex-row md:items-center gap-12 lg:gap-16">
          {/* Text Description */}
          <div className="w-full md:w-1/2 md:order-first space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-sm">
              <FileCode className="h-6 w-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t("Extensive Problemsets", "কোম্পানিভিত্তিক সমস্যার সংকলন")}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t(
                "Practice each topic with real coding problems tagged by top Bangladesh tech companies: Enosis Solutions, Therap (BD), Samsung R&D, Brain Station 23, and BJIT Group.",
                "প্রতিটি বিষয়ের সাথে বাংলাদেশের শীর্ষস্থানীয় প্রযুক্তি প্রতিষ্ঠানের সাক্ষাৎকারে আসা বাস্তব প্রশ্ন ও কোডিং চ্যালেঞ্জ অনুশীলন করুন।"
              )}
            </p>
            <div className="pt-2">
              <Link
                href="/problems"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-300 transition"
              >
                <span>{t("Browse all practice problems", "সকল অনুশীলন সমস্যা দেখুন")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Problem Table Mockup */}
          <div className="relative w-full md:w-1/2">
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-md">
              <div className="grid grid-cols-12 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <span className="col-span-3">Source</span>
                <span className="col-span-5">Problem Name</span>
                <span className="col-span-4 text-right">Company</span>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-800 transition">
                  <span className="col-span-3 font-mono text-gray-400">LeetCode</span>
                  <span className="col-span-5 font-semibold text-blue-600 dark:text-blue-400 truncate">
                    Reverse Integer
                  </span>
                  <span className="col-span-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300">
                      <Building2 className="h-2.5 w-2.5" />
                      Enosis
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center px-4 py-3 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <span className="col-span-3 font-mono text-gray-400">Interview</span>
                  <span className="col-span-5 font-semibold text-blue-600 dark:text-blue-400 truncate">
                    B-Tree vs Hash Tradeoffs
                  </span>
                  <span className="col-span-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300">
                      <Building2 className="h-2.5 w-2.5" />
                      Therap (BD)
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-800 transition">
                  <span className="col-span-3 font-mono text-gray-400">LeetCode</span>
                  <span className="col-span-5 font-semibold text-blue-600 dark:text-blue-400 truncate">
                    Merge Intervals
                  </span>
                  <span className="col-span-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300">
                      <Building2 className="h-2.5 w-2.5" />
                      Samsung
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center px-4 py-3 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <span className="col-span-3 font-mono text-gray-400">System</span>
                  <span className="col-span-5 font-semibold text-blue-600 dark:text-blue-400 truncate">
                    Thread-Safe Singleton
                  </span>
                  <span className="col-span-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300">
                      <Building2 className="h-2.5 w-2.5" />
                      Brain Station
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Progress Tracking (USACO Guide Module Widget) */}
        <div className="mt-24 sm:mt-32 flex flex-col md:flex-row md:items-center gap-12 lg:gap-16">
          {/* Progress Widget Mockup */}
          <div className="relative w-full md:w-1/2">
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-6 shadow-md">
              <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {t("Curriculum Modules Progress", "পাঠ্যক্রম মডিউলের অগ্রগতি")}
              </h4>
              <div className="mt-6">
                <div className="grid grid-cols-4 gap-2 text-center mb-6">
                  <div>
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl font-black text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                      6
                    </span>
                    <span className="mt-1.5 block text-[11px] font-bold uppercase text-emerald-800 dark:text-emerald-300">
                      {t("Completed", "সম্পন্ন")}
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl font-black text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                      3
                    </span>
                    <span className="mt-1.5 block text-[11px] font-bold uppercase text-amber-800 dark:text-amber-300">
                      {t("In Progress", "চলমান")}
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl font-black text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                      2
                    </span>
                    <span className="mt-1.5 block text-[11px] font-bold uppercase text-blue-800 dark:text-blue-300">
                      {t("Skipped", "বাদ দেওয়া")}
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl font-black text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      1
                    </span>
                    <span className="mt-1.5 block text-[11px] font-bold uppercase text-gray-700 dark:text-gray-300">
                      {t("Not Started", "শুরু হয়নি")}
                    </span>
                  </div>
                </div>

                {/* USACO Guide Segmented Progress Bar */}
                <div className="relative">
                  <div className="flex h-3.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 text-xs">
                    <div
                      className="bg-emerald-500 transition-all duration-500"
                      style={{ width: "50%" }}
                    />
                    <div
                      className="bg-amber-400 transition-all duration-500"
                      style={{ width: "25%" }}
                    />
                    <div
                      className="bg-blue-500 transition-all duration-500"
                      style={{ width: "16.6%" }}
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {t("12 subjects total", "মোট ১২টি বিষয়")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Description */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-sm">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t("Progress Tracking", "অগ্রগতি পর্যালোচনা")}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t(
                "Use our built-in progress tracking tools to monitor completed lessons, problem solves, and interview readiness scores across all 4 tracks. Your progress saves locally and syncs to your profile seamlessly.",
                "আমাদের অগ্রগতি ট্র্যাকিং টুলের মাধ্যমে সম্পন্ন হওয়া পাঠ, প্রবলেম সমাধান এবং ইন্টারভিউ প্রস্তুতি স্কোর পর্যবেক্ষণ করুন। তথ্য ব্রাউজারে সংরক্ষিত হয় এবং ক্লাউডে সিঙ্ক হয়।"
              )}
            </p>
          </div>
        </div>

        {/* Feature 4: Help when you need it (Zig-Zag Reversal) */}
        <div className="mt-24 sm:mt-32 flex flex-col md:flex-row md:items-center gap-12 lg:gap-16">
          {/* Text Description */}
          <div className="w-full md:w-1/2 md:order-first space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-cyan-500 text-white shadow-sm">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t("Help when you need it", "প্রয়োজনে দিকনির্দেশনা ও সহায়তা")}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t(
                "Found a typo, want to suggest an interview question, or propose a clearer code snippet? Submit suggestions directly while reading any lesson and review feedback from editorial maintainers.",
                "কোনো ভুল খুঁজে পেয়েছেন, নতুন ইন্টারভিউ প্রশ্ন যোগ করতে চান? যেকোনো পাঠ পড়ার সময় সরাসরি পরামর্শ পাঠান এবং অবদান রাখুন।"
              )}
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-300 transition"
              >
                <span>{t("Open Candidate Dashboard", "প্রার্থী ড্যাশবোর্ড দেখুন")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Community Suggestion Preview Card */}
          <div className="relative w-full md:w-1/2">
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                    {t("Editorial Suggestion #142", "সম্পাদনা পরামর্শ #১৪২")}
                  </span>
                </div>
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Approved
                </span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                &ldquo;Added written test interview question from Enosis on CLR garbage collection generations (Gen 0, 1, 2) with diagram explanation.&rdquo;
              </p>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 p-3 text-[11px] text-gray-600 dark:text-gray-400">
                <strong className="text-gray-800 dark:text-gray-200 block mb-0.5">
                  Reviewer Note:
                </strong>
                Merged into C# Memory & Garbage Collection lesson. Thank you for contributing!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
