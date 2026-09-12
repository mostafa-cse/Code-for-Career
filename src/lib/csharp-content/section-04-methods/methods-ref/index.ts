import type { LocalLesson } from "@/lib/lessons-data";

export const methodsRefLesson: LocalLesson = {
    slug: "methods-ref",
    titleEn: "ref Modifier",
    titleBn: "রেফ (ref) মডিফায়ার ও রেফারেন্স পাসিং",
    categoryEn: "04. Methods",
    categoryBn: "০৪. মেথড ও ফাংশন",
    categoryDescEn:
      "Reusable function architecture in C#: parameter evaluation, passing semantics (by-value vs by-reference), overloading, and modern params features.",
    categoryDescBn:
      "সি# এ ফাংশন ও মেথড আর্কিটেকচার: প্যারামিটার মূল্যায়ন, ভ্যালু বনাম রেফারেন্স পাসিং, ওভারলোডিং এবং মডার্ন প্যারামস।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Explicit pass-by-reference, memory aliasing, caller-side initialization, in parameters, and ref returns in C#.",
    descriptionBn:
      "স্পষ্ট রেফারেন্স পাসিং, মেমোরি এলিয়াজিং, কলার-সাইডে ইনিশিয়ালাইজেশন, in প্যারামিটার এবং ref রিটার্ন।",
    difficulty: "EASY",
    displayOrder: 4,
    prerequisites: ["methods-parameters"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# ref Parameter Modifier in C#

The \`ref\` keyword causes an argument to be passed **by reference** rather than by value. Instead of pushing a copy onto the callee's stack frame, the runtime passes the **memory address** of the caller's variable.

---

## 1. Memory Aliasing: How ref Operates Under the Hood

When a method declares a parameter with \`ref\`, the parameter becomes a direct **alias** for the caller's storage location:

\`\`\`
Caller Stack Frame [ Main ]               Callee Stack Frame [ Swap ]
┌─────────────────────────┐               ┌─────────────────────────┐
│ int a (Addr: 0x7FFF00)  │◄──────────────┤ ref int x (Holds: 0x7FFF00)
│ int b (Addr: 0x7FFF04)  │◄──────────────┤ ref int y (Holds: 0x7FFF04)
└─────────────────────────┘               └─────────────────────────┘
\`\`\`

Any assignment to \`x\` or \`y\` directly mutates the physical memory slots of \`a\` and \`b\` in the caller's stack frame.

### Three Inviolable Rules of \`ref\`:
1. **Definite Assignment Rule**: The argument variable **must be initialized** before being passed. Passing an uninitialized variable triggers compiler error CS0165.
2. **Keyword Symmetry**: The \`ref\` token must appear in **both** the method signature and at the call site:
   \`\`\`csharp
   void Swap(ref int x, ref int y); // Signature
   Swap(ref a, ref b);              // Call site
   \`\`\`
   This explicit symmetry guarantees that developers reading call sites are immediately aware that their variable may be modified.
3. **Cannot Be Used With**: \`async\` methods, iterator blocks (\`yield\`), or properties (only actual variables/fields have physical addresses).

---

## 2. Modern C# Additions: \`in\`, \`ref readonly\`, and \`ref\` Returns

C# 7.0 through C# 12 introduced high-performance memory semantics around references:

### A. The \`in\` Parameter Modifier (Pass-by-Reference Readonly)
When passing large structs (e.g. 64-byte matrices or vectors), copying values on every method invocation incurs CPU overhead. The \`in\` modifier passes the struct by reference **without copying**, while strictly prohibiting the callee from modifying it:

\`\`\`csharp
public struct LargeMatrix
{
    // 64+ bytes of data
}

// Zero-copy, read-only parameter
public static void Render(in LargeMatrix matrix)
{
    // matrix.Data = 10; // ❌ COMPILE ERROR: Cannot assign to variable because it is a readonly variable
}
\`\`\`

### B. \`ref\` Returns and \`ref\` Locals
Methods can return references to memory slots inside arrays or objects:

\`\`\`csharp
public static ref int FindFirstPositive(int[] numbers)
{
    for (int i = 0; i < numbers.Length; i++)
    {
        if (numbers[i] > 0) return ref numbers[i]; // Returns memory reference to element
    }
    throw new InvalidOperationException();
}

int[] scores = { -5, -2, 10, 25 };
ref int firstPos = ref FindFirstPositive(scores);
firstPos = 999; // Mutates scores[2] directly!
Console.WriteLine(scores[2]); // Prints 999
\`\`\`

---

## 3. Comparison Matrix: By-Value vs ref vs in vs out

| Modifier | Callee Can Read? | Callee Must Assign? | Caller Must Initialize? | Memory Copy? |
|---|---|---|---|---|
| **None (By-Value)** | **Yes** | No | **Yes** | Yes (Copy on stack) |
| **\`ref\`** | **Yes** | No | **Yes** | **No (Direct pointer)** |
| **\`in\`** | **Yes** | **Forbidden (Readonly)** | **Yes** | **No (Direct pointer)** |
| **\`out\`** | Not before assign | **Yes (Mandatory)** | **No** | **No (Direct pointer)** |

---

## Practical Problem Walkthrough

### Problem: Swap Two Numbers with ref
*Source: Codeforces Assiut University Training Sheet #5 — Problem E (Swap)*

**Problem Statement**:
Given two numbers $X$ and $Y$. Print $X$ and $Y$ after swapping them using a function with \`ref\` parameters.

**Constraints**:
$0 \\le X, Y \\le 10^5$.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    // In-place swap using reference memory aliasing
    public static void Swap(ref int a, ref int b)
    {
        int temp = a;
        a = b;
        b = temp;
    }

    public static void Main()
    {
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int x = int.Parse(tokens[0]);
        int y = int.Parse(tokens[1]);

        // Symmetrical ref keyword at call site
        Swap(ref x, ref y);

        Console.WriteLine($"{x} {y}");
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(1)$ — three pointer assignments executed in constant CPU clock cycles.
- **Space Complexity**: $O(1)$ — zero memory allocations; operates directly on the caller's stack frame.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem E: Swap](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/E) | Easy | In-place swap, ref modifier |
| ⚪ | Exercism C# | [Rotational Cipher](https://exercism.org/tracks/csharp/exercises/rotational-cipher) | Easy | Character shifting, In-place mutation |
| ⚪ | Codeforces Assiut | [Problem F: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | Two-pointer swap, ref |
| ⚪ | Exercism C# | [Roll the Die](https://exercism.org/tracks/csharp/exercises/roll-the-die) | Easy | In-place random generation |
`,

    contentBn: `# C# এ রেফ (ref) মডিফায়ার ও রেফারেন্স পাসিং

\`ref\` কিওয়ার্ড ব্যবহারের মাধ্যমে কোনো আর্গুমেন্টকে ভ্যালুর পরিবর্তে **সরাসরি রেফারেন্সের মাধ্যমে (Pass-by-reference)** পাস করা হয়। মেথডের স্ট্যাক ফ্রেমে নতুন কপি তৈরি করার পরিবর্তে কলারের মূল ভেরিয়েবলের **মেমোরি ঠিকানা বা এলিয়াস** কলির কাছে পাঠানো হয়।

---

## ১. মেমোরি এলিয়াজিং ও অভ্যন্তরীণ মেকানিজম

\`ref\` ব্যবহার করলে প্যারামিটারটি কলারের ভেরিয়েবলের সরাসরি **মেমোরি এলিয়াস (Alias)** এ পরিণত হয়:
- কলারের স্ট্যাক ফ্রেমে থাকা মূল চলক এবং কলির প্যারামিটার হুবহু একই মেমোরি অ্যাড্রেস শেয়ার করে।
- কলির ভেতর যে পরিবর্তন করা হয়, তা তাৎক্ষণিকভাবে কলারের মূল মেমোরি স্লটেই কার্যকর হয়।

### \`ref\` ব্যবহারের ৩টি অমোঘ নিয়ম:
১. **প্রাক-ইনিশিয়ালাইজেশনের বাধ্যবাধকতা**: মেথডে \`ref\` হিসেবে পাঠানোর পূর্বে চলকে অবশ্যই কোনো মান অ্যাসাইন করা থাকতে হবে (অন্যথায় CS0165 কম্পাইল এরর)।
২. **কিওয়ার্ড সিমেট্রি (উভয় প্রান্তে লেখা বাধ্যতামূলক)**: মেথড ডিক্লারেশন এবং মেথড কল করার জায়গা — উভয় স্থানেই স্পষ্টভাবে \`ref\` লিখতে হবে:
   \`\`\`csharp
   void Swap(ref int x, ref int y); // মেথড সিগনেচার
   Swap(ref a, ref b);              // কল করার সময়
   \`\`\`
   এর ফলে কল সাইট দেখেই বোঝা যায় যে ভেরিয়েবলটি পরিবর্তিত হতে পারে।
৩. **যেখানে ব্যবহার নিষিদ্ধ**: \`async\` মেথড, আইট্যারেটর ব্লক (\`yield\`) এবং প্রোপার্টিতে \`ref\` ব্যবহার করা যায় না (কেবল আসল ভেরিয়েবলেরই মেমোরি ঠিকানা থাকে)।

---

## ২. আধুনিক সি# ফিচার: \`in\`, \`ref readonly\` ও \`ref\` রিটার্ন

### ক. \`in\` প্যারামিটার (রিড-অনলি রেফারেন্স)
বড় আকারের স্ট্রাক্ট (যেমন: ৬৪ বাইটের ম্যাট্রিক্স) মেথডে পাস করার সময় কপি তৈরি হওয়া রোধ করতে \`in\` ব্যবহার করা হয়। এতে কোনো কপি তৈরি হয় না এবং মেথডের ভেতর মান পরিবর্তন করাও নিষিদ্ধ থাকে:

\`\`\`csharp
public static void Render(in LargeMatrix matrix)
{
    // জিরো-কপি, কিন্তু রিড-অনলি
}
\`\`\`

### খ. \`ref\` রিটার্ন ও লোকাল ভেরিয়েবল
মেথড থেকে সরাসরি অ্যারে বা অবজেক্টের অভ্যন্তরীণ মেমোরি স্লটের রেফারেন্স রিটার্ন করা সম্ভব:

\`\`\`csharp
public static ref int FindFirstPositive(int[] numbers)
{
    return ref numbers[2];
}
\`\`\`

---

## ৩. প্যারামিটার পাসিং তুলনামূলক সারণী

| মডিফায়ার | মেথড কি পড়তে পারে? | মেথডে মান দেওয়া বাধ্যতামূলক? | কল করার আগে ইনিশিয়ালাইজ করতে হবে? | মেমোরি কপি হয়? |
|---|---|---|---|---|
| **সাধারণ (By-Value)** | **হ্যাঁ** | না | **হ্যাঁ** | হ্যাঁ (স্ট্যাকে কপি) |
| **\`ref\`** | **হ্যাঁ** | না | **হ্যাঁ** | **না (সরাসরি পয়েন্টার)** |
| **\`in\`** | **হ্যাঁ** | **নিষিদ্ধ (রিড-অনলি)** | **হ্যাঁ** | **না (সরাসরি পয়েন্টার)** |
| **\`out\`** | মান অ্যাসাইনের আগে নয় | **হ্যাঁ (বাধ্যতামূলক)** | **না** | **না (সরাসরি পয়েন্টার)** |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: দুটি সংখ্যার মান অদলবদল (Swap)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৫ — Problem E*

**সমস্যা পরিচিতি**:
দুটি সংখ্যা $X$ এবং $Y$ দেওয়া থাকবে। \`ref\` প্যারামিটারযুক্ত ফাংশন তৈরি করে তাদের মান অদলবদল (Swap) করে প্রিন্ট করুন।

**সীমাবদ্ধতা**:
$0 \\le X, Y \\le 10^5$।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    // মেমোরি এলিয়াজিংয়ের মাধ্যমে ইন-প্লেস সোয়াপ
    public static void Swap(ref int a, ref int b)
    {
        int temp = a;
        a = b;
        b = temp;
    }

    public static void Main()
    {
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int x = int.Parse(tokens[0]);
        int y = int.Parse(tokens[1]);

        // কল সাইটে ref কিওয়ার্ড আবশ্যক
        Swap(ref x, ref y);

        Console.WriteLine($"{x} {y}");
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(1)$ — তিনটি সাধারণ পয়েন্টার অ্যাসাইনমেন্ট।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ — কলারের মূল স্ট্যাক মেমোরিতে সরাসরি কাজ সম্পন্ন হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem E: Swap](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/E) | Easy | In-place swap, ref modifier |
| ⚪ | Exercism C# | [Rotational Cipher](https://exercism.org/tracks/csharp/exercises/rotational-cipher) | Easy | Character shifting, In-place mutation |
| ⚪ | Codeforces Assiut | [Problem F: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | Two-pointer swap, ref |
| ⚪ | Exercism C# | [Roll the Die](https://exercism.org/tracks/csharp/exercises/roll-the-die) | Easy | In-place random generation |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem E: Swap",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/E",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Methods", "ref", "Pointers"],
        solutionEn: "Swap two integer variables in-place by passing both with the ref modifier.",
        solutionBn: "ref মডিফায়ার ব্যবহার করে দুটি পূর্ণসংখ্যার মান সরাসরি ইন-প্লেস অদলবদল করুন।",
      },
      {
        source: "Exercism C#",
        name: "Rotational Cipher",
        url: "https://exercism.org/tracks/csharp/exercises/rotational-cipher",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "Strings", "In-Place"],
        solutionEn: "Rotate alphabet characters by a given shift key using modular arithmetic.",
        solutionBn: "মডুলার পাটিগণিত প্রয়োগ করে নির্দিষ্ট শিফট কি অনুযায়ী অক্ষরের অবস্থান পরিবর্তন করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem F: Reversing",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Methods", "Arrays", "ref"],
        solutionEn: "Reverse an array in-place by passing elements to a swap helper with ref.",
        solutionBn: "ref মডিফায়ারযুক্ত সোয়াপ হেল্পারের মাধ্যমে অ্যারে রিভার্স করুন।",
      },
      {
        source: "Exercism C#",
        name: "Roll the Die",
        url: "https://exercism.org/tracks/csharp/exercises/roll-the-die",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "Random"],
        solutionEn: "Implement pseudo-random dice rolling and spell generation methods.",
        solutionBn: "র‍্যান্ডম মেথড ব্যবহার করে ছক্কা নিক্ষেপ ও স্পেল শক্তি নির্ধারণ করুন।",
      },
    ],
  };
