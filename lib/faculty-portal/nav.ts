export interface FacultyPortalNavItem {
  label: string;
  href: string;
  icon: "dashboard" | "evaluations" | "faculty" | "reports";
}

export const facultyPortalNavItems: FacultyPortalNavItem[] = [
  { label: "Dashboard", href: "/faculty", icon: "dashboard" },
  {
    label: "Evaluation Form",
    href: "/faculty/evaluations",
    icon: "evaluations",
  },
  { label: "Faculty", href: "/faculty/faculty", icon: "faculty" },
  { label: "Reports", href: "/faculty/reports", icon: "reports" },
];

export const facultyDashboardStats = [
  {
    label: "Overall Score",
    value: "3.92",
    change: "Based on all student evaluations",
  },
  {
    label: "Total Evaluations",
    value: "28",
    change: "Completed this term",
  },
  {
    label: "Faculty Monitored",
    value: "3",
    change: "Assigned to your department",
  },
  {
    label: "Latest Rating",
    value: "4.0",
    change: "Most recent submission",
  },
];

export const facultyRecentEvaluations = [
  {
    subject: "Programming 1",
    score: "3.95",
    evaluations: 12,
    date: "Jul 10, 2026",
  },
  {
    subject: "Data Structures",
    score: "3.88",
    evaluations: 10,
    date: "Jul 8, 2026",
  },
  {
    subject: "Web Development",
    score: "3.92",
    evaluations: 6,
    date: "Jul 5, 2026",
  },
];
