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
      data: {
        full_name: fullName,
        school,
        role,
        year_group: role === "student" ? yearGroup : undefined,
        age_group: role === "student" ? ageGroup : undefined,
        is_minor: role === "student" ? isMinor : undefined,
        parent_email: role === "student" && isMinor ? parentEmail : undefined,
        role_title: role === "teacher" ? roleTitle : undefined,
        phone: role === "teacher" ? phone : undefined,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // If email confirmations are enabled, session will be null until the user confirms.
  // Redirect to verify page where user enters the 6-digit code.
  if (!data.session) {
    redirect(`/verify?email=${encodeURIComponent(email)}`);
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

export async function verifyOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    redirect(`/verify?email=${encodeURIComponent(email)}&error=${encodeURIComponent(error.message)}`);
  }

  // After verification, check/create profile (same as callback logic)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.onboarding_complete) {
      const meta = user.user_metadata || {};
      const role = (meta.role as string) || "";

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
      }
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?success=true");
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function requestAccountDeletion() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  // Create deletion request with token
  const { data, error } = await supabase
    .from("account_deletion_requests")
    .insert({ user_id: user.id })
    .select("token")
    .single();

  if (error || !data) {
    redirect("/dashboard?error=deletion-request-failed");
  }

  // Send confirmation email
  const { sendEmail } = await import("@/lib/email");
  await sendEmail({
    to: user.email!,
    subject: "Confirm account deletion — China Quest",
    html: `
      <h2>Account Deletion Request</h2>
      <p>Hi there,</p>
      <p>We received a request to permanently delete your China Quest account. This will remove all your data and cannot be undone.</p>
      <p style="margin: 32px 0;">
        <a href="${origin}/delete-confirm?token=${data.token}" style="background-color: #c4683c; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Confirm deletion
        </a>
      </p>
      <p>This link expires in 24 hours. If you didn't request this, you can safely ignore this email.</p>
      <p style="margin-top: 32px; color: #9e9a93; font-size: 14px;">
        China Quest — Miles Minds Limited, Ireland<br>
        info@milesminds.com
      </p>
    `,
  });

  redirect("/dashboard?notice=deletion-email-sent");
}

export async function confirmAccountDeletion(token: string) {
  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Find the deletion request
  const { data: request } = await adminSupabase
    .from("account_deletion_requests")
    .select("*")
    .eq("token", token)
    .eq("used", false)
    .single();

  if (!request) return { error: "Invalid or expired link." };

  // Check expiry
  if (new Date(request.expires_at) < new Date()) {
    return { error: "This link has expired. Please request deletion again." };
  }

  // Mark token as used
  await adminSupabase
    .from("account_deletion_requests")
    .update({ used: true })
    .eq("id", request.id);

  // Delete profile data
  await adminSupabase.from("student_profiles").delete().eq("id", request.user_id);
  await adminSupabase.from("teacher_profiles").delete().eq("id", request.user_id);
  await adminSupabase.from("profiles").delete().eq("id", request.user_id);

  // Delete auth user
  await adminSupabase.auth.admin.deleteUser(request.user_id);

  return { success: true };
}
