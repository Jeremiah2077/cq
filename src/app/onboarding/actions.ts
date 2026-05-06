"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = String(formData.get("role") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const yearGroup = String(formData.get("year_group") ?? "").trim();
  const roleTitle = String(formData.get("role_title") ?? "").trim();

  // Update profiles table (works for all roles)
  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    school,
    role,
    phone: phone || null,
    year_group: role === "student" ? yearGroup : null,
    onboarding_complete: true,
    profile_state: "complete",
  });

  // Save to role-specific table (teacher/school_admin only at this stage)
  if (role === "teacher" || role === "school_admin") {
    await supabase.from("teacher_profiles").upsert({
      id: user.id,
      role_title: roleTitle,
    });
  }

  // Update user metadata
  await supabase.auth.updateUser({
    data: { full_name: fullName, school, role },
  });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
