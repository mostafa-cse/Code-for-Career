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
