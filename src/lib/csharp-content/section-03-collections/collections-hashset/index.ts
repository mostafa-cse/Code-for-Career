import type { LocalLesson } from "@/lib/lessons-data";

export const collectionsHashsetLesson: LocalLesson = {
    slug: "collections-hashset",
    titleEn: "HashSet<T>",
    titleBn: "হ্যাশসেট (HashSet<T>) ও ইউনিক উপাদান",
    categoryEn: "03. Collections",
    categoryBn: "০৩. কালেকশনস ও ডেটা স্ট্রাকচার",
    categoryDescEn:
      "Essential data structures in .NET: fixed arrays, dynamic lists, hash-based sets and dictionaries, and FIFO/LIFO queues.",
    categoryDescBn:
      ".NET এর অপরিহার্য ডেটা স্ট্রাকচার: ফিক্সড অ্যারে, ডায়নামিক লিস্ট, হ্যাশ ডিকশনারি, সেট এবং কিউ/স্ট্যাক।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "Mathematical sets, uniqueness guarantees, average O(1) membership testing, UnionWith, IntersectWith, and HashSet vs SortedSet.",
    descriptionBn:
      "অনন্য উপাদান সংরক্ষণ, গড় O(1) মেম্বারশিপ যাচাই, গাণিতিক সেট অপারেশন (ইউনিয়ন, ইন্টারসেকশন) এবং HashSet বনাম SortedSet।",
    difficulty: "EASY",
    displayOrder: 4,
    prerequisites: ["collections-dictionary"],
    estimatedMinutes: 25,
    lastUpdated: "Recently updated",
    contentEn: `# HashSet<T> in C#

\`System.Collections.Generic.HashSet<T>\` is an unordered collection of distinct elements. It prevents duplicate values and provides **average $O(1)$ time complexity** for membership checks, additions, and removals.

---

## 1. Internal Architecture: How HashSet<T> Works

Under the hood, \`HashSet<T>\` is implemented with a slot-based hash table identical in efficiency to \`Dictionary<TKey, TValue>\`, but without holding value payloads:
1. \`int[] _buckets\`: Sized to a prime number; each slot stores the index of the first entry in that bucket.
2. \`Slot[] _slots\`: Contiguous struct array storing:
   - \`uint hashCode\`: 32-bit hash code of the item.
   - \`int next\`: Index of the next collided item in the collision chain (-1 if terminal).
   - \`T value\`: The unique value stored.

Because all slots reside in a **single contiguous array**, iterating a \`HashSet<T>\` produces zero object overhead and high CPU cache efficiency.

---

## 2. Uniqueness & The \`Add()\` Boolean Idiom

Unlike lists where duplicate entries append silently, adding to a \`HashSet<T>\` tests for uniqueness:
- If the item is **new**, \`set.Add(item)\` returns **\`true\`**.
- If the item was **already present**, \`set.Add(item)\` returns **\`false\`**.

### Finding Duplicates & First Seen Items
This boolean return value provides a clean, single-pass idiom for detecting duplicates:

\`\`\`csharp
int[] numbers = { 10, 20, 30, 20, 40, 10 };
var seen = new HashSet<int>();

foreach (int num in numbers)
{
    if (!seen.Add(num))
    {
        Console.WriteLine($"Duplicate detected: {num}");
    }
}
\`\`\`

---

## 3. Mathematical Set Algebra Operations

.NET's \`HashSet<T>\` provides native implementations of discrete mathematical set theory:

\`\`\`csharp
var backendDevs = new HashSet<string> { "Rahim", "Karim", "Farhan" };
var cloudArchitects = new HashSet<string> { "Karim", "Farhan", "Tanvir" };

// 1. Union: A ∪ B (Combines all unique members from both)
var allStaff = new HashSet<string>(backendDevs);
allStaff.UnionWith(cloudArchitects); 
// Result: { "Rahim", "Karim", "Farhan", "Tanvir" }

// 2. Intersection: A ∩ B (Retains only common elements)
var hybridEngineers = new HashSet<string>(backendDevs);
hybridEngineers.IntersectWith(cloudArchitects); 
// Result: { "Karim", "Farhan" }

// 3. Difference (Except): A \ B (Removes elements present in B from A)
var pureBackend = new HashSet<string>(backendDevs);
pureBackend.ExceptWith(cloudArchitects); 
// Result: { "Rahim" }

// 4. Symmetric Difference (XOR): A ⊕ B (In either A or B, but not both)
var singleSpecialty = new HashSet<string>(backendDevs);
singleSpecialty.SymmetricExceptWith(cloudArchitects); 
// Result: { "Rahim", "Tanvir" }
\`\`\`

### Set Query Predicates:
- \`setA.IsSubsetOf(setB)\`: Returns \`true\` if all elements in $A$ exist in $B$.
- \`setA.IsSupersetOf(setB)\`: Returns \`true\` if $A$ contains all elements of $B$.
- \`setA.Overlaps(setB)\`: Returns \`true\` if $A$ and $B$ share at least one common element.
- \`setA.SetEquals(setB)\`: Returns \`true\` if $A$ and $B$ contain the exact same elements regardless of insertion order.

---

## 4. Comparison: \`HashSet<T>\` vs \`SortedSet<T>\`

| Feature | \`HashSet<T>\` | \`SortedSet<T>\` |
|---|---|---|
| **Underlying Data Structure** | Hash Table (Buckets + Slots) | Red-Black Tree (Self-balancing BST) |
| **Lookup / Add Complexity** | **$O(1)$ Average** ($O(N)$ worst) | **$O(\\log N)$ Guaranteed** |
| **Element Order** | Unordered (based on hash modulo) | **Always strictly sorted** |
| **Memory Overhead** | Lower (2 flat arrays) | Higher (3 pointers per tree node) |
| **Range Queries (\`GetViewBetween\`)** | Not supported | Supported natively |

---

## 5. Custom Equality Comparers

For case-insensitive string sets or custom domain objects, supply an \`IEqualityComparer<T>\`:

\`\`\`csharp
// Case-insensitive string set
var allowedDomains = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
{
    "example.com",
    "github.com"
};

bool isValid = allowedDomains.Contains("GITHUB.COM"); // true
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Distinct Numbers Count
*Source: Codeforces Assiut University Training Sheet #5 — Problem M*

**Problem Statement**:
Given an array $A$ of $N$ numbers. Count how many distinct (unique) numbers exist in the array.

**Constraints**:
$1 \\le N \\le 1000$, $-10^9 \\le A_i \\le 10^9$.

### C# Solution:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Pre-allocate capacity to avoid internal re-hashing
        HashSet<long> uniqueElements = new HashSet<long>(n);

        for (int i = 0; i < n; i++)
        {
            uniqueElements.Add(long.Parse(tokens[i]));
        }

        Console.WriteLine(uniqueElements.Count);
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N)$ — inserting $N$ numbers into the hash set takes $O(1)$ average time per number.
- **Space Complexity**: $O(K)$ where $K \\le N$ is the number of distinct elements stored.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem M: Distinct Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/M) | Easy | Uniqueness, HashSet |
| ⚪ | Exercism C# | [Pangram](https://exercism.org/tracks/csharp/exercises/pangram) | Easy | Character set, 26 letters check |
| ⚪ | Exercism C# | [Anagram](https://exercism.org/tracks/csharp/exercises/anagram) | Easy | Character frequencies, Set matching |
| ⚪ | Exercism C# | [Matching Brackets](https://exercism.org/tracks/csharp/exercises/matching-brackets) | Easy | Delimiter tracking, Sets |
`,

    contentBn: `# C# এ হ্যাশসেট (HashSet<T>) ও ইউনিক উপাদান

\`System.Collections.Generic.HashSet<T>\` হলো অনন্য (Unique) উপাদানের একটি অসাজানো (Unordered) কালেকশন। এটি কোনো ডুপ্লিকেট মান সংরক্ষণ করে না এবং কোনো উপাদান উপস্থিত আছে কি না তা যাচাই (\`Contains\`), নতুন উপাদান যোগ এবং অপসারণে **গড়ে $O(1)$ সময় জটিলতা** প্রদান করে।

---

## ১. অভ্যন্তরীণ আর্কিটেকচার: কীভাবে কাজ করে HashSet<T>?

\`HashSet<T>\` মূলত \`Dictionary<TKey, TValue>\` এর মতো একই স্লট-ভিত্তিক হ্যাশ টেবিল আর্কিটেকচার ব্যবহার করে, তবে এতে কোনো আলাদা ভ্যালু রাখার প্রয়োজন হয় না:
১. \`int[] _buckets\`: মৌলিক সংখ্যার আকারের একটি অ্যারে, যাতে বাকেটের প্রথম স্লট ইনডেক্স থাকে।
২. \`Slot[] _slots\`: একটি সংলগ্ন স্ট্রাক্ট অ্যারে যাতে থাকে:
   - \`uint hashCode\`: উপাদানের ৩২-বিট হ্যাশ কোড।
   - \`int next\`: সংঘর্ষ চেইনে থাকা পরবর্তী উপাদানের ইনডেক্স।
   - \`T value\`: মূল উপাদানটি।

সমস্ত স্লট একটি একক ফ্ল্যাট অ্যারেতে থাকায় মেমোরি ফ্র্যাগমেন্টেশন ঘটে না এবং সিপিইউ ক্যাশ নিখুঁতভাবে কাজ করে।

---

## ২. অনন্যতা ও \`Add()\` মেথডের বুলিয়ান সুবিধা

লিস্টের মতো হ্যাশসেটে উপাদান চোখ বন্ধ করে যুক্ত হয় না:
- উপাদানটি নতুন হলে \`set.Add(item)\` মেথডটি **\`true\`** রিটার্ন করে।
- উপাদানটি পূর্বেই বিদ্যমান থাকলে এটি উপাদানটি গ্রহণ করে না এবং **\`false\`** রিটার্ন করে।

### ডুপ্লিকেট শনাক্তকরণের একক-পাস কৌশল:
\`\`\`csharp
int[] numbers = { 10, 20, 30, 20, 40, 10 };
var seen = new HashSet<int>();

foreach (int num in numbers)
{
    if (!seen.Add(num))
    {
        Console.WriteLine($"ডুপ্লিকেট সংখ্যা: {num}");
    }
}
\`\`\`

---

## ৩. গাণিতিক সেট অপারেশনসমূহ

.NET এর \`HashSet<T>\` ক্লাসে বিচ্ছিন্ন গণিতের সেট থিওরির সমস্ত অপারেশন বিল্ট-ইন রয়েছে:

\`\`\`csharp
var backendDevs = new HashSet<string> { "Rahim", "Karim", "Farhan" };
var cloudArchitects = new HashSet<string> { "Karim", "Farhan", "Tanvir" };

// ১. সংযোগ বা ইউনিয়ন: A ∪ B (উভয় সেটের সমস্ত উপাদান)
var allStaff = new HashSet<string>(backendDevs);
allStaff.UnionWith(cloudArchitects);

// ২. ছেদ বা ইন্টারসেকশন: A ∩ B (কেবল সাধারণ উপাদানগুলো)
var hybridEngineers = new HashSet<string>(backendDevs);
hybridEngineers.IntersectWith(cloudArchitects);

// ৩. অন্তর বা ডিফারেন্স: A \ B (A থেকে B এর উপাদান বাদ)
var pureBackend = new HashSet<string>(backendDevs);
pureBackend.ExceptWith(cloudArchitects);

// ৪. সিমেট্রিক ডিফারেন্স: A ⊕ B (উভয়ে নেই এমন উপাদান)
var singleSpecialty = new HashSet<string>(backendDevs);
singleSpecialty.SymmetricExceptWith(cloudArchitects);
\`\`\`

### সেট সম্পর্কিত সত্যতা যাচাই:
- \`setA.IsSubsetOf(setB)\`: A সেটটি B এর উপসেট কি না।
- \`setA.Overlaps(setB)\`: উভয় সেটে অন্তত একটি সাধারণ উপাদান আছে কি না।
- \`setA.SetEquals(setB)\`: ক্রম বিবেচনা না করে উভয় সেটের সমস্ত উপাদান হুবহু এক কি না।

---

## ৪. তুলনামূলক সারণী: \`HashSet<T>\` বনাম \`SortedSet<T>\`

| বৈশিষ্ট্য | \`HashSet<T>\` | \`SortedSet<T>\` |
|---|---|---|
| **অভ্যন্তরীণ কাঠামো** | হ্যাশ টেবিল (বাকেট ও স্লট) | রেড-ব্ল্যাক ট্রি (ব্যালান্সড বাইনারি ট্রি) |
| **সার্চ ও ইনসার্ট গতি** | **গড়ে $O(1)$** | **নিশ্চিত $O(\\log N)$** |
| **উপাদানের ক্রম** | অসাজানো (হ্যাশের ওপর নির্ভরশীল) | **সর্বদা ছোট থেকে বড় সর্টেড** |
| **মেমোরি খরচ** | তুলনামূলক কম (দুটি ফ্ল্যাট অ্যারে) | বেশি (প্রতি নোডে ৩টি পয়েন্টার) |
| **রেঞ্জ কুয়েরি** | সমর্থন করে না | \`GetViewBetween\` দিয়ে রেঞ্জ কুয়েরি সম্ভব |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: অনন্য সংখ্যার গণনা (Distinct Numbers Count)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৫ — Problem M*

**সমস্যা পরিচিতি**:
$N$ আকারের একটি অ্যারে $A$ দেওয়া থাকবে। অ্যারেটিতে কতটি অনন্য (Distinct) সংখ্যা রয়েছে তা গণনা করে প্রিন্ট করুন।

**সীমাবদ্ধতা**:
$1 \\le N \\le 1000$, প্রতিটি সংখ্যা $-10^9$ থেকে $10^9$ এর মধ্যে।

### সি# সমাধান:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // অভ্যন্তরীণ রি-হ্যাশিং এড়াতে ক্যাপাসিটি দিয়ে ইনিশিয়ালাইজ করা
        HashSet<long> uniqueElements = new HashSet<long>(n);

        for (int i = 0; i < n; i++)
        {
            uniqueElements.Add(long.Parse(tokens[i]));
        }

        Console.WriteLine(uniqueElements.Count);
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N)$ — প্রতিটি সংখ্যা গড়ে $O(1)$ সময়ে হ্যাশসেটে ইনসার্ট হয়।
- **স্পেস কমপ্লেক্সিটি**: $O(K)$ — যেখানে $K \\le N$ হলো মোট অনন্য সংখ্যার পরিমাণ।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem M: Distinct Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/M) | Easy | Uniqueness, HashSet |
| ⚪ | Exercism C# | [Pangram](https://exercism.org/tracks/csharp/exercises/pangram) | Easy | Character set, 26 letters check |
| ⚪ | Exercism C# | [Anagram](https://exercism.org/tracks/csharp/exercises/anagram) | Easy | Character frequencies, Set matching |
| ⚪ | Exercism C# | [Matching Brackets](https://exercism.org/tracks/csharp/exercises/matching-brackets) | Easy | Delimiter tracking, Sets |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #5",
        name: "Problem M: Distinct Numbers",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/223339/problem/M",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["HashSet", "Uniqueness"],
        solutionEn: "Insert all integers into a HashSet to filter duplicates, then print Count.",
        solutionBn: "সমস্ত সংখ্যা হ্যাশসেটে যোগ করে ডুপ্লিকেট বাদ দিন এবং শেষে Count প্রিন্ট করুন।",
      },
      {
        source: "Exercism C#",
        name: "Pangram",
        url: "https://exercism.org/tracks/csharp/exercises/pangram",
        difficulty: "EASY",
        company: null,
        tags: ["HashSet", "Strings"],
        solutionEn: "Add all lowercase English letters from the sentence to a HashSet and check if Count == 26.",
        solutionBn: "বাক্যের ইংরেজি বর্ণগুলোকে হ্যাশসেটে যোগ করে কাউন্ট ২৬ কি না তা পরীক্ষা করুন।",
      },
      {
        source: "Exercism C#",
        name: "Anagram",
        url: "https://exercism.org/tracks/csharp/exercises/anagram",
        difficulty: "EASY",
        company: null,
        tags: ["HashSet", "Strings", "Collections"],
        solutionEn: "Filter candidates by length and verify character distribution using sets or sorted character arrays.",
        solutionBn: "শব্দের অক্ষর বিন্যাস ও সেটের মাধ্যমে অ্যানাগ্রাম যাচাই করুন।",
      },
      {
        source: "Exercism C#",
        name: "Matching Brackets",
        url: "https://exercism.org/tracks/csharp/exercises/matching-brackets",
        difficulty: "EASY",
        company: null,
        tags: ["HashSet", "Stack", "Parsing"],
        solutionEn: "Maintain allowed bracket characters in sets for O(1) membership recognition during validation.",
        solutionBn: "ব্র্যাকেট অক্ষর দ্রুত শনাক্ত করতে সেটের O(1) লুকআপ ব্যবহার করুন।",
      },
    ],
  };
