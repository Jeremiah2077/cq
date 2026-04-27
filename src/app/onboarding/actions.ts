"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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

  // Student fields
  const yearGroup = String(formData.get("year_group") ?? "").trim();
  const ageGroup = String(formData.get("age_group") ?? "").trim();
  const parentEmail = String(formData.get("parent_email") ?? "").trim();
  const isMinor = ageGroup !== "" && parseInt(ageGroup) < 16;

  // Teacher fields
  const roleTitle = String(formData.get("role_title") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  // Update profiles
  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    school,
    role,
    phone: role === "teacher" ? phone : null,
    year_group: role === "student" ? yearGroup : null,
    onboarding_complete: true,
  });

  // Save to role-specific table
  if (role === "student") {
    await supabase.from("student_profiles").upsert({
      id: user.id,
      year_group: yearGroup,
      age_group: ageGroup,
      is_minor: isMinor,
      parent_email: parentEmail || null,
      parent_verified: false,
    });

    // Send parent verification email for minors
    if (isMinor && parentEmail) {
      const hdrs = await headers();
      const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
      const proto = hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
      const origin = `${proto}://${host}`;

      const { sendParentVerificationEmail } = await import("@/lib/parent-verification");
      await sendParentVerificationEmail({
        userId: user.id,
        parentEmail,
        studentName: fullName || user.email || "Your child",
        origin,
      });
    }
  } else if (role === "teacher") {
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
