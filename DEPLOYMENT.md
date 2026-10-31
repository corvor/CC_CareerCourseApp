# Deployment

The app builds to static files, so it doesn't need a Node server in production. Node is used only to install packages and run the build.

```bash
npm install
npm run build     # output: dist/
```

**Settings every host needs**

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output / publish directory | `dist` |
| Node version | 22 (18.18 or newer works) |
| Root / app location | the folder that contains `package.json` |

> **About Vercel:** the free Hobby plan is for personal, non-commercial use. For a company project, use one of the options below or a paid Vercel plan. Confirm current terms with IT or legal before launch, because hosting plans change.

---

## Option A: Azure Static Web Apps (recommended if the company uses Microsoft)

The Free plan includes 100 GB of bandwidth per month and 2 custom domains, and keeps the site inside the company's Azure tenant, security, and billing.

1. In the Azure portal: **Create a resource → Static Web App**.
2. Plan type **Free**. Source **GitHub**, then pick the repository and the `main` branch.
3. Build presets: **React**. Use these build details:
   - App location: `/` (or the subfolder that holds `package.json`)
   - Api location: *(leave empty)*
   - Output location: `dist`
4. Create. Azure adds a GitHub Actions workflow to the repo and deploys on every push to `main`.
5. Security headers come from `public/staticwebapp.config.json`, which is copied into `dist/`.

To limit the site to company sign-in (for an internal pilot), see Azure's docs on Static Web Apps authentication. Some role and access features need the Standard plan.

## Option B: Netlify

The Free plan can be used for commercial projects (you just can't resell the hosting).

1. Sign in at https://app.netlify.com with GitHub → **Add new site → Import an existing project**.
2. Pick the repository. Netlify reads `netlify.toml`, so the build command and `dist` folder fill in automatically.
3. Deploy. Every push to `main` redeploys, and pull requests get preview links.
4. Security headers come from `public/_headers`.

## Option C: Cloudflare Pages

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the repository. Framework preset **React (Vite)**, build command `npm run build`, output directory `dist`.
3. Under **Environment variables**, add `NODE_VERSION` = `22`.
4. Deploy. Security headers come from `public/_headers`.

## Option D: The company's own web server

1. Run `npm run build`.
2. Copy everything inside `dist/` to the web server folder (IIS, Apache, nginx, or an internal static host).
3. The build uses relative paths (`base: "./"` in `vite.config.js`), so it works from a sub-folder such as `https://intranet.example.com/career-pathfinder/`.
4. Ask IT to add the security headers listed in `public/_headers` to the server config.

## Option E: GitHub Pages (only with IT approval)

GitHub's docs say Pages isn't meant to run an online business. A free student tool doesn't sell anything, but because this runs under a company, get IT's sign-off first. If approved, use the **GitHub Actions** Pages source with the same build command, and publish `dist/`.

---

## Custom domain

Every host above supports a custom domain such as `pathfinder.example.com`. The host shows the DNS record IT needs to create.

## Before going live

- [ ] Official brand colors and logo in place (see `docs/BRANDING.md`)
- [ ] Corporate Communications approval for the Diamondback name and logo
- [ ] Counselor review of courses and training paths
- [ ] `npm test` and `npm run build` pass (GitHub Actions runs both on every push)
- [ ] Hosting plan confirmed with IT
