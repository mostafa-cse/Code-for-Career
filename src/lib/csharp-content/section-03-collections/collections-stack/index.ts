import type { LocalLesson } from "@/lib/lessons-data";

export const collectionsStackLesson: LocalLesson = {
    slug: "collections-stack",
    titleEn: "Stack<T>",
    titleBn: "স্ট্যাক (Stack<T>) ও লাস্ট-ইন-ফার্স্ট-আউট (LIFO)",
    categoryEn: "03. Collections",
    categoryBn: "০৩. কালেকশনস ও ডেটা স্ট্রাকচার",
    categoryDescEn:
      "Essential data structures in .NET: fixed arrays, dynamic lists, hash-based sets and dictionaries, and FIFO/LIFO queues.",
    categoryDescBn:
      ".NET এর অপরিহার্য ডেটা স্ট্রাকচার: ফিক্সড অ্যারে, ডায়নামিক লিস্ট, হ্যাশ ডিকশনারি, সেট এবং কিউ/স্ট্যাক।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "LIFO (Last-In, First-Out) stack semantics, Push, Pop, Peek in O(1), expression parsing, bracket matching, and monotonic stacks.",
    descriptionBn:
      "লিফো (LIFO) কাঠামো, Push, Pop ও Peek অপারেশনের ধ্রুবক O(1) গতি, ব্র্যাকেট ম্যাচিং, এক্সপ্রেশন পার্সিং এবং মনোটোনিক স্ট্যাক।",
    difficulty: "EASY",
    displayOrder: 6,
    prerequisites: ["collections-list"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# Stack<T> in C#

\`System.Collections.Generic.Stack<T>\` represents a **Last-In, First-Out (LIFO)** collection of elements. The most recently added element is always the first to be retrieved, mirroring physical stacks of trays, browser history, and function call frames.

---

## 1. Internal Architecture: The Flat Array & Top Pointer

Under the hood, \`Stack<T>\` is backed by a **flat, primitive array** (\`T[] _array\`) and an integer (\`int _size\`) that serves dual duty as both the active count and the top pointer.

Because every insertion (\`Push\`) and removal (\`Pop\`) occurs strictly at the **tail of the array**:
- **Zero Element Shifting**: No elements ever shift positions in memory.
- **Extreme Cache Locality**: Because recently pushed elements occupy consecutive memory slots at the top, they almost always reside in ultra-fast L1 CPU cache.

\`\`\`
Push("A") ──► Push("B") ──► Push("C")
Array:  [ "A" | "B" | "C" | null | null ]
                        ▲
                        │
                  _size = 3 (Top = index 2)
\`\`\`

### Push & Pop Low-Level Execution:
\`\`\`csharp
// Push lowers to:
if (_size == _array.Length) Array.Resize(ref _array, _array.Length * 2);
_array[_size++] = item;

// Pop lowers to:
T item = _array[--_size];
_array[_size] = default!; // Clears reference so GC can reclaim memory
return item;
\`\`\`

---

## 2. Core Operations & Time Complexities

| Operation | Method | Time Complexity | Throws if Empty? |
|---|---|---|---|
| **Push to Top** | \`Push(item)\` | **$O(1)$ Amortized** | No |
| **Pop from Top** | \`Pop()\` | **$O(1)$** | **Yes** (\`InvalidOperationException\`) |
| **Inspect Top** | \`Peek()\` | **$O(1)$** | **Yes** (\`InvalidOperationException\`) |
| **Safe Pop** | \`TryPop(out item)\` | **$O(1)$** | **No** (returns \`false\`) |
| **Safe Peek** | \`TryPeek(out item)\` | **$O(1)$** | **No** (returns \`false\`) |
| **Linear Search** | \`Contains(item)\` | **$O(N)$** | No |

---

## 3. Foundational Software Engineering Applications

### A. Syntax Parsing & Delimiter Matching
Verifying that opening tags and brackets match corresponding closers in compilers, IDEs, and JSON parsers.

### B. Expression Evaluation (Shunting-Yard & Postfix)
Evaluating Reverse Polish Notation (RPN) mathematical expressions without recursive overhead:

\`\`\`csharp
// Evaluating postfix expression: "5 3 + 2 *" => (5 + 3) * 2 = 16
string[] tokens = { "5", "3", "+", "2", "*" };
Stack<int> evalStack = new Stack<int>();

foreach (string token in tokens)
{
    if (int.TryParse(token, out int num))
    {
        evalStack.Push(num);
    }
    else
    {
        int right = evalStack.Pop();
        int left = evalStack.Pop();
        evalStack.Push(token switch
        {
            "+" => left + right,
            "-" => left - right,
            "*" => left * right,
            "/" => left / right,
            _ => throw new InvalidOperationException()
        });
    }
}

Console.WriteLine($"Result: {evalStack.Pop()}"); // 16
\`\`\`

### C. Eliminating Recursion Stack Overflow
Deep recursive functions can crash with a fatal \`StackOverflowException\` when call depth exceeds 10,000 frames. Moving state to a heap-allocated \`Stack<T>\` enables Depth-First Search (DFS) on millions of nodes safely:

\`\`\`csharp
Stack<TreeNode> dfsStack = new Stack<TreeNode>();
dfsStack.Push(root);

while (dfsStack.TryPop(out var node))
{
    Console.WriteLine(node.Value);
    if (node.Right != null) dfsStack.Push(node.Right);
    if (node.Left != null) dfsStack.Push(node.Left);
}
\`\`\`

---

## 4. Comparison: \`Stack<T>\` vs \`Queue<T>\` vs \`List<T>\`

| Criteria | \`Stack<T>\` | \`Queue<T>\` | \`List<T>\` |
|---|---|---|---|
| **Access Principle** | **LIFO** (Last-In, First-Out) | **FIFO** (First-In, First-Out) | **Indexable** (Random access) |
| **Internal Storage** | Flat array (top pointer) | Circular array ring buffer | Flat array with indexer |
| **Add Element** | \`Push(x)\` ($O(1)$) | \`Enqueue(x)\` ($O(1)$) | \`Add(x)\` ($O(1)$) |
| **Remove Element** | \`Pop()\` ($O(1)$) | \`Dequeue()\` ($O(1)$) | \`RemoveAt(i)\` ($O(N)$) |
| **Primary Use Cases** | Syntax checks, DFS, Undo | Task queues, BFS, Spooling | General data collections |

---

## Practical Problem Walkthrough

### Problem: Balanced Brackets Matching
*Source: Exercism C# Track — Matching Brackets*

**Problem Statement**:
Given a string containing brackets (\`(\`, \`)\`, \`{\`, \`}\`, \`[\`, \`]\`), verify whether all brackets are paired correctly and nested properly.

### C# Solution:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static bool IsPaired(string input)
    {
        Stack<char> bracketStack = new Stack<char>();

        foreach (char ch in input)
        {
            // Push opening brackets
            if (ch == '(' || ch == '{' || ch == '[')
            {
                bracketStack.Push(ch);
            }
            // Match closing brackets
            else if (ch == ')' || ch == '}' || ch == ']')
            {
                if (bracketStack.Count == 0)
                {
                    return false; // Closing bracket with no opening counterpart
                }

                char open = bracketStack.Pop();

                if ((ch == ')' && open != '(') ||
                    (ch == '}' && open != '{') ||
                    (ch == ']' && open != '['))
                {
                    return false; // Mismatched bracket types
                }
            }
        }

        // Must be empty for all brackets to have matched
        return bracketStack.Count == 0;
    }

    public static void Main()
    {
        string valid = "{ [ ( ) ] }";
        string invalid = "{ [ ( ] ) }";

        Console.WriteLine($"Valid: {IsPaired(valid)}");     // True
        Console.WriteLine($"Invalid: {IsPaired(invalid)}"); // False
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N)$ — single linear scan of $N$ characters in the input string.
- **Space Complexity**: $O(N)$ worst-case — where all characters are opening brackets stored on the stack.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Matching Brackets](https://exercism.org/tracks/csharp/exercises/matching-brackets) | Easy | Stack LIFO, Bracket balancing |
| ⚪ | Exercism C# | [Forth](https://exercism.org/tracks/csharp/exercises/forth) | Hard | Stack-based language interpreter |
| ⚪ | Codeforces Assiut | [Problem F: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | Array reversing via Stack |
| ⚪ | Codeforces Assiut | [Problem Q: Digits](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/Q) | Easy | Number parsing, LIFO order |
`,

    contentBn: `# C# এ স্ট্যাক (Stack<T>) ও লাস্ট-ইন-ফার্স্ট-আউট (LIFO)

\`System.Collections.Generic.Stack<T>\` হলো একটি **লাস্ট-ইন, ফার্স্ট-আউট (Last-In, First-Out বা LIFO)** ডেটা স্ট্রাকচার। যে উপাদানটি সবার শেষে যোগ করা হয়, সেটিই সবার প্রথমে বের হয়ে আসে। এটি এক স্তূপ প্লেটের মতো, যেখানে সবার উপরে রাখা প্লেটটিই প্রথমে তুলে নেওয়া হয়।

---

## ১. অভ্যন্তরীণ আর্কিটেকচার: ফ্ল্যাট অ্যারে ও টপ পয়েন্টার

\`Stack<T>\` এর অভ্যন্তরে একটি আদিম ফ্ল্যাট অ্যারে (\`T[] _array\`) এবং একটি পূর্ণসংখ্যা (\`int _size\`) থাকে যা একই সাথে উপাদানের সংখ্যা ও টপ ইনডেক্স ট্র্যাক করে।

যেহেতু উপাদান সংযোজন (\`Push\`) এবং অপসারণ (\`Pop\`) শুধুমাত্র অ্যারের **একদম শেষ প্রান্তে** ঘটে:
- **কোনো উপাদান সরাতে হয় না**: মেমোরির অন্য কোনো উপাদান এক ঘরও নড়াচড়া করে না।
- **সর্বোচ্চ ক্যাশ লোকালিটি**: সম্প্রতি পুশ করা উপাদানগুলো মেমোরিতে পাশাপাশি থাকায় সরাসরি সিপিইউ-এর দ্রুততম L1 ক্যাশ মেমোরিতে অবস্থান করে।

---

## ২. প্রধান অপারেশন ও সময় জটিলতা

| অপারেশন | মেথড | সময় জটিলতা | খালি থাকলে এরর দেয়? |
|---|---|---|---|
| **টপে যোগ করা** | \`Push(item)\` | **$O(1)$ Amortized** | না |
| **টপ থেকে বের করা** | \`Pop()\` | **$O(1)$** | **হ্যাঁ** (\`InvalidOperationException\`) |
| **টপ উপাদান দেখা** | \`Peek()\` | **$O(1)$** | **হ্যাঁ** (\`InvalidOperationException\`) |
| **নিরাপদ পপ** | \`TryPop(out item)\` | **$O(1)$** | **না** (\`false\` রিটার্ন করে) |
| **নিরাপদ পিক** | \`TryPeek(out item)\` | **$O(1)$** | **না** (\`false\` রিটার্ন করে) |
| **লিনিয়ার সার্চ** | \`Contains(item)\` | **$O(N)$** | না |

---

## ৩. সফটওয়্যার ইঞ্জিনিয়ারিংয়ে স্ট্যাকের মৌলিক প্রয়োগ

### ক. ব্র্যাকেট ও ট্যাগ ম্যাচিং (Syntax Validation)
কম্পাইলার ও কোড এডিটরে বন্ধনী (\`()\`, \`{}\`, \`[]\`) বা এইচটিএমএল ট্যাগ সঠিকভাবে খোলা ও বন্ধ হয়েছে কি না তা যাচাই করা।

### খ. এক্সপ্রেশন ইভ্যালুয়েশন (Postfix / RPN)
গাণিতিক হিসাব স্বয়ংক্রিয়ভাবে সমাধান করার জন্য পোস্টফিক্স এক্সপ্রেশন পার্সিং:

\`\`\`csharp
string[] tokens = { "5", "3", "+", "2", "*" };
Stack<int> evalStack = new Stack<int>();

foreach (string token in tokens)
{
    if (int.TryParse(token, out int num))
    {
        evalStack.Push(num);
    }
    else
    {
        int right = evalStack.Pop();
        int left = evalStack.Pop();
        evalStack.Push(token switch
        {
            "+" => left + right,
            "-" => left - right,
            "*" => left * right,
            "/" => left / right,
            _ => throw new InvalidOperationException()
        });
    }
}

Console.WriteLine($"ফলাফল: {evalStack.Pop()}"); // 16
\`\`\`

### গ. রিকার্শনে স্ট্যাক ওভারফ্লো প্রতিরোধ
খুব গভীর রিকার্সিভ ফাংশন কল স্ট্যাকের সীমা অতিক্রম করে ক্র্যাশ করতে পারে। মেমোরি হিপে \`Stack<T>\` তৈরি করে ডেপথ-ফার্স্ট সার্চ (DFS) চালালে লক্ষ লক্ষ নোড নিরাপদে ব্রাউজ করা যায়।

---

## ৪. তুলনামূলক সারণী: \`Stack<T>\` বনাম \`Queue<T>\` বনাম \`List<T>\`

| মানদণ্ড | \`Stack<T>\` | \`Queue<T>\` | \`List<T>\` |
|---|---|---|---|
| **নীতি** | **LIFO** (লাস্ট-ইন, ফার্স্ট-আউট) | **FIFO** (ফার্স্ট-ইন, ফার্স্ট-আউট) | **ইনডেক্সযোগ্য** (র‍্যান্ডম এক্সেস) |
| **অভ্যন্তরীণ মেমোরি** | ফ্ল্যাট অ্যারে (টপ পয়েন্টার) | সার্কুলার রিং বাফার | ফ্ল্যাট অ্যারে ও ইনডেক্সার |
| **উপাদান যোগ** | \`Push(x)\` ($O(1)$) | \`Enqueue(x)\` ($O(1)$) | \`Add(x)\` ($O(1)$) |
| **উপাদান অপসারণ** | \`Pop()\` ($O(1)$) | \`Dequeue()\` ($O(1)$) | \`RemoveAt(i)\` ($O(N)$) |
| **মূল ব্যবহার** | ব্যাকট্র্যাকিং, ব্র্যাকেট চেক, DFS | টাস্ক শিডিউলার, বাফারিং, BFS | সাধারণ ডেটা সংরক্ষণ |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: বন্ধনীর জোড়া যাচাইকরণ (Matching Brackets)
*উৎস: এক্সারসিজম সি# ট্র্যাক — Matching Brackets*

**সমস্যা পরিচিতি**:
একটি স্ট্রিংয়ে বিভিন্ন ধরনের ব্র্যাকেট (\`(\`, \`)\`, \`{\`, \`}\`, \`[\`, \`]\`) দেওয়া থাকবে। প্রতিটি শুরুর ব্র্যাকেটের জন্য সঠিক শেষের ব্র্যাকেট সঠিক ক্রমানুসারে রয়েছে কি না তা যাচাই করুন।

### সি# সমাধান:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static bool IsPaired(string input)
    {
        Stack<char> bracketStack = new Stack<char>();

        foreach (char ch in input)
        {
            // শুরুর ব্র্যাকেট স্ট্যাকে জমা রাখা
            if (ch == '(' || ch == '{' || ch == '[')
            {
                bracketStack.Push(ch);
            }
            // শেষের ব্র্যাকেট মিলিয়ে দেখা
            else if (ch == ')' || ch == '}' || ch == ']')
            {
                if (bracketStack.Count == 0)
                {
                    return false; // শুরুর ব্র্যাকেট ছাড়াই শেষের ব্র্যাকেট পাওয়া গেছে
                }

                char open = bracketStack.Pop();

                if ((ch == ')' && open != '(') ||
                    (ch == '}' && open != '{') ||
                    (ch == ']' && open != '['))
                {
                    return false; // ব্র্যাকেটের ধরন মেলেনি
                }
            }
        }

        // সব ব্র্যাকেট সঠিকভাবে মিলে গেলে স্ট্যাক খালি থাকবে
        return bracketStack.Count == 0;
    }

    public static void Main()
    {
        string valid = "{ [ ( ) ] }";
        string invalid = "{ [ ( ] ) }";

        Console.WriteLine($"Valid: {IsPaired(valid)}");     // True
        Console.WriteLine($"Invalid: {IsPaired(invalid)}"); // False
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N)$ — $N$ দৈর্ঘ্যের স্ট্রিংয়ের প্রতিটি অক্ষর একবার স্ক্যান করা হয়।
- **স্পেস কমপ্লেক্সিটি**: $O(N)$ — সর্বোচ্চ ক্ষেত্রে সমস্ত অক্ষর শুরুর ব্র্যাকেট হলে স্ট্যাকে $N$ মেমোরি লাগে।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Matching Brackets](https://exercism.org/tracks/csharp/exercises/matching-brackets) | Easy | Stack LIFO, Bracket balancing |
| ⚪ | Exercism C# | [Forth](https://exercism.org/tracks/csharp/exercises/forth) | Hard | Stack-based language interpreter |
| ⚪ | Codeforces Assiut | [Problem F: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | Array reversing via Stack |
| ⚪ | Codeforces Assiut | [Problem Q: Digits](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/Q) | Easy | Number parsing, LIFO order |
`,
    resources: [],
    problems: [
      {
        source: "Exercism C#",
        name: "Matching Brackets",
        url: "https://exercism.org/tracks/csharp/exercises/matching-brackets",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Stack", "Parsing", "Brackets"],
        solutionEn: "Push opening brackets and pop to verify matching pairs upon encountering closing brackets.",
        solutionBn: "শুরুর ব্র্যাকেট পুশ করুন এবং শেষের ব্র্যাকেট পেলে পপ করে সমতা নিশ্চিত করুন।",
      },
      {
        source: "Exercism C#",
        name: "Forth",
        url: "https://exercism.org/tracks/csharp/exercises/forth",
        difficulty: "HARD",
        company: null,
        tags: ["Stack", "Interpreter", "Parsing"],
        solutionEn: "Simulate a stack-based virtual machine evaluating arithmetic, swap, dup, and drop operators.",
        solutionBn: "স্ট্যাক-ভিত্তিক ভার্চুয়াল মেশিন তৈরি করে পাটিগণিত ও স্ট্যাক ম্যানিপুলেশন এক্সিকিউট করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem F: Reversing",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Stack", "Arrays", "LIFO"],
        solutionEn: "Push all elements onto a stack and pop them sequentially to produce reversed output.",
        solutionBn: "সমস্ত উপাদান স্ট্যাকে পুশ করে ক্রমানুসারে পপ করে বিপরীতমুখী আউটপুট তৈরি করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #2",
        name: "Problem Q: Digits",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/Q",
        difficulty: "EASY",
        company: "Therap",
        tags: ["Stack", "Math", "Digits"],
        solutionEn: "Stack extracted digits to reverse or maintain specific number ordering.",
        solutionBn: "অঙ্কগুলো স্ট্যাকে রেখে প্রয়োজনীয় ক্রম বজায় রেখে আউটপুট দিন।",
      },
    ],
  };
