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

Cloudflare Pages, direct upload of `public/`:

```bash
npx wrangler pages deploy public --project-name wheel-of-misfortune
```

Custom domain `wheel.bardsec.com` is attached in the Pages project settings.

## Environment variables

None — fully static.
