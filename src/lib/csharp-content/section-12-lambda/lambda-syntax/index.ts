import type { LocalLesson } from "@/lib/lessons-data";

export const lambdaSyntaxLesson: LocalLesson = {
  slug: "lambda-syntax",
  titleEn: "Lambda Expressions Syntax",
  titleBn: "ল্যাম্বডা (Lambda) সিনট্যাক্স ও গোজ-টু অপারেটর (=>)",
  categoryEn: "12. Lambda",
  categoryBn: "১২. ল্যাম্বডা এক্সপ্রেশন (Lambda)",
  categoryDescEn:
    "Anonymous functions in C#: lambda operator (=>), expression vs statement lambdas, closures, and variable capture mechanics.",
  categoryDescBn:
    "সি# এ অ্যানোনিমাস ফাংশন: ল্যাম্বডা অপারেটর (=>), এক্সপ্রেশন বনাম স্টেটমেন্ট ল্যাম্বডা, ক্লোজার ও ভ্যারিয়েবল ক্যাপচার।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Anonymous function syntax, the lambda operator (=>), parameter type inference, discard tokens (_), and C# 10 natural typing.",
  descriptionBn:
    "অ্যানোনিমাস ফাংশন সিনট্যাক্স, ল্যাম্বডা অপারেটর (=>), টাইপ ইনফারেন্স, ডিসকার্ড প্যারামিটার (_) এবং C# 10 ন্যাচারাল টাইপিং।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["delegates-func"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Lambda Expressions Syntax in C#

A **lambda expression** is an anonymous function that can be used to create delegates or expression trees. The \`=>\` token is known as the **lambda operator** (colloquially read as "goes to").

Rooted in Alonzo Church's Lambda Calculus and functional programming paradigms, lambdas allow you to write inline executable logic without the overhead of declaring named methods.

---

## Anatomy of a Lambda Expression

Every lambda follows this structural syntax:

\`\`\`
(input-parameters) => expression-or-statement-block
\`\`\`

### 1. Parameter Variations:
- **Zero Parameters**: Parentheses are mandatory:
  \`\`\`csharp
  Action ping = () => Console.WriteLine("Pong");
  \`\`\`
- **Single Parameter**: Parentheses are optional:
  \`\`\`csharp
  Func<int, int> square = x => x * x;
  \`\`\`
- **Multiple Parameters**: Parentheses are mandatory, separated by commas:
  \`\`\`csharp
  Func<int, int, int> add = (a, b) => a + b;
  \`\`\`
- **Explicit Types**: Necessary when the compiler cannot infer types or when resolving overloads:
  \`\`\`csharp
  Func<double, int> truncate = (double val) => (int)val;
  \`\`\`

### 2. Discard Parameters (C# 9+)
When an API requires a delegate signature with parameters your handler does not care about, use one or more underscore (\`_\`) discard tokens:

\`\`\`csharp
// Both parameters discarded:
button.Click += (_, _) => Console.WriteLine("Button tapped!");
\`\`\`

### 3. Natural Typing & Explicit Returns (C# 10+)
Prior to C# 10, lambdas required an explicit target delegate type (\`Func\` or \`Action\`). In C# 10+, the compiler automatically infers the **natural type** of a lambda using the \`var\` keyword:

\`\`\`csharp
// Inferred as Func<string, int>:
var parseNumber = (string s) => int.Parse(s);

// Explicit return type specification:
var choose = object (bool condition) => condition ? 100 : "one hundred";
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #5 Problem A (Add)
*Given two numbers $X$ and $Y$. Calculate their sum using an inline functional lambda expression.*

#### Algorithmic Analysis
1. Input consists of two space-separated integers $X$ and $Y$ (which can reach $10^5$).
2. Parse the tokens into 64-bit integers (\`long\`) to protect against potential arithmetic overflow.
3. Model the addition using a lambda \`Func<long, long, long> add = (a, b) => a + b;\`.
4. Output the result.

#### C# Implementation

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        string[] tokens = input.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (tokens.Length < 2)
        {
            return;
        }

        long x = long.Parse(tokens[0]);
        long y = long.Parse(tokens[1]);

        // Concise lambda addition
        Func<long, long, long> add = (a, b) => a + b;

        Console.WriteLine(add(x, y));
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, parsing two integers and executing the lambda addition runs in constant time.
- **Space Complexity**: $\\mathcal{O}(1)$, primitive registers and stack memory only.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #5: Problem A: Add](https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/A) | Easy | Lambda syntax, Mathematical dispatch, 64-bit integers |
| ⚪ | Codeforces | [Assiut Sheet #1: Basic Data Types](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B) | Easy | Tokenization, Type parsing, Primitive formatting |
| ⚪ | Exercism C# | [Darts](https://exercism.org/tracks/csharp/exercises/darts) | Easy | Lambda expressions, Math calculations, Euclidean distance |
| ⚪ | Exercism C# | [Cars Assemble](https://exercism.org/tracks/csharp/exercises/cars-assemble) | Easy | Conditionals, Rate calculations, Expression-bodied members |
`,

  contentBn: `# C# এ ল্যাম্বডা (Lambda) সিনট্যাক্স ও গোজ-টু অপারেটর (=>)

**ল্যাম্বডা এক্সপ্রেশন (Lambda Expression)** হলো একটি নামবিহীন বা অ্যানোনিমাস ফাংশন (Anonymous Function), যা সরাসরি কোডের ভেতরে ডেলিগেট বা এক্সপ্রেশন ট্রি হিসেবে ব্যবহারের জন্য তৈরি করা হয়। এর অপারেটর \`=>\` কে প্রোগ্রামিংয়ের ভাষায় "গোজ-টু" (goes to) বলা হয়।

ফাংশনাল প্রোগ্রামিং ও ল্যাম্বডা ক্যালকুলাসের ওপর ভিত্তি করে সি#-এ ল্যাম্বডার আগমন ঘটে, যা আলাদা মেথড ঘোষণা না করেই সংক্ষিপ্তভাবে কোড লেখার সুবিধা প্রদান করে।

---

## ল্যাম্বডা এক্সপ্রেশনের অভ্যন্তরীণ গঠন

প্রতিটি ল্যাম্বডা নিচের সাধারণ গঠন অনুসরণ করে:

\`\`\`
(ইনপুট-প্যারামিটার) => এক্সপ্রেশন-অথবা-স্টেটমেন্ট-ব্লক
\`\`\`

### ১. প্যারামিটারের বিভিন্ন রূপ:
- **প্যারামিটারহীন (Zero Parameters)**: বন্ধনী দেওয়া বাধ্যতামূলক:
  \`\`\`csharp
  Action ping = () => Console.WriteLine("Pong");
  \`\`\`
- **একক প্যারামিটার (Single Parameter)**: বন্ধনী দেওয়া ঐচ্ছিক:
  \`\`\`csharp
  Func<int, int> square = x => x * x;
  \`\`\`
- **একাধিক প্যারামিটার (Multiple Parameters)**: কমা দিয়ে আলাদা করে বন্ধনী দেওয়া বাধ্যতামূলক:
  \`\`\`csharp
  Func<int, int, int> add = (a, b) => a + b;
  \`\`\`
- **স্পষ্ট টাইপ (Explicit Types)**: কম্পাইলার নিজে টাইপ অনুমান করতে না পারলে টাইপ লিখে দেওয়া যায়:
  \`\`\`csharp
  Func<double, int> truncate = (double val) => (int)val;
  \`\`\`

### ২. ডিসকার্ড প্যারামিটার (C# 9+)
ইভেন্ট বা এপিআই-তে এমন প্যারামিটার থাকলে যা মেথডে প্রয়োজন নেই, সেখানে আন্ডারস্কোর (\`_\`) দিয়ে ডিসকার্ড নির্দেশ করা যায়:

\`\`\`csharp
button.Click += (_, _) => Console.WriteLine("Button tapped!");
\`\`\`

### ৩. ন্যাচারাল টাইপিং ও রিটার্ন টাইপ (C# 10+)
সি# ১০ সংস্করণে ল্যাম্বডার জন্য \`var\` কি-ওয়ার্ড দিয়ে **স্বয়ংক্রিয় ন্যাচারাল টাইপ** নির্ধারণ সম্ভব:

\`\`\`csharp
// কম্পাইলার এটিকে Func<string, int> হিসেবে বুঝে নেয়:
var parseNumber = (string s) => int.Parse(s);

// সরাসরি রিটার্ন টাইপ নির্ধারণ:
var choose = object (bool condition) => condition ? 100 : "one hundred";
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #5 Problem A (Add)
*দুটি সংখ্যা $X$ এবং $Y$ দেওয়া থাকবে। একটি ইনলাইন ল্যাম্বডা এক্সপ্রেশনের সাহায্যে তাদের যোগফল নির্ণয় করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে দুটি পূর্ণসংখ্যা নেওয়া ($X, Y \le 10^5$)।
২. ওভারফ্লো প্রতিরোধে ৬৪-বিট \`long\` টাইপ ব্যবহার করা।
৩. \`Func<long, long, long> add = (a, b) => a + b;\` ল্যাম্বডা দিয়ে যোগফল বের করা।

#### C# সমাধান

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        string[] tokens = input.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (tokens.Length < 2)
        {
            return;
        }

        long x = long.Parse(tokens[0]);
        long y = long.Parse(tokens[1]);

        // ল্যাম্বডা দিয়ে যোগফল নির্ধারণ
        Func<long, long, long> add = (a, b) => a + b;

        Console.WriteLine(add(x, y));
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, ইনপুট পার্সিং এবং দুটি সংখ্যার যোগ ধ্রুবক সময়ে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, স্ট্যাকে প্রিমিটিভ ভ্যারিয়েবলের সীমিত মেমোরি ব্যবহৃত হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #5: Problem A: Add](https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/A) | Easy | Lambda syntax, Mathematical dispatch, 64-bit integers |
| ⚪ | Codeforces | [Assiut Sheet #1: Basic Data Types](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B) | Easy | Tokenization, Type parsing, Primitive formatting |
| ⚪ | Exercism C# | [Darts](https://exercism.org/tracks/csharp/exercises/darts) | Easy | Lambda expressions, Math calculations, Euclidean distance |
| ⚪ | Exercism C# | [Cars Assemble](https://exercism.org/tracks/csharp/exercises/cars-assemble) | Easy | Conditionals, Rate calculations, Expression-bodied members |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #5: Problem A: Add",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/A",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Lambda", "Math", "Methods"],
      solutionEn:
        "Implement arithmetic addition of two 64-bit integers using an inline Func<long, long, long> lambda expression.",
      solutionBn:
        "ইনলাইন Func<long, long, long> ল্যাম্বডা এক্সপ্রেশনের সাহায্যে দুটি ৬৪-বিট পূর্ণসংখ্যার যোগফল নির্ণয় করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Basic Data Types",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Parsing", "Basic Types", "IO"],
      solutionEn:
        "Parse distinct data types (int, long, char, float, double) from space-separated input, printing each on a separate line.",
      solutionBn:
        "স্পেস দ্বারা পৃথককৃত বিভিন্ন ডেটা টাইপ (int, long, char, float, double) পার্স করে প্রতিটি আলাদা লাইনে প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Darts",
      url: "https://exercism.org/tracks/csharp/exercises/darts",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Lambda", "Math", "Geometry"],
      solutionEn:
        "Calculate Euclidean distance from the origin using lambda math functions, returning concentric target scores.",
      solutionBn:
        "ল্যাম্বডা মেথডের সাহায্যে মূলবিন্দু থেকে ইউক্লিডিয়ান দূরত্ব বের করে টার্গেট রিং অনুযায়ী স্কোর নির্ধারণ করুন।",
    },
    {
      source: "Exercism C#",
      name: "Cars Assemble",
      url: "https://exercism.org/tracks/csharp/exercises/cars-assemble",
      difficulty: "EASY",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Conditionals", "Math", "Expression-Bodied"],
      solutionEn:
        "Calculate production rates per hour and working items per minute based on speed success rates using concise expression lambdas.",
      solutionBn:
        "গতির সফলতার হারের ওপর ভিত্তি করে প্রতি ঘণ্টায় উৎপাদন হার এবং প্রতি মিনিটে কার্যকর আইটেম সংখ্যা হিসাব করুন।",
    },
  ],
};
