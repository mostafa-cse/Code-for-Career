import type { LocalLesson } from "@/lib/lessons-data";

export const MODULE_1_LESSONS: LocalLesson[] = [
  {
    slug: "git-fundamentals",
    titleEn: "Git Fundamentals: Version Control, Architecture & Workflow",
    titleBn: "গিট ফান্ডামেন্টালস: ভার্সন কন্ট্রোল, আর্কিটেকচার ও ওয়ার্কফ্লো",
    categoryEn: "1. Git Fundamentals & Setup",
    categoryBn: "১. গিট ফান্ডামেন্টালস ও সেটআপ",
    categoryDescEn: "What is Git, Centralized vs Distributed VCS, Git vs GitHub, installation, configuration, and fundamental workflow.",
    categoryDescBn: "গিট কী, সেন্ট্রালাইজড বনাম ডিস্ট্রিবিউটেড ভার্সন কন্ট্রোল, গিট বনাম গিটহাব, ইন্সটলেশন, কনফিগারেশন এবং বেসিক ওয়ার্কফ্লো।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the foundational concepts of version control, distributed architecture, Git configuration, and the essential 3-tier workflow.",
    descriptionBn: "ভার্সন কন্ট্রোলের মূল ধারণা, ডিস্ট্রিবিউটেড আর্কিটেকচার, গিট কনফিগারেশন এবং প্রয়োজনীয় ৩-স্তরের ওয়ার্কফ্লো আয়ত্ত করুন।",
    difficulty: "EASY",
    displayOrder: 1,
    prerequisites: [],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Getting Started — About Version Control",
        url: "https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control",
        description: "Official guide covering version control systems and Git architecture.",
        isStarred: true,
      },
      {
        source: "GitHub Docs",
        title: "Git and GitHub Learning Resources",
        url: "https://docs.github.com/en/get-started",
        description: "Official GitHub guide on installation, SSH, and workflow basics.",
        isStarred: false,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "Explain the difference between Git and GitHub with architectural diagrams",
        url: null,
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Git", "GitHub", "VCS", "Architecture"],
        solutionEn: "Git is a local, distributed command-line version control software that records file history on your machine. GitHub is a cloud-based hosting platform built on top of Git that provides remote backups, code reviews, PRs, CI/CD Actions, and collaboration features.",
        solutionBn: "গিট হলো একটি লোকাল, ডিস্ট্রিবিউটেড কমান্ড-লাইন সফটওয়্যার যা মেশিনে প্রজেক্টের কোড ও ইতিহাস সংরক্ষণ করে। আর গিটহাব হলো ইন্টারনেটে হোস্ট করা একটি ক্লাউড প্ল্যাটফর্ম যা গিটের উপর ভিত্তি করে রিমোট ব্যাকআপ, টিম কোলাবোরেশন, পুল রিকোয়েস্ট ও CI/CD অটোমেশন প্রদান করে।",
      },
      {
        source: "BD Tech Viva",
        name: "Why is Git called a Distributed Version Control System (DVCS) unlike SVN?",
        url: null,
        difficulty: "MEDIUM",
        company: "Brain Station 23",
        tags: ["Git", "SVN", "DVCS", "Centralized"],
        solutionEn: "In centralized VCS like SVN, there is only one central server holding the full history. If the server is offline or fails, developers cannot commit or review history. In Git (DVCS), every single clone contains the entire project history and object database locally, allowing fully offline commits, branching, and diffing.",
        solutionBn: "SVN এর মতো সেন্ট্রালাইজড সিস্টেমে শুধুমাত্র কেন্দ্রীয় সার্ভারেই পুরো হিস্ট্রি থাকে, সার্ভার ডাউন থাকলে কাজ করা যায় না। কিন্তু গিট একটি ডিস্ট্রিবিউটেড সিস্টেম—এখানে প্রতিটি ক্লোন করা কম্পিউটারে পুরো প্রজেক্টের পূর্ণাঙ্গ ডেটাবেজ ও হিস্ট্রি থাকে, ফলে ইন্টারনেট ছাড়াই অফলাইনে সমস্ত ব্রাঞ্চিং ও কমিট করা যায়।",
      },
    ],
    contentEn: `# Git Fundamentals: Version Control, Architecture & Workflow

Git is a **Distributed Version Control System (DVCS)** created by Linus Torvalds in 2005. It is the de-facto foundation of professional software engineering worldwide.

---

## 1. What is Version Control?

A **Version Control System (VCS)** is a tool that records changes to files over time so you can recall specific versions later, compare differences, and collaborate without overwriting teammates' work.

### Centralized vs Distributed Version Control

| Dimension | Centralized VCS (e.g., Subversion / SVN) | Distributed VCS (e.g., Git) |
| :--- | :--- | :--- |
| **History Storage** | Only on a single central server | Complete copy on **every** developer's machine |
| **Offline Work** | Impossible (cannot commit without server) | Full offline capability (commits, logs, diffs, branches) |
| **Branching Speed** | Slow & costly server operation | Microsecond pointer creation (O(1)) |
| **Failure Risk** | Single Point of Failure (SPOF) | Extremely fault-tolerant (every clone is a full backup) |

---

## 2. Git vs GitHub: The Crucial Difference

* **Git**: The **engine / tool**. An open-source command-line software installed on your local computer. It operates entirely offline without an internet connection.
* **GitHub**: The **cloud platform / hosting service**. Owned by Microsoft, it hosts Git repositories remotely, providing web-based code reviews (Pull Requests), issues, discussions, CI/CD runners (GitHub Actions), and access controls.

\`\`\`
+-----------------------+                    +-----------------------+
| Local Computer        |   git push         | Remote Cloud (GitHub) |
| [Git Engine & .git]   | =================> | [Hosted Bare Repo]    |
| - Working Directory   |                    | - Pull Requests       |
| - Staging Area (Index)|   git pull / fetch | - Automated CI/CD     |
| - Local Commits       | <================= | - Code Reviews        |
+-----------------------+                    +-----------------------+
\`\`\`

---

## 3. Git Installation & Global Configuration

### Installation
* **macOS**: \`brew install git\` (or via Xcode Command Line Tools: \`xcode-select --install\`)
* **Linux (Ubuntu/Debian)**: \`sudo apt update && sudo apt install git -y\`
* **Windows**: Download official installer from [git-scm.com](https://git-scm.com) (includes Git Bash)

### First-Time Configuration
Before making your first commit, configure your identity and default preferences:

\`\`\`bash
# Set your professional name and email (must match your GitHub email)
git config --global user.name "Mostafa Kamal"
git config --global user.email "mostafa@example.com"

# Set default primary branch name to 'main'
git config --global init.defaultBranch main

# Configure line ending handling:
# - Windows: convert CRLF on commit, checkout LF
git config --global core.autocrlf true
# - macOS / Linux: input LF only
git config --global core.autocrlf input

# View all active configurations
git config --list --show-origin
\`\`\`

---

## 4. The Core Git Workflow

Every Git workflow cycles through 3 primary tiers:

1. **Working Directory**: Where you write, edit, and delete actual code files.
2. **Staging Area (Index)**: The snapshot preparation table where changes are staged via \`git add\`.
3. **Local Repository (\`.git\` database)**: The permanent history store where snapshots are committed via \`git commit\`.
4. **Remote Repository**: The central synchronization point on GitHub via \`git push\` and \`git pull\`.
`,
    contentBn: `# গিট ফান্ডামেন্টালস: ভার্সন কন্ট্রোল, আর্কিটেকচার ও ওয়ার্কফ্লো

গিট (Git) হলো একটি **ডিস্ট্রিবিউটেড ভার্সন কন্ট্রোল সিস্টেম (DVCS)** যা ২০০৫ সালে লিনাক্সের জনক লিনাস টরভাল্ডস তৈরি করেছিলেন। বর্তমান সফটওয়্যার ইঞ্জিনিয়ারিং দুনিয়ায় প্রতিটি প্রফেশনাল ডেভেলপারের জন্য গিট শেখা অপরিহার্য।

---

## ১. ভার্সন কন্ট্রোল কী?

**ভার্সন কন্ট্রোল সিস্টেম (VCS)** হলো এমন একটি সফটওয়্যার যা সময়ের সাথে সাথে কোনো প্রজেক্টের ফাইলের পরিবর্তনগুলো রেকর্ড করে রাখে। এর ফলে প্রয়োজনে পূর্বের যেকোনো সংস্করণে ফিরে যাওয়া যায়, কে কোন লাইনে কী পরিবর্তন করেছে তা দেখা যায় এবং একাধিক ডেভেলপার একসাথে কাজ করতে পারে।

### সেন্ট্রালাইজড বনাম ডিস্ট্রিবিউটেড ভার্সন কন্ট্রোল

| বৈশিষ্ট্য | সেন্ট্রালাইজড VCS (যেমন SVN) | ডিস্ট্রিবিউটেড VCS (যেমন Git) |
| :--- | :--- | :--- |
| **হিস্ট্রি সংরক্ষণ** | শুধুমাত্র একটি মূল সেন্ট্রাল সার্ভারে | প্রতিটি ডেভেলপারের কম্পিউটারে সম্পূর্ণ হিস্ট্রি |
| **অফলাইন কাজ** | সম্ভব নয় (সার্ভার ছাড়া কমিট হয় না) | শতভাগ অফলাইনে কাজ করা যায় |
| **ব্রাঞ্চিং স্পিড** | তুলনামূলক ধীরগতির | মিলি-সেকেন্ডে ব্রাঞ্চ তৈরি হয় (O(1)) |
| **সার্ভার ব্যাকআপ** | সার্ভার ক্র্যাশ করলে ডেটা হারানোর ঝুঁকি | প্রতিটি ক্লোনই একটি পূর্ণাঙ্গ ব্যাকআপ |

---

## ২. গিট বনাম গিটহাব (Git vs GitHub)

* **গিট (Git)**: এটি হলো মূল **কমান্ড-লাইন টুল বা ইঞ্জিন** যা আপনার কম্পিউটারে ইনস্টল থাকে। এটি লোকালি ফাইলের স্ন্যাপশট ট্র্যাক করে এবং কাজ করার জন্য ইন্টারনেটের কোনো প্রয়োজন হয় না।
* **গিটহাব (GitHub)**: এটি একটি **ক্লাউড প্ল্যাটফর্ম ও হোস্টিং সার্ভিস** (মাইক্রোসফটের মালিকানাধীন)। এটি ইন্টারনেটে আপনার গিট রিপোজিটরি ব্যাকআপ রাখে, কোড রিভিউ (Pull Request), ইস্যু ট্র্যাকিং এবং টিম কোলাবোরেশনের সুবিধা দেয়।

---

## ৩. গিট ইনস্টলেশন ও কনফিগারেশন

### প্রাথমিক সেটআপ কমান্ড
প্রথমবার গিট ব্যবহারের পূর্বে নাম ও ইমেইল সেট করা বাধ্যতামূলক:

\`\`\`bash
# আপনার নাম ও ইমেইল সেট করুন (GitHub এর ইমেইলের সাথে মিল রাখুন)
git config --global user.name "Mostafa Kamal"
git config --global user.email "mostafa@example.com"

# ডিফল্ট ব্রাঞ্চের নাম 'main' নির্ধারণ করুন
git config --global init.defaultBranch main

# লাইন ইন্ডিং হ্যান্ডলিং (Windows এর জন্য true, Mac/Linux এর জন্য input)
git config --global core.autocrlf input

# কনফিগারেশন ভেরিফাই করুন
git config --list
\`\`\`
`,
  },
  {
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
    contentEn: `# Repository Basics: Init, Clone, Status, Add, Commit, Log & Diff

These seven commands form the bedrock of daily software engineering with Git.

---

## 1. Creating or Cloning a Repository

### Starting from Scratch: \`git init\`
Transforms the current directory into a tracked Git repository by initializing a hidden \`.git\` folder:
\`\`\`bash
mkdir code-for-career-api
cd code-for-career-api
git init
# Output: Initialized empty Git repository in /Users/dev/code-for-career-api/.git/
\`\`\`

### Copying an Existing Remote Project: \`git clone\`
Downloads a full remote repository, its complete commit history, and branches:
\`\`\`bash
git clone https://github.com/username/project-repo.git
# Or using SSH (recommended):
git clone git@github.com:username/project-repo.git
\`\`\`

---

## 2. Inspecting the Workspace: \`git status\`
\`git status\` is the single most frequently typed command. It shows:
* Which branch you are currently on
* Untracked files (new files Git hasn't tracked yet)
* Changes not staged for commit (modified files)
* Changes staged for commit (ready to be committed)

\`\`\`bash
git status
# Use short format for concise terminal view:
git status -s
# M  Program.cs   (Staged for commit)
#  M README.md    (Modified in working directory, not staged)
# ?? .env.example (Untracked)
\`\`\`

---

## 3. Staging Changes: \`git add\`
Moves changes from the Working Directory into the Staging Area (the Index):
\`\`\`bash
# Stage a specific file
git add src/Services/AuthService.cs

# Stage all changes in current folder & subdirectories
git add .

# Interactive patch mode (stage specific hunks/lines of code)
git add -p
\`\`\`

---

## 4. Saving Snapshots: \`git commit\`
Packages all staged changes into an immutable commit object:
\`\`\`bash
# Commit with an inline message
git commit -m "feat(auth): implement jwt token generation logic"

# Stage all tracked modified files AND commit in one command
git commit -am "fix(auth): adjust token expiration time to 60 minutes"
\`\`\`

---

## 5. Reviewing History: \`git log\`
\`\`\`bash
# Standard detailed commit log
git log

# Professional condensed single-line graph view
git log --oneline --graph --decorate -n 10

# Show summary of files modified per commit
git log --stat
\`\`\`

---

## 6. Examining Changes: \`git diff\`
\`\`\`bash
# Compare working tree vs staging area (unstaged modifications)
git diff

# Compare staging area vs last commit (what will be committed)
git diff --staged

# Compare a specific file
git diff src/Models/User.cs
\`\`\`
`,
    contentBn: `# রিপোজিটরি বেসিকস: ইনিট, ক্লোন, স্ট্যাটাস, অ্যাড, কমিট, লগ ও ডিফারেন্স

প্রতিদিনের সফটওয়্যার ডেভেলপমেন্টে এই ৭টি কমান্ড সবচেয়ে বেশি ব্যবহৃত হয়।

---

## ১. নতুন রিপোজিটরি শুরু করা ও ক্লোন করা

### \`git init\`
যেকোনো সাধারণ ডিরেক্টরিতে গিয়ে \`git init\` চালালে সেখানে একটি হিডেন \`.git\` ফোল্ডার তৈরি হয় এবং ডিরেক্টরিটি গিট রিপোজিটরিতে পরিণত হয়:
\`\`\`bash
mkdir my-backend-project
cd my-backend-project
git init
\`\`\`

### \`git clone\`
গিটহাব বা রিমোট সার্ভার থেকে কোনো প্রজেক্টের পুরো কোড এবং তার সমস্ত হিস্ট্রি নিজের মেশিনে ডাউনলোড করতে:
\`\`\`bash
git clone git@github.com:username/repository.git
\`\`\`

---

## ২. স্ট্যাটাস দেখা: \`git status\`
কোন ফাইলে পরিবর্তন হয়েছে, কোনটি স্টেজিং এরিয়ায় আছে আর কোনটি আনট্র্যাকড—সবকিছু \`git status\` দিয়ে যাচাই করা যায়:
\`\`\`bash
git status
# সংক্ষিপ্ত আউটপুটের জন্য:
git status -s
\`\`\`

---

## ৩. স্টেজিং করা: \`git add\`
ফাইলকে কমিটের জন্য প্রস্তুত করতে স্টেজিং এরিয়ায় পাঠানো:
\`\`\`bash
# নির্দিষ্ট ফাইল স্টেজ করা
git add Program.cs

# সমস্ত পরিবর্তিত ফাইল একসাথে স্টেজ করা
git add .
\`\`\`

---

## ৪. স্ন্যাপশট সংরক্ষণ: \`git commit\`
স্টেজিং এরিয়ার পরিবর্তনগুলো একটি স্থায়ী কমিট অবজেক্ট হিসেবে সেভ করা:
\`\`\`bash
git commit -m "feat: user authentication endpoint implemented"
\`\`\`

---

## ৫. ইতিহাস দেখা: \`git log\`
\`\`\`bash
# সুন্দর এক লাইনে গ্রাফসহ হিস্ট্রি দেখার প্রো-কমান্ড:
git log --oneline --graph --decorate -n 10
\`\`\`

---

## ৬. পার্থক্য বিশ্লেষণ: \`git diff\`
\`\`\`bash
# আনস্টেজড কোড পরিবর্তন দেখতে:
git diff

# পরবর্তী কমিটে কী কী যাচ্ছে (স্টেজড কোড) তা দেখতে:
git diff --staged
\`\`\`
`,
  },
  {
    slug: "git-working-with-changes",
    titleEn: "Working with Changes: Working Directory, Staging, Restore, Reset & Clean",
    titleBn: "পরিবর্তন নিয়ন্ত্রণ: ওয়ার্কিং ডিরেক্টরি, স্টেজিং, রিস্টোর, রিসেট ও ক্লিন",
    categoryEn: "3. Working with Changes",
    categoryBn: "৩. কোড পরিবর্তন নিয়ন্ত্রণ ও আনডু কৌশল",
    categoryDescEn: "Managing untracked vs modified vs staged files, and discarding changes with restore, reset, and clean.",
    categoryDescBn: "আনট্র্যাকড, মডিফাইড ও স্টেজড ফাইল পরিচালনা এবং ভুল পরিবর্তন মোছার জন্য restore, reset ও clean এর ব্যবহার।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master file lifecycle states and safely discard or unstage changes using git restore, git reset, and git clean.",
    descriptionBn: "ফাইলের লাইফসাইকেল স্টেট নিয়ন্ত্রণ করুন এবং git restore, reset ও clean ব্যবহার করে ভুল পরিবর্তন নিরাপদে বাতিল করুন।",
    difficulty: "EASY",
    displayOrder: 3,
    prerequisites: ["git-repository-basics"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Undoing Things with git restore",
        url: "https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things",
        description: "Official guide on unstaging files and discarding uncommitted modifications.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "How do you discard changes in a modified file vs remove completely untracked files?",
        url: null,
        difficulty: "MEDIUM",
        company: "Kaz Software",
        tags: ["Git", "git restore", "git clean", "Undo"],
        solutionEn: "To discard unstaged modifications in tracked files, use 'git restore <filename>' (or 'git checkout -- <filename>' in older Git). To remove untracked files and directories that Git has never tracked, use 'git clean -fd' (use 'git clean -n' first to dry-run safely).",
        solutionBn: "ট্র্যাক করা ফাইলের আনস্টেজড পরিবর্তন বাতিল করতে 'git restore <file>' ব্যবহার করা হয়। আর নতুন তৈরি করা আনট্র্যাকড ফাইল ও ডিরেক্টরি সম্পূর্ণ মুছে ফেলতে 'git clean -fd' ব্যবহার করা হয় (নিরাপত্তার জন্য আগে 'git clean -n' দিয়ে প্রিভিউ দেখে নেওয়া ভালো)।",
      },
    ],
    contentEn: `# Working with Changes: Working Directory, Staging, Restore, Reset & Clean

A developer's productivity depends on knowing how to inspect, manipulate, and safely undo changes in their workspace.

---

## 1. The 3 File States in Git

\`\`\`
Untracked -----> Modified (Working Tree) -----> Staged (Index) -----> Committed (HEAD)
               [edit file]                [git add]             [git commit]
\`\`\`

1. **Untracked**: Files created in your folder that Git does not track yet (listed under \`??\` in \`git status -s\`).
2. **Modified**: Files already tracked by Git that have edits in your working tree not yet staged.
3. **Staged**: Files whose modifications have been registered into the index via \`git add\`.

---

## 2. Unstaging Files: \`git restore --staged\`

If you accidentally ran \`git add .\` and staged a file you didn't want to commit yet:

\`\`\`bash
# Unstage a single file (keeps your local file edits intact in working directory)
git restore --staged appsettings.Development.json

# Unstage all staged files at once
git restore --staged .
\`\`\`

*(Note: In legacy Git versions prior to 2.23, developers used \`git reset HEAD <file>\` to achieve this).*

---

## 3. Discarding Working Tree Changes: \`git restore\`

If you edited a tracked file, realized your experiment broke the code, and want to revert it back to the last committed state:

\`\`\`bash
# Revert a specific file back to HEAD state (DANGER: destroys uncommitted local edits in this file)
git restore src/Controllers/OrderController.cs

# Revert all modified tracked files in the entire workspace
git restore .
\`\`\`

---

## 4. Deleting Untracked Files: \`git clean\`

\`git restore\` only affects **tracked** files. If you generated build artifacts, temporary logs, or scratch files that are untracked:

\`\`\`bash
# 1. ALWAYS perform a dry-run first to see what would be removed!
git clean -n -d

# 2. Force delete untracked files (-f) and untracked directories (-d)
git clean -f -d

# Also delete ignored files (e.g., node_modules, bin, obj)
git clean -f -d -x
\`\`\`
`,
    contentBn: `# পরিবর্তন নিয়ন্ত্রণ: ওয়ার্কিং ডিরেক্টরি, স্টেজিং, রিস্টোর, রিসেট ও ক্লিন

কোড লেখার সময় ভুল হলে তা নিরাপদে বাতিল করা বা স্টেজিং এরিয়া থেকে বের করার কৌশল জানা অত্যন্ত জরুরি।

---

## ১. ফাইলে পরিবর্তনের ৩টি অবস্থা

১. **আনট্র্যাকড (Untracked)**: নতুন ফাইল যা গিট এখনো চেনে না।
২. **মডিফাইড (Modified)**: ট্র্যাক করা ফাইল যার কোড পরিবর্তন করা হয়েছে কিন্তু স্টেজ করা হয়নি।
৩. **স্টেজড (Staged)**: যে পরিবর্তনগুলো \`git add\` দিয়ে পরবর্তী কমিটের জন্য প্রস্তুত করা হয়েছে।

---

## ২. স্টেজড ফাইল আনস্টেজ করা: \`git restore --staged\`

ভুলবশত কোনো ফাইল স্টেজ করে ফেললে তা আনস্টেজ করতে:
\`\`\`bash
# ফাইলটির লোকাল পরিবর্তন অক্ষত রেখে স্টেজিং এরিয়া থেকে সরাতে:
git restore --staged appsettings.json

# সব স্টেজড ফাইল একসাথে আনস্টেজ করতে:
git restore --staged .
\`\`\`

---

## ৩. আনস্টেজড পরিবর্তন বাতিল করা: \`git restore\`

কোনো ফাইলে কোড লিখে যদি দেখেন তা কাজ করছে না এবং পূর্বের কমিট করা অবস্থায় ফিরিয়ে নিতে চান:
\`\`\`bash
# ফাইলটিকে সর্বশেষ কমিটের অবস্থায় ফিরিয়ে নিতে (লোকাল এডিট মুছে যাবে):
git restore OrderService.cs

# পুরো ওয়ার্কস্পেসের সমস্ত পরিবর্তন ডিসকার্ড করতে:
git restore .
\`\`\`

---

## ৪. আনট্র্যাকড ফাইল ও ডিরেক্টরি মোছা: \`git clean\`

নতুন তৈরি হওয়া অতিরিক্ত আনট্র্যাকড ফাইল বা ফোল্ডার সম্পূর্ণ মুছে ফেলতে:
\`\`\`bash
# প্রথমে প্রিভিউ দেখুন কী কী ডিলিট হবে (Dry run):
git clean -n -d

# নিশ্চিত হয়ে ডিলিট করুন (-f force, -d directory):
git clean -f -d
\`\`\`
`,
  },
];
