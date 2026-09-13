import type { LocalLesson } from "@/lib/lessons-data";

export const githubBasicsLesson: LocalLesson = {
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

Your GitHub account is your living engineering portfolio. Tech recruiters and engineering managers evaluate candidates not just by their resume claims, but by the quality, structure, and presentation of their GitHub repositories.

Here is the complete breakdown of the 8 core GitHub foundational concepts:

---

## 1. Creating a Repository

A repository (repo) is a digital storage space for your project files, commit history, branches, and issue discussions.

### Ways to create a repository:

#### Method A: GitHub Web UI
1. Log in to [GitHub](https://github.com).
2. In the top-right corner, click the **\`+\`** dropdown and select **New repository**.
3. **Repository name**: Use lowercase with hyphens (kebab-case), e.g., \`ecommerce-backend-api\`.
4. **Description**: A clear one-sentence summary of what the project accomplishes.
5. **Initialization options**:
   - Check **Add a README file** (if starting a brand-new project from scratch).
   - Add **.gitignore** (select your language template, e.g., \`Node\`, \`Python\`, or \`VisualStudio\`).
   - Choose a **License** (e.g., \`MIT License\`).
6. Click **Create repository**.

#### Method B: GitHub CLI (\`gh\`)
\`\`\`bash
# Create a new public repo directly from terminal and push current directory:
gh repo create my-awesome-app --public --source=. --remote=origin --push
\`\`\`

#### Connecting an existing local project to a newly created empty repo:
\`\`\`bash
# 1. Initialize local repository:
git init -b main

# 2. Add files and make initial commit:
git add .
git commit -m "feat: initial commit"

# 3. Add remote origin and push:
git remote add origin git@github.com:username/my-awesome-app.git
git push -u origin main
\`\`\`

---

## 2. Public vs Private Repository

| Factor | Public Repository | Private Repository |
| :--- | :--- | :--- |
| **Visibility** | Visible to the entire internet | Visible only to you and invited collaborators |
| **Searchability** | Indexed by Google & GitHub Search | Invisible in search engines and profiles |
| **Forks & Stars** | Anyone can star, fork, and clone | Cannot be starred or forked by outsiders |
| **Best Used For** | Portfolios, open-source libraries, capstone projects | Proprietary commercial code, freelance client apps, internal tools |
| **Hiring Value** | ⭐⭐⭐⭐⭐ Critical for job applications | Hidden from recruiters |

> [!CAUTION]
> **Security Warning**: If you switch a private repository to public, ensure you have never committed API keys, database passwords, or JWT secrets in any previous commit. The entire commit history becomes publicly searchable!

---

## 3. README.md (The Front Door of Your Project)

A project without a \`README.md\` is like a store with no sign. Recruiters will close your tab in 5 seconds if they cannot understand what your project does or how to run it.

### The Anatomy of a Standout README:

\`\`\`markdown
# 🛒 Distributed E-Commerce Microservices API

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![.NET 9](https://img.shields.io/badge/.NET-9.0-blue)

A high-performance e-commerce platform built with ASP.NET Core 9 Clean Architecture, PostgreSQL, Redis, and RabbitMQ.

## 🚀 Key Features
- **Clean Architecture & CQRS**: Separation of concerns with MediatR.
- **Resilient Messaging**: RabbitMQ event bus with Outbox Pattern.
- **Distributed Caching**: Redis cache for catalog read endpoints.
- **JWT & Role-Based Auth**: Secure authorization for Customer and Admin roles.

## 🏗️ Architecture Diagram
\`\`\`
[ Client App ] ──► [ API Gateway ] ──► [ Orders Service ] ──► [ PostgreSQL ]
                                              │
                                              └──► [ RabbitMQ ] ──► [ Inventory Service ]
\`\`\`

## 🛠️ Tech Stack
- **Backend**: C# / .NET 9, EF Core, Dapper
- **Database**: PostgreSQL 16, Redis 7
- **DevOps**: Docker, GitHub Actions CI/CD

## ⚡ Getting Started

### Prerequisites
- .NET 9 SDK
- Docker & Docker Compose

### Local Installation & Setup
\`\`\`bash
# 1. Clone repository
git clone https://github.com/username/ecommerce-api.git
cd ecommerce-api

# 2. Launch background dependencies (Postgres, Redis, RabbitMQ)
docker-compose up -d

# 3. Restore and run migrations
dotnet ef database update --project src/Infrastructure

# 4. Start the API
dotnet run --project src/Api
\`\`\`

## 📖 API Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| \`POST\` | \`/api/v1/auth/login\` | User authentication & JWT issuance | No |
| \`GET\` | \`/api/v1/products\` | Paginated product listing | No |
| \`POST\` | \`/api/v1/orders\` | Place customer order | Bearer JWT |

## 🧪 Running Tests
\`\`\`bash
dotnet test --logger "console;verbosity=detailed"
\`\`\`

## 📄 License
Distributed under the MIT License. See \`LICENSE\` for more information.
\`\`\`

---

## 4. .gitignore (Excluding Junk and Secrets)

Git tracks everything unless you explicitly tell it to ignore certain files. The \`.gitignore\` file sits in the root of your project and defines wildcard patterns for files and directories that Git should never track.

### What should ALWAYS be ignored?
1. **Dependencies**: \`node_modules/\`, \`packages/\`, \`vendor/\` (these should be restored via package managers).
2. **Build artifacts & compiled binaries**: \`bin/\`, \`obj/\`, \`dist/\`, \`build/\`, \`*.dll\`, \`*.exe\`.
3. **Environment secrets & configurations**: \`.env\`, \`.env.local\`, \`appsettings.Development.json\` (containing database passwords or Stripe secret keys).
4. **Operating system noise**: \`.DS_Store\` (macOS), \`Thumbs.db\` (Windows).
5. **IDE user settings**: \`.vscode/\`, \`.idea/\`.

### Example \`.gitignore\` Patterns:
\`\`\`gitignore
# Ignore build outputs:
bin/
obj/
dist/

# Ignore packages:
node_modules/

# Ignore sensitive environment files:
.env
.env.*
!.env.example    # Keep example file committed so others know the required keys!

# Ignore OS files:
.DS_Store
Thumbs.db
\`\`\`

### 💡 Pro Tip: How to untrack an already-committed file
If you accidentally committed a file that was later added to \`.gitignore\`:
\`\`\`bash
# Untrack without deleting from local hard drive:
git rm --cached .env

# Untrack entire folder:
git rm -r --cached bin/

git commit -m "chore: remove untracked build artifacts from git index"
\`\`\`

---

## 5. LICENSE (Open-Source Legal Protection)

If you create a public GitHub repository **without a license**, copyright law defaults to **"All rights reserved"**. This means other developers and companies legally cannot use, modify, copy, or contribute to your code!

### Top 3 Licenses Developers Must Know:

1. **MIT License (Permissive — Most Popular ⭐)**:
   - Super simple and short.
   - Anyone can use, copy, modify, distribute, and sell your code commercially.
   - **Requirement**: They must include your original copyright notice.
   - **Liability**: You offer zero warranty and bear zero legal liability.

2. **Apache 2.0 (Permissive with Patents)**:
   - Permissive like MIT, but provides an explicit grant of **patent rights** from contributors to users and protects against trademark infringement.
   - Popular among enterprise-grade frameworks (e.g., Kubernetes, Android).

3. **GNU General Public License v3 / GPLv3 (Copyleft)**:
   - Requires that any derivative software that incorporates your code **must also be released as 100% open-source under GPLv3**.
   - Used by the Linux Kernel and projects that want to prevent proprietary commercial closed-sourcing.

---

## 6. Repository Settings

The **Settings** tab contains critical levers for maintaining repository quality and security:

1. **Default Branch**:
   - Change the primary default branch from legacy \`master\` to modern standard \`main\`.
2. **Branch Protection Rules & Rulesets**:
   - **Require a pull request before merging**: Prevents anyone (even admins) from directly pushing commits to \`main\`.
   - **Require approvals**: Enforces that 1 or 2 peers review and approve the PR.
   - **Require status checks to pass before merging**: Ensures CI builds and automated unit tests pass before code can be merged.
   - **Do not allow force pushes**: Blocks \`git push --force\` on production branches.
3. **Collaborators & Access**:
   - Add team members with granular permission levels: **Read**, **Triage**, **Write**, **Maintain**, or **Admin**.
4. **Secrets and Variables (Actions)**:
   - Securely store encrypted secrets (e.g., \`DOCKER_PASSWORD\`, \`AWS_ACCESS_KEY_ID\`, \`DATABASE_URL\`) for automated CI/CD pipelines without exposing them in code.
5. **The Danger Zone**:
   - **Change repository visibility** (Public ⇄ Private).
   - **Transfer ownership** (moving repo to an organization or another user).
   - **Archive repository** (makes repo read-only).
   - **Delete repository** (permanent, irreversible).

---

## 7. Releases (Tags & Packaged Software)

While git commits represent raw changes, a **Release** represents a formal, deployable milestone of your software.

### Git Tag vs. GitHub Release:
* **Git Tag**: A pointer to a specific commit hash in Git history (e.g., \`v1.0.0\`).
* **GitHub Release**: A GitHub feature built on top of a Git tag that packages binary artifacts (e.g., \`.zip\`, \`.apk\`, \`.exe\`), includes formatted markdown release notes, and links directly to commit changelogs.

### Semantic Versioning (SemVer): \`vMAJOR.MINOR.PATCH\` (e.g., \`v2.4.1\`)
* **MAJOR (2.x.x)**: Breaking architectural or API changes (incompatible with previous version).
* **MINOR (x.4.x)**: New backward-compatible feature additions.
* **PATCH (x.x.1)**: Backward-compatible bug fixes and security patches.

### Creating a Tag & Release:
\`\`\`bash
# 1. Create an annotated tag on current commit:
git tag -a v1.0.0 -m "Release version 1.0.0 - initial production release"

# 2. Push the tag to GitHub:
git push origin v1.0.0
\`\`\`
3. In GitHub, go to **Releases** > **Draft a new release** > select tag \`v1.0.0\` > click **Generate release notes** > **Publish release**.

---

## 8. GitHub Profile (Your Engineering Personal Brand)

Your GitHub Profile is your technical calling card. A polished profile instantly separates you from hundreds of applicants.

### 1. The Secret Profile README:
* Create a **public** repository whose name is **identical to your GitHub username** (e.g., if your username is \`mostafakamal\`, create \`github.com/mostafakamal/mostafakamal\`).
* GitHub automatically renders the \`README.md\` of this repo at the very top of your public profile!

### 2. What to include in your Profile README:
* **Engaging Title & Elevator Pitch**: e.g., "Full-Stack Software Engineer specializing in high-concurrency .NET & Cloud Systems."
* **Tech Stack Badges**: Icons and badges for languages, databases, cloud providers, and tools you actively use.
* **Featured Projects**: Direct links to your top 3 repos with short descriptions of the architecture and problems solved.
* **Live GitHub Stats Cards**: Dynamic SVGs showing your commits, PRs, and top programming languages.
* **Contact & Socials**: Links to LinkedIn, Portfolio website, and technical blog.

### 3. Pinned Repositories:
* GitHub lets you pin up to **6 repositories** right below your bio.
* **Rules for Pinned Repos**:
  1. Only pin repositories that have a stellar \`README.md\`.
  2. Include a live working demo URL in the repo "About" section.
  3. Ensure code follows clean architecture with unit tests and a clear license.
`,
    contentBn: `# গিটহাব বেসিকস: রিপোজিটরি, README, .gitignore, লাইসেন্স, সেটিংস, রিলিজ ও প্রোফাইল

গিটহাব (GitHub) হলো সফটওয়্যার ইঞ্জিনিয়ারদের আন্তর্জাতিক জীবনবৃত্তান্ত (Living Engineering Resume)। দেশ-বিদেশের যেকোনো টেকনিক্যাল ইন্টারভিউ বা রিক্রুটমেন্টে প্রার্থীর যোগ্যতা যাচাইয়ের জন্য রিক্রুটাররা সর্বপ্রথম প্রার্থীর গিটহাব প্রোফাইল ও রিপোজিটরিগুলো পর্যবেক্ষণ করেন।

নিচে গিটহাবের মৌলিক ৮টি বিষয়ের বিস্তারিত ও সহজ ব্যাখ্যা তুলে ধরা হলো:

---

## ১. Creating a Repository (রিপোজিটরি তৈরি)

রিপোজিটরি (Repository বা সংক্ষেপে Repo) হলো আপনার প্রজেক্টের কোড, ফাইল, কমিট হিস্ট্রি ও আলোচনার মূল ডিজিটাল ঘর বা ফোল্ডার।

### রিপোজিটরি তৈরির পদ্ধতি:

#### পদ্ধতি ক: গিটহাব ওয়েব ইন্টারফেস
1. [GitHub](https://github.com)-এ লগইন করুন।
2. উপরের ডানদিকের **\`+\`** আইকনে ক্লিক করে **New repository** নির্বাচন করুন।
3. **Repository name**: ছোট হাতের অক্ষরে হাইফেন দিয়ে নাম দিন (kebab-case), যেমন \`hospital-management-api\`।
4. **Description**: প্রজেক্টটি কী কাজ করে তার ১ লাইনের সংক্ষিপ্ত বিবরণ দিন।
5. **প্রারম্ভিক অপশনসমূহ**:
   - **Add a README file**: নতুন প্রজেক্ট হলে টিক দিন।
   - **Add .gitignore**: আপনার প্রোগ্রামিং ভাষার টেমপ্লেট নির্বাচন করুন (যেমন \`Node\`, \`Python\`, বা \`VisualStudio\`)।
   - **Choose a license**: একটি ওপেন সোর্স লাইসেন্স বাছাই করুন (যেমন \`MIT License\`)।
6. **Create repository** বাটনে ক্লিক করুন।

#### পদ্ধতি খ: গিটহাব সিএলআই (\`gh\`) দিয়ে টার্মিনাল থেকেই রিপো তৈরি:
\`\`\`bash
gh repo create my-awesome-app --public --source=. --remote=origin --push
\`\`\`

#### লোকাল কোড নতুন খালি গিটহাব রিপোজিটরিতে যুক্ত করার নিয়ম:
\`\`\`bash
# ১. প্রজেক্ট ফোল্ডারে গিট চালু করুন:
git init -b main

# ২. ফাইল যোগ করে কমিট করুন:
git add .
git commit -m "feat: initial commit"

# ৩. গিটহাব রিমোট লিংক যোগ করে পুশ করুন:
git remote add origin git@github.com:username/my-awesome-app.git
git push -u origin main
\`\`\`

---

## ২. Public vs Private Repository (পাবলিক বনাম প্রাইভেট)

| বিষয় | পাবলিক রিপোজিটরি (Public) | প্রাইভেট রিপোজিটরি (Private) |
| :--- | :--- | :--- |
| **কারা দেখতে পারে?** | ইন্টারনেটের যেকেউ দেখতে পারে | শুধু আপনি ও আমন্ত্রিত সহকর্মীরা |
| **সার্চ ফলাফল** | গুগল ও গিটহাব সার্চে আসে | কোনো সার্চ ইঞ্জিনে আসবে না |
| **স্টার ও ফোর্ক** | যেকেউ স্টার বা ফোর্ক করতে পারে | বাইরের কেউ স্টার বা ফোর্ক করতে পারে না |
| **ব্যবহারের ক্ষেত্র** | পোর্টফোলিও, ওপেন-সোর্স লাইব্রেরি, ইন্টারভিউ প্রজেক্ট | কোম্পানির বাণিজ্যিক কোড, ফ্রিল্যান্স ক্লায়েন্টের কাজ |
| **চাকরির জন্য মূল্য** | ⭐⭐⭐⭐⭐ রিক্রুটার সরাসরি কোড দেখতে পান | রিক্রুটার কিছুই দেখতে পান না |

> [!CAUTION]
> **নিরাপত্তা সতর্কতা**: কোনো প্রাইভেট রিপোজিটরিকে পরবর্তীতে পাবলিক করার আগে নিশ্চিত হোন যে কোনো কমিটে আপনার ডাটাবেজ পাসওয়ার্ড, ক্লাউড সিক্রেট বা এপিআই কী রয়ে যায়নি! পাবলিক করামাত্র সম্পূর্ণ হিস্ট্রি উন্মুক্ত হয়ে যায়।

---

## ৩. README.md (প্রজেক্টের মূল পরিচিতিপত্র)

একটি প্রজেক্টে \`README.md\` না থাকা মানে সাইনবোর্ড ছাড়া দোকান খোলার মতো। রিক্রুটার বা অন্য কোনো ডেভেলপার আপনার প্রজেক্টে ঢুকে যদি বুঝতে না পারেন যে প্রজেক্টটি কী করে বা কীভাবে রান করতে হয়, তবে তিনি ৫ সেকেন্ডের মধ্যে ট্যাব বন্ধ করে দেবেন।

### একটি স্ট্যান্ডার্ড ও আকর্ষণীয় README-এর গঠন:
1. **প্রজেক্টের নাম ও ব্যাজ (Badges)**: বিল্ড স্ট্যাটাস, লাইসেন্স ও ফ্রেমওয়ার্ক ভার্সনের কালারফুল ব্যাজ।
2. **এক লাইনের ভূমিকা (Elevator Pitch)**: প্রজেক্টটি কেন তৈরি করা হয়েছে এবং কী সমস্যা সমাধান করে।
3. **মূল ফিচারসমূহ (Key Features)**: বুলেট পয়েন্টে মূল কার্যকারিতা।
4. **সিস্টেম আর্কিটেকচার ডায়াগ্রাম**: প্রজেক্টের ব্যাকএন্ড, ফ্রন্টএন্ড ও ডাটাবেজের ফ্লো ডায়াগ্রাম।
5. **টেক স্ট্যাক (Tech Stack)**: ব্যবহৃত ভাষা, ফ্রেমওয়ার্ক ও ডাটাবেজের তালিকা।
6. **লোকাল সেটআপ গাইড (Getting Started)**:
   - প্রয়োজনীয় সফটওয়্যার (যেমন Node.js, Docker, .NET SDK)।
   - গিট ক্লোন, ডিপেনডেন্সি ইনস্টল, \`.env\` সেটআপ এবং রান করার কমান্ড।
7. **এপিআই এন্ডপয়েন্ট টেবিল**: মেথড, রুট এবং ডেসক্রিপশনসহ টেবিল।
8. **টেস্ট চালানোর নির্দেশিকা**: ইউনিট টেস্ট রান করার কমান্ড।
9. **লাইসেন্স তথ্য**: ওপেন সোর্স লাইসেন্সের উল্লেখ।

---

## ৪. .gitignore (অপ্রয়োজনীয় ফাইল ও সিক্রেট বাদ দেওয়া)

গিট ডিফল্টভাবে ফোল্ডারের সবকিছু ট্র্যাক করতে চায়। কিন্তু প্রজেক্টের বিল্ড ফাইল বা সিক্রেট কি কখনোই গিটে রাখা উচিত নয়। প্রজেক্টের রুট ডিরেক্টরিতে \`.gitignore\` নামক একটি টেক্সট ফাইল রেখে আমরা গিটকে জানিয়ে দিই কোন কোন ফাইল বা ফোল্ডার সে কখনো ট্র্যাক করবে না।

### কোন ফাইলগুলো অবশ্যই .gitignore-এ রাখবেন?
1. **ভারী প্যাকেজ ও ডিপেনডেন্সি**: \`node_modules/\`, \`packages/\`, \`vendor/\` (এগুলো প্যাকেজ ম্যানেজার দিয়ে ইনস্টল হয়)।
2. **কম্পাইল করা বিল্ড ফাইল**: \`bin/\`, \`obj/\`, \`dist/\`, \`build/\`, \`*.dll\`, \`*.exe\`।
3. **এনভায়রনমেন্ট ও পাসওয়ার্ড ফাইল**: \`.env\`, \`.env.local\`, \`appsettings.Development.json\`।
4. **অপারেটিং সিস্টেমের ফাইল**: \`.DS_Store\` (Mac), \`Thumbs.db\` (Windows)।
5. **এডিটর কনফিগারেশন**: \`.vscode/\`, \`.idea/\`।

### সিনট্যাক্স উদাহরণ:
\`\`\`gitignore
# বিল্ড ফোল্ডার বাদ দিতে:
bin/
obj/
dist/

# নোড মডিউলস বাদ দিতে:
node_modules/

# সিক্রেট এনভায়রনমেন্ট ফাইল বাদ দিতে:
.env
.env.*
!.env.example    # তবে উদাহরণ ফাইলটি কমিট রাখুন যাতে অন্যরা বুঝতে পারে কোন কোন কি প্রয়োজন!
\`\`\`

### ভুলবশত কমিট হওয়া ফাইল গিট ইনডেক্স থেকে সরানোর নিয়ম:
\`\`\`bash
# হার্ডডিস্কের ফাইল ডিলিট না করে কেবল গিট ট্র্যাকিং থেকে বাদ দিতে:
git rm --cached .env
git commit -m "chore: remove .env from git tracking"
\`\`\`

---

## ৫. LICENSE (ওপেন-সোর্স লাইসেন্স ও আইনি সুরক্ষা)

আপনি যদি গিটহাবে কোনো পাবলিক রিপোজিটরি তৈরি করেন কিন্তু কোনো লাইসেন্স যুক্ত না করেন, তবে আন্তর্জাতিক কপিরাইট আইন অনুযায়ী স্বয়ংক্রিয়ভাবে **"All rights reserved"** প্রযোজ্য হয়। এর অর্থ হলো অন্যরা আপনার কোড দেখতে পারলেও আইনিভাবে তা ব্যবহার, সংশোধন বা কোথাও চালাতে পারবে না!

### শীর্ষ ৩টি ওপেন-সোর্স লাইসেন্স:

1. **MIT License (সবচেয়ে জনপ্রিয় ও নমনীয় ⭐)**:
   - অত্যন্ত সহজ ও সংক্ষিপ্ত লাইসেন্স।
   - যেকেউ আপনার কোড দেখতে, পরিবর্তন করতে, বিক্রি করতে এবং নিজের বাণিজ্যিক প্রজেক্টে ব্যবহার করতে পারে।
   - **শর্ত**: তারা আপনার মূল কপিরাইট নোটিশটি রেখে দেবে।
   - **দায়মুক্তি**: কোড ব্যবহারে কোনো ক্ষতি হলে আপনার কোনো আইনি দায় থাকবে না।

2. **Apache 2.0 License (পেটেন্ট সুরক্ষাসহ নমনীয়)**:
   - MIT লাইসেন্সের মতোই উদার, তবে এটি ব্যবহারকারীকে স্পষ্ট **পেটেন্ট ব্যবহারের অধিকার** দেয় এবং মূল নির্মাতার ট্রেডমার্ক সুরক্ষার নিয়ম যুক্ত করে। (যেমন Kubernetes, Android)।

3. **GNU General Public License v3 / GPLv3 (কপিরেফট বা বাধ্যতামূলক ওপেন-সোর্স)**:
   - যেকেউ আপনার কোড ব্যবহার বা পরিবর্তন করতে পারে, তবে শর্ত হলো তার প্রজেক্টটিও বাধ্যতামূলকভাবে **১০০% ওপেন-সোর্স হিসেবে GPLv3 লাইসেন্সে প্রকাশ করতে হবে** (Linux কার্নেল মডেল)।

---

## ৬. Repository Settings (রিপোজিটরি কনফিগারেশন)

গিটহাব রিপোজিটরির **Settings** ট্যাবে প্রজেক্টের মান ও নিরাপত্তা বজায় রাখার জন্য বেশ কিছু গুরুত্বপূর্ণ অপশন থাকে:

1. **Default Branch**: মূল ব্রাঞ্চের নাম নির্ধারণ (যেমন পুরনো \`master\` থেকে আধুনিক স্ট্যান্ডার্ড \`main\`-এ পরিবর্তন)।
2. **Branch Protection Rules (বা Rulesets)**:
   - **Require a pull request before merging**: কাউকে সরাসরি \`main\` ব্রাঞ্চে পুশ করতে দেয় না; বাধ্যতামূলক পিআর করতে হয়।
   - **Require approvals**: ১ বা ২ জন টিমমেটের অ্যাপ্রুভাল ছাড়া পিআর মার্জ হতে দেয় না।
   - **Require status checks to pass**: স্বয়ংক্রিয় টেস্ট ও সিআই বিল্ড পাস না করলে মার্জ বাটন লক থাকে।
   - **Do not allow force pushes**: প্রোডাকশন ব্রাঞ্চে ডেসট্রাক্টিভ ফোর্স পুশ পুরোপুরি ব্লক করে।
3. **Collaborators & Teams**: টিম মেম্বারদের নির্দিষ্ট পারমিশন দিয়ে যুক্ত করা (যেমন Read, Write, Admin)।
4. **Secrets and Variables (Actions)**: ক্লাউড ডিপ্লয়মেন্ট পাসওয়ার্ড ও এপিআই কি নিরাপদে সংরক্ষণ করা।
5. **Danger Zone**: রিপোজিটরির ভিজিবিলিটি বদলানো (Public ⇄ Private), মালিকানা অন্যকে ট্রান্সফার করা এবং প্রয়োজনে রিপো ডিলিট করা।

---

## ৭. Releases (ট্যাগ ও সফটওয়্যার প্যাকেজ রিলিজ)

গিটহাবে সফটওয়্যারের একটি নির্দিষ্ট ভার্সন বা মাইলস্টোনকে প্রাতিষ্ঠানিকভাবে পাবলিশ করার নাম হলো **Release**।

### গিট ট্যাগ বনাম গিটহাব রিলিজ:
* **Git Tag**: গিটের একটি নির্দিষ্ট কমিটের উপর দেওয়া স্থায়ী লেবেল বা পয়েন্টার (যেমন \`v1.0.0\`)।
* **GitHub Release**: গিট ট্যাগের ওপর ভিত্তি করে তৈরি একটি প্যাকেজ যেখানে রিলিজ নোটস (চেঞ্জলগ) এবং ডাউনলোডযোগ্য বাইনারি ফাইল (\`.zip\`, \`.apk\`, \`.exe\`) যুক্ত থাকে।

### সিমান্টিক ভার্সনিং (Semantic Versioning / SemVer): \`vMAJOR.MINOR.PATCH\`
* **MAJOR (\`v2.0.0\`)**: ব্রেকিং চেঞ্জ (পুরনো ভার্সনের সাথে সামঞ্জস্যপূর্ণ নয় এমন পরিবর্তন)।
* **MINOR (\`v1.1.0\`)**: নতুন ফিচার যোগ করা হয়েছে (যা পুরনো কোড ভাঙবে না)।
* **PATCH (\`v1.0.1\`)**: কোনো বাগ ফিক্স বা ছোটখাটো নিরাপত্তা সমাধান।

\`\`\`bash
# টার্মিনাল থেকে ট্যাগ তৈরি ও পুশ:
git tag -a v1.0.0 -m "Release v1.0.0 - initial stable version"
git push origin v1.0.0
\`\`\`

---

## ৮. GitHub Profile (প্রফেশনাল ডিজিটাল ব্র্যান্ডিং)

আপনার গিটহাব প্রোফাইল হলো আপনার প্রোগ্রামিং দক্ষতার সরাসরি প্রতিচ্ছবি। একটি আকর্ষণীয় প্রোফাইল চাকরির ইন্টারভিউতে আপনাকে অন্যদের চেয়ে অনেক এগিয়ে রাখে।

### ১. সিক্রেট প্রোফাইল README:
* আপনার গিটহাবের ইউজারনেমের হুবহু একই নামে একটি **পাবলিক রিপোজিটরি** খুলুন (যেমন ইউজারনেম \`mostafakamal\` হলে রিপোজিটরির নাম হবে \`mostafakamal\`)।
* এই রিপোজিটরিতে রাখা \`README.md\` ফাইলটি আপনার মূল গিটহাব প্রোফাইলের সবার উপরে চমৎকারভাবে প্রদর্শিত হবে!

### ২. প্রোফাইল README-তে কী কী রাখবেন?
* **সংক্ষিপ্ত প্রফেশনাল পরিচিতি**: আপনি কোন ডোমেনে কাজ করতে পছন্দ করেন (যেমন "Full-Stack Engineer passionate about Cloud & Distributed Systems")।
* **টেক স্ট্যাক আইকন/ব্যাজ**: আপনি যেসকল প্রোগ্রামিং ভাষা, ফ্রেমওয়ার্ক, ডাটাবেজ এবং ক্লাউড প্রযুক্তি পারেন তার ব্যাজ।
* **ফিচার্ড প্রজেক্ট**: আপনার তৈরি সেরা ২-৩টি প্রজেক্টের আর্কিটেকচার হাইলাইটস ও লাইভ ডেমো লিংক।
* **ডাইনামিক গিটহাব স্ট্যাটাস উইজেট**: আপনার কমিট স্ট্রিক, পিআর কাউন্ট এবং টপ ল্যাঙ্গুয়েজ গ্রাফ।
* **কানেক্ট লিংক**: LinkedIn, পার্সোনাল পোর্টফোলিও ওয়েবসাইট ও ইমেইল।

### ৩. পিন করা রিপোজিটরি (Pinned Repositories):
* প্রোফাইলে সর্বোচ্চ **৬টি সেরা রিপোজিটরি** পিন করে রাখুন।
* প্রতিটি পিন করা রিপোজিটরিতে যেন চমৎকার \`README.md\`, লাইসেন্স এবং লাইভ সাইট ডেমো ইউআরএল যুক্ত থাকে।
`,
  };
