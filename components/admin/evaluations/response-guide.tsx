export function ResponseGuide() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Part 2: Personal questionnaire
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        These questions are answered with written responses in a textbox. Use
        them for open-ended feedback after the scoring section.
      </p>

      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-sm font-medium text-slate-900">Example preview</p>
        <p className="mt-2 text-sm text-slate-600">
          What did you find most helpful about this instructor&apos;s teaching?
        </p>
        <textarea
          readOnly
          rows={3}
          value="The instructor gave clear examples and was approachable after class."
          className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
        />
      </div>
    </section>
  );
}
