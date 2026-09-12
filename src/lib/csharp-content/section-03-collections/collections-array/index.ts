import type { LocalLesson } from "@/lib/lessons-data";

export const collectionsArrayLesson: LocalLesson = {
    slug: "collections-array",
    titleEn: "Array",
    titleBn: "অ্যারে (Array) ও মেমোরি লেআউট",
    categoryEn: "03. Collections",
    categoryBn: "০৩. কালেকশনস ও ডেটা স্ট্রাকচার",
    categoryDescEn:
      "Essential data structures in .NET: fixed arrays, dynamic lists, hash-based sets and dictionaries, and FIFO/LIFO queues.",
    categoryDescBn:
      ".NET এর অপরিহার্য ডেটা স্ট্রাকচার: ফিক্সড অ্যারে, ডায়নামিক লিস্ট, হ্যাশ ডিকশনারি, সেট এবং কিউ/স্ট্যাক।",
    categoryPriority: "CORE",
    descriptionEn:
      "Contiguous memory layout, fixed capacity, multi-dimensional and jagged arrays, zero-indexing, and Array class methods.",
    descriptionBn:
      "একটানা মেমোরি বরাদ্দ, নির্ধারিত ধারণক্ষমতা, মাল্টি-ডাইমেনশনাল ও জ্যাগড অ্যারে এবং মেমোরি লেআউট।",
    difficulty: "EASY",
    displayOrder: 1,
    prerequisites: ["csharp-foreach-loop"],
    estimatedMinutes: 30,
    lastUpdated: "Recently updated",
    contentEn: `# Arrays in C#

An array is a fixed-size, contiguous sequence of elements of the same data type. In C#, arrays are **reference types** derived from the abstract base class \`System.Array\`, allocated directly on the managed heap.

---

## 1. Memory Architecture & Contiguous Layout

When you instantiate an array such as \`int[] numbers = new int[5];\`, the .NET CLR allocates a single continuous block of memory on the heap consisting of:
1. **Object Header** (SyncBlockIndex, 8 bytes on 64-bit).
2. **MethodTable Pointer** (Type metadata pointer, 8 bytes).
3. **Length Component** (32-bit integer storing the element count, 4 bytes + 4 bytes padding).
4. **Contiguous Element Payloads** ($5 \\times 4 = 20$ bytes).

\`\`\`
[ Object Header (8B) ] [ MethodTable* (8B) ] [ Length (4B) ] [ Elem 0 ] [ Elem 1 ] [ Elem 2 ] ...
\`\`\`

### Why Arrays Deliver Instantaneous $O(1)$ Random Access
Because elements sit adjacent to one another in physical memory, accessing element $i$ requires zero traversal:
$$\\text{Address}(A[i]) = \\text{BaseAddress} + \\text{HeaderOffset} + (i \\times \\text{sizeof}(T))$$
This calculation executes in a **single CPU instruction cycle**.

### CPU Cache Locality
Because memory is read in 64-byte chunks called **cache lines**, reading \`numbers[0]\` automatically pulls adjacent elements (\`numbers[1]\`, \`numbers[2]\`, etc.) into high-speed CPU L1/L2 cache. This gives sequential array loops unprecedented performance compared to pointer-chasing data structures like linked lists.

---

## 2. Array Dimensions: Rectangular vs Jagged

C# natively supports two distinct multi-dimensional array paradigms:

### A. Rectangular (2D / Multi-Dimensional) Arrays (\`int[,]\`)
Allocated as a single contiguous memory block. Rows and columns form a strict mathematical matrix:

\`\`\`csharp
// 2 rows, 3 columns matrix
int[,] matrix = new int[2, 3]
{
    { 10, 20, 30 },
    { 40, 50, 60 }
};

Console.WriteLine(matrix[1, 2]); // Prints 60
Console.WriteLine($"Total elements: {matrix.Length}"); // 6
Console.WriteLine($"Rows: {matrix.GetLength(0)}, Cols: {matrix.GetLength(1)}"); // 2, 3
\`\`\`

### B. Jagged Arrays (Arrays of Arrays) (\`int[][]\`)
An outer array storing pointers to independent, heap-allocated inner arrays. Each row can have a **different length**:

\`\`\`csharp
int[][] jagged = new int[3][];
jagged[0] = new int[] { 1, 2 };
jagged[1] = new int[] { 3, 4, 5, 6 };
jagged[2] = new int[] { 7 };

Console.WriteLine(jagged[1][2]); // Prints 5
\`\`\`

### Comparison: Rectangular (\`[,]\`) vs Jagged (\`[][]\`)

| Criteria | Rectangular Array (\`T[,]\`) | Jagged Array (\`T[][]\`) |
|---|---|---|
| **Memory Allocation** | Single contiguous heap block | Multiple independent array objects |
| **Row Uniformity** | Strictly uniform (all rows same size) | Non-uniform (variable row lengths) |
| **JIT Optimization** | Minor indexing overhead ($r \\times \\text{cols} + c$) | JIT can optimize to fast single-pointer dereference |
| **Cache Behavior** | Excellent cache locality | Potential cache misses between rows |

---

## 3. Essential \`System.Array\` Static Methods

The abstract class \`System.Array\` provides high-performance algorithms implemented directly in CLR native code:

\`\`\`csharp
int[] numbers = { 45, 12, 85, 32, 89, 39, 69, 44 };

// 1. In-place sorting (Introsort: Quicksort + Heapsort + Insertion Sort) -> O(N log N)
Array.Sort(numbers);

// 2. Binary Search on sorted array -> O(log N)
int foundIndex = Array.BinarySearch(numbers, 45);
Console.WriteLine($"Found 45 at index: {foundIndex}");

// 3. Reversing array in-place -> O(N)
Array.Reverse(numbers);

// 4. Memory Copy (Optimized block memory transfer via memmove)
int[] copy = new int[4];
Array.Copy(numbers, 0, copy, 0, 4);

// 5. Clearing elements back to default value (0 for numbers, null for refs)
Array.Clear(copy, 0, copy.Length);

// 6. Resizing an array (Allocates a brand new array and copies over -> O(N))
Array.Resize(ref numbers, 12);
\`\`\`

---

## 4. Modern C# 8+ Slicing: Indices and Ranges

C# 8 introduced first-class syntax for backward indexing (\`^\`) and subarray slicing (\`..\`):

\`\`\`csharp
string[] fruits = { "Apple", "Banana", "Cherry", "Date", "Elderberry" };

// Backward index: ^1 means 1 from the end (Length - 1)
string last = fruits[^1]; // "Elderberry"
string secondToLast = fruits[^2]; // "Date"

// Range slicing: [start..end] (end is EXCLUSIVE)
string[] middle = fruits[1..4]; // { "Banana", "Cherry", "Date" }
string[] firstThree = fruits[..3]; // { "Apple", "Banana", "Cherry" }
string[] lastTwo = fruits[^2..]; // { "Date", "Elderberry" }
\`\`\`

> **Allocation Warning on \`Range\`**: Slicing an array with \`fruits[1..4]\` allocates a **brand new array on the heap**. For zero-allocation slicing in performance-critical code, use spans: \`ReadOnlySpan<string> slice = fruits.AsSpan()[1..4];\`.

---

## 5. Array Covariance Trap in C#

In C#, arrays of reference types are **covariant** (i.e. \`string[]\` can be treated as \`object[]\`). While convenient, this introduces a runtime type safety trap:

\`\`\`csharp
string[] words = new string[3];
object[] objects = words; // Allowed due to array covariance

// ❌ RUNTIME EXCEPTION: ArrayTypeMismatchException!
// The CLR runtime checks every write to an object array to protect type safety.
objects[0] = 123; 
\`\`\`

---

## 6. Comprehensive Time & Space Complexity

| Operation | Time Complexity | Notes |
|---|---|---|
| **Access by Index (\`arr[i]\`)** | $O(1)$ | Direct pointer arithmetic |
| **Update by Index (\`arr[i] = val\`)** | $O(1)$ | Direct memory write |
| **Search (Unsorted)** | $O(N)$ | Linear scan |
| **Search (Sorted via \`BinarySearch\`)** | $O(\\log N)$ | Requires pre-sorted array |
| **Insertion / Deletion** | $O(N)$ | Requires allocating new array & shifting |
| **Copy (\`Array.Copy\`)** | $O(N)$ | Hardware accelerated SIMD block move |

---

## Practical Problem Walkthrough

### Problem: Reversing an Array
*Source: Codeforces Assiut University Training Sheet #3 — Problem F*

**Problem Statement**:
Given an array $A$ of $N$ numbers. Print the array in reverse order using in-place two-pointer reversal.

**Constraints**:
$1 \\le N \\le 10^3$, $-10^9 \\le A_i \\le 10^9$.

### C# Solution:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        long[] arr = new long[n];

        for (int i = 0; i < n; i++)
        {
            arr[i] = long.Parse(tokens[i]);
        }

        // Two-pointer in-place reversal: O(N) time, O(1) auxiliary space
        int left = 0;
        int right = n - 1;

        while (left < right)
        {
            long temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;

            left++;
            right--;
        }

        Console.WriteLine(string.Join(" ", arr));
    }
}
\`\`\`

**Complexity Analysis**:
- **Time Complexity**: $O(N)$ — performs exactly $\\lfloor N/2 \\rfloor$ pointer swaps.
- **Space Complexity**: $O(1)$ auxiliary space — elements are swapped directly in-place without auxiliary arrays.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem F: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | In-place reversal, Two Pointers |
| ⚪ | Codeforces Assiut | [Problem G: Palindrome Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/G) | Easy | Symmetry checking, Indexing |
| ⚪ | Codeforces Assiut | [Problem E: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | Linear scan, Min tracking |
| ⚪ | Exercism C# | [Resistor Color](https://exercism.org/tracks/csharp/exercises/resistor-color) | Easy | Static arrays, Array.IndexOf |
`,

    contentBn: `# C# এ অ্যারে (Array) ও মেমোরি লেআউট

অ্যারে হলো একই ডেটা টাইপের উপাদান ধারণকারী একটি নির্দিষ্ট আকারের সংলগ্ন (Contiguous) মেমোরি ব্লক। সি# এ অ্যারে একটি **রেফারেন্স টাইপ**, যা অ্যাবস্ট্রাক্ট ক্লাস \`System.Array\` থেকে ইনহেরিট করে এবং ম্যানেজড হিপে মেমোরি গ্রহণ করে।

---

## ১. মেমোরি আর্কিটেকচার ও সংলগ্ন লেআউট

যখন \`int[] numbers = new int[5];\` তৈরি করা হয়, তখন CLR হিপে একটি নিরবচ্ছিন্ন মেমোরি ব্লক তৈরি করে:
১. **অবজেক্ট হেডার** (SyncBlockIndex, ৬৪-বিটে ৮ বাইট)।
২. **মেথড-টেবিল পয়েন্টার** (টাইপ মেটাডেটা পয়েন্টার, ৮ বাইট)।
৩. **লেন্থ উপাদান** (৩২-বিট পূর্ণসংখ্যা উপাদান সংখ্যা নির্দেশ করে, ৪ বাইট + ৪ বাইট প্যাডিং)।
৪. **সংলগ্ন ডেটা ব্লক** ($৫ \\times ৪ = ২০$ বাইট)।

### কীভাবে অ্যারে ধ্রুবক $O(1)$ সময়ে ডেটা অ্যাক্সেস করে?
মেমোরিতে প্রতিটি উপাদান পরপর সংরক্ষিত থাকায় ইনডেক্স $i$ সরাসরি পয়েন্টার সমীকরণের মাধ্যমে পাওয়া যায়:
$$\\text{Address}(A[i]) = \\text{BaseAddress} + \\text{HeaderOffset} + (i \\times \\text{sizeof}(T))$$
এই হিসাবটি সম্পন্ন করতে সিপিইউ-এর মাত্র **একটি ক্লক সাইকেল** লাগে।

### সিপিইউ ক্যাশ লোকালিটি
সিপিইউ মেমোরি থেকে প্রতিবার ৬৪-বাইটের ক্যাশ-লাইন রিড করে। ফলে \`numbers[0]\` এক্সেস করার সাথে সাথেই পাশের \`numbers[1]\`, \`numbers[2]\` ইত্যাদি দ্রুতগতির L1/L2 ক্যাশে চলে আসে। ফলে পয়েন্টারভিত্তিক লিঙ্কড-লিস্টের চেয়ে অ্যারে ট্রাভার্সাল কয়েকগুণ দ্রুত চলে।

---

## ২. ডাইমেনশন: রেক্ট্যাঙ্গুলার বনাম জ্যাগড অ্যারে

### ক. রেক্ট্যাঙ্গুলার (2D) অ্যারে (\`int[,]\`)
মেমোরিতে একটিমাত্র নিরবচ্ছিন্ন ব্লক হিসেবে সংরক্ষিত হয়। সারি ও কলামের সংখ্যা সব জায়গায় সমান থাকে:

\`\`\`csharp
int[,] matrix = new int[2, 3]
{
    { 10, 20, 30 },
    { 40, 50, 60 }
};

Console.WriteLine(matrix[1, 2]); // Prints 60
Console.WriteLine($"Total elements: {matrix.Length}"); // 6
\`\`\`

### খ. জ্যাগড অ্যারে (অ্যারের অ্যারে) (\`int[][]\`)
মূল অ্যারেটিতে একাধিক স্বাধীন সাব-অ্যারের পয়েন্টার থাকে। ফলে বিভিন্ন সারির দৈর্ঘ্য বিভিন্ন হতে পারে:

\`\`\`csharp
int[][] jagged = new int[3][];
jagged[0] = new int[] { 1, 2 };
jagged[1] = new int[] { 3, 4, 5, 6 };
jagged[2] = new int[] { 7 };

Console.WriteLine(jagged[1][2]); // Prints 5
\`\`\`

### তুলনামূলক সারণী: রেক্ট্যাঙ্গুলার বনাম জ্যাগড অ্যারে

| মানদণ্ড | রেক্ট্যাঙ্গুলার অ্যারে (\`T[,]\`) | জ্যাগড অ্যারে (\`T[][]\`) |
|---|---|---|
| **মেমোরি কাঠামো** | একক সংলগ্ন হিপ ব্লক | একাধিক পৃথক সাব-অ্যারে অবজেক্ট |
| **সারির দৈর্ঘ্য** | প্রতিটি সারি সমদৈর্ঘ্যের | ভিন্ন ভিন্ন দৈর্ঘ্যের সারি সম্ভব |
| **JIT অপ্টিমাইজেশন** | গুণোত্তর ইনডেক্সিং ($r \\times \\text{cols} + c$) | সরাসরি সিঙ্গেল পয়েন্টার ডিরেফারেন্স |
| **ক্যাশ পারফরম্যান্স** | অসাধারণ ক্যাশ লোকালিটি | ভিন্ন সাব-অ্যারেতে ক্যাশ মিসের সম্ভাবনা |

---

## ৩. \`System.Array\` এর অপরিহার্য মেথডসমূহ

\`System.Array\` ক্লাস বিভিন্ন অপ্টিমাইজড মেথড প্রদান করে:

\`\`\`csharp
int[] numbers = { 45, 12, 85, 32, 89, 39, 69, 44 };

// ১. ইন-প্লেস সর্টিং (Introsort: Quicksort + Heapsort) -> O(N log N)
Array.Sort(numbers);

// ২. সর্টেড অ্যারেতে বাইনারি সার্চ -> O(log N)
int foundIndex = Array.BinarySearch(numbers, 45);

// ৩. ইন-প্লেস রিভার্স করা -> O(N)
Array.Reverse(numbers);

// ৪. মেমোরি কপি (অপ্টিমাইজড হার্ডওয়্যার ব্লক কপি)
int[] copy = new int[4];
Array.Copy(numbers, 0, copy, 0, 4);

// ৫. মান ডিফল্ট মানে রিসেট করা (সংখ্যার জন্য ০)
Array.Clear(copy, 0, copy.Length);

// ৬. অ্যারে রিসাইজ করা (নতুন অ্যারে তৈরি করে কপি করে -> O(N))
Array.Resize(ref numbers, 12);
\`\`\`

---

## ৪. আধুনিক সি# রেঞ্জ ও ইনডেক্স স্লাইসিং (C# 8+)

\`\`\`csharp
string[] fruits = { "Apple", "Banana", "Cherry", "Date", "Elderberry" };

// বিপরীত দিক থেকে ইনডেক্স: ^1 মানে শেষ উপাদান
string last = fruits[^1]; // "Elderberry"

// রেঞ্জ স্লাইসিং: [start..end] (end ইনডেক্সটি অন্তর্ভুক্ত নয়)
string[] middle = fruits[1..4]; // { "Banana", "Cherry", "Date" }
\`\`\`

> **মেমোরি সতর্কতা**: \`fruits[1..4]\` দিয়ে স্লাইস করলে হিপে একটি সম্পূর্ণ **নতুন অ্যারে তৈরি হয়**। জিরো-মেমোরি স্লাইসিংয়ের জন্য স্প্যান ব্যবহার করা উচিত: \`fruits.AsSpan()[1..4]\`।

---

## ৫. অ্যারে কোভ্যারিয়েন্স ফাঁদ (Covariance Trap)

সি# এ রেফারেন্স টাইপের অ্যারে কোভ্যারিয়েন্ট (যেমন: \`string[]\` কে \`object[]\` হিসেবে অ্যাসাইন করা যায়)। তবে এতে ভুল টাইপ লেখার চেষ্টা করলে রানটাইমে এরর দেয়:

\`\`\`csharp
string[] words = new string[3];
object[] objects = words; // কোভ্যারিয়েন্স অনুমোদিত

// ❌ রানটাইম এক্সেপশন: ArrayTypeMismatchException
objects[0] = 123; 
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: অ্যারে বিপরীতকরণ (Reversing an Array)
*উৎস: কোডফোর্সেস আসসিউত বিশ্ববিদ্যালয় ট্রেনিং শিট #৩ — Problem F*

**সমস্যা পরিচিতি**:
$N$ আকারের একটি অ্যারে $A$ দেওয়া থাকবে। অতিরিক্ত কোনো অ্যারে ব্যবহার না করে ইন-প্লেস টু-পয়েন্টার কৌশলে অ্যারেটিকে রিভার্স করে প্রিন্ট করুন।

**সীমাবদ্ধতা**:
$1 \\le N \\le 10^3$, $-10^9 \\le A_i \\le 10^9$।

### সি# সমাধান:

\`\`\`csharp
using System;

public class Program
{
    public static void Main()
    {
        int n = int.Parse(Console.ReadLine().Trim());
        string[] tokens = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        long[] arr = new long[n];

        for (int i = 0; i < n; i++)
        {
            arr[i] = long.Parse(tokens[i]);
        }

        // টু-পয়েন্টার ইন-প্লেস সোয়াপ: O(N) টাইম, O(1) স্পেস
        int left = 0;
        int right = n - 1;

        while (left < right)
        {
            long temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;

            left++;
            right--;
        }

        Console.WriteLine(string.Join(" ", arr));
    }
}
\`\`\`

**জটিলতা বিশ্লেষণ**:
- **টাইম কমপ্লেক্সিটি**: $O(N)$ — ঠিক $\\lfloor N/2 \\rfloor$ বার উপাদান সোয়াপ হয়।
- **স্পেস কমপ্লেক্সিটি**: $O(1)$ অক্সিলিয়ারি স্পেস — ইন-প্লেস পদ্ধতিতে মূল অ্যারের মেমোরিতেই পরিবর্তন করা হয়েছে।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Codeforces Assiut | [Problem F: Reversing](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F) | Easy | In-place reversal, Two Pointers |
| ⚪ | Codeforces Assiut | [Problem G: Palindrome Array](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/G) | Easy | Symmetry checking, Indexing |
| ⚪ | Codeforces Assiut | [Problem E: Lowest Number](https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E) | Easy | Linear scan, Min tracking |
| ⚪ | Exercism C# | [Resistor Color](https://exercism.org/tracks/csharp/exercises/resistor-color) | Easy | Static arrays, Array.IndexOf |
`,
    resources: [],
    problems: [
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem F: Reversing",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/F",
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Arrays", "Two Pointers"],
        solutionEn: "Use two pointers from both ends swapping elements inward until pointers cross.",
        solutionBn: "অ্যারের দুই প্রান্ত থেকে দুটি পয়েন্টার চালিয়ে উপাদান অদলবদল করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem G: Palindrome Array",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/G",
        difficulty: "EASY",
        company: "Brain Station 23",
        tags: ["Arrays", "Palindrome"],
        solutionEn: "Check if arr[i] == arr[n - 1 - i] for all indices i up to n / 2.",
        solutionBn: "বাম এবং ডান প্রান্তের উপাদানের সমতা যাচাই করে প্যালিনড্রোম নির্ণয় করুন।",
      },
      {
        source: "Codeforces Assiut Sheet #3",
        name: "Problem E: Lowest Number",
        url: "https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/E",
        difficulty: "EASY",
        company: "BJIT",
        tags: ["Arrays", "Searching", "Min"],
        solutionEn: "Find the minimum value and its 1-based index via a single linear scan.",
        solutionBn: "একক লিনিয়ার স্ক্যানে সর্বনিম্ন মান এবং তার ১-ভিত্তিক ইনডেক্স খুঁজে বের করুন।",
      },
      {
        source: "Exercism C#",
        name: "Resistor Color",
        url: "https://exercism.org/tracks/csharp/exercises/resistor-color",
        difficulty: "EASY",
        company: null,
        tags: ["Arrays", "IndexOf"],
        solutionEn: "Store color codes in a static string array and look up indices using Array.IndexOf.",
        solutionBn: "স্ট্রিং অ্যারেতে কালার নাম রেখে Array.IndexOf দিয়ে কোড নির্ধারণ করুন।",
      },
    ],
  };
