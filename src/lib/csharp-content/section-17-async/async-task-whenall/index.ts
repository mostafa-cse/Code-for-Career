import type { LocalLesson } from "@/lib/lessons-data";

export const asyncTaskWhenallLesson: LocalLesson = {
  slug: "async-task-whenall",
  titleEn: "Task.WhenAll (Parallel Tasks)",
  titleBn: "টাস্ক হোয়েন-অল (Task.WhenAll) ও সমান্তরাল অ্যাসিনক্রোনি",
  categoryEn: "17. Async Programming",
  categoryBn: "১৭. অ্যাসিনক্রোনাস প্রোগ্রামিং (async / await)",
  categoryDescEn:
    "Modern asynchronous architecture: Task and ValueTask, async/await state machines, Task.WhenAll/WhenAny, cooperative cancellation, and concurrency vs parallelism.",
  categoryDescBn:
    "আধুনিক অ্যাসিনক্রোনাস আর্কিটেকচার: Task ও ValueTask, async/await স্টেট মেশিন, WhenAll/WhenAny, কো-অপারেটিভ ক্যান্সেলেশন এবং কনকারেন্সি বনাম প্যারালালিজম।",
  categoryPriority: "CORE",
  descriptionEn:
    "Concurrent execution of independent async operations, aggregating results into arrays, and AggregateException handling.",
  descriptionBn:
    "একাধিক স্বাধীন কাজের সমান্তরাল এক্সিকিউশন, ফলাফল অ্যারেতে সংরক্ষণ এবং এক্সেপশন হ্যান্ডলিং।",
  difficulty: "EASY",
  displayOrder: 4,
  prerequisites: ["async-await"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Task.WhenAll (Parallel Async Tasks) in C#

In modern cloud systems, high performance relies on running multiple independent asynchronous operations concurrently. \`Task.WhenAll\` is the primary primitive for implementing the **Fan-Out / Fan-In concurrency pattern** in .NET.

---

## 1. The Fan-Out / Fan-In Architecture

When your application needs to fetch data from three independent microservices (e.g. User Profile, Order History, and Recommendations):

\`\`\`
[Sequential Execution (Slow)]
Start ──► [Fetch Profile: 300ms] ──► [Fetch Orders: 400ms] ──► [Fetch Recs: 200ms] ──► Done (900ms)

[Fan-Out / Fan-In with Task.WhenAll (Fast)]
        ┌───► [Fetch Profile: 300ms] ───┐
Start ──┼───► [Fetch Orders: 400ms]  ───┼──► Done (Total = max(300, 400, 200) = 400ms!)
        └───► [Fetch Recs: 200ms]    ───┘
               (All 3 run concurrently)
\`\`\`

### Sequential vs. Concurrent Code:
\`\`\`csharp
// SEQUENTIAL (Anti-Pattern for independent operations: Total = 900ms)
var profile = await GetProfileAsync(userId);
var orders  = await GetOrdersAsync(userId);
var recs    = await GetRecommendationsAsync(userId);

// CONCURRENT via Task.WhenAll: Total = 400ms
Task<Profile> profileTask = GetProfileAsync(userId);
Task<Orders>  ordersTask  = GetOrdersAsync(userId);
Task<Recs>    recsTask    = GetRecommendationsAsync(userId);

// Await collective completion
await Task.WhenAll(profileTask, ordersTask, recsTask);

Profile profileResult = profileTask.Result; // Safe: Task is guaranteed RanToCompletion
Orders  ordersResult  = ordersTask.Result;
Recs    recsResult    = recsTask.Result;
\`\`\`

---

## 2. The Exception Masking Trap of \`Task.WhenAll\`

A critical architectural nuance of \`Task.WhenAll\` lies in how it handles exceptions when **multiple concurrent tasks fail**:

\`\`\`csharp
Task task1 = Task.FromException(new InvalidOperationException("Error in Service 1"));
Task task2 = Task.FromException(new TimeoutException("Timeout in Service 2"));

try
{
    // TRAP: await rethrows ONLY the FIRST exception encountered!
    await Task.WhenAll(task1, task2);
}
catch (Exception ex)
{
    // ex is InvalidOperationException. The TimeoutException is completely MASKED!
    Console.WriteLine($"Caught: {ex.GetType().Name}"); 
}
\`\`\`

### The Solution: Inspecting the Aggregate Task Reference
To observe, log, and handle **every** failure from all faulted tasks, hold a reference to the aggregate task returned by \`Task.WhenAll\`:

\`\`\`csharp
Task allTasks = Task.WhenAll(task1, task2);
try
{
    await allTasks;
}
catch
{
    // allTasks.Exception contains the complete AggregateException
    AggregateException allErrors = allTasks.Exception!;
    foreach (Exception inner in allErrors.InnerExceptions)
    {
        Console.WriteLine($"Logged Fault: {inner.Message}");
    }
}
\`\`\`

---

## 3. Throttling Fan-Out with \`SemaphoreSlim\`

Uncontrolled fan-out is a major cause of production outages. Launching 10,000 concurrent HTTP requests simultaneously triggers:
1. **Socket Exhaustion**: The OS runs out of ephemeral TCP ports (\`SocketException\`).
2. **Database Connection Pool Depletion**: Exceeds max pool size, causing connection timeouts.
3. **Severe Latency Spikes**: Overwhelms downstream APIs.

### Production Pattern: Throttled Concurrency
\`\`\`csharp
public async Task ProcessBatchWithThrottleAsync(IEnumerable<string> urls, int maxConcurrency = 10)
{
    using var semaphore = new SemaphoreSlim(maxConcurrency);

    var tasks = urls.Select(async url =>
    {
        await semaphore.WaitAsync(); // Asynchronously wait for available slot
        try
        {
            await DownloadAndIndexAsync(url);
        }
        finally
        {
            semaphore.Release(); // Free slot for next waiting task
        }
    });

    await Task.WhenAll(tasks);
}
\`\`\`

---

## 4. Practical Problem Walkthrough

### Problem: Asynchronous Sequence Reversal
*Source: Codeforces Assiut Sheet #3: Problem F (Reversing)*

Given an array $A$ of $N$ integers, print the array in reverse order.

In distributed computing and data processing pipelines, arrays are divided into logical partitions and processed concurrently. Here we demonstrate reading, in-place reversing, and streaming the results using non-blocking asynchronous workflows.

### Algorithmic Strategy:
1. **Two-Pointer In-Place Reversal**: Maintain a \`left\` pointer at $0$ and a \`right\` pointer at $N - 1$.
2. **Swap**: Swap $A[\\text{left}]$ and $A[\\text{right}]$ while $\\text{left} < \\text{right}$.
3. **Complexity**:
   - **Time Complexity**: $O(N)$ with $\\lfloor N / 2 \\rfloor$ swaps.
   - **Space Complexity**: $O(N)$ for array storage.

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

        string? elementsLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(elementsLine)) return;

        string[] tokens = elementsLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        // Two-pointer in-place reversal
        int left = 0;
        int right = n - 1;
        while (left < right)
        {
            int temp = numbers[left];
            numbers[left] = numbers[right];
            numbers[right] = temp;
            left++;
            right--;
        }

        // Asynchronously stream reversed elements
        for (int i = 0; i < n; i++)
        {
            await writer.WriteAsync(numbers[i].ToString());
            if (i < n - 1) await writer.WriteAsync(" ");
        }
        await writer.WriteLineAsync();
    }
}
\`\`\`

---

## 5. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | In-place Reversal, Async Streams |
| ⚪ | Codeforces | [Assiut Sheet #3: Sorting](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H) | Easy | Sorting, Fan-out Processing |
| ⚪ | Exercism C# | [Parallel Letter Frequency](https://exercism.org/tracks/csharp/exercises/parallel-letter-frequency) | Medium | Task.WhenAll, Map-Reduce, Concurrency |
| ⚪ | Exercism C# | [Acronym](https://exercism.org/tracks/csharp/exercises/acronym) | Easy | String Transformation, Async Pipeline |
`,

  contentBn: `# C# এ টাস্ক হোয়েন-অল (Task.WhenAll) ও সমান্তরাল অ্যাসিনক্রোনি

আধুনিক ক্লাউড ও মাইক্রোসার্ভিস আর্কিটেকচারে উচ্চ গতি নিশ্চিত করতে একাধিক স্বাধীন কাজকে সমান্তরালভাবে (Concurrently) চালানো হয়। .NET এ **Fan-Out / Fan-In কনকারেন্সি প্যাটার্ন** বাস্তবায়নের জন্য \`Task.WhenAll\` হলো প্রধান মাধ্যম।

---

## ১. Fan-Out / Fan-In আর্কিটেকচার

ধরা যাক আপনার অ্যাপ্লিকেশনকে তিনটি ভিন্ন সার্ভিস (ইউজার প্রোফাইল, অর্ডার হিস্ট্রি এবং প্রোডাক্ট রিকমেন্ডেশন) থেকে ডেটা আনতে হবে:

\`\`\`
[ধারাবাহিক বা সিকোয়েনশিয়াল এক্সিকিউশন (ধীরগতি)]
শুরু ──► [প্রোফাইল: ৩০০ms] ──► [অর্ডার: ৪০০ms] ──► [রিকমেন্ডেশন: ২০০ms] ──► শেষ (মোট ৯০০ms!)

[Task.WhenAll দিয়ে সমান্তরাল এক্সিকিউশন (দ্রুতগতি)]
        ┌───► [প্রোফাইল: ৩০০ms] ───┐
শুরু ───┼───► [অর্ডার: ৪০০ms]    ───┼──► শেষ (মোট = max(৩০০, ৪০০, ২০০) = ৪০০ms!)
        └───► [রিকমেন্ডেশন: ২০০ms] ───┘
               (একই সাথে ৩টি কাজ চলবে)
\`\`\`

### সিকোয়েনশিয়াল বনাম কনকারেন্ট কোড:
\`\`\`csharp
// ভুল নিয়ম: সিকোয়েনশিয়াল অপেক্ষা (মোট সময় = ৯০০ms)
var profile = await GetProfileAsync(userId);
var orders  = await GetOrdersAsync(userId);
var recs    = await GetRecommendationsAsync(userId);

// সঠিক নিয়ম: Task.WhenAll দিয়ে একসাথে শুরু (মোট সময় = ৪০০ms)
Task<Profile> profileTask = GetProfileAsync(userId);
Task<Orders>  ordersTask  = GetOrdersAsync(userId);
Task<Recs>    recsTask    = GetRecommendationsAsync(userId);

// সব কাজ শেষ হওয়া পর্যন্ত একত্রে অপেক্ষা
await Task.WhenAll(profileTask, ordersTask, recsTask);

// নিরাপদে ফলাফল সংগ্রহ
Profile profileResult = profileTask.Result; 
Orders  ordersResult  = ordersTask.Result;
Recs    recsResult    = recsTask.Result;
\`\`\`

---

## ২. \`Task.WhenAll\` এর এক্সেপশন লুকানোর ফাঁদ

\`Task.WhenAll\` ব্যবহারের সময় একটি মারাত্মক চ্যালেঞ্জ হলো যখন **একাধিক টাস্কে একসাথে এরর ঘটে**:

\`\`\`csharp
Task task1 = Task.FromException(new InvalidOperationException("সার্ভিস ১ এ ত্রুটি"));
Task task2 = Task.FromException(new TimeoutException("সার্ভিস ২ এ টাইমআউট"));

try
{
    // বিপদ: await করলে কেবল সর্বপ্রথম এক্সেপশনটি পাওয়া যায়!
    await Task.WhenAll(task1, task2);
}
catch (Exception ex)
{
    // ex হবে InvalidOperationException; কিন্তু TimeoutException সম্পূর্ণ হারিয়ে গেল!
    Console.WriteLine($"ধরা পড়েছে: {ex.GetType().Name}"); 
}
\`\`\`

### সমাধান: মূল টাস্ক রেফারেন্স পরীক্ষা করা
সবগুলো এক্সেপশন দেখতে হলে \`Task.WhenAll\` এর রিটার্ন করা টাস্ক রেফারেন্সটি আলাদা ভেরিয়েবলে রাখুন:

\`\`\`csharp
Task allTasks = Task.WhenAll(task1, task2);
try
{
    await allTasks;
}
catch
{
    // allTasks.Exception এ সমস্ত inner exception জমা থাকে
    AggregateException allErrors = allTasks.Exception!;
    foreach (Exception inner in allErrors.InnerExceptions)
    {
        Console.WriteLine($"লগ করা এরর: {inner.Message}");
    }
}
\`\`\`

---

## ৩. \`SemaphoreSlim\` দিয়ে থ্রোটলিং (Throttling)

নিয়ন্ত্রণহীনভাবে একসাথে ১০,০০০ টাস্ক চালু করলে প্রোডাকশন সার্ভারে বড় বিপর্যয় ঘটতে পারে:
১. **সকেট শেষ হয়ে যাওয়া (Socket Exhaustion)**: অপারেটিং সিস্টেমের TCP পোর্ট ফুরিয়ে যায়।
২. **ডাটাবেস কানেকশন পুল সংকট**: সর্বোচ্চ কানেকশন ছাড়িয়ে গিয়ে ডাটাবেস ক্র্যাশ করে।

### সেরা সমাধান: সীমিত কনকারেন্সি প্যাটার্ন
\`\`\`csharp
public async Task ProcessBatchWithThrottleAsync(IEnumerable<string> urls, int maxConcurrency = 10)
{
    using var semaphore = new SemaphoreSlim(maxConcurrency);

    var tasks = urls.Select(async url =>
    {
        await semaphore.WaitAsync(); // খালি স্লটের জন্য অপেক্ষা
        try
        {
            await DownloadAndIndexAsync(url);
        }
        finally
        {
            semaphore.Release(); // কাজ শেষ হলে স্লট মুক্ত করা
        }
    });

    await Task.WhenAll(tasks);
}
\`\`\`

---

## ৪. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: অ্যারে উল্টানো ও অ্যাসিনক্রোনাস স্ট্রিমিং
*সোর্স: কোডফোর্সেস আসিউট শিট #৩: প্রবলেম F (Reversing)*

প্রদত্ত $N$ আকারের একটি পূর্ণসংখ্যার অ্যারেকে উল্টো ক্রমানুসারে প্রিন্ট করতে হবে। সমান্তরাল প্রসেসিংয়ে ডেটা রিড ও ইন-প্লেস রিভার্সাল অত্যন্ত কার্যকর।

### সমাধান কৌশল:
১. **টু-পয়েন্টার টেকনিক**: শুরুর পয়েন্টার \`left\` এবং শেষের পয়েন্টার \`right\` নিয়ে তাদের মান অদলবদল করা।
২. **কমপ্লেক্সিটি**:
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

        string? elementsLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(elementsLine)) return;

        string[] tokens = elementsLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        int left = 0;
        int right = n - 1;
        while (left < right)
        {
            int temp = numbers[left];
            numbers[left] = numbers[right];
            numbers[right] = temp;
            left++;
            right--;
        }

        for (int i = 0; i < n; i++)
        {
            await writer.WriteAsync(numbers[i].ToString());
            if (i < n - 1) await writer.WriteAsync(" ");
        }
        await writer.WriteLineAsync();
    }
}
\`\`\`

---

## ৫. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | In-place Reversal, Async Streams |
| ⚪ | Codeforces | [Assiut Sheet #3: Sorting](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H) | Easy | Sorting, Fan-out Processing |
| ⚪ | Exercism C# | [Parallel Letter Frequency](https://exercism.org/tracks/csharp/exercises/parallel-letter-frequency) | Medium | Task.WhenAll, Map-Reduce, Concurrency |
| ⚪ | Exercism C# | [Acronym](https://exercism.org/tracks/csharp/exercises/acronym) | Easy | String Transformation, Async Pipeline |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Reversing",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Array", "Two Pointers", "In-place"],
      solutionEn:
        "Reverse an array in-place using two pointers converging from both boundaries in O(N) time.",
      solutionBn:
        "উভয় প্রান্ত থেকে টু-পয়েন্টার ব্যবহার করে O(N) সময়ে অ্যারে উপাদানগুলোকে ইন-প্লেস রিভার্স করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Sorting",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Array", "Sorting", "Algorithm"],
      solutionEn:
        "Sort an array in ascending order using standard sorting algorithms in O(N log N) time.",
      solutionBn:
        "অ্যারে উপাদানগুলোকে ছোট থেকে বড় ক্রমানুসারে O(N log N) সময়ে সাজান।",
    },
    {
      source: "Exercism C#",
      name: "Parallel Letter Frequency",
      url: "https://exercism.org/tracks/csharp/exercises/parallel-letter-frequency",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Task.WhenAll", "Concurrency", "MapReduce"],
      solutionEn:
        "Count letter frequencies across multiple texts concurrently using Task.WhenAll and aggregate dictionary results.",
      solutionBn:
        "Task.WhenAll দিয়ে সমান্তরালভাবে একাধিক লেখার অক্ষর ফ্রিকোয়েন্সি গণনা করে ডিকশনারিতে একত্র করুন।",
    },
    {
      source: "Exercism C#",
      name: "Acronym",
      url: "https://exercism.org/tracks/csharp/exercises/acronym",
      difficulty: "EASY",
      company: "Optimizely",
      tags: ["String", "Delimiters", "Parsing"],
      solutionEn:
        "Extract initial characters of phrase words to form uppercase acronyms.",
      solutionBn:
        "শব্দগুচ্ছের প্রতিটি শব্দের প্রথম অক্ষর নিয়ে বড় হাতের অ্যাক্রোনিম তৈরি করুন।",
    },
  ],
};
