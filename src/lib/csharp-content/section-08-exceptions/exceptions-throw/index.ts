import type { LocalLesson } from "@/lib/lessons-data";

export const exceptionsThrowLesson: LocalLesson = {
  slug: "exceptions-throw",
  titleEn: "throw vs throw ex",
  titleBn: "থ্রো বনাম থ্রো এক্স (throw vs throw ex) ও স্ট্যাক ট্রেস",
  categoryEn: "08. Exception Handling",
  categoryBn: "০৮. এক্সেপশন ও ত্রুটি হ্যান্ডলিং",
  categoryDescEn:
    "Structured error handling in .NET: try/catch/finally blocks, stack trace preservation, custom domain exceptions, and exception filters.",
  categoryDescBn:
    ".NET এ ত্রুটি হ্যান্ডলিং: ট্রাই-ক্যাচ-ফাইনালি ব্লক, স্ট্যাক ট্রেস সংরক্ষণ (throw vs throw ex), কাস্টম এক্সেপশন ও এক্সেপশন ফিল্টার।",
  categoryPriority: "CORE",
  descriptionEn:
    "Stack trace preservation mechanics, the destructive consequences of throw ex, ExceptionDispatchInfo, and modern throw expressions.",
  descriptionBn:
    "স্ট্যাক ট্রেস মেমোরি মেকানিজম, throw ex ব্যবহারের মারাত্মক কুফল, ExceptionDispatchInfo এবং আধুনিক থ্রো এক্সপ্রেশন।",
  difficulty: "MEDIUM",
  displayOrder: 2,
  prerequisites: ["exceptions-try-catch-finally"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# throw vs throw ex in C#

One of the most famous and critical technical interview questions at top .NET engineering firms (Enosis Solutions, Therap Services, Brain Station 23) revolves around rethrowing caught exceptions:

> **What is the difference between \`throw;\` and \`throw ex;\`?**

Knowing the low-level stack frame implications makes the difference between easily diagnosing a production crash or being left with zero clues.

---

## Stack Trace Preservation: The 3 Re-throwing Patterns

\`\`\`
Method C() throws InvalidOperationException (Line 42)
  └── Method B() catches it
        │
        ├── 1. throw ex; ────────► STACK TRACE RESET! Origin becomes Line 78 of B().
        │                          Line 42 of C() is PERMANENTLY LOST!
        │
        ├── 2. throw; ───────────► PRISTINE! Line 42 of C() is preserved at the root.
        │
        └── 3. throw new AppEx(.., ex); ──► WRAPPED! C() preserved inside InnerException.
\`\`\`

### 1. \`throw ex;\` (Catastrophic Anti-Pattern)
When you write \`throw ex;\`, the CLR treats this as a brand-new throw statement:
- The CLR **wipes out the original stack trace** and resets the exception origin to the current line!
- If the bug occurred 10 levels deep inside a database driver, your error logs will only point to your catch block. The true line number where the failure originated is erased forever.

### 2. \`throw;\` (Gold Standard)
A bare, parameterless \`throw;\` instructs the CLR to re-dispatch the current active exception:
- **Preserves the entire original stack trace** down to the exact source file and line number.

### 3. \`throw new DomainException("Context", ex);\` (Exception Wrapping)
Wraps the lower-level error inside a higher-level business domain exception:
- Preserves the technical stack trace inside the \`InnerException\` property while presenting a clean error message to callers.

---

## Asynchronous Stack Preservation: \`ExceptionDispatchInfo\`

In asynchronous programming, exceptions thrown on worker threads must often be rethrown on the caller's synchronization context without destroying the original stack:

\`\`\`csharp
using System.Runtime.ExceptionServices;

ExceptionDispatchInfo? capturedError = null;

try
{
    ExecuteBackgroundWorker();
}
catch (Exception ex)
{
    // Captures the exception and its full original stack trace
    capturedError = ExceptionDispatchInfo.Capture(ex);
}

// Later, on another thread or after task completion:
capturedError?.Throw(); // Rethrows with original stack trace intact!
\`\`\`

---

## Modern C# Throw Expressions (C# 7.0+)

In modern C#, \`throw\` is an **expression**, not just a statement. This allows concise validation in expression-bodied members, ternary operators, and null-coalescing operations:

\`\`\`csharp
public class OrderService
{
    private readonly ILogger _logger;

    // 1. Guarding constructor parameters with null-coalescing throw
    public OrderService(ILogger logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    // 2. Throw expression in ternary operator
    public decimal CalculateTax(decimal amount) =>
        amount >= 0 ? amount * 0.15m : throw new ArgumentOutOfRangeException(nameof(amount));

    // 3. Throw expression in switch expression
    public string GetStatusLabel(int statusCode) => statusCode switch
    {
        200 => "OK",
        404 => "Not Found",
        _   => throw new NotSupportedException($"Status {statusCode} is unsupported.")
    };
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 — Problem Q (Coordinates of a Point)
*Given two coordinates $X$ and $Y$. Determine which quadrant the point lies in ($Q1, Q2, Q3, Q4$) or whether it lies on the Origin or Axis, validating inputs using guarded throw expressions.*

#### Problem Analysis
- Input: Two floating-point numbers $X$ and $Y$.
- Output: Point location (\`Origem\`, \`Eixo X\`, \`Eixo Y\`, \`Q1\`, \`Q2\`, \`Q3\`, \`Q4\`).
- We can structure the decision engine with clean throw validation for unexpected states.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class CoordinatesSolution
{
    public static string ClassifyPoint(double x, double y) => (x, y) switch
    {
        (0.0, 0.0) => "Origem",
        (0.0, _)   => "Eixo Y",
        (_, 0.0)   => "Eixo X",
        (> 0, > 0) => "Q1",
        (< 0, > 0) => "Q2",
        (< 0, < 0) => "Q3",
        (> 0, < 0) => "Q4",
        _          => throw new InvalidOperationException("Invalid floating-point state.")
    };

    public static void Main()
    {
        try
        {
            string? line = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(line)) return;

            string[] tokens = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (tokens.Length < 2)
            {
                throw new ArgumentException("Two coordinate tokens required.");
            }

            double x = double.Parse(tokens[0], CultureInfo.InvariantCulture);
            double y = double.Parse(tokens[1], CultureInfo.InvariantCulture);

            Console.WriteLine(ClassifyPoint(x, y));
        }
        catch (Exception)
        {
            // Naked throw preserves stack trace for telemetry
            throw;
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$ — constant number of pattern checks.
- **Space Complexity**: $\\mathcal{O}(1)$ stack memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem Q: Coordinates of a Point](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/Q) | Easy | Tuples, Pattern Matching, Throw Expressions |
| ⚪ | Exercism C# | [Instruments of Texas](https://exercism.org/tracks/csharp/exercises/instruments-of-texas) | Medium | throw vs throw ex, Stack Preservation |
| ⚪ | Exercism C# | [Booking Up](https://exercism.org/tracks/csharp/exercises/booking-up) | Easy | DateTime Parsing, Defensive Throw Checks |
| ⚪ | Exercism C# | [Land Grab in Space](https://exercism.org/tracks/csharp/exercises/land-grab-in-space) | Medium | Struct Validation, Throw Expressions |
`,

  contentBn: `# C# এ থ্রো বনাম থ্রো এক্স (throw vs throw ex) ও স্ট্যাক ট্রেস

টপ সফটওয়্যার কোম্পানিগুলোর (Enosis Solutions, Therap Services, Brain Station 23) টেকনিক্যাল ইন্টারভিউয়ের অন্যতম জনপ্রিয় একটি প্রশ্ন:

> **\`throw;\` এবং \`throw ex;\` এর মধ্যে মূল পার্থক্য কী?**

এই দুই পদ্ধতির পেছনের মেমোরি ও স্ট্যাক ট্রেসের আচরণ জানা প্রোডাকশন সিস্টেমের বাগ সমাধানের জন্য অপরিহার্য।

---

## স্ট্যাক ট্রেস সংরক্ষণ: ৩টি রিলোডিং প্যাটার্ন

\`\`\`
Method C() এর ৪২ নম্বর লাইনে ত্রুটি ঘটল
  └── Method B() সেটি ক্যাচ করল
        │
        ├── ১. throw ex; ────────► স্ট্যাক ট্রেস মুছে গেল! এররের নতুন উৎস হলো B() এর ৭৮ লাইন।
        │                          আসল ৪২ নম্বর লাইন চিরতরে মুছে গেল!
        │
        ├── ২. throw; ───────────► নিখুঁত! মূল ৪২ নম্বর লাইনটি অবিকল সংরক্ষিত থাকল।
        │
        └── ৩. throw new AppEx(.., ex); ──► InnerException এ মূল স্ট্যাক ট্রেস অক্ষুণ্ণ থাকল।
\`\`\`

### ১. \`throw ex;\` (মারাত্মক ভুল পদ্ধতি)
\`throw ex;\` ব্যবহার করলে CLR এটিকে একটি সম্পূর্ণ নতুন এক্সেপশন হিসেবে গণ্য করে:
- এর ফলে মূল যেখানে এরর ঘটেছিল সেই **আসল স্ট্যাক ট্রেস ও লাইন নম্বর সম্পূর্ণ মুছে যায়**।
- এররের নতুন উৎস হিসেবে ক্যাচ ব্লকের লাইন নম্বর সেট হয়ে যায়। প্রোডাকশন লগ দেখে আসল বাগ খুঁজে বের করা প্রায় অসম্ভব হয়ে পড়ে।

### ২. \`throw;\` (স্ট্যান্ডার্ড সঠিক পদ্ধতি)
প্যারামিটারহীন শুধু \`throw;\` ব্যবহার করলে CLR মূল এক্সেপশনটিকে হুবহু রি-ডিসপ্যাচ করে:
- **আসল স্ট্যাক ট্রেস ও মূল ফাইলের লাইন নম্বর অবিকল অক্ষুণ্ণ থাকে**।

### ৩. \`throw new DomainException("Context", ex);\` (এক্সেপশন র‍্যাপিং)
টেকনিক্যাল ত্রুটিকে ডোমেইন এক্সেপশনের ভেতরে মুড়িয়ে পাঠানো হয়:
- মূল ত্রুটিটি \`InnerException\` প্রোপার্টির ভেতরে নিরাপদ থাকে এবং কলার একটি সুন্দর বার্তা পায়।

---

## \`ExceptionDispatchInfo\` দিয়ে অ্যাসিনক্রোনাস স্ট্যাক সংরক্ষণ

মাল্টিথ্রেডিং বা ব্যাকগ্রাউন্ড টাস্কে ঘটা এরর মূল থ্রেডে স্ট্যাক ট্রেস না হারিয়ে পুনরায় থ্রো করার জন্য এটি ব্যবহৃত হয়:

\`\`\`csharp
using System.Runtime.ExceptionServices;

ExceptionDispatchInfo? captured = null;

try
{
    ExecuteTask();
}
catch (Exception ex)
{
    captured = ExceptionDispatchInfo.Capture(ex);
}

// পরবর্তীতে অন্য কোনো থ্রেডে আসল স্ট্যাক অক্ষুণ্ণ রেখে থ্রো:
captured?.Throw();
\`\`\`

---

## আধুনিক C# থ্রো এক্সপ্রেশন (C# 7.0+)

আধুনিক সি# এ \`throw\` কেবল একটি স্টেটমেন্ট নয়, এটি একটি এক্সপ্রেশন:

\`\`\`csharp
public class OrderService
{
    private readonly ILogger _logger;

    // ১. নাল-কোয়ালেসিং অপারেটরে থ্রো
    public OrderService(ILogger logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    // ২. টার্নারি অপারেটরে থ্রো এক্সপ্রেশন
    public decimal CalculateTax(decimal amount) =>
        amount >= 0 ? amount * 0.15m : throw new ArgumentOutOfRangeException(nameof(amount));
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #১ — Problem Q (Coordinates of a Point)
*দুটি স্থানাঙ্ক $X$ ও $Y$ কোন চতুর্ভাগে ($Q1, Q2, Q3, Q4$) অবস্থিত বা কোনো অক্ষে কি না তা নির্ণয় করতে হবে।*

#### সমাধান বিশ্লেষণ
- টাপল প্যাটার্ন ম্যাচিং ও থ্রো এক্সপ্রেশন দিয়ে নিরাপদ কোঅর্ডিনেট ক্লাস সম্পন্ন করা হয়েছে।
- যে কোনো অপ্রত্যাশিত এরর হলে প্যারামিটারহীন \`throw;\` দিয়ে আসল ট্রেস বহাল রাখা হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class CoordinatesSolution
{
    public static string ClassifyPoint(double x, double y) => (x, y) switch
    {
        (0.0, 0.0) => "Origem",
        (0.0, _)   => "Eixo Y",
        (_, 0.0)   => "Eixo X",
        (> 0, > 0) => "Q1",
        (< 0, > 0) => "Q2",
        (< 0, < 0) => "Q3",
        (> 0, < 0) => "Q4",
        _          => throw new InvalidOperationException("Invalid floating-point state.")
    };

    public static void Main()
    {
        try
        {
            string? line = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(line)) return;

            string[] tokens = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (tokens.Length < 2)
            {
                throw new ArgumentException("Two coordinate tokens required.");
            }

            double x = double.Parse(tokens[0], CultureInfo.InvariantCulture);
            double y = double.Parse(tokens[1], CultureInfo.InvariantCulture);

            Console.WriteLine(ClassifyPoint(x, y));
        }
        catch (Exception)
        {
            throw; // আসল স্ট্যাক ট্রেস অক্ষুণ্ণ রাখা
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ — নির্দিষ্ট প্যাটার্ন চেকিং।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত স্ট্যাক মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem Q: Coordinates of a Point](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/Q) | Easy | Tuples, Pattern Matching, Throw Expressions |
| ⚪ | Exercism C# | [Instruments of Texas](https://exercism.org/tracks/csharp/exercises/instruments-of-texas) | Medium | throw vs throw ex, Stack Preservation |
| ⚪ | Exercism C# | [Booking Up](https://exercism.org/tracks/csharp/exercises/booking-up) | Easy | DateTime Parsing, Defensive Throw Checks |
| ⚪ | Exercism C# | [Land Grab in Space](https://exercism.org/tracks/csharp/exercises/land-grab-in-space) | Medium | Struct Validation, Throw Expressions |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #1",
      name: "Problem Q: Coordinates of a Point",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/Q",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Tuples", "Pattern Matching", "Throw"],
      solutionEn: "Classify 2D points into quadrants or axes using tuple pattern matching with throw expression guards.",
      solutionBn: "টাপল প্যাটার্ন ম্যাচিং ও থ্রো এক্সপ্রেশন ব্যবহার করে স্থানাঙ্কের চতুর্ভাগ নির্ধারণ করুন।",
    },
    {
      source: "Exercism C#",
      name: "Instruments of Texas",
      url: "https://exercism.org/tracks/csharp/exercises/instruments-of-texas",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["Exceptions", "throw", "Stack Trace"],
      solutionEn: "Rethrow captured exceptions using naked throw to preserve pristine original error stack frames.",
      solutionBn: "আসল স্ট্যাক ফ্রেম অক্ষুণ্ণ রাখতে প্যারামিটারহীন throw ব্যবহার করে ত্রুটি রি-থ্রো করুন।",
    },
    {
      source: "Exercism C#",
      name: "Booking Up",
      url: "https://exercism.org/tracks/csharp/exercises/booking-up",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Exceptions", "DateTime", "Validation"],
      solutionEn: "Validate appointment schedules using throw expressions for invalid calendar formats.",
      solutionBn: "ভুল তারিখ ও সময়ের ক্ষেত্রে থ্রো এক্সপ্রেশন ব্যবহার করে অ্যাপয়েন্টমেন্ট শিডিউল যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "Land Grab in Space",
      url: "https://exercism.org/tracks/csharp/exercises/land-grab-in-space",
      difficulty: "MEDIUM",
      company: "Kaz Software",
      tags: ["Structs", "Throw", "Validation"],
      solutionEn: "Guard plot registrations against non-convex coordinates using custom defensive exceptions.",
      solutionBn: "কাস্টম ডিফেন্সিভ এক্সেপশন ও থ্রো স্টেটমেন্ট দিয়ে প্লট স্থানাঙ্কের বৈধতা যাচাই করুন।",
    },
  ],
};
