"use client";

import { useState, useRef } from "react";
import { AuthShell } from "@/components/AuthShell";
import { updatePassword } from "@/app/auth/actions";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit() {
    const form = formRef.current;
    if (!form) return;
    const pw = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    const cpw = (form.elements.namedItem("confirm_password") as HTMLInputElement)?.value;
    if (!pw || pw.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (pw !== cpw) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    form.requestSubmit();
  }

  return (
    <AuthShell
      eyebrow="Pioneer Programme"
      title="Set a new password."
      subtitle="Choose a strong password with at least 8 characters."
    >
      {error && (
        <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3 text-[0.85rem] text-[var(--accent-hover)]">
          {error}
        </div>
      )}

      <form ref={formRef} action={updatePassword} className="space-y-5">
        <label className="block">
          <span className="field-label">New password</span>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              className="field-input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-[var(--gray-400)] hover:text-[var(--ink)]"
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="field-label">Confirm new password</span>
          <div className="relative">
            <input
              name="confirm_password"
              type={showConfirm ? "text" : "password"}
              required
              minLength={8}
              className="field-input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-[var(--gray-400)] hover:text-[var(--ink)]"
            >
              {showConfirm ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </label>

        <button type="button" onClick={handleSubmit} className="btn-primary w-full">
          Update password
        </button>
      </form>
    </AuthShell>
  );
}
