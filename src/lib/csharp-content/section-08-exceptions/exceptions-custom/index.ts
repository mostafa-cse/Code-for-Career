import type { LocalLesson } from "@/lib/lessons-data";

export const exceptionsCustomLesson: LocalLesson = {
  slug: "exceptions-custom",
  titleEn: "Custom Exceptions",
  titleBn: "কাস্টম এক্সেপশন ও ডোমেইন এরর",
  categoryEn: "08. Exception Handling",
  categoryBn: "০৮. এক্সেপশন ও ত্রুটি হ্যান্ডলিং",
  categoryDescEn:
    "Structured error handling in .NET: try/catch/finally blocks, stack trace preservation, custom domain exceptions, and exception filters.",
  categoryDescBn:
    ".NET এ ত্রুটি হ্যান্ডলিং: ট্রাই-ক্যাচ-ফাইনালি ব্লক, স্ট্যাক ট্রেস সংরক্ষণ (throw vs throw ex), কাস্টম এক্সেপশন ও এক্সেপশন ফিল্টার।",
  categoryPriority: "NORMAL",
  descriptionEn:
    "Creating domain-specific exceptions, inheriting from System.Exception, the 3 canonical constructors, rich domain properties, and modern serialization.",
  descriptionBn:
    "ডোমেইন-নির্দিষ্ট কাস্টম এক্সেপশন তৈরি, System.Exception ইনহেরিটেন্স, ৩টি স্ট্যান্ডার্ড কনস্ট্রাক্টর এবং আধুনিক ডোমেইন প্রোপার্টি।",
  difficulty: "EASY",
  displayOrder: 3,
  prerequisites: ["exceptions-try-catch-finally"],
  estimatedMinutes: 25,
  lastUpdated: "Recently updated",
  contentEn: `# Custom Exceptions & Domain Errors in C#

In enterprise software engineering (Domain-Driven Design and Clean Architecture), relying solely on generic runtime exceptions like \`InvalidOperationException\` obscures business intent.

**Custom domain exceptions** represent explicit business rule violations (e.g. \`InsufficientBalanceException\`, \`OrderExpiredException\`, \`DuplicateUserException\`), enabling clean mapping to HTTP status codes (400, 404, 409) in web APIs.

---

## The Three Canonical Constructors

Every custom exception must inherit from \`System.Exception\` and implement the three standard constructors:

\`\`\`csharp
public class InsufficientBalanceException : Exception
{
    // 1. Parameterless default constructor
    public InsufficientBalanceException() 
        : base("The account balance is insufficient for this transaction.") { }

    // 2. Custom message constructor
    public InsufficientBalanceException(string message) 
        : base(message) { }

    // 3. Inner exception constructor (preserves lower-level root cause)
    public InsufficientBalanceException(string message, Exception innerException) 
        : base(message, innerException) { }

    // Structured domain properties (init-only)
    public decimal CurrentBalance { get; init; }
    public decimal AttemptedAmount { get; init; }
    public string AccountNumber { get; init; } = string.Empty;
}
\`\`\`

---

## Modern .NET Serialization Note (SYSLIB0051)

In legacy .NET Framework, custom exceptions were required to implement \`[Serializable]\` and a protected constructor taking \`SerializationInfo\` and \`StreamingContext\`.

> **Modern .NET 8 / .NET 9 Standard**:
> The CLR has **obsoleted \`BinaryFormatter\` and \`[Serializable]\`** (warning SYSLIB0051) due to critical remote code execution vulnerabilities. In modern .NET, simply define plain classes or records inheriting from \`Exception\`.

---

## Real-World Banking Invariant Enforcement

\`\`\`csharp
public class BankAccount
{
    public string AccountId { get; }
    public decimal Balance { get; private set; }

    public BankAccount(string accountId, decimal initialDeposit)
    {
        AccountId = accountId;
        Balance = initialDeposit;
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount), "Withdrawal amount must be positive.");
        }

        if (amount > Balance)
        {
            // Throwing rich custom domain exception with structured diagnostic context
            throw new InsufficientBalanceException($"Withdrawal of {amount:C} exceeds current balance of {Balance:C}.")
            {
                CurrentBalance = Balance,
                AttemptedAmount = amount,
                AccountNumber = AccountId
            };
        }

        Balance -= amount;
    }
}
\`\`\`

---

## Practical Problem Walkthrough

### Problem: Bank Account Withdrawal Invariant Guarding
*Model an account withdrawal system that catches domain violations, prints structured diagnostic metrics, and gracefully recovers.*

#### Problem Analysis
- Input: Account initial balance, withdrawal attempt.
- Logic: If withdrawal exceeds balance, throw \`InsufficientBalanceException\` carrying current and attempted amounts.
- Catch: Intercept the domain error, log properties, and ensure balance integrity.

#### C# Implementation

\`\`\`csharp
using System;
using System.Globalization;

public class DomainExceptionDemo
{
    public static void Main()
    {
        BankAccount account = new BankAccount("ACC-9042", 500.00m);

        try
        {
            Console.WriteLine($"Current Balance: {account.Balance}");
            account.Withdraw(750.00m); // Exceeds balance!
        }
        catch (InsufficientBalanceException ex)
        {
            Console.WriteLine($"[Domain Error] {ex.Message}");
            Console.WriteLine($"Account: {ex.AccountNumber}");
            Console.WriteLine($"Deficit: {ex.AttemptedAmount - ex.CurrentBalance}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Unexpected Error] {ex.Message}");
        }
    }
}
\`\`\`

#### Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$ — constant time check and exception instantiation.
- **Space Complexity**: $\\mathcal{O}(1)$ — allocation of a single domain exception object.

---

## Recommended Practice Problems

| Status | Source | Problem Name | Difficulty | Focus Concepts |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Calculator Conundrum](https://exercism.org/tracks/csharp/exercises/calculator-conundrum) | Easy | Custom Exceptions, Argument Checking |
| ⚪ | Codeforces Assiut | [Problem C: Even, Odd, Positive and Negative](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/C) | Easy | Parity Checks, Counter Aggregations |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Medium | State Invariants, Concurrency, Custom Errors |
| ⚪ | Exercism C# | [Ledger](https://exercism.org/tracks/csharp/exercises/ledger) | Medium | Refactoring, Parsing, Domain Models |
`,

  contentBn: `# C# এ কাস্টম এক্সেপশন ও ডোমেইন এরর

এন্টারপ্রাইজ সফটওয়্যার আর্কিটেকচারে (যেমন Domain-Driven Design এবং Clean Architecture) সাধারণ সিস্টেম এক্সেপশন (যেমন \`InvalidOperationException\`) ব্যবহার না করে **কাস্টম ডোমেইন এক্সেপশন (Custom Domain Exceptions)** ব্যবহার করা হয়।

এটি ব্যবসায়িক নীতি লঙ্ঘন (যেমন \`InsufficientBalanceException\`, \`OrderExpiredException\`) স্পষ্টভাবে প্রকাশ করে এবং ওয়েব এপিআইতে স্বয়ংক্রিয়ভাবে সঠিক HTTP স্ট্যাটাস কোডে (400, 404, 409) রূপান্তর করতে সাহায্য করে।

---

## ৩টি আদর্শ বা ক্যানোনিকাল কনস্ট্রাক্টর

প্রতিটি কাস্টম এক্সেপশন অবশ্যই \`System.Exception\` থেকে ইনহেরিট করবে এবং নিচের তিনটি কনস্ট্রাক্টর ইমপ্লিমেন্ট করবে:

\`\`\`csharp
public class InsufficientBalanceException : Exception
{
    // ১. প্যারামিটারহীন ডিফল্ট কনস্ট্রাক্টর
    public InsufficientBalanceException() 
        : base("The account balance is insufficient for this transaction.") { }

    // ২. কাস্টম মেসেজ কনস্ট্রাক্টর
    public InsufficientBalanceException(string message) 
        : base(message) { }

    // ৩. ইনার এক্সেপশন কনস্ট্রাক্টর (মূল টেকনিক্যাল কারণ অক্ষুণ্ণ রাখে)
    public InsufficientBalanceException(string message, Exception innerException) 
        : base(message, innerException) { }

    // ডোমেইন নির্দিষ্ট প্রোপার্টিজ
    public decimal CurrentBalance { get; init; }
    public decimal AttemptedAmount { get; init; }
    public string AccountNumber { get; init; } = string.Empty;
}
\`\`\`

---

## আধুনিক .NET সিরিয়ালাইজেশন আপডেট (SYSLIB0051)

পুরনো .NET Framework-এ কাস্টম এক্সেপশনে \`[Serializable]\` অ্যাট্রিবিউট এবং \`SerializationInfo\` কনস্ট্রাক্টর লেখা বাধ্যতামূলক ছিল।

> **আধুনিক .NET 8 / 9 নির্দেশিকা**:
> নিরাপত্তা ঝুঁকির কারণে .NET রানটাইমে \`BinaryFormatter\` অবসোলেট (SYSLIB0051) করা হয়েছে। আধুনিক সি# এ কাস্টম এক্সেপশনের জন্য বাড়তি কোনো সিরিয়ালাইজেশন কোড লেখার প্রয়োজন নেই; সরাসরি সাধারণ ক্লাস বা রেকর্ড তৈরি করলেই যথেষ্ট।

---

## ব্যাংকিং সিস্টেমে বাস্তব প্রয়োগ

\`\`\`csharp
public class BankAccount
{
    public string AccountId { get; }
    public decimal Balance { get; private set; }

    public BankAccount(string accountId, decimal initialDeposit)
    {
        AccountId = accountId;
        Balance = initialDeposit;
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount), "Withdrawal amount must be positive.");
        }

        if (amount > Balance)
        {
            // ডোমেইন এক্সেপশন তৈরি ও বিস্তারিত তথ্য প্রদান
            throw new InsufficientBalanceException($"Withdrawal of {amount:C} exceeds current balance of {Balance:C}.")
            {
                CurrentBalance = Balance,
                AttemptedAmount = amount,
                AccountNumber = AccountId
            };
        }

        Balance -= amount;
    }
}
\`\`\`

---

## বাস্তব সমস্যা সমাধান ও বিস্তারিত বিশ্লেষণ

### সমস্যা: ব্যাংক অ্যাকাউন্ট উত্তোলন নীতি যাচাই
*একটি অ্যাকাউন্টে ব্যালেন্সের অতিরিক্ত অর্থ তোলার চেষ্টা করলে কাস্টম ডোমেইন এক্সেপশন তৈরি করে ত্রুটি হ্যান্ডেল করতে হবে।*

#### সমাধান বিশ্লেষণ
- \`InsufficientBalanceException\` এর ভেতর বর্তমান ব্যালেন্স ও কাঙ্ক্ষিত পরিমাণ সংরক্ষণ করে কলারকে সম্পূর্ণ ডায়াগনস্টিক রিপোর্ট দেওয়া হয়েছে।

#### সি# সমাধান কোড

\`\`\`csharp
using System;
using System.Globalization;

public class DomainExceptionDemo
{
    public static void Main()
    {
        BankAccount account = new BankAccount("ACC-9042", 500.00m);

        try
        {
            Console.WriteLine($"Current Balance: {account.Balance}");
            account.Withdraw(750.00m); // ব্যালেন্সের অতিরিক্ত!
        }
        catch (InsufficientBalanceException ex)
        {
            Console.WriteLine($"[Domain Error] {ex.Message}");
            Console.WriteLine($"Account: {ex.AccountNumber}");
            Console.WriteLine($"Deficit: {ex.AttemptedAmount - ex.CurrentBalance}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Unexpected Error] {ex.Message}");
        }
    }
}
\`\`\`

#### জটিলতা বিশ্লেষণ
- **টাইম কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ — সাধারণ শর্ত যাচাই ও এক্সেপশন অবজেক্ট তৈরি।
- **স্পেস কমপ্লেক্সিটি**: $\\mathcal{O}(1)$ অতিরিক্ত মেমোরি।

---

## অনুশীলনের জন্য নির্বাচিত সমস্যা

| স্ট্যাটাস | সোর্স | সমস্যার নাম | কাঠিন্য | মূল ধারণা |
| :---: | :--- | :--- | :---: | :--- |
| ⚪ | Exercism C# | [Calculator Conundrum](https://exercism.org/tracks/csharp/exercises/calculator-conundrum) | Easy | Custom Exceptions, Argument Checking |
| ⚪ | Codeforces Assiut | [Problem C: Even, Odd, Positive and Negative](https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/C) | Easy | Parity Checks, Counter Aggregations |
| ⚪ | Exercism C# | [Bank Account](https://exercism.org/tracks/csharp/exercises/bank-account) | Medium | State Invariants, Concurrency, Custom Errors |
| ⚪ | Exercism C# | [Ledger](https://exercism.org/tracks/csharp/exercises/ledger) | Medium | Refactoring, Parsing, Domain Models |
`,
  resources: [],
  problems: [
    {
      source: "Exercism C#",
      name: "Calculator Conundrum",
      url: "https://exercism.org/tracks/csharp/exercises/calculator-conundrum",
      difficulty: "EASY",
      company: "Enosis Solutions",
      tags: ["Custom Exceptions", "Validation", "OOP"],
      solutionEn: "Create domain-specific calculation exceptions to handle unsupported operations and divide-by-zero rules.",
      solutionBn: "অননুমোদিত অপারেশন ও ডিভাইড-বাই-জিরো হ্যান্ডেল করতে ডোমেইন এক্সেপশন তৈরি করুন।",
    },
    {
      source: "Codeforces Assiut Sheet #2",
      name: "Problem C: Even, Odd, Positive and Negative",
      url: "https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/C",
      difficulty: "EASY",
      company: "Therap Services",
      tags: ["Conditionals", "Math", "Counters"],
      solutionEn: "Classify a series of integer inputs into even, odd, positive, and negative count buckets.",
      solutionBn: "ধারাবাহিক সংখ্যার ইনপুট থেকে জোড়, বিজোড়, ধনাত্মক ও ঋণাত্মক সংখ্যার গণনা প্রিন্ট করুন।",
    },
    {
      source: "Exercism C#",
      name: "Bank Account",
      url: "https://exercism.org/tracks/csharp/exercises/bank-account",
      difficulty: "MEDIUM",
      company: "Brain Station 23",
      tags: ["Custom Exceptions", "Locking", "Invariants"],
      solutionEn: "Enforce thread-safe account balances throwing custom exceptions when accessing closed accounts.",
      solutionBn: "বন্ধ অ্যাকাউন্টে লেনদেন প্রতিরোধে কাস্টম এক্সেপশন ও থ্রেড-সেফ লকিং প্রয়োগ করুন।",
    },
    {
      source: "Exercism C#",
      name: "Ledger",
      url: "https://exercism.org/tracks/csharp/exercises/ledger",
      difficulty: "MEDIUM",
      company: "Kaz Software",
      tags: ["Domain Models", "Refactoring", "Clean Code"],
      solutionEn: "Refactor legacy formatting code into clean domain objects with structured validation checks.",
      solutionBn: "লিগ্যাসি কোড রিফ্যাক্টর করে পরিচ্ছন্ন ডোমেইন মডেল ও ভ্যালিডেশন এক্সেপশন কাঠামো তৈরি করুন।",
    },
  ],
};
