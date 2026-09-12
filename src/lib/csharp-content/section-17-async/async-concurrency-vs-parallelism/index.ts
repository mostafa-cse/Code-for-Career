import type { LocalLesson } from "@/lib/lessons-data";

export const asyncConcurrencyVsParallelismLesson: LocalLesson = {
  slug: "async-concurrency-vs-parallelism",
  titleEn: "Concurrency vs Parallelism (TPL)",
  titleBn: "কনকারেন্সি বনাম প্যারালালিজম (TPL ও Parallel.ForEach)",
  categoryEn: "17. Async Programming",
  categoryBn: "১৭. অ্যাসিনক্রোনাস প্রোগ্রামিং (async / await)",
  categoryDescEn:
    "Modern asynchronous architecture: Task and ValueTask, async/await state machines, Task.WhenAll/WhenAny, cooperative cancellation, and concurrency vs parallelism.",
  categoryDescBn:
    "আধুনিক অ্যাসিনক্রোনাস আর্কিটেকচার: Task ও ValueTask, async/await স্টেট মেশিন, WhenAll/WhenAny, কো-অপারেティブ ক্যান্সেলেশন এবং কনকারেন্সি বনাম প্যারালালিজম।",
  categoryPriority: "CORE",
  descriptionEn:
    "Handling multiple tasks at once (Concurrency) vs executing simultaneously across CPU cores (Parallelism), and Parallel.ForEach.",
  descriptionBn:
    "একসাথে কাজ পরিচালনা (কনকারেন্সি) বনাম একাধিক কোর দিয়ে একযোগে সম্পাদন (প্যারালালিজম) এবং Parallel.ForEach।",
  difficulty: "MEDIUM",
  displayOrder: 8,
  prerequisites: ["async-task-vs-thread"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Concurrency vs Parallelism (TPL) in C#

While the terms are often used interchangeably in casual discussion, **Concurrency** and **Parallelism** represent two fundamentally different engineering concerns in system design.

---

## 1. The Definitive Distinction

> **Rob Pike's Axiom**: *"Concurrency is about **dealing** with lots of things at once. Parallelism is about **doing** lots of things at once."*

\`\`\`
[Concurrency (Single CPU Core)]
Task A: ──[Slice 1]─────────[Slice 2]──────────► Interleaved progress
Task B: ───────────[Slice 1]─────────[Slice 2]─► (Structure / Composition)

[Parallelism (Multi-Core CPU)]
Core 1: ──[Task A Executes Continuously]───────► Simultaneous execution
Core 2: ──[Task B Executes Continuously]───────► (Physical Hardware Execution)
\`\`\`

### The Three Paradigms:
1. **Concurrency (Composition & Coordination)**:
   - Managing multiple execution timelines whose execution periods overlap.
   - Concurrency can exist on a **single CPU core** via timeslicing or asynchronous event loops (e.g. Node.js or a single-threaded UI loop managing 10,000 network sockets).
2. **Parallelism (Simultaneous Hardware Compute)**:
   - Physically executing multiple computations at the exact same instant across **multiple distinct CPU cores** or hardware execution units (e.g. SIMD vector registers).
   - Requires multi-core hardware. Used for CPU-bound computations (image encoding, cryptography, machine learning tensors).
3. **Asynchrony (Non-Blocking Latency Hiding)**:
   - Liberating execution threads during I/O waiting so that threads can do other work or return to the ThreadPool.

---

## 2. Architectural Comparison Matrix

| Dimension | Concurrency (\`async\` / \`await\`) | Parallelism (TPL / \`Parallel.For\`) |
| :--- | :--- | :--- |
| **Primary Goal** | **Throughput & Responsiveness**: Free threads during I/O. | **Compute Speedup**: Shorten execution time of heavy math. |
| **Hardware Need** | Works efficiently on a single core or multi-core. | Strictly requires **multiple physical CPU cores**. |
| **Nature of Work** | **I/O-Bound**: Network, disk, database queries. | **CPU-Bound**: Cryptography, ray tracing, matrix math. |
| **Thread State** | Non-blocking; threads return to ThreadPool. | Highly active; threads run at 100% CPU capacity. |
| **Primary .NET Tools** | \`Task.WhenAll\`, \`async\`/\`await\`, \`Channel<T>\`. | \`Parallel.ForEach\`, \`PLINQ\`, \`Parallel.ForEachAsync\`. |

---

## 3. The Modern .NET Parallel Toolkit

### 1. CPU-Bound Data Parallelism (\`Parallel.ForEach\`):
Partitions an in-memory collection across available CPU cores:
\`\`\`csharp
public void ProcessImagesInParallel(List<Bitmap> images)
{
    // Automatically chooses optimal thread count based on Environment.ProcessorCount
    Parallel.ForEach(images, new ParallelOptions { MaxDegreeOfParallelism = Environment.ProcessorCount }, image =>
    {
        ApplyGaussianFilter(image); // 100% CPU intensive computation
    });
}
\`\`\`

### 2. Parallel LINQ (PLINQ):
Declarative parallel evaluation with order preservation options:
\`\`\`csharp
public int[] ComputePrimes(int[] numbers)
{
    return numbers.AsParallel()
                  .WithDegreeOfParallelism(Environment.ProcessorCount)
                  .Where(IsPrime)
                  .ToArray();
}
\`\`\`

### 3. The Hybrid Hero: \`Parallel.ForEachAsync\` (.NET 6+):
Executes asynchronous I/O operations with a strict upper bound on concurrent workers:
\`\`\`csharp
public async Task DownloadAllAssetsAsync(List<string> urls)
{
    // Perfect combination: Async non-blocking I/O + controlled concurrency limit!
    await Parallel.ForEachAsync(urls, new ParallelOptions { MaxDegreeOfParallelism = 8 }, async (url, ct) =>
    {
        await DownloadAndStoreAsync(url, ct);
    });
}
\`\`\`

---

## 4. Amdahl's Law: The Limits of Parallelism

Why can't you achieve an infinite speedup by throwing 1,000 CPU cores at a problem? **Amdahl's Law** defines the theoretical maximum speedup of a program:

$$S_{\\text{latency}}(s) = \\frac{1}{(1 - p) + \\frac{p}{s}}$$

Where:
- $p$ is the proportion of the program that can be parallelized.
- $s$ is the number of CPU cores.
- $(1 - p)$ is the strictly serial portion that must run sequentially.

> [!IMPORTANT]
> If only 90% of your algorithm can be parallelized ($p = 0.90$) and 10% is serial ($1 - p = 0.10$), even with **infinite CPU cores** ($s \\to \\infty$), your maximum theoretical speedup is capped at:
> $$\\frac{1}{0.10} = 10\\times$$
> Beyond 16 or 32 cores, memory bus contention and thread synchronization overhead begin to degrade performance.

---

## 5. Practical Problem Walkthrough

### Problem: Replace MinMax In-Place
*Source: Codeforces Assiut Sheet #3: Problem M (Replace MinMax)*

Given an array $A$ of $N$ integers, find the minimum and maximum elements in the array and swap their positions. Print the modified array.

In data-parallel algorithms, finding global extremum values across memory partitions is a canonical reduction step. Here we implement an optimal single-pass linear reduction followed by an in-place swap.

### Algorithmic Strategy:
1. **Single Pass**: Track the index of the minimum element and the index of the maximum element in one linear iteration.
2. **Swap**: Swap $A[\\text{minIndex}]$ and $A[\\text{maxIndex}]$ in $O(1)$ time.
3. **Complexity**:
   - **Time Complexity**: $O(N)$ with $N - 1$ comparisons.
   - **Space Complexity**: $O(N)$ for array elements.

### C# Solution:

\`\`\`csharp
using System;
using System.IO;
using System.Threading.Tasks;

public class Program
{
    public static async Task Main()
    {
        using var reader = new StreamReader(Console.OpenStandardInput());
        using var writer = new StreamWriter(Console.OpenStandardOutput());

        string? nLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(nLine)) return;

        int n = int.Parse(nLine.Trim());

        string? elementsLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(elementsLine)) return;

        string[] tokens = elementsLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        // Single-pass reduction for min and max indices
        int minIndex = 0;
        int maxIndex = 0;

        for (int i = 1; i < n; i++)
        {
            if (numbers[i] < numbers[minIndex])
            {
                minIndex = i;
            }
            if (numbers[i] > numbers[maxIndex])
            {
                maxIndex = i;
            }
        }

        // In-place swap
        int temp = numbers[minIndex];
        numbers[minIndex] = numbers[maxIndex];
        numbers[maxIndex] = temp;

        // Output modified array
        for (int i = 0; i < n; i++)
        {
            await writer.WriteAsync(numbers[i].ToString());
            if (i < n - 1) await writer.WriteAsync(" ");
        }
        await writer.WriteLineAsync();
    }
}
\`\`\`

---

## 6. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Replace MinMax](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/M) | Easy | Array Extremum Reduction, Swapping |
| ⚪ | Codeforces | [Assiut Sheet #3: Check Code](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/N) | Easy | String Validation, Index Rules |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Medium | Thread Synchronization, Race Conditions |
| ⚪ | Exercism C# | [Space Age](https://exercism.org/tracks/csharp/exercises/space-age) | Easy | Mathematical Transformations, Structs |
`,

  contentBn: `# C# এ কনকারেন্সি বনাম প্যারালালিজম (TPL ও Parallel.ForEach)

সফটওয়্যার ইঞ্জিনিয়ারিংয়ে **কনকারেন্সি (Concurrency)** এবং **প্যারালালিজম (Parallelism)** প্রায়শই একই অর্থে ব্যবহৃত হলেও এদের কাজের ধরন ও উদ্দেশ্য সম্পূর্ণ আলাদা।

---

## ১. সংজ্ঞাগত পার্থক্য

> **রব পাইক এর বিখ্যাত উক্তি**: *"কনকারেন্সি হলো একসাথে অনেকগুলো কাজ **পরিচালনা** (Dealing with) করার কৌশল। আর প্যারালালিজম হলো একসাথে অনেকগুলো কাজ **সম্পাদন** (Doing) করার কৌশল।"*

\`\`\`
[কনকারেন্সি (সিঙ্গেল কোর সিপিইউ)]
টাস্ক A: ──[টুকরো ১]─────────[টুকরো ২]──────────► সময়ের ভাগে অগ্রগতি
টাস্ক B: ───────────[টুকরো ১]─────────[টুকরো ২]─► (স্ট্রাকচার / কো-অর্ডিনেশন)

[প্যারালালিজম (মাল্টি-কোর সিপিইউ)]
কোর ১: ──[টাস্ক A সম্পূর্ণ গতিতে চলছে]──────────► একযোগে বাস্তবায়ন
কোর ২: ──[টাস্ক B সম্পূর্ণ গতিতে চলছে]──────────► (প্রকৃত হার্ডওয়্যার মাল্টি-প্রসেসিং)
\`\`\`

### তিনটি মৌলিক ধারণা:
১. **কনকারেন্সি (Concurrency)**:
   - একাধিক কাজের টাইমলাইন একে অপরের সাথে ওভারল্যাপ করে পরিচালনা করা।
   - এটি **একটিমাত্র সিপিইউ কোরেও** হতে পারে (টাইম-স্লাইসিং বা অ্যাসিনক্রোনাস ইভেন্ট লুপের মাধ্যমে)। যেমন: নোডজেএস বা সি# এর সিঙ্গেল থ্রেডে ১০,০০০ নেটওয়ার্ক রিকোয়েস্ট পরিচালনা করা।
২. **প্যারালালিজম (Parallelism)**:
   - প্রসেসরের **একাধিক ফিজিক্যাল কোরে** হুবহু একই মুহূর্তে একাধিক গণনা সম্পন্ন করা।
   - এর জন্য অবশ্যই মাল্টি-কোর হার্ডওয়্যার প্রয়োজন (যেমন ইমেজ প্রসেসিং, ম্যাট্রিক্স গুণ, ক্রিপ্টোগ্রাফি)।
৩. **অ্যাসিনক্রোনি (Asynchrony)**:
   - I/O অপারেশনের সময় প্রসেসরের থ্রেডকে অলস না বসিয়ে রেখে থ্রেডপুলে ছেড়ে দেওয়া।

---

## ২. তুলনামূলক আর্কিটেকচারাল ছক

| মাত্রা | কনকারেন্সি (\`async\` / \`await\`) | প্যারালালিজম (TPL / \`Parallel.For\`) |
| :--- | :--- | :--- |
| **মূল উদ্দেশ্য** | **থ্রুপুট বৃদ্ধি**: I/O এর সময় থ্রেড মুক্ত রাখা। | **দ্রুত এক্সিকিউশন**: ভারী ক্যালকুলেশনকে একাধিক কোরে ভাগ করা। |
| **হার্ডওয়্যার চাহিদা** | সিঙ্গেল কোরেও অত্যন্ত সফলভাবে চলে। | অবশ্যই **একাধিক ফিজিক্যাল সিপিইউ কোর** লাগবে। |
| **কাজের ধরন** | **I/O-Bound**: নেটওয়ার্ক, ডিস্ক, ডাটাবেস কোয়েরি। | **CPU-Bound**: এনক্রিপশন, ইমেজ রেন্ডারিং, ম্যাথ। |
| **থ্রেডের অবস্থা** | নন-ব্লকিং; থ্রেড থ্রেডপুলে ফেরত যায়। | ফুল স্পিড; প্রতিটি কোর ১০০% ব্যস্ত থাকে। |
| **মূল .NET টুলস** | \`Task.WhenAll\`, \`async\`/\`await\`, \`Channel<T>\`। | \`Parallel.ForEach\`, \`PLINQ\`, \`Parallel.ForEachAsync\`। |

---

## ৩. আধুনিক .NET প্যারালাল টুলকিট

### ১. সিপিইউ-বাউন্ড প্যারালালিজম (\`Parallel.ForEach\`):
একটি কালেকশনকে স্বয়ংক্রিয়ভাবে একাধিক কোরে ভাগ করে রান করা:
\`\`\`csharp
public void ProcessImagesInParallel(List<Bitmap> images)
{
    Parallel.ForEach(images, new ParallelOptions { MaxDegreeOfParallelism = Environment.ProcessorCount }, image =>
    {
        ApplyFilter(image); // ১০০% সিপিইউ ইনটেনসিভ কাজ
    });
}
\`\`\`

### ২. প্যারালাল লিংক (PLINQ):
ডিক্ল্যারেটিভ স্টাইলে একাধিক কোরে ফিল্টারিং ও প্রসেসিং:
\`\`\`csharp
public int[] ComputePrimes(int[] numbers)
{
    return numbers.AsParallel()
                  .WithDegreeOfParallelism(Environment.ProcessorCount)
                  .Where(IsPrime)
                  .ToArray();
}
\`\`\`

### ৩. সেরা কম্বিনেশন: \`Parallel.ForEachAsync\` (.NET 6+):
অ্যাসিনক্রোনাস কাজকে নিয়ন্ত্রিত সমান্তরালে চালানোর জন্য এটি অপরিহার্য:
\`\`\`csharp
public async Task DownloadAllAssetsAsync(List<string> urls)
{
    // অ্যাসিনক্রোনাস নন-ব্লকিং I/O এবং একসাথে সর্বোচ্চ ৮টি রিকোয়েস্টের সীমাবদ্ধতা
    await Parallel.ForEachAsync(urls, new ParallelOptions { MaxDegreeOfParallelism = 8 }, async (url, ct) =>
    {
        await DownloadAndStoreAsync(url, ct);
    });
}
\`\`\`

---

## ৪. আমডাহলের সূত্র (Amdahl's Law): প্যারালালিজমের সীমাবদ্ধতা

১,০০০টি সিপিইউ কোর ব্যবহার করলেই কি কোড ১,০০০ গুণ দ্রুত কাজ করবে? **আমডাহলের সূত্র** অনুযায়ী কোডের কোনো একটি অংশ যদি সিকোয়েনশিয়াল (একক থ্রেডে) চলতে বাধ্য হয়, তবে গতি বৃদ্ধির একটি নির্দিষ্ট সীমা থাকে:

$$S_{\\text{latency}}(s) = \\frac{1}{(1 - p) + \\frac{p}{s}}$$

যেখানে:
- $p$ হলো কোডের যতটুকু অংশ প্যারালাল করা যায়।
- $s$ হলো সিপিইউ কোরের সংখ্যা।
- $(1 - p)$ হলো যে অংশটি এককভাবে চলতে হয়।

> [!IMPORTANT]
> আপনার কোডের ৯০% অংশ যদি প্যারালাল করা যায় ($p = 0.90$) এবং ১০% অংশ সিকোয়েনশিয়াল থাকে ($1 - p = 0.10$), তবে **অসীম সংখ্যক কোর ব্যবহার করলেও** আপনার প্রোগ্রামের সর্বোচ্চ স্পিডআপ কখনোই **১০ গুণের বেশি** হবে না!

---

## ৫. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: সর্বনিম্ন ও সর্বোচ্চ উপাদানের অবস্থান অদলবদল
*সোর্স: কোডফোর্সেস আসিউট শিট #৩: প্রবলেম M (Replace MinMax)*

প্রদত্ত $N$ আকারের একটি অ্যারের সর্বনিম্ন ও সর্বোচ্চ উপাদান খুঁজে নিয়ে তাদের অবস্থান অদলবদল (Swap) করতে হবে। প্যারালাল রিডাকশন অ্যালগরিদমে গ্লোবাল এক্সট্রিমাম নির্ণয় একটি মৌলিক ধাপ।

### সমাধান কৌশল:
১. **একক পাস**: অ্যারেতে একবার লুপ চালিয়ে সর্বনিম্ন ও সর্বোচ্চ মান ধারণকারী উপাদান দুটির ইন্ডেক্স সংরক্ষণ করা।
২. **ইন-প্লেস সোয়াপ**: $A[\\text{minIndex}]$ এবং $A[\\text{maxIndex}]$ এর মান অদলবদল করা।
৩. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O(N)$।
   - **স্পেস কমপ্লেক্সিটি**: $O(N)$ অ্যারে সংরক্ষণের জন্য।

### সম্পূর্ণ সি# সলিউশন:

\`\`\`csharp
using System;
using System.IO;
using System.Threading.Tasks;

public class Program
{
    public static async Task Main()
    {
        using var reader = new StreamReader(Console.OpenStandardInput());
        using var writer = new StreamWriter(Console.OpenStandardOutput());

        string? nLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(nLine)) return;

        int n = int.Parse(nLine.Trim());

        string? elementsLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(elementsLine)) return;

        string[] tokens = elementsLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        int minIndex = 0;
        int maxIndex = 0;

        for (int i = 1; i < n; i++)
        {
            if (numbers[i] < numbers[minIndex])
            {
                minIndex = i;
            }
            if (numbers[i] > numbers[maxIndex])
            {
                maxIndex = i;
            }
        }

        // মান অদলবদল
        int temp = numbers[minIndex];
        numbers[minIndex] = numbers[maxIndex];
        numbers[maxIndex] = temp;

        for (int i = 0; i < n; i++)
        {
            await writer.WriteAsync(numbers[i].ToString());
            if (i < n - 1) await writer.WriteAsync(" ");
        }
        await writer.WriteLineAsync();
    }
}
\`\`\`

---

## ৬. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Replace MinMax](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/M) | Easy | Array Extremum Reduction, Swapping |
| ⚪ | Codeforces | [Assiut Sheet #3: Check Code](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/N) | Easy | String Validation, Index Rules |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Medium | Thread Synchronization, Race Conditions |
| ⚪ | Exercism C# | [Space Age](https://exercism.org/tracks/csharp/exercises/space-age) | Easy | Mathematical Transformations, Structs |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Replace MinMax",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/M",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Array", "Extremum", "Swapping"],
      solutionEn:
        "Locate indices of the minimum and maximum array elements in a single pass and swap their positions in-place.",
      solutionBn:
        "একবার অ্যারে স্ক্যান করে সর্বনিম্ন ও সর্বোচ্চ উপাদানের ইন্ডেক্স খুঁজে তাদের মান ইন-প্লেস অদলবদল করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Check Code",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/N",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["String", "Validation", "Indices"],
      solutionEn:
        "Verify that a code string conforms to length and hyphen separator format rules.",
      solutionBn:
        "স্ট্রিং কোডটি নির্ধারিত দৈর্ঘ্য ও হাইফেন বিভাজক নিয়ম মেনে তৈরি কিনা তা যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "Bank Account",
      url: "https://exercism.org/tracks/csharp/exercises/bank-account",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Concurrency", "Thread Safety", "Lock"],
      solutionEn:
        "Protect shared bank account balances against concurrent data races using thread synchronization primitives.",
      solutionBn:
        "থ্রেড সিনক্রোনাইজেশন ব্যবহার করে কনকারেন্ট ডেটা রেস থেকে ব্যাংক ব্যালেন্স সুরক্ষিত রাখুন।",
    },
    {
      source: "Exercism C#",
      name: "Space Age",
      url: "https://exercism.org/tracks/csharp/exercises/space-age",
      difficulty: "EASY",
      company: "Optimizely",
      tags: ["Math", "Orbital Periods", "Structs"],
      solutionEn:
        "Calculate planetary age by dividing earth seconds by planetary orbital period ratios.",
      solutionBn:
        "পৃথিবীর সেকেন্ডকে গ্রহের কক্ষপথের অনুপাত দিয়ে ভাগ করে বিভিন্ন গ্রহে মানুষের বয়স নির্ণয় করুন।",
    },
  ],
};
