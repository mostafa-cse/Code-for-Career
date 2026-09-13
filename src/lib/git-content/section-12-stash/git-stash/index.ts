import type { LocalLesson } from "@/lib/lessons-data";

export const gitStashLesson: LocalLesson = {
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
| \`git stash pop\` | Restores top stash & **deletes** it from stack | Deleted |
| \`git stash apply\` | Restores top stash & **keeps** it on stack | Kept |
| \`git stash list\` | Displays all saved stashes with indices | Read-only |
| \`git stash show -p stash@{0}\` | Shows line-by-line diff inside a stash | Read-only |
| \`git stash drop stash@{n}\` | Deletes a specific stash entry | Deleted |
| \`git stash clear\` | Wipes the entire stash stack permanently | Cleared |
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
| \`git stash -u -m "msg"\` | নতুন আনট্র্যাকড ফাইলসহ তুলে রাখা | মেমোরিতে যুক্ত হয় |
| \`git stash pop\` | কোড ফিরিয়ে এনে স্ট্যাক থেকে **মুছে ফেলা** | মুছে যায় |
| \`git stash apply\` | কোড ফিরিয়ে এনে স্ট্যাকে **অক্ষত রাখা** | সংরক্ষিত থাকে |
| \`git stash list\` | সংরক্ষিত সমস্ত স্ট্যাশের তালিকা দেখা | Read-only |
| \`git stash show -p stash@{0}\` | স্ট্যাশের ভেতরের লাইন-বাই-লাইন কোড দেখা | Read-only |
| \`git stash drop stash@{n}\` | নির্দিষ্ট একটি স্ট্যাশ ডিলিট করা | মুছে যায় |
| \`git stash clear\` | সমস্ত স্ট্যাশ চিরতরে ডিলিট করা | সব খালি হয় |
`,
  };
