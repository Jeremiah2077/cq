-- China Quest Pioneer Portal — Supabase schema
-- Run this once in Supabase SQL Editor (Project → SQL → New query).

-- ============================================================
-- profiles: 1 row per auth user, auto-created on signup
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  school text,
  year_group text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_self"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_self"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_insert_self"
  on public.profiles for insert
  with check (auth.uid() = id);

-- trigger: when a new auth.users row is created, insert profile row using metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, school, year_group)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'school', ''),
    coalesce(new.raw_user_meta_data->>'year_group', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- applications: 1 row per applicant, tracks pioneer application state
-- ============================================================
create type public.application_status as enum (
  'interest',
  'applying',
  'submitted',
  'shortlisted',
  'selected',
  'waitlist',
  'rejected'
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  status public.application_status not null default 'interest',
  video_url text,
  statement text,
  parental_consent boolean not null default false,
  principal_reference text,
  score jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.applications enable row level security;

create policy "applications_select_self"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "applications_insert_self"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "applications_update_self"
  on public.applications for update
  using (auth.uid() = user_id);

-- ============================================================
-- updated_at auto-bump
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists applications_updated_at on public.applications;
create trigger applications_updated_at before update on public.applications
  for each row execute function public.touch_updated_at();
