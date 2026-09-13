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

Your GitHub account is your living engineering portfolio. Tech recruiters and engineering managers evaluate candidates not just by their resume claims, but by the quality, structure, and presentation of their GitHub repositories.

Here is the complete breakdown of the 8 core GitHub foundational concepts:

---

## 1. Creating a Repository

A repository (repo) is a digital storage space for your project files, commit history, branches, and issue discussions.

### Ways to create a repository:

#### Method A: GitHub Web UI
1. Log in to [GitHub](https://github.com).
2. In the top-right corner, click the **\`+\`** dropdown and select **New repository**.
3. **Repository name**: Use lowercase with hyphens (kebab-case), e.g., \`ecommerce-backend-api\`.
4. **Description**: A clear one-sentence summary of what the project accomplishes.
5. **Initialization options**:
   - Check **Add a README file** (if starting a brand-new project from scratch).
   - Add **.gitignore** (select your language template, e.g., \`Node\`, \`Python\`, or \`VisualStudio\`).
   - Choose a **License** (e.g., \`MIT License\`).
6. Click **Create repository**.

#### Method B: GitHub CLI (\`gh\`)
\`\`\`bash
# Create a new public repo directly from terminal and push current directory:
gh repo create my-awesome-app --public --source=. --remote=origin --push
\`\`\`

#### Connecting an existing local project to a newly created empty repo:
\`\`\`bash
# 1. Initialize local repository:
git init -b main

# 2. Add files and make initial commit:
git add .
git commit -m "feat: initial commit"

# 3. Add remote origin and push:
git remote add origin git@github.com:username/my-awesome-app.git
git push -u origin main
\`\`\`

---

## 2. Public vs Private Repository

| Factor | Public Repository | Private Repository |
| :--- | :--- | :--- |
| **Visibility** | Visible to the entire internet | Visible only to you and invited collaborators |
| **Searchability** | Indexed by Google & GitHub Search | Invisible in search engines and profiles |
| **Forks & Stars** | Anyone can star, fork, and clone | Cannot be starred or forked by outsiders |
| **Best Used For** | Portfolios, open-source libraries, capstone projects | Proprietary commercial code, freelance client apps, internal tools |
| **Hiring Value** | ⭐⭐⭐⭐⭐ Critical for job applications | Hidden from recruiters |

> [!CAUTION]
> **Security Warning**: If you switch a private repository to public, ensure you have never committed API keys, database passwords, or JWT secrets in any previous commit. The entire commit history becomes publicly searchable!

---

## 3. README.md (The Front Door of Your Project)

A project without a \`README.md\` is like a store with no sign. Recruiters will close your tab in 5 seconds if they cannot understand what your project does or how to run it.

### The Anatomy of a Standout README:

\`\`\`markdown
# 🛒 Distributed E-Commerce Microservices API

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![.NET 9](https://img.shields.io/badge/.NET-9.0-blue)

A high-performance e-commerce platform built with ASP.NET Core 9 Clean Architecture, PostgreSQL, Redis, and RabbitMQ.

## 🚀 Key Features
- **Clean Architecture & CQRS**: Separation of concerns with MediatR.
- **Resilient Messaging**: RabbitMQ event bus with Outbox Pattern.
- **Distributed Caching**: Redis cache for catalog read endpoints.
- **JWT & Role-Based Auth**: Secure authorization for Customer and Admin roles.

## 🏗️ Architecture Diagram
\`\`\`
[ Client App ] ──► [ API Gateway ] ──► [ Orders Service ] ──► [ PostgreSQL ]
                                              │
                                              └──► [ RabbitMQ ] ──► [ Inventory Service ]
\`\`\`

## 🛠️ Tech Stack
- **Backend**: C# / .NET 9, EF Core, Dapper
- **Database**: PostgreSQL 16, Redis 7
- **DevOps**: Docker, GitHub Actions CI/CD

## ⚡ Getting Started

### Prerequisites
- .NET 9 SDK
- Docker & Docker Compose

### Local Installation & Setup
\`\`\`bash
# 1. Clone repository
git clone https://github.com/username/ecommerce-api.git
cd ecommerce-api

# 2. Launch background dependencies (Postgres, Redis, RabbitMQ)
docker-compose up -d

# 3. Restore and run migrations
dotnet ef database update --project src/Infrastructure

# 4. Start the API
dotnet run --project src/Api
\`\`\`

## 📖 API Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| \`POST\` | \`/api/v1/auth/login\` | User authentication & JWT issuance | No |
| \`GET\` | \`/api/v1/products\` | Paginated product listing | No |
| \`POST\` | \`/api/v1/orders\` | Place customer order | Bearer JWT |

## 🧪 Running Tests
\`\`\`bash
dotnet test --logger "console;verbosity=detailed"
\`\`\`

## 📄 License
Distributed under the MIT License. See \`LICENSE\` for more information.
\`\`\`

---

## 4. .gitignore (Excluding Junk and Secrets)

Git tracks everything unless you explicitly tell it to ignore certain files. The \`.gitignore\` file sits in the root of your project and defines wildcard patterns for files and directories that Git should never track.

### What should ALWAYS be ignored?
1. **Dependencies**: \`node_modules/\`, \`packages/\`, \`vendor/\` (these should be restored via package managers).
2. **Build artifacts & compiled binaries**: \`bin/\`, \`obj/\`, \`dist/\`, \`build/\`, \`*.dll\`, \`*.exe\`.
3. **Environment secrets & configurations**: \`.env\`, \`.env.local\`, \`appsettings.Development.json\` (containing database passwords or Stripe secret keys).
4. **Operating system noise**: \`.DS_Store\` (macOS), \`Thumbs.db\` (Windows).
5. **IDE user settings**: \`.vscode/\`, \`.idea/\`.

### Example \`.gitignore\` Patterns:
\`\`\`gitignore
# Ignore build outputs:
bin/
obj/
dist/

# Ignore packages:
node_modules/

# Ignore sensitive environment files:
.env
.env.*
!.env.example    # Keep example file committed so others know the required keys!

# Ignore OS files:
.DS_Store
Thumbs.db
\`\`\`

### 💡 Pro Tip: How to untrack an already-committed file
If you accidentally committed a file that was later added to \`.gitignore\`:
\`\`\`bash
# Untrack without deleting from local hard drive:
git rm --cached .env

# Untrack entire folder:
git rm -r --cached bin/

git commit -m "chore: remove untracked build artifacts from git index"
\`\`\`

---

## 5. LICENSE (Open-Source Legal Protection)

If you create a public GitHub repository **without a license**, copyright law defaults to **"All rights reserved"**. This means other developers and companies legally cannot use, modify, copy, or contribute to your code!

### Top 3 Licenses Developers Must Know:

1. **MIT License (Permissive — Most Popular ⭐)**:
   - Super simple and short.
   - Anyone can use, copy, modify, distribute, and sell your code commercially.
   - **Requirement**: They must include your original copyright notice.
   - **Liability**: You offer zero warranty and bear zero legal liability.

2. **Apache 2.0 (Permissive with Patents)**:
   - Permissive like MIT, but provides an explicit grant of **patent rights** from contributors to users and protects against trademark infringement.
   - Popular among enterprise-grade frameworks (e.g., Kubernetes, Android).

3. **GNU General Public License v3 / GPLv3 (Copyleft)**:
   - Requires that any derivative software that incorporates your code **must also be released as 100% open-source under GPLv3**.
   - Used by the Linux Kernel and projects that want to prevent proprietary commercial closed-sourcing.

---

## 6. Repository Settings

The **Settings** tab contains critical levers for maintaining repository quality and security:

1. **Default Branch**:
   - Change the primary default branch from legacy \`master\` to modern standard \`main\`.
2. **Branch Protection Rules & Rulesets**:
   - **Require a pull request before merging**: Prevents anyone (even admins) from directly pushing commits to \`main\`.
   - **Require approvals**: Enforces that 1 or 2 peers review and approve the PR.
   - **Require status checks to pass before merging**: Ensures CI builds and automated unit tests pass before code can be merged.
   - **Do not allow force pushes**: Blocks \`git push --force\` on production branches.
3. **Collaborators & Access**:
   - Add team members with granular permission levels: **Read**, **Triage**, **Write**, **Maintain**, or **Admin**.
4. **Secrets and Variables (Actions)**:
   - Securely store encrypted secrets (e.g., \`DOCKER_PASSWORD\`, \`AWS_ACCESS_KEY_ID\`, \`DATABASE_URL\`) for automated CI/CD pipelines without exposing them in code.
5. **The Danger Zone**:
   - **Change repository visibility** (Public ⇄ Private).
   - **Transfer ownership** (moving repo to an organization or another user).
   - **Archive repository** (makes repo read-only).
   - **Delete repository** (permanent, irreversible).

---

## 7. Releases (Tags & Packaged Software)

While git commits represent raw changes, a **Release** represents a formal, deployable milestone of your software.

### Git Tag vs. GitHub Release:
* **Git Tag**: A pointer to a specific commit hash in Git history (e.g., \`v1.0.0\`).
* **GitHub Release**: A GitHub feature built on top of a Git tag that packages binary artifacts (e.g., \`.zip\`, \`.apk\`, \`.exe\`), includes formatted markdown release notes, and links directly to commit changelogs.

### Semantic Versioning (SemVer): \`vMAJOR.MINOR.PATCH\` (e.g., \`v2.4.1\`)
* **MAJOR (2.x.x)**: Breaking architectural or API changes (incompatible with previous version).
* **MINOR (x.4.x)**: New backward-compatible feature additions.
* **PATCH (x.x.1)**: Backward-compatible bug fixes and security patches.

### Creating a Tag & Release:
\`\`\`bash
# 1. Create an annotated tag on current commit:
git tag -a v1.0.0 -m "Release version 1.0.0 - initial production release"

# 2. Push the tag to GitHub:
git push origin v1.0.0
\`\`\`
3. In GitHub, go to **Releases** > **Draft a new release** > select tag \`v1.0.0\` > click **Generate release notes** > **Publish release**.

---

## 8. GitHub Profile (Your Engineering Personal Brand)

Your GitHub Profile is your technical calling card. A polished profile instantly separates you from hundreds of applicants.

### 1. The Secret Profile README:
* Create a **public** repository whose name is **identical to your GitHub username** (e.g., if your username is \`mostafakamal\`, create \`github.com/mostafakamal/mostafakamal\`).
* GitHub automatically renders the \`README.md\` of this repo at the very top of your public profile!

### 2. What to include in your Profile README:
* **Engaging Title & Elevator Pitch**: e.g., "Full-Stack Software Engineer specializing in high-concurrency .NET & Cloud Systems."
* **Tech Stack Badges**: Icons and badges for languages, databases, cloud providers, and tools you actively use.
* **Featured Projects**: Direct links to your top 3 repos with short descriptions of the architecture and problems solved.
* **Live GitHub Stats Cards**: Dynamic SVGs showing your commits, PRs, and top programming languages.
* **Contact & Socials**: Links to LinkedIn, Portfolio website, and technical blog.

### 3. Pinned Repositories:
* GitHub lets you pin up to **6 repositories** right below your bio.
* **Rules for Pinned Repos**:
  1. Only pin repositories that have a stellar \`README.md\`.
  2. Include a live working demo URL in the repo "About" section.
  3. Ensure code follows clean architecture with unit tests and a clear license.
`,
    contentBn: `# গিটহাব বেসিকস: রিপোজিটরি, README, .gitignore, লাইসেন্স, সেটিংস, রিলিজ ও প্রোফাইল

গিটহাব (GitHub) হলো সফটওয়্যার ইঞ্জিনিয়ারদের আন্তর্জাতিক জীবনবৃত্তান্ত (Living Engineering Resume)। দেশ-বিদেশের যেকোনো টেকনিক্যাল ইন্টারভিউ বা রিক্রুটমেন্টে প্রার্থীর যোগ্যতা যাচাইয়ের জন্য রিক্রুটাররা সর্বপ্রথম প্রার্থীর গিটহাব প্রোফাইল ও রিপোজিটরিগুলো পর্যবেক্ষণ করেন।

নিচে গিটহাবের মৌলিক ৮টি বিষয়ের বিস্তারিত ও সহজ ব্যাখ্যা তুলে ধরা হলো:

---

## ১. Creating a Repository (রিপোজিটরি তৈরি)

রিপোজিটরি (Repository বা সংক্ষেপে Repo) হলো আপনার প্রজেক্টের কোড, ফাইল, কমিট হিস্ট্রি ও আলোচনার মূল ডিজিটাল ঘর বা ফোল্ডার।

### রিপোজিটরি তৈরির পদ্ধতি:

#### পদ্ধতি ক: গিটহাব ওয়েব ইন্টারফেস
1. [GitHub](https://github.com)-এ লগইন করুন।
2. উপরের ডানদিকের **\`+\`** আইকনে ক্লিক করে **New repository** নির্বাচন করুন।
3. **Repository name**: ছোট হাতের অক্ষরে হাইফেন দিয়ে নাম দিন (kebab-case), যেমন \`hospital-management-api\`।
4. **Description**: প্রজেক্টটি কী কাজ করে তার ১ লাইনের সংক্ষিপ্ত বিবরণ দিন।
5. **প্রারম্ভিক অপশনসমূহ**:
   - **Add a README file**: নতুন প্রজেক্ট হলে টিক দিন।
   - **Add .gitignore**: আপনার প্রোগ্রামিং ভাষার টেমপ্লেট নির্বাচন করুন (যেমন \`Node\`, \`Python\`, বা \`VisualStudio\`)।
   - **Choose a license**: একটি ওপেন সোর্স লাইসেন্স বাছাই করুন (যেমন \`MIT License\`)।
6. **Create repository** বাটনে ক্লিক করুন।

#### পদ্ধতি খ: গিটহাব সিএলআই (\`gh\`) দিয়ে টার্মিনাল থেকেই রিপো তৈরি:
\`\`\`bash
gh repo create my-awesome-app --public --source=. --remote=origin --push
\`\`\`

#### লোকাল কোড নতুন খালি গিটহাব রিপোজিটরিতে যুক্ত করার নিয়ম:
\`\`\`bash
# ১. প্রজেক্ট ফোল্ডারে গিট চালু করুন:
git init -b main

# ২. ফাইল যোগ করে কমিট করুন:
git add .
git commit -m "feat: initial commit"

# ৩. গিটহাব রিমোট লিংক যোগ করে পুশ করুন:
git remote add origin git@github.com:username/my-awesome-app.git
git push -u origin main
\`\`\`

---

## ২. Public vs Private Repository (পাবলিক বনাম প্রাইভেট)

| বিষয় | পাবলিক রিপোজিটরি (Public) | প্রাইভেট রিপোজিটরি (Private) |
| :--- | :--- | :--- |
| **কারা দেখতে পারে?** | ইন্টারনেটের যেকেউ দেখতে পারে | শুধু আপনি ও আমন্ত্রিত সহকর্মীরা |
| **সার্চ ফলাফল** | গুগল ও গিটহাব সার্চে আসে | কোনো সার্চ ইঞ্জিনে আসবে না |
| **স্টার ও ফোর্ক** | যেকেউ স্টার বা ফোর্ক করতে পারে | বাইরের কেউ স্টার বা ফোর্ক করতে পারে না |
| **ব্যবহারের ক্ষেত্র** | পোর্টফোলিও, ওপেন-সোর্স লাইব্রেরি, ইন্টারভিউ প্রজেক্ট | কোম্পানির বাণিজ্যিক কোড, ফ্রিল্যান্স ক্লায়েন্টের কাজ |
| **চাকরির জন্য মূল্য** | ⭐⭐⭐⭐⭐ রিক্রুটার সরাসরি কোড দেখতে পান | রিক্রুটার কিছুই দেখতে পান না |

> [!CAUTION]
> **নিরাপত্তা সতর্কতা**: কোনো প্রাইভেট রিপোজিটরিকে পরবর্তীতে পাবলিক করার আগে নিশ্চিত হোন যে কোনো কমিটে আপনার ডাটাবেজ পাসওয়ার্ড, ক্লাউড সিক্রেট বা এপিআই কী রয়ে যায়নি! পাবলিক করামাত্র সম্পূর্ণ হিস্ট্রি উন্মুক্ত হয়ে যায়।

---

## ৩. README.md (প্রজেক্টের মূল পরিচিতিপত্র)

একটি প্রজেক্টে \`README.md\` না থাকা মানে সাইনবোর্ড ছাড়া দোকান খোলার মতো। রিক্রুটার বা অন্য কোনো ডেভেলপার আপনার প্রজেক্টে ঢুকে যদি বুঝতে না পারেন যে প্রজেক্টটি কী করে বা কীভাবে রান করতে হয়, তবে তিনি ৫ সেকেন্ডের মধ্যে ট্যাব বন্ধ করে দেবেন।

### একটি স্ট্যান্ডার্ড ও আকর্ষণীয় README-এর গঠন:
1. **প্রজেক্টের নাম ও ব্যাজ (Badges)**: বিল্ড স্ট্যাটাস, লাইসেন্স ও ফ্রেমওয়ার্ক ভার্সনের কালারফুল ব্যাজ।
2. **এক লাইনের ভূমিকা (Elevator Pitch)**: প্রজেক্টটি কেন তৈরি করা হয়েছে এবং কী সমস্যা সমাধান করে।
3. **মূল ফিচারসমূহ (Key Features)**: বুলেট পয়েন্টে মূল কার্যকারিতা।
4. **সিস্টেম আর্কিটেকচার ডায়াগ্রাম**: প্রজেক্টের ব্যাকএন্ড, ফ্রন্টএন্ড ও ডাটাবেজের ফ্লো ডায়াগ্রাম।
5. **টেক স্ট্যাক (Tech Stack)**: ব্যবহৃত ভাষা, ফ্রেমওয়ার্ক ও ডাটাবেজের তালিকা।
6. **লোকাল সেটআপ গাইড (Getting Started)**:
   - প্রয়োজনীয় সফটওয়্যার (যেমন Node.js, Docker, .NET SDK)।
   - গিট ক্লোন, ডিপেনডেন্সি ইনস্টল, \`.env\` সেটআপ এবং রান করার কমান্ড।
7. **এপিআই এন্ডপয়েন্ট টেবিল**: মেথড, রুট এবং ডেসক্রিপশনসহ টেবিল।
8. **টেস্ট চালানোর নির্দেশিকা**: ইউনিট টেস্ট রান করার কমান্ড।
9. **লাইসেন্স তথ্য**: ওপেন সোর্স লাইসেন্সের উল্লেখ।

---

## ৪. .gitignore (অপ্রয়োজনীয় ফাইল ও সিক্রেট বাদ দেওয়া)

গিট ডিফল্টভাবে ফোল্ডারের সবকিছু ট্র্যাক করতে চায়। কিন্তু প্রজেক্টের বিল্ড ফাইল বা সিক্রেট কি কখনোই গিটে রাখা উচিত নয়। প্রজেক্টের রুট ডিরেক্টরিতে \`.gitignore\` নামক একটি টেক্সট ফাইল রেখে আমরা গিটকে জানিয়ে দিই কোন কোন ফাইল বা ফোল্ডার সে কখনো ট্র্যাক করবে না।

### কোন ফাইলগুলো অবশ্যই .gitignore-এ রাখবেন?
1. **ভারী প্যাকেজ ও ডিপেনডেন্সি**: \`node_modules/\`, \`packages/\`, \`vendor/\` (এগুলো প্যাকেজ ম্যানেজার দিয়ে ইনস্টল হয়)।
2. **কম্পাইল করা বিল্ড ফাইল**: \`bin/\`, \`obj/\`, \`dist/\`, \`build/\`, \`*.dll\`, \`*.exe\`।
3. **এনভায়রনমেন্ট ও পাসওয়ার্ড ফাইল**: \`.env\`, \`.env.local\`, \`appsettings.Development.json\`।
4. **অপারেটিং সিস্টেমের ফাইল**: \`.DS_Store\` (Mac), \`Thumbs.db\` (Windows)।
5. **এডিটর কনফিগারেশন**: \`.vscode/\`, \`.idea/\`।

### সিনট্যাক্স উদাহরণ:
\`\`\`gitignore
# বিল্ড ফোল্ডার বাদ দিতে:
bin/
obj/
dist/

# নোড মডিউলস বাদ দিতে:
node_modules/

# সিক্রেট এনভায়রনমেন্ট ফাইল বাদ দিতে:
.env
.env.*
!.env.example    # তবে উদাহরণ ফাইলটি কমিট রাখুন যাতে অন্যরা বুঝতে পারে কোন কোন কি প্রয়োজন!
\`\`\`

### ভুলবশত কমিট হওয়া ফাইল গিট ইনডেক্স থেকে সরানোর নিয়ম:
\`\`\`bash
# হার্ডডিস্কের ফাইল ডিলিট না করে কেবল গিট ট্র্যাকিং থেকে বাদ দিতে:
git rm --cached .env
git commit -m "chore: remove .env from git tracking"
\`\`\`

---

## ৫. LICENSE (ওপেন-সোর্স লাইসেন্স ও আইনি সুরক্ষা)

আপনি যদি গিটহাবে কোনো পাবলিক রিপোজিটরি তৈরি করেন কিন্তু কোনো লাইসেন্স যুক্ত না করেন, তবে আন্তর্জাতিক কপিরাইট আইন অনুযায়ী স্বয়ংক্রিয়ভাবে **"All rights reserved"** প্রযোজ্য হয়। এর অর্থ হলো অন্যরা আপনার কোড দেখতে পারলেও আইনিভাবে তা ব্যবহার, সংশোধন বা কোথাও চালাতে পারবে না!

### শীর্ষ ৩টি ওপেন-সোর্স লাইসেন্স:

1. **MIT License (সবচেয়ে জনপ্রিয় ও নমনীয় ⭐)**:
   - অত্যন্ত সহজ ও সংক্ষিপ্ত লাইসেন্স।
   - যেকেউ আপনার কোড দেখতে, পরিবর্তন করতে, বিক্রি করতে এবং নিজের বাণিজ্যিক প্রজেক্টে ব্যবহার করতে পারে।
   - **শর্ত**: তারা আপনার মূল কপিরাইট নোটিশটি রেখে দেবে।
   - **দায়মুক্তি**: কোড ব্যবহারে কোনো ক্ষতি হলে আপনার কোনো আইনি দায় থাকবে না।

2. **Apache 2.0 License (পেটেন্ট সুরক্ষাসহ নমনীয়)**:
   - MIT লাইসেন্সের মতোই উদার, তবে এটি ব্যবহারকারীকে স্পষ্ট **পেটেন্ট ব্যবহারের অধিকার** দেয় এবং মূল নির্মাতার ট্রেডমার্ক সুরক্ষার নিয়ম যুক্ত করে। (যেমন Kubernetes, Android)।

3. **GNU General Public License v3 / GPLv3 (কপিরেফট বা বাধ্যতামূলক ওপেন-সোর্স)**:
   - যেকেউ আপনার কোড ব্যবহার বা পরিবর্তন করতে পারে, তবে শর্ত হলো তার প্রজেক্টটিও বাধ্যতামূলকভাবে **১০০% ওপেন-সোর্স হিসেবে GPLv3 লাইসেন্সে প্রকাশ করতে হবে** (Linux কার্নেল মডেল)।

---

## ৬. Repository Settings (রিপোজিটরি কনফিগারেশন)

গিটহাব রিপোজিটরির **Settings** ট্যাবে প্রজেক্টের মান ও নিরাপত্তা বজায় রাখার জন্য বেশ কিছু গুরুত্বপূর্ণ অপশন থাকে:

1. **Default Branch**: মূল ব্রাঞ্চের নাম নির্ধারণ (যেমন পুরনো \`master\` থেকে আধুনিক স্ট্যান্ডার্ড \`main\`-এ পরিবর্তন)।
2. **Branch Protection Rules (বা Rulesets)**:
   - **Require a pull request before merging**: কাউকে সরাসরি \`main\` ব্রাঞ্চে পুশ করতে দেয় না; বাধ্যতামূলক পিআর করতে হয়।
   - **Require approvals**: ১ বা ২ জন টিমমেটের অ্যাপ্রুভাল ছাড়া পিআর মার্জ হতে দেয় না।
   - **Require status checks to pass**: স্বয়ংক্রিয় টেস্ট ও সিআই বিল্ড পাস না করলে মার্জ বাটন লক থাকে।
   - **Do not allow force pushes**: প্রোডাকশন ব্রাঞ্চে ডেসট্রাক্টিভ ফোর্স পুশ পুরোপুরি ব্লক করে।
3. **Collaborators & Teams**: টিম মেম্বারদের নির্দিষ্ট পারমিশন দিয়ে যুক্ত করা (যেমন Read, Write, Admin)।
4. **Secrets and Variables (Actions)**: ক্লাউড ডিপ্লয়মেন্ট পাসওয়ার্ড ও এপিআই কি নিরাপদে সংরক্ষণ করা।
5. **Danger Zone**: রিপোজিটরির ভিজিবিলিটি বদলানো (Public ⇄ Private), মালিকানা অন্যকে ট্রান্সফার করা এবং প্রয়োজনে রিপো ডিলিট করা।

---

## ৭. Releases (ট্যাগ ও সফটওয়্যার প্যাকেজ রিলিজ)

গিটহাবে সফটওয়্যারের একটি নির্দিষ্ট ভার্সন বা মাইলস্টোনকে প্রাতিষ্ঠানিকভাবে পাবলিশ করার নাম হলো **Release**।

### গিট ট্যাগ বনাম গিটহাব রিলিজ:
* **Git Tag**: গিটের একটি নির্দিষ্ট কমিটের উপর দেওয়া স্থায়ী লেবেল বা পয়েন্টার (যেমন \`v1.0.0\`)।
* **GitHub Release**: গিট ট্যাগের ওপর ভিত্তি করে তৈরি একটি প্যাকেজ যেখানে রিলিজ নোটস (চেঞ্জলগ) এবং ডাউনলোডযোগ্য বাইনারি ফাইল (\`.zip\`, \`.apk\`, \`.exe\`) যুক্ত থাকে।

### সিমান্টিক ভার্সনিং (Semantic Versioning / SemVer): \`vMAJOR.MINOR.PATCH\`
* **MAJOR (\`v2.0.0\`)**: ব্রেকিং চেঞ্জ (পুরনো ভার্সনের সাথে সামঞ্জস্যপূর্ণ নয় এমন পরিবর্তন)।
* **MINOR (\`v1.1.0\`)**: নতুন ফিচার যোগ করা হয়েছে (যা পুরনো কোড ভাঙবে না)।
* **PATCH (\`v1.0.1\`)**: কোনো বাগ ফিক্স বা ছোটখাটো নিরাপত্তা সমাধান।

\`\`\`bash
# টার্মিনাল থেকে ট্যাগ তৈরি ও পুশ:
git tag -a v1.0.0 -m "Release v1.0.0 - initial stable version"
git push origin v1.0.0
\`\`\`

---

## ৮. GitHub Profile (প্রফেশনাল ডিজিটাল ব্র্যান্ডিং)

আপনার গিটহাব প্রোফাইল হলো আপনার প্রোগ্রামিং দক্ষতার সরাসরি প্রতিচ্ছবি। একটি আকর্ষণীয় প্রোফাইল চাকরির ইন্টারভিউতে আপনাকে অন্যদের চেয়ে অনেক এগিয়ে রাখে।

### ১. সিক্রেট প্রোফাইল README:
* আপনার গিটহাবের ইউজারনেমের হুবহু একই নামে একটি **পাবলিক রিপোজিটরি** খুলুন (যেমন ইউজারনেম \`mostafakamal\` হলে রিপোজিটরির নাম হবে \`mostafakamal\`)।
* এই রিপোজিটরিতে রাখা \`README.md\` ফাইলটি আপনার মূল গিটহাব প্রোফাইলের সবার উপরে চমৎকারভাবে প্রদর্শিত হবে!

### ২. প্রোফাইল README-তে কী কী রাখবেন?
* **সংক্ষিপ্ত প্রফেশনাল পরিচিতি**: আপনি কোন ডোমেনে কাজ করতে পছন্দ করেন (যেমন "Full-Stack Engineer passionate about Cloud & Distributed Systems")।
* **টেক স্ট্যাক আইকন/ব্যাজ**: আপনি যেসকল প্রোগ্রামিং ভাষা, ফ্রেমওয়ার্ক, ডাটাবেজ এবং ক্লাউড প্রযুক্তি পারেন তার ব্যাজ।
* **ফিচার্ড প্রজেক্ট**: আপনার তৈরি সেরা ২-৩টি প্রজেক্টের আর্কিটেকচার হাইলাইটস ও লাইভ ডেমো লিংক।
* **ডাইনামিক গিটহাব স্ট্যাটাস উইজেট**: আপনার কমিট স্ট্রিক, পিআর কাউন্ট এবং টপ ল্যাঙ্গুয়েজ গ্রাফ।
* **কানেক্ট লিংক**: LinkedIn, পার্সোনাল পোর্টফোলিও ওয়েবসাইট ও ইমেইল।

### ৩. পিন করা রিপোজিটরি (Pinned Repositories):
* প্রোফাইলে সর্বোচ্চ **৬টি সেরা রিপোজিটরি** পিন করে রাখুন।
* প্রতিটি পিন করা রিপোজিটরিতে যেন চমৎকার \`README.md\`, লাইসেন্স এবং লাইভ সাইট ডেমো ইউআরএল যুক্ত থাকে।
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
