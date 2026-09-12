import type { LocalLesson } from "@/lib/lessons-data";

export const linqDeferredExecutionLesson: LocalLesson = {
  slug: "linq-deferred-execution",
  titleEn: "Deferred Execution vs Immediate Execution",
  titleBn: "ডিফার্ড এক্সিকিউশন বনাম তাৎক্ষণিক এক্সিকিউশন",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকইউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "CORE",
  descriptionEn:
    "Streaming vs buffering deferred operators, multiple enumeration hazards (CA1851), closure mutation traps, and safe snapshotting with ToList.",
  descriptionBn:
    "স্ট্রিমিং বনাম বাফারিং ডিফার্ড অপারেটর, একাধিকবার কুয়েরি এক্সিকিউশনের বিপদ (CA1851), ক্লোজার মিউটেশন বাগ ও ToList দিয়ে সেফ স্ন্যাপশটিং।",
  difficulty: "MEDIUM",
  displayOrder: 12,
  prerequisites: ["linq-where"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Deferred Execution vs Immediate Execution in C#

Every LINQ operator falls strictly into one of two operational categories: **Deferred (Lazy) Execution** or **Immediate (Eager) Execution**. Mastering this distinction is fundamental to writing performant, bug-free enterprise applications in .NET.

---

## The LINQ Execution Spectrum

\`\`\`
                     ┌──────────────────────────────────────────────┐
                     │            LINQ Query Execution              │
                     └──────────────────────┬───────────────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
    Deferred (Lazy) Execution                                Immediate (Eager) Execution
  (Evaluates only upon iteration)                           (Executes immediately on call)
               │                                                         │
       ┌───────┴───────┐                                         ┌───────┴───────┐
       ▼               ▼                                         ▼               ▼
   Streaming       Buffering                                 Materializers    Aggregators
(Where, Select, (OrderBy, GroupBy,                        (ToList, ToArray, (Count, Sum, Any,
 Take, Skip)     Distinct, Reverse)                        ToDictionary)    First, Single)
\`\`\`

### 1. Deferred Streaming Operators:
- **Examples**: \`Where\`, \`Select\`, \`SelectMany\`, \`Take\`, \`Skip\`.
- **Mechanics**: Elements are pulled one-by-one upon each \`MoveNext()\` invocation. Memory overhead is $\\mathcal{O}(1)$.

### 2. Deferred Buffering Operators:
- **Examples**: \`OrderBy\`, \`GroupBy\`, \`Distinct\`, \`Reverse\`.
- **Mechanics**: Execution is still deferred until enumerated, but upon the first \`MoveNext()\` call, the **entire sequence is buffered into memory**.

### 3. Immediate Terminal Operators:
- **Examples**: \`ToList()\`, \`ToArray()\`, \`Count()\`, \`Sum()\`, \`First()\`.
- **Mechanics**: Traverses the pipeline immediately, consuming the underlying source and producing a static collection or scalar value.

---

## The Multiple Enumeration Hazard (CA1851)

Modern .NET analyzers flag code warning **CA1851: Possible multiple enumeration of IEnumerable collection**:

\`\`\`csharp
public async Task ProcessOrdersAsync(IEnumerable<Order> orders)
{
    // CATASTROPHIC BUG: Multiple Enumeration!
    if (orders.Any())              // Enumeration 1: Hits DB or recalculates!
    {
        int total = orders.Count(); // Enumeration 2: Hits DB AGAIN!
        foreach (var o in orders)   // Enumeration 3: Hits DB A THIRD TIME!
        {
            await ShipAsync(o);
        }
    }
}
\`\`\`

### Consequences of Multiple Enumeration:
1. **Redundant Network I/O**: Queries are re-sent to the SQL server or REST API multiple times.
2. **Side-Effect Re-Execution**: Any side effects embedded in custom iterators fire repeatedly.
3. **Stream Exhaustion**: Non-rewindable streams (e.g., \`NetworkStream\` or gRPC response streams) will throw an exception on the second pass.

### The Fix: Materialize Early via ToList() / ToArray()
\`\`\`csharp
public async Task ProcessOrdersAsync(IEnumerable<Order> source)
{
    // Snapshot into memory ONCE
    var orders = source.ToList();

    if (orders.Count > 0)
    {
        int total = orders.Count; // O(1) property lookup
        foreach (var o in orders)
        {
            await ShipAsync(o);
        }
    }
}
\`\`\`

---

## The Closure Mutation Trap

Because deferred queries evaluate during iteration, mutations to captured closure variables modify query behavior unexpectedly:

\`\`\`csharp
int multiplier = 2;
var numbers = new[] { 1, 2, 3 };

// Query defined, but NOT executed yet
var query = numbers.Select(x => x * multiplier);

multiplier = 10; // Variable mutated BEFORE enumeration!

// Enumeration happens HERE:
foreach (var n in query)
{
    Console.Write($"{n} "); // Prints: 10 20 30 (NOT 2 4 6!)
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem C (Simple Calculator)
*Given two numbers $X$ and $Y$. Print summation, multiplication, and subtraction using standard algebraic evaluation.*

#### Algorithmic Analysis
1. Read space-separated integers $X$ and $Y$.
2. In competitive programming and high-throughput pipelines, deferred queries can be composed, but numeric calculations should be evaluated eagerly into 64-bit integers to prevent re-computation and overflow.

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

        string[] tokens = input.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (tokens.Length < 2)
        {
            return;
        }

        long x = long.Parse(tokens[0]);
        long y = long.Parse(tokens[1]);

        // Eager evaluation of arithmetic operations
        long sum = x + y;
        long mul = x * y;
        long sub = x - y;

        Console.WriteLine($"{x} + {y} = {sum}");
        Console.WriteLine($"{x} * {y} = {mul}");
        Console.WriteLine($"{x} - {y} = {sub}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, immediate arithmetic execution.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Simple Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C) | Easy | Immediate evaluation, 64-bit arithmetic |
| ⚪ | Codeforces | [Assiut Sheet #1: Age in Days](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/R) | Easy | Modulo decomposition, Eager execution |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Medium | State mutation, Thread safety, Snapshotting |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | State machines, Instruction stream evaluation |
`,

  contentBn: `# C# এ ডিফার্ড এক্সিকিউশন বনাম তাৎক্ষণিক এক্সিকিউশন

LINQ-এর প্রতিটি অপারেটর কঠোরভাবে দুটি ক্যাটাগরির যেকোনো একটিতে পড়ে: **ডিফার্ড বা দেরিতে কার্যকর (Deferred / Lazy Execution)** অথবা **তাৎক্ষণিক কার্যকর (Immediate / Eager Execution)**। .NET এন্টারপ্রাইজ অ্যাপ্লিকেশনে উচ্চ পারফরম্যান্স এবং বাগ-মুক্ত কোড লেখার জন্য এই পার্থক্য বোঝা অপরিহার্য।

---

## LINQ এক্সিকিউশন স্পেকট্রাম

\`\`\`
                     ┌──────────────────────────────────────────────┐
                     │            LINQ Query Execution              │
                     └──────────────────────┬───────────────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
    Deferred (Lazy) Execution                                Immediate (Eager) Execution
  (ইটারেশনের সময় কার্যকর হয়)                                  (কল করার সাথে সাথে কার্যকর হয়)
               │                                                         │
       ┌───────┴───────┐                                         ┌───────┴───────┐
       ▼               ▼                                         ▼               ▼
   Streaming       Buffering                                 Materializers    Aggregators
(Where, Select, (OrderBy, GroupBy,                        (ToList, ToArray, (Count, Sum, Any,
 Take, Skip)     Distinct, Reverse)                        ToDictionary)    First, Single)
\`\`\`

### ১. ডিফার্ড স্ট্রিমিং অপারেটরসমূহ:
- **উদাহরণ**: \`Where\`, \`Select\`, \`SelectMany\`, \`Take\`, \`Skip\`।
- **কার্যপদ্ধতি**: কলার যখন \`MoveNext()\` কল করে, তখন উপাদানগুলো একটি একটি করে প্রসেস হয়। অতিরিক্ত মেমোরি খরচ $\\mathcal{O}(1)$।

### ২. ডিফার্ড বাফারিং অপারেটরসমূহ:
- **উদাহরণ**: \`OrderBy\`, \`GroupBy\`, \`Distinct\`, \`Reverse\`।
- **কার্যপদ্ধতি**: এদের কার্যকর হওয়াও ইটারেশন পর্যন্ত পিছিয়ে থাকে, কিন্তু প্রথম উপাদান চাওয়ার সাথে সাথে **সম্পূর্ণ কালেকশন মেমরিতে জমা বা বাফার** করে ফেলে।

### ৩. তাৎক্ষণিক টার্মিনাল অপারেটরসমূহ:
- **উদাহরণ**: \`ToList()\`, \`ToArray()\`, \`Count()\`, \`Sum()\`, \`First()\`।
- **কার্যপদ্ধতি**: মেথড কল করার সাথে সাথে লুপ চলে যায় এবং মেমরিতে একটি নির্দিষ্ট কালেকশন বা একক স্কেলার ভ্যালু রিটার্ন করে।

---

## একাধিকবার লুপ ঘোরার পারফরম্যান্স ফাঁদ (CA1851)

আধুনিক .NET অ্যানালাইজার কোডে সতর্কবার্তা দেয় **CA1851: Possible multiple enumeration of IEnumerable collection**:

\`\`\`csharp
public async Task ProcessOrdersAsync(IEnumerable<Order> orders)
{
    // মারাত্মক ভুল: একাধিকবার এক্সিকিউশন!
    if (orders.Any())              // ১ম বার: ডেটাবেসে কুয়েরি চালায়!
    {
        int total = orders.Count(); // ২য় বার: আবার পুরো কুয়েরি চালায়!
        foreach (var o in orders)   // ৩য় বার: ৩য় বারের মতো ডেটা রিড করে!
        {
            await ShipAsync(o);
        }
    }
}
\`\`\`

### একাধিকবার এক্সিকিউশনের কুফল:
১. **অতিরিক্ত নেটওয়ার্ক I/O**: একই কুয়েরি বারবার ডেটাবেস সার্ভারে পাঠানো হয়।
২. **পার্শ্বপ্রতিক্রিয়ার পুনরাবৃত্তি**: কাস্টম মেথডের ভেতরের লজিক বারবার অপ্রয়োজনীয়ভাবে চলে।
৩. **স্ট্রিম নিষ্কাশন**: যেসব স্ট্রিম রিওয়াইন্ড করা যায় না (যেমন \`NetworkStream\`), সেগুলো দ্বিতীয়বার পড়তে গেলে ক্র্যাশ করে।

### সমাধান: ToList() দিয়ে একবারেই মেমরিতে সেভ করা
\`\`\`csharp
public async Task ProcessOrdersAsync(IEnumerable<Order> source)
{
    // মেমরিতে একবারেই স্ন্যাপশট নিয়ে নেওয়া
    var orders = source.ToList();

    if (orders.Count > 0)
    {
        int total = orders.Count; // O(1) প্রোপার্টি রিড
        foreach (var o in orders)
        {
            await ShipAsync(o);
        }
    }
}
\`\`\`

---

## ক্লোজার মিউটেশন ট্র্যাপ (Closure Mutation Trap)

যেহেতু ডিফার্ড কুয়েরি লুপ ঘোরার সময় কার্যকর হয়, তাই লুপ ঘোরার আগে কোনো ক্যাপচার করা ভেরিয়েবল পরিবর্তন করলে কুয়েরির আউটপুট অপ্রত্যাশিতভাবে বদলে যায়:

\`\`\`csharp
int multiplier = 2;
var numbers = new[] { 1, 2, 3 };

// কুয়েরি ডিফাইন করা হয়েছে, কিন্তু এখনও এক্সিকিউট হয়নি
var query = numbers.Select(x => x * multiplier);

multiplier = 10; // লুপ চালানোর আগেই মান পরিবর্তন!

// এক্সিকিউশন শুরু হলো এখানে:
foreach (var n in query)
{
    Console.Write($"{n} "); // প্রিন্ট করবে: 10 20 30 (2 4 6 নয়!)
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem C (Simple Calculator)
*দুটি সংখ্যা $X$ এবং $Y$ দেওয়া থাকবে। তাদের যোগফল, গুণফল ও বিয়োগফল প্রিন্ট করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে সংখ্যা $X$ এবং $Y$ রিড করা।
২. গুণফলের ওভারফ্লো এড়াতে ৬৪-বিট ইন্টিজার (\`long\`) ব্যবহার করে তাৎক্ষণিক গাণিতিক ফলাফল নির্ণয় করা।

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

        string[] tokens = input.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (tokens.Length < 2)
        {
            return;
        }

        long x = long.Parse(tokens[0]);
        long y = long.Parse(tokens[1]);

        long sum = x + y;
        long mul = x * y;
        long sub = x - y;

        Console.WriteLine($"{x} + {y} = {sum}");
        Console.WriteLine($"{x} * {y} = {mul}");
        Console.WriteLine($"{x} - {y} = {sub}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, তাৎক্ষণিক গাণিতিক অপারেশন।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Simple Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C) | Easy | Immediate evaluation, 64-bit arithmetic |
| ⚪ | Codeforces | [Assiut Sheet #1: Age in Days](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/R) | Easy | Modulo decomposition, Eager execution |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Medium | State mutation, Thread safety, Snapshotting |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | State machines, Instruction stream evaluation |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Simple Calculator",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Math", "Evaluation", "Eager"],
      solutionEn:
        "Eagerly calculate arithmetic summation, multiplication, and subtraction using 64-bit integers to prevent overflow.",
      solutionBn:
        "পূর্ণসংখ্যার ওভারফ্লো এড়াতে ৬৪-বিট লং ইন্টিজারে যোগ, গুণ ও বিয়োগফল তাৎক্ষণিকভাবে হিসাব করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Age in Days",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/R",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Math", "Modulo", "Decomposition"],
      solutionEn:
        "Decompose total days into years, months, and remaining days using integer division and modulo operations.",
      solutionBn:
        "ইন্টিজার ভাগ ও মডিউলো অপারেশনের সাহায্যে মোট দিনকে বছর, মাস ও অবশিষ্ট দিনে রূপান্তর করুন।",
    },
    {
      source: "Exercism C#",
      name: "Bank Account",
      url: "https://exercism.org/tracks/csharp/exercises/bank-account",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Concurrency", "State", "Locking"],
      solutionEn:
        "Manage bank balance transactions safely across concurrent threads using synchronization locks.",
      solutionBn:
        "সিনক্রোনাইজেশন লকের মাধ্যমে একাধিক থ্রেডের মধ্যে ব্যাংক অ্যাকাউন্টের ব্যালেন্স নিরাপদে পরিচালনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Robot Simulator",
      url: "https://exercism.org/tracks/csharp/exercises/robot-simulator",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["State Machine", "Simulation", "Streams"],
      solutionEn:
        "Simulate robot movement and orientation across a 2D coordinate grid according to an instruction stream.",
      solutionBn:
        "নির্দেশনা সিকোয়েন্সের ওপর ভিত্তি করে দ্বিমাত্রিক গ্রিডে রোবটের অবস্থান ও দিক পরিবর্তন সিমুলেট করুন।",
    },
  ],
};
