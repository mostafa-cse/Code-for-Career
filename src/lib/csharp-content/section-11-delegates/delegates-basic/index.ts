import type { LocalLesson } from "@/lib/lessons-data";

export const delegatesBasicLesson: LocalLesson = {
  slug: "delegates-basic",
  titleEn: "Delegates Basics",
  titleBn: "ডেলিগেট (Delegate) ও ফাংশন পয়েন্টার",
  categoryEn: "11. Delegates",
  categoryBn: "১১. ডেলিগেট (Delegates)",
  categoryDescEn:
    "Type-safe function pointers in .NET: single-cast and multicast delegates, built-in Action, Func, and Predicate generic delegates.",
  categoryDescBn:
    ".NET এ টাইপ-নিরাপদ ফাংশন পয়েন্টার: সিঙ্গেল ও মাল্টিকাস্ট ডেলিগেট, বিল্ট-ইন Action, Func এবং Predicate জেনেরিক ডেলিগেট।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Type-safe method references, System.MulticastDelegate internal architecture (_target, _methodPtr), synchronous invocation, and callback pipelines.",
  descriptionBn:
    "টাইপ-নিরাপদ মেথড রেফারেন্স, System.MulticastDelegate এর অভ্যন্তরীণ গঠন (_target, _methodPtr) এবং কলব্যাক পাইপলাইন।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["methods-parameters"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Delegates Basics in C#

A **delegate** in C# is a **type-safe, object-oriented function pointer**. It encapsulates a reference to a method with a specific signature and return type.

Unlike raw function pointers in C or C++, C# delegates are fully managed reference types derived from \`System.MulticastDelegate\`. They guarantee type safety at compile time and provide seamless dispatch for both static and instance methods.

---

## What the Compiler Generates Under the Hood

When you declare a delegate in C#:
\`\`\`csharp
public delegate int BinaryOperation(int a, int b);
\`\`\`

The Roslyn compiler synthesizes a sealed class inheriting from \`System.MulticastDelegate\`:

\`\`\`csharp
// COMPILER-GENERATED PSEUDO-CODE:
public sealed class BinaryOperation : System.MulticastDelegate
{
    public BinaryOperation(object target, IntPtr methodPtr) { /* ... */ }

    public virtual int Invoke(int a, int b) { /* Native dispatch stub */ }

    public virtual IAsyncResult BeginInvoke(int a, int b, AsyncCallback callback, object state) { /* ... */ }
    public virtual int EndInvoke(IAsyncResult result) { /* ... */ }
}
\`\`\`

### Internal Fields of \`MulticastDelegate\`:
1. **\`_target\` (\`object\`)**:
   - Stores a reference to the instance on which the method will be invoked.
   - For **static methods**, \`_target\` is \`null\`.
   - For **instance methods**, \`_target\` holds the object reference, passing it as the implicit \`this\` pointer during invocation.
2. **\`_methodPtr\` (\`IntPtr\`)**:
   - A native pointer to the method's executable JIT-compiled machine code.
3. **\`_invocationList\` (\`object[]\`)**:
   - Stores references to multiple delegates when combined in multicast chains.

---

## Static vs Instance Method Dispatch

Delegates preserve object context seamlessly:

\`\`\`csharp
public class AccountingService
{
    private readonly decimal taxRate;
    public AccountingService(decimal taxRate) => this.taxRate = taxRate;

    // Instance method: Captures 'this' in _target
    public decimal ApplyTax(decimal subtotal) => subtotal * (1 + taxRate);

    // Static method: _target is null
    public static decimal FormatCurrency(decimal amount) => Math.Round(amount, 2);
}

public delegate decimal TaxCalculator(decimal amount);

// Instance delegate: _target points to corporateAccounting
AccountingService corporateAccounting = new AccountingService(0.15m);
TaxCalculator taxDelegate = corporateAccounting.ApplyTax;

Console.WriteLine(taxDelegate(100.00m)); // 115.00
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem C (Simple Calculator)
*Given two numbers $X$ and $Y$. Print the result of their summation, multiplication, and subtraction in the format:*
- \`X + Y = summation_result\`
- \`X * Y = multiplication_result\`
- \`X - Y = subtraction_result\`
*Model the dispatch operations using strongly typed C# delegates.*

#### Algorithmic Analysis
1. Input $X$ and $Y$ can be up to $10^5$, meaning their product $X \\times Y$ can reach $10^{10}$ (requiring 64-bit \`long\` to avoid overflow).
2. Define a delegate \`OperationHandler(long a, long b)\`.
3. Dispatch each operation cleanly with formatted output.

#### C# Implementation

\`\`\`csharp
using System;

public delegate long OperationHandler(long a, long b);

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        string[] parts = input.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 2)
        {
            return;
        }

        long x = long.Parse(parts[0]);
        long y = long.Parse(parts[1]);

        OperationHandler add = (a, b) => a + b;
        OperationHandler multiply = (a, b) => a * b;
        OperationHandler subtract = (a, b) => a - b;

        Console.WriteLine($"{x} + {y} = {add(x, y)}");
        Console.WriteLine($"{x} * {y} = {multiply(x, y)}");
        Console.WriteLine($"{x} - {y} = {subtract(x, y)}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, standard 64-bit arithmetic and delegate dispatch execute in constant time.
- **Space Complexity**: $\\mathcal{O}(1)$, stack frames for primitive operands and delegate method pointers.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Simple Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C) | Easy | Delegate callbacks, Arithmetic dispatch, 64-bit integers |
| ⚪ | Codeforces | [Assiut Sheet #1: Difference](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D) | Easy | Functional evaluation, Mathematical expressions |
| ⚪ | Exercism C# | [Calculator Conundrum](https://exercism.org/tracks/csharp/exercises/calculator-conundrum) | Easy | Delegates, Method references, Error handling |
| ⚪ | Exercism C# | [Roll the Die](https://exercism.org/tracks/csharp/exercises/roll-the-die) | Easy | Method delegation, Random generation, Value mapping |
`,

  contentBn: `# C# এ ডেলিগেট (Delegate) ও ফাংশন পয়েন্টার

C# এ **ডেলিগেট (Delegate)** হলো একটি **টাইপ-নিরাপদ, অবজেক্ট-ওরিয়েন্টেড ফাংশন পয়েন্টার**। এটি কোনো নির্দিষ্ট সিগনেচার এবং রিটার্ন টাইপযুক্ত মেথডের রেফারেন্স নিজের মধ্যে ধারণ করে।

C বা C++ এর আনসেফ ফাংশন পয়েন্টারের বিপরীতে C# ডেলিগেট সম্পূর্ণ টাইপ-নিরাপদ এবং এটি \`System.MulticastDelegate\` ক্লাস থেকে ইনহেরিট করা একটি রেফারেন্স টাইপ অবজেক্ট।

---

## কম্পাইলার পর্দার আড়ালে কী তৈরি করে

যখন আমরা একটি ডেলিগেট ডিক্লেয়ার করি:
\`\`\`csharp
public delegate int BinaryOperation(int a, int b);
\`\`\`

Roslyn কম্পাইলার স্বয়ংক্রিয়ভাবে \`System.MulticastDelegate\` থেকে ইনহেরিট করা একটি সিল্ড (sealed) ক্লাস তৈরি করে:

\`\`\`csharp
// কম্পাইলারের তৈরি ইন্টারনাল কোড:
public sealed class BinaryOperation : System.MulticastDelegate
{
    public BinaryOperation(object target, IntPtr methodPtr) { /* ... */ }

    public virtual int Invoke(int a, int b) { /* নেটিভ মেথড কল */ }

    public virtual IAsyncResult BeginInvoke(int a, int b, AsyncCallback callback, object state) { /* ... */ }
    public virtual int EndInvoke(IAsyncResult result) { /* ... */ }
}
\`\`\`

### \`MulticastDelegate\` ক্লাসের অভ্যন্তরীণ ৩টি প্রধান ফিল্ড:
১. **\`_target\` (\`object\`)**:
   - মেথডটি যে ক্লাসের অবজেক্টের ওপর কল হবে তার মেমোরি রেফারেন্স ধারণ করে।
   - **স্ট্যাটিক মেথডের** ক্ষেত্রে \`_target\` এর মান হয় \`null\`।
   - **ইনস্ট্যান্স মেথডের** ক্ষেত্রে এটি নির্দিষ্ট অবজেক্টটিকে ধরে রাখে এবং কলের সময় অদৃশ্য \`this\` পয়েন্টার হিসেবে পাস করে।
২. **\`_methodPtr\` (\`IntPtr\`)**:
   - মেমোরিতে মেথডটির JIT-কম্পাইল্ড মেশিন কোডের সরাসরি ফাংশন পয়েন্টার।
৩. **\`_invocationList\` (\`object[]\`)**:
   - একাধিক মেথড চেইনিং (Multicast) করা থাকলে তাদের তালিকার অ্যারে ধারণ করে।

---

## স্ট্যাটিক বনাম ইনস্ট্যান্স মেথড ডিসপ্যাচ

ডেলিগেট অবজেক্টের স্টেট বা কনটেক্সট সম্পূর্ণ অক্ষত রাখে:

\`\`\`csharp
public class AccountingService
{
    private readonly decimal taxRate;
    public AccountingService(decimal taxRate) => this.taxRate = taxRate;

    // ইনস্ট্যান্স মেথড: _target এ বর্তমান অবজেক্ট সংরক্ষিত থাকে
    public decimal ApplyTax(decimal subtotal) => subtotal * (1 + taxRate);

    // স্ট্যাটিক মেথড: _target এর মান null
    public static decimal FormatCurrency(decimal amount) => Math.Round(amount, 2);
}

public delegate decimal TaxCalculator(decimal amount);

AccountingService corporateAccounting = new AccountingService(0.15m);
TaxCalculator taxDelegate = corporateAccounting.ApplyTax;

Console.WriteLine(taxDelegate(100.00m)); // 115.00
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem C (Simple Calculator)
*দুটি সংখ্যা $X$ এবং $Y$ দেওয়া থাকবে। এদের যোগফল, গুণফল এবং বিয়োগফল নিচের ফরম্যাটে প্রিন্ট করতে হবে:*
- \`X + Y = summation_result\`
- \`X * Y = multiplication_result\`
- \`X - Y = subtraction_result\`
*ডেলিগেট আর্কিটেকচার ব্যবহার করে অপারেশনগুলো এক্সিকিউট করুন।*

#### সমাধান বিশ্লেষণ
১. $X$ এবং $Y$ এর মান $10^5$ পর্যন্ত হতে পারে, ফলে গুণফল $10^{10}$ পর্যন্ত হতে পারে। ওভারফ্লো এড়াতে ৬৪-বিট \`long\` টাইপ ব্যবহার করতে হবে।
২. একটি ডেলিগেট \`OperationHandler(long a, long b)\` তৈরি করা।
৩. তিনটি গাণিতিক ফাংশন ডেলিগেটের মাধ্যমে কল করে ফরম্যাট অনুযায়ী প্রিন্ট করা।

#### C# সমাধান

\`\`\`csharp
using System;

public delegate long OperationHandler(long a, long b);

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        string[] parts = input.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 2)
        {
            return;
        }

        long x = long.Parse(parts[0]);
        long y = long.Parse(parts[1]);

        OperationHandler add = (a, b) => a + b;
        OperationHandler multiply = (a, b) => a * b;
        OperationHandler subtract = (a, b) => a - b;

        Console.WriteLine($"{x} + {y} = {add(x, y)}");
        Console.WriteLine($"{x} * {y} = {multiply(x, y)}");
        Console.WriteLine($"{x} - {y} = {subtract(x, y)}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, ৬৪-বিট পূর্ণসংখ্যার যোগ, গুণ ও বিয়োগ ধ্রুবক সময়ে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, মেথড পয়েন্টার ও প্রিমিটিভ ভ্যারিয়েবলের জন্য সীমিত মেমোরি প্রয়োজন হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Simple Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C) | Easy | Delegate callbacks, Arithmetic dispatch, 64-bit integers |
| ⚪ | Codeforces | [Assiut Sheet #1: Difference](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D) | Easy | Functional evaluation, Mathematical expressions |
| ⚪ | Exercism C# | [Calculator Conundrum](https://exercism.org/tracks/csharp/exercises/calculator-conundrum) | Easy | Delegates, Method references, Error handling |
| ⚪ | Exercism C# | [Roll the Die](https://exercism.org/tracks/csharp/exercises/roll-the-die) | Easy | Method delegation, Random generation, Value mapping |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Simple Calculator",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Delegates", "Math", "Overflow Protection"],
      solutionEn:
        "Define an OperationHandler delegate to encapsulate addition, multiplication, and subtraction, avoiding 32-bit overflow using 64-bit integers.",
      solutionBn:
        "OperationHandler ডেলিগেটের সাহায্যে যোগ, গুণ ও বিয়োগ অপারেশন এনক্যাপসুলেট করে ৬৪-বিট পূর্ণসংখ্যা ব্যবহারের মাধ্যমে ওভারফ্লো প্রতিরোধ করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Difference",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Math", "Arithmetic", "Expressions"],
      solutionEn:
        "Evaluate the algebraic difference equation X = (A * B) - (C * D) using typed method references and 64-bit precision.",
      solutionBn:
        "টাইপড মেথড রেফারেন্স ও ৬৪-বিট প্রিসিশন ব্যবহার করে X = (A * B) - (C * D) সমীকরণের মান নির্ভুলভাবে হিসাব করুন।",
    },
    {
      source: "Exercism C#",
      name: "Calculator Conundrum",
      url: "https://exercism.org/tracks/csharp/exercises/calculator-conundrum",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Delegates", "Error Handling", "Methods"],
      solutionEn:
        "Build a robust arithmetic calculation engine that verifies arguments and handles division-by-zero exceptions cleanly.",
      solutionBn:
        "আর্গুমেন্ট যাচাই এবং শূন্য দিয়ে ভাগ করার এক্সেপশন হ্যান্ডেল করে একটি শক্তিশালী ক্যালকুলেটর ইঞ্জিন তৈরি করুন।",
    },
    {
      source: "Exercism C#",
      name: "Roll the Die",
      url: "https://exercism.org/tracks/csharp/exercises/roll-the-die",
      difficulty: "EASY",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Random", "Delegation", "Math"],
      solutionEn:
        "Implement random die-rolling methods by delegating generation to Random instances, returning uniformly distributed dice values.",
      solutionBn:
        "Random অবজেক্টে মেথড ডেলিগেশনের মাধ্যমে ছক্কার রোল সিমুলেট করে সুষমভাবে বণ্টিত মান তৈরি করুন।",
    },
  ],
};
