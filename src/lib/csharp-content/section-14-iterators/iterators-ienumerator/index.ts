import type { LocalLesson } from "@/lib/lessons-data";

export const iteratorsIenumeratorLesson: LocalLesson = {
  slug: "iterators-ienumerator",
  titleEn: "IEnumerator Under the Hood",
  titleBn: "আই-ইনুমারেটর (IEnumerator) এর অভ্যন্তরীণ গঠন",
  categoryEn: "14. Iterators",
  categoryBn: "১৪. আইটারেটর ও ইল্ড (Iterators & yield)",
  categoryDescEn:
    "Sequence iteration in C#: IEnumerable, IEnumerator state machines, lazy generation with yield return, and memory management.",
  categoryDescBn:
    ".NET এ আইটারেশন মেকানিজম: IEnumerable, IEnumerator স্টেট মেশিন, yield return দিয়ে অলস ডেটা জেনারেশন ও মেমোরি নিয়ন্ত্রণ।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "The 4-stage enumerator lifecycle, fail-fast concurrent modification versioning, and constructing zero-allocation custom enumerators.",
  descriptionBn:
    "এনিউমারেটরের ৪-পর্যায়ের জীবনচক্র, ফেইল-ফাস্ট কনকারেন্ট মডিফিকেশন ভার্সনিং এবং জিরো-অ্যালোকেশন কাস্টম এনিউমারেটর তৈরি।",
  difficulty: "MEDIUM",
  displayOrder: 2,
  prerequisites: ["iterators-ienumerable"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# IEnumerator Under the Hood in C#

While \`IEnumerable<T>\` advertises that a collection can be traversed, **\`IEnumerator<T>\` is the engine that actually performs the traversal**. It encapsulates the cursor state, boundary detection, and resource cleanup logic.

---

## The 4-Stage Enumerator Lifecycle

Every standard .NET enumerator moves through four deterministic states during its operational life:

\`\`\`
  [1. Initial State] ─── MoveNext() == true ───► [2. Active Traversal]
   Position: -1                                    Position: 0, 1, ..., N-1
   Current: Undefined                              Current: Valid Element
                                                           │
                                                   MoveNext() == false
                                                           │
                                                           ▼
  [4. Disposed State] ◄─── Dispose() ─────────── [3. Exhausted State]
   Resources Freed                                 Position: Past end (N)
   Calls Throw ObjectDisposedException             Current: Undefined
\`\`\`

1. **Initial State (Before First Item)**: Position is indexed before the first element (conceptually index \`-1\`). Calling \`Current\` is undefined and throws \`InvalidOperationException\`.
2. **Active Traversal**: \`MoveNext()\` returns \`true\` and advances the cursor. \`Current\` yields the active item.
3. **Exhausted State (Past the End)**: When the sequence ends, \`MoveNext()\` returns \`false\`. Subsequent calls to \`MoveNext()\` continue returning \`false\`.
4. **Disposed State**: The consumer calls \`Dispose()\`. File handles, network sockets, or buffer arrays are closed and reclaimed.

---

## The Fail-Fast Concurrent Modification Mechanism

Have you ever encountered this runtime exception?
> \`System.InvalidOperationException: Collection was modified; enumeration operation may not execute.\`

This safety guard is implemented via **internal collection versioning**:

\`\`\`csharp
// Conceptual representation inside List<T> and List<T>.Enumerator
public class List<T>
{
    internal int _version; // Incremented on every mutation!

    public void Add(T item)
    {
        _version++; // Mutation increments version
        ...
    }

    public struct Enumerator : IEnumerator<T>
    {
        private readonly List<T> _list;
        private readonly int _version; // Snapshotted upon creation

        internal Enumerator(List<T> list)
        {
            _list = list;
            _version = list._version;
        }

        public bool MoveNext()
        {
            // Fail-fast guard: detects structural mutations during iteration
            if (_version != _list._version)
            {
                throw new InvalidOperationException(
                    "Collection was modified; enumeration operation may not execute.");
            }
            ...
        }
    }
}
\`\`\`

### Why Fail-Fast Matters:
If a list allowed adding or deleting elements while an active cursor was traversing its internal array:
- Element indices would shift, causing elements to be processed twice or skipped entirely.
- The cursor could walk past the allocated array bounds, triggering memory access corruption.

---

## Constructing a Custom Zero-Allocation Struct Enumerator

When building custom high-performance data structures (e.g. Ring Buffers, Circular Queues), implement an enumerator as a \`struct\` to avoid allocating an object on the garbage-collected heap:

\`\`\`csharp
public sealed class CircularBuffer<T> : IEnumerable<T>
{
    private readonly T[] _buffer;
    private readonly int _count;

    public CircularBuffer(T[] items)
    {
        _buffer = items;
        _count = items.Length;
    }

    public Enumerator GetEnumerator() => new Enumerator(this);

    IEnumerator<T> IEnumerable<T>.GetEnumerator() => GetEnumerator();
    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => GetEnumerator();

    // Zero-allocation stack struct enumerator
    public struct Enumerator : IEnumerator<T>
    {
        private readonly CircularBuffer<T> _source;
        private int _index;
        private T? _current;

        internal Enumerator(CircularBuffer<T> source)
        {
            _source = source;
            _index = 0;
            _current = default;
        }

        public readonly T Current => _current!;
        readonly object? System.Collections.IEnumerator.Current => Current;

        public bool MoveNext()
        {
            if (_index < _source._count)
            {
                _current = _source._buffer[_index];
                _index++;
                return true;
            }

            _current = default;
            return false;
        }

        public void Reset()
        {
            _index = 0;
            _current = default;
        }

        public readonly void Dispose() { }
    }
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #3 Problem E (Lowest Number)
*Given a number $N$ and an array $A$. Find the minimum number in the array and its 1-based position (index).*

#### Algorithmic Analysis
1. Read $N$ and the space-delimited array elements.
2. Maintain tracking variables for \`minValue\` and \`minPosition\` (1-based).
3. Traverse through elements sequentially, updating tracking variables when a strictly smaller value is found.

#### C# Implementation

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (tokens.Length == 0) return;

        int minValue = int.MaxValue;
        int minPosition = 1;
        int currentPosition = 1;

        IEnumerator<string> enumerator = ((IEnumerable<string>)tokens).GetEnumerator();
        try
        {
            while (enumerator.MoveNext())
            {
                if (int.TryParse(enumerator.Current, out int currentVal))
                {
                    if (currentVal < minValue)
                    {
                        minValue = currentVal;
                        minPosition = currentPosition;
                    }
                }
                currentPosition++;
            }
        }
        finally
        {
            enumerator.Dispose();
        }

        Console.WriteLine($"{minValue} {minPosition}");
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(N)$, single-pass linear scan across the sequence.
- **Space Complexity**: $\\mathcal{O}(N)$ for the token storage buffer, with $\\mathcal{O}(1)$ cursor state memory.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | Linear cursor scan, Minimum position tracking |
| ⚪ | Codeforces | [Assiut Sheet #3: Positions in Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/D) | Easy | Element matching, Sequential position filters |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | State machine cursor, Buffer wrap-around |
| ⚪ | Exercism C# | [Simple Linked List](https://exercism.org/tracks/csharp/exercises/simple-linked-list) | Medium | Custom linked list node iteration |
`,

  contentBn: `# C# এ আই-ইনুমারেটর (IEnumerator) এর অভ্যন্তরীণ গঠন

\`IEnumerable<T>\` যেখানে কেবল কালেকশনের লুপ চালানোর সক্ষমতা প্রকাশ করে, সেখানে **\`IEnumerator<T>\` হলো সেই ইঞ্জিন যা বাস্তবে ট্রাভার্সাল পরিচালনা করে**। এটি কার্সারের বর্তমান অবস্থান, বাউন্ডারি যাচাই এবং রিসোর্স মুক্ত করার দায়িত্ব পালন করে।

---

## এনিউমারেটরের ৪-পর্যায়ের জীবনচক্র (4-Stage Lifecycle)

প্রতিটি প্রমিত .NET এনিউমারেটর তার কার্যকালে চারটি নির্দিষ্ট দশার মধ্য দিয়ে যায়:

\`\`\`
  [১. প্রাথমিক অবস্থা] ─── MoveNext() == true ───► [২. সক্রিয় আইটারেশন]
   ইনডেক্স: -১                                    ইনডেক্স: ০, ১, ..., N-১
   Current: অনির্ধারিত                            Current: বর্তমান উপাদান
                                                           │
                                                   MoveNext() == false
                                                           │
                                                           ▼
  [৪. সমাপ্ত অবস্থা] ◄─── Dispose() ───────────── [৩. সমাপ্তি পর্যায়]
   রিসোর্স মুক্ত                                 ইনডেক্স: শেষ সীমার বাইরে
   কল করলে এক্সেপশন হয়                           Current: অনির্ধারিত
\`\`\`

১. **প্রাথমিক অবস্থা (Initial State)**: কার্সার প্রথম উপাদানের আগে (কাল্পনিক ইনডেক্স \`-1\`) অবস্থান করে। এই অবস্থায় \`Current\` রিড করলে \`InvalidOperationException\` ঘটে।
২. **সক্রিয় আইটারেশন (Active Traversal)**: \`MoveNext()\` মেথড \`true\` রিটার্ন করে কার্সার এক ধাপ এগিয়ে নেয় এবং \`Current\` বর্তমান উপাদান প্রদান করে।
৩. **সমাপ্তি পর্যায় (Exhausted State)**: কালেকশনের শেষ প্রান্তে পৌঁছে গেলে \`MoveNext()\` মেথড \`false\` রিটার্ন করে। এরপর বারবার কল করলেও \`false\` দিতে থাকে।
৪. **রিসোর্স মুক্ত অবস্থা (Disposed State)**: কলার \`Dispose()\` কল করলে মেমোরি, ফাইল হ্যান্ডেল বা নেটওয়ার্ক কানেকশন বন্ধ হয়ে যায়।

---

## ফেইল-ফাস্ট কনকারেন্ট মডিফিকেশন মেকানিজম

লুপ ঘোরার সময় কালেকশনে ডেটা পরিবর্তন করলে এই পরিচিত এক্সেপশনটি দেখা যায়:
> \`System.InvalidOperationException: Collection was modified; enumeration operation may not execute.\`

এই নিরাপত্তা সুরক্ষাটি নিশ্চিত করা হয় **অভ্যন্তরীণ কালেকশন ভার্সনিং (Versioning)** এর মাধ্যমে:

\`\`\`csharp
// List<T> ও List<T>.Enumerator এর অভ্যন্তরীণ গঠন
public class List<T>
{
    internal int _version; // কালেকশন পরিবর্তন হলেই বাড়ে!

    public void Add(T item)
    {
        _version++; // মান যুক্ত করলে ভার্সন বৃদ্ধি পায়
        ...
    }

    public struct Enumerator : IEnumerator<T>
    {
        private readonly List<T> _list;
        private readonly int _version; // তৈরির সময়ের ভার্সন স্ন্যাপশট

        internal Enumerator(List<T> list)
        {
            _list = list;
            _version = list._version;
        }

        public bool MoveNext()
        {
            // ফেইল-ফাস্ট চেক: লুপ চলাকালীন ডেটা বদলানো হয়েছে কি না
            if (_version != _list._version)
            {
                throw new InvalidOperationException(
                    "Collection was modified; enumeration operation may not execute.");
            }
            ...
        }
    }
}
\`\`\`

### কেন এই ফেইল-ফাস্ট ব্যবস্থা জরুরি:
লুপ চলার সময় উপাদান যোগ বা বিয়োগ করার অনুমতি দিলে:
- উপাদানের ইনডেক্স ওলটপালট হয়ে যেত, ফলে কোনো উপাদান বাদ পড়ত বা একই উপাদান দুইবার প্রসেস হতো।
- কার্সার মেমোরি সীমার বাইরে চলে গিয়ে সিস্টেম ক্র্যাশ করাতে পারত।

---

## জিরো-অ্যালোকেশন কাস্টম স্ট্রাক্ট এনিউমারেটর তৈরি

সার্কুলার বাফার বা রিং কিউ-এর মতো হাই-পারফরম্যান্স ডেটা স্ট্রাকচার তৈরি করার সময় এনিউমারেটরটিকে ক্লাস না বানিয়ে \`struct\` হিসেবে বানালে হিপ মেমোরিতে কোনো আবর্জনা (GC Pressure) তৈরি হয় না:

\`\`\`csharp
public sealed class CircularBuffer<T> : IEnumerable<T>
{
    private readonly T[] _buffer;
    private readonly int _count;

    public CircularBuffer(T[] items)
    {
        _buffer = items;
        _count = items.Length;
    }

    public Enumerator GetEnumerator() => new Enumerator(this);

    IEnumerator<T> IEnumerable<T>.GetEnumerator() => GetEnumerator();
    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => GetEnumerator();

    // স্ট্যাক-অ্যালোকেটেড জিরো-ওভারহেড স্ট্রাক্ট এনিউমারেটর
    public struct Enumerator : IEnumerator<T>
    {
        private readonly CircularBuffer<T> _source;
        private int _index;
        private T? _current;

        internal Enumerator(CircularBuffer<T> source)
        {
            _source = source;
            _index = 0;
            _current = default;
        }

        public readonly T Current => _current!;
        readonly object? System.Collections.IEnumerator.Current => Current;

        public bool MoveNext()
        {
            if (_index < _source._count)
            {
                _current = _source._buffer[_index];
                _index++;
                return true;
            }

            _current = default;
            return false;
        }

        public void Reset()
        {
            _index = 0;
            _current = default;
        }

        public readonly void Dispose() { }
    }
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #3 Problem E (Lowest Number)
*একটি সংখ্যা $N$ এবং একটি অ্যারে $A$ দেওয়া থাকবে। অ্যারের ক্ষুদ্রতম সংখ্যাটি এবং তার ১-ভিত্তিক পজিশন নির্ণয় করুন।*

#### সমাধান বিশ্লেষণ
১. ইনপুট থেকে সংখ্যাগুলো রিড করা।
২. ক্ষুদ্রতম মান এবং তার পজিশন সংরক্ষণে দুটি ট্র্যাকিং ভেরিয়েবল রাখা।
৩. সিকোয়েন্সটি একবার লিনিয়ার স্ক্যান করে ক্ষুদ্রতর কোনো সংখ্যা পেলে মান ও পজিশন আপডেট করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        string? nLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(nLine)) return;

        string? arrayLine = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(arrayLine)) return;

        string[] tokens = arrayLine.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (tokens.Length == 0) return;

        int minValue = int.MaxValue;
        int minPosition = 1;
        int currentPosition = 1;

        IEnumerator<string> enumerator = ((IEnumerable<string>)tokens).GetEnumerator();
        try
        {
            while (enumerator.MoveNext())
            {
                if (int.TryParse(enumerator.Current, out int currentVal))
                {
                    if (currentVal < minValue)
                    {
                        minValue = currentVal;
                        minPosition = currentPosition;
                    }
                }
                currentPosition++;
            }
        }
        finally
        {
            enumerator.Dispose();
        }

        Console.WriteLine($"{minValue} {minPosition}");
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(N)$, পুরো সিকোয়েন্স একক পাসে স্ক্যান করে।
- **স্পেস কমপ্লেক্সিটি**: টোকেন অ্যারে সংরক্ষণে $\\mathcal{O}(N)$, এবং কার্সার ভেরিয়েবলে $\\mathcal{O}(1)$ মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | Linear cursor scan, Minimum position tracking |
| ⚪ | Codeforces | [Assiut Sheet #3: Positions in Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/D) | Easy | Element matching, Sequential position filters |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | State machine cursor, Buffer wrap-around |
| ⚪ | Exercism C# | [Simple Linked List](https://exercism.org/tracks/csharp/exercises/simple-linked-list) | Medium | Custom linked list node iteration |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Lowest Number",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Array", "IEnumerator", "Min"],
      solutionEn:
        "Perform a single linear scan to identify the minimum value and its 1-based position in the array.",
      solutionBn:
        "অ্যারেতে একক লিনিয়ার স্ক্যান চালিয়ে সর্বনিম্ন মান এবং তার ১-ভিত্তিক পজিশন নির্ণয় করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Positions in Array",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/D",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Array", "Filtering", "Positions"],
      solutionEn:
        "Iterate through array elements and print all positions and values that are less than or equal to 10.",
      solutionBn:
        "অ্যারে উপাদানগুলোর মধ্যে লুপ চালিয়ে ১০ বা তার ছোট সমস্ত মান এবং তাদের পজিশন প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Circular Buffer",
      url: "https://exercism.org/tracks/csharp/exercises/circular-buffer",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["Data Structure", "IEnumerator", "Buffer"],
      solutionEn:
        "Construct a fixed-size circular buffer supporting read, write, and overwrite operations with pointer wrap-around.",
      solutionBn:
        "পয়েন্টার ওভাররাইট সমর্থনকারী একটি নির্দিষ্ট আকারের সার্কুলার বাফার ডেটা স্ট্রাকচার তৈরি করুন।",
    },
    {
      source: "Exercism C#",
      name: "Simple Linked List",
      url: "https://exercism.org/tracks/csharp/exercises/simple-linked-list",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["Linked List", "IEnumerator", "Generics"],
      solutionEn:
        "Implement a singly linked list from scratch providing custom forward iteration and reverse construction.",
      solutionBn:
        "কাস্টম ফরওয়ার্ড আইটারেশন সমর্থনকারী একটি সিংগলি লিঙ্কড লিস্ট শুরু থেকে তৈরি করুন।",
    },
  ],
};
