import type { DifficultyLevel } from "@/types/database";
import { CSHARP_LESSONS } from "./csharp-content";
import { GIT_LESSONS } from "./git-content";

export interface LocalLesson {
  slug: string;
  titleEn: string;
  titleBn: string;
  categoryEn?: string;
  categoryBn?: string;
  categoryDescEn?: string;
  categoryDescBn?: string;
  categoryPriority?: "NORMAL" | "CORE" | "ESSENTIAL";
  descriptionEn?: string;
  descriptionBn?: string;
  contentEn: string;
  contentBn: string;
  difficulty: DifficultyLevel;
  displayOrder: number;
  prerequisites: string[];
  estimatedMinutes: number;
  lastUpdated?: string;
  resources: LocalResource[];
  problems: LocalProblem[];
}

export interface LocalResource {
  source: string;
  title: string;
  url: string;
  description: string | null;
  isStarred: boolean;
}

export interface LocalProblem {
  source: string;
  name: string;
  url: string | null;
  difficulty: DifficultyLevel;
  company: string | null;
  tags: string[];
  solutionEn: string | null;
  solutionBn: string | null;
}

export interface SubjectCategory {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  priority?: "NORMAL" | "CORE" | "ESSENTIAL";
  lessons: LocalLesson[];
}

export interface LocalSubjectCurriculum {
  slug: string;
  lessons: LocalLesson[];
}

