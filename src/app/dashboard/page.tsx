import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut, requestAccountDeletion } from "@/app/auth/actions";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { PioneerProgress } from "@/components/PioneerProgress";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import {
  PIONEER_MILESTONES,
  APPLICATION_STATUS_LABEL,
  type ApplicationStatus,
  type Milestone,
  type MilestoneStatus,
} from "@/lib/milestones";

type ApplicationRow = {
  status: ApplicationStatus;
  video_url: string | null;
  statement: string | null;
  updated_at: string | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: application }] = await Promise.all([
    supabase
      .from("applications")
      .select("status, video_url, statement, updated_at")
      .eq("user_id", user.id)
      .maybeSingle<ApplicationRow>(),
  ]);

  const hasApplied = !!application;
  const status: ApplicationStatus = application?.status ?? "interest";
  const completion = completionPercent(status);
  const milestones = computeMilestoneStatuses(PIONEER_MILESTONES);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <SiteNav
        rightSlot={
          <form action={signOut}>
            <button
              type="submit"
              style={{ background: "none", border: "none", color: "#c4683c", fontWeight: 600, cursor: "pointer", fontSize: "inherit", fontFamily: "inherit" }}
            >
              Sign Out
            </button>
          </form>
        }
      />

      <section className="bg-gradient-to-br from-[var(--ink)] to-[var(--ink-light)] text-white">
        <div className="max-w-[1200px] mx-auto px-8 py-16 md:py-20">
          <div className="eyebrow eyebrow-accent">Welcome</div>
          <h1 className="font-display text-[3rem] md:text-[3.6rem] leading-[1.1] mt-5 mb-4 max-w-3xl">
            Your account is ready,
            <br />
            <span className="text-[var(--accent)]">explore at your pace.</span>
          </h1>
          <p className="text-white/60 max-w-xl text-[1.02rem] leading-[1.75]">
            Signed in as <strong className="text-white/85">{user.email}</strong>.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-8 py-16 space-y-12">
        <section>
          <div className="eyebrow mb-6">Our Programmes</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pioneer card */}
            <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] overflow-hidden">
              <Link
                href="/pioneer.html"
                className="group block"
              >
                <div className="relative h-[160px] overflow-hidden bg-[var(--gray-100)]">
                  <img src="/images/beijing/greatwall.jpg" alt="Pioneer Programme" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <span className="absolute top-3 left-3 text-[0.68rem] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-[4px] text-white bg-[#2d8a4e]">Free</span>
                </div>
              </Link>
              <div className="p-6">
                <Link href="/pioneer.html" className="block mb-4">
                  <div className="text-[0.7rem] tracking-[2px] uppercase font-semibold text-[var(--accent)] mb-1.5">
                    Pioneer Programme
                  </div>
                  <div className="font-display text-[1.3rem] leading-[1.2] text-[var(--ink)] mb-2">
                    {hasApplied ? "You've applied." : "Apply to be a Pioneer."}
                  </div>
                  <p className="text-[0.88rem] text-[var(--gray-500)] leading-[1.65]">
                    A fully-funded place for one student per Irish school. 11 days in China, filming, learning, and representing your school.
                  </p>
                </Link>
                {hasApplied ? (
                  <PioneerProgress
                    statusLabel={APPLICATION_STATUS_LABEL[status]}
                    completion={completion}
                    hint={progressHint(status)}
                    steps={nextSteps(status)}
                    milestones={milestones.map((m) => ({
                      phase: m.phase,
                      title: m.title,
                      detail: m.detail,
                      target: m.target,
                      status: m.status,
                    }))}
                  />
                ) : (
                  <span className="text-[0.85rem] font-semibold text-[var(--accent)]">
                    Learn more →
                  </span>
                )}
              </div>
            </div>

            {/* Roots card */}
            <Link
              href="/roots.html"
              className="group block bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] overflow-hidden hover:border-[var(--primary)] hover:shadow-[0_8px_30px_rgba(27,58,92,0.08)] transition-all"
            >
              <div className="relative h-[160px] overflow-hidden bg-[var(--gray-100)]">
                <img src="/images/forbidden-city.jpg" alt="Roots Programme" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-6">
                <div className="text-[0.7rem] tracking-[2px] uppercase font-semibold text-[var(--primary)] mb-1.5">
                  Heritage &amp; Culture
                </div>
                <div className="font-display text-[1.3rem] leading-[1.2] text-[var(--ink)] mb-2">
                  Roots
                </div>
                <p className="text-[0.88rem] text-[var(--gray-500)] leading-[1.65] mb-4">
                  Beijing, Xi&apos;an, Shanghai. 11 days through imperial palaces, the Terracotta Army, the Great Wall, and modern Shanghai.
                </p>
                <span className="text-[0.85rem] font-semibold text-[var(--primary)]">
                  View itinerary →
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className="border-t border-[var(--gray-200)] pt-12">
          <div className="eyebrow mb-3" style={{ color: "var(--gray-400)" }}>
            Account
          </div>
          <p className="text-[0.92rem] text-[var(--gray-500)] mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <DeleteAccountButton action={requestAccountDeletion} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function completionPercent(status: ApplicationStatus): number {
  const map: Record<ApplicationStatus, number> = {
    interest: 10,
    applying: 35,
    submitted: 60,
    shortlisted: 75,
    selected: 100,
    waitlist: 80,
    rejected: 100,
  };
  return map[status];
}

