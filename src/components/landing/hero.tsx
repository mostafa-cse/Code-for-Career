"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background glow effects */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div className="aspect-[1155/678] w-[68rem] bg-gradient-to-tr from-blue-500/20 via-emerald-500/15 to-violet-500/20 opacity-70" />
      </div>

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>
            {t(
              "Curated for Enosis, Brain Station 23, Therap, Samsung R&D, BJIT & more",
              "এনোসিস, ব্রেইন স্টেশন ২৩, থেরাপ, স্যামসাং আরঅ্যান্ডডি, বিজেআইটি এর জন্য বিশেষায়িত"
            )}
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          {t(
            "Master Software Engineering Interviews in Bangladesh",
            "বাংলাদেশের সফটওয়্যার ইঞ্জিনিয়ারিং ইন্টারভিউ প্রস্তুতি এক প্ল্যাটফর্মে"
          )}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
          {t(
            "A free, bilingual curriculum covering everything from C# internals and OOP design patterns to distributed system design, PostgreSQL, and interview coding challenges.",
            "সম্পূর্ণ ফ্রি ও দ্বিভাষিক লার্নিং প্ল্যাটফর্ম। C# মেমোরি ম্যানেজমেন্ট, OOP ও ডিজাইন প্যাটার্ন থেকে শুরু করে সিস্টেম ডিজাইন, PostgreSQL এবং ইন্টারভিউ কোডিং প্রবলেম।"
          )}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-md transition-all hover:opacity-90 hover:shadow-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
          >
            <span>{t("Start Preparing Now", "এখনই প্রস্তুতি শুরু করুন")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#subjects"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-card-foreground shadow-xs transition-colors hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
          >
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{t("Explore 13 Subjects", "১৩টি বিষয় দেখুন")}</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card/60 p-3 backdrop-blur-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-foreground">
              {t("13 Core Modules", "১৩টি পূর্ণাঙ্গ মডিউল")}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card/60 p-3 backdrop-blur-xs">
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-foreground">
              {t("100% Free & Open", "সম্পূর্ণ ফ্রি ও ওপেন")}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card/60 p-3 backdrop-blur-xs">
            <CheckCircle2 className="h-4 w-4 text-violet-500" />
            <span className="text-xs font-medium text-foreground">
              {t("Bilingual (EN + বাংলা)", "দ্বিভাষিক (EN + বাংলা)")}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card/60 p-3 backdrop-blur-xs">
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-foreground">
              {t("Local Company Focus", "বাংলাদেশি কোম্পানি ফোকাস")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
