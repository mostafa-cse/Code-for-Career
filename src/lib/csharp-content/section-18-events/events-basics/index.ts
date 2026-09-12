import type { LocalLesson } from "@/lib/lessons-data";

export const eventsBasicsLesson: LocalLesson = {
  slug: "events-basics",
  titleEn: "Events Basics",
  titleBn: "ইভেন্ট এর মৌলিক ধারণা (Events Basics)",
  categoryEn: "18. Events",
  categoryBn: "১৮. ইভেন্টস (Events)",
  categoryDescEn:
    "Publisher-subscriber architecture: event keyword, declaring events, raising events thread-safely with ?.Invoke(), and handling decoupling.",
  categoryDescBn:
    "পাবলিশার-সাবস্ক্রাইবার আর্কিটেকচার: ইভেন্ট কীওয়ার্ড, ইভেন্ট ঘোষণা, ?.Invoke() এর মাধ্যমে থ্রেড-সেফ ইনভোকেশন ও ডিকাপলিং।",
  categoryPriority: "CORE",
  descriptionEn:
    "Understand the publisher-subscriber pattern, declaring events with the event keyword, and safely invoking them.",
  descriptionBn:
    "পাবলিশার-সাবস্ক্রাইবার প্যাটার্ন, event কীওয়ার্ড দিয়ে ইভেন্ট ঘোষণা এবং থ্রেড-সেফ ইনভোকেশন।",
  difficulty: "MEDIUM",
  displayOrder: 1,
  prerequisites: ["delegates-basics", "delegates-action-func"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Events Basics in C#

In software architecture, decoupling components is paramount. An **Event** in C# implements the **Publisher-Subscriber pattern** (Observer pattern), enabling a broadcaster (the **Publisher**) to notify multiple listening components (the **Subscribers**) when an action occurs—without maintaining direct dependencies on them.

---

## 1. Publisher-Subscriber Architecture

\`\`\`
                          ┌──────────────────────────┐
                          │   Publisher Component    │
                          │ (e.g. OrderProcessing)   │
                          └─────────────┬────────────┘
                                        │
                         Fires: OrderPlaced?.Invoke()
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  EmailNotification   │     │  InventoryService    │     │   InvoiceGenerator   │
│  (Subscriber #1)     │     │  (Subscriber #2)     │     │   (Subscriber #3)    │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
\`\`\`

### Core Roles:
1. **Publisher**: Declares the event and triggers invocation when internal state changes. The publisher has zero knowledge of which classes are listening.
2. **Subscriber**: Registers event handler methods with the publisher using the \`+=\` operator.
3. **Encapsulation Barrier**: External classes can **only** subscribe (\`+=\`) or unsubscribe (\`-=\`). They can never invoke the event directly or clear other listeners.

---

## 2. Compiler Lowering of the \`event\` Keyword

Declaring an event is not just declaring a delegate. When you write:

\`\`\`csharp
public class OrderService
{
    public event Action<string>? OrderProcessed;
}
\`\`\`

The Roslyn compiler generates:
1. A **private backing delegate field**:
   \`\`\`csharp
   private Action<string>? _orderProcessed;
   \`\`\`
2. Two public accessor methods (\`add\` and \`remove\`) backed by **\`Interlocked.CompareExchange\`** to ensure thread-safe subscription without lock contention:
   \`\`\`csharp
   public void add_OrderProcessed(Action<string> value)
   {
       Action<string> root = this._orderProcessed;
       Action<string> comparand;
       do
       {
           comparand = root;
           Action<string> combined = (Action<string>)Delegate.Combine(comparand, value);
           root = Interlocked.CompareExchange(ref this._orderProcessed, combined, comparand);
       } while (root != comparand);
   }

   public void remove_OrderProcessed(Action<string> value)
   {
       // Mirrors add using Delegate.Remove
   }
   \`\`\`

---

## 3. Thread-Safe Event Invocation

### Historical Vulnerability (Pre-C# 6):
In older C# code, checking for null before invoking was vulnerable to a race condition:
\`\`\`csharp
// UNSAFE: If another thread unsubscribes right after the null check, NullReferenceException!
if (OrderProcessed != null)
{
    OrderProcessed(orderId);
}
\`\`\`

### Modern Best Practice (Null-Conditional Invocation):
Since C# 6.0, use the null-conditional operator:
\`\`\`csharp
// THREAD-SAFE: Copies the delegate reference onto the stack once before null evaluation
OrderProcessed?.Invoke(orderId);
\`\`\`

---

## 4. The Invocation List Exception Hazard

A multicast delegate invokes its targets sequentially in the order they subscribed. **If Subscriber #1 throws an unhandled exception, execution aborts immediately, and Subscribers #2 and #3 are never called!**

### Robust Multi-Subscriber Invocation Pattern:
\`\`\`csharp
public void RaiseEventSafely(string payload)
{
    var handlers = OrderProcessed?.GetInvocationList();
    if (handlers == null) return;

    var exceptions = new List<Exception>();

    foreach (Action<string> handler in handlers)
    {
        try
        {
            handler(payload);
        }
        catch (Exception ex)
        {
            exceptions.Add(ex); // Capture failure without aborting peers
        }
    }

    if (exceptions.Count > 0)
    {
        throw new AggregateException("One or more event listeners failed.", exceptions);
    }
}
\`\`\`

---

## 5. Practical Implementation Pattern

\`\`\`csharp
using System;

public class OrderEventArgs : EventArgs
{
    public string OrderId { get; }
    public decimal TotalAmount { get; }

    public OrderEventArgs(string orderId, decimal totalAmount)
    {
        OrderId = orderId;
        TotalAmount = totalAmount;
    }
}

public class OrderProcessor
{
    // Standard event declaration
    public event EventHandler<OrderEventArgs>? OrderCompleted;

    public void ProcessOrder(string id, decimal amount)
    {
        Console.WriteLine($"[Publisher] Processing order {id} for \${amount}...");
        
        // Notify all subscribers thread-safely
        OnOrderCompleted(new OrderEventArgs(id, amount));
    }

    protected virtual void OnOrderCompleted(OrderEventArgs e)
    {
        OrderCompleted?.Invoke(this, e);
    }
}
\`\`\`

---

## 6. Practical Problem Walkthrough

### Problem: Minimize Number via Event-Driven Monitoring
*Source: Codeforces Assiut Sheet #3: Problem P (Minimize Number)*

Given an array of $N$ positive integers, you can perform an operation: divide every number in the array by $2$ if and only if **all** numbers are currently even. Determine the maximum number of operations possible.

In enterprise monitoring pipelines, array operations trigger telemetry events whenever an invariant condition is evaluated.

### Algorithmic Strategy:
1. **Evenness Check**: For each element, count how many times it can be divided by $2$ before becoming odd (count trailing zeros in binary representation).
2. **Global Minimum Operations**: The total array operations possible is bounded by $\\min_{i=0}^{N-1} (\\text{divisions}(A[i]))$.
3. **Complexity**:
   - **Time Complexity**: $O(N \\log(\\max A))$ where $\\log(\\max A) \\le 30$.
   - **Space Complexity**: $O(N)$ to store array elements.

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

        string? nLine = reader.ReadLine();
        if (string.IsNullOrEmpty(nLine)) return;

        int n = int.Parse(nLine.Trim());

        string? arrayLine = reader.ReadLine();
        if (string.IsNullOrEmpty(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        int minDivisions = int.MaxValue;

        for (int i = 0; i < n; i++)
        {
            int count = 0;
            int current = numbers[i];

            while (current > 0 && current % 2 == 0)
            {
                count++;
                current /= 2;
            }

            if (count < minDivisions)
            {
                minDivisions = count;
            }

            // Early exit if any number is already odd
            if (minDivisions == 0) break;
        }

        writer.WriteLine(minDivisions);
    }
}
\`\`\`

---

## 7. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Medium | Events, Delegates, OOP |
| ⚪ | Exercism C# | [Building Telemetry](https://exercism.org/tracks/csharp/exercises/building-telemetry) | Medium | Telemetry Events, Callbacks |
| ⚪ | Codeforces | [Assiut Sheet #3: Minimize Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/P) | Easy | Invariant Checking, Math |
| ⚪ | Exercism C# | [Need for Speed](https://exercism.org/tracks/csharp/exercises/need-for-speed) | Easy | State Mutation, Battery Telemetry |
`,

  contentBn: `# C# এ ইভেন্ট এর মৌলিক ধারণা (Events Basics)

সফটওয়্যার ডিজাইনে বিভিন্ন কম্পোনেন্টকে একে অপরের থেকে বিচ্ছিন্ন (Decoupled) রাখা অত্যন্ত গুরুত্বপূর্ণ। C# এর **ইভেন্ট (Event)** মূলত **পাবলিশার-সাবস্ক্রাইবার প্যাটার্ন** (বা Observer pattern) বাস্তবায়ন করে। এর মাধ্যমে একটি ক্লাস (পাবলিশার) কোনো গুরুত্বপূর্ণ ঘটনা ঘটার সাথে সাথে অন্যান্য ক্লাসকে (সাবস্ক্রাইবার) নোটিফাই করতে পারে—তাদের অভ্যন্তরীণ গঠনের ওপর কোনো নির্ভরতা না রেখে।

---

## ১. পাবলিশার-সাবস্ক্রাইবার আর্কিটেকচার

\`\`\`
                          ┌──────────────────────────┐
                          │     পাবলিশার কম্পোনেন্ট    │
                          │  (যেমন: OrderProcessing)  │
                          └─────────────┬────────────┘
                                        │
                         ট্রিগার: OrderPlaced?.Invoke()
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  ইমেইল সার্ভিস       │     │    ইনভেন্টরি সিস্টেম    │     │   ইনভয়েস জেনারেটর   │
│  (সাবস্ক্রাইবার #১)   │     │   (সাবস্ক্রাইবার #২)   │     │  (সাবস্ক্রাইবার #৩)   │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
\`\`\`

### মূল ভূমিকা:
১. **পাবলিশার**: ইভেন্ট ঘোষণা করে এবং কাজের শেষে তা ফায়ার বা ইনভোক করে। কারা এই ইভেন্ট শুনছে সে সম্পর্কে তার কোনো ধারণা থাকে না।
২. **সাবস্ক্রাইবার**: \`+=\` অপারেটরের মাধ্যমে নিজের মেথডকে পাবলিশারের সাথে যুক্ত করে।
৩. **এনক্যাপসুলেশন সুরক্ষা**: বাইরের কোনো ক্লাস কেবল \`+=\` দিয়ে যুক্ত এবং \`-=\` দিয়ে বিচ্ছিন্ন হতে পারে; সরাসরি ইভেন্ট কল করা বা অন্যদের লিসেনার মুছে ফেলা অসম্ভব।

---

## ২. কম্পাইলারের অভ্যন্তরীণ রূপান্তর (Compiler Lowering)

যখন আমরা \`event\` কি-ওয়ার্ড দিয়ে কিছু লিখি:

\`\`\`csharp
public class OrderService
{
    public event Action<string>? OrderProcessed;
}
\`\`\`

Roslyn কম্পাইলার গোপনে দুটি জিনিস তৈরি করে:
১. একটি **প্রাইভেট ব্যাকব্লকিং ডেলিগেট ফিল্ড**:
   \`\`\`csharp
   private Action<string>? _orderProcessed;
   \`\`\`
2. দুটি পাবলিক অ্যাক্সেসর মেথড (\`add\` এবং \`remove\`), যা কোনো সাধারণ লক ছাড়াই থ্রেড-নিরাপত্তা নিশ্চিত করতে **\`Interlocked.CompareExchange\`** ব্যবহার করে:
   \`\`\`csharp
   public void add_OrderProcessed(Action<string> value)
   {
       Action<string> root = this._orderProcessed;
       Action<string> comparand;
       do
       {
           comparand = root;
           Action<string> combined = (Action<string>)Delegate.Combine(comparand, value);
           root = Interlocked.CompareExchange(ref this._orderProcessed, combined, comparand);
       } while (root != comparand);
   }
   \`\`\`

---

## ৩. থ্রেড-সেফ ইভেন্ট ইনভোকেশন

### পুরোনো সি# কোডের ঝুঁকি (Pre-C# 6):
\`\`\`csharp
// অনিরাপদ: নাল চেকের ঠিক পরপরই অন্য থ্রেড আনসাবস্ক্রাইব করলে NullReferenceException হবে!
if (OrderProcessed != null)
{
    OrderProcessed(orderId);
}
\`\`\`

### আধুনিক নিরাপদ নিয়ম (Null-Conditional Operator):
C# 6.0 থেকে প্রবর্তিত নিয়ম:
\`\`\`csharp
// থ্রেড-সেফ: ডেলিগেট রেফারেন্সটি স্ট্যাকে একবার কপি হয়ে এক্সিকিউট হয়
OrderProcessed?.Invoke(orderId);
\`\`\`

---

## ৪. সাবস্ক্রাইবার এক্সেপশন ও ইনভোকেশন লিস্ট ট্র্যাপ

মাল্টিকাস্ট ডেলিগেটে সাবস্ক্রাইবাররা তাদের যোগদানের ক্রমানুসারে কল হয়। **যদি প্রথম সাবস্ক্রাইবারে কোনো এক্সেপশন ঘটে, তবে পেছনের সাবস্ক্রাইবাররা আর কখনোই কল পাবে না!**

### নিরাপদ ধারাবাহিক ইনভোকেশন প্যাটার্ন:
\`\`\`csharp
public void RaiseEventSafely(string payload)
{
    var handlers = OrderProcessed?.GetInvocationList();
    if (handlers == null) return;

    var exceptions = new List<Exception>();

    foreach (Action<string> handler in handlers)
    {
        try
        {
            handler(payload);
        }
        catch (Exception ex)
        {
            exceptions.Add(ex); // একজনের এররে অন্য কেউ আটকে যাবে না
        }
    }

    if (exceptions.Count > 0)
    {
        throw new AggregateException("এক বা একাধিক লিসেনারে ত্রুটি ঘটেছে।", exceptions);
    }
}
\`\`\`

---

## ৫. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: মিনিমাইজ নাম্বার ও ইনভেরিয়েন্ট চেকিং
*সোর্স: কোডফোর্সেস আসসিউত শিট #৩: প্রবলেম P (Minimize Number)*

প্রদত্ত $N$ আকারের ধনাত্মক পূর্ণসংখ্যার অ্যারের সব উপাদান যদি জোড় সংখ্যা হয়, তবে প্রতিটিকে ২ দিয়ে ভাগ করা যায়। সর্বোচ্চ কতবার এই অপারেশন চালানো সম্ভব তা নির্ধারণ করতে হবে।

### সমাধান কৌশল:
১. **ভাগ সংখ্যা গণনা**: প্রতিটি সংখ্যাকে বিজোড় না হওয়া পর্যন্ত ২ দিয়ে কতবার ভাগ করা যায় তা হিসাব করা।
২. **সর্বনিম্ন সীমা**: পুরো অ্যারের মোট অপারেশন হবে সকল উপাদানের স্বতন্ত্র সর্বোচ্চ ভাগের সর্বনিম্ন মান ($\min$) এর সমান।
৩. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O(N \log(\max A))$।
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

        string? nLine = reader.ReadLine();
        if (string.IsNullOrEmpty(nLine)) return;

        int n = int.Parse(nLine.Trim());

        string? arrayLine = reader.ReadLine();
        if (string.IsNullOrEmpty(arrayLine)) return;

        string[] tokens = arrayLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(tokens[i]);
        }

        int minDivisions = int.MaxValue;

        for (int i = 0; i < n; i++)
        {
            int count = 0;
            int current = numbers[i];

            while (current > 0 && current % 2 == 0)
            {
                count++;
                current /= 2;
            }

            if (count < minDivisions)
            {
                minDivisions = count;
            }

            if (minDivisions == 0) break;
        }

        writer.WriteLine(minDivisions);
    }
}
\`\`\`

---

## ৬. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Medium | Events, Delegates, OOP |
| ⚪ | Exercism C# | [Building Telemetry](https://exercism.org/tracks/csharp/exercises/building-telemetry) | Medium | Telemetry Events, Callbacks |
| ⚪ | Codeforces | [Assiut Sheet #3: Minimize Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/P) | Easy | Invariant Checking, Math |
| ⚪ | Exercism C# | [Need for Speed](https://exercism.org/tracks/csharp/exercises/need-for-speed) | Easy | State Mutation, Battery Telemetry |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Remote Control Competition",
      url: "https://exercism.org/tracks/csharp/exercises/remote-control-competition",
      difficulty: "MEDIUM",
      company: "Samsung R&D / Therap",
      tags: ["Events", "Delegates", "OOP"],
      solutionEn:
        "Use event callbacks to notify the race director when telemetry thresholds change.",
      solutionBn:
        "টেলিমেট্রি থ্রেশহোল্ড পরিবর্তনের সময় রেস ডিরেক্টরকে নোটিফাই করতে ইভেন্ট কলব্যাক ব্যবহার করুন।",
    },
    {
      source: "Exercism C#",
      name: "Building Telemetry",
      url: "https://exercism.org/tracks/csharp/exercises/building-telemetry",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["Events", "Telemetry", "Callbacks"],
      solutionEn:
        "Expose sensor telemetry through events with structured argument payloads.",
      solutionBn:
        "স্ট্রাকচার্ড আর্গুমেন্ট পেলোড সহ ইভেন্টের মাধ্যমে সেন্সর টেলিমেট্রি পরিচালনা করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Minimize Number",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/P",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Math", "Array", "Division"],
      solutionEn:
        "Count factor-of-two divisions across all array elements to find the bottleneck operation count.",
      solutionBn:
        "প্রতিটি উপাদানের ২ দিয়ে ভাগের সংখ্যা বের করে পুরো অ্যারের সর্বনিম্ন বিভাজন সংখ্যা নির্ণয় করুন।",
    },
    {
      source: "Exercism C#",
      name: "Need for Speed",
      url: "https://exercism.org/tracks/csharp/exercises/need-for-speed",
      difficulty: "EASY",
      company: "Optimizely",
      tags: ["State", "OOP", "Classes"],
      solutionEn:
        "Simulate remote control battery drain and track distance driven per drive tick.",
      solutionBn:
        "রিমোট কন্ট্রোল গাড়ির ব্যাটারি ক্ষয় এবং অতিক্রান্ত দূরত্ব সিমুলেট করুন।",
    },
  ],
};
