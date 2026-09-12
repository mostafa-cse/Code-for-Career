import type { LocalLesson } from "@/lib/lessons-data";

export const eventsEventhandlerLesson: LocalLesson = {
  slug: "events-eventhandler",
  titleEn: "EventHandler & EventArgs",
  titleBn: "ইভেন্টহ্যান্ডলার ও ইভেন্টআর্গস (EventHandler & EventArgs)",
  categoryEn: "18. Events",
  categoryBn: "১৮. ইভেন্টস (Events)",
  categoryDescEn:
    "The official .NET event design guidelines: standard EventHandler, generic EventHandler<TEventArgs>, EventArgs base class, and payload isolation.",
  categoryDescBn:
    ".NET এর স্ট্যান্ডার্ড ইভেন্ট কনভেনশন: EventHandler, জেনেরিক EventHandler<TEventArgs> ও EventArgs ক্লাস।",
  categoryPriority: "CORE",
  descriptionEn:
    "Learn the standard .NET design pattern for events using EventHandler and EventHandler<TEventArgs>.",
  descriptionBn:
    ".NET-এর স্ট্যান্ডার্ড ইভেন্ট ডিজাইন প্যাটার্ন: EventHandler এবং কাস্টম EventArgs এর ব্যবহার।",
  difficulty: "MEDIUM",
  displayOrder: 2,
  prerequisites: ["events-basics", "generics-classes"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# EventHandler & EventArgs in C#

Across the entire .NET runtime, Microsoft establishes a strict, standardized design convention for all events. Adhering to the **\`EventHandler\`** and **\`EventArgs\`** pattern ensures your code seamlessly integrates with framework components, libraries, and GUI tooling.

---

## 1. The .NET Standard Event Design Guidelines

The official .NET design guidelines mandate three core rules for all event signatures:

\`\`\`csharp
// 1. Dataless Event Signature:
public delegate void EventHandler(object? sender, EventArgs e);

// 2. Data-Carrying Event Signature:
public delegate void EventHandler<TEventArgs>(object? sender, TEventArgs e);
\`\`\`

### Rule 1: Two Parameters
Every event must accept exactly two arguments:
- **\`object? sender\`**: The instance that triggered the event (or \`null\` if raised from a \`static\` context). Subscribers can inspect this to distinguish which button or worker fired.
- **\`TEventArgs e\`**: An object holding event data, which must inherit from \`System.EventArgs\`.

### Rule 2: Zero-Data Optimization (\`EventArgs.Empty\`)
If an event carries no additional data, **do not allocate a new \`EventArgs\` instance**. Use the pre-allocated singleton **\`EventArgs.Empty\`**:
\`\`\`csharp
DoorOpened?.Invoke(this, EventArgs.Empty); // 0 heap allocations
\`\`\`

### Rule 3: Protected Virtual Invocation Helper
Always expose a \`protected virtual void OnEventName(TEventArgs e)\` method. This allows derived classes to intercept or override the event without attaching delegate callbacks:
\`\`\`csharp
public class BaseSensor
{
    public event EventHandler<SensorEventArgs>? ReadingRecorded;

    protected virtual void OnReadingRecorded(SensorEventArgs e)
    {
        ReadingRecorded?.Invoke(this, e);
    }
}
\`\`\`

---

## 2. Immutable Event Payloads & Modern Records

Because an event is dispatched to a multicast chain of independent subscribers, **event payload objects should always be immutable**. If one subscriber mutates a property on \`EventArgs\`, all subsequent subscribers receive corrupted state!

### Modern C# Implementation via Records:
\`\`\`csharp
// Immutable, concise event payload record derived from EventArgs
public record TemperatureChangedEventArgs(double NewTemperature, DateTime RecordedAt) : EventArgs;

public class Thermostat
{
    public event EventHandler<TemperatureChangedEventArgs>? TemperatureChanged;

    public void UpdateReading(double temp)
    {
        TemperatureChanged?.Invoke(this, new TemperatureChangedEventArgs(temp, DateTime.UtcNow));
    }
}
\`\`\`

---

## 3. The Cancellable Event Pattern (\`CancelEventArgs\`)

Sometimes an event needs to allow subscribers to **veto or cancel** an upcoming action before it takes place (e.g., closing a window or deleting a file):

\`\`\`csharp
using System.ComponentModel;

public class DocumentEditor
{
    // Subscriber can set e.Cancel = true to abort closing
    public event EventHandler<CancelEventArgs>? DocumentClosing;

    public bool CloseDocument()
    {
        var args = new CancelEventArgs();
        DocumentClosing?.Invoke(this, args);

        if (args.Cancel)
        {
            Console.WriteLine("[Editor] Document close was cancelled by a subscriber!");
            return false;
        }

        Console.WriteLine("[Editor] Document closed cleanly.");
        return true;
    }
}
\`\`\`

---

## 4. The Asynchronous Events Dilemma

Because standard \`EventHandler<T>\` returns \`void\`, attaching an \`async\` subscriber forces the handler to be **\`async void\`**:

\`\`\`csharp
// RISKY: async void event handler
thermostat.TemperatureChanged += async (sender, e) =>
{
    await LogToCloudAsync(e.NewTemperature); // Publisher cannot await this!
};
\`\`\`

### The Risks:
1. The publisher finishes execution and moves on before the subscriber's asynchronous work completes.
2. Any unhandled exception thrown in \`async void\` cannot be caught by the publisher and will terminate the process.

### Modern Solution: Async Event Delegate
\`\`\`csharp
// Define async event delegate returning Task
public delegate Task AsyncEventHandler<TEventArgs>(object? sender, TEventArgs e);

public class AsyncPublisher
{
    public event AsyncEventHandler<TemperatureChangedEventArgs>? TemperatureChangedAsync;

    public async Task NotifySubscribersAsync(TemperatureChangedEventArgs e)
    {
        var handlers = TemperatureChangedAsync?.GetInvocationList()
                                             ?.Cast<AsyncEventHandler<TemperatureChangedEventArgs>>();
        if (handlers == null) return;

        foreach (var handler in handlers)
        {
            await handler(this, e); // Awaited cleanly in sequence!
        }
    }
}
\`\`\`

---

## 5. Practical Problem Walkthrough

### Problem: Frequency Array Telemetry
*Source: Codeforces Assiut Sheet #3: Problem V (Frequency Array)*

Given an array of $N$ numbers and a threshold value $M$, count how many times each number from $1$ to $M$ appears in the array.

In telemetry monitoring systems, when numerical values are recorded, frequency counters aggregate metrics and trigger threshold events.

### Algorithmic Strategy:
1. **Direct-Address Frequency Array**: Allocate an integer array of size $M + 1$.
2. **Single Pass Counting**: For each number $x$ in the input, increment $\\text{freq}[x]$ in $O(1)$ time.
3. **Output**: Print counts for numbers $1$ through $M$.
4. **Complexity**:
   - **Time Complexity**: $O(N + M)$ linear time.
   - **Space Complexity**: $O(M)$ auxiliary memory for frequency buckets.

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
        int m = int.Parse(header[1]);

        string? arrayLine = reader.ReadLine();
        if (string.IsNullOrEmpty(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Direct-address counting array
        int[] frequency = new int[m + 1];

        for (int i = 0; i < n; i++)
        {
            int val = int.Parse(tokens[i]);
            if (val <= m)
            {
                frequency[val]++;
            }
        }

        // Output frequencies for 1 to M
        for (int val = 1; val <= m; val++)
        {
            writer.WriteLine(frequency[val]);
        }
    }
}
\`\`\`

---

## 6. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Building Telemetry](https://exercism.org/tracks/csharp/exercises/building-telemetry) | Medium | EventHandler, EventArgs, Telemetry |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Medium | Event Notifications, Ranking |
| ⚪ | Codeforces | [Assiut Sheet #3: Frequency Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V) | Easy | Direct Addressing, Frequencies |
| ⚪ | Exercism C# | [Roll the Die!](https://exercism.org/tracks/csharp/exercises/roll-the-die) | Easy | Randomization, State Payloads |
`,

  contentBn: `# C# এ ইভেন্টহ্যান্ডলার ও ইভেন্টআর্গস (EventHandler & EventArgs)

পুরো .NET ইকোসিস্টেমে মাইক্রোসফট ইভেন্ট তৈরি ও ব্যবহারের জন্য একটি সুস্পষ্ট এবং বিশ্বজনীন মানদণ্ড বা কনভেনশন নির্ধারণ করে দিয়েছে। **\`EventHandler\`** এবং **\`EventArgs\`** প্যাটার্ন মেনে কোড লিখলে তা ফ্রেমওয়ার্ক লাইব্রেরি ও GUI কম্পোনেন্টের সাথে সহজে ইন্টিগ্রেট করা যায়।

---

## ১. .NET স্ট্যান্ডার্ড ইভেন্ট ডিজাইন গাইডলাইন

অফিসিয়াল .NET নির্দেশিকা অনুযায়ী প্রতিটি ইভেন্টের সিগনেচার নিচের দুটি নিয়মের যেকোনো একটি হতে হবে:

\`\`\`csharp
// ১. অতিরিক্ত ডেটাবিহীন ইভেন্ট সিগনেচার:
public delegate void EventHandler(object? sender, EventArgs e);

// ২. কাস্টম ডেটাসহ ইভেন্ট সিগনেচার:
public delegate void EventHandler<TEventArgs>(object? sender, TEventArgs e);
\`\`\`

### নিয়ম ১: দুটি সুনির্দিষ্ট প্যারামিটার
প্রতিটি হ্যান্ডলার অবশ্যই দুটি আর্গুমেন্ট গ্রহণ করবে:
- **\`object? sender\`**: যে অবজেক্টটি এই ইভেন্টটি ঘটিয়েছে (স্ট্যাটিক মেথড হলে \`null\`)। সাবস্ক্রাইবাররা এটি দিয়ে বুঝতে পারে কোন বাটন বা ওয়ার্কার ইভেন্ট ফায়ার করেছে।
- **\`TEventArgs e\`**: ইভেন্টের প্রয়োজনীয় ডেটা ধারণকারী অবজেক্ট, যা অবশ্যই \`System.EventArgs\` থেকে ইনহেরিট করতে হবে।

### নিয়ম ২: শূন্য ডেটায় \`EventArgs.Empty\` ব্যবহার
যদি কোনো ইভেন্টের সাথে বাড়তি কোনো ডেটা পাঠানোর দরকার না থাকে, তবে **নতুন অবজেক্ট তৈরি না করে** রানটাইমের প্রিবিল্ট সিঙ্গেলটন **\`EventArgs.Empty\`** ব্যবহার করুন:
\`\`\`csharp
DoorOpened?.Invoke(this, EventArgs.Empty); // শূন্য হিপ মেমোরি খরচ
\`\`\`

### নিয়ম ৩: প্রোটেক্টেড ভার্চুয়াল হেল্পার মেথড
ইভেন্ট ফায়ার করার জন্য সর্বদা \`protected virtual void OnEventName(TEventArgs e)\` মেথড রাখুন, যাতে চাইল্ড ক্লাস নতুন সাবস্ক্রিপশন ছাড়াই ইভেন্ট ওভাররাইড করতে পারে:
\`\`\`csharp
public class BaseSensor
{
    public event EventHandler<SensorEventArgs>? ReadingRecorded;

    protected virtual void OnReadingRecorded(SensorEventArgs e)
    {
        ReadingRecorded?.Invoke(this, e);
    }
}
\`\`\`

---

## ২. ইমিউটেবল ইভেন্ট পেলোড ও আধুনিক রেকর্ডস

যেহেতু একটি ইভেন্ট একাধিক সাবস্ক্রাইবারে ধারাবাহিকভাবে পৌঁছায়, তাই **ইভেন্টের ডেটা সর্বদা ইমিউটেবল (অপরিবর্তনীয়) হওয়া উচিত**। প্রথম সাবস্ক্রাইবার যদি ডেটা পরিবর্তন করে ফেলে, তবে পরবর্তী সব সাবস্ক্রাইবার ভুল তথ্য পাবে!

### রেকর্ডসের মাধ্যমে আধুনিক বাস্তবায়ন:
\`\`\`csharp
public record TemperatureChangedEventArgs(double NewTemperature, DateTime RecordedAt) : EventArgs;

public class Thermostat
{
    public event EventHandler<TemperatureChangedEventArgs>? TemperatureChanged;

    public void UpdateReading(double temp)
    {
        TemperatureChanged?.Invoke(this, new TemperatureChangedEventArgs(temp, DateTime.UtcNow));
    }
}
\`\`\`

---

## ৩. বাতিলযোগ্য ইভেন্ট প্যাটার্ন (\`CancelEventArgs\`)

কখনও কখনও কোনো কাজ চূড়ান্ত হওয়ার আগেই সাবস্ক্রাইবারকে তা **বাতিল বা রদ (Cancel)** করার ক্ষমতা দিতে হয় (যেমন ফাইল ডিলিট বা উইন্ডো বন্ধ করা):

\`\`\`csharp
using System.ComponentModel;

public class DocumentEditor
{
    public event EventHandler<CancelEventArgs>? DocumentClosing;

    public bool CloseDocument()
    {
        var args = new CancelEventArgs();
        DocumentClosing?.Invoke(this, args);

        if (args.Cancel)
        {
            Console.WriteLine("[Editor] কোনো সাবস্ক্রাইবার ডকুমেন্ট বন্ধের রিকোয়েস্ট বাতিল করেছে!");
            return false;
        }

        Console.WriteLine("[Editor] ডকুমেন্ট সফলভাবে বন্ধ হলো।");
        return true;
    }
}
\`\`\`

---

## ৪. অ্যাসিনক্রোনাস ইভেন্ট জটিলতা

প্রথাগত \`EventHandler\` এর রিটার্ন টাইপ \`void\` হওয়ায় কোনো সাবস্ক্রাইবার \`async\` লজিক ব্যবহার করলে তা **\`async void\`** হতে বাধ্য হয়:
\`\`\`csharp
thermostat.TemperatureChanged += async (sender, e) =>
{
    await LogToCloudAsync(e.NewTemperature); // পাবলিশার এর শেষ হওয়ার অপেক্ষা করতে পারে না!
};
\`\`\`

### আধুনিক সমাধান: টাস্ক রিটার্নকারী অ্যাসিনক্রোনাস ডেলিগেট
\`\`\`csharp
public delegate Task AsyncEventHandler<TEventArgs>(object? sender, TEventArgs e);
\`\`\`

---

## ৫. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ফ্রিকোয়েন্সি অ্যারে ও টেলিমেট্রি কাউন্টিং
*সোর্স: কোডফোর্সেস আসসিউত শিট #৩: প্রবলেম V (Frequency Array)*

প্রদত্ত $N$ আকারের একটি অ্যারে এবং সর্বোচ্চ সীমা $M$ এর জন্য ১ থেকে $M$ পর্যন্ত প্রতিটি সংখ্যা কতবার উপস্থিত হয়েছে তা নির্ণয় করতে হবে।

### সমাধান কৌশল:
১. **ডাইরেক্ট-অ্যাড্রেস অ্যারে**: $M + 1$ আকারের একটি পূর্ণসংখ্যার অ্যারে বরাদ্দ করা।
২. **একক পাস গণনা**: অ্যারের প্রতিটি উপাদান $x$ এর জন্য $\text{freq}[x]$ এর মান বৃদ্ধি করা।
৩. **আউটপুট প্রদান**: ১ থেকে $M$ পর্যন্ত ফ্রিকোয়েন্সি প্রিন্ট করা।
৪. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O(N + M)$।
   - **স্পেস কমপ্লেক্সিটি**: $O(M)$।

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
        int m = int.Parse(header[1]);

        string? arrayLine = reader.ReadLine();
        if (string.IsNullOrEmpty(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        int[] frequency = new int[m + 1];

        for (int i = 0; i < n; i++)
        {
            int val = int.Parse(tokens[i]);
            if (val <= m)
            {
                frequency[val]++;
            }
        }

        for (int val = 1; val <= m; val++)
        {
            writer.WriteLine(frequency[val]);
        }
    }
}
\`\`\`

---

## ৬. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Building Telemetry](https://exercism.org/tracks/csharp/exercises/building-telemetry) | Medium | EventHandler, EventArgs, Telemetry |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Medium | Event Notifications, Ranking |
| ⚪ | Codeforces | [Assiut Sheet #3: Frequency Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V) | Easy | Direct Addressing, Frequencies |
| ⚪ | Exercism C# | [Roll the Die!](https://exercism.org/tracks/csharp/exercises/roll-the-die) | Easy | Randomization, State Payloads |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Building Telemetry",
      url: "https://exercism.org/tracks/csharp/exercises/building-telemetry",
      difficulty: "MEDIUM",
      company: "Therap (BD) Ltd",
      tags: ["EventHandler", "EventArgs", "OOP"],
      solutionEn:
        "Implement typed telemetry argument packets and connect them to subscriber listeners.",
      solutionBn:
        "টাইপড টেলিমেট্রি আর্গুমেন্ট প্যাকেট বাস্তবায়ন করুন এবং সাবস্ক্রাইবার লিসেনারের সাথে যুক্ত করুন।",
    },
    {
      source: "Exercism C#",
      name: "Remote Control Competition",
      url: "https://exercism.org/tracks/csharp/exercises/remote-control-competition",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["EventHandler", "Events"],
      solutionEn:
        "Create rank update notifications using EventHandler and event payload arguments.",
      solutionBn:
        "EventHandler ও পেলোড আর্গুমেন্ট ব্যবহার করে র‍্যাঙ্ক আপডেট নোটিফিকেশন তৈরি করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Frequency Array",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/V",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Array", "Direct Addressing", "Counting"],
      solutionEn:
        "Count occurrences of numbers up to M using a fixed direct-address array in linear time.",
      solutionBn:
        "M পর্যন্ত সংখ্যাগুলোর ফ্রিকোয়েন্সি লিনিয়ার সময়ে ডাইরেক্ট-অ্যাড্রেস অ্যারে দিয়ে গুনে রাখুন।",
    },
    {
      source: "Exercism C#",
      name: "Roll the Die!",
      url: "https://exercism.org/tracks/csharp/exercises/roll-the-die",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Random", "State", "Methods"],
      solutionEn:
        "Simulate dice rolls and random spell generation using pseudorandom number generators.",
      solutionBn:
        "র‍্যান্ডম জেনারেটরের মাধ্যমে ছক্কার দান এবং বিশেষ ক্ষমতার মান নির্ধারণ করুন।",
    },
  ],
};
