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

  const ageGroup = String(formData.get("age_group") ?? "").trim();
  const parentEmail = String(formData.get("parent_email") ?? "").trim();
  const yearGroup = String(formData.get("year_group") ?? "").trim();
  const isMinor = ageGroup !== "" && parseInt(ageGroup) < 16;

  // Write student-specific data to student_profiles
  await supabase.from("student_profiles").upsert({
    id: user.id,
    year_group: yearGroup,
    age_group: ageGroup,
    is_minor: isMinor,
    parent_email: parentEmail || null,
    parent_verified: false,
  });

  // Update year_group in profiles too
  await supabase.from("profiles").update({
    year_group: yearGroup,
  }).eq("id", user.id);

  // Create application record
  await supabase.from("applications").upsert({
    user_id: user.id,
    status: "interest",
  });

  // Send parent verification email for minors
  if (isMinor && parentEmail) {
    const hdrs = await headers();
    const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
    const proto = hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    const origin = `${proto}://${host}`;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    const { sendParentVerificationEmail } = await import("@/lib/parent-verification");
    await sendParentVerificationEmail({
      userId: user.id,
      parentEmail,
      studentName: profile?.full_name || user.email || "Your child",
      origin,
    });

    revalidatePath("/", "layout");
    redirect(`/parent-verify?parent_email=${encodeURIComponent(parentEmail)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
