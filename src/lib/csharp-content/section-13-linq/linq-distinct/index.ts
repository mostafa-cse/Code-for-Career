import type { LocalLesson } from "@/lib/lessons-data";

export const linqDistinctLesson: LocalLesson = {
  slug: "linq-distinct",
  titleEn: "Distinct & DistinctBy",
  titleBn: "ডিসটিংক্ট (Distinct) ও DistinctBy (C# 10)",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকইউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Deduplication via internal hash sets, streaming lazy evaluation, custom IEqualityComparer contracts, and modern .NET 6+ DistinctBy / UnionBy / IntersectBy.",
  descriptionBn:
    "ইন্টারনাল হ্যাশ সেট মেকানিজম, লেজি স্ট্রিমিং মূল্যায়ন, কাস্টম IEqualityComparer এবং আধুনিক .NET 6+ এর DistinctBy / UnionBy / IntersectBy সেট অপারেশন।",
  difficulty: "EASY",
  displayOrder: 10,
  prerequisites: ["linq-where"],
  estimatedMinutes: 15,
  lastUpdated: "Recently updated",
  contentEn: `# Distinct & DistinctBy in C#

The **\`Distinct\`** operator removes duplicates from an \`IEnumerable<T>\` sequence, emitting only unique elements. Starting with .NET 6 / C# 10, LINQ introduced **\`DistinctBy\`**, allowing deduplication based on an extracted key selector without writing boilerplate equality comparers.

---

## Under the Hood: Streaming Lazy Deduplication

Unlike \`OrderBy\` which must buffer the entire sequence before emitting the first element, **\`Distinct\` streams lazily**:

\`\`\`csharp
// Conceptual implementation inside System.Linq.Enumerable
public static IEnumerable<TSource> DistinctIterator<TSource>(
    IEnumerable<TSource> source, 
    IEqualityComparer<TSource>? comparer)
{
    var seen = new HashSet<TSource>(comparer);
    foreach (TSource element in source)
    {
        if (seen.Add(element)) // HashSet.Add returns false if already present
        {
            yield return element; // Emitted immediately!
        }
    }
}
\`\`\`

### Performance & Memory Traits:
1. **Immediate Yield**: The first element is yielded instantly without inspecting the rest of the sequence.
2. **Time Complexity**: $\\mathcal{O}(N)$ average time across $N$ elements.
3. **Space Complexity**: $\\mathcal{O}(U)$ auxiliary memory where $U$ is the number of unique elements ($U \\le N$).

---

## Custom IEqualityComparer<T> Contract

When deduplicating custom reference types without .NET 6's \`DistinctBy\`, you must implement \`IEqualityComparer<T>\`.

> **CRITICAL CLR RULE**: If \`Equals(x, y)\` returns \`true\`, their \`GetHashCode()\` values **MUST be strictly identical**. If \`GetHashCode()\` differs, the hash table places them into different buckets and never calls \`Equals()\`, resulting in duplicate leaks!

\`\`\`csharp
public class ProductComparer : IEqualityComparer<Product>
{
    public bool Equals(Product? x, Product? y)
    {
        if (ReferenceEquals(x, y)) return true;
        if (x is null || y is null) return false;
        return x.Sku == y.Sku;
    }

    public int GetHashCode(Product obj) => obj.Sku?.GetHashCode() ?? 0;
}
\`\`\`

---

## Modern .NET 6+ Set-by-Key Operators

.NET 6 introduced an entire family of set operations parameterized by key selectors:

| Operator | Functionality | Example |
| :--- | :--- | :--- |
| **\`DistinctBy\`** | Deduplicates by key | \`users.DistinctBy(u => u.Email)\` |
| **\`UnionBy\`** | Set union ($A \\cup B$) by key | \`currentStaff.UnionBy(newHires, e => e.Id)\` |
| **\`IntersectBy\`** | Set intersection ($A \\cap B$) by key | \`products.IntersectBy(activeCatalogIds, p => p.Id)\` |
| **\`ExceptBy\`** | Set difference ($A \\setminus B$) by key | \`allEmails.ExceptBy(unsubscribedList, e => e)\` |

\`\`\`csharp
record Employee(int Id, string Name, string Department);

var staff = new[]
{
    new Employee(101, "Rahim", "IT"),
    new Employee(102, "Fatima", "HR"),
    new Employee(101, "Rahim Duplicate", "Operations") // Duplicate ID
};

// Keeps the first instance encountered with Id 101
var uniqueEmployees = staff.DistinctBy(e => e.Id);
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Deduplicating and Sorting Array Elements
*Given an array of integers containing duplicates, extract all distinct elements, sort them in ascending order, and calculate the count of removed duplicate elements.*

#### Algorithmic Analysis
1. Calculate the initial count $N$.
2. Apply \`.Distinct()\` to eliminate duplicates using the internal hash set.
3. Order the resulting unique sequence using \`.OrderBy(x => x)\`.
4. Materialize into an array and compute $N - \\text{distinctCount}$.

#### C# Implementation

\`\`\`csharp
using System;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int[] rawNumbers = { 5, 2, 8, 2, 5, 1, 9, 8, 3 };

        int originalCount = rawNumbers.Length;

        int[] distinctSorted = rawNumbers
            .Distinct()
            .OrderBy(x => x)
            .ToArray();

        int duplicatesRemoved = originalCount - distinctSorted.Length;

        Console.WriteLine($"Distinct elements: {string.Join(" ", distinctSorted)}");
        Console.WriteLine($"Duplicates removed: {duplicatesRemoved}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N + U \\log U)$ where $N$ is input size and $U$ is the number of distinct elements. Deduplication takes $\\mathcal{O}(N)$ and sorting takes $\\mathcal{O}(U \\log U)$.
- **Space Complexity**: $\\mathcal{O}(U)$ auxiliary space for the \`HashSet<int>\` and result array.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Replacement](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C) | Easy | Element replacement, Value matching |
| ⚪ | Exercism C# | [Sum of Multiples](https://exercism.org/tracks/csharp/exercises/sum-of-multiples) | Medium | \`Distinct\`, Multiples deduplication, \`Sum\` |
| ⚪ | Exercism C# | [Luhn](https://exercism.org/tracks/csharp/exercises/luhn) | Medium | Character filtering, Parity transformation |
| ⚪ | Exercism C# | [Sublist](https://exercism.org/tracks/csharp/exercises/sublist) | Medium | Set containment, Equality comparisons |
`,

  contentBn: `# C# এ ডিসটিংক্ট (Distinct) ও DistinctBy (C# 10)

LINQ-এ কালেকশন থেকে ডুপ্লিকেট উপাদান বাদ দিয়ে কেবল ইউনিক উপাদানগুলো পাওয়ার জন্য **\`Distinct\`** অপারেটর ব্যবহৃত হয়। .NET 6 / C# 10 থেকে LINQ-এ **\`DistinctBy\`** যুক্ত করা হয়েছে, যার ফলে কোনো অতিরিক্ত ক্লাস বা কম্প্যারার না লিখেই নির্দিষ্ট কোনো প্রোপার্টির ভিত্তিতে ডুপ্লিকেট সরানো যায়।

---

## আন্ডার দ্য হুড: স্ট্রিমিং লেজি ডিডুপ্লিকেশন

\`OrderBy\` যেখানে প্রথম উপাদান ফেরত দেওয়ার আগেই পুরো কালেকশন মেমরিতে জমা করে, সেখানে **\`Distinct\` অলসভাবে (lazily) স্ট্রিম করে**:

\`\`\`csharp
// System.Linq.Enumerable এর অভ্যন্তরীণ ধারণাগত কোড
public static IEnumerable<TSource> DistinctIterator<TSource>(
    IEnumerable<TSource> source, 
    IEqualityComparer<TSource>? comparer)
{
    var seen = new HashSet<TSource>(comparer);
    foreach (TSource element in source)
    {
        if (seen.Add(element)) // HashSet.Add উপাদানটি নতুন হলে true ফেরত দেয়
        {
            yield return element; // সাথে সাথে কলারের কাছে পৌঁছে দেয়!
        }
    }
}
\`\`\`

### পারফরম্যান্স ও মেমোরি বৈশিষ্ট্য:
১. **তাৎক্ষণিক প্রথম উপাদান**: সম্পূর্ণ কালেকশন চেক না করেই প্রথম ইউনিক উপাদানটি সাথে সাথে পাওয়া যায়।
২. **টাইম কমপ্লেক্সিটি**: $N$ সংখ্যক উপাদানের জন্য গড়ে $\\mathcal{O}(N)$ সময় লাগে।
৩. **স্পেস কমপ্লেক্সিটি**: মেমরিতে শুধুমাত্র ইউনিক উপাদানগুলোর জন্য একটি \`HashSet\` তৈরি হয়, যার মেমোরি খরচ $\\mathcal{O}(U)$ ($U \\le N$)।

---

## কাস্টম IEqualityComparer<T> এর শর্তসমূহ

.NET 6 এর পূর্বে কাস্টম ক্লাসের ডুপ্লিকেট দূর করতে \`IEqualityComparer<T>\` ইমপ্লিমেন্ট করতে হতো।

> **CLR এর অলঙ্ঘনীয় নিয়ম**: দুটি অবজেক্টের \`Equals(x, y)\` যদি \`true\` হয়, তবে তাদের \`GetHashCode()\` মান অবশ্যই **একই হতে হবে**। যদি হ্যাশকোড ভিন্ন হয়, তবে তারা হ্যাশ সেটের ভিন্ন বাকেটে চলে যাবে এবং \`Equals()\` কখনো কলই হবে না—ফলে ডুপ্লিকেট থেকে যাবে!

\`\`\`csharp
public class ProductComparer : IEqualityComparer<Product>
{
    public bool Equals(Product? x, Product? y)
    {
        if (ReferenceEquals(x, y)) return true;
        if (x is null || y is null) return false;
        return x.Sku == y.Sku;
    }

    public int GetHashCode(Product obj) => obj.Sku?.GetHashCode() ?? 0;
}
\`\`\`

---

## আধুনিক .NET 6+ সেট-বাই-কি অপারেটরসমূহ

.NET 6-এ কী-সিলেক্টরের ওপর ভিত্তি করে কাজ করার জন্য সম্পূর্ণ একটি অপারেটর পরিবার যুক্ত করা হয়েছে:

| অপারেটর | কার্যকারিতা | উদাহরণ |
| :--- | :--- | :--- |
| **\`DistinctBy\`** | কী-এর ভিত্তিতে ডুপ্লিকেট দূর করে | \`users.DistinctBy(u => u.Email)\` |
| **\`UnionBy\`** | কী-এর ভিত্তিতে সংযোগ ($A \\cup B$) | \`currentStaff.UnionBy(newHires, e => e.Id)\` |
| **\`IntersectBy\`** | কী-এর ভিত্তিতে সাধারণ উপাদান ($A \\cap B$) | \`products.IntersectBy(activeCatalogIds, p => p.Id)\` |
| **\`ExceptBy\`** | কী-এর ভিত্তিতে বিয়োগ ($A \\setminus B$) | \`allEmails.ExceptBy(unsubscribedList, e => e)\` |

\`\`\`csharp
record Employee(int Id, string Name, string Department);

var staff = new[]
{
    new Employee(101, "Rahim", "IT"),
    new Employee(102, "Fatima", "HR"),
    new Employee(101, "Rahim Duplicate", "Operations")
};

// Id এর ভিত্তিতে ডুপ্লিকেট বাদ দেয় (প্রথমটি বজায় রাখে)
var uniqueEmployees = staff.DistinctBy(e => e.Id);
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ডুপ্লিকেট অপসারণ ও সর্টিং
*একটি ইন্টিজার অ্যারে দেওয়া আছে যাতে ডুপ্লিকেট সংখ্যা রয়েছে। সমস্ত ইউনিক সংখ্যা আলাদা করে আরোহী ক্রমে সাজান এবং কতটি ডুপ্লিকেট সংখ্যা বাদ পড়ল তা হিসাব করুন।*

#### সমাধান বিশ্লেষণ
১. মূল অ্যারের দৈর্ঘ্য সংরক্ষণ করা।
২. \`.Distinct()\` দিয়ে হ্যাশ সেটের সাহায্যে ইউনিক উপাদান বের করা।
৩. \`.OrderBy(x => x)\` দিয়ে আরোহী ক্রমে সাজানো।
৪. উপাদান সংখ্যা তুলনা করে অপসারিত ডুপ্লিকেটের সংখ্যা বের করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Linq;

public class Program
{
    public static void Main()
    {
        int[] rawNumbers = { 5, 2, 8, 2, 5, 1, 9, 8, 3 };

        int originalCount = rawNumbers.Length;

        int[] distinctSorted = rawNumbers
            .Distinct()
            .OrderBy(x => x)
            .ToArray();

        int duplicatesRemoved = originalCount - distinctSorted.Length;

        Console.WriteLine($"Distinct elements: {string.Join(" ", distinctSorted)}");
        Console.WriteLine($"Duplicates removed: {duplicatesRemoved}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N + U \\log U)$, যেখানে $N$ ইনপুটের সাইজ এবং $U$ হলো ইউনিক উপাদান সংখ্যা। ডুপ্লিকেট দূর করতে $\\mathcal{O}(N)$ ও ইউনিক উপাদান সর্ট করতে $\\mathcal{O}(U \\log U)$ সময় লাগে।
- **স্পেস কমপ্লেক্সিটি**: ইউনিক উপাদান সংরক্ষণে $\\mathcal{O}(U)$ মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Replacement](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C) | Easy | Element replacement, Value matching |
| ⚪ | Exercism C# | [Sum of Multiples](https://exercism.org/tracks/csharp/exercises/sum-of-multiples) | Medium | \`Distinct\`, Multiples deduplication, \`Sum\` |
| ⚪ | Exercism C# | [Luhn](https://exercism.org/tracks/csharp/exercises/luhn) | Medium | Character filtering, Parity transformation |
| ⚪ | Exercism C# | [Sublist](https://exercism.org/tracks/csharp/exercises/sublist) | Medium | Set containment, Equality comparisons |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Replacement",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["LINQ", "Select", "Transformation"],
      solutionEn:
        "Replace positive numbers with 1 and negative numbers with 2 using a ternary projection over the array.",
      solutionBn:
        "টার্নারি প্রজেকশন দিয়ে অ্যারেতে ধনাত্মক সংখ্যাকে 1 এবং ঋণাত্মক সংখ্যাকে 2 দিয়ে প্রতিস্থাপন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Sum of Multiples",
      url: "https://exercism.org/tracks/csharp/exercises/sum-of-multiples",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["LINQ", "Distinct", "Sum"],
      solutionEn:
        "Generate multiples of divisors below a limit, eliminate duplicate overlapping multiples with Distinct, and sum them.",
      solutionBn:
        "নির্দিষ্ট সীমার নিচে গুণিতকগুলো তৈরি করুন, Distinct দিয়ে ডুপ্লিকেট বাদ দিন এবং তাদের যোগফল নির্ণয় করুন।",
    },
    {
      source: "Exercism C#",
      name: "Luhn",
      url: "https://exercism.org/tracks/csharp/exercises/luhn",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["LINQ", "Where", "Select"],
      solutionEn:
        "Validate identification numbers using the Luhn checksum algorithm with digit doubling and modulo 10 verification.",
      solutionBn:
        "লুন চেকসাম অ্যালগরিদম দিয়ে নির্দিষ্ট অঙ্ক দ্বিগুণ করে এবং modulo 10 দিয়ে আইডেন্টিফিকেশন নম্বর যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "Sublist",
      url: "https://exercism.org/tracks/csharp/exercises/sublist",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["LINQ", "Distinct", "Collections"],
      solutionEn:
        "Classify relationship between two lists as equal, sublist, superlist, or unequal using sequence matching.",
      solutionBn:
        "দুটি লিস্টের উপাদানগুলো তুলনা করে তাদের সম্পর্ক সমান, সাবলিস্ট, সুপারলিস্ট বা অসমান হিসেবে চিহ্নিত করুন।",
    },
  ],
};
