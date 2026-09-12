import type { LocalLesson } from "@/lib/lessons-data";

export const exceptionsTryCatchFinallyLesson: LocalLesson = {
  slug: "exceptions-try-catch-finally",
  titleEn: "try / catch / finally",
  titleBn: "ট্রাই-ক্যাচ-ফাইনালি (try-catch-finally)",
  categoryEn: "08. Exception Handling",
  categoryBn: "০৮. এক্সেপশন ও ত্রুটি হ্যান্ডলিং",
  categoryDescEn:
    "Structured error handling in .NET: try/catch/finally blocks, stack trace preservation, custom domain exceptions, and exception filters.",
  categoryDescBn:
    ".NET এ ত্রুটি হ্যান্ডলিং: ট্রাই-ক্যাচ-ফাইনালি ব্লক, স্ট্যাক ট্রেস সংরক্ষণ (throw vs throw ex), কাস্টম এক্সেপশন ও এক্সেপশন ফিল্টার।",
  categoryPriority: "CORE",
  descriptionEn:
    "Structured error management, two-pass CLR exception handling, catch ordering by specificity, and the guaranteed execution of finally.",
  descriptionBn:
    "স্ট্রাকচার্ড এরর ম্যানেজমেন্ট, CLR-এর টু-পাস এক্সেপশন মডেল, ক্যাচ ব্লকের সঠিক ক্রম এবং ফাইনালি ব্লকের অলঙ্ঘনীয় নিশ্চয়তা।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["csharp-if-else"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# try / catch / finally in C#

In .NET, exceptions are structured objects derived from \`System.Exception\` representing anomalous runtime events. The \`try-catch-finally\` block provides structured, resilient error management to prevent unhandled process crashes.

---

## CLR Two-Pass Exception Handling Architecture

Under the hood, the Common Language Runtime (CLR) implements a **two-pass structured exception handling (SEH) model**:

\`\`\`
Throw Occurs inside Method C()
             │
   PASS 1: The Search Pass (Stack Walk)
   ├── CLR inspects call stack upwards: C() -> B() -> A()
   ├── Evaluates 'when' filters and catch type compatibility
   └── Identifies the matching catch block (Stack is NOT unwound yet!)
             │
   PASS 2: The Unwind Pass
   ├── CLR unwinds stack frames from C() down to the handler
   ├── Executes intermediate 'finally' blocks along the way
   └── Transfers execution to the matched 'catch' block body
\`\`\`

---

## Catch Ordering by Specificity

The CLR checks \`catch\` blocks sequentially from top to bottom. You **must order catch blocks from most derived (specific) to most general (base)**:

\`\`\`csharp
try
{
    string content = File.ReadAllText("config.json");
    int port = int.Parse(content);
}
catch (FileNotFoundException ex)     // 1. Most specific file error
{
    Console.WriteLine($"Config missing: {ex.FileName}");
}
catch (IOException ex)               // 2. Broader I/O base class
{
    Console.WriteLine($"I/O failure: {ex.Message}");
}
catch (FormatException ex)           // 3. Parsing error
{
    Console.WriteLine($"Invalid numeric port: {ex.Message}");
}
catch (Exception ex)                 // 4. Universal fallback (MUST BE LAST!)
{
    Console.WriteLine($"Unexpected fatal error: {ex.Message}");
}
\`\`\`

> **Compiler Guard (CS0160)**: Placing \`catch (Exception)\` above specific exceptions results in a compile-time error: *"A previous catch clause already catches all exceptions"*.

---

## The Guaranteed Execution of \`finally\`

The \`finally\` block is **guaranteed to execute**, whether:
- The \`try\` block completes normally with no errors.
- An exception is thrown and successfully handled in a \`catch\` block.
- An exception is thrown and **not caught** (it executes during the CLR stack unwind before process termination).
- An early \`return\`, \`break\`, or \`continue\` is executed inside the \`try\` block!

\`\`\`csharp
public static int CalculateDiscount()
{
    try
    {
        Console.WriteLine("Executing calculation...");
        return 10; // Early return!
    }
    finally
    {
        // Executes BEFORE the method actually returns to the caller!
        Console.WriteLine("Finally block executed cleanly.");
    }
}
\`\`\`

### When Does \`finally\` NOT Execute?
There are rare, catastrophic edge cases where \`finally\` will **never run**:
1. **\`Environment.FailFast("Fatal error")\`**: Immediately aborts the Windows/Linux process without running any finally blocks or finalizers.
2. **\`StackOverflowException\`**: Since .NET 2.0, stack overflows terminate the process instantly to prevent memory corruption.
3. **Infinite Loops / Deadlocks**: If the \`try\` block never exits due to a deadlocked thread or infinite while loop.
4. **Sudden Process Termination**: \`kill -9\` on Linux, killing the process via Task Manager, or hardware power failure.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 — Problem C (Simple Calculator Guarded)
*Read two integer operands $A$ and $B$, parse them, and compute addition, multiplication, and subtraction with robust error guarding against invalid formatting, zero inputs, and integer overflow.*

#### Problem Analysis
- Input: Two space-separated strings.
- Danger: Invalid non-numeric input (\`FormatException\`), absent inputs (\`IndexOutOfRangeException\`), and large multiplications (\`OverflowException\`).
- Architecture: Enclose parsing and arithmetic in a structured \`try-catch-finally\` block.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class GuardedCalculatorSolution
{
    public static void Main()
    {
        try
        {
            string? input = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(input)) return;

            string[] tokens = input.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            if (tokens.Length < 2)
            {
                throw new IndexOutOfRangeException("Two numeric operands are required.");
            }

            // Checked arithmetic detects 64-bit integer overflow
            checked
            {
                long a = long.Parse(tokens[0], CultureInfo.InvariantCulture);
                long b = long.Parse(tokens[1], CultureInfo.InvariantCulture);

                Console.WriteLine($"{a} + {b} = {a + b}");
                Console.WriteLine($"{a} * {b} = {a * b}");
                Console.WriteLine($"{a} - {b} = {a - b}");
            }
        }
        catch (FormatException ex)
        {
            Console.WriteLine($"[Input Error] Non-numeric input provided: {ex.Message}");
        }
        catch (OverflowException ex)
        {
            Console.WriteLine($"[Overflow Error] Calculation exceeded 64-bit limits: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[General Error] {ex.Message}");
        }
        finally
        {
            // Guaranteed cleanup
            Console.WriteLine("Evaluation cycle complete.");
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$ — constant number of token parses and arithmetic operations.
- **Space Complexity**: $\\mathcal{O}(1)$ stack memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem C: Simple Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C) | Easy | 64-bit Math, Formatting, Exception Guarding |
| ⚪ | Codeforces Assiut | [Problem B: Even Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B) | Easy | Loops, Fallback Handling, Boundary Checks |
| ⚪ | Exercism C# | [Calculator Conundrum](https://exercism.org/tracks/csharp/exercises/calculator-conundrum) | Easy | try-catch-finally, ArgumentNullException |
| ⚪ | Exercism C# | [Parsing Log Files](https://exercism.org/tracks/csharp/exercises/parsing-log-files) | Medium | String Parsing, Regex, Error Handling |
`,

  contentBn: `# C# এ ট্রাই-ক্যাচ-ফাইনালি (try-catch-finally)

.NET এ এক্সেপশন হলো \`System.Exception\` থেকে উদ্ভূত অবজেক্ট, যা রানটাইমে ঘটে যাওয়া কোনো অস্বাভাবিক বা ত্রুটিপূর্ণ পরিস্থিতি নির্দেশ করে। \`try-catch-finally\` ব্লক অপ্রত্যাশিত প্রোগ্রাম ক্র্যাশ রোধ করে কোডের নির্ভরযোগ্যতা নিশ্চিত করে।

---

## CLR-এর টু-পাস (Two-Pass) এক্সেপশন হ্যান্ডলিং মডেল

কমন ল্যাঙ্গুয়েজ রানটাইম (CLR) এক্সেপশন পরিচালনার জন্য **দুই-ধাপের আর্কিটেকচার** ব্যবহার করে:

\`\`\`
Method C() এর ভেতর ত্রুটি ঘটল
             │
   ধাপ ১: সার্চ পাস (Stack Walk)
   ├── CLR স্ট্যাকের ওপরের দিকে স্ক্যান করে: C() -> B() -> A()
   ├── 'when' ফিল্টার এবং টাইপ সামঞ্জস্যতা যাচাই করে
   └── কোন ক্যাচ ব্লক হ্যান্ডেল করবে তা চিহ্নিত করে (স্ট্যাক কিন্তু আনওয়াইন্ড হয় না!)
             │
   ধাপ ২: আনওয়াইন্ড পাস (Stack Unwind)
   ├── মেথড C() থেকে হ্যান্ডলার মেথড পর্যন্ত স্ট্যাক ফ্রেম মুছে ফেলে
   ├── মধ্যবর্তী সকল 'finally' ব্লক নির্বাহ করে
   └── নির্বাচিত 'catch' ব্লকের ভেতর এক্সিকিউশন স্থানান্তর করে
\`\`\`

---

## ক্যাচ ব্লকের সুনির্দিষ্ট ক্রমবিন্যাস

CLR উপর থেকে নিচে ক্রমানুসারে ক্যাচ ব্লক পরীক্ষা করে। তাই **সবচেয়ে নির্দিষ্ট (Specific) এক্সেপশন উপরে এবং সাধারণ (Base) এক্সেপশন নিচে** রাখতে হয়:

\`\`\`csharp
try
{
    string content = File.ReadAllText("config.json");
    int port = int.Parse(content);
}
catch (FileNotFoundException ex)     // ১. সবচেয়ে নির্দিষ্ট ফাইল এরর
{
    Console.WriteLine($"Config missing: {ex.FileName}");
}
catch (IOException ex)               // ২. সাধারণ I/O বেস ক্লাস
{
    Console.WriteLine($"I/O failure: {ex.Message}");
}
catch (FormatException ex)           // ৩. ডাটা পার্সিং এরর
{
    Console.WriteLine($"Invalid numeric port: {ex.Message}");
}
catch (Exception ex)                 // ৪. সার্বজনীন ব্যাকআপ (সবার শেষে!)
{
    Console.WriteLine($"Unexpected fatal error: {ex.Message}");
}
\`\`\`

> **কম্পাইলার সতর্কতা (CS0160)**: যদি \`catch (Exception)\` সবার উপরে দেওয়া হয়, তবে কম্পাইলার এরর দেয়: *"A previous catch clause already catches all exceptions"*।

---

## \`finally\` ব্লকের অলঙ্ঘনীয় নিশ্চয়তা

\`finally\` ব্লক **সর্বদা নির্বাহ হওয়ার গ্যারান্টি দেয়**, এমনকি যদি:
- \`try\` ব্লক কোনো ত্রুটি ছাড়াই সফলভাবে শেষ হয়।
- কোনো এক্সেপশন ঘটে এবং \`catch\` ব্লকে ধরা পড়ে।
- \`try\` ব্লকের ভেতর থেকে আগেই \`return\`, \`break\` বা \`continue\` করা হয়!

\`\`\`csharp
public static int CalculateDiscount()
{
    try
    {
        Console.WriteLine("Executing calculation...");
        return 10; // মেথড থেকে রিটার্ন করছে!
    }
    finally
    {
        // কলারের কাছে মান ফেরত যাওয়ার ঠিক পূর্ব মুহূর্তে এটি এক্সিকিউট হবে!
        Console.WriteLine("Finally block executed cleanly.");
    }
}
\`\`\`

### কোন পরিস্থিতিতে \`finally\` নির্বাহ হয় না?
বিরল কিছু চরম ক্ষেত্রে \`finally\` ব্লক কখনোই চলে না:
১. **\`Environment.FailFast("Fatal error")\`**: এটি অপারেটিং সিস্টেমে সরাসরি প্রসেস বন্ধ করে দেয়, কোনো ফাইনালি চলে না।
২. **\`StackOverflowException\`**: স্ট্যাক মেমোরি পূর্ণ হয়ে গেলে মেমোরি নিরাপত্তা রক্ষায় .NET সাথে সাথে প্রোগ্রাম বন্ধ করে দেয়।
৩. **ইনফিনিট লুপ বা থ্রেড ডেডলক**: যদি ট্রাই ব্লক কোনো ডেডলকের কারণে কখনোই শেষ না হয়।
৪. **অপারেটিং সিস্টেম ফোর্স কিল**: টাস্ক ম্যানেজার থেকে প্রসেস কিল বা পাওয়ার কাট।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #১ — Problem C (Simple Calculator Guarded)
*দুটি সংখ্যা $A$ ও $B$ ইনপুট নিয়ে যোগফল, গুণফল ও বিয়োগফল প্রিন্ট করতে হবে, সাথে পার্সিং এরর ও ওভারফ্লো এক্সেপশন হ্যান্ডেল করতে হবে।*

#### সমাধান বিশ্লেষণ
- \`checked\` ব্লকের মাধ্যমে ৬৪-বিট পূর্ণসংখ্যার ওভারফ্লো শনাক্ত করা হয়েছে।
- \`FormatException\` ও \`OverflowException\` এর মতো সুনির্দিষ্ট ত্রুটি ক্যাচ ব্লকের মাধ্যমে প্রতিরোধ করা হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class GuardedCalculatorSolution
{
    public static void Main()
    {
        try
        {
            string? input = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(input)) return;

            string[] tokens = input.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            if (tokens.Length < 2)
            {
                throw new IndexOutOfRangeException("Two numeric operands are required.");
            }

            checked
            {
                long a = long.Parse(tokens[0], CultureInfo.InvariantCulture);
                long b = long.Parse(tokens[1], CultureInfo.InvariantCulture);

                Console.WriteLine($"{a} + {b} = {a + b}");
                Console.WriteLine($"{a} * {b} = {a * b}");
                Console.WriteLine($"{a} - {b} = {a - b}");
            }
        }
        catch (FormatException ex)
        {
            Console.WriteLine($"[Input Error] Non-numeric input provided: {ex.Message}");
        }
        catch (OverflowException ex)
        {
            Console.WriteLine($"[Overflow Error] Calculation exceeded 64-bit limits: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[General Error] {ex.Message}");
        }
        finally
        {
            Console.WriteLine("Evaluation cycle complete.");
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ — নির্ধারিত গাণিতিক গণনা।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ স্ট্যাক মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem C: Simple Calculator](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C) | Easy | 64-bit Math, Formatting, Exception Guarding |
| ⚪ | Codeforces Assiut | [Problem B: Even Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B) | Easy | Loops, Fallback Handling, Boundary Checks |
| ⚪ | Exercism C# | [Calculator Conundrum](https://exercism.org/tracks/csharp/exercises/calculator-conundrum) | Easy | try-catch-finally, ArgumentNullException |
| ⚪ | Exercism C# | [Parsing Log Files](https://exercism.org/tracks/csharp/exercises/parsing-log-files) | Medium | String Parsing, Regex, Error Handling |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #1",
      name: "Problem C: Simple Calculator",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/C",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Exceptions", "try-catch", "Math"],
      solutionEn: "Guard arithmetic evaluations against format errors and 64-bit overflow using structured try-catch-finally blocks.",
      solutionBn: "স্ট্রাকচার্ড ট্রাই-ক্যাচ দিয়ে পার্সিং এরর ও ৬৪-বিট পূর্ণসংখ্যার ওভারফ্লো হ্যান্ডেল করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #2",
      name: "Problem B: Even Numbers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/B",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Loops", "Conditions", "Edge Cases"],
      solutionEn: "Loop from 1 to N and print even numbers, outputting -1 fallback when no even numbers exist.",
      solutionBn: "১ থেকে N পর্যন্ত জোড় সংখ্যা প্রিন্ট করুন এবং কোনো জোড় সংখ্যা না থাকলে -১ আউটপুট দিন।",
    },
    {
      source: "Exercism C#",
      name: "Calculator Conundrum",
      url: "https://exercism.org/tracks/csharp/exercises/calculator-conundrum",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Exceptions", "try-catch", "Validation"],
      solutionEn: "Intercept DivideByZeroException and validate operator inputs using structured try-catch-finally.",
      solutionBn: "ডিভাইড-বাই-জিরো এক্সেপশন ও নাল ইনপুট নিরাপদে ট্রাই-ক্যাচ-ফাইনালি ব্লকে হ্যান্ডেল করুন।",
    },
    {
      source: "Exercism C#",
      name: "Parsing Log Files",
      url: "https://exercism.org/tracks/csharp/exercises/parsing-log-files",
      difficulty: "MEDIUM",
      company: "Kaz Software",
      tags: ["Exceptions", "Regex", "Strings"],
      solutionEn: "Extract error severity codes from structured log files with defensive exception guarding.",
      solutionBn: "ডিফেন্সিভ এক্সেপশন হ্যান্ডলিংয়ের মাধ্যমে লগ ফাইল থেকে এরর কোড আলাদা করুন।",
    },
  ],
};
