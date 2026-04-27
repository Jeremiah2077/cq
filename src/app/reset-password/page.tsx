"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { verifyResetAndUpdatePassword } from "@/app/auth/actions";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const urlError = searchParams.get("error") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(urlError);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit() {
    const form = formRef.current;
    if (!form) return;

    const token = (form.elements.namedItem("token") as HTMLInputElement)?.value;
    const pw = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    const cpw = (form.elements.namedItem("confirm_password") as HTMLInputElement)?.value;

    if (!token || token.length < 6) {
      setError("Please enter the verification code.");
      return;
    }
    if (!pw || pw.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (pw !== cpw) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);
    form.requestSubmit();
  }

  const EyeOpen = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  );
  const EyeClosed = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <SiteNav />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[460px]">
          <div className="mb-6 flex justify-center">
            <span className="eyebrow eyebrow-accent">Pioneer Programme</span>
          </div>
          <h1 className="font-display text-[2.2rem] leading-[1.15] text-[var(--ink)] text-center mb-3">
            Reset your password.
          </h1>
          <p className="text-center text-[var(--gray-500)] text-[0.95rem] leading-[1.7] mb-8 max-w-sm mx-auto">
            Enter the 8-digit code sent to <strong className="text-[var(--ink)]">{email}</strong> and choose a new password.
          </p>

          <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] p-8 shadow-[0_4px_30px_rgba(15,25,35,0.04)]">
            {error && (
              <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3 text-[0.85rem] text-[var(--accent-hover)]">
                {error}
              </div>
            )}

            <form ref={formRef} action={verifyResetAndUpdatePassword} className="space-y-5">
              <input type="hidden" name="email" value={email} />

              <label className="block">
                <span className="field-label">Verification code</span>
                <input
                  name="token"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="00000000"
                  className="field-input text-center text-[1.8rem] font-bold tracking-[8px]"
                  autoFocus
                  onChange={() => setError("")}
                />
              </label>

              <label className="block">
                <span className="field-label">New password</span>
                <div className="relative">
                  <input name="password" type={showPassword ? "text" : "password"} required minLength={8} className="field-input pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-[var(--gray-400)] hover:text-[var(--ink)]">
                    {showPassword ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="field-label">Confirm new password</span>
                <div className="relative">
                  <input name="confirm_password" type={showConfirm ? "text" : "password"} required minLength={8} className="field-input pr-10" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-[var(--gray-400)] hover:text-[var(--ink)]">
                    {showConfirm ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
              </label>

              <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary w-full" style={{ opacity: loading ? 0.6 : 1 }}>
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
