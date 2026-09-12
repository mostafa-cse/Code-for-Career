import type { LocalLesson } from "@/lib/lessons-data";

export const memoryGarbageCollectionLesson: LocalLesson = {
  slug: "memory-garbage-collection",
  titleEn: "Garbage Collection (Mark, Sweep, Compact)",
  titleBn: "গার্বেজ কালেকশন (Mark, Sweep, Compact)",
  categoryEn: "15. Memory Management",
  categoryBn: "১৫. মেমোরি ম্যানেজমেন্ট ও ইন্টারনালস",
  categoryDescEn:
    "CLR memory model: Stack vs Managed Heap, Garbage Collection internals, generational tuning (Gen 0/1/2), and Large Object Heap (LOH).",
  categoryDescBn:
    ".NET এ মেমোরি মডেল: স্ট্যাক বনাম ম্যানেজড হিপ, গার্বেজ কালেকশন (Mark-Sweep-Compact), জিসি জেনারেশন ও লার্জ অবজেক্ট হিপ (LOH)।",
  categoryPriority: "CORE",
  descriptionEn:
    "The 3 core GC phases (Mark, Sweep, Compact), Stop-The-World pauses, pointer relocation, Workstation vs Server GC, and Background GC.",
  descriptionBn:
    "গার্বেজ কালেকশনের ৩টি প্রধান ধাপ (Mark, Sweep, Compact), স্টপ-দ্য-ওয়ার্ল্ড পজ, পয়েন্টার রিলোকেশন, ওয়ার্কস্টেশন বনাম সার্ভার জিসি এবং ব্যাকগ্রাউন্ড জিসি।",
  difficulty: "MEDIUM",
  displayOrder: 3,
  prerequisites: ["memory-heap"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Garbage Collection (Mark, Sweep, Compact) in C#

The .NET Garbage Collector (GC) is an automatic, tracing, generational, and compacting memory manager. It reclaims memory allocated to objects that are no longer accessible to the application while defragmenting the managed heap to ensure long-term throughput.

---

## The Three Core Phases of a GC Run

When allocation thresholds are exceeded or system memory pressure occurs, the CLR initiates a collection cycle:

\`\`\`
  [Phase 1: MARK] ─────► [Phase 2: SWEEP] ─────► [Phase 3: COMPACT]
  Traverses from GC Roots  Identifies dead holes   Shifts live objects contiguously
  Marks reachable objects  Reclaims dead memory     Updates all pointer references!
\`\`\`

### Phase 1: Mark (Tracing Reachability)
1. The execution engine brings managed threads to safe execution points (Safe Points) and temporarily suspends them (**Stop-The-World** pause).
2. The GC gathers all active **GC Roots** (stack pointers, static references, CPU registers).
3. It performs a graph traversal across all connected objects, setting a 1-bit mark in the sync block header or marking bitmap.
4. Any object left unmarked when the graph traversal ends is conclusively **dead**.

### Phase 2: Sweep (Reclaiming Free Space)
- The GC scans through the memory segments.
- It reclaims the memory occupied by unmarked (dead) objects and adds their address spans into internal **free-space lists (freelists)**.

### Phase 3: Compact (Defragmentation & Pointer Relocation)
- **The Problem**: Sweeping leaves memory fragmented with gaps of free space interspersed between live objects.
- **The Solution**: The GC slides all surviving live objects contiguously toward the beginning of the memory segment.
- **Pointer Relocation Table**: Because moving an object changes its physical RAM address, the GC updates every pointer variable on all thread stacks, CPU registers, and containing objects to point to the object's new address!

---

## Workstation GC vs Server GC

The .NET runtime offers two specialized Garbage Collector operational modes:

| Dimension | Workstation GC | Server GC |
| :--- | :--- | :--- |
| **Intended Target** | Client desktop apps, MAUI, mobile | ASP.NET Core, microservices, backend APIs |
| **Heap Topology** | 1 Shared Managed Heap | **1 Separate Managed Heap PER CPU core** |
| **GC Threads** | 1 Dedicated Thread (Normal Priority) | **1 Dedicated Thread PER CPU core** (Highest Priority) |
| **Throughput vs Latency** | Prioritizes low UI latency | Maximizes multi-core throughput |
| **Resource Footprint** | Low RAM baseline | Higher initial RAM allocation |

\`\`\`xml
<!-- Configured in .csproj for high-throughput backends -->
<PropertyGroup>
  <ServerGarbageCollection>true</ServerGarbageCollection>
  <ConcurrentGarbageCollection>true</ConcurrentGarbageCollection>
</PropertyGroup>
\`\`\`

---

## Background GC (Non-Blocking Collections)

In modern .NET:
- **Gen 0 and Gen 1 collections** (ephemeral) are fast enough (< 1ms) that short pauses are imperceptible.
- **Gen 2 collections (Full GC)** can take noticeably longer on large heaps.
- **Background GC**: Runs Gen 2 collections concurrently on a separate dedicated thread. Crucially, client threads can continue allocating in Gen 0 and Gen 1 while the Gen 2 background collection is actively running!

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 Problem H (Sorting)
*Given a number $N$ and an array $A$ of $N$ numbers. Sort the array in ascending order using an in-place algorithm that causes zero garbage collection allocations.*

#### Algorithmic Analysis
1. Read $N$ and the array tokens into an integer array.
2. Apply an in-place sorting algorithm (such as Insertion Sort or QuickSort).
3. Performing in-place swaps on the pre-allocated array produces **zero intermediate garbage allocations**, ensuring the GC never triggers during sorting.

#### C# Implementation

\`\`\`csharp
using System;
using System.Text;

public class Program
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = tokens.Length;

        int[] numbers = new int[n];
        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        // In-place sorting (Selection sort) ensuring 0 GC heap allocations
        for (int i = 0; i < n - 1; i++)
        {
            int minIndex = i;
            for (int j = i + 1; j < n; j++)
            {
                if (numbers[j] < numbers[minIndex])
                {
                    minIndex = j;
                }
            }

            if (minIndex != i)
            {
                int temp = numbers[i];
                numbers[i] = numbers[minIndex];
                numbers[minIndex] = temp;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++)
        {
            sb.Append(numbers[i]);
            if (i < n - 1) sb.Append(' ');
        }

        Console.WriteLine(sb.ToString());
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(N^2)$ for Selection Sort (or $\mathcal{O}(N \log N)$ if using QuickSort).
- **Space Complexity**: $\mathcal{O}(N)$ for the initial array, with $\mathcal{O}(1)$ auxiliary sorting memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Sorting](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H) | Easy | In-place sorting, Zero GC allocations |
| ⚪ | Codeforces | [Assiut Sheet #3: Count Subarrays](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Q) | Medium | Subarray scanning, Memory locality |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | Object reuse, Bounded memory management |
| ⚪ | Exercism C# | [Clock](https://exercism.org/tracks/csharp/exercises/clock) | Medium | Value equality, Garbage-free immutability |
`,

  contentBn: `# C# এ গার্বেজ কালেকশন (Mark, Sweep, Compact)

.NET কমন ল্যাঙ্গুয়েজ রানটাইমে (CLR) মেমোরি স্বয়ংক্রিয়ভাবে ব্যবস্থাপনার জন্য **গার্বেজ কালেক্টর (GC)** ব্যবহৃত হয়। এটি একটি ট্রেসিং, জেনারেশনাল এবং কম্প্যাক্টিং মেমোরি ম্যানেজার। যেসকল অবজেক্টের আর কোনো প্রয়োজন নেই তাদের মেমোরি মুক্ত করা এবং মেমোরি ফ্র্যাগমেন্টেশন দূর করাই এর প্রধান দায়িত্ব।

---

## একটি GC রানের ৩টি মৌলিক ধাপ

যখন মেমোরির বরাদ্দ সীমা অতিক্রান্ত হয়, তখন CLR একটি কালেকশন সাইকেল শুরু করে:

\`\`\`
  [ধাপ ১: MARK] ───────► [ধাপ ২: SWEEP] ───────► [ধাপ ৩: COMPACT]
  GC রুট থেকে খোঁজা হয়     মৃত অবজেক্টের স্থান       জীবিত অবজেক্টগুলো একসাথে সরানো হয়
  জীবিত অবজেক্ট চিহ্নিত হয়   মেমোরিতে মুক্ত করা হয়     সমস্ত পয়েন্টার রেফারেন্স আপডেট হয়!
\`\`\`

### ধাপ ১: মার্ক (Mark - পৌঁছানোর ক্ষমতা যাচাই)
১. এক্সিকিউশন ইঞ্জিন চলমান থ্রেডগুলোকে নিরাপদ স্থানে এনে সাময়িকভাবে স্থগিত করে (**Stop-The-World** পজ)।
২. GC সক্রিয় সমস্ত **GC রুট** (স্ট্যাক পয়েন্টার, স্ট্যাটিক রেফারেন্স, রেজিস্টার) সংগ্রহ করে।
৩. এটি রুট থেকে শুরু করে সম্পূর্ণ অবজেক্ট গ্রাফ ভিজিট করে এবং প্রতিটি জীবিত অবজেক্টের হেডারে একটি ১-বিট মার্ক বসিয়ে দেয়।
৪. গ্রাফ ভিজিট শেষে যেসব অবজেক্ট আনমার্কড থাকে, তারা নিশ্চিতভাবেই **মৃত (Garbage)**।

### ধাপ ২: সুইপ (Sweep - মেমোরি পুনরুদ্ধার)
- GC মেমোরি সেগমেন্ট ধরে এগিয়ে যায়।
- মৃত অবজেক্টগুলোর দখল করা মেমোরি উদ্ধার করে অভ্যন্তরীণ **ফ্রি-স্পেস লিস্টে (freelist)** যুক্ত করে।

### ধাপ ৩: কম্প্যাক্ট (Compact - ডিফ্র্যাগমেন্টেশন ও পয়েন্টার রিলোকেশন)
- **সমস্যা**: সুইপ করার পর মেমরির বিভিন্ন স্থানে ছোট ছোট ফাঁকা জায়গা (Fragmentation) তৈরি হয়।
- **সমাধান**: GC সমস্ত জীবিত অবজেক্টকে সেগমেন্টের শুরুর দিকে একটার পর একটা ঠেলে সাজিয়ে দেয়, ফলে সব ফাঁকা জায়গা একসাথে বড় একটি ব্লকে পরিণত হয়।
- **পয়েন্টার রিলোকেশন টেবিল**: অবজেক্টের মেমোরি অ্যাড্রেস বদলে যাওয়ায়, অ্যাপ্লিকেশনের সমস্ত থ্রেড স্ট্যাক এবং অন্যান্য অবজেক্টে থাকা রেফারেন্স পয়েন্টারগুলো স্বয়ংক্রিয়ভাবে নতুন অ্যাড্রেসে আপডেট করা হয়!

---

## ওয়ার্কস্টেশন জিসি বনাম সার্ভার জিসি

.NET রানটাইম দুটি বিশেষ মোডে গার্বেজ কালেকশন পরিচালনা করে:

| বৈশিষ্ট্য | ওয়ার্কস্টেশন জিসি (Workstation GC) | সার্ভার জিসি (Server GC) |
| :--- | :--- | :--- |
| **লক্ষ্য অ্যাপ্লিকেশন** | ডেস্কটপ অ্যাপ, MAUI, মোবাইল ক্লায়েন্ট | ASP.NET Core, মাইক্রোসার্ভিস, ব্যাকএন্ড এপিআই |
| **হিপ সংখ্যা** | ১টি একক শেয়ার্ড হিপ | **প্রতিটি CPU কোরের জন্য ১টি আলাদা হিপ** |
| **GC থ্রেড** | ১টি ডেডিকেটেড থ্রেড (সাধারণ প্রায়োরিটি) | **প্রতিটি CPU কোরের জন্য ১টি সর্বোচ্চ প্রায়োরিটি থ্রেড** |
| **মূল লক্ষ্য** | ইউজার ইন্টারফেস যেন আটকে না যায় (Low Latency) | মাল্টি-কোর প্রসেসরে সর্বোচ্চ থ্রুপুট (Throughput) |
| **র‍্যামের ব্যবহার** | কম মেমোরি খরচ | শুরুতে কিছুটা বেশি মেমোরি দখল করে |

\`\`\`xml
<!-- উচ্চ থ্রুপুট ব্যাকএন্ডের জন্য .csproj কনফিগারেশন -->
<PropertyGroup>
  <ServerGarbageCollection>true</ServerGarbageCollection>
  <ConcurrentGarbageCollection>true</ConcurrentGarbageCollection>
</PropertyGroup>
\`\`\`

---

## ব্যাকগ্রাউন্ড জিসি (Background GC)

আধুনিক .NET-এ:
- **Gen 0 ও Gen 1 কালেকশন** অত্যন্ত দ্রুত (১ মিলিসেকেন্ডেরও কম) সম্পন্ন হয়, ফলে কোনো বিরতি বোঝা যায় না।
- **Gen 2 কালেকশন (Full GC)** বড় অ্যাপ্লিকেশনে বেশি সময় নিতে পারে।
- **ব্যাকগ্রাউন্ড জিসি**: আলাদা একটি ব্যাকগ্রাউন্ড থ্রেডে Gen 2 কালেকশন চালায়। এর সুবিধা হলো, Gen 2 কালেকশন চলাকালীনও মূল অ্যাপ্লিকেশন থ্রেডগুলো Gen 0 ও Gen 1 এ নতুন অবজেক্ট তৈরি করতে পারে এবং কোনো বড় থ্রেড ব্লকিং হয় না!

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #3 Problem H (Sorting)
*একটি সংখ্যা $N$ এবং $N$ আকারের একটি অ্যারে দেওয়া থাকবে। কোনো অতিরিক্ত মেমোরি গার্বেজ তৈরি না করে অ্যারেটিকে আরোহী ক্রমে সাজান।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে সংখ্যাগুলো রিড করে অ্যারেতে পার্স করা।
২. ইন-প্লেস সর্টিং অ্যালগরিদম প্রয়োগ করে একই অ্যারের ভেতর উপাদানগুলোর অবস্থান অদলবদল করা।
৩. ইন-প্লেস সোয়াপিং করায় মেমরিতে নতুন কোনো অবজেক্ট তৈরি হয় না, ফলে GC রানে কোনো ওভারহেড পড়ে না।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Text;

public class Program
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = tokens.Length;

        int[] numbers = new int[n];
        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        for (int i = 0; i < n - 1; i++)
        {
            int minIndex = i;
            for (int j = i + 1; j < n; j++)
            {
                if (numbers[j] < numbers[minIndex])
                {
                    minIndex = j;
                }
            }

            if (minIndex != i)
            {
                int temp = numbers[i];
                numbers[i] = numbers[minIndex];
                numbers[minIndex] = temp;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++)
        {
            sb.Append(numbers[i]);
            if (i < n - 1) sb.Append(' ');
        }

        Console.WriteLine(sb.ToString());
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: সিলেকশন সর্টে $\mathcal{O}(N^2)$ (কুইকসর্ট ব্যবহার করলে $\mathcal{O}(N \log N)$)।
- **স্পেস কমপ্লেক্সিটি**: প্রাথমিক অ্যারের জন্য $\mathcal{O}(N)$, এবং সর্টিংয়ে অতিরিক্ত মেমোরি $\mathcal{O}(1)$।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Sorting](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H) | Easy | In-place sorting, Zero GC allocations |
| ⚪ | Codeforces | [Assiut Sheet #3: Count Subarrays](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Q) | Medium | Subarray scanning, Memory locality |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | Object reuse, Bounded memory management |
| ⚪ | Exercism C# | [Clock](https://exercism.org/tracks/csharp/exercises/clock) | Medium | Value equality, Garbage-free immutability |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Sorting",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Sorting", "GC", "In-place"],
      solutionEn:
        "Sort an array in-place without triggering heap allocations by executing symmetric element comparisons and swaps.",
      solutionBn:
        "ইন-প্লেস সোয়াপিং প্রয়োগ করে হিপ মেমোরি খরচ ছাড়াই অ্যারেকে আরোহী ক্রমে সাজান।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Count Subarrays",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Q",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["Array", "Subarrays", "Memory"],
      solutionEn:
        "Count contiguous non-decreasing subarrays efficiently using pointer sweeps with zero intermediary allocations.",
      solutionBn:
        "পয়েন্টার সুইপের সাহায্যে কোনো মধ্যবর্তী মেমোরি তৈরি ছাড়াই নন-ডিক্রিজিং সাব-অ্যারে গণনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Circular Buffer",
      url: "https://exercism.org/tracks/csharp/exercises/circular-buffer",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Data Structure", "GC", "Reuse"],
      solutionEn:
        "Implement a bounded circular buffer that reuses allocated memory slots, minimizing garbage collection churn.",
      solutionBn:
        "মেমোরি স্লট পুনর্ব্যবহার করে গার্বেজ কালেকশন ওভারহেড কমাতে একটি নির্দিষ্ট আকারের সার্কুলার বাফার তৈরি করুন।",
    },
    {
      source: "Exercism C#",
      name: "Clock",
      url: "https://exercism.org/tracks/csharp/exercises/clock",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["Immutability", "GC", "Value Types"],
      solutionEn:
        "Model a 24-hour clock using an immutable value structure with zero heap allocations during arithmetic operations.",
      solutionBn:
        "গাণিতিক অপারেশনের সময় কোনো হিপ মেমোরি খরচ না করে একটি ইমিউটেবল ভ্যালু স্ট্রাকচারের সাহায্যে ঘড়ি মডেল করুন।",
    },
  ],
};
