import type { LocalLesson } from "@/lib/lessons-data";

export const MODULE_2_LESSONS: LocalLesson[] = [
  {
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
  },
  {
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
  },
  {
    slug: "git-merging",
    titleEn: "Merging: Fast-Forward, 3-Way Merge, Conflicts & Resolution",
    titleBn: "মার্জিং: ফাস্ট-ফরওয়ার্ড, ৩-ওয়ে মার্জ, কনফ্লিক্ট ও সমাধান",
    categoryEn: "6. Merging & Conflict Resolution",
    categoryBn: "৬. কোড মার্জ ও কনফ্লিক্ট সমাধান",
    categoryDescEn: "Fast-forward merges, three-way merge commits, merge conflicts, conflict markers, and conflict resolution workflows.",
    categoryDescBn: "ফাস্ট-ফরওয়ার্ড মার্জ, ৩-ওয়ে মার্জ কমিট, মার্জ কনফ্লিক্টের কারণ, কনফ্লিক্ট মার্কার এবং ধাপে ধাপে সমাধান কৌশল।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the algorithms behind Git merges, understand merge conflicts, and resolve collisions confidently in production.",
    descriptionBn: "গিট মার্জিং অ্যালগরিদম শিখুন, মার্জ কনফ্লিক্ট কেন ঘটে তা বুঝুন এবং আত্মবিশ্বাসের সাথে কনফ্লিক্ট সমাধান করুন।",
    difficulty: "MEDIUM",
    displayOrder: 6,
    prerequisites: ["git-branching"],
    estimatedMinutes: 30,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Basic Branching and Merging",
        url: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging",
        description: "Official walkthrough of fast-forward and 3-way merges.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "Walk through resolving a 3-way merge conflict from terminal step-by-step",
        url: null,
        difficulty: "MEDIUM",
        company: "Brain Station 23",
        tags: ["Git", "Merge", "Conflict Resolution", "Viva"],
        solutionEn: "1. Run 'git status' to find conflicting files marked 'both modified'. 2. Open file and inspect conflict markers (<<<<<<< HEAD for current branch, ======= divider, >>>>>>> incoming branch). 3. Decide proper code, delete markers, save. 4. Run 'git add <file>' to mark resolved. 5. Run 'git commit' to complete the merge commit. (Or run 'git merge --abort' if backing out).",
        solutionBn: "১. 'git status' চালিয়ে কনফ্লিক্ট হওয়া ফাইল চিহ্নিত করা। ২. ফাইল ওপেন করে কনফ্লিক্ট মার্কার (<<<<<<< HEAD, =======, >>>>>>>) দেখে সঠিক কোড ঠিক রাখা এবং মার্কার মুছে ফাইল সেভ করা। ৩. 'git add <file>' চালিয়ে কনফ্লিক্ট সমাধান মার্ক করা। ৪. 'git commit' চালিয়ে মার্জ সম্পন্ন করা। (প্রয়োজনে 'git merge --abort' দিয়ে মার্জ বাতিল করা যায়)।",
      },
    ],
    contentEn: `# Merging: git merge, Fast-Forward, 3-Way Merge, Conflicts, Abort & Best Practices

Merging is how isolated streams of development are brought together. Whether you are merging a feature branch into \`main\` locally or approving a Pull Request on GitHub, understanding the mathematics and algorithms behind Git merges is critical for every engineer.

---

## 1. What is \`git merge\`?

### The Core Concept:
\`git merge\` integrates the commits from another branch into your **currently active branch**.

\`\`\`bash
# The 2-step merge rule:
# Step 1: Switch to the RECEIVING branch (usually main or develop):
git switch main

# Step 2: Merge the incoming feature branch into main:
git merge feature/user-authentication
\`\`\`

> [!IMPORTANT]
> Merging always brings code **INTO** the branch you are currently standing on! Always double-check \`git branch\` to make sure you are on \`main\` before running \`git merge feature-branch\`.

---

## 2. Fast-Forward Merge (\`--ff\`)

A **Fast-Forward merge** occurs when there is **no divergence** between the two branches. The target branch has received zero new commits since the feature branch was created.

### How it works:
Because the history is completely linear, Git doesn't need to do any complex code blending. It simply **moves the \`main\` pointer forward** to point to the latest commit on the feature branch!

\`\`\`
Before Merge:
main:           C1 ───> C2
                          \
feature:                   C3 ───> C4

After 'git switch main && git merge feature':
main, feature:  C1 ───> C2 ───> C3 ───> C4 (HEAD)
\`\`\`

* **Result:** No new merge commit is created. The timeline remains a straight, unbroken line.
* **Force a Merge Commit (\`--no-ff\`):** Some enterprise teams require a distinct merge bubble in the history graph for every feature:
  \`\`\`bash
  git merge --no-ff feature/cart-checkout
  \`\`\`
* **Require Fast-Forward only (\`--ff-only\`):** Fails with an error if a true merge commit would be required:
  \`\`\`bash
  git merge --ff-only feature/cart-checkout
  \`\`\`

---

## 3. Three-Way Merge (True Merge Commit)

When **both** branches have progressed independently since they split apart, a Fast-Forward merge is physically impossible.

\`\`\`
Diverged History:
                  C3 ───> C4 [feature/payment]
                 /
C1 ───> C2 [Base]
                 \
                  C5 ───> C6 [main] (e.g. Someone else merged another feature!)
\`\`\`

### The 3-Way Merge Algorithm:
Git looks at three specific snapshots:
1. **Common Ancestor (C2):** The base commit where the two branches originally split.
2. **Current Branch Tip (C6 on \`main\`):** Where your \`HEAD\` is right now.
3. **Incoming Branch Tip (C4 on \`feature\`):** The code you want to bring in.

Git compares what changed between C2 -> C6 and what changed between C2 -> C4:
* If both branches edited **different files** (or different lines in the same file), Git automatically combines them and creates a **Merge Commit (M)** with two parent pointers!

\`\`\`
After Merge:
                  C3 ──────────> C4
                 /                 \
C1 ───> C2 [Base]                   M [Merge Commit on main]
                 \                 /
                  C5 ──────────> C6
\`\`\`

---

## 4. Merge Conflicts: Why They Happen

A **Merge Conflict** happens when Git's automatic algorithm cannot safely decide which code to keep.

### The Conflict Trigger:
A conflict occurs when two branches **modified the exact same lines of code in the same file** in different ways since their common ancestor. Git refuses to guess which engineer's code is correct, pauses the merge, and asks you to resolve it manually.

### Anatomy of Conflict Markers:
When a conflict occurs, Git writes special markers directly into your source code file:

\`\`\`csharp
<<<<<<< HEAD (Current change - Your main branch)
public decimal CalculateTax(decimal subtotal) => subtotal * 0.15m;
=======
public decimal CalculateTax(decimal subtotal) => subtotal * 0.20m;
>>>>>>> feature/tax-update (Incoming change - The feature branch)
\`\`\`

* \`<<<<<<< HEAD\`: Marks the beginning of the conflicting code from your current branch.
* \`=======\`: The dividing separator between the two conflicting versions.
* \`>>>>>>> branch-name\`: Marks the end of the conflicting code from the incoming branch.

---

## 5. Resolving Conflicts Step-by-Step

Never panic when you see a merge conflict! It is a normal, everyday part of collaborative software engineering. Follow these 5 steps:

\`\`\`bash
# Step 1: Attempt the merge:
git switch main
git merge feature/tax-update
# Output:
# Auto-merging src/Services/TaxService.cs
# CONFLICT (content): Merge conflict in src/Services/TaxService.cs
# Automatic merge failed; fix conflicts and then commit the result.

# Step 2: Check which files are in conflict:
git status
# Look for files marked: both modified: src/Services/TaxService.cs

# Step 3: Open the file in VS Code or your IDE.
# Discuss with the other developer or check the business requirement.
# Choose the correct code, and DELETE all the <<<<<<<, =======, and >>>>>>> marker lines!

# Step 4: Tell Git the conflict is resolved by staging the file:
git add src/Services/TaxService.cs

# Step 5: Finalize the merge commit:
git commit -m "merge: resolve tax rate calculation conflict between main and feature"
\`\`\`

---

## 6. Abort Merge (\`git merge --abort\`)

What if you start a merge, get hit with 15 complex merge conflicts across 30 files, and realize you are not ready to solve them right now?

\`\`\`bash
# Safely abort the entire merge process:
git merge --abort
\`\`\`

### What happens:
Git instantly rewinds your entire repository, working tree, and staging area back to the exact clean state before you typed \`git merge\`. No files are damaged or lost!

---

## 7. Merge Best Practices in Professional Teams

Top software teams follow these battle-tested practices to avoid painful "merge hell":

1. **Keep Branches Short-Lived:** Don't work on an isolated feature branch for 3 months. Merge small chunks of work into \`main\` every 2–3 days.
2. **Pull \`main\` Frequently:** Before opening a PR or merging, pull the latest \`main\` into your feature branch locally and test it:
   \`\`\`bash
   git switch feature/my-feature
   git merge main
   # (Resolve any small conflicts here in your private branch before touching production!)
   \`\`\`
3. **Always Run Tests Before Merging:** Run your unit tests and build scripts (\`npm run build\` or \`dotnet build\`) before committing a merge.
4. **Clean Descriptive Commit Messages:** If creating a manual merge commit, write what was integrated and why any conflicts were resolved the way they were.
`,
    contentBn: `# মার্জিং: git merge, ফাস্ট-ফরওয়ার্ড, ৩-ওয়ে মার্জ, কনফ্লিক্ট সমাধান ও বেস্ট প্র্যাকটিস

আলাদা আলাদা ব্রাঞ্চে স্বাধীনভাবে ফিচার তৈরির পর সেই কোড মূল প্রজেক্টে বা \`main\` ব্রাঞ্চে একত্রিত করার প্রক্রিয়াকেই বলা হয় **Merging (মার্জিং)**। ইন্টারভিউতে মার্জিং অ্যালগরিদম এবং মার্জ কনফ্লিক্ট সমাধানের নিয়ম সবচেয়ে বেশি জানতে চাওয়া হয়।

---

## ১. \`git merge\` কী?

### মূল ধারণা:
\`git merge\` অন্য কোনো ব্রাঞ্চের সমস্ত নতুন কমিটকে আপনার **বর্তমান সক্রিয় ব্রাঞ্চের (Current Active Branch)** সাথে জোড়া লাগায়।

\`\`\`bash
# মার্জ করার ২ ধাপের নিয়ম:
# ধাপ ১: যে ব্রাঞ্চে কোড আনতে চান সেখানে সুইচ করুন (সাধারণত main):
git switch main

# ধাপ ২: ফিচার ব্রাঞ্চটিকে main-এ মার্জ করুন:
git merge feature/user-authentication
\`\`\`

> [!IMPORTANT]
> **সতর্কতা:** মার্জ সর্বদা আপনি **যে ব্রাঞ্চে দাঁড়িয়ে আছেন তার ভেতর** কোড নিয়ে আসে! তাই \`git merge\` চালানোর আগে সর্বদা নিশ্চিত হোন যে আপনি \`main\` ব্রাঞ্চে আছেন কি না।

---

## ২. ফাস্ট-ফরওয়ার্ড মার্জ (Fast-Forward Merge)

যদি ফিচার ব্রাঞ্চ তৈরির পর থেকে মূল \`main\` ব্রাঞ্চে নতুন কোনো কমিট না পড়ে থাকে, তবে তাকে বলা হয় **Fast-Forward Merge**।

### কীভাবে কাজ করে?
যেহেতু দুই ব্রাঞ্চের মাঝে কোনো হিস্ট্রি ভিন্ন দিকে মোড় নেয়নি (Linear History), তাই গিট কোনো জটিল মার্জিং অ্যালগরিদম চালায় না। গিট কেবল \`main\` ব্রাঞ্চের পয়েন্টারটিকে সরাসরি ফিচার ব্রাঞ্চের শেষ কমিটে এগিয়ে দেয়!

\`\`\`
মার্জ করার আগে:
main:           C1 ───> C2
                          \
feature:                   C3 ───> C4

মার্জ করার পর:
main, feature:  C1 ───> C2 ───> C3 ───> C4 (HEAD)
\`\`\`

* **ফলাফল:** কোনো অতিরিক্ত "Merge Commit" তৈরি হয় না। হিস্ট্রি এক সরলরেখায় থাকে।
* **জোরপূর্বক মার্জ কমিট তৈরি (\`--no-ff\`):** কোম্পানিগুলো অনেক সময় আলাদা মার্জ বাবল দেখতে চায়:
  \`\`\`bash
  git merge --no-ff feature/cart-checkout
  \`\`\`

---

## ৩. ৩-ওয়ে মার্জ (Three-Way Merge)

যদি আপনি ফিচার ব্রাঞ্চে কাজ করার সময় অন্য কোনো সহকর্মী মূল \`main\` ব্রাঞ্চে আরেকটি নতুন ফিচার মার্জ করে ফেলেন, তখন উভয় ব্রাঞ্চের ইতিহাস দুই দিকে মোড় নেয় (Diverged)। এক্ষেত্রে ফাস্ট-ফরওয়ার্ড অসম্ভব।

\`\`\`
উভয় ব্রাঞ্চ পরিবর্তিত হলে:
                  C3 ───> C4 [feature/payment]
                 /
C1 ───> C2 [Base]
                 \
                  C5 ───> C6 [main] (অন্য কারো কোড যুক্ত হয়েছে)
\`\`\`

### ৩-ওয়ে অ্যালগরিদম কীভাবে কাজ করে?
গিট ৩টি নির্দিষ্ট কমিটকে একসাথে তুলনা করে:
1. **কমন বেস (Common Base - C2):** যেখানে ব্রাঞ্চ দুটি বিভক্ত হয়েছিল।
2. **বর্তমান ব্রাঞ্চের মাথা (C6 on \`main\`):** আপনি যেখানে আছেন।
3. **আগত ব্রাঞ্চের মাথা (C4 on \`feature\`):** যা আপনি যুক্ত করতে চান।

যদি উভয় ব্রাঞ্চ **ভিন্ন ভিন্ন ফাইলে** কাজ করে থাকে, গিট চমৎকারভাবে সব কোড একত্রিত করে একটি বিশেষ **Merge Commit (M)** তৈরি করে দেয় যার দুটি প্যারেন্ট কমিট থাকে!

\`\`\`
মার্জ শেষে:
                  C3 ──────────> C4
                 /                 \
C1 ───> C2 [Base]                   M [মার্জ কমিট]
                 \                 /
                  C5 ──────────> C6
\`\`\`

---

## ৪. মার্জ কনফ্লিক্ট (Merge Conflict): কেন ঘটে?

মার্জ কনফ্লিক্ট হলো যখন গিট একা একা সিদ্ধান্ত নিতে পারে না কোন কোডটি সঠিক।

### কনফ্লিক্টের মূল কারণ:
যদি দুটি আলাদা ব্রাঞ্চে **একই ফাইলের হুবহু একই লাইনে** দুজন ডেভেলপার দুই ধরণের কোড লেখেন, তখন গিট দ্বিধায় পড়ে যায়। সে কারো কোড নষ্ট না করে মার্জ থামিয়ে দেয় এবং আপনাকে ডেকে বলে—"তোমরা নিজেরা ঠিক করো কোন কোডটি থাকবে!"

### কনফ্লিক্ট মার্কারের পরিচয়:
কনফ্লিক্ট হলে গিট ফাইলের ভেতরে ৩টি বিশেষ চিহ্ন বসায়:

\`\`\`csharp
<<<<<<< HEAD (আপনার বর্তমান ব্রাঞ্চের কোড)
public decimal CalculateTax(decimal subtotal) => subtotal * 0.15m;
=======
public decimal CalculateTax(decimal subtotal) => subtotal * 0.20m;
>>>>>>> feature/tax-update (অন্য ব্রাঞ্চ থেকে আসা কোড)
\`\`\`

* \`<<<<<<< HEAD\`: আপনার বর্তমান ব্রাঞ্চের কোডের শুরু।
* \`=======\`: দুই ব্রাঞ্চের কোডের মাঝখানের বিভাজন রেখা।
* \`>>>>>>> branch-name\`: আগত ব্রাঞ্চের কোডের শেষ।

---

## ৫. কনফ্লিক্ট সমাধানের সহজ ৫টি ধাপ

কনফ্লিক্ট দেখলে কখনো ঘাবড়াবেন না। সফটওয়্যার ইঞ্জিনিয়ারিংয়ে এটি প্রতিদিনের স্বাভাবিক ঘটনা:

\`\`\`bash
# ধাপ ১: মার্জ কমান্ড দিন:
git switch main
git merge feature/tax-update
# কনফ্লিক্ট থাকলে আউটপুট আসবে: Automatic merge failed; fix conflicts...

# ধাপ ২: কোন ফাইলে সমস্যা তা দেখুন:
git status
# ফাইলের পাশে লেখা থাকবে: both modified: TaxService.cs

# ধাপ ৩: ফাইলটি VS Code-এ খুলুন।
# অন্য ইঞ্জিনিয়ারের সাথে আলোচনা করে সঠিক কোডটি রাখুন এবং
# <<<<<<<, =======, >>>>>>> মার্কারগুলো ফাইল থেকে মুছে দিন!

# ধাপ ৪: সমাধান সম্পন্ন হয়েছে বোঝাতে ফাইলে git add চালান:
git add TaxService.cs

# ধাপ ৫: মার্জ সম্পন্ন করতে কমিট দিন:
git commit -m "merge: resolve tax calculation conflict between main and feature"
\`\`\`

---

## ৬. মার্জ বাতিল করা: \`git merge --abort\`

মার্জ করতে গিয়ে যদি দেখেন ৫০টি ফাইলে ভয়াবহ কনফ্লিক্ট হয়েছে এবং এই মুহূর্তে তা ঠিক করার সময় নেই:

\`\`\`bash
# পুরো মার্জ প্রক্রিয়াটি তৎক্ষণাৎ বাতিল করে আগের পরিষ্কার অবস্থায় ফিরতে:
git merge --abort
\`\`\`
এই কমান্ড দিলে গিট আপনার প্রোজেক্টকে ঠিক মার্জ কমান্ড দেওয়ার আগের নিখুঁত অবস্থায় ফিরিয়ে নেবে। কোনো কোড হারাবে না।

---

## ৭. ইন্ডাস্ট্রিয়াল মার্জ বেস্ট প্র্যাকটিস

1. **ব্রাঞ্চের আয়ু ছোট রাখুন:** ৩ মাস ধরে একটি ব্রাঞ্চে কাজ জমিয়ে রাখবেন না। ২-৩ দিন পর পর ছোট ছোট ফিচার মার্জ করুন।
2. **নিয়মিত \`main\` পুল করুন:** আপনার ফিচার ব্রাঞ্চে কাজ করার সময় প্রতিদিন একবার \`main\` ব্রাঞ্চের কোড নিজের ব্রাঞ্চে মার্জ করে নিন। এতে কনফ্লিক্ট হলেও তা খুব ছোট থাকবে।
3. **মার্জের পর টেস্ট চালান:** মার্জ সম্পন্ন করার পর অবশ্যই পুরো প্রোজেক্ট বিল্ড ও ইউনিট টেস্ট চালিয়ে নিশ্চিত হোন যে সবকিছু ঠিকঠাক চলছে।
`,
  },
];
