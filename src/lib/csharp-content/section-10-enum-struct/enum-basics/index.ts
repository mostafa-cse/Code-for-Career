import type { LocalLesson } from "@/lib/lessons-data";

export const enumBasicsLesson: LocalLesson = {
  slug: "enum-basics",
  titleEn: "Enum Basics",
  titleBn: "এনাম (enum) ও স্ট্রংলি টাইপড ধ্রুবক",
  categoryEn: "10. enum & struct",
  categoryBn: "১০. এনাম ও স্ট্রাকট",
  categoryDescEn:
    "Lightweight custom value types in C#: strongly-typed enumerations, bitwise [Flags], readonly structs, and struct vs class memory tradeoffs.",
  categoryDescBn:
    "সি# এ হালকা কাস্টম ভ্যালু টাইপ: এনাম, বিটওয়াইজ [Flags], readonly স্ট্রাকট এবং স্ট্রাকট বনাম ক্লাস মেমোরি পার্থক্য।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Enumeration value types, underlying integral storage, Enum.TryParse, range validation pitfalls, and modern switch expressions.",
  descriptionBn:
    "এনাম ভ্যালু টাইপ, আন্ডারলাইং পূর্ণসংখ্যা মেমোরি, Enum.TryParse, রেঞ্জ ভ্যালিডেশন এবং আধুনিক সুইচ এক্সপ্রেশন।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["types-value-types"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Enum Basics in C#

An **enumeration type (\`enum\`)** is a distinct, strongly typed value type defined by a named set of integral constants.

Enums replace dangerous "magic numbers" and "magic strings" with compiler-enforced domain symbols, enhancing readability, refactoring safety, and static analysis.

---

## CLR Internal Architecture & Underlying Storage

In the Common Language Runtime (CLR), every \`enum\` implicitly inherits from \`System.Enum\`, which in turn inherits from \`System.ValueType\` $\\rightarrow$ \`System.Object\`.

\`\`\`
          System.Object
                ▲
                │
         System.ValueType
                ▲
                │
           System.Enum
                ▲
                │
      UserDefinedEnum (struct)
\`\`\`

### Custom Underlying Integral Types
By default, the underlying storage type of an enum is \`int\` (4 bytes, 32-bit signed). In memory-constrained scenarios—such as high-volume collections, network protocol headers, or Entity Framework Core mapping to SQL \`tinyint\`—you can explicitly declare smaller integral types:

\`\`\`csharp
// Consumes only 1 byte per instance in memory
public enum OrderStatus : byte
{
    Draft = 0,
    Submitted = 1,
    Processing = 2,
    Shipped = 3,
    Delivered = 4,
    Cancelled = 255
}
\`\`\`

Supported underlying types: \`byte\`, \`sbyte\`, \`short\`, \`ushort\`, \`int\`, \`uint\`, \`long\`, and \`ulong\`.

---

## The Range Validation Trap

A common misconception among developers is that an enum variable can only hold values explicitly declared in its definition.

> **CRITICAL CLR RULE**: An enum is an integral value at runtime. The C# compiler and runtime **do NOT automatically validate that an assigned value is a declared member**!

\`\`\`csharp
public enum PaymentMethod
{
    CreditCard = 1,
    PayPal = 2,
    BankTransfer = 3
}

// Completely legal in C# without compiler errors or runtime exceptions:
PaymentMethod method = (PaymentMethod)999; 
Console.WriteLine(method); // Prints "999" (not in enum definition!)
\`\`\`

### Validating Untrusted Inputs
When accepting enum values from external HTTP requests, JSON payloads, or databases, validate them using \`Enum.IsDefined\` or safe parsing:

\`\`\`csharp
// 1. Safe parsing from string
if (Enum.TryParse<PaymentMethod>("PayPal", ignoreCase: true, out var payment))
{
    Console.WriteLine($"Valid payment: {payment}");
}

// 2. Checking numeric validity
if (Enum.IsDefined(typeof(PaymentMethod), 999))
{
    // Will not execute because 999 is undefined
}
\`\`\`

---

## Switch Expressions with Exhaustiveness Checks

Modern C# switch expressions pair naturally with enums. If a case is missing, the compiler issues warning **CS8509** ("The switch expression does not handle all possible inputs"):

\`\`\`csharp
public static decimal CalculateDiscount(OrderStatus status) => status switch
{
    OrderStatus.Draft => 0.00m,
    OrderStatus.Submitted => 0.05m,
    OrderStatus.Processing => 0.05m,
    OrderStatus.Shipped => 0.10m,
    OrderStatus.Delivered => 0.15m,
    OrderStatus.Cancelled => 0.00m,
    _ => throw new ArgumentOutOfRangeException(nameof(status), $"Unexpected status: {status}")
};
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem V (Comparison)
*Given a mathematical comparison expression in the form \`A S B\` (where $S$ is \`<\`, \`>\`, or \`=\`). Determine whether the statement is mathematically \`Right\` or \`Wrong\`.*

#### Algorithmic Analysis
1. Model the comparison operators (\`<\`, \`>\`, \`=\`) using a strongly typed \`ComparisonOperator\` enum.
2. Read the tokens: left operand, operator character, and right operand.
3. Parse the character into our enum.
4. Evaluate the relation using a C# switch expression and print \`Right\` or \`Wrong\`.

#### C# Implementation

\`\`\`csharp
using System;

public enum ComparisonOperator
{
    LessThan = '<',
    GreaterThan = '>',
    Equal = '='
}

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
        if (tokens.Length < 3)
        {
            return;
        }

        int a = int.Parse(tokens[0]);
        char opChar = tokens[1][0];
        int b = int.Parse(tokens[2]);

        ComparisonOperator op = (ComparisonOperator)opChar;
        bool isCorrect = Evaluate(a, op, b);

        Console.WriteLine(isCorrect ? "Right" : "Wrong");
    }

    public static bool Evaluate(int a, ComparisonOperator op, int b) => op switch
    {
        ComparisonOperator.LessThan => a < b,
        ComparisonOperator.GreaterThan => a > b,
        ComparisonOperator.Equal => a == b,
        _ => throw new ArgumentOutOfRangeException(nameof(op), $"Unrecognized operator: {op}")
    };
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, parsing three tokens and executing a single comparison runs in constant time.
- **Space Complexity**: $\\mathcal{O}(1)$, stack memory only for primitive values.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Comparison](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/V) | Easy | Relational operators, Strong typing, Switch expressions |
| ⚪ | Codeforces | [Assiut Sheet #1: Mathematical Expression](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/W) | Easy | Arithmetic operators, Enum modeling, Parsing |
| ⚪ | Exercism C# | [Resistor Color](https://exercism.org/tracks/csharp/exercises/resistor-color) | Easy | Enum mapping, String parsing, Underlying integral values |
| ⚪ | Exercism C# | [Resistor Color Duo](https://exercism.org/tracks/csharp/exercises/resistor-color-duo) | Easy | Multi-band decoding, Enum indexing, Value extraction |
`,

  contentBn: `# C# এ এনাম (enum) ও স্ট্রংলি টাইপড ধ্রুবক

**এনাম (\`enum\` বা Enumeration)** হলো নামযুক্ত পূর্ণসংখ্যা ধ্রুবক দ্বারা গঠিত একটি স্বতন্ত্র ভ্যালু টাইপ।

কোডে অনির্ধারিত সংখ্যা বা স্ট্রিং ("Magic Numbers" বা "Magic Strings") ব্যবহার না করে এনাম ব্যবহারের মাধ্যমে কম্পাইল-টাইম টাইপ-নিরাপত্তা, সহজে রিফ্যাক্টরিং এবং কোডের পাঠযোগ্যতা নিশ্চিত করা যায়।

---

## CLR অভ্যন্তরীণ আর্কিটেকচার ও মেমোরি স্টোরেজ

.NET Common Language Runtime (CLR)-এ প্রতিটি \`enum\` স্বয়ংক্রিয়ভাবে \`System.Enum\` ক্লাস থেকে ইনহেরিট করে। আর \`System.Enum\` ইনহেরিট করে \`System.ValueType\` থেকে:

\`\`\`
          System.Object
                ▲
                │
         System.ValueType
                ▲
                │
           System.Enum
                ▲
                │
      UserDefinedEnum (struct)
\`\`\`

### কাস্টম আন্ডারলাইং ইন্টিগ্রাল টাইপ
ডিফল্টভাবে এনামের অভ্যন্তরীণ স্টোরেজ টাইপ হলো \`int\` (৪ বাইট বা ৩২-বিট)। কিন্তু মেমোরি বাঁচানোর জন্য বা নেটওয়ার্ক প্রোটোকল/ডাটাবেজে ১ বাইটের \`tinyint\` এর সাথে সমন্বয় করতে চাইলে ছোট ইন্টিগ্রাল টাইপ নির্ধারণ করা যায়:

\`\`\`csharp
// মেমোরিতে প্রতিটি ইনস্ট্যান্স মাত্র ১ বাইট জায়গা নেয়
public enum OrderStatus : byte
{
    Draft = 0,
    Submitted = 1,
    Processing = 2,
    Shipped = 3,
    Delivered = 4,
    Cancelled = 255
}
\`\`\`

সমর্থিত টাইপসমূহ: \`byte\`, \`sbyte\`, \`short\`, \`ushort\`, \`int\`, \`uint\`, \`long\`, এবং \`ulong\`।

---

## এনাম রেঞ্জ ভ্যালিডেশনের ফাঁদ

ডেভেলপারদের মধ্যে একটি সাধারণ ভুল ধারণা রয়েছে যে এনামে কেবল পূর্বে ঘোষিত সদস্যগুলোর মানই থাকতে পারে।

> **গুরুত্বপূর্ণ CLR সত্য**: রানটাইমে এনাম মূলত একটি সাধারণ সংখ্যা। সি# কম্পাইলার বা রানটাইম ইঞ্জিন **স্বয়ংক্রিয়ভাবে কোনো রেঞ্জ ভ্যালিডেশন করে না**!

\`\`\`csharp
public enum PaymentMethod
{
    CreditCard = 1,
    PayPal = 2,
    BankTransfer = 3
}

// সি#-এ এটি কোনো এরর ছাড়াই বৈধ:
PaymentMethod method = (PaymentMethod)999; 
Console.WriteLine(method); // প্রিন্ট হবে "999" (এনামে না থাকলেও রানটাইমে বৈধ!)
\`\`\`

### বহিরাগত ইনপুট যাচাই করার নিয়ম
এপিআই রিকোয়েস্ট বা ডাটাবেজ থেকে এনাম ইনপুট নেওয়ার সময় \`Enum.TryParse\` বা \`Enum.IsDefined\` দিয়ে ভ্যালিডেশন নিশ্চিত করতে হয়:

\`\`\`csharp
// ১. স্ট্রিং থেকে নিরাপদ পার্সিং
if (Enum.TryParse<PaymentMethod>("PayPal", ignoreCase: true, out var payment))
{
    Console.WriteLine($"Valid payment: {payment}");
}

// ২. সংখ্যাটি এনামের বৈধ সদস্য কি না যাচাই
if (Enum.IsDefined(typeof(PaymentMethod), 999))
{
    // ৯৯৯ এনামে না থাকায় এই ব্লকে প্রবেশ করবে না
}
\`\`\`

---

## সুইচ এক্সপ্রেশনে এনাম হ্যান্ডলিং

আধুনিক সি#-এ সুইচ এক্সপ্রেশন এনামের সাথে অত্যন্ত কার্যকর। কোনো এনাম সদস্য মিস হলে কম্পাইলার সতর্কতা (CS8509) দেয়:

\`\`\`csharp
public static decimal CalculateDiscount(OrderStatus status) => status switch
{
    OrderStatus.Draft => 0.00m,
    OrderStatus.Submitted => 0.05m,
    OrderStatus.Processing => 0.05m,
    OrderStatus.Shipped => 0.10m,
    OrderStatus.Delivered => 0.15m,
    OrderStatus.Cancelled => 0.00m,
    _ => throw new ArgumentOutOfRangeException(nameof(status), $"Unexpected status: {status}")
};
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem V (Comparison)
*একটি গাণিতিক তুলনামূলক সমীকরণ \`A S B\` ফরম্যাটে দেওয়া থাকবে (যেখানে $S$ হলো \`<\`, \`>\`, বা \`=\`)। সমীকরণটি সঠিক হলে \`Right\` অন্যথায় \`Wrong\` প্রিন্ট করতে হবে।*

#### সমাধান বিশ্লেষণ
১. তুলনামূলক অপারেটরগুলোকে (\`<\`, \`>\`, \`=\`) একটি \`ComparisonOperator\` এনাম হিসেবে মডেল করা।
২. অপারেন্ড দুটি এবং অপারেটর ইনপুট নেওয়া।
৩. ক্যারেক্টারটিকে কাস্ট করে এনামে রূপান্তর করা।
৪. সুইচ এক্সপ্রেশন দিয়ে তুলনা করে ফলাফল প্রদর্শন করা।

#### C# সমাধান

\`\`\`csharp
using System;

public enum ComparisonOperator
{
    LessThan = '<',
    GreaterThan = '>',
    Equal = '='
}

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
        if (tokens.Length < 3)
        {
            return;
        }

        int a = int.Parse(tokens[0]);
        char opChar = tokens[1][0];
        int b = int.Parse(tokens[2]);

        ComparisonOperator op = (ComparisonOperator)opChar;
        bool isCorrect = Evaluate(a, op, b);

        Console.WriteLine(isCorrect ? "Right" : "Wrong");
    }

    public static bool Evaluate(int a, ComparisonOperator op, int b) => op switch
    {
        ComparisonOperator.LessThan => a < b,
        ComparisonOperator.GreaterThan => a > b,
        ComparisonOperator.Equal => a == b,
        _ => throw new ArgumentOutOfRangeException(nameof(op), $"Unrecognized operator: {op}")
    };
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, তিনটি টোকেন পার্সিং ও তুলনা ধ্রুবক সময়ে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, স্ট্যাকে প্রিমিটিভ ভ্যালুর সীমিত মেমোরি প্রয়োজন হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Comparison](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/V) | Easy | Relational operators, Strong typing, Switch expressions |
| ⚪ | Codeforces | [Assiut Sheet #1: Mathematical Expression](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/W) | Easy | Arithmetic operators, Enum modeling, Parsing |
| ⚪ | Exercism C# | [Resistor Color](https://exercism.org/tracks/csharp/exercises/resistor-color) | Easy | Enum mapping, String parsing, Underlying integral values |
| ⚪ | Exercism C# | [Resistor Color Duo](https://exercism.org/tracks/csharp/exercises/resistor-color-duo) | Easy | Multi-band decoding, Enum indexing, Value extraction |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Comparison",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/V",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Conditionals", "Enum", "Switch Expressions"],
      solutionEn:
        "Model relational operators (<, >, =) using a strongly typed enum, evaluate the boolean condition with a switch expression, and print 'Right' or 'Wrong'.",
      solutionBn:
        "রিলেশনাল অপারেটরগুলোকে (<, >, =) স্ট্রংলি টাইপড এনাম দিয়ে মডেল করে সুইচ এক্সপ্রেশনের সাহায্যে যাচাই করে 'Right' অথবা 'Wrong' প্রিন্ট করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Mathematical Expression",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/W",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Arithmetic", "Enum", "Validation"],
      solutionEn:
        "Parse an arithmetic equation string, map operators (+, -, *) to an enum representation, compute the actual result, and verify against the given answer.",
      solutionBn:
        "গাণিতিক সমীকরণ পার্স করে অপারেটরকে এনামে রূপান্তর করুন, সঠিক ফলাফল গণনা করে প্রদত্ত উত্তরের সাথে মিলিয়ে দেখুন।",
    },
    {
      source: "Exercism C#",
      name: "Resistor Color",
      url: "https://exercism.org/tracks/csharp/exercises/resistor-color",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Enum", "Strings", "Parsing"],
      solutionEn:
        "Map resistor color bands to standard integer resistance values using an underlying enum and parse incoming color names safely with Enum.TryParse.",
      solutionBn:
        "রোধকের কালার ব্যান্ডগুলোকে এনাম দিয়ে রিপ্রেজেন্ট করুন এবং Enum.TryParse দিয়ে ইনপুট স্ট্রিং থেকে সঠিক মান বের করুন।",
    },
    {
      source: "Exercism C#",
      name: "Resistor Color Duo",
      url: "https://exercism.org/tracks/csharp/exercises/resistor-color-duo",
      difficulty: "EASY",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Enum", "Arrays", "Math"],
      solutionEn:
        "Extract the numerical resistance codes of the first two color bands via enum casting, combining them as tens and units digits.",
      solutionBn:
        "প্রথম দুটি কালার ব্যান্ডের এনাম মান বের করে তাদের যথাক্রমে দশক ও একক স্থানীয় অঙ্ক হিসেবে যুক্ত করে রোধের মান গণনা করুন।",
    },
  ],
};
