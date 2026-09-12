import type { LocalLesson } from "@/lib/lessons-data";

export const asyncSyncVsAsyncLesson: LocalLesson = {
  slug: "async-sync-vs-async",
  titleEn: "Sync vs Async Execution",
  titleBn: "সিনক্রোনাস বনাম অ্যাসিনক্রোনাস এক্সিকিউশন",
  categoryEn: "17. Async Programming",
  categoryBn: "১৭. অ্যাসিনক্রোনাস প্রোগ্রামিং (async / await)",
  categoryDescEn:
    "Modern asynchronous architecture: Task and ValueTask, async/await state machines, Task.WhenAll/WhenAny, cooperative cancellation, and concurrency vs parallelism.",
  categoryDescBn:
    "আধুনিক অ্যাসিনক্রোনাস আর্কিটেকচার: Task ও ValueTask, async/await স্টেট মেশিন, WhenAll/WhenAny, কো-অপারেটিভ ক্যান্সেলেশন এবং কনকারেন্সি বনাম প্যারালালিজম।",
  categoryPriority: "CORE",
  descriptionEn:
    "Thread blocking vs non-blocking I/O, OS completion ports, thread pool starvation prevention, and scalability in ASP.NET Core.",
  descriptionBn:
    "থ্রেড ব্লকিং বনাম নন-ব্লকিং I/O, থ্রেডপুল স্টারভেশন প্রতিরোধ এবং ওয়েব অ্যাপ্লিকেশনের স্কেলেবিলিটি।",
  difficulty: "EASY",
  displayOrder: 1,
  prerequisites: ["delegates-basic"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Sync vs Async Execution in C#

In high-throughput enterprise systems and cloud services, the distinction between **synchronous (blocking)** and **asynchronous (non-blocking)** execution is the single most critical factor determining server scalability, resource efficiency, and responsiveness.

---

## 1. Thread Blocking vs. Non-Blocking I/O

When a program performs an I/O operation (reading from a database, querying a REST API, or accessing disk storage), the hardware device takes milliseconds to respond. The central question is: **what does your CPU thread do while waiting?**

\`\`\`
[Synchronous I/O]
Thread #1: ───[Execute]───►[BLOCKED / SLEEPING (1MB Stack Reserved)]───►[Resume]
                           (Zero CPU work, but thread cannot be reused!)

[Asynchronous I/O]
Thread #1: ───[Initiate I/O]───► Returns to ThreadPool immediately!
                                 (Free to handle 100 other requests)
                                       │
                              [OS Kernel & Hardware]
                                       │
                              (Packet Arrives via IOCP)
                                       │
Thread #2: ────────────────────► [Picks Up Continuation & Resumes]
\`\`\`

### Synchronous I/O (Thread Blocking):
- When a thread invokes a blocking method (e.g., \`FileStream.Read\` or \`HttpClient.Send\`), the operating system transitions the thread into a **Wait/Blocked** state.
- Even though the thread consumes 0% CPU while sleeping, it retains its allocated memory—specifically **1 MB of reserved virtual stack space** per thread in 64-bit Windows/Linux environments.
- Under heavy traffic, hundreds of threads sit blocked, consuming hundreds of megabytes of memory and exhausting the runtime thread pool.

### Asynchronous I/O (Non-Blocking via Completion Ports):
- In asynchronous I/O with \`async\`/\`await\`, initiating an operation tells the operating system kernel to register an **I/O Completion Port (IOCP)** on Windows (or \`epoll\` on Linux, \`kqueue\` on macOS).
- The executing thread is **immediately returned to the .NET ThreadPool**, free to service other incoming HTTP requests.
- When the remote server sends response packets across the network card, a hardware interrupt fires. The OS kernel signals the completion port, and the .NET runtime enqueues the continuation onto an available ThreadPool thread. **No thread ever slept or wasted resources.**

---

## 2. Architectural Comparison Matrix

| Dimension | Synchronous Execution | Asynchronous Execution (\`async\` / \`await\`) |
| :--- | :--- | :--- |
| **Thread State** | **Blocked / Waiting**: Thread is tied up doing nothing. | **Released**: Thread returns to pool during I/O wait. |
| **Stack Memory Cost** | **High**: Each blocked thread occupies ~1 MB of stack. | **Minimal**: Continuations stored as small objects on heap. |
| **ThreadPool Impact** | Causes **ThreadPool Starvation** under high load. | Maximizes **ThreadPool Reusability** and throughput. |
| **Server Capacity** | Tops out at hundreds of concurrent requests. | Easily handles **tens of thousands** of concurrent connections. |
| **CPU Efficiency** | Low: Wasted on context switches and thread creation. | High: Threads only execute when real computation exists. |
| **Best For** | Pure in-memory algorithms, quick calculations. | Network I/O, database queries, disk operations. |

---

## 3. The ThreadPool Starvation Crisis

In ASP.NET Core, incoming web requests are assigned worker threads from the .NET \`ThreadPool\`. By default, the pool starts with a modest baseline of threads (matching CPU core count).

If requests execute blocking code (e.g., synchronous database queries taking 200ms):
1. **Thread Saturation**: All 16 initial threads become blocked waiting on database responses.
2. **Request Queueing**: New incoming requests are placed in an unhandled backlog queue.
3. **Throttled Injection**: The ThreadPool's hill-climbing algorithm creates new threads slowly—only **1 to 2 threads every 500 milliseconds**—to avoid thrashing the CPU with context switches.
4. **Catastrophic Outage**: High request volume causes client timeouts, HTTP 503 errors, and skyrocketing latency, even though overall CPU utilization sits below 5%!

By converting endpoints to non-blocking \`async\`/\`await\`, 16 threads can easily service **thousands** of concurrent requests simultaneously.

---

## 4. The Dangerous \`.Result\` / \`.Wait()\` Trap

A common anti-pattern is calling \`.Result\` or \`.Wait()\` on an asynchronous task:

\`\`\`csharp
// ANTI-PATTERN: Sync-over-async blocking
public string FetchData()
{
    // FATAL: Blocks the caller thread until the async task completes!
    return client.GetStringAsync("https://api.example.com").Result;
}
\`\`\`

### Why Sync-Over-Async is Dangerous:
1. **Deadlock in UI/WPF/ASP.NET (Classic)**: In environments with a single-threaded \`SynchronizationContext\`, the continuation attempts to marshal back to the captured context thread. However, that thread is already blocked waiting on \`.Result\`. Neither can proceed, creating a **permanent deadlock**.
2. **ThreadPool Thread Hijacking**: It combines the memory overhead of asynchronous state machines with the thread-blocking penalty of synchronous code.
3. **Aggregated Exceptions**: Any thrown error is wrapped inside an \`AggregateException\`, obfuscating the stack trace.

---

## 5. Comprehensive Syntax & Implementation Patterns

\`\`\`csharp
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

public class SyncVsAsyncPlaybook
{
    // 1. Pure Synchronous Method (Blocks caller thread during file read)
    public static string ReadFileSync(string filePath)
    {
        return File.ReadAllText(filePath);
    }

    // 2. Pure Asynchronous Method (Releases thread to pool during I/O)
    public static async Task<string> ReadFileAsync(string filePath)
    {
        return await File.ReadAllTextAsync(filePath);
    }

    // 3. Asynchronous HTTP Query with CancellationToken
    public static async Task<int> FetchPayloadSizeAsync(string url)
    {
        using var client = new HttpClient();
        // The thread returns to the pool while bytes traverse the network
        byte[] payload = await client.GetByteArrayAsync(url);
        return payload.Length;
    }
}
\`\`\`

---

## 6. Practical Problem Walkthrough

### Problem: High-Throughput Stream Summation
*Source: Codeforces Assiut Sheet #3: Problem A (Summation)*

Given an array $A$ of $N$ integers, compute the absolute value of the total sum of all elements. In high-throughput streaming systems, reading large arrays synchronously can block threads. We demonstrate processing numeric streams asynchronously without blocking the execution thread.

### Algorithmic Strategy:
1. **Accumulation**: Sum all numbers using a 64-bit integer (\`long\`) to prevent arithmetic overflow (since $N \\le 10^5$ and values can be up to $10^9$).
2. **Absolute Value**: Compute $\\text{Math.Abs}(\\text{sum})$.
3. **Complexity**:
   - **Time Complexity**: $O(N)$ single-pass summation.
   - **Space Complexity**: $O(1)$ auxiliary memory (streaming accumulation without retaining the entire array).

### C# Solution:

\`\`\`csharp
using System;
using System.IO;
using System.Threading.Tasks;

public class Program
{
    public static async Task Main()
    {
        // Asynchronous non-blocking standard input stream
        using var reader = new StreamReader(Console.OpenStandardInput());
        using var writer = new StreamWriter(Console.OpenStandardOutput());

        string? nLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(nLine)) return;

        int n = int.Parse(nLine.Trim());

        string? numbersLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(numbersLine)) return;

        string[] tokens = numbersLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        long totalSum = 0;

        for (int i = 0; i < n; i++)
        {
            totalSum += long.Parse(tokens[i]);
        }

        long absoluteSum = Math.Abs(totalSum);
        await writer.WriteLineAsync(absoluteSum.ToString());
    }
}
\`\`\`

---

## 7. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Weather Station](https://exercism.org/tracks/csharp/exercises/weather-station) | Easy | Async I/O, Non-blocking telemetry |
| ⚪ | Codeforces | [Assiut Sheet #3: Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/A) | Easy | Linear Streaming, Overflow prevention |
| ⚪ | Exercism C# | [Gigasecond](https://exercism.org/tracks/csharp/exercises/gigasecond) | Easy | DateTime, Immutability, Pipeline |
| ⚪ | Exercism C# | [Leap](https://exercism.org/tracks/csharp/exercises/leap) | Easy | Pure Functions, Branching |
`,

  contentBn: `# C# এ সিনক্রোনাস বনাম অ্যাসিনক্রোনাস এক্সিকিউশন

উচ্চ-গতির এন্টারপ্রাইজ সিস্টেম ও ক্লাউড সার্ভার তৈরিতে **সিনক্রোনাস (ব্লকিং)** এবং **অ্যাসিনক্রোনাস (নন-ব্লকিং)** এক্সিকিউশনের পার্থক্য জানা সবচেয়ে গুরুত্বপূর্ণ বিষয়। এটি নির্ধারণ করে একটি সার্ভার হাজার হাজার রিকোয়েস্ট সফলভাবে সামলাতে পারবে নাকি মেমোরি ফুরিয়ে ক্র্যাশ করবে।

---

## ১. থ্রেড ব্লকিং বনাম নন-ব্লকিং I/O

যখন কোনো প্রোগ্রাম কোনো I/O অপারেশন শুরু করে (যেমন ডাটাবেস কোয়েরি, রিমোট এপিআই কল বা হার্ডডিস্ক ফাইল রিড), তখন হার্ডওয়্যার থেকে রেসপন্স আসতে কয়েক মিলি-সেকেন্ড সময় লাগে। মূল প্রশ্ন হলো: **এই অপেক্ষার সময়ে আমাদের প্রসেসরের থ্রেডটি কী করে?**

\`\`\`
[সিনক্রোনাস I/O]
থ্রেড #১: ───[কাজ শুরু]───►[ব্লকড / ঘুমন্ত অবস্থা (১ মেগাবাইট মেমোরি দখল)]───►[শেষ]
                           (শূন্য সিপিইউ কাজ, কিন্তু থ্রেড অন্য কোথাও ব্যবহৃত হতে পারে না)

[অ্যাসিনক্রোনাস I/O]
থ্রেড #১: ───[I/O শুরু]───► সাথে সাথে থ্রেডপুলে ফেরত চলে যায়!
                            (অন্য ১০০টি রিকোয়েস্ট প্রসেস করতে মুক্ত)
                                       │
                              [ওএস কার্নেল ও নেটওয়ার্ক চিপ]
                                       │
                              (IOCP এর মাধ্যমে প্যাকেট পৌঁছায়)
                                       │
থ্রেড #২: ────────────────────► [পরবর্তী কাজ তুলে নিয়ে সম্পন্ন করে]
\`\`\`

### সিনক্রোনাস I/O (থ্রেড ব্লকিং):
- যখন কোনো থ্রেড ব্লকিং পদ্ধতিতে ডেটা রিড করে (যেমন \`FileStream.Read\` বা \`HttpClient.Send\`), তখন অপারেটিং সিস্টেম থ্রেডটিকে **Waiting বা Blocked** অবস্থায় নিয়ে যায়।
- অপেক্ষার সময় সিপিইউ ব্যবহার শূন্য হলেও প্রতিটি থ্রেড তার জন্য বরাদ্দকৃত **১ মেগাবাইট ভার্চুয়াল স্ট্যাক মেমোরি** আটকে রাখে।
- ক্লাউড সার্ভারে হাজার হাজার রিকোয়েস্ট আসলে শত শত থ্রেড ব্লকে আটকা পড়ে গিগাবাইট মেমোরি অপচয় করে এবং থ্রেডপুল সংকট সৃষ্টি করে।

### অ্যাসিনক্রোনাস I/O (নন-ব্লকিং IOCP):
- C# এর \`async\`/\`await\` ব্যবহারের সময় কোনো I/O শুরু হলে উইন্ডোজের **I/O Completion Port (IOCP)** অথবা লিনাক্সের \`epoll\` এ রিকোয়েস্ট রেজিস্টার করা হয়।
- রিকোয়েস্ট পাঠিয়ে দেওয়ার সাথে সাথেই মূল থ্রেডটি **.NET ThreadPool এ ফিরে যায়**, যাতে সে অন্য ব্যবহারকারীর রিকোয়েস্ট প্রসেস করতে পারে।
- ডেটা নেটওয়ার্ক কার্ডে পৌঁছালে হার্ডওয়্যার ইন্টারাপ্টের মাধ্যমে ওএস সিগন্যাল দেয় এবং থ্রেডপুলের যেকোনো ফাঁকা থ্রেড এসে বাকি কাজ সম্পন্ন করে। ফলে কোনো থ্রেডকে এক মুহূর্তের জন্যও ঘুমিয়ে সময় নষ্ট করতে হয় না।

---

## ২. তুলনামূলক আর্কিটেকচারাল ছক

| মাত্রা | সিনক্রোনাস এক্সিকিউশন | অ্যাসিনক্রোনাস এক্সিকিউশন (\`async\` / \`await\`) |
| :--- | :--- | :--- |
| **থ্রেডের অবস্থা** | **ব্লকড / আটকে থাকা**: কাজের অপেক্ষায় থ্রেড অলস বসে থাকে। | **মুক্ত**: I/O চলাকালে থ্রেড থ্রেডপুলে ফেরত যায়। |
| **স্ট্যাক মেমোরি খরচ** | **অত্যধিক**: প্রতিটি ব্লকড থ্রেড ১ MB মেমোরি দখল করে রাখে। | **নগণ্য**: হিপে সামান্য সাইজের স্টেট মেশিন অবজেক্ট থাকে। |
| **থ্রেডপুলের প্রভাব** | চাপ বাড়লে **ThreadPool Starvation** ঘটে। | থ্রেডপুলের কার্যক্ষমতা ও রিসাইক্লিং সর্বোচ্চ থাকে। |
| **সার্ভার ক্যাপাসিটি** | কয়েক শত রিকোয়েস্টেই সার্ভার অচল হয়ে যায়। | অনায়াসেই **হাজার হাজার** রিকোয়েস্ট একসাথে সামলায়। |
| **সিপিইউ দক্ষতা** | কম: কনটেক্সট সুইচিংয়ে সময় অপচয় হয়। | বেশি: কেবল সত্যিকারের ক্যালকুলেশনের সময়েই সিপিইউ চলে। |
| **ব্যবহারের ক্ষেত্র** | ইন-মেমোরি হিসাব, সাধারণ লুপ অপারেশন। | নেটওয়ার্ক রিকোয়েস্ট, ডাটাবেস রিড/রাইট, ফাইল I/O। |

---

## ৩. থ্রেডপুল স্টারভেশন (ThreadPool Starvation) বিপর্যয়

ASP.NET Core অ্যাপ্লিকেশনে আগত রিকোয়েস্টগুলো প্রসেস করার জন্য .NET \`ThreadPool\` থেকে থ্রেড বরাদ্দ করা হয়। সাধারণত সিপিইউ কোর সংখ্যার সমান থ্রেড দিয়ে পুল শুরু হয়।

যদি রিকোয়েস্টগুলো সিনক্রোনাস ব্লকিং কোড চালায়:
১. **থ্রেড ঘাটতি**: ডাটাবেসের ২০০ মিলি-সেকেন্ড উত্তরের অপেক্ষায় প্রাথমিক সব থ্রেড ব্লক হয়ে যায়।
২. **কিউ জ্যাম**: নতুন রিকোয়েস্টগুলো কিউতে জমা হতে থাকে।
৩. **ধীর থ্রেড তৈরি**: সিপিইউ থ্র্যাশিং এড়াতে থ্রেডপুলের অ্যালগরিদম অত্যন্ত ধীরে—প্রতি ৫০০ মিলি-সেকেন্ডে মাত্র ১ থেকে ২টি করে নতুন থ্রেড তৈরি করে।
৪. **সার্ভার ক্র্যাশ**: সিপিইউ ব্যবহার ৫% থাকলেও রিকোয়েস্ট টাইমআউট হয়ে ব্যবহারকারী HTTP 503 এরর পায়।

কোডকে \`async\`/\`await\` এ রূপান্তর করলে মাত্র গুটিকয়েক থ্রেড দিয়ে অনায়াসে হাজার হাজার কনকারেন্ট রিকোয়েস্ট পরিচালনা করা সম্ভব।

---

## ৪. মারাত্মক \`.Result\` ও \`.Wait()\` ফাঁদ

অ্যাসিনক্রোনাস মেথডকে সিনক্রোনাসভাবে কল করার জন্য অনেকে \`.Result\` বা \`.Wait()\` ব্যবহার করেন, যা অত্যন্ত ক্ষতিকর:

\`\`\`csharp
// মারাত্মক ভুল: Sync-over-async blocking
public string FetchData()
{
    // থ্রেডকে জোরপূর্বক আটকে রাখা হয়!
    return client.GetStringAsync("https://api.example.com").Result;
}
\`\`\`

### এর ফলে কী সমস্যা হয়:
১. **ডেডলক (Deadlock)**: ডেস্কটপ বা ক্লাসিক সিস্টেমে একটি নির্দিষ্ট \`SynchronizationContext\` থাকে। মেথডটির বাকি অংশ মূল থ্রেডে ফিরতে চায়, কিন্তু মূল থ্রেডটি নিজেই \`.Result\` এর অপেক্ষায় ব্লক হয়ে থাকে। ফলে কেউ এগোতে পারে না এবং চিরস্থায়ী ডেডলক হয়।
২. **থ্রেডপুল অপচয়**: এটি স্টেট মেশিনের মেমোরি খরচ এবং থ্রেড ব্লকিংয়ের ক্ষতি দুটোই একসাথে ঘটায়।
৩. **জটিল এক্সেপশন**: মূল এক্সেপশনটি \`AggregateException\` এর ভেতর চাপা পড়ে যায়।

---

## ৫. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: উচ্চ-গতির নন-ব্লকিং অ্যারে সামেশন
*সোর্স: কোডফোর্সেস আসিউট শিট #৩: প্রবলেম A (Summation)*

প্রদত্ত $N$ আকারের একটি পূর্ণসংখ্যার অ্যারের সব উপাদানের যোগফলের পরম মান (Absolute value) নির্ণয় করতে হবে। স্ট্রিমিং আর্কিটেকচারে বড় ইনপুট পড়ার সময় থ্রেড যেন ব্লক না হয় সেজন্য অ্যাসিনক্রোনাস স্ট্রিম রিডার ব্যবহার অপরিহার্য।

### সমাধান কৌশল:
১. **যোগফল নির্ণয়**: ডেটার মান $10^9$ পর্যন্ত এবং $N \le 10^5$ হতে পারায় ওভারফ্লো এড়াতে 64-বিট ইনটিজার (\`long\`) ব্যবহার করা।
২. **পরম মান গ্রহণ**: নেতিবাচক মানকে ধনাত্মক করতে \`Math.Abs\` প্রয়োগ।
৩. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O(N)$ সিঙ্গেল পাস।
   - **স্পেস কমপ্লেক্সিটি**: $O(1)$ মেমোরি।

### সম্পূর্ণ সি# সলিউশন:

\`\`\`csharp
using System;
using System.IO;
using System.Threading.Tasks;

public class Program
{
    public static async Task Main()
    {
        // অ্যাসিনক্রোনাস নন-ব্লকিং স্ট্রিম রিডার
        using var reader = new StreamReader(Console.OpenStandardInput());
        using var writer = new StreamWriter(Console.OpenStandardOutput());

        string? nLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(nLine)) return;

        int n = int.Parse(nLine.Trim());

        string? numbersLine = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(numbersLine)) return;

        string[] tokens = numbersLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        long totalSum = 0;

        for (int i = 0; i < n; i++)
        {
            totalSum += long.Parse(tokens[i]);
        }

        long absoluteSum = Math.Abs(totalSum);
        await writer.WriteLineAsync(absoluteSum.ToString());
    }
}
\`\`\`

---

## ৬. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Weather Station](https://exercism.org/tracks/csharp/exercises/weather-station) | Easy | Async I/O, Non-blocking telemetry |
| ⚪ | Codeforces | [Assiut Sheet #3: Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/A) | Easy | Linear Streaming, Overflow prevention |
| ⚪ | Exercism C# | [Gigasecond](https://exercism.org/tracks/csharp/exercises/gigasecond) | Easy | DateTime, Immutability, Pipeline |
| ⚪ | Exercism C# | [Leap](https://exercism.org/tracks/csharp/exercises/leap) | Easy | Pure Functions, Branching |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Weather Station",
      url: "https://exercism.org/tracks/csharp/exercises/weather-station",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Async", "I/O", "Telemetry"],
      solutionEn:
        "Simulate non-blocking weather station sensor reading telemetry using asynchronous method flows.",
      solutionBn:
        "অ্যাসিনক্রোনাস মেথড ব্যবহারের মাধ্যমে ওয়েদার স্টেশনের সেন্সর ডেটা নন-ব্লকিং উপায়ে প্রসেস করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Summation",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/A",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Array", "Math", "Overflow"],
      solutionEn:
        "Sum array values using 64-bit integers and compute the absolute value in O(N) time with O(1) space.",
      solutionBn:
        "৬৪-বিট ইনটিজার দিয়ে অ্যারে যোগ করুন এবং O(1) স্পেসে পরম মান হিসাব করুন।",
    },
    {
      source: "Exercism C#",
      name: "Gigasecond",
      url: "https://exercism.org/tracks/csharp/exercises/gigasecond",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["DateTime", "Immutability"],
      solutionEn:
        "Calculate the exact moment after a gigasecond (10^9 seconds) has passed using immutable DateTime APIs.",
      solutionBn:
        "ইমিউটেবল DateTime এপিআই দিয়ে ১ গিগা-সেকেন্ড (১০^৯ সেকেন্ড) পরের সঠিক সময় হিসাব করুন।",
    },
    {
      source: "Exercism C#",
      name: "Leap",
      url: "https://exercism.org/tracks/csharp/exercises/leap",
      difficulty: "EASY",
      company: "Optimizely",
      tags: ["Conditionals", "Math"],
      solutionEn:
        "Evaluate Gregorian calendar leap year conditions using short-circuit logical expressions.",
      solutionBn:
        "শর্ট-সার্কিট লজিক্যাল এক্সপ্রেশন দিয়ে লিপ ইয়ার শর্ত যাচাই করুন।",
    },
  ],
};
