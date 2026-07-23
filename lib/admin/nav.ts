export interface AdminNavItem {
  label: string;
  href: string;
  icon: "dashboard" | "evaluations" | "faculty" | "accounts" | "reports";
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Evaluations", href: "/admin/evaluations", icon: "evaluations" },
  { label: "Faculty", href: "/admin/faculty", icon: "faculty" },
  { label: "Accounts", href: "/admin/accounts", icon: "accounts" },
  { label: "Reports", href: "/admin/reports", icon: "reports" },
];

export const dashboardStats = [
  {
    label: "Total Evaluations",
    value: "128",
    change: "+12% from last month",
  },
  {
    label: "Pending Reviews",
    value: "24",
    change: "6 due this week",
  },
  {
    label: "Active Faculty",
    value: "42",
    change: "Across all departments",
  },
  {
    label: "Completion Rate",
    value: "87%",
    change: "+4% from last term",
  },
];

export const recentEvaluations = [
  {
    faculty: "Dr. Maria Santos",
    department: "Computer Science",
    status: "Completed",
    date: "Jul 10, 2026",
  },
  {
    faculty: "Prof. James Lim",
    department: "Mathematics",
    status: "Pending",
    date: "Jul 9, 2026",
  },
  {
    faculty: "Dr. Ana Reyes",
    department: "English",
    status: "In Review",
    date: "Jul 8, 2026",
  },
  {
    faculty: "Prof. Carlo Mendoza",
    department: "Business",
    status: "Completed",
    date: "Jul 7, 2026",
  },
];
