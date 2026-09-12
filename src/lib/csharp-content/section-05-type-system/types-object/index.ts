import type { LocalLesson } from "@/lib/lessons-data";

export const typesObjectLesson: LocalLesson = {
  slug: "types-object",
  titleEn: "System.Object",
  titleBn: "সিস্টেম অবজেক্ট (System.Object) ও রুট হায়ারার্কি",
  categoryEn: "05. Type System",
  categoryBn: "০৫. টাইপ সিস্টেম ও মেমোরি মডেল",
  categoryDescEn:
    "The Common Type System (CTS) in .NET: value types vs reference types, boxing/unboxing overhead, var vs dynamic vs object.",
  categoryDescBn:
    ".NET এর কমন টাইপ সিস্টেম (CTS): ভ্যালু টাইপ বনাম রেফারেন্স টাইপ, বক্সিং/আনবক্সিং মেমোরি ওভারহেড এবং var/dynamic/object।",
  categoryPriority: "CORE",
  descriptionEn:
    "The ultimate root of the .NET CTS, Equals, GetHashCode, ToString, GetType, MemberwiseClone, and the Sacred Hash Contract.",
  descriptionBn:
    ".NET টাইপ সিস্টেমের আদি ভিত্তি, Equals, GetHashCode, ToString, GetType, MemberwiseClone এবং হ্যাশ কোডের অলঙ্ঘনীয় নীতি।",
  difficulty: "EASY",
  displayOrder: 5,
  prerequisites: ["types-reference-types", "types-value-types"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# System.Object in C#

In the .NET Common Type System (CTS), **\`System.Object\` (aliased by the C# keyword \`object\`) is the ultimate root base class of all types**. Every single type in C# — classes, structs, enums, delegates, arrays, and interfaces — directly or indirectly inherits from \`System.Object\`.

This universal inheritance enables unified polymorphism, allowing any variable in the CLR to be referenced as an \`object\`.

---

## The Core Methods of \`System.Object\`

Every instance in .NET automatically inherits the following seven foundational methods:

| Method | Signature | Virtual? | Purpose |
|---|---|:---:|---|
| **\`Equals(object?)\`** | \`public virtual bool Equals(object? obj)\` | Yes | Determines value/reference equality between two objects. |
| **\`Equals(objA, objB)\`** | \`public static bool Equals(object? a, object? b)\` | No | Null-safe static equality comparison helper. |
| **\`ReferenceEquals\`** | \`public static bool ReferenceEquals(object? a, object? b)\` | No | Compares memory addresses; ignores overloaded \`==\` operators. |
| **\`GetHashCode\`** | \`public virtual int GetHashCode()\` | Yes | Generates an integer hash key for hash-based collections. |
| **\`ToString\`** | \`public virtual string? ToString()\` | Yes | Returns string representation (defaults to fully-qualified type name). |
| **\`GetType\`** | \`public Type GetType()\` | No | Returns the runtime \`Type\` object for reflection inspection. |
| **\`MemberwiseClone\`** | \`protected object MemberwiseClone()\` | No | Creates a shallow bitwise copy of the object on the heap. |

---

## The Sacred Hash Contract

When building production systems or passing technical interviews (Enosis, Therap, Brain Station 23), understanding the contract between \`Equals\` and \`GetHashCode\` is paramount:

> **The Sacred Rule**: If two objects are equal according to \`Equals(object?)\`, then calling \`GetHashCode()\` on each of the two objects **MUST produce the exact same integer**.

\`\`\`
If:     objA.Equals(objB) == true
Then:   objA.GetHashCode() == objB.GetHashCode()  (MANDATORY!)
\`\`\`

### What Happens If You Break This Contract?
If you override \`Equals\` to compare business fields (e.g. \`EmployeeId\`) but forget to override \`GetHashCode()\`:
- Adding the object to a \`HashSet<Employee>\` or using it as a key in \`Dictionary<Employee, Salary>\` fails.
- The collection will place the object in one hash bucket based on its default memory address, but searches will look in a completely different bucket, causing **silent data loss and elusive bugs**.

---

## The Canonical Pattern: Overriding \`Equals\` & \`GetHashCode\`

Modern idiomatic C# implementation for equality using \`IEquatable<T>\` and \`HashCode.Combine\`:

\`\`\`csharp
public class UserAccount : IEquatable<UserAccount>
{
    public int UserId { get; }
    public string Email { get; }

    public UserAccount(int userId, string email)
    {
        UserId = userId;
        Email = email ?? string.Empty;
    }

    // 1. Strongly typed IEquatable<T> (prevents boxing!)
    public bool Equals(UserAccount? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return UserId == other.UserId && string.Equals(Email, other.Email, StringComparison.OrdinalIgnoreCase);
    }

    // 2. Override Object.Equals
    public override bool Equals(object? obj) => Equals(obj as UserAccount);

    // 3. Override Object.GetHashCode using HashCode.Combine
    public override int GetHashCode()
    {
        return HashCode.Combine(UserId, StringComparer.OrdinalIgnoreCase.GetHashCode(Email));
    }

    // 4. Override ToString for clean debugging
    public override string ToString() => $"UserAccount [ID={UserId}, Email={Email}]";

    // 5. Overload == and != operators
    public static bool operator ==(UserAccount? left, UserAccount? right) => Equals(left, right);
    public static bool operator !=(UserAccount? left, UserAccount? right) => !Equals(left, right);
}
\`\`\`

---

## Type Inspection: \`is\`, \`as\`, and \`GetType()\`

\`\`\`csharp
object data = 125;

// 1. Pattern Matching 'is' (Type Check & Cast)
if (data is int number)
{
    Console.WriteLine($"Integer value: {number}");
}

// 2. Safe Cast 'as' (Returns null for incompatible reference types)
object nameObj = "Full Stack Engineer";
string? nameStr = nameObj as string;

// 3. Exact Type Inspection (typeof vs GetType)
Type compileTimeType = typeof(string);
Type runtimeType = nameObj.GetType();
Console.WriteLine(compileTimeType == runtimeType); // True
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 — Problem E (Lowest Number)
*Given an array of $N$ integers. Find the minimum number and its 1-based index using an object-oriented tracking model.*

#### Problem Analysis
- Input: Length $N$ and $N$ integers.
- Goal: Track the minimum value and its earliest 1-based index.
- We can encapsulate the tracker with proper \`ToString\` representation.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class LowestNumberTracker
{
    public int Value { get; }
    public int Position { get; }

    public LowestNumberTracker(int value, int position)
    {
        Value = value;
        Position = position;
    }

    public override string ToString() => $"{Value} {Position}";
}

public class LowestNumberSolution
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;
        int n = int.Parse(nLine.Trim());

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int firstVal = int.Parse(tokens[0], CultureInfo.InvariantCulture);

        LowestNumberTracker best = new LowestNumberTracker(firstVal, 1);

        for (int i = 1; i < n; i++)
        {
            int currentVal = int.Parse(tokens[i], CultureInfo.InvariantCulture);
            if (currentVal < best.Value)
            {
                best = new LowestNumberTracker(currentVal, i + 1);
            }
        }

        // Implicitly invokes Object.ToString()
        Console.WriteLine(best);
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$ — single traversal over the array.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem E: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | System.Object, ToString, Tracking |
| ⚪ | Codeforces Assiut | [Problem J: Lucky Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/J) | Easy | Array Inspection, Frequency Counting |
| ⚪ | Exercism C# | [FaceID 2](https://exercism.org/tracks/csharp/exercises/faceid-2) | Medium | Equals, GetHashCode, HashSet Keying |
| ⚪ | Exercism C# | [Scrabble Score](https://exercism.org/tracks/csharp/exercises/scrabble-score) | Easy | Dictionary Key Lookups, Object Equality |
`,

  contentBn: `# C# এ সিস্টেম অবজেক্ট (System.Object) ও রুট হায়ারার্কি

.NET এর কমন টাইপ সিস্টেমে (CTS) **\`System.Object\` (যার সি# কি-ওয়ার্ড \`object\`) হলো সকল ক্লাসের মূল ভিত্তি বা রুট ক্লাস**। সি# এর প্রতিটি ক্লাস, স্ট্রাক্ট, এনাম, ডেলিগেট বা অ্যারে প্রত্যক্ষ বা পরোক্ষভাবে \`System.Object\` থেকে ইনহেরিট করে।

এই সার্বজনীন ইনহেরিটেন্সের ফলেই সি# এ যেকোনো ডেটা টাইপকে পলিমরফিক রূপান্তর হিসেবে \`object\` রেফারেন্সে রাখা সম্ভব হয়।

---

## \`System.Object\` ক্লাসের ৭টি মৌলিক মেথড

.NET-এর প্রতিটি অবজেক্ট নিজে থেকেই নিচের ৭টি মেথড ধারণ করে:

| মেথড | সিগনেচার | ভার্চুয়াল? | ভূমিকা ও উদ্দেশ্য |
|---|---|:---:|---|
| **\`Equals(object?)\`** | \`public virtual bool Equals(object? obj)\` | হ্যাঁ | দুটি অবজেক্টের সমতা যাচাই করে। |
| **\`Equals(objA, objB)\`** | \`public static bool Equals(object? a, object? b)\` | না | নাল-সেফ স্ট্যাটিক সমতা যাচাইকারী। |
| **\`ReferenceEquals\`** | \`public static bool ReferenceEquals(object? a, object? b)\` | না | মেমোরি অ্যাড্রেসের হুবহু সমতা পরীক্ষা করে। |
| **\`GetHashCode\`** | \`public virtual int GetHashCode()\` | হ্যাঁ | হ্যাশ টেবিল ও ডিকশনারির জন্য হ্যাশ কি রিটার্ন করে। |
| **\`ToString\`** | \`public virtual string? ToString()\` | হ্যাঁ | অবজেক্টের স্ট্রিং রূপান্তর দেখায়। |
| **\`GetType\`** | \`public Type GetType()\` | না | অবজেক্টের রানটাইম রিফ্লেকশন টাইপ রিটার্ন করে। |
| **\`MemberwiseClone\`** | \`protected object MemberwiseClone()\` | না | হিপে অবজেক্টের শ্যালো বিটওয়াইজ কপি তৈরি করে। |

---

## হ্যাশ কোডের অলঙ্ঘনীয় নীতি (The Sacred Hash Contract)

সফটওয়্যার ইঞ্জিনিয়ারিং ইন্টারভিউতে (যেমন Enosis, Therap, Brain Station 23) \`Equals\` এবং \`GetHashCode\` এর সম্পর্ক প্রায়শই জানতে চাওয়া হয়:

> **অলঙ্ঘনীয় নীতি**: যদি দুটি অবজেক্ট \`Equals()\` দিয়ে সমান হয়, তবে তাদের \`GetHashCode()\` থেকে প্রাপ্ত পূর্ণসংখ্যার মান **অবশ্যই সমান হতে হবে**।

\`\`\`
যদি:     objA.Equals(objB) == true হয়,
তাহলে:   objA.GetHashCode() == objB.GetHashCode()  (বাধ্যতামূলক!)
\`\`\`

### এই নিয়ম ভঙ্গ করলে কী ক্ষতি হয়?
যদি আপনি কোনো ক্লাসে \`Equals\` ওভাররাইড করেন কিন্তু \`GetHashCode\` ওভাররাইড করতে ভুলে যান:
- অবজেক্টটিকে যখন কোনো \`HashSet<T>\` বা \`Dictionary<TKey, TValue>\`-তে কি হিসেবে সংরক্ষণ করবেন, তখন ডেটা সহজে খুঁজে পাওয়া যাবে না।
- কালেকশনটি ডিফল্ট পয়েন্টার অ্যাড্রেসের ভিত্তিতে এক বাকেটে ডাটা রাখবে এবং খোঁজার সময় অন্য বাকেটে খুঁজবে, ফলে **ডেটা মিসিং এবং সাইলেন্ট বাগ তৈরি হবে**।

---

## \`Equals\` ও \`GetHashCode\` ওভাররাইড করার স্ট্যান্ডার্ড প্যাটার্ন

\`\`\`csharp
public class UserAccount : IEquatable<UserAccount>
{
    public int UserId { get; }
    public string Email { get; }

    public UserAccount(int userId, string email)
    {
        UserId = userId;
        Email = email ?? string.Empty;
    }

    // ১. টাইপ-সেফ IEquatable<T> (বক্সিং এড়ায়)
    public bool Equals(UserAccount? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return UserId == other.UserId && string.Equals(Email, other.Email, StringComparison.OrdinalIgnoreCase);
    }

    // ২. Object.Equals ওভাররাইড
    public override bool Equals(object? obj) => Equals(obj as UserAccount);

    // ৩. HashCode.Combine দিয়ে GetHashCode ওভাররাইড
    public override int GetHashCode()
    {
        return HashCode.Combine(UserId, StringComparer.OrdinalIgnoreCase.GetHashCode(Email));
    }

    // ৪. ডিবাগিংয়ের জন্য ToString ওভাররাইড
    public override string ToString() => $"UserAccount [ID={UserId}, Email={Email}]";

    // ৫. == এবং != অপারেটর ওভারলোড
    public static bool operator ==(UserAccount? left, UserAccount? right) => Equals(left, right);
    public static bool operator !=(UserAccount? left, UserAccount? right) => !Equals(left, right);
}
\`\`\`

---

## টাইপ যাচাই ও কাস্টিং: \`is\`, \`as\` এবং \`GetType()\`

\`\`\`csharp
object data = 125;

// ১. প্যাটার্ন ম্যাচিং 'is'
if (data is int number)
{
    Console.WriteLine($"Integer value: {number}");
}

// ২. নিরাপদ কাস্ট 'as' (ব্যর্থ হলে null দেয়)
object nameObj = "Full Stack Engineer";
string? nameStr = nameObj as string;

// ৩. সঠিক টাইপ তুলনা (typeof বনাম GetType)
Type compileTimeType = typeof(string);
Type runtimeType = nameObj.GetType();
Console.WriteLine(compileTimeType == runtimeType); // True
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #৩ — Problem E (Lowest Number)
*একটি অ্যারির মধ্যে সর্বনিম্ন সংখ্যা এবং এর ১-ভিত্তিক পজিশন খুঁজে বের করতে হবে।*

#### সমাধান বিশ্লেষণ
- অবজেক্টের মধ্যে মান এবং পজিশন সংরক্ষণ করে \`ToString()\` ওভাররাইডের মাধ্যমে পরিচ্ছন্নভাবে প্রিন্ট করা হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class LowestNumberTracker
{
    public int Value { get; }
    public int Position { get; }

    public LowestNumberTracker(int value, int position)
    {
        Value = value;
        Position = position;
    }

    public override string ToString() => $"{Value} {Position}";
}

public class LowestNumberSolution
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;
        int n = int.Parse(nLine.Trim());

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int firstVal = int.Parse(tokens[0], CultureInfo.InvariantCulture);

        LowestNumberTracker best = new LowestNumberTracker(firstVal, 1);

        for (int i = 1; i < n; i++)
        {
            int currentVal = int.Parse(tokens[i], CultureInfo.InvariantCulture);
            if (currentVal < best.Value)
            {
                best = new LowestNumberTracker(currentVal, i + 1);
            }
        }

        Console.WriteLine(best);
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$ — অ্যারির সব উপাদানে একবার স্ক্যান।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem E: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | System.Object, ToString, Tracking |
| ⚪ | Codeforces Assiut | [Problem J: Lucky Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/J) | Easy | Array Inspection, Frequency Counting |
| ⚪ | Exercism C# | [FaceID 2](https://exercism.org/tracks/csharp/exercises/faceid-2) | Medium | Equals, GetHashCode, HashSet Keying |
| ⚪ | Exercism C# | [Scrabble Score](https://exercism.org/tracks/csharp/exercises/scrabble-score) | Easy | Dictionary Key Lookups, Object Equality |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #3",
      name: "Problem E: Lowest Number",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["System.Object", "ToString", "Arrays"],
      solutionEn: "Encapsulate lowest value and 1-based index inside an object with custom ToString formatting.",
      solutionBn: "সর্বনিম্ন মান ও ইনডেক্স একটি অবজেক্টে সংরক্ষণ করে ToString মেথডের মাধ্যমে কাঙ্ক্ষিত ফরম্যাটে প্রিন্ট করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #3",
      name: "Problem J: Lucky Array",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/J",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Arrays", "Frequency", "Comparison"],
      solutionEn: "Determine whether the frequency of the minimum array element is odd or even.",
      solutionBn: "অ্যারির সর্বনিম্ন সংখ্যার ফ্রিকোয়েন্সি বিজোড় নাকি জোড় তা নির্ণয় করে লাকি অ্যারে শনাক্ত করুন।",
    },
    {
      source: "Exercism C#",
      name: "FaceID 2",
      url: "https://exercism.org/tracks/csharp/exercises/faceid-2",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["System.Object", "Equals", "GetHashCode"],
      solutionEn: "Correctly override Equals and GetHashCode to maintain consistent biometric identity lookup in HashSet.",
      solutionBn: "বায়োমেট্রিক আইডেন্টিটি নিরাপদে HashSet-এ রাখতে Equals ও GetHashCode মেথড নির্ভুলভাবে ওভাররাইড করুন।",
    },
    {
      source: "Exercism C#",
      name: "Scrabble Score",
      url: "https://exercism.org/tracks/csharp/exercises/scrabble-score",
      difficulty: "EASY",
      company: "Kaz Software",
      tags: ["Dictionary", "Object", "Lookups"],
      solutionEn: "Look up character points in dictionary tables and compute aggregate word scores.",
      solutionBn: "ডিকশনারি টেবিলে ক্যারেক্টার পয়েন্ট খুঁজে শব্দের মোট স্কোর গণনা করুন।",
    },
  ],
};
