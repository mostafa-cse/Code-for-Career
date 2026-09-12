import type { LocalLesson } from "@/lib/lessons-data";

export const resourcesDisposeLesson: LocalLesson = {
  slug: "resources-dispose",
  titleEn: "Dispose vs Finalizer (~ClassName)",
  titleBn: "ডিসপোজ বনাম ফাইনাইলাইজার (~ClassName)",
  categoryEn: "16. Resource Management",
  categoryBn: "১৬. রিসোর্স ম্যানেজমেন্ট ও ডিসপোজাল",
  categoryDescEn:
    "Deterministic resource cleanup: IDisposable interface, standard Dispose pattern, using statements, finalizers, and suppressing finalization.",
  categoryDescBn:
    ".NET এ ডিটারমিনিস্টিক রিসোর্স ক্লিনআপ: IDisposable ইন্টারফেস, স্ট্যান্ডার্ড ডিসপোজ প্যাটার্ন, using স্টেটমেন্ট ও ফাইনাইলাইজার।",
  categoryPriority: "CORE",
  descriptionEn:
    "Deterministic vs non-deterministic cleanup, finalization queue, freachable queue, promotion to Gen 2, and process crashes from finalizer exceptions.",
  descriptionBn:
    "ডিটারমিনিস্টিক বনাম অনির্ধারিত ক্লিনআপ, ফাইনালাইজেশন কিউ, ফ্রিকিয়েবল কিউ, Gen 2 তে পদোন্নতি ও ফাইনাইলাইজার এক্সেপশন ক্র্যাশ।",
  difficulty: "HARD",
  displayOrder: 2,
  prerequisites: ["resources-idisposable"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Dispose vs Finalizer (~ClassName) in C#

One of the most essential distinctions in .NET resource architecture is the contrast between explicit cleanup via **\`Dispose()\`** and background cleanup via a **Finalizer (\`~ClassName()\`)**.

---

## Architectural Comparison Matrix

| Dimension | \`Dispose()\` | Finalizer (\`~ClassName()\`) |
| :--- | :--- | :--- |
| **Invocation Type** | **Deterministic**: Explicitly called by developer or \`using\` block. | **Non-Deterministic**: Invoked unpredictably by the CLR. |
| **Execution Thread** | Caller's active thread (synchronous). | **Dedicated CLR Finalizer Thread**. |
| **Timing** | **Immediate**: Runs as soon as execution leaves scope. | **Delayed**: Only runs during a subsequent GC pass. |
| **Generational Impact** | Collected cheaply in **Gen 0**. | Promoted to **Gen 1 / Gen 2** via \`freachable\` queue! |
| **Managed Reference Safety**| **Safe**: All managed fields are intact and usable. | **FATAL RISK**: Managed fields may already be finalized/collected! |
| **Exception Handling** | Caught on the calling thread. | **Catastrophic**: Unhandled exception **terminates the entire process**! |

---

## Under the Hood: The Finalization & freachable Queues

When a class declares a finalizer (\`~ClassName()\`), the CLR introduces significant memory tracking overhead:

\`\`\`
   [Object Allocation] ───► Placed on Finalization Queue
                                  │
                          Object Becomes Dead
                                  │
                                  ▼
   [First GC Pass]     ───► Moved to "freachable" Queue (CANNOT be freed yet!)
                            Promoted to Next Generation (Gen 1 or Gen 2)
                                  │
                          Finalizer Thread Drains Queue & Runs ~ClassName()
                                  │
                                  ▼
   [Second GC Pass]    ───► Memory Finally Reclaimed!
\`\`\`

### The 4 Penalties of Finalizers:
1. **Prolonged Memory Retention**: An object with a finalizer requires at least **two full GC cycles** to have its memory reclaimed.
2. **Promotion Bloat**: Because it must stay alive for the finalizer thread, it survives into **Gen 1 or Gen 2**, occupying memory for a prolonged duration.
3. **Single-Thread Bottleneck**: The CLR uses a single dedicated finalizer thread to drain the \`freachable\` queue. If a single finalizer performs blocking I/O or deadlocks, the entire finalization pipeline halts!
4. **Resurrection Trap**: An object can "resurrect" itself inside a finalizer by assigning \`this\` to a static root reference, creating dangerous zombie object states.

---

## Syntax & Implementation

\`\`\`csharp
using System;
using System.Runtime.InteropServices;

public class NativeMemoryBuffer : IDisposable
{
    private IntPtr _nativeMemory;
    private bool _disposed = false;

    public NativeMemoryBuffer(int sizeInBytes)
    {
        _nativeMemory = Marshal.AllocHGlobal(sizeInBytes);
    }

    // Deterministic Dispose
    public void Dispose()
    {
        Cleanup(disposing: true);
        GC.SuppressFinalize(this); // Bypass freachable queue
    }

    // Non-deterministic Finalizer (safety net for developer negligence)
    ~NativeMemoryBuffer()
    {
        Cleanup(disposing: false);
    }

    private void Cleanup(bool disposing)
    {
        if (_disposed) return;

        if (_nativeMemory != IntPtr.Zero)
        {
            Marshal.FreeHGlobal(_nativeMemory);
            _nativeMemory = IntPtr.Zero;
        }

        _disposed = true;
    }
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 Problem V (Frequency Array)
*Given two numbers $N$ and $M$ ($1 \le M \le 10^5$), and an array $A$ of $N$ numbers. Count the frequency of each number from $1$ to $M$.*

#### Algorithmic Analysis
1. Read $N$ and $M$.
2. To avoid high memory allocations, allocate a direct frequency array of size $M + 1$.
3. Traverse the $N$ integers and increment the direct index: \`freq[val]++\`.
4. Output frequencies from index $1$ to $M$.

#### C# Implementation

\`\`\`csharp
using System;
using System.Text;

public class Program
{
    public static void Main()
    {
        string? nmLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nmLine)) return;

        string[] nmTokens = nmLine.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(nmTokens[0]);
        int m = int.Parse(nmTokens[1]);

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Pre-allocated frequency array avoiding intermediate heap object churn
        int[] frequency = new int[m + 1];

        for (int i = 0; i < n; i++)
        {
            int val = int.Parse(tokens[i]);
            if (val >= 1 && val <= m)
            {
                frequency[val]++;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= m; i++)
        {
            sb.AppendLine(frequency[i].ToString());
        }

        Console.Write(sb.ToString());
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(N + M)$, single pass through $N$ tokens and output generation across $M$ bins.
- **Space Complexity**: $\mathcal{O}(M)$ for the fixed frequency array, keeping GC heap pressure minimal.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Frequency Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V) | Easy | Direct index mapping, Memory allocation |
| ⚪ | Codeforces | [Assiut Sheet #3: Replacement](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C) | Easy | In-place mutations, Deterministic processing |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Medium | State lifecycle, Deterministic teardown |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | Object lifecycle, State transitions |
`,

  contentBn: `# C# এ ডিসপোজ বনাম ফাইনাইলাইজার (~ClassName)

.NET মেমোরি আর্কিটেকচারের সবচেয়ে গুরুত্বপূর্ণ বিষয়গুলোর একটি হলো **\`Dispose()\`** এবং **ফাইনাইলাইজার (\`~ClassName()\`)** এর মধ্যকার পার্থক্য।

---

## তুলনামূলক বিশ্লেষণ সারণী

| বৈশিষ্ট্য | \`Dispose()\` | ফাইনাইলাইজার (\`~ClassName()\`) |
| :--- | :--- | :--- |
| **কল করার ধরন** | **ডিটারমিনিস্টিক**: প্রোগ্রামার নিজে অথবা \`using\` ব্লক দিয়ে কল করেন। | **অনির্ধারিত (Non-Deterministic)**: CLR এর নিজস্ব নিয়মে কল হয়। |
| **যে থ্রেডে চলে** | কলারের মূল অ্যাপ্লিকেশন থ্রেডে। | **CLR-এর ডেডিকেটেড ফাইনাইলাইজার থ্রেডে**। |
| **এক্সিকিউশনের সময়** | **তাৎক্ষণিক**: কাজ শেষ হওয়ার সাথে সাথে মুক্ত হয়। | **দেরিতে**: পরবর্তীতে কোনো এক সময় GC চলার সময় এক্সিকিউট হয়। |
| **জেনারেশনের প্রভাব** | স্বল্প খরচে **Gen 0** তেই মেমোরি মুক্ত হয়ে যায়। | \`freachable\` কিউ-এর কারণে **Gen 1 বা Gen 2** তে উন্নীত হয়! |
| **ম্যানেজড অবজেক্ট রিড**| **নিরাপদ**: সমস্ত রেফারেন্স জীবিত ও কার্যকর থাকে। | **মারাত্মক ঝুঁকিপূর্ণ**: সংশ্লিষ্ট ম্যানেজড অবজেক্ট আগেই ডিলিট হয়ে থাকতে পারে! |
| **এক্সেপশন হ্যান্ডলিং** | কলার থ্রেডে সহজে ক্যাচ করা যায়। | **ভয়াবহ**: হ্যান্ডেল না করা এক্সেপশন **সম্পূর্ণ প্রসেস ক্র্যাশ করিয়ে দেয়**! |

---

## আন্ডার দ্য হুড: ফাইনাইলাইজেশন ও ফ্রিকিয়েবল (freachable) কিউ

কোনো ক্লাসে ফাইনালাইজার (\`~ClassName()\`) থাকলে রানটাইমে মেমোরি ম্যানেজমেন্টে বড় ধরনের ওভারহেড তৈরি হয়:

\`\`\`
   [অবজেক্ট তৈরি] ──────► Finalization Queue তে যুক্ত হয়
                                  │
                          অবজেক্টের কাজ শেষ (Dead)
                                  │
                                  ▼
   [১ম GC পাস]     ──────► "freachable" Queue তে যায় (এখনও মেমোরি মোছা যাবে না!)
                          পরবর্তী জেনারেশনে পদোন্নতি পায় (Gen 1 বা Gen 2)
                                  │
                          Finalizer থ্রেড এসে ~ClassName() মেথডটি চালায়
                                  │
                                  ▼
   [২য় GC পাস]    ──────► অবশেষে মেমোরি মুক্ত হয়!
\`\`\`

### ফাইনালাইজারের ৪টি বড় ক্ষতি:
১. **বিলম্বিত মেমোরি মুক্তি**: একটি ফাইনালাইজারযুক্ত অবজেক্টের মেমোরি সম্পূর্ণ পরিষ্কার হতে কমপক্ষে **দুটি পূর্ণ GC সাইকেল** প্রয়োজন হয়।
২. **মেমোরি পদোন্নতি (Promotion)**: ফাইনালাইজার চলার অপেক্ষায় থাকতে গিয়ে অবজেক্টটি **Gen 1 বা Gen 2** তে উন্নীত হয়, ফলে দীর্ঘ সময় র‍্যাম আটকে রাখে।
৩. **একক থ্রেডের ধীরগতি**: সমস্ত অবজেক্টের ফাইনালাইজার চালানোর জন্য CLR-এর মাত্র একটি একক থ্রেড রয়েছে। কোনো একটি ফাইনালাইজারে ব্লকিং I/O বা ডেডলক হলে সমস্ত ফাইনালাইজেশন থমকে যায়!
৪. **রিসারেকশন সমস্যা**: ফাইনালাইজারের ভেতর থেকে \`this\` কোনো গ্লোবাল স্ট্যাটিক রেফারেন্সে দিয়ে দিলে মৃত অবজেক্ট আবার পুনরুজ্জীবিত (Resurrected) হয়ে অদ্ভুত ত্রুটি তৈরি করে।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #3 Problem V (Frequency Array)
*দুটি সংখ্যা $N$ এবং $M$ ($1 \le M \le 10^5$), এবং $N$ আকারের একটি অ্যারে দেওয়া আছে। $1$ থেকে $M$ পর্যন্ত প্রতিটি সংখ্যার উপস্থিতি গণনা করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে $N$ এবং $M$ রিড করা।
২. মেমোরি সাশ্রয় করতে সরাসরি $M + 1$ সাইজের একটি ফ্রিকোয়েন্সি অ্যারে বরাদ্দ করা।
৩. অ্যারের মান অনুযায়ী সরাসরি ইনডেক্স বাড়িয়ে (\`freq[val]++\`) ফ্রিকোয়েন্সি হিসাব করা এবং প্রিন্ট করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Text;

public class Program
{
    public static void Main()
    {
        string? nmLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nmLine)) return;

        string[] nmTokens = nmLine.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(nmTokens[0]);
        int m = int.Parse(nmTokens[1]);

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        int[] frequency = new int[m + 1];

        for (int i = 0; i < n; i++)
        {
            int val = int.Parse(tokens[i]);
            if (val >= 1 && val <= m)
            {
                frequency[val]++;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= m; i++)
        {
            sb.AppendLine(frequency[i].ToString());
        }

        Console.Write(sb.ToString());
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\mathcal{O}(N + M)$, $N$ সংখ্যক টোকেন পড়ে $M$ টি বাকেটে আউটপুট প্রদর্শন।
- **স্পেস কমপ্লেক্সিটি**: ফ্রিকোয়েন্সি অ্যারের জন্য $\mathcal{O}(M)$ মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Frequency Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V) | Easy | Direct index mapping, Memory allocation |
| ⚪ | Codeforces | [Assiut Sheet #3: Replacement](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C) | Easy | In-place mutations, Deterministic processing |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Medium | State lifecycle, Deterministic teardown |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | Object lifecycle, State transitions |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Frequency Array",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Array", "Memory", "Frequencies"],
      solutionEn:
        "Count occurrences of numbers up to M using a fixed pre-allocated integer array to eliminate garbage allocations.",
      solutionBn:
        "অতিরিক্ত মেমোরি খরচ এড়াতে নির্দিষ্ট আকারের একটি ইনটিজার অ্যারে ব্যবহার করে M পর্যন্ত সংখ্যাগুলোর ফ্রিকোয়েন্সি হিসাব করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Replacement",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Array", "In-place", "Deterministic"],
      solutionEn:
        "Mutate array values in-place deterministically to replace positive and negative integers.",
      solutionBn:
        "ইন-প্লেস মিউটেশনের মাধ্যমে অ্যারের ধনাত্মক ও ঋণাত্মক সংখ্যাগুলোকে নির্দিষ্ট মানে রূপান্তর করুন।",
    },
    {
      source: "Exercism C#",
      name: "Bank Account",
      url: "https://exercism.org/tracks/csharp/exercises/bank-account",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Lifecycle", "Dispose", "State"],
      solutionEn:
        "Manage account open and close states deterministically to prevent balance reads after closure.",
      solutionBn:
        "অ্যাকাউন্ট বন্ধ করার পর ব্যালেন্স রিড প্রতিরোধ করতে স্টেট লাইফসাইকেল নিশ্চিতভাবে পরিচালনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Robot Simulator",
      url: "https://exercism.org/tracks/csharp/exercises/robot-simulator",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["State Machine", "Simulation", "Resources"],
      solutionEn:
        "Control robot movements and bearings across a 2D plane through sequential instruction execution.",
      solutionBn:
        "দিকনির্দেশনা কার্যকর করার মাধ্যমে দ্বিমাত্রিক তলে রোবটের অবস্থান ও গতিবিধি নিয়ন্ত্রণ করুন।",
    },
  ],
};
