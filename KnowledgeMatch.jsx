import { knowledgeMatch } from "../lib/pathfinder.js";

const LABEL = { ok: "Strong start", mid: "Started", gap: "Not yet" };

/** O*NET knowledge areas for the job, compared with the student's courses. */
export default function KnowledgeMatch({ occ, selection }) {
  const { items, tally } = knowledgeMatch(occ, selection);

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>How your courses line up</h2>
        <span className="hint">O*NET knowledge areas, most important first</span>
      </div>

      <div className="strip" role="img" aria-label={`${tally.ok} strong, ${tally.mid} started, ${tally.gap} not yet`}>
        {items.map((k) => <span key={k.code} className={`s-${k.status}`} title={k.name} />)}
      </div>
      <div className="tally">
        <span><b>{tally.ok}</b> strong start</span>
        <span><b>{tally.mid}</b> started</span>
        <span><b>{tally.gap}</b> not yet</span>
      </div>

      <div className="k-list">
        {items.map((k) => (
          <div className="k" key={k.code}>
            <div className="k-name">
              {k.name}
              {k.importance != null && <span className="k-imp">importance {k.importance}/100</span>}
            </div>
            <span className={`pill p-${k.status}`}>{LABEL[k.status]}</span>
            <div className="k-detail">
              {k.status === "gap" ? (
                k.suggestions.length ? (
                  <><strong>Builds it in high school:</strong> {k.suggestions.join(", ")}. You'd also pick it up in training after graduation.</>
                ) : (
                  "Usually learned in training after high school."
                )
              ) : (
                <>
                  <strong>From:</strong> {k.from.join(", ")}
                  {k.status === "mid" && k.suggestions.length > 0 && (
                    <><br /><strong>To go further:</strong> {k.suggestions.join(", ")}</>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
