import type { LocalLesson } from "@/lib/lessons-data";

export const csharpWhileLoopLesson: LocalLesson = {
    slug: "csharp-while-loop",
    titleEn: "while Loop",
    titleBn: "হোয়াইল (while) লুপ ও অনির্দিষ্ট পুনরাবৃত্তি",
    categoryEn: "02. Control Flow",
    categoryBn: "০২. কন্ট্রোল ফ্লো ও শর্তাধীন লজিক",
    categoryDescEn:
      "Decision-making statements, pattern matching switches, iteration loops, and performance implications of loop constructs.",
    categoryDescBn:
      "শর্তাধীন সিদ্ধান্ত গ্রহণ, সুইচ স্টেটমেন্ট, বিভিন্ন ধরনের লুপ এবং পুনরাবৃত্তিমূলক লজিক।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Indefinite loops, pre-condition evaluation, digit extraction, Euclidean GCD, stream reading, and sentinel loops.",
    descriptionBn:
      "পূর্ব-শর্তাধীন হোয়াইল লুপ, অঙ্ক বিভাজন ও ডিজিট প্রসেসিং, ইউক্লিডীয় গসাগু, স্ট্রিম রিডিং এবং সেন্টিনেল লুপ।",
    difficulty: "EASY",
    displayOrder: 4,
    prerequisites: ["csharp-for-loop"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# while Loop in C#

The \`while\` statement repeatedly executes a statement or a block of code as long as a specified boolean expression evaluates to \`true\`. Because the condition is tested **before** each iteration (pre-test), a \`while\` loop executes **zero or more times**.

---

## 1. Syntax & Pre-Test Mechanics

\`\`\`csharp
while (booleanCondition)
{
    // Executes repeatedly while booleanCondition is true
}
\`\`\`

If \`booleanCondition\` is \`false\` upon first evaluation, the loop body is bypassed entirely:

\`\`\`csharp
int counter = 10;

while (counter < 5)
{
    // Never executes because 10 < 5 is initially false
    Console.WriteLine("This will never print.");
}
\`\`\`

---

## 2. Essential Algorithmic Patterns with \`while\`

The \`while\` loop is the natural choice for **indefinite iteration** — when the exact number of iterations cannot be known upfront and depends on mathematical convergence, stream state, or algorithmic convergence.

### A. Number Decomposition (Digit Extraction)
Iteratively stripping the least significant digit with \`% 10\` and \`/ 10\` runs in $O(\\log_{10} N)$ steps:

\`\`\`csharp
long number = 98452;
long sumOfDigits = 0;

while (number > 0)
{
    long digit = number % 10; // Extracts rightmost digit
    sumOfDigits += digit;
    number /= 10;            // Discards rightmost digit
}

Console.WriteLine($"Digit Sum: {sumOfDigits}"); // 28
\`\`\`

### B. Euclidean Algorithm for Greatest Common Divisor (GCD)
\`\`\`csharp
long a = 48, b = 18;

while (b != 0)
{
    long remainder = a % b;
    a = b;
    b = remainder;
}

Console.WriteLine($"GCD: {a}"); // 6
\`\`\`

### C. Reading Streams / Input Until EOF (End-of-File)
A standard competitive programming and production I/O pattern:

\`\`\`csharp
string? line;

// Assignment inside condition: reads until console or file reaches EOF
while ((line = Console.ReadLine()) != null)
{
    if (line.Trim().Length == 0) continue;
    Console.WriteLine($"Received: {line}");
}
\`\`\`

### D. Binary Search Loop
\`\`\`csharp
int[] sortedArray = { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
int target = 23;
int low = 0, high = sortedArray.Length - 1;
int foundIndex = -1;

while (low <= high)
{
    int mid = low + (high - low) / 2; // Prevents 32-bit overflow

    if (sortedArray[mid] == target)
    {
        foundIndex = mid;
        break;
    }
    else if (sortedArray[mid] < target)
    {
        low = mid + 1;
    }
    else
    {
        high = mid - 1;
    }
}

Console.WriteLine($"Index: {foundIndex}");
\`\`\`

---

## 3. Sentinel Values & Intentional Infinite Loops

### The \`while (true)\` State-Machine Pattern
When loop exit conditions are complex or multi-faceted, using \`while (true)\` with explicit internal \`break\` points clarifies intent:

\`\`\`csharp
int retryCount = 0;
const int MaxRetries = 5;

while (true)
{
    bool success = AttemptNetworkSync();
    if (success)
    {
        Console.WriteLine("Sync completed successfully.");
        break;
    }

    retryCount++;
    if (retryCount >= MaxRetries)
    {
        Console.WriteLine("Max retries exceeded. Aborting.");
        break;
    }

    Thread.Sleep(1000); // Wait before retrying
}
\`\`\`

---

## 4. Traps, Pitfalls & Edge Cases

1. **Forgetting State Mutation (100% CPU Hang)**:
   \`\`\`csharp
   int i = 0;
   while (i < 10)
   {
       Console.WriteLine(i);
       // BUG: Forgot 'i++;' -> Loop never terminates, consumes 100% of a CPU core!
   }
   \`\`\`

2. **Negative Numbers in Modulo Digit Extraction**:
   In C#, the remainder operator \`%\` preserves the sign of the dividend:
   \`-15 % 10\` yields \`-5\`, not \`5\`!
   \`\`\`csharp
   long n = -384;
   n = Math.Abs(n); // Always sanitize sign before digit extraction!
   while (n > 0)
   {
       long digit = n % 10;
       n /= 10;
   }
   \`\`\`

3. **Handling Zero as an Input**:
   If the input number is \`0\`, \`while (n > 0)\` will **never execute**. Always check for zero explicitly:
   \`\`\`csharp
   if (n == 0)
   {
       Console.WriteLine(0);
   }
   \`\`\`

4. **Pre-Increment vs Post-Increment inside Condition**:
   \`\`\`csharp
   int x = 0;
   while (x++ < 3) { } // Checks x < 3, THEN increments. Loop runs for x = 0, 1, 2. After exit, x = 4!
   \`\`\`
   Keep condition expressions simple to avoid confusing off-by-one errors.

---

## 5. Comparison: \`while\` vs \`for\` vs \`do-while\`

| Criteria | \`while\` Loop | \`for\` Loop | \`do-while\` Loop |
|---|---|---|---|
| **Condition Check** | Pre-test | Pre-test | **Post-test** |
| **Minimum Executions** | 0 | 0 | **1** |
| **Counter Variable** | Declared outside loop scope | Scoped to loop header | Declared outside loop scope |
| **Typical Problem Type** | Stream/EOF, Math convergence | Array index, Known range | Menus, Input validation |

---

## Practical Problem Walkthrough

### Problem: Digits
*Source: Codeforces Assiut University Training Sheet #2 — Problem Q*

**Problem Statement**:
Given a number $N$. Print the digits of that number from right to left separated by space. Process $T$ test cases.

**Constraints**:
$1 \\le T \\le 10$, $0 \\le N \\le 10^9$

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        int t = int.Parse(Console.ReadLine().Trim());

        while (t-- > 0)
        {
            long n = long.Parse(Console.ReadLine().Trim());

            // Edge case: when N is 0, the extraction loop wouldn't run
            if (n == 0)
            {
                Console.WriteLine("0");
                continue;
            }

            bool first = true;

            // Extract digits from right to left
            while (n > 0)
            {
                long digit = n % 10;
                if (!first)
                {
                    Console.Write(" ");
                }
                Console.Write(digit);
                first = false;

                n /= 10;
            }
            Console.WriteLine();
        }
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(T \\cdot \\log_{10} N)$ — for each test case, we perform divisions proportional to the number of decimal digits ($\le 10$ steps).
- **Space Complexity**: $O(1)$ — no memory allocations beyond primitive variables.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem Q: Digits](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/Q) | Easy | Digit extraction, Zero edge case |
| ⚪ | Codeforces Assiut | [Problem H: One Prime](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/H) | Easy | Trial division, while loop |
| ⚪ | Codeforces Assiut | [Problem G: Factorial](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/G) | Easy | Multiplication accumulator |
| ⚪ | Exercism C# | [Collatz Conjecture](https://exercism.org/tracks/csharp/exercises/collatz-conjecture) | Easy | While loop, Step counting |
`,

    contentBn: `# C# এ হোয়াইল (while) লুপ ও অনির্দিষ্ট পুনরাবৃত্তি

\`while\` স্টেটমেন্ট একটি নির্দিষ্ট বুলিয়ান শর্ত \`true\` থাকা পর্যন্ত কোডের একটি অংশ বা ব্লককে বারবার এক্সিকিউট করে। যেহেতু শর্তটি লুপ ব্লকে প্রবেশের **পূর্বেই** যাচাই করা হয় (Pre-test), তাই একটি \`while\` লুপ **শূন্য বা ততোধিক বার** চলতে পারে।

---

## ১. গঠন ও পূর্ব-শর্তাধীন (Pre-Test) যাচাইকরণ

\`\`\`csharp
while (booleanCondition)
{
    // booleanCondition সত্য থাকা পর্যন্ত বারবার চলবে
}
\`\`\`

যদি শুরুতে শর্তটি \`false\` হয়, তবে লুপ ব্লকের কোড একবারের জন্যও চলবে না:

\`\`\`csharp
int counter = 10;

while (counter < 5)
{
    // ১০ < ৫ মিথ্যা হওয়ায় এটি কখনই এক্সিকিউট হবে না
    Console.WriteLine("This will never print.");
}
\`\`\`

---

## ২. হোয়াইল লুপের মৌলিক অ্যালগরিদমিক প্যাটার্ন

লুপ শুরুর পূর্বে যখন পুনরাবৃত্তির সংখ্যা নিশ্চিতভাবে জানা থাকে না (যেমন: গাণিতিক রূপান্তর, স্ট্রিম পড়া বা কন্ডিশনভিত্তিক সার্চ), তখন \`while\` লুপ আদর্শ সমাধান।

### ক. সংখ্যা বিভাজন ও অঙ্ক পৃথকীকরণ (Digit Extraction)
ডানপাশ থেকে সংখ্যাটিকে ১০ দিয়ে মডুলাস \`% 10\` এবং ১০ দিয়ে ভাগ \`/ 10\` করার প্যাটার্নটি $O(\\log_{10} N)$ ধাপে কাজ করে:

\`\`\`csharp
long number = 98452;
long sumOfDigits = 0;

while (number > 0)
{
    long digit = number % 10; // সর্বডানের অঙ্ক বের করে
    sumOfDigits += digit;
    number /= 10;            // সর্বডানের অঙ্কটি বাদ দেয়
}

Console.WriteLine($"Digit Sum: {sumOfDigits}"); // 28
\`\`\`

### খ. ইউক্লিডীয় গসাগু (GCD) অ্যালগরিদম
\`\`\`csharp
long a = 48, b = 18;

while (b != 0)
{
    long remainder = a % b;
    a = b;
    b = remainder;
}

Console.WriteLine($"GCD: {a}"); // 6
\`\`\`

### গ. ফাইল বা কনসোল স্ট্রিম শেষ না হওয়া পর্যন্ত রিড করা (EOF Pattern)
\`\`\`csharp
string? line;

// ইনপুট থেকে প্রতি লাইন রিড করে এবং নাল পেলে লুপ থামায়
while ((line = Console.ReadLine()) != null)
{
    if (line.Trim().Length == 0) continue;
    Console.WriteLine($"Received: {line}");
}
\`\`\`

### ঘ. বাইনারি সার্চ অ্যালগরিদম
\`\`\`csharp
int[] sortedArray = { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
int target = 23;
int low = 0, high = sortedArray.Length - 1;
int foundIndex = -1;

while (low <= high)
{
    int mid = low + (high - low) / 2; // ওভারফ্লো প্রতিরোধ

    if (sortedArray[mid] == target)
    {
        foundIndex = mid;
        break;
    }
    else if (sortedArray[mid] < target)
    {
        low = mid + 1;
    }
    else
    {
        high = mid - 1;
    }
}

Console.WriteLine($"Index: {foundIndex}");
\`\`\`

---

## ৩. সেন্টিনেল ভ্যালু ও নিয়ন্ত্রিত অসীম লুপ

লুপের শর্ত যখন বহুমুখী হয়, তখন \`while (true)\` কাঠামোর ভেতর স্পষ্ট \`break\` পয়েন্ট রাখা পেশাদার কোডিং রীতি:

\`\`\`csharp
int retryCount = 0;
const int MaxRetries = 5;

while (true)
{
    bool success = AttemptNetworkSync();
    if (success)
    {
        Console.WriteLine("Sync completed successfully.");
        break;
    }

    retryCount++;
    if (retryCount >= MaxRetries)
    {
        Console.WriteLine("Max retries exceeded. Aborting.");
        break;
    }

    Thread.Sleep(1000); // পুনরায় চেষ্টার আগে অপেক্ষা
}
\`\`\`

---

## ৪. সাধারণ ভুল ও সতর্কতা

১. **চলকের মান আপডেট করতে ভুলে যাওয়া**:
   \`while\` লুপে কাউন্টার আপডেট (\`i++\`) না দিলে লুপটি কখনো শেষ হবে না এবং ১০০% সিপিইউ খরচ করবে।

২. **ঋণাত্মক সংখ্যার ক্ষেত্রে মডুলাস অপারেশন**:
   সি# এ \`-15 % 10\` এর ফলাফল আসে \`-5\`! তাই অঙ্ক বিভাজনের পূর্বে অবশ্যই \`Math.Abs()\` দিয়ে সংখ্যাটিকে ধনাত্মক করে নেওয়া আবশ্যক।

৩. **ইনপুট হিসেবে ০ আসলে সতর্কতা**:
   ইনপুট যদি সরাসরি \`0\` হয়, তবে \`while (n > 0)\` লুপে একবারও প্রবেশ করবে না। তাই \`0\` এর জন্য আলাদা চেক রাখা প্রয়োজন।

---

## ৫. লুপসমূহের তুলনামূলক সারণী

| মানদণ্ড | \`while\` লুপ | \`for\` লুপ | \`do-while\` লুপ |
|---|---|---|---|
| **শর্ত পরীক্ষা** | পূর্বে (Pre-test) | পূর্বে (Pre-test) | **শেষে (Post-test)** |
| **সর্বনিম্ন এক্সিকিউশন** | ০ বার | ০ বার | **১ বার** |
| **কাউন্টার চলক** | লুপের বাইরে ডিক্লেয়ার হয় | লুপ হেডারে সীমাবদ্ধ | লুপের বাইরে ডিক্লেয়ার হয় |
| **আদর্শ প্রয়োগ** | স্ট্রিম/EOF, গাণিতিক ধারা | অ্যারে ট্রাভার্সাল, নির্দিষ্ট রেঞ্জ | মেনু পরিচালনা, ইনপুট ভ্যালিডেশন |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: সংখ্যার প্রতিটি অঙ্ক পৃথকীকরণ (Digits)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #২ — Problem Q*

**সমস্যা পরিচিতি**:
একটি সংখ্যা $N$ দেওয়া থাকবে। সংখ্যাটির প্রতিটি অঙ্ক ডান থেকে বামে স্পেস দিয়ে পৃথক করে প্রিন্ট করতে হবে। মোট $T$ টি টেস্টকেস থাকবে।

**সীমাবদ্ধতা**:
$1 \\le T \\le 10$, $0 \\le N \\le 10^9$

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        int t = int.Parse(Console.ReadLine().Trim());

        while (t-- > 0)
        {
            long n = long.Parse(Console.ReadLine().Trim());

            // এজ কেস: N = 0 হলে সাধারণ লুপ ঢুকবে না
            if (n == 0)
            {
                Console.WriteLine("0");
                continue;
            }

            bool first = true;

            // ডান থেকে বামে প্রতিটি অঙ্ক বের করা
            while (n > 0)
            {
                long digit = n % 10;
                if (!first)
                {
                    Console.Write(" ");
                }
                Console.Write(digit);
                first = false;

                n /= 10;
            }
            Console.WriteLine();
        }
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(T \\cdot \\log_{10} N)$ — প্রতিটি টেস্টকেসে সংখ্যার অঙ্কের সমান সংখ্যক ভাগ ও মডুলাস ($\le 10$ ধাপ)।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ — কোনো অতিরিক্ত মেমোরি ব্যতিত ধ্রুবক স্পেস।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem Q: Digits](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/Q) | Easy | Digit extraction, Zero edge case |
| ⚪ | Codeforces Assiut | [Problem H: One Prime](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/H) | Easy | Trial division, while loop |
| ⚪ | Codeforces Assiut | [Problem G: Factorial](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/G) | Easy | Multiplication accumulator |
| ⚪ | Exercism C# | [Collatz Conjecture](https://exercism.org/tracks/csharp/exercises/collatz-conjecture) | Easy | While loop, Step counting |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem Q: Digits",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/Q",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["while", "Math", "Digits"],
        solutionEn: "Repeatedly extract n % 10 and divide by 10, handling the n = 0 edge case.",
        solutionBn: "n % 10 ও n / 10 দিয়ে ডান থেকে অঙ্ক আলাদা করুন এবং n = 0 এজ কেস বিশেষভাবে হ্যান্ডেল করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem H: One Prime",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/H",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["while", "Math", "Prime"],
        solutionEn: "Test divisibility with d * d <= n using a while loop to achieve O(sqrt(N)) primality testing.",
        solutionBn: "d * d <= n শর্তে হোয়াইল লুপ চালিয়ে O(sqrt(N)) সময়ে মৌলিক সংখ্যা যাচাই করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem G: Factorial",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/G",
        difficulty: "EASY",
        company: "Therap",
        tags: ["while", "Math", "Factorial"],
        solutionEn: "Compute factorial using 64-bit long accumulator down to 1.",
        solutionBn: "৬৪-বিট long অ্যাকুমুলেটর ব্যবহার করে ১ পর্যন্ত গুণ করে ফ্যাক্টোরিয়াল বের করুন।",
      },
      {
        source: "Exercism C#",
        name: "Collatz Conjecture",
        url: "https://exercism.org/tracks/csharp/exercises/collatz-conjecture",
        difficulty: "EASY",
        company: null,
        tags: ["while", "Math", "Algorithms"],
        solutionEn: "Apply 3n + 1 or n / 2 transformations in a while (n > 1) loop and count total steps.",
        solutionBn: "n > 1 শর্তে হোয়াইল লুপ চালিয়ে ৩n + ১ বা n / ২ নিয়মে মোট পদক্ষেপ গণনা করুন।",
      },
    ],
  };
