"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { bootstrapAfterCallback } from "./actions";
import type { EmailOtpType } from "@supabase/supabase-js";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const supabase = createClient();

      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const otpType = searchParams.get("type") as EmailOtpType | null;
      const rawNext = searchParams.get("next") ?? "/dashboard";
      const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

      // Flow 1: hash fragment (#access_token=...&refresh_token=...)
      // Cross-origin magic links use implicit flow, tokens are in the hash
      const hash = window.location.hash.substring(1);
      if (hash) {
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            setError("auth-callback-failed");
            return;
          }
          await bootstrapAfterCallback();
          router.replace(next);
          return;
        }
      }

      // Flow 2: ?token_hash=...&type=... (server-verified magic link)
      if (tokenHash && otpType) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType,
        });
        if (error) {
          setError("auth-callback-failed");
          return;
        }
        await bootstrapAfterCallback();
        router.replace(next);
        return;
      }

      // Flow 3: ?code=... (PKCE — Google OAuth, same-domain OTP)
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setError("auth-callback-failed");
          return;
        }
        await bootstrapAfterCallback();
        router.replace(next);
        return;
      }

      // None of the above — fail
      setError("auth-callback-failed");
    }

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    router.replace(`/login?error=${error}`);
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="text-center">
        <div className="font-display text-[1.5rem] text-[var(--ink)] mb-3">
          Signing you in...
        </div>
        <div className="text-[0.9rem] text-[var(--gray-500)]">
          Please wait a moment.
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
