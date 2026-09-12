import type { LocalLesson } from "@/lib/lessons-data";

export const enumFlagsLesson: LocalLesson = {
  slug: "enum-flags",
  titleEn: "[Flags] Enums & Bitwise Operations",
  titleBn: "[Flags] এনাম ও বিটওয়াইজ অপারেশন",
  categoryEn: "10. enum & struct",
  categoryBn: "১০. এনাম ও স্ট্রাকট",
  categoryDescEn:
    "Lightweight custom value types in C#: strongly-typed enumerations, bitwise [Flags], readonly structs, and struct vs class memory tradeoffs.",
  categoryDescBn:
    "সি# এ হালকা কাস্টম ভ্যালু টাইপ: এনাম, বিটওয়াইজ [Flags], readonly স্ট্রাকট এবং স্ট্রাকট বনাম ক্লাস মেমোরি পার্থক্য।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Bitwise flags attribute, powers of two bit masking, bitwise OR/AND/XOR/NOT operations, and the JIT intrinsic optimization of HasFlag.",
  descriptionBn:
    "বিটওয়াইজ ফ্ল্যাগ অ্যাট্রিবিউট, দুইয়ের ঘাত মাস্কিং, বিটওয়াইজ OR/AND/XOR/NOT অপারেশন এবং HasFlag এর JIT ইন্ট্রিনসিক অপ্টিমাইজেশন।",
  difficulty: "MEDIUM",
  displayOrder: 2,
  prerequisites: ["enum-basics"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# [Flags] Enums & Bitwise Operations in C#

Applying the \`[Flags]\` attribute to an enumeration signals that the enum represents a **bit field**—a set of individual binary flags that can be combined, tested, toggled, and cleared using bitwise operators.

This pattern is ubiquitous in system programming, file I/O permissions (\`FileAccess\`, \`FileShare\`), UI rendering states, and high-performance authorization layers.

---

## What [Flags] Actually Does (And What It Doesn't)

A common point of confusion is what the \`[Flags]\` attribute truly affects:

1. **What It DOES NOT Do**:
   - It does **not** change how bitwise operators (\`|\`, \`&\`, \`^\`, \`~\`) execute at runtime. You can perform bitwise arithmetic on any enum regardless of whether \`[Flags]\` is decorated.
2. **What It DOES Do**:
   - It alters string formatting (\`.ToString()\` and \`Enum.Format()\`) to return a comma-separated list of flag names (e.g. \`"Read, Write"\`) instead of a raw integer (e.g. \`"3"\`).
   - It instructs serializers, reflection utilities, and debuggers to render multi-value bit combinations meaningfully.

---

## The Powers of Two Rule & Binary Representation

For bitwise operations to work correctly without collisions, every declared member must be explicitly assigned a unique **power of two** ($2^0, 2^1, 2^2, 2^3, \\dots$):

\`\`\`csharp
[Flags]
public enum FilePermissions : byte
{
    None        = 0,                   // 0000_0000 (No permissions)
    Read        = 1 << 0,              // 0000_0001 (Decimal: 1)
    Write       = 1 << 1,              // 0000_0010 (Decimal: 2)
    Execute     = 1 << 2,              // 0000_0100 (Decimal: 4)
    Delete      = 1 << 3,              // 0000_1000 (Decimal: 8)

    // Composite masks:
    ReadWrite   = Read | Write,        // 0000_0011 (Decimal: 3)
    All         = Read | Write | Execute | Delete // 0000_1111 (Decimal: 15)
}
\`\`\`

---

## The Four Essential Bitwise Operations

\`\`\`csharp
FilePermissions perms = FilePermissions.None;

// 1. ADD / COMBINE flags using Bitwise OR (|)
perms |= FilePermissions.Read;
perms |= FilePermissions.Write; // perms is now Read | Write

// 2. CHECK if a flag is set using Bitwise AND (&)
bool canWrite = (perms & FilePermissions.Write) == FilePermissions.Write;
bool hasWriteBit = (perms & FilePermissions.Write) != 0;

// 3. REMOVE / CLEAR a flag using Bitwise AND with NOT (& ~)
perms &= ~FilePermissions.Write; // Removes Write, leaves Read

// 4. TOGGLE a flag using Bitwise XOR (^)
perms ^= FilePermissions.Execute; // Adds Execute if absent, removes if present
\`\`\`

---

## The Evolution of \`HasFlag\` (The Boxing Myth)

In legacy .NET Framework 4.0, calling \`perms.HasFlag(FilePermissions.Read)\` had a severe performance flaw: \`HasFlag\` accepted \`System.Enum\` as an object parameter, causing **two boxing allocations on the heap** every time it was called in a loop!

> **Modern .NET Standard (.NET 6+)**:
> The .NET JIT compiler treats \`HasFlag\` as an **intrinsic method**. In modern .NET, \`perms.HasFlag(...)\` is compiled directly into a single native CPU \`TEST\` or \`AND\` instruction with **zero boxing and zero allocations**, matching the raw performance of \`&\`.

\`\`\`csharp
// Zero allocations in modern .NET:
if (perms.HasFlag(FilePermissions.Read))
{
    Console.WriteLine("Read access granted.");
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Exercism C# — Attack of the Trolls
*Implement a game permission system where players possess combinations of permissions:*
- *None ($0$)*
- *Read ($1$)*
- *Write ($2$)*
- *Delete ($4$)*
- *All ($7$)*
*Write methods to check permission, grant permission, and revoke permission.*

#### Algorithmic Analysis
1. Define a \`[Flags]\` enum \`Permission : byte\`.
2. Implement bitwise functions:
   - \`CheckPermission(user, required)\`: \`(user & required) == required\`.
   - \`GrantPermission(user, toGrant)\`: \`user | toGrant\`.
   - \`RevokePermission(user, toRevoke)\`: \`user & ~toRevoke\`.

#### C# Implementation

\`\`\`csharp
using System;

[Flags]
public enum Permission : byte
{
    None   = 0,
    Read   = 1 << 0, // 1
    Write  = 1 << 1, // 2
    Delete = 1 << 2, // 4
    All    = Read | Write | Delete // 7
}

public static class PermissionsManager
{
    public static bool Check(Permission current, Permission target)
    {
        return (current & target) == target;
    }

    public static Permission Grant(Permission current, Permission toGrant)
    {
        return current | toGrant;
    }

    public static Permission Revoke(Permission current, Permission toRevoke)
    {
        return current & ~toRevoke;
    }
}

public class Program
{
    public static void Main()
    {
        Permission user = Permission.Read | Permission.Write;
        Console.WriteLine($"Initial: {user}"); // "Read, Write"

        Console.WriteLine($"Can Delete: {PermissionsManager.Check(user, Permission.Delete)}"); // False

        user = PermissionsManager.Grant(user, Permission.Delete);
        Console.WriteLine($"After Grant: {user}"); // "Read, Write, Delete"

        user = PermissionsManager.Revoke(user, Permission.Write);
        Console.WriteLine($"After Revoke: {user}"); // "Read, Delete"
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, bitwise bit-shift, AND, OR, and NOT operations execute in a single CPU clock cycle.
- **Space Complexity**: $\\mathcal{O}(1)$, operations execute directly in CPU registers with zero memory allocation.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Exercism C# | [Attack of the Trolls](https://exercism.org/tracks/csharp/exercises/attack-of-the-trolls) | Medium | \`[Flags]\`, Bitwise operations, Access control |
| ⚪ | Codeforces | [Assiut Sheet #1: Sort Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T) | Easy | Bitwise concepts, Order evaluation, Arrays |
| ⚪ | Exercism C# | [All Your Base](https://exercism.org/tracks/csharp/exercises/all-your-base) | Medium | Positional numeral systems, Bit representations |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | Directional enums, Bitwise movement simulation |
`,

  contentBn: `# C# এ [Flags] এনাম ও বিটওয়াইজ অপারেশন

এনামে \`[Flags]\` অ্যাট্রিবিউট যুক্ত করার অর্থ হলো এর প্রতিটি উপাদানকে একটি স্বতন্ত্র **বাইনারি বিট ফ্ল্যাগ** হিসেবে বিবেচনা করা হবে। এর ফলে বিটওয়াইজ অপারেশনের মাধ্যমে একাধিক অপশনকে একক ভ্যারিয়েবলে সংরক্ষণ, যাচাই ও অপসারণ করা যায়।

সিস্টেম প্রোগ্রামিং, ফাইল রিড/রাইট পারমিশন এবং সিকিউরিটি অথোরাইজেশনে এই প্যাটার্ন অত্যন্ত জনপ্রিয়।

---

## [Flags] অ্যাট্রিবিউট বাস্তবে কী করে (এবং কী করে না)

\`[Flags]\` নিয়ে ডেভেলপারদের মধ্যে একটি প্রচলিত ভ্রান্ত ধারণা রয়েছে:

১. **যা এটি করে না**:
   - এটি রানটাইমে বিটওয়াইজ অপারেশনের (\`|\`, \`&\`, \`^\`, \`~\`) নিয়মে কোনো পরিবর্তন আনে না। \`[Flags]\` ছাড়াও যেকোনো সাধারণ এনামে বিটওয়াইজ অপারেশন করা যায়।
২. **যা এটি করে**:
   - এটি স্ট্রিং রিপ্রেজেন্টেশন বা \`.ToString()\` এর আচরণ পরিবর্তন করে। কোনো ভ্যারিয়েবলে একাধিক বিট অন থাকলে এটি সংখ্যার বদলে কমা দিয়ে আলাদা করা নাম (যেমন \`"Read, Write"\`) রিটার্ন করে।
   - ডিবাগার এবং সিরিয়ালাইজারদের সঠিক কম্বিনেশন প্রদর্শন করতে সাহায্য করে।

---

## দুইয়ের ঘাত (Powers of Two) নীতি

বিটওয়াইজ অপারেশনের সংঘর্ষ এড়াতে প্রতিটি সদস্যকে অবশ্যই **দুইয়ের ঘাতের** ($১, ২, ৪, ৮, ১৬...$ বা \`1 << 0, 1 << 1, 1 << 2...\`) মান প্রদান করতে হয়:

\`\`\`csharp
[Flags]
public enum FilePermissions : byte
{
    None        = 0,                   // 0000_0000 (কোনো অনুমতি নেই)
    Read        = 1 << 0,              // 0000_0001 (দশমিক: ১)
    Write       = 1 << 1,              // 0000_0010 (দশমিক: ২)
    Execute     = 1 << 2,              // 0000_0100 (দশমিক: ৪)
    Delete      = 1 << 3,              // 0000_1000 (দশমিক: ৮)

    // কম্বাইন্ড মাস্ক:
    ReadWrite   = Read | Write,        // 0000_0011 (দশমিক: ৩)
    All         = Read | Write | Execute | Delete // 0000_1111 (দশমিক: ১৫)
}
\`\`\`

---

## চারটি মৌলিক বিটওয়াইজ অপারেশন

\`\`\`csharp
FilePermissions perms = FilePermissions.None;

// ১. নতুন ফ্ল্যাগ যুক্ত করা: Bitwise OR (|)
perms |= FilePermissions.Read;
perms |= FilePermissions.Write; // এখন Read ও Write দুটিই সক্রিয়

// ২. কোনো ফ্ল্যাগ আছে কি না তা যাচাই করা: Bitwise AND (&)
bool canWrite = (perms & FilePermissions.Write) == FilePermissions.Write;

// ৩. কোনো নির্দিষ্ট ফ্ল্যাগ মুছে ফেলা: Bitwise AND with NOT (& ~)
perms &= ~FilePermissions.Write; // Write মুছে কেবল Read অবশিষ্ট থাকবে

// ৪. ফ্ল্যাগ টগল করা (থাকলে মুছে ফেলবে, না থাকলে যোগ করবে): Bitwise XOR (^)
perms ^= FilePermissions.Execute;
\`\`\`

---

## \`HasFlag\` এর বক্সিং সমস্যা ও আধুনিক সমাধান

পুরোনো .NET Framework-এ \`perms.HasFlag(FilePermissions.Read)\` কল করলে ভেতরের অবজেক্টটি মেমোরি হিপে দুবার বক্সিং হতো, যা উচ্চ গতির লুপে মেমোরি প্রেসার তৈরি করত।

> **আধুনিক .NET 6+ মানদণ্ড**:
> আধুনিক .NET-এ JIT কম্পাইলার \`HasFlag\` মেথডকে একটি **ইন্ট্রিনসিক মেথড** হিসেবে চিনে সরাসরি সিপিইউ-এর নেটিভ \`TEST\` বা \`AND\` নির্দেশনায় রূপান্তর করে। ফলে আধুনিক সি#-এ \`HasFlag\` এ **কোনো বক্সিং হয় না এবং কোনো মেমোরি নষ্ট হয় না**।

\`\`\`csharp
// আধুনিক .NET-এ কোনো বক্সিং ওভারহেড নেই:
if (perms.HasFlag(FilePermissions.Read))
{
    Console.WriteLine("পড়ার অনুমতি রয়েছে।");
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Exercism C# — Attack of the Trolls
*খেলোয়াড়দের জন্য একটি পারমিশন সিস্টেম তৈরি করতে হবে যাতে বিভিন্ন অনুমতির সমন্বয় ঘটানো যায়:*
- *None ($0$)*
- *Read ($1$)*
- *Write ($2$)*
- *Delete ($4$)*
- *All ($7$)*
*অনুমতি পরীক্ষা করা, প্রদান করা এবং বাতিল করার মেথড তৈরি করুন।*

#### সমাধান বিশ্লেষণ
১. \`[Flags]\` দিয়ে \`Permission : byte\` এনাম তৈরি করা।
২. বিটওয়াইজ লজিক প্রয়োগ:
   - চেক: \`(current & target) == target\`
   - গ্রান্ট: \`current | toGrant\`
   - বাতিল: \`current & ~toRevoke\`

#### C# সমাধান

\`\`\`csharp
using System;

[Flags]
public enum Permission : byte
{
    None   = 0,
    Read   = 1 << 0, // 1
    Write  = 1 << 1, // 2
    Delete = 1 << 2, // 4
    All    = Read | Write | Delete // 7
}

public static class PermissionsManager
{
    public static bool Check(Permission current, Permission target)
    {
        return (current & target) == target;
    }

    public static Permission Grant(Permission current, Permission toGrant)
    {
        return current | toGrant;
    }

    public static Permission Revoke(Permission current, Permission toRevoke)
    {
        return current & ~toRevoke;
    }
}

public class Program
{
    public static void Main()
    {
        Permission user = Permission.Read | Permission.Write;
        Console.WriteLine($"Initial: {user}"); // "Read, Write"

        Console.WriteLine($"Can Delete: {PermissionsManager.Check(user, Permission.Delete)}"); // False

        user = PermissionsManager.Grant(user, Permission.Delete);
        Console.WriteLine($"After Grant: {user}"); // "Read, Write, Delete"

        user = PermissionsManager.Revoke(user, Permission.Write);
        Console.WriteLine($"After Revoke: {user}"); // "Read, Delete"
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, বিটওয়াইজ অপারেশনগুলো সিপিইউ-এর একক ক্লক সাইকেলে সম্পন্ন হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, রেজিস্টারে এক্সিকিউট হওয়ায় কোনো মেমোরি অপচয় নেই।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Exercism C# | [Attack of the Trolls](https://exercism.org/tracks/csharp/exercises/attack-of-the-trolls) | Medium | \`[Flags]\`, Bitwise operations, Access control |
| ⚪ | Codeforces | [Assiut Sheet #1: Sort Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T) | Easy | Bitwise concepts, Order evaluation, Arrays |
| ⚪ | Exercism C# | [All Your Base](https://exercism.org/tracks/csharp/exercises/all-your-base) | Medium | Positional numeral systems, Bit representations |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | Directional enums, Bitwise movement simulation |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Attack of the Trolls",
      url: "https://exercism.org/tracks/csharp/exercises/attack-of-the-trolls",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Flags", "Bitwise", "Security"],
      solutionEn:
        "Implement role-based access control flags with bitwise operators to grant, revoke, and inspect multi-tier permissions.",
      solutionBn:
        "বিটওয়াইজ অপারেটরের সাহায্যে পারমিশন ফ্ল্যাগ তৈরি করে অধিকার প্রদান, বাতিল এবং যাচাইয়ের মেথড বাস্তবায়ন করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Sort Numbers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Sorting", "Bitwise", "Conditionals"],
      solutionEn:
        "Sort a set of three integers in ascending order while preserving the original input sequence for comparison.",
      solutionBn:
        "তিনটি পূর্ণসংখ্যা আরোহী ক্রমে সাজান এবং তুলনা নিশ্চিত করতে মূল অনুক্রমটি অক্ষত রাখুন।",
    },
    {
      source: "Exercism C#",
      name: "All Your Base",
      url: "https://exercism.org/tracks/csharp/exercises/all-your-base",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["Bit Manipulation", "Math", "Radix"],
      solutionEn:
        "Convert positional numeric digits from any source base to a target base using bitwise scaling and radix arithmetic.",
      solutionBn:
        "পজিশনাল নিউমেরিক ডিজিটকে যেকোনো সোর্স বেস থেকে টার্গেট বেসে রূপান্তর করতে রেডিক্স গাণিতিক বিশ্লেষণ প্রয়োগ করুন।",
    },
    {
      source: "Exercism C#",
      name: "Robot Simulator",
      url: "https://exercism.org/tracks/csharp/exercises/robot-simulator",
      difficulty: "MEDIUM",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Enums", "State Machine", "Simulation"],
      solutionEn:
        "Simulate robot navigation on an infinite grid using directional enums to model bearings and 90-degree rotations.",
      solutionBn:
        "দিকনির্দেশক এনামের সাহায্যে রোবটের ৯০ ডিগ্রি ঘূর্ণন ও গ্রিড মুভমেন্ট সিমুলেশন সম্পন্ন করুন।",
    },
  ],
};
