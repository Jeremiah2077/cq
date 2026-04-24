"use client";

import { useRef, useState } from "react";
import { PrivacyLink } from "./PrivacyModal";

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
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const [ageGroup, setAgeGroup] = useState("");
  const [parentEmailError, setParentEmailError] = useState("");

  const isMinor = ageGroup !== "" && parseInt(ageGroup) < 16;

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

  function validateParentEmail(form: HTMLFormElement): boolean {
    if (!isMinor) return true;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const parentEmail = (form.elements.namedItem("parent_email") as HTMLInputElement)?.value;
    if (parentEmail && email && parentEmail.toLowerCase() === email.toLowerCase()) {
      setParentEmailError("Parent email must be different from your email.");
      return false;
    }
    setParentEmailError("");
    return true;
  }

  return (
    <>
      {!role && (
        <div className="space-y-4">
          <p className="text-center text-[1.1rem] font-semibold text-[var(--ink)]" style={{ marginBottom: 16 }}>I am a…</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className="flex-1 py-4 px-4 rounded-[var(--radius-sm)] border border-[var(--gray-200)] text-[0.92rem] font-semibold text-[var(--ink)] hover:border-[var(--accent)] hover:shadow-[0_4px_16px_rgba(196,104,60,0.1)] transition-all cursor-pointer bg-white"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className="flex-1 py-4 px-4 rounded-[var(--radius-sm)] border border-[var(--gray-200)] text-[0.92rem] font-semibold text-[var(--ink)] hover:border-[var(--accent)] hover:shadow-[0_4px_16px_rgba(196,104,60,0.1)] transition-all cursor-pointer bg-white"
            >
              Teacher / Coordinator
            </button>
          </div>
        </div>
      )}

      {role && (
        <>
          <div className="flex items-center justify-between mb-5">
            <span className="text-[0.78rem] font-semibold uppercase tracking-[2px] text-[var(--accent)]">
              {role === "student" ? "Student" : "Teacher / Coordinator"}
            </span>
            <button
              type="button"
              onClick={() => { setRole(null); setAgeGroup(""); setParentEmailError(""); }}
              className="text-[0.78rem] text-[var(--gray-400)] hover:text-[var(--ink)] transition-colors cursor-pointer bg-transparent border-none"
            >
              Change
            </button>
          </div>

          <form
            action={action}
            onSubmit={(e) => {
              if (!checkConsent()) { e.preventDefault(); return; }
              if (!validateParentEmail(e.currentTarget)) { e.preventDefault(); return; }
            }}
            className="space-y-5"
          >
            <input type="hidden" name="role" value={role} />

            <label className="block">
              <span className="field-label">Full name</span>
              <input name="full_name" type="text" required defaultValue={prefillName} className="field-input" />
            </label>

            <label className="block">
              <span className="field-label">Email <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>(from your Google account)</span></span>
              <input name="email" type="email" defaultValue={prefillEmail} readOnly className="field-input" style={{ background: "var(--gray-50)", color: "var(--gray-400)" }} />
            </label>

            <Field label="School" name="school" required />

            {role === "student" && (
              <>
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
                <SelectField
                  label="Age" name="age_group" required
                  onChange={(v) => setAgeGroup(v)}
                  options={[
                    { value: "", label: "Select age..." },
                    { value: "13", label: "13" },
                    { value: "14", label: "14" },
                    { value: "15", label: "15" },
                    { value: "16", label: "16" },
                    { value: "17", label: "17" },
                    { value: "18", label: "18" },
                    { value: "19", label: "19+" },
                  ]}
                />
                {isMinor && (
                  <div>
                    <Field label="Parent / Guardian Email" name="parent_email" type="email" required />
                    {parentEmailError && (
                      <p className="text-[0.82rem] text-red-500 mt-1">{parentEmailError}</p>
                    )}
                  </div>
                )}
              </>
            )}

            {role === "teacher" && (
              <>
                <Field label="Role / Title" name="role_title" required placeholder="e.g. TY Coordinator" />
                <Field label="Phone" name="phone" type="tel" placeholder="+353..." />
              </>
            )}

            <div
              id="consent-block"
              className={`space-y-3.5 rounded-[var(--radius-sm)] p-3 -mx-3 transition-all duration-300 ${consentError ? "bg-red-50 border border-red-200" : "border border-transparent"}`}
            >
              {consentError && (
                <p className="text-[0.82rem] text-red-500 font-medium">Please accept both checkboxes before continuing.</p>
              )}
              <label className="flex items-start gap-2.5 cursor-pointer text-[0.82rem] text-[var(--gray-600)] leading-[1.6]">
                <input type="checkbox" ref={consentEmailRef} name="consent_email" onChange={() => setConsentError(false)} className="mt-0.5 w-[18px] h-[18px] shrink-0 accent-[var(--accent)]" />
                {role === "student" ? (
                  <span>I consent to China Quest sending me emails about the Pioneer Programme, including programme updates and the opening of registrations. I can unsubscribe at any time. <span className="text-[var(--gray-400)]">If you are under 16, a verification email will be sent to your parent/guardian to confirm your registration, in accordance with GDPR.</span></span>
                ) : (
                  <span>I consent to China Quest contacting me about the Pioneer Programme, including programme updates, school partnership opportunities, and group booking information. I can unsubscribe at any time.</span>
                )}
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

function SelectField({ label, name, required, options, onChange }: { label: string; name: string; required?: boolean; options: { value: string; label: string }[]; onChange?: (value: string) => void; }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select name={name} required={required} className="field-input" defaultValue="" onChange={(e) => onChange?.(e.target.value)}>
        {options.map((opt) => (<option key={opt.value} value={opt.value} disabled={opt.value === ""}>{opt.label}</option>))}
      </select>
    </label>
  );
}
