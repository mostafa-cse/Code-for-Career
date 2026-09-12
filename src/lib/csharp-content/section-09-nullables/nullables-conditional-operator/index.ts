import type { LocalLesson } from "@/lib/lessons-data";

export const nullablesConditionalOperatorLesson: LocalLesson = {
  slug: "nullables-conditional-operator",
  titleEn: "Null-Conditional Operator (?.)",
  titleBn: "নাল-কন্ডিশনাল অপারেটর (?.) ও এলভিস অপারেটর",
  categoryEn: "09. Nullable Types",
  categoryBn: "০৯. নালেবল টাইপ ও নাল-নিরাপত্তা",
  categoryDescEn:
    "Modern null-safety in C#: Nullable<T> structs, C# 8 Nullable Reference Types (NRT), null-coalescing, null-conditional, and null-forgiving operators.",
  categoryDescBn:
    "সি# এ আধুনিক নাল-নিরাপত্তা: Nullable<T> স্ট্রাক্ট, সি# ৮ নালেবল রেফারেন্স টাইপ (NRT), নাল-কোয়ালেসিং (??), নাল-কন্ডিশনাল (?.) ও নাল-ফরগিভিং (!) অপারেটর।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Safe member navigation with ?. and ?[], short-circuiting chains, thread-safe event invocation, value type wrapping (T?), and combining with ??.",
  descriptionBn:
    "?. ও ?[] দিয়ে নিরাপদ মেম্বার এক্সেস, চেইনিং শর্ট-সার্কিট, থ্রেড-সেফ ইভেন্ট ইনভোকেশন, ভ্যালু টাইপ র‍্যাপিং (T?) এবং ?? এর সাথে ব্যবহার।",
  difficulty: "EASY",
  displayOrder: 4,
  prerequisites: ["nullables-coalescing-operator"],
  estimatedMinutes: 15,
  lastUpdated: "Recently updated",
  contentEn: `# Null-Conditional Operator (?.) in C#

The **null-conditional operator (\`?.\` for members, \`?[]\` for indexers)**—colloquially known as the "Elvis operator"—applies member access, method invocation, or element retrieval to its target only if that target evaluates to non-null; otherwise, the entire expression short-circuits and evaluates to \`null\`.

---

## Type Transformation Rules: Automatic Value Wrapping

A pivotal architectural aspect of \`?.\` is how the compiler modifies the expression's return type:

1. **Accessing a Reference Type**:
   - If the property is a reference type (e.g. \`string\`), the expression returns a nullable reference type (\`string?\`).
2. **Accessing a Value Type**:
   - If the accessed member is a value type (e.g. \`int\`, \`DateTime\`, \`decimal\`), the compiler **automatically wraps the result in a Nullable Value Type (\`T?\`)**:
   \`\`\`csharp
   public class Employee
   {
       public int Age { get; set; } = 30;
   }

   Employee? emp = GetCurrentEmployee();
   int? age = emp?.Age; // Inferred as Nullable<int>, NOT plain int!
   \`\`\`

> **Compiler Guard CS0266**:
> \`\`\`csharp
> bool? isActive = user?.IsActive;
> // if (isActive) // ERROR CS0266: Cannot implicitly convert 'bool?' to 'bool'
> 
> // Correct idiom:
> if (isActive == true) { /* ... */ }
> // Or with fallback:
> if (user?.IsActive ?? false) { /* ... */ }
> \`\`\`

---

## Short-Circuiting Mechanics Across Call Chains

When navigating deeply nested object graphs, the compiler evaluates each target expression **exactly once** and caches it in a temporary variable:

\`\`\`csharp
string? zipCode = order?.Customer?.BillingAddress?.ZipCode;
\`\`\`

- If \`order\` is null $\\rightarrow$ stops immediately, returns \`null\`.
- If \`order\` is valid but \`Customer\` is null $\\rightarrow$ stops immediately, returns \`null\`.
- If any link in the chain is null, **no subsequent getters, indexers, or methods are executed**, completely eliminating the risk of a \`NullReferenceException\`.

---

## Thread-Safe Delegate & Event Invocation

Prior to C# 6, invoking an event or delegate in a multi-threaded application was susceptible to subtle race conditions:

\`\`\`csharp
// HAZARDOUS IN MULTITHREADED CODE (Pre-C# 6):
if (OnStatusChanged != null)
{
    // A subscriber on another thread could unsubscribe right here!
    OnStatusChanged(this, EventArgs.Empty); // Throws NullReferenceException!
}

// OLD WORKAROUND:
var handler = OnStatusChanged;
if (handler != null)
{
    handler(this, EventArgs.Empty);
}
\`\`\`

### The Modern C# 6+ Thread-Safe Idiom:
\`\`\`csharp
OnStatusChanged?.Invoke(this, EventArgs.Empty);
\`\`\`
The compiler copies \`OnStatusChanged\` into a local stack variable before performing the null check, guaranteeing **atomic, thread-safe execution** even if other threads unsubscribe concurrently.

---

## Idiomatic Combination: \`?.\` with \`??\`

Pairing safe navigation (\`?.\`) with the null-coalescing fallback (\`??\`) represents the most widespread defensive programming pattern in modern C#:

\`\`\`csharp
public string GetCustomerCity(Order? order)
{
    // Safely navigates 3 levels deep, falling back to "Unknown" if any level is null
    return order?.Customer?.Address?.City ?? "Unknown City";
}

public int GetOrderItemsCount(Order? order)
{
    // Safely reads collection Count, falling back to 0
    return order?.LineItems?.Count ?? 0;
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem S (Interval)
*Given a number $X$. Determine which of the following intervals $X$ belongs to:*
- $[0, 25]$
- $(25, 50]$
- $(50, 75]$
- $(75, 100]$
*If $X$ does not belong to any of these intervals, print \`Out of Intervals\`. Incorporate safe range parsing.*

#### Algorithmic Analysis
1. Read input string safely; if empty or null, terminate gracefully.
2. Parse number as a double.
3. Test interval boundaries sequentially.
4. Output the matching interval or the fallback message.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class Program
{
    public static void Main()
    {
        string? rawInput = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(rawInput))
        {
            return;
        }

        if (double.TryParse(rawInput.Trim(), NumberStyles.Float, CultureInfo.InvariantCulture, out double x))
        {
            string interval = ClassifyInterval(x) ?? "Out of Intervals";
            Console.WriteLine(interval);
        }
    }

    public static string? ClassifyInterval(double value)
    {
        if (value >= 0.0 && value <= 25.0)
        {
            return "Interval [0,25]";
        }
        if (value > 25.0 && value <= 50.0)
        {
            return "Interval (25,50]";
        }
        if (value > 50.0 && value <= 75.0)
        {
            return "Interval (50,75]";
        }
        if (value > 75.0 && value <= 100.0)
        {
            return "Interval (75,100]";
        }

        return null; // Out of valid intervals
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, interval comparison involves a constant number of floating-point checks.
- **Space Complexity**: $\\mathcal{O}(1)$, all calculations occur in registers and stack frames.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Interval](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/S) | Easy | Range checking, Nullable return methods, Fallbacks |
| ⚪ | Codeforces | [Assiut Sheet #1: Sort Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T) | Easy | Sorting values, Array navigation, Preservation of order |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Easy | Interface navigation, Safe indexing (\`?[]\`), Object polymorphism |
| ⚪ | Exercism C# | [Secure Muncle](https://exercism.org/tracks/csharp/exercises/secure-muncle) | Medium | Nested navigation (\`?.\`), Security attributes, Null-safety |
`,

  contentBn: `# C# এ নাল-কন্ডিশনাল অপারেটর (?.) ও এলভিস অপারেটর

**নাল-কন্ডিশনাল অপারেটর (\`?.\` অবজেক্টের জন্য এবং \`?[]\` ইনডেক্সারের জন্য)**—যা প্রোগ্রামিং দুনিয়ায় এলভিস (Elvis) অপারেটর নামেও পরিচিত—কোনো অবজেক্ট নাল না হলেই কেবল তার প্রোপার্টি, মেথড বা ইনডেক্সারে এক্সেস করে। অবজেক্টের মান \`null\` হলে সম্পূর্ণ এক্সপ্রেশনটি শর্ট-সার্কিট হয়ে ফলাফল হিসেবে \`null\` প্রদান করে।

---

## টাইপ রূপান্তরের নিয়ম: ভ্যালু টাইপের স্বয়ংক্রিয় র‍্যাপিং

\`?.\` ব্যবহারের ফলে সি# কম্পাইলার রিটার্ন টাইপটিকে স্বয়ংক্রিয়ভাবে সুরক্ষিত করে:

১. **রেফারেন্স টাইপ মেম্বার**:
   - অবজেক্টের প্রোপার্টি যদি রেফারেন্স টাইপ হয় (যেমন \`string\`), ফলাফল হবে নালেবল রেফারেন্স \`string?\`।
২. **ভ্যালু টাইপ মেম্বার**:
   - যদি প্রোপার্টিটি কোনো সাধারণ ভ্যালু টাইপ হয় (যেমন \`int\`, \`bool\`, \`DateTime\`), তবে কম্পাইলার সেটিকে **স্বয়ংক্রিয়ভাবে নালেবল ভ্যালু টাইপে (\`T?\`) রূপান্তর করে**:
   \`\`\`csharp
   public class Employee
   {
       public int Age { get; set; } = 30;
   }

   Employee? emp = GetCurrentEmployee();
   int? age = emp?.Age; // সাধারণ int নয়, এটি Nullable<int>!
   \`\`\`

> **কম্পাইলার সতর্কতা CS0266**:
> \`\`\`csharp
> bool? isActive = user?.IsActive;
> // if (isActive) // কম্পাইলার এরর! bool? সরাসরি if শর্তে ব্যবহার করা যায় না।
> 
> // সঠিক উপায়:
> if (isActive == true) { /* ... */ }
> // অথবা ফলব্যাক দিয়ে:
> if (user?.IsActive ?? false) { /* ... */ }
> \`\`\`

---

## কল চেইনে শর্ট-সার্কিট মেকানিজম

নেস্টেড অবজেক্ট নেভিগেশনে কম্পাইলার প্রতিটি লেভেল একবার মূল্যায়ন করে ক্যাশ করে নেয়:

\`\`\`csharp
string? zipCode = order?.Customer?.BillingAddress?.ZipCode;
\`\`\`

- যদি \`order\` নাল হয় $\\rightarrow$ সাথে সাথে থেমে গিয়ে \`null\` রিটার্ন করে।
- যদি \`Customer\` নাল হয় $\\rightarrow$ সাথে সাথে এক্সিকিউশন বন্ধ হয়ে যায়।
- এর ফলে চেইনের মাঝামাঝি কোনো অবজেক্ট নাল থাকলেও কোড ক্র্যাশ করে না এবং কোনো \`NullReferenceException\` ঘটে না।

---

## থ্রেড-সেফ ডেলিগেট ও ইভেন্ট ইনভোকেশন

সি# ৬ এর পূর্বে মাল্টি-থ্রেডেড অ্যাপ্লিকেশনে ইভেন্ট কল করার সময় রেস কন্ডিশনের মারাত্মক ঝুঁকি থাকত:

\`\`\`csharp
// সি# ৬ এর পূর্বে বিপজ্জনক পদ্ধতি:
if (OnStatusChanged != null)
{
    // এই মুহূর্তে অন্য কোনো থ্রেড আনসাবস্ক্রাইব করলে OnStatusChanged নাল হয়ে ক্র্যাশ করবে!
    OnStatusChanged(this, EventArgs.Empty);
}

// পুরনো সমাধান:
var handler = OnStatusChanged;
if (handler != null)
{
    handler(this, EventArgs.Empty);
}
\`\`\`

### আধুনিক থ্রেড-নিরাপদ পদ্ধতি:
\`\`\`csharp
OnStatusChanged?.Invoke(this, EventArgs.Empty);
\`\`\`
কম্পাইলার ইভেন্টের রেফারেন্সটি প্রথমে স্ট্যাকের একটি লোকাল ভ্যারিয়েবলে কপি করে নেয়, যার ফলে অন্য থ্রেড একই সময়ে আনসাবস্ক্রাইব করলেও কোনো ক্র্যাশ ঘটে না।

---

## আদর্শ কম্বিনেশন: \`?.\` এবং \`??\`

নিরাপদ নেভিগেশনের পর ডিফল্ট ফলব্যাক মান নির্ধারণের জন্য \`?.\` এবং \`??\` একত্রে ব্যবহার করা আধুনিক সি# কোডের সেরা প্র্যাকটিস:

\`\`\`csharp
public string GetCustomerCity(Order? order)
{
    // ৩ স্তর ভেতরে গিয়ে ডাটা আনে, ফাঁকা থাকলে "Unknown City" দেয়
    return order?.Customer?.Address?.City ?? "Unknown City";
}

public int GetOrderItemsCount(Order? order)
{
    // লিস্ট না থাকলে ক্র্যাশ না করে 0 দেয়
    return order?.LineItems?.Count ?? 0;
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem S (Interval)
*একটি সংখ্যা $X$ দেওয়া থাকবে। এটি নিচের কোন সীমার মধ্যে পড়ে তা নির্ণয় করতে হবে:*
- $[0, 25]$
- $(25, 50]$
- $(50, 75]$
- $(75, 100]$
*কোনো সীমার ভেতরে না থাকলে \`Out of Intervals\` প্রিন্ট করতে হবে।*

#### সমাধান বিশ্লেষণ
১. কনসোল থেকে ইনপুট নিয়ে ডাবল টাইপে পার্স করা।
২. শর্তাধীন মেথডের মাধ্যমে সংশ্লিষ্ট সীমার স্ট্রিং রিটার্ন করা, সীমার বাইরে হলে \`null\` রিটার্ন করা।
৩. \`??\` অপারেটরের সাহায্যে নাল রিটার্নের ক্ষেত্রে \`Out of Intervals\` নিশ্চিত করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Globalization;

public class Program
{
    public static void Main()
    {
        string? rawInput = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(rawInput))
        {
            return;
        }

        if (double.TryParse(rawInput.Trim(), NumberStyles.Float, CultureInfo.InvariantCulture, out double x))
        {
            string interval = ClassifyInterval(x) ?? "Out of Intervals";
            Console.WriteLine(interval);
        }
    }

    public static string? ClassifyInterval(double value)
    {
        if (value >= 0.0 && value <= 25.0)
        {
            return "Interval [0,25]";
        }
        if (value > 25.0 && value <= 50.0)
        {
            return "Interval (25,50]";
        }
        if (value > 50.0 && value <= 75.0)
        {
            return "Interval (50,75]";
        }
        if (value > 75.0 && value <= 100.0)
        {
            return "Interval (75,100]";
        }

        return null;
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, প্রতিটি সংখ্যার সীমা পরীক্ষা ধ্রুবক সময়ে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, অতিরিক্ত মেমোরি প্রয়োজন হয় না।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Interval](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/S) | Easy | Range checking, Nullable return methods, Fallbacks |
| ⚪ | Codeforces | [Assiut Sheet #1: Sort Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T) | Easy | Sorting values, Array navigation, Preservation of order |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Easy | Interface navigation, Safe indexing (\`?[]\`), Object polymorphism |
| ⚪ | Exercism C# | [Secure Muncle](https://exercism.org/tracks/csharp/exercises/secure-muncle) | Medium | Nested navigation (\`?.\`), Security attributes, Null-safety |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Interval",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/S",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Conditionals", "Ranges", "Nullables"],
      solutionEn:
        "Determine the interval bracket enclosing the floating-point value X, returning a nullable string descriptor and coalescing missing matches to 'Out of Intervals'.",
      solutionBn:
        "ফ্লোটিং পয়েন্ট সংখ্যা X কোন ইন্টারভ্যালে পড়ে তা বের করুন এবং ইন্টারভ্যালের বাইরে হলে 'Out of Intervals' প্রদান করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Sort Numbers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Sorting", "Arrays", "Safe Indexing"],
      solutionEn:
        "Read three numbers, store a copy in an array, sort the copy ascendingly, and print both sorted and original sequences separated by a blank line.",
      solutionBn:
        "তিনটি সংখ্যা পড়ে একটি অ্যারেতে ক্লোন করে আরোহী ক্রমে সাজান এবং সাজানো ও মূল ক্রম দুটিই যথাযথভাবে প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Remote Control Competition",
      url: "https://exercism.org/tracks/csharp/exercises/remote-control-competition",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Interfaces", "Polymorphism", "Safe Navigation"],
      solutionEn:
        "Demonstrate safe interface navigation and ranking using null-conditional indexing and comparison implementations.",
      solutionBn:
        "ইন্টারফেস ইমপ্লিমেন্টেশন ও নিরাপদ ইনডেক্সিংয়ের মাধ্যমে রেস কারগুলোর স্কোর ও র‍্যাংকিং নির্ধারণ করুন।",
    },
    {
      source: "Exercism C#",
      name: "Secure Muncle",
      url: "https://exercism.org/tracks/csharp/exercises/secure-muncle",
      difficulty: "MEDIUM",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["NRT", "Pattern Matching", "Security"],
      solutionEn:
        "Implement nested null-conditional navigation across appointment objects, validating security credentials and role scopes.",
      solutionBn:
        "অ্যাপয়েন্টমেন্ট অবজেক্টে নেস্টেড নাল-কন্ডিশনাল নেভিগেশন প্রয়োগ করে নিরাপত্তা শংসাপত্র ও ভূমিকা যাচাই করুন।",
    },
  ],
};
