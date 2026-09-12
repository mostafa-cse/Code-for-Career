import type { LocalLesson } from "@/lib/lessons-data";

export const linqSelectLesson: LocalLesson = {
  slug: "linq-select",
  titleEn: "LINQ Select (Projection)",
  titleBn: "সিলেক্ট (Select) ও ডেটা প্রোজেকশন",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকিউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "CORE",
  descriptionEn:
    "Transforming sequences, 1-to-1 projections, DTO mapping, anonymous types, tuple projections, and EF Core column-trimming optimizations.",
  descriptionBn:
    "সিকোয়েন্স রূপান্তর, ১-টু-১ প্রজেকশন, DTO ম্যাপিং, অ্যানোনিমাস টাইপ, টাপল প্রজেকশন এবং EF Core এর কলাম-ট্রিমিং অপ্টিমাইজেশন।",
  difficulty: "EASY",
  displayOrder: 2,
  prerequisites: ["linq-where"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# LINQ Select (Projection) in C#

The **\`Select\`** operator is the core transformation and projection mechanism in LINQ. It maps each element of an input sequence \`IEnumerable<TSource>\` into a new form \`IEnumerable<TResult>\`, guaranteeing an exact 1-to-1 cardinal mapping between input and output elements.

---

## Under the Hood: The Streaming Projection Iterator

When calling \`source.Select(selector)\`:
1. **Zero Intermediate Allocation**: The method returns a compiler-generated iterator (\`SelectEnumerableIterator<TSource, TResult>\`). No destination array or list is allocated on the heap during invocation.
2. **On-Demand Evaluation**: The transformation lambda is executed lazily as each item is pulled via \`MoveNext()\` during enumeration (such as in a \`foreach\` loop or \`ToList()\`).
3. **Cardinality Invariant**: For any input sequence of length $N$, \`Select\` will always emit exactly $N$ items. It never filters out or duplicates items (unlike \`Where\` or \`SelectMany\`).

---

## Projection Targets: DTOs, Anonymous Types, and Tuples

In enterprise applications, projecting entities into specialized models prevents over-fetching and isolates internal domain structures:

| Projection Target | Example Syntax | Memory & Scope Characteristics |
| :--- | :--- | :--- |
| **Scalar Value** | \`users.Select(u => u.Email)\` | Extracts single primitives or reference types. Zero object overhead. |
| **Anonymous Type** | \`users.Select(u => new { u.Id, u.Name })\` | Heap-allocated, immutable reference type. Scoped only within the local method. |
| **Named DTO / Record** | \`users.Select(u => new UserDto(u.Id, u.Name))\` | Strong type safety, serializable across architectural boundaries. |
| **ValueTuple (C# 7+)** | \`users.Select(u => (u.Id, u.Name))\` | Stack-allocated value type structure. Avoids heap GC pressure entirely. |

### Enterprise Database Impact: EF Core Column Trimming
When working with Entity Framework Core, projecting with \`Select\` before materialization instructs the query provider to emit specific SQL columns:

\`\`\`csharp
// Catastrophic: Generates 'SELECT * FROM Customers' fetching 40+ columns
var customerEmails = await dbContext.Customers.ToListAsync();
var emails = customerEmails.Select(c => c.Email);

// Optimal: Translates to 'SELECT [c].[Email] FROM [Customers]'
var optimizedEmails = await dbContext.Customers
    .Select(c => c.Email)
    .ToListAsync();
\`\`\`

---

## Overloads & Index-Based Projection

LINQ provides an index-aware overload of \`Select\`:

\`\`\`csharp
public static IEnumerable<TResult> Select<TSource, TResult>(
    this IEnumerable<TSource> source, 
    Func<TSource, int, TResult> selector);
\`\`\`

The second argument receives the zero-based index of the element:

\`\`\`csharp
string[] rankings = { "Alice", "Bob", "Charlie" };

var leaderBoard = rankings.Select((name, index) => $"Rank {index + 1}: {name}");
// Emits: "Rank 1: Alice", "Rank 2: Bob", "Rank 3: Charlie"
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem F (Digits Summation)
*Given two numbers $N$ and $M$. Print the summation of their last digits.*

#### Algorithmic Analysis
1. Read the input line containing space-separated numbers as strings.
2. Use \`.Select(long.Parse)\` to project string tokens into 64-bit signed integers.
3. Use a secondary \`.Select(x => Math.Abs(x) % 10)\` projection to extract the least significant digit (modulo 10).
4. Aggregate using \`.Sum()\` to compute the final result.

#### C# Implementation

\`\`\`csharp
using System;
using System.Linq;

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

        // Projecting strings to parsed numbers, then to last digits, and summing
        long lastDigitsSum = tokens
            .Select(long.Parse)
            .Select(val => Math.Abs(val) % 10)
            .Sum();

        Console.WriteLine(lastDigitsSum);
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(K)$ where $K$ is the number of tokens (here $K = 2$). Number parsing and modulo are constant time $\\mathcal{O}(1)$.
- **Space Complexity**: $\\mathcal{O}(K)$ for the token array, while the \`Select\` pipeline streams with $\\mathcal{O}(1)$ auxiliary memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | \`Select\`, Parsing, Modulo projection |
| ⚪ | Codeforces | [Assiut Sheet #1: Two Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/H) | Easy | Numeric transformations, Floor, Ceil, Round |
| ⚪ | Exercism C# | [Resistor Color Duo](https://exercism.org/tracks/csharp/exercises/resistor-color-duo) | Easy | Array indexing, \`Select\` color mapping |
| ⚪ | Exercism C# | [Rotational Cipher](https://exercism.org/tracks/csharp/exercises/rotational-cipher) | Medium | Character transformation, \`Select\` projection |
`,

  contentBn: `# C# এ সিলেক্ট (Select) ও ডেটা প্রোজেকশন

LINQ (Language Integrated Query)-এ রূপান্তর ও প্রজেকশনের জন্য কেন্দ্রীয় অপারেটর হলো **\`Select\`**। এটি ইনপুট সিকোয়েন্সের (\`IEnumerable<TSource>\`) প্রতিটি উপাদানকে রূপান্তরিত করে একটি নতুন সিকোয়েন্সে (\`IEnumerable<TResult>\`) রূপ দেয়। এটি ইনপুট এবং আউটপুটের মধ্যে ১-টু-১ ম্যাপিং নিশ্চিত করে।

---

## আন্ডার দ্য হুড: স্ট্রিমিং প্রজেকশন ইটারেটর

যখন \`source.Select(selector)\` কল করা হয়:
১. **কোনো তাৎক্ষণিক মেমোরি খরচ নেই**: মেথডটি কেবল একটি কম্পাইলার-জেনারেটেড ইটারেটর (\`SelectEnumerableIterator<TSource, TResult>\`) রিটার্ন করে। ইনভোকেশনের সময় হিপে কোনো লিস্ট বা অ্যারে তৈরি হয় না।
২. **চাহিদা অনুযায়ী রূপান্তর (Lazy Transformation)**: কলার যখন \`foreach\` বা \`ToList()\` এর মাধ্যমে উপাদান রিড করে (\`MoveNext()\`), ঠিক তখনই প্রতিটি উপাদানের রূপান্তর ফাংশনটি এক্সিকিউট হয়।
৩. **নির্দিষ্ট উপাদানের সংখ্যা**: $N$ সংখ্যক ইনপুট উপাদানের জন্য \`Select\` সর্বদা ঠিক $N$ সংখ্যক ফলাফল দেয়। এটি কোনো উপাদান বাদ দেয় না বা অতিরিক্ত উপাদান তৈরি করে না।

---

## প্রজেকশনের ধরন: DTO, অ্যানোনিমাস টাইপ এবং টাপল

এন্টারপ্রাইজ অ্যাপ্লিকেশনে ডেটাবেস সত্তাকে ছোট মডেলে প্রজেক্ট করলে নেটওয়ার্ক ও মেমোরি অপ্টিমাইজড থাকে:

| প্রজেকশন টাইপ | সিনট্যাক্স উদাহরণ | মেমোরি ও স্কোপ বৈশিষ্ট্য |
| :--- | :--- | :--- |
| **স্কেলার ভ্যালু** | \`users.Select(u => u.Email)\` | একক ফিল্ড বের করা। অতিরিক্ত অবজেক্টের ওভারহেড নেই। |
| **অ্যানোনিমাস টাইপ** | \`users.Select(u => new { u.Id, u.Name })\` | হিপ-অ্যালোকেটেড ইমিউটেবল রেফারেন্স টাইপ। কেবল লোকাল মেথডের মধ্যে ব্যবহার্য। |
| **নেমড DTO / Record** | \`users.Select(u => new UserDto(u.Id, u.Name))\` | স্ট্রং টাইপ সেফটি প্রদান করে, মেথড বা লেয়ারের বাইরে পাঠানো যায়। |
| **ValueTuple (C# 7+)** | \`users.Select(u => (u.Id, u.Name))\` | স্ট্যাক-অ্যালোকেটেড ভ্যালু টাইপ। হিপ মেমোরিতে কোনো GC প্রেশার তৈরি করে না। |

### এন্টারপ্রাইজ ডেটাবেসে প্রভাব: EF Core কলাম ট্রিমিং
Entity Framework Core-এ মেটেরিয়ালাইজেশনের পূর্বে \`Select\` ব্যবহার করলে ডেটাবেসে নির্দিষ্ট কলামের জন্য SQL তৈরি হয়:

\`\`\`csharp
// ক্ষতিকর: 'SELECT * FROM Customers' চালিয়ে ৪০+ অপ্রয়োজনীয় কলাম রিড করে
var customerEmails = await dbContext.Customers.ToListAsync();
var emails = customerEmails.Select(c => c.Email);

// সেরা উপায়: শুধুমাত্র 'SELECT [c].[Email] FROM [Customers]' কুয়েরি জেনারেট করে
var optimizedEmails = await dbContext.Customers
    .Select(c => c.Email)
    .ToListAsync();
\`\`\`

---

## ওভারলোড ও ইনডেক্স-সচেতন প্রজেকশন

\`Select\` অপারেটরে উপাদানের শূন্য-ভিত্তিক ইনডেক্স ব্যবহার করার সুবিধা রয়েছে:

\`\`\`csharp
public static IEnumerable<TResult> Select<TSource, TResult>(
    this IEnumerable<TSource> source, 
    Func<TSource, int, TResult> selector);
\`\`\`

ল্যাম্বডার দ্বিতীয় আর্গুমেন্টে স্বয়ংক্রিয়ভাবে ইনডেক্স পাওয়া যায়:

\`\`\`csharp
string[] rankings = { "Alice", "Bob", "Charlie" };

var leaderBoard = rankings.Select((name, index) => $"Rank {index + 1}: {name}");
// ফলাফল: "Rank 1: Alice", "Rank 2: Bob", "Rank 3: Charlie"
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem F (Digits Summation)
*দুটি সংখ্যা $N$ এবং $M$ দেওয়া থাকবে। তাদের শেষ অঙ্কের যোগফল বের করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট লাইন থেকে স্ট্রিং টোকেনগুলো রিড করা।
২. \`.Select(long.Parse)\` দিয়ে স্ট্রিং থেকে ৬৪-বিট ইন্টিজারে রূপান্তর করা।
৩. \`.Select(x => Math.Abs(x) % 10)\` প্রজেকশনের মাধ্যমে শেষ অঙ্কটি বের করা।
৪. \`.Sum()\` দিয়ে অঙ্কগুলোর যোগফল হিসাব করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Linq;

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

        long lastDigitsSum = tokens
            .Select(long.Parse)
            .Select(val => Math.Abs(val) % 10)
            .Sum();

        Console.WriteLine(lastDigitsSum);
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(K)$, যেখানে $K$ হলো ইনপুট টোকেন সংখ্যা ($K = 2$)। পার্সিং ও মডিউলো অপারেশন কনস্ট্যান্ট টাইমে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(K)$ টোকেন অ্যারের জন্য, তবে \`Select\` স্ট্রিমিং মেমোরি খরচ $\\mathcal{O}(1)$।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | \`Select\`, Parsing, Modulo projection |
| ⚪ | Codeforces | [Assiut Sheet #1: Two Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/H) | Easy | Numeric transformations, Floor, Ceil, Round |
| ⚪ | Exercism C# | [Resistor Color Duo](https://exercism.org/tracks/csharp/exercises/resistor-color-duo) | Easy | Array indexing, \`Select\` color mapping |
| ⚪ | Exercism C# | [Rotational Cipher](https://exercism.org/tracks/csharp/exercises/rotational-cipher) | Medium | Character transformation, \`Select\` projection |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Digits Summation",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["LINQ", "Select", "Math"],
      solutionEn:
        "Project input strings to parsed integers and extract modulo 10 last digits before summing them.",
      solutionBn:
        "ইনপুট স্ট্রিংগুলোকে সংখ্যায় রূপান্তর করুন এবং modulo 10 প্রজেকশনের মাধ্যমে শেষ অঙ্ক বের করে যোগ করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Two Numbers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/H",
      difficulty: "EASY",
      company: "BJIT Group",
      tags: ["LINQ", "Select", "Formatting"],
      solutionEn:
        "Transform input pairs into floor, ceil, and round mathematical projections using Math functions.",
      solutionBn:
        "Math লাইব্রেরির মাধ্যমে ইনপুট সংখ্যা জোড়াকে floor, ceil ও round মানে প্রজেক্ট করে প্রদর্শন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Resistor Color Duo",
      url: "https://exercism.org/tracks/csharp/exercises/resistor-color-duo",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["LINQ", "Select", "Array"],
      solutionEn:
        "Map resistor color name strings to their corresponding integer values using Select and take the first two digits.",
      solutionBn:
        "Select এর মাধ্যমে রেসিস্টরের রঙের নামগুলোকে নির্দিষ্ট সংখ্যায় রূপান্তর করুন এবং প্রথম দুটি সংখ্যা নিন।",
    },
    {
      source: "Exercism C#",
      name: "Rotational Cipher",
      url: "https://exercism.org/tracks/csharp/exercises/rotational-cipher",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["LINQ", "Select", "Char"],
      solutionEn:
        "Project each character in a plaintext string through a Caesar rotational shift using a functional Select transformation.",
      solutionBn:
        "ফাংশনাল Select ট্রান্সফর্মেশনের সাহায্যে প্লেইনটেক্সটের প্রতিটি ক্যারেক্টারকে সিজার সাইফারে স্থানান্তর করুন।",
    },
  ],
};
