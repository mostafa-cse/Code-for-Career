import type { LocalLesson } from "@/lib/lessons-data";

export const MODULE_3_LESSONS: LocalLesson[] = [
  {
    slug: "git-remote-repositories",
    titleEn: "Remote Repositories: Remote, Origin, Fetch, Pull, Push & Upstream",
    titleBn: "রিমোট রিপোজিটরি: রিমোট, অরিজিন, ফেচ, পুল, পুশ ও আপস্ট্রিম",
    categoryEn: "7. Remote Repositories",
    categoryBn: "৭. রিমোট রিপোজিটরি ও সিঙ্ক",
    categoryDescEn: "Managing remote aliases, understanding origin, git fetch vs git pull, push operations, tracking branches, and upstream sync.",
    categoryDescBn: "রিমোট অ্যালিয়াস ম্যানেজমেন্ট, অরিজিন বোঝা, git fetch বনাম git pull, পুশ অপারেশন ও আপস্ট্রিম ট্র্যাকিং ব্রাঞ্চ।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master synchronization between your local machine and remote servers using git remote, fetch, pull, push, and tracking branches.",
    descriptionBn: "লোকাল কম্পিউটার ও ক্লাউড সার্ভারের মধ্যে কোড সিঙ্ক করার সমস্ত কমান্ড শিখুন: git remote, fetch, pull, push এবং আপস্ট্রিম ট্র্যাকিং।",
    difficulty: "EASY",
    displayOrder: 7,
    prerequisites: ["git-merging"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "Git Documentation",
        title: "Working with Remotes",
        url: "https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes",
        description: "Official guide to remote aliases, fetch, and push.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "What is the precise difference between 'git fetch' and 'git pull'?",
        url: null,
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["Git", "Fetch", "Pull", "Remote"],
        solutionEn: "'git fetch' downloads all new commits, branches, and tags from the remote repository to your local object database, but does NOT modify your working directory or current branch. 'git pull' executes 'git fetch' immediately followed by 'git merge' (or 'git rebase' if configured), altering your working files.",
        solutionBn: "'git fetch' রিমোট সার্ভার থেকে সমস্ত নতুন কমিট ও ব্রাঞ্চ ডাউনলোড করে লোকাল অবজেক্ট স্টোরে এনে রাখে, কিন্তু আপনার ফাইলের কোনো পরিবর্তন করে না। আর 'git pull' প্রথমে ফেচ করে এবং সাথে সাথেই আপনার বর্তমান ব্রাঞ্চের সাথে মার্জ বা রিব্যাস সম্পন্ন করে ফাইল পরিবর্তন করে।",
      },
      {
        source: "BD Tech Viva",
        name: "What is 'origin' and 'upstream' in Git terminology?",
        url: null,
        difficulty: "MEDIUM",
        company: "Brain Station 23",
        tags: ["Git", "Origin", "Upstream", "Forks"],
        solutionEn: "'origin' is the default name Git assigns to the remote repository from which you cloned your project. 'upstream' is the standard convention name given to the original parent repository when you work on a personal Fork, used to pull new updates made by the core maintainers.",
        solutionBn: "'origin' হলো ডিফল্ট নাম যা গিট আপনার ক্লোন করা রিমোট রিপোজিটরির লিঙ্ক হিসেবে সেট করে। আর 'upstream' হলো ফোর্ক (Fork) করা প্রজেক্টে মূল প্যারেন্ট রিপোজিটরিকে ট্র্যাক করার বহুল ব্যবহৃত স্ট্যান্ডার্ড নাম, যা থেকে মূল কোডের আপডেট টেনে আনা হয়।",
      },
    ],
    contentEn: `# Remote Repositories: Remote, Origin, Fetch, Pull, Push & Upstream

Git repositories rarely live in isolation. Remote repositories hosted on platforms like GitHub serve as the single source of truth for engineering teams.

---

## 1. What is a Remote and What is 'origin'?

A **remote** is a URL pointer to a repository hosted on the internet or local network. When you clone a repo:
\`\`\`bash
git clone git@github.com:company/ecommerce-api.git
\`\`\`
Git automatically creates a remote alias named **\`origin\`** pointing to that URL.

### Managing Remotes
\`\`\`bash
# List all configured remote names and URLs
git remote -v

# Add a new remote (e.g., the original upstream open-source repo)
git remote add upstream git@github.com:original-author/ecommerce-api.git

# Rename or remove a remote
git remote rename origin old-origin
git remote remove old-origin
\`\`\`

---

## 2. Downloading Updates: \`git fetch\` vs \`git pull\`

\`\`\`
git fetch:   Remote =====(download objects)=====> Local Database (origin/main)
                                                       |
git pull:    Remote =====(fetch)=====> origin/main =====(merge)=====> Working Tree (main)
\`\`\`

### Safe Inspection with \`git fetch\`
\`\`\`bash
# Download all changes from origin without touching your files
git fetch origin

# Inspect what commits came in before merging
git log HEAD..origin/main --oneline

# Merge when ready
git merge origin/main
\`\`\`

### One-Step Update with \`git pull\`
\`\`\`bash
# Standard pull (fetch + merge)
git pull origin main

# Rebase pull (fetch + rebase, avoids cluttering history with merge commits)
git pull --rebase origin main
\`\`\`

---

## 3. Uploading Code: \`git push\`

\`\`\`bash
# Push your current branch and establish upstream tracking (-u)
git push -u origin feature/order-management

# Subsequent pushes on this branch only require:
git push

# Safe force-push (checks that nobody else pushed in the meantime):
git push --force-with-lease
\`\`\`
`,
    contentBn: `# রিমোট রিপোজিটরি: রিমোট, অরিজিন, ফেচ, পুল, পুশ ও আপস্ট্রিম

রিমোট রিপোজিটরি হলো ইন্টারনেটে হোস্ট করা কোড যার মাধ্যমে একাধিক ইঞ্জিনিয়ার নিজেদের কোড সিঙ্ক্রোনাইজ করেন।

---

## ১. রিমোট এবং 'origin' কী?

যেকোনো গিটহাব রিপোজিটরি ক্লোন করলে গিট স্বয়ংক্রিয়ভাবে সেই ইউআরএল-এর একটি সংক্ষিপ্ত নাম দেয়: **\`origin\`**।

\`\`\`bash
# বর্তমান রিমোটের তালিকা ও ইউআরএল দেখতে:
git remote -v

# মূল ওপেন সোর্স রিপোজিটরির জন্য 'upstream' যুক্ত করতে:
git remote add upstream git@github.com:original/repo.git
\`\`\`

---

## ২. \`git fetch\` বনাম \`git pull\`

* **\`git fetch\`**: রিমোট থেকে নতুন কোড ডাউনলোড করে লোকাল ডাটাবেজে জমা রাখে, কিন্তু আপনার ফাইলের কোনো পরিবর্তন করে না। ফলে নিরাপদভাবে পরিবর্তন যাচাই করা যায়।
* **\`git pull\`**: প্রথমে ফেচ করে এবং সরাসরি আপনার বর্তমান ব্রাঞ্চের সাথে মার্জ করে কোড আপডেট করে ফেলে।

---

## ৩. কোড আপলোড: \`git push\`

\`\`\`bash
# প্রথমবার নতুন ব্রাঞ্চ পুশ করে ট্র্যাকিং সেট করতে (-u):
git push -u origin feature/cart-api

# পরবর্তী সময়ে কেবল চালালেই চলে:
git push
\`\`\`
`,
  },
  {
    slug: "github-basics",
    titleEn: "GitHub Basics: Repositories, README, .gitignore, License & Profile",
    titleBn: "গিটহাব বেসিকস: রিপোজিটরি, README, .gitignore, লাইসেন্স ও প্রোফাইল",
    categoryEn: "8. GitHub Ecosystem Basics",
    categoryBn: "৮. গিটহাব ইকোসিস্টেম ও প্রজেক্ট প্রেজেন্টেশন",
    categoryDescEn: "Creating public/private repos, README architecture, .gitignore templates, open-source licenses, and building a stellar GitHub profile.",
    categoryDescBn: "পাবলিক/প্রাইভেট রিপোজিটরি, প্রফেশনাল README গঠন, .gitignore ফাইল, লাইসেন্স নির্বাচন এবং আকর্ষণীয় গিটহাব প্রোফাইল তৈরি।",
    categoryPriority: "CORE",
    descriptionEn: "Learn how to present software engineering projects professionally on GitHub using READMEs, proper gitignore rules, and licenses.",
    descriptionBn: "গিটহাবে প্রজেক্ট প্রফেশনালভাবে প্রদর্শন করতে README, gitignore ও লাইসেন্সের সঠিক ব্যবহার এবং আকর্ষণীয় প্রোফাইল তৈরি শিখুন।",
    difficulty: "EASY",
    displayOrder: 8,
    prerequisites: ["git-remote-repositories"],
    estimatedMinutes: 20,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "About READMEs",
        url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
        description: "Official guide on writing compelling markdown project documentation.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "What essential sections must a production-grade README.md have in a technical job interview portfolio?",
        url: null,
        difficulty: "EASY",
        company: "Therap (BD) Ltd",
        tags: ["GitHub", "README", "Portfolio", "Best Practices"],
        solutionEn: "1. Project Title & elevator pitch. 2. System Architecture / Tech Stack badges. 3. Prerequisites & Environment Setup (.NET, Docker, Postgres). 4. Step-by-step installation commands. 5. API Endpoints / Documentation table. 6. Database ERD / Architecture diagrams. 7. Test execution instructions. 8. License.",
        solutionBn: "১. প্রজেক্টের নাম ও ১ লাইনের ভূমিকা। ২. টেক স্ট্যাক ও আর্কিটেকচার ডায়াগ্রাম। ৩. এনভায়রনমেন্ট প্রয়োজনীয়তা (.NET SDK, PostgreSQL ইত্যাদি)। ৪. ধাপে ধাপে প্রজেক্ট রান করার কমান্ড। ৫. API এন্ডপয়েন্ট ও ডকার সেটআপ গাইড। ৬. ইউনিট টেস্ট চালানোর নির্দেশিকা। ৭. ওপেন সোর্স লাইসেন্স।",
      },
    ],
    contentEn: `# GitHub Basics: Repositories, README, .gitignore, License & Profile

Your GitHub account is your living engineering resume. Companies in Bangladesh and abroad evaluate candidates by their GitHub repositories.

---

## 1. Creating a Repository & Visibility
* **Public Repository**: Visible to anyone worldwide. Ideal for portfolio projects, open-source libraries, and technical interview demonstrations.
* **Private Repository**: Visible only to you and explicitly invited collaborators. Used for proprietary commercial code or confidential freelance work.

---

## 2. Anatomy of a Production-Ready \`README.md\`

Never leave a GitHub repository with an empty README. Follow this standard structure:

\`\`\`markdown
# Distributed E-Commerce Microservices

A high-throughput e-commerce platform built with ASP.NET Core 9, PostgreSQL, and RabbitMQ.

## Architecture Highlights
* Clean Architecture with CQRS pattern (MediatR)
* Outbox pattern for reliable event publishing
* Redis caching for catalog read performance

## Getting Started
\`\`\`bash
git clone git@github.com:username/ecommerce.git
cd ecommerce
docker-compose up -d
dotnet run --project src/Api
\`\`\`

## API Reference
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| \`/api/v1/orders\` | POST | Places a new order |
| \`/api/v1/orders/{id}\` | GET | Fetches order details |
\`\`\`

---

## 3. The Role of \`.gitignore\` and Open-Source \`LICENSE\`

### \`.gitignore\`
Prevents committing build binaries (\`bin/\`, \`obj/\`), dependencies (\`node_modules/\`), and local credentials (\`.env.local\`). Always generate a language-specific template when creating your repo.

### Open-Source Licenses
* **MIT License**: Extremely permissive. Anyone can use, modify, and distribute your code commercially without liability.
* **Apache 2.0**: Permissive like MIT, but provides explicit grant of patent rights and trademark protections.
* **GNU GPLv3**: Copyleft. Any derivative work must also be made fully open-source under GPLv3.

---

## 4. Special GitHub Profile README
Create a public repository named **exactly the same as your GitHub username** (e.g. \`github.com/mostafakamal/mostafakamal\`). Whatever you write in its \`README.md\` will be displayed at the very top of your global GitHub public profile!
`,
    contentBn: `# গিটহাব বেসিকস: রিপোজিটরি, README, .gitignore, লাইসেন্স ও প্রোফাইল

গিটহাব হলো সফটওয়্যার ইঞ্জিনিয়ারের ডিজিটাল জীবনবৃত্তান্ত (Resume)। যেকোনো ইন্টারভিউ বোর্ডে আপনার কোডিং মান যাচাই করতে রিক্রুটাররা আপনার গিটহাব ভিজিট করেন।

---

## ১. প্রফেশনাল \`README.md\` এর গুরুত্ব
একটি ফাঁকা বা দুর্বল README যুক্ত রিপোজিটরি ভালো কোড সত্ত্বেও নেতিবাচক প্রভাব ফেলে। একটি সুন্দর README ফাইলে প্রজেক্টের আর্কিটেকচার ডায়াগ্রাম, ফিচার তালিকা, লোকাল মেশিনে রান করার কমান্ড এবং টেস্ট চালানোর নির্দেশিকা থাকা বাঞ্ছনীয়।

---

## ২. \`.gitignore\` ও \`LICENSE\`
* **\`.gitignore\`**: ভুলবশত যাতে \`bin/\`, \`obj/\`, \`node_modules/\` বা গোপন \`.env\` ফাইল গিটহাবে পুশ না হয় তা নিশ্চিত করে।
* **MIT License**: সবচেয়ে জনপ্রিয় ওপেন সোর্স লাইসেন্স যা যেকাউকে আপনার প্রজেক্টের কোড ব্যবহার ও সংশোধন করার অনুমতি দেয়।

---

## ৩. গিটহাব স্পেশাল প্রোফাইল README
আপনার গিটহাব ইউজারনেমের হুবহু একই নামে (যেমন \`username/username\`) একটি পাবলিক রিপোজিটরি খুললে, তার \`README.md\` ফাইলটি আপনার মূল গিটহাব প্রোফাইলের ব্যানারে সুন্দরভাবে প্রদর্শিত হয়।
`,
  },
  {
    slug: "git-pull-requests",
    titleEn: "Pull Requests: Creation, Review Comments, Approvals & Merge Types",
    titleBn: "পুল রিকোয়েস্ট: পিআর তৈরি, কোড রিভিউ, অ্যাপ্রুভাল ও মার্জ স্ট্র্যাটেজি",
    categoryEn: "9. Pull Requests & Code Review",
    categoryBn: "৯. পুল রিকোয়েস্ট ও কোড রিভিউ কালচার",
    categoryDescEn: "Anatomy of a PR, writing PR descriptions, inline review comments, review states, and merge strategies (Merge Commit vs Squash vs Rebase).",
    categoryDescBn: "পিআর এর গঠন, ডেসক্রিপশন লেখার নিয়ম, ইনলাইন কোড রিভিউ, অ্যাপ্রুভাল পদ্ধতি এবং স্কোয়াশ বনাম মার্জ স্ট্র্যাটেজি।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master the pull request workflow that defines professional team engineering: code reviews, actionable feedback, and merge strategies.",
    descriptionBn: "প্রফেশনাল টিম ইঞ্জিনিয়ারিংয়ের সবচেয়ে গুরুত্বপূর্ণ পুল রিকোয়েস্ট ওয়ার্কফ্লো, গঠনমূলক কোড রিভিউ এবং মার্জ স্ট্র্যাটেজি শিখুন।",
    difficulty: "MEDIUM",
    displayOrder: 9,
    prerequisites: ["github-basics"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "About Pull Requests",
        url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests",
        description: "Official GitHub guide on pull requests and review workflows.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "Compare GitHub's 3 Merge options: 'Create a merge commit', 'Squash and merge', and 'Rebase and merge'",
        url: null,
        difficulty: "MEDIUM",
        company: "Samsung R&D (SRBD)",
        tags: ["GitHub", "Pull Request", "Squash and Merge", "Merge Commit"],
        solutionEn: "1. 'Create a merge commit': Preserves every single intermediate commit on the feature branch and creates a 3-way merge commit on main. 2. 'Squash and merge': Condenses all commits from the feature branch into a single clean commit on main, discarding branch noise. 3. 'Rebase and merge': Replays all commits individually onto main with new commit hashes, creating a linear history without a merge commit.",
        solutionBn: "১. 'Create a merge commit': ফিচার ব্রাঞ্চের সব ছোটখাটো কমিট অক্ষত রেখে একটি মার্জ কমিট তৈরি করে। ২. 'Squash and merge': ফিচার ব্রাঞ্চের বিশৃঙ্খল ২০টি কমিটকে একটি সুন্দর সিঙ্গেল কমিট হিসেবে মূল ট্রাঙ্কে যুক্ত করে (ইন্ডাস্ট্রিতে বহুল ব্যবহৃত)। ৩. 'Rebase and merge': কোনো মার্জ কমিট ছাড়াই সব কমিটকে লিনিয়ারলি মেইনে যুক্ত করে।",
      },
    ],
    contentEn: `# Pull Requests: Creation, Review Comments, Approvals & Merge Types

In professional software development, **no engineer pushes directly to the \`main\` branch**. Every feature, bug fix, or dependency update goes through a **Pull Request (PR)**.

---

## 1. What is a Pull Request?

A Pull Request is a formal proposal to merge code from a feature branch into a base branch (e.g., merging \`feature/auth\` into \`main\`). It allows teammates to inspect the exact diffs, test builds, and suggest improvements before code reaches production.

---

## 2. Writing a Great PR Description

Always follow a clean template in your PRs:

\`\`\`markdown
### Summary of Changes
Implemented JWT token-based authentication and refresh token rotation.

### Motivation / Ticket
Fixes #42. Resolves security finding where sessions did not expire properly.

### How to Test
1. Run \`dotnet test tests/AuthTests\`
2. Send POST to \`/api/v1/auth/login\` with test credentials
3. Verify JWT returned contains valid 15-minute claims

### Checklist
- [x] Unit tests added & passing
- [x] No secrets or API keys committed
- [x] Documentation updated
\`\`\`

---

## 3. The Code Review Process

As a reviewer on GitHub:
* **Inline Comments**: Click on any line number in the "Files changed" tab to leave suggestions or request clarification.
* **Suggestion Blocks**: Use GitHub's markdown suggestion feature (\`\`\`suggestion\`) so the PR author can apply your change with one click.
* **Review Decisions**:
  * **Comment**: Submit general feedback without explicit approval.
  * **Approve**: The code looks great and is ready to merge.
  * **Request Changes**: Critical bugs or architectural flaws must be addressed before merging.

---

## 4. The 3 GitHub Merge Strategies

| Merge Strategy | Resulting Commit on \`main\` | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Create a Merge Commit** | Preserves all branch commits + 1 Merge Commit | Full granular history preserved | Can make git log cluttered |
| **Squash and Merge** | Exactly **1 clean commit** on \`main\` | Ultra-clean, atomic linear trunk history | Loses individual micro-commit steps |
| **Rebase and Merge** | Commits replayed linearly without merge commit | Clean linear graph | Cannot distinguish where branch started |
`,
    contentBn: `# পুল রিকোয়েস্ট: পিআর তৈরি, কোড রিভিউ, অ্যাপ্রুভাল ও মার্জ স্ট্র্যাটেজি

প্রফেশনাল কোম্পানিতে কোনো ডেভেলপার সরাসরি \`main\` ব্রাঞ্চে কোড পুশ করতে পারেন না। প্রতিটি কাজ **পুল রিকোয়েস্ট (PR)** এর মাধ্যমে কোড রিভিউ পার হয়ে প্রোডাকশনে যায়।

---

## ১. পুল রিকোয়েস্ট কী?
একটি ফিচার ব্রাঞ্চের কোডকে টেস্ট ও রিভিউ শেষে মূল ব্রাঞ্চে সংযুক্ত করার আনুষ্ঠানিক আবেদনই হলো পুল রিকোয়েস্ট।

---

## ২. কোড রিভিউ ও ফিডব্যাক
* সহকর্মীর কোডের নির্দিষ্ট লাইনে ক্লিক করে ইনলাইন মন্তব্য করা যায়।
* **Approve**: কোড সঠিক আছে এবং মার্জের জন্য প্রস্তুত।
* **Request Changes**: কোনো বাগ বা দুর্বলতা থাকলে তা সংশোধন না করা পর্যন্ত মার্জ আটকানো।

---

## ৩. গিটহাবে মার্জ করার ৩টি উপায়
১. **Create a Merge Commit**: সমস্ত কমিট অক্ষত রেখে একটি মার্জ কমিট তৈরি করে।
২. **Squash and Merge**: সবচেয়ে জনপ্রিয়। ফিচার ব্রাঞ্চের এলোমেলো ১০-১২টি কমিটকে একটি মাত্র পরিচ্ছন্ন কমিটে রূপান্তর করে মেইনে যুক্ত করে।
৩. **Rebase and Merge**: লিনিয়ার হিস্ট্রি বজায় রেখে কোনো মার্জ কমিট ছাড়াই কোড যুক্ত করে।
`,
  },
  {
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
    contentEn: `# Collaboration: Fork, Clone, Branch, PR, Issues & Team Workflows

Whether you are contributing to a massive global open-source project or building microservices with 10 teammates at a Dhaka tech firm, you will rely on the **Forking & Feature Branch Workflow**.

---

## 1. The Forking Workflow (Open Source & Enterprise)

\`\`\`
[Upstream Public Repo] <====== (Pull Request) <====== [Your Personal Fork on GitHub]
        |                                                        ^
   (git fetch)                                               (git push)
        |                                                        |
        +=========> [Your Local Machine Clone] ==================+
                     - branch: feature/export-csv
\`\`\`

### Step-by-Step Open Source Flow:
\`\`\`bash
# 1. Clone your personal fork
git clone git@github.com:my-username/aspnetcore.git
cd aspnetcore

# 2. Configure the original repository as 'upstream'
git remote add upstream git@github.com:dotnet/aspnetcore.git
git remote -v

# 3. Create a clean feature branch off updated upstream main
git fetch upstream
git switch -c fix/http-client-timeout upstream/main

# 4. Write code, test, and commit
git commit -m "fix(http): resolve socket exhaustion on aggressive retry"

# 5. Push to YOUR personal fork
git push -u origin fix/http-client-timeout

# 6. Go to GitHub and click "Compare & pull request" to upstream!
\`\`\`

---

## 2. GitHub Issues & Discussions

* **Issues**: Track specific bugs, actionable tasks, or feature requests. Can be assigned to developers, categorized with labels (\`bug\`, \`enhancement\`), and attached to Milestones.
* **Discussions**: An open forum for brainstorming, Q&A, and RFCs (Request for Comments) that do not represent actionable tasks yet.

### Automatic Issue Closing via Commits
When your PR is merged, you can automatically close associated issues by including keywords in the commit message or PR description:
\`\`\`
Closes #105
Fixes #42
Resolves #89
\`\`\`

---

## 3. Trunk-Based Development vs Git Flow

| Workflow | Branch Lifespan | Release Frequency | Best Suited For |
| :--- | :--- | :--- | :--- |
| **Git Flow** | Long-lived (\`develop\`, \`release\`, \`hotfix\`) | Monthly / Quarterly | Traditional enterprise waterfall |
| **Trunk-Based Development** | Very short-lived (< 1–2 days) | Multiple times per day (CI/CD) | Modern Agile, SaaS, high-performing teams |
`,
    contentBn: `# টিম কোলাবোরেশন: ফোর্ক, ক্লোন, ব্রাঞ্চ, পিআর, ইস্যু ও টিম ওয়ার্কফ্লো

আন্তর্জাতিক ওপেন-সোর্স প্রজেক্ট বা দেশীয় সফটওয়্যার কোম্পানিতে কাজ করতে ফোর্কিং ও টিম কোলাবোরেশন মডেল অপরিহার্য।

---

## ১. ওপেন সোর্স ফোর্কিং ওয়ার্কফ্লো
১. মূল প্রজেক্টে ঢুকে গিটহাবের **Fork** বাটনে চাপ দিয়ে নিজের অ্যাকাউন্টে কপি তৈরি করুন।
২. নিজের ফোর্কটি কম্পিউটারে ক্লোন করুন।
৩. \`git remote add upstream <মূল-ইউআরএল>\` কমান্ড দিয়ে মূল প্রজেক্টকে ট্র্যাক করুন।
৪. নতুন ফিচার ব্রাঞ্চ খুলে কাজ করুন এবং নিজের ফোর্কে পুশ করুন।
৫. মূল প্রজেক্টে Pull Request ওপেন করুন।

---

## ২. গিটহাব ইস্যু ও অটো-ক্লোজ
যেকোনো বাগ বা ফিচারের ট্র্যাকিং হয় গিটহাব ইস্যুর মাধ্যমে। পিআর এর ডেসক্রিপশনে \`Fixes #42\` বা \`Closes #105\` লিখলে পিআর মার্জ হওয়ার সাথে সাথে অটোমেটিক্যালি ইস্যুটি ক্লোজ হয়ে যায়।

---

## ৩. ট্রাঙ্ক-বেসড ডেভেলপমেন্ট
আধুনিক হাই-পারফর্মিং টিমগুলোতে দীর্ঘস্থায়ী ব্রাঞ্চ না রেখে ছোট ছোট ফিচার ব্রাঞ্চ (১-২ দিনের কাজ) সরাসরি \`main\` ব্রাঞ্চে প্রতিদিন মার্জ করা হয়, যাতে বড় ধরনের মার্জ কনফ্লিক্ট তৈরি না হয়।
`,
  },
];
