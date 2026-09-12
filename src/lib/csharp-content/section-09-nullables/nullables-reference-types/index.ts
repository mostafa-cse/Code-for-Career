import type { LocalLesson } from "@/lib/lessons-data";

export const nullablesReferenceTypesLesson: LocalLesson = {
  slug: "nullables-reference-types",
  titleEn: "Nullable Reference Types (NRT)",
  titleBn: "নালেবল রেফারেন্স টাইপ (NRT) ও কম্পাইলার সতর্কতা",
  categoryEn: "09. Nullable Types",
  categoryBn: "০৯. নালেবল টাইপ ও নাল-নিরাপত্তা",
  categoryDescEn:
    "Modern null-safety in C#: Nullable<T> structs, C# 8 Nullable Reference Types (NRT), null-coalescing, null-conditional, and null-forgiving operators.",
  categoryDescBn:
    "সি# এ আধুনিক নাল-নিরাপত্তা: Nullable<T> স্ট্রাক্ট, সি# ৮ নালেবল রেফারেন্স টাইপ (NRT), নাল-কোয়ালেসিং (??), নাল-কন্ডিশনাল (?.) ও নাল-ফরগিভিং (!) অপারেটর।",
  categoryPriority: "CORE",
  descriptionEn:
    "C# 8 null-safety revolution, static flow analysis, [Nullable] metadata attributes, CS8600/CS8602/CS8618 warnings, and System.Diagnostics.CodeAnalysis contracts.",
  descriptionBn:
    "সি# ৮ এর নাল-নিরাপত্তা বিপ্লব, স্ট্যাটিক ফ্লো অ্যানালাইসিস, [Nullable] মেটাডেটা অ্যাট্রিবিউট, কম্পাইলার ওয়ার্নিং এবং CodeAnalysis কন্ট্রাক্ট।",
  difficulty: "MEDIUM",
  displayOrder: 2,
  prerequisites: ["nullables-value-types"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Nullable Reference Types (NRT) in C#

In 1965, British computer scientist Sir Tony Hoare invented the null reference, famously referring to it decades later as his **"Billion-Dollar Mistake"** because of the countless software bugs, system crashes, and security vulnerabilities caused by unexpected null references.

In C# 8.0, Microsoft introduced **Nullable Reference Types (NRT)** to eradicate \`NullReferenceException\` at its source by shifting null checks from **unpredictable runtime crashes to compile-time static analysis**.

---

## NRT Under the Hood: Compile-Time vs Runtime

There is a fundamental architectural distinction between **Nullable Value Types** and **Nullable Reference Types**:

| Feature | Nullable Value Types (\`int?\`) | Nullable Reference Types (\`string?\`) |
| :--- | :--- | :--- |
| **Runtime Representation** | Wrapped in a generic struct: \`System.Nullable<int>\`. | **Identical to normal references**. Just a raw pointer to an object on the heap. |
| **Memory Footprint** | Additional bytes for boolean flag and padding (e.g. 8 bytes vs 4 bytes). | **Zero additional memory**. No wrapper struct. |
| **Runtime Overhead** | Minor struct copying and boxing/unboxing branches. | **Zero runtime performance cost**. |
| **Enforcement** | CLR runtime type system enforces validity. | **Compiler static flow analysis only**. |

### IL Metadata Attributes (\`[Nullable]\`)
Because the CLR sees no difference between \`string\` and \`string?\`, how do other assemblies and libraries know the developer's nullability intent?

During compilation, the Roslyn compiler emits internal metadata attributes into the compiled assembly:
- \`[Nullable(byte)]\`
- \`[NullableContext(byte)]\`

Where \`1\` signifies non-nullable and \`2\` signifies nullable. Reflection and downstream C# compilers inspect these attributes to uphold null-safety across library boundaries.

---

## Compiler Static Flow Analysis & Key Warnings

When \`<Nullable>enable</Nullable>\` is activated in your \`.csproj\` (or via \`#nullable enable\` in source code), reference types become **non-nullable by default**.

The Roslyn compiler tracks the nullability state of every variable along all possible execution branches:

| Compiler Warning | Code Trigger | Root Cause & Remedy |
| :--- | :--- | :--- |
| **CS8600** | \`string name = null;\` | Converting null literal to a non-nullable reference. Declare as \`string? name\` if null is permissible. |
| **CS8602** | \`string? s = Get(); s.ToUpper();\` | Dereference of a possibly null reference. Guard with \`if (s != null)\` or \`s?.ToUpper()\`. |
| **CS8603** | \`return null;\` (in \`string Method()\`) | Returning null from a method declared to return a non-nullable reference. |
| **CS8604** | \`Consume(possiblyNullString);\` | Passing a nullable variable to a parameter expecting a non-nullable instance. |
| **CS8618** | Class properties without constructors | Non-nullable field or property uninitialized at constructor exit. Initialize with default, use \`required\`, or use constructor. |

\`\`\`csharp
#nullable enable

public class CustomerProfile
{
    // CS8618 Warning if not initialized!
    public string Username { get; set; } = string.Empty; 

    // Explicitly nullable: May be missing or unprovided
    public string? MiddleName { get; set; }

    public void FormatGreetings()
    {
        // Compiler Safe: Username cannot be null
        Console.WriteLine($"Welcome, {Username.ToUpper()}");

        // Compiler Warning CS8602 if dereferencing MiddleName directly:
        // Console.WriteLine(MiddleName.Length); // DANGEROUS!

        // Static flow analysis recognizes this null guard:
        if (MiddleName != null)
        {
            // Compiler KNOWS MiddleName is not null inside this block!
            Console.WriteLine($"Middle initial: {MiddleName[0]}");
        }
    }
}
\`\`\`

---

## Advanced Nullability Attributes (\`System.Diagnostics.CodeAnalysis\`)

Standard flow analysis cannot always deduce what happens inside complex helper methods. C# provides code analysis attributes to instruct the compiler:

### 1. \`[NotNullWhen(true)]\`
Indicates that an \`out\` parameter is guaranteed not to be null when the method returns \`true\`:

\`\`\`csharp
using System.Diagnostics.CodeAnalysis;

public static bool TryFindUser(string id, [NotNullWhen(true)] out User? user)
{
    user = Database.Find(id);
    return user != null;
}

// In consumer code:
if (TryFindUser("usr_42", out var user))
{
    // The compiler knows 'user' is guaranteed non-null here without warnings!
    Console.WriteLine(user.Email);
}
\`\`\`

### 2. \`[MemberNotNull(nameof(Field))]\`
Indicates that a helper method initializes a non-nullable field or property, satisfying CS8618:

\`\`\`csharp
public class DataService
{
    private HttpClient client;

    public DataService()
    {
        InitializeClient(); // Satisfies CS8618 thanks to MemberNotNull!
    }

    [MemberNotNull(nameof(client))]
    private void InitializeClient()
    {
        client = new HttpClient();
    }
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Exercism C# — Tim from Marketing
*Write a badge generator for employees. A badge consists of an optional ID (\`int?\`), an employee name (\`string\`), and an optional department (\`string?\`). If the ID is present, format as \`[ID] - \`. If the department is missing or null, default to \`OWNER\` in uppercase.*

#### Architectural Analysis
1. \`id\` is a **Nullable Value Type** (\`int?\`).
2. \`name\` is a **Non-Nullable Reference Type** (\`string\`).
3. \`department\` is a **Nullable Reference Type** (\`string?\`).
4. We combine string interpolation with flow analysis guards to produce the formatted badge string.

#### C# Implementation

\`\`\`csharp
#nullable enable
using System;

public static class Badge
{
    public static string Print(int? id, string name, string? department)
    {
        // Guard input name
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        string idPrefix = id.HasValue ? $"[{id.Value}] - " : string.Empty;
        string departmentSuffix = department != null ? department.ToUpperInvariant() : "OWNER";

        return $"{idPrefix}{name} - {departmentSuffix}";
    }
}

public class Program
{
    public static void Main()
    {
        Console.WriteLine(Badge.Print(734, "Robert", "Marketing")); // [734] - Robert - MARKETING
        Console.WriteLine(Badge.Print(null, "Alice", null));          // Alice - OWNER
        Console.WriteLine(Badge.Print(101, "Karim", null));           // [101] - Karim - OWNER
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(L)$ where $L$ is the combined length of the name and department strings. Uppercase transformation and string interpolation run in linear time.
- **Space Complexity**: $\\mathcal{O}(L)$ to allocate the returned badge string on the heap.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Exercism C# | [Tim from Marketing](https://exercism.org/tracks/csharp/exercises/tim-from-marketing) | Easy | NRT, Null-safety, String formatting |
| ⚪ | Codeforces | [Assiut Sheet #1: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | Basic types, Input parsing, Non-nullable variables |
| ⚪ | Codeforces | [Assiut Sheet #1: Max and Min](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K) | Easy | Conditional logic, Number bounds, Array checks |
| ⚪ | Exercism C# | [Log Analysis](https://exercism.org/tracks/csharp/exercises/log-analysis) | Easy | String extensions, Substring parsing, NRT guarantees |
`,

  contentBn: `# C# এ নালেবল রেফারেন্স টাইপ (NRT) ও কম্পাইলার সতর্কতা

১৯৬৫ সালে ব্রিটিশ কম্পিউটার বিজ্ঞানী স্যার টনি হোর নাল রেফারেন্স আবিষ্কার করেন। পরবর্তীতে তিনি এটিকে নিজের **"বিলিয়ন ডলারের ভুল" (Billion-Dollar Mistake)** বলে অভিহিত করেন, কারণ নাল রেফারেন্সের ভুলের কারণে সফটওয়্যার শিল্পে অগণিত ক্র্যাশ ও আর্থিক ক্ষতি সাধিত হয়েছে।

সি# ৮.০ সংস্করণে মাইক্রোসফট **নালেবল রেফারেন্স টাইপ (NRT)** যুক্ত করে। এর মূল উদ্দেশ্য হলো রানটাইমে \`NullReferenceException\` ক্র্যাশ হওয়ার আগেই **কম্পাইল-টাইম স্ট্যাটিক বিশ্লেষণের** মাধ্যমে ত্রুটি শনাক্ত ও প্রতিরোধ করা।

---

## NRT এর অভ্যন্তরীণ আর্কিটেকচার: কম্পাইল-টাইম বনাম রানটাইম

**নালেবল ভ্যালু টাইপ** এবং **নালেবল রেফারেন্স টাইপের** মধ্যে মৌলিক কাঠামোগত পার্থক্য রয়েছে:

| বৈশিষ্ট্য | নালেবল ভ্যালু টাইপ (\`int?\`) | নালেবল রেফারেন্স টাইপ (\`string?\`) |
| :--- | :--- | :--- |
| **রানটাইম স্ট্রাকচার** | জেনেরিক স্ট্রাকটে মোড়ানো: \`System.Nullable<int>\`। | **সাধারণ রেফারেন্সের অনুরূপ**। হিপ অবজেক্টের সরাসরি মেমোরি পয়েন্টার। |
| **মেমোরি দখল** | অতিরিক্ত ফ্ল্যাগ ও প্যাডিং বাইট (যেমন ৪ বাইটের বদলে ৮ বাইট)। | **অতিরিক্ত শূন্য বাইট**। কোনো র‍্যাপার অবজেক্ট তৈরি হয় না। |
| **রানটাইম ওভারহেড** | স্ট্রাকট কপি ও বক্সিং/আনবক্সিং শাখা। | **রানটাইমে কোনো পারফরম্যান্স খরচ নেই**। |
| **এনফোর্সমেন্ট** | সিএলআর টাইপ সিস্টেম দ্বারা রানটাইমে নিয়ন্ত্রিত। | **কেবলমাত্র কম্পাইলার স্ট্যাটিক ফ্লো অ্যানালাইসিস** দ্বারা নিয়ন্ত্রিত। |

### IL মেটাডেটা অ্যাট্রিবিউট (\`[Nullable]\`)
যেহেতু রানটাইমে \`string\` ও \`string?\` এর মধ্যে কোনো পার্থক্য নেই, তাহলে অন্য প্রজেক্ট বা লাইব্রেরি কীভাবে বুঝবে কোনটি নাল হতে পারে?

কম্পাইল করার সময় Roslyn কম্পাইলার ইন্টারনাল মেটাডেটা অ্যাট্রিবিউট তৈরি করে ডিএলএল-এ সংযুক্ত করে দেয়:
- \`[Nullable(byte)]\`
- \`[NullableContext(byte)]\`

যেখানে \`1\` মানে নন-নালেবল এবং \`2\` মানে নালেবল। ডাউনস্ট্রিম সি# কম্পাইলার এই মেটাডেটা পড়ে নাল-নিরাপত্তা বজায় রাখে।

---

## কম্পাইলার স্ট্যাটিক ফ্লো বিশ্লেষণ ও প্রধান সতর্কতাসমূহ

প্রজেক্টে \`<Nullable>enable</Nullable>\` সক্রিয় করা হলে সকল রেফারেন্স টাইপ **ডিফল্টভাবে নন-নালেবল** হয়ে যায়।

কম্পাইলার এক্সিকিউশনের প্রতিটি শাখা বিশ্লেষণ করে নিচের সতর্কতাগুলো প্রদান করে:

| কম্পাইলার ওয়ার্নিং | ট্রিগার কোড | মূল কারণ ও প্রতিকার |
| :--- | :--- | :--- |
| **CS8600** | \`string name = null;\` | নন-নালেবল রেফারেন্সে নাল অ্যাসাইন করা হয়েছে। নাল অনুমোদিত হলে \`string? name\` লিখুন। |
| **CS8602** | \`string? s = Get(); s.ToUpper();\` | সম্ভাব্য নাল ভ্যারিয়েবল সরাসরি কল করা হয়েছে। \`if (s != null)\` বা \`s?.ToUpper()\` দিয়ে সুরক্ষিত করুন। |
| **CS8603** | \`return null;\` (মেথড রিটার্ন \`string\`) | নন-নালেবল মেথড থেকে নাল রিটার্ন করা নিষিদ্ধ। |
| **CS8604** | \`Consume(possiblyNullString);\` | নন-নালেবল প্যারামিটারে সম্ভাব্য নাল ভ্যালু পাস করা হয়েছে। |
| **CS8618** | কনস্ট্রাক্টরে ইনিশিয়ালাইজ না করা ফিল্ড | ক্লাস তৈরি শেষে নন-নালেবল প্রোপার্টি ফাঁকা থাকা যাবে না। ডিফল্ট ভ্যালু বা কনস্ট্রাক্টর ব্যবহার করুন। |

\`\`\`csharp
#nullable enable

public class CustomerProfile
{
    public string Username { get; set; } = string.Empty; 

    public string? MiddleName { get; set; }

    public void FormatGreetings()
    {
        // নিরাপদ: Username কখনোই নাল হবে না
        Console.WriteLine($"Welcome, {Username.ToUpper()}");

        // স্ট্যাটিক ফ্লো অ্যানালাইসিস নাল গার্ড শনাক্ত করে:
        if (MiddleName != null)
        {
            // কম্পাইলার নিশ্চিত যে এই ব্লকে MiddleName নাল নয়!
            Console.WriteLine($"Middle initial: {MiddleName[0]}");
        }
    }
}
\`\`\`

---

## অ্যাডভান্সড কোড অ্যানালাইসিস অ্যাট্রিবিউট (\`System.Diagnostics.CodeAnalysis\`)

জটিল হেল্পার মেথডের আচরণ বোঝাতে স্পেশাল অ্যাট্রিবিউট ব্যবহার করা হয়:

### ১. \`[NotNullWhen(true)]\`
মেথডটি \`true\` রিটার্ন করলে সংশ্লিষ্ট \`out\` প্যারামিটারটি কখনোই \`null\` হবে না:

\`\`\`csharp
using System.Diagnostics.CodeAnalysis;

public static bool TryFindUser(string id, [NotNullWhen(true)] out User? user)
{
    user = Database.Find(id);
    return user != null;
}

// ব্যবহারের ক্ষেত্রে:
if (TryFindUser("usr_42", out var user))
{
    // কম্পাইলার জানে এখানে user কখনোই null হতে পারে না!
    Console.WriteLine(user.Email);
}
\`\`\`

### ২. \`[MemberNotNull(nameof(Field))]\`
মেথডটি কল করার ফলে নন-নালেবল ফিল্ড ইনিশিয়ালাইজড হয়েছে তা নিশ্চিত করে CS8618 ওয়ার্নিং দূর করা:

\`\`\`csharp
public class DataService
{
    private HttpClient client;

    public DataService()
    {
        InitializeClient(); // CS8618 ওয়ার্নিং হয় না MemberNotNull এর কারণে!
    }

    [MemberNotNull(nameof(client))]
    private void InitializeClient()
    {
        client = new HttpClient();
    }
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Exercism C# — Tim from Marketing
*কর্মীদের ব্যাজ জেনারেটর তৈরি করতে হবে। ব্যাজে ঐচ্ছিক আইডি (\`int?\`), কর্মীর নাম (\`string\`) এবং ঐচ্ছিক ডিপার্টমেন্টের নাম (\`string?\`) থাকবে। আইডি থাকলে \`[ID] - \` ফরম্যাটে যুক্ত হবে। ডিপার্টমেন্ট ফাঁকা থাকলে ডিফল্ট \`OWNER\` প্রিন্ট হবে।*

#### সমাধান বিশ্লেষণ
১. \`id\` হলো **নালেবল ভ্যালু টাইপ** (\`int?\`)।
২. \`name\` হলো **নন-নালেবল রেফারেন্স টাইপ** (\`string\`)।
৩. \`department\` হলো **নালেবল রেফারেন্স টাইপ** (\`string?\`)।
৪. স্ট্রিং ইন্টারপোলেশন ও নাল গার্ড দিয়ে ব্যাজ ফরম্যাট করা।

#### C# সমাধান

\`\`\`csharp
#nullable enable
using System;

public static class Badge
{
    public static string Print(int? id, string name, string? department)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        string idPrefix = id.HasValue ? $"[{id.Value}] - " : string.Empty;
        string departmentSuffix = department != null ? department.ToUpperInvariant() : "OWNER";

        return $"{idPrefix}{name} - {departmentSuffix}";
    }
}

public class Program
{
    public static void Main()
    {
        Console.WriteLine(Badge.Print(734, "Robert", "Marketing")); // [734] - Robert - MARKETING
        Console.WriteLine(Badge.Print(null, "Alice", null));          // Alice - OWNER
        Console.WriteLine(Badge.Print(101, "Karim", null));           // [101] - Karim - OWNER
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(L)$, নাম ও ডিপার্টমেন্টের অক্ষরের দৈর্ঘ্যের ওপর নির্ভরশীল।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(L)$, নতুন রিটার্নড স্ট্রিং মেমোরি হিপে যুক্ত হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Exercism C# | [Tim from Marketing](https://exercism.org/tracks/csharp/exercises/tim-from-marketing) | Easy | NRT, Null-safety, String formatting |
| ⚪ | Codeforces | [Assiut Sheet #1: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | Basic types, Input parsing, Non-nullable variables |
| ⚪ | Codeforces | [Assiut Sheet #1: Max and Min](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K) | Easy | Conditional logic, Number bounds, Array checks |
| ⚪ | Exercism C# | [Log Analysis](https://exercism.org/tracks/csharp/exercises/log-analysis) | Easy | String extensions, Substring parsing, NRT guarantees |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Tim from Marketing",
      url: "https://exercism.org/tracks/csharp/exercises/tim-from-marketing",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["NRT", "Null-Safety", "Strings"],
      solutionEn:
        "Utilize C# 8 Nullable Reference Types and static flow analysis to format employee badges with optional ID and department fallback.",
      solutionBn:
        "সি# ৮ নালেবল রেফারেন্স টাইপ ও স্ট্যাটিক ফ্লো অ্যানালাইসিস ব্যবহার করে কর্মীদের ব্যাজ টেক্সট নিরাপদভাবে ফরম্যাট করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Digits Summation",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F",
      difficulty: "EASY",
      company: "BJIT Group",
      tags: ["Modulo", "Parsing", "Basic Types"],
      solutionEn:
        "Parse two large numbers from console input, extract their last digits using modulo 10 arithmetic, and return their sum.",
      solutionBn:
        "কনসোল থেকে দুটি বড় সংখ্যা পার্স করে মডিউলো ১০ অপারেশনের সাহায্যে শেষ ডিজিট বের করুন এবং তাদের যোগফল প্রিন্ট করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Max and Min",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/K",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Math", "Conditionals", "Non-Nullable"],
      solutionEn:
        "Read three space-delimited integers into non-nullable variables, compute minimum and maximum values using Math.Min and Math.Max.",
      solutionBn:
        "তিনটি পূর্ণসংখ্যা নন-নালেবল ভ্যারিয়েবলে ইনপুট নিয়ে Math.Min এবং Math.Max ব্যবহার করে যথাক্রমে সর্বনিম্ন ও সর্বোচ্চ সংখ্যা বের করুন।",
    },
    {
      source: "Exercism C#",
      name: "Log Analysis",
      url: "https://exercism.org/tracks/csharp/exercises/log-analysis",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Extension Methods", "Strings", "NRT"],
      solutionEn:
        "Develop string extension methods with strict null checks to extract log levels, prefixes, and messages cleanly.",
      solutionBn:
        "স্ট্রিং এক্সটেনশন মেথড তৈরি করে কঠোর নাল চেকের মাধ্যমে লগ ফাইলের লেভেল এবং মেসেজ আলাদা করুন।",
    },
  ],
};
