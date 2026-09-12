export interface RoadmapProblem {
  id: string;
  titleEn: string;
  titleBn: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "INSANE";
  url: string;
  solutionUrl?: string;
  isCompleted?: boolean;
  isStarred?: boolean;
}

export interface RoadmapPrereq {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  url: string;
}

export interface RoadmapStage {
  id: string;
  number: number;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  y: number;
  height: number;
  nodeIds: string[];
}

export interface RoadmapNode {
  id: string;
  stepNumber: number;
  labelEn: string;
  labelBn: string;
  subtitleEn?: string;
  subtitleBn?: string;
  stageId: string;
  stageNameEn: string;
  stageNameBn: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  icon?: string;
  category: string;
  badge?: string;
  prerequisites: RoadmapPrereq[];
  children: string[]; // target node IDs
  problems: RoadmapProblem[];
}

export const BD_SWE_STAGES: RoadmapStage[] = [
  {
    id: "stage-1",
    number: 1,
    titleEn: "Stage 1: Programming & Tools Foundations",
    titleBn: "পর্যায় ১: প্রোগ্রামিং ও টুলস ভিত্তি",
    subtitleEn: "Master language syntax, primitives, memory models & version control",
    subtitleBn: "সি# সিনট্যাক্স, মেমোরি মডেল ও গিট ব্রাঞ্চিং",
    y: 20,
    height: 150,
    nodeIds: ["csharp", "git"],
  },
  {
    id: "stage-2",
    number: 2,
    titleEn: "Stage 2: Core Engineering & Problem Solving",
    titleBn: "পর্যায় ২: কোর সফটওয়্যার ইঞ্জিনিয়ারিং",
    subtitleEn: "Object-oriented design, data structures & algorithmic thinking",
    subtitleBn: "অবজেক্ট ওরিয়েন্টেড ডিজাইন, ডেটা স্ট্রাকচার ও অ্যালগরিদম",
    y: 195,
    height: 155,
    nodeIds: ["oop", "dsa", "competitive-programming"],
  },
  {
    id: "stage-3",
    number: 3,
    titleEn: "Stage 3: Web Architecture & Database",
    titleBn: "পর্যায় ৩: ওয়েব এপিআই ও ডেটাবেজ ম্যানেজমেন্ট",
    subtitleEn: "Build production REST APIs with ASP.NET Core & PostgreSQL",
    subtitleBn: "এএসপি ডটনেট কোর ওয়েব এপিআই ও রিলেশনাল ডেটাবেজ",
    y: 385,
    height: 155,
    nodeIds: ["dotnet", "database", "uml"],
  },
  {
    id: "stage-4",
    number: 4,
    titleEn: "Stage 4: Low-Level Systems & Software Design",
    titleBn: "পর্যায় ৪: লো-লেভেল সিস্টেম ও আর্কিটেকচার",
    subtitleEn: "Concurrency, networking protocols, OS internals & GoF design patterns",
    subtitleBn: "কনকারেন্সি, নেটওয়ার্কিং প্রোটোকল, ওএস ও ডিজাইন প্যাটার্ন",
    y: 575,
    height: 155,
    nodeIds: ["design-patterns", "os", "networks"],
  },
  {
    id: "stage-5",
    number: 5,
    titleEn: "Stage 5: High-Level Architecture & Interview Viva",
    titleBn: "পর্যায় ৫: সিস্টেম ডিজাইন ও ইন্টারভিউ",
    subtitleEn: "Distributed systems, scalability, AI fundamentals & HR salary negotiation",
    subtitleBn: "স্কেলিং, সিস্টেম ডিজাইন, এআই বেসিক ও ভাইভা প্রস্তুতি",
    y: 765,
    height: 340,
    nodeIds: ["system-design", "ai-ml", "behavioral"],
  },
];

