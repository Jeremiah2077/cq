"use client";

import { useRef, useState } from "react";
import { GoogleButton } from "./GoogleButton";
import { PrivacyLink } from "./PrivacyModal";

export function SignupForm({
  signUpAction,
  signInWithGoogleAction,
}: {
  signUpAction: (formData: FormData) => void;
  signInWithGoogleAction: (formData: FormData) => void;
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
      {/* Role Selection */}
      {!role && (
        <div className="space-y-4">
          <p className="field-label text-center" style={{ marginBottom: 12 }}>I am a…</p>
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

      {/* Form (shown after role selection) */}
      {role && (
        <>
          {/* Role indicator */}
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

          {/* Google signup */}
          <form
            action={signInWithGoogleAction}
            onSubmit={(e) => {
              if (!checkConsent()) e.preventDefault();
            }}
          >
            <input type="hidden" name="role" value={role} />
            <GoogleButton label="Sign up with Google" />
          </form>

          <div className="my-6 flex items-center gap-3 text-[0.72rem] tracking-[2px] uppercase text-[var(--gray-400)]">
            <span className="flex-1 h-px bg-[var(--gray-200)]" />
            or
            <span className="flex-1 h-px bg-[var(--gray-200)]" />
          </div>

          {/* Email signup */}
          <form
            action={signUpAction}
            onSubmit={(e) => {
              if (!checkConsent()) { e.preventDefault(); return; }
              if (!validateParentEmail(e.currentTarget)) { e.preventDefault(); return; }
            }}
            className="space-y-5"
          >
            <input type="hidden" name="role" value={role} />

            <Field label="Full name" name="full_name" required />
            <Field label="School" name="school" required />

            {role === "student" && (
              <>
                <SelectField
                  label="Year group"
                  name="year_group"
                  required
                  options={[
                    { value: "", label: "Select year group..." },
                    { value: "TY", label: "Transition Year" },
                    { value: "5th Year", label: "5th Year" },
                    { value: "6th Year", label: "6th Year" },
                    { value: "Other", label: "Other" },
                  ]}
                />
                <SelectField
                  label="Age"
                  name="age_group"
                  required
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
              </>
            )}

            {role === "teacher" && (
              <>
                <Field label="Role / Title" name="role_title" required placeholder="e.g. TY Coordinator" />
                <Field label="Phone" name="phone" type="tel" placeholder="+353..." />
              </>
            )}

            <Field label="Email" name="email" type="email" required />

            {role === "student" && isMinor && (
              <div>
                <Field label="Parent / Guardian Email" name="parent_email" type="email" required />
                {parentEmailError && (
                  <p className="text-[0.82rem] text-red-500 mt-1">{parentEmailError}</p>
                )}
              </div>
            )}

            <Field label="Password" name="password" type="password" required minLength={8} />

            {/* Consent */}
            <div
              id="consent-block"
              className={`space-y-3.5 rounded-[var(--radius-sm)] p-3 -mx-3 transition-all duration-300 ${
                consentError
                  ? "bg-red-50 border border-red-200"
                  : "border border-transparent"
              }`}
            >
              {consentError && (
                <p className="text-[0.82rem] text-red-500 font-medium">
                  Please accept both checkboxes before continuing.
                </p>
              )}
              <label className="flex items-start gap-2.5 cursor-pointer text-[0.82rem] text-[var(--gray-600)] leading-[1.6]">
                <input
                  type="checkbox"
                  ref={consentEmailRef}
                  name="consent_email"
                  onChange={() => setConsentError(false)}
                  className="mt-0.5 w-[18px] h-[18px] shrink-0 accent-[var(--accent)]"
                />
                {role === "student" ? (
                  <span>
                    I consent to China Quest sending me emails about the Pioneer
                    Programme, including programme updates and the opening of
                    registrations. I can unsubscribe at any time.
                    {" "}
                    <span className="text-[var(--gray-400)]">
                      If you are under 16, a verification email will be sent to your
                      parent/guardian to confirm your registration, in accordance with GDPR.
                    </span>
                  </span>
                ) : (
                  <span>
                    I consent to China Quest contacting me about the Pioneer Programme,
                    including programme updates, school partnership opportunities, and
                    group booking information. I can unsubscribe at any time.
                  </span>
                )}
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer text-[0.82rem] text-[var(--gray-600)] leading-[1.6]">
                <input
                  type="checkbox"
                  ref={consentPrivacyRef}
                  name="consent_privacy"
                  onChange={() => setConsentError(false)}
                  className="mt-0.5 w-[18px] h-[18px] shrink-0 accent-[var(--accent)]"
                />
                <span>
                  I have read and understood the <PrivacyLink />.
                </span>
              </label>
            </div>

            <button type="submit" className="btn-primary w-full">
              Create account
            </button>
          </form>
        </>
      )}
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  minLength,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="field-input"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  required,
  options,
  onChange,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select
        name={name}
        required={required}
        className="field-input"
        defaultValue=""
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
