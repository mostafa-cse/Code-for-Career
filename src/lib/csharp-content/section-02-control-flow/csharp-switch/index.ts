import type { LocalLesson } from "@/lib/lessons-data";

export const csharpSwitchLesson: LocalLesson = {
    slug: "csharp-switch",
    titleEn: "switch Statements & Expressions",
    titleBn: "সুইচ স্টেটমেন্ট ও প্যাটার্ন ম্যাচিং",
    categoryEn: "02. Control Flow",
    categoryBn: "০২. কন্ট্রোল ফ্লো ও শর্তাধীন লজিক",
    categoryDescEn:
      "Decision-making statements, pattern matching switches, iteration loops, and performance implications of loop constructs.",
    categoryDescBn:
      "শর্তাধীন সিদ্ধান্ত গ্রহণ, সুইচ স্টেটমেন্ট, বিভিন্ন ধরনের লুপ এবং পুনরাবৃত্তিমূলক লজিক।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Classic switch-case, modern switch expressions, pattern matching, tuple patterns, jump tables, and branch optimization in C#.",
    descriptionBn:
      "সি# এ ক্লাসিক switch-case, আধুনিক সুইচ এক্সপ্রেশন, প্যাটার্ন ম্যাচিং, টাপল প্যাটার্ন, জাম্প টেবিল এবং ব্রাঞ্চ অপ্টিমাইজেশন।",
    difficulty: "EASY",
    displayOrder: 2,
    prerequisites: ["csharp-if-else"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# switch Statements & Expressions in C#

The \`switch\` construct evaluates an expression and selects a branch of execution among multiple candidate patterns. In modern C#, \`switch\` has evolved from a simple equality-checking statement into a powerful **functional pattern-matching engine**.

---

## 1. Evolution of \`switch\` Across C# Versions

| C# Version | Major Additions |
|---|---|
| **C# 1.0** | Classic \`switch\` statement with primitive types and strings; strict no-fall-through rule. |
| **C# 7.0** | Pattern matching in \`case\` labels (type patterns) and \`when\` guard clauses. |
| **C# 8.0** | **Switch Expressions** (\`=>\`), property patterns, tuple/positional patterns, discard (\`_\`). |
| **C# 9.0+** | Relational patterns (\`<\`, \`>=\`) and logical combinators (\`and\`, \`or\`, \`not\`). |
| **C# 11+** | List patterns (\`[1, 2, ..]\`) and extended property patterns. |

---

## 2. Low-Level Mechanics: Jump Tables vs Hash Lookups

The C# compiler and JIT optimize \`switch\` statements far beyond naive sequential \`if-else\` checks:

| Case Structure | Compiler Strategy | Time Complexity |
|---|---|---|
| **Dense Integers** (e.g. \`1, 2, 3, 4, 5\`) | **Jump Table** (IL \`switch\` opcode indexed table of pointers) | **$O(1)$** |
| **Sparse Integers** (e.g. \`10, 500, 20000\`) | **Binary Search Tree** of conditional jumps | **$O(\\log N)$** |
| **Strings** (\`"apple", "banana"\`) | **String Hash Table** (\`GetHashCode\` check + string equality fallback) | **$O(1)$** average |
| **Complex Patterns / \`when\`** | Linear pattern scan from top to bottom | **$O(N)$** |

> **Why Jump Tables are Fast**: A jump table directly computes the memory offset: \`TargetAddress = BaseAddress + (value * PointerSize)\`. Regardless of whether there are 5 cases or 500 cases, dispatch happens in constant time without sequential comparisons.

---

## 3. Classic \`switch\` Statement & The No-Fall-Through Rule

In C/C++, forgetting a \`break\` causes execution to fall through silently to the next case. **C# strictly forbids implicit fall-through**: every non-empty case block must terminate with \`break\`, \`return\`, \`throw\`, or an explicit jump (\`goto case\`).

\`\`\`csharp
int errorCode = 404;

switch (errorCode)
{
    case 200:
    case 201:
        // Empty case labels are allowed to share an execution block
        Console.WriteLine("Request Succeeded");
        break;

    case 400:
        Console.WriteLine("Bad Request");
        break;

    case 404:
        Console.WriteLine("Resource Not Found");
        break;

    case 500:
        Console.WriteLine("Internal Server Error");
        break;

    default:
        Console.WriteLine($"Unhandled HTTP Status: {errorCode}");
        break;
}
\`\`\`

### Explicit Fall-Through with \`goto case\`
\`\`\`csharp
int stage = 1;

switch (stage)
{
    case 1:
        Console.WriteLine("Step 1: Validation complete.");
        goto case 2; // Explicitly transfers control to case 2
    case 2:
        Console.WriteLine("Step 2: Processing payment.");
        break;
}
\`\`\`

---

## 4. Modern C# 8+ Switch Expressions

Switch expressions replace verbose ceremony (\`case\`, \`break\`, \`default\`) with concise, functional, value-producing expressions:

\`\`\`csharp
int dayNumber = 3;

string dayName = dayNumber switch
{
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    4 => "Thursday",
    5 => "Friday",
    6 => "Saturday",
    7 => "Sunday",
    _ => "Invalid Day" // Discard pattern acts as 'default'
};

Console.WriteLine($"Day: {dayName}");
\`\`\`

---

## 5. Pattern Matching Showcase

### A. Relational & Logical Patterns (C# 9.0+)
\`\`\`csharp
int temperature = 26;

string comfortLevel = temperature switch
{
    < 0                  => "Freezing",
    >= 0 and < 15        => "Cold",
    >= 15 and <= 25      => "Pleasant",
    > 25 and <= 35       => "Warm",
    _                    => "Extremely Hot"
};
\`\`\`

### B. Tuple / Positional Patterns (Multi-Variable Matching)
\`\`\`csharp
string role = "Admin";
bool hasMfa = true;

string accessLevel = (role, hasMfa) switch
{
    ("Admin", true)   => "Full Root Access",
    ("Admin", false)  => "MFA Required Before Admin Access",
    ("Editor", _)     => "Content Editing Access",
    (_, _)            => "Public Read-Only Access"
};
\`\`\`

### C. Property Patterns
\`\`\`csharp
public record Shipment(string Destination, decimal WeightKg, bool IsFragile);

var pkg = new Shipment("Dhaka", 12.5m, true);

decimal shippingCost = pkg switch
{
    { Destination: "Dhaka", WeightKg: <= 2.0m } => 60m,
    { Destination: "Dhaka", IsFragile: true }   => 150m,
    { Destination: "Chattogram" }              => 180m,
    _                                           => 250m
};
\`\`\`

### D. Guard Clauses with \`when\`
\`\`\`csharp
object input = 42;

string description = input switch
{
    int n when n % 2 == 0 => $"Even integer: {n}",
    int n                 => $"Odd integer: {n}",
    string s when s.Length > 10 => $"Long string ({s.Length} chars)",
    string s              => $"Short string: {s}",
    null                  => "Null value",
    _                     => "Unknown type"
};
\`\`\`

---

## 6. Comparison: \`switch\` Statement vs \`switch\` Expression

| Feature | Classic \`switch\` Statement | Modern \`switch\` Expression |
|---|---|---|
| **Form** | Statement block | Expression (returns a value) |
| **Syntax** | \`case value:\` ... \`break;\` | \`pattern => result,\` |
| **Default Branch** | \`default:\` | Discard pattern \`_\` |
| **Exhaustiveness** | Optional (skips if unmatched) | **Mandatory** (throws \`SwitchExpressionException\` if unhandled) |
| **Control Flow** | Can perform side effects (\`Console.WriteLine\`) | Best for returning or computing values |

---

## 7. Common Pitfalls & Best Practices

1. **Unreachable Pattern Warnings (Order Matters)**:
   Patterns are evaluated top to bottom. If a broader pattern precedes a narrower one, the narrower pattern can never execute:
   \`\`\`csharp
   int number = 15;
   string result = number switch
   {
       > 0  => "Positive",      // Matches 15 first!
       > 10 => "Greater than 10", // ⚠️ Compile Warning: Unreachable code
       _    => "Other"
   };
   \`\`\`
   *Fix*: Always place specific or restrictive patterns above generic patterns.

2. **Missing Discard (\`_\`) Fallback**:
   If a runtime value matches no case in a switch expression, the runtime throws \`System.Runtime.CompilerServices.SwitchExpressionException\`. Always include a discard (\`_\`) pattern or ensure mathematical exhaustiveness.

---

## Practical Problem Walkthrough

### Problem: Mathematical Calculator
*Source: Codeforces Assiut University Training Sheet #1 — Problem O*

**Problem Statement**:
Given a mathematical expression in the format $A + B$, $A - B$, $A * B$, or $A / B$. Evaluate and print the result. (Division is standard integer division).

**Constraints**:
$1 \\le A, B \\le 10^5$, valid operations are \`+\`, \`-\`, \`*\`, \`/\`.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string input = Console.ReadLine().Trim();

        // Identify the operator character
        char op = ' ';
        int opIndex = -1;

        for (int i = 0; i < input.Length; i++)
        {
            char ch = input[i];
            if (ch == '+' || ch == '-' || ch == '*' || ch == '/')
            {
                op = ch;
                opIndex = i;
                break;
            }
        }

        long a = long.Parse(input.Substring(0, opIndex));
        long b = long.Parse(input.Substring(opIndex + 1));

        // Evaluate using modern switch expression
        long result = op switch
        {
            '+' => a + b,
            '-' => a - b,
            '*' => a * b,
            '/' => a / b,
            _   => 0
        };

        Console.WriteLine(result);
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(L)$ where $L$ is the string length ($\le 15$ characters) — effectively $O(1)$. Switch expression dispatches in $O(1)$ time.
- **Space Complexity**: $O(1)$ — constant memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem O: Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/O) | Easy | Character switch, Arithmetic |
| ⚪ | Codeforces Assiut | [Problem P: First digit !](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/P) | Easy | Digit parity, switch / if-else |
| ⚪ | Exercism C# | [Cars, Assemble!](https://exercism.org/tracks/csharp/exercises/cars-assemble) | Easy | Switch expressions, Success rate |
| ⚪ | Exercism C# | [Triangle](https://exercism.org/tracks/csharp/exercises/triangle) | Easy | Pattern matching, Relational patterns |
`,

    contentBn: `# C# এ সুইচ (switch) স্টেটমেন্ট ও আধুনিক প্যাটার্ন ম্যাচিং

\`switch\` কাঠামো কোনো নির্দিষ্ট এক্সপ্রেশনের মানের ওপর ভিত্তি করে একাধিক বিকল্প ব্রাঞ্চ থেকে সঠিক পথটি নির্বাচন করে। আধুনিক সি# এ \`switch\` কেবল মান মেলানোর স্টেটমেন্ট নয়, বরং একটি শক্তিশালী **ফাংশনাল প্যাটার্ন-ম্যাচিং ইঞ্জিন** হিসেবে রূপান্তরিত হয়েছে।

---

## ১. সি# এর বিভিন্ন সংস্করণে \`switch\` এর বিবর্তন

| সংস্করণ | প্রধান সংযোজন |
|---|---|
| **C# 1.0** | ক্লাসিক \`switch\` স্টেটমেন্ট; কোনো ইমপ্লিসিট ফল-থ্রু (fall-through) অনুমোদন করা হতো না। |
| **C# 7.0** | টাইপ প্যাটার্ন ম্যাচিং এবং \`when\` গার্ড ক্লজ সংযুক্ত করা হয়। |
| **C# 8.0** | **সুইচ এক্সপ্রেশন** (\`=>\`), প্রপার্টি প্যাটার্ন, টাপল প্যাটার্ন এবং ডিসকার্ড (\`_\`)। |
| **C# 9.0+** | রিলেশনাল প্যাটার্ন (\`<\`, \`>=\`) এবং লজিক্যাল অপারেটর (\`and\`, \`or\`, \`not\`)। |
| **C# 11+** | লিস্ট প্যাটার্ন (\`[1, 2, ..]\`) এবং বর্ধিত প্রপার্টি প্যাটার্ন। |

---

## ২. অভ্যন্তরীণ কার্যপ্রণালী: জাম্প টেবিল বনাম বাইনারি সার্চ

সি# কম্পাইলার এবং রানটাইম JIT সাধারণ \`if-else\` ল্যাডারের চেয়ে সুইচকে অনেক বেশি অপ্টিমাইজ করে:

| কেসের ধরন | কম্পাইলার কৌশল | সময় জটিলতা |
|---|---|---|
| **ধারাবাহিক পূর্ণসংখ্যা** (\`1, 2, 3, 4, 5\`) | **জাম্প টেবিল** (IL \`switch\` অপকোড ভিত্তিক মেমোরি পয়েন্টার টেবিল) | **$O(1)$** |
| **বিক্ষিপ্ত সংখ্যা** (\`10, 500, 20000\`) | শর্তাধীন জাম্পের সমন্বয়ে গঠিত **বাইনারি সার্চ ট্রি** | **$O(\\log N)$** |
| **স্ট্রিং মান** (\`"apple", "banana"\`) | **স্ট্রিং হ্যাশ টেবিল** (\`GetHashCode\` ভিত্তিক সরাসরি তুলনা) | গড়ে **$O(1)$** |
| **জটিল প্যাটার্ন / \`when\`** | উপর থেকে নিচে ক্রমানুসারে প্যাটার্ন মূল্যায়ন | **$O(N)$** |

> **জাম্প টেবিল কেন দ্রুত?**: জাম্প টেবিল সরাসরি মেমোরি অফসেট হিসাব করে: \`TargetAddress = BaseAddress + (value * PointerSize)\`। কেসের সংখ্যা ৫টি হোক কিংবা ৫০০টি, কোনো ধারাবাহিক লুপ ছাড়াই এটি ধ্রুবক সময়ে ($O(1)$) কাজ সম্পন্ন করে।

---

## ৩. ক্লাসিক \`switch\` স্টেটমেন্ট ও নো-ফল-থ্রু নিয়ম

C বা C++ এ কেসের শেষে \`break\` না দিলে নিচের কেসগুলোতে কোড অনিচ্ছাকৃতভাবে চলতে থাকে (Fall-through)। **সি# এ এটি সম্পূর্ণ নিষিদ্ধ**। প্রতিটি নন-খালি কেস ব্লকের শেষে অবশ্যই \`break\`, \`return\`, \`throw\` অথবা স্পষ্ট জাম্প কমান্ড থাকতে হবে।

\`\`\`csharp
int errorCode = 404;

switch (errorCode)
{
    case 200:
    case 201:
        // একাধিক খালি কেস লেবেল একটি ব্লক শেয়ার করতে পারে
        Console.WriteLine("Request Succeeded");
        break;

    case 400:
        Console.WriteLine("Bad Request");
        break;

    case 404:
        Console.WriteLine("Resource Not Found");
        break;

    case 500:
        Console.WriteLine("Internal Server Error");
        break;

    default:
        Console.WriteLine($"Unhandled HTTP Status: {errorCode}");
        break;
}
\`\`\`

---

## ৪. আধুনিক C# 8+ সুইচ এক্সপ্রেশন

সুইচ এক্সপ্রেশন কোডের জটিলতা কমিয়ে একটি সংক্ষিপ্ত এবং সরাসরি মান প্রদানকারী রূপ দান করে:

\`\`\`csharp
int dayNumber = 3;

string dayName = dayNumber switch
{
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    4 => "Thursday",
    5 => "Friday",
    6 => "Saturday",
    7 => "Sunday",
    _ => "Invalid Day" // ডিসকার্ড প্যাটার্ন 'default' হিসেবে কাজ করে
};

Console.WriteLine($"Day: {dayName}");
\`\`\`

---

## ৫. প্যাটার্ন ম্যাচিংয়ের ব্যবহারিক রূপ

### ক. রিলেশনাল ও লজিক্যাল প্যাটার্ন (C# 9.0+)
\`\`\`csharp
int temperature = 26;

string comfortLevel = temperature switch
{
    < 0                  => "Freezing",
    >= 0 and < 15        => "Cold",
    >= 15 and <= 25      => "Pleasant",
    > 25 and <= 35       => "Warm",
    _                    => "Extremely Hot"
};
\`\`\`

### খ. টাপল / পজিশনাল প্যাটার্ন (একাধিক চলক ম্যাচিং)
\`\`\`csharp
string role = "Admin";
bool hasMfa = true;

string accessLevel = (role, hasMfa) switch
{
    ("Admin", true)   => "Full Root Access",
    ("Admin", false)  => "MFA Required Before Admin Access",
    ("Editor", _)     => "Content Editing Access",
    (_, _)            => "Public Read-Only Access"
};
\`\`\`

### গ. প্রপার্টি প্যাটার্ন
\`\`\`csharp
public record Shipment(string Destination, decimal WeightKg, bool IsFragile);

var pkg = new Shipment("Dhaka", 12.5m, true);

decimal shippingCost = pkg switch
{
    { Destination: "Dhaka", WeightKg: <= 2.0m } => 60m,
    { Destination: "Dhaka", IsFragile: true }   => 150m,
    { Destination: "Chattogram" }              => 180m,
    _                                           => 250m
};
\`\`\`

### ঘ. \`when\` গার্ড ক্লজ
\`\`\`csharp
object input = 42;

string description = input switch
{
    int n when n % 2 == 0 => $"Even integer: {n}",
    int n                 => $"Odd integer: {n}",
    string s when s.Length > 10 => $"Long string ({s.Length} chars)",
    string s              => $"Short string: {s}",
    null                  => "Null value",
    _                     => "Unknown type"
};
\`\`\`

---

## ৬. তুলনামূলক সারণী: স্টেটমেন্ট বনাম এক্সপ্রেশন

| বৈশিষ্ট্য | ক্লাসিক \`switch\` স্টেটমেন্ট | আধুনিক \`switch\` এক্সপ্রেশন |
|---|---|---|
| **কাঠামো** | স্টেটমেন্ট ব্লক | এক্সপ্রেশন (মান প্রদান করে) |
| **সিনট্যাক্স** | \`case value:\` ... \`break;\` | \`pattern => result,\` |
| **ডিফল্ট ব্রাঞ্চ** | \`default:\` | ডিসকার্ড প্যাটার্ন \`_\` |
| **সম্পূর্ণতা (Exhaustiveness)** | ঐচ্ছিক (ম্যাচ না করলে স্কিপ হয়) | **বাধ্যতামূলক** (ম্যাচ না হলে \`SwitchExpressionException\` থ্রো করে) |
| **ব্যবহারের ক্ষেত্র** | জটিল সাইড-ইফেক্ট সম্পাদন | মান গণনা ও তাৎক্ষণিক অ্যাসাইনমেন্টে |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: গাণিতিক ক্যালকুলেটর (Calculator)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #১ — Problem O*

**সমস্যা পরিচিতি**:
একটি গাণিতিক এক্সপ্রেশন $A + B$, $A - B$, $A * B$, অথবা $A / B$ আকারে দেওয়া থাকবে। ফলাফল গণনা করে প্রিন্ট করুন। (ভাগফল হবে পূর্ণসংখ্যার ভাগফল)।

**সীমাবদ্ধতা**:
$1 \\le A, B \\le 10^5$, অপারেটরসমূহ \`+\`, \`-\`, \`*\`, \`/\`।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string input = Console.ReadLine().Trim();

        char op = ' ';
        int opIndex = -1;

        for (int i = 0; i < input.Length; i++)
        {
            char ch = input[i];
            if (ch == '+' || ch == '-' || ch == '*' || ch == '/')
            {
                op = ch;
                opIndex = i;
                break;
            }
        }

        long a = long.Parse(input.Substring(0, opIndex));
        long b = long.Parse(input.Substring(opIndex + 1));

        long result = op switch
        {
            '+' => a + b,
            '-' => a - b,
            '*' => a * b,
            '/' => a / b,
            _   => 0
        };

        Console.WriteLine(result);
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(1)$ — সর্বোচ্চ ১৫ অক্ষরের স্ট্রিং প্রসেসিং ও $O(1)$ সুইচ ডিসপ্যাচ।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ — নির্দিষ্ট ধ্রুবক মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem O: Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/O) | Easy | Character switch, Arithmetic |
| ⚪ | Codeforces Assiut | [Problem P: First digit !](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/P) | Easy | Digit parity, switch / if-else |
| ⚪ | Exercism C# | [Cars, Assemble!](https://exercism.org/tracks/csharp/exercises/cars-assemble) | Easy | Switch expressions, Success rate |
| ⚪ | Exercism C# | [Triangle](https://exercism.org/tracks/csharp/exercises/triangle) | Easy | Pattern matching, Relational patterns |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem O: Calculator",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/O",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["switch", "Operators", "Math"],
        solutionEn: "Extract the arithmetic operator and evaluate with a concise switch expression.",
        solutionBn: "ইনপুট থেকে অপারেটর আলাদা করে সুইচ এক্সপ্রেশনের মাধ্যমে হিসাব সম্পন্ন করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem P: First digit !",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/P",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Conditionals", "Math", "Parity"],
        solutionEn: "Extract the leading digit by dividing by 1000 and switch/branch on parity (EVEN or ODD).",
        solutionBn: "১০০০ দিয়ে ভাগ করে প্রথম অঙ্কটি বের করুন এবং জোড় বা বিজোড় নির্ধারণ করুন।",
      },
      {
        source: "Exercism C#",
        name: "Cars, Assemble!",
        url: "https://exercism.org/tracks/csharp/exercises/cars-assemble",
        difficulty: "EASY",
        company: null,
        tags: ["switch", "Pattern Matching", "Calculations"],
        solutionEn: "Compute production rates based on speed tiers using modern switch expressions with relational patterns.",
        solutionBn: "রিলেশনাল প্যাটার্নযুক্ত সুইচ এক্সপ্রেশন ব্যবহার করে গাড়ির উৎপাদন রেট হিসাব করুন।",
      },
      {
        source: "Exercism C#",
        name: "Triangle",
        url: "https://exercism.org/tracks/csharp/exercises/triangle",
        difficulty: "EASY",
        company: null,
        tags: ["Pattern Matching", "Geometry", "Logic"],
        solutionEn: "Verify triangle inequality and classify equilateral, isosceles, and scalene forms using pattern matching.",
        solutionBn: "ত্রিভুজের বাহুগুলোর অনুপাত পরীক্ষা করে বিভিন্ন ধরন নির্ধারণ করুন।",
      },
    ],
  };
