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
