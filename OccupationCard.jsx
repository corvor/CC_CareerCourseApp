import { ZONE_TEXT } from "../data/occupations.js";

/** O*NET summary: Job Zone, education levels, credentials. */
export default function OccupationCard({ occ }) {
  const hasPercents = occ.edu.some(([, p]) => p != null);

  return (
    <div className="panel occ-card">
      <div className="occ-title">
        <h2>{occ.n}</h2>
        <span className="soc">O*NET-SOC {occ.soc}</span>
      </div>
      <p>{occ.d}</p>

      <div className="zone">
        <span className="eyebrow">Job Zone {occ.z} of 5</span>
        <div className="zone-meter" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= occ.zn ? "on" : ""} />)}
        </div>
        <div className="zone-scale" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => <span key={i}>{i}</span>)}
        </div>
        <p className="hint">{ZONE_TEXT[occ.zn]}</p>
      </div>

      <div className="facts">
        <div className="fact">
          <h3>Education new hires need</h3>
          {occ.edu.length === 0 ? (
            <p className="hint">O*NET does not publish an education breakdown on this profile. See the Job Zone description.</p>
          ) : (
            <>
              {occ.edu.map(([level, pct]) => (
                <div className="edu-row" key={level}>
                  <span>{level}</span>
                  <span className="pct">{pct != null ? `${pct}%` : "some jobs"}</span>
                  <div className="edu-bar"><i style={{ width: `${pct != null ? pct : 30}%` }} /></div>
                </div>
              ))}
              <p className="hint">
                {hasPercents
                  ? "Share of O*NET survey respondents saying new hires need this level."
                  : "O*NET lists these levels without percentages for this job."}
              </p>
            </>
          )}
        </div>
        <div className="fact">
          <h3>Licenses &amp; credentials</h3>
          <p className="fact-text">{occ.cred}</p>
        </div>
      </div>

      <a href={`https://www.onetonline.org/link/summary/${occ.soc}`} target="_blank" rel="noopener noreferrer">
        Open the full O*NET profile
      </a>
    </div>
  );
}
