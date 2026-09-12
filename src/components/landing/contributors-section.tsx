"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4 fill-current"}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4 fill-current"}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function CodeforcesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M4.5 7.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-3 0v-9a1.5 1.5 0 0 1 1.5-1.5z" fill="#FFD700" />
      <path d="M12 3a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-3 0V4.5A1.5 1.5 0 0 1 12 3z" fill="#007ACC" />
      <path d="M19.5 11.25a1.5 1.5 0 0 1 1.5 1.5v5.25a1.5 1.5 0 0 1-3 0v-5.25a1.5 1.5 0 0 1 1.5-1.5z" fill="#E60000" />
    </svg>
  );
}

interface Contributor {
  id: string;
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  avatar: string;
  headline: string;
  institution: string;
  location: string;
  bioEn: string;
  bioBn: string;
  badges: Array<{
    label: string;
  }>;
  links: {
    linkedin?: string;
    github?: string;
    codeforces?: string;
  };
}

const CONTRIBUTORS: Contributor[] = [
  {
    id: "mostafa-kamal",
    name: "Md Mostafa Kamal",
    nameBn: "মোঃ মোস্তফা কামাল",
    role: "Lead Contributor & Author",
    roleBn: "প্রধান কন্ট্রিবিউটর ও লেখক",
    avatar: "/contributors/mostafa-kamal.png",
    headline: "Expert@Codeforces (Max 1718) || 4★@CodeChef (Max 1871)",
    institution: "Jashore University of Science and Technology (JUST)",
    location: "Bogura, Rajshahi, Bangladesh",
    bioEn:
      "Computer Science & Engineering student at JUST and passionate competitive programmer. Creator and maintainer of comprehensive technical preparation modules, helping Bangladeshi software engineers master written tests, viva rounds, and coding interviews.",
    bioBn:
      "যবিপ্রবি (JUST) এর কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিংয়ের শিক্ষার্থী এবং একনিষ্ঠ প্রতিযোগী প্রোগ্রামার। বাংলাদেশের সফটওয়্যার ইঞ্জিনিয়ারদের জন্য লিখিত পরীক্ষা, টেকনিক্যাল ভাইভা ও কোডিং ইন্টারভিউয়ের পূর্ণাঙ্গ প্রস্তুতিমূলক রিসোর্স তৈরি ও পরিচালনা করছেন।",
    badges: [
      { label: "Codeforces Expert (1718)" },
      { label: "CodeChef 4★ (1871)" },
      { label: "7+ National IUPCs" },
      { label: "B.Sc. in Engg (JUST)" },
    ],
    links: {
      linkedin: "https://www.linkedin.com/in/m0stafa-kamal/",
      github: "https://github.com/mostafa-cse",
      codeforces: "https://codeforces.com/profile/M0stafa",
    },
  },
];

export function ContributorsSection() {
  const { language, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gray-50 dark:bg-[#070b14] py-20 sm:py-28 transition-colors border-t border-border/40">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[48rem] -translate-x-1/2 transform-gpu blur-3xl opacity-20 dark:opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.4), rgba(168, 85, 247, 0.3), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("Community & Authors", "প্ল্যাটফর্ম টিম ও কন্ট্রিবিউটর")}</span>
          </div>

          <div className="group relative mt-4">
            <h2 className="relative z-10 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              {t("Built by Passionate Engineers", "একনিষ্ঠ ইঞ্জিনিয়ারদের তৈরি")}
            </h2>
            <span
              className="absolute inset-0 -z-10 select-none text-3xl font-black tracking-tight text-transparent blur-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text opacity-50 transition duration-1000 group-hover:opacity-90 sm:text-4xl md:text-5xl"
              aria-hidden="true"
            >
              {t("Built by Passionate Engineers", "একনিষ্ঠ ইঞ্জিনিয়ারদের তৈরি")}
            </span>
          </div>

          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {t(
              "Curated by competitive programmers and software engineers dedicated to uplifting Bangladesh's tech talent through open-source education.",
              "উন্মুক্ত শিক্ষার মাধ্যমে দেশের তরুণ সফটওয়্যার প্রকৌশলীদের দক্ষ করে তুলতে প্রতিযোগী প্রোগ্রামারদের যৌথ প্রয়াস।"
            )}
          </p>
        </div>

        {/* Contributors Grid */}
        <div className="mt-14 flex flex-col items-center">
          {CONTRIBUTORS.map((contributor) => (
            <div
              key={contributor.id}
              className="group relative w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 dark:border-gray-800/80 dark:bg-gray-900/80 sm:p-8"
            >
              {/* Card Accent Glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 blur-2xl transition duration-500 group-hover:opacity-100 dark:opacity-40" />

              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                {/* Profile Image with subtle ring */}
                <div className="relative mx-auto flex-shrink-0 sm:mx-0">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-sky-500/20 sm:h-32 sm:w-32 transition-transform duration-300 group-hover:scale-105 shadow-md">
                    <Image
                      src={contributor.avatar}
                      alt={contributor.name}
                      fill
                      sizes="(max-width: 640px) 112px, 128px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div
                    className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white dark:ring-gray-900"
                    title="Verified Contributor"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {language === "bn" ? contributor.nameBn : contributor.name}
                      </h3>
                      <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                        {language === "bn" ? contributor.roleBn : contributor.role}
                      </p>
                    </div>

                    {/* Quick Social Links */}
                    <div className="flex items-center justify-center sm:justify-end gap-2 pt-1 sm:pt-0">
                      {contributor.links.linkedin && (
                        <Link
                          href={contributor.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${contributor.name} on LinkedIn`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
                        >
                          <LinkedinIcon className="h-4 w-4" />
                        </Link>
                      )}
                      {contributor.links.github && (
                        <Link
                          href={contributor.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${contributor.name} on GitHub`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:border-gray-900 hover:bg-gray-100 hover:text-black dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <GithubIcon className="h-4 w-4" />
                        </Link>
                      )}
                      {contributor.links.codeforces && (
                        <Link
                          href={contributor.links.codeforces}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${contributor.name} on Codeforces`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-amber-400 dark:hover:bg-amber-950/40 dark:hover:text-amber-400"
                        >
                          <CodeforcesIcon className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                      {contributor.institution}
                    </span>
                    <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      {contributor.location}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {language === "bn" ? contributor.bioBn : contributor.bioEn}
                  </p>

                  {/* Badges / Highlights */}
                  <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {contributor.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-100/70 px-2.5 py-1 text-xs font-semibold text-gray-800 dark:border-gray-700/60 dark:bg-gray-800/60 dark:text-gray-200"
                      >
                        <Award className="h-3 w-3 text-amber-500" />
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Call to Action */}
        <div className="mx-auto mt-12 max-w-2xl text-center">
          <div className="rounded-xl border border-dashed border-gray-300 bg-white/40 p-6 dark:border-gray-800 dark:bg-gray-900/30">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
              <span>{t("Want to contribute?", "আপনিও অবদান রাখতে চান?")}</span>
            </div>
            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400">
              {t(
                "Submit interview questions, suggest lesson updates, or add company rounds to help fellow engineers succeed.",
                "নতুন ইন্টারভিউ প্রশ্ন, পাঠ্য সংশোধন বা কোম্পানি ইন্টারভিউ রাউন্ড যুক্ত করে কমিউনিটির সাথে যোগ দিন।"
              )}
            </p>
            <div className="mt-4">
              <Link
                href="https://github.com/mostafa-cse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
              >
                <span>{t("Collaborate on GitHub", "গিটহাবে যুক্ত হোন")}</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
