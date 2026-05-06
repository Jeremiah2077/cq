"use client";

import { useState } from "react";

export function PioneerApplyForm({
  action,
  email,
}: {
  action: (formData: FormData) => void;
  email: string;
}) {
  const [ageGroup, setAgeGroup] = useState("");
  const [parentEmailError, setParentEmailError] = useState("");

  const isMinor = ageGroup !== "" && parseInt(ageGroup) < 16;

  function validateParentEmail(form: HTMLFormElement): boolean {
    if (!isMinor) return true;
    const parentEmail = (form.elements.namedItem("parent_email") as HTMLInputElement)?.value;
    if (parentEmail && email && parentEmail.toLowerCase() === email.toLowerCase()) {
      setParentEmailError("Parent email must be different from your email.");
      return false;
    }
    setParentEmailError("");
    return true;
  }

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!validateParentEmail(e.currentTarget)) { e.preventDefault(); return; }
      }}
      className="space-y-5"
    >
      <label className="block">
        <span className="field-label">Year group</span>
        <select name="year_group" required className="field-input" defaultValue="">
          <option value="" disabled>Select year group...</option>
          <option value="TY">Transition Year</option>
          <option value="5th Year">5th Year</option>
          <option value="6th Year">6th Year</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label className="block">
        <span className="field-label">Age</span>
        <select
          name="age_group"
          required
          className="field-input"
          defaultValue=""
          onChange={(e) => setAgeGroup(e.target.value)}
        >
          <option value="" disabled>Select age...</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19+</option>
        </select>
      </label>

      {isMinor && (
        <div>
          <label className="block">
            <span className="field-label">Parent / Guardian Email</span>
            <input name="parent_email" type="email" required className="field-input" />
          </label>
          {parentEmailError && (
            <p className="text-[0.82rem] text-red-500 mt-1">{parentEmailError}</p>
          )}
          <p className="text-[0.78rem] text-[var(--gray-400)] mt-2">
            Under GDPR, parental consent is required for under-16s. A verification code will be sent to this email.
          </p>
        </div>
      )}

      <button type="submit" className="btn-primary w-full">Submit application</button>
    </form>
  );
}
