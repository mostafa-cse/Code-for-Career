import type { LocalLesson } from "@/lib/lessons-data";

export const methodsOptionalParametersLesson: LocalLesson = {
    slug: "methods-optional-parameters",
    titleEn: "Optional & Named Parameters",
    titleBn: "ঐচ্ছিক ও নেমড প্যারামিটার",
    categoryEn: "04. Methods",
    categoryBn: "০৪. মেথড ও ফাংশন",
    categoryDescEn:
      "Reusable function architecture in C#: parameter evaluation, passing semantics (by-value vs by-reference), overloading, and modern params features.",
    categoryDescBn:
      "সি# এ ফাংশন ও মেথড আর্কিটেকচার: প্যারামিটার মূল্যায়ন, ভ্যালু বনাম রেফারেন্স পাসিং, ওভারলোডিং এবং মডার্ন প্যারামস।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Default parameter values, compile-time inlining gotchas, named arguments readability, DLL versioning hazards, and API design.",
    descriptionBn:
      "ডিফল্ট প্যারামিটার মান, কম্পাইল-টাইম ইনলাইনিং সতর্কতা, নেমড আর্গুমেন্ট, ডিএলএল ভার্সনিং ঝুঁকি এবং এপিআই ডিজাইন।",
    difficulty: "EASY",
    displayOrder: 7,
    prerequisites: ["methods-parameters"],
    estimatedMinutes: 25,
    lastUpdated: "Recently updated",
    contentEn: `# Optional & Named Parameters in C#

Optional parameters allow callers to omit arguments when invoking a method, automatically falling back to a **default compile-time constant value**. Named arguments allow specifying arguments by name rather than position, improving clarity and enabling selective overrides.

---

## 1. Syntax Rules & Positional Constraints

1. **Trailing Placement**: All optional parameters **must follow all required parameters** in the parameter list:
   \`\`\`csharp
   // ✅ VALID: Required first, optional last
   public void Connect(string host, int port = 8080, int timeoutMs = 5000) { }

   // ❌ COMPILE ERROR CS1737: Optional parameters cannot precede required ones
   // public void Connect(int port = 8080, string host) { }
   \`\`\`
2. **Compile-Time Constant Requirement**: The default value must be a compile-time constant: literals (\`10\`, \`"test"\`), \`const\` fields, \`default\`, \`null\`, or a parameterless \`new struct()\`.

---

## 2. The Inlining Trap: DLL Versioning Hazard

When a caller invokes a method and omits an optional parameter:
\`\`\`csharp
public class ServiceClient
{
    // Defined in Library.dll (Version 1.0)
    public static void Request(string endpoint, int timeoutSeconds = 30) { /* ... */ }
}
\`\`\`

The calling application compiles the call \`ServiceClient.Request("api/data")\` by **inlining the literal value 30 directly into its own compiled IL code**:
\`\`\`csharp
// The caller's IL literally becomes:
ServiceClient.Request("api/data", 30);
\`\`\`

> **Critical Software Architecture Pitfall**:
> If \`Library.dll\` is updated to Version 2.0 with \`timeoutSeconds = 60\`, but the calling application is **not recompiled**, the caller will **still pass 30**!
> **Best Practice**: For public APIs shared across DLL boundaries, prefer **method overloading** over optional parameters to guarantee binary backward compatibility.

---

## 3. Named Arguments: Readability & Freedom of Order

Named arguments allow callers to identify arguments by the parameter's name:

### A. Eliminating "Boolean Blindness"
\`\`\`csharp
// Unclear: What do true and false mean?
CreateAccount("John", true, false);

// Crystal clear: Self-documenting code
CreateAccount("John", sendWelcomeEmail: true, isTrial: false);
\`\`\`

### B. Arbitrary Ordering
Named arguments can be specified in any order:
\`\`\`csharp
ConfigureServer(port: 443, host: "auth.example.com", enableSsl: true);
\`\`\`

### C. Selective Optional Overrides
You can skip intermediate optional parameters and specify only the one you need:
\`\`\`csharp
public void ExportData(string path, string format = "JSON", bool compress = false, int retries = 3) { }

// Omits 'format' and 'compress', overriding only 'retries'
ExportData("/data/output", retries: 5);
\`\`\`

---

## 4. Comparison: Optional Parameters vs Overloads

| Metric | Optional Parameters | Method Overloading |
|---|---|---|
| **Code Verbosity** | Single method declaration | Multiple method declarations |
| **Call-site Inlining** | Default values hardcoded in caller IL | Caller invokes specific method token |
| **Binary Evolution** | Risky across external assemblies | **Completely safe across external assemblies** |
| **API Intelligibility** | Clean for internal private helpers | Cleanest for public SDK surfaces |

---

## Practical Problem Walkthrough

### Problem: Formatted Print with Optional Separator
*Source: Codeforces Assiut University Training Sheet #5 — Problem B (Print)*

**Problem Statement**:
Given a number $N$. Print numbers from $1$ to $N$ separated by spaces. Implement the printing via a modular function that accepts an optional separator string defaulting to a single space.

**Constraints**:
$1 \\le N \\le 1000$.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    // Modular method with optional parameter
    public static void PrintNumbers(int n, string separator = " ")
    {
        for (int i = 1; i <= n; i++)
        {
            Console.Write(i);
            if (i < n)
            {
                Console.Write(separator);
            }
        }
        Console.WriteLine();
    }

    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());

        // Invoked using the default optional separator
        PrintNumbers(n);
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N)$ — prints numbers $1$ to $N$ sequentially.
- **Space Complexity**: $O(1)$ — constant memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem B: Print](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/B) | Easy | Optional parameters, Separation |
| ⚪ | Exercism C# | [Log Levels](https://exercism.org/tracks/csharp/exercises/log-levels) | Easy | Optional string parsing, Formatting |
| ⚪ | Exercism C# | [Booking up to go](https://exercism.org/tracks/csharp/exercises/booking-up-for-beauty) | Easy | Named arguments, Date helpers |
| ⚪ | Codeforces Assiut | [Problem K: Shift Right](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/K) | Easy | Array manipulation, Shift methods |
`,

    contentBn: `# C# এ ঐচ্ছিক ও নেমড প্যারামিটার

ঐচ্ছিক প্যারামিটার (Optional Parameters) মেথড কল করার সময় আর্গুমেন্ট বাদ দেওয়ার স্বাধীনতা দেয়, যেখানে স্বয়ংক্রিয়ভাবে একটি **ডিফল্ট কম্পাইল-টাইম কনস্ট্যান্ট মান** বসে যায়। আর নেমড আর্গুমেন্ট (Named Arguments) আর্গুমেন্টের অবস্থানের পরিবর্তে প্যারামিটারের নাম উল্লেখ করে মান প্রেরণের সুবিধা দেয়।

---

## ১. সিনট্যাক্স ও ব্যবহারের নিয়মাবলী

১. **সর্বশেষে অবস্থান**: সমস্ত ঐচ্ছিক প্যারামিটারকে অবশ্যই বাধ্যতামূলক প্যারামিটারসমূহের **পরে** রাখতে হবে:
   \`\`\`csharp
   // ✅ সঠিক: বাধ্যতামূলক আগে, ঐচ্ছিক পরে
   public void Connect(string host, int port = 8080, int timeoutMs = 5000) { }

   // ❌ কম্পাইল এরর CS1737: ঐচ্ছিক প্যারামিটার আগে বসতে পারে না
   // public void Connect(int port = 8080, string host) { }
   \`\`\`
২. **কম্পাইল-টাইম কনস্ট্যান্ট আবশ্যক**: ডিফল্ট মান অবশ্যই কম্পাইল সময়ে নির্ধারিত হতে হবে (যেমন: \`10\`, \`"test"\`, \`default\`, বা \`null\`)।

---

## ২. কম্পাইল-টাইম ইনলাইনিং ও ডিএলএল ভার্সনিং ঝুঁকি

যখন কোনো কলার মেথড কল করে ঐচ্ছিক আর্গুমেন্ট প্রদান করে না:
\`\`\`csharp
public static void Request(string endpoint, int timeoutSeconds = 30) { }
\`\`\`

সি# কম্পাইলার কলারের নিজের কম্পাইল করা কোডে (IL) ডিফল্ট মান \`30\` সরাসরি **হার্ডকোড করে বসিয়ে দেয়**:
\`\`\`csharp
// কলারের কোড বাস্তবে রূপ নেয়:
Request("api/data", 30);
\`\`\`

> **সফটওয়্যার আর্কিটেকচার সতর্কতা**:
> আপনি যদি পরবর্তীতে লাইব্রেরি আপডেট করে \`timeoutSeconds = 60\` করেন, কিন্তু কলার অ্যাপ্লিকেশনটি রি-কম্পাইল না করেন, তবে কলার **আগের \`30\` মানই পাঠাতে থাকবে**!
> **উত্তম চর্চা**: পাবলিক এপিআই বা লাইব্রেরির ক্ষেত্রে অপশনাল প্যারামিটারের চেয়ে **মেথড ওভারলোডিং** ব্যবহার করা অনেক বেশি নিরাপদ।

---

## ৩. নেমড আর্গুমেন্টের ব্যবহারিক সুবিধা

প্যারামিটারের নাম উল্লেখ করে মান পাঠানো কোডের পাঠযোগ্যতা কয়েকগুণ বাড়িয়ে দেয়:

### ক. বুলিয়ান দ্বিধা দূর করা (Self-Documenting Code)
\`\`\`csharp
// অস্পষ্ট: true এবং false কী বোঝাচ্ছে?
CreateAccount("John", true, false);

// অত্যন্ত স্পষ্ট:
CreateAccount("John", sendWelcomeEmail: true, isTrial: false);
\`\`\`

### খ. ইচ্ছামতো ক্রমে আর্গুমেন্ট পাঠানো
\`\`\`csharp
ConfigureServer(port: 443, host: "auth.example.com", enableSsl: true);
\`\`\`

### গ. মাঝখানের অপশনাল প্যারামিটার স্কিপ করা
\`\`\`csharp
public void ExportData(string path, string format = "JSON", bool compress = false, int retries = 3) { }

// format ও compress স্কিপ করে সরাসরি retries পরিবর্তন
ExportData("/data/output", retries: 5);
\`\`\`

---

## ৪. তুলনামূলক সারণী: অপশনাল প্যারামিটার বনাম ওভারলোডিং

| মানদণ্ড | ঐচ্ছিক প্যারামিটার | মেথড ওভারলোডিং |
|---|---|---|
| **কোড ভলিউম** | একটিমাত্র মেথড ডিক্লারেশন | একাধিক মেথড লিখতে হয় |
| **কম্পাইলার আচরণ** | কলারের কোডে ডিফল্ট মান ইনলাইন হয় | কলার নির্দিষ্ট মেথড টোকেন কল করে |
| **বাইনারি পরিবর্তন** | বহিরাগত লাইব্রেরির ক্ষেত্রে ঝুঁকিপূর্ণ | **বাইনারি পরিবর্তনের ক্ষেত্রে সম্পূর্ণ নিরাপদ** |
| **ডকুমেন্টেশন** | একটি কমেন্ট শেয়ার হয় | প্রতিটি মেথডে আলাদা XML কমেন্ট থাকে |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ঐচ্ছিক সেপারেটর দিয়ে সংখ্যা প্রিন্ট (Print)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৫ — Problem B*

**সমস্যা পরিচিতি**:
$N$ সংখ্যাটি দেওয়া থাকবে। $1$ থেকে $N$ পর্যন্ত সংখ্যাগুলো স্পেস দিয়ে প্রিন্ট করুন। একটি মডুলার ফাংশন ব্যবহার করুন যাতে ঐচ্ছিক সেপারেটর প্যারামিটার থাকে যার ডিফল্ট মান একটি স্পেস (" ")।

**সীমাবদ্ধতা**:
$1 \\le N \\le 1000$।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    // ঐচ্ছিক প্যারামিটারযুক্ত মডুলার মেথড
    public static void PrintNumbers(int n, string separator = " ")
    {
        for (int i = 1; i <= n; i++)
        {
            Console.Write(i);
            if (i < n)
            {
                Console.Write(separator);
            }
        }
        Console.WriteLine();
    }

    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());

        // ডিফল্ট সেপারেটর দিয়ে মেথড কল
        PrintNumbers(n);
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N)$ — ১ থেকে $N$ পর্যন্ত ক্রমানুসারে প্রিন্ট।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ — ধ্রুবক মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem B: Print](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/B) | Easy | Optional parameters, Separation |
| ⚪ | Exercism C# | [Log Levels](https://exercism.org/tracks/csharp/exercises/log-levels) | Easy | Optional string parsing, Formatting |
| ⚪ | Exercism C# | [Booking up to go](https://exercism.org/tracks/csharp/exercises/booking-up-for-beauty) | Easy | Named arguments, Date helpers |
| ⚪ | Codeforces Assiut | [Problem K: Shift Right](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/K) | Easy | Array manipulation, Shift methods |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem B: Print",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/B",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Methods", "Optional Parameters"],
        solutionEn: "Print integers up to N with an optional separator parameter.",
        solutionBn: "ঐচ্ছিক সেপারেটর প্যারামিটার দিয়ে N পর্যন্ত সংখ্যা প্রিন্ট করুন।",
      },
      {
        source: "Exercism C#",
        name: "Log Levels",
        url: "https://exercism.org/tracks/csharp/exercises/log-levels",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "Strings", "Named Arguments"],
        solutionEn: "Format log lines and extract level indicators cleanly.",
        solutionBn: "লগ লাইন ফরম্যাট করে লেভেল টেক্সট আলাদা করার মেথড লিখুন।",
      },
      {
        source: "Exercism C#",
        name: "Booking up to go",
        url: "https://exercism.org/tracks/csharp/exercises/booking-up-for-beauty",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "Named Arguments", "DateTime"],
        solutionEn: "Parse appointment dates using helper functions with named arguments for clarity.",
        solutionBn: "নেমড আর্গুমেন্ট ব্যবহার করে তারিখ সংক্রান্ত মেথড কল করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem K: Shift Right",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/K",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Methods", "Arrays", "Shift"],
        solutionEn: "Rotate an array to the right by X positions using modular functions.",
        solutionBn: "মেথড তৈরি করে অ্যারের উপাদানসমূহকে ডানদিকে X ঘর স্থানান্তর করুন।",
      },
    ],
  };
