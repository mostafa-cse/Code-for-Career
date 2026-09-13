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
