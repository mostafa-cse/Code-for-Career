import type { LocalLesson } from "@/lib/lessons-data";

export const csharpInputOutputLesson: LocalLesson = {
    slug: "csharp-input-output",
    titleEn: "Console I/O & Parsing",
    titleBn: "কনসোল ইনপুট-আউটপুট ও পার্সিং",
    categoryEn: "01. C# Syntax",
    categoryBn: "০১. সি# সিনট্যাক্স ও মৌলিক গঠন",
    categoryDescEn:
      "Foundational syntax of C#, variable declaration, primitive types, string formatting, console I/O, and arithmetic/logical operators.",
    categoryDescBn:
      "সি# ভাষার প্রাথমিক সিনট্যাক্স, চলক ঘোষণা, মৌলিক তথ্য ধরন, কনসোল ইনপুট-আউটপুট এবং অপারেটর।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Console.ReadLine, Write vs WriteLine, Parse vs TryParse, multi-value parsing, fast I/O with StreamReader, Console.Error, and output formatting.",
    descriptionBn:
      "Console.ReadLine, Write ও WriteLine, Parse ও TryParse পার্থক্য, একাধিক মান পার্সিং, StreamReader দিয়ে দ্রুত I/O এবং আউটপুট ফরম্যাটিং।",
    difficulty: "EASY",
    displayOrder: 3,
    prerequisites: ["csharp-variables", "csharp-data-types"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# Console I/O & Parsing in C#

Standard input and output in .NET is managed through the static \`System.Console\` class. It interfaces directly with the standard input (\`stdin\`) and standard output (\`stdout\`) streams.

---

## Console Output Methods

| Method | Description |
|---|---|
| \`Console.Write(value)\` | Outputs text **without** a trailing newline |
| \`Console.WriteLine(value)\` | Outputs text **with** a newline at the end (\`\\r\\n\` on Windows, \`\\n\` on Unix) |
| \`Console.WriteLine()\` | Outputs a blank line |
| \`Console.Error.WriteLine(msg)\` | Writes to the standard error stream (separate from stdout) |

\`\`\`csharp
Console.Write("Enter your name: ");     // cursor stays on same line
string name = Console.ReadLine();

Console.WriteLine($"Hello, {name}!");   // outputs and moves to next line
Console.WriteLine();                    // blank line
Console.Error.WriteLine("Debug: something failed");  // to stderr
\`\`\`

---

## Console Input Methods

| Method | Returns | Description |
|---|---|---|
| \`Console.ReadLine()\` | \`string?\` | Reads a full line as string. Returns \`null\` at EOF. |
| \`Console.Read()\` | \`int\` | Reads a single character as its int code |
| \`Console.ReadKey()\` | \`ConsoleKeyInfo\` | Reads a single keypress without waiting for Enter |

---

## Parsing: \`Parse\` vs \`TryParse\`

### \`Parse\` — Throws on Invalid Input
\`\`\`csharp
int n = int.Parse("42");         // ✅ works
int bad = int.Parse("abc");      // ❌ throws FormatException
int huge = int.Parse("9999999999"); // ❌ throws OverflowException
\`\`\`

### \`TryParse\` — Safe, No Exception
Returns \`true\` if successful, writes result to the \`out\` parameter:

\`\`\`csharp
string input = Console.ReadLine();

if (int.TryParse(input, out int value))
{
    Console.WriteLine($"Valid: {value}");
}
else
{
    Console.WriteLine("Invalid number. Please try again.");
}
\`\`\`

> **Rule**: Use \`TryParse\` whenever handling user input in production apps. Use \`Parse\` only when the input is guaranteed valid (e.g. reading from a trusted file or a judge's input in competitive programming).

---

## Parsing Multiple Values from One Line

Most competitive programming problems give multiple space-separated values on one line:

\`\`\`csharp
// Input: "5 10 15"
string[] tokens = Console.ReadLine().Split(' ');
int a = int.Parse(tokens[0]);   // 5
int b = int.Parse(tokens[1]);   // 10
int c = int.Parse(tokens[2]);   // 15
\`\`\`

### Handling Extra Spaces (Robust Parsing)
\`\`\`csharp
// StringSplitOptions.RemoveEmptyEntries removes empty tokens from double-spaces
string[] tokens = Console.ReadLine()
    .Split(' ', StringSplitOptions.RemoveEmptyEntries);
\`\`\`

### LINQ-Based Multi-Parse (Concise)
\`\`\`csharp
using System.Linq;

// Parse all tokens as int in one line
int[] nums = Console.ReadLine()
    .Split()
    .Select(int.Parse)
    .ToArray();
\`\`\`

---

## Output Formatting

### Numeric Format Specifiers
\`\`\`csharp
double pi    = 3.14159265;
decimal amt  = 1234.567m;
int count    = 42;

// Fixed decimal places
Console.WriteLine($"{pi:F2}");      // 3.14
Console.WriteLine($"{pi:F6}");      // 3.141593

// Currency (locale-sensitive)
Console.WriteLine($"{amt:C}");      // $1,234.57 (US locale)

// Padded integers
Console.WriteLine($"{count:D6}");   // 000042

// Hexadecimal
Console.WriteLine($"{255:X}");      // FF

// Percentage
Console.WriteLine($"{0.875:P1}");   // 87.5%
\`\`\`

### Alignment & Column Padding
\`\`\`csharp
// {expression,width} — positive = right-align, negative = left-align
Console.WriteLine($"{"Name",-15} {"Score",6}");   // left / right align
Console.WriteLine($"{"Alice",-15} {95,6}");
Console.WriteLine($"{"Bob",-15} {87,6}");
\`\`\`

---

## Fast I/O for Large Inputs (Competitive Programming)

Standard \`Console.ReadLine()\` is slow for $10^5$–$10^6$ lines. Use a buffered \`StreamReader\`:

\`\`\`csharp
using System;
using System.IO;

public class Program
{
    static StreamReader sr = new StreamReader(
        new System.IO.BufferedStream(Console.OpenStandardInput(1 << 15)));

    public static void Main()
    {
        int t = int.Parse(sr.ReadLine());
        while (t-- > 0)
        {
            string[] parts = sr.ReadLine().Split(' ');
            long a = long.Parse(parts[0]);
            long b = long.Parse(parts[1]);
            Console.WriteLine(a + b);
        }
    }
}
\`\`\`

> Buffer size \`1 << 15\` = 32,768 bytes. This reduces the number of OS syscalls and can speed up input by 3–5×.

---

## Reading Multiple Lines (N lines input pattern)

\`\`\`csharp
int n = int.Parse(Console.ReadLine());  // first line: number of test cases

for (int i = 0; i < n; i++)
{
    string line = Console.ReadLine();
    // process line
    Console.WriteLine(line.ToUpper());
}
\`\`\`

---

## Syntax & Practical Implementation

\`\`\`csharp
// Basic prompt and read
Console.Write("Enter your age: ");
if (int.TryParse(Console.ReadLine(), out int age))
    Console.WriteLine($"In 10 years you will be {age + 10}");
else
    Console.WriteLine("Invalid age.");

// Multi-value from one line
string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
int x = int.Parse(tokens[0]);
int y = int.Parse(tokens[1]);
Console.WriteLine($"Sum = {x + y}, Product = {x * y}");

// Formatted output
double result = Math.Sqrt(x * x + y * y);
Console.WriteLine($"Hypotenuse = {result:F4}");
\`\`\`

---

## Practical Problem Walkthrough

### Problem: A+B Problem
*Source: Codeforces — Classic Starter*

Read two integers from a single line and print their sum.

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string[] parts = Console.ReadLine().Split(' ');
        long a = long.Parse(parts[0]);
        long b = long.Parse(parts[1]);
        Console.WriteLine(a + b);
    }
}
\`\`\`

**Complexity**: Time $O(1)$ · Space $O(1)$

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem A: Hello World](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/A) | Easy | Console.Write, Output |
| ⚪ | Codeforces Assiut | [Problem B: Basic Data Types](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B) | Easy | Parsing, Multi-input |
| ⚪ | Exercism C# | [Hello World](https://exercism.org/tracks/csharp/exercises/hello-world) | Easy | Console.WriteLine |
| ⚪ | Exercism C# [Gigasecond](https://exercism.org/tracks/csharp/exercises/gigasecond) | Gigasecond | Easy | Parsing, DateTime, I/O |
`,

    contentBn: `# কনসোল ইনপুট-আউটপুট ও পার্সিং

.NET-এ standard ইনপুট-আউটপুট static \`System.Console\` ক্লাসের মাধ্যমে পরিচালিত হয়। এটি সরাসরি \`stdin\` ও \`stdout\` stream-এর সাথে যুক্ত।

---

## আউটপুট মেথডসমূহ

| মেথড | বর্ণনা |
|---|---|
| \`Console.Write()\` | নতুন লাইন **ছাড়া** আউটপুট |
| \`Console.WriteLine()\` | নতুন লাইন **সহ** আউটপুট |
| \`Console.Error.WriteLine()\` | Standard error stream-এ লেখে |

\`\`\`csharp
Console.Write("আপনার নাম লিখুন: ");   // cursor একই লাইনে থাকে
string name = Console.ReadLine();
Console.WriteLine($"হ্যালো, {name}!"); // নতুন লাইনে যায়
\`\`\`

---

## ইনপুট মেথডসমূহ

| মেথড | রিটার্ন | বর্ণনা |
|---|---|---|
| \`Console.ReadLine()\` | \`string?\` | পুরো লাইন পড়ে। EOF-এ \`null\` ফেরায় |
| \`Console.Read()\` | \`int\` | একটি character-এর int কোড পড়ে |
| \`Console.ReadKey()\` | \`ConsoleKeyInfo\` | Enter ছাড়াই একটি keypress পড়ে |

---

## Parsing: \`Parse\` বনাম \`TryParse\`

### \`Parse\` — অবৈধ ইনপুটে Exception ছুঁড়ে দেয়
\`\`\`csharp
int n = int.Parse("42");     // ✅ কাজ করে
int bad = int.Parse("abc");  // ❌ FormatException
\`\`\`

### \`TryParse\` — নিরাপদ, Exception নেই
\`\`\`csharp
string input = Console.ReadLine();

if (int.TryParse(input, out int value))
    Console.WriteLine($"বৈধ: {value}");
else
    Console.WriteLine("অবৈধ সংখ্যা।");
\`\`\`

> **নিয়ম**: production অ্যাপে সবসময় \`TryParse\` ব্যবহার করুন। নিশ্চিত ইনপুটের (প্রতিযোগিতামূলক প্রোগ্রামিং) জন্য \`Parse\` যথেষ্ট।

---

## একটি লাইন থেকে একাধিক মান পার্সিং

\`\`\`csharp
// ইনপুট: "5 10 15"
string[] tokens = Console.ReadLine().Split(' ');
int a = int.Parse(tokens[0]);   // 5
int b = int.Parse(tokens[1]);   // 10
int c = int.Parse(tokens[2]);   // 15
\`\`\`

### Robust পার্সিং (অতিরিক্ত space সহ)
\`\`\`csharp
string[] tokens = Console.ReadLine()
    .Split(' ', StringSplitOptions.RemoveEmptyEntries);
\`\`\`

### LINQ দিয়ে সংক্ষিপ্ত পার্সিং
\`\`\`csharp
using System.Linq;
int[] nums = Console.ReadLine().Split().Select(int.Parse).ToArray();
\`\`\`

---

## আউটপুট ফরম্যাটিং

\`\`\`csharp
double pi   = 3.14159265;
decimal amt = 1234.567m;
int count   = 42;

Console.WriteLine($"{pi:F2}");    // 3.14
Console.WriteLine($"{pi:F6}");    // 3.141593
Console.WriteLine($"{amt:F2}");   // 1234.57
Console.WriteLine($"{count:D6}"); // 000042
Console.WriteLine($"{255:X}");    // FF (hexadecimal)
\`\`\`

---

## দ্রুত I/O (Competitive Programming)

বড় ইনপুটের জন্য buffered \`StreamReader\` ব্যবহার করুন:

\`\`\`csharp
using System;
using System.IO;

public class Program
{
    static StreamReader sr = new StreamReader(
        new BufferedStream(Console.OpenStandardInput(1 << 15)));

    public static void Main()
    {
        int t = int.Parse(sr.ReadLine());
        while (t-- > 0)
        {
            string[] parts = sr.ReadLine().Split(' ');
            long a = long.Parse(parts[0]);
            long b = long.Parse(parts[1]);
            Console.WriteLine(a + b);
        }
    }
}
\`\`\`

> Buffer size \`1 << 15\` = 32,768 bytes — OS syscall কমিয়ে ইনপুট ৩-৫ গুণ দ্রুত করে।

---

## সিনট্যাক্স ও ব্যবহারিক কোড

\`\`\`csharp
// নিরাপদ ইনপুট
Console.Write("বয়স লিখুন: ");
if (int.TryParse(Console.ReadLine(), out int boyos))
    Console.WriteLine($"১০ বছর পরে বয়স হবে {boyos + 10}");
else
    Console.WriteLine("অবৈধ বয়স।");

// একাধিক ইনপুট
string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
int x = int.Parse(tokens[0]);
int y = int.Parse(tokens[1]);
Console.WriteLine($"যোগফল = {x + y}");
\`\`\`

---

## বাস্তব সমস্যা সমাধান

### সমস্যা: A+B
দুটি পূর্ণসংখ্যা পড়ুন এবং তাদের যোগফল প্রিন্ট করুন।

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string[] parts = Console.ReadLine().Split(' ');
        long a = long.Parse(parts[0]);
        long b = long.Parse(parts[1]);
        Console.WriteLine(a + b);
    }
}
\`\`\`

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem A: Hello World](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/A) | Easy | Console.WriteLine |
| ⚪ | Codeforces Assiut | [Problem B: Basic Data Types](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B) | Easy | Parsing, Multi-input |
| ⚪ | Exercism C# | [Hello World](https://exercism.org/tracks/csharp/exercises/hello-world) | Easy | Console.WriteLine |
| ⚪ | Exercism C# | [Gigasecond](https://exercism.org/tracks/csharp/exercises/gigasecond) | Easy | Parsing, DateTime |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem A: Hello World",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/A",
        difficulty: "EASY",
        company: null,
        tags: ["Console", "Output", "Basic I/O"],
        solutionEn: "Read name and print a formatted greeting using Console.WriteLine and string interpolation.",
        solutionBn: "Console.WriteLine এবং string interpolation ব্যবহার করে নাম পড়ুন এবং greeting প্রিন্ট করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #1",
        name: "Problem B: Basic Data Types",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/B",
        difficulty: "EASY",
        company: "Brain Station 23",
        tags: ["Parsing", "Multi-input", "CultureInfo"],
        solutionEn: "Split the line into tokens and parse each into its correct type using CultureInfo.InvariantCulture for floats.",
        solutionBn: "লাইনকে token-এ ভেঙে CultureInfo.InvariantCulture সহ প্রতিটি সঠিক টাইপে parse করুন।",
      },
      {
        source: "Exercism C#",
        name: "Hello World",
        url: "https://exercism.org/tracks/csharp/exercises/hello-world",
        difficulty: "EASY",
        company: null,
        tags: ["Console", "Output", "Basic"],
        solutionEn: "Return the string 'Hello, World!' from the Greeting method.",
        solutionBn: "Greeting মেথড থেকে 'Hello, World!' string রিটার্ন করুন।",
      },
      {
        source: "Exercism C#",
        name: "Gigasecond",
        url: "https://exercism.org/tracks/csharp/exercises/gigasecond",
        difficulty: "EASY",
        company: null,
        tags: ["DateTime", "TimeSpan", "Parsing"],
        solutionEn: "Add 10^9 seconds (1 gigasecond) to a given DateTime using TimeSpan.FromSeconds().",
        solutionBn: "TimeSpan.FromSeconds() ব্যবহার করে প্রদত্ত DateTime-এ ১ gigasecond (10^9 সেকেন্ড) যোগ করুন।",
      },
    ],
  };
