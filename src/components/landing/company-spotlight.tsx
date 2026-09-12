"use client";

import { Building2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface CompanyInfo {
  name: string;
  focusEn: string;
  focusBn: string;
  badge: string;
}

const COMPANIES: CompanyInfo[] = [
  {
    name: "Enosis Solutions",
    focusEn: "C# / .NET • OOP Design • Written Problem Solving",
    focusBn: "C# / .NET • OOP ডিজাইন • লিখিত সমস্যা সমাধান",
    badge: "Written & Viva",
  },
  {
    name: "Brain Station 23",
    focusEn: "Full-Stack • Architecture • Clean Code • Live Coding",
    focusBn: "ফুল-স্ট্যাক • আর্কিটেকচার • ক্লিন কোড • লাইভ কোডিং",
    badge: "Tech Interview",
  },
  {
    name: "Therap (BD) Ltd",
    focusEn: "Core CS Fundamentals • Algorithms • SQL & Database",
    focusBn: "কোর CS ফান্ডামেন্টালস • অ্যালগরিদম • SQL ও ডাটাবেজ",
    badge: "Rigorous Viva",
  },
  {
    name: "Samsung R&D Institute (SRBD)",
    focusEn: "Advanced DSA • Dynamic Programming • Graph Theory",
    focusBn: "অ্যাডভান্সড DSA • ডাইনামিক প্রোগ্রামিং • গ্রাফ থিওরি",
    badge: "Pro-Coding Test",
  },
  {
    name: "BJIT Group",
    focusEn: "Object-Oriented Design • System Modeling • Logic Test",
    focusBn: "অবজেক্ট-ওরিয়েন্টেড ডিজাইন • সিস্টেম মডেলিং • লজিক টেস্ট",
    badge: "Aptitude & Viva",
  },
  {
    name: "Optimizely",
    focusEn: "High-Scale Distributed Systems • Performance • DSA",
    focusBn: "হাই-স্কেল ডিস্ট্রিবিউটেড সিস্টেম • পারফরম্যান্স • DSA",
    badge: "System Design",
  },
];

export function CompanySpotlight() {
  const { language, t } = useLanguage();

  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            <span>
              {t("Bangladesh Industry Alignment", "বাংলাদেশ টেক ইন্ডাস্ট্রি ফোকাস")}
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t(
              "Curated for Local Hiring Patterns",
              "লোকাল নিয়োগ পরীক্ষার বাস্তব প্যাটার্ন অনুযায়ী সাজানো"
            )}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            {t(
              "Every topic and problem is selected to address the exact questions and evaluation criteria used by premier tech recruiters in Dhaka.",
              "ঢাকার শীর্ষ প্রযুক্তি কোম্পানিগুলোর লিখিত পরীক্ষা ও টেকনিক্যাল ভাইভায় যে ধরনের প্রশ্ন ও কনসেপ্ট যাচাই করা হয়, ঠিক সেভাবেই তৈরি।"
            )}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPANIES.map((company) => (
            <div
              key={company.name}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs transition-all hover:border-foreground/30 hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    {company.name}
                  </h3>
                  <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {company.badge}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {language === "bn" ? company.focusBn : company.focusEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
