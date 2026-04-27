export type MilestoneStatus = "done" | "active" | "upcoming";

export type Milestone = {
  key: string;
  phase: string;
  title: string;
  detail: string;
  target: string;
};

export const PIONEER_MILESTONES: Milestone[] = [
  {
    key: "interest_open",
    phase: "Registration",
    title: "Expression of interest opens",
    detail: "Live at the TY Show and online the same week.",
    target: "2026-04-28",
  },
  {
    key: "application_open",
    phase: "Application",
    title: "Applications open",
    detail: "Submit your video, written statement, principal reference and parental consent.",
    target: "TBD",
  },
  {
    key: "application_close",
    phase: "Application",
    title: "Applications close",
    detail: "Two-week window. Don't wait for the last day.",
    target: "TBD",
  },
  {
    key: "selection",
    phase: "Selection",
    title: "Committee scoring & shortlist",
    detail: "Two to three reviewers score independently.",
    target: "TBD",
  },
  {
    key: "final",
    phase: "Selection",
    title: "Final decisions announced",
    detail: "20 students + 1–2 teachers + 5 on the waitlist.",
    target: "TBD",
  },
  {
    key: "agreement",
    phase: "Onboarding",
    title: "Pioneer agreement signed",
    detail: "Student signature plus parent or guardian.",
    target: "TBD",
  },
  {
    key: "visa",
    phase: "Onboarding",
    title: "Visas & logistics",
    detail: "Passports collected, visa applications lodged, flights booked.",
    target: "TBD",
  },
  {
    key: "briefing",
    phase: "Pre-trip",
    title: "Pre-departure briefing",
    detail: "Itinerary, content brief, safety rules.",
    target: "TBD",
  },
  {
    key: "departure",
    phase: "Departure",
    title: "Pioneers fly to China",
    detail: "The Roots route: Beijing → Xi'an → Shanghai, 11 days.",
    target: "Summer 2026",
  },
  {
    key: "feedback",
    phase: "After",
    title: "Feedback & review",
    detail: "Written feedback plus a 30-minute video debrief.",
    target: "+2 weeks",
  },
  {
    key: "school_share",
    phase: "After",
    title: "Share at school",
    detail: "Present to an assembly or your TY class.",
    target: "+4 weeks",
  },
];

export type ApplicationStatus =
  | "interest"
  | "applying"
  | "submitted"
  | "shortlisted"
  | "selected"
  | "waitlist"
  | "rejected";

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  interest: "Interest registered",
  applying: "Application in progress",
  submitted: "Application submitted",
  shortlisted: "Shortlisted",
  selected: "Selected",
  waitlist: "Waitlist",
  rejected: "Not selected",
};

export function statusBadgeColor(status: ApplicationStatus): {
  bg: string;
  text: string;
} {
  switch (status) {
    case "selected":
      return { bg: "#f5fff8", text: "#2d8a4e" };
    case "shortlisted":
      return { bg: "#fffdf5", text: "#b78e00" };
    case "rejected":
      return { bg: "#fff8f8", text: "#c41e3a" };
    case "waitlist":
      return { bg: "#f5f6fa", text: "#4a5180" };
    default:
      return { bg: "#f5f6fa", text: "#1b2a6b" };
  }
}
