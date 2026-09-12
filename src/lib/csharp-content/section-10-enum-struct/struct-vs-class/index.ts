import type { LocalLesson } from "@/lib/lessons-data";

export const structVsClassLesson: LocalLesson = {
  slug: "struct-vs-class",
  titleEn: "Struct vs Class Architecture",
  titleBn: "স্ট্রাকট বনাম ক্লাস আর্কিটেকচার ও নির্বাচন নীতি",
  categoryEn: "10. enum & struct",
  categoryBn: "১০. এনাম ও স্ট্রাকট",
  categoryDescEn:
    "Lightweight custom value types in C#: strongly-typed enumerations, bitwise [Flags], readonly structs, and struct vs class memory tradeoffs.",
  categoryDescBn:
    "সি# এ হালকা কাস্টম ভ্যালু টাইপ: এনাম, বিটওয়াইজ [Flags], readonly স্ট্রাকট এবং স্ট্রাকট বনাম ক্লাস মেমোরি পার্থক্য।",
  categoryPriority: "CORE",
  descriptionEn:
    "Architectural comparison: value vs reference semantics, stack vs heap, 16-byte guideline, cache locality, record structs, and GC pressure.",
  descriptionBn:
    "ভ্যালু বনাম রেফারেন্স সেমান্টিক্স, স্ট্যাক বনাম হিপ, ১৬-বাইট মেমোরি সীমা, ক্যাশ লোকালিটি, রেকর্ড স্ট্রাকট এবং জিসি প্রেসার মুক্ত ডিজাইন।",
  difficulty: "MEDIUM",
  displayOrder: 4,
  prerequisites: ["struct-basics"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Struct vs Class Architecture in C#

Deciding whether to design a data model as a \`struct\` or a \`class\` is one of the most critical architectural decisions in .NET systems design.

Choosing incorrectly can either introduce crippling Garbage Collection (GC) pauses under high load or degrade CPU cache performance due to excessive copying of large value types.

---

## Architectural Comparison Matrix

| Dimension | \`struct\` (Value Type) | \`class\` (Reference Type) |
| :--- | :--- | :--- |
| **Memory Allocation** | In-place (Stack, or embedded inside parent class/array). | **Managed Heap** (always requires memory allocation pointer). |
| **Passing Semantics** | **Pass-by-value**: Copies entire data payload byte-by-byte. | **Pass-by-reference**: Copies an 8-byte memory pointer (on 64-bit). |
| **Object Header Overhead** | **0 bytes**. Raw data only. | **16 bytes per instance** (8B SyncBlock Index + 8B MethodTable Pointer). |
| **Garbage Collection** | **Zero GC pressure** when stack-allocated. | Creates objects that must be traced, promoted, and swept by GC. |
| **Inheritance** | Cannot inherit from classes or structs (implements interfaces only). | Full single-class OOP inheritance hierarchy supported. |
| **Default State** | Bitwise zero (\`0\`, \`false\`, \`null\` for fields). | Reference pointer is \`null\` (\`NullReferenceException\` risk). |
| **Lifecycle** | Destroyed immediately when stack frame pops. | Retained until garbage collected across Gen 0, Gen 1, or Gen 2. |

---

## The Microsoft Framework Design Guidelines (4-Point Test)

According to official Microsoft .NET architecture standards, you should define a type as a \`struct\` **ONLY IF IT SATISFIES ALL FOUR OF THE FOLLOWING CRITERIA**:

1. **Logical Single Value**: It logically represents a single atomic value, similar to primitive types (e.g. \`DateTime\`, \`Guid\`, \`decimal\`, \`Vector3\`, \`Complex\`).
2. **Small Instance Size ($\le 16$ bytes)**: Passing a struct larger than 16 bytes by value is slower than copying a 64-bit (8-byte) reference pointer.
3. **Immutable**: It should be declared as a \`readonly struct\`. Mutable structs cause subtle state-loss bugs when copies are modified.
4. **Infrequent Boxing**: It will not be repeatedly cast to \`object\`, stored in non-generic collections, or passed to APIs accepting \`IComparable\` as an interface.

> **If any of these 4 criteria are not satisfied, design it as a \`class\`!**

---

## Memory Contiguity & CPU Cache Locality

Consider storing 1,000,000 coordinates in memory:

\`\`\`
1. Struct Array (PointStruct[]):
   [ (X,Y) | (X,Y) | (X,Y) | (X,Y) | ... ]
   - 1 single contiguous heap allocation for the array.
   - High spatial locality: CPU pre-fetches contiguous cache lines (L1/L2/L3 cache friendly).
   - Zero GC overhead for the items.

2. Class Array (PointClass[]):
   [ Ptr1 | Ptr2 | Ptr3 | Ptr4 | ... ]
      │      │      │      │
      ▼      ▼      ▼      ▼
    Heap1  Heap2  Heap3  Heap4 (Scattered all over RAM)
   - 1,000,001 heap allocations! (1 array + 1,000,000 objects).
   - 16 MB wasted purely on object headers (16 bytes * 1,000,000).
   - High cache misses (pointer chasing across memory).
   - Heavy GC collection pauses.
\`\`\`

---

## Modern C# 10+: \`record struct\` vs \`record class\`

C# 10 introduced **\`record struct\`**, bridging the gap between value-type performance and record ergonomics:

\`\`\`csharp
// Immutable value type with automatic value equality, ToString(), and 'with' expressions
public readonly record struct GeoCoordinate(double Latitude, double Longitude);

var p1 = new GeoCoordinate(23.8103, 90.4125);
var p2 = p1 with { Latitude = 24.0000 }; // Non-destructive mutation
Console.WriteLine(p1 == p2); // False (Value equality)
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem R (Age in Days)
*Given a person's age in total days $N$. Calculate the number of years, months, and days, assuming a year has 365 days and a month has 30 days. Model the calculation using an immutable value-type struct.*

#### Architectural Analysis
1. An age duration consists of 3 integers: \`Years\`, \`Months\`, \`Days\` ($3 \\times 4 = 12$ bytes $\\le 16$ bytes).
2. It represents a single atomic value.
3. It should be immutable (\`readonly struct\`).
4. Stack allocation provides instantaneous results without GC overhead.

#### C# Implementation

\`\`\`csharp
using System;

public readonly struct TimeDecomposition
{
    public int Years { get; }
    public int Months { get; }
    public int Days { get; }

    public TimeDecomposition(int totalDays)
    {
        Years = totalDays / 365;
        int remainingAfterYears = totalDays % 365;

        Months = remainingAfterYears / 30;
        Days = remainingAfterYears % 30;
    }
}

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (int.TryParse(input.Trim(), out int totalDays))
        {
            TimeDecomposition age = new TimeDecomposition(totalDays);
            Console.WriteLine($"{age.Years} years");
            Console.WriteLine($"{age.Months} months");
            Console.WriteLine($"{age.Days} days");
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, integer division and modulo operations execute in constant time.
- **Space Complexity**: $\\mathcal{O}(1)$, the 12-byte \`TimeDecomposition\` struct is stored directly in the method stack frame with zero heap allocation.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Age in Days](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/R) | Easy | \`readonly struct\`, Division/Modulo, Zero GC allocation |
| ⚪ | Codeforces | [Assiut Sheet #1: Difference](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D) | Easy | Primitive value arithmetic, Long integers, Expression evaluation |
| ⚪ | Exercism C# | [Hyper-Optimized Telemetry](https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry) | Medium | Value type memory layout, Struct packing, Telemetry buffering |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Collection modeling, Immutable structures, Linq integration |
`,

  contentBn: `# C# এ স্ট্রাকট বনাম ক্লাস আর্কিটেকচার ও নির্বাচন নীতি

একটি ডেটা মডেলকে \`struct\` হিসেবে তৈরি করবেন নাকি \`class\` হিসেবে ডিজাইন করবেন—এটি .NET সিস্টেম আর্কিটেকচারের সবচেয়ে গুরুত্বপূর্ণ প্রশ্নগুলোর অন্যতম।

ভুল সিদ্ধান্তের কারণে একদিকে যেমন অপ্রয়োজনীয় মেমোরি হিপিং এবং গার্বেজ কালেকশন (GC) এর কারণে অ্যাপ্লিকেশনে ল্যাগ তৈরি হতে পারে, অন্যদিকে বড় স্ট্রাকট বারবার কপি হওয়ার ফলে সিপিইউ ক্যাশ পারফরম্যান্স মারাত্মক ক্ষতিগ্রস্ত হতে পারে।

---

## পূর্ণাঙ্গ আর্কিটেকচারাল তুলনা

| মাত্রা / বৈশিষ্ট্য | \`struct\` (ভ্যালু টাইপ) | \`class\` (রেফারেন্স টাইপ) |
| :--- | :--- | :--- |
| **মেমোরি অবস্থান** | ইন-প্লেস (স্ট্যাকে অথবা ক্লাসের ভেতর এমবেডেড)। | **ম্যানেজড হিপ** (সবসময় মেমোরি পয়েন্টার বরাদ্দ প্রয়োজন)। |
| **পাসিং পদ্ধতি** | **পাস-বাই-ভ্যালু**: মেমোরির প্রতিটি বাইট হুবহু কপি হয়। | **পাস-বাই-রেফারেন্স**: কেবল ৮-বাইটের মেমোরি অ্যাড্রেস বা পয়েন্টার কপি হয়। |
| **অবজেক্ট হেডার খরচ** | **০ বাইট**। শুধু মূল ডেটা সংরক্ষিত হয়। | **প্রতিটি অবজেক্টে ১৬ বাইট অপচয়** (SyncBlock + MethodTable)। |
| **গার্বেজ কালেকশন** | স্ট্যাকে থাকলে **জিরো GC ওভারহেড**। | তৈরি হওয়া প্রতিটি অবজেক্ট GC দ্বারা মনিটর ও ক্লিয়ার হয়। |
| **ইনহেরিটেন্স** | কোনো ক্লাস বা স্ট্রাকট থেকে ইনহেরিট করতে পারে না। | অবজেক্ট ওরিয়েন্টেড একক ইনহেরিটেন্স সম্পূর্ণ সমর্থিত। |
| **ডিফল্ট মান** | বিটওয়াইজ শূন্য (\`0\`, \`false\`, \`null\`)। | রেফারেন্স নাল থাকে (\`NullReferenceException\` এর ঝুঁকি)। |
| **জীবনকাল** | মেথডের স্ট্যাক ফ্রেম শেষ হওয়ার সাথে সাথে বিলুপ্ত হয়। | GC সুইপ না করা পর্যন্ত হিপে অবস্থান করে। |

---

## মাইক্রোসফট ফ্রেমওয়ার্ক ডিজাইন গাইডলাইনের ৪-দফা পরীক্ষা

অফিসিয়াল .NET আর্কিটেকচার নিয়ম অনুযায়ী, কোনো টাইপকে \`struct\` হিসেবে তৈরি করতে হলে তাকে **একযোগে নিচের ৪টি শর্তই পূরণ করতে হবে**:

১. **একক পারমাণবিক মান (Logical Single Value)**: এটি প্রিমিটিভ টাইপের মতো একটি অবিভাজ্য মান নির্দেশ করে (যেমন: \`DateTime\`, \`Guid\`, \`Vector3\`, \`Point\`)।
২. **ছোট মেমোরি সাইজ ($\le ১৬$ বাইট)**: ১৬ বাইটের বেশি বড় স্ট্রাকট ভ্যালুতে কপি করা ৮ বাইটের পয়েন্টার কপি করার চেয়ে বেশি সময় নেয়।
৩. **ইমিউটেবল (Immutable)**: এটিকে অবশ্যই \`readonly struct\` হতে হবে যাতে ডেটা পরিবর্তন করা না যায়।
৪. **কম বক্সিং (Infrequent Boxing)**: এটিকে বারবার \`object\`-এ রূপান্তর বা নন-জেনেরিক কালেকশনে রাখা যাবে না।

> **উপরের যেকোনো একটি শর্ত অপূর্ণ থাকলে সেটিকে অবশ্যই \`class\` হিসেবে তৈরি করুন!**

---

## মেমোরি কনটিগুইটি ও সিপিইউ ক্যাশ পারফরম্যান্স

মেমোরিতে ১০,০০,০০০ স্থানাঙ্ক সংরক্ষণের পার্থক্য লক্ষ করুন:

\`\`\`
১. Struct Array (PointStruct[]):
   [ (X,Y) | (X,Y) | (X,Y) | (X,Y) | ... ]
   - সম্পূর্ণ অ্যারির জন্য মেমোরিতে মাত্র ১টি দীর্ঘ হিপ অ্যালোকেশন।
   - চমৎকার ক্যাশ লোকালিটি: সিপিইউ একবারে সম্পূর্ণ ক্যাশ লাইন L1/L2 ক্যাশে নিয়ে আসে।
   - উপাদানগুলোর জন্য কোনো GC ওভারহেড নেই।

২. Class Array (PointClass[]):
   [ Ptr1 | Ptr2 | Ptr3 | Ptr4 | ... ]
      │      │      │      │
      ▼      ▼      ▼      ▼
    Heap1  Heap2  Heap3  Heap4 (র‍্যামের বিভিন্ন জায়গায় ছড়ানো)
   - ১০,০০,০০১টি পৃথক মেমোরি অ্যালোকেশন!
   - শুধুমাত্র অবজেক্ট হেডারের পেছনেই ১৬ মেগাবাইট মেমোরি অপচয়।
   - প্রতিটি পয়েন্টার খুঁজতে গিয়ে বারবার সিপিইউ ক্যাশ মিস ঘটে।
   - গার্বেজ কালেক্টরের ওপর মারাত্মক চাপ তৈরি হয়।
\`\`\`

---

## আধুনিক C# 10+: \`record struct\` বনাম \`record class\`

সি# ১০ সংস্করণে যুক্ত হওয়া **\`record struct\`** ভ্যালু টাইপ পারফরম্যান্সের সাথে রেকর্ডের সুবিধাসমূহ প্রদান করে:

\`\`\`csharp
public readonly record struct GeoCoordinate(double Latitude, double Longitude);

var p1 = new GeoCoordinate(23.8103, 90.4125);
var p2 = p1 with { Latitude = 24.0000 }; // নন-ডেস্ট্রাকটিভ মিউটেশন
Console.WriteLine(p1 == p2); // False (মানগত সমতা যাচাই)
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem R (Age in Days)
*কোনো ব্যক্তির বয়স মোট দিনে দেওয়া থাকবে ($N$)। বছর, মাস ও দিন হিসাব করতে হবে (ধরে নিন ১ বছর = ৩৬৫ দিন এবং ১ মাস = ৩০ দিন)। সম্পূর্ণ সমাধানটি একটি ইমিউটেবল স্ট্রাকট দিয়ে ডিজাইন করুন।*

#### সমাধান বিশ্লেষণ
১. একটি বয়স কাঠামোতে ৩টি পূর্ণসংখ্যা থাকে: \`Years\`, \`Months\`, \`Days\` ($৩ \\times ৪ = ১২$ বাইট $\\le ১৬$ বাইট)।
২. এটি একটি একক পারমাণবিক মান নির্দেশ করে।
৩. এটি ইমিউটেবল \`readonly struct\` হিসেবে উপযুক্ত।
৪. স্ট্যাক মেমোরিতে কাজ করায় কোনো গার্বেজ তৈরি হবে না।

#### C# সমাধান

\`\`\`csharp
using System;

public readonly struct TimeDecomposition
{
    public int Years { get; }
    public int Months { get; }
    public int Days { get; }

    public TimeDecomposition(int totalDays)
    {
        Years = totalDays / 365;
        int remainingAfterYears = totalDays % 365;

        Months = remainingAfterYears / 30;
        Days = remainingAfterYears % 30;
    }
}

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (int.TryParse(input.Trim(), out int totalDays))
        {
            TimeDecomposition age = new TimeDecomposition(totalDays);
            Console.WriteLine($"{age.Years} years");
            Console.WriteLine($"{age.Months} months");
            Console.WriteLine($"{age.Days} days");
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, পূর্ণসংখ্যার ভাগ এবং মডিউলো অপারেশন ধ্রুবক সময়ে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, ১২ বাইটের \`TimeDecomposition\` স্ট্রাকটটি স্ট্যাক ফ্রেমে থাকে, হিপে কোনো মেমোরি খরচ হয় না।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Age in Days](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/R) | Easy | \`readonly struct\`, Division/Modulo, Zero GC allocation |
| ⚪ | Codeforces | [Assiut Sheet #1: Difference](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D) | Easy | Primitive value arithmetic, Long integers, Expression evaluation |
| ⚪ | Exercism C# | [Hyper-Optimized Telemetry](https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry) | Medium | Value type memory layout, Struct packing, Telemetry buffering |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Collection modeling, Immutable structures, Linq integration |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Age in Days",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/R",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Struct", "Math", "Memory Optimization"],
      solutionEn:
        "Decompose total days into years, months, and days using an immutable 12-byte readonly struct allocated on the stack.",
      solutionBn:
        "স্ট্যাকে ১২ বাইটের একটি ইমিউটেবল readonly struct ব্যবহার করে মোট দিনকে বছর, মাস এবং দিনে বিভক্ত করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Difference",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Math", "Arithmetic", "Expressions"],
      solutionEn:
        "Evaluate the algebraic difference equation X = (A * B) - (C * D) using 64-bit integer values to avoid overflow.",
      solutionBn:
        "৬৪-বিট পূর্ণসংখ্যা ব্যবহার করে X = (A * B) - (C * D) সমীকরণের মান নির্ভুলভাবে হিসাব করুন।",
    },
    {
      source: "Exercism C#",
      name: "Hyper-Optimized Telemetry",
      url: "https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Value Types", "Structs", "Bitwise"],
      solutionEn:
        "Pack and unpack sensor telemetry values into the smallest possible byte representation, avoiding heap garbage collection.",
      solutionBn:
        "হিপ মেমোরি খরচ এড়িয়ে সেন্সর ডেটাকে সর্বনিম্ন সম্ভাব্য বাইট রিপ্রেজেন্টেশনে প্যাক ও আনপ্যাক করুন।",
    },
    {
      source: "Exercism C#",
      name: "High Scores",
      url: "https://exercism.org/tracks/csharp/exercises/high-scores",
      difficulty: "EASY",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Collections", "LINQ", "Immutability"],
      solutionEn:
        "Store and analyze player scores using immutable list representations to return the latest, personal best, and top three scores.",
      solutionBn:
        "ইমিউটেবল লিস্ট ব্যবহার করে খেলোয়াড়দের সর্বশেষ স্কোর, সর্বোচ্চ স্কোর এবং শীর্ষ তিনটি স্কোর প্রদান করুন।",
    },
  ],
};
