"use client";

import { useRef, useState } from "react";
import { GoogleButton } from "./GoogleButton";
import { PrivacyLink } from "./PrivacyModal";

/**
 * Two-stage signup: this form only asks for email + password + consent.
 * Role / school / age / parent email are collected later, on demand, when
 * the user activates a feature that needs them (e.g. Pioneer Programme).
 */
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
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      {/* Google signup */}
      <form
        action={signInWithGoogleAction}
        onSubmit={(e) => {
          if (!checkConsent()) e.preventDefault();
        }}
      >
        <GoogleButton label="Continue with Google" />
      </form>

      <div className="my-6 flex items-center gap-3 text-[0.72rem] tracking-[2px] uppercase text-[var(--gray-400)]">
        <span className="flex-1 h-px bg-[var(--gray-200)]" />
        or
        <span className="flex-1 h-px bg-[var(--gray-200)]" />
      </div>

      {/* Email + password signup */}
      <form
        action={signUpAction}
        onSubmit={(e) => {
          if (!checkConsent()) {
            e.preventDefault();
            return;
          }
          const pw = (e.currentTarget.elements.namedItem("password") as HTMLInputElement)?.value;
          const cpw = (e.currentTarget.elements.namedItem("confirm_password") as HTMLInputElement)?.value;
          if (pw !== cpw) {
            setPasswordError("Passwords do not match.");
            e.preventDefault();
            return;
          }
          setPasswordError("");
        }}
        className="space-y-5"
      >
        <Field label="Email" name="email" type="email" required />
        <PasswordField
          label="Password"
          name="password"
          required
          minLength={8}
          show={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />
        <PasswordField
          label="Confirm Password"
          name="confirm_password"
          required
          minLength={8}
          show={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
        />
        {passwordError && <p className="text-[0.82rem] text-red-500 -mt-2">{passwordError}</p>}

        {/* Consent */}
        <div
          id="consent-block"
          className={`space-y-3.5 rounded-[var(--radius-sm)] p-3 -mx-3 transition-all duration-300 ${
            consentError ? "bg-red-50 border border-red-200" : "border border-transparent"
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
            <span>
              I consent to China Quest sending me emails about programmes, updates and
              opportunities. I can unsubscribe at any time.
            </span>
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

        <p className="text-center text-[0.78rem] text-[var(--gray-400)]">
          You can fill in your details later when applying for a programme.
        </p>
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

function PasswordField({
  label,
  name,
  required,
  minLength,
  show,
  onToggle,
}: {
  label: string;
  name: string;
  required?: boolean;
  minLength?: number;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          required={required}
          minLength={minLength}
          className="field-input pr-10"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-[var(--gray-400)] hover:text-[var(--ink)]"
        >
          {show ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </label>
  );
}
