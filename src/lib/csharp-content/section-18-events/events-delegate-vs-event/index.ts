import type { LocalLesson } from "@/lib/lessons-data";

export const eventsDelegateVsEventLesson: LocalLesson = {
  slug: "events-delegate-vs-event",
  titleEn: "Delegate vs Event",
  titleBn: "ডেলিগেট বনাম ইভেন্ট (Delegate vs Event)",
  categoryEn: "18. Events",
  categoryBn: "১৮. ইভেন্টস (Events)",
  categoryDescEn:
    "Deep architectural comparison: how the event keyword acts as an encapsulation modifier over a delegate, IL compilation differences, and security boundaries.",
  categoryDescBn:
    "গভীর আর্কিটেকচারাল তুলনা: ডেলিগেটের উপর event কীওয়ার্ডের এনক্যাপসুলেশন, IL কম্পাইলেশন পার্থক্য এবং নিরাপত্তা সুরক্ষা।",
  categoryPriority: "CORE",
  descriptionEn:
    "Understand why events exist, how the event keyword encapsulates delegates, and the architectural differences between delegates and events.",
  descriptionBn:
    "ডেলিগেট এবং ইভেন্টের মধ্যে মূল আর্কিটেকচারাল পার্থক্য, এনক্যাপসুলেশন এবং সুরক্ষা মেকানিজম।",
  difficulty: "MEDIUM",
  displayOrder: 4,
  prerequisites: ["delegates-basics", "events-basics"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# Delegate vs Event in C#

One of the most classic technical interview questions in C# engineering is: **"What is the actual difference between a Delegate and an Event?"**

While both are built from the same underlying CLR type (\`MulticastDelegate\`), their purpose, security boundaries, and Intermediate Language (IL) compilation are fundamentally different.

---

## 1. The Encapsulation Analogy: Field vs. Property

To intuitively understand the difference, consider the relationship between a **field** and a **property**:

\`\`\`
┌────────────────────────────────────────────────────────┐
│  Field      ──(Encapsulated by)──►  Property           │
│  Delegate   ──(Encapsulated by)──►  Event              │
└────────────────────────────────────────────────────────┘
\`\`\`

- A **Delegate** is a type definition (similar to a class or interface) representing a method signature pointer.
- An **Event** is an **encapsulation modifier** that wraps a private delegate field, providing a secure public interface exposing **only** \`add\` (\`+=\`) and \`remove\` (\`-=\`) accessors.

---

## 2. Architectural Comparison Matrix

| Dimension | Delegate Field (\`public Action MyAction\`) | Event (\`public event Action MyEvent\`) |
| :--- | :--- | :--- |
| **External Invocation** | **ALLOWED**: Any outside class can call \`MyAction()\`. | **FORBIDDEN**: Only the declaring class can invoke it. |
| **External Overwriting**| **ALLOWED**: Anyone can do \`MyAction = null\` or assign. | **FORBIDDEN**: Direct assignment (\`=\`) causes compile error **CS0070**. |
| **Supported Operators** | \`=\`, \`+=\`, \`-=\`, \`Invoke()\`, \`GetInvocationList()\` | **ONLY** \`+=\` (subscribe) and \`-=\` (unsubscribe) |
| **Interface Support** | Interfaces **cannot** declare fields. | Interfaces **can** declare events (\`event EventHandler E;\`). |
| **IL Representation** | A public field: \`.field public class Action\` | A private field + \`.addon\` and \`.removeon\` accessor methods |

---

## 3. Security & Encapsulation Boundaries

### The Rogue Caller Hazard (Naked Delegate):
\`\`\`csharp
public class StockExchange
{
    // DANGEROUS: Naked public delegate field!
    public Action<string, decimal>? PriceChanged;
}

public class RogueTrader
{
    public void Exploit(StockExchange exchange)
    {
        // 1. Catastrophe: Clears all other subscribers!
        exchange.PriceChanged = null;

        // 2. Catastrophe: Masquerades as the exchange and raises fake prices!
        exchange.PriceChanged?.Invoke("AAPL", 0.01m);
    }
}
\`\`\`

### The Event Safeguard:
\`\`\`csharp
public class SecureStockExchange
{
    // SAFE: Event encapsulation!
    public event Action<string, decimal>? PriceChanged;
}

public class Trader
{
    public void SafeSubscribe(SecureStockExchange exchange)
    {
        // COMPILE ERROR CS0070: Cannot overwrite!
        // exchange.PriceChanged = null;

        // COMPILE ERROR CS0079: Cannot invoke from outside!
        // exchange.PriceChanged("AAPL", 100m);

        // ONLY legal syntax:
        exchange.PriceChanged += OnPriceUpdated;
    }

    private void OnPriceUpdated(string symbol, decimal price) { }
}
\`\`\`

---

## 4. Custom Event Accessors (\`add\` / \`remove\`)

Just as properties can declare custom \`get\` and \`set\` blocks, events can define custom **\`add\`** and **\`remove\`** accessors.

### Sparse Event Storage (Memory Optimization):
If a class declares 50 different events (like a GUI button or window control), declaring 50 separate delegate fields wastes 400 bytes of memory per object instance even when unused. Custom accessors store handlers in a shared dictionary:

\`\`\`csharp
using System.ComponentModel;

public class UltraLightweightControl
{
    private EventHandlerList _eventList = new EventHandlerList();
    private static readonly object ClickEventKey = new object();

    public event EventHandler Click
    {
        add => _eventList.AddHandler(ClickEventKey, value);
        remove => _eventList.RemoveHandler(ClickEventKey, value);
    }

    protected virtual void OnClick(EventArgs e)
    {
        ((EventHandler?)_eventList[ClickEventKey])?.Invoke(this, e);
    }
}
\`\`\`

---

## 5. Practical Problem Walkthrough

### Problem: Binary Search with Encapsulated Lookup
*Source: Codeforces Assiut Sheet #3: Problem Z (Binary Search)*

Given an array $A$ of $N$ numbers and $Q$ queries, determine whether each queried number $X$ exists in the array.

In enterprise data stores, search requests trigger encapsulated events notifying analytical listeners without exposing the underlying delegate chains to external mutation.

### Algorithmic Strategy:
1. **Sort**: Sort array $A$ in $O(N \\log N)$ time.
2. **Binary Search**: For each of the $Q$ queries, find target $X$ via logarithmic interval bisection in $O(\\log N)$ time.
3. **Complexity**:
   - **Time Complexity**: $O((N + Q) \\log N)$.
   - **Space Complexity**: $O(N)$ for elements.

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

        int[] numbers = new int[n];
        string[] arrayTokens = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(arrayTokens[i]);
        }

        Array.Sort(numbers);

        for (int i = 0; i < q; i++)
        {
            int query = int.Parse(reader.ReadLine() ?? "0");

            if (BinarySearch(numbers, query))
            {
                writer.WriteLine("found");
            }
            else
            {
                writer.WriteLine("not found");
            }
        }
    }

    private static bool BinarySearch(int[] array, int target)
    {
        int low = 0;
        int high = array.Length - 1;

        while (low <= high)
        {
            int mid = low + ((high - low) >> 1);
            if (array[mid] == target) return true;
            if (array[mid] < target) low = mid + 1;
            else high = mid - 1;
        }

        return false;
    }
}
\`\`\`

---

## 6. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Medium | Delegate vs Event, Encapsulation |
| ⚪ | Exercism C# | [Building Telemetry](https://exercism.org/tracks/csharp/exercises/building-telemetry) | Medium | Custom Accessors, Access Control |
| ⚪ | Codeforces | [Assiut Sheet #3: Binary Search](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Z) | Easy | Binary Search, Sorting |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Encapsulation, Immutability |
`,

  contentBn: `# C# এ ডেলিগেট বনাম ইভেন্ট (Delegate vs Event)

C# টেকনিক্যাল ইন্টারভিউয়ের সবচেয়ে বহুল জিজ্ঞাসিত প্রশ্নগুলোর একটি হলো: **"ডেলিগেট এবং ইভেন্টের মধ্যে মূল পার্থক্য কী?"**

যদিও দুটিই রানটাইমের একই ক্লাস (\`MulticastDelegate\`) থেকে তৈরি হয়, তবুও এদের মূল উদ্দেশ্য, নিরাপত্তা ও এনক্যাপসুলেশন সম্পূর্ণ আলাদা।

---

## ১. এনক্যাপসুলেশনের উপমা: ফিল্ড বনাম প্রোপার্টি

সহজে বোঝার জন্য ফিল্ড এবং প্রোপার্টির সম্পর্কের দিকে তাকানো যেতে পারে:

\`\`\`
┌────────────────────────────────────────────────────────┐
│  ফিল্ড (Field)      ──(এনক্যাপসুলেট করে)──►  প্রোপার্টি (Property)  │
│  ডেলিগেট (Delegate) ──(এনক্যাপসুলেট করে)──►  ইভেন্ট (Event)         │
└────────────────────────────────────────────────────────┘
\`\`\`

- একটি **ডেলিগেট** হলো একটি টাইপ (ক্লাস বা ইন্টারফেসের মতো) যা কোনো মেথডের সিগনেচার পয়েন্টারকে নির্দেশ করে।
- একটি **ইভেন্ট** হলো ডেলিগেটের উপর তৈরি একটি **এনক্যাপসুলেশন মডিফায়ার**, যা বাইরের ক্লাসের জন্য শুধুমাত্র \`+=\` (যুক্ত হওয়া) এবং \`-=\` (বিচ্ছিন্ন হওয়া) অ্যাক্সেসর উন্মুক্ত রাখে।

---

## ২. তুলনামূলক আর্কিটেকচারাল ছক

| বৈশিষ্ট্য | সাধারণ ডেলিগেট ফিল্ড (\`public Action MyAction\`) | ইভেন্ট (\`public event Action MyEvent\`) |
| :--- | :--- | :--- |
| **বাইরে থেকে কল করা** | **সম্ভব**: যেকোনো ক্লাস \`MyAction()\` কল করতে পারে। | **অসম্ভব**: কেবল ঘোষণাকারী ক্লাসই ইনভোক করতে পারে। |
| **বাইরে থেকে মুছে ফেলা**| **সম্ভব**: যেকোনো ক্লাস \`MyAction = null\` করতে পারে। | **অসম্ভব**: সরাসরি মান অ্যাসাইন করলে কম্পাইলার এরর দেয়। |
| **অনুমোদিত অপারেটর** | \`=\`, \`+=\`, \`-=\`, \`Invoke()\`, \`GetInvocationList()\` | **কেবল** \`+=\` (সাবস্ক্রাইব) এবং \`-=\` (আনসাবস্ক্রাইব) |
| **ইন্টারফেস সমর্থন** | ইন্টারফেসে সরাসরি ফিল্ড রাখা যায় না। | ইন্টারফেসে ইভেন্ট ঘোষণা করা যায়। |
| **IL রূপান্তর** | পাবলিক ফিল্ড: \`.field public class Action\` | প্রাইভেট ফিল্ড + \`add\` ও \`remove\` মেথড |

---

## ৩. নিরাপত্তা ও এনক্যাপসুলেশন সুরক্ষা

### সাধারণ পাবলিক ডেলিগেটের ঝুঁকি:
\`\`\`csharp
public class StockExchange
{
    // মারাত্মক ভুল: উন্মুক্ত পাবলিক ডেলিগেট ফিল্ড!
    public Action<string, decimal>? PriceChanged;
}

public class BadActor
{
    public void Sabotage(StockExchange exchange)
    {
        // ১. বিপর্যয়: অন্য সবার সাবস্ক্রিপশন এক নিমেষে মুছে ফেলা হলো!
        exchange.PriceChanged = null;

        // ২. বিপর্যয়: নিজের মনগড়া ভুয়া দাম দিয়ে নোটিফিকেশন পাঠানো হলো!
        exchange.PriceChanged?.Invoke("AAPL", 0.01m);
    }
}
\`\`\`

### ইভেন্টের মাধ্যমে সুরক্ষা:
\`\`\`csharp
public class SecureStockExchange
{
    // নিরাপদ: ইভেন্ট এনক্যাপসুলেশন!
    public event Action<string, decimal>? PriceChanged;
}

public class Trader
{
    public void SafeSubscribe(SecureStockExchange exchange)
    {
        // কম্পাইলার এরর CS0070: বাইরের ক্লাস মান মুছতে পারবে না!
        // exchange.PriceChanged = null;

        // কম্পাইলার এরর CS0079: বাইরের ক্লাস সরাসরি ইনভোক করতে পারবে না!
        // exchange.PriceChanged("AAPL", 100m);

        // শুধুমাত্র বৈধ সিনট্যাক্স:
        exchange.PriceChanged += OnPriceUpdated;
    }

    private void OnPriceUpdated(string symbol, decimal price) { }
}
\`\`\`

---

## ৪. কাস্টম ইভেন্ট এক্সেসর (\`add\` / \`remove\`)

প্রোপার্টির যেমন কাস্টম \`get\` ও \`set\` থাকে, ইভেন্টেও তেমনি কাস্টম **\`add\`** এবং **\`remove\`** ব্লক ডিফাইন করে মেমোরি সাশ্রয় করা যায়:

\`\`\`csharp
using System.ComponentModel;

public class UltraLightweightControl
{
    private EventHandlerList _eventList = new EventHandlerList();
    private static readonly object ClickEventKey = new object();

    public event EventHandler Click
    {
        add => _eventList.AddHandler(ClickEventKey, value);
        remove => _eventList.RemoveHandler(ClickEventKey, value);
    }
}
\`\`\`

---

## ৫. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: দ্রুত বাইনারি সার্চ
*সোর্স: কোডফোর্সেস আসসিউত শিট #৩: প্রবলেম Z (Binary Search)*

প্রদত্ত $N$ আকারের একটি অ্যারে $A$ এবং $Q$ সংখ্যক কুয়েরির জন্য প্রতিটি কুয়েরিতে $X$ সংখ্যাটি অ্যারেতে আছে কিনা তা খুঁজে বের করতে হবে।

### সমাধান কৌশল:
১. **সর্টিং**: অ্যারেটিকে $O(N \log N)$ এ সর্ট করা।
২. **বাইনারি সার্চ**: প্রতিটি কুয়েরির জন্য $O(\log N)$ এ বাইনারি সার্চ পরিচালনা করা।
৩. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O((N + Q) \log N)$।
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

        int[] numbers = new int[n];
        string[] arrayTokens = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);

        for (int i = 0; i < n; i++)
        {
            numbers[i] = int.Parse(arrayTokens[i]);
        }

        Array.Sort(numbers);

        for (int i = 0; i < q; i++)
        {
            int query = int.Parse(reader.ReadLine() ?? "0");

            if (BinarySearch(numbers, query))
            {
                writer.WriteLine("found");
            }
            else
            {
                writer.WriteLine("not found");
            }
        }
    }

    private static bool BinarySearch(int[] array, int target)
    {
        int low = 0;
        int high = array.Length - 1;

        while (low <= high)
        {
            int mid = low + ((high - low) >> 1);
            if (array[mid] == target) return true;
            if (array[mid] < target) low = mid + 1;
            else high = mid - 1;
        }

        return false;
    }
}
\`\`\`

---

## ৬. অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Remote Control Competition](https://exercism.org/tracks/csharp/exercises/remote-control-competition) | Medium | Delegate vs Event, Encapsulation |
| ⚪ | Exercism C# | [Building Telemetry](https://exercism.org/tracks/csharp/exercises/building-telemetry) | Medium | Custom Accessors, Access Control |
| ⚪ | Codeforces | [Assiut Sheet #3: Binary Search](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Z) | Easy | Binary Search, Sorting |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Encapsulation, Immutability |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Remote Control Competition",
      url: "https://exercism.org/tracks/csharp/exercises/remote-control-competition",
      difficulty: "MEDIUM",
      company: "Therap (BD) Ltd",
      tags: ["Delegate vs Event", "Encapsulation"],
      solutionEn:
        "Examine why events protect listener collections from external clearing or invocation.",
      solutionBn:
        "কেন ইভেন্ট ব্যবহার করলে লিসেনারদের বাহ্যিক ক্লিয়ারিং বা কল করা থেকে সুরক্ষিত রাখা যায় তা পর্যবেক্ষণ করুন।",
    },
    {
      source: "Exercism C#",
      name: "Building Telemetry",
      url: "https://exercism.org/tracks/csharp/exercises/building-telemetry",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["Events", "Architecture"],
      solutionEn:
        "Enforce safe telemetry communication preventing rogue callers from invoking handlers directly.",
      solutionBn:
        "সরাসরি হ্যান্ডলার কল করা রোধ করে নিরাপদ টেলিমেট্রি যোগাযোগ নিশ্চিত করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Binary Search",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Z",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Binary Search", "Sorting", "Algorithms"],
      solutionEn:
        "Sort input values in O(N log N) time and execute logarithmic binary searches for Q queries.",
      solutionBn:
        "O(N log N) সময়ে সংখ্যাগুলো সর্ট করে প্রতিটি কুয়েরির জন্য বাইনারি সার্চ চালান।",
    },
    {
      source: "Exercism C#",
      name: "High Scores",
      url: "https://exercism.org/tracks/csharp/exercises/high-scores",
      difficulty: "EASY",
      company: "Optimizely",
      tags: ["Encapsulation", "State", "Collections"],
      solutionEn:
        "Maintain game high scores encapsulated against external mutation using immutable list views.",
      solutionBn:
        "ইমিউটেবল ভিউ ব্যবহারের মাধ্যমে গেমের স্কোরবোর্ডকে বাহ্যিক মিউটেশন থেকে সুরক্ষিত রাখুন।",
    },
  ],
};
