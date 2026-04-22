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

  function checkConsent() {
    if (
      !consentEmailRef.current?.checked ||
      !consentPrivacyRef.current?.checked
    ) {
      setConsentError(true);
      // Scroll to checkboxes and shake
      const el = document.getElementById("consent-block");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.remove("shake");
        void el.offsetWidth; // force reflow
        el.classList.add("shake");
      }
      return false;
    }
    setConsentError(false);
    return true;
  }

  return (
    <>
      <form
        action={signInWithGoogleAction}
        onSubmit={(e) => {
          if (!checkConsent()) e.preventDefault();
        }}
      >
        <GoogleButton label="Sign up with Google" />
      </form>

      <div className="my-6 flex items-center gap-3 text-[0.72rem] tracking-[2px] uppercase text-[var(--gray-400)]">
        <span className="flex-1 h-px bg-[var(--gray-200)]" />
        or
        <span className="flex-1 h-px bg-[var(--gray-200)]" />
      </div>

      <form
        action={signUpAction}
        onSubmit={(e) => {
          if (!checkConsent()) e.preventDefault();
        }}
        className="space-y-5"
      >
        <Field label="Full name" name="full_name" required />
        <Field label="School" name="school" required />
        <Field
          label="Year group"
          name="year_group"
          placeholder="TY / 5th / 6th"
        />
        <Field label="Email" name="email" type="email" required />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          minLength={8}
        />

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
            I consent to China Quest sending me emails about the Pioneer
            Programme, including programme updates and the opening of
            registrations. I can unsubscribe at any time.
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
