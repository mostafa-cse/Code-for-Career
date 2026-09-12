"use client";

import Link from "next/link";
import {
  Code2,
  Cpu,
  Database,
  Network,
  Boxes,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function UsacoTracks() {
  const { t } = useLanguage();

  const tracks = [
    {
      title: t("Core CS Fundamentals", "কোর সিএস ফান্ডামেন্টালস"),
      description: t(
        "Master data structures, algorithms, asymptotic analysis, bit manipulation, and recursion patterns frequently tested in written rounds.",
        "ডাটা স্ট্রাকচার, অ্যালগরিদম, কমপ্লেক্সিটি অ্যানালাইসিস এবং রিকার্শন প্যাটার্ন যা লিখিত পরীক্ষায় আসে।"
      ),
      icon: Code2,
      gradient: "from-fuchsia-500 to-purple-600",
      href: "/subjects/dsa",
    },
    {
      title: t("C# & .NET Ecosystem", "C# এবং .NET ইকোসিস্টেম"),
      description: t(
        "Deep dive into CLR memory management, Garbage Collector generations, async/await, LINQ internals, and enterprise design in C#.",
        "মেমোরি ম্যানেজমেন্ট, গার্বেজ কালেক্টর, অ্যাসিনক্রোনাস প্রোগ্রামিং এবং এন্টারপ্রাইজ C# ডেভেলপমেন্ট।"
      ),
      icon: Cpu,
      gradient: "from-purple-500 to-indigo-500",
      href: "/subjects/csharp",
    },
    {
      title: t("Database & Storage Systems", "ডাটাবেজ এবং স্টোরেজ সিস্টেম"),
      description: t(
        "PostgreSQL query optimization, B-Tree vs Hash indexes, execution plans (EXPLAIN ANALYZE), transactions, and ACID durability.",
        "পোস্টগ্রেসকিউএল অপটিমাইজেশন, বি-ট্রি ও হ্যাশ ইনডেক্স, এক্সেকিউশন প্ল্যান এবং ট্রানজাকশন ম্যানেজমেন্ট।"
      ),
      icon: Database,
      gradient: "from-orange-400 to-pink-600",
      href: "/subjects/database",
    },
    {
      title: t("System Design & Architecture", "সিস্টেম ডিজাইন ও সফটওয়্যার আর্কিটেকচার"),
      description: t(
        "Design scalable systems handling high QPS: distributed caching (Redis), message queues (Kafka), database sharding, and load balancing.",
        "উচ্চ স্কেলযোগ্য সিস্টেম ডিজাইন — ডিস্ট্রিবিউটেড ক্যাশিং, বার্তা কিউ, ডেটাবেজ শার্ডিং এবং লোড ব্যালেন্সিং।"
      ),
      icon: Network,
      gradient: "from-cyan-400 to-sky-500",
      href: "/subjects/system-design",
    },
    {
      title: t("OOP & Clean Architecture", "OOP ও পরিচ্ছন্ন আর্কিটেকচার"),
      description: t(
        "SOLID principles in depth, real-world Liskov Substitution violations, Dependency Inversion, and classic Gang-of-Four design patterns.",
        "SOLID নীতিমালা, বাস্তব কোডে LSP লঙ্ঘন শনাক্তকরণ এবং প্রচলিত ডিজাইন প্যাটার্ন।"
      ),
      icon: Boxes,
      gradient: "from-green-400 to-cyan-500",
      href: "/subjects/oop",
    },
    {
      title: t("Company Written Exam Prep", "কোম্পানির লিখিত পরীক্ষা প্রস্তুতি"),
      description: t(
        "Past written exam question formats, mathematical puzzles, output tracing, and behavioral questions tailored for Bangladesh tech giants.",
        "বিগত পরীক্ষার প্রশ্নের ধরন, গাণিতিক ধাঁধা, কোড আউটপুট অনুমান এবং সাক্ষাৎকার কৌশল।"
      ),
      icon: GraduationCap,
      gradient: "from-yellow-400 to-orange-500",
      href: "/problems",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-20 sm:py-28 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {t("Explore Curriculum Tracks.", "পাঠ্যক্রমের ট্র্যাকসমূহ অন্বেষণ করুন।")}
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
            {t(
              "Structured paths designed to prepare you for written screening tests, technical live coding, and system design interviews.",
              "লিখিত স্ক্রিনিং টেস্ট, লাইভ কোডিং এবং সিস্টেম ডিজাইন ইন্টারভিউয়ের জন্য বিশেষভাবে তৈরি রোডম্যাপ।"
            )}
          </p>
        </div>

        {/* USACO Guide 6-Card Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => {
            const Icon = track.icon;

            return (
              <div
                key={track.title}
                className="relative flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/70 p-6 sm:p-8 transition-all hover:shadow-lg dark:hover:border-gray-700"
              >
                <div>
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-xs ${track.gradient}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {track.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {track.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/60">
                  <Link
                    href={track.href}
                    className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-300 transition"
                  >
                    <span>{t("Explore Track", "ট্র্যাক অন্বেষণ করুন")}</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
