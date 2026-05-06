-- =====================================================================
-- China Quest — profile_state migration
--
-- Adds profile_state column to public.profiles to support the new
-- two-stage signup flow:
--   'minimal'  = just email+password, no role/school/etc. yet
--   'partial'  = some fields collected (e.g. role + school for Pioneer)
--   'complete' = all fields collected (legacy onboarded users)
--
-- BACKWARD COMPAT:
--   Existing users with onboarding_complete=true are auto-migrated to
--   'complete' so their dashboard / login flow is unchanged.
--
-- Run once in Supabase SQL Editor.
-- =====================================================================

-- Enum type
do $$ begin
  create type public.profile_state as enum ('minimal', 'partial', 'complete');
exception when duplicate_object then null; end $$;

-- Column (defaults to 'minimal' for new rows)
alter table public.profiles
  add column if not exists profile_state public.profile_state not null default 'minimal';

-- Backfill: any existing user that completed legacy onboarding stays 'complete'
update public.profiles
   set profile_state = 'complete'
 where onboarding_complete = true
   and profile_state = 'minimal';

-- Optional: also mark partial for users who have *some* data but not full
-- (e.g. they have full_name but no school, or they are minors awaiting parent verify).
-- Skipped for now — keep the migration boring and reversible.

-- Convenience index for "show me incomplete users" admin queries
create index if not exists profiles_profile_state_idx
  on public.profiles (profile_state)
  where profile_state <> 'complete';
