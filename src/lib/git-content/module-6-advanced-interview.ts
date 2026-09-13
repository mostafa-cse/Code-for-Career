import type { LocalLesson } from "@/lib/lessons-data";

export const MODULE_6_LESSONS: LocalLesson[] = [
  {
    slug: "git-advanced",
    titleEn: "Advanced Git: Cherry-Pick, Reflog, Bisect, Submodules, Worktrees & Hooks",
    titleBn: "অ্যাডভান্সড গিট: চেরি-পিক, রেফলগ, বাইসেক্ট, সাবমডিউল, ওয়ার্কট্রি ও হুকস",
    categoryEn: "19. Advanced Tools & Power Features",
    categoryBn: "১৯. অ্যাডভান্সড টুলস ও পাওয়ার ফিচারস",
    categoryDescEn: "Cherry-picking single commits, disaster recovery with reflog, binary bug hunting with bisect, Git submodules, worktrees, and client-side hooks.",
    categoryDescBn: "নির্দিষ্ট কমিট চেরি-পিক করা, রেফলগ দিয়ে হারানো কাজ উদ্ধার, বাইসেক্ট দিয়ে বাগ খোজা, সাবমডিউল, ওয়ার্কট্রি ও অটোমেটেড গিট হুকস।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the power tools used by staff software engineers: git cherry-pick, reflog disaster recovery, git bisect, worktrees, and git hooks.",
    descriptionBn: "স্টাফ সফটওয়্যার ইঞ্জিনিয়ারদের সুপারপাওয়ার টুলসগুলো শিখুন: git cherry-pick, রেফলগ ডেটা রিকভারি, বাইসেক্ট, ওয়ার্কট্রি এবং গিট হুকস।",
    difficulty: "HARD",
    displayOrder: 19,
    prerequisites: ["git-merge-vs-rebase"],
    estimatedMinutes: 35,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Git Tools — Debugging with Bisect",
        url: "https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git",
        description: "Official guide on using binary search with git bisect to pinpoint regressions.",
        isStarred: true,
      },
      {
        source: "Git Documentation",
        title: "Git Worktree Manual",
        url: "https://git-scm.com/docs/git-worktree",
        description: "Managing multiple working trees attached to the same repository.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "You accidentally ran 'git reset --hard HEAD~5' and wiped 5 commits that were never pushed. How do you recover them?",
        url: null,
        difficulty: "HARD",
        company: "Brain Station 23",
        tags: ["Git", "Reflog", "Disaster Recovery", "Reset"],
        solutionEn: "Run 'git reflog'. Git maintains a log of every movement of HEAD locally for 30-90 days, even after hard resets. Find the commit hash or reference (e.g. HEAD@{1}) right before the reset occurred. Recover the work immediately by branching off that pointer: 'git branch recovery-branch HEAD@{1}'.",
        solutionBn: "'git reflog' কমান্ড চালান। গিট লোকাল মেশিনে HEAD এর প্রতিটি নড়াচড়া ৩০ থেকে ৯০ দিন পর্যন্ত মেমোরিতে রেকর্ড রাখে। রিসেটের ঠিক আগের পয়েন্টারটি (যেমন HEAD@{1}) খুঁজে নিয়ে 'git branch recovery-branch HEAD@{1}' চালালে সাথে সাথে মুছে যাওয়া ৫টি কমিট অক্ষত ফিরে আসবে।",
      },
      {
        source: "BD Tech Viva",
        name: "What is Git Worktree and why is it superior to 'git stash' when handling an urgent hotfix?",
        url: null,
        difficulty: "HARD",
        company: "Samsung R&D (SRBD)",
        tags: ["Git", "Worktree", "Hotfix", "Productivity"],
        solutionEn: "Git Worktree allows attaching multiple working directories to a single repository simultaneously. Instead of stashing hours of uncommitted work, triggering long rebuilds, and risking stash pop conflicts, 'git worktree add ../hotfix-folder hotfix-branch' opens the hotfix branch in a separate folder instantly. You fix the bug, test, commit, and delete the worktree without ever touching your primary feature build.",
        solutionBn: "গিট ওয়ার্কট্রি (Worktree) একই রিপোজিটরির জন্য একাধিক পৃথক ফোল্ডার খুলে একসাথে একাধিক ব্রাঞ্চে কাজ করার সুযোগ দেয়। ফলে চলমান কাজ স্ট্যাশ না করে বা বিল্ড ক্যাশ না ভেঙে সরাসরি আলাদা ফোল্ডারে হটফিক্স সমাধান করে মূল কাজে ফিরে আসা যায়।",
      },
    ],
    contentEn: `# Advanced Git: Cherry-Pick, Reflog, Bisect, Submodules, Worktrees & Hooks

These advanced features represent the deep technical mastery expected in staff and senior software engineering interviews.

---

## 1. \`git cherry-pick\`: Surgical Commit Porting

Suppose a teammate fixed an urgent security bug on \`feature/v2-rewrite\` in a single commit (\`4f2a1b9\`), but \`v2-rewrite\` has hundreds of experimental changes not ready for release. You can extract **just that single commit** directly into \`main\`:

\`\`\`bash
git switch main
git cherry-pick 4f2a1b9
\`\`\`
Git applies the exact changes of that commit onto \`main\` and assigns it a new commit hash.

---

## 2. \`git reflog\`: The Ultimate Disaster Recovery Safety Net

In Git, **almost nothing is truly lost** as long as it was committed once. \`git reflog\` (Reference Log) tracks every movement of \`HEAD\` on your machine:

\`\`\`bash
git reflog
# Output:
# 1a2b3c4 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~3  <-- Accident!
# 9f8e7d6 HEAD@{1}: commit: feat: complete stripe integration
# 5c4b3a2 HEAD@{2}: commit: feat: add database migrations

# To recover all lost work to a safe branch:
git branch recovered-work HEAD@{1}
git switch recovered-work
\`\`\`

---

## 3. \`git bisect\`: Binary Search for Regression Bugs

If a critical bug appeared in production, but you don't know which of the last 500 commits introduced it, \`git bisect\` uses **binary search** to find the offending commit in \`O(log N)\` steps (~9 tests for 500 commits!):

\`\`\`bash
# 1. Start bisect
git bisect start

# 2. Tell Git the current commit is broken
git bisect bad

# 3. Tell Git a known good tag or commit from last month
git bisect good v1.0.0

# 4. Git checks out the midpoint automatically. Run your tests:
# If tests pass:
git bisect good
# If tests fail:
git bisect bad

# 5. Git prints: "4f2a1b9 is the first bad commit"
# 6. Reset when finished:
git bisect reset
\`\`\`

---

## 4. \`git worktree\`: Simultaneous Multi-Branch Workspaces

Never interrupt a complex frontend/backend build or stash half-written code again:

\`\`\`bash
# Check out 'hotfix/prod-crash' in an adjacent folder without touching your current files
git worktree add ../hotfix-dir hotfix/prod-crash

# CD into the directory, fix bug, commit, and push:
cd ../hotfix-dir
git commit -am "fix: resolve production null reference"
git push

# Return to your main feature and remove the worktree:
cd ../primary-project
git worktree remove ../hotfix-dir
\`\`\`

---

## 5. Client-Side Git Hooks (\`.git/hooks/\` & Husky)

Git hooks are executable scripts triggered on specific repository lifecycle events:
* **\`pre-commit\`**: Runs linters, formatters (\`dotnet format\`, \`eslint\`), and prevents commits if styling fails.
* **\`commit-msg\`**: Enforces Conventional Commit regex format.
* **\`pre-push\`**: Runs full test suite before allowing push to remote.
`,
    contentBn: `# অ্যাডভান্সড গিট: চেরি-পিক, রেফলগ, বাইসেক্ট, সাবমডিউল, ওয়ার্কট্রি ও হুকস

সিনিয়র ও টেক-লিড পর্যায়ের সফটওয়্যার ইঞ্জিনিয়ারিং ইন্টারভিউতে গিটের অভ্যন্তরীণ জটিল সমস্যা সমাধানের দক্ষতা যাচাই করা হয়।

---

## ১. \`git cherry-pick\`
অন্য কোনো ব্রাঞ্চের শতাধিক ফাইলের ভিড় থেকে শুধুমাত্র একটি নির্দিষ্ট দরকারি কমিট নিজের ব্রাঞ্চে টেনে আনতে চেরি-পিক ব্যবহার করা হয়:
\`\`\`bash
git switch main
git cherry-pick 4f2a1b9
\`\`\`

---

## ২. \`git reflog\`: ডেটা রিকভারি লাইফলাইন
ভুল করে \`git reset --hard\` চালিয়ে কমিট মুছে ফেললেও ভয় নেই! গিট লোকাল মেশিনে HEAD এর প্রতি পদক্ষেপের লগ রাখে:
\`\`\`bash
git reflog
# কাঙ্ক্ষিত পয়েন্টার থেকে নতুন ব্রাঞ্চ তৈরি করে ডেটা ফেরত আনুন:
git branch safe-recovery HEAD@{1}
\`\`\`

---

## ৩. \`git bisect\`: বাইনারি সার্চ দিয়ে বাগ খোঁজা
শত শত কমিটের মধ্যে কোন নির্দিষ্ট কমিটটিতে বাগ তৈরি হয়েছিল তা দ্রুততম সময়ে \`O(log N)\` কমপ্লেক্সিটিতে খুঁজে বের করতে \`git bisect\` ব্যবহৃত হয়।

---

## ৪. \`git worktree\`: প্যারালাল ওয়ার্কস্পেস
চলমান কাজ স্ট্যাশ না করে একই সাথে অন্য ব্রাঞ্চে হটফিক্স করতে ওয়ার্কট্রি দিয়ে আলাদা ফোল্ডার খুলে কাজ করা যায়:
\`\`\`bash
git worktree add ../hotfix-folder hotfix/api-crash
\`\`\`
`,
  },
  {
    slug: "git-interview-questions",
    titleEn: "Git Interview Questions: Top 20 BD Tech Viva & Scenario Questions",
    titleBn: "গিট ইন্টারভিউ প্রশ্নাবলি: শীর্ষ ২০ টেকনিক্যাল ভাইভা ও প্র্যাকটিক্যাল সিনারিও",
    categoryEn: "20. Technical Viva & Interview Mastery",
    categoryBn: "২০. ইন্টারভিউ ভাইভা ও সিনারিও প্রস্তুতি",
    categoryDescEn: "Comprehensive breakdown of top 20 technical viva questions asked in Bangladesh software engineering interviews.",
    categoryDescBn: "বাংলাদেশের শীর্ষস্থানীয় সফটওয়্যার কোম্পানিতে বহুল জিজ্ঞাসিত ২০টি টেকনিক্যাল ভাইভা প্রশ্ন ও স্ট্যান্ডার্ড উত্তর।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the most frequently asked Git & GitHub interview questions across Bangladesh top tech companies (Enosis, Brain Station 23, Therap, Samsung R&D).",
    descriptionBn: "বাংলাদেশের শীর্ষ টেক কোম্পানিগুলোর (Enosis, Brain Station, Therap, Samsung R&D) গিট ও গিটহাব ইন্টারভিউয়ের সম্পূর্ণ প্রস্তুতি নিন।",
    difficulty: "HARD",
    displayOrder: 20,
    prerequisites: ["git-advanced"],
    estimatedMinutes: 40,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Git Pro Book",
        url: "https://git-scm.com/book/en/v2",
        description: "Complete official reference for Git mechanics.",
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
    ],
    contentEn: `# Git Interview Questions: Top 20 BD Tech Viva & Scenario Questions

This curated guide covers the exact questions asked in technical written exams and vivas at top Bangladeshi software companies (Brain Station 23, Enosis Solutions, Therap, Samsung R&D, BJIT, Optimizely, Kaz Software).

---

## 1. Conceptual & Architectural Questions

### Q1: Git vs GitHub — What is the fundamental distinction?
* **Git** is an open-source, local, distributed command-line Version Control System software running on your machine.
* **GitHub** is a cloud-based web hosting service owned by Microsoft that hosts remote Git repositories and adds collaboration tools (Pull Requests, Actions, Issues).

### Q2: Centralized VCS (SVN) vs Distributed VCS (Git)?
* In SVN, a central server owns the repository history. If the server is offline, developers cannot commit or review diffs.
* In Git, every local clone is a 100% full-fledged repository containing the entire historical object database, allowing complete offline functionality.

### Q3: Working Tree vs Staging Area (Index) vs Local Repository?
* **Working Tree**: Your active filesystem folder where code is edited.
* **Staging Area (Index)**: A binary staging table (\`.git/index\`) that prepares the exact content of the next commit.
* **Local Repository**: The compressed immutable object database (\`.git/objects\`) storing all committed snapshots.

### Q4: What is \`HEAD\` in Git?
\`HEAD\` is an active pointer reference inside \`.git/HEAD\` indicating the current commit or branch your working tree is based on. Normally, it points to a branch ref (\`ref: refs/heads/main\`).

### Q5: What is a "Detached HEAD" and how do you fix it?
Occurs when \`HEAD\` points directly to a commit hash instead of a branch pointer (e.g., after \`git checkout <commit-hash>\`). Any commits created while detached are unreferenced and subject to garbage collection.
* **Fix**: Run \`git switch -c my-new-branch\` to anchor the commits to a permanent branch pointer.

---

## 2. Command Comparison Questions

### Q6: \`git merge\` vs \`git rebase\`?
* **Merge**: Preserves historical truth by creating a new 3-way merge commit tying two branches together. Non-destructive, but can produce complex non-linear graphs.
* **Rebase**: Replays branch commits sequentially on top of the target base branch, creating a completely linear history. Rewrites commit hashes; must NEVER be used on shared public branches.

### Q7: \`git pull\` vs \`git fetch\`?
* \`git fetch\`: Downloads new remote objects into your local database without touching your working tree or current branch.
* \`git pull\`: Executes \`git fetch\` followed immediately by \`git merge\` (or rebase), modifying your working files.

### Q8: \`git reset\` vs \`git revert\`?
* \`git reset\`: Moves the branch pointer backward, discarding or unstaging commits. Rewrites history; unsafe for shared remote branches.
* \`git revert\`: Generates a brand-new commit that applies the inverse diff of an earlier commit. Preserves history; safe for shared remote branches.

### Q9: \`git clone\` vs \`git fork\`?
* **Clone**: A standard Git command that copies a remote repository down to your local machine.
* **Fork**: A GitHub-specific server-side operation that creates an identical copy of someone else's repository under your personal GitHub account.

### Q10: \`origin\` vs \`upstream\`?
* **\`origin\`**: The default alias for the remote repository you cloned locally.
* **\`upstream\`**: The standard remote alias pointing back to the original author's parent repository in a Forking workflow.

---

## 3. Practical Scenario & Troubleshooting Questions

### Q11: How do you undo a commit that was already pushed to a shared \`main\` branch?
Never force-push a reset! Run:
\`\`\`bash
git revert <bad-commit-hash>
git push origin main
\`\`\`

### Q12: You accidentally ran \`git reset --hard\` and lost unpushed work. How do you recover?
Use **\`git reflog\`**:
\`\`\`bash
git reflog
git branch recovery-branch HEAD@{1}
\`\`\`

### Q13: You made 5 commits on \`main\` that should have been on a new feature branch. How do you fix it?
\`\`\`bash
# 1. Create new feature branch at current position (keeps all 5 commits):
git branch feature/my-work

# 2. Reset main back 5 commits:
git reset --hard HEAD~5

# 3. Switch to your feature branch:
git switch feature/my-work
\`\`\`

### Q14: How do you discard uncommitted changes in a specific file?
\`\`\`bash
git restore src/Services/PaymentService.cs
\`\`\`

### Q15: How do you untrack a file that was committed before being added to \`.gitignore\`?
\`\`\`bash
git rm --cached sensitive-config.json
git commit -m "chore: untrack sensitive config file"
\`\`\`
`,
    contentBn: `# গিট ইন্টারভিউ প্রশ্নাবলি: শীর্ষ ২০ টেকনিক্যাল ভাইভা ও প্র্যাকটিক্যাল সিনারিও

বাংলাদেশের শীর্ষস্থানীয় টেক কোম্পানিগুলোতে (Brain Station 23, Enosis, Therap, Samsung R&D, BJIT) গিট ও গিটহাব নিয়ে বহুল জিজ্ঞাসিত প্রশ্ন ও আদর্শ উত্তরের সংকলন।

---

## ১. মৌলিক ও আর্কিটেকচারাল প্রশ্নাবলি

### প্রশ্ন ১: গিট এবং গিটহাবের পার্থক্য কী?
* **গিট (Git)** হলো একটি লোকাল, ডিস্ট্রিবিউটেড ভার্সন কন্ট্রোল সফটওয়্যার যা মেশিনে অফলাইনে কোডের স্ন্যাপশট রাখে।
* **গিটহাব (GitHub)** হলো একটি ক্লাউড প্ল্যাটফর্ম যা গিট রিপোজিটরি অনলাইনে হোস্ট করে কোড রিভিউ ও টিম কোলাবোরেশনের সুযোগ দেয়।

### প্রশ্ন ২: \`HEAD\` কী এবং "Detached HEAD" বলতে কী বোঝায়?
\`HEAD\` হলো এমন একটি রেফারেন্স যা নির্দেশ করে বর্তমানে আপনি কোন ব্রাঞ্চ বা কমিটে আছেন। যদি \`HEAD\` কোনো ব্রাঞ্চকে পয়েন্ট না করে সরাসরি কোনো নির্দিষ্ট কমিট হ্যাশকে পয়েন্ট করে, তখন তাকে **Detached HEAD** বলে। এ অবস্থায় নতুন কমিট সেভ করতে হলে অবিলম্বে \`git switch -c new-branch\` চালাতে হয়।

---

## ২. কমান্ড তুলনা ও ব্যবহারিক সিনারিও

### প্রশ্ন ৩: \`git merge\` বনাম \`git rebase\`?
* **Merge**: নতুন একটি মার্জ কমিট তৈরি করে দুটি ব্রাঞ্চকে সংযুক্ত করে। ইতিহাস সম্পূর্ণ সত্য রাখে।
* **Rebase**: আপনার ব্রাঞ্চের কমিটগুলোকে নতুন বেসের মাথায় এক এক করে পুনরায় বসায়, ফলে ইতিহাস সম্পূর্ণ লিনিয়ার থাকে। পাবলিক ব্রাঞ্চে রিব্যাস চালানো সম্পূর্ণ নিষেধ।

### প্রশ্ন ৪: \`git reset\` বনাম \`git revert\`?
* **Reset**: কমিট পয়েন্টারকে পেছনে সরিয়ে ইতিহাস মুছে ফেলে (শেয়ার্ড ব্রাঞ্চের জন্য ক্ষতিকর)।
* **Revert**: পূর্ববর্তী কমিটের বিপরীত পরিবর্তন দিয়ে সম্পূর্ণ নতুন একটি নিরাপদ কমিট তৈরি করে (পাবলিক ব্রাঞ্চের জন্য নিরাপদ)।

### প্রশ্ন ৫: \`git fetch\` বনাম \`git pull\`?
* **Fetch**: শুধুমাত্র রিমোট থেকে নতুন কোড ডাউনলোড করে এনে রাখে, লোকাল ফাইলে কোনো হাত দেয় না।
* **Pull**: ফেচ করার সাথে সাথেই বর্তমান লোকাল কোডের সাথে মার্জ করে ফাইল পরিবর্তন করে।

### প্রশ্ন ৬: শেয়ার্ড \`main\` ব্রাঞ্চে ভুল কোড পুশ হলে কীভাবে আনডু করবেন?
ফোর্স পুশ বা রিসেট না করে \`git revert <commit-hash>\` চালিয়ে নতুন কমিট পুশ করতে হবে।
`,
  },
];
