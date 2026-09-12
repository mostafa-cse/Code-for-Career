"use client";

import {
  BookCheck,
  Building2,
  Code2,
  Cpu,
  Languages,
  Sparkles,
  Users2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface Feature {
  icon: typeof Building2;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
}

const FEATURES: Feature[] = [
  {
    icon: Building2,
    titleEn: "Tailored for Bangladesh Software Companies",
    titleBn: "বাংলাদেশি সফটওয়্যার কোম্পানির উপযোগী",
    descEn:
      "Directly addresses the written exams and viva requirements of companies like Enosis, Brain Station 23, Therap, Samsung R&D, and BJIT.",
    descBn:
      "এনোসিস, ব্রেইন স্টেশন ২৩, থেরাপ, স্যামসাং আরঅ্যান্ডডি ও বিজেআইটির লিখিত ও টেকনিক্যাল ভাইভায় যে ধরনের বিষয় আসে তার নিখুঁত সংকলন।",
  },
  {
    icon: Languages,
    titleEn: "Seamless Bilingual Content (EN + বাংলা)",
    titleBn: "সহজ ও স্বাচ্ছন্দ্যময় দ্বিভাষিক কন্টেন্ট",
    descEn:
      "Switch with one click between English and Bangla at any moment. Understand difficult CS concepts intuitively without translation friction.",
    descBn:
      "যেকোনো সময় এক ক্লিকেই ইংরেজি ও বাংলার মধ্যে পরিবর্তন করুন। জটিল কম্পিউটার সায়েন্সের বিষয়গুলো নিজের ভাষায় সহজে আত্মস্থ করুন।",
  },
  {
    icon: Cpu,
    titleEn: "Rigorous CS Fundamentals",
    titleBn: "কম্পিউটার সায়েন্সের গভীর তাত্ত্বিক ভিত্তি",
    descEn:
      "Detailed breakdowns of operating systems, TCP/IP networking, PostgreSQL indexing internals, and large-scale distributed architectures.",
    descBn:
      "অপারেটিং সিস্টেমের মেমোরি ম্যানেজমেন্ট, নেটওয়ার্কিং প্রোটোকল, পোস্টগ্রেসের ইনডেক্সিং এবং স্কেলেবল সিস্টেম ডিজাইনের বিস্তারিত আলোচনা।",
  },
  {
    icon: BookCheck,
    titleEn: "Curated Interview Problem Bank",
    titleBn: "বাছাইকৃত ইন্টারভিউ প্রবলেম ব্যাংক",
    descEn:
      "Hand-selected LeetCode and competitive programming challenges labeled with difficulty, topics, and company interview tags.",
    descBn:
      "লিটকোড ও প্রোগ্রামিং কনটেস্টের গুরুত্বপূর্ণ প্রবলেম, যা কোম্পানি ট্যাগ, ডিফিকাল্টি এবং সমাধান হিন্টসহ সুবিন্যস্ত।",
  },
  {
    icon: Code2,
    titleEn: "LaTeX Formulas & Modern Code Highlighting",
    titleBn: "LaTeX গণিত ও আধুনিক সিনট্যাক্স হাইলাইটিং",
    descEn:
      "Mathematical rigor for complexity analysis via KaTeX equations and crisp syntax-highlighted code snippets in C#, SQL, and Python.",
    descBn:
      "কমপ্লেক্সিটি অ্যানালাইসিসের নির্ভুল KaTeX সমীকরণ এবং C#, SQL ও পাইথনে পরিষ্কার সিনট্যাক্স হাইলাইটেড কোড এক্সাম্পল।",
  },
  {
    icon: Users2,
    titleEn: "Community-Driven Open Editorial",
    titleBn: "সবার অংশগ্রহণে উন্মুক্ত এডিটোরিয়াল",
    descEn:
      "Propose improvements or corrections to any lesson. Approved suggestions keep the curriculum constantly updated for the developer community.",
    descBn:
      "যেকোনো লেসনে সরাসরি সংশোধনী বা নতুন তথ্য সাজেস্ট করুন। কমিউনিটির সক্রিয় অংশগ্রহণে প্ল্যাটফর্মটি সবসময় আপ-টু-ডেট থাকে।",
  },
];

export function Features() {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>{t("Why BD Software Prep", "কেন এই প্ল্যাটফর্ম")}</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t(
              "Designed Specifically for Candidate Success",
              "চাকরিপ্রার্থীদের সর্বোচ্চ সাফল্যের জন্য বিশেষভাবে নির্মিত"
            )}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            {t(
              "We solved the fragmented learning problem by bringing syllabus, practical notes, formulas, and interview problems into one cohesive ecosystem.",
              "ছড়িয়ে ছিটিয়ে থাকা রিসোর্সগুলোর বদলে পুরো ইন্টারভিউ সিলেবাস, প্র্যাকটিস প্রবলেম ও নোটস নিয়ে এসেছি এক ছাদের নিচে।"
            )}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">
                  {language === "bn" ? feature.titleBn : feature.titleEn}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {language === "bn" ? feature.descBn : feature.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
