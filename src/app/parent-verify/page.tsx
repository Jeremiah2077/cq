"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { parentVerify, updateParentEmail } from "@/app/auth/actions";

export default function ParentVerifyPage() {
  return (
    <Suspense>
      <ParentVerifyContent />
    </Suspense>
  );
}

function ParentVerifyContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const urlError = searchParams.get("error") || "";
  const parentEmail = searchParams.get("parent_email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState(urlError);
  const [loading, setLoading] = useState(false);
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)]">
        <SiteNav />
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[520px] text-center">
            <div className="mb-6 flex justify-center">
              <span className="eyebrow eyebrow-accent">Pioneer Programme</span>
            </div>
            <div className="mb-6">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="mx-auto">
                <circle cx="28" cy="28" r="28" fill="#e8f5e9" />
                <path d="M18 28l7 7 13-13" stroke="#2d8a4e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-display text-[2.2rem] leading-[1.15] text-[var(--ink)] mb-3">
              Consent confirmed.
            </h1>
            <p className="text-[var(--gray-500)] text-[0.95rem] leading-[1.7] mb-4 max-w-sm mx-auto">
              Thank you for verifying your consent. Your child&apos;s China Quest account is now fully activated.
            </p>
            <p className="text-[var(--gray-400)] text-[0.85rem] leading-[1.7] max-w-sm mx-auto">
              If you have any questions about the Pioneer Programme or your child&apos;s participation, please contact us at{" "}
              <Link href="mailto:info@milesminds.com" className="text-[var(--accent)] font-semibold">
                info@milesminds.com
              </Link>
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
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
            Parent/Guardian consent.
          </h1>
          <p className="text-center text-[var(--gray-500)] text-[0.95rem] leading-[1.7] mb-8 max-w-sm mx-auto">
            {parentEmail ? (
              <>A verification code has been sent to <strong className="text-[var(--ink)]">{parentEmail}</strong>. Enter the code below to verify your account.</>
            ) : (
              <>Enter the 8-digit code sent to your parent/guardian&apos;s email to verify your account.</>
            )}
          </p>

          <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] p-8 shadow-[0_4px_30px_rgba(15,25,35,0.04)]">
            {error && (
              <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3 text-[0.85rem] text-[var(--accent-hover)]">
                {error}
              </div>
            )}

            <div className="mb-6 rounded-[var(--radius-sm)] bg-[var(--primary-subtle)] px-4 py-3 text-[0.85rem] text-[var(--gray-600)] leading-[1.6]">
              <strong>Why is this needed?</strong> Under GDPR (Article 8), children under 16 in Ireland require parental consent before their personal data can be processed. Your verification confirms you are aware of and consent to your child&apos;s registration.
            </div>

            <form action={parentVerify} className="space-y-5">
              <label className="block">
                <span className="field-label">Verification code</span>
                <input
                  name="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="00000000"
                  className="field-input text-center text-[1.8rem] font-bold tracking-[8px]"
                  autoFocus
                />
              </label>

              <button
                type="submit"
                disabled={loading || code.length !== 8}
                className="btn-primary w-full"
                style={{ opacity: loading || code.length !== 8 ? 0.6 : 1 }}
              >
                {loading ? "Verifying..." : "Confirm consent"}
              </button>
            </form>

            <div className="mt-5 text-center">
              {!showUpdateEmail ? (
                <button
                  type="button"
                  onClick={() => setShowUpdateEmail(true)}
                  className="text-[0.82rem] text-[var(--accent)] font-semibold underline cursor-pointer"
                >
                  Update email
                </button>
              ) : (
                <form action={updateParentEmail} className="space-y-3 text-left">
                  <label className="block">
                    <span className="field-label">New parent/guardian email</span>
                    <input
                      name="parent_email"
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="field-input text-[0.9rem]"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!newEmail}
                      className="btn-primary flex-1 text-[0.82rem]"
                      style={{ opacity: !newEmail ? 0.6 : 1 }}
                    >
                      Update &amp; resend code
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowUpdateEmail(false); setNewEmail(""); }}
                      className="px-3 py-2 text-[0.82rem] text-[var(--gray-500)] border border-[var(--gray-200)] rounded-[var(--radius-sm)]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
