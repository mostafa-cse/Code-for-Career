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

Suppose you are in the middle of writing a complex feature and suddenly a critical bug strikes production. You must switch to \`main\` immediately, but Git refuses to switch branches because of uncommitted modified files. The answer is **\`git stash\`**.

---

## 1. How Git Stash Works

\`git stash\` acts like a temporary clipboard / shelf. It takes all your dirty modified tracked files and staged changes, saves them on an internal stack, and reverts your working directory to match the clean \`HEAD\` commit.

\`\`\`bash
# 1. Stash changes with a descriptive message
git stash push -m "WIP: customer discount calculation logic"

# 2. Now your workspace is 100% clean! Switch branches freely:
git switch main
# ... fix hotfix bug, commit, and push ...

# 3. Switch back to your feature branch:
git switch feature/discounts

# 4. Restore your work and remove from stash stack:
git stash pop
\`\`\`

---

## 2. \`git stash pop\` vs \`git stash apply\`

* **\`git stash pop\`**: Restores \`stash@{0}\` and **deletes** it from the stash list.
* **\`git stash apply\`**: Restores \`stash@{0}\` but **preserves** it on the stash list (useful if you want to apply the same experiment across multiple branches).

---

## 3. Stashing Untracked Files: \`git stash -u\`

By default, \`git stash\` **ignores untracked files**. If you created new files that haven't been staged, use the \`-u\` (\`--include-untracked\`) flag:

\`\`\`bash
git stash -u -m "WIP: includes newly created service classes"
\`\`\`

---

## 4. Managing the Stash Stack

\`\`\`bash
# View all saved stashes
git stash list
# stash@{0}: On feature/discounts: WIP: discount calculation
# stash@{1}: On main: Temporary experimental logging

# Inspect the diff inside a stash without applying it
git stash show -p stash@{0}

# Delete a specific stash
git stash drop stash@{1}

# Wipe the entire stash list clean
git stash clear
\`\`\`
`,
    contentBn: `# গিট স্ট্যাশ: কোড শেলভিং, পপ, অ্যাপ্লাই ও ড্রপ কৌশল

মাঝপথে কোড লেখার সময় হঠাৎ জরুরি অন্য ব্রাঞ্চে যেতে হলে অসমাপ্ত কাজ নষ্ট না করে সাময়িক তুলে রাখার জাদুকরী টুল হলো \`git stash\`।

---

## ১. কীভাবে কাজ করে?
\`git stash\` আপনার অসম্পূর্ণ আনকমিটেড কোডকে একটি হিডেন স্ট্যাকে জমা রাখে এবং আপনার ওয়ার্কস্পেসকে সম্পূর্ণ ক্লিন করে দেয়, ফলে নিরাপদে ব্রাঞ্চ সুইচ করা যায়।

\`\`\`bash
# মেসেজসহ স্ট্যাশ করা:
git stash push -m "wip: discount calculation"

# ক্লিন ওয়ার্কস্পেসে অন্য কাজ শেষ করে ফিরে এসে কোড রিস্টোর করতে:
git stash pop
\`\`\`

---

## ২. \`pop\` বনাম \`apply\`
* **\`git stash pop\`**: কোড ফিরিয়ে আনে এবং সাথে সাথে স্ট্যাশ মেমোরি থেকে ডিলিট করে।
* **\`git stash apply\`**: কোড ফিরিয়ে আনলেও স্ট্যাশ মেমোরিতে তা সংরক্ষিত রাখে।

---

## ৩. আনট্র্যাকড ফাইলসহ স্ট্যাশ করা: \`git stash -u\`
ডিফল্টভাবে নতুন তৈরি হওয়া আনট্র্যাকড ফাইল স্ট্যাশ হয় না। নতুন ফাইলসহ স্ট্যাশ করতে \`-u\` ফ্ল্যাগ ব্যবহার করতে হয়:
\`\`\`bash
git stash -u
\`\`\`
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
