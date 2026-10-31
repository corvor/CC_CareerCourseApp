import { OCCUPATIONS } from "../data/occupations.js";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p>
          <strong>How to read this.</strong> Occupation requirements (Job Zone, education levels, knowledge areas and their
          order) come from O*NET OnLine. The match between high school courses and O*NET knowledge areas, the typical
          post-high-school coursework, and college course equivalents are planning estimates. Every college, program, and
          apprenticeship sets its own rules, so confirm credit and prerequisites with the school before counting on them.
        </p>
        <p>
          This site includes information from{" "}
          <a href="https://www.onetonline.org/" target="_blank" rel="noopener noreferrer">O*NET OnLine</a> by the U.S.
          Department of Labor, Employment and Training Administration (USDOL/ETA). Used under the{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>{" "}
          license. O*NET® is a trademark of USDOL/ETA. Career Connections has modified all or some of this information:
          O*NET descriptions are shortened, and the course matching, training paths, and college credit sections are added
          content. USDOL/ETA has not approved, endorsed, or tested these modifications.
        </p>
        <details className="sources no-print">
          <summary>Sources</summary>
          <ul>
            {OCCUPATIONS.map((o) => (
              <li key={o.soc}>
                <a href={`https://www.onetonline.org/link/summary/${o.soc}`} target="_blank" rel="noopener noreferrer">
                  O*NET {o.soc} · {o.n}
                </a>
              </li>
            ))}
            <li>
              <a href="https://capitol.texas.gov/tlodocs/84R/analysis/html/HB01992H.htm" target="_blank" rel="noopener noreferrer">
                Texas HB 1992 (2015): AP credit at a score of 3
              </a>
            </li>
            <li>
              <a href="https://catalog.tccd.edu/academics/corecurriculum" target="_blank" rel="noopener noreferrer">
                Texas Core Curriculum component areas
              </a>
            </li>
          </ul>
        </details>
        <p className="fine">Diamondback Energy · Career Connections</p>
      </div>
    </footer>
  );
}
