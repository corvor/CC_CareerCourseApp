# CC_CourseCareerApp: Course-to-Career Pathfinder

Career Connections planning tool, built in **React with Node.js**. High school students enter their coursework, pick an occupation, and see O\*NET requirements, which knowledge areas they've started, the training they'd take after high school, and AP or dual credit that may already count.

## What's in this folder

| Folder | What it is | Who it's for |
|---|---|---|
| **App/** | The React + Node project. This is what goes in your git repo. | You, IT, developers |
| **Demo/** | `CourseCareerApp-Demo.html`, a built copy of the app in one file | Anyone. Double-click to try it. |
| **Mockups/** | Screenshots at desktop and phone sizes, light and dark mode | Review and presentations |

---

## 1. Try the demo (no setup)

Open **Demo** and double-click **CourseCareerApp-Demo.html**. It runs in your browser with nothing to install, and works offline.

---

## 2. Run the React app in VS Code

**One-time setup:** install **Node.js 22 LTS** from https://nodejs.org (choose the LTS version). To check it worked, open a terminal and run `node -v`. You should see `v22` or higher (anything from 18.18 up works).

1. In VS Code: **File → Open Folder…** and choose the **App** folder.
2. Open a terminal: **Terminal → New Terminal**.
3. Install packages (first time only, takes a minute):
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
   Your browser opens to http://localhost:5173. Edit any file in `src/`, save, and the page updates right away.
5. Stop the app with **Ctrl+C** in the terminal.

The same commands are under **Terminal → Run Task…** if you prefer menus.

Other commands:
| Command | What it does |
|---|---|
| `npm test` | Checks the matching logic and the data files |
| `npm run build` | Creates the `dist/` folder to put on a web host |
| `npm run preview` | Shows the `dist/` build locally before deploying |

**If `npm install` fails on a work laptop**, the company network may block the npm registry. Ask IT to allow `registry.npmjs.org` or to point npm at the company's package mirror.

---

## 3. Add it to your git project

Copy **everything inside App/** (including the hidden `.gitignore`, `.github`, and `.vscode` items) into the root of your repository. Then:

```bash
npm install
git add .
git commit -m "Add Course-to-Career Pathfinder (React)"
git push
```

`node_modules/` and `dist/` are already in `.gitignore`. **Do commit `package-lock.json`** (created by `npm install`) so everyone gets the same package versions.

GitHub Actions (`.github/workflows/ci.yml`) runs the tests and a build on every push.

---

## 4. Hosting for a work project

Vercel's free plan is for non-commercial use only. `App/docs/DEPLOYMENT.md` has step-by-step setup for options that suit a company:
- **Azure Static Web Apps**, the best fit if Diamondback uses Microsoft 365 or Azure
- **Netlify** or **Cloudflare Pages**, whose free plans allow commercial use
- **Diamondback's own web server**: run `npm run build` and copy the `dist/` folder

Config files for Azure, Netlify, and Cloudflare are already included.

---

## Where to make common changes

| Change | File |
|---|---|
| Brand colors and fonts | `App/src/styles/brand.css` |
| Logo | add `App/public/logo.svg` (see `App/docs/BRANDING.md`) |
| Occupations | `App/src/data/occupations.js` |
| High school courses | `App/src/data/courses.js` |
| Matching and scoring logic | `App/src/lib/pathfinder.js` |
| Page sections | `App/src/components/` |

## Before launch
- [ ] Official brand colors and logo
- [ ] Corporate Communications approval for the Diamondback name and logo
- [ ] Counselor review of courses and training paths
- [ ] Hosting option chosen with IT

The Demo file is a snapshot. It doesn't change when you edit `App/`.

Occupation data comes from O\*NET OnLine (USDOL/ETA), used under CC BY 4.0, pulled October 2026.
