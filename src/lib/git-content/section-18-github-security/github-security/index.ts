import type { LocalLesson } from "@/lib/lessons-data";

export const githubSecurityLesson: LocalLesson = {
    slug: "github-security",
    titleEn: "GitHub Security: Secrets Prevention, API Keys, Passwords, Scanning, Dependabot & Branch Rules",
    titleBn: "গিটহাব সিকিউরিটি: সিক্রেট লিক প্রতিরোধ, এপিআই কি, পাসওয়ার্ড, স্ক্যানিং, ডিপেন্ডাবট ও ব্রাঞ্চ রুলস",
    categoryEn: "18. GitHub Security & Governance",
    categoryBn: "১৮. গিটহাব সিকিউরিটি ও গভর্নেন্স",
    categoryDescEn: "Definitive guide to eliminating committed secrets, protecting API keys & database passwords, environment variables hygiene, Secret Scanning with Push Protection, automated Dependabot CVE patches, enterprise Branch Protection rules, and RBAC repository permissions.",
    categoryDescBn: "কমিট করা সিক্রেট প্রতিরোধ, এপিআই কি ও ডাটাবেজ পাসওয়ার্ড সুরক্ষা, এনভায়রনমেন্ট ভেরিয়েবলস হাইজিন, পুশ প্রটেকশন সিক্রেট স্ক্যানিং, ডিপেন্ডাবট সিভিসি প্যাচ, ব্রাঞ্চ প্রটেকশন রুলস এবং রিপোজিটরি পারমিশন রোলস।",
    categoryPriority: "ESSENTIAL",
    descriptionEn: "Master enterprise repository security: eliminate committed secrets, configure automated Dependabot vulnerability patches, enforce strict branch protections, and manage team permissions.",
    descriptionBn: "এন্টারপ্রাইজ রিপোজিটরি নিরাপত্তা নিশ্চিত করুন: গোপন কি ও পাসওয়ার্ড লিক প্রতিরোধ, ডিপেন্ডাবট ভালনারেবিলিটি স্ক্যান, ব্রাঞ্চ প্রটেকশন রুলস এবং টিম পারমিশন ম্যানেজমেন্ট।",
    difficulty: "MEDIUM",
    displayOrder: 18,
    prerequisites: ["github-basics"],
    estimatedMinutes: 30,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "About Secret Scanning and Push Protection",
        url: "https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning",
        description: "Official guide on secret scanning, supported partner tokens, and Push Protection.",
        isStarred: true,
      },
      {
        source: "GitHub Docs",
        title: "About Branch Protection Rules and Rulesets",
        url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
        description: "Official guide to preventing unreviewed pushes and enforcing CI checks on production branches.",
        isStarred: true,
      },
      {
        source: "GitHub Docs",
        title: "About Dependabot Alerts and Security Updates",
        url: "https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts",
        description: "Guide to automated dependency vulnerability alerts and pull requests.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Interview",
        name: "A developer accidentally pushed a commit containing an AWS production IAM key and database credentials to a public GitHub repo. What exact 4-step emergency incident response plan must you execute immediately?",
        url: null,
        difficulty: "HARD",
        company: "Optimizely / Brain Station 23",
        tags: ["GitHub", "Security", "Secret Leaks", "Incident Response", "DevSecOps"],
        solutionEn: "1. IMMEDIATELY REVOKE & ROTATE: Go to the AWS IAM console and database, revoke/delete the compromised keys immediately, and issue new credentials (assume public scrapers stole the keys within 30 seconds). 2. AUDIT LOGS: Review AWS CloudTrail and DB access logs to check for unauthorized data access or resource provisioning. 3. PURGE GIT HISTORY: Use 'git-filter-repo' or BFG Repo-Cleaner to scrub the sensitive file from all commits, branches, and tags, followed by an aggressive garbage collection ('git gc --prune=now') and force-pushing sanitized history to remote. Merely deleting the file in a new commit leaves the secret readable in past commits! 4. POST-MORTEM & PREVENTION: Enable GitHub Push Protection and install local pre-commit hooks (like gitleaks).",
        solutionBn: "১. সাথে সাথে কি রিভোক ও রোটেট করুন: ক্লাউড ড্যাশবোর্ড ও ডাটাবেজে গিয়ে লিক হওয়া কি তাৎক্ষণিকভাবে ডিলিট করে নতুন কি জেনারেট করুন (মনে রাখবেন পাবলিক গিটহাবে পুশ হওয়ামাত্র ৩০ সেকেন্ডের মধ্যে রোবটরা কি কপি করে ফেলে)। ২. ক্লাউড অডিট লগ চেক করুন: কোনো অনাকাঙ্ক্ষিত রিসোর্স তৈরি বা ডাটা চুরি হয়েছে কিনা ক্লাউডট্রেলে যাচাই করুন। ৩. সম্পূর্ণ গিট হিস্ট্রি স্ক্রাব করুন: BFG বা 'git-filter-repo' দিয়ে অতীতের সমস্ত কমিট থেকে ফাইলটি চিরতরে মুছে ফেলে ফোর্স পুশ করুন (শুধু নতুন কমিটে ফাইল ডিলিট করলে পেছনের হিস্ট্রিতে সিক্রেট ওপেন থাকে)। ৪. পুশ প্রটেকশন ও প্রি-কমিট হুক (gitleaks) চালু করুন যাতে ভবিষ্যতে এমন ভুল না ঘটে।",
      },
    ],
    contentEn: `# 18. GitHub Security: Enterprise Secrets & Repository Protection

A single leaked API key, database connection string, or unreviewed push to the production branch can bankrupt a company or cause catastrophic data breaches within minutes. 

---

## 1. Never Commit Secrets (The Cardinal Rule of Version Control)

### Why Git Commit History is Permanent:
Git is an append-only directed acyclic graph (DAG). When you make a commit containing a secret, Git permanently compresses that file into its object database.
> ⚠️ **The Fatal Mistake:** If you make a second commit that deletes \`.env\`, **the secret is STILL 100% VISIBLE in the previous commit's history!** Anyone can view it by running \`git checkout HEAD~1\` or viewing the commit on GitHub.

### Automated Scraping Bots:
Public GitHub repositories are continuously monitored in real-time by thousands of automated threat-actor bots. If an active AWS, Stripe, or SendGrid key is pushed publicly:
* It is typically discovered and exploited within **30 to 90 seconds**.
* Common attacks: Spin up hundreds of expensive GPU cryptocurrency mining instances on AWS, send millions of phishing emails via SendGrid, or drain funds via Stripe.

### Local Prevention: Pre-Commit Hooks
Block secrets before they ever leave your laptop:
\`\`\`bash
# Install Gitleaks
brew install gitleaks

# Run local scan across repository
gitleaks detect --verbose

# Add pre-commit hook in .git/hooks/pre-commit
gitleaks protect --staged
\`\`\`

---

## 2. API Keys (Managing Third-Party Credentials)

### What Qualifies as an API Key?
* Payment gateways: Stripe Secret Key (\`sk_live_...\`), PayPal API credentials.
* LLM providers: OpenAI API Key (\`sk-proj-...\`), Anthropic keys.
* Cloud services: AWS Access Key ID & Secret (\`AKIA...\`), Google Cloud service account JSON keys.
* Communication APIs: Twilio Auth Tokens, SendGrid API keys.

### Security Best Practices:
1. **Restrict Key Scope:** Never use root/admin API keys in client apps. Create restricted keys with minimal permissions (e.g. read-only, specific IP whitelisting).
2. **Key Rotation Schedules:** Rotate API keys every 90 days.
3. **Environment Segregation:** Use completely different keys for Development, Staging, and Production.

---

## 3. Passwords (Database & Service Credentials)

### Dangerous Anti-Patterns:
\`\`\`csharp
// ❌ NEVER DO THIS in source code:
var connectionString = "Server=db.prod.internal;Database=master;User Id=sa;Password=SuperSecretPassword123!;";
\`\`\`

### The Solution: Cloud Secrets Managers & Injection
In modern architectures, passwords are never stored in files. They are fetched at runtime or injected via environment variables:
* **Cloud Secrets Managers:** AWS Secrets Manager, HashiCorp Vault, Azure Key Vault, Doppler.
* **Platform Injection:** Vercel Environment Variables, Kubernetes Secrets, GitHub Actions Secrets.

---

## 4. Environment Variables (The .env Hygiene)

### The \`.env\` vs \`.env.example\` Pattern:
* \`.env\` (Local secret file): Added to \`.gitignore\`. Stores actual local credentials.
* \`.env.example\` (Committed blueprint): Contains zero secrets; only lists required variable names so new developers know what to configure.

\`\`\`bash
# .env.example (Safe to commit to Git)
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/mydb
JWT_SECRET=replace_with_random_32_chars
STRIPE_PUBLISHABLE_KEY=pk_test_sample
\`\`\`

### Verifying Gitignore Coverage:
Ensure your \`.gitignore\` covers all environment file permutations:
\`\`\`gitignore
.env
.env*.local
.env.development
.env.test
.env.production
.env.staging
\`\`\`

---

## 5. Secret Scanning & Push Protection

### What is GitHub Secret Scanning?
GitHub continuously scans public (and opted-in private) repositories for known secret formats. 
* **Partner Program:** GitHub partners with over 100 cloud providers (AWS, Stripe, Google Cloud, Slack, Microsoft).
* When GitHub detects a leaked key, it automatically alerts the issuing partner. The partner immediately revokes the key or notifies the account owner!

### Push Protection (⭐ The Ultimate Shield):
Push Protection intercepts the push **at the network level** before the commit even reaches GitHub's servers:
1. Go to repository **Settings** > **Code security and analysis**.
2. Under **Secret scanning**, check **Push protection** (Enable).
3. If a developer runs \`git push\` containing a recognized secret, Git aborts the push with a terminal error:
   \`\`\`text
   remote: error: GH013: Repository rule violations found for refs/heads/feature.
   remote: Review which secrets were found:
   remote:  - AWS Access Key ID (line 42 in src/config.js)
   remote: To push, remove the secret from your commit history.
   \`\`\`

---

## 6. Dependabot (Automated Supply Chain Security)

Modern applications depend on hundreds of open-source packages (via \`npm\`, \`NuGet\`, \`pip\`, \`Maven\`). Vulnerabilities in third-party libraries (CVEs) represent the #1 attack vector for supply-chain attacks.

### Dependabot Features:
1. **Dependabot Alerts:** Scans your dependency lockfiles (\`package-lock.json\`, \`packages.lock.json\`) and notifies you when a dependency has a critical security vulnerability.
2. **Dependabot Security Updates:** Automatically opens a Pull Request updating the vulnerable package to the minimum safe version with zero breaking changes.
3. **Dependabot Version Updates (\`.github/dependabot.yml\`):** Regularly updates all dependencies to their latest stable releases:

\`\`\`yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
\`\`\`

---

## 7. Branch Protection Rules & Rulesets

In enterprise software engineering, direct pushes to production branches are strictly forbidden.

### Recommended Rules for \`main\`:
1. **Require a Pull Request before merging:**
   * Require at least 1 or 2 approving code reviews.
   * Dismiss stale pull request approvals when new commits are pushed.
2. **Require status checks to pass before merging:**
   * Enforce that GitHub Actions CI test suites must be 100% green.
3. **Require conversation resolution before merging:**
   * All review comments and discussions must be resolved.
4. **Do not allow bypassing the above settings:**
   * Enforces rules equally on administrators and repository owners.
5. **Disable Force Pushes & Deletions:**
   * Prevents destructive \`git push --force\` from overwriting production history.

---

## 8. Repository Permissions (Role-Based Access Control - RBAC)

Grant access based on the **Principle of Least Privilege (Zero Trust)**:

| Permission Role | Allowed Actions | Ideal For |
| :--- | :--- | :--- |
| **Read** | Clone, view issues, open discussions, pull code | External contractors, junior interns |
| **Triage** | Manage issues, apply labels, close bugs (no code write) | QA engineers, product managers |
| **Write** | Push to feature branches, open PRs, create branches | Core software developers |
| **Maintain** | Manage repo settings, protected branches, milestones | Tech leads, engineering managers |
| **Admin** | Full control: delete repo, manage secrets, transfer repo | Senior DevOps, CTO |

---

## 📋 Emergency Incident Response Playbook

If a secret is accidentally committed and pushed publicly:
\`\`\`bash
# Step 1: REVOKE IMMEDIATELY on Cloud Console (AWS / Stripe)

# Step 2: PURGE HISTORICAL COMMITS using BFG Repo-Cleaner
bfg --delete-files .env

# Step 3: EXPIRE REFLOG AND CLEAN ORPHANED OBJECTS
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Step 4: FORCE PUSH CLEANED HISTORY
git push origin --force --all
git push origin --force --tags
\`\`\`
`,
    contentBn: `# ১৮. গিটহাব সিকিউরিটি ও গভর্নেন্স (GitHub Security & Governance)

একটি অসাবধানতামূলক এপিআই কি (API Key), ডাটাবেজ পাসওয়ার্ড লিক হওয়া কিংবা প্রোডাকশন ব্রাঞ্চে অপরীক্ষিত কোড সরাসরি পুশ হওয়া কোনো কোম্পানির কোটি টাকার আর্থিক ক্ষতি বা সুনাম ধ্বংস করে দিতে পারে।

---

## ১. Never Commit Secrets (কখনোই সিক্রেট কমিট করবেন না)

### 🔹 গিট হিস্ট্রি চিরস্থায়ী (Immutable History):
Git একটি স্থায়ী অবজেক্ট গ্রাফ হিস্ট্রি মেনে চলে। আপনি যদি ভুল করে কোনো পাসওয়ার্ড বা এপিআই কি কমিট করে ফেলেন, তবে তা Git-এর ইন্টারনাল অবজেক্ট ডেটাবেজে স্থায়ীভাবে সেভ হয়ে যায়।
> ⚠️ **মারাত্মক ভুল ধারণা:** অনেকে ভুল বুঝতে পেরে নতুন আরেকটি কমিট দিয়ে ফাইলটি ডিলিট করেন বা পরে \`.gitignore\`-এ যোগ করেন। **এতে সমস্যা বিন্দুমাত্র মেটে না!** কারণ আগের কমিটের হিস্ট্রিতে (\`git checkout HEAD~1\`) পাসওয়ার্ডটি হুবহু আগের মতোই রয়ে যায়।

### 🔹 হ্যাকারদের অটোমেটিক স্ক্র্যাপার রোবট (Bot Scrapers):
পাবলিক গিটহাব রিপোজিটরির প্রতিটি নতুন কমিট চব্বিশ ঘণ্টা অটোমেটিক বটের মাধ্যমে স্ক্যান হয়। আপনি কোনো AWS, OpenAI বা Stripe কি পাবলিক রিপোতে পুশ করার **৩০ থেকে ৯০ সেকেন্ডের মধ্যে** রোবটরা তা কপি করে ফেলে!
* হ্যাকাররা চুরি করা AWS কি দিয়ে নিমেষেই হাজার হাজার ডলারের ক্রিপ্টো মাইনিং সার্ভার চালু করে দেয়।

### 🔹 লোকাল মেশিনে সিক্রেট প্রতিরোধ (Pre-commit Hooks):
কমিট করার আগেই পিসিতে সিক্রেট স্ক্যান করতে \`gitleaks\` ব্যবহার করুন:
\`\`\`bash
# গিটলিক্স ইনস্টল করুন
brew install gitleaks

# কমিট করার আগে স্টেজড ফাইলে সিক্রেট আছে কিনা স্ক্যান করুন
gitleaks protect --staged
\`\`\`

---

## ২. API Keys (এপিআই কি নিরাপত্তা)

### 🔹 এপিআই কি কী?
* পেমেন্ট গেটওয়ে: Stripe Secret Key (\`sk_live_...\`), বিকাশ বা এসএসএলকমার্জ ক্রেডেনশিয়াল।
* ক্লাউড সেবা: AWS Access Key ID ও Secret Key (\`AKIA...\`), গুগল ক্লাউড সার্ভিস একাউন্ট কি।
* এআই ও মেসেজিং: OpenAI এপিআই কি, Twilio বা SendGrid টোকেন।

### 🔹 সুরক্ষার গোল্ডেন রুলস:
1. **ন্যূনতম পারমিশন (Principle of Least Privilege):** ক্লায়েন্ট বা ব্রাউজার অ্যাপ্লিকেশনে কখনোই অ্যাডমিন বা সিক্রেট কি ব্যবহার করবেন না। শুধু নির্দিষ্ট আইপি বা ডোমেইন সীমাবদ্ধ করে কি তৈরি করুন।
2. **নিয়মিত কি রোটেশন (Key Rotation):** প্রতি ৯০ দিন পরপর পুরোনো এপিআই কি বাতিল করে নতুন কি চালু করুন।
3. **পরিবেশ বিভাজন:** ডেভেলপমেন্ট, স্টেজিং এবং প্রোডাকশনের জন্য সম্পূর্ণ আলাদা কি ব্যবহার করুন।

---

## ৩. Passwords (ডাটাবেজ ও সার্ভিস পাসওয়ার্ড)

### ❌ কোডের ভেতর যা কখনোই করা যাবে না:
\`\`\`csharp
// সোর্স কোডে কখনোই হার্ডকোডেড পাসওয়ার্ড লিখবেন না:
string conn = "Server=mydb.com;User=admin;Password=MySecretPassword123!;";
\`\`\`

### 🔹 সঠিক সমাধান: ক্লাউড সিক্রেটস ম্যানেজার
প্রফেশনাল সফটওয়্যার আর্কিটেকচারে পাসওয়ার্ড ফাইলে রাখা হয় না; রানটাইমে সার্ভারের ক্লাউড ভল্ট থেকে সরাসরি ইনজেক্ট করা হয়:
* **ক্লাউড ভল্ট:** AWS Secrets Manager, HashiCorp Vault, Doppler, Azure Key Vault।
* **ক্লাউড প্ল্যাটফর্ম:** Vercel Environment Variables, Render Secrets, Kubernetes Secrets।

---

## ৪. Environment Variables (.env ও সিক্রেট হাইজিন)

### 🔹 \`.env\` বনাম \`.env.example\` প্যাটার্ন:
* \`.env\` (লোকাল সিক্রেট ফাইল): এটি \`.gitignore\`-এ থাকবে। এখানে আপনার কম্পিউটারের আসল পাসওয়ার্ড থাকবে।
* \`.env.example\` (ব্লুপ্রিন্ট টেমপ্লেট): এটি গিটহাবে কমিট হবে। এতে কোনো আসল পাসওয়ার্ড থাকবে না, শুধু ভেরিয়েবলের নাম থাকবে যাতে নতুন ডেভেলপার বুঝতে পারেন কী কী কনফিগার করতে হবে।

\`\`\`bash
# .env.example (গিটহাবে পুশ করার জন্য নিরাপদ)
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/mydb
JWT_SECRET=your_super_secret_jwt_key_here
STRIPE_KEY=pk_test_dummy_key
\`\`\`

### 🔹 \`.gitignore\` নিশ্চিত করুন:
\`\`\`gitignore
.env
.env*.local
.env.development
.env.production
\`\`\`

---

## ৫. Secret Scanning ও Push Protection

### 🔹 গিটহাব সিক্রেট স্ক্যানিং কী?
GitHub বিশ্বজুড়ে ১০০টিরও বেশি শীর্ষ ক্লাউড প্রোভাইডারের (AWS, Google Cloud, Stripe, Slack, Microsoft) সাথে পার্টনারশিপ করেছে। কোনো রিপোজিটরিতে এদের চেনা সিক্রেট লিক হওয়ামাত্র গিটহাব সংশ্লিষ্ট কোম্পানিকে অটোমেটিক নোটিফিকেশন পাঠায় এবং কোম্পানি সাথে সাথে কি বাতিল করে একাউন্ট রক্ষা করে।

### 🔹 পুশ প্রটেকশন (Push Protection — ⭐ গেম চেঞ্জার):
গিটহাব রিপোজিটরির **Settings** > **Code security and analysis** থেকে **Push protection** অন করে রাখুন।
* কোনো ডেভেলপার ভুলবশত কোনো সিক্রেট বা এপিআই কি পুশ করতে গেলে, **গিটহাব টার্মিনাল থেকেই পুশ আটকে দেয়** এবং সার্ভারে কমিট আপলোড হতে দেয় না!

---

## ৬. Dependabot (স্বয়ংক্রিয় ভালনারেবিলিটি প্যাচিং)

আধুনিক সফটওয়্যারের ৮০-৯০% কোডই আসে থার্ড পার্টি ওপেন সোর্স প্যাকেজ (যেমন: npm, NuGet, pip) থেকে। পুরোনো প্যাকেজে কোনো সিকিউরিটি ত্রুটি (CVE) থাকা মানে পুরো প্রজেক্ট হ্যাকিংয়ের ঝুঁকিতে পড়া।

### 🔹 ডিপেন্ডাবটের ৩টি প্রধান সুবিধা:
1. **Dependabot Alerts:** আপনার \`package-lock.json\` স্ক্যান করে কোনো প্যাকেজে ত্রুটি থাকলে লাল সতর্কবার্তা দেয়।
2. **Dependabot Security Updates:** সমাধান বের হওয়ামাত্র ডিপেন্ডাবট নিজে থেকেই একটি রেডিমেড পুল রিকোয়েস্ট (PR) ওপেন করে দেয়।
3. **Dependabot Version Updates (\`.github/dependabot.yml\`):** প্রতি সপ্তাহে সমস্ত প্যাকেজের লেটেস্ট ভার্সন চেক করে আপডেট পিআর পাঠায়:

\`\`\`yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
\`\`\`

---

## ৭. Branch Protection Rules (ব্রাঞ্চ সুরক্ষা রুলস)

প্রোডাকশন \`main\` ব্রাঞ্চে সরাসরি আন-রিভিউড পুশ করা সম্পূর্ণ নিষিদ্ধ করার জন্য ব্রাঞ্চ প্রটেকশন রুল ব্যবহার করা হয়:

1. **Require a pull request before merging:** সরাসরি পুশ বন্ধ; বাধ্যতামূলকভাবে পিআরের মাধ্যমে কোড আসতে হবে এবং অন্তত ১ বা ২ জন সিনিয়র ইঞ্জিনিয়ারের এপ্রুভাল লাগতে হবে।
2. **Require status checks to pass before merging:** গিটহাব অ্যাকশনসের সমস্ত অটোমেটিক টেস্ট পাস না হওয়া পর্যন্ত মার্জ বাটন লক থাকবে।
3. **Do not allow bypassing the above settings:** কোম্পানির সিটিও বা অ্যাডমিনও যাতে টেস্ট ছাড়া বাইপাস করে কোড পুশ করতে না পারেন।
4. **Disable force pushes & deletions:** ভুলেও যেন কেউ \`git push --force\` দিয়ে প্রোডাকশন কোড মুছে দিতে না পারে।

---

## ৮. Repository Permissions (টিম রোল ও পারমিশন)

টিমের সদস্যদের কাজের পরিধি অনুযায়ী অনুমতি বরাদ্দ করুন:

| রোল (Role) | অনুমোদিত কাজসমূহ | কাদের জন্য উপযোগী |
| :--- | :--- | :--- |
| **Read** | কোড ক্লোন করা, দেখা, ইস্যু ওপেন করা (পুশ নিষেধ) | নতুন ইন্টার্ন, এক্সটার্নাল অডিটর |
| **Triage** | ইস্যু ও পিআরে লেবেল লাগানো, ক্লোজ করা (কোড এডিট নিষেধ) | কিউএ (QA) ইঞ্জিনিয়ার, প্রোডাক্ট ম্যানেজার |
| **Write** | ব্রাঞ্চ তৈরি, ফিচার কোড পুশ, পিআর ওপেন করা | সাধারণ সফটওয়্যার ডেভেলপার |
| **Maintain** | রিপো সেটিংস, ব্রাঞ্চ রুলস ও মাইলস্টোন কনফিগার করা | টেক লিড, সিনিয়র ইঞ্জিনিয়ার |
| **Admin** | পূর্ণ নিয়ন্ত্রণ: রিপো ডিলিট, সিক্রেটস ও বিলিং ম্যানেজমেন্ট | ডেভঅপস ইঞ্জিনিয়ার, সিটিও |

---

## 🚨 ইমার্জেন্সি ইনসিডেন্ট রেসপন্স (সিক্রেট লিক হলে কী করবেন?)

যদি দুর্ঘটনাবশত পাবলিক রিপোতে কোনো সিক্রেট পুশ হয়ে যায়:
\`\`\`bash
# ধাপ ১: সাথে সাথে ক্লাউড কনসোলে গিয়ে কি ডিলিট বা রিভোক করুন (REVOKE IMMEDIATELY)

# ধাপ ২: BFG Repo-Cleaner দিয়ে সম্পূর্ণ পেছনের হিস্ট্রি থেকে ফাইল মুছে ফেলুন
bfg --delete-files .env

# ধাপ ৩: রেফলগ এক্সপায়ার করে অবজেক্ট ক্লিন করুন
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# ধাপ ৪: ক্লিন হিস্ট্রি রিমোটে ফোর্স পুশ করুন
git push origin --force --all
git push origin --force --tags
\`\`\`
`,
  };
