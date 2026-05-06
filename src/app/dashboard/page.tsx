import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut, requestAccountDeletion, resendParentVerification } from "@/app/auth/actions";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { ParentVerificationBanner } from "@/components/ParentVerificationBanner";
import { PioneerFlag } from "@/components/PioneerFlag";
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

type ProfileRow = {
  full_name: string | null;
  school: string | null;
  year_group: string | null;
  role: string | null;
  profile_state: "minimal" | "partial" | "complete" | null;
  onboarding_complete: boolean | null;
};

type StudentProfileRow = {
  is_minor: boolean;
  parent_email: string | null;
  parent_verified: boolean;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: application }, { data: studentProfile }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, school, year_group, role, profile_state, onboarding_complete")
      .eq("id", user.id)
      .maybeSingle<ProfileRow>(),
    supabase
      .from("applications")
      .select("status, video_url, statement, updated_at")
      .eq("user_id", user.id)
      .maybeSingle<ApplicationRow>(),
    supabase
      .from("student_profiles")
      .select("is_minor, parent_email, parent_verified")
      .eq("id", user.id)
      .maybeSingle<StudentProfileRow>(),
  ]);

  const displayName =
    profile?.full_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email ||
    "Pioneer";
  const firstName = displayName.split(/\s+/)[0];
  const school =
    profile?.school ?? (user.user_metadata?.school as string | undefined) ?? "—";
  const yearGroup =
    profile?.year_group ??
    (user.user_metadata?.year_group as string | undefined) ??
    "—";
  const role =
    profile?.role ??
    (user.user_metadata?.role as string | undefined) ??
    "—";
  const roleLabelMap: Record<string, string> = {
    student: "Student",
    teacher: "Teacher / Coordinator",
    parent: "Parent / Guardian",
    school_admin: "School Administrator",
    partner: "Partner / Agent",
  };
  const roleLabel = roleLabelMap[role] ?? role;

  const status: ApplicationStatus = application?.status ?? "interest";
  const completion = completionPercent(status);
  const milestones = computeMilestoneStatuses(PIONEER_MILESTONES);
  const activeMilestone =
    milestones.find((m) => m.status === "active") ?? milestones[milestones.length - 1];

  const needsParentVerification =
    studentProfile?.is_minor === true &&
    studentProfile.parent_verified === false &&
    !!studentProfile.parent_email;

  // Minimal profile (new two-stage signup, before any feature engagement) →
  // show a welcome / explore screen instead of the rich application dashboard.
  if (!profile?.onboarding_complete) {
    return <MinimalDashboard email={user.email ?? ""} hasApplied={!!application} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <SiteNav
        rightSlot={
          <form action={signOut}>
            <button type="submit" style={{ background: "none", border: "none", color: "#c4683c", fontWeight: 600, cursor: "pointer", fontSize: "inherit", fontFamily: "inherit" }}>
              Sign Out
            </button>
          </form>
        }
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--ink)] to-[var(--ink-light)] text-white">
        <div className="max-w-[1200px] mx-auto px-8 py-16 md:py-20">
          <div className="eyebrow eyebrow-accent">
            Pioneer Programme · {APPLICATION_STATUS_LABEL[status]}
          </div>
          <h1 className="font-display text-[3rem] md:text-[3.6rem] leading-[1.1] mt-5 mb-4 max-w-3xl">
            Hello, {firstName}.
            <br />
            <span className="text-[var(--accent)]">Your journey</span> has begun.
          </h1>
          <p className="text-white/60 max-w-xl text-[1.02rem] leading-[1.75]">
            {progressHint(status)}
          </p>

          {/* Progress strip */}
          <div className="mt-10 max-w-2xl">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[0.72rem] tracking-[2px] uppercase text-white/50">
                Overall progress
              </span>
              <span className="font-display text-[1.4rem] text-[var(--accent)]">
                {completion}%
              </span>
            </div>
            <div className="h-[3px] w-full bg-white/10 overflow-hidden rounded-full">
              <div
                className="h-full bg-[var(--accent)] transition-[width] duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {needsParentVerification && (
        <ParentVerificationBanner
          parentEmail={studentProfile!.parent_email!}
          resendAction={resendParentVerification}
        />
      )}

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-8 py-16 space-y-20">
        {/* Profile cards */}
        <section>
          <div className="eyebrow mb-6">Your profile</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ProfileCard label="Role" value={roleLabel} />
            <ProfileCard label="School" value={school} />
            <ProfileCard label="Year group" value={role === "student" ? yearGroup : "—"} />
            <ProfileCard
              label="Status"
              value={APPLICATION_STATUS_LABEL[status]}
              accent
              hint={
                application?.updated_at
                  ? `Updated ${formatDate(application.updated_at)}`
                  : "No application yet"
              }
            />
          </div>
        </section>

        {/* Current focus */}
        <section className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-lg)] overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_1.4fr]">
          <div className="bg-[var(--primary-subtle)] p-10 flex flex-col justify-center">
            <div className="eyebrow mb-4">Right now</div>
            <h2 className="font-display text-[2rem] leading-[1.2] text-[var(--ink)] mb-3">
              {activeMilestone?.title}
            </h2>
            <p className="text-[var(--gray-600)] text-[0.98rem] leading-[1.7]">
              {activeMilestone?.detail}
            </p>
            <div className="mt-6 text-[0.78rem] tracking-[2px] uppercase text-[var(--primary)] font-semibold">
              Target · {activeMilestone?.target}
            </div>
          </div>
          <div className="p-10">
            <div className="eyebrow eyebrow-accent mb-4">Next actions</div>
            <ul className="space-y-3 text-[0.98rem] text-[var(--gray-700)] leading-[1.65]">
              {nextSteps(status).map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[10px] inline-block w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.85rem] text-[var(--gray-500)]">
              Questions? Email{" "}
              <Link
                href="mailto:info@milesminds.com"
                className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                info@milesminds.com
              </Link>
            </p>
          </div>
        </section>

        {/* Milestones */}
        <section>
          <div className="eyebrow mb-3">The journey</div>
          <h2 className="font-display text-[2.4rem] leading-[1.2] text-[var(--ink)] mb-10 max-w-2xl">
            From first spark to <span className="text-[var(--accent)]">Beijing</span>.
          </h2>

          <ol className="relative border-l border-[var(--gray-200)] pl-8 space-y-10">
            {milestones.map((m) => (
              <li key={m.key} className="relative">
                <span
                  className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-[3px] border-[var(--bg)] shrink-0"
                  style={{ background: dotColor(m.status) }}
                />
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                  <div className="max-w-xl">
                    <div className="text-[0.7rem] tracking-[2px] uppercase font-semibold text-[var(--gray-400)] mb-1">
                      {m.phase}
                      {m.status === "active" && (
                        <span className="ml-3 text-[var(--accent)]">· In focus</span>
                      )}
                    </div>
                    <div className="font-display text-[1.25rem] text-[var(--ink)] leading-[1.3]">
                      {m.title}
                    </div>
                    <div className="text-[0.92rem] text-[var(--gray-500)] mt-1 leading-[1.65]">
                      {m.detail}
                    </div>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <div className="text-[0.68rem] tracking-[1.5px] uppercase text-[var(--gray-400)]">
                      Target
                    </div>
                    <div className="font-display text-[1.05rem] text-[var(--primary)]">
                      {m.target}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Delete account */}
        <section className="border-t border-[var(--gray-200)] pt-12">
          <div className="eyebrow mb-3" style={{ color: "var(--gray-400)" }}>Account</div>
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

function ProfileCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-white border rounded-[var(--radius-md)] p-6 ${
        accent ? "border-[var(--accent)]/30" : "border-[var(--gray-200)]"
      }`}
    >
      <div className="text-[0.7rem] tracking-[2px] uppercase font-semibold text-[var(--gray-500)] mb-2">
        {label}
      </div>
      <div
        className={`font-display text-[1.5rem] leading-[1.2] ${
          accent ? "text-[var(--accent)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </div>
      {hint && (
        <div className="text-[0.8rem] text-[var(--gray-400)] mt-2">{hint}</div>
      )}
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
      return "Application received. The selection committee is scoring submissions. If you're on the edge we may invite you for a short video interview.";
    case "shortlisted":
      return "You're shortlisted. Final picks will be made by Richard and the committee. Watch your inbox.";
    case "selected":
      return "Congratulations, you're in. Next up: sign the Pioneer agreement and prepare your passport for visa processing.";
    case "waitlist":
      return "You're on the waitlist. If a selected Pioneer drops out, you'll be called up in order. Keep your contact details current.";
    case "rejected":
      return "Not this time. You're still welcome to join a future paid school trip or other China Quest programmes.";
  }
}

function nextSteps(status: ApplicationStatus): string[] {
  switch (status) {
    case "interest":
      return [
        "Keep your email and phone reachable. We'll contact you first when applications open.",
        "Start thinking about your 60–90 second video: why you want to go to China.",
        "Mention the programme to your principal or a teacher. Early support helps.",
      ];
    case "applying":
      return [
        "Upload your 60–90 second application video.",
        "Submit your 200-word written statement.",
        "Ask your principal for a reference and have a parent or guardian sign the consent form.",
      ];
    case "submitted":
      return [
        "Wait for selection results (usually 2–3 weeks).",
        "If invited to a video interview, be on time and ready.",
      ];
    case "shortlisted":
      return [
        "If a video interview is needed, check your webcam and connection.",
        "Watch for the final decision email.",
      ];
    case "selected":
      return [
        "Sign the Pioneer agreement (IP, image release, code of conduct).",
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
        "For appeals or feedback, email info@milesminds.com.",
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

function dotColor(status: MilestoneStatus): string {
  if (status === "done") return "#1b3a5c";
  if (status === "active") return "#c4683c";
  return "#c8c4bd";
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}

function MinimalDashboard({ email, hasApplied }: { email: string; hasApplied: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <PioneerFlag applied={hasApplied} />
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
            Signed in as <strong className="text-white/85">{email}</strong>. We&apos;ll only ask for
            personal details (school, age, etc.) when you start an application — not before.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-8 py-16 space-y-12">
        <section>
          <div className="eyebrow mb-6">Pick a path</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/pioneer.html"
              className="group block bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] overflow-hidden hover:border-[var(--accent)] hover:shadow-[0_8px_30px_rgba(196,104,60,0.08)] transition-all"
            >
              <div className="relative h-[160px] overflow-hidden bg-[var(--gray-100)]">
                <img src="/images/beijing/greatwall.jpg" alt="Pioneer Programme" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <span className="absolute top-3 left-3 text-[0.68rem] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-[4px] text-white bg-[#2d8a4e]">Free</span>
              </div>
              <div className="p-6">
                <div className="text-[0.7rem] tracking-[2px] uppercase font-semibold text-[var(--accent)] mb-1.5">
                  Pioneer Programme
                </div>
                <div className="font-display text-[1.3rem] leading-[1.2] text-[var(--ink)] mb-2">
                  {hasApplied ? "You've applied." : "Apply to be a Pioneer."}
                </div>
                <p className="text-[0.88rem] text-[var(--gray-500)] leading-[1.65] mb-4">
                  A fully-funded place for one student per Irish school. 11 days in China, filming, learning, and representing your school.
                </p>
                <span className="text-[0.85rem] font-semibold text-[var(--accent)]">
                  Learn more →
                </span>
              </div>
            </Link>

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
            Permanently delete your account. This action cannot be undone.
          </p>
          <DeleteAccountButton action={requestAccountDeletion} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
