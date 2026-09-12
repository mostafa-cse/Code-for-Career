import type { LocalLesson } from "@/lib/lessons-data";

export const typesDynamicLesson: LocalLesson = {
  slug: "types-dynamic",
  titleEn: "dynamic & DLR",
  titleBn: "ডায়নামিক (dynamic) ও ডায়নামিক ল্যাঙ্গুয়েজ রানটাইম (DLR)",
  categoryEn: "05. Type System",
  categoryBn: "০৫. টাইপ সিস্টেম ও মেমোরি মডেল",
  categoryDescEn:
    "The Common Type System (CTS) in .NET: value types vs reference types, boxing/unboxing overhead, var vs dynamic vs object.",
  categoryDescBn:
    ".NET এর কমন টাইপ সিস্টেম (CTS): ভ্যালু টাইপ বনাম রেফারেন্স টাইপ, বক্সিং/আনবক্সিং মেমোরি ওভারহেড এবং var/dynamic/object।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Dynamic Language Runtime (DLR), bypassing compile-time checks, CallSite caching, RuntimeBinderException, and performance overhead.",
  descriptionBn:
    "ডায়নামিক ল্যাঙ্গুয়েজ রানটাইম (DLR), কম্পাইল-টাইম টাইপ চেকিং এড়ানো, CallSite ক্যাশিং, RuntimeBinderException এবং পারফরম্যান্স ওভারহেড।",
  difficulty: "MEDIUM",
  displayOrder: 4,
  prerequisites: ["types-var", "types-object"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# dynamic & Dynamic Language Runtime (DLR) in C#

Introduced in C# 4.0, the \`dynamic\` type tells the C# compiler to **completely bypass compile-time type verification**. At compile time, any operation (method call, property access, operator, indexer) applied to a \`dynamic\` variable is assumed to be valid.

At runtime, the operation is resolved dynamically by the **Dynamic Language Runtime (DLR)**.

---

## Under the Hood: How the DLR Works

In the compiled assembly's IL metadata, there is actually **no real CLR type named \`dynamic\`**. 

1. The compiler emits \`System.Object\` for the variable.
2. The compiler decorates the member with the attribute \`[System.Runtime.CompilerServices.DynamicAttribute]\`.
3. Every dynamic invocation is converted into a static **CallSite** using the \`System.Runtime.CompilerServices.CallSite<T>\` infrastructure.

\`\`\`
Source Code:
dynamic d = GetPayload();
d.ProcessOrder(100);

Emitted IL / DLR Flow:
1. Check CallSite cache: Has d's concrete type (e.g. OrderService) been seen before?
   ├── Cache HIT:  Invoke cached compiled delegate directly (fast path).
   └── Cache MISS: Invoke DLR Binder -> Build expression tree -> Compile delegate -> Store in CallSite cache.
\`\`\`

---

## CallSite Caching & Performance Tradeoffs

The DLR is designed with a two-tier polymorphic inline cache:
- **Cold Invocation (First Call)**: Very slow (10x to 50x slower than static call). The DLR must inspect runtime metadata, generate expression trees, and invoke the JIT compiler to produce a delegate.
- **Warm Invocation (Subsequent Calls)**: Faster, but still incurs pointer indirection and cache verification checks.

> **Rule of Thumb**: Avoid \`dynamic\` in high-throughput hot paths (e.g., inside loops executing $10^6$ times per second or latency-critical trading systems).

---

## The Runtime Danger: \`RuntimeBinderException\`

Because compile-time safety is completely disabled, typos and missing members will compile without warnings, but crash with an unhandled exception at runtime:

\`\`\`csharp
dynamic user = new { Name = "Arif", Age = 28 };

// Misspelled property compiles with zero errors!
try
{
    Console.WriteLine(user.NonExistentProperty);
}
catch (Microsoft.CSharp.RuntimeBinder.RuntimeBinderException ex)
{
    Console.WriteLine($"Runtime resolution failed: {ex.Message}");
    // Output: 'object' does not contain a definition for 'NonExistentProperty'
}
\`\`\`

---

## When to Use \`dynamic\`

Legitimate, high-value scenarios for \`dynamic\` in production .NET code:

1. **COM Interop**: Automating Microsoft Office (Excel, Word) where early-bound types require clumsy \`Type.Missing\` arguments.
2. **Untyped JSON or REST Payloads**: Reading deeply nested dynamic payloads where defining dozens of DTO classes is counterproductive.
3. **Dynamic Language Interoperability**: Communicating with Python or Ruby running on the CLR (IronPython, IronRuby).
4. **Clean Reflection Wrapper**: Calling private or internal APIs without writing verbose \`MethodInfo.Invoke\` reflection boilerplate.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 — Problem O (Calculator)
*Given an arithmetic expression containing two integers $A$ and $B$ and an operator ($+$, $-$, $*$, $/$) as a single string (e.g. \`7+54\`). Parse the operands and execute the requested arithmetic.*

#### Problem Analysis
- Input: String like \`7+54\` or \`15*20\`.
- Logic: Identify the operator, split the operands, and evaluate the mathematical result.
- We can demonstrate how a dynamic dispatch engine handles heterogenous operations safely with runtime fallbacks.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class DynamicCalculatorSolution
{
    public static long ExecuteCalculation(dynamic a, dynamic b, char op)
    {
        return op switch
        {
            '+' => (long)(a + b),
            '-' => (long)(a - b),
            '*' => (long)(a * b),
            '/' => (long)(a / b),
            _   => throw new ArgumentException("Invalid operator")
        };
    }

    public static void Main()
    {
        string? line = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(line)) return;

        char[] operators = { '+', '-', '*', '/' };
        int opIndex = line.IndexOfAny(operators);
        if (opIndex == -1) return;

        char op = line[opIndex];
        long a = long.Parse(line.Substring(0, opIndex), CultureInfo.InvariantCulture);
        long b = long.Parse(line.Substring(opIndex + 1), CultureInfo.InvariantCulture);

        // Dynamically dispatched evaluation
        long result = ExecuteCalculation((dynamic)a, (dynamic)b, op);
        Console.WriteLine(result);
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(L)$ where $L$ is the string length to scan the operator. The mathematical evaluation is $\\mathcal{O}(1)$.
- **Space Complexity**: $\\mathcal{O}(1)$ stack memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem O: Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/O) | Easy | Dynamic Dispatch, Parsing, Math |
| ⚪ | Exercism C# | [Instruments of Texas](https://exercism.org/tracks/csharp/exercises/instruments-of-texas) | Medium | dynamic, Exception Handling, DLR |
| ⚪ | Exercism C# | [Wizards and Warriors](https://exercism.org/tracks/csharp/exercises/wizards-and-warriors) | Easy | Polymorphism, Method Dispatch |
| ⚪ | Exercism C# | [Remote Control Cleanup](https://exercism.org/tracks/csharp/exercises/remote-control-cleanup) | Medium | Dynamic Interfaces, Refactoring |
`,

  contentBn: `# C# এ ডায়নামিক (dynamic) ও ডায়নামিক ল্যাঙ্গুয়েজ রানটাইম (DLR)

সি# ৪.০ এ যুক্ত হওয়া \`dynamic\` কি-ওয়ার্ড সি# কম্পাইলারকে নির্দেশ দেয় **কম্পাইল-টাইম টাইপ চেকিং সম্পূর্ণ এড়িয়ে যেতে**। কম্পাইল টাইমে একটি \`dynamic\` ভ্যারিয়েবলের ওপর যেকোনো মেথড কল, প্রোপার্টি রিড বা অপারেটর ব্যবহারকে কম্পাইলার বৈধ ধরে নেয়।

প্রোগ্রামটি চলার সময় রানটাইমে **ডায়নামিক ল্যাঙ্গুয়েজ রানটাইম (DLR)** এই অপারেশনগুলো সমাধান করে।

---

## পেছনের মেকানিজম: DLR কীভাবে কাজ করে

কম্পাইল করা বাইটকোডে প্রকৃতপক্ষে \`dynamic\` নামে কোনো ডেটা টাইপ থাকে না:

১. কম্পাইলার এটিকে সাধারণ \`System.Object\` হিসেবে সংরক্ষণ করে।
২. মেম্বারটিকে চিহ্নিত করতে \`[System.Runtime.CompilerServices.DynamicAttribute]\` যুক্ত করে।
৩. প্রতিটি ডায়নামিক কলকে স্ট্যাটিক **CallSite** এর মাধ্যমে রি-ডিরেক্ট করা হয়।

\`\`\`
সোর্স কোড:
dynamic d = GetPayload();
d.ProcessOrder(100);

DLR এর কার্যপদ্ধতি:
১. CallSite ক্যাশ পরীক্ষা করা হয়: অবজেক্টের কনক্রিট টাইপ কি পূর্বে প্রসেস করা হয়েছে?
   ├── ক্যাশে থাকলে: সরাসরি প্রিকম্পাইল্ড ডেলিগেট এক্সিকিউট হয় (ফাস্ট পাথ)।
   └── ক্যাশে না থাকলে: DLR বাইন্ডার এক্সপ্রেশন ট্রি তৈরি করে ডেলিগেট কম্পাইল করে ক্যাশে জমা রাখে।
\`\`\`

---

## CallSite ক্যাশিং ও পারফরম্যান্স ওভারহেড

DLR পলিমরফিজম নিশ্চিত করার জন্য ইনলাইন ক্যাশ মেমোরি ব্যবহার করে:
- **প্রথম কল (Cold Invocation)**: তুলনামূলক ধীরগতির (স্ট্যাটিক কলের চেয়ে ১০ থেকে ৫০ গুণ পর্যন্ত ধীর)। কারণ DLR-কে রানটাইম মেটাডাটা স্ক্যান করে JIT-এর মাধ্যমে ডেলিগেট তৈরি করতে হয়।
- **পরবর্তী কল (Warm Invocation)**: দ্রুততর হলেও সাধারণ স্ট্যাটিক কলের তুলনায় কিছুটা পয়েন্টার চেকিং ওভারহেড থেকে যায়।

> **পেশাদার টিপস**: যে সকল মেথড প্রতি সেকেন্ডে লাখ লাখ বার কল হয় বা হাই-ফ্রিকোয়েন্সি লুপের ভেতর কখনোই \`dynamic\` ব্যবহার করা উচিত নয়।

---

## রানটাইমের ঝুঁকি: \`RuntimeBinderException\`

যেহেতু কম্পাইল টাইমে টাইপ যাচাই করা হয় না, তাই বানানে ভুল বা অনুপস্থিত মেথড থাকলে কোড কোনো ওয়ার্নিং ছাড়াই কম্পাইল হবে, কিন্তু রানটাইমে ক্র্যাশ করবে:

\`\`\`csharp
dynamic user = new { Name = "Arif", Age = 28 };

// ভুল প্রোপার্টির নাম থাকলেও কম্পাইল এরর হবে না!
try
{
    Console.WriteLine(user.NonExistentProperty);
}
catch (Microsoft.CSharp.RuntimeBinder.RuntimeBinderException ex)
{
    Console.WriteLine($"Runtime resolution failed: {ex.Message}");
    // আউটপুট: 'object' does not contain a definition for 'NonExistentProperty'
}
\`\`\`

---

## বাস্তব জীবনে \`dynamic\` ব্যবহারের ক্ষেত্র

১. **COM ইন্টারপ**: মাইক্রোসফট অফিস (Excel, Word) অটোমেশনে টাইপ কাস্টিং জটিলতা দূর করতে।
২. **অসংগঠিত JSON/REST ডাটা**: যেখানে কোনো নির্দিষ্ট DTO ক্লাস তৈরি করা সম্ভব নয়।
৩. **ডায়নামিক ভাষার সাথে সংযোগ**: .NET-এ চলা IronPython বা IronRuby কোডের সাথে ডেটা আদান-প্রদান করতে।
৪. **রিফ্লেকশনের বিকল্প**: \`MethodInfo.Invoke\` এর মতো জটিল রিফ্লেকশন কোড পরিহার করে পরিচ্ছন্ন কোড লিখতে।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #১ — Problem O (Calculator)
*একটি গাণিতিক এক্সপ্রেশনে দুটি সংখ্যা $A$ ও $B$ এবং একটি অপারেটর ($+$, $-$, $*$, $/$) দেওয়া থাকবে (যেমন: \`7+54\`)। অপারেটর চিহ্নিত করে হিসাব সম্পন্ন করতে হবে।*

#### সমাধান বিশ্লেষণ
- স্ট্রিং ইনপুট থেকে অপারেটরের ইনডেক্স খুঁজে বের করে অপারেন্ড দুটিকে আলাদা করা হয়েছে।
- রানটাইম ডায়নামিক ডিসপ্যাচ মেকানিজমে বিভিন্ন টাইপ অপারেশনের সঠিক মূল্যায়ন করা হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class DynamicCalculatorSolution
{
    public static long ExecuteCalculation(dynamic a, dynamic b, char op)
    {
        return op switch
        {
            '+' => (long)(a + b),
            '-' => (long)(a - b),
            '*' => (long)(a * b),
            '/' => (long)(a / b),
            _   => throw new ArgumentException("Invalid operator")
        };
    }

    public static void Main()
    {
        string? line = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(line)) return;

        char[] operators = { '+', '-', '*', '/' };
        int opIndex = line.IndexOfAny(operators);
        if (opIndex == -1) return;

        char op = line[opIndex];
        long a = long.Parse(line.Substring(0, opIndex), CultureInfo.InvariantCulture);
        long b = long.Parse(line.Substring(opIndex + 1), CultureInfo.InvariantCulture);

        long result = ExecuteCalculation((dynamic)a, (dynamic)b, op);
        Console.WriteLine(result);
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(L)$ — স্ট্রিংয়ের দৈর্ঘ্য অনুযায়ী অপারেটর খোঁজা। গাণিতিক হিসাব $\\mathcal{O}(1)$ সময়ে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem O: Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/O) | Easy | Dynamic Dispatch, Parsing, Math |
| ⚪ | Exercism C# | [Instruments of Texas](https://exercism.org/tracks/csharp/exercises/instruments-of-texas) | Medium | dynamic, Exception Handling, DLR |
| ⚪ | Exercism C# | [Wizards and Warriors](https://exercism.org/tracks/csharp/exercises/wizards-and-warriors) | Easy | Polymorphism, Method Dispatch |
| ⚪ | Exercism C# | [Remote Control Cleanup](https://exercism.org/tracks/csharp/exercises/remote-control-cleanup) | Medium | Dynamic Interfaces, Refactoring |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #1",
      name: "Problem O: Calculator",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/O",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["dynamic", "Math", "Parsing"],
      solutionEn: "Parse operands and operator from an expression string and compute result using dynamic dispatch.",
      solutionBn: "এক্সপ্রেশন থেকে অপারেন্ড ও অপারেটর আলাদা করে ডায়নামিক ডিসপ্যাচে ফলাফল গণনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Instruments of Texas",
      url: "https://exercism.org/tracks/csharp/exercises/instruments-of-texas",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["dynamic", "DLR", "Exceptions"],
      solutionEn: "Catch RuntimeBinderException and guard arithmetic operations dynamically across varying numeric inputs.",
      solutionBn: "RuntimeBinderException হ্যান্ডেল করে বিভিন্ন নিউমেরিক টাইপের ওপর নিরাপদ ডায়নামিক অপারেশন সম্পাদন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Wizards and Warriors",
      url: "https://exercism.org/tracks/csharp/exercises/wizards-and-warriors",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["dynamic", "Polymorphism", "OOP"],
      solutionEn: "Dispatch combat actions between heterogeneous warrior and wizard character instances.",
      solutionBn: "যোদ্ধা ও জাদুকরের ভিন্ন বৈশিষ্ট্যের ক্যারেক্টার ইনস্ট্যান্সের মধ্যে অ্যাকশন মেথড ডিসপ্যাচ করুন।",
    },
    {
      source: "Exercism C#",
      name: "Remote Control Cleanup",
      url: "https://exercism.org/tracks/csharp/exercises/remote-control-cleanup",
      difficulty: "MEDIUM",
      company: "Kaz Software",
      tags: ["dynamic", "Interfaces", "Refactoring"],
      solutionEn: "Clean up and standardize telemetry interfaces using flexible dynamic bindings and type checks.",
      solutionBn: "ডায়নামিক বাইন্ডিং ও টাইপ চেকের সাহায্যে টেলিমেট্রি ইন্টারফেসের গঠন পরিচ্ছন্ন ও স্ট্যান্ডার্ড করুন।",
    },
  ],
};
