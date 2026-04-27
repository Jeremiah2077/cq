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
    // If email not confirmed, resend verification code and redirect to verify
    if (error.message.toLowerCase().includes("email not confirmed")) {
      await supabase.auth.resend({ type: "signup", email });
      redirect(`/verify?email=${encodeURIComponent(email)}`);
    }
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

  // If user already exists (identities is empty), redirect to login
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    redirect(`/login?error=${encodeURIComponent("This email is already registered. Please sign in instead.")}`);
  }

  // For minors: skip student email verification, only require parent consent (GDPR Art. 8)
  if (data.user && isMinor && parentEmail) {
    // Auto-confirm the student's email so they don't need to verify
    const { createClient: createAdminClient } = await import("@supabase/supabase-js");
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    await adminSupabase.auth.admin.updateUserById(data.user.id, {
      email_confirm: true,
    });

    // Send verification email to parent only
    const { sendParentVerificationEmail } = await import("@/lib/parent-verification");
    await sendParentVerificationEmail({
      userId: data.user.id,
      parentEmail,
      studentName: fullName || email,
      origin,
    });

    // Create profiles immediately (since we're skipping the verify→callback flow)
    await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: fullName,
      school,
      role,
      year_group: yearGroup,
      onboarding_complete: true,
    });
    await supabase.from("student_profiles").upsert({
      id: data.user.id,
      year_group: yearGroup,
      age_group: ageGroup,
      is_minor: true,
      parent_email: parentEmail,
      parent_verified: false,
    });

    redirect(`/login?message=${encodeURIComponent("Registration complete. A verification email has been sent to your parent/guardian. You can log in once they confirm.")}`);
  }

  // Non-minor flow: student verifies their own email as usual
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
    type: "signup",
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
          // Parent verification email is already sent at signup time — no duplicate here
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

export async function resendParentVerification() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("is_minor, parent_email, parent_verified")
    .eq("id", user.id)
    .maybeSingle();

  if (!studentProfile?.is_minor || studentProfile.parent_verified || !studentProfile.parent_email) {
    redirect("/dashboard");
  }

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const fullName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email ||
    "Your child";

  const { sendParentVerificationEmail } = await import("@/lib/parent-verification");
  await sendParentVerificationEmail({
    userId: user.id,
    parentEmail: studentProfile.parent_email,
    studentName: fullName,
    origin,
  });

  redirect("/dashboard?parent_resent=true");
}

export async function parentVerify(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();

  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Find the verification request
  const { data: request } = await adminSupabase
    .from("parent_verification_requests")
    .select("*")
    .eq("token", code)
    .eq("used", false)
    .single();

  if (!request) {
    redirect("/parent-verify?error=Invalid+or+expired+code");
  }

  // Check expiry
  if (new Date(request.expires_at) < new Date()) {
    redirect("/parent-verify?error=Code+has+expired.+Please+ask+your+child+to+resend+from+their+dashboard");
  }

  // Mark token as used
  await adminSupabase
    .from("parent_verification_requests")
    .update({ used: true })
    .eq("id", request.id);

  // Update student_profiles — set parent_verified to true
  await adminSupabase
    .from("student_profiles")
    .update({ parent_verified: true })
    .eq("id", request.user_id);

  redirect("/parent-verify?success=true");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/reset-password?email=${encodeURIComponent(email)}`);
}

export async function verifyResetAndUpdatePassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();

  // Verify the OTP token first
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  });

  if (verifyError) {
    redirect(`/reset-password?email=${encodeURIComponent(email)}&error=${encodeURIComponent(verifyError.message)}`);
  }

  // Now update the password
  const { error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    redirect(`/reset-password?email=${encodeURIComponent(email)}&error=${encodeURIComponent(updateError.message)}`);
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

  // Generate 8-digit code
  const code = String(Math.floor(10000000 + Math.random() * 90000000));

  // Store code in deletion requests table
  const { error } = await supabase
    .from("account_deletion_requests")
    .insert({ user_id: user.id, token: code });

  if (error) {
    redirect("/dashboard?error=deletion-request-failed");
  }

  // Send verification code email
  const { sendEmail } = await import("@/lib/email");
  await sendEmail({
    to: user.email!,
    subject: "Your account deletion code — China Quest",
    html: `
      <h2>Account Deletion Request</h2>
      <p>Hi there,</p>
      <p>We received a request to permanently delete your China Quest account. Your verification code is:</p>
      <p style="margin: 32px 0; text-align: center;">
        <span style="background-color: #f8f7f5; border: 2px solid #c4683c; padding: 16px 32px; border-radius: 8px; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #0f1923; display: inline-block;">${code}</span>
      </p>
      <p>This code expires in 24 hours. If you didn't request this, you can safely ignore this email.</p>
      <p style="margin-top: 32px; color: #9e9a93; font-size: 14px;">
        China Quest — Miles Minds Limited, Ireland<br>
        info@milesminds.com
      </p>
    `,
  });

  redirect("/delete-confirm");
}

export async function confirmAccountDeletion(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Find the deletion request
  const { data: request } = await adminSupabase
    .from("account_deletion_requests")
    .select("*")
    .eq("token", code)
    .eq("user_id", user.id)
    .eq("used", false)
    .single();

  if (!request) {
    redirect("/delete-confirm?error=Invalid+or+expired+code");
  }

  // Check expiry
  if (new Date(request.expires_at) < new Date()) {
    redirect("/delete-confirm?error=Code+has+expired.+Please+request+again");
  }

  // Mark token as used
  await adminSupabase
    .from("account_deletion_requests")
    .update({ used: true })
    .eq("id", request.id);

  // Delete profile data
  await adminSupabase.from("student_profiles").delete().eq("id", user.id);
  await adminSupabase.from("teacher_profiles").delete().eq("id", user.id);
  await adminSupabase.from("profiles").delete().eq("id", user.id);

  // Delete auth user
  await adminSupabase.auth.admin.deleteUser(user.id);

  // Sign out
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/delete-confirm?success=true");
}