export interface RoadmapTrack {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: string;
  canvasWidth: number;
  canvasHeight: number;
  nodes: RoadmapNode[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. BD Software Engineering Career Roadmap (12 Core Subjects)
// ─────────────────────────────────────────────────────────────────────────────
export const BD_SWE_ROADMAP: RoadmapTrack = {
  id: "bd-swe",
  titleEn: "BD Software Engineering Career",
  titleBn: "বাংলাদেশ সফটওয়্যার ক্যারিয়ার রোডম্যাপ",
  descriptionEn: "Complete 12-subject path for Bangladesh tech interviews from C# syntax to System Design.",
  descriptionBn: "C# ভাষার শুরু থেকে সিস্টেম ডিজাইন পর্যন্ত ১২টি মূল বিষয়ের পূর্ণাঙ্গ প্রস্তুতি রোডম্যাপ।",
  icon: "Briefcase",
  canvasWidth: 1080,
  canvasHeight: 1180,
  nodes: [
    {
      id: "csharp",
      stepNumber: 1,
      stageId: "stage-1",
      stageNameEn: "Foundations",
      stageNameBn: "মৌলিক ভিত্তি",
      labelEn: "Programming in C#",
      labelBn: "C# প্রোগ্রামিং",
      subtitleEn: "Language & Memory Model",
      subtitleBn: "ভাষা ও মেমোরি মডেল",
      x: 230,
      y: 70,
      width: 280,
      height: 68,
      category: "Foundations",
      icon: "Code2",
      badge: "Core",
      prerequisites: [],
      children: ["oop", "dsa"],
      problems: [
        { id: "cs-1", titleEn: "C# Variables, Primitives & Memory", titleBn: "C# ভেরিয়েবল ও মেমোরি", difficulty: "EASY", url: "/subjects/csharp/csharp-variables" },
        { id: "cs-2", titleEn: "Control Flow & Pattern Matching", titleBn: "কন্ট্রোল ফ্লো ও প্যাটার্ন ম্যাচিং", difficulty: "EASY", url: "/subjects/csharp/csharp-if-else" },
        { id: "cs-3", titleEn: "Collections: List vs Array vs Dictionary", titleBn: "কালেকশন ও ডেটা সংরক্ষণ", difficulty: "MEDIUM", url: "/subjects/csharp/collections-list" },
        { id: "cs-4", titleEn: "Value vs Reference Types, Boxing/Unboxing", titleBn: "ভ্যালু বনাম রেফারেন্স টাইপ", difficulty: "MEDIUM", url: "/subjects/csharp/types-value-types" },
        { id: "cs-5", titleEn: "Generics & Constraints", titleBn: "জেনেরিক্স ও শর্তাবলি", difficulty: "MEDIUM", url: "/subjects/csharp/generics-classes" },
        { id: "cs-6", titleEn: "LINQ Operations & Deferred Execution", titleBn: "LINQ কোয়েরি ও ডেফার্ড এক্সিকিউশন", difficulty: "HARD", url: "/subjects/csharp/linq-where" },
        { id: "cs-7", titleEn: "Async/Await, Tasks & Threading", titleBn: "অ্যাসিঙ্ক ও টাস্ক প্যারালেলিজম", difficulty: "HARD", url: "/subjects/csharp/async-await" },
        { id: "cs-8", titleEn: "Garbage Collector & IDisposable Pattern", titleBn: "মেমোরি ম্যানেজমেন্ট ও ডিসপোজ", difficulty: "HARD", url: "/subjects/csharp/resources-using" },
      ],
    },
    {
      id: "git",
      stepNumber: 2,
      stageId: "stage-1",
      stageNameEn: "Foundations",
      stageNameBn: "মৌলিক ভিত্তি",
      labelEn: "Git & Version Control",
      labelBn: "গিট ও ভার্সন কন্ট্রোল",
      subtitleEn: "VCS & Team Collaboration",
      subtitleBn: "ভার্সন কন্ট্রোল ও ব্রাঞ্চিং",
      x: 570,
      y: 70,
      width: 280,
      height: 68,
      category: "Foundations",
      icon: "GitBranch",
      prerequisites: [],
      children: ["competitive-programming"],
      problems: [
        { id: "git-1", titleEn: "Git Fundamentals: Commit, Branch & Merge", titleBn: "গিট বেসিক ও ব্রাঞ্চিং", difficulty: "EASY", url: "/subjects/csharp" },
        { id: "git-2", titleEn: "Merge vs Rebase & Conflict Resolution", titleBn: "মার্জ বনাম রিব্যাস ও কনফ্লিক্ট সমাধান", difficulty: "MEDIUM", url: "/subjects/csharp" },
        { id: "git-3", titleEn: "Git Flow & Pull Request Best Practices", titleBn: "গিট ফ্লো ও পিআর রিভিউ কালচার", difficulty: "MEDIUM", url: "/subjects/csharp" },
      ],
    },
    {
      id: "oop",
      stepNumber: 3,
      stageId: "stage-2",
      stageNameEn: "Core Engineering",
      stageNameBn: "কোর ইঞ্জিনিয়ারিং",
      labelEn: "OOP in C#",
      labelBn: "অবজেক্ট ওরিয়েন্টেড ডিজাইন",
      subtitleEn: "SOLID Principles & Polymorphism",
      subtitleBn: "সলিড ও অবজেক্ট ওরিয়েন্টেড",
      x: 95,
      y: 245,
      width: 255,
      height: 68,
      category: "Core Engineering",
      icon: "Boxes",
      badge: "Crucial",
      prerequisites: [
        { id: "csharp", titleEn: "C# Basics", titleBn: "C# বেসিক", subtitleEn: "Classes and methods", subtitleBn: "ক্লাস ও মেথড", url: "/subjects/csharp" },
      ],
      children: ["dotnet"],
      problems: [
        { id: "oop-1", titleEn: "Encapsulation, Abstraction & Access Modifiers", titleBn: "এনক্যাপসুলেশন ও অ্যাবস্ট্রাকশন", difficulty: "EASY", url: "/subjects/oop" },
        { id: "oop-2", titleEn: "Inheritance vs Composition Trade-offs", titleBn: "ইনহেরিটেন্স বনাম কম্পোজিশন", difficulty: "MEDIUM", url: "/subjects/oop" },
        { id: "oop-3", titleEn: "Polymorphism, Virtual Tables & Overriding", titleBn: "পলিমরফিজম ও মেথড ওভাররাইড", difficulty: "MEDIUM", url: "/subjects/oop" },
        { id: "oop-4", titleEn: "SOLID Principles: SRP, OCP, LSP, ISP, DIP", titleBn: "SOLID নীতিমালা গভীর বিশ্লেষণ", difficulty: "HARD", url: "/subjects/oop" },
        { id: "oop-5", titleEn: "Abstract Classes vs Interfaces in Modern .NET", titleBn: "অ্যাবস্ট্রাক্ট ক্লাস বনাম ইন্টারফেস", difficulty: "MEDIUM", url: "/subjects/oop" },
      ],
    },
    {
      id: "dsa",
      stepNumber: 4,
      stageId: "stage-2",
      stageNameEn: "Core Engineering",
      stageNameBn: "কোর ইঞ্জিনিয়ারিং",
      labelEn: "Data Structures & Algorithms",
      labelBn: "ডেটা স্ট্রাকচার ও অ্যালগরিদম",
      subtitleEn: "Trees, Graphs & DP Logic",
      subtitleBn: "ট্রি, গ্রাফ ও ডায়নামিক প্রোগ্রামিং",
      x: 405,
      y: 245,
      width: 255,
      height: 68,
      category: "Core Engineering",
      icon: "Binary",
      badge: "Essential",
      prerequisites: [
        { id: "csharp", titleEn: "C# Collections", titleBn: "C# কালেকশন", subtitleEn: "Arrays and Lists", subtitleBn: "অ্যারে ও লিস্ট", url: "/subjects/csharp" },
      ],
      children: ["database"],
      problems: [
        { id: "dsa-1", titleEn: "Time & Space Asymptotic Complexity", titleBn: "টাইম ও স্পেস কমপ্লেক্সিটি", difficulty: "EASY", url: "/subjects/dsa" },
        { id: "dsa-2", titleEn: "Arrays, Hash Maps & Two Pointers", titleBn: "অ্যারে ও হ্যাশ ম্যাপ কৌশল", difficulty: "EASY", url: "/subjects/dsa" },
        { id: "dsa-3", titleEn: "Binary Trees & BST Traversals (BFS/DFS)", titleBn: "বাইনারি ট্রি ও ট্রাভার্সাল", difficulty: "MEDIUM", url: "/subjects/dsa" },
        { id: "dsa-4", titleEn: "Graph Traversals (BFS, DFS, Dijkstra)", titleBn: "গ্রাফ অ্যালগরিদম ও শর্টেস্ট পাথ", difficulty: "HARD", url: "/subjects/dsa" },
        { id: "dsa-5", titleEn: "Dynamic Programming: Memoization & Tabulation", titleBn: "ডায়নামিক প্রোগ্রামিং কৌশল", difficulty: "HARD", url: "/subjects/dsa" },
      ],
    },
    {
      id: "uml",
      stepNumber: 8,
      stageId: "stage-3",
      stageNameEn: "Web Architecture",
      stageNameBn: "ওয়েব আর্কিটেকচার",
      labelEn: "UML Diagrams",
      labelBn: "UML ডায়াগ্রাম",
      subtitleEn: "Class & Sequence Diagrams",
      subtitleBn: "ক্লাস ও সিকোয়েন্স ডায়াগ্রাম",
      x: 715,
      y: 435,
      width: 255,
      height: 68,
      category: "Architecture",
      icon: "PenTool",
      prerequisites: [
        { id: "competitive-programming", titleEn: "Problem Solving", titleBn: "প্রবলেম সলভিং", subtitleEn: "Algorithmic thinking", subtitleBn: "লজিক্যাল ফ্লো", url: "/subjects/competitive-programming" },
      ],
      children: ["networks"],
      problems: [
        { id: "uml-1", titleEn: "Class Diagrams & Association/Aggregation", titleBn: "ক্লাস ডায়াগ্রাম সম্পর্ক", difficulty: "EASY", url: "/subjects/uml" },
        { id: "uml-2", titleEn: "Sequence Diagrams for RESTful API Flows", titleBn: "সিকোয়েন্স ডায়াগ্রাম ও এপিআই কল", difficulty: "MEDIUM", url: "/subjects/uml" },
        { id: "uml-3", titleEn: "Activity & State Machine Modeling", titleBn: "স্টেট মেশিন ও অ্যাক্টিভিটি মডেলিং", difficulty: "MEDIUM", url: "/subjects/uml" },
      ],
    },
    {
      id: "dotnet",
      stepNumber: 6,
      stageId: "stage-3",
      stageNameEn: "Web Architecture",
      stageNameBn: "ওয়েব আর্কিটেকচার",
      labelEn: ".NET Core / ASP.NET",
      labelBn: ".NET কোর ও ওয়েব এপিআই",
      subtitleEn: "ASP.NET Core & Web APIs",
      subtitleBn: "এপিআই ও ব্যাকএন্ড সার্ভিস",
      x: 95,
      y: 435,
      width: 255,
      height: 68,
      category: "Web & Backend",
      icon: "Layers",
      badge: "Industry Standard",
      prerequisites: [
        { id: "oop", titleEn: "OOP & Interfaces", titleBn: "OOP ও ইন্টারফেস", subtitleEn: "Inversion of Control", subtitleBn: "ডিপেন্ডেন্সি ইনজেকশন", url: "/subjects/oop" },
      ],
      children: ["design-patterns"],
      problems: [
        { id: "net-1", titleEn: "ASP.NET Core Middleware Pipeline & Request Lifecycle", titleBn: "মিডলওয়্যার পাইপলাইন", difficulty: "EASY", url: "/subjects/dotnet" },
        { id: "net-2", titleEn: "Dependency Injection Lifetimes: Transient, Scoped, Singleton", titleBn: "ডিপেন্ডেন্সি ইনজেকশন লাইফটাইম", difficulty: "MEDIUM", url: "/subjects/dotnet" },
        { id: "net-3", titleEn: "Entity Framework Core, Migrations & Linq-to-Entities", titleBn: "ইএফ কোর ও মাইগ্রেশন", difficulty: "MEDIUM", url: "/subjects/dotnet" },
        { id: "net-4", titleEn: "JWT Authentication, Authorization & Claims", titleBn: "জেডব্লিউটি অথেনটিকেশন ও সিকিউরিটি", difficulty: "HARD", url: "/subjects/dotnet" },
        { id: "net-5", titleEn: "Clean Architecture & CQRS with MediatR", titleBn: "ক্লিন আর্কিটেকচার ও CQRS", difficulty: "HARD", url: "/subjects/dotnet" },
      ],
    },
    {
      id: "database",
      stepNumber: 7,
      stageId: "stage-3",
      stageNameEn: "Web Architecture",
      stageNameBn: "ওয়েব আর্কিটেকচার",
      labelEn: "Database & PostgreSQL",
      labelBn: "ডেটাবেজ ও PostgreSQL",
      subtitleEn: "SQL Joins, Indexing & ACID",
      subtitleBn: "এসকিউএল কুয়েরি ও ইনডেক্সিং",
      x: 405,
      y: 435,
      width: 255,
      height: 68,
      category: "Persistence",
      icon: "Database",
      badge: "High Demand",
      prerequisites: [
        { id: "dsa", titleEn: "DSA", titleBn: "DSA", subtitleEn: "B-Trees & Hashing", subtitleBn: "ইনডেক্সিং কনসেপ্ট", url: "/subjects/dsa" },
      ],
      children: ["os"],
      problems: [
        { id: "db-1", titleEn: "SQL Joins, Subqueries & Aggregations", titleBn: "SQL জয়েন ও সাবকোয়েরি", difficulty: "EASY", url: "/subjects/database" },
        { id: "db-2", titleEn: "Relational Schema Normalization (1NF to BCNF)", titleBn: "ডেটাবেজ নরমালাইজেশন", difficulty: "MEDIUM", url: "/subjects/database" },
        { id: "db-3", titleEn: "B-Tree Indexes, Hash Indexes & Query Plans (EXPLAIN)", titleBn: "ইনডেক্সিং কৌশল ও কুয়েরি প্ল্যান", difficulty: "HARD", url: "/subjects/database" },
        { id: "db-4", titleEn: "ACID Properties & Transaction Isolation Levels", titleBn: "ট্রানজ্যাকশন ও আইসোলেশন লেভেল", difficulty: "HARD", url: "/subjects/database" },
      ],
    },
    {
      id: "competitive-programming",
      stepNumber: 5,
      stageId: "stage-2",
      stageNameEn: "Core Engineering",
      stageNameBn: "কোর ইঞ্জিনিয়ারিং",
      labelEn: "Competitive Programming",
      labelBn: "প্রতিযোগিতামূলক কোডিং",
      subtitleEn: "Fast I/O & Segment Trees",
      subtitleBn: "অ্যাডভান্সড কোডিং ও গণিত",
      x: 715,
      y: 245,
      width: 255,
      height: 68,
      category: "Problem Solving",
      icon: "Zap",
      prerequisites: [
        { id: "git", titleEn: "Git VCS", titleBn: "গিট ভার্সন কন্ট্রোল", subtitleEn: "Code workflow", subtitleBn: "প্রজেক্ট ব্রাঞ্চিং", url: "/subjects/csharp" },
      ],
      children: ["uml"],
      problems: [
        { id: "cp-1", titleEn: "Fast I/O & Bitwise Tricks in C++ / C#", titleBn: "ফাস্ট আই/ও ও বিটওয়াইজ ট্রিকস", difficulty: "MEDIUM", url: "/subjects/competitive-programming" },
        { id: "cp-2", titleEn: "Number Theory: Sieve, Modular Arithmetic & GCD", titleBn: "নাম্বার থিওরি ও মডিউলার পাটিগণিত", difficulty: "MEDIUM", url: "/subjects/competitive-programming" },
        { id: "cp-3", titleEn: "Segment Tree & Fenwick Tree Range Queries", titleBn: "সেগমেন্ট ট্রি ও রেঞ্জ কুয়েরি", difficulty: "HARD", url: "/subjects/competitive-programming" },
      ],
    },
    {
      id: "design-patterns",
      stepNumber: 9,
      stageId: "stage-4",
      stageNameEn: "Low-Level Systems",
      stageNameBn: "লো-লেভেল সিস্টেম",
      labelEn: "Design Patterns",
      labelBn: "ডিজাইন প্যাটার্ন ও প্রিন্সিপালস",
      subtitleEn: "GoF Patterns & Clean Code",
      subtitleBn: "ডিজাইন প্যাটার্ন ও ক্লিন কোড",
      x: 95,
      y: 625,
      width: 255,
      height: 68,
      category: "Architecture",
      icon: "Puzzle",
      badge: "Interview Must",
      prerequisites: [
        { id: "dotnet", titleEn: "ASP.NET Core", titleBn: "ASP.NET Core", subtitleEn: "DI and Services", subtitleBn: "ডিপেন্ডেন্সি ইনজেকশন", url: "/subjects/dotnet" },
      ],
      children: ["system-design"],
      problems: [
        { id: "dp-1", titleEn: "Singleton, Factory & Abstract Factory Patterns", titleBn: "সিংগলটন ও ফ্যাক্টরি প্যাটার্ন", difficulty: "EASY", url: "/subjects/design-patterns" },
        { id: "dp-2", titleEn: "Observer, Strategy & Command Patterns", titleBn: "অবজার্ভার ও স্ট্র্যাটেজি প্যাটার্ন", difficulty: "MEDIUM", url: "/subjects/design-patterns" },
        { id: "dp-3", titleEn: "Decorator, Adapter & Facade Patterns", titleBn: "ডেকোরেটর ও অ্যাডাপ্টার প্যাটার্ন", difficulty: "MEDIUM", url: "/subjects/design-patterns" },
        { id: "dp-4", titleEn: "Repository & Unit of Work Pattern in .NET", titleBn: "রিপোজিটরি ও ইউনিট অব ওয়ার্ক", difficulty: "HARD", url: "/subjects/design-patterns" },
      ],
    },
    {
      id: "os",
      stepNumber: 10,
      stageId: "stage-4",
      stageNameEn: "Low-Level Systems",
      stageNameBn: "লো-লেভেল সিস্টেম",
      labelEn: "Operating Systems",
      labelBn: "অপারেটিং সিস্টেম",
      subtitleEn: "Concurrency & Memory Paging",
      subtitleBn: "থ্রেড ও মেমোরি পেজিং",
      x: 405,
      y: 625,
      width: 255,
      height: 68,
      category: "Infrastructure",
      icon: "Cpu",
      prerequisites: [
        { id: "database", titleEn: "Database Locks", titleBn: "ডেটাবেজ লকিং", subtitleEn: "Transactions & Concurrency", subtitleBn: "কনকারেন্সি নিয়ন্ত্রণ", url: "/subjects/database" },
      ],
      children: ["system-design"],
      problems: [
        { id: "os-1", titleEn: "Processes vs Threads, Context Switching", titleBn: "প্রসেস বনাম থ্রেড", difficulty: "EASY", url: "/subjects/os" },
        { id: "os-2", titleEn: "Deadlocks: Necessary Conditions & Bankers Algorithm", titleBn: "ডেডলক ও সমাধান কৌশল", difficulty: "MEDIUM", url: "/subjects/os" },
        { id: "os-3", titleEn: "Virtual Memory, Paging, Page Faults & LRU", titleBn: "ভার্চুয়াল মেমোরি ও পেজিং", difficulty: "HARD", url: "/subjects/os" },
        { id: "os-4", titleEn: "Concurrency Synchronization: Mutex, Semaphore, Spinlock", titleBn: "মিউটেক্স ও সেমাফোর সিঙ্ক", difficulty: "HARD", url: "/subjects/os" },
      ],
    },
    {
      id: "networks",
      stepNumber: 11,
      stageId: "stage-4",
      stageNameEn: "Low-Level Systems",
      stageNameBn: "লো-লেভেল সিস্টেম",
      labelEn: "Computer Networks",
      labelBn: "কম্পিউটার নেটওয়ার্কিং",
      subtitleEn: "TCP/IP, HTTP/2 & WebSockets",
      subtitleBn: "নেটওয়ার্কিং প্রোটোকল",
      x: 715,
      y: 625,
      width: 255,
      height: 68,
      category: "Infrastructure",
      icon: "Globe",
      prerequisites: [
        { id: "uml", titleEn: "Sequence Diagrams", titleBn: "সিকোয়েন্স ডায়াগ্রাম", subtitleEn: "Network Calls", subtitleBn: "নেটওয়ার্ক প্রোটোকল", url: "/subjects/uml" },
      ],
      children: ["ai-ml"],
      problems: [
        { id: "netw-1", titleEn: "OSI 7 Layers vs TCP/IP Protocol Stack", titleBn: "OSI ও TCP/IP মডেল", difficulty: "EASY", url: "/subjects/networks" },
        { id: "netw-2", titleEn: "TCP 3-Way Handshake vs UDP Reliability Tradeoffs", titleBn: "TCP থ্রি-ওয়ে হ্যান্ডশেক", difficulty: "MEDIUM", url: "/subjects/networks" },
        { id: "netw-3", titleEn: "HTTP/1.1 vs HTTP/2 vs HTTP/3 & WebSockets", titleBn: "HTTP ভার্সন ও ওয়েবসকেট", difficulty: "MEDIUM", url: "/subjects/networks" },
        { id: "netw-4", titleEn: "DNS Resolution, TLS/SSL Handshake & Certificates", titleBn: "ডিএনএস ও টিএলএস এনক্রিপশন", difficulty: "HARD", url: "/subjects/networks" },
      ],
    },
    {
      id: "system-design",
      stepNumber: 12,
      stageId: "stage-5",
      stageNameEn: "System Design & Career",
      stageNameBn: "সিস্টেম ডিজাইন ও ক্যারিয়ার",
      labelEn: "System Design",
      labelBn: "সিস্টেম ডিজাইন",
      subtitleEn: "Distributed Systems & Scalability",
      subtitleBn: "স্কেলাবিলিটি ও ডিস্ট্রিবিউটেড সিস্টেম",
      x: 230,
      y: 815,
      width: 280,
      height: 68,
      category: "Architecture",
      icon: "Server",
      badge: "Senior / Lead",
      prerequisites: [
        { id: "design-patterns", titleEn: "Design Patterns", titleBn: "ডিজাইন প্যাটার্ন", subtitleEn: "Microservices & Clean Code", subtitleBn: "ক্লিন আর্কিটেকচার", url: "/subjects/design-patterns" },
        { id: "os", titleEn: "Operating Systems", titleBn: "অপারেটিং সিস্টেম", subtitleEn: "Concurrency & Caching", subtitleBn: "কনকারেন্সি ও ক্যাশিং", url: "/subjects/os" },
      ],
      children: ["behavioral"],
      problems: [
        { id: "sd-1", titleEn: "Horizontal vs Vertical Scaling, Load Balancing (Nginx, HAProxy)", titleBn: "স্কেলিং ও লোড ব্যালেন্সার", difficulty: "MEDIUM", url: "/subjects/system-design" },
        { id: "sd-2", titleEn: "Caching Strategies: Redis, Memcached, Cache-Aside & Eviction", titleBn: "ক্যাশিং কৌশল ও রেডিস", difficulty: "MEDIUM", url: "/subjects/system-design" },
        { id: "sd-3", titleEn: "CAP Theorem, Eventual Consistency & PACELC", titleBn: "সিএপি উপপাদ্য ও কনসিস্টেন্সি", difficulty: "HARD", url: "/subjects/system-design" },
        { id: "sd-4", titleEn: "Message Queues: Kafka vs RabbitMQ, Asynchronous Workflows", titleBn: "মেসেজ ব্রোকার ও কাফকা", difficulty: "HARD", url: "/subjects/system-design" },
        { id: "sd-5", titleEn: "Design URL Shortener (TinyURL) End-to-End", titleBn: "TinyURL সিস্টেম ডিজাইন প্রজেক্ট", difficulty: "HARD", url: "/subjects/system-design" },
      ],
    },
    {
      id: "ai-ml",
      stepNumber: 13,
      stageId: "stage-5",
      stageNameEn: "System Design & Career",
      stageNameBn: "সিস্টেম ডিজাইন ও ক্যারিয়ার",
      labelEn: "AI & Machine Learning",
      labelBn: "মেশিন লার্নিং ধারণা",
      subtitleEn: "ML Fundamentals & Transformers",
      subtitleBn: "মেশিন লার্নিং ধারণা",
      x: 570,
      y: 815,
      width: 280,
      height: 68,
      category: "Emerging Tech",
      icon: "Sparkles",
      prerequisites: [
        { id: "networks", titleEn: "Networks", titleBn: "নেটওয়ার্কিং", subtitleEn: "APIs & Data Pipes", subtitleBn: "এপিআই ও ডেটা পাইপলাইন", url: "/subjects/networks" },
      ],
      children: ["behavioral"],
      problems: [
        { id: "ai-1", titleEn: "Supervised vs Unsupervised vs Reinforcement Learning", titleBn: "মেশিন লার্নিং টাইপস", difficulty: "EASY", url: "/subjects/ai-ml" },
        { id: "ai-2", titleEn: "Gradient Descent, Cost Functions & Overfitting (Regularization)", titleBn: "গ্রেডিয়েন্ট ডিসেন্ট ও রেগুলারাইজেশন", difficulty: "MEDIUM", url: "/subjects/ai-ml" },
        { id: "ai-3", titleEn: "Neural Network Architecture, Activation Functions & Transformers", titleBn: "নিউরাল নেটওয়ার্ক ও ট্রান্সফরমার", difficulty: "HARD", url: "/subjects/ai-ml" },
      ],
    },
    {
      id: "behavioral",
      stepNumber: 14,
      stageId: "stage-5",
      stageNameEn: "System Design & Career",
      stageNameBn: "সিস্টেম ডিজাইন ও ক্যারিয়ার",
      labelEn: "Behavioral & HR Round",
      labelBn: "আচরণমূলক সাক্ষাৎকার প্রস্তুতি",
      subtitleEn: "STAR Method & Salary Negotiation",
      subtitleBn: "ভাইভা ও ক্যারিয়ার গ্রোথ",
      x: 370,
      y: 995,
      width: 340,
      height: 74,
      category: "Interview Mastery",
      icon: "Users",
      badge: "Final Step",
      prerequisites: [
        { id: "system-design", titleEn: "Architecture", titleBn: "আর্কিটেকচার", subtitleEn: "Project story", subtitleBn: "বাস্তব কাজের অভিজ্ঞতা", url: "/subjects/system-design" },
      ],
      children: [],
      problems: [
        { id: "hr-1", titleEn: "STAR Method Mastery: Situation, Task, Action, Result", titleBn: "STAR মেথডে উত্তর গঠন", difficulty: "EASY", url: "/subjects/behavioral" },
        { id: "hr-2", titleEn: "Handling Conflict & Challenging Engineering Scenarios", titleBn: "টিম কনফ্লিক্ট ও চ্যালেঞ্জ মোকাবেলা", difficulty: "MEDIUM", url: "/subjects/behavioral" },
        { id: "hr-3", titleEn: "Salary Negotiation & Technical Communication for BD Companies", titleBn: "বেতন আলোচনা ও প্রস্তুতি কৌশল", difficulty: "MEDIUM", url: "/subjects/behavioral" },
      ],
    },
  ],
};

export const ALL_ROADMAPS: RoadmapTrack[] = [BD_SWE_ROADMAP];
