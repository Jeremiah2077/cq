import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { GoogleButton } from "@/components/GoogleButton";
import { signIn, signInWithGoogle } from "@/app/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;

  return (
    <AuthShell
      eyebrow="Pioneer Programme"
      title="Welcome back."
      subtitle="Sign in to check your application progress."
      footer={
        <span>
          New here?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Create an account →
          </Link>
        </span>
      }
    >
      {notice === "check-email" && (
        <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--gold-light)] bg-[var(--gold-light)] px-4 py-3 text-[0.85rem] text-[var(--gray-700)]">
          Check your inbox — we sent a confirmation link. Click it, then come back to sign in.
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3 text-[0.85rem] text-[var(--accent-hover)]">
          {error}
        </div>
      )}

      <form action={signInWithGoogle}>
        <GoogleButton label="Continue with Google" />
      </form>

      <div className="my-6 flex items-center gap-3 text-[0.72rem] tracking-[2px] uppercase text-[var(--gray-400)]">
        <span className="flex-1 h-px bg-[var(--gray-200)]" />
        or
        <span className="flex-1 h-px bg-[var(--gray-200)]" />
      </div>

      <form action={signIn} className="space-y-5">
        <Field label="Email" name="email" type="email" required />
        <Field label="Password" name="password" type="password" required />
        <button type="submit" className="btn-primary w-full">
          Sign in
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="field-input"
      />
    </label>
  );
}
