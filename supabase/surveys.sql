-- =====================================================================
-- China Quest — TY Show survey storage
--
-- Run this once in Supabase SQL Editor (Project → SQL → New query).
-- Two tables, both write-only for the public anon key. Reads stay
-- gated to the service role / authenticated admins.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. STUDENT survey: 30-second floor survey at the TY Show booth
-- ---------------------------------------------------------------------
create table if not exists public.survey_student (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  year_group      text,                 -- TY / 5th / 6th / Other
  been_to_asia    boolean,
  interests       text[] default '{}',  -- history / food / tech / nature / martial / art / language / none
  interest_level  smallint check (interest_level between 1 and 5),
  expected_cost   text,                 -- free-form so "€2,500" etc. work
  school_name     text,

  -- soft audit (filled by client; not personal data)
  user_agent      text,
  ip_hint         text                  -- approximate, optional
);

alter table public.survey_student enable row level security;

-- Anyone (anon role) can INSERT — booth visitors fill their own row
create policy "survey_student_insert_anon"
  on public.survey_student
  for insert
  to anon
  with check (true);

-- No SELECT/UPDATE/DELETE for anon. Service role + authenticated
-- admins read via dashboard / service-role queries.
revoke select on public.survey_student from anon;
revoke select on public.survey_student from authenticated;

-- ---------------------------------------------------------------------
-- 2. TEACHER / COORDINATOR survey: longer expression of interest
-- ---------------------------------------------------------------------
create table if not exists public.survey_teacher (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  full_name           text,
  school_name         text,
  role                text,             -- TY Coordinator / Year Head / Principal / etc.
  email               text not null,
  phone               text,

  runs_intl_trips     boolean,
  typical_destinations text,
  typical_group_size  text,             -- under15 / 15-25 / 25-35 / 35-50 / 50+
  travel_seasons      text[] default '{}',
  concerns            text[] default '{}',
  student_interests   text[] default '{}',
  budget_range        text,             -- under1500 / 1500-2500 / 2500-3500 / 3500-4500 / over4500 / notsure
  contact_pref        text,             -- email / phone / both / none
  comments            text,

  user_agent          text,
  ip_hint             text
);

alter table public.survey_teacher enable row level security;

create policy "survey_teacher_insert_anon"
  on public.survey_teacher
  for insert
  to anon
  with check (true);

revoke select on public.survey_teacher from anon;
revoke select on public.survey_teacher from authenticated;

-- ---------------------------------------------------------------------
-- 3. Convenience indexes for export queries (admin side)
-- ---------------------------------------------------------------------
create index if not exists survey_student_created_idx
  on public.survey_student (created_at desc);

create index if not exists survey_teacher_created_idx
  on public.survey_teacher (created_at desc);

create index if not exists survey_teacher_email_idx
  on public.survey_teacher (lower(email));
