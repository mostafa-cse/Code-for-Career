-- Seed data: 12 subjects and initial lesson content with LaTeX

insert into subjects (id, slug, name_en, name_bn, icon, color, description_en, description_bn, display_order)
values
  ('11111111-1111-1111-1111-111111111001', 'csharp', 'Programming in C#', 'C# প্রোগ্রামিং', 'Code', 'blue', 'Master modern C# from syntax to advanced memory management and async workflows.', 'বেসিক সিনট্যাক্স থেকে শুরু করে অ্যাডভান্সড মেমোরি ম্যানেজমেন্ট ও অ্যাসিনক্রোনাস প্রোগ্রামিং।', 1),
  ('11111111-1111-1111-1111-111111111002', 'dsa', 'Data Structures & Algorithms', 'ডাটা স্ট্রাকচার ও অ্যালগরিদম', 'Binary', 'emerald', 'Core algorithmic techniques, complexity analysis, and essential data structures.', 'টাইম কমপ্লেক্সিটি অ্যানালাইসিস এবং স্ট্যান্ডার্ড ডাটা স্ট্রাকচার ও অ্যালগরিদম।', 2),
  ('11111111-1111-1111-1111-111111111003', 'oop', 'OOP in C#', 'C# এ অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং', 'Boxes', 'violet', 'Object-oriented programming concepts, SOLID principles, and clean design in C#.', 'অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিংয়ের মূল ভিত্তি, SOLID নীতিমালা এবং ক্লিন কোডিং।', 3),
  ('11111111-1111-1111-1111-111111111004', 'design-patterns', 'Design Patterns & Principles', 'ডিজাইন প্যাটার্ন ও প্রিন্সিপলস', 'Layers', 'amber', 'Creational, structural, and behavioral design patterns with architectural practices.', 'সফটওয়্যার ডিজাইনে বহুল ব্যবহৃত ডিজাইন প্যাটার্ন ও তাদের ব্যবহারিক প্রয়োগ।', 4),
  ('11111111-1111-1111-1111-111111111005', 'uml', 'UML Diagrams', 'ইউএমএল ডায়াগ্রাম', 'PenTool', 'rose', 'Visual modeling of software systems using class, sequence, and component diagrams.', 'সফটওয়্যার আর্কিটেকচার মডেলিংয়ের জন্য প্রয়োজনীয় বিভিন্ন ধরনের UML ডায়াগ্রাম।', 5),
  ('11111111-1111-1111-1111-111111111006', 'database', 'Database using PostgreSQL', 'পোস্টগ্রেস ডাটাবেজ', 'Database', 'cyan', 'Relational database fundamentals, SQL queries, indexing, and transaction isolation.', 'PostgreSQL ডাটাবেজ ডিজাইন, কোয়েরি অপটিমাইজেশন, ইনডেক্সিং এবং ট্রানজাকশন।', 6),
  ('11111111-1111-1111-1111-111111111007', 'system-design', 'System Design', 'সিস্টেম ডিজাইন', 'Network', 'orange', 'Scalable distributed system concepts, caching, load balancing, and real-world architectures.', 'হাই-স্কেল ডিস্ট্রিবিউটেড সিস্টেম ডিজাইন, ক্যাশিং স্ট্র্যাটেজি ও মাইক্রোসার্ভিস।', 7),
  ('11111111-1111-1111-1111-111111111008', 'networks', 'Computer Networks', 'কম্পিউটার নেটওয়ার্ক', 'Globe', 'teal', 'Networking layers, TCP/IP stack, HTTP protocols, DNS, and modern network security.', 'ওএসআই ও টিসিপি/আইপি মডেল, রাউটিং, এইচটিটিপি প্রোটোকল ও নেটওয়ার্ক সিকিউরিটি।', 8),
  ('11111111-1111-1111-1111-111111111009', 'os', 'Operating Systems', 'অপারেটিং সিস্টেম', 'Cpu', 'slate', 'Processes, concurrency, virtual memory, thread synchronization, and CPU scheduling.', 'প্রসেস ম্যানেজমেন্ট, কনকারেন্সি, ভার্চুয়াল মেমোরি ও সিপিইউ শিডিউলিং।', 9),
  ('11111111-1111-1111-1111-111111111010', 'ai-ml', 'AI & Machine Learning', 'এআই ও মেশিন লার্নিং', 'Brain', 'pink', 'Machine learning foundations, gradient descent, loss functions, and deep learning basics.', 'মেশিন লার্নিংয়ের গাণিতিক ভিত্তি, অপটিমাইজেশন অ্যালগরিদম ও নিউরাল নেটওয়ার্ক।', 10),
  ('11111111-1111-1111-1111-111111111011', 'behavioral', 'Behavioral Round Comprehensive', 'বিহেভিওরাল রাউন্ড', 'Users', 'lime', 'Effective communication, STAR method responses, conflict resolution, and leadership.', 'সফটওয়্যার ইঞ্জিনিয়ারিং ইন্টারভিউয়ের বিহেভিওরাল রাউন্ড প্রস্তুতির পূর্ণাঙ্গ গাইড।', 11),
  ('11111111-1111-1111-1111-111111111012', 'competitive-programming', 'Competitive Programming', 'কম্পিটিটিভ প্রোগ্রামিং', 'Trophy', 'indigo', 'Advanced competitive programming problem-solving patterns and contest strategies.', 'প্রতিযোগিতামূলক প্রোগ্রামিংয়ের টেকনিক, ডেটা স্ট্রাকচার ও কনটেস্ট স্ট্র্যাটেজি।', 12)
