# Branding

## Colors and fonts
Edit **`src/styles/brand.css`**. It's the only file with brand values. The current colors are placeholders chosen for an energy-company look. Replace them with Diamondback Energy's official values from Corporate Communications or Marketing.

| Variable | Used for |
|---|---|
| `--brand-primary` | Header band, primary buttons, selected course chips |
| `--brand-primary-ink` | Text on the header band |
| `--brand-accent` | Header underline, focus ring, callout rules |
| `--ok`, `--mid`, `--gap` | Status colors (strong / started / not yet). Keep these readable rather than on-brand. |

Dark-mode values are in the same file, inside `@media (prefers-color-scheme: dark)`.

Fonts load from Google Fonts in `index.html`. To use the company typeface, replace that `<link>` (or add `@font-face` rules for self-hosted files in `public/fonts/`) and update the `--f-display`, `--f-body`, and `--f-mono` variables.

## Logo
1. Save the official logo as **`public/logo.svg`**. Use the version made for dark backgrounds, since the header band is dark.
2. A PNG works too: save it as `public/logo.png` and change `logo.svg` to `logo.png` in `src/components/BrandHeader.jsx`.
3. It displays 36px tall. Width scales automatically.

Until the file exists, the header shows "DIAMONDBACK ENERGY" as text.

## Favicon
Replace `public/favicon.svg` with the approved icon.

## Approval
Confirm with Corporate Communications that the Diamondback name, logo, and "Career Connections" program name are approved for this use before launch.
