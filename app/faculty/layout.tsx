import { FacultyPortalShell } from "@/components/faculty-portal/faculty-portal-shell";

export default function FacultyPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <FacultyPortalShell>{children}</FacultyPortalShell>;
}
