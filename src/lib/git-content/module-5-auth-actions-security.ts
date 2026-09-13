import type { LocalLesson } from "@/lib/lessons-data";

export const MODULE_5_LESSONS: LocalLesson[] = [
  {
    slug: "github-authentication",
    titleEn: "GitHub Authentication: SSH Keys, Personal Access Tokens & GitHub CLI",
    titleBn: "গিটহাব অথেনটিকেশন: SSH কি, পার্সোনাল অ্যাক্সেস টোকেন ও গিটহাব সিএলআই",
    categoryEn: "15. Authentication & Credentials",
    categoryBn: "১৫. অথেনটিকেশন ও নিরাপত্তা ক্রেডেনশিয়াল",
    categoryDescEn: "HTTPS vs SSH protocols, generating Ed25519 keys, Personal Access Tokens (PATs), GitHub CLI (gh) auth, and Credential Manager.",
    categoryDescBn: "HTTPS বনাম SSH প্রোটোকল, Ed25519 কি তৈরি, পার্সোনাল অ্যাক্সেস টোকেন (PAT), গিটহাব সিএলআই (gh) এবং ক্রেডেনশিয়াল ম্যানেজার।",
    categoryPriority: "CORE",
    descriptionEn: "Master secure communication with GitHub using modern Ed25519 SSH keys, Fine-grained PATs, and the GitHub CLI.",
    descriptionBn: "আধুনিক Ed25519 SSH কি, পার্সোনাল অ্যাক্সেস টোকেন এবং গিটহাব সিএলআই ব্যবহার করে নিরাপদ কানেকশন স্থাপন শিখুন।",
    difficulty: "EASY",
    displayOrder: 15,
    prerequisites: ["github-basics"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "Connecting to GitHub with SSH",
        url: "https://docs.github.com/en/authentication/connecting-to-github-with-ssh",
        description: "Official guide on generating and testing SSH keys.",
        isStarred: true,
      },
      {
        source: "GitHub CLI",
        title: "GitHub CLI Manual",
        url: "https://cli.github.com/manual/",
        description: "Guide to the official command-line tool for GitHub.",
        isStarred: false,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "Why does GitHub no longer allow account passwords for Git push, and why is SSH preferred over HTTPS?",
        url: null,
        difficulty: "EASY",
        company: "BJIT Group",
        tags: ["GitHub", "Authentication", "SSH", "Security"],
        solutionEn: "Account passwords are vulnerable to phishing, brute-force, and credential stuffing. In 2021, GitHub deprecated basic password auth for Git operations in favor of token-based authentication (PATs) and SSH. SSH uses asymmetric public-key cryptography: your private key never leaves your computer, eliminating password prompts and providing superior security.",
        solutionBn: "অ্যাকাউন্ট পাসওয়ার্ড ফিশিং ও ব্রুট-ফোর্স আক্রমণের ঝুঁকিতে থাকে বিধায় ২০২১ সাল থেকে গিটহাব পাসওয়ার্ড ভিত্তিক পুশ বন্ধ করে দিয়েছে। এর বদলে ক্রিপ্টোগ্রাফিক SSH কি বা টোকেন বাধ্যতামূলক করা হয়েছে। SSH এ প্রাইভেট কি আপনার কম্পিউটারেই সুরক্ষিত থাকে এবং সার্ভারে কেবল পাবলিক কি থাকে, যা শতভাগ নিরাপদ ও পাসওয়ার্ডবিহীন কাজ করার সুবিধা দেয়।",
      },
    ],
    contentEn: `# GitHub Authentication: SSH Keys, Personal Access Tokens & GitHub CLI

Since 2021, GitHub **does not accept your account password** when performing \`git push\` or \`git clone\` over HTTPS. You must authenticate using either **SSH Keys** or **Personal Access Tokens (PAT)**.

---

## 1. Setting Up Modern SSH Authentication (Recommended)

SSH uses asymmetric public-private key cryptography. The industry standard algorithm is **Ed25519**.

### Step 1: Generate an Ed25519 Key Pair
\`\`\`bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location (~/.ssh/id_ed25519)
# Enter a secure passphrase (or press Enter for none)
\`\`\`

### Step 2: Add Key to SSH Agent
\`\`\`bash
# Start ssh-agent
eval "$(ssh-agent -s)"

# Add private key
ssh-add ~/.ssh/id_ed25519
\`\`\`

### Step 3: Copy Public Key and Add to GitHub
\`\`\`bash
# macOS:
pbcopy < ~/.ssh/id_ed25519.pub

# Linux:
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# Windows (Git Bash):
clip < ~/.ssh/id_ed25519.pub
\`\`\`
1. Go to **GitHub -> Settings -> SSH and GPG keys -> New SSH Key**.
2. Paste the key and click **Add SSH key**.

### Step 4: Test Connection
\`\`\`bash
ssh -T git@github.com
# Expected output: Hi username! You've successfully authenticated...
\`\`\`

---

## 2. Personal Access Tokens (PAT) for HTTPS
If your corporate network blocks SSH port 22:
1. Go to **GitHub -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens**.
2. Generate token with minimal permissions (e.g. \`repo\` read/write only).
3. When Git prompts for your password in terminal, **paste the PAT token instead of your password**.

---

## 3. GitHub CLI (\`gh\`)
The official GitHub CLI allows managing PRs, issues, and repos directly from terminal:
\`\`\`bash
# Authenticate in one interactive step:
gh auth login

# Check status:
gh auth status
\`\`\`
`,
    contentBn: `# গিটহাব অথেনটিকেশন: SSH কি, পার্সোনাল অ্যাক্সেস টোকেন ও গিটহাব সিএলআই

২০২১ সাল থেকে গিটহাবে পুশ করার জন্য অ্যাকাউন্টের সাধারণ পাসওয়ার্ড সম্পূর্ণ বন্ধ। প্রফেশনাল কাজের জন্য **SSH Key** সেটআপ করা সবচেয়ে নিরাপদ ও সুবিধাজনক।

---

## ১. আধুনিক SSH কি সেটআপ (Ed25519)

### ধাপ ১: কি-পেয়ার তৈরি করুন
\`\`\`bash
ssh-keygen -t ed25519 -C "your_email@example.com"
\`\`\`

### ধাপ ২: পাবলিক কি কপি করে গিটহাবে যোগ করুন
\`\`\`bash
# পাবলিক কি কপি করতে:
cat ~/.ssh/id_ed25519.pub
\`\`\`
গিটহাবের **Settings -> SSH and GPG keys** এ গিয়ে **New SSH key** তে পেস্ট করে সেভ করুন।

### ধাপ ৩: কানেকশন টেস্ট করুন
\`\`\`bash
ssh -T git@github.com
\`\`\`
সফল হলে দেখাবে: \`Hi username! You've successfully authenticated...\`। এরপর থেকে পাসওয়ার্ড ছাড়াই নিরাপদে কাজ করা যাবে!
`,
  },
  {
    slug: "github-issues-and-projects",
    titleEn: "GitHub Issues & Project Management: Labels, Milestones & Projects",
    titleBn: "গিটহাব ইস্যু ও প্রজেক্ট ম্যানেজমেন্ট: লেবেল, মাইলস্টোন ও প্রজেক্ট বোর্ড",
    categoryEn: "16. Project Management & Issue Tracking",
    categoryBn: "১৬. প্রজেক্ট ম্যানেজমেন্ট ও ইস্যু ট্র্যাকিং",
    categoryDescEn: "Managing bugs and tasks with GitHub Issues, custom labels, sprint milestones, templates, and Kanban GitHub Projects.",
    categoryDescBn: "গিটহাব ইস্যু দিয়ে টাস্ক ও বাগ ট্র্যাকিং, লেবেল, স্প্রিন্ট মাইলস্টোন, ইস্যু টেমপ্লেট এবং কানবান প্রজেক্ট বোর্ড।",
    categoryPriority: "CORE",
    descriptionEn: "Learn how modern software teams organize agile sprints, bug backlogs, and feature roadmaps directly inside GitHub.",
    descriptionBn: "আধুনিক সফটওয়্যার দলগুলো কীভাবে গিটহাবে অ্যাজাইল স্প্রিন্ট, বাগ ব্যাকলগ এবং রোডম্যাপ পরিচালনা করে তা শিখুন।",
    difficulty: "EASY",
    displayOrder: 16,
    prerequisites: ["github-basics"],
    estimatedMinutes: 20,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "About GitHub Projects",
        url: "https://docs.github.com/en/issues/planning-and-tracking-with-projects",
        description: "Official guide to modern tables, boards, and roadmaps in GitHub Projects.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "How do you link a GitHub Pull Request to automatically close an issue upon merge?",
        url: null,
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["GitHub", "Issues", "PR Linking", "Automation"],
        solutionEn: "In the PR description (or commit message), include supported closing keywords followed by the issue number, such as 'Fixes #42', 'Closes #15', or 'Resolves #89'. When the PR is merged into the default branch (main), GitHub automatically closes the issue and cross-references the PR in the issue timeline.",
        solutionBn: "পিআরের ডেসক্রিপশনে বা কমিট মেসেজে 'Fixes #42', 'Closes #15' বা 'Resolves #89' লিখে দিলে পিআরটি মেইন ব্রাঞ্চে মার্জ হওয়ার সাথে সাথেই সংশ্লিষ্ট ইস্যুটি স্বয়ংক্রিয়ভাবে ক্লোজ হয়ে যায় এবং রেফারেন্স হিস্ট্রিতে রেকর্ড থাকে।",
      },
    ],
    contentEn: `# GitHub Issues & Project Management: Labels, Milestones & Projects

Modern software engineering requires rigorous task management. GitHub integrates issue tracking, agile boards, and roadmaps directly adjacent to your codebase.

---

## 1. Anatomy of an Issue

An **Issue** represents an actionable unit of work:
* **Bug Report**: Describes a defect, reproduction steps, expected vs actual behavior.
* **Feature Request**: Proposes new functionality and business justification.
* **Technical Debt / Refactor**: Documents cleanup or performance optimizations.

### Issue Components
* **Assignees**: The specific developers responsible for delivering the fix.
* **Labels**: Color-coded tags (e.g., \`bug\`, \`enhancement\`, \`good first issue\`, \`p1-high\`).
* **Milestone**: Target release date or sprint container (e.g., \`Sprint 24\`, \`v1.2.0 Release\`).

---

## 2. Issue Templates (\`.github/ISSUE_TEMPLATE/\`)

Prevent incomplete or vague bug reports by creating markdown issue templates in your repo:

\`\`\`markdown
<!-- .github/ISSUE_TEMPLATE/bug_report.md -->
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

### Describe the Bug
A clear and concise description of what the bug is.

### Steps to Reproduce
1. Go to '/api/v1/orders'
2. Click on 'Submit Order'
3. See error 500

### Expected Behavior
Order should be persisted with status 'PENDING'.
\`\`\`

---

## 3. GitHub Projects (Kanban Boards & Roadmaps)

GitHub Projects allows managing team backlogs using:
* **Board View**: Traditional Kanban columns (Todo, In Progress, In Review, Done).
* **Table View**: Spreadsheet-like customizable columns (Status, Priority, Story Points, Estimate).
* **Roadmap View**: Gantt-chart timeline mapping milestones across sprints.
`,
    contentBn: `# গিটহাব ইস্যু ও প্রজেক্ট ম্যানেজমেন্ট: লেবেল, মাইলস্টোন ও প্রজেক্ট বোর্ড

প্রজেক্টের কাজের পরিধি, বাগ ও ফিচার ট্র্যাকিংয়ের জন্য গিটহাবে চমৎকার প্রজেক্ট ম্যানেজমেন্ট টুলস রয়েছে।

---

## ১. গিটহাব ইস্যু (Issues)
যেকোনো বাগ বা নতুন টাস্কের জন্য ইস্যু খোলা হয়। একটি ইস্যুর সাথে নির্দিষ্ট ডেভেলপারকে এসাইন করা, রঙিন লেবেল (\`bug\`, \`high-priority\`) এবং স্প্রিন্ট ডেডলাইনের জন্য মাইলস্টোন যুক্ত করা যায়।

---

## ২. গিটহাব প্রজেক্ট বোর্ড (Kanban)
ট্রেলে বা জিরার মতো গিটহাবের নিজস্ব কানবান বোর্ডে টাস্কগুলোকে চারটি কলামে সহজে সাজানো যায়:
* **Todo**: যে কাজগুলো করতে হবে
* **In Progress**: বর্তমানে যে কাজগুলো চলমান
* **In Review**: যে পিআরগুলো রিভিউ হচ্ছে
* **Done**: সম্পন্ন কাজ
`,
  },
  {
    slug: "github-actions",
    titleEn: "GitHub Actions: CI/CD Pipelines, Workflows, Jobs, Steps & Secrets",
    titleBn: "গিটহাব অ্যাকশনস: CI/CD পাইপলাইন, ওয়ার্কফ্লো, জবস, স্টেপস ও সিক্রেটস",
    categoryEn: "17. CI/CD & Automation",
    categoryBn: "১৭. CI/CD পাইপলাইন ও অটোমেশন",
    categoryDescEn: "What is CI/CD, GitHub Actions architecture, workflow triggers, matrix builds, steps, marketplace actions, and encrypted secrets.",
    categoryDescBn: "CI/CD এর মূল ধারণা, গিটহাব অ্যাকশনস আর্কিটেকচার, অটোমেটিক টেস্ট রানার, বিল্ড স্টেপস এবং এনক্রিপ্টেড সিক্রেটস ম্যানেজমেন্ট।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master Continuous Integration and Continuous Deployment (CI/CD) by writing automated test, build, and deploy workflows in GitHub Actions.",
    descriptionBn: "গিটহাব অ্যাকশনস ব্যবহার করে প্রতিটি পুশ ও পিআরে অটোমেটিক বিল্ড, ইউনিট টেস্ট এবং ডিপ্লয়মেন্ট পাইপলাইন তৈরি শিখুন।",
    difficulty: "HARD",
    displayOrder: 17,
    prerequisites: ["github-basics"],
    estimatedMinutes: 30,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "Understanding GitHub Actions",
        url: "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions",
        description: "Official guide to workflow YAML files, runners, and syntax.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "Write a complete GitHub Actions workflow YAML that checks out code, sets up .NET, restores dependencies, builds, and runs tests on every PR to main",
        url: null,
        difficulty: "MEDIUM",
        company: "Brain Station 23 / Optimizely",
        tags: ["GitHub Actions", "CI/CD", ".NET", "Automation"],
        solutionEn: "Create a YAML file in '.github/workflows/ci.yml' with 'on: pull_request: branches: [main]', using 'actions/checkout@v4', 'actions/setup-dotnet@v4' with dotnet-version 9.0, followed by 'run: dotnet restore', 'run: dotnet build --no-restore', and 'run: dotnet test --no-build --verbosity normal'.",
        solutionBn: "'.github/workflows/ci.yml' ফাইলে 'on: pull_request: branches: [main]' ট্রিগার দিয়ে 'ubuntu-latest' রানারে 'actions/checkout@v4' ও 'actions/setup-dotnet@v4' অ্যাকশন ব্যবহার করে 'dotnet build' ও 'dotnet test' কমান্ড অটোমেটিক রান করতে হয়।",
      },
    ],
    contentEn: `# GitHub Actions: CI/CD Pipelines, Workflows, Jobs, Steps & Secrets

**Continuous Integration (CI)** ensures that every pull request automatically builds and passes all tests before it can be merged. **Continuous Deployment (CD)** delivers passing code directly to production servers.

---

## 1. The Core Architecture of GitHub Actions

\`\`\`
Event (push / PR) ---> Workflow (.github/workflows/*.yml) ---> Job (Runner: ubuntu-latest)
                                                                 ├── Step 1: Checkout code
                                                                 ├── Step 2: Setup runtime
                                                                 ├── Step 3: Run unit tests
                                                                 └── Step 4: Deploy artifact
\`\`\`

* **Event**: Trigger that starts the workflow (e.g. \`push\`, \`pull_request\`, \`schedule\`).
* **Runner**: A hosted virtual machine (Ubuntu, Windows, or macOS) executing the jobs.
* **Job**: A set of steps executed on the same runner.
* **Step**: An individual task running either a shell command (\`run:\`) or an action (\`uses:\`).

---

## 2. A Complete Production CI Pipeline

Create a file at \`.github/workflows/build-and-test.yml\`:

\`\`\`yaml
name: Continuous Integration

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository code
        uses: actions/checkout@v4

      - name: Setup .NET SDK
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'

      - name: Restore dependencies
        run: dotnet restore

      - name: Build solution
        run: dotnet build --configuration Release --no-restore

      - name: Execute automated unit tests
        run: dotnet test --configuration Release --no-build --verbosity normal
\`\`\`

---

## 3. Managing Sensitive Credentials with Secrets

Never hardcode database passwords, AWS keys, or API tokens in workflow files.

1. Go to **GitHub -> Settings -> Secrets and variables -> Actions -> New repository secret**.
2. Save secret with name \`DATABASE_URL\` or \`PROD_API_KEY\`.
3. Reference it in your workflow YAML:

\`\`\`yaml
- name: Deploy to Cloud
  env:
    API_KEY: \${{ secrets.PROD_API_KEY }}
  run: |
    ./deploy.sh --key "$API_KEY"
\`\`\`
`,
    contentBn: `# গিটহাব অ্যাকশনস: CI/CD পাইপলাইন, ওয়ার্কফ্লো, জবস, স্টেপস ও সিক্রেটস

**CI/CD (Continuous Integration / Continuous Deployment)** হলো আধুনিক সফটওয়্যার ইঞ্জিনিয়ারিংয়ের মেরুদণ্ড। গিটহাব অ্যাকশনসের মাধ্যমে প্রতিটি পিআরে কোড অটোমেটিক বিল্ড ও টেস্ট হয়।

---

## ১. পাইপলাইন কীভাবে কাজ করে?
যখনই কোনো ডেভেলপার পিআর তৈরি করেন, গিটহাব স্বয়ংক্রিয়ভাবে একটি ভার্চুয়াল মেশিন (যেমন \`ubuntu-latest\`) চালু করে, আপনার কোড ডাউনলোড করে এবং সমস্ত টেস্ট চালিয়ে রিপোর্ট দেয়। টেস্ট ফেইল করলে কোড মার্জ করা যায় না।

---

## ২. ওয়ার্কফ্লো ফাইল স্ট্রাকচার (\`.github/workflows/\`)
প্রজেক্টের রুট ফোল্ডারে \`.github/workflows/ci.yml\` ফাইলে সাধারণ YAML কোড লিখে পুরো অটোমেশন সেটআপ করা যায়।

---

## ৩. সিক্রেটস (Secrets) ম্যানেজমেন্ট
ডাটাবেজ পাসওয়ার্ড বা ক্লাউড এপিআই কি কখনো কোডে বা YAML ফাইলে লেখা যাবে না। গিটহাবের **Settings -> Secrets** এ যুক্ত করে \`\${{ secrets.SECRET_NAME }}\` দিয়ে নিরাপদভাবে অ্যাকশনসে ব্যবহার করতে হয়।
`,
  },
  {
    slug: "github-security",
    titleEn: "GitHub Security: Secrets Leak Prevention, Secret Scanning & Dependabot",
    titleBn: "গিটহাব সিকিউরিটি: সিক্রেট লিক প্রতিরোধ, সিক্রেট স্ক্যানিং ও ডিপেন্ডাবট",
    categoryEn: "18. Security, Scanning & Governance",
    categoryBn: "১৮. রিপোজিটরি নিরাপত্তা ও অডিট",
    categoryDescEn: "Preventing leaked credentials, secret scanning with push protection, automated Dependabot alerts, branch protection rules, and permission roles.",
    categoryDescBn: "গোপন পাসওয়ার্ড/কি লিক প্রতিরোধ, পুশ প্রটেকশন সিক্রেট স্ক্যানিং, ডিপেন্ডাবট সিকিউরিটি অডিট এবং ব্রাঞ্চ প্রটেকশন রুলস।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master enterprise repository security: eliminate committed secrets, configure Dependabot, and enforce strict branch protection rules.",
    descriptionBn: "এন্টারপ্রাইজ রিপোজিটরি নিরাপত্তা নিশ্চিত করুন: গোপন কি লিক প্রতিরোধ, ডিপেন্ডাবট ভালনারেবিলিটি স্ক্যান এবং ব্রাঞ্চ প্রটেকশন সেটআপ।",
    difficulty: "MEDIUM",
    displayOrder: 18,
    prerequisites: ["github-basics"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "About Secret Scanning",
        url: "https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning",
        description: "Official guide on secret scanning and Push Protection.",
        isStarred: true,
      },
      {
        source: "GitHub Docs",
        title: "About Branch Protection Rules",
        url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
        description: "Official guide to preventing unreviewed pushes and enforcing CI checks.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "You accidentally committed an AWS secret key to a public GitHub repository. What are the immediate 3 actions you must take?",
        url: null,
        difficulty: "HARD",
        company: "Optimizely",
        tags: ["GitHub", "Security", "Secret Leaks", "Incident Response"],
        solutionEn: "1. IMMEDIATELY revoke and rotate the secret in AWS IAM Console (assume the key is already compromised by automated scrapers within seconds). 2. Inspect cloud audit logs (AWS CloudTrail) for unauthorized activity. 3. Purge the secret from Git commit history using 'git-filter-repo' or BFG Repo-Cleaner (simply making a new commit deleting the file leaves the secret accessible in historical commits).",
        solutionBn: "১. সাথে সাথে ক্লাউড কনসোলে গিয়ে কি (Key) রিভোক বা ডিঅ্যাক্টিভেট করে নতুন কি তৈরি করতে হবে (মনে রাখবেন কয়েক সেকেন্ডের মধ্যেই হ্যাকারদের অটোমেটিক বট পাবলিক গিটহাব স্ক্যান করে কি চুরি করে নেয়)। ২. অডিট লগ চেক করে কোনো অবৈধ অ্যাক্সেস হয়েছে কিনা দেখা। ৩. 'git-filter-repo' বা BFG দিয়ে পুরো গিট হিস্ট্রি থেকে কি মুছে ফেলা (শুধু নতুন কমিটে ফাইল ডিলিট করলে পূর্ববর্তী হিস্ট্রিতে সিক্রেট থেকে যায়)।",
      },
    ],
    contentEn: `# GitHub Security: Secrets Leak Prevention, Secret Scanning & Dependabot

A single leaked AWS key or database connection string can bankrupt a company or compromise millions of user records within minutes.

---

## 1. The Cardinal Rule: Never Commit Secrets

Automated bot scrapers continuously monitor public GitHub pushes. Any committed API token (Stripe, OpenAI, AWS, SendGrid) is typically exploited within **30 to 90 seconds** of being pushed.

### How to Prevent Leaks:
* Always use \`.env\` files and ensure \`.env*\` is present in \`.gitignore\`.
* Provide a safe \`.env.example\` template with blank dummy values.
* Use tools like **Git-Secrets** or **TruffleHog** in pre-commit hooks to block secrets locally.

---

## 2. GitHub Secret Scanning & Push Protection

Enable **Push Protection** in repository settings:
* **Settings -> Code security and analysis -> Secret scanning -> Push protection (Enable)**.
* If a developer attempts to run \`git push\` containing a recognized secret format (e.g. AWS access key, GitHub PAT), GitHub **actively rejects the push at the network level** and prevents the commit from reaching the server!

---

## 3. Dependabot: Automated Vulnerability Patching

Open-source packages frequently have known Common Vulnerabilities and Exposures (CVEs).
* **Dependabot Alerts**: GitHub automatically notifies you when a NuGet or npm package in your repo has a critical vulnerability.
* **Dependabot Security Updates**: Dependabot automatically opens a ready-to-merge Pull Request bumping the vulnerable package to the patched version.

---

## 4. Enterprise Branch Protection Rules

In enterprise environments, the \`main\` branch must be protected:
1. Go to **Settings -> Branches -> Add branch protection rule -> \`main\`**.
2. Check **Require a pull request before merging** (minimum 1 or 2 approvals).
3. Check **Require status checks to pass before merging** (forces GitHub Actions CI tests to be green).
4. Check **Do not allow bypassing the above settings** (applies rules to administrators as well).
5. Ensure **Force pushes and branch deletions are disabled**.
`,
    contentBn: `# গিটহাব সিকিউরিটি: সিক্রেট লিক প্রতিরোধ, সিক্রেট স্ক্যানিং ও ডিপেন্ডাবট

একটি অসাবধানতামূলক এপিআই কি বা ডাটাবেজ পাসওয়ার্ড লিক কোনো কোম্পানির কোটি টাকার ক্ষতি করতে পারে।

---

## ১. প্রধান নিয়ম: কখনোই সিক্রেট কমিট করবেন না
পাবলিক গিটহাবে কোনো এপিআই কি পুশ হলে ৩০ সেকেন্ডের মধ্যে অটোমেটিক রোবট তা স্ক্যান করে চুরি করে নেয়। তাই সবসময় \`.gitignore\` এ \`.env\` ফাইল রাখবেন।

---

## ২. সিক্রেট স্ক্যানিং ও পুশ প্রটেকশন
গিটহাবের **Push Protection** অন থাকলে কোনো ডেভেলপার ভুলবশত এডাব্লিউএস কি বা সিক্রেট পুশ করতে গেলে গিটহাব টার্মিনালেই পুশ আটকে দেয় এবং সিক্রেট আপলোড হতে দেয় না।

---

## ৩. ডিপেন্ডাবট (Dependabot)
আপনার প্রজেক্টের কোনো প্যাকেজে যদি সিকিউরিটি দুর্বলতা (CVE) থাকে, তবে ডিপেন্ডাবট সাথে সাথে এলার্ট দেয় এবং সমাধানসহ অটোমেটিক পুল রিকোয়েস্ট পাঠিয়ে দেয়।

---

## ৪. ব্রাঞ্চ প্রটেকশন রুলস (Branch Protection)
প্রোডাকশন \`main\` ব্রাঞ্চের নিরাপত্তায়:
* সরাসরি পুশ সম্পূর্ণ নিষিদ্ধ করা।
* অন্তত ১ বা ২ জন সিনিয়র ইঞ্জিনিয়ারের অনুমোদন ছাড়া মার্জ না হতে দেওয়া।
* সমস্ত অটোমেটিক টেস্ট পাশ না হওয়া পর্যন্ত মার্জ বাটন লক রাখা।
`,
  },
];
