import { SUBJECTS, type SubjectMeta } from "./constants";
import type { DifficultyLevel } from "@/types/database";

export interface CurriculumSubject extends SubjectMeta {
  trackId: "track-oop" | "track-dsa" | "track-systems" | "track-career";
  trackNameEn: string;
  trackNameBn: string;
  estimatedLessons: number;
  estimatedHours: number;
  difficulty: DifficultyLevel;
  starterSlug: string;
  topicsEn: string[];
  topicsBn: string[];
}

export const CURRICULUM_TRACKS = [
  {
    id: "track-oop" as const,
    nameEn: "Object-Oriented Engineering",
    nameBn: "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং ও আর্কিটেকচার",
    descEn: "C# syntax, OOP principles, SOLID architecture, design patterns, and UML diagrams.",
    descBn: "C# ভাষার মূল ধারণা, অবজেক্ট-ওরিয়েন্টেড ডিজাইন, SOLID নীতিমালা ও সফটওয়্যার আর্কিটেকচার।",
  },
  {
    id: "track-dsa" as const,
    nameEn: "Data Structures & Problem Solving",
    nameBn: "ডেটা স্ট্রাকচার ও সমস্যা সমাধান",
    descEn: "Complexity analysis, essential data structures, algorithms, and contest strategies.",
    descBn: "জটিলতা বিশ্লেষণ, মৌলিক ডেটা স্ট্রাকচার, অ্যালগরিদম ও সমস্যা সমাধানের কৌশল।",
  },
  {
    id: "track-systems" as const,
    nameEn: "Systems & Core Infrastructure",
    nameBn: "সিস্টেম ও মূল অবকাঠামো",
    descEn: "PostgreSQL relational databases, distributed systems, operating systems, and networking.",
    descBn: "PostgreSQL ডেটাবেজ, সিস্টেম ডিজাইন, অপারেটিং সিস্টেম ও কম্পিউটার নেটওয়ার্কিং।",
  },
  {
    id: "track-career" as const,
    nameEn: "Modern Tech & Interview Mastery",
    nameBn: "আধুনিক প্রযুক্তি ও সাক্ষাৎকার দক্ষতা",
    descEn: "Machine learning math foundations and behavioral interview frameworks.",
    descBn: "মেশিন লার্নিংয়ের গাণিতিক ভিত্তি এবং আচরণমূলক সাক্ষাৎকারের ব্যবহারিক প্রস্তুতি।",
  },
] as const;

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  {
    ...SUBJECTS[0], // csharp
    trackId: "track-oop",
    trackNameEn: "Object-Oriented Engineering",
    trackNameBn: "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং ও আর্কিটেকচার",
    estimatedLessons: 98,
    estimatedHours: 32,
    difficulty: "EASY",
    starterSlug: "csharp-variables",
    topicsEn: ["Syntax & Control Flow", "Collections & Generics", "Type System & Memory", "LINQ & Async Programming"],
    topicsBn: ["সিনট্যাক্স ও কন্ট্রোল ফ্লো", "কালেকশন ও জেনেরিক্স", "টাইপ সিস্টেম ও মেমোরি", "লিন্ক ও অ্যাসিঙ্ক প্রোগ্রামিং"],
  },
  {
    ...SUBJECTS[1], // dsa
    trackId: "track-dsa",
    trackNameEn: "Data Structures & Problem Solving",
    trackNameBn: "ডেটা স্ট্রাকচার ও সমস্যা সমাধান",
    estimatedLessons: 14,
    estimatedHours: 24,
    difficulty: "MEDIUM",
    starterSlug: "asymptotic-complexity",
    topicsEn: ["Big-O Complexity", "Trees & Graphs", "Dynamic Programming", "Greedy Heuristics"],
    topicsBn: ["Big-O জটিলতা বিশ্লেষণ", "ট্রি ও গ্রাফ ডেটা স্ট্রাকচার", "ডায়নামিক প্রোগ্রামিং", "গ্রিডি অ্যালগরিদম কৌশল"],
  },
  {
    ...SUBJECTS[2], // oop
    trackId: "track-oop",
    trackNameEn: "Object-Oriented Engineering",
    trackNameBn: "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং ও আর্কিটেকচার",
    estimatedLessons: 7,
    estimatedHours: 10,
    difficulty: "MEDIUM",
    starterSlug: "solid-principles-overview",
    topicsEn: ["SOLID Deep-Dive", "Encapsulation", "Polymorphism & V-Table", "Composition vs Inheritance"],
    topicsBn: ["SOLID নীতিমালা গভীর অধ্যয়ন", "এনক্যাপসুলেশন ও অ্যাবস্ট্র্যাকশন", "পলিমরফিজম ও ভার্চুয়াল টেবিল", "কম্পোজিশন বনাম উত্তরাধিকার"],
  },
  {
    ...SUBJECTS[3], // design-patterns
    trackId: "track-oop",
    trackNameEn: "Object-Oriented Engineering",
    trackNameBn: "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং ও আর্কিটেকচার",
    estimatedLessons: 9,
    estimatedHours: 14,
    difficulty: "HARD",
    starterSlug: "factory-and-singleton",
    topicsEn: ["Creational Patterns", "Observer & Strategy", "Repository & Unit of Work", "Dependency Injection"],
    topicsBn: ["সৃষ্টিধর্মী ডিজাইন প্যাটার্ন", "অবজার্ভার ও স্ট্র্যাটেজি প্যাটার্ন", "রিপোজিটরি ও ইউনিট অব ওয়ার্ক", "ডিপেন্ডেন্সি ইনজেকশন"],
  },
  {
    ...SUBJECTS[4], // uml
    trackId: "track-oop",
    trackNameEn: "Object-Oriented Engineering",
    trackNameBn: "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং ও আর্কিটেকচার",
    estimatedLessons: 5,
    estimatedHours: 6,
    difficulty: "EASY",
    starterSlug: "class-diagram-essentials",
    topicsEn: ["Class Diagrams", "Sequence Diagrams", "Component Diagrams", "Interview Modeling"],
    topicsBn: ["ক্লাস ডায়াগ্রাম প্রণয়ন", "সিকোয়েন্স ডায়াগ্রাম", "কম্পোনেন্ট ও ডিপ্লয়মেন্ট মডেলিং", "সাক্ষাৎকারে সিস্টেম মডেলিং"],
  },
  {
    ...SUBJECTS[5], // database
    trackId: "track-systems",
    trackNameEn: "Systems & Core Infrastructure",
    trackNameBn: "সিস্টেম ও মূল অবকাঠামো",
    estimatedLessons: 10,
    estimatedHours: 16,
    difficulty: "MEDIUM",
    starterSlug: "sql-indexes-and-b-trees",
    topicsEn: ["B-Tree & Hash Indexes", "ACID & Isolation", "Query Execution Plans", "Normalization"],
    topicsBn: ["B-Tree ও হ্যাশ ইনডেক্স", "ACID বৈশিষ্ট্য ও আইসোলেশন স্তর", "কোয়েরি এক্সিকিউশন প্ল্যান", "ডেটাবেজ নরমালাইজেশন"],
  },
  {
    ...SUBJECTS[6], // system-design
    trackId: "track-systems",
    trackNameEn: "Systems & Core Infrastructure",
    trackNameBn: "সিস্টেম ও মূল অবকাঠামো",
    estimatedLessons: 11,
    estimatedHours: 20,
    difficulty: "HARD",
    starterSlug: "horizontal-vs-vertical-scaling",
    topicsEn: ["Load Balancing & Caching", "Database Sharding", "Message Queues & Kafka", "Rate Limiting"],
    topicsBn: ["লোড ব্যালেন্সিং ও ক্যাশিং কৌশল", "ডেটাবেজ শার্ডিং", "মেসেজ কিউ ও Kafka", "রেট লিমিটিং ও API নিরাপত্তা"],
  },
  {
    ...SUBJECTS[7], // networks
    trackId: "track-systems",
    trackNameEn: "Systems & Core Infrastructure",
    trackNameBn: "সিস্টেম ও মূল অবকাঠামো",
    estimatedLessons: 6,
    estimatedHours: 8,
    difficulty: "MEDIUM",
    starterSlug: "osi-and-tcp-ip-models",
    topicsEn: ["TCP Handshake & UDP", "HTTP/1.1 vs HTTP/2 vs 3", "DNS & CDN Routing", "TLS/HTTPS Handshake"],
    topicsBn: ["TCP হ্যান্ডশেক ও UDP প্রোটোকল", "HTTP/1.1, HTTP/2 ও HTTP/3 তুলনা", "DNS ও CDN কার্যপ্রণালী", "TLS/HTTPS নিরাপত্তা কৌশল"],
  },
  {
    ...SUBJECTS[8], // os
    trackId: "track-systems",
    trackNameEn: "Systems & Core Infrastructure",
    trackNameBn: "সিস্টেম ও মূল অবকাঠামো",
    estimatedLessons: 7,
    estimatedHours: 10,
    difficulty: "MEDIUM",
    starterSlug: "process-vs-thread",
    topicsEn: ["Processes & Threads", "Virtual Memory & Paging", "Mutexes & Semaphores", "Deadlock Prevention"],
    topicsBn: ["প্রক্রিয়া ও থ্রেড ব্যবস্থাপনা", "ভার্চুয়াল মেমোরি ও পেজিং", "মিউটেক্স, সেমাফোর ও সমান্তরালতা", "ডেডলক শনাক্তকরণ ও প্রতিরোধ"],
  },
  {
    ...SUBJECTS[9], // ai-ml
    trackId: "track-career",
    trackNameEn: "Modern Tech & Interview Mastery",
    trackNameBn: "আধুনিক প্রযুক্তি ও সাক্ষাৎকার দক্ষতা",
    estimatedLessons: 6,
    estimatedHours: 8,
    difficulty: "MEDIUM",
    starterSlug: "gradient-descent-and-loss",
    topicsEn: ["Gradient Descent Math", "Loss Functions", "Neural Nets Architecture", "Transformers & LLM Basics"],
    topicsBn: ["গ্রেডিয়েন্ট ডিসেন্ট অ্যালগরিদম", "লস ফাংশন ও অপটিমাইজেশন", "নিউরাল নেটওয়ার্কের গঠন", "ট্রান্সফর্মার ও বৃহৎ ভাষা মডেল"],
  },
  {
    ...SUBJECTS[10], // behavioral
    trackId: "track-career",
    trackNameEn: "Modern Tech & Interview Mastery",
    trackNameBn: "আধুনিক প্রযুক্তি ও সাক্ষাৎকার দক্ষতা",
    estimatedLessons: 5,
    estimatedHours: 6,
    difficulty: "EASY",
    starterSlug: "star-framework-guide",
    topicsEn: ["STAR Framework", "Handling Conflicts", "Leadership & Ownership", "Culture Fit Vivas"],
    topicsBn: ["STAR ফ্রেমওয়ার্ক", "দ্বন্দ্ব ব্যবস্থাপনা কৌশল", "নেতৃত্ব ও দায়িত্ববোধ", "প্রতিষ্ঠান সংস্কৃতি ও ভাইভা"],
  },
  {
    ...SUBJECTS[11], // competitive-programming
    trackId: "track-dsa",
    trackNameEn: "Data Structures & Problem Solving",
    trackNameBn: "ডেটা স্ট্রাকচার ও সমস্যা সমাধান",
    estimatedLessons: 9,
    estimatedHours: 16,
    difficulty: "INSANE",
    starterSlug: "contest-mindset-and-tactics",
    topicsEn: ["Number Theory & Math", "Segment Trees & BIT", "Bitmask Dynamic Programming", "Online Contests Tactics"],
    topicsBn: ["সংখ্যাতত্ত্ব ও গণিত", "সেগমেন্ট ট্রি ও BIT", "বিটমাস্ক ডায়নামিক প্রোগ্রামিং", "প্রতিযোগিতামূলক কৌশল"],
  },
];
