"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { SubjectIcon, SUBJECT_COLOR_STYLES } from "@/components/layout/icons";

interface Track {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  subjectSlugs: string[];
}

const TRACKS: Track[] = [
  {
    id: "track-oop",
    titleEn: "Track 1: Object-Oriented Engineering",
    titleBn: "ট্র্যাক ১: অবজেক্ট-ওরিয়েন্টেড ইঞ্জিনিয়ারিং",
    descEn:
      "Deep dive into modern C#, memory management, SOLID architecture, design patterns, and UML system modeling.",
    descBn:
      "আধুনিক C# সিনট্যাক্স, মেমোরি ম্যানেজমেন্ট, SOLID নীতিমালা, ডিজাইন প্যাটার্ন এবং UML সিস্টেম মডেলিং।",
    subjectSlugs: ["csharp", "oop", "design-patterns", "uml"],
  },
  {
    id: "track-dsa",
    titleEn: "Track 2: Data Structures & Problem Solving",
    titleBn: "ট্র্যাক ২: ডেটা স্ট্রাকচার ও প্রবলেম সলভিং",
    descEn:
      "Algorithmic complexity, trees, graphs, dynamic programming, and competitive programming contest tactics.",
    descBn:
      "টাইম কমপ্লেক্সিটি, ট্রি, গ্রাফ, ডাইনামিক প্রোগ্রামিং এবং কম্পিটিটিভ প্রোগ্রামিং কনটেস্ট স্ট্র্যাটেজি।",
    subjectSlugs: ["dsa", "competitive-programming"],
  },
  {
    id: "track-systems",
    titleEn: "Track 3: Systems & Core Infrastructure",
    titleBn: "ট্র্যাক ৩: সিস্টেম ও কোর ইনফ্রাস্ট্রাকচার",
    descEn:
      "PostgreSQL query optimization, indexing, transaction ACID properties, distributed system design, OS, and networking.",
    descBn:
      "PostgreSQL কোয়েরি অপটিমাইজেশন, ইনডেক্সিং, ACID ট্রানজাকশন, ডিস্ট্রিবিউটেড সিস্টেম ডিজাইন, OS ও নেটওয়ার্ক।",
    subjectSlugs: ["database", "system-design", "networks", "os"],
  },
  {
    id: "track-career",
    titleEn: "Track 4: Modern Edge & Interview Success",
    titleBn: "ট্র্যাক ৪: আধুনিক টেক ও ইন্টারভিউ সাফল্য",
    descEn:
      "Machine learning foundations, gradient descent, and the STAR framework for behavioral and leadership rounds.",
    descBn:
      "মেশিন লার্নিংয়ের মূল ভিত্তি এবং বিহেভিওরাল ও লিডারশিপ রাউন্ডের জন্য STAR মেথড প্রস্তুতি।",
    subjectSlugs: ["ai-ml", "behavioral"],
  },
];

// Mapping helper to get subject metadata
import { SUBJECTS } from "@/lib/constants";

export function CurriculumTracks() {
  const { language, t } = useLanguage();

  return (
    <section id="tracks" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Compass className="h-3.5 w-3.5" />
            <span>{t("Structured Learning Pathways", "সুনির্দিষ্ট লার্নিং পাথওয়ে")}</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("Four Specialized Preparation Tracks", "৪টি বিশেষায়িত প্রস্তুতি ট্র্যাক")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            {t(
              "Choose your starting point based on your upcoming interview stage or strengthen all areas systematically.",
              "আপনার আসন্ন ইন্টারভিউয়ের ধরন অনুযায়ী প্রস্তুতি শুরু করুন অথবা ক্রমান্বয়ে সবগুলো ট্র্যাক সম্পন্ন করুন।"
            )}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {TRACKS.map((track) => {
            const trackSubjects = SUBJECTS.filter((s) =>
              track.subjectSlugs.includes(s.slug)
            );

            return (
              <div
                key={track.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md"
              >
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {language === "bn" ? track.titleBn : track.titleEn}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {language === "bn" ? track.descBn : track.descEn}
                  </p>

                  {/* Modules Pills */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {trackSubjects.map((sub) => {
                      const styles =
                        SUBJECT_COLOR_STYLES[sub.color] ??
                        SUBJECT_COLOR_STYLES.blue;
                      return (
                        <Link
                          key={sub.slug}
                          href={`/subjects/${sub.slug}`}
                          className={`inline-flex items-center gap-1.5 rounded-lg border ${styles.border} ${styles.bg} px-2.5 py-1 text-xs font-semibold ${styles.text} transition-colors hover:opacity-85`}
                        >
                          <SubjectIcon name={sub.icon} className="h-3.5 w-3.5" />
                          <span>
                            {language === "bn" ? sub.nameBn : sub.nameEn}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <Link
                    href={`/subjects/${track.subjectSlugs[0]}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:underline"
                  >
                    <span>{t("Start this track", "এই ট্র্যাক শুরু করুন")}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
