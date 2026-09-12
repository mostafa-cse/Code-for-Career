import type { LocalLesson } from "@/lib/lessons-data";

export const memoryGcGenerationsLesson: LocalLesson = {
  slug: "memory-gc-generations",
  titleEn: "GC Generations (Gen 0, 1, 2)",
  titleBn: "জিসি জেনারেশন (Gen 0, Gen 1, Gen 2)",
  categoryEn: "15. Memory Management",
  categoryBn: "১৫. মেমোরি ম্যানেজমেন্ট ও ইন্টারনালস",
  categoryDescEn:
    "CLR memory model: Stack vs Managed Heap, Garbage Collection internals, generational tuning (Gen 0/1/2), and Large Object Heap (LOH).",
  categoryDescBn:
    ".NET এ মেমোরি মডেল: স্ট্যাক বনাম ম্যানেজড হিপ, গার্বেজ কালেকশন (Mark-Sweep-Compact), জিসি জেনারেশন ও লার্জ অবজেক্ট হিপ (LOH)।",
  categoryPriority: "CORE",
  descriptionEn:
    "The Generational Hypothesis, Gen 0/1/2 lifecycles, JIT Write Barriers, Card Table cross-generational tracking, and why GC.Collect() is an anti-pattern.",
  descriptionBn:
    "জেনারেশনাল হাইপোথিসিস, Gen 0/1/2 লাইফসাইকেল, JIT রাইট ব্যারিয়ার, কার্ড টেবিল ও GC.Collect() কেন মারাত্মক অ্যান্টি-প্যাটার্ন।",
  difficulty: "MEDIUM",
  displayOrder: 4,
  prerequisites: ["memory-garbage-collection"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# GC Generations (Gen 0, Gen 1, Gen 2) in C#

To avoid scanning the entire multi-gigabyte managed heap during every collection pass, the .NET runtime partitions memory into **three generations** (Gen 0, Gen 1, and Gen 2). This architecture is built entirely around the **Generational Hypothesis**.

---

## The Generational Hypothesis

Decades of empirical runtime research across software systems established three fundamental laws:
1. **Most objects die young**: Over $90\%$ of allocated objects are short-lived temporary variables (e.g. string interpolations, DTOs, loop enumerators) that become garbage almost immediately after creation.
2. **Older objects tend to live longer**: Objects that survive multiple collection cycles (e.g. cache tables, static singletons, thread pools) will likely remain alive for the application's duration.
3. **Collecting a fraction of the heap is orders of magnitude faster** than traversing the entire memory space.

---

## The Generation Lifecycle

\`\`\`
   New Allocation
         │
         ▼
  ┌──────────────┐   Survives GC 0   ┌──────────────┐   Survives GC 1   ┌──────────────┐
  │ Generation 0 │ ────────────────► │ Generation 1 │ ────────────────► │ Generation 2 │
  └──────────────┘                   └──────────────┘                   └──────────────┘
   • Short-Lived                      • Buffer / Cushion                 • Long-Lived
   • Ephemeral Segment                • Ephemeral Segment                • Static / Caches
   • Sub-millisecond (<1ms)           • Fast (~2-5ms)                    • Full GC (Expensive)
\`\`\`

| Generation | Contents | Promotion Target | Typical Collection Frequency | Pause Time |
| :--- | :--- | :--- | :--- | :--- |
| **Gen 0** | Newly allocated small objects (< 85,000 bytes) | Promoted to **Gen 1** | Very High (thousands per minute) | Sub-millisecond (< 1 ms) |
| **Gen 1** | Buffer zone absorbing temporary survival spikes | Promoted to **Gen 2** | Moderate | Fast (~2 to 5 ms) |
| **Gen 2** | Long-lived entities, static caches, and LOH | Never promoted | Infrequent | Can take 50ms - 500ms+ on massive heaps |

---

## Under the Hood: Card Tables & JIT Write Barriers

How can the CLR collect **Gen 0** without scanning all of **Gen 2** to check if an old object holds a reference to a young object?

Scanning Gen 2 would defeat the entire purpose of generational isolation! The CLR solves this using **Card Tables** and **JIT Write Barriers**:

\`\`\`csharp
// Every time a reference field is assigned in C#:
parentCustomer.RecentOrder = newOrder;
\`\`\`

1. **The JIT Write Barrier**: On every reference assignment, the JIT compiler emits a tiny, high-speed assembly snippet called a **Write Barrier**.
2. **The Card Table**: A byte array in runtime memory where **1 card byte represents 2 KB of heap space**.
3. **Marking Dirty Cards**: When an older object is modified to point to a younger object, the write barrier marks the corresponding card as "dirty" (\`1\`).
4. **Sub-millisecond Gen 0 Sweeps**: During a Gen 0 collection, the GC **only scans the dirty cards** in Gen 2, ignoring millions of untouched Gen 2 objects!

---

## The Catastrophic \`GC.Collect()\` Anti-Pattern

In enterprise systems, explicitly calling \`GC.Collect()\` is one of the most destructive code smells:

\`\`\`csharp
// CATASTROPHIC PRODUCTION ANTI-PATTERN:
GC.Collect();
GC.WaitForPendingFinalizers();
\`\`\`

### Why Manual GC.Collect() Degrades Performance:
1. **Premature Promotion**: Short-lived objects currently sitting in Gen 0 (which would have died naturally in milliseconds) are forcibly promoted into **Gen 2**!
2. **Polluting Gen 2**: Once in Gen 2, these temporary objects can only be reclaimed by expensive **Full GCs**, causing future memory bloat.
3. **Destroys Dynamic Tuning**: The .NET CLR continuously monitors allocation throughput and auto-tunes generation segment sizes. Calling \`GC.Collect()\` manually blinds and disrupts the runtime's adaptive heuristics.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 Problem J (Lucky Array)
*Given an array $A$ of $N$ numbers. Determine whether the array is "Lucky". An array is lucky if the frequency of its minimum element is an odd number.*

#### Algorithmic Analysis
1. Read $N$ and the space-separated integers.
2. In a single pass, identify the minimum value.
3. In a second linear pass, count the occurrences of this minimum value.
4. If \`count % 2 != 0\`, print "Lucky", else "Unlucky".

#### C# Implementation

\`\`\`csharp
using System;

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
        if (n == 0) return;

        int[] numbers = new int[n];
        int minVal = int.MaxValue;

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
            if (numbers[i] < minVal)
            {
                minVal = numbers[i];
            }
        }

        int minFrequency = 0;
        for (int i = 0; i < n; i++)
        {
            if (numbers[i] == minVal)
            {
                minFrequency++;
            }
        }

        bool isLucky = (minFrequency & 1) != 0;
        Console.WriteLine(isLucky ? "Lucky" : "Unlucky");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(N)$, two linear passes across $N$ elements.
- **Space Complexity**: $\mathcal{O}(N)$ for the initial token array, with $\mathcal{O}(1)$ tracking variables.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Lucky Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/J) | Easy | Minimum element tracking, Frequency parity |
| ⚪ | Codeforces | [Assiut Sheet #3: Is B a Subsequence of A](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/U) | Medium | Two-pointer scan, Subsequence matching |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Short-lived object allocations, Gen 0 tuning |
| ⚪ | Exercism C# | [Simple Linked List](https://exercism.org/tracks/csharp/exercises/simple-linked-list) | Medium | Node pointer traversal, Generational survival |
`,

  contentBn: `# C# এ জিসি জেনারেশন (Gen 0, Gen 1, Gen 2)

প্রতিটি গার্বেজ কালেকশনে যেন সম্পূর্ণ মাল্টি-গিগাবাইট মেমোরি স্ক্যান করতে না হয়, সেজন্য .NET রানটাইম ম্যানেজড হিপকে **তিনটি জেনারেশনে (Gen 0, Gen 1, Gen 2)** বিভক্ত করে। এই সম্পূর্ণ সিস্টেমটি **জেনারেশনাল হাইপোথিসিস (Generational Hypothesis)** এর ওপর প্রতিষ্ঠিত।

---

## জেনারেশনাল হাইপোথিসিস কী?

কম্পিউটার বিজ্ঞানের দীর্ঘ গবেষণায় দেখা গেছে:
১. **অধিকাংশ অবজেক্ট তৈরির পর পরই মারা যায়**: তৈরি হওয়া অবজেক্টগুলোর ৯০% এর বেশি হলো সাময়িক ভেরিয়েবল (লুপের ভেতর তৈরি হওয়া স্ট্রিং, ছোট অবজেক্ট ইত্যাদি), যা কয়েক মিলিসেকেন্ড পরেই আবর্জনা হয়ে যায়।
২. **পুরোনো অবজেক্ট অনেক দিন বাঁচে**: যেসব অবজেক্ট একাধিক কালেকশন সাইকেল পার করে বেঁচে থাকে (যেমন ক্যাশ টেবিল, স্ট্যাটিক ডেটা, ডেটাবেস পুল), তারা অ্যাপ্লিকেশনের শেষ পর্যন্ত বেঁচে থাকার সম্ভাবনা বেশি।
৩. **সম্পূর্ণ মেমোরি চেক করার চেয়ে ছোট একটি অংশ (Gen 0) পরিষ্কার করা শতগুণ দ্রুতগতির**।

---

## জেনারেশন লাইফসাইকেল

\`\`\`
   নতুন অবজেক্ট তৈরি
         │
         ▼
  ┌──────────────┐   GC 0 তে বাঁচলে    ┌──────────────┐   GC 1 এ বাঁচলে    ┌──────────────┐
  │ Generation 0 │ ────────────────► │ Generation 1 │ ────────────────► │ Generation 2 │
  └──────────────┘                   └──────────────┘                   └──────────────┘
   • স্বল্পায়ু অবজেক্ট                • বাফার / মধ্যবর্তী ধাপ            • দীর্ঘায়ু অবজেক্ট
   • এফিমেরাল সেগমেন্ট               • এফিমেরাল সেগমেন্ট               • স্ট্যাটিক / ক্যাশ
   • সাব-মিলিসেকেন্ড (<১ms)          • দ্রুতগতির (~২-৫ms)             • ফুল জিসি (Full GC)
\`\`\`

| জেনারেশন | যা ধারণ করে | পদোন্নতি (Promotion) | কালেকশনের ফ্রিকোয়েন্সি | বিরতির সময় (Pause Time) |
| :--- | :--- | :--- | :--- | :--- |
| **Gen 0** | নতুন তৈরি হওয়া ছোট অবজেক্ট (< ৮৫,০০০ বাইট) | বেঁচে গেলে **Gen 1** এ যায় | অত্যন্ত বেশি (মিনিটে হাজার বার) | ১ মিলিসেকেন্ডেরও কম (< ১ ms) |
| **Gen 1** | ক্ষণস্থায়ী চাপ সামলানোর বাফার জোন | বেঁচে গেলে **Gen 2** এ যায় | মাঝারি | দ্রুতগতির (~২ থেকে ৫ ms) |
| **Gen 2** | দীর্ঘায়ু অবজেক্ট, স্ট্যাটিক ডেটা ও LOH | আর কোথাও যায় না | অনেক কম | মেমোরি বড় হলে ৫০ms - ৫০০ms+ লাগতে পারে |

---

## আন্ডার দ্য হুড: কার্ড টেবিল ও JIT রাইট ব্যারিয়ার

Gen 0 পরিষ্কার করার সময় CLR কীভাবে নিশ্চিত হয় যে Gen 2 এর কোনো পুরোনো অবজেক্ট Gen 0 এর নতুন কোনো অবজেক্টকে নির্দেশ করছে না?

পুরো Gen 2 স্ক্যান করতে গেলে জেনারেশনাল সিস্টেমের গতিই নষ্ট হয়ে যেত! এই সমস্যা সমাধানে CLR **কার্ড টেবিল (Card Table)** এবং **রাইট ব্যারিয়ার (Write Barrier)** ব্যবহার করে:

\`\`\`csharp
// প্রতিবার কোনো অবজেক্টের রেফারেন্স ফিল্ডে মান অ্যাসাইন করা হলে:
parentCustomer.RecentOrder = newOrder;
\`\`\`

১. **JIT রাইট ব্যারিয়ার**: প্রতিটি রেফারেন্স অ্যাসাইনমেন্টের সময় JIT কম্পাইলার গোপনে অতি দ্রুতগতির একটি অ্যাসেম্বলি কোড চালায়।
২. **কার্ড টেবিল**: মেমরিতে থাকা একটি বাইট অ্যারে, যেখানে **প্রতি ১টি কার্ড বাইট মেমরির ২ কিলোবাইট জায়গার প্রতিনিধিত্ব করে**।
৩. **ডার্টি কার্ড চিহ্নিতকরণ**: যখন কোনো পুরোনো Gen 2 অবজেক্ট নতুন কোনো Gen 0 অবজেক্টকে রেফারেন্স করে, তখন রাইট ব্যারিয়ার ওই কার্ড বাইটটিকে "ডার্টি" (\`1\`) হিসেবে মার্ক করে রাখে।
৪. **বিদ্যুৎ গতির Gen 0 সুইপ**: Gen 0 কালেকশনের সময় GC পুরো Gen 2 স্ক্যান না করে **কেবলমাত্র ডার্টি কার্ডগুলো স্ক্যান করে**, ফলে কোটি কোটি অক্ষত অবজেক্ট চেক না করেই সাব-মিলিসেকেন্ডে কাজ শেষ হয়!

---

## \`GC.Collect()\` এর মারাত্মক ভুল ব্যবহার

এন্টারপ্রাইজ অ্যাপ্লিকেশনে কোডের ভেতর সরাসরি \`GC.Collect()\` কল করা একটি ক্ষতিকর অ্যান্টি-প্যাটার্ন:

\`\`\`csharp
// মারাত্মক ভুল পদ্ধতি:
GC.Collect();
GC.WaitForPendingFinalizers();
\`\`\`

### কেন ম্যানুয়াল GC.Collect() ক্ষতিকর:
১. **অকাল পদোন্নতি (Premature Promotion)**: Gen 0 তে থাকা স্বল্পায়ু অবজেক্টগুলো (যা কয়েক মিলিসেকেন্ড পরেই স্বাভাবিকভাবে মারা যেত) জোরপূর্বক **Gen 2** তে পদোন্নতি পেয়ে যায়!
২. **Gen 2 দূষণ**: একবার Gen 2 তে চলে গেলে সেগুলো পরিষ্কার করার জন্য ব্যয়বহুল Full GC চালাতে হয়, ফলে মেমোরি খরচ বেড়ে যায়।
৩. **অ্যাডাপ্টিভ টিউনিং বিনষ্টকরণ**: .NET CLR স্বয়ংক্রিয়ভাবে ট্রাফিকের গতিপ্রকৃতি বুঝে হিপের সাইজ অ্যাডজাস্ট করে। ম্যানুয়ালি GC কল করলে রানটাইমের এই সেলফ-টিউনিং ব্যবস্থা নষ্ট হয়ে যায়।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #3 Problem J (Lucky Array)
*একটি সংখ্যা $N$ এবং একটি অ্যারে দেওয়া আছে। অ্যারেটি "Lucky" কি না তা নির্ধারণ করুন। অ্যারের সর্বনিম্ন সংখ্যাটির ফ্রিকোয়েন্সি বিজোড় হলে অ্যারেটি লাকি।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে সংখ্যাগুলো রিড করে অ্যারেতে নেওয়া।
২. প্রথম পাসে সর্বনিম্ন সংখ্যাটি (\`minVal\`) বের করা।
৩. দ্বিতীয় পাসে সর্বনিম্ন সংখ্যাটি কতবার উপস্থিত রয়েছে তা গণনা করা।
৪. ফ্রিকোয়েন্সি বিজোড় হলে "Lucky", অন্যথায় "Unlucky" প্রদর্শন করা।

#### C# সমাধান

\`\`\`csharp
using System;

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
        if (n == 0) return;

        int[] numbers = new int[n];
        int minVal = int.MaxValue;

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
            if (numbers[i] < minVal)
            {
                minVal = numbers[i];
            }
        }

        int minFrequency = 0;
        for (int i = 0; i < n; i++)
        {
            if (numbers[i] == minVal)
            {
                minFrequency++;
            }
        }

        bool isLucky = (minFrequency & 1) != 0;
        Console.WriteLine(isLucky ? "Lucky" : "Unlucky");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\mathcal{O}(N)$, দুটি লিনিয়ার পাসে পুরো অ্যারে স্ক্যান করে।
- **স্পেস কমপ্লেক্সিটি**: অ্যারের জন্য $\mathcal{O}(N)$ এবং ট্র্যাকিং ভেরিয়েবলে $\mathcal{O}(1)$ মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Lucky Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/J) | Easy | Minimum element tracking, Frequency parity |
| ⚪ | Codeforces | [Assiut Sheet #3: Is B a Subsequence of A](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/U) | Medium | Two-pointer scan, Subsequence matching |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Short-lived object allocations, Gen 0 tuning |
| ⚪ | Exercism C# | [Simple Linked List](https://exercism.org/tracks/csharp/exercises/simple-linked-list) | Medium | Node pointer traversal, Generational survival |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Lucky Array",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/J",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Generations", "Parity", "Array"],
      solutionEn:
        "Determine the minimum element in an array and assert whether its occurrence frequency is odd.",
      solutionBn:
        "অ্যারেতে সর্বনিম্ন সংখ্যাটি বের করুন এবং তার পুনরাবৃত্তি সংখ্যা বিজোড় কি না তা পরীক্ষা করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Is B a Subsequence of A",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/U",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["Two Pointers", "Subsequence", "Array"],
      solutionEn:
        "Verify whether array B is a subsequence of array A using sequential two-pointer forward matching.",
      solutionBn:
        "সিকোয়েন্সিয়াল টু-পয়েন্টার ফরওয়ার্ড ম্যাচিং ব্যবহার করে অ্যারে B অ্যারে A এর সাবসিকোয়েন্স কি না তা যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "High Scores",
      url: "https://exercism.org/tracks/csharp/exercises/high-scores",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["GC", "Generations", "Collections"],
      solutionEn:
        "Manage player score lists and retrieve top scores with short-lived ephemeral allocations.",
      solutionBn:
        "খেলোয়াড়ের স্কোর তালিকা পরিচালনা করে স্বল্পায়ু বরাদ্দের মাধ্যমে শীর্ষ স্কোরগুলো বের করুন।",
    },
    {
      source: "Exercism C#",
      name: "Simple Linked List",
      url: "https://exercism.org/tracks/csharp/exercises/simple-linked-list",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["Generations", "Linked List", "GC Roots"],
      solutionEn:
        "Build a custom singly-linked list managing node chain references and generational persistence.",
      solutionBn:
        "নোড চেইনের রেফারেন্স পরিচালনা করে একটি কাস্টম সিংগলি লিঙ্কড লিস্ট তৈরি করুন।",
    },
  ],
};
