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
