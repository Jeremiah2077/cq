"use client";

import { useState } from "react";

export function PrivacyLink() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <a
        href="/privacy.html"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        style={{ color: "var(--accent)", textDecoration: "underline" }}
      >
        Privacy Notice
      </a>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[rgba(15,25,35,0.6)] backdrop-blur-[4px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white rounded-[var(--radius-md)] max-w-[600px] w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--gray-100)] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-display text-[1.2rem] text-[var(--ink)] m-0">
                  Privacy Notice
                </h3>
                <span className="text-[0.75rem] text-[var(--gray-400)]">
                  Version 1.0 · April 2026
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="bg-transparent border-none cursor-pointer p-2 text-[var(--gray-400)] text-[1.5rem] leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 overflow-y-auto text-[0.84rem] text-[var(--gray-600)] leading-[1.85] space-y-4">
              <p>
                At China Quest we are committed to protecting and respecting your
                privacy. This notice explains when and why we collect personal
                information, how we use it, the conditions under which we may
                disclose it, and how we keep it safe.
              </p>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                Who are we?
              </h4>
              <p>
                China Quest is the trading name of{" "}
                <strong className="text-[var(--ink)]">
                  Miles Minds Limited
                </strong>
                , a company registered in Ireland (Company No. 802673). We
                design and operate educational travel programmes for Irish and
                international schools.
              </p>
              <p>
                Contact:{" "}
                <a
                  href="mailto:info@milesminds.com"
                  className="text-[var(--accent)]"
                >
                  info@milesminds.com
                </a>{" "}
                · +353 87 375 2491
              </p>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                How do we collect information?
              </h4>
              <p>We collect information from you directly when you:</p>
              <ul className="pl-5 space-y-1 list-disc">
                <li>Create an account or complete a registration form</li>
                <li>Email us or contact us by phone</li>
                <li>Interact with us at events (such as TY Show)</li>
              </ul>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                What type of information do we collect?
              </h4>
              <ul className="pl-5 space-y-1 list-disc">
                <li>Full name, email address, and password</li>
                <li>School name and year group</li>
                <li>
                  Your role (student, parent/guardian, or teacher/school staff)
                </li>
                <li>
                  Consent records (timestamp and the text you agreed to)
                </li>
              </ul>
              <p>
                Providing your data is entirely voluntary. If you choose not to
                provide it, we cannot create your account.
              </p>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                How and why is your information used?
              </h4>
              <ul className="pl-5 space-y-1 list-disc">
                <li>Manage your Pioneer Programme account and application</li>
                <li>Send you programme updates and notifications</li>
                <li>
                  Track milestones and next steps in your application journey
                </li>
              </ul>
              <p>
                We will{" "}
                <strong className="text-[var(--ink)]">never</strong> use
                your email for unrelated marketing, and we will{" "}
                <strong className="text-[var(--ink)]">never</strong> sell or
                rent your personal data to any third party. We do not use
                automated decision-making or profiling.
              </p>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                What is our lawful basis?
              </h4>
              <p>
                We rely on{" "}
                <strong className="text-[var(--ink)]">consent</strong> (GDPR
                Article 6(1)(a)). For under-16s, consent must come from a parent
                or guardian (Section 31, Irish Data Protection Act 2018). You may
                withdraw consent at any time.
              </p>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                16 or under
              </h4>
              <p>
                Under Irish law, the digital age of consent is{" "}
                <strong className="text-[var(--ink)]">16</strong>. If you are
                under 16, your parent or guardian must register on your behalf.
                All communications for under-16 registrations are sent to the
                parent/guardian&apos;s email.
              </p>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                How long do we keep your information?
              </h4>
              <ul className="pl-5 space-y-1 list-disc">
                <li>
                  <strong className="text-[var(--ink)]">Active accounts</strong>{" "}
                  — retained while your account is active
                </li>
                <li>
                  <strong className="text-[var(--ink)]">
                    After 24 months
                  </strong>{" "}
                  with no interaction — we send a renewal email; no response
                  within 30 days = deleted
                </li>
                <li>
                  <strong className="text-[var(--ink)]">Account deletion</strong>{" "}
                  — data deleted within 30 days of your request
                </li>
              </ul>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                Who has access to your information?
              </h4>
              <p>
                We do not sell or rent your information. We may share data with
                EU-hosted service providers (email and hosting) under signed Data
                Processing Agreements. We do not transfer data outside the EEA.
              </p>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                Your rights
              </h4>
              <p>Under GDPR and the Irish Data Protection Act 2018:</p>
              <ul className="pl-5 space-y-1 list-disc">
                <li>
                  <strong className="text-[var(--ink)]">Access</strong> —
                  request a copy of your data
                </li>
                <li>
                  <strong className="text-[var(--ink)]">Rectification</strong> —
                  correct inaccurate data
                </li>
                <li>
                  <strong className="text-[var(--ink)]">Erasure</strong> — ask
                  us to delete your data
                </li>
                <li>
                  <strong className="text-[var(--ink)]">
                    Restrict processing
                  </strong>{" "}
                  — limit how we use your data
                </li>
                <li>
                  <strong className="text-[var(--ink)]">
                    Data portability
                  </strong>{" "}
                  — receive your data in a machine-readable format
                </li>
                <li>
                  <strong className="text-[var(--ink)]">
                    Withdraw consent
                  </strong>{" "}
                  — at any time via email
                </li>
              </ul>
              <p>
                Email{" "}
                <a
                  href="mailto:info@milesminds.com"
                  className="text-[var(--accent)]"
                >
                  info@milesminds.com
                </a>{" "}
                to exercise any right. We respond within 30 days.
              </p>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                How to complain
              </h4>
              <p className="p-3 bg-[var(--gray-50)] rounded-md">
                <strong className="text-[var(--ink)]">
                  Data Protection Commission
                </strong>
                <br />
                21 Fitzwilliam Square South, Dublin 2, D02 RD28, Ireland
                <br />
                Phone: +353 1 765 0100
                <br />
                www.dataprotection.ie
              </p>

              <h4 className="text-[0.88rem] text-[var(--ink)] font-semibold mt-6 mb-2">
                Changes to this notice
              </h4>
              <p>
                We keep this notice under regular review. Last updated: April
                2026.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[var(--gray-100)] flex items-center justify-end shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="px-7 py-2.5 bg-[var(--ink)] text-white border-none rounded-md text-[0.85rem] font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
