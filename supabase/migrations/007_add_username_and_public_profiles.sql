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
