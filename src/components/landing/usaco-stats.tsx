"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export function UsacoStats() {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-100 dark:bg-black py-20 sm:py-28 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Title with USACO Guide glow effect */}
          <div className="group relative">
            <h2 className="relative z-10 text-4xl md:text-5xl 2xl:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
              {t("Trusted by candidates.", "প্রার্থীদের আস্থার প্ল্যাটফর্ম।")}
            </h2>
            <span
              className="absolute inset-0 -z-10 select-none text-4xl md:text-5xl 2xl:text-6xl font-black text-transparent blur-xl bg-gradient-to-r from-sky-700 to-purple-700 bg-clip-text opacity-60 transition duration-1000 group-hover:opacity-100"
              aria-hidden="true"
            >
              {t("Trusted by candidates.", "প্রার্থীদের আস্থার প্ল্যাটফর্ম।")}
            </span>
          </div>

          <p className="mt-6 text-lg md:text-xl font-medium leading-relaxed text-gray-700 dark:text-gray-400">
            {t(
              "This platform is crafted with insights from software engineers at top Bangladeshi tech employers, including ",
              "এই প্ল্যাটফর্মটি তৈরি হয়েছে বাংলাদেশের শীর্ষ সফটওয়্যার কোম্পানিগুলোর ইঞ্জিনিয়ারদের অভিজ্ঞতায় — যেমন "
            )}
            <span className="bg-gradient-to-r from-sky-600 to-purple-700 dark:from-sky-400 dark:to-purple-400 bg-clip-text text-transparent font-semibold box-decoration-clone">
              Enosis Solutions, Therap (BD), Samsung R&D, Brain Station 23, and BJIT.
            </span>
          </p>

          {/* Stats Grid (USACO Guide exact <dl> structure) */}
          <div className="mt-12 max-w-4xl">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="flex flex-col py-2">
                <dt className="order-2 text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
                  {t("Curated Lessons & Topics", "নির্বাচিত পাঠ ও বিষয়")}
                </dt>
                <dd className="order-1 text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                  100+
                </dd>
              </div>
              <div className="flex flex-col py-2">
                <dt className="order-2 text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
                  {t("Company Interview Questions", "কোম্পানি ইন্টারভিউ প্রশ্ন")}
                </dt>
                <dd className="order-1 text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                  50+
                </dd>
              </div>
              <div className="flex flex-col py-2">
                <dt className="order-2 text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
                  {t("Structured Subject Roadmaps", "স্ট্রাকচার্ড বিষয় রোডম্যাপ")}
                </dt>
                <dd className="order-1 text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                  12
                </dd>
              </div>
            </dl>
          </div>

          {/* Glowing CTA Button */}
          <div className="mt-12">
            <div className="group relative inline-block">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 opacity-30 blur transition duration-1000 group-hover:opacity-50 dark:-inset-1.5 dark:opacity-50 dark:group-hover:opacity-75" />
              <Link
                href="/dashboard"
                className="relative inline-block rounded-xl bg-white dark:bg-gray-900 px-6 py-3 md:px-8 md:py-3.5 text-base sm:text-lg font-bold text-gray-900 dark:text-white shadow-md transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t("View Roadmap", "রোডম্যাপ দেখুন")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
