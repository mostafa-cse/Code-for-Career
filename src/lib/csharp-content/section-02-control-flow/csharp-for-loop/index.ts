import type { LocalLesson } from "@/lib/lessons-data";

export const csharpForLoopLesson: LocalLesson = {
    slug: "csharp-for-loop",
    titleEn: "for Loop",
    titleBn: "ফর (for) লুপ ও পুনরাবৃত্তি",
    categoryEn: "02. Control Flow",
    categoryBn: "০২. কন্ট্রোল ফ্লো ও শর্তাধীন লজিক",
    categoryDescEn:
      "Decision-making statements, pattern matching switches, iteration loops, and performance implications of loop constructs.",
    categoryDescBn:
      "শর্তাধীন সিদ্ধান্ত গ্রহণ, সুইচ স্টেটমেন্ট, বিভিন্ন ধরনের লুপ এবং পুনরাবৃত্তিমূলক লজিক।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Definite counter-controlled loops, bounds check elimination, loop unrolling, cache locality, and nested iteration.",
    descriptionBn:
      "কাউন্টার নিয়ন্ত্রিত ফর লুপ, বাউন্ডস চেক এলিমিনেশন, লুপ আনরোলিং, ক্যাশ লোকালিটি এবং নেস্টেড আইটারেশন।",
    difficulty: "EASY",
    displayOrder: 3,
    prerequisites: ["csharp-if-else"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# for Loop in C#

The \`for\` statement executes a statement or block of statements repeatedly while a specified condition evaluates to \`true\`. It is the primary construct for **definite iteration**, where the number of repetitions or boundaries is known before entering the loop.

---

## 1. Anatomy & Lifecycle of a for Loop

The header of a \`for\` loop contains three optional clauses separated by semicolons:
\`for (initializer; condition; iterator)\`

\`\`\`csharp
for (int i = 0; i < 5; i++)
{
    Console.WriteLine($"Index: {i}");
}
\`\`\`

### Step-by-Step Execution Lifecycle:
1. **Initializer (\`int i = 0\`)**: Executes **exactly once** before entering the loop. Scoped locally to the loop header and body.
2. **Condition (\`i < 5\`)**: Evaluated **before every iteration**. If \`true\`, the body executes. If \`false\`, the loop terminates immediately.
3. **Loop Body**: Executes statements inside the block.
4. **Iterator (\`i++\`)**: Executes **after the body finishes**. It updates the state, and execution jumps back to Step 2.

---

## 2. Advanced Variations & Multi-Variable Loops

### A. Multiple Loop Counters (Two-Pointer Iteration)
You can declare multiple variables of the **same type** in the initializer and update them concurrently in the iterator:

\`\`\`csharp
// Reversing an array in-place using two pointers
int[] array = { 1, 2, 3, 4, 5 };

for (int left = 0, right = array.Length - 1; left < right; left++, right--)
{
    int temp = array[left];
    array[left] = array[right];
    array[right] = temp;
}
\`\`\`

### B. Geometric & Non-Unit Step Increments
\`\`\`csharp
// Exponential progression (Powers of 2)
for (int val = 1; val <= 1024; val *= 2)
{
    Console.Write($"{val} "); // 1 2 4 8 16 32 64 128 256 512 1024
}
Console.WriteLine();
\`\`\`

### C. The Canonical Infinite Loop
Omitting all three clauses creates an intentional infinite loop:
\`\`\`csharp
for (;;)
{
    string? command = Console.ReadLine();
    if (command == "exit") break;
    ProcessCommand(command);
}
\`\`\`

---

## 3. Compiler & JIT Optimizations

### Bounds Check Elimination (BCE)
Normally, when accessing an array \`arr[i]\`, the runtime checks if \`0 <= i < arr.Length\`, throwing an \`IndexOutOfRangeException\` if invalid.

However, when you write the idiomatic C# pattern:
\`\`\`csharp
for (int i = 0; i < array.Length; i++)
{
    sum += array[i]; // JIT eliminates runtime bounds check!
}
\`\`\`
The .NET JIT compiler recognizes that \`i\` is strictly bounded by \`array.Length\`. It **eliminates the bounds check entirely**, emitting raw pointer arithmetic instructions that match C/C++ speed.

> **Performance Rule**: Do not cache \`int len = array.Length\` outside the loop! In modern .NET, keeping \`i < array.Length\` directly in the loop condition enables the JIT to prove loop bounds and remove safety checks.

### Cache Locality & Row-Major Access in 2D Arrays
Process multi-dimensional structures in memory order to maximize CPU L1/L2 cache hits:

\`\`\`csharp
int rows = 1000, cols = 1000;
int[,] matrix = new int[rows, cols];

// FAST: Row-major order (continuous memory stride)
for (int r = 0; r < rows; r++)
{
    for (int c = 0; c < cols; c++)
    {
        matrix[r, c] = r + c;
    }
}

// SLOW (Cache Thrashing): Column-major order jumps memory addresses
for (int c = 0; c < cols; c++)
{
    for (int r = 0; r < rows; r++)
    {
        matrix[r, c] = r + c;
    }
}
\`\`\`

---

## 4. Control Flow: \`break\`, \`continue\`, and Labeled \`goto\`

- **\`break\`**: Immediately terminates the innermost enclosing loop.
- **\`continue\`**: Skips the remainder of the current body and jumps directly to the **iterator step** (e.g. \`i++\`), then tests the condition.
- **Breaking out of Nested Loops with \`goto\`**: Avoid messy auxiliary boolean flags when escaping deeply nested algorithms:

\`\`\`csharp
bool itemFound = false;

for (int i = 0; i < 100; i++)
{
    for (int j = 0; j < 100; j++)
    {
        if (matrix[i, j] == targetValue)
        {
            Console.WriteLine($"Found at [{i}, {j}]");
            goto FoundLabel; // Clean exit from multi-level loop
        }
    }
}

FoundLabel:
Console.WriteLine("Search complete.");
\`\`\`

---

## 5. Critical Traps & Edge Cases

1. **The Unsigned Underflow Infinite Loop**:
   \`\`\`csharp
   // BUG: uint can NEVER be negative!
   for (uint i = 10; i >= 0; i--)
   {
       // When i reaches 0, i-- wraps to 4294967295 (uint.MaxValue) -> Infinite loop!
   }
   \`\`\`
   *Fix*: Always use signed integers (\`int\`) for countdown counters.

2. **Floating-Point Counters (Accumulator Drift)**:
   \`\`\`csharp
   // BUG: 0.1 cannot be represented exactly in IEEE 754 float/double
   for (double x = 0.0; x <= 1.0; x += 0.1)
   {
       // May execute 10 or 11 times depending on floating point drift
   }
   \`\`\`
   *Fix*: Use an integer step counter:
   \`\`\`csharp
   for (int step = 0; step <= 10; step++)
   {
       double x = step / 10.0;
   }
   \`\`\`

3. **Counter Mutation Inside Loop Body**:
   Avoid modifying \`i\` inside the body (e.g., \`i += 2;\`). If your iteration logic requires irregular skipping, use a \`while\` loop instead.

---

## 6. Comprehensive Loop Comparison

| Feature | \`for\` Loop | \`while\` Loop | \`do-while\` Loop | \`foreach\` Loop |
|---|---|---|---|---|
| **Best Use** | Known counter range | State-dependent / Indefinite | Must run at least once | Collections / Sequences |
| **Condition Evaluation** | Pre-test (before body) | Pre-test (before body) | Post-test (after body) | Pre-test (\`MoveNext\`) |
| **Index Access** | Direct (\`i\`) | Manual tracking | Manual tracking | No direct index |
| **Bounds Elimination** | Yes (Optimized) | No automatic BCE | No automatic BCE | Yes (for arrays/spans) |
| **Element Modification** | Yes (\`arr[i] = x\`) | Yes (\`arr[i] = x\`) | Yes (\`arr[i] = x\`) | No (iteration var readonly) |

---

## Practical Problem Walkthrough

### Problem: Even, Odd, Positive and Negative
*Source: Codeforces Assiut University Training Sheet #2 — Problem C*

**Problem Statement**:
Given $N$ numbers. Count how many numbers are Even, Odd, Positive, and Negative. (Note: $0$ is neither positive nor negative, but is even).

**Constraints**:
$1 \\le N \\le 1000$, each number is between $-10^5$ and $10^5$.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

        int evenCount = 0;
        int oddCount = 0;
        int positiveCount = 0;
        int negativeCount = 0;

        for (int i = 0; i < n; i++)
        {
            int val = int.Parse(tokens[i]);

            // Check Even vs Odd
            if (val % 2 == 0)
            {
                evenCount++;
            }
            else
            {
                oddCount++;
            }

            // Check Positive vs Negative (0 is neither)
            if (val > 0)
            {
                positiveCount++;
            }
            else if (val < 0)
            {
                negativeCount++;
            }
        }

        Console.WriteLine($"Even: {evenCount}");
        Console.WriteLine($"Odd: {oddCount}");
        Console.WriteLine($"Positive: {positiveCount}");
        Console.WriteLine($"Negative: {negativeCount}");
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N)$ — single linear pass through $N$ numbers.
- **Space Complexity**: $O(N)$ — tokens array for input parsing.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem A: 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/A) | Easy | Basic for loop |
| ⚪ | Codeforces Assiut | [Problem B: Even Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B) | Easy | Loop step increment, Edge cases |
| ⚪ | Codeforces Assiut | [Problem C: Even, Odd, Positive and Negative](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/C) | Easy | Accumulators, Multi-condition checks |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | Decrementing loop, Character arrays |
`,

    contentBn: `# C# এ ফর (for) লুপ ও পুনরাবৃত্তিমূলক কাঠামো

\`for\` স্টেটমেন্ট একটি নির্দিষ্ট শর্ত সত্য থাকা পর্যন্ত কোডের একটি অংশ বা ব্লককে বারবার এক্সিকিউট করে। এটি মূলত **কাউন্টার-নিয়ন্ত্রিত পুনরাবৃত্তি (Definite Iteration)** এর জন্য ব্যবহৃত হয়, যেখানে লুপে প্রবেশের পূর্বেই পুনরাবৃত্তির সীমা নির্ধারিত থাকে।

---

## ১. ফর লুপের গঠন ও পর্যায়ক্রমিক ধাপ

একটি ফর লুপের হেডারে সেমিকোলন দ্বারা পৃথক তিনটি অংশ থাকে:
\`for (initializer; condition; iterator)\`

\`\`\`csharp
for (int i = 0; i < 5; i++)
{
    Console.WriteLine($"Index: {i}");
}
\`\`\`

### এক্সিকিউশনের পর্যায়ক্রমিক ধাপ:
১. **ইনিশিয়ালাইজার (\`int i = 0\`)**: লুপ শুরুর পূর্বে **ঠিক একবার** এক্সিকিউট হয়। এই চলকটি কেবল লুপ ব্লকের ভেতরেই কার্যকর।
২. **শর্ত বা কন্ডিশন (\`i < 5\`)**: **প্রতিটি পুনরাবৃত্তির পূর্বে** মূল্যায়িত হয়। শর্ত \`true\` হলে বডি এক্সিকিউট হয়, \`false\` হলে লুপ তৎক্ষণাৎ বন্ধ হয়ে যায়।
৩. **লুপ বডি**: ব্লকের ভেতরের স্টেটমেন্টগুলো কার্যকর করে।
৪. **আইট্যারেটর (\`i++\`)**: বডির কাজ শেষ হওয়ার পর কার্যকর হয় এবং কাউন্টারের মান আপডেট করে পুনরায় ধাপ ২-এ চলে যায়।

---

## ২. অ্যাডভান্সড রূপ ও একাধিক চলকের সমন্বয়

### ক. একাধিক চলকযুক্ত লুপ (টু-পয়েন্টার কৌশল)
একই টাইপের একাধিক চলক ইনিশিয়ালাইজারে ঘোষণা করে আইট্যারেটরে একসাথে আপডেট করা সম্ভব:

\`\`\`csharp
// টু-পয়েন্টার অ্যালগরিদম দিয়ে অ্যারে রিভার্স করা
int[] array = { 1, 2, 3, 4, 5 };

for (int left = 0, right = array.Length - 1; left < right; left++, right--)
{
    int temp = array[left];
    array[left] = array[right];
    array[right] = temp;
}
\`\`\`

### খ. গুণোত্তর বৃদ্ধি বা কাস্টম স্টেপ
\`\`\`csharp
// ২ এর গুণোত্তর ধারা (Powers of 2)
for (int val = 1; val <= 1024; val *= 2)
{
    Console.Write($"{val} "); // 1 2 4 8 16 32 64 128 256 512 1024
}
Console.WriteLine();
\`\`\`

### গ. স্ট্যান্ডার্ড ইনফিনিট লুপ
হেডারের তিনটি অংশই ফাঁকা রাখলে তা অসীম লুপে রূপ নেয়:
\`\`\`csharp
for (;;)
{
    string? command = Console.ReadLine();
    if (command == "exit") break;
    ProcessCommand(command);
}
\`\`\`

---

## ৩. কম্পাইলার ও JIT অপ্টিমাইজেশন

### বাউন্ডস চেক এলিমিনেশন (Bounds Check Elimination - BCE)
সাধারণত রানটাইমে অ্যারের উপাদান অ্যাক্সেস করার সময় (\`arr[i]\`) ইনডেক্স সীমার বাইরে কি না তা পরীক্ষা করা হয়।

কিন্তু সি# এর স্ট্যান্ডার্ড প্যাটার্ন অনুসরণ করলে:
\`\`\`csharp
for (int i = 0; i < array.Length; i++)
{
    sum += array[i]; // JIT রানটাইম বাউন্ডস চেক বাদ দেয়!
}
\`\`\`
.NET এর JIT কম্পাইলার প্রমাণ করতে পারে যে \`i\` সর্বদা \`0\` থেকে \`array.Length - 1\` এর মধ্যে থাকবে। তাই এটি রানটাইম বাউন্ডস চেক সম্পূর্ণ বাদ দিয়ে সরাসরি মেমোরি পয়েন্টার দিয়ে কোড চালায়, যা C/C++ এর সমান গতি নিশ্চিত করে।

### ক্যাশ লোকালিটি ও ২ডি অ্যারে এক্সেস
সিপিইউ-এর L1/L2 ক্যাশ মেমোরির পূর্ণ সুবিধা পেতে ২ডি অ্যারে সারি অনুযায়ী (Row-major) এক্সেস করা উচিত:

\`\`\`csharp
int rows = 1000, cols = 1000;
int[,] matrix = new int[rows, cols];

// দ্রুততম: Row-major (মেমোরিতে পর পর থাকা উপাদান এক্সেস করে)
for (int r = 0; r < rows; r++)
{
    for (int c = 0; c < cols; c++)
    {
        matrix[r, c] = r + c;
    }
}
\`\`\`

---

## ৪. কন্ট্রোল ফ্লো: \`break\`, \`continue\` এবং লেবেলযুক্ত \`goto\`

- **\`break\`**: বর্তমান লুপ থেকে অবিলম্বে বের হয়ে যায়।
- **\`continue\`**: বডির বাকি অংশ এড়িয়ে সরাসরি **আইট্যারেটরে** (\`i++\`) চলে যায় এবং পরবর্তী শর্ত পরীক্ষা করে।
- **নেস্টেড লুপ থেকে \`goto\` দিয়ে প্রস্থান**: একাধিক স্তরের জটিল নেস্টেড লুপ থেকে ফ্ল্যাগ ভ্যারিয়েবল ছাড়া এক ঝটকায় বের হতে \`goto\` একটি ক্লিন উপায়:

\`\`\`csharp
for (int i = 0; i < 100; i++)
{
    for (int j = 0; j < 100; j++)
    {
        if (matrix[i, j] == targetValue)
        {
            Console.WriteLine($"Found at [{i}, {j}]");
            goto FoundLabel;
        }
    }
}

FoundLabel:
Console.WriteLine("Search complete.");
\`\`\`

---

## ৫. সাধারণ ভুল ও সতর্কতা

১. **আনসাইন্ড পূর্ণসংখ্যার আন্ডারফ্লো ও ইনফিনিট লুপ**:
   \`\`\`csharp
   // মারাত্মক ভুল: uint কখনোই ঋণাত্মক হতে পারে না!
   for (uint i = 10; i >= 0; i--)
   {
       // i শূন্যে পৌঁছানোর পর i-- করলে তা 4294967295 এ রূপ নিবে -> অসীম লুপ!
   }
   \`\`\`
   *সঠিক নিয়ম*: ডাউনওয়ার্ড কাউন্টারে সর্বদা সাইনড পূর্ণসংখ্যা (\`int\`) ব্যবহার করুন।

২. **ফ্লোটিং পয়েন্ট কাউন্টার পরিহার**:
   \`0.1\` এর মতো সংখ্যা বাইনারি ফ্লোটে সুনির্দিষ্টভাবে সংরক্ষণ করা যায় না বিধায় ফ্লোটিং কাউন্টারে রাউন্ডিং ত্রুটি ঘটে। সর্বদা পূর্ণসংখ্যা কাউন্টার ব্যবহার করুন।

---

## ৬. লুপসমূহের তুলনামূলক সারণী

| বৈশিষ্ট্য | \`for\` লুপ | \`while\` লুপ | \`do-while\` লুপ | \`foreach\` লুপ |
|---|---|---|---|---|
| **আদর্শ ক্ষেত্র** | পুনরাবৃত্তির সীমা জানা থাকলে | শর্ত সাপেক্ষে অনির্দিষ্ট সময়ে | কমপক্ষে একবার চালানো আবশ্যক হলে | কালেকশন ও সিকোয়েন্স পাঠে |
| **শর্ত যাচাই** | পূর্বে (Pre-test) | পূর্বে (Pre-test) | শেষে (Post-test) | পূর্বে (\`MoveNext\`) |
| **ইনডেক্স ব্যবহার** | সরাসরি (\`i\`) | ম্যানুয়াল ট্র্যাকিং | ম্যানুয়াল ট্র্যাকিং | সরাসরি ইনডেক্স থাকে না |
| **বাউন্ডস এলিমিনেশন** | হ্যাঁ (অপ্টিমাইজড) | স্বয়ংক্রিয় হয় না | স্বয়ংক্রিয় হয় না | হ্যাঁ (অ্যারে/স্প্যানে) |
| **মান পরিবর্তন** | সরাসরি পরিবর্তন সম্ভব | সরাসরি পরিবর্তন সম্ভব | সরাসরি পরিবর্তন সম্ভব | পরিবর্তন নিষিদ্ধ (Readonly) |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: জোড়, বিজোড়, ধনাত্মক ও ঋণাত্মক গণনা
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #২ — Problem C*

**সমস্যা পরিচিতি**:
$N$ টি পূর্ণসংখ্যা দেওয়া থাকবে। কয়টি সংখ্যা জোড় (Even), বিজোড় (Odd), ধনাত্মক (Positive) এবং ঋণাত্মক (Negative) তা গণনা করে প্রিন্ট করুন। (মনে রাখবেন: $0$ ধনাত্মক বা ঋণাত্মক কোনোটিই নয়, তবে এটি জোড় সংখ্যা)।

**সীমাবদ্ধতা**:
$1 \\le N \\le 1000$, প্রতিটি সংখ্যা $-10^5$ থেকে $10^5$ এর মধ্যে।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

        int evenCount = 0;
        int oddCount = 0;
        int positiveCount = 0;
        int negativeCount = 0;

        for (int i = 0; i < n; i++)
        {
            int val = int.Parse(tokens[i]);

            // জোড় বনাম বিজোড় যাচাই
            if (val % 2 == 0)
            {
                evenCount++;
            }
            else
            {
                oddCount++;
            }

            // ধনাত্মক বনাম ঋণাত্মক যাচাই (০ কোনোটিই নয়)
            if (val > 0)
            {
                positiveCount++;
            }
            else if (val < 0)
            {
                negativeCount++;
            }
        }

        Console.WriteLine($"Even: {evenCount}");
        Console.WriteLine($"Odd: {oddCount}");
        Console.WriteLine($"Positive: {positiveCount}");
        Console.WriteLine($"Negative: {negativeCount}");
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N)$ — $N$ টি সংখ্যার ওপর একক লুপ ট্রাভার্সাল।
- **স্পেস কমপ্লেক্সিটি**: $O(N)$ — ইনপুট স্ট্রিং টোকেনের জন্য মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem A: 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/A) | Easy | Basic for loop |
| ⚪ | Codeforces Assiut | [Problem B: Even Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B) | Easy | Loop step increment, Edge cases |
| ⚪ | Codeforces Assiut | [Problem C: Even, Odd, Positive and Negative](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/C) | Easy | Accumulators, Multi-condition checks |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | Decrementing loop, Character arrays |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem A: 1 to N",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/A",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["for", "Loops", "Basics"],
        solutionEn: "Iterate from 1 up to N with a single for loop and print each number on a new line.",
        solutionBn: "১ থেকে N পর্যন্ত ফর লুপ চালিয়ে প্রতিটি সংখ্যা নতুন লাইনে প্রিন্ট করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem B: Even Numbers",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["for", "Loops", "Step Increment"],
        solutionEn: "Check if N < 2 to print -1, otherwise loop with step i += 2 starting at 2.",
        solutionBn: "N < 2 হলে -1 প্রিন্ট করুন, অন্যথায় ২ থেকে শুরু করে i += 2 স্টেপে জোড় সংখ্যা প্রিন্ট করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem C: Even, Odd, Positive and Negative",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/C",
        difficulty: "EASY",
        company: "Therap",
        tags: ["for", "Loops", "Accumulators"],
        solutionEn: "Maintain four counter variables and classify each integer across one loop pass.",
        solutionBn: "চারটি কাউন্টার ভ্যারিয়েবল রেখে একটি লুপের মাধ্যমে প্রতিটি সংখ্যার প্রকারভেদ গণনা করুন।",
      },
      {
        source: "Exercism C#",
        name: "Reverse String",
        url: "https://exercism.org/tracks/csharp/exercises/reverse-string",
        difficulty: "EASY",
        company: null,
        tags: ["for", "Strings", "Arrays"],
        solutionEn: "Traverse characters in reverse order using a decrementing for loop or two-pointer swap.",
        solutionBn: "ডিক্রিমেন্টিং ফর লুপ বা টু-পয়েন্টার সোয়াপের মাধ্যমে স্ট্রিং বিপরীতমুখী করুন।",
      },
    ],
  };
