do $$
begin
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'daily_logs' and policyname = 'Allow authenticated users to insert logs') then
    drop policy "Allow authenticated users to insert logs" on public.daily_logs;
  end if;

  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'daily_logs' and policyname = 'Allow authenticated users to read own logs') then
    drop policy "Allow authenticated users to read own logs" on public.daily_logs;
  end if;

  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'daily_logs' and policyname = 'Allow authenticated users to update logs') then
    drop policy "Allow authenticated users to update logs" on public.daily_logs;
  end if;

  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Public profile creation') then
    drop policy "Public profile creation" on public.profiles;
  end if;

  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile') then
    drop policy "Users can update own profile" on public.profiles;
  end if;

  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can view own profile') then
    drop policy "Users can view own profile" on public.profiles;
  end if;
end $$;

alter table public.daily_logs enable row level security;
alter table public.profiles enable row level security;

create policy "profiles_own_select"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "profiles_own_insert"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "profiles_own_update"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
