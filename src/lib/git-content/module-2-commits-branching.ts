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
    contentEn: `# Commits: Conventional Messages, History, Amend, Revert & Resets

A Git commit is not just a saved version—it is a cryptographically hashed, immutable snapshot of the entire repository linked to its parent.

---

## 1. Professional Commit Messages & Conventional Commits

Top software engineering teams enforce the **Conventional Commits** specification:

\`\`\`
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
\`\`\`

### Common Types
* \`feat\`: A new feature for the user (e.g., \`feat(auth): add google oauth2 login\`)
* \`fix\`: A bug fix (e.g., \`fix(payment): prevent duplicate stripe webhooks\`)
* \`refactor\`: Code restructuring without changing external behavior
* \`perf\`: Performance optimization
* \`docs\`: Documentation updates only
* \`test\`: Adding or correcting tests
* \`chore\`: Build tools, package dependencies, CI scripts

### The 50/72 Rule
1. **Subject line**: 50 characters or less, written in the **imperative mood** ("Add feature", NOT "Added feature" or "Adds feature").
2. **Body**: Wrap lines at 72 characters. Explain the *Why* and *What*, not just the syntax.

---

## 2. Amending the Last Commit: \`git commit --amend\`

Did you forget to stage a file, or made a typo in the commit message?

\`\`\`bash
# 1. Stage the forgotten file
git add forgotten-file.cs

# 2. Amend into the previous commit without changing the message:
git commit --amend --no-edit

# Or amend and update the commit message:
git commit --amend -m "feat(auth): implement complete jwt token flow"
\`\`\`

> [!WARNING]
> Only amend local commits that have NOT been pushed to a shared remote branch!

---

## 3. Safe Reversal: \`git revert\`

\`git revert\` creates an inverse commit. It is 100% safe for shared public branches (like \`main\`):

\`\`\`bash
# Revert a specific faulty commit
git revert 9a8b7c6

# Revert without automatically opening the commit editor
git revert --no-edit 9a8b7c6
\`\`\`

---

## 4. Resetting History: Soft vs Mixed vs Hard

\`\`\`
                       HEAD    Index   Working Tree
git reset --soft       MOVES   keeps   keeps          (Changes remain STAGED)
git reset --mixed      MOVES   RESETS  keeps          (Changes become UNSTAGED)
git reset --hard       MOVES   RESETS  RESETS         (ALL CHANGES DESTROYED)
\`\`\`

### 1. Soft Reset (\`--soft\`)
Use when you made 3 messy small commits locally and want to squash them into 1 clean commit before opening a PR:
\`\`\`bash
git reset --soft HEAD~3
git commit -m "feat(cart): implement shopping cart checkout end-to-end"
\`\`\`

### 2. Mixed Reset (\`--mixed\`) [Default]
Moves HEAD back and unstages everything, allowing you to re-stage file by file:
\`\`\`bash
git reset HEAD~1
\`\`\`

### 3. Hard Reset (\`--hard\`)
Completely wipes out your current working tree changes and matches the target commit:
\`\`\`bash
# DANGER: All uncommitted work will be permanently lost!
git reset --hard HEAD~1
\`\`\`
`,
    contentBn: `# কমিট ডিপ-ডাইভ: কনভেনশনাল মেসেজ, হিস্ট্রি, অ্যামেন্ড, রিভার্ট ও রিসেট

গিটের প্রতিটি কমিট হলো একটি স্থায়ী ক্রিপ্টোগ্রাফিক স্ন্যাপশট। প্রফেশনাল কোম্পানিতে পরিষ্কার কমিট হিস্ট্রি রাখা অত্যন্ত গুরুত্বপূর্ণ যোগ্যতা হিসেবে বিবেচিত হয়।

---

## ১. কনভেনশনাল কমিট স্ট্যান্ডার্ড

বাংলাদেশ ও গ্লোবাল টেক কোম্পানিতে বহুল ব্যবহৃত কনভেনশনাল কমিট ফরম্যাট:
* \`feat\`: নতুন ফিচার যুক্ত হলে (যেমন: \`feat(auth): jwt token generation added\`)
* \`fix\`: কোনো বাগ ফিক্স করা হলে (যেমন: \`fix(cart): discount calculation bug fixed\`)
* \`refactor\`: আর্কিটেকচার পরিবর্তন কিন্তু বাহ্যিক ব্যবহারে পরিবর্তন নেই
* \`perf\`: পারফরম্যান্স বৃদ্ধি
* \`docs\`: শুধুমাত্র ডকুমেন্টেশন আপডেট

### ৫০/৭২ রুল
কমিট মেসেজের প্রথম লাইন ৫০ অক্ষরের মধ্যে এবং ইম্পারেটিভ মুডে ("Add", "Fix", "Update") লিখতে হয়।

---

## ২. সর্বশেষ কমিট পরিবর্তন করা: \`git commit --amend\`

কমিট করার পর দেখলেন একটি ফাইল স্টেজ করতে ভুলে গেছেন বা মেসেজে বানান ভুল হয়েছে:
\`\`\`bash
git add missing-file.cs
git commit --amend --no-edit
\`\`\`

---

## ৩. নিরাপদ আনডু: \`git revert\`

পাবলিক বা শেয়ার করা ব্রাঞ্চে কোনো কমিট বাতিল করতে চাইলে \`git revert\` ব্যবহার করতে হয়। এটি পূর্বের কমিটের ঠিক বিপরীত পরিবর্তন দিয়ে নতুন একটি কমিট তৈরি করে, ফলে হিস্ট্রি অক্ষত থাকে।
\`\`\`bash
git revert a1b2c3d
\`\`\`

---

## ৪. রিসেটের প্রকারভেদ: Soft, Mixed ও Hard

| কমান্ড | HEAD পয়েন্টার | স্টেজিং এরিয়া | লোকাল ফাইল |
| :--- | :--- | :--- | :--- |
| \`--soft\` | পরিবর্তন হয় | পরিবর্তন হয় না (Staged থাকে) | অক্ষত থাকে |
| \`--mixed\` (Default) | পরিবর্তন হয় | আনস্টেজড হয় | অক্ষত থাকে |
| \`--hard\` | পরিবর্তন হয় | মুছে যায় | **সম্পূর্ণ ডিলিট হয়ে যায়** |
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
    contentEn: `# Branching: Creation, Switching, Deletion & Naming Conventions

