import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { OnboardingForm } from "@/components/OnboardingForm";
import { completeOnboarding } from "./actions";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if already onboarded
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarding_complete) redirect("/dashboard");

  const prefillName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    "";
  const prefillEmail = user.email || "";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <SiteNav />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[460px]">
          <div className="mb-6 flex justify-center">
            <span className="eyebrow eyebrow-accent">Pioneer Programme</span>
          </div>
          <h1 className="font-display text-[2.2rem] leading-[1.15] text-[var(--ink)] text-center mb-3">
            Complete your profile.
          </h1>
          <p className="text-center text-[var(--gray-500)] text-[0.95rem] leading-[1.7] mb-8 max-w-sm mx-auto">
            Just a few more details so we can set up your account.
          </p>

          <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] p-8 shadow-[0_4px_30px_rgba(15,25,35,0.04)]">
            <OnboardingForm
              action={completeOnboarding}
              prefillName={prefillName}
              prefillEmail={prefillEmail}
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
