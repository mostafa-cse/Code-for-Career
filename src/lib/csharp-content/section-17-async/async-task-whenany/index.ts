import type { LocalLesson } from "@/lib/lessons-data";

export const asyncTaskWhenanyLesson: LocalLesson = {
  slug: "async-task-whenany",
  titleEn: "Task.WhenAny (First Responder)",
  titleBn: "টাস্ক হোয়েন-এনি (Task.WhenAny) ও টাইমআউট প্যাটার্ন",
  categoryEn: "17. Async Programming",
  categoryBn: "১৭. অ্যাসিনক্রোনাস প্রোগ্রামিং (async / await)",
  categoryDescEn:
    "Modern asynchronous architecture: Task and ValueTask, async/await state machines, Task.WhenAll/WhenAny, cooperative cancellation, and concurrency vs parallelism.",
  categoryDescBn:
    "আধুনিক অ্যাসিনক্রোনাস আর্কিটেকচার: Task ও ValueTask, async/await স্টেট মেশিন, WhenAll/WhenAny, কো-অপারেティブ ক্যান্সেলেশন এবং কনকারেন্সি বনাম প্যারালালিজম।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Awaiting the first task to finish, implementing network timeouts with Task.Delay, and redundant request racing.",
  descriptionBn:
    "প্রথম সমাপ্ত টাস্কের জন্য অপেক্ষা, Task.Delay দিয়ে টাইমআউট প্যাটার্ন ও রিডানড্যান্ট সার্ভার রেসিং।",
  difficulty: "MEDIUM",
  displayOrder: 5,
  prerequisites: ["async-task-whenall"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Task.WhenAny (First Responder) in C#

While \`Task.WhenAll\` waits for every task to finish, **\`Task.WhenAny\`** completes the instant **any single task** in the supplied collection finishes. It returns the task that crossed the finish line first, forming the backbone of timeouts, redundant request hedging, and stream interleaving.

---

## 1. The First-to-Respond (Request Hedging) Architecture

In high-reliability distributed systems, tail latency (P99) is dominated by occasional network jitter. By querying redundant replicas simultaneously and accepting whichever responds first, systems dramatically cut tail latency:

\`\`\`
       ┌───► [Query Primary Replica:  150ms (delayed)] ───┐
Start ─┼                                                  ├──► [Task.WhenAny Completes!]
       └───► [Query Secondary Replica: 25ms (fast!)]    ───┘    Winner = Secondary Task
                                                                (Cancel Primary immediately)
\`\`\`

### Redundant Server Racing Implementation:
\`\`\`csharp
public async Task<string> QueryFastestServerAsync(string query, CancellationToken ct)
{
    using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);

    Task<string> serverUS = FetchFromServerAsync("https://us.api.com", query, cts.Token);
    Task<string> serverEU = FetchFromServerAsync("https://eu.api.com", query, cts.Token);

    // Returns whichever server responds first
    Task<string> completedTask = await Task.WhenAny(serverUS, serverEU);

    // CANCEL the loser immediately to save server and network resources!
    cts.Cancel();

    return await completedTask; // Safe to unwrap
}
\`\`\`

---

## 2. Implementing Network Timeouts with \`Task.WhenAny\`

Before .NET 8 introduced \`WaitAsync(TimeSpan)\`, \`Task.WhenAny\` paired with \`Task.Delay\` was the universal idiom for implementing timeouts:

\`\`\`csharp
public static async Task<string> DownloadWithTimeoutAsync(string url, int timeoutMilliseconds)
{
    using var client = new HttpClient();
    using var timeoutCts = new CancellationTokenSource();

    Task<string> downloadTask = client.GetStringAsync(url);
    Task timeoutTask = Task.Delay(timeoutMilliseconds, timeoutCts.Token);

    Task finished = await Task.WhenAny(downloadTask, timeoutTask);

    if (finished == timeoutTask)
    {
        throw new TimeoutException($"The request to '{url}' exceeded {timeoutMilliseconds}ms.");
    }

    // Cancel the timer so the ThreadPool timer queue stays clean
    timeoutCts.Cancel();

    return await downloadTask;
}
\`\`\`

> [!TIP]
> In .NET 8 and later, prefer \`await task.WaitAsync(TimeSpan.FromSeconds(5))\` for single-task timeouts. However, \`Task.WhenAny\` remains irreplaceable when racing **two or more distinct worker tasks**.

---

## 3. The Orphaned Task & Resource Leak Pitfall

> [!WARNING]
> \`Task.WhenAny\` **does NOT cancel** losing tasks!
> If Task A finishes in 50ms, Task B will continue running silently in the background for minutes unless explicitly cancelled via a \`CancellationToken\`.

Always pair \`Task.WhenAny\` with a \`CancellationTokenSource\` to terminate losing operations the instant a winner emerges.

---

## 4. Processing Tasks in Completion Order (Interleaving)

If you have 100 images to download and want to process and display each image the moment it arrives (rather than waiting for all 100 via \`Task.WhenAll\`), use a \`WhenAny\` drain loop:

\`\`\`csharp
public async Task ProcessImagesAsTheyArriveAsync(List<string> urls)
{
    var pendingTasks = urls.Select(DownloadImageAsync).ToList();

    while (pendingTasks.Count > 0)
    {
        // Await the next fastest task to complete
        Task<Image> completedTask = await Task.WhenAny(pendingTasks);

        // Remove from pending list so we don't process it again
        pendingTasks.Remove(completedTask);

        Image image = await completedTask;
        RenderImageToUi(image);
    }
}
\`\`\`

---

## 5. Practical Problem Walkthrough

### Problem: Lowest Number & First Appearance Index
*Source: Codeforces Assiut Sheet #3: Problem E (Lowest Number)*

Given an array $A$ of $N$ numbers, find the minimum number in the array and its 1-based index position. If the minimum number occurs multiple times, print the index of its **first** occurrence.

In distributed microservices, searching across multiple partitioned database shards executes concurrently; finding the minimum value corresponds to racing workers to determine the global minimum.

### Algorithmic Strategy:
1. **Initial Minimum**: Assume $A[0]$ is the minimum at 1-based index $1$.
2. **Single Pass**: Iterate from index $1$ to $N - 1$.
3. **Strict Inequality**: Only update the minimum if $A[i] < \\text{currentMin}$ (guaranteeing the *first* occurrence is preserved).
4. **Complexity**:
   - **Time Complexity**: $O(N)$ single pass.
   - **Space Complexity**: $O(N)$ for storing input elements.

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

        // Single-pass search for lowest number and first position
        int lowestVal = numbers[0];
        int firstIndex = 1; // 1-based index

        for (int i = 1; i < n; i++)
        {
            if (numbers[i] < lowestVal)
            {
                lowestVal = numbers[i];
                firstIndex = i + 1;
            }
        }

        await writer.WriteLineAsync($"{lowestVal} {firstIndex}");
    }
}
\`\`\`

---

## 6. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | Linear Traversal, First Occurrence |
| ⚪ | Codeforces | [Assiut Sheet #3: Max Subarray](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/L) | Medium | Subarrays, Kadane/Brute-force |
| ⚪ | Exercism C# | [Run-Length Encoding](https://exercism.org/tracks/csharp/exercises/run-length-encoding) | Medium | String Compression, Streams |
| ⚪ | Exercism C# | [Matrix](https://exercism.org/tracks/csharp/exercises/matrix) | Medium | 2D Parsing, Row/Col Extraction |
`,

  contentBn: `# C# এ টাস্ক হোয়েন-এনি (Task.WhenAny) ও টাইমআউট প্যাটার্ন

\`Task.WhenAll\` যেখানে সবগুলো কাজ শেষ হওয়ার জন্য অপেক্ষা করে, সেখানে **\`Task.WhenAny\`** দেওয়া টাস্কগুলোর মধ্যে **যেকোনো একটি কাজ সবার আগে শেষ হওয়া মাত্রই** সম্পন্ন হয়। এটি নেটওয়ার্ক টাইমআউট তৈরি, দ্রুততম সার্ভার নির্বাচন (Request Hedging) এবং স্ট্রিমিং ইন্টারলিভিংয়ের অন্যতম প্রধান ভিত্তি।

---

## ১. দ্রুততম রেসপন্ডার নির্বাচন (Request Hedging) আর্কিটেকচার

বড় ডিস্ট্রিবিউটেড ক্লাউড সিস্টেমে নেটওয়ার্ক বিলম্বের কারণে কিছু রিকোয়েস্টে অযথা বেশি সময় লাগে। একই ডেটার জন্য একাধিক রেপ্লিকায় একসাথে রিকোয়েস্ট পাঠিয়ে যেটি সবার আগে উত্তর দেয় সেটি গ্রহণ করাকে Hedging বলে:

\`\`\`
       ┌───► [প্রাইমারি সার্ভার: ১৫০ms (দেরি হচ্ছে)] ───┐
শুরু ──┼                                              ├──► [Task.WhenAny সম্পন্ন হলো!]
       └───► [সেকেন্ডারি সার্ভার: ২৫ms (খুব দ্রুত!)] ───┘    বিজয়ী = সেকেন্ডারি সার্ভার
                                                             (প্রাইমারি রিকোয়েস্ট বাতিল করুন)
\`\`\`

### কোড বাস্তবায়ন:
\`\`\`csharp
public async Task<string> QueryFastestServerAsync(string query, CancellationToken ct)
{
    using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);

    Task<string> serverUS = FetchFromServerAsync("https://us.api.com", query, cts.Token);
    Task<string> serverEU = FetchFromServerAsync("https://eu.api.com", query, cts.Token);

    // যে সার্ভার আগে উত্তর দেবে সেটি রিটার্ন হবে
    Task<string> completedTask = await Task.WhenAny(serverUS, serverEU);

    // বিজয়ী পাওয়ার সাথে সাথে পরাজিত টাস্কটি বাতিল করুন!
    cts.Cancel();

    return await completedTask;
}
\`\`\`

---

## ২. \`Task.WhenAny\` দিয়ে টাইমআউট বাস্তবায়ন

.NET 8 এ \`WaitAsync(TimeSpan)\` আসার পূর্বে \`Task.WhenAny\` এবং \`Task.Delay\` ব্যবহার করে টাইমআউট তৈরি করাই ছিল সি# এর ক্লাসিক্যাল প্যাটার্ন:

\`\`\`csharp
public static async Task<string> DownloadWithTimeoutAsync(string url, int timeoutMilliseconds)
{
    using var client = new HttpClient();
    using var timeoutCts = new CancellationTokenSource();

    Task<string> downloadTask = client.GetStringAsync(url);
    Task timeoutTask = Task.Delay(timeoutMilliseconds, timeoutCts.Token);

    Task finished = await Task.WhenAny(downloadTask, timeoutTask);

    if (finished == timeoutTask)
    {
        throw new TimeoutException($"'{url}' থেকে রেসপন্স পেতে নির্ধারিত সময় পার হয়ে গেছে।");
    }

    // টাইমআউট টাইমার বাতিল করে থ্রেডপুল ফাঁকা রাখা
    timeoutCts.Cancel();

    return await downloadTask;
}
\`\`\`

---

## ৩. পরাজিত টাস্কের মেমোরি লিক ও রিসোর্স ক্ষতি

> [!WARNING]
> \`Task.WhenAny\` কিন্তু **পরাজিত টাস্কগুলোকে স্বয়ংক্রিয়ভাবে বাতিল করে না!**
> টাস্ক A যদি ৫০ মিলি-সেকেন্ডে শেষ হয়ে যায়, তবে টাস্ক B ব্যাকগ্রাউন্ডে নিজের মতো চলতেই থাকবে। তাই \`CancellationTokenSource\` ব্যবহার করে পরাজিতদের বন্ধ করে দেওয়া বাধ্যতামূলক।

---

## ৪. সমাপ্তির ক্রমানুসারে প্রসেসিং (Interleaving)

ধরা যাক আপনার কাছে ১০০টি ছবি ডাউনলোড করার টাস্ক আছে। আপনি চান সব ছবি ডাউনলোড হওয়া পর্যন্ত অপেক্ষা না করে যে ছবিটি যখনই পৌঁছাবে সাথে সাথে ডিসপ্লে করতে:

\`\`\`csharp
public async Task ProcessImagesAsTheyArriveAsync(List<string> urls)
{
    var pendingTasks = urls.Select(DownloadImageAsync).ToList();

    while (pendingTasks.Count > 0)
    {
        // যে কাজটি সবার আগে শেষ হবে সেটিকে তুলে নেওয়া
        Task<Image> completedTask = await Task.WhenAny(pendingTasks);

        // পেন্ডিং তালিকা থেকে মুছে ফেলা
        pendingTasks.Remove(completedTask);

        Image image = await completedTask;
        RenderImageToUi(image);
    }
}
\`\`\`

---

## ৫. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: সর্বনিম্ন সংখ্যা ও প্রথম ইন্ডেক্স নির্ণয়
*সোর্স: কোডফোর্সেস আসিউট শিট #৩: প্রবলেম E (Lowest Number)*

প্রদত্ত $N$ আকারের একটি অ্যারের সর্বনিম্ন উপাদান এবং তার ১-ভিত্তিক অবস্থান নির্ণয় করতে হবে। সর্বনিম্ন মান একাধিকবার থাকলে প্রথমটির ইন্ডেক্স প্রিন্ট করতে হবে।

### সমাধান কৌশল:
১. **প্রাথমিক মান নির্ধারণ**: প্রথম উপাদান $A[0]$ কে সর্বনিম্ন ধরে নেওয়া।
২. **লিনিয়ার স্ক্যান**: $1$ থেকে $N-1$ পর্যন্ত প্রতিটি উপাদানের সাথে তুলনা করা।
৩. **কঠোর অসমতা (<)**: শুধুমাত্র বর্তমান উপাদানটি ছোট হলেই মান আপডেট করা, যাতে প্রথম অবস্থানটি সংরক্ষিত থাকে।
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

        string? elementsLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(elementsLine)) return;

        string[] tokens = elementsLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        int lowestVal = numbers[0];
        int firstIndex = 1;

        for (int i = 1; i < n; i++)
        {
            if (numbers[i] < lowestVal)
            {
                lowestVal = numbers[i];
                firstIndex = i + 1;
            }
        }

        await writer.WriteLineAsync($"{lowestVal} {firstIndex}");
    }
}
\`\`\`

---

## ৬. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | Linear Traversal, First Occurrence |
| ⚪ | Codeforces | [Assiut Sheet #3: Max Subarray](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/L) | Medium | Subarrays, Kadane/Brute-force |
| ⚪ | Exercism C# | [Run-Length Encoding](https://exercism.org/tracks/csharp/exercises/run-length-encoding) | Medium | String Compression, Streams |
| ⚪ | Exercism C# | [Matrix](https://exercism.org/tracks/csharp/exercises/matrix) | Medium | 2D Parsing, Row/Col Extraction |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Lowest Number",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Array", "Min Element", "First Occurrence"],
      solutionEn:
        "Traverse the array once to find the minimum value and its earliest 1-based index position.",
      solutionBn:
        "একবার অ্যারে স্ক্যান করে সর্বনিম্ন মান ও তার সর্বপ্রথম ১-ভিত্তিক ইন্ডেক্স নির্ণয় করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Max Subarray",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/L",
      difficulty: "MEDIUM",
      company: "Therap Services",
      tags: ["Array", "Subarray", "Maximum"],
      solutionEn:
        "Determine the maximum element of every possible contiguous subarray in quadratic time.",
      solutionBn:
        "সম্ভাব্য প্রতিটি সাবঅ্যারের সর্বোচ্চ উপাদান হিসাব করে প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Run-Length Encoding",
      url: "https://exercism.org/tracks/csharp/exercises/run-length-encoding",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Strings", "Compression", "State"],
      solutionEn:
        "Implement run-length text encoding and decoding for consecutive repeating characters.",
      solutionBn:
        "ধারাবাহিক অক্ষরের সংখ্যাক্রমিক রান-লেংথ এনকোডিং ও ডিকোডিং বাস্তবায়ন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Matrix",
      url: "https://exercism.org/tracks/csharp/exercises/matrix",
      difficulty: "MEDIUM",
      company: "Optimizely",
      tags: ["Matrix", "Parsing", "Multi-dimensional"],
      solutionEn:
        "Parse whitespace and newline-delimited strings to extract matrix rows and columns.",
      solutionBn:
        "স্ট্রিং পার্স করে ম্যাট্রিক্সের সারি ও কলাম ভেক্টর আলাদাভাবে এক্সট্র্যাক্ট করুন।",
    },
  ],
};
