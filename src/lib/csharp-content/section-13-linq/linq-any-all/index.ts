import type { LocalLesson } from "@/lib/lessons-data";

export const linqAnyAllLesson: LocalLesson = {
  slug: "linq-any-all",
  titleEn: "LINQ Any & All (Quantifiers)",
  titleBn: "এনি (Any) ও অল (All) কোয়ান্টিফায়ার",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকইউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Existential and universal quantifiers, short-circuit boolean evaluation, Count() > 0 anti-patterns, vacuous truth on empty sets, and SQL EXISTS.",
  descriptionBn:
    "অস্তিত্ব ও সর্বজনীন কোয়ান্টিফায়ার, শর্ট-সার্কিট বুলিয়ান মূল্যায়ন, Count() > 0 এর মারাত্মক পারফরম্যান্স ত্রুটি, ভ্যাকুয়াস ট্রুথ ও SQL EXISTS।",
  difficulty: "EASY",
  displayOrder: 7,
  prerequisites: ["linq-where"],
  estimatedMinutes: 15,
  lastUpdated: "Recently updated",
  contentEn: `# LINQ Any & All in C#

The **\`Any\`** and **\`All\`** operators evaluate boolean conditions across an \`IEnumerable<T>\` sequence. They represent the foundational mathematical quantifiers:
- **\`Any\`**: Existential Quantifier ($\\exists x : P(x)$) — checks if *at least one* element satisfies the predicate.
- **\`All\`**: Universal Quantifier ($\\forall x : P(x)$) — checks if *every* element satisfies the predicate.

---

## Under the Hood: Short-Circuit Evaluation

Both operators are **immediate execution (terminal)** methods that evaluate lazily with early termination:

\`\`\`csharp
// Conceptual implementation inside System.Linq.Enumerable
public static bool Any<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
{
    foreach (TSource element in source)
    {
        if (predicate(element)) return true; // Short-circuits immediately!
    }
    return false;
}

public static bool All<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
{
    foreach (TSource element in source)
    {
        if (!predicate(element)) return false; // Short-circuits immediately!
    }
    return true;
}
\`\`\`

---

## The Catastrophic Count() > 0 Anti-Pattern

One of the most destructive performance bugs in C# is checking collection non-emptiness using \`Count()\`:

\`\`\`csharp
// CATASTROPHIC BUG:
if (users.Count() > 0) { ... }

// HIGH PERFORMANCE:
if (users.Any()) { ... }
\`\`\`

### Why This Matters:
1. **In-Memory Collections (\`IEnumerable<T>\`)**: \`Count()\` must traverse every element until the end of the sequence ($\\mathcal{O}(N)$). On an unindexed 10,000,000-item stream, \`Count()\` iterates 10,000,000 times; \`Any()\` stops after the **1st item** ($\\mathcal{O}(1)$).
2. **Database Queries (EF Core / SQL)**:
   - \`Count() > 0\` generates \`SELECT COUNT(*) FROM [Users]\`, triggering a full index or table scan.
   - \`Any()\` generates \`SELECT CASE WHEN EXISTS (SELECT 1 FROM [Users]) THEN 1 ELSE 0 END\`, allowing the database engine to exit on the very first row hit.

---

## The Vacuous Truth Trap on Empty Collections

A critical edge case frequently tested in technical interviews involves behavior on **empty sets**:

| Operator | Evaluated on Empty Collection (\`new List<int>()\`) | Formal Mathematical Rule |
| :--- | :--- | :--- |
| **\`Any()\`** | \`false\` | No element exists to satisfy the condition. |
| **\`Any(x => x > 0)\`** | \`false\` | Zero items exist in the set. |
| **\`All(x => x > 0)\`** | \`true\` | **Vacuous Truth**: In formal logic, a universal claim over an empty domain is vacuously true because no counterexample exists to invalidate it! |

\`\`\`csharp
var emptyList = new List<int>();

bool anyPositive = emptyList.Any(x => x > 0); // false
bool allPositive = emptyList.All(x => x > 0); // true (Vacuously true!)
\`\`\`

---

## Sequence Membership: Contains()

The **\`Contains\`** operator checks if a specific target value resides in the sequence:

\`\`\`csharp
var allowedRoles = new[] { "Admin", "SuperUser", "Auditor" };

bool hasAccess = allowedRoles.Contains(userRole, StringComparer.OrdinalIgnoreCase);
\`\`\`

In Entity Framework Core, \`allowedRoles.Contains(u.Role)\` translates directly to SQL \`WHERE [u].[Role] IN ('Admin', 'SuperUser', 'Auditor')\`.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem J (Multiples)
*Given two numbers $A$ and $B$. Print "Multiples" if either is a multiple of the other, otherwise print "No Multiples".*

#### Algorithmic Analysis
1. Read integers $A$ and $B$.
2. Formulate the divisibility check using an existential predicate.
3. Validate parity via \`Any()\` over a test pair, or evaluate the condition with short-circuit boolean semantics.

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

        long a = long.Parse(tokens[0]);
        long b = long.Parse(tokens[1]);

        // Evaluate whether any divisibility condition holds true
        bool areMultiples = (b != 0 && a % b == 0) || (a != 0 && b % a == 0);

        Console.WriteLine(areMultiples ? "Multiples" : "No Multiples");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, constant-time modulo division and boolean evaluation.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Predicate evaluation, Modulo conditions |
| ⚪ | Codeforces | [Assiut Sheet #1: Welcome with Conditions](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/I) | Easy | Relational comparisons, Boolean logic |
| ⚪ | Exercism C# | [Pangram](https://exercism.org/tracks/csharp/exercises/pangram) | Easy | \`All\`, Alphabet coverage, Quantifiers |
| ⚪ | Exercism C# | [Isogram](https://exercism.org/tracks/csharp/exercises/isogram) | Medium | \`All\`, Character uniqueness, GroupBy |
`,

  contentBn: `# C# এ এনি (Any) ও অল (All) কোয়ান্টিফায়ার

LINQ-এ কালেকশনের উপাদানগুলোর ওপর বুলিয়ান শর্ত যাচাই করার জন্য **\`Any\`** এবং **\`All\`** অপারেটর দুটি ব্যবহৃত হয়। গাণিতিক যুক্তিশাস্ত্রে এদের কোয়ান্টিফায়ার বলা হয়:
- **\`Any\`**: অস্তিত্ব নির্দেশক ($\\exists x : P(x)$) — কালেকশনের *কমপক্ষে একটি* উপাদান শর্ত পূরণ করে কি না তা দেখে।
- **\`All\`**: সর্বজনীন নির্দেশক ($\\forall x : P(x)$) — কালেকশনের *প্রতিটি* উপাদান শর্ত পূরণ করে কি না তা নিশ্চিত করে।

---

## আন্ডার দ্য হুড: শর্ট-সার্কিট মূল্যায়ন (Short-Circuit Evaluation)

উভয় অপারেটরই টার্মিনাল অপারেটর এবং শর্ত নিশ্চিত হওয়ার সাথে সাথে অতিরিক্ত লুপ না চালিয়ে সাথে সাথে ফলাফল ফেরত দেয়:

\`\`\`csharp
// System.Linq.Enumerable এর অভ্যন্তরীণ ধারণাগত কোড
public static bool Any<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
{
    foreach (TSource element in source)
    {
        if (predicate(element)) return true; // শর্ত মিললেই সাথে সাথে রিটার্ন করে!
    }
    return false;
}

public static bool All<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
{
    foreach (TSource element in source)
    {
        if (!predicate(element)) return false; // একটি ভুল পেলেই সাথে সাথে রিটার্ন করে!
    }
    return true;
}
\`\`\`

---

## Count() > 0 এর মারাত্মক পারফরম্যান্স ত্রুটি

C# কোডিংয়ে অন্যতম ক্ষতিকর ভুল হলো কালেকশনে উপাদান আছে কি না তা যাচাই করতে \`Count()\` ব্যবহার করা:

\`\`\`csharp
// মারাত্মক ভুল: সম্পূর্ণ কালেকশন শেষ পর্যন্ত গুনে দেখে!
if (users.Count() > 0) { ... }

// সর্বোচ্চ পারফরম্যান্স: প্রথম উপাদান পেলেই নিশ্চিত হয়ে যায়!
if (users.Any()) { ... }
\`\`\`

### কেন এটি গুরুত্বপূর্ণ:
১. **ইন-মেমোরি কালেকশনে (\`IEnumerable<T>\`)**: \`Count()\` পুরো সিকোয়েন্সের শেষ পর্যন্ত প্রতিটি উপাদান গণনা করে ($\\mathcal{O}(N)$)। ১ কোটি উপাদানের কালেকশনে \`Count()\` ১ কোটি বার লুপ চালায়; অপরদিকে \`Any()\` **প্রথম উপাদান** দেখেই সাথে সাথে থেমে যায় ($\\mathcal{O}(1)$)।
২. **ডেটাবেস কুয়েরিতে (EF Core / SQL)**:
   - \`Count() > 0\` ডেটাবেসে \`SELECT COUNT(*) FROM [Users]\` চালায়, যা সম্পূর্ণ টেবিল স্ক্যান করে।
   - \`Any()\` ডেটাবেসে \`SELECT CASE WHEN EXISTS (SELECT 1 FROM [Users]) ...\` চালায়, যা প্রথম রো পেলেই সাথে সাথে কুয়েরি সম্পন্ন করে।

---

## খালি কালেকশন ও ভ্যাকুয়াস ট্রুথ (Vacuous Truth)

টেকনিক্যাল ইন্টারভিউতে প্রায়ই খালি কালেকশনের ওপর কোয়ান্টিফায়ারগুলোর আচরণ জিজ্ঞাসা করা হয়:

| অপারেটর | খালি কালেকশনে ফলাফল (\`new List<int>()\`) | গাণিতিক নিয়ম |
| :--- | :--- | :--- |
| **\`Any()\`** | \`false\` | কোনো উপাদানই উপস্থিত নেই। |
| **\`Any(x => x > 0)\`** | \`false\` | কোনো উপাদান শর্ত মেটাতে পারে না। |
| **\`All(x => x > 0)\`** | \`true\` | **ভ্যাকুয়াস ট্রুথ (Vacuous Truth)**: গাণিতিক যুক্তি অনুযায়ী, খালি সেটের প্রতিটি উপাদান শর্ত পূরণ করে, কারণ শর্ত ভঙ্গকারী কোনো উপাদান সেখানে নেই! |

\`\`\`csharp
var emptyList = new List<int>();

bool anyPositive = emptyList.Any(x => x > 0); // false
bool allPositive = emptyList.All(x => x > 0); // true (ভ্যাকুয়াস ট্রুথ!)
\`\`\`

---

## সিকোয়েন্সে উপাদান উপস্থিতি: Contains()

কোনো নির্দিষ্ট উপাদান কালেকশনে আছে কি না তা দেখতে **\`Contains\`** ব্যবহৃত হয়:

\`\`\`csharp
var allowedRoles = new[] { "Admin", "SuperUser", "Auditor" };

bool hasAccess = allowedRoles.Contains(userRole, StringComparer.OrdinalIgnoreCase);
\`\`\`

Entity Framework Core-এ এটি সরাসরি SQL \`WHERE [u].[Role] IN ('Admin', 'SuperUser', 'Auditor')\` কুয়েরিতে রূপান্তর হয়।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem J (Multiples)
*দুটি সংখ্যা $A$ এবং $B$ দেওয়া থাকবে। একটি অপরটির গুণিতক হলে "Multiples" অন্যথায় "No Multiples" প্রিন্ট করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে সংখ্যা $A$ এবং $B$ পার্স করা।
২. মডিউলো অপারেশন ও শর্ট-সার্কিট লজিক দিয়ে গুণিতক কি না তা যাচাই করা।
৩. শূন্য দ্বারা ভাগ প্রতিরোধ করে ফলাফল প্রদর্শন করা।

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

        long a = long.Parse(tokens[0]);
        long b = long.Parse(tokens[1]);

        bool areMultiples = (b != 0 && a % b == 0) || (a != 0 && b % a == 0);

        Console.WriteLine(areMultiples ? "Multiples" : "No Multiples");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, কনস্ট্যান্ট টাইমে মডিউলো ও কন্ডিশনাল অপারেশন।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Predicate evaluation, Modulo conditions |
| ⚪ | Codeforces | [Assiut Sheet #1: Welcome with Conditions](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/I) | Easy | Relational comparisons, Boolean logic |
| ⚪ | Exercism C# | [Pangram](https://exercism.org/tracks/csharp/exercises/pangram) | Easy | \`All\`, Alphabet coverage, Quantifiers |
| ⚪ | Exercism C# | [Isogram](https://exercism.org/tracks/csharp/exercises/isogram) | Medium | \`All\`, Character uniqueness, GroupBy |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Multiples",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["LINQ", "Any", "Conditionals"],
      solutionEn:
        "Determine mutual divisibility between numbers using boolean short-circuiting with division-by-zero guards.",
      solutionBn:
        "শূন্য দিয়ে ভাগ প্রতিরোধ করে বুলিয়ান শর্ট-সার্কিটের মাধ্যমে সংখ্যা দুটির পারস্পরিক গুণিতক হওয়ার শর্ত পরীক্ষা করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Welcome with Conditions",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/I",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["LINQ", "Conditionals", "Logic"],
      solutionEn:
        "Check whether integer A is greater than or equal to B and output Yes or No based on relational evaluation.",
      solutionBn:
        "সংখ্যা A সংখ্যা B এর সমান বা বড় কি না তা রিলেশনাল তুলনা দিয়ে পরীক্ষা করে Yes বা No প্রদর্শন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Pangram",
      url: "https://exercism.org/tracks/csharp/exercises/pangram",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["LINQ", "All", "Strings"],
      solutionEn:
        "Verify that an English sentence contains all 26 lowercase alphabet letters using an All quantifier over a-z.",
      solutionBn:
        "a থেকে z পর্যন্ত বর্ণমালার ওপর All কোয়ান্টিফায়ার চালিয়ে বাক্যে ২৬টি ইংরেজি বর্ণমালার উপস্থিতি যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "Isogram",
      url: "https://exercism.org/tracks/csharp/exercises/isogram",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["LINQ", "All", "GroupBy"],
      solutionEn:
        "Ensure no repeating letters exist in a word by asserting that all letter groups have a count of exactly one.",
      solutionBn:
        "শব্দের অক্ষরগুলোকে গ্রুপ করে All কোয়ান্টিফায়ারে প্রতিটি গ্রুপের আকার ঠিক এক কি না তা নিশ্চিত করুন।",
    },
  ],
};
