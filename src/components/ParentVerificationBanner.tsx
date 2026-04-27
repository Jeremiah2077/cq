"use client";

import { useState } from "react";

export function ParentVerificationBanner({
  parentEmail,
  resendAction,
}: {
  parentEmail: string;
  resendAction: () => Promise<void>;
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleResend() {
    setSending(true);
    try {
      await resendAction();
    } catch {
      // The action redirects, so we only land here on actual errors
      setSending(false);
    }
  }

  return (
    <div className="bg-[#fff8f0] border-b border-[#f0d4b8]">
      <div className="max-w-[1200px] mx-auto px-8 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <div className="flex items-start gap-3 flex-1">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c4683c"
            strokeWidth="2"
            className="shrink-0 mt-0.5"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="text-[0.92rem] text-[var(--ink)] font-semibold leading-snug">
              Waiting for parent/guardian confirmation
            </p>
            <p className="text-[0.84rem] text-[var(--gray-500)] mt-1 leading-[1.6]">
              Under GDPR, your account needs parent/guardian consent to be fully activated. A verification code has been sent to <strong className="text-[var(--ink)]">{parentEmail}</strong>.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleResend}
          disabled={sending || sent}
          className="shrink-0 text-[0.82rem] font-semibold px-4 py-2 rounded-[var(--radius-sm)] border transition-colors"
          style={{
            borderColor: sending || sent ? "#c8c4bd" : "#c4683c",
            color: sending || sent ? "#9e9a93" : "#c4683c",
            background: "white",
            cursor: sending || sent ? "default" : "pointer",
          }}
        >
          {sent ? "Code resent" : sending ? "Sending..." : "Resend code"}
        </button>
      </div>
    </div>
  );
}
