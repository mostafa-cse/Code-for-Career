import type { LocalLesson } from "@/lib/lessons-data";

export const genericsConstraintsLesson: LocalLesson = {
  slug: "generics-constraints",
  titleEn: "Generic Constraints (where T : ...)",
  titleBn: "জেনেরিক কনস্ট্রেইন্ট ও হোয়্যার (where) শর্ত",
  categoryEn: "07. Generics",
  categoryBn: "০৭. জেনেরিকস (Generics)",
  categoryDescEn:
    "Type-safe abstraction in .NET: generic methods, reusable container classes, interface contracts, and compile-time constraints.",
  categoryDescBn:
    ".NET এ টাইপ-নিরাপদ অ্যাবস্ট্রাকশন: জেনেরিক মেথড, পুনঃব্যবহারযোগ্য ক্লাস ও ইন্টারফেস এবং কম্পাইল-টাইম কনস্ট্রেইন্ট।",
  categoryPriority: "CORE",
  descriptionEn:
    "Enforcing capabilities on type parameters: where T : struct, class, new(), unmanaged, base class, and modern C# 11 Generic Math (INumber<T>).",
  descriptionBn:
    "টাইপ প্যারামিটারের ওপর শর্তারোপ: where T : struct, class, new(), unmanaged, ইন্টারফেস এবং আধুনিক C# 11 জেনেরিক ম্যাথ।",
  difficulty: "MEDIUM",
  displayOrder: 4,
  prerequisites: ["generics-classes"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Generic Constraints in C#

By default, an unconstrained type parameter \`T\` can be substituted with literally any type. Because the C# compiler has no prior knowledge of what \`T\` might be, it only allows you to call methods defined on \`System.Object\` (\`ToString\`, \`Equals\`, \`GetHashCode\`).

**Generic constraints** (\`where T : ...\`) restrict the types that can be supplied as type arguments, **unlocking constructors, specific interface methods, base class properties, and mathematical operators** at compile time.

---

## The Complete Matrix of Generic Constraints

| Constraint | Syntax | Meaning & Compiler Capability Unlocked |
|---|---|---|
| **Value Type** | \`where T : struct\` | \`T\` must be a non-nullable value type. Disallows \`null\`; guarantees stack copy semantics. |
| **Reference Type** | \`where T : class\` | \`T\` must be a reference type. Allows checking \`item == null\`. |
| **Non-Nullable** | \`where T : notnull\` | \`T\` must be a non-nullable value or reference type (C# 8+). |
| **Unmanaged** | \`where T : unmanaged\` | \`T\` must be a struct containing only primitive fields (blittable; supports pointer operations \`sizeof(T)\`). |
| **Constructor** | \`where T : new()\` | \`T\` must have a public parameterless constructor. **Allows \`new T()\` instantiation**. |
| **Base Class** | \`where T : EntityBase\` | \`T\` must be or derive from \`EntityBase\`. Unlocks access to all base class members. |
| **Interface** | \`where T : IComparable<T>\` | \`T\` must implement the specified interface. Unlocks interface methods with **zero boxing**. |
| **Type Parameter** | \`where T : U\` | \`T\` must derive from or implement another type parameter \`U\` (naked constraint). |

---

## Strict Syntax Ordering Rules

When applying multiple constraints to a single type parameter, the C# compiler enforces a strict order:

\`\`\`
1. Primary Constraint: 'class' OR 'struct' OR 'unmanaged' OR BaseClassName (at most one)
                      │
                      ▼
2. Secondary Constraints: One or more Interfaces (IComparable<T>, IDisposable)
                      │
                      ▼
3. Constructor Constraint: 'new()' (MUST ALWAYS BE LAST!)
\`\`\`

\`\`\`csharp
// ✅ Correct order: Primary -> Interface -> new()
public class Repository<T> where T : BaseEntity, IAuditable, new()
{
    public T CreateDefault() => new T();
}

// ❌ Invalid: new() cannot appear before interfaces
// public class BadRepo<T> where T : new(), IAuditable { }
\`\`\`

---

## Modern C# 11 Generic Math: \`INumber<T>\`

Historically in C#, you could **never** write a generic arithmetic method like:
\`\`\`csharp
// ❌ Won't compile in C# 10 or earlier: Operator '+' cannot be applied to operands of type 'T' and 'T'
// public static T Add<T>(T a, T b) => a + b;
\`\`\`

In **C# 11**, .NET introduced **Static Virtual Members in Interfaces** and the **\`INumber<T>\`** hierarchy:

\`\`\`csharp
using System.Numerics;

// ✅ Valid in C# 11+ / .NET 7+!
public static T Add<T>(T a, T b) where T : INumber<T>
{
    return a + b; // Uses static virtual operator '+' defined on INumber<T>!
}

int sumInt = Add(10, 20);          // 30
double sumDouble = Add(1.5, 2.5);  // 4.0
decimal sumDecimal = Add(10m, 20m); // 30m
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #5 — Problem G (Max and MIN)
*Given an array of $N$ numbers. Find the minimum and the maximum values in the array using a constrained generic method.*

#### Problem Analysis
- Input: Length $N$ followed by $N$ integers.
- Output: Minimum value and maximum value separated by a space.
- Architecture: Implement a generic method constrained to \`where T : IComparable<T>\` that operates seamlessly on any comparable type with zero boxing.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class MaxAndMinGenericSolution
{
    // Reusable method constrained to types supporting IComparable<T>
    public static (T min, T max) FindMinAndMax<T>(T[] items) where T : IComparable<T>
    {
        if (items == null || items.Length == 0)
        {
            throw new ArgumentException("Array cannot be empty.");
        }

        T min = items[0];
        T max = items[0];

        for (int i = 1; i < items.Length; i++)
        {
            if (items[i].CompareTo(min) < 0)
            {
                min = items[i];
            }
            if (items[i].CompareTo(max) > 0)
            {
                max = items[i];
            }
        }

        return (min, max);
    }

    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;
        int n = int.Parse(nLine.Trim());

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i], CultureInfo.InvariantCulture);
        }

        // Generic invocation: T resolved to int with native specialized machine code
        var (min, max) = FindMinAndMax(numbers);

        Console.WriteLine($"{min} {max}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$ — single linear scan across $N$ elements.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory — constant stack variables.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem G: Max and MIN](https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/G) | Easy | where T : IComparable, Linear Scan |
| ⚪ | Codeforces Assiut | [Problem A: Add](https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/A) | Easy | Methods, Generic Math Concepts |
| ⚪ | Exercism C# | [Grade School](https://exercism.org/tracks/csharp/exercises/grade-school) | Medium | Generic Dictionaries, Sorting Constraints |
| ⚪ | Exercism C# | [Tournament](https://exercism.org/tracks/csharp/exercises/tournament) | Medium | Multi-field Comparison, Custom Classes |
`,

  contentBn: `# C# এ জেনেরিক কনস্ট্রেইন্ট ও হোয়্যার (where) শর্ত

ডিফল্টভাবে একটি জেনেরিক টাইপ প্যারামিটার \`T\` যেকোনো ডেটা টাইপ হতে পারে। যেহেতু কম্পাইলার আগে থেকে \`T\` সম্পর্কে কিছু জানতে পারে না, তাই এটি কেবল \`System.Object\` এর সাধারণ মেথডগুলো (\`ToString\`, \`Equals\`, \`GetHashCode\`) কল করার অনুমতি দেয়।

**জেনেরিক কনস্ট্রেইন্ট (\`where T : ...\`)** টাইপ প্যারামিটারের ওপর সুনির্দিষ্ট শর্তারোপ করে। এর ফলে কম্পাইলার নিশ্চিত হতে পারে যে নির্দিষ্ট টাইপটিতে **কনস্ট্রাক্টর (\`new()\`), বেস ক্লাস, ইন্টারফেস মেথড অথবা গাণিতিক অপারেটর** বিদ্যমান রয়েছে।

---

## জেনেরিক কনস্ট্রেইন্টের সম্পূর্ণ তালিকা

| কনস্ট্রেইন্ট | সিনট্যাক্স | অর্থ ও কম্পাইলারের সুবিধা |
|---|---|---|
| **ভ্যালু টাইপ** | \`where T : struct\` | \`T\` অবশ্যই নন-নালেবল ভ্যালু টাইপ হতে হবে। \`null\` নিষিদ্ধ; স্ট্যাক কপি নিশ্চিত। |
| **রেফারেন্স টাইপ** | \`where T : class\` | \`T\` অবশ্যই রেফারেন্স টাইপ হবে। \`item == null\` চেক করা যায়। |
| **নন-নালেবল** | \`where T : notnull\` | \`T\` কোনো নাল ভ্যালু হতে পারবে না (C# 8+)। |
| **আনম্যানেজড** | \`where T : unmanaged\` | প্রিমিটিভ স্ট্রাক্ট যা সরাসরি পয়েন্টার ও \`sizeof(T)\` সমর্থন করে। |
| **কনস্ট্রাক্টর** | \`where T : new()\` | পাবলিক প্যারামিটারহীন কনস্ট্রাক্টর থাকতে হবে। **\`new T()\` তৈরি করা যায়**। |
| **বেস ক্লাস** | \`where T : EntityBase\` | \`T\` অবশ্যই উক্ত বেস ক্লাসের উত্তরাধিকারী হতে হবে। |
| **ইন্টারফেস** | \`where T : IComparable<T>\` | নির্দিষ্ট ইন্টারফেস মেথডগুলো **কোনো বক্সিং ছাড়া** কল করা যায়। |
| **টাইপ রিলেশন** | \`where T : U\` | \`T\` অবশ্যই অপর টাইপ প্যারামিটার \`U\` এর সমতুল্য বা চাইল্ড হবে। |

---

## কনস্ট্রেইন্ট সাজানোর কঠোর নিয়মাবলি

একাধিক শর্ত এক সাথে ব্যবহারের সময় সি# কম্পাইলার একটি নির্দিষ্ট ক্রম অনুসরণ করতে বাধ্য করে:

\`\`\`
১. প্রাইমারি শর্ত: 'class' অথবা 'struct' অথবা 'unmanaged' অথবা বেস ক্লাসের নাম
                      │
                      ▼
২. সেকেন্ডারি শর্ত: এক বা একাধিক ইন্টারফেসের নাম (IComparable<T>, IDisposable)
                      │
                      ▼
৩. কনস্ট্রাক্টর শর্ত: 'new()' (সর্বদা তালিকার শেষে থাকতে হবে!)
\`\`\`

\`\`\`csharp
// ✅ সঠিক ক্রম: বেস ক্লাস -> ইন্টারফেস -> new()
public class Repository<T> where T : BaseEntity, IAuditable, new()
{
    public T CreateDefault() => new T();
}
\`\`\`

---

## আধুনিক C# 11 জেনেরিক ম্যাথ: \`INumber<T>\`

ঐতিহাসিকভাবে সি# এ জেনেরিক মেথডে সরাসরি \`+\` বা \`-\` লেখা যেত না:
\`\`\`csharp
// ❌ C# 10 বা পূর্বে কম্পাইল হতো না: Operator '+' cannot be applied to type 'T'
// public static T Add<T>(T a, T b) => a + b;
\`\`\`

**C# 11 ও .NET 7** এ যুক্ত হওয়া **\`INumber<T>\`** ইন্টারফেসের মাধ্যমে এই সমস্যার নিখুঁত সমাধান এসেছে:

\`\`\`csharp
using System.Numerics;

// ✅ C# 11+ এ শতভাগ বৈধ ও কার্যকর!
public static T Add<T>(T a, T b) where T : INumber<T>
{
    return a + b; // INumber<T> এর স্ট্যাটিক ভার্চুয়াল '+' অপারেটর ব্যবহৃত হয়
}

int sumInt = Add(10, 20);          // 30
double sumDouble = Add(1.5, 2.5);  // 4.0
decimal sumDecimal = Add(10m, 20m); // 30m
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #৫ — Problem G (Max and MIN)
*একটি অ্যারির $N$ টি সংখ্যার মধ্যে সর্বনিম্ন ও সর্বোচ্চ সংখ্যা দুটি খুঁজে বের করতে হবে।*

#### সমাধান বিশ্লেষণ
- \`where T : IComparable<T>\` কনস্ট্রেইন্ট ব্যবহার করে যেকোনো তুলনযোগ্য ডেটা টাইপের জন্য সর্বোচ্চ ও সর্বনিম্ন মান নির্ণয় করা হয়েছে।
- JIT কম্পাইলার কোনো প্রকার বক্সিং ছাড়াই এটি দ্রুততম নেটিভ কোডে রূপান্তর করে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class MaxAndMinGenericSolution
{
    public static (T min, T max) FindMinAndMax<T>(T[] items) where T : IComparable<T>
    {
        if (items == null || items.Length == 0)
        {
            throw new ArgumentException("Array cannot be empty.");
        }

        T min = items[0];
        T max = items[0];

        for (int i = 1; i < items.Length; i++)
        {
            if (items[i].CompareTo(min) < 0)
            {
                min = items[i];
            }
            if (items[i].CompareTo(max) > 0)
            {
                max = items[i];
            }
        }

        return (min, max);
    }

    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;
        int n = int.Parse(nLine.Trim());

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i], CultureInfo.InvariantCulture);
        }

        var (min, max) = FindMinAndMax(numbers);

        Console.WriteLine($"{min} {max}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$ — অ্যারির উপাদানগুলোতে একবার স্ক্যান।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত স্ট্যাক মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem G: Max and MIN](https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/G) | Easy | where T : IComparable, Linear Scan |
| ⚪ | Codeforces Assiut | [Problem A: Add](https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/A) | Easy | Methods, Generic Math Concepts |
| ⚪ | Exercism C# | [Grade School](https://exercism.org/tracks/csharp/exercises/grade-school) | Medium | Generic Dictionaries, Sorting Constraints |
| ⚪ | Exercism C# | [Tournament](https://exercism.org/tracks/csharp/exercises/tournament) | Medium | Multi-field Comparison, Custom Classes |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #5",
      name: "Problem G: Max and MIN",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/G",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Generics", "Constraints", "IComparable"],
      solutionEn: "Apply where T : IComparable<T> constraint to find minimum and maximum array elements generically.",
      solutionBn: "where T : IComparable<T> শর্ত ব্যবহার করে জেনেরিক উপায়ে অ্যারির সর্বনিম্ন ও সর্বোচ্চ উপাদান খুঁজুন।",
    },
    {
      source: "Codeforces Assiut Sheet #5",
      name: "Problem A: Add",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/A",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Methods", "Math", "Generics"],
      solutionEn: "Compute sum of two integer inputs with clean method encapsulation.",
      solutionBn: "পরিচ্ছন্ন মেথড এনক্যাপসুলেশনে দুটি পূর্ণসংখ্যার যোগফল নির্ণয় করুন।",
    },
    {
      source: "Exercism C#",
      name: "Grade School",
      url: "https://exercism.org/tracks/csharp/exercises/grade-school",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["Generics", "SortedList", "Constraints"],
      solutionEn: "Manage student rosters by grade using sorted generic dictionaries and constrained comparisons.",
      solutionBn: "সর্টেড ডিকশনারি ও কম্পারিজন কনস্ট্রেইন্ট ব্যবহার করে গ্রেড অনুযায়ী শিক্ষার্থীদের রোস্টার পরিচালনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Tournament",
      url: "https://exercism.org/tracks/csharp/exercises/tournament",
      difficulty: "MEDIUM",
      company: "Kaz Software",
      tags: ["Generics", "Sorting", "Classes"],
      solutionEn: "Sort football league tables using custom entity comparisons based on points and team names.",
      solutionBn: "পয়েন্ট ও দলের নামের ভিত্তিতে কাস্টম অবজেক্ট তুলনা করে ফুটবল লীগ টেবিল সর্ট করুন।",
    },
  ],
};
