"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function applyForPioneer(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName = String(formData.get("full_name") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();
  const yearGroup = String(formData.get("year_group") ?? "").trim();
  const ageGroup = String(formData.get("age_group") ?? "").trim();
  const parentEmail = String(formData.get("parent_email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const isMinor = ageGroup !== "" && parseInt(ageGroup) < 16;

  // Update profiles with all info + mark as complete
  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    school,
    role: "student",
    phone: phone || null,
    year_group: yearGroup,
    onboarding_complete: true,
    profile_state: "complete",
  });

  // Write student-specific data
  await supabase.from("student_profiles").upsert({
    id: user.id,
    year_group: yearGroup,
    age_group: ageGroup,
    is_minor: isMinor,
    parent_email: parentEmail || null,
    parent_verified: false,
  });

  // Create application record
  await supabase.from("applications").upsert({
    user_id: user.id,
    status: "interest",
  });

  // Update user metadata
  await supabase.auth.updateUser({
    data: { full_name: fullName, school, role: "student" },
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

    revalidatePath("/", "layout");
    redirect(`/parent-verify?parent_email=${encodeURIComponent(parentEmail)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
