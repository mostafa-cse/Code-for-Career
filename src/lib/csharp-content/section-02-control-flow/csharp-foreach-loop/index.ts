import type { LocalLesson } from "@/lib/lessons-data";

export const csharpForeachLoopLesson: LocalLesson = {
    slug: "csharp-foreach-loop",
    titleEn: "foreach Loop",
    titleBn: "ফরইচ (foreach) লুপ ও আইট্যারেশন",
    categoryEn: "02. Control Flow",
    categoryBn: "০২. কন্ট্রোল ফ্লো ও শর্তাধীন লজিক",
    categoryDescEn:
      "Decision-making statements, pattern matching switches, iteration loops, and performance implications of loop constructs.",
    categoryDescBn:
      "শর্তাধীন সিদ্ধান্ত গ্রহণ, সুইচ স্টেটমেন্ট, বিভিন্ন ধরনের লুপ এবং পুনরাবৃত্তিমূলক লজিক।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "IEnumerable iteration, IEnumerator compiler lowering, duck typing, zero-allocation array iteration, and Span<T> in C#.",
    descriptionBn:
      "IEnumerable ও IEnumerator এর কম্পাইলার লোয়ারিং, ডাক টাইপিং, জিরো-অ্যালোকেশন অ্যারে আইটারেশন এবং Span<T>।",
    difficulty: "EASY",
    displayOrder: 6,
    prerequisites: ["csharp-for-loop"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# foreach Loop in C#

The \`foreach\` statement executes a statement or a block of statements for each element in an instance of a type that implements the \`System.Collections.IEnumerable\` or \`System.Collections.Generic.IEnumerable<T>\` interface, or any type matching the **pattern-based enumerator contract**.

---

## 1. Under the Hood: Compiler Lowering & IEnumerator<T>

When you write a high-level \`foreach\` loop:

\`\`\`csharp
foreach (string name in namesList)
{
    Console.WriteLine(name);
}
\`\`\`

The C# compiler lowers this code into a \`while\` loop wrapped in a \`try-finally\` resource cleanup block:

\`\`\`csharp
IEnumerator<string> enumerator = namesList.GetEnumerator();
try
{
    while (enumerator.MoveNext())
    {
        string name = enumerator.Current;
        Console.WriteLine(name);
    }
}
finally
{
    enumerator?.Dispose();
}
\`\`\`

### The Three Enumerator Contracts:
1. **\`GetEnumerator()\`**: Requests an enumerator object positioned right before the first element.
2. **\`MoveNext()\`**: Advances to the next item; returns \`true\` if an element exists, or \`false\` if the collection is exhausted.
3. **\`Current\`**: A read-only property returning the element at the current cursor position.

---

## 2. Duck Typing & Zero-Allocation Enumeration

A type **does not even need to implement \`IEnumerable\`** to support \`foreach\`! The C# compiler relies on **pattern-based duck typing**. Any type can be iterated with \`foreach\` as long as it exposes:
- A public method \`GetEnumerator()\` that returns an object or \`struct\`.
- That returned type must contain a public parameterless method \`bool MoveNext()\` and a public property \`Current\`.

### Why This Matters: \`Span<T>\` & High-Performance C#
Because \`ref struct\` types like \`Span<T>\` and \`ReadOnlySpan<T>\` cannot implement interfaces, pattern-based enumeration allows them to be traversed with \`foreach\` with **zero heap allocations**:

\`\`\`csharp
ReadOnlySpan<int> numbers = stackalloc int[] { 10, 20, 30, 40 };

int sum = 0;
foreach (int val in numbers) // Zero GC allocation!
{
    sum += val;
}
\`\`\`

---

## 3. Compiler Array Optimization

When enumerating over a single-dimensional array (\`T[]\`), the C# compiler **never creates an enumerator object**. It automatically optimizes the code into a standard index-based \`for\` loop:

\`\`\`csharp
// You write:
foreach (var item in array) { Process(item); }

// Compiler emits IL equivalent to:
for (int i = 0; i < array.Length; i++)
{
    var item = array[i];
    Process(item);
}
\`\`\`
This achieves zero heap allocations and takes advantage of **Bounds Check Elimination (BCE)**.

---

## 4. Invariants & Guardrails

### A. The Iteration Variable is Strictly Read-Only
In C#, you cannot reassign the loop variable:
\`\`\`csharp
int[] scores = { 80, 90, 100 };

foreach (var score in scores)
{
    // ❌ COMPILE ERROR: Cannot assign to 'score' because it is a 'foreach iteration variable'
    // score = score + 5;
}
\`\`\`
*(Note: If the element is a reference type, you can mutate its properties, but you cannot reassign the reference variable itself).*

### B. Modifying Collections During Enumeration
Attempting to add or remove elements while iterating throws a runtime \`InvalidOperationException\`:

\`\`\`csharp
var list = new List<int> { 1, 2, 3, 4, 5 };

foreach (var item in list)
{
    if (item == 3)
    {
        // ❌ RUNTIME EXCEPTION: Collection was modified; enumeration operation may not execute.
        list.Remove(item);
    }
}
\`\`\`

### How to Safely Remove Elements:
1. **Iterate backwards using a \`for\` loop**:
   \`\`\`csharp
   for (int i = list.Count - 1; i >= 0; i--)
   {
       if (list[i] == 3) list.RemoveAt(i);
   }
   \`\`\`
2. **Use \`RemoveAll\`**:
   \`\`\`csharp
   list.RemoveAll(item => item == 3);
   \`\`\`
3. **Iterate over a snapshot copy**:
   \`\`\`csharp
   foreach (var item in list.ToList())
   {
       if (item == 3) list.Remove(item);
   }
   \`\`\`

---

## 5. Modern Language Features with \`foreach\`

### A. Dictionary & Tuple Deconstruction (C# 7.0+)
\`\`\`csharp
var salaryMap = new Dictionary<string, int>
{
    ["Enosis"] = 75000,
    ["Brain Station 23"] = 80000,
    ["BJIT"] = 72000
};

// Deconstructing KeyValuePair directly into key and value
foreach (var (company, salary) in salaryMap)
{
    Console.WriteLine($"{company} pays {salary} BDT");
}
\`\`\`

### B. Index Access with \`Index()\` (.NET 9+)
In earlier C#, tracking an index required an external counter variable. In .NET 9+, you can use the LINQ \`.Index()\` method:

\`\`\`csharp
var employees = new List<string> { "Rahim", "Karim", "Farhan" };

foreach (var (index, employee) in employees.Index())
{
    Console.WriteLine($"Rank #{index + 1}: {employee}");
}
\`\`\`

### C. Ref Iteration (\`ref readonly\`)
Avoid copying large structs during each loop pass:
\`\`\`csharp
Span<LargeMatrixStruct> matrices = GetMatrices();

foreach (ref readonly var matrix in matrices)
{
    // 'matrix' is passed by reference without copying 64+ bytes per step
    matrix.Render();
}
\`\`\`

---

## 6. Comparison: \`foreach\` vs \`for\`

| Feature | \`foreach\` Loop | \`for\` Loop |
|---|---|---|
| **Primary Intent** | Reading sequence elements | Counter range, array indexing |
| **Index Access** | No direct index (requires \`.Index()\`) | Direct integer index (\`i\`) |
| **Collection Types** | Any \`IEnumerable\` / Duck typed | Arrays, \`List<T>\`, indexed types |
| **Array Performance** | Identical (lowered to \`for\`) | Identical (BCE optimized) |
| **List Performance** | Struct enumerator (zero alloc) | Direct indexer (zero alloc) |
| **Safety** | Prevents off-by-one errors | Manual index management required |

---

## Practical Problem Walkthrough

### Problem: Array Summation
*Source: Codeforces Assiut University Training Sheet #3 — Problem A*

**Problem Statement**:
Given an array $A$ of $N$ numbers. Print the absolute value of the summation of its numbers.

**Constraints**:
$1 \\le N \\le 10^5$, $-10^9 \\le A_i \\le 10^9$.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

        long[] numbers = new long[n];
        for (int i = 0; i < n; i++)
        {
            numbers[i] = long.Parse(tokens[i]);
        }

        // Summation using foreach iteration
        long totalSum = 0;
        foreach (long val in numbers)
        {
            totalSum += val; // Prevents 32-bit overflow using 64-bit accumulator
        }

        long absoluteSum = Math.Abs(totalSum);
        Console.WriteLine(absoluteSum);
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N)$ — single linear pass through $N$ elements in the \`foreach\` loop.
- **Space Complexity**: $O(N)$ — array allocation for storing $N$ numbers.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem A: Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/A) | Easy | Foreach loop, 64-bit accumulator |
| ⚪ | Codeforces Assiut | [Problem B: Searching](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B) | Easy | Linear scan, Early exit |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | List iteration, Linq / Foreach |
| ⚪ | Exercism C# | [Sum of Multiples](https://exercism.org/tracks/csharp/exercises/sum-of-multiples) | Easy | Sets, Foreach collection traversal |
`,

    contentBn: `# C# এ ফরইচ (foreach) লুপ ও আইট্যারেশন

\`foreach\` স্টেটমেন্ট এমন যেকোনো কালেকশনের প্রতিটি উপাদানের জন্য কোড ব্লককে এক্সিকিউট করে যা \`System.Collections.IEnumerable\` বা \`IEnumerable<T>\` ইন্টারফেস ইমপ্লিমেন্ট করে, অথবা **প্যাটার্ন-ভিত্তিক আইট্যারেটর কন্ট্রাক্ট** অনুসরণ করে।

---

## ১. অভ্যন্তরীণ কার্যপ্রণালী: কম্পাইলার লোয়ারিং ও IEnumerator<T>

সি# এ যখন একটি উচ্চস্তরের \`foreach\` লুপ লেখা হয়:

\`\`\`csharp
foreach (string name in namesList)
{
    Console.WriteLine(name);
}
\`\`\`

সি# কম্পাইলার এই কোডটিকে একটি \`while\` লুপ এবং রিসোর্স ক্লিনিংযুক্ত \`try-finally\` ব্লকে রূপান্তরিত করে (Compiler Lowering):

\`\`\`csharp
IEnumerator<string> enumerator = namesList.GetEnumerator();
try
{
    while (enumerator.MoveNext())
    {
        string name = enumerator.Current;
        Console.WriteLine(name);
    }
}
finally
{
    enumerator?.Dispose();
}
\`\`\`

### আইট্যারেটরের তিনটি মৌলিক অংশ:
১. **\`GetEnumerator()\`**: প্রথম উপাদানের ঠিক পূর্বে কার্সর স্থাপনকারী একটি আইট্যারেটর অবজেক্ট রিটার্ন করে।
২. **\`MoveNext()\`**: কার্সরকে পরবর্তী উপাদানে এগিয়ে নেয়; উপাদান থাকলে \`true\` এবং শেষ হলে \`false\` প্রদান করে।
৩. **\`Current\`**: বর্তমান কার্সর অবস্থানে থাকা উপাদানটি রিড-অনলি প্রপার্টি হিসেবে রিটার্ন করে।

---

## ২. ডাক টাইপিং ও জিরো-অ্যালোকেশন আইটারেশন

কোনো টাইপের ভেতর \`foreach\` চালানোর জন্য আনুষ্ঠানিকভাবে \`IEnumerable\` ইমপ্লিমেন্ট করাও বাধ্যতামূলক নয়! সি# কম্পাইলার **প্যাটার্ন-ভিত্তিক ডাক টাইপিং (Duck Typing)** সমর্থন করে। কোনো ক্লাসে যদি একটি পাবলিক \`GetEnumerator()\` মেথড থাকে যা এমন একটি অবজেক্ট বা স্ট্রাক্ট রিটার্ন করে যার ভেতর \`MoveNext()\` এবং \`Current\` রয়েছে, তবেই কম্পাইলার \`foreach\` অনুমোদন করে।

### \`Span<T>\` এবং উচ্চ পারফরম্যান্সের সুবিধা:
\`Span<T>\` বা \`ReadOnlySpan<T>\` হলো \`ref struct\`, যা কোনো ইন্টারফেস ইমপ্লিমেন্ট করতে পারে না। ডাক টাইপিংয়ের কারণে কোনো হিপ অ্যালোকেশন ছাড়াই স্প্যানে \`foreach\` চালানো যায়:

\`\`\`csharp
ReadOnlySpan<int> numbers = stackalloc int[] { 10, 20, 30, 40 };

int sum = 0;
foreach (int val in numbers) // কোনো হিপ মেমোরি খরচ নেই!
{
    sum += val;
}
\`\`\`

---

## ৩. অ্যারে অপ্টিমাইজেশন (Zero Overhead)

একমাত্রিক অ্যারের (\`T[]\`) ক্ষেত্রে সি# কম্পাইলার কোনো আইট্যারেটর অবজেক্ট তৈরি করে না। এটি স্বয়ংক্রিয়ভাবে কোডটিকে সাধারণ \`for\` লুপে নামিয়ে আনে:

\`\`\`csharp
// ডেভেলপার যা লেখেন:
foreach (var item in array) { Process(item); }

// কম্পাইলার যে IL কোড তৈরি করে:
for (int i = 0; i < array.Length; i++)
{
    var item = array[i];
    Process(item);
}
\`\`\`
এর ফলে কোনো গার্বেজ কালেকশন (GC) চাপ পড়ে না এবং এটি সম্পূর্ণ বাউন্ডস চেক এলিমিনেশনের (BCE) সুবিধা পায়।

---

## ৪. নিরাপত্তা ও বিধিনিষেধ

### ক. লুপ ভ্যারিয়েবল সর্বদা রিড-অনলি
সি# এ \`foreach\` এর আইটারেশন ভ্যারিয়েবলে নতুন মান অ্যাসাইন করা নিষিদ্ধ:
\`\`\`csharp
int[] scores = { 80, 90, 100 };

foreach (var score in scores)
{
    // ❌ কম্পাইল এরর: আইটারেশন ভ্যারিয়েবল রিড-অনলি
    // score = score + 5;
}
\`\`\`

### খ. আইটারেশন চলাকালে কালেকশন পরিবর্তন নিষিদ্ধ
লুপ চলাকালীন কালেকশনে নতুন উপাদান যোগ (\`Add\`) বা অপসারণ (\`Remove\`) করলে রানটাইমে \`InvalidOperationException\` ঘটে:

\`\`\`csharp
var list = new List<int> { 1, 2, 3, 4, 5 };

foreach (var item in list)
{
    if (item == 3)
    {
        // ❌ রানটাইম এক্সেপশন: Collection was modified
        list.Remove(item);
    }
}
\`\`\`

### নিরাপদ অপসারণের ৩টি কৌশল:
১. **পেছন দিক থেকে সাধারণ \`for\` লুপ চালানো**:
   \`\`\`csharp
   for (int i = list.Count - 1; i >= 0; i--)
   {
       if (list[i] == 3) list.RemoveAt(i);
   }
   \`\`\`
২. **\`RemoveAll\` মেথড ব্যবহার করা**:
   \`\`\`csharp
   list.RemoveAll(item => item == 3);
   \`\`\`
৩. **কালেকশনের একটি কপি (\`.ToList()\`) তৈরি করে আইটারেট করা**:
   \`\`\`csharp
   foreach (var item in list.ToList())
   {
       if (item == 3) list.Remove(item);
   }
   \`\`\`

---

## ৫. আধুনিক সি# ফিচারসমূহ

### ক. ডিকশনারি ও টাপল ডিকনস্ট্রাকশন (C# 7.0+)
\`\`\`csharp
var salaryMap = new Dictionary<string, int>
{
    ["Enosis"] = 75000,
    ["Brain Station 23"] = 80000,
    ["BJIT"] = 72000
};

// কি এবং ভ্যালু সরাসরি ডিকনস্ট্রাক্ট করা
foreach (var (company, salary) in salaryMap)
{
    Console.WriteLine($"{company} pays {salary} BDT");
}
\`\`\`

### খ. .NET 9+ এর \`.Index()\` মেথড
পূর্ববর্তী সংস্করণে ইনডেক্স ট্র্যাকিংয়ের জন্য বাইরের চলক লাগত। .NET 9 এ সরাসরি ইনডেক্স পাওয়া যায়:

\`\`\`csharp
var employees = new List<string> { "Rahim", "Karim", "Farhan" };

foreach (var (index, employee) in employees.Index())
{
    Console.WriteLine($"Rank #{index + 1}: {employee}");
}
\`\`\`

---

## ৬. তুলনামূলক বিশ্লেষণ: \`foreach\` বনাম \`for\`

| বৈশিষ্ট্য | \`foreach\` লুপ | \`for\` লুপ |
|---|---|---|
| **প্রধান উদ্দেশ্য** | অনুক্রমের উপাদান পাঠ করা | কাউন্টার রেঞ্জ ও নির্দিষ্ট ইনডেক্সিং |
| **ইনডেক্স এক্সেস** | সরাসরি নেই (\`.Index()\` প্রয়োজন) | সরাসরি ইন্টিজার ইনডেক্স (\`i\`) |
| **সমর্থিত কালেকশন** | যেকোনো \`IEnumerable\` / ডাক টাইপ | অ্যারে, \`List<T>\`, ইনডেক্সযুক্ত কালেকশন |
| **অ্যারে পারফরম্যান্স** | সমান (কম্পাইলার \`for\` লুপে রূপান্তর করে) | সমান (BCE অপ্টিমাইজড) |
| **নিরাপত্তা** | অফ-বাই-ওয়ান ত্রুটি সম্পূর্ণ প্রতিরোধ করে | ম্যানুয়াল বাউন্ডস সতর্কতা প্রয়োজন |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: অ্যারের উপাদানসমূহের যোগফল (Array Summation)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৩ — Problem A*

**সমস্যা পরিচিতি**:
$N$ টি পূর্ণসংখ্যার একটি অ্যারে $A$ দেওয়া থাকবে। অ্যারের সমস্ত সংখ্যার যোগফলের পরমমান (Absolute Value) প্রিন্ট করুন।

**সীমাবদ্ধতা**:
$1 \\le N \\le 10^5$, প্রতিটি সংখ্যা $-10^9$ থেকে $10^9$ এর মধ্যে।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

        long[] numbers = new long[n];
        for (int i = 0; i < n; i++)
        {
            numbers[i] = long.Parse(tokens[i]);
        }

        // foreach লুপের সাহায্যে যোগফল নির্ণয়
        long totalSum = 0;
        foreach (long val in numbers)
        {
            totalSum += val; // ৬৪-বিট লং ব্যবহারের ফলে ওভারফ্লো রোধ হয়
        }

        long absoluteSum = Math.Abs(totalSum);
        Console.WriteLine(absoluteSum);
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N)$ — $N$ টি উপাদানের ওপর লিনিয়ার সিঙ্গেল-পাস আইটারেশন।
- **স্পেস কমপ্লেক্সিটি**: $O(N)$ — $N$ টি উপাদান অ্যারেতে ধারণের জন্য মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem A: Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/A) | Easy | Foreach loop, 64-bit accumulator |
| ⚪ | Codeforces Assiut | [Problem B: Searching](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B) | Easy | Linear scan, Early exit |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | List iteration, Linq / Foreach |
| ⚪ | Exercism C# | [Sum of Multiples](https://exercism.org/tracks/csharp/exercises/sum-of-multiples) | Easy | Sets, Foreach collection traversal |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem A: Summation",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/A",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["foreach", "Arrays", "Accumulator"],
        solutionEn: "Accumulate numbers with a foreach loop into a 64-bit long and output Math.Abs(sum).",
        solutionBn: "foreach লুপের সাহায্যে ৬৪-বিট লং চলকে যোগফল নিয়ে Math.Abs প্রিন্ট করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem B: Searching",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Arrays", "Searching", "Linear Scan"],
        solutionEn: "Scan the array and print the zero-based index upon first match, or -1 if not found.",
        solutionBn: "অ্যারে সার্চ করে প্রথম ম্যাচ হওয়া ইনডেক্স প্রিন্ট করুন অথবা না পেলে -১ প্রিন্ট করুন।",
      },
      {
        source: "Exercism C#",
        name: "High Scores",
        url: "https://exercism.org/tracks/csharp/exercises/high-scores",
        difficulty: "EASY",
        company: null,
        tags: ["Collections", "foreach", "Lists"],
        solutionEn: "Inspect lists of player scores to determine latest score, highest score, and top 3 scores.",
        solutionBn: "প্লেয়ারের স্কোরের তালিকা থেকে সর্বশেষ স্কোর, সর্বোচ্চ স্কোর এবং শীর্ষ ৩টি স্কোর বের করুন।",
      },
      {
        source: "Exercism C#",
        name: "Sum of Multiples",
        url: "https://exercism.org/tracks/csharp/exercises/sum-of-multiples",
        difficulty: "EASY",
        company: null,
        tags: ["foreach", "Math", "HashSets"],
        solutionEn: "Collect unique multiples of given factors up to a limit and compute their sum with foreach.",
        solutionBn: "নির্দিষ্ট লিমিট পর্যন্ত গুণিতকসমূহ সংগ্রহ করে foreach দিয়ে সমষ্টি বের করুন।",
      },
    ],
  };
