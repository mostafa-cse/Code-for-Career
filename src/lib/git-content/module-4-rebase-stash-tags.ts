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

Understanding the exact difference between \`git merge\` and \`git rebase\` separates junior developers from senior software engineers in technical interviews.

---

## 1. Architectural Differences: Merge vs Rebase

Both commands integrate changes from one branch into another, but their approaches and philosophy are fundamentally opposite:

### A. \`git merge\` (Preserves Historical Truth)
Creates a new **3-way merge commit** tying the two branch histories together:
* **Pros**: Non-destructive. The exact sequence, timeline, and branch context are 100% preserved.
* **Cons**: If features branches are merged frequently without squashing, the commit history becomes a tangled "train track" graph cluttered with dozens of trivial merge commits.

### B. \`git rebase\` (Rewrites Linear History)
Picks up your branch's commits and **replays them one by one** on top of the latest commit of the target branch:
* **Pros**: Produces a perfectly clean, linear history. \`git log\` looks like all work happened sequentially in a straight line.
* **Cons**: Rewrites commit SHA hashes. If executed carelessly on shared public branches, it causes severe synchronization problems for teammates.

\`\`\`
Before:
main:     C1 <--- C2 <--- C3
                    \
feature:             C4 <--- C5

After 'git switch feature && git rebase main':
main:     C1 <--- C2 <--- C3
                           \
feature:                    C4' <--- C5' (new commit hashes replayed on top of C3!)
\`\`\`

---

## 2. Interactive Rebase: \`git rebase -i\`

Before opening a pull request, clean up your messy local WIP (Work-In-Progress) commits using interactive rebase:

\`\`\`bash
# Rebase the last 4 local commits
git rebase -i HEAD~4
\`\`\`

Git will open your editor with an interactive script:
\`\`\`
pick a1b2c3d feat(auth): implement jwt token generation
s e4f5g6h fix typo in token expiration claims
f i7j8k9l update unit tests for auth service
r m0n1o2p documentation for api endpoints
\`\`\`

### Common Commands:
* **\`pick\`**: Keep the commit as is.
* **\`reword\` (\`r\`)**: Keep the commit, but edit the commit message.
* **\`squash\` (\`s\`)**: Fold the commit into the previous commit, combining their commit messages.
* **\`fixup\` (\`f\`)**: Fold the commit into the previous commit, **discarding** this commit's message (ideal for quick typos/lint fixes!).
* **\`drop\` (\`d\`)**: Completely remove the commit from history.

---

## 3. Resolving Rebase Conflicts

During a rebase, conflicts are resolved **commit-by-commit** as they are replayed:
\`\`\`bash
# 1. Edit conflicting file and delete markers
# 2. Stage the resolved file (DO NOT RUN git commit!)
git add src/Services/AuthService.cs

# 3. Tell Git to continue replaying the next commit:
git rebase --continue

# Or abort and return everything to the exact pre-rebase state:
git rebase --abort
\`\`\`

---

## 4. The Golden Rule of Rebasing
> [!CAUTION]
> **NEVER rebase a branch that has already been pushed to a shared remote where other developers are collaborating.**
> Only rebase your own private local feature branches before submitting a PR!
`,
    contentBn: `# গিট মার্জ বনাম রিব্যাস: মেকানিক্স, ইন্টারঅ্যাক্টিভ রিব্যাস ও গোল্ডেন রুল

টেকনিক্যাল ইন্টারভিউতে \`git merge\` বনাম \`git rebase\` এর পার্থক্য সবচেয়ে বহুল জিজ্ঞাসিত প্রশ্নগুলোর একটি।

---

## ১. মার্জ বনাম রিব্যাসের মৌলিক পার্থক্য

* **মার্জ (\`git merge\`)**: এটি একটি নন-ডেস্ট্রাকটিভ অপারেশন। এটি পূর্বের কোনো ইতিহাস না বদলে একটি নতুন **মার্জ কমিট** তৈরি করে দুটি ব্রাঞ্চকে সংযুক্ত করে। ফলে হিস্ট্রি সত্য থাকে কিন্তু গ্রাফ কিছুটা জটিল দেখায়।
* **রিব্যাস (\`git rebase\`)**: এটি আপনার ব্রাঞ্চের কমিটগুলোকে সাময়িকভাবে তুলে নিয়ে টার্গেট ব্রাঞ্চের সর্বশেষ কমিটের মাথায় একে একে পুনরায় বসায় (Replay)। এর ফলে কোনো অতিরিক্ত মার্জ কমিট ছাড়াই ইতিহাস সম্পূর্ণ লিনিয়ার ও পরিষ্কার থাকে।

---

## ২. ইন্টারঅ্যাক্টিভ রিব্যাস (\`git rebase -i\`)
পিআর জমা দেওয়ার পূর্বে লোকাল মেশিনের ছোটখাটো অগোছালো কমিটগুলোকে সুন্দর করতে:
\`\`\`bash
git rebase -i HEAD~4
\`\`\`
* **\`pick\`**: কমিটটি রাখা।
* **\`squash\` (s)**: পূর্ববর্তী কমিটের সাথে মিলিয়ে দেওয়া এবং মেসেজ এডিট করা।
* **\`fixup\` (f)**: মেসেজ মুছে ফেলে সরাসরি আগের কমিটের সাথে একীভূত করা (ছোটখাটো ফিক্সের জন্য সেরা)।
* **\`reword\` (r)**: কমিটের নাম পরিবর্তন করা।

---

## ৩. রিব্যাসের গোল্ডেন রুল
পাবলিক বা শেয়ার্ড ব্রাঞ্চ (যেমন \`main\` বা \`develop\`) কখনোই রিব্যাস করবেন না। শুধুমাত্র নিজের পার্সোনাল ফিচার ব্রাঞ্চে রিব্যাস করুন।
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
