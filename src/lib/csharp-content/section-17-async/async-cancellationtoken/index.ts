import type { LocalLesson } from "@/lib/lessons-data";

export const asyncCancellationtokenLesson: LocalLesson = {
  slug: "async-cancellationtoken",
  titleEn: "CancellationToken & Cancellation",
  titleBn: "ক্যান্সেলেশন টোকেন (CancellationToken)",
  categoryEn: "17. Async Programming",
  categoryBn: "১৭. অ্যাসিনক্রোনাস প্রোগ্রামিং (async / await)",
  categoryDescEn:
    "Modern asynchronous architecture: Task and ValueTask, async/await state machines, Task.WhenAll/WhenAny, cooperative cancellation, and concurrency vs parallelism.",
  categoryDescBn:
    "আধুনিক অ্যাসিনক্রোনাস আর্কিটেকচার: Task ও ValueTask, async/await স্টেট মেশিন, WhenAll/WhenAny, কো-অপারেティブ ক্যান্সেলেশন এবং কনকারেন্সি বনাম প্যারালালিজম।",
  categoryPriority: "CORE",
  descriptionEn:
    "Cooperative cancellation model, CancellationTokenSource, ThrowIfCancellationRequested, OperationCanceledException, and passing tokens to ASP.NET Core endpoints.",
  descriptionBn:
    "কো-অপারেটিভ ক্যান্সেলেশন মডেল, CancellationTokenSource, ThrowIfCancellationRequested ও এপিআই রিকোয়েস্ট বাতিল।",
  difficulty: "MEDIUM",
  displayOrder: 6,
  prerequisites: ["async-await"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# CancellationToken & Cooperative Cancellation in C#

In the .NET runtime, thread cancellation is strictly **cooperative**. The runtime will **never forcibly terminate a thread**—forcible termination (\`Thread.Abort\`) is obsolete and permanently blocked in modern .NET because it leaves corrupted memory, orphan locks, and unclosed file handles.

Instead, the caller and the worker coordinate gracefully through **\`CancellationTokenSource\`** and **\`CancellationToken\`**.

---

## 1. The Cooperative Architecture

\`\`\`
[Caller Component]
Creates CancellationTokenSource (CTS)
                     │
         cts.Token   │ (Passed as parameter)
                     ▼
             [Worker Task]
             Periodically polls: token.ThrowIfCancellationRequested()
                     │
User clicks Cancel   │
     ──► cts.Cancel()│
                     ▼
             Token enters 'IsCancellationRequested = true'
                     ▼
             Worker encounters ThrowIfCancellationRequested()
                     ▼
             Throws OperationCanceledException
                     ▼
             Task status transitions to TaskStatus.Canceled (Clean Exit!)
\`\`\`

### The Two Roles:
1. **\`CancellationTokenSource\` (CTS)**: The sender. Only the holder of the \`CancellationTokenSource\` instance can initiate cancellation (via \`cts.Cancel()\` or timed \`cts.CancelAfter(TimeSpan)\`).
2. **\`CancellationToken\`**: The receiver. A lightweight, read-only \`struct\` passed down the call chain to worker methods. It allows tasks to check if cancellation was requested without having the authority to trigger it.

---

## 2. Polling, Throwing, and Registration

### 1. Polling via Property:
For tight loops where allocating an exception is undesirable until ready to exit:
\`\`\`csharp
while (hasWork)
{
    if (token.IsCancellationRequested)
    {
        // Clean up internal state before exiting
        break;
    }
    ProcessNextChunk();
}
\`\`\`

### 2. Standard Exit via \`ThrowIfCancellationRequested()\`:
The idiomatic, standard mechanism that immediately stops execution and sets the task status to \`Canceled\`:
\`\`\`csharp
public async Task ProcessDataBatchAsync(List<Item> items, CancellationToken ct)
{
    foreach (var item in items)
    {
        ct.ThrowIfCancellationRequested(); // Throws OperationCanceledException
        await ProcessItemAsync(item, ct);
    }
}
\`\`\`

### 3. Registering Callback for Legacy APIs:
When integrating with APIs that do not accept a \`CancellationToken\`:
\`\`\`csharp
using (token.Register(() => socket.Close()))
{
    // If token is cancelled, socket is closed immediately to abort blocking read
    await socket.ReadAsync(buffer);
}
\`\`\`

---

## 3. Linked Cancellation Tokens

In real-world web APIs, operations frequently have multiple independent reasons to abort:
1. The **user navigated away** or cancelled the browser request.
2. The **server-side timeout limit** (e.g. 5 seconds) expired.

Use **\`CreateLinkedTokenSource\`** to link both conditions into a single composite token:

\`\`\`csharp
public async Task<Order> FetchOrderSafeAsync(int orderId, CancellationToken requestToken)
{
    // Timeout after 5 seconds OR when the client disconnects
    using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
    using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(requestToken, timeoutCts.Token);

    try
    {
        return await _db.Orders.FindAsync(new object[] { orderId }, linkedCts.Token);
    }
    catch (OperationCanceledException) when (timeoutCts.IsCancellationRequested)
    {
        throw new TimeoutException("Database query timed out after 5 seconds.");
    }
}
\`\`\`

---

## 4. Passing Tokens in ASP.NET Core Web APIs

In ASP.NET Core, action methods can inject a \`CancellationToken\` directly into parameters:

\`\`\`csharp
[HttpGet("report/{id}")]
public async Task<IActionResult> GenerateReport(string id, CancellationToken ct)
{
    // ct is automatically cancelled if the client closes the browser tab!
    byte[] reportPdf = await _reportService.BuildAsync(id, ct);
    return File(reportPdf, "application/pdf");
}
\`\`\`

> [!IMPORTANT]
> Failing to pass the injected \`CancellationToken\` downstream to Entity Framework Core or \`HttpClient\` means that if a user cancels an expensive 30-second report generation, your database and CPU keep grinding through the entire calculation, wasting enterprise cloud resources.

---

## 5. Practical Problem Walkthrough

### Problem: Lucky Array Evaluation with Early-Exit Checks
*Source: Codeforces Assiut Sheet #3: Problem J (Lucky Array)*

An array is defined as "lucky" if the frequency of its minimum element is an **odd number**. Given an array of $N$ integers, determine whether it is lucky or not.

In massive data streaming pipelines, scanning millions of numbers is made cancellable by cooperatively polling tokens between batches.

### Algorithmic Strategy:
1. **Find Minimum**: Find the minimum value in array $A$ in $O(N)$ time.
2. **Count Frequency**: Count how many times this minimum appears in $O(N)$ time.
3. **Parity Check**: If $\\text{count} \\% 2 \\ne 0$, output \`Lucky\`; otherwise output \`Unlucky\`.
4. **Complexity**:
   - **Time Complexity**: $O(N)$ with two linear passes.
   - **Space Complexity**: $O(N)$ for array elements.

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

        // Pass 1: Find minimum value
        int minVal = numbers[0];
        for (int i = 1; i < n; i++)
        {
            if (numbers[i] < minVal)
            {
                minVal = numbers[i];
            }
        }

        // Pass 2: Count occurrences of minimum value
        int minCount = 0;
        for (int i = 0; i < n; i++)
        {
            if (numbers[i] == minVal)
            {
                minCount++;
            }
        }

        if (minCount % 2 != 0)
        {
            await writer.WriteLineAsync("Lucky");
        }
        else
        {
            await writer.WriteLineAsync("Unlucky");
        }
    }
}
\`\`\`

---

## 6. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Lucky Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/J) | Easy | Frequency Counting, Parity, Early Exit |
| ⚪ | Codeforces | [Assiut Sheet #3: Count Subarrays](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Q) | Medium | Subarrays, Monotonicity, Polling |
| ⚪ | Exercism C# | [Scrabble Score](https://exercism.org/tracks/csharp/exercises/scrabble-score) | Easy | Character Scoring, Lookup Pipeline |
| ⚪ | Exercism C# | [Sieve](https://exercism.org/tracks/csharp/exercises/sieve) | Medium | Prime Sieve, Cooperative Loops |
`,

  contentBn: `# C# এ ক্যান্সেলেশন টোকেন (CancellationToken)

.NET রানটাইমে কোনো কাজ বাতিল করার পদ্ধতি সম্পূর্ণ **কো-অপারেটিভ (Cooperative)** বা পারস্পরিক সহযোগিতামূলক। রানটাইম **কখনোই কোনো থ্রেডকে জোরপূর্বক বন্ধ করে না**। জোর করে থ্রেড বন্ধ করা (\`Thread.Abort\`) আধুনিক .NET এ নিষিদ্ধ, কারণ এর ফলে মেমোরি নষ্ট হওয়া, লক আটকে যাওয়া এবং ফাইলের হ্যান্ডেল লিক হওয়ার মারাত্মক ঝুঁকি তৈরি হয়।

এর বদলে কলার এবং ওয়ার্কার উভয় পক্ষ **\`CancellationTokenSource\`** এবং **\`CancellationToken\`** ব্যবহারের মাধ্যমে নিরাপদে কাজ বাতিল সম্পন্ন করে।

---

## ১. কো-অপারেটিভ ক্যান্সেলেশন আর্কিটেকচার

\`\`\`
[কলার মেথড]
CancellationTokenSource (CTS) তৈরি করে
                     │
         cts.Token   │ (প্যারামিটার হিসেবে পাঠানো হয়)
                     ▼
             [ওয়ার্কার টাস্ক]
             নির্দিষ্ট সময় পর পর চেক করে: token.ThrowIfCancellationRequested()
                     │
ব্যবহারকারী Cancel চাপল│
     ──► cts.Cancel()│
                     ▼
             টোকেনের মান হয় 'IsCancellationRequested = true'
                     ▼
             ওয়ার্কার ThrowIfCancellationRequested() এক্সিকিউট করে
                     ▼
             OperationCanceledException নিক্ষেপ করে
                     ▼
             টাস্কের স্ট্যাটাস হয় TaskStatus.Canceled (নিরাপদ সমাপ্তি!)
\`\`\`

### প্রধান দুটি অবজেক্ট:
১. **\`CancellationTokenSource\` (CTS)**: প্রেরক। কেবল এর মালিকই বাতিল করার সিগন্যাল দিতে পারে (\`cts.Cancel()\` বা \`cts.CancelAfter(TimeSpan)\` এর মাধ্যমে)।
২. **\`CancellationToken\`**: গ্রাহক। এটি একটি অত্যন্ত হালকা \`struct\` যা প্যারামিটার হিসেবে ওয়ার্কার মেথডে পাঠানো হয়। এর মাধ্যমে কেবল বাতিল রিকোয়েস্ট এসেছে কিনা তা পড়া যায়, কিন্তু টোকেন থেকে নিজে বাতিল করা যায় না।

---

## ২. পোলিং, থ্রোয়িং এবং কলব্যাক রেজিস্ট্রি

### ১. প্রোপার্টির মাধ্যমে পোলিং:
যেসব লুপে দ্রুত কাজ করতে হয় এবং প্রতিবার এক্সেপশন থ্রো করা অনুচিত:
\`\`\`csharp
while (hasWork)
{
    if (token.IsCancellationRequested)
    {
        // প্রয়োজনীয় মেমোরি বা ফাইল ক্লোজ করে বের হয়ে যান
        break;
    }
    ProcessNextChunk();
}
\`\`\`

### ২. \`ThrowIfCancellationRequested()\` এর মাধ্যমে আদর্শ প্রস্থান:
সি# এর সবচেয়ে আদর্শ ও প্রচলিত পদ্ধতি, যা বাতিল হলে সাথে সাথে \`OperationCanceledException\` থ্রো করে টাস্কটিকে Canceled স্টেটে নিয়ে যায়:
\`\`\`csharp
public async Task ProcessDataBatchAsync(List<Item> items, CancellationToken ct)
{
    foreach (var item in items)
    {
        ct.ThrowIfCancellationRequested(); // ক্যান্সেলেশন রিকোয়েস্ট থাকলে এরর থ্রো করবে
        await ProcessItemAsync(item, ct);
    }
}
\`\`\`

### ৩. লিগ্যাসি এপিআইয়ের জন্য কলব্যাক রেজিস্ট্রি:
\`\`\`csharp
using (token.Register(() => socket.Close()))
{
    // টোকেন বাতিল হওয়া মাত্রই সকেট বন্ধ হয়ে ব্লকিং রিড ভেঙে যাবে
    await socket.ReadAsync(buffer);
}
\`\`\`

---

## ৩. লিংকড ক্যান্সেলেশন টোকেন (Linked Tokens)

প্রোডাকশন সিস্টেমে প্রায়ই একাধিক কারণে কাজ বাতিল হতে পারে:
১. **ব্যবহারকারী ব্রাউজার বন্ধ করেছে**।
২. **সার্ভার টাইমআউট** (যেমন ৫ সেকেন্ড) অতিক্রান্ত হয়েছে।

\`CreateLinkedTokenSource\` ব্যবহার করে দুটি শর্তকে একটি টোকেনে যুক্ত করা যায়:

\`\`\`csharp
public async Task<Order> FetchOrderSafeAsync(int orderId, CancellationToken requestToken)
{
    using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
    using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(requestToken, timeoutCts.Token);

    try
    {
        return await _db.Orders.FindAsync(new object[] { orderId }, linkedCts.Token);
    }
    catch (OperationCanceledException) when (timeoutCts.IsCancellationRequested)
    {
        throw new TimeoutException("৫ সেকেন্ডের মধ্যে ডাটাবেস উত্তর দেয়নি।");
    }
}
\`\`\`

---

## ৪. ASP.NET Core ওয়েব এপিআইতে টোকেন পাস করা

ASP.NET Core এ কন্ট্রোলার অ্যাকশনে সরাসরি \`CancellationToken\` ইনজেক্ট করা যায়:

\`\`\`csharp
[HttpGet("report/{id}")]
public async Task<IActionResult> GenerateReport(string id, CancellationToken ct)
{
    // ব্যবহারকারী ব্রাউজার ট্যাব বন্ধ করলে এই টোকেন স্বয়ংক্রিয়ভাবে বাতিল হয়ে যায়!
    byte[] reportPdf = await _reportService.BuildAsync(id, ct);
    return File(reportPdf, "application/pdf");
}
\`\`\`

> [!IMPORTANT]
> অ্যাকশন মেথডে পাওয়া টোকেনটি ডাটাবেস ও HTTP কলে পাস না করলে ব্যবহারকারী ব্রাউজার বন্ধ করে দিলেও ক্লাউড সার্ভার অপ্রয়োজনীয় ভারী কাজ চালিয়ে যাবে, যা বিশাল ক্লাউড বিল বাড়ায়।

---

## ৫. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: লাকি অ্যারে ও ক্যান্সেলেবল অনুসন্ধান
*সোর্স: কোডফোর্সেস আসিউট শিট #৩: প্রবলেম J (Lucky Array)*

একটি অ্যারে "লাকি" হবে যদি তার সর্বনিম্ন উপাদানের উপস্থিতির সংখ্যা একটি **বিজোড় সংখ্যা (Odd number)** হয়। প্রদত্ত $N$ আকারের অ্যারেটি লাকি কিনা নির্ধারণ করতে হবে।

### সমাধান কৌশল:
১. **সর্বনিম্ন মান নির্ণয়**: অ্যারেতে একবার লুপ চালিয়ে সর্বনিম্ন উপাদান বের করা।
২. **ফ্রিকোয়েন্সি গণনা**: দ্বিতীয়বার লুপ চালিয়ে সর্বনিম্ন মানটি কতবার এসেছে তা গোনা।
৩. **জোড়-বিজোড় যাচাই**: ফ্রিকোয়েন্সি বিজোড় হলে \`Lucky\`, অন্যথায় \`Unlucky\` প্রিন্ট করা।
৪. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O(N)$।
   - **স্পেস কমপ্লেক্সিটি**: $O(N)$।

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

        // সর্বনিম্ন উপাদান খোঁজা
        int minVal = numbers[0];
        for (int i = 1; i < n; i++)
        {
            if (numbers[i] < minVal)
            {
                minVal = numbers[i];
            }
        }

        // ফ্রিকোয়েন্সি গণনা
        int minCount = 0;
        for (int i = 0; i < n; i++)
        {
            if (numbers[i] == minVal)
            {
                minCount++;
            }
        }

        if (minCount % 2 != 0)
        {
            await writer.WriteLineAsync("Lucky");
        }
        else
        {
            await writer.WriteLineAsync("Unlucky");
        }
    }
}
\`\`\`

---

## ৬. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Lucky Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/J) | Easy | Frequency Counting, Parity, Early Exit |
| ⚪ | Codeforces | [Assiut Sheet #3: Count Subarrays](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Q) | Medium | Subarrays, Monotonicity, Polling |
| ⚪ | Exercism C# | [Scrabble Score](https://exercism.org/tracks/csharp/exercises/scrabble-score) | Easy | Character Scoring, Lookup Pipeline |
| ⚪ | Exercism C# | [Sieve](https://exercism.org/tracks/csharp/exercises/sieve) | Medium | Prime Sieve, Cooperative Loops |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Lucky Array",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/J",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Array", "Frequency", "Parity"],
      solutionEn:
        "Find the minimum element and count its frequency; check if the frequency count is odd in O(N) time.",
      solutionBn:
        "অ্যারের সর্বনিম্ন মান খুঁজে তার ফ্রিকোয়েন্সি গণনা করুন এবং তা বিজোড় সংখ্যা কিনা O(N) সময়ে যাচাই করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Count Subarrays",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Q",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["Array", "Subarrays", "Monotonic"],
      solutionEn:
        "Count all contiguous non-decreasing subarrays in quadratic or linear time.",
      solutionBn:
        "ধারাবাহিক নন-ডিক্রিজিং সাবঅ্যারের সংখ্যা নির্ণয় করুন।",
    },
    {
      source: "Exercism C#",
      name: "Scrabble Score",
      url: "https://exercism.org/tracks/csharp/exercises/scrabble-score",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["String", "Lookup", "Scrabble"],
      solutionEn:
        "Compute Scrabble word score by mapping character values via switch expression.",
      solutionBn:
        "সুইচ এক্সপ্রেশন ব্যবহারের মাধ্যমে প্রতিটি অক্ষরের স্ক্র্যাবল স্কোর হিসাব করুন।",
    },
    {
      source: "Exercism C#",
      name: "Sieve",
      url: "https://exercism.org/tracks/csharp/exercises/sieve",
      difficulty: "MEDIUM",
      company: "Optimizely",
      tags: ["Primes", "Sieve", "Algorithms"],
      solutionEn:
        "Generate all prime numbers up to a given limit using the Sieve of Eratosthenes with cooperative loop cancellation.",
      solutionBn:
        "সিভ অব এরাটোস্থেনিস অ্যালগরিদম দিয়ে নির্দিষ্ট সীমা পর্যন্ত মৌলিক সংখ্যাগুলো বের করুন।",
    },
  ],
};
