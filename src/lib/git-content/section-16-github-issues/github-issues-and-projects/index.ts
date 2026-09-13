import type { LocalLesson } from "@/lib/lessons-data";

export const githubIssuesAndProjectsLesson: LocalLesson = {
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
   * Columns: \`Backlog\` -> \`Ready / Todo\` -> \`In Progress\` -> \`In Review\` -> \`Done\`.
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

> **Key Rule:** The issue will **ONLY close when the PR is merged into the default branch (\`main\`)**! Creating or approving a PR will not close the issue.

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

### গিটহাব ইস্যু কী?
**Issue** হলো যেকোনো প্রজেক্টের কাজের একটি সুস্পষ্ট ইউনিট বা ট্র্যাকিং আইটেম। গিট কমিট যেমন সোর্স কোডের পরিবর্তন ট্র্যাক করে, গিটহাব ইস্যু তেমনি মানুষের কাজের অগ্রগতি ট্র্যাক করে:
* **Bug Reports:** সফটওয়্যারে কোনো ত্রুটি বা ক্র্যাশ ধরা পড়লে তা সমাধান করার জন্য।
* **Feature Requests:** নতুন কোনো ফিচার বা বিজনেস লজিক যোগ করার প্রস্তাবনা।
* **Tech Debt & Tasks:** লাইব্রেরি ভার্সন আপগ্রেড, রিফ্যাক্টরিং বা ডকুমেন্টেশন লেখার টাস্ক।

### একটি ইস্যুর অভ্যন্তরীণ উপাদানসমূহ:
1. **Title:** সংক্ষিপ্ত ও স্পষ্ট শিরোনাম (যেমন: \`[BUG] চেকআউট পেজে বিকাশ পেমেন্ট ওটিপি ভেরিফিকেশন ফেইল করছে\`)।
2. **Description:** মার্কডাউন (GFM) ফরম্যাটে বিস্তারিত বিবরণ, চেকলিস্ট (\`- [ ]\`), স্ক্রিনশট এবং ত্রুটির লগ।
3. **Discussion Thread:** টিমের সবাই কমেন্টে আলোচনা করতে পারে এবং নির্দিষ্ট কোড বা পিআর লিংক করতে পারে।
4. **State:** ইস্যুর স্ট্যাটাস হয় **Open** (কাজ বাকি) নয়তো **Closed** (সমাধান বা বাতিল)।

---

## ২. Labels (লেবেল ও ক্যাটাগরি ব্যবস্থাপনা)

### লেবেল কেন ব্যবহার করবেন?
লেবেল হলো রঙিন ট্যাগ যার মাধ্যমে হাজার হাজার ইস্যুর ভেতর থেকে প্রয়োজনীয় ইস্যুগুলোকে ফিল্টার, ক্যাটাগরাইজ ও প্রায়োরিটাইজ করা যায়।

### প্রফেশনাল টিম ট্যাক্সোনমি (Industry Standard):
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

### মাইলস্টোন কী?
একটি নির্দিষ্ট ডেডলাইন বা ডেলিভারি টার্গেটকে সামনে রেখে সম্পর্কিত একগুচ্ছ ইস্যু এবং পুল রিকোয়েস্টকে একটি ফোল্ডারে বাঁধার নাম হলো **Milestone**।

### বাস্তব উদাহরণ:
* \`Sprint 24 (Oct 1 - Oct 14)\`
* \`Release v2.0.0 (Production Launch)\`
* \`Q4 Database Migration\`

### মাইলস্টোনের সুবিধাসমূহ:
* **Progress Bar:** মাইলস্টোনের কয়টি কাজ সম্পন্ন হয়েছে এবং কয়টি বাকি তার একটি রিয়েল-টাইম পার্সেন্টেজ বার দেখা যায়।
* **Due Date:** নির্ধারিত ডেডলাইনের কতদিন বাকি আছে তা ক্যালেন্ডার ডেট সহ মনে করিয়ে দেয়।
* **স্কোপ নিয়ন্ত্রন:** টিমে অযাচিত কাজের চাপ কমানো ও সময়মতো রিলিজ নিশ্চিত করা যায়।

---

## ৪. Assignees (দায়িত্ব বণ্টন ও ট্র্যাকিং)

### কাজের দায়িত্ব প্রদান:
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

### মার্কডাউন টেমপ্লেট উদাহরণ:
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

### GitHub Projects (v2) কী?
ট্রেলে (Trello) বা জিরার (Jira) মতো গিটহাবের নিজস্ব চমৎকার প্রজেক্ট ম্যানেজমেন্ট প্ল্যাটফর্ম হলো GitHub Projects:

1. **Board View (ঐতিহ্যবাহী কানবান বোর্ড):**
   * কলামসমূহ: \`Backlog\` -> \`Ready / Todo\` -> \`In Progress\` -> \`In Review\` -> \`Done\`।
   * কাজের সাথে সাথে কার্ড এক কলাম থেকে অন্য কলামে ড্র্যাগ-অ্যান্ড-ড্রপ করা যায়।
2. **Table View (স্প্রেডশিট ভিউ):**
   * এক্সেল বা নোশনের মতো টেবিল যেখানে কাস্টম ফিল্ড যোগ করা যায় (যেমন: Story Points, Priority, Sprint Iteration)।
3. **Roadmap View (টাইমলাইন / গ্যান্ট চার্ট):**
   * কোয়ার্টার বা মাসের ক্যালেন্ডারে কোন ফিচারের কাজ কবে শুরু হয়ে কবে শেষ হবে তার ভিজ্যুয়াল রোডম্যাপ।

### অটোমেশন ফিচার:
* নতুন ইস্যু খোলার সাথে সাথে স্বয়ংক্রিয়ভাবে প্রজেক্ট বোর্ডে কার্ড তৈরি হওয়া।
* পিআর ওপেন হলে কার্ড নিজে থেকেই \`In Progress\`-এ চলে যাওয়া।
* পিআর মেইন ব্রাঞ্চে মার্জ হওয়ামাত্র কার্ডটি স্বয়ংক্রিয়ভাবে \`Done\` কলামে চলে যাওয়া!

---

## ৭. Issue Tracking & PR Linking (অটোমেশন টেকনিক)

### Pull Request দিয়ে স্বয়ংক্রিয়ভাবে ইস্যু বন্ধ করা:
পিআরের ডেসক্রিপশনে বা কমিট মেসেজে নির্দিষ্ট কিছু কিওয়ার্ডের সাথে ইস্যু নম্বর লিখে দিলে পিআর মার্জ হওয়ার সাথে সাথে সংশ্লিষ্ট ইস্যুটি নিজে থেকেই ক্লোজ হয়ে যায়:

| কিওয়ার্ড | সমর্থিত রূপসমূহ | উদাহরণ সিনট্যাক্স |
| :--- | :--- | :--- |
| **close** | closes, closed | \`Closes #42\` |
| **fix** | fixes, fixed | \`Fixes #108\` |
| **resolve** | resolves, resolved | \`Resolves #15\` |

> **গোল্ডেন রুল:** পিআরটি যখন **ডিফল্ট ব্রাঞ্চে (main)** মার্জ হবে, ঠিক তখনই ইস্যুটি বন্ধ হবে। পিআর ড্রাফট অবস্থায় থাকলে বা মার্জ না করে ক্যানসেল করলে ইস্যুটি বন্ধ হবে না।

### ইস্যু সার্চ করার পাওয়ারফুল ফিল্টারসমূহ:
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

### GitHub CLI (\`gh\`) দিয়ে টার্মিনাল থেকেই ইস্যু ম্যানেজমেন্ট:
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
  };
