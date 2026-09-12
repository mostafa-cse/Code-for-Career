import type { LocalLesson } from "@/lib/lessons-data";

export const asyncAwaitLesson: LocalLesson = {
  slug: "async-await",
  titleEn: "async & await State Machine",
  titleBn: "অ্যাসিঙ্ক ও অ্যাওয়েট (async/await) স্টেট মেশিন",
  categoryEn: "17. Async Programming",
  categoryBn: "১৭. অ্যাসিনক্রোনাস প্রোগ্রামিং (async / await)",
  categoryDescEn:
    "Modern asynchronous architecture: Task and ValueTask, async/await state machines, Task.WhenAll/WhenAny, cooperative cancellation, and concurrency vs parallelism.",
  categoryDescBn:
    "আধুনিক অ্যাসিনক্রোনাস আর্কিটেকচার: Task ও ValueTask, async/await স্টেট মেশিন, WhenAll/WhenAny, কো-অপারেটিভ ক্যান্সেলেশন এবং কনকারেন্সি বনাম প্যারালালিজম।",
  categoryPriority: "CORE",
  descriptionEn:
    "Compiler-generated IAsyncStateMachine, Continuation passing, SynchronizationContext, and avoiding async void.",
  descriptionBn:
    "কম্পাইলার দ্বারা তৈরি IAsyncStateMachine, কন্টিনিউয়েশন পাসিং, SynchronizationContext এবং async void এর মারাত্মক ঝুঁকি।",
  difficulty: "HARD",
  displayOrder: 3,
  prerequisites: ["async-task"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# async & await State Machine in C#

The \`async\` and \`await\` keywords in C# do **not** spawn background threads. Instead, the Roslyn C# compiler rewrites every \`async\` method into an **asynchronous state machine** implementing the \`IAsyncStateMachine\` interface.

---

## 1. What the Compiler Generates (Lowered Code)

When you write a straightforward async method:

\`\`\`csharp
public async Task<int> FetchDataLengthAsync(string url)
{
    using var client = new HttpClient();
    string content = await client.GetStringAsync(url);
    return content.Length;
}
\`\`\`

The Roslyn compiler generates an internal struct implementing \`IAsyncStateMachine\`:

\`\`\`csharp
// Compiler-Generated State Machine (Conceptual Representation)
[StructLayout(LayoutKind.Auto)]
private struct FetchDataLengthAsync_d__0 : IAsyncStateMachine
{
    public int __state; // -1: running, 0: suspended at await, -2: complete
    public AsyncTaskMethodBuilder<int> __builder;
    public string url;

    private HttpClient _client;
    private string _content;
    private TaskAwaiter<string> __u__1; // awaiter for GetStringAsync

    public void MoveNext()
    {
        int num = __state;
        int result;
        try
        {
            TaskAwaiter<string> awaiter;
            if (num != 0)
            {
                _client = new HttpClient();
                awaiter = _client.GetStringAsync(url).GetAwaiter();
                if (!awaiter.IsCompleted)
                {
                    __state = 0; // Suspend state machine
                    __u__1 = awaiter;
                    __builder.AwaitUnsafeOnCompleted(ref awaiter, ref this);
                    return; // Return control immediately to caller!
                }
            }
            else
            {
                awaiter = __u__1;
                __u__1 = default;
                __state = -1; // Resumed
            }

            _content = awaiter.GetResult(); // Retrieve result or throw exception
            result = _content.Length;
        }
        catch (Exception ex)
        {
            __state = -2;
            _client?.Dispose();
            __builder.SetException(ex); // Transition task to Faulted
            return;
        }

        __state = -2;
        _client?.Dispose();
        __builder.SetResult(result); // Transition task to RanToCompletion
    }

    public void SetStateMachine(IAsyncStateMachine stateMachine) { }
}
\`\`\`

---

## 2. The Mechanics of an \`await\` Point

When execution hits an \`await\` expression:
1. **Check Completion**: It checks \`awaiter.IsCompleted\`. If the operation finished synchronously (e.g. data is cached or buffered), execution continues straight through **without context switching or thread hops**.
2. **Suspension**: If the task is still running, the state machine captures all local variables into fields on the struct, records the resume state (\`__state = 0\`), and registers \`MoveNext\` as the continuation callback.
3. **Control Yield**: Control immediately returns up the call stack to the caller, returning an incomplete \`Task\` or \`ValueTask\`.
4. **Resumption**: When the I/O completion port or hardware signals completion, the runtime invokes \`MoveNext()\`. Execution jumps directly to the state jump table, retrieves the result via \`awaiter.GetResult()\`, and proceeds with subsequent lines.

---

## 3. \`SynchronizationContext\` & \`ConfigureAwait(false)\`

### Context Capture:
By default, \`await\` captures the ambient **\`SynchronizationContext\`** (or \`TaskScheduler\`) of the calling thread.
- **WPF / WinForms / MAUI**: The context is bound to the single dedicated UI thread. Continuations marshal back to the UI thread so you can safely update UI components.
- **ASP.NET Core**: **Has NO \`SynchronizationContext\`** (removed in .NET Core to eliminate locking overhead). Continuations always resume on an arbitrary ThreadPool worker thread!

### Why Library Authors Must Use \`ConfigureAwait(false)\`:
\`\`\`csharp
public async Task<byte[]> DownloadAssetAsync(string url)
{
    using var client = new HttpClient();
    // Do NOT capture SynchronizationContext; resume on ANY threadpool worker
    var response = await client.GetAsync(url).ConfigureAwait(false);
    return await response.Content.ReadAsByteArrayAsync().ConfigureAwait(false);
}
\`\`\`

1. **Deadlock Prevention**: If a legacy consumer calls \`.Result\` on your library method on a UI thread, capturing the context will deadlock because the UI thread is blocked waiting for \`.Result\` while the continuation is waiting for the UI thread.
2. **Performance Optimization**: Bypassing context capture avoids expensive message pumping and queuing overhead, yielding up to **20-30% higher throughput** in computational microbenchmarks.

---

## 4. The Catastrophic Hazard of \`async void\`

> [!CAUTION]
> **Never use \`async void\`** except in top-level UI event handlers!
>
> 1. **Cannot Be Awaited**: The caller has no \`Task\` handle to monitor when the operation completes.
> 2. **Process Crash on Exception**: Any unhandled exception thrown in an \`async void\` method cannot be caught by surrounding \`try-catch\` blocks. It posts directly to the ambient \`SynchronizationContext\` or crashes the entire OS process via \`AppDomain.UnhandledException\`!

\`\`\`csharp
// DANGEROUS: Any exception here crashes the entire process!
public async void ProcessBatchOrder(int orderId)
{
    await SubmitOrderAsync(orderId); // If this throws, process terminates!
}

// CORRECT: Wrap exceptions in Task
public async Task ProcessBatchOrderAsync(int orderId)
{
    await SubmitOrderAsync(orderId);
}
\`\`\`

---

## 5. Practical Problem Walkthrough

### Problem: Asynchronous Replacement Processing
*Source: Codeforces Assiut Sheet #3: Problem C (Replacement)*

Given an array of $N$ integers, replace every positive number with $1$, every negative number with $2$, and leave zeros unchanged. Print the modified array.

In modern microservices, batch transformations are processed via non-blocking asynchronous state machines, streaming input and output without blocking execution threads.

### Algorithmic Strategy:
1. **Conditional Mutation**:
   - If $A[i] > 0$, set $A[i] = 1$.
   - If $A[i] < 0$, set $A[i] = 2$.
   - If $A[i] == 0$, keep $A[i] = 0$.
2. **Complexity**:
   - **Time Complexity**: $O(N)$ single pass.
   - **Space Complexity**: $O(N)$ to store array elements.

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
            int val = int.Parse(tokens[i]);
            if (val > 0) numbers[i] = 1;
            else if (val < 0) numbers[i] = 2;
            else numbers[i] = 0;
        }

        // Asynchronously stream modified values to output
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

## 6. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Replacement](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C) | Easy | In-place Mutation, State Machine |
| ⚪ | Codeforces | [Assiut Sheet #3: Positions in array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/D) | Easy | Conditional Filtering, Async Stream |
| ⚪ | Exercism C# | [Resistor Color Duo](https://exercism.org/tracks/csharp/exercises/resistor-color-duo) | Easy | String Parsing, Value Conversion |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | In-place Reversal, Async Pipelines |
`,

  contentBn: `# C# এ অ্যাসিঙ্ক ও অ্যাওয়েট (async/await) স্টেট মেশিন

C# এ \`async\` এবং \`await\` কি-ওয়ার্ড কোনো নতুন ব্যাকগ্রাউন্ড থ্রেড তৈরি করে না। এর বদলে Roslyn C# কম্পাইলার প্রতিটি \`async\` মেথডকে গোপনে একটি **অ্যাসিনক্রোনাস স্টেট মেশিন (State Machine)** স্ট্রাক্টে রূপান্তরিত করে যা \`IAsyncStateMachine\` ইন্টারফেস বাস্তবায়ন করে।

---

## ১. কম্পাইলারের অভ্যন্তরীণ রূপান্তর (Lowered Code)

যখন আমরা একটি সাধারণ মেথড লিখি:

\`\`\`csharp
public async Task<int> FetchDataLengthAsync(string url)
{
    using var client = new HttpClient();
    string content = await client.GetStringAsync(url);
    return content.Length;
}
\`\`\`

কম্পাইলার পর্দার আড়ালে নিচের মতো একটি নিখুঁত স্ট্রাক্ট তৈরি করে:

\`\`\`csharp
// কম্পাইলার দ্বারা তৈরি স্টেট মেশিন (ধারণাগত রূপ)
[StructLayout(LayoutKind.Auto)]
private struct FetchDataLengthAsync_d__0 : IAsyncStateMachine
{
    public int __state; // -১: রানিং, ০: অ্যাওয়েটে স্থগিত, -২: সম্পন্ন
    public AsyncTaskMethodBuilder<int> __builder;
    public string url;

    private HttpClient _client;
    private string _content;
    private TaskAwaiter<string> __u__1;

    public void MoveNext()
    {
        int num = __state;
        int result;
        try
        {
            TaskAwaiter<string> awaiter;
            if (num != 0)
            {
                _client = new HttpClient();
                awaiter = _client.GetStringAsync(url).GetAwaiter();
                if (!awaiter.IsCompleted)
                {
                    __state = 0; // স্টেট মেশিনের কাজ সাময়িক স্থগিত করা
                    __u__1 = awaiter;
                    __builder.AwaitUnsafeOnCompleted(ref awaiter, ref this);
                    return; // সাথে সাথে কলার থ্রেডে কন্ট্রোল ফিরিয়ে দেওয়া!
                }
            }
            else
            {
                awaiter = __u__1;
                __u__1 = default;
                __state = -1; // পুনরায় সচল
            }

            _content = awaiter.GetResult(); // ফলাফল সংগ্রহ বা এরর নিক্ষেপ
            result = _content.Length;
        }
        catch (Exception ex)
        {
            __state = -2;
            _client?.Dispose();
            __builder.SetException(ex); // টাস্ককে Faulted হিসেবে চিহ্নিত করা
            return;
        }

        __state = -2;
        _client?.Dispose();
        __builder.SetResult(result); // টাস্ককে সফল হিসেবে সমাপ্ত করা
    }

    public void SetStateMachine(IAsyncStateMachine stateMachine) { }
}
\`\`\`

---

## ২. \`await\` পয়েন্টে আসলে কী ঘটে?

একটি মেথড যখন কোনো \`await\` পয়েন্টে পৌঁছায়:
১. **সমাপ্তি যাচাই**: \`awaiter.IsCompleted\` ট্রু কিনা দেখা হয়। যদি ডেটা মেমোরি বাফার বা ক্যাশে আগেই প্রস্তুত থাকে, তবে কোনো থ্রেড জাম্প ছাড়াই কোড **স্বাভাবিক গতিতে একটানা চলতে থাকে**।
২. **স্থগিতকরণ (Suspension)**: টাস্কটি অসম্পূর্ণ থাকলে মেথডের সব লোকাল ভেরিয়েবল স্টেট মেশিন স্ট্রাক্টের ফিল্ডে সেভ করা হয় এবং বর্তমান স্টেট \`__state = 0\` সেট করে \`MoveNext\` মেথডটিকে কলব্যাক হিসেবে যুক্ত করা হয়।
৩. **নিয়ন্ত্রণ ত্যাগ (Yield)**: কল স্ট্যাক দিয়ে সাথে সাথে কলারের কাছে ফিরে যাওয়া হয় এবং একটি অসম্পূর্ণ \`Task\` রিটার্ন করা হয়।
৪. **পুনরায় শুরু (Resumption)**: I/O কমপ্লিশন পোর্ট থেকে ডেটা পাওয়ার সাথে সাথে রানটাইম \`MoveNext()\` কল করে, যার ফলে কোড ঠিক যে লাইনটিতে অপেক্ষা করছিল সেখান থেকে বাকি অংশ এক্সিকিউট করে।

---

## ৩. \`SynchronizationContext\` ও \`ConfigureAwait(false)\`

### কনটেক্সট ক্যাপচার:
সাধারণ নিয়মে \`await\` কলিং থ্রেডের পরিবেশ বা **\`SynchronizationContext\`** ক্যাপচার করে রাখে।
- **WPF / WinForms / MAUI**: এদের একটি নির্দিষ্ট UI থ্রেড থাকে। \`await\` এর পর কোড যেন UI কম্পোনেন্ট অ্যাক্সেস করতে পারে সেজন্য স্বয়ংক্রিয়ভাবে মূল UI থ্রেডে ফিরে আসে।
- **ASP.NET Core**: আধুনিক ASP.NET Core এ **কোনো \`SynchronizationContext\` রাখা হয়নি**। পারফরম্যান্স বৃদ্ধির জন্য এখানে যেকোনো ফাঁকা থ্রেডপুল থ্রেড বাকি কোড রান করে।

### লাইব্রেরিতে কেন \`ConfigureAwait(false)\` আবশ্যক:
\`\`\`csharp
public async Task<byte[]> DownloadAssetAsync(string url)
{
    using var client = new HttpClient();
    // কলিং কনটেক্সটে ফেরার দরকার নেই; থ্রেডপুলের যেকোনো থ্রেডে কাজ শেষ করো
    var response = await client.GetAsync(url).ConfigureAwait(false);
    return await response.Content.ReadAsByteArrayAsync().ConfigureAwait(false);
}
\`\`\`

১. **ডেডলক প্রতিরোধ**: UI অ্যাপ্লিকেশন থেকে লাইব্রেরির মেথড কল করে কেউ \`.Result\` ব্লক করলে কনটেক্সট লক হয়ে পুরো অ্যাপ চিরতরে ডেডলকে আটকে যায়।
২. **উচ্চ গতি**: কনটেক্সট সুইচের অতিরিক্ত বার্তা আদান-প্রদান পরিহার করায় কোড **২০-৩০% পর্যন্ত দ্রুত** কাজ করে।

---

## ৪. \`async void\` এর মারাত্মক বিপদ

> [!CAUTION]
> UI ইভেন্ট হ্যান্ডলার ছাড়া সাধারণ কোনো মেথডে **কখনোই \`async void\` ব্যবহার করবেন না!**
>
> ১. **await করা যায় না**: কলার জানতে পারে না মেথডটি কখন শেষ হলো।
> ২. **প্রসেস ক্র্যাশ**: \`async void\` মেথডে কোনো এক্সেপশন ঘটলে তা বাইরের কোনো \`try-catch\` ধরতে পারে না এবং সরাসরি পুরো অ্যাপ্লিকেশনকে **ক্র্যাশ** করে দেয়!

\`\`\`csharp
// মারাত্মক ভুল: কোনো এরর ঘটলেই পুরো সার্ভার ক্র্যাশ করবে!
public async void ProcessBatchOrder(int orderId)
{
    await SubmitOrderAsync(orderId);
}

// সঠিক নিয়ম: Task রিটার্ন করে এরর সুরক্ষিত রাখা
public async Task ProcessBatchOrderAsync(int orderId)
{
    await SubmitOrderAsync(orderId);
}
\`\`\`

---

## ৫. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ইন-প্লেস রিপ্লেসমেন্ট প্রসেসিং
*সোর্স: কোডফোর্সেস আসিউট শিট #৩: প্রবলেম C (Replacement)*

প্রদত্ত $N$ আকারের একটি অ্যারেতে সব ধনাত্মক সংখ্যাকে $1$ এবং সব ঋণাত্মক সংখ্যাকে $2$ দিয়ে প্রতিস্থাপন করতে হবে, আর শূন্য অপরিবর্তিত থাকবে।

### সমাধান কৌশল:
১. **শর্তভিত্তিক মান পরিবর্তন**:
   - $A[i] > 0$ হলে $A[i] = 1$।
   - $A[i] < 0$ হলে $A[i] = 2$।
   - $A[i] == 0$ হলে অপরিবর্তিত।
২. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O(N)$ সিঙ্গেল পাস।
   - **স্পেস কমপ্লেক্সিটি**: $O(N)$ অ্যারে ধারণের জন্য।

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
            int val = int.Parse(tokens[i]);
            if (val > 0) numbers[i] = 1;
            else if (val < 0) numbers[i] = 2;
            else numbers[i] = 0;
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

## ৬. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Replacement](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C) | Easy | In-place Mutation, State Machine |
| ⚪ | Codeforces | [Assiut Sheet #3: Positions in array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/D) | Easy | Conditional Filtering, Async Stream |
| ⚪ | Exercism C# | [Resistor Color Duo](https://exercism.org/tracks/csharp/exercises/resistor-color-duo) | Easy | String Parsing, Value Conversion |
| ⚪ | Exercism C# | [Reverse String](https://exercism.org/tracks/csharp/exercises/reverse-string) | Easy | In-place Reversal, Async Pipelines |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Replacement",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/C",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Array", "In-place", "Mutation"],
      solutionEn:
        "Iterate through array elements and replace positive numbers with 1 and negative numbers with 2.",
      solutionBn:
        "অ্যারে উপাদানগুলোর মধ্য দিয়ে লুপ চালিয়ে ধনাত্মক সংখ্যাকে ১ এবং ঋণাত্মক সংখ্যাকে ২ দ্বারা প্রতিস্থাপন করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Positions in array",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/D",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Array", "Filtering", "Indices"],
      solutionEn:
        "Find and print all elements in the array that are less than or equal to 10 along with their positions.",
      solutionBn:
        "অ্যারের যে সকল উপাদানের মান ১০ বা তার কম তাদের মান ও অবস্থান ইন্ডেক্স প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Resistor Color Duo",
      url: "https://exercism.org/tracks/csharp/exercises/resistor-color-duo",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Arrays", "Parsing", "Conversion"],
      solutionEn:
        "Parse two resistor color bands to produce a two-digit resistance value.",
      solutionBn:
        "প্রথম দুটি রেজিস্টার ব্যান্ড রিড করে দুই অঙ্কের রোধের মান তৈরি করুন।",
    },
    {
      source: "Exercism C#",
      name: "Reverse String",
      url: "https://exercism.org/tracks/csharp/exercises/reverse-string",
      difficulty: "EASY",
      company: "Optimizely",
      tags: ["String", "In-place", "Span"],
      solutionEn:
        "Reverse an input character string cleanly using memory-efficient span operations.",
      solutionBn:
        "স্প্যান বা মেমোরি-সাশ্রয়ী উপায়ে একটি স্ট্রিং এর চরিত্রগুলো উল্টো ক্রমে সাজান।",
    },
  ],
};
