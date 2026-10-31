import { nextSteps } from "../lib/pathfinder.js";

export default function NextSteps({ occ, selection }) {
  const s = nextSteps(occ, selection);

  return (
    <div className="panel">
      <div className="panel-head"><h2>Next steps</h2></div>
      <ul className="plain">
        {s.gaps.length > 0 && (
          <li>Look for classes that build <strong>{s.gaps.join(", ")}</strong> in your remaining years.</li>
        )}
        {s.needAlgebra2 && (
          <li>Plan to take <strong>Algebra II</strong>. It's required for the Distinguished Level of Achievement, which Texas public universities use for automatic admission.</li>
        )}
        {s.unscoredAp > 0 && (
          <li>Add your AP scores when you get them. {s.unscoredAp === 1 ? "That course" : "Those courses"} could cover college requirements.</li>
        )}
        {s.creditIdeas.length > 0 && (
          <li>To get ahead on this path, ask your counselor about <strong>{s.creditIdeas.join(", ")}</strong>.</li>
        )}
        {s.askAboutCte && (
          <li>Ask whether your high school's CTE program offers an industry certification or a pre-apprenticeship for this field.</li>
        )}
        <li>Questions for the program or admissions office: Which of my AP or dual credit courses will you accept? What prerequisites do I need before applying? Is there a waitlist or a competitive application?</li>
      </ul>
    </div>
  );
}
