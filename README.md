# Wheel of Misfortune + CVE Name Generator

Two tongue-in-cheek static sites on Cloudflare Pages:

- **wheel.bardsec.com**: a tap-to-spin wheel of real and "forecast" software vulnerabilities
- **cvegenerator.bardsec.com**: one click generates a branded made-up vulnerability (name, logo, CVE ID, CVSS, website, vendor response, no patch)

## Structure

### Wheel (`public/`)

Everything deployable lives in `public/` — plain static HTML/CSS/JS, no build step, no dependencies.

| File | Purpose |
|------|---------|
| `public/index.html` | Page shell |
| `public/styles.css` | Styles (dark theme, mobile-first) |
| `public/app.js` | Canvas wheel, spin animation, tick sound, result card |
| `public/vulns.js` | **The wheel's contents — edit this to add/remove entries** |
| `public/_headers` | Cloudflare Pages security headers (strict CSP, no inline scripts) |
| `public/favicon.svg` | Icon |
| `public/og.png` | Link-preview image (rendered from `og/wheel.html`) |

Each entry in `vulns.js` has a `kind`: `real` (actual CVE), `scheduled` (e.g. Y2K38), or `forecast` (joke, with a fake `FCST-` ID). The wheel resizes to any number of entries; keep `label` ≤ 16 characters.

### CVE Name Generator (`cvegen/`)

| File | Purpose |
|------|---------|
| `cvegen/public/generator.js` | **Word lists and naming patterns.** Each vuln comes from a random 32-bit seed, so a share code always reproduces the same vuln. Shared by the browser and the Function. |
| `cvegen/public/app.js` | Form, result card, copy / copy-link |
| `cvegen/public/index.html`, `styles.css`, `_headers`, `favicon.svg`, `og.png` | Page, styles, security headers, icon, preview image |
| `cvegen/functions/index.js` | Pages Function: for `/?v=<code>` links, rewrites the Open Graph / Twitter tags so Teams/Slack previews show that specific vulnerability |

Shared links use `?v=<code>` (the seed in base36) rather than a `#` fragment, because link-preview bots never see the fragment.
The generator never outputs a real vuln name (see `REAL_NAMES` in `generator.js`).

### Link-preview images (`og/`)

`og/wheel.html` and `og/cvegen.html` are the designs for the 1200×630 `og.png` images.
Run `./og/render.sh` (headless Chrome, macOS) after changing them, the wheel's contents or either site's styles, then commit the PNGs.

## Local preview

```bash
cd public && python3 -m http.server 8765         # wheel → http://localhost:8765
cd cvegen/public && python3 -m http.server 8766  # generator → http://localhost:8766
```

The static server doesn't run the Pages Function, so preview-tag rewriting only works once deployed.

## Deploy

Every push to `main` deploys both sites with Wrangler (`.github/workflows/deploy.yml`). It can
also be run by hand from the Actions tab. Both projects are in the edtechirl Cloudflare account,
with proxied CNAMEs in the bardsec.com zone.

| Site | Pages project | Deploys |
|------|---------------|---------|
| wheel.bardsec.com | `wheel-of-misfortune` (`wheel-of-misfortune-c42.pages.dev`) | `public/` |
| cvegenerator.bardsec.com | `cve-name-generator` (`cve-name-generator.pages.dev`) | `cvegen/public/` + `cvegen/functions/` (run from `cvegen/`) |

- Repo secrets: `CLOUDFLARE_API_TOKEN` (Pages: Edit), `CLOUDFLARE_ACCOUNT_ID`

## Environment variables

None — fully static.
