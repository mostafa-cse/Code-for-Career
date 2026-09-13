"use client";

import Link from "next/link";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import { SUBJECTS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";
import { SubjectIcon, SUBJECT_COLOR_STYLES } from "@/components/layout/icons";

// Detailed topic highlights for each subject
const SUBJECT_DETAILS: Record<
  string,
  { topicsEn: string; topicsBn: string }
> = {
  csharp: {
    topicsEn: "Memory semantics • Garbage collection • Async/Await • LINQ",
    topicsBn: "মেমোরি সিম্যান্টিক্স • গারবেজ কালেকশন • অ্যাসিনক্রোনাস • LINQ",
  },
  dsa: {
    topicsEn: "Time/Space Big-O • Segment Trees • Graphs • DP",
    topicsBn: "টাইম/স্পেস কমপ্লেক্সিটি • সেগমেন্ট ট্রি • গ্রাফ • ডিপি",
  },
  oop: {
    topicsEn: "SOLID Principles • Encapsulation • Polymorphism • Clean Design",
    topicsBn: "SOLID নীতিমালা • এনক্যাপসুলেশন • পলিমরফিজম • ক্লিন কোডিং",
  },
  "design-patterns": {
    topicsEn: "Factory • Singleton • Observer • Strategy • Repository Pattern",
    topicsBn: "ফ্যাক্টরি • সিঙ্গলটন • অবজারভার • স্ট্র্যাটেজি • রিপোজিটরি",
  },
  uml: {
    topicsEn: "Class Diagrams • Sequence Diagrams • Component Architectures",
    topicsBn: "ক্লাস ডায়াগ্রাম • সিকোয়েন্স ডায়াগ্রাম • কম্পোনেন্ট মডেলিং",
  },
  database: {
    topicsEn: "PostgreSQL • B-Trees & GIN • Joins • ACID & Isolation Levels",
    topicsBn: "PostgreSQL • বি-ট্রি ইনডেক্স • জটিল জয়েন • ট্রানজাকশন ACID",
  },
  "system-design": {
    topicsEn: "Horizontal Scaling • Load Balancers • Redis Caching • Kafka",
    topicsBn: "স্কেলিং • লোড ব্যালেন্সার • রেডিস ক্যাশ • মেসেজ কিউ ও কাফকা",
  },
  networks: {
    topicsEn: "TCP vs UDP • HTTP/2 & 3 • DNS resolution • TLS / HTTPS",
    topicsBn: "TCP বনাম UDP • HTTP/2 ও 3 • ডিএনএস রেজোলিউশন • TLS এনক্রিপশন",
  },
  os: {
    topicsEn: "Process vs Thread • Virtual Memory • Mutex/Semaphore • Deadlock",
    topicsBn: "প্রসেস ও থ্রেড • ভার্চুয়াল মেমোরি • সিঙ্ক ও মিউটেক্স • ডেডলক",
  },
  "ai-ml": {
    topicsEn: "Supervised Learning • Gradient Descent • Loss Functions • LLMs",
    topicsBn: "সুপারভাইজড লার্নিং • গ্রেডিয়েন্ট ডিসেন্ট • লস ফাংশন • LLM বেসিক",
  },
  behavioral: {
    topicsEn: "STAR Method • Conflict Resolution • Leadership Scenarios",
    topicsBn: "STAR মেথড • কনফ্লিক্ট ম্যানেজমেন্ট • টিমওয়ার্ক ও লিডারশিপ",
  },
  "competitive-programming": {
    topicsEn: "Contest Strategy • Number Theory • Geometry • Bit Manipulation",
    topicsBn: "কনটেস্ট স্ট্র্যাটেজি • নাম্বার থিওরি • বিট ম্যানিপুলেশন",
  },
};

export function SubjectGrid() {
  const { language, t } = useLanguage();

  return (
    <section id="subjects" className="border-t border-border bg-muted/20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>{t("Complete Curriculum", "সম্পূর্ণ সিলেবাস")}</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("13 Core Modules. Everything You Need.", "১৩টি মূল মডিউল। যা জানা প্রয়োজন সবই এক সাথে।")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            {t(
              "Each module is built with concise notes, bilingual explanations, real company problems, and curated reference resources.",
              "প্রতিটি মডিউলে রয়েছে সাজানো নোটস, দ্বিভাষিক ব্যাখ্যা, বাংলাদেশি কোম্পানিগুলোর উপযোগী রিয়েল প্রবলেম ও রেফারেন্স রিসোর্স।"
            )}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SUBJECTS.map((subject) => {
            const styles =
              SUBJECT_COLOR_STYLES[subject.color] ?? SUBJECT_COLOR_STYLES.blue;
            const details = SUBJECT_DETAILS[subject.slug];

            return (
              <Link
                key={subject.slug}
                href={`/subjects/${subject.slug}`}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border ${styles.border} ${styles.bg} ${styles.text}`}
                    >
                      <SubjectIcon name={subject.icon} className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                      #{String(subject.order).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-foreground transition-colors group-hover:text-foreground/90">
                    {language === "bn" ? subject.nameBn : subject.nameEn}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {language === "bn" ? subject.nameEn : subject.nameBn}
                  </p>

                  {details && (
                    <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/80">
                      {language === "bn" ? details.topicsBn : details.topicsEn}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                  <span>{t("View Lessons", "পাঠ দেখুন")}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
