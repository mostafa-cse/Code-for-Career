import type { LocalLesson } from "@/lib/lessons-data";

export const collectionsQueueLesson: LocalLesson = {
    slug: "collections-queue",
    titleEn: "Queue<T>",
    titleBn: "কিউ (Queue<T>) ও ফার্স্ট-ইন-ফার্স্ট-আউট (FIFO)",
    categoryEn: "03. Collections",
    categoryBn: "০৩. কালেকশনস ও ডেটা স্ট্রাকচার",
    categoryDescEn:
      "Essential data structures in .NET: fixed arrays, dynamic lists, hash-based sets and dictionaries, and FIFO/LIFO queues.",
    categoryDescBn:
      ".NET এর অপরিহার্য ডেটা স্ট্রাকচার: ফিক্সড অ্যারে, ডায়নামিক লিস্ট, হ্যাশ ডিকশনারি, সেট এবং কিউ/স্ট্যাক।",
    categoryPriority: "NORMAL",
    descriptionEn:
      "FIFO queuing semantics, circular array buffer implementation, O(1) Enqueue and Dequeue, Breadth-First Search (BFS), and PriorityQueue.",
    descriptionBn:
      "ফিফো (FIFO) কাঠামো, সার্কুলার অ্যারে বাফার বাস্তবায়ন, Enqueue ও Dequeue এর ধ্রুবক O(1) গতি, ব্রেডথ-ফার্স্ট সার্চ (BFS) এবং PriorityQueue।",
    difficulty: "EASY",
    displayOrder: 5,
    prerequisites: ["collections-list"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# Queue<T> in C#

\`System.Collections.Generic.Queue<T>\` represents a **First-In, First-Out (FIFO)** collection of elements. The first element added is the first element removed, modeling real-world arrival lines, task dispatchers, and breadth-first search algorithms.

---

## 1. Internal Architecture: The Circular Ring Buffer

A naive implementation of a queue on top of a standard array would require shifting all remaining items left by one slot on every dequeue, degrading \`Dequeue()\` to an unacceptable $O(N)$ operation.

To achieve **constant $O(1)$ time for both additions and removals**, .NET implements \`Queue<T>\` as a **circular array buffer**:
- \`T[] _array\`: The underlying storage array.
- \`int _head\`: Index of the oldest element ready to be dequeued.
- \`int _tail\`: Index of the next free position for enqueuing.
- \`int _size\`: Current count of active elements.

\`\`\`
Enqueued items wrap around the physical array boundaries using modulo arithmetic:
Index = (Index + 1) % _array.Length

Physical Array:  [ Elem 3 | Elem 4 | null | null | Elem 0 | Elem 1 | Elem 2 ]
                               ▲                     ▲
                               │                     │
                             _tail (Index 2)       _head (Index 4)
\`\`\`

### Buffer Unrolling on Expansion
When \`_size == _array.Length\`, the circular array is full. The CLR allocates a doubled array ($2 \\times C$) and **unrolls the circular segments linearly** into the new array, resetting \`_head = 0\` and \`_tail = _size\`.

---

## 2. Core Operations & Time Complexities

| Operation | Method | Time Complexity | Throws if Empty? |
|---|---|---|---|
| **Add to Back** | \`Enqueue(item)\` | **$O(1)$ Amortized** | No |
| **Remove from Front** | \`Dequeue()\` | **$O(1)$** | **Yes** (\`InvalidOperationException\`) |
| **Inspect Front** | \`Peek()\` | **$O(1)$** | **Yes** (\`InvalidOperationException\`) |
| **Safe Remove** | \`TryDequeue(out item)\` | **$O(1)$** | **No** (returns \`false\`) |
| **Safe Inspect** | \`TryPeek(out item)\` | **$O(1)$** | **No** (returns \`false\`) |
| **Search** | \`Contains(item)\` | **$O(N)$** | No |

---

## 3. Production Patterns & Canonical Use Cases

### A. Safe Consumer Dequeuing Loop
Always prefer \`TryDequeue\` in consumer loops to eliminate exception overhead when the queue runs dry:

\`\`\`csharp
Queue<string> taskQueue = new Queue<string>();
taskQueue.Enqueue("Process_Invoice_101");
taskQueue.Enqueue("Send_Notification_202");

while (taskQueue.TryDequeue(out string? task))
{
    Console.WriteLine($"Executing: {task} | Pending: {taskQueue.Count}");
}
\`\`\`

### B. Graph / Tree Breadth-First Search (BFS)
Queues are the foundational data structure behind level-order tree exploration and shortest-path graph traversals:

\`\`\`csharp
public class TreeNode
{
    public int Value;
    public TreeNode? Left;
    public TreeNode? Right;
}

public void LevelOrderTraversal(TreeNode root)
{
    if (root == null) return;

    Queue<TreeNode> queue = new Queue<TreeNode>();
    queue.Enqueue(root);

    while (queue.Count > 0)
    {
        TreeNode current = queue.Dequeue();
        Console.Write($"{current.Value} ");

        if (current.Left != null) queue.Enqueue(current.Left);
        if (current.Right != null) queue.Enqueue(current.Right);
    }
    Console.WriteLine();
}
\`\`\`

---

## 4. Modern .NET: Queue<T> vs PriorityQueue<TElement, TPriority>

Introduced in .NET 6, \`PriorityQueue<TElement, TPriority>\` satisfies scenarios where elements must be processed based on priority rather than strict arrival time:

\`\`\`csharp
// Min-heap priority queue: lower priority number dequeues FIRST
var priorityQueue = new PriorityQueue<string, int>();

priorityQueue.Enqueue("Standard Bug Report", 3);
priorityQueue.Enqueue("Production Outage Alert", 1); // Highest priority!
priorityQueue.Enqueue("Feature Request", 5);

while (priorityQueue.TryDequeue(out string? task, out int priority))
{
    Console.WriteLine($"[P{priority}] {task}");
}
// Outputs:
// [P1] Production Outage Alert
// [P3] Standard Bug Report
// [P5] Feature Request
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Sliding Window Task Processor
*Source: Exercism C# Track — Circular Buffer / Queue Simulation*

**Problem Statement**:
Implement a rate-limited task processor that buffers incoming tasks. If the active queue reaches capacity $K$, dequeue and process the oldest task before accommodating the new task.

### C# Solution:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class TaskBatchProcessor
{
    private readonly int _maxBatchSize;
    private readonly Queue<string> _buffer;

    public TaskBatchProcessor(int maxBatchSize)
    {
        _maxBatchSize = maxBatchSize;
        _buffer = new Queue<string>(maxBatchSize);
    }

    public void EnqueueTask(string taskId)
    {
        if (_buffer.Count == _maxBatchSize)
        {
            string evicted = _buffer.Dequeue();
            Console.WriteLine($"Batch full! Dispatched oldest task: {evicted}");
        }

        _buffer.Enqueue(taskId);
        Console.WriteLine($"Enqueued task: {taskId} (Current buffer: {_buffer.Count}/{_maxBatchSize})");
    }

    public void FlushAll()
    {
        while (_buffer.TryDequeue(out string? task))
        {
            Console.WriteLine($"Flushing task: {task}");
        }
    }
}

public class Program
{
    public static void Main()
    {
        var processor = new TaskBatchProcessor(3);

        processor.EnqueueTask("Task-A");
        processor.EnqueueTask("Task-B");
        processor.EnqueueTask("Task-C");
        processor.EnqueueTask("Task-D"); // Triggers eviction of Task-A

        processor.FlushAll();
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(1)$ per \`EnqueueTask\` invocation — constant-time circular buffer operations.
- **Space Complexity**: $O(K)$ — where $K$ is the maximum bounded capacity of the buffer.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | Circular queue design, Ring buffer |
| ⚪ | Codeforces Assiut | [Problem Y: Range sum query](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Y) | Medium | Buffer state, Window sums |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Easy | Transaction FIFO queue, Concurrency |
| ⚪ | Codeforces Assiut | [Problem B: Searching](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B) | Easy | Array lookup, Queue emulation |
`,

    contentBn: `# C# এ কিউ (Queue<T>) ও ফার্স্ট-ইন-ফার্স্ট-আউট (FIFO)

\`System.Collections.Generic.Queue<T>\` হলো একটি **ফার্স্ট-ইন, ফার্স্ট-আউট (First-In, First-Out বা FIFO)** ডেটা স্ট্রাকচার। যে উপাদানটি সবার প্রথমে প্রবেশ করে, সেটিই সবার প্রথমে বের হয়। এটি বাস্তব জীবনের লাইনের মতো, যেমন টিকিট কাউন্টার, প্রিন্টার স্পুলার বা নেটওয়ার্ক মেসেজ প্রসেসর।

---

## ১. অভ্যন্তরীণ আর্কিটেকচার: সার্কুলার রিং বাফার

সাধারণ অ্যারেতে কিউ বাস্তবায়ন করলে প্রতিবার \`Dequeue()\` করার পর বাকি সমস্ত উপাদানকে এক ঘর করে বামে সরাতে হতো, যার ফলে প্রতি অপসারণে $O(N)$ সময় নষ্ট হতো।

.NET এই সমস্যা সমাধান করতে \`Queue<T>\` কে একটি **সার্কুলার অ্যারে বাফার (Circular Ring Buffer)** হিসেবে তৈরি করেছে:
- \`T[] _array\`: মূল স্টোরেজ অ্যারে।
- \`int _head\`: যে উপাদানটি সবার আগে বের হবে তার ইনডেক্স।
- \`int _tail\`: নতুন উপাদান যুক্ত হওয়ার খালি স্লট ইনডেক্স।
- \`int _size\`: বর্তমান উপাদানের সংখ্যা।

ইনডেক্স সীমা অতিক্রম করলে মডুলাস পাটিগণিতের (\`(index + 1) % capacity\`) মাধ্যমে ইনডেক্সটি ঘুরে আবার অ্যারের শুরুতে চলে আসে। এর ফলে উপাদান না সরিয়েই **$O(1)$ সময়ে Dequeue সম্পন্ন হয়**।

### মেমোরি আনরোলিং (Buffer Unrolling)
অ্যারে পূর্ণ হয়ে গেলে ($Count == Capacity$) দ্বিগুণ আকারের নতুন অ্যারে নেওয়া হয় এবং পেছনের ও সামনের উপাদানগুলোকে সোজা করে নতুন অ্যারেতে ক্রমানুসারে সাজিয়ে দেওয়া হয়।

---

## ২. প্রধান অপারেশন ও সময় জটিলতা

| অপারেশন | মেথড | সময় জটিলতা | খালি থাকলে এরর দেয়? |
|---|---|---|---|
| **পেছনে যোগ করা** | \`Enqueue(item)\` | **$O(1)$ Amortized** | না |
| **সামনে থেকে বের করা** | \`Dequeue()\` | **$O(1)$** | **হ্যাঁ** (\`InvalidOperationException\`) |
| **সামনের উপাদান দেখা** | \`Peek()\` | **$O(1)$** | **হ্যাঁ** (\`InvalidOperationException\`) |
| **নিরাপদ অপসারণ** | \`TryDequeue(out item)\` | **$O(1)$** | **না** (\`false\` রিটার্ন করে) |
| **নিরাপদ পিক** | \`TryPeek(out item)\` | **$O(1)$** | **না** (\`false\` রিটার্ন করে) |
| **লিনিয়ার সার্চ** | \`Contains(item)\` | **$O(N)$** | না |

---

## ৩. সফটওয়্যার ইঞ্জিনিয়ারিংয়ে কিউ এর ব্যবহার

### ক. নিরাপদ কনজিউমার লুপ
খালি কিউ থেকে উপাদান তোলার সময় এক্সেপশন এড়াতে সর্বদা \`TryDequeue\` ব্যবহার করা উচিত:

\`\`\`csharp
Queue<string> taskQueue = new Queue<string>();
taskQueue.Enqueue("Process_Invoice_101");
taskQueue.Enqueue("Send_Notification_202");

while (taskQueue.TryDequeue(out string? task))
{
    Console.WriteLine($"Executing: {task} | Pending: {taskQueue.Count}");
}
\`\`\`

### খ. ব্রেডথ-ফার্স্ট সার্চ (Breadth-First Search - BFS)
গ্রাফ ও ট্রি-এর লেভেল-বাই-লেভেল ট্রাভার্সাল এবং শর্টেস্ট-পাথ অ্যালগরিদমে কিউ অপরিহার্য:

\`\`\`csharp
public class TreeNode
{
    public int Value;
    public TreeNode? Left;
    public TreeNode? Right;
}

public void LevelOrderTraversal(TreeNode root)
{
    if (root == null) return;

    Queue<TreeNode> queue = new Queue<TreeNode>();
    queue.Enqueue(root);

    while (queue.Count > 0)
    {
        TreeNode current = queue.Dequeue();
        Console.Write($"{current.Value} ");

        if (current.Left != null) queue.Enqueue(current.Left);
        if (current.Right != null) queue.Enqueue(current.Right);
    }
    Console.WriteLine();
}
\`\`\`

---

## ৪. আধুনিক .NET: Queue<T> বনাম PriorityQueue<TElement, TPriority>

.NET 6 এ প্রবর্তিত \`PriorityQueue\` অগ্রাধিকারের ভিত্তিতে ডেটা প্রসেস করার সুবিধা দেয় (মিন-হিপ ভিত্তিক):

\`\`\`csharp
var priorityQueue = new PriorityQueue<string, int>();

priorityQueue.Enqueue("Standard Bug Report", 3);
priorityQueue.Enqueue("Production Outage Alert", 1); // সর্বোচ্চ অগ্রাধিকার!

while (priorityQueue.TryDequeue(out string? task, out int priority))
{
    Console.WriteLine($"[P{priority}] {task}");
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: স্লাইডিং উইন্ডো টাস্ক প্রসেসর
*উৎস: এক্সারসিজম সি# ট্র্যাক — Circular Buffer / Queue Simulation*

**সমস্যা পরিচিতি**:
একটি নির্দিষ্ট বাফার সাইজের $K$ টাস্ক প্রসেসর তৈরি করুন। বাফার পূর্ণ হয়ে গেলে নতুন টাস্ক যোগ করার পূর্বে সবচেয়ে পুরাতন টাস্কটিকে স্বয়ংক্রিয়ভাবে ডিসপ্যাচ করতে হবে।

### সি# সমাধান:

\`\`\`csharp
using System;
using System.Collections.Generic;

public class TaskBatchProcessor
{
    private readonly int _maxBatchSize;
    private readonly Queue<string> _buffer;

    public TaskBatchProcessor(int maxBatchSize)
    {
        _maxBatchSize = maxBatchSize;
        _buffer = new Queue<string>(maxBatchSize);
    }

    public void EnqueueTask(string taskId)
    {
        if (_buffer.Count == _maxBatchSize)
        {
            string evicted = _buffer.Dequeue();
            Console.WriteLine($"Batch full! Dispatched oldest task: {evicted}");
        }

        _buffer.Enqueue(taskId);
        Console.WriteLine($"Enqueued task: {taskId} (Current buffer: {_buffer.Count}/{_maxBatchSize})");
    }

    public void FlushAll()
    {
        while (_buffer.TryDequeue(out string? task))
        {
            Console.WriteLine($"Flushing task: {task}");
        }
    }
}

public class Program
{
    public static void Main()
    {
        var processor = new TaskBatchProcessor(3);

        processor.EnqueueTask("Task-A");
        processor.EnqueueTask("Task-B");
        processor.EnqueueTask("Task-C");
        processor.EnqueueTask("Task-D"); // Task-A বের করে দিবে

        processor.FlushAll();
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: প্রতি অপারেশনে $O(1)$ — সার্কুলার অ্যারে পয়েন্টার আপডেট।
- **স্পেস কমপ্লেক্সিটি**: $O(K)$ — যেখানে $K$ হলো সর্বোচ্চ বাফার সাইজ।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Circular Buffer](https://exercism.org/tracks/csharp/exercises/circular-buffer) | Medium | Circular queue design, Ring buffer |
| ⚪ | Codeforces Assiut | [Problem Y: Range sum query](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Y) | Medium | Buffer state, Window sums |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Easy | Transaction FIFO queue, Concurrency |
| ⚪ | Codeforces Assiut | [Problem B: Searching](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B) | Easy | Array lookup, Queue emulation |
`,
    resources: [],
    problems: [
      {
        source: "Exercism C#",
        name: "Circular Buffer",
        url: "https://exercism.org/tracks/csharp/exercises/circular-buffer",
        difficulty: "MEDIUM",
        company: "Enosis Solutions",
        tags: ["Queue", "Circular Buffer", "Data Structures"],
        solutionEn: "Implement a circular buffer wrapping reader/writer indices around fixed-size storage.",
        solutionBn: "নির্দিষ্ট আকারের অ্যারেতে রিডার ও রাইটার ইনডেক্স ঘুরিয়ে সার্কুলার বাফার তৈরি করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem Y: Range sum query",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Y",
        difficulty: "MEDIUM",
        company: "Brain Station 23",
        tags: ["Queue", "Prefix Sum", "Arrays"],
        solutionEn: "Maintain cumulative sums to answer range queries in O(1) time.",
        solutionBn: "প্রিফিক্স সাম অ্যারে প্রসেস করে O(1) সময়ে যেকোনো রেঞ্জের যোগফল বের করুন।",
      },
      {
        source: "Exercism C#",
        name: "Bank Account",
        url: "https://exercism.org/tracks/csharp/exercises/bank-account",
        difficulty: "EASY",
        company: null,
        tags: ["Queue", "State", "Concurrency"],
        solutionEn: "Process incoming account transactions sequentially while managing open/closed states.",
        solutionBn: "অ্যাকাউন্টের স্টেট ম্যানেজ করে ধারাবাহিকভাবে ট্রানজেকশন প্রসেস করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem B: Searching",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/B",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Queue", "Linear Search"],
        solutionEn: "Inspect incoming sequence items in arrival order to find target index.",
        solutionBn: "উপাদানসমূহ ক্রমানুসারে স্ক্যান করে টার্গেট সংখ্যার ইনডেক্স খুঁজে বের করুন।",
      },
    ],
  };
