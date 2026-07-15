import { OverallScorePieChart } from "@/components/admin/reports/overall-score-pie-chart";
import { TeacherScoresList } from "@/components/admin/reports/teacher-scores-list";

export function ReportsPanel() {
  return (
    <div className="space-y-6">
      <OverallScorePieChart />
      <TeacherScoresList />
    </div>
  );
}
