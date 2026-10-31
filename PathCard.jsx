import { tagCoverage } from "../lib/pathfinder.js";

/** Typical coursework after high school, with AP/dual credit coverage flags. */
export default function PathCard({ occ, selection }) {
  const { path } = occ;

  return (
    <div className="panel">
      <div className="panel-head"><h2>What you'd take after high school</h2></div>
      <div className="path-head">
        <h3>{path.type}</h3>
        <span className="path-len">{path.len}</span>
      </div>
      <ol className="steps">
        {path.items.map(([name, tag]) => {
          const cover = tag ? tagCoverage(tag, selection) : null;
          let pill = <span className="pill p-na">Ahead</span>;
          if (cover?.status === "have") {
            pill = <span className="pill p-ok">Covered: {cover.course.n.replace(/^Dual Credit /, "DC ")}</span>;
          } else if (cover) {
            pill = <span className="pill p-mid">If {cover.course.n} ≥ 3</span>;
          }
          return <li key={name}><span>{name}</span>{pill}</li>;
        })}
      </ol>
      <p className="note">Typical coursework for this path, not an official degree plan. Programs differ, so check the specific school or apprenticeship.</p>
    </div>
  );
}
