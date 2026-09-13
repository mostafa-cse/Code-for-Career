import type { LocalLesson } from "@/lib/lessons-data";

export const gitBranchingLesson: LocalLesson = {
    slug: "git-branching",
    titleEn: "Branching: Creation, Switching, Deletion & Naming Conventions",
    titleBn: "ব্রাঞ্চিং: তৈরি, সুইচিং, ডিলিট ও নেইমিং কনভেনশন",
    categoryEn: "5. Branching Strategies",
    categoryBn: "৫. ব্রাঞ্চিং ও ওয়ার্কফ্লো কৌশল",
    categoryDescEn: "What is a branch, branch pointers, git branch, git switch, git checkout, branch cleanup, and production naming conventions.",
    categoryDescBn: "ব্রাঞ্চের অভ্যন্তরীণ পয়েন্টার গঠন, ব্রাঞ্চ তৈরি, সুইচিং, ব্রাঞ্চ ডিলিট এবং ইন্ডাস্ট্রির নেইমিং কনভেনশন।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Understand how lightweight Git branches are, how to manage them with git switch, and how to follow enterprise branch naming conventions.",
    descriptionBn: "গিটের দ্রুতগতির ব্রাঞ্চিং মেকানিজম, git switch এর ব্যবহার এবং এন্টারপ্রাইজ ব্রাঞ্চ নেইমিং কনভেনশন আয়ত্ত করুন।",
    difficulty: "EASY",
    displayOrder: 5,
    prerequisites: ["git-commits"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Git Branching — Branches in a Nutshell",
        url: "https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell",
        description: "Deep explanation of Git branch pointers and HEAD.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "What actually is a Git branch under the hood?",
        url: null,
        difficulty: "MEDIUM",
        company: "Samsung R&D (SRBD)",
        tags: ["Git", "Branch Internals", "Refs"],
        solutionEn: "In Git, a branch is not a full copy of the codebase. It is simply a lightweight 41-byte text file inside '.git/refs/heads/<branch-name>' containing the 40-character hexadecimal SHA-1 commit hash of its latest commit. Creating a branch is an instant O(1) pointer write.",
        solutionBn: "গিটে ব্রাঞ্চ কোনো কোডের ভারী কপি নয়। এটি শুধুমাত্র একটি ৪১ বাইটের টেক্সট ফাইল যা '.git/refs/heads/' ফোল্ডারে থাকে এবং এতে সর্বশেষ কমিটের ৪০-ক্যারেক্টার হ্যাশ লেখা থাকে। ফলে গিটে ব্রাঞ্চ তৈরি করা একটি তাৎক্ষণিক O(1) মেমোরি অপারেশন।",
      },
    ],
    contentEn: `# Branching: What is a Branch, git branch, switch vs checkout, Deletion & Naming

Branching is Git's **superpower**. Unlike older version control systems where creating a branch meant copying hundreds of megabytes of files, Git branches are virtually weightless, instantaneous, and cost zero extra disk space.

---

## 1. What is a Branch?

### The Tree Analogy
Think of a tree trunk growing straight upwards. That trunk is your main, stable production code (**\`main\`**).
When you want to experiment with a new feature, you grow a **side branch** off the trunk:
* You can trim, shape, or even break that side branch without harming the sturdy trunk.
* If the feature is successful, you graft (**merge**) the branch back into the trunk.
* If the experiment fails, you simply saw off (**delete**) the branch—the trunk never noticed anything happened.

### What is a Branch under the hood?
In Git, a branch is **NOT a copy of your files**. It is simply a lightweight, movable pointer to a specific commit!
Internally, a branch is just a tiny 41-byte text file stored in \`.git/refs/heads/<branch-name>\` containing the 40-character SHA hash of its latest commit.

\`\`\`
          [main] ─────────────────────┐
                                      ▼
Commit C1 ───> Commit C2 ───> Commit C3 (HEAD)
                                      ▲
       [feature/login] ───────────────┘
\`\`\`
When you create a new commit on \`feature/login\`, the pointer simply advances to C4, while \`main\` stays at C3:
\`\`\`
Commit C1 ───> Commit C2 ───> Commit C3 [main]
                                 \
                                  Commit C4 (HEAD) [feature/login]
\`\`\`

---

## 2. \`git branch\` — The Branch Management Tool

The \`git branch\` command lets you list, create, inspect, and rename branches in your repository.

\`\`\`bash
# 1. List all local branches (the one with an asterisk * is your current branch):
git branch
# Output:
# * main
#   feature/user-profile
#   bugfix/cart-null-check

# 2. List all branches including remote tracking branches from GitHub (-a = all):
git branch -a
# Output:
# * main
#   remotes/origin/HEAD -> origin/main
#   remotes/origin/main
#   remotes/origin/feature/login

# 3. See the last commit message and hash on every branch (-v = verbose):
git branch -v

# 4. Rename the current branch:
git branch -m new-branch-name

# 5. Rename a specific different branch:
git branch -m old-name new-name
\`\`\`

---

## 3. Creating Branches

There are three ways to create a branch, depending on your preferred workflow:

\`\`\`bash
# Method 1: Create a branch without switching to it:
git branch feature/payment-gateway

# Method 2: Modern Standard — Create AND switch immediately (Recommended):
git switch -c feature/payment-gateway

# Method 3: Traditional Way — Create AND checkout immediately:
git checkout -b feature/payment-gateway

# Method 4: Create a branch starting from a specific historical commit:
git switch -c hotfix/urgent-patch 3a1b2c4
\`\`\`

---

## 4. Switching Branches

Switching branches changes the **\`HEAD\`** pointer and updates your **Working Directory** files to match the commit snapshot of the target branch.

### What happens when you switch?
1. Git points \`HEAD\` to the new branch.
2. Git quietly swaps out files on your hard drive: files from the old branch disappear, and files from the new branch appear instantly.
3. Your editor (VS Code) updates automatically in less than a second!

> [!WARNING]
> **Dirty Working Tree Warning:** If you have unsaved, uncommitted changes in your files that conflict with the branch you want to switch to, Git will stop you with an error. Either commit your changes or run \`git stash\` before switching.

---

## 5. \`git switch\` — The Modern, Dedicated Tool

Introduced in **Git 2.23 (August 2019)**, \`git switch\` was created specifically to make branch navigation intuitive and safe.

\`\`\`bash
# Switch to an existing local branch:
git switch main

# Create and switch to a new branch (-c = create):
git switch -c feature/dashboard

# Switch to a branch on GitHub (automatically creates local tracking branch):
git switch feature/api-integration

# Quickly switch back to your previous branch (like the TV remote 'previous channel' button):
git switch -
\`\`\`

---

## 6. \`git checkout\` — The Historical Swiss Army Knife

Before \`git switch\` existed, developers used \`git checkout\` for everything.

### Why was \`git checkout\` controversial?
\`git checkout\` was overloaded with two completely unrelated responsibilities:
1. Switching branches: \`git checkout feature/login\`
2. Discarding file modifications: \`git checkout -- myfile.cs\`

Because a simple typo in a branch name could accidentally wipe out a developer's code files, Git split \`git checkout\` into two purpose-built commands:
* **\`git switch\`**: Exclusively for switching and creating branches.
* **\`git restore\`**: Exclusively for discarding or unstaging file changes.

\`\`\`bash
# Traditional checkout commands (still work everywhere):
git checkout main                     # Switch branch
git checkout -b feature/user-profile   # Create and switch branch
\`\`\`

---

## 7. Deleting Branches

Once a feature is finished and merged into \`main\`, you should delete the branch to keep your repository tidy.

\`\`\`bash
# 1. Safe Delete (-d):
# Git checks if the branch has been merged into main. If not, it refuses to delete:
git branch -d feature/user-profile

# 2. Force Delete (-D):
# DANGER: Deletes the branch even if it contains unmerged, discarded work:
git branch -D feature/failed-experiment

# 3. Delete a Remote Branch on GitHub:
# Removes the branch from GitHub's servers:
git push origin --delete feature/user-profile
\`\`\`

> [!NOTE]
> You cannot delete the branch you are currently standing on! Switch to \`main\` first, then delete the feature branch.

---

## 8. Professional Branch Naming Conventions

Top software companies follow strict, prefix-based kebab-case naming rules to keep large engineering teams organized:

| Prefix | When to use | Production Example |
| :--- | :--- | :--- |
| \`feature/\` | Developing a new user-facing capability | \`feature/jira-101-google-oauth\` |
| \`bugfix/\` | Fixing non-critical bugs during sprint | \`bugfix/jira-205-cart-total-tax\` |
| \`hotfix/\` | Urgent patch applied directly to production | \`hotfix/auth-token-security-bypass\` |
| \`release/\` | Preparing a release candidate version | \`release/v2.1.0-rc1\` |
| \`refactor/\` | Clean code / internal redesign | \`refactor/extract-database-service\` |
| \`test/\` | Adding automated unit/e2e test suites | \`test/cypress-checkout-flow\` |

### 🚫 Anti-patterns to Avoid:
* ❌ \`my-test\`, \`test123\` (meaningless names)
* ❌ \`Feature_New_Login_Page\` (never use PascalCase or spaces)
* ❌ Keeping 50 old merged branches alive on GitHub (always delete after merge!)
`,
    contentBn: `# ব্রাঞ্চিং: ব্রাঞ্চ কী, git branch, switch বনাম checkout, ডিলিট ও নেইমিং

ব্রাঞ্চিং হলো গিটের **সবচেয়ে জাদুকরী ও শক্তিশালী বৈশিষ্ট্য (Superpower)**। পুরোনো ভার্সন কন্ট্রোল সিস্টেমে ব্রাঞ্চ তৈরি করতে পুরো প্রজেক্টের ফাইল কপি করতে হতো যা ছিল ভারী ও ধীরগতির। কিন্তু গিটে ব্রাঞ্চ তৈরি করা শতভাগ মেমোরি-ফ্রি, চোখের পলকে কয়েক মিলিসেকেন্ডে সম্পন্ন হয় এবং হার্ডডিস্কে বাড়তি কোনো জায়গা নেয় না।

---

## ১. ব্রাঞ্চ (Branch) কী?

### গাছের বাস্তব রূপক:
মনে করুন একটি বড় গাছ যার মূল কাণ্ডটি সোজা ওপরের দিকে উঠছে। এই মূল কাণ্ডটিই হলো আপনার প্রধান ও নিরাপদ প্রোডাকশন কোড (**\`main\`**)।
যখন আপনি নতুন কোনো ফিচার নিয়ে পরীক্ষা-নিরীক্ষা করতে চান, তখন আপনি সেই কাণ্ড থেকে একটি নতুন ডালপালা বা শাখা (**Branch**) বের করেন:
* আপনি ওই শাখায় যত খুশি পাতা কাটাকুটি বা ড্রিল করতে পারেন, মূল কাণ্ডের কোনো ক্ষতি হয় না।
* পরীক্ষা সফল হলে আপনি শাখাটিকে আবার মূল কাণ্ডের সাথে জোড়া লাগিয়ে দেন (**Merge**)।
* আর পরীক্ষা ব্যর্থ হলে ডালটি কেটে ফেলে দেন (**Delete**)—মূল গাছটি একদম অক্ষত থাকে।

### ভেতরে কীভাবে কাজ করে?
গিটে ব্রাঞ্চ কোনো ফাইলের ভারী কপি নয়! এটি কেবল সর্বশেষ কমিটের দিকে তাকিয়ে থাকা ৪১-বাইটের একটি ছোট পয়েন্টার (Pointer)।

\`\`\`
          [main] ─────────────────────┐
                                      ▼
Commit C1 ───> Commit C2 ───> Commit C3 (HEAD)
                                      ▲
       [feature/login] ───────────────┘
\`\`\`
যখন \`feature/login\` ব্রাঞ্চে নতুন কোড কমিট করবেন, পয়েন্টারটি নতুন কমিট C4-এ এগিয়ে যাবে, কিন্তু \`main\` আগের জায়গায় স্থির থাকবে:
\`\`\`
Commit C1 ───> Commit C2 ───> Commit C3 [main]
                                 \
                                  Commit C4 (HEAD) [feature/login]
\`\`\`

---

## ২. \`git branch\` — ব্রাঞ্চ পরিচালনা ও তালিকা দেখার টুল

\`git branch\` কমান্ড দিয়ে লোকাল ও রিমোট ব্রাঞ্চ দেখা, ব্রাঞ্চের নাম পরিবর্তন করা এবং তৈরি করা যায়।

\`\`\`bash
# ১. সমস্ত লোকাল ব্রাঞ্চের তালিকা দেখতে (যেটির পাশে তারাচিহ্ন * থাকে, আপনি বর্তমানে সেটিতে আছেন):
git branch
# আউটপুট:
# * main
#   feature/user-profile
#   bugfix/cart-null-check

# ২. গিটহাব রিমোটসহ সব ব্রাঞ্চ দেখতে (-a = all):
git branch -a

# ৩. প্রতিটি ব্রাঞ্চের সর্বশেষ কমিট হ্যাশ ও মেসেজ দেখতে (-v = verbose):
git branch -v

# ৪. বর্তমান ব্রাঞ্চের নাম পরিবর্তন (Rename) করতে:
git branch -m new-branch-name
\`\`\`

---

## ৩. ব্রাঞ্চ তৈরি করার নিয়ম (Creating Branches)

কাজের সুবিধার জন্য ব্রাঞ্চ তৈরির কয়েকটি জনপ্রিয় কমান্ড রয়েছে:

\`\`\`bash
# পদ্ধতি ১: নতুন ব্রাঞ্চ তৈরি করা (কিন্তু সেখানে সুইচ না করে বর্তমান ব্রাঞ্চেই থাকা):
git branch feature/payment-gateway

# পদ্ধতি ২: আধুনিক নিয়ম — ব্রাঞ্চ তৈরি করে সাথে সাথে সেখানে চলে যাওয়া (রেকমেন্ডেড):
git switch -c feature/payment-gateway

# পদ্ধতি ৩: পুরোনো সনাতন নিয়ম:
git checkout -b feature/payment-gateway

# পদ্ধতি ৪: অতীতের কোনো নির্দিষ্ট কমিট থেকে নতুন ব্রাঞ্চ শুরু করতে:
git switch -c hotfix/urgent-patch 3a1b2c4
\`\`\`

---

## ৪. ব্রাঞ্চ পরিবর্তন বা সুইচ করা (Switching Branches)

ব্রাঞ্চ সুইচ করার অর্থ হলো গিট আপনার **\`HEAD\`** পয়েন্টারটিকে কাঙ্ক্ষিত ব্রাঞ্চে নিয়ে যায় এবং আপনার হার্ডডিস্কের ফাইলগুলোকে পলকের মধ্যে ওই ব্রাঞ্চের কোড দিয়ে প্রতিস্থাপন করে দেয়।

### স্যুইচ করলে ব্যাকগ্রাউন্ডে কী ঘটে?
1. গিট \`HEAD\` পয়েন্টারটিকে নতুন ব্রাঞ্চের দিকে ঘুরিয়ে দেয়।
2. কম্পিউটারের ফোল্ডারে থাকা ফাইলগুলো অটোমেটিক বদলে যায়: পুরোনো ব্রাঞ্চের ফাইল অদৃশ্য হয় এবং নতুন ব্রাঞ্চের ফাইলগুলো চোখের পলকে সামনে চলে আসে।
3. আপনার কোড এডিটরেও ফাইলগুলো সাথে সাথে রিফ্রেশ হয়ে যায়!

> [!WARNING]
> **সতর্কতা:** যদি আপনার ওয়ার্কিং ডিরেক্টরিতে কোনো আনকমিটেড কাজ বাকি থাকে এবং তা নতুন ব্রাঞ্চের কোডের সাথে সাংঘর্ষিক হয়, গিট আপনাকে ব্রাঞ্চ সুইচ করতে দেবে না। আগে কোড কমিট করুন অথবা \`git stash\` দিয়ে নিরাপদে লুকিয়ে রেখে তারপর ব্রাঞ্চ সুইচ করুন।

---

## ৫. \`git switch\` — আধুনিক ও ডেডিকেটেড কমান্ড

**গিট ২.২৩ সংস্করণে (২০১৯ সাল)** ব্রাঞ্চ স্যুইচিংকে আরও সহজ ও নিরাপদ করতে \`git switch\` কমান্ডটি তৈরি করা হয়।

\`\`\`bash
# বিদ্যমান কোনো লোকাল ব্রাঞ্চে যেতে:
git switch main

# নতুন ব্রাঞ্চ তৈরি করে সাথে সাথে সুইচ করতে (-c = create):
git switch -c feature/dashboard

# গিটহাবের রিমোট ব্রাঞ্চে সরাসরি সুইচ করতে:
git switch feature/api-integration

# মাত্র এক সেকেন্ড আগে যে ব্রাঞ্চে ছিলেন সেখানে চট করে ফিরে যেতে (রিমোটের Previous Channel-এর মতো):
git switch -
\`\`\`

---

## ৬. \`git checkout\` — পুরোনো সর্বঘটের কাঁঠালি কলা

\`git switch\` আসার আগে এক যুগ ধরে ডেভেলপাররা \`git checkout\` ব্যবহার করতেন।

### কেন \`checkout\` নিয়ে সমালোচনা ছিল?
\`git checkout\` একই সাথে দুটি সম্পূর্ণ ভিন্ন কাজ করত:
1. ব্রাঞ্চ বদলানো: \`git checkout feature/login\`
2. ফাইলের কোড ড্রপ/বাতিল করা: \`git checkout -- file.cs\`

একটি ছোট টাইপোর কারণে ভুলে ফাইল ডিলিট হয়ে যাওয়ার মারাত্মক ঝুঁকি থাকায় গিট এই কমান্ডটিকে দুটি পরিষ্কার কমান্ডে ভাগ করেছে:
* **\`git switch\`**: শুধু ব্রাঞ্চ তৈরি ও স্যুইচ করার জন্য।
* **\`git restore\`**: কোড ডিসকার্ড ও আনস্টেজ করার জন্য।

---

## ৭. ব্রাঞ্চ ডিলিট করা (Deleting Branches)

কোনো ফিচারের কাজ শেষ হয়ে \`main\` ব্রাঞ্চে মার্জ হয়ে গেলে প্রজেক্ট পরিচ্ছন্ন রাখতে ব্রাঞ্চটি ডিলিট করে দেওয়া উত্তম।

\`\`\`bash
# ১. নিরাপদ ডিলিট (-d):
# গিট চেক করবে কোড মার্জ হয়েছে কি না। মার্জ না হয়ে থাকলে ডিলিট করতে বাধা দেবে:
git branch -d feature/user-profile

# ২. জোরপূর্বক ডিলিট (-D):
# সতর্কতা: মার্জ না হওয়া কোড থাকলেও ডিলিট করে দেবে:
git branch -D feature/failed-experiment

# ৩. গিটহাব রিমোট থেকে ব্রাঞ্চ ডিলিট করা:
git push origin --delete feature/user-profile
\`\`\`

> [!NOTE]
> আপনি বর্তমানে যে ব্রাঞ্চে দাঁড়িয়ে আছেন, সেই ব্রাঞ্চটি কখনোই ডিলিট করতে পারবেন না। আগে \`git switch main\` দিয়ে মূল ব্রাঞ্চে আসুন, তারপর ফিচার ব্রাঞ্চটি ডিলিট করুন।

---

## ৮. প্রফেশনাল ব্রাঞ্চ নেইমিং কনভেনশন (Naming Conventions)

শিল্পমানের সফটওয়্যার কোম্পানিতে কাজ করার সময় এলোমেলো ব্রাঞ্চ নাম দেওয়া নিষিদ্ধ। সুনির্দিষ্ট প্রিফিক্স মেনে ব্রাঞ্চের নাম দিতে হয়:

| প্রিফিক্স | ব্যবহারের ক্ষেত্র | বাস্তব উদাহরণ |
| :--- | :--- | :--- |
| \`feature/\` | নতুন কোনো ফিচার ডেভেলপ করার জন্য | \`feature/jira-101-google-oauth\` |
| \`bugfix/\` | সাধারণ কোনো বাগ সমাধানের জন্য | \`bugfix/jira-205-cart-total-tax\` |
| \`hotfix/\` | প্রোডাকশনে জরুরি বাগ তৎক্ষণাৎ ফিক্সের জন্য | \`hotfix/auth-token-bypass\` |
| \`release/\` | নতুন সফটওয়্যার ভার্সন তৈরির প্রস্তুতিতে | \`release/v2.1.0\` |
| \`refactor/\` | কোড ক্লিন বা আর্কিটেকচার পরিবর্তনের জন্য | \`refactor/extract-database-service\` |

### 🚫 যেসব ভুল করবেন না:
* ❌ \`test\`, \`final-branch\` (অর্থহীন নাম কখনো দেবেন না)।
* ❌ \`Feature_New_Login\` (কখনো ক্যাপিটাল লেটার বা স্পেস ব্যবহার করবেন না, সর্বদা ছোট হাতের অক্ষর ও হাইফেন \`-\` ব্যবহার করবেন)।
* ❌ কাজ শেষ হয়ে যাওয়া ৫০টি পুরোনো ব্রাঞ্চ গিটহাবে জমিয়ে রাখবেন না; মার্জ শেষে ডিলিট করুন।
`,
  };
