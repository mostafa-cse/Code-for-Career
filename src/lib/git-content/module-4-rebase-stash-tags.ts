import type { LocalLesson } from "@/lib/lessons-data";

export const MODULE_4_LESSONS: LocalLesson[] = [
  {
    slug: "git-merge-vs-rebase",
    titleEn: "Git Merge vs Rebase: Mechanics, Interactive Rebase & Golden Rule",
    titleBn: "গিট মার্জ বনাম রিব্যাস: মেকানিক্স, ইন্টারঅ্যাক্টিভ রিব্যাস ও গোল্ডেন রুল",
    categoryEn: "11. Rebase & History Hygiene",
    categoryBn: "১১. রিব্যাস ও হিস্ট্রি হাইজিন",
    categoryDescEn: "Architectural comparison of merge vs rebase, replaying commits, interactive squash/fixup, resolving rebase conflicts, and the Golden Rule.",
    categoryDescBn: "মার্জ বনাম রিব্যাসের অভ্যন্তরীণ তুলনা, কমিট রিপ্লে, ইন্টারঅ্যাক্টিভ স্কোয়াশ/ফিক্সআপ, রিব্যাস কনফ্লিক্ট এবং রিব্যাসের গোল্ডেন রুল।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the most critical advanced Git skill for senior interviews: git rebase, interactive rebasing, history flattening, and avoiding broken public histories.",
    descriptionBn: "সিনিয়র পদের ইন্টারভিউয়ের অন্যতম প্রধান বিষয় শিখুন: git rebase, ইন্টারঅ্যাক্টিভ রিব্যাস, হিস্ট্রি সাজানো এবং শেয়ার্ড ব্রাঞ্চের সুরক্ষা।",
    difficulty: "HARD",
    displayOrder: 11,
    prerequisites: ["git-merging"],
    estimatedMinutes: 35,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Atlassian Git Tutorials",
        title: "Merging vs Rebasing",
        url: "https://www.atlassian.com/git/tutorials/merging-vs-rebasing",
        description: "Comprehensive guide to architectural tradeoffs between merge and rebase.",
        isStarred: true,
      },
      {
        source: "Git Documentation",
        title: "Rewriting History with Interactive Rebase",
        url: "https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History",
        description: "Official documentation on squash, fixup, reword, and drop.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "State the Golden Rule of Rebasing and explain what catastrophe occurs if violated",
        url: null,
        difficulty: "HARD",
        company: "Optimizely / Enosis",
        tags: ["Git", "Rebase", "Golden Rule", "Force Push"],
        solutionEn: "The Golden Rule of Rebasing: Never rebase commits that exist outside your local repository and that other developers have based work on. Because rebase rewrites commit hashes (replays them with new SHAs), force-pushing a rebased public branch forces other developers' local branches to diverge wildly, corrupting pull requests and producing duplicate phantom commits.",
        solutionBn: "রিব্যাসের গোল্ডেন রুল: অন্য ডেভেলপারদের সাথে শেয়ার করা পাবলিক ব্রাঞ্চ (যেমন main বা develop) কখনোই রিব্যাস করবেন না। কারণ রিব্যাস প্রতিটি কমিটের হ্যাশ (SHA) পরিবর্তন করে ফেলে। শেয়ার্ড ব্রাঞ্চে রিব্যাস করে ফোর্স পুশ করলে সহকর্মীদের লোকাল ব্রাঞ্চে তীব্র অসঙ্গতি ও ডুপ্লিকেট কমিটের বিশৃঙ্খলা তৈরি হয়।",
      },
    ],
    contentEn: `# Git Merge vs Rebase: Mechanics, Interactive Rebase & Golden Rule

Understanding the architectural and operational differences between \`git merge\` and \`git rebase\` is one of the most definitive benchmarks separating junior developers from senior engineers in technical interviews. Both commands integrate changes from one branch into another, but their philosophies, mechanics, and effects on Git history are fundamentally opposite.

Here is the complete, comprehensive guide across all 7 essential areas:

---

## 1. git merge (Preserving Historical Truth)

\`git merge\` takes the commits from a feature branch and combines them into your target branch (e.g., \`main\`) by creating a brand-new **Three-Way Merge Commit**.

\`\`\`
Before Merge:
main:     C1 ──► C2 ──► C3
                  \
feature:           C4 ──► C5

After 'git switch main && git merge feature':
main:     C1 ──► C2 ──► C3 ───────► M (Merge Commit with 2 parents: C3 & C5)
                  \                ▲
feature:           C4 ──► C5 ──────┘
\`\`\`

### Key Characteristics:
* **Non-destructive**: Existing commit hashes and branch histories are never rewritten. The timeline of when commits were actually made remains 100% intact.
* **Traceable**: You can clearly see where a branch started, who worked on it, and when it was merged back.
* **The Downside**: In busy teams with multiple developers merging frequently, the commit history can become a tangled, confusing "railroad track" graph cluttered with dozens of trivial \`Merge branch 'feature' of...\` commits.

---

## 2. git rebase (Rewriting a Linear History)

\`git rebase\` takes the commits from your current branch, temporarily shelves them, updates your branch's base to the latest commit of the target branch, and then **replays your commits one by one** on top.

\`\`\`
Before Rebase:
main:     C1 ──► C2 ──► C3
                  \
feature:           C4 ──► C5

After 'git switch feature && git rebase main':
main:     C1 ──► C2 ──► C3
                         \
feature:                  C4' ──► C5' (Replayed commits with brand NEW SHA hashes!)
\`\`\`

### Key Characteristics:
* **Linear History**: Eliminates intermediate merge commits entirely. The commit history reads like a clean, single chronological story where all work was done sequentially.
* **Simplified \`git log\` & \`git bisect\`**: Finding bugs using automated binary search (\`git bisect\`) is much faster and cleaner in a linear history without branch diamond loops.
* **Rewrites History**: Because the base commit changes, Git creates **brand-new commits** (with new SHA-1/SHA-256 hashes). The old commits (\`C4\`, \`C5\`) are eventually garbage collected.

---

## 3. Interactive Rebase (\`git rebase -i\`)

Interactive rebase is the developer's ultimate Swiss Army knife for cleaning up messy, work-in-progress (WIP) local commits before presenting code in a Pull Request.

\`\`\`bash
# Interactively rebase the last 4 commits on your current branch:
git rebase -i HEAD~4

# Or rebase against the latest origin/main:
git rebase -i origin/main
\`\`\`

Git opens your default terminal editor showing your commits in chronological order from oldest to newest:

\`\`\`
pick a1b2c3d feat(auth): add JWT token generator
pick e4f5g6h fix typo in expiration claims
pick i7j8k9l WIP: auth unit tests
pick m0n1o2p update readme documentation
\`\`\`

### Interactive Action Commands:

| Command | Short | What it does |
| :--- | :--- | :--- |
| **\`pick\`** | \`p\` | Keep the commit as-is. |
| **\`reword\`** | \`r\` | Keep the commit, but edit its commit message. |
| **\`squash\`** | \`s\` | Meld the commit into the previous commit and **combine their messages**. |
| **\`fixup\`** | \`f\` | Meld into previous commit, **discarding this commit's log message** (ideal for typo/lint fixes!). |
| **\`edit\`** | \`e\` | Pause rebase at this commit to amend files, split commits, or add new changes. |
| **\`drop\`** | \`d\` | Completely remove and delete this commit from history. |
| **Reorder** | — | Simply cut and paste lines into a different order to change the commit sequence! |

---

## 4. Rebase Conflicts (Commit-by-Commit Resolution)

Unlike \`git merge\` (where all conflicts are resolved at once in a single merge commit), \`git rebase\` applies commits **one at a time**. If commit \`C4'\` has a conflict, Git pauses the rebase and waits for your input.

### Step-by-Step Conflict Resolution Workflow:

\`\`\`bash
# 1. Start rebase against main:
git rebase main

# CONFLICT detected! Git pauses at the conflicting commit:
# error: could not apply a1b2c3d... feat: order controller

# 2. Open conflicting files and resolve conflict markers:
# <<<<<<< HEAD (code from main)
# =======
# >>>>>>> a1b2c3d (your commit being replayed)

# 3. Stage the resolved files:
git add src/Controllers/OrderController.cs

# 4. CRITICAL RULE: DO NOT RUN 'git commit'!
# Instead, continue the rebase:
git rebase --continue

# If things go completely wrong and you want to cancel everything safely:
git rebase --abort

# If a commit becomes empty because its changes were already applied in main:
git rebase --skip
\`\`\`

---

## 5. When to Merge (Use Cases)

Choose **\`git merge\`** in the following scenarios:
1. **Merging into Public/Shared Branches**: When bringing a completed feature into \`main\` or \`develop\`.
2. **Preserving Complete Audit Trails**: When regulatory compliance or company policy demands knowing the exact historical timestamp of when branches diverged and merged.
3. **Pull Request Merges**: When clicking "Create a merge commit" on GitHub to formally close a PR while retaining its full granular branch history.
4. **When Working on a Shared Feature Branch**: If two developers are collaborating on the same feature branch, use merge to sync between their machines.

---

## 6. When to Rebase (Use Cases)

Choose **\`git rebase\`** in the following scenarios:
1. **Cleaning Local Commits Before PR**: Squashing 15 micro-commits ("fix typo", "oops", "testing CI") into 1 or 2 clean atomic commits before requesting code review.
2. **Updating Your Feature Branch with \`main\`**:
   \`\`\`bash
   # Pull latest main without cluttering your feature branch with merge commits:
   git fetch origin
   git rebase origin/main
   \`\`\`
3. **\`git pull --rebase\`**: Keeps your local branch linear whenever pulling remote updates.
4. **Trunk-Based Development**: In teams where the continuous integration philosophy mandates a linear, single-branch git graph.

---

## 7. Rebase Best Practices & The Golden Rule

> [!CAUTION]
> ### 🛡️ The Golden Rule of Rebasing:
> **NEVER rebase commits that exist outside your local machine and have been pushed to a shared public branch where other developers are working!**

### Why is violating the Golden Rule catastrophic?
Because rebase rewrites commit hashes (replays them with new SHAs). If you rebase a shared branch like \`main\` and force-push it:
- Teammates who branched off the old commits will have branches that diverge wildly.
- When they pull or push, Git will resurrect the old commits alongside the rebased ones, creating duplicate "phantom" commits and massive merge nightmares.

### Summary Comparison Table:

| Criterion | \`git merge\` | \`git rebase\` |
| :--- | :--- | :--- |
| **History Shape** | Branched, non-linear graph with merge commits | Strictly linear, clean straight line |
| **Commit Hashes** | Original hashes preserved intact | New commit hashes generated (Rewrites history) |
| **Conflict Handling** | Resolved once during merge commit | Resolved commit-by-commit during replay |
| **Traceability** | Exact historical chronology preserved | Polished, clean logical story |
| **Safety on Public Branches** | 🟢 100% Safe | 🔴 Dangerous (violates Golden Rule) |
| **Best Used On** | Public/shared branches (\`main\`, \`develop\`) | Private local feature branches before PR |
`,
    contentBn: `# গিট মার্জ বনাম রিব্যাস: মেকানিক্স, ইন্টারঅ্যাক্টিভ রিব্যাস ও গোল্ডেন রুল

সফটওয়্যার ইঞ্জিনিয়ারিংয়ের টেকনিক্যাল ইন্টারভিউতে একজন জুনিয়র ডেভেলপার ও সিনিয়র ইঞ্জিনিয়ারের জ্ঞানের গভীরতা যাচাইয়ের সবচেয়ে জনপ্রিয় প্রশ্ন হলো: **"git merge এবং git rebase-এর পার্থক্য কী এবং কখন কোনটি ব্যবহার করবেন?"**

উভয় কমান্ডেরই মূল উদ্দেশ্য এক ব্রাঞ্চের কোড অন্য ব্রাঞ্চে সমন্বয় করা, তবে তাদের মেকানিক্স এবং হিস্ট্রির ওপর প্রভাব সম্পূর্ণ বিপরীত। নিচে ৭টি সাব-সেকশনে সহজ ভাষায় বিস্তারিত তুলে ধরা হলো:

---

## ১. git merge (ঐতিহাসিক সত্য অক্ষত রাখা)

\`git merge\` আপনার ফিচার ব্রাঞ্চের কোডকে মূল ব্রাঞ্চের সাথে যুক্ত করতে একটি নতুন **Three-Way Merge Commit** তৈরি করে।

\`\`\`
মার্জের পূর্বে:
main:     C1 ──► C2 ──► C3
                  \
feature:           C4 ──► C5

'git switch main && git merge feature' এর পরে:
main:     C1 ──► C2 ──► C3 ───────► M (মার্জ কমিট, যার প্যারেন্ট ২টি: C3 ও C5)
                  \                ▲
feature:           C4 ──► C5 ──────┘
\`\`\`

### প্রধান বৈশিষ্ট্য:
* **নন-ডেস্ট্রাকটিভ (নিরাপদ)**: বিদ্যমান কোনো কমিটের হ্যাশ বা হিস্ট্রি পরিবর্তন হয় না। ঠিক কোন সময়ে ব্রাঞ্চ আলাদা হয়েছিল এবং কখন যুক্ত হয়েছে তার পূর্ণাঙ্গ ঐতিহাসিক সত্য সংরক্ষিত থাকে।
* **অসুবিধা**: টিমে ঘন ঘন মার্জ করলে গিট হিস্ট্রি ট্রেনের লাইনের মতো জটিল ও প্যাঁচানো দেখায় এবং অপ্রয়োজনীয় মার্জ কমিটে হিস্ট্রি বিশৃঙ্খল হয়ে পড়ে।

---

## ২. git rebase (লিনিয়ার ইতিহাস তৈরি করা)

\`git rebase\` আপনার ব্রাঞ্চের নতুন কমিটগুলোকে সাময়িকভাবে আলাদা করে তুলে নেয়, তারপর আপনার ব্রাঞ্চের বেসকে টার্গেট ব্রাঞ্চের (যেমন \`main\`) সর্বশেষ কমিটের মাথায় বসায় এবং এরপর **আপনার কমিটগুলোকে একে একে পুনরায় প্লে (Replay) করে**।

\`\`\`
রিব্যাসের পূর্বে:
main:     C1 ──► C2 ──► C3
                  \
feature:           C4 ──► C5

'git switch feature && git rebase main' এর পরে:
main:     C1 ──► C2 ──► C3
                         \
feature:                  C4' ──► C5' (নতুন হ্যাশসহ রিব্যাসকৃত কমিট!)
\`\`\`

### প্রধান বৈশিষ্ট্য:
* **সোজা লিনিয়ার হিস্ট্রি**: কোনো অতিরিক্ত মার্জ কমিট তৈরি হয় না। হিস্ট্রি দেখতে মনে হয় যেন সব কাজ ক্রমানুসারে একটি সোজা লাইনে করা হয়েছে।
* **ইতিহাস পুনর্লিখন (Rewriting History)**: মনে রাখবেন, রিব্যাস কিন্তু পুরনো কমিটগুলোকে হুবহু রাখে না; সে নতুন হ্যাশসহ নতুন কমিট তৈরি করে (\`C4'\`, \`C5'\`)।

---

## ৩. ইন্টারঅ্যাক্টিভ রিব্যাস (Interactive Rebase: \`git rebase -i\`)

পিআর (Pull Request) পাঠানোর আগে নিজের লোকাল মেশিনের অগোছালো, খসড়া কমিটগুলোকে সাজিয়ে-গুছিয়ে সুন্দর করার জন্য **Interactive Rebase** হলো সবচেয়ে শক্তিশালী টুল।

\`\`\`bash
# লোকাল ব্রাঞ্চের শেষ ৪টি কমিট ইন্টারঅ্যাক্টিভভাবে সাজাতে:
git rebase -i HEAD~4
\`\`\`

টার্মিনালে টেক্সট এডিটর ওপেন হবে যেখানে পুরনো থেকে নতুন ক্রমে কমিটগুলো দেখা যাবে:

\`\`\`
pick a1b2c3d feat(auth): implement jwt token generation
pick e4f5g6h fix typo in token expiration claims
pick i7j8k9l WIP: unit tests for auth
pick m0n1o2p update readme documentation
\`\`\`

### প্রয়োজনীয় কমান্ড তালিকা:
* **\`pick\` (p)**: কমিটটি অপরিবর্তিত রাখা।
* **\`reword\` (r)**: কমিট ঠিক রেখে শুধু কমিট মেসেজ পরিবর্তন করা।
* **\`squash\` (s)**: কমিটটিকে আগের কমিটের সাথে মিলিয়ে দেওয়া এবং উভয় মেসেজকে একত্রিত করা।
* **\`fixup\` (f)**: কোনো মেসেজ না রেখে সরাসরি আগের কমিটের ভেতরে ঢুকিয়ে দেওয়া (ছোটখাটো টাইপো বা বাগ ফিক্সের জন্য সেরা ⭐)।
* **\`drop\` (d)**: কোনো কমিটকে ইতিহাস থেকে চিরতরে মুছে ফেলা।
* **ক্রম পরিবর্তন**: লাইনের স্থান পরিবর্তন (Cut-Paste) করলেই কমিটের ক্রম বদলে যাবে!

---

## ৪. রিব্যাস কনফ্লিক্ট সমাধান (Rebase Conflicts)

মার্জে কনফ্লিক্ট আসে সব কোড মেলানোর সময় একবারে। কিন্তু রিব্যাসে প্রতিটি কমিট একে একে রি-প্লে হওয়ার সময় **কমিট-বাই-কমিট** কনফ্লিক্ট আসতে পারে।

### কনফ্লিক্ট সমাধানের সঠিক ধাপ:
\`\`\`bash
# ১. রিব্যাস শুরু করার পর কনফ্লিক্ট আসলে গিট রিব্যাস পজ করে দেয়:
# CONFLICT (content): Merge conflict in src/Services/AuthService.cs

# ২. ফাইল ওপেন করে কনফ্লিক্ট মার্কার (<<<<<<<, =======, >>>>>>>) মুছে সমাধান করুন।

# ৩. সমাধানকৃত ফাইলটি স্টেজিং এরিয়ায় যুক্ত করুন:
git add src/Services/AuthService.cs

# ৪. ⚠️ মারাত্মক ভুল এড়িয়ে চলুন: কখনো 'git commit' চালাবেন না!
# বরং গিটকে পরবর্তী কমিট প্লে করতে বলুন:
git rebase --continue

# পরিস্থিতি নিয়ন্ত্রণের বাইরে গেলে রিব্যাস বাতিল করে আগের অবস্থায় ফিরতে:
git rebase --abort
\`\`\`

---

## ৫. কখন মার্জ ব্যবহার করবেন? (When to Merge)

1. **পাবলিক বা টিম ব্রাঞ্চে কোড নেওয়ার সময়**: ফিচার ব্রাঞ্চের কাজ শেষ করে যখন \`main\` বা \`develop\`-এ যুক্ত করবেন।
2. **ঐতিহাসিক অডিট বজায় রাখতে**: যখন প্রজেক্টে জানতে হবে ঠিক কোন তারিখে ফিচারটি মূল ব্রাঞ্চে এসেছিল।
3. **গিটহাবে পুল রিকোয়েস্ট মার্জের সময়**: যখন আপনি PR-এর পূর্ণাঙ্গ আলাদা অস্তিত্ব সংরক্ষণ করতে চান।

---

## ৬. কখন রিব্যাস ব্যবহার করবেন? (When to Rebase)

1. **পিআর জমা দেওয়ার আগে লোকাল কমিট সাজাতে**: নিজের ১০টি অগোছালো কমিটকে ইন্টারঅ্যাক্টিভ রিব্যাস দিয়ে ১-২টি চমৎকার কমিটে স্কোয়াশ করতে।
2. **মেইনের নতুন আপডেট নিজের ফিচার ব্রাঞ্চে টেনে নিতে**:
   \`\`\`bash
   git fetch origin
   git rebase origin/main
   \`\`\`
   *(এতে আপনার ফিচার ব্রাঞ্চে অহেতুক মার্জ কমিট তৈরি হবে না)*।
3. **\`git pull --rebase\`**: লোকাল কোড পুল করার সময় হিস্ট্রি সোজা রাখতে।

---

## ৭. রিব্যাসের গোল্ডেন রুল ও সেরা প্র্যাকটিস

> [!CAUTION]
> ### 🛡️ The Golden Rule of Rebasing:
> **যে কমিটগুলো ইতিমধ্যে ইন্টারনেটে গিটহাবে পুশ করা হয়েছে এবং যে ব্রাঞ্চে অন্য সহকর্মীরা কাজ করছেন, সেই পাবলিক বা শেয়ার্ড ব্রাঞ্চে কখনোই রিব্যাস করবেন না!**

### গোল্ডেন রুল ভাঙলে কী সর্বনাশ হয়?
রিব্যাস কমিটের হ্যাশ পরিবর্তন করে। আপনি যদি শেয়ার্ড ব্রাঞ্চে রিব্যাস করে গিটহাবে \`push --force\` করেন, তবে সহকর্মীদের লোকাল কোডের সাথে রিমোটের কোড মারাত্মকভাবে অমিল (Diverge) হবে। পরবর্তীতে তাঁরা পুল বা পুশ করতে গেলে ডুপ্লিকেট ফ্যান্টম কমিট ও মার্জ কনফ্লিক্টের এক ভয়াবহ বিশৃঙ্খলা তৈরি হবে।

### এক নজরে তুলনা:

| তুলনার বিষয় | \`git merge\` | \`git rebase\` |
| :--- | :--- | :--- |
| **হিস্ট্রি গ্রাফ** | শাখা-প্রশাখাযুক্ত ৩-ওয়ে মার্জ হিস্ট্রি | সোজা, পরিচ্ছন্ন লিনিয়ার লাইন |
| **কমিট হ্যাশ** | পুরনো হ্যাশ ১০০% অক্ষত থাকে | নতুন কমিট হ্যাশ তৈরি হয় (ইতিহাস বদলায়) |
| **কনফ্লিক্ট সমাধান**| একবারে মার্জ কমিটে সমাধান | প্রতিটি কমিট রি-প্লে হওয়ার সময় ধাপে ধাপে |
| **পাবলিক ব্রাঞ্চে নিরাপত্তা** | 🟢 সম্পূর্ণ নিরাপদ | 🔴 মারাত্মক ঝুঁকিপূর্ণ |
| **আদর্শ স্থান** | শেয়ার্ড ব্রাঞ্চ (\`main\`, \`develop\`) | লোকাল ব্যক্তিগত ফিচার ব্রাঞ্চ |
`,
  },
  {
    slug: "git-stash",
    titleEn: "Stash: Shelving, Popping, Applying, Branching & Untracked Stashes",
    titleBn: "গিট স্ট্যাশ: কোড শেলভিং, পপ, অ্যাপ্লাই ও ড্রপ কৌশল",
    categoryEn: "12. Temporary Storage & Stashing",
    categoryBn: "১২. টেম্পোরারি স্টোরেজ ও স্ট্যাশিং",
    categoryDescEn: "Shelving dirty working directory changes, git stash pop vs apply, managing stash stacks, and stashing untracked files.",
    categoryDescBn: "অসমাপ্ত কাজ সাময়িক সরিয়ে রাখা, git stash pop বনাম apply, স্ট্যাশ লিস্ট ম্যানেজমেন্ট ও আনট্র্যাকড ফাইল স্ট্যাশ করা।",
    categoryPriority: "CORE",
    descriptionEn: "Learn how to use Git's clipboard to pause current work, switch branches for urgent hotfixes, and resume seamlessly.",
    descriptionBn: "গিটের ক্লিপবোর্ড ব্যবহার করে চলমান অসম্পূর্ণ কাজ সাময়িক তুলে রাখা, জরুরি হটফিক্স করা এবং পুনরায় কাজে ফিরে আসার নিয়ম শিখুন।",
    difficulty: "EASY",
    displayOrder: 12,
    prerequisites: ["git-working-with-changes"],
    estimatedMinutes: 20,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Git Tools — Stashing and Cleaning",
        url: "https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning",
        description: "Official guide on stashing working tree modifications.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "What is the difference between 'git stash pop' and 'git stash apply'?",
        url: null,
        difficulty: "EASY",
        company: "Brain Station 23",
        tags: ["Git", "Stash", "Stash Pop", "Stash Apply"],
        solutionEn: "'git stash pop' applies the most recent stashed changes back onto your working directory AND removes it from the stash stack. 'git stash apply' restores the changes to your working directory but KEEPS the stash entry saved in the stash list for reuse on another branch.",
        solutionBn: "'git stash pop' স্ট্যাশ করা কোড ফিরিয়ে আনে এবং সাথে সাথেই স্ট্যাশ লিস্ট থেকে তা ডিলিট করে দেয়। আর 'git stash apply' কোড ফিরিয়ে আনলেও স্ট্যাশটি লিস্টে অক্ষত রাখে, যাতে প্রয়োজনে অন্য ব্রাঞ্চেও একই পরিবর্তন অ্যাপ্লাই করা যায়।",
      },
    ],
    contentEn: `# Stash: Shelving, Popping, Applying, Branching & Untracked Stashes

Suppose you are deep into writing a complex, multi-file feature. Suddenly, your team lead alerts you to a critical production outage that requires an immediate hotfix. You need to switch to \`main\` right away, but Git refuses:  
\`error: Your local changes to the following files would be overwritten by checkout...\`

You cannot make a messy "WIP: broken code" commit. The elegant, professional solution is **\`git stash\`**.

Here is the complete guide across all 6 core sub-sections of Git Stash:

---

## 1. git stash (How Stash Works)

### Real-world Analogy:
> Imagine your office desk is covered with messy paperwork for Project Alpha. Your manager rushes in asking for urgent revisions on Project Beta. You do not throw your Alpha paperwork into the trash, nor do you hastily bind it into an unfinished report. Instead, you sweep all your active papers into a dedicated desk drawer and shut it. Your desk is now 100% clean. When Beta is finished, you open the drawer, lay out your papers, and pick up right where you left off.

### Mechanics:
\`git stash\` takes all uncommitted modifications from your working directory (both staged and modified tracked files), saves them onto an internal **LIFO (Last-In-First-Out) stack**, and reverts your working directory to match the clean \`HEAD\` commit.

\`\`\`bash
# Basic stash (saves on stack without a custom message):
git stash

# Professional best practice: always provide a descriptive message:
git stash push -m "WIP: cart checkout discount calculation logic"
\`\`\`

Now your working directory is completely clean (\`git status\` shows "nothing to commit, working tree clean"), allowing you to safely switch branches, pull remote code, or perform emergency hotfixes!

---

## 2. git stash pop (Restore and Delete)

When you return to your feature branch and want to resume your work:

\`\`\`bash
# Switch back to your feature branch:
git switch feature/cart-discount

# Apply the most recent stash AND immediately remove it from the stash stack:
git stash pop
\`\`\`

### What happens on conflict?
If the branch's code changed while you were away and applying the stash triggers a conflict:
- Git will restore the conflicting files with standard conflict markers (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`).
- **Safety Feature**: Git **DOES NOT delete** the stash from the stack! The stash remains safely stored in \`git stash list\` until you manually resolve the conflict and drop it.

---

## 3. git stash apply (Restore and Keep)

\`git stash apply\` restores your stashed changes back into your working directory, but **KEEPS the stash entry saved on the stack**.

\`\`\`bash
# Apply the most recent stash, keeping it on the stack:
git stash apply

# Apply a specific older stash from your history:
git stash apply stash@{2}
\`\`\`

### Why use \`apply\` instead of \`pop\`?
1. **Multi-Branch Testing**: You want to test the exact same experimental configuration or logging tweaks across multiple branches (\`feature/api-v1\`, \`feature/api-v2\`).
2. **Defensive Safety**: You want to apply your changes, verify that your unit tests still compile and pass, and only then manually drop the stash once you are confident.

---

## 4. git stash list (Inspecting Saved Stashes)

You can save multiple stashes over time. \`git stash list\` displays the entire stack:

\`\`\`bash
git stash list
\`\`\`

### Sample Output:
\`\`\`
stash@{0}: On feature/cart: WIP: discount calculation logic
stash@{1}: On main: WIP: temporary CORS policy for local debugging
stash@{2}: On bugfix/auth: WIP: refresh token expiry unit test
\`\`\`

### Inspecting a stash without applying it:
\`\`\`bash
# View summary of changed files in a stash:
git stash show stash@{0}

# View line-by-line diff of what is inside the stash:
git stash show -p stash@{0}
\`\`\`

---

## 5. git stash drop & clear (Cleanup)

Leaving dozens of obsolete stashes accumulates clutter and confusion. Clean up unwanted stashes systematically:

\`\`\`bash
# Delete the most recent stash (stash@{0}):
git stash drop

# Delete a specific older stash:
git stash drop stash@{2}

# Permanently delete ALL stashes across your entire repository:
git stash clear
\`\`\`

> [!CAUTION]
> **Warning**: \`git stash clear\` is permanent and completely wipes all saved stashes on all branches. Make sure you don't have unfinished work in any stash before running it!

---

## 6. Stashing Uncommitted Changes (Untracked, Staged & Ignored)

By default, running a bare \`git stash\` **ONLY saves tracked files**. If you created brand-new files that have never been committed, Git will leave them behind in your working tree!

### A. Including Untracked Files (\`-u\` / \`--include-untracked\`):
\`\`\`bash
# Stashes modified tracked files AND brand-new untracked files:
git stash -u -m "WIP: includes new PaymentGatewayService.cs class"
\`\`\`

### B. Including Everything, Even Ignored Files (\`-a\` / \`--all\`):
\`\`\`bash
# Stashes tracked, untracked, AND files ignored in .gitignore (e.g., .env, build output):
git stash -a -m "WIP: complete project state snapshot"
\`\`\`

### C. Stashing ONLY Staged Changes (\`--staged\` — Git 2.35+):
\`\`\`bash
# Stashes only files staged with 'git add', leaving other unstaged edits in your workspace:
git stash --staged -m "WIP: only staged authentication endpoints"
\`\`\`

### D. Stashing Specific Individual Files:
\`\`\`bash
# Stash only a single file, keeping other modified files untouched:
git stash push -m "WIP: auth config" src/Config/AuthConfig.cs
\`\`\`

---

## Quick Reference Summary

| Command | What it does | Keeps in Stack? |
| :--- | :--- | :--- |
| \`git stash push -m "msg"\` | Saves tracked changes with message | Stacked |
| \`git stash -u -m "msg"\` | Saves tracked + **untracked new files** | Stacked |
| \`git stash pop\` | Restores top stash & **deletes** it from stack | ❌ Deleted |
| \`git stash apply\` | Restores top stash & **keeps** it on stack | 🟢 Kept |
| \`git stash list\` | Displays all saved stashes with indices | Read-only |
| \`git stash show -p stash@{0}\` | Shows line-by-line diff inside a stash | Read-only |
| \`git stash drop stash@{n}\` | Deletes a specific stash entry | ❌ Deleted |
| \`git stash clear\` | Wipes the entire stash stack permanently | ❌ Cleared |
`,
    contentBn: `# গিট স্ট্যাশ: কোড শেলভিং, পপ, অ্যাপ্লাই, ড্রপ ও আনকমিটেড কাজ সংরক্ষণ

মনে করুন আপনি একটি জটিল ফিচারে কোড লিখছেন এবং বেশ কয়েকটি ফাইলে প্রচুর অসম্পূর্ণ কাজ করা আছে। ঠিক তখনই প্রজেক্ট ম্যানেজার জানালেন যে প্রোডাকশন সার্ভারে মারাত্মক একটি বাগ ধরা পড়েছে যা এখনই \`main\` ব্রাঞ্চে গিয়ে ফিক্স করতে হবে।

আপনি যখনই \`git switch main\` দিতে গেলেন, গিট এরর দিল:  
\`error: Your local changes to the following files would be overwritten by checkout...\`

আপনি এই অসম্পূর্ণ ভাঙা কোড কমিটও করতে পারছেন না, আবার কাজ মুছেও ফেলতে পারছেন না। এই কঠিন সমস্যার সবচেয়ে পরিচ্ছন্ন ও প্রফেশনাল সমাধান হলো **\`git stash\`**।

নিচে গিট স্ট্যাশের ৬টি সাব-সেকশন সহজ ভাষায় বিস্তারিত আলোচনা করা হলো:

---

## ১. git stash (কীভাবে কাজ করে?)

### বাস্তব জীবনের উপমা:
> মনে করুন আপনার অফিসের ডেস্কে একটি প্রজেক্টের প্রচুর কাগজপত্র এলোমেলোভাবে ছড়ানো। হঠাৎ বস এসে বললেন খুব জরুরি অন্য একটি ফাইলের কাজ এক্ষুনি করে দিতে হবে। আপনি ডেস্কে ছড়িয়ে থাকা কাগজগুলো ডাস্টবিনে ফেলে দেবেন না, আবার অসম্পূর্ণ অবস্থায় ফাইলও করবেন না। আপনি সবগুলো কাগজ আলতো করে তুলে টেবিলের ড্রয়ারে রেখে ড্রয়ারটি বন্ধ করে দিলেন। আপনার ডেস্ক এখন ১০০% পরিষ্কার। বসের কাজ শেষ করে আপনি ড্রয়ার খুলে কাগজগুলো বের করে আবার আগের জায়গা থেকে কাজ শুরু করলেন।

### কার্যপ্রণালী:
\`git stash\` আপনার ওয়ার্কিং ডিরেক্টরির সমস্ত আনকমিটেড কাজ (মডিফাইড ফাইল ও স্টেজিং এরিয়ার কোড) একটি গোপন **LIFO (Last-In-First-Out) স্ট্যাক মেমোরিতে** তুলে রাখে এবং আপনার প্রজেক্টকে একদম পরিচ্ছন্ন \`HEAD\` কমিটে ফিরিয়ে দেয়।

\`\`\`bash
# সাধারণ স্ট্যাশ:
git stash

# প্রফেশনাল বেস্ট প্র্যাকটিস: সর্বদা অর্থপূর্ণ মেসেজসহ স্ট্যাশ করুন:
git stash push -m "WIP: discount calculation logic"
\`\`\`

এখন আপনার ওয়ার্কস্পেস সম্পূর্ণ ক্লিন! এবার আপনি নির্দ্বিধায় ব্রাঞ্চ বদলাতে পারেন বা হটফিক্স করতে পারেন।

---

## ২. git stash pop (কোড ফিরিয়ে আনা ও মুছে ফেলা)

জরুরি কাজ শেষে যখন আপনি পুনরায় নিজের আগের ফিচার ব্রাঞ্চে ফিরে আসবেন:

\`\`\`bash
# নিজের ফিচার ব্রাঞ্চে সুইচ করুন:
git switch feature/discount-api

# স্ট্যাশ থেকে কোড ফিরিয়ে আনুন এবং সাথে সাথে স্ট্যাক থেকে তা মুছে ফেলুন:
git stash pop
\`\`\`

### মার্জ কনফ্লিক্ট হলে কী ঘটবে?
আপনি যখন অন্য কাজে ছিলেন, সেই সময়ে যদি ব্রাঞ্চের কোডে এমন কোনো পরিবর্তন হয়ে থাকে যা আপনার স্ট্যাশের সাথে মেলে না:
- গিট ফাইলে স্বাভাবিক কনফ্লিক্ট মার্কার দেখাবে।
- **নিরাপত্তা সুবিধা**: গিট কিন্তু স্ট্যাশ মেমোরি থেকে কোডটি **মুছে ফেলবে না**! এটি \`stash@{0}\` হিসেবে অক্ষত থাকবে, যাতে আপনি নিরাপদে সমাধান করতে পারেন।

---

## ৩. git stash apply (কোড ফিরিয়ে আনা কিন্তু স্ট্যাকে রাখা)

\`git stash apply\` আপনার স্ট্যাশ করা কোড ওয়ার্কিং ডিরেক্টরিতে ফিরিয়ে আনে, কিন্তু **স্ট্যাশ মেমোরি থেকে তা ডিলিট করে না**।

\`\`\`bash
# সর্বশেষ স্ট্যাশ ফিরিয়ে আনুন (মেমোরিতে অক্ষত রেখে):
git stash apply

# পেছনের কোনো নির্দিষ্ট স্ট্যাশ ফিরিয়ে আনতে:
git stash apply stash@{2}
\`\`\`

### কখন \`pop\` না করে \`apply\` ব্যবহার করবেন?
1. **একাধিক ব্রাঞ্চে টেস্ট করতে**: আপনি একটি পরীক্ষামূলক কোড বা কনফিগারেশন লিখে একাধিক ভিন্ন ভিন্ন ব্রাঞ্চে তা অ্যাপ্লাই করে দেখতে চান।
2. **নিরাপত্তা ব্যাকআপ**: কোড অ্যাপ্লাই করার পর টেস্ট রান করে নিশ্চিত হতে চান যে সব ঠিক আছে, তারপর ম্যানুয়ালি ড্রপ করবেন।

---

## ৪. git stash list (সংরক্ষিত স্ট্যাশ তালিকা দেখা)

সময়ের সাথে সাথে আপনি একাধিক স্ট্যাশ সংরক্ষণ করতে পারেন। \`git stash list\` দিয়ে সমস্ত স্ট্যাশ দেখতে পারবেন:

\`\`\`bash
git stash list
\`\`\`

### নমুনা আউটপুট:
\`\`\`
stash@{0}: On feature/discount: WIP: discount calculation logic
stash@{1}: On main: WIP: temporary CORS middleware fix
stash@{2}: On bugfix/auth: WIP: token expiry test case
\`\`\`

### স্ট্যাশ প্রয়োগ না করে ভেতরে কী আছে তা দেখতে:
\`\`\`bash
# স্ট্যাশে কোন কোন ফাইল পরিবর্তিত হয়েছে তার সারাংশ:
git stash show stash@{0}

# স্ট্যাশের ভেতরে লাইন-বাই-লাইন কোডের পার্থক্য (Diff) দেখতে:
git stash show -p stash@{0}
\`\`\`

---

## ৫. git stash drop ও clear (স্ট্যাশ পরিষ্কার করা)

অপ্রয়োজনীয় পুরনো স্ট্যাশ জমিয়ে রাখলে বিভ্রান্তি তৈরি হয়। তাই কাজ শেষে স্ট্যাশ ড্রপ করা উচিত:

\`\`\`bash
# সর্বশেষ স্ট্যাশটি (stash@{0}) ডিলিট করতে:
git stash drop

# নির্দিষ্ট কোনো পুরনো স্ট্যাশ ডিলিট করতে:
git stash drop stash@{2}

# সমস্ত ব্রাঞ্চের সব স্ট্যাশ একসাথে চিরতরে মুছে ফেলতে:
git stash clear
\`\`\`

> [!CAUTION]
> **সতর্কতা**: \`git stash clear\` কিন্তু অপরিবর্তনীয় (Irreversible)! এটি চালালে আপনার স্ট্যাশে থাকা সমস্ত অসম্পূর্ণ কোড চিরতরে মুছে যাবে।

---

## ৬. Stashing Uncommitted Changes (আনকমিটেড কাজ স্ট্যাশ করার নিয়ম)

ডিফল্টভাবে সাধারণ \`git stash\` **শুধুমাত্র ট্র্যাকড (Tracked) ফাইলে** কাজ করে। আপনি যদি প্রোজেক্টে একদম নতুন কোনো ফাইল তৈরি করে থাকেন যা আগে কখনো গিটে অ্যাড করা হয়নি, তবে গিট স্ট্যাশ সেই নতুন ফাইলটিকে উপেক্ষা করবে!

### ক. নতুন আনট্র্যাকড ফাইলসহ স্ট্যাশ করা (\`-u\` / \`--include-untracked\`):
\`\`\`bash
# মডিফাইড ফাইলের পাশাপাশি নতুন তৈরি হওয়া সব ফাইলসহ স্ট্যাশ করতে:
git stash -u -m "WIP: includes new PaymentService.cs class"
\`\`\`

### খ. .gitignore করা ফাইলসহ স্ট্যাশ করা (\`-a\` / \`--all\`):
\`\`\`bash
# ট্র্যাকড, আনট্র্যাকড এবং .gitignore-এ থাকা ফাইলসহ সম্পূর্ণ স্ট্যাশ:
git stash -a -m "WIP: complete environment snapshot"
\`\`\`

### গ. শুধুমাত্র স্টেজিং এরিয়ার ফাইল স্ট্যাশ করা (\`--staged\`):
\`\`\`bash
# 'git add' করা ফাইলগুলো স্ট্যাশ হবে, বাকি পরিবর্তনগুলো আনস্টেজড অবস্থায় ওয়ার্কস্পেসেই থাকবে:
git stash --staged -m "WIP: only staged api changes"
\`\`\`

### ঘ. নির্দিষ্ট কোনো একটি ফাইল স্ট্যাশ করা:
\`\`\`bash
# শুধুমাত্র একটি নির্দিষ্ট ফাইল স্ট্যাশ করতে:
git stash push -m "WIP: auth config only" src/Config/AuthConfig.cs
\`\`\`

---

## Quick Reference Summary (এক নজরে কমান্ড সামারি)

| কমান্ড | কাজ ও বিবরণ | স্ট্যাক মেমোরির অবস্থা |
| :--- | :--- | :--- |
| \`git stash push -m "msg"\` | মেসেজসহ ট্র্যাকড কোড সাময়িক তুলে রাখা | মেমোরিতে যুক্ত হয় |
| \`git stash -u -m "msg"\` | নতুন আনট্র্যাকড ফাইলসহ তুলে রাখা ⭐ | মেমোরিতে যুক্ত হয় |
| \`git stash pop\` | কোড ফিরিয়ে এনে স্ট্যাক থেকে **মুছে ফেলা** | ❌ মুছে যায় |
| \`git stash apply\` | কোড ফিরিয়ে এনে স্ট্যাকে **অক্ষত রাখা** | 🟢 সংরক্ষিত থাকে |
| \`git stash list\` | সংরক্ষিত সমস্ত স্ট্যাশের তালিকা দেখা | Read-only |
| \`git stash show -p stash@{0}\` | স্ট্যাশের ভেতরের লাইন-বাই-লাইন কোড দেখা | Read-only |
| \`git stash drop stash@{n}\` | নির্দিষ্ট একটি স্ট্যাশ ডিলিট করা | ❌ মুছে যায় |
| \`git stash clear\` | সমস্ত স্ট্যাশ চিরতরে ডিলিট করা | ❌ সব খালি হয় |
`,
  },
  {
    slug: "git-tags-and-releases",
    titleEn: "Tags & Releases: Semantic Versioning, Annotated Tags & GitHub Releases",
    titleBn: "ট্যাগ ও রিলিজ: সেম্যান্টিক ভার্সনিং, অ্যানোটেটেড ট্যাগ ও গিটহাব রিলিজ",
    categoryEn: "13. Tagging & Production Releases",
    categoryBn: "১৩. ট্যাগিং ও প্রোডাকশন রিলিজ",
    categoryDescEn: "Lightweight vs annotated tags, semantic versioning (SemVer), pushing tags to remote, and publishing GitHub releases.",
    categoryDescBn: "লাইটওয়েট বনাম অ্যানোটেটেড ট্যাগ, সেম্যান্টিক ভার্সনিং (SemVer), রিমোটে ট্যাগ পুশ এবং গিটহাবে অফিসিয়াল রিলিজ প্রকাশ।",
    categoryPriority: "CORE",
    descriptionEn: "Master software release milestones using Git tags and GitHub Releases adhering to Semantic Versioning (SemVer).",
    descriptionBn: "সেম্যান্টিক ভার্সনিং (SemVer) মেনে গিট ট্যাগ এবং গিটহাব রিলিজের মাধ্যমে প্রজেক্টের প্রোডাকশন মাইলস্টোন চিহ্নিত করা শিখুন।",
    difficulty: "EASY",
    displayOrder: 13,
    prerequisites: ["git-commits"],
    estimatedMinutes: 20,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Semantic Versioning",
        title: "SemVer 2.0.0 Specification",
        url: "https://semver.org/",
        description: "Official standard for MAJOR.MINOR.PATCH software version numbers.",
        isStarred: true,
      },
      {
        source: "Git Documentation",
        title: "Git Basics — Tagging",
        url: "https://git-scm.com/book/en/v2/Git-Basics-Tagging",
        description: "Official guide to creating and verifying lightweight and annotated tags.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "What is the difference between a Lightweight Tag and an Annotated Tag in Git?",
        url: null,
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Git", "Tags", "Annotated Tags", "SemVer"],
        solutionEn: "A Lightweight Tag is simply a permanent bookmark pointer to a specific commit hash (like a branch that never moves). An Annotated Tag is stored as a full Git object in the database: it contains the tagger's name, email, date, a descriptive release message, and can be cryptographically signed with GPG.",
        solutionBn: "লাইটওয়েট ট্যাগ হলো শুধুমাত্র একটি নির্দিষ্ট কমিটের দিকে নির্দেশ করা স্থায়ী পয়েন্টার। আর অ্যানোটেটেড ট্যাগ হলো গিটের একটি স্বয়ংসম্পূর্ণ অবজেক্ট যার নিজস্ব মেসেজ, ট্যাগারের নাম, ইমেইল, তারিখ থাকে এবং এটি ক্রিপ্টোগ্রাফিক্যালি GPG দিয়ে সাইন করা যায় (প্রোডাকশন রিলিজের জন্য বাধ্যতামূলক)।",
      },
    ],
    contentEn: `# Tags & Releases: Semantic Versioning, Annotated Tags & GitHub Releases

While Git branches are living, dynamic pointers that automatically move forward with every new commit you make, a **Git Tag** is an immutable, permanent milestone pinned to one specific commit in history (e.g., \`v1.0.0\`, \`v2.4.1\`).

Tags provide human-readable reference points for production deployments, software releases, and library distribution.

Here is the complete, comprehensive guide across all 6 core sub-sections of Tags and Releases:

---

## 1. Git Tags (Concept, Purpose & Semantic Versioning)

### Real-world Analogy:
> Imagine reading a 500-page book. A **Branch** is like a bookmark that moves with you from page 1 to page 2 to page 50 as you read. A **Tag**, however, is like an immovable gold stamp pressed onto page 100 commemorating the exact conclusion of Chapter 1. No matter how many more pages you read, the gold stamp on page 100 never moves.

### Semantic Versioning (SemVer 2.0.0):
In production software engineering, tags almost universally follow the **Semantic Versioning** convention:  
$$\\mathbf{vMAJOR.MINOR.PATCH} \\quad \\text{(e.g., } \\mathbf{v2.4.1}\\text{)}$$

* **MAJOR (\`v2.0.0\`)**: Incompatible, breaking API changes. (Clients using v1 must update their code).
* **MINOR (\`v1.1.0\`)**: New backwards-compatible features added. (Clients do not need to rewrite code).
* **PATCH (\`v1.0.1\`)**: Backwards-compatible bug fixes and security patches.
* **Pre-release suffix**: \`v1.0.0-alpha.1\`, \`v1.0.0-beta.2\`, \`v1.0.0-rc.1\` (Release Candidate).

---

## 2. Lightweight Tags (Quick Bookmarks)

A **Lightweight Tag** is simply a permanent pointer or bookmark pointing directly to a specific commit hash. Nothing more.

* **No extra metadata**: Does not record the tagger's name, email, timestamp, or release notes.
* **Storage**: Stored as a plain reference file containing just a commit SHA.
* **Syntax**:
  \`\`\`bash
  # Create a lightweight tag on the current HEAD commit:
  git tag v1.0.0-beta
  \`\`\`
* **When to use**: Quick personal milestones, local development checkpoints, or temporary testing labels that do not require formal documentation.

---

## 3. Annotated Tags (Production Standard ⭐)

An **Annotated Tag** is stored as a full, standalone Git object in the \`.git\` database.

* **Rich Metadata**: Records the author's name, email, creation timestamp, and a multi-line release message.
* **Cryptographic Signing**: Can be cryptographically signed and verified with a GPG key (\`-s\`) to prove authenticity.
* **Syntax**:
  \`\`\`bash
  # Create an annotated tag with a release message:
  git tag -a v1.0.0 -m "Release version 1.0.0: Initial stable production launch with Stripe integration"
  \`\`\`
* **Inspecting an Annotated Tag**:
  \`\`\`bash
  git show v1.0.0
  # Output:
  # Tagger: Mostafa Kamal <mostafa@example.com>
  # Date:   Sat Sep 13 22:30:00 2026 +0600
  #
  # Release version 1.0.0: Initial stable production launch with Stripe integration
  # ----- commit details below -----
  \`\`\`

> [!IMPORTANT]
> **Best Practice**: In professional engineering teams, **always use annotated tags (\`-a\`) for public releases, production deployments, and NuGet / npm / PyPI packages.**

---

## 4. Creating and Managing Tags

### A. Tagging a Historical Commit from the Past:
You don't have to tag only the current commit. You can tag any commit in your repository's history:
\`\`\`bash
# 1. View commit history to find the target hash:
git log --oneline -n 5

# 2. Tag a past commit:
git tag -a v0.9.0 7a1b2c4 -m "Release v0.9.0: Early closed-beta build"
\`\`\`

### B. Listing and Searching Tags:
\`\`\`bash
# List all tags in alphabetical order:
git tag

# Search for tags matching a specific pattern:
git tag -l "v1.2.*"
\`\`\`

### C. Checking Out Code at a Tag:
\`\`\`bash
# View code exactly as it existed at v1.0.0 (detached HEAD state):
git checkout v1.0.0

# Best practice: create an urgent hotfix branch based on a release tag:
git switch -c hotfix/v1.0.1 v1.0.0
\`\`\`

### D. Deleting a Local Tag:
\`\`\`bash
git tag -d v1.0.0-beta
\`\`\`

---

## 5. Pushing Tags (Remote Synchronization)

> [!WARNING]
> ### ⚠️ The Biggest Tag Gotcha:
> **By default, running \`git push\` or \`git push origin main\` DOES NOT send tags to remote servers!**  
> Tags must be pushed explicitly to GitHub!

\`\`\`bash
# 1. Push a specific single tag to GitHub:
git push origin v1.0.0

# 2. Push ALL local tags that don't exist on remote at once:
git push origin --tags

# 3. Delete a tag from GitHub remote:
git push origin --delete v1.0.0-beta
# (or legacy syntax: git push origin :refs/tags/v1.0.0-beta)
\`\`\`

---

## 6. GitHub Releases (Packaged Software Distribution)

While a **Git Tag** is a pointer in your local repository database, a **GitHub Release** is an official software distribution package built on top of a Git tag.

### What GitHub Releases Provide:
1. **Automated Changelogs**: With one click (**Generate release notes**), GitHub parses all merged PRs between this release and the previous tag, listing contributors and ticket numbers.
2. **Binary Assets**: You can attach compiled, downloadable artifacts directly to the release page (e.g., \`.zip\`, \`.apk\`, \`.exe\`, \`.tar.gz\`, Docker image digests).
3. **Release Highlights**: Rich markdown announcements with badges, breaking change warnings, and installation guides.

### Publishing via GitHub Web UI:
1. Go to your repository on [GitHub](https://github.com).
2. On the right sidebar, click **Releases** > **Draft a new release**.
3. Select your pushed tag (e.g., \`v1.0.0\`).
4. Click **Generate release notes** to automatically insert all merged pull requests.
5. Drag and drop compiled binary assets (\`.zip\` or \`.exe\`).
6. Click **Publish release**.

### Publishing via GitHub CLI (\`gh\`):
\`\`\`bash
gh release create v1.0.0 ./dist/*.zip --title "v1.0.0 Production Launch" --generate-notes
\`\`\`

---

## Quick Reference Summary

| Command | What it does |
| :--- | :--- |
| \`git tag -a v1.0.0 -m "msg"\` | Creates an **annotated tag** with metadata ⭐ |
| \`git tag v1.0.0\` | Creates a **lightweight tag** (simple pointer) |
| \`git tag -a v0.9.0 <hash> -m "msg"\` | Tags a specific historical commit from the past |
| \`git tag\` | Lists all existing tags |
| \`git show <tag>\` | Displays tagger details, message, and commit diff |
| \`git push origin <tag>\` | Uploads a specific tag to GitHub |
| \`git push origin --tags\` | Uploads all local tags to GitHub at once |
| \`git tag -d <tag>\` | Deletes a tag from your local machine |
| \`git push origin --delete <tag>\` | Deletes a tag from GitHub remote |
| \`gh release create <tag>\` | Publishes an official GitHub Release with changelog |
`,
    contentBn: `# ট্যাগ ও রিলিজ: সেম্যান্টিক ভার্সনিং, অ্যানোটেটেড ট্যাগ ও গিটহাব রিলিজ

গিটের ব্রাঞ্চগুলো হলো গতিশীল বা চলমান পয়েন্টার, যা প্রতিটি নতুন কমিট করার সাথে সাথে সামনের দিকে এগিয়ে যায়। কিন্তু **Git Tag (গিট ট্যাগ)** হলো ইতিহাসের একটি নির্দিষ্ট কমিটে চিরতরে আটকে থাকা একটি স্থায়ী ও অপরিবর্তনীয় সাইনবোর্ড (যেমন \`v1.0.0\`, \`v2.4.1\`)।

সফটওয়্যার প্রোডাক্টের বিভিন্ন প্রোডাকশন রিলিজ, মাইলস্টোন ও ডিপ্লয়মেন্ট চিহ্নিত করতে ট্যাগ ব্যবহৃত হয়।

নিচে ট্যাগ ও রিলিজের ৬টি মৌলিক সাব-সেকশন সহজ ভাষায় বিস্তারিত আলোচনা করা হলো:

---

## ১. Git Tags (গিট ট্যাগ কী ও সেম্যান্টিক ভার্সনিং)

### বাস্তব জীবনের উপমা:
> মনে করুন আপনি ৫০০ পৃষ্ঠার একটি উপন্যাস পড়ছেন। একটি **Branch** হলো একটি সাধারণ বুকমার্ক যা আপনার পড়ার সাথে সাথে পৃষ্ঠা ১ থেকে ৫০, তারপর ১০০-তে সরে যায়। কিন্তু একটি **Tag** হলো উপন্যাসের ১০০তম পৃষ্ঠায় স্থায়ীভাবে সোনালী অক্ষরে সিলমোহর দিয়ে রাখা: *"অধ্যায় ১ সমাপ্ত"*। আপনি যত নতুন পৃষ্ঠাই পড়ুন না কেন, ওই ১০০তম পৃষ্ঠার সিলমোহরটি আজীবন ওই একই পৃষ্ঠাতেই থাকবে।

### সেম্যান্টিক ভার্সনিং (Semantic Versioning / SemVer):
ইন্ডাস্ট্রি স্ট্যান্ডার্ড অনুযায়ী সফটওয়্যারের প্রতিটি রিলিজ ভার্সন একটি বিশেষ কাঠামো অনুসরণ করে:  
$$\\mathbf{vMAJOR.MINOR.PATCH} \\quad \\text{(যেমন: } \\mathbf{v2.4.1}\\text{)}$$

* **MAJOR (\`v2.0.0\`)**: ব্রেকিং চেঞ্জ (বড় ধরনের পরিবর্তন যা পুরনো কোডের সাথে সরাসরি চলবে না)।
* **MINOR (\`v1.1.0\`)**: নতুন ফিচার যোগ হয়েছে (পুরনো কোড না ভেঙেই কাজ করবে)।
* **PATCH (\`v1.0.1\`)**: ছোটখাটো বাগ ফিক্স বা সিকিউরিটি প্যাচ।
* **প্রি-রিলিজ ট্যাগ**: \`v1.0.0-alpha\`, \`v1.0.0-beta\`, \`v1.0.0-rc.1\` (রিলিজ ক্যান্ডিডেট)।

---

## ২. লাইটওয়েট ট্যাগ (Lightweight Tags)

**Lightweight Tag** হলো শুধুমাত্র একটি নির্দিষ্ট কমিটের দিকে নির্দেশ করা একটি সাধারণ স্থায়ী বুকমার্ক।

* **কোনো অতিরিক্ত মেটাডেটা থাকে না**: এতে ট্যাগারের নাম, ইমেইল, সময় বা রিলিজ মেসেজ কিছুই থাকে না।
* **তৈরির নিয়ম**:
  \`\`\`bash
  # বর্তমান কমিটে একটি সাধারণ লাইটওয়েট ট্যাগ তৈরি:
  git tag v1.0.0-beta
  \`\`\`
* **কখন ব্যবহার করবেন**: লোকাল কম্পিউটারে দ্রুত ব্যক্তিগত কোনো চেকপয়েন্ট মনে রাখার জন্য।

---

## ৩. অ্যানোটেটেড ট্যাগ (Annotated Tags — প্রোডাকশন স্ট্যান্ডার্ড ⭐)

**Annotated Tag** হলো গিটের ডেটাবেজে সংরক্ষিত একটি স্বয়ংসম্পূর্ণ স্বাধীন অবজেক্ট।

* **পূর্ণাঙ্গ মেটাডেটা**: এতে যিনি ট্যাগ তৈরি করেছেন তাঁর নাম, ইমেইল, তৈরির তারিখ এবং একটি বিস্তারিত রিলিজ মেসেজ সংরক্ষিত থাকে।
* **ক্রিপ্টোগ্রাফিক সুরক্ষা**: এটি GPG কি (\`-s\`) দিয়ে ডিজিটালি সাইন করা যায়, যা প্রমাণ করে যে রিলিজটি আসল ডেভেলপারের হাত দিয়েই তৈরি।
* **তৈরির নিয়ম**:
  \`\`\`bash
  git tag -a v1.0.0 -m "Release v1.0.0: Initial production release with payment integration"
  \`\`\`
* **ট্যাগের বিস্তারিত দেখার নিয়ম**:
  \`\`\`bash
  git show v1.0.0
  \`\`\`

> [!IMPORTANT]
> **বেস্ট প্র্যাকটিস**: কর্পোরেট সফটওয়্যার ও ওপেন সোর্স প্রজেক্টে যেকোনো অফিশিয়াল প্রোডাকশন রিলিজের জন্য **সর্বদা অ্যানোটেটেড ট্যাগ (\`-a\`) ব্যবহার করা আবশ্যক**।

---

## ৪. ট্যাগ তৈরি ও পরিচালনা (Creating & Managing Tags)

### ক. পেছনের কোনো পুরনো কমিটে ট্যাগ লাগানো:
শুধু বর্তমান কমিটেই নয়, আপনি চাইলে পেছনের যেকোনো কমিটে ট্যাগ দিতে পারেন:
\`\`\`bash
# ১. পেছনের কমিট হ্যাশ দেখতে:
git log --oneline -n 5

# ২. নির্দিষ্ট কমিট হ্যাশে ট্যাগ লাগান:
git tag -a v0.9.0 7a1b2c4 -m "Release v0.9.0: Early beta build"
\`\`\`

### খ. বিদ্যমান ট্যাগের তালিকা দেখা:
\`\`\`bash
# সমস্ত ট্যাগ দেখতে:
git tag

# প্যাটার্ন মিলিয়ে ট্যাগ খুঁজতে:
git tag -l "v1.*"
\`\`\`

### গ. কোনো ট্যাগের কোড চেকআউট করা:
\`\`\`bash
# v1.0.0 ট্যাগের কোডে ফিরে যেতে:
git checkout v1.0.0

# ওই রিলিজ ট্যাগের ওপর ভিত্তি করে ইমার্জেন্সি হটফিক্স ব্রাঞ্চ তৈরি করতে:
git switch -c hotfix/v1.0.1 v1.0.0
\`\`\`

### ঘ. লোকাল ট্যাগ ডিলিট করা:
\`\`\`bash
git tag -d v1.0.0-beta
\`\`\`

---

## ৫. রিমোটে ট্যাগ পুশ করা (Pushing Tags)

> [!WARNING]
> ### ⚠️ নতুনদের সবচেয়ে বড় ভুল:
> **মনে রাখবেন, সাধারণ \`git push\` কিন্তু গিটহাবে কোনো ট্যাগ আপলোড করে না!**  
> ট্যাগকে আলাদা কমান্ড দিয়ে গিটহাবে পুশ করতে হয়!

\`\`\`bash
# ১. একটি নির্দিষ্ট ট্যাগ গিটহাবে পুশ করতে:
git push origin v1.0.0

# ২. লোকাল মেশিনের সমস্ত নতুন ট্যাগ একসাথে গিটহাবে পাঠাতে:
git push origin --tags

# ৩. গিটহাব থেকে কোনো রিমোট ট্যাগ ডিলিট করতে:
git push origin --delete v1.0.0-beta
\`\`\`

---

## ৬. GitHub Releases (গিটহাব রিলিজ ও সফটওয়্যার প্যাকেজ)

**Git Tag** হলো গিটের টেকনিক্যাল পয়েন্টার, আর **GitHub Release** হলো গ্রাহক ও ব্যবহারকারীদের জন্য তৈরি একটি আনুষ্ঠানিক প্যাকেজ যা গিট ট্যাগের ওপর ভিত্তি করে প্রকাশিত হয়।

### গিটহাব রিলিজের সুবিধাসমূহ:
1. **স্বয়ংক্রিয় চেঞ্জলগ (Changelog)**: গিটহাবে **Generate release notes** বাটনে চাপ দিলেই আগের রিলিজের পর থেকে যেসকল পিআর মার্জ হয়েছে তাদের তালিকা ও অবদানকারীদের নাম স্বয়ংক্রিয়ভাবে যুক্ত হয়ে যায়।
2. **ডাউনলোডযোগ্য সফটওয়্যার ফাইল**: আপনি কম্পাইল করা সফটওয়্যার প্যাকেজ (যেমন \`.zip\`, \`.apk\`, \`.exe\`) সরাসরি রিলিজ পেজে আপলোড করে দিতে পারেন।
3. **রিলিজ ঘোষণা**: সুন্দর মার্কডাউনে রিলিজের নতুন ফিচার ও সতর্কবার্তা প্রদর্শন।

### গিটহাব সিএলআই (\`gh\`) দিয়ে টার্মিনাল থেকেই রিলিজ তৈরি:
\`\`\`bash
gh release create v1.0.0 ./dist/*.zip --title "v1.0.0 Production Release" --generate-notes
\`\`\`

---

## Quick Reference Summary (এক নজরে কমান্ড সামারি)

| কমান্ড | কাজ ও উদ্দেশ্য |
| :--- | :--- |
| \`git tag -a v1.0.0 -m "msg"\` | মেটাডেটা ও মেসেজসহ **অ্যানোটেটেড ট্যাগ** তৈরি ⭐ |
| \`git tag v1.0.0\` | সাধারণ **লাইটওয়েট ট্যাগ** তৈরি |
| \`git tag -a v0.9.0 <hash> -m "msg"\` | পেছনের কোনো পুরনো কমিটে ট্যাগ বসানো |
| \`git tag\` | রিপোজিটরির সমস্ত ট্যাগের তালিকা দেখা |
| \`git show <tag>\` | ট্যাগের ট্যাগারের তথ্য ও রিলিজ নোটস দেখা |
| \`git push origin <tag>\` | নির্দিষ্ট ট্যাগটি গিটহাবে আপলোড করা |
| \`git push origin --tags\` | সমস্ত লোকাল ট্যাগ একসাথে গিটহাবে পাঠানো ⭐ |
| \`git tag -d <tag>\` | লোকাল মেশিন থেকে ট্যাগ মুছে ফেলা |
| \`git push origin --delete <tag>\` | গিটহাব সার্ভার থেকে ট্যাগ মুছে ফেলা |
| \`gh release create <tag>\` | অফিসিয়াল গিটহাব রিলিজ প্রকাশ করা |
`,
  },
  {
    slug: "git-ignore-and-repo-management",
    titleEn: "Git Ignore & Repository Management: .gitignore, Global Rules, Untracking & Secret Hygiene",
    titleBn: "গিট ইগনোর ও রিপোজিটরি ম্যানেজমেন্ট: .gitignore, গ্লোবাল রুলস, আনট্র্যাকিং এবং সিক্রেট হাইজিন",
    categoryEn: "14. Git Ignore & Repository Management",
    categoryBn: "১৪. গিট ইগনোর ও রিপোজিটরি ম্যানেজমেন্ট",
    categoryDescEn: "Writing .gitignore rules, glob patterns, global ignore configuration, untracking cached files with git rm --cached, environment variables handling, build artifacts, and secret leakage disaster recovery.",
    categoryDescBn: ".gitignore সিনট্যাক্স, গ্লোবাল ইগনোর, ভুলবশত ট্র্যাক হওয়া ফাইল ক্যাশ থেকে সরানো, এনভায়রনমেন্ট সিক্রেট হ্যান্ডলিং, বিল্ড ফাইল এবং সিক্রেট লিক রিকভারি।",
    categoryPriority: "CORE",
    descriptionEn: "Master .gitignore glob patterns, machine-wide global ignores, safely removing tracked files from Git without deleting them locally, and industry-standard secret management.",
    descriptionBn: ".gitignore গ্লোব প্যাটার্ন, গ্লোবাল ইগনোর সেটআপ, কম্পিউটারে ফাইল ঠিক রেখে গিট ইনডেক্স থেকে ক্যাশড ফাইল মুছে ফেলা এবং ইন্ডাস্ট্রির সিক্রেট সিকিউরিটি রুলস শিখুন।",
    difficulty: "EASY",
    displayOrder: 14,
    prerequisites: ["git-working-with-changes"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Gitignore Templates",
        title: "GitHub Collection of .gitignore Templates",
        url: "https://github.com/github/gitignore",
        description: "Official collection of production-ready .gitignore files for Node, Python, .NET, Java, Go, and more.",
        isStarred: true,
      },
      {
        source: "Toptal gitignore.io",
        title: "gitignore.io — Generate .gitignore Files Instantly",
        url: "https://www.toptal.com/developers/gitignore",
        description: "Create useful .gitignore files for your OS, IDE, and programming language with a single search query.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "If a sensitive file or build directory was already committed and pushed, why does adding it to .gitignore fail to ignore it, and how do you resolve it safely?",
        url: null,
        difficulty: "MEDIUM",
        company: "Samsung R&D (SRBD)",
        tags: ["Git", "gitignore", "git rm --cached", "Hygiene", "Security"],
        solutionEn: ".gitignore only instructs Git to ignore UNTRACKED files. If a file was previously staged or committed, it already exists in the Git index/tree; Git continues tracking its future changes regardless of .gitignore rules. To fix this without deleting the physical file from your local disk, untrack it from the Git index using 'git rm --cached <path>' (or 'git rm -r --cached <dir>'), ensure it is added to .gitignore, and commit the removal.",
        solutionBn: ".gitignore শুধুমাত্র নতুন আনট্র্যাকড (Untracked) ফাইলের ওপর কার্যকর হয়। কোনো ফাইল অতীতে একবার কমিট হয়ে গেলে তা গিট ইনডেক্স/ট্রি-তে ট্র্যাকড হয়ে যায়; তখন .gitignore-এ লিখলেও গিট সেই ফাইলকে ট্র্যাক করতেই থাকে। লোকাল ড্রাইভ থেকে ফাইল মুছে না ফেলে শুধু গিট ইনডেক্স থেকে বাদ দিতে 'git rm --cached <path>' (বা ফোল্ডারের জন্য 'git rm -r --cached <dir>') চালিয়ে কমিট করতে হয়।",
      },
    ],
    contentEn: `# 14. Git Ignore & Repository Management

A clean, production-grade repository contains only human-written source code, configuration templates, documentation, and tests. It should **never** store compiled binaries, bulky dependencies, OS junk, or confidential credentials.

---

## 1. .gitignore (What it is & How it Works)

### What is \`.gitignore\`?
\`.gitignore\` is a plain text configuration file placed inside your Git repository (usually in the root directory). It tells Git which files, patterns, or directories should be **deliberately untracked and ignored**.

### Core Rules of How Git Treats \`.gitignore\`:
1. **Applies ONLY to Untracked Files:** Git will never ignore a file that is already being tracked in the Git index (staging tree).
2. **Hierarchical Precedence:** A \`.gitignore\` file placed in a subfolder applies to that subfolder and overrides parent directory patterns.
3. **Commit It to Version Control:** The \`.gitignore\` file should be committed into Git so that all team members share the same ignore rules.

### Glob Pattern Syntax:
| Pattern | Meaning & Rule | Example |
| :--- | :--- | :--- |
| \`#\` | Comment line | \`# Ignore logs\` |
| \`*\` | Matches zero or more characters (except \`/\`) | \`*.log\` (ignores \`app.log\`, \`error.log\`) |
| \`?\` | Matches exactly one single character | \`debug?.log\` (matches \`debug1.log\`, not \`debug12.log\`) |
| \`/\` (leading) | Matches relative to directory containing \`.gitignore\` | \`/dist\` (ignores \`dist\` at root, not \`app/dist\`) |
| \`/\` (trailing) | Restricts pattern strictly to directories | \`temp/\` (ignores folder \`temp/\`, but not a file named \`temp\`) |
| \`**/\` | Matches zero or more directories | \`**/logs/*.log\` (matches logs anywhere in repo) |
| \`!\` | Negation (whitelist / un-ignore rule) | \`!important.log\` (keeps tracking this specific file) |
| \`\\#\`, \`\\!\` | Escapes literal special characters | \`\\#special_file.txt\` |

---

## 2. Global .gitignore (Machine-Wide Ignore)

### Why Global .gitignore?
Every developer uses different operating systems and code editors. Team project repositories should **not** be littered with individual workstation preferences like:
* macOS metadata: \`.DS_Store\`
* Windows thumbnail caches: \`Thumbs.db\`, \`desktop.ini\`
* Editor-specific settings: \`.vscode/\`, \`.idea/\`, \`*.swp\`

Instead of adding these to every project's \`.gitignore\`, configure a **Global .gitignore** on your computer once.

### Setup Instructions:
\`\`\`bash
# 1. Create a global ignore file in your user home directory
touch ~/.gitignore_global

# 2. Add common OS and editor junk to this file
cat <<EOT >> ~/.gitignore_global
# OS junk
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
desktop.ini

# IDE & Editor caches
.idea/
*.swp
*.swo
*~
.project
.classpath
EOT

# 3. Tell Git to use this global exclude file
git config --global core.excludesfile ~/.gitignore_global

# 4. Verify configuration
git config --get core.excludesfile
# Output: /Users/yourusername/.gitignore_global
\`\`\`

---

## 3. Ignoring Files (Practical Patterns & Testing Rules)

### Common Pattern Examples:
\`\`\`gitignore
# 1. File Extension Rule
*.tmp
*.bak
*.swp

# 2. Directory Rule
node_modules/
bin/
obj/
dist/

# 3. Specific Path Rule
config/private-keys.json

# 4. Whitelisting with Negation (!)
# Ignore all logs...
logs/*
# ...BUT keep this one critical production audit log:
!logs/audit.log

# CAUTION with Negation:
# If you ignore the entire directory with 'logs/', Git will NOT scan inside it!
# Therefore, '!logs/audit.log' will NOT work if 'logs/' is ignored.
# You must ignore 'logs/*' to allow subfile whitelisting.
\`\`\`

### Testing & Debugging Ignore Rules:
Wondering why Git is ignoring (or failing to ignore) a particular file? Use \`git check-ignore\`:
\`\`\`bash
# Test why a file is being ignored (shows rule and line number)
git check-ignore -v src/temp/debug.log
# Output: .gitignore:12:*.log  src/temp/debug.log

# Force add an ignored file (rare, use with caution)
git add -f important-ignored.json
\`\`\`

---

## 4. Removing Tracked Files (Untracking with \`git rm --cached\`)

### The Classic Trap:
1. You accidentally committed \`appsettings.Development.json\` or \`.env\`.
2. You notice the mistake, so you add \`.env\` to \`.gitignore\`.
3. You edit \`.env\` — but \`git status\` still shows it as modified!
4. **Why?** Git only checks \`.gitignore\` for untracked files. Since the file was already committed to Git's index, Git tracks it forever until untracked.

### How to Fix It (Keep Local File, Remove from Git):
\`\`\`bash
# Remove a single file from Git tracking (keeps file on your hard disk)
git rm --cached appsettings.Development.json

# Remove an entire directory from tracking (recursive)
git rm -r --cached dist/

# Stage the updated .gitignore
git add .gitignore

# Commit the removal
git commit -m "chore: stop tracking local environment settings and build artifacts"
\`\`\`

### Complete Repository Refresh (Re-apply .gitignore to all files):
\`\`\`bash
# 1. Make sure working directory has no uncommitted changes
git status

# 2. Untrack everything from index
git rm -r --cached .

# 3. Re-add everything (respecting the current .gitignore)
git add .

# 4. Commit the cleanup
git commit -m "chore: reapply .gitignore across entire repository"
\`\`\`

---

## 5. Environment Files (.env & Secrets Handling)

### Why Environment Files Must NEVER Enter Git:
Environment files (\`.env\`, \`.env.local\`, \`.env.production\`) contain raw secrets:
* Database connection strings with passwords
* Third-party API keys (Stripe, Twilio, OpenAI, AWS)
* Encryption keys & JWT secret salts

Once pushed to a public (or even private) remote repository, credentials can be cached, scraped, or compromised.

### The Standard \`.env.example\` Pattern:
Never commit real values. Instead, commit a dummy blueprint so team members know which variables are required:

\`\`\`bash
# .env.example (Committed to Git)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=replace_with_32_character_random_string
STRIPE_API_KEY=sk_test_placeholder_key
PORT=3000
\`\`\`

### In \`.gitignore\`:
\`\`\`gitignore
# Environment files
.env
.env*.local
.env.development
.env.production
.env.staging
\`\`\`

---

## 6. Build Files (Compilations & Bulky Artifacts)

### Why Build Artifacts Must Be Ignored:
1. **Repository Bloat:** Compiled files (like \`.dll\`, \`.exe\`, minified \`.js\`, \`.tar\`) change every build, causing the \`.git\` directory to balloon into gigabytes.
2. **Merge Conflicts:** Compiled/minified files cannot be text-diffed cleanly.
3. **Platform Incompatibility:** A binary built on macOS will fail on a Linux server or Windows workstation.

### Common Ecosystem Guidelines:
* **JavaScript / TypeScript:**
  \`\`\`gitignore
  node_modules/
  dist/
  build/
  .next/
  .nuxt/
  coverage/
  \`\`\`
* **C# / .NET:**
  \`\`\`gitignore
  bin/
  obj/
  *.user
  *.suo
  \`\`\`
* **Python:**
  \`\`\`gitignore
  __pycache__/
  *.py[cod]
  .venv/
  env/
  *.egg-info/
  dist/
  \`\`\`
* **Java:**
  \`\`\`gitignore
  target/
  *.class
  *.jar
  *.war
  \`\`\`

---

## 7. Sensitive Files (Security Disaster Recovery)

### High-Risk Files:
* SSH Private Keys: \`id_rsa\`, \`id_ed25519\`, \`*.pem\`, \`*.key\`
* SSL/TLS certificates: \`*.pfx\`, \`*.p12\`
* Cloud Service Account keys: \`credentials.json\`, \`service-account.json\`

### 🚨 Emergency Action Plan If You Accidentally Push a Secret:
> ⚠️ **CRITICAL:** Simply making a new commit that deletes the file or adds it to \`.gitignore\` does **NOT** delete the secret from Git history! The raw key remains readable in older commits.

1. **Step 1: Revoke and Rotate IMMEDIATELY.**
   * Go to AWS, Stripe, Firebase, or your database console. Delete the leaked key immediately and issue a new one. Treat leaked keys as 100% compromised.
2. **Step 2: Purge the File from Entire Git History:**
   * Use \`git-filter-repo\` (official Git recommendation) or **BFG Repo-Cleaner**:
   \`\`\`bash
   # Using BFG Repo-Cleaner
   bfg --delete-files .env
   
   # Expire reflog and prune objects
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   
   # Force push sanitized history to remote
   git push origin --force --all
   \`\`\`
3. **Step 3: Enable GitHub Secret Scanning & Push Protection:**
   * In GitHub repo **Settings** > **Code security and analysis**, enable **Secret scanning** and **Push protection**. GitHub will block pushes containing detected API keys.
4. **Step 4: Use Pre-Commit Hooks:**
   * Install tools like \`gitleaks\` or \`git-secrets\` to scan commits locally before they are made.

---

## Summary Cheat Sheet

| Task | Command / Pattern |
| :--- | :--- |
| Test why a file is ignored | \`git check-ignore -v <filepath>\` |
| Untrack single file (keep locally) | \`git rm --cached <file>\` |
| Untrack folder (keep locally) | \`git rm -r --cached <folder>\` |
| Force add an ignored file | \`git add -f <file>\` |
| Set global gitignore | \`git config --global core.excludesfile ~/.gitignore_global\` |
| Refresh entire repo gitignore | \`git rm -r --cached . && git add . && git commit\` |
`,
    contentBn: `# ১৪. গিট ইগনোর ও রিপোজিটরি ম্যানেজমেন্ট (Git Ignore & Repository Management)

একটি প্রফেশনাল ও ক্লিন সফটওয়্যার রিপোজিটরিতে শুধুমাত্র প্রয়োজনীয় সোর্স কোড, কনফিগারেশন টেমপ্লেট, ডকস এবং টেস্ট কোড থাকা উচিত। কোনো অবস্থাতেই এতে কম্পাইল্ড বাইনারি ফাইল, বিশালাকার ডিপেন্ডেন্সি ফোল্ডার, অপারেটিং সিস্টেমের আবর্জনা কিংবা গোপন এপিআই কি (API Keys) ও পাসওয়ার্ড রাখা যাবে না।

---

## ১. .gitignore (এটি কী এবং কীভাবে কাজ করে?)

### 🔹 .gitignore কী?
\`.gitignore\` হলো রিপোজিটরির রুটে (বা যেকোনো ফোল্ডারে) রাখা একটি সাধারণ টেক্সট কনফিগারেশন ফাইল। এর মধ্যে নির্দিষ্ট কিছু রুলস বা ফাইল প্যাটার্ন লিখে দিলে Git সেই ফাইলগুলোকে **ইচ্ছাকৃতভাবে এড়িয়ে চলে বা ট্র্যাক করে না**।

### 🔹 Git কীভাবে .gitignore হ্যান্ডেল করে?
1. **শুধুমাত্র Untracked ফাইলের ওপর কার্যকর:** যে ফাইলগুলো অতীতে কখনো কমিট হয়নি বা বর্তমানে স্টেজড নয়, শুধু সেগুলোর ক্ষেত্রেই \`.gitignore\` প্রযোজ্য।
2. **হায়ারারকিকাল প্রায়োরিটি (Hierarchical):** সাব-ফোল্ডারের ভেতরে নিজস্ব \`.gitignore\` থাকলে তা রুটের রুলকে ওভাররাইড করতে পারে।
3. **ভার্সন কন্ট্রোলে কমিট করতে হয়:** \`.gitignore\` ফাইলটি প্রজেক্টে কমিট করে গিটহাবে পুশ করা উচিত, যাতে টিমের সব ডেভেলপার একই ইগনোর রুল পায়।

### 🔹 গ্লোব প্যাটার্ন (Glob Pattern) সিনট্যাক্স:
| প্যাটার্ন | অর্থ ও নিয়ম | বাস্তব উদাহরণ |
| :--- | :--- | :--- |
| \`#\` | কমেন্ট লাইন (Git এটি পড়ে না) | \`# Logs and caches\` |
| \`*\` | শূন্য বা একাধিক অক্ষর বোঝাতে (স্ল্যাশ বাদে) | \`*.log\` (সব \`.log\` ফাইল ইগনোর করবে) |
| \`?\` | ঠিক একটি মাত্র নির্দিষ্ট অক্ষর বোঝাতে | \`file?.txt\` (\`file1.txt\` মিলবে, \`file12.txt\` নয়) |
| \`/\` (শুরুতে) | রিপোজিটরির রুট ডিরেক্টরি নির্দিষ্ট করতে | \`/dist\` (রুটের \`dist\` বাদ দেবে, \`app/dist\` নয়) |
| \`/\` (শেষে) | শুধুমাত্র ফোল্ডার বোঝাতে | \`temp/\` (\`temp\` ফোল্ডার বাদ দেবে, \`temp\` নামের ফাইল নয়) |
| \`**/\` | যেকোনো গভীরতার নেস্টেড ফোল্ডার বোঝাতে | \`**/logs/*.log\` (যেকোনো ফোল্ডারের ভেতরের লগ) |
| \`!\` | নেগেশন / এক্সেপশন (ফাইলটি বাদ না দিয়ে রাখতে) | \`!important.log\` (লগ হলেও এটি ট্র্যাক করবে) |
| \`\\#\`, \`\\!\` | বিশেষ ক্যারেক্টারকে সাধারণ টেক্সট বানাতে এস্কেপ | \`\\#notes.txt\` |

---

## ২. Global .gitignore (মেশিন-ওয়াইড গ্লোবাল ইগনোর)

### 🔹 গ্লোবাল ইগনোর কেন দরকার?
টিমের একেকজন ডেভেলপার একেক অপারেটিং সিস্টেম বা এডিটর ব্যবহার করেন:
* ম্যাকের \`.DS_Store\`
* উইন্ডোজের \`Thumbs.db\`, \`desktop.ini\`
* ভিএস কোড বা জেটব্রেইন্সের নিজস্ব সেটিংস (\`.vscode/\`, \`.idea/\`, \`*.swp\`)

ব্যক্তিগত এডিটরের এই ফাইলগুলো দিয়ে টিমের প্রজেক্টের মূল \`.gitignore\` ভরিয়ে ফেলা বাজে প্র্যাকটিস। এর সহজ সমাধান হলো আপনার কম্পিউটারে একটি **গ্লোবাল .gitignore** ফাইল সেট করে নেওয়া।

### 🔹 কনফিগার করার নিয়ম:
\`\`\`bash
# ১. ইউজারের হোম ডিরেক্টরিতে একটি গ্লোবাল ফাইল তৈরি করুন
touch ~/.gitignore_global

# ২. সাধারণ ওএস ও এডিটরের আবর্জনা এই ফাইলে যোগ করুন
cat <<EOT >> ~/.gitignore_global
# macOS
.DS_Store
.DS_Store?
._*

# Windows
Thumbs.db
desktop.ini

# Editors & IDEs
.idea/
.vscode/
*.swp
*~
EOT

# ৩. Git-কে এই ফাইলটি ডিফল্ট গ্লোবাল এক্সক্লুড হিসেবে চিনিয়ে দিন
git config --global core.excludesfile ~/.gitignore_global

# ৪. ঠিকঠাক সেট হলো কিনা যাচাই করুন
git config --get core.excludesfile
\`\`\`

---

## ৩. Ignoring Files (ফাইল ইগনোর করার প্যাটার্ন ও টেস্টিং)

### 🔹 সাধারণ প্যাটার্নের প্র্যাকটিক্যাল উদাহরণ:
\`\`\`gitignore
# ১. এক্সটেনশন ধরে ইগনোর
*.tmp
*.bak
*.log

# ২. পুরো ফোল্ডার ইগনোর
node_modules/
dist/
bin/
obj/

# ৩. নির্দিষ্ট পাথের ফাইল
config/local-settings.json

# ৪. নেগেশন বা এক্সেপশন রুল (!)
# সব লগ ইগনোর করো...
logs/*
# ...কিন্তু প্রোডাকশন অডিট লগ ফাইলটি ট্র্যাক করো:
!logs/audit.log

# ⚠️ নেগেশনের সতর্কবার্তা:
# আপনি যদি সরাসরি 'logs/' ফোল্ডারটি ইগনোর করেন, তবে গিট ওই ফোল্ডারের ভেতর ঢুকবেই না।
# ফলে '!logs/audit.log' কাজ করবে না। এক্সেপশন দিতে চাইলে 'logs/*' ব্যবহার করতে হবে।
\`\`\`

### 🔹 ইগনোর রুল টেস্ট ও ডিবাগিং:
কোনো ফাইল কেন ইগনোর হচ্ছে বা কেন হচ্ছে না তা সহজে বের করতে \`git check-ignore\` কমান্ড দিন:
\`\`\`bash
# ফাইলটি কোন রুল ও লাইনের কারণে ইগনোর হচ্ছে তা দেখতে
git check-ignore -v src/temp/debug.log
# আউটপুট দেখাবে: .gitignore:12:*.log  src/temp/debug.log

# ইগনোর করা ফাইল জোর করে অ্যাড করতে (Force Add)
git add -f important-secret-template.json
\`\`\`

---

## ৪. Removing Tracked Files (ইতিমধ্যে ট্র্যাক হওয়া ফাইল বাদ দেওয়া)

### 🔹 ডেভেলপারদের সবচেয়ে বড় ফাঁদ:
1. আপনি ভুল করে \`config.json\` বা \`.env\` কমিট করে ফেলেছেন।
2. পরে ভুল বুঝতে পেরে \`.gitignore\` ফাইলে \`.env\` লিখে সেভ করলেন।
3. এখন \`.env\` ফাইল এডিট করে \`git status\` দিলে দেখতে পাবেন Git এখনো ফাইলটিকে Modified হিসেবে দেখাচ্ছে!
4. **কেন এমন হলো?** কারণ \`.gitignore\` শুধুমাত্র আনট্র্যাকড ফাইলে কাজ করে। ফাইলটি আগেই Git ইনডেক্সে জায়গা করে নিয়েছে।

### 🔹 সমাধান (\`git rm --cached\`):
আপনার হার্ডডিস্ক থেকে ফাইল না মুছে শুধুমাত্র Git-এর মেমোরি (Index/Staging) থেকে মুছতে \`--cached\` ফ্ল্যাগ ব্যবহার করুন:

\`\`\`bash
# একটি নির্দিষ্ট ফাইল আনট্র্যাক করতে (ফাইল কম্পিউটারে অক্ষত থাকবে):
git rm --cached config.json

# পুরো ফোল্ডার আনট্র্যাক করতে (Recursive):
git rm -r --cached dist/

# .gitignore ফাইলটি অ্যাড করুন:
git add .gitignore

# পরিবর্তনটি কমিট করুন:
git commit -m "chore: untrack config and build files from repository"
\`\`\`

### 🔹 পুরো রিপোজিটরির .gitignore রিফ্রেশ করার শর্টকাট:
\`\`\`bash
# ১. গিট ইনডেক্সের সবকিছু ক্যাশ থেকে মুছে দিন
git rm -r --cached .

# ২. বর্তমান .gitignore মেনে সবকিছু নতুন করে স্টেজ করুন
git add .

# ৩. পরিচ্ছন্ন কমিট দিন
git commit -m "chore: reapply .gitignore to all files"
\`\`\`

---

## ৫. Environment Files (.env এবং সিক্রেট ফাইল ম্যানেজমেন্ট)

### 🔹 .env ফাইল কেন কখনোই গিটহাবে পুশ করবেন না?
\`.env\` বা \`.env.local\` ফাইলে থাকে ডাটাবেজের ইউজারনেম-পাসওয়ার্ড, পেমেন্ট গেটওয়ের সিক্রেট কি, ক্লাউড টোকেন ইত্যাদি। একবার পাবলিক রিপোতে এগুলো চলে গেলে রোবট বা হ্যাকাররা কয়েক সেকেন্ডের মধ্যে তা চুরি করে বিল বাড়িয়ে ফেলতে পারে বা ডাটাবেজ ডিলিট করে দিতে পারে।

### 🔹 ইন্ডাস্ট্রির স্ট্যান্ডার্ড: \`.env.example\` প্যাটার্ন
প্রজেক্টে আসল পাসওয়ার্ড বা কি-বিহীন একটি ব্লুপ্রিন্ট ফাইল কমিট করে রাখুন, যাতে নতুন ডেভেলপার ক্লোন করে বুঝতে পারে কী কী কি লাগবে:

\`\`\`bash
# .env.example (এটি গিটহাবে পুশ হবে)
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/mydb
STRIPE_SECRET_KEY=sk_test_your_key_here
JWT_SECRET=your_super_secret_jwt_key
\`\`\`

### 🔹 \`.gitignore\`-এ যুক্ত করুন:
\`\`\`gitignore
.env
.env*.local
.env.production
.env.development
\`\`\`

---

## ৬. Build Files (বিল্ড ও ডিপেন্ডেন্সি আর্টফ্যাক্টস)

### 🔹 বিল্ড ফাইল কেন গিটে রাখা নিষেধ?
1. **Repository Bloat:** \`node_modules/\` বা \`bin/\` ফোল্ডারে হাজার হাজার কম্পাইল্ড ফাইল থাকে। এগুলো কমিট করলে রিপোজিটরির সাইজ মেগাবাইট থেকে গিগাবাইট হয়ে যায়, ক্লোন করতে ঘন্টার পর ঘন্টা সময় লাগে।
2. **Merge Conflict:** বাইনারি বা মিনিফাইড জাভাস্ক্রিপ্ট কোডে কোনো কার্যকর ডিফারেন্স (Diff) দেখা যায় না এবং এতে অহেতুক মার্জ কনফ্লিক্ট তৈরি হয়।
3. **ওএস অমিল:** আপনার ম্যাক মেশিনে তৈরি হওয়া বাইনারি লিনাক্স সার্ভার বা উইন্ডোজে রান করবে না। সার্ভার নিজেই প্যাকেজ ম্যানেজার দিয়ে ডিপেন্ডেন্সি ডাউনলোড ও বিল্ড করে নেবে।

### 🔹 বিভিন্ন ল্যাঙ্গুয়েজের কমন বিল্ড প্যাটার্ন:
* **Node.js:** \`node_modules/\`, \`dist/\`, \`.next/\`, \`coverage/\`
* **C# / .NET:** \`bin/\`, \`obj/\`, \`*.user\`, \`*.suo\`
* **Python:** \`__pycache__/\`, \`*.pyc\`, \`.venv/\`, \`dist/\`
* **Java:** \`target/\`, \`*.class\`, \`*.jar\`

---

## ৭. Sensitive Files (সংবেদনশীল ফাইল ও সিকিউরিটি রিকভারি)

### 🔹 সংবেদনশীল ফাইলসমূহ:
* SSH Private Keys: \`id_rsa\`, \`*.pem\`, \`*.key\`
* ডাটাবেজ ব্যাকআপ ফাইল: \`*.dump\`, \`*.sql\`
* ক্লাউড সার্ভিস একাউন্ট কি: \`firebase-adminsdk.json\`, \`aws-credentials.csv\`

### 🚨 ভুলবশত সিক্রেট গিটহাবে চলে গেলে কী করবেন?
> ⚠️ **সর্বোচ্চ সতর্কতা:** নতুন একটি কমিট দিয়ে ফাইলটি ডিলিট করে দিলে বা \`.gitignore\`-এ বসালে সমস্যা কিন্তু মেটে না! কারণ Git-এর পেছনের কমিট হিস্ট্রিতে সিক্রেটটি সারা জীবনের জন্য থেকে যায়।

1. **ধাপ ১: তাৎক্ষণিকভাবে কি বাতিল (Revoke & Rotate) করুন:**
   * কালক্ষেপণ না করে ক্লাউড ড্যাশবোর্ডে (AWS, Stripe, Firebase) গিয়ে লিক হওয়া কি-টি ডিলিট করে নতুন কি জেনারেট করুন। মনে রাখবেন, গিটহাবে পুশ হওয়ামাত্র বটরা তা কপি করে নেয়।
2. **ধাপ ২: গিট হিস্ট্রি থেকে ফাইলটি পুরোপুরি মুছে ফেলুন (Purge):**
   * আধুনিক টুল **BFG Repo-Cleaner** বা \`git-filter-repo\` দিয়ে সম্পূর্ণ গিট হিস্ট্রি স্ক্রাব করুন:
   \`\`\`bash
   # BFG Repo-Cleaner দিয়ে পুরো হিস্ট্রি থেকে .env ফাইল মুছে ফেলতে:
   bfg --delete-files .env
   
   # রেফলগ এক্সপায়ার করে ক্লিন করুন
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   
   # রিমোটে ফোর্স পুশ করুন
   git push origin --force --all
   \`\`\`
3. **ধাপ ৩: GitHub Secret Scanning চালু রাখা:**
   * রিপোজিটরির **Settings** > **Code security and analysis** থেকে **Push protection** অন করে রাখুন। এতে আপনি ভুল করে কি পুশ করলেও গিটহাব পুশ রিজেক্ট করে দেবে।
4. **ধাপ ৪: Pre-commit Hook ব্যবহার:**
   * \`gitleaks\` বা \`husky\` সেট করে নিলে কমিট করার আগেই লোকাল মেশিনে সিক্রেট স্ক্যান করে অ্যালার্ট দেবে।

---

## 📋 প্র্যাকটিক্যাল কমান্ড সামারি

| উদ্দেশ্য | কমান্ড |
| :--- | :--- |
| ফাইল কেন ইগনোর হচ্ছে তা টেস্ট করা | \`git check-ignore -v <file>\` |
| ফিজিক্যাল ফাইল অক্ষত রেখে গিট থেকে সরানো | \`git rm --cached <file>\` |
| ফোল্ডার অক্ষত রেখে গিট থেকে সরানো | \`git rm -r --cached <folder>\` |
| ইগনোর করা ফাইল জোর করে স্টেজ করা | \`git add -f <file>\` |
| গ্লোবাল .gitignore সেট করা | \`git config --global core.excludesfile ~/.gitignore_global\` |
| পুরো রিপোজিটরির .gitignore নতুন করে প্রয়োগ | \`git rm -r --cached . && git add . && git commit\` |
`,
  },
];

