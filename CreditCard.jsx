import { coreProgress, creditCourses } from "../lib/pathfinder.js";

const PILL = { have: "p-ok", maybe: "p-mid", no: "p-gap" };

/** AP and dual credit mapped to Texas common course numbers and the Texas Core. */
export default function CreditCard({ occ, selection }) {
  const credits = creditCourses(selection);
  const leadsToDegree = occ.path.deg;

  if (credits.length === 0) {
    return (
      <div className="panel">
        <div className="panel-head"><h2>College credit you may already have</h2></div>
        <p className="empty">
          No AP or dual credit courses selected. If you take them later, they can count toward college requirements
          {leadsToDegree ? " for this path." : " if you ever go for a degree."}
        </p>
      </div>
    );
  }

  const core = coreProgress(selection);

  return (
    <div className="panel">
      <div className="panel-head"><h2>College credit you may already have</h2></div>

      <div className="row core-summary">
        <span className="core-total">
          {core.totalHave}
          {core.totalMaybe > 0 && <span className="core-maybe"> +{core.totalMaybe}</span>}
        </span>
        <span className="hint">
          of {core.totalHours} Texas Core Curriculum hours. The core transfers as a block between Texas public colleges.
        </span>
      </div>

      <div className="legend">
        <span><i className="lg-have" />Earned or likely</span>
        <span><i className="lg-maybe" />Possible with an AP score of 3+</span>
      </div>

      <div className="core">
        {core.rows.map((r) => (
          <div className="core-row" key={r.name}>
            <span>{r.name}</span>
            <span className="pct">{r.have}{r.maybe ? `+${r.maybe}` : ""} / {r.hours}</span>
            <div className="core-bar">
              <i className="have" style={{ width: `${(r.have / r.hours) * 100}%` }} />
              <i className="maybe" style={{ width: `${(r.maybe / r.hours) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {!leadsToDegree && (
        <p className="note">This path doesn't require a degree, so core hours won't speed it up. They still count if you go back for an associate or bachelor's later.</p>
      )}

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr><th>Your course</th><th>Typical college equivalent</th><th>Status</th></tr>
          </thead>
          <tbody>
            {credits.map((x) => (
              <tr key={x.id}>
                <td>{x.course.n}</td>
                <td className="mono">{x.course.cr.col}</td>
                <td><span className={`pill ${PILL[x.status]}`}>{x.label}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint">Course numbers follow the Texas Common Course Numbering System. Each college decides what an AP score or dual credit course counts for.</p>
    </div>
  );
}
