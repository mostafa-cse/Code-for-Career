import type { Metadata } from "next";
import { SITE_NAME, SUBJECTS } from "@/lib/constants";
import { LOCAL_CURRICULUM } from "@/lib/lessons-data";
import {
  ProblemsDirectory,
  type DirectoryProblem,
} from "@/components/problems/problems-directory";

export const metadata: Metadata = {
  title: `Practice Problems & Company Questions — ${SITE_NAME}`,
  description:
    "Solve curated software engineering interview questions tagged by top Bangladesh tech employers: Enosis, Therap, Samsung R&D, Brain Station 23, and BJIT.",
};

export default function ProblemsPage() {
  const problems: DirectoryProblem[] = [];

  // Extract problems from local curriculum
  for (const [subSlug, subjectData] of Object.entries(LOCAL_CURRICULUM)) {
    const subMeta = SUBJECTS.find((s) => s.slug === subSlug);

    for (const lesson of subjectData.lessons) {
      for (const p of lesson.problems) {
        problems.push({
          id: `${subSlug}-${lesson.slug}-${p.name}`,
          name: p.name,
          source: p.source,
          url: p.url,
          difficulty: p.difficulty,
          company: p.company,
          tags: p.tags,
          subjectSlug: subSlug,
          subjectName: subMeta?.nameEn ?? subSlug,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.titleEn,
          solutionEn: p.solutionEn,
          solutionBn: p.solutionBn,
        });
      }
    }
  }

  // Additional curated high-frequency BD company interview questions
  problems.push(
    {
      id: "curated-samsung-intervals",
      name: "Merge Intervals",
      source: "LeetCode",
      url: "https://leetcode.com/problems/merge-intervals/",
      difficulty: "MEDIUM",
      company: "Samsung R&D",
      tags: ["Array", "Sorting", "Intervals"],
      subjectSlug: "dsa",
      subjectName: "Data Structures & Algorithms",
      lessonSlug: "asymptotic-complexity",
      lessonTitle: "Asymptotic Complexity (Big-O)",
      solutionEn:
        "Sort intervals by start time. Iterate through intervals and merge if current start <= previous end. Time complexity: O(n log n) due to sorting, Space: O(n).",
      solutionBn:
        "শুরুর সময় অনুযায়ী ব্যবধানগুলো সাজান। ক্রমান্বয়ে লুপ চালিয়ে বর্তমান শুরু যদি পূর্বের শেষের চেয়ে ছোট বা সমান হয় তবে মার্জ করুন। টাইম: O(n log n), স্পেস: O(n)।",
    },
    {
      id: "curated-enosis-salary",
      name: "Second Highest Salary",
      source: "LeetCode",
      url: "https://leetcode.com/problems/second-highest-salary/",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["SQL", "Subquery", "LIMIT"],
      subjectSlug: "database",
      subjectName: "Database using PostgreSQL",
      lessonSlug: "sql-indexes-and-b-trees",
      lessonTitle: "SQL Indexes & B-Tree Internals",
      solutionEn:
        "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); Handles NULL when fewer than 2 distinct salaries exist.",
      solutionBn:
        "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); দুইটির কম আলাদা বেতন থাকলে এটি সুন্দরভাবে NULL রিটার্ন করে।",
    },
    {
      id: "curated-bs23-singleton",
      name: "Thread-Safe Lazy Singleton in C#",
      source: "Interview",
      url: null,
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["C#", "Design Patterns", "Concurrency"],
      subjectSlug: "oop",
      subjectName: "OOP in C#",
      lessonSlug: "solid-principles-overview",
      lessonTitle: "SOLID Principles in Depth",
      solutionEn:
        "Use Lazy<T> in modern .NET: private static readonly Lazy<Singleton> _instance = new Lazy<Singleton>(() => new Singleton()); public static Singleton Instance => _instance.Value. Guarantees thread-safety and lazy initialization without explicit lock.",
      solutionBn:
        "আধুনিক .NET এ Lazy<T> ব্যবহার করুন: private static readonly Lazy<Singleton> _instance = new Lazy<Singleton>(() => new Singleton()); লক ছাড়াই সম্পূর্ণ থ্রেড-সেফটি এবং লেজি ইনিশিয়ালাইজেশন নিশ্চিত করে।",
    }
  );

  return <ProblemsDirectory initialProblems={problems} />;
}
