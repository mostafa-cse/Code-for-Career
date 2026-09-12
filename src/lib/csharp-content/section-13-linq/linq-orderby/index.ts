import type { LocalLesson } from "@/lib/lessons-data";

export const linqOrderbyLesson: LocalLesson = {
  slug: "linq-orderby",
  titleEn: "LINQ OrderBy & ThenBy (Sorting)",
  titleBn: "অর্ডার-বাই (OrderBy) ও মাল্টি-লেভেল সর্টিং",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকিউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "CORE",
  descriptionEn:
    "Ascending and descending ordering, primary and secondary sorting with ThenBy, stable sort guarantees, buffered execution, and IOrderedEnumerable.",
  descriptionBn:
    "উর্ধ্বক্রম ও নিম্নক্রম সাজানো, ThenBy দিয়ে একাধিক ফিল্ডে সর্টিং, স্টেবল সর্ট নিশ্চয়তা, বাফার্ড এক্সিকিউশন ও IOrderedEnumerable।",
  difficulty: "EASY",
  displayOrder: 4,
  prerequisites: ["linq-select"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# LINQ OrderBy & ThenBy in C#

The **\`OrderBy\`** and **\`OrderByDescending\`** operators sort sequence elements according to an extracted key. Secondary, tertiary, and subsequent sorting criteria are chained using **\`ThenBy\`** and **\`ThenByDescending\`**.

Sorting in LINQ produces an **\`IOrderedEnumerable<TElement>\`**, which maintains internal state allowing composite multi-key ordering without re-evaluating preceding keys.

---

## Under the Hood: Non-Streaming Buffered Execution

Unlike \`Where\` and \`Select\` which stream elements one-by-one with $\\mathcal{O}(1)$ auxiliary memory, sorting is a **buffering (blocking) operator**:

1. **Mandatory Buffering**: To determine the first element to yield, LINQ must inspect **every single element** in the sequence. Thus, calling \`MoveNext()\` for the first time loads all $N$ items into an internal buffer.
2. **Index Permutation Sorting**: LINQ to Objects does not physically move elements in memory during comparison passes. Instead, it builds an array of integer indices \`[0, 1, ..., N - 1]\` and sorts the index pointers using an introspective sort variation.
3. **Complexity Profile**:
   - **Time Complexity**: $\\mathcal{O}(N \\log N)$ average and worst-case comparison time.
   - **Space Complexity**: $\\mathcal{O}(N)$ heap allocation to buffer the sequence and index permutation structures.

---

## Stable Sorting Guarantee

LINQ's sorting implementation is **stable**:

> **Stable Sort Definition**: If two elements have identical sorting keys, their relative order from the original input sequence is **strictly preserved**.

\`\`\`csharp
var applicants = new[]
{
    new { Name = "Zayed", Score = 100 }, // Appears 1st
    new { Name = "Ayaan", Score = 100 }, // Appears 2nd
};

var sorted = applicants.OrderBy(a => a.Score);
// Zayed is guaranteed to appear before Ayaan in the output
\`\`\`

---

## The Catastrophic Multiple OrderBy Bug

One of the most frequent junior developer anti-patterns is chaining consecutive \`OrderBy\` calls:

\`\`\`csharp
// FATAL BUG: The second OrderBy completely DESTROYS the first sorting key!
var broken = employees
    .OrderBy(e => e.Department)
    .OrderBy(e => e.Salary); // Department ordering is discarded!

// CORRECT: Uses ThenBy to define secondary tie-breaking criteria
var correct = employees
    .OrderBy(e => e.Department)
    .ThenByDescending(e => e.Salary);
\`\`\`

### Why This Happens:
- \`OrderBy\` returns \`IOrderedEnumerable<T>\`.
- Calling \`OrderBy\` again treats the sequence as a plain \`IEnumerable<T>\` and creates a **brand-new** sorting state machine, resetting previous keys.
- Calling \`ThenBy\` invokes \`IOrderedEnumerable<T>.CreateOrderedEnumerable\`, appending the secondary key selector to the existing composite comparator.

---

## Custom Comparers & Collation

Both \`OrderBy\` and \`ThenBy\` accept an optional \`IComparer<TKey>\` to control comparison semantics (e.g. linguistic rules or case sensitivity):

\`\`\`csharp
var sortedFiles = filenames.OrderBy(
    f => f, 
    StringComparer.OrdinalIgnoreCase
);
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem T (Sort Numbers)
*Given three numbers $A, B, C$. Print them in ascending order on separate lines, print a blank line, and then print the original sequence as inputted.*

#### Algorithmic Analysis
1. Read the three numbers into an array to preserve their original sequence.
2. Apply \`.OrderBy(x => x)\` to generate an ascending sorted sequence.
3. Output the sorted sequence, emit an empty line, and output the original array.

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

        int[] original = input
            .Trim()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .ToArray();

        // LINQ OrderBy creates a sorted copy, leaving original untouched
        int[] sorted = original.OrderBy(x => x).ToArray();

        // Print sorted
        foreach (int num in sorted)
        {
            Console.WriteLine(num);
        }

        Console.WriteLine();

        // Print original sequence
        foreach (int num in original)
        {
            Console.WriteLine(num);
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(K \\log K)$ for sorting $K$ numbers ($K = 3$, effectively $\\mathcal{O}(1)$).
- **Space Complexity**: $\\mathcal{O}(K)$ to store the original and sorted arrays in memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Sort Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T) | Easy | \`OrderBy\`, Immutability, Stable sorting |
| ⚪ | Codeforces | [Assiut Sheet #3: Sorting](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H) | Easy | Array sorting, Comparison keys, \`ToArray\` |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | \`OrderByDescending\`, \`Take\`, Best scores |
| ⚪ | Exercism C# | [Grade School](https://exercism.org/tracks/csharp/exercises/grade-school) | Medium | Multi-level sorting, \`OrderBy\`, \`ThenBy\` |
`,

  contentBn: `# C# এ অর্ডার-বাই (OrderBy) ও মাল্টি-লেভেল সর্টিং

LINQ-এ কালেকশনের উপাদানগুলোকে কোনো নির্দিষ্ট ফিল্ড বা কী (Key)-এর ভিত্তিতে আরোহী (Ascending) বা অবরোহী (Descending) ক্রমে সাজানোর জন্য **\`OrderBy\`** এবং **\`OrderByDescending\`** ব্যবহৃত হয়। দ্বিতীয় বা পরবর্তী শর্ত যোগ করার জন্য **\`ThenBy\`** এবং **\`ThenByDescending\`** চেইন করা হয়।

LINQ সর্টিং একটি **\`IOrderedEnumerable<TElement>\`** তৈরি করে, যা পূর্ববর্তী সর্ট কি বিনষ্ট না করেই অতিরিক্ত সর্ট শর্ত যুক্ত করতে সক্ষম।

---

## আন্ডার দ্য হুড: বাফার্ড এক্সিকিউশন (Buffered Execution)

\`Where\` এবং \`Select\` অপারেটরের মতো \`OrderBy\` উপাদানগুলোকে সাথে সাথে একটি একটি করে স্ট্রিম করতে পারে না। এটি একটি **বাফারিং বা ব্লকিং অপারেটর**:

১. **বাধ্যতামূলক মেমোরি বাফারিং**: সিকোয়েন্সের ক্ষুদ্রতম বা বৃহত্তম উপাদানটি বের করার জন্য LINQ-কে অবশ্যই ইনপুট কালেকশনের **প্রতিটি উপাদান** অন্তত একবার দেখতে হয়। তাই প্রথম উপাদান রিড করার আগেই সমস্ত $N$ উপাদান মেমরিতে বাফার হয়ে যায়।
২. **ইনডেক্স পারমিউটেশন সর্টিং**: LINQ উপাদানগুলোকে মেমরিতে বারবার নাড়াচাড়া করে না। বরং এটি উপাদানের ইনডেক্স নির্দেশক একটি অ্যারে \`[0, 1, ..., N - 1]\` তৈরি করে এবং সেই ইনডেক্সগুলোকে সর্ট করে।
৩. **কমপ্লেক্সিটি প্রোফাইল**:
   - **টাইম কমপ্লেক্সিটি**: গড়ে এবং সবচেয়ে খারাপ ক্ষেত্রে $\\mathcal{O}(N \\log N)$ তুলনা সম্পন্ন হয়।
   - **স্পেস কমপ্লেক্সিটি**: সম্পূর্ণ কালেকশন এবং ইনডেক্স বাফার করতে মেমরিতে $\\mathcal{O}(N)$ হিপ অ্যালোকেশন লাগে।

---

## স্টেবল সর্টিংয়ের (Stable Sort) নিশ্চয়তা

LINQ-এর সর্টিং অ্যালগরিদম শতভাগ **স্টেবল (Stable)**:

> **স্টেবল সর্ট কী?**: ইনপুট কালেকশনের দুটি উপাদানের সর্টিং কী যদি সমান হয়, তবে আউটপুটেও তাদের প্রাথমিক আপেক্ষিক অবস্থান বা ক্রমানুসার অপরিবর্তিত থাকবে।

\`\`\`csharp
var applicants = new[]
{
    new { Name = "Zayed", Score = 100 }, // পূর্বে অবস্থিত
    new { Name = "Ayaan", Score = 100 }, // পরে অবস্থিত
};

var sorted = applicants.OrderBy(a => a.Score);
// আউটপুটেও Zayed এর অবস্থান Ayaan এর আগেই বজায় থাকবে
\`\`\`

---

## একাধিক OrderBy চেইনিংয়ের মারাত্মক বাগ

অনেক নতুন প্রোগ্রামার ভুলবশত পরপর একাধিকবার \`OrderBy\` কল করে ফেলেন:

\`\`\`csharp
// মারাত্মক ভুল: দ্বিতীয় OrderBy টি প্রথম সর্ট শর্তটিকে সম্পূর্ণ মুছে দেয়!
var broken = employees
    .OrderBy(e => e.Department)
    .OrderBy(e => e.Salary); // Department এর ক্রম নষ্ট হয়ে গেল!

// সঠিক উপায়: একাধিক ফিল্ডে সর্ট করার জন্য ThenBy ব্যবহার করুন
var correct = employees
    .OrderBy(e => e.Department)
    .ThenByDescending(e => e.Salary);
\`\`\`

### কেন এমন ঘটে:
- \`OrderBy\` রিটার্ন করে \`IOrderedEnumerable<T>\`।
- আবার \`OrderBy\` কল করলে সেটি পুরোনো সর্ট স্টেট মুছে দিয়ে সম্পূর্ণ **নতুন** সর্ট পাইপলাইন শুরু করে।
- \`ThenBy\` কল করলে সেটি অভ্যন্তরীণ \`CreateOrderedEnumerable\` মেথড ডেকে বর্তমান সর্টের সাথে টাই-ব্রেকিং রুল হিসেবে যুক্ত হয়।

---

## কাস্টম কম্প্যারার (Custom Comparer)

অক্ষরের ছোট-বড় হাতের পার্থক্য উপেক্ষা করতে বা বিশেষ নিয়মে সর্ট করতে \`IComparer<TKey>\` পাঠানো যায়:

\`\`\`csharp
var sortedFiles = filenames.OrderBy(
    f => f, 
    StringComparer.OrdinalIgnoreCase
);
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem T (Sort Numbers)
*তিনটি সংখ্যা $A, B, C$ দেওয়া থাকবে। তাদেরকে আরোহী ক্রমে প্রিন্ট করুন, একটি ফাঁকা লাইন দিন, এবং এরপর ইনপুটের মূল ক্রমে সংখ্যাগুলো প্রিন্ট করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট সংখ্যাগুলোকে একটি অ্যারেতে রিড করে মূল ক্রম সংরক্ষণ করা।
২. \`.OrderBy(x => x)\` দিয়ে সর্ট করা নতুন সিকোয়েন্স তৈরি করা।
৩. সর্ট করা সংখ্যাগুলো প্রিন্ট করা, একটি ফাঁকা লাইন দেওয়া এবং সবশেষে মূল অ্যারেটি প্রিন্ট করা।

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

        int[] original = input
            .Trim()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .ToArray();

        int[] sorted = original.OrderBy(x => x).ToArray();

        foreach (int num in sorted)
        {
            Console.WriteLine(num);
        }

        Console.WriteLine();

        foreach (int num in original)
        {
            Console.WriteLine(num);
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $K$ সংখ্যক উপাদানের জন্য $\\mathcal{O}(K \\log K)$ (এখানে $K = 3$, কার্যত $\\mathcal{O}(1)$)।
- **স্পেস কমপ্লেক্সিটি**: অরিজিনাল ও সর্টেড অ্যারের জন্য $\\mathcal{O}(K)$ মেমোরি প্রয়োজন।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Sort Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T) | Easy | \`OrderBy\`, Immutability, Stable sorting |
| ⚪ | Codeforces | [Assiut Sheet #3: Sorting](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H) | Easy | Array sorting, Comparison keys, \`ToArray\` |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | \`OrderByDescending\`, \`Take\`, Best scores |
| ⚪ | Exercism C# | [Grade School](https://exercism.org/tracks/csharp/exercises/grade-school) | Medium | Multi-level sorting, \`OrderBy\`, \`ThenBy\` |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Sort Numbers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["LINQ", "OrderBy", "Sorting"],
      solutionEn:
        "Sort an input triplet using LINQ OrderBy and output both the ordered result and original unmutated array.",
      solutionBn:
        "LINQ OrderBy এর মাধ্যমে তিনটি সংখ্যা আরোহী ক্রমে সাজান এবং সর্ট করা ও আদি সিকোয়েন্স উভয়ই প্রদর্শন করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Sorting",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["LINQ", "OrderBy", "Arrays"],
      solutionEn:
        "Read an array of N numbers and sort them in ascending order using OrderBy and space-separated formatting.",
      solutionBn:
        "OrderBy ব্যবহার করে N সংখ্যক সংখ্যার অ্যারেকে আরোহী ক্রমে সাজিয়ে স্পেস দিয়ে প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "High Scores",
      url: "https://exercism.org/tracks/csharp/exercises/high-scores",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["LINQ", "OrderByDescending", "Take"],
      solutionEn:
        "Return the personal top three scores from a list of game scores using OrderByDescending chained with Take(3).",
      solutionBn:
        "OrderByDescending এবং Take(3) চেইন করে গেমের স্কোর তালিকা থেকে শীর্ষ তিনটি স্কোর বের করুন।",
    },
    {
      source: "Exercism C#",
      name: "Grade School",
      url: "https://exercism.org/tracks/csharp/exercises/grade-school",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["LINQ", "OrderBy", "ThenBy"],
      solutionEn:
        "Maintain student rosters ordered primarily by grade level and secondarily alphabetically by student name using ThenBy.",
      solutionBn:
        "শিক্ষার্থীদের প্রথমে গ্রেড এবং সমান গ্রেডের জন্য ThenBy দিয়ে নামের বর্ণানুক্রমে সাজিয়ে রাখুন।",
    },
  ],
};
