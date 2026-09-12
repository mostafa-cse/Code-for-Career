import type { LocalLesson } from "@/lib/lessons-data";

export const stringsStringVsStringbuilderLesson: LocalLesson = {
  slug: "strings-string-vs-stringbuilder",
  titleEn: "String vs StringBuilder Performance",
  titleBn: "স্ট্রিং বনাম স্ট্রিংবিল্ডার পারফরম্যান্স তুলনা",
  categoryEn: "06. Strings",
  categoryBn: "০৬. স্ট্রিং ও টেক্সট প্রসেসিং",
  categoryDescEn:
    "Text processing in .NET: string immutability, string interning, StringBuilder buffer mechanics, and high-performance memory spans.",
  categoryDescBn:
    ".NET এ টেক্সট প্রসেসিং: স্ট্রিং অপরিবর্তনশীলতা (Immutability), স্ট্রিং ইন্টার্নিং, StringBuilder বাফার ও স্প্যান অপ্টিমাইজেশন।",
  categoryPriority: "CORE",
  descriptionEn:
    "Mathematical derivation of O(N^2) concatenation pitfalls, BenchmarkDotNet comparisons, modern C# 10 InterpolatedStringHandler, and decision matrix.",
  descriptionBn:
    "O(N^2) কনক্যাটেনেশন গাণিতিক ব্যাখ্যা, বেঞ্চমার্ক তুলনা, আধুনিক C# 10 ইন্টারপোলেটেড স্ট্রিং হ্যান্ডলার এবং সিদ্ধান্ত ম্যাট্রিক্স।",
  difficulty: "MEDIUM",
  displayOrder: 4,
  prerequisites: ["strings-stringbuilder"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# String vs StringBuilder Performance in C#

Choosing between \`string\` and \`StringBuilder\` is one of the most common architecture questions in .NET engineering interviews (Enosis Solutions, Therap Services, Brain Station 23).

Understanding the mathematical reasons behind the **quadratic $\\mathcal{O}(N^2)$ concatenation trap** enables developers to write memory-efficient code that avoids crippling Garbage Collection pauses.

---

## The Quadratic $\\mathcal{O}(N^2)$ Concatenation Trap

### What Happens During Repeated \`s += item\` in a Loop?

Consider this common anti-pattern:

\`\`\`csharp
string result = "";
for (int i = 0; i < N; i++)
{
    result += i.ToString(); // Allocates a new string and copies everything!
}
\`\`\`

At iteration $i$, the runtime must:
1. Allocate a **new string on the heap** of size $i$.
2. Copy all previous $i - 1$ characters into the new memory buffer.
3. Abandon the previous string as garbage on **Gen 0 of the Managed Heap**.

### Mathematical Derivation of Total Memory Allocated:
$$\\sum_{i=1}^N i = 1 + 2 + 3 + \\dots + N = \\frac{N(N + 1)}{2} \\approx \\frac{N^2}{2} \\text{ bytes}$$

| Loop Iterations ($N$) | Memory Allocated with \`string +=\` | Memory with \`StringBuilder\` | Time Difference |
|:---:|:---:|:---:|:---:|
| **10** | ~55 bytes | ~32 bytes | Negligible |
| **1,000** | ~500 KB | ~4 KB | 10x faster |
| **10,000** | ~50 MB | ~40 KB | **100x faster** |
| **100,000** | **~5 Gigabytes!** | **~400 KB** | **1,500x faster** |

For $N = 100,000$, using \`string +=\` allocates **5 Gigabytes of heap garbage**, triggering non-stop Gen 0/1/2 Garbage Collection pauses that freeze the application.

---

## Modern C# 10+ String Interpolation: \`DefaultInterpolatedStringHandler\`

A common misconception is: *"Always use StringBuilder, even for simple string joins."*

In modern C# 10+, formatted strings using interpolation (\`$\"{a} - {b}\"\`) are compiled using the **\`DefaultInterpolatedStringHandler\`** (a stack-allocated \`ref struct\`):

\`\`\`csharp
int orderId = 8402;
decimal amount = 99.95m;

// C# 10+ compiles this directly to a stack handler:
// 1. Pre-calculates exact buffer length
// 2. Writes primitives directly without boxing
// 3. Allocates ONLY the single final string!
string receipt = $"Order #{orderId} - Total: \${amount}";
\`\`\`

For a fixed number of elements (2 to 4 items), interpolated strings and \`string.Concat\` are **faster and use less memory than instantiating a StringBuilder**!

---

## Decision Matrix: Which String Strategy to Choose?

| Scenario | Recommended Approach | Reason |
|---|---|---|
| **2 to 4 known variables** | Interpolation: \`$\"{first} {last}\"\` | Compiler compiles to \`string.Concat\`; zero builder overhead. |
| **Collection with delimiter** | \`string.Join(",", items)\` | Internally optimized; avoids trailing comma logic. |
| **Loop with dynamic iterations** | \`StringBuilder\` (pre-sized) | Amortized $\\mathcal{O}(N)$ linked-chunk buffer growth. |
| **Large document (JSON/XML/SQL)** | \`StringBuilder\` | Handles thousands of multi-line appends cleanly. |
| **Parsing substrings without allocations**| \`ReadOnlySpan<char>\` | Zero heap allocations; operates directly on stack pointers. |

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #2 — Problem N (Numbers Histogram)
*Given a symbol $S$ and $N$ numbers. For each number $K$, print the symbol $S$ repeated $K$ times on a new line without quadratic concatenation overhead.*

#### Problem Analysis
- Input: A character $S$, count $N$ ($1 \\le N \\le 50$), followed by $N$ integers $K_i$ ($1 \\le K_i \\le 100$).
- Output: $N$ lines where the $i$-th line contains symbol $S$ repeated $K_i$ times.
- Efficiency: Using \`StringBuilder.Append(char, count)\` writes repeated characters in a single pass without generating intermediate string garbage.

#### C# Implementation

\`\`\`csharp
using System;
using System.Text;

public class NumbersHistogramSolution
{
    public static void Main()
    {
        string? symbolLine = Console.ReadLine();
        string? nLine = Console.ReadLine();
        string? numbersLine = Console.ReadLine();

        if (string.IsNullOrWhiteSpace(symbolLine) || 
            string.IsNullOrWhiteSpace(nLine) || 
            string.IsNullOrWhiteSpace(numbersLine)) return;

        char symbol = symbolLine.Trim()[0];
        string[] tokens = numbersLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Pre-size StringBuilder buffer to hold all characters plus newlines
        StringBuilder output = new StringBuilder(5000);

        foreach (string token in tokens)
        {
            if (int.TryParse(token, out int count))
            {
                // Appends symbol repeated count times in O(count) with zero intermediate strings
                output.Append(symbol, count).AppendLine();
            }
        }

        Console.Write(output.ToString());
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(\\sum K_i)$ — linear time relative to total printed characters.
- **Space Complexity**: $\\mathcal{O}(\\sum K_i)$ — single allocated buffer that is flushed to standard output in one operation.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem N: Numbers Histogram](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/N) | Easy | StringBuilder.Append(char, count), Linear Time |
| ⚪ | Codeforces Assiut | [Problem G: Conversion](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/G) | Easy | Case Inversion, Comma Space Substitution |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | StringBuilder vs String Transformation |
| ⚪ | Exercism C# | [Micro-blog](https://exercism.org/tracks/csharp/exercises/micro-blog) | Easy | Unicode Rune Slicing, String Limits |
`,

  contentBn: `# C# এ স্ট্রিং বনাম স্ট্রিংবিল্ডার পারফরম্যান্স তুলনা

সি# অ্যাপ্লিকেশন ডেভেলপমেন্ট ও টেকনিক্যাল ইন্টারভিউতে (যেমন Enosis, Therap, Brain Station 23) \`string\` বনাম \`StringBuilder\` এর তুলনামূলক বিশ্লেষণ অন্যতম মৌলিক একটি বিষয়।

লুপের ভেতর সাধারণ স্ট্রিং জোড়া লাগানোর ফলে যে **কোয়াড্রেটিক $\\mathcal{O}(N^2)$ মেমোরি ফাঁদ** তৈরি হয়, তার গাণিতিক ভিত্তি বোঝা অত্যন্ত গুরুত্বপূর্ণ।

---

## কোয়াড্রেটিক $\\mathcal{O}(N^2)$ মেমোরি ফাঁদের গাণিতিক ব্যাখ্যা

### লুপের ভেতর বারবার \`s += item\` করলে কী ঘটে?

\`\`\`csharp
string result = "";
for (int i = 0; i < N; i++)
{
    result += i.ToString(); // প্রতিবার নতুন স্ট্রিং তৈরি ও পুরনো ডাটা কপি!
}
\`\`\`

লুপের প্রতিটি $i$-তম পদক্ষেপে:
১. হিপ মেমরিতে $i$ সাইজের একটি **নতুন স্ট্রিং অবজেক্ট তৈরি হয়**।
২. পূর্বের সব $i - 1$ ক্যারেক্টার নতুন মেমোরিতে কপি করতে হয়।
৩. পুরনো স্ট্রিংটি ফেলে দেওয়া হয়, যা **Gen 0 হিপে আবর্জনা (Garbage)** হিসেবে জমা হয়।

### মোট মেমোরি বরাদ্দের গাণিতিক সমীকরণ:
$$\\sum_{i=1}^N i = 1 + 2 + 3 + \\dots + N = \\frac{N(N + 1)}{2} \\approx \\frac{N^2}{2} \\text{ বাইট}$$

| লুপের পুনরাবৃত্তি ($N$) | \`string +=\` দিয়ে মেমোরি খরচ | \`StringBuilder\` দিয়ে মেমোরি খরচ | পারফরম্যান্সের পার্থক্য |
|:---:|:---:|:---:|:---:|
| **১০** | ~৫৫ বাইট | ~৩২ বাইট | প্রায় সমান |
| **১,০০০** | ~৫০০ KB | ~৪ KB | ১০ গুণ দ্রুত |
| **১০,০০০** | ~৫০ MB | ~৪০ KB | **১০০ গুণ দ্রুত** |
| **১০০,০০০** | **~৫ গিগাবাইট!** | **~৪০০ KB** | **১,৫০০ গুণ দ্রুত** |

$N = ১০০,০০০$ হলে সাধারণ \`+=\` ব্যবহারে প্রায় **৫ গিগাবাইট অতিরিক্ত আবর্জনা হিপে তৈরি হয়**, যার ফলে ক্রমাগত গার্বেজ কালেকশন (GC Pauses) শুরু হয়ে পুরো অ্যাপ্লিকেশন হ্যাং হয়ে যায়।

---

## আধুনিক C# 10+ ইন্টারপোলেশন: \`DefaultInterpolatedStringHandler\`

একটি ভুল ধারণা হলো: *"ছোট-বড় সব ক্ষেত্রেই StringBuilder ব্যবহার করা ভালো।"*

আধুনিক সি# ১০-এ \`$\"{a} - {b}\"\` জাতীয় ইন্টারপোলেশন স্ট্যাক-অ্যালোকেটেড \`ref struct\` দ্বারা পরিচালিত হয়:

\`\`\`csharp
int orderId = 8402;
decimal amount = 99.95m;

// C# 10+ এটি সরাসরি স্ট্যাক হ্যান্ডলারের মাধ্যমে সম্পন্ন করে:
// ১. আগে থেকেই মোট দৈর্ঘ্য হিসাব করে
// ২. কোনো বক্সিং ছাড়া প্রিমিটিভ রাইট করে
// ৩. হিপে কেবলমাত্র চূড়ান্ত স্ট্রিংটি বরাদ্দ করে!
string receipt = $"Order #{orderId} - Total: \${amount}";
\`\`\`

তাই মাত্র ২ থেকে ৪টি চলক জোড়া লাগানোর ক্ষেত্রে ইন্টারপোলেশন বা \`string.Concat\` ব্যবহার করা \`StringBuilder\` তৈরি করার চেয়েও **দ্রুত এবং মেমোরি-সাশ্রয়ী**।

---

## সিদ্ধান্ত ম্যাট্রিক্স: কখন কোনটি ব্যবহার করবেন?

| পরিস্থিতি | সুপারিশকৃত পদ্ধতি | কারণ |
|---|---|---|
| **২ থেকে ৪টি নির্দিষ্ট ভ্যারিয়েবল** | ইন্টারপোলেশন: \`$\"{first} {last}\"\` | কম্পাইলার সরাসরি \`string.Concat\` এ রূপান্তর করে; কোনো বিল্ডার ওভারহেড নেই। |
| **নির্দিষ্ট চিহ্ন দিয়ে তালিকা জোড়া** | \`string.Join(",", items)\` | শেষ কমার ঝামেলা ছাড়া অপ্টিমাইজড পদ্ধতিতে জোড়া লাগে। |
| **অজানা বা গতিশীল সংখ্যক লুপ** | \`StringBuilder\` (সাইজ উল্লেখসহ) | লিংকড চাঙ্ক মডেলে লিনিয়ার $\\mathcal{O}(N)$ সময়ে বাফার বৃদ্ধি পায়। |
| **বড় ডকুমেন্ট (JSON/XML/SQL)** | \`StringBuilder\` | হাজার হাজার লাইন পরিচ্ছন্নভাবে অ্যাপেন্ড করা যায়। |
| **জিরো-অ্যালোকেশনে সাবস্ট্রিং পড়া** | \`ReadOnlySpan<char>\` | হিপে কোনো অবজেক্ট তৈরি না করে সরাসরি স্ট্যাক পয়েন্টারে কাজ করে। |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #২ — Problem N (Numbers Histogram)
*একটি প্রতীক $S$ এবং $N$ টি সংখ্যা দেওয়া থাকবে। প্রতিটি সংখ্যা $K$ এর জন্য $S$ প্রতীকটি $K$ বার প্রিন্ট করতে হবে।*

#### সমাধান বিশ্লেষণ
- \`StringBuilder.Append(symbol, count)\` ব্যবহার করে কোনো মধ্যবর্তী অস্থায়ী স্ট্রিং তৈরি না করেই লিনিয়ার সময়ে পুরো হিস্টোগ্রাম তৈরি করে একবারেই কনসোলে আউটপুট দেওয়া হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Text;

public class NumbersHistogramSolution
{
    public static void Main()
    {
        string? symbolLine = Console.ReadLine();
        string? nLine = Console.ReadLine();
        string? numbersLine = Console.ReadLine();

        if (string.IsNullOrWhiteSpace(symbolLine) || 
            string.IsNullOrWhiteSpace(nLine) || 
            string.IsNullOrWhiteSpace(numbersLine)) return;

        char symbol = symbolLine.Trim()[0];
        string[] tokens = numbersLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        StringBuilder output = new StringBuilder(5000);

        foreach (string token in tokens)
        {
            if (int.TryParse(token, out int count))
            {
                output.Append(symbol, count).AppendLine();
            }
        }

        Console.Write(output.ToString());
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(\\sum K_i)$ — মোট মুদ্রিত ক্যারেক্টারের সমান লিনিয়ার টাইম।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(\\sum K_i)$ — একক বাফার মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem N: Numbers Histogram](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/N) | Easy | StringBuilder.Append(char, count), Linear Time |
| ⚪ | Codeforces Assiut | [Problem G: Conversion](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/G) | Easy | Case Inversion, Comma Space Substitution |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | StringBuilder vs String Transformation |
| ⚪ | Exercism C# | [Micro-blog](https://exercism.org/tracks/csharp/exercises/micro-blog) | Easy | Unicode Rune Slicing, String Limits |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #2",
      name: "Problem N: Numbers Histogram",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219446/problem/N",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["StringBuilder", "Loops", "Performance"],
      solutionEn: "Use StringBuilder.Append(symbol, count) to generate repeated character sequences in linear time without GC pressure.",
      solutionBn: "মেমোরি অপচয় ছাড়া লিনিয়ার সময়ে পুনরাবৃত্ত প্রতীক প্রিন্ট করতে StringBuilder.Append(symbol, count) ব্যবহার করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #4",
      name: "Problem G: Conversion",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/G",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Strings", "Characters", "StringBuilder"],
      solutionEn: "Replace commas with spaces and invert lowercase/uppercase character casing in a single pass.",
      solutionBn: "একবার লুপ চালিয়ে কমার স্থানে স্পেস এবং বড় হাতের অক্ষরকে ছোট হাতে রূপান্তর করুন।",
    },
    {
      source: "Exercism C#",
      name: "Squeaky Clean",
      url: "https://exercism.org/tracks/csharp/exercises/squeaky-clean",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["StringBuilder", "Strings", "Transformations"],
      solutionEn: "Sanitize identifier strings using StringBuilder to avoid creating intermediate string objects in loops.",
      solutionBn: "লুপে অতিরিক্ত স্ট্রিং তৈরি পরিহার করতে StringBuilder দিয়ে টেক্সট ফিল্টারিং সম্পন্ন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Micro-blog",
      url: "https://exercism.org/tracks/csharp/exercises/micro-blog",
      difficulty: "EASY",
      company: "Kaz Software",
      tags: ["Strings", "Unicode", "Runes"],
      solutionEn: "Truncate text to at most 5 Unicode runes safely handling multi-byte UTF-16 surrogate pairs.",
      solutionBn: "মাল্টি-বাইট ইউনিকোড ক্যারেক্টার সঠিকভাবে হ্যান্ডেল করে সর্বোচ্চ ৫টি রুনে স্ট্রিং ট্রাঙ্কেট করুন।",
    },
  ],
};
