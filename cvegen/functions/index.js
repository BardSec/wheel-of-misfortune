// Cloudflare Pages Function for "/".
// For shared links like /?n=Andy, rewrite the page's link-preview tags so Teams/Slack/etc.
// show that person's generated vulnerability. Everything else is served unchanged.
import "../public/generator.js"; // sets globalThis.CVEGen (same code the browser runs)

export async function onRequestGet({ request, next }) {
  const response = await next();
  const name = (new URL(request.url).searchParams.get("n") || "").trim().slice(0, 60);
  if (!name || !(response.headers.get("content-type") || "").includes("text/html")) {
    return response;
  }

  const v = globalThis.CVEGen.generate(name);
  const title = `${name}'s vulnerability: ${v.name}`;
  const description = `${v.cve} · CVSS ${v.cvss}. ${v.description} Vendor response: ${v.vendor}`;
  const url = `https://cvegenerator.bardsec.com/?n=${encodeURIComponent(name)}`;

  // setAttribute/setInnerContent escape their input, so the name can't inject markup.
  const set = (value) => ({ element: (el) => el.setAttribute("content", value) });
  const rewritten = new HTMLRewriter()
    .on("title", { element: (el) => el.setInnerContent(`${title} | CVE Name Generator`) })
    .on('meta[property="og:title"]', set(title))
    .on('meta[name="twitter:title"]', set(title))
    .on('meta[property="og:description"]', set(description))
    .on('meta[name="twitter:description"]', set(description))
    .on('meta[name="description"]', set(description))
    .on('meta[property="og:url"]', set(url))
    .transform(response);

  // Different names produce different HTML; don't let a cache serve one name's tags for another.
  const out = new Response(rewritten.body, rewritten);
  out.headers.set("Cache-Control", "no-store");
  return out;
}
