import type { LocalLesson } from "@/lib/lessons-data";

export const csharpIfElseLesson: LocalLesson = {
    slug: "csharp-if-else",
    titleEn: "if / else Statements",
    titleBn: "ইফ-এলস শর্তাধীন কাঠামো",
    categoryEn: "02. Control Flow",
    categoryBn: "০২. কন্ট্রোল ফ্লো ও শর্তাধীন লজিক",
    categoryDescEn:
      "Decision-making statements, pattern matching switches, iteration loops, and performance implications of loop constructs.",
    categoryDescBn:
      "শর্তাধীন সিদ্ধান্ত গ্রহণ, সুইচ স্টেটমেন্ট, বিভিন্ন ধরনের লুপ এবং পুনরাবৃত্তিমূলক লজিক।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Branching logic with if, else if, else, ternary operator, short-circuit evaluation, pattern matching, and branch prediction.",
    descriptionBn:
      "সি# এ if, else if, else, টার্নারি অপারেটর, শর্ট-সার্কিট মূল্যায়ন, প্যাটার্ন ম্যাচিং এবং ব্রাঞ্চ প্রেডিকশন কৌশল।",
    difficulty: "EASY",
    displayOrder: 1,
    prerequisites: ["csharp-variables", "csharp-operators"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# if / else Statements in C#

Conditional statements direct the flow of execution based on runtime conditions. In C#, control flow statements rely strictly on **boolean expressions** — unlike C, C++, or JavaScript, numbers (\`0\` or \`1\`) and objects cannot be treated implicitly as booleans.

---

## 1. Syntax Fundamentals & Strict Boolean Typing

Every conditional branch in C# evaluates an expression of type \`bool\` (\`true\` or \`false\`).

\`\`\`csharp
int balance = 5000;
int withdrawal = 1200;

// Single-branch if
if (withdrawal <= balance)
{
    balance -= withdrawal;
    Console.WriteLine($"Withdrawal successful! Remaining: {balance}");
}

// Two-branch if-else
if (balance > 10000)
{
    Console.WriteLine("Account Tier: Premium");
}
else
{
    Console.WriteLine("Account Tier: Standard");
}
\`\`\`

> **Strict Typing Rule**: In C#, \`if (balance)\` or \`if (1)\` will not compile. You must write an explicit comparison: \`if (balance > 0)\`. This prevents accidental assignment bugs like \`if (x = 5)\`, which is a syntax error in C# because assignment yields the assigned value, not a boolean.

---

## 2. Multi-Branch Cascades (if - else if - else)

When testing multiple mutually exclusive conditions, use a chained \`else if\` ladder. The runtime evaluates conditions **sequentially from top to bottom** and exits immediately upon finding the first \`true\` branch.

\`\`\`csharp
int score = 85;
string grade;

if (score >= 90)
{
    grade = "A+";
}
else if (score >= 80)
{
    grade = "A";   // Executed for score = 85
}
else if (score >= 70)
{
    grade = "B";
}
else if (score >= 60)
{
    grade = "C";
}
else
{
    grade = "F";
}

Console.WriteLine($"Final Grade: {grade}");
\`\`\`

---

## 3. Short-Circuit Evaluation: Performance & Safety

C# logical operators \`&&\` (AND) and \`||\` (OR) implement **short-circuit evaluation**:

| Operator | Left Operand | Right Operand Evaluated? | Outcome |
|---|---|---|---|
| \`A && B\` | \`false\` | **No** (Short-circuited) | Whole expression is \`false\` |
| \`A && B\` | \`true\` | **Yes** | Depends on \`B\` |
| \`A \|\| B\` | \`true\` | **No** (Short-circuited) | Whole expression is \`true\` |
| \`A \|\| B\` | \`false\` | **Yes** | Depends on \`B\` |

### Null Guard & Defensive Programming
Short-circuiting is critical for avoiding \`NullReferenceException\` and \`IndexOutOfRangeException\`:

\`\`\`csharp
string? username = GetUserFromDatabase();

// Safe: username.Length is NEVER called if username is null
if (username != null && username.Length > 3)
{
    Console.WriteLine($"Valid user: {username}");
}

// Safe: array index is NEVER accessed if index is out of bounds
int[] numbers = { 10, 20, 30 };
int targetIndex = 5;

if (targetIndex >= 0 && targetIndex < numbers.Length && numbers[targetIndex] == 30)
{
    Console.WriteLine("Target found!");
}
\`\`\`

> **Warning on Side Effects**: Avoid putting methods that mutate state inside short-circuited conditions. If \`A\` short-circuits, the right-hand method will silently **not run**, leading to subtle bugs.

---

## 4. Modern Pattern Matching in \`if\` Statements (C# 7.0 - 11+)

C# has transformed conditional branching with expressive pattern matching syntax:

### A. Type Pattern with Declaration
\`\`\`csharp
object data = "Software Engineering";

if (data is string text)
{
    // 'text' is automatically cast and scoped inside this block
    Console.WriteLine($"Text length: {text.Length}");
}
\`\`\`

### B. Null Check Pattern (\`is not null\`)
\`\`\`csharp
string? token = GetAuthToken();

// Clean, readable, and cannot be broken by overloaded '==' operators
if (token is not null)
{
    Console.WriteLine($"Token active: {token}");
}
\`\`\`

### C. Relational & Logical Patterns (C# 9.0+)
\`\`\`csharp
int age = 22;

if (age is >= 18 and <= 65)
{
    Console.WriteLine("Working-age adult");
}

if (age is < 0 or > 120)
{
    Console.WriteLine("Invalid age entered");
}
\`\`\`

### D. Property Patterns
\`\`\`csharp
public record Order(int Id, decimal Total, bool IsPaid);

var order = new Order(101, 1500m, true);

if (order is { IsPaid: true, Total: > 1000m })
{
    Console.WriteLine("Eligible for free express delivery!");
}
\`\`\`

---

## 5. Ternary Conditional Operator (\`? :\`)

The ternary operator \`condition ? trueValue : falseValue\` provides an inline expression for binary choices:

\`\`\`csharp
int temperature = 28;
string advisory = temperature > 30 ? "Hot" : "Comfortable";

// Target-typed conditional expression (C# 9.0+)
// Both branches can return derived classes of a common target type
Shape shape = isCircle ? new Circle(5) : new Rectangle(4, 6);
\`\`\`

### When to Use vs Avoid
- **Use**: Simple variable assignments, string formatting, argument passing.
- **Avoid**: Deeply nested ternaries (e.g., \`a ? b : c ? d : e ? f : g\`). They harm readability and are difficult to debug compared to clean \`if-else\` or \`switch\` statements.

---

## 6. Performance & Hardware: Branch Prediction

Modern CPUs use high-speed pipelines. When the CPU encounters a conditional branch (\`if\`), it cannot wait for memory reads to finish to know which path to take. Instead, it uses a **branch predictor**:
- If the prediction is **correct**, execution continues without delay.
- If the prediction is **wrong**, the CPU must flush its entire pipeline and restart, costing **10 to 20 clock cycles** per misprediction.

\`\`\`csharp
// Ordering branches: Put the statistically most frequent condition FIRST
if (request.IsGetMethod)        // 90% of web traffic is GET
{
    HandleGet(request);
}
else if (request.IsPostMethod)   // 8% is POST
{
    HandlePost(request);
}
else                             // 2% other verbs
{
    HandleOther(request);
}
\`\`\`

---

## 7. Comparison: \`if-else\` vs Ternary vs \`switch\`

| Feature | \`if-else\` Ladder | Ternary Operator (\`? :\`) | \`switch\` Expression |
|---|---|---|---|
| **Nature** | Statement block | Expression (returns value) | Expression (returns value) |
| **Complexity** | Arbitrary complex conditions | Simple binary choice | Pattern matching on a value |
| **Readability** | Good for independent checks | Best for 1-line assignments | Best for 3+ discrete cases |
| **Compiler Optimization** | Sequential evaluation | Inlined jump | Jump table / $O(1)$ dispatch |

---

## 8. Common Pitfalls & Edge Cases

1. **Floating-Point Equality**:
   \`\`\`csharp
   double x = 0.1 + 0.2;
   // Bug: x == 0.3 is FALSE due to IEEE 754 precision!
   if (Math.Abs(x - 0.3) < 1e-9) // Correct way: use epsilon
   {
       Console.WriteLine("Values match within precision.");
   }
   \`\`\`
2. **Dangling Else & Missing Braces**:
   Always use braces \`{}\`, even for single-line statements:
   \`\`\`csharp
   // Risky: misleading indentation
   if (isValid)
       if (hasAccess) Grant();
   else Deny(); // Binds to the INNER if, not the outer one!

   // Safe & unambiguous:
   if (isValid)
   {
       if (hasAccess) { Grant(); }
   }
   else
   {
       Deny();
   }
   \`\`\`

---

## Practical Problem Walkthrough

### Problem: Multiples
*Source: Codeforces Assiut University Training Sheet #1 — Problem J*

**Problem Statement**:
Given two numbers $A$ and $B$. Print \`"Multiples"\` if $A$ is a multiple of $B$ or $B$ is a multiple of $A$. Otherwise, print \`"No Multiples"\`.

**Constraints**:
$1 \\le A, B \\le 10^6$

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string[] tokens = Console.ReadLine().Split(' ');
        int a = int.Parse(tokens[0]);
        int b = int.Parse(tokens[1]);

        // A is a multiple of B if A % B == 0
        // B is a multiple of A if B % A == 0
        if (a % b == 0 || b % a == 0)
        {
            Console.WriteLine("Multiples");
        }
        else
        {
            Console.WriteLine("No Multiples");
        }
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(1)$ — modulo arithmetic and constant-time branching.
- **Space Complexity**: $O(1)$ — constant space for two integer variables.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem I: Welcome for you with Conditions](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/I) | Easy | Basic if-else |
| ⚪ | Codeforces Assiut | [Problem J: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Modulo, Short-circuit OR |
| ⚪ | Codeforces Assiut | [Problem M: Capital or Small or Digit](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/M) | Easy | ASCII range if-else |
| ⚪ | Exercism C# | [Bob](https://exercism.org/tracks/csharp/exercises/bob) | Easy | Chained conditions, String checks |
`,

    contentBn: `# C# এ ইফ-এলস (if / else) শর্তাধীন কাঠামো

শর্তাধীন স্টেটমেন্ট প্রোগ্রামের এক্সিকিউশন নিয়ন্ত্রণ করে। সি# এ শর্তাধীন স্টেটমেন্ট সম্পূর্ণভাবে **বুলিয়ান (\`bool\`) এক্সপ্রেশনের** ওপর নির্ভরশীল। C, C++ বা জাভাস্ক্রিপ্টের মতো সংখ্যা (\`0\` বা \`1\`) অথবা অবজেক্টকে সরাসরি শর্ত হিসেবে গণ্য করা যায় না।

---

## ১. সিনট্যাক্স ভিত্তি ও কঠোর বুলিয়ান টাইপিং

সি# এর প্রতিটি শর্তাধীন ব্রাঞ্চ অবশ্যই একটি মান্য \`bool\` টাইপ (\`true\` বা \`false\`) মূল্যায়ন করে।

\`\`\`csharp
int balance = 5000;
int withdrawal = 1200;

// একক ব্রাঞ্চের if
if (withdrawal <= balance)
{
    balance -= withdrawal;
    Console.WriteLine($"Withdrawal successful! Remaining: {balance}");
}

// দ্বিমুখী ব্রাঞ্চ if-else
if (balance > 10000)
{
    Console.WriteLine("Account Tier: Premium");
}
else
{
    Console.WriteLine("Account Tier: Standard");
}
\`\`\`

> **কঠোর টাইপিং নীতি**: সি# এ \`if (balance)\` বা \`if (1)\` লিখলে কম্পাইল এরর হবে। আপনাকে অবশ্যই স্পষ্ট তুলনা লিখতে হবে: \`if (balance > 0)\`। এর ফলে \`if (x = 5)\` এর মতো ভুল এসাইনমেন্ট জনিত বাগ কম্পাইলারেই ধরা পড়ে।

---

## ২. বহু-শাখা কাঠামো (if - else if - else ladder)

একাধিক শর্ত ক্রমানুসারে পরীক্ষা করতে \`else if\` ল্যাডার ব্যবহৃত হয়। কম্পাইলার উপর থেকে নিচে শর্তগুলো **ধারাবাহিকভাবে মূল্যায়ন** করে এবং প্রথম সত্য শর্তটি কার্যকর করার পর পুরো ল্যাডার থেকে বেরিয়ে আসে।

\`\`\`csharp
int score = 85;
string grade;

if (score >= 90)
{
    grade = "A+";
}
else if (score >= 80)
{
    grade = "A";   // score = 85 এর জন্য এটি কার্যকর হবে
}
else if (score >= 70)
{
    grade = "B";
}
else if (score >= 60)
{
    grade = "C";
}
else
{
    grade = "F";
}

Console.WriteLine($"Final Grade: {grade}");
\`\`\`

---

## ৩. শর্ট-সার্কিট মূল্যায়ন (Short-Circuit Evaluation)

সি# এর লজিক্যাল অপারেটর \`&&\` (AND) এবং \`||\` (OR) শর্ট-সার্কিট নীতি মেনে চলে:

| অপারেটর | প্রথম শর্ত (Left) | দ্বিতীয় শর্ত (Right) মূল্যায়িত হবে? | সামগ্রিক ফলাফল |
|---|---|---|---|
| \`A && B\` | \`false\` | **না** (Short-circuited) | ফলাফল সরাসরি \`false\` |
| \`A && B\` | \`true\` | **হ্যাঁ** | \`B\` এর ওপর নির্ভর করবে |
| \`A \|\| B\` | \`true\` | **না** (Short-circuited) | ফলাফল সরাসরি \`true\` |
| \`A \|\| B\` | \`false\` | **হ্যাঁ** | \`B\` এর ওপর নির্ভর করবে |

### নাল গার্ড ও নিরাপদ কোডিং প্যাটার্ন
শর্ট-সার্কিটের মাধ্যমে রানটাইমে \`NullReferenceException\` এবং \`IndexOutOfRangeException\` রোধ করা যায়:

\`\`\`csharp
string? username = GetUserFromDatabase();

// নিরাপদ: username যদি null হয়, তবে username.Length কখনোই কল হবে না
if (username != null && username.Length > 3)
{
    Console.WriteLine($"Valid user: {username}");
}

// নিরাপদ: ইনডেক্স সীমার বাইরে থাকলে অ্যারে এক্সেস হবে না
int[] numbers = { 10, 20, 30 };
int targetIndex = 5;

if (targetIndex >= 0 && targetIndex < numbers.Length && numbers[targetIndex] == 30)
{
    Console.WriteLine("Target found!");
}
\`\`\`

---

## ৪. আধুনিক প্যাটার্ন ম্যাচিং (C# 7.0 - 11+)

আধুনিক সি# এ \`if\` স্টেটমেন্টের ভেতর শক্তিশালী প্যাটার্ন ম্যাচিং যুক্ত করা হয়েছে:

### ক. টাইপ প্যাটার্ন ও তাৎক্ষণিক চলক ডিক্লারেশন
\`\`\`csharp
object data = "Software Engineering";

if (data is string text)
{
    // 'text' স্বয়ংক্রিয়ভাবে কাস্ট হয়ে এই ব্লকের মধ্যে ব্যবহারের জন্য তৈরি
    Console.WriteLine($"Text length: {text.Length}");
}
\`\`\`

### খ. নাল চেক প্যাটার্ন (\`is not null\`)
\`\`\`csharp
string? token = GetAuthToken();

// অত্যন্ত স্পষ্ট এবং ওভারলোডেড '==' অপারেটর দ্বারা প্রভাবিত হয় না
if (token is not null)
{
    Console.WriteLine($"Token active: {token}");
}
\`\`\`

### গ. রিলেশনাল ও লজিক্যাল প্যাটার্ন (C# 9.0+)
\`\`\`csharp
int age = 22;

if (age is >= 18 and <= 65)
{
    Console.WriteLine("Working-age adult");
}

if (age is < 0 or > 120)
{
    Console.WriteLine("Invalid age entered");
}
\`\`\`

### ঘ. প্রপার্টি প্যাটার্ন
\`\`\`csharp
public record Order(int Id, decimal Total, bool IsPaid);

var order = new Order(101, 1500m, true);

if (order is { IsPaid: true, Total: > 1000m })
{
    Console.WriteLine("Eligible for free express delivery!");
}
\`\`\`

---

## ৫. টার্নারি শর্তাধীন অপারেটর (\`? :\`)

সহজ দ্বি-মুখী সিদ্ধান্তের মান সরাসরি অ্যাসাইন করার জন্য টার্নারি অপারেটর ব্যবহৃত হয়:

\`\`\`csharp
int temperature = 28;
string weatherDescription = temperature > 30 ? "Hot" : "Comfortable";
\`\`\`

- **কখন ব্যবহার করবেন**: সাধারণ মান নির্ধারণ, স্ট্রিং ইন্টারপোলেশন বা মেথডে আর্গুমেন্ট পাঠানোর ক্ষেত্রে।
- **কখন এড়িয়ে চলবেন**: একাধিক নেস্টেড টার্নারি কোডের পাঠযোগ্যতা নষ্ট করে, সেক্ষেত্রে সাধারণ \`if-else\` বা \`switch\` ব্যবহার করাই শ্রেয়।

---

## ৬. হার্ডওয়্যার ও ব্রাঞ্চ প্রেডিকশন (Branch Prediction)

আধুনিক সিপিইউ উচ্চ কার্যক্ষমতার জন্য পাইপলাইনিং ব্যবহার করে। যখন সিপিইউ কোনো শর্তযুক্ত ব্রাঞ্চ (\`if\`) পায়, তখন মেমোরি থেকে ডেটা আসার অপেক্ষা না করে এটি আগে থেকেই ভবিষ্যৎবাণী করে কোন পথে কোড যাবে।
- ভবিষ্যৎবাণী **সঠিক** হলে কোনো বিরতি ছাড়াই এক্সিকিউশন চলতে থাকে।
- ভবিষ্যৎবাণী **ভুল** হলে পাইপলাইনের সমস্ত অপূর্ণ নির্দেশ বাতিল করতে হয়, যা প্রতি মিসপ্রেডিকশনে **১০ থেকে ২০ ক্লক সাইকেল** সময় অপচয় করে।

\`\`\`csharp
// পরিসংখ্যানগতভাবে যে শর্তটি সবচেয়ে বেশি সত্য হয়, সেটিকে প্রথমে লিখুন
if (request.IsGetMethod)        // সাধারণ ওয়েব ট্রাফিকের ৯০% হলো GET
{
    HandleGet(request);
}
else if (request.IsPostMethod)   // ৮% হলো POST
{
    HandlePost(request);
}
else                             // ২% অন্যান্য মেথড
{
    HandleOther(request);
}
\`\`\`

---

## ৭. তুলনামূলক বিশ্লেষণ: \`if-else\` বনাম টার্নারি বনাম \`switch\`

| বৈশিষ্ট্য | \`if-else\` ল্যাডার | টার্নারি অপারেটর (\`? :\`) | \`switch\` এক্সপ্রেশন |
|---|---|---|---|
| **প্রকার** | স্টেটমেন্ট ব্লক | এক্সপ্রেশন (মান রিটার্ন করে) | এক্সপ্রেশন (মান রিটার্ন করে) |
| **জটিলতা** | যেকোনো স্বাধীন জটিল শর্ত | সাধারণ দ্বিমুখী পছন্দ | প্যাটার্ন ম্যাচিং ও ডিসক্রিট কেস |
| **পাঠযোগ্যতা** | ভিন্ন ভিন্ন শর্তে ভালো | ১-লাইনের অ্যাসাইনমেন্টে সেরা | ৩ বা ততোধিক মানের ক্ষেত্রে সেরা |
| **অপ্টিমাইজেশন** | ক্রমানুসারে মূল্যায়ন | ইনলাইন জাম্প | জাম্প টেবিল / $O(1)$ ডিসপ্যাচ |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: গুণিতক যাচাই (Multiples)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #১ — Problem J*

**সমস্যা পরিচিতি**:
দুটি পূর্ণসংখ্যা $A$ এবং $B$ দেওয়া থাকবে। যদি $A$ সংখ্যাটি $B$ এর গুণিতক হয় অথবা $B$ সংখ্যাটি $A$ এর গুণিতক হয়, তবে \`"Multiples"\` প্রিন্ট করুন। অন্যথায় \`"No Multiples"\` প্রিন্ট করুন।

**সীমাবদ্ধতা**:
$1 \\le A, B \\le 10^6$

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string[] tokens = Console.ReadLine().Split(' ');
        int a = int.Parse(tokens[0]);
        int b = int.Parse(tokens[1]);

        // A % B == 0 হলে A হলো B এর গুণিতক
        // B % A == 0 হলে B হলো A এর গুণিতক
        if (a % b == 0 || b % a == 0)
        {
            Console.WriteLine("Multiples");
        }
        else
        {
            Console.WriteLine("No Multiples");
        }
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(1)$ — মডুলাস অপারেশন এবং ধ্রুবক সময় শর্ত পরীক্ষা।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ — মাত্র দুটি পূর্ণসংখ্যার জন্য ধ্রুবক মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem I: Welcome for you with Conditions](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/I) | Easy | Basic if-else |
| ⚪ | Codeforces Assiut | [Problem J: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Modulo, Short-circuit OR |
| ⚪ | Codeforces Assiut | [Problem M: Capital or Small or Digit](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/M) | Easy | ASCII range if-else |
| ⚪ | Exercism C# | [Bob](https://exercism.org/tracks/csharp/exercises/bob) | Easy | Chained conditions, String checks |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem I: Welcome for you with Conditions",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/I",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Conditionals", "Basics"],
        solutionEn: "Parse both integers and check if A >= B using a standard if-else statement.",
        solutionBn: "ইনপুট থেকে সংখ্যা দুটি পার্স করে A >= B শর্তের উপর ভিত্তি করে Yes বা No প্রিন্ট করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem J: Multiples",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Conditionals", "Modulo", "Short-circuit"],
        solutionEn: "Use modulo arithmetic: check if (A % B == 0 || B % A == 0) with short-circuit evaluation.",
        solutionBn: "মডুলাস অপারেটর ও শর্ট-সার্কিট OR দিয়ে পরীক্ষা করুন (A % B == 0 || B % A == 0) সত্য কি না।",
      },
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem M: Capital or Small or Digit",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/M",
        difficulty: "EASY",
        company: "Therap",
        tags: ["Conditionals", "ASCII", "char"],
        solutionEn: "Check character ASCII bounds: digits ('0'-'9'), uppercase ('A'-'Z'), or lowercase ('a'-'z').",
        solutionBn: "অক্ষরের ASCII রেঞ্জ পরীক্ষা করে সংখ্যা, বড় হাতের বা ছোট হাতের অক্ষর নির্ধারণ করুন।",
      },
      {
        source: "Exercism C#",
        name: "Bob",
        url: "https://exercism.org/tracks/csharp/exercises/bob",
        difficulty: "EASY",
        company: null,
        tags: ["Conditionals", "Strings", "Pattern Matching"],
        solutionEn: "Examine silence, yelling, questions, and yelled questions using structured if-else ladder.",
        solutionBn: "স্ট্রিংয়ের বিভিন্ন শর্তানুযায়ী সুনির্দিষ্ট উত্তর তৈরি করতে if-else ল্যাডার ব্যবহার করুন।",
      },
    ],
  };
