import type { LocalLesson } from "@/lib/lessons-data";

export const linqAggregatesLesson: LocalLesson = {
  slug: "linq-aggregates",
  titleEn: "LINQ Aggregates (Count, Sum, Aggregate)",
  titleBn: "এগ্রিগেটস (Count, Sum, Min, Max, Aggregate)",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকইউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "CORE",
  descriptionEn:
    "Mathematical aggregations, Count, Sum, Average, Min, Max, numeric overflow prevention, empty collection exceptions, and functional fold/reduce with Aggregate.",
  descriptionBn:
    "গাণিতিক এগ্রিগেশন, Count, Sum, Average, Min, Max, ওভারফ্লো প্রতিরোধ, খালি কালেকশনের এক্সেপশন আচরণ এবং Aggregate (fold/reduce)।",
  difficulty: "EASY",
  displayOrder: 9,
  prerequisites: ["linq-select"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# LINQ Aggregates in C#

LINQ aggregate operators reduce an entire \`IEnumerable<T>\` sequence into a single scalar summary value. All aggregate operators are **eager terminal operators**, enumerating the sequence immediately.

---

## Standard Math vs Universal Functional Fold (\`Aggregate\`)

### 1. Built-in Numeric Reducers:
- **\`Count()\` / \`LongCount()\`**: Enumerates elements (use \`LongCount\` for sequences exceeding $2.14 \\times 10^9$ items).
- **\`Sum()\`**: Computes the arithmetic total.
- **\`Average()\`**: Computes the arithmetic mean.
- **\`Min()\` / \`Max()\`**: Extracts boundary values.

### 2. The Universal \`Aggregate\` (Functional Fold / Reduce):
Every standard aggregator can be mathematically expressed using \`Aggregate\`. It supports three overloads:

\`\`\`csharp
public static TAccumulate Aggregate<TSource, TAccumulate, TResult>(
    this IEnumerable<TSource> source,
    TAccumulate seed,
    Func<TAccumulate, TSource, TAccumulate> func,
    Func<TAccumulate, TResult> resultSelector);
\`\`\`

\`\`\`csharp
int[] numbers = { 2, 3, 4, 5 };

// Seed = 1, Accumulator = Product
int product = numbers.Aggregate(1, (acc, next) => acc * next); // 120
\`\`\`

---

## Edge Cases: Empty Sequences & Numeric Overflow

A common source of production outages is handling aggregate calls on empty datasets or large numbers:

| Method | Behavior on Empty Non-Nullable Sequence (\`new int[0]\`) | Behavior on Empty Nullable Sequence (\`new int?[0]\`) | Overflow Risk |
| :--- | :--- | :--- | :--- |
| **\`Count()\`** | Returns \`0\` | Returns \`0\` | Wraps if $> 2^{31}-1$ (use \`LongCount\`) |
| **\`Sum()\`** | Returns \`0\` | Returns \`0\` | **Throws \`OverflowException\`** in checked context |
| **\`Average()\`** | **Throws \`InvalidOperationException\`** | Returns \`null\` | Precision loss on \`double\`/\`float\` |
| **\`Min()\` / \`Max()\`**| **Throws \`InvalidOperationException\`** | Returns \`null\` | None |
| **\`Aggregate(seed, ...)\`** | Returns \`seed\` | Returns \`seed\` | Depends on accumulator |
| **\`Aggregate(func)\`** | **Throws \`InvalidOperationException\`** | **Throws \`InvalidOperationException\`** | Depends on accumulator |

### Preventing Integer Overflow in Sum():
When summing large arrays of 32-bit integers, intermediate sums can easily exceed \`int.MaxValue\` ($2,147,483,647$):

\`\`\`csharp
int[] largeValues = { 1_500_000_000, 1_000_000_000 };

// DANGEROUS: Will overflow 32-bit signed integer boundaries!
// int badSum = largeValues.Sum();

// SAFE: Project to 64-bit integers before summing
long safeSum = largeValues.Select(x => (long)x).Sum();
\`\`\`

---

## Performance Trap: String Concatenation in Aggregate

Using \`Aggregate\` to concatenate strings causes quadratic $\\mathcal{O}(N^2)$ memory copying:

\`\`\`csharp
// INEFFICIENT: Allocates N new string objects on the heap:
string csv = words.Aggregate((acc, next) => acc + ", " + next);

// HIGH PERFORMANCE: Zero intermediary garbage allocations:
string fastCsv = string.Join(", ", words);
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem G (Summation from 1 to N)
*Given a number $N$. Print the summation of the numbers that is between $1$ and $N$ ($1 \\le N \\le 10^9$).*

#### Algorithmic Analysis
1. For $N = 10^9$, generating an \`Enumerable.Range(1, N)\` sequence would consume gigabytes of memory and take seconds.
2. The optimal mathematical solution is Gauss' formula: $S = \\frac{N(N + 1)}{2}$.
3. When using C#, computing $N(N + 1)$ with 32-bit integers will overflow for $N > 65,535$. We must evaluate using 64-bit signed integers (\`long\`).

#### C# Implementation

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (long.TryParse(input.Trim(), out long n))
        {
            // Direct mathematical closed-form evaluation preventing overflow
            long totalSum = n * (n + 1) / 2;
            Console.WriteLine(totalSum);
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, single constant-time arithmetic evaluation.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Summation from 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G) | Easy | 64-bit integer overflow, Arithmetic summation |
| ⚪ | Codeforces | [Assiut Sheet #1: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | \`Sum\`, Modulo extraction, Numerical reduction |
| ⚪ | Exercism C# | [Difference of Squares](https://exercism.org/tracks/csharp/exercises/difference-of-squares) | Easy | \`Sum\`, Mathematical reductions, Power accumulation |
| ⚪ | Exercism C# | [Largest Series Product](https://exercism.org/tracks/csharp/exercises/largest-series-product) | Medium | \`Aggregate\`, Product multiplication, Sliding windows |
`,

  contentBn: `# C# এ এগ্রিগেটস (Count, Sum, Min, Max, Aggregate)

LINQ এগ্রিগেট অপারেটরগুলো একটি সম্পূর্ণ \`IEnumerable<T>\` সিকোয়েন্সকে প্রসেস করে একটিমাত্র স্কেলার মানে রূপান্তর করে। সমস্ত এগ্রিগেট অপারেটর হলো **তাত্ক্ষণিক বা টার্মিনাল অপারেটর (Terminal Operators)**, যা কল করার সাথে সাথে সম্পূর্ণ সিকোয়েন্সটি রিড করে।

---

## সাধারণ গাণিতিক মেথড বনাম সর্বজনীন \`Aggregate\` (Fold / Reduce)

### ১. সাধারণ গাণিতিক মেথডসমূহ:
- **\`Count()\` / \`LongCount()\`**: উপাদানের সংখ্যা গণনা করে ($২.১৪ \\times ১০^৯$ এর বেশি উপাদানের জন্য \`LongCount\` ব্যবহৃত হয়)।
- **\`Sum()\`**: সমস্ত সংখ্যার যোগফল নির্ণয় করে।
- **\`Average()\`**: গাণিতিক গড় নির্ণয় করে।
- **\`Min()\` / \`Max()\`**: সর্বনিম্ন ও সর্বোচ্চ মান বের করে।

### ২. সর্বজনীন \`Aggregate\` (ফাংশনাল ফোল্ড / রিডিউস):
যেকোনো কাস্টম এগ্রিগেশন অপারেশন \`Aggregate\` এর মাধ্যমে তৈরি করা যায়। এর তিনটি ওভারলোড রয়েছে:

\`\`\`csharp
public static TAccumulate Aggregate<TSource, TAccumulate, TResult>(
    this IEnumerable<TSource> source,
    TAccumulate seed,
    Func<TAccumulate, TSource, TAccumulate> func,
    Func<TAccumulate, TResult> resultSelector);
\`\`\`

\`\`\`csharp
int[] numbers = { 2, 3, 4, 5 };

// Seed = ১, Accumulator = গুণফল
int product = numbers.Aggregate(1, (acc, next) => acc * next); // ১২০
\`\`\`

---

## খালি কালেকশন ও পূর্ণসংখ্যার ওভারফ্লো সমস্যা

প্রোডাকশন অ্যাপ্লিকেশনে খালি কালেকশন বা বড় সংখ্যার ক্ষেত্রে প্রায়শই অপ্রত্যাশিত এক্সেপশন ঘটে:

| মেথড | খালি নন-নালেবল সিকোয়েন্সে আচরণ (\`new int[0]\`) | খালি নালেবল সিকোয়েন্সে আচরণ (\`new int?[0]\`) | ওভারফ্লো ঝুঁকি |
| :--- | :--- | :--- | :--- |
| **\`Count()\`** | \`0\` রিটার্ন করে | \`0\` রিটার্ন করে | $> 2^{31}-1$ হলে \`LongCount\` প্রয়োজন |
| **\`Sum()\`** | \`0\` রিটার্ন করে | \`0\` রিটার্ন করে | চেকড কনটেক্সটে **\`OverflowException\` ছুড়ে দেয়** |
| **\`Average()\`** | **\`InvalidOperationException\` ছুড়ে দেয়** | \`null\` রিটার্ন করে | \`double\`/\`float\` এ প্রিসিশন লস |
| **\`Min()\` / \`Max()\`**| **\`InvalidOperationException\` ছুড়ে দেয়** | \`null\` রিটার্ন করে | কোনো ঝুঁকি নেই |
| **\`Aggregate(seed, ...)\`** | \`seed\` ফেরত দেয় | \`seed\` ফেরত দেয় | অ্যাকুমুলেটরের ওপর নির্ভরশীল |
| **\`Aggregate(func)\`** | **\`InvalidOperationException\` ছুড়ে দেয়** | **\`InvalidOperationException\` ছুড়ে দেয়** | অ্যাকুমুলেটরের ওপর নির্ভরশীল |

### Sum()-এ পূর্ণসংখ্যার ওভারফ্লো প্রতিরোধ:
বড় ৩২-বিট পূর্ণসংখ্যার কালেকশন যোগ করার সময় মান সহজেই \`int.MaxValue\` ($২,১৪৭,৪৮৩,৬৪৭$) অতিক্রম করে যেতে পারে:

\`\`\`csharp
int[] largeValues = { 1_500_000_000, 1_000_000_000 };

// ক্ষতিকর: ৩২-বিট বাউন্ডারি ভেঙে ঋণাত্মক বা ভুল মান দেবে!
// int badSum = largeValues.Sum();

// নিরাপদ: যোগ করার আগেই ৬৪-বিট লং ইন্টিজারে প্রজেক্ট করুন
long safeSum = largeValues.Select(x => (long)x).Sum();
\`\`\`

---

## পারফরম্যান্স ফাঁদ: Aggregate দিয়ে স্ট্রিং কনক্যাটেনেশন

\`Aggregate\` ব্যবহার করে স্ট্রিং জোড়া লাগালে মেমরিতে কোয়াড্রাটিক $\\mathcal{O}(N^2)$ মেমোরি কপি তৈরি হয়:

\`\`\`csharp
// ধীরগতির: মেমরিতে বারবার নতুন স্ট্রিং অবজেক্ট তৈরি করে:
string csv = words.Aggregate((acc, next) => acc + ", " + next);

// সেরা উপায়: কোনো অতিরিক্ত গার্বেজ ছাড়াই দ্রুত স্ট্রিং যুক্ত করে:
string fastCsv = string.Join(", ", words);
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem G (Summation from 1 to N)
*একটি সংখ্যা $N$ দেওয়া থাকবে। $1$ থেকে $N$ পর্যন্ত সকল সংখ্যার যোগফল প্রিন্ট করুন ($1 \\le N \\le 10^9$)।*

#### সমাধান বিশ্লেষণ
১. $N = 10^9$ হলে মেমরিতে কালেকশন বা লুপ চালালে টাইম লিমিট বা মেমোরি লিমিট এক্সিড হবে।
২. গাণিতিক ফর্মুলা ব্যবহার করা: $S = \\frac{N(N + 1)}{2}$।
৩. ৩২-বিট ইন্টিজারে $N(N + 1)$ গুণ করলে $N > 65,535$ হলেই ওভারফ্লো হবে, তাই অবশ্যই ৬৪-বিট \`long\` ব্যবহার করতে হবে।

#### C# সমাধান

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (long.TryParse(input.Trim(), out long n))
        {
            long totalSum = n * (n + 1) / 2;
            Console.WriteLine(totalSum);
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, একটিমাত্র গাণিতিক সমীকরণের মাধ্যমে হিসাব সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Summation from 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G) | Easy | 64-bit integer overflow, Arithmetic summation |
| ⚪ | Codeforces | [Assiut Sheet #1: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | \`Sum\`, Modulo extraction, Numerical reduction |
| ⚪ | Exercism C# | [Difference of Squares](https://exercism.org/tracks/csharp/exercises/difference-of-squares) | Easy | \`Sum\`, Mathematical reductions, Power accumulation |
| ⚪ | Exercism C# | [Largest Series Product](https://exercism.org/tracks/csharp/exercises/largest-series-product) | Medium | \`Aggregate\`, Product multiplication, Sliding windows |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Summation from 1 to N",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Math", "Overflow", "Aggregates"],
      solutionEn:
        "Compute the arithmetic sum N*(N+1)/2 using 64-bit integers to prevent numerical overflow.",
      solutionBn:
        "পূর্ণসংখ্যার ওভারফ্লো এড়াতে ৬৪-বিট লং ইন্টিজারে N*(N+1)/2 সূত্রের সাহায্যে গাণিতিক যোগফল বের করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Digits Summation",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["LINQ", "Sum", "Modulo"],
      solutionEn:
        "Extract the units digits of two long integers using modulo 10 and return their aggregated sum.",
      solutionBn:
        "মডিউলো 10 দিয়ে দুটি লং সংখ্যার একক ঘরের অঙ্ক বের করে তাদের যোগফল হিসাব করুন।",
    },
    {
      source: "Exercism C#",
      name: "Difference of Squares",
      url: "https://exercism.org/tracks/csharp/exercises/difference-of-squares",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["LINQ", "Sum", "Math"],
      solutionEn:
        "Find the difference between the square of the sum and the sum of the squares of the first N natural numbers.",
      solutionBn:
        "প্রথম N স্বাভাবিক সংখ্যার যোগফলের বর্গ এবং বর্গগুলোর যোগফলের মধ্যে পার্থক্য নির্ণয় করুন।",
    },
    {
      source: "Exercism C#",
      name: "Largest Series Product",
      url: "https://exercism.org/tracks/csharp/exercises/largest-series-product",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["LINQ", "Aggregate", "Sliding Window"],
      solutionEn:
        "Calculate the largest product for a contiguous substring of digits of length span using Aggregate multiplication.",
      solutionBn:
        "Aggregate গুণের মাধ্যমে নির্দিষ্ট দৈর্ঘ্যের সাবস্ট্রিংয়ের অঙ্কগুলোর সর্বোচ্চ গুণফল হিসাব করুন।",
    },
  ],
};
