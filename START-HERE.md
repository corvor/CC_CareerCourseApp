# CC_CourseCareerApp — Course-to-Career Pathfinder

Career Connections planning tool. High school students enter their coursework, pick an occupation, and see O\*NET requirements, which knowledge areas they've started, the training they'd take after high school, and AP or dual credit that may already count.

## What's in this folder

| Folder | What it is | Who it's for |
|---|---|---|
| **Demo/** | `CourseCareerApp-Demo.html`, the whole app in one file | Anyone. Double-click to try it. |
| **App/** | Full source code, ready for GitHub and Vercel | IT / developers |
| **Mockups/** | Screenshots at desktop and phone sizes, light and dark mode | Review and presentations |
| **.vscode/** | VS Code settings so the app runs with one click | Anyone using VS Code |

---

## 1. Run the demo (no setup)

1. Unzip `CC_CourseCareerApp.zip` (right-click → **Extract All** on Windows, double-click on Mac).
2. Open the **Demo** folder.
3. Double-click **CourseCareerApp-Demo.html**. It opens in your web browser.

It works offline. With an internet connection it also loads the web fonts; without one, it uses your computer's fonts.

Things to try:
- Click **Start with my own**, paste a course list into the box, and click **Match my courses**.
- Change the **Occupation** menu: try Electricians, Registered Nurses, or Petroleum Engineers.
- Select an AP course, then pick a score under **AP exam scores** and watch the college credit section update.
- Click **Print or save as PDF** to see the student report.

Your selections are saved in your own browser only. **Clear all** resets them.

---

## 2. Open and run the full app in VS Code

1. Install VS Code if needed: https://code.visualstudio.com
2. In VS Code: **File → Open Folder…** and choose the **CC_CourseCareerApp** folder (the whole folder, not just App).
3. If VS Code asks whether you trust the authors, click **Yes**.
4. A pop-up offers to install the recommended extension, **Live Server**. Click **Install**.
   (Or open the Extensions panel, search "Live Server" by Ritwick Dey, and install it.)
5. Click **Go Live** in the blue status bar at the bottom right. The app opens at `http://127.0.0.1:5500`.
6. Edit any file in **App/** and save. The browser refreshes on its own.

**No Live Server?** Use the built-in task instead: **Terminal → Run Task… → Run app (Python)**, then open http://localhost:8000. This needs Python installed.

**Simplest option:** double-click `App/index.html`. The app runs straight from the file too.

### Where to make common changes
| Change | File |
|---|---|
| Brand colors and fonts | `App/css/brand.css` |
| Logo | add `App/assets/logo.svg` (see `App/assets/LOGO-GOES-HERE.md`) |
| Add or edit occupations | `App/js/data-occupations.js` |
| Add or edit high school courses | `App/js/data-courses.js` |
| Step-by-step data guide | `App/docs/UPDATING-DATA.md` |

The Demo file is a snapshot. After you change files in App, the demo doesn't update; share the App folder (or the live site) instead.

---

## 3. Put it online (for IT)

Push the **contents of the App folder** to a GitHub repository, then import that repository into Vercel with all build settings left blank. Full steps, security notes, and plan details are in **App/README.md**.

---

## Before launch

- [ ] Replace the placeholder colors in `App/css/brand.css` with Diamondback Energy's official brand values
- [ ] Add the official logo as `App/assets/logo.svg`
- [ ] Get Corporate Communications approval for using the Diamondback name and logo
- [ ] Have a counselor review the course list and training paths
- [ ] Confirm the hosting plan (Vercel Hobby is for non-commercial use; see App/README.md)

## Data sources

Occupation requirements come from O\*NET OnLine (U.S. Department of Labor, Employment and Training Administration), used under CC BY 4.0. Course matching, training paths, and college credit equivalents are planning estimates and are labeled that way in the app. O\*NET data was pulled October 2026.
