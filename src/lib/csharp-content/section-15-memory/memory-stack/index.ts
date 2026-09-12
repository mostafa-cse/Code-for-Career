import type { LocalLesson } from "@/lib/lessons-data";

export const memoryStackLesson: LocalLesson = {
  slug: "memory-stack",
  titleEn: "Stack Memory & stackalloc",
  titleBn: "স্ট্যাক মেমোরি (Stack) ও stackalloc",
  categoryEn: "15. Memory Management",
  categoryBn: "১৫. মেমোরি ম্যানেজমেন্ট ও ইন্টারনালস",
  categoryDescEn:
    "CLR memory model: Stack vs Managed Heap, Garbage Collection internals, generational tuning (Gen 0/1/2), and Large Object Heap (LOH).",
  categoryDescBn:
    ".NET এ মেমোরি মডেল: স্ট্যাক বনাম ম্যানেজড হিপ, গার্বেজ কালেকশন (Mark-Sweep-Compact), জিসি জেনারেশন ও লার্জ অবজেক্ট হিপ (LOH)।",
  categoryPriority: "CORE",
  descriptionEn:
    "Thread-local stack memory architecture, stack frames, RSP pointer manipulation, stackalloc with Span<T>, and StackOverflowException prevention.",
  descriptionBn:
    "থ্রেড-লোকাল স্ট্যাক মেমোরি, স্ট্যাক ফ্রেম, RSP পয়েন্টার পরিচালনা, Span<T> এর সাথে stackalloc এবং StackOverflowException প্রতিরোধ।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["types-value-types"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Stack Memory & stackalloc in C#

In the .NET Common Language Runtime (CLR), memory allocation is divided fundamentally between the **Thread Stack** and the **Managed Heap**. Understanding the stack is essential for writing low-latency, zero-allocation C# code.

---

## Architecture of the Thread Stack

Every thread spawned in a .NET application is allocated its own dedicated stack space by the operating system:
- **Default Stack Size**: 1 MB on 64-bit Windows, 1.5 MB on Linux x64, 512 KB on iOS/macOS.
- **LIFO Allocation**: Operates strictly on a Last-In, First-Out (LIFO) basis.

\`\`\`
   High Memory Addresses
  ┌─────────────────────────────────┐
  │ Method A Stack Frame            │
  │  - Return Address               │
  │  - Saved Base Pointer (RBP)     │
  │  - Local Value Types (int x)    │
  │  - Reference Pointers (objPtr)  │
  ├─────────────────────────────────┤
  │ Method B Stack Frame            │
  │  - Arguments                    │
  │  - Local Variables              │
  └─────────────────────────────────┘ ◄── Stack Pointer (RSP)
   Low Memory Addresses (Grows downward)
\`\`\`

### Why the Stack is Ultra-Fast ($\mathcal{O}(1)$):
1. **CPU Register Pointer Bumping**: Allocating memory on the stack requires nothing more than subtracting bytes from the CPU's stack pointer register (\`RSP\`).
2. **Zero Garbage Collection Overhead**: When a method execution completes, the stack pointer increments back to the caller's frame. All local variables are instantly reclaimed without GC pauses or memory tracking tables.
3. **Cache Locality**: Stack memory is compact and sequential, keeping it hot in L1/L2 CPU caches.

---

## High-Performance Slicing: \`stackalloc\` & \`Span<T>\`

The **\`stackalloc\`** expression allocates a contiguous block of memory directly on the execution stack rather than on the managed heap:

\`\`\`csharp
// C# 7.2+ Safe Stack Allocation using Span<T>
Span<byte> buffer = stackalloc byte[256];

for (int i = 0; i < buffer.Length; i++)
{
    buffer[i] = (byte)i;
}
// Automatically freed when the containing method exits! Zero GC pressure.
\`\`\`

### Crucial Safety Rule: Bounded Thresholds
Because stack space is limited to ~1 MB, allocating variable user-supplied buffer sizes via \`stackalloc\` risks triggering an uncatchable crash:

\`\`\`csharp
// DANGEROUS: If count is 1,000,000, this crashes the entire process!
// Span<int> numbers = stackalloc int[count];

// SAFE: Conditional fallback pattern
const int StackThreshold = 512;
Span<int> safeBuffer = count <= StackThreshold 
    ? stackalloc int[count] 
    : new int[count]; // Fallback to heap if larger
\`\`\`

---

## The Uncatchable StackOverflowException

When deep recursion or massive stack allocations exceed the 1 MB thread limit, the CPU hits the stack guard page, triggering a **\`StackOverflowException\`**.

> **CRITICAL CLR RULE**: Unlike normal exceptions, a true hardware \`StackOverflowException\` **CANNOT be caught in a \`try-catch\` block**! The CLR immediately terminates the process (fail-fast) because the stack frame is hopelessly corrupted.

\`\`\`csharp
// Uncatchable fatal crash:
public static void InfiniteRecursion()
{
    try
    {
        InfiniteRecursion(); // Process dies! catch block NEVER executes.
    }
    catch (StackOverflowException ex)
    {
        Console.WriteLine("Will NEVER be printed!");
    }
}
\`\`\`

---

## Stack vs Heap Comparison

| Property | Stack Memory | Managed Heap Memory |
| :--- | :--- | :--- |
| **Allocation Speed** | Instantaneous ($\mathcal{O}(1)$ CPU pointer bump) | Fast ($\mathcal{O}(1)$ bump on SOH), but requires GC sweeps |
| **Lifetime** | Tied to method execution scope | Determined by object reachability from GC Roots |
| **Cleanup Cost** | Zero (freed on method return) | Requires Mark-Sweep-Compact GC pauses |
| **Size Limit** | ~1 MB per thread | Gigabytes (limited by machine virtual memory) |
| **Failure Mode** | Fatal \`StackOverflowException\` | \`OutOfMemoryException\` (catchable) |

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 Problem C (Replacement)
*Given an array of $N$ numbers. Replace every positive number with $1$ and every negative number with $2$. Print the modified array.*

#### Algorithmic Analysis
1. Read $N$ and the space-separated integer tokens.
2. In competitive programming, when $N$ is small, in-place transformation avoids unnecessary heap object instantiations.
3. Replace values conditionally: if $x > 0 \to 1$, if $x < 0 \to 2$, else leave $0$.

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

        // Using a fast stack buffer for small limits, or in-place token replacement
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < n; i++)
        {
            if (int.TryParse(tokens[i], out int val))
            {
                int replaced = val > 0 ? 1 : (val < 0 ? 2 : 0);
                sb.Append(replaced);
                if (i < n - 1) sb.Append(' ');
            }
        }

        Console.WriteLine(sb.ToString());
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(N)$, single-pass linear scan and transformation.
- **Space Complexity**: $\mathcal{O}(N)$ for output string building and token storage.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Replacement](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C) | Easy | In-place transformation, Value replacement |
| ⚪ | Codeforces | [Assiut Sheet #3: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | Array reversal, Stack LIFO order |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | In-place stack buffer reversing, \`Span<char>\` |
| ⚪ | Exercism C# | [Bracket Push](https://exercism.org/tracks/csharp/exercises/matching-brackets) | Medium | Stack LIFO verification, Balanced pairs |
`,

  contentBn: `# C# এ স্ট্যাক মেমোরি (Stack) ও stackalloc

.NET কমন ল্যাঙ্গুয়েজ রানটাইমে (CLR) মেমোরি বরাদ্দ মূলত দুটি জায়গায় ঘটে: **থ্রেড স্ট্যাক (Thread Stack)** এবং **ম্যানেজড হিপ (Managed Heap)**। হাই-পারফরম্যান্স ও জিরো-গার্বেজ কোড লেখার জন্য স্ট্যাকের অভ্যন্তরীণ গঠন বোঝা অত্যন্ত জরুরি।

---

## থ্রেড স্ট্যাকের অভ্যন্তরীণ আর্কিটেকচার

.NET অ্যাপ্লিকেশনের প্রতিটি থ্রেডের জন্য অপারেটিং সিস্টেমের পক্ষ থেকে একটি নির্দিষ্ট সাইজের স্ট্যাক মেমোরি বরাদ্দ থাকে:
- **ডিফল্ট সাইজ**: ৬৪-বিট উইন্ডোজে ১ মেগাবাইট (1 MB), লিনাক্সে ১.৫ মেগাবাইট এবং ম্যাক/আইওএসে ৫১২ কিলোবাইট।
- **LIFO বরাদ্দ**: এটি কঠোরভাবে Last-In, First-Out (LIFO) নিয়মে কাজ করে।

\`\`\`
   উচ্চ মেমোরি অ্যাড্রেস
  ┌─────────────────────────────────┐
  │ Method A স্ট্যাক ফ্রেম           │
  │  - রিটার্ন অ্যাড্রেস              │
  │  - সেভ করা বেস পয়েন্টার (RBP)    │
  │  - লোকাল ভ্যালু টাইপ (int x)     │
  │  - অবজেক্ট রেফারেন্স পয়েন্টার    │
  ├─────────────────────────────────┤
  │ Method B স্ট্যাক ফ্রেম           │
  │  - মেথড আর্গুমেন্ট               │
  │  - লোকাল ভেরিয়েবল              │
  └─────────────────────────────────┘ ◄── স্ট্যাক পয়েন্টার (RSP)
   নিম্ন মেমোরি অ্যাড্রেস (নিচের দিকে বাড়ে)
\`\`\`

### স্ট্যাক কেন বিদ্যুৎ গতির ($\mathcal{O}(1)$):
১. **সিপিইউ পয়েন্টার পরিচালনা**: স্ট্যাকে মেমোরি বরাদ্দের জন্য শুধুমাত্র সিপিইউর \`RSP\` রেজিস্টার থেকে প্রয়োজনীয় বাইট বিয়োগ করতে হয়।
২. **কোনো গার্বেজ কালেকশন নেই**: মেথডের কাজ শেষ হলে স্ট্যাক পয়েন্টার পূর্বের ফ্রেমে ফিরে আসে। কোনো GC লুপ বা টেবিল চেক ছাড়াই মেমোরি সাথে সাথে মুক্ত হয়ে যায়।
৩. **সিপিইউ ক্যাশ লোকালিটি**: স্ট্যাকের মেমোরি একটানা ও কাছাকাছি থাকায় এটি সিপিইউর L1/L2 ক্যাশে অবস্থান করে।

---

## হাই-পারফরম্যান্স মেমোরি স্লাইসিং: \`stackalloc\` ও \`Span<T>\`

হিপ মেমোরির বদলে সরাসরি মেথড স্ট্যাকে মেমোরি বরাদ্দ করার জন্য **\`stackalloc\`** ব্যবহৃত হয়:

\`\`\`csharp
// C# 7.2+ Span<T> এর সাহায্যে নিরাপদ স্ট্যাক বরাদ্দ
Span<byte> buffer = stackalloc byte[256];

for (int i = 0; i < buffer.Length; i++)
{
    buffer[i] = (byte)i;
}
// মেথড শেষ হওয়ার সাথে সাথে কোনো GC ছাড়াই মেমোরি মুক্ত হয়ে যায়!
\`\`\`

### নিরাপত্তার নিয়ম: বাউন্ডারি সীমা নির্ধারণ
যেহেতু স্ট্যাকের মোট আকার মাত্র ১ মেগাবাইট, তাই ইউজারের ইনপুটের ওপর নির্ভর করে বড় সাইজ \`stackalloc\` করলে সিস্টেম ক্র্যাশ করতে পারে:

\`\`\`csharp
// বিপজ্জনক: count এর মান বড় হলে পুরো প্রোগ্রাম ক্র্যাশ করবে!
// Span<int> numbers = stackalloc int[count];

// নিরাপদ উপায়: সাইজ ছোট হলে স্ট্যাক, বড় হলে হিপ ব্যবহার
const int StackThreshold = 512;
Span<int> safeBuffer = count <= StackThreshold 
    ? stackalloc int[count] 
    : new int[count];
\`\`\`

---

## অপরিবর্তনীয় StackOverflowException

অসীম রিকার্শন বা অতিরিক্ত স্ট্যাক মেমোরি ব্যবহারের কারণে স্ট্যাক গার্ড পেজ ভেঙে গেলে **\`StackOverflowException\`** ঘটে।

> **CLR এর অলঙ্ঘনীয় নিয়ম**: সাধারণ এক্সেপশনের মতো হার্ডওয়্যার \`StackOverflowException\` **\`try-catch\` দিয়ে ধরা যায় না**! মেমোরি ফ্রেম ক্ষতিগ্রস্ত হওয়া রোধ করতে CLR তাৎক্ষণিকভাবে প্রসেসটি বন্ধ (Fail-Fast) করে দেয়।

\`\`\`csharp
public static void InfiniteRecursion()
{
    try
    {
        InfiniteRecursion(); // প্রসেস ক্র্যাশ করবে! catch ব্লক কখনো চলবে না।
    }
    catch (StackOverflowException ex)
    {
        Console.WriteLine("এটি কখনো প্রিন্ট হবে না!");
    }
}
\`\`\`

---

## স্ট্যাক বনাম হিপ তুলনা

| বৈশিষ্ট্য | স্ট্যাক মেমোরি | ম্যানেজড হিপ মেমোরি |
| :--- | :--- | :--- |
| **বরাদ্দের গতি** | তাৎক্ষণিক ($\mathcal{O}(1)$ সিপিইউ পয়েন্টার বিয়োগ) | দ্রুত ($\mathcal{O}(1)$ পয়েন্টার বাম্প), তবে GC সুইপ প্রয়োজন |
| **লাইফটাইম** | মেথডের এক্সিকিউশন স্কোপের সাথে সম্পর্কিত | GC রুট থেকে অবজেক্টের পৌঁছানোর ক্ষমতার ওপর নির্ভর করে |
| **পরিষ্কার খরচ** | শূন্য (মেথড রিটার্ন করলেই মুক্ত) | Mark-Sweep-Compact ও থ্রেড পজ প্রয়োজন |
| **আকার সীমা** | থ্রেড প্রতি প্রায় ১ মেগাবাইট | গিগাবাইট (র‍্যামের ক্ষমতার ওপর নির্ভরশীল) |
| **ব্যর্থতার ফলাফল** | মারাত্মক \`StackOverflowException\` (ধরা যায় না) | \`OutOfMemoryException\` (ধরা যায়) |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #3 Problem C (Replacement)
*একটি সংখ্যা $N$ এবং $N$ আকারের একটি অ্যারে দেওয়া আছে। প্রতিটি ধনাত্মক সংখ্যাকে $1$ এবং ঋণাত্মক সংখ্যাকে $2$ দিয়ে প্রতিস্থাপন করে পরিবর্তিত অ্যারে প্রদর্শন করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে সংখ্যাগুলো রিড করা।
২. কন্ডিশনাল লজিক দিয়ে মান চেক করা: $x > 0$ হলে $1$, $x < 0$ হলে $2$, অন্যথায় $0$ অপরিবর্তিত রাখা।
৩. \`StringBuilder\` বাফারের সাহায্যে দ্রুত ফলাফল প্রিন্ট করা।

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

        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < n; i++)
        {
            if (int.TryParse(tokens[i], out int val))
            {
                int replaced = val > 0 ? 1 : (val < 0 ? 2 : 0);
                sb.Append(replaced);
                if (i < n - 1) sb.Append(' ');
            }
        }

        Console.WriteLine(sb.ToString());
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\mathcal{O}(N)$, একক লিনিয়ার স্ক্যানে সমস্ত উপাদান প্রসেস হয়।
- **স্পেস কমপ্লেক্সিটি**: আউটপুট স্ট্রিং সংরক্ষণে $\mathcal{O}(N)$ মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Replacement](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C) | Easy | In-place transformation, Value replacement |
| ⚪ | Codeforces | [Assiut Sheet #3: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | Array reversal, Stack LIFO order |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | In-place stack buffer reversing, \`Span<char>\` |
| ⚪ | Exercism C# | [Bracket Push](https://exercism.org/tracks/csharp/exercises/matching-brackets) | Medium | Stack LIFO verification, Balanced pairs |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Replacement",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Stack", "Array", "Conditionals"],
      solutionEn:
        "Iterate through the array and replace positive numbers with 1 and negative numbers with 2 using fast in-place evaluation.",
      solutionBn:
        "অ্যারে উপাদানগুলোর ওপর লুপ চালিয়ে ধনাত্মক সংখ্যাকে 1 এবং ঋণাত্মক সংখ্যাকে 2 দিয়ে দ্রুত প্রতিস্থাপন করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Reversing",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Stack", "LIFO", "Array"],
      solutionEn:
        "Reverse array elements in-place using two-pointer swaps mirroring stack LIFO behavior.",
      solutionBn:
        "স্ট্যাকের LIFO আচরণের মতো টু-পয়েন্টার সোয়াপিংয়ের মাধ্যমে অ্যারেকে ইন-প্লেস রিভার্স করুন।",
    },
    {
      source: "Exercism C#",
      name: "Reverse String",
      url: "https://exercism.org/tracks/csharp/exercises/reverse-string",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Span", "Stackalloc", "Strings"],
      solutionEn:
        "Reverse a UTF-16 string efficiently using a stack-allocated Span<char> buffer to eliminate heap garbage.",
      solutionBn:
        "হিপ মেমোরি খরচ পরিহার করে স্ট্যাক-অ্যালোকেটেড Span<char> বাফারের সাহায্যে স্ট্রিং রিভার্স করুন।",
    },
    {
      source: "Exercism C#",
      name: "Bracket Push",
      url: "https://exercism.org/tracks/csharp/exercises/matching-brackets",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["Stack", "LIFO", "Parsing"],
      solutionEn:
        "Verify nested brackets using a LIFO stack to assert that every opening bracket matches its corresponding closer.",
      solutionBn:
        "LIFO স্ট্যাক ডেটা স্ট্রাকচারের সাহায্যে বন্ধনীর সঠিক জোড়া এবং ভারসাম্য পরীক্ষা করুন।",
    },
  ],
};
