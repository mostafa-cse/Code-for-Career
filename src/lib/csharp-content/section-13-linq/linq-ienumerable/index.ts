import type { LocalLesson } from "@/lib/lessons-data";

export const linqIenumerableLesson: LocalLesson = {
  slug: "linq-ienumerable",
  titleEn: "IEnumerable<T> (LINQ to Objects)",
  titleBn: "আই-ইনুমারেবল (IEnumerable<T>) ও মেমোরি কালেকশন",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকিউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "CORE",
  descriptionEn:
    "In-memory sequence traversal, IEnumerator<T> state machines, Func<T, bool> delegate execution, covariance, and LINQ to Objects internals.",
  descriptionBn:
    "ইন-মেমোরি সিকোয়েন্স নেভিগেশন, IEnumerator স্টেট মেশিন, Func ডেলিগেট এক্সিকিউশন, কোভেরিয়েন্স ও LINQ to Objects এর অভ্যন্তরীণ আর্কিটেকচার।",
  difficulty: "EASY",
  displayOrder: 13,
  prerequisites: ["linq-deferred-execution"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# IEnumerable<T> in C# (LINQ to Objects)

**\`IEnumerable<T>\`** is the foundational interface for forward-only, read-only iteration over in-memory collections in .NET. It powers **LINQ to Objects**, enabling functional query pipelines directly in CLR memory.

---

## Under the Hood: The Enumerator Contract

At the runtime level, \`IEnumerable<T>\` defines a single contract:

\`\`\`csharp
public interface IEnumerable<out T> : IEnumerable
{
    IEnumerator<T> GetEnumerator();
}

public interface IEnumerator<out T> : IDisposable, IEnumerator
{
    T Current { get; }
    bool MoveNext();
    void Reset();
}
\`\`\`

### The Pull-Based Iteration Protocol:
When a consumer runs a \`foreach\` loop:
1. The compiler calls \`source.GetEnumerator()\`.
2. It executes a \`while (e.MoveNext())\` loop.
3. On each iteration, \`e.Current\` is read.
4. When finished, \`e.Dispose()\` is called inside a hidden \`finally\` block.

\`\`\`csharp
// What the C# compiler generates for 'foreach (var item in collection)'
var enumerator = collection.GetEnumerator();
try
{
    while (enumerator.MoveNext())
    {
        var item = enumerator.Current;
        // Body executes
    }
}
finally
{
    enumerator.Dispose();
}
\`\`\`

---

## LINQ to Objects: Compiled Delegates

All LINQ extension methods on \`IEnumerable<T>\` reside in the static class **\`System.Linq.Enumerable\`**.

- **Parameters as Compiled Delegates**: In \`IEnumerable<T>\`, lambda expressions compile directly to IL delegates (\`Func<T, bool>\`, \`Func<T, TResult>\`).
- **In-Memory Execution**: Every operation is evaluated by the local CPU inside the application's CLR process.
- **Covariance (\`out T\`)**: Because \`IEnumerable<out T>\` is covariant, you can safely assign derived sequences to base type variables without type casting:
  \`\`\`csharp
  IEnumerable<string> strings = new[] { "apple", "banana" };
  IEnumerable<object> objects = strings; // Valid due to covariance!
  \`\`\`

---

## Non-Generic IEnumerable vs Generic IEnumerable<T>

| Characteristic | Non-Generic \`IEnumerable\` | Generic \`IEnumerable<T>\` |
| :--- | :--- | :--- |
| **Namespace** | \`System.Collections\` | \`System.Collections.Generic\` |
| **Current Type** | \`object\` | Strongly typed \`T\` |
| **Boxing Penalty** | **Severe boxing** for value types (\`int\`, \`struct\`) | **Zero boxing** overhead |
| **Type Safety** | No compile-time type checking | Full compile-time type safety |
| **Modern Usage** | Legacy .NET 1.1 collections (\`ArrayList\`) | Universal standard in modern .NET |

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #2 Problem A (1 to N)
*Given a number $N$. Print numbers from $1$ to $N$ in separate lines using a memory-efficient sequence generator.*

#### Algorithmic Analysis
1. Read the positive integer $N$.
2. Utilize \`Enumerable.Range(1, n)\` which generates an \`IEnumerable<int>\` on-demand using a streaming state machine.
3. Stream numbers to \`Console.Out\` with buffered string formatting.

#### C# Implementation

\`\`\`csharp
using System;
using System.Linq;
using System.Text;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (int.TryParse(input.Trim(), out int n) && n >= 1)
        {
            // Enumerable.Range creates an on-demand IEnumerable<int>
            var sequence = Enumerable.Range(1, n);

            StringBuilder sb = new StringBuilder();
            foreach (int value in sequence)
            {
                sb.AppendLine(value.ToString());
            }

            Console.Write(sb.ToString());
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$, streaming $N$ integers sequentially.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory for the \`Enumerable.Range\` enumerator itself, plus string output buffering.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #2: 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/A) | Easy | \`IEnumerable\`, Enumerable.Range, Streaming |
| ⚪ | Codeforces | [Assiut Sheet #1: Summation from 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G) | Easy | Numerical ranges, Sequence evaluation |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | Custom \`IEnumerable<T>\` state machines |
| ⚪ | Exercism C# | [Clock](https://exercism.org/tracks/csharp/exercises/clock) | Medium | Equality contracts, Value object iteration |
`,

  contentBn: `# C# এ আই-ইনুমারেবল (IEnumerable<T>) ও মেমোরি কালেকশন

.NET-এ মেমরিতে থাকা কালেকশনের ওপর রিড-অনলি এবং ফরওয়ার্ড-অনলি লুপ চালানোর মূল ইন্টারফেস হলো **\`IEnumerable<T>\`**। এটি **LINQ to Objects** এর ভিত্তি, যার মাধ্যমে CLR মেমরিতে সরাসরি ফাংশনাল কুয়েরি পাইপলাইন চালানো যায়।

---

## আন্ডার দ্য হুড: এনিউমারেটর চুক্তি

রানটাইম লেভেলে \`IEnumerable<T>\` মূলত একটি মেথড সরবরাহ করে:

\`\`\`csharp
public interface IEnumerable<out T> : IEnumerable
{
    IEnumerator<T> GetEnumerator();
}

public interface IEnumerator<out T> : IDisposable, IEnumerator
{
    T Current { get; }
    bool MoveNext();
    void Reset();
}
\`\`\`

### পুল-ভিত্তিক লুপ প্রটোকল (Pull-Based Protocol):
যখন কোডে \`foreach\` লুপ চলে:
১. কম্পাইলার প্রথমে \`source.GetEnumerator()\` কল করে।
২. একটি \`while (e.MoveNext())\` লুপ চালায়।
৩. প্রতিটি পদক্ষেপে \`e.Current\` এর মান পড়ে লুপের বডিতে পাঠায়।
৪. লুপ শেষ হলে একটি হিডেন \`finally\` ব্লকের মধ্যে \`e.Dispose()\` কল করে মেমোরি রিসোর্স মুক্ত করে।

\`\`\`csharp
// C# কম্পাইলার একটি 'foreach' লুপকে ইন্টারনালি এভাবে রূপান্তর করে:
var enumerator = collection.GetEnumerator();
try
{
    while (enumerator.MoveNext())
    {
        var item = enumerator.Current;
        // লুপের ভেতরের কোড চলে
    }
}
finally
{
    enumerator.Dispose();
}
\`\`\`

---

## LINQ to Objects ও কম্পাইল্ড ডেলিগেট

\`IEnumerable<T>\` এর সমস্ত LINQ এক্সটেনশন মেথড স্ট্যাটিক ক্লাস **\`System.Linq.Enumerable\`**-এ সংরক্ষিত।

- **কম্পাইল্ড ডেলিগেট**: \`IEnumerable<T>\`-এ পাস করা ল্যাম্বডা সরাসরি মেশিন কোডে কম্পাইল করা ডেলিগেটে (\`Func<T, bool>\`, \`Func<T, TResult>\`) রূপান্তরিত হয়।
- **ইন-মেমোরি এক্সিকিউশন**: প্রতিটি অপারেশন অ্যাপ্লিকেশনের লোকাল প্রসেসর ও মেমরিতে চলে।
- **কোভেরিয়েন্স (\`out T\`)**: \`IEnumerable<out T>\` ইন্টারফেস কোভেরিয়েন্ট হওয়ায় চাইল্ড ক্লাসের সিকোয়েন্সকে সরাসরি প্যারেন্ট টাইপের ভেরিয়েবলে কোনো কাস্টিং ছাড়াই অ্যাসাইন করা যায়:
  \`\`\`csharp
  IEnumerable<string> strings = new[] { "apple", "banana" };
  IEnumerable<object> objects = strings; // কোভেরিয়েন্সের কারণে সম্পূর্ণ বৈধ!
  \`\`\`

---

## সাধারণ IEnumerable বনাম জেনেরিক IEnumerable<T>

| বৈশিষ্ট্য | নন-জেনেরিক \`IEnumerable\` | জেনেরিক \`IEnumerable<T>\` |
| :--- | :--- | :--- |
| **নেমস্পেস** | \`System.Collections\` | \`System.Collections.Generic\` |
| **Current এর টাইপ** | \`object\` | স্ট্রংলি টাইপড \`T\` |
| **বক্সিং ক্ষতি** | ভ্যালু টাইপের জন্য **মারাত্মক বক্সিং** হয় | **কোনো বক্সিং** ওভারহেড নেই |
| **টাইপ সেফটি** | কম্পাইল-টাইম টাইপ চেকিং নেই | শতভাগ কম্পাইল-টাইম টাইপ সেফ |
| **বর্তমান ব্যবহার** | প্রাচীন .NET ১.১ কালেকশন (\`ArrayList\`) | আধুনিক .NET অ্যাপ্লিকেশনে সার্বজনীন |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #2 Problem A (1 to N)
*একটি সংখ্যা $N$ দেওয়া থাকবে। মেমোরি সাশ্রয়ী উপায়ে $1$ থেকে $N$ পর্যন্ত সংখ্যাগুলো আলাদা আলাদা লাইনে প্রিন্ট করুন।*

#### সমাধান বিশ্লেষণ
১. ধনাত্মক সংখ্যা $N$ ইনপুট নেওয়া।
২. \`Enumerable.Range(1, n)\` ব্যবহার করা, যা মেমরিতে কোনো অ্যারে না বানিয়ে অন-ডিমান্ড \`IEnumerable<int>\` স্টেট মেশিনের সাহায্যে উপাদান সরবরাহ করে।
৩. আউটপুট দ্রুত প্রদর্শন করতে \`StringBuilder\` বাফার ব্যবহার করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Linq;
using System.Text;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (int.TryParse(input.Trim(), out int n) && n >= 1)
        {
            var sequence = Enumerable.Range(1, n);

            StringBuilder sb = new StringBuilder();
            foreach (int value in sequence)
            {
                sb.AppendLine(value.ToString());
            }

            Console.Write(sb.ToString());
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$, সিকোয়েন্সের $N$ উপাদান ক্রমান্বয়ে ভিজিট করে।
- **স্পেস কমপ্লেক্সিটি**: \`Enumerable.Range\` ইটারেটরের জন্য অতিরিক্ত মেমোরি খরচ $\\mathcal{O}(1)$।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #2: 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/A) | Easy | \`IEnumerable\`, Enumerable.Range, Streaming |
| ⚪ | Codeforces | [Assiut Sheet #1: Summation from 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G) | Easy | Numerical ranges, Sequence evaluation |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | Custom \`IEnumerable<T>\` state machines |
| ⚪ | Exercism C# | [Clock](https://exercism.org/tracks/csharp/exercises/clock) | Medium | Equality contracts, Value object iteration |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #2: 1 to N",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/A",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["LINQ", "IEnumerable", "Range"],
      solutionEn:
        "Generate numbers from 1 to N on demand using Enumerable.Range and stream each integer to standard output.",
      solutionBn:
        "Enumerable.Range ব্যবহার করে চাহিদা অনুযায়ী 1 থেকে N সংখ্যাগুলো তৈরি করুন এবং স্ট্যান্ডার্ড আউটপুটে প্রিন্ট করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Summation from 1 to N",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Math", "IEnumerable", "Sum"],
      solutionEn:
        "Calculate the sum of the first N natural numbers using closed-form algebra evaluated in 64-bit space.",
      solutionBn:
        "৬৪-বিট লং ইন্টিজারে প্রথম N স্বাভাবিক সংখ্যার গাণিতিক যোগফল হিসাব করুন।",
    },
    {
      source: "Exercism C#",
      name: "Strain",
      url: "https://exercism.org/tracks/csharp/exercises/strain",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Yield", "IEnumerable", "Generics"],
      solutionEn:
        "Implement generic Keep and Discard extension methods on IEnumerable<T> using custom yield return iterators.",
      solutionBn:
        "কাস্টম yield return ইটারেটরের সাহায্যে IEnumerable<T> এর ওপর জেনেরিক Keep ও Discard এক্সটেনশন তৈরি করুন।",
    },
    {
      source: "Exercism C#",
      name: "Clock",
      url: "https://exercism.org/tracks/csharp/exercises/clock",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["Value Objects", "Equality", "Modulo"],
      solutionEn:
        "Create an immutable Clock value object supporting rolling minutes modulo 24 hours and value equality.",
      solutionBn:
        "২৪ ঘণ্টার মডিউলো রোলওভার এবং ভ্যালু ইকুয়ালিটি সমর্থনকারী একটি ইমিউটেবল Clock অবজেক্ট তৈরি করুন।",
    },
  ],
};
