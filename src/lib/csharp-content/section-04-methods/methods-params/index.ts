import type { LocalLesson } from "@/lib/lessons-data";

export const methodsParamsLesson: LocalLesson = {
    slug: "methods-params",
    titleEn: "params Modifier",
    titleBn: "প্যারামস (params) ও ভ্যারিয়েবল আর্গুমেন্ট",
    categoryEn: "04. Methods",
    categoryBn: "০৪. মেথড ও ফাংশন",
    categoryDescEn:
      "Reusable function architecture in C#: parameter evaluation, passing semantics (by-value vs by-reference), overloading, and modern params features.",
    categoryDescBn:
      "সি# এ ফাংশন ও মেথড আর্কিটেকচার: প্যারামিটার মূল্যায়ন, ভ্যালু বনাম রেফারেন্স পাসিং, ওভারলোডিং এবং মডার্ন প্যারামস।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Variable-length argument lists, compiler-generated array allocations, ReadOnlySpan params (C# 12), and zero-allocation calls.",
    descriptionBn:
      "পরিবর্তনশীল আর্গুমেন্ট তালিকা, কম্পাইলার দ্বারা অ্যারে তৈরি, সি# ১২ এর ReadOnlySpan প্যারামস ও পারফরম্যান্স।",
    difficulty: "EASY",
    displayOrder: 6,
    prerequisites: ["methods-parameters"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# params Parameter Modifier in C#

The \`params\` keyword specifies that a method parameter takes a **variable number of arguments**. Callers can supply a comma-separated list of arguments, an existing array, or omit arguments entirely.

---

## 1. Syntax Rules & Constraints

1. **Last Parameter Only**: A method can declare at most **one** \`params\` parameter, and it **must be the final parameter** in the formal parameter list.
2. **One-Dimensional Requirement**: Historically, \`params\` required a single-dimensional array (\`params int[] numbers\`).
3. **Caller Freedom**: Callers can invoke the method in three distinct ways:
   - Comma-separated values: \`Sum(1, 2, 3)\`
   - Explicit array: \`Sum(new int[] { 1, 2, 3 })\`
   - Empty invocation: \`Sum()\` (passes an empty array \`new int[0]\`)

\`\`\`csharp
public static int CalculateTotal(string category, params int[] amounts)
{
    int sum = 0;
    foreach (int val in amounts) sum += val;
    return sum;
}
\`\`\`

---

## 2. Compiler Lowering & The Allocation Penalty

### How the Compiler Handles Comma-Separated Calls:
When you write:
\`\`\`csharp
int total = CalculateTotal("Expenses", 50, 120, 300);
\`\`\`
The C# compiler automatically transforms this code into:
\`\`\`csharp
int total = CalculateTotal("Expenses", new int[] { 50, 120, 300 });
\`\`\`

> **The Hidden Performance Trap**: Every invocation creates a **temporary array allocation on the managed heap**. In high-frequency loops or logging infrastructure, this generates substantial garbage collection (GC) pressure.

### The Overload Optimization Idiom:
To eliminate heap allocations for common call signatures, high-performance libraries (including the .NET BCL for \`Console.WriteLine\` and \`string.Format\`) provide dedicated overloads:
\`\`\`csharp
public class FastLogger
{
    // Fast paths: zero array allocation for 1-3 arguments
    public void Log(string msg) { /* ... */ }
    public void Log(string msg, object arg0) { /* ... */ }
    public void Log(string msg, object arg0, object arg1) { /* ... */ }

    // Fallback: only allocates an array when 3+ arguments are passed
    public void Log(string msg, params object[] args) { /* ... */ }
}
\`\`\`

---

## 3. C# 12 Evolution: \`params ReadOnlySpan<T>\`

In modern C# 12 (.NET 8+), \`params\` is no longer restricted to arrays! It can now be used with \`ReadOnlySpan<T>\`, \`Span<T>\`, \`IEnumerable<T>\`, and \`List<T>\`.

### Zero-Allocation Stack Allocation
When declared with \`ReadOnlySpan<T>\`, the C# compiler uses \`stackalloc\` to place the arguments directly on the execution stack frame:

\`\`\`csharp
// C# 12+ Zero-allocation params
public static int ComputeSumFast(params ReadOnlySpan<int> values)
{
    int total = 0;
    foreach (int v in values) total += v;
    return total;
}

// Call site: Compiler puts [10, 20, 30] on the STACK -> ZERO HEAP ALLOCATIONS!
int result = ComputeSumFast(10, 20, 30);
\`\`\`

---

## 4. Comparison: \`params\` Evolution

| Feature | Traditional \`params T[]\` (C# 1 - 11) | Modern \`params ReadOnlySpan<T>\` (C# 12+) |
|---|---|---|
| **Memory Allocation** | Heap (allocates \`new T[]\`) | **Stack (Zero GC allocation)** |
| **GC Overhead** | Creates garbage collector pressure | **Zero GC pressure** |
| **Call Site Flexibility** | List, array, empty | List, array, span, empty |
| **Can Be Used in Async?** | Yes | No (ref structs cannot cross await) |

---

## Practical Problem Walkthrough

### Problem: Variable Argument Arithmetic Average
*Source: Codeforces Assiut University Training Sheet #5 — Problem J (Average)*

**Problem Statement**:
Given $N$ numbers. Write a modular function using variable arguments to compute the precise arithmetic average.

**Constraints**:
$1 \\le N \\le 10^5$, numbers are double-precision floating-point values.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    // Flexible variable-length argument function
    public static double ComputeAverage(params double[] values)
    {
        if (values.Length == 0) return 0.0;

        double sum = 0.0;
        foreach (double v in values)
        {
            sum += v;
        }

        return sum / values.Length;
    }

    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        double[] numbers = new double[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = double.Parse(tokens[i]);
        }

        // Passing existing array directly to params
        double average = ComputeAverage(numbers);

        Console.WriteLine($"{average:F6}");
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N)$ — single linear accumulation pass through $N$ numbers.
- **Space Complexity**: $O(N)$ — memory for the input array.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem J: Average](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/J) | Easy | Variable arguments, params |
| ⚪ | Exercism C# | [Anagram](https://exercism.org/tracks/csharp/exercises/anagram) | Easy | Candidates list, params strings |
| ⚪ | Codeforces Assiut | [Problem A: Add](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/A) | Easy | Function parameters, Sum |
| ⚪ | Exercism C# | [Resistor Color Duo](https://exercism.org/tracks/csharp/exercises/resistor-color-duo) | Easy | Array params, Sequence parsing |
`,

    contentBn: `# C# এ প্যারামস (params) ও ভ্যারিয়েবল আর্গুমেন্ট

\`params\` কিওয়ার্ড কোনো মেথড প্যারামিটারকে **পরিবর্তনশীল সংখ্যক আর্গুমেন্ট (Variable-length arguments)** গ্রহণ করার ক্ষমতা দেয়। কমা দিয়ে পৃথক করা মানের তালিকা, কোনো বিদ্যমান অ্যারে, অথবা শূন্য আর্গুমেন্ট দিয়েও মেথডটি কল করা যায়।

---

## ১. সিনট্যাক্স ও ব্যবহারের নিয়মাবলী

১. **সর্বশেষ প্যারামিটার হওয়া বাধ্যতামূলক**: একটি মেথডে সর্বোচ্চ **একটিমাত্র** \`params\` প্যারামিটার থাকতে পারে এবং তা অবশ্যই প্যারামিটার তালিকার **সর্বশেষে** বসতে হবে।
২. **কলারের স্বাধীনতা**: তিনটি উপায়ে মেথডটি কল করা সম্ভব:
   - কমা দিয়ে পৃথক মান: \`Sum(1, 2, 3)\`
   - সরাসরি অ্যারে: \`Sum(new int[] { 1, 2, 3 })\`
   - খালি কল: \`Sum()\` (স্বয়ংক্রিয়ভাবে শূন্য সাইজের অ্যারে পাস করে)

\`\`\`csharp
public static int CalculateTotal(string category, params int[] amounts)
{
    int sum = 0;
    foreach (int val in amounts) sum += val;
    return sum;
}
\`\`\`

---

## ২. কম্পাইলার লোয়ারিং ও হিডেন মেমোরি খরচ

### কমা দিয়ে কল করলে পেছনে কী ঘটে?
যখন আপনি লেখেন:
\`\`\`csharp
int total = CalculateTotal("Expenses", 50, 120, 300);
\`\`\`
সি# কম্পাইলার কোডটিকে স্বয়ংক্রিয়ভাবে একটি নতুন হিপ অ্যারেতে নামিয়ে আনে:
\`\`\`csharp
int total = CalculateTotal("Expenses", new int[] { 50, 120, 300 });
\`\`\`

> **লুকায়িত পারফরম্যান্স সমস্যা**: প্রতিবার কমা দিয়ে কল করলে হিপ মেমোরিতে একটি নতুন অস্থায়ী অ্যারে তৈরি হয়, যা উচ্চগতির লুপে প্রচুর গার্বেজ তৈরি করে।

### ওভারলোড দিয়ে অপ্টিমাইজেশন কৌশল:
.NET এর বিল্ট-ইন মেথডগুলো (\`Console.WriteLine\`, \`string.Format\`) ১, ২ বা ৩টি আর্গুমেন্টের জন্য আলাদা ওভারলোড রাখে যাতে সাধারণ ক্ষেত্রে কোনো হিপ অ্যারে তৈরি না হয়:
\`\`\`csharp
public void Log(string msg);
public void Log(string msg, object arg0);
public void Log(string msg, object arg0, object arg1);
public void Log(string msg, params object[] args); // ৩টির বেশি হলে তখন অ্যারে হয়
\`\`\`

---

## ৩. C# 12 এর নতুন দিগন্ত: \`params ReadOnlySpan<T>\`

C# 12 এ \`params\` এর পরিধি শুধু সাধারণ অ্যারেতে সীমাবদ্ধ নয়। এখন \`ReadOnlySpan<T>\` ও \`Span<T>\` এর সাথেও \`params\` ব্যবহার করা যায়।

### জিরো-মেমোরি স্ট্যাক অ্যালোকেশন
\`ReadOnlySpan<T>\` ব্যবহার করলে কম্পাইলার মেমোরি হিপে না নিয়ে সরাসরি কল স্ট্যাকে \`stackalloc\` করে রাখে, ফলে **কোনো গার্বেজ তৈরি হয় না**:

\`\`\`csharp
// সি# ১২ এর অপ্টিমাইজড প্যারামস
public static int ComputeSumFast(params ReadOnlySpan<int> values)
{
    int total = 0;
    foreach (int v in values) total += v;
    return total;
}

// কল সাইট: স্ট্যাক মেমোরিতে কাজ সম্পন্ন হয় -> জিরো হিপ মেমোরি খরচ!
int result = ComputeSumFast(10, 20, 30);
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: পরিবর্তনশীল আর্গুমেন্টের গড় নির্ণয় (Average)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৫ — Problem J*

**সমস্যা পরিচিতি**:
$N$ টি দশমিক সংখ্যা দেওয়া থাকবে। পরিবর্তনশীল আর্গুমেন্ট গ্রহণ করতে পারে এমন একটি ফাংশন তৈরি করে সংখ্যাগুলোর গড় নির্ণয় করুন।

**সীমাবদ্ধতা**:
$1 \\le N \\le 10^5$।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    // পরিবর্তনশীল সংখ্যক আর্গুমেন্ট গ্রহণকারী ফাংশন
    public static double ComputeAverage(params double[] values)
    {
        if (values.Length == 0) return 0.0;

        double sum = 0.0;
        foreach (double v in values)
        {
            sum += v;
        }

        return sum / values.Length;
    }

    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        double[] numbers = new double[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = double.Parse(tokens[i]);
        }

        // বিদ্যমান অ্যারে সরাসরি params এ পাস করা
        double average = ComputeAverage(numbers);

        Console.WriteLine($"{average:F6}");
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N)$ — $N$ টি সংখ্যার ওপর একক লুপে যোগফল নির্ণয়।
- **স্পেস কমপ্লেক্সিটি**: $O(N)$ — ইনপুট অ্যারের মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem J: Average](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/J) | Easy | Variable arguments, params |
| ⚪ | Exercism C# | [Anagram](https://exercism.org/tracks/csharp/exercises/anagram) | Easy | Candidates list, params strings |
| ⚪ | Codeforces Assiut | [Problem A: Add](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/A) | Easy | Function parameters, Sum |
| ⚪ | Exercism C# | [Resistor Color Duo](https://exercism.org/tracks/csharp/exercises/resistor-color-duo) | Easy | Array params, Sequence parsing |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem J: Average",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/J",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Methods", "params", "Math"],
        solutionEn: "Accumulate elements with params double[] and divide by values.Length.",
        solutionBn: "params double[] ব্যবহার করে যোগফল নিয়ে values.Length দিয়ে ভাগ করে গড় বের করুন।",
      },
      {
        source: "Exercism C#",
        name: "Anagram",
        url: "https://exercism.org/tracks/csharp/exercises/anagram",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "params", "Strings"],
        solutionEn: "Accept candidate strings as params string[] and filter valid anagrams.",
        solutionBn: "প্রার্থিত শব্দসমূহ params স্ট্রিং হিসেবে গ্রহণ করে সঠিক অ্যানাগ্রাম ফিল্টার করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem A: Add",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/A",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Methods", "Sum"],
        solutionEn: "Write modular summation functions accepting variable numeric parameters.",
        solutionBn: "সংখ্যা ইনপুট নিয়ে যোগফল রিটার্ন করার জন্য মডুলার ফাংশন তৈরি করুন।",
      },
      {
        source: "Exercism C#",
        name: "Resistor Color Duo",
        url: "https://exercism.org/tracks/csharp/exercises/resistor-color-duo",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "params", "Arrays"],
        solutionEn: "Combine the numeric values of the first two color bands in an argument list.",
        solutionBn: "কালার ব্যান্ডের প্রথম দুটি রঙের মান একত্র করে রেজিস্টরের মান বের করুন।",
      },
    ],
  };
