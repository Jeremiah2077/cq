import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { resetPassword } from "@/app/auth/actions";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <AuthShell
      eyebrow="Pioneer Programme"
      title="Reset your password."
      subtitle="Enter your email and we'll send you a link to reset your password."
      footer={
        <span>
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Sign in →
          </Link>
        </span>
      }
    >
      {success && (
        <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--gold-light)] bg-[var(--gold-light)] px-4 py-3 text-[0.85rem] text-[var(--gray-700)]">
          Check your inbox. We sent a password reset link.
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-[var(--radius-sm)] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3 text-[0.85rem] text-[var(--accent-hover)]">
          {error}
        </div>
      )}

      <form action={resetPassword} className="space-y-5">
        <label className="block">
          <span className="field-label">Email</span>
          <input
            name="email"
            type="email"
            required
            className="field-input"
          />
        </label>
        <button type="submit" className="btn-primary w-full">
          Send reset link
        </button>
      </form>
    </AuthShell>
  );
}
