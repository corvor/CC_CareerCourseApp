import { COURSES_BY_ID } from "../data/courses.js";

/** Course list that appears only on the printed report. */
export default function PrintCourses({ selection }) {
  const names = Object.keys(selection)
    .filter((id) => COURSES_BY_ID[id])
    .map((id) => {
      const c = COURSES_BY_ID[id];
      const score = selection[id].score;
      return c.n + (c.t === "AP" && score ? ` (score ${score})` : "");
    });
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="panel print-only">
      <div className="panel-head">
        <h2>Coursework used for this report</h2>
        <span className="hint">{today}</span>
      </div>
      <p>{names.length ? names.join(", ") : "No courses selected."}</p>
    </div>
  );
}
