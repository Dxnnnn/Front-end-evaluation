"use client";

import { useState } from "react";

import { ScoringGuide } from "@/components/admin/evaluations/scoring-guide";
import { SurveyQuestionForm } from "@/components/admin/evaluations/survey-question-form";
import { SurveyQuestionsList } from "@/components/admin/evaluations/survey-questions-list";

export function SurveyQuestionsPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <ScoringGuide />

      <section className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <SurveyQuestionForm
          onCreated={() => setRefreshKey((current) => current + 1)}
        />
        <SurveyQuestionsList refreshKey={refreshKey} />
      </section>
    </div>
  );
}
