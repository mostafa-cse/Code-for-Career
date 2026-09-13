"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function CtaSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border bg-gradient-to-b from-card to-muted/50 px-6 py-12 text-center shadow-xl sm:px-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>{t("Free & Open for Everyone", "সবার জন্য সম্পূর্ণ বিনামূল্যে ও উন্মুক্ত")}</span>
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {t(
                "Ready to Land Your Dream Software Job?",
                "আপনার স্বপ্নের সফটওয়্যার ইঞ্জিনিয়ারিং ক্যারিয়ার গড়তে প্রস্তুত?"
              )}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t(
                "No expensive courses, no gatekeeping. Get structured access to all 13 modules, curated practice questions, and study notes today.",
                "কোনো ব্যয়বহুল কোর্স বা হিডেন ফি নেই। আজই শুরু করুন ১৩টি মডিউলের সাজানো রোডম্যাপ, ইন্টারভিউ প্রশ্ন এবং গোছানো নোটস।"
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-md transition-all hover:opacity-90 hover:shadow-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
              >
                <span>{t("Go to Dashboard", "ড্যাশবোর্ডে যান")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/problems"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-xs transition-colors hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
              >
                <span>{t("Browse Practice Bank", "অনুশীলন সমস্যাসমূহ দেখুন")}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
