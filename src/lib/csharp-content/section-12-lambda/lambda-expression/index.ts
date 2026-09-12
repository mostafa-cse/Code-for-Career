import type { LocalLesson } from "@/lib/lessons-data";

export const lambdaExpressionLesson: LocalLesson = {
  slug: "lambda-expression",
  titleEn: "Expression vs Statement Lambdas",
  titleBn: "এক্সপ্রেশন বনাম স্টেটমেন্ট ল্যাম্বডা",
  categoryEn: "12. Lambda",
  categoryBn: "১২. ল্যাম্বডা এক্সপ্রেশন (Lambda)",
  categoryDescEn:
    "Anonymous functions in C#: lambda operator (=>), expression vs statement lambdas, closures, and variable capture mechanics.",
  categoryDescBn:
    "সি# এ অ্যানোনিমাস ফাংশন: ল্যাম্বডা অপারেটর (=>), এক্সপ্রেশন বনাম স্টেটমেন্ট ল্যাম্বডা, ক্লোজার ও ভ্যারিয়েবল ক্যাপচার।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Single expression vs multi-line statement blocks, Expression Trees (Expression<TDelegate>) for EF Core SQL translation, and CS0834 constraints.",
  descriptionBn:
    "একক এক্সপ্রেশন বনাম মাল্টি-লাইন স্টেটমেন্ট ব্লক, EF Core এসকিউএল অনুবাদের জন্য এক্সপ্রেশন ট্রি এবং CS0834 সীমাবদ্ধতা।",
  difficulty: "EASY",
  displayOrder: 2,
  prerequisites: ["lambda-syntax"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Expression vs Statement Lambdas in C#

In C#, lambda expressions are divided into two distinct architectural forms: **Expression Lambdas** and **Statement Lambdas**.

Understanding the difference is critical, especially when working with ORMs like Entity Framework Core, LINQ providers, and asynchronous programming.

---

## Architectural Comparison Matrix

| Feature | Expression Lambda | Statement Lambda |
| :--- | :--- | :--- |
| **Syntax** | \`(x) => x > 0\` | \`(x) => { if (x > 0) return true; return false; }\` |
| **Body Content** | A single expression only. | Multiple statements enclosed in curly braces \`{ }\`. |
| **Return Keyword** | Implicit. Never write \`return\`. | Explicit. \`return\` is mandatory if returning a value. |
| **Compilation Targets** | Compiles to a **Delegate** OR an **Expression Tree**. | Compiles to a **Delegate ONLY**. |
| **EF Core / SQL Translation**| Fully supported via \`Expression<Func<T, bool>>\`. | **Unsupported** (causes compiler error CS0834). |
| **Looping & Control Flow** | No loops, \`try/catch\`, or complex jumps. | Supports loops, \`switch\`, \`try/catch\`, and local variables. |

---

## The Expression Tree Revolution (\`Expression<TDelegate>\`)

The most profound architectural distinction between the two forms lies in how the compiler processes them:

### 1. Expression Lambdas as Data (ASTs)
When assigned to \`System.Linq.Expressions.Expression<TDelegate>\`, an expression lambda is **not compiled into executable IL instructions**. Instead, the compiler generates a structured **Abstract Syntax Tree (AST)**:

\`\`\`csharp
using System.Linq.Expressions;

// Compiles as an AST data structure, NOT machine code!
Expression<Func<User, bool>> isAdultExpr = user => user.Age >= 18;
\`\`\`

**How Entity Framework Core Uses This**:
When you write \`dbContext.Users.Where(user => user.Age >= 18)\`, EF Core does not execute the C# method in memory. Instead, it parses the \`BinaryExpression\` (\`>=\`), \`MemberExpression\` (\`user.Age\`), and \`ConstantExpression\` (\`18\`), translating the tree into raw SQL:
\`\`\`sql
SELECT [u].[Id], [u].[Name], [u].[Age] FROM [Users] AS [u] WHERE [u].[Age] >= 18
\`\`\`

### 2. Why Statement Lambdas Cannot Be Expression Trees (CS0834)
If you attempt to pass a statement lambda to an EF Core LINQ query:

\`\`\`csharp
// COMPILER ERROR CS0834: A lambda expression with a statement body cannot be converted to an expression tree
Expression<Func<User, bool>> filter = user => 
{
    return user.Age >= 18;
};
\`\`\`
Statement blocks contain imperative control flow that has no direct mathematical representation in relational database engines.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem U (Float or int)
*Given a real number $N$. Determine whether it is an integer or float. If it is an integer, print \`int {integer_part}\`. If it is a float, print \`float {integer_part} {fractional_part}\`.*
*Model the classification logic using a multi-line statement lambda.*

#### Algorithmic Analysis
1. Read the raw numeric string from console input.
2. Formulate a statement lambda \`Func<string, string> classifyNumber = raw => { ... };\` to encapsulate string tokenization, decimal parsing, and conditional branch output.
3. Compute the fractional component and format the output.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        // Multi-line statement lambda encapsulating classification
        Func<string, string> classifyNumber = raw =>
        {
            int dotIndex = raw.IndexOf('.');
            if (dotIndex == -1)
            {
                return $"int {raw}";
            }

            string intPart = raw.Substring(0, dotIndex);
            string fracPart = raw.Substring(dotIndex + 1);

            if (double.TryParse("0." + fracPart, NumberStyles.Float, CultureInfo.InvariantCulture, out double fraction))
            {
                if (fraction == 0.0)
                {
                    return $"int {intPart}";
                }
                return $"float {intPart} 0.{fracPart}";
            }

            return $"int {intPart}";
        };

        Console.WriteLine(classifyNumber(input.Trim()));
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(L)$ where $L$ is the string length of $N$ ($L \\le 100$). Substring extraction and numeric parsing execute in linear time.
- **Space Complexity**: $\\mathcal{O}(L)$ for the substring allocations returned by the statement lambda.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Float or int](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/U) | Easy | Statement lambdas, Multi-branch logic, Substring parsing |
| ⚪ | Codeforces | [Assiut Sheet #1: Max and Min](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K) | Easy | Expression lambdas, Math.Min/Max, Compact syntax |
| ⚪ | Exercism C# | [Log Analysis](https://exercism.org/tracks/csharp/exercises/log-analysis) | Easy | String extension methods, Expression bodies, Substrings |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | Expression vs Statement lambdas, Generic filtering |
`,

  contentBn: `# C# এ এক্সপ্রেশন বনাম স্টেটমেন্ট ল্যাম্বডা

সি# এ ল্যাম্বডা এক্সপ্রেশন দুটি প্রধান রূপ ধারণ করতে পারে: **এক্সপ্রেশন ল্যাম্বডা (Expression Lambda)** এবং **স্টেটমেন্ট ল্যাম্বডা (Statement Lambda)**।

এই দুটি রূপের পার্থক্য বোঝা অত্যন্ত গুরুত্বপূর্ণ, বিশেষ করে Entity Framework Core এর মতো ওআরএম (ORM) দিয়ে ডাটাবেজ কুয়েরি তৈরির সময়।

---

## আর্কিটেকচারাল তুলনামূলক টেবিল

| বৈশিষ্ট্য | এক্সপ্রেশন ল্যাম্বডা | স্টেটমেন্ট ল্যাম্বডা |
| :--- | :--- | :--- |
| **সিনট্যাক্স** | \`(x) => x > 0\` | \`(x) => { if (x > 0) return true; return false; }\` |
| **বডি কনটেন্ট** | কেবল একটি একক এক্সপ্রেশন। | দ্বিতীয় বন্ধনী \`{ }\` এর মধ্যে একাধিক স্টেটমেন্ট। |
| **রিটার্ন কি-ওয়ার্ড** | অদৃশ্য। \`return\` লেখা নিষিদ্ধ। | বাধ্যতামূলক। মান রিটার্ন করতে \`return\` লিখতে হয়। |
| **কম্পাইলেশন** | **ডেলিগেট** অথবা **এক্সপ্রেশন ট্রি** উভয়টিতে রূপান্তরযোগ্য। | **কেবলমাত্র ডেলিগেটে** রূপান্তরযোগ্য। |
| **EF Core / SQL অনুবাদ**| \`Expression<Func<T, bool>>\` দিয়ে সরাসরি SQL হয়। | **অসমর্থিত** (কম্পাইলার এরর CS0834 দেয়)। |
| **লুপ ও জটিল কন্ট্রোল** | লুপ, \`try/catch\` বা স্টেটমেন্ট ব্যবহার করা যায় না। | লুপ, \`switch\`, \`try/catch\` সবই ব্যবহার করা যায়। |

---

## এক্সপ্রেশন ট্রি আর্কিটেকচার (\`Expression<TDelegate>\`)

এই দুই ধরনের ল্যাম্বডার মধ্যে সবচেয়ে গভীর পার্থক্য হলো এক্সপ্রেশন ট্রির সমর্থন:

### ১. ডেটা হিসেবে এক্সপ্রেশন ল্যাম্বডা (AST)
যখন কোনো এক্সপ্রেশন ল্যাম্বডাকে \`System.Linq.Expressions.Expression<TDelegate>\` এ অ্যাসাইন করা হয়, তখন কম্পাইলার এটিকে এক্সিকিউটেবল মেশিন কোডে রূপান্তর করে না। বরং এটি কোডটিকে একটি ডেটা স্ট্রাকচার বা **Abstract Syntax Tree (AST)** হিসেবে মেমোরিতে সংরক্ষণ করে:

\`\`\`csharp
using System.Linq.Expressions;

// এটি মেশিন কোড নয়, কোডের একটি ট্রি ডেটা স্ট্রাকচার!
Expression<Func<User, bool>> isAdultExpr = user => user.Age >= 18;
\`\`\`

**Entity Framework Core এটি কীভাবে ব্যবহার করে**:
যখন আপনি \`dbContext.Users.Where(user => user.Age >= 18)\` লেখেন, তখন EF Core মেমোরিতে C# কোড রান করে না। বরং এটি এক্সপ্রেশন ট্রি বিশ্লেষণ করে সরাসরি ডাটাবেজের SQL কোডে অনুবাদ করে:
\`\`\`sql
SELECT [u].[Id], [u].[Name], [u].[Age] FROM [Users] AS [u] WHERE [u].[Age] >= 18
\`\`\`

### ২. স্টেটমেন্ট ল্যাম্বডা কেন এক্সপ্রেশন ট্রি হতে পারে না (CS0834)
যদি আপনি কোনো স্টেটমেন্ট ল্যাম্বডাকে এক্সপ্রেশন ট্রিতে রূপান্তর করতে চান:

\`\`\`csharp
// কম্পাইলার এরর CS0834! স্টেটমেন্ট বডি এক্সপ্রেশন ট্রিতে রূপান্তর করা যায় না:
Expression<Func<User, bool>> filter = user => 
{
    return user.Age >= 18;
};
\`\`\`
স্টেটমেন্ট ব্লকে ইম্পারেটিভ লুপ ও শাখা থাকে যা রিলেশনাল এসকিউএল ডাটাবেজে রূপান্তরযোগ্য নয়।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem U (Float or int)
*একটি বাস্তব সংখ্যা $N$ দেওয়া থাকবে। এটি পূর্ণসংখ্যা হলে \`int {integer_part}\` প্রিন্ট করুন, আর দশমিক ভগ্নাংশ থাকলে \`float {integer_part} {fractional_part}\` প্রিন্ট করুন।*
*মাল্টি-লাইন স্টেটমেন্ট ল্যাম্বডা ব্যবহার করে ক্লাসিফিকেশন লজিক সম্পন্ন করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে সংখ্যাটি স্ট্রিং হিসেবে নেওয়া।
২. একটি স্টেটমেন্ট ল্যাম্বডা \`Func<string, string> classifyNumber = raw => { ... };\` তৈরি করে সাবস্ট্রিং ও ডেসিমাল পার্সিং সম্পন্ন করা।
৩. ভগ্নাংশ যাচাই করে ফরম্যাট অনুযায়ী রিটার্ন করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Globalization;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        Func<string, string> classifyNumber = raw =>
        {
            int dotIndex = raw.IndexOf('.');
            if (dotIndex == -1)
            {
                return $"int {raw}";
            }

            string intPart = raw.Substring(0, dotIndex);
            string fracPart = raw.Substring(dotIndex + 1);

            if (double.TryParse("0." + fracPart, NumberStyles.Float, CultureInfo.InvariantCulture, out double fraction))
            {
                if (fraction == 0.0)
                {
                    return $"int {intPart}";
                }
                return $"float {intPart} 0.{fracPart}";
            }

            return $"int {intPart}";
        };

        Console.WriteLine(classifyNumber(input.Trim()));
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(L)$, যেখানে $L$ হলো ইনপুট স্ট্রিংয়ের দৈর্ঘ্য ($L \\le 100$)।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(L)$, সাবস্ট্রিং মেমোরি অ্যালোকেশনের জন্য।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Float or int](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/U) | Easy | Statement lambdas, Multi-branch logic, Substring parsing |
| ⚪ | Codeforces | [Assiut Sheet #1: Max and Min](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K) | Easy | Expression lambdas, Math.Min/Max, Compact syntax |
| ⚪ | Exercism C# | [Log Analysis](https://exercism.org/tracks/csharp/exercises/log-analysis) | Easy | String extension methods, Expression bodies, Substrings |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | Expression vs Statement lambdas, Generic filtering |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Float or int",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/U",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Statement Lambdas", "Parsing", "Floating Point"],
      solutionEn:
        "Implement a multi-line statement lambda to inspect decimal delimiters and parse fractional differences, formatting output accordingly.",
      solutionBn:
        "মাল্টি-লাইন স্টেটমেন্ট ল্যাম্বডার সাহায্যে দশমিক বিন্দু আলাদা করে ভগ্নাংশ মান নির্ণয় করুন এবং ফরম্যাট অনুযায়ী আউটপুট দিন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Max and Min",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Expression Lambdas", "Math", "Conditionals"],
      solutionEn:
        "Calculate minimum and maximum values among three numbers using concise inline expression lambdas with Math.Min and Math.Max.",
      solutionBn:
        "Math.Min ও Math.Max এর সাথে সংক্ষিপ্ত এক্সপ্রেশন ল্যাম্বডা ব্যবহার করে তিনটি সংখ্যার মধ্যে সর্বনিম্ন ও সর্বোচ্চ সংখ্যা বের করুন।",
    },
    {
      source: "Exercism C#",
      name: "Log Analysis",
      url: "https://exercism.org/tracks/csharp/exercises/log-analysis",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Expression Bodies", "Strings", "Extension Methods"],
      solutionEn:
        "Extend string capabilities with expression-bodied extension methods to parse log level identifiers and trailing messages.",
      solutionBn:
        "এক্সপ্রেশন-বডিড এক্সটেনশন মেথড তৈরি করে লগ ফাইলের লেভেল আইডেন্টিফায়ার এবং বার্তা আলাদা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Strain",
      url: "https://exercism.org/tracks/csharp/exercises/strain",
      difficulty: "MEDIUM",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Lambdas", "Generics", "Yield"],
      solutionEn:
        "Filter elements from generic sequences using expression and statement lambdas, implementing custom keep and discard filtering.",
      solutionBn:
        "এক্সপ্রেশন ও স্টেটমেন্ট ল্যাম্বডা প্রয়োগ করে জেনেরিক কালেকশন থেকে উপাদান ফিল্টার করার Keep ও Discard অপারেশন সম্পন্ন করুন।",
    },
  ],
};
