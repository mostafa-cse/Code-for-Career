import type { LocalLesson } from "@/lib/lessons-data";

export const memoryLohLesson: LocalLesson = {
  slug: "memory-loh",
  titleEn: "Large Object Heap (LOH)",
  titleBn: "লার্জ অবজেক্ট হিপ (LOH) ও ফ্র্যাগমেন্টেশন",
  categoryEn: "15. Memory Management",
  categoryBn: "১৫. মেমোরি ম্যানেজমেন্ট ও ইন্টারনালস",
  categoryDescEn:
    "CLR memory model: Stack vs Managed Heap, Garbage Collection internals, generational tuning (Gen 0/1/2), and Large Object Heap (LOH).",
  categoryDescBn:
    ".NET এ মেমোরি মডেল: স্ট্যাক বনাম ম্যানেজড হিপ, গার্বেজ কালেকশন (Mark-Sweep-Compact), জিসি জেনারেশন ও লার্জ অবজেক্ট হিপ (LOH)।",
  categoryPriority: "CORE",
  descriptionEn:
    "The 85,000-byte allocation threshold, uncompacted memory fragmentation, Gen 2 Full GC triggers, ArrayPool<T> reuse, and Pinned Object Heap (POH).",
  descriptionBn:
    "৮৫,০০০ বাইট থ্রেশহোল্ড, মেমোরি ফ্র্যাগমেন্টেশন ঝুঁকি, Gen 2 ফুল জিসি, ArrayPool<T> অবজেক্ট পুলিং এবং পিন্ড অবজেক্ট হিপ (POH)।",
  difficulty: "HARD",
  displayOrder: 5,
  prerequisites: ["memory-gc-generations"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Large Object Heap (LOH) in C#

In .NET, any object requiring **85,000 bytes or more** is bypassed from the Small Object Heap (SOH) and allocated directly on a specialized region known as the **Large Object Heap (LOH)**.

Understanding LOH mechanics is essential for backend, cloud, and big-data engineers to prevent catastrophic memory fragmentation and unexplainable \`OutOfMemoryException\` crashes.

---

## The 85,000-Byte Threshold

When is an object allocated on the LOH?

| Object Type | Element Size | LOH Threshold Count |
| :--- | :--- | :--- |
| **\`byte[]\` / \`sbyte[]\`** | 1 byte | $\ge 85,000$ elements |
| **\`int[]\` / \`uint[]\`** | 4 bytes | $\ge 21,250$ elements ($21,250 \times 4 = 85,000$) |
| **\`long[]\` / \`double[]\`** | 8 bytes | $\ge 10,625$ elements ($10,625 \times 8 = 85,000$) |
| **\`string\`** (UTF-16) | 2 bytes per char | $\ge 42,500$ characters (including null terminator and header) |

> **32-Bit Architecture Exception**: On 32-bit x86 runtimes, \`double[]\` arrays containing $\ge 1,000$ elements are placed on the LOH to ensure 8-byte pointer alignment for floating-point operations.

---

## Why LOH Exists & The Fragmentation Crisis

### Why Doesn't the GC Compact the LOH by Default?
On the Small Object Heap (SOH), the GC compacts memory by physically sliding objects into contiguous blocks. If the runtime attempted to slide a 100 MB or 500 MB array across memory during a collection:
- The CPU would spend tens or hundreds of milliseconds copying gigabytes of memory pages.
- Application threads would experience severe **Stop-The-World freezes**, destroying real-time response times.

Therefore, historically the CLR **sweeps the LOH but NEVER compacts it by default**.

### The OutOfMemoryException Paradox:
Because dead spaces on the LOH are not compacted, memory becomes like Swiss cheese (heavily fragmented):

\`\`\`
  LOH Memory Layout:
  ┌──────────────┬──────────────┬──────────────┬──────────────┐
  │ 30 MB Object │ 20 MB Hole   │ 40 MB Object │ 30 MB Hole   │
  └──────────────┴──────────────┴──────────────┴──────────────┘
  Total Free Memory Available: 50 MB (20 MB + 30 MB)
\`\`\`

If your application requests a new **45 MB buffer**, the allocation **FAILS with \`OutOfMemoryException\`**, even though 50 MB of free memory is technically available, because **no single contiguous 45 MB block exists**!

### Always Collected as Generation 2:
The LOH is considered part of **Generation 2**. Allocating frequently on the LOH forces the runtime to trigger expensive **Gen 2 Full GCs**, degrading total application throughput.

---

## The High-Performance Solution: \`ArrayPool<T>\`

To avoid allocating and discarding massive buffers on the LOH, .NET provides **\`System.Buffers.ArrayPool<T>\`**:

\`\`\`csharp
using System.Buffers;

public static async Task ProcessLargeStreamAsync(Stream stream)
{
    // Rent a reusable buffer (likely already on LOH, but reused indefinitely!)
    byte[] buffer = ArrayPool<byte>.Shared.Rent(90000);
    try
    {
        int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);
        ProcessBytes(buffer, bytesRead);
    }
    finally
    {
        // MUST return to pool to avoid memory leaks
        ArrayPool<byte>.Shared.Return(buffer);
    }
}
\`\`\`

### Key Best Practices with ArrayPool:
1. The rented array may be **larger than the requested length** (e.g. asking for 90,000 may return a 131,072-byte array). Always track the actual logical length separately!
2. Rented arrays may contain **stale dirty data** from previous operations. Pass \`clearArray: true\` to \`Return()\` if storing sensitive data (e.g. passwords or encryption keys).

---

## Modern .NET Advancements: POH & On-Demand Compaction

1. **Pinned Object Heap (POH) (.NET 5+)**:
   - Pinned memory (e.g. buffers passed to native OS sockets or interop APIs) now lives on its own dedicated POH.
   - This prevents pinned objects from creating immovable fragmentation roadblocks on the Small Object Heap.
2. **On-Demand LOH Compaction**:
   - You can instruct the CLR to compact the LOH on the very next Full GC:
   \`\`\`csharp
   GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
   GC.Collect(); // Compacts the LOH during this run
   \`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 Problem K (Sum Digits)
*Given a number $N$ ($1 \le N \le 10^6$) and a string of $N$ digits. Compute the sum of all $N$ digits without causing LOH allocation pressure.*

#### Algorithmic Analysis
1. A single string of $1,000,000$ characters consumes $\approx 2 \text{ MB}$, landing squarely on the LOH.
2. If we read the string in chunks or directly stream character values from \`Console.In\`, we can compute the sum in $\mathcal{O}(1)$ auxiliary memory without ever allocating a 2 MB string on the LOH!

#### C# Implementation

\`\`\`csharp
using System;
using System.IO;

public class Program
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;

        if (!int.TryParse(nLine.Trim(), out int n) || n <= 0) return;

        long digitSum = 0;
        TextReader reader = Console.In;

        // Streaming character-by-character directly from input stream
        // Zero 2 MB LOH string allocation!
        int readCount = 0;
        while (readCount < n)
        {
            int ch = reader.Read();
            if (ch == -1) break;

            if (ch >= '0' && ch <= '9')
            {
                digitSum += (ch - '0');
                readCount++;
            }
        }

        Console.WriteLine(digitSum);
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(N)$, streaming $N$ digit characters sequentially in linear time.
- **Space Complexity**: $\mathcal{O}(1)$ auxiliary memory, completely bypassing Large Object Heap allocations.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Sum Digits](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/K) | Easy | Streaming character parsing, LOH bypass |
| ⚪ | Codeforces | [Assiut Sheet #3: Matrix](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/N) | Easy | 2D matrix manipulation, Contiguous memory |
| ⚪ | Exercism C# | [Resistor Color Trio](https://exercism.org/tracks/csharp/exercises/resistor-color-trio) | Easy | Metric unit scaling, Array pooling |
| ⚪ | Exercism C# | [Rotational Cipher](https://exercism.org/tracks/csharp/exercises/rotational-cipher) | Medium | Buffer reuse, In-place character transformation |
`,

  contentBn: `# C# এ লার্জ অবজেক্ট হিপ (LOH) ও ফ্র্যাগমেন্টেশন

.NET-এ যেকোনো অবজেক্টের সাইজ যদি **৮৫,০০০ বাইট বা তার বেশি** হয়, তবে সেটিকে স্মল অবজেক্ট হিপে (SOH) না রেখে সরাসরি **লার্জ অবজেক্ট হিপ (LOH)** নামক একটি বিশেষ মেমোরি অঞ্চলে বরাদ্দ করা হয়।

ব্যাকএন্ড, ক্লাউড এবং বিগ-ডেটা সিস্টেমে অপ্রত্যাশিত মেমোরি ফ্র্যাগমেন্টেশন এবং \`OutOfMemoryException\` ক্র্যাশ প্রতিরোধ করার জন্য LOH-এর আচরণ বোঝা অত্যাবশ্যক।

---

## ৮৫,০০০ বাইট বরাদ্দের থ্রেশহোল্ড

কখন একটি অবজেক্ট LOH-এ বরাদ্দ হয়?

| অবজেক্ট টাইপ | প্রতিটি উপাদানের আকার | LOH-এ যাওয়ার ন্যূনতম উপাদান সংখ্যা |
| :--- | :--- | :--- |
| **\`byte[]\` / \`sbyte[]\`** | ১ বাইট | $\ge ৮৫,০০০$ টি উপাদান |
| **\`int[]\` / \`uint[]\`** | ৪ বাইট | $\ge ২১,২৫০$ টি উপাদান ($২১,২৫০ \times ৪ = ৮৫,০০০$) |
| **\`long[]\` / \`double[]\`** | ৮ বাইট | $\ge ১০,৬২৫$ টি উপাদান ($১০,৬২৫ \times ৮ = ৮৫,০০০$) |
| **\`string\`** (UTF-16) | প্রতি ক্যারেক্টার ২ বাইট | $\ge ৪২,৫০০$ টি ক্যারেক্টার (হেডার ও নাল টার্মিনেটর সহ) |

> **৩২-বিট আর্কিটেকচারের ব্যতিক্রম**: ৩২-বিট x86 সিস্টেমে ১,০০০ বা তার বেশি উপাদানের \`double[]\` অ্যারে LOH-এ পাঠানো হয়, যাতে ফ্লোটিং পয়েন্ট অপারেশনের জন্য ৮-বাইট মেমোরি অ্যালাইনমেন্ট বজায় থাকে।

---

## LOH কেন রয়েছে এবং মেমোরি ফ্র্যাগমেন্টেশন সমস্যা

### কেন ডিফল্টভাবে LOH কম্প্যাক্ট করা হয় না?
স্মল অবজেক্ট হিপে (SOH) প্রতিটি GC রানে অবজেক্টগুলোকে মেমরির শুরুতে ঠেলে কম্প্যাক্ট করা হয়। কিন্তু LOH-এ যদি ১০০ মেগাবাইট বা ৫০০ মেগাবাইটের একটি অ্যারে মেমরির এক স্থান থেকে অন্য স্থানে সরানো হয়:
- সিপিইউ দীর্ঘ সময় ধরে মেমোরি কপি করতে ব্যস্ত থাকবে।
- অ্যাপ্লিকেশনের সমস্ত থ্রেড দীর্ঘ সময়ের জন্য আটকে থাকবে (**Stop-The-World Freeze**), যা রিয়েল-টাইম সার্ভিসের পারফরম্যান্স ধ্বংস করে দেবে।

তাই ঐতিহাসিকভাবে CLR এর নিয়ম হলো: **LOH সুইপ করা হয়, কিন্তু ডিফল্টভাবে কখনোই কম্প্যাক্ট করা হয় না**।

### OutOfMemoryException এর বিভ্রান্তি:
যেহেতু মৃত জায়গাগুলো কম্প্যাক্ট করা হয় না, তাই মেমোরি মারাত্মকভাবে ফ্র্যাগমেন্টেড হয়ে পড়ে:

\`\`\`
  LOH মেমোরির অবস্থা:
  ┌──────────────┬──────────────┬──────────────┬──────────────┐
  │ ৩০ MB অবজেক্ট│ ২০ MB ফাঁকা  │ ৪০ MB অবজেক্ট│ ৩০ MB ফাঁকা  │
  └──────────────┴──────────────┴──────────────┴──────────────┘
  মোট ফাঁকা মেমোরি: ৫০ MB (২০ MB + ৩০ MB)
\`\`\`

এখন আপনার অ্যাপ্লিকেশন যদি একটি নতুন **৪৫ মেগাবাইট বাফার** চায়, তবে সিস্টেমে ৫০ মেগাবাইট খালি মেমোরি থাকা সত্ত্বেও প্রোগ্রামটি **\`OutOfMemoryException\` ছুড়ে ক্র্যাশ করবে**, কারণ **একটানা ৪৫ মেগাবাইটের কোনো খালি ব্লক নেই**!

### সর্বদা Generation 2 এর অংশ:
LOH সবসময় **Generation 2** এর অন্তর্ভুক্ত থাকে। তাই বারবার বড় অ্যারে তৈরি ও ডিলিট করলে ঘন ঘন ব্যয়বহুল **Gen 2 Full GC** ট্রিগার হয়, যা সম্পূর্ণ সার্ভারকে ধীরগতির করে দেয়।

---

## উচ্চ-পারফরম্যান্স সমাধান: \`ArrayPool<T>\`

LOH-এ বারবার বড় অ্যারে তৈরি ও ধ্বংস করার সমস্যা থেকে বাঁচতে .NET এ **\`System.Buffers.ArrayPool<T>\`** ব্যবহার করা হয়:

\`\`\`csharp
using System.Buffers;

public static async Task ProcessLargeStreamAsync(Stream stream)
{
    // পুল থেকে একটি বড় বাফার ধার নেওয়া (বারবার ব্যবহারের সুবিধা)
    byte[] buffer = ArrayPool<byte>.Shared.Rent(90000);
    try
    {
        int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);
        ProcessBytes(buffer, bytesRead);
    }
    finally
    {
        // কাজ শেষে অবশ্যই পুলে ফেরত দিতে হবে
        ArrayPool<byte>.Shared.Return(buffer);
    }
}
\`\`\`

### ArrayPool ব্যবহারের সতর্কতা:
১. ধার নেওয়া অ্যারেটি আপনার চাওয়ার চেয়ে বড় হতে পারে (যেমন ৯০,০০০ চাইলে ১৩১,০৭২ সাইজের অ্যারে পেতে পারেন)। তাই সর্বদা আসল পঠিত দৈর্ঘ্য ট্র্যাক করতে হবে!
২. পূর্বে ব্যবহৃত বাফারে পুরোনো ডেটা থাকতে পারে। পাসওয়ার্ড বা গোপনীয় ডেটা থাকলে পুলে ফেরতের সময় \`clearArray: true\` পাস করতে হবে।

---

## আধুনিক .NET এর উন্নয়ন: POH এবং অন-ডিমান্ড কম্প্যাকশন

১. **পিন্ড অবজেক্ট হিপ - POH (.NET 5+)**:
   - যেসকল মেমোরি বাফার OS সকেট বা আনম্যানেজড কোডের জন্য পিন (Pinned) করে রাখতে হয়, সেগুলো এখন POH নামক আলাদা হিপে বরাদ্দ হয়। ফলে সাধারণ SOH মেমোরি অবাধে কম্প্যাক্ট হতে পারে।
২. **অন-ডিমান্ড LOH কম্প্যাকশন**:
   - প্রয়োজনে পরবর্তী ফুল জিসিতে LOH কম্প্যাক্ট করার নির্দেশ দেওয়া যায়:
   \`\`\`csharp
   GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
   GC.Collect(); // এই রানে LOH কম্প্যাক্ট হবে
   \`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #3 Problem K (Sum Digits)
*একটি সংখ্যা $N$ ($1 \le N \le 10^6$) এবং $N$ অঙ্কের একটি স্ট্রিং দেওয়া থাকবে। কোনো LOH মেমোরি খরচ না করে অঙ্কগুলোর যোগফল নির্ণয় করুন।*

#### সমাধান বিশ্লেষণ
১. $১,০০০,০০০$ দৈর্ঘ্যের একটি স্ট্রিং মেমরিতে প্রায় ২ মেগাবাইট জায়গা নেয়, যা সরাসরি LOH-এ গিয়ে মেমোরি ফ্র্যাগমেন্টেশন তৈরি করে।
২. পুরো স্ট্রিং মেমরিতে না রেখে স্ট্রিমের সাহায্যে সরাসরি ক্যারেক্টার বাই ক্যারেক্টার ইনপুট পড়লে মাত্র $\mathcal{O}(1)$ মেমরিতে যোগফল বের করা সম্ভব।

#### C# সমাধান

\`\`\`csharp
using System;
using System.IO;

public class Program
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;

        if (!int.TryParse(nLine.Trim(), out int n) || n <= 0) return;

        long digitSum = 0;
        TextReader reader = Console.In;

        // ইনপুট স্ট্রিম থেকে সরাসরি ক্যারেক্টার রিড করা
        // ফলে ২ MB সাইজের কোনো LOH স্ট্রিং তৈরি হয় না!
        int readCount = 0;
        while (readCount < n)
        {
            int ch = reader.Read();
            if (ch == -1) break;

            if (ch >= '0' && ch <= '9')
            {
                digitSum += (ch - '0');
                readCount++;
            }
        }

        Console.WriteLine(digitSum);
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\mathcal{O}(N)$, লিনিয়ার টাইমে $N$ সংখ্যক ক্যারেক্টার প্রসেস করে।
- **স্পেস কমপ্লেক্সিটি**: $\mathcal{O}(1)$ মেমোরি, LOH এর মেমোরি চাপ সম্পূর্ণ শূন্য।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Sum Digits](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/K) | Easy | Streaming character parsing, LOH bypass |
| ⚪ | Codeforces | [Assiut Sheet #3: Matrix](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/N) | Easy | 2D matrix manipulation, Contiguous memory |
| ⚪ | Exercism C# | [Resistor Color Trio](https://exercism.org/tracks/csharp/exercises/resistor-color-trio) | Easy | Metric unit scaling, Array pooling |
| ⚪ | Exercism C# | [Rotational Cipher](https://exercism.org/tracks/csharp/exercises/rotational-cipher) | Medium | Buffer reuse, In-place character transformation |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Sum Digits",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/K",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["LOH", "Streaming", "Math"],
      solutionEn:
        "Stream large string digits sequentially to accumulate their arithmetic sum without allocating multi-megabyte strings on the LOH.",
      solutionBn:
        "LOH-এ মাল্টি-মেগাবাইট স্ট্রিং তৈরি না করে ইনপুট স্ট্রিম থেকে সরাসরি অঙ্ক পড়ে তাদের যোগফল হিসাব করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Matrix",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/N",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Matrix", "2D Array", "Memory"],
      solutionEn:
        "Calculate the absolute difference between primary and secondary diagonal sums in an N x N square matrix.",
      solutionBn:
        "N x N বর্গাকার ম্যাট্রিক্সে প্রধান ও বিপরীত কর্ণের উপাদানগুলোর যোগফলের পরম পার্থক্য নির্ণয় করুন।",
    },
    {
      source: "Exercism C#",
      name: "Resistor Color Trio",
      url: "https://exercism.org/tracks/csharp/exercises/resistor-color-trio",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["ArrayPool", "Metric Units", "Lookup"],
      solutionEn:
        "Translate resistor color bands into quantified metric resistance units with zero redundant heap garbage.",
      solutionBn:
        "অপ্রয়োজনীয় হিপ মেমোরি খরচ ছাড়াই রেসিস্টরের কালার ব্যান্ড থেকে ওহম ও মেট্রিক ইউনিট গণনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Rotational Cipher",
      url: "https://exercism.org/tracks/csharp/exercises/rotational-cipher",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["Buffer", "ArrayPool", "In-place"],
      solutionEn:
        "Rotate characters using an in-place buffer pool to prevent continuous LOH allocations for large text payloads.",
      solutionBn:
        "বড় টেক্সট পেলোডের ক্ষেত্রে বারবার LOH মেমোরি খরচ এড়াতে বাফার পুল দিয়ে ক্যারেক্টার রোটেট করুন।",
    },
  ],
};