export const LOCAL_CURRICULUM: Record<string, LocalSubjectCurriculum> = {
  git: {
    slug: "git",
    lessons: GIT_LESSONS,
  },
  csharp: {
    slug: "csharp",
    lessons: CSHARP_LESSONS,
  },
  dsa: {
    slug: "dsa",
    lessons: [
      {
        slug: "asymptotic-complexity",
        titleEn: "Asymptotic Complexity (Big-O)",
        titleBn: "অ্যাসিম্পটোটিক কমপ্লেক্সিটি (বিগ-ও)",
        difficulty: "EASY",
        displayOrder: 1,
        prerequisites: [],
        estimatedMinutes: 25,
        contentEn: `# Asymptotic Complexity — Big-O, Big-Ω, Big-Θ

Algorithm analysis measures growth rates of time and space as input size $n$ grows.

## The Big-O Hierarchy

$$O(1) \\subset O(\\log n) \\subset O(n) \\subset O(n \\log n) \\subset O(n^2) \\subset O(2^n) \\subset O(n!)$$

**Formal definition**: $f(n) = O(g(n))$ iff there exist constants $c > 0$ and $n_0$ such that:

$$f(n) \\leq c \\cdot g(n) \\quad \\text{for all } n \\geq n_0$$

## Common Running Times

| Algorithm | Time Complexity | Space |
|-----------|----------------|-------|
| Binary Search | $O(\\log n)$ | $O(1)$ |
| Merge Sort | $O(n \\log n)$ | $O(n)$ |
| Quick Sort (avg) | $O(n \\log n)$ | $O(\\log n)$ |
| BFS / DFS | $O(V + E)$ | $O(V)$ |
| DP (2D grid) | $O(mn)$ | $O(mn)$ |

\`\`\`csharp
// O(log n) — Binary Search
static int BinarySearch(int[] arr, int target)
{
    int lo = 0, hi = arr.Length - 1;
    while (lo <= hi)
    {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
\`\`\`

<Callout variant="company" title="Samsung R&D (SRBD) — Pro Coding Test">
SRBD coding tests require precise Big-O analysis of submitted solutions. Always state both time and space complexity in comments. Solutions exceeding $O(n \\log n)$ for $n = 10^6$ typically time-out.
</Callout>`,
        contentBn: `# অ্যাসিম্পটোটিক কমপ্লেক্সিটি — বিগ-ও, বিগ-Ω, বিগ-Θ

অ্যালগরিদম বিশ্লেষণ ইনপুট সাইজ $n$ বাড়ার সাথে সাথে টাইম ও স্পেসের বৃদ্ধির হার পরিমাপ করে।

## বিগ-ও হায়ারার্কি

$$O(1) \\subset O(\\log n) \\subset O(n) \\subset O(n \\log n) \\subset O(n^2) \\subset O(2^n) \\subset O(n!)$$

**আনুষ্ঠানিক সংজ্ঞা**: $f(n) = O(g(n))$ যদি এবং কেবল যদি $c > 0$ এবং $n_0$ ধ্রুবক বিদ্যমান থাকে যেন:

$$f(n) \\leq c \\cdot g(n) \\quad \\text{সব } n \\geq n_0 \\text{ এর জন্য}$$

<Callout variant="company" title="স্যামসাং আরঅ্যান্ডডি (SRBD) — প্রো কোডিং টেস্ট">
SRBD কোডিং পরীক্ষায় সমাধানের সুনির্দিষ্ট বিগ-ও বিশ্লেষণ প্রয়োজন। $n = 10^6$ এর জন্য $O(n \\log n)$ অতিক্রম করলে টাইম-আউট হবে।
</Callout>`,
        resources: [
          {
            source: "USACO Guide",
            title: "Time Complexity",
            url: "https://usaco.guide/bronze/time-comp",
            description:
              "Practical guide to analyzing algorithm time complexity with worked examples.",
            isStarred: true,
          },
        ],
        problems: [
          {
            source: "LeetCode",
            name: "Binary Search",
            url: "https://leetcode.com/problems/binary-search/",
            difficulty: "EASY",
            company: "Brain Station 23",
            tags: ["Binary Search", "Array"],
            solutionEn:
              "Standard iterative binary search. Maintain lo and hi pointers; compute mid = lo + (hi-lo)/2 to avoid overflow.",
            solutionBn:
              "স্ট্যান্ডার্ড ইটারেটিভ বাইনারি সার্চ। ওভারফ্লো এড়াতে mid = lo + (hi-lo)/2 ব্যবহার করুন।",
          },
        ],
      },
    ],
  },

  database: {
    slug: "database",
    lessons: [
      {
        slug: "sql-indexes-and-b-trees",
        titleEn: "SQL Indexes & B-Tree Internals",
        titleBn: "SQL ইনডেক্স ও বি-ট্রি ইন্টার্নালস",
        difficulty: "MEDIUM",
        displayOrder: 1,
        prerequisites: [],
        estimatedMinutes: 35,
        contentEn: `# SQL Indexes & B-Tree Internals

A **database index** is an auxiliary data structure that enables $O(\\log n)$ row lookups instead of $O(n)$ full table scans.

## B-Tree Properties

PostgreSQL's default index type is a **B-tree** of order $m$ where:

- Every node holds between $\\lceil m/2 \\rceil - 1$ and $m - 1$ keys.
- All leaf nodes are at the same depth, ensuring $O(\\log n)$ worst-case search.
- The height is at most $\\log_{\\lceil m/2 \\rceil}(n)$.

## Creating Indexes in PostgreSQL

\`\`\`sql
-- Single-column B-Tree index
CREATE INDEX idx_lessons_subject ON lessons(subject_id);

-- Composite index — column order matters for query planner
CREATE INDEX idx_lessons_sub_order ON lessons(subject_id, display_order);

-- Partial index — only index rows matching the condition
CREATE INDEX idx_active_users ON profiles(email)
  WHERE role = 'ADMIN';

-- GIN index for full-text search
CREATE INDEX idx_lessons_fts ON lessons
  USING GIN(to_tsvector('english', title_en || ' ' || content_en));
\`\`\`

<Callout variant="company" title="Therap (BD) — Technical Viva Focus">
Therap vivas frequently test whether candidates can explain index selectivity, the difference between B-tree and Hash indexes, and how EXPLAIN ANALYZE output should be interpreted.
</Callout>

## Query Planner — EXPLAIN ANALYZE

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM lessons
WHERE subject_id = '11111111-1111-1111-1111-111111111001'
ORDER BY display_order;
\`\`\`

A planner output showing **Index Scan** instead of **Seq Scan** confirms the index is being used.

<Callout variant="tip" title="Index Selectivity Rule">
Only create an index if the column has high cardinality. A boolean column (only 2 distinct values) is rarely worth indexing — the planner will often prefer a Seq Scan.
</Callout>`,
        contentBn: `# SQL ইনডেক্স ও বি-ট্রি ইন্টার্নালস

একটি **ডাটাবেজ ইনডেক্স** হলো একটি সহায়ক ডেটা স্ট্রাকচার যা $O(n)$ ফুল টেবিল স্ক্যানের পরিবর্তে $O(\\log n)$ রো লুকআপ সক্ষম করে।

## বি-ট্রি বৈশিষ্ট্য

PostgreSQL এর ডিফল্ট ইনডেক্স টাইপ হলো $m$ অর্ডারের **B-tree** যেখানে:

- প্রতিটি নোডে $\\lceil m/2 \\rceil - 1$ থেকে $m - 1$ পর্যন্ত কী থাকে।
- সকল লিফ নোড একই গভীরতায় থাকে, যা $O(\\log n)$ ওয়ার্স্ট-কেস নিশ্চিত করে।

## PostgreSQL এ ইনডেক্স তৈরি

\`\`\`sql
-- সিঙ্গেল-কলাম বি-ট্রি ইনডেক্স
CREATE INDEX idx_lessons_subject ON lessons(subject_id);

-- কম্পোজিট ইনডেক্স — কলামের ক্রম কোয়েরি প্ল্যানারের জন্য গুরুত্বপূর্ণ
CREATE INDEX idx_lessons_sub_order ON lessons(subject_id, display_order);
\`\`\`

<Callout variant="company" title="থেরাপ (BD) — টেকনিক্যাল ভাইভায় গুরুত্বপূর্ণ">
থেরাপ ভাইভায় ইনডেক্স সিলেক্টিভিটি, B-tree বনাম Hash ইনডেক্সের পার্থক্য এবং EXPLAIN ANALYZE ব্যাখ্যার প্রশ্ন সাধারণত আসে।
</Callout>`,
        resources: [
          {
            source: "PostgreSQL Docs",
            title: "Indexes in PostgreSQL",
            url: "https://www.postgresql.org/docs/current/indexes.html",
            description:
              "Official PostgreSQL documentation on all index types and their use cases.",
            isStarred: true,
          },
        ],
        problems: [
          {
            source: "Interview",
            name: "Explain the difference between B-tree and Hash indexes",
            url: null,
            difficulty: "MEDIUM",
            company: "Therap (BD) Ltd",
            tags: ["Database", "Indexing"],
            solutionEn:
              "B-tree supports range queries (>, <, BETWEEN) and sorts data. Hash indexes only support equality (=) but are O(1) for exact lookups. PostgreSQL Hash indexes are not WAL-logged before v10.",
            solutionBn:
              "B-tree রেঞ্জ কোয়েরি সাপোর্ট করে এবং ডেটা সর্ট করে। Hash ইনডেক্স শুধু ইকুয়ালিটি (=) সাপোর্ট করে কিন্তু O(1) লুকআপ দেয়।",
          },
        ],
      },
    ],
  },

  oop: {
    slug: "oop",
    lessons: [
      {
        slug: "solid-principles-overview",
        titleEn: "SOLID Principles in Depth",
        titleBn: "SOLID নীতিমালার বিস্তারিত",
        difficulty: "MEDIUM",
        displayOrder: 1,
        prerequisites: [],
        estimatedMinutes: 30,
        contentEn: `# SOLID Principles in C#

SOLID is an acronym for five object-oriented design principles that produce maintainable, extensible, and testable code.

## S — Single Responsibility Principle (SRP)

> *A class should have only one reason to change.*

\`\`\`csharp
// ❌ Violation — Order does too much
class Order {
    void CalculateTotal() { }
    void SaveToDatabase() { }  // persistence concern
    void SendEmail() { }       // notification concern
}

// ✅ SRP-compliant
class Order { void CalculateTotal() { } }
class OrderRepository { void Save(Order o) { } }
class EmailService { void SendConfirmation(Order o) { } }
\`\`\`

## O — Open/Closed Principle (OCP)

> *Open for extension, closed for modification.*

Use abstract base classes or interfaces so new behaviour can be added without touching existing code.

\`\`\`csharp
abstract class Discount {
    public abstract decimal Apply(decimal price);
}
class SeasonalDiscount : Discount {
    public override decimal Apply(decimal p) => p * 0.85m;
}
class LoyaltyDiscount : Discount {
    public override decimal Apply(decimal p) => p * 0.90m;
}
\`\`\`

## L — Liskov Substitution Principle (LSP)

> *Subtypes must be substitutable for their base types.*

If $B$ is a subtype of $A$, then objects of type $A$ may be replaced by objects of type $B$ without altering the correctness of the program.

<Callout variant="company" title="BJIT Group — Viva Focus">
BJIT interviewers commonly ask candidates to spot LSP violations. The classic example is making Square extend Rectangle — Square cannot honour the invariant that independently setting width and height is valid.
</Callout>

## I — Interface Segregation & D — Dependency Inversion

Clients should not depend on interfaces they do not use. High-level modules should depend on abstractions, not on concrete classes.

\`\`\`csharp
// DIP — inject the abstraction, not the concrete class
class LessonService {
    private readonly ILessonRepository _repo;
    public LessonService(ILessonRepository repo) => _repo = repo;
}
\`\`\``,
        contentBn: `# C# এ SOLID নীতিমালা

SOLID হলো পাঁচটি অবজেক্ট-ওরিয়েন্টেড ডিজাইন নীতির আদ্যক্ষর যা রক্ষণযোগ্য, সম্প্রসারণযোগ্য এবং টেস্টযোগ্য কোড তৈরি করে।

## S — সিঙ্গেল রেসপনসিবিলিটি প্রিন্সিপল

> *একটি ক্লাসের পরিবর্তনের শুধুমাত্র একটি কারণ থাকবে।*

<Callout variant="company" title="বিজেআইটি গ্রুপ — ভাইভায় গুরুত্বপূর্ণ">
বিজেআইটি ইন্টারভিউয়াররা প্রায়ই LSP লঙ্ঘন খুঁজতে বলেন। ক্লাসিক উদাহরণ: Square কে Rectangle এর সাব-ক্লাস বানানো — Square স্বাধীনভাবে width ও height সেটের ইনভ্যারিয়েন্ট মানতে পারে না।
</Callout>`,
        resources: [
          {
            source: "Article",
            title: "SOLID Principles in C# — A Practical Guide",
            url: "https://www.c-sharpcorner.com/article/solid-principles-in-c-sharp/",
            description:
              "Practical walkthroughs of all five SOLID principles with C# code examples.",
            isStarred: true,
          },
        ],
        problems: [
          {
            source: "Interview",
            name: "Detect the LSP violation: Square extends Rectangle",
            url: null,
            difficulty: "MEDIUM",
            company: "BJIT Group",
            tags: ["OOP", "SOLID", "LSP"],
            solutionEn:
              "Rectangle allows independently setting Width and Height. If Square overrides SetWidth to also set Height (to keep it a square), it breaks code that expects Height to remain unchanged when only Width is set — violating LSP.",
            solutionBn:
              "Rectangle স্বাধীনভাবে Width ও Height সেট করার অনুমতি দেয়। Square যদি SetWidth ওভাররাইড করে Height ও সেট করে, এটি এমন কোড ভাঙে যা শুধু Width পরিবর্তনে Height অপরিবর্তিত আশা করে — LSP লঙ্ঘন।",
          },
        ],
      },
    ],
  },
};



