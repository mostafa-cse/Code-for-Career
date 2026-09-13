import { CURRICULUM_SUBJECTS, CURRICULUM_TRACKS } from "@/lib/curriculum-data";

export interface ProfileBadge {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: string; // Trophy, Zap, Target, ShieldCheck, Flame, Star, Award
  tier: "bronze" | "silver" | "gold" | "diamond";
  descriptionEn: string;
  descriptionBn: string;
  unlockedAt: string;
}

export interface ProfileActivity {
  id: string;
  titleEn: string;
  titleBn: string;
  trackNameEn: string;
  trackNameBn: string;
  timestamp: string;
  type: "lesson" | "problem" | "badge";
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  bio: string;
  targetRole: string;
  targetCompanies: string[];
  location: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  codeforcesHandle?: string | null;
  completedLessons: number;
  totalLessons: number;
  solvedProblems: number;
  readinessLevelEn: string;
  readinessLevelBn: string;
  readinessPercentage: number;
  streakDays: number;
  rankTitleEn: string;
  rankTitleBn: string;
  joinedDate: string;
  badges: ProfileBadge[];
  trackProgress: Record<
    string,
    {
      completed: number;
      total: number;
      percentage: number;
    }
  >;
  recentActivity: ProfileActivity[];
}

// Calculate total estimated curriculum lessons
export const TOTAL_CURRICULUM_LESSONS = CURRICULUM_SUBJECTS.reduce(
  (acc, s) => acc + s.estimatedLessons,
  0
);

