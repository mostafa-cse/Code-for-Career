import type { LocalLesson } from "@/lib/lessons-data";

export const structBasicsLesson: LocalLesson = {
  slug: "struct-basics",
  titleEn: "Struct Basics & readonly struct",
  titleBn: "স্ট্রাকট (struct) ও মেমোরি স্ট্যাক",
  categoryEn: "10. enum & struct",
  categoryBn: "১০. এনাম ও স্ট্রাকট",
  categoryDescEn:
    "Lightweight custom value types in C#: strongly-typed enumerations, bitwise [Flags], readonly structs, and struct vs class memory tradeoffs.",
  categoryDescBn:
    "সি# এ হালকা কাস্টম ভ্যালু টাইপ: এনাম, বিটওয়াইজ [Flags], readonly স্ট্রাকট এবং স্ট্রাকট বনাম ক্লাস মেমোরি পার্থক্য।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Value type structures, stack allocation, defensive copying pitfalls, readonly struct enforcement, ref struct, and zero GC overhead.",
  descriptionBn:
    "ভ্যালু টাইপ স্ট্রাকট, স্ট্যাক মেমোরি বরাদ্দ, ডিফেন্সিভ কপি সমস্যা, readonly struct, ref struct এবং জিসি প্রেসার মুক্ত কোড।",
  difficulty: "EASY",
  displayOrder: 3,
  prerequisites: ["types-value-types"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Struct Basics & readonly struct in C#

A **\`struct\`** is a user-defined value type in C#. While classes represent entities with identity allocated on the managed heap, structs represent lightweight data structures allocated **directly in-place** (on the execution stack for local variables, or embedded inline within their containing class or array).

Because stack allocation requires merely moving the stack pointer, structs provide **zero Garbage Collection (GC) pressure**, making them essential for high-throughput and low-latency systems.

---

## Memory Allocation & Lifecycle

When a struct is declared locally inside a method:
1. **Stack Lifetime**: Memory is reserved directly in the active stack frame.
2. **Instant Deallocation**: When the method returns, the stack frame is popped. No GC tracking, no finalizer queues, and no collection pauses occur.
3. **Array Contiguity**: An array of structs (\`Point[]\`) is stored as a single contiguous memory block in cache lines, unlike an array of classes which stores an array of references pointing to fragmented heap objects.

---

## The Defensive Copying Trap

A common performance pitfall occurs when passing mutable structs by reference using the \`in\` parameter modifier or accessing them via a \`readonly\` field.

### The Problem:
If a struct is mutable, the C# compiler cannot verify whether invoking a method or property getter will alter its internal fields. To guarantee that the original instance remains unmodified, the compiler **silently creates a hidden defensive copy on the stack** prior to every member invocation!

\`\`\`csharp
// MUTABLE STRUCT:
public struct MutablePoint
{
    public int X { get; set; }
    public int Y { get; set; }

    public double Distance() => Math.Sqrt(X * X + Y * Y);
}

// Consuming method:
public void Calculate(in MutablePoint pt)
{
    // The compiler silently COPIES pt to a temporary stack variable before calling Distance()!
    double d = pt.Distance(); 
}
\`\`\`
In hot loops with thousands of iterations, these hidden defensive copies destroy execution speed.

---

## The Solution: \`readonly struct\` (C# 7.2+)

By declaring the struct with the \`readonly\` keyword:

\`\`\`csharp
public readonly struct Vector2D
{
    public double X { get; init; }
    public double Y { get; init; }

    public Vector2D(double x, double y)
    {
        X = x;
        Y = y;
    }

    public double Magnitude() => Math.Sqrt(X * X + Y * Y);
}
\`\`\`

1. **Compiler Enforcement**: Every field inside the struct must be marked \`readonly\`.
2. **Defensive Copies Eliminated**: The compiler knows that methods cannot mutate the struct. When passed with \`in Vector2D v\`, the compiler passes the memory address directly without copying!

---

## High-Performance: \`ref struct\` (C# 7.2+)

A **\`ref struct\`** is a specialized struct that the CLR strictly confines to the execution stack:
- Cannot be boxed to \`object\` or \`ValueType\`.
- Cannot implement interfaces.
- Cannot be a field of a normal \`class\` or normal \`struct\`.
- Cannot be captured in async methods or iterators.

This language feature powers \`Span<T>\` and \`ReadOnlySpan<T>\`, allowing safe, high-performance zero-allocation slice operations across memory buffers.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem Q (Coordinates of a Point)
*Given two coordinates $X$ and $Y$ of a point in 2D space. Determine whether the point is at the Origin, on the X-axis, on the Y-axis, or in Quadrants Q1, Q2, Q3, or Q4.*

#### Architectural Analysis
1. Model the coordinate using a \`readonly struct Point2D\`.
2. Implement clean coordinate classification without heap allocations.
3. Classify with quadrant boundary checks.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public readonly struct Point2D
{
    public double X { get; }
    public double Y { get; }

    public Point2D(double x, double y)
    {
        X = x;
        Y = y;
    }

    public string DetermineLocation()
    {
        if (X == 0.0 && Y == 0.0) return "Origem";
        if (X == 0.0) return "Eixo Y";
        if (Y == 0.0) return "Eixo X";

        if (X > 0.0 && Y > 0.0) return "Q1";
        if (X < 0.0 && Y > 0.0) return "Q2";
        if (X < 0.0 && Y < 0.0) return "Q3";
        return "Q4";
    }
}

public class Program
{
    public static void Main()
    {
        string? line = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(line))
        {
            return;
        }

        string[] parts = line.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 2)
        {
            return;
        }

        double x = double.Parse(parts[0], CultureInfo.InvariantCulture);
        double y = double.Parse(parts[1], CultureInfo.InvariantCulture);

        Point2D point = new Point2D(x, y);
        Console.WriteLine(point.DetermineLocation());
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, parsing two doubles and evaluating quadrant boundaries runs in constant time.
- **Space Complexity**: $\\mathcal{O}(1)$, the \`Point2D\` struct resides entirely on the stack with zero GC allocations.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Coordinates of a Point](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/Q) | Easy | \`readonly struct\`, Quadrant mapping, In-stack allocation |
| ⚪ | Codeforces | [Assiut Sheet #1: Two numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/H) | Easy | Floor, Ceil, Round arithmetic, Math operations |
| ⚪ | Exercism C# | [Hyper-Optimized Telemetry](https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry) | Medium | Bit conversion, Payload encoding, Value types |
| ⚪ | Exercism C# | [Elons Toys](https://exercism.org/tracks/csharp/exercises/elons-toys) | Easy | Encapsulation, State mutation, Value vs Reference |
`,

  contentBn: `# C# এ স্ট্রাকট (struct) ও মেমোরি স্ট্যাক

সি#-এ **\`struct\`** হলো একটি ব্যবহারকারী-সংজ্ঞায়িত ভ্যালু টাইপ। ক্লাস যেখানে মেমোরি হিপে অবজেক্ট তৈরি করে, স্ট্রাকট সেখানে ইন-প্লেস মেমোরিতে সরাসরি সংরক্ষিত হয় (লোকাল ভ্যারিয়েবলের ক্ষেত্রে এক্সিকিউশন স্ট্যাকে অথবা কোনো ক্লাসের ভেতর এমবেডেড অবস্থায়)।

স্ট্যাক মেমোরি কেবল স্ট্যাক পয়েন্টার সরানোর মাধ্যমে তাৎক্ষণিক বরাদ্দ ও ডিলিট হয়। ফলে এতে কোনো **গার্বেজ কালেকশন (GC) ওভারহেড থাকে না**, যা হাই-পারফরম্যান্স সিস্টেমের জন্য অত্যন্ত উপযোগী।

---

## মেমোরি বরাদ্দ ও লাইফসাইকেল

মেথডের ভেতর লোকাল স্ট্রাকট ডিক্লেয়ার করলে:
১. **স্ট্যাক লাইফটাইম**: মেথডের নিজস্ব স্ট্যাক ফ্রেমে সরাসরি মেমোরি সংরক্ষিত হয়।
২. **তাৎক্ষণিক বিলুপ্তি**: মেথড শেষ হওয়ার সাথে সাথে স্ট্যাক ফ্রেম পপ হয়। কোনো GC স্ক্যানিং বা কালেকশন পজ ঘটে না।
৩. **অ্যারে মেমোরি কনটিগুইটি**: স্ট্রাকটের অ্যারে (\`Point[]\`) মেমোরিতে একটি একক দীর্ঘ ব্লকে সাজানো থাকে। ক্লাসের অ্যারের মতো রেফারেন্স পয়েন্টারের ট্রাভার্সাল করতে হয় না বলে সিপিইউ ক্যাশ মিস অনেক কমে যায়।

---

## ডিফেন্সিভ কপি সমস্যা (The Defensive Copying Trap)

মিউটেবল (পরিবর্তনযোগ্য) স্ট্রাকটকে \`in\` প্যারামিটার দিয়ে রেফারেন্সে পাস করলে বা \`readonly\` ফিল্ডে রাখলে একটি মারাত্মক পারফরম্যান্স ড্রপ ঘটতে পারে।

### সমস্যাটি কেন হয়:
স্ট্রাকট যদি পরিবর্তনশীল হয়, তবে কম্পাইলার নিশ্চিত হতে পারে না যে কোনো মেথড কল করলে তার ভেতরের ভ্যালু পরিবর্তন হবে কি না। তাই অপরিবর্তনশীলতা নিশ্চিত করতে কম্পাইলার গোপনে মেথড কলের ঠিক আগে স্ট্যাকে পুরো স্ট্রাকটটির একটি **লুকানো কপি (Defensive Copy)** তৈরি করে!

\`\`\`csharp
public struct MutablePoint
{
    public int X { get; set; }
    public int Y { get; set; }

    public double Distance() => Math.Sqrt(X * X + Y * Y);
}

public void Calculate(in MutablePoint pt)
{
    // কম্পাইলার এখানে প্রতিবার pt এর একটি অদৃশ্য কপি স্ট্যাকে তৈরি করে!
    double d = pt.Distance(); 
}
\`\`\`
লুপের মধ্যে হাজার হাজার বার এই কপি তৈরি হলে পারফরম্যান্স মারাত্মকভাবে হ্রাস পায়।

---

## আধুনিক সমাধান: \`readonly struct\` (C# 7.2+)

স্ট্রাকট ডিক্লেয়ার করার সময় \`readonly\` কি-ওয়ার্ড ব্যবহার করে এই সমস্যার স্থায়ী সমাধান করা যায়:

\`\`\`csharp
public readonly struct Vector2D
{
    public double X { get; init; }
    public double Y { get; init; }

    public Vector2D(double x, double y)
    {
        X = x;
        Y = y;
    }

    public double Magnitude() => Math.Sqrt(X * X + Y * Y);
}
\`\`\`

১. **কম্পাইলার নিশ্চয়তা**: স্ট্রাকটের ভেতরের প্রতিটি ফিল্ড স্বয়ংক্রিয়ভাবে \`readonly\` হতে বাধ্য।
২. **জিরো কপি ওভারহেড**: কম্পাইলার নিশ্চিত থাকে যে কোনো মেথড অভ্যন্তরীণ ডেটা পরিবর্তন করবে না। ফলে \`in Vector2D v\` দিয়ে পাস করলে কোনো ডিফেন্সিভ কপি তৈরি না করে সরাসরি মেমোরি পয়েন্টার ব্যবহার করা হয়।

---

## বিশেষ \`ref struct\` (স্ট্যাক-অনলি মেমোরি)

\`ref struct\` হলো এমন এক বিশেষ ধরনের স্ট্রাকট যা কেবল স্ট্যাক মেমোরিতেই অবস্থান করতে পারে:
- এটিকে কোনো সাধারণ ক্লাসের ফিল্ড করা যায় না।
- একে বক্সিং করে \`object\` বানানো যায় না।
- এটি অ্যাসিনক্রোনাস (\`async\`) মেথডে ব্যবহার করা যায় না।

\`Span<T>\` এবং \`ReadOnlySpan<T>\` এই ফিচারের ওপর ভিত্তি করে তৈরি, যা কোনো হিপ অ্যালোকেশন ছাড়াই মেমোরি স্লাইস করতে দেয়।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem Q (Coordinates of a Point)
*দ্বিমাত্রিক স্থানাঙ্ক ব্যবস্থায় একটি বিন্দুর স্থানাঙ্ক $X$ এবং $Y$ দেওয়া থাকবে। বিন্দুটি মূলবিন্দু (Origem), X-অক্ষ, Y-অক্ষ, নাকি ১ম, ২য়, ৩য় বা ৪র্থ চতুর্ভাগে (Quadrants) অবস্থিত তা বের করতে হবে।*

#### সমাধান বিশ্লেষণ
১. স্থানাঙ্ক ডেটাকে \`readonly struct Point2D\` দিয়ে মডেল করা।
২. স্ট্যাক মেমোরি ব্যবহার করে কোনো গার্বেজ তৈরি না করেই কোঅর্ডিনেট বিশ্লেষণ সম্পন্ন করা।
৩. অক্ষ ও চতুর্ভাগের সীমানা পরীক্ষা করে ফলাফল প্রদান করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Globalization;

public readonly struct Point2D
{
    public double X { get; }
    public double Y { get; }

    public Point2D(double x, double y)
    {
        X = x;
        Y = y;
    }

    public string DetermineLocation()
    {
        if (X == 0.0 && Y == 0.0) return "Origem";
        if (X == 0.0) return "Eixo Y";
        if (Y == 0.0) return "Eixo X";

        if (X > 0.0 && Y > 0.0) return "Q1";
        if (X < 0.0 && Y > 0.0) return "Q2";
        if (X < 0.0 && Y < 0.0) return "Q3";
        return "Q4";
    }
}

public class Program
{
    public static void Main()
    {
        string? line = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(line))
        {
            return;
        }

        string[] parts = line.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 2)
        {
            return;
        }

        double x = double.Parse(parts[0], CultureInfo.InvariantCulture);
        double y = double.Parse(parts[1], CultureInfo.InvariantCulture);

        Point2D point = new Point2D(x, y);
        Console.WriteLine(point.DetermineLocation());
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, চতুর্ভাগ নির্ণয়ের গাণিতিক শর্ত পরীক্ষা ধ্রুবক সময়ে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, স্ট্রাকট সরাসরি স্ট্যাকে কাজ করে বলে হিপে কোনো অবজেক্ট তৈরি হয় না।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Coordinates of a Point](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/Q) | Easy | \`readonly struct\`, Quadrant mapping, In-stack allocation |
| ⚪ | Codeforces | [Assiut Sheet #1: Two numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/H) | Easy | Floor, Ceil, Round arithmetic, Math operations |
| ⚪ | Exercism C# | [Hyper-Optimized Telemetry](https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry) | Medium | Bit conversion, Payload encoding, Value types |
| ⚪ | Exercism C# | [Elons Toys](https://exercism.org/tracks/csharp/exercises/elons-toys) | Easy | Encapsulation, State mutation, Value vs Reference |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Coordinates of a Point",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/Q",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Struct", "Geometry", "Conditionals"],
      solutionEn:
        "Model 2D coordinates using an immutable readonly struct, classifying points into quadrants, axes, or the origin without heap allocations.",
      solutionBn:
        "ইমিউটেবল readonly struct ব্যবহার করে দ্বিমাত্রিক বিন্দুর স্থানাঙ্ক মডেল করুন এবং হিপ মেমোরি অপচয় ছাড়াই চতুর্ভাগ বা অক্ষ নির্ণয় করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Two numbers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/H",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Math", "Arithmetic", "Rounding"],
      solutionEn:
        "Perform division of two numbers, computing and formatting floor, ceil, and round mathematical representations.",
      solutionBn:
        "দুটি সংখ্যার ভাগফল নির্ণয় করে তার ফ্লোর, সিলিং এবং রাউন্ডিং মান গাণিতিকভাবে প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Hyper-Optimized Telemetry",
      url: "https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Structs", "Bitwise", "Serialization"],
      solutionEn:
        "Encode and decode telemetry payloads into compact byte buffers using signed and unsigned integral value types.",
      solutionBn:
        "সাইন্ড ও আনসাইন্ড ভ্যালু টাইপ ব্যবহার করে টেলিমেট্রি পেলোডকে কম্প্যাক্ট বাইট বাফারে এনকোড ও ডিকোড করুন।",
    },
    {
      source: "Exercism C#",
      name: "Elons Toys",
      url: "https://exercism.org/tracks/csharp/exercises/elons-toys",
      difficulty: "EASY",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["OOP", "State", "Methods"],
      solutionEn:
        "Implement a remote control car with battery consumption and distance tracking, practicing encapsulation and state maintenance.",
      solutionBn:
        "রিমোট কন্ট্রোল কারের ব্যাটারি ক্ষয় ও দূরত্ব ট্র্যাকিংয়ের মেথড বাস্তবায়ন করে স্টেট এনক্যাপসুলেশন অনুশীলন করুন।",
    },
  ],
};
