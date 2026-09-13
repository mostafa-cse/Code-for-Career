import type { LocalLesson } from "@/lib/lessons-data";

export const githubActionsLesson: LocalLesson = {
    slug: "github-actions",
    titleEn: "GitHub Actions: CI/CD Pipelines, Workflows, Events, Jobs, Steps, Actions, Secrets & Variables",
    titleBn: "গিটহাব অ্যাকশনস: CI/CD পাইপলাইন, ওয়ার্কফ্লো, ইভেন্টস, জবস, স্টেপস, অ্যাকশনস, সিক্রেটস ও ভেরিয়েবলস",
    categoryEn: "17. GitHub Actions & CI/CD",
    categoryBn: "১৭. গিটহাব অ্যাকশনস ও CI/CD",
    categoryDescEn: "Comprehensive guide to CI/CD concepts, GitHub Actions architecture, workflow triggers (push, PR, cron), parallel vs sequential jobs, marketplace actions, encrypted secrets, and environment variables.",
    categoryDescBn: "CI/CD এর বিস্তারিত ধারণা, গিটহাব অ্যাকশনস আর্কিটেকচার, ওয়ার্কফ্লো ট্রিগার (push, PR, cron), প্যারালাল ও সিকোয়েনশিয়াল জবস, মার্কেটপ্লেস অ্যাকশনস, এনক্রিপ্টেড সিক্রেটস ও এনভায়রনমেন্ট ভেরিয়েবলস।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master enterprise CI/CD automation with GitHub Actions: build automated test suites, matrix builds, deployment pipelines, secrets management, and custom workflows.",
    descriptionBn: "গিটহাব অ্যাকশনস ব্যবহার করে প্রতিটি পুশ ও পিআরে অটোমেটিক বিল্ড, ইউনিট টেস্ট, ডিপ্লয়মেন্ট পাইপলাইন, সিক্রেটস ম্যানেজমেন্ট এবং কাস্টম ওয়ার্কফ্লো তৈরি শিখুন।",
    difficulty: "HARD",
    displayOrder: 17,
    prerequisites: ["github-basics"],
    estimatedMinutes: 35,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "Understanding GitHub Actions",
        url: "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions",
        description: "Official guide to workflow YAML files, runners, and syntax.",
        isStarred: true,
      },
      {
        source: "GitHub Marketplace",
        title: "GitHub Actions Marketplace",
        url: "https://github.com/marketplace?type=actions",
        description: "Explore thousands of pre-built, verified CI/CD automation actions.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "Write a complete GitHub Actions CI/CD workflow YAML that triggers on pull requests to main, runs matrix tests across multiple runtimes, and securely deploys using secrets.",
        url: null,
        difficulty: "HARD",
        company: "Brain Station 23 / Optimizely",
        tags: ["GitHub Actions", "CI/CD", "Automation", "Workflows", "DevOps"],
        solutionEn: "Create '.github/workflows/ci.yml' with 'on: pull_request: branches: [main]'. Configure a 'test' job running on 'ubuntu-latest' with a matrix strategy testing versions. Then configure a sequential 'deploy' job with 'needs: test' and 'if: github.ref == \\'refs/heads/main\\'', injecting credentials securely via '\\${{ secrets.PROD_DEPLOY_KEY }}'.",
        solutionBn: "'.github/workflows/ci.yml' ফাইলে 'on: pull_request: branches: [main]' দিয়ে ট্রিগার সেট করে 'ubuntu-latest' রানারে ম্যাট্রিক্স স্ট্র্যাটেজি দিয়ে টেস্ট জব চালাতে হয়। এরপর 'needs: test' ব্যবহার করে ডিপ্লয় জব সিকোয়েনশিয়ালি সাজাতে হয় এবং ক্লাউড ক্রেডেনশিয়াল '\\${{ secrets.DEPLOY_KEY }}' দিয়ে নিরাপদে ইনজেক্ট করতে হয়।",
      },
    ],
    contentEn: `# 17. GitHub Actions: Complete CI/CD Automation Guide

Modern software engineering cannot rely on manual builds, manual testing, or manual FTP deployments. **GitHub Actions** brings automated continuous integration and continuous deployment (CI/CD) directly inside your repository.

---

## 1. What is CI/CD? (Mental Model & Industry Purpose)

### Continuous Integration (CI):
* **What it is:** Developers frequently merge code into a shared branch. Every push or Pull Request triggers an automated build and test runner.
* **Why it matters:** Detects integration conflicts and broken code immediately (*"Fail fast, fix early"*). Broken code can never merge into \`main\`.

### Continuous Delivery (CD):
* **What it is:** Code that passes CI is automatically packaged into deployment artifacts (Docker images, binaries, minified bundles) and staged for release.
* **Release trigger:** A human manager or QA presses a single "Approve" button to deploy.

### Continuous Deployment (CD):
* **What it is:** The entire pipeline is 100% automated. Every passing commit on \`main\` goes straight to live production servers without manual intervention.

\`\`\`text
Developer Pushes Code ──► CI: Build & Automated Tests ──► CD: Package Artifacts ──► CD: Deploy to Cloud
         │                            │                                                   │
   (git push)                 (Pass / Fail)                                     (AWS / Vercel / Azure)
\`\`\`

---

## 2. GitHub Actions (The Automation Platform)

### What is GitHub Actions?
GitHub Actions is a built-in event-driven automation platform that allows you to execute arbitrary code (shell scripts, Docker containers, binaries) inside clean virtual machines hosted by GitHub.

### Core Anatomy:
* **Event:** The trigger that wakes up the workflow (e.g., \`push\`, \`pull_request\`, \`schedule\`).
* **Workflow:** The automated process defined in a YAML file inside \`.github/workflows/\`.
* **Runner:** A fresh virtual machine (Ubuntu, Windows, or macOS) assigned to execute your tasks.
* **Job:** A group of sequential steps executed on the same runner machine.
* **Step:** An individual command (\`run:\`) or a reusable action (\`uses:\`).
* **Action:** A pre-packaged, community-verified automation unit.

---

## 3. Workflow (YAML Configuration Files)

### Rules of Workflows:
1. **Directory Location:** Workflows **must** be stored inside \`.github/workflows/\` at the root of your repository.
2. **File Format:** Written strictly in standard YAML (\`.yml\` or \`.yaml\`).
3. **Multiple Workflows:** A single repository can have dozens of independent workflows (e.g., \`ci.yml\`, \`deploy.yml\`, \`release.yml\`, \`cleanup.yml\`).

### Basic Anatomy:
\`\`\`yaml
name: Build and Test Pipeline

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      - name: Say Hello
        run: echo "Starting automated build on GitHub Actions!"
\`\`\`

---

## 4. Events (Workflow Triggers: \`on:\`)

An **Event** is a specific GitHub activity that triggers a workflow run.

### Common Event Types:
\`\`\`yaml
# 1. Trigger on Push (specific branches, tags, or file paths)
on:
  push:
    branches: [ main, 'release/**' ]
    tags: [ 'v*.*.*' ]
    paths-ignore:
      - '**.md'
      - 'docs/**'

# 2. Trigger on Pull Requests
on:
  pull_request:
    branches: [ main ]
    types: [ opened, synchronize, reopened ]

# 3. Scheduled Cron Trigger (runs automatically every night at 2:00 AM UTC)
on:
  schedule:
    - cron: '0 2 * * *'

# 4. Manual Trigger via GitHub UI (with interactive form inputs!)
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target Deployment Environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
\`\`\`

---

## 5. Jobs (Runners, Parallelism & Dependencies)

A **Job** is a set of steps that execute on the same runner instance.

### Parallel vs Sequential Execution:
* **Default:** By default, all jobs in a workflow run **in parallel** to save time.
* **Sequential Ordering with \`needs:\`:** If job B depends on job A succeeding, use \`needs:\`.

\`\`\`yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  deploy:
    needs: [lint, test]  # Will only run if BOTH lint and test pass!
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production server..."
\`\`\`

### Matrix Builds (Testing Multiple Versions Simultaneously):
Test your codebase against multiple Node/Python/.NET versions and operating systems in parallel:
\`\`\`yaml
jobs:
  matrix-test:
    runs-on: \${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [18.x, 20.x, 22.x]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
      - run: npm test
\`\`\`

---

## 6. Steps (Executing Tasks in Runners)

Steps are executed sequentially inside a job. If any step fails, the job immediately terminates with an error.

### Step Types:
1. **Shell Commands (\`run:\`):** Runs commands in bash (Linux/macOS) or pwsh (Windows):
   \`\`\`yaml
   - name: Run Build Script
     run: |
       echo "Compiling assets..."
       npm run build
       ls -la dist/
   \`\`\`
2. **Reusable Actions (\`uses:\`):** Executes pre-built tools:
   \`\`\`yaml
   - name: Check out repo
     uses: actions/checkout@v4
   \`\`\`

### Step Control Modifiers:
* \`continue-on-error: true\` — Does not fail the entire job if this step fails.
* \`timeout-minutes: 10\` — Aborts step if it hangs longer than 10 minutes.
* \`working-directory: ./src/backend\` — Runs command inside a subfolder.

---

## 7. Actions (The Reusable Marketplace)

Instead of writing complex bash scripts from scratch, **Actions** are reusable packages shared on the GitHub Marketplace.

### The Most Essential Official Actions:
| Action | Purpose | Example |
| :--- | :--- | :--- |
| \`actions/checkout@v4\` | Clones your repo into the runner | \`uses: actions/checkout@v4\` |
| \`actions/setup-node@v4\` | Installs specific Node.js runtime | \`uses: actions/setup-node@v4\` |
| \`actions/setup-python@v5\` | Configures Python and pip | \`uses: actions/setup-python@v5\` |
| \`actions/setup-dotnet@v4\` | Configures .NET SDK | \`uses: actions/setup-dotnet@v4\` |
| \`actions/upload-artifact@v4\` | Saves compiled build files for download | \`uses: actions/upload-artifact@v4\` |
| \`actions/cache@v4\` | Caches dependencies to speed up CI runs | \`uses: actions/cache@v4\` |

---

## 8. Secrets (Encrypted Credential Storage)

Never hardcode database passwords, AWS access keys, or API tokens in workflow YAML files!

### Adding Secrets:
1. Go to repository **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.
2. Add name (e.g. \`PROD_DATABASE_URL\`) and value.

### Referencing Secrets in YAML:
\`\`\`yaml
steps:
  - name: Run Database Migration
    env:
      DB_CONNECTION: \${{ secrets.PROD_DATABASE_URL }}
      STRIPE_KEY: \${{ secrets.STRIPE_SECRET_KEY }}
    run: |
      python manage.py migrate
\`\`\`

### Built-in Secret: \`GITHUB_TOKEN\`
GitHub automatically generates a scoped, temporary authentication token for every workflow run:
\`\`\`yaml
- name: Create GitHub Release
  uses: softprops/action-gh-release@v2
  with:
    tag_name: \${{ github.ref_name }}
  env:
    GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
\`\`\`

> 🔒 **Automatic Log Masking:** If a script prints a secret to the terminal, GitHub automatically scrubs it and replaces it with \`***\` in the build logs!

---

## 9. Environment Variables (\`env:\`, \`vars:\` & Context)

### Setting Custom Environment Variables:
Environment variables can be defined at three different scopes:
\`\`\`yaml
name: Deployment Pipeline

# 1. Global / Workflow Scope (Available to all jobs and steps)
env:
  NODE_ENV: production
  APP_REGION: ap-southeast-1

jobs:
  deploy:
    runs-on: ubuntu-latest
    # 2. Job Scope (Available to all steps inside this job)
    env:
      DEPLOY_TIMEOUT: 600

    steps:
      - name: Build
        # 3. Step Scope (Available only within this specific step)
        env:
          BUILD_HASH: \${{ github.sha }}
        run: echo "Building for $NODE_ENV with hash $BUILD_HASH"
\`\`\`

### Built-in GitHub Context Variables:
* \`\${{ github.actor }}\` — Username of the person who triggered the run.
* \`\${{ github.sha }}\` — Exact 40-character commit hash being tested.
* \`\${{ github.ref_name }}\` — Branch or tag name (e.g. \`main\`, \`v1.0.0\`).
* \`\${{ github.repository }}\` — Repository full name (\`owner/repo\`).

### Secrets vs Repository Variables:
* **Secrets (\`\${{ secrets.NAME }}\`):** For sensitive, encrypted credentials (keys, passwords). Masked in logs.
* **Variables (\`\${{ vars.NAME }}\`):** For non-sensitive configurations (API URLs, ports, environment labels).

---

## 📋 Complete Production CI/CD Workflow Template

\`\`\`yaml
# .github/workflows/production-pipeline.yml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Run Unit & Integration Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Runtime
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Execute Automated Tests
        run: npm test -- --coverage

  deploy:
    name: Deploy to Production Cloud
    needs: [test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy Artifacts
        env:
          CLOUD_API_KEY: \${{ secrets.PROD_CLOUD_API_KEY }}
          SERVER_URL: \${{ vars.PROD_SERVER_URL }}
        run: |
          echo "Deploying commit \${{ github.sha }} to $SERVER_URL..."
          # ./deploy-script.sh --key "$CLOUD_API_KEY"
\`\`\`
`,
    contentBn: `# ১৭. গিটহাব অ্যাকশনস ও CI/CD অটোমেশন (GitHub Actions & CI/CD)

আধুনিক প্রফেশনাল সফটওয়্যার ডেভেলপমেন্টে ম্যানুয়ালি কোড টেস্ট করা, ফাইল জিপ করে এফটিপি (FTP) দিয়ে সার্ভারে আপলোড করা সম্পূর্ণ সেকেলে ও ঝুঁকিপূর্ণ প্র্যাকটিস। **GitHub Actions** হলো রিপোজিটরির ভেতরেই বিল্ট-ইন অটোমেশন প্ল্যাটফর্ম যা কোড পুশ হওয়ামাত্র অটোমেটিক বিল্ড, টেস্ট ও সার্ভারে ডিপ্লয়মেন্ট নিশ্চিত করে।

---

## ১. CI/CD কী? (What is CI/CD?)

### 🔹 Continuous Integration (CI - অবিচ্ছিন্ন সংযুক্তি):
* **ধারণা:** টিমের একাধিক ডেভেলপার প্রতিদিন ব্রাঞ্চ থেকে কোড মেইন ব্রাঞ্চে মার্জ করার চেষ্টা করেন। প্রতিটি পুশ বা পিআরের (PR) সাথে সাথে স্বয়ংক্রিয়ভাবে ভার্চুয়াল মেশিনে কোড কম্পাইল হয় এবং সমস্ত ইউনিট টেস্ট রান করে।
* **উদ্দেশ্য:** কোনো কোডে বাগ থাকলে বা টেস্ট ফেইল করলে পিআর মার্জ হওয়া সাথে সাথে আটকে যায় (*"Fail Fast, Fix Early"*), ফলে মেইন ব্রাঞ্চের কোড কখনো নষ্ট হয় না।

### 🔹 Continuous Delivery (CD - অবিচ্ছিন্ন ডেলিভারি):
* **ধারণা:** টেস্ট পাস করা কোড নিজে থেকেই প্রোডাকশন-রেডি আর্টফ্যাক্টে (যেমন: ডকার ইমেজ, মিনামাইজড বান্ডিল বা বাইনারি) রূপান্তর হয়ে স্টেজিং সার্ভারে প্রস্তুত থাকে। টিম লিড বা রিলিজ ম্যানেজার একটি বাটন প্রেস করলেই প্রোডাকশনে চলে যায়।

### 🔹 Continuous Deployment (CD - সম্পূর্ণ স্বয়ংক্রিয় ডিপ্লয়মেন্ট):
* **ধারণা:** কোনো মানুষের হস্তক্ষেপ ছাড়াই টেস্ট পাস করা কোড সরাসরি লাইভ প্রোডাকশন সার্ভারে চলে যায়। আপনি \`main\` ব্রাঞ্চে মার্জ করলেন, আর ২ মিনিটের মধ্যে লাইভ ওয়েবসাইটে পরিবর্তন দেখতে পেলেন!

\`\`\`text
ডেভেলপার পুশ করলেন ──► CI: অটোমেটিক বিল্ড ও টেস্ট ──► CD: প্যাকেজ আর্টফ্যাক্ট ──► CD: লাইভ ক্লাউড সার্ভার
         │                          │                                                  │
    (git push)             (টেস্ট পাস / ফেইল)                                 (AWS / Vercel / VPS)
\`\`\`

---

## ২. GitHub Actions (অটোমেশন প্ল্যাটফর্ম)

### 🔹 গিটহাব অ্যাকশনস কী?
GitHub Actions হলো একটি ইভেন্ট-চালিত (Event-driven) অটোমেশন সিস্টেম। গিটহাবে কোনো ঘটনা (Event) ঘটার সাথে সাথে এটি ব্যাকগ্রাউন্ডে একটি ফ্রেশ ভার্চুয়াল মেশিন তৈরি করে আপনার লিখে দেওয়া স্ক্রিপ্ট বা কমান্ডগুলো এক্সিকিউট করে দেয়।

### 🔹 এর আর্কিটেকচার বা উপাদানসমূহ:
* **Event:** যে ঘটনার কারণে পাইপলাইন চালু হবে (যেমন: \`push\`, \`pull_request\`)।
* **Workflow:** একটি YAML ফাইলে লেখা সম্পূর্ণ অটোমেশন প্ল্যান (\`.github/workflows/*.yml\`)।
* **Runner:** গিটহাবের প্রোভাইড করা ভার্চুয়াল মেশিন (উবুন্টু, উইন্ডোজ বা ম্যাকওএস)।
* **Job:** একই ভার্চুয়াল মেশিনে রান করা একগুচ্ছ ধারাবাহিক স্টেপ।
* **Step:** জবের ভেতরের একটি একক টাস্ক (কোনো শেল কমান্ড বা অ্যাকশন)।
* **Action:** কমিউনিটির তৈরি করা রি-ইউজেবল প্লাগইন বা টুল।

---

## ৩. Workflow (ওয়ার্কফ্লো ফাইল স্ট্রাকচার)

### 🔹 ওয়ার্কফ্লো ফাইলের নিয়মাবলী:
1. **লোকেশন:** প্রতিটি ওয়ার্কফ্লো ফাইল অবশ্যই প্রোজেক্টের রুটে \`.github/workflows/\` ডিরেক্টরির ভেতরে থাকতে হবে।
2. **ফাইলের ফরম্যাট:** এটি স্ট্যান্ডার্ড YAML ফরম্যাটে (\`.yml\` বা \`.yaml\`) লিখতে হয়।
3. **একাধিক ওয়ার্কফ্লো:** একটি রিপোজিটরিতে একাধিক স্বাধীন ওয়ার্কফ্লো থাকতে পারে (যেমন: \`test.yml\`, \`deploy.yml\`, \`release.yml\`)।

### 🔹 সাধারণ স্ট্রাকচার:
\`\`\`yaml
name: Test Pipeline

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      - name: Run Build
        run: echo "অটোমেটেড বিল্ড সফলভাবে চলছে!"
\`\`\`

---

## ৪. Events (ওয়ার্কফ্লো ট্রিগার — \`on:\`)

যে ঘটনাটি ঘটলে পাইপলাইন জেগে ওঠে তাকে **Event** বলে।

### 🔹 বহুল ব্যবহৃত ইভেন্টসমূহ:
\`\`\`yaml
# ১. পুশ হলে ট্রিগার (নির্দিষ্ট ব্রাঞ্চ, ট্যাগ বা ফাইল পাথ)
on:
  push:
    branches: [ main, dev ]
    tags: [ 'v*' ]
    paths-ignore:
      - 'README.md'
      - 'docs/**'

# ২. পুল রিকোয়েস্ট (PR) ওপেন বা আপডেট হলে
on:
  pull_request:
    branches: [ main ]

# ৩. শিডিউলড ক্রন জব (প্রতিদিন রাত ২টায় স্বয়ংক্রিয়ভাবে রান করবে)
on:
  schedule:
    - cron: '0 2 * * *'

# ৪. ম্যানুয়ালি গিটহাব ড্যাশবোর্ড থেকে বাটন চেপে চালানো (Custom Form সহ)
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'সার্ভার পরিবেশ বেছে নিন'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
\`\`\`

---

## ৫. Jobs (জবস, রানার ও প্যারালাল এক্সেকিউশন)

একটি **Job** হলো এমন কতগুলো স্টেপ যা একটি নির্দিষ্ট ভার্চুয়াল কম্পিউটারে (Runner) ধারাবাহিকভাবে সম্পন্ন হয়।

### 🔹 প্যারালাল বনাম সিকোয়েনশিয়াল জব:
* **ডিফল্টভাবে প্যারালাল:** দ্রুত কাজ শেষ করার জন্য গিটহাব একাধিক জব একই সাথে প্যারালালে রান করায়।
* **ধারাবাহিক করতে \`needs:\`:** যদি টেস্ট পাস করার পরেই কেবল ডিপ্লয় করতে চান, তবে \`needs:\` কিওয়ার্ড ব্যবহার করতে হয়:

\`\`\`yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  deploy:
    needs: test   # শুধুমাত্র test পাস করলেই এই জব চলবে!
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "প্রোডাকশন সার্ভারে ডিপ্লয় হচ্ছে..."
\`\`\`

### 🔹 ম্যাট্রিক্স বিল্ড (একসাথে একাধিক ভার্সনে টেস্ট):
একই কোড বিভিন্ন অপারেটিং সিস্টেম ও ল্যাঙ্গুয়েজ ভার্সনে প্যারালালে টেস্ট করতে:
\`\`\`yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]
    os: [ubuntu-latest, windows-latest]
\`\`\`

---

## ৬. Steps (স্টেপস — কাজের ধাপ)

জবের ভেতরে থাকা প্রতিটি কাজকে **Step** বলে। কোনো একটি স্টেপ ফেইল করলে পেছনের বাকি স্টেপগুলো নিজে থেকেই ক্যান্সেল হয়ে যায়।

### 🔹 স্টেপের প্রকারভেদ:
1. **শেল কমান্ড চালানো (\`run:\`):** টার্মিনালের যেকোনো কমান্ড বা ব্যাশ স্ক্রিপ্ট সরাসরি রান করা:
   \`\`\`yaml
   - name: বিল্ড স্ক্রিপ্ট চালান
     run: |
       npm ci
       npm run build
   \`\`\`
2. **রি-ইউজেবল অ্যাকশন ব্যবহার (\`uses:\`):** কমিউনিটির বা গিটহাবের তৈরি কোনো প্লাগইন চালানো:
   \`\`\`yaml
   - name: রিপোজিটরি কোড ক্লোন করা
     uses: actions/checkout@v4
   \`\`\`

---

## ৭. Actions (মার্কেটপ্লেস ও রি-ইউজেবল টুলস)

প্রতিবার স্ক্র্যাচ থেকে লম্বা ব্যাশ স্ক্রিপ্ট না লিখে গিটহাব মার্কেটপ্লেসের ভেরিফাইড **Actions** ব্যবহার করা ইন্ডাস্ট্রির নিয়ম।

### 🔹 সবচেয়ে গুরুত্বপূর্ণ কিছু অফিসিয়াল অ্যাকশন:
| অ্যাকশন | কাজ ও উদ্দেশ্য |
| :--- | :--- |
| \`actions/checkout@v4\` | আপনার রিপোজিটরির কোড রানার মেশিনে নামিয়ে আনা (MANDATORY) |
| \`actions/setup-node@v4\` | নোড জেএস রানটাইম ও এনপিএম ইনস্টল করা |
| \`actions/setup-python@v5\` | পাইথন রানটাইম সেটআপ করা |
| \`actions/setup-dotnet@v4\` | ডটনেট এসডিকে ইনস্টল করা |
| \`actions/upload-artifact@v4\` | বিল্ড হওয়া আউটপুট ফাইল জিপ আকারে ডাউনলোড করার জন্য সেভ রাখা |
| \`actions/cache@v4\` | প্যাকেজ ডিপেন্ডেন্সি ক্যাশ করে বিল্ডের সময় কমানো |

---

## ৮. Secrets (এনক্রিপ্টেড সিক্রেটস ম্যানেজমেন্ট)

সার্ভারের পাসওয়ার্ড, ক্লাউড এপিআই কি, ডাটাবেজ ইউআরএল কখনো কোডে বা YAML ফাইলে লেখা যাবে না!

### 🔹 সিক্রেট যুক্ত করার নিয়ম:
1. রিপোজিটরির **Settings** ➔ **Secrets and variables** ➔ **Actions** ➔ **New repository secret**-এ যান।
2. সিক্রেটের নাম দিন (যেমন: \`PROD_API_KEY\`) এবং ভ্যালু পেস্ট করে সেভ করুন।

### 🔹 YAML ফাইলে ব্যবহার করার নিয়ম:
\`\`\`yaml
steps:
  - name: ক্লাউডে ডিপ্লয়
    env:
      API_KEY: \${{ secrets.PROD_API_KEY }}
    run: |
      ./deploy.sh --key "$API_KEY"
\`\`\`

> 🔒 **লগ মাস্কিং (Automatic Masking):** স্ক্রিপ্ট চলার সময় যদি দুর্ঘটনাবশত কোনো সিক্রেট টার্মিনালে প্রিন্টও হয়ে যায়, গিটহাব নিজে থেকেই তা ব্লার করে \`***\` দেখায়, যাতে অন্য কেউ দেখতে না পারে!

---

## ৯. Environment Variables (এনভায়রনমেন্ট ভেরিয়েবলস)

### 🔹 ভেরিয়েবলের স্কোপসমূহ (\`env:\`):
\`\`\`yaml
name: Deploy

# ১. ওয়ার্কফ্লো লেভেল (সব জব ও স্টেপ পাবে)
env:
  APP_ENV: production

jobs:
  build:
    runs-on: ubuntu-latest
    # ২. জব লেভেল (শুধু এই জবের স্টেপগুলো পাবে)
    env:
      PORT: 8080

    steps:
      - name: প্রিন্ট
        # ৩. স্টেপ লেভেল (শুধু এই স্টেপেই কার্যকর)
        env:
          MY_VAR: test
        run: echo "Environment: $APP_ENV, Port: $PORT"
\`\`\`

### 🔹 ডিফল্ট গিটহাব ভেরিয়েবলস:
* \`\${{ github.actor }}\` — যিনি পুশ বা রান ট্রিগার করেছেন তার ইউজারনেম।
* \`\${{ github.sha }}\` — যে নির্দিষ্ট কমিটে বিল্ড চলছে তার ৪০ অক্ষরের হ্যাশ।
* \`\${{ github.ref_name }}\` — ব্রাঞ্চের নাম (যেমন: \`main\`)।

### 🔹 Secrets বনাম Variables:
* **Secrets (\`\${{ secrets.NAME }}\`):** পাসওয়ার্ড, প্রাইভেট কি (এনক্রিপ্টেড ও লগে লুকায়িত)।
* **Variables (\`\${{ vars.NAME }}\`):** সার্ভার ইউআরএল, পোর্ট নম্বর, নন-সিক্রেট কনফিগারেশন।

---

## 📋 কমপ্লিট প্রোডাকশন পাইপলাইনের টেমপ্লেট

\`\`\`yaml
# .github/workflows/ci-cd.yml
name: Complete Production Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: টেস্ট ও কোড কোয়ালিটি
    runs-on: ubuntu-latest
    steps:
      - name: কোড ক্লোন করা
        uses: actions/checkout@v4

      - name: নোড সেটআপ
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: ডিপেন্ডেন্সি ইনস্টল
        run: npm ci

      - name: ইউনিট টেস্ট চালানো
        run: npm test

  deploy:
    name: সার্ভার ডিপ্লয়মেন্ট
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: কোড ক্লোন
        uses: actions/checkout@v4

      - name: ক্লাউডে ডিপ্লয়
        env:
          SERVER_IP: \${{ vars.PRODUCTION_SERVER_IP }}
          DEPLOY_KEY: \${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          echo "কমিট \${{ github.sha }} সফলভাবে $SERVER_IP তে ডিপ্লয় করা হচ্ছে..."
\`\`\`
`,
  };
