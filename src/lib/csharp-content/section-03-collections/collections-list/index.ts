import type { LocalLesson } from "@/lib/lessons-data";

export const collectionsListLesson: LocalLesson = {
    slug: "collections-list",
    titleEn: "List<T>",
    titleBn: "লিস্ট (List<T>) ও ডায়নামিক রিসাইজিং",
    categoryEn: "03. Collections",
    categoryBn: "০৩. কালেকশনস ও ডেটা স্ট্রাকচার",
    categoryDescEn:
      "Essential data structures in .NET: fixed arrays, dynamic lists, hash-based sets and dictionaries, and FIFO/LIFO queues.",
    categoryDescBn:
      ".NET এর অপরিহার্য ডেটা স্ট্রাকচার: ফিক্সড অ্যারে, ডায়নামিক লিস্ট, হ্যাশ ডিকশনারি, সেট এবং কিউ/স্ট্যাক।",
    categoryPriority: "CORE",
    descriptionEn:
      "Generic dynamic arrays, internal capacity doubling, amortized O(1) addition, Count vs Capacity, version tracking, and collection methods.",
    descriptionBn:
      "জেনেরিক ডায়নামিক অ্যারে, অভ্যন্তরীণ মেমোরি দ্বিগুণকরণ, অ্যামরটাইজড O(1) ইনসার্শন, কাউন্ট বনাম ক্যাপাসিটি এবং ভার্সন ট্র্যাকিং।",
    difficulty: "EASY",
    displayOrder: 2,
    prerequisites: ["collections-array"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# List<T> in C#

\`System.Collections.Generic.List<T>\` is the workhorse dynamic collection in modern .NET development. It wraps a primitive array to provide strongly typed, indexable access with automatic capacity management.

---

## 1. Internal Architecture: How List<T> Really Works

Under the hood, \`List<T>\` is a lightweight wrapper maintaining three core fields:
1. \`T[] _items\`: The underlying primitive backing array allocated on the managed heap.
2. \`int _size\`: The number of elements currently stored (exposed via the public \`Count\` property).
3. \`int _version\`: An internal counter incremented on every mutating operation to detect concurrent modification during iteration.

\`\`\`
List<T> Object (Stack / Heap)
├── _items   ────────► [ 10 | 20 | 30 | 40 | null | null | null | null ]  (Capacity = 8)
├── _size    ────────► 4  (Count = 4)
└── _version ────────► 5  (Mutation counter)
\`\`\`

---

## 2. Capacity Growth & Amortized $O(1)$ Analysis

### The Doubling Mechanism
- **Default State**: A default \`new List<T>()\` initializes \`_items\` with an empty static array (\`Array.Empty<T>()\`). No memory is wasted.
- **First Addition**: When the first element is added, \`List<T>\` allocates an initial capacity of **4**.
- **Doubling on Overflow**: When \`Count == Capacity\` and another item is added:
  1. A new backing array with **double the capacity** ($2 \\times C$) is allocated on the heap ($4 \\to 8 \\to 16 \\to 32 \\dots$).
  2. All existing elements are copied over via \`Array.Copy()\` (costing $O(N)$ operations).
  3. The old backing array becomes garbage and is collected by the Garbage Collector (GC).

### Mathematical Amortized $O(1)$ Proof
Although an individual resize costs $O(N)$, geometric doubling guarantees that resizes happen exponentially less often. Inserting $N$ items into an empty list requires only:
$$N + \\frac{N}{2} + \\frac{N}{4} + \\dots + 4 \\approx 2N \\text{ total copies}$$
Dividing $2N$ operations by $N$ insertions yields an **average amortized cost of $O(1)$ per addition**.

### Performance Best Practice: Pre-Allocating Capacity
If you anticipate the number of elements, always specify the initial capacity upfront:
\`\`\`csharp
// BAD: Triggers multiple reallocations and GC memory churn
var list = new List<int>();
for (int i = 0; i < 100000; i++) list.Add(i);

// GOOD: Zero reallocations, single heap allocation
var list = new List<int>(100000);
for (int i = 0; i < 100000; i++) list.Add(i);
\`\`\`

---

## 3. Comprehensive Time Complexities

| Operation | Method | Time Complexity | Notes |
|---|---|---|---|
| **Append to End** | \`Add(item)\` | **$O(1)$ Amortized** | $O(N)$ worst-case only when doubling |
| **Random Access** | \`list[i]\` | **$O(1)$** | Direct array indexing |
| **Prepend / Insert** | \`Insert(index, item)\` | **$O(N)$** | All elements to the right must be shifted |
| **Remove by Value** | \`Remove(item)\` | **$O(N)$** | Linear search ($O(N)$) + left shift ($O(N)$) |
| **Remove by Index** | \`RemoveAt(index)\` | **$O(N)$** | Left shift of remaining elements |
| **Linear Search** | \`Contains(item)\` / \`IndexOf\` | **$O(N)$** | Sequential equality check |
| **Binary Search** | \`BinarySearch(item)\` | **$O(\\log N)$** | Requires list to be pre-sorted |
| **In-place Sort** | \`Sort()\` | **$O(N \\log N)$** | Hybrid Introsort algorithm |
| **Clear** | \`Clear()\` | **$O(1)$ or $O(N)$** | $O(1)$ for primitives; $O(N)$ for refs to clear GC roots |

---

## 4. Guardrails & Concurrent Modification Trap

Every time you call \`Add\`, \`Remove\`, or \`Sort\`, the CLR increments \`_version++\`.

When you iterate with \`foreach\`, the enumerator checks:
\`\`\`csharp
if (_version != _list._version)
{
    throw new InvalidOperationException("Collection was modified; enumeration operation may not execute.");
}
\`\`\`

### Safe Mutating Patterns:
\`\`\`csharp
var numbers = new List<int> { 1, 2, 3, 4, 5, 6 };

// Pattern 1: Iterate backwards with index
for (int i = numbers.Count - 1; i >= 0; i--)
{
    if (numbers[i] % 2 == 0) numbers.RemoveAt(i);
}

// Pattern 2: Use RemoveAll (O(N) optimized in-place compaction)
numbers.RemoveAll(x => x % 2 == 0);
\`\`\`

---

## 5. Modern C# 12 Collection Expressions

In modern C# 12+, dynamic lists can be instantiated cleanly using bracket notation and the spread operator (\`..\`):

\`\`\`csharp
List<string> backend = ["C#", "ASP.NET Core", "PostgreSQL"];
List<string> frontend = ["TypeScript", "React"];

// Combining lists with spread operator
List<string> fullStack = [..backend, ..frontend, "Docker"];
\`\`\`

### Read-Only Encapsulation
Expose internal lists safely to callers without allowing external modifications:
\`\`\`csharp
public class Department
{
    private readonly List<string> _staff = new();
    
    // Exposes a live read-only wrapper without copying
    public IReadOnlyList<string> Staff => _staff.AsReadOnly();
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Replacement in List
*Source: Codeforces Assiut University Training Sheet #3 — Problem C*

**Problem Statement**:
Given a list of $N$ numbers. Replace every positive number with $1$ and every negative number with $2$. Keep $0$ as $0$. Print the modified list.

**Constraints**:
$2 \\le N \\le 1000$, $-10^5 \\le A_i \\le 10^5$.

### C# Solution:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Pre-allocate capacity to eliminate internal array resizes
        List<int> numbers = new List<int>(n);

        for (int i = 0; i < n; i++)
        {
            int val = int.Parse(tokens[i]);

            if (val > 0)
            {
                numbers.Add(1);
            }
            else if (val < 0)
            {
                numbers.Add(2);
            }
            else
            {
                numbers.Add(0);
            }
        }

        Console.WriteLine(string.Join(" ", numbers));
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N)$ — single pass over the $N$ tokens with $O(1)$ amortized additions.
- **Space Complexity**: $O(N)$ — pre-allocated capacity list for $N$ integers.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem C: Replacement](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C) | Easy | Dynamic lists, Value substitution |
| ⚪ | Codeforces Assiut | [Problem D: Positions in array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/D) | Easy | Index access, Filtering |
| ⚪ | Codeforces Assiut | [Problem E: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | Linear search, Min tracking |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | List sorting, Top-N elements |
`,

    contentBn: `# C# এ লিস্ট (List<T>) ও ডায়নামিক রিসাইজিং

\`System.Collections.Generic.List<T>\` হলো আধুনিক .NET সফটওয়্যার ডেভেলপমেন্টের সর্বাধিক ব্যবহৃত ডায়নামিক ডেটা স্ট্রাকচার। এটি মূলত একটি আদিম অ্যারের ওপর শক্তিশালী র‍্যাপার হিসেবে কাজ করে, যা স্বয়ংক্রিয়ভাবে মেমোরি প্রসারণ এবং ইনডেক্সযোগ্য টাইপ-নিরাপদ সুবিধা দেয়।

---

## ১. অভ্যন্তরীণ আর্কিটেকচার: কীভাবে কাজ করে List<T>?

\`List<T>\` মূলত ৩টি প্রধান অভ্যন্তরীণ ফিল্ড দিয়ে পরিচালিত হয়:
১. \`T[] _items\`: ম্যানেজড হিপে তৈরি হওয়া মূল আদিম অ্যারে।
২. \`int _size\`: বর্তমানে কতটি উপাদান সংরক্ষিত আছে (পাবলিক \`Count\` প্রোপার্টি)।
৩. \`int _version\`: প্রতিবার ডেটা পরিবর্তন হলে এটি বৃদ্ধি পায়, যা আইটারেশন চলাকালীন পরিবর্তন শনাক্ত করে।

---

## ২. মেমোরি দ্বিগুণকরণ ও অ্যামরটাইজড $O(1)$ এর প্রমাণ

### ক্যাপাসিটি দ্বিগুণকরণ প্রক্রিয়া
- **শুরুর অবস্থা**: \`new List<T>()\` শুরুতে শূন্য মেমোরি খরচ করে একটি স্ট্যাটিক খালি অ্যারে নির্দেশ করে।
- **প্রথম সংযোজন**: প্রথম উপাদান যোগ করার সাথে সাথে ডিফল্টভাবে **৪** সাইজের ব্যাক আপ অ্যারে তৈরি হয়।
- **অ্যালোকেশন দ্বিগুণকরণ**: যখন \`Count == Capacity\` হয়ে যায় এবং নতুন উপাদান আসে:
  ১. আগের ক্যাপাসিটির **দ্বিগুণ** ($২ \\times C$) আকারের নতুন অ্যারে হিপে তৈরি হয় ($৪ \\to ৮ \\to ১৬ \\to ৩২ \\dots$)।
  ২. পূর্বের সমস্ত উপাদান \`Array.Copy()\` এর মাধ্যমে নতুন অ্যারেতে কপি হয় (যা $O(N)$ কাজ)।
  ৩. পুরাতন অ্যারেটি গার্বেজ কালেক্টর (GC) মেমোরি থেকে মুছে ফেলে।

### গাণিতিক অ্যামরটাইজড $O(1)$ ব্যাখ্যা
একটি নির্দিষ্ট রিসাইজিংয়ে $O(N)$ সময় লাগলেও জ্যামিতিক হারে ক্যাপাসিটি দ্বিগুণ হওয়ার ফলে রিসাইজের ঘটনা ক্রমান্বয়ে বিরল হয়ে পড়ে। $N$ টি উপাদান যোগ করতে মোট প্রায় $২N$ টি কপি অপারেশন লাগে। ফলে গড়ে প্রতি \`Add()\` এর সময় জটিলতা দাঁড়ায় **অ্যামরটাইজড $O(1)$**।

### পারফরম্যান্স পরামর্শ: পূর্বেই ক্যাপাসিটি নির্ধারণ
উপাদান সংখ্যা জানা থাকলে শুরুতেই ক্যাপাসিটি দিয়ে দেওয়া উচিত:
\`\`\`csharp
// অপ্রয়োজনীয় মেমোরি কপি ও GC চাপ এড়াতে
var list = new List<int>(100000);
\`\`\`

---

## ৩. অপারেশনের সময় জটিলতার বিস্তারিত সারণী

| অপারেশন | মেথড | সময় জটিলতা | বিশদ ব্যাখ্যা |
|---|---|---|---|
| **শেষে যোগ করা** | \`Add(item)\` | **$O(1)$ Amortized** | রিসাইজ ছাড়া সরাসরি শেষে বসে |
| **ইনডেক্স এক্সেস** | \`list[i]\` | **$O(1)$** | সরাসরি মেমোরি অফসেট রিড |
| **নির্দিষ্ট স্থানে ইনসার্ট** | \`Insert(index, item)\` | **$O(N)$** | ডানপাশের সমস্ত উপাদান সরাতে হয় |
| **মান মুছে ফেলা** | \`Remove(item)\` | **$O(N)$** | সার্চ করা এবং বামে উপাদান সরানো |
| **ইনডেক্স ধরে মোছা** | \`RemoveAt(index)\` | **$O(N)$** | বামে উপাদান সরানো |
| **লিনিয়ার সার্চ** | \`Contains\` / \`IndexOf\` | **$O(N)$** | ক্রমানুসারে সমতা যাচাই |
| **বাইনারি সার্চ** | \`BinarySearch\` | **$O(\\log N)$** | সর্টেড তালিকার জন্য প্রযোজ্য |
| **সর্টিং** | \`Sort()\` | **$O(N \\log N)$** | ইন্ট্রোসার্ট অ্যালগরিদম |

---

## ৪. আইটারেশন চলাকালীন পরিবর্তনজনিত ত্রুটি

লুপে থাকা অবস্থায় \`list.Add()\` বা \`list.Remove()\` কল করলে \`_version\` বৃদ্ধি পায় এবং রানটাইমে \`InvalidOperationException\` ঘটে।

### নিরাপদ অপসরণের ২টি সঠিক উপায়:
\`\`\`csharp
var numbers = new List<int> { 1, 2, 3, 4, 5, 6 };

// কৌশল ১: বিপরীত দিক থেকে ইনডেক্স লুপ চালানো
for (int i = numbers.Count - 1; i >= 0; i--)
{
    if (numbers[i] % 2 == 0) numbers.RemoveAt(i);
}

// কৌশল ২: RemoveAll মেথড ব্যবহার করা (সবচেয়ে দ্রুত)
numbers.RemoveAll(x => x % 2 == 0);
\`\`\`

---

## ৫. আধুনিক C# 12 কালেকশন এক্সপ্রেশন

আধুনিক সি# এ ব্র্যাকেট সিনট্যাক্স এবং স্প্রেড অপারেটর (\`..\`) দিয়ে সহজেই লিস্ট তৈরি করা যায়:

\`\`\`csharp
List<string> backend = ["C#", "ASP.NET Core", "PostgreSQL"];
List<string> frontend = ["TypeScript", "React"];

// স্প্রেড অপারেটর দিয়ে দুটি লিস্ট একত্র করা
List<string> fullStack = [..backend, ..frontend, "Docker"];
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: লিস্টে সংখ্যা প্রতিস্থাপন (Replacement)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৩ — Problem C*

**সমস্যা পরিচিতি**:
$N$ টি পূর্ণসংখ্যার একটি তালিকা দেওয়া থাকবে। প্রতিটি ধনাত্মক সংখ্যাকে $1$ এবং ঋণাত্মক সংখ্যাকে $2$ দ্বারা প্রতিস্থাপন করুন। $0$ অপরিবর্তিত থাকবে। পরিবর্তিত তালিকাটি প্রিন্ট করুন।

**সীমাবদ্ধতা**:
$2 \\le N \\le 1000$, $-10^5 \\le A_i \\le 10^5$।

### সি# সমাধান:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // অভ্যন্তরীণ অ্যারে রিসাইজ এড়াতে আগেই ক্যাপাসিটি নির্ধারণ
        List<int> numbers = new List<int>(n);

        for (int i = 0; i < n; i++)
        {
            int val = int.Parse(tokens[i]);

            if (val > 0)
            {
                numbers.Add(1);
            }
            else if (val < 0)
            {
                numbers.Add(2);
            }
            else
            {
                numbers.Add(0);
            }
        }

        Console.WriteLine(string.Join(" ", numbers));
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N)$ — $N$ টি ইনপুট একবার প্রক্রিয়াকরণ এবং প্রতি সংযোজনে $O(1)$ সময়।
- **স্পেস কমপ্লেক্সিটি**: $O(N)$ — $N$ টি পূর্ণসংখ্যার জন্য লিস্টের মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem C: Replacement](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C) | Easy | Dynamic lists, Value substitution |
| ⚪ | Codeforces Assiut | [Problem D: Positions in array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/D) | Easy | Index access, Filtering |
| ⚪ | Codeforces Assiut | [Problem E: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | Linear search, Min tracking |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | List sorting, Top-N elements |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem C: Replacement",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["List", "Conditionals", "Replacement"],
        solutionEn: "Pre-allocate list capacity and replace positive with 1 and negative with 2.",
        solutionBn: "লিস্টের ক্যাপাসিটি নির্ধারণ করে ধনাত্মককে ১ ও ঋণাত্মককে ২ দিয়ে প্রতিস্থাপন করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem D: Positions in array",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/D",
        difficulty: "EASY",
        company: "Brain Station 23",
        tags: ["List", "Filtering", "Index"],
        solutionEn: "Iterate through elements and print index and value for items <= 10.",
        solutionBn: "তালিকার উপাদান স্ক্যান করে ১০ বা তার ছোট সংখ্যার ইনডেক্স ও মান প্রিন্ট করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem E: Lowest Number",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["List", "Search", "Min"],
        solutionEn: "Find the minimum value and its 1-based position in one linear scan.",
        solutionBn: "একক লিনিয়ার স্ক্যানে সর্বনিম্ন মান এবং তার ১-ভিত্তিক পজিশন খুঁজে বের করুন।",
      },
      {
        source: "Exercism C#",
        name: "High Scores",
        url: "https://exercism.org/tracks/csharp/exercises/high-scores",
        difficulty: "EASY",
        company: null,
        tags: ["List", "Sorting", "TopN"],
        solutionEn: "Track high scores using a list and query latest, best, and top three elements.",
        solutionBn: "লিস্টে স্কোর সংরক্ষণ করে সর্বশেষ, সর্বোচ্চ এবং শীর্ষ তিনটি স্কোর বের করুন।",
      },
    ],
  };
