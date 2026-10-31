import { COURSES_BY_ID } from "../data/courses.js";

/** Score picker for each selected AP course. Hidden when none are selected. */
export default function ApScores({ selection, onScore }) {
  const apIds = Object.keys(selection).filter((id) => COURSES_BY_ID[id]?.t === "AP");
  if (apIds.length === 0) return null;

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>AP exam scores</h2>
        <span className="hint">Optional</span>
      </div>
      <p className="hint">Texas public colleges generally give credit for a 3 or higher. Leave it blank if you haven't tested yet.</p>
      <div className="scores">
        {apIds.map((id) => (
          <div className="score-row" key={id}>
            <label htmlFor={`score-${id}`}>{COURSES_BY_ID[id].n}</label>
            <select
              id={`score-${id}`}
              value={selection[id].score ?? ""}
              onChange={(e) => onScore(id, e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">No score yet</option>
              {[5, 4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
