import type { LocalLesson } from "@/lib/lessons-data";

export const resourcesTryFinallyLesson: LocalLesson = {
  slug: "resources-try-finally",
  titleEn: "try-finally Resource Cleanup",
  titleBn: "ট্রাই-ফাইনালি (try-finally) রিসোর্স ক্লিনআপ",
  categoryEn: "16. Resource Management",
  categoryBn: "১৬. রিসোর্স ম্যানেজমেন্ট ও ডিসপোজাল",
  categoryDescEn:
    "Deterministic resource cleanup: IDisposable interface, standard Dispose pattern, using statements, finalizers, and suppressing finalization.",
  categoryDescBn:
    "ডিটারমিনিস্টিক রিসোর্স ক্লিনআপ: IDisposable ইন্টারফেস, স্ট্যান্ডার্ড ডিসপোজ প্যাটার্ন, using স্টেটমেন্ট ও ফাইনাইলাইজার।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Manual cleanup architectures, lock release patterns with Monitor.Exit, and scenarios where using is not applicable.",
  descriptionBn:
    "ম্যানুয়াল ক্লিনআপ কৌশল, Monitor.Exit ও লকিং এবং যেসব ক্ষেত্রে using প্রযোজ্য নয় সেখানে try-finally এর ব্যবহার।",
  difficulty: "EASY",
  displayOrder: 4,
  prerequisites: ["resources-using"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# try-finally Resource Cleanup in C#

While the \`using\` statement is the standard idiomatic construct for types implementing \`IDisposable\`, a pure **\`try-finally\`** block (without an intercepting \`catch\`) represents the fundamental, low-level engine of exception-resilient state restoration in the .NET runtime.

---

## 1. Why Pure \`try-finally\` Matters

A pure \`try-finally\` block does not swallow or silence exceptions. Instead, it allows any thrown exception to propagate naturally up the call stack while guaranteeing that local teardown code executes before stack frames are unwound:

\`\`\`
       [Execution Enters 'try']
                  │
        Does an Exception Occur?
               ╱          ╲
             YES           NO
              │             │
    Save Exception Data     Normal Code Finishes
              │             │
              ▼             ▼
       [EXECUTE 'finally' CLEANUP BLOCK]
       (Guaranteed to run in both paths)
              │
    Is There a Propagating Exception?
               ╱          ╲
             YES           NO
              │             │
    Rethrow Up Call Stack   Continue Execution
\`\`\`

---

## 2. Scenarios Where \`using\` Cannot Be Used

The C# \`using\` statement requires the target instance to implement \`IDisposable\` (or expose a duck-typed \`Dispose()\` method on a \`ref struct\`). In countless real-world architectures, you must manage cleanup for entities that cannot implement \`IDisposable\`:

### 1. Temporary Environment / Console State Alteration:
\`\`\`csharp
public static void RunWithHiddenCursor(Action action)
{
    bool originalCursor = Console.CursorVisible;
    try
    {
        Console.CursorVisible = false;
        action();
    }
    finally
    {
        // Guaranteed restoration even on unhandled exceptions or Ctrl+C
        Console.CursorVisible = originalCursor;
    }
}
\`\`\`

### 2. Impersonation / Thread Context Swapping:
When temporarily switching thread culture, security tokens, or diagnostic trace contexts:
\`\`\`csharp
var previousCulture = Thread.CurrentThread.CurrentCulture;
try
{
    Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;
    FormatFinancialPayload();
}
finally
{
    Thread.CurrentThread.CurrentCulture = previousCulture;
}
\`\`\`

### 3. Non-Disposable Transactional Rollback:
\`\`\`csharp
BeginManualTransaction();
try
{
    ExecuteDatabaseCommands();
    CommitManualTransaction();
}
finally
{
    // If an exception aborted before commit, rollback uncommitted state
    if (IsTransactionActive())
    {
        RollbackManualTransaction();
    }
}
\`\`\`

---

## 3. The Anatomy of \`lock (syncRoot)\` and \`ref lockTaken\`

One of the most ubiquitous applications of \`try-finally\` is thread synchronization. The C# \`lock\` keyword lowers directly to \`Monitor.Enter\` and \`Monitor.Exit\`.

### Historical Vulnerability (Pre-.NET 4.0):
In early .NET versions, \`lock (obj)\` lowered to:
\`\`\`csharp
Monitor.Enter(obj);
try
{
    // critical section
}
finally
{
    Monitor.Exit(obj);
}
\`\`\`
**The Defect**: If an asynchronous thread abort (\`Thread.Abort\`) or an out-of-memory condition occurred *immediately after* \`Monitor.Enter\` acquired the lock but *before* the CLR entered the \`try\` block, the \`finally\` handler was never registered. The lock was permanently orphaned, resulting in an unrecoverable application deadlock!

### Modern Lowering (.NET 4.0+ with \`ref lockTaken\`):
To eliminate this race condition, the Roslyn compiler lowers modern \`lock\` statements using the two-argument \`Monitor.Enter\` overload:

\`\`\`csharp
bool lockTaken = false;
try
{
    Monitor.Enter(syncRoot, ref lockTaken);
    // Critical Section: Only one thread executes here concurrently
}
finally
{
    if (lockTaken)
    {
        Monitor.Exit(syncRoot); // Guaranteed release
    }
}
\`\`\`

Because \`Monitor.Enter\` is placed *inside* the \`try\` block, any exception thrown during lock acquisition immediately routes to \`finally\`. If the lock was successfully taken, \`lockTaken\` is set to \`true\` atomically by the runtime, ensuring that \`Monitor.Exit\` is only invoked when valid.

---

## 4. Execution Guarantees & Edge Cases

### What Triggers \`finally\` Execution?
The CLR guarantees \`finally\` block execution under almost all program flow control statements:
- Normal sequential completion.
- \`return\` statement executed from within \`try\`.
- \`break\`, \`continue\`, or \`goto\` jumping out of \`try\`.
- Unhandled or rethrown exceptions.

### When Does \`finally\` NOT Execute?
There are rare and critical catastrophic scenarios where the CLR aborts execution without executing \`finally\` blocks:
1. **\`Environment.FailFast()\`**: Intentionally terminates the process immediately for fatal, unrecoverable state corruption, bypassing finalizers and \`finally\` handlers.
2. **Stack Overflow (\`StackOverflowException\`)**: When call frames exhaust physical stack memory, the runtime immediately aborts the process because stack space is insufficient to construct exception dispatch tables.
3. **Hard Process Termination**: Operating system SIGKILL, task manager termination, or sudden power loss.
4. **Infinite Loops or Deadlocks**: If execution never departs the \`try\` block, \`finally\` is never reached.

---

## 5. Practical Implementation Pattern

\`\`\`csharp
using System;
using System.Threading;

public class HighPerformanceTelemetryScope
{
    private static int _activeOperations = 0;

    public static void ExecuteMonitoredTask(string taskName, Action task)
    {
        // Increment global concurrency counter
        Interlocked.Increment(ref _activeOperations);
        long startTick = Environment.TickCount64;

        try
        {
            Console.WriteLine($"[START] {taskName} (Active: {_activeOperations})");
            task();
        }
        finally
        {
            // Guaranteed counter decrement and duration tracking
            long elapsed = Environment.TickCount64 - startTick;
            Interlocked.Decrement(ref _activeOperations);
            Console.WriteLine($"[END] {taskName} in {elapsed}ms (Remaining: {_activeOperations})");
        }
    }
}
\`\`\`

---

## 6. Practical Problem Walkthrough

### Problem: Range Sum Query with Deterministic Scoping
*Source: Codeforces Assiut Sheet #3: Problem Y (Range sum query)*

Given an array of $N$ numbers and $Q$ queries, each query provides two indices $L$ and $R$ ($1$-indexed). You must compute the sum of numbers from index $L$ to $R$. Because $N, Q \\le 10^5$, responding to each query in $O(N)$ time causes a Time Limit Exceeded (TLE) verdict ($O(N \\times Q) \\approx 10^{10}$ operations).

### Algorithmic Strategy:
1. **Prefix Sum Precomputation**: Construct a 64-bit (\`long\`) prefix sum array $P$, where $P[i] = P[i - 1] + A[i]$. This precomputation requires $O(N)$ time.
2. **$O(1)$ Range Query Answer**: For any range $[L, R]$, the sum is calculated in constant time:
   $$\\text{Sum}(L, R) = P[R] - P[L - 1]$$
3. **Guaranteed Teardown via \`try-finally\`**: Buffer allocation and performance timer states are wrapped in an ironclad \`try-finally\` block to guarantee system cleanup.

### C# Solution:

\`\`\`csharp
using System;
using System.IO;

public class Program
{
    public static void Main()
    {
        // Ensure standard input/output stream handles are deterministically closed
        StreamReader? reader = null;
        StreamWriter? writer = null;

        try
        {
            reader = new StreamReader(Console.OpenStandardInput(), bufferSize: 65536);
            writer = new StreamWriter(Console.OpenStandardOutput(), bufferSize: 65536);

            string? firstLine = reader.ReadLine();
            if (string.IsNullOrEmpty(firstLine)) return;

            string[] header = firstLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            int n = int.Parse(header[0]);
            int q = int.Parse(header[1]);

            // Use 64-bit prefix sum to prevent integer overflow
            long[] prefixSum = new long[n + 1];
            string[] numbers = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < n; i++)
            {
                prefixSum[i + 1] = prefixSum[i] + long.Parse(numbers[i]);
            }

            // Process Q queries in O(1) time each
            for (int i = 0; i < q; i++)
            {
                string[] queryParts = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);
                int l = int.Parse(queryParts[0]);
                int r = int.Parse(queryParts[1]);

                long rangeSum = prefixSum[r] - prefixSum[l - 1];
                writer.WriteLine(rangeSum);
            }
        }
        finally
        {
            // Pure try-finally cleanup guarantee
            writer?.Flush();
            writer?.Dispose();
            reader?.Dispose();
        }
    }
}
\`\`\`

---

## 7. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Range sum query](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Y) | Medium | Prefix Sums, O(1) Queries, try-finally |
| ⚪ | Codeforces | [Assiut Sheet #3: Replace MinMax](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/M) | Easy | In-place Swapping, State Integrity |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Medium | Monitor.Exit, Thread Synchronization |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | State Restoration, Buffer Wraparound |
`,

  contentBn: `# C# এ ট্রাই-ফাইনালি (try-finally) রিসোর্স ক্লিনআপ

সি# এ যেসব টাইপ \`IDisposable\` ইন্টারফেস ইমপ্লিমেন্ট করে তাদের জন্য \`using\` স্টেটমেন্ট আদর্শ হলেও, কোনো \`catch\` ব্লক ছাড়া সরাসরি **\`try-finally\`** ব্লক ব্যবহার করা হলো .NET রানটাইমের সবচেয়ে মৌলিক ও নিম্নস্তরের নির্ভরযোগ্য স্টেট পুনরুদ্ধার পদ্ধতি।

---

## ১. নির্ভেজাল \`try-finally\` কেন অপরিহার্য

কোনো নির্ভেজাল (Pure) \`try-finally\` ব্লক ভেতরের কোনো এক্সেপশনকে লুকিয়ে ফেলে না (Swallow করে না)। এর বদলে এটি এক্সেপশনটিকে স্বাভাবিক নিয়মে কল স্ট্যাক বরাবর উপরে উঠতে দেয়, কিন্তু স্ট্যাক ফ্রেম ধ্বংস হওয়ার পূর্বেই \`finally\` ব্লকের ক্লিনআপ নিশ্চিতভাবে এক্সিকিউট করে:

\`\`\`
       ['try' ব্লকে এক্সিকিউশন শুরু]
                  │
          কোনো এক্সেপশন ঘটেছে কি?
               ╱          ╲
             হ্যাঁ          না
              │             │
      এক্সেপশন ডেটা সংরক্ষণ   সাধারণ কাজ সম্পন্ন
              │             │
              ▼             ▼
       ['finally' ব্লকের ক্লিনআপ কোড এক্সিকিউট]
       (উভয় অবস্থাতেই চলা শতভাগ নিশ্চিত)
              │
       বাতাসে কোনো এক্সেপশন আছে কি?
               ╱          ╲
             হ্যাঁ          না
              │             │
     স্ট্যাকে পুনরায় নিক্ষেপ    পরবর্তী লাইন চালু
\`\`\`

---

## ২. যেসব ক্ষেত্রে \`using\` ব্যবহার করা সম্ভব নয়

সি# এর \`using\` স্টেটমেন্ট শুধুমাত্র তখনই ব্যবহার করা যায় যখন অবজেক্টটি \`IDisposable\` বা \`IAsyncDisposable\` ইমপ্লিমেন্ট করে। বাস্তব সফটওয়্যার আর্কিটেকচারে এমন বহু পরিস্থিতি আসে যেখানে এই ইন্টারফেস থাকে না:

### ১. সাময়িক কনসোল বা সিস্টেম স্টেট পরিবর্তন:
\`\`\`csharp
public static void RunWithHiddenCursor(Action action)
{
    bool originalCursor = Console.CursorVisible;
    try
    {
        Console.CursorVisible = false;
        action();
    }
    finally
    {
        // ক্র্যাশ বা এক্সেপশন ঘটলেও কার্সার আগের অবস্থায় ফিরে আসবে
        Console.CursorVisible = originalCursor;
    }
}
\`\`\`

### ২. থ্রেডের কালচার বা সিকিউরিটি টোকেন পরিবর্তন:
\`\`\`csharp
var previousCulture = Thread.CurrentThread.CurrentCulture;
try
{
    Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;
    FormatFinancialPayload();
}
finally
{
    Thread.CurrentThread.CurrentCulture = previousCulture;
}
\`\`\`

### ৩. নন-ডিসপোজেবল ট্রানজ্যাকশন রোলব্যাক:
\`\`\`csharp
BeginManualTransaction();
try
{
    ExecuteDatabaseCommands();
    CommitManualTransaction();
}
finally
{
    // কোনো কারণে কমিট না হলে রোলব্যাক নিশ্চিত করা
    if (IsTransactionActive())
    {
        RollbackManualTransaction();
    }
}
\`\`\`

---

## ৩. \`lock (syncRoot)\` এর অভ্যন্তরীণ রূপ ও \`ref lockTaken\`

মাল্টিথ্রেডিংয়ে সি# এর বহুল ব্যবহৃত \`lock\` কি-ওয়ার্ড কম্পাইলারের মাধ্যমে একটি নিখুঁত \`try-finally\` ব্লকে রূপান্তরিত হয়।

### আদি .NET সংস্করণের দুর্বলতা (Pre-.NET 4.0):
প্রথম দিকে \`lock (obj)\` নিচের কোডে রূপান্তরিত হতো:
\`\`\`csharp
Monitor.Enter(obj);
try
{
    // ক্রিটিকাল সেকশন
}
finally
{
    Monitor.Exit(obj);
}
\`\`\`
**সমস্যা**: যদি \`Monitor.Enter\` লক গ্রহণ করার ঠিক পরপরই কিন্তু \`try\` ব্লকে ঢোকার এক মিলি-সেকেন্ড পূর্বে মেমোরি সংকট বা থ্রেড অ্যাবর্ট ঘটে, তবে \`finally\` ব্লক কখনোই রেজিস্টার্ড হতো না। ফলে লকটি আজীবনের জন্য আটকে গিয়ে পুরো সার্ভার ডেডলক হয়ে যেত!

### আধুনিক রূপান্তর (.NET 4.0+ ও \`ref lockTaken\`):
এই রেস কন্ডিশন দূর করতে Roslyn কম্পাইলার আধুনিক \`lock\` স্টেটমেন্টকে নিচের রূপে রূপান্তর করে:

\`\`\`csharp
bool lockTaken = false;
try
{
    Monitor.Enter(syncRoot, ref lockTaken);
    // ক্রিটিকাল সেকশন: একই সময়ে কেবল একটি থ্রেড চলবে
}
finally
{
    if (lockTaken)
    {
        Monitor.Exit(syncRoot); // শতভাগ নিশ্চিত আনলক
    }
}
\`\`\`

যেহেতু \`Monitor.Enter\` কলটি সরাসরি \`try\` ব্লকের ভেতরে রাখা হয়েছে, তাই যেকোনো অপ্রত্যাশিত ত্রুটি সরাসরি \`finally\` তে চলে যায়। আর লক পাওয়া গেলেই কেবল \`lockTaken\` ট্রু হয়, যার ফলে আনলক নিরাপদ থাকে।

---

## ৪. এক্সিকিউশন নিশ্চয়তা ও ব্যতিক্রম পরিস্থিতি

### কোন কোন ক্ষেত্রে \`finally\` কার্যকর হয়?
- কোড স্বাভাবিকভাবে শেষ হলে।
- \`try\` ব্লকের ভেতর থেকে সরাসরি \`return\` কল করা হলে।
- লুপের ভেতরে \`break\`, \`continue\` বা \`goto\` দিয়ে বাইরে চলে গেলে।
- আনহ্যান্ডেলড এক্সেপশন ঘটলে।

### কোন কোন চরম পরিস্থিতিতে \`finally\` চলে না?
১. **\`Environment.FailFast()\`**: মারাত্মক ডেটা করাপশন রোধে এই মেথড পুরো প্রসেসকে এক নিমেষে বন্ধ করে দেয়।
২. **স্ট্যাক ওভারফ্লো (\`StackOverflowException\`)**: স্ট্যাক মেমোরি ফুরিয়ে গেলে রানটাইম নিজে কোনো ফ্রেম প্রসেস করতে পারে না এবং সাথে সাথে বন্ধ হয়ে যায়।
৩. **অপারেটিং সিস্টেম ফোর্স কিল**: টাস্ক ম্যানেজার থেকে \`kill\` সিগন্যাল বা হার্ডওয়্যার পাওয়ার বন্ধ হলে।
৪. **ইনফিনিট লুপ**: \`try\` ব্লকের ভেতর যদি অনন্ত লুপ চলে, তবে কোড কখনোই \`finally\` তে পৌঁছাবে না।

---

## ৫. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: রেঞ্জ সাম কুয়েরি ও ডিটারমিনিস্টিক স্ট্রিম ক্লিনিং
*সোর্স: কোডফোর্সেস আসিউট শিট #৩: প্রবলেম Y (Range sum query)*

প্রদত্ত $N$ আকারের একটি অ্যারে এবং $Q$ সংখ্যক কুয়েরির জন্য প্রতিটি কুয়েরিতে $L$ থেকে $R$ পর্যন্ত উপাদানগুলোর যোগফল বের করতে হবে। সরাসরি লুপ চালিয়ে প্রতিবার যোগ করলে টাইম লিমিট এক্সিডেড (TLE) হবে ($O(N \\times Q) \\approx 10^{10}$ অপারেশন)।

### সমাধান কৌশল:
১. **প্রিফিক্স সাম (Prefix Sum) তৈরি**: $O(N)$ সময়ে একটি অ্যারে $P$ তৈরি করা যেখানে $P[i] = P[i-1] + A[i]$।
২. **$O(1)$ সময়ে কুয়েরি সমাধান**: যে কোনো $[L, R]$ রেঞ্জের যোগফল:
   $$\\text{Sum}(L, R) = P[R] - P[L - 1]$$
৩. **\`try-finally\` দ্বারা বাফার ফ্ল্যাশ**: দ্রুত I/O সম্পন্ন করার পর নিশ্চিতভাবে স্ট্রিম বন্ধ ও ফ্ল্যাশ করা।

### সম্পূর্ণ সি# সলিউশন:

\`\`\`csharp
using System;
using System.IO;

public class Program
{
    public static void Main()
    {
        StreamReader? reader = null;
        StreamWriter? writer = null;

        try
        {
            reader = new StreamReader(Console.OpenStandardInput(), bufferSize: 65536);
            writer = new StreamWriter(Console.OpenStandardOutput(), bufferSize: 65536);

            string? firstLine = reader.ReadLine();
            if (string.IsNullOrEmpty(firstLine)) return;

            string[] header = firstLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            int n = int.Parse(header[0]);
            int q = int.Parse(header[1]);

            // ওভারফ্লো এড়াতে long প্রিফিক্স সাম অ্যারে
            long[] prefixSum = new long[n + 1];
            string[] numbers = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < n; i++)
            {
                prefixSum[i + 1] = prefixSum[i] + long.Parse(numbers[i]);
            }

            // O(1) সময়ে প্রতিটি কুয়েরি সমাধান
            for (int i = 0; i < q; i++)
            {
                string[] queryParts = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);
                int l = int.Parse(queryParts[0]);
                int r = int.Parse(queryParts[1]);

                long rangeSum = prefixSum[r] - prefixSum[l - 1];
                writer.WriteLine(rangeSum);
            }
        }
        finally
        {
            // নির্ভেজাল try-finally ক্লিনআপ
            writer?.Flush();
            writer?.Dispose();
            reader?.Dispose();
        }
    }
}
\`\`\`

---

## ৬. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Range sum query](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Y) | Medium | Prefix Sums, O(1) Queries, try-finally |
| ⚪ | Codeforces | [Assiut Sheet #3: Replace MinMax](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/M) | Easy | In-place Swapping, State Integrity |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Medium | Monitor.Exit, Thread Synchronization |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | State Restoration, Buffer Wraparound |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Range sum query",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Y",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["Prefix Sums", "try-finally", "Fast I/O"],
      solutionEn:
        "Precompute cumulative prefix sums in linear time to answer arbitrary subsegment sum queries in O(1) time.",
      solutionBn:
        "যেকোনো সাবসেগমেন্টের যোগফল O(1) সময়ে পেতে লিনিয়ার সময়ে কিউমুলেটিভ প্রিফিক্স সাম হিসাব করে রাখুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Replace MinMax",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/M",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Array", "In-place", "State"],
      solutionEn:
        "Locate the minimum and maximum elements in an array and swap their positions in-place.",
      solutionBn:
        "অ্যারের সর্বনিম্ন ও সর্বোচ্চ উপাদান খুঁজে বের করে তাদের অবস্থান ইন-প্লেস অদলবদল করুন।",
    },
    {
      source: "Exercism C#",
      name: "Bank Account",
      url: "https://exercism.org/tracks/csharp/exercises/bank-account",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Concurrency", "Monitor", "try-finally"],
      solutionEn:
        "Safely synchronize concurrent balance mutations using Monitor.Enter with guaranteed Monitor.Exit in finally.",
      solutionBn:
        "finally ব্লকে নিশ্চিত Monitor.Exit এর মাধ্যমে একাধিক থ্রেডের ব্যালেন্স ট্রানজ্যাকশন নিরাপদে পরিচালনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Circular Buffer",
      url: "https://exercism.org/tracks/csharp/exercises/circular-buffer",
      difficulty: "MEDIUM",
      company: "Optimizely",
      tags: ["Ring Buffer", "State", "Cleanup"],
      solutionEn:
        "Implement a cyclic byte queue that overwrites oldest entries when full with exception-safe state restoration.",
      solutionBn:
        "এক্সেপশন-সেফ স্টেট রিস্টোরেশনের সাথে সাইক্লিক বাইট কিউ বাস্তবায়ন করুন।",
    },
  ],
};
