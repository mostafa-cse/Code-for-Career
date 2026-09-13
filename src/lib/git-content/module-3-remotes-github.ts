import type { LocalLesson } from "@/lib/lessons-data";

export const MODULE_3_LESSONS: LocalLesson[] = [
  {
    slug: "git-remote-repositories",
    titleEn: "Remote Repositories: Remote, Origin, Fetch, Pull, Push & Upstream",
    titleBn: "রিমোট রিপোজিটরি: রিমোট, অরিজিন, ফেচ, পুল, পুশ ও আপস্ট্রিম",
    categoryEn: "7. Remote Repositories",
    categoryBn: "৭. রিমোট রিপোজিটরি ও সিঙ্ক",
    categoryDescEn: "Managing remote aliases, understanding origin, git fetch vs git pull, push operations, tracking branches, and upstream sync.",
    categoryDescBn: "রিমোট অ্যালিয়াস ম্যানেজমেন্ট, অরিজিন বোঝা, git fetch বনাম git pull, পুশ অপারেশন ও আপস্ট্রিম ট্র্যাকিং ব্রাঞ্চ।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master synchronization between your local machine and remote servers using git remote, fetch, pull, push, and tracking branches.",
    descriptionBn: "লোকাল কম্পিউটার ও ক্লাউড সার্ভারের মধ্যে কোড সিঙ্ক করার সমস্ত কমান্ড শিখুন: git remote, fetch, pull, push এবং আপস্ট্রিম ট্র্যাকিং।",
    difficulty: "EASY",
    displayOrder: 7,
    prerequisites: ["git-merging"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Working with Remotes",
        url: "https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes",
        description: "Official guide to remote aliases, fetch, and push.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "What is the precise difference between 'git fetch' and 'git pull'?",
        url: null,
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Git", "Fetch", "Pull", "Remote"],
        solutionEn: "'git fetch' downloads all new commits, branches, and tags from the remote repository to your local object database, but does NOT modify your working directory or current branch. 'git pull' executes 'git fetch' immediately followed by 'git merge' (or 'git rebase' if configured), altering your working files.",
        solutionBn: "'git fetch' রিমোট সার্ভার থেকে সমস্ত নতুন কমিট ও ব্রাঞ্চ ডাউনলোড করে লোকাল অবজেক্ট স্টোরে এনে রাখে, কিন্তু আপনার ফাইলের কোনো পরিবর্তন করে না। আর 'git pull' প্রথমে ফেচ করে এবং সাথে সাথেই আপনার বর্তমান ব্রাঞ্চের সাথে মার্জ বা রিব্যাস সম্পন্ন করে ফাইল পরিবর্তন করে।",
      },
      {
        source: "BD Tech Viva",
        name: "What is 'origin' and 'upstream' in Git terminology?",
        url: null,
        difficulty: "MEDIUM",
        company: "Brain Station 23",
        tags: ["Git", "Origin", "Upstream", "Forks"],
        solutionEn: "'origin' is the default name Git assigns to the remote repository from which you cloned your project. 'upstream' is the standard convention name given to the original parent repository when you work on a personal Fork, used to pull new updates made by the core maintainers.",
        solutionBn: "'origin' হলো ডিফল্ট নাম যা গিট আপনার ক্লোন করা রিমোট রিপোজিটরির লিঙ্ক হিসেবে সেট করে। আর 'upstream' হলো ফোর্ক (Fork) করা প্রজেক্টে মূল প্যারেন্ট রিপোজিটরিকে ট্র্যাক করার বহুল ব্যবহৃত স্ট্যান্ডার্ড নাম, যা থেকে মূল কোডের আপডেট টেনে আনা হয়।",
      },
    ],
    contentEn: `# Remote Repositories: Remote, git remote, origin, fetch vs pull, push, Upstream & Tracking

Git was designed from the ground up to be distributed, but teams still need a central "single source of truth" to coordinate work. That central location is a **Remote Repository**, typically hosted on cloud services like **GitHub**, **GitLab**, or **Bitbucket**.

---

## 1. What is a Remote?

A **Remote** is simply a version of your project hosted on the internet, a corporate server, or another computer on your local network.

### The Cloud Backup & Sync Model:
While your local repository lives on your laptop's hard drive (\`.git\`), a remote repository:
* Acts as a permanent cloud backup (if your laptop breaks, your code is safe).
* Acts as the collaboration hub where teammates push their features and pull your work.
* Serves as the trigger for automated testing and CI/CD pipelines (GitHub Actions).

---

## 2. \`git remote\` — Managing Remote Connections

The \`git remote\` command is your tool for inspecting and configuring connections to remote servers.

\`\`\`bash
# 1. View remote nicknames:
git remote
# Output: origin

# 2. View remote nicknames WITH their actual web/SSH URLs (-v = verbose):
git remote -v
# Output:
# origin  git@github.com:username/my-project.git (fetch)
# origin  git@github.com:username/my-project.git (push)

# 3. Add a brand new remote connection:
git remote add origin git@github.com:username/my-project.git

# 4. Inspect detailed information about a remote (branches, URLs, tracking):
git remote show origin

# 5. Rename a remote connection:
git remote rename origin primary

# 6. Remove a remote connection:
git remote remove primary
\`\`\`

---

## 3. What is 'origin'?

Many beginners think \`origin\` is a special Git command or keyword. **It is not!**

### \`origin\` is simply a nickname (alias)
* When you run \`git clone <url>\`, Git automatically configures that URL as a remote.
* Instead of forcing you to type the long URL \`https://github.com/company/super-long-repo-name.git\` every time you push or pull, Git gives it the default nickname **\`origin\`**.
* You could technically rename it to \`github\`, \`server\`, or \`central\`, but \`origin\` is the universal global convention that all software engineers use.

---

## 4. \`git fetch\` — Safe Inspection Without Modification

\`git fetch\` contacts the remote repository and **downloads all new commits, branches, and tags** into your local \`.git\` database, **WITHOUT touching your working directory files or altering your active branch**.

\`\`\`
Remote (GitHub) ════( git fetch )════> Local .git Database (origin/main)
                                        (Your actual files do NOT change!)
\`\`\`

### Why use \`git fetch\`?
It is the safest way to check what your colleagues have pushed before deciding whether to merge it into your work:

\`\`\`bash
# 1. Download all remote changes:
git fetch origin

# 2. Inspect what commits arrived without modifying your code:
git log HEAD..origin/main --oneline

# 3. See the exact code diff before merging:
git diff HEAD origin/main

# 4. Merge only when you are confident it won't break your code:
git merge origin/main
\`\`\`

---

## 5. \`git pull\` — Download and Integrate in One Step

\`git pull\` is essentially a shortcut that runs two commands back-to-back:
$$\\text{git pull} = \\text{git fetch} + \\text{git merge}$$

\`\`\`
1. Fetch: Downloads new commits from remote to 'origin/main'.
2. Merge: Merges 'origin/main' directly into your current local branch.
\`\`\`

### Common Usage:
\`\`\`bash
# Standard pull (fetch + merge):
git pull origin main

# Professional Best Practice: Pull with Rebase (--rebase):
# Pulls remote commits and puts your local unpushed commits on TOP of them,
# preventing ugly, unnecessary merge commits in your history graph!
git pull --rebase origin main
\`\`\`

---

## 6. \`git push\` — Uploading Commits to the Cloud

\`git push\` takes the commits you have sealed into your local repository and uploads them to the remote server.

\`\`\`bash
# 1. Push a newly created branch for the first time (-u = --set-upstream):
git push -u origin feature/user-profile

# 2. Subsequent pushes on this branch (once tracking is set):
git push

# 3. Push a specific tag:
git push origin v1.0.0

# 4. Safe Force-Push (When rebasing a private branch):
# Checks that nobody else pushed to the branch before overwriting:
git push --force-with-lease
\`\`\`

> [!CAUTION]
> Never use naked \`git push --force\` on shared public branches like \`main\`! It permanently erases your teammates' commits from the server. Always use \`--force-with-lease\` on private feature branches only.

---

## 7. What is 'Upstream'?

In Git terminology, **Upstream** has two related meanings:

### Meaning A: The Forking Workflow (Open Source & Enterprise)
When you contribute to an open-source project or work across organizational boundaries:
1. You **Fork** the original repository to your own GitHub account.
2. Your fork is your **\`origin\`** (where you push your work).
3. The original parent project is called **\`upstream\`** (where the core maintainers work).

\`\`\`
Original Project Repository  [upstream]
          │
          │ (Fork on GitHub)
          ▼
Your Personal GitHub Copy    [origin]
          │
          │ (git clone)
          ▼
Your Local Laptop Workspace  [local]
\`\`\`

To keep your local project updated with the core maintainers' latest changes:
\`\`\`bash
# 1. Add upstream remote:
git remote add upstream https://github.com/original-creator/project.git

# 2. Fetch latest changes from upstream:
git fetch upstream

# 3. Merge upstream changes into your local main:
git switch main
git merge upstream/main
\`\`\`

---

## 8. Tracking Branches

A **Tracking Branch** (or Upstream Branch) is a local branch that has a direct, dedicated relationship with a remote branch.

### The "Ahead" and "Behind" Magic:
When a local branch tracks a remote branch (e.g., local \`main\` tracks \`origin/main\`), Git can tell you your exact sync status when you run \`git status\`:

\`\`\`
# On branch main
# Your branch is ahead of 'origin/main' by 2 commits.  <-- You need to 'git push'!
# (or: Your branch is behind 'origin/main' by 3 commits. <-- You need to 'git pull'!)
\`\`\`

### How to set up tracking:
\`\`\`bash
# Option 1: When pushing a branch for the first time:
git push -u origin feature/login    # (-u sets upstream tracking)

# Option 2: Set tracking on an existing branch manually:
git branch --set-upstream-to=origin/feature/login feature/login

# Option 3: View all tracking relationships across your repo:
git branch -vv
# Output:
# * main                  7a1b2c4 [origin/main] feat: add user dashboard
#   feature/order-api     3e4f5a6 [origin/feature/order-api: ahead 1] WIP order
\`\`\`

---

## Quick Reference Summary

| Command | What it does | Safe for working files? |
| :--- | :--- | :--- |
| \`git remote -v\` | Lists remote nicknames & URLs | 🟢 Read-only |
| \`git fetch origin\` | Downloads remote commits to local database | 🟢 100% Safe (files untouched) |
| \`git pull origin main\` | Downloads AND merges into working files | 🟡 May cause merge conflicts |
| \`git push -u origin <branch>\` | Uploads commits & sets tracking | 🟢 Uploads local work |
| \`git push --force-with-lease\` | Safely updates rewritten remote history | 🟡 Use on private branches only |
`,
    contentBn: `# রিমোট রিপোজিটরি: রিমোট, git remote, origin, ফেচ বনাম পুল, পুশ, আপস্ট্রিম ও ট্র্যাকিং

গিট মূলত ডিস্ট্রিবিউটেড হলেও পুরো টিমকে একসাথে সমন্বিতভাবে কাজ করতে একটি কেন্দ্রীয় ভরকেন্দ্রের প্রয়োজন হয়। সেই কেন্দ্রীয় স্থানটিই হলো **Remote Repository (রিমোট রিপোজিটরি)**, যা সাধারণত **GitHub**, **GitLab**, বা **Bitbucket**-এ ক্লাউডে সংরক্ষিত থাকে।

নিচে রিমোট রিপোজিটরির ৮টি সাব-সেকশন সহজ ভাষায় বিস্তারিত আলোচনা করা হলো:

---

## ১. রিমোট (Remote) কী?

রিমোট হলো ইন্টারনেটে বা কোনো সেন্ট্রাল সার্ভারে হোস্ট করা আপনার প্রজেক্টের একটি অনলাইন ভার্সন।

### ক্লাউড ব্যাকআপ ও কোলাবোরেশন:
* আপনার ল্যাপটপ নষ্ট বা চুরি হলেও রিমোটের কারণে আপনার কোড সুরক্ষিত থাকে।
* টিমের সবাই তাদের কোড রিমোটে আপলোড করে এবং একে অপরের কোড নামিয়ে নেয়।
* এটি অটোমেটেড টেস্টিং এবং সিআই/সিডি (CI/CD) পাইপলাইনের মূল কেন্দ্র।

---

## ২. \`git remote\` — রিমোট কানেকশন পরিচালনা

\`git remote\` কমান্ড দিয়ে ক্লাউড সার্ভারের সাথে আপনার লোকাল প্রজেক্টের লিংক দেখা ও নিয়ন্ত্রণ করা হয়।

\`\`\`bash
# ১. রিমোটের ডাকনাম দেখতে:
git remote
# আউটপুট: origin

# ২. রিমোটের ডাকনামের সাথে মূল ওয়েব/SSH লিঙ্ক দেখতে (-v = verbose):
git remote -v
# আউটপুট:
# origin  git@github.com:username/my-project.git (fetch)
# origin  git@github.com:username/my-project.git (push)

# ৩. একদম নতুন কোনো রিমোট লিঙ্ক যোগ করতে:
git remote add origin git@github.com:username/my-project.git

# ৪. রিমোটের বিস্তারিত স্বাস্থ্য ও ব্রাঞ্চ ট্র্যাকিং দেখতে:
git remote show origin

# ৫. রিমোটের নাম পরিবর্তন করতে:
git remote rename origin my-github

# ৬. রিমোট মুছে ফেলতে:
git remote remove my-github
\`\`\`

---

## ৩. 'origin' কী?

অনেকে মনে করেন \`origin\` হলো গিটের কোনো বিশেষ কমান্ড বা কিওয়ার্ড। **আসলে তা নয়!**

### \`origin\` হলো কেবল একটি ডাকনাম (Alias):
* যখন আপনি কোনো প্রজেক্ট \`git clone <url>\` করেন, গিট স্বয়ংক্রিয়ভাবে ওই বিশাল ইউআরএল-এর একটি সংক্ষিপ্ত ডাকনাম দেয়: **\`origin\`**।
* যাতে প্রতিবার পুশ বা পুল করার সময় আপনাকে এত বড় ইউআরএল টাইপ করতে না হয়, সেজন্য গিট এই শর্টকাট নাম ব্যবহার করে।
* আপনি চাইলে এটিকে \`my-server\` বা অন্য যেকোনো নাম দিতে পারেন, তবে বৈশ্বিকভাবে সব ডেভেলপার \`origin\` ডাকনামটিই ব্যবহার করেন।

---

## ৪. \`git fetch\` — নিরাপদ ডাউনলোড (ফাইল পরিবর্তন ছাড়া)

\`git fetch\` রিমোট গিটহাব সার্ভারের সাথে যোগাযোগ করে **সমস্ত নতুন কমিট ও ব্রাঞ্চ ডাউনলোড করে লোকাল \`.git\` ডেটাবেজে এনে রাখে**, কিন্তু **আপনার কম্পিউটারের ফাইলগুলোতে কোনো স্পর্শ করে না**।

\`\`\`
রিমোট (গিটহাব) ════( git fetch )════> লোকাল .git ডেটাবেজ (origin/main)
                                      (আপনার ফাইলের কোনো পরিবর্তন হয় না!)
\`\`\`

### কেন \`git fetch\` ব্যবহার করবেন?
এটি সবচেয়ে নিরাপদ পদ্ধতি। সহকর্মীরা কী কী নতুন কোড পুশ করেছে তা নিজের কোড নষ্ট না করে আগেভাগে দেখে নেওয়া যায়:

\`\`\`bash
# ১. রিমোটের সব আপডেট ডাউনলোড করুন:
git fetch origin

# ২. আপনার কোড না বদলে দেখুন কী কী নতুন কমিট এসেছে:
git log HEAD..origin/main --oneline

# ৩. কোডের লাইন বাই লাইন পার্থক্য দেখে নিশ্চিত হোন:
git diff HEAD origin/main

# ৪. সব ঠিক থাকলে এবার মূল কোডে মার্জ করুন:
git merge origin/main
\`\`\`

---

## ৫. \`git pull\` — ডাউনলোড ও মার্জ একসাথে

\`git pull\` হলো মূলত দুটি কমান্ডের যৌথ শর্টকাট:
$$\\text{git pull} = \\text{git fetch} + \\text{git merge}$$

\`\`\`
১. ফেচ (Fetch): রিমোট থেকে নতুন কোড লোকাল অবজেক্টে আনে।
২. মার্জ (Merge): সেই নতুন কোড আপনার বর্তমান ব্রাঞ্চের ফাইলে সরাসরি মার্জ করে দেয়।
\`\`\`

### ব্যবহারের নিয়ম:
\`\`\`bash
# সাধারণ পুল (fetch + merge):
git pull origin main

# প্রফেশনাল বেস্ট প্র্যাকটিস: Pull with Rebase (--rebase):
# অপ্রয়োজনীয় মার্জ কমিট এড়িয়ে হিস্ট্রি সোজা রাখার জন্য:
git pull --rebase origin main
\`\`\`

---

## ৬. \`git push\` — লোকাল কোড ক্লাউডে পাঠানো

আপনার কম্পিউটারের লোকাল রিপোজিটরিতে সেভ করা কমিটগুলোকে ইন্টারনেটে গিটহাবে আপলোড করতে \`git push\` ব্যবহার করা হয়।

\`\`\`bash
# ১. নতুন তৈরি করা ব্রাঞ্চ প্রথমবার পুশ করতে (-u = --set-upstream):
git push -u origin feature/user-profile

# ২. পরবর্তীতে ওই ব্রাঞ্চে শুধুমাত্র এই কমান্ড দিলেই চলে:
git push

# ৩. কোনো নির্দিষ্ট ট্যাগ গিটহাবে পুশ করতে:
git push origin v1.0.0

# ৪. নিরাপদ ফোর্স পুশ (রিব্যাসের পর):
git push --force-with-lease
\`\`\`

> [!CAUTION]
> শেয়ার্ড বা পাবলিক ব্রাঞ্চে (যেমন \`main\`) কখনো সাধারণ \`git push --force\` চালাবেন না! এতে সহকর্মীদের কোড সার্ভার থেকে চিরতরে মুছে যেতে পারে। নিজের ব্যক্তিগত ফিচার ব্রাঞ্চে সর্বদা \`--force-with-lease\` ব্যবহার করবেন।

---

## ৭. আপস্ট্রিম (Upstream) কী?

গিট পরিভাষায় **Upstream** মূলত দুটি ক্ষেত্রে ব্যবহৃত হয়:

### ওপেন সোর্স ও ফোর্কিং মডেল (Forking):
যখন আপনি কোনো বিখ্যাত ওপেন-সোর্স প্রজেক্টে অবদান রাখতে চান:
1. আপনি গিটহাবে প্রজেক্টটিকে **Fork** করে নিজের অ্যাকাউন্টে নেন।
2. আপনার অ্যাকাউন্টের কপিটি হলো আপনার **\`origin\`** (যেখানে আপনার লেখার অনুমতি আছে)।
3. মূল মূল প্রজেক্টটি (যাঁর প্রজেক্ট আপনি ফোর্ক করেছেন) হলো **\`upstream\`**।

\`\`\`
মূল ওপেন সোর্স প্রজেক্ট   [upstream]
          │
          │ (গিটহাবে ফোর্ক)
          ▼
আপনার ব্যক্তিগত গিটহাব    [origin]
          │
          │ (git clone)
          ▼
আপনার ল্যাপটপ            [local]
\`\`\`

মূল প্রজেক্টের নিত্যনতুন আপডেট নিজের ল্যাপটপে টেনে আনার নিয়ম:
\`\`\`bash
# ১. আপস্ট্রিম লিঙ্ক যুক্ত করুন:
git remote add upstream https://github.com/original-author/project.git

# ২. মূল প্রজেক্ট থেকে আপডেট ফেচ করুন:
git fetch upstream

# ৩. মূল প্রজেক্টের কোড নিজের main-এ মার্জ করুন:
git switch main
git merge upstream/main
\`\`\`

---

## ৮. ট্র্যাকিং ব্রাঞ্চ (Tracking Branches)

একটি লোকাল ব্রাঞ্চ যখন সরাসরি একটি নির্দিষ্ট রিমোট ব্রাঞ্চের সাথে যুক্ত থাকে, তখন তাকে **Tracking Branch** বলা হয় (যেমন লোকাল \`main\` ট্র্যাক করে \`origin/main\`-কে)।

### 'Ahead' এবং 'Behind' ম্যাজিক:
ট্র্যাকিং সেট করা থাকলে \`git status\` চালালেই গিট চমৎকারভাবে জানিয়ে দেয়:
\`\`\`
# On branch main
# Your branch is ahead of 'origin/main' by 2 commits.  <-- আপনি ২টি কমিট এগিয়ে আছেন (git push করতে হবে)
# (অথবা: Your branch is behind by 3 commits.           <-- আপনি ৩টি কমিট পিছিয়ে আছেন (git pull করতে হবে))
\`\`\`

### কীভাবে ট্র্যাকিং সেট করবেন?
\`\`\`bash
# প্রথমবার পুশ করার সময় -u দিলে অটোমেটিক ট্র্যাকিং সেট হয়ে যায়:
git push -u origin feature/login

# সমস্ত লোকাল ব্রাঞ্চের ট্র্যাকিং স্ট্যাটাস দেখতে:
git branch -vv
# আউটপুট:
# * main               7a1b2c4 [origin/main] feat: landing page
#   feature/order-api  3e4f5a6 [origin/feature/order-api: ahead 1] WIP
\`\`\`
`,
  },
  {
    slug: "github-basics",
    titleEn: "GitHub Basics: Repositories, README, .gitignore, License & Profile",
    titleBn: "গিটহাব বেসিকস: রিপোজিটরি, README, .gitignore, লাইসেন্স ও প্রোফাইল",
    categoryEn: "8. GitHub Ecosystem Basics",
    categoryBn: "৮. গিটহাব ইকোসিস্টেম ও প্রজেক্ট প্রেজেন্টেশন",
    categoryDescEn: "Creating public/private repos, README architecture, .gitignore templates, open-source licenses, and building a stellar GitHub profile.",
    categoryDescBn: "পাবলিক/প্রাইভেট রিপোজিটরি, প্রফেশনাল README গঠন, .gitignore ফাইল, লাইসেন্স নির্বাচন এবং আকর্ষণীয় গিটহাব প্রোফাইল তৈরি।",
    categoryPriority: "CORE",
    descriptionEn: "Learn how to present software engineering projects professionally on GitHub using READMEs, proper gitignore rules, and licenses.",
    descriptionBn: "গিটহাবে প্রজেক্ট প্রফেশনালভাবে প্রদর্শন করতে README, gitignore ও লাইসেন্সের সঠিক ব্যবহার এবং আকর্ষণীয় প্রোফাইল তৈরি শিখুন।",
    difficulty: "EASY",
    displayOrder: 8,
    prerequisites: ["git-remote-repositories"],
    estimatedMinutes: 20,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "About READMEs",
        url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
        description: "Official guide on writing compelling markdown project documentation.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "What essential sections must a production-grade README.md have in a technical job interview portfolio?",
        url: null,
        difficulty: "EASY",
        company: "Therap (BD) Ltd",
        tags: ["GitHub", "README", "Portfolio", "Best Practices"],
        solutionEn: "1. Project Title & elevator pitch. 2. System Architecture / Tech Stack badges. 3. Prerequisites & Environment Setup (.NET, Docker, Postgres). 4. Step-by-step installation commands. 5. API Endpoints / Documentation table. 6. Database ERD / Architecture diagrams. 7. Test execution instructions. 8. License.",
        solutionBn: "১. প্রজেক্টের নাম ও ১ লাইনের ভূমিকা। ২. টেক স্ট্যাক ও আর্কিটেকচার ডায়াগ্রাম। ৩. এনভায়রনমেন্ট প্রয়োজনীয়তা (.NET SDK, PostgreSQL ইত্যাদি)। ৪. ধাপে ধাপে প্রজেক্ট রান করার কমান্ড। ৫. API এন্ডপয়েন্ট ও ডকার সেটআপ গাইড। ৬. ইউনিট টেস্ট চালানোর নির্দেশিকা। ৭. ওপেন সোর্স লাইসেন্স।",
      },
    ],
    contentEn: `# GitHub Basics: Repositories, README, .gitignore, License & Profile

Your GitHub account is your living engineering resume. Companies in Bangladesh and abroad evaluate candidates by their GitHub repositories.

---

## 1. Creating a Repository & Visibility
* **Public Repository**: Visible to anyone worldwide. Ideal for portfolio projects, open-source libraries, and technical interview demonstrations.
* **Private Repository**: Visible only to you and explicitly invited collaborators. Used for proprietary commercial code or confidential freelance work.

---

## 2. Anatomy of a Production-Ready \`README.md\`

Never leave a GitHub repository with an empty README. Follow this standard structure:

\`\`\`markdown
# Distributed E-Commerce Microservices

A high-throughput e-commerce platform built with ASP.NET Core 9, PostgreSQL, and RabbitMQ.

## Architecture Highlights
* Clean Architecture with CQRS pattern (MediatR)
* Outbox pattern for reliable event publishing
* Redis caching for catalog read performance

## Getting Started
\`\`\`bash
git clone git@github.com:username/ecommerce.git
cd ecommerce
docker-compose up -d
dotnet run --project src/Api
\`\`\`

## API Reference
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| \`/api/v1/orders\` | POST | Places a new order |
| \`/api/v1/orders/{id}\` | GET | Fetches order details |
\`\`\`

---

## 3. The Role of \`.gitignore\` and Open-Source \`LICENSE\`

### \`.gitignore\`
Prevents committing build binaries (\`bin/\`, \`obj/\`), dependencies (\`node_modules/\`), and local credentials (\`.env.local\`). Always generate a language-specific template when creating your repo.

### Open-Source Licenses
* **MIT License**: Extremely permissive. Anyone can use, modify, and distribute your code commercially without liability.
* **Apache 2.0**: Permissive like MIT, but provides explicit grant of patent rights and trademark protections.
* **GNU GPLv3**: Copyleft. Any derivative work must also be made fully open-source under GPLv3.

---

## 4. Special GitHub Profile README
Create a public repository named **exactly the same as your GitHub username** (e.g. \`github.com/mostafakamal/mostafakamal\`). Whatever you write in its \`README.md\` will be displayed at the very top of your global GitHub public profile!
`,
    contentBn: `# গিটহাব বেসিকস: রিপোজিটরি, README, .gitignore, লাইসেন্স ও প্রোফাইল

গিটহাব হলো সফটওয়্যার ইঞ্জিনিয়ারের ডিজিটাল জীবনবৃত্তান্ত (Resume)। যেকোনো ইন্টারভিউ বোর্ডে আপনার কোডিং মান যাচাই করতে রিক্রুটাররা আপনার গিটহাব ভিজিট করেন।

---

## ১. প্রফেশনাল \`README.md\` এর গুরুত্ব
একটি ফাঁকা বা দুর্বল README যুক্ত রিপোজিটরি ভালো কোড সত্ত্বেও নেতিবাচক প্রভাব ফেলে। একটি সুন্দর README ফাইলে প্রজেক্টের আর্কিটেকচার ডায়াগ্রাম, ফিচার তালিকা, লোকাল মেশিনে রান করার কমান্ড এবং টেস্ট চালানোর নির্দেশিকা থাকা বাঞ্ছনীয়।

---

## ২. \`.gitignore\` ও \`LICENSE\`
* **\`.gitignore\`**: ভুলবশত যাতে \`bin/\`, \`obj/\`, \`node_modules/\` বা গোপন \`.env\` ফাইল গিটহাবে পুশ না হয় তা নিশ্চিত করে।
* **MIT License**: সবচেয়ে জনপ্রিয় ওপেন সোর্স লাইসেন্স যা যেকাউকে আপনার প্রজেক্টের কোড ব্যবহার ও সংশোধন করার অনুমতি দেয়।

---

## ৩. গিটহাব স্পেশাল প্রোফাইল README
আপনার গিটহাব ইউজারনেমের হুবহু একই নামে (যেমন \`username/username\`) একটি পাবলিক রিপোজিটরি খুললে, তার \`README.md\` ফাইলটি আপনার মূল গিটহাব প্রোফাইলের ব্যানারে সুন্দরভাবে প্রদর্শিত হয়।
`,
  },
  {
    slug: "git-pull-requests",
    titleEn: "Pull Requests: Creation, Review Comments, Approvals & Merge Types",
    titleBn: "পুল রিকোয়েস্ট: পিআর তৈরি, কোড রিভিউ, অ্যাপ্রুভাল ও মার্জ স্ট্র্যাটেজি",
    categoryEn: "9. Pull Requests & Code Review",
    categoryBn: "৯. পুল রিকোয়েস্ট ও কোড রিভিউ কালচার",
    categoryDescEn: "Anatomy of a PR, writing PR descriptions, inline review comments, review states, and merge strategies (Merge Commit vs Squash vs Rebase).",
    categoryDescBn: "পিআর এর গঠন, ডেসক্রিপশন লেখার নিয়ম, ইনলাইন কোড রিভিউ, অ্যাপ্রুভাল পদ্ধতি এবং স্কোয়াশ বনাম মার্জ স্ট্র্যাটেজি।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the pull request workflow that defines professional team engineering: code reviews, actionable feedback, and merge strategies.",
    descriptionBn: "প্রফেশনাল টিম ইঞ্জিনিয়ারিংয়ের সবচেয়ে গুরুত্বপূর্ণ পুল রিকোয়েস্ট ওয়ার্কফ্লো, গঠনমূলক কোড রিভিউ এবং মার্জ স্ট্র্যাটেজি শিখুন।",
    difficulty: "MEDIUM",
    displayOrder: 9,
    prerequisites: ["github-basics"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "About Pull Requests",
        url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests",
        description: "Official GitHub guide on pull requests and review workflows.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "Compare GitHub's 3 Merge options: 'Create a merge commit', 'Squash and merge', and 'Rebase and merge'",
        url: null,
        difficulty: "MEDIUM",
        company: "Samsung R&D (SRBD)",
        tags: ["GitHub", "Pull Request", "Squash and Merge", "Merge Commit"],
        solutionEn: "1. 'Create a merge commit': Preserves every single intermediate commit on the feature branch and creates a 3-way merge commit on main. 2. 'Squash and merge': Condenses all commits from the feature branch into a single clean commit on main, discarding branch noise. 3. 'Rebase and merge': Replays all commits individually onto main with new commit hashes, creating a linear history without a merge commit.",
        solutionBn: "১. 'Create a merge commit': ফিচার ব্রাঞ্চের সব ছোটখাটো কমিট অক্ষত রেখে একটি মার্জ কমিট তৈরি করে। ২. 'Squash and merge': ফিচার ব্রাঞ্চের বিশৃঙ্খল ২০টি কমিটকে একটি সুন্দর সিঙ্গেল কমিট হিসেবে মূল ট্রাঙ্কে যুক্ত করে (ইন্ডাস্ট্রিতে বহুল ব্যবহৃত)। ৩. 'Rebase and merge': কোনো মার্জ কমিট ছাড়াই সব কমিটকে লিনিয়ারলি মেইনে যুক্ত করে।",
      },
    ],
    contentEn: `# Pull Requests: Creation, Review Comments, Approvals & Merge Types

In professional software development, **no engineer pushes directly to the \`main\` branch**. Every feature, bug fix, or dependency update goes through a **Pull Request (PR)**.

---

## 1. What is a Pull Request?

A Pull Request is a formal proposal to merge code from a feature branch into a base branch (e.g., merging \`feature/auth\` into \`main\`). It allows teammates to inspect the exact diffs, test builds, and suggest improvements before code reaches production.

---

## 2. Writing a Great PR Description

Always follow a clean template in your PRs:

\`\`\`markdown
### Summary of Changes
Implemented JWT token-based authentication and refresh token rotation.

### Motivation / Ticket
Fixes #42. Resolves security finding where sessions did not expire properly.

### How to Test
1. Run \`dotnet test tests/AuthTests\`
2. Send POST to \`/api/v1/auth/login\` with test credentials
3. Verify JWT returned contains valid 15-minute claims

### Checklist
- [x] Unit tests added & passing
- [x] No secrets or API keys committed
- [x] Documentation updated
\`\`\`

---

## 3. The Code Review Process

As a reviewer on GitHub:
* **Inline Comments**: Click on any line number in the "Files changed" tab to leave suggestions or request clarification.
* **Suggestion Blocks**: Use GitHub's markdown suggestion feature (\`\`\`suggestion\`) so the PR author can apply your change with one click.
* **Review Decisions**:
  * **Comment**: Submit general feedback without explicit approval.
  * **Approve**: The code looks great and is ready to merge.
  * **Request Changes**: Critical bugs or architectural flaws must be addressed before merging.

---

## 4. The 3 GitHub Merge Strategies

| Merge Strategy | Resulting Commit on \`main\` | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Create a Merge Commit** | Preserves all branch commits + 1 Merge Commit | Full granular history preserved | Can make git log cluttered |
| **Squash and Merge** | Exactly **1 clean commit** on \`main\` | Ultra-clean, atomic linear trunk history | Loses individual micro-commit steps |
| **Rebase and Merge** | Commits replayed linearly without merge commit | Clean linear graph | Cannot distinguish where branch started |
`,
    contentBn: `# পুল রিকোয়েস্ট: পিআর তৈরি, কোড রিভিউ, অ্যাপ্রুভাল ও মার্জ স্ট্র্যাটেজি

প্রফেশনাল কোম্পানিতে কোনো ডেভেলপার সরাসরি \`main\` ব্রাঞ্চে কোড পুশ করতে পারেন না। প্রতিটি কাজ **পুল রিকোয়েস্ট (PR)** এর মাধ্যমে কোড রিভিউ পার হয়ে প্রোডাকশনে যায়।

---

## ১. পুল রিকোয়েস্ট কী?
একটি ফিচার ব্রাঞ্চের কোডকে টেস্ট ও রিভিউ শেষে মূল ব্রাঞ্চে সংযুক্ত করার আনুষ্ঠানিক আবেদনই হলো পুল রিকোয়েস্ট।

---

## ২. কোড রিভিউ ও ফিডব্যাক
* সহকর্মীর কোডের নির্দিষ্ট লাইনে ক্লিক করে ইনলাইন মন্তব্য করা যায়।
* **Approve**: কোড সঠিক আছে এবং মার্জের জন্য প্রস্তুত।
* **Request Changes**: কোনো বাগ বা দুর্বলতা থাকলে তা সংশোধন না করা পর্যন্ত মার্জ আটকানো।

---

## ৩. গিটহাবে মার্জ করার ৩টি উপায়
১. **Create a Merge Commit**: সমস্ত কমিট অক্ষত রেখে একটি মার্জ কমিট তৈরি করে।
২. **Squash and Merge**: সবচেয়ে জনপ্রিয়। ফিচার ব্রাঞ্চের এলোমেলো ১০-১২টি কমিটকে একটি মাত্র পরিচ্ছন্ন কমিটে রূপান্তর করে মেইনে যুক্ত করে।
৩. **Rebase and Merge**: লিনিয়ার হিস্ট্রি বজায় রেখে কোনো মার্জ কমিট ছাড়াই কোড যুক্ত করে।
`,
  },
  {
    slug: "git-collaboration",
    titleEn: "Collaboration: Fork, Clone, Branch, PR, Issues & Team Workflows",
    titleBn: "টিম কোলাবোরেশন: ফোর্ক, ক্লোন, ব্রাঞ্চ, পিআর, ইস্যু ও টিম ওয়ার্কফ্লো",
    categoryEn: "10. Team Collaboration Models",
    categoryBn: "১০. টিম কোলাবোরেশন ও ওপেন সোর্স মডেল",
    categoryDescEn: "Forking workflow, open-source contributions, synchronized upstreams, GitHub Issues, Discussions, and trunk-based development.",
    categoryDescBn: "ফোর্কিং ওয়ার্কফ্লো, ওপেন সোর্স অবদান, আপস্ট্রিম সিঙ্ক, গিটহাব ইস্যু, ডিসকাশন এবং ট্রাঙ্ক-বেসড ডেভেলপমেন্ট মডেল।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master open-source contribution and corporate team workflows: Forking, Branching, Issues, Discussions, and Trunk-Based Development.",
    descriptionBn: "ওপেন সোর্স এবং কর্পোরেট সফটওয়্যার টিমের কাজের পূর্ণাঙ্গ ওয়ার্কফ্লো শিখুন: ফোর্কিং, ব্রাঞ্চিং, ইস্যু ট্র্যাকিং ও ট্রাঙ্ক-বেসড ডেভেলপমেন্ট।",
    difficulty: "MEDIUM",
    displayOrder: 10,
    prerequisites: ["git-pull-requests"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "Collaborating with Issues and Pull Requests",
        url: "https://docs.github.com/en/issues",
        description: "Official guide on team collaboration with issues and milestones.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "Explain the complete Forking Workflow used in large open-source projects",
        url: null,
        difficulty: "MEDIUM",
        company: "BJIT Group",
        tags: ["Git", "Forking", "Open Source", "Workflow"],
        solutionEn: "1. Fork the upstream repository to your personal GitHub account. 2. Clone your fork locally ('origin'). 3. Add original repo as 'upstream' (git remote add upstream <url>). 4. Create a feature branch. 5. Code, commit, and push to your fork. 6. Open a PR from your fork's branch to upstream's main. 7. Sync new upstream changes via 'git fetch upstream && git merge upstream/main'.",
        solutionBn: "১. মূল রিপোজিটরির একটি পার্সোনাল কপি তৈরি করতে GitHub এ 'Fork' করা। ২. নিজের ফোর্কটি মেশিনে ক্লোন করা (origin)। ৩. মূল রিপোজিটরিকে 'upstream' হিসেবে যুক্ত করা। ৪. নতুন ফিচার ব্রাঞ্চ তৈরি করে কাজ করা। ৫. নিজের ফোর্কে পুশ করা। ৬. মূল রিপোজিটরির মেইন ব্রাঞ্চের উদ্দেশ্যে Pull Request তৈরি করা। ৭. মূল রিপোজিটরি আপডেট হলে 'git fetch upstream' দিয়ে নিজের লোকাল কোড সিঙ্ক রাখা।",
      },
    ],
    contentEn: `# Collaboration: Fork, Clone, Branch, PR, Issues & Team Workflows

Whether you are contributing to a massive global open-source project or building microservices with 10 teammates at a Dhaka tech firm, you will rely on the **Forking & Feature Branch Workflow**.

---

## 1. The Forking Workflow (Open Source & Enterprise)

\`\`\`
[Upstream Public Repo] <====== (Pull Request) <====== [Your Personal Fork on GitHub]
        |                                                        ^
   (git fetch)                                               (git push)
        |                                                        |
        +=========> [Your Local Machine Clone] ==================+
                     - branch: feature/export-csv
\`\`\`

### Step-by-Step Open Source Flow:
\`\`\`bash
# 1. Clone your personal fork
git clone git@github.com:my-username/aspnetcore.git
cd aspnetcore

# 2. Configure the original repository as 'upstream'
git remote add upstream git@github.com:dotnet/aspnetcore.git
git remote -v

# 3. Create a clean feature branch off updated upstream main
git fetch upstream
git switch -c fix/http-client-timeout upstream/main

# 4. Write code, test, and commit
git commit -m "fix(http): resolve socket exhaustion on aggressive retry"

# 5. Push to YOUR personal fork
git push -u origin fix/http-client-timeout

# 6. Go to GitHub and click "Compare & pull request" to upstream!
\`\`\`

---

## 2. GitHub Issues & Discussions

* **Issues**: Track specific bugs, actionable tasks, or feature requests. Can be assigned to developers, categorized with labels (\`bug\`, \`enhancement\`), and attached to Milestones.
* **Discussions**: An open forum for brainstorming, Q&A, and RFCs (Request for Comments) that do not represent actionable tasks yet.

### Automatic Issue Closing via Commits
When your PR is merged, you can automatically close associated issues by including keywords in the commit message or PR description:
\`\`\`
Closes #105
Fixes #42
Resolves #89
\`\`\`

---

## 3. Trunk-Based Development vs Git Flow

| Workflow | Branch Lifespan | Release Frequency | Best Suited For |
| :--- | :--- | :--- | :--- |
| **Git Flow** | Long-lived (\`develop\`, \`release\`, \`hotfix\`) | Monthly / Quarterly | Traditional enterprise waterfall |
| **Trunk-Based Development** | Very short-lived (< 1–2 days) | Multiple times per day (CI/CD) | Modern Agile, SaaS, high-performing teams |
`,
    contentBn: `# টিম কোলাবোরেশন: ফোর্ক, ক্লোন, ব্রাঞ্চ, পিআর, ইস্যু ও টিম ওয়ার্কফ্লো

আন্তর্জাতিক ওপেন-সোর্স প্রজেক্ট বা দেশীয় সফটওয়্যার কোম্পানিতে কাজ করতে ফোর্কিং ও টিম কোলাবোরেশন মডেল অপরিহার্য।

---

## ১. ওপেন সোর্স ফোর্কিং ওয়ার্কফ্লো
১. মূল প্রজেক্টে ঢুকে গিটহাবের **Fork** বাটনে চাপ দিয়ে নিজের অ্যাকাউন্টে কপি তৈরি করুন।
২. নিজের ফোর্কটি কম্পিউটারে ক্লোন করুন।
৩. \`git remote add upstream <মূল-ইউআরএল>\` কমান্ড দিয়ে মূল প্রজেক্টকে ট্র্যাক করুন।
৪. নতুন ফিচার ব্রাঞ্চ খুলে কাজ করুন এবং নিজের ফোর্কে পুশ করুন।
৫. মূল প্রজেক্টে Pull Request ওপেন করুন।

---

## ২. গিটহাব ইস্যু ও অটো-ক্লোজ
যেকোনো বাগ বা ফিচারের ট্র্যাকিং হয় গিটহাব ইস্যুর মাধ্যমে। পিআর এর ডেসক্রিপশনে \`Fixes #42\` বা \`Closes #105\` লিখলে পিআর মার্জ হওয়ার সাথে সাথে অটোমেটিক্যালি ইস্যুটি ক্লোজ হয়ে যায়।

---

## ৩. ট্রাঙ্ক-বেসড ডেভেলপমেন্ট
আধুনিক হাই-পারফর্মিং টিমগুলোতে দীর্ঘস্থায়ী ব্রাঞ্চ না রেখে ছোট ছোট ফিচার ব্রাঞ্চ (১-২ দিনের কাজ) সরাসরি \`main\` ব্রাঞ্চে প্রতিদিন মার্জ করা হয়, যাতে বড় ধরনের মার্জ কনফ্লিক্ট তৈরি না হয়।
`,
  },
];