export function getSubjectLessons(slug: string): LocalLesson[] {
  return LOCAL_CURRICULUM[slug]?.lessons ?? [];
}

export function getLessonBySlug(
  subjectSlug: string,
  lessonSlug: string
): LocalLesson | null {
  const lessons = getSubjectLessons(subjectSlug);
  return lessons.find((l) => l.slug === lessonSlug) ?? null;
}

export function getSubjectCategories(slug: string): SubjectCategory[] {
  const lessons = getSubjectLessons(slug);
  if (!lessons || lessons.length === 0) return [];

  const categoryMap = new Map<string, SubjectCategory>();

  for (const lesson of lessons) {
    const catTitle = lesson.categoryEn || "General Modules";
    if (!categoryMap.has(catTitle)) {
      categoryMap.set(catTitle, {
        id: catTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        titleEn: lesson.categoryEn || "General Modules",
        titleBn: lesson.categoryBn || "সাধারণ মডিউল",
        descEn: lesson.categoryDescEn || "Core modules for this subject track.",
        descBn: lesson.categoryDescBn || "এই বিষয়ের জন্য নির্ধারিত প্রয়োজনীয় মডিউলসমূহ।",
        priority: lesson.categoryPriority || "NORMAL",
        lessons: [],
      });
    }
    categoryMap.get(catTitle)!.lessons.push(lesson);
  }

  return Array.from(categoryMap.values());
}
