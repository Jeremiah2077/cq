import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Ensure a profiles row exists for the given user. Idempotent — safe to call
 * multiple times. Behaviour depends on what's in user_metadata:
 *
 * - If metadata has a `role` (legacy signup that pre-collected role/school/etc.):
 *   write a 'complete' profile + the matching student/teacher_profiles row.
 *   This keeps pre-rewrite OTP emails working — when an old user clicks their
 *   verification link, they still see the dashboard they expected.
 *
 * - If metadata is empty (new two-stage signup): write a 'minimal' profile row
 *   with no PII beyond what auth already has. Role / school / etc. will be
 *   collected later via /onboarding/[reason] when the user engages with a
 *   feature that needs them.
 */
export async function bootstrapProfileFromUser(supabase: SupabaseClient, user: User) {
  // Already bootstrapped? Don't clobber.
  const { data: existing } = await supabase
    .from("profiles")
    .select("profile_state, onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  if (existing && (existing.profile_state === "complete" || existing.onboarding_complete)) {
    return existing;
  }

  const meta = user.user_metadata || {};
  const role = (meta.role as string) || "";

  // Legacy path: pre-rewrite metadata is present → restore full profile.
  if (role) {
    const fullName = (meta.full_name as string) || (meta.name as string) || "";
    const school = (meta.school as string) || "";
    const yearGroup = (meta.year_group as string) || "";
    const phone = (meta.phone as string) || "";

    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      school,
      role,
      phone: role === "teacher" ? phone : null,
      year_group: role === "student" ? yearGroup : null,
      onboarding_complete: true,
      profile_state: "complete",
    });

    if (role === "student") {
      const ageGroup = (meta.age_group as string) || "";
      const isMinor = (meta.is_minor as boolean) || false;
      const parentEmail = (meta.parent_email as string) || "";

      await supabase.from("student_profiles").upsert({
        id: user.id,
        year_group: yearGroup,
        age_group: ageGroup,
        is_minor: isMinor,
        parent_email: parentEmail || null,
        parent_verified: false,
      });
    } else if (role === "teacher") {
      const roleTitle = (meta.role_title as string) || "";
      await supabase.from("teacher_profiles").upsert({
        id: user.id,
        role_title: roleTitle,
      });
    }

    return { profile_state: "complete" as const };
  }

  // New flow: just write a minimal profile shell.
  await supabase.from("profiles").upsert({
    id: user.id,
    profile_state: "minimal",
    onboarding_complete: false,
  });

  return { profile_state: "minimal" as const };
}
