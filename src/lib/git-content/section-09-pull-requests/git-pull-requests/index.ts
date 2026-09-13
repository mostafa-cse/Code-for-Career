import type { LocalLesson } from "@/lib/lessons-data";

export const gitPullRequestsLesson: LocalLesson = {
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

In modern engineering teams, **no developer pushes code directly to the production branch (\`main\`)**. Every single feature, optimization, and bugfix must go through a **Pull Request (PR)**. A PR is where engineering collaboration, automated testing, security checks, and mentorship happen.

Here is the complete guide across all 9 core stages of the Pull Request lifecycle:

---

## 1. What is a Pull Request (PR)?

### Real-world Analogy:
> Imagine you are an architect designing a bridge. You do not pour concrete directly across the river on day one. Instead, you create a detailed blueprint on your drawing board, invite senior structural engineers to inspect every calculation, make necessary adjustments, and only after their formal sign-off does the construction crew build the bridge into the city.

### Definition:
A **Pull Request** is a formal proposal asking repository maintainers and teammates to review changes on a feature branch (e.g., \`feature/order-api\`) and merge them into the target base branch (e.g., \`main\`).

> **Why is it called "Pull" Request?**  
> Because you are politely requesting the repository maintainer: *"I have built this feature in my branch; please **pull** my changes into your primary project."*

*Note: A Pull Request is a collaborative platform feature pioneered by GitHub, GitLab (where it is called a "Merge Request"), and Bitbucket; it is not a raw Git terminal command.*

---

## 2. Creating a PR (Step-by-Step)

### Prerequisites (Terminal Workflow):
\`\`\`bash
# 1. Create and switch to a new feature branch:
git switch -c feature/stripe-payment

# 2. Make changes, stage, and commit:
git add .
git commit -m "feat(billing): integrate Stripe checkout sessions"

# 3. Push branch to GitHub and set tracking:
git push -u origin feature/stripe-payment
\`\`\`

### Creating via GitHub Web UI:
1. Navigate to your repository on [GitHub](https://github.com).
2. You will see a yellow notification banner: **"feature/stripe-payment had recent pushes — Compare & pull request"**. Click it.
3. Select your branches:
   - **Base branch** (\`main\`): The target branch where you want code to go.
   - **Compare branch** (\`feature/stripe-payment\`): The branch containing your new work.
4. Fill in the **Title** and **Description**.
5. Assign **Reviewers** (teammates whose approval you need) and **Assignees** (yourself).
6. Click **Create pull request** (or click the arrow to select **Create draft pull request** if work is still in progress).

### Creating via GitHub CLI (\`gh\`):
\`\`\`bash
gh pr create --title "feat(billing): integrate Stripe checkout sessions" --body "Implements checkout webhook & session creation." --base main
\`\`\`

---

## 3. Writing an Exceptional PR Description

A PR with no description forces reviewers to guess your intentions and slows down code review by days. Follow this standardized production-grade template:

\`\`\`markdown
## 📝 Summary of Changes
- Integrated Stripe Checkout Session API for subscription payments.
- Created secure Stripe webhook handler (\`/api/v1/webhooks/stripe\`) with cryptographic signature validation.
- Added Redis idempotency locking to prevent double-charging on duplicate webhook deliveries.

## 🔗 Related Ticket / Issue
Closes #142 (Fixes subscription checkout failure on retry).

## 🧪 How to Test Locally
1. Run dependencies: \`docker-compose up -d\`
2. Forward test webhooks using Stripe CLI:
   \`stripe listen --forward-to localhost:5000/api/v1/webhooks/stripe\`
3. Trigger test checkout: \`stripe trigger payment_intent.succeeded\`
4. Verify user record in PostgreSQL has \`subscription_status = 'active'\`.

## 📸 Screenshots / Demos (For UI changes)
| Before (Error) | After (Success Modal) |
| :---: | :---: |
| ![Before](https://placehold.co/300x200?text=Error) | ![After](https://placehold.co/300x200?text=Success) |

## ✅ Author Checklist
- [x] Automated unit and integration tests added and passing
- [x] No hardcoded secrets, API keys, or development credentials
- [x] Database migration scripts tested forward and backward
- [x] API documentation updated in Swagger/OpenAPI
\`\`\`

---

## 4. Code Review: Principles & Culture

Code review is NOT about finding fault with teammates; it is a **safety net for software quality** and a forum for continuous team learning.

### What Reviewers Look For:
1. **Functional Correctness**: Does the code actually solve the problem without introducing edge-case bugs (e.g., \`null\` pointers, off-by-one errors)?
2. **Security Vulnerabilities**: Are user inputs sanitized? Are endpoints protected by authentication and authorization checks?
3. **Performance & Scalability**: Are there $N+1$ database query loops? Are memory-heavy objects disposed of properly?
4. **Maintainability & Clean Architecture**: Are variables named clearly? Does the design adhere to SOLID principles and DRY?
5. **Test Coverage**: Are negative scenarios and edge cases tested?

---

## 5. Review Comments (Inline Feedback & Suggestions)

Reviewers leave comments directly on lines of code in the **Files changed** tab.

### How to leave comments:
* Hover over any line number in the diff and click the blue **\`+\`** button.
* Select **Start a review** (this batches all your comments together so the author receives only **one notification email** when you finish, rather than 20 separate pings).

### One-Click Suggestion Blocks:
Reviewers can write concrete code suggestions that the author can accept with a single click:

\`\`\`markdown
\`\`\`suggestion
const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
\`\`\`
\`\`\`

### Conventional Comment Prefixes:
- \`[nit]\`: Minor style or typo preference (not blocking).
- \`[question]\`: Seeking clarification on why an approach was taken.
- \`[suggestion]\`: Recommended alternative implementation.
- \`[blocking]\`: Must be fixed before this PR can be merged.

---

## 6. Approve PR (Green Light)

When you have reviewed the code, verified tests, and are confident that the changes are production-ready:

1. Click **Review changes** in the top-right corner of the PR.
2. Write a brief concluding note (e.g., *"Clean implementation and thorough tests. LGTM! (Looks Good To Me)"*).
3. Select **Approve**.
4. Click **Submit review**.

> This turns your review state into a **green checkmark** (✅), satisfying branch protection rules that require peer sign-off.

---

## 7. Request Changes (Blocking Bugs)

If you find a critical bug, broken business requirement, memory leak, or security issue, you must block merging until it is resolved.

1. Click **Review changes**.
2. Clearly explain **why** the issue is dangerous and how to fix it.
3. Select **Request changes**.
4. Click **Submit review**.

> This places a **red X** (❌) on the PR and blocks the **Merge** button.

### How the Author Resolves Changes:
1. Fix the issues locally on the same feature branch.
2. Commit and push:
   \`\`\`bash
   git add .
   git commit -m "fix(billing): address PR review comments on idempotency key"
   git push origin feature/stripe-payment
   \`\`\`
3. The PR updates automatically on GitHub with the new commits!
4. Click the **Re-request review** icon (🔄) next to the reviewer's name to invite them back.

---

## 8. Merge PR (Merging Strategies)

Once all checks pass (green CI build, required approvals, zero unresolved conversations), the green **Merge pull request** button becomes active.

GitHub provides 3 distinct merge strategies:

| Strategy | What happens to commit history? | Ideal Use Case |
| :--- | :--- | :--- |
| **Squash and merge ⭐** | Condenses all 15 messy feature commits into **1 clean, atomic commit** on \`main\`. | **Most popular in enterprise & startups**. Keeps the primary git history clean, readable, and easy to revert. |
| **Create a merge commit** | Keeps every single intermediate commit and creates a 3-way merge commit on \`main\`. | Open-source libraries where granular individual author commits must be preserved. |
| **Rebase and merge** | Replays each commit individually on top of \`main\` without creating a merge commit. | Teams that want a strictly linear history but want to retain individual commits. |

*Always delete the feature branch after merging using the "Delete branch" button to keep your repository clean!*

---

## 9. Close PR (Without Merging)

Sometimes a PR is no longer needed:
- The business requirement was cancelled.
- An alternative architectural approach was chosen in another PR.
- The PR was an experimental prototype.

### How to close properly:
1. Write a polite and clear comment explaining why the PR is being closed so future engineers understand the context.
2. Click **Close pull request** (or **Close with comment**).
3. If circumstances change later, you can reopen it anytime by clicking **Reopen pull request**.
`,
    contentBn: `# পুল রিকোয়েস্ট: পিআর তৈরি, কোড রিভিউ, অ্যাপ্রুভাল ও মার্জ স্ট্র্যাটেজি

আধুনিক সফটওয়্যার ইঞ্জিনিয়ারিং টিমে **কোনো ডেভেলপার সরাসরি প্রোডাকশন ব্রাঞ্চে (\`main\`) কোড পুশ করতে পারেন না**। প্রতিটি নতুন ফিচার, বাগ ফিক্স বা পারফরম্যান্স অপ্টিমাইজেশনকে অবশ্যই একটি **Pull Request (PR)** প্রক্রিয়ার মধ্য দিয়ে যেতে হয়। একটি পিআর হলো কোডের মান যাচাই, অটোমেটিক টেস্ট রান, নিরাপত্তা চেক এবং সিনিয়র ডেভেলপারদের কাছ থেকে মেন্টরশিপ নেওয়ার মূল মিলনস্থল।

নিচে পুল রিকোয়েস্ট লাইফসাইকেলের পূর্ণাঙ্গ ৯টি ধাপ সহজ ভাষায় ব্যাখ্যা করা হলো:

---

## ১. পুল রিকোয়েস্ট (Pull Request) কী?

### বাস্তব জীবনের উপমা:
> মনে করুন আপনি একটি আর্কিটেকচার ফার্মে ব্রিজ ডিজাইনার হিসেবে কাজ করছেন। আপনি প্রথম দিনই নদীর উপর সরাসরি ব্রিজের পিলার ঢালাই করবেন না। প্রথমে আপনি একটি ব্লুপ্রিন্ট তৈরি করবেন, সিনিয়র ইঞ্জিনিয়ারদের সামনে তা উপস্থাপন করবেন, তাঁরা প্রতিটি হিসাব-নিকাশ খতিয়ে দেখে মতামত দেবেন। সবাই নিশ্চিত ও সন্তুষ্ট হয়ে লিখিত অনুমোদন দিলে তবেই মূল ব্রিজ তৈরি হবে।

### সংজ্ঞা:
**Pull Request** হলো মূল প্রজেক্ট রক্ষণাবেক্ষণকারীদের (Maintainers / Tech Leads) কাছে একটি আনুষ্ঠানিক প্রস্তাব, যেখানে আপনি আবেদন করেন: *"আমি \`feature/order-api\` ব্রাঞ্চে নতুন কোড লিখেছি; দয়া করে কোডটি রিভিউ করে আপনার মূল \`main\` ব্রাঞ্চে মার্জ বা পুল করুন।"*

> **কেন একে "Pull" Request বলা হয়?**  
> কারণ আপনি দলের প্রধানকে বিনীতভাবে বলছেন: *"Please **pull** my changes into your repository."*

*মনে রাখবেন: এটি গিটহাব, গিটল্যাব (যেখানে একে "Merge Request" বলা হয়) বা বিটবাকেটের কোলাবোরেশন ফিচার; এটি গিটের কোনো লোকাল টার্মিনাল কমান্ড নয়।*

---

## ২. পিআর তৈরি (Creating a PR)

### টার্মিনালে পূর্বপ্রস্তুতি:
\`\`\`bash
# ১. নতুন ফিচার ব্রাঞ্চ তৈরি করে সুইচ করুন:
git switch -c feature/stripe-payment

# ২. কোড লিখে কমিট করুন:
git add .
git commit -m "feat(billing): integrate Stripe checkout sessions"

# ৩. গিটহাবে ব্রাঞ্চটি পুশ করুন:
git push -u origin feature/stripe-payment
\`\`\`

### গিটহাব ওয়েব ইন্টারফেসে তৈরি:
1. [GitHub](https://github.com)-এ আপনার রিপোজিটরিতে যান।
2. উপরে একটি হলুদ নোটিফিকেশন ব্যানার দেখতে পাবেন: **"Compare & pull request"**। সেখানে ক্লিক করুন।
3. ব্রাঞ্চ নিশ্চিত করুন:
   - **Base branch** (\`main\`): যেখানে কোড জমা হবে।
   - **Compare branch** (\`feature/stripe-payment\`): আপনার নতুন ব্রাঞ্চ।
4. **Title** এবং **Description** পূরণ করুন।
5. ডানপাশ থেকে **Reviewers** (যাঁরা কোড চেক করবেন) এবং **Assignees** (নিজের নাম) যুক্ত করুন।
6. **Create pull request** বাটনে ক্লিক করুন (কাজ চলাকালীন অবস্থায় কাউকে নোটিফিকেশন না পাঠিয়ে টেস্ট রান করতে চাইলে ড্রপডাউন থেকে **Create draft pull request** নির্বাচন করুন)।

---

## ৩. মানসম্মত পিআর ডেসক্রিপশন (PR Description)

ডেসক্রিপশন ছাড়া পিআর সাবমিট করলে রিভিউয়ার বুঝতে পারেন না আপনি কী উদ্দেশ্যে কোড লিখেছেন। এর ফলে কোড রিভিউ আটকে থাকে।

### একটি আদর্শ পিআর ডেসক্রিপশন টেমপ্লেট:
1. **সংক্ষিপ্ত বিবরণ (Summary)**: আপনি কী কী ফিচার যোগ বা পরিবর্তন করেছেন তা বুলেট পয়েন্টে লিখুন।
2. **টিকেট রেফারেন্স (Issue/Ticket)**: যেমন \`Fixes #104\` বা \`Closes PROJ-42\` (পিআর মার্জ হলে ইস্যুটি অটো ক্লোজ হবে)।
3. **লোকাল টেস্টিং গাইড (How to Test)**: রিভিউয়ার কীভাবে তাঁর মেশিনে কোডটি পরীক্ষা করবেন তার স্পষ্ট ধাপ।
4. **স্ক্রিনশট বা ডেমো ভিডিও**: ইউআই (UI) পরিবর্তনের ক্ষেত্রে Before এবং After স্ক্রিনশট যুক্ত করুন।
5. **চেকলিস্ট (Checklist)**: ইউনিট টেস্ট পাস হয়েছে কিনা, কোনো সিক্রেট পাসওয়ার্ড ভুলবশত পুশ হয়নি ইত্যাদি নিশ্চিত করে টিক দিন।

---

## ৪. কোড রিভিউ কালচার (Code Review)

কোড রিভিউ কোনো সহকর্মীর ভুল ধরার জন্য নয়; এটি সফটওয়্যারের গুণগত মান নিশ্চিত করা এবং টিমের সম্মিলিত শেখার সেরা মাধ্যম।

### রিভিউয়াররা কী কী বিষয় পরীক্ষা করেন?
1. **কার্যকারিতা ও বাগ**: কোডটি কি সঠিকভাবে কাজ করছে? কোনো নাল পয়েন্টার (NullReference) বা লজিক্যাল ভুল আছে কি?
2. **নিরাপত্তা (Security)**: এসকিউএল ইনজেকশন বা অনিরাপদ এপিআই এন্ডপয়েন্ট আছে কি?
3. **পারফরম্যান্স**: ডাটাবেজে কি অহেতুক $N+1$ কুয়েরি চালানো হয়েছে? অপ্রয়োজনীয় মেমরি লিক হচ্ছে কি?
4. **কোড স্ট্যান্ডার্ড ও আর্কিটেকচার**: কোডের আর্কিটেকচার কি ক্লিন ও রিডেবল? ভ্যারিয়েবলের নামগুলো কি অর্থপূর্ণ?
5. **টেস্ট কভারেজ**: প্রয়োজনীয় ইউনিট টেস্ট লেখা হয়েছে কি?

---

## ৫. রিভিউ কমেন্ট ও সাজেশন ব্লক (Review Comments)

রিভিউয়াররা গিটহাবের **Files changed** ট্যাবে কোডের নির্দিষ্ট লাইনের পাশে মাউস রেখে নীল রঙের **`+`** আইকনে ক্লিক করে মন্তব্য করেন।

### প্রফেশনাল রিভিউ প্র্যাকটিস:
* প্রতিটি কমেন্ট আলাদা না পাঠিয়ে **Start a review** বাটনে ক্লিক করুন। এতে সবগুলো মন্তব্য ড্রাফট হিসেবে জমা থাকবে এবং রিভিউ শেষ হলে একসাথে **Submit review** দিলে লেখক কেবল একটি নোটিফিকেশন ইমেইল পাবেন।
* **সাজেশন ব্লক (Suggestion Blocks)**: রিভিউয়ার চাইলে কোডের সঠিক সমাধান সরাসরি লিখে দিতে পারেন, যা পিআর লেখক এক ক্লিকেই কমিট হিসেবে গ্রহণ করতে পারেন:
  \`\`\`suggestion
  const total = items.reduce((sum, item) => sum + item.price, 0);
  \`\`\`

---

## ৬. পিআর অনুমোদন (Approve PR)

কোডে কোনো সমস্যা না থাকলে এবং টেস্ট সফলভাবে পাস করলে রিভিউয়ার কোড অনুমোদন করেন:
1. **Review changes** ড্রপডাউনে যান।
2. একটি ইতিবাচক মন্তব্য লিখুন (যেমন: *"Clean code and great test coverage. Approved!"*)।
3. **Approve** রেডিও বাটনে ক্লিক করে **Submit review** দিন।
4. এতে পিআর-এ একটি **সবুজ টিক চিহ্ন (✅)** চলে আসে এবং ব্রাঞ্চ প্রটেকশন রুল পূরণ হয়।

---

## ৭. পরিবর্তন চাওয়ার নিয়ম (Request Changes)

কোডে যদি কোনো মারাত্মক বাগ, সিকিউরিটি দুর্বলতা বা লজিক্যাল ভুল থাকে, তবে মার্জ আটকানোর জন্য **Request Changes** ব্যবহার করা হয়:
1. **Review changes**-এ গিয়ে কারণ ব্যাখ্যা করুন।
2. **Request changes** নির্বাচন করে সাবমিট করুন।
3. এতে পিআর-এ একটি **লাল ক্রস (❌)** চলে আসবে এবং মার্জ বাটন লক হয়ে যাবে।

### লেখক কীভাবে সংশোধন করবেন?
* লোকাল মেশিনে একই ফিচার ব্রাঞ্চে কোড সংশোধন করুন।
* স্বাভাবিকভাবে \`git commit\` এবং \`git push\` করুন।
* পুশ করামাত্র গিটহাব পিআর-টি স্বয়ংক্রিয়ভাবে নতুন কমিটগুলো যুক্ত করে আপডেট হয়ে যাবে!
* রিভিউয়ারের নামের পাশে থাকা **Re-request review (🔄)** বাটনে ক্লিক করে পুনরায় রিভিউ করার অনুরোধ জানান।

---

## ৮. পিআর মার্জ করা (Merge PR)

সব রুলস পূরণ হলে (সবুজ CI টেস্ট, টিমমেটের অ্যাপ্রুভাল) মার্জ বাটনটি সক্রিয় হয়।

### গিটহাবের ৩টি জনপ্রিয় মার্জ স্ট্র্যাটেজি:

| স্ট্র্যাটেজি | হিস্ট্রিতে কী ঘটে? | কখন ব্যবহার করবেন? |
| :--- | :--- | :--- |
| **Squash and Merge ⭐** | ফিচার ব্রাঞ্চের সমস্ত ১৫টি খসড়া কমিটকে সংকুচিত করে **১টি পরিষ্কার, সুসংগঠিত কমিট** হিসেবে \`main\`-এ যোগ করে। | **ইন্ডাস্ট্রির সবচেয়ে জনপ্রিয় পছন্দ**। মেইন ব্রাঞ্চের হিস্ট্রি অত্যন্ত পরিষ্কার ও রিভার্ট করা সহজ রাখে। |
| **Create a merge commit** | ফিচার ব্রাঞ্চের প্রতিটি কমিট অক্ষত রেখে একটি অতিরিক্ত ৩-ওয়ে মার্জ কমিট তৈরি করে। | ওপেন-সোর্স প্রজেক্ট যেখানে প্রতিটি আলাদা ডেভেলপারের অবদান অবিকল রাখতে হয়। |
| **Rebase and merge** | কোনো মার্জ কমিট ছাড়াই ফিচার ব্রাঞ্চের কমিটগুলোকে মেইনের অগ্রভাগে একে একে সাজিয়ে দেয়। | যাঁরা মার্জ কমিট ছাড়া সম্পূর্ণ লিনিয়ার গ্রাফ পছন্দ করেন। |

*মার্জ শেষ হওয়া মাত্র **Delete branch** বাটনে ক্লিক করে ফিচার ব্রাঞ্চটি মুছে ফেলা উত্তম যাতে রিপোজিটরি পরিষ্কার থাকে।*

---

## ৯. পিআর বন্ধ করা (Close PR — মার্জ ছাড়া)

কখনো কখনো কোনো পিআর মূল প্রজেক্টে মার্জ করার প্রয়োজন থাকে না:
- ক্লায়েন্ট বা প্রোডাক্ট ওনার রিকোয়ারমেন্ট পরিবর্তন করেছেন।
- অন্য কোনো সহকর্মী এর চেয়ে চমৎকার বিকল্প উপায়ে সমস্যা সমাধান করেছেন।
- পিআরটি কেবল একটি পরীক্ষামূলক প্রোটোটাইপ ছিল।

### কীভাবে ক্লোজ করবেন?
1. ডেসক্রিপশন বক্সে একটি বিনীত মন্তব্য লিখে জানিয়ে দিন ঠিক কেন পিআরটি ক্লোজ করা হচ্ছে।
2. **Close pull request** বাটনে ক্লিক করুন।
3. ভবিষ্যতে যদি সিদ্ধান্ত পরিবর্তন হয়, তবে যেকোনো সময় **Reopen pull request** বাটনে ক্লিক করে এটি পুনরায় চালু করা যায়।
`,
  };
