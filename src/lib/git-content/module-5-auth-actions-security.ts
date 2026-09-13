import type { LocalLesson } from "@/lib/lessons-data";

export const MODULE_5_LESSONS: LocalLesson[] = [
  {
    slug: "github-authentication",
    titleEn: "GitHub Authentication: HTTPS, SSH Keys, PATs, GitHub CLI & Credential Management",
    titleBn: "গিটহাব অথেনটিকেশন: HTTPS, SSH কি, পার্সোনাল অ্যাক্সেস টোকেন, গিটহাব সিএলআই ও ক্রেডেনশিয়াল ম্যানেজার",
    categoryEn: "15. GitHub Authentication",
    categoryBn: "১৫. গিটহাব অথেনটিকেশন",
    categoryDescEn: "Deep dive into HTTPS vs SSH protocols, Ed25519 cryptographic key generation, Fine-grained PATs, GitHub CLI (gh auth) workflows, and OS native Credential Managers.",
    categoryDescBn: "HTTPS বনাম SSH প্রোটোকল, Ed25519 ক্রিপ্টোগ্রাফিক কি তৈরি, ফাইন-গ্রেইন্ড পার্সোনাল অ্যাক্সেস টোকেন (PAT), গিটহাব সিএলআই (gh auth) এবং অপারেটিং সিস্টেম ক্রেডেনশিয়াল ম্যানেজার।",
    categoryPriority: "CORE",
    descriptionEn: "Master secure communication with GitHub using modern Ed25519 SSH keys, Fine-grained PATs, Git Credential Manager, and the official GitHub CLI.",
    descriptionBn: "আধুনিক Ed25519 SSH কি, ফাইন-গ্রেইন্ড পার্সোনাল অ্যাক্সেস টোকেন, গিট ক্রেডেনশিয়াল ম্যানেজার এবং অফিসিয়াল গিটহাব সিএলআই দিয়ে নিরাপদ কানেকশন স্থাপন শিখুন।",
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
        source: "GitHub Docs",
        title: "Managing your personal access tokens",
        url: "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens",
        description: "Guide to creating fine-grained and classic personal access tokens.",
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
        name: "Why did GitHub deprecate account passwords for Git operations, and how does SSH asymmetric cryptography provide superior security?",
        url: null,
        difficulty: "MEDIUM",
        company: "BJIT Group",
        tags: ["GitHub", "Authentication", "SSH", "Security", "HTTPS"],
        solutionEn: "Account passwords are vulnerable to phishing, credential stuffing, and lacks permission scoping. In August 2021, GitHub deprecated basic account password authentication for Git pushes and fetches over HTTPS in favor of Personal Access Tokens (PATs) and SSH keys. SSH utilizes asymmetric cryptography: your private key stays strictly on your local computer, while only your public key is shared with GitHub. Git operations authenticate mathematically via challenge-response without ever transmitting your credentials over the wire.",
        solutionBn: "অ্যাকাউন্ট পাসওয়ার্ড ফিশিং, ব্রুট-ফোর্স এবং ক্রেডেনশিয়াল স্টাফিং আক্রমণের ঝুঁকিতে থাকে এবং এর কোনো নির্দিষ্ট স্কোপ বা মেয়াদ থাকে না। তাই ২০২১ সালের আগস্ট থেকে গিটহাব পাসওয়ার্ড ভিত্তিক গিট পুশ সম্পূর্ণ বন্ধ করে দেয়। এর বদলে পার্সোনাল অ্যাক্সেস টোকেন ও SSH কি বাধ্যতামূলক করা হয়েছে। SSH এ অ্যাসিমেট্রিক ক্রিপ্টোগ্রাফি ব্যবহৃত হয়: আপনার প্রাইভেট কি সবসময় আপনার কম্পিউটারে গোপন থাকে এবং ইন্টারনেটে কেবল পাবলিক কি শেয়ার হয়। ফলে কোনো পাসওয়ার্ড পাঠানো ছাড়াই চ্যালেঞ্জ-রেসপন্স পদ্ধতিতে শতভাগ নিরাপদ অথেনটিকেশন নিশ্চিত হয়।",
      },
    ],
    contentEn: `# 15. GitHub Authentication: HTTPS, SSH, PATs & Credential Management

Secure communication between your local computer and GitHub is fundamental to software engineering. Since August 13, 2021, **GitHub no longer accepts your account password** when authenticating Git operations.

---

## 1. HTTPS (Hypertext Transfer Protocol Secure)

### How HTTPS Git Works:
When cloning via HTTPS (\`https://github.com/owner/repo.git\`), Git communicates over standard web encryption (TLS port 443).

### Why Account Passwords Were Deprecated:
1. **No Granular Scoping:** An account password gives full access to everything (all repos, billing, account deletion).
2. **No Expiration:** Passwords rarely expire automatically.
3. **Incompatible with 2FA:** Two-Factor Authentication cannot be passed through a basic terminal password prompt.

### Modern HTTPS Authentication:
Today, when Git prompts you for credentials over HTTPS:
* **Username:** Your GitHub username.
* **Password:** A **Personal Access Token (PAT)** or an OAuth token handled by **Git Credential Manager (GCM)**.

### When to Use HTTPS:
* Behind restrictive corporate proxies or firewalls that block SSH port 22.
* Quick clone of public open-source repositories without setting up SSH keys.

---

## 2. SSH (Secure Shell)

### What is SSH?
SSH is a secure cryptographic network protocol operating over port 22 (with port 443 fallback). For Git developers, it provides completely seamless, **password-free push and pull operations**.

### Mental Model: Asymmetric Public-Key Cryptography
Think of asymmetric cryptography like a lock and key:
* **Public Key (\`.pub\`):** The padlock. You give this to GitHub freely. GitHub puts this lock on your account's door.
* **Private Key:** The physical secret key that stays on your computer. It never travels across the internet. Only this private key can unlock the padlock.

\`\`\`text
Local Machine                          GitHub Server
┌─────────────────┐                   ┌─────────────────┐
│ Private Key     │                   │ Public Key      │
│ (id_ed25519)    │ ─── Challenge ──► │ (id_ed25519.pub)│
│ [Never leaves]  │ ◄── Signature ─── │ [Authorized]    │
└─────────────────┘                   └─────────────────┘
\`\`\`

### SSH URL Structure:
\`\`\`bash
git clone git@github.com:username/repository.git
\`\`\`

---

## 3. SSH Keys (Generation, Config & Testing)

### Algorithm Choice: Ed25519 vs RSA
* **Ed25519 (Recommended ⭐):** Modern elliptic curve cryptography (256-bit). Faster, smaller, more secure.
* **RSA (4096-bit):** Legacy standard. Use only if required by outdated internal infrastructure.
* *Never use DSA or RSA 1024 (insecure & deprecated).*

### Step-by-Step Setup Guide:

#### Step 1: Generate an Ed25519 Key Pair
\`\`\`bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 1. Press Enter to accept default path (~/.ssh/id_ed25519)
# 2. Enter a strong passphrase (encrypts your private key on disk)
\`\`\`

#### Step 2: Start \`ssh-agent\` and Add Key
The SSH agent caches your decrypted key in memory so you don't type your passphrase every time:
\`\`\`bash
# Start ssh-agent in background
eval "$(ssh-agent -s)"

# Add private key
ssh-add ~/.ssh/id_ed25519
\`\`\`

> **macOS Tip (\`~/.ssh/config\`):**
> Add this to \`~/.ssh/config\` so macOS automatically loads the key into Apple Keychain across reboots:
> \`\`\`text
> Host github.com
>   AddKeysToAgent yes
>   UseKeychain yes
>   IdentityFile ~/.ssh/id_ed25519
> \`\`\`

#### Step 3: Copy Public Key & Add to GitHub
\`\`\`bash
# macOS:
pbcopy < ~/.ssh/id_ed25519.pub

# Linux:
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# Windows (Git Bash):
clip < ~/.ssh/id_ed25519.pub
\`\`\`
1. In GitHub, go to **Settings** > **SSH and GPG keys** > **New SSH key**.
2. Set Title (e.g., "Work MacBook M3"), Key type: **Authentication Key**, paste the key, and click **Add SSH key**.

#### Step 4: Test Connection
\`\`\`bash
ssh -T git@github.com
# Expected output:
# Hi username! You've successfully authenticated, but GitHub does not provide shell access.
\`\`\`

#### Troubleshooting Corporate Firewalls (SSH over Port 443):
If port 22 is blocked by your ISP or office Wi-Fi, configure \`~/.ssh/config\`:
\`\`\`text
Host github.com
  Hostname ssh.github.com
  Port 443
  User git
\`\`\`

---

## 4. Personal Access Tokens (PAT)

### What is a PAT?
A Personal Access Token is an encrypted random string that functions exactly like a password for HTTPS Git operations and REST API calls.

### Types of Personal Access Tokens:

| Feature | Fine-grained PAT (⭐ Recommended) | PAT (Classic) |
| :--- | :--- | :--- |
| **Repository Scope** | Selected repositories only | All repositories on account |
| **Permissions** | Granular (e.g., Read issues, Write code) | Broad scopes (\`repo\`, \`admin\`) |
| **Expiration** | Mandatory (max 1 year) | Can be set to "No expiration" (unsafe) |
| **Organization Control** | Organization owners can review/approve | Uncontrolled account-wide access |

### How to Generate a Fine-grained PAT:
1. Go to **GitHub** > **Settings** > **Developer settings** > **Personal access tokens** > **Fine-grained tokens**.
2. Click **Generate new token**.
3. Choose token name, expiration date, and select specific repository access.
4. Under **Repository permissions**, select:
   * **Contents**: Read and Write (for clone/push).
5. Copy the generated token immediately (\`github_pat_...\`). **You will never see it again.**

---

## 5. GitHub CLI Authentication (\`gh auth\`)

The official **GitHub CLI (\`gh\`)** is the fastest, cleanest way to authenticate both Git and CLI operations without manual key copying.

### Authenticate via Interactive Wizard:
\`\`\`bash
gh auth login
\`\`\`
Interactive prompts:
1. *What account do you want to log into?* ➔ **GitHub.com**
2. *What is your preferred protocol for Git operations?* ➔ **SSH** (or **HTTPS**)
3. *Generate a new SSH key to add to your GitHub account?* ➔ **Yes** (or select existing)
4. *How would you like to authenticate GitHub CLI?* ➔ **Login with a web browser**
5. Enter the one-time device code in the browser and confirm!

### Managing CLI Authentication:
\`\`\`bash
# Check current authentication status and active scopes
gh auth status

# Refresh or grant additional scopes
gh auth refresh -s repo -s workflow

# Switch between multiple GitHub accounts (Work vs Personal)
gh auth switch

# Log out
gh auth logout
\`\`\`

---

## 6. Credential Management (Git Credential Manager - GCM)

### What is Git Credential Manager (GCM)?
Git Credential Manager is an open-source tool bundled with Git for Windows and macOS. When you perform an HTTPS operation, GCM pops up a browser window, performs browser-based OAuth with 2FA, and securely stores the session token inside your operating system's native encrypted credential store:
* **macOS:** Apple Keychain Access
* **Windows:** Windows Credential Manager
* **Linux:** Secret Service API (\`libsecret\`)

### Git Credential Helper Configurations:
\`\`\`bash
# Check your active credential helper
git config --get credential.helper

# Common helpers by OS:
# macOS (Native Keychain):
git config --global credential.helper osxkeychain

# Windows & Cross-platform (Git Credential Manager):
git config --global credential.helper manager

# In-memory cache for 1 hour (Linux servers):
git config --global credential.helper "cache --timeout=3600"

# ⚠️ AVOID: 'store' saves your password in plaintext ~/.git-credentials!
\`\`\`

### How to Reset / Clear Expired Stored Credentials:
* **macOS:** Open **Keychain Access** app ➔ search for \`github.com\` ➔ delete the saved internet password entry.
* **Windows:** Open **Credential Manager** ➔ **Windows Credentials** ➔ under *Generic Credentials*, find \`git:https://github.com\` ➔ click **Remove**.
* **Terminal CLI Command:**
  \`\`\`bash
  echo "url=https://github.com" | git credential reject
  \`\`\`

---

## Comparison Summary: Which Auth Method Should You Use?

| Method | Best For | Security Level | Maintenance |
| :--- | :--- | :--- | :--- |
| **SSH (Ed25519)** ⭐ | Daily development, terminal power users | **Highest** (Asymmetric crypto) | Set up once, works forever |
| **GitHub CLI (\`gh\`)** ⭐ | All-in-one terminal & PR management | **Highest** (OAuth + SSH) | 1 command (\`gh auth login\`) |
| **GCM (HTTPS)** | GUI developers, Windows IDE users | **High** (OS encrypted token) | Browser pop-up login |
| **Fine-grained PAT** | CI/CD runners, automated deployment scripts | **High** (Scoped & expiring) | Must renew upon expiration |
`,
    contentBn: `# ১৫. গিটহাব অথেনটিকেশন (GitHub Authentication)

আপনার লোকাল কম্পিউটার এবং রিমোট গিটহাব রিপোজিটরির মধ্যে সুরক্ষিত কানেকশন স্থাপন করা সফটওয়্যার ইঞ্জিনিয়ারিংয়ের সবচেয়ে মৌলিক ভিত্তি। ২০২১ সালের ১৩ই আগস্ট থেকে **GitHub গিট পুশ বা পুলের জন্য অ্যাকাউন্টের সাধারণ পাসওয়ার্ড সম্পূর্ণ বন্ধ করে দিয়েছে**।

---

## ১. HTTPS (Hypertext Transfer Protocol Secure)

### 🔹 HTTPS কীভাবে কাজ করে?
HTTPS পদ্ধতিতে রিপোজিটরি ক্লোন বা পুশ করার সময় ইউআরএল দেখতে হয় এমন: \`https://github.com/username/repo.git\`। এটি ওয়েবের সাধারণ এনক্রিপ্টেড TLS পোর্ট ৪৪৩ (Port 443) ব্যবহার করে যোগাযোগ করে।

### 🔹 সাধারণ পাসওয়ার্ড কেন বাতিল করা হলো?
1. **নির্দিষ্ট পারমিশন বা স্কোপ থাকে না:** অ্যাকাউন্টের পাসওয়ার্ড দিয়ে যেকেউ পুরো প্রোফাইল ডিলিট, বিলিং বা প্রাইভেট সব রিপোজিটরিতে পূর্ণ নিয়ন্ত্রণ নিয়ে নিতে পারে।
2. **মেয়াদ উত্তীর্ণ হয় না:** পাসওয়ার্ড নিজে নিজে এক্সপায়ার হয় না, ফলে ফিশিং বা চুরির ঝুঁকি থাকে।
3. **টু-ফ্যাক্টর অথেনটিকেশন (2FA) অচল:** টার্মিনালে ইউজারনেম-পাসওয়ার্ড চাইলে মোবাইলের 2FA কোড দেওয়ার ব্যবস্থা থাকে না।

### 🔹 আধুনিক HTTPS অথেনটিকেশন:
বর্তমানে টার্মিনালে HTTPS পুশ করার সময় পাসওয়ার্ড প্রম্পট আসলে:
* **Username:** আপনার গিটহাব ইউজারনেম।
* **Password:** আপনার তৈরি করা **Personal Access Token (PAT)** অথবা ব্রাউজার লগইনের মাধ্যমে **Git Credential Manager (GCM)**।

### 🔹 কখন HTTPS ব্যবহার করবেন?
* অফিসের বা ইউনিভার্সিটির ফায়ারওয়াল যেখানে SSH পোর্ট ২২ (Port 22) ব্লক করা থাকে।
* ওপেন-সোর্স প্রজেক্টের কোড SSH সেটআপ ছাড়াই চটজলদি ক্লোন করার জন্য।

---

## ২. SSH (Secure Shell)

### 🔹 SSH কী এবং কীভাবে কাজ করে?
SSH হলো একটি ক্রিপ্টোগ্রাফিক নেটওয়ার্ক প্রোটোকল। সফটওয়্যার ডেভেলপারদের জন্য এটি হলো সবচেয়ে জনপ্রিয় ও আরামদায়ক পদ্ধতি, কারণ এতে **কখনোই বারবার ইউজারনেম বা পাসওয়ার্ড টাইপ করতে হয় না**।

### 🔹 মেন্টাল মডেল: অ্যাসিমেট্রিক পাবলিক-প্রাইভেট কি (Public-Key Cryptography)
তালা ও চাবির কথা চিন্তা করুন:
* **পাবলিক কি (\`.pub\`):** এটি হলো তালা (Padlock)। এই তালাটি আপনি সানন্দে গিটহাবের দরজায় ঝুলিয়ে রাখবেন।
* **প্রাইভেট কি:** এটি হলো আসল চাবি। এটি আপনার কম্পিউটারের হার্ডডিস্কে পরম যত্নে লুকিয়ে থাকবে। ইন্টারনেটে কখনোই প্রাইভেট কি পাঠানো হয় না। শুধুমাত্র আপনার এই গোপন চাবি দিয়েই গিটহাবে ঝুলানো তালাটি খোলা সম্ভব।

\`\`\`text
আপনার কম্পিউটার                              গিটহাব সার্ভার
┌─────────────────┐                        ┌─────────────────┐
│ Private Key     │                        │ Public Key      │
│ (id_ed25519)    │ ─── ক্রিপ্টো চ্যালেঞ্জ ──► │ (id_ed25519.pub)│
│ [কখনো বের হয় না]│ ◄── ডিজিটাল সিগনেচার ─── │ [তালা হিসেবে যুক্ত]│
└─────────────────┘                        └─────────────────┘
\`\`\`

### 🔹 SSH ইউআরএল ফরম্যাট:
\`\`\`bash
git clone git@github.com:username/repository.git
\`\`\`

---

## ৩. SSH Keys (তৈরি, কনফিগারেশন ও কানেকশন টেস্ট)

### 🔹 অ্যালগরিদম নির্বাচন: Ed25519 বনাম RSA
* **Ed25519 (Recommended ⭐):** আধুনিক উপবৃত্তাকার বক্ররেখা (Elliptic Curve 256-bit)। এটি অবিশ্বাস্য রকমের দ্রুত, হালকা এবং সবচেয়ে বেশি নিরাপদ।
* **RSA (4096-bit):** পুরোনো স্ট্যান্ডার্ড। পুরোনো লিগ্যাসি সার্ভার ছাড়া নতুন কাজে RSA ব্যবহার অপ্রয়োজনীয়।
* *(কখনোই DSA বা 1024-bit RSA ব্যবহার করবেন না, এগুলো অনিরাপদ ও বাতিল ঘোষিত)।*

### 🔹 স্টেপ-বাই-স্টেপ সেটআপ গাইড:

#### ধাপ ১: Ed25519 কি-পেয়ার তৈরি করুন
\`\`\`bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# ১. ফাইল লোকেশন চাইলে Enter চাপুন (ডিফল্ট ~/.ssh/id_ed25519 এ সেভ হবে)
# ২. একটি শক্তিশালী পাসফ্রেজ (Passphrase) দিন (বা খালি রাখতে চাইলে Enter দিন)
\`\`\`

#### ধাপ ২: \`ssh-agent\` চালু করে কি যোগ করুন
SSH এজেন্ট আপনার আনলক করা কি-টি মেমোরিতে ক্যাশ করে রাখে, যাতে প্রতি পুশে পাসফ্রেজ লিখতে না হয়:
\`\`\`bash
# ssh-agent ব্যাকগ্রাউন্ডে চালু করুন:
eval "$(ssh-agent -s)"

# প্রাইভেট কি এজেন্টে যোগ করুন:
ssh-add ~/.ssh/id_ed25519
\`\`\`

> **macOS ইউজারদের জন্য টিপ (\`~/.ssh/config\`):**
> ম্যাক রিস্টার্ট হলেও কি স্বয়ংক্রিয়ভাবে সচল রাখতে \`~/.ssh/config\` ফাইলে নিচের লাইনগুলো যোগ করুন:
> \`\`\`text
> Host github.com
>   AddKeysToAgent yes
>   UseKeychain yes
>   IdentityFile ~/.ssh/id_ed25519
> \`\`\`

#### ধাপ ৩: পাবলিক কি কপি করে গিটহাবে যোগ করুন
\`\`\`bash
# macOS:
pbcopy < ~/.ssh/id_ed25519.pub

# Linux:
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# Windows (Git Bash):
clip < ~/.ssh/id_ed25519.pub
\`\`\`
1. গিটহাবে গিয়ে **Settings** > **SSH and GPG keys** > **New SSH key**-তে ক্লিক করুন।
2. Title দিন (যেমন: "Office ThinkPad"), Key type: **Authentication Key**, বক্সে কপি করা টেক্সট পেস্ট করে **Add SSH key** দিন।

#### ধাপ ৪: কানেকশন টেস্ট করুন
\`\`\`bash
ssh -T git@github.com
# সফল হলে আউটপুট দেখাবে:
# Hi username! You've successfully authenticated, but GitHub does not provide shell access.
\`\`\`

#### ফায়ারওয়াল সমাধান (Port 443 ফলব্যাক):
যদি অফিস বা ক্যাম্পাসের ওয়াইফাই পোর্ট ২২ ব্লক করে রাখে, তবে \`~/.ssh/config\` ফাইলে এটি লিখে দিন:
\`\`\`text
Host github.com
  Hostname ssh.github.com
  Port 443
  User git
\`\`\`

---

## ৪. Personal Access Tokens (PAT)

### 🔹 PAT কী?
পার্সোনাল অ্যাক্সেস টোকেন হলো ক্রিপ্টোগ্রাফিক অ্যালগরিদম দিয়ে তৈরি একটি দীর্ঘ স্ট্রিং, যা HTTPS অপারেশনে পাসওয়ার্ডের বিকল্প হিসেবে ব্যবহৃত হয়।

### 🔹 টোকেনের প্রকারভেদ:

| বৈশিষ্ট্য | Fine-grained PAT (⭐ রিকমেন্ডেড) | PAT Classic |
| :--- | :--- | :--- |
| **রিপোজিটরির পরিধি** | শুধুমাত্র নির্দিষ্ট রিপোজিটরি সিলেক্ট করা যায় | অ্যাকাউন্টের সমস্ত রিপোজিটরিতে এক্সেস পায় |
| **অনুমতি (Permissions)** | সূক্ষ্মভাবে নিয়ন্ত্রণযোগ্য (যেমন: শুধু কোড রিড/রাইট) | ঢালাও বড় বড় স্কোপ (\`repo\`, \`admin\`) |
| **মেয়াদ (Expiry)** | সর্বোচ্চ ১ বছরের মধ্যে মেয়াদ নির্ধারণ বাধ্যতামূলক | "No expiration" দেওয়া যায় (যা ঝুঁকিপূর্ণ) |
| **অর্গানাইজেশন সুরক্ষা** | কোম্পানি চাইলে টোকেন রিভিউ ও ব্লক করতে পারে | অ্যাডমিনের কোনো সরাসরি নিয়ন্ত্রণ থাকে না |

### 🔹 Fine-grained PAT তৈরির নিয়ম:
1. **GitHub** > **Settings** > **Developer settings** > **Personal access tokens** > **Fine-grained tokens**-এ যান।
2. **Generate new token**-এ ক্লিক করুন।
3. টোকেনের নাম, মেয়াদ এবং নির্দিষ্ট রিপোজিটরি সিলেক্ট করুন।
4. **Permissions** থেকে **Contents**-এ Read and Write পারমিশন দিন।
5. টোকেন তৈরি হলে সাথে সাথে কপি করে নিরাপদ স্থানে রাখুন (\`github_pat_...\`)। এই টোকেনটি দ্বিতীয়বার আর দেখতে পাবেন না।

---

## ৫. GitHub CLI Authentication (\`gh auth\`)

গিটহাবের অফিসিয়াল কমান্ড লাইন টুল **GitHub CLI (\`gh\`)** হলো সবচেয়ে দ্রুত ও ঝামেলাহীন অথেনটিকেশন পদ্ধতি। কোনো ফাইল খোঁজাখুঁজি বা কপি-পেস্ট ছাড়াই এটি সম্পূর্ণ অথেনটিকেশন করে দেয়।

### 🔹 ইন্টারেক্টিভ উইজার্ড দিয়ে লগইন:
\`\`\`bash
gh auth login
\`\`\`
টার্মিনাল আপনাকে সহজ কয়েকটি প্রশ্ন করবে:
1. *What account do you want to log into?* ➔ **GitHub.com**
2. *What is your preferred protocol for Git operations?* ➔ **SSH** (অথবা **HTTPS**)
3. *Generate a new SSH key to add to your GitHub account?* ➔ **Yes**
4. *How would you like to authenticate GitHub CLI?* ➔ **Login with a web browser**
5. টার্মিনালে আসা ৮ অক্ষরের ওটিপি কোডটি ব্রাউজারে পেস্ট করলেই বাজিমাত!

### 🔹 সিএলআই ম্যানেজমেন্ট কমান্ড:
\`\`\`bash
# লগইন স্ট্যাটাস ও স্কোপ চেক করতে
gh auth status

# একাধিক একাউন্টের মধ্যে সুইচ করতে (Personal vs Office)
gh auth switch

# লগআউট করতে
gh auth logout
\`\`\`

---

## ৬. Credential Management (গিট ক্রেডেনশিয়াল ম্যানেজার)

### 🔹 Git Credential Manager (GCM) কী?
Git Credential Manager হলো একটি সিকিউর টুল যা উইন্ডোজ ও ম্যাকের সাথে ডিফল্টভাবে থাকে। আপনি যখন HTTPS দিয়ে পুশ করতে যান, এটি নিজে থেকেই একটি ব্রাউজার পপআপ খুলে টু-ফ্যাক্টর অথেনটিকেশন (2FA) করিয়ে নেয় এবং টোকেনটি আপনার কম্পিউটারের নিজস্ব এনক্রিপ্টেড ভল্টে সেভ করে রাখে:
* **macOS:** Apple Keychain Access
* **Windows:** Windows Credential Manager
* **Linux:** Secret Service API (\`libsecret\`)

### 🔹 ক্রেডেনশিয়াল হেল্পার চেক ও কনফিগারেশন:
\`\`\`bash
# আপনার কম্পিউটারে বর্তমানে কোন হেল্পার চালু আছে দেখতে
git config --get credential.helper

# ম্যাকের নেটিভ কি-চেইন চালু করতে:
git config --global credential.helper osxkeychain

# উইন্ডোজ ও ক্রস-প্ল্যাটফর্ম GCM চালু করতে:
git config --global credential.helper manager

# লিনাক্স সার্ভারে সাময়িক ১ ঘণ্টার জন্য মেমোরিতে ক্যাশ করতে:
git config --global credential.helper "cache --timeout=3600"

# ⚠️ সাবধান: ভুলেও 'store' হেল্পার দেবেন না, এটি প্লেইন টেক্সট ফাইলে পাসওয়ার্ড জমায়!
\`\`\`

### 🔹 পুরোনো বা ভুল ক্রেডেনশিয়াল মুছে রিসেট করার নিয়ম:
* **macOS:** **Keychain Access** অ্যাপ ওপেন করুন ➔ সার্চ বক্সে \`github.com\` লিখুন ➔ এন্ট্রি সিলেক্ট করে ডিলিট করে দিন।
* **Windows:** **Credential Manager** ওপেন করুন ➔ **Windows Credentials**-এ যান ➔ *Generic Credentials* এর ভেতর \`git:https://github.com\` মুছে দিন।
* **টার্মিনাল দিয়ে এক লাইনে রিজেক্ট করতে:**
  \`\`\`bash
  echo "url=https://github.com" | git credential reject
  \`\`\`

---

## 💡 কোনটা কখন ব্যবহার করবেন?

| মেথড | কার জন্য সেরা | নিরাপত্তার মাত্রা | সুবিধা |
| :--- | :--- | :--- | :--- |
| **SSH (Ed25519)** ⭐ | প্রফেশনাল ডেভেলপমেন্ট ও নিয়মিত পুশ/পুল | **সর্বোচ্চ** (অ্যাসিমেট্রিক কি) | একবার সেট করলে আজীবন পাসওয়ার্ড ছাড়া দ্রুত কাজ |
| **GitHub CLI (\`gh\`)** ⭐ | টার্মিনাল লাভার ও পিআর/ইস্যু ম্যানেজমেন্ট | **সর্বোচ্চ** (OAuth + SSH) | \`gh auth login\` দিয়ে ১ মিনিটে রেডি |
| **GCM (HTTPS)** | উইন্ডোজ/ম্যাক আইডিই এবং বিগিনার ইউজার | **উচ্চ** (ওএস এনক্রিপ্টেড কি-চেইন) | ব্রাউজারে লগইন করলেই অটোমেটিক সেভ |
| **Fine-grained PAT** | সিআই/সিডি (CI/CD) ও অটোমেশন স্ক্রিপ্ট | **উচ্চ** (স্কোপ ও মেয়াদী টোকেন) | শুধুমাত্র নির্দিষ্ট রিপোর পারমিশন সীমাবদ্ধ রাখা যায় |
`,
  },

  {
    slug: "github-issues-and-projects",
    titleEn: "GitHub Issues & Project Management: Issues, Labels, Milestones, Assignees, Templates & Projects",
    titleBn: "গিটহাব ইস্যু ও প্রজেক্ট ম্যানেজমেন্ট: ইস্যু, লেবেল, মাইলস্টোন, অ্যাসাইনি, টেমপ্লেট ও প্রজেক্ট বোর্ড",
    categoryEn: "16. GitHub Issues & Project Management",
    categoryBn: "১৬. গিটহাব ইস্যু ও প্রজেক্ট ম্যানেজমেন্ট",
    categoryDescEn: "Managing bugs and features with GitHub Issues, label taxonomies, sprint milestones, team assignees, markdown issue templates, Kanban GitHub Projects, and automated issue tracking.",
    categoryDescBn: "গিটহাব ইস্যু দিয়ে বাগ ও ফিচার ট্র্যাকিং, লেবেল ট্যাক্সোনমি, স্প্রিন্ট মাইলস্টোন, টিম অ্যাসাইনি, মার্কডাউন ইস্যু টেমপ্লেট, কানবান প্রজেক্টস এবং অটোমেটিক পিআর ক্লোজিং।",
    categoryPriority: "CORE",
    descriptionEn: "Learn how modern software teams organize agile sprints, bug backlogs, custom issue templates, and interactive Kanban boards directly inside GitHub.",
    descriptionBn: "আধুনিক সফটওয়্যার দলগুলো কীভাবে গিটহাবে অ্যাজাইল স্প্রিন্ট, বাগ ট্র্যাকিং, কাস্টম ইস্যু টেমপ্লেট এবং ইন্টারঅ্যাক্টিভ কানবান বোর্ড পরিচালনা করে তা শিখুন।",
    difficulty: "EASY",
    displayOrder: 16,
    prerequisites: ["github-basics"],
    estimatedMinutes: 25,
    lastUpdated: "2026-09-13",
    resources: [
      {
        source: "GitHub Docs",
        title: "About GitHub Issues",
        url: "https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues",
        description: "Official guide on creating, organizing, and tracking issues on GitHub.",
        isStarred: true,
      },
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
        name: "How do you link a GitHub Pull Request to automatically close an issue upon merge, and what happens if the PR is closed without merging?",
        url: null,
        difficulty: "EASY",
        company: "Enosis Solutions",
        tags: ["GitHub", "Issues", "PR Linking", "Automation", "Project Management"],
        solutionEn: "In the PR description (or commit message), include supported closing keywords followed by the issue number, such as 'Fixes #42', 'Closes #15', or 'Resolves #89'. When the PR is merged into the default branch (main), GitHub automatically closes the issue and cross-references the PR in the issue timeline. If the PR is closed without being merged, the linked issue remains open and the timeline notes that the PR was closed unmerged.",
        solutionBn: "পিআরের ডেসক্রিপশনে বা কমিট মেসেজে 'Fixes #42', 'Closes #15' বা 'Resolves #89' লিখে দিলে পিআরটি ডিফল্ট ব্রাঞ্চে (main) মার্জ হওয়ার সাথে সাথে সংশ্লিষ্ট ইস্যুটি স্বয়ংক্রিয়ভাবে ক্লোজ হয়ে যায়। যদি পিআরটি মার্জ না করে এমনিতেই ক্লোজ বা ক্যানসেল করে দেওয়া হয়, তবে ইস্যুটি ক্লোজ হয় না, ওপেনই থাকে এবং টাইমলাইনে পিআর ক্যানসেলের রেকর্ড যুক্ত হয়।",
      },
    ],
    contentEn: `# 16. GitHub Issues & Project Management

Writing code is only half the battle; managing backlog priorities, tracking production bugs, and coordinating agile sprints is equally vital. GitHub provides a complete, integrated project management ecosystem alongside your source code.

---

## 1. Issues (What is an Issue & Anatomy)

### What is a GitHub Issue?
An **Issue** is an actionable unit of work or tracking item. Unlike Git commits (which track historical code diffs), GitHub Issues track human collaboration:
* **Bug Reports:** Documenting reproducible glitches or unexpected exceptions.
* **Feature Requests:** Proposing new functionality, architecture, or business logic.
* **Technical Debt & Tasks:** Refactoring legacy modules, upgrading dependencies, or updating documentation.

### Anatomy of an Issue:
1. **Title:** Concise summary (e.g., \`[BUG] Payment gateway timeout on SSLCommerz callback\`).
2. **Description:** Formatted with GitHub Flavored Markdown (GFM), including task checklists (\`- [ ]\`), code blocks, screenshots, or logs.
3. **Discussion Thread:** Team members comment, cross-reference commits, or link relevant PRs.
4. **State:** Either **Open** (active work pending) or **Closed** (resolved or discarded).

---

## 2. Labels (Taxonomy & Prioritization)

### What are Labels?
Labels are color-coded metadata tags used to categorize, filter, and prioritize issues and PRs across a repository.

### Recommended Production Label Taxonomy:
* **By Type (What is it?):**
  * \`type: bug\` (Red) — A defect requiring a fix.
  * \`type: feature\` (Green) — New user-facing capability.
  * \`type: refactor\` (Blue) — Internal code cleanup without altering behavior.
  * \`type: docs\` (Yellow) — Documentation updates.
* **By Priority (How urgent is it?):**
  * \`priority: P0-critical\` — Production blocker; drop everything to fix.
  * \`priority: P1-high\` — Important for current sprint release.
  * \`priority: P2-medium\` — Normal backlog item.
  * \`priority: P3-low\` — Nice to have / trivial cosmetic issue.
* **By Community / Triage:**
  * \`good first issue\` — Curated easy tasks for new contributors.
  * \`help wanted\` — Extra assistance needed from the team.
  * \`needs-repro\` — Cannot reproduce; awaiting reporter input.

---

## 3. Milestones (Sprint & Release Tracking)

### What is a Milestone?
A **Milestone** groups related issues and pull requests into a target delivery container or sprint cycle with an optional due date.

### Examples:
* \`Sprint 24 (Oct 1 - Oct 14)\`
* \`Release v2.0.0 (Major Launch)\`
* \`Q4 Security Hardening\`

### Milestone Features:
* **Progress Bar:** Visually tracks the real-time percentage of closed vs open issues and PRs.
* **Due Date:** Flags milestones that are approaching or overdue.
* **Scope Definition:** Helps team leads prevent scope creep by locking items to a specific delivery target.

---

## 4. Assignees (Responsibility & Accountability)

### Assigning Work:
* **Assignees:** You can assign up to **10 developers** to a single issue.
* Designates direct ownership and accountability so multiple team members don't duplicate effort.
* **Mentions (\`@username\`):** Mentioning colleagues in comments sends targeted notifications.
* **Filter by Assignee:** In the Issues search bar, find all tasks assigned to you:
  \`\`\`text
  is:issue is:open assignee:@me
  is:issue is:open no:assignee
  \`\`\`

---

## 5. Templates (Standardizing Reports with \`.github/\`)

Unstructured bug reports like *"The app crashed, please fix"* waste engineering time. **Issue Templates** enforce standardized questionnaires.

### Option A: Markdown Templates (\`.github/ISSUE_TEMPLATE/\`)
Create markdown templates in your repository:
\`\`\`markdown
<!-- .github/ISSUE_TEMPLATE/bug_report.md -->
---
name: Bug Report
about: Create a report to help us reproduce and fix a bug
title: '[BUG] '
labels: 'type: bug'
assignees: ''
---

### Describe the Bug
A clear description of what happened.

### Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. See error

### Expected Behavior
What you expected to happen.

### Environment
* OS: macOS / Ubuntu / Windows
* Browser / Runtime Version:
\`\`\`

### Option B: Modern Issue Forms (\`bug_report.yml\`)
GitHub also supports structured YAML form schemas with required input boxes, dropdown menus, and validation.

---

## 6. Projects (Kanban Boards, Tables & Roadmaps)

### What is GitHub Projects (Projects v2)?
GitHub Projects is a built-in project management tool that aggregates issues and PRs across multiple repositories into flexible views:

1. **Board View (Classic Kanban):**
   * Columns: \`Backlog\` ➔ \`Ready / Todo\` ➔ \`In Progress\` ➔ \`In Review\` ➔ \`Done\`.
   * Drag-and-drop cards as work progresses.
2. **Table View (Spreadsheet):**
   * Highly customizable columns: Status, Estimate (Story Points), Priority, Assignee, Sprint Iteration.
3. **Roadmap View (Timeline / Gantt):**
   * Visualizes delivery schedules and milestone overlaps across weeks or quarters.

### Built-in Automations:
* Automatically add newly created repository issues to your Project board.
* Automatically move card to \`In Progress\` when a linked branch or PR is created.
* Automatically move card to \`Done\` when the PR is merged into \`main\`.

---

## 7. Issue Tracking & Pull Request Linking (Best Practices)

### Automatic Issue Closing via Pull Requests:
You can close issues automatically upon PR merge using supported closing keywords in the PR body or commit message:

| Closing Keywords | Supported Variations | Example Syntax |
| :--- | :--- | :--- |
| **close** | closes, closed | \`Closes #42\` |
| **fix** | fixes, fixed | \`Fixes #108\` |
| **resolve** | resolves, resolved | \`Resolves #15\` |

> ⚠️ **Key Rule:** The issue will **ONLY close when the PR is merged into the default branch (\`main\`)**! Creating or approving a PR will not close the issue.

### Issue Search & Filter Shortcuts:
\`\`\`text
# All open bugs in current milestone
is:issue is:open label:"type: bug" milestone:"Release v1.2.0"

# Open issues with no one assigned
is:issue is:open no:assignee

# Issues assigned to you
is:issue is:open assignee:@me

# Closed issues in the last 7 days
is:issue is:closed closed:>2026-09-06
\`\`\`

### Managing Issues via GitHub CLI (\`gh\`):
\`\`\`bash
# Create a new issue interactively
gh issue create

# List open bugs
gh issue list --label "type: bug"

# View details of issue #42
gh issue view 42

# Close issue #42 with a comment
gh issue close 42 --comment "Resolved in PR #56"
\`\`\`
`,
    contentBn: `# ১৬. গিটহাব ইস্যু ও প্রজেক্ট ম্যানেজমেন্ট (GitHub Issues & Project Management)

শুধু কোড লেখাই একজন সফটওয়্যার ইঞ্জিনিয়ারের কাজ নয়; প্রজেক্টের বাগ ট্র্যাক করা, নতুন ফিচারের অগ্রাধিকার ঠিক করা এবং অ্যাজাইল স্প্রিন্ট প্ল্যানিং সমান গুরুত্বপূর্ণ। GitHub-এর নিজস্ব **Issues ও Projects** ইকোসিস্টেম কোডবেসের সাথে সরাসরি ইন্টিগ্রেটেড থেকে পুরো টিমকে এক সুতোয় বেঁধে রাখে।

---

## ১. Issues (গিটহাব ইস্যু কী ও এর গঠন)

### 🔹 গিটহাব ইস্যু কী?
**Issue** হলো যেকোনো প্রজেক্টের কাজের একটি সুস্পষ্ট ইউনিট বা ট্র্যাকিং আইটেম। গিট কমিট যেমন সোর্স কোডের পরিবর্তন ট্র্যাক করে, গিটহাব ইস্যু তেমনি মানুষের কাজের অগ্রগতি ট্র্যাক করে:
* **Bug Reports:** সফটওয়্যারে কোনো ত্রুটি বা ক্র্যাশ ধরা পড়লে তা সমাধান করার জন্য।
* **Feature Requests:** নতুন কোনো ফিচার বা বিজনেস লজিক যোগ করার প্রস্তাবনা।
* **Tech Debt & Tasks:** লাইব্রেরি ভার্সন আপগ্রেড, রিফ্যাক্টরিং বা ডকুমেন্টেশন লেখার টাস্ক।

### 🔹 একটি ইস্যুর অভ্যন্তরীণ উপাদানসমূহ:
1. **Title:** সংক্ষিপ্ত ও স্পষ্ট শিরোনাম (যেমন: \`[BUG] চেকআউট পেজে বিকাশ পেমেন্ট ওটিপি ভেরিফিকেশন ফেইল করছে\`)।
2. **Description:** মার্কডাউন (GFM) ফরম্যাটে বিস্তারিত বিবরণ, চেকলিস্ট (\`- [ ]\`), স্ক্রিনশট এবং ত্রুটির লগ।
3. **Discussion Thread:** টিমের সবাই কমেন্টে আলোচনা করতে পারে এবং নির্দিষ্ট কোড বা পিআর লিংক করতে পারে।
4. **State:** ইস্যুর স্ট্যাটাস হয় **Open** (কাজ বাকি) নয়তো **Closed** (সমাধান বা বাতিল)।

---

## ২. Labels (লেবেল ও ক্যাটাগরি ব্যবস্থাপনা)

### 🔹 লেবেল কেন ব্যবহার করবেন?
লেবেল হলো রঙিন ট্যাগ যার মাধ্যমে হাজার হাজার ইস্যুর ভেতর থেকে প্রয়োজনীয় ইস্যুগুলোকে ফিল্টার, ক্যাটাগরাইজ ও প্রায়োরিটাইজ করা যায়।

### 🔹 প্রফেশনাল টিম ট্যাক্সোনমি (Industry Standard):
* **টাইপ অনুযায়ী (Type):**
  * \`type: bug\` (লাল) — বাগ বা ক্র্যাশ ফিক্স।
  * \`type: feature\` (সবুজ) — নতুন রিকোয়েস্টেড ফিচার।
  * \`type: refactor\` (নীল) — ইন্টারনাল কোড ক্লিনআপ।
  * \`type: docs\` (হলুদ) — ডকুমেন্টেশন আপডেট।
* **জরুরি ভিত্তিতে (Priority):**
  * \`priority: P0-critical\` — প্রোডাকশন ডাউন; এখনই সবার আগে ঠিক করতে হবে।
  * \`priority: P1-high\` — চলতি স্প্রিন্টের জন্য অতি জরুরি।
  * \`priority: P2-medium\` — সাধারণ ব্যাকলগ আইটেম।
  * \`priority: P3-low\` — সময় পেলে পরে করা যাবে।
* **কমিউনিটি ও ট্রায়াজ:**
  * \`good first issue\` — নতুন জয়েন করা জুনিয়র ডেভেলপার বা ওপেন সোর্স কন্ট্রিবিউটরদের জন্য সহজ টাস্ক।
  * \`help wanted\` — অন্য কারো সহায়তা বা স্পেশালাইজড মতামত প্রয়োজন।
  * \`needs-repro\` — বাগটি ডেভেলপার রিপ্রোডিউস করতে পারছেন না, ইউজারের বিস্তারিত তথ্য দরকার।

---

## ৩. Milestones (মাইলস্টোন ও স্প্রিন্ট ট্র্যাকিং)

### 🔹 মাইলস্টোন কী?
একটি নির্দিষ্ট ডেডলাইন বা ডেলিভারি টার্গেটকে সামনে রেখে সম্পর্কিত একগুচ্ছ ইস্যু এবং পুল রিকোয়েস্টকে একটি ফোল্ডারে বাঁধার নাম হলো **Milestone**।

### 🔹 বাস্তব উদাহরণ:
* \`Sprint 24 (Oct 1 - Oct 14)\`
* \`Release v2.0.0 (Production Launch)\`
* \`Q4 Database Migration\`

### 🔹 মাইলস্টোনের সুবিধাসমূহ:
* **Progress Bar:** মাইলস্টোনের কয়টি কাজ সম্পন্ন হয়েছে এবং কয়টি বাকি তার একটি রিয়েল-টাইম পার্সেন্টেজ বার দেখা যায়।
* **Due Date:** নির্ধারিত ডেডলাইনের কতদিন বাকি আছে তা ক্যালেন্ডার ডেট সহ মনে করিয়ে দেয়।
* **স্কোপ নিয়ন্ত্রন:** টিমে অযাচিত কাজের চাপ কমানো ও সময়মতো রিলিজ নিশ্চিত করা যায়।

---

## ৪. Assignees (দায়িত্ব বণ্টন ও ট্র্যাকিং)

### 🔹 কাজের দায়িত্ব প্রদান:
* **Assignees:** একটি ইস্যুতে সর্বোচ্চ **১০ জন ডেভেলপারকে** যুক্ত করা যায়।
* এর মাধ্যমে নিশ্চিত করা হয় কাজটি ঠিক কে বা কারা লিড দিচ্ছেন, যাতে একাধিক ডেভেলপার একই কাজে সময় নষ্ট না করেন।
* **Mentions (\`@username\`):** কমেন্টে নির্দিষ্ট টিম মেম্বারকে মেনশন করলে তার কাছে ইনস্ট্যান্ট নোটিফিকেশন যায়।
* **অ্যাসাইনি দিয়ে সার্চ:**
  \`\`\`text
  is:issue is:open assignee:@me   # আমার ওপর এসাইন করা সমস্ত কাজ
  is:issue is:open no:assignee     # যে কাজগুলো এখনো কাউকে দেওয়া হয়নি
  \`\`\`

---

## ৫. Templates (ইস্যু টেমপ্লেট — \`.github/ISSUE_TEMPLATE/\`)

সাধারণ ইউজার বা কিউএ (QA) ইঞ্জিনিয়াররা যেন শুধু "লগইন হচ্ছে না" লিখে অস্পষ্ট ইস্যু না খোলেন, সেজন্য প্রজেক্টে **Issue Template** সেটআপ করা হয়।

### 🔹 মার্কডাউন টেমপ্লেট উদাহরণ:
রিপোজিটরির \`.github/ISSUE_TEMPLATE/bug_report.md\` ফাইলে নিচের মতো টেমপ্লেট রাখুন:

\`\`\`markdown
---
name: Bug Report
about: সফটওয়্যারের কোনো বাগ রিপোর্ট করতে এই ফর্মটি পূরণ করুন
title: '[BUG] '
labels: 'type: bug'
assignees: ''
---

### বাগের সংক্ষিপ্ত বিবরণ
কী সমস্যা হচ্ছে তা স্পষ্টভাবে লিখুন।

### সমস্যাটি যেভাবে পুনরায় দেখা যাবে (Steps to Reproduce)
1. প্রথমে '...' পেজে যান
2. এরপর '...' বাটনে ক্লিক করুন
3. দেখুন এরর মেসেজ দেখাচ্ছে

### প্রত্যাশিত আচরণ (Expected Behavior)
আসলে কী ঘটার কথা ছিল।

### পরিবেশ (Environment)
* OS: Windows / macOS / Linux
* Browser: Chrome / Firefox
\`\`\`

---

## ৬. Projects (গিটহাব প্রজেক্টস — Kanban Boards ও Roadmaps)

### 🔹 GitHub Projects (v2) কী?
ট্রেলে (Trello) বা জিরার (Jira) মতো গিটহাবের নিজস্ব চমৎকার প্রজেক্ট ম্যানেজমেন্ট প্ল্যাটফর্ম হলো GitHub Projects:

1. **Board View (ঐতিহ্যবাহী কানবান বোর্ড):**
   * কলামসমূহ: \`Backlog\` ➔ \`Ready / Todo\` ➔ \`In Progress\` ➔ \`In Review\` ➔ \`Done\`।
   * কাজের সাথে সাথে কার্ড এক কলাম থেকে অন্য কলামে ড্র্যাগ-অ্যান্ড-ড্রপ করা যায়।
2. **Table View (স্প্রেডশিট ভিউ):**
   * এক্সেল বা নোশনের মতো টেবিল যেখানে কাস্টম ফিল্ড যোগ করা যায় (যেমন: Story Points, Priority, Sprint Iteration)।
3. **Roadmap View (টাইমলাইন / গ্যান্ট চার্ট):**
   * কোয়ার্টার বা মাসের ক্যালেন্ডারে কোন ফিচারের কাজ কবে শুরু হয়ে কবে শেষ হবে তার ভিজ্যুয়াল রোডম্যাপ।

### 🔹 অটোমেশন ফিচার:
* নতুন ইস্যু খোলার সাথে সাথে স্বয়ংক্রিয়ভাবে প্রজেক্ট বোর্ডে কার্ড তৈরি হওয়া।
* পিআর ওপেন হলে কার্ড নিজে থেকেই \`In Progress\`-এ চলে যাওয়া।
* পিআর মেইন ব্রাঞ্চে মার্জ হওয়ামাত্র কার্ডটি স্বয়ংক্রিয়ভাবে \`Done\` কলামে চলে যাওয়া!

---

## ৭. Issue Tracking & PR Linking (অটোমেশন টেকনিক)

### 🔹 Pull Request দিয়ে স্বয়ংক্রিয়ভাবে ইস্যু বন্ধ করা:
পিআরের ডেসক্রিপশনে বা কমিট মেসেজে নির্দিষ্ট কিছু কিওয়ার্ডের সাথে ইস্যু নম্বর লিখে দিলে পিআর মার্জ হওয়ার সাথে সাথে সংশ্লিষ্ট ইস্যুটি নিজে থেকেই ক্লোজ হয়ে যায়:

| কিওয়ার্ড | সমর্থিত রূপসমূহ | উদাহরণ সিনট্যাক্স |
| :--- | :--- | :--- |
| **close** | closes, closed | \`Closes #42\` |
| **fix** | fixes, fixed | \`Fixes #108\` |
| **resolve** | resolves, resolved | \`Resolves #15\` |

> ⚠️ **গোল্ডেন রুল:** পিআরটি যখন **ডিফল্ট ব্রাঞ্চে (main)** মার্জ হবে, ঠিক তখনই ইস্যুটি বন্ধ হবে। পিআর ড্রাফট অবস্থায় থাকলে বা মার্জ না করে ক্যানসেল করলে ইস্যুটি বন্ধ হবে না।

### 🔹 ইস্যু সার্চ করার পাওয়ারফুল ফিল্টারসমূহ:
\`\`\`text
# নির্দিষ্ট লেবেলের সমস্ত ওপেন বাগ দেখতে
is:issue is:open label:"type: bug"

# কাউকে এসাইন না করা খালি ইস্যু দেখতে
is:issue is:open no:assignee

# আমার ওপর অর্পিত সমস্ত ওপেন কাজ
is:issue is:open assignee:@me

# নির্দিষ্ট মাইলস্টোনের কাজ
is:issue is:open milestone:"Sprint 24"
\`\`\`

### 🔹 GitHub CLI (\`gh\`) দিয়ে টার্মিনাল থেকেই ইস্যু ম্যানেজমেন্ট:
\`\`\`bash
# টার্মিনাল থেকে সরাসরি নতুন ইস্যু তৈরি করা
gh issue create --title "বিকাশ পেমেন্ট বাগ" --body "বিস্তারিত বিবরণ..." --label "type: bug"

# ওপেন বাগগুলোর তালিকা টার্মিনালে দেখা
gh issue list --label "type: bug"

# নির্দিষ্ট ইস্যুর বিস্তারিত ও কমেন্ট পড়া
gh issue view 42

# কমেন্ট সহ ইস্যু বন্ধ করা
gh issue close 42 --comment "PR #56 তে এটি সমাধান করা হয়েছে"
\`\`\`
`,
  },

  {
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
  },

  {
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
  },
];

