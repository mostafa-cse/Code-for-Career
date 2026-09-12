import type { LocalLesson } from "@/lib/lessons-data";

export const genericsInterfacesLesson: LocalLesson = {
  slug: "generics-interfaces",
  titleEn: "Generic Interfaces",
  titleBn: "জেনেরিক ইন্টারফেস ও BCL কন্ট্রাক্ট",
  categoryEn: "07. Generics",
  categoryBn: "০৭. জেনেরিকস (Generics)",
  categoryDescEn:
    "Type-safe abstraction in .NET: generic methods, reusable container classes, interface contracts, and compile-time constraints.",
  categoryDescBn:
    ".NET এ টাইপ-নিরাপদ অ্যাবস্ট্রাকশন: জেনেরিক মেথড, পুনঃব্যবহারযোগ্য ক্লাস ও ইন্টারফেস এবং কম্পাইল-টাইম কনস্ট্রেইন্ট।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Essential BCL contracts (IEquatable, IComparable, IComparer, IEnumerable), covariance (out T), contravariance (in T), and repository patterns.",
  descriptionBn:
    "প্রয়োজনীয় BCL ইন্টারফেসসমূহ, কোভ্যারিয়েন্স (out T), কন্ট্রাভ্যারিয়েন্স (in T) এবং এন্টারপ্রাইজ রিপোজিটরি প্যাটার্ন।",
  difficulty: "EASY",
  displayOrder: 3,
  prerequisites: ["generics-classes"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Generic Interfaces & BCL Contracts in C#

**Generic interfaces** define type-safe behavioral contracts without the performance overhead of boxing or runtime type casting. 

The .NET Base Class Library (BCL) is organized around standard generic interfaces that govern equality, sorting, iteration, and collection querying.

---

## The Core BCL Generic Interfaces

| Interface | Key Method | Primary Purpose |
|---|---|---|
| **\`IEquatable<T>\`** | \`bool Equals(T? other)\` | Type-safe equality check; prevents boxing value types in dictionaries/sets. |
| **\`IComparable<T>\`** | \`int CompareTo(T? other)\` | Defines the natural sort order for elements used by \`Array.Sort\` and \`List<T>.Sort\`. |
| **\`IComparer<T>\`** | \`int Compare(T? x, T? y)\` | External comparison strategy; allows sorting by multiple alternative criteria. |
| **\`IEnumerable<T>\`** | \`IEnumerator<T> GetEnumerator()\` | Base sequence iteration contract powering \`foreach\` and LINQ. |
| **\`ICollection<T>\`** | \`void Add(T item)\`, \`int Count\` | Mutation and sizing contract for collections. |
| **\`IList<T>\`** | \`T this[int index] { get; set; }\` | Index-based random access collection contract. |

---

## Implementing \`IComparable<T>\` vs \`IComparer<T>\`

- **\`IComparable<T>\`**: Implemented directly **on the entity class** to define its default (natural) sort order.
- **\`IComparer<T>\`**: Implemented on an **independent helper class** to define alternative sorting strategies (e.g. Sort by Salary, Sort by Join Date).

\`\`\`csharp
public class Developer : IComparable<Developer>, IEquatable<Developer>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Salary { get; set; }

    // 1. Natural ordering: Highest salary first
    public int CompareTo(Developer? other)
    {
        if (other is null) return 1;
        return other.Salary.CompareTo(Salary); // Descending
    }

    // 2. Strongly typed equality: Check identity by Id
    public bool Equals(Developer? other)
    {
        if (other is null) return false;
        return Id == other.Id;
    }
}

// 3. Alternative sorting strategy via IComparer<T>
public class DeveloperNameComparer : IComparer<Developer>
{
    public int Compare(Developer? x, Developer? y)
    {
        return string.Compare(x?.Name, y?.Name, StringComparison.OrdinalIgnoreCase);
    }
}
\`\`\`

---

## Covariance (\`out T\`) & Contravariance (\`in T\`)

A favorite senior architecture interview topic:

### 1. Covariance (\`out T\`) — Output Only
Allows you to assign an interface of a more derived type to an interface of a less derived type:
\`\`\`csharp
// IEnumerable<T> is defined as: public interface IEnumerable<out T>
IEnumerable<string> strings = new List<string> { "Dhaka", "Sylhet" };
IEnumerable<object> objects = strings; // ✅ Valid due to covariance!
\`\`\`
> **Rule**: The type parameter \`T\` can only appear in **method return positions (outputs)**, never in method parameter positions.

### 2. Contravariance (\`in T\`) — Input Only
Allows you to assign an interface of a less derived type to an interface of a more derived type:
\`\`\`csharp
// IComparer<T> is defined as: public interface IComparer<in T>
IComparer<object> objectComparer = new CustomObjectComparer();
IComparer<string> stringComparer = objectComparer; // ✅ Valid due to contravariance!
\`\`\`
> **Rule**: The type parameter \`T\` can only appear in **method parameter positions (inputs)**.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 — Problem H (Sorting)
*Given an array of $N$ numbers. Sort the array in ascending order using BCL generic comparison contracts.*

#### Problem Analysis
- Input: An integer $N$ followed by $N$ integers.
- Goal: Sort the elements in ascending order.
- Architecture: \`Array.Sort<T>\` leverages \`IComparable<T>\` and Introsort ($O(N \\log N)$ worst-case).

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class SortingSolution
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;
        int n = int.Parse(nLine.Trim());

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] arr = new int[n];

        for (int i = 0; i < n; i++)
        {
            arr[i] = int.Parse(tokens[i], CultureInfo.InvariantCulture);
        }

        // Array.Sort uses generic IComparable<int> without boxing
        Array.Sort(arr);

        Console.WriteLine(string.Join(" ", arr));
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N \\log N)$ — Introsort (hybrid of QuickSort, HeapSort, and InsertionSort).
- **Space Complexity**: $\\mathcal{O}(\\log N)$ — recursion stack space during sorting.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem H: Sorting](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H) | Easy | IComparable, Introsort, Generic Array.Sort |
| ⚪ | Codeforces Assiut | [Problem B: Searching](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B) | Easy | Linear Search, IEquatable, Index Lookups |
| ⚪ | Exercism C# | [FaceID 2](https://exercism.org/tracks/csharp/exercises/faceid-2) | Medium | IEquatable, Equals, GetHashCode Contract |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | IEnumerable, LINQ, IReadOnlyList |
`,

  contentBn: `# C# এ জেনেরিক ইন্টারফেস ও BCL কন্ট্রাক্ট

**জেনেরিক ইন্টারফেস (Generic Interface)** কোনো প্রকার কাস্টিং বা বক্সিংয়ের মেমোরি অপচয় ছাড়া ক্লাসের জন্য টাইপ-নিরাপদ চুক্তি বা কন্ট্রাক্ট তৈরি করে।

.NET বেস ক্লাস লাইব্রেরি (BCL) মূলত বিভিন্ন স্ট্যান্ডার্ড জেনেরিক ইন্টারফেসের ওপর ভিত্তি করে গঠিত, যা অবজেক্টের সমতা, বাছাইকরণ (Sorting), ইটারেশন এবং কালেকশন অনুসন্ধানে ব্যবহৃত হয়।

---

## প্রধান BCL জেনেরিক ইন্টারফেস তালিকা

| ইন্টারফেস | প্রধান মেথড | প্রাথমিক উদ্দেশ্য ও ভূমিকা |
|---|---|---|
| **\`IEquatable<T>\`** | \`bool Equals(T? other)\` | টাইপ-সেফ সমতা যাচাই; বক্সিং এড়ায়। |
| **\`IComparable<T>\`** | \`int CompareTo(T? other)\` | অবজেক্টের স্বাভাবিক সর্টিং অর্ডার নির্ধারণ করে। |
| **\`IComparer<T>\`** | \`int Compare(T? x, T? y)\` | বাহ্যিক সর্টিং কৌশল প্রদান করে। |
| **\`IEnumerable<T>\`** | \`IEnumerator<T> GetEnumerator()\` | \`foreach\` লুপ ও LINQ কুয়েরির ভিত্তি। |
| **\`ICollection<T>\`** | \`void Add(T item)\`, \`int Count\` | কালেকশনে ডেটা সংযোজন ও আকার নির্ধারণ। |
| **\`IList<T>\`** | \`T this[int index] { get; set; }\` | ইনডেক্স-ভিত্তিক র‍্যান্ডম এক্সেস কালেকশন। |

---

## \`IComparable<T>\` বনাম \`IComparer<T>\`

- **\`IComparable<T>\`**: ক্লাসের নিজের ভেতর ইমপ্লিমেন্ট করা হয় তার স্বাভাবিক বা প্রধান সর্টিং ক্রম নির্ধারণের জন্য।
- **\`IComparer<T>\`**: একটি পৃথক হেল্পার ক্লাসে ইমপ্লিমেন্ট করা হয় বিকল্প সর্টিং নিয়মাবলির জন্য (যেমন নামের ভিত্তিতে সর্ট বা বয়সের ভিত্তিতে সর্ট)।

\`\`\`csharp
public class Developer : IComparable<Developer>, IEquatable<Developer>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Salary { get; set; }

    public int CompareTo(Developer? other)
    {
        if (other is null) return 1;
        return other.Salary.CompareTo(Salary); // বেতন অনুযায়ী বড় থেকে ছোট
    }

    public bool Equals(Developer? other)
    {
        if (other is null) return false;
        return Id == other.Id;
    }
}

public class DeveloperNameComparer : IComparer<Developer>
{
    public int Compare(Developer? x, Developer? y)
    {
        return string.Compare(x?.Name, y?.Name, StringComparison.OrdinalIgnoreCase);
    }
}
\`\`\`

---

## কোভ্যারিয়েন্স (\`out T\`) ও কন্ট্রাভ্যারিয়েন্স (\`in T\`)

সিনিয়র আর্কিটেকচার ইন্টারভিউয়ের অন্যতম পছন্দের বিষয়:

### ১. কোভ্যারিয়েন্স (\`out T\`) — Output Only
বেশি স্পেসিফিক টাইপকে কম স্পেসিফিক টাইপের রেফারেন্সে অ্যাসাইন করার সুবিধা দেয়:
\`\`\`csharp
IEnumerable<string> strings = new List<string> { "Dhaka", "Sylhet" };
IEnumerable<object> objects = strings; // ✅ কোভ্যারিয়েন্সের কারণে বৈধ!
\`\`\`
> **নিয়ম**: টাইপ প্যারামিটার \`T\` শুধুমাত্র মেথডের **রিটার্ন পজিশনে (আউটপুট)** থাকতে পারবে।

### ২. কন্ট্রাভ্যারিয়েন্স (\`in T\`) — Input Only
কম স্পেসিফিক ইন্টারফেসকে বেশি স্পেসিফিক ইন্টারফেসে অ্যাসাইন করার সুবিধা দেয়:
\`\`\`csharp
IComparer<object> objectComparer = new CustomObjectComparer();
IComparer<string> stringComparer = objectComparer; // ✅ কন্ট্রাভ্যারিয়েন্সের কারণে বৈধ!
\`\`\`
> **নিয়ম**: টাইপ প্যারামিটার \`T\` শুধুমাত্র মেথডের **প্যারামিটার পজিশনে (ইনপুট)** থাকতে পারবে।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #৩ — Problem H (Sorting)
*একটি অ্যারেতে $N$ টি সংখ্যা দেওয়া থাকবে। সেগুলোকে ছোট থেকে বড় ক্রমে সর্ট করে প্রিন্ট করতে হবে।*

#### সমাধান বিশ্লেষণ
- \`Array.Sort<T>\` মেথডটি ব্যাকগ্রাউন্ডে \`IComparable<T>\` ব্যবহার করে ইনট্রোসর্ট অ্যালগরিদমের সাহায্যে $O(N \\log N)$ সময়ে কোনো বক্সিং ছাড়া অ্যারে সর্ট করে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class SortingSolution
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;
        int n = int.Parse(nLine.Trim());

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] arr = new int[n];

        for (int i = 0; i < n; i++)
        {
            arr[i] = int.Parse(tokens[i], CultureInfo.InvariantCulture);
        }

        Array.Sort(arr);

        Console.WriteLine(string.Join(" ", arr));
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N \\log N)$ — ইনট্রোসর্ট অ্যালগরিদম।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(\\log N)$ — রিকার্শন স্ট্যাক মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem H: Sorting](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H) | Easy | IComparable, Introsort, Generic Array.Sort |
| ⚪ | Codeforces Assiut | [Problem B: Searching](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B) | Easy | Linear Search, IEquatable, Index Lookups |
| ⚪ | Exercism C# | [FaceID 2](https://exercism.org/tracks/csharp/exercises/faceid-2) | Medium | IEquatable, Equals, GetHashCode Contract |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | IEnumerable, LINQ, IReadOnlyList |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #3",
      name: "Problem H: Sorting",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Generics", "Sorting", "IComparable"],
      solutionEn: "Sort primitive arrays using BCL Array.Sort leveraging generic IComparable implementations.",
      solutionBn: "জেনেরিক IComparable চুক্তির সাহায্যে Array.Sort ব্যবহার করে অ্যারে সর্ট করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #3",
      name: "Problem B: Searching",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Generics", "Search", "IEquatable"],
      solutionEn: "Locate target value index in an array using strongly-typed equality checks without boxing.",
      solutionBn: "বক্সিং পরিহার করে টাইপ-সেফ সমতা যাচাইয়ের মাধ্যমে অ্যারিতে কাঙ্ক্ষিত সংখ্যার ইনডেক্স খুঁজুন।",
    },
    {
      source: "Exercism C#",
      name: "FaceID 2",
      url: "https://exercism.org/tracks/csharp/exercises/faceid-2",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["Generics", "IEquatable", "GetHashCode"],
      solutionEn: "Implement IEquatable<Identity> on biometric domain objects for correct set operations.",
      solutionBn: "সঠিক সেট অপারেশনের নিশ্চয়তা দিতে ডোমেন অবজেক্টে IEquatable<Identity> ইন্টারফেস ইমপ্লিমেন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "High Scores",
      url: "https://exercism.org/tracks/csharp/exercises/high-scores",
      difficulty: "EASY",
      company: "Kaz Software",
      tags: ["Generics", "IEnumerable", "Collections"],
      solutionEn: "Expose read-only generic collections and extract leaderboards using LINQ enumeration.",
      solutionBn: "রিড-অনলি জেনেরিক কালেকশন ও LINQ এনামারেশন ব্যবহার করে সর্বোচ্চ স্কোরের তালিকা তৈরি করুন।",
    },
  ],
};
