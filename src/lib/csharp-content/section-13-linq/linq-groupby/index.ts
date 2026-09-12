import type { LocalLesson } from "@/lib/lessons-data";

export const linqGroupbyLesson: LocalLesson = {
  slug: "linq-groupby",
  titleEn: "LINQ GroupBy (Grouping)",
  titleBn: "গ্রুপ-বাই (GroupBy) ও ডেটা ক্লাস্টারিং",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকইউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "CORE",
  descriptionEn:
    "Partitioning sequences by shared keys, IGrouping<TKey, TElement>, GroupBy vs ToLookup, composite result selectors, and frequency counting.",
  descriptionBn:
    "শেয়ার্ড কি-এর ভিত্তিতে সিকোয়েন্স ক্লাস্টারিং, IGrouping ইন্টারফেস, GroupBy বনাম ToLookup এর পার্থক্য, রেজাল্ট সিলেক্টর ও ফ্রিকোয়েন্সি গণনা।",
  difficulty: "MEDIUM",
  displayOrder: 5,
  prerequisites: ["linq-orderby"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# LINQ GroupBy (Grouping) in C#

The **\`GroupBy\`** operator partitions an input sequence into clusters sharing a common key. Each cluster is represented by an **\`IGrouping<TKey, TElement>\`** instance, which acts as an \`IEnumerable<TElement>\` annotated with a \`Key\` property.

---

## Under the Hood: The Internal Hash Table Mechanism

When evaluating a \`GroupBy\` query:
1. **Hash Table Construction**: LINQ inspects the sequence and maps each element into an internal hash bucket using the key's \`GetHashCode()\` and \`Equals()\` methods (or a supplied \`IEqualityComparer<TKey>\`).
2. **Order Preservation**: Groups are yielded in the order their distinct keys were **first encountered** in the source sequence. Within each group, elements retain their original relative order.
3. **Complexity**:
   - **Time Complexity**: $\\mathcal{O}(N)$ average case time across $N$ elements.
   - **Space Complexity**: $\\mathcal{O}(N)$ auxiliary memory to store keys and references in the internal bucket table.

---

## GroupBy vs ToLookup: Critical Distinctions

Developers frequently confuse \`GroupBy\` and \`ToLookup\`:

| Feature | \`GroupBy\` | \`ToLookup\` |
| :--- | :--- | :--- |
| **Execution Model** | **Deferred** (evaluates upon iteration) | **Immediate** (eagerly runs upon invocation) |
| **Return Type** | \`IEnumerable<IGrouping<TKey, TElement>>\` | \`ILookup<TKey, TElement>\` |
| **Indexing Syntax** | Cannot index directly (must iterate) | Indexable: \`lookup[key]\` |
| **Missing Key Access** | N/A | Returns an **empty sequence** (never throws \`KeyNotFoundException\`) |
| **Mutation** | Read-only | Read-only immutable multi-map |

\`\`\`csharp
// ToLookup evaluates immediately into an in-memory multidictionary:
ILookup<string, Student> studentsByMajor = students.ToLookup(s => s.Major);

// Safe access: returns empty sequence if key does not exist
IEnumerable<Student> artStudents = studentsByMajor["FineArts"]; // Zero exceptions!
\`\`\`

---

## Overloads & Result Selectors

\`GroupBy\` provides advanced overloads that eliminate intermediate collection allocations:

### 1. Key & Element Selector:
\`\`\`csharp
// Extracts only employee salaries into the groups instead of whole Employee objects
var salariesByDept = employees.GroupBy(
    emp => emp.Department, 
    emp => emp.Salary
);
\`\`\`

### 2. Composite Result Selector (Aggregate While Grouping):
\`\`\`csharp
// Computes department statistics directly without creating IGrouping objects:
var deptSummaries = employees.GroupBy(
    emp => emp.Department,
    (dept, emps) => new
    {
        Department = dept,
        HeadCount = emps.Count(),
        TotalPayroll = emps.Sum(e => e.Salary)
    }
);
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Frequency Analysis & Word Counting
*Given a collection of words, count the frequency of each unique word (case-insensitively) and return the words ordered by frequency descending, then alphabetically.*

#### Algorithmic Analysis
1. Group words using \`GroupBy(w => w.ToLowerInvariant())\`.
2. Project each group into a composite object containing the word and its \`Count()\`.
3. Chain \`OrderByDescending(g => g.Frequency)\` followed by \`ThenBy(g => g.Word)\`.

#### C# Implementation

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var words = new List<string>
        {
            "apple", "banana", "APPLE", "orange", "banana", "apple", "grape"
        };

        var frequencyReport = words
            .GroupBy(w => w.ToLowerInvariant())
            .Select(g => new 
            { 
                Word = g.Key, 
                Count = g.Count() 
            })
            .OrderByDescending(x => x.Count)
            .ThenBy(x => x.Word)
            .ToList();

        foreach (var item in frequencyReport)
        {
            Console.WriteLine($"{item.Word}: {item.Count}");
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N + U \\log U)$ where $N$ is total words and $U$ is unique words ($U \\le N$). Grouping takes $\\mathcal{O}(N)$ and sorting unique groups takes $\\mathcal{O}(U \\log U)$.
- **Space Complexity**: $\\mathcal{O}(N)$ to store internal hash buckets and unique group projections.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Exercism C# | [Word Count](https://exercism.org/tracks/csharp/exercises/word-count) | Medium | \`GroupBy\`, String sanitization, Frequency counting |
| ⚪ | Exercism C# | [Anagram](https://exercism.org/tracks/csharp/exercises/anagram) | Medium | Grouping keys, Character signatures |
| ⚪ | Codeforces | [Assiut Sheet #4: Count Letters](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/J) | Easy | \`GroupBy\`, Alphabetical sorting, Frequencies |
| ⚪ | Exercism C# | [Scrabble Score](https://exercism.org/tracks/csharp/exercises/scrabble-score) | Easy | Key lookup, Character value mapping |
`,

  contentBn: `# C# এ গ্রুপ-বাই (GroupBy) ও ডেটা ক্লাস্টারিং

LINQ-এ কালেকশনের উপাদানগুলোকে একটি নির্দিষ্ট কমন কি (Key)-এর ভিত্তিতে ক্লাস্টার বা বিভক্ত করার জন্য **\`GroupBy\`** অপারেটর ব্যবহৃত হয়। প্রতিটি গ্রুপকে একটি **\`IGrouping<TKey, TElement>\`** অবজেক্ট হিসেবে উপস্থাপন করা হয়, যা মূলত একটি \`Key\` প্রোপার্টি সম্বলিত \`IEnumerable<TElement>\` কালেকশন।

---

## আন্ডার দ্য হুড: ইন্টারনাল হ্যাশ টেবিল মেকানিজম

যখন \`GroupBy\` এক্সিকিউট হয়:
১. **হ্যাশ বাকেট গঠন**: LINQ ইনপুট সিকোয়েন্সের প্রতিটি উপাদানকে পরীক্ষা করে এবং কী-এর \`GetHashCode()\` ও \`Equals()\` মেথড প্রয়োগ করে একটি অভ্যন্তরীণ হ্যাশ বাকেটে জমা করে।
২. **ক্রমানুসার অক্ষুণ্ণ রাখা**: ইনপুট সিকোয়েন্সে যে ক্রমে ইউনিক কী-গুলো প্রথম পাওয়া যায়, ঠিক সেই ক্রমেই গ্রুপগুলো উৎপন্ন হয়। আবার প্রতিটি গ্রুপের ভেতরের উপাদানগুলোর আপেক্ষিক ক্রমও অপরিবর্তিত থাকে।
৩. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $N$ সংখ্যক উপাদানের জন্য গড়ে $\\mathcal{O}(N)$ সময় লাগে।
   - **স্পেস কমপ্লেক্সিটি**: হ্যাশ বাকেটের জন্য অতিরিক্ত $\\mathcal{O}(N)$ মেমোরি প্রয়োজন হয়।

---

## GroupBy বনাম ToLookup: প্রধান পার্থক্য

ডেভেলপাররা প্রায়শই \`GroupBy\` এবং \`ToLookup\` এর মধ্যে বিভ্রান্ত হন:

| বৈশিষ্ট্য | \`GroupBy\` | \`ToLookup\` |
| :--- | :--- | :--- |
| **এক্সিকিউশন মোড** | **ডিফার্ড (Deferred)** (ইটারেশনের সময় কার্যকর হয়) | **তাত্ক্ষণিক (Immediate)** (কল করার সাথে সাথে কার্যকর হয়) |
| **রিটার্ন টাইপ** | \`IEnumerable<IGrouping<TKey, TElement>>\` | \`ILookup<TKey, TElement>\` |
| **ইনডেক্সিং সিনট্যাক্স** | সরাসরি ইনডেক্স করা যায় না (লুপ চালাতে হয়) | ডিকশনারির মতো ইনডেক্সযোগ্য: \`lookup[key]\` |
| **অনুপস্থিত কি (Key) অ্যাক্সেস** | প্রযোজ্য নয় | **খালি সিকোয়েন্স** রিটার্ন করে (কখনও \`KeyNotFoundException\` দেয় না) |
| **মিউট্যাবিলিটি** | রিড-অনলি | রিড-অনলি ইমিউটেবল মাল্টি-ম্যাপ |

\`\`\`csharp
// ToLookup কল করার সাথে সাথে মেমরিতে তৈরি হয়ে যায়:
ILookup<string, Student> studentsByMajor = students.ToLookup(s => s.Major);

// নিরাপদ অ্যাক্সেস: কি না থাকলে খালি সিকোয়েন্স ফেরত দেয়, কোনো এক্সেপশন হয় না!
IEnumerable<Student> artStudents = studentsByMajor["FineArts"];
\`\`\`

---

## ওভারলোড ও রেজাল্ট সিলেক্টর

\`GroupBy\` এর শক্তিশালী ওভারলোডগুলো অতিরিক্ত অবজেক্ট অ্যালোকেশন ছাড়াই গ্রুপ সামারাইজ করতে সাহায্য করে:

### ১. কী ও এলিমেন্ট সিলেক্টর:
\`\`\`csharp
// পুরো অবজেক্ট না নিয়ে শুধু বেতনের তালিকা গ্রুপ করে:
var salariesByDept = employees.GroupBy(
    emp => emp.Department, 
    emp => emp.Salary
);
\`\`\`

### ২. রেজাল্ট সিলেক্টর (গ্রুপিংয়ের সাথে একীভূত এগ্রিগেশন):
\`\`\`csharp
// কোনো মধ্যবর্তী IGrouping তৈরি ছাড়াই সরাসরি ডিপার্টমেন্ট সামারি তৈরি:
var deptSummaries = employees.GroupBy(
    emp => emp.Department,
    (dept, emps) => new
    {
        Department = dept,
        HeadCount = emps.Count(),
        TotalPayroll = emps.Sum(e => e.Salary)
    }
);
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: শব্দের ফ্রিকোয়েন্সি বিশ্লেষণ
*একটি শব্দগুচ্ছ দেওয়া আছে। কেস-ইনসেনসিটিভভাবে প্রতিটি শব্দের পুনরাবৃত্তি সংখ্যা গণনা করুন এবং সর্বোচ্চ ফ্রিকোয়েন্সি অনুসারে সাজিয়ে প্রদর্শন করুন।*

#### সমাধান বিশ্লেষণ
১. \`GroupBy(w => w.ToLowerInvariant())\` দিয়ে শব্দগুলোকে ছোট হাতের অক্ষরে কনভার্ট করে গ্রুপ করা।
২. \`.Select()\` দিয়ে প্রতিটি গ্রুপের কী ও \`Count()\` নিয়ে প্রজেকশন তৈরি করা।
৩. \`.OrderByDescending(x => x.Count)\` এবং টাই-ব্রেকিংয়ের জন্য \`.ThenBy(x => x.Word)\` দিয়ে সাজানো।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var words = new List<string>
        {
            "apple", "banana", "APPLE", "orange", "banana", "apple", "grape"
        };

        var frequencyReport = words
            .GroupBy(w => w.ToLowerInvariant())
            .Select(g => new 
            { 
                Word = g.Key, 
                Count = g.Count() 
            })
            .OrderByDescending(x => x.Count)
            .ThenBy(x => x.Word)
            .ToList();

        foreach (var item in frequencyReport)
        {
            Console.WriteLine($"{item.Word}: {item.Count}");
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N + U \\log U)$, যেখানে $N$ হলো মোট শব্দ এবং $U$ হলো ইউনিক শব্দ। গ্রুপিংয়ে লিনিয়ার ও ইউনিক গ্রুপ সর্টিংয়ে $\\mathcal{O}(U \\log U)$ সময় লাগে।
- **স্পেস কমপ্লেক্সিটি**: হ্যাশ বাকেট এবং প্রজেকশন অবজেক্টের জন্য মেমরিতে $\\mathcal{O}(N)$ জায়গা লাগে।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Exercism C# | [Word Count](https://exercism.org/tracks/csharp/exercises/word-count) | Medium | \`GroupBy\`, String sanitization, Frequency counting |
| ⚪ | Exercism C# | [Anagram](https://exercism.org/tracks/csharp/exercises/anagram) | Medium | Grouping keys, Character signatures |
| ⚪ | Codeforces | [Assiut Sheet #4: Count Letters](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/J) | Easy | \`GroupBy\`, Alphabetical sorting, Frequencies |
| ⚪ | Exercism C# | [Scrabble Score](https://exercism.org/tracks/csharp/exercises/scrabble-score) | Easy | Key lookup, Character value mapping |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Word Count",
      url: "https://exercism.org/tracks/csharp/exercises/word-count",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["LINQ", "GroupBy", "Frequencies"],
      solutionEn:
        "Sanitize text by removing punctuation and group tokens case-insensitively to compute word frequencies.",
      solutionBn:
        "পাঙ্কচুয়েশন অপসারণ করে টেক্সট স্যানিটাইজ করুন এবং কেস-ইনসেনসিটিভ GroupBy দিয়ে শব্দের পুনরাবৃত্তি গণনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Anagram",
      url: "https://exercism.org/tracks/csharp/exercises/anagram",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["LINQ", "GroupBy", "Strings"],
      solutionEn:
        "Group candidate strings by sorted character key signatures to identify exact anagram matches.",
      solutionBn:
        "ক্যারেক্টারের সর্টেড সিগনেচার দিয়ে ক্যান্ডিডেট শব্দগুলোকে গ্রুপ করে সঠিক অ্যানাগ্রাম শনাক্ত করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #4: Count Letters",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/J",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["LINQ", "GroupBy", "Letters"],
      solutionEn:
        "Group letters in an input string by character key, order them alphabetically, and output their count frequencies.",
      solutionBn:
        "ইনপুট স্ট্রিংয়ের অক্ষরগুলোকে ক্যারেক্টার কী দিয়ে গ্রুপ করুন, বর্ণানুক্রমে সাজান এবং তাদের সংখ্যা প্রদর্শন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Scrabble Score",
      url: "https://exercism.org/tracks/csharp/exercises/scrabble-score",
      difficulty: "EASY",
      company: "BJIT Group",
      tags: ["LINQ", "GroupBy", "Lookup"],
      solutionEn:
        "Map individual letters to their Scrabble point weights and sum total scores for words.",
      solutionBn:
        "প্রতিটি অক্ষরের স্ক্র্যাবল স্কোর পয়েন্ট নির্ধারণ করে শব্দের মোট পয়েন্ট হিসাব করুন।",
    },
  ],
};
