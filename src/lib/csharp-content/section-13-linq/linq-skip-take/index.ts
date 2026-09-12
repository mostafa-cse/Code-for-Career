import type { LocalLesson } from "@/lib/lessons-data";

export const linqSkipTakeLesson: LocalLesson = {
  slug: "linq-skip-take",
  titleEn: "Skip, Take, & Chunk (Pagination)",
  titleBn: "স্কিপ (Skip), টেক (Take) ও চাঙ্ক পেজিনেশন",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকইউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Sequence partitioning, API pagination formulas, SQL OFFSET/FETCH generation, SkipWhile/TakeWhile predicates, and modern .NET 6+ Chunk batching.",
  descriptionBn:
    "সিকোয়েন্স পার্টিশনিং, এপিআই পেজিনেশন ফর্মুলা, SQL OFFSET/FETCH কুয়েরি জেনারেশন, SkipWhile/TakeWhile এবং আধুনিক .NET 6+ এর Chunk ব্যাচিং।",
  difficulty: "EASY",
  displayOrder: 11,
  prerequisites: ["linq-where"],
  estimatedMinutes: 15,
  lastUpdated: "Recently updated",
  contentEn: `# Skip, Take, & Chunk (Pagination) in C#

The sequence partitioning operators **\`Take\`** and **\`Skip\`** provide slicing and pagination capabilities across \`IEnumerable<T>\` and \`IQueryable<T>\`. Starting with .NET 6, C# introduced **\`Chunk\`** for batching and Range indexing integration.

---

## The Standard Enterprise Pagination Formula

In modern REST APIs and UI grids, pagination is computed using a zero or one-based offset:

\`\`\`csharp
public static IEnumerable<T> GetPage<T>(
    IEnumerable<T> source, 
    int pageNumber, // 1-based index
    int pageSize)
{
    if (pageNumber < 1) pageNumber = 1;
    if (pageSize < 1) pageSize = 10;

    return source
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize);
}
\`\`\`

### Database Translation in EF Core:
When applied to an \`IQueryable<T>\`, EF Core translates \`Skip\` and \`Take\` into database-level offset queries:

\`\`\`csharp
var pagedOrders = await dbContext.Orders
    .OrderBy(o => o.OrderDate) // Mandatory in SQL Server!
    .Skip(20)
    .Take(10)
    .ToListAsync();
\`\`\`

Translates in SQL Server to:
\`\`\`sql
SELECT [o].[Id], [o].[OrderDate], [o].[Total]
FROM [Orders] AS [o]
ORDER BY [o].[OrderDate]
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
\`\`\`

> **CRITICAL SQL SERVER RULE**: \`OFFSET\` requires an explicit \`ORDER BY\` clause. Applying \`Skip\` without \`OrderBy\` in EF Core will trigger a runtime SQL translation exception.

---

## Predicate-Based Slicing: TakeWhile & SkipWhile

Unlike \`Where\` which filters the entire sequence from start to end, **\`TakeWhile\`** and **\`SkipWhile\`** evaluate contiguous sequential spans:

\`\`\`csharp
int[] numbers = { 2, 4, 6, 7, 8, 10 };

// Stops immediately upon hitting the first odd number (7):
var leadingEvens = numbers.TakeWhile(n => n % 2 == 0); // { 2, 4, 6 }

// Bypasses elements until the first odd number, then emits the rest:
var fromFirstOdd = numbers.SkipWhile(n => n % 2 == 0); // { 7, 8, 10 }
\`\`\`

---

## Modern Batch Processing: .NET 6 Chunk(size)

Prior to .NET 6, splitting a collection into batches required complex grouping logic. The **\`Chunk\`** operator splits any sequence into arrays of at most the specified size:

\`\`\`csharp
List<int> userIds = Enumerable.Range(1, 1050).ToList();

// Emits chunks of size 500, 500, and 50
foreach (int[] batch in userIds.Chunk(500))
{
    await notificationService.SendBulkEmailAsync(batch);
}
\`\`\`

### C# 8+ Range Slicing Overloads (.NET 6+):
\`\`\`csharp
int[] items = { 10, 20, 30, 40, 50 };

var firstThree = items.Take(..3);  // Equivalent to Take(3)
var lastTwo = items.Take(^2..);     // Takes last 2 elements from the end
\`\`\`

---

## Edge Cases & Boundary Behaviors

| Scenario | \`Take(k)\` Behavior | \`Skip(k)\` Behavior |
| :--- | :--- | :--- |
| **$k \\le 0$** | Returns empty sequence | Returns entire source unchanged |
| **$k > \\text{length}$** | Returns all available elements (no exception) | Returns empty sequence (no exception) |
| **Empty Source** | Returns empty sequence | Returns empty sequence |

Neither operator ever throws an \`ArgumentOutOfRangeException\` when requesting more elements than exist in the collection.

---

## Practical Problem Walkthrough

### Problem: Paged Batch Processing with Metadata
*Given an unsorted collection of employee ratings, extract page $P$ of size $S$ sorted in descending order, and compute the average score of that specific page.*

#### Algorithmic Analysis
1. Order elements descending using \`OrderByDescending()\`.
2. Apply the pagination formula: \`.Skip((page - 1) * size).Take(size)\`.
3. Materialize the page, verify whether elements exist using \`Any()\`, and compute \`Average()\`.

#### C# Implementation

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var ratings = new List<int> { 85, 92, 78, 99, 65, 88, 72, 95, 81, 90 };

        int pageNumber = 2;
        int pageSize = 3;

        var pagedScores = ratings
            .OrderByDescending(r => r)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        Console.WriteLine($"Page {pageNumber} Scores: {string.Join(", ", pagedScores)}");

        if (pagedScores.Any())
        {
            double pageAverage = pagedScores.Average();
            Console.WriteLine($"Page Average: {pageAverage:F2}");
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N \\log N)$ due to initial sorting, followed by $\\mathcal{O}(\\text{Skip} + \\text{Take})$ linear enumeration of the requested page window.
- **Space Complexity**: $\\mathcal{O}(N)$ for sorting buffer and $\\mathcal{O}(\\text{PageSize})$ for the materialized page.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Interval](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/S) | Easy | Range checks, Boundary verification |
| ⚪ | Codeforces | [Assiut Sheet #2: Even Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B) | Easy | Range partitioning, \`Take\`, Parity |
| ⚪ | Exercism C# | [Sublist](https://exercism.org/tracks/csharp/exercises/sublist) | Medium | Sequential window comparison, \`Take\` |
| ⚪ | Exercism C# | [Scrabble Score](https://exercism.org/tracks/csharp/exercises/scrabble-score) | Easy | Character lookup, Chunking |
`,

  contentBn: `# C# এ স্কিপ (Skip), টেক (Take) ও চাঙ্ক পেজিনেশন

LINQ-এ সিকোয়েন্সকে স্লাইস করা বা পেজিনেশন (Pagination) তৈরি করার জন্য **\`Take\`** এবং **\`Skip\`** অপারেটর দুটি সর্বাধিক ব্যবহৃত হয়। .NET 6 থেকে ব্যাচ প্রসেসিং সহজ করতে **\`Chunk\`** অপারেটর এবং C# 8 এর রেঞ্জ ইনডেক্সিং সাপোর্ট যুক্ত করা হয়েছে।

---

## এন্টারপ্রাইজ স্ট্যান্ডার্ড পেজিনেশন ফর্মুলা

আধুনিক ওয়েব এপিআই এবং ইউজার ইন্টারফেসে ডেটা পেজিনেশন করার ফর্মুলা:

\`\`\`csharp
public static IEnumerable<T> GetPage<T>(
    IEnumerable<T> source, 
    int pageNumber, // ১-ভিত্তিক ইনডেক্স
    int pageSize)
{
    if (pageNumber < 1) pageNumber = 1;
    if (pageSize < 1) pageSize = 10;

    return source
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize);
}
\`\`\`

### ডেটাবেস অনুবাদ (EF Core):
Entity Framework Core-এ \`Skip\` এবং \`Take\` সরাসরি ডেটাবেস সার্ভারের \`OFFSET\` ও \`FETCH\` কুয়েরিতে রূপান্তর হয়:

\`\`\`csharp
var pagedOrders = await dbContext.Orders
    .OrderBy(o => o.OrderDate) // SQL Server-এ এটি বাধ্যতামূলক!
    .Skip(20)
    .Take(10)
    .ToListAsync();
\`\`\`

SQL Server-এ এটি তৈরি করে:
\`\`\`sql
SELECT [o].[Id], [o].[OrderDate], [o].[Total]
FROM [Orders] AS [o]
ORDER BY [o].[OrderDate]
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
\`\`\`

> **SQL SERVER এর বিশেষ নিয়ম**: SQL Server-এ \`OFFSET\` ব্যবহার করতে হলে কুয়েরিতে অবশ্যই একটি \`ORDER BY\` ক্লজ থাকতে হবে। \`OrderBy\` ছাড়া \`Skip\` কল করলে ডেটাবেস কুয়েরিতে সিনট্যাক্স এক্সেপশন ঘটবে।

---

## শর্তাধীন স্লাইসিং: TakeWhile ও SkipWhile

\`Where\` যেখানে সম্পূর্ণ কালেকশন শেষ পর্যন্ত চেক করে, সেখানে **\`TakeWhile\`** এবং **\`SkipWhile\`** প্রথম শর্ত ভঙ্গের সাথে সাথে সিদ্ধান্ত নেয়:

\`\`\`csharp
int[] numbers = { 2, 4, 6, 7, 8, 10 };

// প্রথম বিজোড় সংখ্যা (৭) পাওয়ার সাথে সাথে থেমে যায়:
var leadingEvens = numbers.TakeWhile(n => n % 2 == 0); // { 2, 4, 6 }

// প্রথম বিজোড় সংখ্যা না পাওয়া পর্যন্ত উপাদান বাদ দেয়, তারপর বাকি সব নেয়:
var fromFirstOdd = numbers.SkipWhile(n => n % 2 == 0); // { 7, 8, 10 }
\`\`\`

---

## আধুনিক ব্যাচ প্রসেসিং: .NET 6 Chunk(size)

পূর্বে বড় কালেকশনকে ছোট ব্যাচে ভাগ করতে জটিল লজিক লিখতে হতো। .NET 6 এর **\`Chunk\`** অপারেটর যেকোনো সিকোয়েন্সকে নির্দিষ্ট আকারের অ্যারেতে ভাগ করে দেয়:

\`\`\`csharp
List<int> userIds = Enumerable.Range(1, 1050).ToList();

// ৫০০, ৫০০ এবং ৫০ আকারের মোট ৩টি ব্যাচ তৈরি করবে
foreach (int[] batch in userIds.Chunk(500))
{
    await notificationService.SendBulkEmailAsync(batch);
}
\`\`\`

### C# 8+ রেঞ্জ স্লাইসিং (.NET 6+):
\`\`\`csharp
int[] items = { 10, 20, 30, 40, 50 };

var firstThree = items.Take(..3);  // প্রথম ৩টি উপাদান নেয়
var lastTwo = items.Take(^2..);     // শেষ থেকে ২টি উপাদান নেয়
\`\`\`

---

## বাউন্ডারি ও এজ কেইস আচরণ

| পরিস্থিতি | \`Take(k)\` এর আচরণ | \`Skip(k)\` এর আচরণ |
| :--- | :--- | :--- |
| **$k \\le 0$** | খালি সিকোয়েন্স ফেরত দেয় | সম্পূর্ণ মূল সিকোয়েন্স ফেরত দেয় |
| **$k > \\text{দৈর্ঘ্য}$** | যতগুলো আছে সবগুলো দেয় (কোনো এক্সেপশন হয় না) | খালি সিকোয়েন্স ফেরত দেয় (কোনো এক্সেপশন হয় না) |
| **খালি কালেকশন** | খালি সিকোয়েন্স ফেরত দেয় | খালি সিকোয়েন্স ফেরত দেয় |

কোনো অপারেটরই কালেকশনের চেয়ে বেশি উপাদান চাইলে \`ArgumentOutOfRangeException\` ছুড়ে দেয় না, বরং মার্জিতভাবে বাউন্ডারি হ্যান্ডেল করে।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: মেটাডেটা সহ পেজড ব্যাচ প্রসেসিং
*কর্মচারীদের পারফরম্যান্স স্কোরের একটি তালিকা দেওয়া আছে। স্কোরগুলো অবরোহী ক্রমে সাজিয়ে $P$ নম্বর পেজের $S$ সংখ্যক রেকর্ড বের করুন এবং ওই পেজের গড় স্কোর হিসাব করুন।*

#### সমাধান বিশ্লেষণ
১. \`OrderByDescending()\` দিয়ে স্কোরগুলো সর্বোচ্চ থেকে সর্বনিম্ন ক্রমে সাজানো।
২. পেজিনেশন ফর্মুলা: \`.Skip((page - 1) * size).Take(size)\` প্রয়োগ করা।
৩. \`Any()\` দিয়ে পেজে কোনো রেকর্ড আছে কি না নিশ্চিত হয়ে \`Average()\` হিসাব করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var ratings = new List<int> { 85, 92, 78, 99, 65, 88, 72, 95, 81, 90 };

        int pageNumber = 2;
        int pageSize = 3;

        var pagedScores = ratings
            .OrderByDescending(r => r)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        Console.WriteLine($"Page {pageNumber} Scores: {string.Join(", ", pagedScores)}");

        if (pagedScores.Any())
        {
            double pageAverage = pagedScores.Average();
            Console.WriteLine($"Page Average: {pageAverage:F2}");
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: সর্টিংয়ের জন্য $\\mathcal{O}(N \\log N)$, এরপর পেজ উইন্ডো এনুমারেট করতে $\\mathcal{O}(\\text{Skip} + \\text{Take})$ সময় লাগে।
- **স্পেস কমপ্লেক্সিটি**: সর্টিং বাফারের জন্য $\\mathcal{O}(N)$ এবং পেজড লিস্টের জন্য $\\mathcal{O}(\\text{PageSize})$ মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Interval](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/S) | Easy | Range checks, Boundary verification |
| ⚪ | Codeforces | [Assiut Sheet #2: Even Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B) | Easy | Range partitioning, \`Take\`, Parity |
| ⚪ | Exercism C# | [Sublist](https://exercism.org/tracks/csharp/exercises/sublist) | Medium | Sequential window comparison, \`Take\` |
| ⚪ | Exercism C# | [Scrabble Score](https://exercism.org/tracks/csharp/exercises/scrabble-score) | Easy | Character lookup, Chunking |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Interval",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/S",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["LINQ", "TakeWhile", "Intervals"],
      solutionEn:
        "Determine which numerical interval contains a given floating-point number using boundary conditions.",
      solutionBn:
        "বাস্তব সংখ্যার জন্য কোন ইন্টারভাল প্রযোজ্য তা বাউন্ডারি শর্ত যাচাই করে নির্ধারণ করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #2: Even Numbers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["LINQ", "Take", "Range"],
      solutionEn:
        "Generate and slice even numbers between 1 and N using range generation and Take limits.",
      solutionBn:
        "1 থেকে N এর মধ্যে জোড় সংখ্যাগুলো তৈরি করে Take লিমিটের সাহায্যে প্রদর্শন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Sublist",
      url: "https://exercism.org/tracks/csharp/exercises/sublist",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["LINQ", "Skip", "Take"],
      solutionEn:
        "Check whether list A is contained as a contiguous sublist in list B using sliding Skip and Take windows.",
      solutionBn:
        "স্লাইডিং Skip এবং Take উইন্ডোর সাহায্যে লিস্ট A লিস্ট B এর সাবলিস্ট কি না তা যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "Scrabble Score",
      url: "https://exercism.org/tracks/csharp/exercises/scrabble-score",
      difficulty: "EASY",
      company: "BJIT Group",
      tags: ["LINQ", "Chunk", "Aggregates"],
      solutionEn:
        "Calculate Scrabble word point totals using character weight lookup and aggregated summation.",
      solutionBn:
        "ক্যারেক্টার পয়েন্ট ম্যাপিং এবং এগ্রিগেটেড যোগফলের মাধ্যমে স্ক্র্যাবল শব্দের মোট স্কোর বের করুন।",
    },
  ],
};
