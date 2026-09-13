import type { LocalLesson } from "@/lib/lessons-data";

export const gitWorkingWithChangesLesson: LocalLesson = {
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
    contentEn: `# Working with Changes: Working Directory, Staging, Repository, File States & Undo Tools

Every productive developer must know how changes flow between Git's internal areas, how files transition through their lifecycle states, and how to safely discard or unstage mistakes without losing valuable work.

---

## The 3 Architectural Areas of Git

Git manages your code using three distinct zones (often called **The Three Trees** of Git):

\`\`\`
+---------------------------------------------------------------------------------------------------------------+
| THE THREE TREES OF GIT |
+-----------------------------------+-----------------------------------+---------------------------------------+
| 1. WORKING DIRECTORY | 2. STAGING AREA | 3. LOCAL REPOSITORY |
| (The Desk) | (The Shipping Box) | (The Vault) |
+-----------------------------------+-----------------------------------+---------------------------------------+
| • Actual files on your hard disk | • A binary cache file: | • The permanent object database: |
| • Where you type code in VS Code | \`\.git/index\` | \`\.git/objects\` |
| • Changes are live, uncommitted, | • The preview draft of your next | • Immutable commits with unique |
| and vulnerable to crashes | commit | cryptographic SHA hashes |
| • Holds Untracked & Modified | • Created and updated via: | • Sealed and stamped via: |
| files | \`git add <file>\` | \`git commit -m "msg"\` |
+-----------------------------------+-----------------------------------+---------------------------------------+
\`\`\`

### 1. Working Directory (Working Tree)
* **What it is:** The actual physical folder on your computer containing your project files (e.g. \`Program.cs\`, \`package.json\`, \`images/\`).
* **Role:** This is your workbench. You open files here in your favorite editor, write new algorithms, delete lines, and test code locally.
* **Safety:** Changes here are **not yet tracked or backed up** by Git. If your computer shuts down or a file is accidentally deleted before staging/committing, Git cannot recover it.

### 2. Staging Area (The Index / Cache)
* **What it is:** An internal file located at \`.git/index\` that acts as a preparation buffer.
* **Role:** Think of it as a shipping box. Before sealing a package and sending it out, you selectively place only the items you want into the box. The staging area allows you to craft small, atomic, clean commits even if you touched 20 files at once.
* **Command:** Populated using \`git add <file>\`.

### 3. Repository (The Object Database / HEAD)
* **What it is:** The permanent vault stored inside the hidden \`.git/\` directory.
* **Role:** Contains every snapshot (commit) you have ever made. Once a change reaches this vault, it is virtually impossible to lose.
* **Command:** Sealed using \`git commit -m "your message"\`.

---

## The 3 Essential File States

Files in your project exist in one of three primary lifecycle states:

\`\`\`
+-----------------------------------------------------------------------------------------------+
| FILE LIFECYCLE PROGRESSION |
+-----------------------------------------------------------------------------------------------+
| |
| [ New File Created ] |
| │ |
| ▼ |
| 1. UNTRACKED (??)  ════════( git add )════════>  3. STAGED (M )  ════( git commit )════> [ COMMITTED ]
| ▲                                      │
| [ Tracked File Edited ]                                  │                                      │
| │                                                │                                 (edit again)
| ▼                                                │                                      │
| 2. MODIFIED ( M)   ════════( git add )══════════════════╝ <════════════════════════════════════╝
| |
+-----------------------------------------------------------------------------------------------+
\`\`\`

### 4. Modified Files (\` M\`)
* **Definition:** A file that was already committed in the past, but has been changed in your working directory.
* **How Git sees it:** Git compares your current working file against the version in the last commit. If any character differs, it labels the file as **Modified**.
* **Appearance in \`git status\`:** Appears in **Red** under *"Changes not staged for commit"*.

### 5. Staged Files (\`M \`)
* **Definition:** A file whose modifications have been added to the staging area via \`git add\`.
* **How Git sees it:** Git has registered these exact changes into \`.git/index\` and is ready to seal them into the next commit snapshot.
* **Appearance in \`git status\`:** Appears in **Green** under *"Changes to be committed"*.

### 6. Untracked Files (\`??\`)
* **Definition:** A brand new file created in the working directory that Git has never seen before in any previous commit.
* **How Git sees it:** Git sees the file sitting in the directory, but ignores its contents until you explicitly tell it to start tracking via \`git add\`.
* **Appearance in \`git status\`:** Appears in **Red** under *"Untracked files"*.

---

## Undoing and Cleaning: \`git restore\`, \`git reset\` & \`git clean\`

Mistakes happen in every coding session. Git provides three dedicated commands to undo mistakes depending on **where** the changes are located:

\`\`\`
+-----------------------+---------------------------------------+---------------------------------------+
| Goal | Command | Danger Level |
+-----------------------+---------------------------------------+---------------------------------------+
| Unstage a file | \`git restore --staged <file>\` | Completely Safe (keeps file edits) |
| Discard local edits | \`git restore <file>\` | Permanent Loss of uncommitted code |
| Legacy unstage | \`git reset HEAD <file>\` | Completely Safe (keeps file edits) |
| Delete untracked files| \`git clean -f -d\` | Permanent Deletion of new files |
+-----------------------+---------------------------------------+---------------------------------------+
\`\`\`

---

## 7. \`git restore\` — Modern, Surgical Undo

Introduced in Git 2.23, \`git restore\` was specifically created to replace the confusing, overloaded behavior of older commands.

### Case A: Unstaging a file (Take it out of the shipping box)
If you ran \`git add .\` and accidentally staged \`appsettings.json\` with your private database password:
\`\`\`bash
# Unstages the file, but KEEPS your edits intact on your disk:
git restore --staged appsettings.json

# Unstage all currently staged files:
git restore --staged .
\`\`\`

### Case B: Discarding working tree edits (Throw away bad code)
If you experimented with some code in \`AuthService.cs\`, completely broke the logic, and want to revert the file back to how it was in the last commit:
\`\`\`bash
# Reverts the file back to last committed state:
git restore AuthService.cs

# Revert ALL modified files in the entire project (DANGER: destroys uncommitted changes!):
git restore .
\`\`\`

---

## 8. \`git reset\` — The Traditional Multi-Tool

Before \`git restore\` existed, \`git reset\` was the primary way developers unstaged files.

### Using \`git reset\` to Unstage:
\`\`\`bash
# Unstage a single file (identical effect to 'git restore --staged'):
git reset HEAD appsettings.json

# Unstage everything:
git reset HEAD
\`\`\`

### \`restore\` vs \`reset\`: Which one should you use?
* **For everyday file-level unstaging and discarding:** Use **\`git restore\`** (it is clearer, safer, and does not touch commit pointers).
* **For rolling back entire commit history:** Use **\`git reset\`** (e.g. \`--soft\`, \`--mixed\`, \`--hard\`, which we cover in detail in the Commits lesson).

---

## 9. \`git clean\` — Obliterating Untracked Files

Neither \`git restore\` nor \`git reset\` will touch **Untracked** files (files Git has never tracked).
If you build your app and your folder gets cluttered with 50 temporary \`.log\` files, temporary text notes, or test folders:

### Golden Rule: Always Dry-Run First!
\`\`\`bash
# Step 1: Preview what will be deleted WITHOUT actually deleting anything (-n = dry-run, -d = directories):
git clean -n -d
# Output: Would remove scratch_test.txt
# Output: Would remove debug_logs/

# Step 2: Once you verify that no important files are in the list, force delete (-f = force, -d = directories):
git clean -f -d

# Step 3: Delete untracked files AND ignored files (e.g. clean out node_modules or bin/):
git clean -f -d -x
\`\`\`

---

## Practical Decision Matrix

| Scenario | Command to run |
| :--- | :--- |
| "I added \`User.cs\` to staging by mistake, but I still want my code edits." | \`git restore --staged User.cs\` |
| "I messed up \`User.cs\` and want to wipe my edits back to the last commit." | \`git restore User.cs\` |
| "I generated 10 dummy test files and want them completely deleted." | \`git clean -f -d\` |
| "I want to see what is staged vs unstaged right now." | \`git status -s\` |
`,
    contentBn: `# পরিবর্তন নিয়ন্ত্রণ: ওয়ার্কিং ডিরেক্টরি, স্টেজিং এরিয়া, রিপোজিটরি, ফাইল স্টেট ও আনডু টুলস

প্রতিদিনের কোডিংয়ে ভুল কোড লেখা বা ভুল ফাইল সেভ করতে যাওয়া খুব স্বাভাবিক ঘটনা। তাই কোড পরিবর্তনের স্তরগুলো কীভাবে কাজ করে এবং কীভাবে নিরাপদে ভুল পরিবর্তন বাতিল (Undo) করতে হয়, তা জানা প্রতিটি ইঞ্জিনিয়ারের জন্য অপরিহার্য।

---

## গিটের ৩টি অভ্যন্তরীণ স্তর (The Three Trees)

গিট আপনার কোডকে প্রধানত তিনটি জোনে বিভক্ত করে পরিচালনা করে:

\`\`\`
+---------------------------------------------------------------------------------------------------------------+
| গিটের ৩টি অভ্যন্তরীণ স্তর |
+-----------------------------------+-----------------------------------+---------------------------------------+
| ১. ওয়ার্কিং ডিরেক্টরি | ২. স্টেজিং এরিয়া | ৩. লোকাল রিপোজিটরি |
| (কাজের টেবিল) | (প্যাকিং বাক্স) | (সিন্দুক) |
+-----------------------------------+-----------------------------------+---------------------------------------+
| • কম্পিউটারের বাস্তব ফোল্ডার | • একটি বাইনারি ক্যাশ ফাইল: | • পার্মানেন্ট অবজেক্ট ডেটাবেজ: |
| • যেখানে আপনি VS Code-এ কোড লেখেন | \`\.git/index\` | \`\.git/objects\` |
| • পরিবর্তনগুলো লাইভ থাকে এবং | • পরবর্তী কমিটের জন্য সাজানো | • অপরিবর্তনীয় কমিট হিস্ট্রি এবং |
| সেভ না করলে হারানোর ঝুঁকি থাকে | খসড়া ড্রাফট | ইউনিক ক্রিপ্টোগ্রাফিক হ্যাশ |
| • Untracked ও Modified ফাইল থাকে | • \`git add <file>\` দিয়ে তৈরি | • \`git commit -m "msg"\` দিয়ে স্থায়ী|
| | ও আপডেট হয় | সিলগালা হয় |
+-----------------------------------+-----------------------------------+---------------------------------------+
\`\`\`

### ১. ওয়ার্কিং ডিরেক্টরি (Working Directory)
* **এটি কী:** আপনার কম্পিউটারের সাধারণ ড্রাইভের যে ফোল্ডারে আপনি কোড ফাইলগুলো সরাসরি দেখেন ও এডিট করেন (যেমন: \`Program.cs\`, \`style.css\`)।
* **কাজ:** এটি আপনার ওয়ার্কবেঞ্চ বা কাজের টেবিল। এখানে আপনি নতুন কোড লেখেন, পরীক্ষা করেন বা লাইন মোছেন।
* **নিরাপত্তা:** এখানে থাকা পরিবর্তনগুলো এখনো গিট সেভ করেনি। বিদ্যুৎ চলে গেলে বা ভুলে ফাইল ডিলিট হলে গিট তা ফেরত আনতে পারবে না।

### ২. স্টেজিং এরিয়া (Staging Area / The Index)
* **এটি কী:** \`.git/index\` নামের একটি অভ্যন্তরীণ বাইনারি ফাইল যা একটি মধ্যবর্তী প্যাকিং বাক্স হিসেবে কাজ করে।
* **কাজ:** কুরিয়ারে পাঠানোর আগে কার্টনে যে জিনিসগুলো আপনি গুছিয়ে রাখেন, স্টেজিং এরিয়া ঠিক তাই। এটি আপনাকে সুযোগ দেয় ২০টি ফাইলের মধ্যে থেকে বেছে বেছে মাত্র ২টি ফাইল পরবর্তী সেভে অন্তর্ভুক্ত করতে।
* **কমান্ড:** \`git add <file>\` দিয়ে ফাইলে স্টেজিং এরিয়ায় পাঠানো হয়।

### ৩. লোকাল রিপোজিটরি (Local Repository / HEAD)
* **এটি কী:** হিডেন \`.git\` ডিরেক্টরির ভেতরে থাকা স্থায়ী সিন্দুক (Object Database)।
* **কাজ:** আপনার সেভ করা প্রতিটি স্ন্যাপশট (Commit) এখানে অবিনশ্বরভাবে জমা থাকে। একবার কোনো কোড এই সিন্দুকে পৌঁছালে তা আর সহজে হারায় না।
* **কমান্ড:** \`git commit -m "মেসেজ"\` দিয়ে এখানে পার্মানেন্ট রেকর্ড তৈরি হয়।

---

## ফাইলের ৩টি মূল অবস্থা (Lifecycle States)

\`\`\`
+-----------------------------------------------------------------------------------------------+
| ফাইলের ৩টি অবস্থা |
+-----------------------------------------------------------------------------------------------+
| নতুন ফাইল তৈরি হলে: |
| Untracked (??) ══════( git add )══════> Staged (M ) ══════( git commit )══════> Committed |
| ▲                                      │ |
| পুরনো ফাইলে কোড এডিট করলে:                    │                                 (আবার এডিট) |
| Modified ( M)  ══════( git add )══════════════╝ <════════════════════════════════════╝ |
+-----------------------------------------------------------------------------------------------+
\`\`\`

### ৪. মডিফাইড ফাইলস (Modified Files - \` M\`)
* **সংজ্ঞা:** পূর্বে কমিট করা কোনো ফাইলে আপনি যদি নতুন কোনো লাইন যোগ বা পরিবর্তন করেন, কিন্তু এখনো \`git add\` করেননি।
* **টার্মিনাল ডিসপ্লে:** \`git status\` দিলে এটি **লাল রঙে** *"Changes not staged for commit"* সেকশনে দেখাবে।

### ৫. স্টেজড ফাইলস (Staged Files - \`M \`)
* **সংজ্ঞা:** যে ফাইলগুলোকে আপনি \`git add\` কমান্ড দিয়ে প্যাকিং বক্সে (স্টেজিং এরিয়া) সাজিয়ে রেখেছেন।
* **টার্মিনাল ডিসপ্লে:** \`git status\` দিলে এটি **সবুজ রঙে** *"Changes to be committed"* সেকশনে দেখাবে।

### ৬. আনট্র্যাকড ফাইলস (Untracked Files - \`??\`)
* **সংজ্ঞা:** এমন নতুন কোনো ফাইল যা আপনি সদ্য তৈরি করেছেন এবং গিট এর আগে কখনো এই ফাইলটিকে দেখেনি।
* **টার্মিনাল ডিসপ্লে:** \`git status\` দিলে এটি **লাল রঙে** *"Untracked files"* সেকশনে দেখাবে।

---

## পরিবর্তন আনডু ও ক্লিন করার ৩টি প্রধান কমান্ড

কোড লেখার সময় কোনো ভুল হলে তা শুধরে নেওয়ার জন্য গিটের ৩টি বিশেষ কমান্ড রয়েছে:

---

## ৭. \`git restore\` — আধুনিক ও নিরাপদ আনডু কমান্ড

গিট ২.২৩ সংস্করণে \`git restore\` কমান্ডটি আনা হয় পুরোনো জটিল কমান্ডগুলোর বিভ্রান্তি দূর করতে।

### ক্ষেত্র ক: ফাইলকে আনস্টেজ করা (প্যাকিং বাক্স থেকে টেবিলে ফেরত আনা)
ভুলবশত \`git add .\` দিয়ে পাসওয়ার্ড সম্বলিত কনফিগ ফাইল স্টেজিং এরিয়ায় তুলে ফেললে:
\`\`\`bash
# ফাইলটির লোকাল পরিবর্তন অক্ষত রেখে শুধুমাত্র স্টেজিং এরিয়া থেকে সরাতে:
git restore --staged appsettings.json

# সমস্ত স্টেজড ফাইল একসাথে আনস্টেজ করতে:
git restore --staged .
\`\`\`

### ক্ষেত্র খ: ফাইলের ভুল কোড বাতিল করা (সর্বশেষ সেভ করা অবস্থায় ফেরা)
কোনো ফাইলে কোড লিখে যদি দেখেন সব তালগোল পাকিয়ে গেছে এবং সর্বশেষ কমিটের পরিষ্কার কোডে ফিরতে চান:
\`\`\`bash
# ফাইলটির আনকমিটেড সব ভুল কোড মুছে ফেলে শেষ কমিটের অবস্থায় ফিরিয়ে নেবে:
git restore AuthService.cs

# পুরো প্রজেক্টের সমস্ত মডিফাইড ফাইল রিসেট করতে (সতর্কতা: আনকমিটেড কোড চিরতরে মুছে যাবে!):
git restore .
\`\`\`

---

## ৮. \`git reset\` — পুরোনো ঐতিহ্যবাহী আনডু কমান্ড

\`git restore\` আসার আগে ডেভেলপাররা ফাইল আনস্টেজ করতে \`git reset\` ব্যবহার করতেন:
\`\`\`bash
# নির্দিষ্ট ফাইল আনস্টেজ করতে (git restore --staged এর সমতুল্য):
git reset HEAD appsettings.json

# সব ফাইল একসাথে আনস্টেজ করতে:
git reset HEAD
\`\`\`
> **পার্থক্য:** ফাইলের ভুল পরিবর্তন বাতিল বা আনস্টেজের জন্য আধুনিক **\`git restore\`** ব্যবহার করা সবচেয়ে নিরাপদ ও পরিষ্কার পদ্ধতি।

---

## ৯. \`git clean\` — অতিরিক্ত আনট্র্যাকড ফাইল চিরতরে মুছে ফেলা

\`git restore\` শুধুমাত্র গিট ট্র্যাক করা ফাইলের ওপর কাজ করে। কিন্তু আপনি যদি ১০টি অস্থায়ী নোটপ্যাড ফাইল বা লগ ফাইল তৈরি করে থাকেন যা এখনো আনট্র্যাকড (Untracked):

### গোল্ডেন রুল: আগে প্রিভিউ (Dry-run) দেখুন!
\`\`\`bash
# ধাপ ১: প্রিভিউ দেখুন কোনো দরকারি ফাইল ডিলিট হচ্ছে কি না (-n = dry run, -d = directories):
git clean -n -d
# আউটপুট: Would remove temp_notes.txt
# আউটপুট: Would remove test_logs/

# ধাপ ২: নিশ্চিত হলে স্থায়ীভাবে ডিলিট করুন (-f = force, -d = directory):
git clean -f -d

# ধাপ ৩: গিট ইগনোর করা ফাইলসহ (যেমন: bin, obj, node_modules) পুরো ক্লিন করতে:
git clean -f -d -x
\`\`\`

---

## বাস্তব সিদ্ধান্তের কুইক গাইড

| পরিস্থিতি | যে কমান্ডটি চালাবেন |
| :--- | :--- |
| "ভুল করে ফাইলে \`git add\` করেছি, কোড না মুছে শুধু আনস্টেজ করতে চাই।" | \`git restore --staged <file>\` |
| "ফাইলে কিছু কোড লিখেছি যা ভুল, মুছে আগের সেভ করা কোডে ফিরতে চাই।" | \`git restore <file>\` |
| "অপ্রয়োজনীয় আনট্র্যাকড ফাইল ও ফোল্ডার ডিলিট করতে চাই।" | \`git clean -f -d\` |
| "ফাইল কোন অবস্থায় আছে দেখতে চাই।" | \`git status -s\` |
`,
  };
