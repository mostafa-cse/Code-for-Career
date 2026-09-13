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

In modern engineering teams, **no developer pushes code directly to the production branch (\`main\`)**. Every single feature, optimization, and bugfix must go through a **Pull Request (PR)**. A PR is where engineering collaboration, automated testing, security checks, and mentorship happen.

Here is the complete guide across all 9 core stages of the Pull Request lifecycle:

---

## 1. What is a Pull Request (PR)?

### Real-world Analogy:
> Imagine you are an architect designing a bridge. You do not pour concrete directly across the river on day one. Instead, you create a detailed blueprint on your drawing board, invite senior structural engineers to inspect every calculation, make necessary adjustments, and only after their formal sign-off does the construction crew build the bridge into the city.

### Definition:
A **Pull Request** is a formal proposal asking repository maintainers and teammates to review changes on a feature branch (e.g., \`feature/order-api\`) and merge them into the target base branch (e.g., \`main\`).

> **Why is it called "Pull" Request?**  
> Because you are politely requesting the repository maintainer: *"I have built this feature in my branch; please **pull** my changes into your primary project."*

*Note: A Pull Request is a collaborative platform feature pioneered by GitHub, GitLab (where it is called a "Merge Request"), and Bitbucket; it is not a raw Git terminal command.*

---

## 2. Creating a PR (Step-by-Step)

### Prerequisites (Terminal Workflow):
\`\`\`bash
# 1. Create and switch to a new feature branch:
git switch -c feature/stripe-payment

# 2. Make changes, stage, and commit:
git add .
git commit -m "feat(billing): integrate Stripe checkout sessions"

# 3. Push branch to GitHub and set tracking:
git push -u origin feature/stripe-payment
\`\`\`

### Creating via GitHub Web UI:
1. Navigate to your repository on [GitHub](https://github.com).
2. You will see a yellow notification banner: **"feature/stripe-payment had recent pushes — Compare & pull request"**. Click it.
3. Select your branches:
   - **Base branch** (\`main\`): The target branch where you want code to go.
   - **Compare branch** (\`feature/stripe-payment\`): The branch containing your new work.
4. Fill in the **Title** and **Description**.
5. Assign **Reviewers** (teammates whose approval you need) and **Assignees** (yourself).
6. Click **Create pull request** (or click the arrow to select **Create draft pull request** if work is still in progress).

### Creating via GitHub CLI (\`gh\`):
\`\`\`bash
gh pr create --title "feat(billing): integrate Stripe checkout sessions" --body "Implements checkout webhook & session creation." --base main
\`\`\`

---

## 3. Writing an Exceptional PR Description

A PR with no description forces reviewers to guess your intentions and slows down code review by days. Follow this standardized production-grade template:

\`\`\`markdown
## 📝 Summary of Changes
- Integrated Stripe Checkout Session API for subscription payments.
- Created secure Stripe webhook handler (\`/api/v1/webhooks/stripe\`) with cryptographic signature validation.
- Added Redis idempotency locking to prevent double-charging on duplicate webhook deliveries.

## 🔗 Related Ticket / Issue
Closes #142 (Fixes subscription checkout failure on retry).

## 🧪 How to Test Locally
1. Run dependencies: \`docker-compose up -d\`
2. Forward test webhooks using Stripe CLI:
   \`stripe listen --forward-to localhost:5000/api/v1/webhooks/stripe\`
3. Trigger test checkout: \`stripe trigger payment_intent.succeeded\`
4. Verify user record in PostgreSQL has \`subscription_status = 'active'\`.

## 📸 Screenshots / Demos (For UI changes)
| Before (Error) | After (Success Modal) |
| :---: | :---: |
| ![Before](https://placehold.co/300x200?text=Error) | ![After](https://placehold.co/300x200?text=Success) |

## ✅ Author Checklist
- [x] Automated unit and integration tests added and passing
- [x] No hardcoded secrets, API keys, or development credentials
- [x] Database migration scripts tested forward and backward
- [x] API documentation updated in Swagger/OpenAPI
\`\`\`

---

## 4. Code Review: Principles & Culture

Code review is NOT about finding fault with teammates; it is a **safety net for software quality** and a forum for continuous team learning.

### What Reviewers Look For:
1. **Functional Correctness**: Does the code actually solve the problem without introducing edge-case bugs (e.g., \`null\` pointers, off-by-one errors)?
2. **Security Vulnerabilities**: Are user inputs sanitized? Are endpoints protected by authentication and authorization checks?
3. **Performance & Scalability**: Are there $N+1$ database query loops? Are memory-heavy objects disposed of properly?
4. **Maintainability & Clean Architecture**: Are variables named clearly? Does the design adhere to SOLID principles and DRY?
5. **Test Coverage**: Are negative scenarios and edge cases tested?

---

## 5. Review Comments (Inline Feedback & Suggestions)

Reviewers leave comments directly on lines of code in the **Files changed** tab.

### How to leave comments:
* Hover over any line number in the diff and click the blue **\`+\`** button.
* Select **Start a review** (this batches all your comments together so the author receives only **one notification email** when you finish, rather than 20 separate pings).

### One-Click Suggestion Blocks:
Reviewers can write concrete code suggestions that the author can accept with a single click:

\`\`\`markdown
\`\`\`suggestion
const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
\`\`\`
\`\`\`

### Conventional Comment Prefixes:
- \`[nit]\`: Minor style or typo preference (not blocking).
- \`[question]\`: Seeking clarification on why an approach was taken.
- \`[suggestion]\`: Recommended alternative implementation.
- \`[blocking]\`: Must be fixed before this PR can be merged.

---

## 6. Approve PR (Green Light)

When you have reviewed the code, verified tests, and are confident that the changes are production-ready:

1. Click **Review changes** in the top-right corner of the PR.
2. Write a brief concluding note (e.g., *"Clean implementation and thorough tests. LGTM! (Looks Good To Me)"*).
3. Select **Approve**.
4. Click **Submit review**.

> This turns your review state into a **green checkmark** (✅), satisfying branch protection rules that require peer sign-off.

---

## 7. Request Changes (Blocking Bugs)

If you find a critical bug, broken business requirement, memory leak, or security issue, you must block merging until it is resolved.

1. Click **Review changes**.
2. Clearly explain **why** the issue is dangerous and how to fix it.
3. Select **Request changes**.
4. Click **Submit review**.

> This places a **red X** (❌) on the PR and blocks the **Merge** button.

### How the Author Resolves Changes:
1. Fix the issues locally on the same feature branch.
2. Commit and push:
   \`\`\`bash
   git add .
   git commit -m "fix(billing): address PR review comments on idempotency key"
   git push origin feature/stripe-payment
   \`\`\`
3. The PR updates automatically on GitHub with the new commits!
4. Click the **Re-request review** icon (🔄) next to the reviewer's name to invite them back.

---

## 8. Merge PR (Merging Strategies)

Once all checks pass (green CI build, required approvals, zero unresolved conversations), the green **Merge pull request** button becomes active.

GitHub provides 3 distinct merge strategies:

| Strategy | What happens to commit history? | Ideal Use Case |
| :--- | :--- | :--- |
| **Squash and merge ⭐** | Condenses all 15 messy feature commits into **1 clean, atomic commit** on \`main\`. | **Most popular in enterprise & startups**. Keeps the primary git history clean, readable, and easy to revert. |
| **Create a merge commit** | Keeps every single intermediate commit and creates a 3-way merge commit on \`main\`. | Open-source libraries where granular individual author commits must be preserved. |
| **Rebase and merge** | Replays each commit individually on top of \`main\` without creating a merge commit. | Teams that want a strictly linear history but want to retain individual commits. |

*Always delete the feature branch after merging using the "Delete branch" button to keep your repository clean!*

---

## 9. Close PR (Without Merging)

Sometimes a PR is no longer needed:
- The business requirement was cancelled.
- An alternative architectural approach was chosen in another PR.
- The PR was an experimental prototype.

### How to close properly:
1. Write a polite and clear comment explaining why the PR is being closed so future engineers understand the context.
2. Click **Close pull request** (or **Close with comment**).
3. If circumstances change later, you can reopen it anytime by clicking **Reopen pull request**.
`,
    contentBn: `# পুল রিকোয়েস্ট: পিআর তৈরি, কোড রিভিউ, অ্যাপ্রুভাল ও মার্জ স্ট্র্যাটেজি

আধুনিক সফটওয়্যার ইঞ্জিনিয়ারিং টিমে **কোনো ডেভেলপার সরাসরি প্রোডাকশন ব্রাঞ্চে (\`main\`) কোড পুশ করতে পারেন না**। প্রতিটি নতুন ফিচার, বাগ ফিক্স বা পারফরম্যান্স অপ্টিমাইজেশনকে অবশ্যই একটি **Pull Request (PR)** প্রক্রিয়ার মধ্য দিয়ে যেতে হয়। একটি পিআর হলো কোডের মান যাচাই, অটোমেটিক টেস্ট রান, নিরাপত্তা চেক এবং সিনিয়র ডেভেলপারদের কাছ থেকে মেন্টরশিপ নেওয়ার মূল মিলনস্থল।

নিচে পুল রিকোয়েস্ট লাইফসাইকেলের পূর্ণাঙ্গ ৯টি ধাপ সহজ ভাষায় ব্যাখ্যা করা হলো:

---

## ১. পুল রিকোয়েস্ট (Pull Request) কী?

### বাস্তব জীবনের উপমা:
> মনে করুন আপনি একটি আর্কিটেকচার ফার্মে ব্রিজ ডিজাইনার হিসেবে কাজ করছেন। আপনি প্রথম দিনই নদীর উপর সরাসরি ব্রিজের পিলার ঢালাই করবেন না। প্রথমে আপনি একটি ব্লুপ্রিন্ট তৈরি করবেন, সিনিয়র ইঞ্জিনিয়ারদের সামনে তা উপস্থাপন করবেন, তাঁরা প্রতিটি হিসাব-নিকাশ খতিয়ে দেখে মতামত দেবেন। সবাই নিশ্চিত ও সন্তুষ্ট হয়ে লিখিত অনুমোদন দিলে তবেই মূল ব্রিজ তৈরি হবে।

### সংজ্ঞা:
**Pull Request** হলো মূল প্রজেক্ট রক্ষণাবেক্ষণকারীদের (Maintainers / Tech Leads) কাছে একটি আনুষ্ঠানিক প্রস্তাব, যেখানে আপনি আবেদন করেন: *"আমি \`feature/order-api\` ব্রাঞ্চে নতুন কোড লিখেছি; দয়া করে কোডটি রিভিউ করে আপনার মূল \`main\` ব্রাঞ্চে মার্জ বা পুল করুন।"*

> **কেন একে "Pull" Request বলা হয়?**  
> কারণ আপনি দলের প্রধানকে বিনীতভাবে বলছেন: *"Please **pull** my changes into your repository."*

*মনে রাখবেন: এটি গিটহাব, গিটল্যাব (যেখানে একে "Merge Request" বলা হয়) বা বিটবাকেটের কোলাবোরেশন ফিচার; এটি গিটের কোনো লোকাল টার্মিনাল কমান্ড নয়।*

---

## ২. পিআর তৈরি (Creating a PR)

### টার্মিনালে পূর্বপ্রস্তুতি:
\`\`\`bash
# ১. নতুন ফিচার ব্রাঞ্চ তৈরি করে সুইচ করুন:
git switch -c feature/stripe-payment

# ২. কোড লিখে কমিট করুন:
git add .
git commit -m "feat(billing): integrate Stripe checkout sessions"

# ৩. গিটহাবে ব্রাঞ্চটি পুশ করুন:
git push -u origin feature/stripe-payment
\`\`\`

### গিটহাব ওয়েব ইন্টারফেসে তৈরি:
1. [GitHub](https://github.com)-এ আপনার রিপোজিটরিতে যান।
2. উপরে একটি হলুদ নোটিফিকেশন ব্যানার দেখতে পাবেন: **"Compare & pull request"**। সেখানে ক্লিক করুন।
3. ব্রাঞ্চ নিশ্চিত করুন:
   - **Base branch** (\`main\`): যেখানে কোড জমা হবে।
   - **Compare branch** (\`feature/stripe-payment\`): আপনার নতুন ব্রাঞ্চ।
4. **Title** এবং **Description** পূরণ করুন।
5. ডানপাশ থেকে **Reviewers** (যাঁরা কোড চেক করবেন) এবং **Assignees** (নিজের নাম) যুক্ত করুন।
6. **Create pull request** বাটনে ক্লিক করুন (কাজ চলাকালীন অবস্থায় কাউকে নোটিফিকেশন না পাঠিয়ে টেস্ট রান করতে চাইলে ড্রপডাউন থেকে **Create draft pull request** নির্বাচন করুন)।

---

## ৩. মানসম্মত পিআর ডেসক্রিপশন (PR Description)

ডেসক্রিপশন ছাড়া পিআর সাবমিট করলে রিভিউয়ার বুঝতে পারেন না আপনি কী উদ্দেশ্যে কোড লিখেছেন। এর ফলে কোড রিভিউ আটকে থাকে।

### একটি আদর্শ পিআর ডেসক্রিপশন টেমপ্লেট:
1. **সংক্ষিপ্ত বিবরণ (Summary)**: আপনি কী কী ফিচার যোগ বা পরিবর্তন করেছেন তা বুলেট পয়েন্টে লিখুন।
2. **টিকেট রেফারেন্স (Issue/Ticket)**: যেমন \`Fixes #104\` বা \`Closes PROJ-42\` (পিআর মার্জ হলে ইস্যুটি অটো ক্লোজ হবে)।
3. **লোকাল টেস্টিং গাইড (How to Test)**: রিভিউয়ার কীভাবে তাঁর মেশিনে কোডটি পরীক্ষা করবেন তার স্পষ্ট ধাপ।
4. **স্ক্রিনশট বা ডেমো ভিডিও**: ইউআই (UI) পরিবর্তনের ক্ষেত্রে Before এবং After স্ক্রিনশট যুক্ত করুন।
5. **চেকলিস্ট (Checklist)**: ইউনিট টেস্ট পাস হয়েছে কিনা, কোনো সিক্রেট পাসওয়ার্ড ভুলবশত পুশ হয়নি ইত্যাদি নিশ্চিত করে টিক দিন।

---

## ৪. কোড রিভিউ কালচার (Code Review)

কোড রিভিউ কোনো সহকর্মীর ভুল ধরার জন্য নয়; এটি সফটওয়্যারের গুণগত মান নিশ্চিত করা এবং টিমের সম্মিলিত শেখার সেরা মাধ্যম।

### রিভিউয়াররা কী কী বিষয় পরীক্ষা করেন?
1. **কার্যকারিতা ও বাগ**: কোডটি কি সঠিকভাবে কাজ করছে? কোনো নাল পয়েন্টার (NullReference) বা লজিক্যাল ভুল আছে কি?
2. **নিরাপত্তা (Security)**: এসকিউএল ইনজেকশন বা অনিরাপদ এপিআই এন্ডপয়েন্ট আছে কি?
3. **পারফরম্যান্স**: ডাটাবেজে কি অহেতুক $N+1$ কুয়েরি চালানো হয়েছে? অপ্রয়োজনীয় মেমরি লিক হচ্ছে কি?
4. **কোড স্ট্যান্ডার্ড ও আর্কিটেকচার**: কোডের আর্কিটেকচার কি ক্লিন ও রিডেবল? ভ্যারিয়েবলের নামগুলো কি অর্থপূর্ণ?
5. **টেস্ট কভারেজ**: প্রয়োজনীয় ইউনিট টেস্ট লেখা হয়েছে কি?

---

## ৫. রিভিউ কমেন্ট ও সাজেশন ব্লক (Review Comments)

রিভিউয়াররা গিটহাবের **Files changed** ট্যাবে কোডের নির্দিষ্ট লাইনের পাশে মাউস রেখে নীল রঙের **`+`** আইকনে ক্লিক করে মন্তব্য করেন।

### প্রফেশনাল রিভিউ প্র্যাকটিস:
* প্রতিটি কমেন্ট আলাদা না পাঠিয়ে **Start a review** বাটনে ক্লিক করুন। এতে সবগুলো মন্তব্য ড্রাফট হিসেবে জমা থাকবে এবং রিভিউ শেষ হলে একসাথে **Submit review** দিলে লেখক কেবল একটি নোটিফিকেশন ইমেইল পাবেন।
* **সাজেশন ব্লক (Suggestion Blocks)**: রিভিউয়ার চাইলে কোডের সঠিক সমাধান সরাসরি লিখে দিতে পারেন, যা পিআর লেখক এক ক্লিকেই কমিট হিসেবে গ্রহণ করতে পারেন:
  \`\`\`suggestion
  const total = items.reduce((sum, item) => sum + item.price, 0);
  \`\`\`

---

## ৬. পিআর অনুমোদন (Approve PR)

কোডে কোনো সমস্যা না থাকলে এবং টেস্ট সফলভাবে পাস করলে রিভিউয়ার কোড অনুমোদন করেন:
1. **Review changes** ড্রপডাউনে যান।
2. একটি ইতিবাচক মন্তব্য লিখুন (যেমন: *"Clean code and great test coverage. Approved!"*)।
3. **Approve** রেডিও বাটনে ক্লিক করে **Submit review** দিন।
4. এতে পিআর-এ একটি **সবুজ টিক চিহ্ন (✅)** চলে আসে এবং ব্রাঞ্চ প্রটেকশন রুল পূরণ হয়।

---

## ৭. পরিবর্তন চাওয়ার নিয়ম (Request Changes)

কোডে যদি কোনো মারাত্মক বাগ, সিকিউরিটি দুর্বলতা বা লজিক্যাল ভুল থাকে, তবে মার্জ আটকানোর জন্য **Request Changes** ব্যবহার করা হয়:
1. **Review changes**-এ গিয়ে কারণ ব্যাখ্যা করুন।
2. **Request changes** নির্বাচন করে সাবমিট করুন।
3. এতে পিআর-এ একটি **লাল ক্রস (❌)** চলে আসবে এবং মার্জ বাটন লক হয়ে যাবে।

### লেখক কীভাবে সংশোধন করবেন?
* লোকাল মেশিনে একই ফিচার ব্রাঞ্চে কোড সংশোধন করুন।
* স্বাভাবিকভাবে \`git commit\` এবং \`git push\` করুন।
* পুশ করামাত্র গিটহাব পিআর-টি স্বয়ংক্রিয়ভাবে নতুন কমিটগুলো যুক্ত করে আপডেট হয়ে যাবে!
* রিভিউয়ারের নামের পাশে থাকা **Re-request review (🔄)** বাটনে ক্লিক করে পুনরায় রিভিউ করার অনুরোধ জানান।

---

## ৮. পিআর মার্জ করা (Merge PR)

সব রুলস পূরণ হলে (সবুজ CI টেস্ট, টিমমেটের অ্যাপ্রুভাল) মার্জ বাটনটি সক্রিয় হয়।

### গিটহাবের ৩টি জনপ্রিয় মার্জ স্ট্র্যাটেজি:

| স্ট্র্যাটেজি | হিস্ট্রিতে কী ঘটে? | কখন ব্যবহার করবেন? |
| :--- | :--- | :--- |
| **Squash and Merge ⭐** | ফিচার ব্রাঞ্চের সমস্ত ১৫টি খসড়া কমিটকে সংকুচিত করে **১টি পরিষ্কার, সুসংগঠিত কমিট** হিসেবে \`main\`-এ যোগ করে। | **ইন্ডাস্ট্রির সবচেয়ে জনপ্রিয় পছন্দ**। মেইন ব্রাঞ্চের হিস্ট্রি অত্যন্ত পরিষ্কার ও রিভার্ট করা সহজ রাখে। |
| **Create a merge commit** | ফিচার ব্রাঞ্চের প্রতিটি কমিট অক্ষত রেখে একটি অতিরিক্ত ৩-ওয়ে মার্জ কমিট তৈরি করে। | ওপেন-সোর্স প্রজেক্ট যেখানে প্রতিটি আলাদা ডেভেলপারের অবদান অবিকল রাখতে হয়। |
| **Rebase and merge** | কোনো মার্জ কমিট ছাড়াই ফিচার ব্রাঞ্চের কমিটগুলোকে মেইনের অগ্রভাগে একে একে সাজিয়ে দেয়। | যাঁরা মার্জ কমিট ছাড়া সম্পূর্ণ লিনিয়ার গ্রাফ পছন্দ করেন। |

*মার্জ শেষ হওয়া মাত্র **Delete branch** বাটনে ক্লিক করে ফিচার ব্রাঞ্চটি মুছে ফেলা উত্তম যাতে রিপোজিটরি পরিষ্কার থাকে।*

---

## ৯. পিআর বন্ধ করা (Close PR — মার্জ ছাড়া)

কখনো কখনো কোনো পিআর মূল প্রজেক্টে মার্জ করার প্রয়োজন থাকে না:
- ক্লায়েন্ট বা প্রোডাক্ট ওনার রিকোয়ারমেন্ট পরিবর্তন করেছেন।
- অন্য কোনো সহকর্মী এর চেয়ে চমৎকার বিকল্প উপায়ে সমস্যা সমাধান করেছেন।
- পিআরটি কেবল একটি পরীক্ষামূলক প্রোটোটাইপ ছিল।

### কীভাবে ক্লোজ করবেন?
1. ডেসক্রিপশন বক্সে একটি বিনীত মন্তব্য লিখে জানিয়ে দিন ঠিক কেন পিআরটি ক্লোজ করা হচ্ছে।
2. **Close pull request** বাটনে ক্লিক করুন।
3. ভবিষ্যতে যদি সিদ্ধান্ত পরিবর্তন হয়, তবে যেকোনো সময় **Reopen pull request** বাটনে ক্লিক করে এটি পুনরায় চালু করা যায়।
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
    contentEn: `# Team Collaboration: Fork, Clone, Branch, Push, PR, Review, Issues, Discussions & Workflows

Software engineering is inherently a team sport. Whether you are building mission-critical backend systems at a top tech company or contributing to a global open-source project like React or Linux, you must master the complete **Collaborative Engineering Workflow**.

Here is the comprehensive, end-to-end breakdown of the 9 essential components of team collaboration on GitHub:

---

## 1. Fork (Creating Your Personal Cloud Copy)

### Real-world Analogy:
> Imagine visiting a public library with a rare, historic book. The librarian will not let you write directly in the original book with a pen. Instead, you make a complete photocopy of the book to take home. In your photocopy, you can freely highlight, annotate, and add new chapters without damaging the library's master copy.

### What is a Fork?
A **Fork** is a complete, independent copy of another user or organization's repository stored directly in your personal GitHub account.

- **When to Fork**: When you want to contribute to an open-source library (e.g., \`dotnet/aspnetcore\` or \`facebook/react\`) or an external repository where you do not have direct write permissions.
- **Fork vs. Branch**:
  - A **Branch** lives *inside the same repository* (used when you and your teammates share direct write access).
  - A **Fork** creates an entirely *separate repository copy* under your personal account (\`github.com/your-username/repo-name\`).

---

## 2. Clone (Downloading Cloud Code to Your Local Laptop)

Once you have forked a repository on GitHub, you need to bring it down to your local computer so you can open it in VS Code, compile, and run tests.

\`\`\`bash
# 1. Clone your personal fork to your machine:
git clone https://github.com/your-username/project-name.git
cd project-name

# 2. Configure the two critical remotes:
# 'origin'   -> Points to YOUR personal fork (where you have write/push access)
# 'upstream' -> Points to the ORIGINAL repository (where you pull latest updates)
git remote add upstream https://github.com/original-author/project-name.git

# 3. Verify your remotes:
git remote -v
# origin    https://github.com/your-username/project-name.git (fetch & push)
# upstream  https://github.com/original-author/project-name.git (fetch & push)
\`\`\`

---

## 3. Branch (Isolated Workspaces)

> [!IMPORTANT]
> **The Golden Open-Source Rule**: **NEVER write code directly on the \`main\` branch of your fork!**  
> Always keep your fork's \`main\` branch clean, untouched, and strictly synchronized with \`upstream/main\`.

### Creating a Dedicated Feature Branch:
\`\`\`bash
# 1. Fetch the latest changes from the original project:
git fetch upstream

# 2. Create a new topic branch based on upstream's latest main:
git switch -c fix/order-cancellation-timeout upstream/main
\`\`\`

Now you have an isolated sandbox. If you make a mistake or decide to discard this feature, your \`main\` branch remains 100% pristine.

---

## 4. Push (Uploading Your Feature Branch)

After implementing your changes, running local tests, and writing clean commits, you upload your branch to your own GitHub account.

\`\`\`bash
# Stage and commit your code:
git add .
git commit -m "fix(orders): handle race condition during order cancellation"

# Push the branch to YOUR personal fork ('origin'):
git push -u origin fix/order-cancellation-timeout
\`\`\`

> **Notice**: You push to \`origin\` (your fork), NOT \`upstream\`! You do not have permission to push directly to the original repository.

---

## 5. Pull Request (Proposing Your Changes)

Now that your feature branch is on GitHub, it is time to ask the original project maintainers to incorporate your code.

1. Go to the original repository (or your fork) on [GitHub](https://github.com).
2. GitHub will automatically show a banner: **"Compare & pull request across forks"**.
3. Verify the direction of the PR:
   - **Base Repository**: \`original-author/project\` (branch: \`main\`)
   - **Head Repository**: \`your-username/project\` (branch: \`fix/order-cancellation-timeout\`)
4. Write a comprehensive PR description detailing:
   - What problem this PR solves.
   - Any open issue number it fixes (e.g., \`Closes #184\`).
   - Step-by-step instructions for maintainers to verify your fix.
5. Click **Create pull request**.

---

## 6. Code Review (Iterating with Maintainers)

Once your PR is submitted:
1. Automated CI/CD pipelines will run across multiple operating systems and environments (e.g., Ubuntu, macOS, Windows).
2. Maintainers will review your code line by line in the **Files changed** tab.

### Handling Review Feedback Professionally:
- **Don't take feedback personally**: Senior engineers critique the *code*, not your worth as a developer.
- **Applying requested changes**:
  \`\`\`bash
  # Make the requested edits locally in the SAME branch:
  git add .
  git commit -m "refactor(orders): use lock-free concurrent dictionary as suggested"
  git push origin fix/order-cancellation-timeout
  \`\`\`
  *(The PR on GitHub updates automatically with your new commits! You do NOT need to open a new PR!)*
- When the maintainers approve the PR, they will merge your code into the master project. **Congratulations, you are now an official contributor!**

---

## 7. Issues (Bug Tracking & Task Management)

GitHub Issues serve as the project's central task board and bug tracker.

### What Issues Are Used For:
- **Bug Reports**: Documenting software crashes, unexpected behaviors, and steps to reproduce.
- **Feature Requests**: Proposing new capabilities or UX improvements before writing code.
- **Technical Debt**: Refactoring legacy modules or upgrading deprecated packages.

### Anatomy of an Issue:
- **Labels**: Categorize issues (e.g., \`bug\`, \`enhancement\`, \`good first issue\`, \`help wanted\`, \`documentation\`).
- **Assignees**: The developers responsible for solving the ticket.
- **Milestones**: Target release dates or sprints (e.g., \`v2.0.0 Beta\`, \`Sprint 42\`).

### 💡 Magic Closing Keywords:
If you include specific keywords in your commit message or PR description, GitHub will **automatically close the issue** when your PR is merged:
\`\`\`markdown
Closes #42
Fixes #108
Resolves #256
\`\`\`

---

## 8. Discussions (Community Brainstorming & Q&A)

While **Issues** track actionable bugs and concrete tasks, **GitHub Discussions** provide a forum-style space for open-ended community conversation.

| Feature | GitHub Issues | GitHub Discussions |
| :--- | :--- | :--- |
| **Purpose** | Actionable tasks & bug reports | Ideas, Q&A, brainstorming, announcements |
| **Lifecycle** | Open ➔ Closed (by code or PR) | Ongoing conversation / community forum |
| **Outcome** | Results in a Pull Request / Commit | Results in an RFC, consensus, or accepted answer |
| **Q&A Support**| No | Yes (questions can have an "Accepted Answer") |

---

## 9. Team Collaboration (Corporate Models & Best Practices)

In a professional software engineering company, teams generally choose between two primary operational models:

### Model A: The Shared Repository (Feature Branch) Model
- Standard for corporate software teams where all engineers belong to the same organization.
- Everyone clones the same company repo directly (no forks needed).
- Engineers create branches (e.g., \`feature/login\`, \`bugfix/cart-crash\`), push to the shared repo, and open PRs to \`develop\` or \`main\`.

### Model B: The Forking Model
- Standard for open-source projects (Linux, Kubernetes, React, .NET) or companies with strict zero-trust security boundaries where contractors only push to their own forks.

### 🚀 Trunk-Based Development vs. Git Flow:

| Comparison | Trunk-Based Development (Modern Industry Standard ⭐) | Git Flow (Legacy Model) |
| :--- | :--- | :--- |
| **Branch Lifespan** | Very short (hours to 1–2 days max) | Long-lived (\`develop\`, \`release\`, \`feature\`, \`hotfix\`) |
| **Merge Frequency** | Multiple times per day | Weekly or monthly |
| **Merge Conflicts** | Very rare and trivial to resolve | High risk of massive "Merge Hell" |
| **Release Mechanism** | Automated CI/CD pipelines with Feature Flags | Manual staged release freezes |
| **Best Suited For** | High-growth SaaS, Agile startups, microservices | Traditional waterfall, embedded hardware, packaged CDs |
`,
    contentBn: `# টিম কোলাবোরেশন: ফোর্ক, ক্লোন, ব্রাঞ্চ, পুশ, পিআর, রিভিউ, ইস্যু, ডিসকাশন ও টিম ওয়ার্কফ্লো

সফটওয়্যার ডেভেলপমেন্ট মূলত একটি সম্মিলিত দলগত কাজ (Team Sport)। আপনি দেশীয় কোনো প্রথম সারির সফটওয়্যার কোম্পানিতে মাইক্রোসার্ভিস সিস্টেম তৈরি করুন কিংবা আন্তর্জাতিক React, Linux বা .NET-এর মতো ওপেন-সোর্স প্রজেক্টে অবদান রাখুন না কেন — আপনাকে পূর্ণাঙ্গ **টিম কোলাবোরেশন ওয়ার্কফ্লো** পুঙ্খানুপুঙ্খভাবে জানতে হবে।

নিচে গিটহাব টিম কোলাবোরেশনের অত্যাবশ্যকীয় ৯টি উপাদানের বিস্তারিত ও সহজ ব্যাখ্যা তুলে ধরা হলো:

---

## ১. Fork (নিজের অ্যাকাউন্টে ব্যক্তিগত ক্লাউড কপি তৈরি)

### বাস্তব জীবনের উপমা:
> মনে করুন আপনি একটি পাবলিক লাইব্রেরিতে গিয়ে একটি মূল্যবান প্রাচীন বই দেখতে পেলেন। লাইব্রেরিয়ান কখনোই আপনাকে মূল বইটির পৃষ্ঠায় কলম দিয়ে দাগাতে বা লেখার অনুমতি দেবেন না। তাই আপনি মূল বইটির একটি হুবহু ফটোকপি করে নিজের বাসায় নিয়ে আসলেন। এবার আপনার নিজের ফটোকপিতে আপনি নির্দ্বিধায় হাইলাইট করতে পারেন বা নতুন পাতা যুক্ত করতে পারেন; এতে লাইব্রেরির মূল বইটি বিন্দুমাত্র নষ্ট হবে না।

### ফোর্ক কী?
**Fork** হলো অন্য কোনো ডেভেলপার বা অর্গানাইজেশনের গিটহাব রিপোজিটরির একটি হুবহু ক্লোন বা অনুলিপি, যা সরাসরি আপনার ব্যক্তিগত গিটহাব অ্যাকাউন্টে সংরক্ষিত হয়।

- **কখন ফোর্ক করবেন**: যখন কোনো ওপেন সোর্স প্রজেক্টে (যেমন Google Flutter বা Microsoft .NET) আপনি সরাসরি কোড লেখার অনুমতি (Write Access) পান না।
- **Branch বনাম Fork**:
  - **Branch** তৈরি হয় একই রিপোজিটরির *ভেতরে* (যখন টিমের সবার একই প্রজেক্টে পুশ করার অনুমতি থাকে)।
  - **Fork** তৈরি হয় সম্পূর্ণ *আলাদা একটি অ্যাকাউন্টে* স্বাধীন কপি হিসেবে।

---

## ২. Clone (ক্লাউড কোড নিজের ল্যাপটপে নামানো)

গিটহাবে ফোর্ক করার পর সেই কোডটি আপনার ল্যাপটপে এনে কোড এডিটরে রান করার জন্য ক্লোন করতে হয়:

\`\`\`bash
# ১. নিজের পার্সোনাল ফোর্কটি ল্যাপটপে ক্লোন করুন:
git clone https://github.com/your-username/project-name.git
cd project-name

# ২. মূল ওপেন সোর্স প্রজেক্টের সাথে সংযোগ স্থাপন করুন ('upstream'):
# 'origin'   -> আপনার নিজের ফোর্ক (যেখানে আপনার কোড পুশ করার অধিকার আছে)
# 'upstream' -> মূল নির্মাতার প্রজেক্ট (যেখান থেকে আপনি নিয়মিত আপডেট নামাবেন)
git remote add upstream https://github.com/original-author/project-name.git

# ৩. রিমোট লিঙ্ক যাচাই করুন:
git remote -v
\`\`\`

---

## ৩. Branch (ফিচার ব্রাঞ্চে কাজ করা)

> [!IMPORTANT]
> **ওপেন সোর্সের সুবর্ণ নিয়ম (Golden Rule)**: **নিজের ফোর্কের \`main\` ব্রাঞ্চে কখনো সরাসরি কোড লিখবেন না!**  
> আপনার \`main\` ব্রাঞ্চটিকে সর্বদা মূল নির্মাতার \`upstream/main\`-এর সাথে একদম সমান ও পরিচ্ছন্ন রাখবেন।

### নতুন ফিচার ব্রাঞ্চ তৈরির নিয়ম:
\`\`\`bash
# ১. মূল প্রজেক্টের নতুন আপডেট ডাউনলোড করুন:
git fetch upstream

# ২. মূল প্রজেক্টের লেটেস্ট কোডের ওপর ভিত্তি করে নতুন ব্রাঞ্চ তৈরি করুন:
git switch -c fix/order-cancellation-timeout upstream/main
\`\`\`

---

## ৪. Push (নিজের ফোর্কে কোড আপলোড করা)

কোড লেখা শেষ হলে এবং লোকাল টেস্ট পাস করার পর কমিট করে নিজের অ্যাকাউন্টে পুশ করুন:

\`\`\`bash
git add .
git commit -m "fix(orders): resolve timeout bug during order cancellation"

# নিজের ফোর্কে পুশ করুন ('origin'):
git push -u origin fix/order-cancellation-timeout
\`\`\`

> *মনে রাখবেন: আপনি পুশ করছেন আপনার নিজের \`origin\`-এ, মূল \`upstream\`-এ নয়। কারণ মূল রিপোজিটরিতে আপনার সরাসরি পুশ করার অধিকার নেই।*

---

## ৫. Pull Request (মূল প্রজেক্টে কোড মার্জের প্রস্তাব)

আপনার নতুন ফিচার ব্রাঞ্চটি গিটহাবে আপলোড হওয়ার পর:
1. মূল প্রজেক্টের গিটহাব পেজে যান।
2. উপরে ব্যানার দেখতে পাবেন: **"Compare & pull request across forks"**।
3. দিক নিশ্চিত করুন:
   - **Base Repo**: \`original-author/project\` (branch: \`main\`)
   - **Head Repo**: \`your-username/project\` (branch: \`fix/order-cancellation-timeout\`)
4. বিস্তারিত ডেসক্রিপশন লিখুন এবং **Create pull request** বাটনে চাপুন।

---

## ৬. Code Review (মেন্টরদের সাথে কোড পর্যালোচনা)

পিআর সাবমিট করার পর মূল প্রজেক্টের সিনিয়র ইঞ্জিনিয়াররা আপনার কোড লাইন-বাই-লাইন রিভিউ করবেন:
* কোনো সহকর্মী যদি কোনো পরিবর্তনের সাজেশন দেন, তবে মন খারাপ না করে পেশাদারিত্বের সাথে তা গ্রহণ করুন।
* পরিবর্তন করার নিয়ম:
  \`\`\`bash
  # একই ব্রাঞ্চে সংশোধন করুন:
  git add .
  git commit -m "refactor: optimize loop execution as suggested by reviewer"
  git push origin fix/order-cancellation-timeout
  \`\`\`
  *(পুশ করামাত্র গিটহাবে আপনার আগের পিআর-টি স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে, নতুন পিআর খুলতে হবে না!)*

---

## ৭. Issues (বাগ ট্র্যাকিং ও কাজের তালিকা)

গিটহাবের **Issues** ট্যাব হলো প্রজেক্টের ডিজিটাল টাস্কবোর্ড:
- **বাগ রিপোর্ট**: সফটওয়্যারে কোনো ত্রুটি ধরা পড়লে তা স্ক্রিনশট ও বিস্তারিত সহ নথিভুক্ত করা।
- **ফিচার রিকোয়েস্ট**: নতুন কোনো আইডিয়া প্রস্তাব করা।
- **লেবেল ও মাইলস্টোন**: \`bug\`, \`good first issue\`, \`enhancement\` ইত্যাদি লেবেল দিয়ে কাজ ভাগ করা।

### 💡 ম্যাজিক কিওয়ার্ড (অটোমেটিক ইস্যু ক্লোজ):
পিআরের ডেসক্রিপশনে নিচের কিওয়ার্ডগুলো লিখলে পিআর মার্জ হওয়ামাত্র ইস্যুটি স্বয়ংক্রিয়ভাবে ক্লোজ হয়ে যায়:
\`\`\`
Closes #42
Fixes #108
Resolves #256
\`\`\`

---

## ৮. Discussions (কমিউনিটি ব্রেনস্টর্মিং ও আলোচনা)

| বৈশিষ্ট্য | GitHub Issues | GitHub Discussions |
| :--- | :--- | :--- |
| **উদ্দেশ্য** | নির্দিষ্ট বাগ সমাধান বা সরাসরি কোডিং টাস্ক | আইডিয়া শেয়ারিং, উন্মুক্ত প্রশ্নোত্তর, ব্রেনস্টর্মিং |
| **লাইফসাইকেল** | কাজ শেষ হলে কোডের মাধ্যমে Close হয় | কমিউনিটিতে উন্মুক্ত আলোচনা চলমান থাকে |
| **ফলাফল** | Pull Request এবং Commit তৈরি হয় | ঐক্যমত্য বা সিদ্ধান্ত (RFC) তৈরি হয় |
| **Accepted Answer**| নেই | হ্যাঁ (সঠিক উত্তরে টিক চিহ্ন দেওয়া যায়) |

---

## ৯. Team Collaboration (টিম মডেল ও ট্রাঙ্ক-বেসড ডেভেলপমেন্ট)

কর্পোরেট সফটওয়্যার কোম্পানিগুলোতে সাধারণত দুটি মডেলের যেকোনো একটি ব্যবহৃত হয়:

### মডেল ১: Shared Repository Model (কোম্পানি টিম প্রজেক্ট)
- কোম্পানির সব ডেভেলপার একই অর্গানাইজেশনের সেন্ট্রাল রিপোজিটরিতে কাজ করেন (ফোর্ক করার প্রয়োজন হয় না)।
- সবাই লোকাল ব্রাঞ্চ খুলে কাজ করেন এবং পিআর ওপেন করেন।

### মডেল ২: Forking Model (ওপেন সোর্স ও জিরো-ট্রাস্ট)
- ডেভেলপাররা সরাসরি মূল রিপোতে কোড পুশ করতে পারেন না; প্রত্যেকে নিজ নিজ ফোর্কে পুশ করে পিআর পাঠান।

### 🚀 ট্রাঙ্ক-বেসড ডেভেলপমেন্ট বনাম গিট ফ্লো:
* **Trunk-Based Development (আধুনিক স্ট্যান্ডার্ড ⭐)**: খুব ছোট ছোট ফিচার ব্রাঞ্চ (১-২ দিনের কাজ) তৈরি করে প্রতিদিন বা দিনে কয়েকবার সরাসরি \`main\` ট্রাঙ্কে মার্জ করা হয়। এতে মার্জ কনফ্লিক্টের ঝুঁকি থাকে না।
* **Git Flow (ঐতিহ্যবাহী মডেল)**: \`develop\`, \`release\`, \`hotfix\` ইত্যাদি দীর্ঘস্থায়ী ব্রাঞ্চ থাকে যা মাস বা কোয়ার্টার শেষে রিলিজের সময় মার্জ কনফ্লিক্টের পাহাড় তৈরি করতে পারে।
`,
  },
];
