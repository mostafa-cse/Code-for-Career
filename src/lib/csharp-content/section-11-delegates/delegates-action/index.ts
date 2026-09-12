import type { LocalLesson } from "@/lib/lessons-data";

export const delegatesActionLesson: LocalLesson = {
  slug: "delegates-action",
  titleEn: "Action<T> Delegate",
  titleBn: "অ্যাকশন (Action<T>) জেনেরিক ডেলিগেট",
  categoryEn: "11. Delegates",
  categoryBn: "১১. ডেলিগেট (Delegates)",
  categoryDescEn:
    "Type-safe function pointers in .NET: single-cast and multicast delegates, built-in Action, Func, and Predicate generic delegates.",
  categoryDescBn:
    ".NET এ টাইপ-নিরাপদ ফাংশন পয়েন্টার: সিঙ্গেল ও মাল্টিকাস্ট ডেলিগেট, বিল্ট-ইন Action, Func এবং Predicate জেনেরিক ডেলিগেট।",
  categoryPriority: "CORE",
  descriptionEn:
    "Standard BCL delegate for void-returning methods, 17 generic overloads, contravariance (Action<in T>), side-effect callbacks, and List.ForEach benchmarks.",
  descriptionBn:
    "ভয়েড রিটার্নকারী মেথডের BCL ডেলিগেট, ১৭টি জেনেরিক ওভারলোড, কন্ট্রাভ্যারিয়েন্স (Action<in T>), সাইড-ইফেক্ট কলব্যাক ও পারফরম্যান্স বিশ্লেষণ।",
  difficulty: "EASY",
  displayOrder: 3,
  prerequisites: ["delegates-basic"],
  estimatedMinutes: 15,
  lastUpdated: "Recently updated",
  contentEn: `# Action<T> Delegate in C#

\`System.Action\` is a family of built-in generic delegates in .NET representing any method that accepts between $0$ and $16$ parameters and **returns \`void\`** (does not return a value).

Introduced in .NET 3.5, \`Action\` eliminated the need to declare thousands of custom delegate types throughout application codebases.

---

## The 17 Generic Overloads

The Base Class Library (BCL) defines 17 overloaded generic variants of \`Action\`:
- \`Action\` (parameterless)
- \`Action<T>\` (1 parameter)
- \`Action<T1, T2>\` (2 parameters)
- $\\dots$
- \`Action<T1, T2, ..., T16>\` (up to 16 parameters)

Whenever a callback performs an action that produces **side effects** (such as updating the UI, emitting a log, saving to a database, or sending a network packet) without returning data, **always use \`Action\`**.

---

## Contravariance: \`Action<in T>\`

The type parameters in \`Action\` are decorated with the \`in\` keyword, making them **contravariant**:

\`\`\`csharp
public delegate void Action<in T>(T obj);
\`\`\`

Contravariance allows you to pass a delegate expecting a less derived (more general) type where a delegate expecting a more derived (more specific) type is required:

\`\`\`csharp
public class Animal { }
public class Dog : Animal { }

Action<Animal> inspectAnimal = animal => Console.WriteLine(animal.GetType().Name);

// Legal due to contravariance: A method that can handle ANY Animal can safely handle a Dog!
Action<Dog> inspectDog = inspectAnimal;
inspectDog(new Dog()); // Executes inspectAnimal safely
\`\`\`

---

## High-Performance Callbacks & \`List<T>.ForEach\`

\`List<T>\` exposes a \`.ForEach(Action<T> action)\` method:

\`\`\`csharp
var scores = new List<int> { 90, 85, 78, 92 };

// Concise functional iteration:
scores.ForEach(score => Console.WriteLine($"Processed: {score}"));
\`\`\`

> **Performance Note**: While \`List<T>.ForEach\` is clean, standard language \`foreach\` loops remain slightly faster in high-throughput loops because the JIT compiler can inline array indexing and avoid the delegate invocation dispatch overhead.

---

## Practical Problem Walkthrough

### Problem: Codeforces Assiut Sheet #1 Problem G (Summation from 1 to N)
*Given a number $N$. Print the summation of the numbers that is between $1$ and $N$ inclusive ($\sum_{i=1}^N i$).*
*Constraint: $1 \\le N \\le 10^9$. A naive loop will Time Out ($O(N)$). Calculate in $O(1)$ using the arithmetic series formula $\\frac{N(N+1)}{2}$ and dispatch results through an \`Action<long>\` reporting pipeline.*

#### Algorithmic Analysis
1. $N \\le 10^9$ means $N(N+1)$ can reach $10^{18}$, which exceeds the 32-bit signed integer limit ($2 \\times 10^9$). We must compute using 64-bit \`long\`.
2. Closed-form formula: \`sum = (n * (n + 1)) / 2\`.
3. Dispatch via an \`Action<long>\` callback to separate math computation from formatting.

#### C# Implementation

\`\`\`csharp
using System;

public class Program
{
    public static void ComputeSummation(long n, Action<long> onResultComputed)
    {
        // O(1) arithmetic summation formula
        long totalSum = (n * (n + 1)) / 2;
        onResultComputed(totalSum);
    }

    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (long.TryParse(input.Trim(), out long n))
        {
            // Action callback formats and prints result
            ComputeSummation(n, sum => Console.WriteLine(sum));
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$, the arithmetic series formula computes in constant time without looping.
- **Space Complexity**: $\\mathcal{O}(1)$, registers and primitive stack frames only.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Summation from 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G) | Easy | $\\mathcal{O}(1)$ Math, 64-bit arithmetic, Action callbacks |
| ⚪ | Codeforces | [Assiut Sheet #1: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | Modulo 10 extraction, Basic inputs, Action processing |
| ⚪ | Exercism C# | [Log Levels](https://exercism.org/tracks/csharp/exercises/log-levels) | Easy | String parsing, Action notification, Message formatting |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | String sanitization, Pipeline actions, StringBuilder |
`,

  contentBn: `# C# এ অ্যাকশন (Action<T>) জেনেরিক ডেলিগেট

\`System.Action\` হলো .NET এর একটি বিল্ট-ইন জেনেরিক ডেলিগেট যা $০$ থেকে $১৬$টি প্যারামিটার গ্রহণ করতে পারে এবং সর্বদা **\`void\` রিটার্ন করে** (অর্থাৎ কোনো মান ফেরত দেয় না)।

.NET ৩.৫ সংস্করণে \`Action\` যুক্ত হওয়ার ফলে প্রতিটি নতুন মেথড সিগনেচারের জন্য আলাদা কাস্টম ডেলিগেট লেখার ঝামেলা দূর হয়।

---

## ১৭টি জেনেরিক ওভারলোড

Base Class Library (BCL)-এ \`Action\` এর ১৭টি ভিন্ন ওভারলোড রয়েছে:
- \`Action\` (প্যারামিটারহীন)
- \`Action<T>\` (১টি প্যারামিটার)
- \`Action<T1, T2>\` (২টি প্যারামিটার)
- $\\dots$
- \`Action<T1, T2, ..., T16>\` (সর্বোচ্চ ১৬টি প্যারামিটার)

কোনো ফাংশন যখন কোনো মান রিটার্ন না করে কেবল **পার্শ্বপ্রতিক্রিয়া বা সাইড-ইফেক্ট** সম্পন্ন করে (যেমন: কনসোলে লগ প্রিন্ট করা, ডাটাবেজে রেকর্ড সেভ করা, ইমেইল পাঠানো ইত্যাদি), তখন সবসময় **\`Action\` ব্যবহার করা উচিত**।

---

## কন্ট্রাভ্যারিয়েন্স (Contravariance): \`Action<in T>\`

\`Action\` এর টাইপ প্যারামিটারে \`in\` কি-ওয়ার্ড রয়েছে, যা এটিকে **কন্ট্রাভ্যারিয়েন্ট** করে তোলে:

\`\`\`csharp
public delegate void Action<in T>(T obj);
\`\`\`

এর ফলে কোনো সাধারণ প্যারেন্ট ক্লাসের ডেলিগেটকে চাইল্ড ক্লাসের ডেলিগেটে স্বয়ংক্রিয়ভাবে অ্যাসাইন করা যায়:

\`\`\`csharp
public class Animal { }
public class Dog : Animal { }

Action<Animal> inspectAnimal = animal => Console.WriteLine(animal.GetType().Name);

// কন্ট্রাভ্যারিয়েন্সের কারণে এটি সম্পূর্ণ বৈধ:
Action<Dog> inspectDog = inspectAnimal;
inspectDog(new Dog());
\`\`\`

---

## হাই-পারফরম্যান্স কলব্যাক ও \`List<T>.ForEach\`

\`List<T>\` কালেকশনে \`.ForEach(Action<T> action)\` মেথড রয়েছে:

\`\`\`csharp
var scores = new List<int> { 90, 85, 78, 92 };

// সংক্ষেপে অ্যাকশন কলব্যাক দিয়ে ইটারেশন:
scores.ForEach(score => Console.WriteLine($"Processed: {score}"));
\`\`\`

> **পারফরম্যান্স নোট**: \`List<T>.ForEach\` কোডকে সংক্ষিপ্ত করলেও সাধারণ \`foreach\` লুপ কিছুটা দ্রুত কাজ করে, কারণ JIT কম্পাইলার সাধারণ লুপে মেথড কল ওভারহেড ইনলাইন করতে পারে।

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: Codeforces Assiut Sheet #1 Problem G (Summation from 1 to N)
*একটি সংখ্যা $N$ দেওয়া থাকবে। $1$ থেকে $N$ পর্যন্ত সকল সংখ্যার যোগফল নির্ণয় করতে হবে ($\sum_{i=1}^N i$)।*
*সীমাবদ্ধতা: $1 \\le N \\le 10^9$। সাধারণ লুপ চালালে $10^9$ বার ঘোরার কারণে Time Limit Exceeded (TLE) হবে। গাণিতিক সূত্র $\\frac{N(N+1)}{2}$ দিয়ে $\\mathcal{O}(1)$ সময়ে বের করুন এবং \`Action<long>\` কলব্যাকের মাধ্যমে আউটপুট নিশ্চিত করুন।*

#### সমাধান বিশ্লেষণ
১. $N \\le 10^9$ হওয়ায় $N(N+1)$ এর মান $10^{18}$ ছাড়িয়ে যেতে পারে। ৩২-বিট ইন্টিজারে ওভারফ্লো হবে, তাই অবশ্যই ৬৪-বিট \`long\` ব্যবহার করতে হবে।
২. গাণিতিক সূত্র: \`sum = (n * (n + 1)) / 2\`।
৩. \`Action<long>\` কলব্যাকের মাধ্যমে হিসাব ও আউটপুট আলাদা রাখা।

#### C# সমাধান

\`\`\`csharp
using System;

public class Program
{
    public static void ComputeSummation(long n, Action<long> onResultComputed)
    {
        // O(1) যোগফল সূত্র
        long totalSum = (n * (n + 1)) / 2;
        onResultComputed(totalSum);
    }

    public static void Main()
    {
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input))
        {
            return;
        }

        if (long.TryParse(input.Trim(), out long n))
        {
            ComputeSummation(n, sum => Console.WriteLine(sum));
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, কোনো লুপ ছাড়াই ধ্রুবক সময়ে সমীকরণ দিয়ে উত্তর বের হয়।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$, স্ট্যাকে কেবল প্রিমিটিভ রেজিস্টার ব্যবহৃত হয়।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :--- | :--- |
| ⚪ | Codeforces | [Assiut Sheet #1: Summation from 1 to N](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G) | Easy | $\\mathcal{O}(1)$ Math, 64-bit arithmetic, Action callbacks |
| ⚪ | Codeforces | [Assiut Sheet #1: Digits Summation](https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F) | Easy | Modulo 10 extraction, Basic inputs, Action processing |
| ⚪ | Exercism C# | [Log Levels](https://exercism.org/tracks/csharp/exercises/log-levels) | Easy | String parsing, Action notification, Message formatting |
| ⚪ | Exercism C# | [Squeaky Clean](https://exercism.org/tracks/csharp/exercises/squeaky-clean) | Easy | String sanitization, Pipeline actions, StringBuilder |
`,
  resources: [],
  problems: [
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Summation from 1 to N",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/G",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Math", "64-bit", "Action"],
      solutionEn:
        "Compute the arithmetic series summation in O(1) using N * (N + 1) / 2 with 64-bit integers to prevent overflow, dispatching via an Action callback.",
      solutionBn:
        "ওভারফ্লো এড়াতে ৬৪-বিট পূর্ণসংখ্যা দিয়ে N * (N + 1) / 2 সূত্র প্রয়োগ করে O(1) সময়ে যোগফল বের করুন এবং Action কলব্যাকের মাধ্যমে ফলাফল আউটপুট দিন।",
    },
    {
      source: "Codeforces",
      name: "Assiut Sheet #1: Digits Summation",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/F",
      difficulty: "EASY",
      company: "Brain Station 23",
      tags: ["Math", "Modulo", "Parsing"],
      solutionEn:
        "Extract the last digits of two large numbers using modulo 10 arithmetic, adding them and printing the result via an action consumer.",
      solutionBn:
        "মডিউলো ১০ অপারেশনের সাহায্যে দুটি বড় সংখ্যার শেষ অঙ্ক বের করে যোগ করুন এবং অ্যাকশন ডেলিগেটের মাধ্যমে প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Log Levels",
      url: "https://exercism.org/tracks/csharp/exercises/log-levels",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Strings", "Action", "Parsing"],
      solutionEn:
        "Parse log level prefixes from raw log messages, formatting clean output strings and invoking action callbacks for critical errors.",
      solutionBn:
        "লগ মেসেজ থেকে লগ লেভেল আলাদা করে স্ট্রিং পরিষ্কার করুন এবং সংকটজনক এররের ক্ষেত্রে অ্যাকশন কলব্যাক কার্যকর করুন।",
    },
    {
      source: "Exercism C#",
      name: "Squeaky Clean",
      url: "https://exercism.org/tracks/csharp/exercises/squeaky-clean",
      difficulty: "EASY",
      company: "Samsung R&D Institute Bangladesh",
      tags: ["Strings", "StringBuilder", "Sanitization"],
      solutionEn:
        "Transform messy identifier strings into valid camelCase formats by stripping control characters and converting whitespace to underscores.",
      solutionBn:
        "ফাঁকা স্থানকে আন্ডারস্কোরে এবং কন্ট্রোল ক্যারেক্টার অপসারণের মাধ্যমে স্ট্রিংকে ক্যামেলকেস ফরম্যাটে রূপান্তর করুন।",
    },
  ],
};
