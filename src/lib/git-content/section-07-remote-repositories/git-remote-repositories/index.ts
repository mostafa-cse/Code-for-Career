import type { LocalLesson } from "@/lib/lessons-data";

export const gitRemoteRepositoriesLesson: LocalLesson = {
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
| \`git remote -v\` | Lists remote nicknames & URLs | Read-only |
| \`git fetch origin\` | Downloads remote commits to local database | 100% Safe (files untouched) |
| \`git pull origin main\` | Downloads AND merges into working files | May cause merge conflicts |
| \`git push -u origin <branch>\` | Uploads commits & sets tracking | Uploads local work |
| \`git push --force-with-lease\` | Safely updates rewritten remote history | Use on private branches only |
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
  };
