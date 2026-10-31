import { OCCUPATIONS } from "../data/occupations.js";

const ZONE_GROUPS = [
  [2, "Job Zone 1–2 · little to some preparation"],
  [3, "Job Zone 3 · medium preparation"],
  [4, "Job Zone 4 · considerable preparation"],
  [5, "Job Zone 5 · extensive preparation"],
];

export default function OccupationPicker({ value, onChange }) {
  return (
    <div className="panel occ-pick no-print">
      <label htmlFor="occ">Occupation</label>
      <select id="occ" value={value} onChange={(e) => onChange(e.target.value)}>
        {ZONE_GROUPS.map(([zone, label]) => (
          <optgroup key={zone} label={label}>
            {OCCUPATIONS.filter((o) => o.zn === zone).map((o) => (
              <option key={o.soc} value={o.soc}>{o.n}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <span className="hint">Grouped by O*NET Job Zone, which measures how much preparation a job needs.</span>
      <div className="row">
        <button className="btn ghost" type="button" onClick={() => window.print()}>Print or save as PDF</button>
      </div>
    </div>
  );
}
