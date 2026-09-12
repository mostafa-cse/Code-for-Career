import type { LocalLesson } from "@/lib/lessons-data";

export const stringsImmutabilityLesson: LocalLesson = {
  slug: "strings-immutability",
  titleEn: "String Immutability & Interning",
  titleBn: "স্ট্রিং অপরিবর্তনশীলতা ও ইন্টার্নিং পুল",
  categoryEn: "06. Strings",
  categoryBn: "০৬. স্ট্রিং ও টেক্সট প্রসেসিং",
  categoryDescEn:
    "Text processing in .NET: string immutability, string interning, StringBuilder buffer mechanics, and high-performance memory spans.",
  categoryDescBn:
    ".NET এ টেক্সট প্রসেসিং: স্ট্রিং অপরিবর্তনশীলতা (Immutability), স্ট্রিং ইন্টার্নিং, StringBuilder বাফার ও স্প্যান অপ্টিমাইজেশন।",
  categoryPriority: "CORE",
  descriptionEn:
    "Why strings are immutable in C#, thread safety, hash code stability, the CLR string interning pool, string.IsInterned, and memory leak risks.",
  descriptionBn:
    "সি# এ স্ট্রিং কেন অপরিবর্তনশীল, থ্রেড নিরাপত্তা, হ্যাশকোড স্থায়িত্ব, CLR স্ট্রিং ইন্টার্নিং পুল এবং মেমোরি লিকের ঝুঁকি।",
  difficulty: "MEDIUM",
  displayOrder: 2,
  prerequisites: ["strings-methods"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# String Immutability & Interning in C#

In .NET, strings are strictly **immutable**. Once a \`System.String\` object is allocated on the managed heap, its length and character sequence **can never be modified**.

Any operation that appears to mutate a string (such as \`str += "abc"\` or \`str.ToUpper()\`) actually allocates a **brand-new string on the heap**, leaving the original string untouched.

---

## The Architectural Reasons for Immutability

Why did the designers of .NET make strings immutable?

### 1. Thread Safety without Locking
Because string contents can never change, multiple threads can concurrently read, search, and pass the same string instance with **zero synchronization overhead** and zero risk of data races.

### 2. Hash Code Stability
If a string were mutable, changing its characters while it resides in a \`Dictionary<string, User>\` or \`HashSet<string>\` would alter its hash code. The collection would lose track of the key, resulting in silent data corruption. Because strings are immutable, \`GetHashCode()\` is deterministic and stable forever.

### 3. Security & Trust Boundaries
Sensitive data (such as file paths, database connection strings, security tokens, and permission names) cannot be secretly hijacked by untrusted code through reference aliasing.

### 4. Memory Optimization via String Interning
Immutability allows the CLR to safely deduplicate identical string literals across the entire application.

---

## The CLR String Interning Pool

The Common Language Runtime maintains a centralized, internal hash table called the **String Interning Pool** (located at the \`AppDomain\` level):

- When an assembly is loaded, the JIT compiler scans the metadata and adds every **literal string** (e.g. \`"Dhaka"\`) to the intern pool.
- Any code referencing the same string literal receives a reference to the **exact same heap memory address**:

\`\`\`csharp
string city1 = "Dhaka";
string city2 = "Dhaka";

// True: Both point to the exact same 8-byte pointer in the Intern Pool!
Console.WriteLine(object.ReferenceEquals(city1, city2)); // True
\`\`\`

### Dynamic Strings vs Literal Strings
Strings generated dynamically at runtime (via \`Console.ReadLine()\`, \`new string(chars)\`, or reading from a database) are **NOT interned automatically**:

\`\`\`csharp
string literal = "Bangladesh";
string dynamicStr = new string(new char[] { 'B','a','n','g','l','a','d','e','s','h' });

Console.WriteLine(literal == dynamicStr);                    // True (Value equality)
Console.WriteLine(object.ReferenceEquals(literal, dynamicStr)); // False (Separate heap objects!)
\`\`\`

---

## Manual Interning: \`string.Intern\` & \`string.IsInterned\`

.NET provides APIs to interact with the runtime intern pool:

\`\`\`csharp
string dynamicWord = GetUserInput();

// 1. Check if string is already interned without adding it:
string? existingInterned = string.IsInterned(dynamicWord);

// 2. Explicitly add to pool (or get existing reference):
string pooledWord = string.Intern(dynamicWord);
\`\`\`

> ⚠️ **The Critical Memory Leak Warning**:
> The String Interning Pool has an **application-lifetime scope** — strings added to the intern pool are **NEVER collected by the Garbage Collector** until the process terminates! Calling \`string.Intern()\` on unbounded user inputs (such as web requests, user comments, or UUIDs) creates an unrecoverable **memory leak**.

---

## The Danger of Unsafe String Mutation

Using C# \`unsafe\` pointers, it is technically possible to mutate string memory directly. Doing so corrupts the intern pool and creates catastrophic side effects across the entire application:

\`\`\`csharp
// DANGEROUS ANTI-PATTERN: NEVER DO THIS IN PRODUCTION
unsafe
{
    string constant = "HELLO";
    fixed (char* ptr = constant)
    {
        ptr[0] = 'J'; // Mutating interned memory!
    }
}

// Now every "HELLO" literal in the entire application prints "JELLO"!
Console.WriteLine("HELLO"); // Prints "JELLO"!
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #4 — Problem I (Palindrome)
*Given a string $S$. Determine whether $S$ is a palindrome (reads the same forwards and backwards).*

#### Problem Analysis
- Input: String $S$ ($1 \\le |S| \\le 1000$).
- Key Constraint: Memory and speed efficiency.
- Because strings are immutable, we can inspect characters from both ends using two pointers without allocating any temporary strings or reverse arrays.

#### C# Implementation

\`\`\`csharp
using System;

public class PalindromeSolution
{
    public static void Main()
    {
        string? line = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(line)) return;
        string s = line.Trim();

        int left = 0;
        int right = s.Length - 1;
        bool isPalindrome = true;

        // Two-pointer comparison: read-only access to immutable string characters
        while (left < right)
        {
            if (s[left] != s[right])
            {
                isPalindrome = false;
                break;
            }
            left++;
            right--;
        }

        Console.WriteLine(isPalindrome ? "YES" : "NO");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$ — at most $N/2$ character comparisons.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary space — zero heap string allocations during the verification.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem I: Palindrome](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/I) | Easy | Two Pointers, In-Place Inspection |
| ⚪ | Codeforces Assiut | [Problem B: Let's use Getline](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/B) | Easy | Delimiter Slicing, Character Scan |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | In-Place Inversion, Immutability |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | Immutability, Mutable StringBuilder |
`,

  contentBn: `# C# এ স্ট্রিং অপরিবর্তনশীলতা ও ইন্টার্নিং পুল

.NET এ স্ট্রিং সম্পূর্ণ **অপরিবর্তনশীল (Immutable)**। একবার ম্যানেজড হিপে কোনো \`System.String\` অবজেক্ট তৈরি হওয়ার পর এর দৈর্ঘ্য বা ক্যারেক্টার সিকোয়েন্স **কখনোই পরিবর্তন করা যায় না**।

স্ট্রিংয়ের ওপর যেকোনো পরিবর্তনশীল অপারেশন (যেমন \`str += "abc"\` বা \`str.ToUpper()\`) মূলত মূল স্ট্রিংটিতে কোনো হাত দেয় না; বরং হিপে **সম্পূর্ণ নতুন একটি স্ট্রিং বরাদ্দ করে**।

---

## স্ট্রিং অপরিবর্তনশীল হওয়ার ৪টি প্রধান কারণ

.NET এর আর্কিটেক্টগণ কেন স্ট্রিংকে অপরিবর্তনীয় করেছেন?

### ১. লকিং ছাড়া থ্রেড নিরাপত্তা (Thread Safety)
যেহেতু স্ট্রিংয়ের ভিতরের মান কখনোই বদলায় না, তাই একাধিক থ্রেড কোনো মিউটেক্স বা \`lock\` ছাড়াই একই স্ট্রিং পড়তে পারে। এতে কোনো ডেটা রেস বা কনকারেন্সি ক্র্যাশ ঘটে না।

### ২. হ্যাশ কোডের স্থায়িত্ব (Hash Code Stability)
যদি স্ট্রিং পরিবর্তনশীল হতো, তবে কোনো \`Dictionary<string, User>\` বা \`HashSet<string>\`-এ কি হিসেবে রাখার পর মান বদলে গেলে তার হ্যাশ কোড বদলে যেত। এর ফলে কালেকশন থেকে অবজেক্টটি আর খুঁজে পাওয়া যেত না। অপরিবর্তনীয় হওয়ায় স্ট্রিংয়ের \`GetHashCode()\` আজীবন অপরিবর্তিত থাকে।

### ৩. নিরাপত্তা ও অথেনটিকেশন (Security)
ডাটাবেস কানেকশন স্ট্রিং, ফাইল পাথ, ইউজার টোকেন এবং পারমিশনের নাম অপরিবর্তনীয় হওয়ায় কোনো বহিরাগত বা অসৎ কোড রেফারেন্সের মাধ্যমে গোপনে ডেটা পরিবর্তন করতে পারে না।

### ৪. স্ট্রিং ইন্টার্নিংয়ের মাধ্যমে মেমোরি সাশ্রয়
অপরিবর্তনীয় হওয়ার ফলেই CLR সম্পূর্ণ অ্যাপ্লিকেশনে একই লিটারাল স্ট্রিংয়ের একটিমাত্র কপি শেয়ার করতে পারে।

---

## CLR স্ট্রিং ইন্টার্নিং পুল (String Interning Pool)

কমন ল্যাঙ্গুয়েজ রানটাইম (CLR) \`AppDomain\` পর্যায়ে একটি অভ্যন্তরীণ হ্যাশ টেবিল বজায় রাখে যা **স্ট্রিং ইন্টার্নিং পুল** নামে পরিচিত:

- অ্যাপ্লিকেশন লোড হওয়ার সময় JIT কম্পাইলার মেটাডাটা স্ক্যান করে সকল **লিটারাল স্ট্রিং** (যেমন \`"Dhaka"\`) ইন্টার্নিং পুলে যুক্ত করে।
- কোডের ভিন্ন ভিন্ন অংশে একই লিটারাল ব্যবহৃত হলে তারা হিপে **হুবহু একই ৮-বাইটের মেমোরি পয়েন্টার** শেয়ার করে:

\`\`\`csharp
string city1 = "Dhaka";
string city2 = "Dhaka";

// True: উভয়েই ইন্টার্নিং পুলের একই মেমোরি অ্যাড্রেস নির্দেশ করে!
Console.WriteLine(object.ReferenceEquals(city1, city2)); // True
\`\`\`

### ডায়নামিক স্ট্রিং বনাম লিটারাল স্ট্রিং
রানটাইমে ডায়নামিকভাবে তৈরি হওয়া স্ট্রিং (যেমন \`Console.ReadLine()\`, \`new string(chars)\` বা ডাটাবেস থেকে পড়া টেক্সট) **স্বয়ংক্রিয়ভাবে ইন্টার্নিং পুলে যুক্ত হয় না**:

\`\`\`csharp
string literal = "Bangladesh";
string dynamicStr = new string(new char[] { 'B','a','n','g','l','a','d','e','s','h' });

Console.WriteLine(literal == dynamicStr);                    // True (মান হিসেবে সমান)
Console.WriteLine(object.ReferenceEquals(literal, dynamicStr)); // False (হিপে দুটি আলাদা অবজেক্ট!)
\`\`\`

---

## ম্যানুয়াল ইন্টার্নিং: \`string.Intern\` ও \`string.IsInterned\`

\`\`\`csharp
string dynamicWord = Console.ReadLine() ?? "";

// ১. স্ট্রিংটি পুলে আছে কি না যাচাই করা (না থাকলে যুক্ত করবে না):
string? existing = string.IsInterned(dynamicWord);

// ২. সরাসরি পুলে যুক্ত করা (অথবা পুলে থাকা রেফারেন্স ফিরিয়ে দেওয়া):
string pooled = string.Intern(dynamicWord);
\`\`\`

> ⚠️ **মারাত্মক মেমোরি লিকের সতর্কতা**:
> স্ট্রিং ইন্টার্নিং পুলের জীবনকাল পুরো অ্যাপ্লিকেশন প্রসেসের সমান। অর্থাৎ ইন্টার্ন করা স্ট্রিং **কখনোই গার্বেজ কালেক্টর (GC) দ্বারা মুক্ত হয় না**। ব্যবহারকারীর ইনপুট বা রিকোয়েস্ট আইডিতে \`string.Intern()\` কল করলে স্থায়ী মেমোরি লিক সৃষ্টি হবে!

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #৪ — Problem I (Palindrome)
*একটি স্ট্রিং $S$ প্যালিনড্রোম কি না (সামনে ও পেছন থেকে একই পড়া যায় কি না) তা যাচাই করতে হবে।*

#### সমাধান বিশ্লেষণ
- স্ট্রিং অপরিবর্তনীয় হওয়ায় কোনো অতিরিক্ত রিভার্স স্ট্রিং তৈরি না করেই দুটি পয়েন্টার (শুরু ও শেষ) দিয়ে অক্ষর মিলিয়ে $O(N)$ সময়ে যাচাই সম্পন্ন হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;

public class PalindromeSolution
{
    public static void Main()
    {
        string? line = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(line)) return;
        string s = line.Trim();

        int left = 0;
        int right = s.Length - 1;
        bool isPalindrome = true;

        while (left < right)
        {
            if (s[left] != s[right])
            {
                isPalindrome = false;
                break;
            }
            left++;
            right--;
        }

        Console.WriteLine(isPalindrome ? "YES" : "NO");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$ — সর্বোচ্চ $N/2$ বার ক্যারেক্টার তুলনা।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত স্পেস — কোনো নতুন স্ট্রিং তৈরি না করায় হিপ মেমোরি খরচ শূন্য।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem I: Palindrome](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/I) | Easy | Two Pointers, In-Place Inspection |
| ⚪ | Codeforces Assiut | [Problem B: Let's use Getline](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/B) | Easy | Delimiter Slicing, Character Scan |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | In-Place Inversion, Immutability |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | Immutability, Mutable StringBuilder |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #4",
      name: "Problem I: Palindrome",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/I",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Strings", "Immutability", "Two Pointers"],
      solutionEn: "Use two pointers from both ends of the immutable string to check palindrome symmetry without allocating memory.",
      solutionBn: "মেমোরি বরাদ্দ না করে অপরিবর্তনশীল স্ট্রিংয়ের দুই প্রান্ত থেকে পয়েন্টার চালিয়ে প্যালিনড্রোম যাচাই করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #4",
      name: "Problem B: Let's use Getline",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/B",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Strings", "Substring", "Parsing"],
      solutionEn: "Scan input until backslash delimiter and print the prefix using linear character inspection.",
      solutionBn: "ব্যাকস্ল্যাশ চিহ্নিতকারী পর্যন্ত স্ক্যান করে স্ট্রিংয়ের প্রথমাংশ প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Reverse String",
      url: "https://exercism.org/tracks/csharp/exercises/reverse-string",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Strings", "Immutability", "Buffers"],
      solutionEn: "Invert character sequence using a mutable char array and convert once to an immutable string.",
      solutionBn: "মিউটেবল ক্যারেক্টার অ্যারেতে অক্ষরগুলো উল্টে একবারের জন্য অপরিবর্তনীয় স্ট্রিং তৈরি করুন।",
    },
    {
      source: "Exercism C#",
      name: "Squeaky Clean",
      url: "https://exercism.org/tracks/csharp/exercises/squeaky-clean",
      difficulty: "EASY",
      company: "Kaz Software",
      tags: ["Strings", "StringBuilder", "Transforms"],
      solutionEn: "Filter and transform string identifiers using mutable string building techniques.",
      solutionBn: "মিউটেবল বাফার ব্যবহার করে স্ট্রিংয়ের অপ্রয়োজনীয় ক্যারেক্টার ফিল্টার ও ট্রান্সফর্ম করুন।",
    },
  ],
};