// ─────────────────────────────────────────────────────────────
// Community Directory: Active Bangladeshi Tech Candidates
// ─────────────────────────────────────────────────────────────
export const COMMUNITY_CANDIDATES: UserProfile[] = [
  {
    id: "cand-01",
    username: "mostafakamal",
    name: "Mostafa Kamal",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    role: "ADMIN",
    bio: "Full-Stack Software Engineer & Competitive Programmer. Preparing for Senior Engineering roles at Enosis & Therap. Passionate about C# .NET internals and distributed systems.",
    targetRole: "Senior Backend / Full-Stack Engineer",
    targetCompanies: ["Enosis", "Therap", "Samsung R&D", "Brain Station 23"],
    location: "Dhaka, Bangladesh",
    githubUrl: "https://github.com/mostafa-cse",
    linkedinUrl: "https://linkedin.com/in/mostafa-kamal",
    codeforcesHandle: "M0stafa",
    completedLessons: 68,
    totalLessons: TOTAL_CURRICULUM_LESSONS,
    solvedProblems: 42,
    readinessLevelEn: "Interview Ready",
    readinessLevelBn: "সাক্ষাৎকার-প্রস্তুত",
    readinessPercentage: 82,
    streakDays: 14,
    rankTitleEn: "Top 2% Candidate",
    rankTitleBn: "শীর্ষ ২% পরীক্ষার্থী",
    joinedDate: "January 2026",
    badges: [
      {
        id: "badge-csharp-master",
        nameEn: "C# Runtime Expert",
        nameBn: "সি# রানটাইম বিশেষজ্ঞ",
        icon: "ShieldCheck",
        tier: "diamond",
        descriptionEn: "Mastered Garbage Collection, Memory Management, and Async in C#",
        descriptionBn: "সি# এর মেমোরি ম্যানেজমেন্ট ও অ্যাসিনক্রোনাস প্রোগ্রামিংয়ে দক্ষতা অর্জন",
        unlockedAt: "2 days ago",
      },
      {
        id: "badge-algo-ace",
        nameEn: "Algorithm Ace",
        nameBn: "অ্যালগরিদম টেকনিশিয়ান",
        icon: "Target",
        tier: "gold",
        descriptionEn: "Solved 40+ company interview DSA coding problems",
        descriptionBn: "৪০টির বেশি ইন্টারভিউ কোডিং প্রবলেম সমাধান সম্পন্ন",
        unlockedAt: "1 week ago",
      },
      {
        id: "badge-streak-master",
        nameEn: "Consistent Contender",
        nameBn: "ধারাবাহিক প্রস্তুতকারী",
        icon: "Flame",
        tier: "gold",
        descriptionEn: "Maintained an active 14-day study streak",
        descriptionBn: "টানা ১৪ দিন সক্রিয় প্রস্তুতি বজায় রেখেছেন",
        unlockedAt: "Yesterday",
      },
      {
        id: "badge-architect",
        nameEn: "System Architect",
        nameBn: "সিস্টেম আর্কিটেক্ট",
        icon: "Trophy",
        tier: "silver",
        descriptionEn: "Completed High-Level System Design & Microservices modules",
        descriptionBn: "সিস্টেম ডিজাইন ও মাইক্রোসার্ভিসেস মডিউল সমাপ্ত",
        unlockedAt: "2 weeks ago",
      },
    ],
    trackProgress: {
      "track-lang": { completed: 34, total: 38, percentage: 89 },
      "track-dsa": { completed: 22, total: 28, percentage: 78 },
      "track-system": { completed: 8, total: 16, percentage: 50 },
      "track-db": { completed: 4, total: 16, percentage: 25 },
    },
    recentActivity: [
      {
        id: "act-1",
        titleEn: "Mastered Garbage Collection (Mark, Sweep, Compact) in C#",
        titleBn: "সি# এর গারবেজ কালেকশন (Mark, Sweep, Compact) সম্পন্ন",
        trackNameEn: "Languages & Runtimes",
        trackNameBn: "প্রোগ্রামিং ভাষা ও রানটাইম",
        timestamp: "3 hours ago",
        type: "lesson",
      },
      {
        id: "act-2",
        titleEn: "Solved Two Sum / Pair with Target Sum in C#",
        titleBn: "টু-সাম (Two Sum) সমস্যা সমাধান",
        trackNameEn: "Algorithms & Problem Solving",
        trackNameBn: "অ্যালগরিদম ও ডেটা স্ট্রাকচার",
        timestamp: "Yesterday",
        type: "problem",
      },
      {
        id: "act-3",
        titleEn: "Completed Task Parallel Library & async/await Internals",
        titleBn: "টাস্ক প্যারালাল লাইব্রেরি ও async/await অভ্যন্তরীণ কার্যপদ্ধতি",
        trackNameEn: "Languages & Runtimes",
        trackNameBn: "প্রোগ্রামিং ভাষা ও রানটাইম",
        timestamp: "2 days ago",
        type: "lesson",
      },
    ],
  },
  {
    id: "cand-02",
    username: "arif_cse",
    name: "Ariful Islam",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    role: "USER",
    bio: "Software Engineer @ BUET grad. Focusing on high-concurrency systems, LeetCode Hard DSA, and Microservices design for Therap and Optimizely.",
    targetRole: "Backend Software Engineer",
    targetCompanies: ["Therap", "Optimizely", "Enosis"],
    location: "Dhaka, Bangladesh",
    githubUrl: "https://github.com/arif-islam",
    linkedinUrl: "https://linkedin.com/in/arif-islam-cse",
    codeforcesHandle: "arif_buet",
    completedLessons: 54,
    totalLessons: TOTAL_CURRICULUM_LESSONS,
    solvedProblems: 35,
    readinessLevelEn: "Advanced Intermediate",
    readinessLevelBn: "উন্নত মধ্যবর্তী স্তর",
    readinessPercentage: 68,
    streakDays: 9,
    rankTitleEn: "Top 8% Candidate",
    rankTitleBn: "শীর্ষ ৮% পরীক্ষার্থী",
    joinedDate: "February 2026",
    badges: [
      {
        id: "badge-algo-ace",
        nameEn: "Algorithm Ace",
        nameBn: "অ্যালগরিদম টেকনিশিয়ান",
        icon: "Target",
        tier: "gold",
        descriptionEn: "Solved 30+ company interview DSA coding problems",
        descriptionBn: "৩০টির বেশি ইন্টারভিউ কোডিং প্রবলেম সমাধান সম্পন্ন",
        unlockedAt: "4 days ago",
      },
      {
        id: "badge-db-pioneer",
        nameEn: "SQL Query Optimizer",
        nameBn: "এসকিউএল অপটিমাইজার",
        icon: "Zap",
        tier: "silver",
        descriptionEn: "Finished B-Tree Indexing and ACID Transaction Isolation",
        descriptionBn: "বি-ট্রি ইনডেক্সিং এবং ট্রানজেকশন আইসোলেশন লেভেল সম্পন্ন",
        unlockedAt: "1 week ago",
      },
    ],
    trackProgress: {
      "track-lang": { completed: 25, total: 38, percentage: 65 },
      "track-dsa": { completed: 20, total: 28, percentage: 71 },
      "track-system": { completed: 6, total: 16, percentage: 38 },
      "track-db": { completed: 3, total: 16, percentage: 19 },
    },
    recentActivity: [
      {
        id: "act-201",
        titleEn: "Completed Two Pointers & Sliding Window Patterns",
        titleBn: "টু পয়েন্টার ও স্লাইডিং উইন্ডো প্যাটার্ন সম্পন্ন",
        trackNameEn: "Algorithms & Problem Solving",
        trackNameBn: "অ্যালগরিদম ও ডেটা স্ট্রাকচার",
        timestamp: "5 hours ago",
        type: "lesson",
      },
    ],
  },
  {
    id: "cand-03",
    username: "tanvir_dev",
    name: "Tanvir Ahmed",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    role: "USER",
    bio: "Passionate about Distributed Caching, Redis, RabbitMQ and .NET Core WebAPI. Aiming for Samsung R&D and Enosis.",
    targetRole: "Distributed Systems & .NET Specialist",
    targetCompanies: ["Samsung R&D", "Enosis", "Brain Station 23"],
    location: "Chittagong, Bangladesh",
    githubUrl: "https://github.com/tanvir-ahmed",
    linkedinUrl: "https://linkedin.com/in/tanvir-ahmed-dev",
    codeforcesHandle: "tanvir_cuet",
    completedLessons: 45,
    totalLessons: TOTAL_CURRICULUM_LESSONS,
    solvedProblems: 28,
    readinessLevelEn: "Advanced Intermediate",
    readinessLevelBn: "উন্নত মধ্যবর্তী স্তর",
    readinessPercentage: 58,
    streakDays: 6,
    rankTitleEn: "Top 12% Candidate",
    rankTitleBn: "শীর্ষ ১২% পরীক্ষার্থী",
    joinedDate: "January 2026",
    badges: [
      {
        id: "badge-system-master",
        nameEn: "System Designer",
        nameBn: "সিস্টেম ডিজাইনার",
        icon: "ShieldCheck",
        tier: "silver",
        descriptionEn: "Mastered CAP Theorem, Sharding, and Load Balancing",
        descriptionBn: "ক্যাপ থিওরেম ও লোড ব্যালেন্সিংয়ে দক্ষতা অর্জন",
        unlockedAt: "3 days ago",
      },
    ],
    trackProgress: {
      "track-lang": { completed: 22, total: 38, percentage: 58 },
      "track-dsa": { completed: 14, total: 28, percentage: 50 },
      "track-system": { completed: 7, total: 16, percentage: 44 },
      "track-db": { completed: 2, total: 16, percentage: 12 },
    },
    recentActivity: [
      {
        id: "act-301",
        titleEn: "Completed Sharding & Replication Strategies in PostgreSQL",
        titleBn: "পোস্টগ্রেসকিউএল শার্ডিং ও রেপ্লিকেশন স্ট্র্যাটেজি সম্পন্ন",
        trackNameEn: "Database Engineering",
        trackNameBn: "ডাটাবেজ ইঞ্জিনিয়ারিং",
        timestamp: "Yesterday",
        type: "lesson",
      },
    ],
  },
  {
    id: "cand-04",
    username: "sumaiya_swe",
    name: "Sumaiya Rahman",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    role: "USER",
    bio: "CSE Grad @ SUST. Focused on clean code, SOLID principles, design patterns, and DSA. Targeting top product engineering teams in Dhaka.",
    targetRole: "Software Engineer (Backend)",
    targetCompanies: ["Enosis", "Therap", "Cefalo"],
    location: "Sylhet, Bangladesh",
    githubUrl: "https://github.com/sumaiya-rahman",
    linkedinUrl: "https://linkedin.com/in/sumaiya-rahman",
    codeforcesHandle: "sumaiya_sust",
    completedLessons: 61,
    totalLessons: TOTAL_CURRICULUM_LESSONS,
    solvedProblems: 38,
    readinessLevelEn: "Interview Ready",
    readinessLevelBn: "সাক্ষাৎকার-প্রস্তুত",
    readinessPercentage: 77,
    streakDays: 11,
    rankTitleEn: "Top 4% Candidate",
    rankTitleBn: "শীর্ষ ৪% পরীক্ষার্থী",
    joinedDate: "December 2025",
    badges: [
      {
        id: "badge-solid",
        nameEn: "Clean Architecture Ace",
        nameBn: "ক্লিন আর্কিটেকচার বিশেষজ্ঞ",
        icon: "Award",
        tier: "gold",
        descriptionEn: "Complete mastery of SOLID, Repository, and Unit of Work",
        descriptionBn: "সলিড ও রিপোজিটরি প্যাটার্নে পূর্ণ দক্ষতা",
        unlockedAt: "5 days ago",
      },
    ],
    trackProgress: {
      "track-lang": { completed: 30, total: 38, percentage: 79 },
      "track-dsa": { completed: 21, total: 28, percentage: 75 },
      "track-system": { completed: 6, total: 16, percentage: 38 },
      "track-db": { completed: 4, total: 16, percentage: 25 },
    },
    recentActivity: [
      {
        id: "act-401",
        titleEn: "Mastered Dependency Injection & IoC Container in .NET",
        titleBn: ".NET এ ডিপেন্ডেন্সি ইনজেকশন ও IoC কন্টেইনার সম্পন্ন",
        trackNameEn: "Languages & Runtimes",
        trackNameBn: "প্রোগ্রামিং ভাষা ও রানটাইম",
        timestamp: "1 day ago",
        type: "lesson",
      },
    ],
  },
  {
    id: "cand-05",
    username: "nahian_net",
    name: "Nahian Kazi",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    role: "USER",
    bio: "Cloud & .NET Developer building microservices. Preparing for system design and advanced C# concurrency questions.",
    targetRole: "Cloud / .NET Software Engineer",
    targetCompanies: ["Brain Station 23", "Enosis", "Therap"],
    location: "Dhaka, Bangladesh",
    githubUrl: "https://github.com/nahian-kazi",
    linkedinUrl: "https://linkedin.com/in/nahian-kazi",
    codeforcesHandle: "nahian_k",
    completedLessons: 38,
    totalLessons: TOTAL_CURRICULUM_LESSONS,
    solvedProblems: 22,
    readinessLevelEn: "Intermediate",
    readinessLevelBn: "মধ্যবর্তী স্তর",
    readinessPercentage: 48,
    streakDays: 4,
    rankTitleEn: "Top 20% Candidate",
    rankTitleBn: "শীর্ষ ২০% পরীক্ষার্থী",
    joinedDate: "February 2026",
    badges: [
      {
        id: "badge-first",
        nameEn: "Syllabus Pioneer",
        nameBn: "সিলেবাস পথিকৃৎ",
        icon: "Star",
        tier: "bronze",
        descriptionEn: "Conquered first curriculum milestone",
        descriptionBn: "প্রথম কারিকুলাম মাইলস্টোন সম্পন্ন",
        unlockedAt: "3 weeks ago",
      },
    ],
    trackProgress: {
      "track-lang": { completed: 20, total: 38, percentage: 53 },
      "track-dsa": { completed: 11, total: 28, percentage: 39 },
      "track-system": { completed: 5, total: 16, percentage: 31 },
      "track-db": { completed: 2, total: 16, percentage: 12 },
    },
    recentActivity: [
      {
        id: "act-501",
        titleEn: "Completed LINQ Query Optimization & Deferred Execution",
        titleBn: "LINQ অপটিমাইজেশন ও ডিফর্ড এক্সিকিউশন সমাপ্ত",
        trackNameEn: "Languages & Runtimes",
        trackNameBn: "প্রোগ্রামিং ভাষা ও রানটাইম",
        timestamp: "2 days ago",
        type: "lesson",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Profile Search & Retrieval Utilities
// ─────────────────────────────────────────────────────────────

/**
 * Searches candidate profiles by query across username, name, role, and target company.
 */
export function searchUserProfiles(query: string): UserProfile[] {
  const q = query.trim().toLowerCase().replace(/^@/, "");
  if (!q) return COMMUNITY_CANDIDATES;

  return COMMUNITY_CANDIDATES.filter((candidate) => {
    const matchUsername = candidate.username.toLowerCase().includes(q);
    const matchName = candidate.name.toLowerCase().includes(q);
    const matchRole = candidate.targetRole.toLowerCase().includes(q);
    const matchCompany = candidate.targetCompanies.some((c) =>
      c.toLowerCase().includes(q)
    );
    const matchBio = candidate.bio.toLowerCase().includes(q);

    return matchUsername || matchName || matchRole || matchCompany || matchBio;
  });
}

/**
 * Finds a candidate profile by exact username (case-insensitive).
 */
export function getUserProfileByUsername(username: string): UserProfile | null {
  const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");
  const found = COMMUNITY_CANDIDATES.find(
    (c) => c.username.toLowerCase() === cleanUsername
  );
  return found || null;
}

/**
 * Generates or maps a realistic UserProfile for a custom or newly signed up user
 */
export function createProfileFromUserData(user: {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role?: string;
  username?: string | null;
  bio?: string | null;
  targetRole?: string | null;
  targetCompanies?: string[] | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  codeforcesHandle?: string | null;
  location?: string | null;
  completedLessons?: number;
  solvedProblems?: number;
  trackStats?: Record<string, { completed: number; total: number; percentage: number }>;
}): UserProfile {
  // Derive clean unique username from explicit username, email prefix, or name
  let defaultUsername =
    user.username ||
    user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "") ||
    "candidate";

  // Check if we already have an existing profile for this username in community list
  const existing = getUserProfileByUsername(defaultUsername);
  if (existing) {
    return {
      ...existing,
      id: user.id || existing.id,
      name: user.name || existing.name,
      avatarUrl: user.avatarUrl || existing.avatarUrl,
      role: (user.role as "USER" | "ADMIN") || existing.role,
      bio: user.bio || existing.bio,
      targetRole: user.targetRole || existing.targetRole,
      targetCompanies: user.targetCompanies || existing.targetCompanies,
      githubUrl: user.githubUrl ?? existing.githubUrl,
      linkedinUrl: user.linkedinUrl ?? existing.linkedinUrl,
      codeforcesHandle: user.codeforcesHandle ?? existing.codeforcesHandle,
      location: user.location || existing.location,
      completedLessons: user.completedLessons ?? existing.completedLessons,
      solvedProblems: user.solvedProblems ?? existing.solvedProblems,
      trackProgress: user.trackStats || existing.trackProgress,
    };
  }

  const completed = user.completedLessons ?? 14;
  const percentage = Math.min(
    100,
    Math.round((completed / TOTAL_CURRICULUM_LESSONS) * 100)
  );

  let readinessLevelEn = "Intermediate";
  let readinessLevelBn = "মধ্যবর্তী স্তর";
  if (percentage >= 75) {
    readinessLevelEn = "Interview Ready";
    readinessLevelBn = "সাক্ষাৎকার-প্রস্তুত";
  } else if (percentage >= 40) {
    readinessLevelEn = "Advanced Intermediate";
    readinessLevelBn = "উন্নত মধ্যবর্তী স্তর";
  }

  return {
    id: user.id,
    username: defaultUsername,
    name: user.name || "Software Engineering Candidate",
    avatarUrl: user.avatarUrl,
    role: (user.role as "USER" | "ADMIN") || "USER",
    bio:
      user.bio ||
      "Dedicated software engineering candidate preparing for technical interviews at top software companies in Bangladesh.",
    targetRole: user.targetRole || "Software Engineer",
    targetCompanies: user.targetCompanies || [
      "Enosis",
      "Therap",
      "Brain Station 23",
      "Samsung R&D",
    ],
    location: user.location || "Dhaka, Bangladesh",
    githubUrl: user.githubUrl || null,
    linkedinUrl: user.linkedinUrl || null,
    codeforcesHandle: user.codeforcesHandle || null,
    completedLessons: completed,
    totalLessons: TOTAL_CURRICULUM_LESSONS,
    solvedProblems: user.solvedProblems ?? 8,
    readinessLevelEn,
    readinessLevelBn,
    readinessPercentage: percentage,
    streakDays: 3,
    rankTitleEn: "Active Candidate",
    rankTitleBn: "সক্রিয় পরীক্ষার্থী",
    joinedDate: "Joined 2026",
    badges: [
      {
        id: "badge-first",
        nameEn: "Syllabus Pioneer",
        nameBn: "সিলেবাস পথিকৃৎ",
        icon: "Star",
        tier: "bronze",
        descriptionEn: "Conquered first curriculum milestone",
        descriptionBn: "প্রথম কারিকুলাম মাইলস্টোন সম্পন্ন",
        unlockedAt: "Recently",
      },
      {
        id: "badge-consistent",
        nameEn: "Candidate On Fire",
        nameBn: "দৃঢ় প্রতিজ্ঞ",
        icon: "Flame",
        tier: "silver",
        descriptionEn: "Practicing regularly for BD tech interviews",
        descriptionBn: "নিয়মিত অনুশীলন ও প্রস্তুতি জারি রেখেছেন",
        unlockedAt: "Recently",
      },
    ],
    trackProgress: user.trackStats || {
      "track-lang": {
        completed: Math.round(completed * 0.5),
        total: 38,
        percentage: Math.min(100, Math.round(((completed * 0.5) / 38) * 100)),
      },
      "track-dsa": {
        completed: Math.round(completed * 0.3),
        total: 28,
        percentage: Math.min(100, Math.round(((completed * 0.3) / 28) * 100)),
      },
      "track-system": {
        completed: Math.round(completed * 0.1),
        total: 16,
        percentage: Math.min(100, Math.round(((completed * 0.1) / 16) * 100)),
      },
      "track-db": {
        completed: Math.round(completed * 0.1),
        total: 16,
        percentage: Math.min(100, Math.round(((completed * 0.1) / 16) * 100)),
      },
    },
    recentActivity: [
      {
        id: "act-init-1",
        titleEn: "Joined Code For Career Community",
        titleBn: "Code For Career কমিউনিটিতে যোগদান",
        trackNameEn: "Community",
        trackNameBn: "কমিউনিটি",
        timestamp: "Recently",
        type: "badge",
      },
    ],
  };
}
