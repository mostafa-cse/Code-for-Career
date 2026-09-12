import type { LocalLesson } from "@/lib/lessons-data";

export const typesUnboxingLesson: LocalLesson = {
  slug: "types-unboxing",
  titleEn: "Unboxing",
  titleBn: "আনবক্সিং (Unboxing) ও InvalidCastException",
  categoryEn: "05. Type System",
  categoryBn: "০৫. টাইপ সিস্টেম ও মেমোরি মডেল",
  categoryDescEn:
    "The Common Type System (CTS) in .NET: value types vs reference types, boxing/unboxing overhead, var vs dynamic vs object.",
  categoryDescBn:
    ".NET এর কমন টাইপ সিস্টেম (CTS): ভ্যালু টাইপ বনাম রেফারেন্স টাইপ, বক্সিং/আনবক্সিং মেমোরি ওভারহেড এবং var/dynamic/object।",
  categoryPriority: "CORE",
  descriptionEn:
    "Extracting value types from boxed heap objects, exact type matching rule, InvalidCastException, Nullable unboxing, and IL unbox instructions.",
  descriptionBn:
    "বক্সড হিপ অবজেক্ট থেকে মান উদ্ধার, নিখুঁত টাইপ মেলানোর শর্ত, InvalidCastException, Nullable আনবক্সিং এবং IL unbox নির্দেশিকা।",
  difficulty: "MEDIUM",
  displayOrder: 7,
  prerequisites: ["types-boxing", "types-value-types"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Unboxing in C#

**Unboxing** is the explicit conversion of an \`object\` (or interface) reference back into its underlying value type.

While boxing is implicit and harmless at compile time, unboxing is **explicit, strictly type-checked at runtime**, and capable of throwing severe runtime exceptions if type compatibility rules are violated.

---

## The Two-Step Internal Mechanics of Unboxing

When the CLR executes the IL \`unbox\` or \`unbox.any\` instruction, it performs two distinct steps:

\`\`\`
1. Object on Heap: [ SyncBlock (8B) | MethodTable (8B) | Payload: 42 (4B) ]
                                          │
   Step 1: Check MethodTable == typeof(int)
   ├── Match: Proceed to Step 2
   └── Mismatch / null: THROW InvalidCastException or NullReferenceException
                                          │
                                          ▼
   Step 2: Copy payload bits (42) back onto the Execution Stack
\`\`\`

1. **Type Verification**: The CLR inspects the heap object's \`MethodTable\` pointer (TypeHandle) to confirm that the object is indeed a boxed instance of the **exact requested value type**.
   - If the reference is \`null\`, a \`NullReferenceException\` is thrown (unless unboxing to a nullable type \`T?\`).
   - If the type does not match the exact original type, a \`System.InvalidCastException\` is thrown.
2. **Bitwise Memory Copy**: The CLR calculates the byte offset past the 16-byte object header and copies the raw value bits from the heap payload back into a stack slot.

---

## The Exact-Type Trap: Why \`(long)(object)42\` Fails

This is one of the most famous technical interview traps (Enosis Solutions, Therap Services):

\`\`\`csharp
int original = 42;
object boxed = original; // Boxed as System.Int32

// ❌ THROWS System.InvalidCastException AT RUNTIME!
long badUnbox = (long)boxed; 
\`\`\`

### Why Does This Fail?
Normally, C# allows implicit widening from \`int\` to \`long\` (\`long x = 42;\`). However, during unboxing:
- The CLR's \`unbox\` instruction **only validates the exact TypeHandle**.
- It does **not** perform numeric coercion simultaneously with unboxing.
- Because the object on the heap has a MethodTable pointer for \`System.Int32\`, requesting \`System.Int64\` causes the CLR type check to fail immediately.

### The Correct Fix:
You must **unbox to the exact original type first**, and then widen:

\`\`\`csharp
long correct = (long)(int)boxed; // 1. Unbox to int (exact match), 2. Widen to long
Console.WriteLine(correct); // 42
\`\`\`

---

## Unboxing to Nullable Value Types (\`T?\`)

In .NET, a boxed \`Nullable<T>\` that has no value (\`HasValue == false\`) is represented simply as a **\`null\` reference**.

Unboxing a \`null\` reference behaves gracefully when targeting \`Nullable<T>\`:

\`\`\`csharp
object? emptyBox = null;

// Unboxing null to non-nullable throws NullReferenceException:
// int willThrow = (int)emptyBox; // ❌ NullReferenceException!

// Unboxing null to Nullable<T> succeeds safely:
int? safeNullable = (int?)emptyBox; // ✅ safeNullable is null, no exception!
Console.WriteLine(safeNullable.HasValue); // False
\`\`\`

---

## Modern Safe Unboxing: Pattern Matching

Avoid raw explicit casts in production by using C# pattern matching with the \`is\` operator or \`switch\` expressions. These verify the type and unbox the value in a single safe, compiler-optimized step:

\`\`\`csharp
public static void ProcessMetric(object rawPayload)
{
    // Type check + safe unbox in one step:
    if (rawPayload is int intScore)
    {
        Console.WriteLine($"Unboxed int: {intScore * 10}");
    }
    else if (rawPayload is double doubleScore)
    {
        Console.WriteLine($"Unboxed double: {doubleScore:F2}");
    }
    else
    {
        Console.WriteLine("Unsupported payload type");
    }
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 — Problem C (Simple Calculator)
*Given two numbers $X$ and $Y$. Print their addition, multiplication, and subtraction using 64-bit precision to prevent overflow.*

#### Problem Analysis
- Input: Two integers $X$ and $Y$ ($1 \\le X, Y \\le 10^5$).
- Outputs:
  - \`X + Y = summation\`
  - \`X * Y = multiplication\` (Can reach $10^{10}$, requiring 64-bit \`long\`)
  - \`X - Y = subtraction\`
- Safe unboxed numeric evaluations prevent precision loss and casting errors.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class SimpleCalculatorSolution
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input)) return;

        string[] tokens = input.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Parse into 64-bit values to prevent 32-bit multiplication overflow
        long x = long.Parse(tokens[0], CultureInfo.InvariantCulture);
        long y = long.Parse(tokens[1], CultureInfo.InvariantCulture);

        long sum = x + y;
        long mul = x * y;
        long sub = x - y;

        Console.WriteLine($"{x} + {y} = {sum}");
        Console.WriteLine($"{x} * {y} = {mul}");
        Console.WriteLine($"{x} - {y} = {sub}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$ — constant number of arithmetic operations.
- **Space Complexity**: $\\mathcal{O}(1)$ — pure stack allocation of 64-bit integers.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem C: Simple Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C) | Easy | 64-bit Arithmetic, Formatting, Overflow Safety |
| ⚪ | Codeforces Assiut | [Problem P: First Digit !](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/P) | Easy | Value Types, Digit Extraction, Parity |
| ⚪ | Exercism C# | [Triangle](https://exercism.org/tracks/csharp/exercises/triangle) | Easy | Value Equality, Unboxing Guards |
| ⚪ | Exercism C# | [Armstrong Numbers](https://exercism.org/tracks/csharp/exercises/armstrong-numbers) | Easy | Number Decomposition, Overflow Safety |
`,

  contentBn: `# C# এ আনবক্সিং (Unboxing) ও InvalidCastException

**আনবক্সিং (Unboxing)** হলো একটি এক্সপ্লিসিট রূপান্তর যার মাধ্যমে পূর্বে বক্সড হওয়া কোনো \`object\` (বা ইন্টারফেস) রেফারেন্স থেকে তার মূল ভ্যালু টাইপটিকে বের করে আনা হয়।

বক্সিংয়ের ক্ষেত্রে কোনো এরর হওয়ার সম্ভাবনা থাকে না, কিন্তু আনবক্সিংয়ের ক্ষেত্রে **রানটাইমে হুবহু টাইপ যাচাই করা হয়**। যদি কাঙ্ক্ষিত টাইপের সাথে হিপে থাকা অবজেক্টের টাইপ হুবহু না মেলে, তবে সাথে সাথে মারাত্মক রানটাইম এক্সেপশন ঘটে।

---

## আনবক্সিংয়ের অভ্যন্তরীণ মেকানিজম ও ধাপসমূহ

যখন CLR আনবক্সিং সম্পন্ন করে (IL \`unbox\` বা \`unbox.any\` ইনস্ট্রাকশন চালায়):

\`\`\`
১. হিপ অবজেক্ট: [ SyncBlock (8B) | MethodTable (8B) | Payload: 42 (4B) ]
                                          │
   ধাপ ১: MethodTable == typeof(int) কি না পরীক্ষা
   ├── মিললে: ধাপ ২ এ অগ্রসর হবে
   └── অমিল বা null হলে: THROW InvalidCastException / NullReferenceException
                                          │
                                          ▼
   ধাপ ২: পে-লোডের বিটগুলো (42) পুনরায় থ্রেড স্ট্যাকে কপি করা হয়
\`\`\`

১. **টাইপ যাচাইকরণ**: CLR হিপ অবজেক্টের \`MethodTable\` পয়েন্টার যাচাই করে নিশ্চিত করে যে অবজেক্টটি প্রকৃতপক্ষে **হুবহু কাঙ্ক্ষিত ভ্যালু টাইপ** কি না।
   - যদি রেফারেন্সটি \`null\` হয়, তবে \`NullReferenceException\` ঘটবে (যদি না Nullable \`T?\` এ আনবক্স করা হয়)।
   - যদি অবজেক্টের টাইপের সাথে একটুও অমিল থাকে, তবে \`System.InvalidCastException\` ঘটে।
২. **বিটওয়াইজ মেমোরি অনুলিপি**: ১৬-বাইটের অবজেক্ট হেডার বাদ দিয়ে পে-লোড এরিয়া থেকে মূল মানটির বিট সরাসরি স্ট্যাক মেমরিতে কপি করা হয়।

---

## নিখুঁত টাইপের ফাঁদ: কেন \`(long)(object)42\` ব্যর্থ হয়?

সফটওয়্যার ইঞ্জিনিয়ারিং ইন্টারভিউতে (যেমন Enosis, Therap) এটি অন্যতম জনপ্রিয় একটি প্রশ্ন:

\`\`\`csharp
int original = 42;
object boxed = original; // System.Int32 হিসেবে হিপে বক্সড হলো

// ❌ রানটাইমে System.InvalidCastException ঘটবে!
long badUnbox = (long)boxed; 
\`\`\`

### কেন এই এররটি ঘটে?
সাধারণ ক্ষেত্রে সি# এ \`int\` থেকে \`long\` এ রূপান্তর বৈধ (\`long x = 42;\`)। কিন্তু আনবক্সিংয়ের ক্ষেত্রে:
- CLR-এর \`unbox\` ইনস্ট্রাকশন শুধুমাত্র অবজেক্টের নিজস্ব TypeHandle মেলাতে পারে।
- এটি আনবক্সিংয়ের সাথে সাথে স্বয়ংক্রিয়ভাবে টাইপ রূপান্তর (Numeric Widening) করতে পারে না।
- হিপ অবজেক্টের টাইপ হলো \`System.Int32\`, কিন্তু কোডে চাওয়া হয়েছে \`System.Int64\` — ফলে টাইপ অমিলের কারণে রানটাইমে ক্র্যাশ করে।

### সঠিক সমাধান:
প্রথমে অবজেক্টটিকে তার **আসল টাইপে আনবক্স** করতে হবে, তারপর সেটিকে ওয়াইডেন করতে হবে:

\`\`\`csharp
long correct = (long)(int)boxed; // ১. int এ আনবক্স (সফল), ২. long এ রূপান্তর
Console.WriteLine(correct); // 42
\`\`\`

---

## Nullable ভ্যালু টাইপে (\`T?\`) আনবক্সিং

.NET-এ যখন কোনো \`Nullable<T>\` অবজেক্টের কোনো মান থাকে না (\`HasValue == false\`), তখন সেটিকে বক্স করলে সাধারণ **\`null\` রেফারেন্স** তৈরি হয়।

\`null\` রেফারেন্সকে \`Nullable<T>\`-তে আনবক্স করলে কোনো এক্সেপশন ঘটে না:

\`\`\`csharp
object? emptyBox = null;

// সাধারণ int এ আনবক্স করলে ক্র্যাশ করবে:
// int willThrow = (int)emptyBox; // ❌ NullReferenceException!

// Nullable<int> এ আনবক্স সম্পূর্ণ নিরাপদ:
int? safeNullable = (int?)emptyBox; // ✅ সফল! safeNullable এর মান null
Console.WriteLine(safeNullable.HasValue); // False
\`\`\`

---

## আধুনিক নিরাপদ আনবক্সিং: প্যাটার্ন ম্যাচিং

প্রোডাকশন কোডে সরাসরি এক্সপ্লিসিট কাস্টিং পরিহার করে সি# এর \`is\` প্যাটার্ন ম্যাচিং ব্যবহার করা সবচেয়ে নিরাপদ:

\`\`\`csharp
public static void ProcessMetric(object rawPayload)
{
    // টাইপ যাচাই ও নিরাপদ আনবক্সিং একসাথে সম্পন্ন হয়:
    if (rawPayload is int intScore)
    {
        Console.WriteLine($"Unboxed int: {intScore * 10}");
    }
    else if (rawPayload is double doubleScore)
    {
        Console.WriteLine($"Unboxed double: {doubleScore:F2}");
    }
    else
    {
        Console.WriteLine("Unsupported payload type");
    }
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #১ — Problem C (Simple Calculator)
*দুটি সংখ্যা $X$ ও $Y$ দেওয়া থাকবে। তাদের যোগফল, গুণফল ও বিয়োগফল প্রিন্ট করতে হবে।*

#### সমাধান বিশ্লেষণ
- $10^5$ সাইজের দুটি পূর্ণসংখ্যার গুণফল $10^{10}$ পর্যন্ত হতে পারে, যা ৩২-বিট পূর্ণসংখ্যার সীমা ছাড়িয়ে যায়।
- তাই ৬৪-বিট \`long\` টাইপ ব্যবহার করে নির্ভুল গাণিতিক গণনা সম্পন্ন করা হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class SimpleCalculatorSolution
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input)) return;

        string[] tokens = input.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        long x = long.Parse(tokens[0], CultureInfo.InvariantCulture);
        long y = long.Parse(tokens[1], CultureInfo.InvariantCulture);

        long sum = x + y;
        long mul = x * y;
        long sub = x - y;

        Console.WriteLine($"{x} + {y} = {sum}");
        Console.WriteLine($"{x} * {y} = {mul}");
        Console.WriteLine($"{x} - {y} = {sub}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ — নির্দিষ্ট গাণিতিক হিসাব।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ — স্ট্যাকে সংরক্ষিত ৬৪-বিট ভ্যালু।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem C: Simple Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C) | Easy | 64-bit Arithmetic, Formatting, Overflow Safety |
| ⚪ | Codeforces Assiut | [Problem P: First Digit !](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/P) | Easy | Value Types, Digit Extraction, Parity |
| ⚪ | Exercism C# | [Triangle](https://exercism.org/tracks/csharp/exercises/triangle) | Easy | Value Equality, Unboxing Guards |
| ⚪ | Exercism C# | [Armstrong Numbers](https://exercism.org/tracks/csharp/exercises/armstrong-numbers) | Easy | Number Decomposition, Overflow Safety |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #1",
      name: "Problem C: Simple Calculator",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Unboxing", "64-bit", "Math"],
      solutionEn: "Compute addition, 64-bit multiplication, and subtraction formatting results with exact arithmetic precision.",
      solutionBn: "৬৪-বিট প্রিসিশন নিশ্চিত করে যোগ, গুণ ও বিয়োগফল ফরম্যাট করে প্রিন্ট করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #1",
      name: "Problem P: First Digit !",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/P",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Value Types", "Math", "Parity"],
      solutionEn: "Extract the most significant digit of a 4-digit number and print whether it is EVEN or ODD.",
      solutionBn: "চার অঙ্কের সংখ্যার প্রথম অঙ্কটি বের করে তা জোড় নাকি বিজোড় তা যাচাই করে আউটপুট দিন।",
    },
    {
      source: "Exercism C#",
      name: "Triangle",
      url: "https://exercism.org/tracks/csharp/exercises/triangle",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Unboxing", "Validation", "Geometry"],
      solutionEn: "Validate triangle inequality theorem and classify equilateral, isosceles, or scalene side sets.",
      solutionBn: "ত্রিভুজের বাহুর মানগুলো যাচাই করে সমবাহু, সমদ্বিবাহু বা বিষমবাহু শ্রেণিবিভাগ করুন।",
    },
    {
      source: "Exercism C#",
      name: "Armstrong Numbers",
      url: "https://exercism.org/tracks/csharp/exercises/armstrong-numbers",
      difficulty: "EASY",
      company: "Kaz Software",
      tags: ["Value Types", "Math", "Number Theory"],
      solutionEn: "Decompose integer into digits, compute exponential power sum, and verify Armstrong number property.",
      solutionBn: "সংখ্যার অঙ্কগুলোকে পৃথক করে ঘাত যোগফল বের করার মাধ্যমে আর্মস্ট্রং সংখ্যা যাচাই করুন।",
    },
  ],
};
