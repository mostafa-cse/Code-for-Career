import type { LocalLesson } from "@/lib/lessons-data";

export const gitFundamentalsLesson: LocalLesson = {
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
| GIT (Local) | | GITHUB (Cloud) |
+------------------------------------+               +------------------------------------+
| • A command-line software tool | git push | • A website / cloud platform |
| • Runs entirely on your computer | ============> | • Owned by Microsoft |
| • 100% offline (no internet needed)| | • Requires internet connection |
| • Tracks history, commits, branches| git pull | • Remote backup, Pull Requests, |
| • Open-source & completely free | <============ | code reviews, CI/CD Actions |
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
| WORKING DIRECTORY | git add | STAGING AREA | git commit | LOCAL REPOSITORY | git push | REMOTE REPOSITORY |
| (Your Project Desk) | ==========> | (The Packing Box) | ==========> | (The Storage Vault) | ==========> | (GitHub Cloud) |
| | | | | | | |
| • You write & edit code | | • Ready for next commit | | • Permanent history | | • Backed up online |
| • Files are "Modified" | restore | • Manifest index file | | • Saved in .git/ folder | git pull | • Shared with team |
| • Files are "Untracked" | <---------- | • Staged snapshot draft | | • Immutable commit hash | <---------- | • Pull Requests & CI/CD |
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
| গিট (Git - লোকাল) | | গিটহাব (GitHub - ক্লাউড) |
+------------------------------------+               +------------------------------------+
| • একটি কমান্ড-লাইন সফটওয়্যার টুল | git push | • একটি ওয়েবসাইট / ক্লাউড প্ল্যাটফর্ম|
| • আপনার নিজের কম্পিউটারে চলে | ============> | • মাইক্রোসফটের মালিকানাধীন |
| • শতভাগ অফলাইনে কাজ করে (নেট লাগে না)| | • ইন্টারনেট সংযোগ প্রয়োজন |
| • কোডের হিস্ট্রি ও ব্রাঞ্চ ট্র্যাক করে| git pull | • রিমোট ব্যাকআপ, পুল রিকোয়েস্ট, |
| • ফ্রি ও ওপেন সোর্স | <============ | কোড রিভিউ ও অটোমেশন (Actions) |
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
  };
