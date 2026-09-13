import type { LocalLesson } from "@/lib/lessons-data";

export const gitMergeVsRebaseLesson: LocalLesson = {
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
> ### The Golden Rule of Rebasing:
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
| **Safety on Public Branches** | 100% Safe | Dangerous (violates Golden Rule) |
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
* **\`fixup\` (f)**: কোনো মেসেজ না রেখে সরাসরি আগের কমিটের ভেতরে ঢুকিয়ে দেওয়া (ছোটখাটো টাইপো বা বাগ ফিক্সের জন্য সেরা)।
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

# ৪. মারাত্মক ভুল এড়িয়ে চলুন: কখনো 'git commit' চালাবেন না!
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
> ### The Golden Rule of Rebasing:
> **যে কমিটগুলো ইতিমধ্যে ইন্টারনেটে গিটহাবে পুশ করা হয়েছে এবং যে ব্রাঞ্চে অন্য সহকর্মীরা কাজ করছেন, সেই পাবলিক বা শেয়ার্ড ব্রাঞ্চে কখনোই রিব্যাস করবেন না!**

### গোল্ডেন রুল ভাঙলে কী সর্বনাশ হয়?
রিব্যাস কমিটের হ্যাশ পরিবর্তন করে। আপনি যদি শেয়ার্ড ব্রাঞ্চে রিব্যাস করে গিটহাবে \`push --force\` করেন, তবে সহকর্মীদের লোকাল কোডের সাথে রিমোটের কোড মারাত্মকভাবে অমিল (Diverge) হবে। পরবর্তীতে তাঁরা পুল বা পুশ করতে গেলে ডুপ্লিকেট ফ্যান্টম কমিট ও মার্জ কনফ্লিক্টের এক ভয়াবহ বিশৃঙ্খলা তৈরি হবে।

### এক নজরে তুলনা:

| তুলনার বিষয় | \`git merge\` | \`git rebase\` |
| :--- | :--- | :--- |
| **হিস্ট্রি গ্রাফ** | শাখা-প্রশাখাযুক্ত ৩-ওয়ে মার্জ হিস্ট্রি | সোজা, পরিচ্ছন্ন লিনিয়ার লাইন |
| **কমিট হ্যাশ** | পুরনো হ্যাশ ১০০% অক্ষত থাকে | নতুন কমিট হ্যাশ তৈরি হয় (ইতিহাস বদলায়) |
| **কনফ্লিক্ট সমাধান**| একবারে মার্জ কমিটে সমাধান | প্রতিটি কমিট রি-প্লে হওয়ার সময় ধাপে ধাপে |
| **পাবলিক ব্রাঞ্চে নিরাপত্তা** | সম্পূর্ণ নিরাপদ | মারাত্মক ঝুঁকিপূর্ণ |
| **আদর্শ স্থান** | শেয়ার্ড ব্রাঞ্চ (\`main\`, \`develop\`) | লোকাল ব্যক্তিগত ফিচার ব্রাঞ্চ |
`,
  };
