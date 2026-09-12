import type { LocalLesson } from "@/lib/lessons-data";

export const memoryHeapLesson: LocalLesson = {
  slug: "memory-heap",
  titleEn: "Managed Heap Architecture",
  titleBn: "ম্যানেজড হিপ (Managed Heap) আর্কিটেকচার",
  categoryEn: "15. Memory Management",
  categoryBn: "১৫. মেমোরি ম্যানেজমেন্ট ও ইন্টারনালস",
  categoryDescEn:
    "CLR memory model: Stack vs Managed Heap, Garbage Collection internals, generational tuning (Gen 0/1/2), and Large Object Heap (LOH).",
  categoryDescBn:
    ".NET এ মেমোরি মডেল: স্ট্যাক বনাম ম্যানেজড হিপ, গার্বেজ কালেকশন (Mark-Sweep-Compact), জিসি জেনারেশন ও লার্জ অবজেক্ট হিপ (LOH)।",
  categoryPriority: "CORE",
  descriptionEn:
    "Small Object Heap (SOH), object internal memory layout (SyncBlockIndex, MethodTable), pointer-bump allocation, TLABs, and GC Roots.",
  descriptionBn:
    "স্মল অবজেক্ট হিপ (SOH), অবজেক্টের অভ্যন্তরীণ মেমোরি লেআউট (SyncBlockIndex, MethodTable), পয়েন্টার-বাম্প স্পিড, TLAB ও GC রুট।",
  difficulty: "EASY",
  displayOrder: 2,
  prerequisites: ["memory-stack"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Managed Heap Architecture in C#

In the .NET Common Language Runtime (CLR), all reference type instances (objects, arrays, delegates, and boxed value types) live on the **Managed Heap**. The runtime controls the entire lifecycle of these objects, freeing software engineers from manual C/C++ memory management (\`malloc\` and \`free\`).

---

## The Anatomy of an Object on the Heap

Every reference type instance allocated on the 64-bit Managed Heap has a mandatory memory overhead of **16 bytes** before any fields are stored:

\`\`\`
  ┌─────────────────────────────────────────────────────────────┐
  │ Object Memory Layout on 64-bit CLR                          │
  ├────────────────────────────────────────┬────────────────────┤
  │ SyncBlockIndex (Header)               │ 8 Bytes            │
  ├────────────────────────────────────────┼────────────────────┤
  │ MethodTable Pointer (Type Handle)     │ 8 Bytes            │
  ├────────────────────────────────────────┼────────────────────┤
  │ Instance Fields (Payload)              │ Variable (Aligned) │
  ├────────────────────────────────────────┼────────────────────┤
  │ Padding (to align to 8-byte boundary) │ 0-7 Bytes          │
  └────────────────────────────────────────┴────────────────────┘
\`\`\`

1. **SyncBlockIndex (8 bytes on x64)**:
   - Stores monitor lock state when using the \`lock(obj)\` keyword.
   - Holds default hash codes computed by \`object.GetHashCode()\`.
   - Manages COM interop wrappers and GC marking metadata.
2. **MethodTable Pointer / Type Handle (8 bytes on x64)**:
   - Points to the CLR's internal \`MethodTable\` metadata describing the class.
   - Enables virtual method dispatch, interface resolution, and runtime type reflection (\`GetType()\`, \`is\`, \`as\`).
3. **The Minimum Object Size Invariant**:
   - Even an empty class (\`class Empty {}\`) consumes **24 bytes** on the 64-bit heap (8 bytes SyncBlock + 8 bytes MethodTable + 8 bytes minimum payload padding).

---

## High-Speed Allocation: Pointer Bumping & TLABs

A widespread myth in software engineering is that heap allocation is inherently slow. In the .NET CLR, Small Object Heap (SOH) allocation is nearly as fast as stack allocation:

\`\`\`csharp
// How the CLR allocates on the Small Object Heap (SOH):
// 1. Checks if current thread's TLAB has sufficient space:
// 2. Returns current allocation pointer and bumps it forward!
\`\`\`

### 1. The Pointer-Bump Mechanism:
- Rather than searching free-lists or memory bins (as in C/C++ \`malloc\`), the CLR maintains a contiguous pointer \`AllocPtr\`.
- Allocating an object requires only returning \`AllocPtr\` and incrementing it: \`AllocPtr += objectSize\`.
- This is a microscopic $\mathcal{O}(1)$ CPU operation taking just a few clock cycles!

### 2. Thread-Local Allocation Buffers (TLABs):
- To prevent multiple threads from contending over a single global allocation lock, the CLR assigns each thread its own dedicated **Thread-Local Allocation Buffer (TLAB)**.
- Threads allocate within their local TLAB independently without thread synchronization or locking.

---

## What Constitutes a GC Root?

An object on the managed heap is considered **alive** if there is an active reference path connecting it to a **GC Root**:

| Root Type | Source in Runtime | Lifespan |
| :--- | :--- | :--- |
| **Stack Roots** | Local variables and method parameters on any running thread stack | Scope of active method execution |
| **CPU Register Roots** | Object pointers held inside CPU hardware registers (\`RAX\`, \`RCX\`) | Duration of machine instruction execution |
| **Static Roots** | \`static\` fields declared on loaded classes | Life of the \`AppDomain\` / Process |
| **Handle Table Roots**| \`GCHandle\` references (Strong, Pinned, Weak) | Until manually freed via \`handle.Free()\` |
| **Finalization Roots** | Objects registered in the CLR finalization queue | Until their finalizer method executes |

If an object is not reachable from any of these roots, it is considered **garbage** and becomes eligible for reclamation during the next GC pass.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 Problem F (Reversing)
*Given an array $A$ of $N$ numbers. Print the array in reverse order.*

#### Algorithmic Analysis
1. Read the array length $N$ and the space-delimited elements.
2. In competitive programming, when reversing an array on the managed heap, a two-pointer swap reverses elements in-place with zero additional array allocations.
3. Output the reversed sequence efficiently.

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

        // Two-pointer in-place reversal on the managed heap array
        int left = 0;
        int right = n - 1;
        while (left < right)
        {
            int temp = numbers[left];
            numbers[left] = numbers[right];
            numbers[right] = temp;
            left++;
            right--;
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
- **Time Complexity**: $\mathcal{O}(N)$, linear parsing and $N/2$ swap operations.
- **Space Complexity**: $\mathcal{O}(N)$ for the heap-allocated integer array and output buffer.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | In-place array reversal, Two pointers |
| ⚪ | Codeforces | [Assiut Sheet #3: Search in Matrix](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/S) | Medium | 2D array heap representation, Value lookup |
| ⚪ | Exercism C# | [Grade School](https://exercism.org/tracks/csharp/exercises/grade-school) | Medium | Reference type associations, Heap collections |
| ⚪ | Exercism C# | [House](https://exercism.org/tracks/csharp/exercises/house) | Medium | Recursive heap string composition |
`,

  contentBn: `# C# এ ম্যানেজড হিপ (Managed Heap) আর্কিটেকচার

.NET কমন ল্যাঙ্গুয়েজ রানটাইমে (CLR) সমস্ত রেফারেন্স টাইপের অবজেক্ট (অবজেক্ট, অ্যারে, ডেলিগেট এবং বক্সড ভ্যালু টাইপ) **ম্যানেজড হিপে (Managed Heap)** সংরক্ষিত থাকে। রানটাইম স্বয়ংক্রিয়ভাবে এই অবজেক্টগুলোর লাইফসাইকেল নিয়ন্ত্রণ করে, ফলে ডেভেলপারকে C/C++ এর মতো ম্যানুয়ালি মেমোরি বরাদ্দের (\`malloc\` ও \`free\`) ঝামেলা পোহাতে হয় না।

---

## হিপে একটি অবজেক্টের মেমোরি গঠন

৬৪-বিট ম্যানেজড হিপে তৈরি হওয়া প্রতিটি রেফারেন্স টাইপ অবজেক্টে নিজস্ব ডেটা ফিল্ডের বাইরেও বাধ্যতামূলকভাবে **১৬ বাইট** অতিরিক্ত মেমোরি মেটাডেটা থাকে:

\`\`\`
  ┌─────────────────────────────────────────────────────────────┐
  │ ৬৪-বিট CLR এ অবজেক্টের মেমোরি লেআউট                         │
  ├────────────────────────────────────────┬────────────────────┤
  │ SyncBlockIndex (হেডার)                 │ ৮ বাইট             │
  ├────────────────────────────────────────┼────────────────────┤
  │ MethodTable Pointer (টাইপ হ্যান্ডেল)   │ ৮ বাইট             │
  ├────────────────────────────────────────┼────────────────────┤
  │ ইনস্ট্যান্স ফিল্ড (ডেটা পেলোড)          │ পরিবর্তনশীল         │
  ├────────────────────────────────────────┼────────────────────┤
  │ প্যাডিং (৮-বাইট বাউন্ডারি মেলাতে)     │ ০-৭ বাইট           │
  └────────────────────────────────────────┴────────────────────┘
\`\`\`

১. **SyncBlockIndex (৬৪-বিটে ৮ বাইট)**:
   - মাল্টি-থ্রেডিংয়ে \`lock(obj)\` কি-ওয়ার্ড ব্যবহারের সময় মনিটর লকের স্টেট ধারণ করে।
   - অবজেক্টের ডিফল্ট হ্যাশ কোড সংরক্ষণ করে।
   - COM ইন্টারপ এবং GC মার্কিংয়ের তথ্য রাখে।
২. **MethodTable Pointer / Type Handle (৬৪-বিটে ৮ বাইট)**:
   - CLR এর নিজস্ব \`MethodTable\` মেটাডেটার পয়েন্টার, যা ক্লাসের সমস্ত মেথড ও ইন্টারফেস ধারণ করে।
   - রানটাইমে ভার্চুয়াল মেথড ডিসপ্যাচ এবং টাইপ রিফ্লেকশন (\`GetType()\`, \`is\`, \`as\`) পরিচালনা করে।
৩. **ন্যূনতম অবজেক্ট সাইজের নিয়ম**:
   - কোনো ফিল্ড ছাড়া সম্পূর্ণ খালি একটি ক্লাসও (\`class Empty {}\`) ৬৪-বিট হিপে **২৪ বাইট** মেমোরি দখল করে (৮ বাইট SyncBlock + ৮ বাইট MethodTable + ৮ বাইট প্যাডিং)।

---

## দ্রুতগতির বরাদ্দ: পয়েন্টার বাম্পিং ও TLABs

অনেকের ধারণা হিপে মেমোরি বরাদ্দ করা ধীরগতির। কিন্তু .NET CLR-এ স্মল অবজেক্ট হিপে (SOH) বরাদ্দ স্ট্যাকের মতোই দ্রুতগতির:

### ১. পয়েন্টার-বাম্প মেকানিজম (Pointer-Bump):
- C/C++ এর \`malloc\` এর মতো খালি মেমোরির লিস্ট খোঁজার বদলে CLR একটানা মেমোরির একটি পয়েন্টার \`AllocPtr\` বজায় রাখে।
- একটি অবজেক্ট তৈরি করার সময় কেবল বর্তমান \`AllocPtr\` রিটার্ন করে সেটিকে অবজেক্টের সাইজ পরিমাণ বাড়িয়ে দেওয়া হয়: \`AllocPtr += objectSize\`।
- এটি মাত্র কয়েকটি সিপিইউ সাইকেলে সম্পন্ন হওয়া অত্যন্ত দ্রুত $\mathcal{O}(1)$ অপারেশন!

### ২. থ্রেড-লোকাল অ্যালোকেশন বাফার (TLAB):
- একসাথে বহু থ্রেড মেমোরি বরাদ্দ করার সময় যেন লকের কারণে আটকে না যায়, সেজন্য CLR প্রতিটি থ্রেডকে নিজস্ব **Thread-Local Allocation Buffer (TLAB)** দিয়ে দেয়।
- থ্রেডগুলো কোনো লক বা বিরোধ ছাড়াই নিজস্ব TLAB এর ভেতরে স্বাধীনভাবে দ্রুত অবজেক্ট তৈরি করে।

---

## GC রুট (GC Roots) কী?

ম্যানেজড হিপের কোনো অবজেক্ট ততক্ষণ পর্যন্ত **জীবিত** থাকে, যতক্ষণ না কোনো **GC রুট** থেকে তার সাথে সংযোগ পাওয়া যায়:

| রুটের ধরন | রানটাইমে উৎস | জীবনকাল |
| :--- | :--- | :--- |
| **স্ট্যাক রুট** | চলমান যেকোনো থ্রেডের লোকাল ভেরিয়েবল ও প্যারামিটার | সংশ্লিষ্ট মেথডের কার্যকাল |
| **সিপিইউ রেজিস্টার রুট** | সিপিইউর হার্ডওয়্যার রেজিস্টারে সংরক্ষিত অবজেক্ট পয়েন্টার | প্রসেসরের নির্দেশনার কার্যকাল |
| **স্ট্যাটিক রুট** | লোড হওয়া ক্লাসের \`static\` ফিল্ডসমূহ | সম্পূর্ণ অ্যাপ্লিকেশনের জীবনকাল |
| **হ্যান্ডেল টেবিল রুট**| \`GCHandle\` রেফারেন্স (Strong, Pinned) | ম্যানুয়ালি মুক্ত করার পূর্ব পর্যন্ত |
| **ফাইনালাইজেশন রুট** | ফাইনালাইজেশনের অপেক্ষায় থাকা অবজেক্টের তালিকা | মেথডটি সম্পন্ন হওয়া পর্যন্ত |

এই রুটগুলোর কোনোটির সাথেই যদি কোনো অবজেক্টের সংযোগ না থাকে, তবে সেটি **গার্বেজ** বা আবর্জনা হিসেবে চিহ্নিত হয় এবং পরবর্তী GC রানে মুক্ত হয়ে যায়।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #3 Problem F (Reversing)
*একটি সংখ্যা $N$ এবং $N$ আকারের একটি অ্যারে দেওয়া থাকবে। অ্যারের উপাদানগুলো বিপরীত ক্রমে প্রিন্ট করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট সাইজ এবং উপাদানগুলো রিড করে হিপ অ্যারেতে সংরক্ষণ করা।
২. টু-পয়েন্টার সোয়াপিংয়ের মাধ্যমে অতিরিক্ত মেমোরি ছাড়াই অ্যারেটিকে ইন-প্লেস রিভার্স করা।
৩. \`StringBuilder\` দিয়ে দ্রুত আউটপুট তৈরি করা।

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

        int left = 0;
        int right = n - 1;
        while (left < right)
        {
            int temp = numbers[left];
            numbers[left] = numbers[right];
            numbers[right] = temp;
            left++;
            right--;
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
- **টাইম কমপ্লেক্সিটি**: $\mathcal{O}(N)$, পার্সিং ও $N/2$ সোয়াপ অপারেশনে লিনিয়ার সময়।
- **স্পেস কমপ্লেক্সিটি**: হিপে অ্যারে এবং আউটপুট বাফারের জন্য $\mathcal{O}(N)$ মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | In-place array reversal, Two pointers |
| ⚪ | Codeforces | [Assiut Sheet #3: Search in Matrix](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/S) | Medium | 2D array heap representation, Value lookup |
| ⚪ | Exercism C# | [Grade School](https://exercism.org/tracks/csharp/exercises/grade-school) | Medium | Reference type associations, Heap collections |
| ⚪ | Exercism C# | [House](https://exercism.org/tracks/csharp/exercises/house) | Medium | Recursive heap string composition |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Reversing",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Heap", "Two Pointers", "Array"],
      solutionEn:
        "Reverse the heap-allocated array in-place using symmetric two-pointer element swaps.",
      solutionBn:
        "প্রতিসম টু-পয়েন্টার সোয়াপিংয়ের সাহায্যে হিপ-বরাদ্দকৃত অ্যারেকে ইন-প্লেস রিভার্স করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Search in Matrix",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/S",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["Heap", "2D Array", "Matrix"],
      solutionEn:
        "Traverse a 2D rectangular heap array to search for target value X and output 'will take number' or 'will not take number'.",
      solutionBn:
        "দ্বিমাত্রিক হিপ অ্যারেতে টার্গেট সংখ্যা X খুঁজে পেলে বা না পেলে সংশ্লিষ্ট মেসেজ প্রদর্শন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Grade School",
      url: "https://exercism.org/tracks/csharp/exercises/grade-school",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Heap", "Collections", "Sorting"],
      solutionEn:
        "Store student rosters mapped by grade on the managed heap and sort names alphabetically.",
      solutionBn:
        "গ্রেড অনুসারে শিক্ষার্থীদের তথ্য হিপ মেমোরিতে সংরক্ষণ করে নামের বর্ণানুক্রমে সাজিয়ে রাখুন।",
    },
    {
      source: "Exercism C#",
      name: "House",
      url: "https://exercism.org/tracks/csharp/exercises/house",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["Heap", "Strings", "Recursion"],
      solutionEn:
        "Construct cumulative nursery rhyme verses using string composition on the heap.",
      solutionBn:
        "হিপ মেমোরিতে স্ট্রিং কম্পোজিশনের মাধ্যমে ছড়ার ক্রমবর্ধমান শ্লোকগুলো তৈরি করুন।",
    },
  ],
};
