import type { LocalLesson } from "@/lib/lessons-data";

export const csharpDoWhileLoopLesson: LocalLesson = {
    slug: "csharp-do-while-loop",
    titleEn: "do-while Loop",
    titleBn: "ডু-হোয়াইল (do-while) লুপ",
    categoryEn: "02. Control Flow",
    categoryBn: "০২. কন্ট্রোল ফ্লো ও শর্তাধীন লজিক",
    categoryDescEn:
      "Decision-making statements, pattern matching switches, iteration loops, and performance implications of loop constructs.",
    categoryDescBn:
      "শর্তাধীন সিদ্ধান্ত গ্রহণ, সুইচ স্টেটমেন্ট, বিভিন্ন ধরনের লুপ এবং পুনরাবৃত্তিমূলক লজিক।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Post-condition evaluation, guaranteed execution pass, interactive menus, input validation, and scope boundaries in C#.",
    descriptionBn:
      "পরবর্তী-শর্তাধীন ডু-হোয়াইল লুপ, কমপক্ষে একবার নিশ্চিত এক্সিকিউশন, কনসোল মেনু, ইনপুট ভ্যালিডেশন এবং স্কোপের সীমাবদ্ধতা।",
    difficulty: "EASY",
    displayOrder: 5,
    prerequisites: ["csharp-while-loop"],
    estimatedMinutes: 25,
    lastUpdated: "Recently updated",
    contentEn: `# do-while Loop in C#

The \`do-while\` statement executes a statement or block of code repeatedly until a specified boolean condition evaluates to \`false\`. Because the condition is tested **after** the loop body runs (post-test), a \`do-while\` loop is **guaranteed to execute at least once**.

---

## 1. Syntax & Post-Test Mechanics

Notice the required **closing semicolon** at the end of the statement:

\`\`\`csharp
do
{
    // Statements execute at least once
} while (booleanCondition); // Semicolon is mandatory!
\`\`\`

### Post-Test Execution Guarantee:
Even if the condition is initially \`false\`, the body runs once before checking:

\`\`\`csharp
bool shouldContinue = false;

do
{
    Console.WriteLine("This prints exactly once, even though condition is false!");
} while (shouldContinue);
\`\`\`

---

## 2. Variable Scope Rules: The Boundary Trap

A common beginner mistake in C# is declaring a variable inside the \`do\` block and attempting to read it in the \`while\` condition:

\`\`\`csharp
// ❌ COMPILE ERROR: 'choice' is out of scope in while condition
do
{
    int choice = int.Parse(Console.ReadLine()!);
} while (choice != 0);

// ✅ CORRECT: Declare variable BEFORE entering the do block
int choice;
do
{
    choice = int.Parse(Console.ReadLine()!);
} while (choice != 0);
\`\`\`

> **Scope Principle**: Variables declared inside curly braces \`{}\` are destroyed when execution leaves that scope block. The \`while (condition);\` check sits outside the \`do { }\` block scope.

---

## 3. Real-World Production Patterns

### A. Console Menus & User CLI Prompts
Displaying an options menu, reading user choice, and repeating until an exit command is given:

\`\`\`csharp
int option;

do
{
    Console.WriteLine("=== SYSTEM MENU ===");
    Console.WriteLine("1. View Profile");
    Console.WriteLine("2. Check Balance");
    Console.WriteLine("0. Exit");
    Console.Write("Enter option: ");

    if (!int.TryParse(Console.ReadLine(), out option))
    {
        Console.WriteLine("Invalid input! Please enter a number.");
        option = -1; // Reset to invalid to trigger loop repeat
    }

} while (option != 0);

Console.WriteLine("Exited successfully.");
\`\`\`

### B. Defensive Input Validation
Prompting the user until valid, positive data is entered:

\`\`\`csharp
int validAge;
bool isValid;

do
{
    Console.Write("Enter your age (1 - 120): ");
    string? input = Console.ReadLine();

    isValid = int.TryParse(input, out validAge) && validAge >= 1 && validAge <= 120;

    if (!isValid)
    {
        Console.WriteLine("Error: Age must be an integer between 1 and 120.");
    }

} while (!isValid);

Console.WriteLine($"Verified age: {validAge}");
\`\`\`

### C. Network Request Retry with Backoff
\`\`\`csharp
int attempts = 0;
const int MaxAttempts = 3;
bool isConnected = false;

do
{
    attempts++;
    Console.WriteLine($"Attempt {attempts}: Connecting to database...");

    isConnected = TryDatabaseConnection();

    if (!isConnected && attempts < MaxAttempts)
    {
        Thread.Sleep(1000 * attempts); // Exponential wait
    }

} while (!isConnected && attempts < MaxAttempts);
\`\`\`

---

## 4. Comparison: \`do-while\` vs \`while\` vs \`for\`

| Criteria | \`do-while\` | \`while\` | \`for\` |
|---|---|---|---|
| **Condition Check Timing** | **After** body (Post-test) | **Before** body (Pre-test) | **Before** body (Pre-test) |
| **Minimum Executions** | **At least 1** | 0 | 0 |
| **Scope of Condition Var** | Outside loop | Outside loop | Inside loop header |
| **Syntax Quirk** | Requires trailing \`;\` | No trailing \`;\` | Semicolons separate clauses |
| **Primary Intent** | Prompting, retry loops | Stream/EOF, math loop | Counter range, array index |

---

## Practical Problem Walkthrough

### Problem: Fixed Password Authentication Loop
*Source: Codeforces Assiut University Training Sheet #2 — Problem D*

**Problem Statement**:
Given multiple integer password attempts from input lines. Keep reading and printing \`"Wrong"\` for every incorrect attempt until the secret password \`1999\` is entered. At that point, print \`"Correct"\` and terminate the program.

**Constraints**:
Input contains numbers between $1000$ and $9999$. There is guaranteed to be a line containing $1999$.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        int enteredPassword;

        do
        {
            string? line = Console.ReadLine();
            if (line == null) break;

            enteredPassword = int.Parse(line.Trim());

            if (enteredPassword == 1999)
            {
                Console.WriteLine("Correct");
                break;
            }
            else
            {
                Console.WriteLine("Wrong");
            }

        } while (enteredPassword != 1999);
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(K)$ where $K$ is the number of password attempts until \`1999\` is entered. Each attempt takes $O(1)$ time.
- **Space Complexity**: $O(1)$ — constant memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem D: Fixed Password](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/D) | Easy | Sentinel loop, Input validation |
| ⚪ | Codeforces Assiut | [Problem K: Divisors](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/K) | Easy | Factor discovery, Loop testing |
| ⚪ | Codeforces Assiut | [Problem N: Numbers Histogram](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/N) | Easy | Nested loop patterns, Formatting |
| ⚪ | Exercism C# | [Resistor Color](https://exercism.org/tracks/csharp/exercises/resistor-color) | Easy | Arrays, Lookup loops |
`,

    contentBn: `# C# এ ডু-হোয়াইল (do-while) লুপ

\`do-while\` স্টেটমেন্ট কোডের একটি অংশ বা ব্লককে বারবার কার্যকর করে যতক্ষণ না নির্দিষ্ট বুলিয়ান শর্তটি \`false\` হয়। যেহেতু শর্তটি লুপ বডি কার্যকর হওয়ার **পরে** যাচাই করা হয় (Post-test), তাই একটি \`do-while\` লুপ **কমপক্ষে একবার চলা নিশ্চিত**।

---

## ১. গঠন ও পরবর্তী-শর্তাধীন (Post-Test) যাচাইকরণ

লক্ষ্য করুন, ডু-হোয়াইল লুপের শেষে একটি **সেমিকোলন (\`;\`) দেওয়া বাধ্যতামূলক**:

\`\`\`csharp
do
{
    // কোড ব্লকটি কমপক্ষে একবার চলবেই
} while (booleanCondition); // সেমিকোলন দেওয়া বাধ্যতামূলক!
\`\`\`

### নিশ্চিত এক্সিকিউশন গ্যারান্টি:
শর্তটি যদি শুরু থেকেই \`false\` হয়, তবুও কোড ব্লকটি শর্ত যাচাই করার পূর্বে একবার চলবে:

\`\`\`csharp
bool shouldContinue = false;

do
{
    Console.WriteLine("শর্ত false হওয়া সত্ত্বেও এটি ঠিক একবার প্রিন্ট হবে!");
} while (shouldContinue);
\`\`\`

---

## ২. চলকের স্কোপের সীমাবদ্ধতা

নতুন ডেভেলপারদের একটি সাধারণ ভুল হলো \`do\` ব্লকের ভেতর চলক ডিক্লেয়ার করে তা \`while\` কন্ডিশনে ব্যবহার করার চেষ্টা করা:

\`\`\`csharp
// ❌ কম্পাইল এরর: 'choice' চলকটি while ব্লকের বাইরে থাকায় পাওয়া যাবে না
do
{
    int choice = int.Parse(Console.ReadLine()!);
} while (choice != 0);

// ✅ সঠিক নিয়ম: do ব্লকে প্রবেশের পূর্বেই চলক ডিক্লেয়ার করুন
int choice;
do
{
    choice = int.Parse(Console.ReadLine()!);
} while (choice != 0);
\`\`\`

> **স্কোপের নিয়ম**: সেকেন্ড ব্র্যাকেটের \`{}\` ভেতরে ডিক্লেয়ার করা চলকের জীবনকাল সেই ব্লকের শেষেই বিলুপ্ত হয়। \`while (condition);\` অংশটি মূলত \`do { }\` ব্লকের বাইরে অবস্থান করে।

---

## ৩. বাস্তব সফটওয়্যার ডেভেলপমেন্টে প্রয়োগ

### ক. কনসোল মেনু ও ইন্টারঅ্যাক্টিভ ইউজার প্রম্পট
ব্যবহারকারীকে প্রথমে অপশন তালিকা দেখানো, ইনপুট নেওয়া এবং প্রস্থান নির্দেশ না পাওয়া পর্যন্ত পুনরাবৃত্তি করা:

\`\`\`csharp
int option;

do
{
    Console.WriteLine("=== SYSTEM MENU ===");
    Console.WriteLine("1. View Profile");
    Console.WriteLine("2. Check Balance");
    Console.WriteLine("0. Exit");
    Console.Write("Enter option: ");

    if (!int.TryParse(Console.ReadLine(), out option))
    {
        Console.WriteLine("Invalid input! Please enter a number.");
        option = -1;
    }

} while (option != 0);

Console.WriteLine("Exited successfully.");
\`\`\`

### খ. ইউজার ইনপুট যাচাইকরণ (Input Validation)
সঠিক ইনপুট না দেওয়া পর্যন্ত ব্যবহারকারীকে পুনরায় ইনপুট দেওয়ার সুযোগ দেওয়া:

\`\`\`csharp
int validAge;
bool isValid;

do
{
    Console.Write("Enter your age (1 - 120): ");
    string? input = Console.ReadLine();

    isValid = int.TryParse(input, out validAge) && validAge >= 1 && validAge <= 120;

    if (!isValid)
    {
        Console.WriteLine("Error: Age must be an integer between 1 and 120.");
    }

} while (!isValid);

Console.WriteLine($"Verified age: {validAge}");
\`\`\`

### গ. নেটওয়ার্ক রিকোয়েস্ট রিট্রাই লজিক
\`\`\`csharp
int attempts = 0;
const int MaxAttempts = 3;
bool isConnected = false;

do
{
    attempts++;
    Console.WriteLine($"Attempt {attempts}: Connecting to database...");

    isConnected = TryDatabaseConnection();

    if (!isConnected && attempts < MaxAttempts)
    {
        Thread.Sleep(1000 * attempts);
    }

} while (!isConnected && attempts < MaxAttempts);
\`\`\`

---

## ৪. তুলনামূলক বিশ্লেষণ: \`do-while\` বনাম \`while\` বনাম \`for\`

| মানদণ্ড | \`do-while\` লুপ | \`while\` লুপ | \`for\` লুপ |
|---|---|---|---|
| **শর্ত যাচাইয়ের সময়** | বডির **পরে** (Post-test) | বডির **পূর্বে** (Pre-test) | বডির **পূর্বে** (Pre-test) |
| **সর্বনিম্ন এক্সিকিউশন** | **কমপক্ষে ১ বার** | ০ বার | ০ বার |
| **কন্ডিশন ভ্যারিয়েবলের স্কোপ** | লুপের বাইরে | লুপের বাইরে | লুপ হেডারে সীমাবদ্ধ |
| **সিনট্যাক্স বৈশিষ্ট্য** | শেষে সেমিকোলন \`;\` আবশ্যক | সেমিকোলন থাকে না | সেমিকোলন দিয়ে অংশ বিভক্ত |
| **প্রধান ব্যবহার** | মেনু, রিট্রাই, ইনপুট যাচাই | স্ট্রিম/EOF, গাণিতিক ধারা | অ্যারে ট্রাভার্সাল, নির্দিষ্ট রেঞ্জ |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: স্থায়ী পাসওয়ার্ড যাচাইকরণ লুপ (Fixed Password)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #২ — Problem D*

**সমস্যা পরিচিতি**:
ইনপুট থেকে ধারাবাহিকভাবে পাসওয়ার্ড নেওয়ার চেষ্টা করা হবে। যতক্ষণ পর্যন্ত গোপন পাসওয়ার্ড \`1999\` প্রবেশ করানো না হবে, ততক্ষণ প্রতিটি ভুল চেষ্টার জন্য \`"Wrong"\` প্রিন্ট করতে হবে। সঠিক পাসওয়ার্ড মিললে \`"Correct"\` প্রিন্ট করে প্রোগ্রাম শেষ করতে হবে।

**সীমাবদ্ধতা**:
ইনপুট সংখ্যাসমূহ $1000$ থেকে $9999$ এর মধ্যে। ইনপুটে অবশ্যই অন্তত একবার $1999$ উপস্থিত থাকবে।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        int enteredPassword;

        do
        {
            string? line = Console.ReadLine();
            if (line == null) break;

            enteredPassword = int.Parse(line.Trim());

            if (enteredPassword == 1999)
            {
                Console.WriteLine("Correct");
                break;
            }
            else
            {
                Console.WriteLine("Wrong");
            }

        } while (enteredPassword != 1999);
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(K)$ — যেখানে $K$ হলো সঠিক পাসওয়ার্ড পাওয়ার পূর্ব পর্যন্ত মোট চেষ্টার সংখ্যা। প্রতি চেষ্টার জন্য ধ্রুবক সময় লাগে।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ — নির্দিষ্ট ধ্রুবক মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem D: Fixed Password](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/D) | Easy | Sentinel loop, Input validation |
| ⚪ | Codeforces Assiut | [Problem K: Divisors](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/K) | Easy | Factor discovery, Loop testing |
| ⚪ | Codeforces Assiut | [Problem N: Numbers Histogram](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/N) | Easy | Nested loop patterns, Formatting |
| ⚪ | Exercism C# | [Resistor Color](https://exercism.org/tracks/csharp/exercises/resistor-color) | Easy | Arrays, Lookup loops |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem D: Fixed Password",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/D",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["do-while", "Loops", "Validation"],
        solutionEn: "Prompt and read attempts repeatedly, checking if input equals 1999.",
        solutionBn: "পাসওয়ার্ড ১৯99 হওয়ার পূর্ব পর্যন্ত ইনপুট গ্রহণ ও যাচাই অব্যাহত রাখুন।",
      },
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem K: Divisors",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/K",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Loops", "Math", "Divisors"],
        solutionEn: "Iterate from 1 to N and print i if N % i == 0.",
        solutionBn: "১ থেকে N পর্যন্ত লুপ চালিয়ে N % i == 0 শর্তে গুণনীয়কগুলো প্রিন্ট করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem N: Numbers Histogram",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/N",
        difficulty: "EASY",
        company: "Therap",
        tags: ["Loops", "Formatting", "Histogram"],
        solutionEn: "Print a given character repeated according to the frequency array elements.",
        solutionBn: "অ্যারের প্রতিটি সংখ্যার সমান সংখ্যক বার নির্দিষ্ট চিহ্নটি নতুন লাইনে প্রিন্ট করুন।",
      },
      {
        source: "Exercism C#",
        name: "Resistor Color",
        url: "https://exercism.org/tracks/csharp/exercises/resistor-color",
        difficulty: "EASY",
        company: null,
        tags: ["Arrays", "Loops", "Lookup"],
        solutionEn: "Map resistor color bands to integer values by searching the color array.",
        solutionBn: "কালার অ্যারে সার্চ করে রেজিস্টরের ব্যান্ডের রঙের সাংখ্যিক মান বের করুন।",
      },
    ],
  };
