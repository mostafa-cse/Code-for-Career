import type { LocalLesson } from "@/lib/lessons-data";

export const linqFirstSingleLesson: LocalLesson = {
  slug: "linq-first-single",
  titleEn: "First vs Single (and OrDefault)",
  titleBn: "ফার্স্ট বনাম সিঙ্গেল (First vs Single ও OrDefault)",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকইউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "CORE",
  descriptionEn:
    "First vs FirstOrDefault vs Single vs SingleOrDefault, exception behaviors, TOP(1) vs TOP(2) SQL generation, and C# 9+ default value fallbacks.",
  descriptionBn:
    "First, FirstOrDefault, Single ও SingleOrDefault এর তুলনামূলক বিশ্লেষণ, এক্সেপশন শর্ত, SQL TOP(1) বনাম TOP(2) এবং C# 9+ ডিফল্ট ভ্যালু প্যারামিটার।",
  difficulty: "MEDIUM",
  displayOrder: 8,
  prerequisites: ["linq-any-all"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# First vs Single (and OrDefault) in C#

One of the most frequently tested architecture topics in .NET engineering interviews is the semantic, behavioral, and performance distinction between **\`First\`**, **\`FirstOrDefault\`**, **\`Single\`**, and **\`SingleOrDefault\`**.

---

## The 4-Way Behavioral Matrix

| Method | Sequence is Empty | Exactly 1 Match | More than 1 Match | Execution Cost |
| :--- | :--- | :--- | :--- | :--- |
| **\`First()\`** | **Throws \`InvalidOperationException\`** | Returns element | Returns **first** match | $\\mathcal{O}(1)$ stops at 1st item |
| **\`FirstOrDefault()\`** | Returns \`default(T)\` | Returns element | Returns **first** match | $\\mathcal{O}(1)$ stops at 1st item |
| **\`Single()\`** | **Throws \`InvalidOperationException\`** | Returns element | **Throws \`InvalidOperationException\`** | $\\mathcal{O}(N)$ or verifies uniqueness |
| **\`SingleOrDefault()\`** | Returns \`default(T)\` | Returns element | **Throws \`InvalidOperationException\`** | $\\mathcal{O}(N)$ or verifies uniqueness |

---

## Under the Hood: Enumerator Stepping & SQL Generation

Understanding the internal loop explains why their performance characteristics diverge:

### 1. \`First\` / \`FirstOrDefault\` Internals:
\`\`\`csharp
using var e = source.GetEnumerator();
if (!e.MoveNext()) return default; // Or throw for First()
return e.Current; // Stops immediately!
\`\`\`
- In Entity Framework Core, \`FirstOrDefault()\` emits:
  \`\`\`sql
  SELECT TOP(1) [u].[Id], [u].[Name] FROM [Users] AS [u] WHERE [u].[Email] = @email
  \`\`\`

### 2. \`Single\` / \`SingleOrDefault\` Internals:
\`\`\`csharp
using var e = source.GetEnumerator();
if (!e.MoveNext()) return default; // Or throw for Single()
T first = e.Current;
if (e.MoveNext()) 
{
    throw new InvalidOperationException("Sequence contains more than one matching element.");
}
return first;
\`\`\`
- In Entity Framework Core, \`SingleOrDefault()\` emits:
  \`\`\`sql
  SELECT TOP(2) [u].[Id], [u].[Name] FROM [Users] AS [u] WHERE [u].[Email] = @email
  \`\`\`
  EF Core specifically requests **TOP(2)** rows. If the database returns 2 rows, EF Core throws an \`InvalidOperationException\` to preserve single-entity business invariants.

---

## The Value Type Ambiguity & C# 9+ Fallback Overloads

When querying value types (e.g. \`int\`), \`default(int)\` is \`0\`. This creates ambiguity: did the query match an element whose value is \`0\`, or was no match found?

\`\`\`csharp
int[] numbers = { 0, 10, 20 };

// Ambiguity: Is 0 a match or the default fallback?
int result = numbers.FirstOrDefault(x => x > 50); // Returns 0!
\`\`\`

### Solutions:
1. **Nullable Value Type Projection**:
\`\`\`csharp
int? safeResult = numbers.Cast<int?>().FirstOrDefault(x => x > 50); // Returns null
\`\`\`

2. **C# 9+ / .NET 6+ Explicit Default Parameter**:
\`\`\`csharp
// Explicitly declare sentinel fallback
int found = numbers.FirstOrDefault(x => x > 50, defaultValue: -1); // Returns -1
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem K (Max and Min)
*Given three numbers $A, B, C$. Print the minimum number and the maximum number.*

#### Algorithmic Analysis
1. Read the input tokens and parse them into a collection of integers.
2. Sort the collection ascending.
3. Use \`.First()\` to extract the minimum element and \`.Last()\` (or \`.OrderByDescending().First()\`) to extract the maximum element.

#### C# Implementation

\`\`\`csharp
using System;
using System.Linq;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        int[] numbers = input
            .Trim()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .OrderBy(x => x)
            .ToArray();

        // First retrieves the minimum, Last retrieves the maximum
        int min = numbers.First();
        int max = numbers.Last();

        Console.WriteLine($"{min} {max}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(K \\log K)$ where $K = 3$ (effectively $\\mathcal{O}(1)$). \`First()\` and \`Last()\` operate in $\\mathcal{O}(1)$ on indexed arrays.
- **Space Complexity**: $\\mathcal{O}(K)$ for the 3-element buffer.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Max and Min](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K) | Easy | \`First\`, \`Last\`, Min/Max boundary retrieval |
| ⚪ | Codeforces | [Assiut Sheet #1: Interval](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/S) | Easy | Range predicates, \`FirstOrDefault\` |
| ⚪ | Exercism C# | [Matching Brackets](https://exercism.org/tracks/csharp/exercises/matching-brackets) | Medium | Stack evaluation, Empty sequence verification |
| ⚪ | Exercism C# | [Nucleotide Count](https://exercism.org/tracks/csharp/exercises/nucleotide-count) | Easy | Character lookup, Single item extraction |
`,

  contentBn: `# C# এ ফার্স্ট বনাম সিঙ্গেল (First vs Single ও OrDefault)

.NET আর্কিটেকচার ও টেকনিক্যাল ইন্টারভিউয়ের অন্যতম জনপ্রিয় প্রশ্ন হলো **\`First\`**, **\`FirstOrDefault\`**, **\`Single\`**, এবং **\`SingleOrDefault\`** অপারেটরগুলোর অভ্যন্তরীণ কার্যপদ্ধতি ও পারফরম্যান্স পার্থক্য।

---

## ৪-মুখী আচরণিক ম্যাট্রিক্স (Behavioral Matrix)

| মেথড | কালেকশন খালি হলে | ঠিক ১টি ম্যাচ থাকলে | ১টির বেশি ম্যাচ থাকলে | এক্সিকিউশন খরচ |
| :--- | :--- | :--- | :--- | :--- |
| **\`First()\`** | **\`InvalidOperationException\` ছুড়ে দেয়** | উপাদানটি ফেরত দেয় | **প্রথম** ম্যাচটি ফেরত দেয় | $\\mathcal{O}(1)$ প্রথম উপাদান পেলেই থামে |
| **\`FirstOrDefault()\`** | \`default(T)\` ফেরত দেয় | উপাদানটি ফেরত দেয় | **প্রথম** ম্যাচটি ফেরত দেয় | $\\mathcal{O}(1)$ প্রথম উপাদান পেলেই থামে |
| **\`Single()\`** | **\`InvalidOperationException\` ছুড়ে দেয়** | উপাদানটি ফেরত দেয় | **\`InvalidOperationException\` ছুড়ে দেয়** | $\\mathcal{O}(N)$ ইউনিকনেস যাচাই করে |
| **\`SingleOrDefault()\`** | \`default(T)\` ফেরত দেয় | উপাদানটি ফেরত দেয় | **\`InvalidOperationException\` ছুড়ে দেয়** | $\\mathcal{O}(N)$ ইউনিকনেস যাচাই করে |

---

## আন্ডার দ্য হুড: এনিউমারেটর ও SQL জেনারেশন

মেথডগুলোর অভ্যন্তরীণ লুপ বুঝতে পারলে তাদের পারফরম্যান্স তফাত স্পষ্ট হয়ে যায়:

### ১. \`First\` / \`FirstOrDefault\` এর অভ্যন্তরীণ কার্যপদ্ধতি:
\`\`\`csharp
using var e = source.GetEnumerator();
if (!e.MoveNext()) return default; // First() হলে এক্সেপশন ছুড়বে
return e.Current; // সাথে সাথে থেমে যায়!
\`\`\`
- Entity Framework Core-এ \`FirstOrDefault()\` অনুবাদ করে:
  \`\`\`sql
  SELECT TOP(1) [u].[Id], [u].[Name] FROM [Users] AS [u] WHERE [u].[Email] = @email
  \`\`\`

### ২. \`Single\` / \`SingleOrDefault\` এর অভ্যন্তরীণ কার্যপদ্ধতি:
\`\`\`csharp
using var e = source.GetEnumerator();
if (!e.MoveNext()) return default; // Single() হলে এক্সেপশন ছুড়বে
T first = e.Current;
if (e.MoveNext()) 
{
    // ১টির বেশি উপাদান পেলেই এক্সেপশন
    throw new InvalidOperationException("Sequence contains more than one matching element.");
}
return first;
\`\`\`
- Entity Framework Core-এ \`SingleOrDefault()\` অনুবাদ করে:
  \`\`\`sql
  SELECT TOP(2) [u].[Id], [u].[Name] FROM [Users] AS [u] WHERE [u].[Email] = @email
  \`\`\`
  EF Core ডেটাবেস থেকে ইচ্ছাকৃতভাবে **TOP(2)** টি রো রিড করে। যদি ডেটাবেস ২টি রো ফেরত দেয়, তবে নিশ্চিত হওয়া যায় যে ডেটা ইউনিক নয় এবং সাথে সাথে এক্সেপশন ছুড়ে দেওয়া হয়।

---

## ভ্যালু টাইপ অস্পষ্টতা ও C# 9+ এর সমাধান

ইনটিজারের মতো ভ্যালু টাইপে \`default(int)\` হলো \`0\`। এর ফলে বিভ্রান্তি তৈরি হয়: কালেকশনে কি সত্যিই \`0\` মান ছিল, নাকি কোনো ম্যাচ খুঁজে পাওয়া যায়নি?

\`\`\`csharp
int[] numbers = { 0, 10, 20 };

// বিভ্রান্তি: ০ কি ম্যাচ পাওয়া মান নাকি ডিফল্ট ফলব্যাক?
int result = numbers.FirstOrDefault(x => x > 50); // ০ রিটার্ন করে!
\`\`\`

### সমাধানসমূহ:
১. **নালেবল ভ্যালু টাইপ প্রজেকশন**:
\`\`\`csharp
int? safeResult = numbers.Cast<int?>().FirstOrDefault(x => x > 50); // null ফেরত দেবে
\`\`\`

২. **C# 9+ / .NET 6+ কাস্টম ডিফল্ট ভ্যালু**:
\`\`\`csharp
// স্পষ্ট ডিফল্ট ফলব্যাক মান নির্ধারণ করা যায়
int found = numbers.FirstOrDefault(x => x > 50, defaultValue: -1); // -1 ফেরত দেবে
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem K (Max and Min)
*তিনটি সংখ্যা $A, B, C$ দেওয়া থাকবে। তাদের মধ্যে সর্বনিম্ন এবং সর্বোচ্চ সংখ্যাটি নির্ণয় করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে সংখ্যা তিনটি রিড করে অ্যারেতে পার্স করা।
২. অ্যারেটিকে আরোহী ক্রমে সর্ট করা।
৩. \`.First()\` দিয়ে প্রথম (ক্ষুদ্রতম) এবং \`.Last()\` দিয়ে শেষ (বৃহত্তম) উপাদান সংগ্রহ করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Linq;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        int[] numbers = input
            .Trim()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .OrderBy(x => x)
            .ToArray();

        int min = numbers.First();
        int max = numbers.Last();

        Console.WriteLine($"{min} {max}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $K = 3$ উপাদানের জন্য $\\mathcal{O}(K \\log K)$ যা কার্যত $\\mathcal{O}(1)$। অ্যারেতে \`First()\` ও \`Last()\` সরাসরি ইনডেক্স থেকে $\\mathcal{O}(1)$ সময়ে কাজ করে।
- **স্পেস কমপ্লেক্সিটি**: ৩টি উপাদানের বাফারের জন্য $\\mathcal{O}(1)$ মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Max and Min](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K) | Easy | \`First\`, \`Last\`, Min/Max boundary retrieval |
| ⚪ | Codeforces | [Assiut Sheet #1: Interval](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/S) | Easy | Range predicates, \`FirstOrDefault\` |
| ⚪ | Exercism C# | [Matching Brackets](https://exercism.org/tracks/csharp/exercises/matching-brackets) | Medium | Stack evaluation, Empty sequence verification |
| ⚪ | Exercism C# | [Nucleotide Count](https://exercism.org/tracks/csharp/exercises/nucleotide-count) | Easy | Character lookup, Single item extraction |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Max and Min",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["LINQ", "First", "Last"],
      solutionEn:
        "Sort the input numbers and extract the extreme values using First() for the minimum and Last() for the maximum.",
      solutionBn:
        "ইনপুট সংখ্যাগুলোকে সাজিয়ে First() দিয়ে ক্ষুদ্রতম এবং Last() দিয়ে বৃহত্তম সংখ্যা বের করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Interval",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/S",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["LINQ", "FirstOrDefault", "Intervals"],
      solutionEn:
        "Find the matching mathematical interval for a real number using FirstOrDefault with an Out of Intervals fallback.",
      solutionBn:
        "FirstOrDefault ব্যবহার করে বাস্তব সংখ্যার প্রযোজ্য ইন্টারভাল নির্ধারণ করুন এবং না পেলে Out of Intervals প্রদর্শন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Matching Brackets",
      url: "https://exercism.org/tracks/csharp/exercises/matching-brackets",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["LINQ", "SingleOrDefault", "Stack"],
      solutionEn:
        "Validate balanced brackets by maintaining a character stack and verifying emptiness after processing.",
      solutionBn:
        "স্ট্যাকের সাহায্যে ব্র্যাকেটের ভারসাম্য পরীক্ষা করুন এবং প্রক্রিয়াকরণ শেষে স্ট্যাক সম্পূর্ণ খালি কি না তা যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "Nucleotide Count",
      url: "https://exercism.org/tracks/csharp/exercises/nucleotide-count",
      difficulty: "EASY",
      company: "BJIT Group",
      tags: ["LINQ", "First", "Dictionary"],
      solutionEn:
        "Count occurrences of DNA nucleotides A, C, G, and T, throwing an exception for any invalid nucleotide symbol.",
      solutionBn:
        "DNA নিউক্লিওটাইড A, C, G ও T এর সংখ্যা গণনা করুন এবং কোনো অবৈধ প্রতীক পেলে এক্সেপশন ছুড়ে দিন।",
    },
  ],
};
