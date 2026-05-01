import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isProtected = pathname.startsWith("/dashboard");
  const isOnboarding = pathname.startsWith("/onboarding");

  if (!user && (isProtected || isOnboarding)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && isProtected) {
    // Two-stage signup: do NOT force /onboarding. Minimal-state users land on
    // the dashboard and are guided to fill in details when they engage with a
    // feature (e.g. clicking "Apply for Pioneer" → /onboarding/pioneer).
    //
    // We still keep the parent-verify redirect for minor students, since GDPR
    // requires parental consent before they can use student-side features.
    const { data: studentProfile } = await supabase
      .from("student_profiles")
      .select("is_minor, parent_verified, parent_email")
      .eq("id", user.id)
      .maybeSingle();

    if (studentProfile?.is_minor && !studentProfile.parent_verified && studentProfile.parent_email) {
      const url = request.nextUrl.clone();
      url.pathname = "/parent-verify";
      url.searchParams.set("parent_email", studentProfile.parent_email);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
