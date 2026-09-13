import type { LocalLesson } from "@/lib/lessons-data";

export const gitIgnoreAndRepoManagementLesson: LocalLesson = {
    slug: "git-ignore-and-repo-management",
    titleEn: "Git Ignore & Repository Management: .gitignore, Global Rules, Untracking & Secret Hygiene",
    titleBn: "গিট ইগনোর ও রিপোজিটরি ম্যানেজমেন্ট: .gitignore, গ্লোবাল রুলস, আনট্র্যাকিং এবং সিক্রেট হাইজিন",
    categoryEn: "14. Git Ignore & Repository Management",
    categoryBn: "১৪. গিট ইগনোর ও রিপোজিটরি ম্যানেজমেন্ট",
    categoryDescEn: "Writing .gitignore rules, glob patterns, global ignore configuration, untracking cached files with git rm --cached, environment variables handling, build artifacts, and secret leakage disaster recovery.",
    categoryDescBn: ".gitignore সিনট্যাক্স, গ্লোবাল ইগনোর, ভুলবশত ট্র্যাক হওয়া ফাইল ক্যাশ থেকে সরানো, এনভায়রনমেন্ট সিক্রেট হ্যান্ডলিং, বিল্ড ফাইল এবং সিক্রেট লিক রিকভারি।",
    categoryPriority: "CORE",
    descriptionEn: "Master .gitignore glob patterns, machine-wide global ignores, safely removing tracked files from Git without deleting them locally, and industry-standard secret management.",
    descriptionBn: ".gitignore গ্লোব প্যাটার্ন, গ্লোবাল ইগনোর সেটআপ, কম্পিউটারে ফাইল ঠিক রেখে গিট ইনডেক্স থেকে ক্যাশড ফাইল মুছে ফেলা এবং ইন্ডাস্ট্রির সিক্রেট সিকিউরিটি রুলস শিখুন।",
    difficulty: "EASY",
    displayOrder: 14,
    prerequisites: ["git-working-with-changes"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Gitignore Templates",
        title: "GitHub Collection of .gitignore Templates",
        url: "https://github.com/github/gitignore",
        description: "Official collection of production-ready .gitignore files for Node, Python, .NET, Java, Go, and more.",
        isStarred: true,
      },
      {
        source: "Toptal gitignore.io",
        title: "gitignore.io — Generate .gitignore Files Instantly",
        url: "https://www.toptal.com/developers/gitignore",
        description: "Create useful .gitignore files for your OS, IDE, and programming language with a single search query.",
        isStarred: true,
      },
    ],
    problems: [
      {
        source: "BD Tech Viva",
        name: "If a sensitive file or build directory was already committed and pushed, why does adding it to .gitignore fail to ignore it, and how do you resolve it safely?",
        url: null,
        difficulty: "MEDIUM",
        company: "Samsung R&D (SRBD)",
        tags: ["Git", "gitignore", "git rm --cached", "Hygiene", "Security"],
        solutionEn: ".gitignore only instructs Git to ignore UNTRACKED files. If a file was previously staged or committed, it already exists in the Git index/tree; Git continues tracking its future changes regardless of .gitignore rules. To fix this without deleting the physical file from your local disk, untrack it from the Git index using 'git rm --cached <path>' (or 'git rm -r --cached <dir>'), ensure it is added to .gitignore, and commit the removal.",
        solutionBn: ".gitignore শুধুমাত্র নতুন আনট্র্যাকড (Untracked) ফাইলের ওপর কার্যকর হয়। কোনো ফাইল অতীতে একবার কমিট হয়ে গেলে তা গিট ইনডেক্স/ট্রি-তে ট্র্যাকড হয়ে যায়; তখন .gitignore-এ লিখলেও গিট সেই ফাইলকে ট্র্যাক করতেই থাকে। লোকাল ড্রাইভ থেকে ফাইল মুছে না ফেলে শুধু গিট ইনডেক্স থেকে বাদ দিতে 'git rm --cached <path>' (বা ফোল্ডারের জন্য 'git rm -r --cached <dir>') চালিয়ে কমিট করতে হয়।",
      },
    ],
    contentEn: `# 14. Git Ignore & Repository Management

A clean, production-grade repository contains only human-written source code, configuration templates, documentation, and tests. It should **never** store compiled binaries, bulky dependencies, OS junk, or confidential credentials.

---

## 1. .gitignore (What it is & How it Works)

### What is \`.gitignore\`?
\`.gitignore\` is a plain text configuration file placed inside your Git repository (usually in the root directory). It tells Git which files, patterns, or directories should be **deliberately untracked and ignored**.

### Core Rules of How Git Treats \`.gitignore\`:
1. **Applies ONLY to Untracked Files:** Git will never ignore a file that is already being tracked in the Git index (staging tree).
2. **Hierarchical Precedence:** A \`.gitignore\` file placed in a subfolder applies to that subfolder and overrides parent directory patterns.
3. **Commit It to Version Control:** The \`.gitignore\` file should be committed into Git so that all team members share the same ignore rules.

### Glob Pattern Syntax:
| Pattern | Meaning & Rule | Example |
| :--- | :--- | :--- |
| \`#\` | Comment line | \`# Ignore logs\` |
| \`*\` | Matches zero or more characters (except \`/\`) | \`*.log\` (ignores \`app.log\`, \`error.log\`) |
| \`?\` | Matches exactly one single character | \`debug?.log\` (matches \`debug1.log\`, not \`debug12.log\`) |
| \`/\` (leading) | Matches relative to directory containing \`.gitignore\` | \`/dist\` (ignores \`dist\` at root, not \`app/dist\`) |
| \`/\` (trailing) | Restricts pattern strictly to directories | \`temp/\` (ignores folder \`temp/\`, but not a file named \`temp\`) |
| \`**/\` | Matches zero or more directories | \`**/logs/*.log\` (matches logs anywhere in repo) |
| \`!\` | Negation (whitelist / un-ignore rule) | \`!important.log\` (keeps tracking this specific file) |
| \`\\#\`, \`\\!\` | Escapes literal special characters | \`\\#special_file.txt\` |

---

## 2. Global .gitignore (Machine-Wide Ignore)

### Why Global .gitignore?
Every developer uses different operating systems and code editors. Team project repositories should **not** be littered with individual workstation preferences like:
* macOS metadata: \`.DS_Store\`
* Windows thumbnail caches: \`Thumbs.db\`, \`desktop.ini\`
* Editor-specific settings: \`.vscode/\`, \`.idea/\`, \`*.swp\`

Instead of adding these to every project's \`.gitignore\`, configure a **Global .gitignore** on your computer once.

### Setup Instructions:
\`\`\`bash
# 1. Create a global ignore file in your user home directory
touch ~/.gitignore_global

# 2. Add common OS and editor junk to this file
cat <<EOT >> ~/.gitignore_global
# OS junk
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
desktop.ini

# IDE & Editor caches
.idea/
*.swp
*.swo
*~
.project
.classpath
EOT

# 3. Tell Git to use this global exclude file
git config --global core.excludesfile ~/.gitignore_global

# 4. Verify configuration
git config --get core.excludesfile
# Output: /Users/yourusername/.gitignore_global
\`\`\`

---

## 3. Ignoring Files (Practical Patterns & Testing Rules)

### Common Pattern Examples:
\`\`\`gitignore
# 1. File Extension Rule
*.tmp
*.bak
*.swp

# 2. Directory Rule
node_modules/
bin/
obj/
dist/

# 3. Specific Path Rule
config/private-keys.json

# 4. Whitelisting with Negation (!)
# Ignore all logs...
logs/*
# ...BUT keep this one critical production audit log:
!logs/audit.log

# CAUTION with Negation:
# If you ignore the entire directory with 'logs/', Git will NOT scan inside it!
# Therefore, '!logs/audit.log' will NOT work if 'logs/' is ignored.
# You must ignore 'logs/*' to allow subfile whitelisting.
\`\`\`

### Testing & Debugging Ignore Rules:
Wondering why Git is ignoring (or failing to ignore) a particular file? Use \`git check-ignore\`:
\`\`\`bash
# Test why a file is being ignored (shows rule and line number)
git check-ignore -v src/temp/debug.log
# Output: .gitignore:12:*.log  src/temp/debug.log

# Force add an ignored file (rare, use with caution)
git add -f important-ignored.json
\`\`\`

---

## 4. Removing Tracked Files (Untracking with \`git rm --cached\`)

### The Classic Trap:
1. You accidentally committed \`appsettings.Development.json\` or \`.env\`.
2. You notice the mistake, so you add \`.env\` to \`.gitignore\`.
3. You edit \`.env\` — but \`git status\` still shows it as modified!
4. **Why?** Git only checks \`.gitignore\` for untracked files. Since the file was already committed to Git's index, Git tracks it forever until untracked.

### How to Fix It (Keep Local File, Remove from Git):
\`\`\`bash
# Remove a single file from Git tracking (keeps file on your hard disk)
git rm --cached appsettings.Development.json

# Remove an entire directory from tracking (recursive)
git rm -r --cached dist/

# Stage the updated .gitignore
git add .gitignore

# Commit the removal
git commit -m "chore: stop tracking local environment settings and build artifacts"
\`\`\`

### Complete Repository Refresh (Re-apply .gitignore to all files):
\`\`\`bash
# 1. Make sure working directory has no uncommitted changes
git status

# 2. Untrack everything from index
git rm -r --cached .

# 3. Re-add everything (respecting the current .gitignore)
git add .

# 4. Commit the cleanup
git commit -m "chore: reapply .gitignore across entire repository"
\`\`\`

---

## 5. Environment Files (.env & Secrets Handling)

### Why Environment Files Must NEVER Enter Git:
Environment files (\`.env\`, \`.env.local\`, \`.env.production\`) contain raw secrets:
* Database connection strings with passwords
* Third-party API keys (Stripe, Twilio, OpenAI, AWS)
* Encryption keys & JWT secret salts

Once pushed to a public (or even private) remote repository, credentials can be cached, scraped, or compromised.

### The Standard \`.env.example\` Pattern:
Never commit real values. Instead, commit a dummy blueprint so team members know which variables are required:

\`\`\`bash
# .env.example (Committed to Git)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=replace_with_32_character_random_string
STRIPE_API_KEY=sk_test_placeholder_key
PORT=3000
\`\`\`

### In \`.gitignore\`:
\`\`\`gitignore
# Environment files
.env
.env*.local
.env.development
.env.production
.env.staging
\`\`\`

---

## 6. Build Files (Compilations & Bulky Artifacts)

### Why Build Artifacts Must Be Ignored:
1. **Repository Bloat:** Compiled files (like \`.dll\`, \`.exe\`, minified \`.js\`, \`.tar\`) change every build, causing the \`.git\` directory to balloon into gigabytes.
2. **Merge Conflicts:** Compiled/minified files cannot be text-diffed cleanly.
3. **Platform Incompatibility:** A binary built on macOS will fail on a Linux server or Windows workstation.

### Common Ecosystem Guidelines:
* **JavaScript / TypeScript:**
  \`\`\`gitignore
  node_modules/
  dist/
  build/
  .next/
  .nuxt/
  coverage/
  \`\`\`
* **C# / .NET:**
  \`\`\`gitignore
  bin/
  obj/
  *.user
  *.suo
  \`\`\`
* **Python:**
  \`\`\`gitignore
  __pycache__/
  *.py[cod]
  .venv/
  env/
  *.egg-info/
  dist/
  \`\`\`
* **Java:**
  \`\`\`gitignore
  target/
  *.class
  *.jar
  *.war
  \`\`\`

---

## 7. Sensitive Files (Security Disaster Recovery)

### High-Risk Files:
* SSH Private Keys: \`id_rsa\`, \`id_ed25519\`, \`*.pem\`, \`*.key\`
* SSL/TLS certificates: \`*.pfx\`, \`*.p12\`
* Cloud Service Account keys: \`credentials.json\`, \`service-account.json\`

### Emergency Action Plan If You Accidentally Push a Secret:
> **Critical Warning:** Simply making a new commit that deletes the file or adds it to \`.gitignore\` does **NOT** delete the secret from Git history! The raw key remains readable in older commits.

1. **Step 1: Revoke and Rotate IMMEDIATELY.**
   * Go to AWS, Stripe, Firebase, or your database console. Delete the leaked key immediately and issue a new one. Treat leaked keys as 100% compromised.
2. **Step 2: Purge the File from Entire Git History:**
   * Use \`git-filter-repo\` (official Git recommendation) or **BFG Repo-Cleaner**:
   \`\`\`bash
   # Using BFG Repo-Cleaner
   bfg --delete-files .env
   
   # Expire reflog and prune objects
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   
   # Force push sanitized history to remote
   git push origin --force --all
   \`\`\`
3. **Step 3: Enable GitHub Secret Scanning & Push Protection:**
   * In GitHub repo **Settings** > **Code security and analysis**, enable **Secret scanning** and **Push protection**. GitHub will block pushes containing detected API keys.
4. **Step 4: Use Pre-Commit Hooks:**
   * Install tools like \`gitleaks\` or \`git-secrets\` to scan commits locally before they are made.

---

## Summary Cheat Sheet

| Task | Command / Pattern |
| :--- | :--- |
| Test why a file is ignored | \`git check-ignore -v <filepath>\` |
| Untrack single file (keep locally) | \`git rm --cached <file>\` |
| Untrack folder (keep locally) | \`git rm -r --cached <folder>\` |
| Force add an ignored file | \`git add -f <file>\` |
| Set global gitignore | \`git config --global core.excludesfile ~/.gitignore_global\` |
| Refresh entire repo gitignore | \`git rm -r --cached . && git add . && git commit\` |
`,
    contentBn: `# ১৪. গিট ইগনোর ও রিপোজিটরি ম্যানেজমেন্ট (Git Ignore & Repository Management)

একটি প্রফেশনাল ও ক্লিন সফটওয়্যার রিপোজিটরিতে শুধুমাত্র প্রয়োজনীয় সোর্স কোড, কনফিগারেশন টেমপ্লেট, ডকস এবং টেস্ট কোড থাকা উচিত। কোনো অবস্থাতেই এতে কম্পাইল্ড বাইনারি ফাইল, বিশালাকার ডিপেন্ডেন্সি ফোল্ডার, অপারেটিং সিস্টেমের আবর্জনা কিংবা গোপন এপিআই কি (API Keys) ও পাসওয়ার্ড রাখা যাবে না।

---

## ১. .gitignore (এটি কী এবং কীভাবে কাজ করে?)

### .gitignore কী?
\`.gitignore\` হলো রিপোজিটরির রুটে (বা যেকোনো ফোল্ডারে) রাখা একটি সাধারণ টেক্সট কনফিগারেশন ফাইল। এর মধ্যে নির্দিষ্ট কিছু রুলস বা ফাইল প্যাটার্ন লিখে দিলে Git সেই ফাইলগুলোকে **ইচ্ছাকৃতভাবে এড়িয়ে চলে বা ট্র্যাক করে না**।

### Git কীভাবে .gitignore হ্যান্ডেল করে?
1. **শুধুমাত্র Untracked ফাইলের ওপর কার্যকর:** যে ফাইলগুলো অতীতে কখনো কমিট হয়নি বা বর্তমানে স্টেজড নয়, শুধু সেগুলোর ক্ষেত্রেই \`.gitignore\` প্রযোজ্য।
2. **হায়ারারকিকাল প্রায়োরিটি (Hierarchical):** সাব-ফোল্ডারের ভেতরে নিজস্ব \`.gitignore\` থাকলে তা রুটের রুলকে ওভাররাইড করতে পারে।
3. **ভার্সন কন্ট্রোলে কমিট করতে হয়:** \`.gitignore\` ফাইলটি প্রজেক্টে কমিট করে গিটহাবে পুশ করা উচিত, যাতে টিমের সব ডেভেলপার একই ইগনোর রুল পায়।

### গ্লোব প্যাটার্ন (Glob Pattern) সিনট্যাক্স:
| প্যাটার্ন | অর্থ ও নিয়ম | বাস্তব উদাহরণ |
| :--- | :--- | :--- |
| \`#\` | কমেন্ট লাইন (Git এটি পড়ে না) | \`# Logs and caches\` |
| \`*\` | শূন্য বা একাধিক অক্ষর বোঝাতে (স্ল্যাশ বাদে) | \`*.log\` (সব \`.log\` ফাইল ইগনোর করবে) |
| \`?\` | ঠিক একটি মাত্র নির্দিষ্ট অক্ষর বোঝাতে | \`file?.txt\` (\`file1.txt\` মিলবে, \`file12.txt\` নয়) |
| \`/\` (শুরুতে) | রিপোজিটরির রুট ডিরেক্টরি নির্দিষ্ট করতে | \`/dist\` (রুটের \`dist\` বাদ দেবে, \`app/dist\` নয়) |
| \`/\` (শেষে) | শুধুমাত্র ফোল্ডার বোঝাতে | \`temp/\` (\`temp\` ফোল্ডার বাদ দেবে, \`temp\` নামের ফাইল নয়) |
| \`**/\` | যেকোনো গভীরতার নেস্টেড ফোল্ডার বোঝাতে | \`**/logs/*.log\` (যেকোনো ফোল্ডারের ভেতরের লগ) |
| \`!\` | নেগেশন / এক্সেপশন (ফাইলটি বাদ না দিয়ে রাখতে) | \`!important.log\` (লগ হলেও এটি ট্র্যাক করবে) |
| \`\\#\`, \`\\!\` | বিশেষ ক্যারেক্টারকে সাধারণ টেক্সট বানাতে এস্কেপ | \`\\#notes.txt\` |

---

## ২. Global .gitignore (মেশিন-ওয়াইড গ্লোবাল ইগনোর)

### গ্লোবাল ইগনোর কেন দরকার?
টিমের একেকজন ডেভেলপার একেক অপারেটিং সিস্টেম বা এডিটর ব্যবহার করেন:
* ম্যাকের \`.DS_Store\`
* উইন্ডোজের \`Thumbs.db\`, \`desktop.ini\`
* ভিএস কোড বা জেটব্রেইন্সের নিজস্ব সেটিংস (\`.vscode/\`, \`.idea/\`, \`*.swp\`)

ব্যক্তিগত এডিটরের এই ফাইলগুলো দিয়ে টিমের প্রজেক্টের মূল \`.gitignore\` ভরিয়ে ফেলা বাজে প্র্যাকটিস। এর সহজ সমাধান হলো আপনার কম্পিউটারে একটি **গ্লোবাল .gitignore** ফাইল সেট করে নেওয়া।

### কনফিগার করার নিয়ম:
\`\`\`bash
# ১. ইউজারের হোম ডিরেক্টরিতে একটি গ্লোবাল ফাইল তৈরি করুন
touch ~/.gitignore_global

# ২. সাধারণ ওএস ও এডিটরের আবর্জনা এই ফাইলে যোগ করুন
cat <<EOT >> ~/.gitignore_global
# macOS
.DS_Store
.DS_Store?
._*

# Windows
Thumbs.db
desktop.ini

# Editors & IDEs
.idea/
.vscode/
*.swp
*~
EOT

# ৩. Git-কে এই ফাইলটি ডিফল্ট গ্লোবাল এক্সক্লুড হিসেবে চিনিয়ে দিন
git config --global core.excludesfile ~/.gitignore_global

# ৪. ঠিকঠাক সেট হলো কিনা যাচাই করুন
git config --get core.excludesfile
\`\`\`

---

## ৩. Ignoring Files (ফাইল ইগনোর করার প্যাটার্ন ও টেস্টিং)

### সাধারণ প্যাটার্নের প্র্যাকটিক্যাল উদাহরণ:
\`\`\`gitignore
# ১. এক্সটেনশন ধরে ইগনোর
*.tmp
*.bak
*.log

# ২. পুরো ফোল্ডার ইগনোর
node_modules/
dist/
bin/
obj/

# ৩. নির্দিষ্ট পাথের ফাইল
config/local-settings.json

# ৪. নেগেশন বা এক্সেপশন রুল (!)
# সব লগ ইগনোর করো...
logs/*
# ...কিন্তু প্রোডাকশন অডিট লগ ফাইলটি ট্র্যাক করো:
!logs/audit.log

# নেগেশনের সতর্কবার্তা:
# আপনি যদি সরাসরি 'logs/' ফোল্ডারটি ইগনোর করেন, তবে গিট ওই ফোল্ডারের ভেতর ঢুকবেই না।
# ফলে '!logs/audit.log' কাজ করবে না। এক্সেপশন দিতে চাইলে 'logs/*' ব্যবহার করতে হবে।
\`\`\`

### ইগনোর রুল টেস্ট ও ডিবাগিং:
কোনো ফাইল কেন ইগনোর হচ্ছে বা কেন হচ্ছে না তা সহজে বের করতে \`git check-ignore\` কমান্ড দিন:
\`\`\`bash
# ফাইলটি কোন রুল ও লাইনের কারণে ইগনোর হচ্ছে তা দেখতে
git check-ignore -v src/temp/debug.log
# আউটপুট দেখাবে: .gitignore:12:*.log  src/temp/debug.log

# ইগনোর করা ফাইল জোর করে অ্যাড করতে (Force Add)
git add -f important-secret-template.json
\`\`\`

---

## ৪. Removing Tracked Files (ইতিমধ্যে ট্র্যাক হওয়া ফাইল বাদ দেওয়া)

### ডেভেলপারদের সবচেয়ে বড় ফাঁদ:
1. আপনি ভুল করে \`config.json\` বা \`.env\` কমিট করে ফেলেছেন।
2. পরে ভুল বুঝতে পেরে \`.gitignore\` ফাইলে \`.env\` লিখে সেভ করলেন।
3. এখন \`.env\` ফাইল এডিট করে \`git status\` দিলে দেখতে পাবেন Git এখনো ফাইলটিকে Modified হিসেবে দেখাচ্ছে!
4. **কেন এমন হলো?** কারণ \`.gitignore\` শুধুমাত্র আনট্র্যাকড ফাইলে কাজ করে। ফাইলটি আগেই Git ইনডেক্সে জায়গা করে নিয়েছে।

### সমাধান (\`git rm --cached\`):
আপনার হার্ডডিস্ক থেকে ফাইল না মুছে শুধুমাত্র Git-এর মেমোরি (Index/Staging) থেকে মুছতে \`--cached\` ফ্ল্যাগ ব্যবহার করুন:

\`\`\`bash
# একটি নির্দিষ্ট ফাইল আনট্র্যাক করতে (ফাইল কম্পিউটারে অক্ষত থাকবে):
git rm --cached config.json

# পুরো ফোল্ডার আনট্র্যাক করতে (Recursive):
git rm -r --cached dist/

# .gitignore ফাইলটি অ্যাড করুন:
git add .gitignore

# পরিবর্তনটি কমিট করুন:
git commit -m "chore: untrack config and build files from repository"
\`\`\`

### পুরো রিপোজিটরির .gitignore রিফ্রেশ করার শর্টকাট:
\`\`\`bash
# ১. গিট ইনডেক্সের সবকিছু ক্যাশ থেকে মুছে দিন
git rm -r --cached .

# ২. বর্তমান .gitignore মেনে সবকিছু নতুন করে স্টেজ করুন
git add .

# ৩. পরিচ্ছন্ন কমিট দিন
git commit -m "chore: reapply .gitignore to all files"
\`\`\`

---

## ৫. Environment Files (.env এবং সিক্রেট ফাইল ম্যানেজমেন্ট)

### .env ফাইল কেন কখনোই গিটহাবে পুশ করবেন না?
\`.env\` বা \`.env.local\` ফাইলে থাকে ডাটাবেজের ইউজারনেম-পাসওয়ার্ড, পেমেন্ট গেটওয়ের সিক্রেট কি, ক্লাউড টোকেন ইত্যাদি। একবার পাবলিক রিপোতে এগুলো চলে গেলে রোবট বা হ্যাকাররা কয়েক সেকেন্ডের মধ্যে তা চুরি করে বিল বাড়িয়ে ফেলতে পারে বা ডাটাবেজ ডিলিট করে দিতে পারে।

### ইন্ডাস্ট্রির স্ট্যান্ডার্ড: \`.env.example\` প্যাটার্ন
প্রজেক্টে আসল পাসওয়ার্ড বা কি-বিহীন একটি ব্লুপ্রিন্ট ফাইল কমিট করে রাখুন, যাতে নতুন ডেভেলপার ক্লোন করে বুঝতে পারে কী কী কি লাগবে:

\`\`\`bash
# .env.example (এটি গিটহাবে পুশ হবে)
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/mydb
STRIPE_SECRET_KEY=sk_test_your_key_here
JWT_SECRET=your_super_secret_jwt_key
\`\`\`

### \`.gitignore\`-এ যুক্ত করুন:
\`\`\`gitignore
.env
.env*.local
.env.production
.env.development
\`\`\`

---

## ৬. Build Files (বিল্ড ও ডিপেন্ডেন্সি আর্টফ্যাক্টস)

### বিল্ড ফাইল কেন গিটে রাখা নিষেধ?
1. **Repository Bloat:** \`node_modules/\` বা \`bin/\` ফোল্ডারে হাজার হাজার কম্পাইল্ড ফাইল থাকে। এগুলো কমিট করলে রিপোজিটরির সাইজ মেগাবাইট থেকে গিগাবাইট হয়ে যায়, ক্লোন করতে ঘন্টার পর ঘন্টা সময় লাগে।
2. **Merge Conflict:** বাইনারি বা মিনিফাইড জাভাস্ক্রিপ্ট কোডে কোনো কার্যকর ডিফারেন্স (Diff) দেখা যায় না এবং এতে অহেতুক মার্জ কনফ্লিক্ট তৈরি হয়।
3. **ওএস অমিল:** আপনার ম্যাক মেশিনে তৈরি হওয়া বাইনারি লিনাক্স সার্ভার বা উইন্ডোজে রান করবে না। সার্ভার নিজেই প্যাকেজ ম্যানেজার দিয়ে ডিপেন্ডেন্সি ডাউনলোড ও বিল্ড করে নেবে।

### বিভিন্ন ল্যাঙ্গুয়েজের কমন বিল্ড প্যাটার্ন:
* **Node.js:** \`node_modules/\`, \`dist/\`, \`.next/\`, \`coverage/\`
* **C# / .NET:** \`bin/\`, \`obj/\`, \`*.user\`, \`*.suo\`
* **Python:** \`__pycache__/\`, \`*.pyc\`, \`.venv/\`, \`dist/\`
* **Java:** \`target/\`, \`*.class\`, \`*.jar\`

---

## ৭. Sensitive Files (সংবেদনশীল ফাইল ও সিকিউরিটি রিকভারি)

### সংবেদনশীল ফাইলসমূহ:
* SSH Private Keys: \`id_rsa\`, \`*.pem\`, \`*.key\`
* ডাটাবেজ ব্যাকআপ ফাইল: \`*.dump\`, \`*.sql\`
* ক্লাউড সার্ভিস একাউন্ট কি: \`firebase-adminsdk.json\`, \`aws-credentials.csv\`

### ভুলবশত সিক্রেট গিটহাবে চলে গেলে কী করবেন?
> **সর্বোচ্চ সতর্কতা:** নতুন একটি কমিট দিয়ে ফাইলটি ডিলিট করে দিলে বা \`.gitignore\`-এ বসালে সমস্যা কিন্তু মেটে না! কারণ Git-এর পেছনের কমিট হিস্ট্রিতে সিক্রেটটি সারা জীবনের জন্য থেকে যায়।

1. **ধাপ ১: তাৎক্ষণিকভাবে কি বাতিল (Revoke & Rotate) করুন:**
   * কালক্ষেপণ না করে ক্লাউড ড্যাশবোর্ডে (AWS, Stripe, Firebase) গিয়ে লিক হওয়া কি-টি ডিলিট করে নতুন কি জেনারেট করুন। মনে রাখবেন, গিটহাবে পুশ হওয়ামাত্র বটরা তা কপি করে নেয়।
2. **ধাপ ২: গিট হিস্ট্রি থেকে ফাইলটি পুরোপুরি মুছে ফেলুন (Purge):**
   * আধুনিক টুল **BFG Repo-Cleaner** বা \`git-filter-repo\` দিয়ে সম্পূর্ণ গিট হিস্ট্রি স্ক্রাব করুন:
   \`\`\`bash
   # BFG Repo-Cleaner দিয়ে পুরো হিস্ট্রি থেকে .env ফাইল মুছে ফেলতে:
   bfg --delete-files .env
   
   # রেফলগ এক্সপায়ার করে ক্লিন করুন
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   
   # রিমোটে ফোর্স পুশ করুন
   git push origin --force --all
   \`\`\`
3. **ধাপ ৩: GitHub Secret Scanning চালু রাখা:**
   * রিপোজিটরির **Settings** > **Code security and analysis** থেকে **Push protection** অন করে রাখুন। এতে আপনি ভুল করে কি পুশ করলেও গিটহাব পুশ রিজেক্ট করে দেবে।
4. **ধাপ ৪: Pre-commit Hook ব্যবহার:**
   * \`gitleaks\` বা \`husky\` সেট করে নিলে কমিট করার আগেই লোকাল মেশিনে সিক্রেট স্ক্যান করে অ্যালার্ট দেবে।

---

## প্র্যাকটিক্যাল কমান্ড সামারি

| উদ্দেশ্য | কমান্ড |
| :--- | :--- |
| ফাইল কেন ইগনোর হচ্ছে তা টেস্ট করা | \`git check-ignore -v <file>\` |
| ফিজিক্যাল ফাইল অক্ষত রেখে গিট থেকে সরানো | \`git rm --cached <file>\` |
| ফোল্ডার অক্ষত রেখে গিট থেকে সরানো | \`git rm -r --cached <folder>\` |
| ইগনোর করা ফাইল জোর করে স্টেজ করা | \`git add -f <file>\` |
| গ্লোবাল .gitignore সেট করা | \`git config --global core.excludesfile ~/.gitignore_global\` |
| পুরো রিপোজিটরির .gitignore নতুন করে প্রয়োগ | \`git rm -r --cached . && git add . && git commit\` |
`,
  };
