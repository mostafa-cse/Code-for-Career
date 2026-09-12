import type { LocalLesson } from "@/lib/lessons-data";

export const methodsOverloadingLesson: LocalLesson = {
    slug: "methods-overloading",
    titleEn: "Method Overloading",
    titleBn: "মেথড ওভারলোডিং ও কম্পাইল-টাইম পলিমরফিজম",
    categoryEn: "04. Methods",
    categoryBn: "০৪. মেথড ও ফাংশন",
    categoryDescEn:
      "Reusable function architecture in C#: parameter evaluation, passing semantics (by-value vs by-reference), overloading, and modern params features.",
    categoryDescBn:
      "সি# এ ফাংশন ও মেথড আর্কিটেকচার: প্যারামিটার মূল্যায়ন, ভ্যালু বনাম রেফারেন্স পাসিং, ওভারলোডিং এবং মডার্ন প্যারামস।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Compile-time polymorphism, method signature criteria, overload resolution rules, ambiguous call traps, and API design.",
    descriptionBn:
      "কম্পাইল-টাইম পলিমরফিজম, মেথড সিগনেচার নীতি, ওভারলোড রেজোলিউশন নিয়ম, অ্যাম্বিগিউয়াস কল ও এপিআই ডিজাইন।",
    difficulty: "EASY",
    displayOrder: 3,
    prerequisites: ["methods-parameters"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# Method Overloading in C#

Method overloading allows a class to declare multiple methods with the **exact same name**, provided each possesses a **unique parameter signature**. It is a fundamental mechanism of **compile-time (static) polymorphism**, resolved entirely by the compiler with zero runtime overhead.

---

## 1. What Defines a Method Signature in C#?

In C#, the compiler distinguishes overloads solely based on the formal method signature:

### Included in Method Signature:
- Method name
- Number of parameters
- Data types of parameters
- Positional ordering of parameters
- Parameter modifiers (\`ref\` vs \`out\` vs by-value)

### NOT Part of the Signature:
- **Return type**: You **cannot** overload a method based solely on return type! (Declaring \`int Compute()\` and \`double Compute()\` triggers compiler error CS0111).
- **Parameter names**: Changing \`int x\` to \`int y\` does not constitute an overload.
- **\`params\` modifier**: \`void Process(int[] a)\` and \`void Process(params int[] a)\` cannot coexist.
- **Default parameter values**: Cannot be used to distinguish signatures.

\`\`\`csharp
public class Calculator
{
    // Valid overloads: Different parameter types
    public int Add(int a, int b) => a + b;
    public double Add(double a, double b) => a + b;

    // Valid overload: Different parameter count
    public int Add(int a, int b, int c) => a + b + c;

    // ❌ COMPILE ERROR CS0111: Differing return type alone is invalid!
    // public double Add(int a, int b) => (double)(a + b);
}
\`\`\`

---

## 2. The Overload Resolution Algorithm

When a method call occurs, the C# compiler executes a 3-step resolution process:

1. **Candidate Discovery**: Identifies all accessible methods matching the given name in the type hierarchy.
2. **Applicability Filtering**: Filters candidates whose parameter lists can legally accept the supplied arguments (via implicit conversion, inheritance, etc.).
3. **Best Member Selection**: Picks the most specific method:
   - Exact type match > Implicit numeric promotion > Base class reference > Optional / \`params\` fallback.

### The Ambiguous Invocation Trap (CS0121)
When two candidate methods are equally valid matches, compilation fails with an ambiguity error:

\`\`\`csharp
public static void Display(int a, double b) { }
public static void Display(double a, int b) { }

// ❌ COMPILE ERROR CS0121: The call is ambiguous between 'Display(int, double)' and 'Display(double, int)'
// Display(5, 5);

// ✅ FIX: Disambiguate with an explicit cast
Display(5, (double)5); // Calls Display(int, double)
\`\`\`

---

## 3. Overloading vs Optional Parameters in API Design

| Feature | Method Overloading | Optional Parameters |
|---|---|---|
| **Mechanism** | Multiple distinct method entry points | Single method with compiler-inlined defaults |
| **Binary Compatibility** | **Safe**: Changing internal logic does not break existing DLLs | **Risky**: Callers hardcode default values at compile time |
| **Documentation** | Dedicated XML doc comments per overload | Single shared XML comment |
| **Performance** | Can provide optimized fast paths for specific types | Always dispatches through single general method |

---

## 4. Modern Overloading with ref, in, and out

The compiler treats parameter passing modes as distinct signatures:

\`\`\`csharp
public class DataProcessor
{
    public void Process(int value)
    {
        Console.WriteLine($"Processed by value: {value}");
    }

    public void Process(ref int value)
    {
        value *= 2;
        Console.WriteLine($"Processed by ref: {value}");
    }
}

var processor = new DataProcessor();
int data = 10;

processor.Process(data);      // Calls by-value overload
processor.Process(ref data);  // Calls by-ref overload
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Overloaded Power Calculation
*Source: Codeforces Assiut University Training Sheet #5 — Problem F (Equation)*

**Problem Statement**:
Given $X$ and $N$. Compute $S = (X^0 - 1) + X^2 + X^4 + \\dots + X^N$ for even powers up to $N$. Write an overloaded \`Power\` method supporting both integer and floating-point inputs.

**Constraints**:
$0 \\le X \\le 10$, $0 \\le N \\le 10$ ($N$ is even).

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    // Overload 1: Integer power calculation
    public static long Power(long baseNum, int exp)
    {
        long result = 1;
        for (int i = 0; i < exp; i++)
        {
            result *= baseNum;
        }
        return result;
    }

    // Overload 2: Floating point power calculation
    public static double Power(double baseNum, int exp)
    {
        return Math.Pow(baseNum, exp);
    }

    public static void Main()
    {
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        long x = long.Parse(tokens[0]);
        int n = int.Parse(tokens[1]);

        long sum = 0; // (X^0 - 1) = 0

        for (int i = 2; i <= n; i += 2)
        {
            sum += Power(x, i); // Compiler resolves to Power(long, int)
        }

        Console.WriteLine(sum);
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N)$ — loop iterates $N/2$ times, calculating powers in $O(N)$ arithmetic steps.
- **Space Complexity**: $O(1)$ stack allocation.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem F: Equation](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/F) | Easy | Method overloading, Exponentiation |
| ⚪ | Exercism C# | [Cars, Assemble!](https://exercism.org/tracks/csharp/exercises/cars-assemble) | Easy | Overloaded helper methods, Rates |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | Char/string method overloading |
| ⚪ | Codeforces Assiut | [Problem C: Wonderful Number](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/C) | Easy | Binary checks, Helper methods |
`,

    contentBn: `# C# এ মেথড ওভারলোডিং ও কম্পাইল-টাইম পলিমরফিজম

মেথড ওভারলোডিং হলো এমন একটি সুবিধা যার মাধ্যমে একটি ক্লাসে **একই নামের একাধিক মেথড** তৈরি করা যায়, যদি তাদের **প্যারামিটার সিগনেচার ভিন্ন** হয়। এটি **কম্পাইল-টাইম (স্ট্যাটিক) পলিমরফিজম** এর অন্যতম মৌলিক রূপ, যা কোনো রানটাইম পারফরম্যান্স অপচয় ছাড়াই সরাসরি কম্পাইল সময়ে সমাধান হয়।

---

## ১. মেথড সিগনেচারের উপাদানসমূহ

সি# কম্পাইলার মেথড সিগনেচারের ওপর ভিত্তি করে ওভারলোডগুলো পৃথক করে:

### সিগনেচারের অন্তর্ভুক্ত বিষয়:
- মেথডের নাম
- প্যারামিটারের সংখ্যা
- প্যারামিটারের ডেটা টাইপ
- প্যারামিটারের অবস্থানগত ক্রম
- প্যারামিটার মডিফায়ার (\`ref\` বনাম \`out\` বনাম সাধারণ মান)

### সিগনেচারের অন্তর্ভুক্ত নয় এমন বিষয়:
- **রিটার্ন টাইপ**: কেবল রিটার্ন টাইপ আলাদা করে মেথড ওভারলোড করা **অসম্ভব**! (\`int Calculate()\` এবং \`double Calculate()\` লিখলে কম্পাইল এরর CS0111 হবে)।
- **প্যারামিটারের নাম**: ভেরিয়েবলের নাম পরিবর্তন সিগনেচারে কোনো প্রভাব ফেলে না।
- **ডিফল্ট প্যারামিটার মান**: ডিফল্ট মান আলাদা হলে তা সিগনেচার হিসেবে গণ্য হয় না।

---

## ২. ওভারলোড রেজোলিউশন অ্যালগরিদম

মেথড কল করার সময় C# কম্পাইলার তিনটি ধাপে সঠিক মেথড নির্বাচন করে:
১. **প্রার্থী মেথড সংগ্রহ**: কলকৃত নামের সাথে মিলে এমন সমস্ত অ্যাক্সেসযোগ্য মেথডের তালিকা করে।
২. **প্রযোজ্য মেথড বাছাই**: প্রদত্ত আর্গুমেন্টের ডেটা টাইপের সাথে টাইপ কনভার্সন করে চলতে পারে এমন মেথডগুলো ফিল্টার করে।
৩. **সেরা মেথড নির্বাচন**:
   - সরাসরি টাইপ মিল > ইমপ্লিসিট নিউমেরিক কনভার্সন > প্যারামস / অপশনাল মেথড।

### দ্ব্যর্থক কল সমস্যা (Ambiguous Call Trap):
দুটি মেথডই যদি সমানভাবে উপযুক্ত মনে হয়, কম্পাইলার CS0121 এরর প্রদর্শন করে:
\`\`\`csharp
public static void Display(int a, double b) { }
public static void Display(double a, int b) { }

// ❌ কম্পাইল এরর CS0121: কম্পাইলার সিদ্ধান্ত নিতে পারছে না কোনটি কল করবে!
// Display(5, 5);

// ✅ সঠিক সমাধান: টাইপ কাস্টিং দিয়ে নির্দিষ্ট করে দিন
Display(5, (double)5);
\`\`\`

---

## ৩. ওভারলোডিং বনাম অপশনাল প্যারামিটার

| বৈশিষ্ট্য | মেথড ওভারলোডিং | অপশনাল প্যারামিটার |
|---|---|---|
| **আর্কিটেকচার** | একাধিক স্বতন্ত্র মেথড | একক মেথডে ডিফল্ট মান |
| **বাইনারি সামঞ্জস্যতা** | **সম্পূর্ণ নিরাপদ** (নতুন সংস্করণ আগের DLL ভাঙে না) | **ঝুঁকিপূর্ণ** (কলারে কম্পাইল সময়ে মান ইনলাইন হয়ে যায়) |
| **ডকুমেন্টেশন** | প্রতিটি ওভারলোডের জন্য আলাদা XML কমেন্ট | একটি একক কমেন্ট শেয়ার হয় |
| **পারফরম্যান্স** | নির্দিষ্ট টাইপের জন্য অপ্টিমাইজড লজিক লেখা যায় | একক জেনেরিক মেথডে রাউট হয় |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ওভারলোডেড পাওয়ার হিসাব (Equation)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৫ — Problem F*

**সমস্যা পরিচিতি**:
$X$ এবং $N$ দেওয়া থাকবে। $S = (X^0 - 1) + X^2 + X^4 + \\dots + X^N$ এর মান বের করতে হবে ($N$ পর্যন্ত জোড় পাওয়ারসমূহের জন্য)। ওভারলোডেড পাওয়ার মেথড তৈরি করে সমাধান করুন।

**সীমাবদ্ধতা**:
$0 \\le X \\le 10$, $0 \\le N \\le 10$ ($N$ জোড় সংখ্যা)।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    // ওভারলোড ১: পূর্ণসংখ্যার পাওয়ার হিসাব
    public static long Power(long baseNum, int exp)
    {
        long result = 1;
        for (int i = 0; i < exp; i++)
        {
            result *= baseNum;
        }
        return result;
    }

    // ওভারলোড ২: ফ্লোটিং পয়েন্ট পাওয়ার হিসাব
    public static double Power(double baseNum, int exp)
    {
        return Math.Pow(baseNum, exp);
    }

    public static void Main()
    {
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        long x = long.Parse(tokens[0]);
        int n = int.Parse(tokens[1]);

        long sum = 0; // (X^0 - 1) = 0

        for (int i = 2; i <= n; i += 2)
        {
            sum += Power(x, i); // কম্পাইলার Power(long, int) নির্বাচন করে
        }

        Console.WriteLine(sum);
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N)$ — লুপটি $N/2$ বার চলে এবং প্রতিটিতে পাওয়ার হিসাব করে।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ — ধ্রুবক স্ট্যাক মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem F: Equation](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/F) | Easy | Method overloading, Exponentiation |
| ⚪ | Exercism C# | [Cars, Assemble!](https://exercism.org/tracks/csharp/exercises/cars-assemble) | Easy | Overloaded helper methods, Rates |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | Char/string method overloading |
| ⚪ | Codeforces Assiut | [Problem C: Wonderful Number](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/C) | Easy | Binary checks, Helper methods |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem F: Equation",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/F",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Methods", "Overloading", "Math"],
        solutionEn: "Implement overloaded power functions to accumulate even exponential terms.",
        solutionBn: "ওভারলোডেড পাওয়ার ফাংশন লিখে জোড় সূচকের পদগুলোর সমষ্টি বের করুন।",
      },
      {
        source: "Exercism C#",
        name: "Cars, Assemble!",
        url: "https://exercism.org/tracks/csharp/exercises/cars-assemble",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "Overloading", "Math"],
        solutionEn: "Compute production rates and items per minute using overloaded calculation functions.",
        solutionBn: "ওভারলোডেড ফাংশন দিয়ে গাড়ির মোট উৎপাদন ও প্রতি মিনিটের রেট হিসাব করুন।",
      },
      {
        source: "Exercism C#",
        name: "Squeaky Clean",
        url: "https://exercism.org/tracks/csharp/exercises/squeaky-clean",
        difficulty: "EASY",
        company: null,
        tags: ["Methods", "Strings", "Overloading"],
        solutionEn: "Sanitize identifier strings using helper method overloads for characters and strings.",
        solutionBn: "অক্ষর ও স্ট্রিংয়ের জন্য ওভারলোডেড মেথড ব্যবহার করে আইডেন্টিফায়ার ক্লিন করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem C: Wonderful Number",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/C",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Methods", "Binary", "Palindrome"],
        solutionEn: "Write modular methods to verify if an integer is odd and its binary form is a palindrome.",
        solutionBn: "মেথড লিখে সংখ্যাটি বিজোড় এবং তার বাইনারি রূপ প্যালিনড্রোম কি না যাচাই করুন।",
      },
    ],
  };