on conflict (slug) do nothing;

-- Initial Lesson for C# with LaTeX math notation
insert into lessons (id, subject_id, slug, title_en, title_bn, content_en, content_bn, difficulty, display_order, prerequisites)
values (
  '22222222-2222-2222-2222-222222222001',
  '11111111-1111-1111-1111-111111111001',
  'variables-and-data-types',
  'Variables and Data Types',
  'ভ্যারিয়েবল ও ডেটা টাইপ',
  '# Variables and Data Types in C#

In C#, a variable is a named storage location in memory. C# is a strongly-typed language, meaning every variable must declare its type.

## Value Types vs Reference Types
Value types directly hold their value on the stack, while reference types store a reference to the memory address allocated on the heap.

The memory footprint of an $n$-bit integer satisfies:

$$\text{Range} = [-2^{n-1}, 2^{n-1} - 1]$$

For example, a 32-bit signed integer (`int`) spans from $-2^{31}$ to $2^{31}-1$.',
  '# C# এ ভ্যারিয়েবল ও ডেটা টাইপ

C# একটি স্ট্রংলি-টাইপড ল্যাঙ্গুয়েজ, যার মানে প্রতিটি ভ্যারিয়েবলের জন্য একটি নির্দিষ্ট ডেটা টাইপ নির্ধারণ করতে হয়।

## ভ্যালু টাইপ বনাম রেফারেন্স টাইপ
ভ্যালু টাইপ সরাসরি স্ট্যাক মেমরিতে মান সংরক্ষণ করে, যেখানে রেফারেন্স টাইপ হিপ মেমরিতে থাকা ডেটার অ্যাড্রেস বা রেফারেন্স ধরে রাখে।

একটি $n$-বিট ইন্টিজারের মান ধারণক্ষমতা:

$$\text{Range} = [-2^{n-1}, 2^{n-1} - 1]$$

উদাহরণস্বরূপ, একটি ৩২-বিট ইন্টিজার (`int`) $-2^{31}$ থেকে $2^{31}-1$ পর্যন্ত মান সংরক্ষণ করতে পারে।',
  'EASY',
  1,
  array[]::text[]
)
on conflict (subject_id, slug) do nothing;

-- Resources for the lesson
insert into resources (lesson_id, source, title, url, description, is_starred, display_order)
values
  ('22222222-2222-2222-2222-222222222001', 'MSDN', 'C# Type System Documentation', 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/', 'Official Microsoft overview of the C# type hierarchy and value vs reference semantics.', true, 1),
  ('22222222-2222-2222-2222-222222222001', 'C# Guide', 'Common Type System in .NET', 'https://learn.microsoft.com/en-us/dotnet/standard/base-types/common-type-system', 'Detailed explanation of the Common Type System across all .NET runtime languages.', false, 2);

-- Problem for the lesson
insert into problems (lesson_id, source, name, url, difficulty, company, tags, solution_en, solution_bn, display_order)
values (
  '22222222-2222-2222-2222-222222222001',
  'LeetCode',
  'Reverse Integer',
  'https://leetcode.com/problems/reverse-integer/',
  'MEDIUM',
  'Enosis Solutions',
  array['Math', 'Bit Manipulation'],
  'Check for 32-bit signed integer overflow before multiplying by 10.',
  '১০ দিয়ে গুণ করার আগে ৩২-বিট ইন্টিজার ওভারফ্লো চেক করুন।',
  1
);
