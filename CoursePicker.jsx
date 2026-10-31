import { COURSE_GROUPS, COURSES } from "../data/courses.js";

/** Course chips grouped by subject. The first three groups start open. */
export default function CoursePicker({ selection, isSample, onToggle, onStartOwn }) {
  const total = Object.keys(selection).length;

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Your coursework</h2>
        <span className="hint">{total ? `${total} selected` : "Nothing selected yet"}</span>
      </div>

      {isSample && (
        <div className="banner">
          <span>Showing an <strong>example student</strong> so you can see how it works.</span>
          <button className="btn ghost" type="button" onClick={onStartOwn}>Start with my own</button>
        </div>
      )}

      <div>
        {COURSE_GROUPS.map((group, gi) => {
          const items = COURSES.filter((c) => c.g === gi);
          const count = items.filter((c) => selection[c.id]).length;
          return (
            <details className="group" key={group} open={gi < 3}>
              <summary>
                {group}
                <span className="count">{count ? `${count} selected` : ""}</span>
              </summary>
              <div className="chips">
                {items.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="chip"
                    aria-pressed={!!selection[c.id]}
                    onClick={() => onToggle(c.id)}
                  >
                    {c.n}
                  </button>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
