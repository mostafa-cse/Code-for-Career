import type { LocalLesson } from "@/lib/lessons-data";

export const gitCollaborationLesson: LocalLesson = {
    slug: "git-collaboration",
    titleEn: "Collaboration: Fork, Clone, Branch, PR, Issues & Team Workflows",
    titleBn: "টিম কোলাবোরেশন: ফোর্ক, ক্লোন, ব্রাঞ্চ, পিআর, ইস্যু ও টিম ওয়ার্কফ্লো",
    categoryEn: "10. Team Collaboration Models",
    categoryBn: "১০. টিম কোলাবোরেশন ও ওপেন সোর্স মডেল",
    categoryDescEn: "Forking workflow, open-source contributions, synchronized upstreams, GitHub Issues, Discussions, and trunk-based development.",
    categoryDescBn: "ফোর্কিং ওয়ার্কফ্লো, ওপেন সোর্স অবদান, আপস্ট্রিম সিঙ্ক, গিটহাব ইস্যু, ডিসকাশন এবং ট্রাঙ্ক-বেসড ডেভেলপমেন্ট মডেল।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master open-source contribution and corporate team workflows: Forking, Branching, Issues, Discussions, and Trunk-Based Development.",
    descriptionBn: "ওপেন সোর্স এবং কর্পোরেট সফটওয়্যার টিমের কাজের পূর্ণাঙ্গ ওয়ার্কফ্লো শিখুন: ফোর্কিং, ব্রাঞ্চিং, ইস্যু ট্র্যাকিং ও ট্রাঙ্ক-বেসড ডেভেলপমেন্ট।",
    difficulty: "MEDIUM",
    displayOrder: 10,
    prerequisites: ["git-pull-requests"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "Collaborating with Issues and Pull Requests",
        url: "https://docs.github.com/en/issues",
        description: "Official guide on team collaboration with issues and milestones.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "Explain the complete Forking Workflow used in large open-source projects",
        url: null,
        difficulty: "MEDIUM",
        company: "BJIT Group",
        tags: ["Git", "Forking", "Open Source", "Workflow"],
        solutionEn: "1. Fork the upstream repository to your personal GitHub account. 2. Clone your fork locally ('origin'). 3. Add original repo as 'upstream' (git remote add upstream <url>). 4. Create a feature branch. 5. Code, commit, and push to your fork. 6. Open a PR from your fork's branch to upstream's main. 7. Sync new upstream changes via 'git fetch upstream && git merge upstream/main'.",
        solutionBn: "১. মূল রিপোজিটরির একটি পার্সোনাল কপি তৈরি করতে GitHub এ 'Fork' করা। ২. নিজের ফোর্কটি মেশিনে ক্লোন করা (origin)। ৩. মূল রিপোজিটরিকে 'upstream' হিসেবে যুক্ত করা। ৪. নতুন ফিচার ব্রাঞ্চ তৈরি করে কাজ করা। ৫. নিজের ফোর্কে পুশ করা। ৬. মূল রিপোজিটরির মেইন ব্রাঞ্চের উদ্দেশ্যে Pull Request তৈরি করা। ৭. মূল রিপোজিটরি আপডেট হলে 'git fetch upstream' দিয়ে নিজের লোকাল কোড সিঙ্ক রাখা।",
      },
    ],
    contentEn: `# Team Collaboration: Fork, Clone, Branch, Push, PR, Review, Issues, Discussions & Workflows

Software engineering is inherently a team sport. Whether you are building mission-critical backend systems at a top tech company or contributing to a global open-source project like React or Linux, you must master the complete **Collaborative Engineering Workflow**.

Here is the comprehensive, end-to-end breakdown of the 9 essential components of team collaboration on GitHub:

---

## 1. Fork (Creating Your Personal Cloud Copy)

### Real-world Analogy:
> Imagine visiting a public library with a rare, historic book. The librarian will not let you write directly in the original book with a pen. Instead, you make a complete photocopy of the book to take home. In your photocopy, you can freely highlight, annotate, and add new chapters without damaging the library's master copy.

### What is a Fork?
A **Fork** is a complete, independent copy of another user or organization's repository stored directly in your personal GitHub account.

- **When to Fork**: When you want to contribute to an open-source library (e.g., \`dotnet/aspnetcore\` or \`facebook/react\`) or an external repository where you do not have direct write permissions.
- **Fork vs. Branch**:
  - A **Branch** lives *inside the same repository* (used when you and your teammates share direct write access).
  - A **Fork** creates an entirely *separate repository copy* under your personal account (\`github.com/your-username/repo-name\`).

---

## 2. Clone (Downloading Cloud Code to Your Local Laptop)

Once you have forked a repository on GitHub, you need to bring it down to your local computer so you can open it in VS Code, compile, and run tests.

\`\`\`bash
# 1. Clone your personal fork to your machine:
git clone https://github.com/your-username/project-name.git
cd project-name

# 2. Configure the two critical remotes:
# 'origin'   -> Points to YOUR personal fork (where you have write/push access)
# 'upstream' -> Points to the ORIGINAL repository (where you pull latest updates)
git remote add upstream https://github.com/original-author/project-name.git

# 3. Verify your remotes:
git remote -v
# origin    https://github.com/your-username/project-name.git (fetch & push)
# upstream  https://github.com/original-author/project-name.git (fetch & push)
\`\`\`

---

## 3. Branch (Isolated Workspaces)

> [!IMPORTANT]
> **The Golden Open-Source Rule**: **NEVER write code directly on the \`main\` branch of your fork!**  
> Always keep your fork's \`main\` branch clean, untouched, and strictly synchronized with \`upstream/main\`.

### Creating a Dedicated Feature Branch:
\`\`\`bash
# 1. Fetch the latest changes from the original project:
git fetch upstream

# 2. Create a new topic branch based on upstream's latest main:
git switch -c fix/order-cancellation-timeout upstream/main
\`\`\`

Now you have an isolated sandbox. If you make a mistake or decide to discard this feature, your \`main\` branch remains 100% pristine.

---

## 4. Push (Uploading Your Feature Branch)

After implementing your changes, running local tests, and writing clean commits, you upload your branch to your own GitHub account.

\`\`\`bash
# Stage and commit your code:
git add .
git commit -m "fix(orders): handle race condition during order cancellation"

# Push the branch to YOUR personal fork ('origin'):
git push -u origin fix/order-cancellation-timeout
\`\`\`

> **Notice**: You push to \`origin\` (your fork), NOT \`upstream\`! You do not have permission to push directly to the original repository.

---

## 5. Pull Request (Proposing Your Changes)

Now that your feature branch is on GitHub, it is time to ask the original project maintainers to incorporate your code.

1. Go to the original repository (or your fork) on [GitHub](https://github.com).
2. GitHub will automatically show a banner: **"Compare & pull request across forks"**.
3. Verify the direction of the PR:
   - **Base Repository**: \`original-author/project\` (branch: \`main\`)
   - **Head Repository**: \`your-username/project\` (branch: \`fix/order-cancellation-timeout\`)
4. Write a comprehensive PR description detailing:
   - What problem this PR solves.
   - Any open issue number it fixes (e.g., \`Closes #184\`).
   - Step-by-step instructions for maintainers to verify your fix.
5. Click **Create pull request**.

---

## 6. Code Review (Iterating with Maintainers)

Once your PR is submitted:
1. Automated CI/CD pipelines will run across multiple operating systems and environments (e.g., Ubuntu, macOS, Windows).
2. Maintainers will review your code line by line in the **Files changed** tab.

### Handling Review Feedback Professionally:
- **Don't take feedback personally**: Senior engineers critique the *code*, not your worth as a developer.
- **Applying requested changes**:
  \`\`\`bash
  # Make the requested edits locally in the SAME branch:
  git add .
  git commit -m "refactor(orders): use lock-free concurrent dictionary as suggested"
  git push origin fix/order-cancellation-timeout
  \`\`\`
  *(The PR on GitHub updates automatically with your new commits! You do NOT need to open a new PR!)*
- When the maintainers approve the PR, they will merge your code into the master project. **Congratulations, you are now an official contributor!**

---

## 7. Issues (Bug Tracking & Task Management)

GitHub Issues serve as the project's central task board and bug tracker.

### What Issues Are Used For:
- **Bug Reports**: Documenting software crashes, unexpected behaviors, and steps to reproduce.
- **Feature Requests**: Proposing new capabilities or UX improvements before writing code.
- **Technical Debt**: Refactoring legacy modules or upgrading deprecated packages.

### Anatomy of an Issue:
- **Labels**: Categorize issues (e.g., \`bug\`, \`enhancement\`, \`good first issue\`, \`help wanted\`, \`documentation\`).
- **Assignees**: The developers responsible for solving the ticket.
- **Milestones**: Target release dates or sprints (e.g., \`v2.0.0 Beta\`, \`Sprint 42\`).

### 💡 Magic Closing Keywords:
If you include specific keywords in your commit message or PR description, GitHub will **automatically close the issue** when your PR is merged:
\`\`\`markdown
Closes #42
Fixes #108
Resolves #256
\`\`\`

---

## 8. Discussions (Community Brainstorming & Q&A)

While **Issues** track actionable bugs and concrete tasks, **GitHub Discussions** provide a forum-style space for open-ended community conversation.

| Feature | GitHub Issues | GitHub Discussions |
| :--- | :--- | :--- |
| **Purpose** | Actionable tasks & bug reports | Ideas, Q&A, brainstorming, announcements |
| **Lifecycle** | Open ➔ Closed (by code or PR) | Ongoing conversation / community forum |
| **Outcome** | Results in a Pull Request / Commit | Results in an RFC, consensus, or accepted answer |
| **Q&A Support**| No | Yes (questions can have an "Accepted Answer") |

---

## 9. Team Collaboration (Corporate Models & Best Practices)

In a professional software engineering company, teams generally choose between two primary operational models:

### Model A: The Shared Repository (Feature Branch) Model
- Standard for corporate software teams where all engineers belong to the same organization.
- Everyone clones the same company repo directly (no forks needed).
- Engineers create branches (e.g., \`feature/login\`, \`bugfix/cart-crash\`), push to the shared repo, and open PRs to \`develop\` or \`main\`.

### Model B: The Forking Model
- Standard for open-source projects (Linux, Kubernetes, React, .NET) or companies with strict zero-trust security boundaries where contractors only push to their own forks.

### 🚀 Trunk-Based Development vs. Git Flow:

| Comparison | Trunk-Based Development (Modern Industry Standard ⭐) | Git Flow (Legacy Model) |
| :--- | :--- | :--- |
| **Branch Lifespan** | Very short (hours to 1–2 days max) | Long-lived (\`develop\`, \`release\`, \`feature\`, \`hotfix\`) |
| **Merge Frequency** | Multiple times per day | Weekly or monthly |
| **Merge Conflicts** | Very rare and trivial to resolve | High risk of massive "Merge Hell" |
| **Release Mechanism** | Automated CI/CD pipelines with Feature Flags | Manual staged release freezes |
| **Best Suited For** | High-growth SaaS, Agile startups, microservices | Traditional waterfall, embedded hardware, packaged CDs |
`,
    contentBn: `# টিম কোলাবোরেশন: ফোর্ক, ক্লোন, ব্রাঞ্চ, পুশ, পিআর, রিভিউ, ইস্যু, ডিসকাশন ও টিম ওয়ার্কফ্লো

সফটওয়্যার ডেভেলপমেন্ট মূলত একটি সম্মিলিত দলগত কাজ (Team Sport)। আপনি দেশীয় কোনো প্রথম সারির সফটওয়্যার কোম্পানিতে মাইক্রোসার্ভিস সিস্টেম তৈরি করুন কিংবা আন্তর্জাতিক React, Linux বা .NET-এর মতো ওপেন-সোর্স প্রজেক্টে অবদান রাখুন না কেন — আপনাকে পূর্ণাঙ্গ **টিম কোলাবোরেশন ওয়ার্কফ্লো** পুঙ্খানুপুঙ্খভাবে জানতে হবে।

নিচে গিটহাব টিম কোলাবোরেশনের অত্যাবশ্যকীয় ৯টি উপাদানের বিস্তারিত ও সহজ ব্যাখ্যা তুলে ধরা হলো:

---

## ১. Fork (নিজের অ্যাকাউন্টে ব্যক্তিগত ক্লাউড কপি তৈরি)

### বাস্তব জীবনের উপমা:
> মনে করুন আপনি একটি পাবলিক লাইব্রেরিতে গিয়ে একটি মূল্যবান প্রাচীন বই দেখতে পেলেন। লাইব্রেরিয়ান কখনোই আপনাকে মূল বইটির পৃষ্ঠায় কলম দিয়ে দাগাতে বা লেখার অনুমতি দেবেন না। তাই আপনি মূল বইটির একটি হুবহু ফটোকপি করে নিজের বাসায় নিয়ে আসলেন। এবার আপনার নিজের ফটোকপিতে আপনি নির্দ্বিধায় হাইলাইট করতে পারেন বা নতুন পাতা যুক্ত করতে পারেন; এতে লাইব্রেরির মূল বইটি বিন্দুমাত্র নষ্ট হবে না।

### ফোর্ক কী?
**Fork** হলো অন্য কোনো ডেভেলপার বা অর্গানাইজেশনের গিটহাব রিপোজিটরির একটি হুবহু ক্লোন বা অনুলিপি, যা সরাসরি আপনার ব্যক্তিগত গিটহাব অ্যাকাউন্টে সংরক্ষিত হয়।

- **কখন ফোর্ক করবেন**: যখন কোনো ওপেন সোর্স প্রজেক্টে (যেমন Google Flutter বা Microsoft .NET) আপনি সরাসরি কোড লেখার অনুমতি (Write Access) পান না।
- **Branch বনাম Fork**:
  - **Branch** তৈরি হয় একই রিপোজিটরির *ভেতরে* (যখন টিমের সবার একই প্রজেক্টে পুশ করার অনুমতি থাকে)।
  - **Fork** তৈরি হয় সম্পূর্ণ *আলাদা একটি অ্যাকাউন্টে* স্বাধীন কপি হিসেবে।

---

## ২. Clone (ক্লাউড কোড নিজের ল্যাপটপে নামানো)

গিটহাবে ফোর্ক করার পর সেই কোডটি আপনার ল্যাপটপে এনে কোড এডিটরে রান করার জন্য ক্লোন করতে হয়:

\`\`\`bash
# ১. নিজের পার্সোনাল ফোর্কটি ল্যাপটপে ক্লোন করুন:
git clone https://github.com/your-username/project-name.git
cd project-name

# ২. মূল ওপেন সোর্স প্রজেক্টের সাথে সংযোগ স্থাপন করুন ('upstream'):
# 'origin'   -> আপনার নিজের ফোর্ক (যেখানে আপনার কোড পুশ করার অধিকার আছে)
# 'upstream' -> মূল নির্মাতার প্রজেক্ট (যেখান থেকে আপনি নিয়মিত আপডেট নামাবেন)
git remote add upstream https://github.com/original-author/project-name.git

# ৩. রিমোট লিঙ্ক যাচাই করুন:
git remote -v
\`\`\`

---

## ৩. Branch (ফিচার ব্রাঞ্চে কাজ করা)

> [!IMPORTANT]
> **ওপেন সোর্সের সুবর্ণ নিয়ম (Golden Rule)**: **নিজের ফোর্কের \`main\` ব্রাঞ্চে কখনো সরাসরি কোড লিখবেন না!**  
> আপনার \`main\` ব্রাঞ্চটিকে সর্বদা মূল নির্মাতার \`upstream/main\`-এর সাথে একদম সমান ও পরিচ্ছন্ন রাখবেন।

### নতুন ফিচার ব্রাঞ্চ তৈরির নিয়ম:
\`\`\`bash
# ১. মূল প্রজেক্টের নতুন আপডেট ডাউনলোড করুন:
git fetch upstream

# ২. মূল প্রজেক্টের লেটেস্ট কোডের ওপর ভিত্তি করে নতুন ব্রাঞ্চ তৈরি করুন:
git switch -c fix/order-cancellation-timeout upstream/main
\`\`\`

---

## ৪. Push (নিজের ফোর্কে কোড আপলোড করা)

কোড লেখা শেষ হলে এবং লোকাল টেস্ট পাস করার পর কমিট করে নিজের অ্যাকাউন্টে পুশ করুন:

\`\`\`bash
git add .
git commit -m "fix(orders): resolve timeout bug during order cancellation"

# নিজের ফোর্কে পুশ করুন ('origin'):
git push -u origin fix/order-cancellation-timeout
\`\`\`

> *মনে রাখবেন: আপনি পুশ করছেন আপনার নিজের \`origin\`-এ, মূল \`upstream\`-এ নয়। কারণ মূল রিপোজিটরিতে আপনার সরাসরি পুশ করার অধিকার নেই।*

---

## ৫. Pull Request (মূল প্রজেক্টে কোড মার্জের প্রস্তাব)

আপনার নতুন ফিচার ব্রাঞ্চটি গিটহাবে আপলোড হওয়ার পর:
1. মূল প্রজেক্টের গিটহাব পেজে যান।
2. উপরে ব্যানার দেখতে পাবেন: **"Compare & pull request across forks"**।
3. দিক নিশ্চিত করুন:
   - **Base Repo**: \`original-author/project\` (branch: \`main\`)
   - **Head Repo**: \`your-username/project\` (branch: \`fix/order-cancellation-timeout\`)
4. বিস্তারিত ডেসক্রিপশন লিখুন এবং **Create pull request** বাটনে চাপুন।

---

## ৬. Code Review (মেন্টরদের সাথে কোড পর্যালোচনা)

পিআর সাবমিট করার পর মূল প্রজেক্টের সিনিয়র ইঞ্জিনিয়াররা আপনার কোড লাইন-বাই-লাইন রিভিউ করবেন:
* কোনো সহকর্মী যদি কোনো পরিবর্তনের সাজেশন দেন, তবে মন খারাপ না করে পেশাদারিত্বের সাথে তা গ্রহণ করুন।
* পরিবর্তন করার নিয়ম:
  \`\`\`bash
  # একই ব্রাঞ্চে সংশোধন করুন:
  git add .
  git commit -m "refactor: optimize loop execution as suggested by reviewer"
  git push origin fix/order-cancellation-timeout
  \`\`\`
  *(পুশ করামাত্র গিটহাবে আপনার আগের পিআর-টি স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে, নতুন পিআর খুলতে হবে না!)*

---

## ৭. Issues (বাগ ট্র্যাকিং ও কাজের তালিকা)

গিটহাবের **Issues** ট্যাব হলো প্রজেক্টের ডিজিটাল টাস্কবোর্ড:
- **বাগ রিপোর্ট**: সফটওয়্যারে কোনো ত্রুটি ধরা পড়লে তা স্ক্রিনশট ও বিস্তারিত সহ নথিভুক্ত করা।
- **ফিচার রিকোয়েস্ট**: নতুন কোনো আইডিয়া প্রস্তাব করা।
- **লেবেল ও মাইলস্টোন**: \`bug\`, \`good first issue\`, \`enhancement\` ইত্যাদি লেবেল দিয়ে কাজ ভাগ করা।

### 💡 ম্যাজিক কিওয়ার্ড (অটোমেটিক ইস্যু ক্লোজ):
পিআরের ডেসক্রিপশনে নিচের কিওয়ার্ডগুলো লিখলে পিআর মার্জ হওয়ামাত্র ইস্যুটি স্বয়ংক্রিয়ভাবে ক্লোজ হয়ে যায়:
\`\`\`
Closes #42
Fixes #108
Resolves #256
\`\`\`

---

## ৮. Discussions (কমিউনিটি ব্রেনস্টর্মিং ও আলোচনা)

| বৈশিষ্ট্য | GitHub Issues | GitHub Discussions |
| :--- | :--- | :--- |
| **উদ্দেশ্য** | নির্দিষ্ট বাগ সমাধান বা সরাসরি কোডিং টাস্ক | আইডিয়া শেয়ারিং, উন্মুক্ত প্রশ্নোত্তর, ব্রেনস্টর্মিং |
| **লাইফসাইকেল** | কাজ শেষ হলে কোডের মাধ্যমে Close হয় | কমিউনিটিতে উন্মুক্ত আলোচনা চলমান থাকে |
| **ফলাফল** | Pull Request এবং Commit তৈরি হয় | ঐক্যমত্য বা সিদ্ধান্ত (RFC) তৈরি হয় |
| **Accepted Answer**| নেই | হ্যাঁ (সঠিক উত্তরে টিক চিহ্ন দেওয়া যায়) |

---

## ৯. Team Collaboration (টিম মডেল ও ট্রাঙ্ক-বেসড ডেভেলপমেন্ট)

কর্পোরেট সফটওয়্যার কোম্পানিগুলোতে সাধারণত দুটি মডেলের যেকোনো একটি ব্যবহৃত হয়:

### মডেল ১: Shared Repository Model (কোম্পানি টিম প্রজেক্ট)
- কোম্পানির সব ডেভেলপার একই অর্গানাইজেশনের সেন্ট্রাল রিপোজিটরিতে কাজ করেন (ফোর্ক করার প্রয়োজন হয় না)।
- সবাই লোকাল ব্রাঞ্চ খুলে কাজ করেন এবং পিআর ওপেন করেন।

### মডেল ২: Forking Model (ওপেন সোর্স ও জিরো-ট্রাস্ট)
- ডেভেলপাররা সরাসরি মূল রিপোতে কোড পুশ করতে পারেন না; প্রত্যেকে নিজ নিজ ফোর্কে পুশ করে পিআর পাঠান।

### 🚀 ট্রাঙ্ক-বেসড ডেভেলপমেন্ট বনাম গিট ফ্লো:
* **Trunk-Based Development (আধুনিক স্ট্যান্ডার্ড ⭐)**: খুব ছোট ছোট ফিচার ব্রাঞ্চ (১-২ দিনের কাজ) তৈরি করে প্রতিদিন বা দিনে কয়েকবার সরাসরি \`main\` ট্রাঙ্কে মার্জ করা হয়। এতে মার্জ কনফ্লিক্টের ঝুঁকি থাকে না।
* **Git Flow (ঐতিহ্যবাহী মডেল)**: \`develop\`, \`release\`, \`hotfix\` ইত্যাদি দীর্ঘস্থায়ী ব্রাঞ্চ থাকে যা মাস বা কোয়ার্টার শেষে রিলিজের সময় মার্জ কনফ্লিক্টের পাহাড় তৈরি করতে পারে।
`,
  };
