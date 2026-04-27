"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { ClearSessionAndRedirect } from "@/components/ClearSession";
import { confirmAccountDeletion } from "@/app/auth/actions";

export default function DeleteConfirmPage() {
  return (
    <Suspense>
      <DeleteConfirmContent />
    </Suspense>
  );
}

function DeleteConfirmContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const urlError = searchParams.get("error") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState(urlError);
  const [loading, setLoading] = useState(false);

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)]">
        <SiteNav />
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[460px] text-center">
            <div className="mb-6 flex justify-center">
              <span className="eyebrow eyebrow-accent">Pioneer Programme</span>
            </div>
            <h1 className="font-display text-[2.2rem] leading-[1.15] text-[var(--ink)] mb-3">
              Account deleted.
            </h1>
            <p className="text-[var(--gray-500)] text-[0.95rem] leading-[1.7] mb-8">
              Your account and all associated data have been permanently removed.
            </p>
            <ClearSessionAndRedirect />
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
            Confirm deletion.
          </h1>
          <p className="text-center text-[var(--gray-500)] text-[0.95rem] leading-[1.7] mb-8 max-w-sm mx-auto">
            Enter the 8-digit code we sent to your email to permanently delete your account.
          </p>

          <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] p-8 shadow-[0_4px_30px_rgba(15,25,35,0.04)]">
            {error && (
              <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3 text-[0.85rem] text-[var(--accent-hover)]">
                {error}
              </div>
            )}

            <form action={confirmAccountDeletion} className="space-y-5">
              <label className="block">
                <span className="field-label">Verification code</span>
                <input
                  name="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
                  placeholder="00000000"
                  className="field-input text-center text-[1.8rem] font-bold tracking-[8px]"
                  autoFocus
                />
              </label>

              <button type="submit" disabled={loading || code.length !== 8} className="btn-primary w-full" style={{ opacity: loading || code.length !== 8 ? 0.6 : 1, background: "#c41e3a" }}>
                {loading ? "Deleting..." : "Delete my account permanently"}
              </button>
            </form>

            <p className="mt-5 text-center text-[0.82rem] text-[var(--gray-400)]">
              Changed your mind?{" "}
              <Link href="/dashboard" className="text-[var(--accent)] underline">
                Go back to dashboard
              </Link>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
