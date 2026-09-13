"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function UsacoFaq() {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-100 dark:bg-black py-20 sm:py-28 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl 2xl:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
          {t("Frequently asked questions", "সাধারণ কিছু প্রশ্নোত্তর")}
        </h2>

        {/* USACO Guide 2-Column Definition List Grid */}
        <div className="mt-12 sm:mt-16">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {/* Question 1 */}
            <div className="space-y-2">
              <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t(
                  "Which Bangladeshi companies are covered?",
                  "কোন কোন কোম্পানির জন্য এই প্রস্তুতি উপযোগী?"
                )}
              </dt>
              <dd className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                {t(
                  "Our curriculum specifically targets technical hiring rounds at top employers including Enosis Solutions, Therap (BD) Ltd, Samsung R&D Institute Bangladesh (SRBD), Brain Station 23, BJIT Group, Cefalo, and Optimizely.",
                  "আমাদের কারিকুলাম বিশেষত এনোসিস সল্যুশনস, থেরাপ (বিডি), স্যামসাং আরঅ্যান্ডডি, ব্রেইন স্টেশন ২৩, বিজেআইটি গ্রুপ, সেফালো এবং অপটিমাইজলি এর ইন্টারভিউকে লক্ষ্য রেখে সাজানো।"
                )}
              </dd>
            </div>

            {/* Question 2 */}
            <div className="space-y-2">
              <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t("Is this platform free to use?", "এই প্ল্যাটফর্মটি কি সম্পূর্ণ ফ্রি?")}
              </dt>
              <dd className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                {t(
                  "Yes! 100% of our lessons, practice problems, code examples, and roadmaps are free and open to everyone without paywalls or hidden subscriptions.",
                  "হ্যাঁ! আমাদের সকল পাঠ, প্র্যাকটিস প্রবলেম, কোড এবং রোডম্যাপ সবার জন্য সম্পূর্ণ উন্মুক্ত এবং সম্পূর্ণ ফ্রি।"
                )}
              </dd>
            </div>

            {/* Question 3 */}
            <div className="space-y-2">
              <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t(
                  "How is the curriculum structured?",
                  "কারিকুলাম কীভাবে বিন্যস্ত করা হয়েছে?"
                )}
              </dt>
              <dd className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                {t(
                  "The curriculum is organized into 4 distinct tracks across 13 core subjects: Core CS, Systems Architecture, Modern Specialized (Cloud/DevOps/AI), and Practice Problems with company tags.",
                  "কারিকুলামটি ১৩টি প্রধান বিষয়কে ৪টি মূল ট্র্যাকে বিন্যস্ত করেছে: কোর সিএস, সিস্টেম আর্কিটেকচার, আধুনিক স্পেশালাইজেশন এবং কোম্পানি ট্যাগযুক্ত প্র্যাকটিস প্রবলেম।"
                )}
              </dd>
            </div>

            {/* Question 4 */}
            <div className="space-y-2">
              <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t(
                  "Can I suggest corrections or add interview questions?",
                  "আমি কি কোনো সংশোধন বা নতুন ইন্টারভিউ প্রশ্ন যোগ করতে পারি?"
                )}
              </dt>
              <dd className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                {t(
                  "Absolutely. Every lesson includes a 'Suggest Edit' button where you can propose corrections, additional questions, or clearer explanations that get reviewed by community maintainers.",
                  "অবশ্যই। প্রতিটি পাঠে 'পরামর্শ' বাটন রয়েছে যার মাধ্যমে আপনি ভুল সংশোধন, নতুন প্রশ্ন বা পরিচ্ছন্ন ব্যাখ্যা প্রস্তাব করতে পারেন।"
                )}
              </dd>
            </div>

            {/* Question 5 */}
            <div className="space-y-2">
              <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t("Is there bilingual support?", "দ্বিভাষিক পড়ার সুবিধা আছে কি?")}
              </dt>
              <dd className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                {t(
                  "Yes. You can switch between English and Bengali at any time using the global header toggle or within individual lessons for side-by-side comprehension.",
                  "হ্যাঁ। হেডার বা পাঠের ভেতর থেকে যেকোনো সময় ইংরেজি ও বাংলার মধ্যে সুইচ করে পড়তে পারবেন।"
                )}
              </dd>
            </div>

            {/* Question 6 */}
            <div className="space-y-2">
              <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t("How do I start preparing?", "কীভাবে প্রস্তুতি শুরু করব?")}
              </dt>
              <dd className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400">
                {t(
                  "Head over to the Candidate Dashboard to view your readiness level, pick a track, and track completed lessons step-by-step.",
                  "ক্যান্ডিডেট ড্যাশবোর্ডে গিয়ে আপনার প্রস্তুতি স্কোর দেখুন, একটি ট্র্যাক নির্বাচন করুন এবং একে একে পাঠগুলো সম্পন্ন করতে থাকুন।"
                )}{" "}
                <Link
                  href="/dashboard"
                  className="text-blue-600 dark:text-blue-400 underline hover:text-purple-600 dark:hover:text-purple-300 font-medium"
                >
                  <span className="inline-flex items-center gap-1">
                    {t("Go to Dashboard", "ড্যাশবোর্ডে প্রবেশ করুন")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
