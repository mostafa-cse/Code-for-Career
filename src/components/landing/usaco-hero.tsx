"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { SITE_NAME } from "@/lib/constants";

export function UsacoHero() {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-100 dark:bg-black transition-colors min-h-[calc(100dvh-4rem)] flex flex-col justify-center">

      {/* Hero Section */}
      <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-8 justify-center py-10 sm:py-14">
        <div className="flex flex-1 flex-col justify-center items-center text-center max-w-5xl mx-auto">
          {/* Main Title with USACO Guide Ambient Glow */}
          <div className="group relative my-4">
            <h1 className="relative z-10 text-center font-black tracking-tight text-5xl sm:text-6xl md:text-7xl 2xl:text-8xl text-gray-900 dark:text-white">
              {SITE_NAME}
            </h1>
            <span
              className="absolute inset-0 -z-10 select-none text-center font-black tracking-tight text-5xl sm:text-6xl md:text-7xl 2xl:text-8xl bg-gradient-to-r from-sky-700 to-purple-700 bg-clip-text text-transparent blur-xl opacity-60 transition duration-1000 group-hover:opacity-100"
              aria-hidden="true"
            >
              {SITE_NAME}
            </span>
          </div>

          {/* Subtitle with Gradient highlight */}
          <p className="mt-4 text-xl sm:text-2xl 2xl:text-3xl font-medium leading-snug text-gray-800 dark:text-gray-300 max-w-3xl">
            {t("A free collection of ", "সম্পূর্ণ বিনামূল্যে ")}
            <span className="bg-gradient-to-r from-sky-600 to-purple-700 dark:from-sky-400 dark:to-purple-400 bg-clip-text text-transparent font-semibold box-decoration-clone">
              {t(
                "curated, high-quality resources",
                "নির্বাচিত, উচ্চমানের রিসোর্স"
              )}
            </span>
            <br className="hidden md:block" />{" "}
            {t(
              "to take you from CS fundamentals to top Bangladesh tech companies and beyond.",
              "যা আপনাকে সিএস ফান্ডামেন্টালস থেকে বাংলাদেশের শীর্ষ প্রযুক্তি প্রতিষ্ঠানে পৌঁছে দেবে।"
            )}
          </p>

          {/* USACO Guide Glowing CTA Button */}
          <div className="mt-8 sm:mt-12">
            <div className="group relative inline-block">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 opacity-30 blur-md transition duration-1000 group-hover:opacity-60 dark:-inset-1.5 dark:opacity-50 dark:group-hover:opacity-80" />
              <Link
                href="/dashboard"
                className="relative inline-block rounded-xl bg-white dark:bg-gray-900 px-8 py-3.5 sm:px-10 sm:py-4 text-lg sm:text-xl font-bold text-gray-900 dark:text-white shadow-md transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t("Get Started", "শুরু করুন")}
              </Link>
            </div>
          </div>

          {/* Sub-credit (USACO Guide CP Initiative style) */}
          <div className="mt-14 sm:mt-20 flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            <div className="inline-flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-lg bg-foreground text-background flex items-center justify-center shadow-xs">
                <Terminal className="h-4 w-4" />
              </div>
              <span className="font-medium">
                {t(
                  "Created by the Bangladesh Software Engineering Community",
                  "বাংলাদেশ সফটওয়্যার ইঞ্জিনিয়ারিং কমিউনিটি কর্তৃক নির্মিত"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
