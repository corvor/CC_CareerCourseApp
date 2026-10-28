# Course-to-Career Pathfinder

A Career Connections planning tool for high school students. A student pastes or selects the courses they've taken, picks an occupation, and gets a report showing:

- **O\*NET requirements** for the occupation: Job Zone, education levels new hires need, and license or credential notes
- **Knowledge match**: each O\*NET knowledge area for the job, marked *strong start*, *started*, or *not yet*, with the student's classes that built it or classes that would
- **What comes after high school**: typical coursework for the training path (apprenticeship, certificate, associate, bachelor's, graduate)
- **College credit they may already have**: AP and dual credit mapped to Texas common course numbers and the 42-hour Texas Core Curriculum
- **Next steps** and questions to bring to an advisor
- A **print / save as PDF** report for counselor meetings

It is a static website: plain HTML, CSS, and JavaScript. There is **no build step, no server code, no database, and no login**. Student entries are saved only in that student's own browser (`localStorage`) and are never sent anywhere.

---

## Files

```
career-pathfinder/
├── index.html               Page structure
├── vercel.json              Vercel settings and security headers
├── css/
│   ├── brand.css            ← Brand colors and fonts (the only file to edit for styling)
│   └── app.css              Layout and components
├── js/
│   ├── data-courses.js      High school course catalog and how each maps to O*NET knowledge areas
│   ├── data-occupations.js  Occupations: O*NET data plus typical training paths
│   └── app.js               App logic
├── assets/
│   ├── favicon.svg          Browser tab icon
│   └── LOGO-GOES-HERE.md    Where to put the official logo (logo.svg)
└── docs/
    └── UPDATING-DATA.md     How to add occupations and courses
```

---

## Deploy: GitHub + Vercel (both free)

### 1. Put the code on GitHub
1. Sign in at https://github.com and click **New repository**.
2. Name it, for example `career-pathfinder`. Public or private both work with Vercel Hobby.
3. Upload the contents of this folder (drag the files into **Add file → Upload files**, or use git):
   ```bash
   cd career-pathfinder
   git init
   git add .
   git commit -m "Course-to-Career Pathfinder"
   git branch -M main
   git remote add origin https://github.com/<your-org>/career-pathfinder.git
   git push -u origin main
   ```
   `index.html` must be at the top level of the repository, not inside a subfolder.

### 2. Connect Vercel
1. Sign in at https://vercel.com with the GitHub account.
2. Click **Add New → Project** and import the `career-pathfinder` repository.
3. Settings:
   - **Framework Preset:** Other
   - **Build Command:** leave empty
   - **Output Directory:** leave empty (the repository root)
   - **Install Command:** leave empty
4. Click **Deploy**. Vercel gives you a URL like `career-pathfinder.vercel.app`.

Every push to `main` redeploys automatically. Pull requests get their own preview URL.

### 3. Custom domain (optional)
In the Vercel project, open **Settings → Domains** and add something like `pathfinder.yourdomain.com`. Vercel shows the DNS record to create.

> **Plan note:** Vercel's Hobby plan is meant for personal, non-commercial use. If this runs under a company account or company domain, check Vercel's current terms; the Pro plan may be required. GitHub Pages, Netlify, and Cloudflare Pages also host static sites like this one with no code changes.

---

## Run it locally

No install needed. Any static file server works:

```bash
cd career-pathfinder
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly from disk also works in most browsers.

---

## Branding

- **Colors and fonts:** edit `css/brand.css`. The current values are placeholders. Replace them with Diamondback Energy's official brand values. Dark-mode values are in the same file.
- **Logo:** add `assets/logo.svg` (see `assets/LOGO-GOES-HERE.md`). Until it exists, the header shows a text wordmark.
- **Fonts** load from Google Fonts. To use the company typeface instead, change the `<link>` in `index.html` and the `--f-` variables in `brand.css`.
- Confirm the use of the Diamondback name and logo with Corporate Communications before launch.

---

## Security and privacy

- No data leaves the student's browser. There are no forms, accounts, analytics, or API calls.
- `vercel.json` sets a Content Security Policy that only allows the site's own scripts plus Google Fonts.
- If you add analytics (for example Vercel Web Analytics), update the CSP in `vercel.json` to allow it, and review student-privacy requirements (FERPA, district policy) first.
- To block the site from being embedded in other websites, add `frame-ancestors 'self'` to the CSP. To embed it in a company page, add that page's domain instead.

---

## Data sources and attribution

- Occupation requirements come from **O\*NET OnLine** (U.S. Department of Labor, Employment and Training Administration), used under the **CC BY 4.0** license. The attribution line in the page footer must stay.
- AP credit note: Texas HB 1992 (2015) — public institutions can't require more than a 3 for lower-division credit unless the chief academic officer justifies a higher score.
- Texas Core Curriculum: 42 semester credit hours in nine component areas, transferable as a block between Texas public institutions.
- Course-to-knowledge mapping, typical training paths, and college course equivalents are **planning estimates**, and the page says so. Have a counselor review them each school year. See `docs/UPDATING-DATA.md`.

O\*NET data was pulled in October 2026. O\*NET updates its database a few times a year; re-check the profiles annually.
