import type { LocalLesson } from "@/lib/lessons-data";

export const genericsMethodsLesson: LocalLesson = {
  slug: "generics-methods",
  titleEn: "Generic Methods",
  titleBn: "জেনেরিক মেথড ও টাইপ প্যারামিটার",
  categoryEn: "07. Generics",
  categoryBn: "০৭. জেনেরিকস (Generics)",
  categoryDescEn:
    "Type-safe abstraction in .NET: generic methods, reusable container classes, interface contracts, and compile-time constraints.",
  categoryDescBn:
    ".NET এ টাইপ-নিরাপদ অ্যাবস্ট্রাকশন: জেনেরিক মেথড, পুনঃব্যবহারযোগ্য ক্লাস ও ইন্টারফেস এবং কম্পাইল-টাইম কনস্ট্রেইন্ট।",
  categoryPriority: "CORE",
  descriptionEn:
    "Parameterized method logic, call-site type inference, JIT native code specialization for value types vs pointer sharing for reference types.",
  descriptionBn:
    "প্যারামিটারাইজড মেথড লজিক, টাইপ ইনফারেন্স, ভ্যালু টাইপের JIT স্পেশালাইজেশন বনাম রেফারেন্স টাইপের শেয়ার্ড কোড।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["methods-parameters", "types-boxing"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Generic Methods in C#

**Generic methods** are methods declared with **type parameters** (e.g. \`<T>\`). They allow software engineers to design algorithms that operate on any data type while guaranteeing **100% compile-time type safety, zero boxing overhead, and high runtime performance**.

Unlike object-based polymorphism (\`object obj\`), generics in C# are **reified at runtime** — the CLR preserves full type metadata throughout the entire execution pipeline.

---

## Under the Hood: JIT Code Generation & Specialization

How the .NET JIT compiler handles generic methods is one of the most prestigious interview questions at top software engineering firms (Enosis, Therap, Brain Station 23):

\`\`\`
                          Generic Method Call: Swap<T>(ref T a, ref T b)
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
         T is a VALUE TYPE (int, double)                T is a REFERENCE TYPE (string, User)
                       │                                               │
       JIT emits DEDICATED Machine Code                JIT SHARES a SINGLE Machine Code
     (Direct stack/register access; no boxing)      (All pointers are 8 bytes on 64-bit CLR)
\`\`\`

### 1. Value Types: Code Specialization
When you invoke \`Swap<int>\`, the JIT compiler produces a **distinct, specialized native machine code routine** tailored specifically for 4-byte integers. 
- Calling \`Swap<double>\` produces a second specialized machine code routine using 8-byte floating-point registers.
- **Zero boxing, zero heap allocations, and zero pointer indirection!**

### 2. Reference Types: Code Sharing
Because every reference type variable on a 64-bit architecture is simply an 8-byte pointer, the JIT compiler generates a **single, shared canonical native code body** for all reference types (\`Swap<string>\`, \`Swap<Customer>\`, \`Swap<object>\`).
- This prevents memory bloat while preserving exact runtime type safety through method table parameters.

### C# Reified Generics vs Java & C++
| Feature | .NET C# Generics | Java Generics | C++ Templates |
|---|---|---|---|
| **Runtime Mechanism** | **Reified** (Preserved at runtime) | **Type Erasure** (Erased to \`Object\`) | Compile-time Macro Expansion |
| **Value Type Performance** | Native specialized machine code (Zero boxing) | Forces boxing to wrapper (\`Integer\`) | Native specialized machine code |
| **Code Bloat** | Low (Reference types share code) | None (Single erased code) | High (Separate code for every type) |
| **Reflection on \`T\`** | Fully supported (\`typeof(T)\`) | Erased at runtime | Not applicable |

---

## Call-Site Type Inference

In most cases, the C# compiler can automatically infer the type argument from the method parameters, removing the need for verbose \`<T>\` syntax:

\`\`\`csharp
public static void Swap<T>(ref T first, ref T second)
{
    T temp = first;
    first = second;
    second = temp;
}

int a = 10, b = 20;
Swap(ref a, ref b); // Inferred as Swap<int>!

string s1 = "Alpha", s2 = "Beta";
Swap(ref s1, ref s2); // Inferred as Swap<string>!
\`\`\`

### When Type Inference Fails:
- **No arguments depend on \`T\`**: \`T result = Factory.Create<T>();\` (Cannot infer \`T\` from zero parameters).
- **Conflicting argument types**: \`Choose(10, 20.5);\` (Cannot decide between \`int\` and \`double\`; requires explicit \`Choose<double>(10, 20.5)\`).

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #5 — Problem E (Swap)
*Given two numbers $X$ and $Y$. Swap their values using a generic method and print the result.*

#### Problem Analysis
- Input: Two 64-bit integers $X$ and $Y$ on a single line separated by space.
- Logic: Swap the values of $X$ and $Y$ in place via reference parameters.
- Architecture: Implement a generic \`Swap<T>\` that operates without boxing or temporary heap allocations.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class GenericSwapSolution
{
    // Reusable, zero-boxing generic swap method
    public static void Swap<T>(ref T first, ref T second)
    {
        T temp = first;
        first = second;
        second = temp;
    }

    public static void Main()
    {
        string? line = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(line)) return;

        string[] tokens = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        long x = long.Parse(tokens[0], CultureInfo.InvariantCulture);
        long y = long.Parse(tokens[1], CultureInfo.InvariantCulture);

        // Compiler infers Swap<long> and executes specialized native machine code
        Swap(ref x, ref y);

        Console.WriteLine($"{x} {y}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$ — constant number of register/memory assignments.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary space — operates strictly on the thread execution stack.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem E: Swap](https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/E) | Easy | Generic Methods, ref Parameters, Type Inference |
| ⚪ | Codeforces Assiut | [Problem B: Print](https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/B) | Easy | Method Invocation, Linear Sequence Output |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | Generic Methods, Predicates, Lazy Iterators |
| ⚪ | Exercism C# | [Tree Building](https://exercism.org/tracks/csharp/exercises/tree-building) | Medium | Generic Nodes, Record Matching, Ordering |
`,

  contentBn: `# C# এ জেনেরিক মেথড ও টাইপ প্যারামিটার

**জেনেরিক মেথড (Generic Method)** হলো এমন মেথড যা নির্দিষ্ট কোনো ডেটা টাইপের ওপর সীমাবদ্ধ না থেকে **টাইপ প্যারামিটার (\`<T>\`)** ব্যবহার করে ঘোষিত হয়। এর মাধ্যমে সফটওয়্যার ইঞ্জিনিয়ারগণ এমন অ্যালগরিদম তৈরি করতে পারেন যা যেকোনো ডেটা টাইপের সাথে শতভাগ **কম্পাইল-টাইম টাইপ সেফটি ও জিরো-বক্সিং পারফরম্যান্সে** কাজ করতে সক্ষম।

সি# এর জেনেরিকস রানটাইমে সম্পূর্ণ টাইপ তথ্য বজায় রাখে (Reified Generics), যার ফলে জাভার মতো টাইপ ইরেজার (Type Erasure) সংক্রান্ত কোনো পারফরম্যান্স ক্ষতি সি# এ হয় না।

---

## CLR-এর অভ্যন্তরীণ মেকানিজম: JIT কোড জেনারেশন ও স্পেশালাইজেশন

টপ টেক কোম্পানিগুলোর (Enosis, Therap, Brain Station 23) ইন্টারভিউতে জেনেরিক মেথডের JIT মেকানিজম প্রায়ই জানতে চাওয়া হয়:

\`\`\`
                          Generic Method Call: Swap<T>(ref T a, ref T b)
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
         T হলো VALUE TYPE (int, double)                  T হলো REFERENCE TYPE (string, User)
                       │                                               │
       JIT নিবেদিত মেশিন কোড তৈরি করে                 JIT একটিমাত্র মেশিন কোড শেয়ার করে
    (সরাসরি রেজিস্টার/স্ট্যাক এক্সেস; কোনো বক্সিং নেই)     (৬৪-বিট আর্কিটেকচারে সব পয়েন্টারই ৮ বাইট)
\`\`\`

### ১. ভ্যালু টাইপ: কোড স্পেশালাইজেশন
যখন \`Swap<int>\` কল করা হয়, JIT কম্পাইলার ৪-বাইটের পূর্ণসংখ্যার জন্য একটি **স্বতন্ত্র নেটিভ মেশিন কোড** তৈরি করে।
- \`Swap<double>\` কল করলে ৮-বাইটের ফ্লোটিং পয়েন্ট রেজিস্টার ব্যবহার করে দ্বিতীয় একটি নেটিভ মেশিন কোড তৈরি হয়।
- **কোনো প্রকার বক্সিং ওভারহেড বা হিপ মেমোরি খরচ থাকে না!**

### ২. রেফারেন্স টাইপ: কোড শেয়ারিং
যেহেতু ৬৪-বিট সিস্টেমে সমস্ত রেফারেন্স টাইপ চলক মূলত ৮-বাইটের মেমোরি পয়েন্টার, তাই JIT কম্পাইলার সমস্ত রেফারেন্স টাইপের জন্য একটি একক মেশিন কোড শেয়ার করে মেমোরি অপচয় রোধ করে।

---

## কল-সাইট টাইপ ইনফারেন্স (Type Inference)

অধিকাংশ ক্ষেত্রে সি# কম্পাইলার মেথডের আর্গুমেন্ট দেখে স্বয়ংক্রিয়ভাবে টাইপ প্যারামিটার নির্ধারণ করে নিতে পারে:

\`\`\`csharp
public static void Swap<T>(ref T first, ref T second)
{
    T temp = first;
    first = second;
    second = temp;
}

int a = 10, b = 20;
Swap(ref a, ref b); // কম্পাইলার নিজে থেকেই Swap<int> নির্ধারণ করে!

string s1 = "Alpha", s2 = "Beta";
Swap(ref s1, ref s2); // স্বয়ংক্রিয়ভাবে Swap<string> নির্ধারিত হয়!
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #৫ — Problem E (Swap)
*দুটি সংখ্যা $X$ ও $Y$ ইনপুট নিয়ে একটি জেনেরিক সোয়াপ মেথড ব্যবহার করে তাদের মান অদলবদল করে প্রিন্ট করতে হবে।*

#### সমাধান বিশ্লেষণ
- \`ref T\` প্যারামিটার গ্রহণকারী একটি জেনেরিক মেথড ব্যবহার করা হয়েছে।
- JIT কম্পাইলার ۶۴-বিট পূর্ণসংখ্যার জন্য নিবেদিত মেশিন কোড তৈরি করে জিরো-বক্সিংয়ে সোয়াপ সম্পন্ন করে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class GenericSwapSolution
{
    public static void Swap<T>(ref T first, ref T second)
    {
        T temp = first;
        first = second;
        second = temp;
    }

    public static void Main()
    {
        string? line = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(line)) return;

        string[] tokens = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        long x = long.Parse(tokens[0], CultureInfo.InvariantCulture);
        long y = long.Parse(tokens[1], CultureInfo.InvariantCulture);

        Swap(ref x, ref y);

        Console.WriteLine($"{x} {y}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ — নির্দিষ্ট সংখ্যক মেমোরি অ্যাসাইনমেন্ট।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত স্পেস — সম্পূর্ণ গণনা স্ট্যাক মেমরিতে সীমাবদ্ধ।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem E: Swap](https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/E) | Easy | Generic Methods, ref Parameters, Type Inference |
| ⚪ | Codeforces Assiut | [Problem B: Print](https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/B) | Easy | Method Invocation, Linear Sequence Output |
| ⚪ | Exercism C# | [Strain](https://exercism.org/tracks/csharp/exercises/strain) | Medium | Generic Methods, Predicates, Lazy Iterators |
| ⚪ | Exercism C# | [Tree Building](https://exercism.org/tracks/csharp/exercises/tree-building) | Medium | Generic Nodes, Record Matching, Ordering |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #5",
      name: "Problem E: Swap",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/E",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Generics", "Methods", "Swap"],
      solutionEn: "Implement a generic swap method with ref T parameters to perform in-place value exchange.",
      solutionBn: "ref T প্যারামিটারযুক্ত জেনেরিক মেথড ব্যবহার করে মেমোরিতে সরাসরি মান অদলবদল করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #5",
      name: "Problem B: Print",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/223205/problem/B",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Methods", "Loops", "I/O"],
      solutionEn: "Print numbers from 1 to N separated by space using modular method design.",
      solutionBn: "মডুলার মেথড আর্কিটেকচারে ১ থেকে N পর্যন্ত সংখ্যা স্পেস দিয়ে প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Strain",
      url: "https://exercism.org/tracks/csharp/exercises/strain",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["Generics", "Predicates", "Yield"],
      solutionEn: "Implement generic Keep<T> and Discard<T> methods using predicate delegates and lazy enumeration.",
      solutionBn: "প্রেডিকেট ডেলিগেট ও লেজি এনুমারেশন ব্যবহার করে জেনেরিক Keep ও Discard ফিল্টারিং তৈরি করুন।",
    },
    {
      source: "Exercism C#",
      name: "Tree Building",
      url: "https://exercism.org/tracks/csharp/exercises/tree-building",
      difficulty: "MEDIUM",
      company: "Kaz Software",
      tags: ["Generics", "Trees", "Data Structures"],
      solutionEn: "Construct and validate hierarchical tree structures using generic node collections and sorted record records.",
      solutionBn: "জেনেরিক নোড কালেকশন ও সাজানো রেকর্ড ব্যবহার করে অনুক্রমিক ট্রি স্ট্রাকচার তৈরি করুন।",
    },
  ],
};
