import type { LocalLesson } from "@/lib/lessons-data";

export const methodsOutLesson: LocalLesson = {
    slug: "methods-out",
    titleEn: "out Modifier",
    titleBn: "আউট (out) মডিফায়ার ও TryParse প্যাটার্ন",
    categoryEn: "04. Methods",
    categoryBn: "০৪. মেথড ও ফাংশন",
    categoryDescEn:
      "Reusable function architecture in C#: parameter evaluation, passing semantics (by-value vs by-reference), overloading, and modern params features.",
    categoryDescBn:
      "সি# এ ফাংশন ও মেথড আর্কিটেকচার: প্যারামিটার মূল্যায়ন, ভ্যালু বনাম রেফারেন্স পাসিং, ওভারলোডিং এবং মডার্ন প্যারামস।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Output parameters, callee assignment guarantee, inline out var declarations, discard patterns, and the high-performance TryParse pattern.",
    descriptionBn:
      "আউটপুট প্যারামিটার, মেথডের ভেতর মান নির্ধারণের বাধ্যবাধকতা, ইনলাইন out var ঘোষণা, ডিসকার্ড এবং ট্রাইপার্স প্যাটার্ন।",
    difficulty: "EASY",
    displayOrder: 5,
    prerequisites: ["methods-ref"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# out Parameter Modifier in C#

The \`out\` parameter modifier causes an argument to be passed by reference with the explicit architectural intent of **returning data from the callee method**.

---

## 1. The Definite Callee Assignment Guarantee

Unlike \`ref\`, which requires the caller to pre-initialize the variable:
1. **Uninitialized Caller State**: The caller is **not required** to initialize the variable before passing it to an \`out\` parameter.
2. **Definite Assignment Contract**: The callee method **must assign a value** to every \`out\` parameter along every possible return path before exiting. If any code branch returns without assigning to an \`out\` parameter, the compiler throws error **CS0177**.
3. **Cannot Read Before Write**: Inside the callee method, an \`out\` parameter cannot be read until it has been explicitly assigned a value.

\`\`\`csharp
public static bool TryCompute(int input, out int result)
{
    if (input < 0)
    {
        // ❌ COMPILER ERROR CS0177 if we return without assigning 'result'!
        result = 0; // Must assign along ALL code paths
        return false;
    }

    result = input * 2;
    return true;
}
\`\`\`

---

## 2. Modern C# Features: Inline \`out var\` & Discards

C# 7.0 significantly streamlined the syntax for consuming \`out\` methods:

### A. Inline Variable Declaration
You do not need to pre-declare a variable on a separate line. You can declare it directly at the call site:

\`\`\`csharp
string rawInput = "1048576";

// Declaring 'parsedValue' inline inside the condition
if (int.TryParse(rawInput, out int parsedValue))
{
    Console.WriteLine($"Parsed value: {parsedValue}");
}
// 'parsedValue' remains in scope in the surrounding block
\`\`\`

### B. The Discard Pattern (\`out _\`)
When you only need to verify if a parse or operation succeeds, but do not care about the returned value, discard it with an underscore (\`_\`):

\`\`\`csharp
// Checks if the date format is valid without allocating an unused DateTime variable
if (DateTime.TryParse(userInput, out _))
{
    Console.WriteLine("Valid date format entered.");
}
\`\`\`

---

## 3. The Canonical .NET \`TryXxx\` Pattern

The \`TryXxx\` pattern is the standard idiomatic design pattern across the entire .NET runtime (\`int.TryParse\`, \`dict.TryGetValue\`, \`queue.TryDequeue\`, \`stack.TryPop\`):
- Returns a \`bool\` signaling success or failure.
- Delivers the output payload via an \`out\` parameter.
- **Why It Matters for Performance**: Relying on exceptions for normal control flow is an antipattern; throwing and catching an exception requires hundreds to thousands of CPU clock cycles for stack unwinding. The \`TryXxx\` pattern executes in $O(1)$ constant time with **zero exceptions and zero allocations**.

\`\`\`csharp
public static bool TryDivide(int numerator, int denominator, out int quotient, out int remainder)
{
    if (denominator == 0)
    {
        quotient = 0;
        remainder = 0;
        return false;
    }

    quotient = numerator / denominator;
    remainder = numerator % denominator;
    return true;
}
\`\`\`

---

## 4. Comparison: \`out\` vs \`ref\` vs \`ValueTuple\`

| Feature | \`out\` Parameter | \`ref\` Parameter | \`ValueTuple\` (\`(T1, T2)\`) |
|---|---|---|---|
| **Primary Intent** | Returning output values | Mutating existing input state | Returning multiple named results |
| **Caller Initialization** | **Not required** | **Mandatory** | N/A |
| **Callee Assignment** | **Mandatory (CS0177)** | Optional | Mandatory in return statement |
| **Async Friendly?** | **No** (Cannot use in \`async\`) | **No** (Cannot use in \`async\`) | **Yes (Full async/await support)** |
| **Call Site Syntax** | \`Method(out var x)\` | \`Method(ref x)\` | \`(var a, var b) = Method()\` |

---

## Practical Problem Walkthrough

### Problem: Safe Division & Remainder Decomposition
*Source: Exercism C# Track — Calculator Conundrum (Adapted)*

**Problem Statement**:
Implement a safe integer division function using the \`out\` parameter modifier that computes both the quotient and the remainder, returning \`false\` if the divisor is zero.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    public static bool TryDivide(long numerator, long denominator, out long quotient, out long remainder)
    {
        if (denominator == 0)
        {
            quotient = 0;
            remainder = 0;
            return false;
        }

        quotient = numerator / denominator;
        remainder = numerator % denominator;
        return true;
    }

    public static void Main()
    {
        long a = 47;
        long b = 5;

        if (TryDivide(a, b, out long q, out long r))
        {
            Console.WriteLine($"Quotient: {q}, Remainder: {r}");
        }
        else
        {
            Console.WriteLine("Cannot divide by zero!");
        }
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(1)$ — single integer division and modulo calculation.
- **Space Complexity**: $O(1)$ — operates directly on caller-allocated stack slots.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem D: Prime Function](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/D) | Easy | Boolean return, Helper methods |
| ⚪ | Exercism C# | [Calculator Conundrum](https://exercism.org/tracks/csharp/exercises/calculator-conundrum) | Easy | Exception handling, out parameters |
| ⚪ | Codeforces Assiut | [Problem J: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Modulo validation, Divisibility |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Easy | State queries, TryPattern |
`,

    contentBn: `# C# এ আউট (out) মডিফায়ার ও TryParse প্যাটার্ন

\`out\` প্যারামিটার মডিফায়ার কোনো আর্গুমেন্টকে রেফারেন্সের মাধ্যমে পাস করে, যার মূল উদ্দেশ্য হলো **মেথড থেকে এক বা একাধিক মান কলারের কাছে ফেরত পাঠানো**।

---

## ১. মেথডের ভেতর মান নির্ধারণের বাধ্যবাধকতা (Definite Assignment)

\`ref\` এর সাথে \`out\` এর মূল পার্থক্যসমূহ:
১. **কল করার পূর্বে ইনিশিয়ালাইজেশনের প্রয়োজন নেই**: কলারকে মেথডে পাঠানোর আগে ভেরিয়েবলে কোনো মান অ্যাসাইন করতে হয় না।
২. **মান নির্ধারণের কঠোর শর্ত**: মেথডের ভেতরে প্রতিটি এক্সিকিউশন পাথে অবশ্যই সমস্ত \`out\` প্যারামিটারে কোনো না কোনো মান অ্যাসাইন করতে হবে। মান না দিলে কম্পাইলার এরর **CS0177** প্রদান করে।
৩. **আগে মান পড়া নিষিদ্ধ**: মেথডের ভেতর \`out\` প্যারামিটারে নতুন মান না বসানো পর্যন্ত তার মান রিড করা যায় না।

\`\`\`csharp
public static bool TryCompute(int input, out int result)
{
    if (input < 0)
    {
        result = 0; // সমস্ত পাথে মান নির্ধারণ বাধ্যতামূলক!
        return false;
    }

    result = input * 2;
    return true;
}
\`\`\`

---

## ২. আধুনিক সি# ফিচার: ইনলাইন \`out var\` ও ডিসকার্ড

C# 7 এ \`out\` ব্যবহারের সিনট্যাক্স অনেক সহজ করা হয়েছে:

### ক. ইনলাইন ডিক্লারেশন
আগে আলাদা লাইনে ভেরিয়েবল ঘোষণা না করে সরাসরি মেথড কলের ভেতর ভেরিয়েবল ডিক্লেয়ার করা যায়:

\`\`\`csharp
string rawInput = "1048576";

// শর্তের ভেতরেই parsedValue চলক ডিক্লেয়ার
if (int.TryParse(rawInput, out int parsedValue))
{
    Console.WriteLine($"মান: {parsedValue}");
}
\`\`\`

### খ. ডিসকার্ড প্যাটার্ন (\`out _\`)
ফলাফল দরকার না হলে এবং কেবল সত্য/মিথ্যা যাচাই করতে চাইলে আন্ডারস্কোর (\`_\`) দিয়ে ডিসকার্ড করা যায়:

\`\`\`csharp
// ইনপুটটি সঠিক তারিখ কি না তা যাচাই (মান সংরক্ষণ না করেই)
if (DateTime.TryParse(userInput, out _))
{
    Console.WriteLine("সঠিক তারিখ ফরম্যাট।");
}
\`\`\`

---

## ৩. .NET এর আদর্শ \`TryXxx\` প্যাটার্ন

.NET এর প্রায় সমস্ত পার্সিং ও কালেকশনে (\`TryParse\`, \`TryGetValue\`, \`TryDequeue\`, \`TryPop\`) এই প্যাটার্ন ব্যবহৃত হয়:
- সফল বা ব্যর্থ নির্দেশ করতে একটি \`bool\` রিটার্ন করে।
- প্রাপ্ত ডেটা \`out\` প্যারামিটারের মাধ্যমে সরবরাহ করে।
- **পারফরম্যান্স সুবিধা**: এক্সেপশন থ্রো করা অত্যন্ত ব্যয়বহুল (হাজার হাজার ক্লক সাইকেল নষ্ট হয়)। \`TryXxx\` ব্যবহারে কোনো এক্সেপশন ও মেমোরি খরচ ছাড়াই ধ্রুবক $O(1)$ সময়ে কাজ সম্পন্ন হয়।

---

## ৪. তুলনামূলক সারণী: \`out\` বনাম \`ref\` বনাম \`ValueTuple\`

| বৈশিষ্ট্য | \`out\` প্যারামিটার | \`ref\` প্যারামিটার | \`ValueTuple\` |
|---|---|---|---|
| **মূল উদ্দেশ্য** | ফলাফল ফেরত পাঠানো | বিদ্যমান ডেটা পরিবর্তন করা | একাধিক ফলাফল রিটার্ন করা |
| **কল করার আগে মান থাকা** | **প্রয়োজন নেই** | **বাধ্যতামূলক** | প্রযোজ্য নয় |
| **ভেতরে মান দেওয়া** | **বাধ্যতামূলক (CS0177)** | ঐচ্ছিক | \`return\` এ দিতে হয় |
| **অ্যাসিঙ্ক সমর্থিত?** | **না** (\`async\` এ নিষিদ্ধ) | **না** (\`async\` এ নিষিদ্ধ) | **হ্যাঁ (সম্পূর্ণ সমর্থিত)** |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: নিরাপদ ভাগ ও ভাগশেষ নির্ণয়
*উৎস: এক্সারসিজম সি# ট্র্যাক — Calculator Conundrum*

**সমস্যা পরিচিতি**:
\`out\` প্যারামিটার ব্যবহার করে এমন একটি নিরাপদ ভাগ ফাংশন লিখুন যা ভাজক শূন্য হলে \`false\` রিটার্ন করবে, অন্যথায় ভাগফল ও ভাগশেষ বের করে \`true\` রিটার্ন করবে।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    public static bool TryDivide(long numerator, long denominator, out long quotient, out long remainder)
    {
        if (denominator == 0)
        {
            quotient = 0;
            remainder = 0;
            return false;
        }

        quotient = numerator / denominator;
        remainder = numerator % denominator;
        return true;
    }

    public static void Main()
    {
        long a = 47;
        long b = 5;

        if (TryDivide(a, b, out long q, out long r))
        {
            Console.WriteLine($"Quotient: {q}, Remainder: {r}");
        }
        else
        {
            Console.WriteLine("Cannot divide by zero!");
        }
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(1)$ — সরাসরি ভাগ ও মডুলাস পাটিগণিত।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ — কলারের স্ট্যাক মেমোরিতে সরাসরি ডেটা বসে।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem D: Prime Function](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/D) | Easy | Boolean return, Helper methods |
| ⚪ | Exercism C# | [Calculator Conundrum](https://exercism.org/tracks/csharp/exercises/calculator-conundrum) | Easy | Exception handling, out parameters |
| ⚪ | Codeforces Assiut | [Problem J: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Modulo validation, Divisibility |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Easy | State queries, TryPattern |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem D: Prime Function",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/D",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Methods", "Prime", "Math"],
        solutionEn: "Implement a boolean helper IsPrime(int n) checking factors up to sqrt(N).",
        solutionBn: "বুলিয়ান ফাংশন IsPrime লিখে sqrt(N) পর্যন্ত গুণনীয়ক যাচাই করে মৌলিক সংখ্যা নির্ধারণ করুন।",
      },
      {
        source: "Exercism C#",
        name: "Calculator Conundrum",
        url: "https://exercism.org/tracks/csharp/exercises/calculator-conundrum",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "out", "Validation"],
        solutionEn: "Format calculation strings while catching illegal division by zero operations.",
        solutionBn: "শূন্য দিয়ে ভাগের মতো ভুল অপারেশন হ্যান্ডেল করে ফলাফল প্রদর্শন করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem J: Multiples",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Methods", "Modulo"],
        solutionEn: "Extract divisibility into a dedicated helper method returning boolean confirmation.",
        solutionBn: "গুণিতক যাচাইয়ের লজিকটি আলাদা মেথডে নিয়ে বুলিয়ান আউটপুট প্রদর্শন করুন।",
      },
      {
        source: "Exercism C#",
        name: "Bank Account",
        url: "https://exercism.org/tracks/csharp/exercises/bank-account",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "out", "Concurrency"],
        solutionEn: "Expose balance state safely via out parameters while validating account status.",
        solutionBn: "অ্যাকাউন্টের ব্যালেন্স ও স্ট্যাটাস নিরাপদে যাচাই করে মেথড বাস্তবায়ন করুন।",
      },
    ],
  };
