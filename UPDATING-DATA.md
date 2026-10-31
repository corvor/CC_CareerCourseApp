# Updating the data

All content lives in two files in `src/data/`. No component code changes are needed to add occupations or courses.

After any edit, run:

```bash
npm test        # checks every code, tag, and id points at something real
npm run dev     # look at the result in the browser
```

`npm test` catches most mistakes, such as a mistyped knowledge code or a duplicate id. GitHub Actions runs it again on every push.

---

## Add an occupation (`src/data/occupations.js`)

1. Find the occupation on O\*NET OnLine: https://www.onetonline.org — search the job title, open its profile, and note the **O\*NET-SOC code** (for example `47-2111.00`).
2. From the profile's **Summary** page, copy:
   - the one-line description
   - the **Job Zone** (1–5)
   - the **Education** levels and percentages, if shown
   - the **Knowledge** areas, in the order O\*NET lists them
3. Optional: the **Details** page shows an importance score (0–100) for each knowledge area. Include it if you have it.
4. Add an entry to the `O` array in `src/data/occupations.js`. Example:

```js
{soc:"47-2111.00", n:"Electricians", z:"3", zn:3,
 d:"Installs, maintains, and repairs electrical wiring, equipment, and fixtures to code.",
 edu:[["Post-secondary certificate",62],["High school diploma or equivalent",31]],
 k:[["BC",67],["AM",65],["ME",61],["MA",60]],          // with importance scores
 // k:["BC","AM","ME","MA"],                            // or without scores
 cred:"License and credential notes in plain language.",
 path:{type:"Registered apprenticeship", len:"3–4 years", deg:false,
   items:[["Electrical theory and circuits"],["English Composition","comp"]]}}
```

| Field | Meaning |
|---|---|
| `soc` | O\*NET-SOC code. Also builds the link to the O\*NET profile. |
| `n` | Occupation name |
| `z` | Job Zone as displayed (`"3"`, or `"1–2"` when O\*NET groups them) |
| `zn` | Job Zone as a number, used for grouping in the menu (2, 3, 4, or 5) |
| `d` | One-line description |
| `edu` | `[level, percent]` pairs. Use `null` for percent when O\*NET lists the level without a number. Use `[]` if O\*NET shows nothing. |
| `k` | Knowledge area codes in O\*NET's order (codes are at the top of `src/data/courses.js`) |
| `cred` | Licenses or certifications, in plain words |
| `path.type`, `path.len` | Training path and how long it takes (planning estimate) |
| `path.deg` | `true` if the path leads to a college degree (turns on the Texas Core meter's relevance) |
| `path.items` | Typical coursework. Add a second value (a tag) when an AP or dual credit course could cover it. |

**Tags** connect path items to AP/dual credit (the suggested course for each tag is in `TAG_IDEAS` at the bottom of `occupations.js`): `comp` (English Composition), `math`, `calc`, `stats`, `bio`, `chem`, `phys`, `psych`, `soc`, `econ`, `ushist`, `gov`, `cs`, `cs0`, `envsci`.

### Knowledge area codes
| Code | O\*NET knowledge area | Code | O\*NET knowledge area |
|---|---|---|---|
| EN | English Language | CE | Computers and Electronics |
| MA | Mathematics | ET | Engineering and Technology |
| PH | Physics | DE | Design |
| CH | Chemistry | ME | Mechanical |
| BI | Biology | BC | Building and Construction |
| MD | Medicine and Dentistry | PP | Production and Processing |
| PS | Psychology | TR | Transportation |
| TC | Therapy and Counseling | TE | Telecommunications |
| CPS | Customer and Personal Service | ED | Education and Training |
| AM | Administration and Management | FA | Fine Arts |
| AD | Administrative | CM | Communications and Media |
| EA | Economics and Accounting | GE | Geography |
| LG | Law and Government | PSS | Public Safety and Security |

To use a knowledge area not in this list (for example "Sales and Marketing"), add a code to the `K` object at the top of `src/data/courses.js`, then give at least one course a weight for it.

---

## Add or change a high school course (`src/data/courses.js`)

```js
{id:"weld", g:5, n:"Welding", re:/weld/, kn:{PP:3,ME:1,PSS:1}},
```

| Field | Meaning |
|---|---|
| `id` | Unique key. Don't change existing ids; students' saved lists use them. |
| `g` | Which list it appears in (index into `GROUPS`: 0 English … 9 Work & Activities) |
| `n` | Name shown to students |
| `t` | `"AP"` or `"DC"` for AP and dual credit courses |
| `re` | Pattern that recognizes the course in pasted text. The text is lowercased, punctuation is removed, and Roman numerals become digits first ("Welding II" → "welding 2"). AP and DC courses are checked first, then the rest in list order, so put specific courses above general ones. |
| `kn` | O\*NET knowledge areas this course builds, weighted 1 (intro), 2 (core), 3 (advanced) |
| `cr` | AP/DC only: `{tags, hrs, col, core}` — tags (see above), credit hours, typical Texas common course number, and Texas Core component (or `null`) |

**How the match works:** for each knowledge area, the app adds up the weights of the student's selected courses. 3 or more = *strong start*, 1–2 = *started*, 0 = *not yet*.

---

## Annual review checklist
- [ ] Re-check each occupation's O\*NET profile for changes (Job Zone, education, knowledge order)
- [ ] Have a counselor review course names against the district's current course catalog
- [ ] Confirm AP credit and dual credit notes with your main partner colleges (for example Midland College, Odessa College, UT Permian Basin, Texas Tech)
- [ ] Update "O\*NET data was pulled in…" in `README.md`
- [ ] Run `npm test` and `npm run build`
