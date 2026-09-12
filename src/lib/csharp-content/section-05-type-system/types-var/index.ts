import type { LocalLesson } from "@/lib/lessons-data";

export const typesVarLesson: LocalLesson = {
  slug: "types-var",
  titleEn: "var (Implicit Typing)",
  titleBn: "ভার (var) ও কম্পাইল-টাইম টাইপ ইনফারেন্স",
  categoryEn: "05. Type System",
  categoryBn: "০৫. টাইপ সিস্টেম ও মেমোরি মডেল",
  categoryDescEn:
    "The Common Type System (CTS) in .NET: value types vs reference types, boxing/unboxing overhead, var vs dynamic vs object.",
  categoryDescBn:
    ".NET এর কমন টাইপ সিস্টেম (CTS): ভ্যালু টাইপ বনাম রেফারেন্স টাইপ, বক্সিং/আনবক্সিং মেমোরি ওভারহেড এবং var/dynamic/object।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Compile-time type inference, static typing guarantee, anonymous types, IL bytecode identity, and var vs object vs dynamic.",
  descriptionBn:
    "কম্পাইল-টাইম টাইপ ইনফারেন্স, স্ট্যাটিক টাইপিং নিশ্চয়তা, অ্যানোনিমাস টাইপ, IL বাইটকোড সমতা এবং var বনাম object বনাম dynamic।",
  difficulty: "EASY",
  displayOrder: 3,
  prerequisites: ["types-value-types", "types-reference-types"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# var (Implicit Typing) in C#

Introduced in C# 3.0 alongside LINQ, the \`var\` keyword instructs the C# compiler to **infer the exact data type** of a local variable from the initialization expression on the right-hand side.

Despite its syntactic brevity, \`var\` is **not** dynamic typing. C# remains 100% statically and strongly typed.

---

## Compile-Time Inference: How the Compiler Sees \`var\`

When you compile code using \`var\`, the compiler replaces \`var\` with the concrete type at compile time:

\`\`\`csharp
var count = 42;                 // Compiler resolves: int count = 42;
var message = "Hello, Dhaka!"; // Compiler resolves: string message = "Hello, Dhaka!";
var balance = 1500.50m;         // Compiler resolves: decimal balance = 1500.50m;
\`\`\`

### Intermediate Language (IL) Equivalence
Examining the compiled CIL (Common Intermediate Language) demonstrates zero runtime difference:

\`\`\`text
// For: int x = 10;
IL_0001: ldc.i4.s 10
IL_0003: stloc.0

// For: var x = 10;
IL_0001: ldc.i4.s 10
IL_0003: stloc.0
\`\`\`

Both compile to the **exact same instructions**. There is **zero runtime performance penalty, zero boxing, and zero reflection overhead**.

---

## Strict Rules & Constraints for \`var\`

Because the compiler must deduce the type unambiguously during compilation, \`var\` enforces strict boundaries:

### 1. Mandatory Immediate Initialization
\`\`\`csharp
var total;           // ❌ Compile Error CS0818: Implicitly-typed variables must be initialized
var total = 100;     // ✅ Valid
\`\`\`

### 2. Cannot Initialize with \`null\` Alone
\`\`\`csharp
var customer = null; // ❌ Compile Error CS0815: Cannot assign <null> to an implicitly-typed variable
var customer = (Customer?)null; // ✅ Valid (explicit cast provides type context)
\`\`\`

### 3. Local Scope Only
The \`var\` keyword is restricted to **local variables inside method bodies, loops, and \`using\` statements**:
- **Cannot** be used for class or struct fields (\`public var Total = 0; // ❌\`).
- **Cannot** be used for method parameter types (\`public void Process(var item) // ❌\`).
- **Cannot** be used for method return types (\`public var GetResults() // ❌\`).
- **Cannot** be used as property types.

---

## Where \`var\` is Mandatory: Anonymous Types & LINQ

Without \`var\`, anonymous types would be unusable in C# because the compiler generates an unutterable internal type name:

\`\`\`csharp
// The compiler generates a internal class like '<>f__AnonymousType0<string, int>'
var devProfile = new 
{ 
    Name = "Nabil", 
    Rank = 1, 
    IsActive = true 
};

Console.WriteLine($"{devProfile.Name} is Rank {devProfile.Rank}");

// LINQ Projection with anonymous types:
var topStudents = students
    .Where(s => s.Gpa >= 3.8)
    .Select(s => new { s.Id, s.FullName });
\`\`\`

---

## Architectural Comparison: \`var\` vs \`object\` vs \`dynamic\`

| Feature | \`var\` | \`object\` | \`dynamic\` |
|---|---|---|---|
| **Type Resolution Time** | **Compile Time** (Static) | **Compile Time** (Static root) | **Runtime** (via DLR) |
| **Type Safety** | 100% Statically checked | 100% Statically checked | Bypasses compile checks; errors at runtime |
| **Runtime Performance** | Maximum ($O(1)$ native IL) | Standard reference; boxes value types | Slower due to CallSite reflection cache |
| **Reassign to Different Type** | **No** (Compile error) | **Yes** (Holds any reference) | **Yes** (Re-binds at runtime) |
| **IntelliSense Support** | Full member autocompletion | Only \`ToString\`, \`Equals\`, etc. | Disabled; compiler allows any member |

\`\`\`csharp
var x = 10;
// x = "Ten";      // ❌ Compile Error: Cannot implicitly convert string to int

object y = 10;     // Boxes int into heap object
y = "Ten";         // ✅ Allowed (replaces pointer to string)

dynamic z = 10;    // Runtime binding
z = "Ten";         // ✅ Allowed
Console.WriteLine(z.Length); // Resolved dynamically at runtime
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 — Problem K (Max and Min)
*Given three numbers $A$, $B$, and $C$. Find the minimum and the maximum number using clean, type-inferred C#.*

#### Problem Analysis
- Input: Three 32-bit signed integers separated by space.
- Logic: Find $\\min(A, B, C)$ and $\\max(A, B, C)$.
- Code Structure: Leverage \`var\` for clean parsing and mathematical evaluation.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class MaxAndMinSolution
{
    public static void Main()
    {
        string? inputLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(inputLine)) return;

        var tokens = inputLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        var a = int.Parse(tokens[0], CultureInfo.InvariantCulture);
        var b = int.Parse(tokens[1], CultureInfo.InvariantCulture);
        var c = int.Parse(tokens[2], CultureInfo.InvariantCulture);

        var minimum = Math.Min(a, Math.Min(b, c));
        var maximum = Math.Max(a, Math.Max(b, c));

        Console.WriteLine($"{minimum} {maximum}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$ — constant number of comparisons.
- **Space Complexity**: $\\mathcal{O}(1)$ — fixed primitive values allocated on the stack with zero heap allocation overhead.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem K: Max and Min](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K) | Easy | var Inference, Math Functions |
| ⚪ | Codeforces Assiut | [Problem F: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | Implicit Typing, Modulo Arithmetic |
| ⚪ | Exercism C# | [Roll the Dice](https://exercism.org/tracks/csharp/exercises/roll-the-dice) | Easy | var with Random, Primitive State |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | State Machines, Clean Type Inference |
`,

  contentBn: `# C# এ ভার (var) ও কম্পাইল-টাইম টাইপ ইনফারেন্স

সি# ৩.০ এ LINQ এর সাথে যুক্ত হওয়া \`var\` কি-ওয়ার্ড মূলত সি# কম্পাইলারকে নির্দেশ দেয় ডানপাশের অ্যাসাইনমেন্ট এক্সপ্রেশন দেখে লোকাল ভ্যারিয়েবলের **সঠিক ডেটা টাইপ নির্ধারণ (Infer)** করে নিতে।

\`var\` ব্যবহারের অর্থ কখনোই ডায়নামিক টাইপিং নয়; সি# শতভাগ স্ট্যাটিক্যালি এবং স্ট্রংলি টাইপড (Statically & Strongly Typed) ভাষা হিসেবেই কাজ করে।

---

## কম্পাইল-টাইম ইনফারেন্স: কম্পাইলার কীভাবে \`var\` মূল্যায়ন করে

কোড কম্পাইল হওয়ার সময় কম্পাইলার নিজে থেকে \`var\`-কে সুনির্দিষ্ট টাইপ দিয়ে প্রতিস্থাপন করে:

\`\`\`csharp
var count = 42;                 // কম্পাইলার এটিকে 'int count = 42;' হিসেবে রূপান্তর করে
var message = "Hello, Dhaka!"; // কম্পাইলার এটিকে 'string message = "Hello, Dhaka!";' হিসেবে রূপান্তর করে
var balance = 1500.50m;         // কম্পাইলার এটিকে 'decimal balance = 1500.50m;' হিসেবে রূপান্তর করে
\`\`\`

### ইন্টারমিডিয়েট ল্যাঙ্গুয়েজ (IL) সমতা
কম্পাইল করা CIL (Common Intermediate Language) পর্যবেক্ষণ করলে দেখা যায় explicit টাইপ ও \`var\` এর মধ্যে বিন্দুমাত্র পার্থক্য নেই:

\`\`\`text
// int x = 10; এর জন্য
IL_0001: ldc.i4.s 10
IL_0003: stloc.0

// var x = 10; এর জন্য
IL_0001: ldc.i4.s 10
IL_0003: stloc.0
\`\`\`

উভয়ের ক্ষেত্রে **হুবহু একই মেশিন ইনস্ট্রাকশন** তৈরি হয়। ফলে \`var\` ব্যবহারের কারণে কোনো রানটাইম পারফরম্যান্স ড্রপ, বক্সিং বা রিফ্লেকশন ওভারহেড থাকে না।

---

## \`var\` ব্যবহারের কঠোর নিয়মাবলি

কম্পাইলার যাতে সঠিকভাবে টাইপ বুঝতে পারে সেজন্য \`var\` ব্যবহারে কিছু নির্দিষ্ট সীমাবদ্ধতা রয়েছে:

### ১. ঘোষণার সাথে সাথেই মান প্রদান বাধ্যতামূলক
\`\`\`csharp
var total;           // ❌ কম্পাইল এরর CS0818: var ভ্যারিয়েবল ইনিশিয়ালাইজ করা বাধ্যতামূলক
var total = 100;     // ✅ বৈধ
\`\`\`

### ২. সরাসরি শুধু \`null\` অ্যাসাইন করা যায় না
\`\`\`csharp
var customer = null; // ❌ কম্পাইল এরর CS0815: নির্দিষ্ট টাইপ ছাড়া null দিয়ে ইনফার করা অসম্ভব
var customer = (Customer?)null; // ✅ বৈধ (কাস্ট করার মাধ্যমে টাইপ পরিষ্কার)
\`\`\`

### ৩. শুধুমাত্র লোকাল ভ্যারিয়েবলে প্রযোজ্য
\`var\` কি-ওয়ার্ড কেবল মেথডের ভেতর, লুপে এবং \`using\` স্টেটমেন্টে ব্যবহারযোগ্য:
- ক্লাসের ফিল্ড বা প্রোপার্টিতে ব্যবহার করা যায় না (\`public var Count = 0; // ❌\`)।
- মেথডের প্যারামিটার হিসেবে ব্যবহার করা যায় না (\`public void Process(var item) // ❌\`)।
- মেথডের রিটার্ন টাইপ হিসেবে ব্যবহার করা যায় না (\`public var GetResults() // ❌\`)।

---

## যেখানে \`var\` ব্যবহার বাধ্যতামূলক: অ্যানোনিমাস টাইপ ও LINQ

অ্যানোনিমাস টাইপ ব্যবহারের ক্ষেত্রে সি# এ \`var\` ব্যবহার করা অপরিহার্য, কারণ কম্পাইলার ব্যাকগ্রাউন্ডে এমন একটি অবজেক্ট তৈরি করে যার নির্দিষ্ট কোনো নাম কোডে লেখা সম্ভব নয়:

\`\`\`csharp
// কম্পাইলার ব্যাকগ্রাউন্ডে একটি জেনেরিক অভ্যন্তরীণ ক্লাস তৈরি করে
var devProfile = new 
{ 
    Name = "Nabil", 
    Rank = 1, 
    IsActive = true 
};

Console.WriteLine($"{devProfile.Name} is Rank {devProfile.Rank}");

// LINQ প্রজেকশনে অ্যানোনিমাস টাইপ:
var topStudents = students
    .Where(s => s.Gpa >= 3.8)
    .Select(s => new { s.Id, s.FullName });
\`\`\`

---

## আর্কিটেকচারাল তুলনা: \`var\` বনাম \`object\` বনাম \`dynamic\`

| বৈশিষ্ট্য | \`var\` | \`object\` | \`dynamic\` |
|---|---|---|---|
| **টাইপ নির্ধারণের সময়** | **কম্পাইল টাইম** (Static) | **কম্পাইল টাইম** (Root Base) | **রানটাইম** (DLR এর মাধ্যমে) |
| **টাইপ সেফটি** | ১০০% কম্পাইল-টাইম নিরাপদ | ১০০% কম্পাইল-টাইম নিরাপদ | কম্পাইল চেক বাইপাস করে; রানটাইমে এরর দিতে পারে |
| **রানটাইম পারফরম্যান্স** | সর্বোচ্চ ($O(1)$ নেটিভ IL) | সাধারণ রেফারেন্স; ভ্যালু টাইপে বক্সিং হয় | DLR ক্যাশিং ও ডিসপ্যাচের কারণে ধীরগতির |
| **ভিন্ন টাইপ পুনর্নির্ধারণ** | **অসম্ভব** (কম্পাইল এরর) | **সম্ভব** (যেকোনো রেফারেন্স ধারণ করে) | **সম্ভব** (রানটাইমে রি-বাইন্ড হয়) |
| **IntelliSense সুবিধা** | সম্পূর্ণ অটো-কমপ্লিশন পাওয়া যায় | শুধু \`ToString\`, \`Equals\` ইত্যাদি দেখায় | কোনো অটো-কমপ্লিশন থাকে না |

\`\`\`csharp
var x = 10;
// x = "Ten";      // ❌ কম্পাইল এরর: int টাইপে string দেওয়া সম্ভব নয়

object y = 10;     // int হিপে বক্সড হলো
y = "Ten";         // ✅ বৈধ (নতুন স্ট্রিং পয়েন্টার সেট হলো)

dynamic z = 10;    // রানটাইম বাইন্ডিং
z = "Ten";         // ✅ বৈধ
Console.WriteLine(z.Length); // রানটাইমে দৈর্ঘ্য পাওয়া যাবে
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #১ — Problem K (Max and Min)
*তিনটি পূর্ণসংখ্যা $A$, $B$, এবং $C$ ইনপুট নিয়ে এদের মধ্যে সর্বনিম্ন ও সর্বোচ্চ সংখ্যা দুটি প্রিন্ট করতে হবে।*

#### সমাধান বিশ্লেষণ
- তিনটি সংখ্যা পার্স করে \`Math.Min\` এবং \`Math.Max\` ব্যবহার করে সর্বনিম্ন ও সর্বোচ্চ নির্ণয় করা হয়েছে।
- কোডের পরিচ্ছন্নতা বজায় রাখতে এবং রিডাবিলিটি বৃদ্ধি করতে \`var\` কি-ওয়ার্ড ব্যবহার করা হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class MaxAndMinSolution
{
    public static void Main()
    {
        string? inputLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(inputLine)) return;

        var tokens = inputLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        var a = int.Parse(tokens[0], CultureInfo.InvariantCulture);
        var b = int.Parse(tokens[1], CultureInfo.InvariantCulture);
        var c = int.Parse(tokens[2], CultureInfo.InvariantCulture);

        var minimum = Math.Min(a, Math.Min(b, c));
        var maximum = Math.Max(a, Math.Max(b, c));

        Console.WriteLine($"{minimum} {maximum}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ — স্থির সংখ্যক তুলনা সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ — লোকাল প্রিমিটিভ চলক স্ট্যাকে সংরক্ষিত হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem K: Max and Min](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K) | Easy | var Inference, Math Functions |
| ⚪ | Codeforces Assiut | [Problem F: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | Implicit Typing, Modulo Arithmetic |
| ⚪ | Exercism C# | [Roll the Dice](https://exercism.org/tracks/csharp/exercises/roll-the-dice) | Easy | var with Random, Primitive State |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | State Machines, Clean Type Inference |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #1",
      name: "Problem K: Max and Min",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["var", "Math", "MinMax"],
      solutionEn: "Apply var inference on parsed integer inputs and compute minimum and maximum values using Math library.",
      solutionBn: "পার্স করা পূর্ণসংখ্যায় var ইনফারেন্স এবং Math লাইব্রেরি ব্যবহার করে ক্ষুদ্রতম ও বৃহত্তম মান নির্ণয় করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #1",
      name: "Problem F: Digits Summation",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["var", "Modulo", "Math"],
      solutionEn: "Use var for concise local variable typing while extracting and summing the last digits with modulo 10.",
      solutionBn: "মডুলো ১০ অপারেশন করে শেষ অঙ্কগুলোর যোগফল বের করার সময় var দিয়ে কোড পরিচ্ছন্ন রাখুন।",
    },
    {
      source: "Exercism C#",
      name: "Roll the Dice",
      url: "https://exercism.org/tracks/csharp/exercises/roll-the-dice",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["var", "Random", "Basics"],
      solutionEn: "Use var to capture random instances and dice roll outcome values with zero runtime overhead.",
      solutionBn: "জিরো রানটাইম ওভারহেডে র‍্যান্ডম ইনস্ট্যান্স এবং ডাইস রোলের মান ক্যাপচার করতে var ব্যবহার করুন।",
    },
    {
      source: "Exercism C#",
      name: "Robot Simulator",
      url: "https://exercism.org/tracks/csharp/exercises/robot-simulator",
      difficulty: "MEDIUM",
      company: "Kaz Software",
      tags: ["var", "Enums", "State Machine"],
      solutionEn: "Maintain directional coordinates and grid movement instructions using concise implicit local variable types.",
      solutionBn: "রোবটের দিক ও গ্রিড মুভমেন্ট নির্দেশনায় পরিচ্ছন্ন কোড নিশ্চিত করতে var ব্যবহার করুন।",
    },
  ],
};
