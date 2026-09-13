import type { LocalLesson } from "@/lib/lessons-data";

export const gitMergingLesson: LocalLesson = {
    slug: "git-merging",
    titleEn: "Merging: Fast-Forward, 3-Way Merge, Conflicts & Resolution",
    titleBn: "মার্জিং: ফাস্ট-ফরওয়ার্ড, ৩-ওয়ে মার্জ, কনফ্লিক্ট ও সমাধান",
    categoryEn: "6. Merging & Conflict Resolution",
    categoryBn: "৬. কোড মার্জ ও কনফ্লিক্ট সমাধান",
    categoryDescEn: "Fast-forward merges, three-way merge commits, merge conflicts, conflict markers, and conflict resolution workflows.",
    categoryDescBn: "ফাস্ট-ফরওয়ার্ড মার্জ, ৩-ওয়ে মার্জ কমিট, মার্জ কনফ্লিক্টের কারণ, কনফ্লিক্ট মার্কার এবং ধাপে ধাপে সমাধান কৌশল।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the algorithms behind Git merges, understand merge conflicts, and resolve collisions confidently in production.",
    descriptionBn: "গিট মার্জিং অ্যালগরিদম শিখুন, মার্জ কনফ্লিক্ট কেন ঘটে তা বুঝুন এবং আত্মবিশ্বাসের সাথে কনফ্লিক্ট সমাধান করুন।",
    difficulty: "MEDIUM",
    displayOrder: 6,
    prerequisites: ["git-branching"],
    estimatedMinutes: 30,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Basic Branching and Merging",
        url: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging",
        description: "Official walkthrough of fast-forward and 3-way merges.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "Walk through resolving a 3-way merge conflict from terminal step-by-step",
        url: null,
        difficulty: "MEDIUM",
        company: "Brain Station 23",
        tags: ["Git", "Merge", "Conflict Resolution", "Viva"],
        solutionEn: "1. Run 'git status' to find conflicting files marked 'both modified'. 2. Open file and inspect conflict markers (<<<<<<< HEAD for current branch, ======= divider, >>>>>>> incoming branch). 3. Decide proper code, delete markers, save. 4. Run 'git add <file>' to mark resolved. 5. Run 'git commit' to complete the merge commit. (Or run 'git merge --abort' if backing out).",
        solutionBn: "১. 'git status' চালিয়ে কনফ্লিক্ট হওয়া ফাইল চিহ্নিত করা। ২. ফাইল ওপেন করে কনফ্লিক্ট মার্কার (<<<<<<< HEAD, =======, >>>>>>>) দেখে সঠিক কোড ঠিক রাখা এবং মার্কার মুছে ফাইল সেভ করা। ৩. 'git add <file>' চালিয়ে কনফ্লিক্ট সমাধান মার্ক করা। ৪. 'git commit' চালিয়ে মার্জ সম্পন্ন করা। (প্রয়োজনে 'git merge --abort' দিয়ে মার্জ বাতিল করা যায়)।",
      },
    ],
    contentEn: `# Merging: git merge, Fast-Forward, 3-Way Merge, Conflicts, Abort & Best Practices

Merging is how isolated streams of development are brought together. Whether you are merging a feature branch into \`main\` locally or approving a Pull Request on GitHub, understanding the mathematics and algorithms behind Git merges is critical for every engineer.

---

## 1. What is \`git merge\`?

### The Core Concept:
\`git merge\` integrates the commits from another branch into your **currently active branch**.

\`\`\`bash
# The 2-step merge rule:
# Step 1: Switch to the RECEIVING branch (usually main or develop):
git switch main

# Step 2: Merge the incoming feature branch into main:
git merge feature/user-authentication
\`\`\`

> [!IMPORTANT]
> Merging always brings code **INTO** the branch you are currently standing on! Always double-check \`git branch\` to make sure you are on \`main\` before running \`git merge feature-branch\`.

---

## 2. Fast-Forward Merge (\`--ff\`)

A **Fast-Forward merge** occurs when there is **no divergence** between the two branches. The target branch has received zero new commits since the feature branch was created.

### How it works:
Because the history is completely linear, Git doesn't need to do any complex code blending. It simply **moves the \`main\` pointer forward** to point to the latest commit on the feature branch!

\`\`\`
Before Merge:
main:           C1 ───> C2
                          \
feature:                   C3 ───> C4

After 'git switch main && git merge feature':
main, feature:  C1 ───> C2 ───> C3 ───> C4 (HEAD)
\`\`\`

* **Result:** No new merge commit is created. The timeline remains a straight, unbroken line.
* **Force a Merge Commit (\`--no-ff\`):** Some enterprise teams require a distinct merge bubble in the history graph for every feature:
  \`\`\`bash
  git merge --no-ff feature/cart-checkout
  \`\`\`
* **Require Fast-Forward only (\`--ff-only\`):** Fails with an error if a true merge commit would be required:
  \`\`\`bash
  git merge --ff-only feature/cart-checkout
  \`\`\`

---

## 3. Three-Way Merge (True Merge Commit)

When **both** branches have progressed independently since they split apart, a Fast-Forward merge is physically impossible.

\`\`\`
Diverged History:
                  C3 ───> C4 [feature/payment]
                 /
C1 ───> C2 [Base]
                 \
                  C5 ───> C6 [main] (e.g. Someone else merged another feature!)
\`\`\`

### The 3-Way Merge Algorithm:
Git looks at three specific snapshots:
1. **Common Ancestor (C2):** The base commit where the two branches originally split.
2. **Current Branch Tip (C6 on \`main\`):** Where your \`HEAD\` is right now.
3. **Incoming Branch Tip (C4 on \`feature\`):** The code you want to bring in.

Git compares what changed between C2 -> C6 and what changed between C2 -> C4:
* If both branches edited **different files** (or different lines in the same file), Git automatically combines them and creates a **Merge Commit (M)** with two parent pointers!

\`\`\`
After Merge:
                  C3 ──────────> C4
                 /                 \
C1 ───> C2 [Base]                   M [Merge Commit on main]
                 \                 /
                  C5 ──────────> C6
\`\`\`

---

## 4. Merge Conflicts: Why They Happen

A **Merge Conflict** happens when Git's automatic algorithm cannot safely decide which code to keep.

### The Conflict Trigger:
A conflict occurs when two branches **modified the exact same lines of code in the same file** in different ways since their common ancestor. Git refuses to guess which engineer's code is correct, pauses the merge, and asks you to resolve it manually.

### Anatomy of Conflict Markers:
When a conflict occurs, Git writes special markers directly into your source code file:

\`\`\`csharp
<<<<<<< HEAD (Current change - Your main branch)
public decimal CalculateTax(decimal subtotal) => subtotal * 0.15m;
=======
public decimal CalculateTax(decimal subtotal) => subtotal * 0.20m;
>>>>>>> feature/tax-update (Incoming change - The feature branch)
\`\`\`

* \`<<<<<<< HEAD\`: Marks the beginning of the conflicting code from your current branch.
* \`=======\`: The dividing separator between the two conflicting versions.
* \`>>>>>>> branch-name\`: Marks the end of the conflicting code from the incoming branch.

---

## 5. Resolving Conflicts Step-by-Step

Never panic when you see a merge conflict! It is a normal, everyday part of collaborative software engineering. Follow these 5 steps:

\`\`\`bash
# Step 1: Attempt the merge:
git switch main
git merge feature/tax-update
# Output:
# Auto-merging src/Services/TaxService.cs
# CONFLICT (content): Merge conflict in src/Services/TaxService.cs
# Automatic merge failed; fix conflicts and then commit the result.

# Step 2: Check which files are in conflict:
git status
# Look for files marked: both modified: src/Services/TaxService.cs

# Step 3: Open the file in VS Code or your IDE.
# Discuss with the other developer or check the business requirement.
# Choose the correct code, and DELETE all the <<<<<<<, =======, and >>>>>>> marker lines!

# Step 4: Tell Git the conflict is resolved by staging the file:
git add src/Services/TaxService.cs

# Step 5: Finalize the merge commit:
git commit -m "merge: resolve tax rate calculation conflict between main and feature"
\`\`\`

---

## 6. Abort Merge (\`git merge --abort\`)

What if you start a merge, get hit with 15 complex merge conflicts across 30 files, and realize you are not ready to solve them right now?

\`\`\`bash
# Safely abort the entire merge process:
git merge --abort
\`\`\`

### What happens:
Git instantly rewinds your entire repository, working tree, and staging area back to the exact clean state before you typed \`git merge\`. No files are damaged or lost!

---

## 7. Merge Best Practices in Professional Teams

Top software teams follow these battle-tested practices to avoid painful "merge hell":

1. **Keep Branches Short-Lived:** Don't work on an isolated feature branch for 3 months. Merge small chunks of work into \`main\` every 2–3 days.
2. **Pull \`main\` Frequently:** Before opening a PR or merging, pull the latest \`main\` into your feature branch locally and test it:
   \`\`\`bash
   git switch feature/my-feature
   git merge main
   # (Resolve any small conflicts here in your private branch before touching production!)
   \`\`\`
3. **Always Run Tests Before Merging:** Run your unit tests and build scripts (\`npm run build\` or \`dotnet build\`) before committing a merge.
4. **Clean Descriptive Commit Messages:** If creating a manual merge commit, write what was integrated and why any conflicts were resolved the way they were.
`,
    contentBn: `# মার্জিং: git merge, ফাস্ট-ফরওয়ার্ড, ৩-ওয়ে মার্জ, কনফ্লিক্ট সমাধান ও বেস্ট প্র্যাকটিস

আলাদা আলাদা ব্রাঞ্চে স্বাধীনভাবে ফিচার তৈরির পর সেই কোড মূল প্রজেক্টে বা \`main\` ব্রাঞ্চে একত্রিত করার প্রক্রিয়াকেই বলা হয় **Merging (মার্জিং)**। ইন্টারভিউতে মার্জিং অ্যালগরিদম এবং মার্জ কনফ্লিক্ট সমাধানের নিয়ম সবচেয়ে বেশি জানতে চাওয়া হয়।

---

## ১. \`git merge\` কী?

### মূল ধারণা:
\`git merge\` অন্য কোনো ব্রাঞ্চের সমস্ত নতুন কমিটকে আপনার **বর্তমান সক্রিয় ব্রাঞ্চের (Current Active Branch)** সাথে জোড়া লাগায়।

\`\`\`bash
# মার্জ করার ২ ধাপের নিয়ম:
# ধাপ ১: যে ব্রাঞ্চে কোড আনতে চান সেখানে সুইচ করুন (সাধারণত main):
git switch main

# ধাপ ২: ফিচার ব্রাঞ্চটিকে main-এ মার্জ করুন:
git merge feature/user-authentication
\`\`\`

> [!IMPORTANT]
> **সতর্কতা:** মার্জ সর্বদা আপনি **যে ব্রাঞ্চে দাঁড়িয়ে আছেন তার ভেতর** কোড নিয়ে আসে! তাই \`git merge\` চালানোর আগে সর্বদা নিশ্চিত হোন যে আপনি \`main\` ব্রাঞ্চে আছেন কি না।

---

## ২. ফাস্ট-ফরওয়ার্ড মার্জ (Fast-Forward Merge)

যদি ফিচার ব্রাঞ্চ তৈরির পর থেকে মূল \`main\` ব্রাঞ্চে নতুন কোনো কমিট না পড়ে থাকে, তবে তাকে বলা হয় **Fast-Forward Merge**।

### কীভাবে কাজ করে?
যেহেতু দুই ব্রাঞ্চের মাঝে কোনো হিস্ট্রি ভিন্ন দিকে মোড় নেয়নি (Linear History), তাই গিট কোনো জটিল মার্জিং অ্যালগরিদম চালায় না। গিট কেবল \`main\` ব্রাঞ্চের পয়েন্টারটিকে সরাসরি ফিচার ব্রাঞ্চের শেষ কমিটে এগিয়ে দেয়!

\`\`\`
মার্জ করার আগে:
main:           C1 ───> C2
                          \
feature:                   C3 ───> C4

মার্জ করার পর:
main, feature:  C1 ───> C2 ───> C3 ───> C4 (HEAD)
\`\`\`

* **ফলাফল:** কোনো অতিরিক্ত "Merge Commit" তৈরি হয় না। হিস্ট্রি এক সরলরেখায় থাকে।
* **জোরপূর্বক মার্জ কমিট তৈরি (\`--no-ff\`):** কোম্পানিগুলো অনেক সময় আলাদা মার্জ বাবল দেখতে চায়:
  \`\`\`bash
  git merge --no-ff feature/cart-checkout
  \`\`\`

---

## ৩. ৩-ওয়ে মার্জ (Three-Way Merge)

যদি আপনি ফিচার ব্রাঞ্চে কাজ করার সময় অন্য কোনো সহকর্মী মূল \`main\` ব্রাঞ্চে আরেকটি নতুন ফিচার মার্জ করে ফেলেন, তখন উভয় ব্রাঞ্চের ইতিহাস দুই দিকে মোড় নেয় (Diverged)। এক্ষেত্রে ফাস্ট-ফরওয়ার্ড অসম্ভব।

\`\`\`
উভয় ব্রাঞ্চ পরিবর্তিত হলে:
                  C3 ───> C4 [feature/payment]
                 /
C1 ───> C2 [Base]
                 \
                  C5 ───> C6 [main] (অন্য কারো কোড যুক্ত হয়েছে)
\`\`\`

### ৩-ওয়ে অ্যালগরিদম কীভাবে কাজ করে?
গিট ৩টি নির্দিষ্ট কমিটকে একসাথে তুলনা করে:
1. **কমন বেস (Common Base - C2):** যেখানে ব্রাঞ্চ দুটি বিভক্ত হয়েছিল।
2. **বর্তমান ব্রাঞ্চের মাথা (C6 on \`main\`):** আপনি যেখানে আছেন।
3. **আগত ব্রাঞ্চের মাথা (C4 on \`feature\`):** যা আপনি যুক্ত করতে চান।

যদি উভয় ব্রাঞ্চ **ভিন্ন ভিন্ন ফাইলে** কাজ করে থাকে, গিট চমৎকারভাবে সব কোড একত্রিত করে একটি বিশেষ **Merge Commit (M)** তৈরি করে দেয় যার দুটি প্যারেন্ট কমিট থাকে!

\`\`\`
মার্জ শেষে:
                  C3 ──────────> C4
                 /                 \
C1 ───> C2 [Base]                   M [মার্জ কমিট]
                 \                 /
                  C5 ──────────> C6
\`\`\`

---

## ৪. মার্জ কনফ্লিক্ট (Merge Conflict): কেন ঘটে?

মার্জ কনফ্লিক্ট হলো যখন গিট একা একা সিদ্ধান্ত নিতে পারে না কোন কোডটি সঠিক।

### কনফ্লিক্টের মূল কারণ:
যদি দুটি আলাদা ব্রাঞ্চে **একই ফাইলের হুবহু একই লাইনে** দুজন ডেভেলপার দুই ধরণের কোড লেখেন, তখন গিট দ্বিধায় পড়ে যায়। সে কারো কোড নষ্ট না করে মার্জ থামিয়ে দেয় এবং আপনাকে ডেকে বলে—"তোমরা নিজেরা ঠিক করো কোন কোডটি থাকবে!"

### কনফ্লিক্ট মার্কারের পরিচয়:
কনফ্লিক্ট হলে গিট ফাইলের ভেতরে ৩টি বিশেষ চিহ্ন বসায়:

\`\`\`csharp
<<<<<<< HEAD (আপনার বর্তমান ব্রাঞ্চের কোড)
public decimal CalculateTax(decimal subtotal) => subtotal * 0.15m;
=======
public decimal CalculateTax(decimal subtotal) => subtotal * 0.20m;
>>>>>>> feature/tax-update (অন্য ব্রাঞ্চ থেকে আসা কোড)
\`\`\`

* \`<<<<<<< HEAD\`: আপনার বর্তমান ব্রাঞ্চের কোডের শুরু।
* \`=======\`: দুই ব্রাঞ্চের কোডের মাঝখানের বিভাজন রেখা।
* \`>>>>>>> branch-name\`: আগত ব্রাঞ্চের কোডের শেষ।

---

## ৫. কনফ্লিক্ট সমাধানের সহজ ৫টি ধাপ

কনফ্লিক্ট দেখলে কখনো ঘাবড়াবেন না। সফটওয়্যার ইঞ্জিনিয়ারিংয়ে এটি প্রতিদিনের স্বাভাবিক ঘটনা:

\`\`\`bash
# ধাপ ১: মার্জ কমান্ড দিন:
git switch main
git merge feature/tax-update
# কনফ্লিক্ট থাকলে আউটপুট আসবে: Automatic merge failed; fix conflicts...

# ধাপ ২: কোন ফাইলে সমস্যা তা দেখুন:
git status
# ফাইলের পাশে লেখা থাকবে: both modified: TaxService.cs

# ধাপ ৩: ফাইলটি VS Code-এ খুলুন।
# অন্য ইঞ্জিনিয়ারের সাথে আলোচনা করে সঠিক কোডটি রাখুন এবং
# <<<<<<<, =======, >>>>>>> মার্কারগুলো ফাইল থেকে মুছে দিন!

# ধাপ ৪: সমাধান সম্পন্ন হয়েছে বোঝাতে ফাইলে git add চালান:
git add TaxService.cs

# ধাপ ৫: মার্জ সম্পন্ন করতে কমিট দিন:
git commit -m "merge: resolve tax calculation conflict between main and feature"
\`\`\`

---

## ৬. মার্জ বাতিল করা: \`git merge --abort\`

মার্জ করতে গিয়ে যদি দেখেন ৫০টি ফাইলে ভয়াবহ কনফ্লিক্ট হয়েছে এবং এই মুহূর্তে তা ঠিক করার সময় নেই:

\`\`\`bash
# পুরো মার্জ প্রক্রিয়াটি তৎক্ষণাৎ বাতিল করে আগের পরিষ্কার অবস্থায় ফিরতে:
git merge --abort
\`\`\`
এই কমান্ড দিলে গিট আপনার প্রোজেক্টকে ঠিক মার্জ কমান্ড দেওয়ার আগের নিখুঁত অবস্থায় ফিরিয়ে নেবে। কোনো কোড হারাবে না।

---

## ৭. ইন্ডাস্ট্রিয়াল মার্জ বেস্ট প্র্যাকটিস

1. **ব্রাঞ্চের আয়ু ছোট রাখুন:** ৩ মাস ধরে একটি ব্রাঞ্চে কাজ জমিয়ে রাখবেন না। ২-৩ দিন পর পর ছোট ছোট ফিচার মার্জ করুন।
2. **নিয়মিত \`main\` পুল করুন:** আপনার ফিচার ব্রাঞ্চে কাজ করার সময় প্রতিদিন একবার \`main\` ব্রাঞ্চের কোড নিজের ব্রাঞ্চে মার্জ করে নিন। এতে কনফ্লিক্ট হলেও তা খুব ছোট থাকবে।
3. **মার্জের পর টেস্ট চালান:** মার্জ সম্পন্ন করার পর অবশ্যই পুরো প্রোজেক্ট বিল্ড ও ইউনিট টেস্ট চালিয়ে নিশ্চিত হোন যে সবকিছু ঠিকঠাক চলছে।
`,
  };
