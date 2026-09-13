import type { LocalLesson } from "@/lib/lessons-data";

export const csharpStringsSyntaxLesson: LocalLesson = {
    slug: "csharp-strings-syntax",
    titleEn: "Strings & Text Manipulation",
    titleBn: "স্ট্রিং ও টেক্সট ম্যানিপুলেশন",
    categoryEn: "01. C# Syntax",
    categoryBn: "০১. সি# সিনট্যাক্স ও মৌলিক গঠন",
    categoryDescEn:
      "Foundational syntax of C#, variable declaration, primitive types, string formatting, console I/O, and arithmetic/logical operators.",
    categoryDescBn:
      "সি# ভাষার প্রাথমিক সিনট্যাক্স, চলক ঘোষণা, মৌলিক তথ্য ধরন, কনসোল ইনপুট-আউটপুট এবং অপারেটর।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "String immutability, interpolation, verbatim literals, raw strings, common methods, StringBuilder, span-based parsing, and format specifiers.",
    descriptionBn:
      "স্ট্রিং immutability, interpolation, verbatim literal, raw string, সাধারণ মেথডসমূহ, StringBuilder, span-based parsing এবং format specifier।",
    difficulty: "EASY",
    displayOrder: 4,
    prerequisites: ["csharp-variables", "csharp-data-types"],
    estimatedMinutes: 35,
    lastUpdated: "Recently updated",
    contentEn: `# Strings & Text Manipulation in C#

In C#, \`string\` is an alias for \`System.String\`. A string is a **reference type** that stores an immutable sequence of UTF-16 Unicode characters.

---

## Immutability — The Core Property

Every \`string\` in C# is **immutable**: once created, its value cannot change. Any operation that appears to "modify" a string actually creates a **new string object** on the heap.

\`\`\`csharp
string s = "Hello";
s += " World";       // NOT modifying 'Hello' — creates a new string "Hello World"
                     // Original "Hello" object is now eligible for GC
\`\`\`

> **Performance implication**: Concatenating strings in a loop creates many temporary heap objects. Use \`StringBuilder\` for loop concatenation (see below).

---

## String Literal Forms

### 1. Regular String Literal
Escape sequences are processed: \`\\n\` (newline), \`\\t\` (tab), \`\\\\\` (backslash), \`\\"\` (quote).

\`\`\`csharp
string message = "Hello,\\nWorld!";  // two lines when printed
string path    = "C:\\\\Users\\\\Mostafa"; // need \\\\ for single \\
\`\`\`

### 2. Verbatim String (\`@\` prefix)
Escape sequences are ignored. Backslashes are literal. Ideal for file paths and regex.

\`\`\`csharp
string path   = @"C:\\Users\\Mostafa\\Documents";  // no escaping needed
string regex  = @"\\d{4}-\\d{2}-\\d{2}";          // date pattern, readable
string multi  = @"Line 1
Line 2
Line 3";  // multi-line verbatim
\`\`\`

### 3. Interpolated String (\`$\` prefix) — C# 6+
Embed expressions directly inside \`{}\`. Evaluated at runtime.

\`\`\`csharp
string name = "Mostafa";
int age     = 28;
string msg  = $"Hello, {name}! You are {age} years old.";
string math = $"2 + 2 = {2 + 2}";                          // expressions work
string fmt  = $"Balance: {12345.67:C}";                     // format specifiers
\`\`\`

### 4. Raw String Literal (\`"""\` prefix) — C# 11+
No escaping needed at all. Perfect for JSON, SQL, HTML embedded in code.

\`\`\`csharp
string json = """
{
    "name": "Mostafa",
    "age": 28
}
""";
\`\`\`

---

## Common String Properties & Methods

| Member | Returns | Description |
|---|---|---|
| \`.Length\` | \`int\` | Number of UTF-16 characters |
| \`.ToUpper()\` | \`string\` | Uppercase copy |
| \`.ToLower()\` | \`string\` | Lowercase copy |
| \`.Trim()\` | \`string\` | Removes leading & trailing whitespace |
| \`.TrimStart()\` / \`.TrimEnd()\` | \`string\` | One-sided trim |
| \`.Contains(s)\` | \`bool\` | True if substring found |
| \`.StartsWith(s)\` / \`.EndsWith(s)\` | \`bool\` | Prefix/suffix check |
| \`.IndexOf(s)\` | \`int\` | First index of substring, \`-1\` if not found |
| \`.Replace(old, new)\` | \`string\` | Replaces all occurrences |
| \`.Split(separator)\` | \`string[]\` | Splits into array of tokens |
| \`.Substring(start, len)\` | \`string\` | Extracts substring (use \`AsSpan\` for performance) |
| \`string.IsNullOrEmpty(s)\` | \`bool\` | True if null or \`""\` |
| \`string.IsNullOrWhiteSpace(s)\` | \`bool\` | True if null, empty, or only spaces |
| \`string.Join(sep, array)\` | \`string\` | Joins array elements with separator |
| \`string.Concat(a, b)\` | \`string\` | Concatenates without boxing |

\`\`\`csharp
string text = "  Hello, World!  ";

Console.WriteLine(text.Trim());                    // "Hello, World!"
Console.WriteLine(text.Trim().ToUpper());          // "HELLO, WORLD!"
Console.WriteLine(text.Contains("World"));         // True
Console.WriteLine(text.Replace("World", "C#"));   // "  Hello, C#!  "

string[] words = "apple,banana,mango".Split(',');
Console.WriteLine(words.Length);                   // 3
Console.WriteLine(string.Join(" | ", words));      // "apple | banana | mango"

// Null safety
string maybeNull = null;
Console.WriteLine(string.IsNullOrEmpty(maybeNull));      // True
Console.WriteLine(string.IsNullOrWhiteSpace("   "));     // True
\`\`\`

---

## StringBuilder — For Loop Concatenation

When building strings inside a loop, \`StringBuilder\` avoids creating $N$ intermediate string objects:

\`\`\`csharp
using System.Text;

// ❌ Bad — O(N²) allocations in loop
string result = "";
for (int i = 0; i < 1000; i++)
    result += i.ToString();     // creates new string every iteration!

// ✅ Good — O(N) with StringBuilder
var sb = new StringBuilder();
for (int i = 0; i < 1000; i++)
    sb.Append(i);

string result2 = sb.ToString();
\`\`\`

---

## Format Specifiers in Interpolated Strings

\`\`\`csharp
double pi    = 3.14159265;
decimal amt  = 12345.67m;
int count    = 42;

Console.WriteLine($"{pi:F2}");      // 3.14          — 2 decimal places
Console.WriteLine($"{pi:F4}");      // 3.1416        — 4 decimal places
Console.WriteLine($"{amt:C}");      // $12,345.67    — currency (locale)
Console.WriteLine($"{count:D5}");   // 00042         — padded integer
Console.WriteLine($"{count:X}");    // 2A            — hexadecimal
Console.WriteLine($"{0.75:P}");     // 75.00%        — percentage
\`\`\`

---

## String Comparison

\`\`\`csharp
string a = "Hello";
string b = "hello";

Console.WriteLine(a == b);                                        // False — case-sensitive
Console.WriteLine(a.Equals(b, StringComparison.OrdinalIgnoreCase)); // True — case-insensitive
Console.WriteLine(string.Compare(a, b, ignoreCase: true));        // 0 (equal)
\`\`\`

---

## Syntax & Practical Implementation

\`\`\`csharp
string firstName = "Tanvir";
string lastName  = "Hossain";

// Concatenation
string full = $"{firstName} {lastName}";

// Verbatim path
string path = @"C:\\Projects\\Code-for-Career";

// Common operations
Console.WriteLine(full.Length);              // 14
Console.WriteLine(full.ToUpper());          // TANVIR HOSSAIN
Console.WriteLine(full.Contains("Hossain")); // True

// Split & Join
string csv    = "1,2,3,4,5";
string[] nums = csv.Split(',');
string joined = string.Join(" + ", nums);   // "1 + 2 + 3 + 4 + 5"

// StringBuilder
var sb = new StringBuilder();
for (int i = 1; i <= 5; i++)
    sb.Append($"Item{i} ");
Console.WriteLine(sb.ToString().Trim());    // "Item1 Item2 Item3 Item4 Item5"
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Determine String Type
*Source: Codeforces Assiut University Training Sheet #2 — Problem H*

Given a string, classify it as: lowercase letter, uppercase letter, digit, or special character.

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        char c = char.Parse(Console.ReadLine());

        if (char.IsLower(c))
            Console.WriteLine("Lowercase letter");
        else if (char.IsUpper(c))
            Console.WriteLine("Uppercase letter");
        else if (char.IsDigit(c))
            Console.WriteLine("Digit");
        else
            Console.WriteLine("Special character");
    }
}
\`\`\`

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem H: Character Type](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/H) | Easy | char, String, IsDigit |
| ⚪ | Exercism C# | [Bob](https://exercism.org/tracks/csharp/exercises/bob) | Easy | string methods, Trim |
| ⚪ | Exercism C# | [Pangram](https://exercism.org/tracks/csharp/exercises/pangram) | Easy | ToLower, Contains, LINQ |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | string, char array |
`,

    contentBn: `# স্ট্রিং ও টেক্সট ম্যানিপুলেশন

C#-এ \`string\` হলো \`System.String\`-এর alias। এটি একটি **reference type** যা অপরিবর্তনীয় (immutable) UTF-16 ইউনিকোড অক্ষরের ক্রম সংরক্ষণ করে।

---

## Immutability — মূল বৈশিষ্ট্য

C#-এর প্রতিটি \`string\` **অপরিবর্তনীয়**: একবার তৈরি হলে তার মান পরিবর্তন করা যায় না। যেকোনো "পরিবর্তন" আসলে একটি **নতুন string অবজেক্ট** তৈরি করে।

\`\`\`csharp
string s = "Hello";
s += " World";   // "Hello" পরিবর্তন হয় না — নতুন "Hello World" তৈরি হয়
\`\`\`

> **পারফরম্যান্স**: লুপে string যোগ করলে অনেক অস্থায়ী অবজেক্ট তৈরি হয়। লুপে \`StringBuilder\` ব্যবহার করুন।

---

## string Literal-এর ধরন

### ১. সাধারণ string Literal
Escape sequence কার্যকর: \`\\n\`, \`\\t\`, \`\\\\\`, \`\\"\`।

\`\`\`csharp
string message = "হ্যালো,\\nবিশ্ব!";  // দুটি লাইনে প্রিন্ট হবে
string path    = "C:\\\\Users\\\\Mostafa"; // backslash-এর জন্য \\\\
\`\`\`

### ২. Verbatim String (\`@\` prefix)
Escape sequence উপেক্ষিত হয়। ফাইল path ও regex-এ আদর্শ।

\`\`\`csharp
string path = @"C:\\Users\\Mostafa\\Documents";  // escape ছাড়াই
\`\`\`

### ৩. Interpolated String (\`$\` prefix)
\`{}\`-এর মধ্যে সরাসরি expression এম্বেড করা যায়।

\`\`\`csharp
string name = "মোস্তাফা";
int age     = 28;
string msg  = $"হ্যালো, {name}! আপনার বয়স {age} বছর।";
string fmt  = $"ব্যালেন্স: {12345.67:F2} টাকা";
\`\`\`

### ৪. Raw String Literal (\`"""\` prefix) — C# 11+
JSON, SQL, HTML সরাসরি কোডে লেখার জন্য।

\`\`\`csharp
string json = """
{
    "name": "মোস্তাফা",
    "age": 28
}
""";
\`\`\`

---

## প্রধান string Property ও Method

| Member | ব্যাখ্যা |
|---|---|
| \`.Length\` | অক্ষরের সংখ্যা |
| \`.ToUpper()\` / \`.ToLower()\` | বড়/ছোট হাতে রূপান্তর |
| \`.Trim()\` | শুরু ও শেষের whitespace সরায় |
| \`.Contains(s)\` | substring আছে কিনা |
| \`.StartsWith(s)\` / \`.EndsWith(s)\` | শুরু/শেষ যাচাই |
| \`.Replace(old, new)\` | সব occurrence প্রতিস্থাপন |
| \`.Split(sep)\` | array-তে বিভক্ত করে |
| \`.IndexOf(s)\` | প্রথম অবস্থান, না পেলে \`-1\` |
| \`string.IsNullOrEmpty(s)\` | null বা খালি কিনা |
| \`string.IsNullOrWhiteSpace(s)\` | null, খালি বা শুধু space কিনা |
| \`string.Join(sep, arr)\` | array-কে separator দিয়ে যোগ করে |

\`\`\`csharp
string text = "  হ্যালো, বিশ্ব!  ";
Console.WriteLine(text.Trim());              // "হ্যালো, বিশ্ব!"
Console.WriteLine(text.Trim().ToUpper());    // "হ্যালো, বিশ্ব!" (uppercase)
Console.WriteLine(text.Contains("বিশ্ব"));  // True

string[] words = "আম,কলা,আনারস".Split(',');
Console.WriteLine(string.Join(" | ", words)); // "আম | কলা | আনারস"
\`\`\`

---

## StringBuilder — লুপে দক্ষ concatenation

\`\`\`csharp
using System.Text;

// ❌ খারাপ — প্রতিবার নতুন string তৈরি হয়
string result = "";
for (int i = 0; i < 1000; i++)
    result += i.ToString();

// ✅ ভালো — StringBuilder
var sb = new StringBuilder();
for (int i = 0; i < 1000; i++)
    sb.Append(i);
string final = sb.ToString();
\`\`\`

---

## Format Specifier

\`\`\`csharp
double pi   = 3.14159265;
decimal amt = 12345.67m;
int count   = 42;

Console.WriteLine($"{pi:F2}");    // 3.14
Console.WriteLine($"{amt:F2}");   // 12345.67
Console.WriteLine($"{count:D5}"); // 00042
Console.WriteLine($"{count:X}");  // 2A (hexadecimal)
\`\`\`

---

## সিনট্যাক্স ও ব্যবহারিক কোড

\`\`\`csharp
string name  = "তানভীর হোসেন";
string upper = name.ToUpper();
bool hasHossain = name.Contains("হোসেন");

string csv    = "১,২,৩,৪,৫";
string[] nums = csv.Split(',');
string joined = string.Join(" + ", nums);

var sb = new StringBuilder();
for (int i = 1; i <= 5; i++)
    sb.Append($"আইটেম{i} ");
Console.WriteLine(sb.ToString().Trim());
\`\`\`

---

## বাস্তব সমস্যা সমাধান

### সমস্যা: Character Type নির্ণয়
*উৎস: Codeforces Assiut — Problem H*

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        char c = char.Parse(Console.ReadLine());

        if (char.IsLower(c))
            Console.WriteLine("Lowercase letter");
        else if (char.IsUpper(c))
            Console.WriteLine("Uppercase letter");
        else if (char.IsDigit(c))
            Console.WriteLine("Digit");
        else
            Console.WriteLine("Special character");
    }
}
\`\`\`

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem H: Character Type](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/H) | Easy | char, IsDigit, IsLower |
| ⚪ | Exercism C# | [Bob](https://exercism.org/tracks/csharp/exercises/bob) | Easy | string methods, Trim |
| ⚪ | Exercism C# | [Pangram](https://exercism.org/tracks/csharp/exercises/pangram) | Easy | ToLower, Contains |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | char array, string |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem H: Character Type",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/H",
        difficulty: "EASY",
        company: "Brain Station 23",
        tags: ["string", "char", "IsDigit", "IsLower"],
        solutionEn: "Use char.IsLower(), char.IsUpper(), and char.IsDigit() to classify the input character.",
        solutionBn: "char.IsLower(), char.IsUpper(), char.IsDigit() মেথড ব্যবহার করে character শ্রেণীবদ্ধ করুন।",
      },
      {
        source: "Exercism C#",
        name: "Bob",
        url: "https://exercism.org/tracks/csharp/exercises/bob",
        difficulty: "EASY",
        company: null,
        tags: ["string", "Trim", "ToUpper", "EndsWith"],
        solutionEn: "Check if the input ends with '?', is all uppercase, or is empty/whitespace using string methods.",
        solutionBn: "string মেথড ব্যবহার করে ইনপুট প্রশ্নবোধক দিয়ে শেষ, সব uppercase, বা খালি কিনা যাচাই করুন।",
      },
      {
        source: "Exercism C#",
        name: "Pangram",
        url: "https://exercism.org/tracks/csharp/exercises/pangram",
        difficulty: "EASY",
        company: null,
        tags: ["ToLower", "Contains", "LINQ"],
        solutionEn: "Convert to lowercase and check that all 26 alphabet letters appear using LINQ or a loop.",
        solutionBn: "ToLower() করে প্রতিটি বর্ণমালার অক্ষর আছে কিনা LINQ বা লুপ দিয়ে যাচাই করুন।",
      },
      {
        source: "Exercism C#",
        name: "Reverse String",
        url: "https://exercism.org/tracks/csharp/exercises/reverse-string",
        difficulty: "EASY",
        company: null,
        tags: ["string", "char array", "new string()"],
        solutionEn: "Convert to char array, reverse it, and construct a new string from the reversed chars.",
        solutionBn: "char array-তে রূপান্তর করুন, উল্টে দিন এবং নতুন string তৈরি করুন।",
      },
    ],
  };
