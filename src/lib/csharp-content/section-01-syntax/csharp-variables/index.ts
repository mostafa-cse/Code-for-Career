import type { LocalLesson } from "@/lib/lessons-data";

export const csharpVariablesLesson: LocalLesson = {
    slug: "csharp-variables",
    titleEn: "Variables & Modifiers",
    titleBn: "চলক ঘোষণা, মডিফায়ার ও স্কোপ",
    categoryEn: "01. C# Syntax",
    categoryBn: "০১. সি# সিনট্যাক্স ও মৌলিক গঠন",
    categoryDescEn:
      "Foundational syntax of C#, variable declaration, primitive types, string formatting, console I/O, and arithmetic/logical operators.",
    categoryDescBn:
      "সি# ভাষার প্রাথমিক সিনট্যাক্স, চলক ঘোষণা, মৌলিক তথ্য ধরন, কনসোল ইনপুট-আউটপুট এবং অপারেটর।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Variable declarations, var inference, const, readonly, static, naming conventions, scope rules, and memory allocation model.",
    descriptionBn:
      "চলক ঘোষণা, var ইনফারেন্স, const, readonly, static মডিফায়ার, নামকরণ নীতি, স্কোপ নিয়ম এবং মেমোরি সংরক্ষণ পদ্ধতি।",
    difficulty: "EASY",
    displayOrder: 1,
    prerequisites: [],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# Variables & Modifiers in C#

A variable is a **named memory location** that holds a value of a specific type. C# is a **strongly typed**, **type-safe** language — every variable must have a declared type (explicit or inferred) before use.

---

## Variable Lifecycle & Memory Model

When you declare a variable, three things happen:

1. **Declaration** — The compiler records the name and type.
2. **Initialization** — A value is assigned. Local variables follow the **Definite Assignment Rule**: they must be initialized before reading or the compiler raises an error.
3. **Storage** — Where data lives in memory depends on its type:

| Variable Kind | Storage Location | Lifetime |
|---|---|---|
| Local value-type (\`int\`, \`bool\`, \`struct\`) | **Stack** | Until scope exits |
| Local reference-type (\`string\`, class) | Reference on Stack → object on **Heap** | Until GC collects |
| Static field | **Static segment** | Entire application lifetime |
| Instance field | Part of object on **Heap** | Until object is GC-collected |

---

## Explicit Typing vs \`var\` (Type Inference)

\`\`\`csharp
// Explicit — type is written out
int activeUsers    = 24;
double balance     = 15200.75;

// Implicit 'var' — compiler infers at compile time (C# 3.0+)
var companyName = "Enosis Solutions"; // System.String
var itemCount   = 42;                 // System.Int32
var ratio       = 3.14;              // System.Double
\`\`\`

> \`var\` is resolved at **compile time** — zero runtime overhead. Use \`var\` when the type is obvious; use explicit types for clarity in complex scenarios.

---

## Modifiers: const, readonly, static

### \`const\` — Compile-Time Constant
- Value is **evaluated at compile time** and inlined directly into the IL (compiled code).
- **Cannot** be changed after declaration.
- Must be initialized at declaration.
- Implicitly \`static\` — accessed via the class name, not an instance.
- Only works with primitive types and \`string\`.

\`\`\`csharp
const double Pi       = 3.14159265359;
const int    MaxRetry  = 3;
const string AppName   = "BD Software Prep";

// Accessing const: no object needed
Console.WriteLine(Pi);
\`\`\`

### \`readonly\` — Runtime Constant (C#'s equivalent of Java \`final\`)
- Value can be assigned **at declaration OR inside a constructor** only.
- After construction, the field is frozen — cannot be reassigned.
- Can be **instance-level** (each object gets its own value), unlike \`const\`.
- Can hold any type including reference types.

\`\`\`csharp
public class Circle
{
    public readonly double Radius;        // unique per object

    public Circle(double radius)
    {
        Radius = radius;                  // ✅ allowed in constructor
    }
}

var c = new Circle(5.0);
// c.Radius = 10.0;                      // ❌ compile error — readonly
\`\`\`

### \`const\` vs \`readonly\` — Side-by-Side

| Feature | \`const\` | \`readonly\` |
|---|---|---|
| Evaluated at | Compile time | Runtime |
| Allowed types | Primitive & \`string\` only | Any type |
| Can be instance-level | No (always static) | Yes |
| Set in constructor | No | Yes |
| Java equivalent | \`static final\` | \`final\` |
| Performance | Slightly faster (inlined) | Normal field access |

### \`static\` — Class-Level (Shared) Variable
- Belongs to the **type itself**, not to any particular object.
- **One copy** shared across all instances for the entire app lifetime.
- Accessed via \`ClassName.FieldName\`, never via an object reference.

\`\`\`csharp
public class BankAccount
{
    public static int TotalAccounts = 0;   // shared across ALL objects
    public readonly int AccountId;          // unique per object, set once

    public BankAccount()
    {
        TotalAccounts++;                   // class-level counter
        AccountId = TotalAccounts;         // unique ID for this object
    }
}

var a1 = new BankAccount();
var a2 = new BankAccount();
Console.WriteLine(BankAccount.TotalAccounts); // 2
Console.WriteLine(a1.AccountId);              // 1
Console.WriteLine(a2.AccountId);              // 2
\`\`\`

### Combining Modifiers: \`static readonly\`
A field that is shared across all instances AND can only be set once (at runtime):

\`\`\`csharp
public class Config
{
    // Set once at class load time from environment — not a compile-time const
    public static readonly string ConnectionString =
        Environment.GetEnvironmentVariable("DB_CONN") ?? "Server=localhost;";
}
\`\`\`

---

## Naming Conventions in C#

| Context | Convention | Example |
|---|---|---|
| Local variable | \`camelCase\` | \`userAge\`, \`itemCount\` |
| Method parameter | \`camelCase\` | \`firstName\`, \`maxRetry\` |
| \`const\` field | \`PascalCase\` | \`MaxRetries\`, \`Pi\` |
| \`readonly\` field (public) | \`PascalCase\` | \`ConnectionString\` |
| \`static\` field (private) | \`_camelCase\` | \`_instance\` |
| Property | \`PascalCase\` | \`UserName\`, \`IsActive\` |
| Class / Struct | \`PascalCase\` | \`BankAccount\`, \`UserDto\` |

---

## Scope Rules

A variable is only accessible within the **block** \`{ }\` where it is declared:

\`\`\`csharp
int x = 10;                        // outer scope

{
    int y = 20;                    // inner scope
    Console.WriteLine(x + y);     // ✅ can read outer 'x'
}

// Console.WriteLine(y);          // ❌ compile error: 'y' is out of scope
\`\`\`

---

## Syntax & Practical Implementation

\`\`\`csharp
// 1. Basic declarations
int userAge           = 24;
double accountBalance = 15200.75;
bool isActiveMember   = true;
char grade            = 'A';

// 2. var inference
var companyName = "Enosis Solutions";
var itemsCount  = 42;

// 3. Multiple declarations of same type
int x = 5, y = 10, z = 15;

// 4. const — compile-time, inlined
const double Pi        = 3.14159265359;
const int    MaxRetries = 3;

// 5. readonly — runtime lock
public class AppSettings
{
    public readonly string Region;
    public AppSettings(string region) { Region = region; }
}

// 6. static — shared class-level
public class Counter
{
    public static int Count = 0;
}

Console.WriteLine($"Name: {companyName}, Balance: {accountBalance:F2}");
Console.WriteLine($"Pi = {Pi}, MaxRetries = {MaxRetries}");
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Compute Difference ($A \\times B - C \\times D$)
*Source: Codeforces Assiut University Training Sheet #1 — Problem D*

**Problem Statement**: Given four integers $A, B, C, D$, compute:
$$\\text{Difference} = (A \\times B) - (C \\times D)$$

**Constraints**: $-10^5 \\le A, B, C, D \\le 10^5$

> **Overflow Warning**: $10^5 \\times 10^5 = 10^{10}$, which exceeds \`int\` max ($\\approx 2.14 \\times 10^9$). Use \`long\`.

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string[] inputs = Console.ReadLine().Split(' ');

        long a = long.Parse(inputs[0]);
        long b = long.Parse(inputs[1]);
        long c = long.Parse(inputs[2]);
        long d = long.Parse(inputs[3]);

        Console.WriteLine((a * b) - (c * d));
    }
}
\`\`\`

**Complexity**: Time $O(1)$ · Space $O(1)$

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem D: Difference](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D) | Easy | Variables, long, Overflow |
| ⚪ | Exercism C# | [Lucian's Luscious Lasagna](https://exercism.org/tracks/csharp/exercises/lucians-luscious-lasagna) | Easy | const, Variables |
| ⚪ | Exercism C# | [Tracking Progress](https://exercism.org/tracks/csharp/exercises/tracking-progress) | Easy | readonly, static |
| ⚪ | Exercism C# | [Elons Toy Car](https://exercism.org/tracks/csharp/exercises/elons-toy-car) | Easy | const, Scope |
`,

    contentBn: `# C# এ চলক, মডিফায়ার ও স্কোপ

চলক (Variable) হলো মেমোরিতে একটি **নামকৃত স্থান** যেখানে নির্দিষ্ট ধরনের ডেটা সংরক্ষিত থাকে। সি# একটি **দৃঢ় টাইপযুক্ত (Strongly Typed)** ভাষা — প্রতিটি চলকের টাইপ ব্যবহারের আগে নির্ধারণ করতে হয়।

---

## চলকের জীবনচক্র ও মেমোরি মডেল

| চলকের ধরন | মেমোরি অবস্থান | স্থায়িত্ব |
|---|---|---|
| Local value-type (\`int\`, \`bool\`) | **Stack** | স্কোপ শেষে মুক্ত |
| Local reference-type (\`string\`, class) | Reference → **Heap** | GC মুক্ত করলে |
| Static field | **Static segment** | সম্পূর্ণ অ্যাপ জুড়ে |
| Instance field | অবজেক্টের সাথে **Heap**-এ | অবজেক্ট GC হলে |

---

## \`var\` দিয়ে টাইপ ইনফারেন্স

\`\`\`csharp
// স্পষ্ট টাইপ ঘোষণা
int boyos    = 24;
double beton = 65000.50;

// var — কম্পাইলার নিজেই টাইপ নির্ধারণ করে
var protishthan = "Enosis Solutions"; // System.String
var shonkha     = 50;                 // System.Int32
\`\`\`

> \`var\` সম্পূর্ণ **কম্পাইল-টাইমে** নির্ধারিত হয় — রানটাইমে কোনো পারফরম্যান্স ক্ষতি নেই।

---

## মডিফায়ার: const, readonly, static

### \`const\` — কম্পাইল-টাইম ধ্রুবক
- মান **কম্পাইল-টাইমে** নির্ধারিত এবং IL কোডে সরাসরি ঢুকিয়ে দেওয়া হয়।
- ঘোষণার পরে পরিবর্তন করা যায় না।
- শুধুমাত্র primitive type ও \`string\` এর ক্ষেত্রে ব্যবহার করা যায়।
- অন্তর্নিহিতভাবে \`static\` — ক্লাস নামে অ্যাক্সেস করতে হয়।

\`\`\`csharp
const double Pi       = 3.14159265359;
const int    MaxRetry  = 3;
const string AppName   = "BD Software Prep";
\`\`\`

### \`readonly\` — রানটাইম ধ্রুবক (Java-র \`final\`-এর সমতুল্য)
- শুধুমাত্র **ঘোষণার সময়** বা **constructor-এ** মান নির্ধারণ করা যায়।
- নির্মাণের পরে পরিবর্তন করা যায় না — "একবার লেখা" প্যাটার্ন।
- instance-level হতে পারে — প্রতিটি অবজেক্টের আলাদা মান থাকতে পারে।
- যেকোনো টাইপের জন্য ব্যবহার করা যায়।

\`\`\`csharp
public class Britto
{
    public readonly double Radius;   // constructor-এ একবার সেট

    public Britto(double radius)
    {
        Radius = radius;             // ✅ constructor-এ অনুমোদিত
    }
}
// obj.Radius = 5.0; // ❌ constructor-র বাইরে পরিবর্তন নিষিদ্ধ
\`\`\`

### \`const\` বনাম \`readonly\` — মূল পার্থক্য

| বৈশিষ্ট্য | \`const\` | \`readonly\` |
|---|---|---|
| মূল্যায়ন | কম্পাইল-টাইম | রানটাইম |
| অনুমোদিত টাইপ | শুধু primitive ও string | যেকোনো টাইপ |
| instance-level | না (সর্বদা static) | হ্যাঁ |
| Constructor-এ সেট | না | হ্যাঁ |
| Java সমতুল্য | \`static final\` | \`final\` |

### \`static\` — ক্লাস-স্তরের চলক
- নির্দিষ্ট **টাইপের অন্তর্গত**, কোনো অবজেক্টের নয়।
- সকল instance একই কপি ভাগ করে — সম্পূর্ণ অ্যাপ জুড়ে একটিমাত্র কপি।
- \`ClassName.FieldName\` দিয়ে অ্যাক্সেস করতে হয়।

\`\`\`csharp
public class BankAccount
{
    public static int TotalAccounts = 0;  // সকল অবজেক্টের মধ্যে শেয়ারড
    public readonly int AccountId;         // প্রতি অবজেক্টের জন্য অনন্য

    public BankAccount()
    {
        TotalAccounts++;
        AccountId = TotalAccounts;
    }
}

var a1 = new BankAccount();
var a2 = new BankAccount();
Console.WriteLine(BankAccount.TotalAccounts); // 2
Console.WriteLine(a1.AccountId);              // 1
\`\`\`

### \`static readonly\` — শেয়ারড এবং একবার সেট
\`\`\`csharp
public class Config
{
    public static readonly string ConnectionString =
        Environment.GetEnvironmentVariable("DB_CONN") ?? "Server=localhost;";
}
\`\`\`

---

## নামকরণ নিয়মাবলী

| প্রেক্ষাপট | নিয়ম | উদাহরণ |
|---|---|---|
| লোকাল চলক | \`camelCase\` | \`userAge\`, \`itemCount\` |
| মেথড প্যারামিটার | \`camelCase\` | \`firstName\` |
| \`const\` field | \`PascalCase\` | \`MaxRetries\`, \`Pi\` |
| \`readonly\` field (public) | \`PascalCase\` | \`ConnectionString\` |
| Property | \`PascalCase\` | \`UserName\` |
| Class / Struct | \`PascalCase\` | \`BankAccount\` |

---

## স্কোপ নিয়ম

\`\`\`csharp
int x = 10;                        // বাইরের স্কোপ

{
    int y = 20;                    // ভিতরের স্কোপ
    Console.WriteLine(x + y);     // ✅ বাইরের 'x' পড়া যায়
}

// Console.WriteLine(y);          // ❌ ত্রুটি: 'y' স্কোপের বাইরে
\`\`\`

---

## সিনট্যাক্স ও ব্যবহারিক কোড বাস্তবায়ন

\`\`\`csharp
// সাধারণ ঘোষণা
int boyos         = 24;
double beton      = 65000.50;
bool chakriAche   = true;

// var ইনফারেন্স
var protishthan = "Enosis Solutions";
var shonkha     = 50;

// const ও readonly
const double Pi = 3.14159265359;

public class AppSettings
{
    public static readonly string Environment = "Production";
}

Console.WriteLine($"নাম: {protishthan}, বেতন: {beton:F2}");
\`\`\`

---

## বাস্তব সমস্যা সমাধান

### সমস্যা: মান পার্থক্য নির্ণয়
*উৎস: কোডফোর্সেস Assiut — Problem D*

$$\\text{Difference} = (A \\times B) - (C \\times D)$$

> $10^5 \\times 10^5 = 10^{10}$ যা \`int\`-এর সীমা ছাড়িয়ে যায়। \`long\` ব্যবহার বাধ্যতামূলক।

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string[] inputs = Console.ReadLine().Split(' ');
        long a = long.Parse(inputs[0]);
        long b = long.Parse(inputs[1]);
        long c = long.Parse(inputs[2]);
        long d = long.Parse(inputs[3]);

        Console.WriteLine((a * b) - (c * d));
    }
}
\`\`\`

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem D: Difference](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D) | Easy | Variables, long |
| ⚪ | Exercism C# | [Lucian's Luscious Lasagna](https://exercism.org/tracks/csharp/exercises/lucians-luscious-lasagna) | Easy | const |
| ⚪ | Exercism C# | [Tracking Progress](https://exercism.org/tracks/csharp/exercises/tracking-progress) | Easy | readonly, static |
| ⚪ | Exercism C# | [Elons Toy Car](https://exercism.org/tracks/csharp/exercises/elons-toy-car) | Easy | const, Scope |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem D: Difference",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Variables", "Math", "Overflow", "long"],
        solutionEn: "Use 64-bit long to prevent 32-bit integer overflow when multiplying values up to 10^5.",
        solutionBn: "৩২-বিট ওভারফ্লো এড়াতে ৬৪-বিট 'long' টাইপ ব্যবহার করুন।",
      },
      {
        source: "Exercism C#",
        name: "Lucian's Luscious Lasagna",
        url: "https://exercism.org/tracks/csharp/exercises/lucians-luscious-lasagna",
        difficulty: "EASY",
        company: null,
        tags: ["const", "Variables", "Basics"],
        solutionEn: "Define integer constants for prep/bake times and write arithmetic expressions to return remaining minutes.",
        solutionBn: "রান্নার সময় const হিসেবে ডিক্লেয়ার করে বাকি মিনিট গণনা করুন।",
      },
      {
        source: "Exercism C#",
        name: "Tracking Progress",
        url: "https://exercism.org/tracks/csharp/exercises/tracking-progress",
        difficulty: "EASY",
        company: null,
        tags: ["readonly", "static", "Properties"],
        solutionEn: "Use static fields to track shared counters and readonly to lock immutable values after construction.",
        solutionBn: "shared counter-এর জন্য static এবং অপরিবর্তনীয় মানের জন্য readonly ব্যবহার করুন।",
      },
      {
        source: "Exercism C#",
        name: "Elons Toy Car",
        url: "https://exercism.org/tracks/csharp/exercises/elons-toy-car",
        difficulty: "EASY",
        company: null,
        tags: ["const", "Scope", "Math"],
        solutionEn: "Model battery drain and distance using const rates and simple arithmetic expressions.",
        solutionBn: "ব্যাটারি খরচ ও দূরত্বের জন্য const রেট ব্যবহার করে সাধারণ গণিত প্রয়োগ করুন।",
      },
    ],
  };
