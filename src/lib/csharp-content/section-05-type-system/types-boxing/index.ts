import type { LocalLesson } from "@/lib/lessons-data";

export const typesBoxingLesson: LocalLesson = {
  slug: "types-boxing",
  titleEn: "Boxing",
  titleBn: "বক্সিং (Boxing) ও হিপ মেমোরি অ্যালোকেশন",
  categoryEn: "05. Type System",
  categoryBn: "০৫. টাইপ সিস্টেম ও মেমোরি মডেল",
  categoryDescEn:
    "The Common Type System (CTS) in .NET: value types vs reference types, boxing/unboxing overhead, var vs dynamic vs object.",
  categoryDescBn:
    ".NET এর কমন টাইপ সিস্টেম (CTS): ভ্যালু টাইপ বনাম রেফারেন্স টাইপ, বক্সিং/আনবক্সিং মেমোরি ওভারহেড এবং var/dynamic/object।",
  categoryPriority: "CORE",
  descriptionEn:
    "Converting value types to object or interface references, heap allocation mechanics, GC pressure, hidden boxing traps, and generic zero-boxing.",
  descriptionBn:
    "ভ্যালু টাইপকে অবজেক্ট বা ইন্টারফেসে রূপান্তর, হিপ মেমোরি বণ্টন, GC চাপ, অপ্রকাশ্য বক্সিং ফাঁদ এবং জেনেরিকস দিয়ে জিরো-বক্সিং।",
  difficulty: "MEDIUM",
  displayOrder: 6,
  prerequisites: ["types-object", "types-value-types"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Boxing in C#

**Boxing** is the automatic (implicit) conversion of a value type (like an \`int\`, \`double\`, or custom \`struct\`) to the type \`object\` or to any interface implemented by that value type.

While boxing provides seamless universal polymorphism across the Common Type System, it incurs significant **heap allocation and Garbage Collection penalties** if triggered unintentionally in performance-critical code.

---

## CLR Execution Mechanics: What Actually Happens

When the CLR executes the IL \`box\` instruction, three distinct steps occur:

\`\`\`
1. Stack: [ int val = 42 ] (4 bytes on stack)
                     │
                     ▼
2. Heap Allocation: [ SyncBlock (8B) | MethodTable (8B) | Payload (4B) | Padding (4B) ]
                     ▲
                     │
3. Pointer returned: object obj = 0x00FF82B0; (8-byte pointer on stack)
\`\`\`

1. **Heap Allocation**: The CLR allocates memory on the **managed heap** containing the 16-byte object header (SyncBlockIndex + MethodTable pointer) plus the size of the value type, aligned to 8 bytes.
2. **Bitwise Memory Copy**: The raw bits of the value type on the stack are copied into the payload area of the newly allocated heap object.
3. **Reference Address Returned**: An 8-byte pointer to this new heap object is placed into the target variable.

---

## The Severe Performance Costs of Boxing

### 1. High-Throughput Memory Allocation
Boxing a 4-byte \`int\` allocates **24 bytes on the 64-bit managed heap** (16 bytes header + 4 bytes int + 4 bytes alignment padding). That is a **600% memory inflation**!

### 2. Garbage Collection (Gen 0) Thrashing
Consider a loop processing $10^6$ transactions:

\`\`\`csharp
// Anti-pattern: Non-generic collection creates 1,000,000 heap objects!
System.Collections.ArrayList legacyList = new System.Collections.ArrayList();
for (int i = 0; i < 1_000_000; i++)
{
    legacyList.Add(i); // BOXING! 1,000,000 heap allocations in Gen 0
}

// Zero-boxing modern solution using Generics:
List<int> fastList = new List<int>(1_000_000);
for (int i = 0; i < 1_000_000; i++)
{
    fastList.Add(i); // ZERO allocations! Stored directly in contiguous int[] buffer
}
\`\`\`

---

## Hidden Boxing Traps in Everyday C#

### Trap 1: Casting a Struct to an Interface
When a \`struct\` implements an interface, invoking members through the interface reference boxes the struct:

\`\`\`csharp
public struct Counter : IComparable
{
    public int Value;
    public int CompareTo(object? obj) => 0;
}

Counter c = new Counter { Value = 10 };
IComparable comp = c; // BOXING! Moves struct to the heap
\`\`\`

### Trap 2: Calling \`GetType()\` on Value Types
\`GetType()\` is a non-virtual method defined on \`System.Object\`. Calling it on any struct or primitive always boxes:

\`\`\`csharp
int number = 42;
Type t = number.GetType(); // BOXING! number is boxed to call System.Object.GetType()
\`\`\`

### Trap 3: Passing Value Types to \`params object[]\`
Methods taking \`params object[]\` (e.g. legacy \`String.Format\`) box every primitive parameter:

\`\`\`csharp
int userId = 101;
double score = 98.5;
// Pre-C# 10: string.Format boxes both userId and score!
string log = string.Format("User {0} achieved score {1}", userId, score);

// C# 10+: InterpolatedStringHandler eliminates boxing completely:
string modernLog = $"User {userId} achieved score {score}";
\`\`\`

---

## Zero-Boxing with Generic Constraints

To write generic methods that operate on structs without boxing, use the \`struct\` and interface constraints:

\`\`\`csharp
// NO BOXING: The JIT compiler generates specialized machine code for struct T
public static int CompareEntities<T>(T first, T second) where T : struct, IComparable<T>
{
    return first.CompareTo(second); // Direct inlined call, zero boxing!
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 — Problem A (Summation)
*Given an array of $N$ numbers. Print the absolute summation of its elements using a high-performance, zero-boxing algorithm.*

#### Problem Analysis
- Input: Length $N$ ($1 \\le N \\le 10^5$) and $N$ integers ($|A_i| \\le 10^9$).
- Danger: Accumulating large integers requires a 64-bit \`long\` to prevent overflow.
- Performance: Using primitive value types directly on the stack avoids any heap boxing overhead.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class SummationSolution
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;
        int n = int.Parse(nLine.Trim());

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Primitive 64-bit accumulator lives directly on the stack
        long totalSum = 0;

        for (int i = 0; i < n; i++)
        {
            long value = long.Parse(tokens[i], CultureInfo.InvariantCulture);
            totalSum += value; // Direct CPU register addition, zero boxing
        }

        long absoluteSum = Math.Abs(totalSum);
        Console.WriteLine(absoluteSum);
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$ — single linear pass through the tokens.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary space — all calculations occur within stack-allocated 64-bit value types.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem A: Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/A) | Easy | Value Types, Stack Accumulator, Zero-Boxing |
| ⚪ | Codeforces Assiut | [Problem Q: Digits](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/Q) | Easy | Modulo Arithmetic, Value Parsing |
| ⚪ | Exercism C# | [Log Analysis](https://exercism.org/tracks/csharp/exercises/log-analysis) | Easy | String Extensions, Avoiding Boxed Objects |
| ⚪ | Exercism C# | [Difference of Squares](https://exercism.org/tracks/csharp/exercises/difference-of-squares) | Easy | Pure Value Type Math, Overflow Safety |
`,

  contentBn: `# C# এ বক্সিং (Boxing) ও হিপ মেমোরি অ্যালোকেশন

**বক্সিং (Boxing)** হলো এমন একটি প্রক্রিয়া যার মাধ্যমে কোনো ভ্যালু টাইপকে (যেমন \`int\`, \`double\`, \`struct\`) স্বয়ংক্রিয়ভাবে \`object\` টাইপ অথবা ভ্যালু টাইপটির ইমপ্লিমেন্ট করা কোনো \`interface\` রেফারেন্সে রূপান্তর করা হয়।

কমন টাইপ সিস্টেমে (CTS) বক্সিং সার্বজনীন পলিমরফিজম নিশ্চিত করলেও অসতর্ক ব্যবহারের ফলে এটি হিপ মেমোরিতে অতিরিক্ত অবজেক্ট তৈরি করে এবং **গার্বেজ কালেক্টরের (GC) ওপর প্রচণ্ড চাপ সৃষ্টি করে**।

---

## CLR-এর অভ্যন্তরীণ মেকানিজম: পেছনের ধাপসমূহ

যখন CLR কোনো ভ্যালু টাইপকে বক্স করে (IL \`box\` ইনস্ট্রাকশন চালায়):

\`\`\`
১. স্ট্যাক: [ int val = 42 ] (স্ট্যাকে ৪ বাইট)
                     │
                     ▼
২. হিপ মেমোরি বরাদ্দ: [ SyncBlock (8B) | MethodTable (8B) | Payload (4B) | Padding (4B) ]
                     ▲
                     │
৩. পয়েন্টার রিটার্ন: object obj = 0x00FF82B0; (স্ট্যাকে ৮-বাইটের পয়েন্টার)
\`\`\`

১. **হিপ মেমোরি বরাদ্দ**: CLR হিপে ১৬-বাইটের হেডার (SyncBlockIndex + MethodTable) এবং ভ্যালু টাইপের মেমোরি সাইজের সমপরিমাণ জায়গা বরাদ্দ করে।
২. **বিটওয়াইজ মেমোরি অনুলিপি**: স্ট্যাকে থাকা ভ্যালুর বিটগুলো হিপের নতুন অবজেক্টে কপি করা হয়।
৩. **পয়েন্টার রিটার্ন**: হিপে তৈরি হওয়া নতুন অবজেক্টের ৮-বাইটের মেমোরি অ্যাড্রেস রেফারেন্স চলকে প্রদান করা হয়।

---

## বক্সিংয়ের মারাত্মক পারফরম্যান্স ক্ষতি

### ১. মেমোরির অপচয় (Memory Inflation)
একটি সাধারণ ৪-বাইটের \`int\` বক্স করার সাথে সাথে হিপে **২৪ বাইটের মেমোরি অপচয়** হয় (১৬ বাইট হেডার + ৪ বাইট int + ৪ বাইট প্যাডিং)। এটি মূল সাইজের প্রায় ৬০০% বেশি!

### ২. গার্বেজ কালেকশন (Gen 0) ট্র্যাশিং
একটি লুপে যদি ১০ লাখ বার বক্সিং ঘটে:

\`\`\`csharp
// নন-জেনেরিক কালেকশন ১০ লাখ হিপ অবজেক্ট তৈরি করে:
System.Collections.ArrayList legacyList = new System.Collections.ArrayList();
for (int i = 0; i < 1_000_000; i++)
{
    legacyList.Add(i); // বক্সিং! Gen 0 হিপে ১০ লাখ অবজেক্ট তৈরি হলো
}

// জেনেরিকসের মাধ্যমে জিরো-বক্সিং আধুনিক সমাধান:
List<int> fastList = new List<int>(1_000_000);
for (int i = 0; i < 1_000_000; i++)
{
    fastList.Add(i); // জিরো বক্সিং! স্ট্যাক থেকে সরাসরি নিরবচ্ছিন্ন মেমোরিতে সংরক্ষণ
}
\`\`\`

---

## কোডে লুকিয়ে থাকা বক্সিংয়ের ফাঁদসমূহ

### ফাঁদ ১: স্ট্রাক্টকে ইন্টারফেসে কাস্ট করা
স্ট্রাক্ট কোনো ইন্টারফেস ইমপ্লিমেন্ট করলে ইন্টারফেস রেফারেন্সের মাধ্যমে কল করলে স্ট্রাক্টটি বক্সড হয়ে যায়:

\`\`\`csharp
public struct Counter : IComparable
{
    public int Value;
    public int CompareTo(object? obj) => 0;
}

Counter c = new Counter { Value = 10 };
IComparable comp = c; // বক্সিং! স্ট্রাক্টটি হিপ মেমরিতে চলে যায়
\`\`\`

### ফাঁদ ২: ভ্যালু টাইপে \`GetType()\` কল করা
\`GetType()\` মেথডটি নন-ভার্চুয়াল এবং \`System.Object\`-এ সংজ্ঞায়িত। তাই কোনো স্ট্রাক্ট বা প্রিমিটিভে এটি কল করলে মানটি বক্সড হতে বাধ্য:

\`\`\`csharp
int number = 42;
Type t = number.GetType(); // বক্সিং! System.Object এর মেথড কলের জন্য বক্সিং সম্পন্ন হয়
\`\`\`

### ফাঁদ ৩: \`params object[]\` প্যারামিটারে ভ্যালু পাস করা
\`String.Format\` এর মতো মেথডে প্রিমিটিভ পাস করলে প্রতিটির জন্য আলাদা অবজেক্ট তৈরি হয়:

\`\`\`csharp
int userId = 101;
double score = 98.5;
// C# 10 এর আগে string.Format দুটি মানকেই বক্স করতো:
string log = string.Format("User {0} achieved score {1}", userId, score);

// C# 10+ এর আধুনিক স্ট্রিং ইন্টারপোলেশন বক্সিং সম্পূর্ণ দূর করেছে:
string modernLog = $"User {userId} achieved score {score}";
\`\`\`

---

## জেনেরিক কনস্ট্রেইন্ট ব্যবহার করে জিরো-বক্সিং

\`\`\`csharp
// জিরো-বক্সিং: JIT কম্পাইলার স্ট্রাক্টের জন্য বিশেষায়িত মেশিন কোড তৈরি করে
public static int CompareEntities<T>(T first, T second) where T : struct, IComparable<T>
{
    return first.CompareTo(second); // সরাসরি মেথড কল, কোনো বক্সিং নেই!
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #৩ — Problem A (Summation)
*একটি অ্যারির $N$ টি সংখ্যার পরম যোগফল (Absolute Summation) জিরো-বক্সিং অ্যালগরিদমে নির্ণয় করতে হবে।*

#### সমাধান বিশ্লেষণ
- $10^5$ টি সংখ্যার যোগফল ৩২-বিট সীমা ছাড়িয়ে যেতে পারে, তাই ৬৪-বিট \`long\` ব্যবহার করা হয়েছে।
- স্ট্যাকে সংরক্ষিত প্রিমিটিভ ভ্যালু ব্যবহার করার ফলে হিপ মেমোরিতে কোনো অতিরিক্ত অবজেক্ট তৈরি হয় না।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class SummationSolution
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;
        int n = int.Parse(nLine.Trim());

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        long totalSum = 0;

        for (int i = 0; i < n; i++)
        {
            long value = long.Parse(tokens[i], CultureInfo.InvariantCulture);
            totalSum += value; // সরাসরি রেজিস্টার যোগফল, জিরো বক্সিং
        }

        long absoluteSum = Math.Abs(totalSum);
        Console.WriteLine(absoluteSum);
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$ — একবার অ্যারে ট্রাভার্সাল।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত স্পেস — কোনো বক্সিং ছাড়া স্ট্যাকেই সকল গণনা সম্পন্ন।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem A: Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/A) | Easy | Value Types, Stack Accumulator, Zero-Boxing |
| ⚪ | Codeforces Assiut | [Problem Q: Digits](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/Q) | Easy | Modulo Arithmetic, Value Parsing |
| ⚪ | Exercism C# | [Log Analysis](https://exercism.org/tracks/csharp/exercises/log-analysis) | Easy | String Extensions, Avoiding Boxed Objects |
| ⚪ | Exercism C# | [Difference of Squares](https://exercism.org/tracks/csharp/exercises/difference-of-squares) | Easy | Pure Value Type Math, Overflow Safety |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #3",
      name: "Problem A: Summation",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/A",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Boxing", "Zero-Boxing", "Math"],
      solutionEn: "Accumulate array values using 64-bit long directly on the stack to achieve zero-boxing summation.",
      solutionBn: "স্ট্যাকে সরাসরি ৬৪-বিট long ভ্যালু যোগ করে জিরো-বক্সিং পদ্ধতিতে যোগফল নির্ণয় করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #3",
      name: "Problem Q: Digits",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/Q",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Value Types", "Modulo", "Parsing"],
      solutionEn: "Extract and print digits from right to left using value type arithmetic operations.",
      solutionBn: "ভ্যালু টাইপ গাণিতিক অপারেশন চালিয়ে ডান থেকে বামে সংখ্যার ডিজিটগুলো আলাদা করে প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Log Analysis",
      url: "https://exercism.org/tracks/csharp/exercises/log-analysis",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Boxing", "Strings", "Extensions"],
      solutionEn: "Create string extension methods that parse log levels without wrapping primitives in object containers.",
      solutionBn: "প্রিমিটিভ টাইপ অবজেক্টে না জড়িয়ে স্ট্রিং এক্সটেনশন দিয়ে দক্ষভাবে লগ লেভেল পার্স করুন।",
    },
    {
      source: "Exercism C#",
      name: "Difference of Squares",
      url: "https://exercism.org/tracks/csharp/exercises/difference-of-squares",
      difficulty: "EASY",
      company: "Kaz Software",
      tags: ["Value Types", "Math", "Optimization"],
      solutionEn: "Calculate difference between square of sums and sum of squares using stack-only numeric evaluation.",
      solutionBn: "স্ট্যাক-অনলি গাণিতিক সূত্রের সাহায্যে বর্গ ও যোগফলের ব্যবধান নির্ণয় করুন।",
    },
  ],
};
