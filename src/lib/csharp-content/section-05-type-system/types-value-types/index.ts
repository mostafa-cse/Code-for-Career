import type { LocalLesson } from "@/lib/lessons-data";

export const typesValueTypesLesson: LocalLesson = {
  slug: "types-value-types",
  titleEn: "Value Types",
  titleBn: "ভ্যালু টাইপ (Value Types) ও স্ট্যাক মেমোরি",
  categoryEn: "05. Type System",
  categoryBn: "০৫. টাইপ সিস্টেম ও মেমোরি মডেল",
  categoryDescEn:
    "The Common Type System (CTS) in .NET: value types vs reference types, boxing/unboxing overhead, var vs dynamic vs object.",
  categoryDescBn:
    ".NET এর কমন টাইপ সিস্টেম (CTS): ভ্যালু টাইপ বনাম রেফারেন্স টাইপ, বক্সিং/আনবক্সিং মেমোরি ওভারহেড এবং var/dynamic/object।",
  categoryPriority: "CORE",
  descriptionEn:
    "Stack-allocated types inheriting from System.ValueType, primitives, structs, enums, copy-by-value semantics, and ref struct rules.",
  descriptionBn:
    "System.ValueType থেকে উদ্ভূত প্রিমিটিভ, স্ট্রাক্ট, এনাম, কপি-বাই-ভ্যালু আচরণ এবং ref struct-এর মেমোরি নীতি।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["csharp-data-types"],
  estimatedMinutes: 30,
  lastUpdated: "Recently updated",
  contentEn: `# Value Types in C#

In the .NET Common Type System (CTS), a **value type** holds its data directly within its own allocated storage location. Value types derive implicitly from \`System.ValueType\`, which itself inherits from \`System.Object\`.

Understanding how value types behave under the hood is critical for avoiding memory leaks, eliminating unnecessary garbage collection overhead, and writing high-performance C# applications.

---

## The Common Type System (CTS) Hierarchy

Every type in .NET fits into a single, unified type hierarchy rooted at \`System.Object\`:

\`\`\`
                  System.Object
                        ▲
                        │
                System.ValueType
             ┌──────────┴──────────┐
             │                     │
    Primitive Structs         System.Enum
 (int, double, bool, etc.)         │
             │                User-defined
    Custom Structs               enums
\`\`\`

> **Key Rule**: While \`System.ValueType\` inherits from \`System.Object\`, it overrides core virtual methods like \`Equals()\` and \`GetHashCode()\` to provide **value-based equality** (comparing field contents) rather than reference identity.

---

## Memory Placement: Stack vs Heap Debunked

A widespread interview misconception is: *"Value types always live on the stack, while reference types live on the heap."*

**The Truth**: In .NET, a value type lives **wherever it is declared**:

| Declaration Context | Physical Storage Location | Lifetime |
|---|---|---|
| Local variable inside a method | **Thread Execution Stack** | Cleaned up immediately when method exits ($O(1)$ stack pop) |
| Field inside a \`class\` | **Managed Heap** (inline within the class object) | Lives as long as the parent object lives; cleaned by GC |
| Element inside an array (\`int[]\`) | **Managed Heap** (contiguous buffer inside array object) | Cleaned when the array is GC-collected |
| Captured variable in lambda / async | **Managed Heap** (inside the compiler-generated closure class) | Lives until the delegate/state-machine is collected |
| Field inside a \`struct\` | Embedded directly inside that struct | Inherits the lifetime and location of the parent struct |

\`\`\`csharp
public class Order
{
    public int OrderId;      // Resides on the HEAP inside the Order object instance
    public decimal Total;    // Resides on the HEAP inside the Order object instance
}

public void ProcessPayment()
{
    int localStatus = 1;     // Resides on the STACK of the current thread frame
    Order order = new Order(); // Reference pointer on STACK -> Order payload on HEAP
}
\`\`\`

---

## Built-In Value Types Reference Table

All primitive C# data types are aliases for underlying .NET CTS structs in the \`System\` namespace:

| C# Keyword | .NET CTS Type | Size | Range / Precision | Default Value |
|---|---|:---:|---|:---:|
| \`bool\` | \`System.Boolean\` | 1 byte | \`true\` or \`false\` | \`false\` |
| \`byte\` | \`System.Byte\` | 1 byte | 0 to 255 (unsigned 8-bit) | \`0\` |
| \`sbyte\` | \`System.SByte\` | 1 byte | -128 to 127 (signed 8-bit) | \`0\` |
| \`short\` | \`System.Int16\` | 2 bytes | -32,768 to 32,767 | \`0\` |
| \`ushort\` | \`System.UInt16\` | 2 bytes | 0 to 65,535 | \`0\` |
| \`int\` | \`System.Int32\` | 4 bytes | -2,147,483,648 to 2,147,483,647 (~2.14B) | \`0\` |
| \`uint\` | \`System.UInt32\` | 4 bytes | 0 to 4,294,967,295 | \`0\` |
| \`long\` | \`System.Int64\` | 8 bytes | -9.22 × $10^{18}$ to 9.22 × $10^{18}$ | \`0L\` |
| \`ulong\` | \`System.UInt64\` | 8 bytes | 0 to 1.84 × $10^{19}$ | \`0UL\` |
| \`char\` | \`System.Char\` | 2 bytes | UTF-16 Unicode code point (\`U+0000\` to \`U+FFFF\`) | \`'\\0'\` |
| \`float\` | \`System.Single\` | 4 bytes | ±1.5 × $10^{-45}$ to ±3.4 × $10^{38}$ (~7 digits) | \`0.0f\` |
| \`double\` | \`System.Double\` | 8 bytes | ±5.0 × $10^{-324}$ to ±1.7 × $10^{308}$ (~15-17 digits) | \`0.0d\` |
| \`decimal\` | \`System.Decimal\` | 16 bytes | ±1.0 × $10^{-28}$ to ±7.9 × $10^{28}$ (28-29 digits financial) | \`0.0m\` |

---

## Copy Semantics: Independent Bitwise Copies

When assigning or passing a value type, the CLR copies the **exact raw bits** of the variable. The new variable is completely independent of the original:

\`\`\`csharp
public struct Point
{
    public int X;
    public int Y;
}

Point p1 = new Point { X = 10, Y = 20 };
Point p2 = p1; // Creates an entirely separate bitwise copy

p2.X = 999;

Console.WriteLine(p1.X); // 10 (unaffected!)
Console.WriteLine(p2.X); // 999
\`\`\`

---

## Struct Design Best Practices

### 1. Prefer \`readonly struct\`
Mutable structs often introduce subtle bugs with defensive copying. In modern C#, declare custom structs as \`readonly struct\`:

\`\`\`csharp
public readonly struct Vector2D
{
    public double X { get; }
    public double Y { get; }

    public Vector2D(double x, double y)
    {
        X = x;
        Y = y;
    }

    public double MagnitudeSquared() => (X * X) + (Y * Y);
}
\`\`\`

### 2. \`ref struct\` — Zero Allocation & Stack Only (C# 7.2+)
A \`ref struct\` is constrained by the compiler so it can **never escape to the managed heap**:
- Cannot be boxed.
- Cannot be a field of a normal \`class\` or normal \`struct\`.
- Cannot implement interfaces.
- Cannot be used in \`async\` methods or lambdas.
- Primary example: \`Span<T>\` and \`ReadOnlySpan<T>\`.

\`\`\`csharp
public ref struct BufferParser
{
    public ReadOnlySpan<char> Payload;

    public BufferParser(ReadOnlySpan<char> payload)
    {
        Payload = payload;
    }
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 — Problem B (Basic Data Types)
*Read an integer, long, character, float, and double separated by spaces, and print each value on a new line with standard formatting.*

#### Problem Analysis
- Input: \`int\`, \`long\`, \`char\`, \`float\`, \`double\` on one single line.
- Goal: Parse each token into its exact CTS value type and display each on its own line.
- Precision Requirement: Floats and doubles should preserve required decimal precision without roundoff corruption.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class BasicDataTypesSolution
{
    public static void Main()
    {
        // Read the entire line from standard input
        string? rawLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(rawLine)) return;

        // Split inputs by whitespace tokens
        string[] tokens = rawLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Parse into respective CTS value types
        int intValue = int.Parse(tokens[0], CultureInfo.InvariantCulture);
        long longValue = long.Parse(tokens[1], CultureInfo.InvariantCulture);
        char charValue = char.Parse(tokens[2]);
        float floatValue = float.Parse(tokens[3], CultureInfo.InvariantCulture);
        double doubleValue = double.Parse(tokens[4], CultureInfo.InvariantCulture);

        // Print each value on a new line
        Console.WriteLine(intValue);
        Console.WriteLine(longValue);
        Console.WriteLine(charValue);
        Console.WriteLine(floatValue.ToString("F2", CultureInfo.InvariantCulture));
        Console.WriteLine(doubleValue.ToString("F1", CultureInfo.InvariantCulture));
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$ — constant number of token parsing operations.
- **Space Complexity**: $\\mathcal{O}(1)$ — local value types allocated strictly on the thread execution stack.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem B: Basic Data Types](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B) | Easy | CTS Value Types, Formatted Output |
| ⚪ | Codeforces Assiut | [Problem D: Difference](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D) | Easy | 64-bit long arithmetic, Overflow Prevention |
| ⚪ | Exercism C# | [Hyper-Optimized Telemetry](https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry) | Easy | Integer Sizes, Signed/Unsigned Structs |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Value Type Lists, Defensive Copies |
`,

  contentBn: `# C# এ ভ্যালু টাইপ (Value Types) ও স্ট্যাক মেমোরি

.NET এর কমন টাইপ সিস্টেমে (CTS) **ভ্যালু টাইপ (Value Type)** বলতে সেই সকল ডেটা টাইপকে বোঝায় যা নিজের মেমোরি অবস্থানে সরাসরি প্রকৃত মান (Raw Data) ধারণ করে। ভ্যালু টাইপগুলো স্বয়ংক্রিয়ভাবে \`System.ValueType\` ক্লাস থেকে ইনহেরিট করে, যা মূলত \`System.Object\` এর চাইল্ড ক্লাস।

সফটওয়্যার পারফরম্যান্স অপ্টিমাইজেশন, মেমোরি লিক রোধ এবং ইন্টারভিউয়ের জন্য ভ্যালু টাইপের অভ্যন্তরীণ মেমোরি মডেল বোঝা অত্যন্ত জরুরি।

---

## কমন টাইপ সিস্টেম (CTS) কাঠামো

.NET-এর সকল টাইপ একটি কেন্দ্রীয় হায়ারার্কিতে আবদ্ধ, যার মূল ভিত্তি হলো \`System.Object\`:

\`\`\`
                  System.Object
                        ▲
                        │
                System.ValueType
             ┌──────────┴──────────┐
             │                     │
    Primitive Structs         System.Enum
 (int, double, bool, etc.)         │
             │                User-defined
    Custom Structs               enums
\`\`\`

> **গুরুত্বপূর্ণ নীতি**: \`System.ValueType\` ক্লাসটি \`System.Object\` এর \`Equals()\` ও \`GetHashCode()\` মেথডগুলোকে ওভাররাইড করে। এর ফলে রেফারেন্স অ্যাড্রেসের পরিবর্তে ফিল্ডগুলোর মানের ওপর ভিত্তি করে সমতা (Value-based Equality) যাচাই করা হয়।

---

## মেমোরি বণ্টন: স্ট্যাক বনাম হিপ সত্যতা

প্রোগ্রামিং ইন্টারভিউতে একটি প্রচলিত ভুল ধারণা হলো: *"ভ্যালু টাইপ সবসময় স্ট্যাকে থাকে আর রেফারেন্স টাইপ হিপে থাকে।"*

**প্রকৃত সত্য**: সি# এ একটি ভ্যালু টাইপ মেমোরির কোন অংশে থাকবে তা নির্ভর করে **এটি কোথায় ডিক্লেয়ার করা হয়েছে**:

| ঘোষণার প্রেক্ষাপট | মেমোরি অবস্থান | জীবনকাল (Lifetime) |
|---|---|---|
| মেথডের ভেতরে লোকাল ভ্যারিয়েবল | **থ্রেড স্ট্যাক (Stack)** | মেথডের কাজ শেষ হওয়ার সাথে সাথে $O(1)$ টাইমে মুছে যায় |
| কোনো \`class\`-এর ইনস্ট্যান্স ফিল্ড | **ম্যানেজড হিপ (Heap)** (অবজেক্টের ভেতরে ইনলাইন) | প্যারেন্ট অবজেক্ট যতদিন থাকে ততদিন বাঁচে; GC দ্বারা মুক্ত হয় |
| অ্যারির উপাদান (\`int[]\`) | **ম্যানেজড হিপ (Heap)** (কন্টিগুয়াস মেমোরি ব্লক) | অ্যারি অবজেক্টের সাথে GC দ্বারা মুক্ত হয় |
| ল্যাম্বডা বা async মেথডে ক্যাপচার্ড চলক | **ম্যানেজড হিপ (Heap)** (কম্পাইলার জেনারেটেড ক্লোজার ক্লাস) | স্টেট মেশিনের সাথে হিপে থাকে |
| কোনো \`struct\`-এর ফিল্ড | সরাসরি সেই স্ট্রাক্টের ভেতরে | মূল স্ট্রাক্টের অবস্থানের ওপর নির্ভরশীল |

\`\`\`csharp
public class Order
{
    public int OrderId;      // হিপ মেমোরিতে Order অবজেক্টের অংশ হিসেবে সংরক্ষিত
    public decimal Total;    // হিপ মেমোরিতে সংরক্ষিত
}

public void ProcessPayment()
{
    int localStatus = 1;     // বর্তমান থ্রেডের স্ট্যাক মেমোরিতে সংরক্ষিত
    Order order = new Order(); // স্ট্যাকে পয়েন্টার -> হিপে প্রকৃত Order অবজেক্ট
}
\`\`\`

---

## বিল্ট-ইন ভ্যালু টাইপ রেফারেন্স টেবিল

সি# এর প্রিমিটিভ কি-ওয়ার্ডগুলো মূলত \`System\` নেমস্পেসের স্ট্রাক্টসমূহের এলিয়াস:

| C# Keyword | .NET CTS Type | মেমোরি সাইজ | সীমা / প্রিসিশন | ডিফল্ট মান |
|---|---|:---:|---|:---:|
| \`bool\` | \`System.Boolean\` | ১ বাইট | \`true\` অথবা \`false\` | \`false\` |
| \`byte\` | \`System.Byte\` | ১ বাইট | 0 থেকে 255 (আনসাইনড ৮-বিট) | \`0\` |
| \`sbyte\` | \`System.SByte\` | ১ বাইট | -128 থেকে 127 (সাইনড ৮-বিট) | \`0\` |
| \`short\` | \`System.Int16\` | ২ বাইট | -32,768 থেকে 32,767 | \`0\` |
| \`ushort\` | \`System.UInt16\` | ২ বাইট | 0 থেকে 65,535 | \`0\` |
| \`int\` | \`System.Int32\` | ৪ বাইট | -2.14B থেকে +2.14B | \`0\` |
| \`uint\` | \`System.UInt32\` | ৪ বাইট | 0 থেকে 4.29B | \`0\` |
| \`long\` | \`System.Int64\` | ৮ বাইট | -9.22 × $10^{18}$ থেকে +9.22 × $10^{18}$ | \`0L\` |
| \`ulong\` | \`System.UInt64\` | ৮ বাইট | 0 থেকে 1.84 × $10^{19}$ | \`0UL\` |
| \`char\` | \`System.Char\` | ২ বাইট | UTF-16 ইউনিকোড ক্যারেক্টার | \`'\\0'\` |
| \`float\` | \`System.Single\` | ৪ বাইট | ±1.5 × $10^{-45}$ থেকে ±3.4 × $10^{38}$ (~৭ ডিজিট) | \`0.0f\` |
| \`double\` | \`System.Double\` | ৮ বাইট | ±5.0 × $10^{-324}$ থেকে ±1.7 × $10^{308}$ (~১৫-১৭ ডিজিট) | \`0.0d\` |
| \`decimal\` | \`System.Decimal\` | ১৬ বাইট | ২৮-২৯ ডিজিট প্রিসিশন (আর্থিক গণনার জন্য আদর্শ) | \`0.0m\` |

---

## কপি সেমান্টিক্স: স্বাধীন বিটওয়াইজ অনুলিপি

ভ্যালু টাইপ অ্যাসাইন বা মেথডে পাস করার সময় মেমোরির বিট হুবহু কপি করা হয়। একটির পরিবর্তনে অন্যটি কখনোই পরিবর্তিত হয় না:

\`\`\`csharp
public struct Point
{
    public int X;
    public int Y;
}

Point p1 = new Point { X = 10, Y = 20 };
Point p2 = p1; // স্ট্যাকে সম্পূর্ণ পৃথক একটি কপি তৈরি হলো

p2.X = 999;

Console.WriteLine(p1.X); // 10 (অপরিবর্তিত!)
Console.WriteLine(p2.X); // 999
\`\`\`

---

## স্ট্রাক্ট ডিজাইন ও আধুনিক নির্দেশিকা

### ১. \`readonly struct\` অগ্রাধিকার দেওয়া
মিউটেবল স্ট্রাক্ট অনেক সময় জটিল বা আনইন্টেনশনাল কপি তৈরি করে। তাই আধুনিক সি# কোডে স্ট্রাক্টকে সর্বদা \`readonly struct\` হিসেবে তৈরি করা উচিত:

\`\`\`csharp
public readonly struct Vector2D
{
    public double X { get; }
    public double Y { get; }

    public Vector2D(double x, double y)
    {
        X = x;
        Y = y;
    }

    public double MagnitudeSquared() => (X * X) + (Y * Y);
}
\`\`\`

### ২. \`ref struct\` — জিরো অ্যালোকেশন ও শুধু স্ট্যাক সংরক্ষণ (C# 7.2+)
\`ref struct\` কম্পাইলারের মাধ্যমে নিশ্চিত করে যে এটি কখনোই কোনো অবস্থাতেই হিপ মেমোরিতে যাবে না:
- বক্সিং করা যায় না।
- সাধারণ ক্লাস বা সাধারণ স্ট্রাক্টের ফিল্ড হতে পারে না।
- ইন্টারফেস ইমপ্লিমেন্ট করতে পারে না।
- মেমোরি কার্যক্ষমতা বাড়াতে ব্যবহৃত \`Span<T>\` এবং \`ReadOnlySpan<T>\` মূলত \`ref struct\`।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #১ — Problem B (Basic Data Types)
*একটি লাইনে স্পেস দিয়ে পৃথক করা integer, long, character, float, এবং double ইনপুট নিয়ে প্রতিটিকে আলাদা লাইনে প্রিন্ট করতে হবে।*

#### সমাধান বিশ্লেষণ
- ইনপুট থেকে টোকেনগুলো রিড করে সুনির্দিষ্ট CTS ভ্যালু টাইপে পার্স করা হয়েছে।
- ফ্লোটিং পয়েন্ট ভ্যালুসমূহ সঠিক ফরম্যাট স্পেসিফায়ার দিয়ে আউটপুট দেওয়া হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class BasicDataTypesSolution
{
    public static void Main()
    {
        string? rawLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(rawLine)) return;

        string[] tokens = rawLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        int intValue = int.Parse(tokens[0], CultureInfo.InvariantCulture);
        long longValue = long.Parse(tokens[1], CultureInfo.InvariantCulture);
        char charValue = char.Parse(tokens[2]);
        float floatValue = float.Parse(tokens[3], CultureInfo.InvariantCulture);
        double doubleValue = double.Parse(tokens[4], CultureInfo.InvariantCulture);

        Console.WriteLine(intValue);
        Console.WriteLine(longValue);
        Console.WriteLine(charValue);
        Console.WriteLine(floatValue.ToString("F2", CultureInfo.InvariantCulture));
        Console.WriteLine(doubleValue.ToString("F1", CultureInfo.InvariantCulture));
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ — নির্দিষ্ট পাঁচটি মান পার্স ও প্রিন্ট করা হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ — লোকাল ভ্যারিয়েবলগুলো স্ট্যাকে সীমাবদ্ধ।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem B: Basic Data Types](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B) | Easy | CTS Value Types, Formatted Output |
| ⚪ | Codeforces Assiut | [Problem D: Difference](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D) | Easy | 64-bit long arithmetic, Overflow Prevention |
| ⚪ | Exercism C# | [Hyper-Optimized Telemetry](https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry) | Easy | Integer Sizes, Signed/Unsigned Structs |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Value Type Lists, Defensive Copies |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #1",
      name: "Problem B: Basic Data Types",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Value Types", "CTS", "I/O"],
      solutionEn: "Read and parse distinct CTS primitive types (int, long, char, float, double) and print formatted output.",
      solutionBn: "ভিন্ন ভিন্ন ভ্যালু টাইপ পার্স করে নতুন লাইনে কাঙ্ক্ষিত ফরম্যাটে প্রিন্ট করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #1",
      name: "Problem D: Difference",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Value Types", "long", "Math"],
      solutionEn: "Use 64-bit long values to evaluate (A * B) - (C * D) preventing 32-bit integer overflow.",
      solutionBn: "৩২-বিট পূর্ণসংখ্যা ওভারফ্লো এড়াতে ৬৪-বিট long ভ্যালু ব্যবহার করে সমীকরণ সমাধান করুন।",
    },
    {
      source: "Exercism C#",
      name: "Hyper-Optimized Telemetry",
      url: "https://exercism.org/tracks/csharp/exercises/hyper-optimized-telemetry",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Value Types", "Bits", "Structs"],
      solutionEn: "Inspect signed and unsigned integer bit boundaries to serialize telemetry packets efficiently.",
      solutionBn: "বিভিন্ন পূর্ণসংখ্যা ভ্যালু টাইপের বিট সীমা যাচাই করে দক্ষভাবে বাফার সিরিয়ালাইজ করুন।",
    },
    {
      source: "Exercism C#",
      name: "High Scores",
      url: "https://exercism.org/tracks/csharp/exercises/high-scores",
      difficulty: "EASY",
      company: "Kaz Software",
      tags: ["Value Types", "Lists", "Copy Semantics"],
      solutionEn: "Query score records using LINQ without modifying underlying integer collections.",
      solutionBn: "কপি সেমান্টিক্স ও LINQ ব্যবহার করে মূল স্কোর পরিবর্তন না করে সর্বোচ্চ ফলাফল খুঁজুন।",
    },
  ],
};
