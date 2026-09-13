"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { SUBJECTS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";
import { LogoBrand } from "./logo";

export function Footer() {
  const { language, t } = useLanguage();
  const pathname = usePathname();

  // Hide footer on Section pages (/subjects) and the interactive Roadmap page (/roadmap)
  if (pathname && (pathname.startsWith("/subjects") || pathname.startsWith("/roadmap"))) {
    return null;
  }

  const engineeringSubjects = SUBJECTS.slice(0, 7);
  const systemsSubjects = SUBJECTS.slice(7);

  const companies = [
    "Enosis Solutions",
    "Brain Station 23",
    "Therap (BD) Ltd",
    "Samsung R&D (SRBD)",
    "BJIT Group",
    "Optimizely",
    "Kaz Software",
    "DSI",
  ];

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <LogoBrand size="sm" showSubtitle={false} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t(
                "A free, bilingual open-source platform tailored for software engineering candidates in Bangladesh. Master written exams, technical vivas, and system design rounds.",
                "বাংলাদেশের সফটওয়্যার ইঞ্জিনিয়ারদের জন্য একটি সম্পূর্ণ ফ্রি ও ওপেন সোর্স প্ল্যাটফর্ম। লিখিত পরীক্ষা, টেকনিক্যাল ভাইভা এবং সিস্টেম ডিজাইন রাউন্ডের পূর্ণাঙ্গ প্রস্তুতি নিন।"
              )}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{t("Built with", "তৈরি করা হয়েছে")}</span>
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
              <span>{t("for Bangladeshi developers", "বাংলাদেশি ডেভেলপারদের জন্য")}</span>
            </div>
          </div>

          {/* Col 2: Core Engineering Subjects */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("Engineering & Algorithms", "ইঞ্জিনিয়ারিং ও অ্যালগরিদম")}
            </h3>
            <ul className="mt-3 space-y-2">
              {engineeringSubjects.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={`/subjects/${sub.slug}`}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {language === "bn" ? sub.nameBn : sub.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Systems & Foundations */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("Systems & Career", "সিস্টেমস ও ক্যারিয়ার")}
            </h3>
            <ul className="mt-3 space-y-2">
              {systemsSubjects.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={`/subjects/${sub.slug}`}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {language === "bn" ? sub.nameBn : sub.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Target Companies & Quick Links */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {t("Target Companies", "টার্গেট কোম্পানিসমূহ")}
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {companies.map((company) => (
                  <span
                    key={company}
                    className="inline-block rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {t("Quick Links", "প্রয়োজনীয় লিংক")}
              </h3>
              <ul className="mt-2 space-y-1.5 text-xs">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {t("Personal Dashboard", "ব্যক্তিগত ড্যাশবোর্ড")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/problems"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {t("Interview Practice Bank", "ইন্টারভিউ প্র্যাকটিস ব্যাংক")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Code For Career. {t("All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।")}</p>
          <p className="flex items-center gap-4">
            <span>{t("Community Driven", "কমিউনিটি চালিত")}</span>
            <span>•</span>
            <span>{t("Open Access", "সবার জন্য উন্মুক্ত")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
