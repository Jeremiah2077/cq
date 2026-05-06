"use client";

import { useRef, useState } from "react";
import { PrivacyLink } from "./PrivacyModal";

const ROLES = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher / Coordinator" },
  { value: "parent", label: "Parent / Guardian" },
  { value: "school_admin", label: "School Administrator" },
  { value: "partner", label: "Partner / Agent" },
] as const;

type Role = (typeof ROLES)[number]["value"];

export function OnboardingForm({
  action,
  prefillName,
  prefillEmail,
}: {
  action: (formData: FormData) => void;
  prefillName: string;
  prefillEmail: string;
}) {
  const consentEmailRef = useRef<HTMLInputElement>(null);
  const consentPrivacyRef = useRef<HTMLInputElement>(null);
  const [consentError, setConsentError] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  function checkConsent() {
    if (
      !consentEmailRef.current?.checked ||
      !consentPrivacyRef.current?.checked
    ) {
      setConsentError(true);
      const el = document.getElementById("consent-block");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.remove("shake");
        void el.offsetWidth;
        el.classList.add("shake");
      }
      return false;
    }
    setConsentError(false);
    return true;
  }

  return (
    <>
      {!role && (
        <div className="space-y-4">
          <p className="text-center text-[1.1rem] font-semibold text-[var(--ink)]" style={{ marginBottom: 16 }}>I am a…</p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className="py-4 px-4 rounded-[var(--radius-sm)] border border-[var(--gray-200)] text-[0.92rem] font-semibold text-[var(--ink)] hover:border-[var(--accent)] hover:shadow-[0_4px_16px_rgba(196,104,60,0.1)] transition-all cursor-pointer bg-white"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {role && (
        <>
          <div className="flex items-center justify-between mb-5">
            <span className="text-[0.78rem] font-semibold uppercase tracking-[2px] text-[var(--accent)]">
              {ROLES.find((r) => r.value === role)?.label}
            </span>
            <button
              type="button"
              onClick={() => setRole(null)}
              className="text-[0.78rem] text-[var(--gray-400)] hover:text-[var(--ink)] transition-colors cursor-pointer bg-transparent border-none"
            >
              Change
            </button>
          </div>

          <form
            action={action}
            onSubmit={(e) => {
              if (!checkConsent()) { e.preventDefault(); return; }
            }}
            className="space-y-5"
          >
            <input type="hidden" name="role" value={role} />

            <label className="block">
              <span className="field-label">Full name</span>
              <input name="full_name" type="text" required defaultValue={prefillName} className="field-input" />
            </label>

            <label className="block">
              <span className="field-label">Email</span>
              <input name="email" type="email" defaultValue={prefillEmail} readOnly className="field-input" style={{ background: "var(--gray-50)", color: "var(--gray-400)" }} />
            </label>

            {(role === "student" || role === "teacher" || role === "parent" || role === "school_admin") && (
              <Field label="School" name="school" required />
            )}

            {role === "partner" && (
              <Field label="Company" name="school" required placeholder="Company or organisation name" />
            )}

            {role === "student" && (
              <SelectField
                label="Year group" name="year_group" required
                options={[
                  { value: "", label: "Select year group..." },
                  { value: "TY", label: "Transition Year" },
                  { value: "5th Year", label: "5th Year" },
                  { value: "6th Year", label: "6th Year" },
                  { value: "Other", label: "Other" },
                ]}
              />
            )}

            {(role === "teacher" || role === "school_admin") && (
              <Field label="Role / Title" name="role_title" required placeholder="e.g. TY Coordinator" />
            )}

            <Field label="Phone" name="phone" type="tel" placeholder="+353..." />

            <div
              id="consent-block"
              className={`space-y-3.5 rounded-[var(--radius-sm)] p-3 -mx-3 transition-all duration-300 ${consentError ? "bg-red-50 border border-red-200" : "border border-transparent"}`}
            >
              {consentError && (
                <p className="text-[0.82rem] text-red-500 font-medium">Please accept both checkboxes before continuing.</p>
              )}
              <label className="flex items-start gap-2.5 cursor-pointer text-[0.82rem] text-[var(--gray-600)] leading-[1.6]">
                <input type="checkbox" ref={consentEmailRef} name="consent_email" onChange={() => setConsentError(false)} className="mt-0.5 w-[18px] h-[18px] shrink-0 accent-[var(--accent)]" />
                <span>I consent to China Quest contacting me about programmes, updates, and relevant opportunities. I can unsubscribe at any time.</span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer text-[0.82rem] text-[var(--gray-600)] leading-[1.6]">
                <input type="checkbox" ref={consentPrivacyRef} name="consent_privacy" onChange={() => setConsentError(false)} className="mt-0.5 w-[18px] h-[18px] shrink-0 accent-[var(--accent)]" />
                <span>I have read and understood the <PrivacyLink />.</span>
              </label>
            </div>

            <button type="submit" className="btn-primary w-full">Complete profile</button>
          </form>
        </>
      )}
    </>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} className="field-input" />
    </label>
  );
}

function SelectField({ label, name, required, options }: { label: string; name: string; required?: boolean; options: { value: string; label: string }[]; }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select name={name} required={required} className="field-input" defaultValue="">
        {options.map((opt) => (<option key={opt.value} value={opt.value} disabled={opt.value === ""}>{opt.label}</option>))}
      </select>
    </label>
  );
}
