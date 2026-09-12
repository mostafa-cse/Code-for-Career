import type { LocalLesson } from "@/lib/lessons-data";

export const nullablesValueTypesLesson: LocalLesson = {
  slug: "nullables-value-types",
  titleEn: "Nullable Value Types (T?)",
  titleBn: "নালেবল ভ্যালু টাইপ (Nullable<T>)",
  categoryEn: "09. Nullable Types",
  categoryBn: "০৯. নালেবল টাইপ ও নাল-নিরাপত্তা",
  categoryDescEn:
    "Modern null-safety in C#: Nullable<T> structs, C# 8 Nullable Reference Types (NRT), null-coalescing, null-conditional, and null-forgiving operators.",
  categoryDescBn:
    "সি# এ আধুনিক নাল-নিরাপত্তা: Nullable<T> স্ট্রাক্ট, সি# ৮ নালেবল রেফারেন্স টাইপ (NRT), নাল-কোয়ালেসিং (??), নাল-কন্ডিশনাল (?.) ও নাল-ফরগিভিং (!) অপারেটর।",
  categoryPriority: "CORE",
  descriptionEn:
    "System.Nullable<T> struct internals, memory layout and padding, CLR boxing/unboxing special behaviors, lifted operators, and database null handling.",
  descriptionBn:
    "System.Nullable<T> স্ট্রাক্টের মেমোরি লেআউট, সিএলআর স্পেশাল বক্সিং/আনবক্সিং আচরণ, লিফটেড অপারেটর এবং ডাটাবেজ নাল হ্যান্ডলিং।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["types-value-types"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Nullable Value Types (T?) in C#

In C#, fundamental value types (\`int\`, \`double\`, \`bool\`, \`DateTime\`, \`struct\`) are allocated with default non-null representations (such as \`0\` or \`false\`). By design, they cannot hold a \`null\` reference.

However, real-world data models frequently encounter missing, undefined, or unassigned data—most notably relational database columns containing \`NULL\`. To bridge this gap, C# provides **Nullable Value Types** (\`System.Nullable<T>\` or syntax shorthand \`T?\`).

---

## Anatomy of System.Nullable<T> Under the Hood

Under the hood, \`int?\` is syntactic sugar for the generic value type \`System.Nullable<int>\`.

\`\`\`csharp
namespace System
{
    [Serializable]
    public struct Nullable<T> where T : struct
    {
        private readonly bool hasValue;
        internal T value;

        public Nullable(T value)
        {
            this.value = value;
            this.hasValue = true;
        }

        public readonly bool HasValue => hasValue;

        public readonly T Value => hasValue 
            ? value 
            : throw new InvalidOperationException("Nullable object must have a value.");

        public readonly T GetValueOrDefault() => value;
        public readonly T GetValueOrDefault(T defaultValue) => hasValue ? value : defaultValue;
    }
}
\`\`\`

### Memory Layout & Alignment Padding
Because \`Nullable<T>\` is a value type struct composed of a boolean flag and the underlying value \`T\`, the runtime lays it out contiguously in memory on the stack (or inside an enclosing object on the heap):

- \`Nullable<bool>\`: 1 byte for \`bool value\` + 1 byte for \`bool hasValue\` = **2 bytes**.
- \`Nullable<int>\`: 4 bytes for \`int value\` + 1 byte for \`bool hasValue\` + 3 bytes struct alignment padding = **8 bytes**.
- \`Nullable<double>\`: 8 bytes for \`double value\` + 1 byte for \`bool hasValue\` + 7 bytes padding = **16 bytes**.

---

## Special CLR Boxing & Unboxing Rules

Normally, boxing a struct wraps the struct instance into an object allocated on the managed heap. However, the CLR implements **special built-in runtime magic for \`Nullable<T>\`**:

1. **Boxing a Null Instance**:
   - If \`hasValue == false\`, boxing \`Nullable<T>\` produces a **null object reference** (\`null\`), NOT a boxed struct!
   \`\`\`csharp
   int? empty = null;
   object boxed = empty; // boxed is literally null!
   Console.WriteLine(boxed == null); // True
   \`\`\`
2. **Boxing a Populated Instance**:
   - If \`hasValue == true\`, the CLR extracts the underlying value \`T\` and boxes **only the underlying value**, NOT the \`Nullable<T>\` wrapper!
   \`\`\`csharp
   int? populated = 42;
   object boxed = populated; // Boxed as System.Int32, NOT System.Nullable<Int32>!
   Console.WriteLine(boxed.GetType()); // System.Int32
   \`\`\`
3. **Unboxing Directness**:
   - A boxed \`int\` can be unboxed directly into either \`int\` or \`int?\`:
   \`\`\`csharp
   object boxedInt = 100;
   int? unboxedNullable = (int?)boxedInt; // Valid!
   \`\`\`
4. **The \`GetType()\` Quirk**:
   - You can never observe \`typeof(Nullable<int>)\` by calling \`.GetType()\` on an instance. Calling \`.GetType()\` is a virtual call on \`object\`, which requires boxing. If the instance is null, it throws \`NullReferenceException\`. If populated, it boxes to \`int\`, returning \`System.Int32\`. To obtain the nullable type metadata, you must use \`typeof(int?)\` statically.

---

## Lifted Operators

The C# compiler automatically "lifts" predefined unary and binary operators (arithmetic, relational, equality) to work seamlessly with nullable operands:

| Operator Category | Lifted Expression | Behavior When Operand is \`null\` |
| :--- | :--- | :--- |
| **Arithmetic** (\`+\`, \`-\`, \`*\`, \`/\`) | \`int? c = a + b;\` | Evaluates to **\`null\`** if either operand is \`null\`. |
| **Equality** (\`==\`, \`!=\`) | \`bool eq = (a == b);\` | \`null == null\` is **\`true\`**. If only one is \`null\`, evaluates to **\`false\`**. |
| **Relational** (\`>\`, \`<\`, \`>=\`, \`<=\`) | \`bool gt = (a > b);\` | Always evaluates to **\`false\`** if either operand is \`null\`. |

> **Critical Gotcha**: Because relational operators return \`false\` when comparing against null, the inverse is NOT true:
> \`\`\`csharp
> int? x = null;
> int? y = 10;
> 
> Console.WriteLine(x > y);  // False
> Console.WriteLine(x <= y); // False! Neither is greater, yet neither is less or equal!
> \`\`\`

---

## Idiomatic Access Patterns

\`\`\`csharp
int? score = FetchNullableScoreFromDb();

// Pattern 1: HasValue guard with Value extraction
if (score.HasValue)
{
    Console.WriteLine($"Confirmed score: {score.Value}");
}
else
{
    Console.WriteLine("Score not yet recorded.");
}

// Pattern 2: GetValueOrDefault with fallback parameter
int finalDisplay = score.GetValueOrDefault(-1);

// Pattern 3: Pattern matching (Recommended modern idiom)
if (score is int validScore)
{
    Console.WriteLine($"Pattern matched score: {validScore}");
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem U (Float or int)
*Given a real number $N$, determine whether it is an integer or float. If it is an integer, print \`int {integer_part}\`. If it has a fractional value, print \`float {integer_part} {fractional_part}\`.*

#### Algorithmic Analysis
1. Parse the input into a numeric representation (\`decimal\` or \`double\`).
2. Extract the integer component using truncation \`(long)val\`.
3. Compute the fractional component: \`decimal? fraction = val - intPart;\`.
4. If \`fraction.HasValue\` and \`fraction.Value == 0\`, output as an integer; otherwise, format the floating-point output.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (decimal.TryParse(input.Trim(), NumberStyles.Float, CultureInfo.InvariantCulture, out decimal number))
        {
            long integerPart = (long)number;
            decimal? fractionalDifference = number - integerPart;

            if (fractionalDifference.HasValue && fractionalDifference.Value != 0m)
            {
                // Format with exact fractional representation
                string rawFraction = fractionalDifference.Value.ToString(CultureInfo.InvariantCulture);
                Console.WriteLine($"float {integerPart} {rawFraction}");
            }
            else
            {
                Console.WriteLine($"int {integerPart}");
            }
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(L)$ where $L$ is the string digit length of $N$, bounded by $L \\le 100$. Decimal parsing and arithmetic execute in linear time relative to length.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory; decimal value types reside on the stack.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Float or int](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/U) | Easy | Nullable value arithmetic, Truncation, Precision guards |
| ⚪ | Codeforces | [Assiut Sheet #1: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Remainder evaluation, Integer divisibility, Guard clauses |
| ⚪ | Exercism C# | [Tim from Marketing](https://exercism.org/tracks/csharp/exercises/tim-from-marketing) | Easy | Nullable value types (\`int?\`), Nullable reference types, String formatting |
| ⚪ | Exercism C# | [Darts](https://exercism.org/tracks/csharp/exercises/darts) | Easy | Coordinate calculation, Euclidean distance, Nullable score fallbacks |
`,

  contentBn: `# C# এ নালেবল ভ্যালু টাইপ (Nullable<T>)

C# এ মৌলিক ভ্যালু টাইপগুলো (\`int\`, \`double\`, \`bool\`, \`DateTime\`, \`struct\`) ডিফল্ট মান (যেমন \`0\` বা \`false\`) নিয়ে স্ট্যাকে তৈরি হয়। সাধারণ নিয়ম অনুযায়ী ভ্যালু টাইপ কখনও \`null\` ধারণ করতে পারে না।

কিন্তু বাস্তব জীবনে রিলেশনাল ডাটাবেজের কলামে প্রায়ই মান ফাঁকা বা \`NULL\` থাকে। সি#-এ এই ধরনের ঐচ্ছিক বা মিসিং মানকে ভ্যালু টাইপের মাধ্যমে প্রকাশ করার জন্য **নালেবল ভ্যালু টাইপ** (\`System.Nullable<T>\` বা সংক্ষেপে \`T?\`) ব্যবহৃত হয়।

---

## System.Nullable<T> এর অভ্যন্তরীণ গঠন

ভেতরে \`int?\` মূলত একটি জেনেরিক স্ট্রাকট \`System.Nullable<int>\` এর সিনট্যাক্টিক সুগার।

\`\`\`csharp
namespace System
{
    [Serializable]
    public struct Nullable<T> where T : struct
    {
        private readonly bool hasValue;
        internal T value;

        public Nullable(T value)
        {
            this.value = value;
            this.hasValue = true;
        }

        public readonly bool HasValue => hasValue;

        public readonly T Value => hasValue 
            ? value 
            : throw new InvalidOperationException("Nullable object must have a value.");

        public readonly T GetValueOrDefault() => value;
        public readonly T GetValueOrDefault(T defaultValue) => hasValue ? value : defaultValue;
    }
}
\`\`\`

### মেমোরি লেআউট ও অ্যালাইনমেন্ট প্যাডিং
যেহেতু \`Nullable<T>\` একটি স্ট্রাকট, তাই এতে একটি বুলিয়ান ফ্ল্যাগ (\`hasValue\`) এবং মূল মান (\`value\`) সংরক্ষিত থাকে। মেমোরি অ্যালাইনমেন্টের কারণে এতে প্যাডিং বাইট যুক্ত হয়:

- \`Nullable<bool>\`: ১ বাইট বুলিয়ান মান + ১ বাইট ফ্ল্যাগ = **২ বাইট**।
- \`Nullable<int>\`: ৪ বাইট পূর্ণসংখ্যা + ১ বাইট ফ্ল্যাগ + ৩ বাইট প্যাডিং = **৮ বাইট**।
- \`Nullable<double>\`: ৮ বাইট ফ্লোটিং পয়েন্ট + ১ বাইট ফ্ল্যাগ + ৭ বাইট প্যাডিং = **১৬ বাইট**।

---

## CLR-এর স্পেশাল বক্সিং ও আনবক্সিং আচরণ

সাধারণত স্ট্রাকট বক্সিং করলে মেমোরি হিপে একটি সম্পূর্ণ অবজেক্ট তৈরি হয়। কিন্তু CLR-এ \`Nullable<T>\` এর জন্য বিশেষ রানটাইম অপ্টিমাইজেশন রয়েছে:

১. **নাল অবস্থার বক্সিং**:
   - যদি \`hasValue == false\` হয়, তবে বক্সিং করার পর কোনো বক্সড অবজেক্ট তৈরি হয় না; এটি সরাসরি একটি **নাল রেফারেন্স** (\`null\`) রিটার্ন করে!
   \`\`\`csharp
   int? empty = null;
   object boxed = empty;
   Console.WriteLine(boxed == null); // True
   \`\`\`
২. **মানযুক্ত অবস্থার বক্সিং**:
   - যদি \`hasValue == true\` হয়, তবে CLR সম্পূর্ণ স্ট্রাকট বক্সিং না করে কেবল ভেতরের \`T\` মানটিকে বক্স করে!
   \`\`\`csharp
   int? populated = 42;
   object boxed = populated;
   Console.WriteLine(boxed.GetType()); // System.Int32 (System.Nullable<Int32> নয়!)
   \`\`\`
৩. **সরাসরি আনবক্সিং**:
   - কোনো বক্সড \`int\` অবজেক্টকে সরাসরি \`int\` কিংবা \`int?\` উভয় টাইপেই নিরাপদভাবে আনবক্স করা যায়।
৪. **\`GetType()\` এর ব্যতিক্রম**:
   - কোনো নালেবল ইনস্ট্যান্সে \`.GetType()\` কল করে কখনোই \`Nullable<int>\` পাওয়া সম্ভব নয়। কারণ \`.GetType()\` কল করার সাথে সাথে এটি বক্সিং হয়। নাল থাকলে \`NullReferenceException\` ঘটে, আর মান থাকলে এটি \`System.Int32\` রিটার্ন করে। টাইপ মেটাডেটা পেতে \`typeof(int?)\` ব্যবহার করতে হয়।

---

## লিফটেড অপারেটর (Lifted Operators)

C# কম্পাইলার সাধারণ গাণিতিক এবং তুলনামূলক অপারেটরগুলোকে নালেবল অপারেন্ডের জন্য স্বয়ংক্রিয়ভাবে এক্সপ্যান্ড (Lift) করে:

| অপারেটরের ধরন | উদাহরণ কোড | নাল অপারেন্ডের ক্ষেত্রে আচরণ |
| :--- | :--- | :--- |
| **গাণিতিক** (\`+\`, \`-\`, \`*\`, \`/\`) | \`int? c = a + b;\` | যেকোনো একটি অপারেন্ড \`null\` হলে ফলাফল হবে **\`null\`**। |
| **সমতা** (\`==\`, \`!=\`) | \`bool eq = (a == b);\` | \`null == null\` হলো **\`true\`**; কেবল একটি \`null\` হলে **\`false\`**। |
| **তুলনামূলক** (\`>\`, \`<\`, \`>=\`, \`<=\`) | \`bool gt = (a > b);\` | যেকোনো একটি অপারেন্ড \`null\` হলে ফলাফল সবসময় **\`false\`**! |

> **সতর্কতা**: যেহেতু নালের সাথে গ্রেটার-দ্যান বা লেস-দ্যান তুলনা সবসময় \`false\` রিটার্ন করে, তাই:
> \`\`\`csharp
> int? x = null;
> int? y = 10;
> 
> Console.WriteLine(x > y);  // False
> Console.WriteLine(x <= y); // False! কোনটিই বড় নয়, আবার ছোট বা সমানও নয়!
> \`\`\`

---

## নালেবল মান ব্যবহারের স্ট্যান্ডার্ড প্যাটার্ন

\`\`\`csharp
int? score = FetchNullableScoreFromDb();

// ১. HasValue দিয়ে গার্ড চেক
if (score.HasValue)
{
    Console.WriteLine($"Score: {score.Value}");
}

// ২. GetValueOrDefault দিয়ে ডিফল্ট ফলব্যাক
int finalDisplay = score.GetValueOrDefault(-1);

// ৩. প্যাটার্ন ম্যাচিং (সর্বাধুনিক নিরাপদ পদ্ধতি)
if (score is int validScore)
{
    Console.WriteLine($"Pattern matched score: {validScore}");
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem U (Float or int)
*একটি বাস্তব সংখ্যা $N$ দেওয়া থাকবে। সংখ্যাটি পূর্ণসংখ্যা হলে \`int {integer_part}\` প্রিন্ট করুন, আর দশমিক ভগ্নাংশ থাকলে \`float {integer_part} {fractional_part}\` প্রিন্ট করুন।*

#### গাণিতিক ও অ্যালগরিদম বিশ্লেষণ
১. ইনপুটটিকে \`decimal\` বা \`double\` হিসেবে পার্স করুন।
২. কাস্টিংয়ের মাধ্যমে পূর্ণসংখ্যা অংশ \`(long)number\` আলাদা করুন।
৩. ভগ্নাংশ বের করুন: \`decimal? fractionalDifference = number - integerPart;\`।
৪. ভগ্নাংশ \`0\` এর সমান হলে পূর্ণসংখ্যা হিসেবে প্রিন্ট করুন, অন্যথায় ফ্লোট হিসেবে ফরম্যাট করুন।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Globalization;

public class Program
{
    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (decimal.TryParse(input.Trim(), NumberStyles.Float, CultureInfo.InvariantCulture, out decimal number))
        {
            long integerPart = (long)number;
            decimal? fractionalDifference = number - integerPart;

            if (fractionalDifference.HasValue && fractionalDifference.Value != 0m)
            {
                string rawFraction = fractionalDifference.Value.ToString(CultureInfo.InvariantCulture);
                Console.WriteLine($"float {integerPart} {rawFraction}");
            }
            else
            {
                Console.WriteLine($"int {integerPart}");
            }
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(L)$, যেখানে $L$ হলো ইনপুটের দৈর্ঘ্য ($L \\le 100$)। ডেসিমাল পার্সিং ও বিয়োগ লিনিয়ার সময়ে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, স্ট্যাকে সীমিত মেমোরি ব্যবহৃত হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Float or int](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/U) | Easy | Nullable value arithmetic, Truncation, Precision guards |
| ⚪ | Codeforces | [Assiut Sheet #1: Multiples](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J) | Easy | Remainder evaluation, Integer divisibility, Guard clauses |
| ⚪ | Exercism C# | [Tim from Marketing](https://exercism.org/tracks/csharp/exercises/tim-from-marketing) | Easy | Nullable value types (\`int?\`), Nullable reference types, String formatting |
| ⚪ | Exercism C# | [Darts](https://exercism.org/tracks/csharp/exercises/darts) | Easy | Coordinate calculation, Euclidean distance, Nullable score fallbacks |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Float or int",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/U",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Nullables", "Floating Point", "Type System"],
      solutionEn:
        "Parse the numeric input into a decimal or double, calculate the fractional difference via nullable variables, and evaluate whether fraction equals zero.",
      solutionBn:
        "ইনপুট সংখ্যাকে পার্স করে নালেবল ভ্যারিয়েবলের মাধ্যমে ভগ্নাংশ বিয়োগফল বের করুন এবং তা শূন্য কি না পরীক্ষা করে যথাযথ আউটপুট দিন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Multiples",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Modulo", "Conditionals", "Guard Clauses"],
      solutionEn:
        "Evaluate whether A is a multiple of B or vice-versa using the modulo operator, guarding against zero divisors.",
      solutionBn:
        "মডিউলো অপারেটর দিয়ে A ও B একে অপরের গুণিতক কি না যাচাই করুন এবং শূন্য দিয়ে ভাগ হওয়ার ঝুঁকি প্রতিরোধে গার্ড ক্লজ ব্যবহার করুন।",
    },
    {
      source: "Exercism C#",
      name: "Tim from Marketing",
      url: "https://exercism.org/tracks/csharp/exercises/tim-from-marketing",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Nullables", "Strings", "Pattern Matching"],
      solutionEn:
        "Format employee identification badges safely handling nullable integer IDs (int?) and nullable department strings.",
      solutionBn:
        "ঐচ্ছিক নালেবল আইডি (int?) ও নালেবল ডিপার্টমেন্ট স্ট্রিং যাচাই করে কর্মীদের ব্যাজ টেক্সট নির্ভুলভাবে ফরম্যাট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Darts",
      url: "https://exercism.org/tracks/csharp/exercises/darts",
      difficulty: "EASY",
      company: "Optimizely",
      tags: ["Math", "Nullables", "Geometry"],
      solutionEn:
        "Calculate target landing radius using Euclidean distance, returning concentric ring scores with safe fallback handling.",
      solutionBn:
        "ইউক্লিডিয়ান দূরত্বের সাহায্যে টার্গেট পয়েন্টের ব্যাসার্ধ নির্ণয় করে সঠিক রিং স্কোর প্রদান করুন।",
    },
  ],
};
