import type { LocalLesson } from "@/lib/lessons-data";

export const stringsStringbuilderLesson: LocalLesson = {
  slug: "strings-stringbuilder",
  titleEn: "StringBuilder Buffer Mechanics",
  titleBn: "স্ট্রিংবিল্ডার (StringBuilder) ও বাফার মেকানিজম",
  categoryEn: "06. Strings",
  categoryBn: "০৬. স্ট্রিং ও টেক্সট প্রসেসিং",
  categoryDescEn:
    "Text processing in .NET: string immutability, string interning, StringBuilder buffer mechanics, and high-performance memory spans.",
  categoryDescBn:
    ".NET এ টেক্সট প্রসেসিং: স্ট্রিং অপরিবর্তনশীলতা (Immutability), স্ট্রিং ইন্টার্নিং, StringBuilder বাফার ও স্প্যান অপ্টিমাইজেশন।",
  categoryPriority: "CORE",
  descriptionEn:
    "Mutable string buffer, chunked linked-list internal architecture, Capacity vs Length, buffer reuse, and avoiding quadratic memory churn.",
  descriptionBn:
    "মিউটেবল স্ট্রিং বাফার, লিংকড-চাঙ্ক ইন্টারনাল আর্কিটেকচার, Capacity বনাম Length, বাফার পুনর্ব্যবহার এবং মেমোরির অপচয় রোধ।",
  difficulty: "EASY",
  displayOrder: 3,
  prerequisites: ["strings-immutability"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# StringBuilder Buffer Mechanics in C#

\`System.Text.StringBuilder\` represents a **mutable buffer of characters**. It is designed specifically to eliminate the massive heap allocation overhead and quadratic $O(N^2)$ time complexity caused by repeated string concatenations.

---

## The Modern Linked-Chunks Internal Architecture

Many developers assume that \`StringBuilder\` works like a \`List<char>\` with a single flat array that doubles in size. In modern .NET, its architecture is much more sophisticated:

\`StringBuilder\` is implemented as a **singly-linked list of character chunks**:

\`\`\`
┌───────────────────────────┐      ┌───────────────────────────┐
│       Current Chunk       │      │      Previous Chunk       │
├───────────────────────────┤      ├───────────────────────────┤
│ char[] m_ChunkChars [16]  │      │ char[] m_ChunkChars [16]  │
│ int    m_ChunkLength      │───┐  │ int    m_ChunkLength      │
│ int    m_ChunkOffset      │   │  │ int    m_ChunkOffset      │
│ StringBuilder? Previous   │───┘  │ StringBuilder? Previous   │───► null
└───────────────────────────┘      └───────────────────────────┘
\`\`\`

### Why Chunks?
- When a chunk fills up, a flat array implementation would have to allocate a new array twice as big and **copy every previously appended character**.
- By using linked chunks, when the buffer is full, \`StringBuilder\` simply allocates a **brand-new chunk** and sets \`m_ChunkPrevious\` to point to the filled chunk!
- Existing characters are **never copied during growth**.
- Only when you invoke \`sb.ToString()\` does the CLR traverse the linked chunks backwards, calculate the total length, and copy all characters into a **single, contiguous string on the heap**.

---

## Capacity, Length & MaxCapacity

| Property | Definition | Default Value |
|---|---|:---:|
| **\`Length\`** | The actual number of characters currently held in the buffer. | \`0\` |
| **\`Capacity\`** | The total allocated character space before a new chunk is required. | \`16\` (or user-specified) |
| **\`MaxCapacity\`** | The upper bound limit beyond which appends throw \`ArgumentOutOfRangeException\`. | \`int.MaxValue\` |

> **Performance Optimization**: Always initialize \`StringBuilder\` with an **estimated capacity** (e.g. \`new StringBuilder(1024)\`). This prevents unnecessary chunk allocations when you know the approximate final size.

---

## Core Operations & API Usage

\`\`\`csharp
using System.Text;

// 1. Initialize with expected capacity
StringBuilder sb = new StringBuilder(512);

// 2. Fluent chaining
sb.Append("HTTP/1.1 200 OK")
  .AppendLine()
  .Append("Content-Type: application/json")
  .AppendLine()
  .AppendLine();

// 3. Formatting without intermediate string allocations
sb.AppendFormat("{{\"userId\": {0}, \"active\": {1}}}", 42, true);

// 4. In-place index modification and character mutation
sb[0] = 'h'; // Direct mutation allowed!

// 5. Build final immutable string
string payload = sb.ToString();
\`\`\`

---

## High-Performance Buffer Reuse: \`sb.Clear()\` & ObjectPool

In high-throughput web APIs (handling $10^4$ requests/sec), continuously allocating \`new StringBuilder()\` creates noticeable GC pressure.

Instead, reuse instances:

\`\`\`csharp
// Reusing a local buffer
StringBuilder reusable = new StringBuilder(256);

for (int i = 0; i < records.Count; i++)
{
    reusable.Clear(); // Resets Length to 0 without freeing the underlying chunk buffer!
    reusable.Append("REC:").Append(records[i].Id);
    ProcessRecord(reusable.ToString());
}
\`\`\`

In enterprise ASP.NET Core applications, use **\`Microsoft.Extensions.ObjectPool.StringBuilderPool\`** to check out and return \`StringBuilder\` instances from a thread-safe pool.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #4 — Problem D (Strings)
*Given two strings $A$ and $B$. Print their lengths separated by space, print their concatenation, and swap their first characters using fast mutable string manipulation.*

#### Problem Analysis
- Input: Two strings $A$ and $B$ ($1 \\le |A|, |B| \\le 10$).
- Output:
  1. Length of $A$ and $B$.
  2. $A + B$.
  3. $A$ and $B$ after swapping $A[0]$ and $B[0]$.

#### C# Implementation

\`\`\`csharp
using System;
using System.Text;

public class FastStringsSolution
{
    public static void Main()
    {
        string? a = Console.ReadLine();
        string? b = Console.ReadLine();
        if (a == null || b == null) return;

        a = a.Trim();
        b = b.Trim();

        // 1. Output lengths
        Console.WriteLine($"{a.Length} {b.Length}");

        // 2. Concatenation via StringBuilder
        StringBuilder concat = new StringBuilder(a.Length + b.Length);
        concat.Append(a).Append(b);
        Console.WriteLine(concat.ToString());

        // 3. In-place first character swap using mutable StringBuilder
        StringBuilder modA = new StringBuilder(a);
        StringBuilder modB = new StringBuilder(b);

        char temp = modA[0];
        modA[0] = modB[0];
        modB[0] = temp;

        Console.WriteLine($"{modA} {modB}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(|A| + |B|)$ — linear time for concatenation and swapping.
- **Space Complexity**: $\\mathcal{O}(|A| + |B|)$ — minimal buffer allocation matching the exact required capacity.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem D: Strings](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/D) | Easy | Mutable Buffer, Swapping, Concatenation |
| ⚪ | Codeforces Assiut | [Problem E: Count](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/E) | Easy | Character Traversal, Numeric Accumulation |
| ⚪ | Exercism C# | [Rotational Cipher](https://exercism.org/tracks/csharp/exercises/rotational-cipher) | Easy | StringBuilder.Append, Character Shift |
| ⚪ | Exercism C# | [Run Length Encoding](https://exercism.org/tracks/csharp/exercises/run-length-encoding) | Medium | Buffer Building, Compression |
`,

  contentBn: `# C# এ স্ট্রিংবিল্ডার (StringBuilder) ও বাফার মেকানিজম

\`System.Text.StringBuilder\` হলো একটি **পরিবর্তনযোগ্য (Mutable) ক্যারেক্টার বাফার**। বারবার সাধারণ স্ট্রিং জোড়া লাগানোর ফলে হিপ মেমরিতে যে বিশাল পরিমাণ অপচয় এবং কোয়াড্রেটিক $O(N^2)$ পারফরম্যান্স বিপর্যয় ঘটে, তা রোধ করতেই এটি বিশেষভাবে নকশা করা হয়েছে।

---

## আধুনিক লিংকড-চাঙ্ক আর্কিটেকচার

অনেকে মনে করেন \`StringBuilder\` সাধারণ একটি রিসাইজেবল অ্যারির মতো কাজ করে যা সাইজ দ্বিগুণ করে। প্রকৃতপক্ষে আধুনিক .NET এ এর অভ্যন্তরীণ কাঠামো অনেক বেশি উন্নত:

\`StringBuilder\` মূলত ক্যারেক্টার অ্যারির একটি **লিংকড লিস্ট (Singly-Linked List of Chunks)**:

\`\`\`
┌───────────────────────────┐      ┌───────────────────────────┐
│       Current Chunk       │      │      Previous Chunk       │
├───────────────────────────┤      ├───────────────────────────┤
│ char[] m_ChunkChars [16]  │      │ char[] m_ChunkChars [16]  │
│ int    m_ChunkLength      │───┐  │ int    m_ChunkLength      │
│ int    m_ChunkOffset      │   │  │ int    m_ChunkOffset      │
│ StringBuilder? Previous   │───┘  │ StringBuilder? Previous   │───► null
└───────────────────────────┘      └───────────────────────────┘
\`\`\`

### লিংকড চাঙ্কের সুবিধা কী?
- সাধারণ অ্যারির ক্ষেত্রে বাফার পূর্ণ হয়ে গেলে নতুন বড় অ্যারে বরাদ্দ করে পূর্বের সব অক্ষর কপি করতে হতো।
- কিন্তু লিংকড চাঙ্ক মডেলে যখন বর্তমান চাঙ্ক পূর্ণ হয়ে যায়, \`StringBuilder\` কোনো পুরানো ডেটা কপি না করে সরাসরি **নতুন একটি চাঙ্ক** বরাদ্দ করে এবং আগের চাঙ্কটির রেফারেন্স পয়েন্টার হিসেবে যুক্ত করে নেয়।
- এর ফলে নতুন ক্যারেক্টার যোগ করার সময় কোনো অতিরিক্ত মেমোরি কপি করার প্রয়োজন পড়ে না।
- শুধুমাত্র যখন \`sb.ToString()\` কল করা হয়, তখনই এটি পেছন থেকে সবগুলো চাঙ্ক স্ক্যান করে সম্পূর্ণ টেক্সটকে একটি একক নিরবচ্ছিন্ন হিপ স্ট্রিংয়ে রূপান্তর করে।

---

## Capacity, Length ও MaxCapacity

| প্রোপার্টি | সংজ্ঞা | ডিফল্ট মান |
|---|---|:---:|
| **\`Length\`** | বাফারে বর্তমানে মোট কতটি অক্ষর রয়েছে। | \`0\` |
| **\`Capacity\`** | নতুন চাঙ্ক বরাদ্দের পূর্বে বর্তমান বাফারের মোট ধারণক্ষমতা। | \`16\` (বা ব্যবহারকারী নির্ধারিত) |
| **\`MaxCapacity\`** | বাফারের সর্বোচ্চ সীমা যা অতিক্রম করলে এরর ঘটে। | \`int.MaxValue\` |

> **পারফরম্যান্স টিপস**: সম্ভাব্য আকার জানা থাকলে সর্বদা প্রাথমিক ক্যাপাসিটি নির্ধারণ করে \`StringBuilder\` শুরু করা উচিত (যেমন \`new StringBuilder(1024)\`)। এতে অপ্রয়োজনীয় চাঙ্ক অ্যালোকেশন কমে যায়।

---

## মৌলিক অপারেশন ও কোড সিনট্যাক্স

\`\`\`csharp
using System.Text;

// ১. সম্ভাব্য ক্যাপাসিটি দিয়ে ইনিশিয়ালাইজেশন
StringBuilder sb = new StringBuilder(512);

// ২. ফ্লুয়েন্ট মেথড চেইনিং
sb.Append("HTTP/1.1 200 OK")
  .AppendLine()
  .Append("Content-Type: application/json")
  .AppendLine()
  .AppendLine();

// ৩. অতিরিক্ত স্ট্রিং তৈরি ছাড়াই ফরম্যাটিং
sb.AppendFormat("{{\"userId\": {0}, \"active\": {1}}}", 42, true);

// ৪. ইন-প্লেস ক্যারেক্টার পরিবর্তন
sb[0] = 'h'; // সরাসরি পরিবর্তন সম্ভব!

// ৫. ফাইনাল অপরিবর্তনশীল স্ট্রিং তৈরি
string payload = sb.ToString();
\`\`\`

---

## উচ্চ কার্যক্ষমতায় বাফার পুনর্ব্যবহার: \`sb.Clear()\`

প্রতি সেকেন্ডে হাজার হাজার রিকোয়েস্ট হ্যান্ডেল করা এন্টারপ্রাইজ সিস্টেমে বারবার \`new StringBuilder()\` বানালে গার্বেজ কালেকশনে চাপ পড়ে।

এর পরিবর্তে একই বাফার পুনরায় ব্যবহার করা যায়:

\`\`\`csharp
StringBuilder reusable = new StringBuilder(256);

for (int i = 0; i < records.Count; i++)
{
    reusable.Clear(); // মেমোরি মুক্ত না করে Length শূন্য করে বাফারকে পুনরায় ব্যবহারের উপযোগী করে
    reusable.Append("REC:").Append(records[i].Id);
    ProcessRecord(reusable.ToString());
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কোডফোর্সেস আসসিউত শিট #৪ — Problem D (Strings)
*দুটি স্ট্রিং $A$ এবং $B$ এর দৈর্ঘ্য প্রিন্ট করতে হবে, তাদের কনক্যাটেনেশন প্রিন্ট করতে হবে এবং তাদের প্রথম অক্ষর দুটি অদলবদল করে প্রিন্ট করতে হবে।*

#### সমাধান বিশ্লেষণ
- \`StringBuilder\` ব্যবহার করে অতিরিক্ত মেমোরি খরচ ছাড়া কনক্যাটেনেশন এবং প্রথম ক্যারেক্টার ইন-প্লেস সোয়াপ সম্পন্ন করা হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Text;

public class FastStringsSolution
{
    public static void Main()
    {
        string? a = Console.ReadLine();
        string? b = Console.ReadLine();
        if (a == null || b == null) return;

        a = a.Trim();
        b = b.Trim();

        // ১. দৈর্ঘ্য প্রিন্ট
        Console.WriteLine($"{a.Length} {b.Length}");

        // ২. StringBuilder দিয়ে দ্রুত কনক্যাটেনেশন
        StringBuilder concat = new StringBuilder(a.Length + b.Length);
        concat.Append(a).Append(b);
        Console.WriteLine(concat.ToString());

        // ৩. মিউটেবল বাফার দিয়ে প্রথম অক্ষরের সোয়াপ
        StringBuilder modA = new StringBuilder(a);
        StringBuilder modB = new StringBuilder(b);

        char temp = modA[0];
        modA[0] = modB[0];
        modB[0] = temp;

        Console.WriteLine($"{modA} {modB}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(|A| + |B|)$ — স্ট্রিংগুলোর যোগফল অনুযায়ী লিনিয়ার টাইম।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(|A| + |B|)$ — নির্ধারিত বাফার মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem D: Strings](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/D) | Easy | Mutable Buffer, Swapping, Concatenation |
| ⚪ | Codeforces Assiut | [Problem E: Count](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/E) | Easy | Character Traversal, Numeric Accumulation |
| ⚪ | Exercism C# | [Rotational Cipher](https://exercism.org/tracks/csharp/exercises/rotational-cipher) | Easy | StringBuilder.Append, Character Shift |
| ⚪ | Exercism C# | [Run Length Encoding](https://exercism.org/tracks/csharp/exercises/run-length-encoding) | Medium | Buffer Building, Compression |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces Assiut Sheet #4",
      name: "Problem D: Strings",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/D",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["StringBuilder", "Strings", "Swapping"],
      solutionEn: "Use StringBuilder buffers to concatenate strings and swap initial characters in place.",
      solutionBn: "স্ট্রিংবিল্ডার বাফার দিয়ে স্ট্রিং জোড়া লাগানো এবং ইন-প্লেস প্রথম ক্যারেক্টার অদলবদল সম্পন্ন করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #4",
      name: "Problem E: Count",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/E",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Strings", "Characters", "Sum"],
      solutionEn: "Iterate across digits of an arbitrarily large numeric string and accumulate their arithmetic sum.",
      solutionBn: "বড় সাইজের স্ট্রিংয়ের প্রতিটি ডিজিট স্ক্যান করে তাদের সংখ্যাবাচক যোগফল নির্ণয় করুন।",
    },
    {
      source: "Exercism C#",
      name: "Rotational Cipher",
      url: "https://exercism.org/tracks/csharp/exercises/rotational-cipher",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["StringBuilder", "Cipher", "Modulo"],
      solutionEn: "Construct Caesar cipher strings efficiently by appending shifted alphabet characters to StringBuilder.",
      solutionBn: "স্ট্রিংবিল্ডারে শিফট করা ক্যারেক্টার অ্যাপেন্ড করে দক্ষ উপায়ে সিজার সাইফার এনকোডিং সম্পন্ন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Run Length Encoding",
      url: "https://exercism.org/tracks/csharp/exercises/run-length-encoding",
      difficulty: "MEDIUM",
      company: "Kaz Software",
      tags: ["StringBuilder", "Encoding", "Compression"],
      solutionEn: "Compress consecutive matching characters into run-length tokens using a mutable character buffer.",
      solutionBn: "ধারাবাহিক ক্যারেক্টার কাউন্ট করে মিউটেবল বাফারের সাহায্যে রান-লেংথ এনকোডিং সম্পন্ন করুন।",
    },
  ],
};
