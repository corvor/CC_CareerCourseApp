// Run with: npm test   (uses Node's built-in test runner, no extra packages)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeCourseName, findCourse, matchPastedText, cleanSelection, getOccupation,
  knowledgeMatch, creditStatus, tagCoverage, coreProgress, nextSteps,
} from "../src/lib/pathfinder.js";
import { COURSES, COURSES_BY_ID, KNOWLEDGE } from "../src/data/courses.js";
import { OCCUPATIONS, TAG_NAMES } from "../src/data/occupations.js";

test("Roman numerals and punctuation are normalized", () => {
  assert.equal(normalizeCourseName("Algebra II"), "algebra 2");
  assert.equal(normalizeCourseName("English IV (Honors)"), "english 4 honors");
});

test("common transcript names match the right course", () => {
  const cases = {
    "English III": "eng3", "Algebra II": "alg2", "AP Biology": "ap_bio", "Biology": "bio",
    "Dual Credit ENGL 1301": "dc_engl", "APUSH": "apush", "Pre-Calculus": "precalc",
    "AP Calculus AB": "ap_calc", "Welding I": "weld", "Practicum in Health Science": "cna",
    "Economics w/ Emphasis on Free Enterprise": "econ", "Spanish II": "lote",
  };
  for (const [text, id] of Object.entries(cases)) {
    assert.equal(findCourse(text)?.id, id, text);
  }
});

test("pasted text reports matches and misses", () => {
  const r = matchPastedText("English II\nBasket weaving\nAlgebra II\nAlgebra II");
  assert.deepEqual(r.matchedIds, ["eng2", "alg2"]);
  assert.deepEqual(r.missed, ["Basket weaving"]);
  assert.equal(r.lineCount, 4);
});

test("unknown saved course ids are dropped", () => {
  assert.deepEqual(cleanSelection({ eng1: {}, retired_course: {} }), { eng1: {} });
});

test("knowledge thresholds: 3+ strong, 1-2 started, 0 not yet", () => {
  const elec = getOccupation("47-2111.00");
  const { items, tally } = knowledgeMatch(elec, { constr: {}, alg1: {} });
  const byCode = Object.fromEntries(items.map((i) => [i.code, i]));
  assert.equal(byCode.BC.status, "ok");   // Construction Technology = 3
  assert.equal(byCode.MA.status, "mid");  // Algebra I 1 + Construction 1 = 2
  assert.equal(byCode.PS.status, "gap");
  assert.equal(tally.ok + tally.mid + tally.gap, items.length);
});

test("AP credit needs a 3+, dual credit counts as earned", () => {
  assert.equal(creditStatus("ap_bio", { ap_bio: {} }).status, "maybe");
  assert.equal(creditStatus("ap_bio", { ap_bio: { score: 3 } }).status, "have");
  assert.equal(creditStatus("ap_bio", { ap_bio: { score: 2 } }).status, "no");
  assert.equal(creditStatus("dc_engl", { dc_engl: {} }).status, "have");
});

test("path tags are covered by AP or dual credit", () => {
  assert.equal(tagCoverage("comp", { dc_engl: {} }).status, "have");
  assert.equal(tagCoverage("calc", { ap_calc: {} }).status, "maybe");
  assert.equal(tagCoverage("calc", { ap_calc: { score: 1 } }), null);
});

test("Texas Core totals 42 and caps each component", () => {
  const p = coreProgress({ dc_engl: {}, ap_lang: { score: 5 }, ap_lit: { score: 5 } });
  assert.equal(p.totalHours, 42);
  assert.equal(p.rows.find((r) => r.name === "Communication").have, 6); // 6 + 3 + 3 capped at 6
});

test("next steps flag Algebra II only for Job Zone 4+", () => {
  assert.equal(nextSteps(getOccupation("17-2141.00"), {}).needAlgebra2, true);
  assert.equal(nextSteps(getOccupation("17-2141.00"), { alg2: {} }).needAlgebra2, false);
  assert.equal(nextSteps(getOccupation("47-2111.00"), {}).needAlgebra2, false);
});

test("data integrity: every reference points at something real", () => {
  const ids = new Set();
  for (const c of COURSES) {
    assert.ok(!ids.has(c.id), `duplicate course id ${c.id}`);
    ids.add(c.id);
    for (const code of Object.keys(c.kn)) assert.ok(KNOWLEDGE[code], `${c.id}: unknown knowledge code ${code}`);
    for (const tag of c.cr?.tags || []) assert.ok(TAG_NAMES[tag], `${c.id}: unknown tag ${tag}`);
  }
  const socs = new Set();
  for (const o of OCCUPATIONS) {
    assert.match(o.soc, /^\d{2}-\d{4}\.\d{2}$/, `bad SOC ${o.soc}`);
    assert.ok(!socs.has(o.soc), `duplicate SOC ${o.soc}`);
    socs.add(o.soc);
    assert.ok([2, 3, 4, 5].includes(o.zn), `${o.soc}: zn must be 2-5`);
    for (const k of o.k) {
      const code = Array.isArray(k) ? k[0] : k;
      assert.ok(KNOWLEDGE[code], `${o.soc}: unknown knowledge code ${code}`);
    }
    for (const [, tag] of o.path.items) if (tag) assert.ok(TAG_NAMES[tag], `${o.soc}: unknown tag ${tag}`);
  }
  assert.ok(COURSES_BY_ID.eng1);
});
