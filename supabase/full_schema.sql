-- BD Software Prep / Code For Career - Full Schema Setup
-- Run this in your Supabase Dashboard -> SQL Editor

-- ==========================================
-- File: supabase/migrations/001_create_enums.sql
-- ==========================================
-- Enums for application roles, difficulty levels, and statuses

create type user_role as enum ('USER', 'ADMIN');

create type difficulty_level as enum ('EASY', 'MEDIUM', 'HARD', 'INSANE');

create type progress_status as enum ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

create type suggestion_status as enum ('PENDING', 'APPROVED', 'REJECTED');


-- ==========================================
-- File: supabase/migrations/002_create_tables.sql
-- ==========================================
-- Content tables: Subjects, Lessons, Resources, and Problems

create table subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_bn text not null,
  icon text not null,
  color text not null,
  description_en text,
  description_bn text,
  display_order int not null,
  created_at timestamptz not null default now()
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id) on delete cascade,
  slug text not null,
  title_en text not null,
  title_bn text not null,
  content_en text not null,
  content_bn text not null,
  difficulty difficulty_level not null default 'EASY',
  display_order int not null,
  prerequisites text[] default array[]::text[],
  created_at timestamptz not null default now(),
  unique(subject_id, slug)
);

create table resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  source text not null,
  title text not null,
  url text not null,
  description text,
  is_starred boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table problems (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  source text not null,
  name text not null,
  url text,
  difficulty difficulty_level not null default 'EASY',
  company text,
  tags text[] default array[]::text[],
  solution_en text,
  solution_bn text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);


-- ==========================================
-- File: supabase/migrations/003_create_user_tables.sql
-- ==========================================
-- User profiles, progress tracking, and editorial suggestions

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  role user_role not null default 'USER',
  created_at timestamptz not null default now()
);

create table user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  status progress_status not null default 'NOT_STARTED',
  completed_at timestamptz,
  unique(user_id, lesson_id)
);

create table user_problem_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  problem_id uuid not null references problems(id) on delete cascade,
  status progress_status not null default 'NOT_STARTED',
  notes text,
  unique(user_id, problem_id)
);

create table editorial_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  title text not null,
  content text not null,
  status suggestion_status not null default 'PENDING',
  admin_feedback text,
  created_at timestamptz not null default now()
);


-- ==========================================
-- File: supabase/migrations/004_create_indexes_and_search.sql
-- ==========================================
-- Indexes and full-text search capabilities

create index idx_subjects_order on subjects(display_order);
create index idx_lessons_subject on lessons(subject_id, display_order);
create index idx_resources_lesson on resources(lesson_id, display_order);
create index idx_problems_lesson on problems(lesson_id, display_order);
create index idx_user_progress_user on user_progress(user_id);
create index idx_user_problem_progress_user on user_problem_progress(user_id);
create index idx_editorial_suggestions_status on editorial_suggestions(status);

-- Full text search function across lessons
create or replace function search_content(search_query text)
returns table (
  id uuid,
  subject_slug text,
  lesson_slug text,
  title text,
  snippet text,
  rank real
) language sql stable as $$
  select
    l.id,
    s.slug as subject_slug,
    l.slug as lesson_slug,
    l.title_en as title,
    ts_headline('english', l.content_en, plainto_tsquery('english', search_query)) as snippet,
    ts_rank(
      setweight(to_tsvector('english', l.title_en), 'A') ||
      setweight(to_tsvector('english', l.content_en), 'B'),
      plainto_tsquery('english', search_query)
    ) as rank
  from lessons l
  join subjects s on s.id = l.subject_id
  where
    to_tsvector('english', l.title_en || ' ' || l.content_en) @@ plainto_tsquery('english', search_query)
  order by rank desc
  limit 20;
$$;


-- ==========================================
-- File: supabase/migrations/005_create_rls_policies.sql
-- ==========================================
-- Row Level Security (RLS) policies

alter table subjects enable row level security;
alter table lessons enable row level security;
alter table resources enable row level security;
alter table problems enable row level security;
alter table profiles enable row level security;
alter table user_progress enable row level security;
alter table user_problem_progress enable row level security;
alter table editorial_suggestions enable row level security;

-- Public content read access
create policy "Public read subjects" on subjects for select using (true);
create policy "Public read lessons" on lessons for select using (true);
create policy "Public read resources" on resources for select using (true);
create policy "Public read problems" on problems for select using (true);

-- User profiles
create policy "Read own profile" on profiles
  for select using (auth.uid() = id);

create policy "Update own profile" on profiles
  for update using (auth.uid() = id);

-- User progress
create policy "Manage own lesson progress" on user_progress
  for all using (auth.uid() = user_id);

create policy "Manage own problem progress" on user_problem_progress
  for all using (auth.uid() = user_id);

-- Editorial suggestions
create policy "Users can submit suggestions" on editorial_suggestions
  for insert with check (auth.uid() = user_id);

create policy "Users can view own suggestions" on editorial_suggestions
  for select using (
    auth.uid() = user_id or
    exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
  );

create policy "Admin review suggestions" on editorial_suggestions
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
  );

-- Admin full content management
create policy "Admin write subjects" on subjects for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
);

create policy "Admin write lessons" on lessons for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
);

create policy "Admin write resources" on resources for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
);

create policy "Admin write problems" on problems for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
);


-- ==========================================
-- File: supabase/migrations/006_handle_new_user_trigger.sql
-- ==========================================
-- Migration 006: Auto-create profile row on new Supabase Auth user
-- Run this in the Supabase SQL editor or via `supabase db push`.

-- Function: copies auth.users data into public.profiles on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer          -- runs as DB owner, can write to profiles
set search_path = public  -- prevent search-path hijacking
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',   -- Google OAuth
      new.raw_user_meta_data->>'name'         -- GitHub OAuth / others
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;               -- idempotent
  return new;
end;
$$;

-- Trigger: fires after every new row in auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();


-- ==========================================
-- File: supabase/migrations/007_add_username_and_public_profiles.sql
-- ==========================================
-- Migration 007: Add username, bio, portfolio details, and public profile read policy

-- Add username and profile customization columns to profiles table
alter table profiles
  add column if not exists username text unique,
  add column if not exists bio text,
  add column if not exists target_role text,
  add column if not exists target_companies text[],
  add column if not exists location text default 'Dhaka, Bangladesh',
  add column if not exists github_url text,
  add column if not exists linkedin_url text,
  add column if not exists codeforces_handle text;

-- Create index on username for ultra-fast lookup
create index if not exists idx_profiles_username on profiles(username);

-- Allow public read access to profiles so candidate profiles can be viewed by username
drop policy if exists "Read own profile" on profiles;
create policy "Public read profiles" on profiles
  for select using (true);

-- Ensure users can update their own profile
drop policy if exists "Update own profile" on profiles;
create policy "Update own profile" on profiles
  for update using (auth.uid() = id);


-- ==========================================
-- File: supabase/seed.sql
-- ==========================================
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