Branches allow multiple engineers to work on isolated features, bug fixes, or experiments simultaneously without destabilizing production code.

---

## 1. What is a Git Branch?

In legacy VCS systems, creating a branch copied every single file on the server. In Git, a branch is **just a movable pointer to a commit**.

\`\`\`
  main:     C1 <--- C2 <--- C3 (HEAD)
                             ^
  feature:  -----------------+
\`\`\`

When you make a new commit on \`feature\`, the \`feature\` pointer advances to C4, while \`main\` remains pointing at C3:

\`\`\`
  main:     C1 <--- C2 <--- C3
                             \
  feature:                    C4 (HEAD)
\`\`\`

---

## 2. Creating and Switching Branches

### The Modern Standard: \`git switch\`
In Git 2.23+, \`git switch\` replaced \`git checkout\` for branch switching to eliminate ambiguity:

\`\`\`bash
# Create and immediately switch to a new branch
git switch -c feature/user-profile

# Switch to an existing local branch
git switch main

# Switch to a remote branch and set up tracking automatically
git switch feature/payment-gateway
\`\`\`

### The Traditional Way: \`git checkout\`
\`\`\`bash
# Create and switch
git checkout -b feature/user-profile

# Switch to existing
git checkout main
\`\`\`

---

## 3. Listing and Deleting Branches

\`\`\`bash
# List all local branches (* indicates current branch)
git branch

# List both local and remote tracking branches
git branch -a

# Safe delete (only deletes if branch is already merged upstream)
git branch -d feature/user-profile

# Force delete (deletes unmerged branch with discarded code)
git branch -D feature/abandoned-experiment

# Delete a remote branch on GitHub
git push origin --delete feature/user-profile
\`\`\`

---

## 4. Professional Branch Naming Conventions

Leading engineering teams use prefix-based kebab-case conventions:

| Prefix | Usage | Example |
| :--- | :--- | :--- |
| \`feature/\` | New functionality | \`feature/JIRA-101-cart-checkout\` |
| \`bugfix/\` | Non-urgent defect fix | \`bugfix/JIRA-204-null-reference\` |
| \`hotfix/\` | Urgent production patch | \`hotfix/auth-token-bypass\` |
| \`release/\` | Version stabilization | \`release/v2.1.0\` |
| \`refactor/\` | Architecture / clean code | \`refactor/extract-repository-layer\` |
`,
    contentBn: `# ব্রাঞ্চিং: তৈরি, সুইচিং, ডিলিট ও নেইমিং কনভেনশন

ব্রাঞ্চিং সফটওয়্যার টিমের একাধিক ডেভেলপারকে একে অপরের কাজে বাধা না দিয়ে সম্পূর্ণ স্বাধীনভাবে নতুন ফিচার বা বাগফিক্সে কাজ করার স্বাধীনতা দেয়।

---

## ১. গিট ব্রাঞ্চ কী?

গিটে ব্রাঞ্চিং অত্যন্ত হালকা (Lightweight)। এটি কোনো ফাইল কপি করে না, বরং এটি শুধুমাত্র একটি কমিটের দিকে তাকিয়ে থাকা ৪১-বাইটের একটি পয়েন্টার।

---

## ২. ব্রাঞ্চ তৈরি ও সুইচ করা

### আধুনিক কমান্ড: \`git switch\`
\`\`\`bash
# নতুন ব্রাঞ্চ তৈরি করে সাথে সাথে সেখানে যেতে:
git switch -c feature/login-page

# পূর্বের কোনো ব্রাঞ্চে ফিরে যেতে:
git switch main
\`\`\`

### চিরাচরিত কমান্ড: \`git checkout\`
\`\`\`bash
git checkout -b feature/login-page
git checkout main
\`\`\`

---

## ৩. ব্রাঞ্চ লিস্ট ও ডিলিট করা

\`\`\`bash
# সমস্ত লোকাল ব্রাঞ্চ দেখতে:
git branch

# রিমোটসহ সব ব্রাঞ্চ দেখতে:
git branch -a

# নিরাপদে ব্রাঞ্চ ডিলিট করা (মার্জ হয়ে থাকলে):
git branch -d feature/login-page

# জোরপূর্বক ডিলিট করা (মার্জ না হলেও):
git branch -D feature/login-page

# রিমোট গিটহাব থেকে ব্রাঞ্চ ডিলিট করা:
git push origin --delete feature/login-page
\`\`\`

---

## ৪. প্রফেশনাল ব্রাঞ্চ নেইমিং নিয়ম
* \`feature/auth-jwt-login\` (নতুন ফিচারের জন্য)
* \`bugfix/checkout-discount-error\` (বাগ ফিক্সের জন্য)
* \`hotfix/production-db-crash\` (জরুরি প্রোডাকশন ফিক্সের জন্য)
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
    contentEn: `# Merging: Fast-Forward, 3-Way Merge, Conflicts & Resolution

