# Course-to-Career Pathfinder (React)

A Career Connections planning tool for high school students. A student pastes or selects the courses they've taken, picks an occupation, and gets a report showing:

- **O\*NET requirements**: Job Zone, education levels new hires need, licenses and credentials
- **Knowledge match**: each O\*NET knowledge area for the job, marked *strong start*, *started*, or *not yet*
- **What comes after high school**: typical coursework for the training path
- **College credit they may already have**: AP and dual credit mapped to Texas common course numbers and the Texas Core Curriculum
- **Next steps**, plus a print / save-as-PDF report

**Stack:** React 19 + Vite 5, running on Node.js 18.18 or newer (22 recommended). There's no backend, database, or login. Student entries stay in their own browser (`localStorage`).

---

## Quick start

```bash
npm install      # first time only
npm run dev      # opens http://localhost:5173 and reloads as you edit
```

| Command | What it does |
|---|---|
| `npm run dev` | Local development server with hot reload |
| `npm test` | Runs the logic and data-integrity tests (Node's built-in test runner) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the `dist/` build locally to check it before deploying |

In VS Code: **Terminal → Run Task…** has the same commands, and **Run and Debug → Debug in Chrome/Edge** attaches the debugger.

Commit the `package-lock.json` that `npm install` creates, so every machine installs the same versions.

---

## Project layout

```
├── index.html                 Vite entry page (fonts, meta tags)
├── package.json               Scripts and dependencies
├── vite.config.js             Build settings (base "./" so it works from any folder)
├── src/
│   ├── main.jsx               Mounts the app
│   ├── App.jsx                Page layout and state (selected courses, occupation, AP scores)
│   ├── components/            One file per section of the page
│   │   ├── BrandHeader.jsx      Logo band
│   │   ├── CourseInput.jsx      Paste box and matching
│   │   ├── CoursePicker.jsx     Course chips by subject
│   │   ├── ApScores.jsx         AP score pickers
│   │   ├── OccupationPicker.jsx Occupation menu and print button
│   │   ├── OccupationCard.jsx   O*NET summary
│   │   ├── KnowledgeMatch.jsx   Knowledge areas vs. coursework
│   │   ├── PathCard.jsx         Training after high school
│   │   ├── CreditCard.jsx       AP/dual credit and Texas Core
│   │   ├── NextSteps.jsx        Recommendations
│   │   ├── PrintCourses.jsx     Course list on the printed report
│   │   └── SiteFooter.jsx       Attribution and sources
│   ├── data/
│   │   ├── courses.js           High school course catalog → O*NET knowledge areas
│   │   └── occupations.js       Occupations: O*NET data + typical training paths
│   ├── lib/
│   │   ├── pathfinder.js        All matching and scoring logic (pure functions)
│   │   └── useStoredState.js    useState that saves to localStorage
│   └── styles/
│       ├── brand.css            ← Brand colors and fonts
│       └── app.css              Layout and components
├── public/                    Copied as-is into the build
│   ├── favicon.svg
│   ├── _headers                 Security headers (Cloudflare Pages, Netlify)
│   └── staticwebapp.config.json Security headers (Azure Static Web Apps)
├── netlify.toml               Netlify build settings
├── tests/pathfinder.test.js   Logic and data tests
├── .github/workflows/ci.yml   Runs tests + build on every push (GitHub Actions)
└── docs/
    ├── DEPLOYMENT.md            Hosting options for a work project
    ├── UPDATING-DATA.md         Adding occupations and courses
    └── BRANDING.md              Colors, fonts, logo
```

---

## Deploying

`npm run build` produces a static `dist/` folder that any web host can serve. Vercel's free Hobby plan is for non-commercial use, so for a company project see **docs/DEPLOYMENT.md**. It has step-by-step setup for:

- **Azure Static Web Apps**, a good fit if the company already uses Microsoft 365 or Azure
- **Netlify** and **Cloudflare Pages**, whose free plans allow commercial use
- **The company's own web server** (IIS, Apache, nginx, SharePoint-hosted files): just copy `dist/`

---

## Data and attribution

Occupation requirements come from **O\*NET OnLine** (USDOL/ETA), used under **CC BY 4.0**. The attribution and modification notice in `SiteFooter.jsx` are required by that license, so keep them. Course matching, training paths, and college course equivalents are planning estimates, and the page labels them that way. O\*NET data was pulled in October 2026; see **docs/UPDATING-DATA.md** for the yearly review.
