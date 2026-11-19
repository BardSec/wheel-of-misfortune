# Wheel of Misfortune

A tongue-in-cheek, tap-to-spin wheel of real and "forecast" software vulnerabilities, hosted at **wheel.bardsec.com** on Cloudflare Pages.

## Structure

Everything deployable lives in `public/` — plain static HTML/CSS/JS, no build step, no dependencies.

| File | Purpose |
|------|---------|
| `public/index.html` | Page shell |
| `public/styles.css` | Styles (dark theme, mobile-first) |
| `public/app.js` | Canvas wheel, spin animation, tick sound, result card |
| `public/vulns.js` | **The wheel's contents — edit this to add/remove entries** |
| `public/_headers` | Cloudflare Pages security headers (strict CSP, no inline scripts) |
| `public/favicon.svg` | Icon |

Each entry in `vulns.js` has a `kind`: `real` (actual CVE), `scheduled` (e.g. Y2K38), or `forecast` (joke, with a fake `FCST-` ID). The wheel resizes to any number of entries; keep `label` ≤ 16 characters.

## Local preview

```bash
cd public && python3 -m http.server 8765
# open http://localhost:8765
```

## Deploy

Every push to `main` deploys automatically: `.github/workflows/deploy.yml` uploads `public/`
to the Cloudflare Pages project `wheel-of-misfortune` with Wrangler. It can also be run by hand
from the Actions tab.

- Pages project: `wheel-of-misfortune` (edtechirl Cloudflare account) → `wheel-of-misfortune-c42.pages.dev`
- Custom domain: `wheel.bardsec.com` (proxied CNAME in the bardsec.com zone)
- Repo secrets: `CLOUDFLARE_API_TOKEN` (Pages: Edit), `CLOUDFLARE_ACCOUNT_ID`

## Environment variables

None — fully static.
