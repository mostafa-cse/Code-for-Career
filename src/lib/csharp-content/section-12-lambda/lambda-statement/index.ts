import type { LocalLesson } from "@/lib/lessons-data";

export const lambdaStatementLesson: LocalLesson = {
  slug: "lambda-statement",
  titleEn: "Closures & Variable Capture",
  titleBn: "ক্লোজার (Closures) ও ভ্যারিয়েবল ক্যাপচারিং ফাঁদ",
  categoryEn: "12. Lambda",
  categoryBn: "১২. ল্যাম্বডা এক্সপ্রেশন (Lambda)",
  categoryDescEn:
    "Anonymous functions in C#: lambda operator (=>), expression vs statement lambdas, closures, and variable capture mechanics.",
  categoryDescBn:
    "সি# এ অ্যানোনিমাস ফাংশন: ল্যাম্বডা অপারেটর (=>), এক্সপ্রেশন বনাম স্টেটমেন্ট ল্যাম্বডা, ক্লোজার ও ভ্যারিয়েবল ক্যাপচার।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Compiler display classes (<>c__DisplayClass), variable lifetime extension, heap allocation overhead, the classic for-loop capture bug, and C# 9 static lambdas.",
  descriptionBn:
    "কম্পাইলার ডিসপ্লে ক্লাস, ভ্যারিয়েবলের আয়ুষ্কাল বৃদ্ধি, হিপ মেমোরি খরচ, ফর-লুপ ক্যাপচার বাগ এবং C# 9 স্ট্যাটিক ল্যাম্বডা।",
  difficulty: "MEDIUM",
  displayOrder: 3,
  prerequisites: ["lambda-expression"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Closures & Variable Capture in C#

A **closure** is an anonymous function coupled with its lexical environment. In C#, when a lambda expression references a variable declared outside its immediate parameter list (an "outer variable capture"), the compiler performs elaborate transformations under the hood.

While closures enable expressive functional paradigms, misunderstanding their internal mechanics can lead to **subtle state-sharing concurrency bugs** and **unexpected Garbage Collection (GC) pressure**.

---

## Compiler Display Classes & Lifetime Extension

Consider this simple capture:
\`\`\`csharp
public Func<int, int> CreateMultiplier(int factor)
{
    // 'factor' is a stack parameter in CreateMultiplier
    return x => x * factor; 
}
\`\`\`

When \`CreateMultiplier\` returns, its stack frame is destroyed. How does the returned lambda still read \`factor\`?

### What the Roslyn Compiler Generates:
The compiler secretly synthesizes a heap-allocated **Display Class**:

\`\`\`csharp
// COMPILER-GENERATED ARTIFACT (DECOMPILED IL PSEUDO-CODE):
[CompilerGenerated]
private sealed class <>c__DisplayClass0_0
{
    public int factor; // Promoted from stack parameter to a HEAP field!

    public int <CreateMultiplier>b__0(int x)
    {
        return x * this.factor;
    }
}

public Func<int, int> CreateMultiplier(int factor)
{
    var closure = new <>c__DisplayClass0_0();
    closure.factor = factor;
    return closure.<CreateMultiplier>b__0;
}
\`\`\`

### Key Takeaways:
1. **Lifetime Extension**: Captured variables are promoted from the stack to the **managed heap**. They survive as long as the delegate reference exists.
2. **Hidden Heap Allocation**: Every invocation of a method capturing variables allocates a new display class object on the heap, generating GC Gen 0 pressure.

---

## The Classic For-Loop Capture Bug

A legendary interview question and production bug occurs when capturing a loop variable:

\`\`\`csharp
// HAZARDOUS CODE:
var actions = new List<Action>();

for (int i = 0; i < 5; i++)
{
    // The lambda captures the variable 'i' itself, NOT its value at this iteration!
    actions.Add(() => Console.Write(i + " "));
}

foreach (var action in actions)
{
    action();
}
// OUTPUT: 5 5 5 5 5 (NOT 0 1 2 3 4!)
\`\`\`

### Why Does This Happen?
The compiler creates a **single display class instance for the entire \`for\` loop**. Each lambda points to the same \`i\` field on the heap. By the time the actions are executed, the loop has completed, and \`i\` equals $5$.

### The Solution:
Create a local copy inside the loop body, forcing the compiler to create a fresh capture per iteration:
\`\`\`csharp
for (int i = 0; i < 5; i++)
{
    int copy = i; // Fresh stack variable per iteration!
    actions.Add(() => Console.Write(copy + " "));
}
// OUTPUT: 0 1 2 3 4
\`\`\`

> **Note on \`foreach\` loops**: Since C# 5.0, the language specification was amended so that \`foreach\` automatically creates a fresh iteration variable per cycle. However, standard \`for\` and \`while\` loops **still share the loop variable**.

---

## Static Lambdas (C# 9.0+)

To completely prevent accidental variable capturing and eliminate display class heap allocations in high-performance paths, decorate the lambda with the \`static\` modifier:

\`\`\`csharp
// Guarantees ZERO display class allocation:
Func<int, int, int> add = static (x, y) => x + y;

int multiplier = 5;
// COMPILER ERROR CS8829: A static anonymous function cannot contain a reference to 'multiplier'
// Func<int, int> multiply = static x => x * multiplier; 
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #2 Problem A (1 to N)
*Given a number $N$. Print numbers from $1$ to $N$ on separate lines. Implement a sequence generator using closures, demonstrating safe loop iteration variable capture.*

#### Algorithmic Analysis
1. Input $N$ ($1 \\le N \\le 1000$).
2. Demonstrate closure generation by queuing action callbacks.
3. Use a localized copy of the iteration index to guarantee that each queued action prints its respective number correctly.

#### C# Implementation

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (int.TryParse(input.Trim(), out int n))
        {
            var printPipeline = new List<Action>(n);

            for (int i = 1; i <= n; i++)
            {
                // CRITICAL: Local copy ensures safe capture per iteration
                int currentNumber = i;
                printPipeline.Add(() => Console.WriteLine(currentNumber));
            }

            // Execute all queued closure actions
            foreach (var printAction in printPipeline)
            {
                printAction();
            }
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$, allocating and invoking $N$ actions sequentially.
- **Space Complexity**: $\\mathcal{O}(N)$, holding $N$ closure objects in the pipeline list.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #2: Problem A: 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/A) | Easy | Closures, Variable capture, Loop execution |
| ⚪ | Codeforces | [Assiut Sheet #1: Summation from 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G) | Easy | Closed-form summation, Static lambdas, 64-bit integers |
| ⚪ | Exercism C# | [Hyper-Optimized Telemetry](https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry) | Medium | Structs, Zero-allocation delegates, Bit manipulation |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | State retention, Closures, State transitions |
`,

  contentBn: `# C# এ ক্লোজার (Closures) ও ভ্যারিয়েবল ক্যাপচারিং ফাঁদ

**ক্লোজার (Closure)** হলো এমন একটি নামবিহীন ফাংশন বা ল্যাম্বডা যা তার নিজের বাইরের স্কোপে ঘোষিত কোনো ভ্যারিয়েবলকে নিজের ভেতর ব্যবহার (Capture) করে।

ক্লোজার ফাংশনাল প্রোগ্রামিংকে অত্যন্ত শক্তিশালী করে তুললেও এর ভেতরের মেকানিজম না বুঝলে **কনকারেন্সি বাগ** এবং **অপ্রয়োজনীয় মেমোরি হিপিং (GC Pressure)** ঘটতে পারে।

---

## কম্পাইলার ডিসপ্লে ক্লাস ও ভ্যারিয়েবলের আয়ুষ্কাল বৃদ্ধি

একটি সাধারণ ক্যাপচারের উদাহরণ লক্ষ করুন:
\`\`\`csharp
public Func<int, int> CreateMultiplier(int factor)
{
    // factor মূলত স্ট্যাকের একটি প্যারামিটার
    return x => x * factor; 
}
\`\`\`

\`CreateMultiplier\` মেথড সম্পন্ন হওয়ার সাথে সাথে তার স্ট্যাক ফ্রেম ধ্বংস হয়ে যাওয়ার কথা। তাহলে রিটার্ন করা ল্যাম্বডা কীভাবে পরবর্তীতে \`factor\` এর মান পড়তে পারে?

### কম্পাইলারের জাদু: ডিসপ্লে ক্লাস
Roslyn কম্পাইলার স্বয়ংক্রিয়ভাবে মেমোরি হিপে একটি গোপন **Display Class** তৈরি করে:

\`\`\`csharp
// কম্পাইলারের তৈরি ইন্টারনাল ক্লাস:
[CompilerGenerated]
private sealed class <>c__DisplayClass0_0
{
    public int factor; // স্ট্যাকের ভ্যারিয়েবলকে হিপ অবজেক্টের ফিল্ড বানিয়ে দেওয়া হয়!

    public int <CreateMultiplier>b__0(int x)
    {
        return x * this.factor;
    }
}
\`\`\`

### মূল শিক্ষণীয় বিষয়:
১. **ভ্যারিয়েবলের আয়ুষ্কাল বৃদ্ধি (Lifetime Extension)**: ক্যাপচার হওয়া ভ্যারিয়েবল স্ট্যাক থেকে **ম্যানেজড হিপে প্রমোট হয়**। ফলে মূল মেথড শেষ হলেও যতক্ষণ ডেলিগেটের অস্তিত্ব থাকে ততক্ষণ ভ্যারিয়েবলটি মেমোরিতে বেঁচে থাকে।
২. **লুকানো হিপ অ্যালোকেশন**: লুপ বা ঘন ঘন কল হওয়া কোডে ভ্যারিয়েবল ক্যাপচার করলে প্রচুর নতুন অবজেক্ট তৈরি হয় যা গার্বেজ কালেক্টরের ওপর চাপ বাড়ায়।

---

## কুখ্যাত ফর-লুপ ক্যাপচার বাগ (The For-Loop Capture Bug)

সফটওয়্যার ইন্টারভিউ এবং প্রোডাকশন কোডের একটি ক্লাসিক বাগ:

\`\`\`csharp
// মারাত্মক ভুল কোড:
var actions = new List<Action>();

for (int i = 0; i < 5; i++)
{
    // ল্যাম্বডা i এর মান নয়, বরং খোদ i ভ্যারিয়েবলটিকে ক্যাপচার করে!
    actions.Add(() => Console.Write(i + " "));
}

foreach (var action in actions)
{
    action();
}
// আউটপুট হবে: 5 5 5 5 5 (0 1 2 3 4 নয়!)
\`\`\`

### কেন এমন হয়?
কম্পাইলার পুরো \`for\` লুপের জন্য **মাত্র একটি ডিসপ্লে ক্লাস ইনস্ট্যান্স** তৈরি করে। ফলে প্রতিটি ল্যাম্বডা হিপে থাকা একই \`i\` ফিল্ড নির্দেশ করে। লুপ শেষে \`i\` এর মান $5$ হয়ে যায়, তাই সবাই $5$ প্রিন্ট করে।

### সমাধান:
লুপের ভেতরে একটি লোকাল কপি তৈরি করুন:
\`\`\`csharp
for (int i = 0; i < 5; i++)
{
    int copy = i; // প্রতিটি ইটারেশনে নতুন স্ট্যাক ভ্যারিয়েবল!
    actions.Add(() => Console.Write(copy + " "));
}
// আউটপুট: 0 1 2 3 4
\`\`\`

> **\`foreach\` লুপ সংক্রান্ত তথ্য**: সি# ৫.০ সংস্করণে \`foreach\` লুপ সংশোধন করা হয়েছে যাতে স্বয়ংক্রিয়ভাবে প্রতি ধাপে নতুন ভ্যারিয়েবল তৈরি হয়। কিন্তু সাধারণ \`for\` এবং \`while\` লুপে এখনো এই সমস্যা বিদ্যমান।

---

## স্ট্যাটিক ল্যাম্বডা (C# 9.0+)

ভুলবশত ভ্যারিয়েবল ক্যাপচার হওয়া এবং মেমোরি হিপিং শতভাগ প্রতিরোধ করতে ল্যাম্বডার আগে \`static\` কি-ওয়ার্ড ব্যবহার করা যায়:

\`\`\`csharp
// নিশ্চিত করে যে কোনো ডিসপ্লে ক্লাস তৈরি হবে না:
Func<int, int, int> add = static (x, y) => x + y;

int multiplier = 5;
// কম্পাইলার এরর CS8829! স্ট্যাটিক ল্যাম্বডাতে বাইরের ভ্যারিয়েবল ক্যাপচার নিষিদ্ধ:
// Func<int, int> multiply = static x => x * multiplier; 
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #2 Problem A (1 to N)
*একটি সংখ্যা $N$ দেওয়া থাকবে। $1$ থেকে $N$ পর্যন্ত সংখ্যাগুলো আলাদা লাইনে প্রিন্ট করতে হবে। ক্লোজারের সাহায্যে নিরাপদ ক্যাপচারিং প্রদর্শন করে সমাধানটি তৈরি করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট $N$ নেওয়া।
২. একটি অ্যাকশন পাইপলাইনে ল্যাম্বডা যুক্ত করা।
৩. লুপ ক্যাপচার বাগ এড়াতে \`int currentNumber = i;\` দিয়ে নিরাপদ কপি নিশ্চিত করা।
৪. পাইপলাইনের সকল ক্লোজার অ্যাকশন রান করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (int.TryParse(input.Trim(), out int n))
        {
            var printPipeline = new List<Action>(n);

            for (int i = 1; i <= n; i++)
            {
                // নিরাপদ লোকাল কপি
                int currentNumber = i;
                printPipeline.Add(() => Console.WriteLine(currentNumber));
            }

            foreach (var printAction in printPipeline)
            {
                printAction();
            }
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$, $N$ সংখ্যক ক্লোজার তৈরি ও এক্সিকিউশনে লিনিয়ার সময় লাগে।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(N)$, পাইপলাইন লিস্ট এবং সংশ্লিষ্ট ক্লোজার অবজেক্ট মেমোরিতে সংরক্ষিত থাকে।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #2: Problem A: 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/A) | Easy | Closures, Variable capture, Loop execution |
| ⚪ | Codeforces | [Assiut Sheet #1: Summation from 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G) | Easy | Closed-form summation, Static lambdas, 64-bit integers |
| ⚪ | Exercism C# | [Hyper-Optimized Telemetry](https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry) | Medium | Structs, Zero-allocation delegates, Bit manipulation |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | State retention, Closures, State transitions |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #2: Problem A: 1 to N",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/A",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Closures", "Loops", "Pipelines"],
      solutionEn:
        "Queue print actions in a list using safe local variable copies to avoid the classic for-loop capture trap, printing from 1 to N.",
      solutionBn:
        "ফর-লুপ ক্যাপচার বাগ এড়াতে নিরাপদ লোকাল কপির সাহায্যে অ্যাকশন পাইপলাইনে ল্যাম্বডা যুক্ত করে ১ থেকে N পর্যন্ত প্রিন্ট করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Summation from 1 to N",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Math", "Static Lambdas", "64-bit"],
      solutionEn:
        "Calculate arithmetic series summation using zero-allocation static lambdas and 64-bit integer arithmetic.",
      solutionBn:
        "জিরো-অ্যালোকেশন স্ট্যাটিক ল্যাম্বডা এবং ৬৪-বিট পূর্ণসংখ্যার সাহায্যে O(1) সময়ে গাণিতিক যোগফল হিসাব করুন।",
    },
    {
      source: "Exercism C#",
      name: "Hyper-Optimized Telemetry",
      url: "https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Bitwise", "Zero Allocation", "Structs"],
      solutionEn:
        "Pack and unpack sensor telemetry using non-capturing delegates and static functions to guarantee zero Garbage Collection pressure.",
      solutionBn:
        "গার্বেজ কালেকশন ওভারহেড এড়াতে নন-ক্যাপচারিং ডেলিগেট ও স্ট্যাটিক ফাংশনের সাহায্যে সেন্সর ডেটা প্যাক ও আনপ্যাক করুন।",
    },
    {
      source: "Exercism C#",
      name: "Robot Simulator",
      url: "https://exercism.org/tracks/csharp/exercises/robot-simulator",
      difficulty: "MEDIUM",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["State Machine", "Closures", "Simulation"],
      solutionEn:
        "Track robot grid coordinates and directional state across sequential movement commands using closure-encapsulated transitions.",
      solutionBn:
        "ক্লোজার ও স্টেট ট্রানজিশনের মাধ্যমে রোবটের অবস্থান ও দিক পরিবর্তনের সিকোয়েন্স কার্যকর করুন।",
    },
  ],
};
