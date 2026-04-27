import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_complete")
          .eq("id", user.id)
          .maybeSingle();

        // Already onboarded → go to dashboard
        if (profile?.onboarding_complete) {
          return NextResponse.redirect(`${origin}${next}`);
        }

        const meta = user.user_metadata || {};
        const role = (meta.role as string) || "";

        // Has role (email signup or returning Google user) → create/update profile
        if (role) {
          const fullName = (meta.full_name as string) || (meta.name as string) || "";
          const school = (meta.school as string) || "";
          const yearGroup = (meta.year_group as string) || "";
          const phone = (meta.phone as string) || "";

          // Update existing or insert new
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

            // Send parent verification email for minors
            if (isMinor && parentEmail) {
              const { sendParentVerificationEmail } = await import("@/lib/parent-verification");
              await sendParentVerificationEmail({
                userId: user.id,
                parentEmail,
                studentName: fullName || user.email || "Your child",
                origin,
              });
            }
          } else if (role === "teacher") {
            const roleTitle = (meta.role_title as string) || "";

            await supabase.from("teacher_profiles").upsert({
              id: user.id,
              role_title: roleTitle,
            });
          }

          return NextResponse.redirect(`${origin}/dashboard`);
        }

        // Google user (no role) → onboarding
        return NextResponse.redirect(`${origin}/onboarding`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
