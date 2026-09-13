export type SubjectMeta = {
  slug: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  color: string;
  order: number;
};

export const SUBJECTS: readonly SubjectMeta[] = [
  {
    slug: "git",
    nameEn: "Git & GitHub Version Control",
    nameBn: "গিট ও গিটহাব ভার্সন কন্ট্রোল",
    icon: "GitBranch",
    color: "orange",
    order: 1,
  },
  {
    slug: "csharp",
    nameEn: "Programming in C#",
    nameBn: "C# প্রোগ্রামিং পরিচিতি",
    icon: "Code",
    color: "blue",
    order: 2,
  },
  {
    slug: "dsa",
    nameEn: "Data Structures & Algorithms",
    nameBn: "ডেটা স্ট্রাকচার ও অ্যালগরিদম",
    icon: "Binary",
    color: "emerald",
    order: 3,
  },
  {
    slug: "oop",
    nameEn: "OOP in C#",
    nameBn: "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং (C#)",
    icon: "Boxes",
    color: "violet",
    order: 4,
  },
  {
    slug: "design-patterns",
    nameEn: "Design Patterns & Principles",
    nameBn: "ডিজাইন প্যাটার্ন ও নীতিমালা",
    icon: "Layers",
    color: "amber",
    order: 5,
  },
  {
    slug: "uml",
    nameEn: "UML Diagrams",
    nameBn: "UML ডায়াগ্রাম",
    icon: "PenTool",
    color: "rose",
    order: 6,
  },
  {
    slug: "database",
    nameEn: "Database using PostgreSQL",
    nameBn: "PostgreSQL ডেটাবেজ",
    icon: "Database",
    color: "cyan",
    order: 7,
  },
  {
    slug: "system-design",
    nameEn: "System Design",
    nameBn: "সিস্টেম ডিজাইন ও আর্কিটেকচার",
    icon: "Network",
    color: "orange",
    order: 8,
  },
  {
    slug: "networks",
    nameEn: "Computer Networks",
    nameBn: "কম্পিউটার নেটওয়ার্কিং",
    icon: "Globe",
    color: "teal",
    order: 9,
  },
  {
    slug: "os",
    nameEn: "Operating Systems",
    nameBn: "অপারেটিং সিস্টেম ধারণা",
    icon: "Cpu",
    color: "slate",
    order: 10,
  },
  {
    slug: "ai-ml",
    nameEn: "AI & Machine Learning",
    nameBn: "কৃত্রিম বুদ্ধিমত্তা ও মেশিন লার্নিং",
    icon: "Brain",
    color: "pink",
    order: 11,
  },
  {
    slug: "behavioral",
    nameEn: "Behavioral Round Comprehensive",
    nameBn: "আচরণমূলক সাক্ষাৎকার প্রস্তুতি",
    icon: "Users",
    color: "lime",
    order: 12,
  },
  {
    slug: "competitive-programming",
    nameEn: "Competitive Programming",
    nameBn: "প্রতিযোগিতামূলক প্রোগ্রামিং",
    icon: "Trophy",
    color: "indigo",
    order: 13,
  },
] as const;

export const SITE_NAME = "Code For Career";
export const SITE_DESCRIPTION =
  "A free, bilingual learning platform for software engineering job preparation. Curated resources, practice problems, and structured roadmaps.";
export const SITE_URL = "https://code-for-career.vercel.app";
