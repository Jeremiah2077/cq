import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { confirmAccountDeletion } from "@/app/auth/actions";

export default async function DeleteConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthShell title="Invalid link." subtitle="No deletion token provided.">
        <Link href="/" className="btn-primary w-full text-center block">
          Go to homepage
        </Link>
      </AuthShell>
    );
  }

  const result = await confirmAccountDeletion(token);

  if (result.error) {
    return (
      <AuthShell title="Deletion failed." subtitle={result.error}>
        <Link href="/dashboard" className="btn-primary w-full text-center block">
          Back to dashboard
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Account deleted." subtitle="Your account and all associated data have been permanently removed.">
      <Link href="/" className="btn-primary w-full text-center block">
        Go to homepage
      </Link>
    </AuthShell>
  );
}
