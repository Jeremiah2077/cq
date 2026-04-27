"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { verifyOtp } from "@/app/auth/actions";

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 8) {
      setError("Please enter the 8-digit code.");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("token", code);

    try {
      await verifyOtp(formData);
    } catch {
      setError("Invalid or expired code. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <SiteNav />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[460px]">
          <div className="mb-6 flex justify-center">
            <span className="eyebrow eyebrow-accent">Pioneer Programme</span>
          </div>
          <h1 className="font-display text-[2.2rem] leading-[1.15] text-[var(--ink)] text-center mb-3">
            Check your email.
          </h1>
          <p className="text-center text-[var(--gray-500)] text-[0.95rem] leading-[1.7] mb-8 max-w-sm mx-auto">
            We sent an 8-digit verification code to <strong className="text-[var(--ink)]">{email}</strong>
          </p>

          <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] p-8 shadow-[0_4px_30px_rgba(15,25,35,0.04)]">
            {error && (
              <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3 text-[0.85rem] text-[var(--accent-hover)]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="field-label">Verification code</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="00000000"
                  className="field-input text-center text-[1.8rem] font-bold tracking-[8px]"
                  autoFocus
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? "Verifying..." : "Verify email"}
              </button>
            </form>

            <p className="mt-5 text-center text-[0.82rem] text-[var(--gray-400)]">
              Didn't receive the code? Check your spam folder, or{" "}
              <Link href="/signup" className="text-[var(--accent)] underline">
                try again
              </Link>.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
