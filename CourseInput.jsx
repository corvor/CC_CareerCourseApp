import { useState } from "react";
import { matchPastedText } from "../lib/pathfinder.js";

/** Paste box: matches pasted course names to the catalog. */
export default function CourseInput({ onAdd, onClear }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  function handleMatch() {
    const r = matchPastedText(text);
    const added = onAdd(r.matchedIds);
    setResult({ ...r, added });
  }

  function handleClear() {
    setText("");
    setResult(null);
    onClear();
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Drop in your courses</h2>
        <span className="hint">Paste from a transcript or schedule</span>
      </div>
      <label className="sr-only" htmlFor="paste">Course list</label>
      <textarea
        id="paste"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"One course per line, e.g.\nEnglish II\nAlgebra II\nAP Biology\nDual Credit ENGL 1301\nWelding I"}
      />
      <div className="row">
        <button className="btn" type="button" onClick={handleMatch}>Match my courses</button>
        <button className="btn ghost" type="button" onClick={handleClear}>Clear all</button>
      </div>
      {result && (
        <p className="unmatched" role="status">
          {result.lineCount === 0 ? (
            "Paste at least one course name, one per line."
          ) : (
            <>
              Added {result.added} course{result.added === 1 ? "" : "s"}.
              {result.missed.length > 0 && (
                <>
                  {" "}Couldn't match:{" "}
                  {result.missed.map((m, i) => (
                    <span key={i}>{i > 0 && ", "}<code>{m}</code></span>
                  ))}
                  . Pick these from the lists below if they fit.
                </>
              )}
            </>
          )}
        </p>
      )}
    </div>
  );
}
