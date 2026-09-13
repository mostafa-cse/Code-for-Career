import type { LocalLesson } from "@/lib/lessons-data";

export const githubAuthenticationLesson: LocalLesson = {
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
* **Ed25519 (Recommended):** Modern elliptic curve cryptography (256-bit). Faster, smaller, more secure.
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

| Feature | Fine-grained PAT (Recommended) | PAT (Classic) |
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
1. *What account do you want to log into?* -> **GitHub.com**
2. *What is your preferred protocol for Git operations?* -> **SSH** (or **HTTPS**)
3. *Generate a new SSH key to add to your GitHub account?* -> **Yes** (or select existing)
4. *How would you like to authenticate GitHub CLI?* -> **Login with a web browser**
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

# AVOID: 'store' saves your password in plaintext ~/.git-credentials!
\`\`\`

### How to Reset / Clear Expired Stored Credentials:
* **macOS:** Open **Keychain Access** app -> search for \`github.com\` -> delete the saved internet password entry.
* **Windows:** Open **Credential Manager** -> **Windows Credentials** -> under *Generic Credentials*, find \`git:https://github.com\` -> click **Remove**.
* **Terminal CLI Command:**
  \`\`\`bash
  echo "url=https://github.com" | git credential reject
  \`\`\`

---

## Comparison Summary: Which Auth Method Should You Use?

| Method | Best For | Security Level | Maintenance |
| :--- | :--- | :--- | :--- |
| **SSH (Ed25519)** | Daily development, terminal power users | **Highest** (Asymmetric crypto) | Set up once, works forever |
| **GitHub CLI (\`gh\`)** | All-in-one terminal & PR management | **Highest** (OAuth + SSH) | 1 command (\`gh auth login\`) |
| **GCM (HTTPS)** | GUI developers, Windows IDE users | **High** (OS encrypted token) | Browser pop-up login |
| **Fine-grained PAT** | CI/CD runners, automated deployment scripts | **High** (Scoped & expiring) | Must renew upon expiration |
`,
    contentBn: `# ১৫. গিটহাব অথেনটিকেশন (GitHub Authentication)

আপনার লোকাল কম্পিউটার এবং রিমোট গিটহাব রিপোজিটরির মধ্যে সুরক্ষিত কানেকশন স্থাপন করা সফটওয়্যার ইঞ্জিনিয়ারিংয়ের সবচেয়ে মৌলিক ভিত্তি। ২০২১ সালের ১৩ই আগস্ট থেকে **GitHub গিট পুশ বা পুলের জন্য অ্যাকাউন্টের সাধারণ পাসওয়ার্ড সম্পূর্ণ বন্ধ করে দিয়েছে**।

---

## ১. HTTPS (Hypertext Transfer Protocol Secure)

### HTTPS কীভাবে কাজ করে?
HTTPS পদ্ধতিতে রিপোজিটরি ক্লোন বা পুশ করার সময় ইউআরএল দেখতে হয় এমন: \`https://github.com/username/repo.git\`। এটি ওয়েবের সাধারণ এনক্রিপ্টেড TLS পোর্ট ৪৪৩ (Port 443) ব্যবহার করে যোগাযোগ করে।

### সাধারণ পাসওয়ার্ড কেন বাতিল করা হলো?
1. **নির্দিষ্ট পারমিশন বা স্কোপ থাকে না:** অ্যাকাউন্টের পাসওয়ার্ড দিয়ে যেকেউ পুরো প্রোফাইল ডিলিট, বিলিং বা প্রাইভেট সব রিপোজিটরিতে পূর্ণ নিয়ন্ত্রণ নিয়ে নিতে পারে।
2. **মেয়াদ উত্তীর্ণ হয় না:** পাসওয়ার্ড নিজে নিজে এক্সপায়ার হয় না, ফলে ফিশিং বা চুরির ঝুঁকি থাকে।
3. **টু-ফ্যাক্টর অথেনটিকেশন (2FA) অচল:** টার্মিনালে ইউজারনেম-পাসওয়ার্ড চাইলে মোবাইলের 2FA কোড দেওয়ার ব্যবস্থা থাকে না।

### আধুনিক HTTPS অথেনটিকেশন:
বর্তমানে টার্মিনালে HTTPS পুশ করার সময় পাসওয়ার্ড প্রম্পট আসলে:
* **Username:** আপনার গিটহাব ইউজারনেম।
* **Password:** আপনার তৈরি করা **Personal Access Token (PAT)** অথবা ব্রাউজার লগইনের মাধ্যমে **Git Credential Manager (GCM)**।

### কখন HTTPS ব্যবহার করবেন?
* অফিসের বা ইউনিভার্সিটির ফায়ারওয়াল যেখানে SSH পোর্ট ২২ (Port 22) ব্লক করা থাকে।
* ওপেন-সোর্স প্রজেক্টের কোড SSH সেটআপ ছাড়াই চটজলদি ক্লোন করার জন্য।

---

## ২. SSH (Secure Shell)

### SSH কী এবং কীভাবে কাজ করে?
SSH হলো একটি ক্রিপ্টোগ্রাফিক নেটওয়ার্ক প্রোটোকল। সফটওয়্যার ডেভেলপারদের জন্য এটি হলো সবচেয়ে জনপ্রিয় ও আরামদায়ক পদ্ধতি, কারণ এতে **কখনোই বারবার ইউজারনেম বা পাসওয়ার্ড টাইপ করতে হয় না**।

### মেন্টাল মডেল: অ্যাসিমেট্রিক পাবলিক-প্রাইভেট কি (Public-Key Cryptography)
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

### SSH ইউআরএল ফরম্যাট:
\`\`\`bash
git clone git@github.com:username/repository.git
\`\`\`

---

## ৩. SSH Keys (তৈরি, কনফিগারেশন ও কানেকশন টেস্ট)

### অ্যালগরিদম নির্বাচন: Ed25519 বনাম RSA
* **Ed25519 (Recommended):** আধুনিক উপবৃত্তাকার বক্ররেখা (Elliptic Curve 256-bit)। এটি অবিশ্বাস্য রকমের দ্রুত, হালকা এবং সবচেয়ে বেশি নিরাপদ।
* **RSA (4096-bit):** পুরোনো স্ট্যান্ডার্ড। পুরোনো লিগ্যাসি সার্ভার ছাড়া নতুন কাজে RSA ব্যবহার অপ্রয়োজনীয়।
* *(কখনোই DSA বা 1024-bit RSA ব্যবহার করবেন না, এগুলো অনিরাপদ ও বাতিল ঘোষিত)।*

### স্টেপ-বাই-স্টেপ সেটআপ গাইড:

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

### PAT কী?
পার্সোনাল অ্যাক্সেস টোকেন হলো ক্রিপ্টোগ্রাফিক অ্যালগরিদম দিয়ে তৈরি একটি দীর্ঘ স্ট্রিং, যা HTTPS অপারেশনে পাসওয়ার্ডের বিকল্প হিসেবে ব্যবহৃত হয়।

### টোকেনের প্রকারভেদ:

| বৈশিষ্ট্য | Fine-grained PAT (রিকমেন্ডেড) | PAT Classic |
| :--- | :--- | :--- |
| **রিপোজিটরির পরিধি** | শুধুমাত্র নির্দিষ্ট রিপোজিটরি সিলেক্ট করা যায় | অ্যাকাউন্টের সমস্ত রিপোজিটরিতে এক্সেস পায় |
| **অনুমতি (Permissions)** | সূক্ষ্মভাবে নিয়ন্ত্রণযোগ্য (যেমন: শুধু কোড রিড/রাইট) | ঢালাও বড় বড় স্কোপ (\`repo\`, \`admin\`) |
| **মেয়াদ (Expiry)** | সর্বোচ্চ ১ বছরের মধ্যে মেয়াদ নির্ধারণ বাধ্যতামূলক | "No expiration" দেওয়া যায় (যা ঝুঁকিপূর্ণ) |
| **অর্গানাইজেশন সুরক্ষা** | কোম্পানি চাইলে টোকেন রিভিউ ও ব্লক করতে পারে | অ্যাডমিনের কোনো সরাসরি নিয়ন্ত্রণ থাকে না |

### Fine-grained PAT তৈরির নিয়ম:
1. **GitHub** > **Settings** > **Developer settings** > **Personal access tokens** > **Fine-grained tokens**-এ যান।
2. **Generate new token**-এ ক্লিক করুন।
3. টোকেনের নাম, মেয়াদ এবং নির্দিষ্ট রিপোজিটরি সিলেক্ট করুন।
4. **Permissions** থেকে **Contents**-এ Read and Write পারমিশন দিন।
5. টোকেন তৈরি হলে সাথে সাথে কপি করে নিরাপদ স্থানে রাখুন (\`github_pat_...\`)। এই টোকেনটি দ্বিতীয়বার আর দেখতে পাবেন না।

---

## ৫. GitHub CLI Authentication (\`gh auth\`)

গিটহাবের অফিসিয়াল কমান্ড লাইন টুল **GitHub CLI (\`gh\`)** হলো সবচেয়ে দ্রুত ও ঝামেলাহীন অথেনটিকেশন পদ্ধতি। কোনো ফাইল খোঁজাখুঁজি বা কপি-পেস্ট ছাড়াই এটি সম্পূর্ণ অথেনটিকেশন করে দেয়।

### ইন্টারেক্টিভ উইজার্ড দিয়ে লগইন:
\`\`\`bash
gh auth login
\`\`\`
টার্মিনাল আপনাকে সহজ কয়েকটি প্রশ্ন করবে:
1. *What account do you want to log into?* -> **GitHub.com**
2. *What is your preferred protocol for Git operations?* -> **SSH** (অথবা **HTTPS**)
3. *Generate a new SSH key to add to your GitHub account?* -> **Yes**
4. *How would you like to authenticate GitHub CLI?* -> **Login with a web browser**
5. টার্মিনালে আসা ৮ অক্ষরের ওটিপি কোডটি ব্রাউজারে পেস্ট করলেই বাজিমাত!

### সিএলআই ম্যানেজমেন্ট কমান্ড:
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

### Git Credential Manager (GCM) কী?
Git Credential Manager হলো একটি সিকিউর টুল যা উইন্ডোজ ও ম্যাকের সাথে ডিফল্টভাবে থাকে। আপনি যখন HTTPS দিয়ে পুশ করতে যান, এটি নিজে থেকেই একটি ব্রাউজার পপআপ খুলে টু-ফ্যাক্টর অথেনটিকেশন (2FA) করিয়ে নেয় এবং টোকেনটি আপনার কম্পিউটারের নিজস্ব এনক্রিপ্টেড ভল্টে সেভ করে রাখে:
* **macOS:** Apple Keychain Access
* **Windows:** Windows Credential Manager
* **Linux:** Secret Service API (\`libsecret\`)

### ক্রেডেনশিয়াল হেল্পার চেক ও কনফিগারেশন:
\`\`\`bash
# আপনার কম্পিউটারে বর্তমানে কোন হেল্পার চালু আছে দেখতে
git config --get credential.helper

# ম্যাকের নেটিভ কি-চেইন চালু করতে:
git config --global credential.helper osxkeychain

# উইন্ডোজ ও ক্রস-প্ল্যাটফর্ম GCM চালু করতে:
git config --global credential.helper manager

# লিনাক্স সার্ভারে সাময়িক ১ ঘণ্টার জন্য মেমোরিতে ক্যাশ করতে:
git config --global credential.helper "cache --timeout=3600"

# সাবধান: ভুলেও 'store' হেল্পার দেবেন না, এটি প্লেইন টেক্সট ফাইলে পাসওয়ার্ড জমায়!
\`\`\`

### পুরোনো বা ভুল ক্রেডেনশিয়াল মুছে রিসেট করার নিয়ম:
* **macOS:** **Keychain Access** অ্যাপ ওপেন করুন -> সার্চ বক্সে \`github.com\` লিখুন -> এন্ট্রি সিলেক্ট করে ডিলিট করে দিন।
* **Windows:** **Credential Manager** ওপেন করুন -> **Windows Credentials**-এ যান -> *Generic Credentials* এর ভেতর \`git:https://github.com\` মুছে দিন।
* **টার্মিনাল দিয়ে এক লাইনে রিজেক্ট করতে:**
  \`\`\`bash
  echo "url=https://github.com" | git credential reject
  \`\`\`

---

## কোনটা কখন ব্যবহার করবেন?

| মেথড | কার জন্য সেরা | নিরাপত্তার মাত্রা | সুবিধা |
| :--- | :--- | :--- | :--- |
| **SSH (Ed25519)** | প্রফেশনাল ডেভেলপমেন্ট ও নিয়মিত পুশ/পুল | **সর্বোচ্চ** (অ্যাসিমেট্রিক কি) | একবার সেট করলে আজীবন পাসওয়ার্ড ছাড়া দ্রুত কাজ |
| **GitHub CLI (\`gh\`)** | টার্মিনাল লাভার ও পিআর/ইস্যু ম্যানেজমেন্ট | **সর্বোচ্চ** (OAuth + SSH) | \`gh auth login\` দিয়ে ১ মিনিটে রেডি |
| **GCM (HTTPS)** | উইন্ডোজ/ম্যাক আইডিই এবং বিগিনার ইউজার | **উচ্চ** (ওএস এনক্রিপ্টেড কি-চেইন) | ব্রাউজারে লগইন করলেই অটোমেটিক সেভ |
| **Fine-grained PAT** | সিআই/সিডি (CI/CD) ও অটোমেশন স্ক্রিপ্ট | **উচ্চ** (স্কোপ ও মেয়াদী টোকেন) | শুধুমাত্র নির্দিষ্ট রিপোর পারমিশন সীমাবদ্ধ রাখা যায় |
`,
  };
