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

Welcome to **Git Fundamentals**! If you are preparing for software engineering interviews or starting your professional development career, this is **Step 0**. Every modern software company in Bangladesh and globally requires you to use Git every single working day.

This guide explains everything in simple, friendly, and practical language.

---

## 1. What is Git?

At its simplest, **Git is a digital time machine for your source code.**

### The Video Game Analogy
Think of playing a difficult video game. Before you fight a dangerous level boss, you save your progress at a **checkpoint**. If your character dies during the battle, you don't have to restart the entire game from level 1—you simply reload your saved checkpoint and try again.

**Git does the exact same thing for your code:**
* Every time your project reaches a working state, you take a **snapshot** (called a **commit**).
* If you write new code tomorrow that accidentally breaks the entire system, you don't panic. You tell Git to roll back to yesterday's snapshot with a single command.
* Git keeps an unalterable, chronological log of every single change ever made: who made it, when it was made, and why.

### A Brief History
Git was created in **2005 by Linus Torvalds**, the creator of the Linux operating system. At the time, existing version control systems were either too slow, commercial, or unreliable. Torvalds designed Git with three non-negotiable goals:
1. **Blazing Speed**: Instant operations on local files.
2. **Distributed Architecture**: Complete offline independence.
3. **Data Integrity**: Cryptographic assurance that no file can be silently corrupted.

---

## 2. What is Version Control?

**Version Control** is the practice of tracking and managing changes to software code over time.

