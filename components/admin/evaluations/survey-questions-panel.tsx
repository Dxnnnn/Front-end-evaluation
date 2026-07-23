"use client";

import { useState } from "react";

import { QuestionnaireAudienceSwitch } from "@/components/admin/evaluations/questionnaire-audience-switch";
import { QuestionSectionSwitch } from "@/components/admin/evaluations/question-section-switch";
import { ResponseGuide } from "@/components/admin/evaluations/response-guide";
import { ScoringGuide } from "@/components/admin/evaluations/scoring-guide";
import { SurveyQuestionForm } from "@/components/admin/evaluations/survey-question-form";
import { SurveyQuestionsList } from "@/components/admin/evaluations/survey-questions-list";
import type { QuestionSection, SurveyAudience } from "@/lib/types/survey-question";

export function SurveyQuestionsPanel() {
  const [audience, setAudience] = useState<SurveyAudience>("student");
  const [section, setSection] = useState<QuestionSection>("scoring");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <QuestionnaireAudienceSwitch audience={audience} onChange={setAudience} />
      <QuestionSectionSwitch section={section} onChange={setSection} />
      {section === "scoring" ? <ScoringGuide /> : <ResponseGuide />}

      <section className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <SurveyQuestionForm
          audience={audience}
          section={section}
          onCreated={() => setRefreshKey((current) => current + 1)}
        />
        <SurveyQuestionsList
          audience={audience}
          section={section}
          refreshKey={refreshKey}
        />
      </section>
    </div>
  );
}
