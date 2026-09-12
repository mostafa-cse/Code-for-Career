import type { LocalLesson } from "@/lib/lessons-data";

export const methodsParametersLesson: LocalLesson = {
    slug: "methods-parameters",
    titleEn: "Method Parameters & Arguments",
    titleBn: "মেথড প্যারামিটার ও আর্গুমেন্ট পাসিং",
    categoryEn: "04. Methods",
    categoryBn: "০৪. মেথড ও ফাংশন",
    categoryDescEn:
      "Reusable function architecture in C#: parameter evaluation, passing semantics (by-value vs by-reference), overloading, and modern params features.",
    categoryDescBn:
      "সি# এ ফাংশন ও মেথড আর্কিটেকচার: প্যারামিটার মূল্যায়ন, ভ্যালু বনাম রেফারেন্স পাসিং, ওভারলোডিং এবং মডার্ন প্যারামস।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Pass-by-value default semantics, parameter lists, caller-callee memory models, stack frame lifecycles, and pure functions.",
    descriptionBn:
      "পাস-বাই-ভ্যালু ডিফল্ট আচরণ, প্যারামিটার তালিকা, কলার-কলি মেমোরি মডেল, স্ট্যাক ফ্রেম লাইফসাইকেল এবং পিওর ফাংশন।",
    difficulty: "EASY",
    displayOrder: 1,
    prerequisites: ["csharp-variables"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# Method Parameters & Arguments in C#

A method encapsulates a reusable unit of execution. In C#, **parameters** declare the variables in the method signature, while **arguments** are the actual values supplied by the caller at the call site.

---

## 1. Stack Frame Architecture & Invocation Lifecycle

When a method is called in the .NET CLR:
1. **Stack Frame Push**: The runtime allocates a new **stack frame** for the callee containing space for its parameters and local variables.
2. **Argument Evaluation**: Arguments are evaluated strictly **from left to right** at the call site and copied onto the stack frame.
3. **Execution**: The method body runs in isolation.
4. **Stack Frame Pop**: Upon return, the callee stack frame is destroyed, immediately returning execution control to the caller.

\`\`\`
Caller Stack Frame [ Main() ]
┌─────────────────────────────────────────┐
│ local int a = 10;                       │
│ local int b = 20;                       │
└─────────────────────────────────────────┘
                   │
                   ▼ Method Call: Add(a, b)
Callee Stack Frame [ Add(x, y) ]
┌─────────────────────────────────────────┐
│ param int x = 10  (Bitwise copy of a)   │
│ param int y = 20  (Bitwise copy of b)   │
│ return x + y;                           │
└─────────────────────────────────────────┘
\`\`\`

---

## 2. Pass-by-Value: Value Types vs Reference Types

In C#, **all parameters are passed by value by default**, but the practical effect differs fundamentally depending on whether the type is a value type or a reference type:

### A. Value Types Passed by Value (\`int\`, \`struct\`, \`bool\`)
The runtime creates an **independent copy** of the data on the callee's stack frame. Any modifications inside the method affect only the local copy, leaving the caller's variable untouched:

\`\`\`csharp
public static void ModifyValue(int number)
{
    number += 100; // Changes ONLY the local stack frame copy
}

int original = 50;
ModifyValue(original);
Console.WriteLine(original); // Prints 50 (Unchanged!)
\`\`\`

### B. Reference Types Passed by Value (\`class\`, \`List<T>\`, \`string\`)
When you pass an object reference, **the pointer to the heap object is copied by value**. Both the caller and the callee hold separate pointers, but they point to the **same object on the heap**:
- **Mutating object properties**: Modifies the shared heap object (visible to caller).
- **Reassigning the parameter variable**: Only changes the callee's local pointer, leaving the caller's reference unchanged!

\`\`\`csharp
public class User
{
    public string Name { get; set; } = "";
}

public static void UpdateUser(User u)
{
    // 1. Mutating property -> Affects caller's object!
    u.Name = "Karim";

    // 2. Reassigning parameter -> Only changes local pointer, NOT caller's reference!
    u = new User { Name = "Unknown" };
}

User myUser = new User { Name = "Rahim" };
UpdateUser(myUser);
Console.WriteLine(myUser.Name); // Prints "Karim"
\`\`\`

---

## 3. Comparison: Parameter Passing Matrix

| Category | What is Copied? | Can Callee Mutate Caller's Value? | Can Callee Reassign Caller's Pointer? |
|---|---|---|---|
| **Value Type (by-value)** | Full data bits | **No** (independent copy) | No |
| **Reference Type (by-value)** | 64-bit heap pointer | **Yes** (via property/field mutations) | **No** (reassignment is local) |
| **Value Type (\`ref\`)** | Memory address / alias | **Yes** (direct memory mutation) | N/A |
| **Reference Type (\`ref\`)** | Pointer memory address | **Yes** (via property/field mutations) | **Yes** (can point caller to new object) |

---

## 4. Pure Functions vs Side Effects

A **pure function** is a method where:
1. The return value is determined solely by its input parameters.
2. The method produces zero observable side effects (no mutating arguments, no console I/O, no database writes).

\`\`\`csharp
// Pure function: predictable, testable, concurrency-safe
public static int CalculateTax(int income, int percentage)
{
    return (income * percentage) / 100;
}

// Impure function: modifies state outside its stack frame
public static void ApplyDeduction(ref int accountBalance, int amount)
{
    accountBalance -= amount; // Side effect
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Add Function
*Source: Codeforces Assiut University Training Sheet #5 — Problem A*

**Problem Statement**:
Given two numbers $X$ and $Y$. Build a function that returns the summation of $X$ and $Y$.

**Constraints**:
$0 \\le X, Y \\le 10^5$.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    // Pure function: passes parameters by value
    public static int Add(int x, int y)
    {
        return x + y;
    }

    public static void Main()
    {
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int x = int.Parse(tokens[0]);
        int y = int.Parse(tokens[1]);

        int sum = Add(x, y);
        Console.WriteLine(sum);
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(1)$ — single addition instruction in the CPU ALU.
- **Space Complexity**: $O(1)$ stack frame allocation.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem A: Add](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/A) | Easy | Pure functions, By-value parameters |
| ⚪ | Codeforces Assiut | [Problem B: Print](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/B) | Easy | Method invocation, Loop parameters |
| ⚪ | Exercism C# | [Elons Toy Car](https://exercism.org/tracks/csharp/exercises/elons-toy-car) | Easy | Method state mutation, Classes |
| ⚪ | Exercism C# | [Need for Speed](https://exercism.org/tracks/csharp/exercises/need-for-speed) | Easy | Parameter validation, Invariant checks |
`,

    contentBn: `# C# এ মেথড প্যারামিটার ও আর্গুমেন্ট পাসিং

মেথড হলো কোডের একটি পুনঃব্যবহারযোগ্য কার্যকরী ব্লক। সি# এ **প্যারামিটার** হলো মেথড ডিক্লারেশনে সংজ্ঞায়িত ইনপুট ভেরিয়েবল এবং **আর্গুমেন্ট** হলো মেথড কল করার সময় প্রেরিত প্রকৃত মান।

---

## ১. কল স্ট্যাক ও মেমোরি লাইফসাইকেল

যখন .NET CLR এ কোনো মেথড কল করা হয়:
১. **স্ট্যাক ফ্রেম বরাদ্দ**: রানটাইমে মেথডের প্যারামিটার ও লোকাল ভেরিয়েবল ধারণের জন্য একটি নতুন **কল স্ট্যাক ফ্রেম** বরাদ্দ হয়।
২. **আর্গুমেন্ট মূল্যায়ন**: আর্গুমেন্টগুলো কঠোরভাবে **বাম থেকে ডানে** মূল্যায়িত হয়ে স্ট্যাক ফ্রেমে কপি হয়।
৩. **এক্সিকিউশন**: মেথডটি নিজস্ব স্ট্যাক ফ্রেমে স্বাধীনভাবে কাজ সম্পন্ন করে।
৪. **স্ট্যাক ফ্রেম বিলুপ্তি**: মেথড সম্পন্ন হলে তার স্ট্যাক ফ্রেম মেমোরি থেকে মুছে যায় এবং কলার মেথডে নিয়ন্ত্রণ ফেরত আসে।

---

## ২. পাস-বাই-ভ্যালু: ভ্যালু টাইপ বনাম রেফারেন্স টাইপ

সি# এ ডিফল্টভাবে **সমস্ত প্যারামিটার ভ্যালুর মাধ্যমে (Pass-by-value) পাস হয়**:

### ক. ভ্যালু টাইপ পাসিং (\`int\`, \`struct\`, \`bool\`)
মেথডের স্ট্যাক ফ্রেমে মূল মানের একটি **স্বতন্ত্র বাইনারি কপি** তৈরি হয়। ফলে মেথডের ভেতর মান পরিবর্তন করলেও কলারের মূল ভেরিয়েবলে কোনো পরিবর্তন ঘটে না:

\`\`\`csharp
public static void ModifyValue(int number)
{
    number += 100; // কেবল লোকাল স্ট্যাক ফ্রেমের কপি পরিবর্তিত হবে
}

int original = 50;
ModifyValue(original);
Console.WriteLine(original); // ৫০ ই থাকবে (অপরিবর্তিত)
\`\`\`

### খ. রেফারেন্স টাইপ পাসিং (\`class\`, \`List<T>\`, \`string\`)
রেফারেন্স টাইপ পাস করার সময় হিপ মেমোরিতে থাকা অবজেক্টের **পয়েন্টারটি ভ্যালুর মাধ্যমে কপি হয়**। কলার ও কলি উভয়ই একই অবজেক্ট নির্দেশ করে:
- **অবজেক্টের প্রোপার্টি পরিবর্তন**: সরাসরি হিপের অবজেক্টে পরিবর্তন ঘটায় (কলারে দৃশ্যমান)।
- **প্যারামিটার চলকে নতুন অবজেক্ট অ্যাসাইন**: কেবল কলির লোকাল পয়েন্টার পরিবর্তন করে, কলারের পয়েন্টার অপরিবর্তিত থাকে!

\`\`\`csharp
public class User
{
    public string Name { get; set; } = "";
}

public static void UpdateUser(User u)
{
    // ১. প্রোপার্টি পরিবর্তন -> হিপের অবজেক্ট পরিবর্তিত হবে!
    u.Name = "Karim";

    // ২. নতুন অবজেক্ট অ্যাসাইন -> কলারের পয়েন্টারে কোনো প্রভাব পড়বে না
    u = new User { Name = "Unknown" };
}

User myUser = new User { Name = "Rahim" };
UpdateUser(myUser);
Console.WriteLine(myUser.Name); // "Karim" প্রিন্ট হবে
\`\`\`

---

## ৩. প্যারামিটার পাসিং তুলনামূলক সারণী

| প্রকারভেদ | কী কপি হয়? | কলি কি কলারের মান বদলাতে পারে? | কলি কি কলারের পয়েন্টার বদলাতে পারে? |
|---|---|---|---|
| **ভ্যালু টাইপ (by-value)** | সম্পূর্ণ ডেটা বিট | **না** (স্বাধীন কপি) | প্রযোজ্য নয় |
| **রেফারেন্স টাইপ (by-value)** | ৬৪-বিট হিপ পয়েন্টার | **হ্যাঁ** (প্রোপার্টি পরিবর্তনের মাধ্যমে) | **না** (লোকাল পয়েন্টার পরিবর্তন) |
| **ভ্যালু টাইপ (\`ref\`)** | মেমোরি ঠিকানা / এলিয়াস | **হ্যাঁ** (সরাসরি মেমোরি পরিবর্তন) | প্রযোজ্য নয় |
| **রেফারেন্স টাইপ (\`ref\`)** | পয়েন্টারের মেমোরি ঠিকানা | **হ্যাঁ** (প্রোপার্টি পরিবর্তনের মাধ্যমে) | **হ্যাঁ** (নতুন অবজেক্টে রি-ডিরেক্ট সম্ভব) |

---

## ৪. পিওর ফাংশন (Pure Functions) বনাম সাইড-ইফেক্ট

একটি **পিওর ফাংশন** হলো এমন মেথড যা:
১. কেবল ইনপুট প্যারামিটারের ওপর ভিত্তি করে ফলাফল নির্ধারণ করে।
২. বাইরের কোনো ডেটা বা স্টেট পরিবর্তন করে না (জিরো সাইড-ইফেক্ট)।

\`\`\`csharp
// পিওর ফাংশন: নিরাপদ, সহজে টেস্টযোগ্য ও কনকারেন্সি ফ্রেন্ডলি
public static int CalculateTax(int income, int percentage)
{
    return (income * percentage) / 100;
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: যোগফল ফাংশন (Add Function)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৫ — Problem A*

**সমস্যা পরিচিতি**:
দুটি সংখ্যা $X$ এবং $Y$ দেওয়া থাকবে। একটি ফাংশন তৈরি করুন যা $X$ এবং $Y$ এর যোগফল রিটার্ন করবে।

**সীমাবদ্ধতা**:
$0 \\le X, Y \\le 10^5$।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    // পাস-বাই-ভ্যালু পিওর ফাংশন
    public static int Add(int x, int y)
    {
        return x + y;
    }

    public static void Main()
    {
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int x = int.Parse(tokens[0]);
        int y = int.Parse(tokens[1]);

        int sum = Add(x, y);
        Console.WriteLine(sum);
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(1)$ — একক গাণিতিক যোগ অপারেশন।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ — স্ট্যাক ফ্রেম মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem A: Add](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/A) | Easy | Pure functions, By-value parameters |
| ⚪ | Codeforces Assiut | [Problem B: Print](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/B) | Easy | Method invocation, Loop parameters |
| ⚪ | Exercism C# | [Elons Toy Car](https://exercism.org/tracks/csharp/exercises/elons-toy-car) | Easy | Method state mutation, Classes |
| ⚪ | Exercism C# | [Need for Speed](https://exercism.org/tracks/csharp/exercises/need-for-speed) | Easy | Parameter validation, Invariant checks |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem A: Add",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/A",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Methods", "Parameters", "Math"],
        solutionEn: "Define an Add(int x, int y) function that returns x + y.",
        solutionBn: "দুটি পূর্ণসংখ্যার যোগফল নির্ণয়ের জন্য Add(int x, int y) মেথড লিখুন।",
      },
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem B: Print",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/B",
        difficulty: "EASY",
        company: "Brain Station 23",
        tags: ["Methods", "Loops"],
        solutionEn: "Create a Print(int n) method executing a loop from 1 to N with space separation.",
        solutionBn: "Print(int n) মেথডের ভেতর ১ থেকে N পর্যন্ত লুপ চালিয়ে সংখ্যা প্রিন্ট করুন।",
      },
      {
        source: "Exercism C#",
        name: "Elons Toy Car",
        url: "https://exercism.org/tracks/csharp/exercises/elons-toy-car",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "Classes", "State"],
        solutionEn: "Define instance methods to drain battery and advance distance on each drive call.",
        solutionBn: "ড্রাইভ মেথড দিয়ে ব্যাটারি কমিয়ে ও দূরত্ব বাড়িয়ে অবজেক্ট স্টেট পরিবর্তন করুন।",
      },
      {
        source: "Exercism C#",
        name: "Need for Speed",
        url: "https://exercism.org/tracks/csharp/exercises/need-for-speed",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "Objects"],
        solutionEn: "Implement methods validating battery depletion against track distance limits.",
        solutionBn: "ট্র্যাকের দূরত্বের সাথে ব্যাটারি ক্ষয় গণনা করে ফিনিশ লাইন অতিক্রম যাচাই করুন।",
      },
    ],
  };
