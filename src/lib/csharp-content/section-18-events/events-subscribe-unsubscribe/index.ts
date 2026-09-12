import type { LocalLesson } from "@/lib/lessons-data";

export const eventsSubscribeUnsubscribeLesson: LocalLesson = {
  slug: "events-subscribe-unsubscribe",
  titleEn: "Subscribe, Unsubscribe & Memory Leaks",
  titleBn: "সাবস্ক্রাইব, আনসাবস্ক্রাইব ও মেমোরি লিক (Memory Leaks)",
  categoryEn: "18. Events",
  categoryBn: "১৮. ইভেন্টস (Events)",
  categoryDescEn:
    "Preventing event memory leaks: strong references in delegate invocation lists, the 'Lapsed Listener' problem, unsubscribing in Dispose(), and WeakEventManager.",
  categoryDescBn:
    "ইভেন্ট মেমোরি লিক প্রতিরোধ: ডেলিগেটের স্ট্রং রেফারেন্স, ল্যাপসড লিসেনার সমস্যা, Dispose()-এ আনসাবস্ক্রিপশন ও WeakEventManager।",
  categoryPriority: "CORE",
  descriptionEn:
    "Master event subscription, the lapsed listener problem, and how unmanaged subscriptions cause severe memory leaks.",
  descriptionBn:
    "ইভেন্ট সাবস্ক্রিপশন, ল্যাপসড লিসেনার মেমোরি লিক এবং Dispose মেথডে নিরাপদ আনসাবস্ক্রিপশন।",
  difficulty: "HARD",
  displayOrder: 3,
  prerequisites: ["events-basics", "resources-idisposable"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Subscribe, Unsubscribe & Memory Leaks in C#

In managed runtime environments like .NET, event handlers are one of the most common causes of silent, gradual memory leaks. This architectural defect is formally known as the **Lapsed Listener Problem**.

---

## 1. The Lapsed Listener Problem (Root Cause)

When an instance method is attached to an event as a handler:

\`\`\`csharp
longLivedPublisher.OrderPlaced += shortLivedSubscriber.OnOrderPlaced;
\`\`\`

Under the hood, a delegate is constructed with two references:
1. **\`_methodPtr\`**: Function pointer to \`OnOrderPlaced\`.
2. **\`_target\`**: A **strong managed reference** to the \`shortLivedSubscriber\` instance.

\`\`\`
[GC Root: Static or Long-Lived Service]
                │
                ▼
      ┌────────────────────┐
      │ LongLivedPublisher │
      │  _orderPlaced ─────┼──► [MulticastDelegate InvocationList]
      └────────────────────┘                    │
                                                ▼
                                    ┌──────────────────────┐
                                    │ Target (STRONG REF!) │
                                    └───────────┬──────────┘
                                                ▼
                                    ┌──────────────────────┐
                                    │ ShortLivedSubscriber │
                                    │ (Cannot be collected!│
                                    │  Zombie in Gen 2!)   │
                                    └──────────────────────┘
\`\`\`

### The Consequence:
- Even if all other references to \`shortLivedSubscriber\` are set to \`null\`, the Garbage Collector **cannot collect it** because the publisher retains a reachable path from a GC root!
- If the publisher lives for the entire lifetime of the process (e.g., a singleton, window manager, or static event), every subscriber ever attached **remains in memory forever**. Over hours of uptime, the application exhausts memory and crashes with an \`OutOfMemoryException\`.

---

## 2. The Anonymous Method / Lambda Trap

A frequent mistake in event handling is subscribing using an inline lambda or anonymous method:

\`\`\`csharp
// Subscribing with an inline lambda:
publisher.DataChanged += (sender, args) => HandleData(args);

// DANGEROUS ATTEMPT: This DOES NOT unsubscribe the lambda!
publisher.DataChanged -= (sender, args) => HandleData(args);
\`\`\`

### Why This Fails:
Each time the compiler encounters a lambda expression, it generates a **brand new delegate instance**. 
- The \`-=\` operator searches the invocation list for a delegate with matching target and method pointers.
- Because the second lambda is a different instance, the search finds nothing.
- The original lambda **remains attached forever**, leaking both the subscriber and any variables captured in its closure!

### The Solution:
Always use a named instance method, or assign the lambda to a delegate variable that is retained for unsubscription:
\`\`\`csharp
Action<object?, EventArgs> handler = (s, e) => HandleData(e);
publisher.DataChanged += handler;
// Later:
publisher.DataChanged -= handler; // Successfully unsubscribed!
\`\`\`

---

## 3. Clean Unsubscription Patterns

### 1. The \`IDisposable\` Subscriber Pattern (Standard):
Whenever a short-lived class subscribes to an event on a longer-lived object, the subscriber **must implement \`IDisposable\`**:

\`\`\`csharp
public class OrderReportView : IDisposable
{
    private readonly OrderService _service;
    private bool _disposed;

    public OrderReportView(OrderService service)
    {
        _service = service;
        _service.OrderPlaced += OnOrderPlaced; // Attach
    }

    private void OnOrderPlaced(object? sender, OrderEventArgs e)
    {
        UpdateUi(e);
    }

    public void Dispose()
    {
        if (_disposed) return;
        _service.OrderPlaced -= OnOrderPlaced; // Detach cleanly!
        _disposed = true;
    }
}
\`\`\`

### 2. The Weak Event Pattern:
When the subscriber cannot manage its unsubscription lifecycle deterministically, use weak references so the delegate does not root the subscriber:
\`\`\`csharp
// WPF / XAML environments provide WeakEventManager:
WeakEventManager<OrderService, OrderEventArgs>.AddHandler(service, nameof(service.OrderPlaced), OnOrderPlaced);
\`\`\`

---

## 4. Practical Problem Walkthrough

### Problem: Range Sum Query with Deterministic Resource Scoping
*Source: Codeforces Assiut Sheet #3: Problem Y (Range sum query)*

Given an array of $N$ numbers and $Q$ queries, each query provides two indices $L$ and $R$ ($1$-indexed). Compute the sum of numbers from index $L$ to $R$.

In enterprise metric aggregations, subscription listeners must clean up resources and detach stream handles after range evaluation to prevent memory accumulation.

### Algorithmic Strategy:
1. **Prefix Sum Precomputation**: Construct a 64-bit (\`long\`) prefix sum array $P$ where $P[i] = P[i - 1] + A[i]$ in $O(N)$ time.
2. **$O(1)$ Queries**: For query $[L, R]$, compute $\\text{Sum} = P[R] - P[L - 1]$.
3. **Complexity**:
   - **Time Complexity**: $O(N + Q)$ total time.
   - **Space Complexity**: $O(N)$ prefix array storage.

### C# Solution:

\`\`\`csharp
using System;
using System.IO;

public class Program
{
    public static void Main()
    {
        using var reader = new StreamReader(Console.OpenStandardInput());
        using var writer = new StreamWriter(Console.OpenStandardOutput());

        string? firstLine = reader.ReadLine();
        if (string.IsNullOrEmpty(firstLine)) return;

        string[] header = firstLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(header[0]);
        int q = int.Parse(header[1]);

        long[] prefixSum = new long[n + 1];
        string[] numbers = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);

        for (int i = 0; i < n; i++)
        {
            prefixSum[i + 1] = prefixSum[i] + long.Parse(numbers[i]);
        }

        for (int i = 0; i < q; i++)
        {
            string[] query = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);
            int l = int.Parse(query[0]);
            int r = int.Parse(query[1]);

            long sum = prefixSum[r] - prefixSum[l - 1];
            writer.WriteLine(sum);
        }
    }
}
\`\`\`

---

## 5. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Building Telemetry](https://exercism.org/tracks/csharp/exercises/building-telemetry) | Medium | Telemetry, Unsubscription, IDisposable |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Medium | Event Listeners, State Cleanup |
| ⚪ | Codeforces | [Assiut Sheet #3: Range sum query](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Y) | Medium | Prefix Sums, O(1) Queries |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | Buffer Lifecycle, State Management |
`,

  contentBn: `# C# এ সাবস্ক্রাইব, আনসাবস্ক্রাইব ও মেমোরি লিক (Memory Leaks)

.NET এর মতো স্বয়ংক্রিয় মেমোরি ম্যানেজমেন্ট সম্পন্ন পরিবেশে ইভেন্ট হ্যান্ডলার হলো সবচেয়ে বিপজ্জনক **অদৃশ্য মেমোরি লিকের (Silent Memory Leak)** প্রধান কারণ। সফটওয়্যার আর্কিটেকচারে একে পারিভাষিকভাবে **ল্যাপসড লিসেনার প্রবলেম (Lapsed Listener Problem)** বলা হয়।

---

## ১. ল্যাপসড লিসেনার সমস্যা (মূল কারণ)

যখন কোনো অবজেক্টের ইনস্ট্যান্স মেথডকে অন্য কোনো ক্লাসের ইভেন্টে সাবস্ক্রাইব করা হয়:

\`\`\`csharp
longLivedPublisher.OrderPlaced += shortLivedSubscriber.OnOrderPlaced;
\`\`\`

অভ্যন্তরীণভাবে ডেলিগেট অবজেক্টটির ভেতরে দুটি রেফারেন্স সংরক্ষিত থাকে:
১. **\`_methodPtr\`**: \`OnOrderPlaced\` মেথডের ফাংশন পয়েন্টার।
২. **\`_target\`**: \`shortLivedSubscriber\` ইনস্ট্যান্সের একটি **শক্তিশালী রেফারেন্স (Strong Reference)**।

\`\`\`
[GC Root: স্ট্যাটিক ক্লাস বা লং-লিভড সার্ভিস]
                │
                ▼
      ┌────────────────────┐
      │ LongLivedPublisher │
      │  _orderPlaced ─────┼──► [মাল্টিকাস্ট ডেলিগেট ইনভোকেশন লিস্ট]
      └────────────────────┘                    │
                                                ▼
                                    ┌──────────────────────┐
                                    │ Target (স্ট্রং রেফারেন্স)│
                                    └───────────┬──────────┘
                                                ▼
                                    ┌──────────────────────┐
                                    │ ShortLivedSubscriber │
                                    │ (GC মেমোরি মুছতে পারে │
                                    │  না, Gen 2 তে জম্বি!) │
                                    └──────────────────────┘
\`\`\`

### এর মারাত্মক পরিণতি:
- অ্যাপ্লিকেশনের মূল কোডে \`shortLivedSubscriber = null;\` করে দেওয়া হলেও গারবেজ কালেক্টর **তাকে মেমোরি থেকে মুছতে পারে না**। কারণ পাবলিশার অবজেক্টটি এখনও তার ইনভোকেশন লিস্টের মাধ্যমে সাবস্ক্রাইবারকে জীবন্ত ধরে রেখেছে!
- পাবলিশার যদি পুরো অ্যাপ চলাকালীন বেঁচে থাকে (যেমন সিঙ্গেলটন বা স্ট্যাটিক ইভেন্ট), তবে যত সাবস্ক্রাইবার একবার যুক্ত হয়েছে তারা সবাই **চিরদিনের জন্য মেমোরিতে আটকে থাকে**। একপর্যায়ে সার্ভার \`OutOfMemoryException\` দিয়ে ক্র্যাশ করে।

---

## ২. বেনামী ল্যাম্বডা এক্সপ্রেশনের ফাঁদ

একটি অতি পরিচিত ভুল হলো ইভেন্টে সরাসরি ল্যাম্বডা ব্যবহার করা:

\`\`\`csharp
// ল্যাম্বডা দিয়ে সাবস্ক্রাইব করা:
publisher.DataChanged += (sender, args) => HandleData(args);

// মারাত্মক ভুল: এই কোড পূর্বের ল্যাম্বডাকে কখনোই আনসাবস্ক্রাইব করে না!
publisher.DataChanged -= (sender, args) => HandleData(args);
\`\`\`

### কেন এটি কাজ করে না:
কম্পাইলার প্রতিবার নতুন ল্যাম্বডা এক্সপ্রেশনের জন্য **সম্পূর্ণ নতুন একটি ডেলিগেট ইনস্ট্যান্স** তৈরি করে।
- \`-=\` অপারেটর ইনভোকেশন লিস্টে খোঁজার সময় আগের ইনস্ট্যান্সের সাথে একে মেলাতে পারে না।
- ফলে পূর্বের ল্যাম্বডাটি আজীবনের জন্য থেকে যায় এবং তার ক্যাপচার করা ভেরিয়েবলসহ মেমোরি লিক ঘটায়!

### সমাধান:
সর্বদা সাধারণ মেথড ব্যবহার করুন, অথবা ল্যাম্বডাটিকে একটি ডেলিগেট ভেরিয়েবলে সংরক্ষণ করে রাখুন।

---

## ৩. নিরাপদ আনসাবস্ক্রিপশন প্যাটার্ন

### ১. সাবস্ক্রাইবারে \`IDisposable\` বাস্তবায়ন:
স্বল্পকালীন কোনো ক্লাস দীর্ঘকালীন কোনো অবজেক্টের ইভেন্ট শুনলে অবশ্যই \`IDisposable\` ইন্টারফেস ইমপ্লিমেন্ট করা উচিত:

\`\`\`csharp
public class OrderReportView : IDisposable
{
    private readonly OrderService _service;
    private bool _disposed;

    public OrderReportView(OrderService service)
    {
        _service = service;
        _service.OrderPlaced += OnOrderPlaced; // যুক্ত হওয়া
    }

    private void OnOrderPlaced(object? sender, OrderEventArgs e)
    {
        UpdateUi(e);
    }

    public void Dispose()
    {
        if (_disposed) return;
        _service.OrderPlaced -= OnOrderPlaced; // নিশ্চিতভাবে বিচ্ছিন্ন হওয়া!
        _disposed = true;
    }
}
\`\`\`

---

## ৪. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: রেঞ্জ সাম কুয়েরি ও প্রিফিক্স সাম
*সোর্স: কোডফোর্সেস আসসিউত শিট #৩: প্রবলেম Y (Range sum query)*

প্রদত্ত $N$ আকারের একটি অ্যারে এবং $Q$ সংখ্যক কুয়েরির জন্য প্রতিটি কুয়েরিতে $L$ থেকে $R$ পর্যন্ত উপাদানগুলোর যোগফল বের করতে হবে।

### সমাধান কৌশল:
১. **প্রিফিক্স সাম অ্যারে**: $O(N)$ সময়ে একটি 64-বিট (\`long\`) অ্যারে তৈরি করা যেখানে $P[i] = P[i-1] + A[i]$।
২. **$O(1)$ সময়ে কুয়েরি সমাধান**: যে কোনো $[L, R]$ রেঞ্জের যোগফল $P[R] - P[L - 1]$।
৩. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O(N + Q)$।
   - **স্পেস কমপ্লেক্সিটি**: $O(N)$।

### সম্পূর্ণ সি# সলিউশন:

\`\`\`csharp
using System;
using System.IO;

public class Program
{
    public static void Main()
    {
        using var reader = new StreamReader(Console.OpenStandardInput());
        using var writer = new StreamWriter(Console.OpenStandardOutput());

        string? firstLine = reader.ReadLine();
        if (string.IsNullOrEmpty(firstLine)) return;

        string[] header = firstLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(header[0]);
        int q = int.Parse(header[1]);

        long[] prefixSum = new long[n + 1];
        string[] numbers = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);

        for (int i = 0; i < n; i++)
        {
            prefixSum[i + 1] = prefixSum[i] + long.Parse(numbers[i]);
        }

        for (int i = 0; i < q; i++)
        {
            string[] query = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);
            int l = int.Parse(query[0]);
            int r = int.Parse(query[1]);

            long sum = prefixSum[r] - prefixSum[l - 1];
            writer.WriteLine(sum);
        }
    }
}
\`\`\`

---

## ৫. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Building Telemetry](https://exercism.org/tracks/csharp/exercises/building-telemetry) | Medium | Telemetry, Unsubscription, IDisposable |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Medium | Event Listeners, State Cleanup |
| ⚪ | Codeforces | [Assiut Sheet #3: Range sum query](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Y) | Medium | Prefix Sums, O(1) Queries |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | Buffer Lifecycle, State Management |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Building Telemetry",
      url: "https://exercism.org/tracks/csharp/exercises/building-telemetry",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Memory Leak", "Events", "IDisposable"],
      solutionEn:
        "Properly implement IDisposable on the subscriber to detach event listeners upon release.",
      solutionBn:
        "রিসোর্স রিলিজের সময় ইভেন্ট লিসেনার বিচ্ছিন্ন করতে সাবস্ক্রাইবারে IDisposable বাস্তবায়ন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Remote Control Competition",
      url: "https://exercism.org/tracks/csharp/exercises/remote-control-competition",
      difficulty: "MEDIUM",
      company: "Samsung R&D",
      tags: ["Events", "Memory Management"],
      solutionEn:
        "Ensure race participants correctly detach telemetry listeners to prevent memory retention.",
      solutionBn:
        "মেমোরি লিকেজ রোধে রেস অংশগ্রহণকারীরা সঠিকভাবে টেলিমেট্রি লিসেনার আনসাবস্ক্রাইব করে তা নিশ্চিত করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Range sum query",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Y",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["Prefix Sums", "Query", "Arrays"],
      solutionEn:
        "Precompute cumulative prefix sums in O(N) time to answer range sum queries in O(1) time.",
      solutionBn:
        "O(N) সময়ে প্রিফিক্স সাম প্রিকম্পিউট করে O(1) সময়ে যেকোনো রেঞ্জের যোগফল বের করুন।",
    },
    {
      source: "Exercism C#",
      name: "Circular Buffer",
      url: "https://exercism.org/tracks/csharp/exercises/circular-buffer",
      difficulty: "MEDIUM",
      company: "Optimizely",
      tags: ["Buffer", "Lifecycle", "Data Structures"],
      solutionEn:
        "Manage a cyclic byte ring buffer with deterministic overwrite and discard operations.",
      solutionBn:
        "ডিটারমিনিস্টিক উপায়ে পূর্ণ বাফারের পুরোনো ডেটা প্রতিস্থাপন করে সাইক্লিক রিং বাফার পরিচালনা করুন।",
    },
  ],
};
