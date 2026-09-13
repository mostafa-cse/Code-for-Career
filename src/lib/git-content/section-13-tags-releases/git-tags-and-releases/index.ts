import type { LocalLesson } from "@/lib/lessons-data";

export const gitTagsAndReleasesLesson: LocalLesson = {
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
  };