### The Problem: Life Without Version Control
Without version control, developers resorted to saving chaotic file copies on their desktops:
\`\`\`
Final_Project/
├── app_v1.cs
├── app_v2_working.cs
├── app_final.cs
├── app_final_edited.cs
├── app_final_REAL_final.cs
└── app_final_submitted_by_rahim_FINAL.cs  <-- Which one is the real code?!
\`\`\`
If two developers edit \`app_final.cs\` at the same time, whoever saves last accidentally overwrites and deletes the other developer's work!

### The Solution: A Version Control System (VCS)
A Version Control System solves all of these problems automatically:
1. **Single Working Folder**: You only have one clean copy of your files on your screen. The entire history is tucked away safely in a hidden background database (\`.git\`).
2. **Accountability (Blame / Annotate)**: You can see exactly which developer wrote line 42 and what commit message they attached to it.
3. **Branching**: You can create an isolated branch to build a risky new feature. If the experiment fails, you delete the branch without touching the working production code.
4. **Collaboration**: Multiple engineers can edit different parts of the same codebase simultaneously. The VCS helps merge their work seamlessly.

---

## 3. Git vs GitHub: The Crucial Difference

Many beginners mistakenly use the words "Git" and "GitHub" interchangeably. They are fundamentally different products created by different people.

### The Camera vs Instagram Analogy
* **Git is like a Camera**: It is a physical tool installed on your computer. You use it locally to take photos (snapshots) of your code. You do **not** need the internet to use your camera.
* **GitHub is like Instagram**: It is a website in the cloud. You upload the photos you took with your camera to Instagram so your friends can view, comment, and collaborate on them.

\`\`\`
+------------------------------------+               +------------------------------------+
|            GIT (Local)             |               |          GITHUB (Cloud)            |
+------------------------------------+               +------------------------------------+
| • A command-line software tool     |   git push    | • A website / cloud platform       |
| • Runs entirely on your computer   | ============> | • Owned by Microsoft               |
| • 100% offline (no internet needed)|               | • Requires internet connection     |
| • Tracks history, commits, branches|   git pull    | • Remote backup, Pull Requests,    |
| • Open-source & completely free    | <============ |   code reviews, CI/CD Actions      |
+------------------------------------+               +------------------------------------+
\`\`\`

> [!NOTE]
> There are alternatives to GitHub that also work with Git! Examples include **GitLab**, **Bitbucket**, and self-hosted **Gitea**. Git is the open standard; GitHub is just the most popular online hosting service.

---

## 4. Distributed Version Control System (DVCS)

To understand why Git dominates the software world, you must understand how it differs from older **Centralized Version Control Systems (CVCS)** like SVN (Subversion) or CVS.

### Centralized VCS (Legacy)
In a centralized system, there is only one central server holding the project history:
* Developers only download the latest version of a file.
* If you are on an airplane or your internet goes down, you **cannot commit** or view past logs.
* If the central server's hard drive fails and has no backup, **the entire project history is permanently lost**.

### Distributed VCS (Git)
In Git, when you clone a repository, you don't just download the latest files:
* **You download the ENTIRE database and full historical timeline of the project onto your laptop.**
* Every single developer's machine acts as a complete, independent, mirror backup of the entire repository.
* You can make commits, create branches, review diffs, and inspect history completely offline. When your internet reconnects, you simply synchronize with the remote server.

| Feature | Centralized VCS (e.g. SVN) | Distributed VCS (e.g. Git) |
| :--- | :--- | :--- |
| **History Location** | Central server only | Every developer's laptop has a full copy |
| **Offline Work** | Impossible | 100% functional without internet |
| **Performance** | Slow (network round-trip per action) | Blazing fast (local disk operations) |
| **Backup Reliability** | Single Point of Failure (SPOF) | Extremely safe; every developer has a backup |

---

## 5. Git Installation: Step-by-Step

Installing Git takes less than two minutes on any operating system.

### A. Windows Installation
1. Go to the official website: [git-scm.com/download/win](https://git-scm.com/download/win).
2. Download the 64-bit installer for Windows.
3. Run the installer. You can safely accept the default options, but make sure to check:
   * **Git Bash Here**: Adds a handy right-click option to open a Linux-style terminal in any folder.
   * **Git from the command line and also from 3rd-party software**: Allows Command Prompt, PowerShell, and VS Code to use Git.
   * **Checkout Windows-style, commit Unix-style line endings**: Ensures compatibility across Windows and Linux.

### B. macOS Installation
Open your Terminal and install via Homebrew (recommended):
\`\`\`bash
brew install git
\`\`\`
*(If you don't use Homebrew, simply type \`git --version\` in Terminal. macOS will automatically prompt you to install Apple's Command Line Developer Tools).*

### C. Linux Installation (Ubuntu / Debian / Fedora)
\`\`\`bash
# Ubuntu / Debian:
sudo apt update && sudo apt install git -y

# Fedora / RedHat:
sudo dnf install git -y
\`\`\`

### Verify Installation
Open your terminal (or Git Bash on Windows) and run:
\`\`\`bash
git --version
# Example output: git version 2.45.2
\`\`\`
If you see a version number, Git is installed and ready!

---

## 6. Git Configuration: First-Time Setup

Before you make your first commit, Git requires you to declare your identity. Every commit you make is permanently signed with your name and email.

### Step 1: Set Your Name and Email
Use the exact same email address you use on your GitHub account so GitHub can link your commits to your profile:
\`\`\`bash
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"
\`\`\`

### Step 2: Set the Default Branch to \`main\`
Historically, Git used \`master\` as the default branch. The modern global software standard is **\`main\`**:
\`\`\`bash
git config --global init.defaultBranch main
\`\`\`

### Step 3: Configure Line Ending Handling (\`core.autocrlf\`)
Windows and Unix systems (macOS/Linux) save line breaks differently:
* Windows uses **CRLF** (Carriage Return + Line Feed: \`\\r\\n\`).
* macOS & Linux use **LF** (Line Feed: \`\\n\`).

To prevent invisible line-ending conflicts when sharing code across operating systems:
\`\`\`bash
# If you are on Windows:
git config --global core.autocrlf true

# If you are on macOS or Linux:
git config --global core.autocrlf input
\`\`\`

### Step 4: Verify Your Configuration
\`\`\`bash
# View all your active global settings:
git config --list --show-origin
\`\`\`
This will show your name, email, and config file location (usually \`~/.gitconfig\`).

---

## 7. The Core Git Workflow (The 3 + 1 Stages)

To use Git effectively, you must understand the journey a file takes from when you type code to when it is safely stored in the cloud.

\`\`\`
+-------------------------+             +-------------------------+             +-------------------------+             +-------------------------+
|    WORKING DIRECTORY    |   git add   |      STAGING AREA       | git commit  |    LOCAL REPOSITORY     |  git push   |    REMOTE REPOSITORY    |
|   (Your Project Desk)   | ==========> |   (The Packing Box)     | ==========> |   (The Storage Vault)   | ==========> |      (GitHub Cloud)     |
|                         |             |                         |             |                         |             |                         |
| • You write & edit code |             | • Ready for next commit |             | • Permanent history     |             | • Backed up online      |
| • Files are "Modified"  |  restore    | • Manifest index file   |             | • Saved in .git/ folder |  git pull   | • Shared with team      |
| • Files are "Untracked" | <---------- | • Staged snapshot draft |             | • Immutable commit hash | <---------- | • Pull Requests & CI/CD |
+-------------------------+             +-------------------------+             +-------------------------+             +-------------------------+
\`\`\`

### The 3 Local Tiers:
1. **Working Directory (Your Desk)**:
   This is your actual folder on your hard drive where you view and edit files in VS Code or Visual Studio. Changes here are live, uncommitted, and unversioned.
2. **Staging Area / The Index (The Shipping Box)**:
   This is a special preparation area. When you run \`git add <file>\`, you place that file into the shipping box. You can pack 3 files into the box and leave 2 files out.
3. **Local Repository (The Permanent Vault)**:
   When you run \`git commit -m "feat: user login"\`, Git seals the shipping box, stamps it with a unique cryptographic hash (e.g. \`7a1b4c9\`), and places it permanently into the vault (\`.git\` directory).

### The 4th Tier: Remote Repository (GitHub Cloud)
Your local repository is safe on your laptop, but what if your laptop is lost or stolen? What about your teammates?
* **\`git push\`**: Sends your local sealed commits up to GitHub in the cloud.
* **\`git pull\`**: Downloads your teammates' latest commits from GitHub down to your laptop.

---

## Summary Checklist for Beginners
* [x] **Git** is the local tool; **GitHub** is the cloud platform.
* [x] Git is **distributed**: every developer has the full history locally.
* [x] Always configure \`user.name\`, \`user.email\`, and \`init.defaultBranch main\`.
* [x] The daily rhythm is: **Edit Code -> \`git add\` (stage) -> \`git commit\` (save) -> \`git push\` (share)**.
`,
    contentBn: `# গিট ফান্ডামেন্টালস: ভার্সন কন্ট্রোল, আর্কিটেকচার ও ওয়ার্কফ্লো

**গিট ফান্ডামেন্টালস** পাঠে আপনাকে স্বাগতম! আপনি যদি সফটওয়্যার ইঞ্জিনিয়ারিং চাকরির পরীক্ষার প্রস্তুতি নেন বা ডেভেলপার হিসেবে ক্যারিয়ার শুরু করতে চান, তবে এটি হলো আপনার প্রস্তুতির **শূন্য পর্যায় (Stage 0)**। 

বাংলাদেশসহ বিশ্বের যেকোনো টেক কোম্পানিতে প্রতিদিনের প্রতিটি কাজের শুরুতে এবং শেষে গিট ব্যবহার করতে হয়। এই নির্দেশিকায় প্রতিটি বিষয় অত্যন্ত সহজ, প্রাঞ্জল ও বাস্তব উদাহরণ দিয়ে ব্যাখ্যা করা হয়েছে।

---

## ১. গিট (Git) কী?

খুব সহজ ভাষায় বলতে গেলে: **গিট হলো আপনার কোডের জন্য একটি ডিজিটাল টাইম মেশিন (Time Machine)।**

### ভিডিও গেমের বাস্তব উদাহরণ
মনে করুন আপনি একটি কঠিন ভিডিও গেম খেলছেন। একটি বিপজ্জনক দানব বা বসের সাথে লড়াই করার ঠিক আগে আপনি গেমটি একটি **চেকপয়েন্টে (Checkpoint) সেভ** করে নেন। লড়াইয়ে আপনার ক্যারেক্টার মারা গেলে কি পুরো গেম আবার লেভেল ১ থেকে শুরু করতে হয়? একদমই না! আপনি কেবল শেষ সেভ করা চেকপয়েন্টটি রিলোড করেন এবং নতুন কৌশলে আবার খেলেন।

**গিট আপনার কোডের জন্য ঠিক এই কাজটিই করে:**
* যখনই আপনার প্রজেক্টের কোনো অংশ ঠিকঠাক কাজ করে, আপনি গিটের মাধ্যমে একটি স্ন্যাপশট সংরক্ষণ করেন (যাকে বলা হয় **কমিট / Commit**)।
* পরবর্তীতে নতুন কোড লিখতে গিয়ে যদি পুরো সিস্টেম ভেঙেও যায়, কোনো ভয় নেই। একটি মাত্র কমান্ড দিয়ে আপনি গতকালের ঠিকঠাক থাকা অবস্থায় প্রজেক্ট ফিরিয়ে নিতে পারবেন।
* গিট প্রতিটি পরিবর্তনের সম্পূর্ণ ইতিহাস মনে রাখে: কে পরিবর্তন করেছে, কখন করেছে এবং কেন করেছে।

### গিটের পেছনের ইতিহাস
গিট তৈরি করেছিলেন **লিনাস টরভাল্ডস (Linus Torvalds)** ২০০৫ সালে, যিনি বিখ্যাত লিনাক্স (Linux) অপারেটিং সিস্টেমের জনক। লিনাক্স কার্নেলের বিশাল কোডবেস হাজার হাজার ডেভেলপারের সাথে পরিচালনা করার মতো দ্রুতগতির ও নিরাপদ কোনো টুল না পেয়ে তিনি নিজেই গিট উদ্ভাবন করেন।

---

## ২. ভার্সন কন্ট্রোল (Version Control) কী?

সময়ের সাথে সাথে কোনো প্রজেক্টের ফাইলের পরিবর্তনগুলো পদ্ধতিগতভাবে সংরক্ষণ ও পরিচালনা করার নামই হলো **ভার্সন কন্ট্রোল**।

### ভার্সন কন্ট্রোল ছাড়া জীবনের চিত্র
ভার্সন কন্ট্রোল ব্যবহার না করলে ডেভেলপাররা কী করতেন? ডেস্কটপে ফাইলের শত শত বিশৃঙ্খল কপি জমাতেন:
\`\`\`
My_Project/
├── app_v1.cs
├── app_v2_final.cs
├── app_final_edited.cs
├── app_final_REAL_final.cs
└── app_final_approved_by_boss_FINAL.cs  <-- এর মধ্যে কোনটা আসল কোড?!
\`\`\`
যদি দুজন ডেভেলপার একই সাথে ফাইলে কাজ করেন, তবে যিনি পরে সেভ করবেন তিনি অজান্তেই আগের জনের পুরো কোড মুছে ফেলবেন!

### ভার্সন কন্ট্রোল সিস্টেম (VCS) কীভাবে সমাধান করে?
১. **একটি মাত্র পরিচ্ছন্ন ফোল্ডার**: আপনার স্ক্রিনে ফাইলের একাধিক বিভ্রান্তিকর কপি থাকবে না। সমস্ত অতীত ইতিহাস ব্যাকগ্রাউন্ডে হিডেন ডেটাবেজে (\`.git\` ফোল্ডারে) সুরক্ষিত থাকে।
২. **দায়বদ্ধতা ও হিস্ট্রি**: কোডের কোন লাইনটি কে লিখেছিলেন এবং কেন লিখেছিলেন, তা এক ক্লিকে দেখা যায়।
৩. **স্বাধীন ব্রাঞ্চিং**: মূল কোড নষ্ট না করে সম্পূর্ণ আলাদা একটি শাখায় (Branch) নতুন ফিচার তৈরি করে পরীক্ষা করা যায়।
৪. **সহজ মার্জিং**: একাধিক ডেভেলপার একই ফাইলে একসাথে কাজ করলেও তাদের পরিবর্তনগুলো স্বাচ্ছন্দ্যে জোড়া লাগানো যায়।

---

## ৩. গিট বনাম গিটহাব (Git vs GitHub): আসল পার্থক্য

অনেকেই ভুল করে মনে করেন গিট এবং গিটহাব একই জিনিস। প্রকৃতপক্ষে দুটি সম্পূর্ণ আলাদা:

### ক্যামেরা বনাম ইনস্টাগ্রামের উদাহরণ
* **গিট (Git) হলো একটি ক্যামেরা**: এটি একটি টুল যা আপনার কম্পিউটারে ইনস্টল থাকে। আপনি ছবি (কোডের স্ন্যাপশট) তোলার জন্য এটি ব্যবহার করেন। ছবি তুলতে আপনার কোনো ইন্টারনেটের প্রয়োজন হয় না।
* **গিটহাব (GitHub) হলো ইনস্টাগ্রাম বা গুগল ফটোজ**: এটি ইন্টারনেটে থাকা একটি ক্লাউড প্ল্যাটফর্ম। আপনি আপনার ক্যামেরায় তোলা ছবিগুলো ব্যাকআপ রাখতে এবং বন্ধুদের সাথে শেয়ার করতে সেখানে আপলোড করেন।

\`\`\`
+------------------------------------+               +------------------------------------+
|             গিট (Git - লোকাল)      |               |         গিটহাব (GitHub - ক্লাউড)   |
+------------------------------------+               +------------------------------------+
| • একটি কমান্ড-লাইন সফটওয়্যার টুল  |   git push    | • একটি ওয়েবসাইট / ক্লাউড প্ল্যাটফর্ম|
| • আপনার নিজের কম্পিউটারে চলে      | ============> | • মাইক্রোসফটের মালিকানাধীন         |
| • শতভাগ অফলাইনে কাজ করে (নেট লাগে না)|            | • ইন্টারনেট সংযোগ প্রয়োজন          |
| • কোডের হিস্ট্রি ও ব্রাঞ্চ ট্র্যাক করে|  git pull   | • রিমোট ব্যাকআপ, পুল রিকোয়েস্ট,   |
| • ফ্রি ও ওপেন সোর্স                | <============ |   কোড রিভিউ ও অটোমেশন (Actions)   |
+------------------------------------+               +------------------------------------+
\`\`\`

---

## ৪. ডিস্ট্রিবিউটেড ভার্সন কন্ট্রোল সিস্টেম (DVCS)

গিট কেন আজ সফটওয়্যার ইন্ডাস্ট্রির অবিসংবাদিত নেতা, তা বুঝতে হলে সেন্ট্রালাইজড বনাম ডিস্ট্রিবিউটেড সিস্টেমের পার্থক্য বোঝা দরকার।

### সেন্ট্রালাইজড সিস্টেম (যেমন SVN - পুরনো পদ্ধতি)
পুরো প্রজেক্টের ইতিহাস কেবল একটি মাত্র কেন্দ্রীয় সার্ভারে জমা থাকে।
* ডেভেলপাররা কেবল ফাইলের সর্বশেষ কপি দেখতে পান।
* ইন্টারনেট সংযোগ না থাকলে কোনো কমিট করা যায় না বা ইতিহাস দেখা যায় না।
* সার্ভারের হার্ডডিস্ক নষ্ট হয়ে গেলে প্রজেক্টের সমস্ত পূর্ববর্তী ইতিহাস চিরতরে হারিয়ে যায়।

### ডিস্ট্রিবিউটেড সিস্টেম (গিট - আধুনিক পদ্ধতি)
গিটে যখন আপনি কোনো প্রজেক্ট ক্লোন করেন, তখন কেবল ফাইলগুলো ডাউনলোড হয় না:
* **পুরো প্রজেক্টের শুরু থেকে শেষ পর্যন্ত সমস্ত ইতিহাস এবং সম্পূর্ণ ডেটাবেজ আপনার কম্পিউটারে ক্লোন হয়ে আসে।**
* ফলে ইন্টারনেটের কোনো সংযোগ ছাড়াই আপনি প্লেনে বা প্রত্যন্ত অঞ্চলে বসেও সম্পূর্ণ অফলাইনে কমিট, ব্রাঞ্চিং ও হিস্ট্রি রিভিউ করতে পারেন।
* প্রতিটি ডেভেলপারের ল্যাপটপই প্রজেক্টের একটি স্বয়ংসম্পূর্ণ ও সুরক্ষিত ব্যাকআপ।

---

## ৫. গিট ইনস্টলেশন: ধাপে ধাপে নির্দেশিকা

যেকোনো অপারেটিং সিস্টেমে গিট ইনস্টল করা অত্যন্ত সহজ।

### উইন্ডোজ (Windows)
১. অফিশিয়াল ওয়েবসাইট [git-scm.com/download/win](https://git-scm.com/download/win) থেকে ৬৪-বিট ইনস্টলার ডাউনলোড করুন।
২. ইনস্টল করার সময় ডিফল্ট সেটিংস রেখে এগিয়ে যান। বিশেষ করে **Git Bash** এবং **Checkout Windows-style, commit Unix-style line endings** অপশন সিলেক্ট রাখুন।

### ম্যাক (macOS)
ম্যাকে টার্মিনাল খুলে Homebrew দিয়ে ইনস্টল করতে পারেন:
\`\`\`bash
brew install git
\`\`\`
*(অথবা টার্মিনালে শুধু \`git --version\` লিখলে ম্যাক নিজে থেকেই কমান্ড লাইন ডেভেলপার টুলস ইনস্টল করার প্রস্তাব দেবে)।*

### লিনাক্স (Linux)
\`\`\`bash
# Ubuntu বা Debian-এ:
sudo apt update && sudo apt install git -y
\`\`\`

### ইনস্টলেশন যাচাই করা
টার্মিনালে (উইন্ডোজে Git Bash-এ) লিখুন:
\`\`\`bash
git --version
# আউটপুট দেখতে পাবেন: git version 2.45.2
\`\`\`

---

## ৬. প্রথমবার গিট কনফিগারেশন

প্রথমবার গিট ব্যবহারের সময় নিজের পরিচয় সেট করা বাধ্যতামূলক। আপনার প্রতিটি কমিটে এই নাম ও ইমেইল স্থায়ীভাবে যুক্ত থাকবে।

### ধাপ ১: নাম ও ইমেইল সেট করুন
গিটহাব অ্যাকাউন্টে যে ইমেইল ব্যবহার করেছেন ঠিক সেই ইমেইলটি দিন:
\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
\`\`\`

### ধাপ ২: ডিফল্ট ব্রাঞ্চ 'main' নির্ধারণ করুন
পূর্বে ডিফল্ট ব্রাঞ্চের নাম \`master\` ছিল। বর্তমান আন্তর্জাতিক স্ট্যান্ডার্ড হলো **\`main\`**:
\`\`\`bash
git config --global init.defaultBranch main
\`\`\`

### ধাপ ৩: লাইন এন্ডিং কনফিগারেশন (\`core.autocrlf\`)
উইন্ডোজ এবং ম্যাক/লিনাক্সে ফাইলের লাইনের সমাপ্তি (Line Break) আলাদাভাবে সংরক্ষিত হয়। অপারেটিং সিস্টেম পরিবর্তনের কারণে যাতে কোনো সমস্যা না হয়:
\`\`\`bash
# উইন্ডোজ ব্যবহারকারী হলে:
git config --global core.autocrlf true

# ম্যাক বা লিনাক্স ব্যবহারকারী হলে:
git config --global core.autocrlf input
\`\`\`

---

## ৭. গিটের মূল ওয়ার্কফ্লো (The Core Workflow)

গিটের কাজ বোঝার সবচেয়ে সহজ উপায় হলো এর ৩টি লোকাল স্তর এবং ১টি ক্লাউড স্তর বোঝা:

\`\`\`
ওয়ার্কিং ডিরেক্টরি  ====(git add)===>  স্টেজিং এরিয়া  ====(git commit)===>  লোকাল রিপোজিটরি  ====(git push)===>  গিটহাব ক্লাউড
 (আপনার ডেস্ক)                         (প্যাকিং বক্স)                           (সুরক্ষিত সিন্দুক)                     (অনলাইন ব্যাকআপ)
\`\`\`

১. **ওয়ার্কিং ডিরেক্টরি (Working Directory)**: আপনার কম্পিউটারের যে ফোল্ডারে আপনি কোড লিখছেন বা এডিট করছেন।
২. **স্টেজিং এরিয়া (Staging Area)**: একটি প্যাকিং বক্সের মতো। আপনি ৫টি ফাইলে কাজ করেছেন, কিন্তু পরবর্তী সেভে মাত্র ২টি ফাইল অন্তর্ভুক্ত করতে চান। \`git add\` দিয়ে সেই নির্দিষ্ট ফাইলগুলোকে আপনি এই বক্সে সাজিয়ে রাখেন।
৩. **লোকাল রিপোজিটরি (Local Repository)**: \`git commit -m "মেসেজ"\` চালালে বক্সটি সিলগালা হয়ে একটি নির্দিষ্ট আইডি (হ্যাশ) সহ স্থায়ীভাবে আপনার মেশিনের লোকাল সিন্দুকে (\`.git\` ফোল্ডারে) জমা হয়ে যায়।
৪. **রিমোট রিপোজিটরি (GitHub Cloud)**: লোকাল মেশিনে সেভ করা কমিটগুলো \`git push\` দিয়ে অনলাইনে গিটহাবে পাঠানো হয়, যাতে দলগতভাবে সবাই কোড পায় এবং ব্যাকআপ থাকে।

---

## শিক্ষানবিসদের জন্য সারসংক্ষেপ
* গিট লোকাল টুল, আর গিটহাব ক্লাউড প্ল্যাটফর্ম।
* গিট সম্পূর্ণ অফলাইনে কাজ করে।
* প্রতিদিনের সাধারণ কাজের ছন্দ: **কোড লিখুন -> \`git add\` (স্টেজ) -> \`git commit\` (সেভ) -> \`git push\` (শেয়ার)**।
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