Merging integrates changes from an independent feature branch into another branch (typically \`main\`).

---

## 1. Fast-Forward Merge

A **Fast-Forward merge** happens when there is no divergence between the target branch and the incoming branch. Git simply moves the target pointer forward:

\`\`\`
Before Merge:
main:        C1 <--- C2
                       \
feature:                C3 <--- C4

After 'git switch main && git merge feature':
main, feature: C1 <--- C2 <--- C3 <--- C4 (HEAD)
\`\`\`

No new merge commit is created because the history is strictly linear.

---

## 2. Three-Way Merge (True Merge Commit)

When both branches have progressed independently since their common ancestor, Git performs a **3-Way Merge**:
1. Common Base commit
2. Current branch tip (\`HEAD\`)
3. Incoming branch tip

\`\`\`
Before Merge:
            C3 <--- C4 (feature)
           /
C1 <--- C2 (base)
           \
            C5 <--- C6 (main)

After 'git merge feature':
            C3 <--- C4
           /          \
C1 <--- C2             M (Merge Commit on main)
           \          /
            C5 <--- C6
\`\`\`

---

## 3. Merge Conflicts: Why They Happen

A conflict occurs when two branches **modified the exact same lines of code in the same file** since their common ancestor. Git refuses to guess which engineer's code is correct and prompts the user.

### Conflict Markers
\`\`\`csharp
<<<<<<< HEAD
public decimal CalculateTax(decimal amount) => amount * 0.15m; // Current branch (main)
=======
public decimal CalculateTax(decimal amount) => amount * 0.18m; // Incoming branch (feature)
>>>>>>> feature/tax-update
\`\`\`

---

## 4. Step-by-Step Conflict Resolution

\`\`\`bash
# 1. Attempt merge
git switch main
git merge feature/tax-update
# Output: Automatic merge failed; fix conflicts and then commit the result.

# 2. Check which files are in conflict
git status
# both modified:   src/Services/TaxService.cs

# 3. Open the file in your IDE, discuss with teammates, keep the intended code,
# and DELETE the markers (<<<<<<<, =======, >>>>>>>).

# 4. Stage the resolved file
git add src/Services/TaxService.cs

# 5. Finalize the merge
git commit -m "merge: resolve tax calculation conflict between main and feature"

# EMERGENCY: If you make a mistake and want to abort the merge completely:
git merge --abort
\`\`\`
`,
    contentBn: `# মার্জিং: ফাস্ট-ফরওয়ার্ড, ৩-ওয়ে মার্জ, কনফ্লিক্ট ও সমাধান

ফিচার ব্রাঞ্চে কোড লেখা শেষ হলে তা মূল প্রোডাকশন বা \`main\` ব্রাঞ্চের সাথে যুক্ত করতে মার্জ করা হয়।

---

## ১. ফাস্ট-ফরওয়ার্ড (Fast-Forward) মার্জ
যদি মূল ব্রাঞ্চে কোনো নতুন পরিবর্তন না আসে, তবে গিট কোনো নতুন কমিট তৈরি না করে মূল ব্রাঞ্চের পয়েন্টারকে সরাসরি ফিচার ব্রাঞ্চের মাথায় এগিয়ে দেয়। একে ফাস্ট-ফরওয়ার্ড বলে।

---

## ২. ৩-ওয়ে (Three-Way) মার্জ
যদি মূল ব্রাঞ্চ এবং ফিচার ব্রাঞ্চ উভয়েই স্বাধীনভাবে পরিবর্তিত হয়, তখন গিট একটি কমন অ্যানসেস্টর (Common Base) সহ উভয় ব্রাঞ্চের পরিবর্তনকে একত্রিত করে একটি নতুন **মার্জ কমিট (Merge Commit)** তৈরি করে।

---

## ৩. মার্জ কনফ্লিক্ট ও মার্কার
একই ফাইলের একই লাইনে যদি দুজন ডেভেলপার দুই ধরণের কোড লিখে মার্জ করতে যান, তখন গিট বুঝতে পারে না কার কোডটি সঠিক। তখন গিট ফাইলটিতে কনফ্লিক্ট মার্কার বসায়:
* \`<<<<<<< HEAD\`: আপনার বর্তমান ব্রাঞ্চের কোড
* \`=======\`: বিভাজন রেখা
* \`>>>>>>> branch-name\`: অন্য ব্রাঞ্চ থেকে আসা কোড

---

## ৪. কনফ্লিক্ট সমাধানের ৪টি ধাপ
১. \`git status\` দিয়ে কোন কোন ফাইলে কনফ্লিক্ট হয়েছে তা বের করুন।
২. ফাইলে ঢুকে সঠিক কোডটি রাখুন এবং \`<<<<<<<\`, \`=======\`, \`>>>>>>>\` মার্কারগুলো মুছে ফেলুন।
৩. \`git add <file>\` চালিয়ে সমাধান মার্ক করুন।
৪. \`git commit\` চালিয়ে মার্জ সফলভাবে শেষ করুন।
(যদি মার্জ বাতিল করতে চান: \`git merge --abort\`)
`,
  },
];
