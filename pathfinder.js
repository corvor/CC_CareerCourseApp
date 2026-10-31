/**
 * Pathfinder logic. Pure functions with no React, so they run in Node tests.
 *
 * "selection" is the student's course list, shaped like:
 *   { eng1: {}, ap_bio: { score: 4 }, ... }   (key = course id, score only for AP)
 */
import { KNOWLEDGE, COURSES, COURSES_BY_ID } from "../data/courses.js";
import { OCCUPATIONS, TEXAS_CORE, TAG_IDEAS } from "../data/occupations.js";

/* ---------- Pasted course text ---------- */

/** Lowercase, strip punctuation, and turn Roman numerals into digits ("Algebra II" -> "algebra 2"). */
export function normalizeCourseName(text) {
  return (" " + text.toLowerCase().replace(/[^a-z0-9&+ ]/g, " ") + " ")
    .replace(/\biv\b/g, "4")
    .replace(/\biii\b/g, "3")
    .replace(/\bii\b/g, "2")
    .replace(/\bi\b/g, "1")
    .replace(/\s+/g, " ")
    .trim();
}

// AP and dual credit first, so "AP Biology" doesn't match plain "Biology".
const MATCH_ORDER = [...COURSES.filter((c) => c.t), ...COURSES.filter((c) => !c.t)];

/** Find the catalog course for one line of text, or null. */
export function findCourse(line) {
  const s = normalizeCourseName(line);
  return MATCH_ORDER.find((c) => c.re.test(s)) || null;
}

/** Split pasted text into lines and match each. */
export function matchPastedText(text) {
  const lines = text
    .split(/[\n;|\t]+|,(?=\s*[A-Za-z])/)
    .map((l) => l.trim())
    .filter((l) => /[a-z]{2}/i.test(l));
  const matchedIds = [];
  const missed = [];
  for (const line of lines) {
    const hit = findCourse(line);
    if (hit) {
      if (!matchedIds.includes(hit.id)) matchedIds.push(hit.id);
    } else missed.push(line);
  }
  return { lineCount: lines.length, matchedIds, missed };
}

/** Remove ids that no longer exist in the catalog (e.g., after a data update). */
export function cleanSelection(selection) {
  const out = {};
  for (const [id, v] of Object.entries(selection || {})) {
    if (COURSES_BY_ID[id]) out[id] = v && typeof v === "object" ? v : {};
  }
  return out;
}

/* ---------- Occupations ---------- */

export function getOccupation(soc) {
  return OCCUPATIONS.find((o) => o.soc === soc) || OCCUPATIONS[0];
}

/** O*NET knowledge list as [{ code, name, importance }] whether or not scores were recorded. */
export function occupationKnowledge(occ) {
  return occ.k.map((x) => {
    const [code, importance] = Array.isArray(x) ? x : [x, null];
    return { code, name: KNOWLEDGE[code] || code, importance };
  });
}

/* ---------- Knowledge match ---------- */

const selectedCourses = (selection) =>
  Object.keys(selection).map((id) => COURSES_BY_ID[id]).filter(Boolean);

/** Add up course weights for one knowledge area. 3+ strong, 1-2 started, 0 not yet. */
export function knowledgeStrength(code, selection) {
  let sum = 0;
  const from = [];
  for (const c of selectedCourses(selection)) {
    if (c.kn[code]) {
      sum += c.kn[code];
      from.push(c.n);
    }
  }
  return { sum, from, status: sum >= 3 ? "ok" : sum >= 1 ? "mid" : "gap" };
}

/** Unselected courses that build a knowledge area, strongest first. */
export function suggestCourses(code, selection, limit) {
  return COURSES.filter((c) => c.kn[code] && !selection[c.id])
    .sort((a, b) => b.kn[code] - a.kn[code])
    .slice(0, limit)
    .map((c) => c.n);
}

export function knowledgeMatch(occ, selection) {
  const items = occupationKnowledge(occ).map((k) => {
    const s = knowledgeStrength(k.code, selection);
    return {
      ...k,
      ...s,
      suggestions:
        s.status === "gap" ? suggestCourses(k.code, selection, 3)
        : s.status === "mid" ? suggestCourses(k.code, selection, 2)
        : [],
    };
  });
  const tally = { ok: 0, mid: 0, gap: 0 };
  items.forEach((i) => tally[i.status]++);
  return { items, tally };
}

/* ---------- College credit ---------- */

/** have = earned or likely, maybe = AP with no score yet, no = AP score under 3 */
export function creditStatus(id, selection) {
  const c = COURSES_BY_ID[id];
  if (c.t === "DC") return { status: "have", label: "Earned (dual credit)" };
  const score = selection[id]?.score;
  if (score == null) return { status: "maybe", label: "Possible with a 3+" };
  if (score >= 3) return { status: "have", label: `Likely (AP score ${score})` };
  return { status: "no", label: `Not likely (AP score ${score})` };
}

export function creditCourses(selection) {
  return Object.keys(selection)
    .filter((id) => COURSES_BY_ID[id]?.cr)
    .map((id) => ({ id, course: COURSES_BY_ID[id], ...creditStatus(id, selection) }));
}

/** Does any AP/DC course cover a path tag? Returns { status, course } or null. */
export function tagCoverage(tag, selection) {
  const list = creditCourses(selection).filter((x) => x.course.cr.tags.includes(tag));
  const have = list.find((x) => x.status === "have");
  if (have) return { status: "have", course: have.course };
  const maybe = list.find((x) => x.status === "maybe");
  if (maybe) return { status: "maybe", course: maybe.course };
  return null;
}

/** Texas Core Curriculum progress, capped at each component's hours. */
export function coreProgress(selection) {
  const have = {};
  const maybe = {};
  for (const x of creditCourses(selection)) {
    const area = x.course.cr.core;
    if (!area) continue;
    if (x.status === "have") have[area] = (have[area] || 0) + x.course.cr.hrs;
    else if (x.status === "maybe") maybe[area] = (maybe[area] || 0) + x.course.cr.hrs;
  }
  let totalHave = 0;
  let totalMaybe = 0;
  const rows = TEXAS_CORE.map(([name, hours]) => {
    const h = Math.min(hours, have[name] || 0);
    const m = Math.min(hours - h, maybe[name] || 0);
    totalHave += h;
    totalMaybe += m;
    return { name, hours, have: h, maybe: m };
  });
  const totalHours = TEXAS_CORE.reduce((s, [, hrs]) => s + hrs, 0);
  return { rows, totalHave, totalMaybe, totalHours };
}

/* ---------- Next steps ---------- */

export function nextSteps(occ, selection) {
  const { items } = knowledgeMatch(occ, selection);
  const gaps = items.filter((k) => k.status === "gap").slice(0, 3).map((k) => k.name);
  const unscoredAp = creditCourses(selection).filter((x) => x.status === "maybe").length;
  const uncoveredTags = occ.path.items.map((i) => i[1]).filter(Boolean).filter((t) => !tagCoverage(t, selection));
  const creditIdeas = [...new Set(uncoveredTags.map((t) => TAG_IDEAS[t]).filter(Boolean))].slice(0, 3);
  return {
    gaps,
    needAlgebra2: occ.zn >= 4 && !selection.alg2,
    unscoredAp,
    creditIdeas,
    askAboutCte: occ.zn <= 3 && !occ.path.deg,
  };
}
