import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { signUp } from "@/app/auth/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      eyebrow="Pioneer Programme"
      title="Begin your journey."
      subtitle="Create an account to track your application, milestones and next steps."
      footer={
        <span>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Sign in →
          </Link>
        </span>
      }
    >
      {error && (
        <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3 text-[0.85rem] text-[var(--accent-hover)]">
          {error}
        </div>
      )}

      <form action={signUp} className="space-y-5">
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
        <button type="submit" className="btn-primary w-full">
          Create account
        </button>
      </form>
    </AuthShell>
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
