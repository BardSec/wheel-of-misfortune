// Cloudflare Pages Function for "/".
// For shared links like /?v=k3x9a1, rewrite the page's link-preview tags so Teams/Slack/etc.
// show that specific generated vulnerability. Everything else is served unchanged.
import "../public/generator.js"; // sets globalThis.CVEGen (same code the browser runs)

export async function onRequestGet({ request, next }) {
  const response = await next();
  const seed = globalThis.CVEGen.decodeSeed(new URL(request.url).searchParams.get("v"));
  if (seed == null || !(response.headers.get("content-type") || "").includes("text/html")) {
    return response;
  }

  const v = globalThis.CVEGen.generate(seed);
  const title = `${v.logo} ${v.name} (${v.cve})`;
  const description = `CVSS ${v.cvss}. ${v.description} Vendor response: ${v.vendor}`;
  const url = `https://cvegenerator.bardsec.com/?v=${v.code}`;

  // setAttribute/setInnerContent escape their input.
  const set = (value) => ({ element: (el) => el.setAttribute("content", value) });
  const rewritten = new HTMLRewriter()
    .on("title", { element: (el) => el.setInnerContent(`${v.name} | CVE Name Generator`) })
    .on('meta[property="og:title"]', set(title))
    .on('meta[name="twitter:title"]', set(title))
    .on('meta[property="og:description"]', set(description))
    .on('meta[name="twitter:description"]', set(description))
    .on('meta[name="description"]', set(description))
    .on('meta[property="og:url"]', set(url))
    .transform(response);

  // Each code produces different HTML; don't let a cache serve one code's tags for another.
  const out = new Response(rewritten.body, rewritten);
  out.headers.set("Cache-Control", "no-store");
  return out;
}
