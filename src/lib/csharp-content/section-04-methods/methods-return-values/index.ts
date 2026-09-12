import type { LocalLesson } from "@/lib/lessons-data";

export const methodsReturnValuesLesson: LocalLesson = {
    slug: "methods-return-values",
    titleEn: "Return Values & Tuples",
    titleBn: "রিটার্ন ভ্যালু ও ভ্যালুটুপল (ValueTuple)",
    categoryEn: "04. Methods",
    categoryBn: "০৪. মেথড ও ফাংশন",
    categoryDescEn:
      "Reusable function architecture in C#: parameter evaluation, passing semantics (by-value vs by-reference), overloading, and modern params features.",
    categoryDescBn:
      "সি# এ ফাংশন ও মেথড আর্কিটেকচার: প্যারামিটার মূল্যায়ন, ভ্যালু বনাম রেফারেন্স পাসিং, ওভারলোডিং এবং মডার্ন প্যারামস।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Void vs typed returns, guard clauses (early return pattern), multiple return values via ValueTuples, and static local functions.",
    descriptionBn:
      "ভয়েড বনাম টাইপড রিটার্ন, গার্ড ক্লজ (আর্লি রিটার্ন প্যাটার্ন), ভ্যালুটুপল দিয়ে একাধিক মান ফেরত দেওয়া এবং স্ট্যাটিক লোকাল ফাংশন।",
    difficulty: "EASY",
    displayOrder: 2,
    prerequisites: ["methods-parameters"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# Return Values & ValueTuples in C#

Methods in C# either execute without yielding a value (\`void\`) or return a strongly typed result (\`T\`). Modern C# provides lightweight **ValueTuples** to return multiple named values without allocating heap objects.

---

## 1. Void vs Typed Return Contracts

- **\`void\`**: The method completes actions solely through side effects (e.g., writing to console, mutating state). It exits naturally at the end of the block or prematurely via a bare \`return;\` statement.
- **Typed Return (\`T\`)**: The method promises to produce a value of type \`T\`. The C# compiler enforces the **Definite Return Rule**: every possible code path must conclude with a \`return value;\` statement or throw an exception.

\`\`\`csharp
public static string GetStatus(int statusCode)
{
    if (statusCode == 200) return "OK";
    if (statusCode == 404) return "Not Found";
    
    // Compiler error CS0161 if this fallback return is omitted!
    return "Unknown Status";
}
\`\`\`

---

## 2. Guard Clauses & The Return Early Pattern

Nested \`if-else\` ladders create code that drifts rightwards into an unreadable "Pyramid of Doom". **Guard clauses** invert this antipattern by validating preconditions and returning immediately:

\`\`\`csharp
// BAD: Deeply nested pyramid
public decimal ProcessDiscount(Order? order)
{
    if (order != null)
    {
        if (order.IsActive)
        {
            if (order.TotalAmount > 1000m)
            {
                return order.TotalAmount * 0.15m;
            }
        }
    }
    return 0m;
}

// GOOD: Clean, flat guard clauses
public decimal ProcessDiscountClean(Order? order)
{
    if (order == null || !order.IsActive) return 0m;
    if (order.TotalAmount <= 1000m) return 0m;

    return order.TotalAmount * 0.15m; // Main logic stays un-nested
}
\`\`\`

---

## 3. Returning Multiple Values: The Evolution to ValueTuple

Historically, returning multiple values from a C# method required cumbersome workarounds:
1. **\`out\` Parameters**: Fragmented calling syntax, cannot be used with \`async/await\`.
2. **Old \`System.Tuple\`**: A heap-allocated reference class, causing GC allocation, with ugly properties (\`.Item1\`, \`.Item2\`).
3. **Modern \`System.ValueTuple\` (C# 7.0+)**: A **mutable struct on the stack** that produces **zero heap allocations** and supports expressive naming:

\`\`\`csharp
// Declaring a method returning a named ValueTuple
public static (int Min, int Max) FindMinMax(int[] numbers)
{
    int min = numbers[0], max = numbers[0];
    foreach (int n in numbers)
    {
        if (n < min) min = n;
        if (n > max) max = n;
    }
    return (min, max);
}

// 1. Invoking and accessing by name
var stats = FindMinMax(new[] { 15, 3, 42, 8 });
Console.WriteLine($"Min: {stats.Min}, Max: {stats.Max}");

// 2. Deconstructing into discrete local variables
(int minimum, int maximum) = FindMinMax(new[] { 15, 3, 42, 8 });

// 3. Deconstruction with discard (_)
(int onlyMin, _) = FindMinMax(new[] { 15, 3, 42, 8 });
\`\`\`

---

## 4. Static Local Functions

C# 7+ allows declaring helper methods directly inside other methods. Adding the \`static\` keyword (C# 8+) guarantees that the local function **does not capture enclosing local variables**, preventing compiler closure class allocations:

\`\`\`csharp
public static int ComputeFactorialSum(int n)
{
    int sum = 0;
    for (int i = 1; i <= n; i++)
    {
        sum += Factorial(i);
    }
    return sum;

    // Static local function: cannot accidentally capture 'sum' or 'n'
    static int Factorial(int val)
    {
        int res = 1;
        for (int k = 2; k <= val; k++) res *= k;
        return res;
    }
}
\`\`\`

---

## 5. Comparison: Return Strategies

| Strategy | Memory Location | GC Overhead? | Supports Named Fields? | Async Friendly? |
|---|---|---|---|---|
| **Single Value (\`T\`)** | Stack | None | N/A | **Yes** |
| **\`ValueTuple\` (\`(T1, T2)\`)** | **Stack (struct)** | **None (Zero GC)** | **Yes** | **Yes** |
| **\`out\` Parameters** | Caller Stack Pointer | None | No | **No** |
| **Custom \`record\` / \`class\`** | Managed Heap | Yes (GC tracked) | Yes | **Yes** |

---

## Practical Problem Walkthrough

### Problem: Max and Min via Function
*Source: Codeforces Assiut University Training Sheet #5 — Problem G*

**Problem Statement**:
Given an array $A$ of $N$ numbers. Write a function that finds and prints the minimum and maximum values in the array.

**Constraints**:
$1 \\le N \\le 1000$, $-10^5 \\le A_i \\le 10^5$.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    // Returns multiple values via stack-allocated ValueTuple
    public static (int Min, int Max) GetMinMax(int[] arr)
    {
        int min = arr[0];
        int max = arr[0];

        for (int i = 1; i < arr.Length; i++)
        {
            if (arr[i] < min) min = arr[i];
            if (arr[i] > max) max = arr[i];
        }

        return (min, max);
    }

    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] arr = new int[n];

        for (int i = 0; i < n; i++)
        {
            arr[i] = int.Parse(tokens[i]);
        }

        (int minVal, int maxVal) = GetMinMax(arr);
        Console.WriteLine($"{minVal} {maxVal}");
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N)$ — single linear pass through $N$ elements.
- **Space Complexity**: $O(1)$ auxiliary memory — the \`ValueTuple\` is returned on the stack without heap allocation.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem G: Max and MIN](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/G) | Easy | ValueTuples, Array scanning |
| ⚪ | Codeforces Assiut | [Problem H: N Times](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/H) | Easy | Void methods, Repetition |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Return collections, Top-N |
| ⚪ | Exercism C# | [Booking up to go](https://exercism.org/tracks/csharp/exercises/booking-up-for-beauty) | Easy | Typed returns, DateTime |
`,

    contentBn: `# C# এ রিটার্ন ভ্যালু ও ভ্যালুটুপল (ValueTuple)

সি# এ একটি মেথড কোনো মান তৈরি না করে কাজ সম্পন্ন করতে পারে (\`void\`), অথবা নির্দিষ্ট টাইপের ফলাফল ফেরত দিতে পারে (\`T\`)। আধুনিক সি# এ হিপ মেমোরিতে কোনো অবজেক্ট তৈরি না করেই একাধিক মান একসাথে রিটার্ন করার জন্য **ValueTuple** ব্যবহৃত হয়।

---

## ১. ভয়েড বনাম টাইপড রিটার্ন কন্ট্রাক্ট

- **\`void\`**: মেথডটি কোনো মান ফেরত দেয় না, শুধুমাত্র সাইড-ইফেক্টের (যেমন: কনসোলে প্রিন্ট বা স্টেট পরিবর্তন) মাধ্যমে কাজ শেষ করে।
- **টাইপড রিটার্ন (\`T\`)**: মেথডটি অবশ্যই \`T\` টাইপের একটি ডেটা ফেরত দেওয়ার অঙ্গীকার করে। কম্পাইলার নিশ্চিত করে যেন প্রতিটি শর্তাধীন পথেই একটি মান্য \`return\` স্টেটমেন্ট থাকে।

---

## ২. গার্ড ক্লজ ও আর্লি রিটার্ন প্যাটার্ন

অতিরিক্ত নেস্টেড \`if-else\` কোডকে ডানদিকে ঠেলে দেয় এবং জটিল করে তোলে। **গার্ড ক্লজ (Guard Clauses)** ব্যবহারের মাধ্যমে শর্ত অপূর্ণ থাকলে শুরুতেই রিটার্ন করে কোডকে সমতল ও পাঠযোগ্য রাখা যায়:

\`\`\`csharp
// ক্ষতিকর রীতি: পিরামিড সদৃশ জটিল নেস্টিং
public decimal ProcessDiscount(Order? order)
{
    if (order != null)
    {
        if (order.IsActive)
        {
            if (order.TotalAmount > 1000m)
            {
                return order.TotalAmount * 0.15m;
            }
        }
    }
    return 0m;
}

// মানসম্মত রীতি: ক্লিন গার্ড ক্লজ
public decimal ProcessDiscountClean(Order? order)
{
    if (order == null || !order.IsActive) return 0m;
    if (order.TotalAmount <= 1000m) return 0m;

    return order.TotalAmount * 0.15m;
}
\`\`\`

---

## ৩. ভ্যালুটুপল (ValueTuple) দিয়ে একাধিক মান রিটার্ন

পূর্বে একাধিক মান ফেরত দিতে \`out\` প্যারামিটার বা পুরাতন \`System.Tuple\` ক্লাস লাগত, যা হিপ মেমোরি খরচ করত।

C# 7 এ যুক্ত হওয়া **\`ValueTuple\`** হলো একটি স্ট্যাক-অ্যালোকেটেড স্ট্রাক্ট যা **কোনো গার্বেজ তৈরি না করেই** একাধিক নামযুক্ত মান রিটার্ন করে:

\`\`\`csharp
// নামযুক্ত ভ্যালুটুপল রিটার্ন
public static (int Min, int Max) FindMinMax(int[] numbers)
{
    int min = numbers[0], max = numbers[0];
    foreach (int n in numbers)
    {
        if (n < min) min = n;
        if (n > max) max = n;
    }
    return (min, max);
}

// সরাসরি ডিকনস্ট্রাকশন
(int minimum, int maximum) = FindMinMax(new[] { 15, 3, 42, 8 });

// ডিসকার্ড (_) দিয়ে অপ্রয়োজনীয় মান বাদ দেওয়া
(int onlyMin, _) = FindMinMax(new[] { 15, 3, 42, 8 });
\`\`\`

---

## ৪. স্ট্যাটিক লোকাল ফাংশন

মেথডের ভেতর কেবল সেই মেথডেই ব্যবহৃত হবে এমন ছোট হেল্পার ফাংশন লেখার জন্য লোকাল ফাংশন ব্যবহৃত হয়। \`static\` কিওয়ার্ড দিলে লোকাল ফাংশন বাইরের চলক ক্যাপচার করতে পারে না, ফলে মেমোরি অ্যালোকেশন সম্পূর্ণ শূন্য থাকে:

\`\`\`csharp
public static int ComputeFactorialSum(int n)
{
    int sum = 0;
    for (int i = 1; i <= n; i++) sum += Factorial(i);
    return sum;

    // স্ট্যাটিক লোকাল ফাংশন: জিরো মেমোরি খরচ
    static int Factorial(int val)
    {
        int res = 1;
        for (int k = 2; k <= val; k++) res *= k;
        return res;
    }
}
\`\`\`

---

## ৫. রিটার্ন কৌশলের তুলনামূলক সারণী

| কৌশল | মেমোরি অবস্থান | GC চাপ তৈরি করে? | নামযুক্ত প্রোপার্টি? | অ্যাসিঙ্ক ফ্রেন্ডলি? |
|---|---|---|---|---|
| **একক মান (\`T\`)** | স্ট্যাক | না | প্রযোজ্য নয় | **হ্যাঁ** |
| **\`ValueTuple\`** | **স্ট্যাক (স্ট্রাক্ট)** | **না (জিরো GC)** | **হ্যাঁ** | **হ্যাঁ** |
| **\`out\` প্যারামিটার** | কলার স্ট্যাক পয়েন্টার | না | না | **না** |
| **কাস্টম ক্লাস/রেকর্ড** | ম্যানেজড হিপ | হ্যাঁ (GC ট্র্যাকড) | হ্যাঁ | **হ্যাঁ** |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ফাংশনের মাধ্যমে সর্বোচ্চ ও সর্বনিম্ন মান নির্ণয়
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৫ — Problem G*

**সমস্যা পরিচিতি**:
$N$ আকারের একটি অ্যারে $A$ দেওয়া থাকবে। একটি ফাংশন তৈরি করুন যা অ্যারে থেকে সর্বনিম্ন ও সর্বোচ্চ মান খুঁজে বের করে প্রিন্ট করবে।

**সীমাবদ্ধতা**:
$1 \\le N \\le 1000$, $-10^5 \\le A_i \\le 10^5$।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    // স্ট্যাক-অ্যালোকেটেড ভ্যালুটুপল দিয়ে দুটি মান রিটার্ন
    public static (int Min, int Max) GetMinMax(int[] arr)
    {
        int min = arr[0];
        int max = arr[0];

        for (int i = 1; i < arr.Length; i++)
        {
            if (arr[i] < min) min = arr[i];
            if (arr[i] > max) max = arr[i];
        }

        return (min, max);
    }

    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] arr = new int[n];

        for (int i = 0; i < n; i++)
        {
            arr[i] = int.Parse(tokens[i]);
        }

        (int minVal, int maxVal) = GetMinMax(arr);
        Console.WriteLine($"{minVal} {maxVal}");
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N)$ — অ্যারের উপাদানগুলোর ওপর একক স্ক্যান।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ অক্সিলিয়ারি মেমোরি — ভ্যালুটুপল স্ট্যাকে তৈরি হওয়ায় কোনো হিপ মেমোরি খরচ হয় না।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem G: Max and MIN](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/G) | Easy | ValueTuples, Array scanning |
| ⚪ | Codeforces Assiut | [Problem H: N Times](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/H) | Easy | Void methods, Repetition |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Return collections, Top-N |
| ⚪ | Exercism C# | [Booking up to go](https://exercism.org/tracks/csharp/exercises/booking-up-for-beauty) | Easy | Typed returns, DateTime |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem G: Max and MIN",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/G",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Methods", "ValueTuple", "MinMax"],
        solutionEn: "Return both minimum and maximum values in a single pass using a ValueTuple.",
        solutionBn: "ভ্যালুটুপল ব্যবহার করে একপাস স্ক্যানে সর্বনিম্ন ও সর্বোচ্চ মান ফেরত দিন।",
      },
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem H: N Times",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/H",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Methods", "Void", "Loops"],
        solutionEn: "Write a void method PrintNTimes(int n, char c) that outputs a character N times.",
        solutionBn: "নির্দিষ্ট চিহ্ন N বার প্রিন্ট করার জন্য PrintNTimes ভয়েড মেথড লিখুন।",
      },
      {
        source: "Exercism C#",
        name: "High Scores",
        url: "https://exercism.org/tracks/csharp/exercises/high-scores",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "Collections", "Returns"],
        solutionEn: "Return typed integer collections and top scores from stateful score histories.",
        solutionBn: "স্কোর হিস্টোরি থেকে শীর্ষ স্কোরগুলো কালেকশন আকারে রিটার্ন করুন।",
      },
      {
        source: "Exercism C#",
        name: "Booking up to go",
        url: "https://exercism.org/tracks/csharp/exercises/booking-up-for-beauty",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "DateTime", "Returns"],
        solutionEn: "Return boolean validation flags and formatted strings based on appointment dates.",
        solutionBn: "তারিখের ওপর ভিত্তি করে বুলিয়ান যাচাইকরণ ও ফরম্যাটেড স্ট্রিং রিটার্ন করুন।",
      },
    ],
  };
