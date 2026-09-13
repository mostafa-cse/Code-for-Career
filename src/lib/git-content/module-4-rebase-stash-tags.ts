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

While branches move forward with every new commit, a **Git Tag** is a permanent, immutable milestone marking a specific release in your project's history (e.g. \`v1.0.0\`, \`v2.3.1\`).

---

## 1. Semantic Versioning (SemVer)

Industry-standard software versioning follows the \`MAJOR.MINOR.PATCH\` format:
* **MAJOR (v2.0.0)**: Breaking changes that are not backwards-compatible.
* **MINOR (v1.1.0)**: New features added in a backwards-compatible manner.
* **PATCH (v1.0.1)**: Backwards-compatible bug fixes.

---

## 2. Lightweight vs Annotated Tags

### Annotated Tags (Recommended for Production Releases)
Contains full metadata, tagger identity, date, and a release message:
\`\`\`bash
git tag -a v1.0.0 -m "Release v1.0.0: Stable production launch with payment integration"
\`\`\`

### Lightweight Tags (Quick Internal Bookmarks)
Just a simple pointer to the current commit without extra metadata:
\`\`\`bash
git tag v1.0.0-beta
\`\`\`

---

## 3. Inspecting and Pushing Tags

By default, **\`git push\` does NOT transfer tags to remote servers!** You must push them explicitly:

\`\`\`bash
# List all existing tags
git tag

# Inspect details of an annotated tag
git show v1.0.0

# Push a specific tag to GitHub
git push origin v1.0.0

# Push ALL local tags to GitHub at once
git push origin --tags

# Delete a tag locally and remotely
git tag -d v1.0.0
git push origin --delete v1.0.0
\`\`\`

---

## 4. GitHub Releases
On GitHub, pushing a tag allows you to create an official **Release**. You can write release notes, summarize merged PRs with one click ("Generate release notes"), and attach compiled distribution binaries (e.g., \`.zip\`, \`.tar.gz\`, \`.exe\`).
`,
    contentBn: `# ট্যাগ ও রিলিজ: সেম্যান্টিক ভার্সনিং, অ্যানোটেটেড ট্যাগ ও গিটহাব রিলিজ

ব্রাঞ্চ প্রতিনিয়ত নতুন কমিটের সাথে সামনে এগিয়ে যায়, কিন্তু **ট্যাগ (Tag)** হলো ইতিহাসের একটি নির্দিষ্ট কমিটে আটকানো স্থায়ী ও অপরিবর্তনীয় সাইনবোর্ড যা প্রজেক্টের রিলিজ ভার্সন নির্দেশ করে।

---

## ১. সেম্যান্টিক ভার্সনিং (SemVer)
* **MAJOR (v2.0.0)**: ব্রেকিং চেঞ্জ যা পূর্ববর্তী কোডের সাথে সরাসরি সামঞ্জস্যপূর্ণ নয়।
* **MINOR (v1.1.0)**: নতুন ফিচার যা পূর্বের কোড না ভেঙেই কাজ করে।
* **PATCH (v1.0.1)**: বাগ ফিক্স।

---

## ২. অ্যানোটেটেড ট্যাগ বনাম লাইটওয়েট ট্যাগ
প্রোডাকশনের জন্য সবসময় **অ্যানোটেটেড ট্যাগ (\`-a\`)** ব্যবহার করতে হয়, যাতে রিলিজের বিবরণ ও ট্যাগারের তথ্য সংরক্ষিত থাকে:
\`\`\`bash
git tag -a v1.0.0 -m "Release v1.0.0: Initial production release"
\`\`\`

---

## ৩. রিমোটে ট্যাগ পুশ করা
মনে রাখবেন, সাধারণ \`git push\` ট্যাগ আপলোড করে না। ট্যাগ আলাদাভাবে পুশ করতে হয়:
\`\`\`bash
# নির্দিষ্ট ট্যাগ পুশ করতে:
git push origin v1.0.0

# সমস্ত লোকাল ট্যাগ একসাথে পুশ করতে:
git push origin --tags
\`\`\`
`,
  },
  {
    slug: "git-ignore-and-repo-management",
    titleEn: "Git Ignore & Repo Management: .gitignore, Global Ignore & Untracking",
    titleBn: "গিট ইগনোর ও রিপো ম্যানেজমেন্ট: .gitignore, গ্লোবাল ইগনোর ও আনট্র্যাকিং",
    categoryEn: "14. Repository Hygiene & Gitignore",
    categoryBn: "১৪. রিপোজিটরি পরিচ্ছন্নতা ও .gitignore",
    categoryDescEn: "Writing .gitignore rules, glob patterns, global gitignore, removing accidentally tracked files from cache, and protecting sensitive files.",
    categoryDescBn: ".gitignore সিনট্যাক্স, গ্লোবাল ইগনোর, ভুলবশত ট্র্যাক হওয়া ফাইল ক্যাশ থেকে সরানো এবং গোপন তথ্যের সুরক্ষা।",
    categoryPriority: "CORE",
    descriptionEn: "Master .gitignore syntax, global rules, and safely untrack committed build artifacts or secrets without deleting them locally.",
    descriptionBn: ".gitignore সিনট্যাক্স এবং ভুলবশত কমিট হয়ে যাওয়া ফাইল লোকালি অক্ষত রেখে গিট হিস্ট্রি থেকে নিরাপদে সরানোর কৌশল শিখুন।",
    difficulty: "EASY",
    displayOrder: 14,
    prerequisites: ["git-working-with-changes"],
    estimatedMinutes: 20,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Gitignore Templates",
        title: "GitHub Collection of .gitignore Templates",
        url: "https://github.com/github/gitignore",
        description: "Official collection of production gitignore files for .NET, Node, Python, and more.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "If a file was accidentally committed to Git and later added to .gitignore, why does Git still track it, and how do you fix it?",
        url: null,
        difficulty: "MEDIUM",
        company: "Samsung R&D (SRBD)",
        tags: ["Git", "gitignore", "git rm --cached", "Hygiene"],
        solutionEn: ".gitignore only prevents UNTRACKED files from being added to Git. If a file was already committed, Git already tracks it and ignores .gitignore rules for that file. To fix this without deleting the actual file from your computer, remove it from the Git index cache via 'git rm --cached <filename>', and then commit.",
        solutionBn: ".gitignore শুধুমাত্র নতুন আনট্র্যাকড ফাইলের ওপর কার্যকর হয়। কোনো ফাইল একবার কমিট হয়ে গেলে গিট তা ট্র্যাক করতে থাকে এবং .gitignore এর নিয়ম উপেক্ষা করে। ফাইলটি কম্পিউটারে অক্ষত রেখে শুধুমাত্র গিট ট্র্যাকিং থেকে বাদ দিতে 'git rm --cached <filename>' চালিয়ে কমিট করতে হয়।",
      },
    ],
    contentEn: `# Git Ignore & Repo Management: .gitignore, Global Ignore & Untracking

A clean repository contains source code, tests, and configuration templates—never compiled binaries, IDE scratch files, or sensitive environment variables.

---

## 1. Syntax of \`.gitignore\`

\`\`\`gitignore
# Comment line

# Ignore all files ending with .log
*.log

# But DO track this specific important log:
!important.log

# Ignore all build output folders named 'bin' or 'obj' anywhere in the project
bin/
obj/

# Ignore node_modules directory
node_modules/

# Ignore environment variables containing real API credentials
.env
.env.local

# Ignore macOS metadata files
.DS_Store
\`\`\`

---

## 2. Untracking Files Already Committed: \`git rm --cached\`

A common blunder is committing \`appsettings.Development.json\` or a database file before creating \`.gitignore\`. Simply adding it to \`.gitignore\` afterwards does nothing because Git already tracks it!

### The Solution:
\`\`\`bash
# 1. Remove file from Git tracking without deleting your local copy
git rm --cached appsettings.Development.json

# If removing an entire folder (e.g., accidentally committed bin/ or node_modules/):
git rm -r --cached bin/

# 2. Add rule to .gitignore
echo "appsettings.Development.json" >> .gitignore

# 3. Commit the removal
git commit -m "chore: untrack local environment settings and build artifacts"
\`\`\`

---

## 3. Setting Up a Machine-Wide Global \`.gitignore\`

Instead of adding your editor files (\`.vscode/\`, \`.idea/\`, \`.DS_Store\`) to every single project repository:

\`\`\`bash
# 1. Create a global ignore file in your home directory
touch ~/.gitignore_global

# 2. Add OS and editor junk to it:
echo ".DS_Store" >> ~/.gitignore_global
echo "Thumbs.db" >> ~/.gitignore_global
echo ".vscode/" >> ~/.gitignore_global

# 3. Configure Git to respect it globally:
git config --global core.excludesfile ~/.gitignore_global
\`\`\`
`,
    contentBn: `# গিট ইগনোর ও রিপো ম্যানেজমেন্ট: .gitignore, গ্লোবাল ইগনোর ও আনট্র্যাকিং

প্রজেক্টে অপ্রয়োজনীয় বাইনারি বা কনফিগারেশন ফাইল কমিট না করতে \`.gitignore\` সঠিকভাবে কনফিগার করা জরুরি।

---

## ১. \`.gitignore\` সিনট্যাক্স
* \`*.log\`: সব লগ ফাইল ইগনোর করবে।
* \`bin/\`, \`obj/\`: বিল্ড ফোল্ডার বাদ দেবে।
* \`node_modules/\`: থার্ড পার্টি প্যাকেজ ডিরেক্টরি বাদ দেবে।
* \`.env\`: সিক্রেট ক্রেডেনশিয়ালযুক্ত ফাইল গিটহাবে যাওয়া ঠেকাবে।

---

## ২. ভুলবশত কমিট হওয়া ফাইল ট্র্যাকিং থেকে সরানো
যদি কোনো ফাইল ভুল করে আগেই গিটহাবে চলে গিয়ে থাকে, তবে কম্পিউটার থেকে ফাইল না মুছে শুধুমাত্র গিট থেকে বাদ দিতে:
\`\`\`bash
# ফাইল লোকাল ড্রাইভে অক্ষত রেখে গিট ইনডেক্স থেকে মুছতে:
git rm --cached config.json

# পুরো ফোল্ডার সরাতে:
git rm -r --cached bin/

# পরিবর্তনটি কমিট করুন:
git commit -m "chore: untrack build and secret files"
\`\`\`

---

## ৩. গ্লোবাল \`.gitignore\`
কম্পিউটারের সমস্ত প্রজেক্টের জন্য একসাথে \`.DS_Store\` বা \`.vscode/\` ইগনোর করতে গ্লোবাল ফাইল সেট করা যায়:
\`\`\`bash
git config --global core.excludesfile ~/.gitignore_global
\`\`\`
`,
  },
];
