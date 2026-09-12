import type { LocalLesson } from "@/lib/lessons-data";

export const collectionsDictionaryLesson: LocalLesson = {
    slug: "collections-dictionary",
    titleEn: "Dictionary<TKey, TValue>",
    titleBn: "ডিকশনারি (Dictionary<TKey, TValue>) ও হ্যাশম্যাপ",
    categoryEn: "03. Collections",
    categoryBn: "০৩. কালেকশনস ও ডেটা স্ট্রাকচার",
    categoryDescEn:
      "Essential data structures in .NET: fixed arrays, dynamic lists, hash-based sets and dictionaries, and FIFO/LIFO queues.",
    categoryDescBn:
      ".NET এর অপরিহার্য ডেটা স্ট্রাকচার: ফিক্সড অ্যারে, ডায়নামিক লিস্ট, হ্যাশ ডিকশনারি, সেট এবং কিউ/স্ট্যাক।",
    categoryPriority: "CORE",
    descriptionEn:
      "Hash table implementation, buckets and collision resolution, O(1) average lookup, TryGetValue, custom equality comparers, and key immutability.",
    descriptionBn:
      "হ্যাশ টেবিল আর্কিটেকচার, বাকেট ও সংঘর্ষ নিরসন, গড় O(1) গতি, TryGetValue, কাস্টম ইকুয়ালিটি কম্পেয়ারার এবং কি ইমিউটেবিলিটি।",
    difficulty: "MEDIUM",
    displayOrder: 3,
    prerequisites: ["collections-list"],
    estimatedMinutes: 35,
    lastUpdated: "Recently updated",
    contentEn: `# Dictionary<TKey, TValue> in C#

\`System.Collections.Generic.Dictionary<TKey, TValue>\` is a high-performance hash-table-based collection mapping unique keys to values. It delivers **average $O(1)$ time complexity** for lookups, insertions, and deletions.

---

## 1. Internal Architecture: Buckets & Entries

Under the hood, .NET's \`Dictionary<TKey, TValue>\` does not use pointer-chasing linked lists on the heap. Instead, it maintains **two parallel flat arrays**:
1. \`int[] _buckets\`: An array sized to a **prime number**. Each slot stores the index of the first entry matching that hash bucket (or -1 if empty).
2. \`Entry[] _entries\`: A contiguous array of structs containing:
   - \`uint hashCode\`: 32-bit full hash code of the key.
   - \`int next\`: Index of the next collided entry in the chain (-1 if terminal).
   - \`TKey key\`: The key itself.
   - \`TValue value\`: The associated payload.

\`\`\`
Key ("Enosis") ──► GetHashCode() ──► Bucket Index = Hash % BucketLength
                                            │
                                            ▼
                           _buckets: [ -1 | 2 | -1 | 0 | ... ]
                                            │
                           ┌────────────────┘
                           ▼
               _entries[2]: { Hash: 0x8F3A, Key: "Enosis", Value: 85000, Next: -1 }
\`\`\`

---

## 2. Collision Resolution & Prime Number Sizing

### Collision Handling via Array-Based Chaining
When two different keys map to the same bucket index:
1. The new entry is appended to \`_entries\`.
2. The previous head entry's index from \`_buckets\` is assigned to the new entry's \`next\` field.
3. The new entry's index becomes the new head stored in \`_buckets\`.
Because all entries reside in a **single contiguous struct array**, traversing a collision chain is extremely cache-friendly and produces **zero garbage collector allocations**.

### Prime Number Sizing & Rehashing
The size of \`_buckets\` is always grown to a mathematically verified **prime number** ($3, 7, 11, 17, 37, 79, 167 \dots$). Prime modulos drastically reduce hash clustering, especially when key hash codes share common factors.

---

## 3. The Double-Lookup Trap: \`TryGetValue\` vs Indexer

### The Common Anti-Pattern:
\`\`\`csharp
// ❌ SLOW (Two separate hash calculations and chain traversals):
if (userCache.ContainsKey(userId))
{
    var user = userCache[userId]; // Re-hashes userId and traverses the bucket again!
    ProcessUser(user);
}

// ✅ FAST (Single hash calculation, single lookup):
if (userCache.TryGetValue(userId, out var user))
{
    ProcessUser(user);
}
\`\`\`

### Indexer Assignment vs \`Add()\`
- \`dict[key] = value;\`: **Upsert behavior** — updates existing value if key is present; inserts new key-value pair if missing.
- \`dict.Add(key, value);\`: **Strict insertion** — throws \`ArgumentException\` if key already exists.

---

## 4. Custom Comparers & The Golden Rule of Hashing

### The Golden Rule:
> **If \`Equals(A, B)\` evaluates to \`true\`, then \`GetHashCode(A)\` MUST equal \`GetHashCode(B)\`.**
Violating this rule breaks the dictionary: two equal keys will calculate different bucket indices and become unreachable.

### Case-Insensitive String Keys:
By default, C# strings use ordinal, case-sensitive comparisons. Pass \`StringComparer.OrdinalIgnoreCase\` to handle case-insensitivity:

\`\`\`csharp
var configs = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
{
    ["DATABASE_URL"] = "Server=myServer;Database=myDb;",
    ["API_KEY"] = "secret_key_123"
};

// Succeeds because of OrdinalIgnoreCase
string dbUrl = configs["database_url"];
\`\`\`

### The Key Immutability Hazard:
**Never mutate an object that is used as a dictionary key!** If a key's fields change such that its hash code alters, it will remain stranded in its original bucket forever.

---

## 5. Alternative Dictionaries in .NET

| Type | Internal Structure | Lookup Complexity | Ordering | Thread-Safe? |
|---|---|---|---|---|
| **\`Dictionary<K, V>\`** | Hash Table (Buckets + Entries) | **$O(1)$ Average** | Unordered | No |
| **\`SortedDictionary<K, V>\`** | Red-Black Tree (Self-balancing) | **$O(\\log N)$** | Sorted by Key | No |
| **\`SortedList<K, V>\`** | Two sorted arrays (Binary search) | **$O(\\log N)$** lookup, $O(N)$ insert | Sorted by Key | No |
| **\`ConcurrentDictionary<K, V>\`** | Striped Lock Hash Table | **$O(1)$ Average** | Unordered | **Yes (Thread-safe)** |

---

## Practical Problem Walkthrough

### Problem: Frequency Array / Value Counter
*Source: Codeforces Assiut University Training Sheet #3 — Problem V*

**Problem Statement**:
Given two numbers $N$ and $M$ and an array $A$ of $N$ numbers. For every number from $1$ to $M$, print how many times this number appears in array $A$.

**Constraints**:
$1 \\le N \\le 10^5$, $1 \\le M \\le 10^5$, $1 \\le A_i \\le M$.

### C# Solution:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        string[] header = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(header[0]);
        int m = int.Parse(header[1]);

        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Pre-allocate capacity dictionary for M keys
        Dictionary<int, int> frequencyMap = new Dictionary<int, int>(m);

        for (int i = 0; i < n; i++)
        {
            int val = int.Parse(tokens[i]);

            if (frequencyMap.TryGetValue(val, out int count))
            {
                frequencyMap[val] = count + 1;
            }
            else
            {
                frequencyMap[val] = 1;
            }
        }

        // Print frequency for 1 to M
        for (int i = 1; i <= m; i++)
        {
            frequencyMap.TryGetValue(i, out int freq);
            Console.WriteLine(freq);
        }
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N + M)$ — $N$ dictionary updates with $O(1)$ average cost + $M$ lookups.
- **Space Complexity**: $O(M)$ — dictionary stores up to $M$ unique integer frequency keys.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem V: Frequency Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V) | Easy | Frequency counting, Hash lookup |
| ⚪ | Exercism C# | [Word Count](https://exercism.org/tracks/csharp/exercises/word-count) | Easy | Text tokenization, Frequency mapping |
| ⚪ | Exercism C# | [Scrabble Score](https://exercism.org/tracks/csharp/exercises/scrabble-score) | Easy | Character lookup dictionary |
| ⚪ | Codeforces Assiut | [Problem B: Searching](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B) | Easy | Lookup simulation, Index mapping |
`,

    contentBn: `# C# এ ডিকশনারি (Dictionary<TKey, TValue>) ও হ্যাশম্যাপ

\`System.Collections.Generic.Dictionary<TKey, TValue>\` হলো একটি উচ্চ কার্যক্ষমতাসম্পন্ন হ্যাশ-টেবিল ভিত্তিক কালেকশন, যা ইউনিক কি (Key) এর সাথে ভ্যালু (Value) ম্যাপ করে। এটি সার্চ, ইনসার্ট এবং ডিলিট অপারেশনে **গড়ে $O(1)$ সময় জটিলতা** প্রদান করে।

---

## ১. অভ্যন্তরীণ আর্কিটেকচার: বাকেট ও এন্ট্রিজ অ্যারে

.NET এর \`Dictionary<TKey, TValue>\` কোনো লিঙ্কড-লিস্ট অবজেক্টের ওপর নির্ভর করে না, বরং এটি মেমোরিতে **দুটি সমান্তরাল ফ্ল্যাট অ্যারে** বজায় রাখে:
১. \`int[] _buckets\`: মৌলিক সংখ্যার আকারের একটি অ্যারে, যার প্রতিটি স্লটে সেই বাকেটের প্রথম এন্ট্রির ইনডেক্স সংরক্ষিত থাকে (খালি থাকলে -১)।
২. \`Entry[] _entries\`: একটি সংলগ্ন স্ট্রাক্ট অ্যারে যাতে থাকে:
   - \`uint hashCode\`: কি-এর পূর্ণ ৩২-বিট হ্যাশ কোড।
   - \`int next\`: সংঘর্ষ চেইনে থাকা পরবর্তী এন্ট্রির ইনডেক্স।
   - \`TKey key\`: সংরক্ষিত কি।
   - \`TValue value\`: সংরক্ষিত ভ্যালু।

---

## ২. সংঘর্ষ নিরসন ও মৌলিক সংখ্যার ব্যবহার

### অ্যারে-ভিত্তিক চেইনিং
যখন দুটি ভিন্ন কি-এর হ্যাশ কোড একই বাকেট ইনডেক্সে ম্যাপ করে:
১. নতুন এন্ট্রিটি সরাসরি \`_entries\` অ্যারের শেষে যুক্ত হয়।
২. বাকেটের পূর্বের হেড ইনডেক্সটি নতুন এন্ট্রির \`next\` ফিল্ডে বসিয়ে দেওয়া হয়।
৩. নতুন এন্ট্রির ইনডেক্সটি বাকেটে হেড হিসেবে সেট হয়।
যেহেতু সমস্ত উপাদান একটি একক সংলগ্ন অ্যারেতে থাকে, তাই কোনো অতিরিক্ত হিপ অবজেক্ট তৈরি হয় না এবং সিপিইউ ক্যাশ অত্যন্ত কার্যকর থাকে।

### বাকেট সাইজিং ও মৌলিক সংখ্যা (Prime Sizing)
বাকেট অ্যারের আকার সর্বদা একটি **মৌলিক সংখ্যা** ($৩, ৭, ১১, ১৭, ৩৭, ৭৯ \dots$) অনুযায়ী বাড়ানো হয়। মৌলিক সংখ্যা দিয়ে ভাগশেষ (Modulo) বের করলে হ্যাশ কোডের ক্লাস্টারিং সর্বনিম্ন পর্যায়ে নেমে আসে।

---

## ৩. ডাবল-লুকআপ ফাঁদ: \`TryGetValue\` এর গুরুত্ব

### ক্ষতিকর কোডিং রীতি:
\`\`\`csharp
// ❌ ধীরগতি (দুবার হ্যাশ গণনা ও চেইন ট্রাভার্সাল):
if (userCache.ContainsKey(userId))
{
    var user = userCache[userId]; // পুনরায় হ্যাশ হিসাব করে একই কাজ দুবার করে!
    ProcessUser(user);
}

// ✅ দ্রুততম ও মানসম্মত (একক হ্যাশ লুকআপ):
if (userCache.TryGetValue(userId, out var user))
{
    ProcessUser(user);
}
\`\`\`

### ইনডেক্সার বনাম \`Add()\`
- \`dict[key] = value;\`: কি উপস্থিত থাকলে মান আপডেট করে, না থাকলে নতুন এন্ট্রি যোগ করে (Upsert)।
- \`dict.Add(key, value);\`: কি আগে থেকেই থাকলে \`ArgumentException\` থ্রো করে।

---

## ৪. কাস্টম কম্পেয়ারার ও হ্যাশিংয়ের সুবর্ণ নিয়ম

### হ্যাশিংয়ের সুবর্ণ নিয়ম:
> **যদি \`Equals(A, B)\` সত্য হয়, তবে তাদের হ্যাশ কোড \`GetHashCode(A)\` এবং \`GetHashCode(B)\` অবশ্যই সমান হতে হবে।**

### কেস-ইনসেনসিটিভ স্ট্রিং ডিকশনারি:
ডিফল্টভাবে স্ট্রিং কেস-সেনসিটিভ থাকে। বড়-ছোট হাতের অক্ষর উপেক্ষা করতে \`StringComparer.OrdinalIgnoreCase\` ব্যবহার করুন:

\`\`\`csharp
var configs = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
{
    ["DATABASE_URL"] = "Server=myServer;Database=myDb;",
    ["API_KEY"] = "secret_key_123"
};

// সফলভাবে কাজ করবে
string dbUrl = configs["database_url"];
\`\`\`

### কি (Key) পরিবর্তন না করার সতর্কতা:
ডিকশনারিতে কি হিসেবে সংরক্ষিত কোনো অবজেক্টের অভ্যন্তরীণ মান কখনোই পরিবর্তন করবেন না। হ্যাশ পরিবর্তিত হলে কি-টি পুরনো বাকেটে চিরতরে হারিয়ে যাবে।

---

## ৫. .NET এর অন্যান্য ডিকশনারিসমূহ

| ধরন | অভ্যন্তরীণ ডেটা স্ট্রাকচার | লুকআপ গতি | সাজানো বিন্যাস | থ্রেড-সেফ? |
|---|---|---|---|---|
| **\`Dictionary<K, V>\`** | হ্যাশ টেবিল (বাকেট ও এন্ট্রি) | **গড়ে $O(1)$** | অসাজানো | না |
| **\`SortedDictionary<K, V>\`** | রেড-ব্ল্যাক ট্রি | **$O(\\log N)$** | কি অনুযায়ী সর্টেড | না |
| **\`SortedList<K, V>\`** | দুটি সর্টেড অ্যারে | **$O(\\log N)$** | কি অনুযায়ী সর্টেড | না |
| **\`ConcurrentDictionary<K, V>\`** | লক স্ট্রাইপযুক্ত হ্যাশ টেবিল | **গড়ে $O(1)$** | অসাজানো | **হ্যাঁ (থ্রেড-সেফ)** |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ফ্রিকোয়েন্সি কাউন্টার (Frequency Array)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৩ — Problem V*

**সমস্যা পরিচিতি**:
$N$ আকারের একটি অ্যারে $A$ দেওয়া থাকবে এবং একটি সংখ্যা $M$ দেওয়া থাকবে। $1$ থেকে $M$ পর্যন্ত প্রতিটি সংখ্যা অ্যারেটিতে কয়বার উপস্থিত রয়েছে তা প্রিন্ট করুন।

**সীমাবদ্ধতা**:
$1 \\le N, M \\le 10^5$, প্রতিটি সংখ্যা $1 \\le A_i \\le M$।

### সি# সমাধান:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        string[] header = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(header[0]);
        int m = int.Parse(header[1]);

        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // M সাইজের ডিকশনারি ক্যাপাসিটি দিয়ে তৈরি
        Dictionary<int, int> frequencyMap = new Dictionary<int, int>(m);

        for (int i = 0; i < n; i++)
        {
            int val = int.Parse(tokens[i]);

            if (frequencyMap.TryGetValue(val, out int count))
            {
                frequencyMap[val] = count + 1;
            }
            else
            {
                frequencyMap[val] = 1;
            }
        }

        // ১ থেকে M পর্যন্ত ফ্রিকোয়েন্সি প্রিন্ট করা
        for (int i = 1; i <= m; i++)
        {
            frequencyMap.TryGetValue(i, out int freq);
            Console.WriteLine(freq);
        }
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N + M)$ — ডিকশনারিতে $N$ টি আপডেট ও $M$ টি রিড, যার প্রতিটি গড়ে $O(1)$ সময়ে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $O(M)$ — সর্বোচ্চ $M$ সংখ্যক অনন্য কি ডিকশনারিতে ধারণের মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem V: Frequency Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V) | Easy | Frequency counting, Hash lookup |
| ⚪ | Exercism C# | [Word Count](https://exercism.org/tracks/csharp/exercises/word-count) | Easy | Text tokenization, Frequency mapping |
| ⚪ | Exercism C# | [Scrabble Score](https://exercism.org/tracks/csharp/exercises/scrabble-score) | Easy | Character lookup dictionary |
| ⚪ | Codeforces Assiut | [Problem B: Searching](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B) | Easy | Lookup simulation, Index mapping |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem V: Frequency Array",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Dictionary", "Hash Table", "Frequency"],
        solutionEn: "Count occurrences of numbers 1 to M using a dictionary with O(1) TryGetValue lookup.",
        solutionBn: "ডিকশনারি ব্যবহার করে ১ থেকে M সংখ্যার ফ্রিকোয়েন্সি O(1) TryGetValue দিয়ে গণনা করুন।",
      },
      {
        source: "Exercism C#",
        name: "Word Count",
        url: "https://exercism.org/tracks/csharp/exercises/word-count",
        difficulty: "EASY",
        company: null,
        tags: ["Dictionary", "Strings", "Parsing"],
        solutionEn: "Tokenize input text and accumulate word occurrences using a case-insensitive dictionary.",
        solutionBn: "টেক্সট থেকে শব্দ আলাদা করে কেস-ইনসেনসিটিভ ডিকশনারিতে ফ্রিকোয়েন্সি ট্র্যাক করুন।",
      },
      {
        source: "Exercism C#",
        name: "Scrabble Score",
        url: "https://exercism.org/tracks/csharp/exercises/scrabble-score",
        difficulty: "EASY",
        company: null,
        tags: ["Dictionary", "Lookup"],
        solutionEn: "Map letter values in a dictionary and compute total scrabble score for a word.",
        solutionBn: "ডিকশনারিতে অক্ষরের পয়েন্ট সংরক্ষণ করে প্রদত্ত শব্দের মোট স্কোর গণনা করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem B: Searching",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Dictionary", "Linear Search"],
        solutionEn: "Map the first occurrence index of each number in a dictionary or scan sequentially.",
        solutionBn: "প্রতিটি সংখ্যার প্রথম পাওয়ার ইনডেক্স ট্র্যাক করে সরাসরি ফলাফল প্রদর্শন করুন।",
      },
    ],
  };
