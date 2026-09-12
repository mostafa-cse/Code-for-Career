import type { LocalLesson } from "@/lib/lessons-data";

export const stringsMethodsLesson: LocalLesson = {
  slug: "strings-methods",
  titleEn: "String Methods & Manipulation",
  titleBn: "স্ট্রিং মেথড ও টেক্সট ম্যানিপুলেশন",
  categoryEn: "06. Strings",
  categoryBn: "০৬. স্ট্রিং ও টেক্সট প্রসেসিং",
  categoryDescEn:
    "Text processing in .NET: string immutability, string interning, StringBuilder buffer mechanics, and high-performance memory spans.",
  categoryDescBn:
    ".NET এ টেক্সট প্রসেসিং: স্ট্রিং অপরিবর্তনশীলতা (Immutability), স্ট্রিং ইন্টার্নিং, StringBuilder বাফার ও স্প্যান অপ্টিমাইজেশন।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Core string operations, Substring, Split, Replace, Trim, IndexOf, culture-sensitive vs ordinal comparisons, and ReadOnlySpan zero-allocation slicing.",
  descriptionBn:
    "মৌলিক স্ট্রিং অপারেশন, সাবস্ট্রিং, স্প্লিট, রিপ্লেস, ট্রিম, ইনডেক্স অনুসন্ধান, অর্ডিনাল তুলনা এবং স্প্যানের জিরো-অ্যালোকেশন স্লাইসিং।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["csharp-strings-syntax"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# String Methods & Text Manipulation in C#

In C#, \`string\` is a language alias for the .NET Common Type System class \`System.String\`. A string represents an **immutable, contiguous sequence of UTF-16 code units (\`char\`)**.

Because strings are immutable, any method that transforms a string (such as \`Replace\`, \`ToLower\`, or \`Substring\`) **never modifies the original instance**; instead, it allocates a **brand-new string on the managed heap**.

---

## Memory Layout of a String on the 64-Bit CLR

On a 64-bit machine, every \`System.String\` instance on the managed heap contains:
1. **SyncBlockIndex (8 bytes)**: Standard object header for locking and hashing.
2. **MethodTable Pointer (8 bytes)**: TypeHandle pointing to \`System.String\` metadata.
3. **Length (4 bytes)**: A 32-bit signed integer storing the character count (allowing $O(1)$ \`str.Length\` lookups).
4. **Character Buffer ($2 \\times L$ bytes)**: The raw UTF-16 character array.
5. **Null Terminator (2 bytes)**: A hidden trailing \`'\\0'\` character to enable fast zero-copy interop with native C/C++ APIs.

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                        Managed String on Heap                          │
├──────────────────────┬─────────────────────┬────────────┬──────────────┤
│ SyncBlock (8 bytes)  │ MethodTable (8 B)   │ Length (4B)│ UTF-16 Chars │
└──────────────────────┴─────────────────────┴────────────┴──────────────┘
\`\`\`

---

## Essential Built-in String Methods & Time Complexities

| Method | Description | Time Complexity | Allocates New String? |
|---|---|:---:|:---:|
| \`Length\` | Returns character count in UTF-16 units | $\\mathcal{O}(1)$ | No |
| \`s[index]\` | Retrieves the character at zero-based index | $\\mathcal{O}(1)$ | No |
| \`Substring(start, len)\` | Copies sub-sequence of length \`len\` | $\\mathcal{O}(len)$ | **Yes** (Heap allocation) |
| \`Split(delimiters)\` | Divides string into an array of tokens | $\\mathcal{O}(N)$ | **Yes** (Array + token strings) |
| \`Replace(oldStr, newStr)\` | Replaces occurrences of a pattern | $\\mathcal{O}(N)$ | **Yes** (Allocates new string) |
| \`Trim()\`, \`TrimStart/End()\` | Strips whitespace from ends | $\\mathcal{O}(N)$ | **Yes** (If whitespace stripped) |
| \`IndexOf(target)\` | Finds first occurrence index (or -1) | $\\mathcal{O}(N)$ | No |
| \`Contains(target)\` | Checks if substring exists | $\\mathcal{O}(N)$ | No |
| \`StartsWith / EndsWith\` | Checks prefix or suffix | $\\mathcal{O}(K)$ | No |

---

## The StringComparison Trap: Ordinal vs Culture

A primary interview question at top software companies (Enosis, Therap, Brain Station 23):

> **Never use default parameterless string comparisons for system or protocol operations!**

C#'s \`str.IndexOf("abc")\` or \`str.StartsWith("http")\` default to **Culture-Sensitive (Linguistic) Comparison** in older .NET versions, which is slow and can cause disastrous bugs (e.g., the Turkish \`i\` character mapping where \`"FILE".ToLower()\` produces \`"fıle"\` instead of \`"file"\`).

### The 3 Core Comparison Options:
1. **\`StringComparison.Ordinal\`**: Compares raw binary 16-bit byte values. **Fastest, SIMD-vectorized, and safe for URLs, file paths, JSON keys, and protocol headers**.
2. **\`StringComparison.OrdinalIgnoreCase\`**: Fast case-insensitive comparison using uppercase binary tables.
3. **\`StringComparison.CurrentCulture\` / \`InvariantCulture\`**: Follows regional linguistic grammar rules (use only when presenting sorted text to human users).

\`\`\`csharp
string path = "API/V1/USERS";

// ❌ Risky (culture dependent):
bool match1 = path.StartsWith("api/v1");

// ✅ Recommended (fast binary ordinal comparison):
bool match2 = path.StartsWith("api/v1", StringComparison.OrdinalIgnoreCase);
int index = path.IndexOf("USERS", StringComparison.Ordinal);
\`\`\`

---

## Modern High-Performance Slicing: \`ReadOnlySpan<char>\`

In high-throughput services, calling \`Substring\` repeatedly generates massive garbage on the heap. Modern C# provides **\`ReadOnlySpan<char>\`** to slice strings with **zero memory allocations**:

\`\`\`csharp
string payload = "ORDER_ID:94821;AMOUNT:1450.75";

// Substring allocates 2 separate strings on the heap:
string orderIdLegacy = payload.Substring(9, 5); // Allocates new string

// Zero-allocation slicing using Span:
ReadOnlySpan<char> span = payload.AsSpan();
ReadOnlySpan<char> orderIdSpan = span.Slice(9, 5); // Pure stack pointer! Zero heap allocation!

int orderId = int.Parse(orderIdSpan); // int.Parse supports ReadOnlySpan<char> in modern .NET
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #4 — Problem F (Way Too Long Words)
*Given a word. If its length is strictly greater than 10 characters, replace it with an abbreviation: the first character, followed by the count of characters between the first and last, followed by the last character. Otherwise, keep the word unchanged.*

#### Problem Analysis
- Input: An integer $T$ representing the number of test cases, followed by $T$ strings.
- Constraints: $1 \\le T \\le 100$, string length between 1 and 100.
- Logic:
  - If \`word.Length > 10\`: abbreviation is \`$\"{word[0]}{word.Length - 2}{word[word.Length - 1]}\"\`.
  - Else: print \`word\` directly.

#### C# Implementation

\`\`\`csharp
using System;

public class WayTooLongWordsSolution
{
    public static void Main()
    {
        string? tLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(tLine)) return;
        int t = int.Parse(tLine.Trim());

        while (t-- > 0)
        {
            string? word = Console.ReadLine();
            if (string.IsNullOrEmpty(word)) continue;
            word = word.Trim();

            if (word.Length > 10)
            {
                int internalCharCount = word.Length - 2;
                char firstChar = word[0];
                char lastChar = word[word.Length - 1];

                Console.WriteLine($"{firstChar}{internalCharCount}{lastChar}");
            }
            else
            {
                Console.WriteLine(word);
            }
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(L)$ per test case, where $L$ is the length of the word to inspect length and index boundary characters. Overall time for $T$ words is $\\mathcal{O}(T \\times L)$.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary space beyond input buffer storage.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem F: Way Too Long Words](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/F) | Easy | String Length, Indexing, Formatting |
| ⚪ | Codeforces Assiut | [Problem A: Create A New String](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/A) | Easy | String Length, Space Concatenation |
| ⚪ | Exercism C# | [Log Levels](https://exercism.org/tracks/csharp/exercises/log-levels) | Easy | Substring, IndexOf, Trim |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | Character Buffers, Index Traversal |
`,

  contentBn: `# C# এ স্ট্রিং মেথড ও টেক্সট ম্যানিপুলেশন

সি# এ \`string\` কি-ওয়ার্ডটি মূলত .NET কমন টাইপ সিস্টেমের \`System.String\` ক্লাসের একটি এলিয়াস। একটি স্ট্রিং হলো **UTF-16 কোড ইউনিটের (\`char\`) অপরিবর্তনশীল (Immutable) মেমোরি অনুক্রম**।

যেহেতু স্ট্রিং অপরিবর্তনশীল, তাই স্ট্রিং পরিবর্তনের যেকোনো মেথড (যেমন \`Replace\`, \`ToLower\`, বা \`Substring\`) **কখনোই মূল স্ট্রিংটিতে পরিবর্তন আনে না**; বরং ম্যানেজড হিপে **সম্পূর্ণ নতুন একটি স্ট্রিং বরাদ্দ করে**।

---

## ৬৪-বিট CLR-এ স্ট্রিংয়ের মেমোরি লেআউট

হিপ মেমরিতে প্রতিটি \`System.String\` অবজেক্ট নিচের উপাদানে গঠিত:
১. **SyncBlockIndex (৮ বাইট)**: থ্রেড লকিং ও হ্যাশিংয়ের জন্য।
২. **MethodTable Pointer (৮ বাইট)**: \`System.String\` ক্লাসের মেটাডাটা নির্দেশক।
৩. **Length (৪ বাইট)**: স্ট্রিংয়ে মোট কতটি অক্ষর আছে তা নির্দেশ করে (ফলে \`str.Length\` $O(1)$ টাইমে রিড করা যায়)।
৪. **Character Buffer ($2 \\times L$ বাইট)**: মূল UTF-16 ক্যারেক্টার ডেটা।
৫. **Null Terminator (২ বাইট)**: শেষে একটি অতিরিক্ত \`'\\0'\` ক্যারেক্টার থাকে, যাতে নেটিভ C/C++ কোডের সাথে দ্রুত ইন্টারপ করা যায়।

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                        Managed String on Heap                          │
├──────────────────────┬─────────────────────┬────────────┬──────────────┤
│ SyncBlock (৮ বাইট)   │ MethodTable (৮ B)   │ Length (৪B)│ UTF-16 Chars │
└──────────────────────┴─────────────────────┴────────────┴──────────────┘
\`\`\`

---

## প্রধান বিল্ট-ইন মেথড ও জটিলতা তালিকা

| মেথড | বিবরণ | টাইম কমপ্লেক্সিটি | নতুন স্ট্রিং তৈরি করে? |
|---|---|:---:|:---:|
| \`Length\` | ক্যারেক্টার সংখ্যা প্রদান করে | $\\mathcal{O}(1)$ | না |
| \`s[index]\` | নির্দিষ্ট ইনডেক্সের ক্যারেক্টার রিটার্ন করে | $\\mathcal{O}(1)$ | না |
| \`Substring(start, len)\` | নির্দিষ্ট অংশের সাবস্ট্রিং বের করে | $\\mathcal{O}(len)$ | **হ্যাঁ** (হিপ মেমোরি খরচ) |
| \`Split(delimiters)\` | স্ট্রিং ভেঙে টোকেন অ্যারে তৈরি করে | $\\mathcal{O}(N)$ | **হ্যাঁ** (অ্যারে ও টোকেন তৈরি হয়) |
| \`Replace(oldStr, newStr)\` | নির্দিষ্ট প্যাটার্ন প্রতিস্থাপন করে | $\\mathcal{O}(N)$ | **হ্যাঁ** (নতুন অবজেক্ট তৈরি হয়) |
| \`Trim()\`, \`TrimStart/End()\` | দুই প্রান্তের ফাঁকা স্পেস মুছে ফেলে | $\\mathcal{O}(N)$ | **হ্যাঁ** (স্পেস থাকলে নতুন স্ট্রিং) |
| \`IndexOf(target)\` | সাবস্ট্রিংয়ের প্রথম ইনডেক্স খুঁজে বের করে | $\\mathcal{O}(N)$ | না |
| \`Contains(target)\` | সাবস্ট্রিং উপস্থিত কি না যাচাই করে | $\\mathcal{O}(N)$ | না |
| \`StartsWith / EndsWith\` | শুরু বা শেষের প্যাটার্ন যাচাই করে | $\\mathcal{O}(K)$ | না |

---

## StringComparison এর ফাঁদ: Ordinal বনাম Culture

শীর্ষস্থানীয় সফটওয়্যার প্রতিষ্ঠানসমূহের (যেমন Enosis, Therap, Brain Station 23) টেকনিক্যাল ইন্টারভিউয়ের একটি জনপ্রিয় বিষয়:

> **সিস্টেম বা প্রোটোকল সম্পর্কিত কোনো অপারেশনে কখনোই প্যারামিটার ছাড়া ডিফল্ট স্ট্রিং মেথড ব্যবহার করবেন না!**

সি# এর \`str.IndexOf("abc")\` বা \`str.StartsWith("http")\` ডিফল্টভাবে কালচার-সংবেদনশীল (Linguistic) তুলনা ব্যবহার করে। এর ফলে আঞ্চলিক ব্যাকরণজনিত কারণে অনাকাঙ্ক্ষিত বাগ তৈরি হতে পারে (যেমন তার্কিশ \`i\` এর সমস্যা, যেখানে \`"FILE".ToLower()\` করলে \`"file"\` এর বদলে \`"fıle"\` হয়)।

### প্রধান ৩টি তুলনা পদ্ধতি:
১. **\`StringComparison.Ordinal\`**: সরাসরি বাইনারি ১৬-বিট মানের ভিত্তিতে তুলনা করে। **এটি সবচেয়ে দ্রুত, আধুনিক হার্ডওয়্যারে SIMD-ভেক্টরাইজড এবং ফাইল পাথ, URL, JSON কি ও প্রোটোকল হেডারের জন্য শতভাগ নির্ভরযোগ্য**।
২. **\`StringComparison.OrdinalIgnoreCase\`**: বাইনারি টেবিল ব্যবহার করে দ্রুত কেইস-ইনসেনসিটিভ তুলনা করে।
৩. **\`StringComparison.CurrentCulture\` / \`InvariantCulture\`**: মানব ভাষার ব্যাকরণ মেনে তুলনা করে (ব্যবহারকারীকে বর্ণানুক্রমিক তালিকা প্রদর্শনের জন্য উপযুক্ত)।

\`\`\`csharp
string path = "API/V1/USERS";

// ❌ ঝুঁকিপূর্ণ (কালচার নির্ভর):
bool match1 = path.StartsWith("api/v1");

// ✅ সঠিক ও দ্রুততম (বাইনারি অর্ডিনাল তুলনা):
bool match2 = path.StartsWith("api/v1", StringComparison.OrdinalIgnoreCase);
int index = path.IndexOf("USERS", StringComparison.Ordinal);
\`\`\`

---

## জিরো-অ্যালোকেশন স্লাইসিং: \`ReadOnlySpan<char>\`

উচ্চ কার্যক্ষমতাসম্পন্ন সিস্টেমে বারবার \`Substring\` কল করলে হিপ মেমরিতে অতিরিক্ত অবজেক্ট তৈরি হয়। আধুনিক সি# এ কোনো মেমোরি খরচ ছাড়া স্ট্রিং স্লাইস করার জন্য **\`ReadOnlySpan<char>\`** ব্যবহৃত হয়:

\`\`\`csharp
string payload = "ORDER_ID:94821;AMOUNT:1450.75";

// Substring হিপ মেমরিতে দুটি নতুন স্ট্রিং তৈরি করে:
string orderIdLegacy = payload.Substring(9, 5);

// Span ব্যবহার করে জিরো-অ্যালোকেশন স্লাইসিং:
ReadOnlySpan<char> span = payload.AsSpan();
ReadOnlySpan<char> orderIdSpan = span.Slice(9, 5); // শুধু স্ট্যাক পয়েন্টার! কোনো হিপ বরাদ্দ নেই!

int orderId = int.Parse(orderIdSpan); // আধুনিক .NET এ int.Parse সরাসরি স্প্যান গ্রহণ করতে পারে
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #৪ — Problem F (Way Too Long Words)
*একটি শব্দের দৈর্ঘ্য যদি ১০ অক্ষরের বেশি হয়, তবে প্রথম অক্ষর, মাঝের অক্ষরের সংখ্যা এবং শেষ অক্ষর দিয়ে শব্দটিকে সংক্ষেপ করতে হবে। অন্যথায় শব্দটি অপরিবর্তিত থাকবে।*

#### সমাধান বিশ্লেষণ
- শব্দের দৈর্ঘ্য যদি ১০ এর বেশি হয়: \`$\"{word[0]}{word.Length - 2}{word[word.Length - 1]}\"\` প্রিন্ট করা হয়েছে।
- অন্যথায় সরাসরি মূল শব্দটি প্রিন্ট করা হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;

public class WayTooLongWordsSolution
{
    public static void Main()
    {
        string? tLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(tLine)) return;
        int t = int.Parse(tLine.Trim());

        while (t-- > 0)
        {
            string? word = Console.ReadLine();
            if (string.IsNullOrEmpty(word)) continue;
            word = word.Trim();

            if (word.Length > 10)
            {
                int internalCharCount = word.Length - 2;
                char firstChar = word[0];
                char lastChar = word[word.Length - 1];

                Console.WriteLine($"{firstChar}{internalCharCount}{lastChar}");
            }
            else
            {
                Console.WriteLine(word);
            }
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(L)$ প্রতি টেস্ট কেস, যেখানে $L$ হলো শব্দের দৈর্ঘ্য। $T$ টি টেস্ট কেসের জন্য মোট সময় $\\mathcal{O}(T \\times L)$।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত স্পেস।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem F: Way Too Long Words](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/F) | Easy | String Length, Indexing, Formatting |
| ⚪ | Codeforces Assiut | [Problem A: Create A New String](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/A) | Easy | String Length, Space Concatenation |
| ⚪ | Exercism C# | [Log Levels](https://exercism.org/tracks/csharp/exercises/log-levels) | Easy | Substring, IndexOf, Trim |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | Character Buffers, Index Traversal |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #4",
      name: "Problem F: Way Too Long Words",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/F",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Strings", "Basics", "Length"],
      solutionEn: "Inspect string length, extract first and last characters via indexing, and output abbreviated counts for words > 10 chars.",
      solutionBn: "১০ অক্ষরের চেয়ে বড় শব্দের ক্ষেত্রে ইনডেক্সিং দিয়ে প্রথম ও শেষ অক্ষর এবং মাঝের দৈর্ঘ্য ফরম্যাট করে আউটপুট দিন।",
    },
    {
      source: "Codeforces Assiut Sheet #4",
      name: "Problem A: Create A New String",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/A",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Strings", "Length", "Concatenation"],
      solutionEn: "Print lengths of two input strings followed by their space-separated concatenation.",
      solutionBn: "দুটি স্ট্রিংয়ের দৈর্ঘ্য এবং স্পেস দিয়ে আলাদা করে তাদের সংযুক্তিকরণ প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Log Levels",
      url: "https://exercism.org/tracks/csharp/exercises/log-levels",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Strings", "Substring", "Trim"],
      solutionEn: "Parse log severity and message components using IndexOf, Substring, and Trim.",
      solutionBn: "IndexOf, Substring এবং Trim মেথডের সাহায্যে লগ মেসেজ থেকে সেভিয়ারিটি ও বার্তা আলাদা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Reverse String",
      url: "https://exercism.org/tracks/csharp/exercises/reverse-string",
      difficulty: "EASY",
      company: "Kaz Software",
      tags: ["Strings", "Two Pointers", "Buffers"],
      solutionEn: "Reverse a string by allocating a character array and swapping characters from opposite ends.",
      solutionBn: "ক্যারেক্টার অ্যারে ব্যবহার করে দুই প্রান্ত থেকে অক্ষর অদলবদল করে স্ট্রিং রিভার্স করুন।",
    },
  ],
};