function progressHint(status: ApplicationStatus): string {
  switch (status) {
    case "interest":
      return "Your interest is registered. When applications open, we'll email you to submit your video and written statement.";
    case "applying":
      return "Time to complete your application: a 60–90 second video, a 200-word statement, a principal reference and parental consent.";
    case "submitted":
      return "Application received. The selection committee is scoring submissions.";
    case "shortlisted":
      return "You're shortlisted. Final picks will be made by the committee. Watch your inbox.";
    case "selected":
      return "Congratulations, you're in. Next up: sign the Pioneer agreement and prepare your passport.";
    case "waitlist":
      return "You're on the waitlist. If a selected Pioneer drops out, you'll be called up in order.";
    case "rejected":
      return "Not this time. You're still welcome to join a future paid school trip.";
  }
}

function nextSteps(status: ApplicationStatus): string[] {
  switch (status) {
    case "interest":
      return [
        "Keep your email and phone reachable.",
        "Start thinking about your 60–90 second video.",
        "Mention the programme to your principal or a teacher.",
      ];
    case "applying":
      return [
        "Upload your 60–90 second application video.",
        "Submit your 200-word written statement.",
        "Ask your principal for a reference.",
      ];
    case "submitted":
      return [
        "Wait for selection results (usually 2–3 weeks).",
        "If invited to a video interview, be on time and ready.",
      ];
    case "shortlisted":
      return [
        "Check your webcam and connection for a possible video interview.",
        "Watch for the final decision email.",
      ];
    case "selected":
      return [
        "Sign the Pioneer agreement.",
        "Submit your passport details for visa processing.",
        "Attend the pre-departure briefing.",
      ];
    case "waitlist":
      return [
        "Keep your phone reachable.",
        "Waitlist remains valid until the trip departs.",
      ];
    case "rejected":
      return [
        "Explore upcoming paid school trips on the main site.",
        "For feedback, email info@milesminds.com.",
      ];
  }
}

function computeMilestoneStatuses(ms: Milestone[]) {
  const today = new Date();
  let firstUpcomingAssigned = false;
  return ms.map((m) => {
    const d = parseTarget(m.target);
    let status: MilestoneStatus;
    if (d && d < today) {
      status = "done";
    } else if (!firstUpcomingAssigned) {
      status = "active";
      firstUpcomingAssigned = true;
    } else {
      status = "upcoming";
    }
    return { ...m, status };
  });
}

function parseTarget(t: string): Date | null {
  const match = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
}
