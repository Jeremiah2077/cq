import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { PioneerApplyForm } from "./PioneerApplyForm";
import { applyForPioneer } from "./actions";

export default async function PioneerApplyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, school, role, onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  // Must complete basic profile first
  if (!profile?.onboarding_complete) {
    redirect("/onboarding");
  }

  // Check if already applied
  const { data: existing } = await supabase
    .from("applications")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <SiteNav />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[460px]">
          <div className="mb-6 flex justify-center">
            <span className="eyebrow eyebrow-accent">Pioneer Programme</span>
          </div>
          <h1 className="font-display text-[2.2rem] leading-[1.15] text-[var(--ink)] text-center mb-3">
            Apply for Pioneer.
          </h1>
          <p className="text-center text-[var(--gray-500)] text-[0.95rem] leading-[1.7] mb-8 max-w-sm mx-auto">
            A few more details so we can process your application.
          </p>
          <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] p-8 shadow-[0_4px_30px_rgba(15,25,35,0.04)]">
            <PioneerApplyForm
              action={applyForPioneer}
              email={user.email ?? ""}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
