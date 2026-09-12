import type { LocalLesson } from "@/lib/lessons-data";

export const delegatesPredicateLesson: LocalLesson = {
  slug: "delegates-predicate",
  titleEn: "Predicate<T> Delegate",
  titleBn: "প্রেডিকেট (Predicate<T>) ও শর্তাধীন ফিল্টারিং",
  categoryEn: "11. Delegates",
  categoryBn: "১১. ডেলিগেট (Delegates)",
  categoryDescEn:
    "Type-safe function pointers in .NET: single-cast and multicast delegates, built-in Action, Func, and Predicate generic delegates.",
  categoryDescBn:
    ".NET এ টাইপ-নিরাপদ ফাংশন পয়েন্টার: সিঙ্গেল ও মাল্টিকাস্ট ডেলিগেট, বিল্ট-ইন Action, Func এবং Predicate জেনেরিক ডেলিগেট।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Specialized boolean evaluation delegate, architectural comparison with Func<T, bool>, List<T> search APIs, and O(N) in-place RemoveAll compaction.",
  descriptionBn:
    "বুলিয়ান মূল্যায়নকারী বিশেষায়িত ডেলিগেট, Func<T, bool> এর সাথে তুলনা, List<T> সার্চ এপিআই এবং O(N) ইন-প্লেস RemoveAll অ্যালগরিদম।",
  difficulty: "EASY",
  displayOrder: 5,
  prerequisites: ["delegates-func"],
  estimatedMinutes: 15,
  lastUpdated: "Recently updated",
  contentEn: `# Predicate<T> Delegate in C#

\`System.Predicate<T>\` is a specialized generic delegate in .NET that accepts a single object of type \`T\` and **returns a boolean (\`bool\`)**:

\`\`\`csharp
public delegate bool Predicate<in T>(T obj);
\`\`\`

It models a boolean criteria test, answering: *"Does this object satisfy the condition?"*

---

## The Tale of Two Delegates: Predicate<T> vs Func<T, bool>

Both \`Predicate<T>\` and \`Func<T, bool>\` accept a parameter of type \`T\` and return a \`bool\`. Why do both exist in the .NET Framework?

### Historical Evolution:
1. **.NET 2.0 (2005)**: \`Predicate<T>\` was introduced alongside Generics specifically to empower \`System.Collections.Generic.List<T>\` search and mutation APIs:
   - \`List<T>.Find(Predicate<T>)\`
   - \`List<T>.FindAll(Predicate<T>)\`
   - \`List<T>.Exists(Predicate<T>)\`
   - \`List<T>.TrueForAll(Predicate<T>)\`
   - \`List<T>.RemoveAll(Predicate<T>)\`
2. **.NET 3.5 (2008)**: Microsoft introduced LINQ and needed a unified delegate family (\`Func<T1, ..., TResult>\`) that scaled across arbitrary return types. Thus, LINQ operators (\`Where\`, \`Any\`, \`All\`) standardized on \`Func<T, bool>\`.

---

## The Incompatibility Trap (CS1503)

Because C# delegates are nominal types, **\`Predicate<T>\` and \`Func<T, bool>\` are NOT implicitly convertible to each other**:

\`\`\`csharp
Func<int, bool> isPositiveFunc = x => x > 0;
List<int> numbers = new List<int> { -5, 2, -1, 8 };

// COMPILER ERROR CS1503: Cannot convert 'Func<int, bool>' to 'Predicate<int>'
// numbers.FindAll(isPositiveFunc); 

// Solution 1: Explicit wrapper conversion
numbers.FindAll(new Predicate<int>(isPositiveFunc));

// Solution 2: Lambda forwarding
numbers.FindAll(x => isPositiveFunc(x));
\`\`\`

---

## In-Place Compaction: \`List<T>.RemoveAll\`

While LINQ's \`.Where()\` operator filters streams lazily (producing a new sequence), \`List<T>.RemoveAll(Predicate<T>)\` performs **high-performance in-place array compaction**:

\`\`\`csharp
var inventory = new List<string> { "Apple", "Orange", "Avocado", "Banana" };

// Removes all items starting with 'A' in a single O(N) scan without allocating new lists:
int removedCount = inventory.RemoveAll(item => item.StartsWith('A'));

Console.WriteLine($"Removed: {removedCount}"); // 2
Console.WriteLine(string.Join(", ", inventory)); // Orange, Banana
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #2 Problem B (Even Numbers)
*Given a number $N$. Print all even numbers between $1$ and $N$ inclusive in separate lines. If there are no even numbers, print \`-1\`.*
*Filter the sequence using a \`Predicate<int>\`.*

#### Algorithmic Analysis
1. If $N < 2$, there are no even numbers in $[1, N]$; immediately output \`-1\`.
2. Define a \`Predicate<int> isEven = x => (x & 1) == 0;\` using bitwise AND for speed.
3. Iterate from $2$ to $N$ with step $2$ (or test with the predicate) to emit all even integers.

#### C# Implementation

\`\`\`csharp
using System;
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

        if (!int.TryParse(input.Trim(), out int n))
        {
            return;
        }

        // Fast bitwise parity predicate
        Predicate<int> isEven = x => (x & 1) == 0;

        if (n < 2)
        {
            Console.WriteLine(-1);
            return;
        }

        StringBuilder output = new StringBuilder();
        for (int i = 1; i <= n; i++)
        {
            if (isEven(i))
            {
                output.AppendLine(i.ToString());
            }
        }

        Console.Write(output.ToString());
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$, scanning numbers from $1$ to $N$ with constant-time bitwise parity checks.
- **Space Complexity**: $\\mathcal{O}(N)$ for the StringBuilder buffer to optimize console I/O throughput.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #2: Even Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B) | Easy | \`Predicate<int>\`, Parity testing, Fast I/O |
| ⚪ | Codeforces | [Assiut Sheet #1: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Modulo divisibility, Predicate filters, Guard clauses |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | Custom filtering, Predicate logic, Generic lists |
| ⚪ | Exercism C# | [Pythagorean Triplet](https://exercism.org/tracks/csharp/exercises/pythagorean-triplet) | Medium | Multi-variable predicates, Triplet search, Math constraints |
`,

  contentBn: `# C# এ প্রেডিকেট (Predicate<T>) ও শর্তাধীন ফিল্টারিং

\`System.Predicate<T>\` হলো .NET এর একটি বিশেষায়িত জেনেরিক ডেলিগেট যা \`T\` টাইপের একটি আর্গুমেন্ট গ্রহণ করে একটি **বুলিয়ান (\`bool\`)** মান রিটার্ন করে:

\`\`\`csharp
public delegate bool Predicate<in T>(T obj);
\`\`\`

এটি মূলত যেকোনো অবজেক্ট কোনো নির্দিষ্ট শর্ত পূরণ করে কি না তা পরীক্ষা করতে ব্যবহৃত হয়।

---

## দুটি ডেলিগেটের ইতিহাস: Predicate<T> বনাম Func<T, bool>

\`Predicate<T>\` এবং \`Func<T, bool>\` উভয়েই একটি আর্গুমেন্ট নিয়ে \`bool\` রিটার্ন করে। তাহলে .NET এ দুটি আলাদা ডেলিগেট থাকার কারণ কী?

### ঐতিহাসিক পটভূমি:
১. **.NET ২.০ (২০০৫)**: জেনেরিক্সের সাথে সাথে \`Predicate<T>\` তৈরি করা হয়েছিল মূলত \`List<T>\` কালেকশনের সার্চ মেথডগুলোর জন্য:
   - \`List<T>.Find(Predicate<T>)\`
   - \`List<T>.FindAll(Predicate<T>)\`
   - \`List<T>.Exists(Predicate<T>)\`
   - \`List<T>.RemoveAll(Predicate<T>)\`
২. **.NET ৩.৫ (২০০৮)**: মাইক্রোসফট যখন LINQ তৈরি করে, তখন সব ধরনের রিটার্ন টাইপকে একটি সাধারণ প্যাটার্নে আনার জন্য \`Func<T, TResult>\` তৈরি করে এবং LINQ এর মেথডগুলো (\`Where\`, \`Any\`, \`All\`) \`Func<T, bool>\` ব্যবহার করা শুরু করে।

---

## ইনকম্প্যাটিবিলিটি সমস্যা (CS1503)

যেহেতু সি# এর টাইপ সিস্টেমে ডেলিগেটগুলো আলাদা নামযুক্ত টাইপ, তাই **\`Predicate<T>\` এবং \`Func<T, bool>\` পরস্পরের সাথে সরাসরি পরিবর্তনযোগ্য নয়**:

\`\`\`csharp
Func<int, bool> isPositiveFunc = x => x > 0;
List<int> numbers = new List<int> { -5, 2, -1, 8 };

// কম্পাইলার এরর CS1503! সরাসরি Func কে Predicate এ পাস করা যায় না:
// numbers.FindAll(isPositiveFunc);

// সমাধান ১: এক্সপ্লিসিট কনস্ট্রাক্টর কনভার্সন
numbers.FindAll(new Predicate<int>(isPositiveFunc));

// সমাধান ২: ল্যাম্বডা দিয়ে ফরোয়ার্ড করা
numbers.FindAll(x => isPositiveFunc(x));
\`\`\`

---

## ইন-প্লেস অ্যারে কম্প্যাকশন: \`List<T>.RemoveAll\`

LINQ এর \`.Where()\` মেথড অলসভাবে (lazy) নতুন সিকোয়েন্স তৈরি করে, কিন্তু \`List<T>.RemoveAll(Predicate<T>)\` অত্যন্ত দ্রুতগতিতে **মেমোরির ভেতরেই (in-place) $O(N)$ সময়ে** উপাদান মুছে লিস্টকে ছোট করে ফেলে:

\`\`\`csharp
var inventory = new List<string> { "Apple", "Orange", "Avocado", "Banana" };

// নতুন কোনো লিস্ট তৈরি না করেই 'A' দিয়ে শুরু হওয়া শব্দগুলো মুছে ফেলা:
int removedCount = inventory.RemoveAll(item => item.StartsWith('A'));

Console.WriteLine($"Removed: {removedCount}"); // 2
Console.WriteLine(string.Join(", ", inventory)); // Orange, Banana
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #2 Problem B (Even Numbers)
*একটি সংখ্যা $N$ দেওয়া থাকবে। $1$ থেকে $N$ পর্যন্ত সকল জোড় সংখ্যা আলাদা লাইনে প্রিন্ট করতে হবে। কোনো জোড় সংখ্যা না থাকলে \`-1\` প্রিন্ট করুন।*
*জোড় সংখ্যা ফিল্টারিংয়ের কাজটি \`Predicate<int>\` দিয়ে সম্পন্ন করুন।*

#### সমাধান বিশ্লেষণ
১. $N < 2$ হলে কোনো জোড় সংখ্যা থাকা সম্ভব নয়, সরাসরি \`-1\` প্রিন্ট করতে হবে।
২. গতি বাড়ানোর জন্য বিটওয়াইজ অপারেশনে জোড় সংখ্যা যাচাইয়ের প্রেডিকেট: \`Predicate<int> isEven = x => (x & 1) == 0;\`।
৩. লুপ চালিয়ে প্রেডিকেটের মাধ্যমে সংখ্যা প্রিন্ট করা।

#### C# সমাধান

\`\`\`csharp
using System;
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

        if (!int.TryParse(input.Trim(), out int n))
        {
            return;
        }

        // বিটওয়াইজ জোড় সংখ্যা ফিল্টারিং প্রেডিকেট
        Predicate<int> isEven = x => (x & 1) == 0;

        if (n < 2)
        {
            Console.WriteLine(-1);
            return;
        }

        StringBuilder output = new StringBuilder();
        for (int i = 1; i <= n; i++)
        {
            if (isEven(i))
            {
                output.AppendLine(i.ToString());
            }
        }

        Console.Write(output.ToString());
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$, $1$ থেকে $N$ পর্যন্ত সংখ্যা পরীক্ষা করতে লিনিয়ার সময় লাগে।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(N)$, দ্রুত কনসোল আউটপুটের জন্য StringBuilder মেমোরি ব্যবহৃত হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #2: Even Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B) | Easy | \`Predicate<int>\`, Parity testing, Fast I/O |
| ⚪ | Codeforces | [Assiut Sheet #1: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Modulo divisibility, Predicate filters, Guard clauses |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | Custom filtering, Predicate logic, Generic lists |
| ⚪ | Exercism C# | [Pythagorean Triplet](https://exercism.org/tracks/csharp/exercises/pythagorean-triplet) | Medium | Multi-variable predicates, Triplet search, Math constraints |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #2: Even Numbers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Predicate", "Parity", "Loops"],
      solutionEn:
        "Filter and print even numbers up to N using a fast bitwise Predicate<int> parity filter, handling N < 2 with -1.",
      solutionBn:
        "দ্রুতগতির বিটওয়াইজ Predicate<int> ফিল্টার ব্যবহার করে N পর্যন্ত সকল জোড় সংখ্যা প্রিন্ট করুন এবং N < 2 হলে -1 প্রদর্শন করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Multiples",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Modulo", "Conditionals", "Predicate"],
      solutionEn:
        "Check whether integer A is a multiple of B or vice versa using modulo remainder testing inside a boolean predicate.",
      solutionBn:
        "বুলিয়ান প্রেডিকেটের মধ্যে মডিউলো অপারেশন প্রয়োগ করে সংখ্যা A ও B পরস্পরের গুণিতক কি না তা যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "Strain",
      url: "https://exercism.org/tracks/csharp/exercises/strain",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Predicate", "Generics", "Collections"],
      solutionEn:
        "Implement collection filtering with Predicate delegates, yielding elements matching criteria in Keep and omitting in Discard.",
      solutionBn:
        "Predicate ডেলিগেটের সাহায্যে কালেকশন ফিল্টারিংয়ের Keep ও Discard মেথড বাস্তবায়ন করে শর্তানুযায়ী উপাদান নির্বাচন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Pythagorean Triplet",
      url: "https://exercism.org/tracks/csharp/exercises/pythagorean-triplet",
      difficulty: "MEDIUM",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Math", "Predicate", "Geometry"],
      solutionEn:
        "Search for Pythagorean triplets a^2 + b^2 = c^2 summing to N using mathematical constraints and predicate filtering.",
      solutionBn:
        "a^2 + b^2 = c^2 এবং a + b + c = N শর্ত পূরণকারী পিথাগোরিয়ান ট্রিপলেট বের করতে প্রেডিকেট ফিল্টারিং প্রয়োগ করুন।",
    },
  ],
};
