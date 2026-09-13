import type { LocalLesson } from "@/lib/lessons-data";

export const gitRepositoryBasicsLesson: LocalLesson = {
    slug: "git-repository-basics",
    titleEn: "Repository Basics: Init, Clone, Status, Add, Commit, Log & Diff",
    titleBn: "রিপোজিটরি বেসিকস: ইনিট, ক্লোন, স্ট্যাটাস, অ্যাড, কমিট, লগ ও ডিফারেন্স",
    categoryEn: "2. Repository Operations",
    categoryBn: "২. রিপোজিটরি অপারেশন ও বেসিক কমান্ড",
    categoryDescEn: "Initializing repositories, cloning remote code, inspecting workspace status, staging, committing, and analyzing diffs.",
    categoryDescBn: "নতুন রিপোজিটরি তৈরি, রিমোট কোড ক্লোন করা, ফাইল স্ট্যাটাস দেখা, স্টেজিং, কমিট তৈরি ও ডিফারেন্স বিশ্লেষণ।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the bread-and-butter commands of everyday development: git init, git clone, git status, git add, git commit, git log, and git diff.",
    descriptionBn: "প্রতিদিনের প্রোগ্রামিংয়ে সর্বাধিক ব্যবহৃত মৌলিক কমান্ডগুলো শিখুন: git init, clone, status, add, commit, log এবং diff।",
    difficulty: "EASY",
    displayOrder: 2,
    prerequisites: ["git-fundamentals"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Git Basics — Recording Changes to the Repository",
        url: "https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository",
        description: "Official documentation on staging, commits, and logs.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "What is the difference between 'git diff' and 'git diff --staged'?",
        url: null,
        difficulty: "EASY",
        company: "BJIT Group",
        tags: ["Git", "Diff", "Staging Area"],
        solutionEn: "'git diff' shows differences between your Working Directory and the Staging Area (unstaged changes). 'git diff --staged' (or 'git diff --cached') shows differences between what is currently staged in the Staging Area and the last commit (HEAD).",
        solutionBn: "'git diff' আপনার ওয়ার্কিং ডিরেক্টরি এবং স্টেজিং এরিয়ার মধ্যকার পার্থক্য (আনস্টেজড পরিবর্তন) দেখায়। আর 'git diff --staged' (বা '--cached') স্টেজিং এরিয়া এবং সর্বশেষ কমিটের (HEAD) মধ্যকার পার্থক্য দেখায় যা পরবর্তী কমিটে অন্তর্ভুক্ত হবে।",
      },
    ],
    contentEn: `# Repository Basics: git init, clone, status, add, commit, log & diff

These seven commands are the **daily bread and butter** of every software engineer. Whether you are building an ASP.NET Core backend, a Next.js frontend, or a Python machine learning model, you will use these commands multiple times every single day.

Let's break down each command step-by-step with practical examples and clear mental models.

---

## 1. \`git init\` — Creating a Brand New Repository

### What does it do?
\`git init\` takes any regular, ordinary folder on your computer and turns it into a **tracked Git repository**.

### How it works behind the scenes:
When you run \`git init\`, Git creates a hidden directory named \`.git\` inside your folder:
\`\`\`
my-project/
├── .git/            <-- Git's hidden brain (object database, config, HEAD pointer)
├── Program.cs
└── README.md
\`\`\`
> [!IMPORTANT]
> The \`.git\` folder contains your entire project history! Never manually delete or edit files inside \`.git\` unless you know exactly what you are doing. If you delete \`.git\`, your code remains, but your entire history and all past commits are gone.

### Step-by-Step Terminal Example:
\`\`\`bash
# 1. Create a new directory for your project
mkdir code-for-career-app

# 2. Enter into the directory
cd code-for-career-app

# 3. Initialize Git
git init
# Output: Initialized empty Git repository in /Users/dev/code-for-career-app/.git/
\`\`\`

---

## 2. \`git clone\` — Downloading an Existing Project

### What does it do?
Instead of starting from scratch, \`git clone\` downloads an entire project from a remote host (like GitHub, GitLab, or Bitbucket) directly to your local computer.

### The Clone Mental Model:
\`git clone\` doesn't just copy the latest files. **It downloads the entire historical timeline**, all branches, and all past commits ever made to that repository.

### HTTPS vs SSH:
\`\`\`bash
# Option A: HTTPS (Simple, but requires GitHub Personal Access Token or Web Login)
git clone https://github.com/mostafa-cse/Code-for-Career.git

# Option B: SSH (Recommended for developers — uses secure SSH keys without passwords)
git clone git@github.com:mostafa-cse/Code-for-Career.git

# Option C: Clone into a custom folder name
git clone git@github.com:mostafa-cse/Code-for-Career.git my-custom-folder
\`\`\`

---

## 3. \`git status\` — The Radiologist of Your Codebase

### What does it do?
\`git status\` is the single most important and frequently typed command in Git. It gives you a complete health check of your workspace:
* Which branch you are currently on.
* Which files have been modified.
* Which files are staged and ready to be committed.
* Which new files are untracked.

### Understanding File States in \`git status\`:
\`\`\`
+-----------------------+-------------------------------------------------------------+
| State                 | Meaning                                                     |
+-----------------------+-------------------------------------------------------------+
| Untracked (??)        | A brand new file that Git has never seen before             |
| Modified ( M)         | A file that was previously committed, but you changed lines |
| Staged (M )           | A file whose changes have been packed into the staging area |
+-----------------------+-------------------------------------------------------------+
\`\`\`

### Example Output:
\`\`\`bash
git status

# On branch main
# Changes to be committed:
#   (use "git restore --staged <file>..." to unstage)
#         modified:   src/Services/AuthService.cs   <-- Staged (Green)
#
# Changes not staged for commit:
#   (use "git add <file>..." to update what will be committed)
#         modified:   src/app.settings.json         <-- Modified, not staged (Red)
#
# Untracked files:
#   (use "git add <file>..." to include in what will be committed)
#         src/Models/UserDto.cs                     <-- Untracked (Red)
\`\`\`

> [!TIP]
> **Pro Tip:** Use \`git status -s\` (short format) for a quick, compact summary:
> \`\`\`bash
> git status -s
> # M  src/Services/AuthService.cs (Staged)
> #  M src/app.settings.json       (Unstaged)
> # ?? src/Models/UserDto.cs       (Untracked)
> \`\`\`

---

## 4. \`git add\` — Preparing the Staging Area

### What does it do?
\`git add\` moves changes from your **Working Directory** to the **Staging Area (Index)**. Think of it as carefully selecting which items you want to pack into a shipping box before sealing it.

### Why do we need a staging area?
Imagine you spent the morning fixing a login bug in \`Auth.cs\` and also started an experimental UI header in \`Header.tsx\`. You only want to commit the login bug fix right now.
With \`git add\`, you can stage **only** \`Auth.cs\` and leave \`Header.tsx\` out!

### Common Usage:
\`\`\`bash
# 1. Stage a single specific file
git add src/Services/AuthService.cs

# 2. Stage multiple specific files
git add src/Models/User.cs src/Controllers/AuthController.cs

# 3. Stage ALL modified and new files in the entire project
git add .

# 4. Interactive Staging (Pro-developer skill: stage specific lines/hunks)
git add -p
\`\`\`

---

## 5. \`git commit\` — Sealing the Permanent Snapshot

### What does it do?
\`git commit\` takes everything currently in the staging area and permanently records it as a new **Snapshot (Commit)** in your local repository.

Every commit gets:
1. **A unique 40-character SHA-1 hash** (e.g., \`3a8f1b2c4d5e...\`, usually abbreviated to the first 7 characters \`3a8f1b2\`).
2. **Author metadata:** Your name, email, date, and exact timestamp.
3. **Commit message:** A human-readable description of what changed.
4. **Parent pointer:** A link to the previous commit, creating an unbreakable chain of history.

### Command Examples:
\`\`\`bash
# Standard commit with inline message:
git commit -m "feat(auth): implement JWT token generation on user login"

# Stage all tracked modified files AND commit in one shortcut (skips untracked files):
git commit -am "fix(auth): correct token expiration from seconds to minutes"
\`\`\`

### 🏆 Writing Great Commit Messages (Conventional Commits):
Top tech companies enforce clean commit conventions:
* \`feat: add google oauth login\` (new feature)
* \`fix: resolve null pointer exception in payment gateway\` (bug fix)
* \`docs: update API documentation in README\` (documentation)
* \`refactor: simplify database query in user repository\` (code cleanup)

---

## 6. \`git log\` — Inspecting the Timeline

### What does it do?
\`git log\` displays the chronological history of commits, showing who made changes and when.

### Most Useful \`git log\` Commands:
\`\`\`bash
# 1. Standard full log (press 'q' to exit):
git log

# 2. The most popular developer command: one-line visual graph view:
git log --oneline --graph --decorate --all

# 3. Limit output to the last 5 commits:
git log -n 5 --oneline

# 4. See which files were modified in each commit:
git log --stat

# 5. Filter commits by author:
git log --author="Mostafa" --oneline
\`\`\`

### Sample Visual Output:
\`\`\`
* 7a2b9c1 (HEAD -> main, origin/main) feat: add user profile page
* 3e4f5a2 fix: handle empty cart exception in checkout
* 1b8c9d0 feat: initialize database connection
* 9f0e1a3 chore: initial commit
\`\`\`

---

## 7. \`git diff\` — Spotting the Exact Code Differences

### What does it do?
\`git diff\` shows the exact line-by-line changes (green for additions with \`+\`, red for deletions with \`-\`).

### The Two Critical Variants:
\`\`\`bash
# 1. Working Directory vs Staging Area (Unstaged changes)
# "What code have I written that I haven't staged yet?"
git diff

# 2. Staging Area vs Last Commit (Staged changes)
# "What code is in the packing box ready to be committed?"
git diff --staged
# (or equivalently: git diff --cached)

# 3. Check diff for a specific file only:
git diff src/Services/AuthService.cs
\`\`\`

### Sample Diff Output:
\`\`\`diff
diff --git a/src/Auth.cs b/src/Auth.cs
--- a/src/Auth.cs
+++ b/src/Auth.cs
@@ -10,2 +10,3 @@ public class AuthService
-    private int tokenExpiryMinutes = 30;
+    private int tokenExpiryMinutes = 60; // Increased token life
+    public bool IsAdmin { get; set; }
\`\`\`

---

## Quick Reference Summary

| Command | What it does | Real-World Analogy |
| :--- | :--- | :--- |
| \`git init\` | Creates a new Git repository | Building a brand new empty ledger notebook |
| \`git clone <url>\` | Downloads an existing project | Photocopying someone else's entire notebook |
| \`git status\` | Inspects current state of workspace | Glancing at your desk to see what's messy |
| \`git add <file>\` | Moves changes to Staging Area | Putting selected items into a shipping box |
| \`git commit -m\` | Saves snapshot permanently | Sealing and stamping the shipping box |
| \`git log --oneline\` | Lists history of snapshots | Reading the table of contents of past events |
| \`git diff\` | Shows exact code line changes | Spotting the differences between two drafts |
`,
    contentBn: `# রিপোজিটরি বেসিকস: git init, clone, status, add, commit, log ও diff

এই ৭টি মৌলিক কমান্ড হলো যেকোনো সফটওয়্যার ইঞ্জিনিয়ারের **দৈনন্দিন কাজের প্রধান হাতিয়ার**। আপনি ASP.NET Core, Next.js, জাভা কিংবা পাইথনে কাজ করুন না কেন—প্রতিটি দিন এই কমান্ডগুলো আপনাকে একাধিকবার ব্যবহার করতে হবে।

নিচে প্রতিটি কমান্ড সহজ ভাষা, টার্মিনাল উদাহরণ ও বাস্তব রূপকের মাধ্যমে বিস্তারিত আলোচনা করা হলো।

---

## ১. \`git init\` — নতুন রিপোজিটরি শুরু করা

### এটি কী করে?
\`git init\` আপনার কম্পিউটারের যেকোনো সাধারণ ফোল্ডারকে একটি **গিট ট্র্যাকিং রিপোজিটরিতে** রূপান্তর করে।

### পেছনের কার্যক্রম:
\`git init\` চালালে আপনার প্রজেক্ট ফোল্ডারের ভেতরে একটি হিডেন (লুকায়িত) ফোল্ডার তৈরি হয় যার নাম **\`.git\`**:
\`\`\`
my-project/
├── .git/            <-- গিটের আসল মস্তিষ্ক (ডেটাবেজ, কনফিগারেশন ও হিস্ট্রি)
├── Program.cs
└── README.md
\`\`\`
> [!IMPORTANT]
> এই \`.git\` ফোল্ডারের ভেতরেই আপনার প্রজেক্টের শুরু থেকে শেষ পর্যন্ত সমস্ত অতীত ইতিহাস সংরক্ষিত থাকে! এই ফোল্ডারটি কখনো ডিলিট করবেন না। এটি মুছে ফেললে ফাইলগুলো থাকলেও সমস্ত পূর্ববর্তী কমিটের ইতিহাস চিরতরে নষ্ট হয়ে যাবে।

### টার্মিনালে ব্যবহারের নিয়ম:
\`\`\`bash
# ১. প্রজেক্টের জন্য একটি ফোল্ডার তৈরি করুন
mkdir code-for-career-app

# ২. ফোল্ডারের ভেতরে প্রবেশ করুন
cd code-for-career-app

# ৩. গিট ইনিশিয়ালাইজ করুন
git init
# আউটপুট: Initialized empty Git repository in /Users/dev/code-for-career-app/.git/
\`\`\`

---

## ২. \`git clone\` — বিদ্যমান প্রজেক্ট ডাউনলোড করা

### এটি কী করে?
শূন্য থেকে শুরু না করে ইন্টারনেটে থাকা কোনো রিমোট রিপোজিটরি (যেমন GitHub বা GitLab) থেকে সম্পূর্ণ প্রজেক্ট নিজের কম্পিউটারে ডাউনলোড করতে \`git clone\` ব্যবহার করা হয়।

### ক্লোনের মূল দর্শন:
\`git clone\` কেবল ফাইলের সর্বশেষ কপি আনে না; এটি প্রজেক্টের **পুরো অতীত ইতিহাস, প্রতিটি ব্রাঞ্চ এবং সমস্ত কমিট** সম্পূর্ণভাবে ডাউনলোড করে আপনার কম্পিউটারে একটি স্বয়ংসম্পূর্ণ মিরর তৈরি করে।

### ব্যবহারের নিয়ম:
\`\`\`bash
# HTTPS দিয়ে ক্লোন করা:
git clone https://github.com/mostafa-cse/Code-for-Career.git

# SSH দিয়ে ক্লোন করা (প্রফেশনাল ডেভেলপারদের জন্য রেকমেন্ডেড):
git clone git@github.com:mostafa-cse/Code-for-Career.git

# নিজস্ব ফোল্ডার নামে ক্লোন করা:
git clone git@github.com:mostafa-cse/Code-for-Career.git my-custom-folder
\`\`\`

---

## ৩. \`git status\` — আপনার কাজের এক্স-রে রিপোর্ট

### এটি কী করে?
\`git status\` হলো গিটে সবচেয়ে বেশি টাইপ করা কমান্ড। এটি আপনার প্রজেক্টের বর্তমান স্বাস্থ্য পরীক্ষা করে জানায়:
* আপনি বর্তমানে কোন ব্রাঞ্চে (Branch) আছেন।
* কোন ফাইলগুলো পরিবর্তন করেছেন।
* কোন ফাইলগুলো পরবর্তী কমিটের জন্য স্টেজিং এরিয়ায় সাজিয়ে রেখেছেন।
* কোন নতুন ফাইলগুলো এখনো গিট ট্র্যাক করছে না (Untracked)।

### ফাইলের তিনটি প্রধান অবস্থা:
\`\`\`
+-----------------------+-------------------------------------------------------------+
| অবস্থা                 | অর্থ                                                        |
+-----------------------+-------------------------------------------------------------+
| Untracked (??)        | সম্পূর্ণ নতুন ফাইল যা গিট আগে কখনো দেখেনি                    |
| Modified ( M)         | পুরনো ফাইল যাতে আপনি নতুন লাইন যোগ বা বিয়োগ করেছেন        |
| Staged (M )           | ফাইলটি স্টেজিং এরিয়ার বক্সে প্যাক করা হয়েছে               |
+-----------------------+-------------------------------------------------------------+
\`\`\`

### বাস্তব আউটপুট:
\`\`\`bash
git status
# On branch main
# Changes to be committed:
#         modified:   AuthService.cs    <-- স্টেজড (সবুজ রং - সেভ হতে প্রস্তুত)
#
# Changes not staged for commit:
#         modified:   appsettings.json  <-- আনস্টেজড (লাল রং - পরিবর্তন হয়েছে কিন্তু ব্যাগে ভরা হয়নি)
#
# Untracked files:
#         UserDto.cs                    <-- আনট্র্যাকড (লাল রং - নতুন ফাইল)
\`\`\`

> [!TIP]
> সংক্ষেপে দেখার জন্য ব্যবহার করুন: \`git status -s\`

---

## ৪. \`git add\` — স্টেজিং এরিয়াতে ফাইল পাঠানো

### এটি কী করে?
\`git add\` আপনার পরিবর্তিত ফাইলগুলোকে **Working Directory** থেকে **Staging Area (প্যাকিং বক্স)**-এ পাঠায়।

### স্টেজিং এরিয়া কেন দরকার?
মনে করুন আপনি সকালে দুটি কাজ করেছেন:
1. লগইন পেজের একটি গুরুতর বাগ ঠিক করেছেন (\`Auth.cs\`)।
2. পাশাপাশি শখের বসে ন্যাভবারে নতুন লোগো বসিয়েছেন (\`Navbar.tsx\`)।

আপনি চান শুধুমাত্র লগইন ফিক্সটি আগে কমিট করতে। \`git add\` দিয়ে আপনি শুধুমাত্র \`Auth.cs\` ফাইলটিকে বক্সে ভরতে পারবেন এবং \`Navbar.tsx\` ফাইলটিকে বাইরে রেখে দিতে পারবেন!

### ব্যবহারের নিয়ম:
\`\`\`bash
# একটি নির্দিষ্ট ফাইল স্টেজ করতে:
git add AuthService.cs

# সব পরিবর্তিত ও নতুন ফাইল একসাথে স্টেজ করতে:
git add .

# কোডের নির্দিষ্ট কিছু লাইন বা চাঙ্ক বেছে বেছে স্টেজ করতে (Patch Mode):
git add -p
\`\`\`

---

## ৫. \`git commit\` — স্থায়ী স্ন্যাপশট সংরক্ষণ

### এটি কী করে?
\`git commit\` স্টেজিং এরিয়ার সমস্ত ফাইলকে সিলগালা করে আপনার লোকাল রিপোজিটরিতে একটি স্থায়ী, অপরিবর্তনীয় **স্ন্যাপশট (Commit)** হিসেবে সংরক্ষণ করে।

প্রতিটি কমিটের সাথে যুক্ত থাকে:
1. **৪০ অক্ষরের ইউনিক ক্রিপ্টোগ্রাফিক হ্যাশ (SHA-1):** যেমন \`3a8f1b2\`।
2. **লেখকের নাম ও ইমেইল:** কে কাজটি করেছে।
3. **কমিট মেসেজ:** কী পরিবর্তন করা হয়েছে তার বিবরণ।
4. **টাইমস্ট্যাম্প:** কোন তারিখে ও সময়ে করা হয়েছে।

### ব্যবহারের নিয়ম:
\`\`\`bash
# সাধারণ কমিট মেসেজ সহ:
git commit -m "feat(auth): add jwt token generation"

# ট্র্যাকড সব মডিফাইড ফাইল স্টেজ ও কমিট একসাথে করতে:
git commit -am "fix(auth): increase token expiration time"
\`\`\`

---

## ৬. \`git log\` — ইতিহাসের টাইমলাইন দেখা

### এটি কী করে?
প্রজেক্টে এ পর্যন্ত যতগুলো কমিট হয়েছে, তাদের তালিকা ক্রমানুসারে দেখতে \`git log\` ব্যবহার করা হয়।

### সবচেয়ে কার্যকর কমান্ডসমূহ:
\`\`\`bash
# ১. সাধারণ বিস্তারিত লগ (বের হতে 'q' চাপুন):
git log

# ২. প্রফেশনাল এক লাইনের গ্রাফ ভিউ (সবচেয়ে জনপ্রিয়):
git log --oneline --graph --decorate --all

# ৩. সর্বশেষ ৩টি কমিট দেখতে:
git log -n 3 --oneline

# ৪. কোন কমিটে কোন কোন ফাইলে পরিবর্তন এসেছে দেখতে:
git log --stat
\`\`\`

---

## ৭. \`git diff\` — কোডের পুঙ্খানুপুঙ্খ পার্থক্য দেখা

### এটি কী করে?
কোডের কোন ফাইলে কোন লাইনে কী যুক্ত হয়েছে (সবুজ \`+\`) এবং কী মুছে ফেলা হয়েছে (লাল \`-\`), তা লাইন বাই লাইন বিশ্লেষণ করে।

### দুটি গুরুত্বপূর্ণ পার্থক্য:
\`\`\`bash
# ১. আনস্টেজড পরিবর্তন দেখতে:
# "আমি ফাইলে কী কোড লিখেছি যা এখনো git add করিনি?"
git diff

# ২. স্টেজড পরিবর্তন দেখতে:
# "git add করে বক্সে ভরেছি, কিন্তু এখনো commit করিনি এমন কোড কী?"
git diff --staged

# ৩. নির্দিষ্ট কোনো ফাইলের পরিবর্তন দেখতে:
git diff AuthService.cs
\`\`\`

---

## সারসংক্ষেপ টেবিল

| কমান্ড | কাজ | সহজ উপমা |
| :--- | :--- | :--- |
| \`git init\` | নতুন গিট রিপোজিটরি শুরু করে | নতুন খাতা খোলা |
| \`git clone\` | দূরবর্তী প্রজেক্ট ডাউনলোড করে | অন্যের পুরো খাতা ফটোকপি করে আনা |
| \`git status\` | ওয়ার্কস্পেসের বর্তমান অবস্থা জানায় | টেবিলে কী কী এলোমেলো আছে তা দেখা |
| \`git add\` | ফাইলগুলোকে স্টেজিং বক্সে ভরে | কুরিয়ারের কার্টনে জিনিসপত্র গোছানো |
| \`git commit\` | স্থায়ী স্ন্যাপশট হিসেবে সেভ করে | কার্টন সিলগালা করে মোহর মারা |
| \`git log\` | সমস্ত অতীত কমিটের তালিকা দেখায় | খাতার সূচিপত্র বা ইতিহাস পড়া |
| \`git diff\` | কোডের লাইনের পার্থক্য দেখায় | আগের খসড়ার সাথে নতুন লেখার তুলনা করা |
`,
  };
