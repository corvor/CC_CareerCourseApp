import { useEffect } from "react";
import BrandHeader from "./components/BrandHeader.jsx";
import CourseInput from "./components/CourseInput.jsx";
import CoursePicker from "./components/CoursePicker.jsx";
import ApScores from "./components/ApScores.jsx";
import OccupationPicker from "./components/OccupationPicker.jsx";
import OccupationCard from "./components/OccupationCard.jsx";
import KnowledgeMatch from "./components/KnowledgeMatch.jsx";
import PathCard from "./components/PathCard.jsx";
import CreditCard from "./components/CreditCard.jsx";
import NextSteps from "./components/NextSteps.jsx";
import PrintCourses from "./components/PrintCourses.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import { OCCUPATIONS } from "./data/occupations.js";
import { cleanSelection, getOccupation } from "./lib/pathfinder.js";
import { useStoredState } from "./lib/useStoredState.js";

/* Example student shown on first visit, so the report isn't empty. */
const SAMPLE = {
  selection: {
    eng1: {}, eng2: {}, ap_lang: {}, alg1: {}, geom: {}, alg2: {}, bio: {}, chem: {},
    wgeo: {}, whist: {}, ap_psych: { score: 4 }, hs_prin: {}, medterm: {}, lote: {}, job: {},
  },
  occ: "29-1141.00",
  sample: true,
};

function cleanState(saved) {
  if (!saved || typeof saved !== "object" || !saved.selection) return SAMPLE;
  return {
    selection: cleanSelection(saved.selection),
    occ: OCCUPATIONS.some((o) => o.soc === saved.occ) ? saved.occ : OCCUPATIONS[0].soc,
    sample: !!saved.sample,
  };
}

export default function App() {
  const [state, setState] = useStoredState("cc-pathfinder-v2", SAMPLE, cleanState);
  const { selection, sample } = state;
  const occ = getOccupation(state.occ);

  useEffect(() => {
    document.title = `${occ.n} · Course-to-Career Pathfinder`;
  }, [occ.n]);

  const update = (fn) => setState((s) => ({ ...fn(s), sample: false }));

  function addCourses(ids) {
    const fresh = ids.filter((id) => !selection[id]);
    update((s) => {
      const next = { ...s.selection };
      ids.forEach((id) => { if (!next[id]) next[id] = {}; });
      return { ...s, selection: next };
    });
    return fresh.length;
  }

  function toggleCourse(id) {
    update((s) => {
      const next = { ...s.selection };
      if (next[id]) delete next[id];
      else next[id] = {};
      return { ...s, selection: next };
    });
  }

  function setScore(id, score) {
    update((s) => ({ ...s, selection: { ...s.selection, [id]: { ...s.selection[id], score } } }));
  }

  const clearAll = () => update((s) => ({ ...s, selection: {} }));
  const chooseOccupation = (soc) => setState((s) => ({ ...s, occ: soc }));

  return (
    <>
      <a className="skip" href="#report">Skip to report</a>
      <BrandHeader />

      <main className="wrap">
        <section className="intro">
          <span className="eyebrow">Planning tool</span>
          <h1>Course-to-Career Pathfinder</h1>
          <p className="lede">
            Add the classes you've taken or are taking, pick an occupation, and see how your coursework lines up with
            what O*NET says the job requires, plus what you'd likely study after high school.
          </p>
        </section>

        <div className="app">
          <section className="pane no-print" aria-label="Your coursework">
            <CourseInput onAdd={addCourses} onClear={clearAll} />
            <CoursePicker selection={selection} isSample={sample} onToggle={toggleCourse} onStartOwn={clearAll} />
            <ApScores selection={selection} onScore={setScore} />
          </section>

          <section className="pane" id="report" aria-label="Report" tabIndex={-1}>
            <OccupationPicker value={occ.soc} onChange={chooseOccupation} />
            <PrintCourses selection={selection} />
            <OccupationCard occ={occ} />
            <KnowledgeMatch occ={occ} selection={selection} />
            <PathCard occ={occ} selection={selection} />
            <CreditCard occ={occ} selection={selection} />
            <NextSteps occ={occ} selection={selection} />
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
