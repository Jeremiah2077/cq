"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();

  // Student fields
  const yearGroup = String(formData.get("year_group") ?? "").trim();
  const ageGroup = String(formData.get("age_group") ?? "").trim();
  const parentEmail = String(formData.get("parent_email") ?? "").trim();
  const isMinor = ageGroup !== "" && parseInt(ageGroup) < 16;

  // Teacher fields
  const roleTitle = String(formData.get("role_title") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { full_name: fullName, school, role },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Save to profiles table
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
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
        id: data.user.id,
        year_group: yearGroup,
        age_group: ageGroup,
        is_minor: isMinor,
        parent_email: parentEmail || null,
        parent_verified: false,
      });
    } else if (role === "teacher") {
      await supabase.from("teacher_profiles").upsert({
        id: data.user.id,
        role_title: roleTitle,
      });
    }
  }

  // If email confirmations are enabled, session will be null until the user confirms.
  if (!data.session) {
    redirect("/login?notice=check-email");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto =
    hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  if (data?.url) redirect(data.url);
  redirect("/login?error=google-oauth-failed");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
