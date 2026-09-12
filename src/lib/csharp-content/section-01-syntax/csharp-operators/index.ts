import type { LocalLesson } from "@/lib/lessons-data";

export const csharpOperatorsLesson: LocalLesson = {
    slug: "csharp-operators",
    titleEn: "Operators & Expressions",
    titleBn: "অপারেটর ও এক্সপ্রেশন",
    categoryEn: "01. C# Syntax",
    categoryBn: "০১. সি# সিনট্যাক্স ও মৌলিক গঠন",
    categoryDescEn:
      "Foundational syntax of C#, variable declaration, primitive types, string formatting, console I/O, and arithmetic/logical operators.",
    categoryDescBn:
      "সি# ভাষার প্রাথমিক সিনট্যাক্স, চলক ঘোষণা, মৌলিক তথ্য ধরন, কনসোল ইনপুট-আউটপুট এবং অপারেটর।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Arithmetic, relational, logical (short-circuit), bitwise, conditional (?:), null-coalescing (??), operator precedence, and compound assignment.",
    descriptionBn:
      "গাণিতিক, তুলনামূলক, লজিক্যাল (short-circuit), বিটওয়াইজ, conditional (?:), null-coalescing (??), অগ্রাধিকার ক্রম এবং compound assignment।",
    difficulty: "EASY",
    displayOrder: 5,
    prerequisites: ["csharp-variables", "csharp-data-types"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# Operators & Expressions in C#

An **operator** is a symbol that tells the compiler to perform a specific operation on one or more operands. An **expression** is a combination of operands and operators that evaluates to a single value.

---

## 1. Arithmetic Operators

| Operator | Name | Example | Result |
|---|---|---|---|
| \`+\` | Addition | \`10 + 4\` | \`14\` |
| \`-\` | Subtraction | \`10 - 4\` | \`6\` |
| \`*\` | Multiplication | \`10 * 4\` | \`40\` |
| \`/\` | Division | \`10 / 4\` | \`2\` ← integer truncation! |
| \`%\` | Modulo (remainder) | \`10 % 4\` | \`2\` |
| \`++\` | Increment | \`a++\` or \`++a\` | adds 1 |
| \`--\` | Decrement | \`a--\` or \`--a\` | subtracts 1 |

> **Integer Division Trap**: \`7 / 2 = 3\` in C#, not \`3.5\`. To get a decimal result, cast at least one operand: \`7.0 / 2 = 3.5\` or \`(double)7 / 2\`.

\`\`\`csharp
int a = 14, b = 4;

Console.WriteLine(a + b);   // 18
Console.WriteLine(a / b);   // 3  ← truncated
Console.WriteLine(a % b);   // 2  ← remainder
Console.WriteLine((double)a / b); // 3.5

a += 10;  // a = 24  (compound: a = a + 10)
b *= 2;   // b = 8   (compound: b = b * 2)
\`\`\`

---

## 2. Relational / Comparison Operators

| Operator | Meaning | Example |
|---|---|---|
| \`==\` | Equal to | \`a == b\` |
| \`!=\` | Not equal to | \`a != b\` |
| \`<\` | Less than | \`a < b\` |
| \`>\` | Greater than | \`a > b\` |
| \`<=\` | Less than or equal | \`a <= b\` |
| \`>=\` | Greater than or equal | \`a >= b\` |

> **Important**: Use \`==\` for value comparison. For strings, \`==\` compares content (not reference), which is the expected behavior in C#.

---

## 3. Logical Operators & Short-Circuit Evaluation

| Operator | Name | Short-circuits? | Behavior |
|---|---|---|---|
| \`&&\` | Conditional AND | Yes | Right side skipped if left is \`false\` |
| \`||\` | Conditional OR | Yes | Right side skipped if left is \`true\` |
| \`!\` | Logical NOT | N/A | Inverts bool value |
| \`&\` | Non-short-circuit AND | No | Both sides always evaluated |
| \`|\` | Non-short-circuit OR | No | Both sides always evaluated |

\`\`\`csharp
string text = null;

// Safe null-check using short-circuit &&
// If text == null, then text.Length is NEVER called → no NullReferenceException
if (text != null && text.Length > 0)
{
    Console.WriteLine("Has content");
}

// Short-circuit || for defaults
bool isAdmin = false;
bool hasPermission = isAdmin || CheckDatabase(); // CheckDatabase() only called if !isAdmin
\`\`\`

---

## 4. Bitwise Operators

Used for low-level bit manipulation, flags, and performance-critical code:

| Operator | Name | Example | Binary Result |
|---|---|---|---|
| \`&\` | Bitwise AND | \`5 & 3\` | \`0101 & 0011 = 0001\` → 1 |
| \`|\` | Bitwise OR | \`5 | 3\` | \`0101 | 0011 = 0111\` → 7 |
| \`^\` | Bitwise XOR | \`5 ^ 3\` | \`0101 ^ 0011 = 0110\` → 6 |
| \`~\` | Bitwise NOT | \`~5\` | inverts all bits |
| \`<<\` | Left shift | \`1 << 3\` | \`0001 → 1000\` → 8 (×2³) |
| \`>>\` | Right shift | \`8 >> 2\` | \`1000 → 0010\` → 2 (÷2²) |

\`\`\`csharp
// Check if a number is even using bitwise AND
int n = 42;
bool isEven = (n & 1) == 0;   // last bit = 0 → even

// Multiply/divide by powers of 2 efficiently
int doubled  = n << 1;  // 84  (× 2)
int halved   = n >> 1;  // 21  (÷ 2)
\`\`\`

---

## 5. Conditional (Ternary) Operator \`?:\`

A compact way to express \`if-else\` in a single expression:

\`\`\`csharp
// Syntax: condition ? valueIfTrue : valueIfFalse
int score = 75;
string grade = score >= 60 ? "Pass" : "Fail";

int max = a > b ? a : b;   // inline max of two numbers
\`\`\`

---

## 6. Null-Coalescing Operator \`??\` and \`??=\`

\`\`\`csharp
string name = null;

// ?? returns right-hand value if left is null
string display = name ?? "Anonymous";   // "Anonymous"

// ??= assigns only if the variable is currently null
name ??= "Default User";               // name = "Default User"
Console.WriteLine(name);               // "Default User"
\`\`\`

---

## 7. Operator Precedence (High → Low)

| Priority | Operators |
|---|---|
| 1 (Highest) | \`++\`, \`--\`, \`!\`, \`~\`, \`(cast)\` |
| 2 | \`*\`, \`/\`, \`%\` |
| 3 | \`+\`, \`-\` |
| 4 | \`<<\`, \`>>\` |
| 5 | \`<\`, \`>\`, \`<=\`, \`>=\` |
| 6 | \`==\`, \`!=\` |
| 7 | \`&\` (bitwise AND) |
| 8 | \`^\` (bitwise XOR) |
| 9 | \`|\` (bitwise OR) |
| 10 | \`&&\` (logical AND) |
| 11 | \`||\` (logical OR) |
| 12 | \`??\` (null-coalescing) |
| 13 | \`?:\` (ternary) |
| 14 (Lowest) | \`=\`, \`+=\`, \`-=\`, etc. |

> When in doubt, use parentheses \`( )\` to make precedence explicit and code readable.

---

## Syntax & Practical Implementation

\`\`\`csharp
int a = 14, b = 4;

// Arithmetic
int sum     = a + b;         // 18
int product = a * b;         // 56
int div     = a / b;         // 3 (integer truncation)
int rem     = a % b;         // 2

// Compound assignment
a += 5;   // a = 19
b++;      // b = 5

// Short-circuit null safety
string text = null;
if (text != null && text.Length > 0)
    Console.WriteLine(text);

// Ternary
string label = a > 10 ? "Large" : "Small";

// Null-coalescing
string username = null;
string display  = username ?? "Guest";

// Bitwise: check if number is odd
bool isOdd = (a & 1) == 1;

Console.WriteLine($"Div={div}, Rem={rem}, Label={label}, User={display}, Odd={isOdd}");
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Digits Summation
*Source: Codeforces Assiut University Training Sheet #1 — Problem F*

Given two numbers $N$ and $M$ ($0 \\le N, M \\le 10^{18}$), print the sum of their last digits.

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string[] parts = Console.ReadLine().Split(' ');
        long n = long.Parse(parts[0]);
        long m = long.Parse(parts[1]);

        // % 10 extracts the units digit
        long lastN = n % 10;
        long lastM = m % 10;

        Console.WriteLine(lastN + lastM);
    }
}
\`\`\`

**Complexity**: Time $O(1)$ · Space $O(1)$

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem F: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | Modulo, Arithmetic |
| ⚪ | Exercism C# | [Cars, Assemble!](https://exercism.org/tracks/csharp/exercises/cars-assemble) | Easy | Operators, Math |
| ⚪ | Exercism C# | [Darts](https://exercism.org/tracks/csharp/exercises/darts) | Easy | Comparison, Math |
| ⚪ | Codeforces | [Watermelon](https://codeforces.com/problemset/problem/4/A) | Easy | Modulo, Logical |
`,

    contentBn: `# অপারেটর ও এক্সপ্রেশন

**অপারেটর** হলো একটি চিহ্ন যা কম্পাইলারকে এক বা একাধিক অপারেন্ডের উপর নির্দিষ্ট অপারেশন সম্পাদন করতে নির্দেশ দেয়। **এক্সপ্রেশন** হলো অপারেটর ও অপারেন্ডের সমন্বয় যা একটি একক মানে মূল্যায়িত হয়।

---

## ১. গাণিতিক অপারেটর

| অপারেটর | নাম | উদাহরণ | ফলাফল |
|---|---|---|---|
| \`+\` | যোগ | \`10 + 4\` | \`14\` |
| \`-\` | বিয়োগ | \`10 - 4\` | \`6\` |
| \`*\` | গুণ | \`10 * 4\` | \`40\` |
| \`/\` | ভাগ | \`10 / 4\` | \`2\` ← পূর্ণসংখ্যায় ট্রাঙ্কেট! |
| \`%\` | মডুলো (ভাগশেষ) | \`10 % 4\` | \`2\` |

> **ইন্টিজার ভাগের ফাঁদ**: \`7 / 2 = 3\` — দশমিক অংশ হারিয়ে যায়। দশমিক ফলের জন্য: \`7.0 / 2 = 3.5\` বা \`(double)7 / 2\`।

\`\`\`csharp
int a = 14, b = 4;
Console.WriteLine(a / b);         // 3 (ট্রাঙ্কেটেড)
Console.WriteLine(a % b);         // 2 (ভাগশেষ)
Console.WriteLine((double)a / b); // 3.5
a += 10;  // a = 24
\`\`\`

---

## ২. তুলনামূলক অপারেটর

| অপারেটর | অর্থ |
|---|---|
| \`==\` | সমান |
| \`!=\` | অসমান |
| \`<\`, \`>\` | ছোট, বড় |
| \`<=\`, \`>=\` | ছোট বা সমান, বড় বা সমান |

---

## ৩. লজিক্যাল ও Short-Circuit অপারেটর

| অপারেটর | Short-circuit? | আচরণ |
|---|---|---|
| \`&&\` (AND) | হ্যাঁ | বামপাশ false হলে ডানপাশ এড়িয়ে যায় |
| \`||\` (OR) | হ্যাঁ | বামপাশ true হলে ডানপাশ এড়িয়ে যায় |
| \`!\` | — | bool উল্টে দেয় |

\`\`\`csharp
string text = null;

// নিরাপদ null-check — text null হলে text.Length চলে না
if (text != null && text.Length > 0)
    Console.WriteLine("Content আছে");
\`\`\`

---

## ৪. বিটওয়াইজ অপারেটর

| অপারেটর | নাম | উদাহরণ | ফলাফল |
|---|---|---|---|
| \`&\` | AND | \`5 & 3\` | \`1\` |
| \`|\` | OR | \`5 | 3\` | \`7\` |
| \`^\` | XOR | \`5 ^ 3\` | \`6\` |
| \`<<\` | Left shift | \`1 << 3\` | \`8\` (×2³) |
| \`>>\` | Right shift | \`8 >> 2\` | \`2\` (÷2²) |

\`\`\`csharp
int n = 42;
bool jugol = (n & 1) == 0;  // শেষ bit = 0 হলে জোড়
int dugon  = n << 1;         // 84 (×2)
\`\`\`

---

## ৫. Conditional (Ternary) অপারেটর \`?:\`

\`\`\`csharp
int score = 75;
string grade = score >= 60 ? "Pass" : "Fail";
int max = a > b ? a : b;
\`\`\`

---

## ৬. Null-Coalescing অপারেটর \`??\` ও \`??=\`

\`\`\`csharp
string name = null;
string display = name ?? "Anonymous";   // "Anonymous"

name ??= "Default User";               // null হলেই assign করে
Console.WriteLine(name);               // "Default User"
\`\`\`

---

## ৭. অগ্রাধিকার ক্রম (উচ্চ → নিম্ন)

| অগ্রাধিকার | অপারেটর |
|---|---|
| সর্বোচ্চ | \`++\`, \`--\`, \`!\`, cast |
| উচ্চ | \`*\`, \`/\`, \`%\` |
| মধ্যম | \`+\`, \`-\` |
| — | \`<\`, \`>\`, \`==\`, \`!=\` |
| নিম্ন | \`&&\`, \`||\` |
| সর্বনিম্ন | \`??\`, \`?:\`, \`=\`, \`+=\` |

---

## সিনট্যাক্স ও ব্যবহারিক কোড

\`\`\`csharp
int a = 14, b = 4;

int bhagshesh = a % b;                     // 2
string label  = a > 10 ? "বড়" : "ছোট";    // "বড়"
string user   = null;
string display = user ?? "অতিথি";          // "অতিথি"
bool jugol    = (a & 1) == 0;             // জোড় কিনা

Console.WriteLine($"ভাগশেষ={bhagshesh}, লেবেল={label}, ব্যবহারকারী={display}");
\`\`\`

---

## বাস্তব সমস্যা সমাধান

### সমস্যা: Digits Summation
*উৎস: Codeforces Assiut — Problem F*

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string[] parts = Console.ReadLine().Split(' ');
        long n = long.Parse(parts[0]);
        long m = long.Parse(parts[1]);

        Console.WriteLine(n % 10 + m % 10);
    }
}
\`\`\`

**জটিলতা**: সময় $O(1)$ · স্থান $O(1)$

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem F: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | Modulo, Arithmetic |
| ⚪ | Exercism C# | [Cars, Assemble!](https://exercism.org/tracks/csharp/exercises/cars-assemble) | Easy | Operators, Math |
| ⚪ | Exercism C# | [Darts](https://exercism.org/tracks/csharp/exercises/darts) | Easy | Comparison, Math |
| ⚪ | Codeforces | [Watermelon](https://codeforces.com/problemset/problem/4/A) | Easy | Modulo, Logical |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem F: Digits Summation",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Operators", "Modulo", "long"],
        solutionEn: "Use the modulo operator % 10 to extract the last digit of both N and M, then sum them.",
        solutionBn: "% 10 মডুলো অপারেটর ব্যবহার করে N ও M-এর শেষ অঙ্ক বের করে যোগ করুন।",
      },
      {
        source: "Exercism C#",
        name: "Cars, Assemble!",
        url: "https://exercism.org/tracks/csharp/exercises/cars-assemble",
        difficulty: "EASY",
        company: null,
        tags: ["Operators", "Math", "double"],
        solutionEn: "Calculate production rate per hour and success rate using arithmetic and comparison operators.",
        solutionBn: "গাণিতিক ও তুলনামূলক অপারেটর ব্যবহার করে উৎপাদন হার ও সাফল্যের হার নির্ণয় করুন।",
      },
      {
        source: "Exercism C#",
        name: "Darts",
        url: "https://exercism.org/tracks/csharp/exercises/darts",
        difficulty: "EASY",
        company: null,
        tags: ["Math", "Comparison", "double"],
        solutionEn: "Use Math.Sqrt and comparison operators to determine which scoring ring a dart lands in.",
        solutionBn: "Math.Sqrt এবং তুলনামূলক অপারেটর ব্যবহার করে dart কোন scoring ring-এ পড়েছে নির্ধারণ করুন।",
      },
      {
        source: "Codeforces",
        name: "Watermelon",
        url: "https://codeforces.com/problemset/problem/4/A",
        difficulty: "EASY",
        company: null,
        tags: ["Modulo", "Logical", "Math"],
        solutionEn: "Check if the watermelon weight is even and greater than 2 using modulo and logical operators.",
        solutionBn: "মডুলো ও লজিক্যাল অপারেটর ব্যবহার করে তরমুজের ওজন জোড় ও ২-এর বেশি কিনা যাচাই করুন।",
      },
    ],
  };
