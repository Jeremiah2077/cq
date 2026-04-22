import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignupForm } from "@/components/SignupForm";
import { signUp, signInWithGoogle } from "@/app/auth/actions";

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

      <SignupForm
        signUpAction={signUp}
        signInWithGoogleAction={signInWithGoogle}
      />
    </AuthShell>
  );
}
