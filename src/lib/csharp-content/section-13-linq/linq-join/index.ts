import type { LocalLesson } from "@/lib/lessons-data";

export const linqJoinLesson: LocalLesson = {
  slug: "linq-join",
  titleEn: "LINQ Join & GroupJoin",
  titleBn: "জয়েন (Join) ও গ্রুপ-জয়েন রিলেশনশিপ",
  categoryEn: "13. LINQ",
  categoryBn: "১৩. এলআইএনকিউ (LINQ)",
  categoryDescEn:
    "Language Integrated Query in .NET: filtering, projection, grouping, joins, aggregations, deferred execution, and IEnumerable vs IQueryable.",
  categoryDescBn:
    ".NET এ ল্যাঙ্গুয়েজ ইন্টিগ্রেটেড কুয়েরি (LINQ): ফিল্টারিং, প্রোজেকশন, গ্রুপিং, জয়েন, ডিফার্ড এক্সিকইউশন ও IEnumerable বনাম IQueryable।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Inner equi-joins using hash joins, GroupJoin for 1-to-many hierarchies, simulating SQL LEFT OUTER JOIN with DefaultIfEmpty, and composite keys.",
  descriptionBn:
    "হ্যাশ জয়েন অ্যালগরিদম, ১-টু-মেনি হায়ারার্কিতে GroupJoin, DefaultIfEmpty দিয়ে SQL LEFT OUTER JOIN সিমুলেশন এবং কম্পোজিট কি জয়েন।",
  difficulty: "MEDIUM",
  displayOrder: 6,
  prerequisites: ["linq-groupby"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# LINQ Join & GroupJoin in C#

The **\`Join\`** operator correlates elements from two distinct sequences based on matching equality keys (equivalent to an **SQL INNER JOIN**). Under the hood, the .NET runtime implements an optimized **hash join algorithm**, executing in $\\mathcal{O}(N + M)$ linear time rather than $\\mathcal{O}(N \\times M)$ quadratic nested loops.

---

## Under the Hood: The Hash Join Algorithm

When you call \`outer.Join(inner, ...)\`:

1. **Phase 1: Build Phase**: The entire **inner sequence** is iterated and buffered into an internal hash table indexed by the inner key selector. This phase takes $\\mathcal{O}(M)$ time and consumes $\\mathcal{O}(M)$ memory.
2. **Phase 2: Probe Phase**: The **outer sequence** is streamed lazily. For each outer item, its key is computed and looked up in the internal hash table in $\\mathcal{O}(1)$ average time. All matching elements produce output via the result selector.
3. **Performance Optimization Rule**: Always place the **smaller collection as the inner sequence** if memory is constrained, minimizing the internal hash table footprint.

---

## Join vs GroupJoin

| Feature | \`Join\` (Inner Equi-Join) | \`GroupJoin\` (Hierarchical Join) |
| :--- | :--- | :--- |
| **SQL Equivalent** | \`INNER JOIN\` | \`LEFT OUTER JOIN\` with \`GROUP BY\` |
| **Cardinality** | Flat matched pairs ($1 \\times 1$) | $1$-to-Many: Outer item matched with an \`IEnumerable<TInner>\` |
| **Unmatched Outer Items** | Discarded completely | Emitted with an **empty inner sequence** |
| **Use Case** | Flattened reporting tables | Master-detail parent-child hierarchies |

\`\`\`csharp
record Customer(int Id, string Name);
record Order(int Id, int CustomerId, decimal Amount);

var customers = new[] { new Customer(1, "Rahim"), new Customer(2, "Karim") };
var orders = new[] { new Order(101, 1, 500m), new Order(102, 1, 1200m) };

// GroupJoin groups all orders for a customer into an IEnumerable<Order>
var customerOrders = customers.GroupJoin(
    orders,
    c => c.Id,
    o => o.CustomerId,
    (c, matchedOrders) => new
    {
        CustomerName = c.Name,
        OrderCount = matchedOrders.Count(),
        TotalSpend = matchedOrders.Sum(o => o.Amount)
    }
);
\`\`\`

---

## Simulating SQL LEFT OUTER JOIN with DefaultIfEmpty

To produce a flat Left Outer Join where unmatched outer rows appear with \`null\` inner values, combine \`GroupJoin\`, \`DefaultIfEmpty()\`, and \`SelectMany\`:

\`\`\`csharp
var leftOuterJoin = customers.GroupJoin(
        orders,
        c => c.Id,
        o => o.CustomerId,
        (c, matchedOrders) => new { c, matchedOrders }
    )
    .SelectMany(
        x => x.matchedOrders.DefaultIfEmpty(), // Injects null when empty
        (x, o) => new
        {
            CustomerName = x.c.Name,
            OrderId = o?.Id, // Null if customer has no orders
            Amount = o?.Amount ?? 0m
        }
    );
\`\`\`

---

## Composite Keys Across Multiple Columns

When matching records across multiple properties, project into an **anonymous type** in both key selectors. C# compiler-generated anonymous types automatically implement property-based \`Equals()\` and \`GetHashCode()\`:

\`\`\`csharp
var matches = branchEmployees.Join(
    headquarterRecords,
    b => new { b.CompanyCode, b.NationalId }, // Composite key
    h => new { h.CompanyCode, h.NationalId }, // Composite key
    (b, h) => new { b.Name, h.Title }
);
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Relational Reconciliation of Transactions
*Given a list of accounts and journal entries, perform an inner join to calculate the total posted balance per account, ignoring orphaned entries.*

#### Algorithmic Analysis
1. Define entities for Accounts and Transactions.
2. Correlate accounts with transactions using \`.Join()\` on AccountId.
3. Group and aggregate transactions to compute net debits and credits.

#### C# Implementation

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;

public record Account(int Id, string Title);
public record JournalEntry(int AccountId, decimal Amount);

public class Program
{
    public static void Main()
    {
        var accounts = new List<Account>
        {
            new(1, "Operating Cash"),
            new(2, "Accounts Receivable"),
            new(3, "Retained Earnings")
        };

        var entries = new List<JournalEntry>
        {
            new(1, 15000.00m),
            new(1, -2500.00m),
            new(2, 4000.00m),
            new(99, 100.00m) // Orphan entry (ignored by inner join)
        };

        var accountPostings = accounts.Join(
            entries,
            acc => acc.Id,
            entry => entry.AccountId,
            (acc, entry) => new { acc.Title, entry.Amount }
        )
        .GroupBy(x => x.Title)
        .Select(g => new
        {
            Account = g.Key,
            Balance = g.Sum(x => x.Amount)
        })
        .ToList();

        foreach (var posting in accountPostings)
        {
            Console.WriteLine($"{posting.Account}: {posting.Balance:C}");
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(A + E)$ where $A$ is the number of accounts and $E$ is the number of journal entries.
- **Space Complexity**: $\\mathcal{O}(E)$ to buffer the inner entries sequence in the hash table.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Difference](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D) | Easy | Equi-joining, Mathematical difference |
| ⚪ | Exercism C# | [Hamming](https://exercism.org/tracks/csharp/exercises/hamming) | Easy | Sequence alignment, Positional joining |
| ⚪ | Exercism C# | [Sieve](https://exercism.org/tracks/csharp/exercises/sieve) | Medium | Relational prime filtering, Multiples matching |
| ⚪ | Exercism C# | [Secret Handshake](https://exercism.org/tracks/csharp/exercises/secret-handshake) | Medium | Bitwise joining, Flag-to-action mapping |
`,

  contentBn: `# C# এ জয়েন (Join) ও গ্রুপ-জয়েন রিলেশনশিপ

LINQ-এ দুটি ভিন্ন কালেকশনের উপাদানগুলোর মধ্যে সমতা (Key Equality)-এর ভিত্তিতে সংযোগ স্থাপনের জন্য **\`Join\`** অপারেটর ব্যবহৃত হয় (যা **SQL INNER JOIN** এর সমতুল্য)। আন্ডার দ্য হুডে .NET রানটাইম একটি অত্যন্ত দ্রুতগতির **হ্যাশ জয়েন (Hash Join) অ্যালগরিদম** ব্যবহার করে, যা দ্বিঘাত $\\mathcal{O}(N \\times M)$ সময়ের বদলে লিনিয়ার $\\mathcal{O}(N + M)$ সময়ে কাজ সম্পন্ন করে।

---

## আন্ডার দ্য হুড: হ্যাশ জয়েন অ্যালগরিদম

যখন আপনি \`outer.Join(inner, ...)\` কল করেন:

১. **ফেজ ১: বিল্ড ফেজ (Build Phase)**: প্রথমে সম্পূর্ণ **ইনার সিকোয়েন্স (Inner Sequence)** মেমরিতে রিড করে একটি অভ্যন্তরীণ হ্যাশ টেবিল তৈরি করা হয়, যার ইনডেক্স হয় ইনার কী। এতে $\\mathcal{O}(M)$ সময় এবং $\\mathcal{O}(M)$ মেমোরি খরচ হয়।
২. **ফেজ ২: প্রোব ফেজ (Probe Phase)**: এরপর **আউটার সিকোয়েন্স (Outer Sequence)** অলসভাবে (lazily) স্ট্রিম হতে থাকে। প্রতিটি আউটার উপাদানের কী হ্যাশ টেবিলে গড়ে $\\mathcal{O}(1)$ সময়ে অনুসন্ধান (Probe) করে মিল পাওয়া উপাদানগুলোর ফলাফল তৈরি করা হয়।
৩. **পারফরম্যান্স অপ্টিমাইজেশন নিয়ম**: মেমোরি সাশ্রয় করতে সবসময় **ছোট কালেকশনটিকে ইনার সিকোয়েন্স হিসেবে** পাস করুন, যাতে হ্যাশ টেবিল কম মেমোরি নেয়।

---

## Join বনাম GroupJoin

| বৈশিষ্ট্য | \`Join\` (ইনার একুই-জয়েন) | \`GroupJoin\` (হায়ারার্কিক্যাল জয়েন) |
| :--- | :--- | :--- |
| **SQL সমতুল্য** | \`INNER JOIN\` | \`LEFT OUTER JOIN\` ও \`GROUP BY\` |
| **কার্ডিনালিটি** | সমতল জোড়া উপাদান ($১ \\times ১$) | ১-টু-মেনি: আউটার উপাদানের সাথে সম্পর্কিত \`IEnumerable<TInner>\` |
| **অমিল থাকা উপাদান** | সম্পূর্ণ বাদ পড়ে যায় | **খালি ইনার সিকোয়েন্স** সহ আউটপুটে আসে |
| **ব্যবহার ক্ষেত্র** | সমতল ডেটাবেস রিপোর্ট | মাস্টার-ডিটেইল বা প্যারেন্ট-চাইল্ড রিলেশন |

\`\`\`csharp
record Customer(int Id, string Name);
record Order(int Id, int CustomerId, decimal Amount);

var customers = new[] { new Customer(1, "Rahim"), new Customer(2, "Karim") };
var orders = new[] { new Order(101, 1, 500m), new Order(102, 1, 1200m) };

// GroupJoin গ্রাহকের সাথে তার সমস্ত অর্ডারের কালেকশন গ্রুপ করে
var customerOrders = customers.GroupJoin(
    orders,
    c => c.Id,
    o => o.CustomerId,
    (c, matchedOrders) => new
    {
        CustomerName = c.Name,
        OrderCount = matchedOrders.Count(),
        TotalSpend = matchedOrders.Sum(o => o.Amount)
    }
);
\`\`\`

---

## DefaultIfEmpty দিয়ে SQL LEFT OUTER JOIN সিমুলেশন

যেসব আউটার রেকর্ডের কোনো ইনার ম্যাচ নেই তাদের \`null\` দিয়ে সমতল আউটপুটে আনতে \`GroupJoin\`, \`DefaultIfEmpty()\` এবং \`SelectMany\` সমন্বয় করা হয়:

\`\`\`csharp
var leftOuterJoin = customers.GroupJoin(
        orders,
        c => c.Id,
        o => o.CustomerId,
        (c, matchedOrders) => new { c, matchedOrders }
    )
    .SelectMany(
        x => x.matchedOrders.DefaultIfEmpty(), // ম্যাচ না থাকলে null যুক্ত করে
        (x, o) => new
        {
            CustomerName = x.c.Name,
            OrderId = o?.Id, // কোনো অর্ডার না থাকলে null
            Amount = o?.Amount ?? 0m
        }
    );
\`\`\`

---

## একাধিক কলামে কম্পোজিট কী জয়েন

একাধিক ফিল্ডের ওপর ভিত্তি করে জয়েন করতে হলে উভয় সিলেক্টরে **অ্যানোনিমাস টাইপ** প্রজেক্ট করতে হয়। C#-এর কম্পাইলার স্বয়ংক্রিয়ভাবে অ্যানোনিমাস টাইপে প্রোপার্টি-ভিত্তিক \`Equals()\` এবং \`GetHashCode()\` তৈরি করে দেয়:

\`\`\`csharp
var matches = branchEmployees.Join(
    headquarterRecords,
    b => new { b.CompanyCode, b.NationalId }, // কম্পোজিট কী
    h => new { h.CompanyCode, h.NationalId }, // কম্পোজিট কী
    (b, h) => new { b.Name, h.Title }
);
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ট্রানজ্যাকশন রিলেশনাল রিকনসিলিয়েশন
*একটি অ্যাকাউন্ট তালিকা এবং জার্নাল এন্ট্রির তালিকা দেওয়া আছে। ইনার জয়েনের মাধ্যমে প্রতিটি বৈধ অ্যাকাউন্টের বর্তমান ব্যালেন্স হিসাব করুন।*

#### সমাধান বিশ্লেষণ
১. অ্যাকাউন্ট এবং জার্নাল এন্ট্রির রেকর্ড সংজ্ঞায়িত করা।
২. AccountId-এর ওপর ভিত্তি করে \`.Join()\` এর মাধ্যমে সংযোগ তৈরি করা (অনাথ এন্ট্রি স্বয়ংক্রিয়ভাবে বাদ পড়বে)।
৩. অ্যাকাউন্টের টাইটেল অনুযায়ী গ্রুপ করে ব্যালেন্সের যোগফল বের করা।

#### C# সমাধান

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;

public record Account(int Id, string Title);
public record JournalEntry(int AccountId, decimal Amount);

public class Program
{
    public static void Main()
    {
        var accounts = new List<Account>
        {
            new(1, "Operating Cash"),
            new(2, "Accounts Receivable"),
            new(3, "Retained Earnings")
        };

        var entries = new List<JournalEntry>
        {
            new(1, 15000.00m),
            new(1, -2500.00m),
            new(2, 4000.00m),
            new(99, 100.00m) // অনাথ এন্ট্রি (বাদ পড়বে)
        };

        var accountPostings = accounts.Join(
            entries,
            acc => acc.Id,
            entry => entry.AccountId,
            (acc, entry) => new { acc.Title, entry.Amount }
        )
        .GroupBy(x => x.Title)
        .Select(g => new
        {
            Account = g.Key,
            Balance = g.Sum(x => x.Amount)
        })
        .ToList();

        foreach (var posting in accountPostings)
        {
            Console.WriteLine($"{posting.Account}: {posting.Balance:C}");
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(A + E)$, যেখানে $A$ অ্যাকাউন্টের সংখ্যা এবং $E$ হলো জার্নাল এন্ট্রির সংখ্যা।
- **স্পেস কমপ্লেক্সিটি**: হ্যাশ টেবিলে ইনার কালেকশন বাফার করতে $\\mathcal{O}(E)$ মেমোরি প্রয়োজন।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Difference](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D) | Easy | Equi-joining, Mathematical difference |
| ⚪ | Exercism C# | [Hamming](https://exercism.org/tracks/csharp/exercises/hamming) | Easy | Sequence alignment, Positional joining |
| ⚪ | Exercism C# | [Sieve](https://exercism.org/tracks/csharp/exercises/sieve) | Medium | Relational prime filtering, Multiples matching |
| ⚪ | Exercism C# | [Secret Handshake](https://exercism.org/tracks/csharp/exercises/secret-handshake) | Medium | Bitwise joining, Flag-to-action mapping |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Difference",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/D",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["LINQ", "Join", "Math"],
      solutionEn:
        "Compute relational product differences (A*B)-(C*D) using strong long integer evaluation to prevent integer overflow.",
      solutionBn:
        "পূর্ণসংখ্যার ওভারফ্লো এড়াতে ৬৪-বিট লং ইন্টিজারে (A*B)-(C*D) এর রিলেশনাল গুণফলের বিয়োগফল বের করুন।",
    },
    {
      source: "Exercism C#",
      name: "Hamming",
      url: "https://exercism.org/tracks/csharp/exercises/hamming",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["LINQ", "Zip", "Join"],
      solutionEn:
        "Calculate the Hamming distance between two DNA strands by joining or zipping corresponding character positions.",
      solutionBn:
        "দুটি DNA সিকোয়েন্সের একই অবস্থানের ক্যারেক্টার মিলিয়ে বা জিপ করে হ্যামিং ডিসটেন্স গণনা করুন।",
    },
    {
      source: "Exercism C#",
      name: "Sieve",
      url: "https://exercism.org/tracks/csharp/exercises/sieve",
      difficulty: "MEDIUM",
      company: "Enosis Solutions",
      tags: ["LINQ", "Hash Join", "Primes"],
      solutionEn:
        "Find all prime numbers up to a given limit by eliminating composite multiples using hash sets or Join filtering.",
      solutionBn:
        "হ্যাশ সেট অথবা Join ফিল্টারিং ব্যবহার করে গুণিতক সংখ্যাগুলো বাদ দিয়ে মৌলিক সংখ্যাগুলো নির্ণয় করুন।",
    },
    {
      source: "Exercism C#",
      name: "Secret Handshake",
      url: "https://exercism.org/tracks/csharp/exercises/secret-handshake",
      difficulty: "MEDIUM",
      company: "BJIT Group",
      tags: ["LINQ", "Join", "Bitwise"],
      solutionEn:
        "Convert a decimal number to a sequence of secret handshake actions by correlating bitmask flags to action strings.",
      solutionBn:
        "বিটমাস্ক ফ্ল্যাগের সাথে অ্যাকশন স্ট্রিংয়ের ম্যাপিং করে একটি ডেসিমাল সংখ্যাকে সিক্রেট হ্যান্ডশেক অ্যাকশনে রূপান্তর করুন।",
    },
  ],
};
