import type { LocalLesson } from "@/lib/lessons-data";

export const linqWhereLesson: LocalLesson = {
  slug: "linq-where",
  titleEn: "LINQ Where (Filtering)",
  titleBn: "হোয়্যার (Where) ও শর্তাধীন ফিল্টারিং",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকিউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "CORE",
  descriptionEn:
    "Filtering sequences based on predicates, compiler iterator state machines, deferred streaming, index-based overloads, and memory characteristics.",
  descriptionBn:
    "প্রেডিকেটের ভিত্তিতে কালেকশন ফিল্টারিং, কম্পাইলার ইটারেটর স্টেট মেশিন, ডিফার্ড স্ট্রিমিং এবং ইনডেক্স-ভিত্তিক ওভারলোড।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["delegates-func"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# LINQ Where (Filtering) in C#

The **\`Where\`** operator is the most fundamental filtering tool in LINQ (Language Integrated Query). It filters an \`IEnumerable<T>\` sequence based on a boolean predicate.

Defined as an extension method in \`System.Linq.Enumerable\`, \`Where\` forms the starting point of nearly every data pipeline in modern .NET applications.

---

## Under the Hood: The Streaming Iterator State Machine

When you invoke \`numbers.Where(x => x > 10)\`:
1. **Zero Eager Execution**: The method executes **zero filtering logic immediately**. It simply constructs a lightweight compiler-generated enumerator object (\`WhereEnumerableIterator<T>\`).
2. **Streaming Pipeline**: Elements are evaluated one-by-one **on demand** as the caller iterates (e.g. via \`foreach\` or \`ToList()\`). Memory usage remains $\\mathcal{O}(1)$ regardless of whether the source contains 10 elements or 10,000,000 elements.
3. **Difference from \`List<T>.FindAll\`**: \`List<T>.FindAll\` immediately executes a loop and allocates a brand-new list on the heap. In contrast, \`Where\` streams elements lazily without intermediate list allocations.

---

## Overloads & Index-Based Filtering

\`Where\` provides two primary generic overloads:

### 1. Standard Predicate Overload:
\`\`\`csharp
public static IEnumerable<TSource> Where<TSource>(
    this IEnumerable<TSource> source, 
    Func<TSource, bool> predicate);
\`\`\`

### 2. Index-Aware Overload:
\`\`\`csharp
public static IEnumerable<TSource> Where<TSource>(
    this IEnumerable<TSource> source, 
    Func<TSource, int, bool> predicate);
\`\`\`
The second argument in the lambda is the zero-based index of the current element in the sequence:

\`\`\`csharp
var items = new[] { "A", "B", "C", "D", "E" };

// Select elements at even indices (index 0, 2, 4):
var evenIndexItems = items.Where((val, index) => index % 2 == 0);
// Yields: "A", "C", "E"
\`\`\`

---

## Chaining Multiple Where Clauses

You can chain multiple \`Where\` clauses sequentially:

\`\`\`csharp
var activeAdmins = users
    .Where(u => u.IsActive)
    .Where(u => u.Role == Role.Admin);
\`\`\`

The Roslyn compiler and LINQ runtime optimize consecutive \`Where\` clauses into a composite filter, evaluating both predicates in a single streaming pass without allocating intermediate collections.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #2 Problem B (Even Numbers)
*Given a number $N$. Print all even numbers between $1$ and $N$ in ascending order on separate lines. If there are no even numbers, print $-1$.*

#### Algorithmic Analysis
1. Generate the sequence from $1$ to $N$ using \`Enumerable.Range(1, n)\`.
2. Apply \`.Where(x => (x & 1) == 0)\` using bitwise parity testing.
3. Stream the output or handle the $N < 2$ edge case with $-1$.

#### C# Implementation

\`\`\`csharp
using System;
using System.Linq;
using System.Text;

public class Program
{
    public static void Main()
    {
        string? line = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(line))
        {
            return;
        }

        if (int.TryParse(line.Trim(), out int n))
        {
            if (n < 2)
            {
                Console.WriteLine(-1);
                return;
            }

            // Deferred LINQ Where pipeline
            var evens = Enumerable.Range(1, n)
                                  .Where(x => (x & 1) == 0);

            StringBuilder sb = new StringBuilder();
            foreach (int even in evens)
            {
                sb.AppendLine(even.ToString());
            }

            Console.Write(sb.ToString());
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$, streaming through $N$ numbers with constant-time bitwise parity checks.
- **Space Complexity**: $\\mathcal{O}(N)$ for the output string builder buffer, while the \`Where\` iterator itself consumes $\\mathcal{O}(1)$ auxiliary memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #2: Even Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B) | Easy | \`Where\`, Enumerable.Range, Parity filtering |
| ⚪ | Codeforces | [Assiut Sheet #1: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Predicates, Modulo divisibility, Guard clauses |
| ⚪ | Exercism C# | [Sum of Multiples](https://exercism.org/tracks/csharp/exercises/sum-of-multiples) | Medium | \`Where\`, \`Distinct\`, Numerical sequences |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | Custom predicate filtering, Deferred execution |
`,

  contentBn: `# C# এ হোয়্যার (Where) ও শর্তাধীন ফিল্টারিং

LINQ (Language Integrated Query)-এ ডেটা ফিল্টার করার সবচেয়ে মৌলিক ও গুরুত্বপূর্ণ অপারেটর হলো **\`Where\`**। এটি একটি বুলিয়ান প্রেডিকেটের (Predicate) ওপর ভিত্তি করে কালেকশনের উপাদান ফিল্টার করে।

\`System.Linq.Enumerable\` ক্লাসে এক্সটেনশন মেথড হিসেবে সংজ্ঞায়িত \`Where\` অপারেটর আধুনিক .NET এন্টারপ্রাইজ অ্যাপ্লিকেশনে ডেটা পাইপলাইনের মূল ভিত্তি।

---

## আন্ডার দ্য হুড: স্ট্রিমিং ইটারেটর স্টেট মেশিন

যখন আপনি \`numbers.Where(x => x > 10)\` কল করেন:
১. **দেরিতে কার্যকর (Deferred Execution)**: \`Where\` মেথড কল করার সাথে সাথে মেমরিতে কোনো লুপ চলে না। এটি কেবল একটি কম্পাইলার-জেনারেটেড \`WhereEnumerableIterator<T>\` অবজেক্ট তৈরি করে।
২. **স্ট্রিমিং পাইপলাইন**: যখন কলার \`foreach\` বা \`ToList()\` কল করে, কেবল তখনই একে একে উপাদানগুলো প্রসেস হয়। এর ফলে কালেকশনে ১০টি উপাদান থাকুক বা কোটি উপাদান থাকুক, অতিরিক্ত মেমোরি খরচ সবসময় $\\mathcal{O}(1)$ থাকে।
৩. **\`List<T>.FindAll\` এর সাথে পার্থক্য**: \`FindAll\` তাৎক্ষণিকভাবে লুপ চালিয়ে মেমোরি হিপে সম্পূর্ণ নতুন একটি লিস্ট তৈরি করে। অপরদিকে \`Where\` অলসভাবে (lazily) ডেটা স্ট্রিম করে কোনো মধ্যবর্তী লিস্ট তৈরি ছাড়াই।

---

## ওভারলোড ও ইনডেক্স-ভিত্তিক ফিল্টারিং

\`Where\` অপারেটরের দুটি প্রধান জেনেরিক ওভারলোড রয়েছে:

### ১. সাধারণ প্রেডিকেট ওভারলোড:
\`\`\`csharp
public static IEnumerable<TSource> Where<TSource>(
    this IEnumerable<TSource> source, 
    Func<TSource, bool> predicate);
\`\`\`

### ২. ইনডেক্স-সচেতন ওভারলোড:
\`\`\`csharp
public static IEnumerable<TSource> Where<TSource>(
    this IEnumerable<TSource> source, 
    Func<TSource, int, bool> predicate);
\`\`\`
ল্যাম্বডার দ্বিতীয় আর্গুমেন্টে কালেকশনে সংশ্লিষ্ট উপাদানের শূন্য-ভিত্তিক ইনডেক্স পাস করা হয়:

\`\`\`csharp
var items = new[] { "A", "B", "C", "D", "E" };

// জোড় ইনডেক্সের উপাদানগুলো ফিল্টার করা (ইনডেক্স ০, ২, ৪):
var evenIndexItems = items.Where((val, index) => index % 2 == 0);
// ফলাফল: "A", "C", "E"
\`\`\`

---

## একাধিক Where চেইনিং

একাধিক \`Where\` ক্লজ ক্রমান্বয়ে যুক্ত করা যায়:

\`\`\`csharp
var activeAdmins = users
    .Where(u => u.IsActive)
    .Where(u => u.Role == Role.Admin);
\`\`\`

LINQ ইঞ্জিন পরপর থাকা একাধিক \`Where\` ক্লজকে একটি একক কম্বাইন্ড ফিল্টারে অপ্টিমাইজ করে নেয়, ফলে কোনো মধ্যবর্তী মেমোরি তৈরি না করেই একক স্ট্রিমিং পাসে ডেটা ফিল্টার হয়।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #2 Problem B (Even Numbers)
*একটি সংখ্যা $N$ দেওয়া থাকবে। $1$ থেকে $N$ পর্যন্ত সকল জোড় সংখ্যা আরোহী ক্রমে আলাদা লাইনে প্রিন্ট করতে হবে। কোনো জোড় সংখ্যা না থাকলে $-1$ প্রিন্ট করুন।*

#### সমাধান বিশ্লেষণ
১. \`Enumerable.Range(1, n)\` দিয়ে সিকোয়েন্স তৈরি করা।
২. বিটওয়াইজ অপারেশনে \`.Where(x => (x & 1) == 0)\` দিয়ে জোড় সংখ্যা ফিল্টার করা।
৩. $N < 2$ হলে $-1$ প্রিন্ট করা এবং অন্যথায় ফলাফল প্রদর্শন করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Linq;
using System.Text;

public class Program
{
    public static void Main()
    {
        string? line = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(line))
        {
            return;
        }

        if (int.TryParse(line.Trim(), out int n))
        {
            if (n < 2)
            {
                Console.WriteLine(-1);
                return;
            }

            var evens = Enumerable.Range(1, n)
                                  .Where(x => (x & 1) == 0);

            StringBuilder sb = new StringBuilder();
            foreach (int even in evens)
            {
                sb.AppendLine(even.ToString());
            }

            Console.Write(sb.ToString());
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$, $N$ সংখ্যক উপাদান ফিল্টার করতে লিনিয়ার সময় লাগে।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(N)$ কনসোল আউটপুট বাফারের জন্য, তবে \`Where\` ইটারেটরের নিজস্ব মেমোরি $\\mathcal{O}(1)$।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #2: Even Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B) | Easy | \`Where\`, Enumerable.Range, Parity filtering |
| ⚪ | Codeforces | [Assiut Sheet #1: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Predicates, Modulo divisibility, Guard clauses |
| ⚪ | Exercism C# | [Sum of Multiples](https://exercism.org/tracks/csharp/exercises/sum-of-multiples) | Medium | \`Where\`, \`Distinct\`, Numerical sequences |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | Custom predicate filtering, Deferred execution |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #2: Even Numbers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["LINQ", "Where", "Parity"],
      solutionEn:
        "Filter even integers from Enumerable.Range(1, N) using a bitwise Where predicate, emitting -1 when N < 2.",
      solutionBn:
        "Enumerable.Range(1, N) থেকে বিটওয়াইজ Where প্রেডিকেট দিয়ে জোড় সংখ্যা ফিল্টার করুন এবং N < 2 হলে -1 প্রদর্শন করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Multiples",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Modulo", "Conditionals", "Where"],
      solutionEn:
        "Check whether integer A is a multiple of B or vice versa using modulo remainder testing inside a boolean predicate.",
      solutionBn:
        "বুলিয়ান প্রেডিকেটের মধ্যে মডিউলো অপারেশন প্রয়োগ করে সংখ্যা A ও B পরস্পরের গুণিতক কি না তা যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "Sum of Multiples",
      url: "https://exercism.org/tracks/csharp/exercises/sum-of-multiples",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["LINQ", "Where", "Distinct"],
      solutionEn:
        "Find the unique sum of all multiples of given base factors up to a level limit using Where filtering and Sum.",
      solutionBn:
        "Where ফিল্টারিং এবং Sum অপারেশনের সাহায্যে নির্ধারিত সীমার মধ্যে গুণিতকগুলোর অনন্য যোগফল বের করুন।",
    },
    {
      source: "Exercism C#",
      name: "Strain",
      url: "https://exercism.org/tracks/csharp/exercises/strain",
      difficulty: "MEDIUM",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Yield", "Where", "Generics"],
      solutionEn:
        "Recreate LINQ Where semantics by implementing generic Keep and Discard extension methods using yield return.",
      solutionBn:
        "yield return ব্যবহারের মাধ্যমে জেনেরিক Keep ও Discard এক্সটেনশন মেথড তৈরি করে LINQ Where এর আচরণ পুনর্নির্মাণ করুন।",
    },
  ],
};
