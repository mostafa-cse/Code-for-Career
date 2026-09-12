import type { LocalLesson } from "@/lib/lessons-data";

export const csharpDataTypesLesson: LocalLesson = {
    slug: "csharp-data-types",
    titleEn: "Data Types & Type System",
    titleBn: "ডেটা টাইপ ও টাইপ সিস্টেম",
    categoryEn: "01. C# Syntax",
    categoryBn: "০১. সি# সিনট্যাক্স ও মৌলিক গঠন",
    categoryDescEn:
      "Foundational syntax of C#, variable declaration, primitive types, string formatting, console I/O, and arithmetic/logical operators.",
    categoryDescBn:
      "সি# ভাষার প্রাথমিক সিনট্যাক্স, চলক ঘোষণা, মৌলিক তথ্য ধরন, কনসোল ইনপুট-আউটপুট এবং অপারেটর।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "CTS type hierarchy, value vs reference types, integral & floating-point ranges, boxing/unboxing, nullable types, and type casting.",
    descriptionBn:
      "CTS টাইপ হায়ারার্কি, value ও reference টাইপ পার্থক্য, ইন্টিগ্রাল ও ফ্লোটিং পয়েন্ট সীমা, boxing/unboxing এবং nullable টাইপ।",
    difficulty: "EASY",
    displayOrder: 2,
    prerequisites: ["csharp-variables"],
    estimatedMinutes: 35,
    lastUpdated: "Recently updated",
    contentEn: `# Data Types & Type System in C#

In .NET, **every type** ultimately derives from \`System.Object\`. The Common Type System (CTS) defines two fundamental categories that control memory layout and behavior.

---

## Value Types vs Reference Types

| Aspect | Value Types | Reference Types |
|---|---|---|
| Examples | \`int\`, \`double\`, \`bool\`, \`char\`, \`struct\`, \`enum\` | \`string\`, \`object\`, \`class\`, arrays |
| Storage | **Stack** (directly stores value) | **Heap** (stack stores a reference/pointer) |
| Assignment | Copies the value | Copies the reference (both point to same object) |
| Default value | \`0\`, \`false\`, \`'\0'\` | \`null\` |
| Null-capable | Only via \`Nullable<T>\` / \`T?\` | Yes, by default |

\`\`\`csharp
// Value type — copy semantics
int a = 10;
int b = a;      // b is a separate copy
b = 99;
Console.WriteLine(a); // 10 — unchanged

// Reference type — reference semantics
int[] arr1 = { 1, 2, 3 };
int[] arr2 = arr1;    // both point to SAME array
arr2[0] = 99;
Console.WriteLine(arr1[0]); // 99 — arr1 affected!
\`\`\`

---

## Integral Types — Full Reference

For an $n$-bit **signed** integer: $\\text{Range} = [-2^{n-1},\\; 2^{n-1} - 1]$

For an $n$-bit **unsigned** integer: $\\text{Range} = [0,\\; 2^{n} - 1]$

| C# Keyword | .NET BCL Type | Size | Range | Use Case |
|---|---|---|---|---|
| \`sbyte\` | \`System.SByte\` | 8-bit signed | $-128$ to $127$ | Rare; small signed values |
| \`byte\` | \`System.Byte\` | 8-bit unsigned | $0$ to $255$ | File bytes, pixel channels |
| \`short\` | \`System.Int16\` | 16-bit signed | $-32{,}768$ to $32{,}767$ | Compact integer storage |
| \`ushort\` | \`System.UInt16\` | 16-bit unsigned | $0$ to $65{,}535$ | Unicode code points |
| \`int\` | \`System.Int32\` | 32-bit signed | $\\approx \\pm 2.1 \\times 10^9$ | **Default integer type** |
| \`uint\` | \`System.UInt32\` | 32-bit unsigned | $0$ to $\\approx 4.3 \\times 10^9$ | Bit masks, flags |
| \`long\` | \`System.Int64\` | 64-bit signed | $\\approx \\pm 9.2 \\times 10^{18}$ | Large numbers, IDs |
| \`ulong\` | \`System.UInt64\` | 64-bit unsigned | $0$ to $\\approx 1.8 \\times 10^{19}$ | Largest unsigned |
| \`nint\` | \`System.IntPtr\` | Platform-size | Pointer-sized | Interop, unsafe |

---

## Floating-Point Types — Precision vs Accuracy

| Type | Size | Precision | Literal Suffix | Use Case |
|---|---|---|---|---|
| \`float\` | 32-bit IEEE 754 | ~7 digits | \`f\` → \`3.14f\` | Graphics, game physics |
| \`double\` | 64-bit IEEE 754 | ~15–17 digits | default → \`3.14\` | General scientific computation |
| \`decimal\` | 128-bit base-10 | 28–29 digits | \`m\` → \`99.99m\` | **Finance, money, tax** |

> **Why decimal for money?** Binary floating-point cannot represent \`0.1\` exactly. \`0.1 + 0.2\` in \`double\` \u2260 \`0.3\`. \`decimal\` uses base-10 arithmetic and avoids this.

\`\`\`csharp
double bad = 0.1 + 0.2;
Console.WriteLine(bad);          // 0.30000000000000004 ← precision error

decimal good = 0.1m + 0.2m;
Console.WriteLine(good);         // 0.3 ← exact
\`\`\`

---

## Other Primitive Types

| Type | .NET Type | Description |
|---|---|---|
| \`bool\` | \`System.Boolean\` | \`true\` or \`false\` — 1 byte in memory |
| \`char\` | \`System.Char\` | Single UTF-16 Unicode character, 2 bytes |
| \`string\` | \`System.String\` | **Immutable** sequence of \`char\`, reference type |
| \`object\` | \`System.Object\` | Root of all types — can hold any value via boxing |

---

## Nullable Types — \`T?\`

Value types cannot be \`null\` by default. Use \`T?\` (shorthand for \`Nullable<T>\`) when a value might be absent:

\`\`\`csharp
int? age = null;         // nullable int
double? score = 95.5;

if (age.HasValue)
    Console.WriteLine(age.Value);
else
    Console.WriteLine("Age not provided");

// Null-coalescing operator: use fallback if null
int displayAge = age ?? 0;
\`\`\`

---

## Boxing & Unboxing

**Boxing**: wrapping a value type in a \`System.Object\` — moves data to the **Heap**. Costly operation.

**Unboxing**: extracting the value back — requires an explicit cast.

\`\`\`csharp
int number = 42;
object boxed = number;          // Boxing — heap allocation occurs

int unboxed = (int)boxed;       // Unboxing — explicit cast required
// double wrong = (double)boxed; // ❌ InvalidCastException at runtime
\`\`\`

> **Performance Note**: Avoid boxing in hot paths (loops with millions of iterations). Use generics (\`List<int>\`) instead of \`ArrayList\` (which boxes every element).

---

## Type Casting

\`\`\`csharp
// Implicit (safe, no data loss)
int i   = 1000;
long l  = i;          // int → long: always safe
double d = i;         // int → double: always safe

// Explicit cast (may truncate or throw)
double pi   = 3.14159;
int truncated = (int)pi;   // 3 — decimal part lost

// Safe parsing with TryParse
string input = "42abc";
if (int.TryParse(input, out int result))
    Console.WriteLine(result);
else
    Console.WriteLine("Invalid number");
\`\`\`

---

## Syntax & Practical Implementation

\`\`\`csharp
// Integral
int activeUsers   = 50_000;          // underscore separator (C# 7+)
long nationalDebt = 9_876_543_210L;

// Floating-point
double circleRadius = 5.25;
double circleArea   = Math.PI * circleRadius * circleRadius;

// Decimal for money
decimal price = 99.99m;
decimal tax   = price * 0.15m;

// Boolean & Character
bool isComplete     = false;
char unicodeSymbol  = '\u0995';    // Bengali 'ক'

// Nullable
int? optionalCount = null;
int display        = optionalCount ?? 0;

Console.WriteLine($"Area: {circleArea:F4}");
Console.WriteLine($"Total: {price + tax:C}");
Console.WriteLine($"Count: {display}");
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Basic Data Types
*Source: Codeforces Assiut University Training Sheet #1 — Problem B*

Read \`int\`, \`long\`, \`char\`, \`float\`, \`double\` from one line and print each on a new line.

\`\`\`csharp
using System;
using System.Globalization;

public class Program
{
    public static void Main()
    {
        string[] tokens = Console.ReadLine().Split(' ');

        int    a = int.Parse(tokens[0]);
        long   b = long.Parse(tokens[1]);
        char   c = char.Parse(tokens[2]);
        float  d = float.Parse(tokens[3],  CultureInfo.InvariantCulture);
        double e = double.Parse(tokens[4], CultureInfo.InvariantCulture);

        Console.WriteLine(a);
        Console.WriteLine(b);
        Console.WriteLine(c);
        Console.WriteLine(d.ToString(CultureInfo.InvariantCulture));
        Console.WriteLine(e.ToString(CultureInfo.InvariantCulture));
    }
}
\`\`\`

> \`CultureInfo.InvariantCulture\` ensures \`3.14\` parses correctly regardless of the OS regional settings (some locales use \`,\` as decimal separator).

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem B: Basic Data Types](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B) | Easy | Parsing, Types |
| ⚪ | Codeforces Assiut | [Problem E: Area of a Circle](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/E) | Easy | double, Math.PI |
| ⚪ | Exercism C# | [Interest is Interesting](https://exercism.org/tracks/csharp/exercises/interest-is-interesting) | Easy | decimal, float |
| ⚪ | Exercism C# [Nullable Reference Types](https://exercism.org/tracks/csharp/exercises/phone-number-analysis) | Phone Number Analysis | Easy | Nullable, T? |
`,

    contentBn: `# C# এ ডেটা টাইপ ও টাইপ সিস্টেম

.NET-এ **প্রতিটি টাইপ** মূলত \`System.Object\` থেকে উদ্ভূত। Common Type System (CTS) দুটি মূল বিভাগ নির্ধারণ করে যা মেমোরি বিন্যাস ও আচরণ নিয়ন্ত্রণ করে।

---

## Value Type বনাম Reference Type

| বৈশিষ্ট্য | Value Type | Reference Type |
|---|---|---|
| উদাহরণ | \`int\`, \`double\`, \`bool\`, \`struct\` | \`string\`, \`class\`, array |
| সংরক্ষণ | **Stack**-এ সরাসরি মান | **Heap**-এ অবজেক্ট, Stack-এ reference |
| অ্যাসাইনমেন্ট | মান কপি হয় | শুধু reference কপি হয় |
| ডিফল্ট মান | \`0\`, \`false\` | \`null\` |

\`\`\`csharp
// Value type — আলাদা কপি
int a = 10;
int b = a;
b = 99;
Console.WriteLine(a); // 10 — অপরিবর্তিত

// Reference type — একই অবজেক্ট
int[] arr1 = { 1, 2, 3 };
int[] arr2 = arr1;
arr2[0] = 99;
Console.WriteLine(arr1[0]); // 99 — arr1 ও পরিবর্তিত!
\`\`\`

---

## ইন্টিগ্রাল টাইপ — সম্পূর্ণ রেফারেন্স

$n$-বিট সাইন্ড ইন্টিজারের সীমা: $[-2^{n-1},\\; 2^{n-1} - 1]$

| C# Keyword | সাইজ | সীমা | ব্যবহার |
|---|---|---|---|
| \`byte\` | ৮-বিট | $0$ থেকে $255$ | ফাইল byte, pixel |
| \`short\` | ১৬-বিট | $-32{,}768$ থেকে $32{,}767$ | সংকোচিত ইন্টিজার |
| \`int\` | ৩২-বিট | $\\approx \\pm 2.1 \\times 10^9$ | **ডিফল্ট ইন্টিজার** |
| \`long\` | ৬৪-বিট | $\\approx \\pm 9.2 \\times 10^{18}$ | বড় সংখ্যা, ID |
| \`ulong\` | ৬৪-বিট | $0$ থেকে $\\approx 1.8 \\times 10^{19}$ | সর্বোচ্চ unsigned |

---

## ফ্লোটিং পয়েন্ট টাইপ

| Type | সাইজ | প্রিসিশন | Suffix | ব্যবহার |
|---|---|---|---|---|
| \`float\` | ৩২-বিট | ~৭ ডিজিট | \`f\` | গ্রাফিক্স |
| \`double\` | ৬৪-বিট | ~১৫-১৭ ডিজিট | default | বৈজ্ঞানিক গণনা |
| \`decimal\` | ১২৮-বিট | ২৮-২৯ ডিজিট | \`m\` | **আর্থিক হিসাব** |

> **কেন decimal?** Binary floating-point-এ \`0.1 + 0.2 ≠ 0.3\`। \`decimal\` base-10 ব্যবহার করে তাই আর্থিক হিসাবে নির্ভুল।

\`\`\`csharp
double bhul = 0.1 + 0.2;
Console.WriteLine(bhul);      // 0.30000000000000004 ← ত্রুটি

decimal thik = 0.1m + 0.2m;
Console.WriteLine(thik);      // 0.3 ← সঠিক
\`\`\`

---

## Nullable Type — \`T?\`

Value type-এ ডিফল্টে \`null\` রাখা যায় না। \`T?\` ব্যবহার করে nullable করা যায়:

\`\`\`csharp
int? boyos = null;   // nullable int
int display = boyos ?? 0;  // null হলে 0 ব্যবহার

if (boyos.HasValue)
    Console.WriteLine(boyos.Value);
\`\`\`

---

## Boxing ও Unboxing

**Boxing**: value type → \`object\` — Heap allocation ঘটে (ব্যয়বহুল)।
**Unboxing**: \`object\` → value type — explicit cast প্রয়োজন।

\`\`\`csharp
int shonkha = 42;
object box   = shonkha;       // Boxing — Heap-এ যায়
int unbox    = (int)box;       // Unboxing — explicit cast
\`\`\`

> Hot loop-এ boxing এড়িয়ে চলুন। \`ArrayList\`-এর পরিবর্তে \`List<int>\` ব্যবহার করুন।

---

## Type Casting

\`\`\`csharp
// Implicit (নিরাপদ)
int i  = 1000;
long l = i;

// Explicit (ডেটা হারাতে পারে)
double pi    = 3.14159;
int trunc    = (int)pi;   // 3

// Safe parse
if (int.TryParse("42abc", out int result))
    Console.WriteLine(result);
else
    Console.WriteLine("অবৈধ সংখ্যা");
\`\`\`

---

## সিনট্যাক্স ও ব্যবহারিক কোড

\`\`\`csharp
int shonkha    = 50_000;
long deshioId  = 9_876_543_210L;

double byashardho = 5.25;
double khetrophol = Math.PI * byashardho * byashardho;

decimal ponnoMulya = 150.75m;
decimal vat        = ponnoMulya * 0.05m;

bool chakriAche   = true;
char prothomOkhhor = 'ম';

int? optionalAge = null;
int ageDisplay   = optionalAge ?? 0;

Console.WriteLine($"ক্ষেত্রফল: {khetrophol:F4}");
Console.WriteLine($"মোট মূল্য: {ponnoMulya + vat:F2}");
\`\`\`

---

## বাস্তব সমস্যা সমাধান

### সমস্যা: Basic Data Types
*উৎস: Codeforces Assiut — Problem B*

\`\`\`csharp
using System;
using System.Globalization;

public class Program
{
    public static void Main()
    {
        string[] tokens = Console.ReadLine().Split(' ');

        int    a = int.Parse(tokens[0]);
        long   b = long.Parse(tokens[1]);
        char   c = char.Parse(tokens[2]);
        float  d = float.Parse(tokens[3],  CultureInfo.InvariantCulture);
        double e = double.Parse(tokens[4], CultureInfo.InvariantCulture);

        Console.WriteLine(a);
        Console.WriteLine(b);
        Console.WriteLine(c);
        Console.WriteLine(d.ToString(CultureInfo.InvariantCulture));
        Console.WriteLine(e.ToString(CultureInfo.InvariantCulture));
    }
}
\`\`\`

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem B: Basic Data Types](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B) | Easy | Parsing, Types |
| ⚪ | Codeforces Assiut | [Problem E: Area of a Circle](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/E) | Easy | double, Math |
| ⚪ | Exercism C# | [Interest is Interesting](https://exercism.org/tracks/csharp/exercises/interest-is-interesting) | Easy | decimal, float |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem B: Basic Data Types",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B",
        difficulty: "EASY",
        company: "Brain Station 23",
        tags: ["Data Types", "Parsing", "I/O", "CultureInfo"],
        solutionEn: "Split tokens and parse each into its correct type. Use CultureInfo.InvariantCulture for float/double.",
        solutionBn: "প্রতিটি token সঠিক টাইপে parse করুন। float/double এর জন্য CultureInfo.InvariantCulture ব্যবহার করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem E: Area of a Circle",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/E",
        difficulty: "EASY",
        company: null,
        tags: ["Math", "double", "Math.PI"],
        solutionEn: "Read radius as double, compute area = Math.PI * R * R, and print with required decimal places.",
        solutionBn: "double হিসেবে radius পড়ুন, Math.PI * R * R দিয়ে ক্ষেত্রফল নির্ণয় করুন।",
      },
      {
        source: "Exercism C#",
        name: "Interest is Interesting",
        url: "https://exercism.org/tracks/csharp/exercises/interest-is-interesting",
        difficulty: "EASY",
        company: "Brain Station 23",
        tags: ["decimal", "float", "Precision"],
        solutionEn: "Use decimal for monetary balance and float for interest rate thresholds in conditional logic.",
        solutionBn: "আর্থিক ব্যালেন্সের জন্য decimal এবং সুদের হারের শর্তের জন্য float ব্যবহার করুন।",
      },
    ],
  };
