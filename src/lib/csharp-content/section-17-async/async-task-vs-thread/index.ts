import type { LocalLesson } from "@/lib/lessons-data";

export const asyncTaskVsThreadLesson: LocalLesson = {
  slug: "async-task-vs-thread",
  titleEn: "Task vs Thread",
  titleBn: "টাস্ক বনাম থ্রেড (Task vs Thread) আর্কিটেকচার",
  categoryEn: "17. Async Programming",
  categoryBn: "১৭. অ্যাসিনক্রোনাস প্রোগ্রামিং (async / await)",
  categoryDescEn:
    "Modern asynchronous architecture: Task and ValueTask, async/await state machines, Task.WhenAll/WhenAny, cooperative cancellation, and concurrency vs parallelism.",
  categoryDescBn:
    "আধুনিক অ্যাসিনক্রোনাস আর্কিটেকচার: Task ও ValueTask, async/await স্টেট মেশিন, WhenAll/WhenAny, কো-অপারেটিভ ক্যান্সেলেশন এবং কনকারেন্সি বনাম প্যারালালিজম।",
  categoryPriority: "CORE",
  descriptionEn:
    "OS-level kernel threads vs CLR thread pool abstraction, 1 MB stack overhead, context switching cost, and thread starvation.",
  descriptionBn:
    "অপারেটিং সিস্টেম কার্নেল থ্রেড বনাম CLR থ্রেডপুল অ্যাবস্ট্রাকশন, ১ মেগাবাইট মেমোরি ওভারহেড ও কনটেক্সট সুইচিং।",
  difficulty: "MEDIUM",
  displayOrder: 7,
  prerequisites: ["async-task"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Task vs Thread in C#

One of the most fundamental systems-level concepts in .NET engineering is distinguishing between an operating system **\`Thread\`** and a runtime **\`Task\`**. Conflating the two leads to massive memory bloat, high latency, and ThreadPool starvation.

---

## 1. Architectural Comparison Matrix

| Dimension | \`System.Threading.Thread\` | \`System.Threading.Tasks.Task\` |
| :--- | :--- | :--- |
| **Abstraction Level** | Low-level **OS Kernel Thread**. | High-level **Promise / Work Item abstraction**. |
| **Stack Memory** | **~1 MB reserved virtual memory** per thread. | **~64–128 bytes** managed heap object. |
| **Creation Latency** | **Heavy**: Milliseconds to allocate kernel structures. | **Negligible**: Microseconds to enqueue onto ThreadPool. |
| **Context Switching** | **Expensive**: CPU switches kernel page tables and flushes caches. | **Cooperative**: ThreadPool threads transition work smoothly. |
| **Scale Limit** | Crashes at a few thousand threads (Out Of Memory). | Easily scales to **hundreds of thousands** of tasks. |
| **Composability** | Manual synchronization primitives (\`Join\`, \`ManualResetEvent\`). | Fully composable via \`await\`, \`WhenAll\`, \`WhenAny\`. |
| **Return Values** | Cannot return a value directly (requires shared memory). | Directly exposes \`Task<TResult>\`. |

---

## 2. The .NET ThreadPool & Work-Stealing Engine

When you launch a \`Task\`, it is scheduled onto the **.NET ThreadPool**. The runtime uses an advanced **Work-Stealing Algorithm** to distribute tasks with maximum CPU cache locality:

\`\`\`
                     [Global ThreadPool Queue (FIFO)]
                       (Incoming Tasks from Outside)
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────┐                           ┌───────────────────────┐
│  Worker Thread #1     │                           │  Worker Thread #2     │
│  Local Queue (LIFO)   │                           │  Local Queue (LIFO)   │
│  ┌─────────────────┐  │                           │  ┌─────────────────┐  │
│  │ Task C (Top)    │  │                           │  │ Task X          │  │
│  │ Task B          │  │◄── WORK STEALING (FIFO) ──┼──│ (Queue Empty)   │  │
│  │ Task A (Bottom) │  │                           │  │ Steals Task A!  │  │
│  └─────────────────┘  │                           │  └─────────────────┘  │
└───────────────────────┘                           └───────────────────────┘
\`\`\`

### Why LIFO Local + FIFO Work Stealing?
1. **LIFO Local Queue**: The thread that created a child task is most likely to have the relevant data still warm in its L1/L2 CPU cache. Executing the most recently pushed child task first (LIFO) maximizes cache hits.
2. **FIFO Work Stealing**: When an idle thread steals work from a busy thread, it steals from the *oldest* item at the bottom (FIFO). This minimizes thread contention because the owner thread operates exclusively on the top!

---

## 3. When to Use a Dedicated \`Thread\` vs. \`Task\`

In modern C#, **99.9% of all asynchronous and background work should use \`Task\`**.

However, there are rare scenarios requiring a dedicated OS thread:

### 1. Long-Running Infinite Loops:
If you schedule a loop that runs for the entire duration of the process on the ThreadPool, you permanently hijack that thread pool worker.
\`\`\`csharp
// WRONG: Permanently burns a ThreadPool thread!
Task.Run(() => { while (true) PollSerialPort(); });

// CORRECT Option A: Signal runtime to create a dedicated thread
Task.Factory.StartNew(
    () => { while (true) PollSerialPort(); },
    TaskCreationOptions.LongRunning);

// CORRECT Option B: Dedicated OS Thread
var serialThread = new Thread(PollSerialPort)
{
    IsBackground = true,
    Name = "SerialPortPollerThread"
};
serialThread.Start();
\`\`\`

### 2. Single-Thread Apartment (STA) Interop:
Legacy COM components or the Windows Clipboard require an STA thread, which the ThreadPool (MTA only) cannot provide:
\`\`\`csharp
var staThread = new Thread(() =>
{
    System.Windows.Clipboard.SetText("Payload");
});
staThread.SetApartmentState(ApartmentState.STA);
staThread.Start();
staThread.Join();
\`\`\`

---

## 4. Practical Problem Walkthrough

### Problem: Digits Summation via Stream Processing
*Source: Codeforces Assiut Sheet #3: Problem K (Sum Digits)*

Given a number $N$ representing the number of digits, and a string of $N$ digits, compute the sum of all digits. Because $N \\le 10^6$, the number cannot fit into standard integer types.

We process the large character string using chunked stream parsing, utilizing ThreadPool task pipelines.

### Algorithmic Strategy:
1. **Character to Digit**: For each character \`c\`, convert to numeric value via \`c - '0'\`.
2. **Accumulation**: Sum values into a 64-bit (\`long\`) variable.
3. **Complexity**:
   - **Time Complexity**: $O(N)$ single pass over characters.
   - **Space Complexity**: $O(1)$ auxiliary memory (streaming character by character).

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

        // Process digit string directly from stream
        string? digits = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(digits)) return;

        // ThreadPool computation offload for large inputs
        long sum = await Task.Run(() =>
        {
            long total = 0;
            for (int i = 0; i < n; i++)
            {
                total += (digits[i] - '0');
            }
            return total;
        });

        await writer.WriteLineAsync(sum.ToString());
    }
}
\`\`\`

---

## 5. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Sum Digits](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/K) | Easy | Character Conversion, ThreadPool Offloading |
| ⚪ | Codeforces | [Assiut Sheet #3: Permutation with arrays](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/R) | Easy | Frequency Map, Array Identity |
| ⚪ | Exercism C# | [Nucleotide Count](https://exercism.org/tracks/csharp/exercises/nucleotide-count) | Easy | Dictionary, Linear Counting |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | State Machine, Simulation |
`,

  contentBn: `# C# এ টাস্ক বনাম থ্রেড (Task vs Thread) আর্কিটেকচার

.NET সিস্টেম ইঞ্জিনিয়ারিংয়ের অন্যতম মৌলিক বিষয় হলো অপারেটিং সিস্টেমের একটি **\`Thread\`** এবং রানটাইমের একটি **\`Task\`** এর মধ্যকার পার্থক্য জানা। এই দুটির পার্থক্য না জানলে অ্যাপ্লিকেশনে অতিরিক্ত মেমোরি খরচ, ধীরগতি এবং থ্রেডপুল সংকট দেখা দেয়।

---

## ১. তুলনামূলক আর্কিটেকচারাল ছক

| মাত্রা | \`System.Threading.Thread\` | \`System.Threading.Tasks.Task\` |
| :--- | :--- | :--- |
| **অ্যাবস্ট্রাকশন লেভেল** | নিম্নস্তরের **অপারেটিং সিস্টেম কার্নেল থ্রেড**। | উচ্চস্তরের **প্রমিজ / কাজের নির্দেশক অ্যাবস্ট্রাকশন**। |
| **স্ট্যাক মেমোরি** | প্রতি থ্রেডে **~১ মেগাবাইট ভার্চুয়াল মেমোরি** সংরক্ষিত থাকে। | হিপে সামান্য সাইজের অবজেক্ট (**~৬৪–১২৮ বাইট**)। |
| **তৈরি হতে সময়** | **অত্যন্ত ধীর**: ওএস কার্নেলে মেমোরি বরাদ্দ লাগে। | **অতি দ্রুত**: প্রস্তুত থাকা থ্রেডপুলের কিউতে যুক্ত হয়। |
| **কনটেক্সট সুইচিং** | **ব্যয়বহুল**: সিপিইউ ক্যাশ ও পেজ টেবিল ফ্ল্যাশ করতে হয়। | **সহযোগিতামূলক**: থ্রেডপুলের থ্রেডগুলো মসৃণভাবে কাজ অদলবদল করে। |
| **স্কেলিং ক্ষমতা** | কয়েক হাজার থ্রেডেই ওএস মেমোরি শেষ হয়ে যায়। | অনায়াসেই **লক্ষাধিক টাস্ক** একসাথে শিডিউল করা যায়। |
| **কম্পোজেবিলিটি** | কোড চেইনিং জটিল (\`Join\`, \`Monitor\` লাগে)। | \`await\`, \`WhenAll\`, \`WhenAny\` দিয়ে চমৎকার পরিচালনা। |
| **রিটার্ন ভ্যালু** | সরাসরি কোনো ভ্যালু রিটার্ন করতে পারে না। | সরাসরি \`Task<TResult>\` এর মাধ্যমে ফলাফল দেয়। |

---

## ২. .NET থ্রেডপুল ও ওয়ার্ক-স্টিল আক্রমণাত্মক ইঞ্জিন

যখন আপনি একটি \`Task\` চালু করেন, এটি সরাসরি **.NET ThreadPool** এ জমা হয়। থ্রেডপুল সিপিইউ ক্যাশ সর্বোচ্চ ব্যবহারের জন্য একটি বিশেষ **Work-Stealing Algorithm** ব্যবহার করে:

\`\`\`
                     [গ্লোবাল থ্রেডপুল কিউ (FIFO)]
                         (বাইরে থেকে আগত কাজসমূহ)
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────┐                           ┌───────────────────────┐
│   ওয়ার্কার থ্রেড #১   │                           │   ওয়ার্কার থ্রেড #২   │
│   লোকাল কিউ (LIFO)    │                           │   লোকাল কিউ (LIFO)    │
│  ┌─────────────────┐  │                           │  ┌─────────────────┐  │
│  │ টাস্ক C (শীর্ষ)  │  │                           │  │ টাস্ক X          │  │
│  │ টাস্ক B          │  │◄── ওয়ার্ক স্টিলিং (FIFO) ──┼──│ (কিউ ফাঁকা)      │  │
│  │ টাস্ক A (তলদেশ)  │  │                           │  │ টাস্ক A চুরি করে! │  │
│  └─────────────────┘  │                           │  └─────────────────┘  │
└───────────────────────┘                           └───────────────────────┘
\`\`\`

### LIFO এবং FIFO সমন্বয়ের কারণ:
১. **LIFO লোকাল কিউ**: যে থ্রেড একটি সাব-টাস্ক তৈরি করেছে, তার সিপিইউ ক্যাশ মেমোরিতে (L1/L2) ডেটা গরম থাকে। সবচেয়ে সাম্প্রতিক কাজটি আগে রান করলে প্রসেসর দ্রুত কাজ শেষ করতে পারে।
২. **FIFO ওয়ার্ক স্টিলিং**: যখন অন্য কোনো থ্রেড অলস বসে থাকে এবং কাজ চুরি করে নিয়ে যায়, তখন সে কিউয়ের সবচেয়ে পুরোনো (তলদেশের) কাজটি নেয়। এতে মূল থ্রেডের সাথে কোনো লক নিয়ে সংঘর্ষ হয় না।

---

## ৩. কখন ডেডিকেটেড \`Thread\` এবং কখন \`Task\` ব্যবহার করবেন

আধুনিক C# এ **৯৯.৯% ক্ষেত্রে \`Task\` ব্যবহার করাই সর্বোত্তম**।

তবে বিরল কিছু ক্ষেত্রে আলাদা ডেডিকেটেড থ্রেড ব্যবহার করতে হয়:

### ১. অনন্তকালীন ব্যাকগ্রাউন্ড লুপ (Long-Running Infinite Loops):
সার্ভার চলাকালীন আজীবন চলবে এমন কোনো লুপ যদি \`Task.Run\` দিয়ে চালান, তবে থ্রেডপুলের একটি স্থায়ী কর্মী নষ্ট হয়ে যাবে।
\`\`\`csharp
// ভুল: থ্রেডপুলের একটি থ্রেড সারাজীবনের জন্য ব্লক হয়ে যাবে!
Task.Run(() => { while (true) ListenToHardware(); });

// সঠিক উপায় ১: রানটাইমকে আলাদা থ্রেড বানাতে বলা
Task.Factory.StartNew(
    () => { while (true) ListenToHardware(); },
    TaskCreationOptions.LongRunning);

// সঠিক উপায় ২: সরাসরি নতুন থ্রেড তৈরি
var thread = new Thread(ListenToHardware)
{
    IsBackground = true,
    Name = "HardwareListenerThread"
};
thread.Start();
\`\`\`

### ২. Single-Thread Apartment (STA) ইন্টারপ:
উইন্ডোজের ক্লিপবোর্ড বা লিগ্যাসি COM কম্পোনেন্ট কেবল STA থ্রেডে কাজ করে, যা থ্রেডপুল সমর্থন করে না।

---

## ৪. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: বিশাল ডিজিট সমষ্টি গণনা ও থ্রেডপুল প্রসেসিং
*সোর্স: কোডফোর্সেস আসিউট শিট #৩: প্রবলেম K (Sum Digits)*

প্রদত্ত $N$ আকারের একটি দীর্ঘ স্ট্রিংয়ের প্রতিটি ডিজিটের যোগফল বের করতে হবে। যেহেতু $N \le 10^6$, তাই এটি সাধারণ ইনটিজারে ধরবে না।

### সমাধান কৌশল:
১. **ক্যারেক্টার থেকে সংখ্যা রূপান্তর**: প্রতিটি ক্যারেক্টার থেকে \`'0'\` বিয়োগ করে মান বের করা।
২. **সমষ্টি সঞ্চয়**: মানগুলোকে 64-বিট (\`long\`) ভেরিয়েবলে যোগ করা।
৩. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O(N)$।
   - **স্পেস কমপ্লেক্সিটি**: $O(1)$ স্ট্রিমিং মেমোরি।

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

        string? digits = await reader.ReadLineAsync();
        if (string.IsNullOrEmpty(digits)) return;

        long sum = await Task.Run(() =>
        {
            long total = 0;
            for (int i = 0; i < n; i++)
            {
                total += (digits[i] - '0');
            }
            return total;
        });

        await writer.WriteLineAsync(sum.ToString());
    }
}
\`\`\`

---

## ৫. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Sum Digits](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/K) | Easy | Character Conversion, ThreadPool Offloading |
| ⚪ | Codeforces | [Assiut Sheet #3: Permutation with arrays](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/R) | Easy | Frequency Map, Array Identity |
| ⚪ | Exercism C# | [Nucleotide Count](https://exercism.org/tracks/csharp/exercises/nucleotide-count) | Easy | Dictionary, Linear Counting |
| ⚪ | Exercism C# | [Robot Simulator](https://exercism.org/tracks/csharp/exercises/robot-simulator) | Medium | State Machine, Simulation |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Sum Digits",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/K",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["String", "Math", "ThreadPool"],
      solutionEn:
        "Parse characters from a long numerical string and sum their integer values offloaded to ThreadPool tasks.",
      solutionBn:
        "দীর্ঘ নিউমেরিক স্ট্রিং থেকে প্রতিটি ক্যারেক্টার পার্স করে থ্রেডপুলে তাদের যোগফল নির্ণয় করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Permutation with arrays",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/R",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Array", "Permutation", "Frequency"],
      solutionEn:
        "Sort both arrays or count element frequencies to determine if array B is a permutation of array A.",
      solutionBn:
        "উভয় অ্যারে সর্ট করে বা ফ্রিকোয়েন্সি গুনে বি অ্যারেটি এ এর পারমিউটেশন কিনা যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "Nucleotide Count",
      url: "https://exercism.org/tracks/csharp/exercises/nucleotide-count",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Dictionary", "Counting", "DNA"],
      solutionEn:
        "Count the frequency of each DNA nucleotide in a genetic sequence string.",
      solutionBn:
        "ডিএনএ সিকোয়েন্স স্ট্রিংয়ে প্রতিটি নিউক্লিওটাইডের ফ্রিকোয়েন্সি ডিকশনারিতে গুনে রাখুন।",
    },
    {
      source: "Exercism C#",
      name: "Robot Simulator",
      url: "https://exercism.org/tracks/csharp/exercises/robot-simulator",
      difficulty: "MEDIUM",
      company: "Optimizely",
      tags: ["Simulation", "Coordinates", "State"],
      solutionEn:
        "Manage a 2D coordinate robot state machine with turn and advance instruction sets.",
      solutionBn:
        "দিক পরিবর্তন ও অগ্রসর হওয়ার কমান্ড কার্যকর করে রোবটের দ্বিমাত্রিক অবস্থান পরিচালনা করুন।",
    },
  ],
};
