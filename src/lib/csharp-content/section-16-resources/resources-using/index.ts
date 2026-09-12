import type { LocalLesson } from "@/lib/lessons-data";

export const resourcesUsingLesson: LocalLesson = {
  slug: "resources-using",
  titleEn: "using Statement & using Declaration (C# 8)",
  titleBn: "ইউজিং (using) স্টেটমেন্ট ও সি# ৮ ইউজিং ডিক্লারেশন",
  categoryEn: "16. Resource Management",
  categoryBn: "১৬. রিসোর্স ম্যানেজমেন্ট ও ডিসপোজাল",
  categoryDescEn:
    "Deterministic resource cleanup: IDisposable interface, standard Dispose pattern, using statements, finalizers, and suppressing finalization.",
  categoryDescBn:
    "ডিটারমিনিস্টিক রিসোর্স ক্লিনআপ: IDisposable ইন্টারফেস, স্ট্যান্ডার্ড ডিসপোজ প্যাটার্ন, using স্টেটমেন্ট ও ফাইনাইলাইজার।",
  categoryPriority: "CORE",
  descriptionEn:
    "Compiler lowering to try-finally blocks, traditional using statement scopes, modern C# 8 using var declarations, and async IAsyncDisposable with await using.",
  descriptionBn:
    "ট্রাই-ফাইনালিতে কম্পাইলার রূপান্তর, ঐতিহ্যবাহী using স্কোপ, সি# ৮ এর using var ঘোষণা এবং await using।",
  difficulty: "EASY",
  displayOrder: 3,
  prerequisites: ["resources-idisposable"],
  estimatedMinutes: 20,
  lastUpdated: "Recently updated",
  contentEn: `# using Statement & using Declaration (C# 8) in C#

The \`using\` statement is C#'s primary syntactic construct for deterministic resource management. It guarantees that an \`IDisposable\` or \`IAsyncDisposable\` object's cleanup logic executes the moment program control departs the enclosing lexical scope—regardless of whether execution exits normally, encounters a \`return\`, or gets interrupted by an unhandled exception.

---

## 1. The Mechanics of Compiler Lowering

The C# \`using\` statement is not a runtime construct; it is pure **syntactic sugar**. At build time, the Roslyn compiler lowers every \`using\` block into an airtight \`try-finally\` structure with strict null-safety and type casting semantics.

### Traditional \`using\` Statement:
\`\`\`csharp
using (var stream = new FileStream("data.bin", FileMode.Open))
{
    stream.ReadByte();
}
\`\`\`

### What the Roslyn Compiler Emits (Lowered Form):
\`\`\`csharp
FileStream stream = new FileStream("data.bin", FileMode.Open);
try
{
    stream.ReadByte();
}
finally
{
    if (stream != null)
    {
        ((IDisposable)stream).Dispose();
    }
}
\`\`\`

### Key Architectural Nuances in Compiler Lowering:
1. **Implicit Null Check**: If the factory expression or constructor evaluates to \`null\`, the \`finally\` guard skips calling \`Dispose()\`, eliminating any risk of a \`NullReferenceException\` inside teardown logic.
2. **Read-Only Enclosure**: Within the classical \`using (...) { }\` block, the resource variable is implicitly marked \`readonly\`. Attempting to reassign \`stream = newStream;\` triggers compilation error **CS1656**.
3. **Value Type Boxing Avoidance**: When a \`struct\` implements \`IDisposable\`, modern C# avoids boxing the struct to an \`IDisposable\` interface instance during the \`finally\` cleanup pass by invoking the method through direct constrained call instructions in intermediate language (\`callvirt\` with \`constrained.\` prefix).

---

## 2. C# 8+ \`using\` Declarations vs. Classical \`using\` Statements

C# 8.0 introduced the **\`using\` declaration**, eliminating the requirement for nested curly braces while maintaining identical cleanup guarantees.

### Comparison Matrix: Statement vs. Declaration

| Feature | Classical \`using\` Statement (\`using (...) { }\`) | Modern \`using\` Declaration (\`using var x = ...;\`) |
| :--- | :--- | :--- |
| **Introduced In** | C# 1.0 | C# 8.0 |
| **Syntax** | Requires explicit curly braces \`{ ... }\` | Standard local variable declaration with prefix \`using\` |
| **Disposal Point** | Immediately upon exiting closing brace \`}\` | At the very end of the **enclosing lexical block/method** |
| **Nesting Overhead** | Creates deep indentation ("pyramid of doom") | Flat, linear code readability |
| **Scope Control** | Fine-grained, restricted to dedicated block | Broad, tied to method or enclosing control statement |

### The Scope Extension Pitfall (File Lock Contention):
While convenient, using declarations can accidentally hold expensive operating system locks longer than intended if placed at the beginning of an extensive method:

\`\`\`csharp
public void ProcessAndNotify(string filePath)
{
    // PITFALL: The file lock remains open throughout the ENTIRE method!
    using var stream = File.OpenRead(filePath);
    byte[] data = ReadPayload(stream);

    // If this HTTP call takes 10 seconds, external processes cannot write to filePath!
    NotifyRemoteServerViaHttp(data); 
}
\`\`\`

### The Solution: Explicit Scope Isolation
When resource lifetimes must remain brief within a larger method, isolate the declaration inside an explicit localized block:

\`\`\`csharp
public void ProcessAndNotifySafe(string filePath)
{
    byte[] data;
    {
        using var stream = File.OpenRead(filePath);
        data = ReadPayload(stream);
    } // stream.Dispose() executes IMMEDIATELY here, releasing the OS handle!

    // The file is now fully unlocked during slow external operations
    NotifyRemoteServerViaHttp(data);
}
\`\`\`

---

## 3. Asynchronous Resource Cleanup: \`IAsyncDisposable\` & \`await using\`

Traditional \`IDisposable.Dispose()\` is purely synchronous. However, modern network streams, cloud storage clients, database connections, and compression pipelines often need to execute asynchronous work during cleanup (such as flushing remaining internal memory buffers over socket connections).

To avoid blocking thread pool threads during disposal, C# 8.0 introduced:
- The **\`IAsyncDisposable\`** interface with \`ValueTask DisposeAsync()\`.
- The **\`await using\`** statement and declaration.

### Interface Definition:
\`\`\`csharp
namespace System
{
    public interface IAsyncDisposable
    {
        ValueTask DisposeAsync();
    }
}
\`\`\`

### Usage Example:
\`\`\`csharp
public async Task StreamDataToStorageAsync(string destinationPath, byte[] payload)
{
    // await using ensures DisposeAsync() is awaited non-blockingly
    await using var fileStream = new FileStream(
        destinationPath, 
        FileMode.Create, 
        FileAccess.Write, 
        FileShare.None, 
        bufferSize: 4096, 
        useAsync: true);

    await fileStream.WriteAsync(payload, 0, payload.Length);
    // As execution exits, fileStream.DisposeAsync() flushes remaining buffers asynchronously
}
\`\`\`

### Lowered Form of \`await using\`:
\`\`\`csharp
FileStream fileStream = new FileStream(...);
try
{
    await fileStream.WriteAsync(payload, 0, payload.Length);
}
finally
{
    if (fileStream != null)
    {
        await fileStream.DisposeAsync();
    }
}
\`\`\`

---

## 4. Pattern-Based Disposal & \`ref struct\` Support

Beginning with C# 8.0, the compiler supports **pattern-based disposal**. An object does **not** strictly need to implement the \`IDisposable\` interface to be used in a \`using\` block, provided:
1. It exposes an accessible parameterless instance method named \`Dispose()\`.
2. It is a **\`ref struct\`** (stack-only value type).

\`ref struct\` types cannot implement interfaces (because casting to an interface requires boxing to the managed heap, which violates \`ref struct\` stack constraints). Pattern matching allows zero-allocation, high-performance stack structures to participate in deterministic cleanup:

\`\`\`csharp
public ref struct StackBufferScope
{
    private Span<byte> _buffer;

    public StackBufferScope(Span<byte> buffer)
    {
        _buffer = buffer;
        _buffer.Clear(); // Initialize memory
    }

    // Duck-typed Dispose method (No IDisposable interface required!)
    public void Dispose()
    {
        _buffer.Clear(); // Wipe sensitive data before leaving stack frame
    }
}

public void ProcessBufferSafely()
{
    Span<byte> stackMemory = stackalloc byte[256];
    
    using (var scope = new StackBufferScope(stackMemory))
    {
        // Work with stackMemory...
    } // scope.Dispose() is called deterministically with 0 GC allocations!
}
\`\`\`

---

## 5. Comprehensive Syntax & Implementation

\`\`\`csharp
using System;
using System.IO;
using System.Threading.Tasks;

public class ResourceManagementPlaybook
{
    // 1. Classical using block with multiple variables of same type
    public static void CopyStreamClassical(string source, string dest)
    {
        using (FileStream src = File.OpenRead(source), 
                          dst = File.Create(dest))
        {
            src.CopyTo(dst);
        } // Both streams disposed here in reverse order of declaration
    }

    // 2. Modern C# 8 using declarations
    public static string ReadHeaderModern(string path)
    {
        using var stream = File.OpenRead(path);
        using var reader = new StreamReader(stream);
        return reader.ReadLine() ?? string.Empty;
    } // reader disposed first, then stream disposed automatically

    // 3. Modern await using for asynchronous cleanup
    public static async Task WriteLogAsync(string path, string entry)
    {
        await using var writer = new StreamWriter(path, append: true);
        await writer.WriteLineAsync(entry);
    } // writer.DisposeAsync() awaited non-blockingly
}
\`\`\`

---

## 6. Practical Problem Walkthrough

### Problem: Fast Lookup via Deterministic Buffer Scoping
*Source: Codeforces Assiut Sheet #3: Problem Z (Binary Search)*

In competitive programming and high-throughput enterprise systems, reading hundreds of thousands of input values from standard streams must be executed rapidly. Managing I/O reader streams with deterministic scoping guarantees maximum throughput and immediate release of memory buffers.

Given an array $A$ of $N$ integers and $Q$ queries, determine whether an integer $X$ exists in $A$ for each query.

### Algorithmic Strategy:
1. **Deterministic Reader Lifecycle**: Read input using a buffered stream inside a \`using\` block to ensure resources release cleanly upon completion.
2. **Preprocessing**: Sort array $A$ in $O(N \\log N)$ time.
3. **Lookup**: For each of the $Q$ queries, execute standard binary search in $O(\\log N)$ time.
4. **Complexity**:
   - **Time Complexity**: $O(N \\log N + Q \\log N)$.
   - **Space Complexity**: $O(N)$ for storing input elements.

### C# Solution:

\`\`\`csharp
using System;
using System.IO;

public class Program
{
    public static void Main()
    {
        // Deterministic I/O stream scoping
        using var reader = new StreamReader(Console.OpenStandardInput(), bufferSize: 65536);
        using var writer = new StreamWriter(Console.OpenStandardOutput(), bufferSize: 65536);

        string? firstLine = reader.ReadLine();
        if (string.IsNullOrEmpty(firstLine)) return;

        string[] parts = firstLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(parts[0]);
        int q = int.Parse(parts[1]);

        int[] array = new int[n];
        string[] arrayElements = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);
        for (int i = 0; i < n; i++)
        {
            array[i] = int.Parse(arrayElements[i]);
        }

        // Sort array for binary search
        Array.Sort(array);

        for (int i = 0; i < q; i++)
        {
            int query = int.Parse(reader.ReadLine() ?? "0");
            
            // Perform binary search
            if (BinarySearch(array, query))
            {
                writer.WriteLine("found");
            }
            else
            {
                writer.WriteLine("not found");
            }
        }
    }

    private static bool BinarySearch(int[] arr, int target)
    {
        int low = 0;
        int high = arr.Length - 1;

        while (low <= high)
        {
            int mid = low + ((high - low) >> 1);
            if (arr[mid] == target) return true;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }

        return false;
    }
}
\`\`\`

---

## 7. Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces | [Assiut Sheet #3: Binary Search](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Z) | Easy | Binary Search, using Scoping, Fast I/O |
| ⚪ | Codeforces | [Assiut Sheet #3: Search In Matrix](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/S) | Easy | 2D Arrays, Scoped Stream Processing |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Collections, Deterministic Lifetime |
| ⚪ | Exercism C# | [House](https://exercism.org/tracks/csharp/exercises/house) | Medium | String Construction, Stream Buffer Scoping |
`,

  contentBn: `# C# এ ইউজিং (using) স্টেটমেন্ট ও সি# ৮ ইউজিং ডিক্লারেশন

সি# এ ডিটারমিনিস্টিক বা তাৎক্ষণিক রিসোর্স ক্লিনআপ নিশ্চিত করার জন্য \`using\` স্টেটমেন্ট হলো সবচেয়ে কার্যকর সিনট্যাক্টিক ফিচার। এটি গ্যারান্টি দেয় যে প্রোগ্রাম চলাকালে কোনো এক্সেপশন ঘটুক বা সাধারণ নিয়মে এক্সিকিউশন শেষ হোক—নির্দিষ্ট স্কোপ থেকে বের হওয়ার সাথে সাথেই অবজেক্টটির \`Dispose()\` মেথড নিশ্চিতভাবে এক্সিকিউট হবে।

---

## ১. কম্পাইলার লোয়ারিং (Compiler Lowering) এর ভেতরের কাজ

সি# এর \`using\` কোনো রানটাইম স্টেটমেন্ট নয়; এটি একটি **সিনট্যাক্টিক সুগার (Syntactic Sugar)**। বিল্ড টাইমে Roslyn কম্পাইলার প্রতিটি \`using\` ব্লককে স্বয়ংক্রিয়ভাবে একটি সুরক্ষিত \`try-finally\` ব্লকে রূপান্তরিত করে।

### আমরা যা লিখি (ঐতিহ্যবাহী \`using\`):
\`\`\`csharp
using (var stream = new FileStream("data.bin", FileMode.Open))
{
    stream.ReadByte();
}
\`\`\`

### Roslyn কম্পাইলার যা তৈরি করে (Lowered Form):
\`\`\`csharp
FileStream stream = new FileStream("data.bin", FileMode.Open);
try
{
    stream.ReadByte();
}
finally
{
    if (stream != null)
    {
        ((IDisposable)stream).Dispose();
    }
}
\`\`\`

### অভ্যন্তরীণ গুরুত্বপূর্ণ বিষয়সমূহ:
1. **নাল-চেক গার্ড (Null-Check Guard)**: যদি অবজেক্টটির মান \`null\` হয়, তবে \`finally\` ব্লকের ভেতরে কোনো \`Dispose()\` কল করা হয় না, ফলে অপ্রয়োজনীয় \`NullReferenceException\` এর কোনো ঝুঁকি থাকে না।
2. **রিড-অনলি ভেরিয়েবল**: ঐতিহ্যবাহী \`using (...) { }\` ব্লকের ভেতরে রিসোর্স ভেরিয়েবলটি স্বয়ংক্রিয়ভাবে \`readonly\` থাকে। ব্লকের ভেতরে নতুন মান অ্যাসাইন করার চেষ্টা করলে কম্পাইলার এরর **CS1656** দেখায়।
3. **বক্সিং পরিহার (No Boxing for Structs)**: কোনো \`struct\` যদি \`IDisposable\` ইন্টারফেস ইমপ্লিমেন্ট করে, তবে কম্পাইলার constrained call নির্দেশিকা ব্যবহার করে সরাসরি মেথড কল করে, ফলে কোনো অপ্রয়োজনীয় হিপ বক্সিং (Heap Boxing) ঘটে না।

---

## ২. সি# ৮ \`using\` ডিক্লারেশন বনাম ঐতিহ্যবাহী \`using\` স্টেটমেন্ট

সি# ৮.০ ভার্সনে **\`using\` declaration** নিয়ে আসা হয়, যার ফলে অতিরিক্ত সেকেন্ড ব্র্যাকেট বা ইন্ডেন্টেশনের জটিলতা দূর হয়।

### তুলনামূলক ছক: স্টেটমেন্ট বনাম ডিক্লারেশন

| বৈশিষ্ট্য | ঐতিহ্যবাহী \`using\` স্টেটমেন্ট (\`using (...) { }\`) | আধুনিক \`using\` ডিক্লারেশন (\`using var x = ...;\`) |
| :--- | :--- | :--- |
| **যাত্রা শুরু** | C# 1.0 | C# 8.0 |
| **সিনট্যাক্স** | স্পষ্ট কোঁকড়ানো বন্ধনী \`{ ... }\` আবশ্যক | ভেরিয়েবল ঘোষণার শুরুতে \`using\` কি-ওয়ার্ড |
| **ক্লিনআপের সময়** | ব্লকের সমাপ্তি বন্ধনী \`}\` অতিক্রম করার সাথে সাথে | যে মেথড বা ব্লকে ঘোষণা করা হয়েছে তার **একদম শেষে** |
| **ইন্ডেন্টেশন কোড** | একাধিক রিসোর্সে কোড অনেক ভেতরে চলে যায় | সমতল ও সোজা কোড রিডিবিলিটি |
| **লাইফটাইম নিয়ন্ত্রণ** | অত্যন্ত নিখুঁত ও নির্দিষ্ট ব্লকে সীমাবদ্ধ | তুলনামূলক বিস্তৃত, পুরো মেথড জুড়ে কার্যকর |

### ফাইল লক আটকে থাকার ঝুঁকি (Scope Extension Pitfall):
\`using var\` ব্যবহারের সময় মনে রাখতে হবে যে অবজেক্টটি মেথড শেষ না হওয়া পর্যন্ত ডিসপোজ হবে না। যদি কোনো বড় মেথডের শুরুতে ফাইল ওপেন করা হয় এবং পরে দীর্ঘ কাজ করা হয়, তবে ফাইলটি অযথা লক হয়ে থাকবে:

\`\`\`csharp
public void ProcessAndNotify(string filePath)
{
    // সতর্কতা: ফাইল হ্যান্ডেল পুরো মেথডের শেষ পর্যন্ত লক থাকবে!
    using var stream = File.OpenRead(filePath);
    byte[] data = ReadPayload(stream);

    // এই রিমোট রিকোয়েস্ট যদি ১০ সেকেন্ড সময় নেয়, তবে অন্য কোনো অ্যাপ ফাইলে লিখতে পারবে না!
    NotifyRemoteServerViaHttp(data); 
}
\`\`\`

### সমাধান: কৃত্রিম স্কোপ তৈরি
রিসোর্সের কাজ শেষ হওয়ার সাথে সাথে হ্যান্ডেল মুক্ত করতে স্পষ্ট ব্লকে কোড আবদ্ধ করুন:

\`\`\`csharp
public void ProcessAndNotifySafe(string filePath)
{
    byte[] data;
    {
        using var stream = File.OpenRead(filePath);
        data = ReadPayload(stream);
    } // এই ব্র্যাকেটে সাথে সাথে stream.Dispose() কল হবে এবং ফাইল আনলক হয়ে যাবে!

    // এখন ফাইল পুরোপুরি মুক্ত, দীর্ঘ অপারেশনে কোনো সমস্যা নেই
    NotifyRemoteServerViaHttp(data);
}
\`\`\`

---

## ৩. অ্যাসিনক্রোনাস ডিসপোজাল: \`IAsyncDisposable\` ও \`await using\`

প্রথাগত \`IDisposable.Dispose()\` সম্পূর্ণ সিঙ্ক্রোনাস। কিন্তু আধুনিক নেটওয়ার্ক সকেট, ক্লাউড স্টোরেজ ক্লায়েন্ট বা কম্প্রেসড স্ট্রিম বন্ধ করার সময় বাফারের ডেটা পুশ বা ফ্ল্যাশ করার জন্য I/O অপারেশন চালানোর প্রয়োজন হতে পারে। থ্রেড ব্লক না করে ডিসপোজ করার জন্য সি# ৮ এ এসেছে \`IAsyncDisposable\`।

### ইন্টারফেসের গঠন:
\`\`\`csharp
namespace System
{
    public interface IAsyncDisposable
    {
        ValueTask DisposeAsync();
    }
}
\`\`\`

### ব্যবহারের নিয়ম:
\`\`\`csharp
public async Task StreamDataToStorageAsync(string destinationPath, byte[] payload)
{
    // await using নিশ্চিত করে যে DisposeAsync() মেথডটি নন-ব্লকিং ভাবে অ্যাওয়েট হবে
    await using var fileStream = new FileStream(
        destinationPath, 
        FileMode.Create, 
        FileAccess.Write, 
        FileShare.None, 
        bufferSize: 4096, 
        useAsync: true);

    await fileStream.WriteAsync(payload, 0, payload.Length);
    // মেথড শেষ হওয়ার সময় বাফার ফ্ল্যাশ স্বয়ংক্রিয়ভাবে DisposeAsync() দ্বারা সম্পন্ন হবে
}
\`\`\`

---

## ৪. প্যাটার্ন-ভিত্তিক ডিসপোজাল ও \`ref struct\`

সি# ৮ থেকে কম্পাইলার **প্যাটার্ন-ভিত্তিক ডিসপোজাল** সমর্থন করে। কোনো টাইপ যদি আনুষ্ঠানিকভাবে \`IDisposable\` ইন্টারফেস ইমপ্লিমেন্ট নাও করে, তবুও সেটিতে যদি একটি পাবলিক প্যারামিটারবিহীন \`Dispose()\` মেথড থাকে, তবে তাকে \`using\` ব্লকে ব্যবহার করা যায়।

এটি মূলত **\`ref struct\`** এর জন্য অত্যন্ত কার্যকর, কারণ \`ref struct\` ইন্টারফেস ইমপ্লিমেন্ট করতে পারে না (ইন্টারফেসে রূপান্তর করলে হিপে বক্সিং হয়ে যায় যা স্ট্যাক-অনলি রুলসের বিরোধী):

\`\`\`csharp
public ref struct StackBufferScope
{
    private Span<byte> _buffer;

    public StackBufferScope(Span<byte> buffer)
    {
        _buffer = buffer;
        _buffer.Clear();
    }

    // ডাক-টাইপড ডিসপোজ মেথড (কোনো ইন্টারফেসের দরকার নেই)
    public void Dispose()
    {
        _buffer.Clear(); // স্ট্যাক মেমোরি খালি করে ক্লিনআপ নিশ্চিত করা
    }
}

public void ProcessBufferSafely()
{
    Span<byte> stackMemory = stackalloc byte[256];
    
    using (var scope = new StackBufferScope(stackMemory))
    {
        // স্ট্যাক মেমোরি নিয়ে কাজ করুন...
    } // শূন্য জিসি অ্যালোকেশনে তাৎক্ষণিক scope.Dispose() কল হবে!
}
\`\`\`

---

## ৫. বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ডিটারমিনিস্টিক বাফার স্কোপিংয়ের মাধ্যমে দ্রুত বাইনারি সার্চ
*সোর্স: কোডফোর্সেস আসিউট শিট #৩: প্রবলেম Z (বাইনারি সার্চ)*

বড় ডেটাসেট প্রসেস করার সময় এবং হাই-পারফরম্যান্স সিস্টেমে হাজার হাজার ইনপুট দ্রুত প্রসেস করার জন্য স্ট্রিম বাফার এবং \`using\` স্টেটমেন্টের সঠিক ব্যবহার অপরিহার্য।

প্রদত্ত $N$ আকারের একটি অ্যারে $A$ এবং $Q$ টি কুয়েরির জন্য প্রতিটি কুয়েরিতে $X$ সংখ্যাটি অ্যারেতে বিদ্যমান কিনা তা নির্ধারণ করতে হবে।

### সমাধান কৌশল:
১. **ডিটারমিনিস্টিক I/O স্ট্রিম**: ইনপুট দ্রুত পড়ার জন্য \`StreamReader\` এবং লেখার জন্য \`StreamWriter\` কে \`using\` ব্লকের মাধ্যমে আবদ্ধ করা।
২. **সর্টিং**: অ্যারেটিকে $O(N \\log N)$ এ সর্ট করা।
৩. **বাইনারি সার্চ**: প্রতিটি কুয়েরির জন্য $O(\\log N)$ এ বাইনারি সার্চ চালানো।
৪. **কমপ্লেক্সিটি**:
   - **টাইম কমপ্লেক্সিটি**: $O(N \\log N + Q \\log N)$।
   - **স্পেস কমপ্লেক্সিটি**: $O(N)$ ইনপুট ডেটা সংরক্ষণের জন্য।

### সম্পূর্ণ সি# সলিউশন:

\`\`\`csharp
using System;
using System.IO;

public class Program
{
    public static void Main()
    {
        // ডিটারমিনিস্টিক I/O বাফার ব্যবস্থাপনা
        using var reader = new StreamReader(Console.OpenStandardInput(), bufferSize: 65536);
        using var writer = new StreamWriter(Console.OpenStandardOutput(), bufferSize: 65536);

        string? firstLine = reader.ReadLine();
        if (string.IsNullOrEmpty(firstLine)) return;

        string[] parts = firstLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(parts[0]);
        int q = int.Parse(parts[1]);

        int[] array = new int[n];
        string[] arrayElements = (reader.ReadLine() ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);
        for (int i = 0; i < n; i++)
        {
            array[i] = int.Parse(arrayElements[i]);
        }

        // বাইনারি সার্চের জন্য সর্টিং
        Array.Sort(array);

        for (int i = 0; i < q; i++)
        {
            int query = int.Parse(reader.ReadLine() ?? "0");
            
            if (BinarySearch(array, query))
            {
                writer.WriteLine("found");
            }
            else
            {
                writer.WriteLine("not found");
            }
        }
    }

    private static bool BinarySearch(int[] arr, int target)
    {
        int low = 0;
        int high = arr.Length - 1;

        while (low <= high)
        {
            int mid = low + ((high - low) >> 1);
            if (arr[mid] == target) return true;
            if (arr[mid] < target) low = mid + 1;
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
| ⚪ | Codeforces | [Assiut Sheet #3: Binary Search](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Z) | Easy | Binary Search, using Scoping, Fast I/O |
| ⚪ | Codeforces | [Assiut Sheet #3: Search In Matrix](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/S) | Easy | 2D Arrays, Scoped Stream Processing |
| ⚪ | Exercism C# | [High Scores](https://exercism.org/tracks/csharp/exercises/high-scores) | Easy | Collections, Deterministic Lifetime |
| ⚪ | Exercism C# | [House](https://exercism.org/tracks/csharp/exercises/house) | Medium | String Construction, Stream Buffer Scoping |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Binary Search",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/Z",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Binary Search", "using", "Fast I/O"],
      solutionEn:
        "Sort the array and perform logarithmic binary search for each query while managing input reader streams with using scoping.",
      solutionBn:
        "অ্যারে সর্ট করে প্রতিটি কুয়েরির জন্য বাইনারি সার্চ চালান এবং using স্কোপিং দিয়ে ইনপুট স্ট্রিম সুরক্ষিতভাবে ম্যানেজ করুন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #3: Search In Matrix",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/S",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["2D Array", "Matrix", "Resources"],
      solutionEn:
        "Read a 2D matrix with scoped stream readers and check for element existence in linear time across cells.",
      solutionBn:
        "স্কোপড স্ট্রিম রিডার দিয়ে দ্বিমাত্রিক ম্যাট্রিক্স রিড করে নির্দিষ্ট উপাদান বিদ্যমান কিনা তা লিনিয়ার সময়ে যাচাই করুন।",
    },
    {
      source: "Exercism C#",
      name: "High Scores",
      url: "https://exercism.org/tracks/csharp/exercises/high-scores",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Collections", "LINQ", "Lifecycle"],
      solutionEn:
        "Maintain and retrieve game high scores cleanly using deterministic collection lifecycle semantics.",
      solutionBn:
        "ডিটারমিনিস্টিক কালেকশন লাইফসাইকেল ব্যবহারের মাধ্যমে গেমের সর্বোচ্চ স্কোরগুলো সুরক্ষিতভাবে ট্র্যাক ও রিটার্ন করুন।",
    },
    {
      source: "Exercism C#",
      name: "House",
      url: "https://exercism.org/tracks/csharp/exercises/house",
      difficulty: "MEDIUM",
      company: "Optimizely",
      tags: ["String", "Stream", "Resources"],
      solutionEn:
        "Assemble cumulative nursery rhymes efficiently using scoped string and text writer buffers.",
      solutionBn:
        "স্কোপড টেক্সট রাইটার বাফার ব্যবহারের মাধ্যমে কার্যকরভাবে কবিতার পঙ্ক্তিগুলো তৈরি ও কনক্যাট করুন।",
    },
  ],
};
