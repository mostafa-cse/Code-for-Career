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
