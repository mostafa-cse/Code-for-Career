import type { LocalLesson } from "@/lib/lessons-data";

export const resourcesIdisposableLesson: LocalLesson = {
  slug: "resources-idisposable",
  titleEn: "IDisposable & Dispose Pattern",
  titleBn: "আই-ডিসপোজেবল (IDisposable) ও ডিসপোজ প্যাটার্ন",
  categoryEn: "16. Resource Management",
  categoryBn: "১৬. রিসোর্স ম্যানেজমেন্ট ও ডিসপোজাল",
  categoryDescEn:
    "Deterministic resource cleanup: IDisposable interface, standard Dispose pattern, using statements, finalizers, and suppressing finalization.",
  categoryDescBn:
    ".NET এ ডিটারমিনিস্টিক রিসোর্স ক্লিনআপ: IDisposable ইন্টারফেস, স্ট্যান্ডার্ড ডিসপোজ প্যাটার্ন, using স্টেটমেন্ট ও ফাইনাইলাইজার।",
  categoryPriority: "CORE",
  descriptionEn:
    "Deterministic release of unmanaged resources, the standard Dispose(bool disposing) pattern, GC.SuppressFinalize, and SafeHandle abstractions.",
  descriptionBn:
    "আনম্যানেজড রিসোর্সের নিশ্চিত মুক্তি, প্রমিত Dispose(bool disposing) প্যাটার্ন, GC.SuppressFinalize এবং SafeHandle অ্যাবস্ট্রাকশন।",
  difficulty: "MEDIUM",
  displayOrder: 1,
  prerequisites: ["memory-garbage-collection"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# IDisposable & Dispose Pattern in C#

While the .NET Garbage Collector (GC) automatically manages and reclaims **managed heap memory**, it has zero knowledge of **unmanaged operating system resources** (file descriptors, database connections, sockets, and native Win32/POSIX handles). 

Because OS resources are finite, relying on the GC to eventually collect objects holding them leads to resource starvation (e.g. \`System.IO.IOException: Too many open files\`). The **\`IDisposable\`** interface solves this by enabling **deterministic resource cleanup**.

---

## The Standard Dispose Pattern

Implementing the Dispose pattern correctly requires handling two distinct cleanup paths:
1. **Explicit Client Disposal**: The caller explicitly calls \`Dispose()\` or exits a \`using\` block. Both managed and unmanaged resources must be freed immediately.
2. **Implicit Finalizer Cleanup**: The caller forgot to call \`Dispose()\`. The CLR finalizer thread executes later and frees **only unmanaged resources** (accessing managed objects from a finalizer is dangerous because they may have already been garbage collected!).

\`\`\`csharp
using System;
using System.IO;
using Microsoft.Win32.SafeHandles;

public class ResourceHolder : IDisposable
{
    private bool _disposed = false;

    // Managed resource (implements IDisposable)
    private FileStream? _managedFileStream;

    // Unmanaged resource wrapper (safe handle)
    private SafeFileHandle? _unmanagedHandle;

    public ResourceHolder(string path)
    {
        _managedFileStream = new FileStream(path, FileMode.OpenOrCreate);
        _unmanagedHandle = _managedFileStream.SafeFileHandle;
    }

    // Public deterministic entry point
    public void Dispose()
    {
        Dispose(disposing: true);

        // Tell the GC not to run the finalizer (saves Gen 2 promotion!)
        GC.SuppressFinalize(this);
    }

    // Protected virtual method allowing derived classes to extend cleanup
    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;

        if (disposing)
        {
            // 1. Clean up managed IDisposable objects
            _managedFileStream?.Dispose();
            _managedFileStream = null;
        }

        // 2. Clean up unmanaged resources (safe handles or raw pointers)
        _unmanagedHandle?.Dispose();
        _unmanagedHandle = null;

        _disposed = true;
    }

    // Optional Finalizer (only needed if class directly owns raw unmanaged pointers)
    ~ResourceHolder()
    {
        Dispose(disposing: false);
    }

    // Defensive guard on public methods
    public void WriteData(byte[] data)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        _managedFileStream?.Write(data, 0, data.Length);
    }
}
\`\`\`

---

## Why GC.SuppressFinalize(this) is Critical

When an object has a finalizer (\`~ClassName()\`), the runtime places a pointer to it in the **Finalization Queue** upon allocation:
- If \`Dispose()\` is called and you omit \`GC.SuppressFinalize(this)\`, the GC cannot reclaim the object during its first pass!
- Instead, the GC moves it to the **freachable Queue** and promotes it into **Gen 1 or Gen 2**, delaying its memory reclamation by minutes or hours.
- Calling \`GC.SuppressFinalize(this)\` removes the object from the finalization queue immediately, allowing it to die cheaply in **Gen 0**!

---

## SafeHandle vs Raw IntPtr

In modern C#, never hold raw \`IntPtr\` values for unmanaged OS resources. Always derive from or use **\`SafeHandle\`** (e.g. \`SafeFileHandle\`, \`SafeWaitHandle\`):

| Dimension | Raw \`IntPtr\` | \`SafeHandle\` |
| :--- | :--- | :--- |
| **Recycling Attack Safety** | Vulnerable to OS handle reuse races | Immune to handle recycling race conditions |
| **Finalization Reliability** | Can leak if thread abort occurs during allocation | Inherits from \`CriticalFinalizerObject\` (guaranteed execution) |
| **Code Complexity** | Requires custom finalizer code | Encapsulates its own finalization logic |

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 Problem P (Minimize Number)
*Given an array $A$ of $N$ positive integers. Find the maximum number of operations you can perform where an operation consists of dividing every element by 2 as long as all elements remain even.*

#### Algorithmic Analysis
1. Read $N$ and the integers.
2. In competitive programming and systems programming, dividing by 2 while all numbers are even is equivalent to finding the minimum number of trailing zeros in the binary representations (or the minimum count of factors of 2).
3. If any number is initially odd, output $0$. Otherwise, count division passes until at least one element becomes odd.

#### C# Implementation

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = tokens.Length;

        int[] numbers = new int[n];
        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
            // If any number is odd initially, zero operations are possible
            if ((numbers[i] & 1) != 0)
            {
                Console.WriteLine(0);
                return;
            }
        }

        int operations = 0;
        bool canDivide = true;

        while (canDivide)
        {
            for (int i = 0; i < n; i++)
            {
                if ((numbers[i] & 1) != 0)
                {
                    canDivide = false;
                    break;
                }
                numbers[i] >>= 1; // Divide by 2 via right-shift
            }

            if (canDivide)
            {
                operations++;
            }
        }

        Console.WriteLine(operations);
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(N \log(\min(A)))$, bounded by the number of factors of 2 (at most 30 iterations for 32-bit integers).
- **Space Complexity**: $\mathcal{O}(N)$ for the array storage.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Minimize Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/P) | Easy | Bitwise division, Parity verification |
| ⚪ | Codeforces | [Assiut Sheet #3: Frequency Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V) | Easy | Bounded array indexing, Frequency counting |
| ⚪ | Exercism C# | [Resource Management](https://exercism.org/tracks/csharp/exercises/strain) | Medium | \`IDisposable\`, Cleanup patterns |
| ⚪ | Exercism C# | [Rest API](https://exercism.org/tracks/csharp/exercises/rest-api) | Medium | State encapsulation, Resource endpoints |
`,

  contentBn: `# C# এ আই-ডিসপোজেবল (IDisposable) ও ডিসপোজ প্যাটার্ন

.NET কমন ল্যাঙ্গুয়েজ রানটাইমের গার্বেজ কালেক্টর (GC) স্বয়ংক্রিয়ভাবে **ম্যানেজড হিপ মেমোরি** মুক্ত করতে পারলেও অপারেটিং সিস্টেমের **আনম্যানেজড রিসোর্স** (ফাইল ডেসক্রিপ্টর, ডাটাবেজ কানেকশন, নেটওয়ার্ক সকেট ও ওএস হ্যান্ডেল) সম্পর্কে কিছুই জানে না।

যেহেতু ওএস রিসোর্সের সংখ্যা সীমিত, তাই GC কখন অবজেক্টটি ডিলিট করবে তার অপেক্ষায় বসে থাকলে সিস্টেমের রিসোর্স শেষ হয়ে \`Too many open files\` এর মতো মারাত্মক ক্র্যাশ ঘটতে পারে। এই সমস্যা নিশ্চিতভাবে সমাধানের জন্যই **\`IDisposable\`** ইন্টারফেস এবং **ডিটারমিনিস্টিক ডিসপোজ প্যাটার্ন** ব্যবহৃত হয়।

---

## প্রমিত ডিসপোজ প্যাটার্ন (The Standard Dispose Pattern)

সঠিক ডিসপোজ প্যাটার্নে দুটি পৃথক ক্লিনআপ পাথ সামলাতে হয়:
১. **সরাসরি কলার দ্বারা ক্লিনআপ**: যখন প্রোগ্রামার নিজে \`Dispose()\` কল করেন বা \`using\` ব্লক শেষ হয়। তখন ম্যানেজড এবং আনম্যানেজড উভয় রিসোর্সই সাথে সাথে মুক্ত করা হয়।
২. **ফাইনালাইজার দ্বারা ক্লিনআপ**: প্রোগ্রামার যদি \`Dispose()\` কল করতে ভুলে যান, তবে GC-র ফাইনালাইজার থ্রেড পরবর্তীতে চলে শুধুমাত্র **আনম্যানেজড রিসোর্স** মুক্ত করে (ফাইনালাইজার থেকে ম্যানেজড অবজেক্ট রিড করা বিপজ্জনক, কারণ তারা আগেই মুছে গিয়ে থাকতে পারে!)।

\`\`\`csharp
using System;
using System.IO;
using Microsoft.Win32.SafeHandles;

public class ResourceHolder : IDisposable
{
    private bool _disposed = false;

    // ম্যানেজড রিসোর্স (IDisposable ইমপ্লিমেন্ট করে)
    private FileStream? _managedFileStream;

    // আনম্যানেজড ওএস রিসোর্স হ্যান্ডেল
    private SafeFileHandle? _unmanagedHandle;

    public ResourceHolder(string path)
    {
        _managedFileStream = new FileStream(path, FileMode.OpenOrCreate);
        _unmanagedHandle = _managedFileStream.SafeFileHandle;
    }

    // পাবলিক ডিসপোজ মেথড
    public void Dispose()
    {
        Dispose(disposing: true);

        // GC কে বলে দেওয়া যাতে ফাইনালাইজার আর না চালায় (Gen 2 পদোন্নতি বাঁচে!)
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;

        if (disposing)
        {
            // ১. ম্যানেজড অবজেক্টগুলো পরিষ্কার করা
            _managedFileStream?.Dispose();
            _managedFileStream = null;
        }

        // ২. আনম্যানেজড রিসোর্সগুলো পরিষ্কার করা
        _unmanagedHandle?.Dispose();
        _unmanagedHandle = null;

        _disposed = true;
    }

    // ফাইনালাইজার (কেবলমাত্র সরাসরি আনম্যানেজড মেমোরি থাকলে প্রয়োজন)
    ~ResourceHolder()
    {
        Dispose(disposing: false);
    }

    public void WriteData(byte[] data)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        _managedFileStream?.Write(data, 0, data.Length);
    }
}
\`\`\`

---

## কেন GC.SuppressFinalize(this) অত্যন্ত গুরুত্বপূর্ণ?

যেসব ক্লাসে ফাইনালাইজার থাকে, অবজেক্ট তৈরির সাথে সাথে CLR সেটির পয়েন্টার **Finalization Queue** তে জমা রাখে:
- \`Dispose()\` কল করার পর যদি \`GC.SuppressFinalize(this)\` না দেওয়া হয়, তবে GC প্রথম রানে অবজেক্টটিকে মেমোরি থেকে মুছতে পারে না!
- অবজেক্টটিকে **freachable Queue** তে পাঠিয়ে **Gen 1 বা Gen 2** তে উন্নীত করা হয়, যার ফলে ঘণ্টার পর ঘণ্টা মেমোরি আটকে থাকে।
- \`GC.SuppressFinalize(this)\` কল করলে অবজেক্টটি ফাইনালাইজেশন কিউ থেকে সাথে সাথে বাদ পড়ে যায় এবং **Gen 0** তেই স্বল্প খরচে মুছে যায়!

---

## SafeHandle বনাম র’ IntPtr

আধুনিক C# এ আনম্যানেজড পয়েন্টারের জন্য কখনো সরাসরি \`IntPtr\` ব্যবহার করবেন না। সবসময় **\`SafeHandle\`** ব্যবহার করুন:

| বৈশিষ্ট্য | সাধারণ \`IntPtr\` | \`SafeHandle\` |
| :--- | :--- | :--- |
| **রিসাইক্লিং নিরাপত্তা** | ওএস হ্যান্ডেল পরিবর্তনজনিত রেস কন্ডিশনের ঝুঁকি থাকে | হ্যান্ডেল রিসাইক্লিং রেস কন্ডিশন থেকে সম্পূর্ণ মুক্ত |
| **ফাইনালাইজেশন গ্যারান্টি** | থ্রেড অ্যাবর্ট হলে মেমোরি লিক হতে পারে | \`CriticalFinalizerObject\` হওয়ায় নিশ্চিতভাবে এক্সিকিউট হয় |
| **কোডের জটিলতা** | ম্যানুয়াল ফাইনালাইজার লজিক লিখতে হয় | নিজস্ব ফাইনালাইজার স্বয়ংক্রিয়ভাবে হ্যান্ডেল করে |

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #3 Problem P (Minimize Number)
*একটি সংখ্যা $N$ এবং $N$ আকারের একটি অ্যারে দেওয়া আছে। যতক্ষণ পর্যন্ত অ্যারের সমস্ত সংখ্যা জোড় থাকে, ততক্ষণ সমস্ত উপাদানকে ২ দিয়ে ভাগ করা যায়। সর্বোচ্চ কতবার এই অপারেশন চালানো যাবে?*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে সংখ্যাগুলো রিড করা।
২. শুরুতে কোনো সংখ্যা বিজোড় হলে ০ প্রিন্ট করা।
৩. বিটওয়াইজ শিফটের (\`>>= 1\`) মাধ্যমে প্রতিটি সংখ্যাকে ২ দিয়ে ভাগ করা এবং যতক্ষণ পর্যন্ত সব সংখ্যা জোড় থাকে ততক্ষণ অপারেশনের সংখ্যা বৃদ্ধি করা।

#### C# সমাধান

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = tokens.Length;

        int[] numbers = new int[n];
        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
            if ((numbers[i] & 1) != 0)
            {
                Console.WriteLine(0);
                return;
            }
        }

        int operations = 0;
        bool canDivide = true;

        while (canDivide)
        {
            for (int i = 0; i < n; i++)
            {
                if ((numbers[i] & 1) != 0)
                {
                    canDivide = false;
                    break;
                }
                numbers[i] >>= 1;
            }

            if (canDivide)
            {
                operations++;
            }
        }

        Console.WriteLine(operations);
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\mathcal{O}(N \log(\min(A)))$, ৩২-বিট পূর্ণসংখ্যার ক্ষেত্রে লুপ সর্বোচ্চ ৩০ বার চলবে।
- **স্পেস কমপ্লেক্সিটি**: অ্যারে সংরক্ষণে $\mathcal{O}(N)$ মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Minimize Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/P) | Easy | Bitwise division, Parity verification |
| ⚪ | Codeforces | [Assiut Sheet #3: Frequency Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V) | Easy | Bounded array indexing, Frequency counting |
| ⚪ | Exercism C# | [Resource Management](https://exercism.org/tracks/csharp/exercises/strain) | Medium | \`IDisposable\`, Cleanup patterns |
| ⚪ | Exercism C# | [Rest API](https://exercism.org/tracks/csharp/exercises/rest-api) | Medium | State encapsulation, Resource endpoints |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Minimize Number",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/P",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Bitwise", "Parity", "Array"],
      solutionEn:
        "Count maximum global divisions by 2 across array elements while all elements remain even.",
      solutionBn:
        "যতক্ষণ পর্যন্ত অ্যারের প্রতিটি সংখ্যা জোড় থাকে ততক্ষণ ২ দিয়ে ভাগ করার সর্বোচ্চ সংখ্যা গণনা করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Frequency Array",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Array", "Lookup", "Frequency"],
      solutionEn:
        "Count the frequencies of numbers from 1 to M in an array of size N using a direct frequency lookup table.",
      solutionBn:
        "একটি ফ্রিকোয়েন্সি টেবিলের সাহায্যে N আকারের অ্যারেতে ১ থেকে M পর্যন্ত সংখ্যাগুলোর পুনরাবৃত্তি গণনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Resource Management",
      url: "https://exercism.org/tracks/csharp/exercises/strain",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["IDisposable", "Generics", "Cleanup"],
      solutionEn:
        "Implement resource cleanup semantics using standard deterministic disposal patterns.",
      solutionBn:
        "প্রমিত ডিটারমিনিস্টিক ডিসপোজাল প্যাটার্ন ব্যবহার করে রিসোর্স ক্লিনআপ লজিক ইমপ্লিমেন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Rest API",
      url: "https://exercism.org/tracks/csharp/exercises/rest-api",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["API", "JSON", "State"],
      solutionEn:
        "Manage user accounts and relational IOU transactions using an in-memory REST payload controller.",
      solutionBn:
        "ইন-মেমোরি REST কন্ট্রোলারের মাধ্যমে ব্যবহারকারীর অ্যাকাউন্ট ও লেনদেনের হিসাব পরিচালনা করুন।",
    },
  ],
};
