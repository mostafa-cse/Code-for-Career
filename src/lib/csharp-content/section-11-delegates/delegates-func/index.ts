import type { LocalLesson } from "@/lib/lessons-data";

export const delegatesFuncLesson: LocalLesson = {
  slug: "delegates-func",
  titleEn: "Func<T, TResult> Delegate",
  titleBn: "ফাঙ্ক (Func<T, TResult>) জেনেরিক ডেলিগেট",
  categoryEn: "11. Delegates",
  categoryBn: "১১. ডেলিগেট (Delegates)",
  categoryDescEn:
    "Type-safe function pointers in .NET: single-cast and multicast delegates, built-in Action, Func, and Predicate generic delegates.",
  categoryDescBn:
    ".NET এ টাইপ-নিরাপদ ফাংশন পয়েন্টার: সিঙ্গেল ও মাল্টিকাস্ট ডেলিগেট, বিল্ট-ইন Action, Func এবং Predicate জেনেরিক ডেলিগেট।",
  categoryPriority: "CORE",
  descriptionEn:
    "Value-returning generic delegates, covariance and contravariance (Func<in T, out TResult>), function composition, LINQ foundations, and memoization.",
  descriptionBn:
    "মান রিটার্নকারী জেনেরিক ডেলিগেট, ভ্যারিয়েন্স (Func<in T, out TResult>), ফাংশন কম্পোজিশন, LINQ ভিত্তি এবং মেমোইজেশন।",
  difficulty: "EASY",
  displayOrder: 4,
  prerequisites: ["delegates-action"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Func<T, TResult> Delegate in C#

\`System.Func\` is the most widely utilized delegate type in modern .NET. It represents any method that accepts between $0$ and $16$ input parameters and **returns a typed result value** (\`TResult\`).

\`Func\` serves as the foundational architectural bedrock for **LINQ (Language Integrated Query)** and functional programming idioms in C#.

---

## The Golden Rule of Func

> **In \`Func<T1, T2, ..., TResult>\`, the VERY LAST type argument is ALWAYS the return type.** All preceding type arguments represent input parameters.

| Delegate Signature | Parameters Accepted | Return Type |
| :--- | :--- | :--- |
| \`Func<int>\` | None ($0$) | \`int\` |
| \`Func<string, int>\` | One: \`string\` | \`int\` |
| \`Func<int, int, double>\` | Two: \`int\`, \`int\` | \`double\` |
| \`Func<T1, T2, T3, TResult>\` | Three: \`T1\`, \`T2\`, \`T3\` | \`TResult\` |

---

## Variance: \`Func<in T, out TResult>\`

\`Func\` declarations leverage both **contravariant inputs** (\`in\`) and a **covariant output** (\`out\`):

\`\`\`csharp
public delegate TResult Func<in T, out TResult>(T arg);
\`\`\`

1. **Covariant Return (\`out\` TResult)**: A delegate returning a derived type can be assigned to a delegate returning a base type:
   \`\`\`csharp
   Func<Dog> getDog = () => new Dog();
   Func<Animal> getAnimal = getDog; // Legal via covariance!
   \`\`\`
2. **Contravariant Parameter (\`in\` T)**: A delegate accepting a base type can be assigned to a delegate accepting a derived type:
   \`\`\`csharp
   Func<Animal, string> describeAnimal = a => a.ToString()!;
   Func<Dog, string> describeDog = describeAnimal; // Legal via contravariance!
   \`\`\`

---

## Functional Architecture: Composition & Memoization

Because \`Func\` instances are first-class values, they can be dynamically composed and decorated:

### 1. Function Composition Pipeline:
\`\`\`csharp
public static Func<T1, T3> Compose<T1, T2, T3>(Func<T1, T2> f, Func<T2, T3> g)
{
    return x => g(f(x));
}

// Example usage:
Func<string, string> trim = s => s.Trim();
Func<string, int> getLength = s => s.Length;

Func<string, int> trimmedLength = Compose(trim, getLength);
Console.WriteLine(trimmedLength("   Hello World   ")); // 11
\`\`\`

### 2. Pure Function Memoization (Caching):
\`\`\`csharp
public static Func<T, TResult> Memoize<T, TResult>(Func<T, TResult> compute) where T : notnull
{
    var cache = new Dictionary<T, TResult>();
    return arg =>
    {
        if (cache.TryGetValue(arg, out var cachedValue))
        {
            return cachedValue;
        }
        var computed = compute(arg);
        cache[arg] = computed;
        return computed;
    };
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem L (The Brothers)
*Given two people's full names (Person 1: $F_1, S_1$; Person 2: $F_2, S_2$). Determine whether they are brothers (i.e. whether their second names $S_1$ and $S_2$ are identical). Print \`ARE Brothers\` if they are, else \`NOT\`.*
*Encapsulate the surname extraction using a \`Func<string, string>\` selector.*

#### Algorithmic Analysis
1. Read lines containing two space-separated words for each person.
2. Define a \`Func<string, string> extractSurname = fullName => fullName.Split(' ')[1];\`.
3. Compare the extracted surnames using case-sensitive ordinal comparison.

#### C# Implementation

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string? person1 = Console.ReadLine();
        string? person2 = Console.ReadLine();

        if (string.IsNullOrWhiteSpace(person1) || string.IsNullOrWhiteSpace(person2))
        {
            return;
        }

        // Func delegate to extract the family surname (second token)
        Func<string, string> extractSurname = fullName =>
        {
            string[] parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return parts.Length > 1 ? parts[1] : string.Empty;
        };

        string surname1 = extractSurname(person1);
        string surname2 = extractSurname(person2);

        if (string.Equals(surname1, surname2, StringComparison.Ordinal))
        {
            Console.WriteLine("ARE Brothers");
        }
        else
        {
            Console.WriteLine("NOT");
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(L)$ where $L$ is the string length of the names ($L \\le 100$). Substring splitting and string comparison execute in linear time.
- **Space Complexity**: $\\mathcal{O}(L)$ to allocate split token substrings on the heap.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: The Brothers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/L) | Easy | \`Func<T, TResult>\`, String token extraction, Equality |
| ⚪ | Codeforces | [Assiut Sheet #1: Area of a Circle](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/E) | Easy | Geometric formulas, Mathematical functions, Precision |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | \`Func\` transformers, Generic yield iteration, LINQ |
| ⚪ | Exercism C# | [Flatten Array](https://exercism.org/tracks/csharp/exercises/flatten-array) | Medium | Recursive mapping, Filtering, Value projection |
`,

  contentBn: `# C# এ ফাঙ্ক (Func<T, TResult>) জেনেরিক ডেলিগেট

\`System.Func\` হলো আধুনিক .NET এর সবচেয়ে বেশি ব্যবহৃত জেনেরিক ডেলিগেট। এটি $০$ থেকে $১৬$টি ইনপুট প্যারামিটার গ্রহণ করতে পারে এবং সর্বদা **একটি নির্দিষ্ট টাইপের মান রিটার্ন করে** (\`TResult\`)।

সি# এ **LINQ (Language Integrated Query)** এর প্রতিটি রূপান্তর অপারেশন (\`Select\`, \`OrderBy\`, \`GroupBy\`) মূলত \`Func\` ডেলিগেটের ওপর ভিত্তি করে তৈরি।

---

## ফাঙ্কের সুবর্ণ নিয়ম (The Golden Rule of Func)

> **\`Func<T1, T2, ..., TResult>\` এ সবার শেষের টাইপ প্যারামিটারটি সর্বদা রিটার্ন টাইপ নির্দেশ করে।** তার আগের সকল টাইপ হলো মেথডের ইনপুট প্যারামিটার।

| ডেলিগেট সিগনেচার | ইনপুট প্যারামিটার সংখ্যা | রিটার্ন টাইপ |
| :--- | :--- | :--- |
| \`Func<int>\` | কোনো প্যারামিটার নেই ($০$) | \`int\` |
| \`Func<string, int>\` | ১টি: \`string\` | \`int\` |
| \`Func<int, int, double>\` | ২টি: \`int\`, \`int\` | \`double\` |
| \`Func<T1, T2, T3, TResult>\` | ৩টি: \`T1\`, \`T2\`, \`T3\` | \`TResult\` |

---

## ভ্যারিয়েন্স: \`Func<in T, out TResult>\`

\`Func\` ডেলিগেটে **কন্ট্রাভ্যারিয়েন্ট ইনপুট** (\`in\`) এবং **কোভ্যারিয়েন্ট আউটপুট** (\`out\`) উভয়ই সমর্থিত:

\`\`\`csharp
public delegate TResult Func<in T, out TResult>(T arg);
\`\`\`

১. **কোভ্যারিয়েন্ট রিটার্ন (\`out\` TResult)**: চাইল্ড ক্লাস রিটার্নকারী ডেলিগেটকে প্যারেন্ট ক্লাস রিটার্নকারী ডেলিগেটে রূপান্তর করা যায়:
   \`\`\`csharp
   Func<Dog> getDog = () => new Dog();
   Func<Animal> getAnimal = getDog; // সম্পূর্ণ বৈধ
   \`\`\`
২. **কন্ট্রাভ্যারিয়েন্ট প্যারামিটার (\`in\` T)**: প্যারেন্ট ক্লাস গ্রহণকারী ডেলিগেটকে চাইল্ড ক্লাসের ডেলিগেটে অ্যাসাইন করা যায়:
   \`\`\`csharp
   Func<Animal, string> describeAnimal = a => a.ToString()!;
   Func<Dog, string> describeDog = describeAnimal; // সম্পূর্ণ বৈধ
   \`\`\`

---

## ফাংশনাল আর্কিটেকচার: কম্পোজিশন ও মেমোইজেশন

যেহেতু \`Func\` হলো প্রথম-শ্রেণির ভ্যালু (First-Class Citizen), তাই এদের চেইনিং বা ক্যাশ করা যায়:

### ১. ফাংশন কম্পোজিশন (Function Composition):
\`\`\`csharp
public static Func<T1, T3> Compose<T1, T2, T3>(Func<T1, T2> f, Func<T2, T3> g)
{
    return x => g(f(x));
}

Func<string, string> trim = s => s.Trim();
Func<string, int> getLength = s => s.Length;

Func<string, int> trimmedLength = Compose(trim, getLength);
Console.WriteLine(trimmedLength("   Hello World   ")); // 11
\`\`\`

### ২. মেমোইজেশন প্যাটার্ন (ক্যাশিং):
\`\`\`csharp
public static Func<T, TResult> Memoize<T, TResult>(Func<T, TResult> compute) where T : notnull
{
    var cache = new Dictionary<T, TResult>();
    return arg =>
    {
        if (cache.TryGetValue(arg, out var cachedValue))
        {
            return cachedValue;
        }
        var computed = compute(arg);
        cache[arg] = computed;
        return computed;
    };
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem L (The Brothers)
*দুটি ব্যক্তির পূর্ণ নাম দেওয়া থাকবে (১ম ব্যক্তি: $F_1, S_1$; ২য় ব্যক্তি: $F_2, S_2$)। তারা পরস্পর ভাই কি না তা নির্ধারণ করতে হবে (অর্থাৎ তাদের দ্বিতীয় নাম $S_1$ ও $S_2$ হুবহু এক কি না)। ভাই হলে \`ARE Brothers\` অন্যথায় \`NOT\` প্রিন্ট করুন।*
*দ্বিতীয় নাম বা পদবী আলাদা করার কাজটি \`Func<string, string>\` দিয়ে সম্পন্ন করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে দুটি লাইনে দুটি নাম পড়া।
২. একটি \`Func<string, string>\` ডেলিগেট তৈরি করে স্পেস দিয়ে বিভক্ত করে পদবী বা দ্বিতীয় নাম আলাদা করা।
৩. স্ট্রিং তুলনা করে ফলাফল প্রদর্শন করা।

#### C# সমাধান

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string? person1 = Console.ReadLine();
        string? person2 = Console.ReadLine();

        if (string.IsNullOrWhiteSpace(person1) || string.IsNullOrWhiteSpace(person2))
        {
            return;
        }

        // পদবী আলাদা করার Func ডেলিগেট
        Func<string, string> extractSurname = fullName =>
        {
            string[] parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return parts.Length > 1 ? parts[1] : string.Empty;
        };

        string surname1 = extractSurname(person1);
        string surname2 = extractSurname(person2);

        if (string.Equals(surname1, surname2, StringComparison.Ordinal))
        {
            Console.WriteLine("ARE Brothers");
        }
        else
        {
            Console.WriteLine("NOT");
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(L)$, যেখানে $L$ হলো নামের স্ট্রিংয়ের দৈর্ঘ্য ($L \\le 100$)।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(L)$, স্প্লিট করা সাবস্ট্রিংয়ের মেমোরি হিপে যুক্ত হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: The Brothers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/L) | Easy | \`Func<T, TResult>\`, String token extraction, Equality |
| ⚪ | Codeforces | [Assiut Sheet #1: Area of a Circle](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/E) | Easy | Geometric formulas, Mathematical functions, Precision |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | \`Func\` transformers, Generic yield iteration, LINQ |
| ⚪ | Exercism C# | [Flatten Array](https://exercism.org/tracks/csharp/exercises/flatten-array) | Medium | Recursive mapping, Filtering, Value projection |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: The Brothers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/L",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Func", "Strings", "Parsing"],
      solutionEn:
        "Extract family surnames using a Func<string, string> token selector, comparing the second tokens to confirm brotherhood.",
      solutionBn:
        "Func<string, string> ডেলিগেট দিয়ে পূর্ণ নাম থেকে পদবী আলাদা করুন এবং দ্বিতীয় টোকেন দুটি তুলনা করে ভ্রাতৃত্ব নিশ্চিত করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Area of a Circle",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/E",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Math", "Func", "Precision"],
      solutionEn:
        "Calculate circular area using pi * R^2 with double precision, encapsulating the computation inside a mathematical Func delegate.",
      solutionBn:
        "গাণিতিক Func ডেলিগেটের মধ্যে pi * R^2 সূত্র এনক্যাপসুলেট করে উচ্চ নির্ভুলতায় বৃত্তের ক্ষেত্রফল হিসাব করুন।",
    },
    {
      source: "Exercism C#",
      name: "Strain",
      url: "https://exercism.org/tracks/csharp/exercises/strain",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Func", "Generics", "Yield"],
      solutionEn:
        "Implement custom functional Keep and Discard operations on collections using Func predicate filters and yield return statements.",
      solutionBn:
        "Func ডেলিগেট ও yield return ব্যবহার করে কালেকশন ফিল্টারিংয়ের Keep ও Discard মেথড বাস্তবায়ন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Flatten Array",
      url: "https://exercism.org/tracks/csharp/exercises/flatten-array",
      difficulty: "MEDIUM",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Recursion", "Func", "Collections"],
      solutionEn:
        "Recursively unpack nested multi-dimensional object arrays into a single flat list while stripping null elements.",
      solutionBn:
        "রিকার্সিভ মেথডের সাহায্যে নেস্টেড অবজেক্ট অ্যারেকে ফ্ল্যাট সিঙ্গেল লিস্টে রূপান্তর করুন এবং নাল উপাদানগুলো বাদ দিন।",
    },
  ],
};
