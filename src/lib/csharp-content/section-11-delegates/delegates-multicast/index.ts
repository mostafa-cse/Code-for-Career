import type { LocalLesson } from "@/lib/lessons-data";

export const delegatesMulticastLesson: LocalLesson = {
  slug: "delegates-multicast",
  titleEn: "Multicast Delegates",
  titleBn: "মাল্টিকাস্ট ডেলিগেট ও চেইনিং",
  categoryEn: "11. Delegates",
  categoryBn: "১১. ডেলিগেট (Delegates)",
  categoryDescEn:
    "Type-safe function pointers in .NET: single-cast and multicast delegates, built-in Action, Func, and Predicate generic delegates.",
  categoryDescBn:
    ".NET এ টাইপ-নিরাপদ ফাংশন পয়েন্টার: সিঙ্গেল ও মাল্টিকাস্ট ডেলিগেট, বিল্ট-ইন Action, Func এবং Predicate জেনেরিক ডেলিগেট।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Delegate immutability, Delegate.Combine, invocation list traversal with GetInvocationList, the last-return-value-wins trap, and exception isolation.",
  descriptionBn:
    "ডেলিগেট ইমিউটেবিলিটি, Delegate.Combine, GetInvocationList এর সাহায্যে ট্রাভার্সাল, রিটার্ন ভ্যালু ফাঁদ এবং এক্সেপশন আইসোলেশন।",
  difficulty: "MEDIUM",
  displayOrder: 2,
  prerequisites: ["delegates-basic"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Multicast Delegates in C#

In C#, every delegate is inherently a **multicast delegate** (inheriting from \`System.MulticastDelegate\`). This means a single delegate variable can hold references to and sequentially invoke **multiple methods** across an internal invocation list.

Multicast delegates form the foundational plumbing beneath C# **events**, pub/sub subscriber registries, and decoupled notification pipelines.

---

## Delegate Immutability & Chaining

A critical architectural fact:

> **Delegate instances are completely immutable.**

When you use the \`+=\` and \`-=\` operators to attach or detach methods:
- \`notifier += HandlerB;\` calls \`Delegate.Combine(notifier, HandlerB)\` under the hood. It does **not** mutate the existing delegate; it allocates a **brand-new delegate instance** with an updated \`_invocationList\` array!
- \`notifier -= HandlerA;\` calls \`Delegate.Remove(notifier, HandlerA)\`, returning a new delegate without that handler (or \`null\` if the invocation list is depleted).

---

## The Two Critical Traps of Multicast Delegates

When invoking a multicast delegate directly using \`myDelegate(args)\`, two severe runtime pitfalls can occur:

### Trap 1: The "Last Return Value Wins" Trap
If a multicast delegate returns a value (e.g. \`int\` or \`bool\`), the CLR executes all methods sequentially from index $0$ to $N-1$, but **only the return value of the very last method is returned to the caller**! All earlier return values are silently dropped and lost.

### Trap 2: Exception Short-Circuiting
If any method in the invocation list throws an unhandled exception, **execution terminates immediately**. Any remaining handlers queued after the faulted method are **never invoked**, leaving downstream subsystems unaware of the event.

---

## The Enterprise Defensive Invocation Pattern

To collect all return values and guarantee that a failure in one subscriber does not crash the entire broadcast pipeline, iterate through \`GetInvocationList()\` manually:

\`\`\`csharp
public delegate bool SecurityCheck(string user);

public class SecurityPipeline
{
    public static List<bool> ExecuteAllChecksSafely(SecurityCheck? checks, string user)
    {
        var results = new List<bool>();
        if (checks == null) return results;

        // Traverse each individual subscriber safely
        foreach (Delegate individual in checks.GetInvocationList())
        {
            try
            {
                var handler = (SecurityCheck)individual;
                bool passed = handler(user);
                results.Add(passed);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Audit Alert] Security handler failed: {ex.Message}");
                results.Add(false); // Graceful degradation
            }
        }

        return results;
    }
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Fault-Tolerant Telemetry Broadcaster
*Source: Exercism C# Track — Remote Control Competition*
*Simulate an event bus where multiple diagnostic telemetry monitors receive system signals. One faulty monitor throws an exception, but all other monitors must still execute successfully.*

#### C# Implementation

\`\`\`csharp
using System;
using System.Collections.Generic;

public delegate void TelemetryListener(string telemetryData);

public class TelemetryHub
{
    public static void Broadcast(TelemetryListener? listeners, string payload)
    {
        if (listeners == null)
        {
            return;
        }

        foreach (Delegate del in listeners.GetInvocationList())
        {
            TelemetryListener listener = (TelemetryListener)del;
            try
            {
                listener(payload);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Telemetry Warning] Listener failed: {ex.Message}");
            }
        }
    }

    public static void Main()
    {
        TelemetryListener hub = data => Console.WriteLine($"ConsoleLogger: {data}");
        hub += data => throw new InvalidOperationException("Disk drive full!");
        hub += data => Console.WriteLine($"CloudTelemetry: {data}");

        // Direct invocation (hub(payload)) would CRASH after method 1 and skip method 3!
        // Defensive invocation runs both method 1 and method 3 successfully:
        Broadcast(hub, "CPU_TEMPERATURE=48C");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$ where $N$ is the number of subscribed listeners in the invocation list.
- **Space Complexity**: $\\mathcal{O}(N)$ for the array returned by \`GetInvocationList()\`.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Easy | Multicast invocation, Interfaces, Event dispatch |
| ⚪ | Codeforces | [Assiut Sheet #1: Sort Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T) | Easy | Iteration order, Sequence preservation, Defensive loops |
| ⚪ | Exercism C# | [Need for Speed](https://exercism.org/tracks/csharp/exercises/need-for-speed) | Medium | State updates, Multicast tracking, Method chaining |
| ⚪ | Exercism C# | [Attack of the Trolls](https://exercism.org/tracks/csharp/exercises/attack-of-the-trolls) | Medium | Permission broadcasting, Bitwise operations, Handlers |
`,

  contentBn: `# C# এ মাল্টিকাস্ট ডেলিগেট ও চেইনিং

সি# এ প্রতিটি ডেলিগেটই মূলত একটি **মাল্টিকাস্ট ডেলিগেট** (কারণ প্রতিটি ডেলিগেটই \`System.MulticastDelegate\` থেকে ইনহেরিট করে)। এর অর্থ হলো একটি একক ডেলিগেট ভ্যারিয়েবল একই সাথে **একাধিক মেথডের রেফারেন্স** নিজের অভ্যন্তরীণ ইনভোকেশন লিস্টে ধারণ করতে পারে।

সি# এর **ইভেন্ট (Event)** আর্কিটেকচার এবং পাব-সাব (Publish/Subscribe) নোটিফিকেশন সিস্টেম এই মাল্টিকাস্ট ডেলিগেটের ওপর ভিত্তি করেই গঠিত।

---

## ডেলিগেট ইমিউটেবিলিটি ও মেথড চেইনিং

একটি গুরুত্বপূর্ণ আর্কিটেকচারাল সত্য:

> **ডেলিগেট অবজেক্টগুলো সম্পূর্ণ অপরিবর্তনশীল (Immutable)।**

যখন \`+=\` এবং \`-=\` অপারেটর দিয়ে মেথড যোগ বা বিয়োগ করা হয়:
- \`notifier += HandlerB;\` কোডটি অভ্যন্তরীণভাবে \`Delegate.Combine(notifier, HandlerB)\` কল করে। এটি মূল ডেলিগেটকে পরিবর্তন না করে একটি **সম্পূর্ণ নতুন ডেলিগেট অবজেক্ট** তৈরি করে যার \`_invocationList\`-এ উভয় মেথড থাকে!
- \`notifier -= HandlerA;\` কোডটি \`Delegate.Remove\` কল করে সংশ্লিষ্ট মেথড বাদ দিয়ে একটি নতুন ডেলিগেট তৈরি করে।

---

## মাল্টিকাস্ট ডেলিগেটের দুটি মারাত্মক ফাঁদ

সরাসরি \`myDelegate(args)\` দিয়ে মাল্টিকাস্ট ডেলিগেট রান করলে দুটি মারাত্মক সমস্যা হতে পারে:

### ফাঁদ ১: কেবল শেষ মেথডের মান ফেরত আসা (Last Return Value Wins)
ডেলিগেট যদি কোনো মান রিটার্ন করে (যেমন \`int\` বা \`bool\`), তবে চেইনের প্রতিটি মেথড একে একে রান করলেও **শুধুমাত্র সবার শেষ মেথডটির মান কলারের কাছে ফেরত আসে**! আগের সকল মেথডের রিটার্ন ভ্যালু স্বয়ংক্রিয়ভাবে হারিয়ে যায়।

### ফাঁদ ২: এক্সেপশনে চেইন ভেঙে যাওয়া (Exception Short-Circuiting)
চেইনের কোনো একটি মেথডে আনহ্যান্ডেল্ড এক্সেপশন ঘটলে **সম্পূর্ণ এক্সিকিউশন তৎক্ষণাৎ বন্ধ হয়ে যায়**। ফলে তালিকার পরবর্তী মেথডগুলো আর কখনোই কল হতে পারে না।

---

## ডিফেন্সিভ ইনভোকেশন প্যাটার্ন

সকল সাবস্ক্রাইবারের কাছে নিশ্চিতভাবে ইভেন্ট পৌঁছাতে এবং প্রতিটি মেথডের এক্সেপশনকে আলাদা রাখতে \`GetInvocationList()\` ব্যবহার করে লুপ চালানো আধুনিক এন্টারপ্রাইজ কোডের স্ট্যান্ডার্ড:

\`\`\`csharp
public delegate bool SecurityCheck(string user);

public class SecurityPipeline
{
    public static List<bool> ExecuteAllChecksSafely(SecurityCheck? checks, string user)
    {
        var results = new List<bool>();
        if (checks == null) return results;

        foreach (Delegate individual in checks.GetInvocationList())
        {
            try
            {
                var handler = (SecurityCheck)individual;
                bool passed = handler(user);
                results.Add(passed);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Audit Alert] Security handler failed: {ex.Message}");
                results.Add(false);
            }
        }

        return results;
    }
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ফল্ট-টলারেন্ট টেলিমেট্রি ব্রডকাস্টার
*একটি ব্রডকাস্ট বাস সিমুলেট করতে হবে যেখানে একাধিক লিসেনার যুক্ত থাকবে। কোনো একটি লিসেনারে এরর হলেও যেন বাকি সকল লিসেনার সফলভাবে বার্তা গ্রহণ করতে পারে।*

#### C# সমাধান

\`\`\`csharp
using System;
using System.Collections.Generic;

public delegate void TelemetryListener(string telemetryData);

public class TelemetryHub
{
    public static void Broadcast(TelemetryListener? listeners, string payload)
    {
        if (listeners == null)
        {
            return;
        }

        foreach (Delegate del in listeners.GetInvocationList())
        {
            TelemetryListener listener = (TelemetryListener)del;
            try
            {
                listener(payload);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Telemetry Warning] Listener failed: {ex.Message}");
            }
        }
    }

    public static void Main()
    {
        TelemetryListener hub = data => Console.WriteLine($"ConsoleLogger: {data}");
        hub += data => throw new InvalidOperationException("Disk drive full!");
        hub += data => Console.WriteLine($"CloudTelemetry: {data}");

        Broadcast(hub, "CPU_TEMPERATURE=48C");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$, যেখানে $N$ হলো ইনভোকেশন লিস্টে থাকা মোট হ্যান্ডলারের সংখ্যা।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(N)$, \`GetInvocationList()\` মেথড কর্তৃক ফেরত দেওয়া অ্যারির জন্য।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Easy | Multicast invocation, Interfaces, Event dispatch |
| ⚪ | Codeforces | [Assiut Sheet #1: Sort Numbers](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T) | Easy | Iteration order, Sequence preservation, Defensive loops |
| ⚪ | Exercism C# | [Need for Speed](https://exercism.org/tracks/csharp/exercises/need-for-speed) | Medium | State updates, Multicast tracking, Method chaining |
| ⚪ | Exercism C# | [Attack of the Trolls](https://exercism.org/tracks/csharp/exercises/attack-of-the-trolls) | Medium | Permission broadcasting, Bitwise operations, Handlers |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Remote Control Competition",
      url: "https://exercism.org/tracks/csharp/exercises/remote-control-competition",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Delegates", "Multicast", "Interfaces"],
      solutionEn:
        "Dispatch telemetry and race results across multiple listeners using multicast invocation and safe array traversal.",
      solutionBn:
        "মাল্টিকাস্ট ডেলিগেট ও নিরাপদ অ্যারে ট্রাভার্সালের মাধ্যমে একাধিক লিসেনারে রেসের ফলাফল সম্প্রচার করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Sort Numbers",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/T",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Iteration", "Arrays", "Preservation"],
      solutionEn:
        "Read three integers, sorting a duplicate list while preserving the original input order for comparative output.",
      solutionBn:
        "তিনটি সংখ্যা ইনপুট নিয়ে একটি ক্লোন লিস্ট আরোহী ক্রমে সাজান এবং মূল ক্রমটি অক্ষত রেখে উভয় তালিকা প্রদর্শন করুন।",
    },
    {
      source: "Exercism C#",
      name: "Need for Speed",
      url: "https://exercism.org/tracks/csharp/exercises/need-for-speed",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["State", "Methods", "Delegates"],
      solutionEn:
        "Track battery depletion and distance accumulation across multiple simulated remote control cars using method chaining.",
      solutionBn:
        "মেথড চেইনিং ব্যবহারের মাধ্যমে একাধিক রিমোট কন্ট্রোল কারের ব্যাটারি ক্ষয় ও চলমান দূরত্বের হিসাব রাখুন।",
    },
    {
      source: "Exercism C#",
      name: "Attack of the Trolls",
      url: "https://exercism.org/tracks/csharp/exercises/attack-of-the-trolls",
      difficulty: "MEDIUM",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Flags", "Bitwise", "Broadcast"],
      solutionEn:
        "Broadcast permission mutations to registered game handlers, verifying that security bitmasks are properly updated.",
      solutionBn:
        "নিবন্ধিত গেম হ্যান্ডলারদের কাছে পারমিশন পরিবর্তন ব্রডকাস্ট করুন এবং বিটমাস্ক আপডেট নিশ্চিত করুন।",
    },
  ],
};
