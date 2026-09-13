import type { LocalLesson } from "@/lib/lessons-data";

export const gitCommitsLesson: LocalLesson = {
    slug: "git-commits",
    titleEn: "Commits: Conventional Messages, History, Amend, Revert & Resets",
    titleBn: "কমিট ডিপ-ডাইভ: কনভেনশনাল মেসেজ, হিস্ট্রি, অ্যামেন্ড, রিভার্ট ও রিসেট",
    categoryEn: "4. Commits & History Rewriting",
    categoryBn: "৪. কমিট তৈরি ও হিস্ট্রি ব্যবস্থাপনা",
    categoryDescEn: "Commit messages, history inspection, amending commits, git revert vs soft, mixed, and hard resets.",
    categoryDescBn: "কমিট মেসেজ স্ট্যান্ডার্ড, হিস্ট্রি বিশ্লেষণ, কমিট অ্যামেন্ড, এবং git revert বনাম soft, mixed ও hard reset এর ব্যবহার।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the anatomy of Git commits, the 50/72 rule, conventional commits, and how to safely amend, revert, or reset history.",
    descriptionBn: "গিটের কমিট অ্যানাটমি, ৫০/৭২ নিয়ম, কনভেনশনাল কমিট এবং হিস্ট্রি নিরাপদে অ্যামেন্ড, রিভার্ট বা রিসেট করার নিয়ম শিখুন।",
    difficulty: "MEDIUM",
    displayOrder: 4,
    prerequisites: ["git-working-with-changes"],
    estimatedMinutes: 30,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Conventional Commits",
        title: "Conventional Commits 1.0.0 Specification",
        url: "https://www.conventionalcommits.org/en/v1.0.0/",
        description: "Industry standard for human- and machine-readable commit messages.",
        isStarred: true,
      },
      {
        source: "Git Documentation",
        title: "Reset Demystified",
        url: "https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified",
        description: "Official guide on the differences between soft, mixed, and hard reset.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "Compare 'git reset --soft', '--mixed', and '--hard' with their effect on Working Tree and Index",
        url: null,
        difficulty: "MEDIUM",
        company: "Therap (BD) Ltd",
        tags: ["Git", "Reset", "Soft Reset", "Hard Reset"],
        solutionEn: "--soft only moves the HEAD ref pointer; the index and working directory remain unchanged (your commit changes remain staged). --mixed (default) moves HEAD and updates the index to match, but leaves your working directory files untouched (changes become unstaged). --hard updates HEAD, index, AND working tree, permanently discarding uncommitted changes.",
        solutionBn: "--soft শুধুমাত্র HEAD পয়েন্টারকে পেছনে নেয়, স্টেজিং এরিয়া ও ওয়ার্কিং ডিরেক্টরি অক্ষত থাকে (পরিবর্তন স্টেজড অবস্থায় থাকে)। --mixed (ডিফল্ট) HEAD সরায় এবং স্টেজিং এরিয়া রিসেট করে কিন্তু ফাইল অক্ষত রাখে (পরিবর্তন আনস্টেজড হয়)। আর --hard পয়েন্টার, স্টেজিং এরিয়া এবং লোকাল ফাইল সব একসাথে মুছে পূর্বের অবস্থায় নেয়, যা অত্যন্ত ঝুঁকিপূর্ণ।",
      },
      {
        source: "BD Tech Viva",
        name: "Why should you use 'git revert' instead of 'git reset' on public shared branches?",
        url: null,
        difficulty: "MEDIUM",
        company: "Optimizely",
        tags: ["Git", "Revert", "Reset", "Public Branch"],
        solutionEn: "'git reset' rewrites commit history by removing commits from branch tips. If other developers have already pulled that branch, force-pushing a reset causes diverging histories and merge nightmares. 'git revert' safely creates a brand-new commit that applies the exact inverse diff of the target commit, preserving public history linearly.",
        solutionBn: "'git reset' হিস্ট্রি মুছে ফেলে। পাবলিক ব্রাঞ্চে রিসেট চালিয়ে ফোর্স পুশ করলে অন্যান্য সহকর্মীদের লোকাল হিস্ট্রি নষ্ট হয় এবং বড় ধরনের কনফ্লিক্ট তৈরি হয়। অপরদিকে 'git revert' কোনো ইতিহাস না মুছে কাঙ্ক্ষিত কমিটের বিপরীত পরিবর্তন দিয়ে সম্পূর্ণ নতুন একটি নিরাপদ কমিট তৈরি করে।",
      },
    ],
    contentEn: `# Commits: Creation, Messages, History, Amend, Revert & Soft/Mixed/Hard Resets

In Git, a commit is far more than just "saving a file". It is an immutable, cryptographically hashed snapshot of your entire project repository linked to its ancestors. Understanding how commits are created, formatted, inspected, amended, and reset is essential for professional software development.

---

## 1. Creating Commits (\`git commit\`)

### The Mental Model:
A commit represents a checkpoint in your codebase. When you run \`git commit\`, Git takes everything currently sitting in the **Staging Area**, packages it into a permanent object in \`.git/objects\`, and assigns it a unique 40-character SHA hash (e.g., \`9a8f2b1...\`).

### Common Execution Patterns:
\`\`\`bash
# 1. Standard commit with an inline message:
git commit -m "feat(auth): add user registration endpoint"

# 2. Open default text editor (VS Code / Vim / Nano) for a multi-line commit message:
git commit

# 3. Shortcut: Stage all tracked modified files AND commit in one command:
# (Note: Does not include new Untracked files)
git commit -am "fix(auth): update validation regex for phone numbers"
\`\`\`

---

## 2. Professional Commit Messages & Conventional Commits

Top software companies worldwide (and leading tech firms in Bangladesh like Brain Station 23, Therap, Enosis) enforce the **Conventional Commits** standard. Clean commit history makes code reviews easy and enables automated changelogs and semantic versioning.

### The Standard Format:
\`\`\`
<type>[optional scope]: <short description>

[optional detailed body]

[optional footer(s) e.g., Closes #142]
\`\`\`

### Common Commit Types:
* \`feat\`: A new user-facing feature (e.g. \`feat(checkout): add bKash payment gateway\`)
* \`fix\`: A bug fix (e.g. \`fix(auth): resolve session timeout bug\`)
* \`refactor\`: Code restructuring that neither fixes a bug nor adds a feature
* \`perf\`: Code change that improves performance
* \`docs\`: Documentation updates only (README, docstrings)
* \`test\`: Adding or correcting automated tests
* \`chore\`: Build scripts, package dependencies, CI/CD configs

### The Golden 50/72 Rule:
1. **Title (50 chars):** Keep the first line under 50 characters, capitalized, with no trailing period. Use the **imperative mood** ("Add feature", NOT "Added feature").
2. **Body (72 chars):** Leave a blank line after the title, and wrap body lines at 72 characters. Explain the *Why* and *What*, not how the code works line-by-line.

---

## 3. Viewing Commit History (\`git log\`)

\`git log\` allows you to navigate the historical timeline of your repository.

\`\`\`bash
# 1. Standard full historical log (author, date, full message):
git log

# 2. Clean, single-line graph view (Most popular everyday command):
git log --oneline --graph --decorate --all

# 3. Limit to the last 5 commits:
git log -n 5 --oneline

# 4. View which files and how many lines changed per commit:
git log --stat

# 5. Search commits by message content:
git log --grep="payment" --oneline

# 6. Filter commits by author name or email:
git log --author="Mostafa" --oneline
\`\`\`

---

## 4. Amend Commit (\`git commit --amend\`)

### When to use it?
You just made a commit, but 10 seconds later you realize:
1. You made an embarrassing typo in the commit message.
2. You forgot to include one small config file in the commit.

\`\`\`bash
# Scenario A: Fix a typo in the last commit message:
git commit --amend -m "feat(auth): correct spelling of authentication"

# Scenario B: Add a forgotten file into the last commit without changing the message:
git add forgotten-file.cs
git commit --amend --no-edit
\`\`\`

> [!CAUTION]
> **The Golden Rule of Amending:** \`git commit --amend\` rewrites history by generating a brand new SHA commit hash! **Only amend local commits** that have NOT been pushed to GitHub. Never amend commits on a shared public branch like \`main\`.

---

## 5. Revert Commit (\`git revert\`)

### When to use it?
You pushed a commit to production (\`main\`) yesterday, but today QA reports that it causes a critical bug. You need to undo it safely.

### Why \`revert\` instead of \`reset\`?
* \`git reset\` erases history, which breaks shared team branches and causes merge conflicts for your teammates.
* **\`git revert\` is 100% safe for public branches.** It creates a **brand-new commit** that applies the exact mathematical inverse of the target commit.

\`\`\`
Original History:      C1 ───> C2 (Buggy) ───> C3
After git revert C2:   C1 ───> C2 (Buggy) ───> C3 ───> C4 (Reverts C2)
\`\`\`

\`\`\`bash
# Revert a specific commit by its hash:
git revert 9a8f2b1

# Revert without opening the commit message editor:
git revert --no-edit 9a8f2b1
\`\`\`

---

## 6. Reset Commit: Demystifying \`git reset\`

\`git reset\` is Git's time-travel lever. It moves the current branch pointer (\`HEAD\`) backwards to an earlier commit in history.

The crucial question is: **When HEAD moves back, what happens to the changes that were in those commits?**
This is controlled by three flags: \`--soft\`, \`--mixed\`, and \`--hard\`.

\`\`\`
+-----------------------+-------------------+-------------------+-------------------+
| Command               | HEAD Pointer      | Staging Area      | Working Directory |
+-----------------------+-------------------+-------------------+-------------------+
| git reset --soft      | MOVES BACK        | KEEPS CHANGES     | KEEPS CHANGES     |
|                       | (Points earlier)  | (Files STAGED)    | (Edits untouched) |
|                       |                   |                   |                   |
| git reset --mixed     | MOVES BACK        | CLEARS INDEX      | KEEPS CHANGES     |
| (Default behavior)    | (Points earlier)  | (Files UNSTAGED)  | (Edits untouched) |
|                       |                   |                   |                   |
| git reset --hard      | MOVES BACK        | CLEARS INDEX      | DESTROYS EDITS    |
| (DANGER: Data Loss)   | (Points earlier)  | (Files wiped out) | (Files wiped out) |
+-----------------------+-------------------+-------------------+-------------------+
\`\`\`

---

## 7. Soft Reset (\`git reset --soft\`)

### What it does:
Rewinds the \`HEAD\` pointer back by one or more commits, but leaves both your **Staging Area** and your **Working Directory** completely untouched. All changes from the undone commits remain **Staged** (green).

### Best Use Case: Squashing messy local commits
Imagine you made 3 messy local commits:
* \`commit 1: WIP login\`
* \`commit 2: fix syntax error\`
* \`commit 3: forgot semicolon\`

Before pushing to GitHub, you want to combine them into 1 clean commit:
\`\`\`bash
# Rewind 3 commits, but keep all code staged:
git reset --soft HEAD~3

# Create one clean, professional commit:
git commit -m "feat(auth): implement complete user login module"
\`\`\`

---

## 8. Mixed Reset (\`git reset --mixed\`) — The Default

### What it does:
Rewinds \`HEAD\` and resets the **Staging Area**, but leaves your **Working Directory** untouched. The code you wrote is still safely on your disk, but it is now **Unstaged** (red).

### Best Use Case: Re-organizing changes
You made a commit with 10 files, but realize they should have been split into two separate commits:
\`\`\`bash
# Rewind 1 commit (or just: git reset HEAD~1):
git reset --mixed HEAD~1

# Now re-stage and commit file by file:
git add src/Models/
git commit -m "feat(models): add user domain entities"

git add src/Controllers/
git commit -m "feat(controllers): add user api endpoints"
\`\`\`

---

## 9. Hard Reset (\`git reset --hard\`) — Handle with Extreme Care

### What it does:
Rewinds \`HEAD\`, resets the Staging Area, **AND overwrites all files in your Working Directory** to match the target commit.

> [!CAUTION]
> Any uncommitted code currently in your working directory will be **permanently destroyed and unrecoverable**! Only use this when you are 100% certain you want to discard your recent work.

\`\`\`bash
# Wipe out the last commit and all associated edits:
git reset --hard HEAD~1

# Discard all local commits and force your branch to match GitHub:
git reset --hard origin/main
\`\`\`

### 🛟 Accidental Hard Reset? Use \`git reflog\`!
If you ran \`git reset --hard\` by mistake, don't panic! Git logs every movement of HEAD in a hidden safety net called **reflog**:
\`\`\`bash
# 1. Inspect recent HEAD movements:
git reflog
# Output:
# 3a1b2c4 HEAD@{0}: reset: moving to HEAD~1
# 9f8e7d6 HEAD@{1}: commit: my important code  <-- Here is your lost commit!

# 2. Rescue your lost commit:
git reset --hard 9f8e7d6
\`\`\`

---

## Quick Reference Summary

| Need | Recommended Command | Safety |
| :--- | :--- | :--- |
| "I want to fix my last commit message or add a forgotten file." | \`git commit --amend\` | 🟡 Safe locally only |
| "I need to undo a commit already pushed to a team branch." | \`git revert <hash>\` | 🟢 100% Safe everywhere |
| "I want to undo commits but keep my changes staged." | \`git reset --soft HEAD~1\` | 🟢 Safe (no code lost) |
| "I want to undo commits and unstage files, but keep my edits." | \`git reset --mixed HEAD~1\` | 🟢 Safe (no code lost) |
| "I want to completely wipe out bad code and start fresh." | \`git reset --hard HEAD~1\` | 🔴 Destructive |
`,
    contentBn: `# কমিট: তৈরি, মেসেজ স্ট্যান্ডার্ড, হিস্ট্রি, অ্যামেন্ড, রিভার্ট ও রিসেটের প্রকারভেদ

গিটে কমিট করা মানে কেবল "ফাইল সেভ করা" নয়। এটি হলো প্রজেক্টের পুরো কোডবেসের একটি স্থায়ী, ক্রিপ্টোগ্রাফিক স্ন্যাপশট। প্রফেশনাল সফটওয়্যার ইঞ্জিনিয়ার হতে হলে কমিট তৈরি, ফরম্যাটিং, হিস্ট্রি নেভিগেশন এবং রিসেট/রিভার্ট খুব গভীরভাবে বুঝতে হবে।

---

## ১. কমিট তৈরি করা (Creating Commits)

### কাজের মূল দর্শন:
কমিট হলো আপনার কোডের ডিজিটাল চেকপয়েন্ট। যখনই আপনি \`git commit\` চালান, গিট স্টেজিং এরিয়ার সমস্ত ফাইলকে সিলগালা করে \`.git/objects\` ফোল্ডারে একটি স্থায়ী অবজেক্ট তৈরি করে এবং একটি ইউনিক ৪০-অক্ষরের হ্যাশ আইডি (SHA) প্রদান করে।

### বহুল ব্যবহৃত ৩টি কমান্ড:
\`\`\`bash
# ১. স্ট্যান্ডার্ড কমিট মেসেজ সহ:
git commit -m "feat(auth): add user registration endpoint"

# ২. মাল্টি-লাইন বা বড় মেসেজের জন্য ডিফল্ট এডিটর (VS Code / Vim) খোলা:
git commit

# ৩. শর্টকাট: মডিফাইড ফাইল স্টেজ ও কমিট একসাথে করা (নতুন ফাইল ছাড়া):
git commit -am "fix(auth): update validation regex for phone numbers"
\`\`\`

---

## ২. প্রফেশনাল কমিট মেসেজ ও কনভেনশনাল স্ট্যান্ডার্ড

শীর্ষস্থানীয় সফটওয়্যার কোম্পানিগুলোতে (যেমন Brain Station 23, Enosis, Samsung R&D) **Conventional Commits** ফরম্যাট বাধ্যতামূলক। সুন্দর কমিট মেসেজ থাকলে কোড রিভিউ সহজ হয় এবং স্বয়ংক্রিয়ভাবে চেঞ্জলগ তৈরি করা যায়।

### স্ট্যান্ডার্ড ফরম্যাট:
\`\`\`
<type>[optional scope]: <সংক্ষিপ্ত বিবরণ>

[প্রয়োজনে বিস্তারিত বডি - কেন ও কী পরিবর্তন হয়েছে]

[রেফারেন্স বা ফুটার, যেমন: Closes #142]
\`\`\`

### বহুল ব্যবহৃত কমিট টাইপসমূহ:
* \`feat\`: নতুন কোনো ফিচার যুক্ত হলে (যেমন: \`feat(payment): add bkash payment gateway\`)
* \`fix\`: কোনো বাগ বা সমস্যা সমাধান করলে (যেমন: \`fix(cart): resolve discount calculation bug\`)
* \`refactor\`: কোড পরিচ্ছন্ন বা স্ট্রাকচার পরিবর্তন কিন্তু কার্যকারিতায় পরিবর্তন নেই
* \`perf\`: পারফরম্যান্স বৃদ্ধির কাজ
* \`docs\`: শুধুমাত্র ডকুমেন্টেশন বা README আপডেট
* \`test\`: স্বয়ংক্রিয় টেস্ট কোড যোগ করা
* \`chore\`: ডিপেন্ডেন্সি আপডেট বা বিল্ড কনফিগ সংক্রান্ত কাজ

### ৫০/৭২ এর সোনালী নিয়ম (The 50/72 Rule):
১. **প্রথম লাইন (৫০ অক্ষর):** প্রথম লাইনটি ৫০ অক্ষরের মধ্যে এবং ইম্পারেটিভ মুডে ("Add feature", "Fix bug") লিখতে হবে। কখনো "Added" বা "Fixed" লিখবেন না।
২. **বডি (৭২ অক্ষর):** প্রথম লাইনের পর একটি ফাঁকা লাইন দিয়ে বডিতে প্রতি লাইন ৭২ অক্ষরের মধ্যে রাখুন। এখানে ব্যাখ্যা করুন *কেন* এই পরিবর্তন দরকার ছিল।

---

## ৩. কমিট হিস্ট্রি দেখা (Viewing Commit History)

\`\`\`bash
# ১. স্ট্যান্ডার্ড বিস্তারিত হিস্ট্রি লগ (বের হতে 'q' চাপুন):
git log

# ২. এক লাইনে রঙিন গ্রাফসহ ভিজ্যুয়াল হিস্ট্রি (সবচেয়ে জনপ্রিয় কমান্ড):
git log --oneline --graph --decorate --all

# ৩. সর্বশেষ ৫টি কমিট দেখতে:
git log -n 5 --oneline

# ৪. কোন কমিটে কোন ফাইলে কত লাইন পরিবর্তন হয়েছে দেখতে:
git log --stat

# ৫. মেসেজের শব্দ দিয়ে কমিট খুঁজতে:
git log --grep="payment" --oneline

# ৬. নির্দিষ্ট লেখকের কমিট খুঁজতে:
git log --author="Mostafa" --oneline
\`\`\`

---

## ৪. সর্বশেষ কমিট এডিট করা (Amend Commit)

### কখন ব্যবহার করবেন?
মাত্র কয়েক সেকেন্ড আগে একটি কমিট করেছেন, কিন্তু হুট করে দেখলেন:
১. কমিট মেসেজে একটি বানানের ভুল হয়েছে।
২. একটি ছোট ফাইল স্টেজ করতে ভুলে গিয়েছিলেন।

\`\`\`bash
# পরিস্থিতি ক: শুধুমাত্র মেসেজের বানান ভুল ঠিক করতে:
git commit --amend -m "feat(auth): correct spelling of authentication"

# পরিস্থিতি খ: মেসেজ না বদলে ভুলে যাওয়া ফাইলটি আগের কমিটেই ঢুকিয়ে দিতে:
git add forgotten-file.cs
git commit --amend --no-edit
\`\`\`

> [!CAUTION]
> **সতর্কতা:** \`git commit --amend\` পূর্বের কমিটের হ্যাশ পরিবর্তন করে নতুন হ্যাশ তৈরি করে। এটি শুধুমাত্র নিজের মেশিনে থাকা লোকাল কমিটে ব্যবহার করবেন। গিটহাবে পুশ করে ফেলা কোনো শেয়ার্ড ব্রাঞ্চে কখনো অ্যামেন্ড করবেন না।

---

## ৫. নিরাপদ আনডু: রিভার্ট কমিট (Revert Commit)

### কখন ব্যবহার করবেন?
একটি কোড গিটহাবে \`main\` ব্রাঞ্চে পুশ করে প্রোডাকশনে পাঠিয়ে দিয়েছেন। এরপর টেস্টার জানালো যে ওই কোডে গুরুতর ত্রুটি রয়েছে। আপনি পরিবর্তনটি ফিরিয়ে নিতে চান।

### কেন \`reset\` না করে \`revert\` করবেন?
* \`git reset\` অতীত ইতিহাস মুছে ফেলে, যা পুরো টিমের লোকাল রিপোজিটরিতে বিশৃঙ্খলা সৃষ্টি করে।
* **\`git revert\` শতভাগ নিরাপদ।** এটি কোনো ইতিহাস না মুছে কাঙ্ক্ষিত কমিটের ঠিক বিপরীত পরিবর্তন দিয়ে একটি **সম্পূর্ণ নতুন কমিট** তৈরি করে।

\`\`\`
আগের হিস্ট্রি:             C1 ───> C2 (বাগযুক্ত কোড) ───> C3
git revert C2 চালানোর পর: C1 ───> C2 (বাগযুক্ত কোড) ───> C3 ───> C4 (C2 এর বিপরীত কোড)
\`\`\`

\`\`\`bash
# নির্দিষ্ট কোনো কমিট হ্যাশ রিভার্ট করতে:
git revert 9a8f2b1

# এডিটর না খুলে সরাসরি রিভার্ট কমিট তৈরি করতে:
git revert --no-edit 9a8f2b1
\`\`\`

---

## ৬. রিসেট কমিট (Reset Commit): টাইম ট্রাভেলের মূল কৌশল

\`git reset\` হলো গিটের টাইম মেশিন। এটি আপনার বর্তমান ব্রাঞ্চের পয়েন্টারকে (\`HEAD\`) পেছনের কোনো কমিটে ফিরিয়ে নিয়ে যায়।

এখানে মূল প্রশ্ন: **পয়েন্টার পেছনে গেলে ওই কমিটগুলোতে থাকা আপনার কোডের কী হবে?**
এটি নির্ভর করে তিনটি ফ্ল্যাগের ওপর: \`--soft\`, \`--mixed\`, এবং \`--hard\`।

\`\`\`
+-----------------------+-------------------+-------------------+-------------------+
| কমান্ড                | HEAD পয়েন্টার    | স্টেজিং এরিয়া     | লোকাল কোড ফাইল    |
+-----------------------+-------------------+-------------------+-------------------+
| git reset --soft      | পেছনে যায়        | অক্ষত থাকে        | অক্ষত থাকে        |
|                       |                   | (ফাইল Staged থাকে)| (কোড নষ্ট হয় না) |
|                       |                   |                   |                   |
| git reset --mixed     | পেছনে যায়        | আনস্টেজড হয়      | অক্ষত থাকে        |
| (ডিফল্ট নিয়ম)        |                   | (বক্স খালি হয়)   | (কোড নষ্ট হয় না) |
|                       |                   |                   |                   |
| git reset --hard      | পেছনে যায়        | সম্পূর্ণ মুছে যায় | সম্পূর্ণ মুছে যায় |
| (বিপজ্জনক!)         |                   | (ডেটা লস)         | (কোড ডিলিট হয়)   |
+-----------------------+-------------------+-------------------+-------------------+
\`\`\`

---

## ৭. সফট রিসেট (Soft Reset: \`--soft\`)

### এটি কী করে?
কমিটটিকে পেছনে নেয়, কিন্তু আপনার করা সমস্ত কোড **Staging Area**-তে স্টেজড (সবুজ) অবস্থায় রেখে দেয়। আপনার কোডের কোনো ক্ষতি হয় না।

### সবচেয়ে সুন্দর ব্যবহার: একাধিক এলোমেলো কমিট জোড়া লাগানো (Squash)
মনে করুন আপনি লোকালি ৩টি ছোট ছোট অগোছালো কমিট করেছেন ("wip", "fixed bug", "done")। পিআর দেওয়ার আগে এই ৩টিকে ১টি সুন্দর কমিট বানাতে চান:
\`\`\`bash
# ৩টি কমিট পেছনে ফিরুন, সমস্ত কোড স্টেজড থাকবে:
git reset --soft HEAD~3

# এবার একটি পরিচ্ছন্ন ও নিখুঁত কমিট তৈরি করুন:
git commit -m "feat(auth): complete user login and registration flow"
\`\`\`

---

## ৮. মিক্সড রিসেট (Mixed Reset: \`--mixed\`) — ডিফল্ট

### এটি কী করে?
কমিটটিকে পেছনে নেয় এবং স্টেজিং এরিয়া খালি করে, কিন্তু কোড আপনার ফাইলে সম্পূর্ণ অক্ষত রাখে। ফাইলগুলো এখন **Unstaged** (লাল) অবস্থায় থাকে।

### সবচেয়ে সুন্দর ব্যবহার: নতুন করে গুছিয়ে স্টেজ করা
একটি কমিটে হয়তো ১০টি ফাইল একসাথে কমিট করে ফেলেছিলেন। এখন চান সেগুলোকে আলাদা আলাদা ৩টি কমিটে ভাগ করতে:
\`\`\`bash
# শেষ কমিটটি আনডু করুন (কোড ফাইলে থাকবে কিন্তু আনস্টেজড হবে):
git reset HEAD~1

# এবার ফাইলগুলো বেছে বেছে স্টেজ করে আলাদা কমিট করুন:
git add Models/
git commit -m "feat: user models"

git add Controllers/
git commit -m "feat: user controller endpoints"
\`\`\`

---

## ৯. হার্ড রিসেট (Hard Reset: \`--hard\`) — চূড়ান্ত সতর্কতা!

### এটি কী করে?
কমিট পেছনে নেয়, স্টেজিং এরিয়া খালি করে এবং **আপনার ফাইলের সমস্ত আনকমিটেড কোড চিরতরে মুছে ফেলে** টার্গেট কমিটের হুবহু অবস্থায় ফেরত যায়।

> [!CAUTION]
> এই কমান্ড চালালে আনকমিটেড কোড আর সাধারণ উপায়ে ফেরত পাওয়া যায় না! যখন আপনি নিশ্চিত যে সাম্প্রতিক কাজগুলো সম্পূর্ণ ভুল এবং সব ফেলে দিতে চান, কেবল তখনই এটি ব্যবহার করবেন।

\`\`\`bash
# শেষ কমিট এবং তার সমস্ত কোড ডিলিট করে আগের কমিটে ফিরতে:
git reset --hard HEAD~1

# লোকাল সব অদলবদল ফেলে দিয়ে হুবহু গিটহাবের রিমোটের সমান হতে:
git reset --hard origin/main
\`\`\`

### 🛟 ভুলবশত হার্ড রিসেট দিয়ে ফেলেছেন? উদ্ধার করবে \`git reflog\`!
গিট তার ব্যাকগ্রাউন্ডে HEAD-এর প্রতিটি নড়াচড়া একটি সিক্রেট লগে লিখে রাখে যার নাম **reflog**:
\`\`\`bash
# ১. অতীতের প্রতিটি মুভমেন্টের তালিকা দেখুন:
git reflog
# আউটপুটে দেখতে পাবেন:
# 3a1b2c4 HEAD@{0}: reset: moving to HEAD~1
# 9f8e7d6 HEAD@{1}: commit: my lost code  <-- এই যে আপনার হারিয়ে যাওয়া কমিট!

# ২. ম্যাজিকের মতো হারানো কমিটে ফিরে যান:
git reset --hard 9f8e7d6
\`\`\`

---

## একনজরে সিদ্ধান্ত গাইড

| আপনি যা চান | সঠিক কমান্ড | নিরাপত্তা |
| :--- | :--- | :--- |
| শেষ কমিটের মেসেজ ঠিক করতে বা ভুলে যাওয়া ফাইল যোগ করতে | \`git commit --amend\` | 🟡 শুধু লোকাল ব্রাঞ্চে নিরাপদ |
| গিটহাবে পুশ করা পাবলিক ব্রাঞ্চের কমিট বাতিল করতে | \`git revert <hash>\` | 🟢 শতভাগ নিরাপদ |
| কমিট আনডু করে সব কোড স্টেজড রাখতে | \`git reset --soft HEAD~1\` | 🟢 নিরাপদ (কোড অক্ষত থাকে) |
| কমিট আনডু করে কোড আনস্টেজড রাখতে | \`git reset --mixed HEAD~1\` | 🟢 নিরাপদ (কোড অক্ষত থাকে) |
| কোড ও হিস্ট্রি সব ডিলিট করে পূর্বের অবস্থায় ফিরতে | \`git reset --hard HEAD~1\` | 🔴 মারাত্মক ঝুঁকিপূর্ণ |
`,
  };
