import type { LocalLesson } from "@/lib/lessons-data";

export const gitInterviewQuestionsLesson: LocalLesson = {
    slug: "git-interview-questions",
    titleEn: "20. Git Interview Questions: Core Concepts & Viva Scenarios",
    titleBn: "২০. গিট ইন্টারভিউ প্রশ্নাবলি: কোর কনসেপ্ট ও ভাইভা সিনারিও",
    categoryEn: "20. Git Interview Questions",
    categoryBn: "২০. গিট ইন্টারভিউ প্রশ্নাবলি",
    categoryDescEn: "Definitive answers to the top 11 Git & GitHub technical interview questions, comparative breakdowns, and scenario-based troubleshooting.",
    categoryDescBn: "শীর্ষ ১১টি গিট ও গিটহাব টেকনিক্যাল ইন্টারভিউ প্রশ্ন, তুলনামূলক পার্থক্য ও ব্যবহারিক ট্রাবলশুটিং সমাধান।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the 11 most frequently asked Git & GitHub interview questions across Bangladesh top tech companies (Enosis, Brain Station 23, Therap, Samsung R&D, BJIT).",
    descriptionBn: "বাংলাদেশের শীর্ষ টেক কোম্পানিগুলোর (Enosis, Brain Station, Therap, Samsung R&D, BJIT) গিট ও গিটহাব ইন্টারভিউয়ের সম্পূর্ণ প্রস্তুতি নিন।",
    difficulty: "HARD",
    displayOrder: 20,
    prerequisites: ["git-advanced"],
    estimatedMinutes: 45,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Git Pro Book — Git Internals",
        url: "https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain",
        description: "Official guide on how Git stores objects, refs, and the index under the hood.",
        isStarred: true,
      },
      {
        source: "Git Documentation",
        title: "Advanced Merging & Conflict Resolution",
        url: "https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging",
        description: "Deep dive into 3-way merges and conflict analysis.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "What happens when you enter a 'Detached HEAD' state in Git, and how do you safely escape it without losing commits?",
        url: null,
        difficulty: "HARD",
        company: "Enosis Solutions",
        tags: ["Git", "Detached HEAD", "Viva", "Refs"],
        solutionEn: "'Detached HEAD' occurs when HEAD points directly to a specific commit hash rather than a named branch ref. If you make commits while detached, no branch tracks them, and they will eventually be garbage-collected. To safely keep those commits, create and switch to a new branch immediately via 'git switch -c recovery-branch'.",
        solutionBn: "'Detached HEAD' তখনই ঘটে যখন HEAD কোনো নির্দিষ্ট ব্রাঞ্চের নাম নির্দেশ না করে সরাসরি কোনো কমিট হ্যাশকে পয়েন্ট করে। এ অবস্থায় নতুন কমিট করলে কোনো ব্রাঞ্চ তা ট্র্যাক করে না এবং তা হারিয়ে যাওয়ার ঝুঁকিতে পড়ে। এই কাজগুলো নিরাপদ রাখতে সাথে সাথে 'git switch -c new-branch-name' চালিয়ে নতুন ব্রাঞ্চে রূপান্তর করতে হয়।",
      },
      {
        source: "BD Tech Interview",
        name: "You made 5 commits directly on 'main' that should have been on a new feature branch. You have not pushed yet. How do you cleanly fix this without losing work?",
        url: null,
        difficulty: "HARD",
        company: "Brain Station 23",
        tags: ["Git", "Branch", "Reset", "Troubleshooting"],
        solutionEn: "Create the new feature branch at current HEAD (capturing all 5 commits): 'git branch feature/my-work'. Next, reset 'main' backward by 5 commits: 'git reset --hard HEAD~5'. Finally, switch to your feature branch: 'git switch feature/my-work'. Main is pristine and the feature branch holds all commits.",
        solutionBn: "বর্তমান অবস্থায় নতুন ফিচার ব্রাঞ্চ তৈরি করুন: 'git branch feature/my-work' (এতে ৫টি কমিট নতুন ব্রাঞ্চে সংরক্ষিত হয়ে যাবে)। এরপর মেইন ব্রাঞ্চকে ৫ কমিট পেছনে রিসেট করুন: 'git reset --hard HEAD~5'। সবশেষে ফিচার ব্রাঞ্চে সুইচ করুন: 'git switch feature/my-work'। মেইন ব্রাঞ্চ আগের মতো পরিচ্ছন্ন হয়ে যাবে এবং ফিচার ব্রাঞ্চে সমস্ত কাজ অক্ষত থাকবে।",
      },
      {
        source: "BD Tech Viva",
        name: "Why is 'git fetch' followed by 'git merge' considered architecturally superior to 'git pull' in enterprise workflows?",
        url: null,
        difficulty: "MEDIUM",
        company: "Therap Services",
        tags: ["Git", "Fetch", "Pull", "Best Practices"],
        solutionEn: "'git pull' immediately forces a merge into your active working directory, risking uninspected merge conflicts or build breaks. In contrast, 'git fetch' downloads remote changes safely into remote-tracking refs without modifying any local files. This allows developers to run 'git diff HEAD..origin/main' or 'git log HEAD..origin/main' to review incoming changes before deciding whether to merge, rebase, or cherry-pick.",
        solutionBn: "'git pull' সাথে সাথে লোকাল ফাইলের সাথে মার্জ ঘটিয়ে বিল্ড ভেঙে দিতে পারে। পক্ষান্তরে 'git fetch' শুধুমাত্র রিমোট অবজেক্ট ডাউনলোড করে কিন্তু লোকাল ফাইলে বিন্দুমাত্র হাত দেয় না। ফলে ডেভেলপার 'git log HEAD..origin/main' দিয়ে সহকর্মীদের কোড নিরীক্ষা করে নিশ্চিত হয়ে তারপর মার্জ বা রিবেস করার সিদ্ধান্ত নিতে পারেন।",
      },
    ],
    contentEn: `# 20. Git Interview Questions: Core Concepts & Viva Scenarios

\`\`\`text
20. Git Interview Questions
    ├── Git vs GitHub
    ├── Git vs SVN
    ├── Working Tree vs Staging Area
    ├── Merge vs Rebase
    ├── Pull vs Fetch
    ├── Reset vs Revert
    ├── Clone vs Fork
    ├── HEAD
    ├── origin vs upstream
    ├── Conflict Resolution
    └── Git Troubleshooting
\`\`\`

These 11 core interview questions and scenario-based troubleshooting challenges represent the most frequently asked Git topics in technical written tests, pair programming interviews, and technical vivas across Bangladesh tech companies (Brain Station 23, Enosis Solutions, Therap, Samsung R&D, BJIT, Optimizely, Kaz Software).

---

## 1. Git vs GitHub

\`\`\`text
┌──────────────────────────────────────┐       ┌──────────────────────────────────────┐
│                 Git                  │       │                GitHub                │
├──────────────────────────────────────┤       ├──────────────────────────────────────┤
│ • Local CLI software engine          │       │ • Cloud web hosting service          │
│ • Runs 100% offline on your machine  │       │ • Requires internet connection       │
│ • Distributed Version Control System │       │ • Owned by Microsoft                 │
│ • Manages commits, trees, refs       │       │ • Adds PRs, Actions CI, Issues, Wiki │
│ • Alternatives: Mercurial, SVN       │       │ • Alternatives: GitLab, Bitbucket    │
└──────────────────────────────────────┘       └──────────────────────────────────────┘
\`\`\`

### Interview Answer:
* **Git** is a distributed command-line Version Control System (VCS) tool installed locally on your operating system. It tracks historical snapshots of your project files in an append-only DAG (Directed Acyclic Graph).
* **GitHub** is a cloud-based hosting service and collaboration platform built on top of Git. It hosts remote Git repositories and adds graphical collaboration primitives such as Pull Requests, Code Reviews, GitHub Actions (CI/CD), Issue Trackers, and security scanners.

---

## 2. Git vs SVN (Centralized vs Distributed VCS)

\`\`\`text
Centralized VCS (SVN):                Distributed VCS (Git):
[Central SVN Server]                  [Developer A] ◄──────► [Developer B]
   ▲         ▲                              ▲                       ▲
   │         │                              │                       │
   ▼         ▼                              ▼                       ▼
[Dev 1]   [Dev 2]                         [Central Remote (e.g. GitHub)]
(Offline = No Commits!)               (Every dev has the FULL repository clone!)
\`\`\`

| Feature | Git (Distributed VCS) | SVN (Centralized VCS) |
| :--- | :--- | :--- |
| **Architecture** | Distributed: Every developer has the complete repository history locally | Centralized: Single central server holds history; clients check out single revisions |
| **Offline Capability** | 100% offline: You can commit, branch, diff, and log on an airplane | No offline commits: Cannot commit or view history without server connectivity |
| **Branching Performance** | Instantaneous ($O(1)$) pointer creation | Heavyweight: Copies directory structures on the server |
| **Single Point of Failure** | No: If GitHub is destroyed, any developer clone can restore the entire repo | Yes: If the central SVN server fails without backup, history is lost |

---

## 3. Working Tree vs Staging Area (Index) vs Local Repository

\`\`\`text
┌──────────────────┐    git add      ┌──────────────────┐   git commit    ┌──────────────────┐
│   Working Tree   │ ──────────────► │   Staging Area   │ ──────────────► │ Local Repository │
│  (Editable Files)│                 │  (.git/index)    │                 │  (.git/objects)  │
└──────────────────┘ ◄────────────── └──────────────────┘                 └──────────────────┘
                       git restore        (Binary Cache)                    (Immutable DAG)
\`\`\`

### The Three Trees of Git Explained:
1. **Working Tree (Working Directory)**: The actual directory on your filesystem where you edit files, run compilers, and write code.
2. **Staging Area (The Index)**: A binary staging cache file located at \`.git/index\`. It acts as a staging dock holding the exact snapshot of files that will go into the next commit.
3. **Local Repository**: The compressed, immutable object database located at \`.git/objects/\`. It stores permanently committed snapshots (blobs, trees, commits, annotated tags).

### Why the Staging Area is a Superpower:
Unlike older VCS tools that force you to commit all modified files at once, Git's staging area allows you to craft **clean, atomic commits**:
* You can stage specific files: \`git add src/User.cs\`
* You can even stage specific lines within a single file: \`git add -p\` (Interactive Patch staging).

---

## 4. Merge vs Rebase (\`git merge\` vs \`git rebase\`)

\`\`\`text
Merge (Preserves True History):
main:    M1 ─── M2 ─────────────── M3 (Merge Commit: 2 Parents)
                 └─── F1 ─── F2 ───┘ (Feature Branch)

Rebase (Linear Rewritten History):
main:    M1 ─── M2 ─── F1' ─── F2' (Linear: Replayed commits, new hashes!)
\`\`\`

| Dimension | \`git merge\` | \`git rebase\` |
| :--- | :--- | :--- |
| **Graph Topology** | Non-linear: Creates a 3-way merge commit with two parent pointers | Linear: Perfectly straight single line of commit history |
| **History Integrity** | Preserves historical chronology exactly as it happened | Rewrites history: Assigns brand-new commit hashes to replayed commits |
| **Traceability** | Easy to identify when a feature branch joined main | Clean \`git log\`; easier for \`git bisect\` to traverse |
| **Public Branch Safety** | 100% safe on public shared branches | **UNSAFE** on public shared branches; only rebase local private branches |

---

## 5. Pull vs Fetch (\`git pull\` vs \`git fetch\`)

\`\`\`text
                          git fetch origin
[Remote Repository] ──────────────────────────► [Local Remote-Tracking Refs: origin/main]
                                                               │
                                                               ▼ git merge
                                                    [Local Working Tree / Current Branch]
                    ◄──────────────────────────────────────────┘
                                 git pull origin main
                             (Fetch + Merge in one step!)
\`\`\`

### Key Distinctions:
* **\`git fetch\`**: Safely queries the remote repository and downloads new commits, trees, and tags into your local database without touching your working files or current branch.
* **\`git pull\`**: Shorthand for two sequential operations: \`git fetch\` followed immediately by \`git merge\` (or \`git rebase\` if \`--rebase\` is set).

### Enterprise Best Practice:
Senior engineers avoid blind \`git pull\` because it can trigger unexpected merge conflicts and break local active builds. Instead, use:
\`\`\`bash
# 1. Fetch remote data safely:
git fetch origin

# 2. Inspect incoming commits:
git log HEAD..origin/main --oneline

# 3. View exact file differences:
git diff HEAD..origin/main

# 4. Merge only when ready:
git merge origin/main
\`\`\`

---

## 6. Reset vs Revert (\`git reset\` vs \`git revert\`)

\`\`\`text
git reset --hard HEAD~1:   (Rewrites history: Commit C3 is discarded from the branch!)
Before: C1 ─── C2 ─── C3 (HEAD)
After:  C1 ─── C2 (HEAD)

git revert C2:            (Preserves history: Creates new commit C4 that reverses C2!)
Before: C1 ─── C2 ─── C3 (HEAD)
After:  C1 ─── C2 ─── C3 ─── C4 [Revert "C2"] (HEAD)
\`\`\`

| Attribute | \`git reset\` | \`git revert\` |
| :--- | :--- | :--- |
| **Mechanism** | Moves branch pointer backward in time | Creates a brand-new commit applying inverse diffs |
| **History Impact** | Rewrites history (deletes/unstages commits) | Preserves history (append-only) |
| **Safety on Public Branches**| **Dangerous**: Requires force push; breaks teammates' repos | **Safe**: Standard forward commit; zero force-push needed |
| **Flag Variations** | \`--soft\`, \`--mixed\` (default), \`--hard\` | \`--no-commit\` (\`-n\`) |

### The Three Modes of \`git reset\`:
1. **\`git reset --soft HEAD~1\`**: Moves \`HEAD\` back. Leaves changes in the **Staging Area** (ready to recommit).
2. **\`git reset --mixed HEAD~1\`** (Default): Moves \`HEAD\` back and unstages changes into the **Working Tree**.
3. **\`git reset --hard HEAD~1\`**: Moves \`HEAD\` back and wipes all changes from Staging and Working Tree!

---

## 7. Clone vs Fork

\`\`\`text
Original Author Repo (facebook/react)
                 │
                 ▼ GitHub Web UI: "Fork" (Server-to-Server Copy)
Your Cloud Account (your-username/react)
                 │
                 ▼ Local Terminal: git clone (Cloud-to-Local Download)
Your Laptop Machine (/Users/you/projects/react)
\`\`\`

* **\`git clone\`**: A native Git CLI command that copies an entire remote Git repository down to your local machine, configuring a remote named \`origin\`.
* **Fork**: A GitHub/GitLab platform feature (not a Git command) that creates a server-side independent clone of another user's repository under your own account.
* **Collaboration Flow**: Fork repo on GitHub -> Clone your fork locally -> Create feature branch -> Push to your fork (\`origin\`) -> Open Pull Request to upstream author repository.

---

## 8. \`HEAD\` and Detached HEAD

\`\`\`text
Normal State:
HEAD ──► refs/heads/main ──► Commit 4a2b1c (Latest commit)

Detached HEAD State:
HEAD ──────────────────────► Commit 1f9e8d (Historical commit hash directly!)
(Any commits made here are unanchored and will be garbage-collected!)
\`\`\`

### What is \`HEAD\`?
\`HEAD\` is an active symbolic reference file located at \`.git/HEAD\` that points to the branch or commit your working directory currently reflects.

### What is "Detached HEAD"?
Detached HEAD occurs when you check out a specific commit hash, tag, or remote branch directly (e.g. \`git checkout 1f9e8d\`) rather than a named local branch.
* If you create commits while in Detached HEAD, **no branch points to them**.
* If you switch branches, those commits become unreferenced orphans and will eventually be permanently deleted by Git's garbage collector (\`git gc\`).

### How to Safely Escape Detached HEAD:
\`\`\`bash
# Create and switch to a permanent branch anchored at your detached position:
git switch -c recovery-branch
\`\`\`

---

## 9. \`origin\` vs \`upstream\`

\`\`\`text
[Original Organization Repo] (e.g. google/guava)  ◄── upstream
              │
              ▼ (Forked on GitHub)
[Your Personal Remote Repo] (e.g. you/guava)      ◄── origin
              │
              ▼ (git clone)
[Your Local Development Laptop]
\`\`\`

* **\`origin\`**: The default remote name Git automatically assigns to the repository you cloned your local codebase from.
* **\`upstream\`**: The standard remote alias created manually to track the original parent repository from which you forked.

### Configuring and Syncing with Upstream:
\`\`\`bash
# 1. Add upstream remote:
git remote add upstream https://github.com/google/guava.git

# 2. Verify remotes:
git remote -v
# origin   https://github.com/you/guava.git (fetch & push)
# upstream https://github.com/google/guava.git (fetch & push)

# 3. Sync latest changes from upstream:
git fetch upstream
git switch main
git merge upstream/main
\`\`\`

---

## 10. Conflict Resolution

\`\`\`text
<<<<<<< HEAD (Current Branch)
string connection = Configuration["ConnectionString:Production"];
=======
string connection = Environment.GetEnvironmentVariable("DATABASE_URL");
>>>>>>> feature/env-vars (Incoming Branch)
\`\`\`

### Why Do Conflicts Occur?
Merge conflicts occur when two branches modify the **same line of code in different ways**, or when one branch deletes a file that another branch modified. Git cannot guess which change is correct and halts the merge.

### Anatomy of Conflict Markers:
* \`<<<<<<< HEAD\`: Marks the beginning of the version currently in your active branch.
* \`=======\`: The dividing separator line between conflicting versions.
* \`>>>>>>> <branch-name>\`: Marks the end of the incoming version.

### 4-Step Resolution Workflow:
\`\`\`bash
# 1. View conflicted files:
git status

# 2. Open file in VS Code or editor, choose correct logic, remove markers.

# 3. Stage the resolved files:
git add src/Program.cs

# 4. Complete the merge or rebase:
git commit -m "merge: resolve database connection conflict"
# (Or if rebasing: git rebase --continue)
\`\`\`

---

## 11. Senior Git Troubleshooting Playbook

### Scenario 1: Accidental \`git reset --hard\` with lost work
\`\`\`bash
# 1. Open reflog to see previous pointer states:
git reflog
# 2. Recover immediately:
git reset --hard HEAD@{1}
\`\`\`

### Scenario 2: Committed directly to \`main\` instead of a feature branch
\`\`\`bash
# 1. Create feature branch at current state:
git branch feature/user-profile

# 2. Reset main back 3 commits:
git reset --hard HEAD~3

# 3. Switch to feature branch:
git switch feature/user-profile
\`\`\`

### Scenario 3: Discarding uncommitted edits in a single file
\`\`\`bash
git restore src/App.tsx
\`\`\`

### Scenario 4: Untracking a file that was committed before being added to \`.gitignore\`
\`\`\`bash
# Remove from Git index while keeping local file on disk:
git rm --cached appsettings.Development.json
git commit -m "chore: stop tracking local development settings"
\`\`\`

### Scenario 5: Stuck in a messy rebase or merge
\`\`\`bash
# Abort and return working tree to pristine state:
git merge --abort
git rebase --abort
git cherry-pick --abort
\`\`\`
`,
    contentBn: `# ২০. গিট ইন্টারভিউ প্রশ্নাবলি: কোর কনসেপ্ট ও ভাইভা সিনারিও

\`\`\`text
20. Git Interview Questions
    ├── Git vs GitHub
    ├── Git vs SVN
    ├── Working Tree vs Staging Area
    ├── Merge vs Rebase
    ├── Pull vs Fetch
    ├── Reset vs Revert
    ├── Clone vs Fork
    ├── HEAD
    ├── origin vs upstream
    ├── Conflict Resolution
    └── Git Troubleshooting
\`\`\`

বাংলাদেশের শীর্ষস্থানীয় সফটওয়্যার কোম্পানিগুলোতে (Brain Station 23, Enosis Solutions, Therap, Samsung R&D, BJIT, Optimizely, Kaz Software) টেকনিক্যাল ভাইভা, রিটেন পরীক্ষা এবং পেয়ার প্রোগ্রামিং রাউন্ডে গিট সংক্রান্ত সবচেয়ে বহুল জিজ্ঞাসিত ১১টি কোর প্রশ্ন ও ব্যবহারিক সিনারিও সমাধান নিচে বিশদভাবে তুলে ধরা হলো।

---

## ১. Git বনাম GitHub

\`\`\`text
┌──────────────────────────────────────┐       ┌──────────────────────────────────────┐
│                 Git                  │       │                GitHub                │
├──────────────────────────────────────┤       ├──────────────────────────────────────┤
│ • লোকাল কমান্ড-লাইন সফটওয়্যার টুল    │       │ • ক্লাউড ওয়েব হোস্টিং সার্ভিস       │
│ • পিসিতে ১০০% অফলাইনে কাজ করে         │       │ • ইন্টারনেট কানেকশন আবশ্যক           │
│ • ডিস্ট্রিবিউটেড ভার্সন কন্ট্রোল     │       │ • মাইক্রোসফটের মালিকানাধীন           │
│ • কোডের স্ন্যাপশট ও হিস্ট্রি সংরক্ষণ │       │ • PR, Actions CI, Issues যুক্ত করে   │
│ • বিকল্প: Mercurial, SVN             │       │ • বিকল্প: GitLab, Bitbucket          │
└──────────────────────────────────────┘       └──────────────────────────────────────┘
\`\`\`

### ইন্টারভিউ উত্তর:
* **Git (গিট):** হলো আপনার কম্পিউটারে ইনস্টল থাকা একটি ডিস্ট্রিবিউটেড ভার্সন কন্ট্রোল সফটওয়্যার টুল। এটি অফলাইনে আপনার প্রজেক্টের ফাইলের পরিবর্তন, ব্রাঞ্চ এবং কমিট হিস্ট্রি লোকাল ডেটাবেজে সংরক্ষণ করে।
* **GitHub (গিটহাব):** হলো একটি ক্লাউড ওয়েব প্ল্যাটফর্ম যা গিট রিপোজিটরি অনলাইনে হোস্ট করে। গিট রিপোজিটরির উপর ভিত্তি করে এটি কোড রিভিউ (Pull Request), অটোমেশন (GitHub Actions CI/CD), এবং ইস্যু ট্র্যাকিংয়ের মতো টিম কোলাবোরেশন সুবিধা দেয়।

---

## ২. Git বনাম SVN (সেন্ট্রালাইজড বনাম ডিস্ট্রিবিউটেড)

\`\`\`text
সেন্ট্রালাইজড (SVN):                    ডিস্ট্রিবিউটেড (Git):
[সেন্ট্রাল SVN সার্ভার]                [ডেভেলপার ১] ◄──────► [ডেভেলপার ২]
   ▲         ▲                              ▲                       ▲
   │         │                              │                       │
   ▼         ▼                              ▼                       ▼
[ডেভ ১]   [ডেভ ২]                        [সেন্ট্রাল গিটহাব রিমোট]
(ইন্টারনেট না থাকলে কমিট বন্ধ!)     (প্রতিটি ডেভেলপারের পিসিতে সম্পূর্ণ ডেটাবেজ ক্লোন!)
\`\`\`

| বৈশিষ্ট্য | গিট (Distributed VCS) | এসভিএন (Centralized SVN) |
| :--- | :--- | :--- |
| **আর্কিটেকচার** | ডিস্ট্রিবিউটেড: প্রতিটি ডেভেলপারের মেশিনে সম্পূর্ণ হিস্ট্রি থাকে | সেন্ট্রালাইজড: একক সার্ভারে হিস্ট্রি থাকে, ক্লায়েন্টে শুধু ১টি ভার্সন থাকে |
| **অফলাইন কাজ** | ১০০% অফলাইনে ব্রাঞ্চ তৈরি, কমিট ও হিস্ট্রি দেখা যায় | সার্ভার সংযোগ না থাকলে কমিট করা বা লগ দেখা সম্পূর্ণ অসম্ভব |
| **ব্রাঞ্চিং স্পিড** | কয়েক মিলিসেকেন্ড ($O(1)$) পয়েন্টার তৈরি | সার্ভারে ডিরেক্টরি কপি করতে হয়, অত্যন্ত ধীরগতির |
| **ঝুঁকি (SPOF)** | সার্ভার নষ্ট হলেও যেকোনো ডেভেলপারের পিসি থেকে সম্পূর্ণ রিপো ফেরত আনা যায় | সেন্ট্রাল সার্ভার নষ্ট হলে সম্পূর্ণ ব্যাকআপ হিস্ট্রি ধ্বংস |

---

## ৩. Working Tree বনাম Staging Area (Index) বনাম Local Repository

\`\`\`text
┌──────────────────┐    git add      ┌──────────────────┐   git commit    ┌──────────────────┐
│   Working Tree   │ ──────────────► │   Staging Area   │ ──────────────► │ Local Repository │
│ (লোকাল ফাইল ডিরেক্টরি)│             │  (.git/index)    │                 │  (.git/objects)  │
└──────────────────┘ ◄────────────── └──────────────────┘                 └──────────────────┘
                       git restore        (বাইনারি ক্যাশ)                   (স্থায়ী অবজেক্ট)
\`\`\`

### গিটের ৩টি স্তরের ব্যাখ্যা:
1. **Working Tree (ওয়ার্কিং ডিরেক্টরি):** আপনার কম্পিউটারের সাধারণ ফোল্ডার যেখানে আপনি কোড লেখেন ও এডিট করেন।
2. **Staging Area (ইনডেক্স):** এটি \`.git/index\` ফাইলে অবস্থিত একটি বাইনারি ক্যাশ। পরবর্তী কমিটে ঠিক কোন কোন ফাইলের কোন কোন লাইন যুক্ত হবে তার প্রস্তুতিমূলক মঞ্চ।
3. **Local Repository (লোকাল রিপোজিটরি):** \`.git/objects/\` ফোল্ডারের স্থায়ী ডাটাবেজ যেখানে একবার কমিট হলে তা অবজেক্ট হিসেবে স্থায়ীভাবে সেভ হয়ে যায়।

### স্টেজিং এরিয়ার সুবিধা:
আপনি ১০টি ফাইল এডিট করলেও স্টেজিং এরিয়া থাকার কারণে বেছে বেছে শুধুমাত্র ১টি দরকারি ফাইল (\`git add src/User.cs\`) অথবা নির্দিষ্ট কিছু লাইন (\`git add -p\`) আলাদা করে পরিচ্ছন্ন অ্যাটমিক কমিট বানাতে পারেন।

---

## ৪. Merge বনাম Rebase

\`\`\`text
Merge (প্রকৃত ইতিহাস সংরক্ষিত রাখে):
main:    M1 ─── M2 ─────────────── M3 (Merge Commit: ২টি প্যারেন্ট পয়েন্টার)
                 └─── F1 ─── F2 ───┘ (ফিচার ব্রাঞ্চ)

Rebase (সম্পূর্ণ লিনিয়ার সাজানো ইতিহাস):
main:    M1 ─── M2 ─── F1' ─── F2' (লিনিয়ার: কমিটগুলো পুনরায় নতুন হ্যাশে তৈরি হয়!)
\`\`\`

| মাত্রা | \`git merge\` | \`git rebase\` |
| :--- | :--- | :--- |
| **গ্রাফের গঠন** | নন-লিনিয়ার: ৩-ওয়ে মার্জ কমিটের মাধ্যমে শাখা জোড়া লাগায় | লিনিয়ার: সোজা সরলরেখায় একটির পর একটি কমিট বসে |
| **ইতিহাসের সত্যতা** | কে কখন কোন সময়ে ব্রাঞ্চ করেছে তা অবিকল ধরে রাখে | ইতিহাস রি-রাইট করে নতুন কমিট হ্যাশ তৈরি করে |
| **ট্রেসেবিলিটি** | কখন ফিচার মার্জ হয়েছে সহজে বোঝা যায় | \`git log\` অত্যন্ত পরিচ্ছন্ন থাকে, বাইসেক্ট সহজ হয় |
| **পাবলিক ব্রাঞ্চ নিরাপত্তা** | পাবলিক ব্রাঞ্চে সম্পূর্ণ নিরাপদ | **পাবলিক ব্রাঞ্চে সম্পূর্ণ নিষিদ্ধ!** শুধু লোকাল ব্রাঞ্চে প্রযোজ্য |

---

## ৫. Pull বনাম Fetch (\`git pull\` বনাম \`git fetch\`)

\`\`\`text
                          git fetch origin
[রিমোট গিটহাব রিপো] ──────────────────────────► [রিমোট ট্র্যাকিং রেফারেন্স: origin/main]
                                                               │
                                                               ▼ git merge
                                                    [লোকাল ওয়ার্কিং ডিরেক্টরি]
                    ◄──────────────────────────────────────────┘
                                 git pull origin main
                             (এক কমান্ডে Fetch + Merge সম্পন্ন!)
\`\`\`

* **\`git fetch\`**: শুধুমাত্র রিমোট থেকে নতুন সমস্ত কমিট ও অবজেক্ট লোকাল মেমোরিতে ডাউনলোড করে এনে রাখে। আপনার লোকাল ফাইল বা ব্রাঞ্চে বিন্দুমাত্র হাত দেয় না।
* **\`git pull\`**: একসাথে দুটি কাজ করে — প্রথমে \`git fetch\` চালায় এবং সাথে সাথেই বর্তমান ব্রাঞ্চের সাথে স্বয়ংক্রিয়ভাবে মার্জ (\`git merge\`) ঘটিয়ে ফাইল পরিবর্তন করে।

### সিনিয়র ইঞ্জিনিয়ারদের প্র্যাকটিস:
না দেখে সরাসরি \`git pull\` চালালে অনাকাঙ্ক্ষিত কনফ্লিক্ট তৈরি হতে পারে। তাই নিরাপদ পদ্ধতি হলো:
\`\`\`bash
git fetch origin
git log HEAD..origin/main --oneline  # সহকর্মীদের নতুন কোড রিভিউ করুন
git diff HEAD..origin/main          # লাইনের পার্থক্য দেখুন
git merge origin/main               # নিশ্চিত হয়ে মার্জ করুন
\`\`\`

---

## ৬. Reset বনাম Revert (\`git reset\` বনাম \`git revert\`)

\`\`\`text
git reset --hard HEAD~1:   (ইতিহাস মুছে ফেলে: C3 কমিট অস্তিত্বহীন হয়ে যায়!)
আগে: C1 ─── C2 ─── C3 (HEAD)
পরে: C1 ─── C2 (HEAD)

git revert C2:            (ইতিহাস অক্ষত রাখে: C2 এর উল্টো পরিবর্তন দিয়ে নতুন C4 তৈরি হয়!)
আগে: C1 ─── C2 ─── C3 (HEAD)
পরে: C1 ─── C2 ─── C3 ─── C4 [Revert "C2"] (HEAD)
\`\`\`

| তুলনামূলক দিক | \`git reset\` | \`git revert\` |
| :--- | :--- | :--- |
| **কাজের ধরন** | ব্রাঞ্চ পয়েন্টারকে অতীতে সরিয়ে নেয় | নতুন ইনভার্স কমিট তৈরি করে পরিবর্তন বাতিল করে |
| **ইতিহাসের উপর প্রভাব** | ইতিহাস রি-রাইট করে কমিট মুছে ফেলে | ইতিহাস সম্পূর্ণ অক্ষত রাখে (ফরওয়ার্ড কমিট) |
| **পাবলিক ব্রাঞ্চে ব্যবহার**| **মারাত্মক ঝুঁকিপূর্ণ**: ফোর্স পুশ লাগে, টিমমেটদের কোড ভাঙে | **সম্পূর্ণ নিরাপদ**: সাধারণ পুশের মাধ্যমে রিমোটে পাঠানো যায় |

### \`git reset\`-এর ৩টি মোড:
1. **\`--soft\`**: কমিট আনডু করে পরিবর্তনগুলো **স্টেজিং এরিয়ায়** রেখে দেয়।
2. **\`--mixed\`** (ডিফল্ট): কমিট আনডু করে ফাইলগুলোকে **আন-স্টেজড ওয়ার্কিং ট্রিতে** রেখে দেয়।
3. **\`--hard\`**: কমিটসহ সমস্ত ফাইল পরিবর্তন চিরতরে মুছে ফেলে!

---

## ৭. Clone বনাম Fork

* **\`git clone\`**: এটি একটি অফিশিয়াল গিট কমান্ড যা রিমোটের সম্পূর্ণ রিপোজিটরি আপনার লোকাল কম্পিউটারে ডাউনলোড করে।
* **Fork**: এটি কোনো গিট কমান্ড নয়, বরং GitHub/GitLab প্ল্যাটফর্মের একটি ওয়েব ফিচার যা অন্য কারও পাবলিক রিপোজিটরি হুবহু কপি করে আপনার নিজের গিটহাব অ্যাকাউন্টে হোস্ট করে দেয়।
* **ওপেন সোর্স কাজের ধারা:** অন্যের রিপো Fork করুন -> নিজের ফর্ক পিসিতে Clone করুন -> ফিচার ব্রাঞ্চে কাজ করুন -> নিজের ফর্কে Push করুন -> মূল প্রজেক্টে Pull Request পাঠান।

---

## ৮. \`HEAD\` এবং Detached HEAD

\`\`\`text
স্বাভাবিক অবস্থা:
HEAD ──► refs/heads/main ──► Commit 4a2b1c (লেটেস্ট কমিট)

Detached HEAD অবস্থা:
HEAD ──────────────────────► Commit 1f9e8d (সরাসরি অতীত কমিট হ্যাশকে পয়েন্ট করছে!)
(এ অবস্থায় নতুন কমিট করলে তা কোনো ব্রাঞ্চে সেভ হবে না এবং হারিয়ে যাবে!)
\`\`\`

### Detached HEAD থেকে বাঁচার উপায়:
যদি কখনো Detached HEAD অবস্থায় কমিট করে ফেলেন, ভয় নেই! সাথে সাথে একটি নতুন ব্রাঞ্চ বানিয়ে সেই পয়েন্টারটিকে সুরক্ষিত করুন:
\`\`\`bash
git switch -c recovery-branch
\`\`\`

---

## ৯. \`origin\` বনাম \`upstream\`

* **\`origin\`**: আপনি যে রিমোট রিপোজিটরি থেকে সরাসরি আপনার কম্পিউটারে ক্লোন করেছেন, তার ডিফল্ট রিমোট নাম হলো \`origin\`।
* **\`upstream\`**: ফর্ক করা প্রজেক্টে মূল মালিকের অরিজিনাল রিপোজিটরিকে ট্র্যাক করার জন্য প্রচলিত রিমোটের নাম হলো \`upstream\`।

\`\`\`bash
# ১. আপস্ট্রিম রিমোট যুক্ত করা
git remote add upstream https://github.com/original-owner/repo.git

# ২. আপস্ট্রিম থেকে লেটেস্ট কোড সিঙ্ক করা
git fetch upstream
git merge upstream/main
\`\`\`

---

## ১০. Conflict Resolution (মার্জ কনফ্লিক্ট সমাধান)

\`\`\`text
<<<<<<< HEAD (আপনার বর্তমান ব্রাঞ্চের কোড)
string dbHost = "production-db.internal";
=======
string dbHost = Environment.GetEnvironmentVariable("DB_HOST");
>>>>>>> feature/env-config (মার্জ হয়ে আসা নতুন ব্রাঞ্চের কোড)
\`\`\`

### কেন কনফ্লিক্ট হয়?
যখন দুইজন ডেভেলপার একই ফাইলের একই লাইন দুইভাবে পরিবর্তন করেন, তখন Git বুঝতে পারে না কোন কোডটি সঠিক। তাই Git মার্জ থামিয়ে কনফ্লিক্ট মার্কার বসিয়ে ডেভেলপারকে সিদ্ধান্ত নিতে বলে।

### সমাধানের ৪টি ধাপ:
1. কনফ্লিক্ট হওয়া ফাইলটি এডিটরে ওপেন করে সঠিক কোডটি রাখুন এবং \`<<<<<<<\`, \`=======\`, \`>>>>>>>\` মার্কারগুলো মুছে ফেলুন।
2. সমাধান করা ফাইলটি স্টেজ করুন: \`git add <file>\`
3. মার্জ বা রিবেস এগিয়ে নিন: \`git commit\` অথবা \`git rebase --continue\`

---

## ১১. Git Troubleshooting (ভাইভা সিনারিও প্লেবুক)

### সিনারিও ১: ভুল করে \`git reset --hard\` চালিয়ে আন-পুশড কাজ মুছে ফেললে কী করবেন?
\`\`\`bash
git reflog
git reset --hard HEAD@{1}
\`\`\`

### সিনারিও ২: ফিচার ব্রাঞ্চে কাজ না করে ভুল করে \`main\` ব্রাঞ্চে ৫টি কমিট করে ফেলেছেন:
\`\`\`bash
git branch feature/my-feature  # ৫টি কমিট সহ নতুন ব্রাঞ্চ তৈরি হলো
git reset --hard HEAD~5        # মেইন ব্রাঞ্চ ৫ কমিট পেছনে ফিরে পরিষ্কার হলো
git switch feature/my-feature # ফিচার ব্রাঞ্চে কাজ শুরু করুন
\`\`\`

### সিনারিও ৩: নির্দিষ্ট একটি ফাইলের আন-কমিটেড ভুল এডিট ফেলে দিতে:
\`\`\`bash
git restore src/Services/PaymentService.cs
\`\`\`

### সিনারিও ৪: ভুলবশত পাসওয়ার্ড ফাইল কমিট হয়েছে, এখন লোকাল রেখে গিট ট্র্যাকিং বন্ধ করতে:
\`\`\`bash
git rm --cached .env
git commit -m "chore: untrack .env file"
\`\`\`

### সিনারিও ৫: জটিল রিবেস বা মার্জের মাঝে আটকে গেলে নিরাপদভাবে শুরুতে ফিরতে:
\`\`\`bash
git merge --abort
git rebase --abort
\`\`\`
`,
  };
