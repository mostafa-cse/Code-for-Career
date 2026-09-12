import type { LocalLesson } from "@/lib/lessons-data";

export const nullablesCoalescingOperatorLesson: LocalLesson = {
  slug: "nullables-coalescing-operator",
  titleEn: "Null-Coalescing Operator (?? and ??=)",
  titleBn: "নাল-কোয়ালেসিং অপারেটর (?? এবং ??=)",
  categoryEn: "09. Nullable Types",
  categoryBn: "০৯. নালেবল টাইপ ও নাল-নিরাপত্তা",
  categoryDescEn:
    "Modern null-safety in C#: Nullable<T> structs, C# 8 Nullable Reference Types (NRT), null-coalescing, null-conditional, and null-forgiving operators.",
  categoryDescBn:
    "সি# এ আধুনিক নাল-নিরাপত্তা: Nullable<T> স্ট্রাক্ট, সি# ৮ নালেবল রেফারেন্স টাইপ (NRT), নাল-কোয়ালেসিং (??), নাল-কন্ডিশনাল (?.) ও নাল-ফরগিভিং (!) অপারেটর।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Default fallback resolution with ??, C# 8 compound assignment with ??=, short-circuit evaluation, type inference rules, and C# 7+ throw expressions.",
  descriptionBn:
    "?? দিয়ে ডিফল্ট মান রেজোলিউশন, সি# ৮ এর ??= কম্পাউন্ড অ্যাসাইনমেন্ট, শর্ট-সার্কিট মূল্যায়ন, টাইপ ইনফ্যারেন্স এবং থ্রো এক্সপ্রেশন।",
  difficulty: "EASY",
  displayOrder: 3,
  prerequisites: ["nullables-reference-types"],
  estimatedMinutes: 15,
  lastUpdated: "Recently updated",
  contentEn: `# Null-Coalescing Operator (?? and ??=) in C#

The **null-coalescing operator (\`??\`)** provides a concise, idiomatic syntax for fallback evaluation: it returns the value of its left-hand operand if it is not \`null\`; otherwise, it evaluates and returns the right-hand operand.

In C# 8.0, Microsoft introduced the **null-coalescing assignment operator (\`??=\`)**, which assigns the right-hand value to the left-hand variable only if that variable currently evaluates to \`null\`.

---

## Short-Circuit Evaluation & Order of Operations

The null-coalescing operator guarantees **strict short-circuit evaluation**:

1. The left-hand operand is evaluated exactly once.
2. If the left-hand operand evaluates to **non-null**, the right-hand operand is **never evaluated**.
3. If the left-hand operand evaluates to **null**, the right-hand operand is evaluated and returned.

\`\`\`csharp
// ExpensiveMethod() is NEVER called because cache is already populated!
string? cache = "Warm Cache";
string result = cache ?? FetchFromDatabaseExpensive();

private string FetchFromDatabaseExpensive()
{
    Console.WriteLine("Querying database...");
    return "Fresh Data";
}
\`\`\`

---

## Type Inference & Unification Rules

The resulting type of the expression \`a ?? b\` is determined by the C# compiler through type unification:

1. **Nullable Value Type + Underlying Type**:
   - If \`a\` is \`int?\` and \`b\` is \`int\`, the expression \`a ?? b\` yields a non-nullable \`int\`.
2. **Implicit Numeric Widening**:
   - If \`a\` is \`int?\` and \`b\` is \`long\`, the compiler widens the result to \`long\`:
   \`\`\`csharp
   int? count = null;
   long fallback = 100L;
   var unified = count ?? fallback; // Inferred as long
   \`\`\`
3. **Reference Types & Inheritance Hierarchies**:
   - If \`a\` is \`Dog\` and \`b\` is \`Cat\` (both inheriting from \`Animal\`), the compiler unifies the expression type to \`Animal\`.

---

## Multi-Tier Fallback Chaining

Multiple \`??\` operators can be chained sequentially to resolve configuration hierarchies (e.g. CLI Argument $\\rightarrow$ Environment Variable $\\rightarrow$ App Settings $\\rightarrow$ Hardcoded Default):

\`\`\`csharp
public static string ResolveConnectionString(
    string? cliArg, 
    string? envVar, 
    string? appSettings)
{
    // Evaluates from left to right, short-circuiting at the first non-null string
    return cliArg 
        ?? envVar 
        ?? appSettings 
        ?? "Server=localhost;Database=DefaultDb;Trusted_Connection=True;";
}
\`\`\`

---

## Throw Expressions with \`??\` (C# 7.0+)

Prior to C# 7.0, defensive argument checking required verbose statements. C# 7 introduced **throw expressions**, allowing exceptions to be thrown directly on the right-hand side of a null-coalescing operator:

\`\`\`csharp
public class OrderProcessor
{
    private readonly IInventoryRepository repository;
    private readonly ILogger logger;

    public OrderProcessor(IInventoryRepository? repo, ILogger? log)
    {
        // One-line null guard and assignment:
        this.repository = repo ?? throw new ArgumentNullException(nameof(repo));
        this.logger = log ?? throw new ArgumentNullException(nameof(log));
    }
}
\`\`\`

> **Modern .NET Note**: In .NET 6+, you can also write \`ArgumentNullException.ThrowIfNull(repo);\`. The \`?? throw\` syntax remains widely preferred when assigning into read-only fields or primary constructor parameters.

---

## Lazy Initialization with Compound Assignment (\`??=\`)

The \`??=\` operator provides the cleanest way to lazily instantiate expensive objects, lists, or cached dictionary lookups:

\`\`\`csharp
public class ReportGenerator
{
    private List<string>? cachedLines;

    public void AppendLine(string line)
    {
        // Instantiates a new List<string> ONLY if cachedLines is currently null
        cachedLines ??= new List<string>();
        cachedLines.Add(line);
    }
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem I (Welcome for you with Conditions)
*Given two numbers $A$ and $B$. Print \`Yes\` if $A$ is greater than or equal to $B$, otherwise print \`No\`. Incorporate fallback input handling for nullable or malformed data feeds.*

#### Algorithmic Analysis
1. Read the input line. If null, fallback safely using \`??\`.
2. Split the string into two tokens.
3. Parse the numbers $A$ and $B$.
4. Check if $A \\ge B$. If true, output \`Yes\`, else \`No\`.

#### C# Implementation

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        // Safe input reading with fallback
        string input = Console.ReadLine() ?? string.Empty;
        
        string[] parts = input.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 2)
        {
            return;
        }

        if (long.TryParse(parts[0], out long a) && long.TryParse(parts[1], out long b))
        {
            string verdict = (a >= b) ? "Yes" : "No";
            Console.WriteLine(verdict);
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, parsing two small integers and a constant number of character comparisons.
- **Space Complexity**: $\\mathcal{O}(1)$, limited to array splits containing two numeric string references.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Welcome for you with Conditions](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/I) | Easy | Relational comparison, Input fallback (\`??\`), Conditionals |
| ⚪ | Codeforces | [Assiut Sheet #1: Capital or Small or Digit](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/M) | Easy | Character ranges, ASCII validation, Fallback handling |
| ⚪ | Exercism C# | [Need for Speed](https://exercism.org/tracks/csharp/exercises/need-for-speed) | Medium | State mutation, Lazy initialization (\`??=\`), Class design |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | String sanitization, Null coalescing, StringBuilder |
`,

  contentBn: `# C# এ নাল-কোয়ালেসিং অপারেটর (?? এবং ??=)

**নাল-কোয়ালেসিং অপারেটর (\`??\`)** সি#-এ ডিফল্ট বা ফলব্যাক মান নির্ধারণের একটি সংক্ষিপ্ত ও মার্জিত উপায়। এটি বাম পাশের অপারেন্ডের মান \`null\` না হলে সরাসরি সেটি প্রদান করে; আর বাম পাশ \`null\` হলে ডান পাশের বিকল্প মানটি কার্যকর করে।

সি# ৮.০ সংস্করণে যুক্ত হওয়া **নাল-কোয়ালেসিং অ্যাসাইনমেন্ট অপারেটর (\`??=\`)** কোনো ভ্যারিয়েবলের বর্তমান মান কেবল \`null\` হলেই তাতে ডান পাশের নতুন মানটি অ্যাসাইন করে।

---

## শর্ট-সার্কিট মূল্যায়ন ও কার্যপ্রণালী

নাল-কোয়ালেসিং অপারেটর শতভাগ **শর্ট-সার্কিট মূল্যায়ন** নিশ্চিত করে:

১. বাম পাশের অপারেন্ডটি ঠিক একবার মূল্যায়ন করা হয়।
২. বাম পাশের মান যদি **নাল না হয়**, তবে ডান পাশের কোড **কখনোই রান করে না**।
৩. বাম পাশ কেবল **নাল হলেই** ডান পাশের এক্সপ্রেশন বা মেথড কল কার্যকর হয়।

\`\`\`csharp
// মেমোরিতে ক্যাশ থাকলে ডাটাবেজে কোনো রিকোয়েস্ট যাবে না!
string? cache = "Warm Cache";
string result = cache ?? FetchFromDatabaseExpensive();

private string FetchFromDatabaseExpensive()
{
    Console.WriteLine("ডাটাবেজ থেকে ডাটা আনা হচ্ছে...");
    return "Fresh Data";
}
\`\`\`

---

## টাইপ ইনফ্যারেন্স ও ইউনিফিকেশন নীতি

কম্পাইলার \`a ?? b\` এর ফলাফল কোন টাইপের হবে তা স্বয়ংক্রিয়ভাবে নির্ধারণ করে:

১. **নালেবল ভ্যালু টাইপ + বেস টাইপ**:
   - যদি \`a\` হয় \`int?\` এবং \`b\` হয় \`int\`, তবে \`a ?? b\` এর রিটার্ন টাইপ হবে নন-নালেবল \`int\`।
২. **স্বয়ংক্রিয় নিউমেরিক ওয়াইডেনিং**:
   - যদি \`a\` হয় \`int?\` এবং \`b\` হয় \`long\`, তবে পুরো এক্সপ্রেশনের ফলাফল হবে \`long\` টাইপ।
৩. **ইনহেরিটেন্স হায়ারার্কি**:
   - দুটি ভিন্ন চাইল্ড ক্লাস হলে কম্পাইলার তাদের সাধারণ প্যারেন্ট ক্লাসে ফলাফলকে ইউনিফাই করে।

---

## মাল্টি-টিয়ার ফলব্যাক চেইনিং

একাধিক \`??\` অপারেটর ক্রমান্বয়ে সাজিয়ে কনফিগারেশন প্রায়োরিটি সহজে সমাধান করা যায় (যেমন: সিএলআই কমান্ড $\\rightarrow$ এনভায়রনমেন্ট ভ্যারিয়েবল $\\rightarrow$ সেটিংস $\\rightarrow$ ডিফল্ট মান):

\`\`\`csharp
public static string ResolveConnectionString(
    string? cliArg, 
    string? envVar, 
    string? appSettings)
{
    return cliArg 
        ?? envVar 
        ?? appSettings 
        ?? "Server=localhost;Database=DefaultDb;Trusted_Connection=True;";
}
\`\`\`

---

## \`??\` এর সাথে থ্রো এক্সপ্রেশন (C# 7.0+)

সি# ৭-এর পূর্বে প্যারামিটার নাল চেক করতে ৩-৪ লাইনের \`if\` ব্লক লিখতে হতো। সি# ৭ এ যুক্ত হওয়া **Throw Expressions** এর মাধ্যমে এক লাইনে চেক ও ফিল্ড অ্যাসাইনমেন্ট সম্ভব:

\`\`\`csharp
public class OrderProcessor
{
    private readonly IInventoryRepository repository;
    private readonly ILogger logger;

    public OrderProcessor(IInventoryRepository? repo, ILogger? log)
    {
        // এক লাইনে নাল গার্ড এবং রিড-অনলি ফিল্ডে অ্যাসাইনমেন্ট
        this.repository = repo ?? throw new ArgumentNullException(nameof(repo));
        this.logger = log ?? throw new ArgumentNullException(nameof(log));
    }
}
\`\`\`

---

## \`??=\` দিয়ে লেজি ইনিশিয়ালাইজেশন

\`??=\` অপারেটরের সাহায্যে অবজেক্ট তৈরি বা কালেকশন ইনিশিয়ালাইজেশন অত্যন্ত পরিচ্ছন্নভাবে করা যায়:

\`\`\`csharp
public class ReportGenerator
{
    private List<string>? cachedLines;

    public void AppendLine(string line)
    {
        // কেবল cachedLines নাল থাকলেই নতুন লিস্ট তৈরি হবে
        cachedLines ??= new List<string>();
        cachedLines.Add(line);
    }
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem I (Welcome for you with Conditions)
*দুটি সংখ্যা $A$ এবং $B$ দেওয়া থাকবে। $A$ এর মান $B$ এর সমান বা বড় হলে \`Yes\` প্রিন্ট করুন, অন্যথায় \`No\` প্রিন্ট করুন। ইনপুট শূন্য বা নাল আসার ক্ষেত্রে \`??\` দিয়ে ফলব্যাক নিশ্চিত করুন।*

#### সমাধান বিশ্লেষণ
১. \`Console.ReadLine()\` থেকে আসা ইনপুট নাল হলে \`?? string.Empty\` দিয়ে ফাঁকা স্ট্রিং হিসেবে হ্যান্ডেল করা।
২. স্ট্রিং স্প্লিট করে দুটি সংখ্যা বের করা।
৩. $A \\ge B$ শর্ত যাচাই করে যথাক্রমে \`Yes\` বা \`No\` প্রিন্ট করা।

#### C# সমাধান

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string input = Console.ReadLine() ?? string.Empty;
        
        string[] parts = input.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 2)
        {
            return;
        }

        if (long.TryParse(parts[0], out long a) && long.TryParse(parts[1], out long b))
        {
            string verdict = (a >= b) ? "Yes" : "No";
            Console.WriteLine(verdict);
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, সংখ্যা দুটির তুলনা এবং শর্তাধীন আউটপুট কনস্ট্যান্ট সময়ে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, স্ট্যাকে সীমিত ভ্যারিয়েবল ব্যবহৃত হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Welcome for you with Conditions](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/I) | Easy | Relational comparison, Input fallback (\`??\`), Conditionals |
| ⚪ | Codeforces | [Assiut Sheet #1: Capital or Small or Digit](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/M) | Easy | Character ranges, ASCII validation, Fallback handling |
| ⚪ | Exercism C# | [Need for Speed](https://exercism.org/tracks/csharp/exercises/need-for-speed) | Medium | State mutation, Lazy initialization (\`??=\`), Class design |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | String sanitization, Null coalescing, StringBuilder |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Welcome for you with Conditions",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/I",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Conditionals", "Parsing", "Coalescing"],
      solutionEn:
        "Read input safely using the null-coalescing operator (??), parse numeric operands, and output 'Yes' or 'No' depending on whether A >= B.",
      solutionBn:
        "নাল-কোয়ালেসিং অপারেটর (??) দিয়ে নিরাপদ ইনপুট নিয়ে অপারেন্ড দুটি পার্স করুন এবং A >= B শর্তের ওপর ভিত্তি করে 'Yes' অথবা 'No' প্রিন্ট করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Capital or Small or Digit",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/M",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["ASCII", "Characters", "Conditionals"],
      solutionEn:
        "Classify a single character input as a digit, uppercase letter, or lowercase letter using ASCII range comparisons.",
      solutionBn:
        "ASCII রেঞ্জ তুলনার সাহায্যে একটি ক্যারেক্টার ডিজিট, বড় হাতের অক্ষর নাকি ছোট হাতের অক্ষর তা নির্ধারণ করে প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Need for Speed",
      url: "https://exercism.org/tracks/csharp/exercises/need-for-speed) ",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["OOP", "State", "Null-Coalescing"],
      solutionEn:
        "Model remote control cars and race tracks, lazily initializing battery depletion metrics and race distance tracking using ??=.",
      solutionBn:
        "রিমোট কন্ট্রোল কার ও রেস ট্র্যাক সিমুলেশনে ??= অপারেটরের সাহায্যে ব্যাটারি ক্ষয় ও ট্র্যাকের দূরত্ব লেজি ইনিশিয়ালাইজেশন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Squeaky Clean",
      url: "https://exercism.org/tracks/csharp/exercises/squeaky-clean",
      difficulty: "EASY",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Strings", "Sanitization", "Null-Safety"],
      solutionEn:
        "Sanitize identifier strings by converting spaces to underscores, transforming kebab-case to camelCase, and stripping control characters.",
      solutionBn:
        "আইডেন্টিফায়ার স্ট্রিং থেকে ফাঁকা স্থান আন্ডারস্কোরে রূপান্তর, কেবাব-কেস ক্যামেলকেসে রূপান্তর এবং কন্ট্রোল ক্যারেক্টার অপসারণ করুন।",
    },
  ],
};
