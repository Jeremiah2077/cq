import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { bootstrapProfileFromUser } from "@/lib/profile";

// Handles three callback variants:
//
// 1. ?code=... (PKCE) — Google OAuth and same-domain signInWithOtp.
//    Requires the code_verifier cookie that was set on this domain when
//    the OAuth/OTP request kicked off.
//
// 2. ?token_hash=...&type=... (server-verified) — magic links generated
//    via auth.admin.generateLink or signInWithOtp from a *different*
//    origin (e.g. cq-admin imports an account on chinaquest.ie). No
//    client-side state is needed; verifyOtp succeeds purely from the
//    hash.
//
// 3. Neither — bail to /login with an error.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const otpType = searchParams.get("type") as EmailOtpType | null;

  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const supabase = await createClient();

  if (tokenHash && otpType) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType });
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
    }
  } else {
    return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await bootstrapProfileFromUser(supabase, user);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
