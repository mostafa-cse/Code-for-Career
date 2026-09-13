import type { LocalLesson } from "@/lib/lessons-data";

export const MODULE_6_LESSONS: LocalLesson[] = [
  {
    slug: "git-advanced",
    titleEn: "19. Advanced Git: Cherry-Pick, Interactive Rebase, Reflog, Bisect, Submodules, Worktrees & Hooks",
    titleBn: "১৯. অ্যাডভান্সড গিট: চেরি-পিক, ইন্টারঅ্যাক্টিভ রিবেস, রেফলগ, বাইসেক্ট, সাবমডিউল, ওয়ার্কট্রি ও গিট হুকস",
    categoryEn: "19. Advanced Git",
    categoryBn: "১৯. অ্যাডভান্সড গিট",
    categoryDescEn: "Deep dive into cherry-pick, interactive rebase, disaster recovery with reflog, binary bug hunting with bisect, submodules, worktrees, and git hooks.",
    categoryDescBn: "নির্দিষ্ট কমিট চেরি-পিক করা, ইন্টারঅ্যাক্টিভ রিবেস, রেফলগ ডেটা রিকভারি, বাইসেক্ট দিয়ে বাগ খোঁজা, সাবমডিউল, ওয়ার্কট্রি ও গিট হুকস।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the power tools used by senior and staff software engineers: git cherry-pick, interactive rebase, reflog recovery, bisect, submodules, worktrees, and hooks.",
    descriptionBn: "সিনিয়র ও স্টাফ সফটওয়্যার ইঞ্জিনিয়ারদের সুপারপাওয়ার টুলসগুলো শিখুন: চেরি-পিক, ইন্টারঅ্যাক্টিভ রিবেস, রেফলগ, বাইসেক্ট, সাবমডিউল, ওয়ার্কট্রি ও হুকস।",
    difficulty: "HARD",
    displayOrder: 19,
    prerequisites: ["git-merge-vs-rebase"],
    estimatedMinutes: 40,
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
      {
        source: "Git Documentation",
        title: "Git Tools — Submodules",
        url: "https://git-scm.com/book/en/v2/Git-Tools-Submodules",
        description: "Official documentation on managing submodules inside repositories.",
        isStarred: false,
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
      {
        source: "Enterprise Scenario",
        name: "How does 'git bisect' find regression bugs in O(log N) commits, and how can you automate it with a test script?",
        url: null,
        difficulty: "HARD",
        company: "Enosis Solutions",
        tags: ["Git", "Bisect", "Automation", "Debugging"],
        solutionEn: "Git bisect uses binary search across the commit graph between a known bad commit and a known good tag. At each step, Git automatically checks out the midpoint commit. By running 'git bisect run ./test.sh' (where test.sh exits 0 on pass and 1 on fail), Git autonomously executes the binary search in seconds without human manual checkouts, printing the exact commit that introduced the failure.",
        solutionBn: "গিট বাইসেক্ট কমিট গ্রাফের মাঝে বাইনারি সার্চ চালিয়ে O(log N) ধাপে ত্রুটিপূর্ণ কমিট খুঁজে বের করে। 'git bisect run ./test.sh' কমান্ডের মাধ্যমে কোনো টেস্ট স্ক্রিপ্ট রান করালে গিট নিজে নিজেই স্বয়ংক্রিয়ভাবে কয়েক সেকেন্ডের মধ্যে বাগ সৃষ্টিকারী প্রথম কমিটটি শনাক্ত করে দেয়।",
      },
    ],
    contentEn: `# 19. Advanced Git: Power Tools & Deep Mechanics

\`\`\`text
19. Advanced Git
    ├── Cherry-Pick
    ├── Interactive Rebase
    ├── reflog
    ├── Bisect
    ├── Submodules
    ├── Worktrees
    └── Git Hooks
\`\`\`

These 7 advanced Git capabilities distinguish senior and staff software engineers. They empower you to surgically manipulate history, recover lost commits from disaster, hunt regressions via binary search, manage multi-repo architectures, and parallelize your workflow.

---

## 1. Cherry-Pick (\`git cherry-pick\`)

\`\`\`text
feature-branch:   A ─── B ─── C ─── D (Critical Bugfix) ─── E (Unfinished)
                                       │
                               git cherry-pick D
                                       ▼
main-branch:      M1 ─── M2 ────────── D' (Bugfix applied without E!)
\`\`\`

### What is Cherry-Pick?
\`git cherry-pick\` surgically copies the changes from one or more existing commits on another branch and applies them as new commits on top of your current \`HEAD\`.

### Why Not Just Merge?
If a teammate fixed a critical security flaw on an experimental branch that contains 50 other unfinished, broken commits, running \`git merge\` would pull in all 50 broken commits. Cherry-picking lets you extract **only that single bugfix commit**.

### Syntax & Variations:
\`\`\`bash
# 1. Switch to the target branch (e.g. main or release)
git switch main

# 2. Apply a single specific commit
git cherry-pick 4f2a1b9

# 3. Apply a range of commits (from A exclusive to B inclusive)
git cherry-pick A..B

# 4. Cherry-pick changes into the Staging Area WITHOUT creating a commit (-n / --no-commit)
git cherry-pick -n 4f2a1b9
\`\`\`

### Resolving Conflicts during Cherry-Pick:
\`\`\`bash
# When a conflict occurs:
# 1. Resolve files manually in your editor
# 2. Stage the resolved files:
git add <resolved-file>

# 3. Continue cherry-picking:
git cherry-pick --continue

# To abort and restore branch to original state:
git cherry-pick --abort

# To skip this specific commit:
git cherry-pick --skip
\`\`\`

---

## 2. Interactive Rebase (\`git rebase -i\`)

\`\`\`text
Before Rebase:   C1 ("wip") ──► C2 ("fix typo") ──► C3 ("almost done") ──► C4 ("done")
                                       │
                         git rebase -i HEAD~4 (Squash & Reword)
                                       ▼
Clean History:   C_Final ("feat: implement robust stripe checkout flow")
\`\`\`

### What is Interactive Rebase?
Interactive Rebase allows you to rewrite, squash, edit, reorder, and clean up your local commit history before opening a Pull Request. It is the premier tool for maintaining a clean, professional commit log.

### Syntax:
\`\`\`bash
# Start interactive rebase for the last 4 commits
git rebase -i HEAD~4

# Or rebase against the upstream main branch
git rebase -i origin/main
\`\`\`

### The Rebase Interactive Todo List:
When executed, your configured text editor (VS Code, Vim, Nano) opens a script file listing your commits in **chronological order** (oldest commit at the top):

\`\`\`text
pick 1a2b3c4 feat: create checkout form
pick 5d6e7f8 fix: fix button alignment typo
pick 9a8b7c6 wip: debug card tokenization
pick 3c4d5e6 test: add unit tests for payments

# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# d, drop <commit> = remove commit completely
# x, exec <command> = run command (the rest of the line) using shell
\`\`\`

### Common Workflow: Squashing Messy Commits
To combine the 3 follow-up commits into the initial feature commit:
\`\`\`text
pick 1a2b3c4 feat: create checkout form
squash 5d6e7f8 fix: fix button alignment typo
fixup 9a8b7c6 wip: debug card tokenization
squash 3c4d5e6 test: add unit tests for payments
\`\`\`
Save and close the editor. Git combines them into a single clean commit!

> ⚠️ **The Golden Rule of Rebase:** Never rebase commits that have already been pushed to a shared public branch! Only rebase your local feature branches before merging.

---

## 3. reflog (\`git reflog\`): The Disaster Recovery Safety Net

\`\`\`text
Accidental Command: git reset --hard HEAD~5 (Lost 5 commits!)
                               │
                       Check git reflog
                               ▼
HEAD@{0}: reset: moving to HEAD~5   [Current Broken State]
HEAD@{1}: commit: feat: complete order processing  [Lost Commit Hash: 8f3b2a1]
                               │
                 git branch recovery-branch 8f3b2a1
                               ▼
All 5 commits fully restored! Zero data loss.
\`\`\`

### What is \`git reflog\`?
\`git reflog\` (Reference Log) is Git's private journal that records every single change of \`HEAD\` and branch tips on your local computer.
* Even if you run \`git reset --hard\`, delete a branch with \`git branch -D\`, or botch a rebase, **Git does not immediately delete those commits**.
* They remain as "dangling objects" in \`.git/objects/\` for **30 to 90 days** until Git's garbage collector (\`git gc\`) runs.

### Inspecting Reflog:
\`\`\`bash
git reflog
# Output:
# 1a2b3c4 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~3
# 8f3b2a1 HEAD@{1}: commit: feat: complete order processing
# 5d6e7f8 HEAD@{2}: commit: feat: add stripe webhooks
# 9a8b7c6 HEAD@{3}: checkout: moving from feature to main
\`\`\`

### Emergency Recovery Playbooks:

#### Scenario A: Undoing an accidental \`git reset --hard\`
\`\`\`bash
# Option 1: Point current branch back to pre-reset state:
git reset --hard HEAD@{1}

# Option 2: Safely create a new recovery branch at that pointer:
git branch recovered-work HEAD@{1}
git switch recovered-work
\`\`\`

#### Scenario B: Recovering an accidentally deleted branch
\`\`\`bash
# 1. You accidentally ran: git branch -D feature/dashboard
# 2. Find the last commit hash of that branch in reflog:
git reflog | grep "dashboard"
# Found: 7e2f1a0 HEAD@{4}: commit: feat: add dashboard metrics

# 3. Recreate the branch at that exact commit:
git branch feature/dashboard 7e2f1a0
\`\`\`

---

## 4. Bisect (\`git bisect\`): Binary Search Bug Hunting

\`\`\`text
Commit History (500 commits):
v1.0.0 (Good) ─── C1 ─── C2 ─── ... ─── C250 (Midpoint) ─── ... ─── HEAD (Bad)
                                              │
                                  Test: Passes or Fails?
                  ┌───────────────────────────┴───────────────────────────┐
                  ▼                                                       ▼
            Test Passes                                             Test Fails
Bug is in C251 - HEAD                                   Bug is in v1.0.0 - C250
(Search right half)                                     (Search left half)
\`\`\`

### The Power of \`O(log N)\`:
If an unknown regression broke your application across 500 commits:
* Testing manually one-by-one requires up to **500 builds**.
* Using binary search with \`git bisect\` pinpoints the exact bad commit in only **9 steps** ($2^9 = 512$).

### Manual Bisect Workflow:
\`\`\`bash
# 1. Start bisect mode
git bisect start

# 2. Mark the current commit as broken
git bisect bad

# 3. Mark an older commit or tag where everything worked correctly
git bisect good v1.0.0

# 4. Git automatically checks out the midpoint commit (~250 commits away)
# Run your application and test:
# If it works:
git bisect good
# If it is broken:
git bisect bad

# 5. Repeat until Git outputs:
# "4f2a1b9c8d7e6f is the first bad commit"
# Author: John Doe <john@example.com>
# Commit Message: perf: refactor database connection pool

# 6. Exit bisect and return to your original branch:
git bisect reset
\`\`\`

### Fully Automated Bisect with Test Scripts:
You can let Git run the entire bisect process completely autonomously in seconds:
\`\`\`bash
git bisect start HEAD v1.0.0
# Git executes the script at each binary step:
# - Exit code 0 = GOOD (clean test)
# - Exit code 1-127 (except 125) = BAD (failed test)
# - Exit code 125 = SKIP (untestable / won't compile)
git bisect run npm test
\`\`\`

---

## 5. Submodules (\`git submodule\`)

\`\`\`text
Main Project Repository (my-enterprise-app)
├── src/
├── package.json
├── .gitmodules  ──► Maps submodules to external URLs & commit hashes
└── libs/
    └── shared-auth/  ──► [Submodule pointer: points to commit 7b1c3a of git@github.com:org/shared-auth.git]
\`\`\`

### What is a Git Submodule?
A Git Submodule allows you to keep an independent Git repository as a subdirectory inside another Git repository.
* The parent repository does **not** store the files of the submodule.
* It only stores the **URL** and a **160-bit SHA-1 commit hash pointer** indicating which exact commit of the sub-repository to check out.

### Key Commands:
\`\`\`bash
# 1. Add an external repository as a submodule
git submodule add https://github.com/my-org/shared-ui-components.git libs/shared-ui

# 2. Inspect .gitmodules configuration:
cat .gitmodules
# [submodule "libs/shared-ui"]
#   path = libs/shared-ui
#   url = https://github.com/my-org/shared-ui-components.git

# 3. Cloning a repository that contains submodules:
# Standard clone leaves submodule folders empty! You must pass --recurse-submodules:
git clone --recurse-submodules https://github.com/my-org/my-enterprise-app.git

# If you already cloned normally:
git submodule update --init --recursive

# 4. Pulling the latest changes from the submodule remote:
git submodule update --remote --merge
\`\`\`

### Submodules vs Alternatives:
| Strategy | Best Suited For | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Git Submodule** | Shared C++ libraries, hardware firmware, proto schemas | Strict version locking, repo isolation | Steep learning curve, easy to create detached heads |
| **Monorepo** | Full-stack apps, TypeScript micro-frontends | Single atomic commits across apps and libs | Large repository size, tooling complexity |
| **Package Manager (npm/NuGet)** | Reusable utility libraries, UI component libraries | Standard semver updates, simple developer UX | Requires publishing artifacts to private registries |

---

## 6. Worktrees (\`git worktree\`)

\`\`\`text
                          .git/ Repository Core (Single Database)
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
Worktree 1: /projects/web-app                     Worktree 2: /projects/hotfix-temp
Branch: feature/user-profile                      Branch: hotfix/prod-500-error
- Active frontend build running                   - Pure hotfix directory
- Local node_modules untouched                    - Test, commit, push, remove!
\`\`\`

### Why Git Worktree Beats \`git stash\`:
When working on a complex feature with dozens of uncommitted files, an urgent production hotfix arrives.
* **The Old Painful Way (\`git stash\`):** Stash uncommitted changes, switch to \`main\`, reinstall dependencies, rebuild, make hotfix, switch back, pop stash, resolve conflicts, rebuild again.
* **The Modern Way (\`git worktree\`):** Open the hotfix branch in a **completely separate directory** instantly. The two folders share the same local \`.git\` storage, saving disk space while keeping working files completely segregated.

### Worktree Workflow:
\`\`\`bash
# 1. Add a new working tree in an adjacent directory
git worktree add ../hotfix-worktree -b hotfix/auth-crash main

# 2. Switch into the new directory:
cd ../hotfix-worktree

# 3. Fix the bug, run tests, commit, and push to production:
git commit -am "fix: resolve auth crash on expired JWT"
git push origin hotfix/auth-crash

# 4. Return to your primary working directory:
cd ../primary-app

# 5. Clean up the worktree folder:
git worktree remove ../hotfix-worktree

# 6. List all active worktrees attached to this repo:
git worktree list
\`\`\`

---

## 7. Git Hooks (\`.git/hooks/\`)

\`\`\`text
Developer runs git commit -m "my commit"
                 │
                 ▼
       [.git/hooks/pre-commit]  ──► Runs ESLint / Formatters / Gitleaks
                 │ (Pass)
                 ▼
     [.git/hooks/commit-msg]   ──► Verifies Conventional Commit Regex
                 │ (Pass)
                 ▼
        [Commit Recorded ✅]
\`\`\`

### What are Git Hooks?
Git hooks are custom executable scripts triggered automatically at key milestones in Git's execution cycle. They live in \`.git/hooks/\`.

### Client-Side vs Server-Side Hooks:
* **Client-Side Hooks:** Run on the developer's laptop (\`pre-commit\`, \`commit-msg\`, \`pre-push\`).
* **Server-Side Hooks:** Run on the Git server (e.g. GitHub Enterprise, GitLab) (\`pre-receive\`, \`update\`, \`post-receive\`).

### Key Client Hooks:
1. **\`pre-commit\`**: Runs before commit message prompt.
   * Usage: Runs code linters (\`eslint\`, \`dotnet format\`), secret scanners (\`gitleaks\`), and formatting checks.
   * If the script exits with non-zero status (\`exit 1\`), **the commit is aborted**.
2. **\`commit-msg\`**: Validates the commit message string.
   * Usage: Enforces Conventional Commits formatting (\`^(feat|fix|docs|style|refactor|test|chore)(\\(.+\\))?: .+\`).
3. **\`pre-push\`**: Runs prior to \`git push\`.
   * Usage: Executes integration or unit tests so broken code is never pushed to remotes.

### Modern Team Hook Management:
Because \`.git/hooks/\` is **not tracked in version control**, teams use modern tools to enforce hooks across all developers:
* **Option A: Husky & lint-staged (Node.js ecosystem)**:
  \`\`\`bash
  npx husky-init && npm install
  npx husky add .husky/pre-commit "npx lint-staged"
  \`\`\`
* **Option B: Native Git \`core.hooksPath\`**:
  \`\`\`bash
  # Configure Git to use a tracked directory in your repo:
  git config core.hooksPath .githooks
  \`\`\`
`,
    contentBn: `# ১৯. অ্যাডভান্সড গিট: পাওয়ার টুলস ও অভ্যন্তরীণ ম্যাকানিজম

\`\`\`text
19. Advanced Git
    ├── Cherry-Pick
    ├── Interactive Rebase
    ├── reflog
    ├── Bisect
    ├── Submodules
    ├── Worktrees
    └── Git Hooks
\`\`\`

সিনিয়র ও স্টাফ সফটওয়্যার ইঞ্জিনিয়ারদের প্রাত্যহিক কাজের অন্যতম বৈশিষ্ট্য হলো গিটের অ্যাডভান্সড টুলগুলোর উপর গভীর নিয়ন্ত্রণ। এই ৭টি টুল আপনাকে নিখুঁতভাবে হিস্ট্রি সাজানো, দুর্ঘটনাবশত হারানো কোড উদ্ধার, জটিল বাগ খুঁজে বের করা এবং একই সাথে একাধিক ব্রাঞ্চে প্যারালাল কাজ করার স্বাধীনতা প্রদান করে।

---

## ১. Cherry-Pick (\`git cherry-pick\`)

\`\`\`text
feature-branch:   A ─── B ─── C ─── D (দরকারি বাগফিক্স) ─── E (অসমাপ্ত কোড)
                                       │
                               git cherry-pick D
                                       ▼
main-branch:      M1 ─── M2 ────────── D' (শুধুমাত্র D যুক্ত হলো, E বাদ রইলো!)
\`\`\`

### চেরি-পিক কী এবং কেন ব্যবহার করবেন?
\`git cherry-pick\` কমান্ডের মাধ্যমে অন্য কোনো ব্রাঞ্চের সম্পূর্ণ হিস্ট্রি মার্জ না করে, শুধুমাত্র **এক বা একাধিক নির্দিষ্ট কমিটকে** হুবহু কপি করে বর্তমান ব্রাঞ্চে নতুন কমিট হিসেবে যুক্ত করা যায়।

### বাস্তব উদাহরণ:
ধরা যাক আপনার এক সহকর্মী \`feature/v2-experiment\` ব্রাঞ্চে কাজ করছেন যেখানে শত শত অসমাপ্ত কোড আছে। কিন্তু তার মধ্যে একটি কমিটে (\`4f2a1b9\`) প্রোডাকশনের একটি মারাত্মক বাগ ফিক্স করা হয়েছে।
* আপনি যদি \`git merge\` করেন, তবে তার সমস্ত অপরীক্ষিত ও ভাঙা কোড আপনার \`main\` ব্রাঞ্চে ঢুকে পড়বে।
* কিন্তু \`git cherry-pick\` ব্যবহার করে আপনি শুধুমাত্র সেই নির্দিষ্ট ফিক্সটি \`main\`-এ নিয়ে আসতে পারবেন।

### কমান্ড ও ব্যবহারবিধি:
\`\`\`bash
# ১. যে ব্রাঞ্চে কমিটটি আনতে চান সেখানে সুইচ করুন
git switch main

# ২. নির্দিষ্ট কমিট হ্যাশ চেরি-পিক করুন
git cherry-pick 4f2a1b9

# ৩. একাধিক কমিটের রেঞ্জ চেরি-পিক করতে:
git cherry-pick A..B

# ৪. সরাসরি কমিট না করে শুধু স্টেজিং এরিয়ায় পরিবর্তন আনতে (-n):
git cherry-pick -n 4f2a1b9
\`\`\`

### কনফ্লিক্ট সমাধান:
\`\`\`bash
# কনফ্লিক্ট ফাইল ঠিক করার পর:
git add <file>
git cherry-pick --continue

# চেরি-পিক বাতিল করে আগের অবস্থায় ফিরতে:
git cherry-pick --abort
\`\`\`

---

## ২. Interactive Rebase (\`git rebase -i\`)

\`\`\`text
পূর্বের অগোছালো হিস্ট্রি:  C1 ("wip") ──► C2 ("typo") ──► C3 ("debug") ──► C4 ("done")
                                       │
                         git rebase -i HEAD~4 (Squash & Reword)
                                       ▼
সুন্দর প্রফেশনাল হিস্ট্রি: C_Final ("feat: implement payment gateway integration")
\`\`\`

### ইন্টারঅ্যাক্টিভ রিবেস কী?
পুল রিকোয়েস্ট (PR) ওপেন করার আগে নিজের লোকাল ব্রাঞ্চের অগোছালো, অগুনতি ছোট ছোট 'wip' বা 'fixed typo' কমিটগুলোকে সাজিয়ে একটি বা দুটি অর্থপূর্ণ কমিটে রূপান্তর করার সবচেয়ে শক্তিশালী প্রক্রিয়া হলো \`git rebase -i\`।

### কমান্ড:
\`\`\`bash
# পেছনের শেষ ৪টি কমিট ইন্টারঅ্যাক্টিভলি সাজাতে:
git rebase -i HEAD~4
\`\`\`

### রিবেস এডিটরের কমান্ডসমূহ:
কমান্ডটি চালালে আপনার টেক্সট এডিটরে কমিটগুলো সবচেয়ে পুরোনো থেকে নতুনের ক্রমানুসারে ওপেন হবে:

\`\`\`text
pick 1a2b3c4 feat: create checkout form
pick 5d6e7f8 fix: fix button alignment
pick 9a8b7c6 wip: debug card tokenization
pick 3c4d5e6 test: add checkout unit tests

# অ্যাকশন লিস্ট:
# p, pick = এই কমিটটি হুবহু রাখা হবে
# r, reword = কমিটের ভেতরের কোড ঠিক রেখে মেসেজ পরিবর্তন করা হবে
# e, edit = এই কমিটে রিবেস থামিয়ে নতুন ফাইল অ্যাড বা পরিবর্তন করা যাবে
# s, squash = এই কমিটটিকে আগের কমিটের সাথে যুক্ত করা হবে (মেসেজসহ)
# f, fixup = squashed হবে কিন্তু এই কমিটের মেসেজ ডিলিট হয়ে যাবে
# d, drop = সম্পূর্ণ কমিটটি হিস্ট্রি থেকে মুছে ফেলা হবে
\`\`\`

### কমিট স্কোয়াশ (Squash) করার নিয়ম:
\`\`\`text
pick 1a2b3c4 feat: create checkout form
squash 5d6e7f8 fix: fix button alignment
fixup 9a8b7c6 wip: debug card tokenization
squash 3c4d5e6 test: add checkout unit tests
\`\`\`
ফাইলটি সেভ করে বের হলে Git ৪টি কমিটকে একটি সুন্দর পূর্ণাঙ্গ কমিটে পরিণত করবে।

> ⚠️ **রিবেসের গোল্ডেন রুল:** পাবলিক বা শেয়ার্ড ব্রাঞ্চে যা ইতিমধ্যে পুশ হয়ে গেছে, সেখানে কখনোই রিবেস চালাবেন না!

---

## ৩. reflog (\`git reflog\`): গিটের লাইফলাইন ও ডেটা রিকভারি

\`\`\`text
ভুল কমান্ড: git reset --hard HEAD~5 (৫টি কমিট মুছে গেল!)
                               │
                       git reflog চেক করুন
                               ▼
HEAD@{0}: reset: moving to HEAD~5   [ভুল বর্তমান অবস্থা]
HEAD@{1}: commit: feat: complete order API  [মুছে যাওয়া কাঙ্ক্ষিত কমিট: 8f3b2a1]
                               │
                 git branch safe-recovery 8f3b2a1
                               ▼
হারানো ৫টি কমিট অক্ষত অবস্থায় উদ্ধার!
\`\`\`

### \`git reflog\` কী?
Git-এ কোনো কমিট তৈরি করার পর তা সহজে কখনোই স্থায়ীভাবে মুছে যায় না। \`git reflog\` (Reference Log) হলো লোকাল গিটের একটি অভ্যন্তরীণ ডায়েরি, যা আপনার পিসিতে \`HEAD\` এবং ব্রাঞ্চ পয়েন্টারের প্রতিটি মুভমেন্টের রেকর্ড সংরক্ষণ করে।
* আপনি ভুল করে \`git reset --hard\` চালালেও বা \`git branch -D\` দিয়ে কোনো ব্রাঞ্চ ডিলিট করলেও সেই অবজেক্টগুলো মেমোরিতে **৩০ থেকে ৯০ দিন** পর্যন্ত সংরক্ষিত থাকে।

### ইমার্জেন্সি রিকভারি সিনারিও:

#### সিনারিও ১: \`git reset --hard\` আনডু করা
\`\`\`bash
# ১. রেফলগ লিস্ট দেখুন
git reflog

# ২. রিসেটের ঠিক আগের পয়েন্টারটিতে (HEAD@{1}) ফিরে যান:
git reset --hard HEAD@{1}

# অথবা নিরাপদে নতুন ব্রাঞ্চ তৈরি করে ডেটা উদ্ধার করুন:
git branch recovered-branch HEAD@{1}
\`\`\`

#### সিনারিও ২: দুর্ঘটনাবশত ডিলিট হওয়া ব্রাঞ্চ ফেরত আনা
\`\`\`bash
# রেফলগ থেকে ডিলিট হওয়া ব্রাঞ্চের শেষ কমিট হ্যাশটি বের করুন:
git reflog | grep "feature-name"

# হ্যাশ দিয়ে আবার নতুন ব্রাঞ্চ বানিয়ে ফেলুন:
git branch feature-name 7e2f1a0
\`\`\`

---

## ৪. Bisect (\`git bisect\`): বাইনারি সার্চ দিয়ে বাগ খোঁজা

\`\`\`text
কমিট হিস্ট্রি (৫০০টি কমিট):
v1.0.0 (ভালো ছিল) ─── C1 ─── C2 ─── ... ─── C250 (মাঝামাঝি) ─── ... ─── HEAD (বাগ আছে)
                                                   │
                                      টেস্ট রান করুন: ভালো না খারাপ?
                      ┌────────────────────────────┴────────────────────────────┐
                      ▼                                                         ▼
                  টেস্ট পাস                                                 টেস্ট ফেইল
          বাগ আছে C251 থেকে HEAD-এ                                    বাগ আছে v1.0.0 থেকে C250-এ
\`\`\`

### কেন \`O(log N)\` ম্যাজিকাল?
ধরা যাক প্রোডাকশনে একটি বাগ দেখা দিয়েছে যা গত ৫০০টি কমিটের কোনো একটিতে ঢুকেছে।
* একে একে ৫০০টি কমিট চেকআউট করে টেস্ট করতে পুরো দিন লেগে যাবে।
* কিন্তু \`git bisect\` বাইনারি সার্চ অ্যালগরিদম ব্যবহার করে মাত্র **৯টি ধাপে** ($2^9 = 512$) আসল ত্রুটিপূর্ণ কমিটটি শনাক্ত করে ফেলে!

### ম্যানুয়াল বাইসেক্ট প্রক্রিয়া:
\`\`\`bash
# ১. বাইসেক্ট শুরু করুন
git bisect start

# ২. বর্তমান কমিটটি খারাপ (বাগ আছে) বলে চিহ্নিত করুন
git bisect bad

# ৩. পেছনের যে ট্যাগ বা কমিটে বাগ ছিল না তা বলে দিন
git bisect good v1.0.0

# ৪. গিট নিজে থেকেই মাঝামাঝি কমিটে চেকআউট করিয়ে দেবে।
# অ্যাপ চালিয়ে টেস্ট করুন:
# যদি কাজ করে:
git bisect good
# যদি বাগ থাকে:
git bisect bad

# ৫. এভাবে কয়েকটি টেস্টের পরই গিট আউটপুট দেবে:
# "4f2a1b9 is the first bad commit"

# ৬. কাজ শেষ হলে আগের ব্রাঞ্চে ফিরতে:
git bisect reset
\`\`\`

### অটোমেটেড বাইসেক্ট (টেস্ট স্ক্রিপ্ট দিয়ে):
\`\`\`bash
git bisect start HEAD v1.0.0
# গিট সম্পূর্ণ নিজে নিজে টেস্ট চালিয়ে কয়েক সেকেন্ডে বাগ বের করবে:
git bisect run npm test
\`\`\`

---

## ৫. Submodules (\`git submodule\`)

\`\`\`text
মূল প্রজেক্ট রিপোজিটরি (Main App)
├── src/
├── .gitmodules  ──► সাবমডিউলের গিট ইউআরএল ও পাথ ট্র্যাক করে
└── libs/
    └── shared-core/  ──► [অন্য একটি স্বাধীন গিট রিপোর নির্দিষ্ট কমিট পয়েন্টার]
\`\`\`

### গিট সাবমডিউল কী?
একটি গিট রিপোজিটরির ভেতরে সাব-ডিরেক্টরি হিসেবে আরেকটি সম্পূর্ণ স্বাধীন গিট রিপোজিটরি যুক্ত রাখাকে সাবমডিউল বলে।
* প্যারেন্ট রিপোজিটরিতে সাবমডিউলের সমস্ত সোর্স কোড আলাদাভাবে ট্র্যাকিং হয় না; শুধু সাবমডিউল রিপোর **URL এবং একটি নির্দিষ্ট কমিট হ্যাশের পয়েন্টার** সেভ থাকে।

### বহুল ব্যবহৃত কমান্ডসমূহ:
\`\`\`bash
# ১. নতুন সাবমডিউল অ্যাড করা
git submodule add https://github.com/org/shared-auth.git libs/shared-auth

# ২. সাবমডিউলযুক্ত রিপোজিটরি ক্লোন করা:
# সাধারণ ক্লোনে ফোল্ডার খালি থাকে! তাই --recurse-submodules দিতে হয়:
git clone --recurse-submodules https://github.com/org/my-project.git

# সাধারণ ক্লোন করা থাকলে সাবমডিউল চালু করতে:
git submodule update --init --recursive

# ৩. রিমোট থেকে সাবমডিউলের লেটেস্ট আপডেট টানতে:
git submodule update --remote --merge
\`\`\`

---

## ৬. Worktrees (\`git worktree\`)

\`\`\`text
                          একই .git ফোল্ডার (শেয়ার্ড ডেটাবেজ)
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
ওয়ার্কট্রি ১: /projects/my-app                  ওয়ার্কট্রি ২: /projects/hotfix-temp
ব্রাঞ্চ: feature/new-dashboard                   ব্রাঞ্চ: hotfix/prod-crash
- চলমান কোড স্ট্যাশ করার দরকার নেই              - আলাদা ফোল্ডারে বাগ ফিক্স
- node_modules ও বিল্ড ফাইল অক্ষত                - ফিক্স শেষে পুশ করে ফোল্ডার ডিলিট!
\`\`\`

### \`git stash\`-এর চেয়ে কেন ওয়ার্কট্রি বহুগুণ সেরা?
ধরা যাক আপনি একটি বড় ফিচারের কোড লিখছেন যেখানে শত শত আন-কমিটেড ফাইল রয়েছে। হঠাৎ প্রোডাকশনে মারাত্মক ডাউনটাইম ঘটলো এবং আপনাকে ১৫ মিনিটের মধ্যে হটফিক্স দিতে হবে।
* **পুরোনো ঝামেলাপূর্ণ পদ্ধতি (\`git stash\`):** চলমান কাজ স্ট্যাশ করা, ব্রাঞ্চ বদলানো, প্যাকেজ ইনস্টল করা, বিল্ড ভাঙা, ফিক্স করা, আবার মূল ব্রাঞ্চে এসে স্ট্যাশ পপ করে কনফ্লিক্ট ফেস করা।
* **ওয়ার্কট্রি পদ্ধতি (\`git worktree\`):** চলমান ফোল্ডার স্পর্শ না করে, গিটকে বলবেন পাশের আরেকটি ফোল্ডারে \`hotfix\` ব্রাঞ্চ খুলে দিতে। আপনি হটফিক্স ফোল্ডারে গিয়ে বাগ ফিক্স করে পুশ করে দেবেন, আর আপনার মূল ফোল্ডারে ফিচার কোড ও বিল্ড ক্যাশ ১০০% অক্ষত থাকবে!

### কমান্ড গাইড:
\`\`\`bash
# ১. নতুন ওয়ার্কট্রি ডিরেক্টরি তৈরি করুন
git worktree add ../hotfix-folder -b hotfix/payment-error main

# ২. নতুন ফোল্ডারে প্রবেশ করুন:
cd ../hotfix-folder

# ৩. বাগ ফিক্স করে কমিট ও পুশ করুন:
git commit -am "fix: payment null exception"
git push origin hotfix/payment-error

# ৪. আগের মূল প্রজেক্টে ফিরে আসুন:
cd ../my-app

# ৫. হটফিক্স ওয়ার্কট্রি মুছে ফেলুন:
git worktree remove ../hotfix-folder

# ৬. একটিভ ওয়ার্কট্রি দেখতে:
git worktree list
\`\`\`

---

## ৭. Git Hooks (\`.git/hooks/\`)

\`\`\`text
কমিট কমান্ড চালানো হলো: git commit -m "feat: user login"
                 │
                 ▼
       [.git/hooks/pre-commit]  ──► Linter / Formatter / Secret Check
                 │ (সফল হলে এগিয়ে যাবে)
                 ▼
     [.git/hooks/commit-msg]   ──► কনভেনশনাল কমিট মেসেজ ফরমেট চেক
                 │ (সফল হলে)
                 ▼
        [কমিট সম্পন্ন হলো! ✅]
\`\`\`

### গিট হুকস কী?
গিট হুক হলো এমন কিছু অটোমেটেড স্ক্রিপ্ট যা গিটের নির্দিষ্ট কোনো ইভেন্ট (যেমন: \`commit\`, \`push\`, \`merge\`) ঘটার আগে বা পরে স্বয়ংক্রিয়ভাবে রান হয়। এগুলো থাকে লোকাল রিপোজিটরির \`.git/hooks/\` ফোল্ডারে।

### গুরুত্বপূর্ণ ক্লায়েন্ট-সাইড হুকসমূহ:
1. **\`pre-commit\`**: কোড কমিট হওয়ার আগেই রান হয়।
   * ব্যবহার: ESLint বা Prettier ফরম্যাটিং টেস্ট করা, এবং কোডে ভুলবশত কোনো API Key বা পাসওয়ার্ড আছে কিনা তা ব্লক করা। স্ক্রিপ্টটি ফেইল করলে কমিট বাতিল হয়ে যায়।
2. **\`commit-msg\`**: কমিট মেসেজের ফরম্যাট যাচাই করে।
   * ব্যবহার: টিমে কনভেনশনাল কমিট স্ট্যান্ডার্ড (যেমন: \`feat:\`, \`fix:\`, \`chore:\`) বাধ্যতামূলক করা।
3. **\`pre-push\`**: রিমোটে \`git push\` করার ঠিক পূর্বে রান হয়।
   * ব্যবহার: সম্পূর্ণ টেস্ট স্যুট (Unit Tests) রান করা যাতে কোনো ভাঙা কোড GitHub-এ আপলোড হতে না পারে।

### টিমের সাথে হুক শেয়ার করার আধুনিক পদ্ধতি:
ডিফল্টভাবে \`.git/hooks/\` ফোল্ডার গিটহাবে পুশ হয় না। তাই টিমের সমস্ত ডেভেলপারের পিসিতে হুক বাধ্যতামূলক করতে আধুনিক টুলস ব্যবহৃত হয়:
* **Husky (Node.js/Frontend):** \`npx husky-init\` এর মাধ্যমে প্রজেক্টে \`.husky/\` ফোল্ডারে হুক রাখা হয় যা গিটে কমিট হয়।
* **Native Git \`core.hooksPath\`:**
  \`\`\`bash
  # রিপোজিটরির .githooks ফোল্ডারকে অফিশিয়াল হুক ডিরেক্টরি বানান:
  git config core.hooksPath .githooks
  \`\`\`
`,
  },
  {
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
* **Collaboration Flow**: Fork repo on GitHub ➔ Clone your fork locally ➔ Create feature branch ➔ Push to your fork (\`origin\`) ➔ Open Pull Request to upstream author repository.

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
* **ওপেন সোর্স কাজের ধারা:** অন্যের রিপো Fork করুন ➔ নিজের ফর্ক পিসিতে Clone করুন ➔ ফিচার ব্রাঞ্চে কাজ করুন ➔ নিজের ফর্কে Push করুন ➔ মূল প্রজেক্টে Pull Request পাঠান।

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
  },
];

