import type { LocalLesson } from "@/lib/lessons-data";

export const genericsClassesLesson: LocalLesson = {
  slug: "generics-classes",
  titleEn: "Generic Classes",
  titleBn: "জেনেরিক ক্লাস ও কাস্টম কালেকশন",
  categoryEn: "07. Generics",
  categoryBn: "০৭. জেনেরিকস (Generics)",
  categoryDescEn:
    "Type-safe abstraction in .NET: generic methods, reusable container classes, interface contracts, and compile-time constraints.",
  categoryDescBn:
    ".NET এ টাইপ-নিরাপদ অ্যাবস্ট্রাকশন: জেনেরিক মেথড, পুনঃব্যবহারযোগ্য ক্লাস ও ইন্টারফেস এবং কম্পাইল-টাইম কনস্ট্রেইন্ট।",
  categoryPriority: "CORE",
  descriptionEn:
    "Generic data structures, static field isolation per closed type, memory leak prevention in custom containers, and default(T).",
  descriptionBn:
    "জেনেরিক ডেটা স্ট্রাকচার, টাইপ ভেদে স্ট্যাটিক ফিল্ডের ভিন্নতা, কাস্টম কালেকশনে মেমোরি লিক প্রতিরোধ এবং default(T)।",
  difficulty: "MEDIUM",
  displayOrder: 2,
  prerequisites: ["generics-methods"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Generic Classes & Custom Data Structures in C#

A **generic class** defines a blueprint for a data structure or service that operates uniformly across varying types. Common examples in the .NET Base Class Library include \`List<T>\`, \`Dictionary<TKey, TValue>\`, and \`Queue<T>\`.

---

## The Critical Gotcha: Static Fields in Generic Classes

A classic technical interview question at top tech firms (Enosis, Therap, Brain Station 23):

> **Are static fields shared across different generic type arguments?**
> **Answer: NO!**

In .NET, each closed generic type constructed with a distinct type argument is treated by the CLR as an **entirely separate type**:

\`\`\`csharp
public class CacheStore<T>
{
    public static int HitCount = 0;
}

CacheStore<int>.HitCount++;
CacheStore<int>.HitCount++;

CacheStore<string>.HitCount++;

Console.WriteLine(CacheStore<int>.HitCount);    // 2
Console.WriteLine(CacheStore<string>.HitCount); // 1 (Different memory location!)
\`\`\`

### The Solution for Globally Shared State:
If you need a shared static variable across all instances regardless of \`T\`, place it inside a **non-generic base class**:

\`\`\`csharp
public abstract class CacheStoreBase
{
    public static int GlobalTotalRequests = 0; // Shared across ALL T!
}

public class CacheStore<T> : CacheStoreBase
{
    public void RecordRequest() => GlobalTotalRequests++;
}
\`\`\`

---

## Building a Custom Generic Stack & Preventing GC Leaks

When creating custom generic collections (like stacks, queues, or circular buffers), engineers often introduce a subtle, dangerous **Garbage Collection Memory Leak** ("loitering references"):

\`\`\`csharp
public class CustomStack<T>
{
    private T[] _buffer;
    private int _count;

    public CustomStack(int initialCapacity = 4)
    {
        _buffer = new T[initialCapacity];
        _count = 0;
    }

    public void Push(T item)
    {
        if (_count == _buffer.Length)
        {
            Array.Resize(ref _buffer, _buffer.Length * 2);
        }
        _buffer[_count++] = item;
    }

    public T Pop()
    {
        if (_count == 0) throw new InvalidOperationException("Stack is empty.");

        T item = _buffer[--_count];

        // ⚠️ CRITICAL GC LEAK PREVENTION:
        // If T is a reference type, the array still holds a pointer to the object.
        // We MUST clear the slot so the Garbage Collector can reclaim the memory!
        _buffer[_count] = default!;

        return item;
    }

    public int Count => _count;
}
\`\`\`

---

## Handling \`default(T)\` vs \`default\`

In modern C#, \`default\` returns the default value for type \`T\`:
- **For Reference Types**: Evaluates to \`null\`.
- **For Numeric Value Types**: Evaluates to \`0\` or \`0.0\`.
- **For Booleans**: Evaluates to \`false\`.
- **For Structs**: Evaluates to a zero-initialized instance with all fields set to their respective default values.

---

## Practical Problem Walkthrough

### Problem: Generic Circular Buffer Container
*Implement a high-performance circular buffer that overwrites the oldest element when capacity is exhausted and clears unreferenced slots.*

#### Problem Analysis
- Circular buffers maintain fixed capacity using head and tail index pointers with modulo arithmetic ($(\\text{tail} + 1) \\pmod{\\text{capacity}}$).
- When overwriting or clearing an element, reference slots must be cleared to allow immediate Garbage Collection.

#### C# Implementation

\`\`\`csharp
using System;

public class CircularBuffer<T>
{
    private readonly T[] _buffer;
    private int _head;
    private int _tail;
    private int _count;

    public CircularBuffer(int capacity)
    {
        if (capacity <= 0) throw new ArgumentException("Capacity must be positive.");
        _buffer = new T[capacity];
        _head = 0;
        _tail = 0;
        _count = 0;
    }

    public int Capacity => _buffer.Length;
    public int Count => _count;

    public void Write(T item)
    {
        if (_count == _buffer.Length)
        {
            throw new InvalidOperationException("Buffer is full.");
        }

        _buffer[_tail] = item;
        _tail = (_tail + 1) % _buffer.Length;
        _count++;
    }

    public T Read()
    {
        if (_count == 0)
        {
            throw new InvalidOperationException("Buffer is empty.");
        }

        T item = _buffer[_head];
        _buffer[_head] = default!; // Allow GC reclamation
        _head = (_head + 1) % _buffer.Length;
        _count--;
        return item;
    }
}

public class CircularBufferDemo
{
    public static void Main()
    {
        CircularBuffer<string> logQueue = new CircularBuffer<string>(3);
        logQueue.Write("Log 1: Service started");
        logQueue.Write("Log 2: Request received");

        Console.WriteLine(logQueue.Read()); // Log 1: Service started
        Console.WriteLine($"Remaining count: {logQueue.Count}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$ for both \`Write\` and \`Read\` operations.
- **Space Complexity**: $\\mathcal{O}(\\text{Capacity})$ fixed memory footprint.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | Generic Classes, Modulo Indexing, GC Safety |
| ⚪ | Codeforces Assiut | [Problem L: Max Subarray](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/L) | Easy | Array Inspection, Subarrays, Kadane Logic |
| ⚪ | Codeforces Assiut | [Problem C: Compare](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/C) | Easy | Lexicographical Comparison, Generics |
| ⚪ | Exercism C# | [Custom Set](https://exercism.org/tracks/csharp/exercises/custom-set) | Medium | Generic Collections, Set Theory Operations |
`,

  contentBn: `# C# এ জেনেরিক ক্লাস ও কাস্টম কালেকশন

**জেনেরিক ক্লাস (Generic Class)** এমন একটি ক্লাসের ব্লুপ্রিন্ট যা নির্দিষ্ট কোনো ডেটা টাইপে সীমাবদ্ধ না থেকে বিভিন্ন টাইপের উপাদানের ওপর একই ধরনের অপারেশন পরিচালনা করতে পারে। .NET বেস ক্লাস লাইব্রেরির বহুল ব্যবহৃত \`List<T>\`, \`Dictionary<TKey, TValue>\`, এবং \`Queue<T>\` এর উৎকৃষ্ট উদাহরণ।

---

## গুরুত্বপূর্ণ ইন্টারভিউ ফাঁদ: জেনেরিক ক্লাসে স্ট্যাটিক ফিল্ড

সফটওয়্যার কোম্পানিগুলোর (Enosis, Therap, Brain Station 23) টেকনিক্যাল ইন্টারভিউয়ের একটি জনপ্রিয় প্রশ্ন:

> **বিভিন্ন টাইপের জেনেরিক ইনস্ট্যান্সের মধ্যে কি স্ট্যাটিক ফিল্ড শেয়ার হয়?**
> **উত্তর: কখনোই না!**

.NET CLR প্রতিটি ভিন্ন টাইপ আর্গুমেন্ট দিয়ে তৈরি জেনেরিক ক্লাসকে **সম্পূর্ণ পৃথক একটি টাইপ** হিসেবে গণ্য করে:

\`\`\`csharp
public class CacheStore<T>
{
    public static int HitCount = 0;
}

CacheStore<int>.HitCount++;
CacheStore<int>.HitCount++;

CacheStore<string>.HitCount++;

Console.WriteLine(CacheStore<int>.HitCount);    // 2
Console.WriteLine(CacheStore<string>.HitCount); // 1 (সম্পূর্ণ ভিন্ন মেমোরি লোকেশন!)
\`\`\`

### সব টাইপের জন্য কমন স্ট্যাটিক ভ্যারিয়েবল রাখার উপায়:
যদি আপনার এমন একটি স্ট্যাটিক ফিল্ড প্রয়োজন হয় যা \`T\` এর সকল ভ্যারিয়েন্টের জন্য শেয়ার্ড থাকবে, তবে সেটিকে একটি **নন-জেনেরিক বেস ক্লাসের** ভেতর সংজ্ঞায়িত করতে হবে:

\`\`\`csharp
public abstract class CacheStoreBase
{
    public static int GlobalTotalRequests = 0; // সমস্ত T এর জন্য শেয়ার্ড!
}

public class CacheStore<T> : CacheStoreBase
{
    public void RecordRequest() => GlobalTotalRequests++;
}
\`\`\`

---

## কাস্টম জেনেরিক কালেকশন ও মেমোরি লিক প্রতিরোধ

কাস্টম স্ট্যাক বা বাফার বানানোর সময় ইঞ্জিনিয়াররা প্রায়শই একটি মারাত্মক ভুল করেন, যাকে বলা হয় **Loitering Reference Memory Leak**:

\`\`\`csharp
public class CustomStack<T>
{
    private T[] _buffer;
    private int _count;

    public CustomStack(int initialCapacity = 4)
    {
        _buffer = new T[initialCapacity];
        _count = 0;
    }

    public void Push(T item)
    {
        if (_count == _buffer.Length)
        {
            Array.Resize(ref _buffer, _buffer.Length * 2);
        }
        _buffer[_count++] = item;
    }

    public T Pop()
    {
        if (_count == 0) throw new InvalidOperationException("Stack is empty.");

        T item = _buffer[--_count];

        // ⚠️ মেমোরি লিক প্রতিরোধের অপরিহার্য ধাপ:
        // T যদি রেফারেন্স টাইপ হয়, তবে অ্যারেতে এখনো অবজেক্টটির পয়েন্টার থেকে যায়।
        // তাই স্লটটি default দিয়ে ক্লিয়ার করতে হবে যাতে গার্বেজ কালেক্টর মেমোরি মুক্ত করতে পারে!
        _buffer[_count] = default!;

        return item;
    }

    public int Count => _count;
}
\`\`\`

---

## \`default(T)\` বনাম \`default\`

আধুনিক সি# এ \`default\` কি-ওয়ার্ড টাইপ \`T\` এর ডিফল্ট মান ফিরিয়ে দেয়:
- **রেফারেন্স টাইপের জন্য**: \`null\`।
- **নিউমেরিক ভ্যালু টাইপের জন্য**: \`0\` বা \`0.0\`।
- **বুলিয়ানের জন্য**: \`false\`।
- **স্ট্রাক্টের জন্য**: শূন্য দিয়ে পূর্ণ একটি নতুন ইনস্ট্যান্স।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: কাস্টম জেনেরিক সার্কুলার বাফার
*একটি নির্দিষ্ট ধারণক্ষমতার সার্কুলার বাফার তৈরি করতে হবে যেখানে রিড ও রাইট অপারেশন $O(1)$ সময়ে সম্পন্ন হবে এবং মেমোরি লিক মুক্ত থাকবে।*

#### সমাধান বিশ্লেষণ
- মডুলো পাটিগণিত ($(\\text{tail} + 1) \\pmod{\\text{capacity}}$) দিয়ে বাফারের শুরু ও শেষ ট্র্যাক করা হয়েছে।
- ডেটা রিড করার সময় স্লটটিকে \`default!\` দিয়ে ক্লিয়ার করা হয়েছে যাতে রেফারেন্স টাইপের ক্ষেত্রে মেমোরি লিক না হয়।

#### সি# সমাধান কোড

\`\`\`csharp
using System;

public class CircularBuffer<T>
{
    private readonly T[] _buffer;
    private int _head;
    private int _tail;
    private int _count;

    public CircularBuffer(int capacity)
    {
        if (capacity <= 0) throw new ArgumentException("Capacity must be positive.");
        _buffer = new T[capacity];
        _head = 0;
        _tail = 0;
        _count = 0;
    }

    public int Capacity => _buffer.Length;
    public int Count => _count;

    public void Write(T item)
    {
        if (_count == _buffer.Length)
        {
            throw new InvalidOperationException("Buffer is full.");
        }

        _buffer[_tail] = item;
        _tail = (_tail + 1) % _buffer.Length;
        _count++;
    }

    public T Read()
    {
        if (_count == 0)
        {
            throw new InvalidOperationException("Buffer is empty.");
        }

        T item = _buffer[_head];
        _buffer[_head] = default!; // GC মেমোরি মুক্ত করার সুযোগ তৈরি
        _head = (_head + 1) % _buffer.Length;
        _count--;
        return item;
    }
}

public class CircularBufferDemo
{
    public static void Main()
    {
        CircularBuffer<string> logQueue = new CircularBuffer<string>(3);
        logQueue.Write("Log 1: Service started");
        logQueue.Write("Log 2: Request received");

        Console.WriteLine(logQueue.Read());
        Console.WriteLine($"Remaining count: {logQueue.Count}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ রাইট ও রিড উভয় অপারেশনের জন্য।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(\\text{Capacity})$ নির্দিষ্ট সাইজের বাফার মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | Generic Classes, Modulo Indexing, GC Safety |
| ⚪ | Codeforces Assiut | [Problem L: Max Subarray](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/L) | Easy | Array Inspection, Subarrays, Kadane Logic |
| ⚪ | Codeforces Assiut | [Problem C: Compare](https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/C) | Easy | Lexicographical Comparison, Generics |
| ⚪ | Exercism C# | [Custom Set](https://exercism.org/tracks/csharp/exercises/custom-set) | Medium | Generic Collections, Set Theory Operations |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Circular Buffer",
      url: "https://exercism.org/tracks/csharp/exercises/circular-buffer",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Generics", "Circular Buffer", "Data Structures"],
      solutionEn: "Build a generic circular buffer data structure with write, read, overwrite, and clear operations.",
      solutionBn: "যেকোনো টাইপের ডেটা ধারণে সক্ষম এমন একটি জেনেরিক সার্কুলার বাফার ক্লাস বাস্তবায়ন করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #3",
      name: "Problem L: Max Subarray",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/L",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Arrays", "Subarrays", "Max"],
      solutionEn: "Inspect all contiguous subarrays and print the maximum value of each subarray sequence.",
      solutionBn: "সকল সম্ভাব্য সাব-অ্যারে বিবেচনা করে প্রতিটির সর্বোচ্চ মান নির্ণয় করে প্রিন্ট করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #4",
      name: "Problem C: Compare",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219856/problem/C",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Strings", "Comparison", "Lexicographical"],
      solutionEn: "Determine the lexicographically smaller of two strings using standard character comparison logic.",
      solutionBn: "লেক্সিকোগ্রাফিকাল বা আভিধানিক ক্রম অনুসারে দুটি স্ট্রিংয়ের মধ্যে ক্ষুদ্রতরটি খুঁজে বের করুন।",
    },
    {
      source: "Exercism C#",
      name: "Custom Set",
      url: "https://exercism.org/tracks/csharp/exercises/custom-set",
      difficulty: "MEDIUM",
      company: "Kaz Software",
      tags: ["Generics", "Sets", "Algorithms"],
      solutionEn: "Implement a generic mathematical set supporting union, intersection, difference, and subset checks.",
      solutionBn: "সেট তত্ত্বের ইউনিয়ন, ইন্টারসেকশন ও সাবসেট অপারেশন সমর্থনকারী জেনেরিক সেট ক্লাস তৈরি করুন।",
    },
  ],
};
