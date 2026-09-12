import type { LocalLesson } from "@/lib/lessons-data";

export const typesReferenceTypesLesson: LocalLesson = {
  slug: "types-reference-types",
  titleEn: "Reference Types",
  titleBn: "রেফারেন্স টাইপ (Reference Types) ও হিপ মেমোরি",
  categoryEn: "05. Type System",
  categoryBn: "০৫. টাইপ সিস্টেম ও মেমোরি মডেল",
  categoryDescEn:
    "The Common Type System (CTS) in .NET: value types vs reference types, boxing/unboxing overhead, var vs dynamic vs object.",
  categoryDescBn:
    ".NET এর কমন টাইপ সিস্টেম (CTS): ভ্যালু টাইপ বনাম রেফারেন্স টাইপ, বক্সিং/আনবক্সিং মেমোরি ওভারহেড এবং var/dynamic/object।",
  categoryPriority: "CORE",
  descriptionEn:
    "Managed heap allocation, 16-byte object headers, SyncBlockIndex, MethodTable pointers, string immutability, and GC generations.",
  descriptionBn:
    "ম্যানেজড হিপে মেমোরি বণ্টন, ১৬-বাইট অবজেক্ট হেডার, SyncBlockIndex, মেথড টেবিল পয়েন্টার, স্ট্রিং ইমিউটেবিলিটি ও GC জেনারেশন।",
  difficulty: "EASY",
  displayOrder: 2,
  prerequisites: ["types-value-types"],
  estimatedMinutes: 30,
  lastUpdated: "Recently updated",
  contentEn: `# Reference Types in C#

In the .NET Common Type System (CTS), a **reference type** does not store its actual data directly in the variable. Instead, the variable holds a **reference (an 8-byte memory address on 64-bit systems)** that points to an object allocated on the **managed heap**.

Reference types include all classes (\`class\`), interfaces (\`interface\`), delegates (\`delegate\`), records (\`record class\`), arrays (\`T[]\`), and strings (\`string\`).

---

## 64-Bit Managed Heap Object Memory Layout

Whenever you instantiate a reference type using \`new\`, the CLR allocates memory on the heap with a mandatory **16-byte header overhead**:

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                    Heap Object Instance                      │
├──────────────────────────────┬───────────────────────────────┤
│ SyncBlockIndex (8 bytes)     │ TypeHandle / MethodTable (8B) │
├──────────────────────────────┴───────────────────────────────┤
│ Instance Fields Data (Padded to 8-byte boundary alignment)   │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### 1. SyncBlockIndex (8 bytes)
- Points to a synchronization table entry in the CLR when the object is used with \`lock (obj)\`.
- Stores the default hash code computed by \`System.Object.GetHashCode()\` if not overridden.
- Stores Garbage Collection pinning and mark bits.

### 2. TypeHandle / MethodTable Pointer (8 bytes)
- Points to the type's **Method Table** in memory.
- Contains pointers to virtual methods (VTable), interface dispatch tables, and metadata for reflection.
- Enables runtime polymorphism: when you call a virtual method, the CLR uses this pointer to resolve the concrete implementation.

> **Minimum Object Size**: On a 64-bit CLR, even an empty object like \`new object()\` occupies **24 bytes** on the heap (8 bytes SyncBlock + 8 bytes MethodTable + 8 bytes minimum payload/alignment padding).

---

## Reference Assignment & Pointer Copying

When you assign one reference variable to another, **only the 8-byte memory address is copied** — not the underlying object data:

\`\`\`csharp
public class Employee
{
    public string Name { get; set; } = string.Empty;
    public decimal Salary { get; set; }
}

Employee emp1 = new Employee { Name = "Tamim", Salary = 75000m };
Employee emp2 = emp1; // Copies the 8-byte pointer; both point to the EXACT same heap object

emp2.Salary = 90000m;

// Because both point to the same heap address, emp1 sees the change:
Console.WriteLine(emp1.Salary); // 90000
Console.WriteLine(object.ReferenceEquals(emp1, emp2)); // True
\`\`\`

---

## Pass-by-Value vs Pass-by-Reference with Reference Types

An essential senior engineering distinction:
- **By Default (Passed by Value)**: When passing an object reference to a method, a **copy of the pointer** is passed. Mutating fields alters the heap object, but reassigning the variable does not affect the caller.
- **Using \`ref\` (Passed by Reference)**: The caller passes an alias to the reference variable itself. Reassigning the variable inside the method redirects the caller's variable to the new object!

\`\`\`csharp
public static void MutatePayload(Employee e)
{
    e.Salary += 5000m;          // Affects caller's object
    e = new Employee { Name = "New" }; // Does NOT affect caller's reference!
}

public static void ReassignReference(ref Employee e)
{
    e = new Employee { Name = "Reassigned", Salary = 100000m }; // Affects caller!
}
\`\`\`

---

## Special Reference Types: String & Arrays

### 1. \`string\` Immutability & The Intern Pool
- A \`string\` is a reference type, but operates with **value-like immutability**. Once allocated, its character buffer cannot be modified.
- Any operation like \`s += "extra"\` allocates an entirely new string object on the heap.
- The CLR maintains a **String Intern Pool**; identical string literals share the exact same memory address.

### 2. Arrays on the Heap
- Arrays (\`int[]\`, \`string[]\`) are reference types allocated as a contiguous block on the heap with:
  - 16-byte object header
  - 4-byte length indicator
  - The array elements laid out sequentially.

---

## Garbage Collector (GC) Generational Model

The CLR manages reference type lifetimes using an automatic generational tracing collector:

| Generation | Purpose | Typical Trigger / Frequency |
|---|---|---|
| **Gen 0** | Newly allocated small objects (local DTOs, string concatenations). | Very frequent; completes in microseconds. |
| **Gen 1** | Short-lived objects that survived Gen 0; serves as a buffer. | Intermediate frequency. |
| **Gen 2** | Long-lived objects (static singletons, caches, thread pools). | Infrequent; full GC sweeps can cause noticeable latency. |
| **LOH (Large Object Heap)** | Objects $\\ge$ 85,000 bytes (large arrays, bitmaps). | Not compacted by default to prevent expensive memory copying. |

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 — Problem M (Replace MinMax)
*Given an array of integers. Find the minimum and maximum elements in the array and swap their positions in place.*

#### Problem Analysis
- Input: Array length $N$ followed by $N$ integers.
- Goal: Pass the array (reference type) to a helper function that mutates the heap buffer in place.
- Memory: Because an array is a reference type, in-place modification avoids allocating a second array of size $N$.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class ReplaceMinMaxSolution
{
    // Mutates the heap-allocated array directly via its reference
    public static void SwapMinMax(int[] numbers)
    {
        if (numbers == null || numbers.Length < 2) return;

        int minIndex = 0;
        int maxIndex = 0;

        for (int i = 1; i < numbers.Length; i++)
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

        // In-place swap on the managed heap
        int temp = numbers[minIndex];
        numbers[minIndex] = numbers[maxIndex];
        numbers[maxIndex] = temp;
    }

    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;
        int n = int.Parse(nLine.Trim());

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] arr = new int[n];
        for (int i = 0; i < n; i++)
        {
            arr[i] = int.Parse(tokens[i], CultureInfo.InvariantCulture);
        }

        // Array reference passed by value; internal elements swapped in place
        SwapMinMax(arr);

        Console.WriteLine(string.Join(" ", arr));
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$ — single pass to find minimum and maximum indices.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary space — performs swap directly on the existing heap array buffer without extra allocations.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem M: Replace MinMax](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/M) | Easy | Reference Types, In-Place Array Mutation |
| ⚪ | Codeforces Assiut | [Problem F: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | Heap Array Traversal, In-Place Swapping |
| ⚪ | Exercism C# | [Need for Speed](https://exercism.org/tracks/csharp/exercises/need-for-speed) | Easy | Reference Types, Classes, Heap State |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | String Immutability, StringBuilder |
`,

  contentBn: `# C# এ রেফারেন্স টাইপ (Reference Types) ও হিপ মেমোরি

.NET এর কমন টাইপ সিস্টেমে (CTS) **রেফারেন্স টাইপ (Reference Type)** সরাসরি তার মেমোরি অবস্থানে ডেটা ধারণ করে না। পরিবর্তে, ভ্যারিয়েবলটিতে থাকে একটি **রেফারেন্স (৬৪-বিট সিস্টেমে ৮-বাইটের মেমোরি অ্যাড্রেস বা পয়েন্টার)** যা **ম্যানেজড হিপ (Managed Heap)**-এ সংরক্ষিত একটি অবজেক্টকে নির্দেশ করে।

সি# এর ক্লাস (\`class\`), ইন্টারফেস (\`interface\`), ডেলিগেট (\`delegate\`), রেকর্ড ক্লাস (\`record\`), অ্যারে (\`T[]\`) এবং স্ট্রিং (\`string\`) হলো রেফারেন্স টাইপের উদাহরণ।

---

## ৬৪-বিট ম্যানেজড হিপ অবজেক্টের মেমোরি লেআউট

\`new\` কি-ওয়ার্ডের মাধ্যমে হিপ মেমরিতে অবজেক্ট তৈরির সময় CLR প্রতিটি অবজেক্টের শুরুতে বাধ্যতামূলক **১৬-বাইটের অতিরিক্ত ওভারহেড** যুক্ত করে:

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                    Heap Object Instance                      │
├──────────────────────────────┬───────────────────────────────┤
│ SyncBlockIndex (৮ বাইট)      │ TypeHandle / MethodTable (৮B) │
├──────────────────────────────┴───────────────────────────────┤
│ Instance Fields Data (৮-বাইট বাউন্ডারি প্যাডিং সহ)           │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### ১. SyncBlockIndex (৮ বাইট)
- মাল্টিথ্রেডিংয়ে \`lock (obj)\` ব্যবহারের জন্য থ্রেড সিঙ্ক্রোনাইজেশন টেবিল এন্ট্রি পয়েন্ট করে।
- অবজেক্টের নিজস্ব হ্যাশ কোড সংরক্ষণ করে।
- গার্বেজ কালেক্টরের পিনিং ও মার্কিং বিট ধারণ করে।

### ২. TypeHandle / MethodTable Pointer (৮ বাইট)
- মেমোরিতে অবস্থিত টাইপের **ভার্চুয়াল মেথড টেবিল (VTable)** নির্দেশ করে।
- পলিমরফিজম নিশ্চিত করে: রানটাইমে কোনো ভার্চুয়াল মেথড কল হলে এই পয়েন্টারের মাধ্যমে সঠিক মেথড খুঁজে বের করা হয়।

> **ন্যূনতম অবজেক্ট সাইজ**: ৬৪-বিট CLR-এ একটি ফাঁকা অবজেক্টও (\`new object()\`) হিপ মেমোরিতে **২৪ বাইট** জায়গা নেয় (১৬ বাইট হেডার + ৮ বাইট প্যাডিং)।

---

## রেফারেন্স অ্যাসাইনমেন্ট ও পয়েন্টার কপি

একটি রেফারেন্স চলককে অন্যটিতে অ্যাসাইন করলে অবজেক্টটি কপি হয় না, কেবল **৮-বাইটের পয়েন্টার অ্যাড্রেসটি কপি হয়**:

\`\`\`csharp
public class Employee
{
    public string Name { get; set; } = string.Empty;
    public decimal Salary { get; set; }
}

Employee emp1 = new Employee { Name = "Tamim", Salary = 75000m };
Employee emp2 = emp1; // শুধু ৮-বাইটের মেমোরি অ্যাড্রেস কপি হলো; একই হিপ অবজেক্টকে নির্দেশ করে

emp2.Salary = 90000m;

// একই মেমোরি অবজেক্ট হওয়ায় emp1 এর মানও পরিবর্তিত দেখাবে:
Console.WriteLine(emp1.Salary); // 90000
Console.WriteLine(object.ReferenceEquals(emp1, emp2)); // True
\`\`\`

---

## Pass-by-Value বনাম Pass-by-Reference

সফটওয়্যার ইঞ্জিনিয়ারিং ইন্টারভিউয়ের একটি গুরুত্বপূর্ণ বিষয়:
- **ডিফল্ট পাস (Pass by Value)**: রেফারেন্স টাইপ মেথডে পাঠালে পয়েন্টারের একটি কপি পাঠানো হয়। ফলে অবজেক্টের প্রোপার্টি পরিবর্তন করলে তা বহাল থাকে, কিন্তু নতুন অবজেক্ট অ্যাসাইন করলে মূল ভ্যারিয়েবল প্রভাবিত হয় না।
- **\`ref\` ব্যবহার (Pass by Reference)**: মেথডের ভেতর নতুন অবজেক্ট তৈরি করে রেফারেন্স বদলে দিলে কলারের মূল চলকটিও নতুন অবজেক্ট নির্দেশ করে।

\`\`\`csharp
public static void MutatePayload(Employee e)
{
    e.Salary += 5000m;          // মূল অবজেক্টের মান পরিবর্তন হবে
    e = new Employee { Name = "New" }; // কলারের রেফারেন্সে কোনো প্রভাব পড়বে না!
}

public static void ReassignReference(ref Employee e)
{
    e = new Employee { Name = "Reassigned", Salary = 100000m }; // কলারের রেফারেন্স পরিবর্তিত হবে!
}
\`\`\`

---

## বিশেষ রেফারেন্স টাইপ: String ও Arrays

### ১. \`string\` এর ইমিউটেবিলিটি ও ইন্টার্নিং পুল
- \`string\` একটি রেফারেন্স টাইপ হওয়া সত্ত্বেও এটি ভ্যালুর মতো অপরিবর্তনীয় (Immutable)।
- লুপের ভেতর বারবার \`s += "data"\` করলে হিপ মেমরিতে প্রচুর অতিরিক্ত অবজেক্ট তৈরি হয় (এক্ষেত্রে \`StringBuilder\` ব্যবহার করা উচিত)।
- CLR মেমোরি বাঁচাতে একই স্ট্রিং লিটারালকে ইন্টার্নিং পুলে রেখে একই মেমোরি অ্যাড্রেস শেয়ার করে।

### ২. হিপে অ্যারে সংরক্ষণ
- অ্যারে (\`int[]\`, \`string[]\`) হিপে একটি নিরবচ্ছিন্ন মেমোরি ব্লক হিসেবে অবস্থান করে, যার সাথে ১৬ বাইটের হেডার এবং ৪ বাইটের দৈর্ঘ্য সংরক্ষিত থাকে।

---

## গার্বেজ কালেক্টরের (GC) জেনারেশন মডেল

| জেনারেশন | উদ্দেশ্য ও ভূমিকা | কালেকশন ফ্রিকোয়েন্সি |
|---|---|---|
| **Gen 0** | নতুন তৈরি হওয়া স্বল্পজীবী অবজেক্ট (লোকাল DTO, স্ট্রিং কনক্যাটেনেট)। | খুব ঘন ঘন; মাইক্রোসেকেন্ডে সম্পন্ন হয়। |
| **Gen 1** | Gen 0 টিকে থাকা অবজেক্টের জন্য ট্রানজিশন বাফার। | মাঝারি ফ্রিকোয়েন্সি। |
| **Gen 2** | দীর্ঘজীবী অবজেক্ট (স্ট্যাটিক ডাটা, ক্যাশ, সিঙ্গেলটন)। | খুব কম সময় হয়; বড় অ্যাপ্লিকেশনে সামান্য বিলম্ব হতে পারে। |
| **LOH (Large Object Heap)** | ৮৫,০০০ বাইটের বড় অবজেক্ট। | ডিফল্টভাবে কম্প্যাক্ট করা হয় না মেমোরি কপি বাঁচাতে। |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #৩ — Problem M (Replace MinMax)
*একটি অ্যারে থেকে সর্বনিম্ন ও সর্বোচ্চ সংখ্যা খুঁজে বের করে সরাসরি তাদের অবস্থান অদলবদল (Swap) করতে হবে।*

#### সমাধান বিশ্লেষণ
- অ্যারে একটি রেফারেন্স টাইপ হওয়ায় মেথডে অ্যারির পয়েন্টার পাঠানো হয়।
- কোনো নতুন অ্যারে তৈরি না করেই মূল হিপ মেমোরিতে সরাসরি ইন-প্লেস সোয়াপ সম্পন্ন করা যায়।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class ReplaceMinMaxSolution
{
    public static void SwapMinMax(int[] numbers)
    {
        if (numbers == null || numbers.Length < 2) return;

        int minIndex = 0;
        int maxIndex = 0;

        for (int i = 1; i < numbers.Length; i++)
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

        // হিপ মেমরিতে থাকা উপাদানের মধ্যে সোয়াপ
        int temp = numbers[minIndex];
        numbers[minIndex] = numbers[maxIndex];
        numbers[maxIndex] = temp;
    }

    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;
        int n = int.Parse(nLine.Trim());

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] arr = new int[n];
        for (int i = 0; i < n; i++)
        {
            arr[i] = int.Parse(tokens[i], CultureInfo.InvariantCulture);
        }

        // রেফারেন্সের মাধ্যমে সরাসরি হিপ অ্যারেতে পরিবর্তন
        SwapMinMax(arr);

        Console.WriteLine(string.Join(" ", arr));
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$ — অ্যারির উপাদানগুলোতে একবার ট্রাভার্স করে ইনডেক্স নির্ধারণ।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত স্পেস — কোনো নতুন অ্যারে বরাদ্দ না করেই কাজ সম্পন্ন।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem M: Replace MinMax](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/M) | Easy | Reference Types, In-Place Array Mutation |
| ⚪ | Codeforces Assiut | [Problem F: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | Heap Array Traversal, In-Place Swapping |
| ⚪ | Exercism C# | [Need for Speed](https://exercism.org/tracks/csharp/exercises/need-for-speed) | Easy | Reference Types, Classes, Heap State |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | String Immutability, StringBuilder |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #3",
      name: "Problem M: Replace MinMax",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/M",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Reference Types", "Arrays", "In-Place"],
      solutionEn: "Pass the array reference to mutate the minimum and maximum elements in place on the managed heap.",
      solutionBn: "অ্যারে রেফারেন্স ব্যবহার করে হিপ মেমোরিতে থাকা সর্বনিম্ন ও সর্বোচ্চ উপাদান সরাসরি সোয়াপ করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #3",
      name: "Problem F: Reversing",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Reference Types", "Arrays", "Pointers"],
      solutionEn: "Reverse array elements by swapping pointers from two ends without allocating a secondary buffer.",
      solutionBn: "নতুন মেমোরি বরাদ্দ না করে দুই প্রান্ত থেকে উপাদান সোয়াপ করে অ্যারে রিভার্স করুন।",
    },
    {
      source: "Exercism C#",
      name: "Need for Speed",
      url: "https://exercism.org/tracks/csharp/exercises/need-for-speed",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Reference Types", "Heap", "Classes"],
      solutionEn: "Model stateful car objects on the managed heap with mutable battery and distance fields.",
      solutionBn: "হিপ মেমোরিতে ক্লাস ইনস্ট্যান্স সংরক্ষণ করে ব্যাটারি ও দূরত্বের মিউটেবল স্টেট ট্র্যাক করুন।",
    },
    {
      source: "Exercism C#",
      name: "Squeaky Clean",
      url: "https://exercism.org/tracks/csharp/exercises/squeaky-clean",
      difficulty: "EASY",
      company: "Kaz Software",
      tags: ["Reference Types", "Strings", "StringBuilder"],
      solutionEn: "Use StringBuilder to sanitize identifier strings without generating excess heap allocation garbage.",
      solutionBn: "অতিরিক্ত স্ট্রিং অ্যালোকেশন পরিহার করতে StringBuilder দিয়ে স্ট্রিং ফিল্টারিং সম্পন্ন করুন।",
    },
  ],
};
