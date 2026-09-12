import type { LocalLesson } from "@/lib/lessons-data";

export const linqIqueryableLesson: LocalLesson = {
  slug: "linq-iqueryable",
  titleEn: "IQueryable<T> (LINQ to Entities)",
  titleBn: "আই-কুয়েরিয়েবল (IQueryable<T>) বনাম IEnumerable<T>",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুピング, জয়েন, ডিফার্ড এক্সিকিউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "CORE",
  descriptionEn:
    "Expression trees, IQueryProvider, AST parsing, SQL translation in Entity Framework Core, and preventing client-side memory exhaustion.",
  descriptionBn:
    "এক্সপ্রেশন ট্রি, IQueryProvider, অ্যাবস্ট্রাক্ট সিনট্যাক্স ট্রি (AST), EF Core এ SQL অনুবাদ এবং ক্লায়েন্ট মেমোরি ক্র্যাশ প্রতিরোধ।",
  difficulty: "MEDIUM",
  displayOrder: 14,
  prerequisites: ["linq-ienumerable"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# IQueryable<T> vs IEnumerable<T> in C#

The distinction between **\`IEnumerable<T>\`** and **\`IQueryable<T>\`** is one of the most critical architectural concepts in .NET backend development. It dictates whether a query executes in local application memory or is translated into native SQL by an external database engine.

---

## The Core Interface Contracts

\`\`\`
   IEnumerable<T>                 IQueryable<T>
  (System.Linq.Enumerable)       (System.Linq.Queryable)
         │                              │
         ▼                              ▼
  Takes Func<T, bool>             Takes Expression<Func<T, bool>>
  (Compiled IL Bytecode)         (Data Structure / Abstract Syntax Tree)
         │                              │
         ▼                              ▼
  Client-Side Evaluation          Server-Side Evaluation
  (Local CPU & Memory)           (Remote SQL Database Engine)
\`\`\`

### The \`IQueryable<T>\` Contract:
\`\`\`csharp
public interface IQueryable<out T> : IEnumerable<T>, IQueryable
{
    Expression Expression { get; }       // The AST representing the query
    Type ElementType { get; }            // Type of sequence elements
    IQueryProvider Provider { get; }     // The database query translation engine
}
\`\`\`

---

## Expression Trees vs Compiled Delegates

The fundamental difference lies in how lambdas are passed to extension methods:

### 1. In \`IEnumerable<T>\` (Compiled Delegate):
\`\`\`csharp
public static IEnumerable<TSource> Where<TSource>(
    this IEnumerable<TSource> source, 
    Func<TSource, bool> predicate);
\`\`\`
- A \`Func<T, bool>\` is **compiled IL bytecode**.
- The CLR cannot inspect its inner logic; it can only execute it blindly for each element in memory.

### 2. In \`IQueryable<T>\` (Expression Tree):
\`\`\`csharp
public static IQueryable<TSource> Where<TSource>(
    this IQueryable<TSource> source, 
    Expression<Func<TSource, bool>> predicate);
\`\`\`
- An \`Expression<Func<T, bool>>\` is **code represented as data** (an Abstract Syntax Tree - AST).
- The \`IQueryProvider\` (e.g., Entity Framework Core) inspects the AST nodes (binary operators, properties, constants) and translates them into an equivalent SQL query: \`WHERE [c].[Age] > 25\`.

---

## The Catastrophic Client-Side Evaluation Hazard

Accidentally converting an \`IQueryable<T>\` into an \`IEnumerable<T>\` before filtering is one of the leading causes of production database failures:

\`\`\`csharp
// CATASTROPHIC DISASTER:
// Casting to IEnumerable forces EF Core to download the ENTIRE table into RAM!
IEnumerable<Customer> customers = dbContext.Customers; // Generates: SELECT * FROM [Customers]
var vip = customers.Where(c => c.IsVip).ToList();      // Filters 1,000,000 rows in client RAM!

// OPTIMAL ARCHITECTURE:
// Remains IQueryable until materialization.
IQueryable<Customer> query = dbContext.Customers;
var vip = await query
    .Where(c => c.IsVip) // Translates to: SELECT [c]... FROM [Customers] WHERE [c].[IsVip] = 1
    .ToListAsync();      // Transfers only matching rows across the network!
\`\`\`

---

## Architectural Comparison Matrix

| Dimension | \`IEnumerable<T>\` | \`IQueryable<T>\` |
| :--- | :--- | :--- |
| **Namespace** | \`System.Linq.Enumerable\` | \`System.Linq.Queryable\` |
| **Extension Target** | In-memory collections (\`List<T>\`, arrays) | Remote out-of-process stores (SQL, CosmosDB) |
| **Argument Representation** | Compiled delegates (\`Func<T, bool>\`) | Expression trees (\`Expression<Func<T, bool>>\`) |
| **Execution Location** | Application server RAM/CPU | Database engine (SQL Server, Postgres) |
| **Paging Performance** | \`Skip\`/\`Take\` downloads all rows first | \`OFFSET\` and \`FETCH\` execute on DB server |
| **Compilation to Delegate**| Already compiled | Can compile via \`expr.Compile()\` |

---

## Compiling Expression Trees to Delegates

You can programmatically compile an expression tree into a callable delegate at runtime using \`.Compile()\`:

\`\`\`csharp
using System;
using System.Linq.Expressions;

Expression<Func<int, int, int>> addExpr = (a, b) => a + b;

// Compile expression tree data structure into an executable delegate:
Func<int, int, int> addFunc = addExpr.Compile();

int result = addFunc(15, 25); // Evaluates to 40
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem V (Comparison)
*Given an arithmetic expression containing two integers and a relational operator ($A < B$, $A > B$, or $A = B$). Print "Right" if the expression is correct, otherwise print "Wrong".*

#### Algorithmic Analysis
1. Read integers $A, B$ and comparison symbol $S$.
2. In expression tree compilation and query engines, relational operators map directly to AST nodes (\`Expression.LessThan\`, \`Expression.GreaterThan\`, \`Expression.Equal\`).
3. Evaluate the relational constraint directly and emit validation status.

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
        if (tokens.Length < 3)
        {
            return;
        }

        int a = int.Parse(tokens[0]);
        string op = tokens[1];
        int b = int.Parse(tokens[2]);

        bool isValid = op switch
        {
            "<" => a < b,
            ">" => a > b,
            "=" => a == b,
            _ => false
        };

        Console.WriteLine(isValid ? "Right" : "Wrong");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, constant-time parsing and comparison evaluation.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Comparison](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/V) | Easy | Relational evaluation, Comparison operators |
| ⚪ | Codeforces | [Assiut Sheet #1: Float or int](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/U) | Easy | Data types, Truncation, Numerical parsing |
| ⚪ | Exercism C# | [Book Store](https://exercism.org/tracks/csharp/exercises/book-store) | Hard | Dynamic programming, Expression optimization |
| ⚪ | Exercism C# | [House](https://exercism.org/tracks/csharp/exercises/house) | Medium | Recursive building, Expression composition |
`,

  contentBn: `# C# এ আই-কুয়েরিয়েবল (IQueryable<T>) বনাম IEnumerable<T>

.NET ব্যাকএন্ড আর্কিটেকচারে **\`IEnumerable<T>\`** এবং **\`IQueryable<T>\`** এর পার্থক্য অন্যতম গুরুত্বপূর্ণ বিষয়। আপনার লেখা কুয়েরি কি অ্যাপ্লিকেশনের লোকাল মেমরিতে চলবে নাকি ডেটাবেস সার্ভারে গিয়ে নেটিভ SQL হিসেবে এক্সিকিউট হবে, তা এই ইন্টারফেসের ওপর নির্ভর করে।

---

## ইন্টারফেস চুক্তি ও এক্সিকিউশন ডায়াগ্রাম

\`\`\`
   IEnumerable<T>                 IQueryable<T>
  (System.Linq.Enumerable)       (System.Linq.Queryable)
         │                              │
         ▼                              ▼
  নেয় Func<T, bool>             নেয় Expression<Func<T, bool>>
  (কম্পাইল করা IL বাইটকোড)         (ডেটা স্ট্রাকচার / সিনট্যাক্স ট্রি)
         │                              │
         ▼                              ▼
  ক্লায়েন্ট-সাইড এক্সিকিউশন       সার্ভার-সাইড এক্সিকিউশন
  (লোকাল প্রসেসর ও মেমোরি)         (রিমোট SQL ডেটাবেস ইঞ্জিন)
\`\`\`

### \`IQueryable<T>\` এর মূল ইন্টারফেস:
\`\`\`csharp
public interface IQueryable<out T> : IEnumerable<T>, IQueryable
{
    Expression Expression { get; }       // কুয়েরির সিনট্যাক্স ট্রি (AST)
    Type ElementType { get; }            // কালেকশনের উপাদান টাইপ
    IQueryProvider Provider { get; }     // ডেটাবেস অনুবাদ ইঞ্জিন
}
\`\`\`

---

## এক্সপ্রেশন ট্রি বনাম কম্পাইল্ড ডেলিগেট

পার্থক্যটি মূলত ল্যাম্বডা এক্সপ্রেশনের অভ্যন্তরীণ ফরম্যাটে নিহিত:

### ১. \`IEnumerable<T>\` এ (কম্পাইল্ড ডেলিগেট):
\`\`\`csharp
public static IEnumerable<TSource> Where<TSource>(
    this IEnumerable<TSource> source, 
    Func<TSource, bool> predicate);
\`\`\`
- \`Func<T, bool>\` হলো সরাসরি **মেশিন কোডে কম্পাইল করা ডেলিগেট**।
- CLR এর ভেতরে কী লজিক আছে তা দেখতে পারে না; এটি কেবল মেমরিতে থাকা প্রতিটি উপাদানের জন্য ফাংশনটি এক্সিকিউট করতে পারে।

### ২. \`IQueryable<T>\` এ (এক্সপ্রেশন ট্রি):
\`\`\`csharp
public static IQueryable<TSource> Where<TSource>(
    this IQueryable<TSource> source, 
    Expression<Func<TSource, bool>> predicate);
\`\`\`
- \`Expression<Func<T, bool>>\` হলো **ডেটা স্ট্রাকচার হিসেবে উপস্থাপিত কোড** (Abstract Syntax Tree - AST)।
- \`IQueryProvider\` (যেমন Entity Framework Core) এই ট্রির নোডগুলো পড়ে সেটিকে সরাসরি SQL কুয়েরিতে অনুবাদ করে: \`WHERE [c].[Age] > 25\`।

---

## ক্লায়েন্ট-সাইড মেমোরি ক্র্যাশের মারাত্মক ভুল

ফিল্টার করার আগে \`IQueryable<T>\` কে \`IEnumerable<T>\`-এ রূপান্তর করা প্রোডাকশন সিস্টেমে মারাত্মক মেমোরি আউটেজ তৈরি করে:

\`\`\`csharp
// মারাত্মক ভুল:
// IEnumerable এ কাস্ট করায় পুরো টেবিলের কোটি ডেটা মেমরিতে ডাউনলোড হবে!
IEnumerable<Customer> customers = dbContext.Customers; // ডেটাবেসে চলে: SELECT * FROM [Customers]
var vip = customers.Where(c => c.IsVip).ToList();      // র‍্যামে কোটি ডেটা ফিল্টার করে সার্ভার ক্র্যাশ করবে!

// সঠিক আর্কিটেকচার:
// মেটেরিয়ালাইজেশনের আগ পর্যন্ত IQueryable বজায় রাখা
IQueryable<Customer> query = dbContext.Customers;
var vip = await query
    .Where(c => c.IsVip) // ডেটাবেসে চলে: SELECT [c]... FROM [Customers] WHERE [c].[IsVip] = 1
    .ToListAsync();      // নেটওয়ার্ক দিয়ে শুধু প্রয়োজনীয় ৫০টি রো আসবে!
\`\`\`

---

## তুলনামূলক বিশ্লেষণ সারণী

| বৈশিষ্ট্য | \`IEnumerable<T>\` | \`IQueryable<T>\` |
| :--- | :--- | :--- |
| **নেমস্পেস** | \`System.Linq.Enumerable\` | \`System.Linq.Queryable\` |
| **টার্গেট** | ইন-মেমোরি কালেকশন (\`List<T>\`, অ্যারে) | রিমোট ডেটাবেস (SQL Server, Postgres) |
| **প্যারামিটার** | কম্পাইল্ড ডেলিগেট (\`Func<T, bool>\`) | এক্সপ্রেশন ট্রি (\`Expression<Func<T, bool>>\`) |
| **এক্সিকিউশন স্থান** | অ্যাপ্লিকেশন সার্ভারের মেমোরি ও সিপিইউ | ডেটাবেস ইঞ্জিন |
| **পেজিনেশন** | সব ডেটা ডাউনলোড করে র‍্যামে স্লাইস করে | ডেটাবেস সার্ভারে \`OFFSET\` ও \`FETCH\` চালায় |
| **ডেলিগেটে রূপান্তর** | আগেই কম্পাইল করা | \`expr.Compile()\` দিয়ে রূপান্তরযোগ্য |

---

## এক্সপ্রেশন ট্রিকে ডেলিগেটে রূপান্তর

রানটাইমে \`.Compile()\` মেথড ডেকে একটি এক্সপ্রেশন ট্রিকে সরাসরি এক্সিকিউটেবল ডেলিগেটে রূপান্তর করা যায়:

\`\`\`csharp
using System;
using System.Linq.Expressions;

Expression<Func<int, int, int>> addExpr = (a, b) => a + b;

// এক্সপ্রেশন ট্রিকে সরাসরি এক্সিকিউটেবল ডেলিগেটে কম্পাইল করা:
Func<int, int, int> addFunc = addExpr.Compile();

int result = addFunc(15, 25); // ফলাফল: ৪০
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem V (Comparison)
*দুটি পূর্ণসংখ্যা এবং একটি রিলেশনাল অপারেটর ($A < B$, $A > B$, অথবা $A = B$) দেওয়া থাকবে। সম্পর্কটি সঠিক হলে "Right" অন্যথায় "Wrong" প্রিন্ট করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে সংখ্যা $A, B$ এবং তুলনা প্রতীক $S$ রিড করা।
২. কুয়েরি প্রোভাইডারের মতো রিলেশনাল অপারেটরের ভিত্তিতে শর্ত মূল্যায়ন করা।
৩. শর্ত সত্য হলে "Right" অন্যথায় "Wrong" প্রদর্শন করা।

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
        if (tokens.Length < 3)
        {
            return;
        }

        int a = int.Parse(tokens[0]);
        string op = tokens[1];
        int b = int.Parse(tokens[2]);

        bool isValid = op switch
        {
            "<" => a < b,
            ">" => a > b,
            "=" => a == b,
            _ => false
        };

        Console.WriteLine(isValid ? "Right" : "Wrong");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, কনস্ট্যান্ট টাইমে পার্সিং ও তুলনা।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Comparison](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/V) | Easy | Relational evaluation, Comparison operators |
| ⚪ | Codeforces | [Assiut Sheet #1: Float or int](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/U) | Easy | Data types, Truncation, Numerical parsing |
| ⚪ | Exercism C# | [Book Store](https://exercism.org/tracks/csharp/exercises/book-store) | Hard | Dynamic programming, Expression optimization |
| ⚪ | Exercism C# | [House](https://exercism.org/tracks/csharp/exercises/house) | Medium | Recursive building, Expression composition |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Comparison",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/V",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Conditionals", "Comparison", "Expressions"],
      solutionEn:
        "Evaluate boolean relational equality and inequality operators and output Right or Wrong accordingly.",
      solutionBn:
        "বুলিয়ান সমতা ও অসমতা অপারেটর মূল্যায়ন করে শর্ত অনুযায়ী Right বা Wrong প্রদর্শন করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Float or int",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/U",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Types", "Math", "Parsing"],
      solutionEn:
        "Check whether a floating-point number has a non-zero fractional decimal component or represents an integer.",
      solutionBn:
        "একটি দশমিক সংখ্যার ভগ্নাংশ শূন্য কি না তা যাচাই করে সংখ্যাটি int নাকি float তা নির্ধারণ করুন।",
    },
    {
      source: "Exercism C#",
      name: "Book Store",
      url: "https://exercism.org/tracks/csharp/exercises/book-store",
      difficulty: "HARD",
      company: "Enosis Solutions",
      tags: ["LINQ", "Dynamic Programming", "Optimization"],
      solutionEn:
        "Find the minimum total price for sets of books by grouping different titles and optimizing discount structures.",
      solutionBn:
        "বিভিন্ন বইয়ের টাইটেল গ্রুপ করে ডিসকাউন্ট অপ্টিমাইজেশনের মাধ্যমে সর্বনিম্ন মোট মূল্য নির্ণয় করুন।",
    },
    {
      source: "Exercism C#",
      name: "House",
      url: "https://exercism.org/tracks/csharp/exercises/house",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["LINQ", "Recursion", "Strings"],
      solutionEn:
        "Generate cumulative nursery rhyme verses using functional sequence aggregation and recursive phrasing.",
      solutionBn:
        "ফাংশনাল সিকোয়েন্স এগ্রিগেশন এবং রিকার্সিভ বাক্যাংশের সাহায্যে ছড়ার ক্রমবর্ধমান শ্লোকগুলো তৈরি করুন।",
    },
  ],
};
