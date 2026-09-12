import type { LocalLesson } from "@/lib/lessons-data";

export const asyncTaskLesson: LocalLesson = {
  slug: "async-task",
  titleEn: "Task and Task<T>",
  titleBn: "টাস্ক (Task ও Task<T>) প্রমিজ মডেল",
  categoryEn: "17. Async Programming",
  categoryBn: "১৭. অ্যাসিনক্রোনাস প্রোগ্রামিং (async / await)",
  categoryDescEn:
    "Modern asynchronous architecture: Task and ValueTask, async/await state machines, Task.WhenAll/WhenAny, cooperative cancellation, and concurrency vs parallelism.",
  categoryDescBn:
    "আধুনিক অ্যাসিনক্রোনাস আর্কিটেকচার: Task ও ValueTask, async/await স্টেট মেশিন, WhenAll/WhenAny, কো-অপারেটিভ ক্যান্সেলেশন এবং কনকারেন্সি বনাম প্যারালালিজম।",
  categoryPriority: "CORE",
  descriptionEn:
    "The Task-based Asynchronous Pattern (TAP), promises in .NET, Task.CompletedTask, Task.FromResult, and ValueTask optimizations.",
  descriptionBn:
    "টাস্ক-ভিত্তিক অ্যাসিনক্রোনাস প্যাটার্ন (TAP), প্রমিজ মেকানিজম, Task.CompletedTask ও ValueTask অপ্টিমাইজেশন।",
  difficulty: "EASY",
  displayOrder: 2,
  prerequisites: ["async-sync-vs-async"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Task and Task<T> in C#

In the .NET Task-based Asynchronous Pattern (TAP), a **\`Task\`** or **\`Task<T>\`** represents an ongoing or future asynchronous operation. It acts as an asynchronous *promise* or *future*, enabling callers to observe completion, retrieve results, or capture unhandled exceptions.

---

## 1. The Task Lifecycle & Internal States

Every \`Task\` transitions through a formal state machine represented by the \`TaskStatus\` enumeration:

\`\`\`
                          ┌──────────────────────┐
                          │       Created        │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │ WaitingForActivation │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │     WaitingToRun     │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │       Running        │
                          └──────────┬───────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ RanToCompletion  │       │     Canceled     │       │     Faulted      │
└──────────────────┘       └──────────────────┘       └──────────────────┘
\`\`\`

### Status Breakdown:
1. **\`WaitingForActivation\`**: The task is waiting to be triggered by an external event, completion port, or parent task.
2. **\`Running\`**: The code inside the task is actively executing on a ThreadPool worker.
3. **\`RanToCompletion\`**: Completed successfully without unhandled errors. \`Task.IsCompletedSuccessfully\` is \`true\`.
4. **\`Faulted\`**: An unhandled exception was thrown during execution. Stored inside \`task.Exception\` (\`AggregateException\`).
5. **\`Canceled\`**: The task cooperatively aborted execution in response to a \`CancellationToken\`.

---

## 2. The Allocation Cost of \`Task\` vs. \`ValueTask\`

A \`Task\` is a reference type. Every created \`Task\` or \`Task<T>\` incurs a managed heap allocation of approximately **64 to 128 bytes** (plus associated callback delegate and \`ExecutionContext\` captures).

### Pre-Allocated Singletons for Synchronous Completion:
When an asynchronous method can return immediately (such as during validation or a cache hit), avoid heap allocation by returning cached task singletons:
\`\`\`csharp
public Task SaveLogAsync(string message)
{
    // Returns a pre-allocated completed Task singleton (0 allocations)
    if (string.IsNullOrEmpty(message)) return Task.CompletedTask;
    return WriteToDiskAsync(message);
}

public Task<int> GetCachedUserAgeAsync(string userId)
{
    if (_cache.TryGetValue(userId, out int age))
    {
        // Creates a completed Task<int> wrapper
        return Task.FromResult(age);
    }
    return FetchFromDbAsync(userId);
}
\`\`\`

### \`ValueTask\` and \`ValueTask<T>\` (High-Performance Hot Paths):
Introduced in C# 7.0, **\`ValueTask<T>\`** is a \`readonly struct\`. It represents a discriminated union of either a direct value (\`TResult\`) or a reference to a \`Task<T>\` / \`IValueTaskSource<T>\`.

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                        ValueTask<T> (struct)                           │
│                                                                        │
│   Synchronous Path (Cache Hit): ──► Contains raw T value (0 HEAP ALLOC)│
│   Asynchronous Path (I/O Miss): ──► Wraps heap Task<T> / Pooled Source │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

If a method returns synchronously 95% of the time (e.g., reading from an in-memory buffer before hitting the network socket), \`ValueTask<T>\` eliminates **millions of heap allocations**, drastically reducing garbage collection pauses in high-throughput services.

### The 3 Golden Rules of \`ValueTask\`:
1. **Never Await Multiple Times**: A \`ValueTask\` backed by a pooled \`IValueTaskSource\` can be recycled immediately after the first \`await\`. Awaiting it a second time produces undefined behavior and data corruption.
2. **Never Call \`.AsTask()\` Multiple Times**: If you need to store the task, pass it around, or await it more than once, call \`task.AsTask()\` **once** and hold the resulting reference.
3. **Never Block on \`.GetAwaiter().GetResult()\`**: If the \`ValueTask\` has not completed, synchronous blocking can corrupt runtime pooling.

---

## 3. Bridging Legacy APIs: \`TaskCompletionSource<T>\`

When integrating callback-based or event-based legacy APIs into modern \`async\`/\`await\` pipelines, **\`TaskCompletionSource<T>\`** acts as a manual promise bridge:

\`\`\`csharp
public Task<byte[]> ReadSocketPacketAsync(Socket socket)
{
    var tcs = new TaskCompletionSource<byte[]>(TaskCreationOptions.RunContinuationsAsynchronously);

    socket.BeginReceive(buffer, 0, buffer.Length, SocketFlags.None, ar =>
    {
        try
        {
            int bytesRead = socket.EndReceive(ar);
            byte[] result = new byte[bytesRead];
            Array.Copy(buffer, result, bytesRead);
            tcs.SetResult(result); // Transition task to RanToCompletion!
        }
        catch (Exception ex)
        {
            tcs.SetException(ex); // Transition task to Faulted!
        }
    }, null);

    return tcs.Task;
}
\`\`\`

> [!TIP]
> Always pass \`TaskCreationOptions.RunContinuationsAsynchronously\` to \`TaskCompletionSource\` to prevent continuation code from hijacking the thread that calls \`SetResult()\`.

---

## 4. Syntax & Practical Implementation

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class TaskArchitecturePlaybook
{
    private static readonly Dictionary<int, string> _memoryCache = new();

    // 1. Returning ValueTask<T> for zero-allocation cache hits
    public static ValueTask<string> GetCustomerNameAsync(int customerId)
    {
        if (_memoryCache.TryGetValue(customerId, out string? cachedName))
        {
            // Zero heap allocation! Returned synchronously as a struct
            return new ValueTask<string>(cachedName);
        }

        // Asynchronous fallback: Allocates Task only on cache miss
        return new ValueTask<string>(FetchFromDatabaseAsync(customerId));
    }

    private static async Task<string> FetchFromDatabaseAsync(int customerId)
    {
        await Task.Delay(50); // Simulate network query
        string name = $"Customer_{customerId}";
        _memoryCache[customerId] = name;
        return name;
    }
}
\`\`\`

---

## 5. Practical Problem Walkthrough

### Problem: Cache-Backed Fast Search Lookup
*Source: Codeforces Assiut Sheet #3: Problem B (Searching)*

Given an array $A$ of $N$ numbers and a query number $X$, determine the first $0$-indexed position where $X$ appears in $A$. If $X$ is not found, output $-1$.

In enterprise query processing, repeated queries are served from an in-memory cache using \`ValueTask<int>\` to eliminate heap allocations, while un-cached searches execute a single-pass scan.

### Algorithmic Strategy:
1. **Linear Scan**: Scan through array elements from index $0$ to $N - 1$.
2. **Early Exit**: Return index $i$ the instant $A[i] == X$.
3. **Not Found**: If the loop completes without a match, return $-1$.
4. **Complexity**:
   - **Time Complexity**: $O(N)$ worst-case.
   - **Space Complexity**: $O(1)$ auxiliary memory.

### C# Solution:

\`\`\`csharp
using System;
using System.IO;
using System.Threading.Tasks;

public class Program
{
    public static async Task Main()
    {
        using var reader = new StreamReader(Console.OpenStandardInput());
        using var writer = new StreamWriter(Console.OpenStandardOutput());

        string? nLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(nLine)) return;

        int n = int.Parse(nLine.Trim());

        string? arrayLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        string? targetLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(targetLine)) return;

        int target = int.Parse(targetLine.Trim());

        int result = await FindFirstIndexAsync(numbers, target);
        await writer.WriteLineAsync(result.ToString());
    }

    // ValueTask avoids heap allocation for immediate evaluations
    private static ValueTask<int> FindFirstIndexAsync(int[] array, int target)
    {
        for (int i = 0; i < array.Length; i++)
        {
            if (array[i] == target)
            {
                return new ValueTask<int>(i); // 0-allocation struct return
            }
        }

        return new ValueTask<int>(-1);
    }
}
\`\`\`

---

## 6. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Searching](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B) | Easy | Linear Search, ValueTask, TAP |
| ⚪ | Codeforces | [Assiut Sheet #3: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | Array Traversal, Task Pipeline |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Immutability, Task Return Values |
| ⚪ | Exercism C# | [Resistor Color](https://exercism.org/tracks/csharp/exercises/resistor-color) | Easy | Read-only Collections, Fast Lookup |
`,

  contentBn: `# C# এ টাস্ক (Task ও Task<T>) প্রমিজ মডেল

.NET এর Task-based Asynchronous Pattern (TAP) আর্কিটেকচারে **\`Task\`** অথবা **\`Task<T>\`** হলো এমন একটি অবজেক্ট যা ভবিষ্যতে কোনো কাজ সম্পন্ন হবে কিনা তা ট্র্যাক করে। এটি জাভাস্ক্রিপ্টের \`Promise\` বা আধুনিক ভাষার \`Future\` এর মতো কাজ করে, যার মাধ্যমে কোনো অপারেশন শেষ হওয়ার অপেক্ষা করা যায়, ফলাফল পাওয়া যায় বা এরর ক্যাচ করা যায়।

---

## ১. টাস্কের লাইফসাইকেল ও অভ্যন্তরীণ স্টেটসমূহ

প্রতিটি \`Task\` একটি নির্দিষ্ট স্টেট মেশিনের মধ্য দিয়ে পরিচালিত হয় যা \`TaskStatus\` এনাম দ্বারা প্রকাশ পায়:

\`\`\`
                          ┌──────────────────────┐
                          │       Created        │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │ WaitingForActivation │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │     WaitingToRun     │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │       Running        │
                          └──────────┬───────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ RanToCompletion  │       │     Canceled     │       │     Faulted      │
└──────────────────┘       └──────────────────┘       └──────────────────┘
\`\`\`

### বিভিন্ন স্টেটের তাৎপর্য:
১. **\`WaitingForActivation\`**: টাস্কটি সক্রিয় হওয়ার অপেক্ষায় রয়েছে (যেমন I/O কমপ্লিশন বা প্যারেন্ট টাস্কের সিগন্যাল)।
২. **\`Running\`**: থ্রেডপুলের একটি থ্রেডে টাস্কটির কোড বর্তমানে সক্রিয়ভাবে রান করছে।
৩. **\`RanToCompletion\`**: কোনো ত্রুটি ছাড়াই সফলভাবে কাজ শেষ হয়েছে।
৪. **\`Faulted\`**: টাস্ক চলাকালীন কোনো আনহ্যান্ডেলড এক্সেপশন ঘটেছে। মূল এক্সেপশনটি \`task.Exception\` (\`AggregateException\`) এর ভেতর জমা থাকে।
৫. **\`Canceled\`**: \`CancellationToken\` এর মাধ্যমে কাজটি সফলভাবে বাতিল করা হয়েছে।

---

## ২. \`Task\` এর মেমোরি খরচ বনাম \`ValueTask\` অপ্টিমাইজেশন

একটি সাধারণ \`Task\` হলো রেফারেন্স টাইপ (Reference Type)। প্রতিবার একটি নতুন \`Task\` তৈরি করলে হিপে প্রায় **৬৪ থেকে ১২৮ বাইট** মেমোরি বরাদ্দ হয় (সাথে কলব্যাক ডেলিগেট ও \`ExecutionContext\`)।

### সিনক্রোনাস সমাপ্তিতে ক্যাশড সিঙ্গেলটন ব্যবহার:
যখন কোনো মেথড তাৎক্ষণিকভাবে শেষ হতে পারে (যেমন ভ্যালিডেশন ফেইল বা ক্যাশে ডেটা থাকা), তখন নতুন টাস্ক অবজেক্ট না বানিয়ে প্রিবিল্ট সিঙ্গেলটন রিটার্ন করা উচিত:
\`\`\`csharp
public Task SaveLogAsync(string message)
{
    // ০ মেমোরি খরচ: আগে থেকেই তৈরি সিঙ্গেলটন ব্যবহার
    if (string.IsNullOrEmpty(message)) return Task.CompletedTask;
    return WriteToDiskAsync(message);
}

public Task<int> GetCachedUserAgeAsync(string userId)
{
    if (_cache.TryGetValue(userId, out int age))
    {
        // সম্পন্ন ফলাফল সরাসরি মোড়কীকরণ
        return Task.FromResult(age);
    }
    return FetchFromDbAsync(userId);
}
\`\`\`

### \`ValueTask\` ও \`ValueTask<T>\` (শূন্য হিপ মেমোরি বরাদ্দ):
C# 7.0 এ আসা **\`ValueTask<T>\`** হলো একটি \`struct\`। এটি হিপে কোনো মেমোরি তৈরি না করে স্ট্যাকেই সরাসরি ভ্যালু বহন করতে পারে:

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                        ValueTask<T> (struct)                           │
│                                                                        │
│   সিনক্রোনাস পাথ (ক্যাশে ডেটা পাওয়া গেছে): ──► সরাসরি T ভ্যালু (০ হিপ) │
│   অ্যাসিনক্রোনাস পাথ (নেটওয়ার্ক কল লাগবে): ──► Task<T> অবজেক্ট তৈরি   │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

যেসব মেথড ৯৫% ক্ষেত্রে সরাসরি মেমোরি থেকে রেজাল্ট দিয়ে দেয় (যেমন ক্যাশ বা বাফার রিড), সেখানে \`ValueTask<T>\` ব্যবহারের ফলে সার্ভারে **কোটি কোটি হিপ অবজেক্ট তৈরি বন্ধ হয়** এবং গারবেজ কালেক্টরের ওপর কোনো চাপ পড়ে না।

### \`ValueTask\` ব্যবহারের ৩টি সুবর্ণ নিয়ম:
১. **কখনই একাধিকবার await করবেন না**: পুল করা সোর্স প্রথমবার await করার পরেই রিসাইকেল হয়ে যেতে পারে।
২. **কখনই একাধিকবার \`.AsTask()\` কল করবেন না**: প্রয়োজন হলে একবার \`.AsTask()\` এ রূপান্তর করে সেই রেফারেন্স রাখুন।
৩. **\`.GetAwaiter().GetResult()\` দিয়ে ব্লক করবেন না**: টাস্ক শেষ না হওয়া পর্যন্ত এটি ব্লক করা অনিরাপদ।

---

## ৩. লিগ্যাসি এপিআই ব্রিজ: \`TaskCompletionSource<T>\`

পুরাতন ইভেন্ট-ভিত্তিক বা কলব্যাক-ভিত্তিক কোডকে আধুনিক \`async\`/\`await\` প্যাটার্নে রূপান্তর করতে **\`TaskCompletionSource<T>\`** ব্যবহৃত হয়:

\`\`\`csharp
public Task<byte[]> ReadSocketPacketAsync(Socket socket)
{
    var tcs = new TaskCompletionSource<byte[]>(TaskCreationOptions.RunContinuationsAsynchronously);

    socket.BeginReceive(buffer, 0, buffer.Length, SocketFlags.None, ar =>
    {
        try
        {
            int bytesRead = socket.EndReceive(ar);
            byte[] result = new byte[bytesRead];
            Array.Copy(buffer, result, bytesRead);
            tcs.SetResult(result); // টাস্ককে সফল হিসেবে চিহ্নিত করা
        }
        catch (Exception ex)
        {
            tcs.SetException(ex); // এক্সেপশন সেট করা
        }
    }, null);

    return tcs.Task;
}
\`\`\`

---

## ৪. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: দ্রুত সার্চিং ও ক্যাশ-ফার্স্ট লুকআপ
*সোর্স: কোডফোর্সেস আসিউট শিট #৩: প্রবলেম B (Searching)*

প্রদত্ত $N$ আকারের একটি অ্যারে $A$ এবং একটি সংখ্যা $X$ এর জন্য $X$ প্রথম কোন ইন্ডেক্সে পাওয়া যায় তা বের করতে হবে। উপাদানটি না থাকলে $-1$ প্রিন্ট করতে হবে।

### সমাধান কৌশল:
১. **লিনিয়ার স্ক্যান**: $0$ থেকে $N-1$ পর্যন্ত লুপ চালিয়ে মান খোঁজা।
২. **আগে ভাগেই প্রস্থান**: উপাদান পাওয়ার সাথে সাথে তার ইন্ডেক্স রিটার্ন করা।
৩. **ValueTask অপ্টিমাইজেশন**: হিপ মেমোরি বরাদ্দ ছাড়া দ্রুত ফলাফল প্রদান।
৪. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O(N)$।
   - **স্পেস কমপ্লেক্সিটি**: $O(1)$।

### সম্পূর্ণ সি# সলিউশন:

\`\`\`csharp
using System;
using System.IO;
using System.Threading.Tasks;

public class Program
{
    public static async Task Main()
    {
        using var reader = new StreamReader(Console.OpenStandardInput());
        using var writer = new StreamWriter(Console.OpenStandardOutput());

        string? nLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(nLine)) return;

        int n = int.Parse(nLine.Trim());

        string? arrayLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        string? targetLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(targetLine)) return;

        int target = int.Parse(targetLine.Trim());

        int result = await FindFirstIndexAsync(numbers, target);
        await writer.WriteLineAsync(result.ToString());
    }

    private static ValueTask<int> FindFirstIndexAsync(int[] array, int target)
    {
        for (int i = 0; i < array.Length; i++)
        {
            if (array[i] == target)
            {
                return new ValueTask<int>(i); // শূন্য হিপ বরাদ্দে সরাসরি স্ট্রাক্ট রিটার্ন
            }
        }

        return new ValueTask<int>(-1);
    }
}
\`\`\`

---

## ৫. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Searching](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B) | Easy | Linear Search, ValueTask, TAP |
| ⚪ | Codeforces | [Assiut Sheet #3: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | Array Traversal, Task Pipeline |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Immutability, Task Return Values |
| ⚪ | Exercism C# | [Resistor Color](https://exercism.org/tracks/csharp/exercises/resistor-color) | Easy | Read-only Collections, Fast Lookup |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Searching",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Linear Search", "ValueTask", "Arrays"],
      solutionEn:
        "Perform a single linear scan over the array returning early with ValueTask to eliminate heap allocations.",
      solutionBn:
        "অ্যারে জুড়ে লিনিয়ার স্ক্যান করে প্রথম ম্যাচ পাওয়ার সাথে সাথে ValueTask দিয়ে ফলাফল রিটার্ন করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Lowest Number",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Array", "Min Element", "Indices"],
      solutionEn:
        "Track minimum element and 1-based index in linear time across array elements.",
      solutionBn:
        "অ্যারে উপাদানগুলোর মধ্যে সর্বনিম্ন মান ও তার ১-ভিত্তিক ইন্ডেক্স লিনিয়ার সময়ে বের করুন।",
    },
    {
      source: "Exercism C#",
      name: "High Scores",
      url: "https://exercism.org/tracks/csharp/exercises/high-scores",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Task", "Collections", "LINQ"],
      solutionEn:
        "Manage game leaderboard scores cleanly using Task-based collection accessors.",
      solutionBn:
        "টাস্ক-ভিত্তিক কালেকশন মেথড দিয়ে গেমের স্কোরবোর্ড সুরক্ষিতভাবে পরিচালনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Resistor Color",
      url: "https://exercism.org/tracks/csharp/exercises/resistor-color",
      difficulty: "EASY",
      company: "Optimizely",
      tags: ["Arrays", "Lookup", "Constants"],
      solutionEn:
        "Map resistor color bands to numeric codes with constant lookup arrays.",
      solutionBn:
        "কনস্ট্যান্ট লুকআপ অ্যারের মাধ্যমে রেজিস্টার রঙের কোডগুলো সংখ্যায় রূপান্তর করুন।",
    },
  ],
};
