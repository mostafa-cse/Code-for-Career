import type { LocalLesson } from "@/lib/lessons-data";

export const linqSelectmanyLesson: LocalLesson = {
  slug: "linq-selectmany",
  titleEn: "LINQ SelectMany (Flattening)",
  titleBn: "সিলেক্ট-মেনি (SelectMany) ও কালেকশন ফ্ল্যাটেনিং",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকিউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Flattening nested sequences (1-to-many relationships), Cartesian cross products, monadic bind semantics, and intermediate projection overloads.",
  descriptionBn:
    "নেস্টেড সিকোয়েন্স ফ্ল্যাটেন করা (১-টু-মেনি সম্পর্ক), কার্টেসিয়ান ক্রস প্রোডাক্ট, মোনাডিক বাইন্ড সিম্যান্টিক্স এবং ইন্টারমিডিয়েট প্রজেকশন।",
  difficulty: "MEDIUM",
  displayOrder: 3,
  prerequisites: ["linq-select"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# LINQ SelectMany (Flattening) in C#

While the \`Select\` operator projects each element into a single output element ($1 \\to 1$), **\`SelectMany\` flattens nested sequences into a single continuous sequence** ($1 \\to \\text{many}$).

In functional programming, \`SelectMany\` is known as **\`flatMap\`** or the monadic **\`bind\`** operator. It enables seamless traversal across one-to-many object hierarchies and generation of Cartesian products.

---

## Under the Hood: Nested Streaming Enumerator

At runtime, \`SelectMany\` implements the equivalent of two nested \`foreach\` loops within a single streaming state machine:

\`\`\`csharp
// Conceptual equivalent inside LINQ to Objects
public static IEnumerable<TResult> SelectManyIterator<TSource, TCollection, TResult>(
    IEnumerable<TSource> source,
    Func<TSource, IEnumerable<TCollection>> collectionSelector,
    Func<TSource, TCollection, TResult> resultSelector)
{
    foreach (TSource outer in source)
    {
        foreach (TCollection inner in collectionSelector(outer))
        {
            yield return resultSelector(outer, inner);
        }
    }
}
\`\`\`

### Key Architectural Traits:
1. **True Lazy Streaming**: It does not buffer the inner sequences into memory. When the caller asks for the next item via \`MoveNext()\`, \`SelectMany\` pulls from the current inner enumerator until exhausted, then advances the outer enumerator.
2. **Zero Nested Allocations**: It avoids allocating intermediate lists or temporary flattened buffers.

---

## Select vs SelectMany Comparison

| Characteristic | \`Select\` ($1 \\to 1$) | \`SelectMany\` ($1 \\to \\text{many}$) |
| :--- | :--- | :--- |
| **Input Type** | \`IEnumerable<TSource>\` | \`IEnumerable<TSource>\` |
| **Selector Return Type** | \`Func<TSource, TResult>\` | \`Func<TSource, IEnumerable<TSub>>\` |
| **Emitted Sequence** | \`IEnumerable<TResult>\` | \`IEnumerable<TSub>\` (Flattened) |
| **Nested Dimension** | Preserves nesting (e.g. \`IEnumerable<List<int>>\`) | Collapses nesting into 1D (\`IEnumerable<int>\`) |
| **Use Case** | Scalar mapping, DTO conversion | Hierarchy flattening, Cartesian products |

---

## Overloads & Cartesian Cross Products

\`SelectMany\` provides two core overloads:

### 1. Simple Sequence Flattening:
\`\`\`csharp
public static IEnumerable<TResult> SelectMany<TSource, TResult>(
    this IEnumerable<TSource> source,
    Func<TSource, IEnumerable<TResult>> selector);
\`\`\`

\`\`\`csharp
List<List<int>> matrix = new()
{
    new() { 1, 2, 3 },
    new() { 4, 5, 6 }
};

IEnumerable<int> flat = matrix.SelectMany(row => row);
// Yields: 1, 2, 3, 4, 5, 6
\`\`\`

### 2. Intermediate Result Selector (Cartesian Products & Cross Joins):
\`\`\`csharp
public static IEnumerable<TResult> SelectMany<TSource, TCollection, TResult>(
    this IEnumerable<TSource> source,
    Func<TSource, IEnumerable<TCollection>> collectionSelector,
    Func<TSource, TCollection, TResult> resultSelector);
\`\`\`

This overload preserves access to the **parent element** without needing closure captures:

\`\`\`csharp
var suits = new[] { "Clubs", "Diamonds", "Hearts", "Spades" };
var ranks = new[] { "A", "K", "Q", "J" };

var deck = suits.SelectMany(
    suit => ranks,
    (suit, rank) => $"{rank} of {suit}"
);
// Emits 16 items: "A of Clubs", "K of Clubs", ... "J of Spades"
\`\`\`

### Enterprise Database Impact: SQL CROSS APPLY / LATERAL JOIN
In Entity Framework Core, \`SelectMany\` translates directly to a SQL \`CROSS APPLY\` (SQL Server) or \`JOIN LATERAL\` (PostgreSQL):

\`\`\`csharp
// Translates to:
// SELECT [o].[Id], [o].[TotalAmount], [i].[ProductName]
// FROM [Orders] AS [o]
// CROSS APPLY [o].[Items] AS [i]
var orderItems = await dbContext.Orders
    .SelectMany(o => o.Items, (order, item) => new { order.Id, item.ProductName })
    .ToListAsync();
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Parsing Multi-Line Token Streams
*Given multiple lines of space-delimited numbers, flatten all tokens into a single sequence of integers, calculate their total sum, and count.*

#### Algorithmic Analysis
1. Represent lines of input as an \`IEnumerable<string>\`.
2. Apply \`.SelectMany(line => line.Split(' ', StringSplitOptions.RemoveEmptyEntries))\` to flatten token arrays from all lines into a continuous 1D stream of strings.
3. Project each token with \`.Select(int.Parse)\`.
4. Materialize and compute metrics in $\\mathcal{O}(N)$ streaming time.

#### C# Implementation

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var rawLines = new List<string>
        {
            "10 20 30",
            "  40   50 ",
            "60 70 80 90"
        };

        // Flatten nested space-delimited tokens across all lines into a 1D int stream
        var numbers = rawLines
            .SelectMany(line => line.Split(' ', StringSplitOptions.RemoveEmptyEntries))
            .Select(int.Parse)
            .ToList();

        long sum = numbers.Sum();
        int count = numbers.Count;

        Console.WriteLine($"Count: {count}, Sum: {sum}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(T)$ where $T$ is the total number of characters across all lines. Splitting and token flattening run in linear time.
- **Space Complexity**: $\\mathcal{O}(N)$ where $N$ is the number of integer tokens materialized into the output list.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Exercism C# | [Flatten Array](https://exercism.org/tracks/csharp/exercises/flatten-array) | Easy | Recursive flattening, Null handling |
| ⚪ | Exercism C# | [Anagram](https://exercism.org/tracks/csharp/exercises/anagram) | Medium | \`SelectMany\`, Character permutations |
| ⚪ | Exercism C# | [Matrix](https://exercism.org/tracks/csharp/exercises/matrix) | Medium | 2D array projections, Rows and Columns |
| ⚪ | Codeforces | [Assiut Sheet #4: Conversion](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/G) | Easy | Multi-string transformations, Token streams |
`,

  contentBn: `# C# এ সিলেক্ট-মেনি (SelectMany) ও কালেকশন ফ্ল্যাটেনিং

LINQ-এ যেখানে \`Select\` অপারেটর প্রতিটি উপাদানকে একক উপাদানে রূপান্তর করে ($১ \\to ১$), সেখানে **\`SelectMany\` নেস্টেড কালেকশনকে একটি একক সমতল (১-ডাইমেনশনাল) সিকোয়েন্সে রূপান্তর বা ফ্ল্যাটেন করে** ($১ \\to \\text{অনেক}$)।

ফাংশনাল প্রোগ্রামিংয়ে \`SelectMany\` কে **\`flatMap\`** অথবা মোনাডিক **\`bind\`** বলা হয়। এটি ওয়ান-টু-মেনি (1-to-Many) অবজেক্ট হায়ারার্কি এবং কার্টেসিয়ান ক্রস প্রোডাক্ট (Cartesian Product) তৈরি করতে ব্যবহৃত হয়।

---

## আন্ডার দ্য হুড: নেস্টেড স্ট্রিমিং এনিউমারেটর

রানটাইমে \`SelectMany\` দুটি নেস্টেড \`foreach\` লুপের সমতুল্য একটি একক স্টেট মেশিন হিসেবে কাজ করে:

\`\`\`csharp
// LINQ to Objects এর অভ্যন্তরীণ ধারণাগত কোড
public static IEnumerable<TResult> SelectManyIterator<TSource, TCollection, TResult>(
    IEnumerable<TSource> source,
    Func<TSource, IEnumerable<TCollection>> collectionSelector,
    Func<TSource, TCollection, TResult> resultSelector)
{
    foreach (TSource outer in source)
    {
        foreach (TCollection inner in collectionSelector(outer))
        {
            yield return resultSelector(outer, inner);
        }
    }
}
\`\`\`

### মূল আর্কিটেকচারাল বৈশিষ্ট্য:
১. **প্রকৃত লেজি স্ট্রিমিং**: এটি ভেতরের সাব-কালেকশনগুলোকে মেমরিতে জমা বা বাফার করে না। কলার যখন \`MoveNext()\` কল করে, তখন বর্তমান সাব-কালেকশন থেকে একটি করে উপাদান সরবরাহ করা হয়। সাব-কালেকশন শেষ হলে স্বয়ংক্রিয়ভাবে পরবর্তী প্যারেন্ট উপাদানে চলে যায়।
২. **জিরো ইন্টারমিডিয়েট মেমোরি**: কোনো মধ্যবর্তী লিস্ট বা টেম্পোরারি বাফার তৈরি না করে সরাসরি স্ট্রিম করে।

---

## Select বনাম SelectMany তুলনা

| বৈশিষ্ট্য | \`Select\` ($১ \\to ১$) | \`SelectMany\` ($১ \\to \\text{অনেক}$) |
| :--- | :--- | :--- |
| **ইনপুট টাইপ** | \`IEnumerable<TSource>\` | \`IEnumerable<TSource>\` |
| **সিলেক্টর রিটার্ন টাইপ** | \`Func<TSource, TResult>\` | \`Func<TSource, IEnumerable<TSub>>\` |
| **আউটপুট সিকোয়েন্স** | \`IEnumerable<TResult>\` | \`IEnumerable<TSub>\` (ফ্ল্যাটেন্ড) |
| **ডাইমেনশন** | নেস্টিং বজায় রাখে (যেমন \`IEnumerable<List<int>>\`) | নেস্টিং ভেঙে 1D করে (\`IEnumerable<int>\`) |
| **ব্যবহার** | ফিল্ড এক্সট্রাক্ট, DTO ম্যাপিং | হায়ারার্কি ফ্ল্যাটেনিং, ক্রস প্রোডাক্ট |

---

## ওভারলোড ও কার্টেসিয়ান ক্রস প্রোডাক্ট

\`SelectMany\` এর দুটি প্রধান ওভারলোড রয়েছে:

### ১. সাধারণ সিকোয়েন্স ফ্ল্যাটেনিং:
\`\`\`csharp
public static IEnumerable<TResult> SelectMany<TSource, TResult>(
    this IEnumerable<TSource> source,
    Func<TSource, IEnumerable<TResult>> selector);
\`\`\`

\`\`\`csharp
List<List<int>> matrix = new()
{
    new() { 1, 2, 3 },
    new() { 4, 5, 6 }
};

IEnumerable<int> flat = matrix.SelectMany(row => row);
// ফলাফল: 1, 2, 3, 4, 5, 6
\`\`\`

### ২. প্যারেন্ট-চাইল্ড সমন্বিত ওভারলোড (কার্টেসিয়ান প্রোডাক্ট):
\`\`\`csharp
public static IEnumerable<TResult> SelectMany<TSource, TCollection, TResult>(
    this IEnumerable<TSource> source,
    Func<TSource, IEnumerable<TCollection>> collectionSelector,
    Func<TSource, TCollection, TResult> resultSelector);
\`\`\`

এই ওভারলোডে প্যারেন্ট উপাদানের মান চাইল্ড উপাদানের সাথে সরাসরি ব্যবহার করা যায়:

\`\`\`csharp
var suits = new[] { "Clubs", "Diamonds", "Hearts", "Spades" };
var ranks = new[] { "A", "K", "Q", "J" };

var deck = suits.SelectMany(
    suit => ranks,
    (suit, rank) => $"{rank} of {suit}"
);
// মোট ১৬টি কম্বিনেশন তৈরি করে: "A of Clubs", "K of Clubs", ...
\`\`\`

### এন্টারপ্রাইজ ডেটাবেসে প্রভাব: SQL CROSS APPLY / LATERAL JOIN
Entity Framework Core-এ \`SelectMany\` সরাসরি ডেটাবেস ইঞ্জিনের \`CROSS APPLY\` (SQL Server) অথবা \`JOIN LATERAL\` (PostgreSQL) কুয়েরিতে রূপান্তর হয়:

\`\`\`csharp
// ডেটাবেসে জেনারেট করে:
// SELECT [o].[Id], [i].[ProductName]
// FROM [Orders] AS [o]
// CROSS APPLY [o].[Items] AS [i]
var orderItems = await dbContext.Orders
    .SelectMany(o => o.Items, (order, item) => new { order.Id, item.ProductName })
    .ToListAsync();
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: একাধিক লাইনের টোকেন স্ট্রিম ফ্ল্যাটেনিং
*একাধিক লাইনে স্পেস দিয়ে আলাদা করা সংখ্যা রয়েছে। সব লাইন থেকে সংখ্যাগুলোকে একটি একক সিকোয়েন্সে রূপান্তর করে মোট সংখ্যা ও যোগফল নির্ণয় করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট লাইনগুলোকে \`IEnumerable<string>\` হিসেবে বিবেচনা করা।
২. \`.SelectMany(line => line.Split(' ', StringSplitOptions.RemoveEmptyEntries))\` দিয়ে প্রতিটি লাইনের শব্দগুলোকে একটি একক ফ্ল্যাটেন্ড স্ট্রিমে রূপান্তর করা।
৩. \`.Select(int.Parse)\` দিয়ে স্ট্রিং থেকে সংখ্যায় রূপান্তর করা।
৪. \`.Sum()\` ও \`.Count\` এর মাধ্যমে ফলাফল বের করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var rawLines = new List<string>
        {
            "10 20 30",
            "  40   50 ",
            "60 70 80 90"
        };

        var numbers = rawLines
            .SelectMany(line => line.Split(' ', StringSplitOptions.RemoveEmptyEntries))
            .Select(int.Parse)
            .ToList();

        long sum = numbers.Sum();
        int count = numbers.Count;

        Console.WriteLine($"Count: {count}, Sum: {sum}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(T)$, যেখানে $T$ হলো সমস্ত লাইনের মোট ক্যারেক্টার সংখ্যা। স্ট্রিং স্প্লিট ও স্ট্রিমিং লিনিয়ার সময়ে কাজ করে।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(N)$, যেখানে $N$ হলো মোট পার্স করা পূর্ণসংখ্যার সংখ্যা।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Exercism C# | [Flatten Array](https://exercism.org/tracks/csharp/exercises/flatten-array) | Easy | Recursive flattening, Null handling |
| ⚪ | Exercism C# | [Anagram](https://exercism.org/tracks/csharp/exercises/anagram) | Medium | \`SelectMany\`, Character permutations |
| ⚪ | Exercism C# | [Matrix](https://exercism.org/tracks/csharp/exercises/matrix) | Medium | 2D array projections, Rows and Columns |
| ⚪ | Codeforces | [Assiut Sheet #4: Conversion](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/G) | Easy | Multi-string transformations, Token streams |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Flatten Array",
      url: "https://exercism.org/tracks/csharp/exercises/flatten-array",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["LINQ", "SelectMany", "Flattening"],
      solutionEn:
        "Recursively flatten nested arrays containing arbitrary depth and omit null values using SelectMany or yield return.",
      solutionBn:
        "SelectMany অথবা yield return ব্যবহার করে যেকোনো গভীরতার নেস্টেড অ্যারেকে ফ্ল্যাটেন করুন এবং নাল ভ্যালু বাদ দিন।",
    },
    {
      source: "Exercism C#",
      name: "Anagram",
      url: "https://exercism.org/tracks/csharp/exercises/anagram",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["LINQ", "SelectMany", "Strings"],
      solutionEn:
        "Match candidate words against a target word by comparing ordered character sequences flattened with LINQ.",
      solutionBn:
        "LINQ দিয়ে সর্ট করা ক্যারেক্টার সিকোয়েন্সের তুলনা করে টার্গেট শব্দের অ্যানাগ্রাম শনাক্ত করুন।",
    },
    {
      source: "Exercism C#",
      name: "Matrix",
      url: "https://exercism.org/tracks/csharp/exercises/matrix",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["LINQ", "SelectMany", "2D Array"],
      solutionEn:
        "Extract rows and columns from string-encoded matrices using Select and SelectMany projections.",
      solutionBn:
        "Select এবং SelectMany প্রজেকশনের সাহায্যে স্ট্রিং-এনকোডেড ম্যাট্রিক্স থেকে রো এবং কলাম এক্সট্র্যাক্ট করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #4: Conversion",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/G",
      difficulty: "EASY",
      company: "BJIT Group",
      tags: ["LINQ", "SelectMany", "Tokens"],
      solutionEn:
        "Flatten token streams across multi-part inputs and swap case / delimiter characters in a unified pipeline.",
      solutionBn:
        "মাল্টি-পার্ট ইনপুট থেকে টোকেন স্ট্রিম ফ্ল্যাটেন করুন এবং ক্যারেক্টারের কেইস ও ডিলিমিটার পরিবর্তন করুন।",
    },
  ],
};
